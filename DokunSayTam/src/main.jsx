import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { A11yProvider } from './state/A11yContext.jsx';
import { AppShell } from '@shared/AppShell.jsx';
import App from './App';
import './styles/animations.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <A11yProvider>
      <AppShell
        appId="tam"
        title="DokunSay Tam"
        subtitle="Tam Sayılar"
        icon="➕➖"
      >
        <App />
      </AppShell>
    </A11yProvider>
  </StrictMode>
);
