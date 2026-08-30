import { useRef, useState } from 'react';
import { useT } from '../i18n';
import { bicimle, KOD_UZUNLUK, kilidiAc, normalle } from '../lib/kilit';
import { IkonKilit, IkonOk } from '../ui/Ikonlar';

/** Art arda yanlış denemede beklenen süre (sn). Kaba kuvveti yavaşlatır. */
const BEKLEME = [0, 0, 0, 3, 5, 10, 20, 30];

/**
 * Kitap kodu ekranı.
 *
 * Tanıtım sayfası herkese açıktır; kod yalnızca uygulamanın kendisini korur.
 * Doğrulama tarayıcıda ve bilerek yavaş yapılır (PBKDF2), bu yüzden düğmeye
 * basıldığında kısa bir bekleme olur — bu gecikme kasıtlıdır.
 */
export default function Kilit({ onAcildi }: { onAcildi: () => void }) {
  const t = useT();
  const [kod, setKod] = useState('');
  const [calisiyor, setCalisiyor] = useState(false);
  const [hata, setHata] = useState(false);
  const [yanlis, setYanlis] = useState(0);
  const [kalan, setKalan] = useState(0);
  const girdiRef = useRef<HTMLInputElement>(null);

  const tamam = normalle(kod).length === KOD_UZUNLUK;

  async function dene(e: React.FormEvent) {
    e.preventDefault();
    if (!tamam || calisiyor || kalan > 0) return;
    setCalisiyor(true);
    setHata(false);
    try {
      if (await kilidiAc(kod)) {
        onAcildi();
        return;
      }
      const n = yanlis + 1;
      setYanlis(n);
      setHata(true);
      const bekle = BEKLEME[Math.min(n, BEKLEME.length - 1)];
      if (bekle > 0) {
        setKalan(bekle);
        const z = window.setInterval(() => {
          setKalan((v) => {
            if (v <= 1) {
              window.clearInterval(z);
              return 0;
            }
            return v - 1;
          });
        }, 1000);
      }
      girdiRef.current?.select();
    } finally {
      setCalisiyor(false);
    }
  }

  return (
    <div className="kilit renk-9">
      <form className="kilit-kart kart" onSubmit={dene}>
        <div className="kilit-simge" aria-hidden="true">
          <IkonKilit size={26} />
        </div>

        <h1>{t('kilitBaslik')}</h1>
        <p className="kucuk">{t('kilitAciklama')}</p>

        <label className="kilit-alan">
          <span className="kucuk">{t('kilitKod')}</span>
          <input
            ref={girdiRef}
            className="girdi kilit-girdi"
            value={kod}
            onChange={(e) => {
              setKod(bicimle(e.target.value));
              setHata(false);
            }}
            placeholder="XXXX-XXXX-XXXX"
            autoComplete="off"
            autoCapitalize="characters"
            spellCheck={false}
            inputMode="text"
            aria-invalid={hata}
            aria-describedby={hata ? 'kilit-hata' : undefined}
          />
        </label>

        {hata && (
          <p id="kilit-hata" role="alert" className="kilit-hata">
            {t('kilitHata')}
          </p>
        )}

        <button className="dugme kilit-dugme" type="submit" disabled={!tamam || calisiyor || kalan > 0}>
          {calisiyor ? t('kilitDeneniyor') : kalan > 0 ? t('kilitBekle', { sayi: kalan }) : t('kilitAc')}
          {!calisiyor && kalan === 0 && <IkonOk />}
        </button>

        <p className="kucuk kilit-not">{t('kilitNerede')}</p>
      </form>
    </div>
  );
}
