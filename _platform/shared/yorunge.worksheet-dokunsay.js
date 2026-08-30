// ════════════════════════════════════════════════════════════════════════
// DOKUNSAY MATERYALLİ ÇALIŞMA YAPRAĞI — alıştırma & örnek builder'ları
// ────────────────────────────────────────────────────────────────────────
// Genel sürümle AYNI pedagojik iskelet (CRA, açık öğretim) ama TÜM görseller
// gerçek DokunSay materyalleridir. Builder'lar DÜZEYE GÖRE KADEMELİDİR: her
// düzey, o becerinin gelişimine uygun materyali ve görevi kullanır.
// Materyaller: sayı çubuğu+pul, onluk kart, nokta kartı, Basamak blokları,
// Kesir (kırmızı), Geo şekil/geoboard/açı, sayı doğrusu (Tam, mor),
// sayı+işlem pulları, ölçüm cetveli, birim küp. Ortak yardımcılar (craIndex,
// methodSteps, buildPlay, isPlayLevel) genel modülden yeniden kullanılır.
// ════════════════════════════════════════════════════════════════════════
import {
  dsRod, dsRodPair, dsFrame, dsChips, dsChipsTwo, dsChip, dsDotCard, dsBaseten,
  dsFractionBar, dsFractionCircle, dsShape, dsShapeRow, dsAngle, dsAnglePair,
  dsCubeGrid, dsCubeGridPair, dsCubeStack, dsNumberLine, dsEqChips, dsGeoboard,
  dsRuler, dsMeasureOnRuler,
} from './yorunge.dokunsay-viz.js'
import { DS_EX, DS_EG } from './yorunge.ds-levels.js'

// ── Yanıt alanları (genel modülle aynı sınıflar) ──────────────────────────
const wbox = () => '<span class="wbox"></span>'
const wboxBig = () => '<span class="wbox wbox-lg"></span>'
const eqRow = (h) => `<div class="eqrow">${h}</div>`
const writeLines = (n = 1) => `<div class="wlines">${Array.from({ length: n }, () => '<span class="wline"></span>').join('')}</div>`
const hint = (t) => `<p class="ans-hint">○ ${t}</p>`
const item = (q, vis, ans) => ({ q, vis: vis || '', ans: ans || '' })
const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n))
const asN = (q, fb) => (typeof q === 'number' ? q : Array.isArray(q) ? q[0] : fb)
const anchorN = (lv, en, fb) => (en && en.viz && typeof en.viz.n === 'number' ? en.viz.n : asN(lv.q, fb))
const chipRow = (cols) => `<div class="pat-row">${cols.map((c) => c === '?' ? '<span class="pat-q">?</span>' : `<span class="pat-c">${dsChip(c, null, 30)}</span>`).join('')}</div>`
const shown = (t) => `<b class="ans-shown">${t}</b>`
const hiAge = (lv) => lv.hi || 60

// Sanbil (sub) builder'ı shared/yorunge.ds-levels.js'e taşındı.

// ── Sayma — soket say → pul diz → onluk kart → sayı doğrusu → blok ─────────
function countEx(i, lv, en) {
  const v = en && en.viz
  if (v && v.t === 'baseten') return [
    item('Kaç onluk çubuk, kaç birlik küp? Sayıyı yaz.', dsBaseten(v.tens, v.ones), eqRow(`${wbox()} onluk ${wbox()} birlik = ${wboxBig()}`)),
    item('Bir onluk daha ekle: yeni sayı kaç?', dsBaseten(clamp(v.tens + 1, 1, 5), v.ones), wboxBig()),
  ]
  if (v && v.t === 'numline') { // geriye / N'den sayma → sayı doğrusu
    const max = v.max || 10, from = v.hi != null ? v.hi : Math.floor(max / 2)
    return [
      item('Sayı doğrusunda eksik sayıları kutulara yaz.', dsNumberLine(max, { missing: [clamp(from, 1, max - 1), clamp(max - 2, 1, max)] }), ''),
      item(`${from}’ten bir ileri, bir geri hangi sayı?`, dsNumberLine(max, { at: [from] }), eqRow(`geri ${wbox()} · ${from} · ileri ${wbox()}`)),
    ]
  }
  const n = clamp(anchorN(lv, en, 6), 2, 10)
  if (i <= 4) return [ // erken sayma — çubuğa pul, birebir
    item('Çubuktaki pulları say. Her birine dokun: kaç tane?', dsRod(n, { fill: n }), wbox()),
    item(`Boş çubuğa tam ${n} pul diz (çiz).`, dsRod(n, { fill: 0 }), hint('her sokete bir pul')),
    item('Onluk kartı doldur: kaç dolu, kaç boş?', dsFrame(2, 5, clamp(n, 1, 10)), eqRow(`dolu ${wbox()} · boş ${wbox()}`)),
  ]
  return [ // 10+ / üretme — kart + sayı doğrusu
    item('Onluk karttaki pulları say ve yaz.', dsFrame(2, 5, clamp(n, 1, 10)), wbox()),
    item('Sayı doğrusunda eksik sayıları yaz.', dsNumberLine(clamp(n + 2, 5, 20), { missing: [clamp(n - 1, 1, n), n] }), ''),
    item(`Çubuğa ${clamp(n + 1, 2, 10)} pul diz (çiz).`, dsRod(clamp(n + 1, 2, 10), { fill: 0 }), hint('soketlere pul çiz')),
  ]
}

