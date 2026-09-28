/**
 * Üç dilli arayüz katmanı (tr/ku/en — üçü de EKSİKSİZ; tip sistemi zorlar).
 * İçerik metinleri (problem, ipucu, geri bildirim) içerik motorundan `L10n` olarak gelir;
 * burada yalnız arayüz dizeleri durur. Ortak `menu_*`/`btn_*` anahtarlarıyla çakışmaz.
 */
import { createContext, useContext } from 'react';
import type { L10n, Lang } from '../content/types';
import { tr, type Key } from './tr';
import { ku } from './ku';
import { en } from './en';

export type { Key };
export const LANG_CODES: readonly Lang[] = ['tr', 'ku', 'en'];

const DICTS: Record<Lang, Record<Key, string>> = { tr, ku, en };

export function isLang(v: unknown): v is Lang {
  return v === 'tr' || v === 'ku' || v === 'en';
}

export type TFn = (key: Key, vars?: Record<string, string | number>) => string;

export function translate(lang: Lang, key: Key, vars?: Record<string, string | number>): string {
  const s = DICTS[lang]?.[key] ?? tr[key] ?? String(key);
  if (!vars) return s;
  return s.replace(/\{(\w+)\}/g, (m, k: string) => (k in vars ? String(vars[k]) : m));
}

export const LangContext = createContext<Lang>('tr');

export function useLang(): Lang {
  return useContext(LangContext);
}

export function useT(): TFn {
  const lang = useContext(LangContext);
  return (key, vars) => translate(lang, key, vars);
}

/** İçerik L10n'inden seçili dili al (boşsa Türkçeye düşmeden önce İngilizceyi dener). */
export function pick(l: L10n | string | undefined | null, lang: Lang): string {
  if (l == null) return '';
  if (typeof l === 'string') return l;
  return l[lang] || l.tr || l.en || '';
}
