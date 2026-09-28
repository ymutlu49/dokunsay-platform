/**
 * GEÇİCİ elle yazılmış problemler — içerik motoru (`src/content/**`) hazır olana kadar
 * arayüzün derlenip sınanabilmesi için. `src/dev/contentStub.ts` bunları kullanır.
 * Metinler Türkçe yazım kılavuzuna (04 §D) uygun yazılmaya çalışıldı; Kurmancî satırlar
 * ana dil denetimi bekler (// KU-DENETİM). Eksi U+2212, çarpı ×, bölü ÷.
 */
import type { L10n, Problem, Segment, Sentence, Quantity, Role, ParaphraseItem } from '../content/types';

const L = (tr: string, ku: string, en: string): L10n => ({ tr, ku, en });
const T = (text: string): Segment => ({ kind: 'text', text });
const Q = (ref: Role | `extra${number}`, text: string, speak?: string): Segment =>
  speak ? { kind: 'qty', ref, text, speak } : { kind: 'qty', ref, text };
const S = (...segments: Segment[]): Sentence => ({ segments });
const SQ = (...segments: Segment[]): Sentence => ({ segments, isQuestion: true });
const q = (role: Role, value: number, label: L10n, unit: L10n): Quantity => ({ role, value, label, unit });

const PENCIL = L('kalem', 'pênûs', 'pencil');
const APPLE = L('elma', 'sêv', 'apple');
const STUDENT = L('öğrenci', 'xwendekar', 'student');
const STICKER = L('çıkartma', 'stîker', 'sticker');
const WALNUT = L('ceviz', 'gûz', 'walnut');
const BUS = L('minibüs', 'mînîbûs', 'minibus');
const BOOK = L('kitap', 'pirtûk', 'book');
const LIRA = L('lira', 'lîre', 'lira');

const base = {
  diff: 2 as const,
  extras: [],
  context: 'daily',
  curriculum: [] as string[],
  targets: [] as string[],
};

