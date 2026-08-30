/**
 * Kullanıcı rolü.
 *
 * Kitabın ön kısmı "öğretmen / ebeveyn / uzman için üç ayrı okuma haritası"
 * sunar; uygulama da aynı ayrımı yapar. Rol yalnızca hangi ekranların
 * gösterileceğini belirler — içerik aynı kitaptan gelir, dili değişir.
 *
 * Rol seçilmeden uygulama açılmaz: ebeveynin öğretmen arayüzüne düşmesi,
 * öğretmenin ebeveyn arayüzüne düşmesi kadar kafa karıştırıcıdır.
 */
export type Rol = 'ogretmen' | 'ebeveyn';

const ANAHTAR = 'za.rol';

export function rolOku(): Rol | null {
  if (typeof localStorage === 'undefined') return null;
  const v = localStorage.getItem(ANAHTAR);
  return v === 'ogretmen' || v === 'ebeveyn' ? v : null;
}

export function rolYaz(r: Rol) {
  try {
    localStorage.setItem(ANAHTAR, r);
  } catch {
    // saklanamazsa uygulama yine çalışır; her açılışta rol sorulur
  }
}
