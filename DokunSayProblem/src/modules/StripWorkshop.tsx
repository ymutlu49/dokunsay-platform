/**
 * 3 · Şerit Atölyesi (03 §C3) — yalnız MODEL kurulur (checkModel), hesap yok.
 * İki aşamalı kilit: önce etiketler, sonra sayılar + "?" jetonu (05 §E1). Denetim parça
 * bazında (renk + ✓/! + sesli etiket). Doğruysa şeritler orantılı ("scaled") olur.
 * Parça-Bütün'de parçaların yer değiştirmesi hata değildir (05 §F3). 3. başarısız
 * denetimde doğru model gösterilir. Kayıt: ilk denetimin sonucu (ilk denemede model).
 */
import { useMemo, useState } from 'react';
import type { Problem, Role } from '../content/types';
import { pick } from '../i18n';
import { checkModelPlacement, type Placements } from '../lib/contentAdapter';
import { modelChips } from '../lib/problemUtil';
import { ChipTray, type TrayChip } from '../components/ChipTray';
import { SchemaDiagram, type BoxContent, type Mark } from '../components/diagram/SchemaDiagram';
import { useDragDrop } from '../components/useDragDrop';
import { problemSet } from './api';
import { ModuleShell, Preparing, StoryBlock, useRound, type ModuleProps } from './common';
import type { MT } from './i18n';

const N = 5;

interface Slot {
  label?: Role;
  value?: number | '?';
  chip?: string;
}

function solution(p: Problem): Record<string, Slot> {
  const st = p.steps[0];
  return Object.fromEntries(st.quantities.map((q) => [q.role, { label: q.role, value: q.role === st.unknown ? '?' : q.value, chip: 'sol' }]));
}

export function StripWorkshop({ lang, grade, seed, t, onExit, onDone }: ModuleProps) {
  const items = useMemo(() => problemSet(grade, N, seed, { axes: { M: 1 } }), [grade, seed]);
  const round = useRound('strip', grade, Math.max(1, items.length), onDone, 3);
  if (!items.length) return <Preparing t={t} onExit={onExit} />;
  const problem = items[round.index];
  return (
    <ModuleShell title={t('m_strip')} t={t} lang={lang} onExit={onExit} round={round}>
      <StoryBlock problem={problem} lang={lang} t={t} compact />
      <ModelBuilder
        key={problem.id + round.index}
        problem={problem}
        lang={lang}
        t={t}
        locked={round.solved}
        onCheck={(ok, error) => {
          const res = round.answer(ok, ok ? t('strip_ok') : round.attempts >= 2 ? t('shown_answer') : t('strip_partial'), {
            schema: problem.steps[0].schema,
            error: ok ? undefined : error ?? 'modelPlacement',
            problemId: problem.id,
          });
          return res;
        }}
      />
    </ModuleShell>
  );
}

