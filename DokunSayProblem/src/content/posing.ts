/**
 * Problem Kurucu (03 §C7; MAT.3.2.7, MAT.4.2.8): boşluklu cümle kalıpları, doldurma (doğru ek
 * uyumuyla), dört istem türü ve çözülebilirlik denetimi.
 *
 * Kalıp yer tutucuları: {ad} {ad2} {sayı} {sayı2} {nesne}; ek biçimi iki nokta ile:
 *  TR: {ad:gen} Ela'nın · {ad:dat} Ela'ya · {ad:abl} Ela'dan · {nesne:poss3} kalemi · {nesne:acc} kalemi(ni)
 *      {sayı:poss3acc} 4'ünü · {sayı:dist} 3'er
 *  KU: {ad:obl} Rojdayê / Baranî (cinsiyet `adG`/`ad2G` ile)
 *  EN: {nesne:pl} pencils · {ad:poss} Ela's
 */
import type { Grade, L10n, Lang, Problem, SchemaId } from './types';
import { mulberry32, deriveSeed } from './rng';
import * as g from './grammar/tr';
import { kuOblique } from './grammar/ku';
import { NOUNS, PEOPLE, nounByTr } from './lexicon';
import type { Noun } from './lexicon';
import { generateProblem } from './generate';
import { templateTokens } from './relations';
import type { EqToken } from './evaluate';

const T = (tr: string, ku: string, en: string): L10n => ({ tr, ku, en });

// KU-DENETİM: problem kurma kalıpları.
export const POSING_FRAMES: Record<SchemaId, L10n[]> = {
  change: [
    T('{ad:gen} {sayı} {nesne:poss3} vardı.', '{ad:obl} {sayı} {nesne} hebûn.', '{ad} had {sayı} {nesne:pl}.'),
    T('{ad}, {ad2:dat} {sayı2} {nesne} verdi.', '{ad:obl} {sayı2} {nesne} dan {ad2:obl}.', '{ad} gave {ad2} {sayı2} {nesne:pl}.'),
    T('{ad2}, {ad:dat} {sayı2} {nesne} daha verdi.', '{ad2:obl} {sayı2} {nesne} din jî dan {ad:obl}.', '{ad2} gave {ad} {sayı2} more {nesne:pl}.'),
    T('{ad:gen} kaç {nesne:poss3} kaldı?', 'Çend {nesne:ez} {ad:obl} man?', 'How many {nesne:pl} does {ad} have left?'),
    T('{ad:gen} şimdi kaç {nesne:poss3} var?', 'Niha {ad:obl} çend {nesne} hene?', 'How many {nesne:pl} does {ad} have now?'),
  ],
  combine: [
    T('{ad:gen} {sayı} kırmızı {nesne:poss3} var.', '{ad:obl} {sayı} {nesne:ez} sor hene.', '{ad} has {sayı} red {nesne:pl}.'),
    T('{ad:gen} {sayı2} mavi {nesne:poss3} var.', '{ad:obl} {sayı2} {nesne:ez} şîn hene.', '{ad} has {sayı2} blue {nesne:pl}.'),
    T('{ad:gen} toplam kaç {nesne:poss3} var?', '{ad:obl} bi giştî çend {nesne} hene?', 'How many {nesne:pl} does {ad} have altogether?'),
    T('{ad:gen} kaç mavi {nesne:poss3} var?', '{ad:obl} çend {nesne:ez} şîn hene?', 'How many blue {nesne:pl} does {ad} have?'),
  ],
  compare: [
    T('{ad:gen} {sayı} {nesne:poss3} var.', '{ad:obl} {sayı} {nesne} hene.', '{ad} has {sayı} {nesne:pl}.'),
    T('{ad2:gen} {sayı2} {nesne:poss3} var.', '{ad2:obl} {sayı2} {nesne} hene.', '{ad2} has {sayı2} {nesne:pl}.'),
    T('{ad2:gen}, {ad:abl} {sayı2} fazla {nesne:poss3} var.', '{ad2:obl} {sayı2} {nesne} ji {ad:obl} zêdetir hene.', '{ad2} has {sayı2} more {nesne:pl} than {ad}.'),
    T('{ad:gen}, {ad2:abl} kaç fazla {nesne:poss3} var?', '{ad:obl} çend {nesne} ji {ad2:obl} zêdetir hene?', 'How many more {nesne:pl} does {ad} have than {ad2}?'),
    T('{ad2:gen} kaç {nesne:poss3} var?', '{ad2:obl} çend {nesne} hene?', 'How many {nesne:pl} does {ad2} have?'),
  ],
  equalGroups: [
    T('{sayı} kutu var.', '{sayı} qutî hene.', 'There are {sayı} boxes.'),
    T('Her kutuda {sayı2} {nesne} var.', 'Di her qutiyê de {sayı2} {nesne} hene.', 'Each box has {sayı2} {nesne:pl}.'),
    T('{ad} {sayı} {nesne:acc} {sayı2} kutuya eşit paylaştırdı.', '{ad:obl} {sayı} {nesne} bi wekhevî li {sayı2} qutiyan par kirin.', '{ad} shared {sayı} {nesne:pl} equally among {sayı2} boxes.'),
    T('Toplam kaç {nesne} var?', 'Bi giştî çend {nesne} hene?', 'How many {nesne:pl} are there altogether?'),
    T('Her kutuda kaç {nesne} var?', 'Di her qutiyê de çend {nesne} hene?', 'How many {nesne:pl} are in each box?'),
  ],
  multCompare: [
    T('{ad:gen} {sayı} {nesne:poss3} var.', '{ad:obl} {sayı} {nesne} hene.', '{ad} has {sayı} {nesne:pl}.'),
    T('{ad2:gen} {nesne:poss3pl}, {ad:gen}kinin {sayı2} katı.', 'Hejmara {nesne:ez} {ad2:obl} {sayı2} carê ya {ad:obl} ye.', '{ad2} has {sayı2} times as many {nesne:pl} as {ad}.'),
    T('{ad2:gen} kaç {nesne:poss3} var?', '{ad2:obl} çend {nesne} hene?', 'How many {nesne:pl} does {ad2} have?'),
  ],
};

