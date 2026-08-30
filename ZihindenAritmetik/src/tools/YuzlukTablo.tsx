import { useState } from 'react';
import { useT } from '../i18n';
import { Denetim, RastgeleSerit, Secenekler, Tuval } from './ortak';
import { RENK } from './renk';
import { YUZLUK_ARALIK, rastgele, rastgeleSec, type Aralik } from './rastgele';

const ADIMLAR = [2, 5, 9, 10, 11] as const;
/** Kart 3.2'nin komutları: yüzlük tabloda hareket. */
const KOMUTLAR = [10, -10, 1, -1, 20, -20] as const;

/**
 * Yüzlük tablo.
 *
 * İki ayrı iş görür:
 *  · Örüntü: bir adım seçilir, katları boyanır — dokuzlar ve onar onar ilerleme.
 *  · Hareket (kart 3.2): bir imleç konur, +10 / −1 gibi komutlarla gezdirilir.
 *    Zincir altta yazılır; çocuk nereye vardığını tablosuz da söyleyebilmelidir.
 *
 * Sayılar gizlenebilir: boş tabloda hareket etmek, örüntünün ezberden değil
 * yapıdan okunduğunu gösterir.
 */
export default function YuzlukTablo() {
  const t = useT();
  const [secili, setSecili] = useState<number[]>([]);
  const [adim, setAdim] = useState(0);
  const [baslangic, setBaslangic] = useState(1);
  const [imlec, setImlec] = useState<number | null>(null);
  const [zincir, setZincir] = useState<number[]>([]);
  const [sayiGizli, setSayiGizli] = useState(false);

  function yeniOruntu(a: Aralik) {
    const bas = rastgele(a.enAz, Math.min(a.enCok, 40), baslangic);
    setBaslangic(bas);
    setAdim(rastgeleSec(ADIMLAR, adim as (typeof ADIMLAR)[number]));
    setSecili([]);
    setImlec(null);
    setZincir([]);
  }

  function komut(v: number) {
    if (imlec === null) return;
    const hedef = imlec + v;
    if (hedef < 1 || hedef > 100) return;
    setImlec(hedef);
    setZincir((z) => [...z, v]);
  }

  const atlamalar = new Set<number>();
  if (adim > 0) {
    for (let n = baslangic; n <= 100; n += adim) atlamalar.add(n);
  }

  const H = 52;
  const W = 10 * H;

  function tikla(n: number) {
    // İmleç kullanımdaysa dokunmak imleci taşır; değilse hücreyi işaretler.
    if (imlec !== null) {
      setImlec(n);
      setZincir([]);
      return;
    }
    setSecili((s) => (s.includes(n) ? s.filter((x) => x !== n) : [...s, n]));
  }

  const hucreler = [];
  for (let n = 1; n <= 100; n++) {
    const i = n - 1;
    const x = (i % 10) * H;
    const y = Math.floor(i / 10) * H;
    const atlama = atlamalar.has(n);
    const isaretli = secili.includes(n);
    const imlecte = imlec === n;
    hucreler.push(
      <g key={n} onClick={() => tikla(n)} style={{ cursor: 'pointer' }}>
        <rect
          x={x}
          y={y}
          width={H}
          height={H}
          fill={
            imlecte ? RENK.amber : isaretli ? RENK.lacivert : atlama ? RENK.zeminYesil : RENK.kagit
          }
          stroke={RENK.griAcik}
          strokeWidth={1.2}
        />
        {(!sayiGizli || imlecte || isaretli) && (
          <text
            x={x + H / 2}
            y={y + H / 2 + 7}
            textAnchor="middle"
            fontSize={20}
            fontWeight={atlama || isaretli || imlecte ? 750 : 500}
            fill={imlecte ? '#fff' : isaretli ? RENK.kagit : atlama ? RENK.yesil : RENK.gri}
          >
            {n}
          </text>
        )}
      </g>,
    );
  }

  const baslangicImlec = imlec !== null ? imlec - zincir.reduce((a, b) => a + b, 0) : null;

  return (
    <>
      <Tuval>
        <div style={{ display: 'grid', gap: 10, justifyItems: 'center', width: '100%' }}>
          <svg viewBox={`-2 -2 ${W + 4} ${W + 4}`} style={{ width: '100%', maxHeight: '52vh' }}>
            {hucreler}
          </svg>
          {zincir.length > 0 && baslangicImlec !== null && (
            <div
              style={{
                fontSize: 'clamp(1rem, 3vw, 1.5rem)',
                fontWeight: 750,
                color: 'var(--lacivert)',
                textAlign: 'center',
              }}
            >
              {baslangicImlec}
              {zincir.map((v, k) => (
                <span key={k} style={{ color: v > 0 ? RENK.yesil : RENK.kirmizi }}>
                  {' '}
                  {v > 0 ? '+' : '−'}
                  {Math.abs(v)}
                </span>
              ))}{' '}
              = {imlec}
            </div>
          )}
        </div>
      </Tuval>

      <Denetim>
        <RastgeleSerit aralik={YUZLUK_ARALIK} etiket={t('aracYeniOruntu')} onCek={yeniOruntu} />
      </Denetim>

      {/* --- hareket: kart 3.2 */}
      <Denetim>
        <button
          className={imlec !== null ? 'secim etkin' : 'secim'}
          onClick={() => {
            setImlec(imlec === null ? baslangic : null);
            setZincir([]);
          }}
        >
          {t('aracImlec')}
        </button>
        {imlec !== null &&
          KOMUTLAR.map((v) => (
            <button key={v} className="secim" onClick={() => komut(v)}>
              {v > 0 ? '+' : '−'}
              {Math.abs(v)}
            </button>
          ))}
        {imlec !== null && zincir.length > 0 && (
          <button className="secim" onClick={() => setZincir([])}>
            {t('aracZinciriSifirla')}
          </button>
        )}
      </Denetim>

      <Denetim>
        <Secenekler
          etiket={t('aracAtlama')}
          secili={adim}
          secenekler={[
            { deger: 0, etiket: '—' },
            ...ADIMLAR.map((a) => ({ deger: a as number, etiket: String(a) })),
          ]}
          onSec={setAdim}
        />
        <label className="satir kucuk" style={{ gap: 6 }}>
          <span style={{ fontWeight: 650 }}>{t('aracBaslangic')}</span>
          <input
            className="girdi"
            style={{ width: 80 }}
            value={baslangic}
            inputMode="numeric"
            onChange={(e) => setBaslangic(Math.min(100, Math.max(1, Number(e.target.value) || 1)))}
          />
        </label>
        <button
          className={sayiGizli ? 'secim etkin' : 'secim'}
          onClick={() => setSayiGizli((v) => !v)}
        >
          {t('aracSayilariGizle')}
        </button>
        <button
          className="secim"
          onClick={() => {
            setSecili([]);
            setZincir([]);
          }}
        >
          {t('aracTemizle')}
        </button>
      </Denetim>
    </>
  );
}
