import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useT } from '../i18n';
import { IkonGeri } from './Ikonlar';

/** Sayfa başlığı; alt sayfalarda geri düğmesiyle. */
export function SayfaBasligi({
  baslik,
  alt,
  geri,
  sag,
}: {
  baslik: string;
  alt?: string;
  geri?: boolean;
  sag?: ReactNode;
}) {
  const nav = useNavigate();
  const t = useT();
  return (
    <header style={{ marginBottom: 20 }}>
      {geri && (
        <button
          className="dugme-sade satir"
          onClick={() => nav(-1)}
          style={{ marginLeft: -10, marginBottom: 4 }}
        >
          <IkonGeri />
          {t('geri')}
        </button>
      )}
      <div className="satir" style={{ alignItems: 'flex-start' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h1>{baslik}</h1>
          {alt && <p className="kucuk" style={{ margin: 0, maxWidth: '58ch' }}>{alt}</p>}
        </div>
        {sag}
      </div>
    </header>
  );
}

/** Kitaptan alınmış bir kuralı ya da uyarıyı gösteren şerit. */
export function Uyari({
  baslik,
  children,
  notr,
}: {
  baslik?: string;
  children: ReactNode;
  notr?: boolean;
}) {
  return (
    <div className={notr ? 'uyari uyari-notr' : 'uyari'}>
      <div>
        {baslik && <strong>{baslik}</strong>}
        <span>{children}</span>
      </div>
    </div>
  );
}

/**
 * Etkinlik kartının bir alanı: başlık + içerik.
 * Rengini kapsayan .renk-N sınıfından alır; bölümün rengiyle uyumlu kalır.
 */
export function Alan({ baslik, children }: { baslik: string; children: ReactNode }) {
  return (
    <section style={{ marginBottom: 22 }}>
      <h3
        style={{
          fontSize: '0.76rem',
          textTransform: 'uppercase',
          letterSpacing: '0.07em',
          color: 'var(--vurgu-koyu)',
          marginBottom: 8,
        }}
      >
        {baslik}
      </h3>
      {children}
    </section>
  );
}

/** Numaralı adım listesi — yönerge ve destek basamakları için. */
export function Adimlar({ adimlar }: { adimlar: string[] }) {
  return (
    <ol className="liste-sade">
      {adimlar.map((a, i) => (
        <li key={i} className="adim">
          <span className="adim-no">{i + 1}</span>
          <span>{a}</span>
        </li>
      ))}
    </ol>
  );
}

/** Dört profil şeridi — kitaptaki sıra korunur. */
export function Profiller({ profiller }: { profiller: Record<string, string> }) {
  const sira = ['Diskalkuli', 'Düşük', 'Ortalama', 'Yüksek'];
  const anahtarlar = sira.filter((s) => s in profiller);
  const kalan = Object.keys(profiller).filter((k) => !sira.includes(k));
  return (
    <div className="profiller">
      {[...anahtarlar, ...kalan].map((ad, i) => (
        <div key={ad} className={`profil profil-${Math.min(i, 3)}`}>
          <h4>{ad}</h4>
          <div>{profiller[ad]}</div>
        </div>
      ))}
    </div>
  );
}

export function Bos({ metin }: { metin: string }) {
  return (
    <p className="kucuk ortala" style={{ padding: '40px 0' }}>
      {metin}
    </p>
  );
}
