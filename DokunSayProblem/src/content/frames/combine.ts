/**
 * PARÇA-BÜTÜN şeması çerçeveleri (`static`). Eylem yok; iki parça bir bütün.
 * Bilinmeyen: bütün (U0) ya da parça (U1/U2 → part2).
 * Parça bilinmeyende bütün cümlesinde "toplam" geçebilir (04 §D.3 kural 13: tuzak sözcük çeşitlemesi).
 */
import type { L10n, Lang, Segment, Sentence } from '../types';
import type { Part } from '../text';
import { S, Q } from '../text';
import type { Frame, FrameInput, FrameOut } from './types';
import { helpers, L, unitOf, nounOf } from './types';
import { numPoss3 } from '../grammar/tr';

interface CombineLang {
  part1: (q: Segment) => Part[];
  part2: (q: Segment) => Part[];
  whole: (q: Segment) => Part[];
  /** Parça bilinmeyende birinci parça cümlesi (ör. "Öğrencilerin 12'si kız."). */
  part1Of?: (q: Segment) => Part[];
  bridge?: Part[];
  askWhole: Part[];
  askPart2: Part[];
  ans: { whole: string; part2: string };
}
type CombineSpec = Record<Lang, CombineLang>;
const LANGS: Lang[] = ['tr', 'ku', 'en'];

function compose(
  fi: FrameInput,
  spec: CombineSpec,
  labels: { part1: L10n; part2: L10n; whole: L10n },
  units: { whole: L10n; part2: L10n },
): FrameOut {
  const h = helpers(fi);
  const useOf = fi.rng.chance(0.5);
  const text = {} as Record<Lang, Sentence[]>;
  const answer = {} as L10n;
  for (const lang of LANGS) {
    const s = spec[lang];
    const ch = lang === 'tr' ? h.t : lang === 'ku' ? h.k : h.e;
    if (h.u === 'whole') {
      text[lang] = [S(...s.part1(ch('part1'))), S(...s.part2(ch('part2'))), Q(...s.askWhole)];
      answer[lang] = s.ans.whole;
    } else {
      const p1 = useOf && s.part1Of ? s.part1Of(ch('part1')) : s.part1(ch('part1'));
      const out = [S(...s.whole(ch('whole'))), S(...p1)];
      if (s.bridge) out.push(S(...s.bridge));
      out.push(Q(...s.askPart2));
      text[lang] = out;
      answer[lang] = s.ans.part2;
    }
  }
  return { text, answer, unit: h.u === 'whole' ? units.whole : units.part2, labels };
}

const COLORS: { tr: string; ku: string; en: string }[][] = [
  [{ tr: 'kırmızı', ku: 'sor', en: 'red' }, { tr: 'mavi', ku: 'şîn', en: 'blue' }],
  [{ tr: 'sarı', ku: 'zer', en: 'yellow' }, { tr: 'yeşil', ku: 'kesk', en: 'green' }],
  [{ tr: 'beyaz', ku: 'spî', en: 'white' }, { tr: 'siyah', ku: 'reş', en: 'black' }],
];

