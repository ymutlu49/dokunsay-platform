/** Öğretmen paneli dizeleri (tr/ku/en; tip sistemi eksiksizliği zorlar). */
import type { Lang } from '../content/types';
import { en } from './i18n.en';
import { ku } from './i18n.ku';
import { tr, type TKey } from './i18n.tr';

export type { TKey };
const DICTS: Record<Lang, Record<TKey, string>> = { tr, ku, en };

export type TT = (key: TKey, vars?: Record<string, string | number>) => string;

export function tt(lang: Lang): TT {
  return (key, vars) => {
    const s = DICTS[lang]?.[key] || tr[key] || String(key);
    if (!vars) return s;
    return s.replace(/\{(\w+)\}/g, (m, k: string) => (k in vars ? String(vars[k]) : m));
  };
}
