#!/usr/bin/env node
/**
 * DokunSay — Öğrenme Yörüngeleri DETAY sayfası üreteci
 * ────────────────────────────────────────────────────────────────────────
 * trajectories.data.js (düzeyler) + yorunge.enrich.js (pedagojik derinlik)
 * → her yörünge için /yorunge/<key>/index.html (gavbigav modeli, fazla zengin).
 *
 * Sayfa: sticky düzey listesi (scrollspy) + alana-göre renkli hero +
 * her düzey için kart (görsel + betim + "Nasıl görünür" + öğretmen notu +
 * Çalakî[malzeme/adımlar/✓ölçüt/kolay-zor] + uygulama rozetleri + kart yazdır +
 * sonraki düzey). Zenginleştirme yoksa temel veriye (d, task, iv) zarifçe düşer.
 *
 * Çıktı: _platform/launcher/public/yorunge/<key>/ (kaynak) + dist-site/yorunge/<key>/ (hızlı deploy).
 *
 * Çalıştır (PowerShell):  node _platform/scripts/build-yorunge.mjs
 */
import { writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { DOMAINS, STRANDS, strandOf } from '../shared/trajectories.data.js'
import { enrichOf } from '../shared/yorunge.enrich.js'
import { SITE_HEADER_CSS, renderSiteHeader } from './site-header.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..', '..')
const OUT_PUBLIC = join(ROOT, '_platform', 'launcher', 'public', 'yorunge')
const OUT_DIST = join(ROOT, 'dist-site', 'yorunge')

// ── Alan (strand) renkleri — index.html ile birebir ───────────────────────
const STRAND_COLOR = { say: '#2E7D32', cebir: '#6f8f1f', geo: '#7c3aed', olcme: '#0d9488', veri: '#2563eb' }
const STRAND_LABEL = Object.fromEntries(STRANDS.map((s) => [s.key, s.label]))

// ── Yörünge meta (simge · yaş · özet) — index.html ile tutarlı ────────────
const META = {
  sub: { ic: '👁️', age: '3–9 yaş', t: 'Saymadan, bir bakışta miktarı bilme.' },
  count: { ic: '🔢', age: '2–10 yaş', t: 'Nesneleri birebir sayma; son söz = çokluk.' },
  comp: { ic: '⚖️', age: '2–10 yaş', t: 'Çoklukları karşılaştırma, zihinsel sayı doğrusu.' },
  add: { ic: '➕', age: '3–10 yaş', t: 'Birleştirme/ayırma; sayma → türetme stratejileri.' },
  compose: { ic: '🧩', age: '2–9 yaş', t: 'Parça-bütün; 10’u bileşenlerine ayırma.' },
  multdiv: { ic: '✖️', age: '3–10 yaş', t: 'Eşit gruplar, paylaştırma, diziler.' },
  frac: { ic: '🍕', age: '4–11 yaş', t: 'Eş paylaşım, birim kesir, kesir işlemleri.' },
  pattern: { ic: '🔁', age: '3–11 yaş', t: 'Örüntü tanıma/sürdürme; birim; ilişkisel düşünme.' },
  shape2d: { ic: '🔺', age: '2–10 yaş', t: 'Şekil tanıma, kenar/köşe, özellikler.' },
  comp2d: { ic: '🧷', age: '2–9 yaş', t: 'Parçalardan şekil kurma, ayrıştırma.' },
  disembed: { ic: '🔍', age: '3–9 yaş', t: 'Karmaşık resimde gizli şekli ayırma.' },
  shape3d: { ic: '🧊', age: '2–10 yaş', t: 'Küp/koni/silindir; yüz–köşe.' },
  comp3d: { ic: '🏗️', age: '2–9 yaş', t: 'Bloklarla yapı kurma.' },
  spviz: { ic: '🔄', age: '2–10 yaş', t: 'Döndürme, yansıtma, kaydırma.' },
  sporient: { ic: '🧭', age: '2–10 yaş', t: 'Yön bulma, harita, koordinat.' },
  mlen: { ic: '📏', age: '2–10 yaş', t: 'Karşılaştırma, birim, cetvel.' },
  marea: { ic: '🟩', age: '3–10 yaş', t: 'Yüzey kaplama, satır-sütun.' },
  mvol: { ic: '🧪', age: '4–11 yaş', t: 'Kapları doldurma, 3B birim.' },
  mang: { ic: '📐', age: '4–11 yaş', t: 'Açı karşılaştırma ve ölçme.' },
  classif: { ic: '📊', age: '2–11 yaş', t: 'Gruplama, veri okuma, grafik.' },
}

// ── DokunSay araç eşlemesi (canlı yollar — dokunsay.com'da doğrulandı) ─────
const TOOL_PATH = {
  bar: '/DokunSayBar/', basamak: '/DokunSayBasamak/', clock: '/DokunSayClock/',
  kesir: '/DokunSayKesir/', tam: '/DokunSayTam/', geo: '/Dokunsay-geo/', veri: '/Dokunsay-veri-app/',
}
const TOOL_NAME = {
  bar: 'DokunSay Bar', basamak: 'DokunSay Basamak', clock: 'DokunSay Clock',
  kesir: 'DokunSay Kesir', tam: 'DokunSay Tam', geo: 'DokunSay Geo', veri: 'DokunSay Veri',
}
const DOMAIN_TOOL = {
  sub: 'bar', count: 'bar', comp: 'bar', add: 'bar', compose: 'bar', multdiv: 'bar', frac: 'kesir',
  pattern: 'bar',
  shape2d: 'geo', comp2d: 'geo', disembed: 'geo', shape3d: 'geo', comp3d: 'geo', spviz: 'geo', sporient: 'geo',
  mlen: 'bar', marea: 'bar', mvol: 'bar', mang: 'geo', classif: 'veri',
}
const APP_URL = { GalakSay: 'https://galaksay.com/oyna/', ABMATO: 'https://abmato.com/' }

