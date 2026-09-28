/**
 * GÖSTER — Canlandır (DESIGN §12): hikâyeyi cümle cümle sanal manipülatiflerle canlandır, sonra
 * sayaçları şeride dönüştür. S3'te Rehber oynatır (çocuk "Devam"), S2'de çocuk yapar.
 * ActTryButton: S1/S0'da model/denklem/hesap adımlarında "🧮 Nesnelerle dene" — aynı oynatıcı
 * çekmece/modal olarak açılır; puanlanmaz, yalnız attempt.actUsed kaydı düşer.
 */
import { useEffect, useState } from 'react';
import { sfx } from '@shared/audio.js';
import type { Dispatch } from 'react';
import type { L10n, Lang, Problem } from '../../content/types';
import { useT } from '../../i18n';
import { feedbackText } from '../../lib/contentAdapter';
import type { SolveAction } from '../../state/solveReducer';
import { FeedbackBubble } from '../../components/Talk';
import { ActRunner } from './ActRunner';
import type { StepProps } from './common';

export function ActStep({ s, dispatch, link, lang, guided, next, ok, wrong, setReading }: StepProps & { setReading: (i: number | null) => void }) {
  return (
    <div className="step step-act">
      <ActRunner
        problem={s.problem}
        lang={lang}
        stepIndex={link}
        mode={guided ? 'guided' : 'do'}
        showCounts={s.level >= 2}
        onOk={(text) => ok(text)}
        onWrong={(hint) => wrong('actMismatch', hint)}
        onReading={setReading}
        onFinish={(strategies) => {
          dispatch({ type: 'act', link, strategies });
          next();
        }}
        morph
        speakBeats
        showSentence
      />
    </div>
  );
}

export function ActTryButton({ problem, lang, stepIndex, dispatch }: { problem: Problem; lang: Lang; stepIndex: number; dispatch: Dispatch<SolveAction> }) {
  const t = useT();
  const [open, setOpen] = useState(false);
  const [fb, setFb] = useState<{ tone: 'ok' | 'wrong'; text: L10n; n: number } | null>(null);
  const [finished, setFinished] = useState(false);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);
  return (
    <>
      <button
        type="button"
        className="btn btn--soft act-try"
        onClick={() => {
          setOpen(true);
          setFinished(false);
          setFb(null);
          dispatch({ type: 'actUsed' });
        }}
      >
        {t('act_try')}
      </button>
      {open && (
        <div className="modal-back" role="presentation" onClick={(e) => e.target === e.currentTarget && setOpen(false)}>
          <div className="modal modal--act" role="dialog" aria-modal="true" aria-label={t('act_try_title')}>
            <div className="modal--act__head">
              <h2 className="modal--act__title">{t('act_try_title')}</h2>
              <button type="button" className="btn btn--ghost" onClick={() => setOpen(false)} autoFocus>
                {t('btn_close')}
              </button>
            </div>
            <p className="kbd-hint">{t('act_try_note')}</p>
            {!finished ? (
              <ActRunner
                problem={problem}
                lang={lang}
                stepIndex={stepIndex}
                mode="do"
                showCounts={false}
                showSentence
                onOk={(text) => {
                  sfx.correct();
                  setFb({ tone: 'ok', text: text ?? feedbackText('correct', problem, 'act'), n: (fb?.n ?? 0) + 1 });
                }}
                onWrong={(hint) => {
                  sfx.wrong();
                  setFb({ tone: 'wrong', text: hint ?? feedbackText('actMismatch', problem, 'act'), n: (fb?.n ?? 0) + 1 });
                }}
                onFinish={() => setFinished(true)}
              />
            ) : (
              <>
                <p className="act__prompt">{t('act_replay_done')}</p>
                <div className="step-actions">
                  <button type="button" className="btn btn--primary" onClick={() => setOpen(false)}>
                    {t('btn_close')}
                  </button>
                </div>
              </>
            )}
            {fb && !finished && <FeedbackBubble tone={fb.tone} text={fb.text} n={fb.n} />}
          </div>
        </div>
      )}
    </>
  );
}
