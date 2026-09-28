/**
 * EŞİT GRUPLAR çerçeveleri (kap + nesne): çarpma `multiply`, paylaştırma `partitive`,
 * gruplama `quotative`; kalanlı bölmede yorum (yukarı / aşağı / kalan cevaptır).
 * Paylaştırma "tek tek dağıt", gruplama "N'erli al" modeline karşılık gelir (Kouba 1989).
 * Üleştirme eki (3'er) ilk kez 3. sınıfta; 2. sınıfta "her … 3" (04 §D.3 kural 11).
 */
import type { L10n, Lang, Sentence } from '../types';
import type { Part } from '../text';
import { S, Q } from '../text';
import type { Frame, FrameInput, FrameOut } from './types';
import { helpers, L, unitOf } from './types';
import { numDist, loc as trLoc } from '../grammar/tr';

const LANGS: Lang[] = ['tr', 'ku', 'en'];

export function renderContainer(fi: FrameInput): FrameOut {
  const h = helpers(fi);
  const { A } = h;
  const v = fi.step.variant;
  const rem = fi.step.remainder?.interpret;
  const onEn = fi.cont.id === 'tabak' ? 'on' : 'in';
  const dist = fi.grade >= 3 && fi.rng.chance(0.5);
  const cLoc = trLoc(fi.cont.tr);
  const text = {} as Record<Lang, Sentence[]>;
  const answer = {} as L10n;
  let unit = unitOf(fi.obj);
  const T = { tr: h.t, ku: h.k, en: h.e };
  for (const lang of LANGS) {
    const q = T[lang];
    const out: Part[][] = [];
    let ask: Part[] = [];
    let ans = '';
    if (v === 'multiply') {
      if (lang === 'tr') {
        if (dist) {
          out.push([A.tr, ' ', q('groups'), ' ', h.cD, ' ', q('perGroup', numDist), ' ', h.o, ' koydu.']);
          ask = [A.tr, ' toplam kaç ', h.o, ' koydu?'];
          ans = `${A.tr} toplam {x} ${h.o} koydu.`;
        } else {
          out.push([q('groups'), ' ', h.ct, ' var.'], ['Her ', cLoc, ' ', q('perGroup'), ' ', h.o, ' var.']);
          ask = ['Toplam kaç ', h.o, ' var?'];
          ans = `Toplam {x} ${h.o} var.`;
        }
      } else if (lang === 'ku') {
        out.push([q('groups'), ' ', h.ck, ' hene.'], ['Di her ', h.ckS, ' de ', q('perGroup'), ' ', h.ko, ' hene.']);
        ask = ['Bi giştî çend ', h.ko, ' hene?'];
        ans = `Bi giştî {x} ${h.ko} hene.`;
      } else {
        out.push(['There are ', q('groups'), ' ', h.ce, '.'], ['Each ', h.ce1, ' has ', q('perGroup'), ' ', h.eo, '.']);
        ask = ['How many ', h.eo, ' are there altogether?'];
        ans = `There are {x} ${h.eo} altogether.`;
      }
    } else if (v === 'partitive') {
      const will = !!rem;
      if (lang === 'tr') {
        out.push([A.tr, ' ', q('total'), ' ', h.oA, ' ', q('groups'), ' ', h.cD, ` eşit ${will ? 'paylaştıracak' : 'paylaştırdı'}.`]);
        if (will) out.push(['Artanlar dışarıda kalacak.']);
        if (rem === 'remainderIsAnswer') { ask = ['Kaç ', h.o, ' artar?']; ans = `{x} ${h.o} artar.`; }
        else if (will) { ask = ['Her ', h.cD, ' kaç ', h.o, ' düşer?']; ans = `Her ${h.cD} {x} ${h.o} düşer.`; }
        else { ask = ['Her ', cLoc, ' kaç ', h.o, ' var?']; ans = `Her ${cLoc} {x} ${h.o} var.`; }
      } else if (lang === 'ku') {
        // KU-DENETİM
        // Gelecek zaman ergatif değil: eyleyen yalın (Rojda dê … par bike); geçmişte oblik (Rojdayê … par kirin).
        out.push(will
          ? [h.nA, ' dê ', q('total'), ' ', h.ko, ' bi wekhevî li ', q('groups'), ' ', h.ckObl, ' par bike.']
          : [h.kA, ' ', q('total'), ' ', h.ko, ' bi wekhevî li ', q('groups'), ' ', h.ckObl, ' par kirin.']);
        if (will) out.push(['Yên zêde dê li derve bimînin.']);
        if (rem === 'remainderIsAnswer') { ask = ['Çend ', h.ko, ' zêde dimînin?']; ans = `{x} ${h.ko} zêde dimînin.`; }
        else { ask = ['Di her ', h.ckS, ' de çend ', h.ko, ' hene?']; ans = `Di her ${h.ckS} de {x} ${h.ko} hene.`; }
      } else {
        out.push([A.en, will ? ' will share ' : ' shared ', q('total'), ' ', h.eo, ' equally among ', q('groups'), ' ', h.ce, '.']);
        if (will) out.push(['The ones left over will stay out.']);
        if (rem === 'remainderIsAnswer') { ask = ['How many ', h.eo, ' will be left over?']; ans = `{x} ${h.eo} will be left over.`; }
        else { ask = ['How many ', h.eo, ` go ${onEn} each `, h.ce1, '?']; ans = `{x} ${h.eo} go ${onEn} each ${h.ce1}.`; }
      }
    } else {
      // quotative
      if (lang === 'tr') {
        if (!rem) {
          out.push([A.tr, ' ', q('total'), ' ', h.oA, ' ', h.cPlD, ' koydu.'], ['Her ', h.cD, ' ', q('perGroup'), ' ', h.o, ' koydu.']);
          ask = [A.tr, ' kaç ', h.ct, ' kullandı?']; ans = `${A.tr} {x} ${h.ct} kullandı.`;
        } else {
          out.push([h.gA, ' ', q('total'), ' ', h.oP, ' var.'], ['Her ', h.cD, ' ', q('perGroup'), ' ', h.o, rem === 'roundUp' ? ' sığıyor.' : ' koyacak.']);
          if (rem === 'roundUp') { ask = ['Hepsi için kaç ', h.ct, ' gerekir?']; ans = `Hepsi için {x} ${h.ct} gerekir.`; }
          else if (rem === 'roundDown') { ask = ['Kaç ', h.ct, ' tam dolar?']; ans = `{x} ${h.ct} tam dolar.`; }
          else { ask = ['Kaç ', h.o, ' artar?']; ans = `{x} ${h.o} artar.`; }
        }
      } else if (lang === 'ku') {
        // KU-DENETİM
        if (!rem) {
          out.push([h.kA, ' ', q('total'), ' ', h.ko, ' xistin ', h.ckObl, '.'], [h.kA, ' di her ', h.ckS, ' de ', q('perGroup'), ' ', h.ko, ' danîn.']);
          ask = [h.kA, ' çend ', h.ck, ' bi kar anîn?']; ans = `${h.kA} {x} ${h.ck} bi kar anîn.`;
        } else {
          out.push([h.kA, ' ', q('total'), ' ', h.ko, ' hene.'], ['Di her ', h.ckS, ' de ', q('perGroup'), ' ', h.ko, rem === 'roundUp' ? ' cih digirin.' : ' dê bên danîn.']);
          if (rem === 'roundUp') { ask = ['Ji bo hemûyan çend ', h.ck, ' lazim in?']; ans = `Ji bo hemûyan {x} ${h.ck} lazim in.`; }
          else if (rem === 'roundDown') { ask = ['Çend ', h.ck, ' tije dibin?']; ans = `{x} ${h.ck} tije dibin.`; }
          else { ask = ['Çend ', h.ko, ' zêde dimînin?']; ans = `{x} ${h.ko} zêde dimînin.`; }
        }
      } else {
        if (!rem) {
          out.push([A.en, ' put ', q('total'), ' ', h.eo, ' into ', h.ce, '.'], [A.en, ' put ', q('perGroup'), ' ', h.eo, ` ${onEn} each `, h.ce1, '.']);
          ask = ['How many ', h.ce, ' did ', A.en, ' use?']; ans = `${A.en} used {x} ${h.ce}.`;
        } else {
          out.push([A.en, ' has ', q('total'), ' ', h.eo, '.'], [rem === 'roundUp' ? 'Each ' : `${A.en} will put `, ...(rem === 'roundUp' ? [h.ce1, ' holds ', q('perGroup'), ' ', h.eo, '.'] : [q('perGroup'), ' ', h.eo, ` ${onEn} each `, h.ce1, '.'])]);
          if (rem === 'roundUp') { ask = ['How many ', h.ce, ' are needed for all of them?']; ans = `{x} ${h.ce} are needed.`; }
          else if (rem === 'roundDown') { ask = ['How many ', h.ce, ' will be full?']; ans = `{x} ${h.ce} will be full.`; }
          else { ask = ['How many ', h.eo, ' will be left over?']; ans = `{x} ${h.eo} will be left over.`; }
        }
      }
    }
    text[lang] = [...out.map((p) => S(...p)), Q(...ask)];
    answer[lang] = ans;
  }
  const answersInCont = v === 'quotative' && rem !== 'remainderIsAnswer';
  if (answersInCont) unit = unitOf(fi.cont);
  return {
    text,
    answer,
    unit,
    labels: {
      groups: L(h.ct, h.ck, h.ce),
      perGroup: L(`her ${cLoc}`, `di her ${h.ckS} de`, `in each ${h.ce1}`),
      total: L(`bütün ${h.oPl}`, `hemû ${h.ko}`, `all ${h.eo}`),
    },
  };
}

