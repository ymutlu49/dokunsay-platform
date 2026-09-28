/**
 * Tek problemin çözüm ekranı (orkestratör). Geniş ekranda iki sütun: solda hikâye,
 * sağda adım (model/denklem); dar ekranda üstte yapışkan hikâye özeti. Ekranda aynı anda
 * en fazla üç katman: hikâye · adım · ipucu/geri bildirim.
 */
import { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import { sfx } from '@shared/audio.js';
import type { ErrorClass, FlowStepId, L10n, Problem, ScaffoldLevel } from '../content/types';
import { pick, useLang, useT, type Key } from '../i18n';
import { actFeasible, feedbackText, hintText, schemaMeta, selfTalkFor, answerText } from '../lib/contentAdapter';
import { knownMax } from '../lib/problemUtil';
import { speak, voiceOn } from '../lib/speech';
import { initSolve, isGuided, MAIN_OF, solveReducer, type SolveState } from '../state/solveReducer';
import { useA11y } from '../state/A11yContext';
import { StepRail } from '../components/StepRail';
import { StoryPanel } from '../components/StoryPanel';
import { FeedbackBubble, GuideBalloon, Say, SelfTalkCard } from '../components/Talk';
import { HintBubble, HintButton } from '../components/HintButton';
import { HomeIcon, ShareIcon } from '../components/icons';
import { ReadStep, RetellStep, QuestionStep } from './steps/UnderstandSteps';
import { KnownStep, SchemaStep } from './steps/KnownSchemaSteps';
import { ModelStep } from './steps/ModelStep';
import { ActStep, ActTryButton } from './steps/ActStep';
import { CheckModelStep, EstimateStep } from './steps/ShowEstimateSteps';
import { ComputeStep, EquationStep } from './steps/SolveSteps';
import { AnswerStep, ReasonableStep, ReflectStep } from './steps/CheckSteps';
import type { StepProps } from './steps/common';
import { equationFor } from '../lib/contentAdapter';
import { tokensText, unknownValue } from '../lib/problemUtil';

const TITLE: Record<FlowStepId, Key> = {
  act: 'm_act', read: 'm_read', retell: 'm_retell', question: 'm_question', known: 'm_known', schema: 'm_schema', model: 'm_model',
  checkModel: 'm_checkModel', estimate: 'm_estimate', equation: 'm_equation', compute: 'm_compute', answer: 'm_answer',
  reasonable: 'm_reasonable', reflect: 'm_reflect',
};
const PROMPT: Partial<Record<FlowStepId, Key>> = {
  act: 'p_act', retell: 'p_retell', question: 'p_question', known: 'p_known', schema: 'p_schema', checkModel: 'p_checkModel',
  equation: 'p_equation', compute: 'p_compute', answer: 'p_answer', reasonable: 'p_reasonable', reflect: 'p_reflect',
};

export interface SolveOutcome {
  state: SolveState;
}

export function SolveScreen({
  problem,
  level,
  examples,
  withReflect,
  onDone,
  onShare,
  onHome,
  done,
}: {
  problem: Problem;
  level: ScaffoldLevel;
  examples: number;
  withReflect: boolean;
  onDone: (s: SolveState) => void;
  onShare: () => void;
  onHome: () => void;
  done: React.ReactNode;
}) {
  const t = useT();
  const lang = useLang();
  const { installShortcuts } = useA11y();
  const [s, dispatch] = useReducer(solveReducer, undefined, () => initSolve(problem, level, examples, withReflect));
  const [reading, setReading] = useState<number | null>(null);
  const [shake, setShake] = useState(0);
  const reported = useRef(false);
  const cur = s.plan[s.idx];
  const guided = isGuided(s);
  const stepId = cur?.id ?? 'reflect';

  useEffect(() => {
    if (s.done && !reported.current) {
      reported.current = true;
      onDone(s);
    }
  }, [s, onDone]);

  // Sesli geri bildirim (kullanıcı eylemine yanıt olarak — otomatik oynatma kısıtı yok).
  useEffect(() => {
    if (s.feedback && voiceOn(lang)) speak(pick(s.feedback.text, lang), lang);
  }, [s.feedback?.n]); // eslint-disable-line react-hooks/exhaustive-deps

  // H0: 30 sn etkinliksizlikte öz-sorgu kartı parlar.
  const idle = useRef<ReturnType<typeof setTimeout>>();
  const poke = useCallback(() => {
    if (idle.current) clearTimeout(idle.current);
    idle.current = setTimeout(() => dispatch({ type: 'glow', on: true }), 30000);
  }, []);
  useEffect(() => {
    poke();
    return () => idle.current && clearTimeout(idle.current);
  }, [s.idx, poke]);

  const ok = useCallback(
    (text?: L10n) => {
      sfx.correct();
      dispatch({ type: 'feedback', tone: 'ok', text: text ?? feedbackText('correct', problem, stepId) });
    },
    [problem, stepId],
  );
  const wrong = useCallback(
    (error?: ErrorClass, text?: L10n) => {
      sfx.wrong();
      setShake(1);
      setTimeout(() => setShake(0), 450);
      dispatch({ type: 'wrong', step: stepId, error });
      dispatch({ type: 'feedback', tone: 'wrong', text: text ?? feedbackText(error ?? 'tryAgain', problem, stepId) });
    },
    [problem, stepId],
  );
  const next = useCallback(() => dispatch({ type: 'next' }), []);
  const askHint = useCallback(() => {
    const lvl = Math.min(4, s.hintLevel + 1) as 1 | 2 | 3 | 4;
    dispatch({ type: 'hint', text: hintText(problem, stepId, lvl) });
  }, [s.hintLevel, problem, stepId]);

  const prompt = useRef('');
  useEffect(() => {
    if (!installShortcuts) return;
    return installShortcuts({ onSpeak: () => prompt.current && speak(prompt.current, lang), onHelp: askHint }) as () => void;
  }, [installShortcuts, askHint, lang]);

  if (s.done) {
    return (
      <div className="solve">
        <div className="solve-body">
          <aside className="solve-story">
            <StoryPanel problem={problem} reading={null} answerLine={answerText(problem, lang, s.finalAnswer ?? problem.answer)} />
          </aside>
          <section className="solve-work">{done}</section>
        </div>
      </div>
    );
  }

  const link = cur.link;
  const main = MAIN_OF[stepId];
  const doneMains = Array.from(new Set(s.plan.slice(0, s.idx).map((p) => MAIN_OF[p.id]))).filter((m) => m !== main);
  const present = Array.from(new Set(s.plan.map((p) => MAIN_OF[p.id])));
  const pKey = PROMPT[stepId];
  const promptText =
    stepId === 'read'
      ? t(voiceOn(lang) ? 'p_read' : 'p_read_silent')
      : stepId === 'estimate'
        ? problem.grade >= 4
          ? t('p_estimate_line')
          : t('p_estimate_small', { n: knownMax(problem) })
        : stepId === 'answer' && problem.steps[link].remainder
          ? t('p_answer_remainder')
          : stepId === 'schema' && level === 3
            ? t('p_schema_new')
            : pKey
              ? t(pKey)
              : '';
  prompt.current = promptText;

  const guideText = (() => {
    if (!guided) return '';
    const st = problem.steps[link];
    const m = schemaMeta(st.schema);
    const lines: Partial<Record<FlowStepId, string>> = {
      read: s.idx === 0 && level === 3 ? `${t(s.guideUntil >= s.plan.length ? 'guide_intro' : 'guide_partial')} ${t('guide_read')}` : t('guide_read'),
      retell: t('guide_retell'),
      question: t('guide_question'),
      known: t('guide_known'),
      act: t('guide_act'),
      schema: t('guide_schema', { name: pick(m.name, lang), rule: pick(m.rule, lang) }),
      model: t('guide_model'),
      checkModel: t('guide_checkModel'),
      estimate: t('guide_estimate'),
      equation: t('guide_equation', { eq: tokensText(equationFor(st).tokens) }),
      compute: t('guide_compute', { x: unknownValue(st) }),
      answer: t('guide_answer'),
      reasonable: t('guide_reasonable'),
    };
    const h4 = s.guided.includes(s.idx) ? `${t('guide_showing')} ` : '';
    return h4 + (lines[stepId] ?? '');
  })();
  // S1/S0: canlandırma planda yok ama model/denklem/hesapta isteğe bağlı (DESIGN §12.1 ilke 9).
  const tryObjects = level <= 1 && !guided && ['model', 'equation', 'compute'].includes(stepId) && actFeasible(problem, link);
  const yourTurn = level === 3 && s.idx === s.guideUntil && s.guideUntil > 0 && !guided;

  const props: StepProps = { s, dispatch, link, guided, lang, next, ok, wrong, hint: s.hintLevel };
  const key = `${s.idx}-${guided ? 'g' : 'c'}`;
  const body = (() => {
    switch (stepId) {
      case 'read': return <ReadStep key={key} {...props} setReading={setReading} />;
      case 'retell': return <RetellStep key={key} {...props} />;
      case 'question': return <QuestionStep key={key} {...props} />;
      case 'known': return <KnownStep key={key} {...props} />;
      case 'act': return <ActStep key={key} {...props} setReading={setReading} />;
      case 'schema': return <SchemaStep key={key} {...props} level={level} />;
      case 'model': return <ModelStep key={key} {...props} level={level} />;
      case 'checkModel': return <CheckModelStep key={key} {...props} />;
      case 'estimate': return <EstimateStep key={key} {...props} />;
      case 'equation': return <EquationStep key={key} {...props} />;
      case 'compute': return <ComputeStep key={key} {...props} />;
      case 'answer': return <AnswerStep key={key} {...props} />;
      case 'reasonable': return <ReasonableStep key={key} {...props} />;
      case 'reflect': return <ReflectStep key={key} {...props} />;
    }
  })();

  const stepsCount = problem.steps.length;
  return (
    <div className="solve" onPointerDown={poke} onKeyDown={poke}>
      <div className="solve-top">
        <StepRail current={main} done={doneMains} present={present} />
        <div className="solve-top__tools">
          <button type="button" className="iconbtn" onClick={onShare} aria-label={t('btn_share')} title={t('btn_share')}>
            <ShareIcon />
          </button>
          <button type="button" className="iconbtn" onClick={onHome} aria-label={t('btn_home')} title={t('btn_home')}>
            <HomeIcon />
          </button>
        </div>
      </div>
      <div className="solve-body">
        <aside className="solve-story">
          <StoryPanel problem={problem} reading={reading} highlightQuestion={s.plan.slice(0, s.idx).some((p) => p.id === 'question')} />
        </aside>
        <section className="solve-work" aria-live="off">
          <header className="step-head">
            <div className="step-head__titles">
              <h2 className="step-head__title">
                {t(TITLE[stepId])}
                {stepsCount > 1 && ['schema', 'model', 'checkModel', 'equation', 'compute'].includes(stepId) && (
                  <span className="step-head__link">{t('link_label', { n: link + 1, m: stepsCount })}</span>
                )}
              </h2>
              {promptText && (
                <p className="step-head__prompt">
                  {promptText} <Say text={promptText} size={30} />
                </p>
              )}
            </div>
            {!guided && stepId !== 'reflect' && <HintButton level={s.hintLevel} at={s.hintAt} onHint={askHint} />}
          </header>
          {guided && guideText && <GuideBalloon text={guideText} />}
          {yourTurn && <GuideBalloon text={t('guide_your_turn')} />}
          {!guided && <SelfTalkCard talk={selfTalkFor(stepId)} open={level >= 2} glow={s.glow} />}
          <HintBubble level={s.hintLevel} text={s.hintLevel < 4 ? s.hintText : null} />
          {tryObjects && (
            <div className="act-try-row">
              <ActTryButton problem={problem} lang={lang} stepIndex={link} dispatch={dispatch} />
            </div>
          )}
          <div className={`step-wrap${shake ? ' shake' : ''}`}>
            {body}
          </div>
          {s.feedback && (
            <FeedbackBubble
              tone={s.feedback.tone}
              text={s.feedback.text}
              n={s.feedback.n}
              action={
                s.feedback.tone === 'wrong' && s.hintLevel === 0 ? (
                  <button type="button" className="btn btn--soft" onClick={askHint}>
                    {t('btn_hint_offer')}
                  </button>
                ) : undefined
              }
            />
          )}
        </section>
      </div>
    </div>
  );
}
