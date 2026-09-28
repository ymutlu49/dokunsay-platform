/**
 * Sayı üretimi — müfredat sınırlarına (04 §C.1) ve N eksenine (DESIGN §5) göre.
 * Tüm görünen sayılar ≥ 2 ve bir halkadaki üç değer birbirinden farklıdır (çip ve denklem
 * denetiminin belirsiz kalmaması için).
 */
import type { Grade } from './types';
import type { Rng } from './rng';

export type NLevel = 0 | 1 | 2 | 3 | 4 | 5;

export interface AddOpts {
  /** Değerler 5'in katı (para, dakika) — N ≥ 2'de. */
  step5?: boolean;
  /** Bütünün üst sınırı (bağlam gerçekçiliği; ör. litre ≤ 60). */
  maxWhole?: number;
}

export const hasCarry = (a: number, b: number): boolean => {
  // Herhangi bir basamakta elde var mı?
  let x = a, y = b;
  while (x > 0 || y > 0) {
    if ((x % 10) + (y % 10) >= 10) return true;
    x = Math.floor(x / 10);
    y = Math.floor(y / 10);
  }
  return false;
};

function wholeRange(N: NLevel): [number, number] {
  switch (N) {
    case 0: return [5, 10];
    case 1: return [11, 20];
    case 2: return [21, 99];
    case 3: return [21, 100];
    case 4: return [101, 999];
    case 5: return [1000, 9999];
  }
}

function minPart(N: NLevel): number {
  return N <= 1 ? 2 : N <= 3 ? 3 : N === 4 ? 12 : 105;
}

/**
 * Toplamsal üçlü: [p1, p2, w] (p1 + p2 = w, p1 ≠ p2).
 * N1: 1. sınıfta eldesiz (Ela'nın 12 + 5). N2 eldesiz, N3 eldeli.
 */
export function additiveTriple(rng: Rng, grade: Grade, N: NLevel, opts: AddOpts = {}): [number, number, number] {
  let [lo, hi] = wholeRange(N);
  if (opts.maxWhole) hi = Math.min(hi, opts.maxWhole);
  if (hi < lo) lo = Math.max(5, Math.floor(hi / 2));
  const mp = minPart(N);
  const noCarry = N === 2 || (N <= 1 && grade === 1);
  const wantCarry = N === 3;
  const step = opts.step5 && N >= 2 ? 5 : 1;
  for (let i = 0; i < 400; i++) {
    let w = rng.int(lo, hi);
    if (step > 1) w = Math.max(step * 3, Math.round(w / step) * step);
    if (w > hi || w < lo) continue;
    let p1 = rng.int(mp, w - mp);
    if (step > 1) p1 = Math.round(p1 / step) * step;
    const p2 = w - p1;
    if (p1 < mp || p2 < mp || p1 === p2) continue;
    if (N >= 2 && Math.max(p1, p2) < 10) continue;
    const carry = hasCarry(p1, p2);
    if (noCarry && carry) continue;
    if (wantCarry && !carry) continue;
    return [p1, p2, w];
  }
  // Güvenli geri dönüş (hiç olmaması beklenir)
  return N === 0 ? [3, 5, 8] : [12, 5, 17];
}

export interface MulTriple {
  groups: number;
  perGroup: number;
  total: number;
  remainder?: number;
}

/**
 * Eşit gruplar üçlüsü. `divisor` = paylaştırmada grup sayısı, gruplamada grup başına.
 * 2. sınıf: çarpımda bir çarpan ≤ 5, öbürü ≤ 10; bölmede toplam ≤ 20, bölen 2–5, kalansız.
 * 3. sınıf: 10'a kadar çarpım tablosu (N ≥ 4'te 2 basamak × 1 basamak); bölme ≤ 100.
 * 4. sınıf: 1 basamak × en çok 3 basamak; bölme ≤ 1000 ÷ 1 basamak.
 */
