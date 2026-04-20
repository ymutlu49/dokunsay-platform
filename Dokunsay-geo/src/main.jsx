import React from "react";
import { createRoot } from "react-dom/client";
import { A11yProvider } from "./state/A11yContext.jsx";
import { AppShell } from "@shared/AppShell.jsx";
import App from "./App.jsx";

const root = createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <A11yProvider>
      <AppShell
        appId="geo"
        title="DokunSay Geo"
        subtitle="Geometri"
        icon="🔺"
      >
        <App />
      </AppShell>
    </A11yProvider>
  </React.StrictMode>
);
