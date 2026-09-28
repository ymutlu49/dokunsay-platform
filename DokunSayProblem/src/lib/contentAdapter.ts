/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * İçerik API'si ↔ arayüz NORMALLEŞTİRME katmanı.
 *
 * İçerik motoru paralel yazıldığı için dönüş biçimlerinde küçük farklar olabilir
 * (ör. checkSchema → boolean ya da {ok}; equationOf token'ları sayı ya da dize; LADDER
 * alan adları). Arayüz yalnız BU dosyadaki işlevleri çağırır; biçim farkı çıkarsa
 * düzeltme tek yerde yapılır. Sözleşme tipleri `../content/types`'tan gelir.
 */
import * as C from './content';
import type {
  ErrorClass,
  ExtraQuantity,
  FlowStepId,
  Grade,
  L10n,
  Lang,
  ParaphraseItem,
  Problem,
  ProblemSpec,
  Role,
  SchemaId,
  SchemaStep,
  Sentence,
} from '../content/types';

const API = C as unknown as Record<string, any>;

export type Op = '+' | '−' | '×' | '÷';
export type EqToken = number | '?' | Op | '=';

const EMPTY: L10n = { tr: '', ku: '', en: '' };

function asL10n(v: any): L10n {
  if (!v) return EMPTY;
  if (typeof v === 'string') return { tr: v, ku: v, en: v };
  return { tr: v.tr ?? '', ku: v.ku ?? v.tr ?? '', en: v.en ?? v.tr ?? '' };
}

function asOk(r: any): { ok: boolean; error?: ErrorClass } {
  if (typeof r === 'boolean') return { ok: r };
  if (r && typeof r === 'object') return { ok: Boolean(r.ok), error: r.error };
  return { ok: false };
}

// ─── Şema meta ─────────────────────────────────────────────────────────────
export interface SchemaMetaUI {
  name: L10n;
  short: L10n;
  story: L10n;
  rule: L10n;
  equation: L10n;
  color: string;
}

const FALLBACK_COLOR: Record<SchemaId, string> = {
  change: '#0072b2',
  combine: '#009e73',
  compare: '#cc79a7',
  equalGroups: '#e69f00',
  multCompare: '#56b4e9',
};

export const SCHEMAS: SchemaId[] = ['change', 'combine', 'compare', 'equalGroups', 'multCompare'];

export function schemaMeta(id: SchemaId): SchemaMetaUI {
  const m = API.SCHEMA_META?.[id] ?? {};
  return {
    name: asL10n(m.name ?? id),
    short: asL10n(m.short),
    story: asL10n(m.story),
    rule: asL10n(m.rule),
    equation: asL10n(m.equation),
    color: typeof m.color === 'string' ? m.color : FALLBACK_COLOR[id],
  };
}

export function roleLabel(role: Role): L10n {
  return asL10n(API.ROLE_LABEL?.[role] ?? role);
}

// ─── Denetimler ────────────────────────────────────────────────────────────
function toToken(x: any): EqToken {
  if (typeof x === 'number') return x;
  if (x && typeof x === 'object') {
    if ('value' in x && typeof x.value === 'number') return x.value;
    if ('op' in x) return toToken(x.op);
    if ('kind' in x && x.kind === 'unknown') return '?';
  }
  const s = String(x).trim();
  if (s === '-' || s === '−' || s === '–') return '−';
  if (s === 'x' || s === '*' || s === '×') return '×';
  if (s === '/' || s === '÷') return '÷';
  if (s === '+' || s === '=' || s === '?') return s as EqToken;
  const n = Number(s);
  return Number.isFinite(n) ? n : '?';
}

export function equationFor(step: SchemaStep): { tokens: EqToken[]; alternatives: EqToken[][] } {
  try {
    const r = API.equationOf?.(step);
    const tokens: EqToken[] = (r?.tokens ?? []).map(toToken);
    const alternatives: EqToken[][] = (r?.alternatives ?? []).map((a: any[]) => a.map(toToken));
    return { tokens, alternatives };
  } catch {
    return { tokens: [], alternatives: [] };
  }
}

export function checkSchemaChoice(step: SchemaStep, chosen: SchemaId): boolean {
  try {
    return asOk(API.checkSchema?.(step, chosen)).ok;
  } catch {
    return step.schema === chosen;
  }
}

export type Placements = Partial<Record<Role, number | '?'>>;

export function checkModelPlacement(
  step: SchemaStep,
  placements: Placements,
  extras: ExtraQuantity[],
): { ok: boolean; perRole: Partial<Record<Role, boolean>>; error?: ErrorClass } {
  try {
    const r = API.checkModel?.(step, placements, extras);
    const perRole: Partial<Record<Role, boolean>> = {};
    const raw = r?.perRole ?? {};
    for (const q of step.quantities) {
      const v = raw[q.role];
      perRole[q.role] = typeof v === 'boolean' ? v : typeof v === 'string' ? v === 'ok' : Boolean(v?.ok);
    }
    return { ok: Boolean(r?.ok), perRole, error: r?.error };
  } catch {
    const perRole: Partial<Record<Role, boolean>> = {};
    for (const q of step.quantities) perRole[q.role] = placements[q.role] === (q.role === step.unknown ? '?' : q.value);
    return { ok: Object.values(perRole).every(Boolean), perRole, error: 'modelPlacement' };
  }
}

export function checkEquationTokens(step: SchemaStep, tokens: EqToken[]): { ok: boolean; error?: ErrorClass } {
  try {
    return asOk(API.checkEquation?.(step, tokens));
  } catch {
    return { ok: false, error: 'operation' };
  }
}

