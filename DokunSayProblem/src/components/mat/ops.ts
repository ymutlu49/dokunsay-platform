/**
 * MatBoard işlemleri — SAF: (durum, işlem) → { yeni durum, olaylar }. Konum dizgeleri:
 *   "ela" (bölge) · "ela#2" (bölgenin 3. kabı) · "ela#new" (yeni kap) · "@supply" · "@trash" (ayrılmış; içerik bölge kimlikleriyle çakışmaz).
 * Kaynaktan birlik gerektiğinde onluk kendiliğinden bozulur (olay: break) — dağıtma ve
 * gruplamada çocuğu gereksiz adımla yormamak için; −1 düğmesinde ise açık "Boz" istenir.
 */
import type { ActUnit } from '../../content/types';
import {
  addUnits, breakUnit, emptyZone, makeUnit, removeUnits, UNIT_VALUE, zoneTotal,
  type MatEvent, type MatState, type MatZone, type ZoneState,
} from './matState';

export type MatOp =
  | { op: 'add'; zone: string; unit: ActUnit; n: number }
  | { op: 'remove'; zone: string; unit: ActUnit; n: number }
  | { op: 'break'; zone: string; unit: 'ten' | 'hundred' }
  | { op: 'make'; zone: string; unit: 'ten' | 'hundred' }
  | { op: 'move'; from: string; to: string; unit: ActUnit; n?: number; auto?: boolean }
  | { op: 'plate'; zone: string; plate: number | 'new' }
  | { op: 'deal'; zone: string }
  | { op: 'makeGroup'; zone: string }
  | { op: 'copy'; zone: string }
  | { op: 'gather'; zone: string }
  | { op: 'open'; zone: string }
  | { op: 'match'; zones: [string, string]; on: boolean };

export interface OpResult {
  next: MatState;
  events: MatEvent[];
  fail?: 'needBreak' | 'empty';
}

const zoneOf = (loc: string) => loc.split('#')[0];
const plateOf = (loc: string): number | 'new' | null => {
  const p = loc.split('#')[1];
  return p == null ? null : p === 'new' ? 'new' : Number(p);
};

class Tx {
  s: MatState;
  ev: MatEvent[] = [];
  fail?: OpResult['fail'];
  constructor(state: MatState, readonly zones: MatZone[], readonly now: number) {
    this.s = { ...state };
  }
  z(id: string): ZoneState {
    return this.s[id] ?? emptyZone();
  }
  set(id: string, v: ZoneState) {
    this.s[id] = v;
  }
  emit(kind: MatEvent['kind'], amount: number, unit: ActUnit, zone: string, from?: string) {
    this.ev.push({ kind, amount, unit, zone, from, t: this.now });
  }
  /** Konumdan 1 birim al. auto: birlik yoksa onluk boz. */
  take(loc: string, unit: ActUnit, auto: boolean): boolean {
    if (loc === '@supply') return true;
    const id = zoneOf(loc);
    const p = plateOf(loc);
    const z = this.z(id);
    if (typeof p === 'number') {
      const g = [...(z.groups ?? [])];
      if ((g[p] ?? 0) < UNIT_VALUE[unit]) return false;
      g[p] -= UNIT_VALUE[unit];
      this.set(id, { ...z, groups: g });
      return true;
    }
    // Kapalı ve boş gizli kutu "veren" olabilir (başlangıcı bilinmeyen ayırma): sanal kaynak.
    const zd = this.zones.find((x) => x.id === id);
    if (zd?.kind === 'box' && !z.open && zoneTotal(z) === 0) return true;
    let r = removeUnits(z, unit);
    if (!r && auto && unit === 'one') {
      const b = breakUnit(z, 'ten') ?? (z.h > 0 ? breakUnit(breakUnit(z, 'hundred')!, 'ten') : null);
      if (b) {
        this.emit('break', 1, 'ten', id);
        r = removeUnits(b, 'one');
      }
    }
    if (!r) {
      this.fail = zoneTotal(z) > 0 ? 'needBreak' : 'empty';
      return false;
    }
    this.set(id, r);
    return true;
  }
  put(loc: string, unit: ActUnit) {
    if (loc === '@trash' || loc === '@supply') return;
    const id = zoneOf(loc);
    const p = plateOf(loc);
    const z = this.z(id);
    if (p != null) {
      const g = [...(z.groups ?? [])];
      const zone = this.zones.find((x) => x.id === id);
      const i = p === 'new' ? g.length : p;
      while (g.length <= i) g.push(0);
      if (zone?.count != null && i >= zone.count) return;
      g[i] += UNIT_VALUE[unit];
      this.set(id, { ...z, groups: g });
      return;
    }
    this.set(id, addUnits(z, unit));
  }
}

