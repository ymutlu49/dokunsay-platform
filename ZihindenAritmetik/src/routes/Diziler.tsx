import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useT } from '../i18n';
import { haftalar, haftaninDizileri, hazirDiziler } from '../content';
import { kendiDiziEkle, kendiDiziSil, kendiDizileriOku } from '../lib/store';
import { SayfaBasligi, Uyari } from '../ui/Parcalar';
import { IkonArti } from '../ui/Ikonlar';
import type { NumberString } from '../lib/types';

type Sekme = 'takvim' | 'hazir' | 'kendi';

/** Dizi önizlemesi: son problem kasıtlı olarak soru işaretiyle gösterilir. */
function DiziOnizleme({ dizi }: { dizi: NumberString }) {
  const onceki = dizi.problems.slice(0, -1);
  return (
    <div style={{ fontSize: '1.02rem', fontWeight: 700, color: 'var(--lacivert)', lineHeight: 1.6 }}>
      {onceki.join('  ·  ')}
      <span style={{ color: 'var(--r5)' }}>{'  ·  '}</span>
      <span
        style={{
          background: 'var(--zemin-kirmizi)',
          color: 'var(--r5)',
          borderRadius: 6,
          padding: '1px 8px',
        }}
      >
        {dizi.problems[dizi.problems.length - 1]}
      </span>
    </div>
  );
}

function DiziKarti({ dizi, ustBilgi }: { dizi: NumberString; ustBilgi?: string }) {
  const t = useT();
  return (
    <Link
      to={`/dizi/${encodeURIComponent(dizi.id)}`}
      className="kart kart-tikla"
      style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}
    >
      <div className="sarmal">
        {ustBilgi && <span className="rozet rozet-dolu">{ustBilgi}</span>}
        <span className="rozet rozet-notr">
          {t('diziProblemSayisi', { sayi: dizi.problems.length })}
        </span>
      </div>
      <DiziOnizleme dizi={dizi} />
      <div className="kucuk">{dizi.strategy}</div>
    </Link>
  );
}

function KendiDiziFormu({ onKaydet }: { onKaydet: (d: NumberString) => void }) {
  const t = useT();
  const [strateji, setStrateji] = useState('');
  const [problemler, setProblemler] = useState(['', '', '', '']);

  const gecerli = problemler.filter((p) => p.trim()).length >= 2;

  return (
    <form
      className="kart"
      style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 12 }}
      onSubmit={(e) => {
        e.preventDefault();
        if (!gecerli) return;
        onKaydet(kendiDiziEkle(strateji || '—', problemler));
        setStrateji('');
        setProblemler(['', '', '', '']);
      }}
    >
      <input
        className="girdi"
        value={strateji}
        onChange={(e) => setStrateji(e.target.value)}
        placeholder={t('aracSayi') + ' — ' + t('diziStratejiGizli')}
        aria-label="Strateji"
      />
      {problemler.map((p, i) => (
        <input
          key={i}
          className="girdi"
          value={p}
          onChange={(e) =>
            setProblemler((v) => v.map((x, k) => (k === i ? e.target.value : x)))
          }
          placeholder={`${i + 1}. ${i === problemler.length - 1 ? t('tahtaSonProblem').toLocaleLowerCase('tr') : 'problem'}`}
          inputMode="text"
          style={
            i === problemler.length - 1
              ? { borderColor: 'var(--r5)', fontWeight: 700 }
              : undefined
          }
        />
      ))}
      <button className="dugme" type="submit" disabled={!gecerli}>
        <IkonArti /> {t('kaydet')}
      </button>
      <p className="kucuk" style={{ margin: 0 }}>
        {t('kural1Aciklama')}
      </p>
    </form>
  );
}

export default function Diziler() {
  const t = useT();
  const nav = useNavigate();
  const [sekme, setSekme] = useState<Sekme>('takvim');
  const [hafta, setHafta] = useState(haftalar[0]);
  const [kendi, setKendi] = useState<NumberString[]>(kendiDizileriOku);

  return (
    <>
      <SayfaBasligi baslik={t('diziBaslik')} alt={t('diziAciklama')} />

      <div className="secim-serit" style={{ marginBottom: 18 }}>
        {(
          [
            ['takvim', t('diziTakvim')],
            ['hazir', t('diziHazir')],
            ['kendi', t('diziKendi')],
          ] as [Sekme, string][]
        ).map(([k, e]) => (
          <button
            key={k}
            className={sekme === k ? 'secim etkin' : 'secim'}
            onClick={() => setSekme(k)}
          >
            {e}
          </button>
        ))}
      </div>

      {sekme === 'takvim' && (
        <>
          <p className="kucuk">{t('diziTakvimAlt')}</p>
          <div className="secim-serit" style={{ margin: '12px 0 18px' }}>
            {haftalar.map((h) => (
              <button
                key={h}
                className={h === hafta ? 'secim etkin' : 'secim'}
                onClick={() => setHafta(h)}
              >
                {t('bugunHaftaSec', { sayi: h })}
              </button>
            ))}
          </div>
          <div className="izgara">
            {haftaninDizileri(hafta).map((d) => (
              <DiziKarti
                key={d.id}
                dizi={d}
                ustBilgi={t('diziOturum', { sayi: d.session ?? 1 })}
              />
            ))}
          </div>
        </>
      )}

      {sekme === 'hazir' && (
        <>
          <p className="kucuk" style={{ marginBottom: 16 }}>
            {t('diziHazirAlt')}
          </p>
          <div className="izgara">
            {hazirDiziler.map((d) => (
              <DiziKarti
                key={d.id}
                dizi={d}
                ustBilgi={d.bookChapter ? `Bölüm ${d.bookChapter}` : undefined}
              />
            ))}
          </div>
        </>
      )}

      {sekme === 'kendi' && (
        <>
          <Uyari baslik={t('diziKendiAlt')} notr>
            {t('kural1')}
          </Uyari>
          <div style={{ height: 16 }} />
          <KendiDiziFormu
            onKaydet={(d) => {
              setKendi(kendiDizileriOku());
              nav(`/dizi/${encodeURIComponent(d.id)}`);
            }}
          />
          {kendi.length > 0 && (
            <>
              <hr className="ayrac" />
              <div className="izgara">
                {kendi.map((d) => (
                  <div key={d.id} style={{ position: 'relative' }}>
                    <DiziKarti dizi={d} />
                    <button
                      className="dugme-sade kucuk"
                      style={{ position: 'absolute', top: 8, right: 8 }}
                      onClick={() => {
                        kendiDiziSil(d.id);
                        setKendi(kendiDizileriOku());
                      }}
                    >
                      {t('sifirla')}
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </>
  );
}
