/**
 * DokunSay Platform — shared/tts.js tip bildirimi
 */

export type SupportedLang = "tr" | "ku" | "en" | "ar" | "fa";

export interface SpeakOpts {
  rate?: number;
  pitch?: number;
  volume?: number;
}

export function setTTSEnabled(on: boolean): void;
export function isTTSEnabled(): boolean;
export function speak(text: string, lang?: SupportedLang, opts?: SpeakOpts): void;
export function cancel(): void;
export function isSupported(): boolean;
export function getVoices(): SpeechSynthesisVoice[];
