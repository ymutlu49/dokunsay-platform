/**
 * Ek D.3 — birleşik tarama formunun maddeleri.
 *
 * Bölüm 7–11'deki tarama maddelerinin tamamı; kitabın Tablo 14.2'si bunların
 * özetidir. Sıra ve beklenen yollar Ek D.3'ten birebir alınmıştır.
 *
 * Kitabın uyarısı forma gömülüdür: her maddeden sonra "nasıl buldun?"
 * sorulmadıkça tarama yarım kalır. Bu yüzden formda doğru/yanlış kutusundan
 * önce "öğrencinin söylediği yol" alanı gelir.
 */

export interface TaramaMaddesi {
  islem: string;
  beklenen: string;
  /** Kitap bölümü — sonucu hangi bölüme götüreceğini söyler. */
  bolum: number;
}

export const TARAMA_MADDELERI: TaramaMaddesi[] = [
  { islem: '8 + 6', beklenen: 'Onluğa köprüleme', bolum: 7 },
  { islem: '48 + 6', beklenen: 'Onluğa köprüleme', bolum: 7 },
  { islem: '47 + 38', beklenen: 'Atlama ya da parçalama', bolum: 7 },
  { islem: '52 + 39', beklenen: 'Telafi', bolum: 7 },

  { islem: '15 − 8', beklenen: 'Toplamaya çevirme', bolum: 8 },
  { islem: '62 − 59', beklenen: 'Dolaylı toplama', bolum: 8 },
  { islem: '91 − 46', beklenen: 'Atlama', bolum: 8 },
  { islem: '52 − 39', beklenen: 'Telafi', bolum: 8 },

  { islem: '6 × 7', beklenen: 'Hatırlama ya da türetme', bolum: 9 },
  { islem: '9 × 7', beklenen: 'Dokuz örüntüsü', bolum: 9 },
  { islem: '24 × 5', beklenen: 'İkileme–yarılama', bolum: 9 },
  { islem: '27 × 4', beklenen: 'Onluklarla parçalama', bolum: 9 },

  { islem: '42 ÷ 6', beklenen: 'Çarpmaya çevirme', bolum: 10 },
  { islem: '84 ÷ 6', beklenen: 'Kısmi bölümler', bolum: 10 },
  { islem: '12 ÷ 0,5', beklenen: 'Gruplama anlamı', bolum: 10 },

  { islem: '475 + 218 ≈', beklenen: 'Düzeltilmiş ön uç', bolum: 11 },
  { islem: '1/5 mi, 1/8 mi?', beklenen: 'Ölçüt noktası', bolum: 11 },
  { islem: '0,4 mü, 0,42 mi?', beklenen: 'Basamak değeri', bolum: 11 },
];

/** D.2'nin altı satırı; son satır kitapta "en önemlisi" diye işaretlidir. */
export const PROFIL_ALANLARI = [
  { anahtar: 'dogruluk', etiket: 'Doğruluk', ipucu: 'Kaç maddede doğru sonuca ulaştı?' },
  { anahtar: 'tercih', etiket: 'Tercih ettiği yol', ipucu: 'Hangi stratejiye önce gidiyor?' },
  { anahtar: 'dagarcik', etiket: 'Dağarcık (kaç yol)', ipucu: 'Kaç farklı yol kullanabiliyor?' },
  { anahtar: 'esneklik', etiket: 'Esneklik', ipucu: 'Sayılara göre yol değiştiriyor mu?' },
  { anahtar: 'hedef', etiket: 'Sonraki hedef', ipucu: 'Bir sonraki adım ne?' },
  {
    anahtar: 'evde',
    etiket: 'Evde ne yapılabilir?',
    ipucu: 'Veli görüşmesinde konuşulacak tek şey budur.',
    onemli: true,
  },
] as const;

/** D.1'in üç durumu. */
export const GOZLEM_DURUMLARI = [
  { deger: 0, isaret: '○', etiket: 'henüz görülmedi' },
  { deger: 1, isaret: '◐', etiket: 'deniyor, tamamlamıyor' },
  { deger: 2, isaret: '●', etiket: 'kendiliğinden kullanıyor' },
] as const;
