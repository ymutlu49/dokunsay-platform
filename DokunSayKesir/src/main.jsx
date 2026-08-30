import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { A11yProvider } from "./state/A11yContext.jsx";
import { I18nProvider, useI18n } from "./i18n/index.jsx";
import { AppShell } from "@shared/AppShell.jsx";
import { LangSwitcher, VISIBLE_LANGS } from "@shared/LangSwitcher.jsx";
import { setAppFavicon } from "@shared/appIcon.js";
import App from "./App.jsx";
import "./index.css";

function KesirLangTools() {
  const { lang, setLang, LANGS } = useI18n();
  // Kesir kendi LANGS'ini geciyordu (5 dil) ve paylasilan gizlemeyi ATLIYORDU.
  // Sunulan dillerle KESISTIR: ceviri dosyalari yerinde kalir, secicide gorunmez.
  const gorunen = VISIBLE_LANGS.filter((l) => LANGS.includes(l));
  return <LangSwitcher lang={lang} setLang={setLang} langs={gorunen} />;
}

function KesirShell() {
  const { lang } = useI18n();
  useEffect(() => { setAppFavicon('kesir'); }, []);
  return (
    <AppShell
      appId="kesir"
      title="DokunSay Kesir"
      icon="🍕"
      backLang={lang}
      tools={<KesirLangTools />}
    >
      <App />
    </AppShell>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <A11yProvider>
      <I18nProvider>
        <KesirShell />
      </I18nProvider>
    </A11yProvider>
  </StrictMode>
);
