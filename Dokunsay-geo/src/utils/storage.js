// ══════════════════════════════════════════════════════════════
// localStorage sarmalayıcıları — SSR-safe, try/catch korumalı.
// Okuma/yazma anahtarları tek yerde toplanır; App bu yüzey üzerinden erişir.
// ══════════════════════════════════════════════════════════════

export const STORAGE_KEYS = {
  LANG: "dg_lang",
  SCORE: "dg_score",
  SHOW_SIDES: "dg_sides",
  SHOW_ANGLES: "dg_angles",
  COLOR_BLIND: "dg_cb",
  DYSCALC: "dg_dys",
  TTS: "dg_tts",
  PLAN_DRAFT: "dg_plan_draft",
  ACTIVE_PLAN: "dg_active_plan",
  PLAN_PROGRESS: "dg_plan_progress",
  VH_PROGRESS: "vhProgress",
};

const hasStorage = () => typeof window !== "undefined" && !!window.localStorage;

export function readString(key, fallback = "") {
  if (!hasStorage()) return fallback;
  return window.localStorage.getItem(key) ?? fallback;
}

export function writeString(key, value) {
  if (!hasStorage()) return;
  try { window.localStorage.setItem(key, String(value)); } catch { /* quota or disabled */ }
}

export function readBool(key, fallback = false) {
  if (!hasStorage()) return fallback;
  const raw = window.localStorage.getItem(key);
  if (raw === null) return fallback;
  return raw === "1" || raw === "true";
}

export function writeBool(key, value) {
  writeString(key, value ? "1" : "0");
}

export function readInt(key, fallback = 0) {
  if (!hasStorage()) return fallback;
  const raw = window.localStorage.getItem(key);
  const n = parseInt(raw || "", 10);
  return Number.isFinite(n) ? n : fallback;
}

export function readJSON(key, fallback) {
  if (!hasStorage()) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function writeJSON(key, value) {
  if (!hasStorage()) return;
  try { window.localStorage.setItem(key, JSON.stringify(value)); } catch { /* ignore */ }
}

export function removeKey(key) {
  if (!hasStorage()) return;
  try { window.localStorage.removeItem(key); } catch { /* ignore */ }
}
