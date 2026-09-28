/**
 * 5 · Makul mü? (03 §C5) — çözülmüş problem + gösterilen cevap: "Bu cevap olabilir mi?"
 * (Olabilir / Olamaz) → gerekçe seç. Madde, ikisi de İLK denemede doğruysa doğru sayılır
 * (yargı yanlışsa kayıt o anda 'yanlış' düşer). Makullük için ayrı ErrorClass yok → hata sınıfı yazılmaz.
 * İçerik: reasonableItemsFor(grade, seed) — yoksa "Hazırlanıyor".
 */
import { useMemo, useState } from 'react';
import { pick } from '../i18n';
import { answerText } from '../lib/contentAdapter';
import { shuffleSeeded } from '../lib/problemUtil';
import { reasonableItems } from './api';
import { Choices, ModuleShell, Preparing, StoryBlock, useRound, type ModuleProps } from './common';

export function Reasonable({ lang, grade, seed, t, onExit, onDone }: ModuleProps) {
  const items = useMemo(() => (reasonableItems(grade, seed) ?? []).slice(0, 6), [grade, seed]);
  const round = useRound('reasonable', grade, Math.max(1, items.length), onDone);
  const [verdict, setVerdict] = useState<'yes' | 'no' | null>(null);
  const [vState, setVState] = useState<Record<string, 'ok' | 'bad' | undefined>>({});
  const [rState, setRState] = useState<Record<string, 'ok' | 'bad' | undefined>>({});

  if (!items.length) return <Preparing t={t} onExit={onExit} />;
  const it = items[round.index];
  const reasons = shuffleSeeded(
    it.reasons.map((r, i) => ({ id: `r${i}`, text: pick(r.text, lang), correct: r.correct })),
    it.problem.seed + round.index,
  );
  const needReason = reasons.length > 0;
  const rec = { schema: it.problem.steps[0].schema, problemId: it.problem.id };

  const pickVerdict = (id: string) => {
    if (verdict || round.solved) return;
    const ok = (id === 'yes') === it.reasonable;
    if (ok && needReason) {
      setVerdict(id as 'yes' | 'no');
      setVState({ [id]: 'ok' });
      round.info(t('reason_why'));
      return;
    }
    const res = round.answer(ok, ok ? t('ok_generic') : t('reason_hint'), rec);
    if (res === 'retry') setVState({ [id]: 'bad' });
    else {
      const right = it.reasonable ? 'yes' : 'no';
      setVState({ [id]: id === right ? 'ok' : 'bad', [right]: 'ok' });
      if (res === 'reveal' && needReason) setVerdict(right);
    }
  };

  const pickReason = (id: string) => {
    if (round.solved) return;
    const r = reasons.find((x) => x.id === id);
    if (!r) return;
    const res = round.answer(r.correct, r.correct ? t('ok_generic') : t('reason_hint'), rec);
    const right = reasons.find((x) => x.correct)?.id ?? '';
    if (res === 'ok') setRState((s) => ({ ...s, [id]: 'ok' }));
    else if (res === 'retry') setRState((s) => ({ ...s, [id]: 'bad' }));
    else setRState((s) => ({ ...s, [id]: 'bad', [right]: 'ok' }));
  };

  const shownLine = answerText(it.problem, lang, it.shown);

  return (
    <ModuleShell
      title={t('m_reason')}
      t={t}
      lang={lang}
      onExit={onExit}
      round={{
        ...round,
        next: () => {
          setVerdict(null);
          setVState({});
          setRState({});
          round.next();
        },
      }}
    >
      <StoryBlock problem={it.problem} lang={lang} t={t} />
      <p className="md-shown">
        <span className="md-shown__lbl">{t('reason_shown')}</span> <b data-numeric="true">{shownLine}</b>
      </p>
      <h3 className="md-q">{t('reason_q')}</h3>
      <Choices
        opts={[
          { id: 'yes', text: t('reason_yes'), node: <>👍 {t('reason_yes')}</> },
          { id: 'no', text: t('reason_no'), node: <>👎 {t('reason_no')}</> },
        ]}
        onPick={pickVerdict}
        state={vState}
        disabled={!!verdict || round.solved}
        lang={lang}
        label={t('reason_q')}
        columns
      />
      {verdict && needReason && (
        <>
          <h3 className="md-q">{t('reason_why')}</h3>
          <Choices opts={reasons} onPick={pickReason} state={rState} disabled={round.solved} lang={lang} label={t('reason_why')} />
        </>
      )}
    </ModuleShell>
  );
}
