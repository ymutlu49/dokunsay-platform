/**
 * DokunSay Tam — i18n (opt-in stub)
 *
 * Bu dosya platform i18n şemasına uygun olarak hazırlanmıştır.
 * Mevcut App.jsx'e dokunmaz; entegre etmek için:
 *   import { t, LANGS } from './i18n/index.js';
 *   const [lang, setLang] = useState('tr');
 *   <h1>{t(lang, 'app_title')}</h1>
 */

import tr from './tr.js';
import ku from './ku.js';
import en from './en.js';

export const LANGS = ['tr', 'ku', 'en'];

export const LANG_LABELS = {
  tr: 'Türkçe',
  ku: 'Kurmancî',
  en: 'English',
};

export const LANG_FLAGS = {
  tr: '🇹🇷',
  ku: '☀️',
  en: '🇬🇧',
};

const DICT = { tr, ku, en };

export function t(lang, key) {
  return DICT[lang]?.[key] ?? DICT.tr[key] ?? key;
}

export function getDict(lang) {
  return DICT[lang] || DICT.tr;
}
