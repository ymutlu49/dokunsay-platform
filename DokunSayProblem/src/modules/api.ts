/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Modül içerik geçidi — `src/lib/content.ts` üzerinden (TÜM içerik importları oradan).
 * İçerik motoru paralel yazıldığı için modüle özgü yardımcılar (reasonableItemsFor,
 * remainderSetFor, wordTrapPairFor, erroneousSolutionFor, unsolvableFor, POSING_FRAMES…)
 * henüz olmayabilir ya da dönüş biçimi küçük farklar taşıyabilir. Burada:
 *  - her işlev `typeof fn === 'function'` ile KORUNUR (yoksa null → kart "Hazırlanıyor"),
 *  - dönüşler tek bir arayüz biçimine NORMALLEŞTİRİLİR (hata tek yerde düzeltilir).
 */
import * as C from '../lib/content';
import { makeProblem } from '../lib/contentAdapter';
import type { ErroneousSolution, ErrorClass, FlowStepId, Grade, L10n, Problem, SchemaId, SchemaStep } from '../content/types';
import { minGradeFor } from '../lib/share';
import { shuffleSeeded } from '../lib/problemUtil';

const API = C as unknown as Record<string, any>;
const EMPTY: L10n = { tr: '', ku: '', en: '' };

export function has(name: string): boolean {
  return typeof API[name] === 'function' || (API[name] != null && typeof API[name] === 'object');
}

export function asL10n(v: any): L10n {
  if (!v) return EMPTY;
  if (typeof v === 'string') return { tr: v, ku: v, en: v };
  return { tr: v.tr ?? '', ku: v.ku ?? v.tr ?? '', en: v.en ?? v.tr ?? '' };
}

function isProblem(p: any): p is Problem {
  return !!p && Array.isArray(p.steps) && p.steps.length > 0 && p.text && typeof p.text === 'object';
}

function call<T>(name: string, ...args: any[]): T | null {
  const fn = API[name];
  if (typeof fn !== 'function') return null;
  try {
    return (fn(...args) as T) ?? null;
  } catch (e) {
    console.warn(`[modules] ${name} hata`, e);
    return null;
  }
}

/** Sınıfa uygun şemalar (DESIGN §3). */
export function schemasFor(grade: Grade): SchemaId[] {
  return (['change', 'combine', 'compare', 'equalGroups', 'multCompare'] as SchemaId[]).filter((s) => minGradeFor(s) <= grade);
}

export function problemSet(grade: Grade, count: number, seed: number, opts: { schemas?: SchemaId[]; mixed?: boolean; axes?: Partial<Problem['axes']> } = {}): Problem[] {
  const schemas = opts.schemas?.length ? opts.schemas : schemasFor(grade);
  const r = call<any[]>('generateSet', { grade, schemas, count, mixed: opts.mixed ?? true, axes: opts.axes, seed });
  let list = Array.isArray(r) ? r.filter(isProblem) : [];
  if (list.length < count) {
    list = [];
    for (let i = 0; i < count; i++) {
      const p = makeProblem({ grade, schema: schemas[i % schemas.length], axes: opts.axes, seed: seed + i * 7 });
      if (p) list.push(p);
    }
    if (opts.mixed !== false) list = shuffleSeeded(list, seed);
  }
  return list.slice(0, count);
}

// ─── Makul mü? ─────────────────────────────────────────────────────────────
export interface ReasonItemUI {
  problem: Problem;
  shown: number;
  reasonable: boolean;
  reasons: { text: L10n; correct: boolean }[];
}

