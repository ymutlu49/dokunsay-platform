/**
 * Problem yardımcıları (saf): metindeki sayı çipleri, bilinen en büyük sayı, birim
 * seçenekleri, ters işlem. İçerik motorunun iç yapısına dayanmaz; yalnız sözleşme tipleri.
 */
import type { Lang, Problem, Role, SchemaStep, L10n } from '../content/types';
import type { EqToken, Op } from './contentAdapter';

export interface NumChip {
  id: string;
  value: number;
  /** Gereksiz bilgi mi? (extraN) */
  extra: boolean;
  /** Önceki halkanın sonucu mu? (iki adımlı problemde türetilen sayı) */
  derived?: boolean;
}

function numOf(text: string): number | null {
  const m = text.replace(/[.\s]/g, '').match(/\d+/);
  return m ? Number(m[0]) : null;
}

/** Hikâyedeki sayı çipleri (seçili dilde; aynı değer iki kez geçerse iki çip). */
export function storyChips(problem: Problem, lang: Lang): NumChip[] {
  const out: NumChip[] = [];
  const sentences = problem.text[lang]?.length ? problem.text[lang] : problem.text.tr;
  sentences.forEach((s, si) =>
    s.segments.forEach((g, gi) => {
      if (g.kind !== 'qty') return;
      const v = numOf(g.text);
      if (v == null) return;
      out.push({ id: `n${si}-${gi}`, value: v, extra: String(g.ref).startsWith('extra') });
    }),
  );
  return out;
}

/** Model/denklem için sayı çipleri: hikâye sayıları + önceki halka sonuçları. */
export function modelChips(problem: Problem, lang: Lang, link: number, linkResults: Record<number, number>, hideIds: string[] = []): NumChip[] {
  const chips = storyChips(problem, lang).filter((c) => !hideIds.includes(c.id));
  for (let i = 0; i < link; i++) {
    const v = linkResults[i];
    if (typeof v === 'number') chips.push({ id: `d${i}`, value: v, extra: false, derived: true });
  }
  return chips;
}

/** "Bildiğim en büyük sayı": hikâyedeki ilgili (gereksiz olmayan) sayıların en büyüğü. */
export function knownMax(problem: Problem): number {
  const fromText = storyChips(problem, 'tr').filter((c) => !c.extra).map((c) => c.value);
  return Math.max(0, ...fromText);
}

export function unknownValue(step: SchemaStep): number {
  return step.quantities.find((q) => q.role === step.unknown)?.value ?? 0;
}

export function qty(step: SchemaStep, role: Role) {
  return step.quantities.find((q) => q.role === role);
}

/** Cevap birimi seçenekleri: doğru birim + problemdeki diğer birimler (en çok 3). */
export function unitOptions(problem: Problem): L10n[] {
  const seen = new Set<string>();
  const out: L10n[] = [];
  const add = (u: L10n | undefined) => {
    if (!u || !u.tr || seen.has(u.tr)) return;
    seen.add(u.tr);
    out.push(u);
  };
  add(problem.answerUnit);
  problem.steps.forEach((s) => s.quantities.forEach((q) => add(q.unit)));
  problem.extras.forEach((e) => add(e.unit));
  if (out.length < 2) add({ tr: 'lira', ku: 'lîre', en: 'lira' });
  if (out.length < 3) add({ tr: 'gün', ku: 'roj', en: 'day' });
  return out.slice(0, 3);
}

/** Deterministik karıştırma (tohumlu) — seçeneklerin yeri her problemde aynı kalmasın. */
export function shuffleSeeded<T>(arr: T[], seed: number): T[] {
  const a = [...arr];
  let s = (Math.abs(seed) % 2147483646) + 1;
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 16807) % 2147483647;
    const j = s % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const INVERSE: Record<Op, Op> = { '+': '−', '−': '+', '×': '÷', '÷': '×' };

/** a op b = c (bilinmeyen doldurulmuş) → ters işlem cümlesi "c inv b = a". */
export function inverseOf(tokens: EqToken[]): EqToken[] | null {
  if (tokens.length !== 5) return null;
  const [a, op, b, , c] = tokens;
  if (typeof a !== 'number' || typeof b !== 'number' || typeof c !== 'number') return null;
  if (op !== '+' && op !== '−' && op !== '×' && op !== '÷') return null;
  return [c, INVERSE[op], b, '=', a];
}

export function fillUnknown(tokens: EqToken[], x: number): EqToken[] {
  return tokens.map((t) => (t === '?' ? x : t));
}

export function tokensText(tokens: EqToken[]): string {
  return tokens.map((t) => String(t)).join(' ');
}

/** Konuşulabilir biçim: başta/ortada "?" → "kaç" (toSpeech yalnız "= ?"yi çevirir). */
export function tokensSpeech(tokens: EqToken[], lang: Lang): string {
  const q = lang === 'tr' ? 'kaç' : lang === 'en' ? 'what' : 'çend';
  return tokens.map((t) => (t === '?' ? q : String(t))).join(' ');
}
