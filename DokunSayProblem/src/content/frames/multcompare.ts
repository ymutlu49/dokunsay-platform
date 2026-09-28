/**
 * KAT KARŞILAŞTIRMASI çerçeveleri (`times` 3. sınıftan, `fraction` birim kesir 4. sınıf).
 * Bilinmeyen: karşılaştırılan (U0), kat (U1, yalnız times), referans (U2 — TUTARSIZ dil:
 * "katı" ama bölme / "üçte biri" ama çarpma). "3 kat fazla" YASAK (04 §D.3 kural 10) — "3 katı".
 */
import type { L10n, Lang, Sentence, Segment } from '../types';
import type { Part } from '../text';
import { S, Q } from '../text';
import type { Frame } from './types';
import { helpers, L, unitOf } from './types';
import * as g from '../grammar/tr';

const LANGS: Lang[] = ['tr', 'ku', 'en'];
const FRAC: Record<number, { tr: string; ku: string; en: string }> = {
  2: { tr: 'yarısı', ku: 'nîvê', en: 'half' },
  3: { tr: 'üçte biri', ku: 'sêyeka', en: 'one third' },
  4: { tr: 'dörtte biri', ku: 'çareka', en: 'one quarter' },
  5: { tr: 'beşte biri', ku: 'pêncyeka', en: 'one fifth' },
};

const have: Frame = {
  id: 'mult.have', context: 'play', schema: 'multCompare',
  variants: ['times', 'fraction'], minGrade: 3, unitKind: 'count',
  objs: ['misket', 'ceviz', 'kart', 'kalem', 'kitap', 'fidan'], maxWhole: 999,
  render(fi) {
    const h = helpers(fi);
    const frac = fi.step.variant === 'fraction';
    // Kişiler: R = referans sahibi, K = karşılaştırılan sahibi.
    const R = fi.A, K = fi.B;
    const gR = g.nameGen(R.tr), gK = g.nameGen(K.tr);
    const k = h.v('factor');
    const fr = FRAC[k] ?? FRAC[2];
    const T = { tr: h.t, ku: h.k, en: h.e };
    const text = {} as Record<Lang, Sentence[]>;
    const answer = {} as L10n;
    for (const lang of LANGS) {
      const q = T[lang];
      /** Birim kesir sözcüğü de bir çiptir (ref: factor; metni "yarısı", "üçte biri"). */
      const F = () => q('factor', () => fr[lang]);
      let out: Part[][] = [];
      let ask: Part[] = [];
      let ans = '';
      if (lang === 'tr') {
        const plGen = `${h.oPPl}n${g.h4(g.lastVowel(h.oPPl))}n`;
        const hasR = (x: Segment): Part[] => [gR, ' ', x, ' ', h.oP, ' var.'];
        const hasK = (x: Segment): Part[] => [gK, ' ', x, ' ', h.oP, ' var.'];
        const rel = frac ? [gK, ' ', h.oPPl, ', ', g.nameKiGen(R.tr), ' ', F(), '.'] : [gK, ' ', h.oPPl, ', ', g.nameKiGen(R.tr), ' ', q('factor'), ' katı.'];
        if (h.u === 'compared') { out = [hasR(q('reference')), rel]; ask = [gK, ' kaç ', h.oP, ' var?']; ans = `${gK} {x} ${h.oP} var.`; }
        else if (h.u === 'factor') {
          out = [hasK(q('compared')), hasR(q('reference'))];
          ask = [gK, ' ', h.oPPl, ', ', g.nameKiGen(R.tr), ' kaç katı?']; ans = `${gK} ${h.oPPl}, ${g.nameKiGen(R.tr)} {x} katı.`;
        } else {
          out = [hasK(q('compared')), frac ? ['Bu sayı, ', gR, ' ', plGen, ' ', F(), '.'] : ['Bu sayı, ', gR, ' ', plGen, ' ', q('factor'), ' katı.']];
          ask = [gR, ' kaç ', h.oP, ' var?']; ans = `${gR} {x} ${h.oP} var.`;
        }
      } else if (lang === 'ku') {
        // KU-DENETİM: "… carê …" (kat) ve "nîvê / sêyeka …" (birim kesir) kalıpları.
        const hasR = (x: Segment): Part[] => [R.kuObl, ' ', x, ' ', h.ko, ' hene.'];
        const hasK = (x: Segment): Part[] => [K.kuObl, ' ', x, ' ', h.ko, ' hene.'];
        const rel: Part[] = frac
          ? ['Hejmara ', h.koEz, ' ', K.kuObl, ' ', F(), ' hejmara ', h.koEz, ' ', R.kuObl, ' ye.']
          : ['Hejmara ', h.koEz, ' ', K.kuObl, ' ', q('factor'), ' carê hejmara ', h.koEz, ' ', R.kuObl, ' ye.'];
        if (h.u === 'compared') { out = [hasR(q('reference')), rel]; ask = [K.kuObl, ' çend ', h.ko, ' hene?']; ans = `${K.kuObl} {x} ${h.ko} hene.`; }
        else if (h.u === 'factor') {
          out = [hasK(q('compared')), hasR(q('reference'))];
          ask = ['Hejmara ', h.koEz, ' ', K.kuObl, ' çend carê ya ', R.kuObl, ' ye?']; ans = `Hejmara ${h.koEz} ${K.kuObl} {x} carê ya ${R.kuObl} ye.`;
        } else {
          out = [hasK(q('compared')), rel];
          ask = [R.kuObl, ' çend ', h.ko, ' hene?']; ans = `${R.kuObl} {x} ${h.ko} hene.`;
        }
      } else {
        const hasR = (x: Segment): Part[] => [R.en, ' has ', x, ' ', h.eo, '.'];
        const hasK = (x: Segment): Part[] => [K.en, ' has ', x, ' ', h.eo, '.'];
        const rel: Part[] = frac ? [K.en, ' has ', F(), ' as many ', h.eo, ' as ', R.en, '.'] : [K.en, ' has ', q('factor'), ' times as many ', h.eo, ' as ', R.en, '.'];
        if (h.u === 'compared') { out = [hasR(q('reference')), rel]; ask = ['How many ', h.eo, ' does ', K.en, ' have?']; ans = `${K.en} has {x} ${h.eo}.`; }
        else if (h.u === 'factor') {
          out = [hasK(q('compared')), hasR(q('reference'))];
          ask = ['How many times as many ', h.eo, ' as ', R.en, ' does ', K.en, ' have?']; ans = `${K.en} has {x} times as many ${h.eo} as ${R.en}.`;
        } else {
          out = [hasK(q('compared')), rel];
          ask = ['How many ', h.eo, ' does ', R.en, ' have?']; ans = `${R.en} has {x} ${h.eo}.`;
        }
      }
      text[lang] = [...out.map((p) => S(...p)), Q(...ask)];
      answer[lang] = ans;
    }
    return {
      text, answer, unit: unitOf(fi.obj),
      labels: {
        reference: L(R.tr, R.ku, R.en),
        factor: frac ? L('kesir', 'parjimar', 'fraction') : L('kat', 'car', 'times'),
        compared: L(K.tr, K.ku, K.en),
      },
    };
  },
};