export const FIXTURES: Problem[] = [
  // 1 — Değişim / birleştirme, sonuç bilinmiyor (1. sınıf, ≤10)
  {
    ...base,
    id: 'fx-change-join-1',
    seed: 1,
    grade: 1,
    diff: 1,
    axes: { U: 0, L: 0, N: 0, I: 0, M: 1, P: 0 },
    steps: [
      {
        schema: 'change',
        variant: 'join',
        unknown: 'result',
        quantities: [
          q('start', 5, L('başta', 'di destpêkê de', 'at first'), PENCIL),
          q('change', 3, L('annesinin verdiği', 'yên ku diya wê dan', 'mother gave'), PENCIL),
          q('result', 8, L('şimdi', 'niha', 'now'), PENCIL),
        ],
      },
    ],
    text: {
      tr: [
        S(T("Ela'nın "), Q('start', '5'), T(' kalemi var.')),
        S(T('Annesi ona '), Q('change', '3'), T(' kalem daha verdi.')),
        SQ(T("Ela'nın şimdi kaç kalemi var?")),
      ],
      ku: [
        // KU-DENETİM
        S(Q('start', '5'), T(' pênûsên Elayê hene.')),
        S(T('Diya wê '), Q('change', '3'), T(' pênûsên din dan wê.')),
        SQ(T('Niha çend pênûsên Elayê hene?')),
      ],
      en: [
        S(T('Ela has '), Q('start', '5'), T(' pencils.')),
        S(T('Her mother gives her '), Q('change', '3'), T(' more pencils.')),
        SQ(T('How many pencils does Ela have now?')),
      ],
    },
    answer: 8,
    answerSentence: L("Ela'nın şimdi {x} kalemi var.", 'Niha {x} pênûsên Elayê hene.', 'Ela has {x} pencils now.'),
    answerUnit: PENCIL,
    people: ['Ela'],
    curriculum: ['MAT.1.1.6'],
  },

  // 2 — Değişim / ayırma, başlangıç bilinmiyor (2. sınıf, ≤20)
  {
    ...base,
    id: 'fx-change-sep-start',
    seed: 2,
    grade: 2,
    diff: 3,
    axes: { U: 2, L: 0, N: 1, I: 0, M: 1, P: 0 },
    steps: [
      {
        schema: 'change',
        variant: 'separate',
        unknown: 'start',
        quantities: [
          q('start', 13, L('başta', 'di destpêkê de', 'at first'), APPLE),
          q('change', 4, L('verdiği', 'yên ku da', 'gave away'), APPLE),
          q('result', 9, L('şimdi', 'niha', 'now'), APPLE),
        ],
      },
    ],
    text: {
      tr: [
        S(T("Can'ın bir miktar elması vardı.")),
        S(T('Arkadaşına '), Q('change', '4'), T(' elma verdi.')),
        S(T('Şimdi '), Q('result', '9'), T(' elması var.')),
        SQ(T("Can'ın başta kaç elması vardı?")),
      ],
      ku: [
        // KU-DENETİM
        S(T('Hin sêvên Can hebûn.')),
        S(T('Wî '), Q('change', '4'), T(' sêv dan hevalê xwe.')),
        S(T('Niha '), Q('result', '9'), T(' sêvên wî hene.')),
        SQ(T('Di destpêkê de çend sêvên Can hebûn?')),
      ],
      en: [
        S(T('Can had some apples.')),
        S(T('He gave '), Q('change', '4'), T(' apples to his friend.')),
        S(T('Now he has '), Q('result', '9'), T(' apples.')),
        SQ(T('How many apples did Can have at first?')),
      ],
    },
    answer: 13,
    answerSentence: L("Can'ın başta {x} elması vardı.", 'Di destpêkê de {x} sêvên Can hebûn.', 'Can had {x} apples at first.'),
    answerUnit: APPLE,
    people: ['Can'],
    targets: ['textOrderOp'],
  },

  // 3 — Parça-Bütün, parça bilinmiyor, bir gereksiz sayı (2. sınıf)
  {
    ...base,
    id: 'fx-combine-part-extra',
    seed: 3,
    grade: 2,
    axes: { U: 1, L: 0, N: 1, I: 1, M: 1, P: 0 },
    steps: [
      {
        schema: 'combine',
        variant: 'static',
        unknown: 'part2',
        quantities: [
          q('part1', 6, L('kızlar', 'keç', 'girls'), STUDENT),
          q('part2', 8, L('erkekler', 'kur', 'boys'), STUDENT),
          q('whole', 14, L('sınıftaki herkes', 'hemû yên polê', 'whole class'), STUDENT),
        ],
      },
    ],
    extras: [{ id: 'extra1', value: 3, unit: L('pencere', 'pencere', 'window'), label: L('pencereler', 'pencere', 'windows') }],
    text: {
      tr: [
        S(T('Sınıfta '), Q('whole', '14'), T(' öğrenci var.')),
        S(T('Bunların '), Q('part1', "6'sı", 'altısı'), T(' kız.')),
        S(T('Sınıfın '), Q('extra1', '3'), T(' penceresi var.')),
        SQ(T('Sınıfta kaç erkek öğrenci var?')),
      ],
      ku: [
        // KU-DENETİM
        S(T('Di polê de '), Q('whole', '14'), T(' xwendekar hene.')),
        S(Q('part1', '6'), T(' ji wan keç in.')),
        S(T('Pola '), Q('extra1', '3'), T(' pencereyên wê hene.')),
        SQ(T('Di polê de çend xwendekarên kur hene?')),
      ],
      en: [
        S(T('There are '), Q('whole', '14'), T(' students in the class.')),
        S(Q('part1', '6'), T(' of them are girls.')),
        S(T('The class has '), Q('extra1', '3'), T(' windows.')),
        SQ(T('How many boys are in the class?')),
      ],
    },
    answer: 8,
    answerSentence: L('Sınıfta {x} erkek öğrenci var.', 'Di polê de {x} xwendekarên kur hene.', 'There are {x} boys in the class.'),
    answerUnit: STUDENT,
    people: [],
    targets: ['irrelevantUsed'],
  },

  // 4 — Karşılaştırma / fazla, TUTARSIZ dil, küçük bilinmiyor (2. sınıf)
  {
    ...base,
    id: 'fx-compare-more-inconsistent',
    seed: 4,
    grade: 2,
    diff: 3,
    axes: { U: 2, L: 1, N: 1, I: 0, M: 1, P: 0 },
    steps: [
      {
        schema: 'compare',
        variant: 'more',
        unknown: 'smaller',
        referent: 'smaller',
        quantities: [
          q('larger', 12, L("Zeynep'in", 'yên Zeynepê', "Zeynep's"), STICKER),
          q('smaller', 7, L("Mert'in", 'yên Mert', "Mert's"), STICKER),
          q('difference', 5, L('fark', 'kemok', 'difference'), STICKER),
        ],
      },
    ],
    text: {
      tr: [
        S(T("Zeynep'in "), Q('larger', '12'), T(' çıkartması var.')),
        S(T("Zeynep'in çıkartmaları Mert'inkinden "), Q('difference', '5'), T(' fazla.')),
        SQ(T("Mert'in kaç çıkartması var?")),
      ],
      ku: [
        // KU-DENETİM
        S(Q('larger', '12'), T(' stîkerên Zeynepê hene.')),
        S(T('Stîkerên Zeynepê ji yên Mert '), Q('difference', '5'), T(' zêdetir in.')),
        SQ(T('Çend stîkerên Mert hene?')),
      ],
      en: [
        S(T('Zeynep has '), Q('larger', '12'), T(' stickers.')),
        S(T('Zeynep has '), Q('difference', '5'), T(' more stickers than Mert.')),
        SQ(T('How many stickers does Mert have?')),
      ],
    },
    answer: 7,
    answerSentence: L("Mert'in {x} çıkartması var.", '{x} stîkerên Mert hene.', 'Mert has {x} stickers.'),
    answerUnit: STICKER,
    people: ['Zeynep', 'Mert'],
    targets: ['reversal'],
  },

  // 5 — Eşit Gruplar / paylaştırma (3. sınıf)
  {
    ...base,
    id: 'fx-eqgroups-partitive',
    seed: 5,
    grade: 3,
    axes: { U: 1, L: 0, N: 2, I: 0, M: 1, P: 0 },
    steps: [
      {
        schema: 'equalGroups',
        variant: 'partitive',
        unknown: 'perGroup',
        quantities: [
          q('groups', 4, L('tabaklar', 'firaq', 'plates'), L('tabak', 'firaq', 'plate')),
          q('perGroup', 6, L('her tabakta', 'di her firaqê de', 'on each plate'), WALNUT),
          q('total', 24, L('bütün cevizler', 'hemû gûz', 'all walnuts'), WALNUT),
        ],
      },
    ],
    text: {
      tr: [
        S(T('Dedem '), Q('total', '24'), T(' cevizi '), Q('groups', '4'), T(' tabağa eşit paylaştırdı.')),
        SQ(T('Her tabakta kaç ceviz var?')),
      ],
      ku: [
        // KU-DENETİM
        S(T('Bapîrê min '), Q('total', '24'), T(' gûz bi wekhevî li '), Q('groups', '4'), T(' firaqan belav kirin.')),
        SQ(T('Di her firaqê de çend gûz hene?')),
      ],
      en: [
        S(T('Grandpa shared '), Q('total', '24'), T(' walnuts equally on '), Q('groups', '4'), T(' plates.')),
        SQ(T('How many walnuts are on each plate?')),
      ],
    },
    answer: 6,
    answerSentence: L('Her tabakta {x} ceviz var.', 'Di her firaqê de {x} gûz hene.', 'There are {x} walnuts on each plate.'),
    answerUnit: WALNUT,
    people: [],
  },

  // 6 — Eşit Gruplar / gruplama + kalan (yukarı yuvarla) (3. sınıf)
  {
    ...base,
    id: 'fx-eqgroups-quot-rem',
    seed: 6,
    grade: 3,
    diff: 4,
    axes: { U: 1, L: 0, N: 2, I: 0, M: 1, P: 0 },
    steps: [
      {
        schema: 'equalGroups',
        variant: 'quotative',
        unknown: 'groups',
        quantities: [
          q('groups', 4, L('minibüsler', 'mînîbûs', 'minibuses'), BUS),
          q('perGroup', 6, L('bir minibüste', 'di mînîbûsekê de', 'in one minibus'), STUDENT),
          q('total', 27, L('bütün öğrenciler', 'hemû xwendekar', 'all students'), STUDENT),
        ],
        remainder: { value: 3, interpret: 'roundUp' },
      },
    ],
    text: {
      tr: [
        S(Q('total', '27'), T(' öğrenci geziye minibüsle gidecek.')),
        S(T('Bir minibüse '), Q('perGroup', '6'), T(' öğrenci biniyor.')),
        SQ(T('En az kaç minibüs gerekir?')),
      ],
      ku: [
        // KU-DENETİM
        S(Q('total', '27'), T(' xwendekar dê bi mînîbûsê biçin gerê.')),
        S(Q('perGroup', '6'), T(' xwendekar li mînîbûsekê siwar dibin.')),
        SQ(T('Herî kêm çend mînîbûs lazim in?')),
      ],
      en: [
        S(Q('total', '27'), T(' students are going on a trip by minibus.')),
        S(Q('perGroup', '6'), T(' students fit in one minibus.')),
        SQ(T('At least how many minibuses are needed?')),
      ],
    },
    answer: 5,
    answerSentence: L('En az {x} minibüs gerekir.', 'Herî kêm {x} mînîbûs lazim in.', 'At least {x} minibuses are needed.'),
    answerUnit: BUS,
    people: [],
    targets: ['unitOrRemainder'],
  },

  // 7 — Kat Karşılaştırması / kat (3. sınıf)
  {
    ...base,
    id: 'fx-multcompare-times',
    seed: 7,
    grade: 3,
    axes: { U: 0, L: 0, N: 1, I: 0, M: 1, P: 0 },
    steps: [
      {
        schema: 'multCompare',
        variant: 'times',
        unknown: 'compared',
        referent: 'reference',
        quantities: [
          q('reference', 4, L("Deniz'in", 'yên Denîzê', "Deniz's"), BOOK),
          q('factor', 3, L('kat', 'car', 'times'), L('kat', 'car', 'times')),
          q('compared', 12, L('ablasının', 'yên xwişka wê', "her sister's"), BOOK),
        ],
      },
    ],
    text: {
      tr: [
        S(T("Deniz'in "), Q('reference', '4'), T(' kitabı var.')),
        S(T("Ablasının kitapları Deniz'inkinin "), Q('factor', '3'), T(' katı.')),
        SQ(T('Ablasının kaç kitabı var?')),
      ],
      ku: [
        // KU-DENETİM
        S(Q('reference', '4'), T(' pirtûkên Denîzê hene.')),
        S(T('Pirtûkên xwişka wê '), Q('factor', '3'), T(' carî yên Denîzê ne.')),
        SQ(T('Çend pirtûkên xwişka wê hene?')),
      ],
      en: [
        S(T('Deniz has '), Q('reference', '4'), T(' books.')),
        S(T('Her sister has '), Q('factor', '3'), T(' times as many books as Deniz.')),
        SQ(T('How many books does her sister have?')),
      ],
    },
    answer: 12,
    answerSentence: L('Ablasının {x} kitabı var.', '{x} pirtûkên xwişka wê hene.', 'Her sister has {x} books.'),
    answerUnit: BOOK,
    people: ['Deniz'],
  },

  // 8 — İki adımlı: değişim (ayırma) → değişim (birleştirme) (3. sınıf)
  {
    ...base,
    id: 'fx-two-step-change',
    seed: 8,
    grade: 3,
    diff: 4,
    axes: { U: 0, L: 0, N: 1, I: 0, M: 2, P: 0 },
    steps: [
      {
        schema: 'change',
        variant: 'separate',
        unknown: 'result',
        quantities: [
          q('start', 15, L('başta', 'di destpêkê de', 'at first'), LIRA),
          q('change', 6, L('harcadığı', 'yên ku xerc kir', 'spent'), LIRA),
          q('result', 9, L('kalan', 'yên mayî', 'left'), LIRA),
        ],
      },
      {
        schema: 'change',
        variant: 'join',
        unknown: 'result',
        quantities: [
          q('start', 9, L('kalan', 'yên mayî', 'left'), LIRA),
          q('change', 10, L('annesinin verdiği', 'yên ku diya wê da', 'mother gave'), LIRA),
          q('result', 19, L('şimdi', 'niha', 'now'), LIRA),
        ],
      },
    ],
    text: {
      tr: [
        S(T("Elif'in "), Q('start', '15'), T(' lirası vardı.')),
        S(T('Kitapçıda '), Q('change', '6'), T(' lira harcadı.')),
        S(T('Sonra annesi ona '), Q('change', '10'), T(' lira verdi.')),
        SQ(T("Elif'in şimdi kaç lirası var?")),
      ],
      ku: [
        // KU-DENETİM
        S(Q('start', '15'), T(' lîreyên Elîfê hebûn.')),
        S(T('Wê li pirtûkfiroşê '), Q('change', '6'), T(' lîre xerc kirin.')),
        S(T('Paşê diya wê '), Q('change', '10'), T(' lîre dan wê.')),
        SQ(T('Niha çend lîreyên Elîfê hene?')),
      ],
      en: [
        S(T('Elif had '), Q('start', '15'), T(' lira.')),
        S(T('She spent '), Q('change', '6'), T(' lira at the bookshop.')),
        S(T('Then her mother gave her '), Q('change', '10'), T(' lira.')),
        SQ(T('How much money does Elif have now?')),
      ],
    },
    answer: 19,
    answerSentence: L("Elif'in şimdi {x} lirası var.", 'Niha {x} lîreyên Elîfê hene.', 'Elif has {x} lira now.'),
    answerUnit: LIRA,
    people: ['Elif'],
  },
];

