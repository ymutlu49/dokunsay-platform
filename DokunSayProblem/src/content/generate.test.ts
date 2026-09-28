import { describe, expect, it } from 'vitest';
import type { Axes, Grade, Lang, Problem, Role, SchemaStep } from './types';
import { LANGS, SCHEMA_ROLES } from './types';
import { generateProblem, generateSet } from './generate';
import { combosFor, validateProblem, GRADE_RULES } from './curriculum';
import { checkModel, equationOf } from './evaluate';
import { evalEquation, holds, val } from './relations';
import type { Tok } from './relations';
import { sentenceText, storyText } from './text';
import { wordCount } from './grammar/tr';

const SEEDS = 200;
// Ek uyumunun genel denetimi validateProblem → trTextIssues'ta (her ad/sayı ekini yeniden hesaplar);
// burada ek olarak bilinen yanlış biçim örnekleri ve biçim hataları.
const BAD = [/[bcçdfgğhjklmnprsştvyz]'n[ıiuü]n\b/i, /[aıou]'nin\b/, /[eiöü]'nın\b/, /Ali'nın/, /Ela'nin/, /Kerem'ya/, /kat fazla/, / {2}/, /\s[.,?!]/];

function checkChips(p: Problem): string[] {
  const errs: string[] = [];
  const last = p.steps.length - 1;
  const linked = new Set<string>();
  p.steps.forEach((s, i) => Object.entries(s.links ?? {}).forEach(([, l]) => l && l.role === p.steps[l.step].unknown && linked.add(`${l.step}:${l.role}`)));
  const required = new Set<string>();
  p.steps.forEach((s, i) => {
    for (const q of s.quantities) {
      if (q.role === s.unknown) continue;
      if (i > 0 && s.links?.[q.role]) continue;
      required.add(`${i}:${q.role}`);
    }
  });
  for (const lang of LANGS) {
    const seen = new Set<string>();
    for (const s of p.text[lang]) for (const g of s.segments) if (g.kind === 'qty') {
      const si = g.step ?? 0;
      if (g.ref.startsWith('extra')) { if (!p.extras.some((x) => x.id === g.ref)) errs.push(`${lang} extra`); continue; }
      const st = p.steps[si];
      if (!st || !st.quantities.some((q) => q.role === g.ref)) errs.push(`${lang} ref ${g.ref}`);
      if (st?.unknown === g.ref) errs.push(`${lang} unknown shown`);
      seen.add(`${si}:${g.ref}`);
    }
    for (const r of p.table?.rows ?? []) if (!r.ref.startsWith('extra')) seen.add(`${r.step ?? 0}:${r.ref}`);
    for (const r of required) if (!seen.has(r)) errs.push(`${lang} missing chip ${r}`);
  }
  void last; void linked;
  return errs;
}

function relationOk(s: SchemaStep): boolean {
  const v = (r: Role) => val(s, r);
  switch (s.schema) {
    case 'change': return s.variant === 'join' ? v('start') + v('change') === v('result') : v('start') - v('change') === v('result');
    case 'combine': return v('part1') + v('part2') === v('whole');
    case 'compare': return v('larger') - v('smaller') === v('difference');
    case 'equalGroups': return v('groups') * v('perGroup') + (s.remainder?.value ?? 0) === v('total');
    case 'multCompare': return s.variant === 'fraction' ? v('compared') * v('factor') === v('reference') : v('reference') * v('factor') === v('compared');
  }
}

