/**
 * Hikâye çerçevesi (frame) sözleşmesi. Bir çerçeve = bir bağlamda bir şemanın üç dilde
 * anlatımı; bilinmeyen rolüne göre farklı cümle dizisi üretir. Çeşitlilik = çerçeve × nesne ×
 * kişi × soru kalıbı × sayı.
 */
import type { ContextId, Grade, L10n, Lang, Role, SchemaId, SchemaStep, SchemaVariant, Segment, Sentence } from '../types';
import type { Noun, NounKey, Person } from '../lexicon';
import { NOUNS } from '../lexicon';
import type { Rng } from '../rng';
import { chip } from '../text';
import * as tr from '../grammar/tr';

export type UnitKind = 'count' | 'money' | 'time' | 'length' | 'liquid';
export type RemInterp = 'roundUp' | 'roundDown' | 'remainderIsAnswer';

export interface FrameInput {
  step: SchemaStep;
  /** Halka indeksi (çiplerin `step` alanı). */
  si: number;
  A: Person;
  B: Person;
  C: Person;
  grade: Grade;
  rng: Rng;
  obj: Noun;
  cont: Noun;
}

export interface FrameOut {
  text: Record<Lang, Sentence[]>;
  answer: L10n;
  unit: L10n;
  labels?: Partial<Record<Role, L10n>>;
}

export interface Frame {
  id: string;
  context: ContextId;
  schema: SchemaId;
  variants: readonly SchemaVariant[];
  /** Desteklenen bilinmeyenler (yoksa şemanın tümü). */
  unknowns?: readonly Role[];
  minGrade: Grade;
  unitKind: UnitKind;
  objs: readonly NounKey[];
  conts?: readonly NounKey[];
  /** Bütün/çarpım üst sınırı (bağlam gerçekçiliği). */
  maxWhole?: number;
  /** Kalanlı bölme desteği (equalGroups): hangi yorumlar. */
  remainders?: readonly RemInterp[];
  /** Yalnız kalanlı bölmede kullanılır. */
  remainderOnly?: boolean;
  render(fi: FrameInput): FrameOut;
}

/** Çerçeve içi kısa yardımcılar. */
export function helpers(fi: FrameInput) {
  const v = (r: Role): number => {
    const q = fi.step.quantities.find((x) => x.role === r);
    if (!q) throw new Error(`rol yok ${r}`);
    return q.value;
  };
  const mk = (lang: Lang) => (r: Role, fmt?: (n: number) => string): Segment =>
    chip(r, v(r), lang, { text: fmt ? fmt(v(r)) : undefined, step: fi.si });
  const o = fi.obj;
  const c = fi.cont;
  return {
    v,
    u: fi.step.unknown,
    is: (r: Role) => fi.step.unknown === r,
    t: mk('tr'),
    k: mk('ku'),
    e: mk('en'),
    A: fi.A,
    B: fi.B,
    C: fi.C,
    // TR ad ekleri
    gA: tr.nameGen(fi.A.tr), gB: tr.nameGen(fi.B.tr), gC: tr.nameGen(fi.C.tr),
    dA: tr.nameDat(fi.A.tr), dB: tr.nameDat(fi.B.tr),
    aA: tr.nameAbl(fi.A.tr), aB: tr.nameAbl(fi.B.tr),
    // TR nesne biçimleri
    o: o.tr.w,
    oP: tr.poss3(o.tr),
    oPA: tr.poss3Acc(o.tr),
    oA: tr.acc(o.tr),
    oPl: tr.pl(o.tr),
    oPPl: tr.poss3Pl(o.tr),
    oD: tr.dat(o.tr),
    // KU
    kA: fi.A.kuObl, kB: fi.B.kuObl, kC: fi.C.kuObl,
    nA: fi.A.ku, nB: fi.B.ku,
    ko: o.ku.w, koEz: o.ku.ez, koObl: o.ku.obl,
    // EN
    eo: o.en.pl, eo1: o.en.sg,
    // Kap
    c, ct: c.tr.w, cD: tr.dat(c.tr), cL: tr.loc(c.tr), cPl: tr.pl(c.tr), cPlD: tr.plDat(c.tr),
    ck: c.ku.w, ckS: c.ku.sobl ?? `${c.ku.w}ê`, ckObl: c.ku.obl,
    ce: c.en.pl, ce1: c.en.sg,
    pick: <T,>(arr: readonly T[]): T => fi.rng.pick(arr),
  };
}

export const L = (tr: string, ku: string, en: string): L10n => ({ tr, ku, en });
export const unitOf = (n: Noun): L10n => ({ tr: n.tr.w, ku: n.ku.w, en: n.en.sg });
export const nounOf = (k: NounKey): Noun => NOUNS[k];
