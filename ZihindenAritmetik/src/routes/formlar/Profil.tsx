import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useT } from '../../i18n';
import { PROFIL_ALANLARI } from '../../content/tarama';
import { formBul, formKaydet, formSil, yeniProfil, type ProfilFormu } from '../../lib/formlar';
import { FormKabugu, UstAlan } from './ortak';

/**
 * Ek D.2 — öğrenci profili kartı.
 *
 * Dönemde iki kez doldurulur ve veli görüşmesinde notun yerine kullanılır.
 * "Not yazmayınız" uyarısı kitaptandır: kart bir puanın kılığa girmiş hâli
 * değildir. Son satır — "evde ne yapılabilir?" — kitapta en önemlisi olarak
 * işaretlidir; formda da öyle durur.
 */
export default function Profil() {
  const { id } = useParams();
  const t = useT();
  const [form, setForm] = useState<ProfilFormu>(
    () => (id ? formBul<ProfilFormu>('profil', id) : undefined) ?? yeniProfil(),
  );

  function guncelle(yama: Partial<ProfilFormu>) {
    setForm((f) => formKaydet({ ...f, ...yama }));
  }

  return (
    <FormKabugu
      baslik={t('formD2')}
      aciklama={t('formD2Aciklama')}
      onSil={id ? () => formSil('profil', form.id) : undefined}
      ustBilgi={
        <>
          <UstAlan
            etiket={t('formOgrenci')}
            deger={form.ogrenci}
            onDegis={(v) => guncelle({ ogrenci: v })}
            genislik={190}
          />
          <UstAlan
            etiket={t('formSinifDonem')}
            deger={form.sinifDonem}
            onDegis={(v) => guncelle({ sinifDonem: v })}
            genislik={150}
          />
        </>
      }
    >
      <div className="profil-kart">
        {PROFIL_ALANLARI.map((alan) => (
          <div
            key={alan.anahtar}
            className={'onemli' in alan && alan.onemli ? 'profil-satir onemli' : 'profil-satir'}
          >
            <div className="profil-etiket">
              <strong>{alan.etiket}</strong>
              <span className="kucuk yazdirma-disi">{alan.ipucu}</span>
            </div>
            <textarea
              className="form-girdi profil-alan"
              rows={2}
              value={form.alanlar[alan.anahtar] ?? ''}
              onChange={(e) =>
                guncelle({ alanlar: { ...form.alanlar, [alan.anahtar]: e.target.value } })
              }
            />
          </div>
        ))}
      </div>

      <p className="kucuk yazdirma-disi" style={{ marginTop: 14 }}>
        {t('formD2Not')}
      </p>
    </FormKabugu>
  );
}
