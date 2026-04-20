import { Shape } from "./Shape.js";

// Düzgün çokgen ailesi — beşgen, altıgen, sekizgen.
// Kenar sayısı n ≥ 5; iç açılar toplamı = (n-2) × 180°.
export class RegularPolygon extends Shape {
  get interiorAngleSum() { return (this.sides - 2) * 180; }
  get interiorAngleEach() { return this.interiorAngleSum / this.sides; }

  // Simetri ekseni sayısı düzgün çokgenlerde kenar sayısına eşittir.
  symmetryLines() { return this.sides; }
}
