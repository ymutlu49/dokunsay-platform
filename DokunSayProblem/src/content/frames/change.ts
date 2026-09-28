/**
 * DEĞİŞİM şeması çerçeveleri (birleştirme `join` / ayırma `separate`).
 * Her çerçeve × alt tür × bilinmeyen × dil için bir cümle dizisi; 7 çerçeve × nesne × kişi.
 * 04 §D.3: olay sırası = anlatım sırası; durum "var/vardı", olay -DI; soru en sonda.
 */
import type { L10n, Lang, Segment, Sentence } from '../types';
import type { Part } from '../text';
import { S, Q } from '../text';
import type { Frame, FrameInput, FrameOut } from './types';
import { helpers, L, unitOf } from './types';

interface ChangeLang {
  before: (q: Segment | null) => Part[];
  event: (q: Segment | null) => Part[];
  after: (q: Segment) => Part[];
  askAfter: Part[];
  askEvent: Part[];
  askBefore: Part[];
  ans: { result: string; change: string; start: string };
}
type ChangeSpec = Record<Lang, ChangeLang>;

const LANGS: Lang[] = ['tr', 'ku', 'en'];

function compose(fi: FrameInput, spec: ChangeSpec, changeLabel: L10n, unit: L10n): FrameOut {
  const h = helpers(fi);
  // Başlangıç bilinmeyende açılış cümlesi ("Ağaçta bir miktar kuş vardı.") HER ZAMAN yazılır:
  // "Sonra…" ile başlayan hikâye bağlamsız kalıyor ve Canlandır'da gizli kutunun cümlesi olmuyordu.
  // rng çağrısı, aynı tohumun sonraki çekilişlerini korumak için bırakıldı.
  fi.rng.chance(0.4);
  const vagueBefore = true;
  const vagueEvent = true;
  const text = {} as Record<Lang, Sentence[]>;
  const answer = {} as L10n;
  for (const lang of LANGS) {
    const s = spec[lang];
    const ch = lang === 'tr' ? h.t : lang === 'ku' ? h.k : h.e;
    const out: Sentence[] = [];
    if (h.u === 'result') {
      out.push(S(...s.before(ch('start'))), S(...s.event(ch('change'))), Q(...s.askAfter));
    } else if (h.u === 'change') {
      out.push(S(...s.before(ch('start'))));
      if (vagueEvent) out.push(S(...s.event(null)));
      out.push(S(...s.after(ch('result'))), Q(...s.askEvent));
    } else {
      if (vagueBefore) out.push(S(...s.before(null)));
      out.push(S(...s.event(ch('change'))), S(...s.after(ch('result'))), Q(...s.askBefore));
    }
    text[lang] = out;
    answer[lang] = s.ans[h.u as 'result' | 'change' | 'start'];
  }
  return {
    text,
    answer,
    unit,
    labels: {
      start: L('başta', 'destpêk', 'at the start'),
      change: changeLabel,
      result: L('sonra', 'paşê', 'after'),
    },
  };
}

