/**
 * i18n — Static multi-language helper for Diskalkuli Platform
 * Languages: tr (default), en, ku (Kurmanji)
 *
 * Usage in HTML:
 *   <span data-i18n="nav.home">Ana Sayfa</span>
 *   <meta data-i18n-attr="content:meta.description" content="...">
 *   <input data-i18n-attr="placeholder:form.email" placeholder="...">
 */

(function () {
  'use strict';

  const SUPPORTED = ['tr', 'en', 'ku'];
  const DEFAULT_LANG = 'tr';
  const STORAGE_KEY = 'diskalkuli_lang';

  const cache = {};

  function getStoredLang() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && SUPPORTED.includes(saved)) return saved;
    } catch (e) { /* ignore */ }

    const browserLang = (navigator.language || 'tr').split('-')[0].toLowerCase();
    if (SUPPORTED.includes(browserLang)) return browserLang;
    return DEFAULT_LANG;
  }

  function getByPath(obj, path) {
    return path.split('.').reduce((acc, key) => (acc && acc[key] !== undefined) ? acc[key] : undefined, obj);
  }

  async function loadLocale(lang) {
    if (cache[lang]) return cache[lang];
    try {
      const res = await fetch(`locales/${lang}.json`);
      if (!res.ok) throw new Error('Locale fetch failed: ' + lang);
      const data = await res.json();
      cache[lang] = data;
      return data;
    } catch (err) {
      console.warn('[i18n] Could not load', lang, err);
      if (lang !== DEFAULT_LANG) return loadLocale(DEFAULT_LANG);
      return {};
    }
  }

  function applyTranslations(dict) {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const value = getByPath(dict, key);
      if (value !== undefined) {
        if (el.hasAttribute('data-i18n-html')) {
          el.innerHTML = value;
        } else {
          el.textContent = value;
        }
      }
    });

    document.querySelectorAll('[data-i18n-attr]').forEach(el => {
      const pairs = el.getAttribute('data-i18n-attr').split(',');
      pairs.forEach(pair => {
        const [attr, key] = pair.split(':').map(s => s.trim());
        const value = getByPath(dict, key);
        if (value !== undefined && attr) {
          el.setAttribute(attr, value);
        }
      });
    });

    if (dict.meta && dict.meta.title) {
      document.title = dict.meta.title;
    }
  }

  function updateLangButtons(currentLang) {
    document.querySelectorAll('.lang-btn').forEach(btn => {
      if (btn.dataset.lang === currentLang) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
    document.documentElement.setAttribute('lang', currentLang);
  }

  async function setLang(lang) {
    if (!SUPPORTED.includes(lang)) lang = DEFAULT_LANG;
    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) { /* ignore */ }
    const dict = await loadLocale(lang);
    applyTranslations(dict);
    updateLangButtons(lang);
    window.dispatchEvent(new CustomEvent('i18n:changed', { detail: { lang, dict } }));
  }

  function bindSwitcher() {
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const lang = btn.dataset.lang;
        if (lang) setLang(lang);
      });
    });
  }

  async function init() {
    bindSwitcher();
    await setLang(getStoredLang());
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.DiskalkuliI18n = { setLang, getStoredLang, SUPPORTED };
})();
