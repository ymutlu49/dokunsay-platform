import { describe, expect, it } from 'vitest';
import {
  addUnits, breakUnit, countsOf, decompose, makeUnit, removeUnits, spread, stateFromCounts, stepToward, unitsFor, zoneTotal,
  type MatState, type MatZone,
} from './matState';

describe('matState', () => {
  it('decompose uses offered units only', () => {
    expect(decompose(47, ['ten', 'one'])).toEqual({ h: 0, t: 4, o: 7 });
    expect(decompose(47, ['one'])).toEqual({ h: 0, t: 0, o: 47 });
    expect(decompose(347, ['hundred', 'ten', 'one'])).toEqual({ h: 3, t: 4, o: 7 });
  });

  it('add / remove / break / make keep totals consistent', () => {
    let z = decompose(23, ['ten', 'one']);
    z = addUnits(z, 'ten');
    expect(zoneTotal(z)).toBe(33);
    expect(removeUnits(z, 'one', 5)).toBeNull();
    const b = breakUnit(z, 'ten')!;
    expect(b).toEqual({ h: 0, t: 2, o: 13 });
    expect(zoneTotal(removeUnits(b, 'one', 5)!)).toBe(28);
    expect(makeUnit(b, 'ten')).toEqual({ h: 0, t: 3, o: 3 });
  });

  it('spread distributes evenly', () => {
    expect(spread(12, 3)).toEqual([4, 4, 4]);
    expect(spread(7, 3)).toEqual([3, 2, 2]);
  });

  it('stateFromCounts builds groups and piles', () => {
    const zones: MatZone[] = [
      { id: 'a', label: 'A', kind: 'pile' },
      { id: 'g', label: 'G', kind: 'group', count: 3 },
      { id: 'q', label: 'Q', kind: 'group', groupSize: 4 },
    ];
    const s = stateFromCounts(zones, { a: 5, g: 12, q: 8 }, ['one']);
    expect(s.a.o).toBe(5);
    expect(s.g.groups).toEqual([4, 4, 4]);
    expect(s.q.groups).toEqual([4, 4]);
    expect(countsOf(s)).toEqual({ a: 5, g: 12, q: 8 });
  });

  it('stepToward converges', () => {
    const zones: MatZone[] = [
      { id: 'a', label: 'A', kind: 'pile' },
      { id: 'g', label: 'G', kind: 'group', count: 2 },
    ];
    const target = stateFromCounts(zones, { a: 34, g: 6 }, ['ten', 'one']);
    let cur: MatState = { a: { h: 0, t: 0, o: 0 }, g: { h: 0, t: 0, o: 0, groups: [] } };
    let n = 0;
    for (let next = stepToward(cur, target, ['ten', 'one']); next; next = stepToward(cur, target, ['ten', 'one'])) {
      cur = next;
      if (++n > 100) break;
    }
    expect(countsOf(cur)).toEqual({ a: 34, g: 6 });
    expect(n).toBeLessThan(20);
  });

  it('unitsFor', () => {
    expect(unitsFor(18)).toEqual(['one']);
    expect(unitsFor(64)).toEqual(['ten', 'one']);
    expect(unitsFor(640)).toEqual(['hundred', 'ten', 'one']);
  });
});
