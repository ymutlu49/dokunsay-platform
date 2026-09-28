/**
 * Kök: ortak kabuk (AppShell + LangSwitcher) + A11yProvider — ZihindenAritmetik deseni
 * (06 §2.1). Dil `dk_lang` ile araçlar arasında paylaşılır; gizli AR/FA kaydı 'tr'ye çekilir.
 * Başlık/alt başlık seçili dilde. Kimlik yuvası AppShell'in kendisinde (#numapAuth).
 */
import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { AppShell } from '@shared/AppShell.jsx';
import { LangSwitcher } from '@shared/LangSwitcher.jsx';
import { useSharedLang } from '@shared/useSharedLang.js';
import { setAppFavicon } from '@shared/appIcon.js';
import { A11yProvider } from './state/A11yContext';
import { isLang, LANG_CODES, LangContext, translate } from './i18n';
import App from './App';
import './styles.css';
import './components/steps.css';
import './components/diagram/diagram.css';

function Root() {
  const [raw, setLang] = useSharedLang();
  const lang = isLang(raw) ? raw : 'tr';
  useEffect(() => {
    setAppFavicon('problem');
  }, []);
  useEffect(() => {
    document.title = translate(lang, 'app_title');
  }, [lang]);
  return (
    <LangContext.Provider value={lang}>
      <AppShell
        appId="problem"
        title={translate(lang, 'app_title')}
        subtitle={translate(lang, 'app_subtitle')}
        icon="🧩"
        backLang={lang}
        tools={<LangSwitcher lang={lang} setLang={setLang} langs={LANG_CODES} />}
      >
        <A11yProvider lang={lang}>
          <App lang={lang} />
        </A11yProvider>
      </AppShell>
    </LangContext.Provider>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root />
  </StrictMode>,
);
