import { useState } from 'react';
import { useT } from '../i18n';
import { Denetim, RastgeleSerit, Sayac, Tuval } from './ortak';
import { RENK } from './renk';
import { REKENREK_ARALIK, rastgele, type Aralik } from './rastgele';

/**
 * Rekenrek.
 *
 * İki sıra, her sırada beş kırmızı + beş beyaz boncuk. Beşli yapı görünür
 * olduğu için çocuk yediyi "beş ve iki" olarak okuyabilir; kitabın parça–bütün
 * ve onun tümleyenleri bölümlerinin görsel karşılığıdır.
 * Bir boncuğa dokunmak, o boncuğa kadar olanları sola çeker.
 */
export default function Rekenrek() {
  const t = useT();
  const [ust, setUst] = useState(0);
  const [alt, setAlt] = useState(0);
  const [etiket, setEtiket] = useState(true);
  /** Kart 2.4 "gizli el": boncuklar örtülür, çocuk kaç olduğunu hatırlar. */
  const [ortu, setOrtu] = useState(false);

  const R = 21; // boncuk yarıçapı
  const D = R * 2 + 6; // boncuk aralığı
  const SOL = 26;
  // Çubuk on boncuktan uzundur: aradaki boşluk, boncukların "itilmiş" olduğunu
  // görünür kılar. Boşluk olmazsa hareket okunmaz.
  const CUBUK = D * 10 + 150;
  const Y = [58, 128];

  /**
   * Profil aralığında bir toplam çeker ve iki sıraya dağıtır.
   * Ondan büyük sayılarda üst sıra dolar; beşli-onluk yapı korunur.
   */
  function yeniSayi(a: Aralik) {
    const toplamYeni = rastgele(a.enAz, a.enCok, ust + alt);
    const u = Math.min(10, toplamYeni);
    setUst(u);
    setAlt(toplamYeni - u);
  }

  function sira(itilen: number, y: number, onDegis: (v: number) => void) {
    const boncuklar = [];
    for (let i = 0; i < 10; i++) {
      const solda = i < itilen;
      const cx = solda ? SOL + R + i * D : CUBUK - 12 - R - (9 - i) * D;
      boncuklar.push(
        <circle
          key={i}
          cx={cx}
          cy={y}
          r={R}
          fill={i < 5 ? RENK.kirmizi : RENK.kagit}
          stroke={i < 5 ? RENK.kirmizi : RENK.gri}
          strokeWidth={2.5}
          style={{ cursor: 'pointer', transition: 'cx 0.18s ease' }}
          onClick={() => onDegis(itilen === i + 1 ? i : i + 1)}
        />,
      );
    }
    return (
      <g>
        <line x1={SOL} y1={y} x2={CUBUK} y2={y} stroke={RENK.griAcik} strokeWidth={5} />
        {boncuklar}
      </g>
    );
  }

  const toplam = ust + alt;

  return (
    <>
      <Tuval>
        <div style={{ display: 'grid', gap: 12, justifyItems: 'center', width: '100%' }}>
          <svg viewBox={`0 0 ${CUBUK + 26} 186`} style={{ width: '100%', maxHeight: '40vh' }}>
            <rect
              x={10}
              y={16}
              width={CUBUK + 6}
              height={154}
              rx={14}
              fill={RENK.kagit}
              stroke={RENK.lacivert}
              strokeWidth={3}
            />
            {sira(ust, Y[0], setUst)}
            {sira(alt, Y[1], setAlt)}
            {ortu && (
              <rect
                x={12}
                y={18}
                width={CUBUK + 2}
                height={150}
                rx={12}
                fill={RENK.lacivert}
                opacity={0.96}
              />
            )}
          </svg>
          {etiket && !ortu && (
            <div
              style={{
                fontSize: 'clamp(1.2rem, 3.6vw, 1.9rem)',
                fontWeight: 750,
                color: 'var(--lacivert)',
              }}
            >
              {ust} + {alt} = {toplam}
            </div>
          )}
        </div>
      </Tuval>

      <Denetim>
        <RastgeleSerit aralik={REKENREK_ARALIK} etiket={t('aracYeniSayi')} onCek={yeniSayi} />
      </Denetim>

      <Denetim>
        <Sayac etiket={t('aracUstSira')} deger={ust} enAz={0} enCok={10} onDegis={setUst} />
        <Sayac etiket={t('aracAltSira')} deger={alt} enAz={0} enCok={10} onDegis={setAlt} />
        <button className={etiket ? 'secim etkin' : 'secim'} onClick={() => setEtiket((v) => !v)}>
          {t('aracToplamiGoster')}
        </button>
        <button className={ortu ? 'secim etkin' : 'secim'} onClick={() => setOrtu((v) => !v)}>
          {ortu ? t('aracOrtuAc') : t('aracGizliEl')}
        </button>
        <button
          className="secim"
          onClick={() => {
            setUst(0);
            setAlt(0);
          }}
        >
          {t('aracTemizle')}
        </button>
      </Denetim>
    </>
  );
}
