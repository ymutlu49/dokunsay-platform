/**
 * MatBoard — SAF durum yardımcıları (React yok; test edilebilir).
 *
 * Bölge durumu = { h, t, o } (yüzlük, onluk, birlik adedi) + grup kabı için `groups`
 * (her kapta birlik adedi) + kutu için `open` + eşleme satırı için `matched`.
 * Bir bölgenin toplamı = 100h + 10t + o + Σgroups.
 */
import type { ActUnit } from '../../content/types';

export type MatZoneKind = 'pile' | 'box' | 'row' | 'group';

/** MatBoard'un bölge tanımı (ActZone'dan genel; öğretmen araçları da kullanabilir). */
export interface MatZone {
  id: string;
  /** Görünen ad (kişi/yer): "Ela". */
  label: string;
  kind: MatZoneKind;
  /** group: sabit kap sayısı. Verilmezse kaplar dinamik (gruplama bölmesi). */
  count?: number;
  /** Ton 1–4 (Okabe-Ito mavi/turuncu/yeşil/pembe + desen). */
  tone?: 1 | 2 | 3 | 4;
  /** Sayaçların altında yazan nesne adı ("kalem"). */
  unitLabel?: string;
  /**
   * box: HEDEF ÇİZGİSİ. mode:
   *  sum  → kutu + Σwith = value (birleştirme; üstüne sayma)
   *  rest → with bölgesinde value kalana dek kutuya taşı (ayırma, değişim bilinmiyor)
   *  more → kutu = Σwith + value (fark / başlangıç bilinmeyen ayırma)
   *  less → kutu = Σwith − value
   */
  target?: { value: number; with?: string[]; mode?: 'sum' | 'rest' | 'more' | 'less'; label?: 'goal' | 'rest' | 'diff' };
  /** +1/−1 ve kutuya dokunma bu bölgeden taşır (ör. "Ela'dan Ali'ye"). */
  fillFrom?: string;
  /** group: kaba dokununca bu bölgeden 1 sayaç taşınır; "birer birer dağıt" düğmesi. */
  dealFrom?: string;
  /** group (dinamik): `groupFrom` bölgesinden `groupSize`'lık grup yap düğmesi. */
  groupFrom?: string;
  groupSize?: number;
  /** "Bir kez daha koy": bu bölgenin miktarını kopyalar (kat). */
  copyFrom?: string;
  /** "Hepsini buraya topla": bu bölgelerin içeriğini buraya taşır. */
  gatherFrom?: string[];
  /** Bu bölgenin sayısı gizli ("?"). */
  hideCount?: boolean;
  /** Etkin (vurgulu) bölge. */
  active?: boolean;
  /** Düzenlenemez (yalnız izleme). */
  locked?: boolean;
}

export interface ZoneState {
  h: number;
  t: number;
  o: number;
  groups?: number[];
  open?: boolean;
  matched?: boolean;
}

export type MatState = Record<string, ZoneState>;

export type MatEventKind = 'add' | 'remove' | 'move' | 'deal' | 'group' | 'break' | 'make' | 'match' | 'open';

export interface MatEvent {
  kind: MatEventKind;
  amount: number;
  unit: ActUnit;
  zone: string;
  /** move/deal: kaynak bölge. */
  from?: string;
  t: number;
}

export const UNIT_VALUE: Record<ActUnit, number> = { one: 1, ten: 10, hundred: 100 };
const KEY: Record<ActUnit, 'o' | 't' | 'h'> = { one: 'o', ten: 't', hundred: 'h' };

export const emptyZone = (): ZoneState => ({ h: 0, t: 0, o: 0 });

export function zoneTotal(z: ZoneState | undefined): number {
  if (!z) return 0;
  return z.h * 100 + z.t * 10 + z.o + (z.groups ?? []).reduce((a, b) => a + b, 0);
}

export function countsOf(state: MatState): Record<string, number> {
  const r: Record<string, number> = {};
  for (const [id, z] of Object.entries(state)) r[id] = zoneTotal(z);
  return r;
}

/** Sayıyı sunulan birimlere ayırır (ör. 47, [ten,one] → 4 onluk 7 birlik). */
export function decompose(n: number, units: ActUnit[]): ZoneState {
  const z = emptyZone();
  let rest = Math.max(0, Math.round(n));
  if (units.includes('hundred')) {
    z.h = Math.floor(rest / 100);
    rest -= z.h * 100;
  }
  if (units.includes('ten')) {
    z.t = Math.floor(rest / 10);
    rest -= z.t * 10;
  }
  z.o = rest;
  return z;
}

export function addUnits(z: ZoneState, unit: ActUnit, n = 1): ZoneState {
  const k = KEY[unit];
  return { ...z, [k]: z[k] + n };
}

