/**
 * GEÇİCİ içerik API taklidi. Gerçek motor `src/content/index.ts` hazır olunca
 * `src/lib/content.ts` içindeki TEK satır değiştirilir; bu dosya silinebilir.
 * Adlar ve dönüş biçimleri sözleşmedeki API ile aynıdır (bkz. görev tanımı):
 * generateProblem, generateSet, SCHEMA_META, ROLE_LABEL, equationOf, checkSchema,
 * checkModel, checkEquation, checkAnswer, hintFor, feedbackFor, selfTalk, renderAnswer,
 * sentenceText, sentenceSpeech, paraphraseFor, VOCAB, vocabInSentence, MISCONCEPTIONS,
 * LADDER, validateProblem.
 */
import type {
  ErrorClass,
  ExtraQuantity,
  FlowStepId,
  Grade,
  L10n,
  Lang,
  ParaphraseItem,
  Problem,
  ProblemSpec,
  Role,
  SchemaId,
  SchemaStep,
  Sentence,
} from '../content/types';
import { FIXTURES, FIXTURE_PARAPHRASE } from './fixtures';

const L = (tr: string, ku: string, en: string): L10n => ({ tr, ku, en });

// ─── Şema ve rol meta verisi ────────────────────────────────────────────────
export const SCHEMA_META: Record<
  SchemaId,
  { name: L10n; short: L10n; story: L10n; rule: L10n; equation: L10n; color: string; icon: string }
> = {
  change: {
    name: L('Değişim', 'Guherîn', 'Change'),
    short: L('Bir şey gelir ya da gider.', 'Tiştek tê an diçe.', 'Something comes or goes.'),
    story: L('Başta bir miktar var; sonra bir değişim oluyor.', 'Di destpêkê de hinek heye; paşê guherînek çêdibe.', 'There is an amount at first; then something changes.'), // KU-DENETİM
    rule: L('Başta – değişim – sonra.', 'Destpêk – guherîn – paşê.', 'Start – change – result.'),
    equation: L('Başta ± Değişim = Sonra', 'Destpêk ± Guherîn = Paşê', 'Start ± Change = Result'),
    color: '#0072b2',
    icon: 'change',
  },
  combine: {
    name: L('Parça-Bütün', 'Par û Gişt', 'Part-Whole'),
    short: L('İki parça bir bütün.', 'Du par yek gişt.', 'Two parts make a whole.'),
    story: L('İki grup var; birlikte bir bütün oluştururlar.', 'Du kom hene; bi hev re gişt çêdikin.', 'There are two groups; together they make a whole.'), // KU-DENETİM
    rule: L('Parça + parça = bütün.', 'Par + par = gişt.', 'Part + part = whole.'),
    equation: L('Parça + Parça = Bütün', 'Par + Par = Gişt', 'Part + Part = Whole'),
    color: '#009e73',
    icon: 'combine',
  },
  compare: {
    name: L('Karşılaştırma', 'Berhevdan', 'Compare'),
    short: L('İki miktar yan yana.', 'Du hejmar li kêleka hev.', 'Two amounts side by side.'),
    story: L('İki şeyi karşılaştırıyoruz: hangisi ne kadar çok?', 'Em du tiştan berhev dikin: kîjan çiqas zêdetir e?', 'We compare two things: which has how many more?'), // KU-DENETİM
    rule: L('Büyük − küçük = fark.', 'Mezin − biçûk = kemok.', 'Larger − smaller = difference.'),
    equation: L('Büyük − Küçük = Fark', 'Mezin − Biçûk = Kemok', 'Larger − Smaller = Difference'),
    color: '#cc79a7',
    icon: 'compare',
  },
  equalGroups: {
    name: L('Eşit Gruplar', 'Komên Wekhev', 'Equal Groups'),
    short: L('Her grupta aynı sayıda.', 'Di her komê de heman hejmar.', 'The same number in each group.'),
    story: L('Eşit gruplar var; grup sayısı, grup başına düşen ve toplam.', 'Komên wekhev hene; hejmara koman, ya her komê û hemû.', 'Equal groups: number of groups, amount in each, total.'), // KU-DENETİM
    rule: L('Grup sayısı × grup başına = toplam.', 'Hejmara koman × ya her komê = hemû.', 'Groups × each = total.'),
    equation: L('Grup × Grup başına = Toplam', 'Kom × Her kom = Hemû', 'Groups × Each = Total'),
    color: '#e69f00',
    icon: 'equalGroups',
  },
  multCompare: {
    name: L('Kat Karşılaştırması', 'Berhevdana Caran', 'Times as Many'),
    short: L('Biri ötekinin birkaç katı.', 'Yek çend carî yê din e.', 'One is several times the other.'), // KU-DENETİM
    story: L('Bir miktar, ötekinin kaç katı?', 'Hejmarek çend carî ya din e?', 'How many times as many is one amount?'),
    rule: L('Kat × referans = karşılaştırılan.', 'Car × referans = yê berhevkirî.', 'Times × reference = compared.'), // KU-DENETİM
    equation: L('Kat × Referans = Karşılaştırılan', 'Car × Referans = Berhevkirî', 'Times × Reference = Compared'),
    color: '#56b4e9',
    icon: 'multCompare',
  },
};

