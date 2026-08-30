import { useCallback, useEffect, useRef, useState } from 'react';
import { useT } from '../i18n';
import { Denetim, RastgeleSerit, Sayac, Secenekler, Tuval } from './ortak';
import { RENK, karistir } from './renk';
import { NOKTA_ARALIK, rastgele, rastgeleSec, type Aralik } from './rastgele';

type Duzen = 'zar' | 'ikili' | 'rastgele';

/** Zar düzeninin klasik nokta yerleşimleri (1–6), 3×3 ızgara koordinatı. */
const ZAR: Record<number, [number, number][]> = {
  1: [[1, 1]],
  2: [[0, 0], [2, 2]],
  3: [[0, 0], [1, 1], [2, 2]],
  4: [[0, 0], [2, 0], [0, 2], [2, 2]],
  5: [[0, 0], [2, 0], [1, 1], [0, 2], [2, 2]],
  6: [[0, 0], [2, 0], [0, 1], [2, 1], [0, 2], [2, 2]],
};

const DUZENLER: Duzen[] = ['zar', 'ikili', 'rastgele'];

/**
 * Nokta kartı — "şipşak kart".
 *
 * Kitabın 1.1 numaralı etkinliği: kart bir saniye gösterilip kapatılır.
 * Süre kritiktir; uzun tutmak saymaya izin verir ve etkinliğin amacını
 * ortadan kaldırır. Bu yüzden gösterim süresi bir denetim değil, aracın
 * çekirdeğidir.
 *
 * "Yeni kart" düğmesi hem sayıyı hem düzeni seçili profilin aralığında
 * rastgele çeker ve kartı hemen gösterip kapatır — öğretmenin sınıfa dönük
 * kalması için tek dokunuş yeter. Kart 1.2'nin amacı gereği düzen de değişir:
 * aynı sayı farklı düzende farklı zorluktadır.
 */
