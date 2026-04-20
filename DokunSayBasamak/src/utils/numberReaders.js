export function readTurkish(n) {
  if (n === 0) return "sıfır";
  const ones = ["","bir","iki","üç","dört","beş","altı","yedi","sekiz","dokuz"];
  const tens = ["","on","yirmi","otuz","kırk","elli","altmış","yetmiş","seksen","doksan"];
  let s = "", r = n;
  const th = Math.floor(r / 1000);
  if (th > 0) { s += (th > 1 ? ones[th] + " " : "") + "bin "; r %= 1000; }
  const hu = Math.floor(r / 100);
  if (hu > 0) { s += (hu > 1 ? ones[hu] + " " : "") + "yüz "; r %= 100; }
  const t = Math.floor(r / 10);
  if (t > 0) { s += tens[t] + " "; r %= 10; }
  if (r > 0) s += ones[r];
  return s.trim();
}

export function readKurdish(n) {
  if (n === 0) return "sifir";
  const ones = ["","yek","du","sê","çar","pênc","şeş","heft","heşt","neh"];
  const teens = ["deh","yanzdeh","dwanzdeh","sêzdeh","çardeh","panzdeh",
                 "şanzdeh","hevdeh","hejdeh","nozdeh"];
  const tensW = ["","deh","bîst","sih","çil","pêncî","şêst","heftê","heştê","nod"];
  const sep = " û ";
  let parts = [], r = n;
  const th = Math.floor(r / 1000);
  if (th > 0) { parts.push((th > 1 ? ones[th] + " " : "") + "hezar"); r %= 1000; }
  const hu = Math.floor(r / 100);
  if (hu > 0) { parts.push((hu > 1 ? ones[hu] + " " : "") + "sed"); r %= 100; }
  if (r >= 10 && r <= 19) { parts.push(teens[r - 10]); r = 0; }
  const t = Math.floor(r / 10);
  if (t > 0) { const o = r % 10; parts.push(tensW[t] + (o > 0 ? sep + ones[o] : "")); r = 0; }
  if (r > 0) parts.push(ones[r]);
  return parts.join(sep);
}

// Arapça (Modern Standart / eğitim terminolojisi) — İsfar/Iraq müfredatı ile uyumlu
export function readArabic(n) {
  if (n === 0) return "صفر";
  const ones = ["","واحد","اثنان","ثلاثة","أربعة","خمسة","ستة","سبعة","ثمانية","تسعة"];
  const teens = ["عشرة","أحد عشر","اثنا عشر","ثلاثة عشر","أربعة عشر","خمسة عشر",
                 "ستة عشر","سبعة عشر","ثمانية عشر","تسعة عشر"];
  const tensW = ["","عشرة","عشرون","ثلاثون","أربعون","خمسون","ستون","سبعون","ثمانون","تسعون"];
  const huns = ["","مئة","مئتان","ثلاثمئة","أربعمئة","خمسمئة","ستمئة","سبعمئة","ثمانمئة","تسعمئة"];
  const sep = " و";
  let parts = [], r = n;
  const th = Math.floor(r / 1000);
  if (th > 0) {
    if (th === 1) parts.push("ألف");
    else if (th === 2) parts.push("ألفان");
    else if (th <= 10) parts.push(ones[th] + " آلاف");
    else parts.push(ones[th] + " ألفاً");
    r %= 1000;
  }
  const hu = Math.floor(r / 100);
  if (hu > 0) { parts.push(huns[hu]); r %= 100; }
  if (r >= 10 && r <= 19) { parts.push(teens[r - 10]); r = 0; }
  else {
    const t = Math.floor(r / 10), o = r % 10;
    if (o > 0 && t > 0) parts.push(ones[o] + sep + tensW[t]);
    else if (t > 0) parts.push(tensW[t]);
    else if (o > 0) parts.push(ones[o]);
  }
  return parts.join(sep);
}

// Farsça (İran müfredatı) — sade okunuş
export function readPersian(n) {
  if (n === 0) return "صفر";
  const ones = ["","یک","دو","سه","چهار","پنج","شش","هفت","هشت","نه"];
  const teens = ["ده","یازده","دوازده","سیزده","چهارده","پانزده",
                 "شانزده","هفده","هجده","نوزده"];
  const tensW = ["","ده","بیست","سی","چهل","پنجاه","شصت","هفتاد","هشتاد","نود"];
  const huns = ["","صد","دویست","سیصد","چهارصد","پانصد","ششصد","هفتصد","هشتصد","نهصد"];
  const sep = " و ";
  let parts = [], r = n;
  const th = Math.floor(r / 1000);
  if (th > 0) { parts.push((th > 1 ? ones[th] + " " : "") + "هزار"); r %= 1000; }
  const hu = Math.floor(r / 100);
  if (hu > 0) { parts.push(huns[hu]); r %= 100; }
  if (r >= 10 && r <= 19) { parts.push(teens[r - 10]); r = 0; }
  else {
    const t = Math.floor(r / 10), o = r % 10;
    if (t > 0 && o > 0) parts.push(tensW[t] + sep + ones[o]);
    else if (t > 0) parts.push(tensW[t]);
    else if (o > 0) parts.push(ones[o]);
  }
  return parts.join(sep);
}

export function readEnglish(n) {
  if (n === 0) return "zero";
  const sm = ["","one","two","three","four","five","six","seven","eight","nine",
               "ten","eleven","twelve","thirteen","fourteen","fifteen",
               "sixteen","seventeen","eighteen","nineteen"];
  const tens = ["","","twenty","thirty","forty","fifty","sixty","seventy","eighty","ninety"];
  function below100(x) {
    if (x < 20) return sm[x];
    const t = Math.floor(x / 10), o = x % 10;
    return tens[t] + (o ? "-" + sm[o] : "");
  }
  let s = "", r = n;
  const th = Math.floor(r / 1000);
  if (th > 0) { s += below100(th) + " thousand"; r %= 1000; if (r > 0) s += " "; }
  const hu = Math.floor(r / 100);
  if (hu > 0) { s += sm[hu] + " hundred"; r %= 100; if (r > 0) s += " and "; }
  if (r > 0) s += below100(r);
  return s.trim();
}
