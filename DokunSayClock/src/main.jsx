import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { A11yProvider } from "./state/A11yContext.jsx";
import { AppShell } from "@shared/AppShell.jsx";
import App from "./App.jsx";
import Shell from "./Shell.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <A11yProvider>
      <Shell>
        <AppShell
          appId="clock"
          title="DokunSay Clock"
          subtitle="Saat ve Zaman"
          icon="🕐"
        >
          <App />
        </AppShell>
      </Shell>
    </A11yProvider>
  </StrictMode>
);
