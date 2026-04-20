/**
 * DokunSay Platform — Ortak Ses Efektleri
 *
 * Web Audio API ile pedagojik tonlar.
 * Harici ses dosyası yok — tüm sesler sentetik.
 */

let audioCtx = null;
let enabled = true;

function ensureCtx() {
  if (audioCtx) return audioCtx;
  if (typeof window === 'undefined') return null;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  audioCtx = new AC();
  return audioCtx;
}

export function setAudioEnabled(on) {
  enabled = Boolean(on);
}

export function isAudioEnabled() {
  return enabled;
}

export function playTone(freq, durationSec = 0.15, gain = 0.2, type = 'sine') {
  if (!enabled) return;
  const ctx = ensureCtx();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gainNode = ctx.createGain();

  osc.type = type;
  osc.frequency.value = freq;

  const now = ctx.currentTime;
  gainNode.gain.setValueAtTime(gain, now);
  gainNode.gain.exponentialRampToValueAtTime(0.001, now + durationSec);

  osc.connect(gainNode);
  gainNode.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + durationSec);
}

const NOTE_FREQ = {
  C4: 262, D4: 294, E4: 330, F4: 349, G4: 392, A4: 440, B4: 494,
  C5: 523, D5: 587, E5: 659, F5: 698, G5: 784, A5: 880,
};

const COUNT_FREQS = [
  NOTE_FREQ.C4, NOTE_FREQ.D4, NOTE_FREQ.E4, NOTE_FREQ.F4, NOTE_FREQ.G4,
  NOTE_FREQ.A4, NOTE_FREQ.B4, NOTE_FREQ.C5, NOTE_FREQ.D5, NOTE_FREQ.E5,
];

function playCountNote(step) {
  const i = Math.max(0, Math.min(step - 1, COUNT_FREQS.length - 1));
  playTone(COUNT_FREQS[i], 0.20, 0.20);
}

export const sfx = {
  place: () => playTone(NOTE_FREQ.A4, 0.08, 0.18),
  snap: () => playTone(NOTE_FREQ.E5, 0.10, 0.20),
  flip: () => playTone(NOTE_FREQ.B4, 0.12, 0.18),
  rotate: () => playTone(NOTE_FREQ.G4, 0.10, 0.15, 'triangle'),
  pop: () => playTone(NOTE_FREQ.C5, 0.08, 0.20, 'triangle'),
  remove: () => playTone(NOTE_FREQ.C4, 0.15, 0.15, 'sawtooth'),

  correct: () => {
    playTone(NOTE_FREQ.C5, 0.10, 0.22);
    setTimeout(() => playTone(NOTE_FREQ.E5, 0.10, 0.22), 100);
    setTimeout(() => playTone(NOTE_FREQ.G5, 0.15, 0.25), 200);
  },
  wrong: () => {
    playTone(NOTE_FREQ.E4, 0.12, 0.18, 'sawtooth');
    setTimeout(() => playTone(NOTE_FREQ.C4, 0.15, 0.18, 'sawtooth'), 130);
  },
  group: () => {
    playTone(NOTE_FREQ.C5, 0.08, 0.18);
    setTimeout(() => playTone(NOTE_FREQ.E5, 0.08, 0.18), 80);
    setTimeout(() => playTone(NOTE_FREQ.G5, 0.12, 0.22), 160);
  },
  break: () => {
    playTone(NOTE_FREQ.G5, 0.08, 0.18);
    setTimeout(() => playTone(NOTE_FREQ.E5, 0.08, 0.18), 80);
    setTimeout(() => playTone(NOTE_FREQ.C5, 0.12, 0.22), 160);
  },

  // Sayma / ritim: DokunSayBar "note(value)" API'si ile uyumlu
  note: playCountNote,
  countNote: playCountNote,
};
