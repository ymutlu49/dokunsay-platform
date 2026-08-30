import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useT } from '../i18n';
import { bolumRengi, bolumler, kartlar, materyalGerekir } from '../content';
import { SayfaBasligi } from '../ui/Parcalar';
import type { ActivityCard } from '../lib/types';

type SureSuzgeci = 'tumu' | 'kisa' | 'uzun';
type Gorunum = 'liste' | 'bolum';

function KartKutucugu({ kart }: { kart: ActivityCard }) {
  return (
    <Link
      to={`/etkinlik/${kart.id}`}
      className={`kart kart-tikla kart-serit renk-${bolumRengi(kart.section)}`}
      style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}
    >
      <div className="sarmal">
        <span className="rozet rozet-dolu">{kart.id}</span>
        <span className="rozet rozet-notr">{kart.duration}</span>
        {materyalGerekir(kart) && <span className="rozet rozet-vurgu">{kart.material}</span>}
      </div>
      <h3 style={{ margin: 0 }}>{kart.title}</h3>
      <p
        className="kucuk"
        style={{
          margin: 0,
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
      >
        {kart.why}
      </p>
    </Link>
  );
}

export default function Etkinlikler() {
  const t = useT();
  const [bolum, setBolum] = useState<number | null>(null);
  const [sure, setSure] = useState<SureSuzgeci>('tumu');
  const [materyalsiz, setMateryalsiz] = useState(false);
  const [arama, setArama] = useState('');
  const [gorunum, setGorunum] = useState<Gorunum>('bolum');

  const suzgecVar = bolum !== null || sure !== 'tumu' || materyalsiz || arama.trim() !== '';

  const sonuc = useMemo(() => {
    const q = arama.trim().toLocaleLowerCase('tr');
    return kartlar.filter((k) => {
      if (bolum !== null && k.section !== bolum) return false;
      if (materyalsiz && materyalGerekir(k)) return false;
      if (sure !== 'tumu') {
        // 9.3 gibi süresi 'planlama' olan kart süre süzgecinin dışında kalır
        if (k.maxMinutes === null) return false;
        if (sure === 'kisa' && k.maxMinutes > 5) return false;
        if (sure === 'uzun' && k.maxMinutes <= 5) return false;
      }
      if (q) {
        const havuz = [k.title, k.bookTitle ?? '', k.why, k.material, k.criterion, ...k.ask]
          .join(' ')
          .toLocaleLowerCase('tr');
        if (!havuz.includes(q)) return false;
      }
      return true;
    });
  }, [bolum, sure, materyalsiz, arama]);

  function temizle() {
    setBolum(null);
    setSure('tumu');
    setMateryalsiz(false);
    setArama('');
  }

  return (
    <>
      <SayfaBasligi baslik={t('etkinlikBaslik')} alt={t('etkinlikAciklama')} />

      <input
        className="girdi"
        type="search"
        value={arama}
        onChange={(e) => setArama(e.target.value)}
        placeholder={t('etkinlikAramaIpucu')}
        aria-label={t('ara')}
        style={{ marginBottom: 12 }}
      />

      <div className="secim-serit" style={{ marginBottom: 8 }}>
        <button className={bolum === null ? 'secim etkin' : 'secim'} onClick={() => setBolum(null)}>
          {t('tumu')}
        </button>
        {bolumler.map((b) => (
          <button
            key={b.id}
            className={`secim renk-${bolumRengi(b.id)}${bolum === b.id ? ' etkin' : ''}`}
            onClick={() => setBolum(bolum === b.id ? null : b.id)}
            title={b.title}
          >
            {b.id}. {b.title}
          </button>
        ))}
      </div>

      <div className="secim-serit" style={{ marginBottom: 16 }}>
        {(
          [
            ['tumu', t('tumu')],
            ['kisa', t('etkinlikSureKisa')],
            ['uzun', t('etkinlikSureUzun')],
          ] as [SureSuzgeci, string][]
        ).map(([k, e]) => (
          <button key={k} className={sure === k ? 'secim etkin' : 'secim'} onClick={() => setSure(k)}>
            {e}
          </button>
        ))}
        <button
          className={materyalsiz ? 'secim etkin' : 'secim'}
          onClick={() => setMateryalsiz((v) => !v)}
        >
          {t('etkinlikMateryalsiz')}
        </button>
      </div>

      <div className="satir" style={{ marginBottom: 14, flexWrap: 'wrap' }}>
        <span className="kucuk">{t('etkinlikSonuc', { sayi: sonuc.length })}</span>
        {suzgecVar && (
          <button className="dugme-sade kucuk" onClick={temizle}>
            {t('etkinlikSuzgecTemizle')}
          </button>
        )}
        <span className="bosluk" />
        <div className="secim-serit">
          {(
            [
              ['bolum', t('etkinlikGorunumBolum')],
              ['liste', t('etkinlikGorunumListe')],
            ] as [Gorunum, string][]
          ).map(([k, e]) => (
            <button
              key={k}
              className={gorunum === k ? 'secim etkin' : 'secim'}
              onClick={() => setGorunum(k)}
            >
              {e}
            </button>
          ))}
        </div>
      </div>

      {sonuc.length === 0 ? (
        <div className="kart ortala" style={{ padding: '38px 20px' }}>
          <p className="kucuk" style={{ margin: 0 }}>
            {t('etkinlikSonucYok')}
          </p>
          <button className="dugme dugme-ikincil" style={{ marginTop: 14 }} onClick={temizle}>
            {t('etkinlikSuzgecTemizle')}
          </button>
        </div>
      ) : gorunum === 'liste' ? (
        <div className="izgara">
          {sonuc.map((k) => (
            <KartKutucugu key={k.id} kart={k} />
          ))}
        </div>
      ) : (
        bolumler.map((b) => {
          const grup = sonuc.filter((k) => k.section === b.id);
          if (grup.length === 0) return null;
          return (
            <section key={b.id} className={`renk-${bolumRengi(b.id)}`}>
              <div className="bolum-basligi">
                <span className="bolum-nokta" />
                <h2 style={{ margin: 0, flex: 1, minWidth: 0 }}>
                  {b.id}. {b.title}
                </h2>
                <span className="rozet rozet-vurgu">{grup.length}</span>
              </div>
              <div className="izgara">
                {grup.map((k) => (
                  <KartKutucugu key={k.id} kart={k} />
                ))}
              </div>
            </section>
          );
        })
      )}
    </>
  );
}
