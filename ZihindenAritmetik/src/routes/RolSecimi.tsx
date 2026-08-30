import { useT } from '../i18n';
import type { Rol } from '../lib/rol';
import { IkonEtkinlik, IkonEv } from '../ui/Ikonlar';

/**
 * İlk açılışta rol seçimi.
 *
 * Kitabın ön kısmındaki üç okuma haritasının uygulamadaki karşılığı. Tek
 * dokunuşluk bir seçim; sonradan Araçlar sayfasından değiştirilebilir.
 */
export default function RolSecimi({ onSec }: { onSec: (r: Rol) => void }) {
  const t = useT();

  const secenekler: { rol: Rol; ikon: React.ReactNode; ad: string; alt: string; renk: number }[] = [
    {
      rol: 'ogretmen',
      ikon: <IkonEtkinlik size={30} />,
      ad: t('rolOgretmen'),
      alt: t('rolOgretmenAlt'),
      renk: 9,
    },
    {
      rol: 'ebeveyn',
      ikon: <IkonEv size={30} />,
      ad: t('rolEbeveyn'),
      alt: t('rolEbeveynAlt'),
      renk: 4,
    },
  ];

  return (
    <div className="rol-secimi">
      <div style={{ maxWidth: 560, width: '100%' }}>
        <div className="ortala" style={{ marginBottom: 26 }}>
          <h1 style={{ marginBottom: 6 }}>{t('uygulamaAdi')}</h1>
          <p className="kucuk" style={{ margin: 0 }}>
            {t('kitapAlt')}
          </p>
        </div>

        <h2 style={{ fontSize: '1.06rem', marginBottom: 12 }}>{t('rolSoru')}</h2>

        <div style={{ display: 'grid', gap: 12 }}>
          {secenekler.map((s) => (
            <button
              key={s.rol}
              className={`kart kart-tikla kart-serit renk-${s.renk}`}
              style={{ padding: 18 }}
              onClick={() => onSec(s.rol)}
            >
              <div className="satir">
                <span
                  style={{
                    display: 'grid',
                    placeItems: 'center',
                    width: 52,
                    height: 52,
                    borderRadius: 14,
                    background: 'var(--vurgu)',
                    color: '#fff',
                    flexShrink: 0,
                  }}
                >
                  {s.ikon}
                </span>
                <span style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
                  <strong style={{ color: 'var(--vurgu-koyu)', fontSize: '1.1rem' }}>{s.ad}</strong>
                  <span className="kucuk" style={{ display: 'block' }}>
                    {s.alt}
                  </span>
                </span>
              </div>
            </button>
          ))}
        </div>

        <p className="kucuk ortala" style={{ marginTop: 18 }}>
          {t('rolDegistirilebilir')}
        </p>
      </div>
    </div>
  );
}
