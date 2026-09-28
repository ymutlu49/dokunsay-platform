/**
 * CANLANDIR — sanal manipülatif betiği (DESIGN §12). `actScriptFor(problem)` saf ve deterministiktir:
 * hikâyenin canlandırılan halkasını bölgelere (ActZone) ve cümleye bağlı vuruşlara (ActBeat) çevirir.
 *
 * İlkeler: gereksiz sayılar (extras) hiçbir vuruşa girmez (çocuk onları "Ne biliyorum?"da ayıkladı);
 * bilinmeyen gizli kutudur (mystery → ask 'box'); vuruş sırası olay mantığını izler, cümle indeksi
 * o miktarın geçtiği cümledir. Denetim/istem/strateji: ./actState.ts, ./actPrompt.ts.
 */
import type { ActBeat, ActScript, ActUnit, ActZone, L10n, Lang, Problem, Role, SchemaStep, Sentence } from './types';
import { PEOPLE, nounByTr } from './lexicon';
import type { Person } from './lexicon';
import { ROLE_LABEL } from './meta';
import { val } from './relations';
import { sentenceText } from './text';
import { capFirst, pl as trPl } from './grammar/tr';
import { capKu } from './grammar/ku';
import { capEn } from './grammar/en';

export { expectedAfter, expectedGroupsAfter, checkActState, askValue, inferStrategy } from './actState';
export type { ActEvent } from './actState';
export { beatPrompt } from './actPrompt';

const L = (tr: string, ku: string, en: string): L10n => ({ tr, ku, en });

// ─── Cümle bulma ─────────────────────────────────────────────────────────────

const isChip = (g: Sentence['segments'][number]): g is Extract<Sentence['segments'][number], { kind: 'qty' }> => g.kind === 'qty';
const hasChip = (s: Sentence, role: Role, si: number) => s.segments.some((g) => isChip(g) && g.ref === role && (g.step ?? 0) === si);
const hasAnyChip = (s: Sentence) => s.segments.some(isChip);

function questionIdx(sents: Sentence[]): number {
  for (let i = sents.length - 1; i >= 0; i--) if (sents[i].isQuestion) return i;
  return sents.length - 1;
}

/**
 * Rolün çipinin geçtiği ilk cümle; yoksa tablo satırının adının geçtiği cümle (axes.P=1);
 * yoksa (zincir bağlantısı) bu halkanın çipli ilk cümlesi; yoksa 0.
 */
function roleIdx(c: Ctx, role: Role, si: number): number {
  const sents = c.sents;
  const i = sents.findIndex((s) => hasChip(s, role, si));
  if (i >= 0) return i;
  const q = questionIdx(sents);
  const row = c.p.table?.rows.find((r) => r.ref === role && (r.step ?? 0) === si);
  if (row) {
    const w = row.label[c.lang].toLocaleLowerCase(c.lang === 'tr' ? 'tr-TR' : 'en');
    const t = sents.findIndex((s, k) => k !== q && sentenceText(s).toLocaleLowerCase(c.lang === 'tr' ? 'tr-TR' : 'en').includes(w));
    if (t >= 0) return t;
  }
  const j = sents.findIndex((s, k) => k !== q && s.segments.some((g) => isChip(g) && !g.ref.startsWith('extra') && (g.step ?? 0) === si));
  return j >= 0 ? j : 0;
}

/** a < i < b aralığında çipsiz (belirsiz olay) cümle; yoksa -1. */
function vagueBetween(sents: Sentence[], a: number, b: number): number {
  for (let i = a + 1; i < b; i++) if (!sents[i].isQuestion && !hasAnyChip(sents[i])) return i;
  return -1;
}

// ─── Bölge etiketleri (kişi / yer adı) ───────────────────────────────────────

const personL = (p: Person): L10n => L(p.tr, p.ku, p.en);

function peopleIn(text: string, names: string[]): Person[] {
  const hits: { i: number; p: Person }[] = [];
  for (const n of names) {
    const m = new RegExp(`(^|[^\\p{L}])${n}(?![\\p{L}])`, 'u').exec(text);
    const p = PEOPLE.find((x) => x.tr === n);
    if (m && p) hits.push({ i: m.index, p });
  }
  return hits.sort((a, b) => a.i - b.i).map((h) => h.p);
}

