/**
 * DokunSay Basamak — Renk Paleti
 * Kimlik rengi: MAVİ (#3b82f6) — launcher kartı ile aynı.
 * `ones/tens/huns/ths` blok renkleri (basamak değeri öğretimi) korunur.
 */

import { APP_ACCENTS } from '@shared/palette.js';

const accent = APP_ACCENTS.basamak;

export const PALETTE = {
  ones: "#d97706", onesB: "#92400e",
  tens: "#ea580c", tensB: "#c2410c",
  huns: "#2563eb", hunsB: "#1d4ed8",
  ths: "#7c3aed", thsB: "#6d28d9",
  bg: "#f5f0e3", card: "#fffdf7", side: "#faf6ed", sideB: "#e5dcc8",
  accent: accent.color,   // #3b82f6 (mavi — Basamak kimlik)
  accentD: accent.dark,
  accentL: accent.soft,
  accentSofter: accent.softer,
  text: "#3d3520", sh: "rgba(60,50,30,.06)", shM: "rgba(60,50,30,.1)",
};

export { APP_ACCENTS };
