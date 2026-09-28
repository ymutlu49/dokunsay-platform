/**
 * TABLO kaynaklı problemler (axes.P=1; 02 §B3 X.TABLE): fiyat listesi. Metinde "Fiyat listesine bak."
 * cümlesi; gerekli fiyatlar tabloda (ref = rol), kullanılmayan satırlar gereksiz bilgi (extraN).
 * Para bağlamı 2. sınıftan (04 §C.1).
 */
import type { L10n, Lang, ProblemTable, Role, SchemaId, SchemaVariant, Sentence } from '../types';
import type { Part } from '../text';
import { S, Q, chip } from '../text';
import type { Rng } from '../rng';
import type { FrameOut } from './types';
import { L, unitOf } from './types';
import type { NounKey, Person } from '../lexicon';
import { NOUNS } from '../lexicon';
import * as g from '../grammar/tr';

export interface TableBuild {
  vals: Record<string, number>;
  table: ProblemTable;
  extras: { id: `extra${number}`; value: number; label: L10n }[];
  out: FrameOut;
}
export interface TableFrame {
  id: string;
  schema: SchemaId;
  variant: SchemaVariant;
  unknown: Role;
  build(rng: Rng, cap: number, A: Person, grade: number): TableBuild | null;
}

const ITEMS: NounKey[] = ['simit', 'defter', 'kalem', 'top', 'kitap'];
const TITLE = L('Fiyat listesi', 'Lîsteya bihayan', 'Price list');
const TL = unitOf(NOUNS.tl);
const LANGS: Lang[] = ['tr', 'ku', 'en'];
const LOOK: Record<Lang, string> = { tr: 'Fiyat listesine bak.', ku: 'Li lîsteya bihayan binêre.', en: 'Look at the price list.' };

function prices(rng: Rng, cap: number, n: number): number[] {
  const out: number[] = [];
  const [lo, hi, st] = cap <= 20 ? [2, 9, 1] : cap <= 100 ? [5, 45, 5] : [20, 150, 5];
  for (let i = 0; i < 100 && out.length < n; i++) {
    const p = Math.round(rng.int(lo, hi) / st) * st;
    if (p >= 2 && !out.includes(p)) out.push(p);
  }
  return out;
}

function mkTable(items: NounKey[], vals: number[], refs: (Role | `extra${number}`)[]): ProblemTable {
  return {
    title: TITLE,
    rows: items.map((k, i) => ({ label: unitOf(NOUNS[k]), value: vals[i], unit: TL, ref: refs[i] })),
  };
}

function finish(sents: Record<Lang, Part[][]>, ask: Record<Lang, Part[]>, answer: L10n, unit: L10n): FrameOut {
  const text = {} as Record<Lang, Sentence[]>;
  for (const lang of LANGS) text[lang] = [S(LOOK[lang]), ...sents[lang].map((p) => S(...p)), Q(...ask[lang])];
  return { text, answer, unit };
}

const combine: TableFrame = {
  id: 'table.combine', schema: 'combine', variant: 'static', unknown: 'whole',
  build(rng, cap, A) {
    const items = rng.shuffle(ITEMS).slice(0, 3);
    const p = prices(rng, Math.floor(cap / 2), 3);
    if (p.length < 3 || p[0] + p[1] > cap) return null;
    const [a, b] = [NOUNS[items[0]], NOUNS[items[1]]];
    const out = finish(
      {
        tr: [[A.tr, ' bir ', a.tr.w, ' ve bir ', b.tr.w, ' aldı.']],
        ku: [[A.kuObl, ' ', a.ku.w, 'ek û ', b.ku.w, 'ek kirîn.']], // KU-DENETİM
        en: [[A.en, ' bought a ', a.en.sg, ' and a ', b.en.sg, '.']],
      },
      { tr: [A.tr, ' ne kadar para ödedi?'], ku: [A.kuObl, ' çiqas pere da?'], en: ['How much did ', A.en, ' pay?'] },
      { tr: `${A.tr} {x} TL ödedi.`, ku: `${A.kuObl} {x} lîre dan.`, en: `${A.en} paid {x} lira.` },
      TL,
    );
    out.labels = { part1: unitOf(a), part2: unitOf(b), whole: L('ödenen', 'pereyê hat dayîn', 'paid') };
    return {
      vals: { part1: p[0], part2: p[1], whole: p[0] + p[1] },
      table: mkTable(items, p, ['part1', 'part2', 'extra0']),
      extras: [{ id: 'extra0', value: p[2], label: unitOf(NOUNS[items[2]]) }],
      out,
    };
  },
};

