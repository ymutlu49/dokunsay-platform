/**
 * İlişki sözcükleri — dokun-öğren (DESIGN §7 "Sözcük kartları"; 03 §C12).
 * Açıklamalar ANLAMI anlatır; işlem ÖNERMEZ ("fazla = topla" türü eşleme YOK).
 * KU karşılıkları FerMat (ji … zêdetir/kêmtir, bi giştî, her yek, jêma, dimîne, nîv, car).
 */
import type { Lang, L10n, Sentence } from './types';
import { sentenceText } from './text';

export interface VocabEntry {
  id: string;
  word: L10n;
  explain: L10n;
  example: L10n;
  icon: string;
}

const V = (id: string, word: L10n, explain: L10n, example: L10n, icon: string): VocabEntry => ({ id, word, explain, example, icon });
const T = (tr: string, ku: string, en: string): L10n => ({ tr, ku, en });

// KU-DENETİM: sözcük kartı açıklama cümleleri.
export const VOCAB: VocabEntry[] = [
  V('more', T('fazla', 'zêdetir', 'more'), T('İki miktar karşılaştırılırken büyük olanın ne kadar büyük olduğunu söyler.', 'Dema du hejmar tên berhevdan, dibêje ya mezin çiqas mezintir e.', 'When two amounts are compared, it tells how much bigger the bigger one is.'), T('Can\'ın, Ela\'dan 3 fazla bilyesi var.', 'Canî 3 gulok ji Elayê zêdetir hene.', 'Can has 3 more marbles than Ela.'), 'more'),
  V('fewer', T('az', 'kêmtir', 'fewer'), T('İki miktar karşılaştırılırken küçük olanın ne kadar küçük olduğunu söyler.', 'Dema du hejmar tên berhevdan, dibêje ya biçûk çiqas biçûktir e.', 'When two amounts are compared, it tells how much smaller the smaller one is.'), T('Ela\'nın, Can\'dan 3 az bilyesi var.', 'Elayê 3 gulok ji Canî kêmtir hene.', 'Ela has 3 fewer marbles than Can.'), 'fewer'),
  V('total', T('toplam', 'bi giştî', 'altogether'), T('Hepsinin birlikte ne kadar olduğunu anlatır. Bazen hikâye toplamı söyler, parçayı sorar.', 'Dibêje hemû bi hev re çiqas in. Carinan çîrok giştê dibêje û parçeyê dipirse.', 'It tells how many there are all together. Sometimes the story gives the total and asks for a part.'), T('Sepette toplam 10 meyve var.', 'Di selikê de bi giştî 10 fêkî hene.', 'There are 10 pieces of fruit in the basket altogether.'), 'total'),
  V('difference', T('fark', 'kemok', 'difference'), T('İki miktarın arasındaki boşluktur: küçüğün büyüğe yetişmesi için gereken miktar.', 'Valahiya di navbera du hejmaran de ye: ya ku ji bo gihîştina ya biçûk bi ya mezin re lazim e.', 'It is the gap between two amounts: how much the smaller one needs to reach the bigger one.'), T('9 ile 5 arasındaki fark 4\'tür.', 'Kemoka di navbera 9 û 5 de 4 e.', 'The difference between 9 and 5 is 4.'), 'difference'),
  V('each', T('her biri', 'her yek', 'each'), T('Grupların hepsinde aynı sayıda şey olduğunu anlatır.', 'Dibêje di her komê de heman hejmar tişt hene.', 'It says every group has the same number of things.'), T('Her tabakta 3 kurabiye var.', 'Di her tebaxê de 3 kulîçe hene.', 'Each plate has 3 biscuits.'), 'each'),
  V('equal', T('eşit', 'wekhev', 'equal'), T('İki miktarın aynı olduğunu anlatır.', 'Dibêje du hejmar wek hev in.', 'It says two amounts are the same.'), T('Kurabiyeleri tabaklara eşit paylaştırdı.', 'Kulîçe bi wekhevî li tebaxan par kirin.', 'The biscuits were shared equally.'), 'equal'),
  V('left', T('kaldı', 'man', 'left'), T('Bir şey olduktan sonra geriye ne olduğunu anlatır. Bazen hikâye kalanı söyler, baştakini sorar.', 'Dibêje piştî ku tiştek qewimî çi dimîne. Carinan çîrok ya mayî dibêje û ya destpêkê dipirse.', 'It tells what is there after something happened. Sometimes the story gives what is left and asks about the start.'), T('Tepside 5 simit kaldı.', '5 sîmît li ser sêniyê man.', '5 simits are left on the tray.'), 'left'),
  V('remainder', T('artan', 'jêma', 'left over'), T('Eşit gruplar yapıldıktan sonra hiçbir gruba girmeyen miktardır.', 'Piştî çêkirina komên wekhev, ya ku nakeve tu komê ye.', 'After making equal groups, it is the amount that fits in no group.'), T('14 cevizi 4 kişiye paylaştırınca 2 ceviz arttı.', 'Dema 14 gûz li 4 kesan hatin parkirin, 2 gûz jêma man.', 'When 14 walnuts were shared among 4 people, 2 were left over.'), 'remainder'),
  V('times', T('katı', 'car', 'times'), T('Bir miktarın, ötekinin kaç tanesi kadar olduğunu anlatır. "3 katı", "3 fazla" ile aynı değildir.', 'Dibêje hejmarek çend caran qasî ya din e. "3 car" ne wek "3 zêdetir" e.', 'It says how many copies of one amount make the other. "3 times" is not the same as "3 more".'), T('Ayaz\'ın misketi, Ada\'nınkinin 3 katı.', 'Guloka Ayazî 3 carê ya Adayê ye.', 'Ayaz has 3 times as many marbles as Ada.'), 'times'),
  V('half', T('yarısı', 'nîv', 'half'), T('Bir bütünü iki eşit parçaya ayırınca bir parçasıdır.', 'Dema giştek li du parçeyên wekhev tê parkirin, parçeyek e.', 'It is one part when a whole is split into two equal parts.'), T('12\'nin yarısı 6\'dır.', 'Nîvê 12an 6 e.', 'Half of 12 is 6.'), 'half'),
  V('also', T('daha', 'din jî', 'more / another'), T('Önceki miktarın yanına yenisinin geldiğini ya da iki şeyden birinin öne çıktığını anlatır.', 'Dibêje ku yeke nû li kêleka ya berê hat an yek ji du tiştan pêş de ye.', 'It says something new joined what was there, or one of two things stands out.'), T('Sonra 3 kuş daha kondu.', 'Paşê 3 çûkên din jî hatin.', 'Then 3 more birds landed.'), 'also'),
  V('all', T('hepsi', 'hemû', 'all'), T('Grubun içindeki her şeyi birlikte anlatır.', 'Hemû tiştên di komê de bi hev re dibêje.', 'It means every thing in the group together.'), T('Hepsi için kaç kutu gerekir?', 'Ji bo hemûyan çend qutî lazim in?', 'How many boxes are needed for all of them?'), 'all'),
  V('start', T('başta', 'di destpêkê de', 'at the start'), T('Hikâyede bir şey olmadan önceki durumu anlatır.', 'Rewşa berî ku tiştek biqewime dibêje.', 'It tells how things were before anything happened.'), T('Başta otobüste kaç yolcu vardı?', 'Di destpêkê de di otobusê de çend rêwî hebûn?', 'How many passengers were on the bus at the start?'), 'start'),
  V('asMuch', T('kadar', 'qasî', 'as many as'), T('İki miktarın aynı büyüklükte olmasını anlatır.', 'Dibêje du hejmar bi heman mezinahiyê ne.', 'It says two amounts are the same size.'), T('Mert, Deniz kadar kart istiyor.', 'Mert qasî Deniz kartan dixwaze.', 'Mert wants as many cards as Deniz.'), 'asMuch'),
];

