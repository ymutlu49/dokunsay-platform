import { useState, type ReactNode } from 'react';
import { PROFILLER, type Aralik, type Profil, type ProfilAraliklari } from './rastgele';

/** Manipülatiflerin ortak kabuğu: tuval üstte, denetimler altta. */
export function Tuval({ children }: { children: ReactNode }) {
  return <div className="arac-tuval">{children}</div>;
}

export function Denetim({ children }: { children: ReactNode }) {
  return <div className="arac-denetim">{children}</div>;
}

/** Sayı arttır/azalt denetimi. */
export function Sayac({
  etiket,
  deger,
  enAz = 0,
  enCok = 20,
  onDegis,
}: {
  etiket: string;
  deger: number;
  enAz?: number;
  enCok?: number;
  onDegis: (v: number) => void;
}) {
  return (
    <div className="satir" style={{ gap: 6 }}>
      <span className="kucuk" style={{ fontWeight: 650 }}>
        {etiket}
      </span>
      <button
        className="secim"
        onClick={() => onDegis(Math.max(enAz, deger - 1))}
        aria-label={`${etiket} azalt`}
        disabled={deger <= enAz}
      >
        −
      </button>
      <span
        style={{
          minWidth: 40,
          textAlign: 'center',
          fontWeight: 750,
          color: 'var(--lacivert)',
          fontSize: '1.08rem',
        }}
      >
        {deger}
      </span>
      <button
        className="secim"
        onClick={() => onDegis(Math.min(enCok, deger + 1))}
        aria-label={`${etiket} artır`}
        disabled={deger >= enCok}
      >
        +
      </button>
    </div>
  );
}

/** Seçenek şeridi. */
export function Secenekler<T extends string | number>({
  etiket,
  secili,
  secenekler,
  onSec,
}: {
  etiket?: string;
  secili: T;
  secenekler: { deger: T; etiket: string }[];
  onSec: (v: T) => void;
}) {
  return (
    <div className="satir" style={{ gap: 6, flexWrap: 'wrap' }}>
      {etiket && (
        <span className="kucuk" style={{ fontWeight: 650 }}>
          {etiket}
        </span>
      )}
      {secenekler.map((s) => (
        <button
          key={String(s.deger)}
          className={s.deger === secili ? 'secim etkin' : 'secim'}
          onClick={() => onSec(s.deger)}
        >
          {s.etiket}
        </button>
      ))}
    </div>
  );
}

function Zar() {
  return (
    <svg viewBox="0 0 24 24" width="19" height="19" aria-hidden="true">
      <rect
        x="3.4"
        y="3.4"
        width="17.2"
        height="17.2"
        rx="4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <circle cx="8.4" cy="8.4" r="1.7" fill="currentColor" />
      <circle cx="15.6" cy="15.6" r="1.7" fill="currentColor" />
      <circle cx="12" cy="12" r="1.7" fill="currentColor" />
    </svg>
  );
}

/**
 * Profil seçici + rastgele çekme şeridi.
 *
 * Dört profil kitabın farklılaştırma matrisinden gelir; seçilen profil
 * rastgele sayının aralığını belirler. Böylece "rastgele" keyfî değil,
 * sınıftaki çocuğa göre ayarlanmış olur.
 */
export function RastgeleSerit({
  aralik,
  etiket = 'Yeni sayı',
  onCek,
  profil,
  onProfil,
}: {
  aralik: ProfilAraliklari;
  etiket?: string;
  onCek: (a: Aralik) => void;
  profil?: Profil;
  onProfil?: (p: Profil) => void;
}) {
  const [ic, setIc] = useState<Profil>('Ortalama');
  const secili = profil ?? ic;
  const a = aralik[secili];

  function sec(p: Profil) {
    if (onProfil) onProfil(p);
    else setIc(p);
  }

  return (
    <div style={{ width: '100%' }}>
      <div className="satir" style={{ gap: 8, flexWrap: 'wrap' }}>
        <button className="dugme" onClick={() => onCek(a)}>
          <Zar />
          {etiket}
        </button>
        <div className="secim-serit" style={{ flex: 1, minWidth: 200 }}>
          {PROFILLER.map((p, i) => (
            <button
              key={p}
              className={p === secili ? 'secim etkin' : 'secim'}
              onClick={() => sec(p)}
              title={aralik[p].not}
              style={p === secili ? { background: `var(--r${[1, 5, 3, 4][i]})`, borderColor: `var(--r${[1, 5, 3, 4][i]})` } : undefined}
            >
              {p}
            </button>
          ))}
        </div>
      </div>
      <p className="kucuk" style={{ margin: '8px 0 0' }}>
        <strong style={{ color: 'var(--lacivert)' }}>
          {a.enAz === a.enCok ? a.enAz : `${a.enAz}–${a.enCok}`}
        </strong>
        {a.not ? ` · ${a.not}` : ''}
      </p>
    </div>
  );
}