const change: TableFrame = {
  id: 'table.change', schema: 'change', variant: 'separate', unknown: 'result',
  build(rng, cap, A) {
    const items = rng.shuffle(ITEMS).slice(0, 3);
    const p = prices(rng, Math.floor(cap * 0.7), 3);
    if (p.length < 3) return null;
    const step = cap <= 20 ? 1 : 5;
    let start = 0;
    for (let i = 0; i < 50; i++) {
      start = Math.round(rng.int(p[0] + 2, cap) / step) * step;
      if (start - p[0] >= 2 && start <= cap && !p.includes(start) && start - p[0] !== p[0]) break;
      start = 0;
    }
    if (!start) return null;
    const a = NOUNS[items[0]];
    const gA = g.nameGen(A.tr);
    const out = finish(
      {
        tr: [[gA, ' ', chip('start', start, 'tr'), " TL'si var."], [A.tr, ' bir ', a.tr.w, ' aldı.']],
        ku: [[A.kuObl, ' ', chip('start', start, 'ku'), ' lîre hene.'], [A.kuObl, ' ', a.ku.w, 'ek kirî.']], // KU-DENETİM
        en: [[A.en, ' has ', chip('start', start, 'en'), ' lira.'], [A.en, ' bought a ', a.en.sg, '.']],
      },
      { tr: [gA, ' ne kadar parası kaldı?'], ku: [A.kuObl, ' çiqas pere ma?'], en: ['How much money does ', A.en, ' have left?'] },
      { tr: `${gA} {x} TL'si kaldı.`, ku: `{x} lîreyên ${A.kuObl} man.`, en: `${A.en} has {x} lira left.` },
      TL,
    );
    out.labels = { start: L('başta', 'destpêk', 'at the start'), change: unitOf(a), result: L('kalan', 'yê ma', 'left') };
    return {
      vals: { start, change: p[0], result: start - p[0] },
      table: mkTable(items, p, ['change', 'extra0', 'extra1']),
      extras: [
        { id: 'extra0', value: p[1], label: unitOf(NOUNS[items[1]]) },
        { id: 'extra1', value: p[2], label: unitOf(NOUNS[items[2]]) },
      ],
      out,
    };
  },
};

const compare: TableFrame = {
  id: 'table.compare', schema: 'compare', variant: 'more', unknown: 'difference',
  build(rng, cap) {
    const items = rng.shuffle(ITEMS).slice(0, 3);
    const p = prices(rng, cap, 3);
    if (p.length < 3) return null;
    const [hiI, loI] = p[0] > p[1] ? [0, 1] : [1, 0];
    const d = p[hiI] - p[loI];
    if (d < 2 || d === p[loI] || p.includes(d)) return null;
    const hi = NOUNS[items[hiI]], lo = NOUNS[items[loI]];
    const out = finish(
      { tr: [], ku: [], en: [] },
      {
        tr: ['Bir ', hi.tr.w, ', bir ', g.abl(lo.tr), ' ne kadar pahalı?'],
        ku: [hi.ku.w, 'ek çiqas ji ', lo.ku.w, 'ekê bihatir e?'], // KU-DENETİM
        en: ['How much more does a ', hi.en.sg, ' cost than a ', lo.en.sg, '?'],
      },
      {
        tr: `Bir ${hi.tr.w}, bir ${g.abl(lo.tr)} {x} TL pahalı.`,
        ku: `${hi.ku.w}ek {x} lîre ji ${lo.ku.w}ekê bihatir e.`,
        en: `A ${hi.en.sg} costs {x} lira more than a ${lo.en.sg}.`,
      },
      TL,
    );
    out.labels = { larger: unitOf(hi), smaller: unitOf(lo), difference: L('fark', 'kemok', 'difference') };
    const refs: (Role | `extra${number}`)[] = ['extra0', 'extra0', 'extra0'];
    refs[hiI] = 'larger';
    refs[loI] = 'smaller';
    return {
      vals: { larger: p[hiI], smaller: p[loI], difference: d },
      table: mkTable(items, p, refs),
      extras: [{ id: 'extra0', value: p[2], label: unitOf(NOUNS[items[2]]) }],
      out,
    };
  },
};

const groups: TableFrame = {
  id: 'table.groups', schema: 'equalGroups', variant: 'multiply', unknown: 'total',
  build(rng, cap, A, grade) {
    const items = rng.shuffle(ITEMS).slice(0, 3);
    const n = rng.int(2, grade <= 2 ? 5 : 9);
    const p = prices(rng, grade <= 2 ? 10 : Math.min(100, Math.floor(cap / n)), 3);
    if (p.length < 3 || p.includes(n) || p[0] * n > cap || p[0] * n === p[1] || p[0] * n === p[2]) return null;
    if (grade <= 2 && p[0] > 10) return null;
    const a = NOUNS[items[0]];
    const out = finish(
      {
        tr: [[A.tr, ' ', chip('groups', n, 'tr'), ' ', a.tr.w, ' aldı.']],
        ku: [[A.kuObl, ' ', chip('groups', n, 'ku'), ' ', a.ku.w, ' kirîn.']], // KU-DENETİM
        en: [[A.en, ' bought ', chip('groups', n, 'en'), ' ', a.en.pl, '.']],
      },
      { tr: [A.tr, ' ne kadar para ödedi?'], ku: [A.kuObl, ' çiqas pere da?'], en: ['How much did ', A.en, ' pay?'] },
      { tr: `${A.tr} {x} TL ödedi.`, ku: `${A.kuObl} {x} lîre dan.`, en: `${A.en} paid {x} lira.` },
      TL,
    );
    out.labels = { groups: L(`${a.tr.w} sayısı`, `hejmara ${a.ku.w}`, `number of ${a.en.pl}`), perGroup: unitOf(a), total: L('ödenen', 'pereyê hat dayîn', 'paid') };
    return {
      vals: { groups: n, perGroup: p[0], total: n * p[0] },
      table: mkTable(items, p, ['perGroup', 'extra0', 'extra1']),
      extras: [
        { id: 'extra0', value: p[1], label: unitOf(NOUNS[items[1]]) },
        { id: 'extra1', value: p[2], label: unitOf(NOUNS[items[2]]) },
      ],
      out,
    };
  },
};

export const TABLE_FRAMES: TableFrame[] = [combine, change, compare, groups];
