/**
 * Eşit Gruplar: üstte TOPLAM şeridi; altta G eşit dilim (grup başına) ve solda grup
 * sayısı rozeti. Ölçekli kipte (toplam ≤ 40) dilimlerde nokta nesneler belirir:
 * paylaştırmada "tek tek dağıt" (noktalar dilimlere sırayla), gruplamada "N'erli al"
 * (dilim dilim dolar). Kalanlı bölmede kalan kesikli ayrı dilimdir.
 */
import type { CSSProperties } from 'react';
import { RoleBox, Strip, valueOf, type DiagramProps } from './common';

export function EqualGroupsDiagram(p: DiagramProps) {
  const G = valueOf(p.step, 'groups');
  const N = valueOf(p.step, 'perGroup');
  const T = valueOf(p.step, 'total');
  const R = p.step.remainder?.value ?? 0;
  const scaled = p.mode === 'scaled';
  const cells = scaled ? Math.min(Math.max(G, 1), 12) : 3;
  const tooMany = scaled && G > 12;
  const dots = scaled && T <= 40 && !tooMany;
  const partitive = p.step.variant === 'partitive';
  const perVal = p.boxes.perGroup?.value;

  return (
    <div className={`dg dg-eg${p.compact ? ' is-compact' : ''}${partitive ? ' is-partitive' : ' is-quotative'}`}>
      <div className="dg-row">
        <div className="dg-gutter" />
        <div className="dg-col" style={{ flexGrow: 1 }}>
          <Strip role="total" p={p} showValue />
          <RoleBox role="total" p={p} />
        </div>
      </div>
      <div className="dg-row dg-eg__groups">
        <div className="dg-gutter">
          <RoleBox role="groups" p={p} className="rolebox--badge" prefix={<span className="dg-sign" aria-hidden="true">×</span>} />
        </div>
        <div className="dg-eg__cells">
          {Array.from({ length: cells }, (_, i) => (
            <div key={i} className="dg-col dg-eg__cell" style={{ flexGrow: scaled ? N : 1 }}>
              <Strip role="perGroup" p={p} showValue={!dots}>
                {dots && (
                  <span className="dots" aria-hidden="true">
                    {Array.from({ length: N }, (_, j) => (
                      <i
                        key={j}
                        className="dot"
                        style={{ '--d': `${(partitive ? j * cells + i : i * N + j) * 55}ms` } as CSSProperties}
                      />
                    ))}
                  </span>
                )}
              </Strip>
              {i === 0 ? (
                <RoleBox role="perGroup" p={p} />
              ) : (
                <div className="rolebox rolebox--ghost" aria-hidden="true">
                  <span className="rolebox__value" data-numeric="true">
                    {perVal === '?' ? '?' : perVal ?? ''}
                  </span>
                </div>
              )}
            </div>
          ))}
          {(!scaled || tooMany) && (
            <div className="dg-col dg-eg__more" aria-hidden="true">
              …
            </div>
          )}
          {scaled && R > 0 && (
            <div className="dg-col dg-eg__cell" style={{ flexGrow: R }}>
              <div className="strip is-dashed tone-4 pat-4 strip--rem" aria-hidden="true">
                <span className="strip__val" data-numeric="true">
                  {R}
                </span>
              </div>
              <div className="rolebox rolebox--ghost" aria-hidden="true" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
