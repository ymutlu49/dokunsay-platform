/**
 * Modüllerin ORTAK parçaları: tur yönetimi (useRound), kabuk (başlık + ilerleme + geri
 * bildirim + Devam), hikâye bloğu, seçenek listesi. Sade UI: cevaptan sonra yalnız tek
 * satır geri bildirim + Devam (Galaksay sade UI ilkesi; 03 §D1.4).
 * Geri bildirim `aria-live` bölgesinde; seslendirme ortak SpeakButton (KU sesi yoksa gizli).
 */
import { useCallback, useRef, useState, type ReactNode } from 'react';
import { SpeakButton } from '@shared/SpeakButton.jsx';
import type { ActStrategy, ErrorClass, Grade, Lang, Problem, SchemaId, Sentence } from '../content/types';
import { sentenceSpoken } from '../lib/contentAdapter';
import type { MT } from './i18n';
import { recordItem, type ModuleId } from './record';

export interface ModuleProps {
  lang: Lang;
  grade: Grade;
  seed: number;
  t: MT;
  onExit: () => void;
  onDone: (correct: number, total: number, reflection?: ReactNode) => void;
}

export type Tone = 'ok' | 'try' | 'reveal' | 'info';
export type AnswerResult = 'ok' | 'retry' | 'reveal';

export interface RoundApi {
  index: number;
  total: number;
  attempts: number;
  solved: boolean;
  fb: { tone: Tone; text: string } | null;
  correct: number;
  /** Cevabı işle. İlk denemede kayıt yazılır. 2. yanlışta doğru gösterilir (reveal). */
  answer: (ok: boolean, text: string, rec?: { schema?: SchemaId; chosen?: SchemaId; error?: ErrorClass; problemId?: string }) => AnswerResult;
  info: (text: string, tone?: Tone) => void;
  /** Çok aşamalı maddeyi tek seferde kapatır (aşamaları modül yönetir): kayıt + sayım + çözüldü. */
  finish: (ok: boolean, text: string, rec?: { schema?: SchemaId; error?: ErrorClass; problemId?: string; strategies?: ActStrategy[] }) => void;
  next: () => void;
}

export function useRound(module: ModuleId, grade: Grade, total: number, onDone: ModuleProps['onDone'], maxTries = 2): RoundApi {
  const [index, setIndex] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [solved, setSolved] = useState(false);
  const [fb, setFb] = useState<RoundApi['fb']>(null);
  const correctRef = useRef(0);
  const [correct, setCorrect] = useState(0);

  const answer: RoundApi['answer'] = (ok, text, rec) => {
    if (attempts === 0) recordItem({ module, grade, correct: ok, ...rec });
    if (ok) {
      if (attempts === 0) {
        correctRef.current += 1;
        setCorrect(correctRef.current);
      }
      setSolved(true);
      setFb({ tone: 'ok', text });
      return 'ok';
    }
    const n = attempts + 1;
    setAttempts(n);
    if (n >= maxTries) {
      setSolved(true);
      setFb({ tone: 'reveal', text });
      return 'reveal';
    }
    setFb({ tone: 'try', text });
    return 'retry';
  };

  const info = useCallback((text: string, tone: Tone = 'info') => setFb({ tone, text }), []);

  const finish: RoundApi['finish'] = (ok, text, rec) => {
    recordItem({ module, grade, correct: ok, ...rec });
    if (ok) {
      correctRef.current += 1;
      setCorrect(correctRef.current);
    }
    setSolved(true);
    setFb({ tone: ok ? 'ok' : 'reveal', text });
  };

  const next = () => {
    if (index + 1 >= total) {
      onDone(correctRef.current, total);
      return;
    }
    setIndex(index + 1);
    setAttempts(0);
    setSolved(false);
    setFb(null);
  };

  return { index, total, attempts, solved, fb, correct, answer, info, finish, next };
}

export function ModuleShell({
  title,
  t,
  lang,
  round,
  onExit,
  children,
  hideContinue,
}: {
  title: string;
  t: MT;
  lang: Lang;
  round: Pick<RoundApi, 'index' | 'total' | 'fb' | 'solved' | 'next'>;
  onExit: () => void;
  children: ReactNode;
  hideContinue?: boolean;
}) {
  return (
    <section className="md-shell" aria-label={title}>
      <header className="md-shell__head">
        <button type="button" className="md-btn md-btn--ghost" onClick={onExit}>
          ← {t('back_cards')}
        </button>
        <h2 className="md-shell__title">{title}</h2>
        <span className="md-progress" aria-label={t('item_of', { i: round.index + 1, n: round.total })}>
          {Array.from({ length: round.total }, (_, i) => (
            <span key={i} className={`md-dot${i < round.index ? ' is-done' : i === round.index ? ' is-now' : ''}`} aria-hidden="true" />
          ))}
          <span className="md-progress__txt">{t('item_of', { i: round.index + 1, n: round.total })}</span>
        </span>
      </header>
      <div className="md-shell__body">{children}</div>
      <FeedbackLine fb={round.fb} lang={lang} />
      {round.solved && !hideContinue && (
        <div className="md-actions">
          <button type="button" className="md-btn md-btn--primary" onClick={round.next} autoFocus>
            {t('btn_continue')} →
          </button>
        </div>
      )}
    </section>
  );
}

