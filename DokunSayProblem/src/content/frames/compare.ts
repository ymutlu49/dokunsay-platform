/**
 * KARŞILAŞTIRMA şeması çerçeveleri (`more` / `fewer` / `equalize`).
 * Bilinmeyen: fark (U1), karşılaştırılan (U0, tutarlı dil), referans (U2, TUTARSIZ dil — bilinçli
 * anahtar sözcük tuzağı; 04 §D.3 kural 13). 1–2. sınıfta "-inkinden" yok (kural 9): "Can'ın, Ela'dan
 * 3 fazla bilyesi var."; 3. sınıftan iki biçim de.
 */
import type { L10n, Lang, Role, Segment, Sentence } from '../types';
import type { Part } from '../text';
import { S, Q } from '../text';
import type { Frame, FrameInput, FrameOut } from './types';
import { helpers, L, unitOf } from './types';
import type { Person } from '../lexicon';
import * as g from '../grammar/tr';

type Who = 'L' | 'S';
interface CmpLang {
  has: (p: Who, q: Segment) => Part[];
  rel: (q: Segment) => Part[];
  ask: (p: Who) => Part[];
  askDiff: Part[];
  /** equalize: soru öncesi durum cümlesi. */
  eqState: Part[];
  ans: Record<'larger' | 'smaller' | 'difference', string>;
}
const LANGS: Lang[] = ['tr', 'ku', 'en'];

function compose(fi: FrameInput, build: (Lp: Person, Sp: Person) => Record<Lang, CmpLang>): FrameOut {
  const h = helpers(fi);
  const aLarger = fi.rng.chance(0.5);
  const Lp = aLarger ? fi.A : fi.B;
  const Sp = aLarger ? fi.B : fi.A;
  const spec = build(Lp, Sp);
  const lFirst = fi.rng.chance(0.5);
  const text = {} as Record<Lang, Sentence[]>;
  const answer = {} as L10n;
  const u = h.u as 'larger' | 'smaller' | 'difference';
  for (const lang of LANGS) {
    const s = spec[lang];
    const ch = lang === 'tr' ? h.t : lang === 'ku' ? h.k : h.e;
    let out: Sentence[];
    if (u === 'difference') {
      const a = S(...s.has('L', ch('larger')));
      const b = S(...s.has('S', ch('smaller')));
      out = lFirst ? [a, b] : [b, a];
      if (fi.step.variant === 'equalize') out.push(S(...s.eqState));
      out.push(Q(...s.askDiff));
    } else {
      const known: Role = u === 'larger' ? 'smaller' : 'larger';
      out = [S(...s.has(known === 'larger' ? 'L' : 'S', ch(known))), S(...s.rel(ch('difference'))), Q(...s.ask(u === 'larger' ? 'L' : 'S'))];
    }
    text[lang] = out;
    answer[lang] = s.ans[u];
  }
  return {
    text,
    answer,
    unit: unitOf(fi.obj),
    labels: {
      larger: L(Lp.tr, Lp.ku, Lp.en),
      smaller: L(Sp.tr, Sp.ku, Sp.en),
      difference: L('fark', 'kemok', 'difference'),
    },
  };
}

