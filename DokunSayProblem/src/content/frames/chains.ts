/**
 * İKİ ADIMLI zincirler (DESIGN §3): M=2 aynı şema, M=3 iki farklı şema.
 * İlk halkanın bilinmeyeni (ara sonuç) metinde yazılmaz; ikinci halkada `links` ile bağlanır.
 * Her adım ayrı cümle (04 §D.2).
 */
import type { Grade, L10n, Lang, Role, SchemaId, SchemaVariant, Segment, Sentence } from '../types';
import type { Part } from '../text';
import { S, Q, chip } from '../text';
import type { Rng } from '../rng';
import type { FrameOut, UnitKind } from './types';
import { L, unitOf } from './types';
import type { Noun, NounKey, Person } from '../lexicon';
import { NOUNS } from '../lexicon';
import * as g from '../grammar/tr';

export interface ChainInput {
  vals: [Record<string, number>, Record<string, number>];
  A: Person; B: Person; C: Person;
  obj: Noun;
  rng: Rng;
  grade: Grade;
}

export interface ChainFrame {
  id: string;
  context: string;
  M: 2 | 3;
  minGrade: Grade;
  unitKind: UnitKind;
  objs: readonly NounKey[];
  schemas: [SchemaId, SchemaId];
  variants: [SchemaVariant, SchemaVariant];
  unknowns: [Role, Role];
  links: Partial<Record<Role, { step: number; role: Role }>>;
  /** Değer üret: cap = sınıf/N üst sınırı. null → yeniden dene. */
  numbers(rng: Rng, cap: number): [Record<string, number>, Record<string, number>] | null;
  render(ci: ChainInput): FrameOut;
}

const LANGS: Lang[] = ['tr', 'ku', 'en'];
const lo = (cap: number) => (cap <= 20 ? 2 : cap <= 100 ? 3 : 12);
const distinct = (xs: number[]) => new Set(xs).size === xs.length && xs.every((x) => x >= 2);

type Mk = (lang: Lang) => (step: 0 | 1, r: Role, fmt?: (n: number) => string) => Segment;
const mkChips = (ci: ChainInput): Mk => (lang) => (step, r, fmt) =>
  chip(r, ci.vals[step][r], lang, { step, text: fmt ? fmt(ci.vals[step][r]) : undefined });

function assemble(ci: ChainInput, build: (lang: Lang, c: ReturnType<Mk>) => { s: Part[][]; q: Part[]; ans: string }, unit: L10n): FrameOut {
  const text = {} as Record<Lang, Sentence[]>;
  const answer = {} as L10n;
  const mk = mkChips(ci);
  for (const lang of LANGS) {
    const r = build(lang, mk(lang));
    text[lang] = [...r.s.map((p) => S(...p)), Q(...r.q)];
    answer[lang] = r.ans;
  }
  return { text, answer, unit };
}

/** a + b = m ; m − c = r (değişim → değişim). */
const joinSep = (rng: Rng, cap: number) => {
  for (let i = 0; i < 200; i++) {
    const m = rng.int(lo(cap) * 3, cap);
    const a = rng.int(lo(cap), m - lo(cap));
    const b = m - a;
    const c = rng.int(lo(cap), m - lo(cap));
    const r = m - c;
    if (distinct([a, b, c, r]) && m !== r) return [{ start: a, change: b, result: m }, { start: m, change: c, result: r }] as [Record<string, number>, Record<string, number>];
  }
  return null;
};

const bus2: ChainFrame = {
  id: 'chain.bus', context: 'bus', M: 2, minGrade: 2, unitKind: 'count', objs: ['yolcu'],
  schemas: ['change', 'change'], variants: ['join', 'separate'], unknowns: ['result', 'result'],
  links: { start: { step: 0, role: 'result' } },
  numbers: joinSep,
  render(ci) {
    return assemble(ci, (lang, c) => {
      if (lang === 'tr') return { s: [['Otobüste ', c(0, 'start'), ' yolcu vardı.'], ['İlk durakta ', c(0, 'change'), ' yolcu bindi.'], ['Sonraki durakta ', c(1, 'change'), ' yolcu indi.']], q: ['Otobüste kaç yolcu kaldı?'], ans: 'Otobüste {x} yolcu kaldı.' };
      // KU-DENETİM
      if (lang === 'ku') return { s: [['Di otobusê de ', c(0, 'start'), ' rêwî hebûn.'], ['Li rawestgeha yekem ', c(0, 'change'), ' rêwî siwar bûn.'], ['Li rawestgeha din ', c(1, 'change'), ' rêwî peya bûn.']], q: ['Çend rêwî di otobusê de man?'], ans: '{x} rêwî di otobusê de man.' };
      return { s: [['There were ', c(0, 'start'), ' passengers on the bus.'], ['At the first stop, ', c(0, 'change'), ' passengers got on.'], ['At the next stop, ', c(1, 'change'), ' passengers got off.']], q: ['How many passengers are left on the bus?'], ans: '{x} passengers are left on the bus.' };
    }, unitOf(ci.obj));
  },
};

