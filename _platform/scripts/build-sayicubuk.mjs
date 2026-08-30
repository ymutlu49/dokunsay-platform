// DokunSay Noktalı Sayı Çubukları — ürün tanıtım sayfası üreteci.
// Çıktı: dist-site/sayi-cubuklari/index.html (DokunSay yeşil, statik, yeni SVG görsellerle).
// Kullanım: node _platform/scripts/build-sayicubuk.mjs
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SITE_HEADER_CSS, renderSiteHeader } from './site-header.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dirname, '..', '..', 'dist-site', 'sayi-cubuklari', 'index.html');

// ── DokunSay Bar gerçek görseli: kehribar (ahşap) delikli çubuk + renkli pullar + çerçeve
// Bar oranları (Rod.tsx): hücre 48 · yükseklik 56 · delik r16 · kenar #78350f · gradyan #fde047→#f59e0b→#78350f
const CHIP = { blue: ['#3b82f6', '#1e40af'], red: ['#dc2626', '#991b1b'], green: ['#22c55e', '#15803d'], yellow: ['#eab308', '#a16207'] };
const PF = 'font-family="Poppins, system-ui, sans-serif"';
const DEFS = '<defs>'
  + '<linearGradient id="gR" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fde047"/><stop offset=".30" stop-color="#f59e0b"/><stop offset="1" stop-color="#78350f"/></linearGradient>'
  + '<radialGradient id="gH" cx=".45" cy=".38"><stop offset="0" stop-color="#2b2b2b"/><stop offset="1" stop-color="#050505"/></radialGradient>'
  + '</defs>';

// Tek çubuk — sol-üst (x,y), hücre genişliği U. chips=[renk|null,...] verilirse deliklere pul oturur; yoksa boş koyu delik.
function rod(count, x, y, U, chips) {
  const h = U * 56 / 48, r = U * 16 / 48, sw = Math.max(1.5, U * 3 / 48), rx = U * 10 / 48, w = count * U;
  let g = `<rect x="${(x + sw / 2).toFixed(1)}" y="${(y + sw / 2).toFixed(1)}" width="${(w - sw).toFixed(1)}" height="${(h - sw).toFixed(1)}" rx="${rx.toFixed(1)}" fill="url(#gR)" stroke="#78350f" stroke-width="${sw.toFixed(1)}"/>`;
  for (let i = 0; i < count; i++) {
    const cx = x + i * U + U / 2, cy = y + h / 2, c = chips && chips[i];
    if (c) g += `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${r.toFixed(1)}" fill="${CHIP[c][0]}" stroke="${CHIP[c][1]}" stroke-width="${(sw * 0.7).toFixed(1)}"/>`;
    else g += `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${r.toFixed(1)}" fill="url(#gH)" stroke="rgba(0,0,0,.5)" stroke-width="${(sw * 0.55).toFixed(1)}"/>`;
  }
  return { g, w, h };
}

// Çerçeve (5'lik/10'luk) — rows×cols, hücre U; fills satır-major [renk|null,...]
function frame(rows, cols, x, y, U, fills) {
  const pad = U * 6 / 50, hr = U * 17 / 50, sw = Math.max(1.5, U * 3 / 50), w = cols * U + pad * 2, h = rows * U + pad * 2;
  let g = `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${w.toFixed(1)}" height="${h.toFixed(1)}" rx="${(U * 0.2).toFixed(1)}" fill="url(#gR)" stroke="#78350f" stroke-width="${sw.toFixed(1)}"/>`;
  for (let rr = 0; rr < rows; rr++) for (let cc = 0; cc < cols; cc++) {
    const cx = x + pad + cc * U + U / 2, cy = y + pad + rr * U + U / 2, fc = fills && fills[rr * cols + cc];
    if (fc) g += `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${hr.toFixed(1)}" fill="${CHIP[fc][0]}" stroke="${CHIP[fc][1]}" stroke-width="${(sw * 0.7).toFixed(1)}"/>`;
    else g += `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${hr.toFixed(1)}" fill="url(#gH)" stroke="rgba(0,0,0,.45)" stroke-width="${(sw * 0.6).toFixed(1)}"/>`;
  }
  return { g, w, h };
}

