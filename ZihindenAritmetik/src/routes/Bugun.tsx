import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useT } from '../i18n';
import { haftalar, haftaninDizileri, hazirDiziler, kartlar } from '../content';
import { IkonArac, IkonAyar, IkonDizi, IkonEtkinlik, IkonForm, IkonOk } from '../ui/Ikonlar';

const HAFTA_ANAHTARI = 'za.hafta';

function GirisKart({
  to,
  ikon,
  baslik,
  alt,
}: {
  to: string;
  ikon: React.ReactNode;
  baslik: string;
  alt: string;
}) {
  return (
    <Link to={to} className="kart kart-tikla" style={{ padding: 18 }}>
      <div className="satir">
        <span
          style={{
            display: 'grid',
            placeItems: 'center',
            width: 44,
            height: 44,
            borderRadius: 12,
            background: 'var(--zemin-vurgu)',
            color: 'var(--lacivert)',
            flexShrink: 0,
          }}
        >
          {ikon}
        </span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={{ margin: 0 }}>{baslik}</h3>
          <div className="kucuk">{alt}</div>
        </div>
        <span style={{ color: 'var(--gri)' }}>
          <IkonOk />
        </span>
      </div>
    </Link>
  );
}

export default function Bugun() {
  const t = useT();
  const [hafta, setHafta] = useState<number>(() => {
    const kayit = Number(localStorage.getItem(HAFTA_ANAHTARI));
    return haftalar.includes(kayit) ? kayit : haftalar[0];
  });

  const oturumlar = haftaninDizileri(hafta);
  const odak = oturumlar[0]?.strategy ?? '';

  function haftaSec(h: number) {
    setHafta(h);
    localStorage.setItem(HAFTA_ANAHTARI, String(h));
  }

  return (
    <>
      <header style={{ marginBottom: 22, position: 'relative' }}>
        <Link
          to="/ayarlar"
          className="dugme-sade ayar-dugmesi"
          aria-label={t('ayarlarBaslik')}
          title={t('ayarlarBaslik')}
        >
          <IkonAyar />
        </Link>
        <div className="rozet rozet-notr" style={{ marginBottom: 10 }}>
          {t('uygulamaAlt')}
        </div>
        <h1 style={{ marginBottom: 6 }}>{t('bugunSelam')}</h1>
        <p className="kucuk" style={{ maxWidth: '54ch' }}>
          {t('bugunAciklama')}
        </p>
      </header>

      <div className="izgara" style={{ marginBottom: 28 }}>
        <GirisKart
          to="/dizi"
          ikon={<IkonDizi />}
          baslik={t('bugunDiziKart')}
          alt={t('bugunDiziAlt', { sayi: hazirDiziler.length })}
        />
        <GirisKart
          to="/etkinlik"
          ikon={<IkonEtkinlik />}
          baslik={t('bugunEtkinlikKart')}
          alt={t('bugunEtkinlikAlt', { sayi: kartlar.length })}
        />
        <GirisKart
          to="/arac"
          ikon={<IkonArac />}
          baslik={t('bugunAracKart')}
          alt={t('bugunAracAlt')}
        />
        <GirisKart
          to="/form"
          ikon={<IkonForm />}
          baslik={t('bugunFormKart')}
          alt={t('bugunFormAlt')}
        />
      </div>

      <section style={{ marginBottom: 28 }}>
        <h2>{t('bugunHafta')}</h2>
        <div className="secim-serit" style={{ margin: '12px 0 16px' }}>
          {haftalar.map((h) => (
            <button
              key={h}
              className={h === hafta ? 'secim etkin' : 'secim'}
              onClick={() => haftaSec(h)}
            >
              {t('bugunHaftaSec', { sayi: h })}
            </button>
          ))}
        </div>

        {odak && (
          <div className="kucuk" style={{ marginBottom: 12 }}>
            <strong style={{ color: 'var(--lacivert)' }}>{t('buHaftaOdak')}:</strong> {odak}
          </div>
        )}

        <div className="izgara">
          {oturumlar.map((d) => (
            <Link
              key={d.id}
              to={`/dizi/${encodeURIComponent(d.id)}`}
              className="kart kart-tikla"
              style={{ padding: 16 }}
            >
              <div className="rozet rozet-dolu" style={{ marginBottom: 10 }}>
                {t('diziOturum', { sayi: d.session ?? 1 })}
              </div>
              <div
                style={{
                  fontSize: '1.05rem',
                  fontWeight: 700,
                  color: 'var(--lacivert)',
                  lineHeight: 1.5,
                }}
              >
                {d.problems.slice(0, 3).join('  ·  ')}
                <span style={{ color: 'var(--gri-acik)' }}>{'  ·  ?'}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2>{t('ucKural')}</h2>
        <div className="izgara" style={{ marginTop: 12 }}>
          {[
            [t('kural1'), t('kural1Aciklama')],
            [t('kural2'), t('kural2Aciklama')],
            [t('kural3'), t('kural3Aciklama')],
          ].map(([b, a], i) => (
            <div key={i} className="kart" style={{ padding: 16 }}>
              <h3 style={{ fontSize: '0.98rem' }}>{b}</h3>
              <p className="kucuk" style={{ margin: 0 }}>
                {a}
              </p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