// ── Karşılaştırma — çubuk → sayı doğrusu → blok (kademeli) ─────────────────
function compEx(i, lv, en) {
  const a = clamp(asN(lv.q, 4) + (i % 2), 2, 9), b = clamp(a + 1 + (i % 2), 2, 10)
  if (hiAge(lv) >= 78) return [ // basamak değeri / zihinsel sayı doğrusu
    item('Hangi sayı DAHA BÜYÜK? Bloklara bak, yuvarla.', dsBaseten(3, 4), eqRow(`<span class="bignum">34</span> ${wbox()} <span class="bignum">29</span>`)),
    item('Sayı doğrusunda 6’ya hangisi daha yakın: 4 mü 9 mu? İşaretle.', dsNumberLine(10, { at: [4, 6, 9] }), hint('yakın olanı yuvarla')),
    item('Sayıları küçükten büyüğe sırala.', '', eqRow(`<span class="bignum sm">27</span> <span class="bignum sm">19</span> <span class="bignum sm">31</span> → ${wbox()} ${wbox()} ${wbox()}`)),
  ]
  return [
    item('Hangi çubukta DAHA ÇOK pul var? Onu yuvarla.', dsRodPair(a, b, { fillA: a, fillB: b }), hint('çok olan çubuğu yuvarla')),
    item('Çubukları say; aralarına > , < ya da = yaz.', '', eqRow(`<span class="bignum">${b}</span> ${wbox()} <span class="bignum">${a}</span>`)),
    item('Sayı doğrusunda iki sayıyı işaretle; hangisi daha büyük?', dsNumberLine(10, { at: [a, b] }), eqRow(`büyük: ${wbox()}`)),
  ]
}

// ── Toplama / Çıkarma — pul → işlem pulları → sayı doğrusu → blok ──────────
function addEx(i, lv, en) {
  const a = clamp(asN(lv.q, 2) + (i % 3), 1, 6), b = clamp(2 + (i % 3), 1, 6)
  const tot = clamp(a + b, 3, 10), take = clamp(b, 1, tot - 1)
  if (hiAge(lv) >= 96) return [ // çok basamaklı → Basamak blokları
    item('Blokları topla: kaç onluk, kaç birlik oldu? Yaz.', dsBaseten(2, 3), eqRow(`23 + 14 = ${wboxBig()}`)),
    item('Sayı doğrusunda onar atlayarak topla.', dsNumberLine(50, { jump: { from: 20, to: 30 } }), eqRow(`20 + 10 = ${wbox()}`)),
  ]
  if (hiAge(lv) >= 72) return [ // sayma stratejileri → sayı doğrusu + işlem pulları
    item('Sayı doğrusunda “üzerine sayarak” topla.', dsNumberLine(15, { jump: { from: a + 1 > 10 ? 7 : a + 2, to: clamp(a + 2 + b, 1, 15) } }), eqRow(`<span class="bignum">${clamp(a + 2, 1, 9)}</span> + <span class="bignum">${b}</span> = ${wboxBig()}`)),
    item('İşlem pullarıyla kur ve sonucu yaz.', dsEqChips([{ n: a }, { op: '+' }, { n: b }, { op: '=' }, { blank: true }]), ''),
    item('Eksik toplananı bul (çubuğa pul ekle).', dsRod(a + b, { fill: a }), eqRow(`<span class="bignum">${a}</span> + ${wbox()} = <span class="bignum">${a + b}</span>`)),
  ]
  return [ // somut — iki renk pul + çubuk
    item('Mavi ve kırmızı pulları birleştir: hepsi kaç?', dsChipsTwo(a, b), eqRow(`<span class="bignum">${a}</span> + <span class="bignum">${b}</span> = ${wboxBig()}`)),
    item(`Çubukta ${tot} pul var. ${take} tanesinin üstünü çiz: kaç KALDI?`, dsRod(tot, { fill: tot }), eqRow(`<span class="bignum">${tot}</span> − <span class="bignum">${take}</span> = ${wboxBig()}`)),
    item('İşlem pullarıyla kur ve sonucu yaz.', dsEqChips([{ n: a }, { op: '+' }, { n: b }, { op: '=' }, { blank: true }]), ''),
  ]
}

