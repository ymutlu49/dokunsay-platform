/**
 * DokunSay Basamak — Sesli Okuma
 *
 * Seslendirme TEK YOLDAN geçer: shared/tts.js. Buradaki yerel `SpeechSynthesisUtterance`
 * kopyası kaldırıldı (2026-07-19 platform denetimi) — `lang="ku"` veriyordu, çoğu motorda
 * karşılığı olmadığı için sistem varsayılan sesine düşüyordu (yani rastgele bir dil).
 * Ortak modül ayrıca matematik gösterimini ve emojiyi okunabilir hâle getirir.
 */

import { speak as platformSpeak, canSpeak } from '@shared/tts.js';

export function speakInLang(text, langCode) {
  platformSpeak(text, langCode);
}

/** Bu dilde seslendirme yapılabilir mi? 🔊 düğmelerini buna göre gizle. */
export { canSpeak };

export const SPEECH_SUPPORTED = typeof window !== "undefined" &&
  !!(window.SpeechRecognition || window.webkitSpeechRecognition);
