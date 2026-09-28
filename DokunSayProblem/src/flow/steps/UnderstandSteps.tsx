/**
 * ANLA adımları: read (dinle/oku), retell (kendi sözünle — 3 seçenek), question (soru
 * cümlesi + cevap birimi). "İşlem sözcüğüne dokun" adımı BİLİNÇLİ OLARAK YOK (DESIGN §2).
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import type { L10n } from '../../content/types';
import { pick, useT } from '../../i18n';
import { paraphraseOptions, sentenceSpoken } from '../../lib/contentAdapter';
import { shuffleSeeded, unitOptions } from '../../lib/problemUtil';
import { speakSequence, voiceOn } from '../../lib/speech';
import { PlayIcon, StopIcon } from '../../components/icons';
import { SentenceView } from '../../components/StoryPanel';
import { Say } from '../../components/Talk';
import { NextBtn, type StepProps } from './common';

export function ReadStep({ s, lang, next, setReading }: StepProps & { setReading: (i: number | null) => void }) {
  const t = useT();
  const [playing, setPlaying] = useState(false);
  const stop = useRef<(() => void) | null>(null);
  const sentences = s.problem.text[lang]?.length ? s.problem.text[lang] : s.problem.text.tr;
  const canVoice = voiceOn(lang);
  useEffect(() => () => stop.current?.(), []);
  const play = () => {
    if (playing) {
      stop.current?.();
      return;
    }
    setPlaying(true);
    stop.current = speakSequence(
      sentences.map((x) => sentenceSpoken(x, lang)),
      lang,
      (i) => setReading(i),
      () => {
        setPlaying(false);
        setReading(null);
        stop.current = null;
      },
    );
  };
  return (
    <div className="step step-read">
      {canVoice && (
        <button type="button" className="btn btn--big" onClick={play} aria-pressed={playing}>
          {playing ? <StopIcon /> : <PlayIcon />} {playing ? t('btn_stop') : t('btn_listen_all')}
        </button>
      )}
      <NextBtn
        onClick={() => {
          stop.current?.();
          next();
        }}
      />
    </div>
  );
}

export function RetellStep({ s, lang, next, ok, wrong, guided, hint }: StepProps) {
  const opts = useMemo(() => shuffleSeeded(paraphraseOptions(s.problem), s.problem.seed), [s.problem]);
  const [tried, setTried] = useState<number[]>([]);
  const [picked, setPicked] = useState<number | null>(null);
  const correctIdx = opts.findIndex((o) => o.kind === 'correct');
  const doneIdx = guided ? correctIdx : picked;
  const done = doneIdx === correctIdx && correctIdx >= 0;
  // H3: bir yanlış seçenek düşer (3 → 2).
  const hidden = hint >= 3 ? opts.findIndex((o, i) => o.kind !== 'correct' && !tried.includes(i)) : -1;
  if (!opts.length) return <NextBtn onClick={next} />;
  return (
    <div className="step">
      <ul className="choices">
        {opts.map((o, i) =>
          i === hidden ? null : (
            <li key={i} className="choices__row">
              <button
                type="button"
                className={`choice${doneIdx === i && done ? ' is-ok' : ''}${tried.includes(i) ? ' is-bad' : ''}`}
                disabled={done || tried.includes(i)}
                onClick={() => {
                  if (o.kind === 'correct') {
                    setPicked(i);
                    ok();
                  } else {
                    setTried((x) => [...x, i]);
                    wrong(undefined);
                  }
                }}
              >
                {pick(o.text as L10n, lang)}
              </button>
              <Say text={pick(o.text as L10n, lang)} size={30} />
            </li>
          ),
        )}
      </ul>
      {done && <NextBtn onClick={next} />}
    </div>
  );
}

export function QuestionStep({ s, lang, next, ok, wrong, guided }: StepProps) {
  const t = useT();
  const sentences = s.problem.text[lang]?.length ? s.problem.text[lang] : s.problem.text.tr;
  const units = useMemo(() => shuffleSeeded(unitOptions(s.problem), s.problem.seed + 7), [s.problem]);
  const [qDone, setQDone] = useState(false);
  const [badQ, setBadQ] = useState<number[]>([]);
  const [unit, setUnit] = useState<string | null>(null);
  const [badU, setBadU] = useState<string[]>([]);
  const answerUnit = s.problem.answerUnit.tr;
  const qOk = guided || qDone;
  const uOk = guided || unit === answerUnit;
  return (
    <div className="step">
      <ul className="choices">
        {sentences.map((x, i) => (
          <li key={i} className="choices__row">
            <button
              type="button"
              className={`choice choice--sentence${qOk && x.isQuestion ? ' is-ok' : ''}${badQ.includes(i) ? ' is-bad' : ''}`}
              disabled={qOk || badQ.includes(i)}
              onClick={() => {
                if (x.isQuestion) {
                  setQDone(true);
                  ok();
                } else {
                  setBadQ((b) => [...b, i]);
                  wrong(undefined);
                }
              }}
            >
              <SentenceView s={x} />
            </button>
          </li>
        ))}
      </ul>
      {qOk && (
        <>
          <p className="step-sub">
            {t('p_unit')} <Say text={t('p_unit')} size={30} />
          </p>
          <div className="pillrow" role="group" aria-label={t('p_unit')}>
            {units.map((u) => (
              <button
                key={u.tr}
                type="button"
                className={`pill pill--big${uOk && u.tr === answerUnit ? ' is-ok' : ''}${badU.includes(u.tr) ? ' is-bad' : ''}`}
                disabled={uOk || badU.includes(u.tr)}
                onClick={() => {
                  if (u.tr === answerUnit) {
                    setUnit(u.tr);
                    ok();
                  } else {
                    setBadU((b) => [...b, u.tr]);
                    wrong('unitOrRemainder');
                  }
                }}
              >
                {pick(u, lang)}
              </button>
            ))}
          </div>
        </>
      )}
      {qOk && uOk && <NextBtn onClick={next} />}
    </div>
  );
}
