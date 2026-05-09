/**
 * DokunSay Platform — shared/a11y.js tip bildirimi
 */

export interface A11yPrefs {
  dyscalculia: boolean;
  dyslexia: boolean;
  highContrast: boolean;
  colorblind: boolean;
  tts: boolean;
  sfx: boolean;
  reduceMotion: boolean;
  fontSize: number;
}

export const A11Y_DEFAULTS: A11yPrefs;

export function loadA11yPrefs(): A11yPrefs;
export function saveA11yPrefs(prefs: A11yPrefs): boolean;
export function applyA11yAttributes(prefs: A11yPrefs): void;

export interface KeyboardHandlers {
  onUndo?: () => void;
  onRedo?: () => void;
  onDelete?: () => void;
  onSpeak?: () => void;
  onHelp?: () => void;
  onEscape?: () => void;
}

export function installKeyboardShortcuts(handlers?: KeyboardHandlers): () => void;
export function announce(message: string, priority?: "polite" | "assertive"): void;

/**
 * <html lang> değişikliklerini izleyip <html dir> attribute'unu otomatik
 * günceller (ar/fa → rtl, diğerleri → ltr). Cleanup fonksiyonu döner.
 */
export function installAutoDir(): () => void;

/**
 * Etiketsiz SVG'lere (aria-label/title/role olmayan) otomatik
 * aria-hidden="true" + focusable="false" ekler. MutationObserver
 * ile dinamik içerik de dahil. Cleanup fonksiyonu döner.
 */
export function installDecorativeSvgGuard(): () => void;

/**
 * Tüm platform a11y koruyucularını tek seferde kurar (auto-dir + svg-guard).
 * A11yProvider'lar mount sırasında çağırır. Tek cleanup fonksiyonu döner.
 */
export function installA11yGuards(): () => void;
