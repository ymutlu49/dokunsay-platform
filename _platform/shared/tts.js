/**
 * DokunSay Platform — Ortak Text-to-Speech
 *
 * Web Speech API tabanlı çok dilli TTS wrapper.
 * Kurmancî için tr-TR fonetik fallback (native destek yok).
 */

// BCP 47 dil etiketleri. Kurmancî native destek yoktur → tr-TR fonetik fallback.
const LANG_MAP = {
  tr: 'tr-TR',
  en: 'en-US',
  ku: 'tr-TR',
  ar: 'ar-SA',
  fa: 'fa-IR',
};

const DEFAULT_VOICE_OPTS = {
  rate: 0.85,
  pitch: 1.1,
  volume: 1.0,
};

let enabled = true;

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

  cancel();

  const u = new SpeechSynthesisUtterance(String(text));
  u.lang = LANG_MAP[lang] || LANG_MAP.tr;
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
  if (!isSupported()) return [];
  return window.speechSynthesis.getVoices();
}