export const ROLE_LABEL: Record<Role, L10n> = {
  start: L('Başta', 'Destpêk', 'Start'),
  change: L('Değişim', 'Guherîn', 'Change'),
  result: L('Sonra', 'Paşê', 'Result'),
  part1: L('Parça', 'Par', 'Part'),
  part2: L('Parça', 'Par', 'Part'),
  whole: L('Bütün', 'Gişt', 'Whole'),
  larger: L('Büyük', 'Mezin', 'Larger'),
  smaller: L('Küçük', 'Biçûk', 'Smaller'),
  difference: L('Fark', 'Kemok', 'Difference'),
  groups: L('Grup sayısı', 'Hejmara koman', 'Groups'),
  perGroup: L('Grup başına', 'Her kom', 'Each group'),
  total: L('Toplam', 'Hemû', 'Total'),
  reference: L('Referans', 'Referans', 'Reference'),
  factor: L('Kat', 'Car', 'Times'),
  compared: L('Karşılaştırılan', 'Berhevkirî', 'Compared'),
};

// ─── Denklem ───────────────────────────────────────────────────────────────
export type EqToken = number | '?' | '+' | '−' | '×' | '÷' | '=';

type Form = [Role, '+' | '−' | '×' | '÷', Role, Role];
const FORMS: Record<string, Form[]> = {
  join: [['start', '+', 'change', 'result'], ['change', '+', 'start', 'result'], ['result', '−', 'change', 'start'], ['result', '−', 'start', 'change']],
  separate: [['start', '−', 'change', 'result'], ['start', '−', 'result', 'change'], ['result', '+', 'change', 'start'], ['change', '+', 'result', 'start']],
  combine: [['part1', '+', 'part2', 'whole'], ['part2', '+', 'part1', 'whole'], ['whole', '−', 'part1', 'part2'], ['whole', '−', 'part2', 'part1']],
  compare: [['larger', '−', 'smaller', 'difference'], ['smaller', '+', 'difference', 'larger'], ['difference', '+', 'smaller', 'larger'], ['larger', '−', 'difference', 'smaller']],
  equalGroups: [['groups', '×', 'perGroup', 'total'], ['perGroup', '×', 'groups', 'total'], ['total', '÷', 'groups', 'perGroup'], ['total', '÷', 'perGroup', 'groups']],
  multCompare: [['factor', '×', 'reference', 'compared'], ['reference', '×', 'factor', 'compared'], ['compared', '÷', 'factor', 'reference'], ['compared', '÷', 'reference', 'factor']],
};

function formsOf(step: SchemaStep): Form[] {
  if (step.schema === 'change') return FORMS[step.variant === 'separate' ? 'separate' : 'join'];
  return FORMS[step.schema];
}

function val(step: SchemaStep, r: Role): EqToken {
  if (r === step.unknown) return '?';
  return step.quantities.find((x) => x.role === r)?.value ?? 0;
}

function formTokens(step: SchemaStep, f: Form): EqToken[] {
  return [val(step, f[0]), f[1], val(step, f[2]), '=', val(step, f[3])];
}

export function equationOf(step: SchemaStep): { tokens: EqToken[]; alternatives: EqToken[][] } {
  const all = formsOf(step).map((f) => formTokens(step, f));
  // Birincil biçim: bilinmeyen sonda olan (varsa) — yoksa ilk biçim.
  const primary = all.find((t) => t[4] === '?') ?? all[0];
  return { tokens: primary, alternatives: all.filter((t) => t !== primary) };
}

