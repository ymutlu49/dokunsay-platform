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

/**
 * Bu dilde seslendirme yapılabilir mi?
 * ku: gerçek Kurmancî sesi kurulu değilse false döner (Türkçe sesle Kurmancî okumak
 * yanlış telaffuz modeli öğretir — 2026-07-19 kararı). Arayüz 🔊 düğmelerini buna
 * göre gizlemelidir; basıldığında hiçbir şey olmayan düğme uygulamayı bozuk gösterir.
 */
export function canSpeak(lang?: SupportedLang): boolean;

/** Ekranda yazan metni, çocuğun duyması gereken cümleye çevirir (matematik + emoji). */
export function toSpeech(text: string, lang?: SupportedLang): string;
