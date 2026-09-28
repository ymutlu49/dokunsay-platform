/**
 * 1 · Hikâyeyi Anlat (03 §C1) — durum modeli: 3 yeniden-ifade (doğru / ilişki ters /
 * soru farklı). Sayı sorulmaz, hesap yok. Çeldirici seçimi yanılgı etiketi olarak kaydedilir:
 * ilişki ters → 'reversal', soru farklı → 'unknownPlacement'.
 */
import { useMemo, useState } from 'react';
import type { Problem } from '../content/types';
import { pick } from '../i18n';
import { paraphraseOptions, feedbackText } from '../lib/contentAdapter';
import { shuffleSeeded } from '../lib/problemUtil';
import { problemSet } from './api';
import { Choices, ModuleShell, Preparing, StoryBlock, useRound, type ModuleProps } from './common';

const N = 5;

export function StoryRetell({ lang, grade, seed, t, onExit, onDone }: ModuleProps) {
  const items = useMemo(() => {
    const set = problemSet(grade, N + 3, seed, { axes: { M: 1 } });
    return set
      .map((p) => ({ p, opts: paraphraseOptions(p) }))
      .filter((x) => x.opts.length >= 2 && x.opts.some((o) => o.kind === 'correct'))
      .slice(0, N);
  }, [grade, seed]);
  const round = useRound('retell', grade, Math.max(1, items.length), onDone);
  const [state, setState] = useState<Record<string, 'ok' | 'bad' | undefined>>({});

  if (!items.length) return <Preparing t={t} onExit={onExit} />;
  const cur = items[round.index];
  const problem: Problem = cur.p;
  const opts = shuffleSeeded(
    cur.opts.map((o, i) => ({ id: `${i}:${o.kind}`, text: pick(o.text, lang), kind: o.kind })),
    problem.seed + round.index,
  );

  const onPick = (id: string) => {
    if (round.solved) return;
    const o = opts.find((x) => x.id === id);
    if (!o) return;
    const ok = o.kind === 'correct';
    const correctId = opts.find((x) => x.kind === 'correct')?.id ?? '';
    const hint = o.kind === 'reversedRelation' ? t('retell_hint_rel') : t('retell_hint_q');
    const res = round.answer(ok, ok ? pick(feedbackText('correct', problem, 'retell'), lang) || t('ok_generic') : hint, {
      schema: problem.steps[0].schema,
      error: ok ? undefined : o.kind === 'reversedRelation' ? 'reversal' : 'unknownPlacement',
      problemId: problem.id,
    });
    if (res === 'ok') setState({ [id]: 'ok' });
    else if (res === 'retry') setState((s) => ({ ...s, [id]: 'bad' }));
    else setState((s) => ({ ...s, [id]: 'bad', [correctId]: 'ok' }));
  };

  return (
    <ModuleShell
      title={t('m_retell')}
      t={t}
      lang={lang}
      onExit={onExit}
      round={{
        ...round,
        next: () => {
          setState({});
          round.next();
        },
      }}
    >
      <StoryBlock problem={problem} lang={lang} t={t} />
      <h3 className="md-q">{t('retell_q')}</h3>
      <Choices opts={opts} onPick={onPick} state={state} disabled={round.solved} lang={lang} label={t('retell_q')} />
    </ModuleShell>
  );
}