export function checkSchema(step: SchemaStep, chosen: SchemaId): boolean {
  return step.schema === chosen;
}

export function checkModel(
  step: SchemaStep,
  placements: Partial<Record<Role, number | '?'>>,
  extras: ExtraQuantity[],
): { ok: boolean; perRole: Partial<Record<Role, boolean>>; error?: ErrorClass } {
  const perRole: Partial<Record<Role, boolean>> = {};
  let error: ErrorClass | undefined;
  for (const qn of step.quantities) {
    const placed = placements[qn.role];
    const want: number | '?' = qn.role === step.unknown ? '?' : qn.value;
    const ok = placed === want;
    perRole[qn.role] = ok;
    if (!ok && !error) {
      if (placed === '?' || want === '?') error = 'unknownPlacement';
      else if (typeof placed === 'number' && extras.some((e) => e.value === placed) && !step.quantities.some((x) => x.value === placed)) error = 'irrelevantUsed';
      else error = 'modelPlacement';
    }
  }
  const ok = Object.values(perRole).every(Boolean);
  return ok ? { ok, perRole } : { ok, perRole, error };
}

const same = (a: EqToken[], b: EqToken[]) => a.length === b.length && a.every((x, i) => x === b[i]);

export function checkEquation(step: SchemaStep, tokens: EqToken[]): { ok: boolean; error?: ErrorClass } {
  const all = formsOf(step).map((f) => formTokens(step, f));
  if (all.some((f) => same(f, tokens))) return { ok: true };
  if (!tokens.includes('?')) return { ok: false, error: 'unknownPlacement' };
  const nums = tokens.filter((x) => typeof x === 'number') as number[];
  const known = step.quantities.filter((x) => x.role !== step.unknown).map((x) => x.value);
  if (nums.some((n) => !known.includes(n))) return { ok: false, error: 'irrelevantUsed' };
  return { ok: false, error: 'operation' };
}

export function checkAnswer(problem: Problem, value: number): { ok: boolean; error?: ErrorClass } {
  if (value === problem.answer) return { ok: true };
  const last = problem.steps[problem.steps.length - 1];
  if (last.remainder) {
    const raw = last.quantities.find((x) => x.role === last.unknown)?.value;
    if (value === raw || value === last.remainder.value) return { ok: false, error: 'unitOrRemainder' };
  }
  const known = last.quantities.filter((x) => x.role !== last.unknown).map((x) => x.value);
  if (known.length === 2) {
    const [a, b] = known;
    const wrongOps = [a + b, Math.abs(a - b), a * b];
    if (wrongOps.includes(value)) return { ok: false, error: problem.axes.L === 1 ? 'reversal' : 'operation' };
  }
  return { ok: false, error: 'computation' };
}

// ─── İpucu, geri bildirim, öz-sorgu ────────────────────────────────────────
type Group = 'understand' | 'show' | 'estimate' | 'solve' | 'check';
const GROUP: Record<FlowStepId, Group> = {
  read: 'understand', retell: 'understand', question: 'understand', known: 'understand',
  schema: 'show', model: 'show', checkModel: 'show',
  estimate: 'estimate',
  equation: 'solve', compute: 'solve',
  answer: 'check', reasonable: 'check', reflect: 'check',
};

