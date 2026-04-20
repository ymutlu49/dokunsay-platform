/**
 * DokunSay Platform — localStorage Wrapper
 *
 * Tutarlı anahtar kalıbı: dokunsay:<modul>:<konu>
 * Hata toleranslı (JSON parse fail, storage disabled, vb.)
 */

const NS = 'dokunsay';

function fullKey(modul, konu) {
  return `${NS}:${modul}:${konu}`;
}

export function saveState(modul, konu, data) {
  try {
    localStorage.setItem(fullKey(modul, konu), JSON.stringify(data));
    return true;
  } catch (_) {
    return false;
  }
}

export function loadState(modul, konu, fallback = null) {
  try {
    const raw = localStorage.getItem(fullKey(modul, konu));
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (_) {
    return fallback;
  }
}

export function removeState(modul, konu) {
  try {
    localStorage.removeItem(fullKey(modul, konu));
    return true;
  } catch (_) {
    return false;
  }
}

export function saveProgress(modul, activityId, payload) {
  const progress = loadState(modul, 'progress', {});
  progress[activityId] = {
    ...payload,
    completedAt: new Date().toISOString(),
  };
  return saveState(modul, 'progress', progress);
}

export function loadProgress(modul) {
  return loadState(modul, 'progress', {});
}

export function savePreference(modul, key, value) {
  const prefs = loadState(modul, 'prefs', {});
  prefs[key] = value;
  return saveState(modul, 'prefs', prefs);
}

export function loadPreference(modul, key, fallback = null) {
  const prefs = loadState(modul, 'prefs', {});
  return prefs[key] ?? fallback;
}

export function exportAll(modul) {
  const result = {};
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith(`${NS}:${modul}:`)) {
        result[k] = JSON.parse(localStorage.getItem(k));
      }
    }
  } catch (_) { /* geç */ }
  return result;
}
