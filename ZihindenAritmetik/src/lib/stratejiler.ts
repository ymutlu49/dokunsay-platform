/**
 * Strateji adları ve temsil eşlemesi.
 *
 * Adlar kitabın Ek B.2 tablosundan alınmıştır. Sayı konuşmasında bu adlar
 * yalnızca yol paylaşıldıktan SONRA kullanılır: kitabın kuralı, "yolu önce
 * adlandırmak çocuğun sayılara bakma işini ortadan kaldırır" der. Bu yüzden
 * uygulamada strateji etiketi ancak bir yol yazıldıktan sonra açılır.
 *
 * `arac` alanı, o stratejiyi tahtada göstermeye en uygun modeli söyler —
 * öğretmen çocuğun anlattığını oracıkta çizebilsin diye.
 */

export interface StratejiTanimi {
  ad: string;
  /** İşlem ailesi — yalnızca ilgili problemlerde önerilir. */
  islem: ('toplama' | 'cikarma' | 'carpma' | 'bolme' | 'tahmin')[];
  /** Yolu tahtada göstermeye uygun manipülatifin kimliği. */
  arac?: string;
}

export const STRATEJILER: StratejiTanimi[] = [
  { ad: 'İleri sayma', islem: ['toplama'], arac: 'sayidogrusu' },
  { ad: 'Onluğa köprüleme', islem: ['toplama'], arac: 'onluk' },
  { ad: 'Parçalama', islem: ['toplama', 'cikarma'], arac: 'basamak' },
  { ad: 'Atlama', islem: ['toplama', 'cikarma'], arac: 'sayidogrusu' },
  { ad: 'Telafi', islem: ['toplama', 'cikarma'], arac: 'sayidogrusu' },
  { ad: 'Dengeleme', islem: ['toplama'], arac: 'sayidogrusu' },
  { ad: 'Dost sayılar', islem: ['toplama'], arac: 'onluk' },
  { ad: 'Yeniden sıralama', islem: ['toplama'] },
  { ad: 'Yakın ikilemeler', islem: ['toplama'], arac: 'rekenrek' },
  { ad: 'Dolaylı toplama', islem: ['cikarma'], arac: 'sayidogrusu' },
  { ad: 'Sabit fark', islem: ['cikarma'], arac: 'sayidogrusu' },
  { ad: 'Kısmi çarpımlar', islem: ['carpma'], arac: 'dizi' },
  { ad: 'İkileme–yarılama', islem: ['carpma', 'bolme'], arac: 'dizi' },
  { ad: 'Dokuzlar örüntüsü', islem: ['carpma'], arac: 'yuzluk' },
  { ad: 'Gerçek ailesi', islem: ['bolme', 'carpma'], arac: 'dizi' },
  { ad: 'Kısmi bölümler', islem: ['bolme'], arac: 'dizi' },
  { ad: 'Ardışık yarılama', islem: ['bolme'], arac: 'dizi' },
  { ad: 'Yuvarlama', islem: ['tahmin'], arac: 'sayidogrusu' },
  { ad: 'Çıpa kullanma', islem: ['tahmin'], arac: 'sayidogrusu' },
];

/** Problem metninden işlem ailesini çıkarır: "48 + 7" -> toplama. */
export function islemAilesi(problem: string): StratejiTanimi['islem'][number] | null {
  if (/[×x*]/.test(problem)) return 'carpma';
  if (/[÷:]/.test(problem) || /\//.test(problem)) return 'bolme';
  if (/[−–-]/.test(problem) && !/^\s*[−–-]/.test(problem)) return 'cikarma';
  if (/\+/.test(problem)) return 'toplama';
  if (/%|kesir|yüzde|≈/i.test(problem)) return 'tahmin';
  return null;
}

/** O probleme uygun strateji önerileri; eşleşme yoksa tüm liste. */
export function onerilenStratejiler(problem: string): StratejiTanimi[] {
  const aile = islemAilesi(problem);
  if (!aile) return STRATEJILER;
  const uygun = STRATEJILER.filter((s) => s.islem.includes(aile));
  return uygun.length > 0 ? uygun : STRATEJILER;
}

export function stratejiBul(ad: string): StratejiTanimi | undefined {
  return STRATEJILER.find((s) => s.ad === ad);
}
