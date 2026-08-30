import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useT } from '../../i18n';
import { STRATEJILER } from '../../lib/stratejiler';
import { kendiDiziEkle, kendiDiziSil, kendiDizileriOku } from '../../lib/store';
import { FormKabugu, FormSatiri } from './ortak';
import { IkonArti, IkonOk } from '../../ui/Ikonlar';
import type { NumberString } from '../../lib/types';

const BOS = ['', '', '', ''];

/**
 * Ek D.4 — sayı dizisi planlama formu.
 *
 * Kâğıt formda plan yazılır ve orada kalır. Burada plan doğrudan çalıştırılır:
 * kaydedilen dizi Sayı Konuşması sekmesinde görünür ve tahtaya alınabilir.
 * Formun tek kuralı korunur — dördüncü problem öğrenciye bırakılır; bu yüzden
 * dördüncü satır ayrı renkte durur ve tahtada kilitli açılır.
 */
export default function DiziPlani() {
  const t = useT();
  const nav = useNavigate();
  const [strateji, setStrateji] = useState('');
  const [problemler, setProblemler] = useState<string[]>(BOS);
  const [kayitli, setKayitli] = useState<NumberString[]>(kendiDizileriOku);

  const dolu = problemler.filter((p) => p.trim()).length;
  const gecerli = dolu >= 2;

  function kaydet(vecalistir: boolean) {
    if (!gecerli) return;
    const dizi = kendiDiziEkle(strateji || '—', problemler);
    setKayitli(kendiDizileriOku());
    setStrateji('');
    setProblemler(BOS);
    if (vecalistir) nav(`/dizi/${encodeURIComponent(dizi.id)}`);
  }

  return (
    <FormKabugu baslik={t('formD4')} aciklama={t('formD4Aciklama')}>
      <datalist id="strateji-listesi-d4">
        {STRATEJILER.map((s) => (
          <option key={s.ad} value={s.ad} />
        ))}
      </datalist>

      <div className="kart dizi-plani">
        <label className="satir" style={{ gap: 10, marginBottom: 14 }}>
          <span style={{ fontWeight: 700, color: 'var(--lacivert)', whiteSpace: 'nowrap' }}>
            {t('formHedefStrateji')}
          </span>
          <input
            className="girdi form-girdi"
            list="strateji-listesi-d4"
            value={strateji}
            onChange={(e) => setStrateji(e.target.value)}
            placeholder={t('formHedefStratejiIpucu')}
          />
        </label>

        {problemler.map((p, i) => {
          const sonuncu = i === problemler.length - 1;
          return (
            <div key={i} className="satir" style={{ gap: 10, marginBottom: 10 }}>
              <span className={sonuncu ? 'adim-no sonuncu' : 'adim-no'}>{i + 1}</span>
              <input
                className="girdi form-girdi"
                value={p}
                inputMode="text"
                placeholder={sonuncu ? t('formSonProblem') : t('formProblem', { no: i + 1 })}
                onChange={(e) =>
                  setProblemler((v) => v.map((x, k) => (k === i ? e.target.value : x)))
                }
                style={sonuncu ? { borderColor: 'var(--r4)', fontWeight: 700 } : undefined}
              />
            </div>
          );
        })}

        <p className="kucuk" style={{ margin: '4px 0 14px' }}>
          {t('kural1Aciklama')}
        </p>

        <div className="satir yazdirma-disi" style={{ flexWrap: 'wrap' }}>
          <button className="dugme" onClick={() => kaydet(true)} disabled={!gecerli}>
            {t('formCalistir')}
            <IkonOk />
          </button>
          <button className="dugme dugme-ikincil" onClick={() => kaydet(false)} disabled={!gecerli}>
            <IkonArti size={17} />
            {t('formSadeceKaydet')}
          </button>
        </div>
      </div>

      {kayitli.length > 0 && (
        <section style={{ marginTop: 24 }}>
          <h2 style={{ fontSize: '1rem' }}>{t('formKayitliDiziler')}</h2>
          <div style={{ display: 'grid', gap: 10, marginTop: 12 }}>
            {kayitli.map((d) => (
              <FormSatiri
                key={d.id}
                baslik={d.problems.join('  ·  ')}
                alt={d.strategy}
                rozet={t('diziProblemSayisi', { sayi: d.problems.length })}
                onAc={() => nav(`/dizi/${encodeURIComponent(d.id)}`)}
                onSil={() => {
                  kendiDiziSil(d.id);
                  setKayitli(kendiDizileriOku());
                }}
              />
            ))}
          </div>
        </section>
      )}
    </FormKabugu>
  );
}
