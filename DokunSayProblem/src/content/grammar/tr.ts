/**
 * Türkçe biçimbilim yardımcıları (Galaksay `numWords.js` port + genişletme).
 *
 * 04 §D.3 kural 7-8: ünsüz yumuşaması ve kaynaştırma "hazır sözlükten" gelir — ad girdisi
 * `soft` (ünlüyle başlayan ek öncesi gövde: kitap→kitab) ve gerekirse `v` (uyum ünlüsü; saat→e)
 * taşır; bu dosya yalnız DÜZENLİ kuralları uygular. Özel adlar yazımda yumuşamaz (Zeynep'i).
 * Sayı ekleri sayının OKUNUŞUNA göre uyar ("5'ten", "6'dan", "3'ün", "2'sini").
 */

const VOWELS = 'aeıioöuü';
const VOICELESS = 'çfhkpsşt';

/** Kurmancî/düzeltme işaretli harfleri Türkçe uyum ünlüsüne indir; büyük harfleri Türkçe küçült. */
function norm(ch: string): string {
  const map: Record<string, string> = {
    â: 'a', ê: 'e', î: 'i', û: 'u', Â: 'a', Ê: 'e', Î: 'i', Û: 'u',
    A: 'a', E: 'e', I: 'ı', İ: 'i', O: 'o', Ö: 'ö', U: 'u', Ü: 'ü',
  };
  return map[ch] ?? ch.toLocaleLowerCase('tr-TR');
}

export const isVowel = (ch: string): boolean => VOWELS.includes(norm(ch));

export function lastVowel(w: string): string {
  for (let i = w.length - 1; i >= 0; i--) {
    const c = norm(w[i]);
    if (VOWELS.includes(c)) return c;
  }
  return 'e';
}

const lastLetter = (w: string): string => {
  for (let i = w.length - 1; i >= 0; i--) if (/\p{L}/u.test(w[i])) return norm(w[i]);
  return '';
};

/** Dörtlü uyum: ı/i/u/ü */
export const h4 = (v: string): string =>
  'ei'.includes(v) ? 'i' : 'aı'.includes(v) ? 'ı' : 'ou'.includes(v) ? 'u' : 'ü';
/** İkili uyum: a/e */
export const h2 = (v: string): string => ('eiöü'.includes(v) ? 'e' : 'a');

export const endsVowel = (w: string): boolean => isVowel(lastLetter(w));
const endsVoiceless = (w: string): boolean => VOICELESS.includes(lastLetter(w));

export const capFirst = (s: string): string =>
  s.length ? s.charAt(0).toLocaleUpperCase('tr-TR') + s.slice(1) : s;

// ─── SAYI OKUNUŞU ──────────────────────────────────────────────────────────

const ONES = ['sıfır', 'bir', 'iki', 'üç', 'dört', 'beş', 'altı', 'yedi', 'sekiz', 'dokuz'];
const TENS = ['', 'on', 'yirmi', 'otuz', 'kırk', 'elli', 'altmış', 'yetmiş', 'seksen', 'doksan'];

/** 0–999 999 arası Türkçe okunuş ("bin iki yüz elli"). */
export function numWord(n: number): string {
  if (!Number.isInteger(n) || n < 0) return String(n);
  if (n < 10) return ONES[n];
  if (n < 100) {
    const t = TENS[Math.floor(n / 10)];
    return n % 10 ? `${t} ${ONES[n % 10]}` : t;
  }
  if (n < 1000) {
    const h = Math.floor(n / 100);
    const hw = h === 1 ? 'yüz' : `${ONES[h]} yüz`;
    return n % 100 ? `${hw} ${numWord(n % 100)}` : hw;
  }
  if (n < 1_000_000) {
    const th = Math.floor(n / 1000);
    const tw = th === 1 ? 'bin' : `${numWord(th)} bin`;
    return n % 1000 ? `${tw} ${numWord(n % 1000)}` : tw;
  }
  return String(n);
}

/** Rakamla yazım: 4 basamaktan itibaren binlik nokta (04 §D.2: 1.250). */
export function fmtTr(n: number): string {
  if (!Number.isInteger(n)) return String(n).replace('.', ',');
  return n >= 1000 ? n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') : String(n);
}

const lastReadWord = (n: number): string => {
  const parts = numWord(n).split(' ');
  return parts[parts.length - 1];
};

