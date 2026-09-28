/**
 * MatBoard — sanal manipülatif matı (DESIGN §12). KONTROLLÜ bileşen: durum dışarıda tutulur,
 * her kullanıcı eylemi `onChange(next)` + `onEvent(ev)` ile bildirilir. API: ./README.md.
 *
 * Etkileşim üç eşdeğer yolla (useDragDrop deseni): sürükle (pointer) · dokun-dokun (öğeye
 * dokun → bölgeye/kaba/çöpe dokun) · klavye (Tab bölge; + / − ekle/çıkar; Enter "Tamam").
 */
import { useCallback, type KeyboardEvent } from 'react';
import type { ActUnit } from '../../content/types';
import { useT } from '../../i18n';
import { useA11y } from '../../state/A11yContext';
import { useDragDrop } from '../useDragDrop';
import { Dot, type ItemBind } from './Counters';
import { HundredSquare, TenRod } from './Blocks';
import { MatchRows } from './MatchRows';
import { applyOp, type MatOp } from './ops';
import { Zone, ZoneHead, type ZoneCtx } from './Zone';
import { emptyZone, zoneTotal, type MatEvent, type MatState, type MatZone } from './matState';
import './mat.css';

export interface MatBoardProps {
  zones: MatZone[];
  state: MatState;
  onChange: (next: MatState) => void;
  units: ActUnit[];
  /** edit: çocuk düzenler · watch: yalnız izleme (Rehber / hikâyeye koy). */
  mode?: 'edit' | 'watch';
  /** false → tüm sayılar "?" (sayma stratejisini zorlar). */
  showCounts?: boolean;
  /** Birim adları (varsayılan: birlik/onluk/yüzlük). */
  labels?: Partial<Record<ActUnit, string>>;
  onEvent?: (e: MatEvent) => void;
  /** Bölgede Enter (seçim yokken) → "Tamam". */
  onEnter?: () => void;
  supply?: boolean;
  trash?: boolean;
  /** Akıllı tahta ölçeği. */
  big?: boolean;
  className?: string;
}

