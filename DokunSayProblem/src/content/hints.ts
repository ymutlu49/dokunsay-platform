/**
 * İpucu kademeleri (03 §B1, §D2), geri bildirim kalıpları (03 §D3) ve Söyle–Sor–Kontrol et
 * öz-sorgu cümleleri (Montague 2003, 2008). İlke: ipucu cevabı ASLA söylemez; H4 sesli düşünerek
 * SÜRECİ gösterir. ANAHTAR SÖZCÜK → İŞLEM eşlemesi hiçbir metinde yok (DESIGN §2 ilke 3).
 */
import type { ErrorClass, FlowStepId, L10n, Problem, Role, SchemaId } from './types';
import { SCHEMA_META, ROLE_LABEL } from './meta';
import { sentenceText } from './text';
import { stepFamily, templateTokens } from './relations';
import { fmtNum } from './text';

const T = (tr: string, ku: string, en: string): L10n => ({ tr, ku, en });
const each = (f: (lang: 'tr' | 'ku' | 'en') => string): L10n => ({ tr: f('tr'), ku: f('ku'), en: f('en') });

const lastStep = (p: Problem) => p.steps[p.steps.length - 1];
const question = (p: Problem, lang: 'tr' | 'ku' | 'en') => sentenceText(p.text[lang][p.text[lang].length - 1]);
const lbl = (p: Problem, r: Role, lang: 'tr' | 'ku' | 'en') =>
  lastStep(p).quantities.find((q) => q.role === r)?.label[lang] ?? ROLE_LABEL[r][lang];
const box = (r: Role, lang: 'tr' | 'ku' | 'en') => ROLE_LABEL[r][lang];
const eqText = (p: Problem) => templateTokens(lastStep(p)).join(' ');

const UNDERSTAND: FlowStepId[] = ['read', 'retell', 'question', 'known'];
const SHOW: FlowStepId[] = ['schema', 'model', 'checkModel'];
const SOLVE: FlowStepId[] = ['equation', 'compute'];

function otherSchema(s: SchemaId): SchemaId {
  const order: SchemaId[] = ['change', 'compare', 'combine', 'equalGroups', 'multCompare'];
  return order.find((x) => x !== s)!;
}

