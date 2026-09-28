/**
 * ÇÖZ — equation: ☐ ☐ ☐ = ☐ kalıbı; "?" herhangi bir konumda olabilir (eşittir ilişkisel —
 * DESIGN §2 ilke 7). Model ile denklem EŞLEŞİK: kutuya dokununca karşılığı parlar.
 * compute: tuş takımı + hesap çekmecesi; hesap hatası ayrı sınıf, modeli bozmaz.
 */
import { useEffect, useMemo, useState } from 'react';
import type { Role } from '../../content/types';
import { useT } from '../../i18n';
import { checkEquationTokens, checkFinalAnswer, equationFor, type EqToken, type Op } from '../../lib/contentAdapter';
import { fillUnknown, tokensSpeech, unknownValue } from '../../lib/problemUtil';
import { CalcDrawer } from '../../components/CalcDrawer';
import { ChipTray, type TrayChip } from '../../components/ChipTray';
import { SchemaDiagram } from '../../components/diagram/SchemaDiagram';
import { NumPad } from '../../components/NumPad';
import { Say } from '../../components/Talk';
import { UnknownToken } from '../../components/diagram/common';
import { useDragDrop } from '../../components/useDragDrop';
import { solvedBoxes } from './ShowEstimateSteps';
import { NextBtn, type StepProps } from './common';

const SLOTS = ['s0', 's1', 's2', 's4'] as const;
const OPS: Op[] = ['+', '−', '×', '÷'];

export function EqDisplay({ tokens, lit, onTap }: { tokens: (EqToken | null)[]; lit?: number[]; onTap?: (i: number) => void }) {
  return (
    <span className="eqline" data-numeric="true">
      {tokens.map((tk, i) => (
        <span key={i} className={`eqline__t${lit?.includes(i) ? ' is-linked' : ''}`} onClick={onTap ? () => onTap(i) : undefined}>
          {tk === '?' ? <UnknownToken small /> : tk}
        </span>
      ))}
    </span>
  );
}