export function checkFinalAnswer(problem: Problem, value: number): { ok: boolean; error?: ErrorClass } {
  try {
    return asOk(API.checkAnswer?.(problem, value));
  } catch {
    return value === problem.answer ? { ok: true } : { ok: false, error: 'computation' };
  }
}

// ─── İpucu / geri bildirim / öz-sorgu ──────────────────────────────────────
export function hintText(problem: Problem, stepId: FlowStepId, level: 1 | 2 | 3 | 4): L10n {
  try {
    return asL10n(API.hintFor?.(problem, stepId, level));
  } catch {
    return EMPTY;
  }
}

export type FeedbackKind = 'correct' | 'tryAgain' | ErrorClass;

export function feedbackText(kind: FeedbackKind, problem: Problem, stepId: FlowStepId): L10n {
  const TRY_AGAIN: L10n = { tr: 'Bir daha bakalım.', ku: 'Em dîsa binêrin.', en: "Let's look again." };
  try {
    const r = asL10n(API.feedbackFor?.(kind, problem, stepId));
    return r.tr ? r : TRY_AGAIN;
  } catch {
    return TRY_AGAIN;
  }
}

export function selfTalkFor(stepId: FlowStepId): { say: L10n; ask: L10n; check: L10n } | null {
  const s = API.selfTalk?.[stepId];
  if (!s) return null;
  return { say: asL10n(s.say), ask: asL10n(s.ask), check: asL10n(s.check) };
}

// ─── Metin ────────────────────────────────────────────────────────────────
export function answerText(problem: Problem, lang: Lang, x: number | string): string {
  try {
    const r = API.renderAnswer?.(problem, lang, x);
    if (typeof r === 'string' && r) return r;
  } catch {
    /* düş */
  }
  return (problem.answerSentence[lang] || problem.answerSentence.tr).replace('{x}', String(x));
}

export function sentenceString(s: Sentence): string {
  try {
    const r = API.sentenceText?.(s);
    if (typeof r === 'string') return r;
  } catch {
    /* düş */
  }
  return s.segments.map((g) => g.text).join('');
}

export function sentenceSpoken(s: Sentence, lang: Lang): string {
  try {
    const r = API.sentenceSpeech?.(s, lang);
    if (typeof r === 'string' && r) return r;
  } catch {
    /* düş */
  }
  return s.segments.map((g) => (g.kind === 'qty' && g.speak ? g.speak : g.text)).join('');
}

export function paraphraseOptions(problem: Problem): ParaphraseItem['options'] {
  try {
    const r = API.paraphraseFor?.(problem);
    const opts = Array.isArray(r) ? r : r?.options;
    if (Array.isArray(opts) && opts.length) return opts.map((o: any) => ({ kind: o.kind, text: asL10n(o.text) }));
  } catch {
    /* düş */
  }
  return [];
}

export interface VocabUI {
  id: string;
  word: string;
  meaning: string;
}

export function vocabFor(s: Sentence, lang: Lang): VocabUI[] {
  try {
    const r = API.vocabInSentence?.(s, lang) ?? [];
    const list: any[] = Array.isArray(r) ? r : Object.values(r);
    return list
      .map((e: any, i: number) => {
        const vocab: any[] = Array.isArray(API.VOCAB) ? API.VOCAB : Object.values(API.VOCAB ?? {});
        const id = typeof e === 'string' ? e : e.entry?.id ?? e.id;
        const found = vocab.find((v: any) => v.id === id);
        const entry = found ?? (typeof e === 'string' ? { id: e, word: e } : e.entry ?? e);
        const word = entry.word ?? entry.term ?? entry.label ?? entry.id;
        const meaning = entry.meaning ?? entry.explain ?? entry.definition ?? entry.desc ?? '';
        return {
          id: String(entry.id ?? i),
          word: typeof word === 'string' ? word : asL10n(word)[lang],
          meaning: typeof meaning === 'string' ? meaning : asL10n(meaning)[lang],
        };
      })
      .filter((v) => v.word);
  } catch {
    return [];
  }
}

// ─── Merdiven ─────────────────────────────────────────────────────────────
export interface RungUI {
  id: string;
  schema: SchemaId;
  minGrade: number;
  maxGrade: number;
  label: L10n;
  spec: Partial<ProblemSpec>;
}

export function ladder(): RungUI[] {
  const raw: any = API.LADDER;
  const list: any[] = Array.isArray(raw) ? raw : raw ? Object.values(raw) : [];
  return list
    .map((r: any, i: number) => {
      const spec: Partial<ProblemSpec> = r.spec ?? { schema: r.schema, variant: r.variant, unknown: r.unknown, axes: r.axes };
      const schema: SchemaId = r.schema ?? spec.schema;
      const grades: number[] = Array.isArray(r.grades) ? r.grades : Array.isArray(r.grade) ? r.grade : [r.minGrade ?? r.grade ?? 1, r.maxGrade ?? 6];
      return {
        id: String(r.id ?? `rung-${i}`),
        schema,
        minGrade: Number(grades[0] ?? 1),
        maxGrade: Number(grades[grades.length - 1] ?? 6),
        label: asL10n(r.label ?? r.name ?? r.title ?? r.id),
        spec: { ...spec, schema },
      };
    })
    .filter((r) => SCHEMAS.includes(r.schema));
}

export function rungsFor(schema: SchemaId, grade: Grade): RungUI[] {
  return ladder().filter((r) => r.schema === schema && grade >= r.minGrade && grade <= r.maxGrade);
}

// ─── Üretim ───────────────────────────────────────────────────────────────
export function makeProblem(spec: ProblemSpec): Problem | null {
  try {
    const p = API.generateProblem?.(spec);
    return p && Array.isArray(p.steps) && p.steps.length ? (p as Problem) : null;
  } catch (e) {
    console.warn('[problem] generateProblem hata', e);
    return null;
  }
}
