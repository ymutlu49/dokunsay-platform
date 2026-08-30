import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useT } from '../../i18n';
import { TARAMA_MADDELERI } from '../../content/tarama';
import { formBul, formKaydet, formSil, yeniTarama, type TaramaFormu } from '../../lib/formlar';
import { FormKabugu, UstAlan } from './ortak';

/** Maddeler kitap bölümüne göre öbeklenir: sonuç doğrudan bir bölüme götürür. */
const OBEKLER = [
  { bolum: 7, ad: 'Toplama' },
  { bolum: 8, ad: 'Çıkarma' },
  { bolum: 9, ad: 'Çarpma' },
  { bolum: 10, ad: 'Bölme' },
  { bolum: 11, ad: 'Tahmin' },
];

/**
 * Ek D.3 — birleşik tarama formu.
 *
 * Bölüm 7–11'deki tarama maddelerinin tamamı; bir dönem başında ya da sonunda
 * tek oturumda uygulanabilir. Kitabın uyarısı forma gömülüdür: her maddeden
 * sonra "nasıl buldun?" sorulmadıkça tarama yarım kalır. Bu yüzden yol alanı
 * doğru kutusundan önce gelir ve daha geniştir — asıl veri oradadır.
 *
 * Süre tutulmaz. Zamanlı test kitabın 14.7'sinde açıkça eleştirilir.
 */
export default function Tarama() {
  const { id } = useParams();
  const t = useT();
  const [form, setForm] = useState<TaramaFormu>(
    () =>
      (id ? formBul<TaramaFormu>('tarama', id) : undefined) ??
      yeniTarama(TARAMA_MADDELERI.length),
  );

  function guncelle(yama: Partial<TaramaFormu>) {
    setForm((f) => formKaydet({ ...f, ...yama }));
  }

  function maddeGuncelle(i: number, yama: Partial<TaramaFormu['maddeler'][number]>) {
    guncelle({ maddeler: form.maddeler.map((m, k) => (k === i ? { ...m, ...yama } : m)) });
  }

  const yolluSayisi = form.maddeler.filter((m) => m.yol.trim()).length;

  return (
    <FormKabugu
      baslik={t('formD3')}
      aciklama={t('formD3Aciklama')}
      onSil={id ? () => formSil('tarama', form.id) : undefined}
      ustBilgi={
        <>
          <UstAlan
            etiket={t('formOgrenci')}
            deger={form.ogrenci}
            onDegis={(v) => guncelle({ ogrenci: v })}
            genislik={190}
          />
          <UstAlan
            etiket={t('formTarih')}
            deger={form.tarih}
            onDegis={(v) => guncelle({ tarih: v })}
            tip="date"
            genislik={155}
          />
          <span className="rozet rozet-vurgu yazdirma-disi">
            {t('formYolAlindi', { sayi: yolluSayisi, toplam: form.maddeler.length })}
          </span>
        </>
      }
    >
      {OBEKLER.map((obek) => {
        const maddeler = TARAMA_MADDELERI.map((m, i) => ({ m, i })).filter(
          ({ m }) => m.bolum === obek.bolum,
        );
        return (
          <section key={obek.bolum} style={{ marginBottom: 18 }}>
            <div className="bolum-basligi" style={{ margin: '18px 0 8px' }}>
              <span className="bolum-nokta" />
              <h2 style={{ margin: 0, fontSize: '1rem' }}>
                {obek.ad}
                <span className="kucuk yazdirma-disi" style={{ fontWeight: 400 }}>
                  {'  · '}
                  <Link to={`/etkinlik?bolum=${obek.bolum}`}>
                    {t('etkinlikKitapBolum', { sayi: obek.bolum })}
                  </Link>
                </span>
              </h2>
            </div>

            <table className="form-tablo tarama-tablo">
              <thead>
                <tr>
                  <th style={{ width: 128 }}>{t('formIslem')}</th>
                  <th style={{ width: 170 }}>{t('formBeklenenYol')}</th>
                  <th>{t('formSoyledigiYol')}</th>
                  <th style={{ width: 66 }}>{t('formDogru')}</th>
                </tr>
              </thead>
              <tbody>
                {maddeler.map(({ m, i }) => (
                  <tr key={i}>
                    <td className="islem-hucre">{m.islem}</td>
                    <td className="kucuk">{m.beklenen}</td>
                    <td>
                      <input
                        className="form-girdi"
                        value={form.maddeler[i].yol}
                        placeholder={t('formYolIpucu')}
                        onChange={(e) => maddeGuncelle(i, { yol: e.target.value })}
                      />
                    </td>
                    <td className="ortala">
                      <input
                        type="checkbox"
                        className="form-kutu"
                        checked={form.maddeler[i].dogru}
                        onChange={(e) => maddeGuncelle(i, { dogru: e.target.checked })}
                        aria-label={`${m.islem} ${t('formDogru')}`}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        );
      })}

      <p className="kucuk yazdirma-disi">{t('formD3Not')}</p>
    </FormKabugu>
  );
}
