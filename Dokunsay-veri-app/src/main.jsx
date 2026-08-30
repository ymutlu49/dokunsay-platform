import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { A11yProvider } from "./state/A11yContext.jsx";
import { AppShell } from "@shared/AppShell.jsx";
import { LangSwitcher } from "@shared/LangSwitcher.jsx";
import { setAppFavicon } from "@shared/appIcon.js";
import { useSharedLang } from "@shared/useSharedLang.js";
import App from "./App.jsx";

function Root() {
  const [lang, setLang] = useSharedLang();
  useEffect(() => { setAppFavicon('veri'); }, []);
  return (
    <A11yProvider>
      <AppShell
        appId="veri"
        title="DokunSay Veri"
        icon="📊"
        backLang={lang}
        tools={<LangSwitcher lang={lang} setLang={setLang} />}
      >
        <App />
      </AppShell>
    </A11yProvider>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);
