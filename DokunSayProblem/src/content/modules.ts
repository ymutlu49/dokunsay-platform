/**
 * Antrenman durağı verileri (DESIGN §7; 03 §C): Hikâyeyi Anlat, Hata Dedektifi, Dedektif Soruları,
 * Makul mü?, kalan yorumu, Sözcük Tuzağı. Problem Kurucu → posing.ts (buradan yeniden dışa açılır).
 */
import type { ErroneousSolution, FlowStepId, Grade, L10n, Lang, ParaphraseItem, Problem, Role, SchemaId } from './types';
import { generateProblem } from './generate';
import { SCHEMA_META, ROLE_LABEL } from './meta';
import { mulberry32, deriveSeed } from './rng';
import { fmtNum, renderAnswer } from './text';
import { MINUS, keywordOp, isInconsistent, templateTokens, val } from './relations';
import { unsolvableFor } from './unsolvable';

export { unsolvableFor } from './unsolvable';
export * from './posing';

const T = (tr: string, ku: string, en: string): L10n => ({ tr, ku, en });
const each = (f: (l: Lang) => string): L10n => ({ tr: f('tr'), ku: f('ku'), en: f('en') });
const lastStep = (p: Problem) => p.steps[p.steps.length - 1];

// ─── Hikâyeyi Anlat ────────────────────────────────────────────────────────

function relation(p: Problem, l: Lang, mode: 'correct' | 'reversed'): string {
  const s = lastStep(p);
  const v = (r: Role) => (r === s.unknown ? '?' : fmtNum(val(s, r), l));
  const lb = (r: Role) => s.quantities.find((q) => q.role === r)!.label[l];
  const u = p.answerUnit[l];
  const rev = mode === 'reversed';
  switch (s.schema) {
    case 'change': {
      const join = (s.variant === 'join') !== rev;
      return ({
        tr: `Başta ${v('start')} ${u} vardı; sonra ${v('change')} tane ${join ? 'geldi' : 'gitti'}; sonunda ${v('result')} oldu.`,
        ku: `Di destpêkê de ${v('start')} ${u} hebûn; paşê ${v('change')} ${join ? 'hatin' : 'çûn'}; di dawiyê de ${v('result')} bûn.`,
        en: `At first there were ${v('start')}; then ${v('change')} ${join ? 'came' : 'went away'}; in the end there were ${v('result')}.`,
      })[l];
    }
    case 'combine':
      return rev
        ? ({ tr: `${v('whole')} ile ${v('part1')} birlikte ${v('part2')} eder.`, ku: `${v('whole')} û ${v('part1')} bi hev re ${v('part2')} in.`, en: `${v('whole')} and ${v('part1')} together make ${v('part2')}.` })[l]
        : ({ tr: `${v('part1')} ile ${v('part2')} birlikte ${v('whole')} eder.`, ku: `${v('part1')} û ${v('part2')} bi hev re ${v('whole')} in.`, en: `${v('part1')} and ${v('part2')} together make ${v('whole')}.` })[l];
    case 'compare': {
      const [big] = rev ? ['smaller', 'larger'] as const : ['larger', 'smaller'] as const;
      return ({
        tr: `${lb('larger')}: ${v('larger')}, ${lb('smaller')}: ${v('smaller')}. ${lb(big)} daha çok; fark ${v('difference')}.`,
        ku: `${lb('larger')}: ${v('larger')}, ${lb('smaller')}: ${v('smaller')}. ${lb(big)} zêdetir e; kemok ${v('difference')} e.`,
        en: `${lb('larger')}: ${v('larger')}, ${lb('smaller')}: ${v('smaller')}. ${lb(big)} has more; the difference is ${v('difference')}.`,
      })[l];
    }
    case 'equalGroups': {
      const [g, e] = rev ? ['perGroup', 'groups'] as const : ['groups', 'perGroup'] as const;
      return ({
        tr: `${v(g)} grup var; her grupta ${v(e)} tane; hepsi ${v('total')}.`,
        ku: `${v(g)} kom hene; di her komê de ${v(e)}; hemû ${v('total')}.`,
        en: `There are ${v(g)} groups with ${v(e)} in each; ${v('total')} in all.`,
      })[l];
    }
    case 'multCompare': {
      const [a, b] = rev ? ['reference', 'compared'] as const : ['compared', 'reference'] as const;
      const k = s.variant === 'fraction' ? ({ tr: `1/${v('factor')}'i`, ku: `1/${v('factor')}`, en: `1/${v('factor')} of` })[l] : ({ tr: `${v('factor')} katı`, ku: `${v('factor')} car`, en: `${v('factor')} times` })[l];
      return ({ tr: `${lb(a)}, ${lb(b)} miktarının ${k}.`, ku: `${lb(a)} ${k} ya ${lb(b)} ye.`, en: `${lb(a)} is ${k} ${lb(b)}.` })[l];
    }
  }
}

