/**
 * Erişilebilirlik bağlamı (platform şablonu).
 *
 * Zihinden Aritmetik, denetimde ortak katmanı en az kullanan araç çıkmıştı:
 * diğer yedi araçta bulunan erişilebilirlik paneli burada yoktu. Yani diskalkuli
 * modu, disleksi modu, yüksek kontrast, renk körü modu ve sesli okuma —
 * platformun kendi zorunlu maddesi (STANDARDS.md §1.3) — bu araçta açılamıyordu.
 * Bu dosya öteki araçlardaki şablonun aynısıdır, yalnızca TypeScript'e uyarlanmıştır.
 *
 * Panelin getirdiği ikinci kazanç: `a11y-global.css` de onunla birlikte yüklenir,
 * yani §3.6'nın 44×44 px dokunma hedefi kuralı bu araçta da devreye girer.
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
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
import type { DilKodu } from '../i18n';

const A11yCtx = createContext<A11yContextValue | null>(null);

export function A11yProvider({ children, dil }: { children: ReactNode; dil: DilKodu }) {
  const [prefs, setPrefs] = useState<A11yPrefs>(() => loadA11yPrefs());

  useEffect(() => {
    applyA11yAttributes(prefs);
    saveA11yPrefs(prefs);
    setAudioEnabled(prefs.sfx);
    setTTSEnabled(prefs.tts);
  }, [prefs]);

  const toggle = useCallback(
    (key: keyof A11yPrefs) => setPrefs((p) => ({ ...p, [key]: !p[key] })),
    [],
  );
  const setPref = useCallback(
    <K extends keyof A11yPrefs>(key: K, value: A11yPrefs[K]) =>
      setPrefs((p) => ({ ...p, [key]: value })),
    [],
  );
  const reset = useCallback(() => setPrefs({ ...A11Y_DEFAULTS }), []);
  const announce = useCallback(
    (msg: string, pri?: 'polite' | 'assertive') => liveAnnounce(msg, pri),
    [],
  );
  // Ortak arayüz `unknown` bildiriyor; burada daraltıp tip güvenli çağırıyoruz.
  const installShortcuts = useCallback(
    (h: unknown) => installKeyboardShortcuts(h as KeyboardHandlers),
    [],
  );

  const deger = useMemo<A11yContextValue>(
    () => ({ prefs, toggle, setPref, reset, announce, installShortcuts }),
    [prefs, toggle, setPref, reset, announce, installShortcuts],
  );

  return (
    <A11yCtx.Provider value={deger}>
      {children}
      <A11yPanel useA11y={useA11y} lang={dil} />
    </A11yCtx.Provider>
  );
}

export function useA11y(): A11yContextValue {
  const ctx = useContext(A11yCtx);
  if (!ctx) throw new Error('useA11y, A11yProvider içinde çağrılmalıdır');
  return ctx;
}
