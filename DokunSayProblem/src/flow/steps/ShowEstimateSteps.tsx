/**
 * checkModel: doğru model ÖLÇEKLİ görünüme 400 ms'de geçer (hareket azaltılmışsa anında);
 *   ≤20'de birim kareler isteğe bağlı (somut → yarı somut → soyut).
 * estimate: 1–3. sınıf "bildiğim en büyük sayıdan büyük mü küçük mü?" iki büyük düğme;
 *   4+ sayı doğrusunda sürgü. Puanlanmaz.
 */
import { useEffect, useState } from 'react';
import type { Role } from '../../content/types';
import { useT } from '../../i18n';
import { knownMax, unknownValue } from '../../lib/problemUtil';
import { SchemaDiagram, type BoxContent } from '../../components/diagram/SchemaDiagram';
import { useReducedMotion } from '../../state/A11yContext';
import { NextBtn, type StepProps } from './common';

export function solvedBoxes(s: StepProps['s'], link: number, lang: StepProps['lang']): Partial<Record<Role, BoxContent>> {
  const step = s.problem.steps[link];
  const b: Partial<Record<Role, BoxContent>> = {};
  for (const q of step.quantities) b[q.role] = { label: q.label[lang] || q.label.tr, value: q.role === step.unknown ? '?' : q.value };
  return b;
}

export function CheckModelStep({ s, link, lang, next }: StepProps) {
  const t = useT();
  const reduced = useReducedMotion();
  const step = s.problem.steps[link];
  const [scaled, setScaled] = useState(reduced);
  const [units, setUnits] = useState(false);
  useEffect(() => {
    if (reduced) return;
    const id = setTimeout(() => setScaled(true), 60);
    return () => clearTimeout(id);
  }, [reduced]);
  const maxVal = Math.max(...step.quantities.map((q) => q.value));
  return (
    <div className="step">
      <SchemaDiagram step={step} lang={lang} mode={scaled ? 'scaled' : 'build'} boxes={solvedBoxes(s, link, lang)} marks={Object.fromEntries(step.quantities.map((q) => [q.role, 'ok']))} units={units} />
      {maxVal <= 20 && (
        <label className="switch">
          <input type="checkbox" checked={units} onChange={(e) => setUnits(e.target.checked)} /> {t('btn_units')}
        </label>
      )}
      <NextBtn onClick={next} />
    </div>
  );
}

export function EstimateStep({ s, dispatch, next, guided }: StepProps) {
  const t = useT();
  const big = knownMax(s.problem);
  const answer = s.problem.answer;
  const lineMode = s.problem.grade >= 4;
  const top = Math.max(10, Math.ceil((Math.max(big, answer) * 2) / 10) * 10);
  const [val, setVal] = useState(Math.round(top / 2));
  useEffect(() => {
    if (guided && !s.estimate) {
      dispatch(lineMode ? { type: 'estimate', value: { kind: 'line', value: unknownValue(s.problem.steps[0]) } } : { type: 'estimate', value: { kind: 'dir', bigger: answer > big } });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [guided]);
  const chosen = s.estimate;
  if (lineMode) {
    return (
      <div className="step">
        <div className="slider">
          <input
            type="range"
            min={0}
            max={top}
            step={top <= 100 ? 1 : 10}
            value={chosen?.kind === 'line' ? chosen.value : val}
            onChange={(e) => setVal(Number(e.target.value))}
            aria-label={t('p_estimate_line')}
            aria-valuetext={String(val)}
          />
          <div className="slider__scale" aria-hidden="true">
            <span>0</span>
            <b data-numeric="true">{chosen?.kind === 'line' ? chosen.value : val}</b>
            <span>{top}</span>
          </div>
        </div>
        {chosen ? (
          <NextBtn onClick={next} />
        ) : (
          <div className="step-actions">
            <button type="button" className="btn btn--primary" onClick={() => dispatch({ type: 'estimate', value: { kind: 'line', value: val } })}>
              {t('key_ok')}
            </button>
          </div>
        )}
      </div>
    );
  }
  const dir = chosen?.kind === 'dir' ? chosen.bigger : null;
  return (
    <div className="step">
      <div className="bigchoice" role="group">
        <button type="button" className={`bigchoice__btn${dir === false ? ' is-on' : ''}`} aria-pressed={dir === false} onClick={() => dispatch({ type: 'estimate', value: { kind: 'dir', bigger: false } })}>
          <span className="bigchoice__sym" aria-hidden="true">&lt; {big}</span>
          {t('btn_smaller')}
        </button>
        <button type="button" className={`bigchoice__btn${dir === true ? ' is-on' : ''}`} aria-pressed={dir === true} onClick={() => dispatch({ type: 'estimate', value: { kind: 'dir', bigger: true } })}>
          <span className="bigchoice__sym" aria-hidden="true">&gt; {big}</span>
          {t('btn_bigger')}
        </button>
      </div>
      {chosen && <NextBtn onClick={next} />}
    </div>
  );
}