// ─── 1. Renkler (bir kişinin iki renk nesnesi) ─────────────────────────────
const colors: Frame = {
  id: 'combine.colors',
  context: 'play',
  schema: 'combine',
  variants: ['static'],
  minGrade: 1,
  unitKind: 'count',
  objs: ['balon', 'kalem', 'top', 'kart', 'misket'],
  maxWhole: 999,
  render(fi) {
    const h = helpers(fi);
    const [c1, c2] = h.pick(COLORS);
    const { A } = h;
    // KU-DENETİM: "5 balonên sor" (sayı + ezafeli sıfat) kalıbı.
    const spec: CombineSpec = {
      tr: {
        part1: (q) => [h.gA, ' ', q, ` ${c1.tr} `, h.oP, ' var.'],
        part2: (q) => [h.gA, ' ', q, ` ${c2.tr} `, h.oP, ' var.'],
        whole: (q) => [h.gA, ' ', h.pick(['toplam ', '']), q, ' ', h.oP, ' var.'],
        askWhole: h.pick([[h.gA, ' toplam kaç ', h.oP, ' var?'], [h.gA, ' kaç ', h.oP, ' var?']]),
        askPart2: [h.gA, ` kaç ${c2.tr} `, h.oP, ' var?'],
        ans: { whole: `${h.gA} {x} ${h.oP} var.`, part2: `${h.gA} {x} ${c2.tr} ${h.oP} var.` },
      },
      ku: {
        part1: (q) => [h.kA, ' ', q, ' ', h.koEz, ` ${c1.ku} hene.`],
        part2: (q) => [h.kA, ' ', q, ' ', h.koEz, ` ${c2.ku} hene.`],
        whole: (q) => [h.kA, ' bi giştî ', q, ' ', h.ko, ' hene.'],
        askWhole: [h.kA, ' bi giştî çend ', h.ko, ' hene?'],
        askPart2: [h.kA, ' çend ', h.koEz, ` ${c2.ku} hene?`],
        ans: { whole: `${h.kA} {x} ${h.ko} hene.`, part2: `${h.kA} {x} ${h.koEz} ${c2.ku} hene.` },
      },
      en: {
        part1: (q) => [A.en, ' has ', q, ` ${c1.en} `, h.eo, '.'],
        part2: (q) => [A.en, ' has ', q, ` ${c2.en} `, h.eo, '.'],
        whole: (q) => [A.en, ' has ', q, ' ', h.eo, ' in total.'],
        askWhole: ['How many ', h.eo, ' does ', A.en, ' have altogether?'],
        askPart2: [`How many ${c2.en} `, h.eo, ' does ', A.en, ' have?'],
        ans: { whole: `${A.en} has {x} ${h.eo} altogether.`, part2: `${A.en} has {x} ${c2.en} ${h.eo}.` },
      },
    };
    return compose(
      fi,
      spec,
      { part1: L(c1.tr, c1.ku, c1.en), part2: L(c2.tr, c2.ku, c2.en), whole: L('hepsi', 'hemû', 'all') },
      { whole: unitOf(fi.obj), part2: unitOf(fi.obj) },
    );
  },
};

// ─── 2. Sınıf mevcudu (kız / erkek) ────────────────────────────────────────
const classroom: Frame = {
  id: 'combine.class',
  context: 'school',
  schema: 'combine',
  variants: ['static'],
  minGrade: 1,
  unitKind: 'count',
  objs: ['ogrenci'],
  maxWhole: 40,
  render(fi) {
    const girlsFirst = fi.rng.chance(0.5);
    const g1 = girlsFirst ? { tr: 'kız', ku: 'keç', en: 'girls', en1: 'girl' } : { tr: 'erkek', ku: 'kur', en: 'boys', en1: 'boy' };
    const g2 = girlsFirst ? { tr: 'erkek', ku: 'kur', en: 'boys', en1: 'boy' } : { tr: 'kız', ku: 'keç', en: 'girls', en1: 'girl' };
    // KU-DENETİM: "xwendekarên keç / kur".
    const spec: CombineSpec = {
      tr: {
        part1: (q) => ['Sınıfta ', q, ` ${g1.tr} öğrenci var.`],
        part2: (q) => ['Sınıfta ', q, ` ${g2.tr} öğrenci var.`],
        whole: (q) => ['Sınıfta ', q, ' öğrenci var.'],
        part1Of: (q) => ['Öğrencilerin ', q, ` ${g1.tr}.`],
        askWhole: ['Sınıfta kaç öğrenci var?'],
        askPart2: [`Sınıfta kaç ${g2.tr} öğrenci var?`],
        ans: { whole: 'Sınıfta {x} öğrenci var.', part2: `Sınıfta {x} ${g2.tr} öğrenci var.` },
      },
      ku: {
        part1: (q) => ['Di polê de ', q, ` xwendekarên ${g1.ku} hene.`],
        part2: (q) => ['Di polê de ', q, ` xwendekarên ${g2.ku} hene.`],
        whole: (q) => ['Di polê de bi giştî ', q, ' xwendekar hene.'],
        askWhole: ['Di polê de bi giştî çend xwendekar hene?'],
        askPart2: [`Di polê de çend xwendekarên ${g2.ku} hene?`],
        ans: { whole: 'Di polê de {x} xwendekar hene.', part2: `Di polê de {x} xwendekarên ${g2.ku} hene.` },
      },
      en: {
        part1: (q) => ['There are ', q, ` ${g1.en} in the class.`],
        part2: (q) => ['There are ', q, ` ${g2.en} in the class.`],
        whole: (q) => ['There are ', q, ' pupils in the class.'],
        askWhole: ['How many pupils are in the class?'],
        askPart2: [`How many ${g2.en} are in the class?`],
        ans: { whole: 'There are {x} pupils in the class.', part2: `There are {x} ${g2.en} in the class.` },
      },
    };
    const trFix = spec.tr.part1Of!;
    spec.tr.part1Of = (q) => trFix({ ...q, text: numPoss3(Number(q.text.replace(/\./g, ''))) } as Segment);
    return compose(
      fi,
      spec,
      { part1: L(g1.tr, g1.ku, g1.en), part2: L(g2.tr, g2.ku, g2.en), whole: L('hepsi', 'hemû', 'all pupils') },
      { whole: unitOf(fi.obj), part2: L('öğrenci', 'xwendekar', g2.en1) },
    );
  },
};