/** Sayının ek-başı bilgisi (okunuşa göre). */
function numInfo(n: number) {
  const w = lastReadWord(n);
  return { v: lastVowel(w), vEnd: endsVowel(w), hard: endsVoiceless(w) };
}

/** Ayrılma: 5'ten, 6'dan, 20'den, 40'tan */
export const numAbl = (n: number): string => {
  const i = numInfo(n);
  return `${fmtTr(n)}'${i.hard ? 't' : 'd'}${h2(i.v)}n`;
};
/** Bulunma: 5'te, 6'da */
export const numLoc = (n: number): string => {
  const i = numInfo(n);
  return `${fmtTr(n)}'${i.hard ? 't' : 'd'}${h2(i.v)}`;
};
/** Yönelme: 2'ye, 5'e, 6'ya, 10'a */
export const numDat = (n: number): string => {
  const i = numInfo(n);
  return `${fmtTr(n)}'${i.vEnd ? 'y' : ''}${h2(i.v)}`;
};
/** Belirtme: 2'yi, 5'i, 6'yı, 9'u */
export const numAcc = (n: number): string => {
  const i = numInfo(n);
  return `${fmtTr(n)}'${i.vEnd ? 'y' : ''}${h4(i.v)}`;
};
/** Tamlayan: 2'nin, 3'ün, 5'in, 6'nın */
export const numGen = (n: number): string => {
  const i = numInfo(n);
  return `${fmtTr(n)}'${i.vEnd ? 'n' : ''}${h4(i.v)}n`;
};
/** İyelik 3 ("tanesi"): 2'si, 3'ü, 4'ü, 6'sı, 10'u */
export const numPoss3 = (n: number): string => {
  const i = numInfo(n);
  return `${fmtTr(n)}'${i.vEnd ? 's' : ''}${h4(i.v)}`;
};
/** İyelik 3 + belirtme: 2'sini, 4'ünü, 6'sını */
export const numPoss3Acc = (n: number): string => {
  const i = numInfo(n);
  const x = h4(i.v);
  return `${fmtTr(n)}'${i.vEnd ? 's' : ''}${x}n${x}`;
};
/** İyelik 3 + yönelme: 2'sine, 4'üne */
export const numPoss3Dat = (n: number): string => {
  const i = numInfo(n);
  const x = h4(i.v);
  return `${fmtTr(n)}'${i.vEnd ? 's' : ''}${x}n${h2(x)}`;
};
/** Üleştirme: 2'şer, 3'er, 4'er, 6'şar, 9'ar */
export const numDist = (n: number): string => {
  const i = numInfo(n);
  return `${fmtTr(n)}'${i.vEnd ? 'ş' : ''}${h2(i.v)}r`;
};

// ─── ÖZEL ADLAR (kesme işaretiyle) ─────────────────────────────────────────

/** Tamlayan: Ela'nın, Ali'nin, Kerem'in, Mîr'in, Yusuf'un */
export const nameGen = (n: string): string => `${n}'${endsVowel(n) ? 'n' : ''}${h4(lastVowel(n))}n`;
/** Yönelme: Ela'ya, Ali'ye, Kerem'e */
export const nameDat = (n: string): string => `${n}'${endsVowel(n) ? 'y' : ''}${h2(lastVowel(n))}`;
/** Belirtme: Ela'yı, Kerem'i */
export const nameAcc = (n: string): string => `${n}'${endsVowel(n) ? 'y' : ''}${h4(lastVowel(n))}`;
/** Bulunma: Ela'da, Yusuf'ta */
export const nameLoc = (n: string): string => `${n}'${endsVoiceless(n) ? 't' : 'd'}${h2(lastVowel(n))}`;
/** Ayrılma: Ela'dan, Kerem'den, Yusuf'tan */
export const nameAbl = (n: string): string => `${nameLoc(n)}n`;
/** Karşılaştırma ablatifi: Ela'nınkinden (1–2. sınıfta kullanılmaz; 04 §D.3 kural 9) */
export const nameKiAbl = (n: string): string => `${nameGen(n)}kinden`;
/** Ela'nınkinin (… 3 katı) */
export const nameKiGen = (n: string): string => `${nameGen(n)}kinin`;
/** de/da bağlacı: "Can da", "Ela da" */
export const nameDA = (n: string): string => (h2(lastVowel(n)) === 'e' ? 'de' : 'da');