export function MatBoard({
  zones,
  state,
  onChange,
  units,
  mode = 'edit',
  showCounts = true,
  labels,
  onEvent,
  onEnter,
  supply = true,
  trash = true,
  big,
  className,
}: MatBoardProps) {
  const t = useT();
  const { announce } = useA11y();
  const locked = mode === 'watch';
  const unitLabels = { one: labels?.one ?? t('mat_one'), ten: labels?.ten ?? t('mat_ten'), hundred: labels?.hundred ?? t('mat_hundred') };
  const byId = (id: string) => zones.find((z) => z.id === id);

  const say = useCallback(
    (next: MatState, zoneId: string) => {
      const z = zones.find((x) => x.id === zoneId);
      if (!z) return;
      const hidden = !showCounts || z.hideCount || (z.kind === 'box' && !next[zoneId]?.open);
      announce?.(`${z.label}: ${hidden ? t('mat_changed') : zoneTotal(next[zoneId])}${z.unitLabel ? ` ${z.unitLabel}` : ''}`);
    },
    [zones, showCounts, announce, t],
  );

  const run = useCallback(
    (op: MatOp) => {
      if (locked) return;
      const r = applyOp(state, zones, op);
      if (r.fail === 'needBreak') announce?.(t('mat_need_break'));
      if (!r.events.length) return;
      onChange(r.next);
      r.events.forEach((e) => onEvent?.(e));
      say(r.next, r.events[r.events.length - 1].zone);
    },
    [locked, state, zones, onChange, onEvent, say, announce, t],
  );

  const dnd = useDragDrop({
    targetOrder: [...zones.map((z) => z.id), ...(trash && !locked ? ['@trash'] : [])],
    onDrop: (item, target) => {
      const cut = item.lastIndexOf(':');
      const from = item.slice(0, cut);
      const unit = item.slice(cut + 1) as ActUnit;
      let to = target;
      const tz = byId(target);
      if (tz?.kind === 'group') {
        if (tz.count != null) return announce?.(t('mat_pick_plate'));
        to = `${target}#new`;
      }
      run({ op: 'move', from, to, unit });
    },
    onTargetTap: (target) => {
      if (target.includes('#')) {
        const [zone, p] = target.split('#');
        run({ op: 'plate', zone, plate: p === 'new' ? 'new' : Number(p) });
      }
    },
  });

  const bind: ItemBind = (id, label) => {
    const p = dnd.itemProps(id, label);
    return {
      'data-dnd-item': id,
      onPointerDown: p.onPointerDown,
      onClick: (e: React.MouseEvent<HTMLElement>) => {
        e.stopPropagation();
        p.onClick(e);
      },
    };
  };

  const smallest: ActUnit = 'one';
  const dropProps = (id: string): Record<string, unknown> => {
    const tp = dnd.targetProps(id);
    return {
      ...tp,
      role: 'button',
      tabIndex: 0,
      onKeyDown: (e: KeyboardEvent<HTMLElement>) => {
        tp.onKeyDown(e);
        if (locked) return;
        const isPlate = id.includes('#');
        const zoneId = id.split('#')[0];
        if (e.key === '+' || e.key === '=' || e.key === 'Add') {
          e.preventDefault();
          if (isPlate) tp.onClick();
          else if (byId(zoneId)?.kind !== 'group' && id !== '@trash') run({ op: 'add', zone: zoneId, unit: smallest, n: 1 });
        } else if (e.key === '-' || e.key === '−' || e.key === 'Subtract') {
          e.preventDefault();
          if (!isPlate && id !== '@trash') run({ op: 'remove', zone: zoneId, unit: smallest, n: 1 });
        } else if (e.key === 'Enter' || (e.key === ' ' && (isPlate || dnd.selected))) {
          e.preventDefault();
          if (dnd.selected || isPlate) tp.onClick();
          else onEnter?.();
        }
      },
    };
  };

  const ctx: ZoneCtx = {
    units,
    showCounts,
    locked,
    bind: locked ? undefined : bind,
    dropProps,
    run,
    selected: dnd.selected,
    unitLabels,
    knownFor: (z) => {
      const w = z.target?.with ?? [];
      return { n: w.reduce((a, id) => a + zoneTotal(state[id]), 0), tone: byId(w[0] ?? '')?.tone ?? 2 };
    },
  };

  const rows = zones.filter((z) => z.kind === 'row');
  const others = zones.filter((z) => z.kind !== 'row');
  const matched = rows.length === 2 && !!state[rows[0].id]?.matched && !!state[rows[1].id]?.matched;

  return (
    <div className={`mat${big ? ' mat--big' : ''}${locked ? ' mat--watch' : ''}${className ? ` ${className}` : ''}`}>
      {rows.length === 2 && (
        <div className="mat-zone mat-zone--rows">
          <MatchRows
            a={rows[0]}
            b={rows[1]}
            za={state[rows[0].id] ?? emptyZone()}
            zb={state[rows[1].id] ?? emptyZone()}
            bind={ctx.bind}
            matched={matched}
            unitLabels={unitLabels}
            head={(z) => (
              <div className="mat-rows__headdrop" data-zone={z.id} {...dropProps(z.id)} role="group" aria-label={`${z.label}: ${showCounts && !z.hideCount ? zoneTotal(state[z.id]) : '?'}`}>
                <ZoneHead zone={z} z={state[z.id] ?? emptyZone()} ctx={ctx} />
              </div>
            )}
          />
          {!locked && (
            <div className="mat-rows__actions">
              <button type="button" className="btn btn--soft" aria-pressed={matched} onClick={() => run({ op: 'match', zones: [rows[0].id, rows[1].id], on: !matched })}>
                {matched ? t('mat_unmatch') : t('mat_match')}
              </button>
            </div>
          )}
        </div>
      )}
      <div className="mat__zones">
        {(rows.length === 2 ? others : zones).map((z) => (
          <Zone key={z.id} zone={z} z={state[z.id] ?? emptyZone()} ctx={ctx} />
        ))}
      </div>
      {!locked && (supply || trash) && (
        <div className="mat__tray">
          {supply && (
            <div className="mat__supply" aria-label={t('mat_supply')}>
              <span className="mat__traylabel">{t('mat_supply')}</span>
              {units.includes('one') && (
                <span className="mat__src" title={unitLabels.one}>
                  <Dot tone={3} bind={bind('@supply:one', unitLabels.one)} selected={dnd.selected === '@supply:one'} />
                </span>
              )}
              {units.includes('ten') && (
                <span className="mat__src" title={unitLabels.ten}>
                  <TenRod tone={3} bind={bind('@supply:ten', unitLabels.ten)} selected={dnd.selected === '@supply:ten'} />
                </span>
              )}
              {units.includes('hundred') && (
                <span className="mat__src" title={unitLabels.hundred}>
                  <HundredSquare tone={3} bind={bind('@supply:hundred', unitLabels.hundred)} selected={dnd.selected === '@supply:hundred'} />
                </span>
              )}
            </div>
          )}
          {trash && (
            <div className="mat__trash" {...dropProps('@trash')} aria-label={t('mat_trash')}>
              <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true">
                <path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>{t('mat_trash')}</span>
            </div>
          )}
        </div>
      )}
      {!locked && <p className="kbd-hint">{t('mat_kbd')}</p>}
      {dnd.ghost}
    </div>
  );
}
