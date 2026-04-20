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