/** Birim çıkarır; yetmezse null (önce "Boz" gerekir). */
export function removeUnits(z: ZoneState, unit: ActUnit, n = 1): ZoneState | null {
  const k = KEY[unit];
  if (z[k] < n) return null;
  return { ...z, [k]: z[k] - n };
}

/** 1 onluk → 10 birlik; 1 yüzlük → 10 onluk. */
export function breakUnit(z: ZoneState, unit: 'ten' | 'hundred'): ZoneState | null {
  if (unit === 'ten') return z.t > 0 ? { ...z, t: z.t - 1, o: z.o + 10 } : null;
  return z.h > 0 ? { ...z, h: z.h - 1, t: z.t + 10 } : null;
}

/** 10 birlik → 1 onluk; 10 onluk → 1 yüzlük. */
export function makeUnit(z: ZoneState, unit: 'ten' | 'hundred'): ZoneState | null {
  if (unit === 'ten') return z.o >= 10 ? { ...z, o: z.o - 10, t: z.t + 1 } : null;
  return z.t >= 10 ? { ...z, t: z.t - 10, h: z.h + 1 } : null;
}

/** Eşit dağıtım (kalan ilk kaplara). */
export function spread(total: number, plates: number): number[] {
  if (plates <= 0) return [];
  const base = Math.floor(total / plates);
  const rem = total - base * plates;
  return Array.from({ length: plates }, (_, i) => base + (i < rem ? 1 : 0));
}

/**
 * Hedef sayılardan mat durumu kurar (Rehber/izleme). Grup bölgesinde toplam kaplara
 * eşit dağılır; dinamik kapta `groupSizeOf` verilirse o büyüklükte kaplar kurulur.
 */
export function stateFromCounts(
  zones: MatZone[],
  counts: Record<string, number>,
  units: ActUnit[],
  prev: MatState = {},
): MatState {
  const next: MatState = {};
  for (const z of zones) {
    const n = counts[z.id] ?? zoneTotal(prev[z.id]);
    const keep = { open: prev[z.id]?.open, matched: prev[z.id]?.matched };
    if (z.kind === 'group') {
      const plates = z.count ?? (z.groupSize ? Math.floor(n / z.groupSize) : prev[z.id]?.groups?.length ?? 0);
      next[z.id] = { ...emptyZone(), ...keep, groups: z.count || !z.groupSize ? spread(n, plates) : Array(plates).fill(z.groupSize) };
    } else {
      next[z.id] = { ...decompose(n, units), ...keep };
    }
  }
  for (const [id, zs] of Object.entries(prev)) if (!(id in next)) next[id] = zs;
  return next;
}

/**
 * İzleme animasyonu için BİR adım: her bölgeyi hedefe bir birim yaklaştırır (farka sığan en
 * büyük birimle). Değişiklik yoksa null.
 */
export function stepToward(cur: MatState, target: MatState, units: ActUnit[]): MatState | null {
  let changed = false;
  const next: MatState = { ...cur };
  for (const [id, tz] of Object.entries(target)) {
    const cz = cur[id] ?? emptyZone();
    if (tz.groups) {
      const cg = [...(cz.groups ?? [])];
      const want = tz.groups;
      if (cg.length < want.length) {
        cg.push(0);
      } else if (cg.length > want.length) {
        const last = cg.length - 1;
        if (cg[last] > 0) cg[last] -= 1;
        else cg.pop();
      } else {
        const i = want.findIndex((v, k) => cg[k] !== v);
        if (i < 0) continue;
        cg[i] += cg[i] < want[i] ? 1 : -1;
      }
      changed = true;
      next[id] = { ...cz, groups: cg };
      continue;
    }
    const diff = zoneTotal(tz) - zoneTotal(cz);
    if (diff === 0) {
      if (cz.h !== tz.h || cz.t !== tz.t || cz.o !== tz.o) next[id] = { ...cz, h: tz.h, t: tz.t, o: tz.o };
      continue;
    }
    changed = true;
    const unit: ActUnit =
      Math.abs(diff) >= 100 && units.includes('hundred') ? 'hundred' : Math.abs(diff) >= 10 && units.includes('ten') ? 'ten' : 'one';
    const moved = diff > 0 ? addUnits(cz, unit) : removeUnits(cz, unit) ?? decompose(zoneTotal(cz) - UNIT_VALUE[unit], units);
    next[id] = { ...moved, open: tz.open ?? cz.open, matched: tz.matched ?? cz.matched };
  }
  return changed ? next : null;
}

/** Sayı büyüklüğüne göre birimler (DESIGN §12.1 ilke 2). */
export function unitsFor(max: number): ActUnit[] {
  if (max <= 20) return ['one'];
  if (max <= 100) return ['ten', 'one'];
  return ['hundred', 'ten', 'one'];
}
