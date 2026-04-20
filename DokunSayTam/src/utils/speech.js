/**
 * DokunSay Tam — Sesli Okuma (platform ortak TTS wrapper)
 *
 * Mevcut `speak(text)` Türkçe-only API'sini korur, arkada `@shared/tts.js`
 * üzerinden çalışır. İleride dil desteği genişletmek kolay.
 */

import { speak as platformSpeak, cancel, setTTSEnabled } from '@shared/tts.js';

export const speak = (text, lang = 'tr', rate = 0.85) => {
  platformSpeak(text, lang, { rate });
};

export { cancel, setTTSEnabled };
