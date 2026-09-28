import { describe, expect, it } from 'vitest';
import type { Grade, Problem, Role } from './types';
import { SCHEMA_ROLES } from './types';
import { generateProblem } from './generate';
import { checkAnswer, checkEquation, checkModel, checkSchema, classifyWrongAnswer, equationOf } from './evaluate';
import { val } from './relations';

const find = (pred: (p: Problem) => boolean, spec: Parameters<typeof generateProblem>[0]): Problem => {
  for (let s = 1; s < 500; s++) { const p = generateProblem({ ...spec, seed: s }); if (pred(p)) return p; }
  throw new Error('bulunamadı');
};

describe('equationOf', () => {
  it('şablon + eşdeğerler (8 − 3 = ? ve 3 + ? = 8)', () => {
    const p = generateProblem({ grade: 2, schema: 'change', variant: 'separate', unknown: 'result', seed: 3 });
    const s = p.steps[0];
    const { tokens, alternatives } = equationOf(s);
    expect(tokens).toEqual([val(s, 'start'), '−', val(s, 'change'), '=', '?']);
    expect(alternatives).toContainEqual([val(s, 'change'), '+', '?', '=', val(s, 'start')]);
    expect(alternatives).toContainEqual(['?', '=', val(s, 'start'), '−', val(s, 'change')]);
  });
});

describe('checkSchema / checkModel', () => {
  const p = generateProblem({ grade: 2, schema: 'combine', unknown: 'whole', seed: 11, axes: { I: 1 } });
  const s = p.steps[0];
  const good: Partial<Record<Role, number | '?'>> = { part1: val(s, 'part1'), part2: val(s, 'part2'), whole: '?' };
  it('şema', () => { expect(checkSchema(s, 'combine')).toBe(true); expect(checkSchema(s, 'change')).toBe(false); });
  it('parça-bütünde parçalar yer değiştirebilir', () => {
    expect(checkModel(s, { part1: good.part2, part2: good.part1, whole: '?' }, p.extras).ok).toBe(true);
  });
  it('gereksiz sayı → irrelevantUsed; ? yanlış yerde → unknownPlacement; eksik → missing', () => {
    expect(checkModel(s, { ...good, part1: p.extras[0].value }, p.extras).error).toBe('irrelevantUsed');
    const r = checkModel(s, { part1: '?', part2: good.part2, whole: val(s, 'whole') }, p.extras);
    expect(r.error).toBe('unknownPlacement');
    expect(checkModel(s, { part1: good.part1 }, p.extras).perRole.whole).toBe('missing');
  });
  it('parça bazında işaretleme', () => {
    const r = checkModel(s, { ...good, part2: 999 }, p.extras);
    expect(r.perRole.part1).toBe('ok');
    expect(r.perRole.part2).toBe('wrong');
    expect(r.error).toBe('modelPlacement');
  });
});

describe('checkEquation hata sınıfları', () => {
  it('başlangıç bilinmeyende metin sırası → textOrderOp', () => {
    const p = generateProblem({ grade: 2, schema: 'change', variant: 'separate', unknown: 'start', seed: 5 });
    const s = p.steps[0];
    expect(checkEquation(s, [val(s, 'result'), '−', val(s, 'change'), '=', '?']).error).toBe('textOrderOp');
    expect(checkEquation(s, ['?', '−', val(s, 'change'), '=', val(s, 'result')]).ok).toBe(true);
    expect(checkEquation(s, [val(s, 'result'), '+', val(s, 'change'), '=', '?']).ok).toBe(true);
  });
  it('tutarsız dilde anahtar sözcük işlemi → reversal', () => {
    const p = generateProblem({ grade: 3, schema: 'compare', variant: 'more', unknown: 'smaller', seed: 8 });
    const s = p.steps[0];
    expect(checkEquation(s, [val(s, 'larger'), '+', val(s, 'difference'), '=', '?']).error).toBe('reversal');
    expect(checkEquation(s, [val(s, 'larger'), '−', val(s, 'difference'), '=', '?']).ok).toBe(true);
  });
  it('cevap yazılmış denklem de kabul', () => {
    const p = generateProblem({ grade: 1, schema: 'change', variant: 'join', unknown: 'result', seed: 2 });
    const s = p.steps[0];
    expect(checkEquation(s, [val(s, 'start'), '+', val(s, 'change'), '=', val(s, 'result')]).ok).toBe(true);
  });
  it('modele uymayan işlem → operation', () => {
    const p = generateProblem({ grade: 2, schema: 'combine', unknown: 'part2', seed: 4 });
    const s = p.steps[0];
    expect(checkEquation(s, [val(s, 'whole'), '+', val(s, 'part1'), '=', '?']).error).toBe('operation');
  });
});

describe('checkAnswer / classifyWrongAnswer', () => {
  it('doğru cevap ve hesap hatası', () => {
    const p = generateProblem({ grade: 2, schema: 'change', variant: 'join', unknown: 'result', seed: 9 });
    expect(checkAnswer(p, p.answer)).toEqual({ ok: true });
    expect(checkAnswer(p, p.answer + 1).error).toBe('computation');
  });
  it('kalanı yok sayma → unitOrRemainder', () => {
    const p = find((x) => x.steps[0].remainder?.interpret === 'roundUp', { grade: 3, schema: 'equalGroups', variant: 'quotative' });
    const s = p.steps[0];
    expect(p.answer).toBe(val(s, 'groups') + 1);
    expect(checkAnswer(p, val(s, 'groups')).error).toBe('unitOrRemainder');
  });
  it('gereksiz sayıyı eklemek → irrelevantUsed', () => {
    const p = generateProblem({ grade: 3, schema: 'combine', unknown: 'whole', seed: 12, axes: { I: 1 } });
    expect(classifyWrongAnswer(p, p.answer + p.extras[0].value)).toBe('irrelevantUsed');
  });
  it('tutarsız dilde ters işlem → reversal', () => {
    const p = generateProblem({ grade: 2, schema: 'compare', variant: 'fewer', unknown: 'larger', seed: 6 });
    const s = p.steps[0];
    expect(classifyWrongAnswer(p, Math.abs(val(s, 'smaller') - val(s, 'difference')))).toBe('reversal');
  });
  it('başlangıç bilinmeyende metin sırası → textOrderOp', () => {
    const p = generateProblem({ grade: 2, schema: 'change', variant: 'separate', unknown: 'start', seed: 14 });
    const s = p.steps[0];
    expect(classifyWrongAnswer(p, val(s, 'result') - val(s, 'change') > 0 ? val(s, 'result') - val(s, 'change') : val(s, 'change') - val(s, 'result'))).toBe('textOrderOp');
  });
  it('model tüm şemalarda doğru yerleşimi kabul eder', () => {
    for (const grade of [2, 3, 4] as Grade[]) for (let seed = 1; seed < 40; seed++) {
      const p = generateProblem({ grade, seed });
      for (const s of p.steps) {
        const pl: Partial<Record<Role, number | '?'>> = {};
        for (const r of SCHEMA_ROLES[s.schema]) pl[r] = r === s.unknown ? '?' : val(s, r);
        expect(checkModel(s, pl, p.extras).ok).toBe(true);
      }
    }
  });
});
