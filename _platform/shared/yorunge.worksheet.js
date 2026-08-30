// ════════════════════════════════════════════════════════════════════════
// ÇALIŞMA YAPRAĞI MOTORU — DokunSay Öğrenme Yörüngeleri
// ────────────────────────────────────────────────────────────────────────
// Her yörünge düzeyi için ÇOCUĞA YÖNELİK, baskı-optimize bir çalışma yaprağı
// gövdesi üretir. Pedagojik omurga: CRA (Somut → Temsilî → Soyut) + açık,
// yapılandırılmış öğretim + sayı duyusu odağı. Diskalkuli/disleksi-dostu.
//
// Kaynak veri: trajectories.data.js (düzey: n/lo/hi/b/q/d/iv) + enrich-*.js
//   (how/teacher/act[materials·steps·criterion·easy·hard]/viz/tool).
//
// Dışa açılanlar:
//   craIndex(lv)                      → 0 Somut · 1 Temsilî · 2 Soyut (odak basamak)
//   childObjective(lv, en)            → çocuk-dostu hedef cümlesi
//   methodSteps(domain, lv, en)       → CRA 3 adımı (somut→çiz→yaz) [{t,d}]
//   buildExample(domain,i,lv,en,c)    → modellenmiş örnek {q,vis,ans}
//   buildExercises(domain,i,lv,en,c)  → [{q,vis,ans}] kademeli alıştırmalar
//   SVG helpers (test/yeniden kullanım için de açık)
// ════════════════════════════════════════════════════════════════════════

export const esc = (s) =>
  String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

// ── Renk paleti (iki-renkli parça-bütün için) ─────────────────────────────
const AMBER = '#f59e0b', TEAL = '#0d9488', VIOLET = '#7c3aed'
const PAIR = [AMBER, TEAL]
const INK_DOT = '#475569'

const DOMAIN_TOOL = { sub: 'bar', count: 'bar', comp: 'bar', add: 'bar', compose: 'bar', multdiv: 'bar', frac: 'kesir', pattern: 'bar', shape2d: 'geo', comp2d: 'geo', disembed: 'geo', shape3d: 'geo', comp3d: 'geo', spviz: 'geo', sporient: 'geo', mlen: 'bar', marea: 'bar', mvol: 'bar', mang: 'geo', classif: 'veri' }
const TOOL_NAME = { bar: 'DokunSay Bar', basamak: 'DokunSay Basamak', clock: 'DokunSay Clock', kesir: 'DokunSay Kesir', tam: 'DokunSay Tam', geo: 'DokunSay Geo', veri: 'DokunSay Veri' }
export const toolOf = (domain, en) => (en && en.tool) || DOMAIN_TOOL[domain.key] || 'bar'
export const toolName = (domain, en) => TOOL_NAME[toolOf(domain, en)] || 'DokunSay Bar'

// Yaprakta gösterilecek araç ADRESİ — dizin adları YAYINDAKİ hâliyle yazılmıştır.
// DİKKAT: geo ve veri, diğerlerinden FARKLI adlandırılmış (küçük 's', '-app' eki).
// `ls DokunSay*` taraması bu ikisini atlar; adresler dist-site çıktısından ve canlı
// 200 yanıtından doğrulanarak alındı. Eksik anahtar = bağlantı hiç basılmaz.
const TOOL_DIR = {
  bar: 'DokunSayBar', basamak: 'DokunSayBasamak', clock: 'DokunSayClock',
  kesir: 'DokunSayKesir', tam: 'DokunSayTam',
  geo: 'Dokunsay-geo', veri: 'Dokunsay-veri-app',
}
export const toolUrl = (domain, en) => {
  const d = TOOL_DIR[toolOf(domain, en)]
  return d ? `https://dokunsay.com/${d}/` : ''
}

// ════════════════════════════════════════════════════════════════════════
// SVG ALIŞTIRMA GÖRSELLERİ (baskı-dostu; viewBox tabanlı, CSS ile ölçeklenir)
// ════════════════════════════════════════════════════════════════════════
const DOT = (x, y, r, c, stroke) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}"${stroke ? ` stroke="${stroke}" stroke-width="1.5"` : ''}/>`
// width/height içsel olarak verilir → SVG doğal boyutunda render edilir (konteynere
// kadar şişmez); .ws-svg{max-width:100%} dar ekranda küçültür.
const wrap = (W, H, body, cls = '') => `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" class="ws-svg ${cls}" xmlns="http://www.w3.org/2000/svg" role="img" preserveAspectRatio="xMidYMid meet">${body}</svg>`

// Zar/düzenli nokta dizilimi (sanbil) — 1..6 kanonik, üstü çerçeveye düşer
const PIPS = {
  1: [[.5, .5]], 2: [[.3, .3], [.7, .7]], 3: [[.26, .26], [.5, .5], [.74, .74]],
  4: [[.3, .3], [.7, .3], [.3, .7], [.7, .7]], 5: [[.26, .26], [.74, .26], [.5, .5], [.26, .74], [.74, .74]],
  6: [[.3, .24], [.7, .24], [.3, .5], [.7, .5], [.3, .76], [.7, .76]],
}
export function svgDie(n, c = AMBER, W = 130, H = 130) {
  const s = Math.min(W, H) * 0.82, ox = (W - s) / 2, oy = (H - s) / 2, r = s * 0.092
  const pts = PIPS[n] || PIPS[6]
  const frame = `<rect x="${ox}" y="${oy}" width="${s}" height="${s}" rx="${s * 0.14}" fill="#fff" stroke="#cbd5e1" stroke-width="2"/>`
  return wrap(W, H, frame + pts.map(([x, y]) => DOT(ox + x * s, oy + y * s, r, c)).join(''))
}

// Satır(lar) hâlinde nesneler — saymak için net dizilim (satır başına ≤5)
export function svgRowDots(n, c = AMBER, perRow = 5) {
  const r = 14, gap = 12, rows = Math.ceil(n / perRow)
  const cols = Math.min(n, perRow)
  const W = cols * (2 * r + gap) + gap, H = rows * (2 * r + gap) + gap
  let out = '', k = 0
  for (let row = 0; row < rows; row++) {
    const inRow = Math.min(perRow, n - row * perRow)
    for (let col = 0; col < inRow; col++) {
      out += DOT(gap + r + col * (2 * r + gap), gap + r + row * (2 * r + gap), r, c)
      k++
    }
  }
  return wrap(W, H, out)
}

// İki renkli grup (parça-bütün / kavramsal sanbil)
export function svgGroups(groups, cols = PAIR) {
  const r = 13, gap = 9, gGap = 22
  const total = groups.reduce((a, g) => a + g, 0)
  const W = total * (2 * r + gap) + (groups.length - 1) * gGap + gap, H = 2 * r + 2 * gap
  let x = gap + r, out = ''
  groups.forEach((g, gi) => { for (let i = 0; i < g; i++) { out += DOT(x, H / 2, r, cols[gi % cols.length]); x += 2 * r + gap } x += gGap })
  return wrap(W, H, out)
}

