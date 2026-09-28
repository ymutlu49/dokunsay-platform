/**
 * "Problem Çöz" sekmesi denetleyicisi: başlangıç ↔ çözüm, ilerleme/oturum kaydı,
 * paylaşım ve platform derin bağlantıları (#p=, #sema=&bilinmeyen=, #mod=karisik).
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import type { Grade, Problem, ProblemSpec, ScaffoldLevel, SchemaId } from '../content/types';
import { pick, useLang, useT } from '../i18n';
import { makeProblem, rungsFor, schemaMeta } from '../lib/contentAdapter';
import {
  appendAttempt, applyResult, loadProgress, loadSession, mixedEligible, newSchemaProgress, saveProgress, saveSession,
  type LevelChange, type ProgressState, type SessionInfo,
} from '../lib/progress';
import { encodeShare, minGradeFor, shareUrl, writeHash, type HashRoute } from '../lib/share';
import type { SolveState } from '../state/solveReducer';
import { SolveScreen } from './SolveScreen';
import { StartScreen, LVL_KEY } from './StartScreen';
import { GuideBalloon } from '../components/Talk';
import { problemsOfSet, readSetHash } from '../teacher/setShare';

interface Current {
  problem: Problem;
  spec: ProblemSpec;
  schema: SchemaId;
  level: ScaffoldLevel;
  examples: number;
  mode: 'path' | 'mixed' | 'link' | 'set';
  /** Öğretmen seti (#set=): kaçıncı problem / toplam */
  setPos?: { i: number; n: number };
  withReflect: boolean;
  n: number;
}

const rndSeed = () => Math.floor(Math.random() * 1e6) + 1;

