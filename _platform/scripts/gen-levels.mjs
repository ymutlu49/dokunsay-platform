#!/usr/bin/env node
/**
 * DokunSay — Yörünge düzey verisi (yaş-bazlı görünüm için)
 * ─────────────────────────────────────────────────────────
 * trajectories.data.js (DOMAINS) → window.YORUNGE_LEVELS = { key: [{n,t,a0,a1,b}] }
 * Yörünge index'inin "Yaşa göre" görünümü bu veriyi kullanır. Yaş bandı (a0–a1),
 * detay sayfalarındaki ageBand ile BİREBİR aynı (aynı lo/hi, aynı yuvarlama).
 *
 * Çalıştır:  node _platform/scripts/gen-levels.mjs
 */
import { writeFileSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { DOMAINS } from '../shared/trajectories.data.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..', '..')

const LEVELS = {}
for (const dom of DOMAINS) {
  LEVELS[dom.key] = dom.levels.map((lv, i) => ({
    n: i + 1,                                   // basamak (1-tabanlı; #lv-{n-1} ankrı)
    t: lv.n,                                    // düzey adı (kanonik)
    a0: Math.max(0, Math.round(lv.lo / 12)),    // yaş alt (yıl) — ageBand ile aynı
    a1: Math.round(lv.hi / 12),                 // yaş üst (yıl)
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
