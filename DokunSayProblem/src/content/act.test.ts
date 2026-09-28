import { describe, expect, it } from 'vitest';
import type { ActScript, ErrorClass, Grade, Problem, Role, SchemaStep } from './types';
import { LANGS, SCHEMA_ROLES } from './types';
import { generateProblem } from './generate';
import { combosFor } from './curriculum';
import { val } from './relations';
import { unsolvableFor } from './unsolvable';
import { actScriptFor, askValue, beatPrompt, checkActState, expectedAfter, expectedGroupsAfter, inferStrategy } from './act';
import type { ActEvent } from './act';
import { feedbackFor, hintFor, selfTalk } from './hints';

const SEEDS = 100;
// generate.test.ts'teki Türkçe yasak örüntüler (ek uyumu + biçim).
const BAD = [/[bcçdfgğhjklmnprsştvyz]'n[ıiuü]n\b/i, /[aıou]'nin\b/, /[eiöü]'nın\b/, /Ali'nın/, /Ela'nin/, /Kerem'ya/, /kat fazla/, / {2}/, /\s[.,?!]/];
const JUNK = /undefined|NaN|\[object/;

/** Gizli kutu kapalı mı? (mystery ≤ i < ask 'box') */
function closedAt(script: ActScript, i: number): Set<string> {
  const out = new Set<string>();
  script.beats.forEach((b, m) => {
    if (b.kind !== 'mystery' || m > i) return;
    const a = script.beats.findIndex((x, k) => k > m && x.kind === 'ask' && x.read === 'box' && x.zone === b.zone);
    if (a < 0 || i < a) out.add(b.zone);
  });
  return out;
}

function expectedFinal(st: SchemaStep): number {
  if (st.remainder) return st.remainder.interpret === 'remainderIsAnswer' ? st.remainder.value : val(st, st.unknown);
  return val(st, st.unknown);
}

function checkScript(p: Problem, script: ActScript, lang: 'tr' | 'ku' | 'en'): string[] {
  const errs: string[] = [];
  const st = p.steps[script.step];
  const n = p.text[lang].length;
  const roles = SCHEMA_ROLES[st.schema] as readonly Role[];
  const extraVals = new Set(p.extras.map((x) => x.value));
  const stepVals = new Set(st.quantities.map((q) => q.value));
  if (!script.beats.length || script.beats[script.beats.length - 1].kind !== 'ask') errs.push('son vuruş ask değil');
  script.beats.forEach((b, i) => {
    if (!Number.isInteger(b.sentence) || b.sentence < 0 || b.sentence >= n) errs.push(`cümle ${b.sentence}/${n}`);
    if ('role' in b && !roles.includes(b.role)) errs.push(`rol ${b.role}`);
    if ((b.kind === 'place' || b.kind === 'add' || b.kind === 'remove') && (!stepVals.has(b.amount) || (extraVals.has(b.amount) && !stepVals.has(b.amount)))) errs.push(`miktar ${b.amount}`);
    for (const z of [('zone' in b ? b.zone : null), ...('from' in b && typeof b.from === 'string' ? [b.from] : []), ...('to' in b && b.to ? [b.to] : [])]) {
      if (z && !script.zones.some((x) => x.id === z)) errs.push(`bölge ${z}`);
    }
    // zincir tutarlılığı: ekle/koy/çıkar farkı = miktar
    const now = expectedAfter(script, i);
    const prev = i > 0 ? expectedAfter(script, i - 1) : Object.fromEntries(script.zones.map((z) => [z.id, 0]));
    const closed = closedAt(script, i);
    if ((b.kind === 'add' || (b.kind === 'place' && script.zones.find((z) => z.id === b.zone)?.kind !== 'group')) && now[b.zone] - prev[b.zone] !== b.amount) errs.push(`zincir ${b.kind}`);
    if (b.kind === 'remove' && !closed.has(b.zone) && prev[b.zone] - now[b.zone] !== b.amount) errs.push('zincir remove');
    if (Object.values(now).some((x) => x < 0)) errs.push('negatif bölge');
    // denetim: beklenen durum kabul, ±1 ret
    const groups = Object.values(expectedGroupsAfter(script, i))[0];
    if (!checkActState(script, i, now, groups ? { groups } : undefined).ok) errs.push(`doğru durum reddedildi @${i}`);
    for (const z of script.zones) {
      if (closed.has(z.id)) continue;
      for (const d of [1, -1]) {
        if (now[z.id] + d < 0) continue;
        const r = checkActState(script, i, { ...now, [z.id]: now[z.id] + d });
        if (r.ok || r.error !== 'actMismatch' || !r.hint?.tr) errs.push(`±1 kabul @${i} ${z.id}`);
      }
    }
    if (groups && groups.length > 1 && groups[0] > 0) {
      const g2 = [...groups]; g2[0] += 1; g2[1] -= 1;
      if (checkActState(script, i, now, { groups: g2 }).ok) errs.push('eşit olmayan gruplar kabul');
    }
    // yönerge
    const bp = beatPrompt(script, b, p, lang);
    for (const l of LANGS) if (!bp[l].trim() || JUNK.test(bp[l])) errs.push(`yönerge ${l}: ${bp[l]}`);
    for (const re of BAD) if (re.test(bp.tr)) errs.push(`TR yasak ${re}: ${bp.tr}`);
  });
  const last = script.beats.length - 1;
  const got = askValue(script, last);
  if (got !== expectedFinal(st)) errs.push(`ask ${got}≠${expectedFinal(st)}`);
  if (script.step === p.steps.length - 1 && !st.remainder && got !== p.answer) errs.push(`cevap ${got}≠${p.answer}`);
  const left = script.beats.findIndex((b) => b.kind === 'ask' && b.read === 'leftover');
  if (st.remainder && askValue(script, left) !== st.remainder.value) errs.push('kalan');
  if (!st.remainder && left >= 0) errs.push('kalansızda leftover');
  for (const z of script.zones) for (const l of LANGS) if (!z.label[l]?.trim() || JUNK.test(z.label[l])) errs.push(`etiket ${z.id}`);
  const mx = Math.max(...st.quantities.map((q) => q.value));
  const expU = mx <= 20 ? 1 : mx <= 100 ? 2 : 3;
  if (script.units.length !== expU) errs.push('birimler');
  return errs;
}

function infeasibleOk(p: Problem, st: SchemaStep): boolean {
  const v = (r: Role) => val(st, r);
  return !!p.unsolvable || st.variant === 'fraction' || st.quantities.some((q) => q.value > 1000)
    || (!!st.remainder && v('total') > 100)
    || (st.schema === 'equalGroups' && (v('total') > 100 || v('groups') > 10))
    || (st.schema === 'multCompare' && v('compared') > 100);
}

const rate: Record<number, [number, number]> = {};

describe('Canlandır betiği: sınıf × şema × alt tür × bilinmeyen × 100 tohum', () => {
  for (const grade of [1, 2, 3, 4] as Grade[]) {
    for (const c of combosFor(grade)) {
      it(`${grade}. sınıf ${c.schema}/${c.variant}/${c.unknown}`, () => {
        const fails: string[] = [];
        for (let seed = 1; seed <= SEEDS; seed++) {
          const p = generateProblem({ grade, schema: c.schema, variant: c.variant, unknown: c.unknown, seed });
          const r = (rate[grade] ??= [0, 0]);
          for (const lang of LANGS) {
            const s = actScriptFor(p, lang);
            if (lang === 'tr') { r[1]++; if (s.feasible) r[0]++; }
            if (JSON.stringify(s) !== JSON.stringify(actScriptFor(p, lang))) fails.push('deterministik değil');
            if (!s.feasible) {
              if (!infeasibleOk(p, p.steps[0])) fails.push(`seed ${seed} gereksiz feasible=false`);
              if (s.beats.length) fails.push('infeasible ama vuruş var');
              continue;
            }
            const e = checkScript(p, s, lang);
            if (e.length) fails.push(`seed ${seed} ${lang}: ${e.slice(0, 3).join(' | ')}`);
          }
          for (const lv of [1, 2, 3, 4] as const) {
            const h = hintFor(p, 'act', lv);
            for (const l of LANGS) if (!h[l].trim() || JUNK.test(h[l])) fails.push(`ipucu H${lv} ${l}`);
            for (const re of BAD) if (re.test(h.tr)) fails.push(`ipucu TR yasak ${re}: ${h.tr}`);
          }
        }
        expect(fails.slice(0, 5)).toEqual([]);
      });
    }
  }
  it('sınıf bazında feasible oranı (rapor)', () => {
    const lines = Object.entries(rate).map(([g, [ok, all]]) => `${g}. sınıf: ${ok}/${all} = ${((100 * ok) / all).toFixed(1)}%`);
    console.log(`[act] feasible oranı\n${lines.join('\n')}`);
    expect(lines.length).toBe(4);
  });
});

describe('Canlandır: zincir, tablo, gereksiz bilgi, çözülemez', () => {
  it('iki adımlı: her iki halka canlandırılabilir ya da gerekçeli atlanır', () => {
    const fails: string[] = [];
    for (const grade of [2, 3, 4] as Grade[]) for (const M of [2, 3] as const) for (let seed = 1; seed <= 60; seed++) {
      const p = generateProblem({ grade, axes: { M }, seed });
      for (const si of [0, 1]) for (const lang of LANGS) {
        const s = actScriptFor(p, lang, si);
        if (s.step !== si) fails.push('step');
        if (!s.feasible) { if (!infeasibleOk(p, p.steps[si])) fails.push(`gereksiz infeasible ${grade}/${M}/${seed}/${si}`); continue; }
        const e = checkScript(p, s, lang);
        if (e.length) fails.push(`${grade} M${M} seed ${seed} step ${si} ${lang}: ${e.slice(0, 2).join(' | ')}`);
      }
    }
    expect(fails.slice(0, 5)).toEqual([]);
  });
  it('tablo ve gereksiz bilgi: extras hiçbir vuruşa girmez', () => {
    const fails: string[] = [];
    for (const grade of [2, 3, 4] as Grade[]) for (const axes of [{ P: 1 as const }, { I: 1 as const }, { I: 2 as const }]) for (let seed = 1; seed <= 60; seed++) {
      const p = generateProblem({ grade, axes, seed });
      const s = actScriptFor(p);
      if (!s.feasible) continue;
      const js = JSON.stringify(s.beats);
      if (/extra\d/.test(js)) fails.push('extra kimliği vuruşta');
      const e = checkScript(p, s, 'tr');
      if (e.length) fails.push(`${grade} ${JSON.stringify(axes)} seed ${seed}: ${e.slice(0, 2).join(' | ')}`);
    }
    expect(fails.slice(0, 5)).toEqual([]);
  });
  it('çözülemez madde → feasible=false', () => {
    for (let seed = 1; seed <= 20; seed++) expect(actScriptFor(unsolvableFor(2, seed)).feasible).toBe(false);
  });
});

describe('Canlandır: örnek yönergeler ve strateji', () => {
  const find = (pred: (p: Problem) => boolean, spec: Parameters<typeof generateProblem>[0]) => {
    for (let seed = 1; seed < 400; seed++) { const p = generateProblem({ ...spec, seed }); if (pred(p)) return p; }
    throw new Error('bulunamadı');
  };
  it('paylaştırma: "… birer birer paylaştır." ve grup sayısı', () => {
    const p = find((q) => q.steps[0].quantities[0].unit.tr === 'tabak' && !q.steps[0].remainder, { grade: 2, schema: 'equalGroups', variant: 'partitive', unknown: 'perGroup' });
    const s = actScriptFor(p);
    const deal = s.beats.find((b) => b.kind === 'deal')!;
    const tr = beatPrompt(s, deal, p).tr;
    expect(tr).toMatch(/^\d+ \S+ \d+ tabağa birer birer paylaştır\.$/);
    expect(s.zones.find((z) => z.kind === 'group')?.count).toBe(val(p.steps[0], 'groups'));
  });
  it('değişim/join sonuç bilinmiyor: kişi bölgesi ve yönergeler', () => {
    const p = find((q) => p0(q).includes('verdi'), { grade: 1, schema: 'change', variant: 'join', unknown: 'result' });
    const s = actScriptFor(p);
    expect(s.zones[0].label.tr).toBe(p.people[0]);
    expect(beatPrompt(s, s.beats[0], p).tr).toMatch(/^\p{Lu}\p{Ll}+'n?[ıiuü]n bölgesine \d+ \S+ koy\.$/u);
    expect(beatPrompt(s, s.beats[2], p).tr).toBe('Şimdi say: kaç tane oldu?');
  });
  it('gizli kutu: hedef sayı yönergede, cevap değil', () => {
    const p = find(() => true, { grade: 2, schema: 'change', variant: 'join', unknown: 'change' });
    const s = actScriptFor(p);
    const ask = s.beats[s.beats.length - 1];
    const tr = beatPrompt(s, ask, p).tr;
    expect(tr).toContain(`toplam ${val(p.steps[0], 'result')} olana kadar`);
    expect(s.beats.find((b) => b.kind === 'mystery')).toMatchObject({ target: val(p.steps[0], 'result') });
  });
  it('inferStrategy', () => {
    const p = find(() => true, { grade: 1, schema: 'change', variant: 'join', unknown: 'result' });
    const s = actScriptFor(p);
    const ev = (kind: ActEvent['kind'], amount: number, zone = 'main', unit: ActEvent['unit'] = 'one'): ActEvent => ({ kind, amount, unit, zone, t: 0 });
    expect(inferStrategy([ev('add', 1), ev('add', 1)], s, 1)).toBe('countOn');
    const start = val(p.steps[0], 'start');
    expect(inferStrategy([ev('remove', start), ev('add', 1), ev('add', 1)], s, 1)).toBe('countAll');
    expect(inferStrategy([ev('add', 1, 'main', 'ten')], s, 1)).toBe('useTens');
    expect(inferStrategy([], s, 1)).toBeNull();
    const d = actScriptFor(find(() => true, { grade: 2, schema: 'equalGroups', variant: 'partitive', unknown: 'perGroup' }));
    const di = d.beats.findIndex((b) => b.kind === 'deal');
    expect(inferStrategy([ev('deal', 1, 'groups'), ev('deal', 1, 'groups')], d, di)).toBe('dealOneByOne');
    const size = expectedGroupsAfter(d, di).groups[0];
    expect(inferStrategy([ev('deal', size, 'groups')], d, di)).toBe(size > 1 ? 'groupAtOnce' : 'dealOneByOne');
    const m = actScriptFor(find(() => true, { grade: 2, schema: 'change', variant: 'join', unknown: 'change' }));
    const mi = m.beats.length - 1;
    expect(inferStrategy([ev('add', 3, 'box'), ev('remove', 1, 'box'), ev('add', 1, 'box')], m, mi)).toBe('guessCheck');
    expect(inferStrategy([ev('add', 1, 'box'), ev('add', 1, 'box')], m, mi)).toBe('countOn');
  });
});

const p0 = (p: Problem) => p.text.tr.map((s) => s.segments.map((g) => g.text).join('')).join(' ');

describe('Canlandır: ipucu / geri bildirim / öz-sorgu', () => {
  it('feedbackFor her hata sınıfında ve act doğruda dolu döner', () => {
    const p = generateProblem({ grade: 2, seed: 3 });
    const kinds: ('correct' | ErrorClass)[] = ['correct', 'schemaId', 'modelPlacement', 'unknownPlacement', 'irrelevantUsed', 'reversal', 'textOrderOp', 'operation', 'computation', 'unitOrRemainder', 'unsolvableMissed', 'actMismatch'];
    for (const k of kinds) for (const step of ['act', 'model', 'answer'] as const) {
      const f = feedbackFor(k, p, step);
      for (const l of LANGS) expect(f[l].trim().length).toBeGreaterThan(0);
    }
    expect(feedbackFor('correct', p, 'act').tr).toMatch(/canlandırdın/);
    expect(feedbackFor('actMismatch', p, 'act').tr).toMatch(/Cümleyi bir daha dinleyelim/);
  });
  it('selfTalk.act üç dilde', () => {
    for (const k of ['say', 'ask', 'check'] as const) for (const l of LANGS) expect(selfTalk.act[k][l].trim().length).toBeGreaterThan(0);
  });
});
