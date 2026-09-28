/**
 * Değişim: Başta → ok (±Değişim) → Sonra. Şerit görünümüne geçiş düğmesi dışarıda
 * (ModelStep) — `view` ile gelir. Şerit görünümünde birleştirmede bütün = Sonra,
 * ayırmada bütün = Başta; ayırmada giden parça kesikli çizilir.
 */
import { valueOf, RoleBox, Strip, type DiagramProps } from './common';
import { PartWholeLayout } from './CombineDiagram';

export function ChangeDiagram(p: DiagramProps) {
  const join = p.step.variant !== 'separate';
  if (p.view === 'bar') {
    return join ? (
      <PartWholeLayout p={p} whole="result" parts={['start', 'change']} />
    ) : (
      <PartWholeLayout p={p} whole="start" parts={['result', 'change']} dashedPart="change" />
    );
  }
  const max = Math.max(valueOf(p.step, 'start'), valueOf(p.step, 'result'), valueOf(p.step, 'change'), 1);
  const pct = (r: 'start' | 'result' | 'change') => (p.mode === 'scaled' ? `${Math.max(8, (valueOf(p.step, r) / max) * 100)}%` : '100%');
  const sign = join ? '+' : '−';
  return (
    <div className={`dg dg-change${p.compact ? ' is-compact' : ''}`}>
      <div className="dg-row dg-change__row">
        <div className="dg-col dg-change__end">
          <div className="dg-change__stripwrap">
            <Strip role="start" p={p} showValue style={{ width: pct('start') }} />
          </div>
          <RoleBox role="start" p={p} />
        </div>
        <div className="dg-col dg-change__mid">
          <div className="dg-change__stripwrap">
            <Strip role="change" p={p} showValue dashed={!join} style={{ width: pct('change') }} />
          </div>
          <RoleBox role="change" p={p} prefix={<span className="dg-sign" aria-hidden="true">{sign}</span>} />
          <svg className="dg-change__arrow" viewBox="0 0 120 24" preserveAspectRatio="none" aria-hidden="true">
            <path d="M2 12 H112 M104 4 L114 12 L104 20" fill="none" stroke="currentColor" strokeWidth="2.5" vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div className="dg-col dg-change__end">
          <div className="dg-change__stripwrap">
            <Strip role="result" p={p} showValue style={{ width: pct('result') }} />
          </div>
          <RoleBox role="result" p={p} />
        </div>
      </div>
    </div>
  );
}
