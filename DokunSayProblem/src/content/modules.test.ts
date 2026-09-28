import { describe, expect, it } from 'vitest';
import type { FlowStepId, Grade, L10n, Lang } from './types';
import { LANGS } from './types';
import {
  generateProblem, hintFor, feedbackFor, selfTalk, SCHEMA_META, ROLE_LABEL, VOCAB, vocabInSentence, MISCONCEPTIONS, LADDER,
  paraphraseFor, erroneousSolutionFor, unsolvableFor, reasonableItemsFor, remainderSetFor, wordTrapPairFor,
  posingPrompts, checkPosedProblem, POSING_FRAMES, fillFrame, validateProblem, renderAnswer, sentenceSpeech, sentenceText,
} from './index';
import { val } from './relations';

const full = (x: L10n) => LANGS.every((l) => typeof x[l] === 'string' && x[l].trim().length > 0);
const STEPS: FlowStepId[] = ['read', 'retell', 'question', 'known', 'schema', 'model', 'checkModel', 'estimate', 'equation', 'compute', 'answer', 'reasonable', 'reflect'];
/** "fazla görürsen topla" türü anahtar sözcük → işlem eşlemesi. */
const KEYWORD_RULE = /(^|\s)(fazla|az|kaldı|toplam|daha|more|fewer|left|altogether)(\s|,)[^.?!]{0,25}(\s)(topla|toplarız|çıkar|çıkarırız|çarp|çarparız|böl|böleriz|add|subtract|multiply|divide)(\s|[.,!]|$)/iu;

