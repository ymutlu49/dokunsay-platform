/**
 * Dedektif Soruları (03 §C11 "Kaptanın yaşı"): anlamsız (nonsense) ve eksik bilgili (missingInfo)
 * maddeler. `answer = -1`; `steps` metindeki sayılardan kurulan tuzak halkadır (arayüz çökmesin).
 */
import type { Grade, L10n, Lang, Problem, Role, SchemaId, SchemaStep, SchemaVariant, Sentence } from './types';
import { SCHEMA_ROLES } from './types';
import { mulberry32, deriveSeed, hashStr } from './rng';
import { S, Q, chip } from './text';
import type { Part } from './text';
import { pickPeople, NOUNS } from './lexicon';
import { ROLE_LABEL } from './meta';
import * as g from './grammar/tr';

const LANGS: Lang[] = ['tr', 'ku', 'en'];
const L = (tr: string, ku: string, en: string): L10n => ({ tr, ku, en });

function mkStep(schema: SchemaId, variant: SchemaVariant, unknown: Role, vals: Record<string, number>, unit: L10n): SchemaStep {
  return { schema, variant, unknown, quantities: SCHEMA_ROLES[schema].map((role) => ({ role, value: vals[role], label: { ...ROLE_LABEL[role] }, unit })) };
}

interface Tpl { build(v: number[], names: ReturnType<typeof pickPeople>): { text: Record<Lang, Part[][]>; ask: Record<Lang, Part[]>; step: SchemaStep; unit: L10n } }

const c = (r: Role, v: number, l: Lang) => chip(r, v, l);

// KU-DENETİM: çözülemez madde metinleri.
const NONSENSE: Tpl[] = [
  { build: ([a, b]) => ({
    text: { tr: [['Gemide ', c('part1', a, 'tr'), ' robot ve ', c('part2', b, 'tr'), ' köpek var.']], ku: [['Li ser keştiyê ', c('part1', a, 'ku'), ' robot û ', c('part2', b, 'ku'), ' kûçik hene.']], en: [['There are ', c('part1', a, 'en'), ' robots and ', c('part2', b, 'en'), ' dogs on the ship.']] },
    ask: { tr: ['Kaptan kaç yaşında?'], ku: ['Kaptan çend salî ye?'], en: ['How old is the captain?'] },
    step: mkStep('combine', 'static', 'whole', { part1: a, part2: b, whole: a + b }, L('robot', 'robot', 'robot')), unit: L('yaş', 'sal', 'year'),
  }) },
  { build: ([a, b]) => ({
    text: { tr: [['Otobüste ', c('part1', a, 'tr'), ' kız ve ', c('part2', b, 'tr'), ' erkek öğrenci var.']], ku: [['Di otobusê de ', c('part1', a, 'ku'), ' keç û ', c('part2', b, 'ku'), ' kur hene.']], en: [['There are ', c('part1', a, 'en'), ' girls and ', c('part2', b, 'en'), ' boys on the bus.']] },
    ask: { tr: ['Şoför kaç yaşında?'], ku: ['Şofêr çend salî ye?'], en: ['How old is the driver?'] },
    step: mkStep('combine', 'static', 'whole', { part1: a, part2: b, whole: a + b }, L('öğrenci', 'xwendekar', 'pupil')), unit: L('yaş', 'sal', 'year'),
  }) },
  { build: ([a, b]) => ({
    text: { tr: [['Kütüphanede ', c('part1', a, 'tr'), ' kitap ve ', c('part2', b, 'tr'), ' dergi var.']], ku: [['Li pirtûkxaneyê ', c('part1', a, 'ku'), ' pirtûk û ', c('part2', b, 'ku'), ' kovar hene.']], en: [['The library has ', c('part1', a, 'en'), ' books and ', c('part2', b, 'en'), ' magazines.']] },
    ask: { tr: ['Kütüphaneci kaç numara ayakkabı giyiyor?'], ku: ['Pirtûkxanevan çend hejmar pêlav li xwe dike?'], en: ['What shoe size does the librarian wear?'] },
    step: mkStep('combine', 'static', 'whole', { part1: a, part2: b, whole: a + b }, L('kitap', 'pirtûk', 'book')), unit: L('numara', 'hejmar', 'size'),
  }) },
];