const PLACES: [RegExp, L10n][] = [
  [/otobüs/i, L('Otobüs', 'Otobus', 'Bus')], [/ağaç/i, L('Ağaç', 'Dar', 'Tree')], [/tepsi/i, L('Tepsi', 'Sênî', 'Tray')],
  [/kütüphane/i, L('Kütüphane', 'Pirtûkxane', 'Library')], [/depo/i, L('Depo', 'Depo', 'Tank')], [/sepet/i, L('Sepet', 'Selik', 'Basket')],
  [/ağıl/i, L('Ağıl', 'Axur', 'Pen')], [/sınıf/i, L('Sınıf', 'Pol', 'Class')], [/gezi/i, L('Gezi', 'Gerr', 'Trip')], // KU-DENETİM: Gerr (gezi)
];

/** Birimin çoğulu, büyük harfle ("Kuşlar" / "Çûk" / "Birds") — kişi/yer bulunamazsa. */
export function unitPlural(unit: L10n): L10n {
  const n = nounByTr(unit.tr);
  if (!n) return L(capFirst(unit.tr), capKu(unit.ku), capEn(unit.en));
  return L(capFirst(trPl(n.tr)), capKu(n.ku.w), capEn(n.en.pl));
}

const capL = (l: L10n): L10n => L(capFirst(l.tr), capKu(l.ku), capEn(l.en));

interface Ctx { p: Problem; st: SchemaStep; si: number; lang: Lang; sents: Sentence[]; tr: Sentence[] }

const trSentOf = (c: Ctx, role: Role): string => {
  const i = c.tr.findIndex((s) => hasChip(s, role, c.si));
  return i >= 0 ? sentenceText(c.tr[i]) : '';
};

/** Rolün sahibi: çerçeve etiketi (kişi/renk/nesne) → o cümledeki kişi → yer → birim çoğulu. */
function ownerOf(c: Ctx, role: Role, opts: { useLabel?: boolean; exclude?: string[]; alsoRoles?: Role[] } = {}): L10n {
  const q = c.st.quantities.find((x) => x.role === role);
  if (opts.useLabel !== false && q && q.label.tr !== ROLE_LABEL[role].tr) return capL(q.label);
  const names = c.p.people.filter((n) => !(opts.exclude ?? []).includes(n));
  let txt = [role, ...(opts.alsoRoles ?? [])].map((r) => trSentOf(c, r)).filter(Boolean).join(' ');
  // Rolün çipi yoksa (bilinmeyen / zincir bağlantısı) ve bu son halkaysa soru cümlesine bak.
  if (!txt && c.si === c.p.steps.length - 1) txt = questionTr(c);
  const who = peopleIn(txt, names)[0];
  if (who) return personL(who);
  for (const [re, l] of PLACES) if (re.test(txt)) return l;
  return unitPlural(q?.unit ?? c.p.answerUnit);
}

const questionTr = (c: Ctx): string => sentenceText(c.tr[questionIdx(c.tr)]);

/** Karşılaştırmada iki satırın sahibi: etiket → kendi cümlesindeki kişi → fark cümlesindeki öteki kişi → soru. */
function compareOwners(c: Ctx): Record<'larger' | 'smaller', L10n> {
  const lab = (r: Role) => {
    const q = c.st.quantities.find((x) => x.role === r);
    return q && q.label.tr !== ROLE_LABEL[r].tr ? capL(q.label) : null;
  };
  const own = (r: Role) => peopleIn(trSentOf(c, r), c.p.people)[0];
  const diff = peopleIn(trSentOf(c, 'difference'), c.p.people);
  const qNames = c.si === c.p.steps.length - 1 ? peopleIn(questionTr(c), c.p.people) : [];
  const U: Role | null = c.st.unknown === 'larger' || c.st.unknown === 'smaller' ? c.st.unknown : null;
  const K: Role = U === 'larger' ? 'smaller' : 'larger';
  const o: Partial<Record<Role, Person>> = { larger: own('larger'), smaller: own('smaller') };
  if (U && !o[U]) o[U] = o[K] ? diff.find((p) => p.tr !== o[K]!.tr) : qNames.length === 1 ? qNames[0] : undefined;
  if (!o[K]) o[K] = diff.find((p) => p.tr !== o[U ?? 'smaller']?.tr);
  const pick = (r: 'larger' | 'smaller'): L10n => lab(r) ?? (o[r] ? personL(o[r]!) : capL(ROLE_LABEL[r]));
  return { larger: pick('larger'), smaller: pick('smaller') };
}

const unitOfRole = (st: SchemaStep, r: Role): L10n => st.quantities.find((q) => q.role === r)!.unit;

// ─── Betik ───────────────────────────────────────────────────────────────────

