/**
 * 10 · Kalan Ne Olacak? (03 §C5b) — aynı bölme dört bağlamda; çocuk kalanın yorumunu
 * seçer: yukarı yuvarla · aşağı yuvarla · kalan cevaptır · tam bölünür. 3. sınıf+
 * (kalanlı bölme TYMM 3. sınıf). Yanlış yorum → 'unitOrRemainder'.
 * İçerik: remainderSetFor(seed) — yoksa "Hazırlanıyor".
 */
import { useMemo } from 'react';
import { answerText } from '../lib/contentAdapter';
import { remainderSet, type Interpret } from './api';
import { Choices, ModuleShell, Preparing, StoryBlock, useRound, usePhase, type ModuleProps } from './common';

export function Remainder({ lang, grade, seed, t, onExit, onDone }: ModuleProps) {
  const set = useMemo(() => remainderSet(seed), [seed]);
  const items = set?.items.slice(0, 6) ?? [];
  const round = useRound('remainder', grade, Math.max(1, items.length), onDone);
  const ph = usePhase();

  if (!set || !items.length) return <Preparing t={t} onExit={onExit} />;
  const it = items[round.index];
  const opts: { id: Interpret; text: string }[] = [
    { id: 'roundUp', text: t('rem_up') },
    { id: 'roundDown', text: t('rem_down') },
    { id: 'remainderIsAnswer', text: t('rem_answer') },
    { id: 'exact', text: t('rem_exact') },
  ];
  const rec = { schema: it.problem.steps[0].schema, problemId: it.problem.id };
  const answerLine = answerText(it.problem, lang, it.problem.answer);

  return (
    <ModuleShell
      title={t('m_rem')}
      t={t}
      lang={lang}
      onExit={onExit}
      round={{
        ...round,
        next: () => {
          ph.reset();
          round.next();
        },
      }}
    >
      {set.fact && (
        <p className="md-fact" data-numeric="true">
          {t('rem_fact', { a: set.fact.a, b: set.fact.b, q: set.fact.q, r: set.fact.r })}
        </p>
      )}
      <StoryBlock problem={it.problem} lang={lang} t={t} />
      <h3 className="md-q">{t('rem_q')}</h3>
      <Choices
        opts={opts}
        state={ph.state}
        disabled={ph.done}
        lang={lang}
        label={t('rem_q')}
        onPick={(id) =>
          ph.pick(
            id,
            it.interpret,
            () => round.info(t('rem_hint'), 'try'),
            (first) => round.finish(first, `${first ? t('ok_generic') : t('shown_answer')} ${answerLine}`, { ...rec, error: first ? undefined : 'unitOrRemainder' }),
          )
        }
      />
    </ModuleShell>
  );
}
