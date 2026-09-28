/**
 * Gereksiz bilgi cümleleri (axes.I; 02 §B3 X.IRR). I=1: bir ilgisiz sayı; I=2: iki ilgisiz sayı
 * (biri ilgisiz cümle, biri aynı nesneden başka kişinin sayısı — en güçlü çeldirici).
 */
import type { L10n, Lang, Sentence } from '../types';
import { S, chip } from '../text';
import type { Rng } from '../rng';
import type { Noun, Person } from '../lexicon';
import * as g from '../grammar/tr';
import { L } from './types';

export interface ExtraOut {
  id: `extra${number}`;
  value: number;
  unit: L10n;
  label: L10n;
  text: Record<Lang, Sentence>;
}

type Kind = 'age' | 'fish' | 'floors' | 'trees' | 'sameObj';

/** Aynı nesneden başka kişinin sayısını anlatmanın güvenli olduğu çerçeveler. */
export const SAME_OBJ_OK = new Set(['change.give', 'combine.colors', 'compare.have', 'mult.have', 'combine.together']);

const RANGE: Record<Kind, [number, number]> = { age: [6, 12], fish: [2, 9], floors: [2, 6], trees: [3, 19], sameObj: [2, 19] };

export function makeExtra(kind: Kind, id: `extra${number}`, value: number, C: Person, obj: Noun): ExtraOut {
  const q = (lang: Lang) => chip(id, value, lang);
  switch (kind) {
    case 'age':
      return {
        id, value, unit: L('yaş', 'sal', 'year'), label: L(`${C.tr} yaşı`, `temenê ${C.kuObl}`, `${C.en}'s age`),
        text: { tr: S(C.tr, ' ', q('tr'), ' yaşında.'), ku: S(C.ku, ' ', q('ku'), ' salî ye.'), en: S(C.en, ' is ', q('en'), ' years old.') },
      };
    case 'fish':
      return {
        id, value, unit: L('balık', 'masî', 'fish'), label: L('balıklar', 'masî', 'fish'),
        text: { tr: S(g.nameGen(C.tr), ' ', q('tr'), ' balığı var.'), ku: S(C.kuObl, ' ', q('ku'), ' masî hene.'), en: S(C.en, ' has ', q('en'), ' fish.') },
      };
    case 'floors':
      return {
        id, value, unit: L('kat', 'qat', 'floor'), label: L('okul katları', 'qatên dibistanê', 'school floors'),
        text: { tr: S('Okul binası ', q('tr'), ' katlı.'), ku: S('Avahiya dibistanê ', q('ku'), ' qat e.'), en: S('The school building has ', q('en'), ' floors.') },
      };
    case 'trees':
      return {
        id, value, unit: L('ağaç', 'dar', 'tree'), label: L('bahçedeki ağaçlar', 'darên hewşê', 'trees in the garden'),
        text: { tr: S('Okulun bahçesinde ', q('tr'), ' ağaç var.'), ku: S('Li hewşa dibistanê ', q('ku'), ' dar hene.'), en: S('There are ', q('en'), ' trees in the school garden.') },
      };
    case 'sameObj':
      return {
        id, value, unit: { tr: obj.tr.w, ku: obj.ku.w, en: obj.en.sg }, label: L(`${C.tr}`, C.ku, C.en),
        text: {
          tr: S(g.nameGen(C.tr), ' ', q('tr'), ' ', g.poss3(obj.tr), ' var.'),
          ku: S(C.kuObl, ' ', q('ku'), ' ', obj.ku.w, ' hene.'), // KU-DENETİM
          en: S(C.en, ' has ', q('en'), ' ', obj.en.pl, '.'),
        },
      };
  }
}

/** I düzeyi kadar ilgisiz bilgi üret; değerler `taken` dışında. */
export function makeExtras(rng: Rng, I: 0 | 1 | 2, frameId: string, C: Person, obj: Noun, taken: number[]): ExtraOut[] {
  if (I === 0) return [];
  const kinds: Kind[] = rng.shuffle(['age', 'fish', 'floors', 'trees'] as Kind[]);
  const chosen: Kind[] = I === 2 && SAME_OBJ_OK.has(frameId) ? [kinds[0], 'sameObj'] : kinds.slice(0, I);
  const out: ExtraOut[] = [];
  const used = taken.slice();
  chosen.forEach((k, i) => {
    const [lo, hi] = RANGE[k];
    let v = -1;
    for (let t = 0; t < 60; t++) {
      const c = rng.int(lo, hi);
      if (!used.includes(c)) { v = c; break; }
    }
    if (v < 0) v = Math.max(...used, hi) + 1;
    used.push(v);
    out.push(makeExtra(k, `extra${i}`, v, C, obj));
  });
  return out;
}