// ─── 3. Meyve sepeti ───────────────────────────────────────────────────────
const fruit: Frame = {
  id: 'combine.fruit',
  context: 'market',
  schema: 'combine',
  variants: ['static'],
  minGrade: 1,
  unitKind: 'count',
  objs: ['meyve'],
  maxWhole: 200,
  render(fi) {
    const flip = fi.rng.chance(0.5);
    const a = nounOf(flip ? 'armut' : 'elma');
    const b = nounOf(flip ? 'elma' : 'armut');
    const spec: CombineSpec = {
      tr: {
        part1: (q) => ['Sepette ', q, ` ${a.tr.w} var.`],
        part2: (q) => ['Sepette ', q, ` ${b.tr.w} var.`],
        whole: (q) => ['Sepette ', q, ' meyve var.'],
        part1Of: (q) => ['Meyvelerin ', q, ` ${a.tr.w}.`],
        askWhole: ['Sepette kaç meyve var?'],
        askPart2: [`Sepette kaç ${b.tr.w} var?`],
        ans: { whole: 'Sepette {x} meyve var.', part2: `Sepette {x} ${b.tr.w} var.` },
      },
      ku: {
        part1: (q) => ['Di selikê de ', q, ` ${a.ku.w} hene.`],
        part2: (q) => ['Di selikê de ', q, ` ${b.ku.w} hene.`],
        whole: (q) => ['Di selikê de ', q, ' fêkî hene.'],
        askWhole: ['Di selikê de çend fêkî hene?'],
        askPart2: [`Di selikê de çend ${b.ku.w} hene?`],
        ans: { whole: 'Di selikê de {x} fêkî hene.', part2: `Di selikê de {x} ${b.ku.w} hene.` },
      },
      en: {
        part1: (q) => ['There are ', q, ` ${a.en.pl} in the basket.`],
        part2: (q) => ['There are ', q, ` ${b.en.pl} in the basket.`],
        whole: (q) => ['There are ', q, ' pieces of fruit in the basket.'],
        askWhole: ['How many pieces of fruit are in the basket?'],
        askPart2: [`How many ${b.en.pl} are in the basket?`],
        ans: { whole: 'There are {x} pieces of fruit in the basket.', part2: `There are {x} ${b.en.pl} in the basket.` },
      },
    };
    const trFix = spec.tr.part1Of!;
    spec.tr.part1Of = (q) => trFix({ ...q, text: numPoss3(Number(q.text.replace(/\./g, ''))) } as Segment);
    return compose(
      fi,
      spec,
      { part1: unitOf(a), part2: unitOf(b), whole: L('meyveler', 'fêkî', 'fruit') },
      { whole: unitOf(fi.obj), part2: unitOf(b) },
    );
  },
};

