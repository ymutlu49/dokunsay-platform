/**
 * Depolama — `@shared/storage.js` ince sarmalı (06 §2.7). Anahtarlar
 * `dokunsay:problem:<profil>.<konu>` biçimindedir; çocuk profili yoksa `local`.
 */
import { saveState, loadState, exportAll } from '@shared/storage.js';

const M = 'problem';

/** Etkin çocuk profili (öğretmen modülü `dokunsay:problem:activeProfile` yazar). */
export function profileId(): string {
  const p = loadState<string | null>(M, 'activeProfile', null);
  return typeof p === 'string' && /^[\w-]{1,40}$/.test(p) ? p : 'local';
}

export function save<T>(topic: string, value: T): boolean {
  return saveState(M, `${profileId()}.${topic}`, value);
}

export function load<T>(topic: string, fallback: T): T {
  const v = loadState<T>(M, `${profileId()}.${topic}`, fallback);
  return v ?? fallback;
}

/** Profilden bağımsız (cihaz) ayarları. */
export function saveDevice<T>(topic: string, value: T): boolean {
  return saveState(M, topic, value);
}
export function loadDevice<T>(topic: string, fallback: T): T {
  return loadState<T>(M, topic, fallback) ?? fallback;
}

export function exportProblemData(): Record<string, unknown> {
  return exportAll(M);
}