// ─── 1. Verme (kişiden kişiye) ─────────────────────────────────────────────
const give: Frame = {
  id: 'change.give',
  context: 'school',
  schema: 'change',
  variants: ['join', 'separate'],
  minGrade: 1,
  unitKind: 'count',
  objs: ['kalem', 'kart', 'ceviz', 'misket', 'kitap', 'balon', 'defter'],
  maxWhole: 999,
  render(fi) {
    const h = helpers(fi);
    const join = fi.step.variant === 'join';
    const { A, B } = h;
    const tr: ChangeLang = join
      ? {
          before: (q) => (q ? [h.gA, ' ', q, ' ', h.oP, ' vardı.'] : [h.gA, ' bir miktar ', h.oP, ' vardı.']),
          event: (q) => (q ? [B.tr, ', ', h.dA, ' ', q, ' ', h.o, ' verdi.'] : [B.tr, ', ', h.dA, ' birkaç ', h.o, ' verdi.']),
          after: (q) => ['Şimdi ', h.gA, ' ', q, ' ', h.oP, ' var.'],
          askAfter: h.pick([[h.gA, ' şimdi kaç ', h.oP, ' var?'], [h.gA, ' kaç ', h.oP, ' oldu?']]),
          askEvent: [B.tr, ', ', h.dA, ' kaç ', h.o, ' verdi?'],
          askBefore: [h.gA, ' başta kaç ', h.oP, ' vardı?'],
          ans: {
            result: `${h.gA} şimdi {x} ${h.oP} var.`,
            change: `${B.tr}, ${h.dA} {x} ${h.o} verdi.`,
            start: `${h.gA} başta {x} ${h.oP} vardı.`,
          },
        }
      : {
          before: (q) => (q ? [h.gA, ' ', q, ' ', h.oP, ' vardı.'] : [h.gA, ' bir miktar ', h.oP, ' vardı.']),
          event: (q) => (q ? [A.tr, ', ', h.dB, ' ', q, ' ', h.o, ' verdi.'] : [A.tr, ', ', h.dB, ' birkaç ', h.o, ' verdi.']),
          after: (q) => [h.gA, ' ', q, ' ', h.oP, ' kaldı.'],
          askAfter: h.pick([[h.gA, ' kaç ', h.oP, ' kaldı?'], [h.gA, ' şimdi kaç ', h.oP, ' var?']]),
          askEvent: [A.tr, ', ', h.dB, ' kaç ', h.o, ' verdi?'],
          askBefore: [h.gA, ' başta kaç ', h.oP, ' vardı?'],
          ans: {
            result: `${h.gA} {x} ${h.oP} kaldı.`,
            change: `${A.tr}, ${h.dB} {x} ${h.o} verdi.`,
            start: `${h.gA} başta {x} ${h.oP} vardı.`,
          },
        };
    // KU-DENETİM: ergatif geçmiş "Baranî 3 pênûs dan Rojdayê" (fiil nesneyle çoğul uyuşur).
    const ku: ChangeLang = join
      ? {
          before: (q) => (q ? [h.kA, ' ', q, ' ', h.ko, ' hebûn.'] : [h.kA, ' hinek ', h.ko, ' hebûn.']),
          event: (q) => (q ? [h.kB, ' ', q, ' ', h.ko, ' dan ', h.kA, '.'] : [h.kB, ' hinek ', h.ko, ' dan ', h.kA, '.']),
          after: (q) => ['Niha ', h.kA, ' ', q, ' ', h.ko, ' hene.'],
          askAfter: ['Niha ', h.kA, ' çend ', h.ko, ' hene?'],
          askEvent: [h.kB, ' çend ', h.ko, ' dan ', h.kA, '?'],
          askBefore: ['Di destpêkê de ', h.kA, ' çend ', h.ko, ' hebûn?'],
          ans: {
            result: `Niha ${h.kA} {x} ${h.ko} hene.`,
            change: `${h.kB} {x} ${h.ko} dan ${h.kA}.`,
            start: `Di destpêkê de ${h.kA} {x} ${h.ko} hebûn.`,
          },
        }
      : {
          before: (q) => (q ? [h.kA, ' ', q, ' ', h.ko, ' hebûn.'] : [h.kA, ' hinek ', h.ko, ' hebûn.']),
          event: (q) => (q ? [h.kA, ' ', q, ' ', h.ko, ' dan ', h.kB, '.'] : [h.kA, ' hinek ', h.ko, ' dan ', h.kB, '.']),
          after: (q) => [q, ' ', h.koEz, ' ', h.kA, ' man.'],
          askAfter: ['Çend ', h.koEz, ' ', h.kA, ' man?'],
          askEvent: [h.kA, ' çend ', h.ko, ' dan ', h.kB, '?'],
          askBefore: ['Di destpêkê de ', h.kA, ' çend ', h.ko, ' hebûn?'],
          ans: {
            result: `{x} ${h.koEz} ${h.kA} man.`,
            change: `${h.kA} {x} ${h.ko} dan ${h.kB}.`,
            start: `Di destpêkê de ${h.kA} {x} ${h.ko} hebûn.`,
          },
        };
    const en: ChangeLang = join
      ? {
          before: (q) => (q ? [A.en, ' had ', q, ' ', h.eo, '.'] : [A.en, ' had some ', h.eo, '.']),
          event: (q) => (q ? [B.en, ' gave ', A.en, ' ', q, ' ', h.eo, '.'] : [B.en, ' gave ', A.en, ' some more ', h.eo, '.']),
          after: (q) => ['Now ', A.en, ' has ', q, ' ', h.eo, '.'],
          askAfter: ['How many ', h.eo, ' does ', A.en, ' have now?'],
          askEvent: ['How many ', h.eo, ' did ', B.en, ' give ', A.en, '?'],
          askBefore: ['How many ', h.eo, ' did ', A.en, ' have at the start?'],
          ans: {
            result: `${A.en} has {x} ${h.eo} now.`,
            change: `${B.en} gave ${A.en} {x} ${h.eo}.`,
            start: `${A.en} had {x} ${h.eo} at the start.`,
          },
        }
      : {
          before: (q) => (q ? [A.en, ' had ', q, ' ', h.eo, '.'] : [A.en, ' had some ', h.eo, '.']),
          event: (q) => (q ? [A.en, ' gave ', B.en, ' ', q, ' ', h.eo, '.'] : [A.en, ' gave ', B.en, ' some ', h.eo, '.']),
          after: (q) => [A.en, ' has ', q, ' ', h.eo, ' left.'],
          askAfter: ['How many ', h.eo, ' does ', A.en, ' have left?'],
          askEvent: ['How many ', h.eo, ' did ', A.en, ' give ', B.en, '?'],
          askBefore: ['How many ', h.eo, ' did ', A.en, ' have at the start?'],
          ans: {
            result: `${A.en} has {x} ${h.eo} left.`,
            change: `${A.en} gave ${B.en} {x} ${h.eo}.`,
            start: `${A.en} had {x} ${h.eo} at the start.`,
          },
        };
    const label = join ? L('verilen', 'yên hatin dayîn', 'given') : L('verilen', 'yên hatin dayîn', 'given away');
    return compose(fi, { tr, ku, en }, label, unitOf(fi.obj));
  },
};