// ─── 4. İki kişi birlikte (toplama, dikme) ─────────────────────────────────
const together: Frame = {
  id: 'combine.together',
  context: 'village',
  schema: 'combine',
  variants: ['static'],
  minGrade: 1,
  unitKind: 'count',
  objs: ['ceviz', 'cicek', 'sise', 'fidan'],
  maxWhole: 999,
  render(fi) {
    const h = helpers(fi);
    const { A, B } = h;
    const plant = fi.obj.id === 'fidan';
    const vTr = plant ? 'dikti' : 'topladı';
    const vKu = plant ? 'çandin' : 'berhev kirin';
    const vKu1 = plant ? 'çandin' : 'berhev kirin';
    const vEn = plant ? 'planted' : 'collected';
    const vEnQ = plant ? 'plant' : 'collect';
    // KU-DENETİM: ergatif çoğul; eşgüdümlü eyleyen "Rojdayê û Baranî".
    const spec: CombineSpec = {
      tr: {
        part1: (q) => [A.tr, ' ', q, ' ', h.o, ` ${vTr}.`],
        part2: (q) => [B.tr, ' ', q, ' ', h.o, ` ${vTr}.`],
        whole: (q) => [A.tr, ' ile ', B.tr, ' birlikte ', q, ' ', h.o, ` ${vTr}.`],
        askWhole: h.pick([['İkisi birlikte kaç ', h.o, ` ${vTr}?`], ['İkisi toplam kaç ', h.o, ` ${vTr}?`]]),
        askPart2: [B.tr, ' kaç ', h.o, ` ${vTr}?`],
        ans: { whole: `İkisi birlikte {x} ${h.o} ${vTr}.`, part2: `${B.tr} {x} ${h.o} ${vTr}.` },
      },
      ku: {
        part1: (q) => [h.kA, ' ', q, ' ', h.ko, ` ${vKu}.`],
        part2: (q) => [h.kB, ' ', q, ' ', h.ko, ` ${vKu}.`],
        whole: (q) => [h.kA, ' û ', h.kB, ' bi hev re ', q, ' ', h.ko, ` ${vKu}.`],
        askWhole: ['Her duyan bi hev re çend ', h.ko, ` ${vKu1}?`],
        askPart2: [h.kB, ' çend ', h.ko, ` ${vKu1}?`],
        ans: { whole: `Her duyan bi hev re {x} ${h.ko} ${vKu}.`, part2: `${h.kB} {x} ${h.ko} ${vKu}.` },
      },
      en: {
        part1: (q) => [A.en, ` ${vEn} `, q, ' ', h.eo, '.'],
        part2: (q) => [B.en, ` ${vEn} `, q, ' ', h.eo, '.'],
        whole: (q) => [A.en, ' and ', B.en, ` ${vEn} `, q, ' ', h.eo, ' together.'],
        askWhole: ['How many ', h.eo, ` did they ${vEnQ} together?`],
        askPart2: ['How many ', h.eo, ` did ${B.en} ${vEnQ}?`],
        ans: { whole: `They ${vEn} {x} ${h.eo} together.`, part2: `${B.en} ${vEn} {x} ${h.eo}.` },
      },
    };
    return compose(
      fi,
      spec,
      { part1: L(A.tr, A.ku, A.en), part2: L(B.tr, B.ku, B.en), whole: L('ikisi birlikte', 'her du bi hev re', 'both together') },
      { whole: unitOf(fi.obj), part2: unitOf(fi.obj) },
    );
  },
};