export interface FillValues { ad?: string; ad2?: string; adG?: 'f' | 'm'; ad2G?: 'f' | 'm'; sayı?: number; sayı2?: number; nesne?: string }

const genderOf = (name: string, fallback?: 'f' | 'm') => fallback ?? PEOPLE.find((p) => p.tr === name || p.ku === name)?.g ?? 'f';
const nounFor = (lang: Lang, w: string): Noun | undefined =>
  (Object.values(NOUNS) as Noun[]).find((n) => (lang === 'tr' ? n.tr.w : lang === 'ku' ? n.ku.w : n.en.sg) === w);

/** Kalıbı doldur (doğru ek uyumuyla). Eksik değer boşluk olarak `____` kalır. */
export function fillFrame(frame: L10n, lang: Lang, v: FillValues): string {
  return frame[lang].replace(/\{([^}:]+)(?::([^}]+))?\}/g, (_m, key: string, form?: string) => {
    if (key === 'sayı' || key === 'sayı2') {
      const n = key === 'sayı' ? v.sayı : v.sayı2;
      if (n === undefined) return '____';
      if (lang === 'tr' && form === 'poss3acc') return g.numPoss3Acc(n);
      if (lang === 'tr' && form === 'dist') return g.numDist(n);
      return String(n);
    }
    if (key === 'ad' || key === 'ad2') {
      const name = key === 'ad' ? v.ad : v.ad2;
      if (!name) return '____';
      if (lang === 'tr') return form === 'gen' ? g.nameGen(name) : form === 'dat' ? g.nameDat(name) : form === 'abl' ? g.nameAbl(name) : form === 'acc' ? g.nameAcc(name) : name;
      if (lang === 'ku') return form === 'obl' ? kuOblique(name, genderOf(name, key === 'ad' ? v.adG : v.ad2G)) : name;
      return form === 'poss' ? `${name}'s` : name;
    }
    if (key === 'nesne') {
      const w = v.nesne;
      if (!w) return '____';
      const n = nounFor(lang, w) ?? (lang === 'tr' ? nounByTr(w) : undefined);
      if (lang === 'tr') {
        const tn = n?.tr ?? { w };
        return form === 'poss3' ? g.poss3(tn) : form === 'acc' ? g.acc(tn) : form === 'poss3pl' ? g.poss3Pl(tn) : tn.w;
      }
      if (lang === 'ku') return form === 'ez' ? (n?.ku.ez ?? `${w}ên`) : w;
      return form === 'pl' ? (n?.en.pl ?? `${w}s`) : w;
    }
    return _m;
  });
}

