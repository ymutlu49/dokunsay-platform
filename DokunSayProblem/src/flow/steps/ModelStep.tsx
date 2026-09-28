/**
 * GÖSTER — modeli kur (DESIGN §6 adım 2; 03 §B1 2b–2c).
 * İKİ AŞAMALI KİLİT: önce etiket kartları kutulara, sonra sayı çipleri ve "?" jetonu.
 * Denetim parça bazında (renk + ✓/! + sesli etiket); yanlış modelle ilerleme YOK.
 * Parça-Bütün'de iki parçanın yer değiştirmesi hata sayılmaz (tek doğru şekil dayatılmaz —
 * 05 §F3). H3: bir kutu doğru dolu gelir.
 */
import { useEffect, useMemo, useState } from 'react';
import type { Role, ScaffoldLevel } from '../../content/types';
import { pick, useT } from '../../i18n';
import { checkModelPlacement, type Placements } from '../../lib/contentAdapter';
import { modelChips } from '../../lib/problemUtil';
import { ChipTray, type TrayChip } from '../../components/ChipTray';
import { SchemaDiagram, type BoxContent, type Mark } from '../../components/diagram/SchemaDiagram';
import { useDragDrop } from '../../components/useDragDrop';
import { useA11y } from '../../state/A11yContext';
import { NextBtn, type StepProps } from './common';

interface Slot {
  label?: Role;
  value?: number | '?';
  chip?: string;
}

