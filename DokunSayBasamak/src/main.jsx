import React from 'react';
import ReactDOM from 'react-dom/client';
import { A11yProvider } from './state/A11yContext.jsx';
import { AppShell } from '@shared/AppShell.jsx';
import App from './App';
import './App.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <A11yProvider>
      <AppShell
        appId="basamak"
        title="DokunSay Basamak"
        subtitle="Basamak Değeri"
        icon="🔢"
      >
        <App />
      </AppShell>
    </A11yProvider>
  </React.StrictMode>
);
