import { useState, type ReactNode } from 'react';
import { HashRouter, NavLink, Navigate, Route, Routes } from 'react-router-dom';
import { DilBaglami, useT, type DilKodu, type Sozluk } from './i18n';
import { rolOku, rolYaz, type Rol } from './lib/rol';
import { useKimlikYuvasi } from './lib/kimlikYuvasi';
import Bugun from './routes/Bugun';
import Diziler from './routes/Diziler';
import DiziTahta from './routes/DiziTahta';
import Etkinlikler from './routes/Etkinlikler';
import EtkinlikDetay from './routes/EtkinlikDetay';
import EtkinlikSunum from './routes/EtkinlikSunum';
import Araclar from './routes/Araclar';
import Formlar from './routes/Formlar';
import FormGozlem from './routes/formlar/Gozlem';
import FormProfil from './routes/formlar/Profil';
import FormTarama from './routes/formlar/Tarama';
import FormDiziPlani from './routes/formlar/DiziPlani';
import AracDetay from './routes/AracDetay';
import Yedek from './routes/Yedek';
import Ayarlar from './routes/Ayarlar';
import RolSecimi from './routes/RolSecimi';
import Giris from './routes/Giris';
import Evde from './routes/ebeveyn/Evde';
import EvdeEtkinlikler from './routes/ebeveyn/EvdeEtkinlikler';
import { IkonArac, IkonDizi, IkonEtkinlik, IkonEv, IkonForm } from './ui/Ikonlar';

interface Bag {
  yol: string;
  etiket: keyof Sozluk;
  ikon: ReactNode;
  tam: boolean;
}

/**
 * Rol, hangi sekmelerin görüneceğini belirler. Ebeveyn modunda üç sekme
 * vardır: sınıf rutinleri, gözlem formları ve strateji kütüphanesi
 * ebeveynin işi değildir (Bölüm 17).
 */
const BAGLAR: Record<Rol, Bag[]> = {
  ogretmen: [
    { yol: '/', etiket: 'gezBugun', ikon: <IkonEv />, tam: true },
    { yol: '/dizi', etiket: 'gezDizi', ikon: <IkonDizi />, tam: false },
    { yol: '/etkinlik', etiket: 'gezEtkinlik', ikon: <IkonEtkinlik />, tam: false },
    { yol: '/form', etiket: 'gezForm', ikon: <IkonForm />, tam: false },
    { yol: '/arac', etiket: 'gezArac', ikon: <IkonArac />, tam: false },
  ],
  ebeveyn: [
    { yol: '/', etiket: 'gezEvde', ikon: <IkonEv />, tam: true },
    { yol: '/evde/etkinlik', etiket: 'gezEvdeEtkinlik', ikon: <IkonEtkinlik />, tam: false },
    { yol: '/arac', etiket: 'gezArac', ikon: <IkonArac />, tam: false },
  ],
};

function AltBar({ rol }: { rol: Rol }) {
  const t = useT();
  const baglar = BAGLAR[rol];
  return (
    <nav
      className="altbar"
      aria-label={t('uygulamaAdi')}
      style={{ gridTemplateColumns: `repeat(${baglar.length}, 1fr)` }}
    >
      {baglar.map((b) => (
        <NavLink
          key={b.yol}
          to={b.yol}
          end={b.tam}
          className={({ isActive }) => (isActive ? 'etkin' : undefined)}
        >
          {b.ikon}
          <span>{t(b.etiket)}</span>
        </NavLink>
      ))}
    </nav>
  );
}

const GIRIS_ANAHTARI = 'za.girisGoruldu';

export default function App({ dil }: { dil: DilKodu }) {
  useKimlikYuvasi();

  const [rol, setRol] = useState<Rol | null>(rolOku);
  // Giriş sayfası ilk açılışta bir kez görünür; sonra rol seçimine geçilir.
  const [girisGoruldu, setGirisGoruldu] = useState(
    () => localStorage.getItem(GIRIS_ANAHTARI) === '1',
  );

  function rolSec(r: Rol) {
    rolYaz(r);
    setRol(r);
  }

  if (!girisGoruldu) {
    return (
      <DilBaglami.Provider value={dil}>
        <Giris
          onBasla={() => {
            localStorage.setItem(GIRIS_ANAHTARI, '1');
            setGirisGoruldu(true);
          }}
        />
      </DilBaglami.Provider>
    );
  }

  if (!rol) {
    return (
      <DilBaglami.Provider value={dil}>
        <RolSecimi onSec={rolSec} />
      </DilBaglami.Provider>
    );
  }

  const ebeveyn = rol === 'ebeveyn';

  return (
    <DilBaglami.Provider value={dil}>
      <HashRouter>
        <div className="uygulama">
          <AltBar rol={rol} />
          <main className="icerik">
            <Routes>
              <Route path="/" element={ebeveyn ? <Evde /> : <Bugun />} />

              {ebeveyn ? (
                <>
                  <Route path="/evde/etkinlik" element={<EvdeEtkinlikler />} />
                  {/* Ebeveyn modunda kapalı olan yollar ana ekrana döner. */}
                  <Route path="/dizi/*" element={<Navigate to="/" replace />} />
                  <Route path="/form/*" element={<Navigate to="/" replace />} />
                  <Route path="/etkinlik/*" element={<Navigate to="/evde/etkinlik" replace />} />
                </>
              ) : (
                <>
                  <Route path="/dizi" element={<Diziler />} />
                  <Route path="/dizi/:id" element={<DiziTahta />} />
                  <Route path="/etkinlik" element={<Etkinlikler />} />
                  <Route path="/etkinlik/:id" element={<EtkinlikDetay />} />
                  <Route path="/etkinlik/:id/sunum" element={<EtkinlikSunum />} />
                  <Route path="/form" element={<Formlar />} />
                  <Route path="/form/gozlem" element={<FormGozlem />} />
                  <Route path="/form/gozlem/:id" element={<FormGozlem />} />
                  <Route path="/form/profil" element={<FormProfil />} />
                  <Route path="/form/profil/:id" element={<FormProfil />} />
                  <Route path="/form/tarama" element={<FormTarama />} />
                  <Route path="/form/tarama/:id" element={<FormTarama />} />
                  <Route path="/form/dizi" element={<FormDiziPlani />} />
                  <Route path="/evde/*" element={<Navigate to="/" replace />} />
                </>
              )}

              <Route path="/arac" element={<Araclar rol={rol} />} />
              <Route path="/arac/:id" element={<AracDetay />} />
              <Route
                path="/giris"
                element={<Giris onBasla={() => window.history.back()} />}
              />
              <Route path="/yedek" element={<Yedek />} />
              <Route
                path="/ayarlar"
                element={<Ayarlar rol={rol} onRol={rolSec} />}
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </HashRouter>
    </DilBaglami.Provider>
  );
}
