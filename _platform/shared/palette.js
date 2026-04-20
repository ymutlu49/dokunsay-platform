/**
 * DokunSay Platform — Ortak Renk Paleti
 *
 * Bu paleti her DokunSay uygulaması `constants/palette.js`'te içe aktarır.
 * Sıcak krem tonlar, disleksi/diskalkuli için optimize edilmiş kontrast.
 */

export const COLORS = {
  bg: '#f5f0e3',
  bgDark: '#2d2520',
  panel: '#fffdf7',
  panelDark: '#1a1a1a',
  sidebar: '#faf6ed',

  text: '#3d3520',
  textSoft: 'rgba(61, 53, 32, 0.65)',
  textMuted: 'rgba(61, 53, 32, 0.45)',
  textLight: '#ffffff',

  accent: '#f59e0b',
  accentDark: '#92400e',
  accentSoft: '#fef3c7',

  positive: '#22c55e',
  positiveDark: '#15803d',
  negative: '#ef4444',
  negativeDark: '#b91c1c',
  neutral: '#8b5cf6',
  info: '#3b82f6',
  infoDark: '#1e40af',

  border: '#d4c9a8',
  borderSoft: '#e8dfc5',
  shadow: 'rgba(61, 53, 32, 0.08)',
  shadowStrong: 'rgba(61, 53, 32, 0.18)',

  colorblind: {
    orange: '#d55e00',
    blue: '#0072b2',
    pink: '#cc79a7',
    green: '#009e73',
    yellow: '#f0e442',
    skyblue: '#56b4e9',
    vermillion: '#e69f00',
    black: '#000000',
  },

  curcio: {
    l0: '#10b981',
    l1: '#3b82f6',
    l2: '#8b5cf6',
    l3: '#ef4444',
  },

  vanHiele: {
    l0: '#10b981',
    l1: '#3b82f6',
    l2: '#8b5cf6',
  },
};

export const GRADIENTS = {
  headerWarm: 'linear-gradient(135deg, #1a1a1a, #2d2520)',
  headerGold: 'linear-gradient(135deg, #f59e0b, #92400e)',
  panelSoft: 'linear-gradient(180deg, #fffdf7, #faf6ed)',
};

export const SHADOWS = {
  sm: '0 1px 2px rgba(61, 53, 32, 0.06)',
  md: '0 2px 8px rgba(61, 53, 32, 0.10)',
  lg: '0 6px 20px rgba(61, 53, 32, 0.15)',
  focus: '0 0 0 3px rgba(245, 158, 11, 0.35)',
};

export const RADII = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 20,
  pill: 9999,
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const TOUCH = {
  minTarget: 44,
  snapDistance: 16,
  dragGhostOpacity: 0.85,
};

/**
 * Uygulama-başı accent renkleri. Her DokunSay uygulaması bu haritadan
 * kendi ID'sini kullanarak accent rengini çeker. Platform paleti (bg, text,
 * border, shadow) ortaktır; accent rengi uygulamaya özgüdür ve launcher
 * kartındaki renk ile birebir aynıdır.
 */
export const APP_ACCENTS = {
  bar:     { color: '#f59e0b', dark: '#92400e', soft: '#fef3c7', softer: '#fffaf0', name: 'Altın' },
  basamak: { color: '#3b82f6', dark: '#1e40af', soft: '#dbeafe', softer: '#eff6ff', name: 'Mavi' },
  clock:   { color: '#22c55e', dark: '#15803d', soft: '#dcfce7', softer: '#f0fdf4', name: 'Yeşil' },
  kesir:   { color: '#ef4444', dark: '#b91c1c', soft: '#fee2e2', softer: '#fef2f2', name: 'Kırmızı' },
  tam:     { color: '#8b5cf6', dark: '#6d28d9', soft: '#ede9fe', softer: '#f5f3ff', name: 'Mor' },
  geo:     { color: '#14b8a6', dark: '#0f766e', soft: '#ccfbf1', softer: '#f0fdfa', name: 'Turkuaz' },
  veri:    { color: '#ec4899', dark: '#be185d', soft: '#fce7f3', softer: '#fdf2f8', name: 'Pembe' },
};

/**
 * Belirli bir uygulama için tam tema oluştur (base + accent).
 * @example
 *   import { makeAppTheme } from '@shared/palette.js';
 *   const theme = makeAppTheme('tam');
 *   // theme.accent === '#8b5cf6', theme.bg === COLORS.bg, ...
 */
export function makeAppTheme(appId) {
  const accent = APP_ACCENTS[appId] || APP_ACCENTS.bar;
  return {
    ...COLORS,
    accent: accent.color,
    accentDark: accent.dark,
    accentSoft: accent.soft,
    accentSofter: accent.softer,
    accentName: accent.name,
  };
}