// Serbest pul (sayma nesnesi)
function chipFree(cx, cy, r, color) {
  return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${CHIP[color][0]}" stroke="${CHIP[color][1]}" stroke-width="2"/>`;
}

// ── Görsel 1: 1→10 kehribar delikli çubuk merdiveni (uzunluk = sayı)
function staircase() {
  const U = 34, GAP = 7, X0 = 38, Y0 = 6, h = U * 56 / 48;
  let body = '';
  for (let n = 1; n <= 10; n++) {
    const y = Y0 + (n - 1) * (h + GAP);
    body += `<text x="28" y="${(y + h / 2 + 5).toFixed(1)}" text-anchor="end" font-size="15" font-weight="800" fill="#1b5e20" ${PF}>${n}</text>`;
    body += rod(n, X0, y, U, null).g;
  }
  const W = X0 + 10 * U + 8, H = Y0 + 10 * (h + GAP);
  return `<svg viewBox="0 0 ${W.toFixed(0)} ${H.toFixed(0)}" role="img" aria-label="1'den 10'a kehribar delikli sayı çubukları merdiveni" ${PF} style="width:100%;height:auto;display:block">${DEFS}${body}</svg>`;
}

// ── Görsel 2: Set bileşenleri — kehribar delikli çubuklar + pullar + 5'lik/10'luk çerçeve
function components() {
  const U = 30, h = U * 56 / 48;
  let s = '';
  // sol: örnek çubuklar (4, 7, 10)
  s += `<text x="12" y="18" font-size="12.5" font-weight="700" fill="#1b5e20" ${PF}>Delikli çubuklar (1–10)</text>`;
  [4, 7, 10].forEach((n, k) => { s += rod(n, 12, 26 + k * (h + 9), U, null).g; });
  // sol-alt: pullar
  const py = 26 + 3 * (h + 9) + 10;
  s += `<text x="12" y="${(py - 8).toFixed(0)}" font-size="12.5" font-weight="700" fill="#1b5e20" ${PF}>Pullar (sayma nesneleri)</text>`;
  ['blue', 'red', 'green', 'yellow', 'blue', 'red', 'green', 'yellow'].forEach((c, i) => { s += chipFree(24 + i * 30, py + 16, 11, c); });
  // sağ: 10'luk (7 dolu) + 5'lik (3 dolu)
  const FX = 348, FU = 32, pad = FU * 6 / 50;
  s += `<text x="${FX}" y="18" font-size="12.5" font-weight="700" fill="#1b5e20" ${PF}>10'luk çerçeve</text>`;
  s += frame(2, 5, FX, 26, FU, [...Array(10)].map((_, i) => (i < 7 ? 'blue' : null))).g;
  const f5y = 26 + 2 * FU + pad * 2 + 32;
  s += `<text x="${FX}" y="${(f5y - 8).toFixed(0)}" font-size="12.5" font-weight="700" fill="#1b5e20" ${PF}>5'lik çerçeve</text>`;
  s += frame(1, 5, FX, f5y, FU, [...Array(5)].map((_, i) => (i < 3 ? 'green' : null))).g;
  return `<svg viewBox="0 0 540 ${(py + 32).toFixed(0)}" role="img" aria-label="Set bileşenleri: kehribar delikli çubuklar, renkli pullar, beşlik ve onluk çerçeveler" ${PF} style="width:100%;height:auto;display:block">${DEFS}${s}</svg>`;
}

