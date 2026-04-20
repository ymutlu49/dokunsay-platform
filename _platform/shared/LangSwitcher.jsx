/**
 * DokunSay Platform — Ortak Dil Seçici
 *
 * Üst şeritte sağda (AppShell tools slot'unda) kullanılır.
 * 3-harf kod stilinde kompakt pill görünümü (TR / KU / EN / AR / FA).
 * Her uygulama kendi lang state'ini `lang` + `setLang` props ile verir.
 *
 * AR ve FA otomatik olarak <html dir="rtl"> uygular.
 */

import { useEffect } from 'react';
import './LangSwitcher.css';

const DEFAULT_LANGS = ['tr', 'ku', 'en', 'ar', 'fa'];

const DEFAULT_LABELS = {
  tr: 'TR',
  ku: 'KU',
  en: 'EN',
  ar: 'AR',
  fa: 'FA',
};

const ARIA_LABELS = {
  tr: 'Türkçe',
  ku: 'Kurmancî',
  en: 'English',
  ar: 'العربية',
  fa: 'فارسی',
};

const RTL_LANGS = new Set(['ar', 'fa']);
export function isRTL(lang) { return RTL_LANGS.has(lang); }

export function LangSwitcher({
  lang,
  setLang,
  langs = DEFAULT_LANGS,
  labels = DEFAULT_LABELS,
}) {
  // Dil değiştiğinde <html lang> ve <html dir> güncellenir.
  // AR/FA RTL, diğerleri LTR. Bu sayede CSS :dir() ve varsayılan
  // tarayıcı davranışları (form hizalama, metin akışı) doğru çalışır.
  useEffect(() => {
    const html = document.documentElement;
    html.setAttribute('lang', lang);
    html.setAttribute('dir', RTL_LANGS.has(lang) ? 'rtl' : 'ltr');
  }, [lang]);

  return (
    <div className="ds-lang-switcher" role="group" aria-label="Language">
      {langs.map((l) => (
        <button
          key={l}
          type="button"
          className={`ds-lang-switcher__btn ${lang === l ? 'ds-lang-switcher__btn--active' : ''}`}
          onClick={() => setLang(l)}
          aria-pressed={lang === l}
          aria-label={ARIA_LABELS[l] || l}
          title={ARIA_LABELS[l] || l}
        >
          {labels[l] || l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
