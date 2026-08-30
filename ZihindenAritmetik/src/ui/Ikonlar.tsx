/** Uygulamanın simge dili — kitabın şekil ailelerinden türetilmiş çizgi ikonlar. */

type P = { size?: number };

const ortak = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

export function IkonEv({ size = 24 }: P) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <path {...ortak} d="M3.5 10.4 12 3.8l8.5 6.6V20a1 1 0 0 1-1 1h-4.6v-6H9.1v6H4.5a1 1 0 0 1-1-1z" />
    </svg>
  );
}

/** Sayı konuşması: art arda binen dört problem. */
export function IkonDizi({ size = 24 }: P) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <path {...ortak} d="M3 20h18" />
      <path {...ortak} d="M5.5 20V14M10.5 20V10.5M15.5 20V7M20.5 20V3.5" />
    </svg>
  );
}

/** Etkinlik kartı: tek sayfalık kart. */
export function IkonEtkinlik({ size = 24 }: P) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <rect {...ortak} x="3.5" y="3.5" width="17" height="17" rx="2.6" />
      <path {...ortak} d="M7.4 9h9.2M7.4 12.6h9.2M7.4 16.2h5.6" />
    </svg>
  );
}

/** Araçlar: onluk çerçeve. */
export function IkonArac({ size = 24 }: P) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <rect {...ortak} x="2.5" y="6.5" width="19" height="11" rx="1.8" />
      <path {...ortak} d="M12 6.5v11M7.25 6.5v11M16.75 6.5v11M2.5 12h19" />
    </svg>
  );
}

export function IkonGeri({ size = 22 }: P) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <path {...ortak} d="M14.5 5.5 8 12l6.5 6.5" />
    </svg>
  );
}

export function IkonKapat({ size = 22 }: P) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <path {...ortak} d="m6 6 12 12M18 6 6 18" />
    </svg>
  );
}

export function IkonOk({ size = 20, yon = 'sag' }: P & { yon?: 'sag' | 'sol' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      aria-hidden="true"
      style={yon === 'sol' ? { transform: 'scaleX(-1)' } : undefined}
    >
      <path {...ortak} d="M4.5 12h14M13 6.5l5.5 5.5-5.5 5.5" />
    </svg>
  );
}

export function IkonKilit({ size = 20 }: P) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <rect {...ortak} x="4.5" y="10.5" width="15" height="9.5" rx="2" />
      <path {...ortak} d="M8 10.5V7.6a4 4 0 0 1 8 0v2.9" />
    </svg>
  );
}

/** Tahtaya yansıt — akıllı tahta / projeksiyon. */
export function IkonTahta({ size = 20 }: P) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <rect {...ortak} x="2.6" y="4" width="18.8" height="12.4" rx="2" />
      <path {...ortak} d="M12 16.4V20M8.6 20h6.8" />
    </svg>
  );
}

export function IkonArti({ size = 20 }: P) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <path {...ortak} d="M12 5v14M5 12h14" />
    </svg>
  );
}

/**
 * Başparmak — sayı konuşmasında hazır olduğunu gösteren işaret.
 * El kaldırmak yerine başparmağın göğse konması, henüz bulamamış çocuğun
 * üstündeki baskıyı kaldırır (Bölüm 12).
 */
export function IkonBasparmak({ size = 26 }: P) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <path
        {...ortak}
        d="M7 20.5V11.2l3.1-1.5c.8-.4 1.3-1.2 1.3-2.1V4.4a1.6 1.6 0 0 1 3.2 0v3.9h3.1a2 2 0 0 1 2 2.4l-1.2 6.2a2.6 2.6 0 0 1-2.6 2.1H7Z"
      />
      <rect {...ortak} x="2.8" y="10.8" width="4.2" height="9.7" rx="1.4" />
    </svg>
  );
}