export function ModelBuilder({
  problem,
  lang,
  t,
  locked,
  onCheck,
}: {
  problem: Problem;
  lang: 'tr' | 'ku' | 'en';
  t: MT;
  locked: boolean;
  onCheck: (ok: boolean, error?: import('../content/types').ErrorClass) => 'ok' | 'retry' | 'reveal';
}) {
  const step = problem.steps[0];
  const roles = step.quantities.map((q) => q.role);
  const [slots, setSlots] = useState<Record<string, Slot>>({});
  const [marks, setMarks] = useState<Partial<Record<Role, Mark>>>({});
  const [passed, setPassed] = useState(false);
  const nums = useMemo(() => modelChips(problem, lang, 0, {}), [problem, lang]);
  const usedChips = new Set(Object.values(slots).map((x) => x.chip));
  const usedLabels = new Set(Object.values(slots).map((x) => x.label));
  const labelsDone = roles.every((r) => slots[r]?.label);

  const labelChips: TrayChip[] = step.quantities.map((q) => ({
    id: `L:${q.role}`,
    text: pick(q.label, lang),
    sub: pick(q.unit, lang),
    kind: 'label',
    used: usedLabels.has(q.role),
  }));
  const numChips: TrayChip[] = [
    ...nums.map((c) => ({ id: c.id, text: String(c.value), kind: 'num' as const, used: usedChips.has(c.id) })),
    { id: 'U', text: '?', kind: 'unknown' as const, used: usedChips.has('U') },
  ];
  const [note, setNote] = useState('');

  const dnd = useDragDrop({
    targetOrder: roles,
    onDrop: (item, target) => {
      const box = target as Role;
      if (!roles.includes(box) || locked || passed) return;
      setMarks({});
      if (item.startsWith('L:')) {
        const lr = item.slice(2) as Role;
        setSlots((sl) => {
          const n: Record<string, Slot> = {};
          for (const [k, v] of Object.entries(sl)) n[k] = v.label === lr ? { ...v, label: undefined } : v;
          n[box] = { ...n[box], label: lr };
          return n;
        });
        return;
      }
      if (!labelsDone) {
        setNote(t('strip_labels_first'));
        return;
      }
      const value: number | '?' = item === 'U' ? '?' : nums.find((c) => c.id === item)?.value ?? 0;
      setSlots((sl) => {
        const n: Record<string, Slot> = {};
        for (const [k, v] of Object.entries(sl)) n[k] = v.chip === item ? { ...v, value: undefined, chip: undefined } : v;
        n[box] = { ...n[box], value, chip: item };
        return n;
      });
    },
    onTargetTap: (target) => {
      if (locked || passed) return;
      const box = target as Role;
      setMarks({});
      setSlots((sl) => {
        const cur = sl[box];
        if (!cur) return sl;
        return cur.value != null ? { ...sl, [box]: { label: cur.label } } : { ...sl, [box]: {} };
      });
    },
  });

  const check = () => {
    let eff = slots;
    const swapped = step.schema === 'combine' && slots.part1?.label === 'part2' && slots.part2?.label === 'part1';
    if (swapped) eff = { ...slots, part1: slots.part2, part2: slots.part1 };
    const placements: Placements = {};
    roles.forEach((r) => {
      if (eff[r]?.value != null) placements[r] = eff[r].value as number | '?';
    });
    const res = checkModelPlacement(step, placements, problem.extras);
    const m: Partial<Record<Role, Mark>> = {};
    let allOk = true;
    roles.forEach((r) => {
      const good = eff[r]?.label === r && !!res.perRole[r];
      const box = !swapped ? r : r === 'part1' ? 'part2' : r === 'part2' ? 'part1' : r;
      m[box] = good ? 'ok' : 'bad';
      if (!good) allOk = false;
    });
    setMarks(m);
    const out = onCheck(allOk, res.error);
    if (out === 'ok') setPassed(true);
    if (out === 'reveal') {
      setSlots(solution(problem));
      setMarks({});
      setPassed(true);
    }
  };

  const boxes: Partial<Record<Role, BoxContent>> = {};
  roles.forEach((r) => {
    const sl = slots[r];
    const q = sl?.label ? step.quantities.find((x) => x.role === sl.label) : undefined;
    boxes[r] = { label: q ? pick(q.label, lang) : undefined, value: sl?.value };
  });
  const allFilled = roles.every((r) => slots[r]?.label && slots[r]?.value != null);
  const active = !locked && !passed;

  return (
    <div className="md-model">
      <SchemaDiagram
        step={step}
        lang={lang}
        mode={passed ? 'scaled' : 'build'}
        boxes={boxes}
        marks={marks}
        units
        target={active ? (r) => dnd.targetProps(r) : undefined}
      />
      {active && (
        <>
          <p className="md-sub" aria-live="polite">
            {note && !labelsDone ? note : labelsDone ? t('strip_numbers') : t('strip_labels')}
          </p>
          {!labelsDone ? <ChipTray title={t('tray_labels')} chips={labelChips} dnd={dnd} /> : <ChipTray title={t('tray_numbers')} chips={numChips} dnd={dnd} />}
          <p className="md-kbd">{t('kbd_hint')}</p>
          <div className="md-actions">
            <button type="button" className="md-btn md-btn--ghost" onClick={() => (setSlots({}), setMarks({}))}>
              {t('btn_clear')}
            </button>
            <button type="button" className="md-btn md-btn--primary" disabled={!allFilled} onClick={check}>
              {t('btn_check')}
            </button>
          </div>
        </>
      )}
      {dnd.ghost}
    </div>
  );
}
