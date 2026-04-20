const TR_ONES = { sıfır: 0, bir: 1, iki: 2, üç: 3, dört: 4, beş: 5, altı: 6, yedi: 7, sekiz: 8, dokuz: 9 };
const TR_TENS = { on: 10, yirmi: 20, otuz: 30, kırk: 40, elli: 50, altmış: 60, yetmiş: 70, seksen: 80, doksan: 90 };

export function parseTurkishNumber(text) {
  const words = text.toLowerCase().trim().split(/\s+/);
  let total = 0, current = 0;
  for (const w of words) {
    if (w in TR_ONES) { current += TR_ONES[w]; }
    else if (w in TR_TENS) { current += TR_TENS[w]; }
    else if (w === "yüz") { current = current === 0 ? 100 : current * 100; }
    else if (w === "bin") { current = current === 0 ? 1000 : current * 1000; total += current; current = 0; }
  }
  total += current;
  return total > 0 ? total : null;
}

export function extractLeadingNumber(text) {
  const words = text.split(/\s+/);
  let numWords = [], i = 0;
  while (i < words.length) {
    const w = words[i].toLowerCase();
    if (w in TR_ONES || w in TR_TENS || w === "yüz" || w === "bin") {
      numWords.push(words[i]); i++;
    } else break;
  }
  if (!numWords.length) return { count: 1, rest: text };
  const count = parseTurkishNumber(numWords.join(" ")) || 1;
  return { count, rest: words.slice(i).join(" ") };
}