export function reasonableItems(grade: Grade, seed: number): ReasonItemUI[] | null {
  if (!has('reasonableItemsFor')) return null;
  const r = call<any>('reasonableItemsFor', grade, seed);
  const list: any[] = Array.isArray(r) ? r : r?.items ?? [];
  const out = list
    .map((it: any): ReasonItemUI | null => {
      const problem = it?.problem;
      if (!isProblem(problem)) return null;
      const shown = Number(it.shown ?? it.shownAnswer ?? it.answer ?? it.value);
      const reasonable = Boolean(it.reasonable ?? it.isReasonable ?? it.ok ?? it.plausible);
      const raw: any[] = it.reasons ?? it.why ?? it.options ?? [];
      const reasons = raw.map((o: any) => ({ text: asL10n(o.text ?? o.label ?? o), correct: Boolean(o.correct ?? o.ok) }));
      return Number.isFinite(shown) ? { problem, shown, reasonable, reasons } : null;
    })
    .filter((x): x is ReasonItemUI => !!x);
  return out.length ? out : null;
}

// ─── Kalan ─────────────────────────────────────────────────────────────────
export type Interpret = 'roundUp' | 'roundDown' | 'remainderIsAnswer' | 'exact';
export interface RemainderUI {
  fact: { a: number; b: number; q: number; r: number } | null;
  items: { problem: Problem; interpret: Interpret }[];
}

function interpretOf(p: Problem, raw?: any): Interpret {
  const v = String(raw ?? p.steps[p.steps.length - 1]?.remainder?.interpret ?? 'exact');
  if (v === 'roundUp' || v === 'roundDown' || v === 'remainderIsAnswer') return v;
  return 'exact';
}

export function remainderSet(seed: number): RemainderUI | null {
  if (!has('remainderSetFor')) return null;
  const r = call<any>('remainderSetFor', seed);
  const list: any[] = Array.isArray(r) ? r : r?.items ?? r?.contexts ?? r?.problems ?? [];
  const items = list
    .map((it: any) => {
      const problem = isProblem(it) ? it : it?.problem;
      if (!isProblem(problem)) return null;
      return { problem, interpret: interpretOf(problem, it?.interpret) };
    })
    .filter((x): x is { problem: Problem; interpret: Interpret } => !!x);
  if (!items.length) return null;
  let fact: RemainderUI['fact'] = null;
  const d = r?.division ?? r?.fact;
  if (d && Number.isFinite(d.total ?? d.a)) {
    const a = Number(d.total ?? d.a);
    const b = Number(d.divisor ?? d.b);
    fact = { a, b, q: Math.floor(a / b), r: a % b };
  } else {
    const st = items.find((i) => i.problem.steps[0]?.remainder)?.problem.steps[0];
    const total = st?.quantities.find((q) => q.role === 'total')?.value;
    const div = st ? st.quantities.find((q) => q.role !== 'total' && q.role !== st.unknown)?.value : undefined;
    if (total && div) fact = { a: total, b: div, q: Math.floor(total / div), r: total % div };
  }
  return { fact, items };
}

// ─── Sözcük tuzağı ─────────────────────────────────────────────────────────
export function wordTrapPair(grade: Grade, seed: number): { consistent: Problem; inconsistent: Problem } | null {
  const r = has('wordTrapPairFor') ? call<any>('wordTrapPairFor', grade, seed) : null;
  let pair: any[] = [];
  if (Array.isArray(r)) pair = r;
  else if (r) pair = r.pair ?? [r.consistent, r.inconsistent];
  pair = pair.filter(isProblem);
  if (pair.length < 2) {
    // Yedek: aynı tohumla tutarlı / tutarsız karşılaştırma (üreteç L eksenini destekliyorsa).
    const g = (grade < 2 ? 2 : grade) as Grade;
    const a = makeProblem({ grade: g, schema: 'compare', axes: { L: 0 }, seed });
    const b = makeProblem({ grade: g, schema: 'compare', axes: { L: 1 }, seed });
    pair = [a, b].filter(isProblem);
  }
  if (pair.length < 2) return null;
  const inc = pair.find((p) => p.axes?.L === 1);
  const con = pair.find((p) => p !== inc && p.axes?.L !== 1);
  if (!inc || !con) return null;
  return { consistent: con, inconsistent: inc };
}

