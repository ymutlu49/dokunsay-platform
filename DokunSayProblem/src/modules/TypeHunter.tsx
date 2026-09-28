/**
 * 2 · Tür Avcısı (03 §C2) — yalnız problemi oku ve şemayı seç; hesap yok. KARIŞIK set
 * (bloklu diziler şema tanımayı öğretmez — 05 §F8). Yanlışta seçilen türün KURALI gösterilir
 * (çocuk hikâyeyle karşılaştırır); ikinci yanlışta doğrusu. İlk seçim karışıklık matrisine
 * (doğru şema × seçilen şema) kaydedilir.
 */
import { useMemo, useState } from 'react';
import type { SchemaId } from '../content/types';
import { pick } from '../i18n';
import { schemaMeta } from '../lib/contentAdapter';
import { SchemaCard } from '../components/SchemaCard';
import { problemSet, schemasFor } from './api';
import { ModuleShell, Preparing, StoryBlock, useRound, type ModuleProps } from './common';

const N = 6;

export function TypeHunter({ lang, grade, seed, t, onExit, onDone }: ModuleProps) {
  const schemas = useMemo(() => schemasFor(grade), [grade]);
  const items = useMemo(() => problemSet(grade, N, seed, { schemas, mixed: true, axes: { M: 1 } }), [grade, seed, schemas]);
  const round = useRound('typeHunter', grade, Math.max(1, items.length), onDone);
  const [state, setState] = useState<Partial<Record<SchemaId, 'ok' | 'bad'>>>({});

  if (!items.length) return <Preparing t={t} onExit={onExit} />;
  const problem = items[round.index];
  const want = problem.steps[0].schema;

  const onPick = (s: SchemaId) => {
    if (round.solved || state[s] === 'bad') return;
    const ok = s === want;
    const m = schemaMeta(s);
    const wm = schemaMeta(want);
    const text = ok
      ? t('type_ok', { name: pick(wm.name, lang) })
      : round.attempts >= 1
        ? `${t('shown_answer')} ${pick(wm.name, lang)}. ${pick(wm.rule, lang)}`
        : t('type_hint', { name: pick(m.name, lang), rule: pick(m.rule, lang) });
    const res = round.answer(ok, text, { schema: want, chosen: s, error: ok ? undefined : 'schemaId', problemId: problem.id });
    if (res === 'ok') setState((st) => ({ ...st, [s]: 'ok' }));
    else if (res === 'retry') setState((st) => ({ ...st, [s]: 'bad' }));
    else setState((st) => ({ ...st, [s]: 'bad', [want]: 'ok' }));
  };

  return (
    <ModuleShell
      title={t('m_type')}
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
      <h3 className="md-q">{t('type_q')}</h3>
      <div className="md-schemacards" role="group" aria-label={t('type_q')}>
        {schemas.map((s) => (
          <SchemaCard key={s} schema={s} state={state[s] ?? null} disabled={round.solved || state[s] === 'bad'} onPick={() => onPick(s)} />
        ))}
      </div>
    </ModuleShell>
  );
}
