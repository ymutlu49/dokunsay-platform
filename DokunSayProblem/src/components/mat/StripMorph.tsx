/**
 * Somuttan temsile geçiş (§12.1 ilke 8): sayaç satırları 600 ms'de şerit kutularına akar.
 * Başta her sıra sayaç dizisidir; `strip` true olunca genişlik değere ORANTILI olur, sayaçlar
 * söner, şerit dolgusu ve değer belirir. Hareket azaltılmışsa anında (CSS).
 * Grup bölgesi tek şeritte `segments` eşit parçaya bölünür (eşit gruplar).
 */
import { Dot } from './Counters';

export interface MorphRow {
  id: string;
  label: string;
  value: number;
  tone: number;
  /** Eşit parça sayısı (grup kapları). */
  segments?: number;
  /** Değer yerine "?" yazılsın. */
  unknown?: boolean;
}

export function StripMorph({ rows, strip }: { rows: MorphRow[]; strip: boolean }) {
  const max = Math.max(1, ...rows.map((r) => r.value));
  return (
    <div className={`morph${strip ? ' is-strip' : ''}`} aria-hidden={!strip}>
      {rows.map((r) => {
        const width = strip ? `${Math.max(4, (r.value / max) * 100)}%` : `min(100%, calc(${Math.min(r.value, 40)} * (var(--dot) + 3px)))`;
        return (
          <div key={r.id} className={`morph__row mat-tone-${r.tone}`}>
            <span className="morph__name">{r.label}</span>
            <div className="morph__track">
              <div className="morph__bar" style={{ width }}>
                {strip && r.segments && r.segments > 1 ? (
                  <span className="morph__segs">
                    {Array.from({ length: r.segments }, (_, i) => (
                      <span key={i} style={{ flex: 1, borderRight: i < r.segments! - 1 ? '2px solid var(--mc)' : undefined }} />
                    ))}
                  </span>
                ) : (
                  Array.from({ length: Math.min(r.value, 40) }, (_, i) => <Dot key={i} tone={r.tone} />)
                )}
              </div>
              <span className="morph__val" data-numeric="true">
                {r.unknown ? '?' : r.value}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
