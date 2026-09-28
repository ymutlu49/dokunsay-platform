/**
 * 8 · Hata Dedektifi (03 §C6) — "Robot Çırak"ın (kurgusal; gerçek çocuk değil, utandırmaz)
 * 5 adımlı çözümünde hatalı adımı bul → nedenini seç → düzelt.
 * KİLİT (Große & Renkl 2007): yalnız S1+ olunan şemalardan madde gelir; S1'de hatalı adım
 * İŞARETLİ gelir, S0'da işaretsiz. Öğretmen kilidi açabilir (öğretmen paneli → cihaz ayarı).
 * Kayıt: madde bütünüyle ilk denemede doğruysa doğru; değilse Robot'un hata türü (çocuğun
 * yakalayamadığı yanılgı) ErrorClass olarak yazılır.
 */
import { useMemo, useState } from 'react';
import type { ErrorClass, FlowStepId, Problem, ScaffoldLevel, SchemaId } from '../content/types';
import { pick } from '../i18n';
import { answerText, equationFor, schemaMeta } from '../lib/contentAdapter';
import { loadProgress } from '../lib/progress';
import { fillUnknown, shuffleSeeded, tokensText, unknownValue } from '../lib/problemUtil';
import { erroneousSolution, isErrorClass, problemSet, schemasFor, type ErroneousUI } from './api';
import { Choices, ModuleShell, Preparing, StoryBlock, useRound, usePhase, type ModuleProps } from './common';
import type { MT } from './i18n';
import { teacherUnlocked } from './record';

const N = 5;

/** Bu sınıfta S1 ya da S0 olunan şemalar. */
export function detectiveSchemas(grade: ModuleProps['grade']): { schema: SchemaId; level: ScaffoldLevel }[] {
  const prog = loadProgress();
  return schemasFor(grade)
    .map((s) => ({ schema: s, level: (prog.schemas[s]?.level ?? 3) as ScaffoldLevel }))
    .filter((x) => x.level <= 1);
}

function correctText(stepId: FlowStepId, p: Problem, lang: 'tr' | 'ku' | 'en'): string | null {
  const st = p.steps[0];
  const eq = equationFor(st).tokens;
  switch (stepId) {
    case 'schema':
      return pick(schemaMeta(st.schema).name, lang);
    case 'model':
      return st.quantities.map((q) => `${pick(q.label, lang)}: ${q.role === st.unknown ? '?' : q.value}`).join(' · ');
    case 'equation':
      return eq.length ? tokensText(eq) : null;
    case 'compute':
      return eq.length ? tokensText(fillUnknown(eq, unknownValue(st))) : null;
    case 'answer':
      return answerText(p, lang, p.answer);
    default:
      return null;
  }
}

function errorClassOf(e: ErroneousUI, stepId: FlowStepId | undefined): ErrorClass {
  if (isErrorClass(e.misconception)) return e.misconception;
  if (/keyword|reversal/i.test(e.misconception)) return 'reversal';
  if (/textOrder/i.test(e.misconception)) return 'textOrderOp';
  const byStep: Partial<Record<FlowStepId, ErrorClass>> = { schema: 'schemaId', model: 'modelPlacement', equation: 'operation', compute: 'computation', answer: 'unitOrRemainder' };
  return (stepId && byStep[stepId]) || 'operation';
}

const STEP_KEY: Partial<Record<FlowStepId, Parameters<MT>[0]>> = {
  schema: 'errdet_step_schema',
  model: 'errdet_step_model',
  equation: 'errdet_step_equation',
  compute: 'errdet_step_compute',
  answer: 'errdet_step_answer',
};

