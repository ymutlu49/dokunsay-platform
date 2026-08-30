#!/usr/bin/env node
/**
 * DokunSay — Yörünge Etkinlik Kartı PDF üreteci
 * ────────────────────────────────────────────────────────────────────────
 * Her yörünge için indirilebilir bir A4 PDF "etkinlik kartı paketi":
 * düzey başına bir kart sayfası (Bu düzeyde · Nasıl görünür · Öğretmen notu ·
 * Çalakî[malzeme/adımlar/✓ölçüt/kolay-zor]) + her sayfada canlı düzeye QR kod.
 * gavbigav "Karta çalakiyê" + ABMATO üreteci modeli. pdfkit + Arial (Türkçe).
 *
 * pdfkit/qrcode ABMATO node_modules'inden createRequire ile yüklenir (kurulum yok).
 * Çıktı: public/yorunge/<key>/etkinlik-kartlari.pdf + dist-site/yorunge/<key>/...
 *
 * Çalıştır:  node _platform/scripts/build-yorunge-pdf.mjs
 */
import { createRequire } from 'node:module'
import { mkdirSync, existsSync, createWriteStream } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { DOMAINS } from '../shared/trajectories.data.js'
import { enrichOf } from '../shared/yorunge.enrich.js'

const require = createRequire('C:/Users/yilma/Desktop/Diskalkuli/abmato/package.json')
const PDFDocument = require('pdfkit')
const QRCode = require('qrcode')

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..', '..')
const OUT_PUBLIC = join(ROOT, '_platform', 'launcher', 'public', 'yorunge')
const OUT_DIST = join(ROOT, 'dist-site', 'yorunge')
const SITE = 'https://dokunsay.com'

const FONT_REG = 'C:/Windows/Fonts/arial.ttf'
const FONT_BOLD = 'C:/Windows/Fonts/arialbd.ttf'

const STRAND_COLOR = { say: '#16a34a', cebir: '#ea580c', geo: '#7c3aed', olcme: '#0d9488', veri: '#2563eb' }
const STRAND_LABEL = { say: 'Sayılar ve İşlemler', cebir: 'Cebir ve Örüntü', geo: 'Geometri ve Uzamsal', olcme: 'Ölçme', veri: 'Veri ve Sınıflama' }
const AMBER = '#f59e0b', INK = '#172033', BODY = '#3b4658', MUT = '#7c8aa0', LINE = '#e2e8f0'
const TOOL_NAME = { bar: 'DokunSay Bar', basamak: 'DokunSay Basamak', clock: 'DokunSay Clock', kesir: 'DokunSay Kesir', tam: 'DokunSay Tam', geo: 'DokunSay Geo', veri: 'DokunSay Veri' }
const DOMAIN_TOOL = { sub: 'bar', count: 'bar', comp: 'bar', add: 'bar', compose: 'bar', multdiv: 'bar', frac: 'kesir', pattern: 'bar', shape2d: 'geo', comp2d: 'geo', disembed: 'geo', shape3d: 'geo', comp3d: 'geo', spviz: 'geo', sporient: 'geo', mlen: 'bar', marea: 'bar', mvol: 'bar', mang: 'geo', classif: 'veri' }

// Arial emoji/özel-glif taşımaz → sadeleştir
const clean = (s) => String(s == null ? '' : s)
  .replace(/→/g, '->').replace(/[↗➜]/g, '->')
  .replace(/✓/g, '').replace(/[↓↑]/g, '').replace(/[★⚠✏👩‍🏫🖨️🧭]/g, '')
  .replace(/\s{2,}/g, ' ').trim()

const ageBand = (lo, hi) => {
  const a = Math.max(0, Math.round(lo / 12)), b = Math.round(hi / 12)
  return a === b ? `${b} yaş` : `${a}–${b} yaş`
}

const qrCache = new Map()
async function qrFor(url, color) {
  const k = url + color
  if (!qrCache.has(k)) qrCache.set(k, await QRCode.toBuffer(url, { margin: 0, width: 200, color: { dark: color, light: '#FFFFFF' } }))
  return qrCache.get(k)
}

// Amber yuvarlatılmış kare + 3 beyaz pul (DokunSay nişanı)
function logoMark(doc, x, y, s) {
  doc.roundedRect(x, y, s, s, s * 0.24).fill(AMBER)
  const r = s * 0.1, cy = y + s / 2
  for (let i = 0; i < 3; i++) doc.circle(x + s * (0.28 + i * 0.22), cy, r).fill('#fff')
}

function pill(doc, x, y, text, bg, ink) {
  const padX = 7, h = 15
  const pw = doc.font('bold').fontSize(8).widthOfString(text) + padX * 2
  doc.roundedRect(x, y, pw, h, 7.5).fill(bg)
  doc.fillColor(ink).font('bold').fontSize(8).text(text, x + padX, y + 4, { lineBreak: false })
  return pw
}

