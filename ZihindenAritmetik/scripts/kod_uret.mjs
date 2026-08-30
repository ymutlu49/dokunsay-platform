/**
 * Kitap erişim kodlarını üretir.
 *
 * Bir baskı partisi için N adet kod üretir ve iki ayrı çıktı verir:
 *
 *   1. src/content/kodlar.json  — uygulamaya gömülen ÖZETLER (depoya girer)
 *   2. _kodlar/<parti>.csv      — basılacak DÜZ kodlar (depoya GİRMEZ)
 *
 * Düz kodlar depoya işlenirse kilidin bir anlamı kalmaz; bu yüzden çıktı
 * klasörü .gitignore'dadır. Yedeğini ayrıca saklayın: kodlar yalnızca burada
 * üretilir, kaybolursa geri getirilemez (uygulama yalnızca özetleri bilir).
 *
 * Kullanım:
 *   node scripts/kod_uret.mjs --adet 2000 --parti "2026-1"          # ilk baskı
 *   node scripts/kod_uret.mjs --adet 1000 --parti "2026-2" --ekle   # ikinci baskı
 *
 * `--ekle` olmadan yeni bir tuz üretilir ve önceki partinin özetleri silinir;
 * yani ELDEKI KITAPLARIN KODLARI ARTIK AÇMAZ. İkinci baskıda neredeyse her
 * zaman `--ekle` istenir: aynı tuz korunur, yeni özetler eskilerin üstüne
 * eklenir, eski kitap sahipleri açmaya devam eder.
 *
 * Doğrulama tarayıcıda yapılır: girilen kod PBKDF2 ile özetlenip listede
 * aranır. Koruma esas olarak kod uzayının büyüklüğünden gelir (aşağıya bkz.);
 * PBKDF2'nin yavaşlığı onun üstüne binen ikinci maliyettir.
 *
 * Üretim maliyeti: kod başına ~0,2 sn (Node), yani 2000 kod ≈ 7 dakika. Bu
 * yalnızca baskı öncesi bir kez ödenir.
 */
import { pbkdf2Sync, randomBytes } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const APP = path.dirname(HERE);

/** Karışabilen harfler yok: 0/O, 1/I/L dışarıda (NuMap'in kod alfabesiyle aynı). */
const ALFABE = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
// Uzunluk kaba kuvvete karşı yinelemeden daha ucuz ve daha etkili bir kaldıraçtır:
// yineleme artışı doğrulamayı da yavaşlatır, uzunluk artışı yalnızca saldırganı.
// 31^12 ≈ 7,9 × 10^17; bir baskıda 2000 geçerli kod varsa saldırganın beklediği
// deneme sayısı ≈ 4 × 10^14 — GPU ile bile onlarca yıl.
const UZUNLUK = 12;
const YINELEME = 600_000; // tarayıcıda ~50 ms; kullanıcı fark etmez
const OZET_BAYT = 10; // 80 bit — bu boyutta çakışma olasılığı yok denecek kadar az

function arg(ad, varsayilan) {
  const i = process.argv.indexOf('--' + ad);
  return i > -1 && process.argv[i + 1] ? process.argv[i + 1] : varsayilan;
}

/** Kullanıcı ne yazarsa yazsın aynı biçime indirger: büyük harf, ayraçsız. */
export function normalle(kod) {
  return String(kod)
    .toUpperCase()
    .split('')
    .filter((c) => ALFABE.includes(c))
    .join('');
}

function kodUret() {
  const b = randomBytes(UZUNLUK * 2);
  let out = '';
  for (let i = 0; out.length < UZUNLUK; i++) out += ALFABE[b[i] % ALFABE.length];
  return out;
}

/** Okunaklı biçim: 4+4+4. Basılırken böyle görünür. */
function bicimle(kod) {
  return kod.slice(0, 4) + '-' + kod.slice(4, 8) + '-' + kod.slice(8);
}

