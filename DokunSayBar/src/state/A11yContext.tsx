/**
 * DokunSay Bar — A11y Context
 *
 * Platform ortak erişilebilirlik tercihlerini (`@shared/a11y.js`) React
 * Context olarak sunar. Toggle'lar Header/Settings içinde tüketilir,
 * değişiklikler data-* attribute'ları olarak `<html>` kökündedir.
 *
 * Tüm DokunSay uygulamaları için aynı desen: Bar burada pilot şablon.
 */

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import {
  A11Y_DEFAULTS,
  loadA11yPrefs,
  saveA11yPrefs,
  applyA11yAttributes,
  installKeyboardShortcuts,
  announce as liveAnnounce,
  type A11yPrefs,
  type KeyboardHandlers,
} from "@shared/a11y.js";
import { setAudioEnabled } from "@shared/audio.js";
import { setTTSEnabled } from "@shared/tts.js";
import { A11yPanel } from "@shared/A11yPanel.jsx";

interface A11yContextValue {
  prefs: A11yPrefs;
  toggle: (key: keyof A11yPrefs) => void;
  setPref: <K extends keyof A11yPrefs>(key: K, value: A11yPrefs[K]) => void;
  reset: () => void;
  announce: (message: string, priority?: "polite" | "assertive") => void;
  installShortcuts: (handlers: KeyboardHandlers) => () => void;
}

const A11yCtx = createContext<A11yContextValue | null>(null);

export function A11yProvider({ children }: { children: ReactNode }) {
  const [prefs, setPrefs] = useState<A11yPrefs>(() => loadA11yPrefs());

  useEffect(() => {
    applyA11yAttributes(prefs);
    saveA11yPrefs(prefs);
    setAudioEnabled(prefs.sfx);
    setTTSEnabled(prefs.tts);
  }, [prefs]);

  const toggle = useCallback((key: keyof A11yPrefs) => {
    setPrefs((p) => ({ ...p, [key]: !p[key] }));
  }, []);

  const setPref = useCallback(
    <K extends keyof A11yPrefs>(key: K, value: A11yPrefs[K]) => {
      setPrefs((p) => ({ ...p, [key]: value }));
    },
    []
  );

  const reset = useCallback(() => {
    setPrefs({ ...A11Y_DEFAULTS });
  }, []);

  const announce = useCallback(
    (message: string, priority: "polite" | "assertive" = "polite") => {
      liveAnnounce(message, priority);
    },
    []
  );

  const installShortcuts = useCallback((handlers: KeyboardHandlers) => {
    return installKeyboardShortcuts(handlers);
  }, []);

  const value = useMemo<A11yContextValue>(
    () => ({ prefs, toggle, setPref, reset, announce, installShortcuts }),
    [prefs, toggle, setPref, reset, announce, installShortcuts]
  );

  return (
    <A11yCtx.Provider value={value}>
      {children}
      <A11yPanel useA11y={useA11y} lang="tr" position="bottom-right" />
    </A11yCtx.Provider>
  );
}

export function useA11y(): A11yContextValue {
  const ctx = useContext(A11yCtx);
  if (!ctx) {
    throw new Error("useA11y must be used within an A11yProvider");
  }
  return ctx;
}
