#!/usr/bin/env node
/**
 * DokunSay Platform — Tek Siteye Birleştirilmiş Üretim Derlemesi
 *
 * Launcher + 7 uygulamayı doğru base path'lerle build eder ve
 * bir `dist-site/` klasöründe tek statik site olarak birleştirir.
 *
 * Kullanım:
 *   SITE_BASE=/dokunsay/ node _platform/scripts/build-site.js
 *
 * GitHub Pages için:
 *   SITE_BASE=/<repo-adı>/ node _platform/scripts/build-site.js
 *
 * Yerel test için:
 *   SITE_BASE=/ node _platform/scripts/build-site.js
 *   cd dist-site && npx serve -l 8080
 */

import { execSync } from 'node:child_process';
import { existsSync, mkdirSync, rmSync, cpSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Uygulama listesi tek yerde durur; katalog sınamaları da aynı dosyayı okur.
import { APPS } from '../apps.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..', '..');
const OUT_DIR = path.join(ROOT, 'dist-site');

let SITE_BASE = (process.env.SITE_BASE || '/').replace(/\/+$/, '/') || '/';
// MSYS/Git-Bash güvenliği: bash'te `SITE_BASE=/` değeri, POSIX→Windows yol dönüşümüyle
// `C:/Program Files/Git/`e çevrilebilir → base bozulur, JS yüklenmez, sayfa boş açılır.
// Bu mangle'ı (Program Files ya da sürücü-harfi öneki) yakala ve köke sıfırla.
if (SITE_BASE.includes('Program Files') || /^[A-Za-z]:/.test(SITE_BASE)) {
  console.warn(`⚠  SITE_BASE MSYS tarafından bozulmuş görünüyor ("${SITE_BASE}"); "/" olarak sıfırlandı.`);
  SITE_BASE = '/';
}


const BOLD = '\x1b[1m';
const DIM = '\x1b[2m';
const OK = '\x1b[32m';
const FAIL = '\x1b[31m';
const NOTE = '\x1b[36m';
const RESET = '\x1b[0m';

console.log(`\n${BOLD}🎯 DokunSay Platform — Site Derlemesi${RESET}`);
console.log(`${DIM}Site tabanı: ${NOTE}${SITE_BASE}${RESET}\n`);

// Temiz başlangıç
if (existsSync(OUT_DIR)) {
  rmSync(OUT_DIR, { recursive: true, force: true });
}
mkdirSync(OUT_DIR, { recursive: true });

let failed = 0;
const summary = [];

for (const app of APPS) {
  const fullDir = path.join(ROOT, app.dir);
  const basePath = app.folder ? `${SITE_BASE}${app.folder}/` : SITE_BASE;

  console.log(`${BOLD}📦 ${app.name}${RESET} ${DIM}(${app.dir})${RESET}`);
  console.log(`   base: ${NOTE}${basePath}${RESET}`);

  if (!existsSync(fullDir) || !existsSync(path.join(fullDir, 'package.json'))) {
    console.warn(`   ${FAIL}⚠  dizin/package.json yok, atlanıyor${RESET}`);
    summary.push({ app: app.name, status: 'skipped' });
    continue;
  }

  try {
    const env = { ...process.env, BASE_PATH: basePath };
    execSync('npm run build', {
      cwd: fullDir,
      stdio: 'inherit',
      env,
      shell: true,
    });

    const srcDist = path.join(fullDir, 'dist');
    const destDist = app.folder ? path.join(OUT_DIR, app.folder) : OUT_DIR;

    mkdirSync(destDist, { recursive: true });
    cpSync(srcDist, destDist, { recursive: true });

    console.log(`   ${OK}✓ ${app.name} → dist-site${app.folder ? '/' + app.folder : ''}${RESET}\n`);
    summary.push({ app: app.name, status: 'ok', path: destDist });
  } catch (err) {
    console.error(`   ${FAIL}✗ ${app.name} başarısız${RESET}\n`);
    summary.push({ app: app.name, status: 'failed', error: err.message });
    failed++;
  }
}

