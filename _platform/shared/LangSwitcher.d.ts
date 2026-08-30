import type { FC } from "react";

export interface LangSwitcherProps {
  lang: string;
  setLang: (l: string) => void;
  langs?: readonly string[] | string[];
  labels?: Record<string, string>;
}

export const LangSwitcher: FC<LangSwitcherProps>;

/** Kullanıcıya SUNULAN diller. ar/fa 2026-07-19'da gizlendi (içerik doğrulanamadı). */
export const VISIBLE_LANGS: readonly string[];
/** Kod tarafında tanınan tüm diller — gizlenenler dahil. */
export const KNOWN_LANGS: readonly string[];
/** Kayıtlı/gelen dil kodunu sunulan dillere indirger (gizli dilde açılmayı önler). */
export function normalizeLang(lang: string | null | undefined, allowed?: readonly string[]): string;
/** AR/FA sağdan sola yazılır — gizlense de kod tarafında geçerli kalır. */
export function isRTL(lang: string): boolean;
