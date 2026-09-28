/**
 * CANLANDIR — vuruş yönergeleri (çocuğa kısa, tek eylemli; TR/KU/EN). Türkçe ekler grammar/tr.ts ile;
 * Kurmancî yönerge dili FerMat'a bağlı (hejmar, zêdekirin, kemkirin, parkirin, jêma, kemok).
 * Yönerge CEVABI söylemez: gizli kutunun içeriği, grup sayısı/büyüklüğü, sonuç sayısı yazılmaz.
 */
import type { ActBeat, ActScript, ActZone, L10n, Lang, Problem, Role } from './types';
import { PEOPLE, nounByTr } from './lexicon';
import type { Noun } from './lexicon';
import { acc, dat, nameGen, numDist, h4, lastVowel, poss3Pl } from './grammar/tr';
import { plEn } from './grammar/en';
import { fmtNum } from './text';
import { expectedAfter } from './actState';

const T = (tr: string, ku: string, en: string): L10n => ({ tr, ku, en });

function nounOf(u: L10n): Noun {
  return nounByTr(u.tr) ?? { id: u.tr, tr: { w: u.tr }, ku: { w: u.ku, ez: `${u.ku}ên`, obl: `${u.ku}an`, sobl: `${u.ku}ê` }, en: { sg: u.en, pl: `${u.en}s` } };
}

const personOf = (l: L10n) => PEOPLE.find((p) => p.tr === l.tr);

/** "Ela'nın bölgesine" · "herêma Elayê" · "Ela's area" (kişi değilse tırnaklı ad). */
function zonePhrase(z: ActZone | undefined): L10n {
  if (!z) return T('bölgeye', 'herêmê', 'the area');
  const p = personOf(z.label);
  if (p) return T(`${nameGen(p.tr)} bölgesine`, `herêma ${p.kuObl}`, `${p.en}’s area`); // KU-DENETİM: "herêma + oblik"
  return T(`«${z.label.tr}» bölgesine`, `herêma «${z.label.ku}»`, `the “${z.label.en}” area`);
}

/** "Ela'nın kalemleri kadar" · "qasî pênûsên Elayê" · "as many pencils as Ela has". */
function asManyAs(z: ActZone | undefined, o: Noun): L10n {
  const p = z && personOf(z.label);
  if (p) return T(`${nameGen(p.tr)} ${poss3Pl(o.tr)} kadar`, `qasî ${o.ku.ez} ${p.kuObl}`, `as many ${o.en.pl} as ${p.en} has`);
  const l = z?.label ?? T('ilk sıra', 'rêza yekem', 'the first row');
  return T(`«${l.tr}» bölgesindeki kadar`, `qasî yên li herêma «${l.ku}»`, `as many ${o.en.pl} as in “${l.en}”`); // KU-DENETİM
}

function counterUnit(problem: Problem, step: number): { o: Noun; cont: Noun | null } {
  const st = problem.steps[step];
  const u = (r: Role) => st.quantities.find((q) => q.role === r)!.unit;
  if (st.schema === 'equalGroups') {
    const g = u('groups');
    // Kap adı yalnız sözlükte varsa ve nesneden farklıysa (zincir/tablo maddelerinde grup birimi nesne ya da "adet" olabilir).
    return { o: nounOf(u('total')), cont: nounByTr(g.tr) && g.tr !== u('total').tr ? nounOf(g) : null };
  }
  if (st.schema === 'multCompare') return { o: nounOf(u('reference')), cont: null };
  return { o: nounOf(st.quantities[0].unit), cont: null };
}

const listPl = (n: number, o: Noun) => plEn(n, o.en);

