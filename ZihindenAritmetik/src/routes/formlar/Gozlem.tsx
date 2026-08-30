import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useT } from '../../i18n';
import { GOZLEM_DURUMLARI } from '../../content/tarama';
import { STRATEJILER } from '../../lib/stratejiler';
import { formBul, formKaydet, formSil, yeniGozlem, type GozlemFormu } from '../../lib/formlar';
import { FormKabugu, UstAlan } from './ortak';
import { IkonArti } from '../../ui/Ikonlar';

const DURUM_RENK = ['var(--gri-acik)', 'var(--r8)', 'var(--r4)'];

/**
 * Ek D.1 — haftalık gözlem çizelgesi.
 *
 * Kitabın kuralı: rutin biter bitmez iki dakikada doldurulur ve bütün sınıfı
 * her hafta işaretlemek gerekmez; beş-altı öğrenci dönüşümlü izlenir. Bu
 * yüzden form altı satırla açılır ve satır eklemek isteğe bağlıdır.
 *
 * Hücreye dokunmak üç durum arasında döner: henüz görülmedi → deniyor →
 * kendiliğinden kullanıyor. Puan yoktur; durum bir gelişim işaretidir.
 */
export default function Gozlem() {
  const { id } = useParams();
  const t = useT();
  const [form, setForm] = useState<GozlemFormu>(
    () => (id ? formBul<GozlemFormu>('gozlem', id) : undefined) ?? yeniGozlem(),
  );

  function guncelle(yama: Partial<GozlemFormu>) {
    setForm((f) => formKaydet({ ...f, ...yama }));
  }

  function hucreDon(satir: number, sutun: number) {
    guncelle({
      ogrenciler: form.ogrenciler.map((o, i) =>
        i === satir
          ? { ...o, isaretler: o.isaretler.map((v, k) => (k === sutun ? (v + 1) % 3 : v)) }
          : o,
      ),
    });
  }

  return (
    <FormKabugu
      baslik={t('formD1')}
      aciklama={t('formD1Aciklama')}
      onSil={id ? () => formSil('gozlem', form.id) : undefined}
      ustBilgi={
        <>
          <UstAlan etiket={t('formSinif')} deger={form.sinif} onDegis={(v) => guncelle({ sinif: v })} genislik={110} />
          <UstAlan etiket={t('formHafta')} deger={form.hafta} onDegis={(v) => guncelle({ hafta: v })} genislik={80} />
          <UstAlan etiket={t('formTarih')} deger={form.tarih} onDegis={(v) => guncelle({ tarih: v })} tip="date" genislik={155} />
        </>
      }
    >
      <datalist id="strateji-listesi">
        {STRATEJILER.map((s) => (
          <option key={s.ad} value={s.ad} />
        ))}
      </datalist>

      <div style={{ overflowX: 'auto' }}>
        <table className="form-tablo">
          <thead>
            <tr>
              <th style={{ minWidth: 150 }}>{t('formOgrenci')}</th>
              {form.stratejiler.map((s, i) => (
                <th key={i} style={{ width: 124 }}>
                  <input
                    className="form-girdi baslik-girdi"
                    list="strateji-listesi"
                    value={s}
                    placeholder={`${t('formStrateji')} ${i + 1}`}
                    onChange={(e) =>
                      guncelle({
                        stratejiler: form.stratejiler.map((x, k) => (k === i ? e.target.value : x)),
                      })
                    }
                  />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {form.ogrenciler.map((o, satir) => (
              <tr key={satir}>
                <td>
                  <input
                    className="form-girdi"
                    value={o.ad}
                    placeholder="—"
                    onChange={(e) =>
                      guncelle({
                        ogrenciler: form.ogrenciler.map((x, i) =>
                          i === satir ? { ...x, ad: e.target.value } : x,
                        ),
                      })
                    }
                  />
                </td>
                {o.isaretler.map((v, sutun) => (
                  <td key={sutun} className="ortala">
                    <button
                      className="gozlem-hucre"
                      onClick={() => hucreDon(satir, sutun)}
                      style={{ color: DURUM_RENK[v] }}
                      aria-label={GOZLEM_DURUMLARI[v].etiket}
                      title={GOZLEM_DURUMLARI[v].etiket}
                    >
                      {GOZLEM_DURUMLARI[v].isaret}
                    </button>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="satir yazdirma-disi" style={{ marginTop: 12 }}>
        <button
          className="secim"
          onClick={() =>
            guncelle({
              ogrenciler: [...form.ogrenciler, { ad: '', isaretler: [0, 0, 0, 0, 0] }],
            })
          }
        >
          <IkonArti size={16} /> {t('formSatirEkle')}
        </button>
      </div>

      <div className="sarmal form-gosterge" style={{ marginTop: 16 }}>
        {GOZLEM_DURUMLARI.map((d) => (
          <span key={d.deger} className="satir" style={{ gap: 6 }}>
            <span style={{ color: DURUM_RENK[d.deger], fontSize: '1.3rem', lineHeight: 1 }}>
              {d.isaret}
            </span>
            <span className="kucuk">{d.etiket}</span>
          </span>
        ))}
      </div>
    </FormKabugu>
  );
}
