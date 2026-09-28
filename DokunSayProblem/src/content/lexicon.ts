/**
 * Ad ve nesne sözlüğü (04 §E.1 ad havuzu; §E.2 bağlam havuzu).
 * Her ad: TR yazımı (Türk alfabesi), KU yazımı (Kurmancî), cinsiyet (KU oblik için).
 * Her nesne: TR (yumuşama/uyum istisnası hazır), KU (yalın/ezafe/oblik hazır), EN (tekil/çoğul).
 */
import type { L10n } from './types';
import type { TrNoun } from './grammar/tr';
import type { KuNoun } from './grammar/ku';
import type { EnNoun } from './grammar/en';
import { kuOblique } from './grammar/ku';
import type { Rng } from './rng';

export interface Person {
  tr: string;
  ku: string;
  en: string;
  g: 'f' | 'm';
  /** Kurmancî oblik (hazır). */
  kuObl: string;
}

const P = (tr: string, g: 'f' | 'm', ku = tr, kuObl?: string): Person => ({
  tr, ku, en: tr, g, kuObl: kuObl ?? kuOblique(ku, g),
});

/** 04 §E.1: kız/erkek dengeli; TR yaygın + Kurmancî adlar (kısa adlar). */
export const PEOPLE: readonly Person[] = [
  // TR yaygın — kız
  P('Zeynep', 'f'), P('Elif', 'f', 'Elîf'), P('Defne', 'f'), P('Asel', 'f'), P('Eylül', 'f'), P('Azra', 'f'),
  P('Nehir', 'f'), P('Ada', 'f'), P('Duru', 'f'), P('Meryem', 'f'), P('Ayşe', 'f'), P('Ela', 'f'),
  // TR yaygın — erkek
  P('Yusuf', 'm'), P('Ömer', 'm'), P('Kerem', 'm'), P('Emir', 'm', 'Emîr'), P('Ali', 'm', 'Elî', 'Elî'),
  P('Efe', 'm', 'Efe', 'Efe'), P('Can', 'm'), P('Arda', 'm', 'Arda', 'Arda'), P('Mert', 'm'), P('Aslan', 'm'),
  // KU — kız
  P('Rojda', 'f'), P('Berfin', 'f', 'Berfîn'), P('Zelal', 'f'), P('Dilan', 'f', 'Dîlan'), P('Jiyan', 'f'),
  P('Hevi', 'f', 'Hêvî'), P('Rojin', 'f', 'Rojîn'), P('Evin', 'f', 'Evîn'), P('Delal', 'f'), P('Şilan', 'f', 'Şîlan'),
  // KU — erkek
  P('Baran', 'm'), P('Azad', 'm'), P('Renas', 'm', 'Rênas'), P('Diyar', 'm'), P('Berzan', 'm'), P('Aram', 'm'),
  P('Miran', 'm', 'Mîran'), P('Hozan', 'm'), P('Zana', 'm', 'Zana', 'Zana'), P('Agit', 'm', 'Agît'), P('Serhat', 'm'),
];

/** Baş harfleri farklı iki/üç kişi (04 §E.1 ilke 4), cinsiyet dengeli. */
export function pickPeople(rng: Rng, count: 2 | 3 = 3): Person[] {
  const out: Person[] = [];
  const wantG: ('f' | 'm')[] = rng.chance(0.5) ? ['f', 'm', 'f'] : ['m', 'f', 'm'];
  for (let i = 0; i < count; i++) {
    const pool = PEOPLE.filter(
      (p) => p.g === wantG[i] && !out.some((o) => o.tr[0] === p.tr[0] || o.tr === p.tr),
    );
    out.push(rng.pick(pool.length ? pool : PEOPLE.filter((p) => !out.includes(p))));
  }
  return out;
}

// ─── NESNELER ──────────────────────────────────────────────────────────────

export interface Noun {
  id: string;
  tr: TrNoun;
  ku: KuNoun;
  en: EnNoun;
}

const N = (id: string, tr: TrNoun, ku: KuNoun, en: EnNoun): Noun => ({ id, tr, ku, en });
const K = (w: string, ez?: string, obl?: string, sobl?: string): KuNoun => ({
  w, ez: ez ?? `${w}ên`, obl: obl ?? `${w}an`, sobl: sobl ?? `${w}ê`,
});