const money2: ChainFrame = {
  id: 'chain.money', context: 'money', M: 2, minGrade: 2, unitKind: 'money', objs: ['tl'],
  schemas: ['change', 'change'], variants: ['join', 'separate'], unknowns: ['result', 'result'],
  links: { start: { step: 0, role: 'result' } },
  numbers: joinSep,
  render(ci) {
    const A = ci.A, gA = g.nameGen(A.tr);
    return assemble(ci, (lang, c) => {
      if (lang === 'tr') return { s: [[gA, ' ', c(0, 'start'), " TL'si vardı."], [A.tr, ' bayramda ', c(0, 'change'), ' TL harçlık aldı.'], ['Sonra ', c(1, 'change'), ' TL harcadı.']], q: [gA, ' ne kadar parası kaldı?'], ans: `${gA} {x} TL'si kaldı.` };
      // KU-DENETİM
      if (lang === 'ku') return { s: [[A.kuObl, ' ', c(0, 'start'), ' lîre hebûn.'], ['Di cejnê de ', A.kuObl, ' ', c(0, 'change'), ' lîre wergirtin.'], ['Paşê ', A.kuObl, ' ', c(1, 'change'), ' lîre xerc kirin.']], q: [A.kuObl, ' çiqas pere ma?'], ans: `{x} lîreyên ${A.kuObl} man.` };
      return { s: [[A.en, ' had ', c(0, 'start'), ' lira.'], [A.en, ' got ', c(0, 'change'), ' lira of holiday money.'], ['Then ', A.en, ' spent ', c(1, 'change'), ' lira.']], q: ['How much money does ', A.en, ' have left?'], ans: `${A.en} has {x} lira left.` };
    }, unitOf(ci.obj));
  },
};

/** B = A + b ; C = B − c (karşılaştırma → karşılaştırma, üç kişi). */
const compare2: ChainFrame = {
  id: 'chain.compare', context: 'play', M: 2, minGrade: 2, unitKind: 'count', objs: ['kart', 'misket', 'ceviz', 'kalem'],
  schemas: ['compare', 'compare'], variants: ['more', 'fewer'], unknowns: ['larger', 'smaller'],
  links: { larger: { step: 0, role: 'larger' } },
  numbers(rng, cap) {
    const r = joinSep(rng, cap);
    if (!r) return null;
    const [x, y] = r;
    return [{ smaller: x.start, difference: x.change, larger: x.result }, { larger: y.start, difference: y.change, smaller: y.result }];
  },
  render(ci) {
    const { A, B, C } = ci;
    const o = ci.obj;
    const oP = g.poss3(o.tr);
    return assemble(ci, (lang, c) => {
      if (lang === 'tr') return { s: [[g.nameGen(A.tr), ' ', c(0, 'smaller'), ' ', oP, ' var.'], [g.nameGen(B.tr), ', ', g.nameAbl(A.tr), ' ', c(0, 'difference'), ' fazla ', oP, ' var.'], [g.nameGen(C.tr), ', ', g.nameAbl(B.tr), ' ', c(1, 'difference'), ' az ', oP, ' var.']], q: [g.nameGen(C.tr), ' kaç ', oP, ' var?'], ans: `${g.nameGen(C.tr)} {x} ${oP} var.` };
      // KU-DENETİM
      if (lang === 'ku') return { s: [[A.kuObl, ' ', c(0, 'smaller'), ' ', o.ku.w, ' hene.'], [B.kuObl, ' ', c(0, 'difference'), ' ', o.ku.w, ' ji ', A.kuObl, ' zêdetir hene.'], [C.kuObl, ' ', c(1, 'difference'), ' ', o.ku.w, ' ji ', B.kuObl, ' kêmtir hene.']], q: [C.kuObl, ' çend ', o.ku.w, ' hene?'], ans: `${C.kuObl} {x} ${o.ku.w} hene.` };
      return { s: [[A.en, ' has ', c(0, 'smaller'), ' ', o.en.pl, '.'], [B.en, ' has ', c(0, 'difference'), ' more ', o.en.pl, ' than ', A.en, '.'], [C.en, ' has ', c(1, 'difference'), ' fewer ', o.en.pl, ' than ', B.en, '.']], q: ['How many ', o.en.pl, ' does ', C.en, ' have?'], ans: `${C.en} has {x} ${o.en.pl}.` };
    }, unitOf(o));
  },
};

