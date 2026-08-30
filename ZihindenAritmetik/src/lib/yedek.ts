/**
 * Yedekleme ve geri yükleme.
 *
 * Uygulamanın bütün verisi cihazda, `za.` önekli localStorage anahtarlarında
 * durur. Yedek tek bir JSON dosyasıdır ve o anahtarların tamamını taşır —
 * ileride yeni bir veri türü eklendiğinde yedek kodu değişmeden onu da alır.
 *
 * Bu, iOS'un bilinen davranışına karşı da gereklidir: Safari, haftalarca
 * açılmayan bir PWA'nın yerel depolamasını silebilir. Dönem sonunda alınan
 * bir yedek, gözlem kayıtlarının tek güvencesidir.
 */

const ONEK = 'za.';
export const YEDEK_SURUMU = 1;

export interface YedekDosyasi {
  uygulama: 'zihinden-aritmetik';
  surum: number;
  olusturuldu: string;
  veriler: Record<string, unknown>;
}

export interface YedekOzeti {
  gozlem: number;
  profil: number;
  tarama: number;
  diziler: number;
  oturumlar: number;
  tarih?: string;
}

function anahtarlar(): string[] {
  const out: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k && k.startsWith(ONEK)) out.push(k);
  }
  return out;
}

export function yedekOlustur(): YedekDosyasi {
  const veriler: Record<string, unknown> = {};
  for (const k of anahtarlar()) {
    const ham = localStorage.getItem(k);
    if (ham === null) continue;
    try {
      veriler[k] = JSON.parse(ham);
    } catch {
      // JSON olmayan değerler (ör. dil kodu) olduğu gibi taşınır
      veriler[k] = ham;
    }
  }
  return {
    uygulama: 'zihinden-aritmetik',
    surum: YEDEK_SURUMU,
    olusturuldu: new Date().toISOString(),
    veriler,
  };
}

function sayAdet(veriler: Record<string, unknown>, anahtar: string): number {
  const v = veriler[anahtar];
  return Array.isArray(v) ? v.length : 0;
}

export function yedekOzeti(y: YedekDosyasi): YedekOzeti {
  const v = y.veriler ?? {};
  return {
    gozlem: sayAdet(v, 'za.form.gozlem'),
    profil: sayAdet(v, 'za.form.profil'),
    tarama: sayAdet(v, 'za.form.tarama'),
    diziler: sayAdet(v, 'za.kendiDiziler'),
    oturumlar: Object.keys(v).filter((k) => k.startsWith('za.oturum')).length,
    tarih: y.olusturuldu,
  };
}

/** Şu andaki verinin özeti — yedek almadan önce ne kaydedileceğini gösterir. */
export function mevcutOzet(): YedekOzeti {
  return yedekOzeti(yedekOlustur());
}

export class YedekHatasi extends Error {}

/** Dosyayı doğrular; biçim tanınmazsa anlaşılır bir hata verir. */
export function yedekCozumle(metin: string): YedekDosyasi {
  let veri: unknown;
  try {
    veri = JSON.parse(metin);
  } catch {
    throw new YedekHatasi('okunamadi');
  }
  const y = veri as Partial<YedekDosyasi>;
  if (!y || typeof y !== 'object' || y.uygulama !== 'zihinden-aritmetik') {
    throw new YedekHatasi('baskaDosya');
  }
  if (typeof y.surum !== 'number' || y.surum > YEDEK_SURUMU) {
    throw new YedekHatasi('yeniSurum');
  }
  if (!y.veriler || typeof y.veriler !== 'object') {
    throw new YedekHatasi('okunamadi');
  }
  return y as YedekDosyasi;
}

type Kimlikli = { id?: unknown; guncellendi?: unknown };

