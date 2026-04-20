/**
 * DokunSay Platform — Erişilebilirlik Yardımcıları
 *
 * Diskalkuli/disleksi/renk körü/hareket azalt modları için
 * hook ve fonksiyon wrapper'ları.
 */

import { loadPreference, savePreference } from './storage.js';

const MODUL = 'a11y';

export const A11Y_DEFAULTS = {
  dyscalculia: false,
  dyslexia: false,
  highContrast: false,
  colorblind: false,
  tts: true,
  sfx: true,
  reduceMotion: false,
  fontSize: 1.0,
};

/**
 * Kullanıcının erişilebilirlik tercihlerini yükler.
 * Prefers-reduced-motion sistem ayarını da dikkate alır.
 */
export function loadA11yPrefs() {
  const saved = loadPreference(MODUL, 'prefs', {});
  const systemReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  return {
    ...A11Y_DEFAULTS,
    ...saved,
    reduceMotion: saved.reduceMotion ?? systemReducedMotion ?? false,
  };
}

export function saveA11yPrefs(prefs) {
  return savePreference(MODUL, 'prefs', prefs);
}

/**
 * Belge üzerindeki root attribute'ları günceller:
 * - data-dyscalculia, data-dyslexia, data-contrast, data-colorblind, data-reduce-motion
 *
 * CSS bu attribute'lara göre temayı değiştirir.
 */
export function applyA11yAttributes(prefs) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;

  root.setAttribute('data-dyscalculia', prefs.dyscalculia ? 'on' : 'off');
  root.setAttribute('data-dyslexia', prefs.dyslexia ? 'on' : 'off');
  root.setAttribute('data-contrast', prefs.highContrast ? 'high' : 'normal');
  root.setAttribute('data-colorblind', prefs.colorblind ? 'on' : 'off');
  root.setAttribute('data-reduce-motion', prefs.reduceMotion ? 'on' : 'off');
  root.style.setProperty('--a11y-font-scale', String(prefs.fontSize ?? 1));
}

/**
 * Klavye kısayolu dinleyici kurucusu.
 * Platform-çapı ortak kısayollar: Ctrl+Z, Ctrl+Y, Del, S (speak), ?/F1 (help).
 */
export function installKeyboardShortcuts({
  onUndo,
  onRedo,
  onDelete,
  onSpeak,
  onHelp,
  onEscape,
} = {}) {
  if (typeof window === 'undefined') return () => {};

  function handler(e) {
    const isMod = e.ctrlKey || e.metaKey;
    const inInput =
      e.target?.tagName === 'INPUT' ||
      e.target?.tagName === 'TEXTAREA' ||
      e.target?.isContentEditable;
    if (inInput) return;

    if (isMod && e.key === 'z' && !e.shiftKey) { e.preventDefault(); onUndo?.(); return; }
    if ((isMod && e.key === 'y') || (isMod && e.shiftKey && e.key === 'Z')) { e.preventDefault(); onRedo?.(); return; }
    if ((e.key === 'Delete' || e.key === 'Backspace') && !inInput) { e.preventDefault(); onDelete?.(); return; }
    if (e.key === 's' || e.key === 'S') { e.preventDefault(); onSpeak?.(); return; }
    if (e.key === '?' || e.key === 'F1') { e.preventDefault(); onHelp?.(); return; }
    if (e.key === 'Escape') { onEscape?.(); return; }
  }

  window.addEventListener('keydown', handler);
  return () => window.removeEventListener('keydown', handler);
}

/**
 * ARIA live region'a mesaj gönder (screen reader için duyuru).
 */
export function announce(message, priority = 'polite') {
  if (typeof document === 'undefined' || !message) return;
  let region = document.getElementById(`dokunsay-live-${priority}`);
  if (!region) {
    region = document.createElement('div');
    region.id = `dokunsay-live-${priority}`;
    region.setAttribute('aria-live', priority);
    region.setAttribute('aria-atomic', 'true');
    region.style.position = 'absolute';
    region.style.left = '-9999px';
    region.style.width = '1px';
    region.style.height = '1px';
    region.style.overflow = 'hidden';
    document.body.appendChild(region);
  }
  region.textContent = '';
  setTimeout(() => { region.textContent = message; }, 50);
}