function sectionLabel(doc, t, color, ML) {
  if (doc.y > doc.page.height - 110) doc.addPage()
  doc.moveDown(0.5)
  doc.font('bold').fontSize(9).fillColor(color).text(t.toUpperCase(), ML, doc.y, { characterSpacing: 0.7 })
  doc.moveDown(0.25)
}

function shadeBox(doc, x, y, w, text, bg, ink, ML) {
  const padX = 11, padY = 9
  doc.font('reg').fontSize(10)
  const th = doc.heightOfString(clean(text), { width: w - padX * 2 })
  const h = th + padY * 2
  let yy = y
  if (yy + h > doc.page.height - 70) { doc.addPage(); yy = doc.y }
  doc.roundedRect(x, yy, w, h, 8).fill(bg)
  doc.fillColor(ink).font('reg').fontSize(10).text(clean(text), x + padX, yy + padY, { width: w - padX * 2 })
  doc.y = yy + h + 2
}

function levelPage(doc, domain, lv, i, ML, W, isFirst) {
  const color = STRAND_COLOR[domain.strand] || '#16a34a'
  const en = enrichOf(domain.key, i)
  if (!isFirst) doc.addPage()

  // Üst bant: nişan + marka + QR
  const top = 44, s = 26, qs = 48
  logoMark(doc, ML, top - 2, s)
  doc.font('bold').fontSize(12).fillColor(INK).text('DokunSay', ML + s + 8, top - 1, { lineBreak: false })
  doc.font('reg').fontSize(8).fillColor(MUT).text('Öğrenme Yörüngeleri', ML + s + 8, top + 13, { lineBreak: false })
  // QR -> canlı düzey
  return qrFor(`${SITE}/yorunge/${domain.key}/#lv-${i}`, color).then((qr) => {
    doc.image(qr, ML + W - qs, top - 6, { width: qs, height: qs })
    doc.font('reg').fontSize(5.5).fillColor(MUT).text('Karekodu okut', ML + W - qs - 8, top + qs - 4, { width: qs + 8, align: 'center', lineBreak: false })
    doc.moveTo(ML, top + 46).lineTo(ML + W, top + 46).lineWidth(2).strokeColor(color).stroke()

    // Eyebrow + düzey başlığı
    doc.y = top + 58
    doc.font('bold').fontSize(8.5).fillColor(color).text(`${STRAND_LABEL[domain.strand] || ''}  ·  ${domain.name.toUpperCase()}`, ML, doc.y, { characterSpacing: 0.5 })
    doc.moveDown(0.3)
    doc.font('bold').fontSize(20).fillColor(INK).text(`${i + 1}.  ${clean(lv.n)}`, ML, doc.y, { width: W })

    // Pills
    doc.moveDown(0.4)
    let px = ML, py = doc.y
    px += pill(doc, px, py, ageBand(lv.lo, lv.hi), '#eef2f7', '#475569') + 5
    px += pill(doc, px, py, `Düzey ${i + 1}/${domain.levels.length}`, '#eef2f7', '#475569') + 5
    if (lv.b) px += pill(doc, px, py, 'DARBOĞAZ - KRİTİK GEÇİŞ', '#fff3e2', '#9a3412') + 5
    doc.y = py + 22

    // Bu düzeyde
    doc.font('bold').fontSize(10).fillColor(INK).text('Bu düzeyde çocuk: ', ML, doc.y, { continued: true })
    doc.font('reg').fillColor(BODY).text(clean(lv.d), { width: W })

    if (en && en.how) { sectionLabel(doc, 'Nasıl görünür', color, ML); shadeBox(doc, ML, doc.y, W, en.how, '#f4f8f5', '#2f5337', ML) }
    if (en && en.teacher) { sectionLabel(doc, 'Öğretmen notu', '#b45309', ML); shadeBox(doc, ML, doc.y, W, en.teacher, '#fff8ee', '#7a531a', ML) }

    // Çalakî
    const a = en && en.act
    if (a) {
      sectionLabel(doc, 'Çalakî · Etkinlik', color, ML)
      if (a.materials && a.materials.length) {
        doc.font('bold').fontSize(9).fillColor(MUT).text('MALZEME', ML, doc.y); doc.moveDown(0.15)
        doc.font('reg').fontSize(10).fillColor(BODY)
        a.materials.forEach((m) => doc.text('•  ' + clean(m), ML + 4, doc.y, { width: W - 4 }))
        doc.moveDown(0.25)
      }
      if (a.steps && a.steps.length) {
        doc.font('bold').fontSize(9).fillColor(MUT).text('ADIMLAR', ML, doc.y); doc.moveDown(0.15)
        doc.fontSize(10)
        a.steps.forEach((st, k) => {
          if (doc.y > doc.page.height - 80) doc.addPage()
          doc.font('bold').fillColor(color).text(`${k + 1}.  `, ML + 2, doc.y, { continued: true, width: W })
          doc.font('reg').fillColor(BODY).text(clean(st))
          doc.moveDown(0.1)
        })
      }
      if (a.criterion) { sectionLabel(doc, 'Gözlem ölçütü', '#15803d', ML); shadeBox(doc, ML, doc.y, W, 'Başarı: ' + a.criterion, '#f0fdf4', '#166534', ML) }
      if (a.easy || a.hard) {
        doc.moveDown(0.2)
        const colW = (W - 12) / 2, x2 = ML + colW + 12, yStart = doc.y
        if (a.easy) {
          doc.font('bold').fontSize(8.5).fillColor('#475569').text('KOLAYLAŞTIR', ML, yStart)
          doc.font('reg').fontSize(9.5).fillColor(BODY).text(clean(a.easy), ML, doc.y + 1, { width: colW })
        }
        const leftEnd = doc.y
        if (a.hard) {
          doc.font('bold').fontSize(8.5).fillColor('#7c3aed').text('ZORLAŞTIR', x2, yStart)
          doc.font('reg').fontSize(9.5).fillColor(BODY).text(clean(a.hard), x2, yStart + 12, { width: colW })
        }
        doc.y = Math.max(leftEnd, doc.y)
      }
    }

    // Hangi araçlar (iv)
    if (lv.iv && lv.iv.length) {
      const tool = (en && en.tool) || DOMAIN_TOOL[domain.key] || 'bar'
      const apps = lv.iv.map((m) => m.k === 'DokunSay' ? TOOL_NAME[tool] : m.k === 'ADIM' ? 'ADIM programı' : m.k).filter((v, idx, arr) => arr.indexOf(v) === idx)
      sectionLabel(doc, 'Bu düzeyi besleyen araçlar', MUT, ML)
      doc.font('reg').fontSize(9.5).fillColor(BODY).text(apps.join('   ·   '), ML, doc.y, { width: W })
    }
  })
}

