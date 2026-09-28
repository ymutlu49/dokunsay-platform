/**
 * CANLANDIR — betik simülasyonu, durum denetimi ve strateji çıkarımı (DESIGN §12.1 madde 3, 10, 11).
 * Her vuruş sonrası beklenen bölge sayıları betiğin kendisinden hesaplanır (Problem gerekmez).
 */
import type { ActBeat, ActScript, ActStrategy, ActUnit, L10n } from './types';

/** Arayüzün kaydettiği manipülasyon olayı (strateji çıkarımı için). */
export interface ActEvent {
  kind: 'add' | 'remove' | 'move' | 'deal' | 'group' | 'break';
  amount: number;
  unit: ActUnit;
  zone: string;
  t: number;
}

interface Sim {
  counts: Record<string, number>;
  groups: Record<string, number[]>;
  closed: Set<string>;
  matched: [string, string] | null;
}

const sum = (a: number[]) => a.reduce((s, x) => s + x, 0);

function simulate(script: ActScript, upto: number): Sim {
  const s: Sim = { counts: {}, groups: {}, closed: new Set(), matched: null };
  for (const z of script.zones) {
    s.counts[z.id] = 0;
    if (z.kind === 'group') s.groups[z.id] = z.count ? Array(z.count).fill(0) : [];
  }
  const kindOf = (id: string) => script.zones.find((z) => z.id === id)?.kind;
  const mysteries = new Map<string, Extract<ActBeat, { kind: 'mystery' }>>();
  const last = Math.min(upto, script.beats.length - 1);
  for (let i = 0; i <= last; i++) {
    const b = script.beats[i];
    switch (b.kind) {
      case 'place':
        if (kindOf(b.zone) === 'group') {
          const n = script.zones.find((z) => z.id === b.zone)?.count ?? 1;
          s.groups[b.zone] = Array(n).fill(b.amount);
          s.counts[b.zone] = n * b.amount;
        } else s.counts[b.zone] += b.amount;
        break;
      case 'add':
        s.counts[b.zone] += b.amount;
        break;
      case 'remove':
        if (!s.closed.has(b.zone)) s.counts[b.zone] -= b.amount;
        if (b.to) s.counts[b.to] += b.amount;
        break;
      case 'combine':
        s.counts[b.to] += sum(b.from.map((f) => s.counts[f]));
        for (const f of b.from) s.counts[f] = 0;
        break;
      case 'match':
        s.matched = b.zones;
        break;
      case 'deal': {
        const T = s.counts[b.from];
        const each = Math.floor(T / b.groups);
        s.groups[b.to] = Array(b.groups).fill(each);
        s.counts[b.to] = each * b.groups;
        s.counts[b.from] = T - each * b.groups;
        break;
      }
      case 'makeGroups': {
        const T = s.counts[b.from];
        const n = Math.floor(T / b.size);
        s.groups[b.to] = Array(n).fill(b.size);
        s.counts[b.to] = n * b.size;
        s.counts[b.from] = T - n * b.size;
        break;
      }
      case 'copy':
        s.counts[b.to] = s.counts[b.from] * b.times;
        break;
      case 'mystery':
        mysteries.set(b.zone, b);
        s.closed.add(b.zone);
        s.counts[b.zone] = 0;
        break;
      case 'ask':
        if (b.read === 'box' && b.zone) {
          const m = mysteries.get(b.zone);
          const amt = m?.amount ?? 0;
          s.closed.delete(b.zone);
          s.counts[b.zone] = amt;
          if (m?.from) s.counts[m.from] -= amt;
        }
        break;
    }
  }
  return s;
}

/** `beatIndex`. vuruş TAMAMLANDIKTAN sonra beklenen bölge sayıları (grup bölgesinde tüm grupların toplamı). */
export function expectedAfter(script: ActScript, beatIndex: number): Record<string, number> {
  return { ...simulate(script, beatIndex).counts };
}

/** Grup bölgelerinde beklenen grup içerikleri (ör. { groups: [4, 4, 4] }). */
export function expectedGroupsAfter(script: ActScript, beatIndex: number): Record<string, number[]> {
  const g = simulate(script, beatIndex).groups;
  return Object.fromEntries(Object.entries(g).map(([k, v]) => [k, [...v]]));
}

