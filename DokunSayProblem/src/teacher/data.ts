/**
 * Öğretmen özeti için saf toplulaştırma: tam çözüm kayıtları (progress.ts `attempts`) +
 * modül kayıtları (modules/record.ts). Normatif sıralama/puan tablosu YOK; yalnız şema
 * bazında düzey ve hata örüntüsü (DESIGN §9; 03 §D4).
 */
import type { ErrorClass, FlowStepId, ScaffoldLevel, SchemaId } from '../content/types';
import { loadAttempts, loadProgress, type AttemptRecord } from '../lib/progress';
import { loadModuleRecords, type ModuleRecord } from '../modules/record';

export const SCHEMA_LIST: SchemaId[] = ['change', 'combine', 'compare', 'equalGroups', 'multCompare'];
export const ERROR_LIST: ErrorClass[] = [
  'schemaId',
  'modelPlacement',
  'unknownPlacement',
  'irrelevantUsed',
  'reversal',
  'textOrderOp',
  'operation',
  'computation',
  'unitOrRemainder',
  'unsolvableMissed',
];
export const STEP_LIST: FlowStepId[] = ['read', 'retell', 'question', 'known', 'schema', 'model', 'checkModel', 'estimate', 'equation', 'compute', 'answer', 'reasonable', 'reflect'];

export interface TeacherSummary {
  attempts: AttemptRecord[];
  mods: ModuleRecord[];
  mastery: { schema: SchemaId; level: ScaffoldLevel | null; solved: number }[];
  hints: number[];
  stepTimes: { step: FlowStepId; avgSec: number; n: number }[];
  heat: Record<ErrorClass, Record<SchemaId, number>>;
  conf: Record<SchemaId, Record<SchemaId, number>>;
  confN: number;
  heatMax: number;
}

function zeroRow(): Record<SchemaId, number> {
  return { change: 0, combine: 0, compare: 0, equalGroups: 0, multCompare: 0 };
}

export function buildSummary(): TeacherSummary {
  const attempts = loadAttempts();
  const mods = loadModuleRecords();
  const prog = loadProgress();

  const mastery = SCHEMA_LIST.map((s) => {
    const sp = prog.schemas[s];
    return { schema: s, level: sp ? sp.level : null, solved: sp?.solved ?? 0 };
  });

  const hints = [0, 0, 0, 0, 0];
  attempts.forEach((a) => {
    const h = Math.max(0, Math.min(4, Math.round(a.maxHint ?? 0)));
    hints[h] += 1;
  });

  const sums = new Map<FlowStepId, { t: number; n: number }>();
  attempts.forEach((a) => {
    for (const [k, v] of Object.entries(a.stepTimes ?? {})) {
      if (typeof v !== 'number' || v <= 0) continue;
      const cur = sums.get(k as FlowStepId) ?? { t: 0, n: 0 };
      sums.set(k as FlowStepId, { t: cur.t + Math.min(v, 10 * 60 * 1000), n: cur.n + 1 });
    }
  });
  const stepTimes = STEP_LIST.filter((s) => sums.has(s)).map((s) => {
    const x = sums.get(s)!;
    return { step: s, avgSec: Math.round(x.t / x.n / 1000), n: x.n };
  });

  const heat = Object.fromEntries(ERROR_LIST.map((e) => [e, zeroRow()])) as Record<ErrorClass, Record<SchemaId, number>>;
  const bump = (e: ErrorClass | undefined, s: SchemaId | undefined) => {
    if (!e || !s || !heat[e] || !(s in heat[e])) return;
    heat[e][s] += 1;
  };
  attempts.forEach((a) => (a.errors ?? []).forEach((e) => bump(e, a.schemas?.[0])));
  mods.forEach((m) => bump(m.error, m.schema));
  let heatMax = 0;
  ERROR_LIST.forEach((e) => SCHEMA_LIST.forEach((s) => (heatMax = Math.max(heatMax, heat[e][s]))));

  const conf = Object.fromEntries(SCHEMA_LIST.map((s) => [s, zeroRow()])) as Record<SchemaId, Record<SchemaId, number>>;
  let confN = 0;
  mods.forEach((m) => {
    if (m.module !== 'typeHunter' || !m.schema || !m.chosen || !conf[m.schema]) return;
    conf[m.schema][m.chosen] += 1;
    confN += 1;
  });

  return { attempts, mods, mastery, hints, stepTimes, heat, conf, confN, heatMax };
}
