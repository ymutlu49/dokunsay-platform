// DokunSay yörünge HİZALAMA üreteci — yerel, İNDİRME YOK (yalnız Node).
// Kanonik (NuMap) ad+betimleri DokunSay'ın CORE/EXT'ine işler; DokunSay'ın
// uygulamaya-özel alanlarını (lo/hi/b/q/iv, glyphType, start/end, ctx, manip)
// KORUR. Düzey sayısı uyuşmayan yörüngeler (pattern, shape3d) DOKUNULMADAN
// bırakılır + raporlanır (içerik kararı gerektirir). Çıktı AYRI dosyaya yazılır:
// trajectories.data.aligned.js — orijinal değişmez; incelenip sonra takas edilir.
//   Çalıştır:  cd dokunsay/_platform && node scripts/gen-align.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SHARED = resolve(__dirname, '../shared/trajectories.data.js');
const CANON = resolve(__dirname, '../../../_canon/trajectory-canon.json');
const OUT = resolve(__dirname, '../shared/trajectories.data.aligned.js');

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

// Düzey-sayısı uyuşmayan yörüngelerde darboğaz (⚠) konumları — kanonik order'a göre,
// DokunSay'ın işaretlediği kavramlarla eşlenmiş (AB kurma + birim bulma / cisim tanıma + yüz sayma).
const BOTTLENECK = { pattern: new Set([3, 5]), shape3d: new Set([3, 4]) };

// ── JS literal serileştirici (DokunSay stili: tek tırnak; ' varsa çift; özel char → JSON) ──
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
  const parts = Object.entries(v).map(
    ([k, val]) => `${/^[A-Za-z_$][\w$]*$/.test(k) ? k : q(k)}: ${toJS(val)}`,
  );
  return '{ ' + parts.join(', ') + ' }';
}

const report = [];
let alignedCount = 0;
const skip = new Set();

// ── CORE hizala (levels[].n, levels[].d ← kanonik) ──
const newCORE = CORE.map((traj) => {
  const c = canonById[KEY_MAP[traj.key]];
  if (!c || c.levels.length !== traj.levels.length) {
    skip.add(traj.key);
    report.push(`  ⚠ ${traj.key.padEnd(9)} ATLANDI — DokunSay ${traj.levels.length} ≠ kanonik ${c ? c.levels.length : '?'} düzey`);
    return traj;
  }
  alignedCount++;
  report.push(`  ✓ ${traj.key.padEnd(9)} hizalandı (${traj.levels.length} düzey) → ${c.nameTr}`);
  return {
    ...traj,
    name: c.nameTr,
    levels: traj.levels.map((lv, i) => ({ ...lv, n: c.levels[i].nameTr, d: c.levels[i].desc })),
  };
});

// ── EXT hizala — sayı eşitse darboğazı KORU; eşit değilse kanonik yapıyı BENİMSE ──
const reconciled = [];
const newEXT = EXT.map((traj) => {
  const c = canonById[KEY_MAP[traj.key]];
  if (!c) { report.push(`  ? ${traj.key} — kanonik eşleşme yok`); return traj; }
  if (c.levels.length === traj.L.length) {
    alignedCount++;
    report.push(`  ✓ ${traj.key.padEnd(9)} hizalandı (${traj.L.length} düzey) → ${c.nameTr}`);
    return { ...traj, name: c.nameTr, L: traj.L.map((tri, i) => [c.levels[i].nameTr, c.levels[i].desc, tri[2] ?? 0]) };
  }
  // Düzey sayısı uyuşmuyor → kanonik benimsenir (ad+betim+yaş kanonikten; darboğaz override)
  reconciled.push(traj.key);
  alignedCount++;
  const bset = BOTTLENECK[traj.key] || new Set();
  report.push(`  ⟳ ${traj.key.padEnd(9)} UZLAŞTIRILDI ${traj.L.length}→${c.levels.length} (kanonik benimsendi) → ${c.nameTr}`);
  return { ...traj, name: c.nameTr, L: c.levels.map((l) => [l.nameTr, l.desc, bset.has(l.order) ? 1 : 0]) };
});

// ── string-duyarlı dizi-literali sonu bulucu (string içindeki [ ] sayılmaz) ──
function findArrayEnd(text, start) {
  let depth = 0, inStr = null;
  for (let i = start; i < text.length; i++) {
    const ch = text[i];
    if (inStr) {
      if (ch === '\\') { i++; continue; }
      if (ch === inStr) inStr = null;
      continue;
    }
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
  const body = arr.map((el) => innerIndent + toJS(el) + ',').join('\n');
  return text.slice(0, start) + '[\n' + body + '\n]' + text.slice(end + 1);
}
// Bir keyed-object içindeki `key: [ ... ]` dizi değerini değiştir (EXT_BANDS/TASKS/IV).
function spliceObjValue(text, objMarker, key, newArr) {
  const oi = text.indexOf(objMarker);
  if (oi < 0) throw new Error('obje yok: ' + objMarker);
  const ki = text.indexOf('\n  ' + key + ':', oi);
  if (ki < 0) throw new Error(`anahtar yok: ${key} @ ${objMarker}`);
  const start = text.indexOf('[', ki);
  const end = findArrayEnd(text, start);
  return text.slice(0, start) + toJS(newArr) + text.slice(end + 1);
}

let text = readFileSync(SHARED, 'utf8');
text = spliceArray(text, 'export const CORE =', newCORE);
text = spliceArray(text, 'export const EXT =', newEXT);

// Uzlaştırılan yörüngeler (pattern/shape3d): yaş bantlarını kanoniğe göre yeniden kur;
// görev/müdahale dizilerini kanonik düzey sayısına kırp (eksik düzeyler betime düşer).
for (const key of reconciled) {
  const c = canonById[KEY_MAP[key]];
  text = spliceObjValue(text, 'export const EXT_BANDS', key, c.levels.map((l) => [l.ageMinM, l.ageMaxM]));
  if (EXT_TASKS?.[key]) text = spliceObjValue(text, 'export const EXT_TASKS', key, EXT_TASKS[key].slice(0, c.levels.length));
  if (EXT_IV?.[key]) text = spliceObjValue(text, 'export const EXT_IV', key, EXT_IV[key].slice(0, c.levels.length));
  report.push(`     ↳ ${key}: EXT_BANDS(${c.levels.length}) + TASKS/IV kırpıldı`);
}
// üst not
text = text.replace(
  '// ════════════════════════════════════════════════════════════════════════\n\n// ── ÇEKİRDEK',
  '// ════════════════════════════════════════════════════════════════════════\n// NOT: CORE/EXT ad+betimleri NuMap KANONİĞİNE hizalı (gen-align.mjs). Uygulamaya-özel\n// alanlar (lo/hi/b/q/iv, glyphType, start/end) korunur. pattern/shape3d hizalanmadı (düzey sayısı).\n\n// ── ÇEKİRDEK',
);

writeFileSync(OUT, text, 'utf8');
console.log(`HİZALAMA RAPORU (${alignedCount}/20 yörünge):`);
console.log(report.join('\n'));
console.log(`\nUzlaştırılan (kanonik düzey sayısı benimsendi): ${reconciled.join(', ') || 'yok'}`);
console.log(`Atlanan: ${[...skip].join(', ') || 'yok'}`);
console.log(`\nÇıktı: ${OUT}\nOrijinal DEĞİŞMEDİ. İncele → onayla → takas.`);
