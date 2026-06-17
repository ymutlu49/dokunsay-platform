/**
 * DokunSay Platform — Ortak Text-to-Speech
 *
 * Web Speech API tabanlı çok dilli TTS wrapper.
 * Kurmancî için tr-TR fonetik fallback (native destek yok).
 *
 * Voice seçimi: tarayıcıda yüklü voice'lardan dile uygun olanı
 * otomatik seçer. Native voice yoksa varsayılan kullanılır.
 */

// BCP 47 dil etiketleri. Kurmancî native destek yoktur → tr-TR fonetik fallback.
const LANG_MAP = {
  tr: 'tr-TR',
  en: 'en-US',
  ku: 'tr-TR',
  ar: 'ar-SA',
  fa: 'fa-IR',
};

// Kullanıcı dili için olası voice prefix'leri (öncelik sırasıyla).
// Bazı tarayıcılarda 'fa-IR' yerine 'fa', 'ar-SA' yerine 'ar-EG' bulunur.
const LANG_FALLBACKS = {
  tr: ['tr-TR', 'tr'],
  en: ['en-US', 'en-GB', 'en'],
  ku: ['tr-TR', 'tr'],
  ar: ['ar-SA', 'ar-EG', 'ar-AE', 'ar'],
  fa: ['fa-IR', 'fa', 'prs', 'ps-AF'],
};

const DEFAULT_VOICE_OPTS = {
  rate: 0.85,
  pitch: 1.1,
  volume: 1.0,
};

let enabled = true;
let voiceCache = null;

export function setTTSEnabled(on) {
  enabled = Boolean(on);
  if (!enabled) cancel();
}

export function isTTSEnabled() {
  return enabled;
}

/** Tarayıcı voice listesi async yüklenir; ilk çağrıda boş gelebilir. */
function loadVoices() {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return [];
  const list = window.speechSynthesis.getVoices();
  if (list && list.length) {
    voiceCache = list;
  }
  return voiceCache || list || [];
}

/** Dile uygun en iyi voice'u seç. Native voice → quality voice → null. */
function pickVoice(langKey) {
  const voices = loadVoices();
  if (!voices.length) return null;

  const fallbacks = LANG_FALLBACKS[langKey] || [LANG_MAP[langKey] || 'tr-TR'];

  for (const tag of fallbacks) {
    // 1. Lokal/native voice (yerel kaliteli ses)
    const native = voices.find(
      (v) => v.lang?.toLowerCase().startsWith(tag.toLowerCase()) && v.localService
    );
    if (native) return native;
    // 2. Aynı dil için herhangi bir voice
    const any = voices.find((v) => v.lang?.toLowerCase().startsWith(tag.toLowerCase()));
    if (any) return any;
  }
  return null;
}

export function speak(text, lang = 'tr', opts = {}) {
  if (!enabled) return;
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  if (!text) return;

  cancel();

  const u = new SpeechSynthesisUtterance(String(text));
  u.lang = LANG_MAP[lang] || LANG_MAP.tr;

  const voice = pickVoice(lang);
  if (voice) u.voice = voice;

  u.rate = opts.rate ?? DEFAULT_VOICE_OPTS.rate;
  u.pitch = opts.pitch ?? DEFAULT_VOICE_OPTS.pitch;
  u.volume = opts.volume ?? DEFAULT_VOICE_OPTS.volume;

  try {
    window.speechSynthesis.speak(u);
  } catch (_) {
    /* sessionce geç */
  }
}

export function cancel() {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  try {
    window.speechSynthesis.cancel();
  } catch (_) {
    /* sessionce geç */
  }
}

export function isSupported() {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

export function getVoices() {
  return loadVoices();
}

/** Belirli bir dil için native voice mevcut mu? UI'da göstermek için. */
export function hasNativeVoice(lang) {
  return Boolean(pickVoice(lang));
}

/** Voice listesi async yükleniyorsa onvoiceschanged'i dinleyip cache'i güncelle. */
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  if (typeof window.speechSynthesis.onvoiceschanged !== 'undefined') {
    window.speechSynthesis.onvoiceschanged = () => { voiceCache = null; loadVoices(); };
  }
  // İlk yüklemeyi dene (cache hazırlasın)
  loadVoices();
}
