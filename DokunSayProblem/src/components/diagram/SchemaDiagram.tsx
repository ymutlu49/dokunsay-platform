/** Şemaya göre doğru diyagramı seçer; ortak çerçeve + erişilebilir ad. */
import { pick, useT } from '../../i18n';
import { schemaMeta } from '../../lib/contentAdapter';
import type { DiagramProps } from './common';
import { ChangeDiagram } from './ChangeDiagram';
import { CombineDiagram } from './CombineDiagram';
import { CompareDiagram } from './CompareDiagram';
import { EqualGroupsDiagram } from './EqualGroupsDiagram';
import { MultCompareDiagram } from './MultCompareDiagram';

export type { DiagramProps, BoxContent, Mark } from './common';

export function SchemaDiagram(p: DiagramProps) {
  const t = useT();
  const meta = schemaMeta(p.step.schema);
  const body = (() => {
    switch (p.step.schema) {
      case 'change':
        return <ChangeDiagram {...p} />;
      case 'combine':
        return <CombineDiagram {...p} />;
      case 'compare':
        return <CompareDiagram {...p} />;
      case 'equalGroups':
        return <EqualGroupsDiagram {...p} />;
      case 'multCompare':
        return <MultCompareDiagram {...p} />;
    }
  })();
  return (
    <figure
      className={`diagram mode-${p.mode}`}
      style={{ ['--schema' as string]: meta.color }}
      aria-label={t('diagram_aria', { name: pick(meta.name, p.lang) })}
    >
      {body}
    </figure>
  );
}
