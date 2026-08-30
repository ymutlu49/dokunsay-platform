// ════════════════════════════════════════════════════════════════════════
// DOKUNSAY MATERYAL GÖRSELLERİ — çalışma yapraklarında YALNIZCA gerçek
// DokunSay materyallerinin birebir çizimlerini kullanmak için.
// ────────────────────────────────────────────────────────────────────────
// Renkler/oranlar uygulama kaynaklarından alınmıştır:
//   Bar    → amber çubuk (gradient #fde047→#f59e0b→#78350f) + koyu soketler;
//            üzerine renkli PUL (mavi #3b82f6 / kırmızı #dc2626 / yeşil #22c55e
//            / sarı #eab308) yerleşir. Nokta kalıbı = mavi noktalar.
//   Basamak→ birlik küp #d97706, onluk çubuk #ea580c (10 bölmeli), yüzlük #2563eb
//   Kesir  → kırmızı (#ef4444) bölünmüş çubuk + pasta daire
//   Geo    → turkuaz kimlik; kategori renkleri (üçgen #f59e0b, dörtgen #3b82f6,
//            çokgen #8b5cf6, daire #10b981)
// Kaynak: DokunSayBar/dokun-say-bars.jsx · DokunSayBasamak/constants ·
//         DokunSayKesir · Dokunsay-geo/constants/palette.js
// ════════════════════════════════════════════════════════════════════════

let _uid = 0
const uid = () => 'ds' + (++_uid)
const wrap = (W, H, body, cls = '') => `<svg viewBox="0 0 ${W} ${H}" width="${Math.round(W)}" height="${Math.round(H)}" class="ws-svg ${cls}" xmlns="http://www.w3.org/2000/svg" role="img" preserveAspectRatio="xMidYMid meet">${body}</svg>`

// Amber "materyal" gradyanı + koyu soket gradyanı (her SVG'ye benzersiz id)
const amberDefs = (g) => `<defs><linearGradient id="${g}a" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#fde047"/><stop offset="32%" stop-color="#f59e0b"/><stop offset="100%" stop-color="#78350f"/></linearGradient><radialGradient id="${g}h" cx=".42" cy=".36" r=".7"><stop offset="0%" stop-color="#3a3a3a"/><stop offset="100%" stop-color="#000"/></radialGradient></defs>`

// Pul (chip) renkleri — uygulamadaki birebir
const CHIP = { blue: ['#3b82f6', '#1e40af', '#fff'], red: ['#dc2626', '#991b1b', '#fff'], green: ['#22c55e', '#15803d', '#fff'], yellow: ['#eab308', '#a16207', '#422006'] }
export const chipDisc = (cx, cy, r, color = 'blue', label = null) => {
  const [c, b, tx] = CHIP[color] || CHIP.blue
  let s = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${c}" stroke="${b}" stroke-width="2"/><circle cx="${cx - r * 0.22}" cy="${cy - r * 0.26}" r="${r * 0.3}" fill="rgba(255,255,255,.35)"/>`
  if (label != null) s += `<text x="${cx}" y="${cy + r * 0.4}" font-size="${Math.round(r * (String(label).length > 1 ? 0.85 : 1.15))}" font-weight="900" text-anchor="middle" fill="${tx}" font-family="Poppins,sans-serif">${label}</text>`
  return s
}

// ── Sayı Çubuğu (rod): amber çubuk + n koyu soket; fill kadar PUL dolu ─────
export function dsRod(n, { fill = null, chip = 'blue', label = false } = {}) {
  const U = 30, H = 36, r = 10.5, pad = 5
  const W = n * U + pad * 2
  const g = uid()
  let s = amberDefs(g) + `<rect x="2" y="2" width="${W - 4}" height="${H - 4}" rx="9" fill="url(#${g}a)" stroke="#78350f" stroke-width="2.5"/>`
  for (let i = 0; i < n; i++) {
    const cx = pad + i * U + U / 2, cy = H / 2
    s += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#${g}h)" stroke="rgba(0,0,0,.5)" stroke-width="1.5"/>`
    if (fill != null && i < fill) s += chipDisc(cx, cy, r - 0.5, chip)
  }
  if (label) s += `<text x="${W / 2}" y="${H - 3}" font-size="9" font-weight="800" text-anchor="middle" fill="rgba(120,53,15,.65)" font-family="Poppins,sans-serif">${n}</text>`
  return wrap(W, H, s)
}