// ── Sayı Birleştirme (parça-bütün) — iki renk pul / kart / işlem pulları ───
function composeEx(i, lv, en) {
  const whole = clamp((en && en.viz && en.viz.n) || (4 + i), 3, 10)
  const p1 = Math.max(1, Math.floor(whole / 2))
  return [
    item(`${whole} pulu mavi ve kırmızı diye ayır: bir yol göster.`, dsChipsTwo(p1, whole - p1), eqRow(`${p1} + ${whole - p1} = ${whole}`)),
    item(`${whole} için BAŞKA bir ayırma daha çiz (onluk kart).`, dsFrame(whole > 5 ? 2 : 1, whole > 5 ? 5 : whole, 0), eqRow(`${wbox()} + ${wbox()} = ${whole}`)),
    item('İşlem pullarıyla kur.', dsEqChips([{ n: p1 }, { op: '+' }, { blank: true }, { op: '=' }, { n: whole }]), ''),
  ]
}

// ── Çarpma / Bölme — dizi → sayı doğrusu (ritmik) → paylaştırma ────────────
function multdivEx(i, lv, en) {
  const r = clamp(2 + (i % 3), 2, 4), c = clamp(3 + (i % 3), 2, 5)
  if (i >= 5) return [ // bölme / paylaştırma vurgusu
    item(`${r * c} pulu ${r} kişiye eşit paylaştır: her birine kaç düşer?`, dsChips(r * c, 'blue', c), wbox()),
    item(`Sayı doğrusunda ${c}’şer atlayarak say.`, dsNumberLine(clamp(c * 4, 8, 24), { jump: { from: c, to: c * 2 } }), eqRow(`${c}, ${c * 2}, ${wbox()}, ${wbox()}`)),
  ]
  return [
    item('Kaç sıra, her sırada kaç pul? Topla.', dsFrame(r, c, r * c), eqRow(`${r} × ${c} = ${wboxBig()}`)),
    item(`Sayı doğrusunda ${c}’şer atlayarak say.`, dsNumberLine(clamp(c * 4, 8, 24), { jump: { from: c, to: c * 2 } }), eqRow(`${c}, ${c * 2}, ${wbox()}, ${wbox()}`)),
  ]
}

// ── Kesirler — boya → karşılaştır → sayı doğrusu ───────────────────────────
function fracEx(i, lv, en) {
  const den = clamp(2 + (i % 3), 2, 6)
  if (i >= 6) return [ // karşılaştırma / sayı doğrusu
    item('İki kesir çubuğu: hangisi daha büyük? İşaretle.', `<span style="display:inline-flex;flex-direction:column;gap:6px">${dsFractionBar(1, 2)}${dsFractionBar(1, 4)}</span>`, hint('büyük olanı yuvarla')),
    item('Kesir dairesinin boyalı kısmını yaz.', dsFractionCircle(2, clamp(den + 1, 3, 6)), eqRow(`${wbox()} / ${wbox()}`)),
    item('Kesir çubuğunu eş parçalara böl, 2 parçayı boya.', dsFractionBar(0, 1), hint('önce böl, sonra 2 parça boya')),
  ]
  return [
    item(`Kesir dairesinin 1/${den} kadarını kırmızıya boya.`, dsFractionCircle(0, den), hint(`${den} eş parçadan 1 tanesini boya`)),
    item('Çubukta boyalı kısım hangi kesir? Yaz.', dsFractionBar(1, clamp(den + 1, 2, 6)), eqRow(`${wbox()} / ${wbox()}`)),
    item('Kesir çubuğunu ortadan böl, yarısını boya.', dsFractionBar(0, 1), hint('ikiye böl, 1 parça boya')),
  ]
}