/** B = A + b ; A + B = ? (karşılaştırma → parça-bütün). */
const cmpCombine: ChainFrame = {
  id: 'chain.compareCombine', context: 'play', M: 3, minGrade: 2, unitKind: 'count', objs: ['kart', 'misket', 'ceviz', 'kalem', 'kitap'],
  schemas: ['compare', 'combine'], variants: ['more', 'static'], unknowns: ['larger', 'whole'],
  links: { part1: { step: 0, role: 'smaller' }, part2: { step: 0, role: 'larger' } },
  numbers(rng, cap) {
    for (let i = 0; i < 200; i++) {
      const a = rng.int(lo(cap), Math.floor(cap / 3));
      const b = rng.int(lo(cap), Math.floor(cap / 3));
      const B = a + b, w = a + B;
      if (w <= cap && distinct([a, b, B, w])) return [{ smaller: a, difference: b, larger: B }, { part1: a, part2: B, whole: w }];
    }
    return null;
  },
  render(ci) {
    const { A, B } = ci;
    const o = ci.obj;
    const oP = g.poss3(o.tr);
    return assemble(ci, (lang, c) => {
      if (lang === 'tr') return { s: [[g.nameGen(A.tr), ' ', c(0, 'smaller'), ' ', oP, ' var.'], [g.nameGen(B.tr), ', ', g.nameAbl(A.tr), ' ', c(0, 'difference'), ' fazla ', oP, ' var.']], q: ['İkisinin toplam kaç ', oP, ' var?'], ans: `İkisinin toplam {x} ${oP} var.` };
      // KU-DENETİM
      if (lang === 'ku') return { s: [[A.kuObl, ' ', c(0, 'smaller'), ' ', o.ku.w, ' hene.'], [B.kuObl, ' ', c(0, 'difference'), ' ', o.ku.w, ' ji ', A.kuObl, ' zêdetir hene.']], q: ['Bi giştî çend ', o.ku.ez, ' her duyan hene?'], ans: `Bi giştî {x} ${o.ku.ez} her duyan hene.` };
      return { s: [[A.en, ' has ', c(0, 'smaller'), ' ', o.en.pl, '.'], [B.en, ' has ', c(0, 'difference'), ' more ', o.en.pl, ' than ', A.en, '.']], q: ['How many ', o.en.pl, ' do they have altogether?'], ans: `They have {x} ${o.en.pl} altogether.` };
    }, unitOf(o));
  },
};

/** a + b = m ; m − c = ? (parça-bütün → değişim). */
const combineChange: ChainFrame = {
  id: 'chain.combineChange', context: 'play', M: 3, minGrade: 2, unitKind: 'count', objs: ['balon'],
  schemas: ['combine', 'change'], variants: ['static', 'separate'], unknowns: ['whole', 'result'],
  links: { start: { step: 0, role: 'whole' } },
  numbers(rng, cap) {
    const r = joinSep(rng, cap);
    if (!r) return null;
    const [x, y] = r;
    return [{ part1: x.start, part2: x.change, whole: x.result }, y];
  },
  render(ci) {
    const { A } = ci;
    const gA = g.nameGen(A.tr);
    return assemble(ci, (lang, c) => {
      if (lang === 'tr') return { s: [[gA, ' ', c(0, 'part1'), ' kırmızı balonu vardı.'], [gA, ' ', c(0, 'part2'), ' mavi balonu vardı.'], [c(1, 'change'), ' balon patladı.']], q: [gA, ' kaç balonu kaldı?'], ans: `${gA} {x} balonu kaldı.` };
      // KU-DENETİM
      if (lang === 'ku') return { s: [[A.kuObl, ' ', c(0, 'part1'), ' balonên sor hebûn.'], [A.kuObl, ' ', c(0, 'part2'), ' balonên şîn hebûn.'], [c(1, 'change'), ' balon teqiyan.']], q: ['Çend balonên ', A.kuObl, ' man?'], ans: `{x} balonên ${A.kuObl} man.` };
      return { s: [[A.en, ' had ', c(0, 'part1'), ' red balloons.'], [A.en, ' had ', c(0, 'part2'), ' blue balloons.'], [c(1, 'change'), ' balloons popped.']], q: ['How many balloons does ', A.en, ' have left?'], ans: `${A.en} has {x} balloons left.` };
    }, unitOf(ci.obj));
  },
};

