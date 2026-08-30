import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { A11yProvider } from './state/A11yContext.jsx';
import { AppShell } from '@shared/AppShell.jsx';
import { LangSwitcher } from '@shared/LangSwitcher.jsx';
import { setAppFavicon } from '@shared/appIcon.js';
import { useSharedLang } from '@shared/useSharedLang.js';
import App from './App';
import './styles/animations.css';

function Root() {
  const [lang, setLang] = useSharedLang();
  useEffect(() => { setAppFavicon('tam'); }, []);
  return (
    <A11yProvider>
      <AppShell
        appId="tam"
        title="DokunSay Tam"
        icon="±"
        backLang={lang}
        tools={<LangSwitcher lang={lang} setLang={setLang} />}
      >
        <App lang={lang} />
      </AppShell>
    </A11yProvider>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Root />
  </StrictMode>
);
