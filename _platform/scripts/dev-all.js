#!/usr/bin/env node
/**
 * DokunSay Platform — Tüm Uygulamaları Aynı Anda Başlat
 *
 * Launcher + 7 araç dev sunucusunu paralel olarak çalıştırır.
 * Her çıktı aracın rengi ile etiketlenir.
 *
 * Kullanım:
 *   node _platform/scripts/dev-all.js
 *   npm run dev:all     (kök package.json'dan)
 *
 * Durdurmak: Ctrl+C (hepsi kapatılır).
 */

import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..', '..');

const SERVICES = [
  { dir: '_platform/launcher', name: 'Launcher', port: 3000, color: '\x1b[95m' },
  { dir: 'DokunSayBar',        name: 'Bar',      port: 3001, color: '\x1b[33m' },
  { dir: 'DokunSayBasamak',    name: 'Basamak',  port: 3002, color: '\x1b[34m' },
  { dir: 'DokunSayClock',      name: 'Clock',    port: 3003, color: '\x1b[32m' },
  { dir: 'DokunSayKesir',      name: 'Kesir',    port: 3004, color: '\x1b[31m' },
  { dir: 'DokunSayTam',        name: 'Tam',      port: 3005, color: '\x1b[35m' },
  { dir: 'Dokunsay-geo',       name: 'Geo',      port: 3006, color: '\x1b[36m' },
  { dir: 'Dokunsay-veri-app',  name: 'Veri',     port: 3007, color: '\x1b[91m' },
];

const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';
const procs = [];

function log(svc, line) {
  const label = `${svc.color}${BOLD}[${svc.name}]${RESET}`;
  console.log(`${label} ${line}`);
}

function start(svc) {
  const dir = path.join(ROOT, svc.dir);
  if (!existsSync(dir)) {
    log(svc, `⚠ Dizin bulunamadı: ${svc.dir}`);
    return;
  }
  if (!existsSync(path.join(dir, 'node_modules'))) {
    log(svc, `⚠ node_modules yok. "npm install" çalıştır.`);
    return;
  }

  log(svc, `🚀 Başlatılıyor… (port ${svc.port})`);

  const child = spawn('npm', ['run', 'dev'], {
    cwd: dir,
    shell: true,
    env: { ...process.env, FORCE_COLOR: '1' },
  });

  child.stdout.on('data', (data) => {
    const text = data.toString().split('\n').filter(Boolean);
    for (const line of text) log(svc, line);
  });
  child.stderr.on('data', (data) => {
    const text = data.toString().split('\n').filter(Boolean);
    for (const line of text) log(svc, `⚠ ${line}`);
  });
  child.on('exit', (code) => {
    log(svc, `🛑 Sonlandı (exit ${code})`);
  });

  procs.push({ svc, child });
}

console.log(`\n${BOLD}🎯 DokunSay Platform — Tüm Servisler Başlatılıyor${RESET}\n`);

for (const svc of SERVICES) start(svc);

console.log(
  `\n${BOLD}Tüm servisler çalışıyor. Durdurmak için Ctrl+C.${RESET}\n` +
  `${BOLD}Launcher: ${RESET}http://localhost:3000\n\n`
);

function shutdown() {
  console.log(`\n${BOLD}🛑 Tüm servisler durduruluyor…${RESET}\n`);
  for (const { child } of procs) {
    try {
      if (process.platform === 'win32') {
        spawn('taskkill', ['/pid', child.pid, '/f', '/t'], { shell: true });
      } else {
        child.kill('SIGTERM');
      }
    } catch (_) { /* geç */ }
  }
  setTimeout(() => process.exit(0), 500);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