/** g × p = m ; m − c = ? (eşit gruplar → değişim) — 3. sınıftan. */
const groupsChange: ChainFrame = {
  id: 'chain.groupsChange', context: 'school', M: 3, minGrade: 3, unitKind: 'count', objs: ['kalem', 'kart', 'ceviz'],
  schemas: ['equalGroups', 'change'], variants: ['multiply', 'separate'], unknowns: ['total', 'result'],
  links: { start: { step: 0, role: 'total' } },
  numbers(rng, cap) {
    for (let i = 0; i < 200; i++) {
      const gg = rng.int(2, 9), p = rng.int(2, 10), m = gg * p;
      const c = rng.int(2, m - 2), r = m - c;
      if (m <= cap && distinct([gg, p, c, r]) && m !== c && m !== r) return [{ groups: gg, perGroup: p, total: m }, { start: m, change: c, result: r }];
    }
    return null;
  },
  render(ci) {
    const { A } = ci;
    const o = ci.obj;
    const gA = g.nameGen(A.tr);
    const pk = NOUNS.paket;
    return assemble(ci, (lang, c) => {
      if (lang === 'tr') return { s: [[A.tr, ' ', c(0, 'groups'), ' paket ', o.tr.w, ' aldı.'], ['Her pakette ', c(0, 'perGroup'), ' ', o.tr.w, ' var.'], [A.tr, ', arkadaşlarına ', c(1, 'change'), ' ', o.tr.w, ' verdi.']], q: [gA, ' kaç ', g.poss3(o.tr), ' kaldı?'], ans: `${gA} {x} ${g.poss3(o.tr)} kaldı.` };
      // KU-DENETİM
      if (lang === 'ku') return { s: [[A.kuObl, ' ', c(0, 'groups'), ' ', pk.ku.w, ' ', o.ku.w, ' kirîn.'], ['Di her pakêtê de ', c(0, 'perGroup'), ' ', o.ku.w, ' hene.'], [A.kuObl, ' ', c(1, 'change'), ' ', o.ku.w, ' dan hevalên xwe.']], q: ['Çend ', o.ku.ez, ' ', A.kuObl, ' man?'], ans: `{x} ${o.ku.ez} ${A.kuObl} man.` };
      return { s: [[A.en, ' bought ', c(0, 'groups'), ' packets of ', o.en.pl, '.'], ['Each packet has ', c(0, 'perGroup'), ' ', o.en.pl, '.'], [A.en, ' gave ', c(1, 'change'), ' ', o.en.pl, ' to friends.']], q: ['How many ', o.en.pl, ' does ', A.en, ' have left?'], ans: `${A.en} has {x} ${o.en.pl} left.` };
    }, unitOf(o));
  },
};

/** g × p = m ; m × n = ? (eşit gruplar → eşit gruplar) — 3. sınıftan. */
const groups2: ChainFrame = {
  id: 'chain.groups', context: 'school', M: 2, minGrade: 3, unitKind: 'count', objs: ['kalem', 'kart'],
  schemas: ['equalGroups', 'equalGroups'], variants: ['multiply', 'multiply'], unknowns: ['total', 'total'],
  links: { groups: { step: 0, role: 'total' } },
  numbers(rng, cap) {
    for (let i = 0; i < 200; i++) {
      const a = rng.int(2, 6), b = rng.int(2, 6), n = rng.int(2, 10), m = a * b, t = m * n;
      if (t <= cap && distinct([a, b, n, t]) && m !== n && m !== a && m !== b) return [{ groups: a, perGroup: b, total: m }, { groups: m, perGroup: n, total: t }];
    }
    return null;
  },
  render(ci) {
    const o = ci.obj;
    return assemble(ci, (lang, c) => {
      if (lang === 'tr') return { s: [['Rafta ', c(0, 'groups'), ' kutu var.'], ['Her kutuda ', c(0, 'perGroup'), ' paket var.'], ['Her pakette ', c(1, 'perGroup'), ' ', o.tr.w, ' var.']], q: ['Rafta toplam kaç ', o.tr.w, ' var?'], ans: `Rafta toplam {x} ${o.tr.w} var.` };
      // KU-DENETİM
      if (lang === 'ku') return { s: [['Li ser refê ', c(0, 'groups'), ' qutî hene.'], ['Di her qutiyê de ', c(0, 'perGroup'), ' pakêt hene.'], ['Di her pakêtê de ', c(1, 'perGroup'), ' ', o.ku.w, ' hene.']], q: ['Li ser refê bi giştî çend ', o.ku.w, ' hene?'], ans: `Li ser refê bi giştî {x} ${o.ku.w} hene.` };
      return { s: [['There are ', c(0, 'groups'), ' boxes on the shelf.'], ['Each box has ', c(0, 'perGroup'), ' packets.'], ['Each packet has ', c(1, 'perGroup'), ' ', o.en.pl, '.']], q: ['How many ', o.en.pl, ' are on the shelf altogether?'], ans: `There are {x} ${o.en.pl} on the shelf altogether.` };
    }, unitOf(o));
  },
};

export const CHAIN_FRAMES: ChainFrame[] = [bus2, money2, compare2, cmpCombine, combineChange, groupsChange, groups2];
export const chainLabel = (): L10n => L('ara sonuç', 'encama navîn', 'middle result');
