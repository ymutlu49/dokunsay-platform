/**
 * Manipülatiflerin paleti ve yardımcıları.
 *
 * Ana nokta rengi kitabın şekillerindeki lacivertle aynıdır: ekrandaki model
 * ile basılı sayfadaki şekil aynı nesne gibi görünmelidir. İkincil renkler
 * ekran için canlandırılmıştır — basılı sayfada kısılmak zorunda olan renk,
 * tahtada canlı olabilir.
 */
export const RENK = {
  lacivert: '#1B4965',
  /** İkinci beşlik ve vurgular — kitaptaki soluk mavi-grinin ekran karşılığı. */
  mavi: '#2C88E8',
  yesil: '#12A265',
  kirmizi: '#E05A45',
  mor: '#8B5CF6',
  amber: '#F2A20C',
  gri: '#56656F',
  griAcik: '#D3DCE2',
  kagit: '#FFFFFF',
  zemin: '#E8F2FD',
  zeminYesil: '#E6F7EF',
};

/**
 * Deterministik karıştırma.
 *
 * Aynı sayı ve tohum her zaman aynı düzeni verir: öğretmen bir kartı
 * gösterip kapattıktan sonra tekrar açtığında noktalar yer değiştirmez.
 * Yeni bir düzen istendiğinde tohum artırılır.
 */
export function karistir<T>(dizi: T[], tohum: number): T[] {
  const a = [...dizi];
  let s = tohum || 1;
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 1103515245 + 12345) % 2147483648;
    const j = s % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