// ─── Hata dedektifi ───────────────────────────────────────────────────────
export interface ErroneousUI {
  steps: { stepId: FlowStepId; shown: L10n; isError: boolean }[];
  misconception: string;
  why: { text: L10n; correct: boolean }[];
}

export function erroneousSolution(problem: Problem, seed: number): ErroneousUI | null {
  if (!has('erroneousSolutionFor')) return null;
  const r = call<ErroneousSolution | any>('erroneousSolutionFor', problem, seed);
  if (!r || !Array.isArray(r.steps) || !r.steps.some((s: any) => s.isError)) return null;
  return {
    steps: r.steps.map((s: any) => ({ stepId: s.stepId, shown: asL10n(s.shown), isError: Boolean(s.isError) })),
    misconception: String(r.misconception ?? ''),
    why: (r.why ?? []).map((w: any) => ({ text: asL10n(w.text), correct: Boolean(w.correct) })),
  };
}

// ─── Dedektif soruları ────────────────────────────────────────────────────
export function unsolvable(grade: Grade, seed: number): Problem | null {
  if (!has('unsolvableFor')) return null;
  const r = call<any>('unsolvableFor', grade, seed);
  const p = isProblem(r) ? r : r?.problem;
  return isProblem(p) && p.unsolvable ? p : null;
}

/**
 * Karışık sete çözülemez madde katar (yaklaşık 10'da 1 — DESIGN §7). App'in karışık seti
 * için dışa açıktır: `mixUnsolvable(set, grade, seed)`. İçerik yoksa seti aynen döndürür.
 */
export function mixUnsolvable(set: Problem[], grade: Grade, seed: number): Problem[] {
  if (!has('unsolvableFor') || set.length < 5) return set;
  const out = [...set];
  const k = Math.max(1, Math.round(set.length / 10));
  for (let i = 0; i < k; i++) {
    const u = unsolvable(grade, seed + 101 * (i + 1));
    if (u) out.splice(2 + ((seed + i * 3) % Math.max(1, out.length - 2)), 0, u);
  }
  return out;
}

// ─── Yanılgılar (öğretmen paneli de kullanır) ─────────────────────────────
export function misconceptionNote(id: string): L10n | null {
  const M = API.MISCONCEPTIONS;
  if (!M) return null;
  const list: any[] = Array.isArray(M) ? M : Object.values(M);
  const hit = list.find((m: any) => m?.id === id || m?.errorClass === id || m?.error === id || (Array.isArray(m?.errors) && m.errors.includes(id)));
  if (!hit) return null;
  const n = hit.teacherNote ?? hit.note ?? hit.name ?? (hit.tr ? { tr: hit.tr, ku: hit.ku, en: hit.en } : null);
  return n ? asL10n(n) : null;
}

export function isErrorClass(v: unknown): v is ErrorClass {
  return (
    typeof v === 'string' &&
    ['schemaId', 'modelPlacement', 'unknownPlacement', 'irrelevantUsed', 'reversal', 'textOrderOp', 'operation', 'computation', 'unitOrRemainder', 'unsolvableMissed'].includes(v)
  );
}

/** Bilinmeyeni bulan işlem (modelden; anahtar sözcükten DEĞİL). */
export function solveOp(step: SchemaStep): '+' | '−' | '×' | '÷' {
  const u = step.unknown;
  switch (step.schema) {
    case 'change':
      if (step.variant === 'separate') return u === 'start' ? '+' : '−';
      return u === 'result' ? '+' : '−';
    case 'combine':
      return u === 'whole' ? '+' : '−';
    case 'compare':
      return u === 'larger' ? '+' : '−';
    case 'equalGroups':
      return u === 'total' ? '×' : '÷';
    case 'multCompare':
      if (step.variant === 'fraction') return u === 'compared' ? '÷' : '×';
      return u === 'compared' ? '×' : '÷';
  }
}
