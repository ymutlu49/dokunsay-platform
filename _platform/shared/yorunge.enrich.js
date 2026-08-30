// ════════════════════════════════════════════════════════════════════════
// ÖĞRENME YÖRÜNGELERİ — Düzey Zenginleştirmesi (öğretmen/veli için derin içerik)
// ────────────────────────────────────────────────────────────────────────
// trajectories.data.js her düzeyin ADINI, YAŞ bandını, betimini (d), darboğaz
// işaretini (b) ve müdahale eşlemesini (iv) verir. Bu dosya, detay sayfası için
// her düzeye PEDAGOJİK DERİNLİK ekler:
//   how      → "Nasıl görünür": çocuğu bu düzeyde gözlerken NE görürsün (somut örnek)
//   teacher  → "Öğretmen notu": neden önemli / sık yanılgı / nelere dikkat
//   act      → "Çalakî / Etkinlik": { materials, steps[], criterion (✓), easy, hard }
//   tool     → (opsiyonel) bu düzey için en uygun DokunSay aracı kimliği
//
// build-yorunge.mjs, bir düzeyin zenginleştirmesi YOKSA temel veriye (d, task, iv)
// zarifçe düşer. Böylece her sayfa hemen yararlıdır; içerik fazlar hâlinde derinleşir.
//
// Kaynak çerçeve: Clements & Sarama [LT]² (learningtrajectories.org). Yaşlar
// olasılıksal alt-sınır niteliğinde illüstratiftir (tanı eşiği DEĞİL).
// ════════════════════════════════════════════════════════════════════════

// Yörünge-başı zenginleştirme modülleri (her biri kendi düzey dizisini export eder)
import count from './enrich-count.js'
import comp from './enrich-comp.js'
import add from './enrich-add.js'
import pattern from './enrich-pattern.js'
import compose from './enrich-compose.js'
import multdiv from './enrich-multdiv.js'
import frac from './enrich-frac.js'
import shape2d from './enrich-shape2d.js'
import comp2d from './enrich-comp2d.js'
import disembed from './enrich-disembed.js'
import shape3d from './enrich-shape3d.js'
import comp3d from './enrich-comp3d.js'
import spviz from './enrich-spviz.js'
import sporient from './enrich-sporient.js'
import mlen from './enrich-mlen.js'
import marea from './enrich-marea.js'
import mvol from './enrich-mvol.js'
import mang from './enrich-mang.js'
import classif from './enrich-classif.js'

