/**
 * Tek bölge: başlık (ad etiketi + büyük canlı sayı + ≥44 px işlem düğmeleri) ve gövde
 * (yığın / gizli kutu / kaplar). Satır (row) bölgeleri yalnız başlığı buradan alır; gövdeleri
 * MatchRows'ta hizalı çizilir.
 */
import type { ReactNode } from 'react';
import type { ActUnit } from '../../content/types';
import { useT } from '../../i18n';
import type { ItemBind } from './Counters';
import { StackView } from './Blocks';
import { GroupPlates } from './GroupPlates';
import { MysteryBox } from './MysteryBox';
import type { MatOp } from './ops';
import { zoneTotal, type MatZone, type ZoneState } from './matState';

export interface ZoneCtx {
  units: ActUnit[];
  showCounts: boolean;
  locked: boolean;
  bind?: ItemBind;
  dropProps: (id: string) => Record<string, unknown>;
  run: (op: MatOp) => void;
  /** Seçili öğe (useDragDrop): "ela:ten" gibi. */
  selected: string | null;
  unitLabels: { one: string; ten: string; hundred: string };
  /** Hedef çizgisindeki bilinen miktar ve tonu (box). */
  knownFor: (z: MatZone) => { n: number; tone: number };
}

function Btn({ onClick, children, label, disabled, soft }: { onClick: () => void; children: ReactNode; label: string; disabled?: boolean; soft?: boolean }) {
  return (
    <button type="button" className={`mat-btn${soft ? ' mat-btn--soft' : ''}`} onClick={onClick} aria-label={label} title={label} disabled={disabled}>
      {children}
    </button>
  );
}

export function ZoneHead({ zone, z, ctx }: { zone: MatZone; z: ZoneState; ctx: ZoneCtx }) {
  const t = useT();
  const total = zoneTotal(z);
  const hidden = !ctx.showCounts || zone.hideCount || (zone.kind === 'box' && !z.open);
  const { units, run } = ctx;
  const id = zone.id;
  const sel = ctx.selected?.startsWith(`${id}:`) ? (ctx.selected.split(':')[1] as ActUnit) : null;
  const canEdit = !ctx.locked && !zone.locked;
  const pile = zone.kind !== 'group';
  const addSteps: { unit: ActUnit; n: number; txt: string }[] = [{ unit: 'one', n: 1, txt: '+1' }];
  if (units.length === 1) addSteps.push({ unit: 'one', n: 5, txt: '+5' });
  if (units.includes('ten')) addSteps.push({ unit: 'ten', n: 1, txt: '+10' });
  if (units.includes('hundred')) addSteps.push({ unit: 'hundred', n: 1, txt: '+100' });
  const src = zone.fillFrom;
  // fillFrom varsa ekleme o bölgeden TAŞIR, çıkarma oraya geri koyar (hikâyedeki "verdi" eylemi).
  const add = (unit: ActUnit, n: number) => {
    if (!src) return run({ op: 'add', zone: id, unit, n });
    run({ op: 'move', from: src, to: id, unit, n, auto: true });
  };
  const sub = (unit: ActUnit) => {
    if (src) return run({ op: 'move', from: id, to: src, unit, auto: true });
    if (unit === 'one' && z.o === 0) return run({ op: 'break', zone: id, unit: z.t > 0 ? 'ten' : 'hundred' });
    run({ op: 'remove', zone: id, unit, n: 1 });
  };
  return (
    <div className={`mat-zone__head mat-tone-${zone.tone ?? 1}-soft`}>
      <span className={`mat-zone__swatch mat-tone-${zone.tone ?? 1}`} aria-hidden="true" />
      <span className="mat-zone__name">{zone.label}</span>
      <span className="mat-zone__count" data-numeric="true" aria-hidden="true">
        {hidden ? '?' : total}
      </span>
      {zone.unitLabel && <span className="mat-zone__unit">{zone.unitLabel}</span>}
      {canEdit && (
        <span className="mat-zone__ops">
          {pile &&
            addSteps.map((a) => (
              <Btn key={a.txt} label={t('mat_add', { n: a.n * (a.unit === 'ten' ? 10 : a.unit === 'hundred' ? 100 : 1) })} onClick={() => add(a.unit, a.n)}>
                {a.txt}
              </Btn>
            ))}
          {pile && (
            <Btn label={t('mat_remove', { n: 1 })} disabled={total === 0} onClick={() => sub('one')}>
              −1
            </Btn>
          )}
          {pile && units.includes('ten') && (
            <Btn label={t('mat_remove', { n: 10 })} disabled={z.t === 0} onClick={() => sub('ten')}>
              −10
            </Btn>
          )}
          {(sel === 'ten' || sel === 'hundred') && (
            <Btn soft label={t(sel === 'ten' ? 'mat_break_ten' : 'mat_break_hundred')} onClick={() => run({ op: 'break', zone: id, unit: sel })}>
              {t('mat_break')}
            </Btn>
          )}
          {units.includes('ten') && z.o >= 10 && (
            <Btn soft label={t('mat_make_ten')} onClick={() => run({ op: 'make', zone: id, unit: 'ten' })}>
              {t('mat_make_ten')}
            </Btn>
          )}
          {units.includes('hundred') && z.t >= 10 && (
            <Btn soft label={t('mat_make_hundred')} onClick={() => run({ op: 'make', zone: id, unit: 'hundred' })}>
              {t('mat_make_hundred')}
            </Btn>
          )}
          {zone.kind === 'group' && zone.count != null && (
            <Btn soft label={t(zone.dealFrom ? 'mat_deal' : 'mat_add_each')} onClick={() => run({ op: 'deal', zone: id })}>
              {t(zone.dealFrom ? 'mat_deal' : 'mat_add_each')}
            </Btn>
          )}
          {zone.kind === 'group' && zone.groupSize != null && (
            <Btn soft label={t('mat_make_group', { k: zone.groupSize })} onClick={() => run({ op: 'makeGroup', zone: id })}>
              {t('mat_make_group', { k: zone.groupSize })}
            </Btn>
          )}
          {zone.copyFrom && (
            <Btn soft label={t('mat_copy')} onClick={() => run({ op: 'copy', zone: id })}>
              {t('mat_copy')}
            </Btn>
          )}
          {zone.gatherFrom?.length ? (
            <Btn soft label={t('mat_gather')} onClick={() => run({ op: 'gather', zone: id })}>
              {t('mat_gather')}
            </Btn>
          ) : null}
        </span>
      )}
    </div>
  );
}