// Onluk çerçeve (2×5). filled=dolu nokta sayısı; frames=çerçeve sayısı.
// blank=true → tüm hücreler boş (çocuk çizecek/dolduracak).
export function svgTenFrame(filled, c = AMBER, frames = 1, blank = false) {
  const cell = 30, gap = 4, fw = 5 * cell + 6 * gap, fh = 2 * cell + 3 * gap, fGap = 18
  const W = frames * fw + (frames - 1) * fGap + 8, H = fh + 8, oy = 4
  let out = '', left = filled
  for (let f = 0; f < frames; f++) {
    const ox = 4 + f * (fw + fGap)
    out += `<rect x="${ox}" y="${oy}" width="${fw}" height="${fh}" rx="7" fill="#fff" stroke="#94a3b8" stroke-width="2"/>`
    for (let col = 1; col < 5; col++) out += `<line x1="${ox + gap + col * (cell + gap) - gap / 2}" y1="${oy + gap}" x2="${ox + gap + col * (cell + gap) - gap / 2}" y2="${oy + fh - gap}" stroke="#e2e8f0" stroke-width="1.5"/>`
    out += `<line x1="${ox + gap}" y1="${oy + fh / 2}" x2="${ox + fw - gap}" y2="${oy + fh / 2}" stroke="#94a3b8" stroke-width="1.5"/>`
    for (let row = 0; row < 2; row++) for (let col = 0; col < 5; col++) {
      const cx = ox + gap + col * (cell + gap) + cell / 2, cy = oy + gap + row * (cell + gap) + cell / 2
      if (!blank && left > 0) { out += DOT(cx, cy, cell * 0.36, c); left-- }
    }
  }
  return wrap(W, H, out)
}

// Basamak değeri: onluk çubuklar + birlik küpler
export function svgBaseTen(tens, ones, c = TEAL) {
  const rodW = 18, rodH = 96, gap = 8, cube = 18, cgap = 5
  const tensW = tens * (rodW + gap), oRows = Math.ceil(Math.max(ones, 1) / 2)
  const W = tensW + 18 + 2 * (cube + cgap) + 12, H = rodH + 16, oy = 8
  let out = '', x = 6
  for (let t = 0; t < tens; t++) {
    out += `<rect x="${x}" y="${oy}" width="${rodW}" height="${rodH}" rx="3" fill="${c}"/>`
    for (let s = 1; s < 10; s++) out += `<line x1="${x}" y1="${oy + s * rodH / 10}" x2="${x + rodW}" y2="${oy + s * rodH / 10}" stroke="#fff" stroke-width="1" opacity=".5"/>`
    x += rodW + gap
  }
  x += 12
  const baseY = oy + rodH - oRows * (cube + cgap)
  for (let o = 0; o < ones; o++) { const col = o % 2, row = Math.floor(o / 2); out += `<rect x="${x + col * (cube + cgap)}" y="${baseY + row * (cube + cgap)}" width="${cube}" height="${cube}" rx="3" fill="${AMBER}"/>` }
  return wrap(W, H, out)
}

// Dizi (array) r×c — eşit gruplar / çarpma
export function svgArray(r, cN, c = AMBER) {
  const rad = 12, gap = 12, W = cN * (2 * rad + gap) + gap, H = r * (2 * rad + gap) + gap
  let out = ''
  for (let i = 0; i < r; i++) for (let j = 0; j < cN; j++) out += DOT(gap + rad + j * (2 * rad + gap), gap + rad + i * (2 * rad + gap), rad, c)
  return wrap(W, H, out)
}

// Sayı doğrusu 0..max. marks=etiketli değerler; missing=kutuyla gösterilecek (boş) değerler; jump={from,to}
export function svgNumberLine(max, { marks = null, missing = [], jump = null } = {}) {
  const W = 460, H = jump ? 96 : 78, x0 = 24, x1 = W - 24, y = jump ? 64 : 50, span = x1 - x0
  const step = max <= 10 ? 1 : max <= 20 ? 1 : Math.ceil(max / 20)
  const px = (v) => x0 + (span * v) / max
  let out = `<line x1="${x0}" y1="${y}" x2="${x1}" y2="${y}" stroke="#64748b" stroke-width="2.5"/><polygon points="${x1},${y} ${x1 - 10},${y - 6} ${x1 - 10},${y + 6}" fill="#64748b"/>`
  const show = marks || Array.from({ length: Math.floor(max / step) + 1 }, (_, i) => i * step)
  for (let v = 0; v <= max; v += step) {
    const isMiss = missing.includes(v)
    out += `<line x1="${px(v)}" y1="${y - 7}" x2="${px(v)}" y2="${y + 7}" stroke="#94a3b8" stroke-width="2"/>`
    if (isMiss) out += `<rect x="${px(v) - 13}" y="${y + 12}" width="26" height="26" rx="5" fill="#fff" stroke="#94a3b8" stroke-width="1.6" stroke-dasharray="4 3"/>`
    else if (show.includes(v)) out += `<text x="${px(v)}" y="${y + 30}" font-size="17" fill="#334155" text-anchor="middle" font-family="Poppins,sans-serif" font-weight="600">${v}</text>`
  }
  if (jump) {
    const a = px(jump.from), b = px(jump.to)
    out += `<path d="M ${a} ${y - 4} Q ${(a + b) / 2} ${y - 40} ${b} ${y - 4}" fill="none" stroke="${VIOLET}" stroke-width="2.5"/><polygon points="${b},${y - 4} ${b - 7},${y - 14} ${b + 6},${y - 13}" fill="${VIOLET}"/>`
    out += DOT(a, y, 6, VIOLET) + DOT(b, y, 6, AMBER)
  }
  return wrap(W, H, out)
}

// İki çokluğu yan yana (karşılaştırma) — çocuk yuvarlayacak
export function svgCompareGroups(a, b, c = AMBER) {
  const r = 12, gap = 7, maxN = Math.max(a, b, 1), per = 5
  const colW = per * (2 * r + gap) + 24, H = Math.ceil(maxN / per) * (2 * r + gap) + 40, W = colW * 2 + 30
  const draw = (n, ox) => { let o = ''; for (let i = 0; i < n; i++) { const col = i % per, row = Math.floor(i / per); o += DOT(ox + 14 + r + col * (2 * r + gap), 14 + r + row * (2 * r + gap), r, c) } return o }
  let out = `<rect x="2" y="6" width="${colW}" height="${H - 12}" rx="12" fill="#fff" stroke="#cbd5e1" stroke-width="2"/>`
  out += `<rect x="${colW + 28}" y="6" width="${colW}" height="${H - 12}" rx="12" fill="#fff" stroke="#cbd5e1" stroke-width="2"/>`
  out += draw(a, 2) + draw(b, colW + 28)
  return wrap(W, H, out)
}

