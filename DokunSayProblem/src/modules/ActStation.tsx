/**
 * 12 · Canlandırma Durağı (DESIGN §12) — 5 kısa madde; her maddede hikâye YALNIZ canlandırılır
 * (şema / model / denklem yok): cümle cümle sanal manipülatiflerle eylem, sonda "ask" okuması
 * (kaç tane?). Oynatıcı Çöz akışındaki ActRunner'ın aynısıdır (kopya değil). Puan tablosu yok;
 * sonuç sade "5 maddenin 4'ü". "İlk denemede" = maddede hiç actMismatch olmadan bitirmek.
 * Kayıt (record.ts): şema, problem, gözlenen stratejiler (inferStrategy) → öğretmen paneli
 * Strateji kartı. Sayının görünürlüğü şemanın iskele düzeyine bağlı (S1/S0 → gizli; §12.1 ilke 4).
 * Serbest Masa alt modu (FreeTable): problem yok, keşif için boş mat.
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import type { Grade, Problem, SchemaId } from '../content/types';
import { pick } from '../i18n';
import { actFeasible, feedbackText } from '../lib/contentAdapter';
import { loadProgress } from '../lib/progress';
import { ActRunner } from '../flow/steps/ActRunner';
import { problemSet } from './api';
import { ModuleShell, Preparing, StoryBlock, useRound, type ModuleProps } from './common';
import { FreeTable } from './FreeTable';

const N = 5;

/**
 * Canlandırılabilir maddeler: sınıfa uygun şemalar, karışık; tek adımlılar önce, şemalar sırayla
 * dönüşümlü (aynı tür art arda gelmesin). Çözülemez maddeler (Dedektif) dışarıda.
 */
export function actItems(grade: Grade, seed: number, n = N): Problem[] {
  const pool: Problem[] = [];
  const seen = new Set<string>();
  for (let k = 0; k < 4 && pool.length < n * 2; k++) {
    for (const p of problemSet(grade, n * 3, seed + k * 977)) {
      if (p.unsolvable || seen.has(p.id) || !actFeasible(p, 0)) continue;
      seen.add(p.id);
      pool.push(p);
    }
  }
  pool.sort((a, b) => a.steps.length - b.steps.length);
  const bySchema = new Map<SchemaId, Problem[]>();
  for (const p of pool) {
    const s = p.steps[0].schema;
    bySchema.set(s, [...(bySchema.get(s) ?? []), p]);
  }
  const out: Problem[] = [];
  const queues = [...bySchema.values()];
  while (out.length < n && queues.some((q) => q.length)) {
    for (const q of queues) {
      const p = q.shift();
      if (p && out.length < n) out.push(p);
    }
  }
  return out;
}

export function ActStation({ lang, grade, seed, t, onExit, onDone }: ModuleProps) {
  const items = useMemo(() => actItems(grade, seed), [grade, seed]);
  const round = useRound('act', grade, Math.max(1, items.length), onDone);
  const [free, setFree] = useState(false);
  const [reading, setReading] = useState<number | null>(null);
  const misses = useRef(0);
  const levels = useMemo(() => loadProgress().schemas, []);

  useEffect(() => {
    misses.current = 0;
  }, [round.index]);

  if (free) return <FreeTable t={t} lang={lang} onBack={() => setFree(false)} onExit={onExit} />;
  if (!items.length) return <Preparing t={t} onExit={onExit} />;

  const problem = items[round.index];
  const schema = problem.steps[0].schema;
  const showCounts = (levels[schema]?.level ?? 3) >= 2;

  return (
    <ModuleShell title={t('m_act')} t={t} lang={lang} onExit={onExit} round={round}>
      <div className="md-act">
        <div className="md-act__bar">
          <button type="button" className="md-btn md-btn--ghost md-btn--sm" onClick={() => setFree(true)}>
            {t('act_free_open')}
          </button>
        </div>
        <StoryBlock problem={problem} lang={lang} t={t} compact reading={reading} />
        <ActRunner
          key={problem.id + round.index}
          problem={problem}
          lang={lang}
          stepIndex={0}
          mode="do"
          showCounts={showCounts}
          speakBeats
          onReading={setReading}
          onOk={(text) => round.info(text ? pick(text, lang) : t('ok_generic'), 'ok')}
          onWrong={(hint) => {
            misses.current += 1;
            const h = hint ?? feedbackText('actMismatch', problem, 'act');
            round.info(pick(h, lang) || t('act_station_try'), 'try');
          }}
          onFinish={(strategies) => {
            const ok = misses.current === 0;
            round.finish(ok, t('act_station_done'), {
              schema,
              problemId: problem.id,
              error: ok ? undefined : 'actMismatch',
              strategies: strategies.length ? [...strategies] : undefined,
            });
          }}
        />
      </div>
    </ModuleShell>
  );
}