// ─── CİNS ADLAR ────────────────────────────────────────────────────────────

export interface TrNoun {
  /** Yalın tekil: "kalem", "kitap", "TL" */
  w: string;
  /** Ünlüyle başlayan ek öncesi gövde (yumuşama): kitap→"kitab", çiçek→"çiçeğ". */
  soft?: string;
  /** Uyum ünlüsü istisnası (saat→'e'). */
  v?: string;
  /** Kısaltma okunuşu ("TL" → "tele"); ekler kesmeyle ve okunuşa göre gelir. */
  read?: string;
}

function nInfo(n: TrNoun) {
  if (n.read) {
    return { base: n.w, stem: n.w, sep: "'", v: lastVowel(n.read), vEnd: endsVowel(n.read), hard: endsVoiceless(n.read) };
  }
  return { base: n.w, stem: n.soft ?? n.w, sep: '', v: n.v ?? lastVowel(n.w), vEnd: endsVowel(n.w), hard: endsVoiceless(n.w) };
}

/** İyelik 3. tekil: kalemi, elması, kitabı, TL'si */
export const poss3 = (n: TrNoun): string => {
  const i = nInfo(n);
  return i.vEnd ? `${i.base}${i.sep}s${h4(i.v)}` : `${i.stem}${i.sep}${h4(i.v)}`;
};
/** Belirtme: kalemi, elmayı, kitabı */
export const acc = (n: TrNoun): string => {
  const i = nInfo(n);
  return i.vEnd ? `${i.base}${i.sep}y${h4(i.v)}` : `${i.stem}${i.sep}${h4(i.v)}`;
};
/** Yönelme: kaleme, elmaya, tabağa */
export const dat = (n: TrNoun): string => {
  const i = nInfo(n);
  return i.vEnd ? `${i.base}${i.sep}y${h2(i.v)}` : `${i.stem}${i.sep}${h2(i.v)}`;
};
/** Tamlayan: kalemin, elmanın, ağacın */
export const gen = (n: TrNoun): string => {
  const i = nInfo(n);
  return i.vEnd ? `${i.base}${i.sep}n${h4(i.v)}n` : `${i.stem}${i.sep}${h4(i.v)}n`;
};
/** Bulunma: sepette, otobüste, kutuda */
export const loc = (n: TrNoun): string => {
  const i = nInfo(n);
  return `${i.base}${i.sep}${i.hard ? 't' : 'd'}${h2(i.v)}`;
};
/** Ayrılma: sepetten, kutudan */
export const abl = (n: TrNoun): string => `${loc(n)}n`;
/** Çoğul: kalemler, saatler */
export const pl = (n: TrNoun): string => {
  const i = nInfo(n);
  return `${i.base}${i.sep}l${h2(i.v)}r`;
};
/** Çoğul + iyelik 3 / çoğul belirtme: kalemleri, elmaları */
export const poss3Pl = (n: TrNoun): string => {
  const p = pl(n);
  return `${p}${h4(lastVowel(p))}`;
};
/** Çoğul + yönelme: tabaklara */
export const plDat = (n: TrNoun): string => {
  const p = pl(n);
  return `${p}${h2(lastVowel(p))}`;
};
/** Çoğul + bulunma: tabaklarda */
export const plLoc = (n: TrNoun): string => {
  const p = pl(n);
  return `${p}d${h2(lastVowel(p))}`;
};

const afterPoss = (n: TrNoun, suffix: (v: string) => string): string => {
  const p = poss3(n);
  return `${p}n${suffix(lastVowel(p))}`;
};
/** İyelik 3 + belirtme: kalemini, elmasını, TL'sini */
export const poss3Acc = (n: TrNoun): string => afterPoss(n, h4);
/** İyelik 3 + yönelme: kalemine */
export const poss3Dat = (n: TrNoun): string => afterPoss(n, h2);
/** İyelik 3 + bulunma: sepetinde, kutusunda */
export const poss3Loc = (n: TrNoun): string => afterPoss(n, (v) => `d${h2(v)}`);
/** İyelik 3 + ayrılma: kaleminden */
export const poss3Abl = (n: TrNoun): string => afterPoss(n, (v) => `d${h2(v)}n`);

/** Cümle içi sözcük sayımı (sınıf uzunluk sınırı için). */
export const wordCount = (s: string): number => s.trim().split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length;
