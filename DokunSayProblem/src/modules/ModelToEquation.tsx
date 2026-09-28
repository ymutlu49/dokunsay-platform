/**
 * 4 · Modelden Denkleme (03 §C4) — hazır DOLU model gösterilir; çocuk denklemi çiplerle
 * kurar (☐ ☐ ☐ = ☐; "?" her konumda olabilir — eşittir ilişkiseldir, DESIGN ilke 7).
 * checkEquation, equationOf.alternatives'i de kabul eder. Doğrudan sonra "bu modele şu
 * denklemler de uyar" gösterilir (ters işlem ilişkisi — 05 §C5).
 */
import { useMemo, useState } from 'react';
import type { Problem, Role } from '../content/types';
import { pick } from '../i18n';
import { checkEquationTokens, equationFor, type EqToken, type Op } from '../lib/contentAdapter';
import { tokensSpeech, tokensText } from '../lib/problemUtil';
import { ChipTray, type TrayChip } from '../components/ChipTray';
import { SchemaDiagram, type BoxContent } from '../components/diagram/SchemaDiagram';
import { UnknownToken } from '../components/diagram/common';
import { useDragDrop } from '../components/useDragDrop';
import { SpeakButton } from '@shared/SpeakButton.jsx';
import { problemSet } from './api';
import { ModuleShell, Preparing, StoryBlock, useRound, type ModuleProps } from './common';

const N = 5;
const SLOTS = ['s0', 's1', 's2', 's4'] as const;
const OPS: Op[] = ['+', '−', '×', '÷'];

function solvedBoxes(p: Problem, lang: 'tr' | 'ku' | 'en'): Partial<Record<Role, BoxContent>> {
  const st = p.steps[0];
  return Object.fromEntries(st.quantities.map((q) => [q.role, { label: pick(q.label, lang), value: q.role === st.unknown ? '?' : q.value }]));
}

export function ModelToEquation({ lang, grade, seed, t, onExit, onDone }: ModuleProps) {
  const items = useMemo(() => problemSet(grade, N, seed, { axes: { M: 1 } }), [grade, seed]);
  const round = useRound('modelEq', grade, Math.max(1, items.length), onDone, 3);
  const [slots, setSlots] = useState<Record<string, EqToken | null>>({});
  const problem = items[round.index];
  const step = problem?.steps[0];
  const eq = useMemo(() => (step ? equationFor(step) : { tokens: [], alternatives: [] }), [step]);

  const known = step ? step.quantities.filter((q) => q.role !== step.unknown) : [];
  const used = new Set(Object.values(slots).map(String));
  const chips: TrayChip[] = [
    ...known.map((q) => ({ id: `n:${q.value}`, text: String(q.value), kind: 'num' as const, used: used.has(String(q.value)) })),
    { id: 'u:?', text: '?', kind: 'unknown' as const, used: used.has('?') },
  ];
  const opChips: TrayChip[] = OPS.map((o) => ({ id: `o:${o}`, text: o, kind: 'op' as const }));
  const dnd = useDragDrop({
    targetOrder: [...SLOTS],
    onDrop: (item, target) => {
      if (round.solved) return;
      const isOp = item.startsWith('o:');
      if (isOp !== (target === 's1')) return;
      const raw = item.slice(2);
      const tok: EqToken = isOp ? (raw as Op) : raw === '?' ? '?' : Number(raw);
      setSlots((sl) => {
        const n = { ...sl };
        if (!isOp) for (const k of SLOTS) if (n[k] === tok) n[k] = null;
        n[target] = tok;
        return n;
      });
    },
    onTargetTap: (target) => !round.solved && setSlots((sl) => ({ ...sl, [target]: null })),
  });

  if (!items.length || !step) return <Preparing t={t} onExit={onExit} />;
  const tokens: (EqToken | null)[] = [slots.s0 ?? null, slots.s1 ?? null, slots.s2 ?? null, '=', slots.s4 ?? null];
  const full = tokens.every((x) => x != null);
  const others = [eq.tokens, ...eq.alternatives].filter((a) => a.length === 5 && a.includes('?') && tokensText(a) !== tokensText(tokens as EqToken[]));

  const check = () => {
    const res = checkEquationTokens(step, tokens as EqToken[]);
    const text = res.ok ? t('ok_generic') : round.attempts >= 2 ? `${t('shown_answer')} ${tokensText(eq.tokens)}` : t('eq_hint');
    const out = round.answer(res.ok, text, { schema: step.schema, error: res.ok ? undefined : res.error ?? 'operation', problemId: problem.id });
    if (out === 'reveal' && eq.tokens.length === 5) setSlots({ s0: eq.tokens[0], s1: eq.tokens[1], s2: eq.tokens[2], s4: eq.tokens[4] });
  };

  return (
    <ModuleShell
      title={t('m_eq')}
      t={t}
      lang={lang}
      onExit={onExit}
      round={{
        ...round,
        next: () => {
          setSlots({});
          round.next();
        },
      }}
    >
      <StoryBlock problem={problem} lang={lang} t={t} compact />
      <SchemaDiagram step={step} lang={lang} mode="scaled" compact units boxes={solvedBoxes(problem, lang)} />
      <h3 className="md-q">{t('eq_q')}</h3>
      <div className="md-eqframe" role="group" aria-label={t('eq_aria')}>
        {tokens.map((tk, i) =>
          i === 3 ? (
            <span key={i} className="md-eqframe__eq" aria-hidden="true">
              =
            </span>
          ) : (
            <button
              key={i}
              type="button"
              className={`md-eqslot${i === 1 ? ' md-eqslot--op' : ''}${tk != null ? ' is-filled' : ''}`}
              aria-label={`${t('eq_slot', { n: i + 1 })}: ${tk ?? '—'}`}
              data-numeric="true"
              {...dnd.targetProps(SLOTS[i === 4 ? 3 : i])}
            >
              {tk === '?' ? <UnknownToken /> : tk ?? ''}
            </button>
          ),
        )}
        {full && <SpeakButton text={tokensSpeech(tokens as EqToken[], lang)} lang={lang} size={30} className="md-say" />}
      </div>
      {!round.solved && (
        <>
          <ChipTray title={t('tray_numbers')} chips={chips} dnd={dnd} />
          <ChipTray title={t('tray_signs')} chips={opChips} dnd={dnd} />
          <p className="md-kbd">{t('kbd_hint')}</p>
          <div className="md-actions">
            <button type="button" className="md-btn md-btn--ghost" onClick={() => setSlots({})}>
              {t('btn_clear')}
            </button>
            <button type="button" className="md-btn md-btn--primary" disabled={!full} onClick={check}>
              {t('btn_check')}
            </button>
          </div>
        </>
      )}
      {round.solved && others.length > 0 && (
        <div className="md-also">
          <span>{t('eq_also')}</span>
          <ul>
            {others.slice(0, 3).map((a, i) => (
              <li key={i} data-numeric="true">
                {tokensText(a)}
              </li>
            ))}
          </ul>
        </div>
      )}
      {dnd.ghost}
    </ModuleShell>
  );
}
