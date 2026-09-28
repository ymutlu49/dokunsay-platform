/**
 * 9 · Dedektif Soruları (03 §C11 "Kaptanın Yaşı") — "Bu soru çözülebilir mi?" Evet/Hayır;
 * Hayır doğruysa NEDEN (anlamsız soru / bilgi eksik). Tur çözülebilir ve çözülemez
 * maddeleri KARIŞTIRIR (hep "hayır" olsaydı düğmenin kendisi ipucu olurdu).
 * Çözülemezi çözülebilir sanmak → 'unsolvableMissed'. Dedektif teması, "kandırılmış"
 * hissettirmeyen süreç geri bildirimi ("Harika fark ettin!").
 * Karışık sete 10'da 1 katmak için bkz. api.ts `mixUnsolvable` (App kullanır).
 */
import { useMemo, useState } from 'react';
import type { Problem } from '../content/types';
import { shuffleSeeded } from '../lib/problemUtil';
import { problemSet, unsolvable } from './api';
import { Choices, ModuleShell, Preparing, StoryBlock, useRound, usePhase, type ModuleProps } from './common';

export function DetectiveQuestions({ lang, grade, seed, t, onExit, onDone }: ModuleProps) {
  const items = useMemo(() => {
    const bad: Problem[] = [];
    for (let i = 0; i < 6 && bad.length < 3; i++) {
      const u = unsolvable(grade, seed + i * 17);
      if (u && !bad.some((b) => b.id === u.id)) bad.push(u);
    }
    if (!bad.length) return [];
    const goodOnes = problemSet(grade, 3, seed + 3, { axes: { M: 1 } });
    return shuffleSeeded([...bad, ...goodOnes], seed);
  }, [grade, seed]);
  const round = useRound('detective', grade, Math.max(1, items.length), onDone);
  const yn = usePhase();
  const why = usePhase();
  const [askWhy, setAskWhy] = useState(false);
  const [first, setFirst] = useState(true);

  if (!items.length) return <Preparing t={t} onExit={onExit} />;
  const p = items[round.index];
  const isBad = !!p.unsolvable;
  const rec = { schema: p.steps[0]?.schema, problemId: p.id };

  const afterYn = (firstTry: boolean) => {
    setFirst(firstTry);
    if (isBad) {
      setAskWhy(true);
      round.info(t('detq_why'));
    } else {
      round.finish(firstTry, t('detq_solvable'), rec);
    }
  };
  const afterWhy = (firstTry: boolean) => {
    const ok = first && firstTry;
    round.finish(ok, t('detq_found'), { ...rec, error: first ? undefined : 'unsolvableMissed' });
  };

  return (
    <ModuleShell
      title={t('m_detq')}
      t={t}
      lang={lang}
      onExit={onExit}
      round={{
        ...round,
        next: () => {
          yn.reset();
          why.reset();
          setAskWhy(false);
          setFirst(true);
          round.next();
        },
      }}
    >
      <StoryBlock problem={p} lang={lang} t={t} />
      <h3 className="md-q">🔎 {t('detq_q')}</h3>
      <Choices
        opts={[
          { id: 'yes', text: t('detq_yes') },
          { id: 'no', text: t('detq_no') },
        ]}
        state={yn.state}
        disabled={yn.done}
        lang={lang}
        label={t('detq_q')}
        columns
        onPick={(id) =>
          yn.pick(id, isBad ? 'no' : 'yes', () => round.info(t('detq_hint'), 'try'), afterYn)
        }
      />
      {askWhy && (
        <>
          <h3 className="md-q">{t('detq_why')}</h3>
          <Choices
            opts={[
              { id: 'nonsense', text: t('detq_nonsense') },
              { id: 'missingInfo', text: t('detq_missing') },
            ]}
            state={why.state}
            disabled={why.done}
            lang={lang}
            label={t('detq_why')}
            columns
            onPick={(id) => why.pick(id, p.unsolvable ?? 'missingInfo', () => round.info(t('detq_hint'), 'try'), afterWhy)}
          />
        </>
      )}
    </ModuleShell>
  );
}
