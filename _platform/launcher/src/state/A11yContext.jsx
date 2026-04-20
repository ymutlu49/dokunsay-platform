/**
 * DokunSay Launcher — A11y Context (7 araçla aynı desen)
 * Tüm apps'lerle ortak prefs (`dokunsay:a11y:prefs`) kullanır.
 */

import {
  createContext, useContext, useEffect, useMemo, useState, useCallback,
} from 'react';
import {
  A11Y_DEFAULTS, loadA11yPrefs, saveA11yPrefs, applyA11yAttributes,
  installKeyboardShortcuts, announce as liveAnnounce,
} from '@shared/a11y.js';
import { setAudioEnabled } from '@shared/audio.js';
import { setTTSEnabled } from '@shared/tts.js';
import { A11yPanel } from '@shared/A11yPanel.jsx';

const A11yCtx = createContext(null);

export function A11yProvider({ children }) {
  const [prefs, setPrefs] = useState(() => loadA11yPrefs());

  useEffect(() => {
    applyA11yAttributes(prefs);
    saveA11yPrefs(prefs);
    setAudioEnabled(prefs.sfx);
    setTTSEnabled(prefs.tts);
  }, [prefs]);

  const toggle = useCallback((key) => setPrefs((p) => ({ ...p, [key]: !p[key] })), []);
  const setPref = useCallback((key, value) => setPrefs((p) => ({ ...p, [key]: value })), []);
  const reset = useCallback(() => setPrefs({ ...A11Y_DEFAULTS }), []);
  const announce = useCallback((msg, pri = 'polite') => liveAnnounce(msg, pri), []);
  const installShortcuts = useCallback((h) => installKeyboardShortcuts(h), []);

  const value = useMemo(
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

export function useA11y() {
  const ctx = useContext(A11yCtx);
  if (!ctx) throw new Error('useA11y must be used within an A11yProvider');
  return ctx;
}