// ─── İstemler ──────────────────────────────────────────────────────────────

const INSTR = {
  picture: T('Resme bak. Bu resimle ilgili bir soru sor.', 'Li wêneyê binêre. Pirsekê li ser vî wêneyî bipirse.', 'Look at the picture. Ask a question about it.'),
  equation: T('Bu işleme uyan bir hikâye kur.', 'Çîrokeke ku li vê kirariyê tê ava bike.', 'Make up a story that fits this number sentence.'),
  answer: T('Cevabı bu sayı olan bir problem kur.', 'Pirsgirêkeke ku bersiva wê ev hejmar e ava bike.', 'Make up a problem whose answer is this number.'),
  complete: T('Hikâyenin sorusu eksik. Uygun bir soru seç ya da kur.', 'Pirsa çîrokê kêm e. Pirseke guncav hilbijêre an ava bike.', 'The story has no question. Choose or make a fitting question.'),
};
const STARTERS: L10n[] = [
  T('Kaç tane … ?', 'Çend … ?', 'How many … ?'),
  T('Kaç tane daha … ?', 'Çend … din … ?', 'How many more … ?'),
  T('Hepsi birlikte kaç … ?', 'Hemû bi hev re çend … ?', 'How many … altogether?'),
  T('… kaç fazla … ?', '… çend … zêdetir … ?', 'How many more … than … ?'),
];

export const posingPrompts = {
  fromPicture(grade: Grade, seed: number) {
    const rng = mulberry32(deriveSeed(seed, 'pic'));
    const max = grade === 1 ? 9 : grade === 2 ? 30 : 90;
    const [a, b] = rng.shuffle(['elma', 'armut', 'balon', 'kalem', 'kitap'] as const).slice(0, 2).map((k) => NOUNS[k]);
    const items = [{ noun: { tr: a.tr.w, ku: a.ku.w, en: a.en.pl }, count: rng.int(2, max) }, { noun: { tr: b.tr.w, ku: b.ku.w, en: b.en.pl }, count: rng.int(2, max) }];
    if (items[0].count === items[1].count) items[1].count += 1;
    return { kind: 'fromPicture' as const, items, instruction: INSTR.picture, starters: STARTERS };
  },
  fromEquation(grade: Grade, seed: number) {
    const p = generateProblem({ grade, seed: deriveSeed(seed, 'eq'), axes: { M: 1, I: 0, P: 0 } });
    return { kind: 'fromEquation' as const, tokens: templateTokens(p.steps[0]) as EqToken[], schema: p.steps[0].schema, instruction: INSTR.equation, frames: POSING_FRAMES[p.steps[0].schema] };
  },
  fromAnswer(grade: Grade, seed: number) {
    const rng = mulberry32(deriveSeed(seed, 'ans'));
    const answer = rng.int(grade === 1 ? 3 : 5, grade === 1 ? 10 : grade === 2 ? 50 : 100);
    return { kind: 'fromAnswer' as const, answer, instruction: INSTR.answer };
  },
  completeQuestion(grade: Grade, seed: number) {
    const p = generateProblem({ grade, seed: deriveSeed(seed, 'cq'), axes: { M: 1, I: 0, P: 0 } });
    const other = generateProblem({ grade, schema: p.steps[0].schema, seed: deriveSeed(seed, 'cq2'), axes: { M: 1, I: 0, P: 0 } });
    const story: Problem = { ...p, text: { tr: p.text.tr.slice(0, -1), ku: p.text.ku.slice(0, -1), en: p.text.en.slice(0, -1) } };
    const q = (x: Problem, l: Lang) => x.text[l][x.text[l].length - 1].segments.map((s) => s.text).join('');
    const options = mulberry32(deriveSeed(seed, 'cq3')).shuffle([
      { text: { tr: q(p, 'tr'), ku: q(p, 'ku'), en: q(p, 'en') }, fits: true },
      { text: { tr: q(other, 'tr'), ku: q(other, 'ku'), en: q(other, 'en') }, fits: q(other, 'tr') === q(p, 'tr') },
    ]);
    return { kind: 'completeQuestion' as const, problem: story, fullProblem: p, options, instruction: INSTR.complete };
  },
};

