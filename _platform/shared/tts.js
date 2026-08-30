/**
 * DokunSay Platform — Ortak Text-to-Speech
 *
 * TEK SESLENDİRME YOLU. Uygulamalar KENDİ `new SpeechSynthesisUtterance` çağrılarını
 * yapmaz; hepsi buradan geçer. (2026-07-19 denetimi: 5 uygulamada yerel kopya vardı ve
 * beşi de farklı davranıyordu — aşağıya bak.)
 *
 * DENETİMDE BULUNAN VE BURADA KAPATILAN KUSURLAR
 * ───────────────────────────────────────────────
 * 1) SES AÇ/KAPA ÇALIŞMIYORDU: Clock, Kesir ve Veri yerel `speak`'leri `isTTSEnabled()`
 *    kontrolü yapmıyordu → A11y panelinden sesi kapatmak o üç uygulamada işe yaramıyordu.
 * 2) DİL YOK SAYILIYORDU: Clock her zaman "tr-TR" ile okuyordu; uygulama çok dilli
 *    olmasına rağmen İngilizce/Kurmancî oturumda da Türkçe sesle konuşuyordu.
 * 3) KURMANCÎ ÜÇ FARKLI ŞEKİLDE: Basamak `lang="ku"` (çoğu motorda karşılığı yok →
 *    sistem varsayılanına düşer, rastgele bir dil), Veri ve eski shared `tr-TR`.
 *    KARAR (kullanıcı, 2026-07-19): gerçek ku/kmr sesi yoksa SESSİZ kalınır. Türkçe sesle
 *    Kurmancî okumak sistematik olarak yanlış telaffuz modeli öğretir. Aynı karar SayKent'te
 *    de geçerli — iki proje aynı ilkeye bağlandı.
 * 4) HIZ TUTARSIZDI: 0.8 / 0.85 / 0.92. Standart (STANDARDS.md §1.4): rate 0.85, pitch 1.1.
 * 5) HAM METİN OKUNUYORDU: bkz. toSpeech() — matematik gösterimi ve emoji ayıklanmıyordu.
 */

// BCP 47 dil etiketleri.
const LANG_MAP = {
  tr: 'tr-TR',
  en: 'en-US',
  ku: 'ku',
  ar: 'ar-SA',
  fa: 'fa-IR',
};

const DEFAULT_VOICE_OPTS = {
  rate: 0.85,
  pitch: 1.1,
  volume: 1.0,
};

let enabled = true;

// ── Ses seçimi ────────────────────────────────────────────────────────────────
// getVoices() ilk çağrıda boş dönebilir (asenkron dolar) → voiceschanged dinlenir.
let voicesByPrefix = {};

function refreshVoices() {
  try {
    const list = window.speechSynthesis.getVoices() || [];
    const map = {};
    for (const v of list) {
      const p = (v.lang || '').toLowerCase();
      // Kurmancî motorlarda 'ku' ya da 'kmr' olarak görünebilir.
      const key = p.startsWith('kmr') ? 'ku' : p.slice(0, 2);
      if (key && !map[key]) map[key] = v;
    }
    voicesByPrefix = map;
  } catch (_) {
    voicesByPrefix = {};
  }
}

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  refreshVoices();
  try {
    window.speechSynthesis.addEventListener('voiceschanged', refreshVoices);
  } catch (_) {
    /* eski tarayıcı */
  }
}

/**
 * Bu dilde seslendirme YAPILABİLİR mi?
 * Arayüz 🔊 düğmelerini buna göre gizlemelidir — basıldığında hiçbir şey olmayan bir
 * düğme, sesin bozuk olduğunu değil uygulamanın bozuk olduğunu düşündürür.
 * ku: gerçek Kurmancî sesi yoksa false (yanlış model öğretmemek için — yukarı bak).
 */
export function canSpeak(lang = 'tr') {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return false;
  if (lang === 'ku') return Boolean(voicesByPrefix.ku);
  return true;
}

// ── Yazılan → Okunan ──────────────────────────────────────────────────────────
// Ekrandaki matematik gösterimi KONUŞULABİLİR DEĞİLDİR: çoğu TTS motoru '×', '+', '='
// işaretlerini sessizce atar ("4 × 7" → duyulan "4 7"), emoji adını ise okur
// ("Harika! 💡" → "…ampul"). İkisi de çocuğun duyduğu cümleyi bozar.
const TR_PAYDA = { 2: 'ikide', 3: 'üçte', 4: 'dörtte', 5: 'beşte', 6: 'altıda', 7: 'yedide', 8: 'sekizde', 9: 'dokuzda', 10: 'onda', 12: 'on ikide', 100: 'yüzde' };
const TR_SAYI = { 1: 'bir', 2: 'iki', 3: 'üç', 4: 'dört', 5: 'beş', 6: 'altı', 7: 'yedi', 8: 'sekiz', 9: 'dokuz', 10: 'on', 11: 'on bir', 12: 'on iki' };
const EN_PAYDA = { 2: 'half', 3: 'third', 4: 'quarter', 5: 'fifth', 6: 'sixth', 7: 'seventh', 8: 'eighth', 9: 'ninth', 10: 'tenth', 12: 'twelfth', 100: 'hundredth' };
const EN_SAYI = { 1: 'one', 2: 'two', 3: 'three', 4: 'four', 5: 'five', 6: 'six', 7: 'seven', 8: 'eight', 9: 'nine', 10: 'ten', 11: 'eleven', 12: 'twelve' };

