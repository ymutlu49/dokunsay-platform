/**
 * Projeksiyon kipi: tek problem, büyük yazı; akıllı tahtada sınıfça ADIM ADIM çözme
 * (Ben yaparım → Birlikte; 03 §E1). Aşamalar: Anla → Göster (etiketler) → Göster (sayılar
 * + ?) → Tahmin → Çöz (denklem) → Kontrol (cevap cümlesi). Klavye: →/Boşluk ileri,
 * ← geri, Esc çık. Tam ekran isteğe bağlı (Fullscreen API).
 * "🧮 Canlandır" (DESIGN §12): uygun problemde ActRunner akıllı tahta ölçeğinde açılır — "Birlikte yap"
 * (bir öğrenci tahtada yapar) ya da "Rehber oynatsın"; canlandırma açıkken ok/boşluk adım değiştirmez,
 * Esc yalnız canlandırmayı kapatır. Kayıt yazılmaz (sınıf etkinliği).
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import { SpeakButton } from '@shared/SpeakButton.jsx';
import type { Lang, Problem, Role } from '../content/types';
import { pick } from '../i18n';
import { actFeasible, answerText, equationFor, feedbackText, schemaMeta, sentenceSpoken, sentenceString } from '../lib/contentAdapter';
import { ActRunner } from '../flow/steps/ActRunner';
import { tokensText } from '../lib/problemUtil';
import { SchemaDiagram, type BoxContent } from '../components/diagram/SchemaDiagram';
import type { TKey, TT } from './i18n';

const STAGES: { main: 1 | 2 | 3 | 4 | 5; prompt: TKey }[] = [
  { main: 1, prompt: 'pj_p1' },
  { main: 2, prompt: 'pj_p2' },
  { main: 2, prompt: 'pj_p2b' },
  { main: 3, prompt: 'pj_p3' },
  { main: 4, prompt: 'pj_p4' },
  { main: 5, prompt: 'pj_p5' },
];

export function Projection({ problem, lang, t, onClose, onNew }: { problem: Problem; lang: Lang; t: TT; onClose: () => void; onNew: () => void }) {
  const [stage, setStage] = useState(0);
  const [act, setAct] = useState<null | 'do' | 'guided'>(null);
  const [actRun, setActRun] = useState(0);
  const [actFb, setActFb] = useState<{ tone: 'ok' | 'try'; text: string } | null>(null);
  const [actDone, setActDone] = useState(false);
  const [reading, setReading] = useState<number | null>(null);
  const actRef = useRef(act);
  actRef.current = act;
  const root = useRef<HTMLDivElement>(null);
  const last = STAGES.length - 1;
  const canAct = useMemo(() => actFeasible(problem, 0), [problem]);

  const openAct = (mode: 'do' | 'guided') => {
    setAct(mode);
    setActRun((n) => n + 1);
    setActFb(null);
    setActDone(false);
  };
  const closeAct = () => {
    setAct(null);
    setReading(null);
    root.current?.focus();
  };

  useEffect(() => {
    setStage(0);
    setAct(null);
    setReading(null);
  }, [problem.id]);
  useEffect(() => {
    root.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (actRef.current) {
        if (e.key === 'Escape') closeAct();
        return;
      }
      if (e.key === 'ArrowRight' || e.key === 'PageDown' || (e.key === ' ' && (e.target as HTMLElement)?.tagName !== 'BUTTON')) {
        e.preventDefault();
        setStage((s) => Math.min(last, s + 1));
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        setStage((s) => Math.max(0, s - 1));
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [last, onClose]);

  const sentences = problem.text[lang]?.length ? problem.text[lang] : problem.text.tr;
  const cur = STAGES[stage];
  const boxes = (k: number): Partial<Record<Role, BoxContent>> => {
    const st = problem.steps[k];
    return Object.fromEntries(
      st.quantities.map((q) => [q.role, { label: pick(q.label, lang), value: stage >= 2 ? (q.role === st.unknown ? '?' : q.value) : undefined }]),
    );
  };
  const full = () => {
    const el = root.current;
    if (el && !document.fullscreenElement) el.requestFullscreen?.().catch(() => undefined);
    else document.exitFullscreen?.().catch(() => undefined);
  };

  return (
    <div className="tc-proj" ref={root} tabIndex={-1} role="dialog" aria-modal="true" aria-label={t('tab_projection')}>
      <header className="tc-proj__bar">
        <ol className="tc-proj__rail">
          {[1, 2, 3, 4, 5].map((m) => (
            <li key={m} className={m === cur.main ? 'is-now' : m < cur.main ? 'is-done' : ''} aria-current={m === cur.main ? 'step' : undefined}>
              {t(`pj_s${m}` as TKey)}
            </li>
          ))}
        </ol>
        <div className="tc-proj__tools">
          {canAct && (
            <button type="button" className={`tc-btn${act ? ' is-on' : ''}`} aria-pressed={!!act} onClick={() => (act ? closeAct() : openAct('do'))}>
              {t('pj_act')}
            </button>
          )}
          <button type="button" className="tc-btn" onClick={full} aria-label="⛶">
            ⛶
          </button>
          <button type="button" className="tc-btn" onClick={onNew}>
            {t('pj_new')}
          </button>
          <button type="button" className="tc-btn tc-btn--primary" onClick={onClose}>
            {t('pj_close')} ✕
          </button>
        </div>
      </header>
      <main className="tc-proj__body">
        <div className="tc-proj__story">
          <SpeakButton text={() => sentences.map((s) => sentenceSpoken(s, lang)).join(' ')} lang={lang} size={40} className="md-say" />
          <p>
            {sentences.map((s, i) => (
              <span key={i} className={act && reading === i ? 'tc-proj__reading' : s.isQuestion && stage === 0 && !act ? 'tc-proj__q' : undefined}>
                {sentenceString(s)}{' '}
              </span>
            ))}
          </p>
        </div>
        {act && (
          <section className="tc-proj-act" aria-label={t('pj_act')}>
            <div className="tc-proj-act__bar">
              <p className="tc-muted">{t('pj_act_desc')}</p>
              <div className="tc-proj-act__modes" role="group" aria-label={t('pj_act')}>
                <button type="button" className={`tc-btn${act === 'do' ? ' tc-btn--primary' : ''}`} aria-pressed={act === 'do'} onClick={() => openAct('do')}>
                  {t('pj_act_do')}
                </button>
                <button type="button" className={`tc-btn${act === 'guided' ? ' tc-btn--primary' : ''}`} aria-pressed={act === 'guided'} onClick={() => openAct('guided')}>
                  {t('pj_act_watch')}
                </button>
                <button type="button" className="tc-btn" onClick={closeAct}>
                  ← {t('pj_act_back')}
                </button>
              </div>
            </div>
            <ActRunner
              key={`${problem.id}-${act}-${actRun}`}
              problem={problem}
              lang={lang}
              stepIndex={0}
              mode={act}
              showCounts
              speakBeats
              onReading={setReading}
              onOk={() => setActFb(null)}
              onWrong={(hint) => setActFb({ tone: 'try', text: pick(hint ?? feedbackText('actMismatch', problem, 'act'), lang) })}
              onFinish={() => {
                setActDone(true);
                setActFb({ tone: 'ok', text: t('pj_act_done') });
              }}
            />
            <p className={`tc-proj-act__fb${actFb ? ` is-${actFb.tone}` : ''}`} role="status" aria-live="polite">
              {actFb?.text ?? ''}
            </p>
            {actDone && (
              <div className="tc-proj-act__end">
                <button
                  type="button"
                  className="tc-btn tc-btn--primary tc-btn--big"
                  onClick={() => {
                    closeAct();
                    setStage(1);
                  }}
                >
                  {t('pj_act_back')} →
                </button>
              </div>
            )}
          </section>
        )}
        {!act && (
          <p className="tc-proj__prompt" aria-live="polite">
            {t(cur.prompt)}
          </p>
        )}
        {!act && stage >= 1 && (
          <div className="tc-proj__diagrams">
            {problem.steps.map((st, k) => (
              <div key={k}>
                <p className="tc-proj__schema" style={{ color: schemaMeta(st.schema).color }}>
                  {pick(schemaMeta(st.schema).name, lang)}
                </p>
                <SchemaDiagram step={st} lang={lang} mode={stage >= 4 ? 'scaled' : 'build'} boxes={boxes(k)} showRoleNames units />
                {stage >= 4 && (
                  <p className="tc-proj__eq" data-numeric="true">
                    {tokensText(equationFor(st).tokens)}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
        {!act && stage >= 5 && problem.answer >= 0 && <p className="tc-proj__answer">{answerText(problem, lang, problem.answer)}</p>}
      </main>
      {!act && (
        <footer className="tc-proj__nav">
          <button type="button" className="tc-btn tc-btn--big" onClick={() => setStage((s) => Math.max(0, s - 1))} disabled={stage === 0}>
            ← {t('pj_prev')}
          </button>
          <button type="button" className="tc-btn tc-btn--big tc-btn--primary" onClick={() => setStage((s) => Math.min(last, s + 1))} disabled={stage === last}>
            {t('pj_next')} →
          </button>
        </footer>
      )}
    </div>
  );
}
