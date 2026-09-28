/**
 * Müfredat sınırları (04 §C.1 — TYMM 2024 + ÖÖG Destek Eğitim Düzey 1–4) DOĞRULAYICI olarak.
 * `validateProblem(p)` boş dizi döndürürse madde geçerlidir.
 */
import type { Grade, Lang, Problem, Role, SchemaId, SchemaVariant, Sentence } from './types';
import { LANGS, SCHEMA_ROLES } from './types';
import { familyOf, holds, isInconsistent, isMultiplicativeSchema, val, divisorOf } from './relations';
import { hasCarry } from './numbers';
import { sentenceText } from './text';
import * as g from './grammar/tr';

export interface GradeRule {
  maxNumber: number;
  carry: boolean;
  addOps: number;
  mulOps: number;
  schemas: SchemaId[];
  divMaxTotal: number;
  divisor: [number, number];
  remainder: boolean;
  fraction: boolean;
  irrelevantMax: 0 | 1 | 2;
  table: boolean;
  /** Türkçe cümle başına en çok sözcük (04 §D.2). */
  maxWords: number;
}

export const GRADE_RULES: Record<Grade, GradeRule> = {
  1: { maxNumber: 20, carry: false, addOps: 1, mulOps: 0, schemas: ['change', 'combine', 'compare'], divMaxTotal: 0, divisor: [0, 0], remainder: false, fraction: false, irrelevantMax: 0, table: false, maxWords: 8 },
  2: { maxNumber: 100, carry: true, addOps: 2, mulOps: 1, schemas: ['change', 'combine', 'compare', 'equalGroups'], divMaxTotal: 20, divisor: [2, 5], remainder: false, fraction: false, irrelevantMax: 1, table: true, maxWords: 10 },
  3: { maxNumber: 1000, carry: true, addOps: 3, mulOps: 2, schemas: ['change', 'combine', 'compare', 'equalGroups', 'multCompare'], divMaxTotal: 100, divisor: [2, 10], remainder: true, fraction: false, irrelevantMax: 2, table: true, maxWords: 12 },
  4: { maxNumber: 9999, carry: true, addOps: 4, mulOps: 3, schemas: ['change', 'combine', 'compare', 'equalGroups', 'multCompare'], divMaxTotal: 1000, divisor: [2, 9], remainder: true, fraction: true, irrelevantMax: 2, table: true, maxWords: 15 },
  5: { maxNumber: 99999, carry: true, addOps: 4, mulOps: 3, schemas: ['change', 'combine', 'compare', 'equalGroups', 'multCompare'], divMaxTotal: 9999, divisor: [2, 99], remainder: true, fraction: true, irrelevantMax: 2, table: true, maxWords: 15 },
  6: { maxNumber: 99999, carry: true, addOps: 4, mulOps: 3, schemas: ['change', 'combine', 'compare', 'equalGroups', 'multCompare'], divMaxTotal: 9999, divisor: [2, 99], remainder: true, fraction: true, irrelevantMax: 2, table: true, maxWords: 15 },
};

export interface Combo { schema: SchemaId; variant: SchemaVariant; unknown: Role }

/** Üretecin desteklediği tüm şema × alt tür × bilinmeyen birleşimleri. */
export const ALL_COMBOS: readonly Combo[] = [
  ...(['join', 'separate'] as const).flatMap((variant) => (['result', 'change', 'start'] as const).map((unknown) => ({ schema: 'change' as const, variant, unknown }))),
  { schema: 'combine', variant: 'static', unknown: 'whole' },
  { schema: 'combine', variant: 'static', unknown: 'part2' },
  ...(['more', 'fewer'] as const).flatMap((variant) => (['difference', 'larger', 'smaller'] as const).map((unknown) => ({ schema: 'compare' as const, variant, unknown }))),
  { schema: 'compare', variant: 'equalize', unknown: 'difference' },
  { schema: 'equalGroups', variant: 'multiply', unknown: 'total' },
  { schema: 'equalGroups', variant: 'partitive', unknown: 'perGroup' },
  { schema: 'equalGroups', variant: 'quotative', unknown: 'groups' },
  { schema: 'multCompare', variant: 'times', unknown: 'compared' },
  { schema: 'multCompare', variant: 'times', unknown: 'factor' },
  { schema: 'multCompare', variant: 'times', unknown: 'reference' },
  { schema: 'multCompare', variant: 'fraction', unknown: 'compared' },
  { schema: 'multCompare', variant: 'fraction', unknown: 'reference' },
];

/** Sınıfa göre izinli mi? (04 §C.2: ● çekirdek + ○ destekli giriş.) */
export function isAllowed(grade: Grade, c: Combo): boolean {
  const r = GRADE_RULES[grade];
  if (!r.schemas.includes(c.schema)) return false;
  if (!ALL_COMBOS.some((x) => x.schema === c.schema && x.variant === c.variant && x.unknown === c.unknown)) return false;
  if (grade === 1 && c.schema === 'compare' && c.unknown !== 'difference') return false;
  if (c.variant === 'fraction' && !r.fraction) return false;
  return true;
}

