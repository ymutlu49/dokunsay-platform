/**
 * Karşılaştırma satırları: iki satır AYNI hücre ızgarasında hizalı (onluk çubuk 10 hücre kaplar).
 * "Eşle" → bire bir eşleme çizgileri (≤30 hücrede tek tek, daha büyükte eşleşen bant);
 * eşleşmeyenler kesikli çerçeveyle vurgulanır = FARK (§12.1 ilke 6, match).
 */
import type { ReactNode } from 'react';
import { useT } from '../../i18n';
import { Dot, type ItemBind } from './Counters';
import { StackView, TenRod } from './Blocks';
import type { MatZone, ZoneState } from './matState';
import { zoneTotal } from './matState';

export function MatchRows({
  a,
  b,
  za,
  zb,
  bind,
  head,
  matched,
  unitLabels,
}: {
  a: MatZone;
  b: MatZone;
  za: ZoneState;
  zb: ZoneState;
  bind?: ItemBind;
  head: (z: MatZone) => ReactNode;
  matched: boolean;
  unitLabels: { one: string; ten: string; hundred: string };
}) {
  const t = useT();
  const ta = zoneTotal(za);
  const tb = zoneTotal(zb);
  const min = Math.min(ta, tb);
  const n = Math.max(ta, tb, 10);
  const big = n > 100 || za.h > 0 || zb.h > 0;
  const perCell = n <= 30 && za.t === 0 && zb.t === 0;
  const cols = { gridTemplateColumns: `repeat(${big ? 1 : n}, minmax(0, 1fr))`, maxWidth: big ? undefined : `${n * 34}px` };

  const row = (zone: MatZone, z: ZoneState, total: number, rowIdx: number) => {
    const tone = zone.tone ?? (rowIdx === 1 ? 1 : 2);
    if (big) {
      return (
        <div className={`mat-rows__row mat-tone-${tone}`} data-drop={zone.id} style={{ gridRow: rowIdx }}>
          <StackView z={z} zoneId={zone.id} tone={tone} bind={bind} unitLabels={unitLabels} />
        </div>
      );
    }
    const cells: ReactNode[] = [
      <span key="bg" className={`mat-rows__bg mat-tone-${tone}`} data-drop={zone.id} style={{ gridColumn: '1 / -1', gridRow: rowIdx }} />,
    ];
    let col = 1;
    for (let i = 0; i < z.t; i++, col += 10)
      cells.push(
        <span key={`t${i}`} className="mat-rows__cell" data-drop={zone.id} style={{ gridColumn: `${col} / span 10`, gridRow: rowIdx }}>
          <TenRod tone={tone} bind={bind?.(`${zone.id}:ten`, unitLabels.ten)} />
        </span>,
      );
    for (let i = 0; i < z.o; i++, col += 1)
      cells.push(
        <span key={`o${i}`} className="mat-rows__cell" data-drop={zone.id} style={{ gridColumn: col, gridRow: rowIdx }}>
          <Dot tone={tone} bind={bind?.(`${zone.id}:one`, unitLabels.one)} />
        </span>,
      );
    if (matched && total > min)
      cells.push(<span key="x" className="mat-rows__extra" style={{ gridColumn: `${min + 1} / ${total + 1}`, gridRow: rowIdx }} title={t('mat_unmatched')} />);
    return cells;
  };

  return (
    <div className={`mat-rows${matched ? ' is-matched' : ''}`}>
      <div className="mat-rows__heads">
        {head(a)}
      </div>
      <div className="mat-rows__grid" style={cols} aria-hidden="true">
        {row(a, za, ta, 1)}
        {matched && !big && perCell &&
          Array.from({ length: min }, (_, i) => <span key={`l${i}`} className="mat-rows__link" style={{ gridColumn: i + 1, gridRow: 2 }} />)}
        {matched && !big && !perCell && min > 0 && <span className="mat-rows__band" style={{ gridColumn: `1 / ${min + 1}`, gridRow: 2 }} />}
        {!big && <span className="mat-rows__spacer" style={{ gridColumn: 1, gridRow: 2 }} />}
        {row(b, zb, tb, 3)}
      </div>
      {big && matched && (
        <div className="mat-rows__bars" aria-hidden="true">
          <span className="mat-rows__barmatch" style={{ width: `${(min / Math.max(ta, tb, 1)) * 100}%` }} />
        </div>
      )}
      <div className="mat-rows__heads">{head(b)}</div>
    </div>
  );
}
