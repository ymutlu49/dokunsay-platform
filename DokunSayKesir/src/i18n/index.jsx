import { createContext, useContext, useState, useCallback } from "react";
import tr from "./tr.js";
import ku from "./ku.js";
import en from "./en.js";

var LANGS = { tr, ku, en };
var LANG_LABELS = { tr: "Türkçe", ku: "Kurdî", en: "English" };
var LANG_FLAGS = { tr: "🇹🇷", ku: "☀️", en: "🇬🇧" };

var I18nCtx = createContext();

export function I18nProvider({ children }) {
  var _l = useState("tr"), lang = _l[0], setLang = _l[1];
  var t = useCallback(function (key, params) {
    var val = LANGS[lang]?.[key] ?? LANGS.tr[key] ?? key;
    if (params) {
      Object.keys(params).forEach(function (k) {
        val = val.replace(new RegExp("\\{" + k + "\\}", "g"), params[k]);
      });
    }
    return val;
  }, [lang]);
  return (
    <I18nCtx.Provider value={{ lang, setLang, t, LANG_LABELS, LANG_FLAGS, LANGS: Object.keys(LANGS) }}>
      {children}
    </I18nCtx.Provider>
  );
}

export function useI18n() {
  return useContext(I18nCtx);
}

export { LANGS, LANG_LABELS, LANG_FLAGS };
