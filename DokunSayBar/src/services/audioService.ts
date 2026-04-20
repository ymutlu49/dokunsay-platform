/**
 * DokunSay Bar — Audio Service
 *
 * Platform ortak ses altyapısını (shared/audio.js) Bar'ın mevcut
 * `playTone`, `sfx` API'sine köprüler. Bar bileşenleri bu dosyanın
 * dışa aktarımlarından etkilenmez — ancak ton tanımları artık
 * platform genelinde tutarlıdır.
 */

import {
  playTone as platformPlayTone,
  sfx as platformSfx,
  setAudioEnabled,
  isAudioEnabled,
} from "@shared/audio.js";

export type OscillatorShape = "sine" | "triangle" | "sawtooth" | "square";

export function playTone(
  frequency: number,
  duration: number,
  volume = 0.1,
  type: OscillatorShape = "sine"
): void {
  platformPlayTone(frequency, duration, volume, type);
}

export const sfx = platformSfx;

export { setAudioEnabled, isAudioEnabled };
