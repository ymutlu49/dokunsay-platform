// ══════════════════════════════════════════════════════════════
// Shape — 2B şekiller için soyut taban sınıf.
// Alt sınıflar (Triangle, Quadrilateral, RegularPolygon, CircleShape)
// area / perimeter / vertices metodlarını ortak arayüzde sunar.
// SHAPE_DEF kaydı tekil doğruluk kaynağı olarak kalır; sınıflar
// bu kayıtla üzerinde polimorfik yüzey sağlar.
// ══════════════════════════════════════════════════════════════
import { SHAPE_DEF } from "../../constants/shapes2d.js";

export class Shape {
  constructor(type, { cx = 0, cy = 0, size = 80, ax = 1, ay = 1, rotation = 0, color = null } = {}) {
    const def = SHAPE_DEF[type];
    if (!def) throw new Error(`Unknown shape type: ${type}`);
    this.type = type;
    this.def = def;
    this.cx = cx;
    this.cy = cy;
    this.size = size;
    this.ax = ax;
    this.ay = ay;
    this.rotation = rotation;
    this.color = color;
  }

  get category() { return this.def.cat; }
  get label() { return this.def.label; }
  get sides() { return this.def.sides; }
  get angles() { return this.def.angles; }
  get parallelSides() { return this.def.parallel; }
  get rightAngles() { return this.def.rightAngles; }
  get isRegular() { return this.def.isRegular; }
  get icon() { return this.def.icon; }

  localizedLabel(lang = "tr") {
    if (lang === "ku") return this.def.labelKu;
    if (lang === "en") return this.def.labelEn;
    return this.def.label;
  }

  // Alt sınıflar polimorfik olarak bunları override edebilir.
  // Varsayılan: SHAPE_DEF'e delege et.
  area() {
    return this.def.area(this.size, this.ax, this.ay);
  }

  perimeter() {
    return this.def.perim(this.size, this.ax, this.ay);
  }

  vertices() {
    return this.def.verts(this.cx, this.cy, this.size, this.ax, this.ay);
  }

  anglePositions() {
    return this.def.anglePos(this.cx, this.cy, this.size, this.ax, this.ay);
  }

  // Pedagojik olarak "birim" temsili: 10px = 1 birim (FIX14)
  areaInUnits() {
    const a = this.area();
    return a == null ? null : a / 100;
  }

  perimeterInUnits() {
    return this.perimeter() / 10;
  }

  // Serileştirme — React state için plain object
  toJSON() {
    return {
      type: this.type,
      x: this.cx,
      y: this.cy,
      size: this.size,
      rotation: this.rotation,
      ax: this.ax,
      ay: this.ay,
      color: this.color,
    };
  }

  static fromState(item) {
    return createShape(item.type, {
      cx: item.x,
      cy: item.y,
      size: item.size,
      ax: item.ax ?? 1,
      ay: item.ay ?? 1,
      rotation: item.rotation ?? 0,
      color: item.color ?? null,
    });
  }
}

// Factory — tip anahtarına göre doğru alt sınıfı örnekler.
// ShapeFactory modülünden yeniden dışa aktarılır; döngüsel import
// olmaması için bu tek yerde dinamik require kullanmıyoruz —
// alt sınıflar Factory dosyasında dolaşıma girer.
export function createShape() {
  throw new Error("createShape must be imported from ./ShapeFactory.js");
}
