#!/usr/bin/env node
/**
 * DokunSay — Yörünge düzey verisi (yaş-bazlı görünüm için)
 * ─────────────────────────────────────────────────────────
 * trajectories.data.js (DOMAINS) → window.YORUNGE_LEVELS = { key: [{n,t,a0,a1,b}] }
 * Yörünge index'inin "Yaşa göre" görünümü bu veriyi kullanır. Yaş bandı (a0–a1),
 * detay sayfalarındaki kanonik etiketle (lv.a) BİREBİR aynı.
 *
 * Çalıştır:  node _platform/scripts/gen-levels.mjs
 */
import { writeFileSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { DOMAINS } from '../shared/trajectories.data.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..', '..')

// Etiket "3–4 yaş" → [3,4]; "8 yaş" → [8,8]. Etiket yoksa lo/hi (lo = yıl·12, hi = yıl·12+11; 119 = 8+).
const ageYears = (lv) => {
  const m = String(lv.a || '').match(/(\d+)(?:–(\d+))?/)
  if (m) return [+m[1], +(m[2] || m[1])]
  return [Math.max(0, Math.floor(lv.lo / 12)), lv.hi >= 119 ? 8 : Math.floor(lv.hi / 12)]
}

const LEVELS = {}
for (const dom of DOMAINS) {
  LEVELS[dom.key] = dom.levels.map((lv, i) => ({
    n: i + 1,                                   // basamak (1-tabanlı; #lv-{n-1} ankrı)
    t: lv.n,                                    // düzey adı (kanonik)
    a: lv.a || null,                          // kanonik yaş etiketi (LT_MASTER_TR: "4 yaş" / "3–4 yaş")
    a0: ageYears(lv)[0],                        // yaş alt (yıl) — etiketten
    a1: ageYears(lv)[1],                        // yaş üst (yıl) — etiketten ("8 yaş" = 8+)
    b: !!lv.b,                                  // darboğaz mı
  }))
}

const js =
  '/* Otomatik üretildi: gen-levels.mjs — elle düzenlemeyin. */\n' +
  'window.YORUNGE_LEVELS=' + JSON.stringify(LEVELS) + ';\n'

let wrote = 0
for (const dir of [join(ROOT, '_platform/launcher/public/yorunge'), join(ROOT, 'dist-site/yorunge')]) {
  if (existsSync(dir)) { writeFileSync(join(dir, 'levels.js'), js); console.log('  ✓ levels.js →', dir.replace(ROOT, '.')); wrote++ }
}
const total = Object.values(LEVELS).reduce((s, a) => s + a.length, 0)
console.log(`${Object.keys(LEVELS).length} yörünge · ${total} düzey · ${wrote} konum yazıldı.`)
