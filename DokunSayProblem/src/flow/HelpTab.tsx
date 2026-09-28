/** "Nasıl çalışır?" — 5 adım, 5 şema, destek düzeyleri, ipuçları, dürüst kanıt notu. */
import { MAIN_STEPS, type MainStep } from '../content/types';
import { pick, useLang, useT, type Key } from '../i18n';
import { schemaMeta, SCHEMAS } from '../lib/contentAdapter';
import { SchemaIcon, StepIcon } from '../components/icons';

const STEP: Record<MainStep, [Key, Key]> = {
  understand: ['step_understand', 'help_understand'],
  show: ['step_show', 'help_show'],
  estimate: ['step_estimate', 'help_estimate'],
  solve: ['step_solve', 'help_solve'],
  check: ['step_check', 'help_check'],
};

export function HelpTab() {
  const t = useT();
  const lang = useLang();
  return (
    <article className="help">
      <h2 className="help__title">{t('help_title')}</h2>
      <p className="help__lead">{t('help_lead')}</p>

      <h3>{t('help_steps_title')}</h3>
      <ol className="help__steps">
        {MAIN_STEPS.map((m) => (
          <li key={m.id}>
            <span className="help__icon">
              <StepIcon step={m.id} size={26} />
            </span>
            <div>
              <b>{t(STEP[m.id][0])}</b>
              <p>{t(STEP[m.id][1])}</p>
            </div>
          </li>
        ))}
      </ol>

      <h3>{t('help_schemas_title')}</h3>
      <ul className="help__schemas">
        {SCHEMAS.map((sc) => {
          const m = schemaMeta(sc);
          return (
            <li key={sc} style={{ ['--schema' as string]: m.color }}>
              <span className="help__sicon">
                <SchemaIcon schema={sc} size={44} />
              </span>
              <div>
                <b>{pick(m.name, lang)}</b>
                <p>
                  {pick(m.short, lang)} <code>{pick(m.equation, lang)}</code>
                </p>
              </div>
            </li>
          );
        })}
      </ul>

      <h3>{t('help_levels_title')}</h3>
      <dl className="help__levels">
        {([3, 2, 1, 0] as const).map((l) => (
          <div key={l}>
            <dt>{t(`lvl_${l}` as Key)}</dt>
            <dd>{t(`help_level_${l}` as Key)}</dd>
          </div>
        ))}
      </dl>

      <h3>{t('help_hints_title')}</h3>
      <p>{t('help_hints')}</p>

      <aside className="help__evidence">
        <h3>{t('help_evidence_title')}</h3>
        <p>{t('help_evidence')}</p>
        <p className="help__privacy">{t('help_privacy')}</p>
      </aside>
    </article>
  );
}