// ── Örüntü — renkli pul örüntüsü → büyüyen örüntü ──────────────────────────
function patternEx(i, lv, en) {
  const ab = ['blue', 'red'], abc = ['blue', 'red', 'green']
  if (i >= 5) return [ // büyüyen / sayı örüntüsü
    item('Büyüyen örüntü: sıradaki grupta kaç pul olur? Çiz.', `<span style="display:inline-flex;gap:14px;align-items:flex-end">${dsChips(1, 'blue', 1)}${dsChips(2, 'blue', 1)}${dsChips(3, 'blue', 1)}</span>`, hint('sonraki grubu çiz')),
    item('Sayı doğrusunda örüntü: eksik sayıları yaz (2’şer).', dsNumberLine(12, { missing: [4, 8] }), ''),
    item('Kendi pul örüntünü kur.', '', writeLines(1)),
  ]
  const seq = i < 3 ? [...ab, ...ab, '?', '?'] : [...abc, ...abc.slice(0, 2), '?', '?']
  return [
    item('Pul örüntüsü nasıl devam eder? Eksik pulları çiz.', chipRow(seq), hint('son iki pulu çiz')),
    item('Sıradaki rengi söyle, sonra çiz.', chipRow([...ab, ...ab, '?']), ''),
    item('Kendi pul örüntünü kur (ençok 2 renk).', '', writeLines(1)),
  ]
}

// ── Geometri: şekil tanıma — geoboard + Geo şekiller ───────────────────────
function shapeEx(i, lv, en) {
  return [
    item('Üçgenleri bul ve boya.', dsShapeRow(['triangle', 'circle', 'square', 'triangle', 'hexagon', 'circle'], false), hint('yalnız üçgenleri boya')),
    item('Geoboard’da bir üçgen kur: 3 çiviyi lastikle birleştir (çiz).', dsGeoboard(4, 4, null), hint('3 çiviyi birleştir')),
    item('Bu şeklin kaç köşesi, kaç kenarı var? Yaz.', dsShape('hexagon', { fill: false }), eqRow(`köşe ${wbox()} · kenar ${wbox()}`)),
  ]
}
function compShapeEx(i, lv, en) {
  return [
    item('İki Geo parçasını birleştirince hangi şekil olur? Çiz.', dsShapeRow(['triangle', 'triangle'], true), ''),
    item('Geoboard’da bir kare kur (4 çiviyi birleştir).', dsGeoboard(4, 4, [[1, 1], [1, 3], [3, 3], [3, 1]]), hint('aynısını çiz')),
    item('Bu şekli iki eş parçaya ayıran çizgiyi çiz.', dsShape('square', { fill: true }), ''),
  ]
}
function disembedEx(i, lv, en) {
  return [
    item('Şekiller iç içe: kaç üçgen saklı? Say.', dsShapeRow(['triangle', 'diamond', 'triangle'], false), wbox()),
    item('Geoboard’daki şekli bul ve boya.', dsGeoboard(4, 4, [[0, 1], [2, 0], [2, 2]]), hint('şekli boya')),
  ]
}
function spatialEx(i, lv, en) {
  return [
    item('Soldaki Geo şeklinin AYNISINI yandaki boşluğa çiz.', dsShapeRow(['diamond'], true), hint('aynısını çiz')),
    item('Geoboard şeklini zihninde döndür, aynısını çiz.', dsGeoboard(4, 4, [[0, 0], [0, 2], [2, 1]]), hint('döndürüp çiz')),
  ]
}
function classifEx(i, lv, en) {
  return [
    item('Aynı Geo şekillerini eşle / aynı gruba ait olanları yuvarla.', dsShapeRow(['circle', 'square', 'circle', 'triangle', 'square', 'circle'], true), hint('aynı şekilleri grupla')),
    item('Bunları kaç gruba ayırabilirsin? Grup sayısını yaz.', dsShapeRow(['circle', 'triangle', 'square'], true), wbox()),
  ]
}