/** Sözcük eşleme kalıpları (büyük/küçük harf duyarsız, sözcük sınırlı). */
const MATCH: Record<string, Record<Lang, string[]>> = {
  more: { tr: ['fazla'], ku: ['zêdetir'], en: ['more'] },
  fewer: { tr: ['az', 'eksik'], ku: ['kêmtir'], en: ['fewer', 'less'] },
  total: { tr: ['toplam'], ku: ['bi giştî'], en: ['altogether', 'in total'] },
  difference: { tr: ['fark'], ku: ['kemok'], en: ['difference'] },
  each: { tr: ['her'], ku: ['her'], en: ['each'] },
  equal: { tr: ['eşit'], ku: ['wekhevî', 'wekhev'], en: ['equally', 'equal'] },
  left: { tr: ['kaldı', 'kalan'], ku: ['man', 'ma', 'dimînin'], en: ['left'] },
  remainder: { tr: ['artar', 'arttı', 'artan', 'artanlar', 'artanları'], ku: ['jêma', 'zêde dimînin'], en: ['left over'] },
  times: { tr: ['katı'], ku: ['carê'], en: ['times'] },
  half: { tr: ['yarısı'], ku: ['nîvê'], en: ['half'] },
  also: { tr: ['daha'], ku: ['din jî'], en: [] },
  all: { tr: ['hepsi', 'hepsine', 'hepsi için'], ku: ['hemû', 'hemûyan'], en: ['all'] },
  start: { tr: ['başta'], ku: ['di destpêkê de'], en: ['at the start'] },
  asMuch: { tr: ['kadar'], ku: ['qasî'], en: ['as many', 'as much'] },
};

const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** Cümledeki ilişki sözcüklerinin konumları (sentenceText üzerinde; dokun-öğren için). */
export function vocabInSentence(s: Sentence, lang: Lang): { start: number; end: number; id: string }[] {
  const text = sentenceText(s);
  const out: { start: number; end: number; id: string }[] = [];
  for (const [id, pats] of Object.entries(MATCH)) {
    for (const w of [...pats[lang]].sort((a, b) => b.length - a.length)) {
      const re = new RegExp(`(?<![\\p{L}'’])${esc(w)}(?![\\p{L}])`, 'giu');
      for (const m of text.matchAll(re)) {
        const start = m.index ?? 0;
        const end = start + m[0].length;
        if (!out.some((o) => start < o.end && end > o.start)) out.push({ start, end, id });
      }
    }
  }
  return out.sort((a, b) => a.start - b.start);
}