// ── Görsel 3: Sembolik olmayan toplama (3 + 4 = 7) — çubuk uzunlukları toplanır
function addScene() {
  const U = 30, h = U * 56 / 48, y = 34;
  const lab = (cx, t, col) => `<text x="${cx.toFixed(0)}" y="${(y + h + 16).toFixed(0)}" text-anchor="middle" font-size="15" font-weight="800" fill="${col}" ${PF}>${t}</text>`;
  let s = `<text x="12" y="20" font-size="12.5" font-weight="700" fill="#1b5e20" ${PF}>Çubukları yan yana koy → uzunluk toplamı cevabı verir</text>`;
  s += rod(3, 12, y, U, null).g + lab(12 + 3 * U / 2, '3', '#1b5e20');
  const xp = 12 + 3 * U + 12;
  s += `<text x="${xp}" y="${(y + h / 2 + 7).toFixed(0)}" font-size="22" font-weight="800" fill="#2e7d32" ${PF}>+</text>`;
  const x4 = xp + 26;
  s += rod(4, x4, y, U, null).g + lab(x4 + 4 * U / 2, '4', '#1b5e20');
  const xeq = x4 + 4 * U + 12;
  s += `<text x="${xeq}" y="${(y + h / 2 + 7).toFixed(0)}" font-size="22" font-weight="800" fill="#2e7d32" ${PF}>=</text>`;
  const x7 = xeq + 26;
  s += rod(7, x7, y, U, ['blue', 'blue', 'blue', 'green', 'green', 'green', 'green']).g + lab(x7 + 7 * U / 2, '7', '#0d9488');
  const W = x7 + 7 * U + 10;
  return `<svg viewBox="0 0 ${W.toFixed(0)} ${(y + h + 24).toFixed(0)}" role="img" aria-label="Üç artı dört: çubukları yan yana koyunca yedi uzunluğuna ulaşılır" ${PF} style="width:100%;height:auto;display:block">${DEFS}${s}</svg>`;
}

const STAIR = staircase(), COMP = components(), ADD = addScene();

// ── Ne öğretir: 3 alan kartı
const AREAS = [
  ['🔢', 'Sayma', 'Sözel ve düzenli sayma, birebir eşleme, kardinal değer, sayının korunumu, 20\'ye kadar sayma, geriye sayma, algısal anlık-bilme (sanbil), karşılaştırma ve fark.'],
  ['➕', 'İşlem', 'Toplama–çıkarmaya hazırlık (5\'lik/10\'luk kart ile kavramsal sanbil), sembolik olmayan toplama ve çıkarma — somut çubuklarla.'],
  ['🎯', 'Tahmin', 'Hangisi az/çok, bir çokluğun sayısını kestirme, bir uzunlukta sayının yerini ve çubuk uzunluklarını tahmin etme.'],
];
const areasHtml = AREAS.map((a) => `<div class="area"><div class="a-ico">${a[0]}</div><h3>${a[1]}</h3><p>${a[2]}</p></div>`).join('');

const GAMES = ['Az–Çok–Eşit', "5'ten Az / 5'ten Çok", 'Sıraya Dizelim', 'Büyükten Küçüğe Sırala', 'Sayıyı Çevir, Çoklukla Eşleştir', 'Kayıp Sayılar', 'Pulları Gruplayalım', 'Tahminler Kapışıyor', 'Üzerine Say!', "10'a Tamamla!", 'Geriye Doğru Say!'];
const gamesHtml = GAMES.map((g) => `<span class="game">${g}</span>`).join('');

const WHY = [
  ['👁️ + ✋', 'Hem görsel hem dokunsal', 'Çocuk sayıyı yalnız duymaz; <b>uzunluk</b> olarak görür, <b>nokta</b> olarak sayar, eline alıp <b>dokunur</b>. Üç duyu birlikte, kavram derinleşir.'],
  ['📏', 'Uzunluk + nokta bir arada', 'Her çubuk hem <b>sürekli büyüklüğü</b> (uzunluk) hem <b>sayılabilir çokluğu</b> (nokta) taşır. Bu ikisi, sağlam sayı hissinin temelidir.'],
  ['🧱→🔢', 'Somuttan soyuta', 'Çubukla başlanır, çalışma yapraklarıyla resme, oradan sembole geçilir (somut → yarı-somut → soyut). Kavram, yapı bozulmadan taşınır.'],
  ['🧩', 'Oyun + etkinlik', 'Kaygısız, eğlenceli; 12 oyun ve kademeli etkinliklerle. Çocuk başardıkça ilerler — “Matematiği öğrenmenin eğlenceli ve kolay yolu.”'],
];
const whyHtml = WHY.map((w) => `<div class="why"><div class="w-ico">${w[0]}</div><div><h3>${w[1]}</h3><p>${w[2]}</p></div></div>`).join('');