// ─── 2. Otobüs (biner / iner) ──────────────────────────────────────────────
const bus: Frame = {
  id: 'change.bus',
  context: 'bus',
  schema: 'change',
  variants: ['join', 'separate'],
  minGrade: 1,
  unitKind: 'count',
  objs: ['yolcu'],
  maxWhole: 90,
  render(fi) {
    const j = fi.step.variant === 'join';
    const verbTr = j ? 'bindi' : 'indi';
    const verbKu = j ? 'siwar bûn' : 'peya bûn';
    const verbEn = j ? 'got on' : 'got off';
    const tr: ChangeLang = {
      before: (q) => (q ? ['Otobüste ', q, ' yolcu vardı.'] : ['Otobüste bir miktar yolcu vardı.']),
      event: (q) => (q ? ['Durakta ', q, ` yolcu ${verbTr}.`] : [`Durakta birkaç yolcu ${verbTr}.`]),
      after: (q) => (j ? ['Şimdi otobüste ', q, ' yolcu var.'] : ['Otobüste ', q, ' yolcu kaldı.']),
      askAfter: j ? ['Şimdi otobüste kaç yolcu var?'] : ['Otobüste kaç yolcu kaldı?'],
      askEvent: [`Durakta kaç yolcu ${verbTr}?`],
      askBefore: ['Başta otobüste kaç yolcu vardı?'],
      ans: {
        result: j ? 'Şimdi otobüste {x} yolcu var.' : 'Otobüste {x} yolcu kaldı.',
        change: `Durakta {x} yolcu ${verbTr}.`,
        start: 'Başta otobüste {x} yolcu vardı.',
      },
    };
    // KU-DENETİM: geçişsiz geçmiş (siwar bûn / peya bûn) özneyle çoğul uyuşur.
    const ku: ChangeLang = {
      before: (q) => (q ? ['Di otobusê de ', q, ' rêwî hebûn.'] : ['Di otobusê de hinek rêwî hebûn.']),
      event: (q) => (q ? ['Li rawestgehê ', q, ` rêwî ${verbKu}.`] : [`Li rawestgehê hinek rêwî ${verbKu}.`]),
      after: (q) => (j ? ['Niha di otobusê de ', q, ' rêwî hene.'] : [q, ' rêwî di otobusê de man.']),
      askAfter: j ? ['Niha di otobusê de çend rêwî hene?'] : ['Çend rêwî di otobusê de man?'],
      askEvent: [`Li rawestgehê çend rêwî ${verbKu}?`],
      askBefore: ['Di destpêkê de di otobusê de çend rêwî hebûn?'],
      ans: {
        result: j ? 'Niha di otobusê de {x} rêwî hene.' : '{x} rêwî di otobusê de man.',
        change: `Li rawestgehê {x} rêwî ${verbKu}.`,
        start: 'Di destpêkê de di otobusê de {x} rêwî hebûn.',
      },
    };
    const en: ChangeLang = {
      before: (q) => (q ? ['There were ', q, ' passengers on the bus.'] : ['There were some passengers on the bus.']),
      event: (q) => (q ? ['At the stop, ', q, ` passengers ${verbEn}.`] : [`At the stop, some passengers ${verbEn}.`]),
      after: (q) => (j ? ['Now there are ', q, ' passengers on the bus.'] : [q, ' passengers are left on the bus.']),
      askAfter: j ? ['How many passengers are on the bus now?'] : ['How many passengers are left on the bus?'],
      askEvent: [`How many passengers ${verbEn} at the stop?`],
      askBefore: ['How many passengers were on the bus at the start?'],
      ans: {
        result: j ? 'There are {x} passengers on the bus now.' : '{x} passengers are left on the bus.',
        change: `{x} passengers ${verbEn} at the stop.`,
        start: 'There were {x} passengers on the bus at the start.',
      },
    };
    return compose(fi, { tr, ku, en }, j ? L('binen', 'yên siwar bûn', 'got on') : L('inen', 'yên peya bûn', 'got off'), unitOf(fi.obj));
  },
};

