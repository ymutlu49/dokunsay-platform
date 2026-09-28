/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Problem Kurucu kalıpları. İçerik motoru POSING_FRAMES / fillFrame / checkPosedProblem
 * verirse onlar kullanılır (biçim uyumluysa); yoksa bu dosyadaki KÜÇÜK YEDEK set devreye
 * girer (arayüz sınanabilsin diye). Yedek kalıplar 04 §D yazım kılavuzuna uyar: sayıdan
 * sonra ad tekil (TR/KU), ek uyumu için adların hazır çekimleri. ANAHTAR SÖZCÜK öğüdü YOK.
 * // KU-DENETİM: tüm KU kalıpları ana dil denetimi bekler.
 */
import * as C from '../lib/content';
import type { Grade, L10n, Lang, ProblemSpec, SchemaId } from '../content/types';
import { asL10n } from './api';

const API = C as unknown as Record<string, any>;

export type SlotId = 'name' | 'name2' | 'n1' | 'n2' | 'obj';
export interface PoseQuestion {
  id: string;
  text: L10n;
  answerable: boolean;
}
export interface PoseFrame {
  id: string;
  schema: SchemaId;
  minGrade: Grade;
  story: L10n;
  questions: PoseQuestion[];
  slots: SlotId[];
  valid?: (n1: number, n2: number) => boolean;
  answer?: (n1: number, n2: number) => number;
  /** İçerik motorundan geldiyse ham nesne (fillFrame/checkPosedProblem'e geri verilir). */
  raw?: unknown;
}
export type PoseValues = Partial<Record<SlotId, string>>;

export const NAMES = [
  { id: 'ali', tr: 'Ali', abl: "Ali'den", dat: "Ali'ye", ku: 'Alî', en: 'Ali' },
  { id: 'ela', tr: 'Ela', abl: "Ela'dan", dat: "Ela'ya", ku: 'Ela', en: 'Ela' },
  { id: 'rojda', tr: 'Rojda', abl: "Rojda'dan", dat: "Rojda'ya", ku: 'Rojda', en: 'Rojda' },
  { id: 'baran', tr: 'Baran', abl: "Baran'dan", dat: "Baran'a", ku: 'Baran', en: 'Baran' },
  { id: 'zeynep', tr: 'Zeynep', abl: "Zeynep'ten", dat: "Zeynep'e", ku: 'Zeynep', en: 'Zeynep' },
  { id: 'can', tr: 'Can', abl: "Can'dan", dat: "Can'a", ku: 'Can', en: 'Can' },
];

export const OBJECTS = [
  { id: 'apple', tr: 'elma', ku: 'sêv', en: 'apple', enPl: 'apples' },
  { id: 'pencil', tr: 'kalem', ku: 'qelem', en: 'pencil', enPl: 'pencils' },
  { id: 'book', tr: 'kitap', ku: 'pirtûk', en: 'book', enPl: 'books' },
  { id: 'flower', tr: 'çiçek', ku: 'kulîlk', en: 'flower', enPl: 'flowers' },
  { id: 'balloon', tr: 'balon', ku: 'balon', en: 'balloon', enPl: 'balloons' },
];

const L = (tr: string, ku: string, en: string): L10n => ({ tr, ku, en });
const BOTH: SlotId[] = ['name', 'name2', 'n1', 'n2', 'obj'];

