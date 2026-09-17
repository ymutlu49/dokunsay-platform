// DokunSay yaş bantları + yaş etiketleri hizalayıcı — LT_MASTER_TR (17 Eyl 2026) / _canon/trajectory-canon.json
// CORE düzeylerinin lo/hi'sini ve EXT_BANDS'in TÜM anahtarlarını kanonik ay aralığına
// (ageMinM/ageMaxM: lo = yıl·12, hi = yıl·12+11; "8 yaş" → 119) eşitler; her düzeye kanonik
// yaş ETİKETİNİ (`a`: "3 yaş" / "3–4 yaş") ekler (CORE: level.a; EXT: EXT_AGES[key][i]).
// Tek seferlik compose 11→10 uzlaştırması: EXT_TASKS/EXT_IV compose dizilerinde eski 7 (20+) ve
// 8 (onluk-birlik) tek düzeye birleştirilir (yalnız eski dizilim algılanırsa).
//   Çalıştır:  cd dokunsay/_platform && node scripts/gen-align-bands.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SHARED = resolve(__dirname, '../shared/trajectories.data.js');
const CANON = resolve(__dirname, '../../../_canon/trajectory-canon.json');

const KEY_MAP = {
  sub: 'subitizing', count: 'counting', comp: 'comparing', add: 'adding',
  compose: 'composing', multdiv: 'multiplying', frac: 'fractions', pattern: 'patterning',
  shape2d: 'shapes2d', comp2d: 'composing2d', disembed: 'disembedding', shape3d: 'shapes3d',
  comp3d: 'composing3d', spviz: 'spatialviz', sporient: 'spatialorient', mlen: 'length',
  marea: 'area', mvol: 'volume', mang: 'angle', classif: 'data',
};
const canon = JSON.parse(readFileSync(CANON, 'utf8'));
const canonById = Object.fromEntries(canon.trajectories.map((t) => [t.id, t]));
const { CORE, EXT, EXT_TASKS, EXT_IV } = await import(pathToFileURL(SHARED).href);

function q(s) {
  if (/[\\\n\r\t]/.test(s)) return JSON.stringify(s);
  if (!s.includes("'")) return "'" + s + "'";
  if (!s.includes('"')) return '"' + s + '"';
  return JSON.stringify(s);
}
function toJS(v) {
  if (v === null || v === undefined) return 'null';
  if (typeof v === 'number' || typeof v === 'boolean') return String(v);
  if (typeof v === 'string') return q(v);
  if (Array.isArray(v)) return '[' + v.map(toJS).join(', ') + ']';
  return '{ ' + Object.entries(v).map(([k, val]) => `${/^[A-Za-z_$][\w$]*$/.test(k) ? k : q(k)}: ${toJS(val)}`).join(', ') + ' }';
}
function findArrayEnd(text, start) {
  let depth = 0, inStr = null;
  for (let i = start; i < text.length; i++) {
    const ch = text[i];
    if (inStr) { if (ch === '\\') { i++; continue; } if (ch === inStr) inStr = null; continue; }
    if (ch === '"' || ch === "'" || ch === '`') inStr = ch;
    else if (ch === '[') depth++;
    else if (ch === ']' && --depth === 0) return i;
  }
  throw new Error('dizi sonu bulunamadı');
}
function spliceArray(text, marker, arr, innerIndent = '  ') {
  const mi = text.indexOf(marker);
  if (mi < 0) throw new Error('işaret yok: ' + marker);
  const start = text.indexOf('[', mi);
  const end = findArrayEnd(text, start);
  return text.slice(0, start) + '[\n' + arr.map((el) => innerIndent + toJS(el) + ',').join('\n') + '\n]' + text.slice(end + 1);
}
function spliceObjValue(text, objMarker, key, newArr, trailing = '') {
  const oi = text.indexOf(objMarker);
  if (oi < 0) throw new Error('obje yok: ' + objMarker);
  const ki = text.indexOf('\n  ' + key + ':', oi);
  if (ki < 0) throw new Error(`anahtar yok: ${key} @ ${objMarker}`);
  const start = text.indexOf('[', ki);
  const end = findArrayEnd(text, start);
  let rest = text.slice(end + 1);
  if (trailing) rest = rest.replace(/^,[^\n]*/, ',' + trailing); // satır sonu yorumunu değiştir
  return text.slice(0, start) + toJS(newArr) + rest;
}

const report = [];
let text = readFileSync(SHARED, 'utf8');