// ─── 3. Daldaki kuşlar ─────────────────────────────────────────────────────
const birds: Frame = {
  id: 'change.birds',
  context: 'garden',
  schema: 'change',
  variants: ['join', 'separate'],
  minGrade: 1,
  unitKind: 'count',
  objs: ['kus'],
  maxWhole: 60,
  render(fi) {
    const j = fi.step.variant === 'join';
    const tr: ChangeLang = {
      before: (q) => (q ? ['Ağaçta ', q, ' kuş vardı.'] : ['Ağaçta bir miktar kuş vardı.']),
      event: (q) =>
        j ? (q ? ['Sonra ', q, ' kuş daha kondu.'] : ['Sonra birkaç kuş daha kondu.'])
          : (q ? [q, ' kuş uçup gitti.'] : ['Birkaç kuş uçup gitti.']),
      after: (q) => (j ? ['Şimdi ağaçta ', q, ' kuş var.'] : ['Ağaçta ', q, ' kuş kaldı.']),
      askAfter: j ? ['Şimdi ağaçta kaç kuş var?'] : ['Ağaçta kaç kuş kaldı?'],
      askEvent: j ? ['Ağaca kaç kuş daha kondu?'] : ['Kaç kuş uçup gitti?'],
      askBefore: ['Başta ağaçta kaç kuş vardı?'],
      ans: {
        result: j ? 'Şimdi ağaçta {x} kuş var.' : 'Ağaçta {x} kuş kaldı.',
        change: j ? 'Ağaca {x} kuş daha kondu.' : '{x} kuş uçup gitti.',
        start: 'Başta ağaçta {x} kuş vardı.',
      },
    };
    // KU-DENETİM
    const ku: ChangeLang = {
      before: (q) => (q ? ['Li ser darê ', q, ' çûk hebûn.'] : ['Li ser darê hinek çûk hebûn.']),
      event: (q) =>
        j ? (q ? ['Paşê ', q, ' çûkên din jî hatin.'] : ['Paşê hinek çûkên din jî hatin.'])
          : (q ? [q, ' çûk firiyan û çûn.'] : ['Hinek çûk firiyan û çûn.']),
      after: (q) => (j ? ['Niha li ser darê ', q, ' çûk hene.'] : [q, ' çûk li ser darê man.']),
      askAfter: j ? ['Niha li ser darê çend çûk hene?'] : ['Çend çûk li ser darê man?'],
      askEvent: j ? ['Çend çûkên din hatin?'] : ['Çend çûk firiyan û çûn?'],
      askBefore: ['Di destpêkê de li ser darê çend çûk hebûn?'],
      ans: {
        result: j ? 'Niha li ser darê {x} çûk hene.' : '{x} çûk li ser darê man.',
        change: j ? '{x} çûkên din hatin.' : '{x} çûk firiyan û çûn.',
        start: 'Di destpêkê de li ser darê {x} çûk hebûn.',
      },
    };
    const en: ChangeLang = {
      before: (q) => (q ? ['There were ', q, ' birds in a tree.'] : ['There were some birds in a tree.']),
      event: (q) =>
        j ? (q ? ['Then ', q, ' more birds landed.'] : ['Then some more birds landed.'])
          : (q ? [q, ' birds flew away.'] : ['Some birds flew away.']),
      after: (q) => (j ? ['Now there are ', q, ' birds in the tree.'] : [q, ' birds are left in the tree.']),
      askAfter: j ? ['How many birds are in the tree now?'] : ['How many birds are left in the tree?'],
      askEvent: j ? ['How many more birds landed?'] : ['How many birds flew away?'],
      askBefore: ['How many birds were in the tree at the start?'],
      ans: {
        result: j ? 'There are {x} birds in the tree now.' : '{x} birds are left in the tree.',
        change: j ? '{x} more birds landed.' : '{x} birds flew away.',
        start: 'There were {x} birds in the tree at the start.',
      },
    };
    return compose(fi, { tr, ku, en }, j ? L('gelen', 'yên hatin', 'came') : L('giden', 'yên çûn', 'went'), unitOf(fi.obj));
  },
};