const plates: Frame = {
  id: 'groups.plates', context: 'kitchen', schema: 'equalGroups',
  variants: ['multiply', 'partitive', 'quotative'], minGrade: 2, unitKind: 'count',
  objs: ['kurabiye', 'simit', 'elma'], conts: ['tabak'], maxWhole: 999,
  remainders: ['roundUp', 'roundDown', 'remainderIsAnswer'],
  render: renderContainer,
};
const boxes: Frame = {
  id: 'groups.boxes', context: 'school', schema: 'equalGroups',
  variants: ['multiply', 'partitive', 'quotative'], minGrade: 2, unitKind: 'count',
  objs: ['kalem', 'kart', 'misket', 'ceviz'], conts: ['kutu', 'paket'], maxWhole: 9999,
  remainders: ['roundUp', 'roundDown', 'remainderIsAnswer'],
  render: renderContainer,
};
const eggs: Frame = {
  id: 'groups.eggs', context: 'village', schema: 'equalGroups',
  variants: ['multiply', 'partitive', 'quotative'], minGrade: 2, unitKind: 'count',
  objs: ['yumurta'], conts: ['koli', 'sepet'], maxWhole: 9999,
  remainders: ['roundUp', 'roundDown', 'remainderIsAnswer'],
  render: renderContainer,
};
const vases: Frame = {
  id: 'groups.vases', context: 'garden', schema: 'equalGroups',
  variants: ['multiply', 'partitive', 'quotative'], minGrade: 2, unitKind: 'count',
  objs: ['cicek', 'lale'], conts: ['vazo'], maxWhole: 999,
  remainders: ['roundUp', 'roundDown', 'remainderIsAnswer'],
  render: renderContainer,
};

export const GROUP_FRAMES_A: Frame[] = [plates, boxes, eggs, vases];