const MISSING: Tpl[] = [
  { build: ([a, b], [A, B]) => {
    const k = NOUNS.kalem;
    return {
      text: {
        tr: [[g.nameGen(A.tr), ' bir miktar kalemi vardı.'], [A.tr, ', ', g.nameDat(B.tr), ' ', c('change', b, 'tr'), ' kalem verdi.']],
        ku: [[A.kuObl, ' hinek pênûs hebûn.'], [A.kuObl, ' ', c('change', b, 'ku'), ' pênûs dan ', B.kuObl, '.']],
        en: [[A.en, ' had some pencils.'], [A.en, ' gave ', B.en, ' ', c('change', b, 'en'), ' pencils.']],
      },
      ask: { tr: [g.nameGen(A.tr), ' kaç kalemi kaldı?'], ku: ['Çend pênûsên ', A.kuObl, ' man?'], en: ['How many pencils does ', A.en, ' have left?'] },
      step: mkStep('change', 'separate', 'result', { start: a + b, change: b, result: a }, { tr: k.tr.w, ku: k.ku.w, en: k.en.sg }), unit: { tr: k.tr.w, ku: k.ku.w, en: k.en.sg },
    };
  } },
  { build: ([a, b]) => ({
    text: { tr: [['Sepette ', c('part1', a, 'tr'), ' elma ve bir miktar armut var.']], ku: [['Di selikê de ', c('part1', a, 'ku'), ' sêv û hinek hirmî hene.']], en: [['There are ', c('part1', a, 'en'), ' apples and some pears in the basket.']] },
    ask: { tr: ['Sepette kaç meyve var?'], ku: ['Di selikê de çend fêkî hene?'], en: ['How many pieces of fruit are in the basket?'] },
    step: mkStep('combine', 'static', 'whole', { part1: a, part2: b, whole: a + b }, L('meyve', 'fêkî', 'piece of fruit')), unit: L('meyve', 'fêkî', 'piece of fruit'),
  }) },
  { build: ([a, b]) => ({
    text: { tr: [['Her tabakta ', c('perGroup', b, 'tr'), ' kurabiye var.']], ku: [['Di her tebaxê de ', c('perGroup', b, 'ku'), ' kulîçe hene.']], en: [['Each plate has ', c('perGroup', b, 'en'), ' biscuits.']] },
    ask: { tr: ['Toplam kaç kurabiye var?'], ku: ['Bi giştî çend kulîçe hene?'], en: ['How many biscuits are there altogether?'] },
    step: mkStep('equalGroups', 'multiply', 'total', { groups: a, perGroup: b, total: a * b }, L('kurabiye', 'kulîçe', 'biscuit')), unit: L('kurabiye', 'kulîçe', 'biscuit'),
  }) },
  { build: ([a, b], [A, B]) => ({
    text: {
      tr: [[g.nameGen(A.tr), ', ', g.nameAbl(B.tr), ' ', c('difference', b, 'tr'), ' fazla misketi var.']],
      ku: [[A.kuObl, ' ', c('difference', b, 'ku'), ' gulok ji ', B.kuObl, ' zêdetir hene.']],
      en: [[A.en, ' has ', c('difference', b, 'en'), ' more marbles than ', B.en, '.']],
    },
    ask: { tr: [g.nameGen(A.tr), ' kaç misketi var?'], ku: [A.kuObl, ' çend gulok hene?'], en: ['How many marbles does ', A.en, ' have?'] },
    step: { ...mkStep('compare', 'more', 'larger', { smaller: a, difference: b, larger: a + b }, L('misket', 'gulok', 'marble')), referent: 'smaller' as Role }, unit: L('misket', 'gulok', 'marble'),
  }) },
];

/** Çözülemez madde üret. 1. sınıfta çarpımsal şablon kullanılmaz. */
export function unsolvableFor(grade: Grade, seed: number, kind?: 'nonsense' | 'missingInfo'): Problem {
  const rng = mulberry32(deriveSeed(seed, 'unsolv'));
  const k = kind ?? (rng.chance(0.5) ? 'nonsense' : 'missingInfo');
  const pool = k === 'nonsense' ? NONSENSE : MISSING.filter((_, i) => grade >= 2 || i !== 2);
  const tpl = rng.pick(pool);
  const max = grade === 1 ? 9 : 40;
  const a = rng.int(3, max), b = rng.int(2, Math.max(3, Math.floor(max / 2)));
  const people = pickPeople(rng, 2);
  const out = tpl.build([a, b === a ? b + 1 : b], people);
  const text = {} as Record<Lang, Sentence[]>;
  for (const l of LANGS) text[l] = [...out.text[l].map((p) => S(...p)), Q(...out.ask[l])];
  return {
    id: `u${hashStr(`${grade}:${seed}:${k}`).toString(36)}`, seed, grade, diff: 3,
    axes: { U: 0, L: 0, N: max <= 10 ? 0 : 2, I: 0, M: 1, P: 0 },
    steps: [out.step], text, extras: [], answer: -1,
    answerSentence: L('Bu soru çözülemez: {x}', 'Ev pirs nayê çareserkirin: {x}', 'This question cannot be solved: {x}'),
    answerUnit: out.unit, context: 'detective', people: people.map((p) => p.tr),
    curriculum: [grade <= 1 ? 'MAT.1.2.1' : grade === 2 ? 'MAT.2.2.1' : grade === 3 ? 'MAT.3.2.6' : 'MAT.4.2.7'],
    targets: ['unsolvableAnswered'], unsolvable: k,
  };
}
