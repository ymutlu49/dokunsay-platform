/**
 * Ek D formlarının veri katmanı.
 *
 * Bütün kayıtlar yalnızca bu cihazda, localStorage'da durur. Hiçbiri sunucuya
 * gitmez; uygulamanın öğrenci verisi işleyen bir sistem olmaması bilinçli bir
 * tasarım kararıdır (bkz. README, Veri ve gizlilik).
 *
 * Formlar not vermek için değil, bir sonraki adımı bulmak içindir; bu yüzden
 * hiçbirinde puan, yüzde ya da süre alanı yoktur.
 */

export type FormTuru = 'gozlem' | 'profil' | 'tarama' | 'dizi';

interface TemelForm {
  id: string;
  tur: FormTuru;
  olusturuldu: number;
  guncellendi: number;
}

/** D.1 — haftalık gözlem çizelgesi. */
export interface GozlemFormu extends TemelForm {
  tur: 'gozlem';
  sinif: string;
  hafta: string;
  tarih: string;
  /** Beş strateji sütunu; öğretmen o hafta neyi izlediğini yazar. */
  stratejiler: string[];
  ogrenciler: { ad: string; isaretler: number[] }[];
}

/** D.2 — öğrenci profili kartı. */
export interface ProfilFormu extends TemelForm {
  tur: 'profil';
  ogrenci: string;
  sinifDonem: string;
  alanlar: Record<string, string>;
}

/** D.3 — birleşik tarama formu. */
export interface TaramaFormu extends TemelForm {
  tur: 'tarama';
  ogrenci: string;
  tarih: string;
  /** Madde sırasına göre: çocuğun anlattığı yol ve sonucun doğruluğu. */
  maddeler: { yol: string; dogru: boolean }[];
}

export type Form = GozlemFormu | ProfilFormu | TaramaFormu;

const ONEK = 'za.form.';

function anahtar(tur: FormTuru) {
  return ONEK + tur;
}

function oku<T>(k: string, varsayilan: T): T {
  try {
    const ham = localStorage.getItem(k);
    return ham ? (JSON.parse(ham) as T) : varsayilan;
  } catch {
    return varsayilan;
  }
}

function yaz(k: string, deger: unknown) {
  try {
    localStorage.setItem(k, JSON.stringify(deger));
  } catch {
    // kota dolduysa ya da özel sekmedeyse sessizce geçilir
  }
}

export function formlariOku<T extends Form>(tur: FormTuru): T[] {
  return oku<T[]>(anahtar(tur), []);
}

export function formKaydet<T extends Form>(form: T): T {
  const liste = formlariOku<T>(form.tur);
  const guncel = { ...form, guncellendi: Date.now() };
  const i = liste.findIndex((f) => f.id === form.id);
  if (i >= 0) liste[i] = guncel;
  else liste.unshift(guncel);
  yaz(anahtar(form.tur), liste);
  return guncel;
}

export function formSil(tur: FormTuru, id: string) {
  yaz(
    anahtar(tur),
    formlariOku(tur).filter((f) => f.id !== id),
  );
}

export function formBul<T extends Form>(tur: FormTuru, id: string): T | undefined {
  return formlariOku<T>(tur).find((f) => f.id === id);
}

function yeniId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

function bugun() {
  return new Date().toISOString().slice(0, 10);
}

export function yeniGozlem(): GozlemFormu {
  return {
    id: yeniId(),
    tur: 'gozlem',
    olusturuldu: Date.now(),
    guncellendi: Date.now(),
    sinif: '',
    hafta: '',
    tarih: bugun(),
    stratejiler: ['', '', '', '', ''],
    // Kitap beş-altı öğrencinin dönüşümlü izlenmesini söyler; altı satırla açılır.
    ogrenciler: Array.from({ length: 6 }, () => ({ ad: '', isaretler: [0, 0, 0, 0, 0] })),
  };
}

export function yeniProfil(): ProfilFormu {
  return {
    id: yeniId(),
    tur: 'profil',
    olusturuldu: Date.now(),
    guncellendi: Date.now(),
    ogrenci: '',
    sinifDonem: '',
    alanlar: {},
  };
}

export function yeniTarama(maddeSayisi: number): TaramaFormu {
  return {
    id: yeniId(),
    tur: 'tarama',
    olusturuldu: Date.now(),
    guncellendi: Date.now(),
    ogrenci: '',
    tarih: bugun(),
    maddeler: Array.from({ length: maddeSayisi }, () => ({ yol: '', dogru: false })),
  };
}

/** Formun ne kadarının doldurulduğu — listede ilerlemeyi göstermek için. */
export function doluluk(form: Form): number {
  if (form.tur === 'gozlem') {
    const hucre = form.ogrenciler.filter((o) => o.ad.trim()).length;
    return hucre;
  }
  if (form.tur === 'profil') {
    return Object.values(form.alanlar).filter((v) => v.trim()).length;
  }
  return form.maddeler.filter((m) => m.yol.trim()).length;
}
