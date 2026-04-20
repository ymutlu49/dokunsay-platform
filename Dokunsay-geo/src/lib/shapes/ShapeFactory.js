// ══════════════════════════════════════════════════════════════
// ShapeFactory — tip anahtarına (SHAPE_DEF.cat) göre doğru OOP sınıfı örnekler.
// Kategoriye göre eşleme tek yerde toplanır; Shape base sınıfı bu factory'yi
// çağırarak JSON state'den nesne üretir (Shape.fromState).
// ══════════════════════════════════════════════════════════════
import { SHAPE_DEF } from "../../constants/shapes2d.js";
import { Shape } from "./Shape.js";
import { Triangle } from "./Triangle.js";
import { Quadrilateral } from "./Quadrilateral.js";
import { RegularPolygon } from "./RegularPolygon.js";
import { CircleShape } from "./CircleShape.js";

const REGISTRY = {
  triangle: Triangle,
  quadrilateral: Quadrilateral,
  polygon: RegularPolygon,
  circle: CircleShape,
};

export function createShape(type, props = {}) {
  const def = SHAPE_DEF[type];
  if (!def) throw new Error(`Unknown shape type: ${type}`);
  const Ctor = REGISTRY[def.cat] || Shape;
  return new Ctor(type, props);
}

// Shape base sınıfının fromState hookunu bu factory'ye bağla.
// İsteğe bağlı kullanılan modüller için üst seviye API.
Shape.fromState = (item) =>
  createShape(item.type, {
    cx: item.x,
    cy: item.y,
    size: item.size,
    ax: item.ax ?? 1,
    ay: item.ay ?? 1,
    rotation: item.rotation ?? 0,
    color: item.color ?? null,
  });

export { Shape, Triangle, Quadrilateral, RegularPolygon, CircleShape };
