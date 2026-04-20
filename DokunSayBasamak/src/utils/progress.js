const STORAGE_KEY = "dokun_say_progress";
const DEFAULT_PROGRESS = { sessions: [], quizHistory: [], totalTime: 0 };

export function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : { ...DEFAULT_PROGRESS };
  } catch {
    return { ...DEFAULT_PROGRESS };
  }
}

export function saveProgress(p) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(p)); }
  catch { /* ignore */ }
}
