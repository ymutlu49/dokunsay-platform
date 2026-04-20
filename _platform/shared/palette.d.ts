/**
 * DokunSay Platform — shared/palette.js tip bildirimi
 */

export interface ColorsColorblind {
  orange: string;
  blue: string;
  pink: string;
  green: string;
  yellow: string;
  skyblue: string;
  vermillion: string;
  black: string;
}

export interface Colors {
  bg: string; bgDark: string; panel: string; panelDark: string; sidebar: string;
  text: string; textSoft: string; textMuted: string; textLight: string;
  accent: string; accentDark: string; accentSoft: string;
  positive: string; positiveDark: string;
  negative: string; negativeDark: string;
  neutral: string; info: string; infoDark: string;
  border: string; borderSoft: string;
  shadow: string; shadowStrong: string;
  colorblind: ColorsColorblind;
  curcio: { l0: string; l1: string; l2: string; l3: string };
  vanHiele: { l0: string; l1: string; l2: string };
}

export const COLORS: Colors;
export const GRADIENTS: { headerWarm: string; headerGold: string; panelSoft: string };
export const SHADOWS: { sm: string; md: string; lg: string; focus: string };
export const RADII: { sm: number; md: number; lg: number; xl: number; pill: number };
export const SPACING: { xs: number; sm: number; md: number; lg: number; xl: number; xxl: number };
export const TOUCH: { minTarget: number; snapDistance: number; dragGhostOpacity: number };

export interface AppAccent {
  color: string;
  dark: string;
  soft: string;
  softer: string;
  name: string;
}

export type AppId = "bar" | "basamak" | "clock" | "kesir" | "tam" | "geo" | "veri";

export const APP_ACCENTS: Record<AppId, AppAccent>;

export interface AppTheme extends Colors {
  accent: string;
  accentDark: string;
  accentSoft: string;
  accentSofter: string;
  accentName: string;
}

export function makeAppTheme(appId: AppId): AppTheme;