// Birleştirme a + b (toplama görseli)
export function svgCombine(a, b) {
  const r = 13, gap = 8, plusW = 38, per = 5
  const wOf = (n) => Math.min(n, per) * (2 * r + gap) + gap
  const rowsOf = (n) => Math.ceil(n / per)
  const W = wOf(a) + plusW + wOf(b) + 8, H = Math.max(rowsOf(a), rowsOf(b)) * (2 * r + gap) + gap + 6, cy = H / 2
  const draw = (n, ox, col) => { let o = ''; for (let i = 0; i < n; i++) { const c = i % per, row = Math.floor(i / per); o += DOT(ox + r + gap + c * (2 * r + gap), gap + r + row * (2 * r + gap), r, col) } return o }
  let out = draw(a, 0, PAIR[0])
  out += `<text x="${wOf(a) + plusW / 2}" y="${cy + 9}" font-size="30" fill="#0f172a" text-anchor="middle" font-family="Poppins,sans-serif" font-weight="700">+</text>`
  out += draw(b, wOf(a) + plusW, PAIR[1])
  return wrap(W, H, out)
}

// Çıkarma: n nesne, sonuncusu/birkaçı "üstü çizili" (çocuk çizecek diye boş bırakılır → cross=0)
export function svgTakeAway(n, take, c = AMBER) {
  const r = 13, gap = 9, per = 6
  const W = Math.min(n, per) * (2 * r + gap) + gap, H = Math.ceil(n / per) * (2 * r + gap) + gap
  let out = ''
  for (let i = 0; i < n; i++) {
    const col = i % per, row = Math.floor(i / per), x = gap + r + col * (2 * r + gap), y = gap + r + row * (2 * r + gap)
    out += DOT(x, y, r, i >= n - take ? '#e2e8f0' : c)
    if (i >= n - take) out += `<line x1="${x - r}" y1="${y - r}" x2="${x + r}" y2="${y + r}" stroke="#ef4444" stroke-width="2.5"/><line x1="${x - r}" y1="${y + r}" x2="${x + r}" y2="${y - r}" stroke="#ef4444" stroke-width="2.5"/>`
  }
  return wrap(W, H, out)
}

// Parça-bütün / sayı bağı şeması. whole/parts → null olan kutu boş gelir.
export function svgNumberBond(whole, parts) {
  const W = 230, H = 150, cx = W / 2, c = AMBER
  const node = (x, y, val, big) => {
    const r = big ? 34 : 30
    return `<circle cx="${x}" cy="${y}" r="${r}" fill="${big ? '#fff' : '#fff'}" stroke="${val == null ? '#94a3b8' : c}" stroke-width="2.5"${val == null ? ' stroke-dasharray="6 4"' : ''}/>` +
      (val == null ? '' : `<text x="${x}" y="${y + 11}" font-size="30" fill="#0f172a" text-anchor="middle" font-family="Poppins,sans-serif" font-weight="700">${val}</text>`)
  }
  const wx = cx, wy = 40, p1x = cx - 64, p2x = cx + 64, py = 118
  let out = `<line x1="${wx}" y1="${wy + 26}" x2="${p1x}" y2="${py - 24}" stroke="#cbd5e1" stroke-width="2.5"/><line x1="${wx}" y1="${wy + 26}" x2="${p2x}" y2="${py - 24}" stroke="#cbd5e1" stroke-width="2.5"/>`
  out += node(wx, wy, whole, true) + node(p1x, py, parts[0]) + node(p2x, py, parts[1])
  return wrap(W, H, out)
}

// ── Şekil glifleri (geometri/örüntü/sınıflama) ────────────────────────────
export function glyph(shape, c = AMBER, fill = true, S = 56) {
  const f = fill ? c : 'none', sw = fill ? 0 : 2.5, st = fill ? 'none' : c, m = S / 2
  const g = {
    circle: `<circle cx="${m}" cy="${m}" r="${m - 6}" fill="${f}" stroke="${st}" stroke-width="${sw}"/>`,
    square: `<rect x="6" y="6" width="${S - 12}" height="${S - 12}" rx="4" fill="${f}" stroke="${st}" stroke-width="${sw}"/>`,
    triangle: `<polygon points="${m},6 ${S - 6},${S - 6} 6,${S - 6}" fill="${f}" stroke="${st}" stroke-width="${sw}" stroke-linejoin="round"/>`,
    rect: `<rect x="4" y="14" width="${S - 8}" height="${S - 28}" rx="4" fill="${f}" stroke="${st}" stroke-width="${sw}"/>`,
    star: `<path d="M${m} 6 L${m + 11} ${m - 6} L${S - 6} ${m - 4} L${m + 7} ${m + 8} L${m + 14} ${S - 6} L${m} ${m + 14} L${m - 14} ${S - 6} L${m - 7} ${m + 8} L6 ${m - 4} L${m - 11} ${m - 6} Z" fill="${f}" stroke="${st}" stroke-width="${sw}" stroke-linejoin="round"/>`,
    heart: `<path d="M${m} ${S - 10} C 6 ${m - 2}, 10 10, ${m} 18 C ${S - 10} 10, ${S - 6} ${m - 2}, ${m} ${S - 10} Z" fill="${f}" stroke="${st}" stroke-width="${sw}"/>`,
    diamond: `<polygon points="${m},6 ${S - 6},${m} ${m},${S - 6} 6,${m}" fill="${f}" stroke="${st}" stroke-width="${sw}" stroke-linejoin="round"/>`,
    hexagon: `<polygon points="${m},6 ${S - 8},${S * 0.3} ${S - 8},${S * 0.7} ${m},${S - 6} 8,${S * 0.7} 8,${S * 0.3}" fill="${f}" stroke="${st}" stroke-width="${sw}" stroke-linejoin="round"/>`,
  }
  return `<svg viewBox="0 0 ${S} ${S}" class="ws-glyph" xmlns="http://www.w3.org/2000/svg" role="img">${g[shape] || g.circle}</svg>`
}

