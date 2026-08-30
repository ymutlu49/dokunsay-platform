import { useState } from 'react';
import { useT } from '../i18n';
import { Denetim, RastgeleSerit, Sayac, Tuval } from './ortak';
import { RENK } from './renk';
import { BASAMAK_ARALIK, rastgele, type Aralik } from './rastgele';

/**
 * Basamak değeri blokları.
 *
 * Yüzlük kare, onluk çubuk, birlik küp. Sayının basamaklarına ayrılışı
 * hem blok olarak hem de "300 + 40 + 7" biçiminde yazılır; parçalama
 * stratejisinin dayandığı temsil budur.
 */
export default function BasamakBloklari() {
  const t = useT();
  const [yuz, setYuz] = useState(3);
  const [on, setOn] = useState(4);
  const [bir, setBir] = useState(7);

  function yeniSayi(a: Aralik) {
    const simdiki = yuz * 100 + on * 10 + bir;
    const v = rastgele(a.enAz, a.enCok, simdiki);
    setYuz(Math.floor(v / 100));
    setOn(Math.floor((v % 100) / 10));
    setBir(v % 10);
  }

  const B = 11; // birim kenarı
  const A = 5; // gruplar arası boşluk
  const YUZ_K = B * 10;
  const ON_G = B;
  const ON_Y = B * 10;

  function kafes(x: number, y: number, sutun: number, satirSayisi: number, renk: string) {
    const p = [];
    for (let r = 0; r < satirSayisi; r++)
      for (let c = 0; c < sutun; c++)
        p.push(
          <rect
            key={`${r}-${c}`}
            x={x + c * B}
            y={y + r * B}
            width={B - 1}
            height={B - 1}
            fill={renk}
            opacity={0.9}
          />,
        );
    return p;
  }

  const parcalar = [];
  let ofsetX = 0;

  for (let i = 0; i < yuz; i++) {
    parcalar.push(
      <g key={`y${i}`}>
        {kafes(ofsetX, 0, 10, 10, RENK.lacivert)}
        <rect
          x={ofsetX}
          y={0}
          width={YUZ_K - 1}
          height={YUZ_K - 1}
          fill="none"
          stroke={RENK.lacivert}
          strokeWidth={2}
        />
      </g>,
    );
    ofsetX += YUZ_K + A;
  }

  if (yuz > 0 && on > 0) ofsetX += A * 2;

  for (let i = 0; i < on; i++) {
    parcalar.push(
      <g key={`o${i}`}>
        {kafes(ofsetX, 0, 1, 10, RENK.yesil)}
        <rect
          x={ofsetX}
          y={0}
          width={ON_G - 1}
          height={ON_Y - 1}
          fill="none"
          stroke={RENK.yesil}
          strokeWidth={2}
        />
      </g>,
    );
    ofsetX += ON_G + A;
  }

  if (on > 0 && bir > 0) ofsetX += A * 2;

  for (let i = 0; i < bir; i++) {
    const c = i % 5;
    const r = Math.floor(i / 5);
    parcalar.push(
      <rect
        key={`b${i}`}
        x={ofsetX + c * (B + 2)}
        y={r * (B + 2)}
        width={B}
        height={B}
        fill={RENK.kirmizi}
        stroke={RENK.kirmizi}
        strokeWidth={1.5}
      />,
    );
  }
  ofsetX += Math.min(bir, 5) * (B + 2);

  const toplam = yuz * 100 + on * 10 + bir;
  const genislik = Math.max(ofsetX + 10, 160);

  return (
    <>
      <Tuval>
        <div style={{ display: 'grid', gap: 14, justifyItems: 'center', width: '100%' }}>
          <svg
            viewBox={`-4 -4 ${genislik} ${YUZ_K + 8}`}
            style={{ maxHeight: '36vh', maxWidth: '100%' }}
          >
            {parcalar}
          </svg>
          <div
            style={{
              fontSize: 'clamp(1.3rem, 4vw, 2.2rem)',
              fontWeight: 750,
              color: 'var(--lacivert)',
              textAlign: 'center',
            }}
          >
            {toplam}
            <span style={{ color: 'var(--gri)', fontWeight: 650, fontSize: '0.62em' }}>
              {'  =  '}
              <span style={{ color: RENK.lacivert }}>{yuz * 100}</span>
              {' + '}
              <span style={{ color: RENK.yesil }}>{on * 10}</span>
              {' + '}
              <span style={{ color: RENK.kirmizi }}>{bir}</span>
            </span>
          </div>
        </div>
      </Tuval>

      <Denetim>
        <RastgeleSerit aralik={BASAMAK_ARALIK} etiket={t('aracYeniSayi')} onCek={yeniSayi} />
      </Denetim>

      <Denetim>
        <Sayac etiket={t('aracYuzlukSayisi')} deger={yuz} enAz={0} enCok={9} onDegis={setYuz} />
        <Sayac etiket={t('aracOnlukSayisi')} deger={on} enAz={0} enCok={9} onDegis={setOn} />
        <Sayac etiket={t('aracBirlikSayisi')} deger={bir} enAz={0} enCok={9} onDegis={setBir} />
        <button
          className="secim"
          onClick={() => {
            setYuz(0);
            setOn(0);
            setBir(0);
          }}
        >
          {t('aracTemizle')}
        </button>
      </Denetim>
    </>
  );
}