/** Adım × kademe ipucu (1 genel üstbilişsel · 2 şema kuralı · 3 daraltma · 4 sesli düşünerek gösterim). */
export function hintFor(problem: Problem, step: FlowStepId, level: 1 | 2 | 3 | 4): L10n {
  const s = lastStep(problem);
  const meta = SCHEMA_META[s.schema];
  const fam = stepFamily(s);
  const unknownIsWhole = s.unknown === fam.whole;
  const known = s.quantities.filter((q) => q.role !== s.unknown);
  const unit = problem.answerUnit;

  if (UNDERSTAND.includes(step)) {
    if (level === 1) return T('Problemi bir kez daha dinleyelim mi? Her cümleden sonra durup düşün.', 'Em careke din li pirsgirêkê guhdarî bikin? Piştî her hevokê raweste û bifikire.', 'Shall we listen to the problem again? Stop and think after each sentence.');
    if (level === 2) return T('Kim var? Ne oldu? Ne soruluyor? Bu üç soruya kısaca cevap ver.', 'Kî heye? Çi qewimî? Çi tê pirsîn? Bi kurtî bersiva van her sê pirsan bide.', 'Who is in the story? What happened? What is being asked? Answer these three questions briefly.');
    if (level === 3) {
      if (step === 'question') return T('Soru en sondaki cümledir; soru işaretiyle biter.', 'Pirs hevoka herî dawî ye; bi nîşana pirsê diqede.', 'The question is the last sentence; it ends with a question mark.');
      if (step === 'known') return each((l) => ({ tr: `Soru ${unit.tr} hakkında. Başka bir şeyi anlatan sayı işine yaramayabilir.`, ku: `Pirs li ser ${unit.ku} ye. Hejmareke ku tiştekî din dibêje dibe ku ne pêwîst be.`, en: `The question is about ${unit.en}s. A number about something else may not be useful.` })[l]);
      return T('Seçeneklerden biri ilişkiyi ters anlatıyor. Kimde daha çok olduğunu, ne olduğunu kontrol et.', 'Yek ji vebijarkan têkiliyê berevajî dibêje. Kontrol bike ka çi qewimî.', 'One of the choices tells the relation the wrong way round. Check what really happened.');
    }
    return each((l) => ({
      tr: `Şöyle düşünüyorum: Soru şunu soruyor: «${question(problem, 'tr')}» Demek ki cevabım ${unit.tr} olacak. Şimdi sayıların her biri neyi anlatıyor, tek tek bakıyorum.`,
      ku: `Ez wiha difikirim: Pirs vê dipirse: «${question(problem, 'ku')}» Yanî bersiva min dê ${unit.ku} be. Niha ez yek bi yek dinêrim ka her hejmar çi dibêje.`,
      en: `I think like this: the question asks «${question(problem, 'en')}» So my answer will be in ${unit.en}s. Now I look at what each number tells me, one by one.`,
    })[l]);
  }

  if (SHOW.includes(step)) {
    if (step === 'schema') {
      if (level === 1) return T('Hikâyede bir şey değişti mi? İki şey mi karşılaştırılıyor? Eşit gruplar mı var?', 'Di çîrokê de tiştek guherî? Du tişt tên berhevdan? Komên wekhev hene?', 'Did something change in the story? Are two things compared? Are there equal groups?');
      if (level === 2) return each((l) => (['change', 'combine', 'compare', 'equalGroups', 'multCompare'] as SchemaId[]).map((x) => `${SCHEMA_META[x].name[l]}: ${SCHEMA_META[x].short[l]}`).join(' '));
      if (level === 3) {
        const o = otherSchema(s.schema);
        const pair = [s.schema, o].sort();
        return each((l) => ({ tr: `İki seçenek kaldı: ${SCHEMA_META[pair[0]].name.tr} ya da ${SCHEMA_META[pair[1]].name.tr}.`, ku: `Du vebijark man: ${SCHEMA_META[pair[0]].name.ku} an ${SCHEMA_META[pair[1]].name.ku}.`, en: `Two choices are left: ${SCHEMA_META[pair[0]].name.en} or ${SCHEMA_META[pair[1]].name.en}.` })[l]);
      }
      return each((l) => ({
        tr: `Şöyle düşünüyorum: ${meta.story.tr} Bu hikâye de böyle. Bu yüzden bu bir ${meta.name.tr} problemi.`,
        ku: `Ez wiha difikirim: ${meta.story.ku} Ev çîrok jî wiha ye. Loma ev pirsgirêkeke ${meta.name.ku} ye.`,
        en: `I think like this: ${meta.story.en} This story is like that. So this is a ${meta.name.en} problem.`,
      })[l]);
    }
    if (level === 1) return T('Hikâyede önce ne vardı? Sonra ne oldu? Bilmediğimiz şey hangisi?', 'Di çîrokê de pêşî çi hebû? Paşê çi qewimî? Tiştê ku em nizanin kîjan e?', 'What was there first? What happened next? Which amount do we not know?');
    if (level === 2) return each((l) => `${meta.name[l]}: ${meta.equation[l]}. ${meta.story[l]}`);
    if (level === 3) {
      const k = known[0];
      return each((l) => ({
        tr: `"${box(k.role, 'tr')}" kutusu dolu geliyor: ${fmtNum(k.value, 'tr')}. ? işareti sorulan şeyin kutusuna gider.`,
        ku: `Qutiya "${box(k.role, 'ku')}" tije tê: ${fmtNum(k.value, 'ku')}. Nîşana ? diçe qutiya tiştê ku tê pirsîn.`,
        en: `The "${box(k.role, 'en')}" box comes filled in: ${fmtNum(k.value, 'en')}. The ? goes in the box of the thing being asked.`,
      })[l]);
    }
    return each((l) => {
      const parts = known.map((q) => `${fmtNum(q.value, l)} → "${box(q.role, l)}"`).join(', ');
      return ({
        tr: `Şöyle düşünüyorum: Soru «${question(problem, 'tr')}» diye soruyor. Sorulan şey "${lbl(problem, s.unknown, 'tr')}". O yüzden ? işaretini "${box(s.unknown, 'tr')}" kutusuna koyuyorum. Bildiklerim: ${parts}. Şimdi model hikâyeyi anlatıyor mu, kontrol ediyorum.`,
        ku: `Ez wiha difikirim: Pirs dibêje «${question(problem, 'ku')}». Tiştê tê pirsîn "${lbl(problem, s.unknown, 'ku')}" e. Loma ez nîşana ? dixim qutiya "${box(s.unknown, 'ku')}". Yên ez dizanim: ${parts}. Niha ez kontrol dikim ka model çîrokê dibêje.`,
        en: `I think like this: the question asks «${question(problem, 'en')}». The thing asked is "${lbl(problem, s.unknown, 'en')}". So I put the ? in the "${box(s.unknown, 'en')}" box. What I know: ${parts}. Now I check that the model tells the story.`,
      })[l];
    });
  }

  if (step === 'estimate') {
    if (level === 1) return T('Cevap, bildiğin en büyük sayıdan büyük mü, küçük mü olmalı?', 'Divê bersiv ji hejmara herî mezin a ku tu dizanî mezintir be an biçûktir?', 'Should the answer be bigger or smaller than the biggest number you know?');
    if (level === 2) return unknownIsWhole
      ? T('Bilinmeyen bütün. Bütün, her parçadan büyüktür.', 'Ya nayê zanîn gişt e. Gişt ji her parçeyê mezintir e.', 'The unknown is the whole. The whole is bigger than each part.')
      : T('Bilinmeyen bir parça. Parça, bütünden küçüktür.', 'Ya nayê zanîn parçeyek e. Parçe ji giştê biçûktir e.', 'The unknown is a part. A part is smaller than the whole.');
    if (level === 3) return T('Modeline bak: ? en uzun şeritte mi, yoksa kısa bir şeritte mi?', 'Li modela xwe binêre: ? di şerîda herî dirêj de ye an di yeke kurt de?', 'Look at your model: is the ? on the longest strip or on a shorter one?');
    const mx = Math.max(...known.map((q) => q.value));
    return each((l) => ({
      tr: `Şöyle düşünüyorum: ? ${unknownIsWhole ? 'bütünde' : 'bir parçada'}. O yüzden cevap ${fmtNum(mx, 'tr')} sayısından ${unknownIsWhole ? 'büyük' : 'küçük'} olmalı.`,
      ku: `Ez wiha difikirim: ? ${unknownIsWhole ? 'di giştê de' : 'di parçeyekê de'} ye. Loma divê bersiv ji ${fmtNum(mx, 'ku')} ${unknownIsWhole ? 'mezintir' : 'biçûktir'} be.`,
      en: `I think like this: the ? is ${unknownIsWhole ? 'the whole' : 'a part'}. So the answer should be ${unknownIsWhole ? 'bigger' : 'smaller'} than ${fmtNum(mx, 'en')}.`,
    })[l]);
  }

  if (SOLVE.includes(step)) {
    if (level === 1) return T('Modelinde ? bütün mü, parça mı?', 'Di modela te de ? gişt e an parçe ye?', 'In your model, is the ? the whole or a part?');
    if (level === 2) return meta.rule;
    if (level === 3) {
      const ops = fam.kind === 'add' ? ['+', '−'] : ['×', '÷'];
      return each((l) => ({ tr: `İşlem için iki seçenek kaldı: ${ops[0]} ya da ${ops[1]}. Hangisi modeline uyuyor?`, ku: `Ji bo kirariyê du vebijark man: ${ops[0]} an ${ops[1]}. Kîjan li modela te tê?`, en: `Two operations are left: ${ops[0]} or ${ops[1]}. Which one fits your model?` })[l]);
    }
    if (step === 'equation') return each((l) => ({
      tr: `Şöyle düşünüyorum: Modelimde ? ${unknownIsWhole ? 'bütün' : 'bir parça'}. Kutuları sırayla denkleme taşıyorum: ${eqText(problem)}. Şimdi yalnız hesaplamam gerekiyor.`,
      ku: `Ez wiha difikirim: Di modela min de ? ${unknownIsWhole ? 'gişt' : 'parçeyek'} e. Ez qutiyan bi rêz dixim hevkêşeyê: ${eqText(problem)}. Niha tenê divê ez hesab bikim.`,
      en: `I think like this: in my model the ? is ${unknownIsWhole ? 'the whole' : 'a part'}. I move the boxes into the equation in order: ${eqText(problem)}. Now I only need to calculate.`,
    })[l]);
    return each((l) => ({
      tr: `Şöyle düşünüyorum: Denklemim ${eqText(problem)}. Hesabı parça parça yapıyorum: önce onlukları, sonra birlikleri düşünüyorum. Sonra ters işlemle kontrol edeceğim.`,
      ku: `Ez wiha difikirim: Hevkêşeya min ${eqText(problem)} e. Ez hesab parçe bi parçe dikim: pêşî dehan, paşê yekan. Paşê ez ê bi kirariya berevajî kontrol bikim.`,
      en: `I think like this: my equation is ${eqText(problem)}. I work it out in pieces: first the tens, then the ones. Then I will check with the inverse operation.`,
    })[l]);
  }

  // Kontrol et: answer / reasonable / reflect
  if (level === 1) return T('Cevabını hikâyeye koyup dinleyelim.', 'Em bersiva te têxin nav çîrokê û guhdarî bikin.', 'Let’s put your answer into the story and listen.');
  if (level === 2) {
    if (s.remainder) return T('Artanlar ne olacak? Soru tam olanları mı, gereken hepsini mi, yoksa artanları mı soruyor?', 'Yên zêde dimînin dê çi bibin? Pirs yên tije, hemûyên pêwîst an yên zêde dipirse?', 'What happens to the ones left over? Does the question ask about full ones, all that are needed, or the leftovers?');
    return each((l) => ({ tr: `Cevabın ne cinsinden? Soru: «${question(problem, 'tr')}» Birimi unutma: ${unit.tr}.`, ku: `Bersiva te bi çi ye? Pirs: «${question(problem, 'ku')}» Yekeyê ji bîr neke: ${unit.ku}.`, en: `What is your answer measured in? The question: «${question(problem, 'en')}» Don’t forget the unit: ${unit.en}.` })[l]);
  }
  if (level === 3) return T('Ters işlemle kontrol et: cevabını modeldeki ? yerine koy; kutular uyuşuyor mu?', 'Bi kirariya berevajî kontrol bike: bersiva xwe li şûna ? deyne; qutî li hev tên?', 'Check with the inverse: put your answer in place of the ? in the model; do the boxes fit together?');
  return T(
    'Şöyle düşünüyorum: Cevabımı ? yerine koyuyorum. Hikâyeyi baştan okuyorum. Her şey uyuşuyorsa ve birim doğruysa cevabım makul.',
    'Ez wiha difikirim: Ez bersiva xwe li şûna ? datînim. Ez çîrokê ji serî ve dixwînim. Heke her tişt li hev were û yeke rast be, bersiva min maqûl e.',
    'I think like this: I put my answer in place of the ?. I read the story again from the start. If everything fits and the unit is right, my answer makes sense.',
  );
}

