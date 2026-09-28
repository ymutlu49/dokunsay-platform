/**
 * İskele düzeyi (şema bazında) ve kayıt — DESIGN §6.3, §9; 03 §B2.
 *
 * S3 Model (Ben yaparım) → S2 Rehberli (Birlikte) → S1 İstemli (Sen) → S0 Bağımsız.
 * Soluklaş: aynı şemada son 5'te ≥4 doğru ∧ H2 üstü ipucu yok ∧ model ilk denemede ≥4/5.
 * Geri dön: 2 ardışık yanlış ∨ H4 ∨ model denetiminde 2 ardışık başarısızlık.
 * Oturumda en fazla 1 yeni şema (S3). S1'e ulaşan şema karışık sete girer.
 * Eşikler TASARIM TERCİHİDİR, kalibre edilmemiştir (DESIGN §5, §11).
 */
import type { ErrorClass, FlowStepId, Grade, MainStep, ScaffoldLevel, SchemaId } from '../content/types';
import { load, save } from './storage';

export interface AttemptSummary {
  correct: boolean;
  maxHint: number;
  modelFirstTry: boolean;
  ts: number;
}

export interface SchemaProgress {
  level: ScaffoldLevel;
  /** S3 içinde görülen çözümlü örnek sayısı (geriye doğru soluklaştırma basamağı). */
  examples: number;
  history: AttemptSummary[];
  consecWrong: number;
  /** Merdiven basamağı (LADDER içindeki sıra, şema+sınıfa göre süzülmüş listede). */
  rung: number;
  rungStreak: number;
  solved: number;
}

export interface ProgressState {
  version: 1;
  grade: Grade | null;
  schemas: Partial<Record<SchemaId, SchemaProgress>>;
  last: { mode: 'path' | 'mixed'; schema?: SchemaId; grade: Grade } | null;
}

export interface AttemptRecord {
  problemId: string;
  seed: number;
  grade: Grade;
  schemas: SchemaId[];
  level: ScaffoldLevel;
  correct: boolean;
  errors: ErrorClass[];
  maxHint: number;
  usedH4: boolean;
  modelFirstTry: boolean;
  stepTimes: Partial<Record<FlowStepId, number>>;
  reflect?: MainStep;
  ts: number;
}

const EMPTY: ProgressState = { version: 1, grade: null, schemas: {}, last: null };

export function loadProgress(): ProgressState {
  const p = load<ProgressState>('progress', EMPTY);
  return p && p.version === 1 ? { ...EMPTY, ...p, schemas: { ...(p.schemas ?? {}) } } : { ...EMPTY };
}

export function saveProgress(p: ProgressState): void {
  save('progress', p);
}

export function appendAttempt(rec: AttemptRecord): void {
  const list = load<AttemptRecord[]>('attempts', []);
  const next = [...(Array.isArray(list) ? list : []), rec].slice(-300);
  save('attempts', next);
}

export function loadAttempts(): AttemptRecord[] {
  const list = load<AttemptRecord[]>('attempts', []);
  return Array.isArray(list) ? list : [];
}

export function newSchemaProgress(level: ScaffoldLevel = 3): SchemaProgress {
  return { level, examples: 0, history: [], consecWrong: 0, rung: 0, rungStreak: 0, solved: 0 };
}

/** Karışık sete girebilir mi? (S1 ya da S0) */
export function mixedEligible(p: ProgressState): SchemaId[] {
  return (Object.keys(p.schemas) as SchemaId[]).filter((s) => (p.schemas[s]?.level ?? 3) <= 1);
}

// ─── Oturum (sekme açık kaldıkça; sessionStorage) ──────────────────────────
export interface SessionInfo {
  newSchema: SchemaId | null;
  reflectCount: number;
  solved: number;
}

const SKEY = 'dokunsay:problem:session.v1';

export function loadSession(): SessionInfo {
  try {
    const raw = sessionStorage.getItem(SKEY);
    if (raw) return { newSchema: null, reflectCount: 0, solved: 0, ...JSON.parse(raw) };
  } catch {
    /* özel sekme vb. */
  }
  return { newSchema: null, reflectCount: 0, solved: 0 };
}

export function saveSession(s: SessionInfo): void {
  try {
    sessionStorage.setItem(SKEY, JSON.stringify(s));
  } catch {
    /* geç */
  }
}

/** Bu oturumda bu şemaya başlanabilir mi? (en fazla 1 yeni şema) */
export function canStartSchema(p: ProgressState, s: SessionInfo, schema: SchemaId): boolean {
  if (p.schemas[schema]) return true;
  return s.newSchema === null || s.newSchema === schema;
}

export interface ResultFlags {
  correct: boolean;
  maxHint: number;
  usedH4: boolean;
  modelFirstTry: boolean;
  /** Bir problem içinde model denetiminde art arda başarısızlık sayısı (en yüksek). */
  modelFailStreak: number;
  rungCount: number;
}

export interface LevelChange {
  schema: SchemaId;
  from: ScaffoldLevel;
  to: ScaffoldLevel;
}

/** Problem sonucunu uygular; düzey değiştiyse bildirir. Saf işlev (yeni nesne döner). */
export function applyResult(
  prog: ProgressState,
  schema: SchemaId,
  f: ResultFlags,
): { next: ProgressState; change: LevelChange | null } {
  const cur = { ...(prog.schemas[schema] ?? newSchemaProgress()) };
  cur.history = [...cur.history];
  const from = cur.level;
  cur.solved += 1;

  if (cur.level === 3) {
    // Çözümlü örnekler: her örnekte bir ana adım daha çocuğa bırakılır (geriye doğru).
    if (!f.usedH4) cur.examples += 1;
    if (cur.examples >= 4 && f.correct) {
      cur.level = 2;
      cur.examples = 0;
      cur.history = [];
    }
  } else {
    cur.history.push({ correct: f.correct, maxHint: f.maxHint, modelFirstTry: f.modelFirstTry, ts: Date.now() });
    cur.history = cur.history.slice(-5);
    cur.consecWrong = f.correct ? 0 : cur.consecWrong + 1;

    const goBack = cur.consecWrong >= 2 || f.usedH4 || f.modelFailStreak >= 2;
    const h = cur.history;
    const fade =
      h.length >= 5 &&
      h.filter((x) => x.correct).length >= 4 &&
      h.every((x) => x.maxHint <= 2) &&
      h.filter((x) => x.modelFirstTry).length >= 4;

    if (goBack && cur.level < 3) {
      cur.level = (cur.level + 1) as ScaffoldLevel;
      if (cur.level === 3) cur.examples = 2; // yarı çözümlü örnekten devam
      cur.history = [];
      cur.consecWrong = 0;
    } else if (fade && cur.level > 0) {
      cur.level = (cur.level - 1) as ScaffoldLevel;
      cur.history = [];
    }
  }

  // Merdiven: basamakta 3 ardışık doğru (H2 ve altı ipucu) → sonraki basamak.
  if (f.correct && f.maxHint <= 2 && !f.usedH4) cur.rungStreak += 1;
  else cur.rungStreak = 0;
  if (cur.rungStreak >= 3 && cur.rung < f.rungCount - 1) {
    cur.rung += 1;
    cur.rungStreak = 0;
  }

  const next: ProgressState = { ...prog, schemas: { ...prog.schemas, [schema]: cur } };
  return { next, change: from !== cur.level ? { schema, from, to: cur.level } : null };
}