export function FeedbackLine({ fb, lang }: { fb: RoundApi['fb']; lang: Lang }) {
  return (
    <div className="md-fb-wrap" role="status" aria-live="polite">
      {fb && (
        <div className={`md-fb md-fb--${fb.tone}`} data-semantic={fb.tone === 'ok' ? 'positive' : fb.tone === 'info' ? undefined : 'negative'}>
          <p className="md-fb__text">{fb.text}</p>
          <SpeakButton text={fb.text} lang={lang} size={30} className="md-say" />
        </div>
      )}
    </div>
  );
}

/** Hikâye: cümleler + tüm hikâyeyi okuyan tek 🔊 (her cümlede ayrı düğme sade UI'yı bozardı). */
export function StoryBlock({ problem, lang, t, label, compact, reading }: { problem: Problem; lang: Lang; t: MT; label?: string; compact?: boolean; reading?: number | null }) {
  const sentences = problem.text[lang]?.length ? problem.text[lang] : problem.text.tr;
  const spoken = () => sentences.map((s) => sentenceSpoken(s, lang)).join(' ');
  return (
    <div className={`md-story${compact ? ' md-story--compact' : ''}`}>
      <div className="md-story__head">
        <span className="md-story__label">{label ?? t('story')}</span>
        <SpeakButton text={spoken} lang={lang} size={32} className="md-say" title={t('btn_listen_story')} />
      </div>
      <p className="md-story__text">
        {sentences.map((s, i) => (
          <span key={i} className={[s.isQuestion ? 'md-story__q' : '', reading === i ? 'is-reading' : ''].filter(Boolean).join(' ') || undefined}>
            <SentenceLine s={s} />{' '}
          </span>
        ))}
      </p>
    </div>
  );
}

/** Cümle: sayılar çip görünümünde; gereksiz sayı AYIRT EDİLMEZ (Gereksizi Ayıkla'da cevabı ele vermesin). */
export function SentenceLine({ s }: { s: Sentence }) {
  return (
    <>
      {s.segments.map((g, i) =>
        g.kind === 'qty' ? (
          <span key={i} className="md-num" data-numeric="true">
            {g.text}
          </span>
        ) : (
          <span key={i}>{g.text}</span>
        ),
      )}
    </>
  );
}

export interface ChoiceOpt {
  id: string;
  text: string;
  node?: ReactNode;
}

/** Büyük seçenek düğmeleri (≥44 px), her birinin yanında 🔊. Durum: renk + simge + metin. */
export function Choices({
  opts,
  onPick,
  state,
  disabled,
  lang,
  label,
  columns,
}: {
  opts: ChoiceOpt[];
  onPick: (id: string) => void;
  state?: Record<string, 'ok' | 'bad' | undefined>;
  disabled?: boolean;
  lang: Lang;
  label: string;
  columns?: boolean;
}) {
  return (
    <div className={`md-choices${columns ? ' md-choices--cols' : ''}`} role="group" aria-label={label}>
      {opts.map((o) => {
        const st = state?.[o.id];
        return (
          <div key={o.id} className="md-choice-row">
            <button
              type="button"
              className={`md-choice${st ? ` is-${st}` : ''}`}
              onClick={() => onPick(o.id)}
              disabled={disabled || st === 'bad'}
              aria-pressed={!!st}
              data-semantic={st === 'ok' ? 'positive' : st === 'bad' ? 'negative' : undefined}
            >
              {st && (
                <span className="md-choice__mark" aria-hidden="true">
                  {st === 'ok' ? '✓' : '!'}
                </span>
              )}
              {o.node ?? o.text}
            </button>
            <SpeakButton text={o.text} lang={lang} size={28} className="md-say" />
          </div>
        );
      })}
    </div>
  );
}

export function Preparing({ t, onExit }: { t: MT; onExit: () => void }) {
  return (
    <section className="md-shell md-empty">
      <h2 className="md-shell__title">{t('preparing_title')}</h2>
      <p>{t('preparing_body')}</p>
      <button type="button" className="md-btn md-btn--primary" onClick={onExit}>
        ← {t('back_cards')}
      </button>
    </section>
  );
}

/**
 * Çok aşamalı maddelerde tek bir aşamanın seçimi: 1. yanlışta işaret + ipucu, 2. yanlışta
 * doğru gösterilir ve aşama kapanır. `onResolve(firstTry)` aşama kapanınca bir kez çağrılır.
 */
export function usePhase() {
  const [state, setState] = useState<Record<string, 'ok' | 'bad' | undefined>>({});
  const [tries, setTries] = useState(0);
  const [done, setDone] = useState(false);
  const pickOpt = (id: string, correctId: string, onWrong: () => void, onResolve: (firstTry: boolean) => void) => {
    if (done || state[id] === 'bad') return;
    if (id === correctId) {
      setState((s) => ({ ...s, [id]: 'ok' }));
      setDone(true);
      onResolve(tries === 0);
      return;
    }
    const n = tries + 1;
    setTries(n);
    if (n >= 2) {
      setState((s) => ({ ...s, [id]: 'bad', [correctId]: 'ok' }));
      setDone(true);
      onResolve(false);
    } else {
      setState((s) => ({ ...s, [id]: 'bad' }));
      onWrong();
    }
  };
  const reset = () => {
    setState({});
    setTries(0);
    setDone(false);
  };
  return { state, tries, done, pick: pickOpt, reset };
}
