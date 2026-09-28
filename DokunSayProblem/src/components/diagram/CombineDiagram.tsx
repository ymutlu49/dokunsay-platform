/**
 * Parça-Bütün: üstte BÜTÜN şeridi, altında iki PARÇA şeridi (DESIGN §3).
 * Aynı yerleşim Değişim'in şerit görünümünde de kullanılır (PartWholeLayout).
 */
import type { Role } from '../../content/types';
import { Bracket, RoleBox, Strip, weight, type DiagramProps } from './common';

export function PartWholeLayout({
  p,
  whole,
  parts,
  dashedPart,
}: {
  p: DiagramProps;
  whole: Role;
  parts: [Role, Role];
  dashedPart?: Role;
}) {
  return (
    <div className={`dg dg-pw${p.compact ? ' is-compact' : ''}`}>
      <div className="dg-row">
        <div className="dg-col" style={{ flexGrow: 1 }}>
          <Strip role={whole} p={p} showValue />
          <RoleBox role={whole} p={p} />
        </div>
      </div>
      <Bracket />
      <div className="dg-row">
        {parts.map((r) => (
          <div key={r} className="dg-col" style={{ flexGrow: weight(p, r, 1) }}>
            <Strip role={r} p={p} dashed={r === dashedPart} showValue />
            <RoleBox role={r} p={p} />
          </div>
        ))}
      </div>
    </div>
  );
}

export function CombineDiagram(p: DiagramProps) {
  return <PartWholeLayout p={p} whole="whole" parts={['part1', 'part2']} />;
}
