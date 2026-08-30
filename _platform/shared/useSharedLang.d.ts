/**
 * DokunSay Platform — shared/useSharedLang.js tip bildirimi
 *
 * Dil, localStorage'daki 'dk_lang' anahtarı ve 'dk-lang-change' olayı ile
 * bütün uygulamalar arasında paylaşılır.
 */

/** [lang, setLang] — LangSwitcher ile birlikte kullanılır. */
export function useSharedLang(initial?: string): [string, (l: string) => void];
