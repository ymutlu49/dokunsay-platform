/**
 * Problem üreteci — saf ve tohumlu. `generateProblem(spec)` aynı spec + tohum → aynı problem.
 * Verilmeyen şema/alt tür/bilinmeyen/eksenler sınıfa ve müfredat sınırına göre seçilir;
 * sınıfa uymayan istek en yakın izinli seçeneğe çekilir (ör. 1. sınıfta kat → başka şema).
 */
import type { Axes, Diff, ExtraQuantity, Grade, L10n, Lang, Problem, ProblemSpec, Quantity, Role, SchemaId, SchemaStep, SchemaVariant, Sentence } from './types';
import { LANGS, SCHEMA_ROLES } from './types';
import { mulberry32, deriveSeed, freshSeed, hashStr } from './rng';
import type { Rng } from './rng';
import { familyOf, isInconsistent, referentOf, uOf, unknownForU } from './relations';
import { additiveTriple, defaultN, maxNForGrade, mulTriple, timesTriple, nOfValues, hasCarry } from './numbers';
import type { NLevel } from './numbers';
import { FRAMES, CHAIN_FRAMES, TABLE_FRAMES, makeExtras } from './frames';
import type { Frame, RemInterp } from './frames';
import { pickPeople, NOUNS } from './lexicon';
import type { Noun, NounKey, Person } from './lexicon';
import { ROLE_LABEL } from './meta';
import { GRADE_RULES, combosFor, curriculumCodes, isAllowed, validateProblem } from './curriculum';
import type { Combo } from './curriculum';
import { storyText } from './text';


const L = (tr: string, ku: string, en: string): L10n => ({ tr, ku, en });

interface Resolved { combo: Combo; axes: Axes; remainder?: RemInterp }

function resolve(spec: ProblemSpec, rng: Rng): Resolved {
  const grade = spec.grade;
  const rule = GRADE_RULES[grade];
  const a = spec.axes ?? {};
  let pool = combosFor(grade);
  if (spec.schema && pool.some((c) => c.schema === spec.schema)) pool = pool.filter((c) => c.schema === spec.schema);
  if (spec.variant && pool.some((c) => c.variant === spec.variant)) pool = pool.filter((c) => c.variant === spec.variant);
  if (spec.unknown && pool.some((c) => c.unknown === spec.unknown)) pool = pool.filter((c) => c.unknown === spec.unknown);
  // Dil ekseni: L=1 → yalnız tutarsız kurulabilen (referans bilinmeyen) birleşimler.
  const incons = (c: Combo) => (c.schema === 'compare' || c.schema === 'multCompare') && c.variant !== 'equalize' && c.unknown === referentOf(c.schema, c.variant);
  if (a.L === 1 && pool.some(incons)) pool = pool.filter(incons);
  else if (a.L === 0) pool = pool.filter((c) => !incons(c)).length ? pool.filter((c) => !incons(c)) : pool;
  if (a.U !== undefined && a.L === undefined) {
    const byU = pool.filter((c) => uOf(c.schema, c.variant, c.unknown) === a.U || unknownForU(c.schema, c.variant, a.U!) === c.unknown);
    if (byU.length) pool = byU;
  }
  // Önce yapı, sonra sayı: şema belirtilmemişse şemaya eşit ağırlık.
  const schemas = [...new Set(pool.map((c) => c.schema))];
  const sch = rng.pick(schemas);
  const combo = rng.pick(pool.filter((c) => c.schema === sch));
  let N = (a.N ?? defaultN(rng, grade)) as NLevel;
  N = Math.min(N, maxNForGrade(grade)) as NLevel;
  if (grade === 1 && (combo.schema === 'compare' || combo.unknown === 'start')) N = 0;
  const M = grade === 1 ? 1 : (a.M ?? 1);
  const P = rule.table ? (a.P ?? 0) : 0;
  const I = Math.min(a.I ?? 0, rule.irrelevantMax) as 0 | 1 | 2;
  const U = uOf(combo.schema, combo.variant, combo.unknown);
  const axes: Axes = { U, L: 0, N, I, M: M as 1 | 2 | 3, P: P as 0 | 1 };
  let remainder: RemInterp | undefined;
  const div = combo.schema === 'equalGroups' && combo.variant !== 'multiply';
  if (div && rule.remainder && M === 1 && P === 0 && rng.chance(0.35)) {
    remainder = combo.variant === 'partitive' ? rng.pick(['roundDown', 'remainderIsAnswer'] as const) : rng.pick(['roundUp', 'roundDown', 'remainderIsAnswer'] as const);
  }
  return { combo, axes, remainder };
}

