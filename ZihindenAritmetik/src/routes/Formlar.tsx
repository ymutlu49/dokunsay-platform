import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useT, type Sozluk } from '../i18n';
import { formSil, formlariOku, doluluk, type Form, type FormTuru } from '../lib/formlar';
import { kendiDizileriOku } from '../lib/store';
import { SayfaBasligi, Uyari } from '../ui/Parcalar';
import { FormSatiri } from './formlar/ortak';
import { IkonArti, IkonIndir } from '../ui/Ikonlar';

interface FormTanimi {
  tur: FormTuru;
  yol: string;
  ad: keyof Sozluk;
  alt: keyof Sozluk;
  renk: number;
  /** Kaydedilebilir mi? D.4 kendi dizilerini sayı konuşması deposunda tutar. */
  listeli: boolean;
}

const FORMLAR: FormTanimi[] = [
  { tur: 'gozlem', yol: 'gozlem', ad: 'formD1', alt: 'formD1Alt', renk: 3, listeli: true },
  { tur: 'profil', yol: 'profil', ad: 'formD2', alt: 'formD2Alt', renk: 1, listeli: true },
  { tur: 'tarama', yol: 'tarama', ad: 'formD3', alt: 'formD3Alt', renk: 5, listeli: true },
  { tur: 'dizi', yol: 'dizi', ad: 'formD4', alt: 'formD4Alt', renk: 4, listeli: false },
];

function ozet(form: Form): { baslik: string; alt: string } {
  const tarih = new Date(form.guncellendi).toLocaleDateString('tr-TR');
  if (form.tur === 'gozlem') {
    return {
      baslik: [form.sinif, form.hafta && `hafta ${form.hafta}`].filter(Boolean).join(' · ') || '—',
      alt: `${form.tarih || tarih} · ${doluluk(form)} öğrenci`,
    };
  }
  if (form.tur === 'profil') {
    return {
      baslik: form.ogrenci || '—',
      alt: `${form.sinifDonem || tarih} · ${doluluk(form)}/6 alan`,
    };
  }
  return {
    baslik: form.ogrenci || '—',
    alt: `${form.tarih || tarih} · ${doluluk(form)}/${form.maddeler.length} madde`,
  };
}

export default function Formlar() {
  const t = useT();
  const nav = useNavigate();
  const [tazele, setTazele] = useState(0);
  const diziSayisi = kendiDizileriOku().length;

  return (
    <>
      <SayfaBasligi baslik={t('formBaslik')} alt={t('formAciklama')} />

      <Uyari baslik={t('formNeIcin')}>{t('formNeIcinAciklama')}</Uyari>

      <div style={{ display: 'grid', gap: 22, marginTop: 22 }}>
        {FORMLAR.map((f) => {
          const kayitlar = f.listeli ? formlariOku(f.tur) : [];
          const sayi = f.listeli ? kayitlar.length : diziSayisi;
          return (
            <section key={f.tur} className={`renk-${f.renk}`}>
              <div className="kart kart-serit" style={{ padding: 16 }}>
                <div className="satir" style={{ alignItems: 'flex-start', flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: 180 }}>
                    <h2 style={{ margin: 0, fontSize: '1.06rem', color: 'var(--vurgu-koyu)' }}>
                      {t(f.ad)}
                    </h2>
                    <p className="kucuk" style={{ margin: '3px 0 0' }}>
                      {t(f.alt)}
                    </p>
                  </div>
                  {sayi > 0 && <span className="rozet rozet-vurgu">{sayi}</span>}
                  <Link to={`/form/${f.yol}`} className="dugme">
                    <IkonArti size={17} />
                    {f.listeli ? t('formYeni') : t('formAc')}
                  </Link>
                </div>

                {kayitlar.length > 0 && (
                  <div style={{ display: 'grid', gap: 8, marginTop: 14 }}>
                    {kayitlar.map((k) => {
                      const o = ozet(k);
                      return (
                        <FormSatiri
                          key={k.id}
                          baslik={o.baslik}
                          alt={o.alt}
                          onAc={() => nav(`/form/${f.yol}/${k.id}`)}
                          onSil={() => {
                            formSil(f.tur, k.id);
                            setTazele((v) => v + 1);
                          }}
                        />
                      );
                    })}
                  </div>
                )}
                <span hidden>{tazele}</span>
              </div>
            </section>
          );
        })}
      </div>

      <div className="kart satir" style={{ padding: 16, marginTop: 22, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 210 }}>
          <strong style={{ color: 'var(--lacivert)' }}>{t('yedekBagi')}</strong>
          <p className="kucuk" style={{ margin: '2px 0 0' }}>
            {t('veriUyari')}
          </p>
        </div>
        <Link to="/yedek" className="dugme dugme-ikincil">
          <IkonIndir size={18} />
          {t('yedekAl')}
        </Link>
      </div>
    </>
  );
}
