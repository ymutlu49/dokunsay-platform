/**
 * EŞİT GRUPLAR — özel bağlamlar: minibüs (kalanlı bölmede yukarı yuvarlama klasiği; Silver vd. 1993)
 * ve birim fiyat (para; 2. sınıftan).
 */
import type { L10n, Lang, Sentence } from '../types';
import type { Part } from '../text';
import { S, Q } from '../text';
import type { Frame } from './types';
import { helpers, L, unitOf, nounOf } from './types';
import { gen as trGen } from '../grammar/tr';

const LANGS: Lang[] = ['tr', 'ku', 'en'];

const minibus: Frame = {
  id: 'groups.minibus', context: 'bus', schema: 'equalGroups',
  variants: ['multiply', 'partitive', 'quotative'], minGrade: 2, unitKind: 'count',
  objs: ['ogrenci'], conts: ['minibus'], maxWhole: 200,
  remainders: ['roundUp', 'remainderIsAnswer'],
  render(fi) {
    const h = helpers(fi);
    const v = fi.step.variant;
    const rem = fi.step.remainder?.interpret;
    const T = { tr: h.t, ku: h.k, en: h.e };
    const text = {} as Record<Lang, Sentence[]>;
    const answer = {} as L10n;
    for (const lang of LANGS) {
      const q = T[lang];
      let out: Part[][] = [];
      let ask: Part[] = [];
      let ans = '';
      if (lang === 'tr') {
        if (v === 'multiply') {
          out = [['Geziye ', q('groups'), ' minibüs gitti.'], ['Her minibüste ', q('perGroup'), ' öğrenci vardı.']];
          ask = ['Geziye kaç öğrenci gitti?']; ans = 'Geziye {x} öğrenci gitti.';
        } else if (v === 'partitive') {
          out = [[q('total'), ' öğrenci ', q('groups'), ' minibüse eşit bindi.']];
          ask = ['Her minibüste kaç öğrenci var?']; ans = 'Her minibüste {x} öğrenci var.';
        } else if (!rem) {
          out = [[q('total'), ' öğrenci minibüslere bindi.'], ['Her minibüste ', q('perGroup'), ' öğrenci var.']];
          ask = ['Kaç minibüs doldu?']; ans = '{x} minibüs doldu.';
        } else {
          out = [[q('total'), ' öğrenci geziye gidecek.'], ['Bir minibüse ', q('perGroup'), ' öğrenci biniyor.']];
          if (rem === 'roundUp') { ask = ['Kaç minibüs gerekir?']; ans = '{x} minibüs gerekir.'; }
          else { out.push(['Minibüsler tam dolacak.']); ask = ['Kaç öğrenci açıkta kalır?']; ans = '{x} öğrenci açıkta kalır.'; }
        }
      } else if (lang === 'ku') {
        // KU-DENETİM
        if (v === 'multiply') {
          out = [[q('groups'), ' mînîbûs çûn gerê.'], ['Di her mînîbûsê de ', q('perGroup'), ' xwendekar hebûn.']];
          ask = ['Çend xwendekar çûn gerê?']; ans = '{x} xwendekar çûn gerê.';
        } else if (v === 'partitive') {
          out = [[q('total'), ' xwendekar bi wekhevî li ', q('groups'), ' mînîbûsan siwar bûn.']];
          ask = ['Di her mînîbûsê de çend xwendekar hene?']; ans = 'Di her mînîbûsê de {x} xwendekar hene.';
        } else if (!rem) {
          out = [[q('total'), ' xwendekar li mînîbûsan siwar bûn.'], ['Di her mînîbûsê de ', q('perGroup'), ' xwendekar hene.']];
          ask = ['Çend mînîbûs tije bûn?']; ans = '{x} mînîbûs tije bûn.';
        } else {
          out = [[q('total'), ' xwendekar dê herin gerê.'], ['Her mînîbûs ', q('perGroup'), ' xwendekaran dibe.']];
          if (rem === 'roundUp') { ask = ['Çend mînîbûs lazim in?']; ans = '{x} mînîbûs lazim in.'; }
          else { out.push(['Mînîbûs dê tije bibin.']); ask = ['Çend xwendekar li derve dimînin?']; ans = '{x} xwendekar li derve dimînin.'; }
        }
      } else {
        if (v === 'multiply') {
          out = [[q('groups'), ' minibuses went on the trip.'], ['Each minibus carried ', q('perGroup'), ' pupils.']];
          ask = ['How many pupils went on the trip?']; ans = '{x} pupils went on the trip.';
        } else if (v === 'partitive') {
          out = [[q('total'), ' pupils got on ', q('groups'), ' minibuses equally.']];
          ask = ['How many pupils are on each minibus?']; ans = 'There are {x} pupils on each minibus.';
        } else if (!rem) {
          out = [[q('total'), ' pupils got on the minibuses.'], ['Each minibus has ', q('perGroup'), ' pupils.']];
          ask = ['How many minibuses were filled?']; ans = '{x} minibuses were filled.';
        } else {
          out = [[q('total'), ' pupils are going on a trip.'], ['One minibus carries ', q('perGroup'), ' pupils.']];
          if (rem === 'roundUp') { ask = ['How many minibuses are needed?']; ans = '{x} minibuses are needed.'; }
          else { out.push(['The minibuses will be full.']); ask = ['How many pupils will have no seat?']; ans = '{x} pupils will have no seat.'; }
        }
      }
      text[lang] = [...out.map((p) => S(...p)), Q(...ask)];
      answer[lang] = ans;
    }
    const inCont = v === 'quotative' && rem !== 'remainderIsAnswer';
    return {
      text, answer,
      unit: inCont ? unitOf(fi.cont) : unitOf(fi.obj),
      labels: {
        groups: L('minibüs', 'mînîbûs', 'minibuses'),
        perGroup: L('her minibüste', 'di her mînîbûsê de', 'in each minibus'),
        total: L('bütün öğrenciler', 'hemû xwendekar', 'all pupils'),
      },
    };
  },
};