export function ErrorDetective({ lang, grade, seed, t, onExit, onDone }: ModuleProps) {
  const unlocked = teacherUnlocked();
  const eligible = useMemo(() => detectiveSchemas(grade), [grade]);
  const items = useMemo(() => {
    const schemas = eligible.length ? eligible.map((e) => e.schema) : unlocked ? schemasFor(grade) : [];
    if (!schemas.length) return [];
    return problemSet(grade, N + 3, seed, { schemas, axes: { M: 1 } })
      .map((p, i) => ({ p, e: erroneousSolution(p, seed + i) }))
      .filter((x): x is { p: Problem; e: ErroneousUI } => !!x.e)
      .slice(0, N);
  }, [grade, seed, eligible, unlocked]);
  const round = useRound('errorDetective', grade, Math.max(1, items.length), onDone);
  const find = usePhase();
  const why = usePhase();
  const fix = usePhase();
  const [phase, setPhase] = useState<'find' | 'why' | 'fix'>('find');
  const [allFirst, setAllFirst] = useState(true);

  if (!eligible.length && !unlocked) {
    return (
      <section className="md-shell md-empty">
        <h2 className="md-shell__title">🔒 {t('m_errdet')}</h2>
        <p>{t('errdet_lock')}</p>
        <button type="button" className="md-btn md-btn--primary" onClick={onExit}>
          ← {t('back_cards')}
        </button>
      </section>
    );
  }
  if (!items.length) return <Preparing t={t} onExit={onExit} />;

  const { p, e } = items[round.index];
  const level = eligible.find((x) => x.schema === p.steps[0].schema)?.level ?? 1;
  const marked = level >= 1;
  const errIdx = e.steps.findIndex((s) => s.isError);
  const errStep = e.steps[errIdx]?.stepId;
  const rec = { schema: p.steps[0].schema, problemId: p.id };
  const whyOpts = shuffleSeeded(e.why.map((w, i) => ({ id: `w${i}`, text: pick(w.text, lang), correct: w.correct })), p.seed);
  const good = errStep ? correctText(errStep, p, lang) : null;
  const shown = pick(e.steps[errIdx]?.shown, lang);
  const fixOpts = good && good !== shown ? shuffleSeeded([{ id: 'good', text: good }, { id: 'bad', text: shown }], p.seed + 1) : [];

  const close = (firstTry: boolean) => {
    const ok = allFirst && firstTry;
    round.finish(ok, ok ? t('ok_generic') : t('result_process'), { ...rec, error: ok ? undefined : errorClassOf(e, errStep) });
  };
  const afterWhy = (firstTry: boolean) => {
    const af = allFirst && firstTry;
    setAllFirst(af);
    if (fixOpts.length) {
      setPhase('fix');
      round.info(t('errdet_fix'));
    } else round.finish(af, af ? t('ok_generic') : t('result_process'), { ...rec, error: af ? undefined : errorClassOf(e, errStep) });
  };
  const afterFind = (firstTry: boolean) => {
    setAllFirst(firstTry);
    if (whyOpts.length) {
      setPhase('why');
      round.info(t('errdet_why'));
    } else round.finish(firstTry, firstTry ? t('ok_generic') : t('result_process'), { ...rec, error: firstTry ? undefined : errorClassOf(e, errStep) });
  };

  return (
    <ModuleShell
      title={t('m_errdet')}
      t={t}
      lang={lang}
      onExit={onExit}
      round={{
        ...round,
        next: () => {
          find.reset();
          why.reset();
          fix.reset();
          setPhase('find');
          setAllFirst(true);
          round.next();
        },
      }}
    >
      <StoryBlock problem={p} lang={lang} t={t} compact />
      <h3 className="md-q">🤖 {t('errdet_robot')}</h3>
      {phase === 'find' && <p className="md-sub">{marked ? t('errdet_marked') : t('errdet_find')}</p>}
      <ol className="md-robot">
        {e.steps.map((s, i) => {
          const st = find.state[`s${i}`];
          return (
            <li key={i}>
              <button
                type="button"
                className={`md-robot__step${marked && s.isError ? ' is-marked' : ''}${st ? ` is-${st}` : ''}`}
                disabled={phase !== 'find' || find.done || st === 'bad'}
                onClick={() => find.pick(`s${i}`, `s${errIdx}`, () => round.info(t('errdet_hint'), 'try'), afterFind)}
                data-semantic={st === 'ok' ? 'positive' : st === 'bad' ? 'negative' : undefined}
              >
                <span className="md-robot__n">{i + 1}</span>
                <span className="md-robot__lbl">{STEP_KEY[s.stepId] ? t(STEP_KEY[s.stepId]!) : s.stepId}</span>
                <span className="md-robot__txt" data-numeric="true">
                  {pick(s.shown, lang)}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
      {phase !== 'find' && whyOpts.length > 0 && (
        <>
          <h3 className="md-q">{t('errdet_why')}</h3>
          <Choices
            opts={whyOpts}
            state={why.state}
            disabled={why.done}
            lang={lang}
            label={t('errdet_why')}
            onPick={(id) => why.pick(id, whyOpts.find((w) => w.correct)?.id ?? '', () => round.info(t('errdet_hint'), 'try'), afterWhy)}
          />
        </>
      )}
      {phase === 'fix' && (
        <>
          <h3 className="md-q">{t('errdet_fix')}</h3>
          <Choices opts={fixOpts} state={fix.state} disabled={fix.done} lang={lang} label={t('errdet_fix')} onPick={(id) => fix.pick(id, 'good', () => round.info(t('errdet_hint'), 'try'), close)} />
        </>
      )}
    </ModuleShell>
  );
}
