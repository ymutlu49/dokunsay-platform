import { Link } from 'react-router-dom';
import { useT } from '../i18n';
import { ARACLAR } from '../tools/kayit';
import { EVDE_ARACLAR } from '../content/ebeveyn';
import type { Rol } from '../lib/rol';
import { SayfaBasligi } from '../ui/Parcalar';

/**
 * Araç listesi.
 *
 * Sayfa yalnızca manipülatiflere ayrılmıştır; kullanım biçimi, dil, yedekleme
 * ve künye Ayarlar sayfasındadır. Ders sırasında açılan bir listede ayar
 * bulunmaması, yanlışlıkla dokunmayı da önler.
 *
 * Ebeveyn modunda sınıfa dönük araçlar gizlenir (Bölüm 17).
 */
export default function Araclar({ rol }: { rol: Rol }) {
  const t = useT();
  const gosterilenAraclar =
    rol === 'ebeveyn' ? ARACLAR.filter((a) => EVDE_ARACLAR.includes(a.id)) : ARACLAR;

  return (
    <>
      <SayfaBasligi baslik={t('aracBaslik')} alt={t('aracAciklama')} />

      <div className="izgara">
        {gosterilenAraclar.map((a) => (
          <Link
            key={a.id}
            to={`/arac/${a.id}`}
            className={`kart kart-tikla kart-serit renk-${a.renk}`}
            style={{ padding: 16 }}
          >
            <h3 style={{ margin: 0, color: 'var(--vurgu-koyu)' }}>{t(a.ad)}</h3>
            <p className="kucuk" style={{ margin: '4px 0 10px' }}>
              {t(a.alt)}
            </p>
            <div className="sarmal">
              {a.kartlar.slice(0, 4).map((k) => (
                <span key={k} className="rozet rozet-vurgu">
                  {k}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
