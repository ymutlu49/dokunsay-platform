import { useState } from 'react';
import { useT } from '../i18n';
import { Denetim, RastgeleSerit, Tuval } from './ortak';
import { RENK } from './renk';
import { DOGRU_ARALIK, rastgele, rastgeleSec, type Aralik } from './rastgele';

interface Atlama {
  miktar: number;
}

/**
 * Boş sayı doğrusu.
 *
 * Kitapta doğrudan kanıtı bulunan tek materyaldir. Uçları çocuk yazar,
 * atlamalar yay ile gösterilir. Bu araç ölçekli bir cetvel değildir: yaylar
 * atlamanın büyüklüğüne göre değil, anlatılan adıma göre yerleşir — amaç
 * mesafeyi ölçmek değil, izlenen yolu görünür kılmak.
 */
export default function SayiDogrusu() {
  const t = useT();
  const [baslangic, setBaslangic] = useState(47);
  const [atlamalar, setAtlamalar] = useState<Atlama[]>([{ miktar: 30 }, { miktar: 8 }]);
  const [girdi, setGirdi] = useState('');

  /**
   * Yeni bir yol çeker: başlangıç sayısı ve iki atlama.
   * Birinci atlama onun katı, ikincisi birlik — kitabın "önce onluğa, sonra
   * kalanı" (atlama stratejisi) örüntüsü.
   */
  function yeniYol(a: Aralik) {
    const bas = rastgele(a.enAz, a.enCok, baslangic);
    const onluk = rastgele(1, Math.max(1, Math.floor(a.enCok / 20))) * 10;
    const birlik = rastgele(1, 9);
    const yon = rastgeleSec([1, -1] as const);
    setBaslangic(bas);
    setAtlamalar([{ miktar: onluk * yon }, { miktar: birlik * yon }]);
  }

  const duraklar = atlamalar.reduce<number[]>(
    (a, s) => [...a, a[a.length - 1] + s.miktar],
    [baslangic],
  );

  const W = 760;
  const H = 260;
  const TABAN = 190;
  const adim = atlamalar.length ? (W - 120) / atlamalar.length : W - 120;

  function ekle(ham: string) {
    const v = Number(ham.replace(',', '.'));
    if (!Number.isFinite(v) || v === 0) return;
    setAtlamalar((a) => [...a, { miktar: v }]);
    setGirdi('');
  }

  return (
    <>
      <Tuval>
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', maxHeight: '44vh' }}>
          <line x1={30} y1={TABAN} x2={W - 20} y2={TABAN} stroke={RENK.lacivert} strokeWidth={3} />
          {duraklar.map((d, i) => {
            const x = 60 + i * adim;
            return (
              <g key={i}>
                <line
                  x1={x}
                  y1={TABAN - 12}
                  x2={x}
                  y2={TABAN + 12}
                  stroke={RENK.lacivert}
                  strokeWidth={3}
                />
                <text
                  x={x}
                  y={TABAN + 38}
                  textAnchor="middle"
                  fontSize={24}
                  fontWeight="750"
                  fill={i === duraklar.length - 1 ? RENK.yesil : RENK.lacivert}
                >
                  {Number.isInteger(d) ? d : d.toFixed(2).replace(/\.?0+$/, '')}
                </text>
              </g>
            );
          })}
          {atlamalar.map((s, i) => {
            const x1 = 60 + i * adim;
            const x2 = 60 + (i + 1) * adim;
            const orta = (x1 + x2) / 2;
            const yuk = TABAN - 62 - (i % 2) * 34;
            const ileri = s.miktar > 0;
            return (
              <g key={i}>
                <path
                  d={`M ${x1} ${TABAN - 14} Q ${orta} ${yuk} ${x2} ${TABAN - 14}`}
                  fill="none"
                  stroke={ileri ? RENK.yesil : RENK.kirmizi}
                  strokeWidth={3}
                  markerEnd={ileri ? 'url(#ok-ileri)' : 'url(#ok-geri)'}
                />
                <text
                  x={orta}
                  y={yuk + 6}
                  textAnchor="middle"
                  fontSize={21}
                  fontWeight="750"
                  fill={ileri ? RENK.yesil : RENK.kirmizi}
                >
                  {ileri ? '+' : '−'}
                  {Math.abs(s.miktar)}
                </text>
              </g>
            );
          })}
          <defs>
            <marker id="ok-ileri" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto">
              <path d="M0 0 L9 4.5 L0 9 z" fill={RENK.yesil} />
            </marker>
            <marker id="ok-geri" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto">
              <path d="M0 0 L9 4.5 L0 9 z" fill={RENK.kirmizi} />
            </marker>
          </defs>
        </svg>
      </Tuval>

      <Denetim>
        <RastgeleSerit aralik={DOGRU_ARALIK} etiket={t('aracYeniYol')} onCek={yeniYol} />
      </Denetim>

      {/* Hazır atlamalar: çocuk anlatırken yazmaya vakit yoktur, dokunmak yeter. */}
      <Denetim>
        {[100, 10, 5, 1].map((v) => (
          <span key={v} className="satir" style={{ gap: 4 }}>
            <button className="secim" onClick={() => setAtlamalar((a) => [...a, { miktar: v }])}>
              +{v}
            </button>
            <button className="secim" onClick={() => setAtlamalar((a) => [...a, { miktar: -v }])}>
              −{v}
            </button>
          </span>
        ))}
      </Denetim>

      <Denetim>
        <label className="satir kucuk" style={{ gap: 6 }}>
          <span style={{ fontWeight: 650 }}>{t('aracBaslangic')}</span>
          <input
            className="girdi"
            style={{ width: 92 }}
            value={baslangic}
            inputMode="decimal"
            onChange={(e) => setBaslangic(Number(e.target.value) || 0)}
          />
        </label>
        <form
          className="satir"
          style={{ gap: 6 }}
          onSubmit={(e) => {
            e.preventDefault();
            ekle(girdi);
          }}
        >
          <input
            className="girdi"
            style={{ width: 116 }}
            value={girdi}
            onChange={(e) => setGirdi(e.target.value)}
            placeholder={`${t('aracAtlama')} +/−`}
            inputMode="text"
          />
          <button className="dugme dugme-ikincil" type="submit">
            +
          </button>
        </form>
        <button
          className="secim"
          onClick={() => setAtlamalar((a) => a.slice(0, -1))}
          disabled={atlamalar.length === 0}
        >
          {t('aracSonAtlamayiSil')}
        </button>
        <button className="secim" onClick={() => setAtlamalar([])}>
          {t('aracTemizle')}
        </button>
      </Denetim>
    </>
  );
}
