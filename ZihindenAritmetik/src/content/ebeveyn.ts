/**
 * Bölüm 17 — Ebeveyn Rehberi'nin uygulamaya giren içeriği.
 *
 * Tasarım ilkesi bölümün kendisinden gelir. 17.8, evde tek başına kullanılan
 * uygulamaların araştırma bulgusuna genellenemeyeceğini söyler; işe yarayan
 * şey "ekranın kendisi değil, ekranın başlattığı konuşma"dır. Tablo 17.3'ün
 * son tuzağı da budur: çocuğu uygulamayla yalnız bırakmak.
 *
 * Bu yüzden ebeveyn modu çocuğa değil, ebeveyne seslenir. Hiçbir ekranda
 * puan, doğru/yanlış ya da süre yoktur; her ekran sorulacak bir soruyla biter.
 */

/** Şekil 17.5 — evde beş dakikanın adımları. */
export const BES_DAKIKA = [
  { adim: 'Bir soru sorun', not: 'Tek bir işlem yeter.' },
  { adim: 'Bekleyin', not: 'Üç saniye uzun gelir; gereklidir.' },
  { adim: '"Nasıl buldun?" deyin', not: 'Sonuç değil, yol önemli.' },
  { adim: 'Kendi yolunuzu anlatın', not: 'İki yol yan yana dursun.' },
  { adim: 'Bitirin', not: 'Çocuk sıkılmadan önce.' },
] as const;

export const BES_DAKIKA_UYARI = 'Gergin geçtiyse yarın yapmayın.';

/** Şekil 17.6 — yaş aralıklarına göre evde ne yapılır. */
export interface YasAraligi {
  id: string;
  yas: string;
  baslik: string;
  ornek: string;
  renk: number;
}

export const YAS_ARALIKLARI: YasAraligi[] = [
  {
    id: '4-6',
    yas: '4–6',
    baslik: 'Say, göster, karşılaştır',
    ornek: 'Masada kaç tabak var? Hangisi daha çok?',
    renk: 1,
  },
  {
    id: '6-8',
    yas: '6–8',
    baslik: 'Onluğu kur, parçala',
    ornek: 'Sekiz artı altı: önce ona tamamla.',
    renk: 9,
  },
  {
    id: '8-10',
    yas: '8–10',
    baslik: 'Yolunu sor, adını koy',
    ornek: 'Nasıl buldun? Buna atlama diyoruz.',
    renk: 2,
  },
  {
    id: '10+',
    yas: '10+',
    baslik: 'Tahmin ettir, gerekçe iste',
    ornek: 'Sepet kaç tutar? Neden öyle düşündün?',
    renk: 4,
  },
];

export const YAS_NOTU = 'Yaş sınırları kesin değildir; çocuğa göre kayar.';

/** Tablo 17.1 — kitabın bütün bölümlerindeki ebeveyn köşeleri bir arada. */
export interface EbeveynOnerisi {
  bolum: number;
  konu: string;
  yapilir: string;
  neden: string;
}

export const EBEVEYN_KOSELERI: EbeveynOnerisi[] = [
  { bolum: 4, konu: 'Sanbil', yapilir: 'Nokta örüntülerini bir bakışta sordurun', neden: 'Saymadan bilme kurulur' },
  { bolum: 5, konu: 'Parmak', yapilir: 'Parmağı yasaklamayın', neden: 'Yasak yerine yol öğretilir' },
  { bolum: 6, konu: 'Basamak', yapilir: 'Para ve onluk konuşun', neden: 'Basamak değeri somutlaşır' },
  { bolum: 7, konu: 'Toplama', yapilir: 'Onluğa tamamlatın', neden: 'Köprüleme kurulur' },
  { bolum: 8, konu: 'Çıkarma', yapilir: 'Para üstünü birlikte sayın', neden: 'Fark anlamı kurulur' },
  { bolum: 9, konu: 'Çarpma', yapilir: 'Gruplar hâlinde konuşun', neden: 'Çarpımsal düşünme kurulur' },
  { bolum: 10, konu: 'Bölme', yapilir: 'Paylaştırın ve gruplatın', neden: 'İki anlam da kurulur' },
  { bolum: 11, konu: 'Tahmin', yapilir: 'Kasaya varmadan tahmin ettirin', neden: 'Tahmin ayrı bir iştir' },
  { bolum: 12, konu: 'Sayı konuşması', yapilir: 'Günde bir işlem, "nasıl buldun"', neden: 'Yol görünür olur' },
  { bolum: 13, konu: 'Rutin', yapilir: 'Aynı saatte beş dakika', neden: 'Aralıklama işler' },
  { bolum: 14, konu: 'Değerlendirme', yapilir: 'Nota değil yola bakın', neden: 'Not yolu göstermez' },
  { bolum: 15, konu: 'Diskalkuli', yapilir: 'Beyin egzersizine para harcamayın', neden: 'Matematiğe aktarılmıyor' },
  { bolum: 16, konu: 'Farklılaştırma', yapilir: 'Kardeşle karşılaştırmayın', neden: 'Karşılaştırma kaygıyı büyütür' },
];

