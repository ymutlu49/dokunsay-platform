import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useT } from '../i18n';
import { bolumRengi, kartBul } from '../content';
import { Adimlar, Bos, Profiller } from '../ui/Parcalar';
import { IkonKapat, IkonOk } from '../ui/Ikonlar';

interface Slayt {
  etiket: string;
  govde: ReactNode;
}

/**
 * Tam ekran "derse götür" modu.
 *
 * Kart tek sayfa olduğu için sunum da tek akıştır: yönerge basamakları
 * teker teker büyütülür, sorular ve destek basamakları ayrı ekranlarda
 * durur. Amaç öğretmenin telefonu/tableti elinde tutup ilerlemesi.
 */
export default function EtkinlikSunum() {
  const t = useT();
  const nav = useNavigate();
  const { id } = useParams();
  const kart = id ? kartBul(id) : undefined;
  const [i, setI] = useState(0);

  const slaytlar = useMemo<Slayt[]>(() => {
    if (!kart) return [];
    const s: Slayt[] = [
      {
        etiket: t('alanNeden'),
        govde: (
          <>
            <p
              style={{
                fontSize: 'clamp(1.1rem, 2.6vw, 1.5rem)',
                lineHeight: 1.5,
                maxWidth: '46ch',
              }}
            >
              {kart.why}
            </p>
            {kart.figure && (
              <img
                src={kart.figure}
                alt={kart.figureCaption || kart.title}
                style={{
                  maxWidth: '100%',
                  maxHeight: '46vh',
                  objectFit: 'contain',
                  borderRadius: 'var(--r-m)',
                  border: '1px solid var(--cizgi)',
                  marginTop: 12,
                }}
              />
            )}
            {kart.prep.length > 0 && (
              <div
                className="kart"
                style={{ padding: 14, marginTop: 18, background: 'var(--sayfa)' }}
              >
                <strong className="kucuk" style={{ color: 'var(--lacivert)' }}>
                  {t('alanHazirlik')}
                </strong>
                <ul className="liste" style={{ marginTop: 6 }}>
                  {kart.prep.map((x, k) => (
                    <li key={k}>{x}</li>
                  ))}
                </ul>
              </div>
            )}
          </>
        ),
      },
    ];

    kart.steps.forEach((adim, k) =>
      s.push({
        etiket: `${t('alanYonerge')} ${k + 1}/${kart.steps.length}`,
        govde: (
          <p
            style={{
              fontSize: 'clamp(1.5rem, 4.4vw, 2.7rem)',
              lineHeight: 1.35,
              fontWeight: 600,
              color: 'var(--vurgu-koyu)',
              maxWidth: '22ch',
            }}
          >
            {adim}
          </p>
        ),
      }),
    );

    if (kart.ask.length)
      s.push({
        etiket: t('alanSorulur'),
        govde: (
          <ul className="liste-sade" style={{ maxWidth: '26ch' }}>
            {kart.ask.map((x, k) => (
              <li
                key={k}
                style={{
                  fontSize: 'clamp(1.15rem, 3vw, 1.9rem)',
                  lineHeight: 1.4,
                  color: 'var(--vurgu-koyu)',
                  fontWeight: 650,
                  marginBottom: 18,
                }}
              >
                {x}
              </li>
            ))}
          </ul>
        ),
      });

    if (kart.support.length)
      s.push({ etiket: t('alanTakilan'), govde: <Adimlar adimlar={kart.support} /> });

    if (kart.extension.length)
      s.push({
        etiket: t('alanUzatma'),
        govde: (
          <ul className="liste">
            {kart.extension.map((x, k) => (
              <li key={k} style={{ fontSize: '1.1rem' }}>
                {x}
              </li>
            ))}
          </ul>
        ),
      });

    if (Object.keys(kart.profiles).length)
      s.push({
        etiket: t('alanProfil'),
        govde: <Profiller profiller={kart.profiles} />,
      });

    if (kart.criterion)
      s.push({
        etiket: t('alanOlcut'),
        govde: (
          <p
            style={{
              fontSize: 'clamp(1.2rem, 3.2vw, 2rem)',
              lineHeight: 1.4,
              color: 'var(--vurgu-koyu)',
              fontWeight: 650,
              maxWidth: '24ch',
            }}
          >
            {kart.criterion}
          </p>
        ),
      });

    return s;
  }, [kart, t]);

  const son = slaytlar.length - 1;

  useEffect(() => {
    function tus(e: KeyboardEvent) {
      if (e.key === 'ArrowRight' || e.key === ' ') setI((v) => Math.min(v + 1, son));
      else if (e.key === 'ArrowLeft') setI((v) => Math.max(v - 1, 0));
      else if (e.key === 'Escape') nav(-1);
    }
    window.addEventListener('keydown', tus);
    return () => window.removeEventListener('keydown', tus);
  }, [son, nav]);

  if (!kart) return <Bos metin={t('etkinlikSonucYok')} />;

  const slayt = slaytlar[Math.min(i, son)];

  return (
    <div className={`tahta renk-${bolumRengi(kart.section)}`}>
      <div className="tahta-ust">
        <span className="rozet rozet-dolu">{kart.id}</span>
        <strong style={{ flex: 1, minWidth: 0, color: 'var(--lacivert)' }}>
          {kart.title}
        </strong>
        <span className="kucuk">{kart.duration}</span>
        <button className="dugme-sade" onClick={() => nav(-1)} aria-label={t('kapat')}>
          <IkonKapat />
        </button>
      </div>

      <div className="tahta-govde" style={{ alignItems: 'center', justifyContent: 'center' }}>
        <div
          className="kucuk"
          style={{
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            fontWeight: 700,
            marginBottom: 18,
          }}
        >
          {slayt.etiket}
        </div>
        <div style={{ width: '100%', maxWidth: 900, textAlign: 'center' }}>
          <div style={{ display: 'inline-block', textAlign: 'left' }}>{slayt.govde}</div>
        </div>
      </div>

      <div className="tahta-alt">
        <button
          className="dugme dugme-ikincil"
          onClick={() => setI((v) => Math.max(v - 1, 0))}
          disabled={i === 0}
        >
          <IkonOk yon="sol" />
          {t('onceki')}
        </button>
        <div className="bosluk nokta-serit" aria-hidden="true">
          {slaytlar.map((_, k) => (
            <span key={k} className={k === i ? 'etkin' : undefined} />
          ))}
        </div>
        {i < son ? (
          <button className="dugme" onClick={() => setI((v) => Math.min(v + 1, son))}>
            {t('sonraki')}
            <IkonOk />
          </button>
        ) : (
          <button className="dugme" onClick={() => nav(-1)}>
            {t('bitir')}
          </button>
        )}
      </div>
    </div>
  );
}