function frameFits(f: Frame, grade: Grade, c: Combo, rem?: RemInterp): boolean {
  if (f.schema !== c.schema || !f.variants.includes(c.variant) || f.minGrade > grade) return false;
  if (f.unknowns && !f.unknowns.includes(c.unknown)) return false;
  if (rem && !(f.remainders ?? []).includes(rem)) return false;
  if (!rem && f.remainderOnly) return false;
  return true;
}

function roleUnit(role: Role, schema: SchemaId, obj: Noun, cont: Noun, frameId: string): L10n {
  if (schema === 'multCompare' && role === 'factor') return L('kat', 'car', 'times');
  if (schema === 'equalGroups' && role === 'groups') return frameId === 'groups.price' ? { tr: obj.tr.w, ku: obj.ku.w, en: obj.en.sg } : { tr: cont.tr.w, ku: cont.ku.w, en: cont.en.sg };
  if (frameId === 'groups.price' && role !== 'groups') return { tr: 'TL', ku: 'lîre', en: 'lira' };
  return { tr: obj.tr.w, ku: obj.ku.w, en: obj.en.sg };
}

function mkStep(schema: SchemaId, variant: SchemaVariant, unknown: Role, vals: Record<string, number>, unit: (r: Role) => L10n): SchemaStep {
  const quantities: Quantity[] = SCHEMA_ROLES[schema].map((role) => ({ role, value: vals[role], label: { ...ROLE_LABEL[role] }, unit: unit(role) }));
  const st: SchemaStep = { schema, variant, unknown, quantities };
  const ref = referentOf(schema, variant);
  if (ref) st.referent = ref;
  return st;
}

function applyLabels(st: SchemaStep, labels?: Partial<Record<Role, L10n>>) {
  if (!labels) return;
  for (const q of st.quantities) if (labels[q.role]) q.label = labels[q.role]!;
}

function insertExtras(text: Record<Lang, Sentence[]>, ex: ReturnType<typeof makeExtras>, rng: Rng) {
  if (!ex.length) return;
  const n = text.tr.length;
  const pos = ex.map(() => rng.int(1, Math.max(1, n - 1)));
  for (const lang of LANGS) {
    const arr = text[lang];
    const qIdx = arr.length - 1;
    ex.forEach((x, i) => arr.splice(Math.min(pos[i], qIdx), 0, x.text[lang]));
  }
}

function diffOf(axes: Axes, schema: SchemaId, rem: boolean): Diff {
  const base: Record<SchemaId, number> = { change: 1, combine: 1, compare: 2, equalGroups: 2, multCompare: 3 };
  const d = base[schema] + axes.U * 0.75 + axes.L + (axes.I > 0 ? 1 : 0) + (axes.M > 1 ? 1 : 0) + axes.P + (rem ? 1 : 0);
  return Math.max(1, Math.min(5, Math.round(d))) as Diff;
}

function targetsOf(p: Problem): string[] {
  const t = new Set<string>();
  const s = p.steps[p.steps.length - 1];
  if (isInconsistent(s)) t.add('keywordReversal');
  if (s.schema === 'change' && s.unknown === 'start') t.add('textOrder');
  if (s.schema === 'combine' && s.unknown !== 'whole') t.add('partWhole');
  if (s.schema === 'compare' && s.unknown === 'difference') t.add('addAllNumbers');
  if (s.schema === 'multCompare') t.add('moreVsTimes');
  if (s.remainder) t.add('ignoreRemainder');
  if (p.axes.I > 0) { t.add('irrelevantInfo'); t.add('addAllNumbers'); }
  if (p.axes.M > 1) t.add('skipStep');
  if (p.axes.U > 0) t.add('equalsAsAnswer');
  if (['tl', 'dakika', 'metre', 'litre'].some((k) => NOUNS[k as NounKey].tr.w === p.answerUnit.tr)) t.add('unitOmission');
  return [...t];
}