const HINTS: Record<Group, [L10n, L10n, L10n, L10n]> = {
  understand: [
    L('Hikâyeyi bir kez daha dinleyelim mi?', 'Em careke din guhdarî çîrokê bikin?', 'Shall we listen to the story once more?'),
    L('Kim var? Ne oldu? Sonra ne oldu?', 'Kî heye? Çi bû? Paşê çi bû?', 'Who is there? What happened? Then what?'),
    L('Soru cümlesine bak: ne soruluyor?', 'Li hevoka pirsê binêre: çi tê pirsîn?', 'Look at the question sentence: what is asked?'),
    L('Rehber hikâyeyi senin için yeniden anlatıyor.', 'Rêber çîrokê ji bo te dîsa vedibêje.', 'The guide retells the story for you.'),
  ],
  show: [
    L('Hikâyede önce ne vardı? Sonra ne oldu?', 'Di çîrokê de pêşî çi hebû? Paşê çi bû?', 'What was there first in the story? What happened next?'),
    L('Bu türün kuralını hatırla.', 'Qaîdeya vê curê bîne bîra xwe.', 'Remember the rule of this type.'),
    L('Bir kutuyu senin için doldurdum. Gerisine bak.', 'Min qutiyek ji bo te dagirt. Li yên din binêre.', 'I filled one box for you. Look at the rest.'),
    L('Rehber modeli kuruyor. Sonra aynı türden yeni bir problemi sen çözeceksin.', 'Rêber modelê ava dike. Paşê tu yê pirsgirêkeke nû ya heman curî çareser bikî.', 'The guide builds the model. Then you will solve a new one of the same type.'),
  ],
  estimate: [
    L('Bütün mü arıyoruz, parça mı?', 'Em li gişt digerin an li par?', 'Are we looking for a whole or a part?'),
    L('Bütün, parçalardan büyüktür.', 'Gişt ji paran mezintir e.', 'The whole is bigger than its parts.'),
    L('Modeldeki şeritlerin boyuna bak.', 'Li dirêjahiya şerîdên modelê binêre.', 'Look at the length of the bars in the model.'),
    L('Tahmin puanlanmaz. İstediğini seç.', 'Texmîn nayê puankirin. Kîjan dixwazî hilbijêre.', 'Estimates are not scored. Choose any.'),
  ],
  solve: [
    L('Modelinde ? bütün mü, parça mı?', 'Di modela te de ? gişt e an par e?', 'In your model, is ? a whole or a part?'),
    L('Bütün bilinmiyorsa parçaları birleştiririz; parça bilinmiyorsa bütünden ayırırız.', 'Ger gişt nenas be em paran dicivînin; ger par nenas be em ji giştê vediqetînin.', 'If the whole is unknown we join the parts; if a part is unknown we take it from the whole.'), // KU-DENETİM
    L('İşaret seçeneklerini ikiye indirdim.', 'Min vebijarkên nîşanan kirin du.', 'I narrowed the signs down to two.'),
    L('Rehber işlem cümlesini gösteriyor; hesabı sen yap.', 'Rêber hevkêşeyê nîşan dide; hesab tu bike.', 'The guide shows the number sentence; you do the calculation.'),
  ],
  check: [
    L('Cevabını hikâyeye koyup dinleyelim.', 'Em bersiva te têxin çîrokê û guhdarî bikin.', "Let's put your answer in the story and listen."),
    L('Tahminin ile cevabın arasında büyük fark var mı?', 'Di navbera texmîn û bersiva te de cudahiyeke mezin heye?', 'Is there a big difference between your estimate and your answer?'),
    L('Ters işlemle kontrol et.', 'Bi kirariya berevajî kontrol bike.', 'Check with the inverse operation.'),
    L('Rehber doğrulamayı sesli yapıyor.', 'Rêber kontrolê bi deng dike.', 'The guide checks it aloud.'),
  ],
};

export function hintFor(problem: Problem, stepId: FlowStepId, level: 1 | 2 | 3 | 4): L10n {
  const g = GROUP[stepId] ?? 'understand';
  const h = HINTS[g][Math.min(4, Math.max(1, level)) - 1];
  if (g === 'show' && level === 2) {
    const m = SCHEMA_META[problem.steps[0].schema];
    return { tr: `${m.name.tr}: ${m.rule.tr}`, ku: `${m.name.ku}: ${m.rule.ku}`, en: `${m.name.en}: ${m.rule.en}` };
  }
  return h;
}

export type FeedbackKind = 'correct' | 'tryAgain' | ErrorClass;

