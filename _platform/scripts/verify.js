#!/usr/bin/env node
/**
 * DokunSay Platform — Uyum Denetleyicisi
 *
 * Her uygulamanın platform standartlarına uyduğunu doğrular.
 * Kullanım: node _platform/scripts/verify.js
 *
 * Kontroller:
 *   - README.md, LICENSE, PRIVACY.md, eslint.config.js, .editorconfig var mı?
 *   - package.json: name "dokunsay-<modul>" kalıbına uyuyor mu?
 *   - package.json: author, license, description alanları var mı?
 *   - React sürümü 18.3.x mi?
 *   - Vite sürümü 6.x mi?
 */

import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..', '..');

const APPS = [
  { dir: 'DokunSayBar',        id: 'bar' },
  { dir: 'DokunSayBasamak',    id: 'basamak' },
  { dir: 'DokunSayClock',      id: 'clock' },
  { dir: 'DokunSayKesir',      id: 'kesir' },
  { dir: 'DokunSayTam',        id: 'tam' },
  { dir: 'Dokunsay-geo',       id: 'geo' },
  { dir: 'Dokunsay-veri-app',  id: 'veri' },
];

const REQUIRED_FILES = ['README.md', 'LICENSE', 'PRIVACY.md', 'eslint.config.js', '.editorconfig', 'package.json'];
const EXPECTED_REACT = '^18.3.1';
const EXPECTED_VITE = '^6.0.0';

function loadJson(p) {
  try {
    return JSON.parse(readFileSync(p, 'utf8'));
  } catch {
    return null;
  }
}

function colorize(text, color) {
  const codes = {
    red: '\x1b[31m', green: '\x1b[32m', yellow: '\x1b[33m',
    blue: '\x1b[34m', cyan: '\x1b[36m', bold: '\x1b[1m', reset: '\x1b[0m',
  };
  return `${codes[color] || ''}${text}${codes.reset}`;
}

console.log(colorize('\n🎯 DokunSay Platform — Uyum Denetleyicisi\n', 'bold'));

let totalIssues = 0;
const report = [];

for (const app of APPS) {
  const issues = [];
  const warnings = [];
  const appPath = path.join(ROOT, app.dir);

  if (!existsSync(appPath)) {
    issues.push(`Dizin bulunamadı: ${app.dir}`);
    report.push({ app, issues, warnings });
    continue;
  }

  for (const f of REQUIRED_FILES) {
    if (!existsSync(path.join(appPath, f))) {
      issues.push(`Eksik dosya: ${f}`);
    }
  }

  const pkg = loadJson(path.join(appPath, 'package.json'));
  if (pkg) {
    const expectedName = `dokunsay-${app.id}`;
    if (pkg.name !== expectedName) {
      issues.push(`package.json name "${pkg.name}" beklenen "${expectedName}"`);
    }
    if (!pkg.author) issues.push('package.json: author alanı eksik');
    if (!pkg.license) issues.push('package.json: license alanı eksik');
    if (!pkg.description) warnings.push('package.json: description alanı eksik');

    const reactV = pkg.dependencies?.react;
    const viteV = pkg.devDependencies?.vite;
    if (reactV && reactV !== EXPECTED_REACT) {
      warnings.push(`React sürümü "${reactV}" (beklenen "${EXPECTED_REACT}")`);
    }
    if (viteV && !viteV.startsWith('^6.')) {
      warnings.push(`Vite sürümü "${viteV}" (beklenen "${EXPECTED_VITE}")`);
    }
  }

  report.push({ app, issues, warnings });
  totalIssues += issues.length;
}

for (const { app, issues, warnings } of report) {
  const icon = issues.length === 0 ? '✅' : '❌';
  const color = issues.length === 0 ? 'green' : 'red';
  console.log(colorize(`\n${icon} ${app.dir}`, color));

  if (issues.length === 0 && warnings.length === 0) {
    console.log('  ' + colorize('Platform standartlarına tam uyum.', 'green'));
  }

  for (const issue of issues) {
    console.log('  ' + colorize(`✗ ${issue}`, 'red'));
  }
  for (const warn of warnings) {
    console.log('  ' + colorize(`⚠ ${warn}`, 'yellow'));
  }
}

console.log('\n' + '═'.repeat(60));
const okCount = report.filter((r) => r.issues.length === 0).length;
const warnCount = report.reduce((acc, r) => acc + r.warnings.length, 0);
console.log(colorize(`Tam uyumlu uygulama: ${okCount} / ${APPS.length}`, okCount === APPS.length ? 'green' : 'yellow'));
console.log(colorize(`Toplam hata:  ${totalIssues}`, totalIssues === 0 ? 'green' : 'red'));
console.log(colorize(`Toplam uyarı: ${warnCount}`, warnCount === 0 ? 'green' : 'yellow'));
console.log();

process.exit(totalIssues > 0 ? 1 : 0);
