import { createContext, useContext, useState, useCallback } from "react";
import tr from "./tr.js";
import ku from "./ku.js";
import en from "./en.js";
import ar from "./ar.js";
import fa from "./fa.js";

var LANGS = { tr, ku, en, ar, fa };
var LANG_LABELS = { tr: "Türkçe", ku: "Kurmancî", en: "English", ar: "العربية", fa: "فارسی" };
var LANG_FLAGS = { tr: "🇹🇷", ku: "☀️", en: "🇬🇧", ar: "🇸🇦", fa: "🇮🇷" };

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