function feasible(p: Problem, st: SchemaStep): boolean {
  if (p.unsolvable || st.variant === 'fraction') return false;
  if (st.quantities.some((q) => !Number.isInteger(q.value) || q.value < 0 || q.value > 1000)) return false;
  const v = (r: Role) => val(st, r);
  if (st.remainder && v('total') > 100) return false;
  if (st.schema === 'equalGroups' && (v('total') > 100 || v('groups') > 10)) return false;
  if (st.schema === 'multCompare' && v('compared') > 100) return false;
  return true;
}

function unitsFor(st: SchemaStep): ActUnit[] {
  const mx = Math.max(...st.quantities.map((q) => q.value));
  return mx <= 20 ? ['one'] : mx <= 100 ? ['ten', 'one'] : ['hundred', 'ten', 'one'];
}

type Built = { zones: ActZone[]; beats: ActBeat[] };

function buildChange(c: Ctx): Built {
  const { st, sents, si } = c;
  const v = (r: Role) => val(st, r);
  const q = questionIdx(sents);
  const iS = roleIdx(c, 'start', si), iC = roleIdx(c, 'change', si), iR = roleIdx(c, 'result', si);
  const join = st.variant !== 'separate';
  const mainOwner = st.unknown === 'start' ? ownerOf(c, 'result', { useLabel: false }) : ownerOf(c, 'start', { useLabel: false, alsoRoles: ['result'] });
  const main: ActZone = { id: 'main', label: mainOwner, kind: 'pile', role: st.unknown === 'start' ? 'result' : 'start' };
  const box = (role: Role): ActZone => ({ id: 'box', label: L('Gizli kutu', 'Qutiya veşartî', 'Hidden box'), kind: 'box', role }); // KU-DENETİM
  const outTxt = trSentOf(c, 'change');
  const other = peopleIn(outTxt, c.p.people.filter((n) => n !== mainOwner.tr))[0];
  const out: ActZone = { id: 'out', label: other ? personL(other) : L('Gidenler', 'Yên çûn', 'Gone'), kind: 'pile', role: 'change' }; // KU-DENETİM
  if (st.unknown === 'result') {
    return join
      ? { zones: [main], beats: [
          { kind: 'place', sentence: iS, zone: 'main', amount: v('start'), role: 'start' },
          { kind: 'add', sentence: iC, zone: 'main', amount: v('change'), role: 'change' },
          { kind: 'ask', sentence: q, zone: 'main', role: 'result', read: 'count' }] }
      : { zones: [main, out], beats: [
          { kind: 'place', sentence: iS, zone: 'main', amount: v('start'), role: 'start' },
          { kind: 'remove', sentence: iC, zone: 'main', amount: v('change'), role: 'change', to: 'out' },
          { kind: 'ask', sentence: q, zone: 'main', role: 'result', read: 'count' }] };
  }
  if (st.unknown === 'change') {
    const ev = vagueBetween(sents, iS, iR);
    return { zones: [main, box('change')], beats: [
      { kind: 'place', sentence: iS, zone: 'main', amount: v('start'), role: 'start' },
      join
        ? { kind: 'mystery', sentence: ev >= 0 ? ev : iR, zone: 'box', role: 'change', target: v('result'), amount: v('change') }
        : { kind: 'mystery', sentence: ev >= 0 ? ev : iR, zone: 'box', role: 'change', target: v('result'), from: 'main', amount: v('change') },
      { kind: 'ask', sentence: q, zone: 'box', role: 'change', read: 'box' }] };
  }
  // başlangıç bilinmiyor
  const before = vagueBetween(sents, -1, iC);
  const mSent = before >= 0 ? before : iC;
  if (join) {
    const m2: ActZone = { ...main, role: 'change' };
    return { zones: [box('start'), m2], beats: [
      { kind: 'mystery', sentence: mSent, zone: 'box', role: 'start', target: v('result'), amount: v('start') },
      { kind: 'add', sentence: iC, zone: 'main', amount: v('change'), role: 'change' },
      { kind: 'ask', sentence: q, zone: 'box', role: 'start', read: 'box' }] };
  }
  return { zones: [{ ...box('start'), label: mainOwner }, out], beats: [
    { kind: 'mystery', sentence: mSent, zone: 'box', role: 'start', target: v('result'), amount: v('start') },
    { kind: 'remove', sentence: iC, zone: 'box', amount: v('change'), role: 'change', to: 'out' },
    { kind: 'ask', sentence: q, zone: 'box', role: 'start', read: 'box' }] };
}