// ─── Çözülebilirlik denetimi ───────────────────────────────────────────────

const QWORD: Record<Lang, RegExp> = { tr: /(^|[\s,])(kaç|ne kadar)/iu, ku: /(^|[\s,])(çend|çiqas)/iu, en: /(^|[\s,])(how many|how much|how long)/i };

export function checkPosedProblem(
  draft: { schema: SchemaId; sentences: string[]; hasQuestion: boolean; numbers: number[] },
  lang: Lang,
): { solvable: boolean; issues: L10n[] } {
  const issues: L10n[] = [];
  const qs = draft.sentences.filter((s) => s.trim().endsWith('?'));
  if (!draft.hasQuestion && !qs.length) issues.push(T('Soru cümlesi yok. Hikâyenin sonuna bir soru ekle.', 'Hevoka pirsê tune. Li dawiya çîrokê pirsekê zêde bike.', 'There is no question. Add a question at the end of the story.'));
  else if (qs.length && !qs.some((s) => QWORD[lang].test(s))) issues.push(T('Soru bir sayı sormuyor ("kaç", "ne kadar").', 'Pirs hejmarekê napirse ("çend", "çiqas").', 'The question does not ask for a number ("how many", "how much").'));
  const nums = draft.numbers.filter((n) => Number.isFinite(n));
  if (nums.length < 2) issues.push(T('Çözmek için en az iki sayı gerekli.', 'Ji bo çareserkirinê herî kêm du hejmar lazim in.', 'At least two numbers are needed to solve it.'));
  if (nums.some((n) => !Number.isInteger(n) || n <= 0)) issues.push(T('Sayılar sıfırdan büyük tam sayı olmalı.', 'Divê hejmar ji sifirê mezintir û tam bin.', 'The numbers should be whole numbers greater than zero.'));
  const all = draft.sentences.join(' ');
  for (const n of nums) if (!new RegExp(`(^|\\D)${n}(\\D|$)`).test(all)) issues.push({ tr: `${n} sayısı cümlelerde geçmiyor.`, ku: `Hejmara ${n} di hevokan de tune.`, en: `The number ${n} is not in the sentences.` });
  if (draft.schema === 'compare' && nums.length >= 2 && new Set(nums).size < nums.length) issues.push(T('Karşılaştırmada iki miktar farklı olmalı.', 'Di berhevdanê de divê du hejmar cuda bin.', 'In a comparison the two amounts should be different.'));
  if (draft.schema === 'equalGroups' && nums.some((n) => n === 1)) issues.push(T('Eşit gruplarda 1 yerine en az 2 kullan.', 'Di komên wekhev de li şûna 1 herî kêm 2 bi kar bîne.', 'Use at least 2 instead of 1 in equal groups.'));
  if (draft.schema === 'multCompare' && nums.length >= 2 && Math.min(...nums) < 2) issues.push(T('Kat en az 2 olmalı.', 'Divê car herî kêm 2 be.', 'The "times" number should be at least 2.'));
  return { solvable: issues.length === 0, issues };
}
