import { describe, expect, it } from 'vitest';
import { applyOp } from './ops';
import { countsOf, type MatZone } from './matState';

const zones: MatZone[] = [
  { id: 'supply', label: 'Ela', kind: 'pile' },
  { id: 'groups', label: 'Kutular', kind: 'group', count: 3, dealFrom: 'supply' },
  { id: 'q', label: 'Q', kind: 'group', groupFrom: 'supply', groupSize: 4 },
  { id: 'box', label: '?', kind: 'box' },
  { id: 'out', label: 'Ali', kind: 'pile' },
];

describe('mat ops', () => {
  it('content zone named "supply" is a real zone, not the spare tray', () => {
    const s0 = { supply: { h: 0, t: 1, o: 2 }, groups: { h: 0, t: 0, o: 0, groups: [0, 0, 0] } };
    const r = applyOp(s0, zones, { op: 'deal', zone: 'groups' });
    expect(r.next.groups.groups).toEqual([1, 1, 1]);
    expect(countsOf(r.next).supply).toBe(9);
    expect(r.events.map((e) => e.kind)).toContain('deal');
  });

  it('deal auto-breaks a ten when ones run out', () => {
    const s0 = { supply: { h: 0, t: 1, o: 0 }, groups: { h: 0, t: 0, o: 0, groups: [0, 0, 0] } };
    const r = applyOp(s0, zones, { op: 'deal', zone: 'groups' });
    expect(r.events[0].kind).toBe('break');
    expect(countsOf(r.next)).toMatchObject({ supply: 7, groups: 3 });
  });

  it('makeGroup takes size from source into a new plate', () => {
    const r = applyOp({ supply: { h: 0, t: 0, o: 9 } }, zones, { op: 'makeGroup', zone: 'q' });
    expect(r.next.q.groups).toEqual([4]);
    expect(countsOf(r.next).supply).toBe(5);
  });

  it('spare tray adds, bin removes, move between zones', () => {
    let s = applyOp({}, zones, { op: 'move', from: '@supply', to: 'out', unit: 'one' }).next;
    expect(countsOf(s).out).toBe(1);
    s = applyOp(s, zones, { op: 'move', from: 'out', to: '@trash', unit: 'one' }).next;
    expect(countsOf(s).out).toBe(0);
  });

  it('closed empty box can give away (start-unknown separate)', () => {
    const r = applyOp({ box: { h: 0, t: 0, o: 0 } }, zones, { op: 'move', from: 'box', to: 'out', unit: 'one', n: 3 });
    expect(countsOf(r.next)).toMatchObject({ box: 0, out: 3 });
  });
});