/** `ask` vuruşunun okuduğu değer (beklenen durumda). ask olmayan vuruşta null. */
export function askValue(script: ActScript, beatIndex: number): number | null {
  const b = script.beats[beatIndex];
  if (!b || b.kind !== 'ask') return null;
  const s = simulate(script, beatIndex);
  const z = b.zone ?? '';
  switch (b.read) {
    case 'count': case 'box': case 'leftover': return s.counts[z] ?? 0;
    case 'difference': return s.matched ? Math.abs(s.counts[s.matched[0]] - s.counts[s.matched[1]]) : null;
    case 'groupSize': return s.groups[z]?.[0] ?? 0;
    case 'groupCount': return s.groups[z]?.length ?? 0;
  }
}

const T = (tr: string, ku: string, en: string): L10n => ({ tr, ku, en });

/** Nazik, cümleye dönen ipucu — cevabı söylemez (DESIGN §12.1 madde 11). */
function mismatchHint(b: ActBeat): L10n {
  switch (b.kind) {
    case 'place': return T('Cümleyi bir daha dinleyelim: burada kaç tane olmalı?', 'Em hevokê careke din guhdarî bikin: divê li vir çend heb hebin?', 'Let’s listen to the sentence again: how many should be here?');
    case 'add': return T('Cümleyi bir daha dinleyelim: kaç tane geldi?', 'Em hevokê careke din guhdarî bikin: çend heb hatin?', 'Let’s listen to the sentence again: how many came?');
    case 'remove': return T('Cümleyi bir daha dinleyelim: kaç tane gitti?', 'Em hevokê careke din guhdarî bikin: çend heb çûn?', 'Let’s listen to the sentence again: how many went away?');
    case 'combine': return T('İki grubun hepsi bir araya geldi mi? Hiçbiri dışarıda kalmasın.', 'Hemû tiştên her du koman gihîştin hev? Bila yek jî li derve nemîne.', 'Did both groups come together? Leave none outside.'); // KU-DENETİM
    case 'match': return T('Her sayacı karşısındakiyle eşle. Sayılar değişmemeli.', 'Her tiştî bi yê hember re bide ber hev. Hejmar divê neguhere.', 'Match each counter with the one opposite. The numbers should not change.'); // KU-DENETİM
    case 'deal': return T('Birer birer dağıt: her grup eşit mi? Hepsini dağıttın mı?', 'Yek bi yek belav bike: her kom wekhev e? Te hemû belav kirin?', 'Deal one at a time: is every group the same? Did you deal them all?');
    case 'makeGroups': return T('Her grupta aynı sayıda olmalı. Grup tamamlanmıyorsa artanlar dışarıda kalır.', 'Divê di her komê de heman hejmar hebe. Yên zêde li derve dimînin.', 'Every group needs the same number. Leftovers stay outside.');
    case 'copy': return T('Aynı miktarı kaç kez koymamız gerekiyor? Cümleyi bir daha dinleyelim.', 'Divê em heman mîqdarê çend caran deynin? Em hevokê careke din guhdarî bikin.', 'How many times should we put the same amount? Let’s listen to the sentence again.');
    case 'mystery': return T('Bilmediğimiz miktar gizli kutuda. Önce hikâyedeki diğer sayılara bakalım.', 'Mîqdara ku em nizanin di qutiya veşartî de ye. Pêşî em li hejmarên din binêrin.', 'The amount we don’t know is in the hidden box. First let’s look at the other numbers in the story.');
    case 'ask':
      return b.read === 'box'
        ? T('Kutuya ekle ya da çıkar, sonra hikâyedeki sayıyla karşılaştır.', 'Li qutiyê zêde bike an jê derxe, paşê bi hejmara çîrokê re bide ber hev.', 'Add to the box or take some out, then compare with the number in the story.')
        : T('Masadaki nesneler hikâyedeki gibi mi? Bir daha sayalım.', 'Tiştên li ser masê wek çîrokê ne? Em careke din bijmêrin.', 'Are the things on the mat like the story? Let’s count again.');
  }
}

