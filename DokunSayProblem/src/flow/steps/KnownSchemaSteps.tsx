/**
 * known: sayı çiplerini "İşime yarar / Gerek yok" kutularına ayır (yalnız I>0).
 * schema: şema kartları — düzeye göre 2–5 kart; S3'te (yeni şema) tek kart + gerekçe;
 * H3'te seçenekler ikiye iner.
 */
import { useMemo, useState } from 'react';
import type { Grade, ScaffoldLevel, SchemaId } from '../../content/types';
import { pick, useT } from '../../i18n';
import { checkSchemaChoice, schemaMeta, SCHEMAS } from '../../lib/contentAdapter';
import { shuffleSeeded, storyChips } from '../../lib/problemUtil';
import { ChipTray } from '../../components/ChipTray';
import { SchemaCard } from '../../components/SchemaCard';
import { useDragDrop } from '../../components/useDragDrop';
import { NextBtn, type StepProps } from './common';

type Bin = 'useful' | 'notNeeded';

export function KnownStep({ s, dispatch, lang, next, ok, wrong, guided }: StepProps) {
  const t = useT();
  const chips = useMemo(() => storyChips(s.problem, lang), [s.problem, lang]);
  const truth = (id: string): Bin => (chips.find((c) => c.id === id)?.extra ? 'notNeeded' : 'useful');
  const [bins, setBins] = useState<Record<string, Bin>>(() =>
    guided ? Object.fromEntries(chips.map((c) => [c.id, truth(c.id)])) : {},
  );
  const [checked, setChecked] = useState(guided);
  const dnd = useDragDrop({
    targetOrder: ['useful', 'notNeeded'],
    onDrop: (item, target) => {
      setChecked(false);
      setBins((b) => ({ ...b, [item]: target as Bin }));
    },
  });
  const all = chips.every((c) => bins[c.id]);
  const allOk = chips.every((c) => bins[c.id] === truth(c.id));
  const check = () => {
    setChecked(true);
    if (allOk) {
      dispatch({ type: 'known', bins });
      ok();
    } else wrong('irrelevantUsed');
  };
  const binView = (b: Bin) => (
    <button type="button" className={`bin bin--${b}`} {...dnd.targetProps(b)} aria-label={t(b === 'useful' ? 'useful' : 'not_needed')}>
      <span className="bin__title">{t(b === 'useful' ? 'useful' : 'not_needed')}</span>
      <span className="bin__items">
        {chips
          .filter((c) => bins[c.id] === b)
          .map((c) => (
            <span key={c.id} className={`chip chip--num${checked ? (truth(c.id) === b ? ' is-ok' : ' is-bad') : ''}`} data-numeric="true">
              {c.value}
            </span>
          ))}
      </span>
    </button>
  );
  return (
    <div className="step">
      <ChipTray
        title={t('numbers_tray')}
        dnd={dnd}
        chips={chips.map((c) => ({ id: c.id, text: String(c.value), kind: 'num' as const, used: !!bins[c.id] }))}
      />
      <div className="bins">
        {binView('useful')}
        {binView('notNeeded')}
      </div>
      {dnd.ghost}
      {checked && allOk ? (
        <NextBtn onClick={next} />
      ) : (
        <div className="step-actions">
          <button type="button" className="btn btn--ghost" onClick={() => { setBins({}); setChecked(false); }}>
            {t('btn_clear')}
          </button>
          <button type="button" className="btn btn--primary" disabled={!all} onClick={check}>
            {t('btn_check')}
          </button>
        </div>
      )}
    </div>
  );
}

/** Sınıfa uygun şemalar (DESIGN §3 tablosu). */
export function schemasForGrade(g: Grade): SchemaId[] {
  return SCHEMAS.filter((x) => (x === 'equalGroups' ? g >= 2 : x === 'multCompare' ? g >= 3 : true));
}

export function SchemaStep({ s, dispatch, link, lang, next, ok, wrong, guided, hint, level }: StepProps & { level: ScaffoldLevel }) {
  const t = useT();
  const step = s.problem.steps[link];
  const correct = step.schema;
  const [bad, setBad] = useState<SchemaId[]>([]);
  const [done, setDone] = useState(guided || s.schemaChosen[link] === correct);
  const cards = useMemo(() => {
    const pool = schemasForGrade(s.problem.grade).filter((x) => x !== correct);
    if (level === 3) return [correct];
    const n = level === 2 ? 2 : pool.length;
    return shuffleSeeded([correct, ...shuffleSeeded(pool, s.problem.seed).slice(0, n)], s.problem.seed + link);
  }, [s.problem, level, correct, link]);
  const shown = hint >= 3 ? cards.filter((c) => c === correct || c === cards.find((x) => x !== correct && !bad.includes(x))) : cards;
  const meta = schemaMeta(correct);
  return (
    <div className="step">
      {level === 3 && <p className="step-sub">{pick(meta.story, lang)}</p>}
      <div className="schemacards">
        {shown.map((c) => (
          <SchemaCard
            key={c}
            schema={c}
            badge={level === 3 ? t('lvl_new') : undefined}
            footer={level === 3 || (done && c === correct) ? pick(schemaMeta(c).rule, lang) : undefined}
            state={done && c === correct ? 'ok' : bad.includes(c) ? 'bad' : null}
            disabled={done || bad.includes(c)}
            onPick={() => {
              if (checkSchemaChoice(step, c)) {
                setDone(true);
                dispatch({ type: 'schema', link, schema: c });
                ok();
              } else {
                setBad((b) => [...b, c]);
                wrong('schemaId');
              }
            }}
          />
        ))}
      </div>
      {done && <NextBtn onClick={next} />}
    </div>
  );
}
