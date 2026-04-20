/** Etkinlik tanımları */
export const ACTIVITIES = [
  { name: 'Serbest Keşif', icon: '🎨', category: 'keşif', difficulty: 1, description: 'Pulları ve sayı doğrusunu kullanarak tam sayıları keşfet!' },
  { name: 'Pozitif Sayılar', icon: '🟢', category: 'kavram', difficulty: 1, description: 'Yeşil (+) pulları kanvasa sürükle. +1, +2, +3 oluştur. Sıfırın sağında!' },
  { name: 'Negatif Sayılar', icon: '🔴', category: 'kavram', difficulty: 1, description: 'Kırmızı (−) pulları sürükle. −1, −2, −3 oluştur. Sıfırın solunda!' },
  { name: 'Sıfır Çifti', icon: '🟣', category: 'kavram', difficulty: 1, description: '(+1)+(−1)=0. ⊕⊖ butonuyla sıfır çifti ekle, birbirini yok ettiğini gör!' },
  { name: 'İki Pozitif Toplama', icon: '➕', category: 'işlem', difficulty: 1, description: '(+4)+(+2)=? Toplam alanına 4 yeşil, sonra 2 yeşil pul ekle.' },
  { name: 'İki Negatif Toplama', icon: '➕', category: 'işlem', difficulty: 2, description: '(−3)+(−2)=? 3 kırmızı + 2 kırmızı ekle. Sonuç: −5' },
  { name: 'Pozitif + Negatif', icon: '🔄', category: 'işlem', difficulty: 2, description: '(+5)+(−3)=? Pulları ekle, sıfır çiftlerini eşleştir. Kalan = sonuç!' },
  { name: 'İki Pozitif Çıkarma', icon: '➖', category: 'işlem', difficulty: 2, description: '(+7)−(+3)=? 7 yeşil koy, 3 tanesini sil.' },
  { name: 'Sıfır Çiftiyle Çıkarma', icon: '➖', category: 'işlem', difficulty: 3, description: '(+3)−(−2)=? Kırmızı pul yok! 2 sıfır çifti ekle, 2 kırmızıyı çıkar → +5' },
  { name: 'Çarpma: Tekrarlı Toplam', icon: '✖️', category: 'işlem', difficulty: 3, description: '(+3)×(−2)=? 3 grup, her grupta 2 kırmızı. Toplam −6' },
  { name: 'Bölme: Eşit Paylaşım', icon: '➗', category: 'işlem', difficulty: 3, description: '(−6)÷(+2)=? 6 kırmızıyı 2 gruba böl. Her grupta −3' },
  { name: 'Karşılaştırma', icon: '⚖️', category: 'karşılaştır', difficulty: 2, description: '(−3) ile (+2)\'yi karşılaştır. Sayı doğrusunda sağdaki büyüktür!' },
  { name: 'Y1: Eksi × Eksi', icon: '🔍', category: 'yanılgı', difficulty: 3, description: '(−2)×(−3)=+6. İki negatifin çarpımı pozitiftir!' },
  { name: 'Y2: Büyük sayı mı?', icon: '🔍', category: 'yanılgı', difficulty: 2, description: '−5 mi +2 mi büyük? Negatifler her zaman pozitiflerden küçüktür!' },
  { name: 'Y3: Çıkarmada işaret', icon: '🔍', category: 'yanılgı', difficulty: 3, description: '(+3)−(−4)=+7. Negatif çıkarmak = pozitif eklemek!' },
  { name: 'Y4: İşaret mi işlem mi?', icon: '🔬', category: 'yanılgı', difficulty: 2, description: '(−3)+5\'te \'−\' sayının işareti (isim), \'+\' işlem (fiil). Farklı şeyler! Pullarla göster.' },
  { name: 'Y5: Mutlak değer yanılgısı', icon: '🔬', category: 'yanılgı', difficulty: 2, description: '|−7|>|3| ama −7<3! Sayı doğrusunda −7 solda, 3 sağda. Uzaklık ≠ büyüklük.' },
  { name: 'Y6: Çıkarma küçültür mü?', icon: '🔬', category: 'yanılgı', difficulty: 3, description: '3−(−4)=7. Çıkarma her zaman küçültmez! Negatif çıkarmak büyütür.' },
  { name: 'Y7: Sıfır nötr mü?', icon: '🔬', category: 'yanılgı', difficulty: 1, description: 'Sıfır ne pozitif ne negatif! Sayı doğrusunda tam ortada. Sıfır çiftinin sonucudur: (+1)+(−1)=0' },
  { name: 'Y8: Borç silmek = kazanç', icon: '🔬', category: 'yanılgı', difficulty: 3, description: '(−)×(−)=(+) neden? 3 borç silindi → 3 kazanç! Borç/alacak modeliyle dene.' },
  { name: 'Asansör Problemi', icon: '🏢', category: 'senaryo', difficulty: 1, description: '0. kattan başla. 3 kat yukarı çık (+3), sonra 5 kat aşağı in (−5). Kaçıncı kattasın? Dikey sayı doğrusunu kullan!' },
  { name: 'Termometre', icon: '🌡️', category: 'senaryo', difficulty: 1, description: 'Sabah sıcaklık +5°C. Gece 8°C düştü. Kaç derece? (+5)+(−8)=−3°C. Termometrede göster!' },
  { name: 'Borç / Alacak', icon: '💰', category: 'senaryo', difficulty: 2, description: 'Cüzdanında 10₺ var (+10). 15₺ borç aldın (−15). Toplam durumun: (+10)+(−15)=−5. Hâlâ borçlusun!' },
  { name: 'Deniz Seviyesi', icon: '🐟', category: 'senaryo', difficulty: 1, description: 'Deniz seviyesi = 0. Balık −5\'te, kuş +4\'te. Aralarındaki fark kaç birim? Dikey sayı doğrusunda bul!' },
];

/** Ders planları */
export const LESSONS = [
  { name: '1. Tam Sayı Kavramı', description: 'Pozitif, negatif, sıfır', activityIndices: [1, 2, 3] },
  { name: '2. Toplama', description: 'Aynı ve farklı işaretli', activityIndices: [4, 5, 6] },
  { name: '3. Çıkarma', description: 'Sıfır çifti yöntemi', activityIndices: [7, 8] },
  { name: '4. Çarpma & Bölme', description: 'Tekrarlı toplam, eşit paylaşım', activityIndices: [9, 10] },
  { name: '5. Gerçek Hayat', description: 'Asansör, termometre, borç, deniz', activityIndices: [20, 21, 22, 23] },
  { name: '6. Kavram Yanılgıları', description: 'Yaygın hatalar', activityIndices: [12, 13, 14, 15, 16, 17, 18, 19] },
];

/** Kategori etiketleri */
export const CATEGORY_LABELS = {
  'keşif': 'Keşif',
  'kavram': 'Kavram',
  'işlem': 'İşlemler',
  'karşılaştır': 'Karşılaştırma',
  'senaryo': '🌍 Gerçek Hayat',
  'yanılgı': '🔍 Yanılgı',
};

/** Kategori renkleri */
export const CATEGORY_COLORS = {
  'yanılgı': '#ef4444',
  'senaryo': '#3b82f6',
};