const FB: Record<FeedbackKind, L10n> = {
  correct: L('Evet! Dikkatle düşündün.', 'Erê! Te bi baldarî fikirî.', 'Yes! You thought carefully.'),
  tryAgain: L('Bir daha bakalım.', 'Em dîsa binêrin.', "Let's look again."),
  schemaId: L('Bir şey değişti mi, yoksa iki şey mi karşılaştırılıyor?', 'Tiştek guherî, an du tişt têne berhevkirin?', 'Did something change, or are two things compared?'),
  modelPlacement: L('Bazı kutular doğru. İşaretli kutuya bak: hikâyede bu sayı ne anlatıyor?', 'Hin qutî rast in. Li qutiya nîşankirî binêre: ev hejmar di çîrokê de çi dibêje?', 'Some boxes are right. Look at the marked box: what does this number tell in the story?'),
  unknownPlacement: L('? nerede olmalı? Soru neyi soruyor?', '? divê li ku be? Pirs çi dipirse?', 'Where should ? go? What does the question ask?'),
  irrelevantUsed: L('Bu sayı soruyla ilgili mi?', 'Ev hejmar bi pirsê re têkildar e?', 'Is this number related to the question?'),
  reversal: L('Kim daha çok? Kimden? Modeline bak.', 'Kî zêdetir e? Ji kê? Li modela xwe binêre.', 'Who has more? More than whom? Look at your model.'),
  textOrderOp: L('Başta kaç tane vardı, bilmiyoruz. Modelinde ? nerede?', 'Em nizanin di destpêkê de çend hebûn. Di modela te de ? li ku ye?', "We don't know how many there were at first. Where is ? in your model?"),
  operation: L('Bu işlem modeline uyuyor mu? ? bütün mü, parça mı?', 'Ev kirarî li modela te tê? ? gişt e an par?', 'Does this operation fit your model? Is ? a whole or a part?'),
  computation: L('Modelin ve işlemin doğru! Sadece hesapta bir kayma var. Hesap araçlarıyla bir daha dene.', 'Model û kirariya te rast in! Tenê di hesabê de şaşiyek heye. Bi amûrên hesabê dîsa biceribîne.', 'Your model and operation are right! Just a slip in the calculation. Try again with the tools.'),
  unitOrRemainder: L('Kalanı ne yapmalıyız? Hikâyeyi düşün.', 'Divê em bi jêmayê çi bikin? Li çîrokê bifikire.', 'What should we do with the remainder? Think about the story.'),
  unsolvableMissed: L('Bu soruyu çözmek için bir bilgi eksik olabilir mi?', 'Dibe ku ji bo çareserkirinê agahiyek kêm be?', 'Could some information be missing?'),
};

export function feedbackFor(kind: FeedbackKind, problem: Problem, stepId: FlowStepId): L10n {
  if (kind === 'correct' && (stepId === 'model' || stepId === 'checkModel')) {
    return L('Modelin hikâyeyi tam anlatıyor.', 'Modela te çîrokê bi temamî vedibêje.', 'Your model tells the whole story.');
  }
  if (kind === 'correct' && stepId === 'schema') {
    const m = SCHEMA_META[problem.steps[0].schema];
    return { tr: `Evet! Bu bir ${m.name.tr} problemi.`, ku: `Erê! Ev pirsgirêkeke ${m.name.ku} e.`, en: `Yes! This is a ${m.name.en} problem.` };
  }
  return FB[kind] ?? FB.tryAgain;
}