export function SolvePage({ initial }: { initial: HashRoute }) {
  const t = useT();
  const lang = useLang();
  const [progress, setProgress] = useState<ProgressState>(loadProgress);
  const [session, setSession] = useState<SessionInfo>(loadSession);
  const [grade, setGradeState] = useState<Grade>(() => progress.grade ?? 1);
  const [cur, setCur] = useState<Current | null>(null);
  const [error, setError] = useState(false);
  const [result, setResult] = useState<{ change: LevelChange | null; mustRepeat: boolean } | null>(null);
  const [copied, setCopied] = useState(false);
  const recent = useRef<string[]>([]);
  const mixIdx = useRef(0);
  const setQueue = useRef<Problem[]>([]);

  const setGrade = (g: Grade) => {
    setGradeState(g);
    const p = { ...progress, grade: g };
    setProgress(p);
    saveProgress(p);
  };

  const launch = useCallback(
    (spec: ProblemSpec, mode: Current['mode'], prog: ProgressState, sess: SessionInfo, given?: Problem, setPos?: Current['setPos']) => {
      const problem = given ?? makeProblem({ ...spec, exclude: recent.current });
      if (!problem) {
        setError(true);
        return;
      }
      setError(false);
      recent.current = [...recent.current, problem.id].slice(-10);
      const schema = problem.steps[0].schema;
      let sp = prog.schemas[schema];
      let nextSess = sess;
      if (!sp) {
        sp = newSchemaProgress(3);
        nextSess = { ...sess, newSchema: sess.newSchema ?? schema };
      }
      const withReflect = sp.level < 3 && nextSess.reflectCount < 2 && nextSess.solved % 2 === 1;
      const nextProg: ProgressState = {
        ...prog,
        schemas: { ...prog.schemas, [schema]: sp },
        last: { mode: mode === 'mixed' ? 'mixed' : 'path', schema, grade: spec.grade },
      };
      setProgress(nextProg);
      saveProgress(nextProg);
      setSession(nextSess);
      saveSession(nextSess);
      setResult(null);
      setCur((c) => ({ problem, spec: { ...spec, seed: problem.seed }, schema, level: sp!.level, examples: sp!.examples, mode, withReflect, n: (c?.n ?? 0) + 1, setPos }));
      if (mode !== 'set') writeHash({ tab: 'solve', p: encodeShare({ ...spec, seed: problem.seed }) });
    },
    [],
  );

  const specFor = (schema: SchemaId, g: Grade, prog: ProgressState): ProblemSpec => {
    const rungs = rungsFor(schema, g);
    const r = rungs[Math.min(prog.schemas[schema]?.rung ?? 0, Math.max(0, rungs.length - 1))];
    return { ...(r?.spec ?? { schema }), schema, grade: g, seed: rndSeed() };
  };

  const startPath = (schema: SchemaId) => launch(specFor(schema, grade, progress), 'path', progress, session);
  const startMixed = () => {
    const pool = mixedEligible(progress);
    if (!pool.length) return;
    const schema = pool[mixIdx.current++ % pool.length];
    launch(specFor(schema, grade, progress), 'mixed', progress, session);
  };

  const launchSetItem = (i: number) => {
    const p = setQueue.current[i];
    if (!p) return;
    launch({ grade: p.grade, schema: p.steps[0].schema, seed: p.seed }, 'set', progress, session, p, { i, n: setQueue.current.length });
  };

  // Derin bağlantılar — yalnız ilk açılışta bir kez.
  const handled = useRef(false);
  useEffect(() => {
    if (handled.current) return;
    handled.current = true;
    const setSpec = readSetHash();
    if (setSpec) {
      setQueue.current = problemsOfSet(setSpec);
      setGradeState(setSpec.grade);
      if (setQueue.current.length) {
        launchSetItem(0);
        return;
      }
    }
    if (initial.share) launch(initial.share, 'link', progress, session);
    else if (initial.deep) {
      const { schema, unknown } = initial.deep;
      const min = minGradeFor(schema, unknown);
      const g = (Math.max(progress.grade ?? min, min) as Grade);
      setGradeState(g);
      const base = specFor(schema, g, progress);
      launch(unknown ? { grade: g, schema, unknown, seed: rndSeed() } : base, 'link', progress, session);
    } else if (initial.mixed) {
      if (mixedEligible(progress).length) startMixed();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onDone = useCallback(
    (st: SolveState) => {
      if (!cur) return;
      const correct = st.computeWrong === 0 && !st.usedH4;
      const rungCount = rungsFor(cur.schema, cur.spec.grade).length;
      const { next, change } = applyResult(progress, cur.schema, {
        correct,
        maxHint: st.maxHint,
        usedH4: st.usedH4,
        modelFirstTry: st.modelFirstTry,
        modelFailStreak: st.modelFailStreak,
        rungCount,
      });
      setProgress(next);
      saveProgress(next);
      const sess = { ...session, solved: session.solved + 1, reflectCount: session.reflectCount + (st.reflect ? 1 : 0) };
      setSession(sess);
      saveSession(sess);
      appendAttempt({
        problemId: st.problem.id,
        seed: st.problem.seed,
        grade: st.problem.grade,
        schemas: st.problem.steps.map((x) => x.schema),
        level: cur.level,
        correct,
        errors: st.errors,
        maxHint: st.maxHint,
        usedH4: st.usedH4,
        modelFirstTry: st.modelFirstTry,
        stepTimes: st.stepTimes,
        reflect: st.reflect ?? undefined,
        actStrategies: st.actStrategies.length ? st.actStrategies : undefined,
        actUsed: st.actUsed || undefined,
        ts: Date.now(),
      });
      setResult({ change, mustRepeat: st.usedH4 });
    },
    [cur, progress, session],
  );

  const nextProblem = (same: boolean) => {
    if (!cur) return;
    if (cur.mode === 'set' && cur.setPos) {
      if (cur.setPos.i + 1 < cur.setPos.n) launchSetItem(cur.setPos.i + 1);
      else home();
      return;
    }
    if (cur.mode === 'mixed' && !same) startMixed();
    else launch(specFor(cur.schema, cur.spec.grade, progress), cur.mode === 'link' ? 'path' : cur.mode, progress, session);
  };
  const home = () => {
    setCur(null);
    setResult(null);
    writeHash({ tab: 'solve' });
  };
  const share = async () => {
    if (!cur) return;
    try {
      await navigator.clipboard.writeText(shareUrl(cur.spec));
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      window.prompt(t('share_title'), shareUrl(cur.spec));
    }
  };

  if (!cur) {
    return (
      <>
        {error && <p className="notice notice--warn">{t('problem_error')}</p>}
        <StartScreen
          progress={progress}
          session={session}
          grade={grade}
          setGrade={setGrade}
          onPath={startPath}
          onMixed={startMixed}
          onResume={() => {
            const l = progress.last;
            if (!l) return;
            setGradeState(l.grade);
            if (l.mode === 'mixed') startMixed();
            else if (l.schema) launch(specFor(l.schema, l.grade, progress), 'path', progress, session);
          }}
        />
      </>
    );
  }

  const changeText = result?.change
    ? t('level_changed', { schema: pick(schemaMeta(result.change.schema).name, lang), from: t(LVL_KEY[result.change.from]), to: t(LVL_KEY[result.change.to]) })
    : '';
  const donePanel = (
    <div className="done" role="status">
      <h2 className="done__title">{t('done_title')}</h2>
      <p>{t('done_text')}</p>
      {changeText && <p className="done__level">{changeText}</p>}
      {result?.mustRepeat && cur.mode !== 'set' && <GuideBalloon text={t('must_repeat')} />}
      {cur.setPos && <p className="done__level">{t('set_progress', { i: String(cur.setPos.i + 1), n: String(cur.setPos.n) })}</p>}
      <div className="step-actions">
        <button type="button" className="btn btn--ghost" onClick={home}>
          {t('btn_home')}
        </button>
        {cur.mode === 'set' ? (
          <button type="button" className="btn btn--primary" onClick={() => nextProblem(true)} autoFocus>
            {cur.setPos && cur.setPos.i + 1 < cur.setPos.n ? `${t('btn_new_problem')} →` : t('set_done')}
          </button>
        ) : (<>
        {!result?.mustRepeat && cur.mode === 'mixed' && (
          <button type="button" className="btn btn--soft" onClick={() => nextProblem(false)}>
            {t('btn_new_problem')}
          </button>
        )}
        <button type="button" className="btn btn--primary" onClick={() => nextProblem(true)} autoFocus>
          {result?.mustRepeat ? t('btn_same_type') : t('btn_new_problem')} →
        </button>
        </>)}
      </div>
    </div>
  );

  return (
    <>
      {copied && <p className="toast" role="status">{t('btn_copied')}</p>}
      <SolveScreen
        key={`${cur.problem.id}-${cur.n}`}
        problem={cur.problem}
        level={cur.level}
        examples={cur.examples}
        withReflect={cur.withReflect}
        onDone={onDone}
        onShare={share}
        onHome={home}
        done={donePanel}
      />
    </>
  );
}
