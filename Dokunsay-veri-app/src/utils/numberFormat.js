// ═══════════════════════════════════════════════════════════════════
// BÜYÜK SAYI SÖZEL GÖSTERİM — diskalkuli için kritik
// Örn: 15.70 → "15 milyon 700 bin"
// Örn: 5.86 → "5 milyon 860 bin"
// Örn: 85.66 → "85 milyon 660 bin"
// Input: milyon cinsinden ondalık sayı
// ═══════════════════════════════════════════════════════════════════
export function numberToWords(millions, lang) {
  if (millions == null || isNaN(millions)) return "";
  const wholeMil = Math.floor(millions);
  const frac = millions - wholeMil;
  const thousands = Math.round(frac * 1000);

  const labels = {
    tr: { million: "milyon", thousand: "bin", and: " " },
    ku: { million: "mîlyon", thousand: "hezar", and: " û " },
    en: { million: "million", thousand: "thousand", and: ", " },
  };
  const L = labels[lang] || labels.tr;

  if (wholeMil > 0 && thousands > 0) {
    return `${wholeMil} ${L.million}${L.and}${thousands} ${L.thousand}`;
  }
  if (wholeMil > 0) {
    return `${wholeMil} ${L.million}`;
  }
  if (thousands > 0) {
    return `${thousands} ${L.thousand}`;
  }
  return "0";
}

// Küçük sayılar için (milyar vb): yalın formatlama
export function formatBigNumber(n, lang) {
  if (n >= 1e9) return `${(n/1e9).toFixed(2)} ${lang === "en" ? "billion" : lang === "ku" ? "mîlyar" : "milyar"}`;
  if (n >= 1e6) return `${(n/1e6).toFixed(2)} ${lang === "en" ? "million" : lang === "ku" ? "mîlyon" : "milyon"}`;
  if (n >= 1e3) return `${(n/1e3).toFixed(1)} ${lang === "en" ? "K" : "bin"}`;
  return String(n);
}
