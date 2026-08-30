// DokunSay — "Etkili Matematik Müdahale Yöntemleri" rehber sayfası üreteci.
// Girdi: bop-rehber-author workflow'unun yapısal çıktısı (JSON dizi: 10 yöntem bölümü).
// Çıktı: dist-site/rehber/index.html (DokunSay yeşil tasarımı, statik, baskı-dostu).
// Kullanım:  node _platform/scripts/build-rehber.mjs <sections.json>
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SITE_HEADER_CSS, renderSiteHeader } from './site-header.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..', '..');
const OUT = resolve(ROOT, 'dist-site', 'rehber', 'index.html');

const sectionsPath = process.argv[2];
if (!sectionsPath) { console.error('Kullanım: node build-rehber.mjs <sections.json>'); process.exit(1); }
const sections = JSON.parse(readFileSync(sectionsPath, 'utf8'));

const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
// Basit paragraf bölme: çift-newline → <p>, tek-newline → <br>.
const bold = (s) => s.replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>');
const para = (s) => esc(s).split(/\n{2,}/).map((p) => '<p>' + bold(p.replace(/\n/g, '<br>')) + '</p>').join('');
const slug = (k) => 'y-' + k;

const BADGE = { 'güçlü': ['Güçlü kanıt', '#1b5e20', '#e3f1e5', '#bcdcbf'], 'orta': ['Orta kanıt', '#9a5b00', '#fff3e0', '#f3d9ad'], 'gelişmekte': ['Gelişmekte', '#0d5a8a', '#e6f1fb', '#bcd9f5'] };

function badge(k) {
  const b = BADGE[k] || BADGE['güçlü'];
  return '<span class="badge" style="color:' + b[1] + ';background:' + b[2] + ';border-color:' + b[3] + '">' + esc(b[0]) + '</span>';
}

// ── Görsel destekler: SVG diyagramlar + karşılaştırma tablosu ──
const PYRAMID = `<svg viewBox="0 0 620 200" class="dgm pyr" role="img" aria-label="Katmanlı destek (RTI/MTSS) piramidi">
<polygon points="200,16 236,68 164,68" fill="#1b5e20"/>
<polygon points="158,74 242,74 266,128 134,128" fill="#2e7d32"/>
<polygon points="128,134 272,134 296,188 104,188" fill="#43a047"/>
<text x="200" y="60" text-anchor="middle" fill="#fff" font-size="11" font-weight="700" font-family="Poppins,sans-serif">3. katman</text>
<text x="200" y="108" text-anchor="middle" fill="#fff" font-size="14" font-weight="700" font-family="Poppins,sans-serif">2. katman</text>
<text x="200" y="168" text-anchor="middle" fill="#fff" font-size="14" font-weight="700" font-family="Poppins,sans-serif">1. katman</text>
<line x1="240" y1="46" x2="318" y2="46" stroke="#cfe0d1"/><text x="324" y="50" fill="#1b5e20" font-size="13" font-weight="600" font-family="Poppins,sans-serif">Yoğun bireysel müdahale</text>
<line x1="262" y1="102" x2="318" y2="102" stroke="#cfe0d1"/><text x="324" y="106" fill="#2e7d32" font-size="13" font-weight="600" font-family="Poppins,sans-serif">Küçük grup, hedefli müdahale</text>
<line x1="288" y1="162" x2="318" y2="162" stroke="#cfe0d1"/><text x="324" y="166" fill="#43a047" font-size="13" font-weight="600" font-family="Poppins,sans-serif">Nitelikli sınıf öğretimi (tüm sınıf)</text>
</svg>`;

const NL_TICKS = Array.from({ length: 11 }, (_, i) => { const x = 44 + i * 57; return '<line x1="' + x + '" y1="42" x2="' + x + '" y2="56" stroke="#1b5e20" stroke-width="2"/><text x="' + x + '" y="76" text-anchor="middle" font-size="12" fill="#45584a" font-family="Poppins,sans-serif">' + i + '</text>'; }).join('');