// ─── 5. Ağıldaki hayvanlar ─────────────────────────────────────────────────
const farm: Frame = {
  id: 'combine.farm',
  context: 'village',
  schema: 'combine',
  variants: ['static'],
  minGrade: 1,
  unitKind: 'count',
  objs: ['hayvan'],
  maxWhole: 999,
  render(fi) {
    const flip = fi.rng.chance(0.5);
    const a = nounOf(flip ? 'keci' : 'koyun');
    const b = nounOf(flip ? 'koyun' : 'keci');
    // KU-DENETİM: axur (ağıl).
    const spec: CombineSpec = {
      tr: {
        part1: (q) => ['Ağılda ', q, ` ${a.tr.w} var.`],
        part2: (q) => ['Ağılda ', q, ` ${b.tr.w} var.`],
        whole: (q) => ['Ağılda ', q, ' hayvan var.'],
        part1Of: (q) => ['Hayvanların ', q, ` ${a.tr.w}.`],
        askWhole: ['Ağılda kaç hayvan var?'],
        askPart2: [`Ağılda kaç ${b.tr.w} var?`],
        ans: { whole: 'Ağılda {x} hayvan var.', part2: `Ağılda {x} ${b.tr.w} var.` },
      },
      ku: {
        part1: (q) => ['Di axurê de ', q, ` ${a.ku.w} hene.`],
        part2: (q) => ['Di axurê de ', q, ` ${b.ku.w} hene.`],
        whole: (q) => ['Di axurê de ', q, ' heywan hene.'],
        askWhole: ['Di axurê de çend heywan hene?'],
        askPart2: [`Di axurê de çend ${b.ku.w} hene?`],
        ans: { whole: 'Di axurê de {x} heywan hene.', part2: `Di axurê de {x} ${b.ku.w} hene.` },
      },
      en: {
        part1: (q) => ['There are ', q, ` ${a.en.pl} in the pen.`],
        part2: (q) => ['There are ', q, ` ${b.en.pl} in the pen.`],
        whole: (q) => ['There are ', q, ' animals in the pen.'],
        askWhole: ['How many animals are in the pen?'],
        askPart2: [`How many ${b.en.pl} are in the pen?`],
        ans: { whole: 'There are {x} animals in the pen.', part2: `There are {x} ${b.en.pl} in the pen.` },
      },
    };
    const trFix = spec.tr.part1Of!;
    spec.tr.part1Of = (q) => trFix({ ...q, text: numPoss3(Number(q.text.replace(/\./g, ''))) } as Segment);
    return compose(
      fi,
      spec,
      { part1: unitOf(a), part2: unitOf(b), whole: L('hayvanlar', 'heywan', 'animals') },
      { whole: unitOf(fi.obj), part2: unitOf(b) },
    );
  },
};

// ─── 6. Süre (dakika) — 3. sınıftan ────────────────────────────────────────
const time: Frame = {
  id: 'combine.time',
  context: 'time',
  schema: 'combine',
  variants: ['static'],
  minGrade: 3,
  unitKind: 'time',
  objs: ['dakika'],
  maxWhole: 180,
  render(fi) {
    const h = helpers(fi);
    const { A } = h;
    // KU-DENETİM: "xwend / wêne çêkir / xebitî".
    const spec: CombineSpec = {
      tr: {
        part1: (q) => [A.tr, ' ', q, ' dakika kitap okudu.'],
        part2: (q) => ['Sonra ', q, ' dakika resim yaptı.'],
        whole: (q) => [A.tr, ' toplam ', q, ' dakika çalıştı.'],
        bridge: ['Sonra resim yaptı.'],
        askWhole: [A.tr, ' toplam ne kadar süre çalıştı?'],
        askPart2: [A.tr, ' ne kadar süre resim yaptı?'],
        ans: { whole: `${A.tr} toplam {x} dakika çalıştı.`, part2: `${A.tr} {x} dakika resim yaptı.` },
      },
      ku: {
        part1: (q) => [h.kA, ' ', q, ' deqe pirtûk xwend.'],
        part2: (q) => ['Paşê ', h.kA, ' ', q, ' deqe wêne çêkir.'],
        whole: (q) => [h.nA, ' bi giştî ', q, ' deqe xebitî.'],
        bridge: ['Paşê ', h.kA, ' wêne çêkir.'],
        askWhole: [h.nA, ' bi giştî çiqas dem xebitî?'],
        askPart2: [h.kA, ' çiqas dem wêne çêkir?'],
        ans: { whole: `${h.nA} bi giştî {x} deqe xebitî.`, part2: `${h.kA} {x} deqe wêne çêkir.` },
      },
      en: {
        part1: (q) => [A.en, ' read for ', q, ' minutes.'],
        part2: (q) => ['Then ', A.en, ' drew for ', q, ' minutes.'],
        whole: (q) => [A.en, ' worked for ', q, ' minutes in total.'],
        bridge: ['Then ', A.en, ' drew pictures.'],
        askWhole: ['How long did ', A.en, ' work in total?'],
        askPart2: ['How long did ', A.en, ' draw?'],
        ans: { whole: `${A.en} worked for {x} minutes in total.`, part2: `${A.en} drew for {x} minutes.` },
      },
    };
    return compose(
      fi,
      spec,
      { part1: L('kitap okuma', 'xwendina pirtûkê', 'reading'), part2: L('resim', 'wêne', 'drawing'), whole: L('toplam süre', 'dema giştî', 'total time') },
      { whole: unitOf(fi.obj), part2: unitOf(fi.obj) },
    );
  },
};

