/**
 * Gizli kutu (§12.1 ilke 5): bilinmeyen miktar kapaklı "?" kutusuna konur. Kapalıyken
 * içindeki sayaçlar görünmez; yanında HEDEF ÇİZGİSİ görünür: bilinen + kutu = hedef.
 * Çocuk hedef dolana kadar kutuya sayaç ekler (üstüne sayma), sonra kutuyu açar.
 */
import { useT } from '../../i18n';
import { Dot, type ItemBind } from './Counters';
import { StackView } from './Blocks';
import type { MatZone, ZoneState } from './matState';
import { zoneTotal } from './matState';

export function MysteryBox({
  zone,
  z,
  known,
  knownTone,
  bind,
  unitLabels,
  selectedUnit,
}: {
  zone: MatZone;
  z: ZoneState;
  /** Hedef çizgisindeki bilinen miktar (with bölgelerinin toplamı). */
  known: number;
  knownTone: number;
  bind?: ItemBind;
  unitLabels: { one: string; ten: string; hundred: string };
  selectedUnit?: 'one' | 'ten' | 'hundred' | null;
}) {
  const t = useT();
  const tone = zone.tone ?? 1;
  const inBox = zoneTotal(z);
  return (
    <div className="mat-box">
      <div className={`mat-box__body${z.open ? ' is-open' : ''}`}>
        {z.open ? (
          <StackView z={z} zoneId={zone.id} tone={tone} bind={bind} unitLabels={unitLabels} selectedUnit={selectedUnit} hatched />
        ) : (
          <div className="mat-box__lid" aria-label={t('mat_box_closed')}>
            <span className="mat-box__q" aria-hidden="true">
              ?
            </span>
          </div>
        )}
      </div>
      {zone.target && <TargetMeter mode={zone.target.mode} label={zone.target.label} value={zone.target.value} known={known} box={inBox} tone={tone} knownTone={knownTone} />}
    </div>
  );
}

type Cell = 'solid' | 'fill' | 'goal' | 'ref' | 'diff' | 'cross' | 'over' | 'void';

/**
 * Hedef çizgisi (kipler matState.MatZone.target'ta). ≤40 hücrede onluk çerçeve hücreleri,
 * daha büyükte orantılı çubuk (10'luk çentikli). Etiket yalnız HİKÂYEDEKİ sayıyı söyler
 * (hedef / kalan / fark) — kutunun içeriğini asla yazmaz.
 */
export function TargetMeter({
  mode = 'sum',
  label,
  value,
  known,
  box,
  tone,
  knownTone,
}: {
  mode?: 'sum' | 'rest' | 'more' | 'less';
  /** Etiket türü (varsayılan kipten: sum→goal, rest→rest, more/less→diff). */
  label?: 'goal' | 'rest' | 'diff';
  value: number;
  known: number;
  box: number;
  tone: number;
  knownTone: number;
}) {
  const t = useT();
  let goal: number;
  let fill: number;
  let cellOf: (i: number) => Cell;
  if (mode === 'rest') {
    goal = value;
    fill = known;
    cellOf = (i) => (i < Math.min(known, value) ? 'solid' : i < known ? 'over' : i < value ? 'goal' : 'void');
  } else if (mode === 'sum') {
    goal = value;
    fill = known + box;
    cellOf = (i) => (i < known ? 'solid' : i < known + box ? 'fill' : i < value ? 'goal' : 'void');
  } else {
    goal = mode === 'more' ? known + value : Math.max(0, known - value);
    fill = box;
    const top = mode === 'more' ? known + value : known;
    cellOf = (i) => {
      if (i < box) return 'fill';
      if (mode === 'less' && i >= goal && i < top) return 'cross';
      if (i < known) return 'ref';
      if (i < top) return 'diff';
      return 'void';
    };
  }
  const full = fill === goal;
  const over = fill > goal;
  const status = full
    ? t('mat_target_full')
    : over
      ? t('mat_target_over')
      : (label ?? (mode === 'sum' ? 'goal' : mode === 'rest' ? 'rest' : 'diff')) === 'goal'
        ? t('mat_target', { n: value })
        : (label ?? (mode === 'rest' ? 'rest' : 'diff')) === 'rest'
          ? t('mat_rest', { n: value })
          : t('mat_diff', { n: value });
  const cells = Math.max(goal, fill, mode === 'more' ? known + value : known);
  const cls = `mat-meter${full ? ' is-full' : ''}${over ? ' is-over' : ''}`;
  if (cells <= 40) {
    const frames = Math.max(1, Math.ceil(cells / 10));
    return (
      <div className={cls}>
        <span className="mat-meter__label">{status}</span>
        <div className="mat-frames" aria-hidden="true">
          {Array.from({ length: frames }, (_, f) => (
            <div key={f} className="mat-frame">
              {Array.from({ length: 10 }, (_, c) => {
                const k = cellOf(f * 10 + c);
                if (k === 'solid') return <Dot key={c} tone={knownTone} />;
                if (k === 'fill') return <Dot key={c} tone={tone} hatched />;
                if (k === 'void') return <span key={c} className="mat-dot is-void" />;
                return <span key={c} className={`mat-dot is-ghost is-${k}${k === 'ref' ? ` mat-ring-${knownTone}` : ''}`} />;
              })}
            </div>
          ))}
        </div>
      </div>
    );
  }
  const pct = (v: number) => `${(Math.max(0, v) / cells) * 100}%`;
  const solid = mode === 'sum' || mode === 'rest' ? Math.min(known, cells) : 0;
  const hatch = mode === 'sum' ? box : mode === 'rest' ? 0 : box;
  return (
    <div className={`${cls} mat-meter--bar`}>
      <span className="mat-meter__label">{status}</span>
      <div className="mat-meter__track" aria-hidden="true">
        {mode !== 'sum' && mode !== 'rest' && <span className={`mat-meter__ref mat-ring-${knownTone}`} style={{ width: pct(known) }} />}
        <span className={`mat-meter__seg mat-tone-${knownTone}`} style={{ width: pct(solid) }} />
        <span className={`mat-meter__seg mat-tone-${tone} is-hatched`} style={{ width: pct(Math.min(hatch, cells - solid)) }} />
        <span className="mat-meter__goal" style={{ left: pct(goal) }} />
        {Array.from({ length: Math.floor(cells / 10) }, (_, i) => (
          <span key={i} className="mat-meter__tick" style={{ left: pct((i + 1) * 10) }} />
        ))}
      </div>
    </div>
  );
}
