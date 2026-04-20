// ══════════════════════════════════════════════════════════
// 2B ŞEKİL TANIMLARI (SHAPE_DEF)
// Her şekil kategori, ikon, kenar/açı sayıları, alan/çevre
// formülleri ve köşe hesaplayıcısı sağlar. OOP sarmalayıcılar
// (src/lib/shapes/*) bu kayıt üzerinden polimorfik arayüz sunar.
// ══════════════════════════════════════════════════════════

export const SHAPE_DEF = {
  eq_tri: {
    cat: "triangle", label: "Eşkenar Üçgen", labelKu: "Sêgoşeya Wekhev", labelEn: "Equilateral Triangle",
    icon: "△", sides: 3, angles: [60, 60, 60], parallel: 0, rightAngles: 0, isRegular: true,
    verts: (cx, cy, s) => { const h = s * Math.sqrt(3) / 2; return [[cx, cy - h * 0.67], [cx - s / 2, cy + h * 0.33], [cx + s / 2, cy + h * 0.33]]; },
    area: s => 0.43 * s * s,
    perim: s => 3 * s,
    anglePos: (cx, cy, s) => [
      { x: cx, y: cy - s * 0.67 * Math.sqrt(3) / 2 - 10, a: 60 },
      { x: cx - s / 2 - 14, y: cy + s * Math.sqrt(3) / 2 * 0.33, a: 60 },
      { x: cx + s / 2 + 8, y: cy + s * Math.sqrt(3) / 2 * 0.33, a: 60 },
    ],
  },
  iso_tri: {
    cat: "triangle", label: "İkizkenar Üçgen", labelKu: "Sêgoşeya Dukenar", labelEn: "Isosceles Triangle",
    icon: "△", sides: 3, angles: [70, 70, 40], parallel: 0, rightAngles: 0, isRegular: false,
    verts: (cx, cy, s) => [[cx, cy - s * 0.6], [cx - s * 0.46, cy + s * 0.38], [cx + s * 0.46, cy + s * 0.38]],
    area: s => 0.28 * s * s,
    perim: s => 2.62 * s,
    anglePos: (cx, cy, s) => [
      { x: cx, y: cy - s * 0.6 - 12, a: 40 },
      { x: cx - s * 0.46 - 14, y: cy + s * 0.38, a: 70 },
      { x: cx + s * 0.46 + 8, y: cy + s * 0.38, a: 70 },
    ],
  },
  right_tri: {
    cat: "triangle", label: "Dik Üçgen", labelKu: "Sêgoşeya Rastê", labelEn: "Right Triangle",
    icon: "⊿", sides: 3, angles: [90, 45, 45], parallel: 0, rightAngles: 1, isRegular: false,
    verts: (cx, cy, s) => [[cx - s * 0.45, cy - s * 0.45], [cx - s * 0.45, cy + s * 0.45], [cx + s * 0.45, cy + s * 0.45]],
    area: s => 0.405 * s * s,
    perim: s => s * (2 + Math.SQRT2) * 0.9,
    anglePos: (cx, cy, s) => [
      { x: cx - s * 0.45 - 14, y: cy - s * 0.45, a: 45 },
      { x: cx - s * 0.45 - 14, y: cy + s * 0.45 + 12, a: 90 },
      { x: cx + s * 0.45 + 8, y: cy + s * 0.45 + 12, a: 45 },
    ],
  },
  scalene_tri: {
    cat: "triangle", label: "Çeşitkenar Üçgen", labelKu: "Sêgoşeya Cihêkînar", labelEn: "Scalene Triangle",
    icon: "△", sides: 3, angles: [50, 70, 60], parallel: 0, rightAngles: 0, isRegular: false,
    verts: (cx, cy, s) => [[cx - s * 0.28, cy - s * 0.5], [cx - s * 0.48, cy + s * 0.42], [cx + s * 0.46, cy + s * 0.32]],
    area: s => 0.31 * s * s,
    perim: s => 2.75 * s,
    anglePos: (cx, cy, s) => [
      { x: cx - s * 0.28, y: cy - s * 0.5 - 12, a: 50 },
      { x: cx - s * 0.48 - 14, y: cy + s * 0.42, a: 70 },
      { x: cx + s * 0.46 + 8, y: cy + s * 0.32, a: 60 },
    ],
  },
  square: {
    cat: "quadrilateral", label: "Kare", labelKu: "Çaryalî", labelEn: "Square",
    icon: "■", sides: 4, angles: [90, 90, 90, 90], parallel: 2, rightAngles: 4, isRegular: true,
    verts: (cx, cy, s) => { const h = s * 0.48; return [[cx - h, cy - h], [cx + h, cy - h], [cx + h, cy + h], [cx - h, cy + h]]; },
    area: s => (0.96 * s) ** 2,
    perim: s => 4 * 0.96 * s,
    anglePos: () => [],
  },
  rectangle: {
    cat: "quadrilateral", label: "Dikdörtgen", labelKu: "Çarhêla Rast", labelEn: "Rectangle",
    icon: "▬", sides: 4, angles: [90, 90, 90, 90], parallel: 2, rightAngles: 4, isRegular: false,
    resizable: "rect",
    verts: (cx, cy, s, ax, ay) => { const w = s * 0.65 * (ax || 1), h = s * 0.38 * (ay || 1); return [[cx - w, cy - h], [cx + w, cy - h], [cx + w, cy + h], [cx - w, cy + h]]; },
    area: (s, ax, ay) => 2 * s * 0.65 * (ax || 1) * 2 * s * 0.38 * (ay || 1),
    perim: (s, ax, ay) => 2 * (2 * s * 0.65 * (ax || 1) + 2 * s * 0.38 * (ay || 1)),
    anglePos: () => [],
  },
  rhombus: {
    cat: "quadrilateral", label: "Eşkenar Dörtgen", labelKu: "Lozeng", labelEn: "Rhombus",
    icon: "◆", sides: 4, angles: [60, 120, 60, 120], parallel: 2, rightAngles: 0, isRegular: false,
    resizable: "rhombus",
    verts: (cx, cy, s, ax, ay) => { const w = s * 0.45 * (ax || 1), h = s * 0.55 * (ay || 1); return [[cx, cy - h], [cx + w, cy], [cx, cy + h], [cx - w, cy]]; },
    area: (s, ax, ay) => s * 0.45 * (ax || 1) * s * 0.55 * (ay || 1) * 2,
    perim: (s, ax, ay) => { const w = s * 0.45 * (ax || 1), h = s * 0.55 * (ay || 1); return 4 * Math.hypot(w, h); },
    anglePos: (cx, cy, s, ax, ay) => { const w = s * 0.45 * (ax || 1), h = s * 0.55 * (ay || 1); return [{ x: cx, y: cy - h - 12, a: "?" }, { x: cx + w + 10, y: cy, a: "?" }, { x: cx, y: cy + h + 12, a: "?" }, { x: cx - w - 16, y: cy, a: "?" }]; },
  },
  parallelogram: {
    cat: "quadrilateral", label: "Paralelkenar", labelKu: "Paralelograma", labelEn: "Parallelogram",
    icon: "▱", sides: 4, angles: [60, 120, 60, 120], parallel: 2, rightAngles: 0, isRegular: false,
    resizable: "rect",
    verts: (cx, cy, s, ax, ay) => { const w = s * 0.45 * (ax || 1), h = s * 0.33 * (ay || 1), skew = s * 0.15 * (ax || 1); return [[cx - w, cy - h], [cx - w + 2 * skew, cy - h], [cx + w, cy + h], [cx + w - 2 * skew, cy + h]]; },
    area: (s, ax, ay) => 2 * s * 0.45 * (ax || 1) * 2 * s * 0.33 * (ay || 1) * 0.8,
    perim: (s, ax, ay) => { const base = 2 * s * 0.45 * (ax || 1); const skew = s * 0.15 * (ax || 1); const side = Math.hypot(2 * skew, 2 * s * 0.33 * (ay || 1)); return 2 * (base + side); },
    anglePos: () => [],
  },
  trapezoid: {
    cat: "quadrilateral", label: "Yamuk", labelKu: "Trapezoîd", labelEn: "Trapezoid",
    icon: "⏢", sides: 4, angles: [70, 110, 70, 110], parallel: 1, rightAngles: 0, isRegular: false,
    verts: (cx, cy, s) => [[cx - s * 0.28, cy - s * 0.33], [cx + s * 0.28, cy - s * 0.33], [cx + s * 0.48, cy + s * 0.33], [cx - s * 0.48, cy + s * 0.33]],
    area: s => 0.45 * s * s,
    perim: s => 3.0 * s,
    anglePos: () => [],
  },
  kite: {
    cat: "quadrilateral", label: "Uçurtma", labelKu: "Çargoşeya Balafirê", labelEn: "Kite",
    icon: "◇", sides: 4, angles: [72, 108, 72, 108], parallel: 0, rightAngles: 0, isRegular: false,
    verts: (cx, cy, s) => [[cx, cy - s * 0.6], [cx + s * 0.4, cy], [cx, cy + s * 0.42], [cx - s * 0.4, cy]],
    area: s => 1.2 * s * 0.8 * s / 2,
    perim: s => 2.8 * s,
    anglePos: () => [],
  },
  pentagon: {
    cat: "polygon", label: "Düzgün Beşgen", labelKu: "Pênchêla Rêkpêk", labelEn: "Regular Pentagon",
    icon: "⬠", sides: 5, angles: [108, 108, 108, 108, 108], parallel: 0, rightAngles: 0, isRegular: true,
    verts: (cx, cy, s) => Array.from({ length: 5 }, (_, i) => { const a = i * 2 * Math.PI / 5 - Math.PI / 2; return [cx + s * 0.52 * Math.cos(a), cy + s * 0.52 * Math.sin(a)]; }),
    area: s => 5 * (s * 0.52) ** 2 * Math.sin(2 * Math.PI / 5) / 2,
    perim: s => 5 * 2 * s * 0.52 * Math.sin(Math.PI / 5),
    anglePos: () => [],
  },
  hexagon: {
    cat: "polygon", label: "Düzgün Altıgen", labelKu: "Şeşhêla Rêkpêk", labelEn: "Regular Hexagon",
    icon: "⬡", sides: 6, angles: [120, 120, 120, 120, 120, 120], parallel: 3, rightAngles: 0, isRegular: true,
    verts: (cx, cy, s) => Array.from({ length: 6 }, (_, i) => { const a = i * Math.PI / 3; return [cx + s * 0.5 * Math.cos(a), cy + s * 0.5 * Math.sin(a)]; }),
    area: s => 3 * Math.sqrt(3) / 2 * (s * 0.5) ** 2,
    perim: s => 6 * s * 0.5,
    anglePos: () => [],
  },
  octagon: {
    cat: "polygon", label: "Düzgün Sekizgen", labelKu: "Heşthêla Rêkpêk", labelEn: "Regular Octagon",
    icon: "⏾", sides: 8, angles: [135, 135, 135, 135, 135, 135, 135, 135], parallel: 4, rightAngles: 0, isRegular: true,
    verts: (cx, cy, s) => Array.from({ length: 8 }, (_, i) => { const a = i * Math.PI / 4 + Math.PI / 8; return [cx + s * 0.5 * Math.cos(a), cy + s * 0.5 * Math.sin(a)]; }),
    area: s => 2 * (1 + Math.SQRT2) * (s * 0.5) ** 2,
    perim: s => 8 * s * 0.5,
    anglePos: () => [],
  },
  disk: {
    cat: "circle", label: "Daire", labelKu: "Dayre", labelEn: "Disk",
    icon: "⬤", sides: 0, angles: [], parallel: 0, rightAngles: 0, isRegular: true,
    isFilled: true,
    verts: () => [],
    area: s => Math.PI * (s * 0.48) ** 2,
    perim: s => 2 * Math.PI * (s * 0.48),
    r: s => s * 0.48,
    anglePos: () => [],
  },
  circle: {
    cat: "circle", label: "Çember", labelKu: "Xelek", labelEn: "Circle",
    icon: "◯", sides: 0, angles: [], parallel: 0, rightAngles: 0, isRegular: true,
    isFilled: false,
    verts: () => [],
    area: () => null,
    perim: s => 2 * Math.PI * (s * 0.48),
    r: s => s * 0.48,
    anglePos: () => [],
  },
};

// Kategoriye göre önceden gruplandırılmış indeks — sidebar listesi için.
export const BY_CAT = Object.entries(SHAPE_DEF).reduce((acc, [key, def]) => {
  (acc[def.cat] ||= []).push({ key, ...def });
  return acc;
}, {});
