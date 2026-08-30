#!/usr/bin/env node
/**
 * DokunSay — NuMap MERKEZLİ giriş kapısını (numap-gate.js) dist-site'taki TÜM index.html'lere
 * enjekte eder. Ayrıca güncel numap-gate.js + yörünge index'i + levels.js'i dist-site'a kopyalar.
 * build-site.js'ten SONRA çalıştırılmalıdır (tam yeniden derleme oyun index'lerini sıfırlar).
 *
 * Kimlik kaynağı: NuMap (getnumap.com). numap-gate.js, ?sso=<bilet> ile gelen ziyaretçiyi
 * otomatik giriş yaptırır; yoksa "NuMap ile giriş yap" kapısı gösterir (gate) / köşe daveti (chip).
 *
 * Çalıştır:  node _platform/scripts/inject-gate.mjs
 */
import { readFileSync, writeFileSync, copyFileSync, existsSync, readdirSync, statSync } from 'node:fs'
import { join, dirname, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..', '..')
const DIST = join(ROOT, 'dist-site')
const PUB = join(ROOT, '_platform', 'launcher', 'public')
const GATE_TAG = '<script src="/numap-gate.js?v=2"></script>'
const CHIP_FLAG = '<script>window.NUMAP_GATE_MODE="chip"</script>'
// DokunSay kimliği: kapı markası + vurgu (DokunSay yeşil ailesinde).
const BRAND_FLAG = '<script>window.NUMAP_GATE_BRAND="DokunSay";window.NUMAP_GATE_SUB="Matematik Öğretim Araçları"</script>'
const ACCENT_FLAG = '<script>window.NUMAP_GATE_ACCENT="#2E7D32"</script>'
// AÇILIŞ/SİTE: launcher + kitap tanıtımı görünür (giriş daveti). Gerisi giriş-kapılı içerik.
// Zihinden Aritmetik bir kitap uygulamasıdır: tanıtım sayfası kapının arkasında
// kalırsa tanıtım işlevini yitirir ve uygulama kurulamaz. Erişim denetimi
// uygulamanın kendi kitap koduyla yapılır, NuMap girişiyle değil.
const LANDING = new Set(['index.html', 'ZihindenAritmetik/index.html'])

if (!existsSync(DIST)) { console.error('✗ dist-site yok — önce build-site.js çalıştırın.'); process.exit(1) }

// 1) Güncel kapı + yörünge index + levels'ı dist-site'a kopyala
copyFileSync(join(PUB, 'numap-gate.js'), join(DIST, 'numap-gate.js'))
console.log('  ✓ numap-gate.js → dist-site/')
for (const f of ['index.html', 'levels.js']) {
  const src = join(PUB, 'yorunge', f), dst = join(DIST, 'yorunge', f)
  if (existsSync(src)) { copyFileSync(src, dst); console.log('  ✓ yorunge/' + f + ' → dist-site/yorunge/') }
}

// 2) Tüm index.html'lere kapıyı enjekte et (idempotent — eski HÇMÖ + Numap enjeksiyonlarını temizler)
function walk(dir, acc) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e)
    if (statSync(p).isDirectory()) walk(p, acc)
    else if (e === 'index.html') acc.push(p)
  }
  return acc
}
const pages = walk(DIST, [])
let chip = 0, gate = 0
for (const p of pages) {
  let html = readFileSync(p, 'utf8')
  // önceki enjeksiyonu temizle → yeniden uygulanabilsin (idempotent). Eski HÇMÖ izleri dahil.
  html = html
    .replace(/\s*<script>window\.NUMAP_GATE_[^<]*<\/script>/g, '')
    .replace(/\s*<script src="\/numap-gate\.js[^"]*"><\/script>/g, '')
    .replace(/\s*<script>window\.HCMO_GATE_[^<]*<\/script>/g, '')
    .replace(/\s*<script src="[^"]*hcmo-gate\.js[^"]*"><\/script>/g, '')
    .replace(/\s*<script src="[^"]*hcmo-a11y\.js[^"]*"><\/script>/g, '')
  const rel = relative(DIST, p).replace(/\\/g, '/')
  const isLanding = LANDING.has(rel)
  const TAG = (isLanding ? CHIP_FLAG : '') + BRAND_FLAG + ACCENT_FLAG + GATE_TAG
  if (html.includes('</head>')) html = html.replace('</head>', '  ' + TAG + '\n</head>')
  else if (/<body[^>]*>/.test(html)) html = html.replace(/<body[^>]*>/, (m) => m + '\n' + TAG)
  else html = TAG + '\n' + html
  writeFileSync(p, html)
  console.log('  ' + (isLanding ? '👁  görünür ' : '🔒 kapılı  ') + rel)
  isLanding ? chip++ : gate++
}
// 404.html = açılış launcher'ın kopyası (chip modu; yanlış URL'de site görünür, içerik değil)
const idx = join(DIST, 'index.html'), f404 = join(DIST, '404.html')
if (existsSync(idx)) { copyFileSync(idx, f404); console.log('  ✓ 404.html = açılış launcher (chip)') }

console.log(`\n${pages.length} sayfa · ${chip} görünür/site (chip) · ${gate} kapılı/içerik (gate).`)