const askAbout = (p: Problem, r: Role, l: Lang) => {
  const lb = lastStep(p).quantities.find((q) => q.role === r)?.label[l] ?? ROLE_LABEL[r][l];
  return ({ tr: ` Soru: ${lb} kaç?`, ku: ` Pirs: ${lb} çend e?`, en: ` Question: how many — ${lb}?` })[l];
};

/** 3 yeniden-ifade: doğru / ilişki ters / soru farklı (03 §C1). */
export function paraphraseFor(problem: Problem): ParaphraseItem {
  const s = lastStep(problem);
  const other = s.quantities.find((q) => q.role !== s.unknown)!.role;
  const options: ParaphraseItem['options'] = [
    { kind: 'correct', text: each((l) => relation(problem, l, 'correct') + askAbout(problem, s.unknown, l)) },
    { kind: 'reversedRelation', text: each((l) => relation(problem, l, 'reversed') + askAbout(problem, s.unknown, l)) },
    { kind: 'differentQuestion', text: each((l) => relation(problem, l, 'correct') + askAbout(problem, other, l)) },
  ];
  const rng = mulberry32(deriveSeed(problem.seed, 'para'));
  return { problemId: problem.id, options: rng.shuffle(options) };
}

// ─── Hata Dedektifi ────────────────────────────────────────────────────────

type ErrKind = 'wrongSchema' | 'irrelevant' | 'reversal' | 'unit' | 'remainder' | 'computation';
const ERR_MISC: Record<ErrKind, string> = { wrongSchema: 'schemaConfusion', irrelevant: 'irrelevantInfo', reversal: 'keywordReversal', unit: 'unitOmission', remainder: 'ignoreRemainder', computation: 'addAllNumbers' };
const WHY: Record<ErrKind, L10n> = {
  wrongSchema: T('Problemin türünü yanlış seçti.', 'Cureyê pirsgirêkê şaş hilbijart.', 'It chose the wrong problem type.'),
  irrelevant: T('Soruyla ilgisi olmayan bir sayı kullandı.', 'Hejmareke ku bi pirsê re ne têkildar e bi kar anî.', 'It used a number that has nothing to do with the question.'),
  reversal: T('Kimde daha çok olduğuna bakmadan sözcüğe göre işlem seçti.', 'Bêyî ku binêre kê zêdetir heye, li gorî peyvê kirarî hilbijart.', 'It picked the operation from a word without checking who has more.'),
  unit: T('Cevabın neyin sayısı olduğunu söylemedi.', 'Negot ku bersiv hejmara çi ye.', 'It did not say what the answer counts.'),
  remainder: T('Artanları düşünmeden cevap verdi.', 'Bêyî fikirîna li ser yên zêde bersiv da.', 'It answered without thinking about the leftovers.'),
  computation: T('Model ve işlem doğru ama hesapta kaydı.', 'Model û kirarî rast in lê di hesêb de şaş bû.', 'The model and operation are right but the calculation slipped.'),
};