describe('her sınıf × şema × alt tür × bilinmeyen × 200 tohum', () => {
  for (const grade of [1, 2, 3, 4] as Grade[]) {
    for (const c of combosFor(grade)) {
      it(`${grade}. sınıf ${c.schema}/${c.variant}/${c.unknown}`, () => {
        const fails: string[] = [];
        for (let seed = 1; seed <= SEEDS; seed++) {
          const p = generateProblem({ grade, schema: c.schema, variant: c.variant, unknown: c.unknown, seed });
          const s = p.steps[0];
          const errs = validateProblem(p);
          if (s.schema !== c.schema || s.variant !== c.variant || s.unknown !== c.unknown) errs.push('istenen birleşim değil');
          if (!holds(s) || !relationOk(s)) errs.push('bağıntı');
          // cevap
          const q = val(s, s.unknown);
          const expAns = s.remainder ? (s.remainder.interpret === 'roundUp' ? q + 1 : s.remainder.interpret === 'roundDown' ? q : s.remainder.value) : q;
          if (p.answer !== expAns) errs.push(`cevap ${p.answer}≠${expAns}`);
          // model: doğru kabul, bir kutu bozulunca ret
          const good: Partial<Record<Role, number | '?'>> = {};
          for (const r of SCHEMA_ROLES[s.schema]) good[r] = r === s.unknown ? '?' : val(s, r);
          if (!checkModel(s, good, p.extras).ok) errs.push('model doğru reddedildi');
          const known = SCHEMA_ROLES[s.schema].find((r) => r !== s.unknown)!;
          const bad = { ...good, [known]: (good[known] as number) + 1 };
          if (checkModel(s, bad, p.extras).ok) errs.push('model yanlış kabul edildi');
          // denklemler
          const eq = equationOf(s);
          for (const a of [eq.tokens, ...eq.alternatives]) {
            const x = s.remainder ? q : q;
            const okEq = s.remainder ? Math.floor(Number(a[0] === '?' ? a[2] : a[0]) / Number(a[0] === '?' ? a[4] : a[2])) === x : evalEquation(a as Tok[], x);
            if (!okEq) errs.push(`denklem ${a.join(' ')}`);
            if (a.filter((t) => t === '?').length !== 1) errs.push('denklemde tek ? yok');
            if (a.includes('-' as never)) errs.push('eksi U+2212 değil');
          }
          errs.push(...checkChips(p));
          // Türkçe yasak örüntüler + cümle uzunluğu
          const trText = storyText(p.text.tr) + ' ' + p.answerSentence.tr;
          for (const re of BAD) if (re.test(trText)) errs.push(`TR yasak: ${re} → ${trText}`);
          for (const sen of p.text.tr) if (wordCount(sentenceText(sen)) > GRADE_RULES[grade].maxWords) errs.push(`uzun: ${sentenceText(sen)}`);
          for (const lang of LANGS) if (!p.text[lang].length || p.text[lang].some((x) => !sentenceText(x).trim())) errs.push(`${lang} boş`);
          if (errs.length) fails.push(`seed ${seed}: ${errs.slice(0, 3).join(' | ')}`);
        }
        expect(fails.slice(0, 5)).toEqual([]);
      });
    }
  }

});

describe('eksenler', () => {
  const cases: [Grade, Partial<Axes>][] = [
    [2, { I: 1 }], [3, { I: 2 }], [4, { I: 2 }], [2, { M: 2 }], [3, { M: 2 }], [2, { M: 3 }], [3, { M: 3 }], [4, { M: 3 }],
    [2, { P: 1 }], [3, { P: 1 }], [4, { P: 1 }], [2, { L: 1 }], [3, { L: 1 }], [4, { L: 1 }], [4, { N: 5 }], [1, { N: 1 }],
  ];
  for (const [grade, axes] of cases) {
    it(`${grade}. sınıf ${JSON.stringify(axes)}`, () => {
      const fails: string[] = [];
      for (let seed = 1; seed <= 150; seed++) {
        const p = generateProblem({ grade, axes, seed });
        const errs = validateProblem(p);
        for (const [k, v] of Object.entries(axes)) if (k !== 'N' && (p.axes as unknown as Record<string, number>)[k] !== v) errs.push(`eksen ${k}=${(p.axes as unknown as Record<string, number>)[k]}`);
        if (axes.I) { if (p.extras.length !== axes.I) errs.push('extras sayısı'); }
        if (axes.M && axes.M > 1) { if (p.steps.length !== 2 || !p.steps[1].links) errs.push('zincir'); if (p.answer !== val(p.steps[1], p.steps[1].unknown)) errs.push('zincir cevap'); p.steps.forEach((s) => { if (!relationOk(s)) errs.push('zincir bağıntı'); }); }
        if (axes.P) { if (!p.table || p.table.rows.length < 3) errs.push('tablo'); if (!sentenceText(p.text.tr[0]).includes('Fiyat listesine bak')) errs.push('tablo cümlesi'); }
        if (axes.L) { const s = p.steps[0]; if (s.unknown !== s.referent) errs.push('tutarsız değil'); }
        errs.push(...checkChips(p));
        if (errs.length) fails.push(`seed ${seed}: ${errs.slice(0, 3).join(' | ')}`);
      }
      expect(fails.slice(0, 5)).toEqual([]);
    });
  }
});