function ozetle(kod, tuzB64) {
  const tuz = Buffer.from(tuzB64, 'base64');
  return pbkdf2Sync(normalle(kod), tuz, YINELEME, OZET_BAYT, 'sha256').toString('base64url');
}

function main() {
  const adet = Number(arg('adet', '2000'));
  const parti = arg('parti', new Date().toISOString().slice(0, 10));
  if (!Number.isInteger(adet) || adet < 1 || adet > 200_000) {
    console.error('--adet 1 ile 200000 arasında bir tam sayı olmalı.');
    process.exit(1);
  }

  const ekle = process.argv.includes('--ekle');
  const hedef = path.join(APP, 'src', 'content', 'kodlar.json');
  const oncekiVar = existsSync(hedef);

  /**
   * Ekleme kipinde önceki dosyanın tuzu ve yineleme sayısı KORUNUR — yoksa
   * eski kodların özetleri yeniden hesaplanamaz ve eldeki kitaplar açmaz.
   */
  let tuz = randomBytes(16).toString('base64');
  let eskiOzetler = [];
  if (ekle) {
    if (!oncekiVar) {
      console.error('--ekle verildi ama src/content/kodlar.json yok. İlk parti için --ekle kullanmayın.');
      process.exit(1);
    }
    const onceki = JSON.parse(readFileSync(hedef, 'utf-8'));
    if (onceki.yineleme !== YINELEME || onceki.ozetBayt !== OZET_BAYT) {
      console.error(
        `Önceki dosya farklı parametrelerle üretilmiş (yineleme ${onceki.yineleme}, ozetBayt ${onceki.ozetBayt}).`,
      );
      console.error('Ekleme yapılamaz: eski kodlar yeni parametrelerle doğrulanamaz.');
      process.exit(1);
    }
    tuz = onceki.tuz;
    eskiOzetler = onceki.ozetler;
  } else if (oncekiVar) {
    const onceki = JSON.parse(readFileSync(hedef, 'utf-8'));
    console.warn(`UYARI: "${onceki.parti}" partisinin ${onceki.ozetler.length} kodu siliniyor.`);
    console.warn('       Eldeki kitapların kodları artık açmayacak.');
    console.warn('       Eski baskıyı yaşatmak için --ekle kullanın.');
  }

  const kodlar = new Set();
  while (kodlar.size < adet) kodlar.add(kodUret());

  const liste = [...kodlar];
  const yeniOzetler = liste.map((k) => ozetle(k, tuz));
  const ozetler = [...new Set([...eskiOzetler, ...yeniOzetler])].sort();

  // 1) Uygulamaya gömülen özetler
  writeFileSync(
    hedef,
    JSON.stringify({ parti, tuz, yineleme: YINELEME, ozetBayt: OZET_BAYT, ozetler }, null, 1),
  );

  // 2) Basılacak düz kodlar — depoya girmez
  const kodDizin = path.join(APP, '_kodlar');
  mkdirSync(kodDizin, { recursive: true });
  const csv = path.join(kodDizin, `kodlar-${parti}.csv`);
  writeFileSync(csv, 'sira,kod\n' + liste.map((k, i) => `${i + 1},${bicimle(k)}`).join('\n') + '\n');

  const kb = (JSON.stringify(ozetler).length / 1024).toFixed(0);
  console.log(`parti      : ${parti}${ekle ? ' (eklendi)' : ''}`);
  console.log(`yeni kod   : ${adet}`);
  if (ekle) console.log(`devredilen : ${eskiOzetler.length}`);
  console.log(`toplam     : ${ozetler.length}`);
  console.log(`özetler    : ${path.relative(APP, hedef)}  (~${kb} KB, depoya girer)`);
  console.log(`düz kodlar : ${path.relative(APP, csv)}  (DEPOYA GİRMEZ — yedekleyin)`);
  console.log(`örnek      : ${bicimle(liste[0])}`);
}

main();
