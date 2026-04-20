// ══════════════════════════════════════════════════════════════
// Geoboard geometri yardımcıları — saf fonksiyonlar.
// Pick teoremi yerine Shoelace formülü kullanılır (pedagojik olarak
// ortaokul 5-6. sınıf seviyesine daha uygun).
// ══════════════════════════════════════════════════════════════

// Shoelace: A = |Σ (x_i * y_{i+1} - x_{i+1} * y_i)| / 2  (birim²)
export function geoShoelaceArea(pts) {
  if (pts.length < 3) return 0;
  let a = 0;
  for (let i = 0; i < pts.length; i++) {
    const j = (i + 1) % pts.length;
    a += pts[i].c * pts[j].r - pts[j].c * pts[i].r;
  }
  return Math.abs(a) / 2;
}

// Çevre — Öklid mesafelerinin toplamı (birim).
export function geoPerimeter(pts) {
  if (pts.length < 2) return 0;
  let p = 0;
  for (let i = 0; i < pts.length; i++) {
    const j = (i + 1) % pts.length;
    p += Math.hypot(pts[j].c - pts[i].c, pts[j].r - pts[i].r);
  }
  return p;
}

// Şekil tanıma — kenar sayısı + kenar eşitliği + dik açı sezgisi.
// lang parametresi lokalize isim verir (tr/ku/en).
export function geoShapeName(pts, lang = "tr") {
  const n = pts.length;
  if (n < 3) return null;
  const names = {
    tr: { 3: "Üçgen", 4: "Dörtgen", 5: "Beşgen", 6: "Altıgen", 7: "Yedigen", 8: "Sekizgen" },
    ku: { 3: "Sêgoşe", 4: "Çargoşe", 5: "Pêncgoşe", 6: "Şeşgoşe", 7: "Heftgoşe", 8: "Heştgoşe" },
    en: { 3: "Triangle", 4: "Quadrilateral", 5: "Pentagon", 6: "Hexagon", 7: "Heptagon", 8: "Octagon" },
  };
  const nm = names[lang] || names.tr;
  const suffix = lang === "ku" ? "goşe" : lang === "en" ? "gon" : "gen";
  let base = nm[n] || `${n}-${suffix}`;

  if (n === 4) {
    const sides = [];
    for (let i = 0; i < 4; i++) {
      const j = (i + 1) % 4;
      sides.push(Math.hypot(pts[j].c - pts[i].c, pts[j].r - pts[i].r));
    }
    const allEqual = sides.every(s => Math.abs(s - sides[0]) < 0.001);
    let allRight = true;
    for (let i = 0; i < 4; i++) {
      const a = { c: pts[(i + 1) % 4].c - pts[i].c, r: pts[(i + 1) % 4].r - pts[i].r };
      const b = { c: pts[(i + 2) % 4].c - pts[(i + 1) % 4].c, r: pts[(i + 2) % 4].r - pts[(i + 1) % 4].r };
      if (Math.abs(a.c * b.c + a.r * b.r) > 0.001) allRight = false;
    }
    if (allEqual && allRight) base = lang === "ku" ? "Çaryalî" : lang === "en" ? "Square" : "Kare";
    else if (allRight) base = lang === "ku" ? "Çarhêla Rast" : lang === "en" ? "Rectangle" : "Dikdörtgen";
    else if (allEqual) base = lang === "ku" ? "Lozeng" : lang === "en" ? "Rhombus" : "Eşkenar Dörtgen";
  }

  if (n === 3) {
    const sides = [];
    for (let i = 0; i < 3; i++) {
      const j = (i + 1) % 3;
      sides.push(Math.hypot(pts[j].c - pts[i].c, pts[j].r - pts[i].r));
    }
    const eq01 = Math.abs(sides[0] - sides[1]) < 0.001;
    const eq12 = Math.abs(sides[1] - sides[2]) < 0.001;
    const eq02 = Math.abs(sides[0] - sides[2]) < 0.001;
    if (eq01 && eq12) base = lang === "ku" ? "Sêgoşeya Hêvkêlek" : lang === "en" ? "Equilateral Triangle" : "Eşkenar Üçgen";
    else if (eq01 || eq12 || eq02) base = lang === "ku" ? "Sêgoşeya Duhêvkêlek" : lang === "en" ? "Isosceles Triangle" : "İkizkenar Üçgen";
  }
  return base;
}
