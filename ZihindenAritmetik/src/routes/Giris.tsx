import { useEffect, useState } from 'react';
import { useT } from '../i18n';
import { kartlar, hazirDiziler } from '../content';
import { IkonArac, IkonDizi, IkonEtkinlik, IkonForm, IkonIndir, IkonOk } from '../ui/Ikonlar';

/** Tarayıcının "ana ekrana ekle" olayı; yalnızca ölçütleri sağlandığında gelir. */
interface YuklemeOlayi extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

function bagimsizMi() {
  return (
    window.matchMedia?.('(display-mode: standalone)').matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

function iosMu() {
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

/**
 * Giriş sayfası.
 *
 * Uygulamanın kapağı: kitabı tanıtır, kimin yazdığını söyler ve uygulamayı
 * cihaza kurmayı önerir. İlk açılışta bir kez görünür; sonra rol seçimine
 * geçilir. Ayarlar'dan yeniden açılabilir.
 *
 * Kurulum düğmesi tarayıcının kendi istemini kullanır. iOS'ta böyle bir istem
 * yoktur; orada Paylaş → "Ana Ekrana Ekle" adımı yazıyla anlatılır.
 */
export default function Giris({ onBasla }: { onBasla: () => void }) {
  const t = useT();
  const [yuklemeOlayi, setYuklemeOlayi] = useState<YuklemeOlayi | null>(null);
  const [kurulu, setKurulu] = useState(bagimsizMi);

  useEffect(() => {
    function yakala(e: Event) {
      e.preventDefault();
      setYuklemeOlayi(e as YuklemeOlayi);
    }
    function kuruldu() {
      setKurulu(true);
      setYuklemeOlayi(null);
    }
    window.addEventListener('beforeinstallprompt', yakala);
    window.addEventListener('appinstalled', kuruldu);
    return () => {
      window.removeEventListener('beforeinstallprompt', yakala);
      window.removeEventListener('appinstalled', kuruldu);
    };
  }, []);

  async function kur() {
    if (!yuklemeOlayi) return;
    await yuklemeOlayi.prompt();
    const { outcome } = await yuklemeOlayi.userChoice;
    if (outcome === 'accepted') setKurulu(true);
    setYuklemeOlayi(null);
  }

  const ozellikler = [
    {
      ikon: <IkonDizi />,
      renk: 9,
      ad: t('girisOzellikDizi'),
      alt: t('girisOzellikDiziAlt', { sayi: hazirDiziler.length }),
    },
    {
      ikon: <IkonEtkinlik />,
      renk: 1,
      ad: t('girisOzellikKart'),
      alt: t('girisOzellikKartAlt', { sayi: kartlar.length }),
    },
    { ikon: <IkonArac />, renk: 4, ad: t('girisOzellikArac'), alt: t('girisOzellikAracAlt') },
    { ikon: <IkonForm />, renk: 5, ad: t('girisOzellikForm'), alt: t('girisOzellikFormAlt') },
  ];

  return (
    <div className="giris">
      {/* Kapak sayfanın enini boydan boya kullanır; içerik ortada hizalanır. */}
      <header className="giris-kapak">
        <div className="giris-kapak-ic">
          <img src="simge-192.png" alt="" width={84} height={84} className="giris-simge" />
          <h1>{t('uygulamaAdi')}</h1>
          <p className="giris-alt">{t('kitapAlt')}</p>
          <p className="kucuk giris-hedef">{t('girisHedefKitle')}</p>
          <div className="giris-serit" aria-hidden="true">
            {Array.from({ length: 9 }, (_, i) => (
              <span key={i} />
            ))}
          </div>
        </div>
      </header>

      <div className="giris-govde">
        <p className="giris-giris">{t('girisTanim')}</p>

        <div className="giris-ozellikler">
          {ozellikler.map((o) => (
            <div key={o.ad} className={`kart giris-ozellik renk-${o.renk}`}>
              <span className="giris-ozellik-ikon">{o.ikon}</span>
              <h3>{o.ad}</h3>
              <p className="kucuk" style={{ margin: 0 }}>
                {o.alt}
              </p>
            </div>
          ))}
        </div>

        <div className="uyari" style={{ margin: '26px 0 0' }}>
          <div>
            <strong>{t('girisNeDegil')}</strong>
            <span>{t('girisNeDegilAciklama')}</span>
          </div>
        </div>

        <div className="giris-eylem">
          {/* --- kurulum */}
          {!kurulu && (
            <section className="kart giris-kurulum" style={{ padding: 18 }}>
              <h2 style={{ fontSize: '1.02rem' }}>{t('girisKurBaslik')}</h2>
              <p className="kucuk">{t('girisKurAciklama')}</p>
              {yuklemeOlayi ? (
                <button className="dugme" onClick={kur}>
                  <IkonIndir />
                  {t('girisKur')}
                </button>
              ) : (
                <p className="kucuk" style={{ margin: 0 }}>
                  {iosMu() ? t('girisKurIos') : t('girisKurElle')}
                </p>
              )}
            </section>
          )}

          <button className="dugme giris-basla" onClick={onBasla}>
            {t('girisBasla')}
            <IkonOk />
          </button>
        </div>

        {/* --- künye: kitabın üç yazarı, uygulamanın bir yazarı */}
        <footer className="giris-kunye">
          <div>
            <span className="rozet rozet-notr">{t('kitapEtiketi')}</span>
            <p style={{ margin: '6px 0 0' }}>{t('kitapYazarlari')}</p>
          </div>
          <div>
            <span className="rozet rozet-notr">{t('uygulamaEtiketi')}</span>
            <p style={{ margin: '6px 0 0' }}>{t('uygulamaYazari')}</p>
          </div>
          <p className="kucuk" style={{ margin: 0 }}>
            {t('veriUyari')}
          </p>
        </footer>
      </div>
    </div>
  );
}