// ─── 4. Fırın tepsisi ──────────────────────────────────────────────────────
const bakery: Frame = {
  id: 'change.bakery',
  context: 'bakery',
  schema: 'change',
  variants: ['join', 'separate'],
  minGrade: 1,
  unitKind: 'count',
  objs: ['simit', 'kurabiye'],
  maxWhole: 200,
  render(fi) {
    const h = helpers(fi);
    const j = fi.step.variant === 'join';
    const tr: ChangeLang = {
      before: (q) => (q ? ['Tepside ', q, ' ', h.o, ' vardı.'] : ['Tepside bir miktar ', h.o, ' vardı.']),
      event: (q) =>
        j ? (q ? ['Fırıncı ', q, ' ', h.o, ' daha pişirdi.'] : ['Fırıncı birkaç ', h.o, ' daha pişirdi.'])
          : (q ? ['Fırıncı ', q, ' ', h.o, ' sattı.'] : ['Fırıncı birkaç ', h.o, ' sattı.']),
      after: (q) => (j ? ['Şimdi tepside ', q, ' ', h.o, ' var.'] : ['Tepside ', q, ' ', h.o, ' kaldı.']),
      askAfter: j ? ['Şimdi tepside kaç ', h.o, ' var?'] : ['Tepside kaç ', h.o, ' kaldı?'],
      askEvent: j ? ['Fırıncı kaç ', h.o, ' daha pişirdi?'] : ['Fırıncı kaç ', h.o, ' sattı?'],
      askBefore: ['Başta tepside kaç ', h.o, ' vardı?'],
      ans: {
        result: j ? `Şimdi tepside {x} ${h.o} var.` : `Tepside {x} ${h.o} kaldı.`,
        change: j ? `Fırıncı {x} ${h.o} daha pişirdi.` : `Fırıncı {x} ${h.o} sattı.`,
        start: `Başta tepside {x} ${h.o} vardı.`,
      },
    };
    // KU-DENETİM: "nanpêjê … pijandin / firotin" ergatif.
    const ku: ChangeLang = {
      before: (q) => (q ? ['Li ser sêniyê ', q, ' ', h.ko, ' hebûn.'] : ['Li ser sêniyê hinek ', h.ko, ' hebûn.']),
      event: (q) =>
        j ? (q ? ['Nanpêjê ', q, ' ', h.ko, ' din jî pijandin.'] : ['Nanpêjê hinek ', h.ko, ' din jî pijandin.'])
          : (q ? ['Nanpêjê ', q, ' ', h.ko, ' firotin.'] : ['Nanpêjê hinek ', h.ko, ' firotin.']),
      after: (q) => (j ? ['Niha li ser sêniyê ', q, ' ', h.ko, ' hene.'] : [q, ' ', h.ko, ' li ser sêniyê man.']),
      askAfter: j ? ['Niha li ser sêniyê çend ', h.ko, ' hene?'] : ['Çend ', h.ko, ' li ser sêniyê man?'],
      askEvent: j ? ['Nanpêjê çend ', h.ko, ' din pijandin?'] : ['Nanpêjê çend ', h.ko, ' firotin?'],
      askBefore: ['Di destpêkê de li ser sêniyê çend ', h.ko, ' hebûn?'],
      ans: {
        result: j ? `Niha li ser sêniyê {x} ${h.ko} hene.` : `{x} ${h.ko} li ser sêniyê man.`,
        change: j ? `Nanpêjê {x} ${h.ko} din pijandin.` : `Nanpêjê {x} ${h.ko} firotin.`,
        start: `Di destpêkê de li ser sêniyê {x} ${h.ko} hebûn.`,
      },
    };
    const en: ChangeLang = {
      before: (q) => (q ? ['There were ', q, ' ', h.eo, ' on the tray.'] : ['There were some ', h.eo, ' on the tray.']),
      event: (q) =>
        j ? (q ? ['The baker baked ', q, ' more ', h.eo, '.'] : ['The baker baked some more ', h.eo, '.'])
          : (q ? ['The baker sold ', q, ' ', h.eo, '.'] : ['The baker sold some ', h.eo, '.']),
      after: (q) => (j ? ['Now there are ', q, ' ', h.eo, ' on the tray.'] : [q, ' ', h.eo, ' are left on the tray.']),
      askAfter: j ? ['How many ', h.eo, ' are on the tray now?'] : ['How many ', h.eo, ' are left on the tray?'],
      askEvent: j ? ['How many more ', h.eo, ' did the baker bake?'] : ['How many ', h.eo, ' did the baker sell?'],
      askBefore: ['How many ', h.eo, ' were on the tray at the start?'],
      ans: {
        result: j ? `There are {x} ${h.eo} on the tray now.` : `{x} ${h.eo} are left on the tray.`,
        change: j ? `The baker baked {x} more ${h.eo}.` : `The baker sold {x} ${h.eo}.`,
        start: `There were {x} ${h.eo} on the tray at the start.`,
      },
    };
    return compose(fi, { tr, ku, en }, j ? L('pişen', 'yên hatin pijandin', 'baked') : L('satılan', 'yên hatin firotin', 'sold'), unitOf(fi.obj));
  },
};

