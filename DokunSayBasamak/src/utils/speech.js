/**
 * DokunSay Basamak — Sesli Okuma
 * Platform TTS flag'ine bağlı (shared/tts.js).
 */

import { isTTSEnabled } from '@shared/tts.js';

export function speakInLang(text, langCode) {
  if (!window.speechSynthesis || !isTTSEnabled()) return;
  window.speechSynthesis.cancel();
  const utt = new SpeechSynthesisUtterance(text);
  utt.lang = langCode === "ku" ? "ku" : langCode === "en" ? "en-US" : "tr-TR";
  utt.rate = 0.85;
  window.speechSynthesis.speak(utt);
}

export const SPEECH_SUPPORTED = typeof window !== "undefined" &&
  !!(window.SpeechRecognition || window.webkitSpeechRecognition);
