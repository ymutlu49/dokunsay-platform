import type { Language } from "../types";

/** Number words for TTS (index 0 = empty, 1-10 = words) */
export const NUMBER_WORDS: Record<Language, string[]> = {
  tr: ["", "bir", "iki", "üç", "dört", "beş", "altı", "yedi", "sekiz", "dokuz", "on"],
  ku: ["", "yek", "du", "sê", "çar", "pênc", "şeş", "heft", "heşt", "neh", "deh"],
  en: ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"],
  ar: ["", "واحد", "اثنان", "ثلاثة", "أربعة", "خمسة", "ستة", "سبعة", "ثمانية", "تسعة", "عشرة"],
  fa: ["", "یک", "دو", "سه", "چهار", "پنج", "شش", "هفت", "هشت", "نُه", "ده"],
};