/** Formlar — gozlem ve tarama cizelgeleri. */
export function IkonForm({ size = 24 }: P) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <path {...ortak} d="M7.4 3.6h9.2a1.8 1.8 0 0 1 1.8 1.8v13.2a1.8 1.8 0 0 1-1.8 1.8H7.4a1.8 1.8 0 0 1-1.8-1.8V5.4a1.8 1.8 0 0 1 1.8-1.8Z" />
      <path {...ortak} d="M9.2 8.6h2M9.2 12.2h2M9.2 15.8h2M13.4 8.6h1.6M13.4 12.2h1.6M13.4 15.8h1.6" />
    </svg>
  );
}

export function IkonYazdir({ size = 20 }: P) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <path {...ortak} d="M7 9V3.8h10V9" />
      <path {...ortak} d="M7 17.4H5.2A2.2 2.2 0 0 1 3 15.2v-4a2.2 2.2 0 0 1 2.2-2.2h13.6A2.2 2.2 0 0 1 21 11.2v4a2.2 2.2 0 0 1-2.2 2.2H17" />
      <rect {...ortak} x="7" y="14" width="10" height="6.2" rx="1" />
    </svg>
  );
}

/** Yedek al — dosyayi cihaza indir. */
export function IkonIndir({ size = 20 }: P) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <path {...ortak} d="M12 3.6v11.2M7.8 10.6 12 14.8l4.2-4.2" />
      <path {...ortak} d="M4.4 16.6v2.2a1.6 1.6 0 0 0 1.6 1.6h12a1.6 1.6 0 0 0 1.6-1.6v-2.2" />
    </svg>
  );
}

/** Geri yukle — dosyadan oku. */
export function IkonYukle({ size = 20 }: P) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <path {...ortak} d="M12 14.8V3.6M7.8 7.8 12 3.6l4.2 4.2" />
      <path {...ortak} d="M4.4 16.6v2.2a1.6 1.6 0 0 0 1.6 1.6h12a1.6 1.6 0 0 0 1.6-1.6v-2.2" />
    </svg>
  );
}

/** Ayarlar. */
export function IkonAyar({ size = 22 }: P) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <circle {...ortak} cx="12" cy="12" r="3.1" />
      <path
        {...ortak}
        d="M19.3 14.3a1.5 1.5 0 0 0 .3 1.65l.05.06a1.8 1.8 0 1 1-2.55 2.55l-.06-.06a1.5 1.5 0 0 0-1.65-.3 1.5 1.5 0 0 0-.91 1.37v.17a1.8 1.8 0 1 1-3.6 0v-.09a1.5 1.5 0 0 0-.98-1.37 1.5 1.5 0 0 0-1.65.3l-.06.06a1.8 1.8 0 1 1-2.55-2.55l.06-.06a1.5 1.5 0 0 0 .3-1.65 1.5 1.5 0 0 0-1.37-.91H4.4a1.8 1.8 0 1 1 0-3.6h.09a1.5 1.5 0 0 0 1.37-.98 1.5 1.5 0 0 0-.3-1.65l-.06-.06A1.8 1.8 0 1 1 8.05 5.1l.06.06a1.5 1.5 0 0 0 1.65.3h.07a1.5 1.5 0 0 0 .91-1.37V4.4a1.8 1.8 0 0 1 3.6 0v.09a1.5 1.5 0 0 0 .91 1.37 1.5 1.5 0 0 0 1.65-.3l.06-.06a1.8 1.8 0 1 1 2.55 2.55l-.06.06a1.5 1.5 0 0 0-.3 1.65v.07a1.5 1.5 0 0 0 1.37.91h.17a1.8 1.8 0 0 1 0 3.6h-.09a1.5 1.5 0 0 0-1.37.91Z"
      />
    </svg>
  );
}

export function IkonGoz({ size = 20 }: P) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <path {...ortak} d="M2.6 12S6 5.9 12 5.9 21.4 12 21.4 12 18 18.1 12 18.1 2.6 12 2.6 12Z" />
      <circle {...ortak} cx="12" cy="12" r="2.8" />
    </svg>
  );
}
