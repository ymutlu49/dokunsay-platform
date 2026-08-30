import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { A11yProvider } from "./state/A11yContext.jsx";
import { AppShell } from "@shared/AppShell.jsx";
import { LangSwitcher } from "@shared/LangSwitcher.jsx";
import { setAppFavicon } from "@shared/appIcon.js";
import { useSharedLang } from "@shared/useSharedLang.js";
import App from "./App.jsx";
import Shell from "./Shell.jsx";

function Root() {
  const [lang, setLang] = useSharedLang();
  useEffect(() => { setAppFavicon('clock'); }, []);
  return (
    <A11yProvider>
      <Shell>
        <AppShell
          appId="clock"
          title="DokunSay Clock"
          icon="🕐"
          backLang={lang}
          tools={<LangSwitcher lang={lang} setLang={setLang} />}
        >
          <App lang={lang} />
        </AppShell>
      </Shell>
    </A11yProvider>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Root />
  </StrictMode>
);
