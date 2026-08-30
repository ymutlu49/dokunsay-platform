import { Link, useParams } from 'react-router-dom';
import { useT } from '../i18n';
import { bolumBul, bolumRengi, kartBul, komsuKartlar, materyalGerekir } from '../content';
import { kartinAraci } from '../tools/kayit';
import { Adimlar, Alan, Bos, Profiller, SayfaBasligi } from '../ui/Parcalar';
import { IkonArac, IkonOk } from '../ui/Ikonlar';

export default function EtkinlikDetay() {
  const t = useT();
  const { id } = useParams();
  const kart = id ? kartBul(id) : undefined;

  if (!kart) return <Bos metin={t('etkinlikSonucYok')} />;

  const bolum = bolumBul(kart.section);
  const { onceki, sonraki } = komsuKartlar(kart.id);
  const arac = kartinAraci(kart.id);

  return (
    <div className={`renk-${bolumRengi(kart.section)}`}>
      <SayfaBasligi
        baslik={kart.title}
        alt={bolum ? `${kart.id} · ${bolum.title}` : kart.id}
        geri
      />

      <div className="sarmal" style={{ marginBottom: 8 }}>
        <span className="rozet rozet-notr">{kart.duration}</span>
        {kart.bookChapter && (
          <span className="rozet rozet-vurgu">
            {t('etkinlikKitapBolum', { sayi: kart.bookChapter })}
          </span>
        )}
        {materyalGerekir(kart) && <span className="rozet rozet-notr">{kart.material}</span>}
      </div>

      {/* Uygulamada ad değiştiyse kitaptaki özgün adı göster: kitabı elinde
          tutan öğretmen aradığı kartı kaybetmesin. */}
      {kart.bookTitle && (
        <p className="kucuk" style={{ marginBottom: 18 }}>
          {t('etkinlikKitaptakiAd', { ad: kart.bookTitle })}
        </p>
      )}

      <div className="satir" style={{ marginBottom: 24, flexWrap: 'wrap' }}>
        <Link to={`/etkinlik/${kart.id}/sunum`} className="dugme" style={{ flex: 1, minWidth: 180 }}>
          {t('derseGotur')}
        </Link>
        {arac && (
          <Link to={`/arac/${arac.id}`} className="dugme dugme-ikincil">
            <IkonArac size={19} />
            {t(arac.ad)}
          </Link>
        )}
      </div>

      <Alan baslik={t('alanNeden')}>
        <p style={{ margin: 0 }}>{kart.why}</p>
      </Alan>

      {kart.figure && (
        <figure style={{ margin: '0 0 22px' }}>
          <img
            src={kart.figure}
            alt={kart.figureCaption || kart.title}
            loading="lazy"
            style={{
              width: '100%',
              borderRadius: 'var(--r-m)',
              border: '1px solid var(--cizgi)',
              background: '#fff',
            }}
          />
          {kart.figureCaption && (
            <figcaption className="kucuk" style={{ marginTop: 8 }}>
              {kart.figureCaption}
            </figcaption>
          )}
        </figure>
      )}

      {kart.prep.length > 0 && (
        <Alan baslik={t('alanHazirlik')}>
          <ul className="liste">
            {kart.prep.map((x, i) => (
              <li key={i}>{x}</li>
            ))}
          </ul>
        </Alan>
      )}

      {kart.steps.length > 0 && (
        <Alan baslik={t('alanYonerge')}>
          <Adimlar adimlar={kart.steps} />
        </Alan>
      )}

      {kart.ask.length > 0 && (
        <Alan baslik={t('alanSorulur')}>
          <ul className="liste">
            {kart.ask.map((x, i) => (
              <li key={i}>{x}</li>
            ))}
          </ul>
        </Alan>
      )}

      {kart.support.length > 0 && (
        <Alan baslik={t('alanTakilan')}>
          <Adimlar adimlar={kart.support} />
        </Alan>
      )}

      {kart.extension.length > 0 && (
        <Alan baslik={t('alanUzatma')}>
          <ul className="liste">
            {kart.extension.map((x, i) => (
              <li key={i}>{x}</li>
            ))}
          </ul>
        </Alan>
      )}

      {Object.keys(kart.profiles).length > 0 && (
        <Alan baslik={t('alanProfil')}>
          <Profiller profiller={kart.profiles} />
        </Alan>
      )}

      {kart.criterion && (
        <div className="kart zemin-vurgu" style={{ padding: 16, borderColor: 'var(--vurgu)' }}>
          <h3
            style={{
              fontSize: '0.74rem',
              textTransform: 'uppercase',
              letterSpacing: '0.07em',
              color: 'var(--vurgu-koyu)',
            }}
          >
            {t('alanOlcut')}
          </h3>
          <p style={{ margin: 0 }}>{kart.criterion}</p>
        </div>
      )}

      {/* önceki / sonraki etkinlik */}
      <nav className="satir" style={{ marginTop: 26, gap: 10, alignItems: 'stretch' }}>
        {onceki ? (
          <Link
            to={`/etkinlik/${onceki.id}`}
            className="kart kart-tikla"
            style={{ padding: 12, flex: 1, minWidth: 0 }}
          >
            <div className="kucuk satir" style={{ gap: 6 }}>
              <IkonOk size={16} yon="sol" />
              {t('etkinlikOncekiKart')}
            </div>
            <strong style={{ color: 'var(--lacivert)' }}>{onceki.title}</strong>
          </Link>
        ) : (
          <span style={{ flex: 1 }} />
        )}
        {sonraki && (
          <Link
            to={`/etkinlik/${sonraki.id}`}
            className="kart kart-tikla"
            style={{ padding: 12, flex: 1, minWidth: 0, textAlign: 'right' }}
          >
            <div className="kucuk satir" style={{ gap: 6, justifyContent: 'flex-end' }}>
              {t('etkinlikSonrakiKart')}
              <IkonOk size={16} />
            </div>
            <strong style={{ color: 'var(--lacivert)' }}>{sonraki.title}</strong>
          </Link>
        )}
      </nav>
    </div>
  );
}
