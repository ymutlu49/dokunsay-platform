/**
 * Onluk çerçeve düzeni: birlikler 5'li satırlarda, 10'luk çerçevelerde dizilir; çerçeveler
 * yan yana sarar (20 üstünde alt alta da iner). Sayılmadan görülebilir yapı (§12.1 ilke 2).
 */
import { Dot, type ItemBind } from './Counters';

export function OnesFrames({
  n,
  tone,
  itemId,
  bind,
  hatched,
  selected,
  minFrames = 1,
  ghostTo,
  label,
}: {
  n: number;
  tone?: number;
  /** Sürükleme kimliği (ör. "ela:one"); verilmezse sayaçlar sabit. */
  itemId?: string;
  bind?: ItemBind;
  hatched?: boolean;
  selected?: boolean;
  /** n=0 iken de en az bu kadar boş çerçeve çiz. */
  minFrames?: number;
  /** Boş hücreleri bu sayıya kadar "hedef" olarak çiz (kesikli). */
  ghostTo?: number;
  label?: string;
}) {
  const cells = Math.max(n, ghostTo ?? 0);
  const frames = Math.max(minFrames, Math.ceil(cells / 10));
  const itemBind = itemId && bind ? bind(itemId, label ?? '1') : undefined;
  return (
    <div className="mat-frames" aria-hidden="true">
      {Array.from({ length: frames }, (_, f) => (
        <div key={f} className="mat-frame">
          {Array.from({ length: 10 }, (_, c) => {
            const i = f * 10 + c;
            if (i < n) return <Dot key={c} tone={tone} hatched={hatched} selected={selected && i === n - 1} bind={itemBind} />;
            return <Dot key={c} ghost />;
          })}
        </div>
      ))}
    </div>
  );
}
