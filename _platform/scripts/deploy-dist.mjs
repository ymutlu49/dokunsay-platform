#!/usr/bin/env node
/**
 * dist-site/<App>/ içindeki tüm dosyaları umbrella host'a yükler
 * via canlı _dk_recv.php endpoint'i (sadece /dokunsay/ altına yazar).
 *
 * Umbrella host: hercocukmatematikogrenebilir.com. ENDPOINT bu hosta taşınınca güncellenir.
 *   Şimdilik canlı deploy hedefi diskalkuli.com'da kalır (kesinti olmaması için).
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, posix } from 'node:path';
import { request } from 'node:https';

const SECRET = 'dk-update-2026-05-02-yilmaz-mutlu-sayfa-guncelleme';
// Umbrella host onaylanınca hercocukmatematikogrenebilir.com'a çevir.
const ENDPOINT = new URL('https://diskalkuli.com/_dk_recv.php');
const ROOT = new URL('../../dist-site/', import.meta.url).pathname;
const APPS = ['DokunSayBar','DokunSayBasamak','DokunSayClock','DokunSayKesir','DokunSayTam','Dokunsay-geo','Dokunsay-veri-app'];

function listFiles(base, rel = '') {
  const out = [];
  const dir = rel ? join(base, rel) : base;
  for (const e of readdirSync(dir)) {
    const full = join(dir, e);
    const s = statSync(full);
    const r = rel ? posix.join(rel, e) : e;
    if (s.isDirectory()) out.push(...listFiles(base, r));
    else out.push({ rel: r, size: s.size });
  }
  return out;
}

function postFile(remotePath, b64) {
  return new Promise((resolve, reject) => {
    const body = `s=${encodeURIComponent(SECRET)}&path=${encodeURIComponent(remotePath)}&b64=${encodeURIComponent(b64)}`;
    const req = request({
      hostname: ENDPOINT.hostname,
      path: ENDPOINT.pathname,
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Content-Length': Buffer.byteLength(body) },
      timeout: 120000,
    }, (res) => {
      let data = '';
      res.on('data', (c) => data += c);
      res.on('end', () => resolve({ status: res.statusCode, body: data }));
    });
    req.on('error', reject);
    req.on('timeout', () => req.destroy(new Error('timeout')));
    req.write(body);
    req.end();
  });
}

let total = 0, ok = 0, fail = 0;
const failures = [];
const start = Date.now();
console.log(`Deploy başladı: dist-site/ → ${ENDPOINT.hostname}/dokunsay/`);

for (const app of APPS) {
  const appDir = ROOT.replace(/^\/([A-Z]):\//, '$1:/') + app;
  let files;
  try { files = listFiles(appDir); }
  catch (e) { console.log(`SKIP ${app}: ${e.message}`); continue; }
  for (const f of files) {
    total++;
    const remotePath = `/dokunsay/${app}/${f.rel.split('\\').join('/')}`;
    const fullLocal = appDir + '/' + f.rel.split('\\').join('/');
    let bytes;
    try { bytes = readFileSync(fullLocal); }
    catch (e) { fail++; failures.push(`READ ${remotePath}: ${e.message}`); continue; }
    const b64 = bytes.toString('base64');
    try {
      const r = await postFile(remotePath, b64);
      if (r.body.startsWith('OK')) {
        ok++;
        process.stdout.write('.');
      } else {
        fail++;
        failures.push(`POST ${remotePath} (${(f.size/1024).toFixed(1)}KB): ${r.status} ${r.body.slice(0,150)}`);
        process.stdout.write('x');
      }
    } catch (e) { fail++; failures.push(`POST ${remotePath}: ${e.message}`); process.stdout.write('!'); }
  }
}

const dt = ((Date.now() - start) / 1000).toFixed(1);
console.log(`\n\nTOTAL=${total} OK=${ok} FAIL=${fail} (${dt}s)`);
if (failures.length) {
  console.log('\nFailures:');
  failures.slice(0, 10).forEach(f => console.log('  ' + f));
}
process.exit(fail ? 1 : 0);
