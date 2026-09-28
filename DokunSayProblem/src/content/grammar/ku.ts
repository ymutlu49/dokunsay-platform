/**
 * Kurmancî yardımcıları.
 *
 * Sayı adları FerMat kanonik (`_platform/shared/fermat-terms.ku.js`): 90 = "not" (Galaksay'daki
 * "nod" değil), 100 = "sed", 1000 = "hezar". Bileşikler " û " ile.
 *
 * Küçük kural tablosu (04 §E.3; genel Kurmancî dilbilgisi — ANA DİL DENETİMİ GEREKLİ):
 *  | Yapı                    | Kalıp                                  | Örnek                          |
 *  |-------------------------|----------------------------------------|--------------------------------|
 *  | Özel ad oblik (dişil)   | ünlüyle biten +yê, ünsüzle biten +ê    | Rojda → Rojdayê, Berfîn → Berfînê |
 *  | Özel ad oblik (eril)    | ünsüzle biten +î, ünlüyle biten aynı   | Baran → Baranî, Zana → Zana    |
 *  | Sahiplik (durum)        | OBL + sayı + ad (tekil) + hene/hebûn   | Rojdayê 5 pênûs hene.          |
 *  | Sayı + ad               | sayıdan sonra ad yalın, çoğul eki yok  | pênc sêv                        |
 *  | Ezafe çoğul (belirli)   | ad + -ên + OBL                         | pênûsên Baranî                 |
 *  | Geçişli geçmiş (ergatif)| eyleyen OBL, fiil NESNEYLE uyuşur       | Baranî 3 pênûs dan Rojdayê.    |
 *  | Geçişsiz geçmiş         | özne yalın, fiil özneyle uyuşur        | 4 rêwî peya bûn.               |
 *  | Karşılaştırma           | ji + OBL + zêdetir / kêmtir            | ji Rojdayê 3 zêdetir           |
 * Üreteç bu kalıpları sözlükten (lexicon.ts) hazır biçimlerle doldurur; çalışma anında
 * yalnız oblik ek türetilir. // KU-DENETİM: oblik türetme kuralı ana dil denetimi bekliyor.
 */

const ONES = ['sifir', 'yek', 'du', 'sê', 'çar', 'pênc', 'şeş', 'heft', 'heşt', 'neh', 'deh',
  'yazde', 'dazde', 'sêzde', 'çarde', 'pazde', 'şazde', 'hivde', 'hijde', 'nozde'];
const TENS = ['', '', 'bîst', 'sî', 'çil', 'pêncî', 'şêst', 'heftê', 'heştê', 'not'];

export function numWordKu(n: number): string {
  if (!Number.isInteger(n) || n < 0) return String(n);
  if (n < 20) return ONES[n];
  if (n < 100) return n % 10 ? `${TENS[Math.floor(n / 10)]} û ${ONES[n % 10]}` : TENS[n / 10];
  if (n < 1000) {
    const h = Math.floor(n / 100);
    const hw = h === 1 ? 'sed' : `${ONES[h]} sed`;
    return n % 100 ? `${hw} û ${numWordKu(n % 100)}` : hw;
  }
  if (n < 1_000_000) {
    const th = Math.floor(n / 1000);
    const tw = th === 1 ? 'hezar' : `${numWordKu(th)} hezar`;
    return n % 1000 ? `${tw} û ${numWordKu(n % 1000)}` : tw;
  }
  return String(n);
}

export const fmtKu = (n: number): string =>
  Number.isInteger(n) && n >= 1000 ? n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') : String(n);

const KU_VOWELS = 'aeêiîouû';

/** Özel ad oblik biçimi. // KU-DENETİM: eril ünlü sonlu adlarda oblik biçim (Zana) doğrulanmalı. */
export function kuOblique(name: string, g: 'f' | 'm'): string {
  const last = name[name.length - 1].toLowerCase();
  const vEnd = KU_VOWELS.includes(last);
  if (g === 'f') return vEnd ? `${name}yê` : `${name}ê`;
  return vEnd ? name : `${name}î`;
}

export interface KuNoun {
  /** Yalın: "pênûs" (sayıdan sonra bu biçim). */
  w: string;
  /** Çoğul ezafe: "pênûsên" (… Baranî). */
  ez: string;
  /** Çoğul oblik: "pênûsan". */
  obl: string;
  /** Tekil oblik / bulunma kalıbı içi: "qutiyê" (di qutiyê de). */
  sobl?: string;
}

export const capKu = (s: string): string => (s.length ? s.charAt(0).toLocaleUpperCase('tr-TR') + s.slice(1) : s);