// ─── 1. Sahip olma ("Deniz'in 9 kartı var.") ───────────────────────────────
const have: Frame = {
  id: 'compare.have',
  context: 'play',
  schema: 'compare',
  variants: ['more', 'fewer', 'equalize'],
  minGrade: 1,
  unitKind: 'count',
  objs: ['kart', 'misket', 'kalem', 'ceviz', 'balon', 'kitap'],
  maxWhole: 999,
  render(fi) {
    const h = helpers(fi);
    const v = fi.step.variant;
    const ki = fi.grade >= 3 && fi.rng.chance(0.5);
    return compose(fi, (Lp, Sp) => {
      const P = (w: Who) => (w === 'L' ? Lp : Sp);
      const gL = g.nameGen(Lp.tr), gS = g.nameGen(Sp.tr);
      const relTr = (q: Segment): Part[] =>
        v === 'fewer'
          ? ki ? [gS, ' ', h.oPPl, ', ', g.nameKiAbl(Lp.tr), ' ', q, ' az.'] : [gS, ', ', g.nameAbl(Lp.tr), ' ', q, ' az ', h.oP, ' var.']
          : ki ? [gL, ' ', h.oPPl, ', ', g.nameKiAbl(Sp.tr), ' ', q, ' fazla.'] : [gL, ', ', g.nameAbl(Sp.tr), ' ', q, ' fazla ', h.oP, ' var.'];
      return {
        tr: {
          has: (w, q) => [g.nameGen(P(w).tr), ' ', q, ' ', h.oP, ' var.'],
          rel: relTr,
          ask: (w) => [g.nameGen(P(w).tr), ' kaç ', h.oP, ' var?'],
          askDiff: v === 'fewer' ? [gS, ', ', g.nameAbl(Lp.tr), ' kaç az ', h.oP, ' var?']
            : v === 'equalize' ? [Sp.tr, ' kaç ', h.o, ' daha almalı?']
            : [gL, ', ', g.nameAbl(Sp.tr), ' kaç fazla ', h.oP, ' var?'],
          eqState: [gS, ' ', h.oPPl, ', ', gL, ' ', h.oPPl, ' kadar olsun.'],
          ans: {
            larger: `${gL} {x} ${h.oP} var.`,
            smaller: `${gS} {x} ${h.oP} var.`,
            difference: v === 'fewer' ? `${gS}, ${g.nameAbl(Lp.tr)} {x} az ${h.oP} var.`
              : v === 'equalize' ? `${Sp.tr} {x} ${h.o} daha almalı.`
              : `${gL}, ${g.nameAbl(Sp.tr)} {x} fazla ${h.oP} var.`,
          },
        },
        // KU-DENETİM: "ji … zêdetir/kêmtir hene"; eşitleme cümlesi.
        ku: {
          has: (w, q) => [P(w).kuObl, ' ', q, ' ', h.ko, ' hene.'],
          rel: (q) => v === 'fewer' ? [Sp.kuObl, ' ', q, ' ', h.ko, ' ji ', Lp.kuObl, ' kêmtir hene.'] : [Lp.kuObl, ' ', q, ' ', h.ko, ' ji ', Sp.kuObl, ' zêdetir hene.'],
          ask: (w) => [P(w).kuObl, ' çend ', h.ko, ' hene?'],
          askDiff: v === 'fewer' ? [Sp.kuObl, ' çend ', h.ko, ' ji ', Lp.kuObl, ' kêmtir hene?']
            : v === 'equalize' ? [Sp.ku, ' divê çend ', h.ko, ' din bistîne?']
            : [Lp.kuObl, ' çend ', h.ko, ' ji ', Sp.kuObl, ' zêdetir hene?'],
          eqState: [Sp.ku, ' dixwaze qasî ', Lp.kuObl, ' ', h.ko, ' hebin.'],
          ans: {
            larger: `${Lp.kuObl} {x} ${h.ko} hene.`,
            smaller: `${Sp.kuObl} {x} ${h.ko} hene.`,
            difference: v === 'fewer' ? `${Sp.kuObl} {x} ${h.ko} ji ${Lp.kuObl} kêmtir hene.`
              : v === 'equalize' ? `${Sp.ku} divê {x} ${h.ko} din bistîne.`
              : `${Lp.kuObl} {x} ${h.ko} ji ${Sp.kuObl} zêdetir hene.`,
          },
        },
        en: {
          has: (w, q) => [P(w).en, ' has ', q, ' ', h.eo, '.'],
          rel: (q) => v === 'fewer' ? [Sp.en, ' has ', q, ' fewer ', h.eo, ' than ', Lp.en, '.'] : [Lp.en, ' has ', q, ' more ', h.eo, ' than ', Sp.en, '.'],
          ask: (w) => ['How many ', h.eo, ' does ', P(w).en, ' have?'],
          askDiff: v === 'fewer' ? ['How many fewer ', h.eo, ' does ', Sp.en, ' have than ', Lp.en, '?']
            : v === 'equalize' ? ['How many more ', h.eo, ' does ', Sp.en, ' need?']
            : ['How many more ', h.eo, ' does ', Lp.en, ' have than ', Sp.en, '?'],
          eqState: [Sp.en, ' wants to have as many ', h.eo, ' as ', Lp.en, '.'],
          ans: {
            larger: `${Lp.en} has {x} ${h.eo}.`,
            smaller: `${Sp.en} has {x} ${h.eo}.`,
            difference: v === 'fewer' ? `${Sp.en} has {x} fewer ${h.eo} than ${Lp.en}.`
              : v === 'equalize' ? `${Sp.en} needs {x} more ${h.eo}.`
              : `${Lp.en} has {x} more ${h.eo} than ${Sp.en}.`,
          },
        },
      };
    });
  },
};

