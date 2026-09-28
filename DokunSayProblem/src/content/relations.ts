/**
 * Şema bağıntıları: parça-bütün ailesi, bağıntı denetimi, şablon denklem ve eşdeğerleri.
 * Tüm toplamsal şemalar parça-bütün modeline indirgenir (Xin 2019); çarpımsallar çarpan-çarpım.
 */
import type { Role, SchemaId, SchemaStep, SchemaVariant } from './types';

export type Op = '+' | '−' | '×' | '÷';
export type Tok = number | '?' | Op | '=';
export const MINUS = '−';

export interface Family {
  kind: 'add' | 'mul';
  /** İki parça (toplamsal) ya da iki çarpan (çarpımsal). */
  parts: [Role, Role];
  /** Bütün (toplamsal) ya da çarpım. */
  whole: Role;
}

export const isMultiplicativeSchema = (s: SchemaId): boolean => s === 'equalGroups' || s === 'multCompare';

export function familyOf(schema: SchemaId, variant: SchemaVariant): Family {
  switch (schema) {
    case 'change':
      return variant === 'separate'
        ? { kind: 'add', parts: ['result', 'change'], whole: 'start' }
        : { kind: 'add', parts: ['start', 'change'], whole: 'result' };
    case 'combine':
      return { kind: 'add', parts: ['part1', 'part2'], whole: 'whole' };
    case 'compare':
      return { kind: 'add', parts: ['smaller', 'difference'], whole: 'larger' };
    case 'equalGroups':
      return { kind: 'mul', parts: ['groups', 'perGroup'], whole: 'total' };
    case 'multCompare':
      return variant === 'fraction'
        ? { kind: 'mul', parts: ['factor', 'compared'], whole: 'reference' }
        : { kind: 'mul', parts: ['factor', 'reference'], whole: 'compared' };
  }
}

export const stepFamily = (s: SchemaStep): Family => familyOf(s.schema, s.variant);

export function val(step: SchemaStep, role: Role): number {
  const q = step.quantities.find((x) => x.role === role);
  if (!q) throw new Error(`rol yok: ${role}`);
  return q.value;
}

/** Şema bağıntısı sağlanıyor mu? (Kalanlı bölmede: toplam = g × p + kalan.) */
export function holds(step: SchemaStep): boolean {
  const f = stepFamily(step);
  const a = val(step, f.parts[0]);
  const b = val(step, f.parts[1]);
  const w = val(step, f.whole);
  if (f.kind === 'add') return a + b === w;
  const r = step.remainder?.value ?? 0;
  return a * b + r === w;
}

/** Kalanlı bölmede bölen (bilinen çarpan). */
export function divisorOf(step: SchemaStep): number {
  const f = stepFamily(step);
  const other = f.parts[0] === step.unknown ? f.parts[1] : f.parts[0];
  return val(step, other);
}

const tokOf = (step: SchemaStep, r: Role): number | '?' => (r === step.unknown ? '?' : val(step, r));

/** Şemanın kendi şablon denklemi (DESIGN §3), bilinmeyen '?'. */
export function templateTokens(step: SchemaStep): Tok[] {
  const t = (r: Role) => tokOf(step, r);
  if (step.remainder) {
    return [val(step, 'total'), '÷', divisorOf(step), '=', '?'];
  }
  switch (step.schema) {
    case 'change':
      return step.variant === 'separate'
        ? [t('start'), MINUS as Op, t('change'), '=', t('result')]
        : [t('start'), '+', t('change'), '=', t('result')];
    case 'combine':
      return [t('part1'), '+', t('part2'), '=', t('whole')];
    case 'compare':
      return [t('larger'), MINUS as Op, t('smaller'), '=', t('difference')];
    case 'equalGroups':
      return [t('groups'), '×', t('perGroup'), '=', t('total')];
    case 'multCompare':
      return step.variant === 'fraction'
        ? [t('reference'), '÷', t('factor'), '=', t('compared')]
        : [t('factor'), '×', t('reference'), '=', t('compared')];
  }
}

const key = (toks: Tok[]): string => toks.join(' ');

