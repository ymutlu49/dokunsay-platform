/**
 * Çözüm akışı durum makinesi (useReducer — STANDARDS §2.6 "karmaşık" düzey).
 *
 * Akış bir PLAN'dır: [{id: FlowStepId, link}] dizisi. Plan iskele düzeyine göre kurulur
 * (DESIGN §6, §6.3): S2/S3 tüm mikro-adımlar; S1 beş ana adım (yeniden anlatma ve soru
 * kartları "Nasıl yapıyordum?" ile isteğe bağlı); S0 tahmin ve denklem gizli.
 * İki adımlı problemlerde "Göster" ve "Çöz" her halka (link) için tekrarlanır.
 * S3'te `guideUntil`'dan önceki adımları Rehber yapar (geriye doğru soluklaştırma).
 * Canlandır (DESIGN §12): yalnız S2/S3'te, yalnız ilk halkada ve betik uygunsa, şemadan ÖNCE.
 */
import { MAIN_STEPS, type ActStrategy, type ErrorClass, type FlowStepId, type L10n, type MainStep, type Problem, type Role, type ScaffoldLevel, type SchemaId } from '../content/types';
import { actFeasible, type EqToken, type Placements } from '../lib/contentAdapter';

export interface PlanStep {
  id: FlowStepId;
  link: number;
}

export const MAIN_OF: Record<FlowStepId, MainStep> = Object.fromEntries(
  MAIN_STEPS.flatMap((m) => m.micro.map((id) => [id, m.id])),
) as Record<FlowStepId, MainStep>;

export const MAIN_INDEX: Record<MainStep, number> = { understand: 0, show: 1, estimate: 2, solve: 3, check: 4 };

export function buildPlan(problem: Problem, level: ScaffoldLevel, withReflect: boolean): PlanStep[] {
  const plan: PlanStep[] = [{ id: 'read', link: 0 }];
  if (level >= 2) plan.push({ id: 'retell', link: 0 }, { id: 'question', link: 0 });
  if (problem.extras.length > 0 && level >= 1) plan.push({ id: 'known', link: 0 });
  problem.steps.forEach((_, link) => {
    if (link === 0 && level >= 2 && actFeasible(problem, 0)) plan.push({ id: 'act', link: 0 });
    plan.push({ id: 'schema', link }, { id: 'model', link }, { id: 'checkModel', link });
    if (link === 0 && level >= 1) plan.push({ id: 'estimate', link: 0 });
    if (level >= 1) plan.push({ id: 'equation', link });
    plan.push({ id: 'compute', link });
  });
  plan.push({ id: 'answer', link: problem.steps.length - 1 }, { id: 'reasonable', link: problem.steps.length - 1 });
  if (withReflect && level < 3) plan.push({ id: 'reflect', link: problem.steps.length - 1 });
  return plan;
}

/** S3: çözümlü örnekte kaç ana adımı Rehber yapar? (e=0: hepsi; e=1: Kontrol hariç…) */
export function guideUntilFor(plan: PlanStep[], level: ScaffoldLevel, examples: number): number {
  if (level !== 3) return 0;
  const childFromMain = 5 - Math.min(4, Math.max(0, examples)); // e=0 → 5 (hiçbiri), e=1 → 4 (check)
  const i = plan.findIndex((p) => MAIN_INDEX[MAIN_OF[p.id]] >= childFromMain);
  return i === -1 ? plan.length : i;
}

export interface ModelResult {
  values: Placements;
  labels: Partial<Record<Role, Role>>;
}

export interface Feedback {
  tone: 'ok' | 'wrong' | 'info';
  text: L10n;
  n: number;
}

export interface SolveState {
  problem: Problem;
  level: ScaffoldLevel;
  plan: PlanStep[];
  idx: number;
  guideUntil: number;
  /** H4 ya da S3 ile Rehber'in gösterdiği plan adımları. */
  guided: number[];
  hintLevel: 0 | 1 | 2 | 3 | 4;
  hintAt: number;
  hintText: L10n | null;
  maxHint: number;
  usedH4: boolean;
  glow: boolean;
  feedback: Feedback | null;
  errors: ErrorClass[];
  wrongs: Partial<Record<FlowStepId, number>>;
  stepTimes: Partial<Record<FlowStepId, number>>;
  stepStart: number;
  // adım sonuçları
  known: Record<string, 'useful' | 'notNeeded'>;
  schemaChosen: Record<number, SchemaId>;
  models: Record<number, ModelResult>;
  modelFails: number;
  modelFailStreak: number;
  modelFirstTry: boolean;
  estimate: { kind: 'dir'; bigger: boolean } | { kind: 'line'; value: number } | null;
  equations: Record<number, EqToken[]>;
  linkResults: Record<number, number>;
  computeWrong: number;
  finalAnswer: number | null;
  reflect: MainStep | null;
  /** Canlandırmada gözlenen stratejiler (öğretmen paneli; DESIGN §12.1 ilke 10). */
  actStrategies: ActStrategy[];
  /** S1/S0'da "Nesnelerle dene" açıldı mı? (puanlanmaz) */
  actUsed: boolean;
  /** Canlandırması tamamlanan halkalar (model adımı etiketleri hazır başlar). */
  actDone: Record<number, boolean>;
  done: boolean;
}