type Draft = Omit<Problem, 'id' | 'seed'>;

function finalize(d: Omit<Draft, 'diff' | 'targets' | 'curriculum'>, rem: boolean): Draft {
  const last = d.steps[d.steps.length - 1];
  const draft: Draft = { ...d, diff: 1, targets: [], curriculum: curriculumCodes(d.grade, last.schema, last.variant, last.unknown, rem) };
  draft.axes.L = isInconsistent(last) ? 1 : 0;
  draft.diff = diffOf(draft.axes, last.schema, rem);
  draft.targets = targetsOf(draft as Problem);
  return draft;
}

function capFor(grade: Grade, N: NLevel): number {
  const byN = [10, 20, 100, 100, 1000, 9999][N];
  return Math.min(byN, GRADE_RULES[grade].maxNumber);
}

function buildSingle(spec: ProblemSpec, rng: Rng, r: Resolved, people: Person[]): Draft | null {
  const { combo, axes } = r;
  const grade = spec.grade;
  const frames = FRAMES.filter((f) => frameFits(f, grade, combo, r.remainder) && (!spec.context || f.context === spec.context));
  const pool = frames.length ? frames : FRAMES.filter((f) => frameFits(f, grade, combo, r.remainder));
  if (!pool.length) return null;
  const frame = rng.pick(pool);
  const obj = NOUNS[rng.pick(frame.objs)];
  const cont = NOUNS[rng.pick(frame.conts ?? (['kutu'] as NounKey[]))];
  const fam = familyOf(combo.schema, combo.variant);
  const vals: Record<string, number> = {};
  let remainder: SchemaStep['remainder'];
  let answer: number;
  if (fam.kind === 'add') {
    const step5 = frame.unitKind === 'money' || frame.unitKind === 'time';
    const [p1, p2, w] = additiveTriple(rng, grade, axes.N as NLevel, { step5, maxWhole: frame.maxWhole });
    vals[fam.parts[0]] = p1; vals[fam.parts[1]] = p2; vals[fam.whole] = w;
    answer = vals[combo.unknown];
  } else if (combo.schema === 'equalGroups') {
    const m = mulTriple(rng, grade, combo.variant as 'multiply' | 'partitive' | 'quotative', {
      remainder: !!r.remainder, bigN: axes.N >= 4 || (grade >= 4 && rng.chance(0.3)), minRemainder: r.remainder === 'remainderIsAnswer' ? 2 : 1,
    });
    Object.assign(vals, { groups: m.groups, perGroup: m.perGroup, total: m.total });
    if (frame.maxWhole && m.total > frame.maxWhole) return null;
    answer = vals[combo.unknown];
    if (r.remainder && m.remainder) {
      remainder = { value: m.remainder, interpret: r.remainder };
      answer = r.remainder === 'roundUp' ? answer + 1 : r.remainder === 'remainderIsAnswer' ? m.remainder : answer;
    }
  } else {
    Object.assign(vals, timesTriple(rng, grade, combo.variant as 'times' | 'fraction'));
    answer = vals[combo.unknown];
  }
  const step = mkStep(combo.schema, combo.variant, combo.unknown, vals, (ro) => roleUnit(ro, combo.schema, obj, cont, frame.id));
  if (remainder) step.remainder = remainder;
  const [A, B, C] = people;
  const out = frame.render({ step, si: 0, A, B, C, grade, rng, obj, cont });
  applyLabels(step, out.labels);
  const taken = [...Object.values(vals), answer];
  const ex = makeExtras(rng, axes.I, frame.id, C, obj, taken);
  insertExtras(out.text, ex, rng);
  const extras: ExtraQuantity[] = ex.map((x) => ({ id: x.id, value: x.value, unit: x.unit, label: x.label }));
  if (fam.kind === 'add') axes.N = Math.max(axes.N, nOfValues(Object.values(vals), hasCarry(vals[fam.parts[0]], vals[fam.parts[1]]))) as NLevel;
  else axes.N = nOfValues(Object.values(vals));
  return finalize({
    grade, axes, steps: [step], text: out.text, extras, answer, answerSentence: out.answer, answerUnit: out.unit,
    context: frame.context, people: [A.tr, B.tr, ...(ex.length ? [C.tr] : [])], diff: 1,
  } as Omit<Draft, 'diff' | 'targets' | 'curriculum'>, !!remainder);
}

