/**
 * Hikâye paneli: cümle cümle metin, her cümlenin yanında 🔊 (SpeakButton), okunan cümle
 * vurgulu, sayılar çip. İlişki sözcükleri (fazla, az, her, katı…) altta ayrı çiplerdir;
 * dokununca sözcük kartı açılır (satır içi düğme 44 px kuralıyla satırı bozardı).
 * Dar ekranda yapışkan özet: yalnız soru cümlesi + "Hikâyeyi göster".
 */
import { useState } from 'react';
import { SpeakButton } from '@shared/SpeakButton.jsx';
import type { Problem, Sentence } from '../content/types';
import { useLang, useT } from '../i18n';
import { sentenceSpoken, vocabFor, type VocabUI } from '../lib/contentAdapter';
import { VocabCard } from './VocabCard';

export function SentenceView({ s, answer }: { s: Sentence; answer?: string }) {
  return (
    <>
      {s.segments.map((g, i) =>
        g.kind === 'qty' ? (
          <span key={i} className={`numchip${String(g.ref).startsWith('extra') ? ' is-extra' : ''}`} data-numeric="true">
            {g.text}
          </span>
        ) : (
          <span key={i}>{g.text}</span>
        ),
      )}
      {answer && <span className="story__answer"> {answer}</span>}
    </>
  );
}

export function StoryPanel({
  problem,
  reading,
  highlightQuestion,
  answerLine,
}: {
  problem: Problem;
  reading: number | null;
  highlightQuestion?: boolean;
  answerLine?: string;
}) {
  const t = useT();
  const lang = useLang();
  const [expanded, setExpanded] = useState(false);
  const [vocab, setVocab] = useState<VocabUI | null>(null);
  const sentences = problem.text[lang]?.length ? problem.text[lang] : problem.text.tr;
  const words = dedupe(sentences.flatMap((s) => vocabFor(s, lang)));

  return (
    <section className={`story${expanded ? ' is-expanded' : ''}`} aria-label={t('story_title')}>
      <div className="story__head">
        <h2 className="story__title">{t('story_title')}</h2>
        <button type="button" className="story__toggle" onClick={() => setExpanded((e) => !e)} aria-expanded={expanded}>
          {expanded ? t('hide_story') : t('show_story')}
        </button>
      </div>
      <ol className="story__list">
        {sentences.map((s, i) => (
          <li
            key={i}
            className={`story__sent${reading === i ? ' is-reading' : ''}${s.isQuestion ? ' is-question' : ''}${
              s.isQuestion && highlightQuestion ? ' is-marked' : ''
            }`}
          >
            <SpeakButton text={() => sentenceSpoken(s, lang)} lang={lang} size={30} className="say-btn" />
            <p className="story__text">
              {s.isQuestion && <span className="story__qbadge">{t('question_badge')}</span>}
              <SentenceView s={s} />
            </p>
          </li>
        ))}
        {answerLine && (
          <li className="story__sent is-answer">
            <p className="story__text">
              <b>{answerLine}</b>
            </p>
          </li>
        )}
      </ol>
      {words.length > 0 && (
        <div className="story__words" aria-label={t('words_title')}>
          <span className="story__wordslabel">{t('words_title')}:</span>
          {words.map((w) => (
            <button key={w.id} type="button" className="wordchip" onClick={() => setVocab(w)} aria-haspopup="dialog">
              {w.word}
            </button>
          ))}
        </div>
      )}
      {vocab && <VocabCard entry={vocab} onClose={() => setVocab(null)} />}
    </section>
  );
}

function dedupe(list: VocabUI[]): VocabUI[] {
  const seen = new Set<string>();
  return list.filter((v) => (seen.has(v.id) ? false : (seen.add(v.id), true)));
}
