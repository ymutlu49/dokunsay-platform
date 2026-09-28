/**
 * Metin parçaları: cümle kurucular, düz metin / konuşulabilir biçim, cevap cümlesi.
 */
import type { Lang, Problem, Role, Segment, Sentence } from './types';
import { fmtTr, capFirst } from './grammar/tr';
import { fmtEn } from './grammar/en';
import { fmtKu, numWordKu } from './grammar/ku';

export type Part = string | Segment | null | undefined | false;
export type Ref = Role | `extra${number}`;

export function fmtNum(n: number, lang: Lang): string {
  return lang === 'en' ? fmtEn(n) : lang === 'ku' ? fmtKu(n) : fmtTr(n);
}

/** Sayı çipi. `text` verilmezse biçimli rakam; KU için konuşma biçimi sayı adıdır. */
export function chip(ref: Ref, value: number, lang: Lang, opts: { text?: string; step?: number } = {}): Segment {
  const seg: Segment = { kind: 'qty', ref, text: opts.text ?? fmtNum(value, lang) };
  if (lang === 'ku') seg.speak = numWordKu(value);
  if (opts.step !== undefined) seg.step = opts.step;
  return seg;
}

function build(parts: Part[], isQuestion: boolean): Sentence {
  const segs: Segment[] = [];
  for (const p of parts) {
    if (p === null || p === undefined || p === false) continue;
    if (typeof p === 'string') {
      if (!p) continue;
      const prev = segs[segs.length - 1];
      if (prev && prev.kind === 'text') prev.text += p;
      else segs.push({ kind: 'text', text: p });
    } else segs.push({ ...p });
  }
  // Boşluk normalleştirme: çift boşluk, noktalama öncesi boşluk, kenar boşlukları.
  for (const s of segs) if (s.kind === 'text') s.text = s.text.replace(/\s{2,}/g, ' ').replace(/\s+([.,?!;:])/g, '$1');
  const first = segs[0];
  if (first && first.kind === 'text') {
    first.text = capFirst(first.text.replace(/^\s+/, ''));
  }
  const last = segs[segs.length - 1];
  if (last && last.kind === 'text') last.text = last.text.replace(/\s+$/, '');
  const out: Sentence = { segments: segs.filter((s) => s.kind !== 'text' || s.text.length > 0) };
  if (isQuestion) out.isQuestion = true;
  return out;
}

/** Bildirim cümlesi. */
export const S = (...parts: Part[]): Sentence => build(parts, false);
/** Soru cümlesi (isQuestion). */
export const Q = (...parts: Part[]): Sentence => build(parts, true);

/** Ekranda görünen düz metin. */
export function sentenceText(s: Sentence): string {
  return s.segments.map((g) => g.text).join('');
}

const MINUS: Record<Lang, string> = { tr: 'eksi', ku: 'kêm', en: 'minus' };

/**
 * Konuşulabilir biçim: çiplerde `speak` varsa o; U+2212 eksi → "eksi"/"minus".
 * Türkçe ve İngilizcede rakamlar yerinde kalır (TTS okur); Kurmancîde rakamlar sayı adına çevrilir.
 */
export function sentenceSpeech(s: Sentence, lang: Lang): string {
  let out = s.segments.map((g) => (g.kind === 'qty' && g.speak ? g.speak : g.text)).join('');
  out = out.replace(/\s*−\s*/g, ` ${MINUS[lang]} `);
  if (lang === 'ku') out = out.replace(/\d[\d.]*/g, (m) => numWordKu(Number(m.replace(/\./g, ''))));
  return out.replace(/\s{2,}/g, ' ').trim();
}

/** Cevap cümlesini doldur: "Ela'nın {x} kalemi kaldı." */
export function renderAnswer(problem: Problem, lang: Lang, x: number | string): string {
  const shown = typeof x === 'number' ? fmtNum(x, lang) : x;
  let out = problem.answerSentence[lang].split('{x}').join(shown);
  if (lang === 'en' && (x === 1 || x === '1')) out = out.replace(/\b1 ([a-z]+?)s\b/, '1 $1');
  return out;
}

/** Tüm hikâyenin düz metni (test/imza için). */
export const storyText = (sents: Sentence[]): string => sents.map(sentenceText).join(' ');
