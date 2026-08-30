// ══════════════════════════════════════════════════════════════
// Geometri tahtası yardımcıları — SAF fonksiyonlar (React'a bağımlı değil).
//
// 2026-07-19 DENETİMİ — iki kusur kapatıldı:
//  1) ÇİFT KOPYA: bu modül zaten vardı ama App.jsx içinde birebir aynı üç
//     fonksiyonun ikinci bir kopyası duruyordu ve App yalnız kendi
//     kopyasını kullanıyordu — yani bu dosya ÖLÜ KODDU ve iki kopya
//     birbirinden bağımsız sapabilirdi. App'teki kopya silindi (§2.5).
//  2) ŞEKİL ADLARI 3 DİLDİ: `lang==="ku"?…:lang==="en"?…:tr` üçlü
//     ternary'si ar/fa'da sessizce Türkçeye düşüyordu. Ad tablosu artık
//     beş dili de taşır ve tablo üzerinden okunur.
//
// Alan için Shoelace formülü kullanılır (Pick teoremi yerine): ortaokul
// 5-6. sınıf düzeyine pedagojik olarak daha uygundur.
// ══════════════════════════════════════════════════════════════

// Shoelace: A = |Σ (x_i · y_{i+1} − x_{i+1} · y_i)| / 2  (birim²)
export function geoShoelaceArea(pts) {
  if (!pts || pts.length < 3) return 0;
  let a = 0;
  for (let i = 0; i < pts.length; i++) {
    const j = (i + 1) % pts.length;
    a += pts[i].c * pts[j].r - pts[j].c * pts[i].r;
  }
  return Math.abs(a) / 2;
}

// Çevre — Öklid mesafelerinin toplamı (birim).
export function geoPerimeter(pts) {
  if (!pts || pts.length < 2) return 0;
  let p = 0;
  for (let i = 0; i < pts.length; i++) {
    const j = (i + 1) % pts.length;
    p += Math.hypot(pts[j].c - pts[i].c, pts[j].r - pts[i].r);
  }
  return p;
}

// ── Beş dilli ad tablosu ─────────────────────────────────────
const POLY_NAMES = {
  tr: { 3: "Üçgen", 4: "Dörtgen", 5: "Beşgen", 6: "Altıgen", 7: "Yedigen", 8: "Sekizgen" },
  ku: { 3: "Sêgoşe", 4: "Çargoşe", 5: "Pêncgoşe", 6: "Şeşgoşe", 7: "Heftgoşe", 8: "Heştgoşe" },
  en: { 3: "Triangle", 4: "Quadrilateral", 5: "Pentagon", 6: "Hexagon", 7: "Heptagon", 8: "Octagon" },
  ar: { 3: "مثلث", 4: "رباعي", 5: "خماسي", 6: "سداسي", 7: "سباعي", 8: "ثماني" },
  fa: { 3: "مثلث", 4: "چهارضلعی", 5: "پنج‌ضلعی", 6: "شش‌ضلعی", 7: "هفت‌ضلعی", 8: "هشت‌ضلعی" },
};
const POLY_SUFFIX = { tr: "gen", ku: "goşe", en: "gon", ar: "أضلاع", fa: "ضلعی" };
const SPECIAL = {
  square:      { tr: "Kare", ku: "Çaryalî", en: "Square", ar: "مربّع", fa: "مربع" },
  rectangle:   { tr: "Dikdörtgen", ku: "Çarhêla Rast", en: "Rectangle", ar: "مستطيل", fa: "مستطیل" },
  rhombus:     { tr: "Eşkenar Dörtgen", ku: "Lozeng", en: "Rhombus", ar: "معيّن", fa: "لوزی" },
  equilateral: { tr: "Eşkenar Üçgen", ku: "Sêgoşeya Hêvkêlek", en: "Equilateral Triangle", ar: "مثلث متساوي الأضلاع", fa: "مثلث متساوی‌الاضلاع" },
  isosceles:   { tr: "İkizkenar Üçgen", ku: "Sêgoşeya Duhêvkêlek", en: "Isosceles Triangle", ar: "مثلث متساوي الساقين", fa: "مثلث متساوی‌الساقین" },
};
const nameOf = (key, lang) => SPECIAL[key][lang] || SPECIAL[key].tr;

// Şekil tanıma — kenar sayısı + kenar eşitliği + dik açı sezgisi.
export function geoShapeName(pts, lang = "tr") {
  const n = pts ? pts.length : 0;
  if (n < 3) return null;
  const nm = POLY_NAMES[lang] || POLY_NAMES.tr;
  const suffix = POLY_SUFFIX[lang] || POLY_SUFFIX.tr;
  let base = nm[n] || `${n}-${suffix}`;

  const sideLen = (i, m) => {
    const j = (i + 1) % m;
    return Math.hypot(pts[j].c - pts[i].c, pts[j].r - pts[i].r);
  };

  if (n === 4) {
    const sides = [0, 1, 2, 3].map(i => sideLen(i, 4));
    const allEqual = sides.every(s => Math.abs(s - sides[0]) < 0.001);
    let allRight = true;
    for (let i = 0; i < 4; i++) {
      const a = { c: pts[(i + 1) % 4].c - pts[i].c, r: pts[(i + 1) % 4].r - pts[i].r };
      const b = { c: pts[(i + 2) % 4].c - pts[(i + 1) % 4].c, r: pts[(i + 2) % 4].r - pts[(i + 1) % 4].r };
      if (Math.abs(a.c * b.c + a.r * b.r) > 0.001) allRight = false;
    }
    if (allEqual && allRight) base = nameOf("square", lang);
    else if (allRight) base = nameOf("rectangle", lang);
    else if (allEqual) base = nameOf("rhombus", lang);
  }

  if (n === 3) {
    const s = [0, 1, 2].map(i => sideLen(i, 3));
    const eq01 = Math.abs(s[0] - s[1]) < 0.001;
    const eq12 = Math.abs(s[1] - s[2]) < 0.001;
    const eq02 = Math.abs(s[0] - s[2]) < 0.001;
    if (eq01 && eq12) base = nameOf("equilateral", lang);
    else if (eq01 || eq12 || eq02) base = nameOf("isosceles", lang);
  }
  return base;
}