const LOCAL: PoseFrame[] = [
  {
    id: 'join', schema: 'change', minGrade: 1, slots: ['name', 'n1', 'n2', 'obj'],
    story: L('{name} {n1} {obj} topladı. Sonra {n2} {obj} daha topladı.', '{name} {n1} {obj} berhev kirin. Paşê {n2} {obj} din berhev kirin.', '{name} collected {n1} {objs}. Then {name} collected {n2} more {objs}.'),
    questions: [
      { id: 'q', answerable: true, text: L('{name} hepsinde kaç {obj} topladı?', '{name} bi giştî çend {obj} berhev kirin?', 'How many {objs} did {name} collect in all?') },
      { id: 'x', answerable: false, text: L('{name} kaç yaşında?', '{name} çend salî ye?', 'How old is {name}?') },
    ],
    answer: (a, b) => a + b,
  },
  {
    id: 'separate', schema: 'change', minGrade: 1, slots: ['name', 'name2', 'n1', 'n2', 'obj'],
    story: L('{name} {n1} {obj} aldı. {n2} tanesini {name2_dat} verdi.', '{name} {n1} {obj} kirîn. {n2} ji wan da {name2}.', '{name} bought {n1} {objs}. {name} gave {n2} of them to {name2}.'),
    questions: [
      { id: 'q', answerable: true, text: L('Kaç {obj} kaldı?', 'Çend {obj} man?', 'How many {objs} are left?') },
      { id: 'x', answerable: false, text: L('{name2} en çok hangi rengi sever?', '{name2} herî zêde ji kîjan rengî hez dike?', 'What colour does {name2} like best?') },
    ],
    valid: (a, b) => b <= a,
    answer: (a, b) => a - b,
  },
  {
    id: 'combine', schema: 'combine', minGrade: 1, slots: ['n1', 'n2', 'obj'],
    story: L('Bir sepette {n1} kırmızı, {n2} sarı {obj} var.', 'Di selikekê de {n1} {obj_ez} sor û {n2} {obj_ez} zer hene.', 'A basket has {n1} red {objs} and {n2} yellow {objs}.'),
    questions: [
      { id: 'q', answerable: true, text: L('Sepette toplam kaç {obj} var?', 'Di selikê de bi giştî çend {obj} hene?', 'How many {objs} are in the basket in all?') },
      { id: 'x', answerable: false, text: L('Sepet ne zaman alındı?', 'Selik kengî hat kirîn?', 'When was the basket bought?') },
    ],
    answer: (a, b) => a + b,
  },
  {
    id: 'compare', schema: 'compare', minGrade: 2, slots: BOTH,
    story: L('{name} {n1} {obj} topladı. {name2} {n2} {obj} topladı.', '{name} {n1} {obj} berhev kirin. {name2} {n2} {obj} berhev kirin.', '{name} collected {n1} {objs}. {name2} collected {n2} {objs}.'),
    questions: [
      { id: 'q', answerable: true, text: L('{name}, {name2_abl} kaç {obj} fazla topladı?', '{name} çend {obj} ji {name2} zêdetir berhev kirin?', 'How many more {objs} did {name} collect than {name2}?') },
      { id: 'x', answerable: false, text: L('{name} okula saat kaçta gider?', '{name} di saet çendan de diçe dibistanê?', 'What time does {name} go to school?') },
    ],
    valid: (a, b) => a > b,
    answer: (a, b) => a - b,
  },
  {
    id: 'groups', schema: 'equalGroups', minGrade: 3, slots: ['n1', 'n2', 'obj'],
    story: L('{n1} kutu var. Her kutuda {n2} {obj} var.', '{n1} qutî hene. Di her qutiyê de {n2} {obj} hene.', 'There are {n1} boxes. Each box has {n2} {objs}.'),
    questions: [
      { id: 'q', answerable: true, text: L('Kutularda toplam kaç {obj} var?', 'Di qutiyan de bi giştî çend {obj} hene?', 'How many {objs} are there in all?') },
      { id: 'x', answerable: false, text: L('Kutular ne renk?', 'Qutî bi çi rengî ne?', 'What colour are the boxes?') },
    ],
    answer: (a, b) => a * b,
  },
];

/** İçerik kalıplarını dener; uyumsuzsa yerel yedek. */
export function framesFor(grade: Grade): PoseFrame[] {
  const raw = API.POSING_FRAMES;
  const list: any[] = Array.isArray(raw) ? raw : raw && typeof raw === 'object' ? Object.values(raw) : [];
  const mapped = list
    .map((f: any): PoseFrame | null => {
      const story = f?.story ?? f?.template ?? f?.frame;
      if (!story || !f?.schema) return null;
      const qs: any[] = f.questions ?? f.questionFrames ?? [];
      return {
        id: String(f.id),
        schema: f.schema,
        minGrade: (f.minGrade ?? f.grade ?? 1) as Grade,
        story: asL10n(story),
        questions: qs.map((q: any, i: number) => ({ id: String(q.id ?? i), text: asL10n(q.text ?? q), answerable: q.answerable !== false })),
        slots: Array.isArray(f.slots) ? f.slots.map((s: any) => (typeof s === 'string' ? s : s.id)) : BOTH,
        raw: f,
      };
    })
    .filter((f): f is PoseFrame => !!f && f.questions.length > 0);
  const src = mapped.length ? mapped : LOCAL;
  return src.filter((f) => f.minGrade <= grade);
}

