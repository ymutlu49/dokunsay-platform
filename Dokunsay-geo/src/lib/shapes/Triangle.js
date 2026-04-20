import { Shape } from "./Shape.js";

// Üçgen ailesi — eşkenar, ikizkenar, dik, çeşitkenar.
// Kenar sayısı 3; iç açılar toplamı 180°.
export class Triangle extends Shape {
  get interiorAngleSum() { return 180; }

  // İkizkenar/eşkenar sezgisi — araştırma için kullanışlı bir kancadır.
  isEquilateral() { return this.type === "eq_tri"; }
  isIsosceles() { return this.type === "iso_tri" || this.type === "eq_tri"; }
  isRight() { return this.type === "right_tri"; }
  isScalene() { return this.type === "scalene_tri"; }
}
