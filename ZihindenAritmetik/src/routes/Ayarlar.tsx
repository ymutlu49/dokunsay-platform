import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useT } from '../i18n';
import { KILIT_VAR, kilidiKapat } from '../lib/kilit';
import type { Rol } from '../lib/rol';
import { SayfaBasligi, Uyari } from '../ui/Parcalar';
import { IkonIndir, IkonKilit, IkonOk } from '../ui/Ikonlar';

/**
 * Ayarlar.
 *
 * Araçlar sayfası yalnızca manipülatiflere ayrılmıştır; kullanım biçimi, dil,
 * yedekleme ve künye buraya toplanmıştır. Ders sırasında açılan bir sayfada
 * ayar bulunmaması, yanlışlıkla dil ya da rol değiştirmeyi de önler.
 */
export default function Ayarlar({
  rol,
  onRol,
  onKilitKaldir,
}: {
  rol: Rol;
  onRol: (r: Rol) => void;
  onKilitKaldir: () => void;
}) {
  const t = useT();
  const [kaldirmaSoruldu, setKaldirmaSoruldu] = useState(false);

  return (
    <div className="renk-9">
      <SayfaBasligi baslik={t('ayarlarBaslik')} geri />

      <section style={{ marginBottom: 28 }}>
        <h2>{t('rolBaslik')}</h2>
        <div className="secim-serit" style={{ marginTop: 10 }}>
          {(['ogretmen', 'ebeveyn'] as Rol[]).map((r) => (
            <button
              key={r}
              className={rol === r ? 'secim etkin' : 'secim'}
              onClick={() => onRol(r)}
            >
              {r === 'ogretmen' ? t('rolOgretmen') : t('rolEbeveyn')}
            </button>
          ))}
        </div>
        <p className="kucuk" style={{ marginTop: 8 }}>
          {rol === 'ogretmen' ? t('rolOgretmenAlt') : t('rolEbeveynAlt')}
        </p>
      </section>

      <section style={{ marginBottom: 28 }}>
        <h2>{t('yedekBagi')}</h2>
        <p className="kucuk" style={{ marginTop: 6 }}>
          {t('yedekAciklama')}
        </p>
        <Link to="/yedek" className="dugme dugme-ikincil" style={{ marginTop: 8 }}>
          <IkonIndir size={18} />
          {t('yedekBaslik')}
          <IkonOk size={17} />
        </Link>
      </section>

      {/*
        Kod bu cihazda kayıtlıdır. Kaldırma seçeneği, uygulamanın ödünç verilen
        ya da devredilen bir tablette bırakılmaması için vardır; iki adımlıdır,
        çünkü kaldırıldığında kod yeniden istenir.
      */}
      {KILIT_VAR && (
        <section style={{ marginBottom: 28 }}>
          <h2>{t('kilitDurum')}</h2>
          <p className="kucuk" style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
            <IkonKilit size={16} />
            {t('kilitAcikDurum')}
          </p>
          {kaldirmaSoruldu ? (
            <div className="kart" style={{ padding: 16, marginTop: 10 }}>
              <strong>{t('kilitKaldirOnay')}</strong>
              <p className="kucuk" style={{ margin: '6px 0 12px' }}>
                {t('kilitKaldirOnayNot')}
              </p>
              <div className="satir">
                <button
                  className="dugme"
                  onClick={() => {
                    kilidiKapat();
                    onKilitKaldir();
                  }}
                >
                  {t('kilitKaldirEvet')}
                </button>
                <button className="dugme dugme-ikincil" onClick={() => setKaldirmaSoruldu(false)}>
                  {t('iptal')}
                </button>
              </div>
            </div>
          ) : (
            <button
              className="dugme-sade kucuk"
              style={{ marginTop: 4 }}
              onClick={() => setKaldirmaSoruldu(true)}
            >
              {t('kilitKaldir')}
            </button>
          )}
        </section>
      )}

      {/* Künye: kitabın üç yazarı vardır, uygulamayı yazan tektir. */}
      <Uyari baslik={t('hakkinda')} notr>
        <strong style={{ display: 'block' }}>{t('uygulamaAdi')}</strong>
        {t('kitapAlt')}
        <br />
        <span className="kucuk" style={{ display: 'inline-block', marginTop: 8 }}>
          <strong>{t('kitapEtiketi')}:</strong> {t('kitapYazarlari')}
          <br />
          <strong>{t('uygulamaEtiketi')}:</strong> {t('uygulamaYazari')}
        </span>
        <br />
        <span style={{ display: 'inline-block', marginTop: 8 }}>{t('veriUyari')}</span>
      </Uyari>

      <p className="kucuk" style={{ marginTop: 18 }}>
        <Link to="/giris">{t('girisTanitim')}</Link>
      </p>
    </div>
  );
}