// Kesir: bir bütünü n parçaya böl, k tanesini boya (shade). shape: 'circle'|'bar'
export function svgFraction(num, den, shape = 'circle', c = AMBER) {
  if (shape === 'bar') {
    const W = 300, H = 64, cw = W / den
    let out = ''
    for (let i = 0; i < den; i++) out += `<rect x="${i * cw}" y="2" width="${cw}" height="${H - 4}" fill="${i < num ? c : '#fff'}" stroke="#475569" stroke-width="2"/>`
    return wrap(W, H, out)
  }
  const S = 150, m = S / 2, r = m - 8
  let out = `<circle cx="${m}" cy="${m}" r="${r}" fill="#fff" stroke="#475569" stroke-width="2.5"/>`
  for (let i = 0; i < den; i++) {
    const a0 = (i / den) * 2 * Math.PI - Math.PI / 2, a1 = ((i + 1) / den) * 2 * Math.PI - Math.PI / 2
    const x0 = m + r * Math.cos(a0), y0 = m + r * Math.sin(a0), x1 = m + r * Math.cos(a1), y1 = m + r * Math.sin(a1)
    const large = (a1 - a0) > Math.PI ? 1 : 0
    if (den > 1) out += `<path d="M${m} ${m} L${x0} ${y0} A${r} ${r} 0 ${large} 1 ${x1} ${y1} Z" fill="${i < num ? c : '#fff'}" stroke="#475569" stroke-width="2"/>`
  }
  if (den === 1) out = `<circle cx="${m}" cy="${m}" r="${r}" fill="${num >= 1 ? c : '#fff'}" stroke="#475569" stroke-width="2.5"/>`
  return wrap(S, S, out, 'ws-frac')
}

// ── Ölçme: uzunluk çubukları (farklı boyda yatay çubuklar) ────────────────
export function svgBars(lengths, c = TEAL, units = false) {
  const u = 24, h = 16, gap = 12, maxL = Math.max(...lengths, 1)
  const W = maxL * u + 14, H = lengths.length * (h + gap) + gap
  let out = ''
  lengths.forEach((L, i) => {
    const y = gap + i * (h + gap)
    out += `<rect x="6" y="${y}" width="${L * u}" height="${h}" rx="4" fill="${c}"/>`
    if (units) for (let k = 1; k < L; k++) out += `<line x1="${6 + k * u}" y1="${y}" x2="${6 + k * u}" y2="${y + h}" stroke="#fff" stroke-width="1.6" opacity=".75"/>`
  })
  return wrap(W, H, out, lengths.length > 1 ? 'ws-tall' : '')
}
// ── Ölçme: alan ızgarası (satır×sütun kareler; shaded kadarı boyalı) ───────
export function svgAreaGrid(rows, cols, shaded = 0, c = TEAL) {
  const cell = 19, W = cols * cell + 4, H = rows * cell + 4
  let out = '', k = 0
  for (let r = 0; r < rows; r++) for (let col = 0; col < cols; col++) { out += `<rect x="${2 + col * cell}" y="${2 + r * cell}" width="${cell}" height="${cell}" fill="${k < shaded ? c : '#fff'}" stroke="#94a3b8" stroke-width="1.3"/>`; k++ }
  return wrap(W, H, out, rows > 1 ? 'ws-tall' : '')
}
// İki şekli yan yana karşılaştırmak için (alan/genişlik) ───────────────────
export function svgGridPair(a, b, c = TEAL) {
  const cell = 17, gapX = 28, w1 = a.c * cell, w2 = b.c * cell
  const W = w1 + gapX + w2 + 8, H = Math.max(a.r, b.r) * cell + 8
  const grid = (g, ox) => { let o = ''; for (let r = 0; r < g.r; r++) for (let col = 0; col < g.c; col++) o += `<rect x="${ox + col * cell}" y="${4 + r * cell}" width="${cell}" height="${cell}" fill="${c}" fill-opacity=".55" stroke="#475569" stroke-width="1.3"/>`; return o }
  return wrap(W, H, grid(a, 4) + grid(b, 4 + w1 + gapX), 'ws-tall')
}
// ── Ölçme: açı (tepe noktasından iki kol) ─────────────────────────────────
export function svgAngle(deg, c = VIOLET, len = 66) {
  const W = 150, H = 86, ox = 16, oy = 70, rad = deg * Math.PI / 180
  const x2 = ox + len * Math.cos(-rad), y2 = oy + len * Math.sin(-rad)
  let out = `<path d="M ${ox + 26} ${oy} A 26 26 0 0 0 ${ox + 26 * Math.cos(-rad)} ${oy - 26 * Math.sin(rad)}" fill="none" stroke="#cbd5e1" stroke-width="2"/>`
  out += `<line x1="${ox}" y1="${oy}" x2="${ox + len}" y2="${oy}" stroke="${c}" stroke-width="3.5" stroke-linecap="round"/>`
  out += `<line x1="${ox}" y1="${oy}" x2="${x2}" y2="${y2}" stroke="${c}" stroke-width="3.5" stroke-linecap="round"/>`
  out += DOT(ox, oy, 4, c)
  return wrap(W, H, out, 'ws-tall')
}
export function svgAnglePair(d1, d2, c = VIOLET) {
  const W = 272, H = 84
  const one = (deg, ox) => { const oy = 68, len = 60, rad = deg * Math.PI / 180; const x2 = ox + len * Math.cos(-rad), y2 = oy + len * Math.sin(-rad); return `<line x1="${ox}" y1="${oy}" x2="${ox + len}" y2="${oy}" stroke="${c}" stroke-width="3.5" stroke-linecap="round"/><line x1="${ox}" y1="${oy}" x2="${x2}" y2="${y2}" stroke="${c}" stroke-width="3.5" stroke-linecap="round"/>${DOT(ox, oy, 4, c)}` }
  return wrap(W, H, one(d1, 22) + one(d2, 156), 'ws-tall')
}
// ── Ölçme: kap (sıvı/hacim, dolu seviyesi) ────────────────────────────────
export function svgContainer(fillFrac, c = '#2563eb', wide = 0) {
  const W = 66 + wide, H = 96, top = 12, bot = H - 8, left = 12, right = W - 12
  const fh = (bot - top) * Math.max(0, Math.min(1, fillFrac))
  let out = `<path d="M${left} ${top} L${right} ${top} L${right - 3} ${bot} L${left + 3} ${bot} Z" fill="#fff" stroke="#475569" stroke-width="2"/>`
  if (fh > 0) out += `<rect x="${left + 2}" y="${bot - fh}" width="${right - left - 4}" height="${fh}" fill="${c}" fill-opacity=".5"/>`
  return wrap(W, H, out, 'ws-tall')
}
export function svgContainerPair(f1, f2, c = '#2563eb') {
  const big = svgContainer(f1, c, 0), sm = svgContainer(f2, c, 20)
  return `<span style="display:inline-flex;gap:24px;align-items:flex-end">${big}${sm}</span>`
}
// Birden çok glif satırı (eşleme/sınıflama/şekil tanıma için)
export function glyphRow(items, c = AMBER, fill = false) {
  return `<div class="pat-row">${items.map((s) => `<span class="pat-c">${glyph(s, c, fill)}</span>`).join('')}</div>`
}

