import { useRef, useState } from 'react';
import { useT } from '../i18n';
import {
  mevcutOzet,
  tumVeriyiSil,
  yedegiIndir,
  yedekCozumle,
  yedekOzeti,
  YedekHatasi,
  yedekYukle,
  type YedekDosyasi,
  type YedekOzeti,
  type YuklemeModu,
} from '../lib/yedek';
import { SayfaBasligi, Uyari } from '../ui/Parcalar';
import { IkonIndir, IkonYukle } from '../ui/Ikonlar';

function OzetListesi({ ozet }: { ozet: YedekOzeti }) {
  const t = useT();
  const satirlar: [string, number][] = [
    [t('formD1'), ozet.gozlem],
    [t('formD2'), ozet.profil],
    [t('formD3'), ozet.tarama],
    [t('yedekDiziler'), ozet.diziler],
    [t('yedekOturumlar'), ozet.oturumlar],
  ];
  return (
    <ul className="liste-sade" style={{ display: 'grid', gap: 4 }}>
      {satirlar.map(([ad, sayi]) => (
        <li key={ad} className="satir kucuk" style={{ gap: 8 }}>
          <span
            className="rozet rozet-vurgu"
            style={{ minWidth: 34, justifyContent: 'center', opacity: sayi ? 1 : 0.45 }}
          >
            {sayi}
          </span>
          <span style={{ opacity: sayi ? 1 : 0.6 }}>{ad}</span>
        </li>
      ))}
    </ul>
  );
}

export default function Yedek() {
  const t = useT();
  const [ozet, setOzet] = useState<YedekOzeti>(mevcutOzet);
  const [durum, setDurum] = useState<string | null>(null);
  const [hata, setHata] = useState<string | null>(null);
  const [bekleyen, setBekleyen] = useState<YedekDosyasi | null>(null);
  const [silOnay, setSilOnay] = useState(false);
  const dosyaRef = useRef<HTMLInputElement>(null);

  async function indir() {
    setHata(null);
    try {
      const sonuc = await yedegiIndir();
      setDurum(sonuc === 'paylasildi' ? t('yedekPaylasildi') : t('yedekIndirildi'));
    } catch {
      setHata(t('yedekIndirmeHatasi'));
    }
  }

  async function dosyaSecildi(dosya: File | undefined) {
    setHata(null);
    setDurum(null);
    if (!dosya) return;
    try {
      setBekleyen(yedekCozumle(await dosya.text()));
    } catch (e) {
      const kod = e instanceof YedekHatasi ? e.message : 'okunamadi';
      setHata(
        kod === 'baskaDosya'
          ? t('yedekBaskaDosya')
          : kod === 'yeniSurum'
            ? t('yedekYeniSurum')
            : t('yedekOkunamadi'),
      );
    } finally {
      if (dosyaRef.current) dosyaRef.current.value = '';
    }
  }

  function yukle(mod: YuklemeModu) {
    if (!bekleyen) return;
    setOzet(yedekYukle(bekleyen, mod));
    setBekleyen(null);
    setDurum(mod === 'birlestir' ? t('yedekBirlestirildi') : t('yedekDegistirildi'));
  }

  return (
    <div className="renk-9">
      <SayfaBasligi baslik={t('yedekBaslik')} alt={t('yedekAciklama')} geri />

      <Uyari baslik={t('yedekNedenBaslik')}>{t('yedekNeden')}</Uyari>

      {/* --- cihazdaki veri */}
      <section className="kart" style={{ padding: 18, margin: '20px 0' }}>
        <h2 style={{ fontSize: '1.02rem' }}>{t('yedekCihazdaki')}</h2>
        <div style={{ margin: '12px 0 16px' }}>
          <OzetListesi ozet={ozet} />
        </div>
        <button className="dugme" onClick={indir}>
          <IkonIndir />
          {t('yedekAl')}
        </button>
        <p className="kucuk" style={{ margin: '10px 0 0' }}>
          {t('yedekAlNot')}
        </p>
      </section>

      {/* --- geri yükleme */}
      <section className="kart" style={{ padding: 18, marginBottom: 20 }}>
        <h2 style={{ fontSize: '1.02rem' }}>{t('yedekGeriYukle')}</h2>

        {!bekleyen ? (
          <>
            <p className="kucuk">{t('yedekDosyaSec')}</p>
            <input
              ref={dosyaRef}
              type="file"
              accept="application/json,.json"
              onChange={(e) => dosyaSecildi(e.target.files?.[0])}
              style={{ display: 'none' }}
            />
            <button className="dugme dugme-ikincil" onClick={() => dosyaRef.current?.click()}>
              <IkonYukle />
              {t('yedekDosyaAc')}
            </button>
          </>
        ) : (
          <>
            <p className="kucuk" style={{ marginBottom: 4 }}>
              {t('yedekDosyaIcerigi')}
              {yedekOzeti(bekleyen).tarih && (
                <>
                  {' · '}
                  {new Date(yedekOzeti(bekleyen).tarih as string).toLocaleString('tr-TR')}
                </>
              )}
            </p>
            <div style={{ margin: '10px 0 16px' }}>
              <OzetListesi ozet={yedekOzeti(bekleyen)} />
            </div>

            <div className="satir" style={{ flexWrap: 'wrap' }}>
              <button className="dugme" onClick={() => yukle('birlestir')}>
                {t('yedekBirlestir')}
              </button>
              <button className="dugme dugme-ikincil" onClick={() => yukle('degistir')}>
                {t('yedekDegistir')}
              </button>
              <button className="dugme-sade kucuk" onClick={() => setBekleyen(null)}>
                {t('iptal')}
              </button>
            </div>
            <p className="kucuk" style={{ margin: '12px 0 0' }}>
              <strong>{t('yedekBirlestir')}:</strong> {t('yedekBirlestirNot')}
              <br />
              <strong>{t('yedekDegistir')}:</strong> {t('yedekDegistirNot')}
            </p>
          </>
        )}
      </section>

      {durum && (
        <p className="kucuk" style={{ color: 'var(--r4-koyu)', fontWeight: 650 }}>
          {durum}
        </p>
      )}
      {hata && (
        <p className="kucuk" style={{ color: 'var(--r5-koyu)', fontWeight: 650 }}>
          {hata}
        </p>
      )}

      {/* --- silme */}
      <section style={{ marginTop: 26 }}>
        {!silOnay ? (
          <button className="dugme-sade kucuk" onClick={() => setSilOnay(true)}>
            {t('yedekTumunuSil')}
          </button>
        ) : (
          <div
            className="kart"
            style={{
              padding: 16,
              background: 'var(--zemin-kirmizi)',
              borderColor: 'var(--r5)',
            }}
          >
            <strong style={{ color: 'var(--r5-koyu)' }}>{t('yedekSilOnay')}</strong>
            <p className="kucuk" style={{ margin: '6px 0 12px' }}>
              {t('yedekSilOnayNot')}
            </p>
            <div className="satir">
              <button
                className="dugme"
                style={{ background: 'var(--r5-koyu)' }}
                onClick={() => {
                  tumVeriyiSil();
                  setOzet(mevcutOzet());
                  setSilOnay(false);
                  setDurum(t('yedekSilindi'));
                }}
              >
                {t('yedekSilEvet')}
              </button>
              <button className="dugme dugme-ikincil" onClick={() => setSilOnay(false)}>
                {t('iptal')}
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