export const ENRICH = {
  // ── SANBİL (Subitizing) — saymadan, bir bakışta miktarı bilme ────────────
  // Altın-standart şablon. 12 düzey: sezgisel ANS → algısal sanbil (≤5) →
  // kavramsal sanbil (parça-bütün, ≤20) → basamak değeri ve çarpımsal birimler.
  sub: [
    { // 0 — Sayı Sezici: Temeller (0–12 ay)
      how: 'Bebek, önündeki iki nesne üçe çıkınca daha uzun bakar; sayıyı adlandıramaz ama "bir şey değişti" diye sezer. Bu, dile dökülmemiş bir miktar duygusudur.',
      teacher: 'Bu en erken sayı sezgisidir (yaklaşık sayı sistemi, ANS). Henüz sayı sözcüğü yoktur; amaç saymak değil, miktar değişimine dikkati uyandırmaktır. Sonraki tüm sayı öğrenmesi bu çekirdek sezgiye yaslanır.',
      act: {
        materials: ['3–4 büyük, aynı renk nesne (top, küp)', 'bir tepsi veya örtü'],
        steps: [
          'Çocuğun önüne 2 nesne koyun, birlikte bakın.',
          'Örtüyle kapatıp gizlice 1 nesne ekleyin, açın.',
          '"Bak! Daha çok oldu!" deyin; tepkisini (bakış, uzanma) gözleyin.',
          'Bazen hiç değiştirmeyin — "aynı" durumla karşılaştırın.',
        ],
        criterion: 'Miktar değiştiğinde dikkati/bakışı belirgin değişiyorsa ✓',
        easy: 'Farkı abartın (1 ↔ 4).',
        hard: 'Yakın miktarlarla deneyin (2 ↔ 3).',
      },
    },
    { // 1 — Çok Küçük Sayı Tanıyıcı (12–24 ay)
      how: '"Bir" ve "iki" arasını ayırır: bir el kurabiye ile iki el kurabiyeyi gördüğünde, çoğu tutarlı biçimde seçer ya da "iki" der.',
      teacher: 'Burada miktar sezgisi dile değmeye başlar. "İki" sözcüğü çoğu çocukta ilk kararlı sayı etiketidir. Tekrar tekrar adlandırarak (parmak, nesne) bu eşlemeyi besleyin.',
      act: {
        materials: ['özdeş küçük nesneler (kaşık, blok)', 'iki küçük kâse'],
        steps: [
          'Bir kâseye 1, diğerine 2 nesne koyun.',
          '"Hangisinde daha çok var?" diye sorun ya da gösterin.',
          'Doğru seçimi adlandırın: "Evet, burada İKİ var."',
          'Yer değiştirip yineleyin; çocuk işaret/söz ile yanıtlasın.',
        ],
        criterion: '1 ile 2’yi tutarlı ayırt edip "iki"yi gösterir/söylerse ✓',
        easy: 'Nesneleri büyütün, aralarını açın.',
        hard: 'Aynı anda "bir tane ver / iki tane ver" deyin.',
      },
    },
    { // 2 — Küçük Koleksiyon Yapıcı (24–30 ay)
      how: '"Bana iki tane ver" dediğinizde, bir yığından tam iki nesne çekip uzatır — tek tek saymadan, isteneni "yapar".',
      teacher: 'Tanımaktan ÜRETMEYE geçiş kritik: çocuk artık miktarı yalnız görmüyor, talep üzerine oluşturuyor. "Bir" ve "iki" için sağlamsa, üçe geçmeden bunları pekiştirin.',
      act: {
        materials: ['DokunSay pulları ya da düğme/blok yığını', 'küçük tabak'],
        steps: [
          'Yığını ortaya koyun.',
          '"Bana BİR pul ver" deyin; aldığını birlikte adlandırın.',
          '"Şimdi İKİ pul ver" deyin.',
          'Verdiğini tabağa dizip "Evet, iki!" diye doğrulayın.',
        ],
        criterion: 'İstenen 1–2 nesneyi saymadan doğru üretirse ✓',
        easy: 'Önce siz bir model verin, o kopyalasın.',
        hard: '"Üç ver" ile sınırı yoklayın.',
      },
    },
    { // 3 — Küçük Koleksiyon Adlandırıcı (30–42 ay)
      how: 'Kart üzerinde 3 noktayı bir bakışta "üç" diye söyler. 4 nesne çoğu çocukta birkaç ay sonra gelir; başta "üç… dört?" diye duraksayabilir.',
      teacher: 'Bu, gerçek ALGISAL SANBİL’in eşiğidir: 1–3 saymadan adlandırılıyor. 3’ten 4’e geçiş yörüngenin ilk gerçek darboğazına hazırlıktır — acele saydırmayın, örüntüyü gösterin.',
      act: {
        materials: ['1–4 nokta kartları (zar düzeni)', 'DokunSay pulları'],
        steps: [
          'Bir kartı ~2 saniye gösterip kapatın ("şimşek" gibi).',
          '"Kaç gördün?" diye sorun — saymaya değil, bakmaya yönlendirin.',
          'Pullarla aynısını kurmasını isteyin.',
          '1, 2, 3 kartlarıyla çalışın; 4’ü en sona ekleyin.',
        ],
        criterion: '1–3’ü saymadan, bakışta doğru adlandırırsa ✓',
        easy: 'Kartı açık bırakın, süre tanıyın.',
        hard: 'Gösterimi kısaltın (~½ saniye) ya da 4’ü ekleyin.',
      },
    },
    { // 4 — Algısal Sanbil — 4'e dek (36–48 ay) ★ DARBOĞAZ
      how: '4 noktayı (kare düzende) saymadan "dört" der. Ama dağınık 4’te yine tek tek saymaya kayabilir: "bir-iki-üç-dört". 3 ile 4 arasındaki bu eşik yörüngenin ilk kritik geçişidir.',
      teacher: 'Bu düzeyde takılma, matematik öğrenme güçlüğü (diskalkuli) açısından erken bir uyarı işaretidir: tipik gelişende 4’e dek sanbil otomatikleşir. Çocuk hâlâ her şeyi tek tek sayıyorsa, ÖRÜNTÜ (zar/parmak düzeni) öğretin — düzenli yerleşim bakışta tanımayı kolaylaştırır. Hız değil, "bakıp bilme" alışkanlığı hedeftir.',
      act: {
        materials: ['DokunSay pulları/çubukları', '4’e dek nokta kartları (düzenli + dağınık)', 'kapatma kartı'],
        steps: [
          'Düzenli 4 (kare) gösterip kapatın: "Kaç?" — örüntüyü adlandırın: "iki ve iki, dört."',
          'Çocuk pullarla aynı düzeni kursun.',
          'Aynı 4’ü farklı dizilişlerde gösterin (sıra, kare, L) — "yine dört!" diye sayının korunduğunu vurgulayın.',
          '3 ↔ 4 kartlarını karıştırıp hızlı tanıma oyunu yapın.',
        ],
        criterion: '4’ü (en az düzenli dizilişte) saymadan, bakışta bilirse ✓',
        easy: 'Yalnız düzenli (zar) düzenle çalışın; 3’e geri dönüp güven verin.',
        hard: 'Dağınık 4 ve kısa gösterim; "5 de var mı?" diye yoklayın.',
        tool: 'bar',
      },
    },
    { // 5 — Algısal Sanbil — 5'e dek (48–54 ay)
      how: 'Zar beşini (dört köşe + orta) ya da bir eli bir bakışta "beş" diye bilir. El parmakları onun için güçlü, taşınabilir bir beş-örüntüsüdür.',
      teacher: '5, sonraki kavramsal sanbilin demir atağıdır ("beşli yapı"). Parmakları ve beşli çerçeveyi sık kullanın; çocuk 5’i bir bütün olarak "görsün" ki 6–10’u "5 ve biraz daha" diye çözebilsin.',
      act: {
        materials: ['DokunSay pulları', 'beşli çerçeve (1×5 kutu)', 'el/parmak'],
        steps: [
          'Beşli çerçeveyi dolu gösterin: "Kaç? — Beş, çerçeve dolu."',
          'Parmakla beşi gösterip kartla eşleştirin.',
          'Çocuk 5’i pullarla bir bakışta kursun (tek tek dizmeden).',
          '4 ↔ 5 ↔ 3 hızlı tanıma turu.',
        ],
        criterion: '5’i bakışta (parmak ya da beşli çerçeve düzeninde) bilirse ✓',
        easy: 'Hep beşli çerçeve düzenini kullanın.',
        hard: 'Çerçevesiz, dağınık 5; süreyi kısaltın.',
        tool: 'bar',
      },
    },
    { // 6 — Kavramsal Sanbil — 5'e dek (54–60 ay)
      how: '5 noktayı görüp "iki ve üç, beş" der — yani bütünü parçalarıyla görür. "Nasıl bildin?" diye sorduğunuzda "üçü gördüm, ikiyi gördüm" diye açıklayabilir.',
      teacher: 'Algısaldan KAVRAMSAL sanbile geçiş budur: artık miktarı parça-bütün olarak çözümlüyor. Bu, toplama-çıkarmanın ve "10 dostları"nın temelidir. Çocuğun gördüğü parçalanışı sözle adlandırması çok değerli — onu konuşturun.',
      act: {
        materials: ['DokunSay pulları (iki renk)', 'beşli çerçeve', 'nokta kartları (gruplu 5)'],
        steps: [
          '5’i 2+3 düzeninde (iki renk) gösterip kapatın: "Kaç? Nasıl?"',
          'Çocuk "iki ve üç" parçalarını söylesin.',
          'Aynı 5’i farklı kırın: 1+4, 4+1 — "yine beş" deyin.',
          'Pullarla 5’i kendi seçtiği bir kırılımla kursun ve anlatsın.',
        ],
        criterion: '5’i saymadan, iki parçaya ayırarak (ör. 2+3) bilir ve söylerse ✓',
        easy: 'Parçaları iki ayrı renkle belirginleştirin.',
        hard: 'Tek renk; "altıyı da kırabilir misin?" diye uzatın.',
        tool: 'bar',
      },
    },
    { // 7 — Kavramsal Sanbil — 7'ye dek (60–66 ay)
      how: '7 nesneyi "beş ve iki" ya da "dört ve üç" diye, beşli yapıyı çıpa alarak bakışta çözer. Tek tek saymaya artık ihtiyaç duymaz.',
      teacher: 'Beşli yapı burada işbaşında: 6 = 5+1, 7 = 5+2. Çocuk bunu kurabiliyorsa onluk dünyaya hazır demektir. Beşli çerçeveyi ikiye genişletin (5+çerçeve dışı), "beşten kaç fazla?" sorusunu yerleştirin.',
      act: {
        materials: ['DokunSay pulları (iki renk)', 'beşli + ek kutucuklar', 'gruplu nokta kartları (6–7)'],
        steps: [
          '7’yi 5+2 düzeninde gösterip kapatın: "Kaç? Beşten kaç fazla?"',
          'Çocuk "beş ve iki" desin, pullarla kursun.',
          '6 ve 7’yi farklı kırılımlarla gösterin (4+3, 4+2).',
          '"Hangisi daha çok, altı mı yedi mi?" diye bağ kurun.',
        ],
        criterion: '6–7’yi beşli yapıyı kullanarak (ör. 5+2) saymadan bilirse ✓',
        easy: 'Hep 5+ düzeni; ikinci parça ≤2.',
        hard: 'Beşli çıpa olmadan (4+3) kırılımlar.',
        tool: 'bar',
      },
    },
    { // 8 — Kavramsal Sanbil — 10'a dek (66–72 ay)
      how: 'Onluk çerçevedeki 8’i "beş ve üç" ya da "ikisi eksik on" diye bir bakışta bilir. Dolu/boş kutuları okuyarak miktarı hızla çözer.',
      teacher: 'Onluk çerçeve (10’lu kutu) bu düzeyin can damarıdır: 10’a tümleyeni "görünür" kılar (8 → 2 boş kutu → "10’a 2 lazım"). Bu, zihinden toplama-çıkarmanın ve basamak değerinin doğrudan zeminidir. Çocuğu "kaç boş?" diye düşündürün.',
      act: {
        materials: ['DokunSay pulları', 'onluk çerçeve (2×5)', '6–10 gruplu kartlar'],
        steps: [
          'Onluk çerçevede 8 gösterip kapatın: "Kaç dolu? Kaç boş?"',
          'Çocuk "sekiz dolu, iki boş — ona iki lazım" desin.',
          '7, 9, 6’yı dolu/boş okumasıyla çözdürün.',
          '"Ona tamamla" oyunu: siz 6 koyun, o 4 eklesin.',
        ],
        criterion: '6–10’u onluk çerçeve yapısıyla (dolu/boş) saymadan bilirse ✓',
        easy: 'Çerçeveyi hep beşli iki sıra hâlinde tutun.',
        hard: 'Çerçevesiz gruplu düzen; "10’a kaç eksik?" hız turu.',
        tool: 'bar',
      },
    },
    { // 9 — Kavramsal Sanbil — 20'ye dek (72–84 ay)
      how: 'İki onluk çerçeveyle 14’ü "bir dolu on ve dört" diye okur. 10’u bir BİRİM gibi görür: "on ve dört, on dört".',
      teacher: '10’un tek bir birim olarak görülmesi (birimleme) basamak değerinin kalbidir. Çift çerçeve "bir onluk + birlikler" yapısını somutlar. Çocuk "on dört = bir on ve dört" diyebiliyorsa, yazılı basamak değerine köprü kuruludur.',
      act: {
        materials: ['DokunSay pulları/çubukları', 'iki onluk çerçeve', '11–20 kartları'],
        steps: [
          'Bir çerçeveyi tam doldurun (10), ötekine 4 koyun, kapatın.',
          '"Kaç? — On ve dört, on dört" yapısını kurdurun.',
          'Farklı sayılar (12, 17) için "kaç onluk, kaç birlik?" sorun.',
          'DokunSay çubuğunda 10’luk çubukla birlikleri eşleştirin.',
        ],
        criterion: '11–20’yi "bir onluk ve birlikler" olarak saymadan çözerse ✓',
        easy: 'İlk çerçeve hep tam dolu (10) olsun.',
        hard: '"On yedi, ona kaç kalır yirmiye?" gibi çift adımlı sorular.',
        tool: 'bar',
      },
    },
    { // 10 — Basamak Değerli Kavramsal Sanbil (84–96 ay)
      how: 'Onluk bloklarla gösterilen 34’ü saymadan "üç onluk ve dört, otuz dört" diye çözer. Onlukları tek tek değil, demet olarak okur.',
      teacher: 'Artık sanbil basamak değerine ölçeklenir: onluk demetleri çarpımsal okur (3 demet = otuz). DokunSay Basamak aracı (birlik-onluk-yüzlük blokları) bu düzeyi doğrudan besler. "Kaç onluk?" → "kaç eder?" zincirini kurun.',
      act: {
        materials: ['DokunSay Basamak blokları (onluk çubuk + birlik küp)', '2 basamaklı sayı kartları'],
        steps: [
          '3 onluk çubuk + 4 birlik gösterip kapatın: "Kaç?"',
          'Çocuk "üç onluk, dört birlik — otuz dört" desin.',
          'Onluk sayısını değiştirin (5 onluk = elli) — çarpımsal okuyuşu vurgulayın.',
          'Yazılı sayıyı (34) blok düzenine eşleştirin.',
        ],
        criterion: 'Onluk yapıları bakışta çözüp 2 basamaklı sayıyı saymadan söylerse ✓',
        easy: 'Birlik sayısını 0–3’te tutun, yalnız onlukları okutun.',
        hard: '3 basamağa geçin (yüzlük levha ekleyin).',
        tool: 'basamak',
      },
    },
    { // 11 — Çarpımsal Düşünmeli Kavramsal Sanbil (96–108 ay)
      how: '3×4 nokta dizilimini tek tek saymadan "üç sıra, her birinde dört — on iki" diye çözer. Diziyi satır × sütun birimiyle okur.',
      teacher: 'Sanbilin doruğu: miktarı çarpımsal birimlerle görme. Bu, çarpma ve alanın algısal temelidir. Dizi (array) modeliyle çalışın; çocuk "tekrarlı toplama"dan "satır × sütun"a geçsin. DokunSay Bar’ın dizi düzeni ya da Basamak’ın ızgarası uygundur.',
      act: {
        materials: ['DokunSay pulları (ızgaraya dizili)', 'dizi (array) kartları (2×3, 3×4)', 'kapatma kartı'],
        steps: [
          '3×4 diziyi gösterip kapatın: "Kaç? Nasıl saydın?"',
          'Çocuk "üç sıra, dörder — on iki" desin.',
          'Diziyi döndürün (4×3) — "yine on iki" deyin (değişme).',
          'Farklı diziler (2×5, 3×3) için satır×sütun okuyuşunu pekiştirin.',
        ],
        criterion: 'Diziyi satır × sütun çarpımsal birimle, tek tek saymadan çözerse ✓',
        easy: 'Küçük diziler (2×2, 2×3) ve açık gösterim.',
        hard: 'Büyük diziler (4×5), kısa gösterim, "yarısı kaç?" uzantısı.',
        tool: 'bar',
      },
    },
  ],

  count, comp, add, pattern,
  compose, multdiv, frac,
  shape2d, comp2d, disembed, shape3d, comp3d, spviz, sporient,
  mlen, marea, mvol, mang,
  classif,
  // Kalan EXT yörüngeler sonraki fazda. Zenginleştirme yokken generator temel veriye (d, task, iv) düşer.
}

// Bir düzeyin zenginleştirmesini getir (yoksa null)
export function enrichOf(key, index) {
  const arr = ENRICH[key]
  return (arr && arr[index]) || null
}