export default function NoktaKart() {
  const t = useT();
  const [sayi, setSayi] = useState(6);
  const [duzen, setDuzen] = useState<Duzen>('zar');
  const [sure, setSure] = useState(1);
  const [gorunur, setGorunur] = useState(true);
  const [splat, setSplat] = useState(0);
  const [tohum, setTohum] = useState(7);
  const [duzenDegissin, setDuzenDegissin] = useState(true);
  /** Kart 1.1'in uzatması: "kaç tane daha olsaydı on olurdu?" */
  const [tumleyen, setTumleyen] = useState(false);
  const zamanlayici = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(zamanlayici.current), []);

  const simsek = useCallback(() => {
    window.clearTimeout(zamanlayici.current);
    setGorunur(true);
    zamanlayici.current = window.setTimeout(() => setGorunur(false), sure * 1000);
  }, [sure]);

  /** Profil aralığında yeni bir kart çeker ve hemen gösterir. */
  function yeniKart(a: Aralik) {
    const yeniSayi = rastgele(a.enAz, a.enCok, sayi);
    setSayi(yeniSayi);
    setSplat(0);
    setTohum((v) => v + 1);
    if (duzenDegissin) setDuzen(rastgeleSec(DUZENLER, duzen));
    simsek();
  }

  const G = 300;
  const noktalar: [number, number][] = [];
  let yaricap = 22;
  let genislik = G;

  if (duzen === 'zar' && sayi <= 6) {
    ZAR[sayi].forEach(([gx, gy]) => noktalar.push([48 + gx * 102, 48 + gy * 102]));
  } else if (duzen === 'zar') {
    // Altıdan büyük sayılar iki zar yüzü olarak: tanıdık parçalara ayrılır.
    //
    // Kart bu düzende yataya geçer. Nedeni yalnızca yer değil, gruplamadır:
    // zarın altı yüzü yalnızca dış sütunları kullandığı için yüz içindeki
    // gerçek boşluk adımın iki katıdır (88). Yüzler arasındaki boşluk bunun
    // altında kalırsa göz iki yüzü tek küme olarak okur ve kartın "tanıdık
    // parçalara ayırma" amacı ortadan kalkar. Burada oran 204 / 88 ≈ 2,3'tür.
    const a = Math.min(6, sayi - 1);
    const b = Math.min(6, sayi - a);
    genislik = 460;
    yaricap = 20;
    const adim = 44;
    ZAR[a].forEach(([gx, gy]) => noktalar.push([40 + gx * adim, 106 + gy * adim]));
    (ZAR[b] ?? ZAR[1]).forEach(([gx, gy]) => noktalar.push([332 + gx * adim, 106 + gy * adim]));
  } else if (duzen === 'ikili') {
    for (let n = 0; n < sayi; n++) {
      const satir = n % 2;
      const sutun = Math.floor(n / 2);
      noktalar.push([44 + sutun * 62, 112 + satir * 78]);
    }
  } else {
    const kafes: [number, number][] = [];
    for (let y = 0; y < 5; y++) for (let x = 0; x < 5; x++) kafes.push([36 + x * 57, 36 + y * 57]);
    karistir(kafes, tohum)
      .slice(0, sayi)
      .forEach((p) => noktalar.push(p));
  }

  if (duzen === 'ikili') genislik = Math.max(G, 44 + Math.ceil(sayi / 2) * 62);

  return (
    <>
      <Tuval>
        <svg
          viewBox={`0 0 ${genislik} ${G}`}
          style={{ maxHeight: '50vh', width: '100%' }}
          role="img"
          aria-label={gorunur ? `${sayi} nokta` : 'kart kapalı'}
        >
          <rect
            x={2}
            y={2}
            width={genislik - 4}
            height={G - 4}
            rx={16}
            fill={RENK.kagit}
            stroke={RENK.griAcik}
            strokeWidth={2}
          />
          {gorunur &&
            noktalar.map(([x, y], k) => (
              <circle key={k} cx={x} cy={y} r={yaricap} fill={RENK.lacivert} />
            ))}
          {/* örtü: kart 1.6'nın "kaçı gizli?" sorusu */}
          {gorunur &&
            noktalar
              .slice(0, splat)
              .map(([x, y], k) => (
                <circle key={`o${k}`} cx={x} cy={y} r={yaricap + 7} fill={RENK.mor} />
              ))}
          {/* Ona tümleyen: eksik olanlar altta kesikli halka olarak durur. */}
          {gorunur && tumleyen && sayi < 10 && (
            <g>
              {Array.from({ length: 10 - sayi }, (_, k) => (
                <circle
                  key={`tk${k}`}
                  cx={genislik / 2 + (k - (9 - sayi) / 2) * 30}
                  cy={G - 30}
                  r={11}
                  fill="none"
                  stroke={RENK.griAcik}
                  strokeWidth={3}
                  strokeDasharray="4 4"
                />
              ))}
            </g>
          )}
          {!gorunur && (
            <text
              x={genislik / 2}
              y={G / 2 + 16}
              textAnchor="middle"
              fontSize={52}
              fill={RENK.griAcik}
              fontWeight="750"
            >
              ?
            </text>
          )}
        </svg>
      </Tuval>

      <Denetim>
        <RastgeleSerit
          aralik={NOKTA_ARALIK}
          etiket={t('aracYeniKart')}
          onCek={yeniKart}
        />
      </Denetim>

      <Denetim>
        <button className="dugme dugme-ikincil" onClick={simsek}>
          {t('aracGoster')} · {t('aracSaniye', { sayi: sure })}
        </button>
        <Secenekler
          etiket={t('aracSure')}
          secili={sure}
          secenekler={[
            { deger: 1, etiket: '1 sn' },
            { deger: 2, etiket: '2 sn' },
            { deger: 3, etiket: '3 sn' },
          ]}
          onSec={setSure}
        />
        <Sayac
          etiket={t('aracSayi')}
          deger={sayi}
          enAz={1}
          enCok={12}
          onDegis={(v) => {
            setSayi(v);
            setSplat((s) => Math.min(s, v));
          }}
        />
      </Denetim>

      <Denetim>
        <Secenekler
          etiket={t('aracDuzen')}
          secili={duzen}
          secenekler={[
            { deger: 'zar' as Duzen, etiket: t('aracDuzenZar') },
            { deger: 'ikili' as Duzen, etiket: t('aracDuzenCift') },
            { deger: 'rastgele' as Duzen, etiket: t('aracDuzenRastgele') },
          ]}
          onSec={setDuzen}
        />
        <button
          className={duzenDegissin ? 'secim etkin' : 'secim'}
          onClick={() => setDuzenDegissin((v) => !v)}
          title={t('aracDuzenDegissinIpucu')}
        >
          {t('aracDuzenDegissin')}
        </button>
        <Sayac etiket={t('aracOrtu')} deger={splat} enAz={0} enCok={sayi} onDegis={setSplat} />
        <button
          className={tumleyen ? 'secim etkin' : 'secim'}
          onClick={() => setTumleyen((v) => !v)}
          title={t('aracTumleyenIpucu')}
        >
          {t('aracTumleyen')}
        </button>
        {duzen === 'rastgele' && (
          <button className="secim" onClick={() => setTohum((v) => v + 1)}>
            {t('aracYeniDuzen')}
          </button>
        )}
      </Denetim>
    </>
  );
}
