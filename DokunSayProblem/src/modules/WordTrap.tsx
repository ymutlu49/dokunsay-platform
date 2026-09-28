/**
 * 7 · Sözcük Tuzağı (03 §C10) — aynı sayılı TUTARLI + TUTARSIZ dil çifti yan yana.
 * Her hikâyede önce "Kimde daha çok?" (durum modeli), sonra "Hangi işlemle?" sorulur.
 * İşlem MODELDEN türetilir (solveOp), sözcükten değil. Bitişte "aynı sözcük, farklı işlem"
 * yansıtması. Tutarsız hikâyede yanlış işlem → 'reversal', tutarlıda → 'operation'.
 * ANAHTAR SÖZCÜK öğüdü YOK.
 */
import { useMemo, useState } from 'react';
import type { Problem, Role } from '../content/types';
import { pick } from '../i18n';
import { vocabFor } from '../lib/contentAdapter';
import { shuffleSeeded } from '../lib/problemUtil';
import { solveOp, wordTrapPair } from './api';
import { Choices, ModuleShell, Preparing, StoryBlock, useRound, type ModuleProps } from './common';

const PAIRS = 3;

function commonWord(a: Problem, b: Problem, lang: 'tr' | 'ku' | 'en'): string | null {
  const words = (p: Problem) => (p.text[lang] ?? p.text.tr).flatMap((s) => vocabFor(s, lang));
  const bw = new Map(words(b).map((w) => [w.id, w.word]));
  const hit = words(a).find((w) => bw.has(w.id));
  return hit ? hit.word : null;
}

export function WordTrap({ lang, grade, seed, t, onExit, onDone }: ModuleProps) {
  const pairs = useMemo(() => {
    const out: { consistent: Problem; inconsistent: Problem }[] = [];
    for (let i = 0; i < PAIRS + 2 && out.length < PAIRS; i++) {
      const p = wordTrapPair(grade, seed + i * 13);
      if (p && !out.some((x) => x.inconsistent.id === p.inconsistent.id)) out.push(p);
    }
    return out;
  }, [grade, seed]);
  const items = useMemo(
    () => pairs.flatMap((p, k) => shuffleSeeded([p.consistent, p.inconsistent], seed + k).map((prob) => ({ prob, pair: k }))),
    [pairs, seed],
  );
  const word = useMemo(() => (pairs[0] ? commonWord(pairs[0].consistent, pairs[0].inconsistent, lang) : null), [pairs, lang]);
  const reflection = (
    <div className="md-reflect">
      <h3>{t('trap_reflect_title')}</h3>
      <p>{word ? t('trap_reflect_word', { w: word }) : t('trap_reflect')}</p>
    </div>
  );
  const round = useRound('wordTrap', grade, Math.max(1, items.length), (c, n) => onDone(c, n, reflection));
  const [whoOk, setWhoOk] = useState(false);
  const [whoState, setWhoState] = useState<Record<string, 'ok' | 'bad' | undefined>>({});
  const [opState, setOpState] = useState<Record<string, 'ok' | 'bad' | undefined>>({});

  if (!items.length) return <Preparing t={t} onExit={onExit} />;
  const { prob, pair } = items[round.index];
  const step = prob.steps[0];
  const pairProbs = [items[pair * 2]?.prob, items[pair * 2 + 1]?.prob].filter(Boolean) as Problem[];
  const sides: Role[] = step.schema === 'multCompare' ? ['reference', 'compared'] : ['larger', 'smaller'];
  const qs = sides.map((r) => step.quantities.find((q) => q.role === r)).filter(Boolean) as Problem['steps'][0]['quantities'];
  const more = qs.reduce((a, b) => (b.value > a.value ? b : a), qs[0]);
  const whoOpts = shuffleSeeded(qs.map((q) => ({ id: q.role, text: pick(q.label, lang) })), prob.seed);
  const mult = step.schema === 'multCompare' || step.schema === 'equalGroups';
  const opOpts = mult
    ? [{ id: '×', text: t('op_mul') }, { id: '÷', text: t('op_div') }]
    : [{ id: '+', text: t('op_add') }, { id: '−', text: t('op_sub') }];
  const rightOp = solveOp(step);
  const rec = { schema: step.schema, problemId: prob.id };

  const pickWho = (id: string) => {
    if (whoOk || round.solved) return;
    const ok = id === more?.role;
    if (ok) {
      setWhoOk(true);
      setWhoState({ [id]: 'ok' });
      round.info(t('trap_op'));
      return;
    }
    const res = round.answer(false, t('trap_hint'), { ...rec, error: prob.axes.L === 1 ? 'reversal' : 'operation' });
    setWhoState((s) => ({ ...s, [id]: 'bad' }));
    if (res === 'reveal' && more) {
      setWhoState({ [id]: 'bad', [more.role]: 'ok' });
      setWhoOk(true);
      setOpState({ [rightOp]: 'ok' });
    }
  };

  const pickOp = (id: string) => {
    if (round.solved) return;
    const ok = id === rightOp;
    const res = round.answer(ok, ok ? t('ok_generic') : t('trap_hint'), { ...rec, error: ok ? undefined : prob.axes.L === 1 ? 'reversal' : 'operation' });
    if (res === 'ok') setOpState({ [id]: 'ok' });
    else if (res === 'retry') setOpState((s) => ({ ...s, [id]: 'bad' }));
    else setOpState({ [id]: 'bad', [rightOp]: 'ok' });
  };

  return (
    <ModuleShell
      title={t('m_trap')}
      t={t}
      lang={lang}
      onExit={onExit}
      round={{
        ...round,
        next: () => {
          setWhoOk(false);
          setWhoState({});
          setOpState({});
          round.next();
        },
      }}
    >
      <div className="md-pair">
        {pairProbs.map((p, i) => (
          <div key={p.id} className={`md-pair__side${p === prob ? ' is-now' : ''}`} aria-current={p === prob ? 'true' : undefined}>
            <StoryBlock problem={p} lang={lang} t={t} label={i === 0 ? t('trap_story_a') : t('trap_story_b')} compact />
          </div>
        ))}
      </div>
      <h3 className="md-q">
        {pairProbs.indexOf(prob) === 0 ? t('trap_story_a') : t('trap_story_b')}: {t('trap_who')}
      </h3>
      <Choices opts={whoOpts} onPick={pickWho} state={whoState} disabled={whoOk || round.solved} lang={lang} label={t('trap_who')} columns />
      {whoOk && (
        <>
          <h3 className="md-q">{t('trap_op')}</h3>
          <Choices opts={opOpts} onPick={pickOp} state={opState} disabled={round.solved} lang={lang} label={t('trap_op')} columns />
        </>
      )}
    </ModuleShell>
  );
}