// ─── 5. Kütüphane ──────────────────────────────────────────────────────────
const library: Frame = {
  id: 'change.library',
  context: 'library',
  schema: 'change',
  variants: ['join', 'separate'],
  minGrade: 1,
  unitKind: 'count',
  objs: ['kitap'],
  maxWhole: 9999,
  render(fi) {
    const j = fi.step.variant === 'join';
    const tr: ChangeLang = {
      before: (q) => (q ? ['Kütüphanede ', q, ' kitap vardı.'] : ['Kütüphanede bir miktar kitap vardı.']),
      event: (q) =>
        j ? (q ? ['Kütüphaneye ', q, ' yeni kitap geldi.'] : ['Kütüphaneye birkaç yeni kitap geldi.'])
          : (q ? ['Öğrenciler ', q, ' kitap ödünç aldı.'] : ['Öğrenciler birkaç kitap ödünç aldı.']),
      after: (q) => (j ? ['Şimdi kütüphanede ', q, ' kitap var.'] : ['Kütüphanede ', q, ' kitap kaldı.']),
      askAfter: j ? ['Şimdi kütüphanede kaç kitap var?'] : ['Kütüphanede kaç kitap kaldı?'],
      askEvent: j ? ['Kütüphaneye kaç yeni kitap geldi?'] : ['Öğrenciler kaç kitap ödünç aldı?'],
      askBefore: ['Başta kütüphanede kaç kitap vardı?'],
      ans: {
        result: j ? 'Şimdi kütüphanede {x} kitap var.' : 'Kütüphanede {x} kitap kaldı.',
        change: j ? 'Kütüphaneye {x} yeni kitap geldi.' : 'Öğrenciler {x} kitap ödünç aldı.',
        start: 'Başta kütüphanede {x} kitap vardı.',
      },
    };
    // KU-DENETİM: "xwendekaran … deyn kirin" (ergatif çoğul oblik).
    const ku: ChangeLang = {
      before: (q) => (q ? ['Li pirtûkxaneyê ', q, ' pirtûk hebûn.'] : ['Li pirtûkxaneyê hinek pirtûk hebûn.']),
      event: (q) =>
        j ? (q ? [q, ' pirtûkên nû hatin pirtûkxaneyê.'] : ['Hinek pirtûkên nû hatin pirtûkxaneyê.'])
          : (q ? ['Xwendekaran ', q, ' pirtûk deyn kirin.'] : ['Xwendekaran hinek pirtûk deyn kirin.']),
      after: (q) => (j ? ['Niha li pirtûkxaneyê ', q, ' pirtûk hene.'] : [q, ' pirtûk li pirtûkxaneyê man.']),
      askAfter: j ? ['Niha li pirtûkxaneyê çend pirtûk hene?'] : ['Çend pirtûk li pirtûkxaneyê man?'],
      askEvent: j ? ['Çend pirtûkên nû hatin?'] : ['Xwendekaran çend pirtûk deyn kirin?'],
      askBefore: ['Di destpêkê de li pirtûkxaneyê çend pirtûk hebûn?'],
      ans: {
        result: j ? 'Niha li pirtûkxaneyê {x} pirtûk hene.' : '{x} pirtûk li pirtûkxaneyê man.',
        change: j ? '{x} pirtûkên nû hatin.' : 'Xwendekaran {x} pirtûk deyn kirin.',
        start: 'Di destpêkê de li pirtûkxaneyê {x} pirtûk hebûn.',
      },
    };
    const en: ChangeLang = {
      before: (q) => (q ? ['The library had ', q, ' books.'] : ['The library had some books.']),
      event: (q) =>
        j ? (q ? [q, ' new books arrived at the library.'] : ['Some new books arrived at the library.'])
          : (q ? ['Pupils borrowed ', q, ' books.'] : ['Pupils borrowed some books.']),
      after: (q) => (j ? ['Now the library has ', q, ' books.'] : ['The library has ', q, ' books left.']),
      askAfter: j ? ['How many books does the library have now?'] : ['How many books does the library have left?'],
      askEvent: j ? ['How many new books arrived?'] : ['How many books did the pupils borrow?'],
      askBefore: ['How many books did the library have at the start?'],
      ans: {
        result: j ? 'The library has {x} books now.' : 'The library has {x} books left.',
        change: j ? '{x} new books arrived.' : 'The pupils borrowed {x} books.',
        start: 'The library had {x} books at the start.',
      },
    };
    return compose(fi, { tr, ku, en }, j ? L('gelen', 'yên hatin', 'arrived') : L('ödünç alınan', 'yên hatin deynkirin', 'borrowed'), unitOf(fi.obj));
  },
};

