/**
 * Yerel saklama.
 *
 * Hiçbir kayıt sunucuya gitmez. Öğretmenin tahtaya yazdığı cevaplar ve
 * öğrencinin anlattığı yollar yalnızca bu cihazda durur; KVKK açısından
 * uygulama öğrenci verisi işleyen bir sistem değildir.
 */
import type { NumberString, TalkRecord } from './types';

const ONEK = 'za.';

function oku<T>(anahtar: string, varsayilan: T): T {
  try {
    const ham = localStorage.getItem(ONEK + anahtar);
    return ham ? (JSON.parse(ham) as T) : varsayilan;
  } catch {
    return varsayilan;
  }
}

function yaz(anahtar: string, deger: unknown) {
  try {
    localStorage.setItem(ONEK + anahtar, JSON.stringify(deger));
  } catch {
    // iOS'ta özel sekmede ya da kota dolduğunda sessizce geçilir;
    // kayıt tutulamaması uygulamayı durdurmaz.
  }
}

// ------------------------------------------------------------ oturum kaydı

// Kayıt biçimi değiştiğinde sürüm artırılır; eski kayıtlar okunmaz, uygulama
// boş oturumla açılır. Kayıtlar tek bir dersin notu olduğu için kayıp değildir.
const OTURUM = 'oturum2.';

export function kayitOku(diziId: string): TalkRecord | null {
  return oku<TalkRecord | null>(OTURUM + diziId, null);
}

export function kayitYaz(kayit: TalkRecord) {
  yaz(OTURUM + kayit.stringId, kayit);
}

export function kayitSil(diziId: string) {
  localStorage.removeItem(ONEK + OTURUM + diziId);
}

export function bosKayit(diziId: string): TalkRecord {
  return { stringId: diziId, startedAt: Date.now(), problems: {}, named: false };
}

// -------------------------------------------------------- kendi dizilerin

const KENDI = 'kendiDiziler';

export function kendiDizileriOku(): NumberString[] {
  return oku<NumberString[]>(KENDI, []);
}

export function kendiDiziEkle(strateji: string, problemler: string[]): NumberString {
  const liste = kendiDizileriOku();
  const dizi: NumberString = {
    id: `kendi-${Date.now().toString(36)}`,
    source: 'kendi',
    strategy: strateji.trim(),
    problems: problemler.map((p) => p.trim()).filter(Boolean),
  };
  yaz(KENDI, [dizi, ...liste]);
  return dizi;
}

export function kendiDiziSil(id: string) {
  yaz(
    KENDI,
    kendiDizileriOku().filter((d) => d.id !== id),
  );
  kayitSil(id);
}