export const selfTalk: Record<FlowStepId, { say: L10n; ask: L10n; check: L10n }> = {
  read: { say: L('Problemi dikkatle dinliyorum.', 'Ez bi baldarî guhdarî pirsgirêkê dikim.', 'I listen to the problem carefully.'), ask: L('Bilmediğim bir sözcük var mı?', 'Peyveke ku ez nizanim heye?', 'Is there a word I do not know?'), check: L('Hepsini anladım mı?', 'Min hemû fêm kir?', 'Did I understand it all?') },
  retell: { say: L('Hikâyeyi kendi sözlerimle anlatıyorum.', 'Ez çîrokê bi gotinên xwe vedibêjim.', 'I tell the story in my own words.'), ask: L('Kim var? Ne oldu? Ne değişti?', 'Kî heye? Çi bû? Çi guherî?', 'Who is there? What happened? What changed?'), check: L('Anlattığım hikâye problemle aynı mı?', 'Çîroka min bi pirsgirêkê re yek e?', 'Is my story the same as the problem?') },
  question: { say: L('Ne bulmam gerekiyor?', 'Divê ez çi bibînim?', 'What do I need to find?'), ask: L('Cevabım ne cinsinden olacak?', 'Bersiva min dê bi çi be?', 'What will my answer be counted in?'), check: L('Soruyu doğru buldum mu?', 'Min pirs rast dît?', 'Did I find the question?') },
  known: { say: L('Hangi bilgiler işime yarar?', 'Kîjan agahî bi kêrî min tên?', 'Which facts are useful?'), ask: L('Bu sayı soruyla ilgili mi?', 'Ev hejmar bi pirsê re têkildar e?', 'Is this number about the question?'), check: L('Gereksiz bir sayı kullandım mı?', 'Min hejmareke nepêwîst bikar anî?', 'Did I use a number I do not need?') },
  schema: { say: L('Bu problem hangi türe benziyor?', 'Ev pirsgirêk dişibe kîjan curî?', 'Which type does this look like?'), ask: L('Daha önce çözdüğüm hangi probleme benziyor?', 'Dişibe kîjan pirsgirêka ku min berê çareser kir?', 'Which problem I solved before is it like?'), check: L('Bir şey değişti mi, yoksa iki şey mi karşılaştırılıyor?', 'Tiştek guherî an du tişt têne berhevkirin?', 'Did something change, or are two things compared?') },
  model: { say: L('Bildiklerimi modele yerleştiriyorum.', 'Ez tiştên ku dizanim dixim modelê.', 'I put what I know into the model.'), ask: L('Bütün hangisi? Parçalar hangileri? ? nerede?', 'Gişt kîjan e? Par kîjan in? ? li ku ye?', 'Which is the whole? Which are the parts? Where is ?'), check: L('Modelim hikâyeyi anlatıyor mu?', 'Modela min çîrokê vedibêje?', 'Does my model tell the story?') },
  checkModel: { say: L('Modelimi hikâyeyle karşılaştırıyorum.', 'Ez modela xwe bi çîrokê re berhev dikim.', 'I compare my model with the story.'), ask: L('Bütün, parçalardan büyük mü?', 'Gişt ji paran mezintir e?', 'Is the whole bigger than the parts?'), check: L('Model ile hikâye aynı mı?', 'Model û çîrok yek in?', 'Are the model and the story the same?') },
  estimate: { say: L('Cevabım yaklaşık ne olur?', 'Bersiva min dê nêzîkî çi be?', 'About what will my answer be?'), ask: L('Sonuç toplamdan büyük mü küçük mü olmalı?', 'Divê encam ji hemûyan mezintir be an biçûktir?', 'Should the result be bigger or smaller than the total?'), check: L('Tahminim modelime uyuyor mu?', 'Texmîna min li modela min tê?', 'Does my estimate fit my model?') },
  equation: { say: L('Modelimi işlem cümlesine çeviriyorum.', 'Ez modela xwe dikim hevkêşe.', 'I turn my model into a number sentence.'), ask: L('? denklemde nerede? Hangi işlem modele uyuyor?', '? di hevkêşeyê de li ku ye? Kîjan kirarî li modelê tê?', 'Where is ? in the sentence? Which operation fits the model?'), check: L('Denklemim modelimle aynı mı?', 'Hevkêşeya min bi modela min re yek e?', 'Is my number sentence the same as my model?') },
  compute: { say: L('Dikkatle hesaplıyorum.', 'Ez bi baldarî hesab dikim.', 'I calculate carefully.'), ask: L('Hangi yolla hesaplamak kolay?', 'Bi kîjan rê hesabkirin hêsan e?', 'Which way is easy to calculate?'), check: L('İşlemimi bir kez daha kontrol ettim mi?', 'Min kirariya xwe careke din kontrol kir?', 'Did I check my work once more?') },
  answer: { say: L('Cevabı cümleye koyuyorum.', 'Ez bersivê dixim hevokê.', 'I put the answer in a sentence.'), ask: L('Cevabım sorunun istediği şey mi?', 'Bersiva min ew e ku pirs dixwaze?', 'Is my answer what the question asks?'), check: L('Birimi yazdım mı? Kalanı ne yapmalıyım?', 'Min yeke nivîsî? Divê ez bi jêmayê çi bikim?', 'Did I write the unit? What about the remainder?') },
  reasonable: { say: L('Cevabımı hikâyeye koyuyorum.', 'Ez bersiva xwe dixim çîrokê.', 'I put my answer into the story.'), ask: L('Bu cevap gerçek hayatta olabilir mi?', 'Ev bersiv di jiyana rastî de dibe?', 'Could this answer happen in real life?'), check: L('Ters işlemle doğruladım mı?', 'Min bi kirariya berevajî kontrol kir?', 'Did I check with the inverse operation?') },
  reflect: { say: L('Ne yaptığımı düşünüyorum.', 'Ez li ser tiştê ku min kir difikirim.', 'I think about what I did.'), ask: L('Neyi iyi yaptım?', 'Min çi baş kir?', 'What did I do well?'), check: L('Bir dahaki sefere neyi farklı yaparım?', 'Cara bê ez ê çi cuda bikim?', 'What will I do differently next time?') },
};