function buildCombine(c: Ctx): Built {
  const { st, sents, si } = c;
  const v = (r: Role) => val(st, r);
  const q = questionIdx(sents);
  const whole: ActZone = { id: 'whole', label: L('Hepsi', 'Tev', 'All'), kind: 'pile', role: 'whole' };
  if (st.unknown === 'whole') {
    return { zones: [
      { id: 'p1', label: ownerOf(c, 'part1'), kind: 'pile', role: 'part1' },
      { id: 'p2', label: ownerOf(c, 'part2'), kind: 'pile', role: 'part2' }, whole,
    ], beats: [
      { kind: 'place', sentence: roleIdx(c, 'part1', si), zone: 'p1', amount: v('part1'), role: 'part1' },
      { kind: 'place', sentence: roleIdx(c, 'part2', si), zone: 'p2', amount: v('part2'), role: 'part2' },
      { kind: 'combine', sentence: q, from: ['p1', 'p2'], to: 'whole' },
      { kind: 'ask', sentence: q, zone: 'whole', role: 'whole', read: 'count' }] };
  }
  const known: Role = st.unknown === 'part2' ? 'part1' : 'part2';
  return { zones: [whole, { id: 'p1', label: ownerOf(c, known), kind: 'pile', role: known }], beats: [
    { kind: 'place', sentence: roleIdx(c, 'whole', si), zone: 'whole', amount: v('whole'), role: 'whole' },
    { kind: 'remove', sentence: roleIdx(c, known, si), zone: 'whole', amount: v(known), role: known, to: 'p1' },
    { kind: 'ask', sentence: q, zone: 'whole', role: st.unknown, read: 'count' }] };
}

function buildCompare(c: Ctx): Built {
  const { st, sents, si } = c;
  const v = (r: Role) => val(st, r);
  const q = questionIdx(sents);
  const own = compareOwners(c);
  const lz: ActZone = { id: 'larger', label: own.larger, kind: 'row', role: 'larger' };
  const sz: ActZone = { id: 'smaller', label: own.smaller, kind: 'row', role: 'smaller' };
  if (st.unknown === 'difference') {
    const places: ActBeat[] = (['larger', 'smaller'] as Role[])
      .map((r) => ({ kind: 'place' as const, sentence: roleIdx(c, r, si), zone: r, amount: v(r), role: r }))
      .sort((a, b) => a.sentence - b.sentence);
    const last = Math.max(...places.map((b) => b.sentence));
    const eq = st.variant === 'equalize' ? vagueBetween(sents, last, q) : -1;
    return { zones: [lz, sz], beats: [...places,
      { kind: 'match', sentence: eq >= 0 ? eq : q, zones: ['larger', 'smaller'] },
      { kind: 'ask', sentence: q, zone: 'larger', role: 'difference', read: 'difference' }] };
  }
  const known: Role = st.unknown === 'larger' ? 'smaller' : 'larger';
  const zones = [lz, sz].map((z) => (z.id === st.unknown ? { ...z, kind: 'box' as const } : z));
  return { zones, beats: [
    { kind: 'place', sentence: roleIdx(c, known, si), zone: known, amount: v(known), role: known },
    { kind: 'mystery', sentence: roleIdx(c, 'difference', si), zone: st.unknown, role: st.unknown, target: v('difference'), amount: v(st.unknown) },
    { kind: 'ask', sentence: q, zone: st.unknown, role: st.unknown, read: 'box' }] };
}

function buildGroups(c: Ctx): Built {
  const { st, sents, si } = c;
  const v = (r: Role) => val(st, r);
  const q = questionIdx(sents);
  const gu = unitOfRole(st, 'groups');
  const gLabel = nounByTr(gu.tr) && gu.tr !== unitOfRole(st, 'total').tr ? unitPlural(gu) : L('Gruplar', 'Kom', 'Groups');
  const supplyOwner = peopleIn(trSentOf(c, 'total'), c.p.people)[0];
  const supply: ActZone = { id: 'supply', label: supplyOwner ? personL(supplyOwner) : ownerOf(c, 'total'), kind: 'pile', role: 'total' };
  if (st.unknown === 'total') {
    return { zones: [{ id: 'groups', label: gLabel, kind: 'group', role: 'groups', count: v('groups') }], beats: [
      { kind: 'place', sentence: roleIdx(c, 'perGroup', si), zone: 'groups', amount: v('perGroup'), role: 'perGroup' },
      { kind: 'ask', sentence: q, zone: 'groups', role: 'total', read: 'count' }] };
  }
  const partitive = st.unknown === 'perGroup';
  const main: ActBeat = partitive
    ? { kind: 'ask', sentence: q, zone: 'groups', role: 'perGroup', read: 'groupSize' }
    : { kind: 'ask', sentence: q, zone: 'groups', role: 'groups', read: 'groupCount' };
  const asks: ActBeat[] = [main];
  if (st.remainder) {
    const left: ActBeat = { kind: 'ask', sentence: q, zone: 'supply', role: st.unknown, read: 'leftover' };
    if (st.remainder.interpret === 'remainderIsAnswer') asks.push(left); else asks.unshift(left);
  }
  return {
    zones: [supply, partitive ? { id: 'groups', label: gLabel, kind: 'group', role: 'groups', count: v('groups') } : { id: 'groups', label: gLabel, kind: 'group', role: 'groups' }],
    beats: [
      { kind: 'place', sentence: roleIdx(c, 'total', si), zone: 'supply', amount: v('total'), role: 'total' },
      partitive
        ? { kind: 'deal', sentence: roleIdx(c, 'groups', si), from: 'supply', to: 'groups', groups: v('groups') }
        : { kind: 'makeGroups', sentence: roleIdx(c, 'perGroup', si), from: 'supply', to: 'groups', size: v('perGroup') },
      ...asks,
    ],
  };
}