const DIAGRAMS = {
  acik_ogretim: `<svg viewBox="0 0 660 138" class="dgm" role="img" aria-label="Kademeli sorumluluk devri: Ben yaparım, Birlikte yaparız, Sen yaparsın">
<defs><linearGradient id="grA" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#1b5e20"/><stop offset="1" stop-color="#aedab0"/></linearGradient></defs>
<g font-family="Poppins,sans-serif">
<rect x="6" y="12" width="206" height="60" rx="12" fill="#e8f3e9" stroke="#bcdcbf"/><text x="109" y="37" text-anchor="middle" font-size="15" font-weight="700" fill="#1b5e20">1 · Ben yaparım</text><text x="109" y="57" text-anchor="middle" font-size="11" fill="#45584a">Öğretmen modeller, sesli düşünür</text>
<rect x="227" y="12" width="206" height="60" rx="12" fill="#e8f3e9" stroke="#bcdcbf"/><text x="330" y="37" text-anchor="middle" font-size="15" font-weight="700" fill="#1b5e20">2 · Birlikte yaparız</text><text x="330" y="57" text-anchor="middle" font-size="11" fill="#45584a">Rehberli alıştırma + geri bildirim</text>
<rect x="448" y="12" width="206" height="60" rx="12" fill="#e8f3e9" stroke="#bcdcbf"/><text x="551" y="37" text-anchor="middle" font-size="15" font-weight="700" fill="#1b5e20">3 · Sen yaparsın</text><text x="551" y="57" text-anchor="middle" font-size="11" fill="#45584a">Bağımsız uygulama (%90+ doğru)</text>
<rect x="6" y="90" width="648" height="12" rx="6" fill="url(#grA)"/>
<text x="6" y="124" font-size="12" fill="#45584a">◀ Öğretmen desteği azalır</text><text x="654" y="124" text-anchor="end" font-size="12" fill="#45584a">Öğrenci bağımsızlığı artar ▶</text>
</g></svg>`,
  cra: `<svg viewBox="0 0 660 118" class="dgm" role="img" aria-label="CRA: somut, yarı-somut, soyut">
<g font-family="Poppins,sans-serif">
<rect x="6" y="12" width="190" height="62" rx="12" fill="#e8f3e9" stroke="#bcdcbf"/><text x="101" y="44" text-anchor="middle" font-size="24">🧱</text><text x="101" y="65" text-anchor="middle" font-size="13" font-weight="700" fill="#1b5e20">Somut · nesne</text>
<text x="214" y="50" text-anchor="middle" font-size="26" fill="#2e7d32">→</text>
<rect x="235" y="12" width="190" height="62" rx="12" fill="#e8f3e9" stroke="#bcdcbf"/><text x="330" y="44" text-anchor="middle" font-size="24">✏️</text><text x="330" y="65" text-anchor="middle" font-size="13" font-weight="700" fill="#1b5e20">Yarı-somut · çizim</text>
<text x="443" y="50" text-anchor="middle" font-size="26" fill="#2e7d32">→</text>
<rect x="464" y="12" width="190" height="62" rx="12" fill="#e8f3e9" stroke="#bcdcbf"/><text x="559" y="44" text-anchor="middle" font-size="24">🔢</text><text x="559" y="65" text-anchor="middle" font-size="13" font-weight="700" fill="#1b5e20">Soyut · sembol</text>
<text x="330" y="102" text-anchor="middle" font-size="12.5" font-weight="600" fill="#0d9488">Her düzeye ~%80 ustalıkla geç; takılınca bir alt düzeye dön</text>
</g></svg>`,
  sema: `<svg viewBox="0 0 660 150" class="dgm" role="img" aria-label="Parça-parça-bütün şema (bar model)">
<g font-family="Poppins,sans-serif">
<text x="8" y="20" font-size="12" fill="#45584a">"12 kalemin 7'si mavi, kaçı kırmızı?"  →  Bütün = Parça + Parça</text>
<rect x="60" y="32" width="540" height="38" rx="8" fill="#e3f1e5" stroke="#bcdcbf"/><text x="330" y="56" text-anchor="middle" font-size="14" font-weight="700" fill="#1b5e20">Bütün = 12</text>
<rect x="60" y="80" width="312" height="38" rx="8" fill="#d6ebd8" stroke="#bcdcbf"/><text x="216" y="104" text-anchor="middle" font-size="14" font-weight="700" fill="#1b5e20">Parça = 7</text>
<rect x="376" y="80" width="224" height="38" rx="8" fill="#fff3e0" stroke="#f3d9ad"/><text x="488" y="104" text-anchor="middle" font-size="14" font-weight="700" fill="#9a5b00">Parça = ?</text>
<text x="330" y="142" text-anchor="middle" font-size="13" font-weight="600" fill="#0d9488">Diyagramdan denklem: 7 + ? = 12</text>
</g></svg>`,
  sayi_hissi: `<svg viewBox="0 0 660 100" class="dgm" role="img" aria-label="Sayı doğrusu 0-10, 7 işaretli">
<g font-family="Poppins,sans-serif">
<line x1="44" y1="49" x2="614" y2="49" stroke="#1b5e20" stroke-width="2.5"/>
${NL_TICKS}
<circle cx="443" cy="49" r="9" fill="#0d9488"/><text x="443" y="30" text-anchor="middle" font-size="13" font-weight="700" fill="#0d9488">7</text>
<text x="330" y="96" text-anchor="middle" font-size="12.5" font-weight="600" fill="#0d9488">"7'yi göster" — sayının büyüklüğünü uzamsal konuma bağla</text>
</g></svg>`,
};

