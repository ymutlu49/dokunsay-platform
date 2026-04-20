import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { A11yProvider } from "./state/A11yContext";
import { AppProvider } from "./state/AppContext";
import { AuthProvider } from "./state/AuthContext";
import { ARProvider } from "./state/ARContext";
import { AppShell as PlatformShell } from "@shared/AppShell.jsx";
import AppShell from "./AppShell";
import "./index.css";

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
            >
              <AppShell />
            </PlatformShell>
          </ARProvider>
        </AppProvider>
      </AuthProvider>
    </A11yProvider>
  </StrictMode>
);