// ── CORE: lo/hi + a ──
const newCORE = CORE.map((traj) => {
  const c = canonById[KEY_MAP[traj.key]];
  if (c.levels.length !== traj.levels.length) throw new Error(`düzey sayısı uyuşmuyor: ${traj.key}`);
  let changed = 0;
  const levels = traj.levels.map((lv, i) => {
    const cl = c.levels[i];
    if (lv.lo !== cl.ageMinM || lv.hi !== cl.ageMaxM || lv.a !== cl.age) changed++;
    const { n, lo, hi, a, ...rest } = lv; // alan sırası: n, lo, hi, a, ...
    void lo; void hi; void a;
    return { n, lo: cl.ageMinM, hi: cl.ageMaxM, a: cl.age, ...rest };
  });
  report.push(`  ✓ CORE ${traj.key.padEnd(8)} ${changed} düzey bandı/etiketi güncellendi`);
  return { ...traj, levels };
});
text = spliceArray(text, 'export const CORE =', newCORE);

// ── EXT_BANDS (tüm EXT anahtarları) + EXT_AGES ──
const EXT_AGES = {};
for (const traj of EXT) {
  const c = canonById[KEY_MAP[traj.key]];
  if (c.levels.length !== traj.L.length) throw new Error(`düzey sayısı uyuşmuyor: ${traj.key} ${traj.L.length} ≠ ${c.levels.length}`);
  text = spliceObjValue(text, 'export const EXT_BANDS', traj.key, c.levels.map((l) => [l.ageMinM, l.ageMaxM]), ` // ${c.levels.length} lv`);
  EXT_AGES[traj.key] = c.levels.map((l) => l.age);
  report.push(`  ✓ EXT_BANDS ${traj.key.padEnd(8)} ${c.levels.length} düzey ← kanonik`);
}
const AGES_HEAD = '// ── Kanonik yaş ETİKETLERİ (LT_MASTER_TR: "4 yaş" / "3–4 yaş"; lo/hi bantlarıyla aynı kaynak) ──';
const agesBlock =
  AGES_HEAD + '\n' +
  'export const EXT_AGES = {\n' +
  Object.entries(EXT_AGES).map(([k, arr]) => `  ${k}: ${toJS(arr)},`).join('\n') +
  '\n}\n\n';
const DOM_MARK = "// ── EXT'i tam yapıya dönüştür";
if (text.includes('export const EXT_AGES = {')) {
  const s = text.indexOf(AGES_HEAD);
  const e = text.indexOf('}\n\n', text.indexOf('export const EXT_AGES = {')) + 3;
  text = text.slice(0, s) + agesBlock + text.slice(e);
} else {
  if (!text.includes(DOM_MARK)) throw new Error('buildDomains işareti yok');
  text = text.replace(DOM_MARK, agesBlock + DOM_MARK);
}
// buildDomains: EXT düzeylerine a etiketi
if (!text.includes('const ages = EXT_AGES[e.key]')) {
  text = text.replace('    const ivs = EXT_IV[e.key]\n', '    const ivs = EXT_IV[e.key]\n    const ages = EXT_AGES[e.key]\n');
  text = text.replace('        lo, hi, mid: (lo + hi) / 2, q: 0,\n', '        lo, hi, a: (ages && ages[i]) || null, mid: (lo + hi) / 2, q: 0,\n');
  if (!text.includes('a: (ages && ages[i]) || null')) throw new Error('buildDomains a etiketi eklenemedi');
}
text = text.replace('// Yaş bantları: EXT_BANDS[key] varsa düzey-bazlı kanonik; yoksa start–end eşit-bölme.', '// Yaş bantları: EXT_BANDS[key] düzey-bazlı kanonik (LT_MASTER_TR ay aralığı); etiket EXT_AGES[key][i].');

// ── Tek seferlik compose 11→10 uzlaştırması (EXT_TASKS/EXT_IV) ──
const T = EXT_TASKS.compose, IV = EXT_IV.compose;
if (T && T.length === 10 && /12-15 pulu/.test(T[6]) && /17 pulu/.test(T[7])) {
  const merged = "12–15 pulu iki kutuya paylaştırın: 'Toplam kaç?' Sonra 17 pulu 'bir onluk + birlikler' diye gruplatın: 'Bu kaç eder?' 20'ye dek bileşimi doğru yapar ve 1 onluk + 7 birlik = 17 diye çözerse ✓.";
  const newT = [...T.slice(0, 6), merged, T[8], T[9], "Onluk-birlik pullarla iki basamaklı bir bileşim/ayrışım istetin (ör. 23'ü ayır). Çok basamaklı işlemi doğru yaparsa ✓."];
  text = spliceObjValue(text, 'export const EXT_TASKS', 'compose', newT);
  const newIV = [...IV.slice(0, 6), IV[7], IV[8] ?? null, IV[9] ?? null, null];
  text = spliceObjValue(text, 'export const EXT_IV', 'compose', newIV);
  report.push('  ⟳ compose EXT_TASKS/EXT_IV: eski 7 (20+) + 8 (onluk-birlik) → tek düzey 7; 9–11 → 8–10');
}

writeFileSync(SHARED, text, 'utf8');
console.log('YAŞ BANDI HİZALAMA RAPORU');
console.log(report.join('\n'));
console.log(`\nYazıldı: ${SHARED}`);
