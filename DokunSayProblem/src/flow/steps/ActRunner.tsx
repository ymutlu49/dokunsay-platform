/**
 * Canlandırma oynatıcısı (DESIGN §12). Vuruşları sırayla oynatır; her vuruşta hikâye cümlesi
 * vurgulanır/seslendirilir, kısa yönerge gösterilir, çocuk matta eylemi yapar → "Tamam" →
 * checkActState. Kipler: do (çocuk yapar) · guided (Rehber yapar, çocuk "Devam") · replay
 * (Kontrol et'te hikâye cevapla kendiliğinden oynar; düğme yok).
 * Hedef miktar çocuğa SAYI olarak söylenmez; yönerge eylemi anlatır (beatPrompt).
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import type { ActStrategy, L10n, Lang, Problem } from '../../content/types';
import { pick, useT } from '../../i18n';
import { actAskValue, actCheck, actExpected, actExpectedGroups, actInfer, actPrompt, actScript, sentenceSpoken } from '../../lib/contentAdapter';
import { speakSequence, voiceOn } from '../../lib/speech';
import { useReducedMotion } from '../../state/A11yContext';
import { MatBoard } from '../../components/mat/MatBoard';
import { countsOf, emptyZone, stepToward, type MatEvent, type MatState } from '../../components/mat/matState';
import { NumPad } from '../../components/NumPad';
import { SentenceView } from '../../components/StoryPanel';
import { Say } from '../../components/Talk';
import { matZonesFor, targetState } from './actPlan';
import { ActEnd } from './ActEnd';

export type ActMode = 'do' | 'guided' | 'replay';

export interface ActRunnerProps {
  problem: Problem;
  lang: Lang;
  stepIndex: number;
  mode: ActMode;
  showCounts: boolean;
  onOk?: (text?: L10n) => void;
  onWrong?: (hint?: L10n) => void;
  onReading?: (i: number | null) => void;
  onFinish: (strategies: ActStrategy[]) => void;
  /** Vuruş cümlesini oynatıcının içinde de göster (modal / dar ekran). */
  showSentence?: boolean;
  /** Sonda "Şimdi şeride dönüştürelim" geçişi. */
  morph?: boolean;
  speakBeats?: boolean;
}

type Phase = 'act' | 'reveal' | 'passed' | 'end';

