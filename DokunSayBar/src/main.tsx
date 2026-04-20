import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { A11yProvider } from "./state/A11yContext";
import { AppProvider, useAppState } from "./state/AppContext";
import { AuthProvider } from "./state/AuthContext";
import { ARProvider } from "./state/ARContext";
import { AppShell as PlatformShell } from "@shared/AppShell.jsx";
import { LangSwitcher } from "@shared/LangSwitcher.jsx";
import AppShell from "./AppShell";
import type { Language } from "./types";
import "./index.css";

function BarLangTools() {
  const { state, dispatch } = useAppState();
  return (
    <LangSwitcher
      lang={state.language}
      setLang={(l: string) => dispatch({ type: "SET_LANGUAGE", language: l as Language })}
      langs={["tr", "ku", "en"]}
    />
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <A11yProvider>
      <AuthProvider>
        <AppProvider>
          <ARProvider>
            <PlatformShell
              appId="bar"
              title="DokunSay Bar"
              subtitle="Çubuklar ve Pullar"
              icon="🧮"
              tools={<BarLangTools />}
            >
              <AppShell />
            </PlatformShell>
          </ARProvider>
        </AppProvider>
      </AuthProvider>
    </A11yProvider>
  </StrictMode>
);