export function mulTriple(
  rng: Rng,
  grade: Grade,
  kind: 'multiply' | 'partitive' | 'quotative',
  opts: { remainder?: boolean; bigN?: boolean; minRemainder?: number } = {},
): MulTriple {
  for (let i = 0; i < 400; i++) {
    let groups: number, perGroup: number;
    if (grade <= 2) {
      if (kind === 'multiply') {
        const small = rng.int(2, 5);
        const big = rng.int(2, 10);
        [groups, perGroup] = rng.chance(0.5) ? [small, big] : [big, small];
        if (groups * perGroup > 50) continue;
      } else {
        const d = rng.int(2, 5);
        const q = rng.int(2, Math.floor(20 / d));
        [groups, perGroup] = kind === 'partitive' ? [d, q] : [q, d];
      }
    } else if (grade === 3) {
      if (kind === 'multiply') {
        if (opts.bigN) {
          const one = rng.int(2, 9), two = rng.int(11, 99);
          [groups, perGroup] = rng.chance(0.5) ? [one, two] : [two, one];
        } else {
          groups = rng.int(2, 10);
          perGroup = rng.int(2, 10);
        }
      } else {
        const d = rng.int(opts.remainder ? 3 : 2, 9);
        const q = rng.int(2, Math.floor(99 / d));
        [groups, perGroup] = kind === 'partitive' ? [d, q] : [q, d];
      }
    } else {
      if (kind === 'multiply') {
        const one = rng.int(2, 9);
        const two = opts.bigN ? rng.int(100, 999) : rng.int(11, 99);
        [groups, perGroup] = rng.chance(0.5) ? [one, two] : [two, one];
      } else {
        const d = rng.int(3, 9);
        const q = rng.int(11, Math.floor(999 / d));
        [groups, perGroup] = kind === 'partitive' ? [d, q] : [q, d];
      }
    }
    if (groups === perGroup || groups < 2 || perGroup < 2) continue;
    let total = groups * perGroup;
    let remainder: number | undefined;
    if (opts.remainder) {
      const d = kind === 'partitive' ? groups : perGroup;
      const minR = Math.max(1, opts.minRemainder ?? 1);
      if (d - 1 < minR) continue;
      remainder = rng.int(minR, d - 1);
      total += remainder;
      const cap = grade === 3 ? 100 : 1000;
      if (total > cap) continue;
    }
    if (total === groups || total === perGroup) continue;
    return { groups, perGroup, total, remainder };
  }
  return { groups: 3, perGroup: 4, total: 12 };
}

/** Kat karşılaştırması: [reference, factor, compared] (times) ya da kesir (fraction). */
export function timesTriple(rng: Rng, grade: Grade, variant: 'times' | 'fraction'): { reference: number; factor: number; compared: number } {
  for (let i = 0; i < 400; i++) {
    if (variant === 'fraction') {
      const k = rng.pick([2, 3, 4, 5] as const);
      const compared = grade <= 3 ? rng.int(2, 10) : rng.int(3, Math.floor(999 / k));
      const reference = k * compared;
      if (compared === k) continue;
      return { reference, factor: k, compared };
    }
    const factor = grade <= 3 ? rng.int(2, 5) : rng.int(2, 9);
    const reference = grade <= 3 ? rng.int(2, 20) : rng.int(3, 110);
    const compared = factor * reference;
    if (reference === factor) continue;
    if (grade <= 3 && compared > 100) continue;
    if (compared > 999) continue;
    return { reference, factor, compared };
  }
  return { reference: 4, factor: 3, compared: 12 };
}

/** Değerlerden N düzeyi (çarpımsal ve gözlenen düzey için). */
export function nOfValues(values: number[], carry = false): NLevel {
  const m = Math.max(...values);
  if (m <= 10) return 0;
  if (m <= 20) return 1;
  if (m <= 100) return carry ? 3 : 2;
  if (m <= 1000) return 4;
  return 5;
}

/** Sınıfa göre izinli en yüksek N (04 §C.1). */
export const maxNForGrade = (g: Grade): NLevel => (g === 1 ? 1 : g === 2 ? 3 : g === 3 ? 4 : 5);

/** Sınıfa göre varsayılan N seçimi ("önce yapı, sonra sayı": orta düzey). */
export function defaultN(rng: Rng, g: Grade): NLevel {
  switch (g) {
    case 1: return rng.pick([0, 0, 1] as const);
    case 2: return rng.pick([1, 2, 2, 3] as const);
    case 3: return rng.pick([2, 3, 3, 4] as const);
    default: return rng.pick([3, 4, 4, 5] as const);
  }
}

/** İlgisiz sayı: verilen değerlerden farklı, sınıf aralığında. */
export function extraValue(rng: Rng, taken: number[], lo: number, hi: number): number {
  for (let i = 0; i < 200; i++) {
    const v = rng.int(lo, hi);
    if (!taken.includes(v)) return v;
  }
  return hi + 1;
}