// ─── 6. Para (harçlık / harcama) — 2. sınıftan ─────────────────────────────
const money: Frame = {
  id: 'change.money',
  context: 'money',
  schema: 'change',
  variants: ['join', 'separate'],
  minGrade: 2,
  unitKind: 'money',
  objs: ['tl'],
  maxWhole: 1000,
  render(fi) {
    const h = helpers(fi);
    const j = fi.step.variant === 'join';
    const { A } = h;
    const tr: ChangeLang = {
      before: (q) => (q ? [h.gA, ' ', q, " TL'si vardı."] : [h.gA, ' biraz parası vardı.']),
      event: (q) =>
        j ? (q ? [A.tr, ' bayramda ', q, ' TL harçlık aldı.'] : [A.tr, ' bayramda harçlık aldı.'])
          : (q ? [A.tr, ' kırtasiyede ', q, ' TL harcadı.'] : [A.tr, ' kırtasiyede biraz para harcadı.']),
      after: (q) => (j ? ['Şimdi ', h.gA, ' ', q, " TL'si var."] : [h.gA, ' ', q, " TL'si kaldı."]),
      askAfter: j ? [h.gA, ' şimdi ne kadar parası var?'] : [h.gA, ' ne kadar parası kaldı?'],
      askEvent: j ? [A.tr, ' ne kadar harçlık aldı?'] : [A.tr, ' ne kadar para harcadı?'],
      askBefore: [h.gA, ' başta ne kadar parası vardı?'],
      ans: {
        result: j ? `${h.gA} şimdi {x} TL'si var.` : `${h.gA} {x} TL'si kaldı.`,
        change: j ? `${A.tr} {x} TL harçlık aldı.` : `${A.tr} {x} TL harcadı.`,
        start: `${h.gA} başta {x} TL'si vardı.`,
      },
    };
    // KU-DENETİM: "wergirtin" / "xerc kirin" ergatif; pere tekil (heye/hebû).
    const ku: ChangeLang = {
      before: (q) => (q ? [h.kA, ' ', q, ' lîre hebûn.'] : [h.kA, ' hinek pere hebû.']),
      event: (q) =>
        j ? (q ? ['Di cejnê de ', h.kA, ' ', q, ' lîre wergirtin.'] : ['Di cejnê de ', h.kA, ' hinek pere wergirt.'])
          : (q ? [h.kA, ' ', q, ' lîre xerc kirin.'] : [h.kA, ' hinek pere xerc kir.']),
      after: (q) => (j ? ['Niha ', h.kA, ' ', q, ' lîre hene.'] : [q, ' lîreyên ', h.kA, ' man.']),
      askAfter: j ? ['Niha ', h.kA, ' çiqas pere heye?'] : [h.kA, ' çiqas pere ma?'],
      askEvent: j ? ['Di cejnê de ', h.kA, ' çiqas pere wergirt?'] : [h.kA, ' çiqas pere xerc kir?'],
      askBefore: ['Di destpêkê de ', h.kA, ' çiqas pere hebû?'],
      ans: {
        result: j ? `Niha ${h.kA} {x} lîre hene.` : `{x} lîreyên ${h.kA} man.`,
        change: j ? `${h.kA} {x} lîre wergirtin.` : `${h.kA} {x} lîre xerc kirin.`,
        start: `Di destpêkê de ${h.kA} {x} lîre hebûn.`,
      },
    };
    const en: ChangeLang = {
      before: (q) => (q ? [A.en, ' had ', q, ' lira.'] : [A.en, ' had some money.']),
      event: (q) =>
        j ? (q ? [A.en, ' got ', q, ' lira of holiday money.'] : [A.en, ' got some holiday money.'])
          : (q ? [A.en, ' spent ', q, ' lira at the stationer’s.'] : [A.en, ' spent some money at the stationer’s.']),
      after: (q) => (j ? ['Now ', A.en, ' has ', q, ' lira.'] : [A.en, ' has ', q, ' lira left.']),
      askAfter: j ? ['How much money does ', A.en, ' have now?'] : ['How much money does ', A.en, ' have left?'],
      askEvent: j ? ['How much holiday money did ', A.en, ' get?'] : ['How much money did ', A.en, ' spend?'],
      askBefore: ['How much money did ', A.en, ' have at the start?'],
      ans: {
        result: j ? `${A.en} has {x} lira now.` : `${A.en} has {x} lira left.`,
        change: j ? `${A.en} got {x} lira.` : `${A.en} spent {x} lira.`,
        start: `${A.en} had {x} lira at the start.`,
      },
    };
    return compose(fi, { tr, ku, en }, j ? L('harçlık', 'xercî', 'holiday money') : L('harcanan', 'yê hat xerckirin', 'spent'), unitOf(fi.obj));
  },
};

