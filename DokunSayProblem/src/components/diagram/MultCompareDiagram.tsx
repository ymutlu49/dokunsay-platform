/**
 * Kat Karşılaştırması: 1 birimlik REFERANS şeridi ↔ k birimlik KARŞILAŞTIRILAN şerit;
 * sağda "× k" rozeti. "4 fazla" (toplamsal) ile "4 katı" (çarpımsal) ayrımı: burada
 * her birim referansla AYNI boydadır. Birim kesirde (yarısı…) yön terstir.
 */
import { RoleBox, Strip, valueOf, type DiagramProps } from './common';

export function MultCompareDiagram(p: DiagramProps) {
  const k = Math.max(1, valueOf(p.step, 'factor'));
  const scaled = p.mode === 'scaled';
  const segs = scaled ? Math.min(k, 12) : 3;
  const fraction = p.step.variant === 'fraction';
  const longRole = fraction ? 'reference' : 'compared';
  const shortRole = fraction ? 'compared' : 'reference';

  const shortRow = (
    <div className="dg-row">
      <div className="dg-col" style={{ flexGrow: 1 }}>
        <Strip role={shortRole} p={p} showValue />
        <RoleBox role={shortRole} p={p} />
      </div>
      <div className="dg-col dg-spacer" style={{ flexGrow: segs - 1 + (scaled ? 0 : 0.6) }} />
      <div className="dg-gutter" />
    </div>
  );
  const longRow = (
    <div className="dg-row">
      <div className="dg-col" style={{ flexGrow: segs + (scaled ? 0 : 0.6) }}>
        <div className="dg-mc__segs">
          {Array.from({ length: segs }, (_, i) => (
            <Strip key={i} role={longRole} p={p} showValue={i === 0} />
          ))}
          {!scaled && <div className="dg-eg__more" aria-hidden="true">…</div>}
        </div>
        <RoleBox role={longRole} p={p} />
      </div>
      <div className="dg-gutter">
        <RoleBox role="factor" p={p} className="rolebox--badge" prefix={<span className="dg-sign" aria-hidden="true">×</span>} />
      </div>
    </div>
  );
  return (
    <div className={`dg dg-mc${p.compact ? ' is-compact' : ''}`}>
      {fraction ? longRow : shortRow}
      {fraction ? shortRow : longRow}
    </div>
  );
}