/** Robot Çırak'ın 5 adımlı çözümü; bir adım hatalı (Große & Renkl 2007). */
export function erroneousSolutionFor(problem: Problem, seed: number): ErroneousSolution {
  const rng = mulberry32(deriveSeed(seed, 'err'));
  const s = lastStep(problem);
  const kinds: ErrKind[] = ['wrongSchema', 'unit', 'computation'];
  if (problem.extras.length) kinds.push('irrelevant');
  if (isInconsistent(s)) kinds.push('reversal', 'reversal');
  if (s.remainder) kinds.push('remainder', 'remainder');
  const kind = rng.pick(kinds);
  const toks = templateTokens(s);
  const ans = val(s, s.unknown);
  const wrongSchema: SchemaId = s.schema === 'compare' ? 'change' : 'compare';
  const known = s.quantities.filter((q) => q.role !== s.unknown);
  const eqStr = (t: (number | string)[], l: Lang) => t.map((x) => (typeof x === 'number' ? fmtNum(x, l) : x)).join(' ');
  // Tutarsız dilde tuzak denklem: bilinen iki sayıya anahtar sözcüğün işlemi.
  const kop = keywordOp(s) ?? '+';
  const [ka, kb] = [Math.max(known[0].value, known[1].value), Math.min(known[0].value, known[1].value)];
  const trapToks = [ka, kop, kb, '=', '?'];
  const trapVal = kop === '+' ? ka + kb : kop === MINUS ? ka - kb : kop === '×' ? ka * kb : Math.floor(ka / kb);
  const eqToks = kind === 'reversal' ? trapToks : toks;
  const computed = kind === 'reversal' ? trapVal : kind === 'computation' ? ans + rng.pick([1, -1, 10]) : ans;
  const solved = eqToks.map((x) => (x === '?' ? computed : x));
  const steps: ErroneousSolution['steps'] = [
    { stepId: 'schema' as FlowStepId, isError: kind === 'wrongSchema', shown: each((l) => ({ tr: `Bu bir ${SCHEMA_META[kind === 'wrongSchema' ? wrongSchema : s.schema].name.tr} problemi.`, ku: `Ev pirsgirêkeke ${SCHEMA_META[kind === 'wrongSchema' ? wrongSchema : s.schema].name.ku} ye.`, en: `This is a ${SCHEMA_META[kind === 'wrongSchema' ? wrongSchema : s.schema].name.en} problem.` })[l]) },
    {
      stepId: 'model', isError: kind === 'irrelevant',
      shown: each((l) => s.quantities.map((q) => {
        const shownVal = q.role === s.unknown ? '?' : kind === 'irrelevant' && q.role === known[0].role ? fmtNum(problem.extras[0].value, l) : fmtNum(q.value, l);
        return `${ROLE_LABEL[q.role][l]}: ${shownVal}`;
      }).join(' · ')),
    },
    { stepId: 'equation', isError: kind === 'reversal', shown: each((l) => eqStr(eqToks, l)) },
    { stepId: 'compute', isError: kind === 'computation', shown: each((l) => eqStr(solved, l)) },
    {
      stepId: 'answer', isError: kind === 'unit' || kind === 'remainder',
      shown: each((l) => kind === 'unit' ? ({ tr: `Cevap: ${fmtNum(problem.answer, l)}.`, ku: `Bersiv: ${fmtNum(problem.answer, l)}.`, en: `Answer: ${fmtNum(problem.answer, l)}.` })[l]
        : kind === 'remainder' ? renderAnswer(problem, l, s.remainder!.interpret === 'roundDown' ? ans + 1 : ans === problem.answer ? ans + 1 : ans)
        : renderAnswer(problem, l, kind === 'reversal' || kind === 'computation' ? computed : problem.answer)),
    },
  ];
  const others = (Object.keys(WHY) as ErrKind[]).filter((k) => k !== kind);
  const why = rng.shuffle([{ text: WHY[kind], correct: true }, ...rng.shuffle(others).slice(0, 2).map((k) => ({ text: WHY[k], correct: false }))]);
  return { problemId: problem.id, steps, misconception: ERR_MISC[kind], why };
}

// ─── Makul mü? ─────────────────────────────────────────────────────────────