export function numberRange(grade: Grade, schema: SchemaId): number[] {
  const max = schema === 'equalGroups' ? 10 : grade <= 1 ? 10 : grade === 2 ? 20 : grade === 3 ? 50 : 100;
  const min = schema === 'equalGroups' ? 2 : 1;
  return Array.from({ length: max - min + 1 }, (_, i) => i + min);
}

export function fill(template: string, v: PoseValues, lang: Lang): string {
  const nm = NAMES.find((n) => n.id === v.name);
  const nm2 = NAMES.find((n) => n.id === v.name2);
  const ob = OBJECTS.find((o) => o.id === v.obj);
  const blank = '___';
  const map: Record<string, string> = {
    name: nm ? nm[lang] : blank,
    name2: nm2 ? nm2[lang] : blank,
    name2_abl: nm2 ? nm2.abl : blank,
    name2_dat: nm2 ? nm2.dat : blank,
    n1: v.n1 || blank,
    n2: v.n2 || blank,
    obj: ob ? ob[lang] : blank,
    objs: ob ? (lang === 'en' ? ob.enPl : ob[lang]) : blank,
    obj_ez: ob ? (lang === 'ku' ? `${ob.ku}ên` : ob[lang]) : blank,
  };
  return template.replace(/\{(\w+)\}/g, (m, k: string) => map[k] ?? m);
}

/** Kalıbı metne döker (içerikte fillFrame varsa önce o). */
export function frameText(f: PoseFrame, v: PoseValues, qId: string | null, lang: Lang): { story: string; question: string } {
  const q = f.questions.find((x) => x.id === qId);
  if (f.raw && typeof API.fillFrame === 'function') {
    try {
      const r = API.fillFrame(f.raw, { ...v, question: qId }, lang);
      if (typeof r === 'string' && r) return { story: r, question: '' };
      if (r && typeof r === 'object' && typeof r.story === 'string') return { story: r.story, question: String(r.question ?? '') };
    } catch {
      /* yerel doldurmaya düş */
    }
  }
  return { story: fill(f.story[lang] || f.story.tr, v, lang), question: q ? fill(q.text[lang] || q.text.tr, v, lang) : '' };
}

export type PoseIssue = 'pose_no_q' | 'pose_no_num' | 'pose_bad_rel' | 'pose_unanswerable';

export interface PoseCheck {
  ok: boolean;
  issues: PoseIssue[];
  /** İçerikten gelen ek mesajlar (L10n). */
  extra: L10n[];
  answer: number | null;
  spec: ProblemSpec | null;
}

export function checkPose(f: PoseFrame, v: PoseValues, qId: string | null, lang: Lang, grade: Grade): PoseCheck {
  const issues: PoseIssue[] = [];
  const q = f.questions.find((x) => x.id === qId);
  if (!q) issues.push('pose_no_q');
  const needNums = f.slots.filter((s) => s === 'n1' || s === 'n2');
  const missing = f.slots.some((s) => !v[s]);
  if (missing) issues.push('pose_no_num');
  const a = Number(v.n1);
  const b = Number(v.n2);
  if (!missing && needNums.length === 2 && f.valid && !f.valid(a, b)) issues.push('pose_bad_rel');
  if (q && !q.answerable) issues.push('pose_unanswerable');
  let extra: L10n[] = [];
  let spec: ProblemSpec | null = null;
  let ok = issues.length === 0;
  if (f.raw && typeof API.checkPosedProblem === 'function') {
    try {
      const text = frameText(f, v, qId, lang);
      const r = API.checkPosedProblem({ frame: f.raw, frameId: f.id, schema: f.schema, values: v, question: qId, text: `${text.story} ${text.question}`, grade }, lang);
      if (typeof r === 'boolean') ok = ok && r;
      else if (r && typeof r === 'object') {
        ok = ok && Boolean(r.ok ?? r.solvable ?? true);
        extra = ((r.messages ?? r.issues ?? r.reasons ?? []) as any[]).map((m) => asL10n(m));
        if (r.spec && typeof r.spec === 'object') spec = r.spec as ProblemSpec;
      }
    } catch {
      /* yerel denetim yeterli */
    }
  }
  const answer = ok && f.answer && Number.isFinite(a) && Number.isFinite(b) ? f.answer(a, b) : null;
  return { ok, issues, extra, answer, spec };
}
