import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useT } from '../i18n';
import { aracBul } from '../tools/kayit';
import { bolumRengi, kartBul } from '../content';
import { Bos, SayfaBasligi } from '../ui/Parcalar';
import { IkonKapat, IkonTahta } from '../ui/Ikonlar';

export default function AracDetay() {
  const t = useT();
  const { id } = useParams();
  const arac = id ? aracBul(id) : undefined;
  const [tamEkran, setTamEkran] = useState(false);

  // Tam ekranda Esc ile çıkış: tahtada uzaktan kumandayla da kapatılabilsin.
  useEffect(() => {
    if (!tamEkran) return;
    function tus(e: KeyboardEvent) {
      if (e.key === 'Escape') setTamEkran(false);
    }
    window.addEventListener('keydown', tus);
    return () => window.removeEventListener('keydown', tus);
  }, [tamEkran]);

  if (!arac) return <Bos metin="—" />;

  const Bilesen = arac.bilesen;
  const bagliKartlar = arac.kartlar
    .map((k) => kartBul(k))
    .filter((k): k is NonNullable<typeof k> => Boolean(k));

  if (tamEkran) {
    return (
      <div className={`tahta arac-tam renk-${arac.renk}`}>
        <div className="tahta-ust">
          <strong style={{ flex: 1, minWidth: 0, color: 'var(--lacivert)' }}>{t(arac.ad)}</strong>
          <button
            className="dugme-sade"
            onClick={() => setTamEkran(false)}
            aria-label={t('aracTamEkranCik')}
          >
            <IkonKapat />
          </button>
        </div>
        <Bilesen />
      </div>
    );
  }

  return (
    <div className={`renk-${arac.renk}`}>
      <SayfaBasligi
        baslik={t(arac.ad)}
        alt={t(arac.alt)}
        geri
        sag={
          <button className="dugme" onClick={() => setTamEkran(true)}>
            <IkonTahta />
            {t('aracTamEkran')}
          </button>
        }
      />

      <Bilesen />

      {bagliKartlar.length > 0 && (
        <section style={{ marginTop: 30 }}>
          <h2 style={{ fontSize: '1rem' }}>{t('aracBagliEtkinlikler')}</h2>
          <div className="izgara" style={{ marginTop: 12 }}>
            {bagliKartlar.map((k) => (
              <Link
                key={k.id}
                to={`/etkinlik/${k.id}`}
                className={`kart kart-tikla kart-serit renk-${bolumRengi(k.section)}`}
                style={{ padding: 14 }}
              >
                <div className="sarmal" style={{ marginBottom: 6 }}>
                  <span className="rozet rozet-dolu">{k.id}</span>
                  <span className="rozet rozet-notr">{k.duration}</span>
                </div>
                <strong style={{ color: 'var(--lacivert)' }}>{k.title}</strong>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
