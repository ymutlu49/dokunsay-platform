/**
 * DokunSay Platform — Ortak Dil Seçici
 *
 * Üst şeritte sağda (AppShell tools slot'unda) kullanılır.
 * 3-harf kod stilinde kompakt pill görünümü (TR / KU / EN gibi).
 * Her uygulama kendi lang state'ini `lang` + `setLang` props ile verir.
 */

import './LangSwitcher.css';

const DEFAULT_LANGS = ['tr', 'ku', 'en'];

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

export function LangSwitcher({
  lang,
  setLang,
  langs = DEFAULT_LANGS,
  labels = DEFAULT_LABELS,
}) {
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