function comparisonTable(secs) {
  const rows = secs.map((s, i) =>
    '<tr><td class="ct-n">' + (i + 1) + '</td>' +
    '<td><a class="ct-name" href="#' + slug(s.key) + '">' + esc(s.title) + '</a></td>' +
    '<td>' + badge(s.kanit_gucu) + '</td>' +
    '<td class="ct-etki">' + esc(s.etki || '—') + '</td>' +
    '<td class="ct-when">' + esc(s.neZaman || '') + '</td></tr>'
  ).join('');
  return '<div class="ct-wrap"><table class="cmp"><thead><tr><th>#</th><th>Yöntem</th><th>Kanıt</th><th>Etki</th><th>Ne için / ne zaman</th></tr></thead><tbody>' + rows + '</tbody></table></div>';
}

function renderSection(s, i) {
  const list = (arr, cls) => '<ol class="' + cls + '">' + (arr || []).map((x) => '<li>' + bold(esc(x)) + '</li>').join('') + '</ol>';
  const ul = (arr) => '<ul class="hatalar">' + (arr || []).map((x) => '<li>' + bold(esc(x)) + '</li>').join('') + '</ul>';
  return '<section class="method" id="' + slug(s.key) + '">' +
    '<div class="m-head"><span class="m-num">' + (i + 1) + '</span><div><h2>' + esc(s.title) + '</h2>' +
      '<div class="m-meta">' + badge(s.kanit_gucu) + '<span class="m-ozet">' + bold(esc(s.ozet || '')) + '</span></div></div></div>' +
    ((s.heroSvg || DIAGRAMS[s.key]) ? '<div class="m-visual">' + (s.heroSvg || DIAGRAMS[s.key]) + (s.heroCaption ? '<p class="cap">' + esc(s.heroCaption) + '</p>' : '') + '</div>' : '') +
    '<div class="m-body">' +
      '<div class="block"><h3>Nedir?</h3>' + para(s.nedir) + '</div>' +
      '<div class="block"><h3>Neden işe yarar? <span class="ev">(kanıt)</span></h3>' + para(s.neden) + '</div>' +
      '<div class="block"><h3>Sınıfta nasıl uygulanır?</h3>' + list(s.nasil, 'nasil') + '</div>' +
      '<div class="block ornek"><h3>🧩 Sınıf örneği</h3>' + (s.exampleSvg ? '<div class="ex-visual">' + s.exampleSvg + (s.exampleCaption ? '<p class="cap">' + esc(s.exampleCaption) + '</p>' : '') + '</div>' : '') + para(s.ornek) + '</div>' +
      '<div class="block"><h3>⚠️ Sık yapılan hatalar</h3>' + ul(s.hatalar) + '</div>' +
      (s.dokunsay_bagi && s.dokunsay_bagi.trim() ? '<div class="block dbag"><h3>🛠️ DokunSay / Numap bağı</h3>' + para(s.dokunsay_bagi) + '</div>' : '') +
    '</div></section>';
}

const toc = sections.map((s, i) => '<a href="#' + slug(s.key) + '"><span>' + (i + 1) + '</span>' + esc(s.title) + '</a>').join('');
const methodsHtml = sections.map(renderSection).join('');
const sidebarMethods = sections.map((s, i) => '<li><a href="#' + slug(s.key) + '"><span class="s-num">' + (i + 1) + '</span>' + esc(s.title) + '</a></li>').join('');