// ─── 2. Etkinlik ("Ela 9 kitap okudu.") ────────────────────────────────────
const ACTS: Record<string, { tr: string; trMust: string; ku: string; kuSubj: string; en: string; enBase: string }> = {
  kitap: { tr: 'okudu', trMust: 'okumalı', ku: 'xwendin', kuSubj: 'bixwîne', en: 'read', enBase: 'read' },
  ceviz: { tr: 'topladı', trMust: 'toplamalı', ku: 'berhev kirin', kuSubj: 'berhev bike', en: 'collected', enBase: 'collect' },
  fidan: { tr: 'dikti', trMust: 'dikmeli', ku: 'çandin', kuSubj: 'biçîne', en: 'planted', enBase: 'plant' },
  sise: { tr: 'topladı', trMust: 'toplamalı', ku: 'berhev kirin', kuSubj: 'berhev bike', en: 'collected', enBase: 'collect' },
  basket: { tr: 'attı', trMust: 'atmalı', ku: 'avêtin', kuSubj: 'biavêje', en: 'scored', enBase: 'score' },
};
const did: Frame = {
  id: 'compare.did',
  context: 'activity',
  schema: 'compare',
  variants: ['more', 'fewer', 'equalize'],
  minGrade: 1,
  unitKind: 'count',
  objs: ['kitap', 'ceviz', 'fidan', 'sise', 'basket'],
  maxWhole: 999,
  render(fi) {
    const h = helpers(fi);
    const v = fi.step.variant;
    const a = ACTS[fi.obj.id];
    const out = compose(fi, (Lp, Sp) => {
      const P = (w: Who) => (w === 'L' ? Lp : Sp);
      return {
        tr: {
          has: (w, q) => [P(w).tr, ' ', q, ' ', h.o, ` ${a.tr}.`],
          rel: (q) => v === 'fewer' ? [Sp.tr, ', ', g.nameAbl(Lp.tr), ' ', q, ' az ', h.o, ` ${a.tr}.`] : [Lp.tr, ', ', g.nameAbl(Sp.tr), ' ', q, ' fazla ', h.o, ` ${a.tr}.`],
          ask: (w) => [P(w).tr, ' kaç ', h.o, ` ${a.tr}?`],
          askDiff: v === 'fewer' ? [Sp.tr, ', ', g.nameAbl(Lp.tr), ' kaç az ', h.o, ` ${a.tr}?`]
            : v === 'equalize' ? [Sp.tr, ' kaç ', h.o, ` daha ${a.trMust}?`]
            : [Lp.tr, ', ', g.nameAbl(Sp.tr), ' kaç fazla ', h.o, ` ${a.tr}?`],
          eqState: [Sp.tr, ', ', g.nameDat(Lp.tr), ' yetişmek istiyor.'],
          ans: {
            larger: `${Lp.tr} {x} ${h.o} ${a.tr}.`,
            smaller: `${Sp.tr} {x} ${h.o} ${a.tr}.`,
            difference: v === 'fewer' ? `${Sp.tr}, ${g.nameAbl(Lp.tr)} {x} az ${h.o} ${a.tr}.`
              : v === 'equalize' ? `${Sp.tr} {x} ${h.o} daha ${a.trMust}.`
              : `${Lp.tr}, ${g.nameAbl(Sp.tr)} {x} fazla ${h.o} ${a.tr}.`,
          },
        },
        // KU-DENETİM: ergatif geçmiş + "divê … bixwîne".
        ku: {
          has: (w, q) => [P(w).kuObl, ' ', q, ' ', h.ko, ` ${a.ku}.`],
          rel: (q) => v === 'fewer' ? [Sp.kuObl, ' ', q, ' ', h.ko, ' ji ', Lp.kuObl, ` kêmtir ${a.ku}.`] : [Lp.kuObl, ' ', q, ' ', h.ko, ' ji ', Sp.kuObl, ` zêdetir ${a.ku}.`],
          ask: (w) => [P(w).kuObl, ' çend ', h.ko, ` ${a.ku}?`],
          askDiff: v === 'fewer' ? [Sp.kuObl, ' çend ', h.ko, ' ji ', Lp.kuObl, ` kêmtir ${a.ku}?`]
            : v === 'equalize' ? [Sp.ku, ' divê çend ', h.ko, ` din ${a.kuSubj}?`]
            : [Lp.kuObl, ' çend ', h.ko, ' ji ', Sp.kuObl, ` zêdetir ${a.ku}?`],
          eqState: [Sp.ku, ' dixwaze bigihîje ', Lp.kuObl, '.'],
          ans: {
            larger: `${Lp.kuObl} {x} ${h.ko} ${a.ku}.`,
            smaller: `${Sp.kuObl} {x} ${h.ko} ${a.ku}.`,
            difference: v === 'fewer' ? `${Sp.kuObl} {x} ${h.ko} ji ${Lp.kuObl} kêmtir ${a.ku}.`
              : v === 'equalize' ? `${Sp.ku} divê {x} ${h.ko} din ${a.kuSubj}.`
              : `${Lp.kuObl} {x} ${h.ko} ji ${Sp.kuObl} zêdetir ${a.ku}.`,
          },
        },
        en: {
          has: (w, q) => [P(w).en, ` ${a.en} `, q, ' ', h.eo, '.'],
          rel: (q) => v === 'fewer' ? [Sp.en, ` ${a.en} `, q, ' fewer ', h.eo, ' than ', Lp.en, '.'] : [Lp.en, ` ${a.en} `, q, ' more ', h.eo, ' than ', Sp.en, '.'],
          ask: (w) => ['How many ', h.eo, ` did ${P(w).en} ${a.enBase}?`],
          askDiff: v === 'fewer' ? ['How many fewer ', h.eo, ` did ${Sp.en} ${a.enBase} than ${Lp.en}?`]
            : v === 'equalize' ? ['How many more ', h.eo, ` must ${Sp.en} ${a.enBase}?`]
            : ['How many more ', h.eo, ` did ${Lp.en} ${a.enBase} than ${Sp.en}?`],
          eqState: [Sp.en, ' wants to catch up with ', Lp.en, '.'],
          ans: {
            larger: `${Lp.en} ${a.en} {x} ${h.eo}.`,
            smaller: `${Sp.en} ${a.en} {x} ${h.eo}.`,
            difference: v === 'fewer' ? `${Sp.en} ${a.en} {x} fewer ${h.eo} than ${Lp.en}.`
              : v === 'equalize' ? `${Sp.en} must ${a.enBase} {x} more ${h.eo}.`
              : `${Lp.en} ${a.en} {x} more ${h.eo} than ${Sp.en}.`,
          },
        },
      };
    });
    if (fi.obj.id === 'basket') {
      // Engellilik temsili: nötr, kahramanlık anlatısı olmadan (04 §E.2 #36).
      // KU-DENETİM
      out.text.tr.unshift(S('Okulda tekerlekli sandalye basketbolu oynandı.'));
      out.text.ku.unshift(S('Li dibistanê basketbola bi kursiyên bi teker hat lîstin.'));
      out.text.en.unshift(S('There was a wheelchair basketball match at school.'));
    }
    return out;
  },
};

