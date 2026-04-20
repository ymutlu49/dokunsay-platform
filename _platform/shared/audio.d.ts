/**
 * DokunSay Platform — shared/audio.js tip bildirimi
 */

export type OscillatorShape = "sine" | "triangle" | "sawtooth" | "square";

export function setAudioEnabled(on: boolean): void;
export function isAudioEnabled(): boolean;
export function playTone(
  freq: number,
  durationSec?: number,
  gain?: number,
  type?: OscillatorShape
): void;

export interface Sfx {
  place: () => void;
  snap: () => void;
  flip: () => void;
  rotate: () => void;
  pop: () => void;
  remove: () => void;
  correct: () => void;
  wrong: () => void;
  group: () => void;
  break: () => void;
  note: (step: number) => void;
  countNote: (step: number) => void;
}

export const sfx: Sfx;
