/**
 * 6 · Gereksizi Ayıkla (03 §C8) — axes.I≥1 problemlerde sayı çiplerini "İşime yarar /
 * Gerek yok" kutularına ayır. Üç yol: sürükle-bırak · dokun-dokun · klavye (useDragDrop).
 * Gereksiz sayıyı "İşime yarar"a koymak → 'irrelevantUsed'. Kutudaki çipe dokun → geri al.
 */
import { useMemo, useState } from 'react';
import { storyChips, type NumChip } from '../lib/problemUtil';
import { ChipTray, type TrayChip } from '../components/ChipTray';
import { useDragDrop } from '../components/useDragDrop';
import { problemSet } from './api';
import { ModuleShell, Preparing, StoryBlock, useRound, type ModuleProps } from './common';

const N = 5;
type Bin = 'need' | 'not';

export function SortRelevant({ lang, grade, seed, t, onExit, onDone }: ModuleProps) {
  const items = useMemo(() => {
    const I = (grade >= 3 ? 2 : 1) as 1 | 2;
    const pool = [...problemSet(grade, 8, seed, { axes: { I: 1, M: 1 } }), ...problemSet(grade, 6, seed + 50, { axes: { I, M: 1 } })];
    const seen = new Set<string>();
    return pool
      .filter((p) => p.extras.length > 0 && storyChips(p, 'tr').some((c) => c.extra))
      .filter((p) => (seen.has(p.id) ? false : (seen.add(p.id), true)))
      .slice(0, N);
  }, [grade, seed]);
  const round = useRound('sortRelevant', grade, Math.max(1, items.length), onDone, 3);
  const [place, setPlace] = useState<Record<string, Bin>>({});
  const [marks, setMarks] = useState<Record<string, 'ok' | 'bad'>>({});
  const problem = items[round.index];
  const chips: NumChip[] = useMemo(() => (problem ? storyChips(problem, lang) : []), [problem, lang]);

  const dnd = useDragDrop({
    targetOrder: ['need', 'not'],
    onDrop: (item, target) => {
      if (round.solved || (target !== 'need' && target !== 'not')) return;
      setMarks({});
      setPlace((p) => ({ ...p, [item]: target }));
    },
  });

  if (!items.length || !problem) return <Preparing t={t} onExit={onExit} />;

  const tray: TrayChip[] = chips.filter((c) => !place[c.id]).map((c) => ({ id: c.id, text: String(c.value), kind: 'num' }));
  const allPlaced = chips.every((c) => place[c.id]);
  const unplace = (id: string) => {
    if (round.solved) return;
    setMarks({});
    setPlace((p) => {
      const n = { ...p };
      delete n[id];
      return n;
    });
  };

  const check = () => {
    const m: Record<string, 'ok' | 'bad'> = {};
    let extraUsed = false;
    chips.forEach((c) => {
      const want: Bin = c.extra ? 'not' : 'need';
      m[c.id] = place[c.id] === want ? 'ok' : 'bad';
      if (c.extra && place[c.id] === 'need') extraUsed = true;
    });
    const ok = Object.values(m).every((x) => x === 'ok');
    setMarks(m);
    const res = round.answer(ok, ok ? t('sort_ok') : round.attempts >= 2 ? t('shown_answer') : t('sort_hint'), {
      schema: problem.steps[0].schema,
      error: ok ? undefined : extraUsed ? 'irrelevantUsed' : undefined,
      problemId: problem.id,
    });
    if (res === 'reveal') {
      setPlace(Object.fromEntries(chips.map((c) => [c.id, c.extra ? 'not' : 'need'])));
      setMarks(Object.fromEntries(chips.map((c) => [c.id, 'ok'])));
    }
  };

  const binView = (bin: Bin) => (
    <div className={`md-bin md-bin--${bin}`} data-drop={bin}>
      <button type="button" className="md-bin__drop" {...dnd.targetProps(bin)} aria-label={t(bin === 'need' ? 'bin_need' : 'bin_not')}>
        {bin === 'need' ? '✔ ' : '✖ '}
        {t(bin === 'need' ? 'bin_need' : 'bin_not')}
      </button>
      <div className="md-bin__items">
        {chips
          .filter((c) => place[c.id] === bin)
          .map((c) => (
            <button
              key={c.id}
              type="button"
              className={`md-chip${marks[c.id] ? ` is-${marks[c.id]}` : ''}`}
              onClick={() => unplace(c.id)}
              data-numeric="true"
              data-semantic={marks[c.id] === 'ok' ? 'positive' : marks[c.id] === 'bad' ? 'negative' : undefined}
            >
              {c.value}
              {marks[c.id] && <span aria-hidden="true"> {marks[c.id] === 'ok' ? '✓' : '!'}</span>}
            </button>
          ))}
      </div>
    </div>
  );

  return (
    <ModuleShell
      title={t('m_sort')}
      t={t}
      lang={lang}
      onExit={onExit}
      round={{
        ...round,
        next: () => {
          setPlace({});
          setMarks({});
          round.next();
        },
      }}
    >
      <StoryBlock problem={problem} lang={lang} t={t} />
      <h3 className="md-q">{t('sort_q')}</h3>
      {tray.length > 0 && !round.solved && <ChipTray title={t('tray_numbers')} chips={tray} dnd={dnd} />}
      <div className="md-bins">
        {binView('need')}
        {binView('not')}
      </div>
      {!round.solved && (
        <>
          <p className="md-kbd">{t('kbd_hint')}</p>
          <div className="md-actions">
            <button type="button" className="md-btn md-btn--primary" disabled={!allPlaced} onClick={check}>
              {t('btn_check')}
            </button>
          </div>
        </>
      )}
      {dnd.ghost}
    </ModuleShell>
  );
}
