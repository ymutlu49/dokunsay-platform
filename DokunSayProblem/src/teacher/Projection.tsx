/**
 * Projeksiyon kipi: tek problem, büyük yazı; akıllı tahtada sınıfça ADIM ADIM çözme
 * (Ben yaparım → Birlikte; 03 §E1). Aşamalar: Anla → Göster (etiketler) → Göster (sayılar
 * + ?) → Tahmin → Çöz (denklem) → Kontrol (cevap cümlesi). Klavye: →/Boşluk ileri,
 * ← geri, Esc çık. Tam ekran isteğe bağlı (Fullscreen API).
 */
import { useEffect, useRef, useState } from 'react';
import { SpeakButton } from '@shared/SpeakButton.jsx';
import type { Lang, Problem, Role } from '../content/types';
import { pick } from '../i18n';
import { answerText, equationFor, schemaMeta, sentenceSpoken, sentenceString } from '../lib/contentAdapter';
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
  const root = useRef<HTMLDivElement>(null);
  const last = STAGES.length - 1;

  useEffect(() => setStage(0), [problem.id]);
  useEffect(() => {
    root.current?.focus();
    const onKey = (e: KeyboardEvent) => {
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
              <span key={i} className={s.isQuestion && stage === 0 ? 'tc-proj__q' : undefined}>
                {sentenceString(s)}{' '}
              </span>
            ))}
          </p>
        </div>
        <p className="tc-proj__prompt" aria-live="polite">
          {t(cur.prompt)}
        </p>
        {stage >= 1 && (
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
        {stage >= 5 && problem.answer >= 0 && <p className="tc-proj__answer">{answerText(problem, lang, problem.answer)}</p>}
      </main>
      <footer className="tc-proj__nav">
        <button type="button" className="tc-btn tc-btn--big" onClick={() => setStage((s) => Math.max(0, s - 1))} disabled={stage === 0}>
          ← {t('pj_prev')}
        </button>
        <button type="button" className="tc-btn tc-btn--big tc-btn--primary" onClick={() => setStage((s) => Math.min(last, s + 1))} disabled={stage === last}>
          {t('pj_next')} →
        </button>
      </footer>
    </div>
  );
}
