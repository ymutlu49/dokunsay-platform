import { Shape } from "./Shape.js";

// Dörtgen ailesi — kare, dikdörtgen, eşkenar dörtgen, paralelkenar,
// yamuk, uçurtma. Hiyerarşi (L2 pedagojisi): kare ⊂ dikdörtgen ⊂ paralelkenar.
export class Quadrilateral extends Shape {
  get interiorAngleSum() { return 360; }

  isSquare() { return this.type === "square"; }
  isRectangle() { return this.isSquare() || this.type === "rectangle"; }
  isRhombus() { return this.isSquare() || this.type === "rhombus"; }
  isParallelogram() { return this.isRectangle() || this.isRhombus() || this.type === "parallelogram"; }
  isTrapezoid() { return this.type === "trapezoid"; }
  isKite() { return this.type === "kite"; }

  // Kenardan uzatma desteği — rectangle, rhombus, parallelogram
  get isEdgeResizable() { return this.def.resizable != null; }
  get edgeResizeMode() { return this.def.resizable; }
}