export function EquationStep({ s, dispatch, link, lang, next, ok, wrong, guided, hint }: StepProps) {
  const t = useT();
  const step = s.problem.steps[link];
  const eq = useMemo(() => equationFor(step), [step]);
  const [slots, setSlots] = useState<Record<string, EqToken | null>>({});
  const [passed, setPassed] = useState(guided);
  const [lit, setLit] = useState<{ roles: Role[]; idx: number[] }>({ roles: [], idx: [] });
  useEffect(() => {
    if (guided && eq.tokens.length === 5) {
      setSlots({ s0: eq.tokens[0], s1: eq.tokens[1], s2: eq.tokens[2], s4: eq.tokens[4] });
      setPassed(true);
    }
  }, [guided, eq]);

  const known = step.quantities.filter((q) => q.role !== step.unknown);
  const primaryOp = eq.tokens[1] as Op | undefined;
  const ops = hint >= 3 && primaryOp ? OPS.filter((o) => o === primaryOp || o === (primaryOp === '+' ? '−' : primaryOp === '−' ? '+' : primaryOp === '×' ? '÷' : '×')) : OPS;
  const used = new Set(Object.values(slots).map(String));
  const chips: TrayChip[] = [
    ...known.map((q) => ({ id: `n:${q.value}`, text: String(q.value), kind: 'num' as const, used: used.has(String(q.value)) })),
    { id: 'u:?', text: '?', kind: 'unknown' as const, used: used.has('?') },
  ];
  const opChips: TrayChip[] = ops.map((o) => ({ id: `o:${o}`, text: o, kind: 'op' as const }));
  const dnd = useDragDrop({
    targetOrder: [...SLOTS],
    onDrop: (item, target) => {
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
    onTargetTap: (target) => !passed && setSlots((sl) => ({ ...sl, [target]: null })),
  });
  const tokens: (EqToken | null)[] = [slots.s0 ?? null, slots.s1 ?? null, slots.s2 ?? null, '=', slots.s4 ?? null];
  const full = tokens.every((x) => x != null);
  const roleOfToken = (tk: EqToken | null): Role[] =>
    tk === '?' ? [step.unknown] : typeof tk === 'number' ? known.filter((q) => q.value === tk).map((q) => q.role) : [];

  const check = () => {
    const res = checkEquationTokens(step, tokens as EqToken[]);
    if (res.ok) {
      setPassed(true);
      dispatch({ type: 'equation', link, tokens: tokens as EqToken[] });
      ok();
    } else wrong(res.error ?? 'operation');
  };

  return (
    <div className="step step-eq">
      <p className="kbd-hint">{t('model_link_hint')}</p>
      <SchemaDiagram
        step={step}
        lang={lang}
        mode="scaled"
        compact
        boxes={solvedBoxes(s, link, lang)}
        highlight={lit.roles}
        onBoxTap={(r) => {
          const v: EqToken = r === step.unknown ? '?' : known.find((q) => q.role === r)?.value ?? '?';
          setLit({ roles: [r], idx: tokens.map((x, i) => (x === v ? i : -1)).filter((i) => i >= 0) });
        }}
      />
      <div className="eqframe" role="group" aria-label={t('eq_aria')}>
        {tokens.map((tk, i) =>
          i === 3 ? (
            <span key={i} className="eqframe__eq" aria-hidden="true">
              =
            </span>
          ) : (
            <button
              key={i}
              type="button"
              className={`eqslot${i === 1 ? ' eqslot--op' : ''}${lit.idx.includes(i) ? ' is-linked' : ''}${tk != null ? ' is-filled' : ''}`}
              aria-label={`${t('eq_slot', { n: i + 1 })}: ${tk ?? t('box_empty')}`}
              {...dnd.targetProps(SLOTS[i === 4 ? 3 : i])}
              onClick={() => {
                dnd.targetProps(SLOTS[i === 4 ? 3 : i]).onClick();
                setLit({ roles: roleOfToken(tk), idx: [i] });
              }}
              disabled={passed && false}
            >
              {tk === '?' ? <UnknownToken /> : tk ?? ''}
            </button>
          ),
        )}
        {full && <Say text={tokensSpeech(tokens as EqToken[], lang)} size={30} />}
      </div>
      {!passed && (
        <>
          <ChipTray title={t('numbers_tray')} chips={chips} dnd={dnd} />
          <ChipTray title={t('signs_tray')} chips={opChips} dnd={dnd} />
          <div className="step-actions">
            <button type="button" className="btn btn--ghost" onClick={() => setSlots({})}>
              {t('btn_clear')}
            </button>
            <button type="button" className="btn btn--primary" disabled={!full} onClick={check}>
              {t('btn_check')}
            </button>
          </div>
        </>
      )}
      {dnd.ghost}
      {passed && <NextBtn onClick={next} />}
    </div>
  );
}

export function ComputeStep({ s, dispatch, link, lang, next, ok, wrong, guided }: StepProps) {
  const t = useT();
  const step = s.problem.steps[link];
  const isFinal = link === s.problem.steps.length - 1 && !step.remainder;
  const expected = unknownValue(step);
  const eqTokens = s.equations[link] ?? equationFor(step).tokens;
  const [val, setVal] = useState(guided ? String(expected) : '');
  const [passed, setPassed] = useState(guided);
  useEffect(() => {
    if (guided) {
      setVal(String(expected));
      setPassed(true);
      if (s.linkResults[link] == null) dispatch({ type: 'compute', link, value: expected });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [guided]);
  const submit = () => {
    const v = Number(val);
    const res = isFinal ? checkFinalAnswer(s.problem, v) : v === expected ? { ok: true } : { ok: false, error: 'computation' as const };
    if (res.ok) {
      setPassed(true);
      dispatch({ type: 'compute', link, value: v });
      ok();
    } else {
      dispatch({ type: 'computeWrong' });
      wrong(res.error ?? 'computation');
      setVal('');
    }
  };
  const max = Math.max(...step.quantities.map((q) => q.value));
  return (
    <div className="step step-compute">
      <div className="eqbig">
        <EqDisplay tokens={passed ? fillUnknown(eqTokens, Number(val)) : eqTokens} />
        <Say text={tokensSpeech(eqTokens, lang)} size={30} />
      </div>
      {!passed && <NumPad value={val} onChange={setVal} onSubmit={submit} label={t('compute_label')} />}
      {!passed && <CalcDrawer max={max} />}
      {passed && <NextBtn onClick={next} />}
    </div>
  );
}
