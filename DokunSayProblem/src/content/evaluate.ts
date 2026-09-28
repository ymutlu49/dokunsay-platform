/**
 * Değerlendirme (saf): şema, model, denklem, cevap. Ayrık puanlama (DESIGN §9): hesap hatası
 * yapı puanını düşürmez; her denetim kendi `ErrorClass`'ını döndürür.
 */
import type { ErrorClass, ExtraQuantity, Problem, Role, SchemaId, SchemaStep } from './types';
import { SCHEMA_ROLES } from './types';
import type { Tok } from './relations';
import { MINUS, applyOp, equationAlternatives, evalEquation, isInconsistent, keywordOp, templateTokens, val, divisorOf } from './relations';

export type EqToken = number | '?' | '+' | '−' | '×' | '÷' | '=';

/** Şablon denklem + aynı modele uyan eşdeğer denklemler (eksi U+2212). */
export function equationOf(step: SchemaStep): { tokens: EqToken[]; alternatives: EqToken[][] } {
  return { tokens: templateTokens(step) as EqToken[], alternatives: equationAlternatives(step) as EqToken[][] };
}

export function checkSchema(step: SchemaStep, chosen: SchemaId): boolean {
  return step.schema === chosen;
}

type Mark = 'ok' | 'wrong' | 'missing';

/** Model denetimi: parça bazında (Ng & Lee 2009). Parça-bütünde iki parça yer değiştirebilir. */
export function checkModel(
  step: SchemaStep,
  placements: Partial<Record<Role, number | '?'>>,
  extras: ExtraQuantity[],
): { ok: boolean; perRole: Partial<Record<Role, Mark>>; error?: ErrorClass } {
  const roles = SCHEMA_ROLES[step.schema];
  const expected = (r: Role): number | '?' => (r === step.unknown ? '?' : val(step, r));
  const perRole: Partial<Record<Role, Mark>> = {};
  for (const r of roles) {
    const p = placements[r];
    perRole[r] = p === undefined ? 'missing' : p === expected(r) ? 'ok' : 'wrong';
  }
  if (step.schema === 'combine' && perRole.part1 === 'wrong' && perRole.part2 === 'wrong') {
    if (placements.part1 === expected('part2') && placements.part2 === expected('part1')) { perRole.part1 = 'ok'; perRole.part2 = 'ok'; }
  }
  const wrong = roles.filter((r) => perRole[r] === 'wrong');
  const ok = roles.every((r) => perRole[r] === 'ok');
  let error: ErrorClass | undefined;
  if (wrong.length) {
    const exVals = extras.map((e) => e.value);
    if (wrong.some((r) => typeof placements[r] === 'number' && exVals.includes(placements[r] as number) && !step.quantities.some((q) => q.value === placements[r]))) error = 'irrelevantUsed';
    else if (wrong.some((r) => placements[r] === '?')) error = 'unknownPlacement';
    else if (placements[step.unknown] !== undefined && placements[step.unknown] !== '?') error = 'unknownPlacement';
    else error = 'modelPlacement';
  }
  return { ok, perRole, error };
}

const norm = (toks: EqToken[]): string => toks.map((t) => String(t).replace('-', MINUS)).join(' ');

/** Denklem denetimi: alternatiflerden biriyle eşleşme; hata sınıflaması. */
export function checkEquation(step: SchemaStep, tokens: EqToken[]): { ok: boolean; error?: ErrorClass } {
  const alts = equationAlternatives(step);
  const k = norm(tokens);
  if (alts.some((a) => norm(a as EqToken[]) === k)) return { ok: true };
  // "?" yerine cevabı yazmışsa: cevabı "?" ile değiştirip yeniden dene.
  if (!tokens.includes('?')) {
    const ans = val(step, step.unknown);
    const idx = tokens.lastIndexOf(ans);
    if (idx >= 0) {
      const t2 = tokens.slice(); t2[idx] = '?';
      if (alts.some((a) => norm(a as EqToken[]) === norm(t2))) return { ok: true };
    }
  }
  const known = step.quantities.filter((q) => q.role !== step.unknown).map((q) => q.value);
  const nums = tokens.filter((t): t is number => typeof t === 'number');
  if (nums.some((n) => !known.includes(n) && n !== val(step, step.unknown))) return { ok: false, error: 'irrelevantUsed' };
  const op = tokens.find((t) => t === '+' || t === '−' || t === '×' || t === '÷');
  const onlyKnowns = nums.length === 2 && nums.every((n) => known.includes(n)) && tokens.includes('?');
  if (isInconsistent(step) && onlyKnowns && op === keywordOp(step)) return { ok: false, error: 'reversal' };
  if (step.schema === 'change' && step.unknown === 'start' && onlyKnowns) {
    const varOp = step.variant === 'join' ? '+' : MINUS;
    const qAtEnd = tokens[tokens.length - 1] === '?' || tokens[0] === '?';
    if (op === varOp && qAtEnd && !evalEquation(tokens as Tok[], val(step, 'start'))) return { ok: false, error: 'textOrderOp' };
  }
  return { ok: false, error: 'operation' };
}

/** Bilinen yanlış cevap örüntülerinden hata sınıfı. */
export function classifyWrongAnswer(problem: Problem, value: number): ErrorClass {
  if (problem.unsolvable) return 'unsolvableMissed';
  const s = problem.steps[problem.steps.length - 1];
  if (s.remainder) {
    const q = val(s, s.unknown), r = s.remainder.value;
    const cands = s.remainder.interpret === 'roundUp' ? [q, r] : s.remainder.interpret === 'roundDown' ? [q + 1, r] : [q, q + 1];
    if (cands.includes(value)) return 'unitOrRemainder';
    const d = divisorOf(s), T = val(s, 'total');
    if (Math.abs(value - T / d) < 1e-9) return 'unitOrRemainder';
  }
  const known = s.quantities.filter((q) => q.role !== s.unknown).map((q) => q.value);
  const extras = problem.extras.map((e) => e.value);
  for (const e of extras) {
    if (value === problem.answer + e || value === problem.answer - e) return 'irrelevantUsed';
    if (known.some((k) => value === k + e || value === Math.abs(k - e))) return 'irrelevantUsed';
  }
  if (extras.length && value === [...known, ...extras].reduce((a, b) => a + b, 0)) return 'irrelevantUsed';
  if (known.length === 2) {
    const [a, b] = known;
    const kop = keywordOp(s);
    if (isInconsistent(s) && kop) {
      const trap = kop === '÷' || kop === MINUS ? applyOp(Math.max(a, b), kop, Math.min(a, b)) : applyOp(a, kop, b);
      if (value === trap) return 'reversal';
    }
    if (s.schema === 'change' && s.unknown === 'start') {
      const res = val(s, 'result'), ch = val(s, 'change');
      if (value === (s.variant === 'join' ? res + ch : Math.abs(res - ch))) return 'textOrderOp';
    }
    const ops = [a + b, Math.abs(a - b), a * b, Math.max(a, b) / Math.min(a, b)];
    if (ops.includes(value)) return 'operation';
  }
  return 'computation';
}

/** Cevap denetimi (kalanlı bölmede yorumlanmış cevap beklenir). */
export function checkAnswer(problem: Problem, value: number): { ok: boolean; error?: ErrorClass } {
  if (problem.unsolvable) return { ok: false, error: 'unsolvableMissed' };
  if (value === problem.answer) return { ok: true };
  return { ok: false, error: classifyWrongAnswer(problem, value) };
}