// 404.html → launcher (SPA routing benzeri davranış için — GitHub Pages)
try {
  const indexPath = path.join(OUT_DIR, 'index.html');
  if (existsSync(indexPath)) {
    cpSync(indexPath, path.join(OUT_DIR, '404.html'));
  }
} catch { /* ignore */ }

// .nojekyll — GitHub Pages _platform gibi alt çizgiyle başlayan dizinleri görmezden geliyor; biz _ kullanmıyoruz ama güvenlik için ekle
try {
  const nojekyll = path.join(OUT_DIR, '.nojekyll');
  mkdirSync(OUT_DIR, { recursive: true });
  // empty file
  execSync(process.platform === 'win32' ? `type nul > "${nojekyll}"` : `touch "${nojekyll}"`, { shell: true });
} catch { /* ignore */ }

// ── Site haritası ─────────────────────────────────────────────────────────────
//    Elle bakılan bir sitemap.xml vardı ve listeden geri kalmıştı: ZihindenAritmetik
//    eklendiğinde haritaya girmemişti. Artık aynı APPS listesinden üretiliyor, yani
//    yeni bir uygulama derlendiği anda haritaya da girer.
try {
  const bugun = new Date().toISOString().slice(0, 10);
  const satirlar = [
    { yol: '', oncelik: '1.0' },
    { yol: 'yorunge/', oncelik: '0.9' },
    ...APPS.filter((a) => a.folder).map((a) => ({ yol: `${a.folder}/`, oncelik: '0.8' })),
  ];
  const govde = satirlar
    .map(
      (u) =>
        `  <url><loc>https://dokunsay.com/${u.yol}</loc>` +
        `<lastmod>${bugun}</lastmod>` +
        `<changefreq>monthly</changefreq>` +
        `<priority>${u.oncelik}</priority></url>`,
    )
    .join(String.fromCharCode(10));
  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    govde,
    '</urlset>',
    '',
  ].join(String.fromCharCode(10));
  writeFileSync(path.join(OUT_DIR, 'sitemap.xml'), xml, 'utf-8');
  console.log(`${OK}✓${RESET} sitemap.xml ${DIM}(${satirlar.length} adres)${RESET}`);
} catch (e) {
  console.error(`${FAIL}✗ sitemap üretilemedi: ${e.message}${RESET}`);
  failed++;
}

// ── Giriş kapısı + yaş verisi (her TAM derlemede yeniden uygulanır; yoksa oyun ──
//    index'leri sıfırlanır ve kapı kaybolurdu) ───────────────────────────────────
try {
  console.log(`\n${BOLD}🔒 Giriş kapısı + yaş verisi enjekte ediliyor${RESET}`);
  execSync(`node "${path.join(__dirname, 'gen-levels.mjs')}"`, { stdio: 'inherit', shell: true });
  execSync(`node "${path.join(__dirname, 'inject-gate.mjs')}"`, { stdio: 'inherit', shell: true });
} catch (e) {
  console.error(`${FAIL}✗ kapı/levels enjeksiyonu başarısız: ${e.message}${RESET}`);
  failed++;
}

console.log('\n' + '═'.repeat(60));
console.log(`${BOLD}ÖZET${RESET}`);
console.log('═'.repeat(60));
for (const s of summary) {
  const icon = s.status === 'ok' ? `${OK}✓${RESET}` : s.status === 'failed' ? `${FAIL}✗${RESET}` : `${DIM}·${RESET}`;
  console.log(`${icon} ${s.app.padEnd(10)} ${DIM}${s.status}${RESET}`);
}
console.log('\n' + (failed === 0
  ? `${OK}✓ Tüm dağıtım tamam: ${BOLD}${OUT_DIR}${RESET}`
  : `${FAIL}✗ ${failed} hata var${RESET}`));

console.log(`\n${DIM}Yerel test: ${NOTE}cd dist-site && npx serve -l 8080${RESET}\n`);

process.exit(failed > 0 ? 1 : 0);