// İki çubuğu üst üste (uzunluk/çokluk karşılaştırma) — sol uçtan hizalı
export function dsRodPair(a, b, { fillA = null, fillB = null } = {}) {
  const U = 28, H = 32, r = 9.5, pad = 4, gap = 12, maxN = Math.max(a, b)
  const W = maxN * U + pad * 2, totalH = H * 2 + gap
  const g = uid()
  const one = (n, oy, fill) => {
    let s = `<rect x="2" y="${oy + 2}" width="${n * U + pad * 2 - 4}" height="${H - 4}" rx="8" fill="url(#${g}a)" stroke="#78350f" stroke-width="2.5"/>`
    for (let i = 0; i < n; i++) { const cx = pad + i * U + U / 2, cy = oy + H / 2; s += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#${g}h)" stroke="rgba(0,0,0,.5)" stroke-width="1.4"/>`; if (fill != null && i < fill) s += chipDisc(cx, cy, r - 0.5, 'blue') }
    return s
  }
  return wrap(W, totalH, amberDefs(g) + one(a, 0, fillA) + one(b, H + gap, fillB), 'ws-tall')
}

// ── Kart (frame): amber kart + rows×cols soket; fill kadar PUL dolu ────────
export function dsFrame(rows, cols, fill = 0, chip = 'blue') {
  const FC = 30, FP = 5, r = 10.5
  const W = cols * FC + FP * 2, H = rows * FC + FP * 2
  const g = uid()
  let s = amberDefs(g) + `<rect x="2" y="2" width="${W - 4}" height="${H - 4}" rx="9" fill="url(#${g}a)" stroke="#78350f" stroke-width="2.5"/>`
  let k = 0
  for (let rr = 0; rr < rows; rr++) for (let c = 0; c < cols; c++) {
    const cx = FP + c * FC + FC / 2, cy = FP + rr * FC + FC / 2
    s += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#${g}h)" stroke="rgba(0,0,0,.45)" stroke-width="1.5"/>`
    if (k < fill) s += chipDisc(cx, cy, r - 0.5, chip)
    k++
  }
  return wrap(W, H, s, rows > 1 ? 'ws-tall' : '')
}

// Serbest pullar (rod olmadan; birleştirme/karşılaştırma) — satır(lar)
export function dsChips(n, color = 'blue', perRow = 6) {
  const D = 26, gap = 7, rows = Math.ceil(n / perRow), cols = Math.min(n, perRow)
  const W = cols * (D + gap) + gap, H = rows * (D + gap) + gap, r = D / 2
  let s = ''
  for (let i = 0; i < n; i++) { const col = i % perRow, row = Math.floor(i / perRow); s += chipDisc(gap + r + col * (D + gap), gap + r + row * (D + gap), r, color) }
  return wrap(W, H, s)
}

// İki renkli pul grubu (parça-bütün / iki toplanan)
export function dsChipsTwo(a, b) {
  const D = 26, gap = 7, gGap = 18, r = D / 2
  const W = (a + b) * (D + gap) + gGap + gap, H = D + 2 * gap
  let s = '', x = gap + r
  for (let i = 0; i < a; i++) { s += chipDisc(x, H / 2, r, 'blue'); x += D + gap }
  x += gGap
  for (let i = 0; i < b; i++) { s += chipDisc(x, H / 2, r, 'red'); x += D + gap }
  return wrap(W, H, s)
}

// Tek pul (etiketli olabilir — sayı/işlem pulu)
export function dsChip(color = 'blue', label = null, size = 30) {
  const r = size / 2
  return wrap(size, size, chipDisc(r, r, r - 1.5, color, label))
}

// ── Nokta Kalıbı (DotPrev): krem kart + mavi nokta deseni (parlamalı) ──────
const DOTPAT = { 1: [[.5, .5]], 2: [[.3, .3], [.7, .7]], 3: [[.26, .26], [.5, .5], [.74, .74]], 4: [[.3, .3], [.7, .3], [.3, .7], [.7, .7]], 5: [[.26, .26], [.74, .26], [.5, .5], [.26, .74], [.74, .74]], 6: [[.3, .25], [.7, .25], [.3, .5], [.7, .5], [.3, .75], [.7, .75]] }
export function dsDotCard(n) {
  if (n <= 0) { const S = 84; return wrap(S, S, `<rect x="2" y="2" width="${S - 4}" height="${S - 4}" rx="11" fill="#fffdf7" stroke="#d4c9a8" stroke-width="2" stroke-dasharray="6 4"/>`) } // boş kart (çocuk çizecek)
  if (n > 6) return dsFrame(n > 10 ? 2 : 1, n > 10 ? 5 : n <= 5 ? n : 5, n) // büyük sayılar → onluk kart
  const S = 84, r = S * 0.085
  let s = `<rect x="2" y="2" width="${S - 4}" height="${S - 4}" rx="11" fill="#fffdf7" stroke="#d4c9a8" stroke-width="2"/>`
  ;(DOTPAT[n] || DOTPAT[6]).forEach(([x, y]) => { const cx = x * S, cy = y * S; s += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#3b82f6" stroke="#1e40af" stroke-width="1.6"/><circle cx="${cx - r * 0.24}" cy="${cy - r * 0.28}" r="${r * 0.32}" fill="rgba(255,255,255,.4)"/>` })
  return wrap(S, S, s)
}

// ── Basamak blokları (place value) — birebir uygulama renkleri ────────────
export function dsBaseten(tens, ones) {
  const TW = 13, TH = 84, gap = 6, OC = 13, ocgap = 3
  const tensW = tens * (TW + gap), onesW = 2 * (OC + ocgap)
  const W = tensW + (tens ? 10 : 0) + onesW + 8, H = TH + 6
  let s = '', x = 4
  for (let t = 0; t < tens; t++) {
    s += `<rect x="${x}" y="3" width="${TW}" height="${TH}" rx="2.5" fill="#ea580c" stroke="#c2410c" stroke-width="1.5"/>`
    for (let k = 1; k < 10; k++) s += `<line x1="${x}" y1="${3 + k * TH / 10}" x2="${x + TW}" y2="${3 + k * TH / 10}" stroke="#fff" stroke-width="0.9" opacity=".55"/>`
    x += TW + gap
  }
  x += tens ? 10 : 0
  const oRows = Math.ceil(ones / 2), baseY = 3 + TH - oRows * (OC + ocgap)
  for (let o = 0; o < ones; o++) { const col = o % 2, row = Math.floor(o / 2); s += `<rect x="${x + col * (OC + ocgap)}" y="${baseY + row * (OC + ocgap)}" width="${OC}" height="${OC}" rx="2" fill="#d97706" stroke="#92400e" stroke-width="1.4"/>` }
  return wrap(W, H, s, 'ws-tall')
}

// ── Kesir (DokunSay Kesir) — kırmızı bölünmüş çubuk + pasta daire ──────────
const KRED = '#ef4444', KB = '#b91c1c'
export function dsFractionBar(num, den) {
  const W = 252, H = 46, cw = W / den
  let s = ''
  for (let i = 0; i < den; i++) s += `<rect x="${i * cw}" y="2" width="${cw}" height="${H - 4}" fill="${i < num ? KRED : '#fffdf7'}" stroke="${KB}" stroke-width="2"/>`
  return wrap(W, H, s)
}
export function dsFractionCircle(num, den) {
  const S = 92, m = S / 2, r = m - 6
  let s = `<circle cx="${m}" cy="${m}" r="${r}" fill="#fffdf7" stroke="${KB}" stroke-width="2.5"/>`
  if (den === 1) s = `<circle cx="${m}" cy="${m}" r="${r}" fill="${num >= 1 ? KRED : '#fffdf7'}" stroke="${KB}" stroke-width="2.5"/>`
  else for (let i = 0; i < den; i++) {
    const a0 = (i / den) * 2 * Math.PI - Math.PI / 2, a1 = ((i + 1) / den) * 2 * Math.PI - Math.PI / 2
    const x0 = m + r * Math.cos(a0), y0 = m + r * Math.sin(a0), x1 = m + r * Math.cos(a1), y1 = m + r * Math.sin(a1)
    s += `<path d="M${m} ${m} L${x0} ${y0} A${r} ${r} 0 0 1 ${x1} ${y1} Z" fill="${i < num ? KRED : '#fffdf7'}" stroke="${KB}" stroke-width="2"/>`
  }
  return wrap(S, S, s, 'ws-frac')
}

// ── Birim küpler (Basamak birlik küpü #d97706) — alan/hacim ölçme ─────────
export function dsCubeGrid(rows, cols, fill = -1) {
  const C = 20, W = cols * C + 4, H = rows * C + 4
  let s = '', k = 0
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) { const on = fill < 0 || k < fill; s += `<rect x="${2 + c * C}" y="${2 + r * C}" width="${C}" height="${C}" rx="2.5" fill="${on ? '#d97706' : '#fffdf7'}" stroke="#92400e" stroke-width="1.5"/>`; k++ }
  return wrap(W, H, s, rows > 1 ? 'ws-tall' : '')
}
export function dsCubeGridPair(a, b) {
  const C = 17, gapX = 26, w1 = a.c * C, w2 = b.c * C
  const W = w1 + gapX + w2 + 6, H = Math.max(a.r, b.r) * C + 4
  const grid = (g, ox) => { let o = ''; for (let r = 0; r < g.r; r++) for (let c = 0; c < g.c; c++) o += `<rect x="${ox + c * C}" y="${2 + r * C}" width="${C}" height="${C}" rx="2" fill="#d97706" stroke="#92400e" stroke-width="1.4"/>`; return o }
  return wrap(W, H, grid(a, 2) + grid(b, 2 + w1 + gapX), 'ws-tall')
}
// Birim küp kulesi (hacim/kapasite) — dikey yığın
export function dsCubeStack(n) {
  const C = 20, W = C + 4, H = n * C + 4
  let s = ''
  for (let i = 0; i < n; i++) s += `<rect x="2" y="${2 + (n - 1 - i) * C}" width="${C}" height="${C}" rx="2.5" fill="#d97706" stroke="#92400e" stroke-width="1.5"/>`
  return wrap(W, H, s, 'ws-tall')
}

// ── Geo (DokunSay Geo) — kategori renkli şekiller, koyu kenar ──────────────
const GEO = { triangle: ['#f59e0b', '#b45309'], square: ['#3b82f6', '#1e40af'], rect: ['#3b82f6', '#1e40af'], pentagon: ['#8b5cf6', '#5b21b6'], hexagon: ['#8b5cf6', '#5b21b6'], circle: ['#10b981', '#065f46'], diamond: ['#3b82f6', '#1e40af'], star: ['#8b5cf6', '#5b21b6'] }
export function dsShape(kind, { fill = true, S = 56 } = {}) {
  const [c, b] = GEO[kind] || GEO.triangle, m = S / 2
  const f = fill ? c : '#fffdf7', sw = 2.6
  const paths = {
    triangle: `<polygon points="${m},6 ${S - 6},${S - 7} 6,${S - 7}" fill="${f}" stroke="${b}" stroke-width="${sw}" stroke-linejoin="round"/>`,
    square: `<rect x="6" y="6" width="${S - 12}" height="${S - 12}" rx="3" fill="${f}" stroke="${b}" stroke-width="${sw}"/>`,
    rect: `<rect x="4" y="13" width="${S - 8}" height="${S - 26}" rx="3" fill="${f}" stroke="${b}" stroke-width="${sw}"/>`,
    circle: `<circle cx="${m}" cy="${m}" r="${m - 6}" fill="${f}" stroke="${b}" stroke-width="${sw}"/>`,
    pentagon: `<polygon points="${m},6 ${S - 7},${S * 0.4} ${S * 0.8},${S - 7} ${S * 0.2},${S - 7} 7,${S * 0.4}" fill="${f}" stroke="${b}" stroke-width="${sw}" stroke-linejoin="round"/>`,
    hexagon: `<polygon points="${m},6 ${S - 8},${S * 0.3} ${S - 8},${S * 0.7} ${m},${S - 6} 8,${S * 0.7} 8,${S * 0.3}" fill="${f}" stroke="${b}" stroke-width="${sw}" stroke-linejoin="round"/>`,
    diamond: `<polygon points="${m},5 ${S - 5},${m} ${m},${S - 5} 5,${m}" fill="${f}" stroke="${b}" stroke-width="${sw}" stroke-linejoin="round"/>`,
    star: `<path d="M${m} 6 L${m + 10} ${m - 5} L${S - 6} ${m - 4} L${m + 6} ${m + 7} L${m + 12} ${S - 6} L${m} ${m + 12} L${m - 12} ${S - 6} L${m - 6} ${m + 7} L6 ${m - 4} L${m - 10} ${m - 5} Z" fill="${f}" stroke="${b}" stroke-width="${sw}" stroke-linejoin="round"/>`,
  }
  return `<svg viewBox="0 0 ${S} ${S}" class="ws-glyph" xmlns="http://www.w3.org/2000/svg" role="img">${paths[kind] || paths.triangle}</svg>`
}
export const dsShapeRow = (kinds, fill = false) => `<div class="pat-row">${kinds.map((k) => `<span class="pat-c">${dsShape(k, { fill })}</span>`).join('')}</div>`

// ── Geo: açı (turkuaz kollar, tepe noktası) ───────────────────────────────
export function dsAngle(deg, len = 64) {
  const W = 150, H = 84, ox = 16, oy = 68, rad = deg * Math.PI / 180, c = '#14b8a6'
  const x2 = ox + len * Math.cos(-rad), y2 = oy + len * Math.sin(-rad)
  let s = `<line x1="${ox}" y1="${oy}" x2="${ox + len}" y2="${oy}" stroke="${c}" stroke-width="4" stroke-linecap="round"/><line x1="${ox}" y1="${oy}" x2="${x2}" y2="${y2}" stroke="${c}" stroke-width="4" stroke-linecap="round"/><circle cx="${ox}" cy="${oy}" r="4.5" fill="#0f766e"/>`
  return wrap(W, H, s, 'ws-tall')
}
export function dsAnglePair(d1, d2) {
  const W = 272, H = 84, c = '#14b8a6'
  const one = (deg, ox) => { const oy = 68, len = 58, rad = deg * Math.PI / 180, x2 = ox + len * Math.cos(-rad), y2 = oy + len * Math.sin(-rad); return `<line x1="${ox}" y1="${oy}" x2="${ox + len}" y2="${oy}" stroke="${c}" stroke-width="4" stroke-linecap="round"/><line x1="${ox}" y1="${oy}" x2="${x2}" y2="${y2}" stroke="${c}" stroke-width="4" stroke-linecap="round"/><circle cx="${ox}" cy="${oy}" r="4.5" fill="#0f766e"/>` }
  return wrap(W, H, one(d1, 20) + one(d2, 154), 'ws-tall')
}

// ── Sayı doğrusu (DokunSay Tam — mor kimlik) ──────────────────────────────
export function dsNumberLine(max, { at = [], missing = [], jump = null } = {}) {
  const W = 420, H = jump ? 74 : 56, x0 = 22, x1 = W - 22, y = jump ? 54 : 34, span = x1 - x0, PUR = '#8b5cf6', PURD = '#6d28d9'
  const step = max <= 10 ? 1 : max <= 20 ? 2 : Math.ceil(max / 20)
  const px = (v) => x0 + span * v / max
  let s = `<line x1="${x0}" y1="${y}" x2="${x1}" y2="${y}" stroke="${PURD}" stroke-width="3"/><polygon points="${x1},${y} ${x1 - 9},${y - 5} ${x1 - 9},${y + 5}" fill="${PURD}"/>`
  for (let v = 0; v <= max; v += step) {
    s += `<line x1="${px(v)}" y1="${y - 6}" x2="${px(v)}" y2="${y + 6}" stroke="${PUR}" stroke-width="2"/>`
    if (missing.includes(v)) s += `<rect x="${px(v) - 12}" y="${y + 9}" width="24" height="24" rx="5" fill="#fff" stroke="${PUR}" stroke-width="1.6" stroke-dasharray="4 3"/>`
    else s += `<text x="${px(v)}" y="${y + 23}" font-size="14" fill="#5b21b6" text-anchor="middle" font-family="Poppins,sans-serif" font-weight="600">${v}</text>`
  }
  if (jump) { const a = px(jump.from), b = px(jump.to); s += `<path d="M ${a} ${y - 4} Q ${(a + b) / 2} ${y - 34} ${b} ${y - 4}" fill="none" stroke="#ec4899" stroke-width="2.5"/><polygon points="${b},${y - 4} ${b - 6},${y - 13} ${b + 6},${y - 12}" fill="#ec4899"/>` }
  for (const a of at) s += `<circle cx="${px(a)}" cy="${y}" r="6.5" fill="${PUR}" stroke="${PURD}" stroke-width="1.6"/>`
  return wrap(W, H, s, 'ws-tall')
}
// İşlem pulları dizisi — yeşil sayı pulları + sarı işlem pulları + boş hedef pul
export function dsEqChips(parts) {
  const D = 36, gap = 8, r = D / 2, W = parts.length * (D + gap) + gap, H = D + gap * 2
  let x = gap + r, s = ''
  parts.forEach((p) => {
    const cy = H / 2
    if (p.blank) s += `<circle cx="${x}" cy="${cy}" r="${r}" fill="#fff" stroke="#15803d" stroke-width="2.5" stroke-dasharray="5 3"/>`
    else if (p.op != null) s += chipDisc(x, cy, r, 'yellow', p.op)
    else s += chipDisc(x, cy, r, 'green', p.n)
    x += D + gap
  })
  return wrap(W, H, s)
}
// ── Geoboard (DokunSay Geo — turkuaz çivi ızgarası + lastik şekil) ─────────
export function dsGeoboard(rows, cols, poly = null) {
  const G = 26, pad = 14, W = (cols - 1) * G + pad * 2, H = (rows - 1) * G + pad * 2, TQ = '#14b8a6'
  let s = `<rect x="2" y="2" width="${W - 4}" height="${H - 4}" rx="8" fill="#f0fdfa" stroke="#99f6e4" stroke-width="2"/>`
  if (poly && poly.length > 1) { const pts = poly.map(([r, c]) => `${pad + c * G},${pad + r * G}`).join(' '); s += `<polygon points="${pts}" fill="${TQ}" fill-opacity=".22" stroke="${TQ}" stroke-width="2.5" stroke-linejoin="round"/>` }
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) s += `<circle cx="${pad + c * G}" cy="${pad + r * G}" r="3.3" fill="#0f766e"/>`
  return wrap(W, H, s, 'ws-tall')
}
// ── Ölçüm cetveli (DokunSay Bar çubuğu — birim numaralı) ───────────────────
export function dsRuler(n) {
  const U = 30, H = 30, pad = 5, W = n * U + pad * 2, g = uid()
  let s = amberDefs(g) + `<rect x="2" y="2" width="${W - 4}" height="${H - 4}" rx="6" fill="url(#${g}a)" stroke="#78350f" stroke-width="2"/>`
  for (let i = 0; i <= n; i++) { const x = pad + i * U; s += `<line x1="${x}" y1="2" x2="${x}" y2="${H - 2}" stroke="#78350f" stroke-width="1.4" opacity=".7"/>`; if (i < n) s += `<text x="${x + U / 2}" y="${H - 7}" font-size="11" fill="#5b2c06" text-anchor="middle" font-family="Poppins,sans-serif" font-weight="700">${i + 1}</text>` }
  return wrap(W, H, s)
}
// Ölçülecek nesne (cetvel üstünde) — kaç birim?
export function dsMeasureOnRuler(objLen, rulerN) {
  const U = 30, pad = 5, H = 54, W = rulerN * U + pad * 2, g = uid()
  let s = amberDefs(g)
  s += `<rect x="${pad}" y="3" width="${objLen * U}" height="18" rx="4" fill="#0d9488" stroke="#0f766e" stroke-width="2"/>` // ölçülecek nesne (teal)
  s += `<rect x="2" y="26" width="${W - 4}" height="24" rx="5" fill="url(#${g}a)" stroke="#78350f" stroke-width="2"/>`
  for (let i = 0; i <= rulerN; i++) { const x = pad + i * U; s += `<line x1="${x}" y1="26" x2="${x}" y2="50" stroke="#78350f" stroke-width="1.3" opacity=".7"/>`; if (i < rulerN) s += `<text x="${x + U / 2}" y="${46}" font-size="10" fill="#5b2c06" text-anchor="middle" font-family="Poppins,sans-serif" font-weight="700">${i + 1}</text>` }
  return wrap(W, H, s, 'ws-tall')
}

// ── Veri (DokunSay Veri) — pembe sıralama/kutu ────────────────────────────
export function dsSortGroups(kinds) {
  // şekilleri pembe çerçeveli iki kutu üstünde göster (sınıflama)
  return `<div class="pat-row">${kinds.map((k) => `<span class="pat-c">${dsShape(k, { fill: false })}</span>`).join('')}</div>`
}