// KU-DENETİM: nesne adlarının Kurmancî karşılıkları (özellikle kulîçe, sîmît, tebax, çûk, lîre, lître).
export const NOUNS = {
  kalem: N('kalem', { w: 'kalem' }, K('pênûs'), { sg: 'pencil', pl: 'pencils' }),
  kitap: N('kitap', { w: 'kitap', soft: 'kitab' }, K('pirtûk'), { sg: 'book', pl: 'books' }),
  defter: N('defter', { w: 'defter' }, K('defter'), { sg: 'notebook', pl: 'notebooks' }),
  kart: N('kart', { w: 'kart' }, K('kart'), { sg: 'card', pl: 'cards' }),
  balon: N('balon', { w: 'balon' }, K('balon'), { sg: 'balloon', pl: 'balloons' }),
  top: N('top', { w: 'top' }, K('top'), { sg: 'ball', pl: 'balls' }),
  ceviz: N('ceviz', { w: 'ceviz' }, K('gûz'), { sg: 'walnut', pl: 'walnuts' }),
  elma: N('elma', { w: 'elma' }, K('sêv'), { sg: 'apple', pl: 'apples' }),
  armut: N('armut', { w: 'armut' }, K('hirmî', 'hirmiyên', 'hirmiyan', 'hirmiyê'), { sg: 'pear', pl: 'pears' }),
  meyve: N('meyve', { w: 'meyve' }, K('fêkî', 'fêkiyên', 'fêkiyan', 'fêkiyê'), { sg: 'piece of fruit', pl: 'pieces of fruit' }),
  cicek: N('cicek', { w: 'çiçek', soft: 'çiçeğ' }, K('kulîlk'), { sg: 'flower', pl: 'flowers' }),
  lale: N('lale', { w: 'lale' }, K('lale', 'laleyên', 'laleyan', 'laleyê'), { sg: 'tulip', pl: 'tulips' }),
  kus: N('kus', { w: 'kuş' }, K('çûk'), { sg: 'bird', pl: 'birds' }),
  yumurta: N('yumurta', { w: 'yumurta' }, K('hêk'), { sg: 'egg', pl: 'eggs' }),
  kurabiye: N('kurabiye', { w: 'kurabiye' }, K('kulîçe', 'kulîçeyên', 'kulîçeyan', 'kulîçeyê'), { sg: 'biscuit', pl: 'biscuits' }),
  simit: N('simit', { w: 'simit', soft: 'simid' }, K('sîmît'), { sg: 'simit', pl: 'simits' }),
  yolcu: N('yolcu', { w: 'yolcu' }, K('rêwî', 'rêwiyên', 'rêwiyan', 'rêwiyê'), { sg: 'passenger', pl: 'passengers' }),
  ogrenci: N('ogrenci', { w: 'öğrenci' }, K('xwendekar'), { sg: 'pupil', pl: 'pupils' }),
  cocuk: N('cocuk', { w: 'çocuk', soft: 'çocuğ' }, K('zarok'), { sg: 'child', pl: 'children' }),
  koyun: N('koyun', { w: 'koyun' }, K('mî', 'miyên', 'miyan', 'miyê'), { sg: 'sheep', pl: 'sheep' }),
  keci: N('keci', { w: 'keçi' }, K('bizin'), { sg: 'goat', pl: 'goats' }),
  hayvan: N('hayvan', { w: 'hayvan' }, K('heywan'), { sg: 'animal', pl: 'animals' }),
  fidan: N('fidan', { w: 'fidan' }, K('şitil'), { sg: 'sapling', pl: 'saplings' }),
  sise: N('sise', { w: 'şişe' }, K('şûşe', 'şûşeyên', 'şûşeyan', 'şûşeyê'), { sg: 'bottle', pl: 'bottles' }),
  misket: N('misket', { w: 'misket' }, K('gulok'), { sg: 'marble', pl: 'marbles' }),
  balik: N('balik', { w: 'balık', soft: 'balığ' }, K('masî', 'masiyên', 'masiyan', 'masiyê'), { sg: 'fish', pl: 'fish' }),
  sayfa: N('sayfa', { w: 'sayfa' }, K('rûpel'), { sg: 'page', pl: 'pages' }),
  basket: N('basket', { w: 'basket' }, K('basket'), { sg: 'basket', pl: 'baskets' }),
  // birimler
  tl: N('tl', { w: 'TL', read: 'tele' }, K('lîre', 'lîreyên', 'lîreyan', 'lîreyê'), { sg: 'lira', pl: 'lira' }),
  dakika: N('dakika', { w: 'dakika' }, K('deqe', 'deqeyên', 'deqeyan', 'deqeyê'), { sg: 'minute', pl: 'minutes' }),
  metre: N('metre', { w: 'metre' }, K('metre', 'metreyên', 'metreyan', 'metreyê'), { sg: 'metre', pl: 'metres' }),
  litre: N('litre', { w: 'litre' }, K('lître', 'lîtreyên', 'lîtreyan', 'lîtreyê'), { sg: 'litre', pl: 'litres' }),
  yas: N('yas', { w: 'yaş' }, K('sal'), { sg: 'year', pl: 'years' }),
  // kaplar
  tabak: N('tabak', { w: 'tabak', soft: 'tabağ' }, K('tebax', 'tebaxên', 'tebaxan', 'tebaxê'), { sg: 'plate', pl: 'plates' }),
  kutu: N('kutu', { w: 'kutu' }, K('qutî', 'qutiyên', 'qutiyan', 'qutiyê'), { sg: 'box', pl: 'boxes' }),
  paket: N('paket', { w: 'paket' }, K('pakêt'), { sg: 'packet', pl: 'packets' }),
  sepet: N('sepet', { w: 'sepet' }, K('selik'), { sg: 'basket', pl: 'baskets' }),
  vazo: N('vazo', { w: 'vazo' }, K('guldank'), { sg: 'vase', pl: 'vases' }),
  minibus: N('minibus', { w: 'minibüs' }, K('mînîbûs'), { sg: 'minibus', pl: 'minibuses' }),
  sira: N('sira', { w: 'sıra' }, K('rêz'), { sg: 'row', pl: 'rows' }),
  raf: N('raf', { w: 'raf' }, K('ref', 'refên', 'refan', 'refê'), { sg: 'shelf', pl: 'shelves' }),
  koli: N('koli', { w: 'koli' }, K('qutî', 'qutiyên', 'qutiyan', 'qutiyê'), { sg: 'carton', pl: 'cartons' }),
  takim: N('takim', { w: 'takım' }, K('tîm'), { sg: 'team', pl: 'teams' }),
  kova: N('kova', { w: 'kova' }, K('satil'), { sg: 'bucket', pl: 'buckets' }),
} as const satisfies Record<string, Noun>;

export type NounKey = keyof typeof NOUNS;

/** TR yalın biçimden sözlük girdisi (posing/paraphrase için). */
export function nounByTr(word: string): Noun | undefined {
  return (Object.values(NOUNS) as Noun[]).find((n) => n.tr.w === word);
}

export const L = (tr: string, ku: string, en: string): L10n => ({ tr, ku, en });
