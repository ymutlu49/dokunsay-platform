/**
 * Yazdırma için BOŞ şema diyagramları (SVG; baskıda güvenli: siyah çizgi, beyaz dolgu,
 * 44 px kuralından etkilenmez). Kutular boş: çocuk sayıları ve "?"yi kendisi yazar.
 * İşaret (+/−) BOŞ bırakılır — işlem modelden çocuk tarafından türetilmeli.
 */
import type { Lang, Role, SchemaId } from '../content/types';
import { pick } from '../i18n';
import { roleLabel } from '../lib/contentAdapter';

const S = { fill: '#fff', stroke: '#333', strokeWidth: 1.5 } as const;

export function BlankDiagram({ schema, lang, label }: { schema: SchemaId | null; lang: Lang; label: string }) {
  const r = (role: Role) => pick(roleLabel(role), lang);
  const txt = (x: number, y: number, s: string, anchor: 'start' | 'middle' | 'end' = 'middle') => (
    <text x={x} y={y} fontSize="11" textAnchor={anchor} fill="#333" fontFamily="Nunito, sans-serif">
      {s}
    </text>
  );
  let body;
  switch (schema) {
    case 'change':
      body = (
        <>
          <rect x="10" y="40" width="110" height="46" rx="8" {...S} />
          {txt(65, 102, r('start'))}
          <line x1="125" y1="63" x2="345" y2="63" stroke="#333" strokeWidth="1.5" markerEnd="url(#ah)" />
          <circle cx="235" cy="30" r="12" {...S} />
          <rect x="180" y="46" width="110" height="34" rx="8" {...S} strokeDasharray="4 3" />
          {txt(235, 96, r('change'))}
          <rect x="355" y="40" width="110" height="46" rx="8" {...S} />
          {txt(410, 102, r('result'))}
        </>
      );
      break;
    case 'combine':
      body = (
        <>
          <rect x="60" y="14" width="400" height="34" rx="6" {...S} />
          {txt(54, 36, r('whole'), 'end')}
          <rect x="60" y="62" width="200" height="34" rx="6" {...S} />
          <rect x="264" y="62" width="196" height="34" rx="6" {...S} />
          {txt(160, 112, r('part1'))}
          {txt(362, 112, r('part2'))}
        </>
      );
      break;
    case 'compare':
      body = (
        <>
          <rect x="90" y="16" width="370" height="34" rx="6" {...S} />
          {txt(84, 38, r('larger'), 'end')}
          <rect x="90" y="62" width="230" height="34" rx="6" {...S} />
          {txt(84, 84, r('smaller'), 'end')}
          <rect x="324" y="62" width="136" height="34" rx="6" {...S} strokeDasharray="5 4" />
          {txt(392, 112, r('difference'))}
        </>
      );
      break;
    case 'equalGroups':
      body = (
        <>
          <rect x="90" y="14" width="370" height="34" rx="6" {...S} />
          {txt(84, 36, r('total'), 'end')}
          {[0, 1, 2].map((i) => (
            <rect key={i} x={90 + i * 94} y="62" width="90" height="34" rx="6" {...S} />
          ))}
          <text x="410" y="84" fontSize="18" textAnchor="middle" fill="#333">
            …
          </text>
          {txt(84, 84, r('perGroup'), 'end')}
          {txt(275, 114, `${r('groups')}: ____`)}
        </>
      );
      break;
    case 'multCompare':
      body = (
        <>
          <rect x="110" y="16" width="86" height="34" rx="6" {...S} />
          {txt(104, 38, r('reference'), 'end')}
          {[0, 1, 2].map((i) => (
            <rect key={i} x={110 + i * 90} y="62" width="86" height="34" rx="6" {...S} />
          ))}
          <text x="410" y="84" fontSize="18" textAnchor="middle" fill="#333">
            …
          </text>
          {txt(104, 84, r('compared'), 'end')}
          {txt(290, 114, `${r('factor')}: ____`)}
        </>
      );
      break;
    default:
      body = (
        <>
          <rect x="10" y="8" width="460" height="104" rx="8" fill="#fff" stroke="#999" strokeDasharray="6 4" />
          {txt(240, 64, label)}
        </>
      );
  }
  return (
    <svg className="tc-blank" viewBox="0 0 480 120" role="img" aria-label={label}>
      <defs>
        <marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0 0 L10 5 L0 10 z" fill="#333" />
        </marker>
      </defs>
      {body}
    </svg>
  );
}