// ── HTML kaçışı ───────────────────────────────────────────────────────────
const esc = (s) => String(s == null ? '' : s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

// ── Yaş bandı (ay → "x–y yaş") ────────────────────────────────────────────
const ageBand = (lo, hi) => {
  const a = Math.max(0, Math.round(lo / 12)), b = Math.round(hi / 12)
  return a === b ? `${b} yaş` : `${a}–${b} yaş`
}

// ════════════════════════════════════════════════════════════════════════
// GÖRSEL (SVG glyph) motoru — Sanbil düzeyleri için kavram-uygun temsiller
// ════════════════════════════════════════════════════════════════════════
const DOT = (cx, cy, r, c) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${c}"/>`

// canonical 1–6 nokta yerleşimi (zar düzeni), birim kare içinde (0..1)
const PIPS = {
  1: [[.5, .5]],
  2: [[.3, .3], [.7, .7]],
  3: [[.28, .28], [.5, .5], [.72, .72]],
  4: [[.3, .3], [.7, .3], [.3, .7], [.7, .7]],
  5: [[.28, .28], [.72, .28], [.5, .5], [.28, .72], [.72, .72]],
  6: [[.3, .25], [.7, .25], [.3, .5], [.7, .5], [.3, .75], [.7, .75]],
}
function svgDie(n, c, W = 150, H = 120) {
  const s = Math.min(W, H) * 0.74, ox = (W - s) / 2, oy = (H - s) / 2, r = s * 0.085
  const pts = PIPS[n] || PIPS[6]
  const dots = pts.map(([x, y]) => DOT(ox + x * s, oy + y * s, r, c)).join('')
  return `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" role="img">${dots}</svg>`
}
// gruplu noktalar (iki renkli parça-bütün) — viewBox içeriğe göre boyutlanır
function svgGroups(groups, H = 120) {
  const cols = ['#f59e0b', '#0d9488', '#7c3aed']
  const total = groups.reduce((a, g) => a + g, 0)
  const r = 11, gap = 7
  const cw = total * (2 * r) + (total - 1) * gap + (groups.length - 1) * 14
  const W = cw + 24
  let x = 12 + r, y = H / 2, out = ''
  groups.forEach((g, gi) => {
    for (let i = 0; i < g; i++) { out += DOT(x, y, r, cols[gi % cols.length]); x += 2 * r + gap }
    x += 14
  })
  return `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" role="img">${out}</svg>`
}
// onluk çerçeve (2×5), n dolu — viewBox içeriğe göre boyutlanır
function svgTenFrame(n, c, frames = 1, H = 110) {
  const cell = 18, gap = 3, fw = 5 * cell + 6 * gap, fh = 2 * cell + 3 * gap
  const totalW = frames * fw + (frames - 1) * 14, W = totalW + 20, ox0 = 10, oy = (H - fh) / 2
  let out = '', left = n
  for (let f = 0; f < frames; f++) {
    const ox = ox0 + f * (fw + 14)
    out += `<rect x="${ox}" y="${oy}" width="${fw}" height="${fh}" rx="6" fill="none" stroke="#cbd5e1" stroke-width="1.5"/>`
    for (let row = 0; row < 2; row++) for (let col = 0; col < 5; col++) {
      const cx = ox + gap + col * (cell + gap) + cell / 2
      const cy = oy + gap + row * (cell + gap) + cell / 2
      const filled = left > 0
      out += `<circle cx="${cx}" cy="${cy}" r="${cell * 0.36}" fill="${filled ? c : '#fff'}" stroke="${filled ? c : '#e2e8f0'}" stroke-width="1.5"/>`
      if (filled) left--
    }
  }
  return `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" role="img">${out}</svg>`
}
// basamak değeri: onluk çubuklar + birlik küpler
function svgBaseTen(tens, ones, c, W = 200, H = 120) {
  const rodW = 12, rodH = 84, gap = 6, cube = 13
  let out = '', x = 16
  for (let t = 0; t < tens; t++) {
    out += `<rect x="${x}" y="${(H - rodH) / 2}" width="${rodW}" height="${rodH}" rx="3" fill="${c}"/>`
    for (let s = 1; s < 10; s++) out += `<line x1="${x}" y1="${(H - rodH) / 2 + s * rodH / 10}" x2="${x + rodW}" y2="${(H - rodH) / 2 + s * rodH / 10}" stroke="#fff" stroke-width="0.8" opacity=".55"/>`
    x += rodW + gap
  }
  x += 8
  const oc = '#f59e0b'
  for (let o = 0; o < ones; o++) {
    const col = o % 2, row = Math.floor(o / 2)
    out += `<rect x="${x + col * (cube + 4)}" y="${(H - 4 * cube - 12) / 2 + row * (cube + 4)}" width="${cube}" height="${cube}" rx="2.5" fill="${oc}"/>`
  }
  return `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" role="img">${out}</svg>`
}
// dizi (array) r×c
function svgArray(r, cN, c, W = 170, H = 120) {
  const rad = 9, gap = 9, gw = cN * (2 * rad) + (cN - 1) * gap, gh = r * (2 * rad) + (r - 1) * gap
  const ox = (W - gw) / 2 + rad, oy = (H - gh) / 2 + rad
  let out = ''
  for (let i = 0; i < r; i++) for (let j = 0; j < cN; j++) out += DOT(ox + j * (2 * rad + gap), oy + i * (2 * rad + gap), rad, c)
  return `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" role="img">${out}</svg>`
}

// sayı doğrusu 0..max; at[]=işaretli noktalar; hi=vurgulu nokta
function svgNumberLine(max, at = [], hi = null, c, W = 220, H = 96) {
  const x0 = 20, x1 = W - 20, y = H * 0.56, span = x1 - x0
  const px = (v) => x0 + (span * v) / max
  let out = `<line x1="${x0}" y1="${y}" x2="${x1}" y2="${y}" stroke="#94a3b8" stroke-width="2"/>`
  out += `<polygon points="${x1},${y} ${x1 - 8},${y - 5} ${x1 - 8},${y + 5}" fill="#94a3b8"/>`
  const step = max <= 10 ? 1 : max <= 20 ? 2 : Math.ceil(max / 10)
  for (let v = 0; v <= max; v += step) {
    out += `<line x1="${px(v)}" y1="${y - 5}" x2="${px(v)}" y2="${y + 5}" stroke="#cbd5e1" stroke-width="1.5"/>`
    out += `<text x="${px(v)}" y="${y + 20}" font-size="11" fill="#94a3b8" text-anchor="middle" font-family="Inter,sans-serif">${v}</text>`
  }
  for (const a of at) out += DOT(px(a), y, 7, a === hi ? '#f59e0b' : c)
  if (hi != null && !at.includes(hi)) out += `<g><line x1="${px(hi)}" y1="${y - 24}" x2="${px(hi)}" y2="${y - 8}" stroke="#f59e0b" stroke-width="2"/>${DOT(px(hi), y, 7, '#f59e0b')}</g>`
  return `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" role="img">${out}</svg>`
}
// iki çokluğu karşılaştır: sol a, sağ b (sütun yığını); fazlası belirgin — H içeriğe göre
function svgCompare(a, b, c, W = 180) {
  const r = 9, gap = 5, maxN = Math.max(a, b, 1)
  const H = maxN * (2 * r + gap) + 40
  const colX = [W * 0.32, W * 0.68], baseY = H - 26
  const rel = a > b ? '>' : a < b ? '<' : '='
  let out = ''
  ;[a, b].forEach((n, k) => {
    for (let i = 0; i < n; i++) out += DOT(colX[k], baseY - i * (2 * r + gap) - r, r, (k === 0 ? a >= b : b >= a) ? c : '#cbd5e1')
    out += `<text x="${colX[k]}" y="${H - 6}" font-size="13" fill="#475569" text-anchor="middle" font-family="Inter,sans-serif" font-weight="600">${n}</text>`
  })
  out += `<text x="${W / 2}" y="${H * 0.5}" font-size="22" fill="#0f172a" text-anchor="middle" font-family="Poppins,sans-serif" font-weight="800">${rel}</text>`
  return `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" role="img">${out}</svg>`
}
// birleştirme a + b (toplama)
function svgCombine(a, b, c, W = 200, H = 110) {
  const r = 10, gap = 6, cols = ['#f59e0b', '#0d9488']
  const wA = a * (2 * r + gap), wB = b * (2 * r + gap), plusW = 26
  const totalW = wA + plusW + wB, ox = (W - totalW) / 2 + r, y = H / 2
  let out = '', x = ox
  for (let i = 0; i < a; i++) { out += DOT(x, y, r, cols[0]); x += 2 * r + gap }
  x += -gap + 6
  out += `<text x="${x + 7}" y="${y + 7}" font-size="20" fill="#0f172a" text-anchor="middle" font-family="Poppins,sans-serif" font-weight="800">+</text>`
  x += plusW
  for (let i = 0; i < b; i++) { out += DOT(x, y, r, cols[1]); x += 2 * r + gap }
  return `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" role="img">${out}</svg>`
}
// birebir sayma: n nesne, üstünde 1..n etiketi
function svgCount(n, c, W = 210, H = 96) {
  const r = 11, gap = 8, tot = n * (2 * r) + (n - 1) * gap, ox = (W - tot) / 2 + r, y = H * 0.62
  let out = ''
  for (let i = 0; i < n; i++) {
    const x = ox + i * (2 * r + gap)
    out += DOT(x, y, r, c)
    out += `<text x="${x}" y="${y - r - 6}" font-size="12" fill="#64748b" text-anchor="middle" font-family="Inter,sans-serif" font-weight="600">${i + 1}</text>`
  }
  return `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" role="img">${out}</svg>`
}

// Zenginleştirmedeki viz reçetesini SVG'ye çevir (veri-temelli görsel motoru)
function renderViz(v, color) {
  if (!v || !v.t) return null
  switch (v.t) {
    case 'dots': return v.group ? svgGroups(v.group) : svgDie(v.n, color)
    case 'tenframe': return svgTenFrame(v.n, color, v.frames || 1)
    case 'baseten': return svgBaseTen(v.tens, v.ones, color)
    case 'array': return svgArray(v.r, v.c, color)
    case 'numline': return svgNumberLine(v.max, v.at || [], v.hi == null ? null : v.hi, color)
    case 'compare': return svgCompare(v.a, v.b, color)
    case 'combine': return svgCombine(v.a, v.b, color)
    case 'count': return svgCount(v.n, color)
    default: return null
  }
}

// Sanbil düzey-bazlı görsel reçetesi (kavramı en iyi temsil eden glyph)
const SUB_VIZ = [
  (c) => svgDie(1, c), (c) => svgDie(2, c), (c) => svgDie(2, c), (c) => svgDie(3, c),
  (c) => svgDie(4, c), (c) => svgDie(5, c),
  () => svgGroups([2, 3]), () => svgGroups([5, 2]),
  (c) => svgTenFrame(8, c), (c) => svgTenFrame(14, c, 2),
  (c) => svgBaseTen(3, 4, c), (c) => svgArray(3, 4, c),
]

// Yörünge için bir düzeyin görselini üret (öncelik: enrich.viz → sub reçetesi → null amblem)
function levelGlyph(key, i, color, en) {
  if (en && en.viz) { const g = renderViz(en.viz, color); if (g) return g }
  if (key === 'sub' && SUB_VIZ[i]) return SUB_VIZ[i](color)
  return null
}

// ════════════════════════════════════════════════════════════════════════
// Parçacık üreticileri
// ════════════════════════════════════════════════════════════════════════
function ivChips(iv, levelTool) {
  if (!iv || !iv.length) return ''
  const chips = iv.map((m) => {
    const a = esc(m.a)
    if (m.k === 'DokunSay') {
      const tool = levelTool || 'bar'
      return `<a class="chip chip-ds" href="${TOOL_PATH[tool]}" title="${a}"><b>${esc(TOOL_NAME[tool])}</b><span>${a}</span></a>`
    }
    if (m.k === 'GalakSay') return `<a class="chip chip-gs" href="${APP_URL.GalakSay}" title="${a}"><b>GalakSay</b><span>${a}</span></a>`
    if (m.k === 'ABMATO') return `<a class="chip chip-ab" href="${APP_URL.ABMATO}" title="${a}"><b>ABMATO</b><span>${a}</span></a>`
    // ADIM — öğretmen yönergeli (İZ/Altı Adım); açık genel-erişim bağlantısı yok
    return `<span class="chip chip-adim" title="${a}"><b>ADIM</b><span>${a}</span></span>`
  }).join('')
  return `<div class="chips"><span class="chips-lab">Bu düzeyi besleyen araçlar</span><div class="chips-row">${chips}</div></div>`
}

function activityBlock(lv, en, levelTool) {
  // Zenginleştirilmiş etkinlik varsa onu; yoksa EXT gözlem görevi (task); o da yoksa atla.
  let inner = ''
  if (en && en.act) {
    const a = en.act
    const mats = (a.materials || []).map((m) => `<li>${esc(m)}</li>`).join('')
    const steps = (a.steps || []).map((s) => `<li>${esc(s)}</li>`).join('')
    inner = `
      ${mats ? `<div class="act-sub"><h5>Malzeme</h5><ul class="mats">${mats}</ul></div>` : ''}
      ${steps ? `<div class="act-sub"><h5>Adımlar</h5><ol class="steps">${steps}</ol></div>` : ''}
      ${a.criterion ? `<p class="crit"><span class="tick">✓</span> <b>Gözlem ölçütü:</b> ${esc(a.criterion)}</p>` : ''}
      ${(a.easy || a.hard) ? `<div class="scaf">
        ${a.easy ? `<div class="scaf-c easy"><h6>↓ Kolaylaştır</h6><p>${esc(a.easy)}</p></div>` : ''}
        ${a.hard ? `<div class="scaf-c hard"><h6>↑ Zorlaştır</h6><p>${esc(a.hard)}</p></div>` : ''}
      </div>` : ''}`
  } else if (lv.task) {
    inner = `<p class="obs"><b>Gözlem görevi.</b> ${esc(lv.task)}</p>`
  }
  if (!inner) return ivChips(lv.iv, levelTool) // hiç içerik yoksa yalnız rozetler
  return `<div class="act">
    <div class="act-head"><span class="act-ic">✏️</span><h4>Çalakî · Etkinlik</h4></div>
    ${inner}
    ${ivChips(lv.iv, levelTool)}
  </div>`
}

function levelCard(domain, lv, i, color, levels) {
  const en = enrichOf(domain.key, i)
  const isBn = !!lv.b
  const glyph = levelGlyph(domain.key, i, color, en)
  const tool = (en && en.tool) || DOMAIN_TOOL[domain.key] || 'bar'
  const next = levels[i + 1]
  const nextLink = next
    ? `<a class="nextlv" href="#lv-${i + 1}">Sıradaki düzey · <b>${esc(next.n)}</b> →</a>`
    : `<div class="nextlv done">Bu, yörüngenin son düzeyi 🎒</div>`
  return `
  <article class="level${isBn ? ' bn' : ''}" id="lv-${i}">
    <div class="lv-top">
      <div class="lv-num" style="--c:${color}">${i + 1}</div>
      <div class="lv-id">
        <div class="lv-badges">
          <span class="age-pill" style="--c:${color}">${esc(ageBand(lv.lo, lv.hi))}</span>
          ${isBn ? '<span class="bn-pill">⚠ Darboğaz · kritik geçiş</span>' : ''}
        </div>
        <h3>${esc(lv.n)}</h3>
      </div>
    </div>
    <div class="lv-body">
      <div class="lv-main">
        <p class="lv-desc"><b>Bu düzeyde çocuk:</b> ${esc(lv.d)}</p>
        ${en && en.how ? `<div class="note how"><h5>Nasıl görünür</h5><p>${esc(en.how)}</p></div>` : ''}
        ${en && en.teacher ? `<div class="note teach"><h5>👩‍🏫 Öğretmen notu</h5><p>${esc(en.teacher)}</p></div>` : ''}
        ${activityBlock(lv, en, tool)}
      </div>
      ${glyph ? `<div class="lv-viz" aria-hidden="true">${glyph}<span class="viz-cap">bir bakışta</span></div>` : `<div class="lv-viz emblem" aria-hidden="true"><span style="--c:${color}">${META[domain.key]?.ic || '•'}</span></div>`}
    </div>
    <div class="lv-foot">
      <button class="printcard" data-lv="${i}" type="button">🖨️ Bu kartı yazdır</button>
      ${nextLink}
    </div>
  </article>`
}

function sidebar(domain, color, levels) {
  const items = levels.map((lv, i) =>
    `<li><a href="#lv-${i}" data-i="${i}"><span class="s-num" style="--c:${color}">${i + 1}</span><span class="s-txt"><b>${esc(lv.n)}</b><small>${esc(ageBand(lv.lo, lv.hi))}${lv.b ? ' · ⚠ darboğaz' : ''}</small></span></a></li>`
  ).join('')
  return `<aside class="side">
    <div class="side-in">
      <div class="side-head">Düzeyler <span>${levels.length}</span></div>
      <ol class="side-list">${items}</ol>
    </div>
  </aside>`
}

function page(domain) {
  const color = STRAND_COLOR[domain.strand] || '#2E7D32'
  const strandLabel = STRAND_LABEL[domain.strand] || ''
  const meta = META[domain.key] || { ic: '•', age: '', t: domain.gloss || '' }
  const levels = domain.levels
  const minLo = Math.min(...levels.map((l) => l.lo)), maxHi = Math.max(...levels.map((l) => l.hi))
  const bnCount = levels.filter((l) => l.b).length
  const wlabel = domain.weight === 'çekirdek' ? 'Çekirdek alan · tam etkileşimli'
    : domain.weight === 'tamamlayıcı' ? 'Tamamlayıcı alan · gözlem + etkinlik'
    : 'Profil alanı · gözlem'
  const desc = `${domain.name} öğrenme yörüngesi: ${levels.length} gelişim basamağı, her birinde DokunSay etkinliği ve gözlem ölçütü. Clements & Sarama çerçevesi. ${meta.t}`

  return `<!DOCTYPE html>
<html lang="tr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(domain.name)} — Öğrenme Yörüngesi · DokunSay</title>
<meta name="description" content="${esc(desc)}">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@600;700;800;900&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
  :root{
    --c:${color};
    --amber:#2E7D32; --ink:#182219; --body:#37433c; --muted:#5f6b63; --line:#dfe7df;
    --bg:#f3f7f1; --card:#ffffff; --maxw:1180px; --r:18px;
    --shadow:0 10px 30px -14px rgba(24,40,25,.22);
  }
  *{box-sizing:border-box;margin:0;padding:0}
  html{scroll-behavior:smooth}
  body{font-family:Inter,system-ui,sans-serif;color:var(--body);background:var(--bg);line-height:1.65;-webkit-font-smoothing:antialiased}
  h1,h2,h3,h4,h5,h6{font-family:Poppins,sans-serif;color:var(--ink);line-height:1.16;letter-spacing:-.01em}
  a{color:inherit;text-decoration:none}
  .wrap{max-width:var(--maxw);margin:0 auto;padding:0 22px}
  .eyebrow{font-family:Poppins;font-weight:700;font-size:.74rem;letter-spacing:.16em;text-transform:uppercase}

${SITE_HEADER_CSS}

  .hero{background:linear-gradient(135deg,color-mix(in srgb,var(--c) 88%,#000),color-mix(in srgb,var(--c) 62%,#14391a));color:#fff;padding:30px 0 40px;position:relative;overflow:hidden}
  .hero::after{content:"";position:absolute;right:-70px;top:-60px;width:320px;height:320px;border-radius:50%;background:radial-gradient(circle,rgba(255,255,255,.16),transparent 70%)}
  .crumb{font-size:.84rem;color:rgba(255,255,255,.8);margin-bottom:16px;display:flex;gap:8px;align-items:center;flex-wrap:wrap}
  .crumb a{color:rgba(255,255,255,.92);text-decoration:underline;text-underline-offset:2px}
  .hero-grid{display:flex;align-items:flex-start;gap:18px;position:relative;z-index:1}
  .hero-ic{font-size:2.6rem;line-height:1;background:rgba(255,255,255,.16);width:74px;height:74px;border-radius:18px;display:flex;align-items:center;justify-content:center;flex:0 0 auto}
  .hero .eyebrow{color:rgba(255,255,255,.85)}
  .hero h1{color:#fff;font-size:clamp(1.9rem,4.4vw,2.9rem);font-weight:900;margin:6px 0 10px}
  .hero .lede{color:rgba(255,255,255,.94);font-size:1.06rem;max-width:680px}
  .hero .ltname{opacity:.8;font-style:italic}
  .hero-meta{display:flex;flex-wrap:wrap;gap:9px;margin-top:16px}
  .hm{background:rgba(255,255,255,.16);border:1px solid rgba(255,255,255,.22);color:#fff;border-radius:999px;padding:.34em .9em;font-size:.82rem;font-weight:600;font-family:Poppins}
  .hero-cta{display:flex;gap:10px;margin-top:18px;flex-wrap:wrap}
  .btn{font-family:Poppins;font-weight:700;font-size:.9rem;border-radius:999px;padding:.6em 1.2em;cursor:pointer;border:0;display:inline-flex;align-items:center;gap:7px}
  .btn-w{background:#fff;color:var(--ink)}.btn-w:hover{transform:translateY(-1px)}
  .btn-o{background:rgba(255,255,255,.14);color:#fff;border:1px solid rgba(255,255,255,.4)}.btn-o:hover{background:rgba(255,255,255,.24)}

  .layout{display:grid;grid-template-columns:266px 1fr;gap:34px;align-items:start;padding:34px 0 50px}
  .side{position:sticky;top:78px}
  .side-in{background:var(--card);border:1px solid var(--line);border-radius:16px;overflow:hidden;max-height:calc(100vh - 100px);display:flex;flex-direction:column}
  .side-head{font-family:Poppins;font-weight:800;color:var(--ink);font-size:.82rem;letter-spacing:.06em;text-transform:uppercase;padding:14px 16px;border-bottom:1px solid var(--line);display:flex;justify-content:space-between}
  .side-head span{color:var(--c)}
  .side-list{list-style:none;overflow-y:auto;padding:6px}
  .side-list a{display:flex;gap:10px;align-items:center;padding:8px 9px;border-radius:10px;transition:background .15s}
  .side-list a:hover{background:#f1f8f2}
  .side-list a.act{background:color-mix(in srgb,var(--c) 12%,#fff)}
  .s-num{flex:0 0 auto;width:24px;height:24px;border-radius:7px;background:color-mix(in srgb,var(--c) 14%,#fff);color:var(--c);font-family:Poppins;font-weight:700;font-size:.8rem;display:flex;align-items:center;justify-content:center}
  .side-list a.act .s-num{background:var(--c);color:#fff}
  .s-txt{display:flex;flex-direction:column;min-width:0}
  .s-txt b{font-family:Inter;font-weight:600;font-size:.86rem;color:var(--ink);line-height:1.25}
  .s-txt small{color:var(--muted);font-size:.72rem}

  .levels{display:flex;flex-direction:column;gap:20px}
  .level{background:var(--card);border:1px solid var(--line);border-radius:var(--r);padding:22px 24px;scroll-margin-top:84px;position:relative}
  .level.bn{border-color:#f3c98b;box-shadow:0 0 0 1px #f3c98b inset}
  .level.bn::before{content:"";position:absolute;left:0;top:18px;bottom:18px;width:4px;border-radius:4px;background:linear-gradient(#f59e0b,#ea580c)}
  .lv-top{display:flex;gap:14px;align-items:flex-start;margin-bottom:14px}
  .lv-num{flex:0 0 auto;width:42px;height:42px;border-radius:12px;background:var(--c);color:#fff;font-family:Poppins;font-weight:800;font-size:1.25rem;display:flex;align-items:center;justify-content:center}
  .lv-badges{display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-bottom:3px}
  .age-pill{font-family:Poppins;font-weight:700;font-size:.7rem;color:var(--c);background:color-mix(in srgb,var(--c) 12%,#fff);border-radius:999px;padding:.2em .7em}
  .bn-pill{font-family:Poppins;font-weight:700;font-size:.7rem;color:#9a3412;background:#fff3e2;border:1px solid #f3c98b;border-radius:999px;padding:.2em .7em}
  .lv-id h3{font-size:1.2rem;font-weight:700}
  .lv-body{display:grid;grid-template-columns:1fr 196px;gap:20px;align-items:start}
  .lv-main{min-width:0}
  .lv-desc{font-size:.98rem;color:var(--body);margin-bottom:12px}
  .lv-desc b{color:var(--ink)}
  .note{border-radius:12px;padding:12px 15px;margin-bottom:11px}
  .note h5{font-size:.74rem;letter-spacing:.05em;text-transform:uppercase;margin-bottom:4px}
  .note p{font-size:.92rem}
  .note.how{background:#f4f8f5;border:1px solid #dcebe1}.note.how h5{color:#15803d}
  .note.teach{background:#fff8ee;border:1px solid #f3e2c4}.note.teach h5{color:#b45309}
  .lv-viz{background:linear-gradient(#f8fbf7,#eef5ec);border:1px solid var(--line);border-radius:14px;padding:10px;display:flex;flex-direction:column;align-items:center;justify-content:center;position:sticky;top:80px}
  .lv-viz svg{width:100%;height:auto;max-height:130px}
  .lv-viz .viz-cap{font-size:.7rem;color:var(--muted);font-weight:600;margin-top:4px;font-family:Poppins;letter-spacing:.04em}
  .lv-viz.emblem span{font-size:3.2rem;filter:saturate(1.05)}

  .act{margin-top:14px;background:#fbfdfb;border:1px solid #e3efe5;border-radius:14px;padding:15px 17px}
  .act-head{display:flex;align-items:center;gap:8px;margin-bottom:10px}
  .act-head h4{font-size:1rem;font-weight:700;color:#15803d}
  .act-ic{font-size:1.1rem}
  .act-sub{margin-bottom:10px}
  .act-sub h5{font-size:.72rem;letter-spacing:.06em;text-transform:uppercase;color:#64748b;margin-bottom:5px}
  .mats{list-style:none;display:flex;flex-wrap:wrap;gap:6px}
  .mats li{background:#eef6ef;border:1px solid #d7e9d9;color:#2f5337;border-radius:8px;padding:.22em .6em;font-size:.84rem}
  .steps{margin:0 0 0 18px;padding:0}
  .steps li{font-size:.92rem;margin-bottom:5px;padding-left:3px}
  .crit{background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;padding:9px 12px;font-size:.9rem;color:#166534;margin:10px 0}
  .crit .tick{color:#2E7D32;font-weight:800}
  .scaf{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:8px}
  .scaf-c{border-radius:10px;padding:9px 12px;font-size:.88rem}
  .scaf-c h6{font-size:.74rem;margin-bottom:3px;font-weight:700}
  .scaf-c.easy{background:#f1f5f9;border:1px solid #e2e8f0}.scaf-c.easy h6{color:#475569}
  .scaf-c.hard{background:#faf5ff;border:1px solid #e9d5ff}.scaf-c.hard h6{color:#7c3aed}
  .obs{background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:11px 14px;font-size:.92rem}
  .obs b{color:var(--ink)}

  .chips{margin-top:12px}
  .chips-lab{font-size:.72rem;letter-spacing:.05em;text-transform:uppercase;color:#94a3b8;font-weight:700;font-family:Poppins}
  .chips-row{display:flex;flex-wrap:wrap;gap:8px;margin-top:6px}
  .chip{display:inline-flex;flex-direction:column;border-radius:10px;padding:7px 11px;font-size:.8rem;border:1px solid;max-width:240px;transition:transform .14s}
  .chip:hover{transform:translateY(-2px)}
  .chip b{font-family:Poppins;font-weight:700;font-size:.82rem}
  .chip span{font-size:.74rem;opacity:.85;line-height:1.3}
  .chip-ds{background:#fff7ec;border-color:#f6dcae;color:#9a5b16}
  .chip-gs{background:#eef2ff;border-color:#c7d2fe;color:#4338ca}
  .chip-ab{background:#ecfdf5;border-color:#bbf7d0;color:#166534}
  .chip-adim{background:#f8fafc;border-color:#e2e8f0;color:#64748b;cursor:default}

  .lv-foot{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-top:16px;padding-top:14px;border-top:1px dashed var(--line);flex-wrap:wrap}
  .printcard{background:#fff;border:1px solid var(--line);color:var(--body);font-family:Poppins;font-weight:600;font-size:.82rem;border-radius:999px;padding:.5em 1em;cursor:pointer}
  .printcard:hover{background:#f1f8f2;color:var(--ink)}
  .nextlv{font-family:Poppins;font-weight:600;font-size:.86rem;color:var(--c)}
  .nextlv b{font-weight:700}
  .nextlv.done{color:var(--muted)}

  footer{background:#14391a;color:#9db89f;padding:36px 0;margin-top:10px;font-size:.88rem}
  footer a{color:#d8e6d8;text-decoration:underline}
  .foot-note{max-width:760px;font-size:.82rem;color:#7f9781;margin-top:8px}

  @media(max-width:980px){
    .layout{grid-template-columns:1fr;gap:0}
    .side{position:static;margin-bottom:20px}
    .side-in{max-height:none}
    .side-list{max-height:300px}
    .lv-body{grid-template-columns:1fr}
    .lv-viz{order:-1;flex-direction:row;gap:12px;position:static}
    .lv-viz svg{max-height:90px;width:auto}
    .scaf{grid-template-columns:1fr}
    .nav-links{display:none}
  }

  /* ── Yazdırma ── */
  @media print{
    header,.hero-cta,.side,footer,.printcard,.nextlv,.chips{display:none!important}
    body{background:#fff}
    .hero{background:#fff;color:#000;padding:0 0 10px;border-bottom:2px solid #000}
    .hero::after{display:none}.hero-ic{background:#eee}
    .hero h1,.hero .eyebrow,.hero .lede,.crumb{color:#000}
    .layout{display:block;padding:6px 0}
    .levels{gap:0}
    .level{break-inside:avoid;page-break-inside:avoid;border:1px solid #999;box-shadow:none;margin-bottom:10px}
    .lv-viz{border:1px solid #ccc}
    body.printing-one .level:not(.print-target){display:none!important}
    body.printing-one .hero .lede,body.printing-one .hero-meta{display:none}
  }
</style>
</head>
<body data-key="${domain.key}">
${renderSiteHeader('yorunge')}

<section class="hero">
  <div class="wrap">
    <div class="crumb"><a href="/yorunge/">Öğrenme Yörüngeleri</a> <span>›</span> <span>${esc(strandLabel)}</span></div>
    <div class="hero-grid">
      <div class="hero-ic">${meta.ic}</div>
      <div>
        <span class="eyebrow">${esc(strandLabel)}</span>
        <h1>${esc(domain.name)}</h1>
        <p class="lede">${esc(domain.gloss ? domain.gloss[0].toUpperCase() + domain.gloss.slice(1) + '. ' : '')}${esc(meta.t)} ${domain.ltName ? `<span class="ltname">(${esc(domain.ltName)})</span>` : ''}</p>
        <div class="hero-meta">
          <span class="hm">📊 ${levels.length} basamak</span>
          <span class="hm">🎂 ${esc(ageBand(minLo, maxHi))}</span>
          ${bnCount ? `<span class="hm">⚠ ${bnCount} darboğaz</span>` : ''}
          <span class="hm">🎯 ${esc(wlabel)}</span>
        </div>
        <div class="hero-cta">
          <a class="btn btn-w" href="calisma-yapraklari.html">✏️ Çalışma yaprakları</a>
          <a class="btn btn-w" href="calisma-yapraklari-dokunsay.html">🧩 DokunSay materyalli yapraklar</a>
          <a class="btn btn-o" href="etkinlik-kartlari.pdf" target="_blank" rel="noopener">⬇ Etkinlik kartları (PDF)</a>
          <button class="btn btn-o" id="printAll" type="button">🖨️ Yazdır</button>
          <a class="btn btn-o" href="/yorunge/">← Tüm yörüngeler</a>
        </div>
      </div>
    </div>
  </div>
</section>

<main class="wrap">
  <div class="layout">
    ${sidebar(domain, color, levels)}
    <div class="levels">
      ${levels.map((lv, i) => levelCard(domain, lv, i, color, levels)).join('\n')}
    </div>
  </div>
</main>

<footer>
  <div class="wrap">
    <b style="color:#d8e6d8">Her Çocuk Matematik Öğrenebilir</b> · DokunSay — ${esc(domain.name)} yörüngesi ·
    <a href="/yorunge/">Tüm yörüngeler</a> · <a href="/">Araçlar</a>
    <p class="foot-note">Düzey adları ve sıralaması Clements &amp; Sarama öğrenme yörüngeleri ([LT]², learningtrajectories.org) çerçevesinden uyarlanmıştır. Yaş bantları olasılıksal alt-sınır niteliğinde illüstratiftir; tanı eşiği değildir. Çocuğu sınıfına göre değil, bulunduğu basamağa göre destekleyin.</p>
  </div>
</footer>

<script>
(function(){
  // Scrollspy — kenar çubuğunda etkin düzeyi vurgula
  var links = Array.prototype.slice.call(document.querySelectorAll('.side-list a'));
  var byId = {}; links.forEach(function(a){ byId[a.getAttribute('href').slice(1)] = a; });
  var spy = new IntersectionObserver(function(es){
    es.forEach(function(e){
      if(e.isIntersecting){
        links.forEach(function(l){ l.classList.remove('act'); });
        var a = byId[e.target.id]; if(a){ a.classList.add('act');
          // kenar çubuğunu etkin öğeye kaydır
          var sl = a.closest('.side-list'); if(sl){ var r=a.offsetTop - sl.offsetTop; if(r<sl.scrollTop||r>sl.scrollTop+sl.clientHeight-40) sl.scrollTop=r-12; }
        }
      }
    });
  }, { rootMargin:'-45% 0px -50% 0px', threshold:0 });
  document.querySelectorAll('.level').forEach(function(l){ spy.observe(l); });

  // Tek kart yazdır
  function printOne(i){
    var card = document.getElementById('lv-'+i); if(!card) return;
    document.body.classList.add('printing-one'); card.classList.add('print-target');
    window.print();
  }
  window.addEventListener('afterprint', function(){
    document.body.classList.remove('printing-one');
    var t=document.querySelector('.print-target'); if(t) t.classList.remove('print-target');
  });
  document.querySelectorAll('.printcard').forEach(function(b){
    b.addEventListener('click', function(){ printOne(b.getAttribute('data-lv')); });
  });
  var pa=document.getElementById('printAll'); if(pa) pa.addEventListener('click', function(){ window.print(); });
})();
</script>
</body>
</html>`
}

// ════════════════════════════════════════════════════════════════════════
// Üret + yaz
// ════════════════════════════════════════════════════════════════════════
function writePage(dirBase, key, html) {
  const dir = join(dirBase, key)
  mkdirSync(dir, { recursive: true })
  writeFileSync(join(dir, 'index.html'), html, 'utf8')
}

let n = 0, enriched = 0
for (const domain of DOMAINS) {
  const html = page(domain)
  writePage(OUT_PUBLIC, domain.key, html)
  if (existsSync(OUT_DIST)) writePage(OUT_DIST, domain.key, html) // dist-site varsa hızlı deploy için de yaz
  n++
  if (enrichOf(domain.key, 0)) enriched++
  const kb = (Buffer.byteLength(html) / 1024).toFixed(0)
  console.log(`  ✓ /yorunge/${domain.key}/  (${domain.levels.length} düzey, ${kb}KB)${enrichOf(domain.key, 0) ? ' ★ zengin' : ''}`)
}
console.log(`\n${n} yörünge sayfası üretildi (${enriched} zenginleştirilmiş). Kaynak: ${OUT_PUBLIC}`)
if (!existsSync(OUT_DIST)) console.log('Not: dist-site/ yok — yalnız public/ yazıldı. Deploy öncesi build-site veya kopyala.')
