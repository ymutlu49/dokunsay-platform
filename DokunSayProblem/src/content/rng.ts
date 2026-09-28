/**
 * Tohumlu sözde-rastgele sayı üreteci (mulberry32) + yardımcılar.
 * Aynı tohum → aynı dizi; içerik motorunun her seçimi buradan geçer (Math.random YOK).
 */

export interface Rng {
  /** [0, 1) */
  next(): number;
  /** [min, max] tam sayı (ikisi dahil). */
  int(min: number, max: number): number;
  pick<T>(arr: readonly T[]): T;
  chance(p: number): boolean;
  shuffle<T>(arr: readonly T[]): T[];
}

export function mulberry32(seed: number): Rng {
  let a = seed >>> 0;
  const next = (): number => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const int = (min: number, max: number): number => {
    if (max < min) return min;
    return min + Math.floor(next() * (max - min + 1));
  };
  return {
    next,
    int,
    pick: <T,>(arr: readonly T[]): T => arr[Math.floor(next() * arr.length)],
    chance: (p: number) => next() < p,
    shuffle: <T,>(arr: readonly T[]): T[] => {
      const out = arr.slice();
      for (let i = out.length - 1; i > 0; i--) {
        const j = Math.floor(next() * (i + 1));
        [out[i], out[j]] = [out[j], out[i]];
      }
      return out;
    },
  };
}

/** FNV-1a 32 bit. */
export function hashStr(s: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/** Bir tohumdan ikincil tohum türet (deneme sayacı, modül adı vb.). */
export function deriveSeed(seed: number, salt: number | string): number {
  return hashStr(`${seed >>> 0}:${salt}`);
}

/** Tohum verilmediğinde: zamana dayalı ama 32 bit. */
export function freshSeed(): number {
  const perf = typeof performance !== 'undefined' ? Math.floor(performance.now() * 1000) : 0;
  return hashStr(`${Date.now()}:${perf}`);
}
