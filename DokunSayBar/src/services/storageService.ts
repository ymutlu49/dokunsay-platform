import type { ProgressMap, Template } from "../types";

async function storageGet(key: string): Promise<string | null> {
  try {
    if ((window as any).storage?.get) {
      const result = await (window as any).storage.get(key);
      return result?.value ?? null;
    }
    return localStorage.getItem(key);
  } catch {
    return localStorage.getItem(key);
  }
}

async function storageSet(key: string, value: string): Promise<void> {
  try {
    if ((window as any).storage?.set) {
      await (window as any).storage.set(key, value);
    } else {
      localStorage.setItem(key, value);
    }
  } catch {
    try { localStorage.setItem(key, value); } catch { /* storage full */ }
  }
}

const PROGRESS_KEY = "ds-progress";
const CUSTOM_TPL_KEY = "ds-custom-tpl";

export async function loadProgress(): Promise<ProgressMap> {
  const raw = await storageGet(PROGRESS_KEY);
  if (!raw) return {};
  try { return JSON.parse(raw); } catch { return {}; }
}

export async function saveProgress(progress: ProgressMap): Promise<void> {
  await storageSet(PROGRESS_KEY, JSON.stringify(progress));
}

export async function loadCustomTemplates(): Promise<Template[]> {
  const raw = await storageGet(CUSTOM_TPL_KEY);
  if (!raw) return [];
  try { return JSON.parse(raw); } catch { return []; }
}

export async function saveCustomTemplates(templates: Template[]): Promise<void> {
  await storageSet(CUSTOM_TPL_KEY, JSON.stringify(templates));
}
