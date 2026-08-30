#!/usr/bin/env node
/**
 * DokunSay — ds-levels DENETİMİ (yorunge.ds-levels.js ↔ kanon)
 *
 * Kullanıcının üç ölçütünü bağımsız ölçer:
 *   1) DokunSay çubuğu/pulu gerçekten kullanılıyor mu
 *   2) Etkinlik düzeye uygun mu (her düzey 1-3 madde döndürüyor mu, boş dal yok mu)
 *   3) Yörünge doğrultusunda mı (ardışık düzeyler BİÇİMCE ayrışıyor mu — sahte zorluk yasak)
 *
 * OYUN düzeyleri (isPlayLevel: hi ≤ 36 ay) atlanır: yaprakta alıştırma değil oyun
 * yönergesi basılır, DS_EX oralarda hiç çağrılmaz.
 *
 * Çalıştır:  node _platform/scripts/audit-ds-levels.mjs   (hata varsa exit 1)
 */
import { DOMAINS } from '../shared/trajectories.data.js'
import { isPlayLevel } from '../shared/yorunge.worksheet.js'
import { DS_EX, DS_EG } from '../shared/yorunge.ds-levels.js'

const CUBUK = /dsRod|dsRodPair|dsChip|dsChips|dsChipsTwo|dsFrame|dsDotCard|dsRuler|dsMeasureOnRuler/
const hata = [], uyari = []
let toplam = 0, cubuklu = 0, ayrisan = 0

for (const d of DOMAINS) {
  const k = d.key, n = d.levels.length, ex = DS_EX[k]
  if (!ex) { uyari.push(`${k}: DS_EX yok → eski builder'a düşer`); continue }
  let onceki = null
  for (let i = 0; i < n; i++) {
    const lv = d.levels[i]
    if (isPlayLevel(lv)) { onceki = null; continue }
    toplam++
    let r
    try { r = ex(i, lv, null) } catch (e) { hata.push(`${k}[${i}]: çalıştırılamadı — ${e.message}`); continue }
    if (!Array.isArray(r) || r.length === 0) { hata.push(`${k}[${i}]: madde döndürmedi`); continue }
    if (r.length > 3) hata.push(`${k}[${i}]: ${r.length} madde (en çok 3 — A4 taşar)`)
    if (r.some(x => !x || typeof x.q !== 'string' || !x.q.trim())) hata.push(`${k}[${i}]: boş soru metni`)
    if (!r.some(x => !x.vis)) uyari.push(`${k}[${i}]: görselsiz madde yok (A4 payı riskli)`)
    const govde = r.map(x => (x.q || '') + ' ' + (x.vis || '')).join(' ')
    if (CUBUK.test(ex.toString()) || /çubu|pul|çerçeve/i.test(govde)) cubuklu++
    const imza = r.map(x => x.q).join('|')
    if (onceki !== null && imza === onceki) hata.push(`${k}[${i}]: bir öncekiyle AYNI alıştırma seti (sahte zorluk)`)
    else if (onceki !== null) ayrisan++
    onceki = imza
  }
  const eg = DS_EG[k]
  if (eg) {
    const set = new Set()
    for (let i = 0; i < n; i++) {
      if (isPlayLevel(d.levels[i])) continue
      try { const e = eg(i, d.levels[i], null); if (e && e.q) set.add(e.q) } catch (err) { hata.push(`${k}: DS_EG[${i}] hata — ${err.message}`) }
    }
    if (set.size < 2) hata.push(`${k}: örnek kutusu düzeye göre değişmiyor (${set.size} çeşit)`)
  } else uyari.push(`${k}: DS_EG yok → yörünge-geneli tek örnek`)
}

if (hata.length) {
  console.error(`✗ DS-LEVELS DENETİMİ BAŞARISIZ (${hata.length}):\n  ` + hata.slice(0, 40).join('\n  '))
  process.exit(1)
}
console.log(`✓ ds-levels denetimi geçti`)
console.log(`   yörünge: ${Object.keys(DS_EX).length}/20 · alıştırma düzeyi: ${toplam} · ardışık ayrışan: ${ayrisan} · çubuk/pul geçen: ${cubuklu}`)
if (uyari.length) console.log('   uyarı:\n     ' + uyari.join('\n     '))