/** "Kendi sözünle" seçenekleri (1 doğru · 1 ilişki ters · 1 soru farklı). */
export const FIXTURE_PARAPHRASE: Record<string, ParaphraseItem['options']> = {
  'fx-change-join-1': [
    { kind: 'correct', text: L('Ela\'nın kalemleri vardı, annesi daha verdi. Şimdi kaç kalemi olduğunu arıyoruz.', 'Pênûsên Elayê hebûn, diya wê hinên din dan. Em li hejmara pênûsên wê yên niha digerin.', 'Ela had pencils and her mother gave her more. We want how many she has now.') },
    { kind: 'reversedRelation', text: L('Ela\'nın kalemleri vardı, annesine birkaç kalem verdi. Şimdi kaç kalemi kaldığını arıyoruz.', 'Pênûsên Elayê hebûn, wê hinek dan diya xwe. Em li yên mayî digerin.', 'Ela had pencils and gave some to her mother. We want how many are left.') },
    { kind: 'differentQuestion', text: L('Ela\'nın kalemleri vardı, annesi daha verdi. Annesinin kaç kalem verdiğini arıyoruz.', 'Pênûsên Elayê hebûn, diya wê hinên din dan. Em digerin ka diya wê çend dan.', 'Ela had pencils and her mother gave more. We want how many her mother gave.') },
  ],
  'fx-change-sep-start': [
    { kind: 'correct', text: L('Can\'ın elmaları vardı, birazını verdi, 9 tane kaldı. Başta kaç tane olduğunu arıyoruz.', 'Sêvên Can hebûn, hinek dan, 9 man. Em li hejmara destpêkê digerin.', 'Can had apples, gave some away, and 9 are left. We want how many he had at first.') },
    { kind: 'reversedRelation', text: L('Can\'ın elmaları vardı, arkadaşı ona elma verdi. Başta kaç tane olduğunu arıyoruz.', 'Sêvên Can hebûn, hevalê wî sêv dan wî. Em li hejmara destpêkê digerin.', 'Can had apples and his friend gave him some. We want how many he had at first.') },
    { kind: 'differentQuestion', text: L('Can\'ın elmaları vardı, birazını verdi. Şimdi kaç tane kaldığını arıyoruz.', 'Sêvên Can hebûn, hinek dan. Em li yên mayî digerin.', 'Can had apples and gave some away. We want how many are left now.') },
  ],
  'fx-combine-part-extra': [
    { kind: 'correct', text: L('Sınıfta kızlar ve erkekler var. Hepsinin sayısını biliyoruz; erkekleri arıyoruz.', 'Di polê de keç û kur hene. Em hejmara hemûyan dizanin; em li kuran digerin.', 'The class has girls and boys. We know the total; we want the boys.') },
    { kind: 'reversedRelation', text: L('Sınıfta kızlar ve erkekler var. Erkeklerin sayısını biliyoruz; kızları arıyoruz.', 'Di polê de keç û kur hene. Em hejmara kuran dizanin; em li keçan digerin.', 'The class has girls and boys. We know the boys; we want the girls.') },
    { kind: 'differentQuestion', text: L('Sınıfta kızlar ve erkekler var. Kaç pencere olduğunu arıyoruz.', 'Di polê de keç û kur hene. Em li hejmara pencereyan digerin.', 'The class has girls and boys. We want how many windows there are.') },
  ],
  'fx-compare-more-inconsistent': [
    { kind: 'correct', text: L('Zeynep\'in çıkartması Mert\'inkinden çok. Mert\'in çıkartmalarını arıyoruz.', 'Stîkerên Zeynepê ji yên Mert zêdetir in. Em li stîkerên Mert digerin.', 'Zeynep has more stickers than Mert. We want Mert\'s stickers.') },
    { kind: 'reversedRelation', text: L('Mert\'in çıkartması Zeynep\'inkinden çok. Mert\'in çıkartmalarını arıyoruz.', 'Stîkerên Mert ji yên Zeynepê zêdetir in. Em li stîkerên Mert digerin.', 'Mert has more stickers than Zeynep. We want Mert\'s stickers.') },
    { kind: 'differentQuestion', text: L('Zeynep\'in çıkartması Mert\'inkinden çok. İkisinin birlikte kaç çıkartması olduğunu arıyoruz.', 'Stîkerên Zeynepê ji yên Mert zêdetir in. Em li hejmara hemûyan digerin.', 'Zeynep has more stickers than Mert. We want how many they have together.') },
  ],
  'fx-eqgroups-partitive': [
    { kind: 'correct', text: L('Cevizler tabaklara eşit dağıtıldı. Bir tabakta kaç ceviz olduğunu arıyoruz.', 'Gûz bi wekhevî li firaqan hatin belavkirin. Em li hejmara di firaqekê de digerin.', 'The walnuts were shared equally on plates. We want how many are on one plate.') },
    { kind: 'reversedRelation', text: L('Her tabağa 24 ceviz kondu. Bir tabakta kaç ceviz olduğunu arıyoruz.', 'Li her firaqê 24 gûz hatin danîn. Em li hejmara di firaqekê de digerin.', '24 walnuts were put on every plate. We want how many are on one plate.') },
    { kind: 'differentQuestion', text: L('Cevizler tabaklara eşit dağıtıldı. Kaç tabak olduğunu arıyoruz.', 'Gûz bi wekhevî li firaqan hatin belavkirin. Em li hejmara firaqan digerin.', 'The walnuts were shared equally on plates. We want how many plates there are.') },
  ],
  'fx-eqgroups-quot-rem': [
    { kind: 'correct', text: L('Öğrenciler minibüslere binecek; her minibüse aynı sayıda öğrenci biniyor. Kaç minibüs gerektiğini arıyoruz.', 'Xwendekar dê li mînîbûsan siwar bibin; li her yekê heman hejmar. Em li hejmara mînîbûsan digerin.', 'The students ride minibuses with the same number in each. We want how many minibuses are needed.') },
    { kind: 'reversedRelation', text: L('Her minibüste 27 öğrenci var. Kaç minibüs gerektiğini arıyoruz.', 'Di her mînîbûsê de 27 xwendekar hene. Em li hejmara mînîbûsan digerin.', 'Each minibus has 27 students. We want how many minibuses are needed.') },
    { kind: 'differentQuestion', text: L('Öğrenciler minibüslere binecek. Bir minibüste kaç öğrenci olduğunu arıyoruz.', 'Xwendekar dê li mînîbûsan siwar bibin. Em li hejmara di mînîbûsekê de digerin.', 'The students ride minibuses. We want how many are in one minibus.') },
  ],
  'fx-multcompare-times': [
    { kind: 'correct', text: L('Ablasının kitapları Deniz\'inkinin birkaç katı. Ablasının kitaplarını arıyoruz.', 'Pirtûkên xwişka wê çend carî yên Denîzê ne. Em li pirtûkên xwişkê digerin.', 'Her sister has several times as many books as Deniz. We want the sister\'s books.') },
    { kind: 'reversedRelation', text: L('Deniz\'in kitapları ablasınınkinin birkaç katı. Ablasının kitaplarını arıyoruz.', 'Pirtûkên Denîzê çend carî yên xwişka wê ne. Em li pirtûkên xwişkê digerin.', 'Deniz has several times as many books as her sister. We want the sister\'s books.') },
    { kind: 'differentQuestion', text: L('Ablasının kitapları Deniz\'inkinin birkaç katı. Deniz\'in kitaplarını arıyoruz.', 'Pirtûkên xwişka wê çend carî yên Denîzê ne. Em li pirtûkên Denîzê digerin.', 'Her sister has several times as many books. We want Deniz\'s books.') },
  ],
  'fx-two-step-change': [
    { kind: 'correct', text: L('Elif\'in parası vardı; birazını harcadı, sonra annesi para verdi. Şimdi ne kadar parası olduğunu arıyoruz.', 'Pereyên Elîfê hebûn; hinek xerc kir, paşê diya wê pere da. Em li pereyên wê yên niha digerin.', 'Elif had money, spent some, then her mother gave her more. We want how much she has now.') },
    { kind: 'reversedRelation', text: L('Elif\'in parası vardı; birazını buldu, sonra annesine para verdi. Şimdi ne kadar parası olduğunu arıyoruz.', 'Pereyên Elîfê hebûn; hinek dît, paşê pere da diya xwe. Em li pereyên wê yên niha digerin.', 'Elif had money, found some, then gave money to her mother. We want how much she has now.') },
    { kind: 'differentQuestion', text: L('Elif\'in parası vardı; birazını harcadı, sonra annesi para verdi. Kitapçıda ne kadar harcadığını arıyoruz.', 'Pereyên Elîfê hebûn; hinek xerc kir, paşê diya wê pere da. Em digerin ka çiqas xerc kir.', 'Elif had money, spent some, then her mother gave her more. We want how much she spent.') },
  ],
};