function buildChain(spec: ProblemSpec, rng: Rng, r: Resolved, people: Person[]): Draft | null {
  const grade = spec.grade;
  const M = r.axes.M as 2 | 3;
  let pool = CHAIN_FRAMES.filter((f) => f.M === M && f.minGrade <= grade);
  if (spec.schema && pool.some((f) => f.schemas.includes(spec.schema!))) pool = pool.filter((f) => f.schemas.includes(spec.schema!));
  if (!pool.length) return null;
  const f = rng.pick(pool);
  const cap = Math.max(20, capFor(grade, r.axes.N as NLevel));
  const nums = f.numbers(rng, cap);
  if (!nums) return null;
  const obj = NOUNS[rng.pick(f.objs)];
  const [A, B, C] = people;
  const u = (): L10n => ({ tr: obj.tr.w, ku: obj.ku.w, en: obj.en.sg });
  const s0 = mkStep(f.schemas[0], f.variants[0], f.unknowns[0], nums[0], u);
  const s1 = mkStep(f.schemas[1], f.variants[1], f.unknowns[1], nums[1], u);
  s1.links = f.links;
  const out = f.render({ vals: nums, A, B, C, obj, rng, grade });
  const axes: Axes = { ...r.axes, U: 0, M, P: 0 };
  const ex = makeExtras(rng, r.axes.I, f.id, C, obj, [...Object.values(nums[0]), ...Object.values(nums[1])]);
  insertExtras(out.text, ex, rng);
  axes.N = nOfValues([...Object.values(nums[0]), ...Object.values(nums[1])]);
  return finalize({
    grade, axes, steps: [s0, s1], text: out.text, extras: ex.map((x) => ({ id: x.id, value: x.value, unit: x.unit, label: x.label })),
    answer: nums[1][f.unknowns[1]], answerSentence: out.answer, answerUnit: out.unit, context: f.context,
    people: f.id === 'chain.compare' ? [A.tr, B.tr, C.tr] : [A.tr, B.tr], diff: 1,
  } as Omit<Draft, 'diff' | 'targets' | 'curriculum'>, false);
}

function buildTable(spec: ProblemSpec, rng: Rng, r: Resolved, people: Person[]): Draft | null {
  const grade = spec.grade;
  let pool = TABLE_FRAMES.filter((t) => isAllowed(grade, { schema: t.schema, variant: t.variant, unknown: t.unknown }));
  if (spec.schema) pool = pool.filter((t) => t.schema === spec.schema);
  if (!pool.length) return null;
  const t = rng.pick(pool);
  const cap = Math.max(20, capFor(grade, r.axes.N as NLevel));
  const b = t.build(rng, cap, people[0], grade);
  if (!b) return null;
  const tl = NOUNS.tl;
  const step = mkStep(t.schema, t.variant, t.unknown, b.vals, (ro) => (t.schema === 'equalGroups' && ro === 'groups' ? L('adet', 'heb', 'item') : { tr: tl.tr.w, ku: tl.ku.w, en: tl.en.sg }));
  applyLabels(step, b.out.labels);
  const axes: Axes = { ...r.axes, U: uOf(t.schema, t.variant, t.unknown), P: 1, M: 1, I: r.axes.I };
  axes.N = nOfValues(Object.values(b.vals));
  return finalize({
    grade, axes, steps: [step], text: b.out.text, extras: b.extras.map((x) => ({ id: x.id, value: x.value, unit: { tr: 'TL', ku: 'lîre', en: 'lira' }, label: x.label })),
    answer: b.vals[t.unknown], answerSentence: b.out.answer, answerUnit: b.out.unit, context: 'market', people: [people[0].tr], table: b.table, diff: 1,
  } as Omit<Draft, 'diff' | 'targets' | 'curriculum'>, false);
}

