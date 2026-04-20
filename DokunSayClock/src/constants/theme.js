/**
 * DokunSay Clock — Renk Paleti
 * Kimlik rengi: YEŞİL (#22c55e) — launcher kartı ile aynı.
 */

import { APP_ACCENTS, COLORS } from '@shared/palette.js';

const accent = APP_ACCENTS.clock;

export const THEME = {
  ...COLORS,
  accent: accent.color,
  accentDark: accent.dark,
  accentSoft: accent.soft,
  accentSofter: accent.softer,
  // Clock'a özgü saat yüzü / kol renkleri
  face: '#f5b731',
  hourHand: accent.color,
  minuteHand: '#f97316',
};

export { APP_ACCENTS };