// Kesir okunuşu ÇOCUK DİLİYLE: "1/4" → "bir bölü dört" DEĞİL, "dörtte bir".
// Kesir öğretiminin dili budur; 1/2 özel hâl: "yarım".
function kesir(a, b, lang) {
  if (lang === 'tr') {
    if (a === 1 && b === 2) return 'yarım';
    const p = TR_PAYDA[b], s = TR_SAYI[a];
    return p && s ? `${p} ${s}` : null;
  }
  if (lang === 'en') {
    const p = EN_PAYDA[b], s = EN_SAYI[a];
    return p && s ? `${s} ${p}${a > 1 ? 's' : ''}` : null;
  }
  return null; // tablo dışı / diğer diller: dokunma — yanlış okumaktansa ham bırak
}

const OPS = {
  tr: { '×': ' çarpı ', '÷': ' bölü ', '+': ' artı ', '−': ' eksi ', '=': ' eşittir ', '<': ' küçüktür ', '>': ' büyüktür ', '°': ' derece', '%': ' yüzde ' },
  en: { '×': ' times ', '÷': ' divided by ', '+': ' plus ', '−': ' minus ', '=': ' equals ', '<': ' is less than ', '>': ' is greater than ', '°': ' degrees', '%': ' percent ' },
};

const EMOJI = /[\u{1F000}-\u{1FAFF}\u{2190}-\u{21FF}\u{2300}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE00}-\u{FE0F}\u{200D}]/gu;

/** Ekranda yazan metni, çocuğun DUYMASI GEREKEN cümleye çevirir. */
export function toSpeech(text, lang = 'tr') {
  let t = String(text).replace(EMOJI, ' ');
  if (lang === 'tr' || lang === 'en') {
    // Kesirler önce: "3/8" bozulmadan yakalansın ('/' sonra başka anlam kazanmasın).
    t = t.replace(/(\d+)\s*\/\s*(\d+)/g, (m, a, b) => kesir(+a, +b, lang) ?? m);
    t = t.replace(/=\s*\?/g, lang === 'tr' ? ' eşittir kaç' : ' equals what');
    const ops = OPS[lang];
    t = t.replace(/[×÷+−=<>°%]/g, (c) => ops[c] ?? ' ');
  }
  // Uzun tire/ok = DURAKLAMA (eksi DEĞİL: "6 – 4 – 10" bir ayraçtır, çıkarma değil).
  t = t.replace(/\s*[–—→]\s*/g, ', ');
  return t.replace(/\s+/g, ' ').trim();
}

// ── Genel API ─────────────────────────────────────────────────────────────────
export function setTTSEnabled(on) {
  enabled = Boolean(on);
  if (!enabled) cancel();
}

export function isTTSEnabled() {
  return enabled;
}

export function speak(text, lang = 'tr', opts = {}) {
  if (!enabled) return;
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  if (!text) return;
  if (!canSpeak(lang)) return; // ku: gerçek ses yoksa SESSİZ

  cancel();

  const u = new SpeechSynthesisUtterance(toSpeech(text, lang));
  u.lang = LANG_MAP[lang] || LANG_MAP.tr;
  // Doğru sesi AÇIKÇA seç; yoksa motor sistem varsayılanına düşer (yanlış dil riski).
  const v = voicesByPrefix[lang === 'ku' ? 'ku' : (LANG_MAP[lang] || 'tr-TR').slice(0, 2)];
  if (v) u.voice = v;
  u.rate = opts.rate ?? DEFAULT_VOICE_OPTS.rate;
  u.pitch = opts.pitch ?? DEFAULT_VOICE_OPTS.pitch;
  u.volume = opts.volume ?? DEFAULT_VOICE_OPTS.volume;

  try {
    window.speechSynthesis.speak(u);
  } catch (_) {
    /* sessizce geç */
  }
}

export function cancel() {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  try {
    window.speechSynthesis.cancel();
  } catch (_) {
    /* sessizce geç */
  }
}

export function isSupported() {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

export function getVoices() {
  if (!isSupported()) return [];
  return window.speechSynthesis.getVoices();
}
