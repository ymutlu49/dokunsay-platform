import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { A11yProvider } from "./state/A11yContext";
import { AppProvider, useAppState } from "./state/AppContext";
import { AuthProvider } from "./state/AuthContext";
import { ARProvider } from "./state/ARContext";
import { AppShell as PlatformShell } from "@shared/AppShell.jsx";
import { LangSwitcher } from "@shared/LangSwitcher.jsx";
import { setAppFavicon } from "@shared/appIcon.js";
import { useAuthSlot } from "./hooks/useAuthSlot";
import AppShell from "./AppShell";
import type { Language } from "./types";
import "./index.css";

function BarLangTools() {
  const { state, dispatch } = useAppState();
  return (
    <>
      {/* numap-gate.js giriş rozetini bu yuvaya koyar; yuvayı ıskalarsa
          useAuthSlot taşır. Yuva olmadan rozet sağ üste sabitlenip dil
          anahtarının üstüne biniyordu. */}
      <span id="numapAuth" className="numap-yuvasi" />
      <LangSwitcher
        lang={state.language}
        setLang={(l: string) => dispatch({ type: "SET_LANGUAGE", language: l as Language })}
      />
    </>
  );
}

function BarShell() {
  const { state } = useAppState();
  useEffect(() => { setAppFavicon('bar'); }, []);
  useAuthSlot();
  // Dil hangi yoldan değişirse değişsin (LangSwitcher, sesli komut, döngü) cross-app
  // paylaşılan state'i (dk_lang + 'dk-lang-change') güncelle ki A11yPanel ve diğer
  // DokunSay uygulamaları senkron kalsın.
  useEffect(() => {
    try { localStorage.setItem("dk_lang", state.language); } catch { /* ignore */ }
    try { window.dispatchEvent(new CustomEvent("dk-lang-change", { detail: { lang: state.language } })); } catch { /* ignore */ }
  }, [state.language]);
  return (
    <PlatformShell
      appId="bar"
      title="DokunSay Bar"
      icon="🧮"
      backLang={state.language}
      tools={<BarLangTools />}
    >
      <AppShell />
    </PlatformShell>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <A11yProvider>
      <AuthProvider>
        <AppProvider>
          <ARProvider>
            <BarShell />
          </ARProvider>
        </AppProvider>
      </AuthProvider>
    </A11yProvider>
  </StrictMode>
);
