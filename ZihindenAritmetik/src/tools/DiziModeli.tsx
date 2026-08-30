import { useState } from 'react';
import { useT } from '../i18n';
import { Denetim, RastgeleSerit, Sayac, Tuval } from './ortak';
import { RENK } from './renk';
import { DIZI_ARALIK, rastgele, type Aralik } from './rastgele';

/**
 * Dizi / alan modeli.
 *
 * "Kaç satır, her satırda kaç" sorusunun aracı. Diziyi bölmek kısmi
 * çarpımları görünür kılar: 7×6, 5×6 ile 2×6'nın toplamı olarak okunur —
 * bildiğinden bilinmeyene türetmenin görsel karşılığı.
 */
export default function DiziModeli() {
  const t = useT();
  const [satir, setSatir] = useState(7);
  const [sutun, setSutun] = useState(6);
  const [bolme, setBolme] = useState(5);
  const [bol, setBol] = useState(true);

  /**
   * Yeni çarpım. Bölme çizgisi beşe yaslanır: kitabın türetme mantığında
   * bilinen çarpım beştir, kalan ondan türetilir.
   */
  function yeniCarpim(a: Aralik) {
    const s = rastgele(a.enAz, a.enCok, satir);
    const k = rastgele(a.enAz, a.enCok);
    setSatir(s);
    setSutun(k);
    setBolme(s > 5 ? 5 : Math.max(1, s - 1));
  }

  const N = 34;
  const BOSLUK = 16;
  const bolundu = bol && bolme > 0 && bolme < satir;
  const W = sutun * N;
  const H = satir * N + (bolundu ? BOSLUK : 0);

  const noktalar = [];
  for (let r = 0; r < satir; r++) {
    for (let c = 0; c < sutun; c++) {
      const kaydir = bolundu && r >= bolme ? BOSLUK : 0;
      noktalar.push(
        <circle
          key={`${r}-${c}`}
          cx={c * N + N / 2}
          cy={r * N + N / 2 + kaydir}
          r={N * 0.33}
          fill={kaydir ? RENK.yesil : RENK.lacivert}
        />,
      );
    }
  }

  return (
    <>
      <Tuval>
        <div style={{ display: 'grid', gap: 12, justifyItems: 'center' }}>
          <svg
            viewBox={`-6 -6 ${W + 12} ${H + 12}`}
            style={{ maxHeight: '42vh', maxWidth: '100%' }}
          >
            {noktalar}
          </svg>
          <div
            style={{
              fontSize: 'clamp(1rem, 3.2vw, 1.6rem)',
              fontWeight: 750,
              color: 'var(--lacivert)',
              textAlign: 'center',
            }}
          >
            {bolundu ? (
              <>
                {satir} × {sutun} ={' '}
                <span style={{ color: RENK.lacivert }}>
                  {bolme} × {sutun}
                </span>{' '}
                +{' '}
                <span style={{ color: RENK.yesil }}>
                  {satir - bolme} × {sutun}
                </span>{' '}
                = {bolme * sutun} + {(satir - bolme) * sutun} = {satir * sutun}
              </>
            ) : (
              <>
                {satir} × {sutun} = {satir * sutun}
              </>
            )}
          </div>
        </div>
      </Tuval>

      <Denetim>
        <RastgeleSerit aralik={DIZI_ARALIK} etiket={t('aracYeniCarpim')} onCek={yeniCarpim} />
      </Denetim>

      <Denetim>
        <Sayac
          etiket={t('aracSatir')}
          deger={satir}
          enAz={1}
          enCok={12}
          onDegis={(v) => {
            setSatir(v);
            setBolme((b) => Math.min(b, Math.max(0, v - 1)));
          }}
        />
        <Sayac etiket={t('aracSutun')} deger={sutun} enAz={1} enCok={12} onDegis={setSutun} />
        <button className={bol ? 'secim etkin' : 'secim'} onClick={() => setBol((v) => !v)}>
          {t('aracDiziyiBol')}
        </button>
        {bol && (
          <Sayac
            etiket={t('aracBolmeYeri')}
            deger={bolme}
            enAz={0}
            enCok={Math.max(0, satir - 1)}
            onDegis={setBolme}
          />
        )}
      </Denetim>
    </>
  );
}