// ── Ölçme — cetvel/çubuk (uzunluk) · birim küp (alan-hacim) · açı ──────────
function mlenEx(i, lv, en) {
  if (i >= 4) return [ // birimle ölçme — DokunSay cetveli
    item('Nesne kaç birim uzun? Cetvelden oku ve yaz.', dsMeasureOnRuler(3, 6), wbox()),
    item('Cetvelle ölç: bu çubuk kaç birim?', dsRuler(5), wbox()),
    item('Hangi çubuk DAHA UZUN? Yuvarla.', dsRodPair(3, 5), hint('uzun olanı yuvarla')),
  ]
  return [
    item('Hangi çubuk DAHA UZUN? Onu yuvarla. (Uçtan hizalı)', dsRodPair(3, 5), hint('uzun olanı yuvarla')),
    item('Çubuk kaç birim uzun? Bölmeleri say ve yaz.', dsRod(4, { fill: 0 }), wbox()),
    item('Çubukları KISADAN UZUNA sırala: altlarına 1, 2, 3 yaz.', dsRodPair(2, 4), ''),
  ]
}
// ALAN = birim KARE, hacim = birim KÜP. Bu yaprakların metni "birim küp" diyordu ama
// çizim düz kare ızgarası; üstelik materyal satırı "birim kareleri" yazıyordu — sayfa
// kendi içinde çelişiyordu. Daha kötüsü, marea yörüngesinin önlemeye çalıştığı yanılgı
// tam da alan/hacim karıştırmasıdır; sayfanın kendisi onu besliyordu.
function mareaEx(i, lv, en) {
  return [
    item('Hangisi DAHA GENİŞ (daha çok birim kare)? Onu yuvarla.', dsCubeGridPair({ r: 2, c: 2 }, { r: 2, c: 4 }), hint('geniş olanı yuvarla')),
    item('Şekil kaç birim kare yer kaplıyor? Say ve yaz.', dsCubeGrid(2, 3), wbox()),
    item('Boş alanı birim karelerle döşe: kaç kare gerekir?', dsCubeGrid(2, 4, 0), wbox()),
  ]
}
function mvolEx(i, lv, en) {
  return [
    item('Hangi kule DAHA ÇOK birim küpten? Onu yuvarla.', `<span style="display:inline-flex;gap:30px;align-items:flex-end">${dsCubeStack(5)}${dsCubeStack(2)}</span>`, hint('çok olanı yuvarla')),
    item('Bu kule kaç birim küp? Say ve yaz.', dsCubeStack(4), wbox()),
  ]
}
function mangEx(i, lv, en) {
  return [
    item('Hangi açı DAHA GENİŞ (daha açık)? Onu yuvarla.', dsAnglePair(35, 110), hint('geniş açıyı yuvarla')),
    item('Bu dik açı (tam köşe) mı? "Evet" ya da "Hayır" yaz.', dsAngle(90), wbox()),
    item('Geoboard’da geniş bir açı kur (çiz).', dsGeoboard(4, 4, [[2, 0], [2, 2], [0, 3]]), hint('kolları çiz')),
  ]
}
function genericEx() { return [item('Bugün DokunSay aracıyla yaptığın etkinliği çiz ya da yaz.', '', writeLines(2))] }

const DISPATCH = {
  // sub artık DS_EX'ten geliyor (ds-levels.js) — burada anahtarı yok.
  count: countEx, comp: compEx, add: addEx, compose: composeEx, multdiv: multdivEx, frac: fracEx, pattern: patternEx,
  mlen: mlenEx, marea: mareaEx, mvol: mvolEx, mang: mangEx,
  shape2d: shapeEx, shape3d: shapeEx, comp2d: compShapeEx, comp3d: compShapeEx,
  disembed: disembedEx, spviz: spatialEx, sporient: spatialEx, classif: classifEx,
}

