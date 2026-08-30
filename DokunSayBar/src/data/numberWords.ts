import type { Language } from "../types";

/**
 * Sayı sözcükleri — TTS ve SÖZEL GÖSTERİM için (index 0 = boş, 1-20).
 *
 * 11-20 EKLENDİ (2026-07-19): sembolik/sözel cümle özelliği (utils/sentence.ts) iki
 * çubuğun toplamını okuyor ve toplam 20'ye kadar çıkabiliyor. Tablo 10'da bitince
 * "yedi artı altı eşittir 13" gibi YARISI SÖZCÜK YARISI RAKAM cümleler doğuyordu.
 *
 * KURMANCÎ KAYNAĞI: uydurulmadı — projenin KENDİ yerleşik yazımı izlendi
 * (`services/voiceCommandService.ts` sayı sözlüğü ve DokunSayBasamak/utils/numberReaders.js).
 * Bu önemli: ses tanıma "dwanzdeh" bekliyorsa ekranda da "dwanzdeh" yazmalı, yoksa çocuk
 * duyduğu/söylediği sözcükle gördüğü sözcüğü eşleştiremez.
 */
export const NUMBER_WORDS: Record<Language, string[]> = {
  tr: ["", "bir", "iki", "üç", "dört", "beş", "altı", "yedi", "sekiz", "dokuz", "on",
       "on bir", "on iki", "on üç", "on dört", "on beş", "on altı", "on yedi", "on sekiz", "on dokuz", "yirmi"],
  ku: ["", "yek", "du", "sê", "çar", "pênc", "şeş", "heft", "heşt", "neh", "deh",
       "yanzdeh", "dwanzdeh", "sêzdeh", "çardeh", "panzdeh", "şanzdeh", "hivdeh", "hijdeh", "nozdeh", "bîst"],
  en: ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten",
       "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen", "twenty"],
  ar: ["", "واحد", "اثنان", "ثلاثة", "أربعة", "خمسة", "ستة", "سبعة", "ثمانية", "تسعة", "عشرة",
       "أحد عشر", "اثنا عشر", "ثلاثة عشر", "أربعة عشر", "خمسة عشر", "ستة عشر", "سبعة عشر", "ثمانية عشر", "تسعة عشر", "عشرون"],
  fa: ["", "یک", "دو", "سه", "چهار", "پنج", "شش", "هفت", "هشت", "نُه", "ده",
       "یازده", "دوازده", "سیزده", "چهارده", "پانزده", "شانزده", "هفده", "هجده", "نوزده", "بیست"],
};