/** Kimliği olan kayıtları birleştirir; aynı kimlikte yeni tarihli olan kalır. */
function listeBirlestir(yerel: unknown, gelen: unknown): unknown {
  if (!Array.isArray(yerel) || !Array.isArray(gelen)) return gelen;
  const harita = new Map<string, Kimlikli>();
  for (const kayit of [...(yerel as Kimlikli[]), ...(gelen as Kimlikli[])]) {
    const id = typeof kayit?.id === 'string' ? kayit.id : null;
    if (!id) continue;
    const varolan = harita.get(id);
    const yeniTarih = typeof kayit.guncellendi === 'number' ? kayit.guncellendi : 0;
    const eskiTarih = typeof varolan?.guncellendi === 'number' ? varolan.guncellendi : -1;
    if (!varolan || yeniTarih >= eskiTarih) harita.set(id, kayit);
  }
  return [...harita.values()];
}

export type YuklemeModu = 'birlestir' | 'degistir';

/**
 * Yedeği geri yükler.
 *
 * `birlestir` — cihazdaki kayıtlar korunur, yedektekiler eklenir; aynı kimlikli
 *   kayıtta yeni tarihli olan kalır. Varsayılan ve güvenli olan budur.
 * `degistir` — cihazdaki bütün uygulama verisi silinir, yerine yedek yazılır.
 */
export function yedekYukle(y: YedekDosyasi, mod: YuklemeModu): YedekOzeti {
  if (mod === 'degistir') {
    for (const k of anahtarlar()) localStorage.removeItem(k);
  }

  for (const [k, gelen] of Object.entries(y.veriler)) {
    if (!k.startsWith(ONEK)) continue; // yabancı anahtar yazılmaz
    const hamYerel = localStorage.getItem(k);

    let yazilacak: unknown = gelen;
    if (mod === 'birlestir' && hamYerel !== null) {
      if (Array.isArray(gelen)) {
        let yerel: unknown = null;
        try {
          yerel = JSON.parse(hamYerel);
        } catch {
          yerel = null;
        }
        yazilacak = listeBirlestir(yerel, gelen);
      } else {
        // Dizi olmayan değerlerde (oturum kaydı, dil, hafta) cihazdaki kalır.
        continue;
      }
    }

    try {
      localStorage.setItem(k, typeof yazilacak === 'string' ? yazilacak : JSON.stringify(yazilacak));
    } catch {
      // kota dolduysa o anahtar atlanır; geri kalanı yüklenmeye devam eder
    }
  }

  return mevcutOzet();
}

/** Bütün uygulama verisini siler. */
export function tumVeriyiSil() {
  for (const k of anahtarlar()) localStorage.removeItem(k);
}

export function yedekDosyaAdi(): string {
  const g = new Date();
  const iki = (n: number) => String(n).padStart(2, '0');
  return `zihinden-yedek-${g.getFullYear()}-${iki(g.getMonth() + 1)}-${iki(g.getDate())}.json`;
}

/**
 * Yedeği kullanıcıya verir.
 *
 * iOS'ta `<a download>` çoğu zaman dosyayı indirmek yerine açar; orada paylaşım
 * sayfası (Web Share) doğru yoldur. Bu yüzden önce paylaşım denenir, olmazsa
 * indirmeye düşülür.
 */
export async function yedegiIndir(): Promise<'paylasildi' | 'indirildi'> {
  const metin = JSON.stringify(yedekOlustur(), null, 2);
  const ad = yedekDosyaAdi();
  const blob = new Blob([metin], { type: 'application/json' });

  const gezgin = navigator as Navigator & {
    canShare?: (v: { files: File[] }) => boolean;
    share?: (v: { files: File[]; title?: string }) => Promise<void>;
  };
  if (typeof File !== 'undefined' && gezgin.canShare && gezgin.share) {
    const dosya = new File([blob], ad, { type: 'application/json' });
    if (gezgin.canShare({ files: [dosya] })) {
      try {
        await gezgin.share({ files: [dosya], title: ad });
        return 'paylasildi';
      } catch {
        // kullanıcı vazgeçtiyse ya da paylaşım engellendiyse indirmeye düşülür
      }
    }
  }

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = ad;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  return 'indirildi';
}