// ─── 3. Para — 2. sınıftan ─────────────────────────────────────────────────
const money: Frame = {
  id: 'compare.money',
  context: 'money',
  schema: 'compare',
  variants: ['more', 'fewer', 'equalize'],
  minGrade: 2,
  unitKind: 'money',
  objs: ['tl'],
  maxWhole: 1000,
  render(fi) {
    const v = fi.step.variant;
    return compose(fi, (Lp, Sp) => {
      const P = (w: Who) => (w === 'L' ? Lp : Sp);
      const gL = g.nameGen(Lp.tr), gS = g.nameGen(Sp.tr);
      return {
        tr: {
          has: (w, q) => [g.nameGen(P(w).tr), ' ', q, " TL'si var."],
          rel: (q) => v === 'fewer' ? [gS, ', ', g.nameAbl(Lp.tr), ' ', q, ' TL az parası var.'] : [gL, ', ', g.nameAbl(Sp.tr), ' ', q, ' TL fazla parası var.'],
          ask: (w) => [g.nameGen(P(w).tr), ' ne kadar parası var?'],
          askDiff: v === 'fewer' ? [gS, ', ', g.nameAbl(Lp.tr), ' ne kadar az parası var?']
            : v === 'equalize' ? [Sp.tr, ' ne kadar daha biriktirmeli?']
            : [gL, ', ', g.nameAbl(Sp.tr), ' ne kadar fazla parası var?'],
          eqState: [Sp.tr, ', ', Lp.tr, ' kadar para biriktirmek istiyor.'],
          ans: {
            larger: `${gL} {x} TL'si var.`,
            smaller: `${gS} {x} TL'si var.`,
            difference: v === 'fewer' ? `${gS}, ${g.nameAbl(Lp.tr)} {x} TL az parası var.`
              : v === 'equalize' ? `${Sp.tr} {x} TL daha biriktirmeli.`
              : `${gL}, ${g.nameAbl(Sp.tr)} {x} TL fazla parası var.`,
          },
        },
        // KU-DENETİM
        ku: {
          has: (w, q) => [P(w).kuObl, ' ', q, ' lîre hene.'],
          rel: (q) => v === 'fewer' ? [Sp.kuObl, ' ', q, ' lîre ji ', Lp.kuObl, ' kêmtir hene.'] : [Lp.kuObl, ' ', q, ' lîre ji ', Sp.kuObl, ' zêdetir hene.'],
          ask: (w) => [P(w).kuObl, ' çiqas pere heye?'],
          askDiff: v === 'fewer' ? [Sp.kuObl, ' çiqas pere ji ', Lp.kuObl, ' kêmtir heye?']
            : v === 'equalize' ? [Sp.ku, ' divê çiqas pere din berhev bike?']
            : [Lp.kuObl, ' çiqas pere ji ', Sp.kuObl, ' zêdetir heye?'],
          eqState: [Sp.ku, ' dixwaze qasî ', Lp.kuObl, ' pere berhev bike.'],
          ans: {
            larger: `${Lp.kuObl} {x} lîre hene.`,
            smaller: `${Sp.kuObl} {x} lîre hene.`,
            difference: v === 'fewer' ? `${Sp.kuObl} {x} lîre ji ${Lp.kuObl} kêmtir hene.`
              : v === 'equalize' ? `${Sp.ku} divê {x} lîre din berhev bike.`
              : `${Lp.kuObl} {x} lîre ji ${Sp.kuObl} zêdetir hene.`,
          },
        },
        en: {
          has: (w, q) => [P(w).en, ' has ', q, ' lira.'],
          rel: (q) => v === 'fewer' ? [Sp.en, ' has ', q, ' lira less than ', Lp.en, '.'] : [Lp.en, ' has ', q, ' lira more than ', Sp.en, '.'],
          ask: (w) => ['How much money does ', P(w).en, ' have?'],
          askDiff: v === 'fewer' ? ['How much less money does ', Sp.en, ' have than ', Lp.en, '?']
            : v === 'equalize' ? ['How much more money must ', Sp.en, ' save?']
            : ['How much more money does ', Lp.en, ' have than ', Sp.en, '?'],
          eqState: [Sp.en, ' wants to save as much money as ', Lp.en, '.'],
          ans: {
            larger: `${Lp.en} has {x} lira.`,
            smaller: `${Sp.en} has {x} lira.`,
            difference: v === 'fewer' ? `${Sp.en} has {x} lira less than ${Lp.en}.`
              : v === 'equalize' ? `${Sp.en} must save {x} more lira.`
              : `${Lp.en} has {x} lira more than ${Sp.en}.`,
          },
        },
      };
    });
  },
};

export const COMPARE_FRAMES: Frame[] = [have, did, money];
