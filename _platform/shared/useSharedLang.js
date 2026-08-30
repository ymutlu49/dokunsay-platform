/**
 * DokunSay Platform — Ortak Dil State Hook
 *
 * Tüm uygulamalar aynı dili paylaşsın diye localStorage + custom event ile
 * basit bir senkron sağlar.
 *
 * - Storage key: 'dk_lang' (cross-app ortak)
 * - Event: 'dk-lang-change' (sayfada başka komponent dinleyebilir)
 *
 * Kullanım:
 *   const [lang, setLang] = useSharedLang();
 *   <LangSwitcher lang={lang} setLang={setLang} />
 */

import { useEffect, useState, useCallback } from 'react';

const KEY = 'dk_lang';
const EVENT = 'dk-lang-change';

export function useSharedLang(initial = 'tr') {
  const [lang, setLangState] = useState(() => {
    if (typeof window === 'undefined') return initial;
    try { return localStorage.getItem(KEY) || initial; } catch { return initial; }
  });

  // Diğer komponentlerden gelen değişiklikleri dinle
  useEffect(() => {
    function onChange(ev) {
      const next = ev.detail?.lang;
      if (next && next !== lang) setLangState(next);
    }
    function onStorage(ev) {
      if (ev.key === KEY && ev.newValue && ev.newValue !== lang) setLangState(ev.newValue);
    }
    window.addEventListener(EVENT, onChange);
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener(EVENT, onChange);
      window.removeEventListener('storage', onStorage);
    };
  }, [lang]);

  const setLang = useCallback((l) => {
    setLangState(l);
    try { localStorage.setItem(KEY, l); } catch {}
    try { window.dispatchEvent(new CustomEvent(EVENT, { detail: { lang: l } })); } catch {}
  }, []);

  return [lang, setLang];
}