function specKey(spec: ProblemSpec): string {
  return JSON.stringify([spec.grade, spec.schema ?? '', spec.variant ?? '', spec.unknown ?? '', spec.context ?? '', spec.axes ?? {}]);
}

function buildWithSeed(spec: ProblemSpec, seed: number): Problem {
  let fallback: Draft | null = null;
  for (let attempt = 0; attempt < 80; attempt++) {
    const rng = mulberry32(attempt === 0 ? seed : deriveSeed(seed, attempt));
    const r = resolve(spec, rng);
    const people = pickPeople(rng, 3);
    let d: Draft | null = null;
    if (r.axes.M > 1) d = buildChain(spec, rng, r, people);
    else if (r.axes.P === 1) d = buildTable(spec, rng, r, people) ?? (attempt > 40 ? buildSingle(spec, rng, { ...r, axes: { ...r.axes, P: 0 } }, people) : null);
    else d = buildSingle(spec, rng, r, people);
    if (!d) continue;
    const p = { ...d, id: '', seed } as Problem;
    if (validateProblem(p).length === 0) { fallback = d; break; }
    if (!fallback) fallback = d;
  }
  if (!fallback) throw new Error('Problem üretilemedi');
  return { ...fallback, id: `p${hashStr(`${specKey(spec)}:${seed}`).toString(36)}`, seed } as Problem;
}

/** Tek problem üret (saf, tohumlu). */
export function generateProblem(spec: ProblemSpec): Problem {
  const base = (spec.seed ?? freshSeed()) >>> 0;
  const exclude = new Set(spec.exclude ?? []);
  let p = buildWithSeed(spec, base);
  for (let k = 1; exclude.has(p.id) && k < 50; k++) p = buildWithSeed(spec, deriveSeed(base, `x${k}`));
  return p;
}

export interface SetOptions { grade: Grade; schemas?: SchemaId[]; count: number; mixed?: boolean; axes?: Partial<Axes>; seed?: number }

/** Tekrarsız problem seti: `mixed` yoksa şema blokları, varsa karışık (aynı şema üst üste en çok 2). */
export function generateSet(opts: SetOptions): Problem[] {
  const seed = (opts.seed ?? freshSeed()) >>> 0;
  const rng = mulberry32(deriveSeed(seed, 'set'));
  const allowed = [...new Set(combosFor(opts.grade).map((c) => c.schema))];
  const schemas = (opts.schemas?.filter((s) => allowed.includes(s)) ?? []).length ? opts.schemas!.filter((s) => allowed.includes(s)) : opts.mixed ? allowed : [rng.pick(allowed)];
  const plan: SchemaId[] = [];
  if (!opts.mixed) {
    const per = Math.ceil(opts.count / schemas.length);
    for (const s of schemas) for (let i = 0; i < per && plan.length < opts.count; i++) plan.push(s);
  } else {
    while (plan.length < opts.count) {
      const cand = schemas.filter((s) => !(plan.length >= 2 && plan[plan.length - 1] === s && plan[plan.length - 2] === s));
      plan.push(rng.pick(cand.length ? cand : schemas));
    }
  }
  const out: Problem[] = [];
  const seen = new Set<string>();
  plan.forEach((schema, i) => {
    for (let k = 0; k < 40; k++) {
      const p = generateProblem({ grade: opts.grade, schema, axes: opts.axes, seed: deriveSeed(seed, `${i}:${k}`) });
      const sig = storyText(p.text.tr);
      if (seen.has(sig) || seen.has(p.id)) continue;
      seen.add(sig); seen.add(p.id);
      out.push(p);
      return;
    }
  });
  return out;
}


