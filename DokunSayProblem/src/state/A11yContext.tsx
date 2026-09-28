/**
 * Erişilebilirlik bağlamı — ZihindenAritmetik'teki platform şablonunun birebir TS kopyası
 * (06 §2.8). Panel `a11y-global.css`'i de yükler (44 px dokunma hedefi kuralı).
 * `prefs.sfx → setAudioEnabled`, `prefs.tts → setTTSEnabled` senkron tutulur.
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  A11Y_DEFAULTS,
  announce as liveAnnounce,
  applyA11yAttributes,
  installKeyboardShortcuts,
  loadA11yPrefs,
  saveA11yPrefs,
  type A11yPrefs,
  type KeyboardHandlers,
} from '@shared/a11y.js';
import { A11yPanel, type A11yContextValue } from '@shared/A11yPanel.jsx';
import { setAudioEnabled } from '@shared/audio.js';
import { setTTSEnabled } from '@shared/tts.js';
import type { Lang } from '../content/types';

const A11yCtx = createContext<A11yContextValue | null>(null);

export function A11yProvider({ children, lang }: { children: ReactNode; lang: Lang }) {
  const [prefs, setPrefs] = useState<A11yPrefs>(() => loadA11yPrefs());

  useEffect(() => {
    applyA11yAttributes(prefs);
    saveA11yPrefs(prefs);
    setAudioEnabled(prefs.sfx);
    setTTSEnabled(prefs.tts);
  }, [prefs]);

  const toggle = useCallback((key: keyof A11yPrefs) => setPrefs((p) => ({ ...p, [key]: !p[key] })), []);
  const setPref = useCallback(
    <K extends keyof A11yPrefs>(key: K, value: A11yPrefs[K]) => setPrefs((p) => ({ ...p, [key]: value })),
    [],
  );
  const reset = useCallback(() => setPrefs({ ...A11Y_DEFAULTS }), []);
  const announce = useCallback((msg: string, pri?: 'polite' | 'assertive') => liveAnnounce(msg, pri), []);
  const installShortcuts = useCallback((h: unknown) => installKeyboardShortcuts(h as KeyboardHandlers), []);

  const value = useMemo<A11yContextValue>(
    () => ({ prefs, toggle, setPref, reset, announce, installShortcuts }),
    [prefs, toggle, setPref, reset, announce, installShortcuts],
  );

  return (
    <A11yCtx.Provider value={value}>
      {children}
      <A11yPanel useA11y={useA11y} lang={lang} />
    </A11yCtx.Provider>
  );
}

export function useA11y(): A11yContextValue {
  const ctx = useContext(A11yCtx);
  if (!ctx) throw new Error('useA11y, A11yProvider içinde çağrılmalıdır');
  return ctx;
}

/** Hareket azaltılmış mı? (panel tercihi ya da sistem ayarı) */
export function useReducedMotion(): boolean {
  const { prefs } = useA11y();
  const [sys, setSys] = useState(() => typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches);
  useEffect(() => {
    if (typeof matchMedia === 'undefined') return;
    const mq = matchMedia('(prefers-reduced-motion: reduce)');
    const on = () => setSys(mq.matches);
    mq.addEventListener?.('change', on);
    return () => mq.removeEventListener?.('change', on);
  }, []);
  return prefs.reduceMotion || sys;
}
