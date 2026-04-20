/**
 * DokunSay Clock — Sesli Okuma (platform ortak TTS wrapper)
 */

import { speak as platformSpeak, cancel, setTTSEnabled } from '@shared/tts.js';

export const speak = (text, lang = 'tr', rate = 0.85) => {
  platformSpeak(text, lang, { rate });
};

export { cancel, setTTSEnabled };
