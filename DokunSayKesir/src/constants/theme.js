/**
 * DokunSay Kesir — Renk Paleti
 * Kimlik rengi: KIRMIZI (#ef4444) — launcher kartı ile aynı.
 */

import { APP_ACCENTS, COLORS } from '@shared/palette.js';

const accent = APP_ACCENTS.kesir;

export const THEME = {
  ...COLORS,
  accent: accent.color,
  accentDark: accent.dark,
  accentSoft: accent.soft,
  accentSofter: accent.softer,
};

export { APP_ACCENTS };