function drawFooters(doc, ML, W, key) {
  const range = doc.bufferedPageRange(), H = doc.page.height
  for (let i = 0; i < range.count; i++) {
    doc.switchToPage(range.start + i)
    doc.page.margins.bottom = 0 // alt kenara yazınca pdfkit'in yeni sayfa eklemesini önler
    doc.moveTo(ML, H - 46).lineTo(ML + W, H - 46).lineWidth(0.6).strokeColor(LINE).stroke()
    doc.font('bold').fontSize(8).fillColor('#475569').text('Prof. Dr. Yılmaz Mutlu', ML, H - 40, { width: W, align: 'center', lineBreak: false })
    doc.font('reg').fontSize(7).fillColor(MUT).text(`Her Çocuk Matematik Öğrenebilir · DokunSay · Clements & Sarama öğrenme yörüngeleri · dokunsay.com/yorunge/${key}/`, ML, H - 29, { width: W, align: 'center', lineBreak: false })
  }
}

function finalize(doc, outPath) {
  return new Promise((resolve, reject) => {
    const out = createWriteStream(outPath)
    doc.pipe(out); out.on('finish', resolve); out.on('error', reject); doc.end()
  })
}

async function trajectoryPdf(domain, outPaths) {
  const doc = new PDFDocument({ size: 'A4', margin: 46, bufferPages: true, info: { Title: `${domain.name} — Etkinlik Kartları · DokunSay`, Author: 'DokunSay · HÇMÖ · Prof. Dr. Yılmaz Mutlu', Subject: 'Öğrenme yörüngesi etkinlik kartları' } })
  doc.registerFont('reg', FONT_REG); doc.registerFont('bold', FONT_BOLD)
  const ML = doc.page.margins.left, W = doc.page.width - ML - doc.page.margins.right
  for (let i = 0; i < domain.levels.length; i++) await levelPage(doc, domain, domain.levels[i], i, ML, W, i === 0)
  drawFooters(doc, ML, W, domain.key)
  // tek doc'u iki yola yaz: önce buffer'a al, sonra kopyala — pdfkit tek stream → public'e yaz, sonra fs.copy
  await finalize(doc, outPaths[0])
}

import { copyFileSync } from 'node:fs'

if (!existsSync(FONT_REG)) { console.error('Arial fontu yok: ' + FONT_REG); process.exit(1) }
let n = 0, pages = 0
for (const domain of DOMAINS) {
  const pubDir = join(OUT_PUBLIC, domain.key); mkdirSync(pubDir, { recursive: true })
  const pubPath = join(pubDir, 'etkinlik-kartlari.pdf')
  await trajectoryPdf(domain, [pubPath])
  if (existsSync(OUT_DIST)) {
    const distDir = join(OUT_DIST, domain.key); mkdirSync(distDir, { recursive: true })
    copyFileSync(pubPath, join(distDir, 'etkinlik-kartlari.pdf'))
  }
  n++; pages += domain.levels.length
  console.log(`  ✓ ${domain.key}/etkinlik-kartlari.pdf  (${domain.levels.length} kart)`)
}
console.log(`\n${n} PDF paketi (${pages} kart sayfası) üretildi.`)
