#!/usr/bin/env node
/**
 * DokunSay Platform — Tüm Uygulamalarda Script Çalıştır
 *
 * Kullanım:
 *   node _platform/scripts/run-all.js <script>
 *
 * Örnekler:
 *   node _platform/scripts/run-all.js install   → her uygulamada npm install
 *   node _platform/scripts/run-all.js build     → her uygulamada npm run build
 */

import { execSync, spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..', '..');

const APPS = [
  { dir: '_platform/launcher', name: 'Launcher' },
  { dir: 'DokunSayBar',        name: 'Bar' },
  { dir: 'DokunSayBasamak',    name: 'Basamak' },
  { dir: 'DokunSayClock',      name: 'Clock' },
  { dir: 'DokunSayKesir',      name: 'Kesir' },
  { dir: 'DokunSayTam',        name: 'Tam' },
  { dir: 'Dokunsay-geo',       name: 'Geo' },
  { dir: 'Dokunsay-veri-app',  name: 'Veri' },
];

const cmd = process.argv[2];
if (!cmd) {
  console.error('Kullanım: node run-all.js <install|build|preview|lint>');
  process.exit(1);
}

const ALLOWED = ['install', 'build', 'preview', 'lint', 'dev'];
if (!ALLOWED.includes(cmd)) {
  console.error(`Script "${cmd}" desteklenmiyor. İzinliler: ${ALLOWED.join(', ')}`);
  process.exit(1);
}

const npmCmd = cmd === 'install' ? 'install' : `run ${cmd}`;

console.log(`\n🎯 DokunSay Platform — Tüm uygulamalarda: npm ${npmCmd}\n`);

const results = [];

for (const app of APPS) {
  const fullPath = path.join(ROOT, app.dir);
  if (!existsSync(fullPath)) {
    console.warn(`⚠️  ${app.name}: dizin bulunamadı (${app.dir})`);
    results.push({ ...app, status: 'skipped', reason: 'missing dir' });
    continue;
  }
  if (!existsSync(path.join(fullPath, 'package.json'))) {
    console.warn(`⚠️  ${app.name}: package.json bulunamadı`);
    results.push({ ...app, status: 'skipped', reason: 'no package.json' });
    continue;
  }

  console.log(`\n📦 ${app.name} (${app.dir})`);
  console.log('─'.repeat(60));

  try {
    execSync(`npm ${npmCmd}`, {
      cwd: fullPath,
      stdio: 'inherit',
      shell: true,
    });
    results.push({ ...app, status: 'ok' });
    console.log(`✅ ${app.name}: başarılı`);
  } catch (err) {
    results.push({ ...app, status: 'failed', error: err.message });
    console.error(`❌ ${app.name}: başarısız`);
  }
}

console.log('\n' + '═'.repeat(60));
console.log('ÖZET');
console.log('═'.repeat(60));
const ok = results.filter((r) => r.status === 'ok').length;
const failed = results.filter((r) => r.status === 'failed').length;
const skipped = results.filter((r) => r.status === 'skipped').length;
console.log(`✅ Başarılı:  ${ok}`);
console.log(`❌ Başarısız: ${failed}`);
console.log(`⚠️  Atlandı:   ${skipped}`);
console.log();

process.exit(failed > 0 ? 1 : 0);
