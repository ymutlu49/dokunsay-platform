/**
 * Üç dilli arayüz katmanı.
 *
 * Dil kodları BCP-47'ye göredir: Kurmancî için `ku-Latn-TR` doğru etikettir
 * (`kmr` değil); üçü de Latin alfabesi ve soldan sağa yazılır, bu yüzden
 * düzen değişmez, yalnızca metin değişir.
 *
 * Terim karşılıkları kitabın TR–EN–KU çalışma sözlüğünden gelir; sözlükte
 * karşılığı olmayan Kurmancî terimler [p] (pêşnîyar) olarak işaretlidir.
 */
import { createContext, useContext } from 'react';
import { tr } from './tr';

export const DILLER = [
  { kod: 'tr', etiket: 'Türkçe', bcp47: 'tr-TR' },
  { kod: 'ku', etiket: 'Kurmancî', bcp47: 'ku-Latn-TR' },
  { kod: 'en', etiket: 'English', bcp47: 'en' },
] as const;

export type DilKodu = (typeof DILLER)[number]['kod'];

export type Sozluk = typeof tr;
/** Çeviri dosyaları tamamlanana kadar eksik anahtarlar Türkçeye düşer. */
export type KismiSozluk = Partial<Record<keyof Sozluk, string>>;

const SOZLUKLER: Record<DilKodu, KismiSozluk> = {
  tr,
  ku: {},
  en: {},
};

export const DIL_ANAHTARI = 'za.dil';

export function dilOku(): DilKodu {
  if (typeof localStorage === 'undefined') return 'tr';
  const d = localStorage.getItem(DIL_ANAHTARI);
  return DILLER.some((x) => x.kod === d) ? (d as DilKodu) : 'tr';
}

export function dilYaz(d: DilKodu) {
  localStorage.setItem(DIL_ANAHTARI, d);
  const bcp = DILLER.find((x) => x.kod === d)?.bcp47 ?? 'tr-TR';
  document.documentElement.lang = bcp;
}

export const DilBaglami = createContext<DilKodu>('tr');

/**
 * Çeviri işlevi. `t('anahtar')` verir; `{sayi}` biçimindeki yer tutucular
 * ikinci argümandaki değerlerle doldurulur.
 */
export function useT() {
  const dil = useContext(DilBaglami);
  return (anahtar: keyof Sozluk, degerler?: Record<string, string | number>) => {
    const metin = SOZLUKLER[dil][anahtar] ?? tr[anahtar] ?? String(anahtar);
    if (!degerler) return metin;
    return metin.replace(/\{(\w+)\}/g, (tam, ad) =>
      ad in degerler ? String(degerler[ad]) : tam,
    );
  };
}

export function useDil() {
  return useContext(DilBaglami);
}
