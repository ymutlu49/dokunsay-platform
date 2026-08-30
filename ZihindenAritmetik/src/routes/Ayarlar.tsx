import { Link } from 'react-router-dom';
import { useT } from '../i18n';
import type { Rol } from '../lib/rol';
import { SayfaBasligi, Uyari } from '../ui/Parcalar';
import { IkonIndir, IkonOk } from '../ui/Ikonlar';

/**
 * Ayarlar.
 *
 * Araçlar sayfası yalnızca manipülatiflere ayrılmıştır; kullanım biçimi, dil,
 * yedekleme ve künye buraya toplanmıştır. Ders sırasında açılan bir sayfada
 * ayar bulunmaması, yanlışlıkla dil ya da rol değiştirmeyi de önler.
 */
export default function Ayarlar({ rol, onRol }: { rol: Rol; onRol: (r: Rol) => void }) {
  const t = useT();

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
