/**
 * Canlandırmanın sonu: "Şimdi şeride dönüştürelim" → her miktarın sayaç sırası 600 ms'de
 * ORANTILI şeride akar (StripMorph). Satırlar şema rolleridir (model adımıyla aynı ton ve
 * etiket) — böylece mat ile şerit diyagramı arasındaki köprü görünür (concreteness fading).
 */
import { useEffect, useState } from 'react';
import type { ActScript, Problem, Role } from '../../content/types';
import { pick, useLang, useT } from '../../i18n';
import { toneOf } from '../../components/diagram/common';
import { StripMorph, type MorphRow } from '../../components/mat/StripMorph';
import type { MatState, MatZone } from '../../components/mat/matState';
import { useReducedMotion } from '../../state/A11yContext';
import { Say } from '../../components/Talk';

const ORDER: Record<string, Role[]> = {
  change: ['start', 'change', 'result'],
  combine: ['part1', 'part2', 'whole'],
  compare: ['larger', 'smaller', 'difference'],
  equalGroups: ['perGroup', 'total'],
  multCompare: ['reference', 'compared'],
};

export function morphRows(problem: Problem, step: number, lang: ReturnType<typeof useLang>): MorphRow[] {
  const st = problem.steps[step];
  const v = (r: Role) => st.quantities.find((q) => q.role === r)?.value ?? 0;
  return (ORDER[st.schema] ?? []).map((r) => {
    const q = st.quantities.find((x) => x.role === r);
    return {
      id: r,
      label: q ? pick(q.label, lang) : r,
      value: v(r),
      tone: toneOf(st.schema, r),
      segments: r === 'total' ? v('groups') : r === 'compared' && st.schema === 'multCompare' ? v('factor') : undefined,
      unknown: r === st.unknown,
    };
  });
}

export function ActEnd({
  script,
  problem,
  onDone,
}: {
  script: ActScript;
  zones: MatZone[];
  mat: MatState;
  problem: Problem;
  onDone: () => void;
}) {
  const t = useT();
  const lang = useLang();
  const reduced = useReducedMotion();
  const [go, setGo] = useState(false);
  const [strip, setStrip] = useState(false);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (!go) return;
    if (reduced) {
      setStrip(true);
      setReady(true);
      return;
    }
    const a = requestAnimationFrame(() => setStrip(true));
    const b = setTimeout(() => setReady(true), 700);
    return () => {
      cancelAnimationFrame(a);
      clearTimeout(b);
    };
  }, [go, reduced]);
  const rows = morphRows(problem, script.step, lang);
  return (
    <div className="act act--end">
      <StripMorph rows={rows} strip={strip} />
      {ready && (
        <p className="act__prompt">
          {t('act_strip_done')} <Say text={t('act_strip_done')} size={30} />
        </p>
      )}
      <div className="step-actions">
        {!go ? (
          <button type="button" className="btn btn--primary" onClick={() => setGo(true)} autoFocus>
            {t('act_to_strip')} →
          </button>
        ) : (
          ready && (
            <button type="button" className="btn btn--primary" onClick={onDone} autoFocus>
              {t('btn_continue')} →
            </button>
          )
        )}
      </div>
    </div>
  );
}
