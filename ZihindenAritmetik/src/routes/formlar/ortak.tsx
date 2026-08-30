import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useT } from '../../i18n';
import { IkonGeri, IkonKapat, IkonYazdir } from '../../ui/Ikonlar';

/**
 * Formların ortak kabuğu.
 *
 * Form doldurulurken ekranın tamamı forma ayrılır: öğretmen rutin biter
 * bitmez iki dakikada dolduracak, aramayacak. Yazdır düğmesi tarayıcının
 * yazdırma penceresini açar; oradan PDF olarak da kaydedilebilir.
 */
export function FormKabugu({
  baslik,
  aciklama,
  ustBilgi,
  children,
  onSil,
}: {
  baslik: string;
  aciklama: string;
  ustBilgi?: ReactNode;
  children: ReactNode;
  onSil?: () => void;
}) {
  const t = useT();
  const nav = useNavigate();

  return (
    <div className="form-sayfa renk-9">
      <div className="yazdirma-disi">
        <button className="dugme-sade satir" onClick={() => nav(-1)} style={{ marginLeft: -10 }}>
          <IkonGeri />
          {t('geri')}
        </button>
      </div>

      <header className="form-basligi">
        <h1>{baslik}</h1>
        <p className="kucuk" style={{ fontStyle: 'italic', margin: 0 }}>
          {aciklama}
        </p>
      </header>

      {ustBilgi && <div className="form-ust">{ustBilgi}</div>}

      {children}

      <div className="satir yazdirma-disi" style={{ marginTop: 26, flexWrap: 'wrap' }}>
        <button className="dugme" onClick={() => window.print()}>
          <IkonYazdir />
          {t('formYazdir')}
        </button>
        {onSil && (
          <button className="dugme-sade kucuk" onClick={onSil}>
            {t('formSil')}
          </button>
        )}
        <span className="bosluk" />
        <span className="kucuk">{t('formKaydedildi')}</span>
      </div>

      <p className="kucuk yazdirma-disi" style={{ marginTop: 14 }}>
        {t('veriUyari')}
      </p>
    </div>
  );
}

/** Form üstündeki tek satırlık alan (Sınıf, Hafta, Tarih…). */
export function UstAlan({
  etiket,
  deger,
  onDegis,
  tip = 'text',
  genislik = 150,
}: {
  etiket: string;
  deger: string;
  onDegis: (v: string) => void;
  tip?: string;
  genislik?: number;
}) {
  return (
    <label className="satir" style={{ gap: 8 }}>
      <span style={{ fontWeight: 700, color: 'var(--lacivert)', whiteSpace: 'nowrap' }}>
        {etiket}
      </span>
      <input
        className="girdi form-girdi"
        type={tip}
        value={deger}
        onChange={(e) => onDegis(e.target.value)}
        style={{ width: genislik }}
      />
    </label>
  );
}

/** Kayıtlı form listesindeki tek satır. */
export function FormSatiri({
  baslik,
  alt,
  rozet,
  onAc,
  onSil,
}: {
  baslik: string;
  alt: string;
  rozet?: string;
  onAc: () => void;
  onSil: () => void;
}) {
  const t = useT();
  return (
    <div className="kart satir" style={{ padding: 14, gap: 12 }}>
      <button className="bosluk" style={{ textAlign: 'left' }} onClick={onAc}>
        <strong style={{ color: 'var(--lacivert)' }}>{baslik}</strong>
        <div className="kucuk">{alt}</div>
      </button>
      {rozet && <span className="rozet rozet-vurgu">{rozet}</span>}
      <button className="dugme-sade" onClick={onSil} aria-label={t('sil')}>
        <IkonKapat size={18} />
      </button>
    </div>
  );
}