const INTRO = `
<p>Diskalkuli (gelişimsel diskalkuli) ve matematik öğrenme güçlüğü (MÖG), zekâ normal olmasına rağmen sayı ve matematik becerilerinde belirgin, kalıcı güçlük yaşanmasıdır; okul çağı çocuklarının yaklaşık <b>%3–7</b>'sini etkiler. Çok daha geniş bir grup ise tanı almamış olsa da matematikte <b>düşük başarı</b> gösterir. Ortak nokta şudur: <b>bu güçlük bir yetenek yokluğu değildir.</b> Doğru, kanıta-dayalı yöntemlerle bu çocukların büyük çoğunluğu matematik öğrenebilir — <i>Her Çocuk Matematik Öğrenebilir.</i></p>
<p>Bu rehber, alandaki en yetkili iki kaynağa — ABD Eğitim Bakanlığı IES/What Works Clearinghouse uygulama kılavuzlarına (2009 RTI ve 2021 Fuchs ve ark. kılavuzu, WWC2021006) — ve yüksek kaliteli meta-analizlere dayanarak, <b>en güçlü kanıtlı 10 öğretim yöntemini</b> derler ve her birinin <b>sınıfta adım adım nasıl uygulandığını</b> somut örneklerle anlatır.</p>
<p><b>Katmanlı destek (RTI/MTSS) içinde okuyun:</b> 1. katman nitelikli sınıf öğretimi, 2. katman küçük-grup hedefli müdahale, 3. katman yoğun bireysel müdahaledir. Aşağıdaki yöntemler özellikle 2. ve 3. katmanda güçlüdür; <b>tek bir sihirli yöntem yoktur</b> — en iyi sonuç bunları birbirini tamamlayacak şekilde birleştirmekten gelir (bkz. <a href="#karar">Karar Rehberi</a>).</p>`;

const CROSS = `
<div class="cc-grid">
  <div class="cc"><h3>🧠 Çalışma belleği &amp; bilişsel yük</h3><p>MÖG'lü çocuklarda çalışma belleği sınırlıdır. Aynı anda çok şey istemeyin: adımları azaltın, dışsal bellek araçları (sayı doğrusu, çizelge, manipülatif) verin, yeni kavramı kolay sayılarla tanıtın. Otomatikleşen olgular (akıcılık) belleği boşaltıp düşünmeye yer açar.</p></div>
  <div class="cc"><h3>🔎 Hata-türü &amp; kavram yanılgısı analizi</h3><p>Yanlışı "yanlış" diye geçmeyin: kavram mı (ne yapacağını bilmiyor), işlemsel mi (adımı karıştırıyor), olgu/akıcılık mı (yavaş/hatalı erişim), yoksa dikkat mi? Hatanın türü, hangi yöntemi uygulayacağınızı söyler.</p></div>
  <div class="cc"><h3>📈 Yoğunluk &amp; doz (MTSS)</h3><p>İşe yaramıyorsa "daha fazlasını" yapın: grubu küçültün (1:3 → 1:1), süreyi/sıklığı artırın (haftada 3 → 5), açıklığı artırın, daha çok modelleme ve geri bildirim ekleyin. Yoğunlaştırma kararı <b>veriyle</b> verilir (İlerleme İzleme + DBI).</p></div>
  <div class="cc"><h3>💬 Etkili geri bildirim</h3><p>Anında, somut ve düzeltici olun; yalnız "yanlış" demeyin, kavram yanılgısını yoklayan sorular sorun ("burada ne yaptın? neden?"). Çabayı ve stratejiyi övün (sonucu değil) — kaygıyı düşürür, denemeyi artırır.</p></div>
</div>`;

const KARAR = `
<p>Yöntemleri tek tek değil, birlikte kullanın. Pratik bir karar çerçevesi:</p>
<ul class="karar">
  <li><b>Omurga — her zaman:</b> Açık/sistematik öğretim. Diğer her yöntem bu çatı içinde uygulanır.</li>
  <li><b>Yeni bir kavram/işlem öğretirken:</b> CRA (somut → yarı-somut → soyut), ustalıkla ilerleyerek.</li>
  <li><b>Sözel problemde:</b> Şema-temelli öğretim + üstbilişsel strateji (oku-söyle-görselleştir-çöz-kontrol et).</li>
  <li><b>Sayı temeli zayıfsa:</b> Sayı hissi / büyüklük (sayı doğrusu, karşılaştırma, ani-algılama).</li>
  <li><b>Akıcılık için:</b> Her gün ~10 dk, düşük-stakes, strateji-temelli pratik.</li>
  <li><b>Dil engeli varsa:</b> Matematik sözcüklerini ve kesin konuşmayı açıkça öğretin.</li>
  <li><b>Hangi basamaktan başlayacağını bilmek için:</b> Öğrenme yörüngeleri (DokunSay) + Numap değerlendirmesi.</li>
  <li><b>"Devam mı, değiştir mi?" kararı için:</b> İlerleme İzleme + DBI (4-nokta / eğilim kuralı).</li>
  <li><b>Kaygı/motivasyon için:</b> Düşük-stakes ortam, süreç-övgüsü, çalışma belleği yükünü azaltma.</li>
</ul>
<p class="kapanis">Unutmayın: en güçlü etki, <b>doğru çocuğa, doğru basamakta, doğru yoğunlukta</b>, bu yöntemleri birleştirip <b>ilerlemeyi izleyerek</b> uygulamaktan gelir. Bu rehber, sahadaki kararlarınız için kanıta-dayalı bir pusuladır.</p>`;