const norm = (a: number[]) => a.filter((x) => x > 0).sort((x, y) => x - y).join(',');

/** O vuruş sonrası masa durumu hikâyeye uyuyor mu? Kapalı gizli kutu denetlenmez. */
export function checkActState(
  script: ActScript, beatIndex: number, zoneCounts: Record<string, number>, extra?: { groups?: number[] },
): { ok: boolean; error?: 'actMismatch'; hint?: L10n } {
  const b = script.beats[beatIndex];
  if (!b) return { ok: false, error: 'actMismatch' };
  const s = simulate(script, beatIndex);
  const bad = { ok: false as const, error: 'actMismatch' as const, hint: mismatchHint(b) };
  for (const z of script.zones) {
    if (s.closed.has(z.id)) continue;
    if ((zoneCounts[z.id] ?? 0) !== s.counts[z.id]) return bad;
  }
  if (extra?.groups) {
    const gz = script.zones.find((z) => z.kind === 'group');
    if (gz && norm(extra.groups) !== norm(s.groups[gz.id] ?? [])) return bad;
  }
  return { ok: true };
}

/**
 * Basit strateji çıkarımı (CGI; Carpenter vd. 1999). `events` = bu vuruş sırasında kaydedilen olaylar.
 * Öncelik: guessCheck (gizli kutuda ekle-çıkar dalgalanması) > useTens > dağıtma/gruplama > countAll/countOn.
 */
export function inferStrategy(events: ActEvent[], script: ActScript, beatIndex: number): ActStrategy | null {
  const b = script.beats[beatIndex];
  if (!b || !events.length) return null;
  const boxBeat = b.kind === 'mystery' || (b.kind === 'ask' && b.read === 'box');
  const boxZone = b.kind === 'mystery' ? b.zone : b.kind === 'ask' ? b.zone : null;
  if (boxBeat && boxZone) {
    let prev = 0, flips = 0;
    for (const e of events) {
      if (e.zone !== boxZone || (e.kind !== 'add' && e.kind !== 'remove' && e.kind !== 'move')) continue;
      const sign = e.kind === 'remove' ? -1 : 1;
      if (prev && sign !== prev) flips++;
      prev = sign;
    }
    if (flips >= 1) return 'guessCheck';
  }
  if (events.some((e) => e.unit !== 'one' || e.kind === 'break')) return 'useTens';
  if (b.kind === 'deal' || b.kind === 'makeGroups') {
    const size = b.kind === 'makeGroups' ? b.size : (simulate(script, beatIndex).groups[b.to]?.[0] ?? 1);
    const moves = events.filter((e) => e.kind === 'deal' || e.kind === 'group' || e.kind === 'move' || e.kind === 'add');
    if (!moves.length) return null;
    if (size > 1 && moves.some((e) => e.amount >= size)) return 'groupAtOnce';
    return moves.every((e) => e.amount === 1) ? 'dealOneByOne' : 'groupAtOnce';
  }
  const prior = beatIndex > 0 ? simulate(script, beatIndex - 1).counts : {};
  const removedFrom = (z: string) => events.filter((e) => e.kind === 'remove' && e.zone === z).reduce((a, e) => a + e.amount, 0);
  if (boxBeat && boxZone) {
    const adds = events.filter((e) => e.kind === 'add' && e.zone === boxZone);
    if (!adds.length) return null;
    const rebuilt = Object.entries(prior).some(([z, n]) => z !== boxZone && n > 0 && removedFrom(z) >= n);
    return rebuilt ? 'countAll' : 'countOn';
  }
  const zone = b.kind === 'place' || b.kind === 'add' || b.kind === 'remove' ? b.zone : b.kind === 'copy' ? b.to : b.kind === 'ask' ? b.zone : null;
  if (!zone) return null;
  const adds = events.filter((e) => e.kind === 'add' && e.zone === zone);
  if (!adds.length) return null;
  const before = prior[zone] ?? 0;
  const reset = before > 0 && removedFrom(zone) >= before;
  if (adds.every((e) => e.amount === 1)) return before === 0 || reset ? 'countAll' : 'countOn';
  return before > 0 && !reset ? 'countOn' : null;
}
