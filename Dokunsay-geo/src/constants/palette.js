// ══════════════════════════════════════════════════════════
// Renk paleti — tüm uygulama tarafından paylaşılır.
// Kimlik rengi: TURKUAZ (#14b8a6) — launcher kartı ile aynı.
// Kategori renkleri WCAG AA kontrastı hedefler; tonlar
// hex alfa soneki (ör: P.accent + "22") ile inceltilir.
// ══════════════════════════════════════════════════════════

import { APP_ACCENTS } from '@shared/palette.js';

const accent = APP_ACCENTS.geo;

export const P = {
  bg: "#f0fdfa",
  accent: accent.color,      // #14b8a6 (turkuaz — Geo kimlik)
  accentD: accent.dark,
  accentL: accent.soft,
  accentSofter: accent.softer,
  // Kategori renkleri — 2B şekil sınıflandırması
  tri: "#f59e0b",
  triB: "#b45309",
  quad: "#3b82f6",
  quadB: "#1e40af",
  poly: "#8b5cf6",
  polyB: "#5b21b6",
  circ: "#10b981",
  circB: "#065f46",
  meas: "#ef4444",
  measB: "#991b1b",
  // Yüzeyler
  side: "#ecfeff",
  sideB: "rgba(20,184,166,.1)",
  text: "#134e4a",
  sh: "rgba(20,184,166,.08)",
  shM: "rgba(20,184,166,.18)",
  header: `linear-gradient(135deg, ${accent.dark}, ${accent.color})`,
  grid: "rgba(20,184,166,.08)",
};

// Kategori başlıkları ve renk eşlemesi — SHAPE_DEF.cat bu anahtarları referanslar.
export const CAT_META = {
  triangle: { label: "Üçgenler", labelKu: "Sêgoşe", labelEn: "Triangles", color: P.tri, colorB: P.triB },
  quadrilateral: { label: "Dörtgenler", labelKu: "Çargoşe", labelEn: "Quadrilaterals", color: P.quad, colorB: P.quadB },
  polygon: { label: "Çokgenler", labelKu: "Pirgoşe", labelEn: "Polygons", color: P.poly, colorB: P.polyB },
  circle: { label: "Daire ve Çember", labelKu: "Gilover û Gilovêr", labelEn: "Disk & Circle", color: P.circ, colorB: P.circB },
};

export const CAT_ORDER = ["triangle", "quadrilateral", "polygon", "circle"];

export { APP_ACCENTS };
