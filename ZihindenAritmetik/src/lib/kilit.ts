/**
 * Kitap erişim kodu.
 *
 * Kodlar bir baskı partisi için üretilir (scripts/kod_uret.mjs); uygulamaya
 * yalnızca PBKDF2 özetleri gömülür, düz kodlar hiçbir zaman depoya girmez.
 * Doğrulama tamamen tarayıcıda yapılır — sunucu yoktur, kod girildikten
 * sonra uygulama çevrimdışı da açılır.
 *
 * Bunun ne olduğu konusunda açık olmak gerekir: bu bir kopya koruması değil,
 * "kitabı aldınız mı?" kapısıdır. Özetler paketten çıkarılabilir, dolayısıyla
 * kaba kuvvet çevrimdışı denenebilir. Denemeyi pratikte imkânsız kılan asıl
 * şey kod uzayının büyüklüğüdür: 31^12 ≈ 7,9 × 10^17; bir baskıda 2000
 * geçerli kod olsa bile beklenen deneme sayısı ≈ 4 × 10^14. PBKDF2'nin
 * yavaşlığı (600.000 yineleme) bunun üstüne binen ikinci maliyettir —
 * tarayıcıda ~50 ms sürer, kullanıcı fark etmez.
 *
 * Buna karşılık sızan bir kod iptal edilemez; iptal gerekiyorsa doğrulamanın
 * sunucuya taşınması gerekir.
 */
import kodlar from '../content/kodlar.json';

interface KodDosyasi {
  parti: string;
  tuz: string;
  yineleme: number;
  ozetBayt: number;
  ozetler: string[];
}

const VERI = kodlar as KodDosyasi;
const OZETLER = new Set(VERI.ozetler);

const ANAHTAR = 'za.kilit';
const ALFABE = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
export const KOD_UZUNLUK = 12;

/** Baskı partisinde hiç kod yoksa kilit uygulanmaz (geliştirme kolaylığı). */
export const KILIT_VAR = OZETLER.size > 0;

/** Kullanıcı ne yazarsa yazsın aynı biçime indirger: büyük harf, ayraçsız. */
export function normalle(kod: string): string {
  return kod
    .toUpperCase()
    .split('')
    .filter((c) => ALFABE.includes(c))
    .join('');
}

/** Girerken okunaklı dursun diye 4+4+4 gruplar. */
export function bicimle(kod: string): string {
  const t = normalle(kod).slice(0, KOD_UZUNLUK);
  const p = [t.slice(0, 4), t.slice(4, 8), t.slice(8)].filter(Boolean);
  return p.join('-');
}

function b64ToBytes(b64: string): Uint8Array {
  const ham = atob(b64);
  const out = new Uint8Array(ham.length);
  for (let i = 0; i < ham.length; i++) out[i] = ham.charCodeAt(i);
  return out;
}

function bytesToB64Url(b: ArrayBuffer): string {
  let s = '';
  for (const x of new Uint8Array(b)) s += String.fromCharCode(x);
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/** Girilen kodun özetini üretir. Bilerek yavaştır. */
async function ozetle(kod: string): Promise<string> {
  const anahtar = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(normalle(kod)),
    'PBKDF2',
    false,
    ['deriveBits'],
  );
  const bit = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: b64ToBytes(VERI.tuz) as unknown as BufferSource,
      iterations: VERI.yineleme,
      hash: 'SHA-256',
    },
    anahtar,
    VERI.ozetBayt * 8,
  );
  return bytesToB64Url(bit);
}

export async function kodGecerliMi(kod: string): Promise<boolean> {
  if (normalle(kod).length !== KOD_UZUNLUK) return false;
  return OZETLER.has(await ozetle(kod));
}

interface KilitKaydi {
  parti: string;
  ozet: string;
  tarih: number;
}

/** Kilit açıldı mı? Kayıt bu baskı partisine ait olmalı. */
export function kilitAcikMi(): boolean {
  if (!KILIT_VAR) return true;
  try {
    const ham = localStorage.getItem(ANAHTAR);
    if (!ham) return false;
    const k = JSON.parse(ham) as KilitKaydi;
    return k.parti === VERI.parti && OZETLER.has(k.ozet);
  } catch {
    return false;
  }
}

/** Doğrulanmış kodu kaydeder; yedeğe de girer, böylece yeni cihaza taşınır. */
export async function kilidiAc(kod: string): Promise<boolean> {
  if (!(await kodGecerliMi(kod))) return false;
  const kayit: KilitKaydi = {
    parti: VERI.parti,
    ozet: await ozetle(kod),
    tarih: Date.now(),
  };
  try {
    localStorage.setItem(ANAHTAR, JSON.stringify(kayit));
  } catch {
    // saklanamazsa uygulama yine açılır; her açılışta kod sorulur
  }
  return true;
}

export function kilidiKapat() {
  localStorage.removeItem(ANAHTAR);
}
