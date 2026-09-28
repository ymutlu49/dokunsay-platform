/**
 * Canlandırma strateji özeti (DESIGN §12.1 ilke 10; CGI — Carpenter, Fennema vd. 1999). SAF.
 * Kaynaklar: tam çözüm kayıtları (`attempt.actStrategies`, `attempt.actUsed`) + Canlandırma
 * Durağı modül kayıtları (`module: 'act'`, `strategies`). Bir gözlem = bir madde; maddede birden
 * çok strateji görülebilir. Gelişim yolu: toplamsal şemalar countAll → countOn → useTens;
 * çarpımsal şemalar dealOneByOne → groupAtOnce; guessCheck yol dışı (ayrı satır).
 * Eğilim: şemanın son 10 gözleminde gözlem başına en ileri basamağın ilk yarı / son yarı
 * ortalaması (≥4 gözlem; fark > 0.25 → up, < −0.25 → down). Yüzde YOK, yalnız sayı.
 */
import type { ActStrategy, SchemaId } from '../content/types';
import type { AttemptRecord } from '../lib/progress';
import type { ModuleRecord } from '../modules/record';

export const STRAT_SCHEMAS: SchemaId[] = ['change', 'combine', 'compare', 'equalGroups', 'multCompare'];
export const ADD_PATH: ActStrategy[] = ['countAll', 'countOn', 'useTens'];
export const MULT_PATH: ActStrategy[] = ['dealOneByOne', 'groupAtOnce'];
export const ALL_STRATEGIES: ActStrategy[] = ['countAll', 'countOn', 'useTens', 'dealOneByOne', 'groupAtOnce', 'guessCheck'];
const RANK: Record<ActStrategy, number> = { countAll: 0, countOn: 1, useTens: 2, dealOneByOne: 0, groupAtOnce: 1, guessCheck: -1 };

export type Trend = 'up' | 'down' | 'flat';

export interface StrategyObs {
  schema: SchemaId;
  strategies: ActStrategy[];
  ts: number;
  source: 'solve' | 'act';
}

export interface SchemaStrategyRow {
  schema: SchemaId;
  /** Gelişim yolu (şema ailesine göre) + yol dışında gözlenenler (count > 0). */
  path: ActStrategy[];
  extra: ActStrategy[];
  counts: Record<ActStrategy, number>;
  obs: number;
  trend: Trend | null;
  /** Son 5 gözlemde en sık yol stratejisi (eşitlikte en son görülen). */
  dominant: ActStrategy | null;
  /** S1/S0 tam çözümlerinde "Nesnelerle dene" açılan / S1–S0 çözüm sayısı. */
  actUsed: number;
  lowAttempts: number;
}

export interface StrategySummary {
  rows: SchemaStrategyRow[];
  totalObs: number;
  actUsed: number;
  lowAttempts: number;
  /** Hâlâ çoğunlukla "hepsini sayıyor" / "birer birer dağıtıyor" görünen şemalar. */
  stillCountAll: SchemaId[];
  stillDealing: SchemaId[];
}

const zeroCounts = (): Record<ActStrategy, number> => ({ countAll: 0, countOn: 0, useTens: 0, dealOneByOne: 0, groupAtOnce: 0, guessCheck: 0 });
const isStrategy = (s: unknown): s is ActStrategy => typeof s === 'string' && s in RANK;

export function pathFor(schema: SchemaId): ActStrategy[] {
  return schema === 'equalGroups' || schema === 'multCompare' ? MULT_PATH : ADD_PATH;
}

export function collectObs(attempts: AttemptRecord[], mods: ModuleRecord[]): StrategyObs[] {
  const out: StrategyObs[] = [];
  for (const a of attempts) {
    const list = (a.actStrategies ?? []).filter(isStrategy);
    const schema = a.schemas?.[0];
    if (list.length && schema) out.push({ schema, strategies: list, ts: a.ts ?? 0, source: 'solve' });
  }
  for (const m of mods) {
    const list = (m.strategies ?? []).filter(isStrategy);
    if (m.module === 'act' && m.schema && list.length) out.push({ schema: m.schema, strategies: list, ts: m.ts ?? 0, source: 'act' });
  }
  return out.sort((x, y) => x.ts - y.ts);
}

function obsRank(o: StrategyObs): number | null {
  const r = o.strategies.map((s) => RANK[s]).filter((x) => x >= 0);
  return r.length ? Math.max(...r) : null;
}

export function trendOf(obs: StrategyObs[]): Trend | null {
  const ranks = obs
    .slice(-10)
    .map(obsRank)
    .filter((x): x is number => x != null);
  if (ranks.length < 4) return null;
  const h = Math.floor(ranks.length / 2);
  const avg = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / xs.length;
  const d = avg(ranks.slice(h)) - avg(ranks.slice(0, h));
  return d > 0.25 ? 'up' : d < -0.25 ? 'down' : 'flat';
}

export function dominantOf(obs: StrategyObs[], path: ActStrategy[]): ActStrategy | null {
  const c = zeroCounts();
  const lastSeen = zeroCounts();
  obs.slice(-5).forEach((o, i) => o.strategies.forEach((s) => ((c[s] += 1), (lastSeen[s] = i + 1))));
  let best: ActStrategy | null = null;
  for (const s of path) {
    if (c[s] === 0) continue;
    if (best == null || c[s] > c[best] || (c[s] === c[best] && lastSeen[s] > lastSeen[best])) best = s;
  }
  return best;
}

export function buildStrategySummary(attempts: AttemptRecord[], mods: ModuleRecord[]): StrategySummary {
  const all = collectObs(attempts, mods);
  const rows: SchemaStrategyRow[] = [];
  let actUsed = 0;
  let lowAttempts = 0;
  for (const schema of STRAT_SCHEMAS) {
    const obs = all.filter((o) => o.schema === schema);
    const low = attempts.filter((a) => a.schemas?.[0] === schema && a.level <= 1);
    const used = low.filter((a) => a.actUsed).length;
    actUsed += used;
    lowAttempts += low.length;
    if (!obs.length && !used) continue;
    const counts = zeroCounts();
    obs.forEach((o) => new Set(o.strategies).forEach((s) => (counts[s] += 1)));
    const path = pathFor(schema);
    rows.push({
      schema,
      path,
      extra: ALL_STRATEGIES.filter((s) => !path.includes(s) && counts[s] > 0),
      counts,
      obs: obs.length,
      trend: trendOf(obs),
      dominant: dominantOf(obs, path),
      actUsed: used,
      lowAttempts: low.length,
    });
  }
  return {
    rows,
    totalObs: all.length,
    actUsed,
    lowAttempts,
    stillCountAll: rows.filter((r) => r.dominant === 'countAll').map((r) => r.schema),
    stillDealing: rows.filter((r) => r.dominant === 'dealOneByOne').map((r) => r.schema),
  };
}