// ════════════════════════════════════════════════════════════════════════
// YANIT ALANLARI (HTML — yazmak için net, büyük)
// ════════════════════════════════════════════════════════════════════════
export const wbox = (hint = '') => `<span class="wbox"${hint ? ` data-h="${esc(hint)}"` : ''}></span>`
export const wboxBig = () => `<span class="wbox wbox-lg"></span>`
const eqRow = (html) => `<div class="eqrow">${html}</div>`
const writeLines = (n = 1) => `<div class="wlines">${Array.from({ length: n }, () => '<span class="wline"></span>').join('')}</div>`
const circleHint = (txt) => `<p class="ans-hint">○ ${esc(txt)}</p>`

// ════════════════════════════════════════════════════════════════════════
// CRA odak basamağı + çocuk hedefi + yöntem adımları
// ════════════════════════════════════════════════════════════════════════
export const CRA = ['Somut', 'Temsilî', 'Soyut']
export function craIndex(lv) {
  const hi = lv.hi || 60
  const txt = (lv.n + ' ' + (lv.d || '')).toLowerCase()
  const abstract = /(yaz|rakam|yazıl|basamak değer|sembol|denklem|çok basamak|işlem|türet)/.test(txt)
  const concrete = /(nesne|pul|blok|parmak|somut|dokun|oluştur|ver)/.test(txt)
  if (hi <= 48) return 0
  if (hi >= 96 || (abstract && hi >= 78)) return 2
  if (concrete && hi <= 60) return 0
  return 1
}

