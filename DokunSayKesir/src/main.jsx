import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { A11yProvider } from "./state/A11yContext.jsx";
import { I18nProvider, useI18n } from "./i18n/index.jsx";
import { AppShell } from "@shared/AppShell.jsx";
import { LangSwitcher } from "@shared/LangSwitcher.jsx";
import App from "./App.jsx";
import "./index.css";

function KesirLangTools() {
  const { lang, setLang, LANGS } = useI18n();
  return <LangSwitcher lang={lang} setLang={setLang} langs={LANGS} />;
}

function KesirShell() {
  const { lang } = useI18n();
  return (
    <AppShell
      appId="kesir"
      title="DokunSay Kesir"
      subtitle="Kesirler"
      icon="🍕"
      backLang={lang === 'ku' ? 'ku' : lang === 'en' ? 'en' : 'tr'}
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