function askPrompt(script: ActScript, beat: Extract<ActBeat, { kind: 'ask' }>, idx: number, o: Noun, problem: Problem): L10n {
  const f = (n: number, l: Lang) => fmtNum(n, l);
  if (beat.read === 'box') {
    const m = script.beats.find((b): b is Extract<ActBeat, { kind: 'mystery' }> => b.kind === 'mystery' && b.zone === beat.zone);
    const t = m?.target ?? 0;
    const schema = problem.steps[script.step].schema;
    if (m?.from) return T(`Gizli kutuya, geride ${f(t, 'tr')} ${o.tr.w} kalana kadar taşı.`, `Tiştan bibe qutiya veşartî heta ${f(t, 'ku')} ${o.ku.w} bimînin.`, `Move ${o.en.pl} into the hidden box until ${f(t, 'en')} are left.`); // KU-DENETİM
    const rm = script.beats.find((b): b is Extract<ActBeat, { kind: 'remove' }> => b.kind === 'remove' && b.zone === beat.zone);
    if (rm) return T(
      `Gizli kutuya ${o.tr.w} ekle: ${f(rm.amount, 'tr')} tanesi gidince geride ${f(t, 'tr')} kalmalı.`,
      `Li qutiya veşartî ${o.ku.w} zêde bike: dema ${f(rm.amount, 'ku')} heb biçin, divê ${f(t, 'ku')} bimînin.`, // KU-DENETİM
      `Add ${o.en.pl} to the hidden box: when ${f(rm.amount, 'en')} go away, ${f(t, 'en')} should be left.`);
    if (schema === 'compare') return T(
      `Gizli kutuya ${o.tr.w} ekle: iki sıranın farkı ${f(t, 'tr')} olmalı.`,
      `Li qutiya veşartî ${o.ku.w} zêde bike: divê kemoka her du rêzan ${f(t, 'ku')} be.`, // KU-DENETİM
      `Add ${o.en.pl} to the hidden box: the two rows should differ by ${f(t, 'en')}.`);
    return T(
      `Gizli kutuya, toplam ${f(t, 'tr')} olana kadar ${o.tr.w} ekle.`,
      `Li qutiya veşartî ${o.ku.w} zêde bike heta bi giştî ${f(t, 'ku')} bibin.`, // KU-DENETİM
      `Add ${o.en.pl} to the hidden box until there are ${f(t, 'en')} altogether.`);
  }
  if (beat.read === 'difference') return T('Eşi olmayanları say: kaç tane?', 'Yên bê hevber bijmêre: çend heb in?', 'Count the ones without a partner: how many?'); // KU-DENETİM
  if (beat.read === 'groupSize') return T('Bir gruba bak: içinde kaç tane var?', 'Li komekê binêre: çend heb tê de hene?', 'Look at one group: how many are in it?');
  if (beat.read === 'groupCount') return T('Grupları say: kaç grup oldu?', 'Koman bijmêre: çend kom çêbûn?', 'Count the groups: how many groups are there?');
  if (beat.read === 'leftover') return T('Artanları say: kaç tane dışarıda kaldı?', 'Yên zêde bijmêre: çend heb li derve man?', 'Count the leftovers: how many are outside?');
  // count: önceki eyleme göre
  const prev = script.beats.slice(0, idx).reverse().find((b) => b.kind !== 'ask' && b.kind !== 'match');
  if (prev?.kind === 'remove') return T('Şimdi say: kaç tane kaldı?', 'Niha bijmêre: çend heb man?', 'Now count: how many are left?');
  if (prev?.kind === 'combine') return T('Şimdi say: hepsi kaç tane?', 'Niha bijmêre: bi hev re çend heb in?', 'Now count: how many altogether?');
  if (prev?.kind === 'place' && script.zones.find((z) => z.id === prev.zone)?.kind === 'group') return T('Şimdi say: toplam kaç tane?', 'Niha bijmêre: bi giştî çend heb in?', 'Now count: how many in total?');
  return T('Şimdi say: kaç tane oldu?', 'Niha bijmêre: çend heb bûn?', 'Now count: how many are there now?');
}