const SOURCES = [
  ['IES WWC 2021 — Assisting Students Struggling with Mathematics: Intervention in the Elementary Grades (Fuchs ve ark., WWC2021006)', 'https://ies.ed.gov/ncee/wwc/PracticeGuide/26'],
  ['IES WWC 2009 — Assisting Students Struggling with Mathematics: RtI for Elementary and Middle Schools (Gersten ve ark.)', 'https://ies.ed.gov/ncee/wwc/practiceguide/2'],
  ['Gersten ve ark. (2009) — Mathematics Instruction for Students with Learning Disabilities: A Meta-Analysis', 'https://journals.sagepub.com/doi/10.3102/0034654309334431'],
  ['Myers, Witzel, Powell ve ark. (2022) — Word-Problem Intervention Meta-Analysis (52 çalışma)', 'https://journals.sagepub.com/doi/abs/10.3102/00346543211070049'],
  ['Bouck, Satsangi & Park (2018) — CRA as an Evidence-Based Practice', 'https://journals.sagepub.com/doi/abs/10.1177/0741932517721712'],
  ['Siegler (2014) — Integrative Theory of Numerical Development', 'https://srcd.onlinelibrary.wiley.com/doi/10.1111/cdep.12077'],
  ['Ünal, Terzi, Yalvaç & Geary (2024) — Number Line Meta-Analysis (162 çalışma)', 'https://pmc.ncbi.nlm.nih.gov/articles/PMC11753455/'],
  ['NCII — Data-Based Individualization (DBI)', 'https://intensiveintervention.org/data-based-individualization'],
];
const sourcesHtml = SOURCES.map((s) => '<li><a href="' + s[1] + '" target="_blank" rel="noopener">' + esc(s[0]) + '</a></li>').join('');