/** Tablo 17.3 — evde sık düşülen tuzaklar. */
export const TUZAKLAR = [
  { tuzak: 'Kendi yolunu dayatma', belirti: '"Alt alta yaz" cümlesi', yapilacak: 'Önce çocuğun yolunu dinleyin' },
  { tuzak: 'Süre tutma', belirti: '"Kaç saniyede yaptın?"', yapilacak: 'Süreyi hiç konuşmayın' },
  { tuzak: 'Gergin ödev seansı', belirti: 'Akşamlar tartışmayla bitiyor', yapilacak: 'On dakikada bırakın' },
  { tuzak: 'Zekâyı övme', belirti: '"Çok akıllısın"', yapilacak: 'İşi övün, çocuğu değil' },
  { tuzak: 'Kardeşle karşılaştırma', belirti: '"Ablan bunu yapardı"', yapilacak: 'Kendi geçmişiyle karşılaştırın' },
  {
    tuzak: '"Ben de matematikçi değildim"',
    belirti: 'Rahatlatmak için söyleniyor',
    yapilacak: 'Söylemeyin; kalıcı iz bırakır',
    onemli: true,
  },
  { tuzak: 'Ekranı yalnız bırakma', belirti: 'Çocuk uygulamayla tek başına', yapilacak: 'Yanına oturun, konuşun' },
] as const;

/** 17.7 — övgünün biçimi. Söylemesi kolay, maliyeti sıfır bir değişiklik. */
export const OVGU = [
  { yerine: 'Çok akıllısın.', bunu: 'O yolu nereden buldun?' },
  { yerine: 'Aferin, çok hızlısın.', bunu: 'Bu sefer başka bir yol denedin.' },
  { yerine: 'Matematikçi olmuşsun.', bunu: 'Neden işe yaradığını anlatabilir misin?' },
] as const;

/** 17.11 — diskalkulili çocuğun ailesi için üç öncelik. */
export const DISKALKULI_ONCELIKLER = [
  {
    baslik: 'Tanıyı beklemeyin',
    metin:
      'Bu kitaptaki hiçbir öneri rapor gerektirmiyor. RAM süreci aylar sürebilir; evdeki beş dakika o süre boyunca da işler.',
  },
  {
    baslik: 'Çalışma belleği programlarına para harcamayın',
    metin: 'Bellek oyunlarındaki ilerleme matematiğe geçmiyor (Bölüm 15).',
  },
  {
    baslik: 'Tek bir şeye odaklanın',
    metin:
      'Aynı anda üç konu çalışmak, hiçbirinin oturmamasına yol açar. Öğretmenden tek bir hedef isteyin.',
  },
] as const;

/**
 * 17.5 ve 17.8 — kanıtın ne dediği ve nerede bittiği.
 * Kitabın tutumu burada da sürer: kanıtın zayıf olduğu yer saklanmaz, adlandırılır.
 */
export const KANIT_NOTLARI = [
  {
    baslik: 'İşe yaradığı gösterilen bir şey var',
    metin:
      'Yatmadan önce çocukla birlikte matematik konuşulan bir uygulama denemesi, bir yıl sonra ölçülebilir fark üretmiştir (Berkowitz ve ark., 2015; üç yıllık izleme Schaeffer ve ark., 2018).',
  },
  {
    baslik: 'Ama ekranın kendisi değil',
    metin:
      'Eğitsel uygulamaların etkisini inceleyen çalışmalar ağırlıkla okulda, gözetim altında kullanılan uygulamalara aittir; evde tek başına kullanılan uygulamalara genellenemez (Kim ve ark., 2021). İşe yarayan, ekranın başlattığı konuşmadır.',
  },
  {
    baslik: 'Ödev beklendiği kadar iş görmüyor',
    metin:
      'İlkokulda ödev miktarı ile başarı arasındaki bağıntı sıfıra yakındır (Cooper ve ark., 2006). Ödevin ilkokuldaki işlevi başarı artırmak değil, alışkanlık kurmaktır.',
  },
] as const;

/** Evde uygulanabilir etkinlik kartları — Etkinlik Kitabı'nın dizininden. */
export const EVDE_KARTLAR = ['1.4', '2.1', '3.3', '8.1'];

/** Ebeveynin evde kullanabileceği araçlar. */
export const EVDE_ARACLAR = ['nokta', 'onluk', 'parcabutun'];

/**
 * Günün önerisi. Tarihe göre seçilir; aynı gün uygulama kaç kez açılırsa
 * açılsın aynı öneriyi verir — rutin ancak sabit olursa rutin olur (Bölüm 13).
 */
export function gununOnerisi(gun = new Date()): EbeveynOnerisi {
  const yilBasi = new Date(gun.getFullYear(), 0, 0);
  const gunNo = Math.floor((gun.getTime() - yilBasi.getTime()) / 86400000);
  return EBEVEYN_KOSELERI[gunNo % EBEVEYN_KOSELERI.length];
}