/** Vuruş için çocuğa kısa yönerge (üç dilde; `lang` yalnız arayüz kolaylığı için — dönüş her zaman L10n). */
export function beatPrompt(script: ActScript, beat: ActBeat, problem: Problem, lang: Lang = 'tr'): L10n {
  void lang;
  let idx = script.beats.indexOf(beat);
  if (idx < 0) idx = script.beats.findIndex((b) => JSON.stringify(b) === JSON.stringify(beat));
  const zone = (id: string) => script.zones.find((z) => z.id === id);
  const { o, cont } = counterUnit(problem, script.step);
  const f = (n: number, l: Lang) => fmtNum(n, l);
  switch (beat.kind) {
    case 'place': {
      const n = beat.amount;
      if (zone(beat.zone)?.kind === 'group') {
        if (!cont) return T(`Her gruba ${f(n, 'tr')} ${o.tr.w} koy.`, `Di her komê de ${f(n, 'ku')} ${o.ku.w} deyne.`, `Put ${f(n, 'en')} ${listPl(n, o)} in each group.`);
        return T(`Her ${dat(cont.tr)} ${f(n, 'tr')} ${o.tr.w} koy.`, `Di her ${cont.ku.sobl ?? `${cont.ku.w}ê`} de ${f(n, 'ku')} ${o.ku.w} deyne.`, `Put ${f(n, 'en')} ${listPl(n, o)} in each ${cont.en.sg}.`);
      }
      const z = zonePhrase(zone(beat.zone));
      return T(`${z.tr} ${f(n, 'tr')} ${o.tr.w} koy.`, `${f(n, 'ku')} ${o.ku.w} deyne ${z.ku}.`, `Put ${f(n, 'en')} ${listPl(n, o)} in ${z.en}.`);
    }
    case 'add': {
      const n = beat.amount;
      const z = zonePhrase(zone(beat.zone));
      return T(`${z.tr} ${f(n, 'tr')} ${o.tr.w} daha ekle.`, `${f(n, 'ku')} ${o.ku.w} din li ${z.ku} zêde bike.`, `Add ${f(n, 'en')} more ${listPl(n, o)} to ${z.en}.`); // KU-DENETİM
    }
    case 'remove': {
      const n = beat.amount;
      const from = zone(beat.zone);
      const to = beat.to ? zone(beat.to) : undefined;
      const zt = zonePhrase(to);
      if (from?.kind === 'box') return T(`Gidenleri göster: ${zt.tr} ${f(n, 'tr')} ${o.tr.w} koy.`, `Yên çûn nîşan bide: ${f(n, 'ku')} ${o.ku.w} deyne ${zt.ku}.`, `Show the ones that went: put ${f(n, 'en')} ${listPl(n, o)} in ${zt.en}.`); // KU-DENETİM
      if (to && personOf(to.label)) return T(`${f(n, 'tr')} ${acc(o.tr)} çıkar ve ${zt.tr} koy.`, `${f(n, 'ku')} ${o.ku.w} derxe û deyne ${zt.ku}.`, `Take ${f(n, 'en')} ${listPl(n, o)} away and put them in ${zt.en}.`);
      // Hedef bir kategori bölgesiyse (parça-bütün: "Armut"), bütünün adını ("meyve") kullanmak yanıltır →
      // ada bağlı olmayan kalıp: "Hepsinden 7 tanesini Armut bölgesine taşı."
      if (to) return T(`Hepsinden ${f(n, 'tr')} tanesini ${zt.tr} taşı.`, `Ji hemûyan ${f(n, 'ku')} heban bibe ${zt.ku}.`, `Move ${f(n, 'en')} of them to ${zt.en}.`); // KU-DENETİM
      return T(`${f(n, 'tr')} ${acc(o.tr)} çıkar.`, `${f(n, 'ku')} ${o.ku.w} derxe.`, `Take ${f(n, 'en')} ${listPl(n, o)} away.`);
    }
    case 'combine':
      return T('İki grubu birleştir.', 'Her du koman bike yek.', 'Put the two groups together.'); // KU-DENETİM
    case 'match':
      return T('Sayaçları bire bir eşle.', 'Tiştan yek bi yek bide ber hev.', 'Match the counters one to one.'); // KU-DENETİM
    case 'deal': {
      const n = idx > 0 ? expectedAfter(script, idx - 1)[beat.from] ?? 0 : 0;
      const g = beat.groups;
      if (cont) return T(`${f(n, 'tr')} ${acc(o.tr)} ${f(g, 'tr')} ${dat(cont.tr)} birer birer paylaştır.`, `${f(n, 'ku')} ${o.ku.w} yek bi yek li ${f(g, 'ku')} ${cont.ku.obl} par bike.`, `Share ${f(n, 'en')} ${listPl(n, o)} one at a time among ${f(g, 'en')} ${plEn(g, cont.en)}.`);
      return T(`${f(n, 'tr')} ${acc(o.tr)} ${f(g, 'tr')} gruba birer birer paylaştır.`, `${f(n, 'ku')} ${o.ku.w} yek bi yek li ${f(g, 'ku')} koman par bike.`, `Share ${f(n, 'en')} ${listPl(n, o)} one at a time among ${f(g, 'en')} groups.`);
    }
    case 'makeGroups': {
      const n = idx > 0 ? expectedAfter(script, idx - 1)[beat.from] ?? 0 : 0;
      const d = numDist(beat.size);
      return T(`${f(n, 'tr')} ${acc(o.tr)} ${d}l${h4(lastVowel(d))} gruplara ayır.`, `${f(n, 'ku')} ${o.ku.w} bike komên ${f(beat.size, 'ku')} hebî.`, `Put the ${f(n, 'en')} ${listPl(n, o)} into groups of ${f(beat.size, 'en')}.`); // KU-DENETİM: "komên … hebî"
    }
    case 'copy': {
      const z = zonePhrase(zone(beat.to));
      const a = asManyAs(zone(beat.from), o);
      const k = beat.times;
      return T(`${z.tr}, ${a.tr} ${f(k, 'tr')} kez koy.`, `${f(k, 'ku')} caran ${a.ku} deyne ${z.ku}.`, `Put ${a.en}, ${f(k, 'en')} times, in ${z.en}.`); // KU-DENETİM
    }
    case 'mystery':
      return T('Bilmediğimiz miktar gizli kutuda. Kutu şimdilik kapalı.', 'Mîqdara ku em nizanin di qutiya veşartî de ye. Qutî niha girtî ye.', 'The amount we don’t know is in the hidden box. The box stays closed for now.');
    case 'ask':
      return askPrompt(script, beat, idx, o, problem);
  }
}