const html = `<!doctype html>
<html lang="tr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Etkili Matematik Müdahale Yöntemleri — DokunSay Rehberi</title>
<meta name="description" content="Diskalkuli ve matematik öğrenme güçlüğü için kanıt-temelli (IES/WWC) en etkili 10 öğretim yöntemi — sınıfta nasıl uygulanır, örneklerle.">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@600;700;800&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
:root{--deep:#1b5e20;--green:#2e7d32;--lgreen:#43a047;--ink:#16261a;--body:#36443a;--muted:#5f7065;--line:#dde8de;--bg:#f6faf5;--card:#fff;--amber:#f59e0b}
*{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{font-family:Inter,system-ui,sans-serif;color:var(--body);background:linear-gradient(180deg,#e8f5e9,#f6faf5 30%);line-height:1.65;-webkit-font-smoothing:antialiased}
h1,h2,h3{font-family:Poppins,sans-serif;color:var(--ink);letter-spacing:-.01em;line-height:1.25}
a{color:var(--green)}
${SITE_HEADER_CSS}
.wrap{max-width:1180px;margin:0 auto;padding:0 22px}
.layout{display:grid;grid-template-columns:262px 1fr;gap:30px;align-items:start;margin:20px 0}
.side{position:sticky;top:80px}
.side-in{background:var(--card);border:1px solid var(--line);border-radius:16px;overflow:hidden;max-height:calc(100vh - 102px);display:flex;flex-direction:column;box-shadow:0 14px 36px -28px rgba(20,57,26,.55)}
.side-head{font-family:Poppins;font-weight:800;color:var(--deep);font-size:.76rem;letter-spacing:.05em;text-transform:uppercase;padding:14px 15px;border-bottom:1px solid var(--line);display:flex;justify-content:space-between;align-items:center;gap:8px}
.side-head span{color:var(--green);font-size:.7rem;text-transform:none;letter-spacing:0;white-space:nowrap}
.side-list{list-style:none;overflow-y:auto;padding:7px;margin:0}
.s-group{font-family:Poppins;font-weight:700;font-size:.66rem;letter-spacing:.06em;text-transform:uppercase;color:var(--muted);padding:12px 9px 3px}
.side-list a{display:flex;gap:9px;align-items:center;padding:8px 9px;border-radius:10px;text-decoration:none;color:var(--body);font-size:.9rem;font-weight:600;transition:background .15s,color .15s}
.side-list a:hover{background:#f1f8f2;color:var(--deep)}
.side-list a.act{background:#e3f1e5;color:var(--deep)}
.s-num{flex:0 0 auto;width:22px;height:22px;border-radius:7px;background:#eef3ef;color:var(--deep);font-family:Poppins;font-weight:800;font-size:.74rem;display:grid;place-items:center}
.side-list a.act .s-num{background:var(--green);color:#fff}
.s-ico{flex:0 0 auto;width:22px;text-align:center;font-size:1rem}
.content{min-width:0}
.content>section{scroll-margin-top:82px}
.content>:first-child{margin-top:0}
@media (max-width:900px){.layout{grid-template-columns:1fr;gap:0;margin:12px 0}.side{position:static;margin-bottom:16px}.side-in{max-height:none}.side-list{max-height:300px}}
.hero{padding:46px 22px 14px;text-align:center;max-width:880px;margin:0 auto}
.hero .eyebrow{font-family:Poppins;font-weight:700;font-size:.74rem;letter-spacing:.16em;text-transform:uppercase;color:var(--green)}
.hero h1{font-size:clamp(1.8rem,4.5vw,2.7rem);font-weight:800;margin:10px 0 12px;background:linear-gradient(120deg,#1b5e20,#43a047);-webkit-background-clip:text;background-clip:text;color:transparent}
.hero .lead{font-size:1.08rem;color:var(--muted);max-width:680px;margin:0 auto}
.hero .pills{display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin-top:18px}
.hero .pills span{background:#fff;border:1px solid var(--line);border-radius:999px;padding:7px 15px;font-weight:700;font-size:.84rem;color:var(--deep)}
.card{background:var(--card);border:1px solid var(--line);border-radius:20px;padding:26px 28px;margin:18px 0;box-shadow:0 18px 44px -34px rgba(20,57,26,.5)}
.card h2.sec{font-size:1.5rem;font-weight:800;color:var(--deep);margin-bottom:10px}
.card p{margin:0 0 11px}
.card p:last-child{margin-bottom:0}
.toc-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(225px,1fr));gap:9px;margin-top:6px}
.toc-grid a{display:flex;align-items:center;gap:10px;background:#fff;border:1px solid var(--line);border-radius:12px;padding:11px 13px;text-decoration:none;color:var(--ink);font-weight:600;font-size:.92rem;transition:border-color .15s,transform .12s}
.toc-grid a:hover{border-color:var(--green);transform:translateY(-1px)}
.toc-grid a span{flex:0 0 auto;width:26px;height:26px;border-radius:8px;background:#e3f1e5;color:var(--deep);font-family:Poppins;font-weight:800;font-size:.85rem;display:grid;place-items:center}
.method{background:var(--card);border:1px solid var(--line);border-radius:20px;padding:0;margin:20px 0;overflow:hidden;box-shadow:0 18px 44px -34px rgba(20,57,26,.5);scroll-margin-top:74px}
.m-head{display:flex;gap:15px;align-items:flex-start;padding:22px 26px 16px;background:linear-gradient(135deg,#f1f8f2,#e7f3e9);border-bottom:1px solid var(--line)}
.m-num{flex:0 0 auto;width:42px;height:42px;border-radius:12px;background:linear-gradient(135deg,#43a047,#2e7d32);color:#fff;font-family:Poppins;font-weight:800;font-size:1.25rem;display:grid;place-items:center;box-shadow:0 8px 18px -8px rgba(27,94,32,.6)}
.m-head h2{font-size:1.4rem;font-weight:800;color:var(--deep)}
.m-meta{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-top:6px}
.m-ozet{color:var(--muted);font-size:.92rem}
.badge{font-family:Poppins;font-weight:700;font-size:.68rem;letter-spacing:.04em;text-transform:uppercase;border:1px solid;border-radius:999px;padding:.25em .7em;white-space:nowrap}
.m-body{padding:18px 26px 24px}
.block{margin:16px 0}
.block:first-child{margin-top:4px}
.block h3{font-size:1.04rem;font-weight:700;color:var(--green);margin-bottom:6px;display:flex;align-items:baseline;gap:7px}
.block h3 .ev{font-weight:500;font-size:.8rem;color:var(--muted)}
.block p{margin:0 0 9px}
ol.nasil{margin:4px 0 0 2px;padding:0;list-style:none;counter-reset:n}
ol.nasil li{counter-increment:n;position:relative;padding:7px 0 7px 36px;border-top:1px dashed #e2ece3;font-size:.97rem}
ol.nasil li:first-child{border-top:0}
ol.nasil li::before{content:counter(n);position:absolute;left:0;top:6px;width:24px;height:24px;border-radius:7px;background:#e3f1e5;color:var(--deep);font-family:Poppins;font-weight:800;font-size:.78rem;display:grid;place-items:center}
.block.ornek{background:#f1f8f2;border:1px solid #cfe8d1;border-left:4px solid var(--lgreen);border-radius:12px;padding:14px 17px}
.block.ornek h3{color:var(--deep)}
ul.hatalar{margin:4px 0 0;padding-left:0;list-style:none}
ul.hatalar li{position:relative;padding:5px 0 5px 26px;font-size:.96rem}
ul.hatalar li::before{content:"⚠";position:absolute;left:0;top:5px;color:#c2410c;font-size:.9rem}
.block.dbag{background:#eef6ff;border:1px solid #bcd9f5;border-radius:12px;padding:13px 16px}
.block.dbag h3{color:#0d5a8a}
.cc-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(255px,1fr));gap:14px}
.cc{background:#f6faf5;border:1px solid var(--line);border-radius:14px;padding:15px 17px}
.cc h3{font-size:1rem;color:var(--deep);margin-bottom:5px}
.cc p{font-size:.93rem;margin:0}
ul.karar{margin:6px 0 0 2px;padding:0;list-style:none}
ul.karar li{padding:8px 0 8px 26px;position:relative;border-top:1px solid #eef3ef;font-size:.98rem}
ul.karar li:first-child{border-top:0}
ul.karar li::before{content:"▸";position:absolute;left:4px;top:8px;color:var(--lgreen);font-weight:800}
.kapanis{margin-top:14px;background:#f1f8f2;border:1px solid #cfe8d1;border-radius:12px;padding:13px 16px;font-size:.98rem}
.refs{font-size:.9rem}
.refs li{margin:7px 0;list-style:none;padding-left:18px;position:relative}
.refs li::before{content:"📄";position:absolute;left:0;top:1px}
.foot{text-align:center;color:var(--muted);font-size:.84rem;padding:26px 22px 40px}
.dgm{width:100%;height:auto;display:block}
.m-visual{background:#f7fbf7;border:1px solid #e2ece3;border-radius:14px;padding:14px 16px;margin:0 0 18px}
.ex-visual{background:#fff;border:1px solid #cfe8d1;border-radius:10px;padding:12px 13px;margin:2px 0 13px}
.ex-visual .cap{font-size:.82rem;color:var(--muted);text-align:center;margin:8px 0 0}
.intro-pyr{background:#f7fbf7;border:1px solid #e2ece3;border-radius:14px;padding:16px;margin-top:16px}
.intro-pyr .cap,.m-visual .cap{font-size:.82rem;color:var(--muted);text-align:center;margin:8px 0 0}
.pyr{max-width:540px;margin:0 auto}
.ct-wrap{overflow-x:auto;margin-top:4px}
table.cmp{width:100%;border-collapse:collapse;font-size:.93rem;min-width:580px}
table.cmp th{text-align:left;font-family:Poppins;font-size:.74rem;text-transform:uppercase;letter-spacing:.04em;color:var(--muted);padding:9px 11px;border-bottom:2px solid #e2ece3;white-space:nowrap}
table.cmp td{padding:10px 11px;border-bottom:1px solid #eef3ef;vertical-align:middle}
table.cmp tbody tr:hover td{background:#f7fbf7}
.ct-n{font-family:Poppins;font-weight:800;color:var(--deep)}
a.ct-name{font-weight:700;color:var(--ink);text-decoration:none}
a.ct-name:hover{color:var(--green);text-decoration:underline}
.ct-etki{font-weight:600;color:var(--deep);white-space:nowrap}
.ct-when{color:var(--body)}
@media (max-width:640px){.m-head,.m-body{padding-left:18px;padding-right:18px}.card{padding:20px}}
@media print{body{background:#fff}.top,.toc{display:none}.method,.card{box-shadow:none;break-inside:avoid}}
</style>
<script>window.NUMAP_GATE_BRAND="DokunSay";window.NUMAP_GATE_SUB="Matematik Öğretim Araçları";window.NUMAP_GATE_ACCENT="#2E7D32"</script><script src="/numap-gate.js?v=1"></script>
</head>
<body>
${renderSiteHeader('rehber')}

<section class="hero">
  <div class="eyebrow">📘 Kanıt-Temelli Müdahale Kiti</div>
  <h1>Matematik Müdahale Kiti</h1>
  <p class="lead">Diskalkuli, matematik öğrenme güçlüğü ve düşük başarı için <b>en etkili 10 yöntem, strateji ve yaklaşım</b> — her biri somut örnekler ve görsellerle, sınıfta nasıl uygulanacağıyla.</p>
  <div class="pills"><span>🎯 10 yöntem · strateji · yaklaşım</span><span>📊 IES/WWC + meta-analiz</span><span>🖼️ Somut örnekli görseller</span></div>
</section>

<div class="wrap">
  <div class="layout">
    <aside class="side">
      <div class="side-in">
        <div class="side-head">Kit içeriği <span>${sections.length} yöntem</span></div>
        <ul class="side-list">
          <li><a href="#giris"><span class="s-ico">📘</span>Giriş</a></li>
          <li><a href="#tablo"><span class="s-ico">📊</span>Yöntemler bir bakışta</a></li>
          <li class="s-group">Yöntem · Strateji · Yaklaşım</li>
          ${sidebarMethods}
          <li class="s-group">Çerçeve</li>
          <li><a href="#ortak"><span class="s-ico">🧠</span>Ortak ilkeler</a></li>
          <li><a href="#karar"><span class="s-ico">🧭</span>Karar rehberi</a></li>
          <li><a href="#kaynakca"><span class="s-ico">📚</span>Kaynakça</a></li>
        </ul>
      </div>
    </aside>
    <main class="content">
      <section id="giris" class="card"><h2 class="sec">Giriş — neden bu kit?</h2>${INTRO}<div class="intro-pyr">${PYRAMID}<p class="cap">Katmanlı destek (RTI/MTSS): bu kitteki yöntemler özellikle 2. ve 3. katmanda en güçlüdür.</p></div></section>

      <section id="tablo" class="card"><h2 class="sec">Yöntemler bir bakışta</h2><p style="margin:0 0 4px;color:var(--muted);font-size:.9rem">Soldaki menüden ya da tablodan bir yönteme gidin. Kanıt ve etki değerleri kaynaklardan aktarılmıştır.</p>${comparisonTable(sections)}</section>

      ${methodsHtml}

      <section id="ortak" class="card"><h2 class="sec">Tüm yöntemlerde ortak ilkeler</h2>${CROSS}</section>

      <section id="karar" class="card"><h2 class="sec">Karar rehberi — yöntemleri nasıl birleştiririm?</h2>${KARAR}</section>

      <section id="kaynakca" class="card"><h2 class="sec">Kaynakça</h2><ul class="refs">${sourcesHtml}</ul>
        <p style="margin-top:12px;font-size:.85rem;color:var(--muted)">Bu kit, ABD Eğitim Bakanlığı IES/What Works Clearinghouse uygulama kılavuzları ve hakemli meta-analizler temel alınarak hazırlanmıştır. Etki büyüklükleri (g) ve kanıt dereceleri kaynaklardan aktarılmıştır; bazı tek-denek/meta-analitik değerler yayın yanlılığına karşı temkinli yorumlanmalıdır.</p>
      </section>
    </main>
  </div>
</div>

<div class="foot">Her Çocuk Matematik Öğrenebilir · DokunSay · Matematik Müdahale Kiti — kanıt-temelli yöntem, strateji ve yaklaşımlar</div>
<script>
(function(){
  var links=[].slice.call(document.querySelectorAll('.side-list a'));
  if(!links.length)return;
  var byId={}; links.forEach(function(a){byId[a.getAttribute('href').slice(1)]=a;});
  var secs=[].slice.call(document.querySelectorAll('.content>section[id]'));
  if(!secs.length)return;
  function update(){
    var line=window.scrollY+window.innerHeight*0.26, cur=secs[0];
    for(var i=0;i<secs.length;i++){ if(secs[i].offsetTop<=line) cur=secs[i]; }
    links.forEach(function(l){l.classList.remove('act');});
    var a=cur&&byId[cur.id]; if(a){a.classList.add('act');
      var sl=a.closest('.side-list'); if(sl){var r=a.offsetTop-sl.offsetTop; if(r<sl.scrollTop||r>sl.scrollTop+sl.clientHeight-40) sl.scrollTop=r-12;}
    }
  }
  window.addEventListener('scroll',update,{passive:true});
  window.addEventListener('resize',update,{passive:true});
  update();
})();
</script>
</body>
</html>`;

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, html, 'utf8');
console.log('Yazıldı: ' + OUT + ' (' + sections.length + ' yöntem, ' + html.length + ' bayt)');