describe('meta', () => {
  it('SCHEMA_META ve ROLE_LABEL üç dilde dolu, emoji yok', () => {
    for (const m of Object.values(SCHEMA_META)) {
      for (const k of ['name', 'short', 'story', 'rule', 'equation'] as const) expect(full(m[k])).toBe(true);
      expect(m.icon).toMatch(/^[a-zA-Z]+$/);
      expect(m.color).toMatch(/^#[0-9A-F]{6}$/i);
    }
    for (const l of Object.values(ROLE_LABEL)) expect(full(l)).toBe(true);
  });
});

describe('ipuçları ve geri bildirim', () => {
  it('her adım × kademe dolu; cevabı söylemez; anahtar sözcük kuralı yok', () => {
    for (const grade of [1, 2, 3, 4] as Grade[]) for (let seed = 1; seed <= 40; seed++) {
      const p = generateProblem({ grade, seed, axes: { M: 1 } });
      const known = p.steps[0].quantities.filter((q) => q.role !== p.steps[0].unknown).map((q) => q.value);
      for (const st of STEPS) for (const lv of [1, 2, 3, 4] as const) {
        const h = hintFor(p, st, lv);
        expect(full(h)).toBe(true);
        for (const l of LANGS) {
          if (!known.includes(p.answer)) expect(h[l]).not.toMatch(new RegExp(`(^|[^\\d.])${p.answer}([^\\d]|$)`));
          expect(h[l]).not.toMatch(KEYWORD_RULE);
        }
      }
    }
  });
  it('geri bildirim her sınıf için dolu ve suçlamayan', () => {
    const p = generateProblem({ grade: 3, seed: 4 });
    const kinds = ['correct', 'schemaId', 'modelPlacement', 'unknownPlacement', 'irrelevantUsed', 'reversal', 'textOrderOp', 'operation', 'computation', 'unitOrRemainder', 'unsolvableMissed'] as const;
    for (const k of kinds) for (const st of STEPS) {
      const f = feedbackFor(k, p, st);
      expect(full(f)).toBe(true);
      expect(f.tr).not.toMatch(/yanlış yaptın|hata yaptın|aptal|kötü/i);
      expect(f.tr).not.toMatch(KEYWORD_RULE);
    }
  });
  it('öz-sorgu 13 adımda Söyle–Sor–Kontrol', () => {
    for (const st of STEPS) { const t = selfTalk[st]; expect(full(t.say) && full(t.ask) && full(t.check)).toBe(true); }
  });
});

describe('metin yardımcıları', () => {
  it('renderAnswer ve seslendirme', () => {
    const p = generateProblem({ grade: 2, seed: 3 });
    for (const l of LANGS) expect(renderAnswer(p, l, p.answer)).toContain(String(p.answer));
    const ku = p.text.ku[0];
    expect(sentenceSpeech(ku, 'ku')).not.toMatch(/\d/);
    expect(sentenceSpeech({ segments: [{ kind: 'text', text: '8 − 3 = 5' }] }, 'tr')).toBe('8 eksi 3 = 5');
  });
});

describe('sözcükler, yanılgılar, merdiven', () => {
  it('VOCAB açıklamaları işlem önermez; cümlede konum bulunur', () => {
    expect(VOCAB.length).toBeGreaterThanOrEqual(12);
    for (const v of VOCAB) { expect(full(v.word) && full(v.explain) && full(v.example)).toBe(true); expect(v.explain.tr).not.toMatch(/(^|\s)(topla|çıkar|çarp|böl|toplarız|çıkarırız)(\s|[.,]|$)/); }
    const s = { segments: [{ kind: 'text' as const, text: "Can'ın, Ela'dan 3 fazla bilyesi var. Toplam kaç?" }] };
    const hits = vocabInSentence(s, 'tr');
    expect(hits.map((h) => h.id)).toEqual(['more', 'total']);
    expect(sentenceText(s).slice(hits[0].start, hits[0].end)).toBe('fazla');
  });
  it('en az 8 yanılgı, kaynaklı', () => {
    expect(Object.keys(MISCONCEPTIONS).length).toBeGreaterThanOrEqual(8);
    for (const m of Object.values(MISCONCEPTIONS)) { expect(full(m.name) && full(m.teacherNote)).toBe(true); expect(m.source.length).toBeGreaterThan(5); }
  });
  it('merdiven basamakları üretilebilir ve geçerli', () => {
    expect(LADDER.filter((x) => x.id.startsWith('A')).length).toBe(14);
    for (const st of LADDER) for (let seed = 1; seed <= 15; seed++) {
      const p = generateProblem({ grade: st.grade, schema: st.schema === 'mixed' ? undefined : st.schema, variant: st.variant, unknown: st.unknown, axes: st.axes, seed });
      expect(validateProblem(p), `${st.id}`).toEqual([]);
      if (st.schema !== 'mixed' && (st.axes.M ?? 1) === 1) expect(p.steps[0].schema).toBe(st.schema);
    }
  });
});

describe('modüller', () => {
  it('Hikâyeyi Anlat: 3 seçenek, 3 tür', () => {
    for (let seed = 1; seed < 30; seed++) {
      const it2 = paraphraseFor(generateProblem({ grade: 2, seed }));
      expect(it2.options.map((o) => o.kind).sort()).toEqual(['correct', 'differentQuestion', 'reversedRelation']);
      expect(new Set(it2.options.map((o) => o.text.tr)).size).toBe(3);
    }
  });
  it('Hata Dedektifi: 5 adım, tam bir hatalı, 1 doğru gerekçe', () => {
    for (let seed = 1; seed < 40; seed++) {
      const p = generateProblem({ grade: 3, seed, axes: { I: seed % 2 as 0 | 1 } });
      const e = erroneousSolutionFor(p, seed);
      expect(e.steps.map((s) => s.stepId)).toEqual(['schema', 'model', 'equation', 'compute', 'answer']);
      expect(e.steps.filter((s) => s.isError).length).toBe(1);
      expect(e.why.filter((w) => w.correct).length).toBe(1);
      expect(MISCONCEPTIONS[e.misconception]).toBeDefined();
    }
  });
  it('Dedektif Soruları: çözülemez', () => {
    for (const grade of [1, 2, 3, 4] as Grade[]) for (let seed = 0; seed < 20; seed++) {
      const u = unsolvableFor(grade, seed);
      expect(u.unsolvable).toMatch(/nonsense|missingInfo/);
      expect(u.answer).toBe(-1);
      expect(validateProblem(u)).toEqual([]);
      for (const l of LANGS) expect(u.text[l][u.text[l].length - 1].isQuestion).toBe(true);
    }
  });
  it('Makul mü?', () => {
    const items = reasonableItemsFor(3, 5);
    expect(items.length).toBe(4);
    expect(items.filter((i) => i.isReasonable).length).toBe(2);
    for (const i of items) {
      expect(i.reasons.filter((r) => r.correct).length).toBe(1);
      if (i.isReasonable) expect(i.shownAnswer).toBe(i.problem.answer); else expect(i.shownAnswer).not.toBe(i.problem.answer);
    }
  });
  it('Kalanın yorumu: aynı bölme dört bağlam', () => {
    const r = remainderSetFor(3);
    const [a, b] = r.division;
    const byI = Object.fromEntries(r.contexts.map((c) => [c.interpret, c.answer]));
    expect(byI.roundUp).toBe(Math.floor(a / b) + 1);
    expect(byI.roundDown).toBe(Math.floor(a / b));
    expect(byI.remainderIsAnswer).toBe(a % b);
    expect(byI.exact).toBe(a / b);
    for (const c of r.contexts) expect(full(c.text)).toBe(true);
  });
  it('Sözcük Tuzağı: aynı sayılar, biri tutarlı biri tutarsız', () => {
    for (let seed = 0; seed < 15; seed++) {
      const [c, i] = wordTrapPairFor(2, seed);
      expect(c.axes.L).toBe(0);
      expect(i.axes.L).toBe(1);
      for (const r of ['larger', 'smaller', 'difference'] as const) expect(val(c.steps[0], r)).toBe(val(i.steps[0], r));
    }
  });
});

describe('Problem Kurucu', () => {
  it('kalıplar doğru ek uyumuyla dolar', () => {
    expect(fillFrame(POSING_FRAMES.change[0], 'tr', { ad: 'Ela', sayı: 5, nesne: 'kalem' })).toBe("Ela'nın 5 kalemi vardı.");
    expect(fillFrame(POSING_FRAMES.change[0], 'tr', { ad: 'Mîr', sayı: 4, nesne: 'kitap' })).toBe("Mîr'in 4 kitabı vardı.");
    expect(fillFrame(POSING_FRAMES.change[1], 'tr', { ad: 'Ali', ad2: 'Kerem', sayı2: 3, nesne: 'kalem' })).toBe("Ali, Kerem'e 3 kalem verdi.");
    expect(fillFrame(POSING_FRAMES.change[0], 'ku', { ad: 'Rojda', sayı: 5, nesne: 'pênûs' })).toBe('Rojdayê 5 pênûs hebûn.');
    expect(fillFrame(POSING_FRAMES.change[0], 'en', { ad: 'Ela', sayı: 5, nesne: 'pencil' })).toBe('Ela had 5 pencils.');
    expect(fillFrame(POSING_FRAMES.change[0], 'tr', { ad: 'Ela' })).toContain('____');
    for (const fr of Object.values(POSING_FRAMES)) for (const f of fr) expect(full(f)).toBe(true);
  });
  it('çözülebilirlik denetimi', () => {
    const ok = checkPosedProblem({ schema: 'change', sentences: ["Ela'nın 5 kalemi vardı.", "Ela, Can'a 3 kalem verdi.", "Ela'nın kaç kalemi kaldı?"], hasQuestion: true, numbers: [5, 3] }, 'tr');
    expect(ok).toEqual({ solvable: true, issues: [] });
    const noQ = checkPosedProblem({ schema: 'change', sentences: ["Ela'nın 5 kalemi vardı."], hasQuestion: false, numbers: [5] }, 'tr');
    expect(noQ.solvable).toBe(false);
    expect(noQ.issues.length).toBe(2);
    const ku = checkPosedProblem({ schema: 'compare', sentences: ['Rojdayê 5 pênûs hene.', 'Baranî 5 pênûs hene.', 'Çend pênûs?'], hasQuestion: true, numbers: [5, 5] }, 'ku');
    expect(ku.solvable).toBe(false);
  });
  it('dört istem türü', () => {
    const lang: Lang = 'tr';
    const pic = posingPrompts.fromPicture(2, 1); expect(pic.items.length).toBe(2);
    const eq = posingPrompts.fromEquation(2, 1); expect(eq.tokens.filter((t) => t === '?').length).toBe(1);
    const an = posingPrompts.fromAnswer(3, 1); expect(an.answer).toBeGreaterThan(0);
    const cq = posingPrompts.completeQuestion(2, 1);
    expect(cq.problem.text[lang].every((s) => !s.isQuestion)).toBe(true);
    expect(cq.options.some((o) => o.fits)).toBe(true);
  });
});
