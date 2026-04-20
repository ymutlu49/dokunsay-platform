export function pearson(xs, ys) {
  const n = Math.min(xs.length, ys.length);
  if (n < 2) return 0;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let sxy = 0, sxx = 0, syy = 0;
  for (let i = 0; i < n; i++) {
    const dx = xs[i] - mx;
    const dy = ys[i] - my;
    sxy += dx * dy;
    sxx += dx * dx;
    syy += dy * dy;
  }
  const denom = Math.sqrt(sxx * syy);
  if (denom === 0) return 0;
  return sxy / denom;
}

// Korelasyon yorumlama (eğitim bağlamında)
export function correlationLabel(r, lang) {
  const abs = Math.abs(r);
  const sign = r > 0 ? "pozitif" : r < 0 ? "negatif" : "yok";
  const signEn = r > 0 ? "positive" : r < 0 ? "negative" : "none";
  const signKu = r > 0 ? "pozîtîf" : r < 0 ? "negatîf" : "tune";
  let strength, strengthEn, strengthKu;
  if (abs < 0.1) { strength = "yok / çok zayıf"; strengthEn = "none / very weak"; strengthKu = "tune / pir qels"; }
  else if (abs < 0.3) { strength = "zayıf"; strengthEn = "weak"; strengthKu = "qels"; }
  else if (abs < 0.5) { strength = "orta-zayıf"; strengthEn = "moderate-weak"; strengthKu = "navîn-qels"; }
  else if (abs < 0.7) { strength = "orta"; strengthEn = "moderate"; strengthKu = "navîn"; }
  else if (abs < 0.9) { strength = "güçlü"; strengthEn = "strong"; strengthKu = "bihêz"; }
  else { strength = "çok güçlü"; strengthEn = "very strong"; strengthKu = "pir bihêz"; }
  if (lang === "ku") return `${strengthKu}, ${signKu}`;
  if (lang === "en") return `${strengthEn}, ${signEn}`;
  return `${strength}, ${sign}`;
}

// ═══════════════════════════════════════════════════════════════════
// SAÇILIM GRAFİĞİ (SCATTER PLOT) — iki değişkenli veri görselleştirmesi
// CODAP / TinkerPlots'un temel gücü: X-Y ekseninde noktalar + trend