export function interpretCommand(raw) {
  const t = raw.toLowerCase().replace(/[.,!?]/g, "").replace(/\bi̇\b/g, "i").trim();

  if (/yardım|komutlar|ne yapabilirim/.test(t))
    return { type: "HELP", label: "Komut listesi açıldı" };
  if (/temizle|hepsini sil|sıfırla|kanvası temizle/.test(t))
    return { type: "CLEAR", label: "Kanvas temizlendi" };
  if (/geri al|iptal/.test(t)) return { type: "UNDO", label: "Geri alındı" };
  if (/ileri al|yinele/.test(t)) return { type: "REDO", label: "İleri alındı" };
  if (/oku|söyle|seslendir|toplam nedir|kaç( edi[ry])?|değer nedir/.test(t))
    return { type: "SPEAK", label: "Toplam seslendirildi" };
  if (/quiz başlat|quiz|sınav başlat/.test(t))
    return { type: "QUIZ", label: "Quiz başlatıldı" };
  if (/sayı oluştur|inşa et|hedef sayı/.test(t))
    return { type: "BUILD", label: "Sayı Oluştur başlatıldı" };

  const grpMatch = t.match(/(\w+\s+)?grupla/);
  if (grpMatch) {
    const pre = (grpMatch[1] || "").trim();
    const bt = pre === "birlik" ? "ones" : pre === "onluk" ? "tens" : pre === "yüzlük" ? "huns" : null;
    return { type: "GROUP", payload: { blockType: bt }, label: "Gruplama komutu" };
  }

  const brkMatch = t.match(/(\w+\s+)?çöz/);
  if (brkMatch) {
    const pre = (brkMatch[1] || "").trim();
    const bt = pre === "onluk" ? "tens" : pre === "yüzlük" ? "huns" : pre === "binlik" ? "ths" : null;
    return { type: "BREAK", payload: { blockType: bt }, label: "Çözme komutu" };
  }

  const showMatch = t.match(/^(.+?)\s+(göster|oluştur|yap|ekle|koy)$/);
  if (showMatch) {
    const n = parseTurkishNumber(showMatch[1]);
    if (n && n > 0 && n <= 9999)
      return { type: "SHOW_NUMBER", payload: { n }, label: `${n} bloklarla gösteriliyor` };
  }

  const blockPatterns = [
    { rx: /^(.+?\s+)?birlik(\s+ekle)?$/, bt: "ones", label: "birlik" },
    { rx: /^(.+?\s+)?onluk(\s+ekle)?$/, bt: "tens", label: "onluk" },
    { rx: /^(.+?\s+)?yüzlük(\s+ekle)?$/, bt: "huns", label: "yüzlük" },
    { rx: /^(.+?\s+)?binlik(\s+ekle)?$/, bt: "ths", label: "binlik" },
    { rx: /^(.+?)\s+tane\s+birlik/, bt: "ones", label: "birlik" },
    { rx: /^(.+?)\s+tane\s+onluk/, bt: "tens", label: "onluk" },
    { rx: /^(.+?)\s+tane\s+yüzlük/, bt: "huns", label: "yüzlük" },
    { rx: /^(.+?)\s+tane\s+binlik/, bt: "ths", label: "binlik" },
  ];
  for (const { rx, bt, label } of blockPatterns) {
    const m = t.match(rx);
    if (m) {
      const prefix = (m[1] || "").trim();
      const count = prefix ? (parseTurkishNumber(prefix) || 1) : 1;
      return { type: "ADD_BLOCK", payload: { blockType: bt, count: Math.min(count, 20) }, label: `${Math.min(count, 20)} ${label} eklendi` };
    }
  }

  if (/basamak tablosu?\s*(göster|aç)/i.test(t)) return { type: "TOGGLE_WIDGET", payload: { w: "mat", v: true }, label: "Basamak tablosu açıldı" };
  if (/basamak tablosu?\s*(gizle|kapat)/i.test(t)) return { type: "TOGGLE_WIDGET", payload: { w: "mat", v: false }, label: "Basamak tablosu kapatıldı" };
  if (/sayı doğrusu?\s*(göster|aç)/i.test(t)) return { type: "TOGGLE_WIDGET", payload: { w: "line", v: true }, label: "Sayı doğrusu açıldı" };
  if (/sayı doğrusu?\s*(gizle|kapat)/i.test(t)) return { type: "TOGGLE_WIDGET", payload: { w: "line", v: false }, label: "Sayı doğrusu kapatıldı" };
  if (/çerçeve\s*(göster|aç)/i.test(t)) return { type: "TOGGLE_WIDGET", payload: { w: "frame", v: true }, label: "On'luk çerçeve açıldı" };
  if (/çerçeve\s*(gizle|kapat)/i.test(t)) return { type: "TOGGLE_WIDGET", payload: { w: "frame", v: false }, label: "On'luk çerçeve kapatıldı" };
  if (/değerleri?\s*(göster|aç)/i.test(t)) return { type: "TOGGLE_WIDGET", payload: { w: "vals", v: true }, label: "Değerler gösterildi" };
  if (/değerleri?\s*(gizle|kapat)/i.test(t)) return { type: "TOGGLE_WIDGET", payload: { w: "vals", v: false }, label: "Değerler gizlendi" };
  if (/çözümleme\s*(göster|aç)/i.test(t)) return { type: "TOGGLE_WIDGET", payload: { w: "decomp", v: true }, label: "Çözümleme diyagramı açıldı" };
  if (/çözümleme\s*(gizle|kapat)/i.test(t)) return { type: "TOGGLE_WIDGET", payload: { w: "decomp", v: false }, label: "Çözümleme diyagramı kapatıldı" };
  if (/tablet\s*(göster|aç)/i.test(t)) return { type: "TOGGLE_WIDGET", payload: { w: "tablet", v: true }, label: "DokunSay Tableti açıldı" };
  if (/tablet\s*(gizle|kapat)/i.test(t)) return { type: "TOGGLE_WIDGET", payload: { w: "tablet", v: false }, label: "DokunSay Tableti kapatıldı" };
  if (/büyüt|yakınlaştır/.test(t)) return { type: "ZOOM", payload: { dir: 1 }, label: "Yakınlaştırıldı" };
  if (/küçült|uzaklaştır/.test(t)) return { type: "ZOOM", payload: { dir: -1 }, label: "Uzaklaştırıldı" };
  if (/normal boyut|yüzde yüz|sıfırla zoom/.test(t)) return { type: "ZOOM", payload: { dir: 0 }, label: "Zoom sıfırlandı" };
  if (/yeni sayfa|sayfa ekle/.test(t)) return { type: "PAGE", label: "Yeni sayfa eklendi" };
  if (/renk körü\s*(aç|etkinleştir)/i.test(t)) return { type: "TOGGLE_WIDGET", payload: { w: "colorBlind", v: true }, label: "Renk körü modu açıldı" };
  if (/renk körü\s*(kapat|devre)/i.test(t)) return { type: "TOGGLE_WIDGET", payload: { w: "colorBlind", v: false }, label: "Renk körü modu kapatıldı" };
  if (/yüksek kontrast\s*(aç|etkin)/i.test(t)) return { type: "TOGGLE_WIDGET", payload: { w: "contrast", v: true }, label: "Yüksek kontrast açıldı" };
  if (/yüksek kontrast\s*(kapat|devre)/i.test(t)) return { type: "TOGGLE_WIDGET", payload: { w: "contrast", v: false }, label: "Yüksek kontrast kapatıldı" };

  return { type: "UNKNOWN", label: `Anlaşılamadı: "${raw}"` };
}
