#!/usr/bin/env node
/**
 * dist-site/ kökündeki launcher dosyalarını /dokunsay/ köküne deploy eder.
 * deploy-dist.mjs sadece 7 modül alt-klasörünü deploy ediyor; launcher hariç.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, posix } from 'node:path';
import { request } from 'node:https';

const SECRET = 'dk-update-2026-05-02-yilmaz-mutlu-sayfa-guncelleme';
const ENDPOINT = new URL('https://diskalkuli.com/_dk_recv.php');
const ROOT = new URL('../../dist-site/', import.meta.url).pathname.replace(/^\/([A-Z]):\//, '$1:/');

// Sadece launcher'a ait kök dosyalar + assets/. Modül klasörleri hariç.
const SKIP_DIRS = new Set(['DokunSayBar','DokunSayBasamak','DokunSayClock','DokunSayKesir','DokunSayTam','Dokunsay-geo','Dokunsay-veri-app']);

function listLauncherFiles(base, rel = '') {
  const out = [];
  const dir = rel ? join(base, rel) : base;
  for (const e of readdirSync(dir)) {
    if (!rel && SKIP_DIRS.has(e)) continue;
    const full = join(dir, e);
    const s = statSync(full);
    const r = rel ? posix.join(rel, e) : e;
    if (s.isDirectory()) out.push(...listLauncherFiles(base, r));
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

let ok = 0, fail = 0;
const failures = [];
const start = Date.now();
const files = listLauncherFiles(ROOT);
console.log(`Launcher deploy: ${files.length} dosya → diskalkuli.com/dokunsay/`);

for (const f of files) {
  const remotePath = `/dokunsay/${f.rel.split('\\').join('/')}`;
  const fullLocal = ROOT + f.rel.split('\\').join('/');
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
      failures.push(`POST ${remotePath}: ${r.status} ${r.body.slice(0,150)}`);
      process.stdout.write('x');
    }
  } catch (e) { fail++; failures.push(`POST ${remotePath}: ${e.message}`); process.stdout.write('!'); }
}

const dt = ((Date.now() - start) / 1000).toFixed(1);
console.log(`\n\nTOTAL=${files.length} OK=${ok} FAIL=${fail} (${dt}s)`);
if (failures.length) {
  console.log('Failures:');
  failures.forEach(f => console.log('  ' + f));
}
process.exit(fail ? 1 : 0);
