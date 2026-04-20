/**
 * DokunSay Bar — Speech Service
 *
 * Temel `speak` / `cancel` şimdi platform ortak `shared/tts.js` üzerinden
 * sağlanır. Bar'a özel `speakNumber` ve Web Speech Recognition yardımcıları
 * bu dosyada kalır.
 */

import type { Language } from "../types";
import { NUMBER_WORDS } from "../data/numberWords";
import {
  speak as platformSpeak,
  cancel as platformCancel,
  setTTSEnabled,
  isTTSEnabled,
} from "@shared/tts.js";

export function speak(text: string, lang: Language, rate = 0.85): void {
  platformSpeak(text, lang, { rate });
}

export function speakNumber(value: number, lang: Language): void {
  const words = NUMBER_WORDS[lang] || NUMBER_WORDS.tr;
  const word = words[value] || String(value);
  speak(word, lang, 0.9);
}

export function cancelSpeech(): void {
  platformCancel();
}

export { setTTSEnabled, isTTSEnabled };

export interface VoiceRecognitionCallbacks {
  onResult: (transcript: string) => void;
  onError: () => void;
}

const BCP47: Record<Language, string> = {
  tr: "tr-TR",
  ku: "ku",
  en: "en-US",
  ar: "ar-SA",
  fa: "fa-IR",
};

const SpeechRecognitionAPI =
  typeof window !== "undefined"
    ? (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    : null;

export function startVoiceRecognition(
  lang: Language,
  callbacks: VoiceRecognitionCallbacks
): any | null {
  if (!SpeechRecognitionAPI) return null;

  try {
    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = BCP47[lang] || BCP47.tr;

    recognition.onresult = (ev: any) => {
      const transcript = ev.results[ev.results.length - 1][0].transcript
        .toLowerCase()
        .trim();
      callbacks.onResult(transcript);
    };

    recognition.onerror = () => callbacks.onError();

    recognition.onend = () => {
      try { recognition.start(); } catch { /* ignore */ }
    };

    recognition.start();
    return recognition;
  } catch {
    return null;
  }
}

export function stopVoiceRecognition(recognition: any): void {
  if (!recognition) return;
  try {
    recognition.onend = null;
    recognition.stop();
  } catch {
    // Not available
  }
}
