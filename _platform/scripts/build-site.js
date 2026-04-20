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
import { existsSync, mkdirSync, rmSync, cpSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..', '..');
const OUT_DIR = path.join(ROOT, 'dist-site');

const SITE_BASE = (process.env.SITE_BASE || '/').replace(/\/+$/, '/') || '/';

const APPS = [
  { dir: '_platform/launcher', name: 'Launcher', folder: '' },
  { dir: 'DokunSayBar',        name: 'Bar',      folder: 'DokunSayBar' },
  { dir: 'DokunSayBasamak',    name: 'Basamak',  folder: 'DokunSayBasamak' },
  { dir: 'DokunSayClock',      name: 'Clock',    folder: 'DokunSayClock' },
  { dir: 'DokunSayKesir',      name: 'Kesir',    folder: 'DokunSayKesir' },
  { dir: 'DokunSayTam',        name: 'Tam',      folder: 'DokunSayTam' },
  { dir: 'Dokunsay-geo',       name: 'Geo',      folder: 'Dokunsay-geo' },
  { dir: 'Dokunsay-veri-app',  name: 'Veri',     folder: 'Dokunsay-veri-app' },
];

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
