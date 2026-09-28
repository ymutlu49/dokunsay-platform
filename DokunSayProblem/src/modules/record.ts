/**
 * Modül kayıtları — her madde: modül kimliği, şema, doğru/yanlış (ilk deneme), ErrorClass.
 * progress.ts'nin `appendAttempt` kaydı TAM ÇÖZÜM içindir (iskele düzeyi, adım süreleri);
 * modül maddeleri onu kirletmesin diye ayrı konu: `dokunsay:problem:<profil>.modules`
 * (lib/storage.ts → @shared/storage.js). Öğretmen paneli ikisini birlikte okur.
 */
import type { ErrorClass, Grade, SchemaId } from '../content/types';
import { load, save, loadDevice } from '../lib/storage';
import { loadProgress } from '../lib/progress';

export type ModuleId =
  | 'retell'
  | 'typeHunter'
  | 'strip'
  | 'modelEq'
  | 'reasonable'
  | 'sortRelevant'
  | 'wordTrap'
  | 'errorDetective'
  | 'detective'
  | 'remainder'
  | 'poser';

export interface ModuleRecord {
  module: ModuleId;
  grade: Grade;
  schema?: SchemaId;
  /** Tür Avcısı: çocuğun İLK seçtiği şema (karışıklık matrisi). */
  chosen?: SchemaId;
  correct: boolean;
  error?: ErrorClass;
  problemId?: string;
  ts: number;
}

const TOPIC = 'modules';

export function loadModuleRecords(): ModuleRecord[] {
  const list = load<ModuleRecord[]>(TOPIC, []);
  return Array.isArray(list) ? list : [];
}

export function recordItem(rec: Omit<ModuleRecord, 'ts'>): void {
  const next = [...loadModuleRecords(), { ...rec, ts: Date.now() }].slice(-500);
  save(TOPIC, next);
}

/** Öğretmenin açtığı modül kilitleri (cihaz ayarı; öğretmen paneli yazar). */
export function teacherUnlocked(): boolean {
  return loadDevice<boolean>('modulesUnlock', false) === true;
}

/** App sınıfı vermezse: ilerlemedeki sınıf → son oturumun sınıfı → 2. */
export function currentGrade(): Grade {
  const p = loadProgress();
  return p.grade ?? p.last?.grade ?? 2;
}
