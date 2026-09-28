/** Şema kartı: SVG simge + ad + kısa tarif + mini animasyon (CSS; hareket azaltılmışsa durağan). */
import type { SchemaId } from '../content/types';
import { pick, useLang } from '../i18n';
import { schemaMeta } from '../lib/contentAdapter';
import { SchemaIcon } from './icons';

export function SchemaCard({
  schema,
  state,
  onPick,
  disabled,
  badge,
  footer,
}: {
  schema: SchemaId;
  state?: 'ok' | 'bad' | null;
  onPick?: () => void;
  disabled?: boolean;
  badge?: string;
  footer?: string;
}) {
  const lang = useLang();
  const m = schemaMeta(schema);
  const inner = (
    <>
      {badge && <span className="schemacard__badge">{badge}</span>}
      <span className={`schemacard__icon anim-${schema}`}>
        <SchemaIcon schema={schema} size={56} />
      </span>
      <span className="schemacard__name">{pick(m.name, lang)}</span>
      <span className="schemacard__short">{pick(m.short, lang)}</span>
      {footer && <span className="schemacard__foot">{footer}</span>}
    </>
  );
  const style = { ['--schema' as string]: m.color };
  const cls = `schemacard${state ? ` is-${state}` : ''}`;
  if (!onPick) {
    return (
      <div className={cls} style={style}>
        {inner}
      </div>
    );
  }
  return (
    <button type="button" className={cls} style={style} onClick={onPick} disabled={disabled} data-semantic={state === 'ok' ? 'positive' : state === 'bad' ? 'negative' : undefined}>
      {inner}
    </button>
  );
}
