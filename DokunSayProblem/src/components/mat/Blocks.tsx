/**
 * Onluk taban blokları: onluk çubuk (10 bitişik kare, 5'te belirgin çizgi), yüzlük kare
 * (10×10). StackView bir bölgenin { h, t, o } içeriğini yüzlük → onluk → birlik sırasıyla çizer.
 */
import type { ZoneState } from './matState';
import type { ItemBind } from './Counters';
import { OnesFrames } from './TenFrame';

export function TenRod({ tone = 1, hatched, selected, bind }: { tone?: number; hatched?: boolean; selected?: boolean; bind?: Record<string, unknown> }) {
  return (
    <span className={`mat-rod mat-tone-${tone}${hatched ? ' is-hatched' : ''}${selected ? ' is-selected' : ''}${bind ? ' is-item' : ''}`} aria-hidden="true" {...bind}>
      {Array.from({ length: 10 }, (_, i) => (
        <span key={i} className="mat-rod__cell" />
      ))}
    </span>
  );
}

export function HundredSquare({ tone = 1, hatched, selected, bind }: { tone?: number; hatched?: boolean; selected?: boolean; bind?: Record<string, unknown> }) {
  return <span className={`mat-hund mat-tone-${tone}${hatched ? ' is-hatched' : ''}${selected ? ' is-selected' : ''}${bind ? ' is-item' : ''}`} aria-hidden="true" {...bind} />;
}

export function StackView({
  z,
  zoneId,
  tone,
  bind,
  selectedUnit,
  hatched,
  unitLabels,
}: {
  z: ZoneState;
  zoneId: string;
  tone?: number;
  bind?: ItemBind;
  /** Seçili birim (son öğesi vurgulanır). */
  selectedUnit?: 'one' | 'ten' | 'hundred' | null;
  hatched?: boolean;
  unitLabels: { one: string; ten: string; hundred: string };
}) {
  const hb = bind?.(`${zoneId}:hundred`, unitLabels.hundred);
  const tb = bind?.(`${zoneId}:ten`, unitLabels.ten);
  return (
    <div className="mat-stack">
      {z.h > 0 && (
        <div className="mat-stack__hund">
          {Array.from({ length: z.h }, (_, i) => (
            <HundredSquare key={i} tone={tone} hatched={hatched} bind={hb} selected={selectedUnit === 'hundred' && i === z.h - 1} />
          ))}
        </div>
      )}
      {z.t > 0 && (
        <div className="mat-stack__tens">
          {Array.from({ length: z.t }, (_, i) => (
            <TenRod key={i} tone={tone} hatched={hatched} bind={tb} selected={selectedUnit === 'ten' && i === z.t - 1} />
          ))}
        </div>
      )}
      {(z.o > 0 || (z.t === 0 && z.h === 0)) && (
        <OnesFrames n={z.o} tone={tone} itemId={`${zoneId}:one`} bind={bind} hatched={hatched} selected={selectedUnit === 'one'} label={unitLabels.one} />
      )}
    </div>
  );
}