/** Birim fiyat: grup sayısı = alınan adet, grup başına = bir tanenin fiyatı, toplam = ödenen. */
const price: Frame = {
  id: 'groups.price', context: 'market', schema: 'equalGroups',
  variants: ['multiply', 'partitive', 'quotative'], minGrade: 2, unitKind: 'money',
  objs: ['simit', 'defter', 'kalem', 'top'], conts: ['paket'], maxWhole: 1000,
  render(fi) {
    const h = helpers(fi);
    const v = fi.step.variant;
    const { A } = h;
    const tl = nounOf('tl');
    const oGen = trGen(fi.obj.tr);
    const T = { tr: h.t, ku: h.k, en: h.e };
    const text = {} as Record<Lang, Sentence[]>;
    const answer = {} as L10n;
    for (const lang of LANGS) {
      const q = T[lang];
      let out: Part[][] = [];
      let ask: Part[] = [];
      let ans = '';
      if (lang === 'tr') {
        if (v === 'multiply') {
          out = [['Bir ', h.o, ' ', q('perGroup'), ' TL.'], [A.tr, ' ', q('groups'), ' ', h.o, ' aldı.']];
          ask = [A.tr, ' ne kadar para ödedi?']; ans = `${A.tr} {x} TL ödedi.`;
        } else if (v === 'partitive') {
          out = [[A.tr, ' ', q('groups'), ' ', h.o, ' aldı.'], [A.tr, ' hepsine ', q('total'), ' TL ödedi.']];
          ask = ['Bir ', oGen, ' fiyatı ne kadar?']; ans = `Bir ${oGen} fiyatı {x} TL.`;
        } else {
          out = [['Bir ', h.o, ' ', q('perGroup'), ' TL.'], [A.tr, ' ', h.oPl, ' için ', q('total'), ' TL ödedi.']];
          ask = [A.tr, ' kaç ', h.o, ' aldı?']; ans = `${A.tr} {x} ${h.o} aldı.`;
        }
      } else if (lang === 'ku') {
        // KU-DENETİM
        if (v === 'multiply') {
          out = [[h.ko, 'ek ', q('perGroup'), ' lîre ye.'], [h.kA, ' ', q('groups'), ' ', h.ko, ' kirîn.']];
          ask = [h.kA, ' çiqas pere da?']; ans = `${h.kA} {x} lîre dan.`;
        } else if (v === 'partitive') {
          out = [[h.kA, ' ', q('groups'), ' ', h.ko, ' kirîn.'], [h.kA, ' ji bo hemûyan ', q('total'), ' lîre dan.']];
          ask = ['Bihayê ', h.ko, 'ekê çiqas e?']; ans = `Bihayê ${h.ko}ekê {x} lîre ye.`;
        } else {
          out = [[h.ko, 'ek ', q('perGroup'), ' lîre ye.'], [h.kA, ' ji bo ', h.koObl, ' ', q('total'), ' lîre dan.']];
          ask = [h.kA, ' çend ', h.ko, ' kirîn?']; ans = `${h.kA} {x} ${h.ko} kirîn.`;
        }
      } else {
        if (v === 'multiply') {
          out = [['One ', h.eo1, ' costs ', q('perGroup'), ' lira.'], [A.en, ' bought ', q('groups'), ' ', h.eo, '.']];
          ask = ['How much did ', A.en, ' pay?']; ans = `${A.en} paid {x} lira.`;
        } else if (v === 'partitive') {
          out = [[A.en, ' bought ', q('groups'), ' ', h.eo, '.'], [A.en, ' paid ', q('total'), ' lira for them all.']];
          ask = ['How much does one ', h.eo1, ' cost?']; ans = `One ${h.eo1} costs {x} lira.`;
        } else {
          out = [['One ', h.eo1, ' costs ', q('perGroup'), ' lira.'], [A.en, ' paid ', q('total'), ' lira for ', h.eo, '.']];
          ask = ['How many ', h.eo, ' did ', A.en, ' buy?']; ans = `${A.en} bought {x} ${h.eo}.`;
        }
      }
      text[lang] = [...out.map((p) => S(...p)), Q(...ask)];
      answer[lang] = ans;
    }
    return {
      text, answer,
      unit: v === 'quotative' ? unitOf(fi.obj) : unitOf(tl),
      labels: {
        groups: L(`${h.o} sayısı`, `hejmara ${h.ko}`, `number of ${h.eo}`),
        perGroup: L(`bir ${h.o}`, `${h.ko}ek`, `one ${h.eo1}`),
        total: L('ödenen', 'pereyê hat dayîn', 'paid'),
      },
    };
  },
};

export const GROUP_FRAMES_B: Frame[] = [minibus, price];