/** Ağaçlar / tarla (yerler; kişi yok) — 3. sınıftan. */
const trees: Frame = {
  id: 'mult.trees', context: 'village', schema: 'multCompare',
  variants: ['times', 'fraction'], minGrade: 3, unitKind: 'count',
  objs: ['elma', 'armut'], maxWhole: 999,
  render(fi) {
    const h = helpers(fi);
    const frac = fi.step.variant === 'fraction';
    const k = h.v('factor');
    const fr = FRAC[k] ?? FRAC[2];
    // times: büyük ağaç = karşılaştırılan; fraction: küçük ağaç = karşılaştırılan.
    const cmp = frac ? { tr: 'Küçük', trl: 'küçük', ku: 'biçûk', en: 'small' } : { tr: 'Büyük', trl: 'büyük', ku: 'mezin', en: 'big' };
    const ref = frac ? { tr: 'Büyük', trl: 'büyük', ku: 'mezin', en: 'big' } : { tr: 'Küçük', trl: 'küçük', ku: 'biçûk', en: 'small' };
    const T = { tr: h.t, ku: h.k, en: h.e };
    const text = {} as Record<Lang, Sentence[]>;
    const answer = {} as L10n;
    for (const lang of LANGS) {
      const q = T[lang];
      /** Birim kesir sözcüğü de bir çiptir (ref: factor; metni "yarısı", "üçte biri"). */
      const F = () => q('factor', () => fr[lang]);
      let out: Part[][] = [];
      let ask: Part[] = [];
      let ans = '';
      if (lang === 'tr') {
        const relTail: Part[] = frac ? [' ', F(), ' kadar.'] : [' ', q('factor'), ' katı.'];
        if (h.u === 'compared') {
          out = [[`${ref.tr} ağaçta `, q('reference'), ' ', h.o, ' var.'], [`${cmp.tr} ağaçtaki `, h.o, ' sayısı, bunun', ...relTail]];
          ask = [`${cmp.tr} ağaçta kaç `, h.o, ' var?']; ans = `${cmp.tr} ağaçta {x} ${h.o} var.`;
        } else if (h.u === 'factor') {
          out = [[`${cmp.tr} ağaçta `, q('compared'), ' ', h.o, ' var.'], [`${ref.tr} ağaçta `, q('reference'), ' ', h.o, ' var.']];
          ask = [`${cmp.tr} ağaçtakiler, ${ref.trl} ağaçtakilerin kaç katı?`]; ans = `${cmp.tr} ağaçtakiler, ${ref.trl} ağaçtakilerin {x} katı.`;
        } else {
          out = [[`${cmp.tr} ağaçta `, q('compared'), ' ', h.o, ' var.'], ['Bu sayı, ', `${ref.trl} ağaçtakilerin`, ...(frac ? [' ', F(), '.'] : [' ', q('factor'), ' katı.'])]];
          ask = [`${ref.tr} ağaçta kaç `, h.o, ' var?']; ans = `${ref.tr} ağaçta {x} ${h.o} var.`;
        }
      } else if (lang === 'ku') {
        // KU-DENETİM
        const relK: Part[] = frac ? [F(), ` yên dara ${ref.ku} ye.`] : [q('factor'), ` carê yên dara ${ref.ku} ye.`];
        if (h.u === 'compared') {
          out = [[`Li ser dara ${ref.ku} `, q('reference'), ' ', h.ko, ' hene.'], [`Hejmara ${h.koEz} dara ${cmp.ku} `, ...relK]];
          ask = [`Li ser dara ${cmp.ku} çend `, h.ko, ' hene?']; ans = `Li ser dara ${cmp.ku} {x} ${h.ko} hene.`;
        } else if (h.u === 'factor') {
          out = [[`Li ser dara ${cmp.ku} `, q('compared'), ' ', h.ko, ' hene.'], [`Li ser dara ${ref.ku} `, q('reference'), ' ', h.ko, ' hene.']];
          ask = [`Yên dara ${cmp.ku} çend carê yên dara ${ref.ku} ne?`]; ans = `Yên dara ${cmp.ku} {x} carê yên dara ${ref.ku} ne.`;
        } else {
          out = [[`Li ser dara ${cmp.ku} `, q('compared'), ' ', h.ko, ' hene.'], ['Ev hejmar ', ...relK]];
          ask = [`Li ser dara ${ref.ku} çend `, h.ko, ' hene?']; ans = `Li ser dara ${ref.ku} {x} ${h.ko} hene.`;
        }
      } else {
        const relE: Part[] = frac ? [' ', F(), ` as many as the ${ref.en} tree.`] : [' ', q('factor'), ` times as many as the ${ref.en} tree.`];
        if (h.u === 'compared') {
          out = [[`The ${ref.en} tree has `, q('reference'), ' ', h.eo, '.'], [`The ${cmp.en} tree has`, ...relE]];
          ask = ['How many ', h.eo, ` does the ${cmp.en} tree have?`]; ans = `The ${cmp.en} tree has {x} ${h.eo}.`;
        } else if (h.u === 'factor') {
          out = [[`The ${cmp.en} tree has `, q('compared'), ' ', h.eo, '.'], [`The ${ref.en} tree has `, q('reference'), ' ', h.eo, '.']];
          ask = [`How many times as many ${h.eo} does the ${cmp.en} tree have?`]; ans = `The ${cmp.en} tree has {x} times as many ${h.eo}.`;
        } else {
          out = [[`The ${cmp.en} tree has `, q('compared'), ' ', h.eo, '.'], ['That is', ...relE]];
          ask = ['How many ', h.eo, ` does the ${ref.en} tree have?`]; ans = `The ${ref.en} tree has {x} ${h.eo}.`;
        }
      }
      text[lang] = [...out.map((p) => S(...p)), Q(...ask)];
      answer[lang] = ans;
    }
    return {
      text, answer, unit: unitOf(fi.obj),
      labels: {
        reference: L(`${ref.trl} ağaç`, `dara ${ref.ku}`, `${ref.en} tree`),
        factor: frac ? L('kesir', 'parjimar', 'fraction') : L('kat', 'car', 'times'),
        compared: L(`${cmp.trl} ağaç`, `dara ${cmp.ku}`, `${cmp.en} tree`),
      },
    };
  },
};

export const MULT_FRAMES: Frame[] = [have, trees];