// ─── Metin ────────────────────────────────────────────────────────────────
export function renderAnswer(problem: Problem, lang: Lang, x: number | string): string {
  return (problem.answerSentence[lang] || problem.answerSentence.tr).replace('{x}', String(x));
}

export function sentenceText(s: Sentence): string {
  return s.segments.map((g) => g.text).join('');
}

export function sentenceSpeech(s: Sentence, _lang: Lang): string {
  return s.segments.map((g) => (g.kind === 'qty' && g.speak ? g.speak : g.text)).join('');
}

export function paraphraseFor(problem: Problem): ParaphraseItem {
  const base = problem.id.replace(/-s\d+$/, '');
  const opts = FIXTURE_PARAPHRASE[base] ?? FIXTURE_PARAPHRASE['fx-change-join-1'];
  return { problemId: problem.id, options: opts };
}

export interface VocabEntry {
  id: string;
  word: L10n;
  meaning: L10n;
  match: Record<Lang, string[]>;
}

export const VOCAB: Record<string, VocabEntry> = {
  more: { id: 'more', word: L('fazla', 'zêdetir', 'more'), meaning: L('Biri ötekinden daha çok. Önce "kimden?" diye sor.', 'Yek ji yê din zêdetir e. Pêşî bipirse "ji kê?".', 'One has more than the other. First ask "than whom?".'), match: { tr: ['fazla'], ku: ['zêdetir'], en: ['more than'] } },
  fewer: { id: 'fewer', word: L('az', 'kêmtir', 'fewer'), meaning: L('Biri ötekinden daha az. "Kimden?" diye sor.', 'Yek ji yê din kêmtir e. Bipirse "ji kê?".', 'One has fewer than the other. Ask "than whom?".'), match: { tr: [' az '], ku: ['kêmtir'], en: ['fewer', 'less than'] } },
  each: { id: 'each', word: L('her', 'her yek', 'each'), meaning: L('Her birinde aynı sayıda var.', 'Di her yekê de heman hejmar heye.', 'Every one has the same number.'), match: { tr: ['her '], ku: ['her '], en: ['each', 'every'] } },
  equally: { id: 'equally', word: L('eşit', 'bi wekhevî', 'equally'), meaning: L('Hepsine aynı sayıda düşer.', 'Ji her yekê re heman hejmar dikeve.', 'Everyone gets the same number.'), match: { tr: ['eşit'], ku: ['wekhev'], en: ['equal'] } },
  times: { id: 'times', word: L('katı', 'carî', 'times as many'), meaning: L('3 katı: aynı miktardan 3 tane.', '3 carî: 3 caran heman hejmar.', '3 times as many: 3 groups of the same amount.'), match: { tr: ['katı'], ku: ['carî'], en: ['times'] } },
  atFirst: { id: 'atFirst', word: L('başta', 'di destpêkê de', 'at first'), meaning: L('Hikâyenin en başında, bir şey değişmeden önce.', 'Di destpêka çîrokê de, berî ku tiştek biguhere.', 'At the very beginning, before anything changes.'), match: { tr: ['başta'], ku: ['destpêkê'], en: ['at first'] } },
  atLeast: { id: 'atLeast', word: L('en az', 'herî kêm', 'at least'), meaning: L('Daha azı yetmez.', 'Kêmtir têr nake.', 'Fewer would not be enough.'), match: { tr: ['en az'], ku: ['herî kêm'], en: ['at least'] } },
};

export function vocabInSentence(s: Sentence, lang: Lang): VocabEntry[] {
  const text = ` ${sentenceText(s).toLocaleLowerCase(lang === 'tr' ? 'tr' : 'en')} `;
  return Object.values(VOCAB).filter((v) => v.match[lang].some((m) => text.includes(m)));
}

export const MISCONCEPTIONS = {
  keyword: { id: 'keyword', tr: 'Anahtar sözcük stratejisi', ku: 'Stratejiya peyva sereke', en: 'Key-word strategy', src: 'Hegarty, Mayer & Monk (1995)' },
  textOrder: { id: 'textOrder', tr: 'Metin sırasıyla işlem', ku: 'Kirarî li gorî rêza nivîsê', en: 'Operation in text order', src: 'Carpenter & Moser (1984)' },
};

