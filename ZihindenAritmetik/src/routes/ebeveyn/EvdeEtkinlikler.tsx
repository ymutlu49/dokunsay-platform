import { Link } from 'react-router-dom';
import { useT } from '../../i18n';
import { EVDE_ARACLAR, EVDE_KARTLAR } from '../../content/ebeveyn';
import { bolumRengi, kartBul } from '../../content';
import { aracBul } from '../../tools/kayit';
import { SayfaBasligi, Uyari } from '../../ui/Parcalar';
import { IkonOk } from '../../ui/Ikonlar';

/**
 * Evde uygulanabilir etkinlikler ve araçlar.
 *
 * Kartlar Etkinlik Kitabı'nın dizininden gelir: 1.4, 2.1, 3.3 ve 8.1 evde
 * uygulanabilir olarak işaretlenmiştir. Ebeveyne kartın tamamı değil, işe
 * yarayan üç alanı gösterilir — neden yapıldığı, ne sorulacağı ve çocuk
 * takıldığında ne yapılacağı. Sınıf yönergesi ve değerlendirme ölçütü
 * öğretmenin işidir.
 */
export default function EvdeEtkinlikler() {
  const t = useT();
  const kartlar = EVDE_KARTLAR.map((k) => kartBul(k)).filter(
    (k): k is NonNullable<typeof k> => Boolean(k),
  );
  const araclar = EVDE_ARACLAR.map((a) => aracBul(a)).filter(
    (a): a is NonNullable<typeof a> => Boolean(a),
  );

  return (
    <>
      <SayfaBasligi baslik={t('evdeEtkinlikBaslik')} alt={t('evdeEtkinlikAciklama')} geri />

      <Uyari baslik={t('evdeYanindaOtur')}>{t('evdeYanindaOturNot')}</Uyari>

      <div style={{ display: 'grid', gap: 16, margin: '22px 0 30px' }}>
        {kartlar.map((k) => (
          <article
            key={k.id}
            className={`kart kart-serit renk-${bolumRengi(k.section)}`}
            style={{ padding: 18 }}
          >
            <div className="sarmal" style={{ marginBottom: 8 }}>
              <span className="rozet rozet-dolu">{k.duration}</span>
              {k.material && <span className="rozet rozet-notr">{k.material}</span>}
            </div>
            <h2 style={{ margin: '0 0 6px', fontSize: '1.16rem' }}>{k.title}</h2>
            <p className="kucuk">{k.why}</p>

            {k.figure && (
              <img
                src={k.figure}
                alt={k.figureCaption || k.title}
                loading="lazy"
                style={{
                  width: '100%',
                  borderRadius: 'var(--r-s)',
                  border: '1px solid var(--cizgi)',
                  margin: '10px 0',
                  background: '#fff',
                }}
              />
            )}

            {k.ask.length > 0 && (
              <div style={{ marginTop: 10 }}>
                <h3 className="alan-basligi">{t('evdeNeSorulur')}</h3>
                <ul className="liste">
                  {k.ask.map((s, i) => (
                    <li key={i} style={{ fontWeight: 600 }}>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {k.support.length > 0 && (
              <div style={{ marginTop: 10 }}>
                <h3 className="alan-basligi">{t('evdeTakilirsa')}</h3>
                <ol className="liste">
                  {k.support.slice(0, 3).map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ol>
              </div>
            )}
          </article>
        ))}
      </div>

      <section>
        <h2>{t('evdeAraclar')}</h2>
        <p className="kucuk">{t('evdeAraclarAlt')}</p>
        <div className="izgara" style={{ marginTop: 12 }}>
          {araclar.map((a) => (
            <Link
              key={a.id}
              to={`/arac/${a.id}`}
              className={`kart kart-tikla kart-serit renk-${a.renk}`}
              style={{ padding: 16 }}
            >
              <div className="satir">
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3 style={{ margin: 0, color: 'var(--vurgu-koyu)' }}>{t(a.ad)}</h3>
                  <div className="kucuk">{t(a.alt)}</div>
                </div>
                <IkonOk />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
