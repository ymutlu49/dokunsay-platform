#!/usr/bin/env node
/**
 * DokunSay — Yörünge ÇALIŞMA YAPRAĞI üreteci
 * ────────────────────────────────────────────────────────────────────────
 * Her yörünge için baskı-optimize bir HTML "çalışma yaprağı paketi":
 * düzey başına bir A4 çalışma yaprağı (çocuğa yönelik alıştırmalar). Pedagojik
 * omurga: CRA (Somut→Temsilî→Soyut) + açık öğretim + sayı duyusu. Diskalkuli/
 * disleksi-dostu tipografi (Poppins+Lexend, büyük punto, 1.5 satır, krem zemin,
 * sola hizalı, bol beyaz alan). "Yazdır / PDF kaydet" ile çıktı alınır.
 *
 * Görsel/alıştırma motoru: shared/yorunge.worksheet.js
 * Çıktı: public/yorunge/<key>/calisma-yapraklari.html (+ dist-site kopyası)
 *
 * Çalıştır:  node _platform/scripts/build-yorunge-worksheets.mjs [key ...]
 *   (key verilmezse tüm 20 yörünge; örn. `... sub count` yalnız o ikisi)
 */
import { mkdirSync, existsSync, writeFileSync, copyFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { DOMAINS, STRANDS } from '../shared/trajectories.data.js'
import { enrichOf } from '../shared/yorunge.enrich.js'
import { misOf, MISCONCEPTIONS } from '../shared/yorunge.misconceptions.js'
import {
  esc, craIndex, CRA, childObjective, methodSteps,
  buildExample as buildExampleGen, buildExercises as buildExercisesGen,
  buildPlay, isPlayLevel, exWide, toolName, toolUrl,
} from '../shared/yorunge.worksheet.js'
import { buildExample as buildExampleDS, buildExercises as buildExercisesDS } from '../shared/yorunge.worksheet-dokunsay.js'

// --dokunsay → YALNIZCA gerçek DokunSay materyal çizimleriyle ek set üret
const DOKUNSAY = process.argv.includes('--dokunsay')
const buildExample = DOKUNSAY ? buildExampleDS : buildExampleGen
const buildExercises = DOKUNSAY ? buildExercisesDS : buildExercisesGen
const OUTFILE = DOKUNSAY ? 'calisma-yapraklari-dokunsay.html' : 'calisma-yapraklari.html'
const VARIANT = DOKUNSAY ? ' · DokunSay materyalleriyle' : ''

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..', '..')
const OUT_PUBLIC = join(ROOT, '_platform', 'launcher', 'public', 'yorunge')
const OUT_DIST = join(ROOT, 'dist-site', 'yorunge')

// ── KORUMA: yanılgı verisi ↔ kanon hizası ────────────────────────────────
// Düzey sayısı değişince yanılgılar KAYAR: 7. düzeyin yanılgısı 8. düzeye basılır ve
// bu çıktıya bakınca fark edilmez (metin yine makul görünür). Sessiz kaymaktansa
// üretimi durdurmak yeğdir. Az kayıt sorun değil (misOf undefined → şerit çizilmez);
// FAZLA kayıt kanonun küçüldüğünü gösterir, o zaman hizalama elle gözden geçirilmeli.
{
  const bozuk = []
  for (const d of DOMAINS) {
    const list = MISCONCEPTIONS[d.key] || []
    if (list.length > d.levels.length) bozuk.push(`${d.key}: ${list.length} yanılgı > ${d.levels.length} düzey`)
    // cite ALAN BULAŞMASI: veri bir kez HTML'den regex ile çıkarıldı ve son grup şeridin
    // kapanışını aşıp alttaki "✓ Başardım … ☆☆☆" ölçütünü yuttu (117'nin 85'inde, canlıya
    // çıktı). Atıf kısa bir kaynak künyesidir; ölçüt metni ya da yıldız içeremez.
    list.forEach((x, i) => {
      if (/[✓☆]/.test(x.cite) || x.cite.length > 60)
        bozuk.push(`${d.key}[${i}]: cite alanına başka metin bulaşmış → "${x.cite.slice(0, 45)}…"`)
    })
  }
  if (bozuk.length) {
    console.error('✗ Yanılgı verisi kanonla uyuşmuyor:\n  ' + bozuk.join('\n  '))
    console.error('  shared/yorunge.misconceptions.js düzey sırasına göre güncellenmeli.')
    process.exit(1)
  }
}

const STRAND_COLOR = { say: '#2E7D32', cebir: '#6f8f1f', geo: '#7c3aed', olcme: '#0d9488', veri: '#2563eb' }
const STRAND_LABEL = Object.fromEntries(STRANDS.map((s) => [s.key, s.label]))
const ICON = { sub: '👁️', count: '🔢', comp: '⚖️', add: '➕', compose: '🧩', multdiv: '✖️', frac: '🍕', pattern: '🔁', shape2d: '🔷', comp2d: '🧱', disembed: '🔍', shape3d: '🧊', comp3d: '📦', spviz: '🧠', sporient: '🧭', mlen: '📏', marea: '🟩', mvol: '🧴', mang: '📐', classif: '🗂️' }

const ageBand = (lo, hi) => {
  const a = Math.max(0, Math.round(lo / 12)), b = Math.round(hi / 12)
  return a === b ? `${b} yaş` : `${a}–${b} yaş`
}

// Üçlü Kod nişanı (amber yuvarlatılmış kare + 3 pul)
const LOGO = `<svg viewBox="0 0 32 32" class="logo" aria-hidden="true"><rect width="32" height="32" rx="8" fill="#f59e0b"/><circle cx="9" cy="16" r="3.4" fill="#fff"/><circle cx="16" cy="16" r="3.4" fill="#fff"/><circle cx="23" cy="16" r="3.4" fill="#fff"/></svg>`

function craBar(focus, color) {
  return '<span class="cra">' + CRA.map((t, k) =>
    `<span class="cra-s${k === focus ? ' on' : ''}"${k === focus ? ` style="background:${color}"` : ''}>${t}</span>`
  ).join('<span class="cra-arr">→</span>') + '</span>'
}

function exHTML(ex, n, isEg) {
  const wide = !isEg && exWide(ex)
  return `<div class="ex${isEg ? ' eg' : ''}${wide ? ' wide' : ''}">
    <div class="ex-q"><span class="ex-no">${isEg ? '👀' : n}</span><p>${ex.q}</p></div>
    ${ex.vis ? `<div class="ex-v">${ex.vis}</div>` : ''}
    ${ex.ans ? `<div class="ex-a">${ex.ans}</div>` : ''}
  </div>`
}

function sheetHTML(domain, i) {
  const lv = domain.levels[i], en = enrichOf(domain.key, i), color = STRAND_COLOR[domain.strand] || '#2E7D32'
  const focus = craIndex(lv)
  const play = isPlayLevel(lv)
  const steps = methodSteps(domain, lv, en)
  const eg = play ? null : buildExample(domain, i, lv, en, color)
  const items = play ? buildPlay(domain, i, lv, en) : buildExercises(domain, i, lv, en, color)
  const a = en && en.act
  const mats = a && a.materials ? a.materials.join(' · ') : ''
  let n = 0
  return `<section class="sheet" style="--c:${color}">
  <header class="ws-head">
    <div class="ws-top">
      <span class="ws-brand">${LOGO}<b>DokunSay</b> · Çalışma Yaprağı</span>
      <span class="ws-name">Ad: <span class="nl"></span>　Tarih: <span class="nl sm"></span></span>
    </div>
    <div class="ws-eyebrow">${ICON[domain.key] || '•'} ${esc(STRAND_LABEL[domain.strand] || '')} · ${esc(domain.name)}</div>
    <h1 class="ws-title"><span class="ws-no">${i + 1}</span>${esc(lv.n)}</h1>
    <div class="ws-meta">
      <span class="pill">${ageBand(lv.lo, lv.hi)}</span>
      <span class="pill">Düzey ${i + 1}/${domain.levels.length}</span>
      ${lv.b ? '<span class="pill warn">★ Kritik geçiş</span>' : ''}
      ${craBar(focus, color)}
    </div>
  </header>

  <div class="ws-obj"><span class="lbl">🎯 Hedef</span><p>${esc(childObjective(lv, en))}</p></div>

  <div class="ws-method">
    <span class="lbl">🧭 Nasıl çalışılır</span>
    <ol class="msteps">${steps.map((s) => `<li><b>${s.t}</b> — ${esc(s.d)}</li>`).join('')}</ol>
  </div>

  ${eg ? `<div class="ws-egbox"><span class="lbl">👀 Örnek</span>${exHTML(eg, 0, true)}</div>` : ''}

  <div class="ws-items"><span class="lbl">${play ? '🎲 Birlikte oyna (siz yönlendirin)' : '✏️ Alıştırmalar'}</span>
    <div class="items-grid">${items.map((ex) => exHTML(ex, ++n, false)).join('')}</div>
  </div>

  ${(a && (a.easy || a.hard)) ? `<div class="ws-scaffold">
    ${a.easy ? `<div class="sc sc-easy"><b>↓ Zorlanırsa</b> ${esc(a.easy)}</div>` : ''}
    ${a.hard ? `<div class="sc sc-hard"><b>↑ Kolay gelirse</b> ${esc(a.hard)}</div>` : ''}
  </div>` : ''}

  ${(() => {
    // KAVRAM YANILGISI ŞERİDİ — düzeye özgü. Veri yoksa şerit HİÇ çizilmez:
    // genel bir yanılgı uydurup her sayfaya basmak, öğretmeni yanlış yönlendirir.
    const m = misOf(domain.key, i)
    return m ? `<div class="ws-mis"><b>⚠️ Sık yapılan hata:</b> ${esc(m.err)} <b>→ Ne yapmalı:</b> ${esc(m.fix)} <span class="mis-cite">📖 ${esc(m.cite)}</span></div>` : ''
  })()}

  <div class="ws-foot">
    <div class="ws-check"><b>✓ Başardım:</b> ${a && a.criterion ? esc(a.criterion) : esc(childObjective(lv, en))}
      <span class="stars" title="Kendini değerlendir">☆ ☆ ☆</span></div>
    <div class="ws-credit">
      ${mats ? `<span class="mat">🧰 ${esc(mats)}${(() => {
        // Adres METİN olarak yazılır: baskıda tıklanamayacağı için @media print'te
        // a::after ile URL eklemeye gerek kalmaz, düzen de hiç değişmez.
        //
        // Bağlantı YALNIZCA yaprak gerçekten DokunSay materyali kullanıyorsa basılır.
        // Erken düzeylerin materyali battaniye, tekerleme, tangram, menteşeli kapı
        // olabiliyor; oralara araç adresi koymak onu listelenmiş bir materyal gibi
        // gösteriyordu (32 yaprakta). Materyal satırı ölçüt: ürün adı geçmiyorsa link yok.
        // Materyal satırı BELİRLİ bir ürünü adlandırıyorsa bağlantı ona gider.
        // Yörünge geneli 'bar' olsa da tek tek düzeyler başka araç isteyebiliyor:
        // sub#11 "DokunSay Basamak blokları" diyip Bar'a bağlanıyordu (3 yaprakta).
        const ozel = /Basamak blok|onluk çubu/i.test(mats) ? 'https://dokunsay.com/DokunSayBasamak/'
          : /DokunSay Kesir|kesir dairesi/i.test(mats) ? 'https://dokunsay.com/DokunSayKesir/'
          : null
        const u = ozel || toolUrl(domain, en)
        const dokunsayMateryali = /DokunSay|onluk kart|Basamak blok|Kesir|Geo/i.test(mats)
        return (u && dokunsayMateryali) ? ` <a href="${u}">🔗 ${u.replace(/^https?:\/\//, '')}</a>` : ''
      })()}</span>` : ''}
      <span>Prof. Dr. Yılmaz Mutlu · Her Çocuk Matematik Öğrenebilir · Clements &amp; Sarama · dokunsay.com/yorunge/${domain.key}/</span>
    </div>
  </div>
</section>`
}

function pageHTML(domain) {
  const color = STRAND_COLOR[domain.strand] || '#2E7D32'
  const sheets = domain.levels.map((_, i) => sheetHTML(domain, i)).join('\n')
  return `<!doctype html>
<html lang="tr">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>${esc(domain.name)} — Çalışma Yaprakları · DokunSay</title>
<meta name="description" content="${esc(domain.name)} öğrenme yörüngesi için her düzeye bir baskıya hazır çalışma yaprağı. CRA (somut→temsilî→soyut) temelli, diskalkuli-dostu. Clements &amp; Sarama.">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@500;600;700;800&family=Lexend:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
:root{ --c:${color}; --ink:#1f2733; --body:#39434f; --mut:#7c8aa0; --line:#e7e2d6; --paper:#fffdf7; --tint:color-mix(in srgb, var(--c) 8%, #fffdf7); }
*{ box-sizing:border-box; -webkit-print-color-adjust:exact; print-color-adjust:exact; }
html,body{ margin:0; background:#eceae3; font-family:'Lexend',system-ui,Segoe UI,sans-serif; color:var(--body); }
.bar{ position:sticky; top:0; z-index:9; display:flex; gap:14px; align-items:center; justify-content:space-between;
  background:#fff; border-bottom:1px solid #dcd8cd; padding:11px 18px; box-shadow:0 1px 6px rgba(0,0,0,.05); }
.bar .t{ font-family:'Poppins',sans-serif; font-weight:700; color:var(--ink); font-size:15px; }
.bar .t small{ display:block; font-weight:500; color:var(--mut); font-size:12px; }
.bar .actions{ display:flex; gap:9px; }
.btn{ font-family:'Poppins',sans-serif; font-weight:600; font-size:13.5px; border:0; border-radius:10px; padding:9px 15px; cursor:pointer; text-decoration:none; }
.btn-print{ background:var(--c); color:#fff; } .btn-back{ background:#eef1f4; color:#334155; }
.wrap{ max-width:880px; margin:18px auto 40px; padding:0 14px; }

/* ── A4 çalışma yaprağı ───────────────────────────────────────────── */
.sheet{ background:var(--paper); width:210mm; height:297mm; overflow:hidden; margin:0 auto 20px; padding:11mm 13mm 6mm;
  border-radius:4px; box-shadow:0 6px 26px rgba(31,39,51,.13); position:relative;
  display:flex; flex-direction:column; gap:1.8mm; }
.lbl{ display:inline-block; font-family:'Poppins',sans-serif; font-weight:700; font-size:10.5pt; color:var(--c); letter-spacing:.2px; margin-bottom:2px; }

.ws-head{ border-bottom:3px solid var(--c); padding-bottom:7px; }
.ws-top{ display:flex; justify-content:space-between; align-items:center; font-size:10pt; color:var(--mut); }
.ws-brand{ display:inline-flex; align-items:center; gap:7px; font-family:'Poppins',sans-serif; }
.ws-brand b{ color:var(--ink); } .logo{ width:22px; height:22px; }
.ws-name{ font-size:9.5pt; } .nl{ display:inline-block; width:34mm; border-bottom:1.4px dotted #b8c0cc; } .nl.sm{ width:24mm; }
.ws-eyebrow{ font-family:'Poppins',sans-serif; font-weight:600; font-size:10pt; color:var(--c); margin-top:8px; text-transform:uppercase; letter-spacing:.4px; }
.ws-title{ font-family:'Poppins',sans-serif; font-weight:800; font-size:18pt; line-height:1.1; color:var(--ink); margin:2px 0 6px; display:flex; align-items:baseline; gap:8px; }
.ws-no{ background:var(--c); color:#fff; font-size:12pt; min-width:27px; height:27px; padding:0 6px; border-radius:8px; display:inline-flex; align-items:center; justify-content:center; }
.ws-meta{ display:flex; flex-wrap:wrap; gap:7px; align-items:center; }
.pill{ font-family:'Poppins',sans-serif; font-weight:600; font-size:9.5pt; background:#eef2f7; color:#475569; border-radius:20px; padding:4px 11px; }
.pill.warn{ background:#fff3e2; color:#9a3412; }
.cra{ display:inline-flex; align-items:center; gap:4px; margin-left:auto; }
.cra-s{ font-family:'Poppins',sans-serif; font-weight:600; font-size:9pt; color:#94a3b8; background:#f1f4f8; border-radius:7px; padding:3px 9px; }
.cra-s.on{ color:#fff; } .cra-arr{ color:#cbd5e1; font-size:10pt; }

.ws-obj{ background:var(--tint); border-radius:10px; padding:7px 12px; }
.ws-obj p{ margin:1px 0 0; font-size:11pt; line-height:1.42; color:var(--ink); }
.ws-method .msteps{ margin:1px 0 0; padding-left:0; list-style:none; display:flex; flex-direction:column; gap:2px; counter-reset:m; }
.ws-method .msteps li{ font-size:10pt; line-height:1.32; padding-left:26px; position:relative; }
.ws-method .msteps li::before{ counter-increment:m; content:counter(m); position:absolute; left:0; top:0;
  width:21px; height:21px; border-radius:50%; background:var(--c); color:#fff; font-family:'Poppins',sans-serif; font-weight:700; font-size:10pt; display:flex; align-items:center; justify-content:center; }
.ws-method .msteps b{ color:var(--c); }

.ws-egbox{ background:#f4f8f5; border:1.5px dashed color-mix(in srgb,var(--c) 45%,#cbd5e1); border-radius:10px; padding:6px 12px 7px; }
.ws-egbox .lbl{ color:color-mix(in srgb,var(--c) 70%, #166534); }

.items-grid{ display:grid; grid-template-columns:1fr 1fr; gap:5px; margin-top:2px; align-items:start; }
.ex{ border:1.4px solid var(--line); border-radius:11px; padding:7px 10px 8px; background:#fff; break-inside:avoid; }
.ex.wide{ grid-column:1 / -1; }
.ex.eg{ border:0; padding:2px 0 0; background:transparent; grid-column:1 / -1; }
.ex-q{ display:flex; gap:7px; align-items:flex-start; }
.ex-no{ flex:0 0 auto; width:22px; height:22px; border-radius:50%; background:var(--c); color:#fff; font-family:'Poppins',sans-serif; font-weight:700; font-size:10.5pt; display:flex; align-items:center; justify-content:center; }
.ex.eg .ex-no{ background:#fef3c7; }
.ex-q p{ margin:1px 0 0; font-size:10.8pt; line-height:1.4; color:var(--ink); }
.ex-v{ margin:4px 0 3px; text-align:center; } .ex-a{ margin:0; text-align:center; }
.ex.wide .ex-v, .ex.wide .ex-a, .ex.eg .ex-v, .ex.eg .ex-a{ text-align:left; margin-left:30px; }

/* SVG görseller — içsel boyut ama A4'e sığması için yükseklik sınırlı */
.ws-svg{ max-width:100%; width:auto; height:auto; vertical-align:middle; }
.ex-v .ws-svg{ max-height:16mm; }
.ex-v .ws-svg.ws-tall{ max-height:17mm; }
.ws-egbox .ex-v .ws-svg{ max-height:12mm; } .ws-egbox .ex-v .ws-svg.ws-tall{ max-height:13mm; }
.ex-v .ws-frac{ max-height:26mm; } .ws-svg.ws-frac{ width:auto; max-height:26mm; } svg.ws-glyph{ width:12mm; height:12mm; }
.pat-row{ display:flex; align-items:center; gap:7px; flex-wrap:wrap; }
.pat-c svg{ width:13mm; height:13mm; } .pat-q{ width:13mm; height:13mm; border:2px dashed #b8c0cc; border-radius:8px; display:inline-flex; align-items:center; justify-content:center; font-family:'Poppins',sans-serif; font-weight:800; font-size:16pt; color:#b8c0cc; }

/* Yanıt alanları */
.wbox{ display:inline-block; width:14mm; height:14mm; border:2px solid #94a3b8; border-radius:8px; vertical-align:middle; margin:0 3px; background:#fff; }
.wbox.wbox-lg{ width:18mm; height:14mm; border-color:var(--c); }
.eqrow{ display:flex; align-items:center; flex-wrap:wrap; gap:5px; font-family:'Poppins',sans-serif; font-weight:600; font-size:15pt; color:var(--ink); }
.bignum{ font-family:'Poppins',sans-serif; font-weight:700; font-size:17pt; color:var(--ink); } .bignum.sm{ font-size:14pt; padding:0 3px; }
.seqn{ font-family:'Poppins',sans-serif; font-weight:600; font-size:14pt; } .seqsep{ color:#94a3b8; }
.ans-hint{ margin:5px 0 0 0; font-size:10.5pt; color:var(--mut); font-style:normal; }
.ans-shown{ font-family:'Poppins',sans-serif; font-size:14pt; color:#166534; }

.ws-scaffold{ display:flex; gap:8px; flex-wrap:wrap; }
.sc{ flex:1 1 44%; font-size:9.8pt; line-height:1.30; border-radius:9px; padding:5px 10px; }
.sc-easy{ background:#eef4fb; } .sc-easy b{ color:#1d4ed8; }
.sc-hard{ background:#f5f0fb; } .sc-hard b{ color:#7c3aed; }

.ws-foot{ margin-top:auto; padding-top:5px; border-top:1px solid var(--line); display:flex; flex-direction:column; gap:4px; }
.ws-check{ background:#f0fdf4; border-radius:9px; padding:5px 11px; font-size:10pt; line-height:1.35; color:#166534; display:flex; justify-content:space-between; align-items:center; gap:10px; }
.ws-check b{ color:#15803d; } .stars{ font-size:14pt; color:#f59e0b; letter-spacing:2px; white-space:nowrap; }
.ws-credit{ font-size:7.8pt; color:var(--mut); line-height:1.35; display:flex; flex-direction:column; gap:1px; }
.ws-credit .mat{ color:#475569; }
.ws-credit a{ color:#475569; }
/* Kavram yanılgısı şeridi. Punto (8.7pt) künyeden (7.8pt) büyük ama gövde metninden
   küçük: öğretmene yönelik ikincil bilgi, çocuğun göreviyle yarışmamalı. Yapraklar
   milimetrik dolu olduğu için bu ölçüler A4 taşmasına karşı ölçülerek seçildi. */
.ws-mis{ background:#fff7ed; border-left:3px solid #fb923c; border-radius:9px; padding:3px 10px; font-size:8.7pt; line-height:1.26; color:#7c2d12; }
.ws-mis b{ color:#9a3412; font-weight:700; }
.ws-mis .mis-cite{ color:#a16207; white-space:nowrap; }

/* ── Baskı ─────────────────────────────────────────────────────────── */
@media print{
  @page{ size:A4; margin:0; }
  html,body{ background:#fff; }
  .bar,.wrap>.intro{ display:none !important; }
  .wrap{ margin:0; padding:0; max-width:none; }
  .sheet{ width:210mm; height:297mm; margin:0; border-radius:0; box-shadow:none; overflow:hidden; break-before:page; }
  .sheet:first-child{ break-before:avoid; }
}
.intro{ background:#fff; border-radius:14px; padding:16px 20px; margin-bottom:18px; box-shadow:0 2px 10px rgba(0,0,0,.05); }
.intro h2{ font-family:'Poppins',sans-serif; margin:0 0 5px; color:var(--ink); font-size:18px; }
.intro p{ margin:0; font-size:13.5px; line-height:1.55; color:#5b6573; }
</style>
</head>
<body>
<div class="bar no-print">
  <span class="t">${ICON[domain.key] || '•'} ${esc(domain.name)} — Çalışma Yaprakları<small>${domain.levels.length} düzey · ${esc(STRAND_LABEL[domain.strand] || '')} · CRA temelli${VARIANT}</small></span>
  <span class="actions">
    <a class="btn btn-back" href="./">← Yörüngeye dön</a>
    <button class="btn btn-print" onclick="window.print()">🖨️ Yazdır / PDF kaydet</button>
  </span>
</div>
<div class="wrap">
  <div class="intro no-print">
    <h2>${esc(domain.name)} · Çalışma Yaprakları${VARIANT}</h2>
    <p>${DOKUNSAY
      ? `Her düzey için bir baskıya-hazır A4 çalışma yaprağı — <b>tüm görseller gerçek ${esc(toolName(domain, enrichOf(domain.key, 0)))} materyalinin çizimleridir</b> (sayı çubuğu + pul, onluk kart, Basamak blokları, Kesir, Geo). Çocuk önce <b>somut araçla</b> yapar, sonra <b>sayfadaki aynı materyalin çiziminde</b> gösterir, en sonda <b>sembolü yazar</b> — sayfa ile araç birebir örtüşür. Çocuğun düzeyinden başlayın; ✓ölçütü karşılayınca sonraki yaprağa geçin.`
      : `Her düzey için bir baskıya-hazır A4 çalışma yaprağı. Her yaprak <b>önce somut</b> (${esc(toolName(domain, enrichOf(domain.key, 0)))} ile), <b>sonra resimle</b> (bu sayfa), <b>en sonda sembolle</b> (çocuk yazar) ilerler — diskalkuli için kanıta dayalı CRA sırası. Çocuğun bulunduğu düzeyden başlayın; ✓ölçütü karşılayınca bir sonraki yaprağa geçin. Yazdırıp tek tek kullanın ya da PDF olarak kaydedin.`}</p>
  </div>
  ${sheets}
</div>
</body>
</html>`
}

// ── Çalıştır ───────────────────────────────────────────────────────────────
const wanted = process.argv.slice(2).filter((a) => !a.startsWith('--'))
const list = wanted.length ? DOMAINS.filter((d) => wanted.includes(d.key)) : DOMAINS
if (!list.length) { console.error('Eşleşen yörünge yok: ' + wanted.join(', ')); process.exit(1) }

let n = 0, sheets = 0
for (const domain of list) {
  const html = pageHTML(domain)
  const pubDir = join(OUT_PUBLIC, domain.key); mkdirSync(pubDir, { recursive: true })
  const pubPath = join(pubDir, OUTFILE)
  writeFileSync(pubPath, html, 'utf8')
  if (existsSync(OUT_DIST)) {
    const distDir = join(OUT_DIST, domain.key); mkdirSync(distDir, { recursive: true })
    copyFileSync(pubPath, join(distDir, OUTFILE))
  }
  n++; sheets += domain.levels.length
  console.log(`  ✓ ${domain.key}/${OUTFILE}  (${domain.levels.length} yaprak)`)
}
console.log(`\n${n} çalışma yaprağı paketi (${sheets} A4 yaprak) üretildi${DOKUNSAY ? ' — DokunSay materyalleriyle' : ''}.`)
