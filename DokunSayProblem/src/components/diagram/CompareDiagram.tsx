/**
 * Karşılaştırma: iki hizalı şerit; FARK kesikli ve küçük şeridin sonunda; referansa
 * ("…den") ok. Ok, "Kim daha çok? Kimden?" ilişki sorusunun görsel karşılığıdır
 * (anahtar kelime değil — DESIGN §2 ilke 3).
 */
import { ArrowIcon } from '../icons';
import { RoleBox, Strip, weight, type DiagramProps } from './common';

export function CompareDiagram(p: DiagramProps) {
  const ref = p.step.referent;
  const arrow = ref === 'larger' ? 'up' : ref === 'smaller' ? 'left' : null;
  const wl = weight(p, 'larger', 3);
  const ws = weight(p, 'smaller', 2);
  const wd = weight(p, 'difference', 1);
  return (
    <div className={`dg dg-compare${p.compact ? ' is-compact' : ''}`}>
      <div className="dg-row">
        <div className="dg-col" style={{ flexGrow: wl }}>
          <Strip role="larger" p={p} showValue />
          <RoleBox role="larger" p={p} />
        </div>
        {p.mode === 'build' && <div className="dg-col dg-spacer" style={{ flexGrow: 0.0001 }} />}
      </div>
      <div className="dg-row">
        <div className="dg-col" style={{ flexGrow: ws }}>
          <Strip role="smaller" p={p} showValue />
          <RoleBox role="smaller" p={p} />
        </div>
        <div className="dg-col" style={{ flexGrow: wd }}>
          <Strip role="difference" p={p} dashed showValue />
          <RoleBox
            role="difference"
            p={p}
            prefix={
              arrow ? (
                <span className="dg-ref" aria-hidden="true">
                  <ArrowIcon size={14} dir={arrow} />
                </span>
              ) : undefined
            }
          />
        </div>
      </div>
    </div>
  );
}