/** Süreç düzeyi, kısa, suçlamayan geri bildirim (03 §D3). */
export function feedbackFor(kind: 'correct' | ErrorClass, problem: Problem, step: FlowStepId): L10n {
  const s = lastStep(problem);
  const meta = SCHEMA_META[s.schema];
  const q = (l: 'tr' | 'ku' | 'en') => question(problem, l);
  if (kind === 'correct') {
    if (problem.unsolvable) return T('Harika fark ettin! Bu soruyu çözmek için bilgi yetmiyor. Hangi bilgi olsaydı çözerdik?', 'Te baş ferq kir! Ji bo çareserkirina vê pirsê agahî têr nake. Kîjan agahî hebûya, me ê çareser bikira?', 'Great noticing! There is not enough information to solve this. What information would we need?');
    if (step === 'schema') return each((l) => ({ tr: `Evet! Bu bir ${meta.name.tr} problemi: ${meta.short.tr}`, ku: `Erê! Ev pirsgirêkeke ${meta.name.ku} ye: ${meta.short.ku}`, en: `Yes! This is a ${meta.name.en} problem: ${meta.short.en}` })[l]);
    if (step === 'model' || step === 'checkModel') return T('Modelin hikâyeyi tam anlatıyor.', 'Modela te çîrokê bi tevahî dibêje.', 'Your model tells the whole story.');
    if (step === 'equation') return T('Denklemin modelinle aynı. Güzel bir çeviri!', 'Hevkêşeya te wek modela te ye. Wergereke xweş!', 'Your equation matches your model. Nice translation!');
    if (step === 'answer' || step === 'reasonable') return T('Cevabını hikâyeye koyup kontrol ettin — tam bir problem çözücü gibi.', 'Te bersiva xwe xist nav çîrokê û kontrol kir — wek çareserkerekî rastîn.', 'You put your answer back into the story and checked it — just like a real problem solver.');
    return T('Doğru! Adım adım düşündün.', 'Rast e! Te gav bi gav fikirî.', 'Correct! You thought it through step by step.');
  }
  switch (kind) {
    case 'schemaId':
      return T('Hikâyeye yeniden bakalım: Bir şey değişti mi, yoksa iki şey mi karşılaştırılıyor?', 'Em dîsa li çîrokê binêrin: Tiştek guherî, an du tişt tên berhevdan?', 'Let’s look at the story again: did something change, or are two things being compared?');
    case 'modelPlacement':
      return T('Bazı kutular doğru. Yeşil olmayan kutuya bak: bu sayı hikâyede neyi anlatıyor?', 'Hin qutî rast in. Li qutiya ne kesk binêre: ev hejmar di çîrokê de çi dibêje?', 'Some boxes are right. Look at the box that isn’t green: what does this number mean in the story?');
    case 'unknownPlacement':
      return each((l) => ({ tr: `Soru neyi soruyor? «${q('tr')}» ? işaretini sorulan şeyin kutusuna koy.`, ku: `Pirs çi dipirse? «${q('ku')}» Nîşana ? bixe qutiya tiştê tê pirsîn.`, en: `What does the question ask? «${q('en')}» Put the ? in the box of the thing being asked.` })[l]);
    case 'irrelevantUsed':
      return each((l) => ({ tr: `Bu sayı soruyla ilgili mi? Soru şunu soruyor: «${q('tr')}»`, ku: `Ev hejmar bi pirsê re têkildar e? Pirs vê dipirse: «${q('ku')}»`, en: `Is this number about the question? The question asks: «${q('en')}»` })[l]);
    case 'reversal':
      return T('Kimde daha çok var? Kimden? Önce iki şeridi kuralım ve büyük olanı bulalım.', 'Kê zêdetir heye? Ji kê? Pêşî em her du şerîdan çêkin û ya mezin bibînin.', 'Who has more? More than whom? Let’s build the two strips first and find the bigger one.');
    case 'textOrderOp':
      return T('Başta kaç tane vardı, bilmiyoruz. Modelinde ? nerede? Bütün mü, parça mı?', 'Em nizanin di destpêkê de çend hebûn. Di modela te de ? li ku ye? Gişt e an parçe?', 'We don’t know how many there were at the start. Where is the ? in your model? Is it the whole or a part?');
    case 'operation':
      return T('Modeline bak: ? bütün mü, parça mı? İşlem modele uymalı.', 'Li modela xwe binêre: ? gişt e an parçe? Divê kirarî li modelê were.', 'Look at your model: is the ? the whole or a part? The operation should fit the model.');
    case 'computation':
      return T('Modelin ve işlemin doğru! Sadece hesapta bir kayma var. Sayı doğrusunda bir daha dene.', 'Modela te û kirariya te rast in! Tenê di hesêb de şaşiyek heye. Li ser xêza hejmaran dîsa biceribîne.', 'Your model and operation are right! There is just a slip in the calculation. Try again on the number line.');
    case 'unitOrRemainder':
      return s.remainder
        ? T('Bölmeyi doğru yaptın. Şimdi artanları düşün: soru tam olanları mı, gereken hepsini mi, artanları mı istiyor?', 'Te parkirin rast kir. Niha li yên zêde bifikire: pirs yên tije, hemûyên pêwîst an yên zêde dixwaze?', 'You divided correctly. Now think about the leftovers: does the question want full ones, all that are needed, or the leftovers?')
        : each((l) => ({ tr: `Sayın doğru; cevabın ne cinsinden? Birimi ekle: ${problem.answerUnit.tr}.`, ku: `Hejmara te rast e; bersiva te bi çi ye? Yekeyê lê zêde bike: ${problem.answerUnit.ku}.`, en: `Your number is right; what is it measured in? Add the unit: ${problem.answerUnit.en}.` })[l]);
    case 'unsolvableMissed':
      return T('Bu soruyu çözmek için bilgi yeterli mi? Bir daha dinleyelim; her sayı nereden geliyor?', 'Ji bo çareserkirina vê pirsê agahî têr dike? Em dîsa guhdarî bikin; her hejmar ji ku tê?', 'Is there enough information to solve this? Let’s listen again; where does each number come from?');
  }
}

