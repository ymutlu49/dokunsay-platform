/**
 * Rastgele sayı üretimi ve profil aralıkları.
 *
 * Aralıklar uydurulmamıştır: her biri ilgili etkinlik kartının "dört profil"
 * satırından alınmıştır. Örneğin nokta kartının aralıkları kart 1.1'de
 * "Diskalkuli 1–3 · Düşük 1–5 · Ortalama 1–6 · Yüksek 6–10" olarak yazar.
 * Böylece öğretmen profil seçtiğinde uygulama kitabın farklılaştırma
 * matrisini uygulamış olur.
 */

export const PROFILLER = ['Diskalkuli', 'Düşük', 'Ortalama', 'Yüksek'] as const;
export type Profil = (typeof PROFILLER)[number];

export interface Aralik {
  enAz: number;
  enCok: number;
  /** Ekranda gösterilecek kısa açıklama; kartın profil satırından. */
  not?: string;
}

export type ProfilAraliklari = Record<Profil, Aralik>;

/**
 * enAz–enCok arasında bir tam sayı. `kacin` verilirse aynı sayıyı art arda
 * çekmez: sınıfa iki kez aynı kartı göstermek etkinliği tüketir.
 */
export function rastgele(enAz: number, enCok: number, kacin?: number): number {
  const alt = Math.min(enAz, enCok);
  const ust = Math.max(enAz, enCok);
  if (ust <= alt) return alt;
  for (let deneme = 0; deneme < 12; deneme++) {
    const v = alt + Math.floor(Math.random() * (ust - alt + 1));
    if (v !== kacin) return v;
  }
  return alt + Math.floor(Math.random() * (ust - alt + 1));
}

/** Verilen kümeden rastgele bir öge; öncekini tekrarlamamaya çalışır. */
export function rastgeleSec<T>(secenekler: readonly T[], kacin?: T): T {
  if (secenekler.length === 0) throw new Error('boş seçenek');
  if (secenekler.length === 1) return secenekler[0];
  for (let deneme = 0; deneme < 12; deneme++) {
    const v = secenekler[Math.floor(Math.random() * secenekler.length)];
    if (v !== kacin) return v;
  }
  return secenekler[0];
}

// ------------------------------------------------ araçların profil aralıkları

/** Nokta kartı — kart 1.1'in dört profil satırı. */
export const NOKTA_ARALIK: ProfilAraliklari = {
  Diskalkuli: { enAz: 1, enCok: 3, not: 'Kart açık bırakılabilir.' },
  Düşük: { enAz: 1, enCok: 5, not: 'Her kartta "nasıl gördün" sorulur.' },
  Ortalama: { enAz: 1, enCok: 6, not: 'İki farklı düzen art arda.' },
  Yüksek: { enAz: 6, enCok: 10, not: 'Çocuk kendi kartını çizip düzenini anlatır.' },
};

/** Onluk çerçeve — kart 1.3 ve 1.6'nın toplamları. */
export const CERCEVE_ARALIK: ProfilAraliklari = {
  Diskalkuli: { enAz: 1, enCok: 5, not: 'Yalnızca 5 ve 10; çerçeve açık kalır.' },
  Düşük: { enAz: 1, enCok: 8, not: '5, 8, 10; kapatma süresi iki saniye.' },
  Ortalama: { enAz: 1, enCok: 10, not: 'Bütün sayılar; bir saniye.' },
  Yüksek: { enAz: 11, enCok: 20, not: 'Yirmilik çerçeve (iki onluk).' },
};

/** Rekenrek — kart 2.1'in aralıkları. */
export const REKENREK_ARALIK: ProfilAraliklari = {
  Diskalkuli: { enAz: 1, enCok: 5, not: 'Beşli kalıp kurulana kadar burada kalınır.' },
  Düşük: { enAz: 1, enCok: 8, not: 'Beş çıpası her seferinde adlandırılır.' },
  Ortalama: { enAz: 1, enCok: 10, not: 'Hız beklenir.' },
  Yüksek: { enAz: 11, enCok: 20, not: 'İki elle onun üstü.' },
};

/** Basamak değeri blokları — kart 3.1'in aralıkları. */
export const BASAMAK_ARALIK: ProfilAraliklari = {
  Diskalkuli: { enAz: 0, enCok: 30, not: 'Bloklarla birlikte.' },
  Düşük: { enAz: 0, enCok: 100, not: 'Satır sayma yardımıyla.' },
  Ortalama: { enAz: 10, enCok: 100, not: 'Doğrudan söylenir.' },
  Yüksek: { enAz: 101, enCok: 999, not: 'Üç basamak: kaç yüzlük, kaç onluk?' },
};

/** Parça–bütün — kart 1.4'ün nesne sayıları. */
export const PARCA_ARALIK: ProfilAraliklari = {
  Diskalkuli: { enAz: 5, enCok: 5, not: 'Beş nesne; iki avuç da açık başlar.' },
  Düşük: { enAz: 5, enCok: 7, not: 'Tek bölme denenir.' },
  Ortalama: { enAz: 7, enCok: 10, not: 'İki üç farklı bölme aranır.' },
  Yüksek: { enAz: 10, enCok: 20, not: 'Bütün bölmeleri listelemesi istenir.' },
};

/** Yüzlük tablo — kart 3.2'nin hareket aralıkları. */
export const YUZLUK_ARALIK: ProfilAraliklari = {
  Diskalkuli: { enAz: 1, enCok: 30, not: 'Yalnızca +10 / −10; satır başlarında.' },
  Düşük: { enAz: 1, enCok: 60, not: '+10, −10, +1, −1 ayrı ayrı.' },
  Ortalama: { enAz: 1, enCok: 90, not: 'Zincirleme komutlar.' },
  Yüksek: { enAz: 1, enCok: 100, not: 'Üç adımlı zincir; sonra tablosuz tekrar.' },
};

/** Sayı doğrusu — kart 4.1 ve 8.4'ün sayı büyüklükleri. */
export const DOGRU_ARALIK: ProfilAraliklari = {
  Diskalkuli: { enAz: 2, enCok: 20, not: "Tek işlem; yirminin altında." },
  Düşük: { enAz: 10, enCok: 60, not: 'Sayı doğrusu açık kalır.' },
  Ortalama: { enAz: 20, enCok: 99, not: 'İki basamaklı örnek eklenir.' },
  Yüksek: { enAz: 100, enCok: 500, not: 'Üç basamaklı; yol sözel anlatılır.' },
};

/** Dizi / alan modeli — kart 6.1 ve 6.2'nin çarpan aralıkları. */
export const DIZI_ARALIK: ProfilAraliklari = {
  Diskalkuli: { enAz: 2, enCok: 5, not: '2 × 5 gibi küçük diziler.' },
  Düşük: { enAz: 3, enCok: 6, not: 'Döndürme gösterilir.' },
  Ortalama: { enAz: 4, enCok: 9, not: 'Döndürme çocuğa buldurulur.' },
  Yüksek: { enAz: 6, enCok: 12, not: 'Dizi iki parçaya ayrılarak çözülür.' },
};