export const combosFor = (grade: Grade): Combo[] => ALL_COMBOS.filter((c) => isAllowed(grade, c));

/** TYMM 2024 öğrenme çıktısı kodları. */
export function curriculumCodes(grade: Grade, schema: SchemaId, variant: SchemaVariant, unknown: Role, remainder: boolean): string[] {
  const out: string[] = [];
  if (grade === 1) {
    out.push('MAT.1.2.1');
    if (schema === 'combine') out.push('MAT.1.1.2');
    if (schema === 'compare') out.push('MAT.1.1.4');
    if (variant === 'equalize') out.push('MAT.1.2.3');
    if (unknown === 'start' || unknown === 'change') out.push('MAT.1.2.4');
  } else if (grade === 2) {
    if (schema === 'equalGroups') out.push('MAT.2.2.4', 'MAT.2.2.5');
    else out.push('MAT.2.2.1');
    if (variant === 'equalize') out.push('MAT.2.2.6');
  } else if (grade === 3) {
    out.push('MAT.3.2.6');
    if (schema === 'multCompare') out.push('MAT.3.2.8');
    if (remainder) out.push('MAT.3.2.3');
  } else if (grade === 4) {
    out.push('MAT.4.2.7');
    if (variant === 'fraction') out.push('MAT.4.1.10');
  } else out.push('MAT.5.1.2');
  return out;
}

// ─── Türkçe yazım denetimi ─────────────────────────────────────────────────

const nameForms = (n: string) => [g.nameGen(n), g.nameDat(n), g.nameAcc(n), g.nameAbl(n), g.nameLoc(n), g.nameKiAbl(n), g.nameKiGen(n)];
const numForms = (n: number) => [g.numAbl(n), g.numLoc(n), g.numDat(n), g.numAcc(n), g.numGen(n), g.numPoss3(n), g.numPoss3Acc(n), g.numPoss3Dat(n), g.numDist(n)];
const TL_OK = new Set(["TL'si", "TL'sini", "TL'ye", "TL'yi", "TL'den", "TL'de", "TL'lik"]);