type Talk = { say: L10n; ask: L10n; check: L10n };
const st = (say: [string, string, string], ask: [string, string, string], check: [string, string, string]): Talk => ({ say: T(...say), ask: T(...ask), check: T(...check) });

/** Söyle – Sor – Kontrol et (1. tekil iç ses; 03 §B1). */
export const selfTalk: Record<FlowStepId, Talk> = {
  read: st(['Problemi dikkatle dinliyorum.', 'Ez bi baldarî li pirsgirêkê guhdarî dikim.', 'I listen to the problem carefully.'], ['Bilmediğim bir sözcük var mı?', 'Peyveke ku ez nizanim heye?', 'Is there a word I don’t know?'], ['Hepsini anladım mı?', 'Min hemû fêm kir?', 'Did I understand all of it?']),
  retell: st(['Hikâyeyi kendi sözlerimle anlatıyorum.', 'Ez çîrokê bi gotinên xwe vedibêjim.', 'I tell the story in my own words.'], ['Kim var? Ne oldu? Ne değişti?', 'Kî heye? Çi qewimî? Çi guherî?', 'Who is there? What happened? What changed?'], ['Anlattığım hikâye problemle aynı mı?', 'Çîroka ku min got wek pirsgirêkê ye?', 'Is my story the same as the problem?']),
  question: st(['Ne bulmam gerekiyor?', 'Divê ez çi bibînim?', 'What do I need to find?'], ['Cevabım ne cinsinden olacak?', 'Bersiva min dê bi çi be?', 'What will my answer be measured in?'], ['Soruyu doğru buldum mu?', 'Min pirs rast dît?', 'Did I find the question correctly?']),
  known: st(['Hangi bilgiler işime yarar, ayırıyorum.', 'Ez agahiyên ku bi kêrî min tên vediqetînim.', 'I sort out which information is useful.'], ['Bu sayı soruyla ilgili mi?', 'Ev hejmar bi pirsê re têkildar e?', 'Is this number about the question?'], ['Gereksiz bir sayı kullandım mı?', 'Min hejmareke ne pêwîst bi kar anî?', 'Did I use a number I don’t need?']),
  schema: st(['Bu problem hangi türe benziyor, düşünüyorum.', 'Ez difikirim ka ev pirsgirêk dişibe kîjan cureyî.', 'I think about which type this problem is like.'], ['Daha önce çözdüğüm hangi probleme benziyor?', 'Ew dişibe kîjan pirsgirêka ku min berê çareser kiribû?', 'Which problem I solved before is it like?'], ['Bir şey mi değişti, yoksa iki şey mi karşılaştırılıyor?', 'Tiştek guherî, an du tişt tên berhevdan?', 'Did something change, or are two things compared?']),
  model: st(['Bildiklerimi modele yerleştiriyorum.', 'Ez tiştên ku dizanim dixim nav modelê.', 'I put what I know into the model.'], ['Bütün hangisi? Parçalar hangileri? ? nerede?', 'Gişt kîjan e? Parçe kîjan in? ? li ku ye?', 'Which is the whole? Which are the parts? Where is the ?'], ['Modelim hikâyeyi anlatıyor mu?', 'Modela min çîrokê dibêje?', 'Does my model tell the story?']),
  checkModel: st(['Modelimi hikâyeyle karşılaştırıyorum.', 'Ez modela xwe bi çîrokê re didim ber hev.', 'I compare my model with the story.'], ['Her kutu hikâyede neyi anlatıyor?', 'Her qutî di çîrokê de çi dibêje?', 'What does each box mean in the story?'], ['Bütün, parçalardan büyük mü?', 'Gişt ji parçeyan mezintir e?', 'Is the whole bigger than the parts?']),
  estimate: st(['Cevabım yaklaşık ne olur, düşünüyorum.', 'Ez difikirim ka bersiva min nêzîkî çi be.', 'I think about roughly what my answer will be.'], ['Sonuç en büyük sayıdan büyük mü, küçük mü olmalı?', 'Divê encam ji hejmara herî mezin mezintir be an biçûktir?', 'Should the result be bigger or smaller than the biggest number?'], ['Tahminim modelime uyuyor mu?', 'Texmîna min li modela min tê?', 'Does my estimate fit my model?']),
  equation: st(['Modelimi işlem cümlesine çeviriyorum.', 'Ez modela xwe werdigerînim hevkêşeyê.', 'I turn my model into a number sentence.'], ['? denklemde nerede? Hangi işlem modele uyuyor?', '? di hevkêşeyê de li ku ye? Kîjan kirarî li modelê tê?', 'Where is the ? in the equation? Which operation fits the model?'], ['Denklemim modelimle aynı mı?', 'Hevkêşeya min wek modela min e?', 'Is my equation the same as my model?']),
  compute: st(['Dikkatle hesaplıyorum.', 'Ez bi baldarî hesab dikim.', 'I calculate carefully.'], ['Hangi yolla hesaplamak kolay?', 'Bi kîjan rêyê hesabkirin hêsan e?', 'Which way is easiest to calculate?'], ['İşlemimi bir kez daha kontrol ettim mi?', 'Min kirariya xwe careke din kontrol kir?', 'Did I check my calculation once more?']),
  answer: st(['Cevabımı birimiyle tam cümleye koyuyorum.', 'Ez bersiva xwe bi yekeyê re dixim hevokeke temam.', 'I put my answer with its unit into a full sentence.'], ['Cevabım sorunun istediği şey mi?', 'Bersiva min ew e ku pirs dixwaze?', 'Is my answer what the question wants?'], ['Birimi yazdım mı? Artanları düşündüm mü?', 'Min yeke nivîsî? Min li yên zêde fikirî?', 'Did I write the unit? Did I think about leftovers?']),
  reasonable: st(['Cevabımı hikâyeye koyuyorum.', 'Ez bersiva xwe dixim nav çîrokê.', 'I put my answer back into the story.'], ['Bu cevap gerçek hayatta olabilir mi?', 'Ev bersiv di jiyana rastîn de dibe?', 'Could this answer happen in real life?'], ['Ters işlemle doğruladım mı?', 'Min bi kirariya berevajî piştrast kir?', 'Did I check with the inverse operation?']),
  reflect: st(['Bugün ne yaptığımı düşünüyorum.', 'Ez difikirim ka îro min çi kir.', 'I think about what I did today.'], ['Hangi adım en çok yardım etti?', 'Kîjan gav herî zêde alîkarî kir?', 'Which step helped the most?'], ['Bir dahaki sefere neyi farklı yaparım?', 'Cara din ez ê çi cuda bikim?', 'What will I do differently next time?']),
};

