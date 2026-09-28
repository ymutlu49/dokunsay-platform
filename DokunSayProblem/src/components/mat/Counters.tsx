/**
 * Sade yuvarlak sayaç (resim/emoji YOK — DESIGN §12.1 ilke 1; Kaminski vd. 2008).
 * Sayaç bir <button> DEĞİL: a11y-global 44 px `!important` kuralı küçük sayaçları şişirirdi.
 * Etkileşim bölge (klavye, +/− düğmeleri) ve sürükleme (pointer) üzerinden yürür; sayaçlar
 * ekran okuyucudan gizlidir (bölgenin aria-label'ı sayıyı söyler).
 */
import type { CSSProperties } from 'react';

/** Sürüklenebilir öğe özellikleri (useDragDrop.itemProps'tan süzülmüş). */
export type ItemBind = (id: string, label: string) => Record<string, unknown>;

export function Dot({
  tone = 1,
  hatched,
  selected,
  ghost,
  bind,
  style,
}: {
  tone?: number;
  hatched?: boolean;
  selected?: boolean;
  /** Boş çerçeve hücresi (hedef çizgisi / boş yuva). */
  ghost?: boolean;
  bind?: Record<string, unknown>;
  style?: CSSProperties;
}) {
  const cls = ['mat-dot', ghost ? 'is-ghost' : `mat-tone-${tone}`, hatched ? 'is-hatched' : '', selected ? 'is-selected' : '', bind ? 'is-item' : '']
    .filter(Boolean)
    .join(' ');
  return <span className={cls} style={style} aria-hidden="true" {...bind} />;
}