export type SolveAction =
  | { type: 'next' }
  | { type: 'goto'; idx: number }
  | { type: 'hint'; text: L10n }
  | { type: 'wrong'; step: FlowStepId; error?: ErrorClass }
  | { type: 'glow'; on: boolean }
  | { type: 'feedback'; tone: Feedback['tone']; text: L10n }
  | { type: 'clearFeedback' }
  | { type: 'known'; bins: Record<string, 'useful' | 'notNeeded'> }
  | { type: 'schema'; link: number; schema: SchemaId }
  | { type: 'modelFail' }
  | { type: 'model'; link: number; result: ModelResult }
  | { type: 'estimate'; value: SolveState['estimate'] }
  | { type: 'equation'; link: number; tokens: EqToken[] }
  | { type: 'compute'; link: number; value: number }
  | { type: 'computeWrong' }
  | { type: 'answer'; value: number }
  | { type: 'reflect'; step: MainStep }
  | { type: 'act'; link: number; strategies: ActStrategy[] }
  | { type: 'actUsed' };

export function initSolve(problem: Problem, level: ScaffoldLevel, examples: number, withReflect: boolean): SolveState {
  const plan = buildPlan(problem, level, withReflect);
  return {
    problem,
    level,
    plan,
    idx: 0,
    guideUntil: guideUntilFor(plan, level, examples),
    guided: [],
    hintLevel: 0,
    hintAt: 0,
    hintText: null,
    maxHint: 0,
    usedH4: false,
    glow: false,
    feedback: null,
    errors: [],
    wrongs: {},
    stepTimes: {},
    stepStart: Date.now(),
    known: {},
    schemaChosen: {},
    models: {},
    modelFails: 0,
    modelFailStreak: 0,
    modelFirstTry: true,
    estimate: null,
    equations: {},
    linkResults: {},
    computeWrong: 0,
    finalAnswer: null,
    reflect: null,
    actStrategies: [],
    actUsed: false,
    actDone: {},
    done: false,
  };
}

function moveTo(s: SolveState, idx: number): SolveState {
  const cur = s.plan[s.idx];
  const spent = Date.now() - s.stepStart;
  const stepTimes = cur ? { ...s.stepTimes, [cur.id]: (s.stepTimes[cur.id] ?? 0) + spent } : s.stepTimes;
  if (idx >= s.plan.length) {
    return { ...s, stepTimes, done: true, feedback: null, hintText: null, hintLevel: 0, glow: false };
  }
  return {
    ...s,
    idx,
    stepTimes,
    stepStart: Date.now(),
    hintLevel: 0,
    hintText: null,
    glow: false,
    feedback: null,
  };
}

export function isGuided(s: SolveState, idx = s.idx): boolean {
  return idx < s.guideUntil || s.guided.includes(idx);
}

export function solveReducer(s: SolveState, a: SolveAction): SolveState {
  switch (a.type) {
    case 'next':
      return moveTo(s, s.idx + 1);
    case 'goto':
      return moveTo(s, Math.max(0, Math.min(a.idx, s.plan.length - 1)));
    case 'hint': {
      const lvl = Math.min(4, s.hintLevel + 1) as SolveState['hintLevel'];
      const guided = lvl === 4 && !s.guided.includes(s.idx) ? [...s.guided, s.idx] : s.guided;
      return {
        ...s,
        hintLevel: lvl,
        hintAt: Date.now(),
        hintText: a.text,
        maxHint: Math.max(s.maxHint, lvl),
        usedH4: s.usedH4 || lvl === 4,
        guided,
        glow: false,
      };
    }
    case 'wrong': {
      const n = (s.wrongs[a.step] ?? 0) + 1;
      return {
        ...s,
        wrongs: { ...s.wrongs, [a.step]: n },
        errors: a.error ? [...s.errors, a.error] : s.errors,
        glow: n === 1 ? true : s.glow,
      };
    }
    case 'glow':
      return { ...s, glow: a.on };
    case 'feedback':
      return { ...s, feedback: { tone: a.tone, text: a.text, n: (s.feedback?.n ?? 0) + 1 } };
    case 'clearFeedback':
      return { ...s, feedback: null };
    case 'known':
      return { ...s, known: a.bins };
    case 'schema':
      return { ...s, schemaChosen: { ...s.schemaChosen, [a.link]: a.schema } };
    case 'modelFail':
      return { ...s, modelFails: s.modelFails + 1, modelFailStreak: s.modelFailStreak + 1, modelFirstTry: false };
    case 'model':
      return { ...s, models: { ...s.models, [a.link]: a.result } };
    case 'estimate':
      return { ...s, estimate: a.value };
    case 'equation':
      return { ...s, equations: { ...s.equations, [a.link]: a.tokens } };
    case 'compute':
      return { ...s, linkResults: { ...s.linkResults, [a.link]: a.value } };
    case 'computeWrong':
      return { ...s, computeWrong: s.computeWrong + 1 };
    case 'answer':
      return { ...s, finalAnswer: a.value };
    case 'reflect':
      return { ...s, reflect: a.step };
    case 'act':
      return {
        ...s,
        actDone: { ...s.actDone, [a.link]: true },
        actStrategies: Array.from(new Set([...s.actStrategies, ...a.strategies])),
      };
    case 'actUsed':
      return { ...s, actUsed: true };
    default:
      return s;
  }
}
