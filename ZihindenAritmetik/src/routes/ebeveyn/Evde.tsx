import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useT } from '../../i18n';
import {
  BES_DAKIKA,
  BES_DAKIKA_UYARI,
  DISKALKULI_ONCELIKLER,
  KANIT_NOTLARI,
  OVGU,
  TUZAKLAR,
  YAS_ARALIKLARI,
  YAS_NOTU,
  gununOnerisi,
} from '../../content/ebeveyn';
import { IkonAyar, IkonOk } from '../../ui/Ikonlar';

const YAS_ANAHTARI = 'za.yas';

/**
 * Ebeveyn modunun ana ekranı.
 *
 * Sıra bilinçlidir: önce bugün ne yapılacağı (tek bir şey), sonra nasıl
 * yapılacağı (beş adım), sonra nelerden kaçınılacağı. Ekranın hiçbir yerinde
 * puan, doğru/yanlış ya da süre yoktur; her bölüm çocuğa sorulacak bir
 * cümleyle biter.
 */
export default function Evde() {
  const t = useT();
  const [yas, setYas] = useState<string>(
    () => localStorage.getItem(YAS_ANAHTARI) ?? YAS_ARALIKLARI[1].id,
  );
  const [adim, setAdim] = useState(0);

  const secili = YAS_ARALIKLARI.find((y) => y.id === yas) ?? YAS_ARALIKLARI[1];
  const oneri = gununOnerisi();

  function yasSec(id: string) {
    setYas(id);
    localStorage.setItem(YAS_ANAHTARI, id);
  }

  return (
    <>
      <header style={{ marginBottom: 20, position: 'relative' }}>
        <Link
          to="/ayarlar"
          className="dugme-sade ayar-dugmesi"
          aria-label={t('ayarlarBaslik')}
          title={t('ayarlarBaslik')}
        >
          <IkonAyar />
        </Link>
        <div className="rozet rozet-notr" style={{ marginBottom: 10 }}>
          {t('ebeveynMod')}
        </div>
        <h1 style={{ marginBottom: 6 }}>{t('evdeBaslik')}</h1>
        <p className="kucuk" style={{ maxWidth: '54ch' }}>
          {t('evdeAciklama')}
        </p>
      </header>

      {/* --- yaş aralığı */}
      <section className={`renk-${secili.renk}`} style={{ marginBottom: 26 }}>
        <h2>{t('evdeYas')}</h2>
        <div className="secim-serit" style={{ margin: '10px 0 14px' }}>
          {YAS_ARALIKLARI.map((y) => (
            <button
              key={y.id}
              className={`secim renk-${y.renk}${y.id === yas ? ' etkin' : ''}`}
              onClick={() => yasSec(y.id)}
            >
              {y.yas}
            </button>
          ))}
        </div>
        <div className="kart kart-serit zemin-vurgu" style={{ padding: 16 }}>
          <h3 style={{ margin: 0, color: 'var(--vurgu-koyu)' }}>{secili.baslik}</h3>
          <p style={{ margin: '6px 0 0', fontStyle: 'italic' }}>{secili.ornek}</p>
        </div>
        <p className="kucuk" style={{ marginTop: 8 }}>
          {YAS_NOTU}
        </p>
      </section>

      {/* --- bugünün önerisi */}
      <section className="renk-4" style={{ marginBottom: 26 }}>
        <h2>{t('evdeBugun')}</h2>
        <div className="kart kart-serit" style={{ padding: 18, marginTop: 10 }}>
          <span className="rozet rozet-vurgu" style={{ marginBottom: 10 }}>
            {t('etkinlikKitapBolum', { sayi: oneri.bolum })} · {oneri.konu}
          </span>
          <h3 style={{ margin: '0 0 4px', fontSize: '1.14rem' }}>{oneri.yapilir}</h3>
          <p className="kucuk" style={{ margin: 0 }}>
            {oneri.neden}
          </p>
        </div>
      </section>

      {/* --- beş dakika */}
      <section className="renk-9" style={{ marginBottom: 26 }}>
        <h2>{t('evdeBesDakika')}</h2>
        <p className="kucuk">{t('evdeBesDakikaAlt')}</p>

        <ol className="liste-sade" style={{ marginTop: 12 }}>
          {BES_DAKIKA.map((b, i) => (
            <li key={i}>
              <button
                className="kart adim-satir"
                onClick={() => setAdim(adim === i ? -1 : i)}
                aria-expanded={adim === i}
              >
                <span className={i === adim ? 'adim-no sonuncu' : 'adim-no'}>{i + 1}</span>
                <span style={{ flex: 1, textAlign: 'left' }}>
                  <strong style={{ color: 'var(--lacivert)' }}>{b.adim}</strong>
                  {adim === i && (
                    <span className="kucuk" style={{ display: 'block', marginTop: 2 }}>
                      {b.not}
                    </span>
                  )}
                </span>
              </button>
            </li>
          ))}
        </ol>

        <div
          className="uyari"
          style={{ marginTop: 12, background: 'var(--zemin-kirmizi)', borderLeftColor: 'var(--r5)' }}
        >
          <strong style={{ color: 'var(--r5-koyu)' }}>{BES_DAKIKA_UYARI}</strong>
        </div>
      </section>

      {/* --- övgü */}
      <section className="renk-1" style={{ marginBottom: 26 }}>
        <h2>{t('evdeOvgu')}</h2>
        <p className="kucuk">{t('evdeOvguAlt')}</p>
        <div style={{ display: 'grid', gap: 10, marginTop: 12 }}>
          {OVGU.map((o, i) => (
            <div key={i} className="kart ovgu-satir">
              <span className="ovgu-eski">{o.yerine}</span>
              <IkonOk size={18} />
              <span className="ovgu-yeni">{o.bunu}</span>
            </div>
          ))}
        </div>
      </section>

      {/* --- tuzaklar */}
      <section className="renk-5" style={{ marginBottom: 26 }}>
        <h2>{t('evdeTuzaklar')}</h2>
        <div style={{ display: 'grid', gap: 10, marginTop: 12 }}>
          {TUZAKLAR.map((tz, i) => (
            <div
              key={i}
              className={'onemli' in tz && tz.onemli ? 'kart kart-serit' : 'kart'}
              style={{ padding: 14 }}
            >
              <strong style={{ color: 'var(--r5-koyu)' }}>{tz.tuzak}</strong>
              <div className="kucuk" style={{ margin: '3px 0' }}>
                {tz.belirti}
              </div>
              <div style={{ fontWeight: 650, color: 'var(--r4-koyu)' }}>→ {tz.yapilacak}</div>
            </div>
          ))}
        </div>
      </section>

      {/* --- kanıt */}
      <section className="renk-3" style={{ marginBottom: 26 }}>
        <h2>{t('evdeKanit')}</h2>
        <div style={{ display: 'grid', gap: 10, marginTop: 12 }}>
          {KANIT_NOTLARI.map((k, i) => (
            <div key={i} className="kart" style={{ padding: 14 }}>
              <strong style={{ color: 'var(--lacivert)' }}>{k.baslik}</strong>
              <p className="kucuk" style={{ margin: '4px 0 0' }}>
                {k.metin}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* --- diskalkuli */}
      <section className="renk-1" style={{ marginBottom: 26 }}>
        <h2>{t('evdeDiskalkuli')}</h2>
        <div style={{ display: 'grid', gap: 10, marginTop: 12 }}>
          {DISKALKULI_ONCELIKLER.map((d, i) => (
            <div key={i} className="kart kart-serit" style={{ padding: 14 }}>
              <strong style={{ color: 'var(--vurgu-koyu)' }}>{d.baslik}</strong>
              <p className="kucuk" style={{ margin: '4px 0 0' }}>
                {d.metin}
              </p>
            </div>
          ))}
        </div>
      </section>

      <Link to="/evde/etkinlik" className="dugme" style={{ width: '100%' }}>
        {t('evdeEtkinlikBagi')}
        <IkonOk />
      </Link>
    </>
  );
}