const html = `<!doctype html>
<html lang="tr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>DokunSay Noktalı Sayı Çubukları — Somut Matematik Seti</title>
<meta name="description" content="DokunSay Noktalı Sayı Çubukları: sayıları hem görerek hem dokunarak öğreten somut matematik seti. Yeşil Düzey etkinlik kitabıyla erken matematik için.">
<link rel="icon" href="/icon.svg">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@600;700;800&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
:root{--deep:#1b5e20;--green:#2e7d32;--lgreen:#43a047;--ink:#16261a;--body:#36443a;--muted:#5f7065;--line:#dde8de;--bg:#f6faf5;--card:#fff;--teal:#0d9488}
*{box-sizing:border-box}
body{margin:0;font-family:Inter,system-ui,sans-serif;color:var(--body);background:var(--bg);line-height:1.6;-webkit-font-smoothing:antialiased}
h1,h2,h3{font-family:Poppins,sans-serif;color:var(--ink);line-height:1.2;letter-spacing:-.01em;margin:0}
a{color:var(--green)}
${SITE_HEADER_CSS}
.wrap{max-width:1120px;margin:0 auto;padding:0 22px}
.hero{padding:44px 22px 8px}
.hero-in{max-width:1120px;margin:0 auto;display:grid;grid-template-columns:1.05fr .95fr;gap:38px;align-items:center}
.eyebrow{font-family:Poppins;font-weight:700;font-size:.74rem;letter-spacing:.14em;text-transform:uppercase;color:var(--green)}
.hero h1{font-size:clamp(2rem,4.6vw,3rem);font-weight:800;margin:10px 0 14px;background:linear-gradient(120deg,#1b5e20,#43a047);-webkit-background-clip:text;background-clip:text;color:transparent}
.hero .lead{font-size:1.14rem;color:#3a4a3e;max-width:560px}
.hero .pills{display:flex;flex-wrap:wrap;gap:8px;margin-top:20px}
.hero .pills span{background:#fff;border:1px solid var(--line);border-radius:999px;padding:7px 15px;font-weight:700;font-size:.84rem;color:var(--deep)}
.hero-art{background:linear-gradient(135deg,#f1f8f2,#e6f1e8);border:1px solid #cfe0d1;border-radius:24px;padding:20px 22px;box-shadow:0 24px 60px -34px rgba(20,57,26,.5)}
.hero-art .cap{text-align:center;font-size:.86rem;color:var(--muted);margin-top:6px}
.cta{display:inline-flex;align-items:center;gap:8px;margin-top:22px;background:linear-gradient(135deg,#43a047,#2e7d32);color:#fff;font-family:Poppins;font-weight:800;font-size:1.02rem;border-radius:999px;padding:14px 28px;text-decoration:none;box-shadow:0 14px 30px -12px rgba(27,94,32,.6)}
section.band{padding:40px 0}
.sec-h{text-align:center;max-width:720px;margin:0 auto 26px}
.sec-h .e{font-family:Poppins;font-weight:700;font-size:.72rem;letter-spacing:.12em;text-transform:uppercase;color:var(--green)}
.sec-h h2{font-size:clamp(1.5rem,3.2vw,2rem);font-weight:800;color:var(--deep);margin:8px 0 8px}
.sec-h p{color:var(--muted);font-size:1.04rem;margin:0}
.card{background:var(--card);border:1px solid var(--line);border-radius:22px;padding:26px 28px;box-shadow:0 20px 50px -38px rgba(20,57,26,.5)}
.two{display:grid;grid-template-columns:1fr 1fr;gap:26px;align-items:center}
.two h3{color:var(--deep);font-size:1.3rem;margin-bottom:10px}
.areas{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}
.area{background:var(--card);border:1px solid var(--line);border-radius:18px;padding:22px 22px;box-shadow:0 16px 40px -34px rgba(20,57,26,.5)}
.area .a-ico{font-size:2rem;line-height:1}
.area h3{color:var(--deep);font-size:1.18rem;margin:10px 0 7px}
.area p{font-size:.95rem;color:var(--body);margin:0}
.whygrid{display:grid;grid-template-columns:1fr 1fr;gap:18px}
.why{display:flex;gap:14px;background:var(--card);border:1px solid var(--line);border-radius:16px;padding:18px 20px}
.why .w-ico{font-size:1.5rem;flex:0 0 auto}
.why h3{color:var(--deep);font-size:1.08rem;margin-bottom:4px}
.why p{font-size:.95rem;margin:0}
.games{display:flex;flex-wrap:wrap;gap:9px;justify-content:center;max-width:840px;margin:0 auto}
.game{background:#fff;border:1px solid var(--line);border-radius:999px;padding:8px 16px;font-weight:600;font-size:.9rem;color:var(--deep)}
.book{display:grid;grid-template-columns:.8fr 1.2fr;gap:26px;align-items:center}
.book .stat{display:flex;gap:14px;flex-wrap:wrap;margin-top:14px}
.book .stat b{display:block;font-family:Poppins;font-size:1.5rem;color:var(--deep);line-height:1}
.book .stat span{font-size:.82rem;color:var(--muted)}
.book .si{background:#f1f8f2;border:1px solid #cfe0d1;border-radius:14px;padding:12px 16px;text-align:center;min-width:96px}
.authors{text-align:center;color:var(--muted);font-size:.95rem}
.authors b{color:var(--deep)}
.foot{text-align:center;color:var(--muted);font-size:.84rem;padding:30px 22px 46px}
@media (max-width:860px){.hero-in,.two,.whygrid,.book{grid-template-columns:1fr}.areas{grid-template-columns:1fr}.hero-art{order:-1}}
</style>
<script>window.NUMAP_GATE_MODE="chip"</script><script>window.NUMAP_GATE_BRAND="DokunSay";window.NUMAP_GATE_SUB="Matematik Öğretim Araçları";window.NUMAP_GATE_ACCENT="#2E7D32"</script><script src="/numap-gate.js?v=1"></script>
</head>
<body>
${renderSiteHeader('araclar')}

<section class="hero"><div class="hero-in">
  <div>
    <div class="eyebrow">🟢 Somut Matematik Materyali · Yeşil Düzey</div>
    <h1>DokunSay Noktalı Sayı Çubukları</h1>
    <p class="lead">Sayıları <b>hem görerek hem dokunarak</b> öğreten somut matematik seti. Her çubuk bir <b>uzunluk</b> ve üzerindeki <b>noktalar</b> kadar çokluktur — sayı hissi, sayma ve işlem için sağlam bir temel.</p>
    <div class="pills"><span>1–10 noktalı çubuklar</span><span>Pullar + 5'lik / 10'luk çerçeve</span><span>Erken matematik · 12 oyun</span></div>
    <a class="cta" href="#kit">Seti keşfet ↓</a>
  </div>
  <div class="hero-art">${STAIR}<div class="cap">Her çubuk = uzunluğu kadar nokta. 1'den 10'a büyüyen merdiven.</div></div>
</div></section>

<section class="band"><div class="wrap">
  <div class="sec-h"><div class="e">Nedir?</div><h2>Tek bir materyalde uzunluk ve çokluk</h2><p>Noktalı sayı çubukları, sayının iki yüzünü birden gösterir: çubuğun <b>uzunluğu</b> büyüklüğü, üzerindeki <b>noktalar</b> ise sayılabilir çokluğu. Çocuk böylece "5" sözcüğünü gerçek bir nesneyle — görüp dokunabileceği bir çubukla — eşler.</p></div>
  <div class="card two">
    <div>${ADD}</div>
    <div><h3>Soyut sembolden önce, somut deneyim</h3><p>Çocuk önce çubuğu eline alır, sayar, karşılaştırır, yan yana koyar. "3 ve 4 yan yana, 7 uzunluğunda" gibi ilişkileri <b>kendi gözüyle</b> kurar. Sembolik işlem (3+4=7) bu somut temelin üstüne oturur — kalıcı ve anlamlı olur.</p></div>
  </div>
</div></section>

<section class="band" id="kit" style="background:linear-gradient(180deg,#eef6ef,#f6faf5)"><div class="wrap">
  <div class="sec-h"><div class="e">Set içeriği</div><h2>Kutuda neler var?</h2><p>Birbirini tamamlayan üç somut araç — sayma, işlem ve tahmin etkinlikleri için.</p></div>
  <div class="card two">
    <div>${COMP}</div>
    <div>
      <h3>Noktalı çubuklar · Pullar · Çerçeveler</h3>
      <p style="margin-bottom:10px"><b>Noktalı çubuklar (1–10):</b> kehribar renginde, üzerindeki delik-noktalarıyla; <b>uzunluk</b> büyüklüğü, <b>noktalar</b> çokluğu gösterir.</p>
      <p style="margin-bottom:10px"><b>Pullar:</b> tek tek sayma, gruplama ve eşleme için renkli sayma nesneleri.</p>
      <p><b>5'lik ve 10'luk çerçeve kartları:</b> referans-noktalı düşünme (5 ve 10'a göre) — anlık-bilme ve işleme hazırlığın anahtarı.</p>
    </div>
  </div>
</div></section>

<section class="band"><div class="wrap">
  <div class="sec-h"><div class="e">Ne öğretir? · Yeşil Düzey</div><h2>Erken matematiğin üç temel alanı</h2><p>Yeşil Düzey etkinlik kitabı, her kazanım için "neyi, niçin ve nasıl öğretmeli" rehberiyle ilerler.</p></div>
  <div class="areas">${areasHtml}</div>
</div></section>

<section class="band" style="background:linear-gradient(180deg,#f6faf5,#eef6ef)"><div class="wrap">
  <div class="sec-h"><div class="e">Neden işe yarar?</div><h2>Kanıta dayalı, çok duyulu öğrenme</h2><p>Somut materyaller, sayı hissi ve işlem akıcılığının gelişiminde alanyazının desteklediği bir yoldur.</p></div>
  <div class="whygrid">${whyHtml}</div>
  <p style="text-align:center;margin-top:18px;font-size:.95rem;color:var(--muted)">Yöntemin arkasındaki kanıt için → <a href="/rehber/">Matematik Müdahale Kiti</a> · gelişim basamakları için → <a href="/yorunge/">Öğrenme Yörüngeleri</a></p>
</div></section>

<section class="band"><div class="wrap">
  <div class="sec-h"><div class="e">Etkinlik kitabı</div><h2>Yeşil Düzey: kademeli etkinlikler + oyunlar</h2></div>
  <div class="card book">
    <div>
      <h3 style="color:var(--deep);font-size:1.3rem">Somut materyal + çalışma yaprakları</h3>
      <p>Her etkinlik önce somut çubuklarla yapılır, sonra çalışma yapraklarıyla pekiştirilir. Sayma, işlem ve tahmin kazanımları adım adım; aralarında oyunlarla.</p>
      <div class="stat">
        <div class="si"><b>3</b><span>kazanım alanı</span></div>
        <div class="si"><b>30+</b><span>kazanım</span></div>
        <div class="si"><b>12</b><span>oyun</span></div>
      </div>
    </div>
    <div><div class="sec-h" style="margin-bottom:14px"><h2 style="font-size:1.1rem">Kitaptaki oyunlardan</h2></div><div class="games">${gamesHtml}</div></div>
  </div>
</div></section>

<section class="band" style="background:linear-gradient(180deg,#eef6ef,#f6faf5)"><div class="wrap">
  <div class="card" style="text-align:center">
    <div class="sec-h" style="margin-bottom:10px"><div class="e">Kimler için?</div><h2>Öğretmenler, veliler ve özel eğitim için</h2></div>
    <p style="max-width:680px;margin:0 auto 18px;color:var(--body)">Okul öncesi ve ilkokul; matematikte desteğe ihtiyaç duyan ya da sağlam bir temel kurmak isteyen her çocuk için. Sınıfta, bireysel müdahalede ve evde kullanılabilir.</p>
    <p class="authors">Hazırlayanlar: <b>Yılmaz Mutlu</b>, <b>Çiğdem Demirtaş</b>, <b>Edanur Güven</b> · Yayıncı: <b>Vizetek</b> (2024) · ISBN 978-625-98565-3-7</p>
    <a class="cta" href="https://www.vizetek.com.tr" target="_blank" rel="noopener">Vizetek'te incele →</a>
  </div>
</div></section>

<div class="foot">Her Çocuk Matematik Öğrenebilir · DokunSay · Noktalı Sayı Çubukları (Yeşil Düzey)</div>
</body>
</html>`;

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, html, 'utf8');
console.log('Yazıldı: ' + OUT + ' (' + html.length + ' bayt)');