/** Aynı modele uyan tüm denklemler (8 − 3 = ? · 3 + ? = 8 · ? = 8 − 3 …). */
export function equationAlternatives(step: SchemaStep): Tok[][] {
  if (step.remainder) {
    const T = val(step, 'total');
    const d = divisorOf(step);
    return [[T, '÷', d, '=', '?'], ['?', '=', T, '÷', d]];
  }
  const f = stepFamily(step);
  const p = tokOf(step, f.parts[0]);
  const q = tokOf(step, f.parts[1]);
  const w = tokOf(step, f.whole);
  const plus: Op = f.kind === 'add' ? '+' : '×';
  const minus: Op = f.kind === 'add' ? (MINUS as Op) : '÷';
  const forms: Tok[][] = [
    [p, plus, q, '=', w], [q, plus, p, '=', w],
    [w, minus, p, '=', q], [w, minus, q, '=', p],
    [w, '=', p, plus, q], [w, '=', q, plus, p],
    [q, '=', w, minus, p], [p, '=', w, minus, q],
  ];
  const seen = new Set<string>();
  const out: Tok[][] = [];
  const tpl = templateTokens(step);
  for (const f2 of [tpl, ...forms]) {
    const k = key(f2);
    if (!seen.has(k)) { seen.add(k); out.push(f2); }
  }
  return out;
}

/** Denklemi değerlendir: '?' yerine x koyunca doğru mu? */
export function evalEquation(toks: Tok[], x: number): boolean {
  const eq = toks.indexOf('=');
  if (eq < 0) return false;
  const side = (arr: Tok[]): number | null => {
    const vals = arr.map((t) => (t === '?' ? x : t));
    if (vals.length === 1 && typeof vals[0] === 'number') return vals[0];
    if (vals.length === 3 && typeof vals[0] === 'number' && typeof vals[2] === 'number') {
      const [a, op, b] = vals as [number, Op, number];
      switch (op) {
        case '+': return a + b;
        case '−': return a - b;
        case '×': return a * b;
        case '÷': return b === 0 ? null : a / b;
      }
    }
    return null;
  };
  const l = side(toks.slice(0, eq));
  const r = side(toks.slice(eq + 1));
  return l !== null && r !== null && Math.abs(l - r) < 1e-9;
}

/** U ekseni ↔ bilinmeyen rol (DESIGN §5: 0 sonuç/bütün · 1 değişim/parça/fark · 2 başlangıç/referans). */
export function unknownForU(schema: SchemaId, variant: SchemaVariant, U: 0 | 1 | 2): Role {
  switch (schema) {
    case 'change':
      return (['result', 'change', 'start'] as const)[U];
    case 'combine':
      return U === 0 ? 'whole' : 'part2';
    case 'compare':
      if (U === 1 || variant === 'equalize') return 'difference';
      // U0: karşılaştırılan (tutarlı dil) · U2: referans (tutarsız dil)
      if (variant === 'more') return U === 0 ? 'larger' : 'smaller';
      return U === 0 ? 'smaller' : 'larger';
    case 'equalGroups':
      return (['total', 'perGroup', 'groups'] as const)[U];
    case 'multCompare':
      if (variant === 'fraction') return U === 2 ? 'reference' : 'compared';
      return (['compared', 'factor', 'reference'] as const)[U];
  }
}

/** Bilinmeyen rolden U düzeyi. */
export function uOf(schema: SchemaId, variant: SchemaVariant, unknown: Role): 0 | 1 | 2 {
  for (const U of [0, 1, 2] as const) if (unknownForU(schema, variant, U) === unknown) return U;
  if (schema === 'combine') return 1;
  return 1;
}

/** compare/multCompare: referans rolü (kıyaslanan "…den" / "…in katı"). */
export function referentOf(schema: SchemaId, variant: SchemaVariant): Role | undefined {
  if (schema === 'compare') return variant === 'fewer' || variant === 'equalize' ? 'larger' : 'smaller';
  if (schema === 'multCompare') return 'reference';
  return undefined;
}

/** Tutarsız dil mi? (Bilinmeyen = referans; Lewis & Mayer 1987.) */
export function isInconsistent(step: SchemaStep): boolean {
  if (step.schema !== 'compare' && step.schema !== 'multCompare') return false;
  if (step.variant === 'equalize') return false;
  return step.unknown === step.referent;
}

/** Tutarsız dilde "anahtar sözcüğün çağrıştırdığı" işlem (tuzak işlem). */
export function keywordOp(step: SchemaStep): Op | undefined {
  switch (step.variant) {
    case 'more': return '+';
    case 'fewer': return MINUS as Op;
    case 'times': return '×';
    case 'fraction': return '÷';
    default: return undefined;
  }
}

export function applyOp(a: number, op: Op, b: number): number {
  switch (op) {
    case '+': return a + b;
    case '−': return a - b;
    case '×': return a * b;
    case '÷': return a / b;
  }
}
