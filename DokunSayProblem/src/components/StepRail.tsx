/**
 * Beş ana adım şeridi (ekranda yalnız 5 simge + etiket — sade UI, 03 §B0).
 * Tamamlananlar işaretli; şu anki adım vurgulu. Mikro-adım adı altta küçük yazılır.
 */
import { MAIN_STEPS, type MainStep } from '../content/types';
import { useT, type Key } from '../i18n';
import { StepIcon, OkMark } from './icons';

const NAME: Record<MainStep, Key> = {
  understand: 'step_understand',
  show: 'step_show',
  estimate: 'step_estimate',
  solve: 'step_solve',
  check: 'step_check',
};

export function StepRail({ current, done, present }: { current: MainStep | null; done: MainStep[]; present: MainStep[] }) {
  const t = useT();
  return (
    <ol className="steprail" aria-label={t('steprail_aria')}>
      {MAIN_STEPS.map((m) => {
        const isDone = done.includes(m.id);
        const isCur = current === m.id;
        const skipped = !present.includes(m.id);
        return (
          <li
            key={m.id}
            className={`steprail__item${isCur ? ' is-current' : ''}${isDone ? ' is-done' : ''}${skipped ? ' is-skipped' : ''}`}
            aria-current={isCur ? 'step' : undefined}
          >
            <span className="steprail__icon">
              <StepIcon step={m.id} size={22} />
              {isDone && (
                <span className="steprail__tick" data-semantic="positive">
                  <OkMark size={11} />
                </span>
              )}
            </span>
            <span className="steprail__label">{t(NAME[m.id])}</span>
            <span className="sr-only">{isDone ? `, ${t('step_done')}` : isCur ? `, ${t('step_current')}` : ''}</span>
          </li>
        );
      })}
    </ol>
  );
}