// ─── Merdiven (basamaklar) ─────────────────────────────────────────────────
export interface LadderRung {
  id: string;
  schema: SchemaId;
  grades: [Grade, Grade];
  label: L10n;
  spec: Partial<ProblemSpec>;
}

export const LADDER: LadderRung[] = [
  { id: 'change-result', schema: 'change', grades: [1, 6], label: L('Sonucu bul', 'Encamê bibîne', 'Find the result'), spec: { schema: 'change', variant: 'join', unknown: 'result' } },
  { id: 'change-start', schema: 'change', grades: [2, 6], label: L('Başlangıcı bul', 'Destpêkê bibîne', 'Find the start'), spec: { schema: 'change', unknown: 'start' } },
  { id: 'change-two', schema: 'change', grades: [3, 6], label: L('İki adım', 'Du gav', 'Two steps'), spec: { schema: 'change', axes: { M: 2 } } },
  { id: 'combine-part', schema: 'combine', grades: [1, 6], label: L('Parçayı bul', 'Parê bibîne', 'Find the part'), spec: { schema: 'combine', unknown: 'part2' } },
  { id: 'compare-smaller', schema: 'compare', grades: [2, 6], label: L('Küçüğü bul', 'Yê biçûk bibîne', 'Find the smaller'), spec: { schema: 'compare', unknown: 'smaller' } },
  { id: 'eg-partitive', schema: 'equalGroups', grades: [2, 6], label: L('Paylaştır', 'Parve bike', 'Share'), spec: { schema: 'equalGroups', variant: 'partitive' } },
  { id: 'eg-remainder', schema: 'equalGroups', grades: [3, 6], label: L('Kalanlı', 'Bi jêma', 'With remainder'), spec: { schema: 'equalGroups', variant: 'quotative' } },
  { id: 'mc-times', schema: 'multCompare', grades: [3, 6], label: L('Katını bul', 'Caran bibîne', 'Find times as many'), spec: { schema: 'multCompare', variant: 'times' } },
];

export function validateProblem(p: Problem): string[] {
  const errs: string[] = [];
  if (!p.steps.length) errs.push('no steps');
  for (const l of ['tr', 'ku', 'en'] as const) if (!p.text[l]?.length) errs.push(`text.${l} empty`);
  return errs;
}

// ─── Üreteç (taklit: elle yazılmış problemlerden seçer) ─────────────────────
function clone<T>(x: T): T {
  return JSON.parse(JSON.stringify(x)) as T;
}

export function generateProblem(spec: ProblemSpec): Problem {
  const seed = spec.seed ?? 1;
  let pool = FIXTURES.filter((f) => !spec.schema || f.steps[0].schema === spec.schema);
  const narrow = (pred: (f: Problem) => boolean) => {
    const n = pool.filter(pred);
    if (n.length) pool = n;
  };
  if (spec.axes?.M && spec.axes.M > 1) narrow((f) => f.steps.length > 1);
  else narrow((f) => f.steps.length === 1);
  if (spec.variant) narrow((f) => f.steps[0].variant === spec.variant);
  if (spec.unknown) narrow((f) => f.steps[f.steps.length - 1].unknown === spec.unknown);
  if (!pool.length) pool = FIXTURES;
  const ex = new Set(spec.exclude ?? []);
  const fresh = pool.filter((f) => !ex.has(`${f.id}-s${seed}`));
  const list = fresh.length ? fresh : pool;
  const pick = clone(list[Math.abs(seed) % list.length]);
  pick.seed = seed;
  pick.id = `${pick.id}-s${seed}`;
  return pick;
}

export function generateSet(opts: {
  grade: Grade;
  schemas?: SchemaId[];
  count: number;
  mixed?: boolean;
  axes?: Partial<Problem['axes']>;
  seed?: number;
}): Problem[] {
  const out: Problem[] = [];
  const schemas = opts.schemas?.length ? opts.schemas : (['change', 'combine', 'compare'] as SchemaId[]);
  for (let i = 0; i < opts.count; i++) {
    out.push(generateProblem({ grade: opts.grade, schema: schemas[i % schemas.length], seed: (opts.seed ?? 1) + i, axes: opts.axes }));
  }
  return out;
}