// ─── 7. Su deposu (litre) — 3. sınıftan ────────────────────────────────────
const water: Frame = {
  id: 'change.water',
  context: 'liquid',
  schema: 'change',
  variants: ['join', 'separate'],
  minGrade: 3,
  unitKind: 'liquid',
  objs: ['litre'],
  maxWhole: 500,
  render(fi) {
    const h = helpers(fi);
    const j = fi.step.variant === 'join';
    const { A } = h;
    const tr: ChangeLang = {
      before: (q) => (q ? ['Depoda ', q, ' litre su vardı.'] : ['Depoda bir miktar su vardı.']),
      event: (q) =>
        j ? (q ? [A.tr, ' depoya ', q, ' litre su ekledi.'] : [A.tr, ' depoya biraz su ekledi.'])
          : (q ? [A.tr, ' bahçe için ', q, ' litre su kullandı.'] : [A.tr, ' bahçe için biraz su kullandı.']),
      after: (q) => (j ? ['Şimdi depoda ', q, ' litre su var.'] : ['Depoda ', q, ' litre su kaldı.']),
      askAfter: j ? ['Şimdi depoda ne kadar su var?'] : ['Depoda ne kadar su kaldı?'],
      askEvent: j ? [A.tr, ' depoya ne kadar su ekledi?'] : [A.tr, ' ne kadar su kullandı?'],
      askBefore: ['Başta depoda ne kadar su vardı?'],
      ans: {
        result: j ? 'Şimdi depoda {x} litre su var.' : 'Depoda {x} litre su kaldı.',
        change: j ? `${A.tr} depoya {x} litre su ekledi.` : `${A.tr} {x} litre su kullandı.`,
        start: 'Başta depoda {x} litre su vardı.',
      },
    };
    // KU-DENETİM: av tekil (hebû/heye/ma).
    const ku: ChangeLang = {
      before: (q) => (q ? ['Di depoyê de ', q, ' lître av hebû.'] : ['Di depoyê de hinek av hebû.']),
      event: (q) =>
        j ? (q ? [h.kA, ' ', q, ' lître av kir nav depoyê.'] : [h.kA, ' hinek av kir nav depoyê.'])
          : (q ? [h.kA, ' ji bo baxçe ', q, ' lître av bi kar anî.'] : [h.kA, ' ji bo baxçe hinek av bi kar anî.']),
      after: (q) => (j ? ['Niha di depoyê de ', q, ' lître av heye.'] : [q, ' lître av di depoyê de ma.']),
      askAfter: j ? ['Niha di depoyê de çiqas av heye?'] : ['Çiqas av di depoyê de ma?'],
      askEvent: j ? [h.kA, ' çiqas av kir nav depoyê?'] : [h.kA, ' çiqas av bi kar anî?'],
      askBefore: ['Di destpêkê de di depoyê de çiqas av hebû?'],
      ans: {
        result: j ? 'Niha di depoyê de {x} lître av heye.' : '{x} lître av di depoyê de ma.',
        change: j ? `${h.kA} {x} lître av kir nav depoyê.` : `${h.kA} {x} lître av bi kar anî.`,
        start: 'Di destpêkê de di depoyê de {x} lître av hebû.',
      },
    };
    const en: ChangeLang = {
      before: (q) => (q ? ['There were ', q, ' litres of water in the tank.'] : ['There was some water in the tank.']),
      event: (q) =>
        j ? (q ? [A.en, ' added ', q, ' litres of water.'] : [A.en, ' added some water.'])
          : (q ? [A.en, ' used ', q, ' litres of water for the garden.'] : [A.en, ' used some water for the garden.']),
      after: (q) => (j ? ['Now there are ', q, ' litres of water in the tank.'] : [q, ' litres of water are left in the tank.']),
      askAfter: j ? ['How much water is in the tank now?'] : ['How much water is left in the tank?'],
      askEvent: j ? ['How much water did ', A.en, ' add?'] : ['How much water did ', A.en, ' use?'],
      askBefore: ['How much water was in the tank at the start?'],
      ans: {
        result: j ? 'There are {x} litres of water in the tank now.' : '{x} litres of water are left in the tank.',
        change: j ? `${A.en} added {x} litres of water.` : `${A.en} used {x} litres of water.`,
        start: 'There were {x} litres of water in the tank at the start.',
      },
    };
    return compose(fi, { tr, ku, en }, j ? L('eklenen', 'ya hat zêdekirin', 'added') : L('kullanılan', 'ya hat bikaranîn', 'used'), unitOf(fi.obj));
  },
};

export const CHANGE_FRAMES: Frame[] = [give, bus, birds, bakery, library, money, water];