export function applyOp(state: MatState, zones: MatZone[], op: MatOp, now = Date.now()): OpResult {
  const tx = new Tx(state, zones, now);
  const zone = (id: string) => zones.find((z) => z.id === id);
  switch (op.op) {
    case 'add':
      for (let i = 0; i < op.n; i++) tx.put(op.zone, op.unit);
      tx.emit('add', op.n * UNIT_VALUE[op.unit], op.unit, op.zone);
      break;
    case 'remove': {
      let k = 0;
      while (k < op.n && tx.take(op.zone, op.unit, false)) k++;
      if (k) tx.emit('remove', k * UNIT_VALUE[op.unit], op.unit, op.zone);
      break;
    }
    case 'break': {
      const r = breakUnit(tx.z(op.zone), op.unit);
      if (r) {
        tx.set(op.zone, r);
        tx.emit('break', 1, op.unit, op.zone);
      }
      break;
    }
    case 'make': {
      const r = makeUnit(tx.z(op.zone), op.unit);
      if (r) {
        tx.set(op.zone, r);
        tx.emit('make', 1, op.unit, op.zone);
      }
      break;
    }
    case 'move': {
      if (op.from === op.to) break;
      let k = 0;
      while (k < (op.n ?? 1) && tx.take(op.from, op.unit, !!op.auto)) {
        tx.put(op.to, op.unit);
        k++;
      }
      if (!k) break;
      const amt = UNIT_VALUE[op.unit] * k;
      const toZone = zoneOf(op.to);
      if (op.from === '@supply') tx.emit('add', amt, op.unit, toZone);
      else if (op.to === '@trash') tx.emit('remove', amt, op.unit, zoneOf(op.from));
      else if (op.to.includes('#')) tx.emit(zone(toZone)?.count != null ? 'deal' : 'group', amt, op.unit, toZone, zoneOf(op.from));
      else tx.emit('move', amt, op.unit, toZone, zoneOf(op.from));
      break;
    }
    case 'plate': {
      const z = zone(op.zone);
      const src = z?.dealFrom ?? z?.groupFrom ?? '@supply';
      if (!tx.take(src, 'one', true)) break;
      tx.put(`${op.zone}#${op.plate}`, 'one');
      tx.emit(src === '@supply' ? 'add' : z?.count != null ? 'deal' : 'group', 1, 'one', op.zone, src === '@supply' ? undefined : src);
      break;
    }
    case 'deal': {
      const z = zone(op.zone);
      const n = z?.count ?? tx.z(op.zone).groups?.length ?? 0;
      const src = z?.dealFrom ?? '@supply';
      let k = 0;
      for (let i = 0; i < n; i++) {
        if (!tx.take(src, 'one', true)) break;
        tx.put(`${op.zone}#${i}`, 'one');
        k++;
      }
      if (k) tx.emit(src === '@supply' ? 'add' : 'deal', k, 'one', op.zone, src === '@supply' ? undefined : src);
      break;
    }
    case 'makeGroup': {
      const z = zone(op.zone);
      const size = z?.groupSize ?? 0;
      const src = z?.groupFrom ?? '@supply';
      if (!size || (src !== '@supply' && zoneTotal(tx.z(src)) < size)) {
        tx.fail = 'empty';
        break;
      }
      for (let i = 0; i < size; i++) tx.take(src, 'one', true);
      const g = [...(tx.z(op.zone).groups ?? []), size];
      tx.set(op.zone, { ...tx.z(op.zone), groups: g });
      tx.emit('group', size, 'one', op.zone, src === '@supply' ? undefined : src);
      break;
    }
    case 'copy': {
      const z = zone(op.zone);
      const amount = z?.copyFrom ? zoneTotal(state[z.copyFrom]) : 0;
      if (!amount) break;
      if (z?.kind === 'group') {
        const cur = tx.z(op.zone);
        const g = [...(cur.groups ?? [])];
        const i = g.findIndex((v) => v === 0);
        if (i >= 0) g[i] = amount;
        else if (z.count == null || g.length < z.count) g.push(amount);
        else break;
        tx.set(op.zone, { ...cur, groups: g });
      } else {
        const src = state[z!.copyFrom!] ?? emptyZone();
        const cur = tx.z(op.zone);
        tx.set(op.zone, { ...cur, h: cur.h + src.h, t: cur.t + src.t, o: cur.o + src.o });
      }
      tx.emit('group', amount, 'one', op.zone, z?.copyFrom);
      break;
    }
    case 'gather': {
      const z = zone(op.zone);
      for (const f of z?.gatherFrom ?? []) {
        const src = tx.z(f);
        const amount = zoneTotal(src);
        if (!amount) continue;
        const cur = tx.z(op.zone);
        const extra = (src.groups ?? []).reduce((a, b) => a + b, 0);
        tx.set(op.zone, { ...cur, h: cur.h + src.h, t: cur.t + src.t, o: cur.o + src.o + extra });
        tx.set(f, { ...emptyZone(), open: src.open, groups: src.groups ? src.groups.map(() => 0) : undefined });
        tx.emit('move', amount, 'one', op.zone, f);
      }
      break;
    }
    case 'open':
      tx.set(op.zone, { ...tx.z(op.zone), open: true });
      tx.emit('open', 0, 'one', op.zone);
      break;
    case 'match':
      for (const id of op.zones) tx.set(id, { ...tx.z(id), matched: op.on });
      if (op.on) tx.emit('match', 0, 'one', op.zones[0], op.zones[1]);
      break;
  }
  return { next: tx.s, events: tx.ev, fail: tx.fail };
}
