// DokunSay — ortak site üst başlığı (anasayfa/launcher başlığının statik eşleniği).
// Tüm içerik sayfalarında AYNI görünsün diye tek kaynak: rehber, sayı çubukları,
// öğrenme yörüngeleri (liste + alan sayfaları) bu başlığı kullanır.
//
// Anasayfadan tek farkı: DİL SEÇİCİ YOK (bu içerik sayfaları Türkçe).
// İçerik: beyaz kutuda Üçlü-Kod logosu + "DokunSay / Matematik Öğretim Araçları
// Platformu" + nav pill'leri (Öğrenme Yörüngeleri · Müdahale Rehberi · Araçlar) +
// #hcmoAuth giriş yuvası (hcmo-gate.js bu yuvayı doldurur → rozet köşede yüzmez).
//
// CSS sınıfları `dsh-` ön ekiyle ad-alanlıdır; sayfaların kendi .top/.brand/.header
// stilleriyle çakışmaz. Kullanım: ilgili üretici `SITE_HEADER_CSS`'i <style> içine,
// `renderSiteHeader(active)` çıktısını <body> başına koyar.

// Üçlü-Kod ortak işareti (_brand/hcmo-mark.svg ile birebir; beyaz kutuda durur).
export const SITE_HEADER_LOGO =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" aria-hidden="true">' +
  '<line x1="28" y1="27" x2="72" y2="27" stroke="#94a3b8" stroke-width="2.5" opacity="0.5"/>' +
  '<line x1="28" y1="27" x2="50" y2="73" stroke="#94a3b8" stroke-width="2.5" opacity="0.5"/>' +
  '<line x1="72" y1="27" x2="50" y2="73" stroke="#94a3b8" stroke-width="2.5" opacity="0.5"/>' +
  '<circle cx="28" cy="27" r="21" fill="#2E7D32"/>' +
  '<circle cx="20.5" cy="26" r="3.2" fill="#fff" opacity="0.95"/>' +
  '<circle cx="28" cy="26" r="3.2" fill="#fff" opacity="0.95"/>' +
  '<circle cx="35.5" cy="26" r="3.2" fill="#fff" opacity="0.95"/>' +
  '<circle cx="72" cy="27" r="21" fill="#0d9488"/>' +
  '<text x="72" y="32" text-anchor="middle" font-family="Georgia,serif" font-weight="700" font-size="14" fill="#fff">üç</text>' +
  '<circle cx="50" cy="73" r="21" fill="#1B5E20"/>' +
  '<text x="50" y="82" text-anchor="middle" font-family="Georgia,serif" font-weight="700" font-size="27" fill="#fff">3</text>' +
  '</svg>';

// Anasayfa başlığıyla aynı koyu-yeşil gradyan + pill düzeni. Tümü `.dsh` altında.
export const SITE_HEADER_CSS = `
.dsh{background:linear-gradient(135deg,#14391a 0%,#1d2b22 100%);color:#fff;padding:12px 24px;box-shadow:0 4px 10px rgba(24,40,25,.10),0 2px 4px rgba(24,40,25,.05);position:sticky;top:0;z-index:50}
.dsh-row{display:flex;align-items:center;justify-content:space-between;gap:16px;max-width:1440px;margin:0 auto;flex-wrap:wrap}
.dsh-brand{display:flex;align-items:center;gap:13px;text-decoration:none;color:#fff}
.dsh-logo{width:40px;height:40px;border-radius:12px;background:#fff;display:grid;place-items:center;padding:5px;box-shadow:0 1px 4px rgba(15,23,42,.12);flex:0 0 auto}
.dsh-logo svg{display:block;width:100%;height:100%}
.dsh-titles{display:flex;flex-direction:column;line-height:1.12}
.dsh-name{font-family:Poppins,system-ui,sans-serif;font-size:20px;font-weight:800;letter-spacing:.4px;color:#fff}
.dsh-sub{font-size:11.5px;font-weight:700;opacity:.72;letter-spacing:.3px;margin-top:2px;color:#fff}
.dsh-nav{display:flex;gap:8px;align-items:center;flex-wrap:wrap}
.dsh-pill{display:inline-flex;align-items:center;gap:6px;padding:8px 15px;border-radius:999px;font-weight:700;font-size:.86rem;font-family:inherit;line-height:1;text-decoration:none;white-space:nowrap;border:1px solid transparent;transition:filter .15s,background .15s}
.dsh-pill:hover{filter:brightness(1.13)}
.dsh-amber{color:#fde6c0;background:rgba(245,158,11,.18);border-color:rgba(245,158,11,.45)}
.dsh-green{color:#d7f0d9;background:rgba(46,125,50,.22);border-color:rgba(46,125,50,.5)}
.dsh-teal{color:#bfe8e4;background:rgba(13,148,136,.2);border-color:rgba(13,148,136,.5)}
.dsh-pill.is-active{box-shadow:inset 0 0 0 1.5px rgba(255,255,255,.45);filter:brightness(1.12)}
.dsh .numap-auth{display:inline-flex;align-items:center;gap:6px}
.dsh .numap-auth:empty{display:none}
.dsh .numap-auth a{display:inline-flex;align-items:center;gap:5px;padding:8px 14px;border-radius:999px;font-weight:700;font-size:.86rem;text-decoration:none;white-space:nowrap;color:#d7f0d9;background:rgba(46,125,50,.22);border:1px solid rgba(46,125,50,.5);transition:background .15s;cursor:pointer}
.dsh .numap-auth a:hover{background:rgba(46,125,50,.34)}
.dsh .numap-auth>span{display:inline-flex;align-items:center;gap:6px;font-weight:700;font-size:.86rem;color:#e8efe9}
.dsh .numap-auth .nm{color:#d7f0d9}
.dsh .numap-auth #numap-out{cursor:pointer;border:0;border-radius:999px;background:#2E7D32;color:#fff;font-weight:800;font-size:.8rem;padding:7px 13px;font-family:inherit}
.dsh .numap-auth #numap-out:hover{filter:brightness(1.1)}
@media (max-width:760px){.dsh{padding:10px 15px}.dsh-pill{padding:7px 11px;font-size:.8rem}.dsh-name{font-size:18px}}
@media print{.dsh{display:none}}`;

// active: 'yorunge' | 'rehber' | 'araclar' — geçerli sayfanın pill'i vurgulanır.
const PILLS = [
  ['yorunge', '/yorunge/',       '🧭', 'Öğrenme Yörüngeleri', 'dsh-amber'],
  ['rehber',  '/rehber/',        '📘', 'Müdahale Rehberi',    'dsh-green'],
  ['araclar', '/#tools-section', '🛠️', 'Araçlar',             'dsh-teal'],
];

export function renderSiteHeader(active) {
  const pills = PILLS.map(([key, href, ic, label, cls]) => {
    const on = key === active;
    return `<a class="dsh-pill ${cls}${on ? ' is-active' : ''}" href="${href}"${on ? ' aria-current="page"' : ''}>${ic} ${label}</a>`;
  }).join('');
  return `<header class="dsh"><div class="dsh-row">` +
    `<a class="dsh-brand" href="/" aria-label="DokunSay ana sayfa">` +
      `<span class="dsh-logo">${SITE_HEADER_LOGO}</span>` +
      `<span class="dsh-titles"><span class="dsh-name">DokunSay</span><span class="dsh-sub">Matematik Öğretim Araçları Platformu</span></span>` +
    `</a>` +
    `<nav class="dsh-nav" aria-label="Site gezinme">${pills}<span id="numapAuth" class="numap-auth"></span></nav>` +
  `</div></header>`;
}

export default renderSiteHeader;