describe('tohum ve setler', () => {
  it('aynı tohum → aynı problem', () => {
    for (const grade of [1, 2, 3, 4] as Grade[]) for (let seed = 0; seed < 30; seed++) {
      const a = generateProblem({ grade, seed });
      const b = generateProblem({ grade, seed });
      expect(JSON.stringify(a)).toBe(JSON.stringify(b));
    }
  });
  it('tohumsuz üretim tohumu doldurur ve yeniden üretilebilir', () => {
    const p = generateProblem({ grade: 2 });
    expect(Number.isInteger(p.seed)).toBe(true);
    expect(JSON.stringify(generateProblem({ grade: 2, seed: p.seed }))).toBe(JSON.stringify(p));
  });
  it('exclude aynı id\'yi döndürmez', () => {
    const p = generateProblem({ grade: 2, seed: 7 });
    const q = generateProblem({ grade: 2, seed: 7, exclude: [p.id] });
    expect(q.id).not.toBe(p.id);
    expect(validateProblem(q)).toEqual([]);
  });
  it('generateSet tekrarsız, bloklu ve karışık', () => {
    for (const grade of [1, 2, 3, 4] as Grade[]) {
      const block = generateSet({ grade, schemas: ['change', 'combine'], count: 12, seed: 42 });
      expect(block.length).toBe(12);
      expect(new Set(block.map((p) => storyText(p.text.tr))).size).toBe(12);
      expect(block.slice(0, 6).every((p) => p.steps[0].schema === 'change')).toBe(true);
      const mixed = generateSet({ grade, count: 15, mixed: true, seed: 9 });
      expect(new Set(mixed.map((p) => p.id)).size).toBe(mixed.length);
      expect(new Set(mixed.map((p) => p.steps[p.steps.length - 1].schema)).size).toBeGreaterThan(1);
      for (const p of [...block, ...mixed]) expect(validateProblem(p)).toEqual([]);
    }
  });
  it('şablon çeşitliliği: her birleşimde en az 3 farklı çerçeve/kalıp', () => {
    for (const grade of [2, 3] as Grade[]) for (const c of combosFor(grade)) {
      const shapes = new Set<string>();
      for (let seed = 1; seed <= 80; seed++) {
        const p = generateProblem({ grade, schema: c.schema, variant: c.variant, unknown: c.unknown, seed });
        shapes.add(p.text.tr.map((s) => s.segments.filter((g) => g.kind === 'text').map((g) => g.text.replace(/\p{Lu}\p{Ll}+'?\p{L}*/gu, 'X')).join('#')).join('|').slice(0, 60) + p.context);
      }
      expect(shapes.size, `${grade} ${c.schema}/${c.variant}/${c.unknown}`).toBeGreaterThanOrEqual(3);
    }
  });
  it('cevap cümlesi {x} kalıbı 3 dilde', () => {
    const p = generateProblem({ grade: 3, seed: 5 });
    for (const l of LANGS as readonly Lang[]) expect(p.answerSentence[l]).toContain('{x}');
  });
});