// Çocuğa/yetişkine okunacak kısa hedef — düzeyin "d"sinden sadeleştirilmiş
export function childObjective(lv, en) {
  // "Bu düzeyde çocuk:" betimini koruyup kısaltıyoruz; ilk cümle yeterli.
  //
  // KISALTMA TUZAĞI: "örn." / "vb." içindeki nokta cümle sonu DEĞİLDİR. Eski
  // bölme bunu bilmediği için beş yaprakta hedef "…(örn." diye yarım basılmıştı
  // (frac#5/#8, pattern#1, sub#9/#10 — içerik denetiminde yakalandı). Kısaltma
  // noktaları bölmeden önce geçici işaretlenir, sonra geri çevrilir.
  const ham = (lv.d || '').replace(/(örn|vb|vs|bkz|ör)\./gi, '$1')
  let d = ((ham.split(/(?<=[.!?])\s/)[0] || ham).trim()).replace(//g, '.')
  if (d.length > 155) {
    d = d.slice(0, 150).replace(/\s+\S*$/, '') // baskıda tek A4'e sığsın
    // Kırpma AÇIK PARANTEZ ortasında bitmesin: "(kenarların…" gibi yarım kalıntı
    // 4 yaprakta basılmıştı (shape2d#9/14/16/20). Kapanmamış parantez varsa
    // parantezden önce kes; yarım bağlaç/virgül kuyruğunu da temizle.
    const ac = d.lastIndexOf('('), kapa = d.lastIndexOf(')')
    if (ac > kapa) d = d.slice(0, ac).trimEnd()
    d = d.replace(/[,;—–:-]\s*$/, '').trimEnd() + '…'
  }
  return d
}

// Kâğıt-kalem öncesi düzey (≤3 yaş "Temeller" / erken): çocuk YAZMAZ; yetişkin
// yönlendirir, çocuk katılır. Yaprak bir "birlikte oyna + gözle" rehberidir.
export function isPlayLevel(lv) { return (lv.hi || 60) <= 36 }

// Öğretim yöntemi omurgası. Oyun düzeyinde Oyna→Söyle→Gözle; sonra CRA.
export function methodSteps(domain, lv, en) {
  const tn = toolName(domain, en)
  const a = en && en.act
  if (isPlayLevel(lv)) return [
    { t: 'Oyna', d: `${tn} ya da günlük nesnelerle birlikte oynayın` + (a && a.materials && a.materials[0] ? ` — ${a.materials[0]}.` : '.') },
    { t: 'Söyle', d: 'Sayıları/sözcükleri yüksek sesle ve ritimle siz söyleyin; çocuk katılsın.' },
    { t: 'Gözle', d: 'Tepkisini gözleyin — bu yaşta yazı/çizim beklenmez, deneyim önemlidir.' },
  ]
  return [
    { t: 'Somut', d: `Önce ${tn} ile elle yap` + (a && a.materials && a.materials[0] ? ` — ${a.materials[0]}.` : '.') },
    { t: 'Temsilî', d: 'Sonra bu sayfadaki resimlerle göster: say, çiz, eşle, yuvarla.' },
    { t: 'Soyut', d: 'En sonda sayıyı/işareti kendin yaz.' },
  ]
}

// Oyun düzeyi için "birlikte oyna" adımları (act.steps) — çocuk-yazısı yok
export function buildPlay(domain, i, lv, en) {
  const a = en && en.act, steps = (a && a.steps) || []
  if (steps.length) return steps.map((s) => item(s))
  return [item(childObjective(lv, en))]
}

// ════════════════════════════════════════════════════════════════════════
// ALIŞTIRMA ÜRETİMİ — alana göre
// ════════════════════════════════════════════════════════════════════════
const asN = (q, fb) => (typeof q === 'number' ? q : Array.isArray(q) ? q[0] : fb)
const anchorN = (lv, en, fb) => (en && en.viz && typeof en.viz.n === 'number' ? en.viz.n : asN(lv.q, fb))
const clampN = (n, lo, hi) => Math.max(lo, Math.min(hi, n))
const item = (q, vis, ans) => ({ q, vis: vis || '', ans: ans || '' })

// ── Saymadan Anlık Bilme (Sanbil) ─────────────────────────────────────────
function subEx(i, lv, en, c) {
  const n = clampN(anchorN(lv, en, i + 1), 1, 10)
  const out = []
  if (n <= 6 && i <= 5) {
    out.push(item('Saymadan, bir bakışta kaç tane? Sayıyı yaz.', svgDie(n, c), wbox()))
    out.push(item('Bu da kaç? (Hızlıca bak, sonra kapat.)', svgDie(clampN(n + 1, 1, 6), c), wbox()))
    out.push(item(`Sen de ${n} noktayı zarın üstüne çiz.`, svgDie(0, c), circleHint('noktaları kendin çiz')))
  } else {
    const a = Math.max(1, Math.floor(n / 2)), b = n - a
    out.push(item('Bir bakışta kaç? Saymadan söyle, sonra yaz.', svgGroups([a, b]), wbox()))
    out.push(item('Onluk çerçeveye bak: kaç dolu?', svgTenFrame(n, c, n > 10 ? 2 : 1), wbox()))
    out.push(item(`"${Math.min(a, b)} ile ${Math.max(a, b)} gördüm — hepsi ___" Boşluğu doldur.`, svgGroups([a, b]), wbox()))
  }
  return out
}

// ── Sayma ──────────────────────────────────────────────────────────────────
function countEx(i, lv, en, c) {
  const out = []
  const v = en && en.viz
  const n = clampN(anchorN(lv, en, 5), 2, 20)
  if (v && v.t === 'baseten') {
    out.push(item('Kaç onluk, kaç birlik? Sayıyı yaz.', svgBaseTen(v.tens, v.ones, TEAL), eqRow(`${wbox('onluk')} onluk ${wbox('birlik')} birlik = ${wboxBig()}`)))
    out.push(item('Bu sayıyı bloklarla say: önce onluklar, sonra birlikler.', svgBaseTen(clampN(v.tens, 1, 4), clampN(v.ones + 1, 0, 9), TEAL), wboxBig()))
  } else if (v && v.t === 'numline') {
    const max = v.max || 10
    out.push(item('Sayı doğrusunda eksik sayıları kutulara yaz.', svgNumberLine(max, { missing: [Math.floor(max / 2), Math.max(1, max - 2)] }), ''))
    out.push(item('Oktan sonra gelen sayıyı yaz, parmağınla ilerle.', svgNumberLine(max, { missing: [] }), eqRow(`${(v.hi || 3)} → sonra ${wbox()} → sonra ${wbox()}`)))
  } else {
    out.push(item('Say ve kaç tane olduğunu yaz. Her birine dokun!', svgRowDots(n, c), wbox()))
    out.push(item('Onluk çerçeveyi doldur: kaç dolu, kaç boş?', svgTenFrame(clampN(n, 1, 10), c), eqRow(`dolu ${wbox()}  ·  boş ${wbox()}`)))
    out.push(item(`Sen ${clampN(n + 1, 1, 10)} tane nokta çiz.`, svgTenFrame(0, c, 1, true), circleHint('çerçeveye kendin çiz')))
  }
  // sıralama / ezber dizisi
  if (i >= 1 && i <= 12) out.push(item('Eksik sayıları sırayla yaz.', '', eqRow(seqWithGaps(Math.max(1, Math.round((lv.lo || 24) / 12) - 1)))))
  return out
}
function seqWithGaps(start) {
  const s = Math.max(1, start)
  return [s, s + 1, '__', s + 3, '__'].map((x) => x === '__' ? wbox() : `<span class="seqn">${x}</span>`).join('<span class="seqsep">,</span>')
}

// ── Karşılaştırma ve Sıralama ──────────────────────────────────────────────
function compEx(i, lv, en, c) {
  const out = []
  const a = clampN(asN(lv.q, 4) + (i % 2), 2, 9), b = clampN(a + 1 + (i % 2), 2, 10)
  out.push(item('Hangi tarafta DAHA ÇOK var? O kutuyu yuvarlak içine al.', svgCompareGroups(a, b, c), circleHint('çok olan kutuyu yuvarla')))
  out.push(item('Sayıların arasına > , < ya da = yaz.', '', eqRow(`<span class="bignum">${b}</span> ${wbox()} <span class="bignum">${a}</span>`)))
  out.push(item('Hangisi DAHA AZ? Az olanı yuvarla.', svgCompareGroups(b - 1, a, c), circleHint('az olan kutuyu yuvarla')))
  if (i >= 4) out.push(item('Sayıları küçükten büyüğe sırala.', '', eqRow(`${shuffleNums([a, b, b + 2, a - 1])} → ${wbox()} ${wbox()} ${wbox()} ${wbox()}`)))
  return out
}
function shuffleNums(arr) {
  const u = [...new Set(arr.filter((x) => x > 0))]
  return u.map((x) => `<span class="bignum sm">${x}</span>`).join(' ')
}

// ── Toplama ve Çıkarma ─────────────────────────────────────────────────────
function addEx(i, lv, en, c) {
  const out = []
  const a = clampN(asN(lv.q, 2) + (i % 3), 1, 9), b = clampN(2 + (i % 3), 1, 9)
  out.push(item('Birleştir: hepsi kaç oldu? Say ve yaz.', svgCombine(a, b), eqRow(`<span class="bignum">${a}</span> + <span class="bignum">${b}</span> = ${wboxBig()}`)))
  const tot = clampN(a + b + 1, 3, 10), take = clampN(b, 1, tot - 1)
  out.push(item('Üstü çizilenleri çıkar: kaç KALDI?', svgTakeAway(tot, take, c), eqRow(`<span class="bignum">${tot}</span> − <span class="bignum">${take}</span> = ${wboxBig()}`)))
  if (i >= 4) out.push(item('Eksik parçayı bul (kutuya yaz).', svgNumberBond(a + b, [a, null]), eqRow(`<span class="bignum">${a}</span> + ${wbox()} = <span class="bignum">${a + b}</span>`)))
  else out.push(item('Sayı bağını tamamla: bütün kaç?', svgNumberBond(null, [a, b]), wboxBig()))
  return out
}

// ── Sayı Birleştirme (parça-bütün) ─────────────────────────────────────────
function composeEx(i, lv, en, c) {
  const whole = clampN((en && en.viz && en.viz.n) || (4 + i), 3, 18)
  const p1 = Math.max(1, Math.floor(whole / 2))
  return [
    item(`${whole} sayısını iki parçaya ayır: bir yol göster.`, svgNumberBond(whole, [p1, whole - p1]), ''),
    item('Eksik parçayı yaz.', svgNumberBond(whole, [Math.max(1, whole - 3), null]), eqRow(`${Math.max(1, whole - 3)} + ${wbox()} = ${whole}`)),
    item(`${whole} için BAŞKA bir ayırma daha yaz.`, svgNumberBond(whole, [null, null]), eqRow(`${wbox()} + ${wbox()} = ${whole}`)),
  ]
}

// ── Çarpma ve Bölme ─────────────────────────────────────────────────────────
function multdivEx(i, lv, en, c) {
  const r = clampN(2 + (i % 3), 2, 5), cN = clampN(3 + (i % 3), 2, 6)
  return [
    item('Kaç grup var, her grupta kaç tane? Topla.', svgArray(r, cN, c), eqRow(`${r} grup × ${cN} = ${wboxBig()}`)),
    item('Ritmik say (atlayarak): eksik sayıları yaz.', '', eqRow(`${[cN, 2 * cN, '__', 4 * cN].map((x) => x === '__' ? wbox() : `<span class="bignum sm">${x}</span>`).join(' ')}`)),
    item(`${r * cN} taneyi ${r} kişiye eşit paylaştır: her birine kaç düşer?`, svgRowDots(r * cN, c, 6), wbox()),
  ]
}

// ── Kesirler ─────────────────────────────────────────────────────────────────
function fracEx(i, lv, en, c) {
  const den = clampN(2 + (i % 3), 2, 6), num = 1
  return [
    item(`Şeklin ${num}/${den} kadarını boya.`, svgFraction(0, den, 'circle', c), circleHint(`${den} eş parçadan ${num} tanesini boya`)),
    item('Resimdeki boyalı kısım hangi kesir? Yaz.', svgFraction(1, clampN(den + 1, 2, 6), 'bar', c), eqRow(`${wbox()} / ${wbox()}`)),
    item('Bütünü eş parçalara böl (çizgi çiz), sonra yarısını boya.', svgFraction(0, 1, 'bar', c), circleHint('önce ortadan böl, sonra boya')),
  ]
}

// ── Örüntü ───────────────────────────────────────────────────────────────────
function patternEx(i, lv, en, c) {
  const shapes = ['circle', 'square', 'triangle']
  const ab = [shapes[0], shapes[1]], abc = [shapes[0], shapes[1], shapes[2]]
  const seq = i < 4 ? [...ab, ...ab, '?', '?'] : [...abc, ...abc.slice(0, 2), '?', '?']
  const cols = [AMBER, TEAL, VIOLET]
  const row = seq.map((s, k) => s === '?' ? `<span class="pat-q">?</span>` : `<span class="pat-c">${glyph(s, cols[k % 3])}</span>`).join('')
  return [
    item('Örüntü nasıl devam eder? Eksik olanları çiz.', `<div class="pat-row">${row}</div>`, circleHint('son iki kutuyu kendin çiz')),
    item('Sıradaki rengi/şekli söyle, sonra çiz.', `<div class="pat-row">${[...ab, ...ab].map((s) => `<span class="pat-c">${glyph(s, AMBER)}</span>`).join('')}<span class="pat-q">?</span></div>`, ''),
    item('Kendi örüntünü kur (ençok 2 şekil kullan).', '', writeLines(1)),
  ]
}

// ── Ölçme: uzunluk (farklı boyda çubuklar — anlamlı uzunluk görseli) ──────
function mlenEx(i, lv, en, c) {
  return [
    item('Hangi çubuk DAHA UZUN? Onu yuvarla.', svgBars([3, 5], c), circleHint('uzun olanı yuvarla')),
    item('Birimlerle ölç: kaç birim uzun? Say ve yaz.', svgBars([4], c, true), wbox()),
    item('Çubukları KISADAN UZUNA sırala: altlarına 1, 2, 3 yaz.', svgBars([2, 4, 3], c), ''),
  ]
}
// ── Ölçme: alan (kare ızgara — yer kaplama) ───────────────────────────────
function mareaEx(i, lv, en, c) {
  return [
    item('Hangisi DAHA GENİŞ (daha çok kare)? Onu yuvarla.', svgGridPair({ r: 2, c: 2 }, { r: 2, c: 4 }, c), circleHint('geniş olanı yuvarla')),
    item('Şekil kaç kare yer kaplıyor? Kareleri say ve yaz.', svgAreaGrid(2, 3, 6, c), wbox()),
  ]
}
// ── Ölçme: hacim/kapasite (kaplar) ────────────────────────────────────────
function mvolEx(i, lv, en, c) {
  return [
    item('Hangi kapta DAHA ÇOK su var? Onu yuvarla.', svgContainerPair(0.8, 0.35), circleHint('çok olanı yuvarla')),
    item('Bu kabı kaç bardak su doldurur? Tahmin et, yaz.', svgContainer(0.5), wbox()),
  ]
}
// ── Ölçme: açı (kolların açıklığı) ────────────────────────────────────────
function mangEx(i, lv, en, c) {
  return [
    item('Hangi açı DAHA GENİŞ (daha açık)? Onu yuvarla.', svgAnglePair(35, 110, c), circleHint('geniş açıyı yuvarla')),
    item('Bu bir dik açı (tam köşe) mı? "Evet" ya da "Hayır" yaz.', svgAngle(90, c), wbox()),
  ]
}
// ── Geometri: şekil tanıma (2B/3B) ────────────────────────────────────────
function shapeEx(i, lv, en, c) {
  return [
    item('Üçgenleri bul ve boya.', glyphRow(['triangle', 'circle', 'square', 'triangle', 'hexagon', 'circle'], c, false), circleHint('yalnız üçgenleri boya')),
    item('Bu şeklin kaç köşesi, kaç kenarı var? Say ve yaz.', glyph('hexagon', c, false), eqRow(`köşe ${wbox()} · kenar ${wbox()}`)),
    item('Aynı şekilden bir tane de sen çiz.', glyph('square', c, false), ''),
  ]
}
// ── Geometri: şekil kurma/ayırma (comp2d/comp3d) ──────────────────────────
function compShapeEx(i, lv, en, c) {
  return [
    item('Bu iki parçayı birleştirince hangi şekil olur? Çiz.', glyphRow(['triangle', 'triangle'], c, false), ''),
    item('Bu şekli iki eş parçaya ayıran çizgiyi çiz.', glyph('square', c, false), ''),
  ]
}
// ── Geometri: saklı şekli ayırt etme (disembed) ───────────────────────────
function disembedEx(i, lv, en, c) {
  return [
    item('Resimde kaç tane üçgen saklı? Bul ve say.', glyphRow(['triangle', 'diamond', 'triangle'], c, false), wbox()),
    item('Saklı şekli bulup boya.', glyph('star', c, false), circleHint('şekli bulup boya')),
  ]
}
// ── Uzamsal görselleştirme / yön-konum (spviz/sporient) ───────────────────
function spatialEx(i, lv, en, c) {
  return [
    item('Soldaki şeklin AYNISINI yandaki boş kutuya çiz.', glyphRow(['diamond'], c, false), circleHint('aynısını yandaki kutuya çiz')),
    item('Şekli zihninde döndür: hangisi aynı? İşaretle.', glyphRow(['triangle', 'triangle', 'square'], c, false), circleHint('aynı olanı yuvarla')),
  ]
}
// ── Sınıflama (classif) ───────────────────────────────────────────────────
function classifEx(i, lv, en, c) {
  return [
    item('Aynı gruba ait olanları yuvarla (eşle).', glyphRow(['circle', 'square', 'circle', 'triangle', 'square', 'circle'], c, false), circleHint('aynı şekilleri grupla')),
    item('Bunları kaç gruba ayırabilirsin? Grup sayısını yaz.', glyphRow(['circle', 'triangle', 'square'], c, false), wbox()),
  ]
}
// Son çare: etkinliği kaydet
function genericEx(domain, i, lv, en, c) {
  return [item('Bugün yaptığın etkinliği çiz ya da yaz.', '', writeLines(2))]
}

const DISPATCH = {
  sub: subEx, count: countEx, comp: compEx, add: addEx, compose: composeEx, multdiv: multdivEx, frac: fracEx, pattern: patternEx,
  mlen: mlenEx, marea: mareaEx, mvol: mvolEx, mang: mangEx,
  shape2d: shapeEx, shape3d: shapeEx, comp2d: compShapeEx, comp3d: compShapeEx,
  disembed: disembedEx, spviz: spatialEx, sporient: spatialEx, classif: classifEx,
}

// Geniş (tam satır) madde mi? — A4'e sığması için satır bütçesini bununla yönetiriz.
export function exWide(ex) {
  const vis = ex.vis || '', ans = ex.ans || ''
  if (/pat-row|wlines/.test(vis)) return true
  if (/seqn|→/.test(ans)) return true
  const m = vis.match(/viewBox="0 0 (\d+)/)
  return m ? +m[1] > 250 : false
}

// En çok 3 alıştırma + en çok 1 geniş madde → iki sütunda ≤2 satır → tek A4'e sığar.
export function buildExercises(domain, i, lv, en, color) {
  const fn = DISPATCH[domain.key]
  const raw = (fn ? fn(i, lv, en, color) : genericEx(domain, i, lv, en, color)).filter(Boolean)
  const out = []
  let wide = 0
  for (const it of raw) {
    if (exWide(it)) { if (wide >= 1) continue; wide++ }
    out.push(it)
    if (out.length >= 3) break
  }
  return out
}

// Düzeyin kendi viz reçetesinden örnek görseli + cevabı üret (her zaman düzeyle eşleşir)
function vizAnswer(v) {
  if (!v || !v.t) return null
  if (v.t === 'dots') return v.group ? v.group.reduce((a, b) => a + b, 0) : v.n
  if (v.t === 'tenframe' || v.t === 'count') return v.n
  if (v.t === 'baseten') return v.tens * 10 + v.ones
  if (v.t === 'array') return v.r * v.c
  if (v.t === 'combine') return v.a + v.b
  if (v.t === 'numline') return v.hi != null ? v.hi : (v.at && v.at.length ? v.at[v.at.length - 1] : null)
  return null
}
function renderVizWS(v, color) {
  switch (v.t) {
    case 'dots': return v.group ? svgGroups(v.group) : svgDie(v.n, color)
    case 'tenframe': return svgTenFrame(v.n, color, v.frames || 1)
    case 'baseten': return svgBaseTen(v.tens, v.ones, TEAL)
    case 'array': return svgArray(v.r, v.c, color)
    case 'combine': return svgCombine(v.a, v.b)
    case 'count': return svgRowDots(v.n, color)
    case 'numline': return svgNumberLine(v.max || 10, { jump: v.at && v.at.length >= 2 ? { from: v.at[0], to: v.hi != null ? v.hi : v.at[1] } : null })
    default: return null
  }
}
const EG_CAP = {
  dots: 'Saymadan, bir bakışta gördüm.', count: 'Her birine dokunarak saydım.',
  tenframe: 'Onluk çerçeveyi sayıp bütünü buldum.', baseten: 'Önce onlukları, sonra birlikleri saydım.',
  array: 'Grupları topladım (ritmik saydım).', combine: 'İki grubu birleştirip saydım.',
  numline: 'Sayı doğrusunda parmağımla ilerledim.',
}
function egAnsLabel(k, v, ans) {
  if (k === 'count' && v.t === 'baseten') return `${v.tens} onluk ${v.ones} birlik = ${ans}`
  if (k === 'add' && v.t === 'combine') return `${v.a} + ${v.b} = ${ans}`
  if (v.t === 'numline' && v.at && v.at.length >= 2) return `${v.at[0]} → ${ans}`
  return String(ans)
}

// Modellenmiş örnek — önce düzeyin viz'inden, yoksa alana göre elle
export function buildExample(domain, i, lv, en, color) {
  const v = en && en.viz, ans = vizAnswer(v)
  if (v && ans != null) {
    const vis = renderVizWS(v, color)
    if (vis) return item(EG_CAP[v.t] || 'Önce somut yaptım, sonra saydım.', vis, `<b class="ans-shown">${egAnsLabel(domain.key, v, ans)}</b>`)
  }
  const k = domain.key
  if (k === 'sub') return item('Bir bakışta gördüm: <b>3</b>. Saymadım, hemen bildim.', svgDie(3, color), '<b class="ans-shown">3</b>')
  if (k === 'count') return item('Her birine dokunarak saydım: 1, 2, 3, 4. Hepsi <b>4</b>.', svgRowDots(4, color), '<b class="ans-shown">4</b>')
  if (k === 'comp') return item('Soldaki daha çok (5 > 3). Çok olanı yuvarladım.', svgCompareGroups(5, 3, color), '<b class="ans-shown">5 &gt; 3</b>')
  if (k === 'add') return item('2 ile 3’ü birleştirdim, saydım: hepsi <b>5</b>.', svgCombine(2, 3), '<b class="ans-shown">2 + 3 = 5</b>')
  if (k === 'compose') return item('5’i 2 ve 3 diye ayırdım.', svgNumberBond(5, [2, 3]), '<b class="ans-shown">5 = 2 + 3</b>')
  if (k === 'multdiv') return item('2 grup, her grupta 3 → topla: <b>6</b>.', svgArray(2, 3, color), '<b class="ans-shown">2 × 3 = 6</b>')
  if (k === 'frac') return item('Daireyi 4 eş parçaya böldüm, 1’ini boyadım: 1/4.', svgFraction(1, 4, 'circle', color), '<b class="ans-shown">1/4</b>')
  if (k === 'pattern') return item('Örüntü: sarı-mavi, sarı-mavi… sıradaki <b>sarı</b>.', `<div class="pat-row">${['circle', 'square', 'circle', 'square'].map((s, i2) => `<span class="pat-c">${glyph(s, i2 % 2 ? TEAL : AMBER)}</span>`).join('')}</div>`, '<b class="ans-shown">→ sarı</b>')
  if (k === 'mlen') return item('İki çubuğu sol uçtan hizaladım — alttaki daha uzun.', svgBars([3, 5], color), '<b class="ans-shown">alttaki uzun</b>')
  if (k === 'marea') return item('Kareleri saydım — sağdaki daha çok kare kaplıyor.', svgGridPair({ r: 2, c: 2 }, { r: 2, c: 4 }, color), '<b class="ans-shown">sağdaki geniş</b>')
  if (k === 'mvol') return item('Su seviyelerine baktım — soldaki kapta daha çok su var.', svgContainerPair(0.8, 0.35), '<b class="ans-shown">soldaki</b>')
  if (k === 'mang') return item('Kolların açıklığına baktım; uzunlukları değil. Geniş olan daha açık.', svgAnglePair(35, 110, color), '<b class="ans-shown">geniş açı</b>')
  if (k === 'shape2d' || k === 'shape3d') return item('Üçgeni inceledim: 3 köşe, 3 kenar.', glyph('triangle', color, false), '<b class="ans-shown">3 köşe · 3 kenar</b>')
  if (k === 'classif') return item('Daireleri bir araya topladım — aynı şekiller bir grup.', glyphRow(['circle', 'circle'], color, false), '<b class="ans-shown">daireler grubu</b>')
  return null
}