export function ModelStep({ s, dispatch, link, lang, next, ok, wrong, guided, hint, level }: StepProps & { level: ScaffoldLevel }) {
  const t = useT();
  const { announce } = useA11y();
  const step = s.problem.steps[link];
  const roles = step.quantities.map((q) => q.role);
  const solvedSlots = (): Record<string, Slot> =>
    Object.fromEntries(step.quantities.map((q) => [q.role, { label: q.role, value: q.role === step.unknown ? '?' : q.value, chip: 'g' }]));
  // Canlandırmadan gelindiyse (DESIGN §12.1 ilke 8) etiketler yerleşik, sayılar boş başlar.
  const fromAct = !guided && !!s.actDone?.[link];
  const [slots, setSlots] = useState<Record<string, Slot>>(() =>
    guided ? solvedSlots() : fromAct ? Object.fromEntries(roles.map((r) => [r, { label: r }])) : {},
  );
  const [marks, setMarks] = useState<Partial<Record<Role, Mark>>>({});
  const [passed, setPassed] = useState(guided);
  const [view, setView] = useState<'arrow' | 'bar'>('arrow');

  useEffect(() => {
    if (guided) {
      setSlots(solvedSlots());
      setPassed(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [guided]);

  const hideIds = Object.entries(s.known).filter(([, b]) => b === 'notNeeded').map(([id]) => id);
  const nums = useMemo(() => modelChips(s.problem, lang, link, s.linkResults, hideIds), [s.problem, lang, link, s.linkResults, hideIds.join()]);
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
    ...nums.map((c) => ({ id: c.id, text: String(c.value), kind: 'num' as const, used: usedChips.has(c.id), sub: c.derived ? t('prev_result') : undefined })),
    { id: 'U', text: '?', kind: 'unknown' as const, used: usedChips.has('U') },
  ];

  const dnd = useDragDrop({
    targetOrder: roles,
    onDrop: (item, target) => {
      const box = target as Role;
      if (!roles.includes(box)) return;
      setMarks({});
      if (item.startsWith('L:')) {
        const lr = item.slice(2) as Role;
        setSlots((sl) => {
          const n: Record<string, Slot> = {};
          for (const [k, v] of Object.entries(sl)) n[k] = v.label === lr ? { ...v, label: undefined } : v;
          n[box] = { ...n[box], label: lr };
          return n;
        });
        announce?.(t('chip_placed', { v: labelChips.find((c) => c.id === item)?.text ?? '', box: String(roles.indexOf(box) + 1) }));
        return;
      }
      if (!labelsDone) {
        announce?.(t('labels_first'));
        dispatch({ type: 'feedback', tone: 'info', text: { tr: t('labels_first'), ku: t('labels_first'), en: t('labels_first') } });
        return;
      }
      const value: number | '?' = item === 'U' ? '?' : nums.find((c) => c.id === item)?.value ?? 0;
      setSlots((sl) => {
        const n: Record<string, Slot> = {};
        for (const [k, v] of Object.entries(sl)) n[k] = v.chip === item ? { ...v, value: undefined, chip: undefined } : v;
        n[box] = { ...n[box], value, chip: item };
        return n;
      });
      announce?.(t('chip_placed', { v: String(value), box: String(roles.indexOf(box) + 1) }));
    },
    onTargetTap: (target) => {
      if (passed) return;
      const box = target as Role;
      setMarks({});
      setSlots((sl) => {
        const cur = sl[box];
        if (!cur) return sl;
        if (cur.value != null) return { ...sl, [box]: { label: cur.label } };
        return { ...sl, [box]: {} };
      });
    },
  });

  // H3: bir kutu doğru dolu gelir (önce yanlış/boş olanlardan).
  useEffect(() => {
    if (hint !== 3 || passed) return;
    const q = step.quantities.find((x) => {
      const sl = slots[x.role];
      return !sl || sl.label !== x.role || sl.value !== (x.role === step.unknown ? '?' : x.value);
    });
    if (!q) return;
    setSlots((sl) => ({ ...sl, [q.role]: { label: q.role, value: q.role === step.unknown ? '?' : q.value, chip: `h:${q.role}` } }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hint]);

  const check = () => {
    // Parça-Bütün: parçaların yer değiştirmesi kabul (etiket ve değer birlikte takas).
    let eff = slots;
    if (step.schema === 'combine' && slots.part1?.label === 'part2' && slots.part2?.label === 'part1') {
      eff = { ...slots, part1: slots.part2, part2: slots.part1 };
    }
    const placements: Placements = {};
    roles.forEach((r) => {
      if (eff[r]?.value != null) placements[r] = eff[r].value as number | '?';
    });
    const res = checkModelPlacement(step, placements, s.problem.extras);
    const m: Partial<Record<Role, Mark>> = {};
    let allOk = true;
    roles.forEach((r) => {
      const labelOk = eff[r]?.label === r;
      const good = labelOk && !!res.perRole[r];
      const box = eff === slots ? r : r === 'part1' ? 'part2' : r === 'part2' ? 'part1' : r;
      m[box] = good ? 'ok' : 'bad';
      if (!good) allOk = false;
    });
    setMarks(m);
    if (allOk) {
      setPassed(true);
      dispatch({ type: 'model', link, result: { values: placements, labels: Object.fromEntries(roles.map((r) => [r, eff[r]?.label])) } });
      ok();
    } else {
      dispatch({ type: 'modelFail' });
      wrong(res.error ?? 'modelPlacement');
    }
  };

  const boxes: Partial<Record<Role, BoxContent>> = {};
  roles.forEach((r) => {
    const sl = slots[r];
    const q = sl?.label ? step.quantities.find((x) => x.role === sl.label) : undefined;
    boxes[r] = { label: q ? pick(q.label, lang) : undefined, value: sl?.value };
  });
  const allFilled = roles.every((r) => slots[r]?.label && slots[r]?.value != null);

  return (
    <div className="step step-model">
      {step.schema === 'change' && (
        <div className="viewtoggle" role="group">
          <button type="button" className={`pill${view === 'arrow' ? ' is-on' : ''}`} aria-pressed={view === 'arrow'} onClick={() => setView('arrow')}>
            {t('btn_arrow_view')}
          </button>
          <button type="button" className={`pill${view === 'bar' ? ' is-on' : ''}`} aria-pressed={view === 'bar'} onClick={() => setView('bar')}>
            {t('btn_bar_view')}
          </button>
        </div>
      )}
      <SchemaDiagram
        step={step}
        lang={lang}
        mode="build"
        boxes={boxes}
        marks={marks}
        showRoleNames={level >= 2}
        target={passed ? undefined : (r) => dnd.targetProps(r)}
        view={view}
      />
      {!passed && (
        <>
          <p className="step-sub">{labelsDone ? t('p_model_numbers') : t('p_model_labels')}</p>
          {!labelsDone ? <ChipTray title={t('labels_tray')} chips={labelChips} dnd={dnd} /> : <ChipTray title={t('numbers_tray')} chips={numChips} dnd={dnd} />}
          {labelsDone && (
            <details className="tray-labels">
              <summary>{t('labels_tray')}</summary>
              <ChipTray title={t('labels_tray')} chips={labelChips} dnd={dnd} />
            </details>
          )}
          <p className="kbd-hint">{t('kbd_hint')}</p>
          <div className="step-actions">
            <button type="button" className="btn btn--ghost" onClick={() => { setSlots({}); setMarks({}); }}>
              {t('btn_clear')}
            </button>
            <button type="button" className="btn btn--primary" disabled={!allFilled} onClick={check}>
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
