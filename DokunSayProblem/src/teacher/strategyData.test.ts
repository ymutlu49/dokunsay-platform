import { describe, expect, it } from 'vitest';
import type { ActStrategy, SchemaId } from '../content/types';
import type { AttemptRecord } from '../lib/progress';
import type { ModuleRecord } from '../modules/record';
import { buildStrategySummary, collectObs, trendOf } from './strategyData';

const att = (schema: SchemaId, ts: number, s?: ActStrategy[], extra: Partial<AttemptRecord> = {}): AttemptRecord => ({
  problemId: `p${ts}`,
  seed: 1,
  grade: 2,
  schemas: [schema],
  level: 2,
  correct: true,
  errors: [],
  maxHint: 0,
  usedH4: false,
  modelFirstTry: true,
  stepTimes: {},
  actStrategies: s,
  ts,
  ...extra,
});
const mod = (schema: SchemaId, ts: number, s: ActStrategy[]): ModuleRecord => ({ module: 'act', grade: 2, schema, correct: true, strategies: s, ts });

describe('strateji özeti', () => {
  it('iki kaynağı zaman sırasıyla birleştirir, stratejisiz kayıtları atlar', () => {
    const obs = collectObs([att('change', 3, ['countOn']), att('change', 1)], [mod('change', 2, ['countAll']), { ...mod('change', 4, []), strategies: undefined }]);
    expect(obs.map((o) => o.ts)).toEqual([2, 3]);
    expect(obs.map((o) => o.source)).toEqual(['act', 'solve']);
  });

  it('eğilim: hepsini saymaktan üstüne saymaya → up; az gözlemde null', () => {
    const up = [0, 0, 0, 1, 1, 2].map((r, i) => ({ schema: 'change' as SchemaId, strategies: [(['countAll', 'countOn', 'useTens'] as ActStrategy[])[r]], ts: i, source: 'act' as const }));
    expect(trendOf(up)).toBe('up');
    expect(trendOf(up.slice(0, 3))).toBeNull();
    expect(trendOf([...up].reverse().map((o, i) => ({ ...o, ts: i })))).toBe('down');
  });

  it('şema ailesine göre yol, baskın strateji ve destek gereksinimi', () => {
    const s = buildStrategySummary(
      [att('change', 1, ['countAll']), att('change', 2, ['countAll']), att('equalGroups', 3, ['groupAtOnce']), att('combine', 4, undefined, { level: 1, actUsed: true }), att('combine', 5, undefined, { level: 0 })],
      [mod('change', 6, ['countOn', 'guessCheck'])],
    );
    const change = s.rows.find((r) => r.schema === 'change')!;
    expect(change.path).toEqual(['countAll', 'countOn', 'useTens']);
    expect(change.counts.countAll).toBe(2);
    expect(change.extra).toEqual(['guessCheck']);
    expect(change.dominant).toBe('countAll');
    expect(s.stillCountAll).toEqual(['change']);
    // Eşitlikte en son görülen baskındır.
    const tie = buildStrategySummary([att('change', 1, ['countAll']), att('change', 2, ['useTens'])], []);
    expect(tie.rows[0].dominant).toBe('useTens');
    expect(tie.stillCountAll).toEqual([]);
    expect(s.rows.find((r) => r.schema === 'equalGroups')!.path).toEqual(['dealOneByOne', 'groupAtOnce']);
    const combine = s.rows.find((r) => r.schema === 'combine')!;
    expect([combine.actUsed, combine.lowAttempts, combine.obs]).toEqual([1, 2, 0]);
    expect([s.actUsed, s.lowAttempts, s.totalObs]).toEqual([1, 2, 4]);
  });
});
