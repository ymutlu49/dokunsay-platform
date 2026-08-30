// ══════════════════════════════════════════════════════════════
// DİL SEÇİCİ YARDIMCILARI
//
// 2026-07-19 DENETİMİ — kapatılan kusur:
// Kod tabanında 135 yerde şu kalıp vardı:
//     lang==="ku" ? def.labelKu : lang==="en" ? def.labelEn : def.label
// Arayüz 5 dil sunuyordu (tr/ku/en/ar/fa) ama bu üçlü ternary'de
// ar ve fa hiçbir dala düşmüyor, SESSİZCE Türkçeye iniyordu.
// Yani Arapça arayüzde şekil adları Türkçe çıkıyordu.
// (Aynı kusur DokunSayBasamak'ta da tespit edilmişti.)
//
// Buradaki iki fonksiyon tek doğru yoldur; yeni ternary YAZILMAZ.
// ══════════════════════════════════════════════════════════════

const SUFFIX = { tr: "", ku: "Ku", en: "En", ar: "Ar", fa: "Fa" };

/**
 * `{label, labelKu, labelEn, labelAr, labelFa}` biçimli tanım nesnesinden
 * dile uygun etiketi döndürür. Dil yoksa/eksikse Türkçeye düşer.
 */
export function pickLabel(def, lang) {
  if (!def) return "";
  const key = "label" + (SUFFIX[lang] ?? "");
  return def[key] || def.label || "";
}

/**
 * `{tr, ku, en, ar, fa}` biçimli metin nesnesinden dile uygun dizeyi döndürür.
 * Nesne değilse (düz dize) olduğu gibi geri verir.
 */
export function pickText(obj, lang) {
  if (obj == null) return "";
  if (typeof obj !== "object") return obj;
  return obj[lang] || obj.tr || "";
}