export function ActRunner(p: ActRunnerProps) {
  const t = useT();
  const reduced = useReducedMotion();
  const { problem, lang, mode } = p;
  const script = useMemo(() => actScript(problem, lang, p.stepIndex), [problem, lang, p.stepIndex]);
  const [idx, setIdx] = useState(0);
  const [mat, setMat] = useState<MatState>({});
  const [phase, setPhase] = useState<Phase>('act');
  const [val, setVal] = useState('');
  const [revealed, setRevealed] = useState(false);
  const events = useRef<MatEvent[]>([]);
  const strategies = useRef<ActStrategy[]>([]);
  const stopSpeak = useRef<(() => void) | null>(null);
  const beat = script?.beats[idx];
  const sentences = problem.text[lang]?.length ? problem.text[lang] : problem.text.tr;
  const auto = mode !== 'do';

  // Vuruş başlangıcı: cümle vurgusu + seslendirme (cümle, sonra yönerge).
  useEffect(() => {
    if (!script || !beat) return;
    events.current = [];
    setVal('');
    setRevealed(false);
    p.onReading?.(beat.sentence);
    if (p.speakBeats && voiceOn(lang) && mode !== 'replay') {
      const s = sentences[beat.sentence];
      const parts = [s ? sentenceSpoken(s, lang) : '', pick(actPrompt(script, beat, problem, lang), lang)].filter(Boolean);
      stopSpeak.current?.();
      stopSpeak.current = speakSequence(parts, lang, () => undefined, () => (stopSpeak.current = null));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx, script]);
  useEffect(
    () => () => {
      stopSpeak.current?.();
      p.onReading?.(null);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  // Rehber / izleme: hedef duruma birim birim yürü; kutu en sonda açılır.
  useEffect(() => {
    if (!auto || !script || !beat || phase !== 'act') return;
    const target = targetState(script, idx, mat);
    const isBoxAsk = beat.kind === 'ask' && beat.read === 'box' && beat.zone;
    const finish = (m: MatState) => {
      let out = m;
      if (beat.kind === 'match') for (const id of beat.zones) out = { ...out, [id]: { ...(out[id] ?? emptyZone()), matched: true } };
      if (isBoxAsk) out = { ...out, [beat.zone!]: { ...(out[beat.zone!] ?? emptyZone()), open: true } };
      setMat(out);
      if (beat.kind === 'ask') setRevealed(true);
      setPhase('passed');
    };
    if (reduced) {
      finish(target);
      return;
    }
    let cur = mat;
    const id = setInterval(() => {
      const nx = stepToward(cur, target, script.units);
      if (!nx) {
        clearInterval(id);
        finish(cur);
        return;
      }
      cur = nx;
      setMat(nx);
    }, mode === 'replay' ? 90 : 150);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auto, idx, phase, script]);

  // İzleme kipinde sıradaki vuruşa kendiliğinden geç.
  useEffect(() => {
    if (mode !== 'replay' || phase !== 'passed') return;
    const id = setTimeout(advance, reduced ? 400 : 900);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, phase, idx]);

  // Geliştirme: tarayıcı testleri için salt-okur durum (üretim paketine girmez).
  if (import.meta.env.DEV && script && beat && mode === 'do') {
    (window as unknown as Record<string, unknown>).__act = {
      idx, phase, beat, zones: script.zones, counts: countsOf(mat), mat,
      expected: actExpected(script, idx), groups: actExpectedGroups(script, idx), ask: actAskValue(script, idx, problem),
    };
  }
  if (!script || !script.feasible || !beat) return null;

  function advance() {
    if (!script) return;
    if (idx + 1 < script.beats.length) {
      setIdx(idx + 1);
      setPhase('act');
    } else {
      setPhase('end');
      p.onReading?.(null);
      if (!p.morph) p.onFinish(strategies.current);
    }
  }

  const groupsOf = (m: MatState) => {
    const g = script.zones.find((z) => z.kind === 'group');
    return g ? (m[g.id]?.groups ?? []).filter((x) => x > 0) : undefined;
  };

  const pass = () => {
    const s = actInfer(events.current, script, idx);
    if (s && !strategies.current.includes(s)) strategies.current.push(s);
    p.onOk?.({ tr: t('act_ok'), ku: t('act_ok'), en: t('act_ok') });
    setPhase('passed');
    setTimeout(advance, reduced ? 300 : 800);
  };

  const done = () => {
    if (phase !== 'act' && phase !== 'reveal') return;
    if (beat.kind === 'match' && !beat.zones.every((z) => mat[z]?.matched)) {
      p.onWrong?.({ tr: t('act_match_first'), ku: t('act_match_first'), en: t('act_match_first') });
      return;
    }
    if (beat.kind === 'ask' && phase === 'act' && beat.read === 'box' && beat.zone) {
      const r = actCheck(script, idx, countsOf(mat), groupsOf(mat));
      if (!r.ok) return p.onWrong?.(r.hint);
      setMat({ ...mat, [beat.zone]: { ...(mat[beat.zone] ?? emptyZone()), open: true } });
      setPhase('reveal');
      return;
    }
    if (beat.kind === 'ask') {
      if (phase === 'act') {
        const r = actCheck(script, idx, countsOf(mat), groupsOf(mat));
        if (!r.ok) return p.onWrong?.(r.hint);
      }
      if (Number(val) !== actAskValue(script, idx, problem)) {
        setVal('');
        return p.onWrong?.();
      }
      setRevealed(true);
      return pass();
    }
    const r = actCheck(script, idx, countsOf(mat), groupsOf(mat));
    if (r.ok) pass();
    else p.onWrong?.(r.hint);
  };

  const isAsk = beat.kind === 'ask';
  const needsNumber = isAsk && (beat.read !== 'box' || phase === 'reveal');
  const zones = matZonesFor(script, idx, problem, lang, { revealed: revealed || phase === 'end' });
  const prompt = pick(actPrompt(script, beat, problem, lang), lang);
  const askAnswer = isAsk ? actAskValue(script, idx, problem) : null;

  if (phase === 'end' && p.morph) {
    return <ActEnd script={script} zones={zones} mat={mat} problem={problem} onDone={() => p.onFinish(strategies.current)} />;
  }

  return (
    <div className="act">
      {phase !== 'end' && (
        <div className="act__beat">
          {p.showSentence && sentences[beat.sentence] && (
            <p className="act__sentence">
              <span className="act__sentno">
                {t('act_sentence')} {beat.sentence + 1}
              </span>
              <SentenceView s={sentences[beat.sentence]} />
            </p>
          )}
          {prompt && mode !== 'replay' && (
            <p className="act__prompt">
              {prompt} <Say text={prompt} size={30} />
            </p>
          )}
          {mode === 'replay' && <p className="act__prompt">{t('act_replay')}</p>}
        </div>
      )}
      <MatBoard
        zones={zones}
        state={mat}
        onChange={setMat}
        units={script.units}
        mode={auto || phase === 'passed' || phase === 'end' ? 'watch' : 'edit'}
        showCounts={p.showCounts || auto}
        onEvent={(e) => events.current.push(e)}
        onEnter={needsNumber ? undefined : done}
      />
      {phase === 'end' && !p.morph && <p className="act__prompt">{t('act_replay_done')}</p>}
      {isAsk && auto && revealed && askAnswer != null && (
        <p className="act__readout" data-numeric="true">
          {t('act_ask_label')} <b>{askAnswer}</b>
        </p>
      )}
      {mode === 'do' && needsNumber && phase !== 'passed' && (
        <NumPad value={val} onChange={setVal} onSubmit={done} label={t('act_ask_label')} />
      )}
      {mode === 'do' && phase === 'act' && !needsNumber && (
        <div className="step-actions">
          <button type="button" className="btn btn--primary" onClick={done}>
            {isAsk ? t('act_open_box') : t('act_done')}
          </button>
        </div>
      )}
      {mode === 'guided' && phase === 'passed' && (
        <div className="step-actions">
          <button type="button" className="btn btn--primary" onClick={advance} autoFocus>
            {idx + 1 < script.beats.length ? t('act_next_beat') : t('btn_continue')} →
          </button>
        </div>
      )}
    </div>
  );
}