function buildMult(c: Ctx): Built {
  const { st, sents, si } = c;
  const v = (r: Role) => val(st, r);
  const q = questionIdx(sents);
  const rOwner = ownerOf(c, 'reference');
  const kOwner = ownerOf(c, 'compared', { exclude: [rOwner.tr] });
  const ref: ActZone = { id: 'ref', label: rOwner, kind: 'row', role: 'reference' };
  const cmp: ActZone = { id: 'compared', label: kOwner, kind: 'row', role: 'compared' };
  const iF = roleIdx(c, 'factor', si);
  if (st.unknown === 'compared') {
    return { zones: [ref, cmp], beats: [
      { kind: 'place', sentence: roleIdx(c, 'reference', si), zone: 'ref', amount: v('reference'), role: 'reference' },
      { kind: 'copy', sentence: iF, from: 'ref', to: 'compared', times: v('factor') },
      { kind: 'ask', sentence: q, zone: 'compared', role: 'compared', read: 'count' }] };
  }
  if (st.unknown === 'reference') {
    return { zones: [cmp, { id: 'groups', label: rOwner, kind: 'group', role: 'reference', count: v('factor') }], beats: [
      { kind: 'place', sentence: roleIdx(c, 'compared', si), zone: 'compared', amount: v('compared'), role: 'compared' },
      { kind: 'deal', sentence: iF, from: 'compared', to: 'groups', groups: v('factor') },
      { kind: 'ask', sentence: q, zone: 'groups', role: 'reference', read: 'groupSize' }] };
  }
  const places: ActBeat[] = ([['reference', 'ref'], ['compared', 'compared']] as [Role, string][])
    .map(([r, z]) => ({ kind: 'place' as const, sentence: roleIdx(c, r, si), zone: z, amount: v(r), role: r }))
    .sort((a, b) => a.sentence - b.sentence);
  return { zones: [ref, cmp, { id: 'groups', label: kOwner, kind: 'group', role: 'factor' }], beats: [...places,
    { kind: 'makeGroups', sentence: q, from: 'compared', to: 'groups', size: v('reference') },
    { kind: 'ask', sentence: q, zone: 'groups', role: 'factor', read: 'groupCount' }] };
}

function positive(b: ActBeat): boolean {
  switch (b.kind) {
    case 'place': case 'add': case 'remove': return b.amount > 0;
    case 'deal': return b.groups > 0;
    case 'makeGroups': return b.size > 0;
    case 'copy': return b.times > 0;
    case 'mystery': return (b.amount ?? 1) > 0;
    default: return true;
  }
}

/** Problemin `stepIndex`. halkasının (varsayılan 0) canlandırma betiği. `lang` cümle indekslerinin dilidir. */
export function actScriptFor(problem: Problem, lang: Lang = 'tr', stepIndex = 0): ActScript {
  const si = Math.max(0, Math.min(stepIndex, problem.steps.length - 1));
  const st = problem.steps[si];
  const units = unitsFor(st);
  const none: ActScript = { feasible: false, zones: [], beats: [], units, step: si };
  if (!feasible(problem, st)) return none;
  const c: Ctx = { p: problem, st, si, lang, sents: problem.text[lang], tr: problem.text.tr };
  const b = st.schema === 'change' ? buildChange(c) : st.schema === 'combine' ? buildCombine(c)
    : st.schema === 'compare' ? buildCompare(c) : st.schema === 'equalGroups' ? buildGroups(c) : buildMult(c);
  if (!b.beats.every(positive)) return none;
  return { feasible: true, zones: b.zones, beats: b.beats, units, step: si };
}