/** Türkçe metindeki ek uyumu, yasak örüntü ve boşluk sorunları. */
export function trTextIssues(text: string): string[] {
  const out: string[] = [];
  if (/kat fazla/i.test(text)) out.push('"kat fazla" yasak');
  if (/ {2,}/.test(text)) out.push('çift boşluk');
  if (/\s[.,?!;:]/.test(text)) out.push('noktalama öncesi boşluk');
  for (const m of text.matchAll(/([\p{L}\d.]+)'([\p{L}]+)/gu)) {
    const [tok, base] = m;
    if (base === 'TL') { if (!TL_OK.has(tok)) out.push(`ek: ${tok}`); continue; }
    if (/^[\d.]+$/.test(base)) {
      const n = Number(base.replace(/\./g, ''));
      if (!numForms(n).includes(tok)) out.push(`sayı eki: ${tok}`);
    } else if (/^\p{Lu}/u.test(base)) {
      if (!nameForms(base).includes(tok)) out.push(`ad eki: ${tok}`);
    }
  }
  return out;
}

const wc = (s: Sentence) => g.wordCount(sentenceText(s));

/** Madde geçerlilik denetimi (boş dizi = geçerli). */
export function validateProblem(p: Problem): string[] {
  const e: string[] = [];
  const grade = p.grade;
  const r = GRADE_RULES[grade];
  for (const lang of LANGS) {
    const sents = p.text[lang];
    if (!sents || !sents.length) { e.push(`${lang}: metin boş`); continue; }
    if (sents.some((s) => !sentenceText(s).trim())) e.push(`${lang}: boş cümle`);
    if (!sents[sents.length - 1].isQuestion) e.push(`${lang}: son cümle soru değil`);
    if (!p.answerSentence[lang].includes('{x}')) e.push(`${lang}: cevap cümlesinde {x} yok`);
    if (!p.answerUnit[lang]) e.push(`${lang}: birim boş`);
    const limit = lang === 'tr' ? r.maxWords : r.maxWords + 5;
    sents.forEach((s, i) => { if (wc(s) > limit) e.push(`${lang}: cümle ${i + 1} çok uzun (${wc(s)} > ${limit})`); });
  }
  const trAll = (p.text.tr ?? []).map(sentenceText).join(' ') + ' ' + p.answerSentence.tr;
  e.push(...trTextIssues(trAll).map((x) => `tr: ${x}`));

  if (p.unsolvable) return e;

  if (!p.steps.length || p.steps.length > 2) e.push('halka sayısı 1–2 olmalı');
  let add = 0, mul = 0;
  for (const s of p.steps) {
    if (!isAllowed(grade, { schema: s.schema, variant: s.variant, unknown: s.unknown }) && p.steps.length === 1) e.push(`sınıf ${grade} için izinsiz: ${s.schema}/${s.variant}/${s.unknown}`);
    if (!r.schemas.includes(s.schema)) e.push(`sınıf ${grade} için izinsiz şema: ${s.schema}`);
    const roles = SCHEMA_ROLES[s.schema];
    if (roles.some((ro) => !s.quantities.find((q) => q.role === ro))) { e.push('eksik rol'); continue; }
    if (!holds(s)) e.push(`bağıntı sağlanmıyor: ${s.schema}`);
    for (const q of s.quantities) {
      if (!Number.isInteger(q.value) || q.value < 1) e.push(`geçersiz değer ${q.role}=${q.value}`);
      if (q.value > r.maxNumber) e.push(`sayı sınırı aşıldı: ${q.value} > ${r.maxNumber}`);
    }
    if (isMultiplicativeSchema(s.schema)) mul++; else add++;
    const f = familyOf(s.schema, s.variant);
    if (f.kind === 'add' && !r.carry && hasCarry(val(s, f.parts[0]), val(s, f.parts[1]))) e.push('1. sınıfta eldeli/onluk bozmalı işlem');
    if (grade === 1) {
      if (s.schema === 'compare' && val(s, 'larger') > 10) e.push('1. sınıf karşılaştırma ≤10');
      if (s.schema === 'change' && s.unknown === 'start' && val(s, s.variant === 'separate' ? 'start' : 'result') > 10) e.push('1. sınıf başlangıç bilinmeyen ≤10');
    }
    if (s.schema === 'equalGroups') {
      const gg = val(s, 'groups'), pp = val(s, 'perGroup'), tt = val(s, 'total');
      if (s.remainder && !r.remainder) e.push('kalanlı bölme bu sınıfta yok');
      if (grade === 2) {
        if (s.variant === 'multiply' && (Math.min(gg, pp) > 5 || Math.max(gg, pp) > 10)) e.push('2. sınıf çarpım: 10\'a kadar × 1–5');
        if (s.variant !== 'multiply' && tt > r.divMaxTotal) e.push('2. sınıf bölme: 20\'ye kadar');
      }
      if (s.variant !== 'multiply') {
        const d = divisorOf(s);
        if (d < r.divisor[0] || d > r.divisor[1]) e.push(`bölen sınır dışı: ${d}`);
        if (tt > r.divMaxTotal) e.push(`bölünen sınır dışı: ${tt}`);
      }
      if (s.remainder && (s.remainder.value < 1 || s.remainder.value >= divisorOf(s))) e.push('kalan geçersiz');
    }
    if (s.variant === 'fraction' && !r.fraction) e.push('birim kesir 4. sınıfta');
  }
  if (add > r.addOps) e.push(`+/− işlem sayısı sınırı: ${add}`);
  if (mul > r.mulOps) e.push(`×/÷ işlem sayısı sınırı: ${mul}`);
  if (grade === 2 && mul > 0 && p.steps.length > 1) e.push('2. sınıfta ×/÷ tek işlemli');
  if (grade === 1 && (p.axes.M > 1 || p.axes.I > 0 || p.axes.P > 0)) e.push('1. sınıf: tek adım, gereksiz bilgi/tablo yok');
  if (p.axes.I > r.irrelevantMax) e.push('gereksiz bilgi sınırı');
  if (p.axes.P === 1 && !r.table) e.push('tablo bu sınıfta yok');
  if (!(p.answer > 0)) e.push('cevap pozitif olmalı');
  if (p.answer > r.maxNumber) e.push('cevap sayı sınırını aşıyor');

  // Çipler: rol/extra karşılığı var, bilinmeyen gösterilmiyor.
  const last = p.steps.length - 1;
  for (const lang of LANGS as readonly Lang[]) {
    for (const s of p.text[lang] ?? []) for (const seg of s.segments) {
      if (seg.kind !== 'qty') continue;
      const si = seg.step ?? 0;
      if (seg.ref.startsWith('extra')) {
        const ex = p.extras.find((x) => x.id === seg.ref);
        if (!ex) e.push(`${lang}: bilinmeyen extra ${seg.ref}`);
        continue;
      }
      const st = p.steps[si];
      const q = st?.quantities.find((x) => x.role === seg.ref);
      if (!q) { e.push(`${lang}: çip rolü yok ${seg.ref}`); continue; }
      if (st.unknown === seg.ref) e.push(`${lang}: bilinmeyen metinde gösterildi`);
      if (si < last && p.steps[si + 1]?.links && Object.values(p.steps[si + 1].links!).some((l) => l && l.step === si && l.role === seg.ref && l.role === st.unknown)) e.push('ara sonuç gösterildi');
      const digits = seg.text.replace(/\./g, '').match(/\d+/)?.[0];
      if (digits !== undefined && digits !== String(q.value)) e.push(`${lang}: çip metni değerle uyuşmuyor ${seg.text}≠${q.value}`);
    }
  }
  const roleVals = p.steps.flatMap((s) => s.quantities.map((q) => q.value));
  for (const x of p.extras) if (roleVals.includes(x.value) || x.value === p.answer) e.push(`gereksiz sayı rol değeriyle çakışıyor: ${x.value}`);
  if (isInconsistent(p.steps[last]) && p.axes.L !== 1) e.push('tutarsız dil ama axes.L=0');
  return e;
}
