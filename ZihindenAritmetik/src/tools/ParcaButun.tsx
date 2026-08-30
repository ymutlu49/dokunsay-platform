import { useState } from 'react';
import { useT } from '../i18n';
import { Denetim, RastgeleSerit, Tuval } from './ortak';
import { RENK } from './renk';
import { PARCA_ARALIK, rastgele, rastgeleSec, type Aralik } from './rastgele';

const K = { w: 150, h: 96 };
const W = 520;
const H = 300;

const dolu = (s: string) => s.trim() !== '' && Number.isFinite(Number(s));

/** Şemanın tek kutusu. Boş bırakılan kutu kesikli çerçeveyle çizilir. */
function Kutu({
  x,
  y,
  deger,
  turetilen,
  renk,
  etiket,
}: {
  x: number;
  y: number;
  deger: string;
  turetilen: string;
  renk: string;
  etiket: string;
}) {
  const gosterilen = deger.trim() !== '' ? deger : turetilen;
  const tahmin = deger.trim() === '' && turetilen !== '';
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={K.w}
        height={K.h}
        rx={16}
        fill={renk === RENK.lacivert ? RENK.zemin : RENK.zeminYesil}
        stroke={renk}
        strokeWidth={3}
        strokeDasharray={tahmin ? '8 6' : undefined}
      />
      <text
        x={x + K.w / 2}
        y={y + K.h / 2 + 15}
        textAnchor="middle"
        fontSize={44}
        fontWeight="750"
        fill={tahmin ? RENK.mavi : renk}
      >
        {gosterilen || '?'}
      </text>
      <text x={x + K.w / 2} y={y - 10} textAnchor="middle" fontSize={15} fill={RENK.gri}>
        {etiket}
      </text>
    </g>
  );
}

/**
 * Parça–bütün şeması.
 *
 * Ayrıştırma ve birleştirmenin görsel karşılığı. Üç kutudan biri boş
 * bırakılabilir: bilinmeyeni bütün yapmak toplama, parça yapmak çıkarma
 * sorusu üretir — kitabın "aynı işlem, üç soru" etkinliğinin aracı budur.
 */
export default function ParcaButun() {
  const t = useT();
  const [butun, setButun] = useState<string>('15');
  const [a, setA] = useState<string>('8');
  const [b, setB] = useState<string>('');

  /**
   * Yeni bir üçlü çeker ve bilinmeyeni rastgele bir kutuya koyar.
   * Bilinmeyenin yeri değişince aynı üçlüden toplama ya da çıkarma sorusu
   * doğar — kart 5.1'in "aynı işlem, üç soru" fikri.
   */
  function yeniUclu(ar: Aralik) {
    const toplam = rastgele(ar.enAz, ar.enCok, Number(butun));
    const parca = rastgele(1, Math.max(1, toplam - 1));
    const bos = rastgeleSec(['butun', 'a', 'b'] as const);
    setButun(bos === 'butun' ? '' : String(toplam));
    setA(bos === 'a' ? '' : String(parca));
    setB(bos === 'b' ? '' : String(toplam - parca));
  }

  /** Boş bırakılan tek kutuyu diğer ikisinden hesaplar. */
  function turet(alan: 'butun' | 'a' | 'b'): string {
    const nB = Number(butun);
    const nA = Number(a);
    const nb = Number(b);
    if (alan === 'butun' && !dolu(butun) && dolu(a) && dolu(b)) return String(nA + nb);
    if (alan === 'a' && !dolu(a) && dolu(butun) && dolu(b)) return String(nB - nb);
    if (alan === 'b' && !dolu(b) && dolu(butun) && dolu(a)) return String(nB - nA);
    return '';
  }

  return (
    <>
      <Tuval>
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', maxHeight: '44vh' }}>
          <line x1={W / 2} y1={126} x2={130} y2={186} stroke={RENK.gri} strokeWidth={3} />
          <line x1={W / 2} y1={126} x2={W - 130} y2={186} stroke={RENK.gri} strokeWidth={3} />
          <Kutu
            x={(W - K.w) / 2}
            y={28}
            deger={butun}
            turetilen={turet('butun')}
            renk={RENK.lacivert}
            etiket={t('aracButun')}
          />
          <Kutu
            x={26}
            y={186}
            deger={a}
            turetilen={turet('a')}
            renk={RENK.yesil}
            etiket={t('aracParca')}
          />
          <Kutu
            x={W - 26 - K.w}
            y={186}
            deger={b}
            turetilen={turet('b')}
            renk={RENK.yesil}
            etiket={t('aracParca')}
          />
        </svg>
      </Tuval>

      <Denetim>
        <RastgeleSerit aralik={PARCA_ARALIK} etiket={t('aracYeniUclu')} onCek={yeniUclu} />
      </Denetim>

      <Denetim>
        {(
          [
            [t('aracButun'), butun, setButun],
            [`${t('aracParca')} 1`, a, setA],
            [`${t('aracParca')} 2`, b, setB],
          ] as [string, string, (v: string) => void][]
        ).map(([etiket, deger, ayarla]) => (
          <label key={etiket} className="satir kucuk" style={{ gap: 6 }}>
            <span style={{ fontWeight: 650 }}>{etiket}</span>
            <input
              className="girdi"
              style={{ width: 84 }}
              value={deger}
              inputMode="numeric"
              onChange={(e) => ayarla(e.target.value)}
            />
          </label>
        ))}
        <button
          className="secim"
          onClick={() => {
            setButun('');
            setA('');
            setB('');
          }}
        >
          {t('aracTemizle')}
        </button>
      </Denetim>

      <p className="kucuk" style={{ marginTop: 10 }}>
        {t('aracParcaButunIpucu')}
      </p>
    </>
  );
}
