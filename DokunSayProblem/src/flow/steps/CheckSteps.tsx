/**
 * KONTROL ET — answer: cevap cümlesi kalıbına sayı (kalanlı bölmede önce yorum seçimi);
 * reasonable: tahminle karşılaştır + "Cevabı hikâyeye koy" (sesli) + ters işlem;
 * reflect: "En çok hangi adım yardım etti?" (5 simge; oturumda en fazla 2 kez).
 */
import { useEffect, useMemo, useState } from 'react';
import { MAIN_STEPS, type MainStep } from '../../content/types';
import { useT, type Key } from '../../i18n';
import { answerText, equationFor, sentenceSpoken } from '../../lib/contentAdapter';
import { fillUnknown, inverseOf, knownMax, shuffleSeeded, tokensSpeech, unknownValue } from '../../lib/problemUtil';
import { speak, voiceOn } from '../../lib/speech';
import { StepIcon } from '../../components/icons';
import { Say } from '../../components/Talk';
import { EqDisplay } from './SolveSteps';
import { NextBtn, type StepProps } from './common';

export function AnswerStep({ s, dispatch, link, lang, next, ok, wrong, guided }: StepProps) {
  const t = useT();
  const step = s.problem.steps[link];
  const raw = s.linkResults[link] ?? unknownValue(step);
  const rem = step.remainder;
  const options = useMemo(() => {
    if (!rem) return [];
    const o = [
      { key: 'roundUp', v: raw + 1, label: t('rem_up', { v: raw + 1 }) },
      { key: 'roundDown', v: raw, label: t('rem_down', { v: raw }) },
      { key: 'remainderIsAnswer', v: rem.value, label: t('rem_rem', { v: rem.value }) },
    ];
    return shuffleSeeded(o, s.problem.seed);
  }, [rem, raw, s.problem.seed, t]);
  const [remOk, setRemOk] = useState(!rem || guided);
  const [bad, setBad] = useState<string[]>([]);
  const [placed, setPlaced] = useState(guided);
  const final = s.problem.answer;
  useEffect(() => {
    if (guided && s.finalAnswer == null) dispatch({ type: 'answer', value: final });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [guided]);
  const sentence = answerText(s.problem, lang, placed ? final : '___');
  return (
    <div className="step">
      {rem && (
        <>
          <p className="step-sub">{t('rem_title', { q: raw, r: rem.value })}</p>
          <div className="pillrow" role="group">
            {options.map((o) => (
              <button
                key={o.key}
                type="button"
                className={`pill pill--big${remOk && o.key === rem.interpret ? ' is-ok' : ''}${bad.includes(o.key) ? ' is-bad' : ''}`}
                disabled={remOk || bad.includes(o.key)}
                onClick={() => {
                  if (o.key === rem.interpret) {
                    setRemOk(true);
                    ok();
                  } else {
                    setBad((b) => [...b, o.key]);
                    wrong('unitOrRemainder');
                  }
                }}
              >
                {o.label}
              </button>
            ))}
          </div>
        </>
      )}
      {remOk && (
        <div className="answerline">
          <p className="answerline__text">{sentence}</p>
          {!placed ? (
            <button
              type="button"
              className="chip chip--num chip--big"
              onClick={() => {
                setPlaced(true);
                dispatch({ type: 'answer', value: final });
                ok();
              }}
            >
              <span data-numeric="true">{final}</span>
            </button>
          ) : (
            <Say text={sentence} />
          )}
        </div>
      )}
      {placed && <NextBtn onClick={next} />}
    </div>
  );
}

export function ReasonableStep({ s, lang, next, link, dispatch }: StepProps) {
  const t = useT();
  const step = s.problem.steps[link];
  const answer = s.finalAnswer ?? s.problem.answer;
  const big = knownMax(s.problem);
  const est = s.estimate;
  const estLine =
    est?.kind === 'dir' ? t(est.bigger ? 'est_bigger' : 'est_smaller') : est?.kind === 'line' ? t('est_line', { n: est.value }) : null;
  const match = est?.kind === 'dir' ? est.bigger === answer > big : est?.kind === 'line' ? Math.abs(est.value - answer) <= Math.max(3, answer * 0.3) : null;
  const eqTokens = s.equations[link] ?? equationFor(step).tokens;
  const raw = s.linkResults[link] ?? unknownValue(step);
  const filled = fillUnknown(eqTokens, raw);
  const inv = step.remainder ? null : inverseOf(filled);
  const sentences = s.problem.text[lang]?.length ? s.problem.text[lang] : s.problem.text.tr;
  const storyWithAnswer = () =>
    [...sentences.filter((x) => !x.isQuestion).map((x) => sentenceSpoken(x, lang)), answerText(s.problem, lang, answer)].join(' ');
  return (
    <div className="step">
      <div className="reason">
        {estLine ? (
          <p className={`reason__est${match ? ' is-ok' : ''}`}>
            {estLine} {t('answer_is', { x: answer })}. {match ? t('est_match') : t('est_differ')}
          </p>
        ) : (
          <p className="reason__est">{t('answer_is', { x: answer })}</p>
        )}
        {voiceOn(lang) && (
          <button type="button" className="btn btn--big" onClick={() => speak(storyWithAnswer(), lang)}>
            {t('btn_story_answer')}
          </button>
        )}
        {inv && (
          <div className="reason__inv">
            <span className="reason__invtitle">{t('inverse_title')}</span>
            <EqDisplay tokens={filled} />
            <span aria-hidden="true">↔</span>
            <EqDisplay tokens={inv} />
            <Say text={`${tokensSpeech(filled, lang)}. ${tokensSpeech(inv, lang)}`} size={30} />
          </div>
        )}
      </div>
      <div className="step-actions">
        <button
          type="button"
          className="btn btn--ghost"
          onClick={() => {
            const i = s.plan.findIndex((p) => p.id === 'compute' && p.link === link);
            if (i >= 0) dispatch({ type: 'goto', idx: i });
          }}
        >
          {t('btn_recheck')}
        </button>
        <button type="button" className="btn btn--primary" onClick={next} autoFocus>
          {t('btn_yes_reasonable')}
        </button>
      </div>
    </div>
  );
}

const MAIN_NAME: Record<MainStep, Key> = {
  understand: 'step_understand',
  show: 'step_show',
  estimate: 'step_estimate',
  solve: 'step_solve',
  check: 'step_check',
};

export function ReflectStep({ s, dispatch, next }: StepProps) {
  const t = useT();
  const chosen = s.reflect;
  return (
    <div className="step">
      <div className="reflect" role="group" aria-label={t('p_reflect')}>
        {MAIN_STEPS.map((m) => (
          <button
            key={m.id}
            type="button"
            className={`reflect__btn${chosen === m.id ? ' is-on' : ''}`}
            aria-pressed={chosen === m.id}
            onClick={() => dispatch({ type: 'reflect', step: m.id })}
          >
            <StepIcon step={m.id} size={30} />
            <span>{t(MAIN_NAME[m.id])}</span>
          </button>
        ))}
      </div>
      {chosen && (
        <>
          <p className="step-sub">{t('reflect_thanks')}</p>
          <NextBtn onClick={next} />
        </>
      )}
    </div>
  );
}