// exWide (genel modülle aynı kural)
function exWide(ex) {
  const vis = ex.vis || '', ans = ex.ans || ''
  if (/pat-row|wlines/.test(vis)) return true
  if (/seqn|→/.test(ans)) return true
  const m = vis.match(/viewBox="0 0 (\d+)/)
  return m ? +m[1] > 250 : false
}

export function buildExercises(domain, i, lv, en, color) {
  // Düzeye özgü set varsa ONA öncelik ver (yorunge.ds-levels.js). Anahtarı
  // olmayan yörünge eski bant-temelli builder'a düşer — kademeli geçiş.
  const fn = DS_EX[domain.key] || DISPATCH[domain.key]
  const raw = (fn ? fn(i, lv, en) : genericEx()).filter(Boolean)
  const out = []
  let wide = 0
  for (const it of raw) { if (exWide(it)) { if (wide >= 1) continue; wide++ } out.push(it); if (out.length >= 3) break }
  return out
}

export function buildExample(domain, i, lv, en, color) {
  const v = en && en.viz, k = domain.key
  // Düzeye özgü örnek varsa ONA öncelik ver; yoksa aşağıdaki yörünge-geneli örnek.
  if (DS_EG[k]) return DS_EG[k](i, lv, en)
  if (k === 'count' && v && v.t === 'baseten') return item('Onlukları sonra birlikleri saydım.', dsBaseten(v.tens, v.ones), shown(`${v.tens} onluk ${v.ones} birlik = ${v.tens * 10 + v.ones}`))
  if (k === 'count' && v && v.t === 'numline') return item('Sayı doğrusunda parmağımı bir adım kaydırdım.', dsNumberLine(v.max || 10, { at: [v.hi != null ? v.hi : 5] }), shown('bir sonraki sayı'))
  if (k === 'count') return item('Çubuğa pul dizdim, her birine dokunup saydım: hepsi 4.', dsRod(4, { fill: 4 }), shown('4'))
  if (k === 'comp') return item('İki çubuğu hizaladım — üstteki daha çok (5 > 3).', dsRodPair(5, 3, { fillA: 5, fillB: 3 }), shown('5 > 3'))
  if (k === 'add') return item('Mavi 2 + kırmızı 3 pulu birleştirdim, saydım: 5.', dsChipsTwo(2, 3), shown('2 + 3 = 5'))
  if (k === 'compose') return item('5 pulu 2 mavi ve 3 kırmızı diye ayırdım.', dsChipsTwo(2, 3), shown('5 = 2 + 3'))
  if (k === 'multdiv') return item('2 sıra, her sırada 3 pul → topla: 6.', dsFrame(2, 3, 6), shown('2 × 3 = 6'))
  if (k === 'frac') return item('Kesir dairesini 4 eş parçaya böldüm, 1’ini boyadım.', dsFractionCircle(1, 4), shown('1/4'))
  if (k === 'pattern') return item('Pul örüntüsü: mavi-kırmızı… sıradaki mavi.', chipRow(['blue', 'red', 'blue', 'red']), shown('→ mavi'))
  if (k === 'mlen') return item('Nesneyi cetvele koydum, birimleri saydım: 3 birim.', dsMeasureOnRuler(3, 6), shown('3 birim'))
  if (k === 'marea') return item('Birim kareleri saydım — sağdaki daha çok kaplıyor.', dsCubeGridPair({ r: 2, c: 2 }, { r: 2, c: 4 }), shown('sağdaki geniş'))
  if (k === 'mvol') return item('Birim küpleri saydım — yüksek kule daha çok.', `<span style="display:inline-flex;gap:30px;align-items:flex-end">${dsCubeStack(5)}${dsCubeStack(2)}</span>`, shown('soldaki çok'))
  if (k === 'mang') return item('Kolların açıklığına baktım (uzunluğa değil): geniş olan daha açık.', dsAnglePair(35, 110), shown('geniş açı'))
  if (k === 'shape2d' || k === 'shape3d') return item('Geoboard’da üçgen kurdum: 3 köşe, 3 kenar.', dsShape('triangle', { fill: true }), shown('3 köşe · 3 kenar'))
  if (k === 'classif') return item('Daireleri bir araya topladım — aynı şekiller bir grup.', dsShapeRow(['circle', 'circle'], true), shown('daireler grubu'))
  return null
}
