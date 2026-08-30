import { useState } from 'react';
import { useT } from '../i18n';
import { Denetim, RastgeleSerit, Sayac, Secenekler, Tuval } from './ortak';
import { RENK } from './renk';
import { CERCEVE_ARALIK, rastgele, type Aralik } from './rastgele';

/**
 * Onluk çerçeve.
 *
 * Çerçevenin asıl işi kitapta şöyle anlatılır: doluyu gören çocuk boşu
 * saymadan bilir. Bu yüzden araç, dolu ve boş kutuların ikisini de aynı
 * anda okunur kılar ve örtü düğmesiyle "kaçı gizli?" sorusunu destekler.
 *
 * Beş çıpası satırlar arasındadır: üst sıra dolduğunda beş olur. Kalın
 * yatay çizgi bunu görünür kılar; çocuk yediyi "beş ve iki" olarak okur.
 */
export default function OnlukCerceve() {
  const t = useT();
  const [cerceve, setCerceve] = useState(1); // 1 = onluk, 2 = çift onluk
  const [dolu, setDolu] = useState(7);
  const [ortu, setOrtu] = useState(false);

  const kapasite = cerceve * 10;
  const H = 74; // hücre kenarı
  const W = 5 * H;
  const yukseklik = cerceve * 2 * H + (cerceve - 1) * 18;

  /** Profil aralığında yeni bir sayı; on'u aşarsa çerçeve kendiliğinden ikilenir. */
  function yeniSayi(a: Aralik) {
    const v = rastgele(a.enAz, a.enCok, dolu);
    const gereken = v > 10 ? 2 : cerceve;
    setCerceve(gereken);
    setDolu(Math.min(v, gereken * 10));
    setOrtu(false);
  }

  const hucreler = [];
  for (let c = 0; c < cerceve; c++) {
    const ustY = c * (2 * H + 18);
    for (let r = 0; r < 2; r++) {
      for (let k = 0; k < 5; k++) {
        const n = c * 10 + r * 5 + k;
        const x = k * H;
        const y = ustY + r * H;
        hucreler.push(
          <g key={n} onClick={() => setDolu(n < dolu ? n : n + 1)} style={{ cursor: 'pointer' }}>
            <rect
              x={x}
              y={y}
              width={H}
              height={H}
              fill={RENK.kagit}
              stroke={RENK.lacivert}
              strokeWidth={2}
            />
            {n < dolu && (
              <circle
                cx={x + H / 2}
                cy={y + H / 2}
                r={H * 0.31}
                fill={r === 0 ? RENK.lacivert : RENK.mavi}
              />
            )}
          </g>,
        );
      }
    }
    // Beş çıpası satırlar arasındadır: üst sıra dolduğunda beş olur.
    hucreler.push(
      <line
        key={`b${c}`}
        x1={0}
        y1={ustY + H}
        x2={W}
        y2={ustY + H}
        stroke={RENK.lacivert}
        strokeWidth={5}
      />,
    );
  }

  return (
    <>
      <Tuval>
        <svg viewBox={`-4 -4 ${W + 8} ${yukseklik + 8}`} style={{ maxHeight: '48vh' }}>
          {hucreler}
          {ortu && (
            <rect
              x={-2}
              y={-2}
              width={W + 4}
              height={yukseklik + 4}
              fill={RENK.lacivert}
              opacity={0.95}
              rx={8}
            />
          )}
        </svg>
      </Tuval>

      <Denetim>
        <RastgeleSerit aralik={CERCEVE_ARALIK} etiket={t('aracYeniSayi')} onCek={yeniSayi} />
      </Denetim>

      <Denetim>
        <Sayac etiket={t('aracDolu')} deger={dolu} enAz={0} enCok={kapasite} onDegis={setDolu} />
        <span className="rozet rozet-vurgu">
          {t('aracBos')}: {kapasite - dolu}
        </span>
        <Secenekler
          etiket={t('aracCerceve')}
          secili={cerceve}
          secenekler={[
            { deger: 1, etiket: '10' },
            { deger: 2, etiket: '20' },
          ]}
          onSec={(v) => {
            setCerceve(v);
            setDolu((d) => Math.min(d, v * 10));
          }}
        />
        <button className={ortu ? 'secim etkin' : 'secim'} onClick={() => setOrtu((v) => !v)}>
          {ortu ? t('aracOrtuAc') : t('aracOrtu')}
        </button>
        <button className="secim" onClick={() => setDolu(0)}>
          {t('aracTemizle')}
        </button>
      </Denetim>
    </>
  );
}
