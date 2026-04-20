/**
 * DokunSay Tam — Renk Paleti
 *
 * Platform ortak tokenları `@shared/palette.js`'ten gelir.
 * Tam'ın kimlik rengi MOR (#8b5cf6) — launcher kartı ile birebir aynı.
 * Uygulama-özel pos/neg/zero jetonları korunur.
 */

import { APP_ACCENTS } from '@shared/palette.js';

const accent = APP_ACCENTS.tam;

export const THEME = {
  // Semantic — işaret / rol
  pos: '#22c55e',
  posB: '#15803d',
  neg: '#ef4444',
  negB: '#b91c1c',
  zero: '#8b5cf6',

  // Layout — yüzeyler
  bg: '#f5f0e3',
  card: '#fffdf7',
  side: '#faf6ed',
  sideB: '#e5dcc8',

  // Accent — Tam'ın kimlik rengi (mor)
  accent: accent.color,      // #8b5cf6
  accentD: accent.dark,      // #6d28d9
  accentL: accent.soft,      // #ede9fe (eski rgba yerine daha temiz)
  accentSofter: accent.softer,

  // Diğer
  border: '#1a1a1a',
  text: '#3d3520',
  red: '#ef4444',
  green: '#22c55e',
  blue: '#3b82f6',
};

export { APP_ACCENTS };
