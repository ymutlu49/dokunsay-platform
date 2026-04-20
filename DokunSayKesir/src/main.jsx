import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { A11yProvider } from "./state/A11yContext.jsx";
import { I18nProvider } from "./i18n/index.jsx";
import { AppShell } from "@shared/AppShell.jsx";
import App from "./App.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <A11yProvider>
      <I18nProvider>
        <AppShell
          appId="kesir"
          title="DokunSay Kesir"
          subtitle="Kesirler"
          icon="🍕"
        >
          <App />
        </AppShell>
      </I18nProvider>
    </A11yProvider>
  </StrictMode>
);