export function Zone({ zone, z, ctx }: { zone: MatZone; z: ZoneState; ctx: ZoneCtx }) {
  const total = zoneTotal(z);
  const hidden = !ctx.showCounts || zone.hideCount || (zone.kind === 'box' && !z.open);
  const label = `${zone.label}: ${hidden ? '?' : total}${zone.unitLabel ? ` ${zone.unitLabel}` : ''}`;
  const sel = ctx.selected?.startsWith(`${zone.id}:`) ? (ctx.selected.split(':')[1] as ActUnit) : null;
  const tone = zone.tone ?? 1;
  const bind = ctx.locked || zone.locked ? undefined : ctx.bind;
  const body = (() => {
    switch (zone.kind) {
      case 'box': {
        const k = ctx.knownFor(zone);
        return <MysteryBox zone={zone} z={z} known={k.n} knownTone={k.tone} bind={bind} unitLabels={ctx.unitLabels} selectedUnit={sel} />;
      }
      case 'group':
        return (
          <GroupPlates zone={zone} z={z} bind={bind} targetProps={ctx.dropProps} showCounts={ctx.showCounts} unitLabel={zone.unitLabel ?? ''} locked={ctx.locked || zone.locked} />
        );
      default:
        return <StackView z={z} zoneId={zone.id} tone={tone} bind={bind} selectedUnit={sel} unitLabels={ctx.unitLabels} />;
    }
  })();
  return (
    <section className={`mat-zone mat-zone--${zone.kind}${zone.active ? ' is-active' : ''}`} aria-label={label} data-zone={zone.id}>
      <ZoneHead zone={zone} z={z} ctx={ctx} />
      <div className={`mat-zone__body mat-tone-${tone}-bg`} {...(zone.kind === 'group' ? { 'data-drop': zone.id } : ctx.dropProps(zone.id))} aria-label={zone.kind === 'group' ? undefined : label}>
        {body}
      </div>
    </section>
  );
}
