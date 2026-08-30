import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { AppShell } from '@shared/AppShell.jsx';
import { LangSwitcher } from '@shared/LangSwitcher.jsx';
import { useSharedLang } from '@shared/useSharedLang.js';
import './styles.css';
import App from './App.tsx';
import { DILLER, dilYaz, type DilKodu } from './i18n';

const DIL_KODLARI = DILLER.map((d) => d.kod);

function gecerliDil(v: string): DilKodu {
  return (DIL_KODLARI as string[]).includes(v) ? (v as DilKodu) : 'tr';
}

/**
 * Uygulamanın dış çerçevesi.
 *
 * Diğer yedi DokunSay aracıyla aynı kabuk kullanılır: üst kimlik bandı
 * ("Menüye Dön" + simge + başlık + dil anahtarı), aynı tipografi ve zemin.
 * Böylece dokunsay.com'da araçlar arasında geçen öğretmen aynı çerçeveyi
 * görür.
 *
 * Dil de platformla paylaşılır (`dk_lang`): bir araçta Kurmancî seçen
 * öğretmen ötekinde de Kurmancî görür.
 */
function Kok() {
  const [paylasilanDil, setPaylasilanDil] = useSharedLang();
  const dil = gecerliDil(paylasilanDil);

  useEffect(() => {
    dilYaz(dil);
  }, [dil]);

  return (
    <AppShell
      appId="zihinden"
      title="Zihinden Aritmetik"
      subtitle="Kitabın uygulama cildi"
      icon="📘"
      backLang={dil}
      tools={
        <>
          {/* numap-gate.js giriş rozetini bu yuvaya taşır (bkz. useKimlikYuvasi) */}
          <span id="numapAuth" className="numap-yuvasi" />
          <LangSwitcher lang={dil} setLang={setPaylasilanDil} langs={DIL_KODLARI} />
        </>
      }
    >
      <App dil={dil} />
    </AppShell>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Kok />
  </StrictMode>,
);