// ─── 7. İp uzunluğu (metre) — 2. sınıftan ──────────────────────────────────
const rope: Frame = {
  id: 'combine.rope',
  context: 'length',
  schema: 'combine',
  variants: ['static'],
  minGrade: 2,
  unitKind: 'length',
  objs: ['metre'],
  maxWhole: 200,
  render(fi) {
    const h = helpers(fi);
    const { A } = h;
    // KU-DENETİM: "benê şîn ê Rojdayê" ezafe zinciri.
    const spec: CombineSpec = {
      tr: {
        part1: (q) => [h.gA, ' mavi ipi ', q, ' metre.'],
        part2: (q) => [h.gA, ' kırmızı ipi ', q, ' metre.'],
        whole: (q) => [h.gA, ' iki ipi toplam ', q, ' metre.'],
        askWhole: ['İki ipin toplam uzunluğu ne kadar?'],
        askPart2: ['Kırmızı ipin uzunluğu ne kadar?'],
        ans: { whole: 'İki ipin toplam uzunluğu {x} metre.', part2: 'Kırmızı ipin uzunluğu {x} metre.' },
      },
      ku: {
        part1: (q) => ['Benê şîn ê ', h.kA, ' ', q, ' metre ye.'],
        part2: (q) => ['Benê sor ê ', h.kA, ' ', q, ' metre ye.'],
        whole: (q) => ['Her du benên ', h.kA, ' bi giştî ', q, ' metre ne.'],
        askWhole: ['Dirêjahiya her du benan bi giştî çiqas e?'],
        askPart2: ['Dirêjahiya benê sor çiqas e?'],
        ans: { whole: 'Dirêjahiya her du benan {x} metre ye.', part2: 'Dirêjahiya benê sor {x} metre ye.' },
      },
      en: {
        part1: (q) => [A.en, '’s blue rope is ', q, ' metres long.'],
        part2: (q) => [A.en, '’s red rope is ', q, ' metres long.'],
        whole: (q) => [A.en, '’s two ropes are ', q, ' metres long in total.'],
        askWhole: ['How long are the two ropes in total?'],
        askPart2: ['How long is the red rope?'],
        ans: { whole: 'The two ropes are {x} metres long in total.', part2: 'The red rope is {x} metres long.' },
      },
    };
    return compose(
      fi,
      spec,
      { part1: L('mavi ip', 'benê şîn', 'blue rope'), part2: L('kırmızı ip', 'benê sor', 'red rope'), whole: L('iki ip', 'her du ben', 'both ropes') },
      { whole: unitOf(fi.obj), part2: unitOf(fi.obj) },
    );
  },
};

export const COMBINE_FRAMES: Frame[] = [colors, classroom, fruit, together, farm, time, rope];
