import { Shape } from "./Shape.js";

// Daire (disk) ve çember (circle) — eğri kategorisi.
// Pedagojik ayrım: çember yalnızca sınırdır (alanı yok, uzunluğu var);
// daire ise sınır + iç bölgenin bütünüdür. Öğrencilerin en sık karıştırdığı çifttir.
export class CircleShape extends Shape {
  get radius() { return this.def.r(this.size); }
  get diameter() { return 2 * this.radius; }
  get circumference() { return 2 * Math.PI * this.radius; }

  isDisk() { return this.type === "disk"; }
  isCircle() { return this.type === "circle";  /* yalnız sınır */ }

  // Çemberin alanı yoktur — sadece disk için anlamlıdır.
  area() {
    return this.isDisk() ? Math.PI * this.radius * this.radius : null;
  }

  perimeter() {
    return this.circumference;
  }

  symmetryLines() { return Infinity; }
}