export function reasonableItemsFor(grade: Grade, seed: number) {
  const rng = mulberry32(deriveSeed(seed, 'reas'));
  const specs = rng.shuffle([true, true, false, false]);
  return specs.map((isReasonable, i) => {
    const problem = generateProblem({ grade, seed: deriveSeed(seed, `r${i}`), axes: { M: 1, I: 0, P: 0 } });
    const s = lastStep(problem);
    const whole = s.schema === 'equalGroups' ? 'total' : s.schema === 'multCompare' ? (s.variant === 'fraction' ? 'reference' : 'compared') : s.schema === 'change' ? (s.variant === 'join' ? 'result' : 'start') : s.schema === 'combine' ? 'whole' : 'larger';
    const wv = val(s, whole as Role);
    let shownAnswer = problem.answer;
    let right: L10n = T('Cevabı hikâyeye koyunca her şey uyuyor.', 'Dema bersiv dikeve nav çîrokê, her tişt li hev tê.', 'When I put the answer into the story, everything fits.');
    if (!isReasonable) {
      if (s.remainder?.interpret === 'roundUp') { shownAnswer = val(s, s.unknown); right = T('Artanlar için bir tane daha gerekir.', 'Ji bo yên zêde yek din lazim e.', 'One more is needed for the leftovers.'); }
      else if (s.unknown === whole) { shownAnswer = Math.max(1, Math.min(...s.quantities.filter((q) => q.role !== whole).map((q) => q.value)) - 1); right = T('Bütün, bir parçasından küçük olamaz.', 'Gişt nikare ji parçeyeke xwe biçûktir be.', 'The whole cannot be smaller than one of its parts.'); }
      else { shownAnswer = wv + problem.answer; right = T('Bir parça, bütünden büyük olamaz.', 'Parçeyek nikare ji giştê mezintir be.', 'A part cannot be bigger than the whole.'); }
    }
    const reasons = rng.shuffle([
      { text: right, correct: true },
      { text: T('Cevap her zaman en büyük sayıdır.', 'Bersiv her tim hejmara herî mezin e.', 'The answer is always the biggest number.'), correct: false },
      { text: T('Sayılar büyük olduğu için doğru olmalı.', 'Ji ber ku hejmar mezin in, divê rast be.', 'It must be right because the numbers are big.'), correct: false },
    ]);
    return { problem, shownAnswer, isReasonable, reasons };
  });
}

// ─── Kalanın yorumu: aynı bölme dört bağlamda ─────────────────────────────

export function remainderSetFor(seed: number) {
  const rng = mulberry32(deriveSeed(seed, 'rem'));
  const b = 4;
  const q = rng.int(3, 9);
  const r = rng.int(2, 3);
  const a = b * q + r;
  // KU-DENETİM
  const contexts: { text: L10n; interpret: 'roundUp' | 'roundDown' | 'remainderIsAnswer' | 'exact'; answer: number }[] = [
    { interpret: 'roundUp', answer: q + 1, text: T(`${a} öğrenci geziye gidecek. Bir arabaya ${b} öğrenci biniyor. Kaç araba gerekir?`, `${a} xwendekar dê herin gerê. Erebeyek ${b} xwendekaran dibe. Çend erebe lazim in?`, `${a} pupils are going on a trip. One car takes ${b} pupils. How many cars are needed?`) },
    { interpret: 'roundDown', answer: q, text: T(`${a} kurabiye var. Bir kutuya ${b} kurabiye giriyor. Kaç kutu tam dolar?`, `${a} kulîçe hene. Qutiyek ${b} kulîçeyan digire. Çend qutî tije dibin?`, `There are ${a} biscuits. A box holds ${b} biscuits. How many boxes will be full?`) },
    { interpret: 'remainderIsAnswer', answer: r, text: T(`${a} kalem ${b} arkadaşa eşit paylaştırılıyor. Kaç kalem artar?`, `${a} pênûs bi wekhevî li ${b} hevalan tên parkirin. Çend pênûs zêde dimînin?`, `${a} pencils are shared equally among ${b} friends. How many pencils are left over?`) },
    { interpret: 'exact', answer: a / b, text: T(`${a} litre su ${b} kovaya eşit dolduruluyor. Her kovaya kaç litre su düşer?`, `${a} lître av bi wekhevî dikeve ${b} satilan. Her satil çend lître av digire?`, `${a} litres of water are poured equally into ${b} buckets. How much water goes in each bucket?`) },
  ];
  return { division: [a, b] as [number, number], contexts };
}

// ─── Sözcük Tuzağı: tutarlı + tutarsız karşılaştırma çifti ────────────────

export function wordTrapPairFor(grade: Grade, seed: number): [Problem, Problem] {
  const g = (grade < 2 ? 2 : grade) as Grade;
  let last: [Problem, Problem] | null = null;
  for (let k = 0; k < 40; k++) {
    const sd = deriveSeed(seed, `trap${k}`);
    const cons = generateProblem({ grade: g, schema: 'compare', variant: 'more', unknown: 'larger', seed: sd, axes: { I: 0, M: 1, P: 0 } });
    const inc = generateProblem({ grade: g, schema: 'compare', variant: 'more', unknown: 'smaller', seed: sd, axes: { I: 0, M: 1, P: 0 } });
    last = [cons, inc];
    const vs = (p: Problem) => ['larger', 'smaller', 'difference'].map((r) => val(p.steps[0], r as Role)).join(',');
    if (vs(cons) === vs(inc) && cons.people.join() === inc.people.join()) return last;
  }
  return last!;
}

