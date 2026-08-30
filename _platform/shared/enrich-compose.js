// Sayı Oluşturma (Composing Numbers) — düzey zenginleştirmesi (Clements & Sarama)
// ────────────────────────────────────────────────────────────────────────
// trajectories.data.js içindeki CORE `compose` dizisiyle AYNI sırada 11 nesne.
// Her düzey: how (nasıl görünür) · teacher (öğretmen notu) · act (etkinlik) · viz/tool (ops.)
// Çekirdek fikir: PARÇA-BÜTÜN — bir bütün, iki (ya da daha çok) parçaya ayrılır ve
// yeniden birleşir. DokunSay Bar (iki renkli pul) bu ayrışım/bileşimi görünür kılar;
// "10 dostları" (10'a tamamlayan ikililer) ve onluk+birlik köprüsü (11–19) vurguludur.
// Çok basamaklıda DokunSay Basamak aracı devreye girer.
// Darboğazlar: düzey 3 (4–5'e oluşturma), 5 (10'a oluşturma), 7 (onluk-birlikle oluşturma).
export default [
  { // 0 — Parçalar Üzerinde Eyleyen: Temeller (0–18 ay)
    how: "Bebek/küçük çocuk bir küme oyuncağı kendiliğinden iki kaba boşaltıp yeniden bir araya toplar; bir kule yıkılınca parçaları tekrar yığar. Henüz sayı yoktur, ama \"bütün parçalara ayrılır, parçalar birleşir\" eylemini elleriyle yaşar.",
    teacher: "Bu, parça-bütün düşüncesinin bedensel tohumudur: dökmek, ayırmak, toplamak, birleştirmek — sayı oluşturmanın bütün temeli bu somut eylemlerdir. Henüz \"kaç\" sorusu yoktur; amaç bölme/birleştirme deneyimini bolca yaşatmaktır. Kaplara boşaltma, kaşıkla aktarma gibi günlük oyunlar bu sezgiyi besler.",
    act: {
      materials: ["DokunSay pulları (bir kapta bol miktarda)", "iki küçük kâse ya da kutu"],
      steps: [
        "Pulları bir kâseye koyup çocuğun önüne bırakın.",
        "Birlikte ikinci kâseye birkaçını aktarın: \"Buraya da koyalım.\"",
        "Sonra ikisini tekrar tek kâsede birleştirin: \"Hepsi yine bir arada!\"",
        "Çocuğun kendiliğinden dökmesine, ayırmasına, toplamasına izin verin.",
      ],
      criterion: "Bir bütünü kendiliğinden parçalara ayırıp yeniden birleştirmeyi (bölme/birleştirme denemesi) gösterirse ✓",
      easy: "Büyük, tutması kolay pullarla ve tek bir ikinci kaba aktarmayla çalışın.",
      hard: "Üç kaba dağıtmasına ve sonra hepsini toplamasına fırsat verin.",
    },
  },
  { // 1 — Parça Birleştiren (18–36 ay)
    how: "Bir elinde 2 pul, öbür elinde 1 pul varken \"Hepsi kaç oldu?\" deyince ikisini bir avuçta toplar ve tek bir küme gibi gösterir. İki ayrı küçük parçayı zihninde tek bütün olarak görmeye başlar.",
    teacher: "Bu, bileşimin (composing) ilk gerçek adımıdır: iki ayrı parça, birleşince tek bir bütün olur. Çocuk henüz toplamı saymadan söyleyemeyebilir; önemli olan iki parçayı fiziksel olarak birleştirip \"hepsi\" diye bir bütün kabul etmesidir. Parçaları iki ayrı renkte tutmak bütünün içindeki iki parçayı görünür kılar.",
    act: {
      materials: ["DokunSay pulları (iki renk)", "birleştirmek için küçük bir tabak ya da avuç"],
      steps: [
        "Bir avucunuza 2 mavi pul, çocuğun avucuna 1 kırmızı pul koyun.",
        "\"Seninkini benimkiyle birleştirelim\" deyip ikisini bir tabakta toplayın.",
        "\"Bak, hepsi bir arada oldu\" diyerek bütünü gösterin.",
        "Parçaları değiştirip (1 ve 2, sonra 2 ve 2) yineleyin.",
      ],
      criterion: "İki küçük parçayı tek bir küme olarak bir araya getirip \"hepsi\" diye bütün kabul ederse ✓",
      easy: "Hep 1 ve 1 ile başlayın; siz birleştirin, o izlesin/taklit etsin.",
      hard: "Parçaları 2 ve 2 yapıp \"şimdi hepsi kaç?\" diye saydırın.",
    },
    viz: { t: "dots", group: [2, 1] },
    tool: "bar",
  },
  { // 2 — Parça-Bütün Tanıyıcı (36–48 ay)
    how: "4 pulu gösterip 2'sini elinizle örttüğünüzde çocuk, örtülenlerin de bütünün bir parçası olduğunu bilir: \"Onlar da var, hepsi dört.\" Görünmeyen parçanın yok olmadığını, bütüne ait kaldığını kavrar.",
    teacher: "Burada parça-bütün ilişkisi bir kavrama dönüşür: bir bütün, içinde gizlenmiş parçalardan oluşur ve parça örtülse de bütüne aittir. Bu, \"ört ve sor\" (örtülen kaç?) etkinliklerinin ve ileride bilinmeyen-parça problemlerinin (4'ün 2'si burada, kaçı saklı?) zeminidir. Çocuğa parçayı örtüp \"kaçı saklı?\" diye sorun; gizli parçayı düşünmesini sağlayın.",
    act: {
      materials: ["DokunSay pulları (iki renk, 4'lük küme)", "örtmek için küçük bir kart ya da el"],
      steps: [
        "4 pulu tek sıraya dizip birlikte sayın: \"dört.\"",
        "2'sini kartla örtün: \"Şimdi kaç tane görüyorsun? Peki örtünün altında?\"",
        "Çocuk \"iki görünüyor, iki saklı, hepsi dört\" desin.",
        "Örtüyü kaldırıp doğrulayın; örtülen sayıyı değiştirip yineleyin.",
      ],
      criterion: "Bir parça örtüldüğünde, örtülenin de bütünün parçası olduğunu (yok olmadığını) söyler/gösterirse ✓",
      easy: "3'lük küme ve yalnız 1 pulu örtün; saklıyı birlikte hatırlayın.",
      hard: "5'lik kümeyle ve farklı sayıda örtmeyle (\"3 saklı, kaç görünür?\") çalışın.",
    },
    viz: { t: "dots", group: [2, 2] },
    tool: "bar",
  },
  { // 3 — 4'e, ardından 5'e Oluşturucu (48–60 ay) ★ DARBOĞAZ
    how: "Çocuk 4 pulu iki kutuya farklı şekillerde dağıtır (3 ve 1, 2 ve 2) ve her seferinde toplamın yine 4 olduğunu bilir; sonra aynısını 5 ile yapar. Henüz oturmamışsa her dağıtımdan sonra toplamı baştan saymak zorunda kalır ya da parçaları değişince \"daha çok/az oldu\" sanır.",
    teacher: "Burası ilk gerçek darboğazdır: küçük bir sayıyı (4–5) esnekçe parçalara ayırıp yeniden bütünleyebilmek, tüm toplama-çıkarmanın çekirdeğidir. Parçalar değişse de bütünün korunduğunu (4 = 3+1 = 2+2) kavrayamamak — her dağıtımı yeniden saymak ya da \"şimdi daha çok\" sanmak — matematik öğrenme güçlüğü (diskalkuli) açısından erken bir uyarı işaretidir; çünkü sayı henüz esnek bir bütün olarak içselleşmemiştir. İki renkli pullarla farklı kırılımları yan yana gösterin (\"yine dört, sadece başka türlü ayrıldı\"); önce 4'ü, sağlamlaşınca 5'i çalışın.",
    act: {
      materials: ["DokunSay pulları (iki renk)", "ayırmak için iki küçük kutu ya da bölmeli tabak", "kapatma kartı"],
      steps: [
        "4 pulu çocuğa verip iki kutuya dağıtmasını isteyin; her kutudaki sayıyı söyletin (ör. 3 ve 1).",
        "\"Hepsi kaç?\" deyin; yeniden sayarsa \"dördü hiç bozmadık, yine dört\" diye bütünün korunduğunu vurgulayın.",
        "Pulları toplayıp başka türlü dağıttırın (2 ve 2); aynı bütünün farklı kırılımını yan yana gösterin.",
        "5 pulla yineleyin; bulduğu tüm ikilileri (4+1, 3+2…) birlikte bir liste gibi söyleyin.",
      ],
      criterion: "4'ü (ardından 5'i) farklı ikili parçalara ayırıp her seferinde yeniden saymadan bütünün aynı kaldığını bilirse ✓",
      easy: "Yalnız 4 ile ve tek bir kırılımla (3+1) başlayın; siz dağıtın, o toplamı söylesin.",
      hard: "5'in tüm ikili kırılımlarını sırayla buldurun (5+0, 4+1, 3+2) ya da \"bir kutuda 2 varsa öbüründe kaç?\" diye eksik parçayı sordurun.",
    },
    viz: { t: "dots", group: [3, 2] },
    tool: "bar",
  },
  { // 4 — 7'ye Oluşturucu (54–66 ay)
    how: "7 pulu iki kutuya bölüp \"3 burada, kaç tane orada?\" diye sorduğunuzda saymadan \"dört\" der. Beşli yapıyı çıpa alarak (5 ve 2, 4 ve 3) 7'yi ikili parçalara ayırır ve eksik parçayı bulur.",
    teacher: "Burada bileşim 5'in ötesine geçer ve beşli yapı işbaşındadır: 6 = 5+1, 7 = 5+2. Çocuk bir parçayı görüp diğerini saymadan söyleyebiliyorsa, parça-bütün ilişkisini gerçekten içselleştirmiş demektir. Bu, ileride \"eksik toplananı bulma\" (3 + ? = 7) becerisinin doğrudan temelidir. Bir parçayı sabit tutup öbürünü değiştirerek bileşim ailesini (6+1, 5+2, 4+3) birlikte keşfedin.",
    act: {
      materials: ["DokunSay pulları (iki renk)", "iki bölmeli tabak ya da beşli çerçeve", "kapatma kartı"],
      steps: [
        "7 pulu beşli çerçevede 5+2 düzeninde gösterip \"yedi: beş ve iki\" deyin.",
        "Bir parçayı (ör. 3) örtün: \"Üçü gördük, kaçı saklı?\"; çocuk saymadan \"dört\" desin.",
        "Parçaları değiştirin (6 ve 1, 4 ve 3); her ikilinin yine 7 ettiğini söyletin.",
        "\"3 burada ise orada kaç?\" gibi eksik-parça sorularıyla pekiştirin.",
      ],
      criterion: "7'nin bir parçasını görüp diğerini (eksik parçayı) saymadan söyler; ikili ayrışımları bilirse ✓",
      easy: "Hep 5+ düzeninde tutun; ikinci parça ≤2 olsun (5+2, 6+1).",
      hard: "Beşli çıpa olmadan (4+3) kırılımlar ya da 6'nın ve 7'nin tüm ikililerini buldurun.",
    },
    viz: { t: "dots", group: [5, 2] },
    tool: "bar",
  },
  { // 5 — 10'a Oluşturucu (60–72 ay) ★ DARBOĞAZ
    how: "\"10'u iki kutuya kaç farklı şekilde ayırabilirsin?\" dediğinizde çocuk 6+4, 7+3, 8+2… diye akıcı üretir; \"7 varsa ona kaç lazım?\" sorusuna saymadan \"üç\" der. 10'a tamamlayan ikilileri (\"10 dostları\") ezbere yakın bilir.",
    teacher: "Bu yörüngenin en kritik darboğazıdır: 10'un bileşenlerini (\"10 dostları\": 9+1, 8+2, 7+3, 6+4, 5+5) akıcı bilmek, zihinden toplama-çıkarmanın ve onluğa köprüleme stratejisinin (8+5 → 8+2+3) bel kemiğidir. 10'a tamamlamada süreğen güçlük — her seferinde parmakla baştan saymak, tümleyeni getirememek — matematik öğrenme güçlüğü (diskalkuli) için güçlü bir erken belirtidir. Onluk çerçeveyi kullanın: dolu kutular bir parçayı, boş kutular tümleyeni \"görünür\" kılar (7 dolu → 3 boş → \"ona 3 lazım\"). \"Kaç boş?\" sorusunu sürekli sorun.",
    act: {
      materials: ["DokunSay pulları (iki renk)", "onluk çerçeve (2×5 kutu)", "kapatma kartı"],
      steps: [
        "Onluk çerçeveye 7 pul koyun: \"Kaç dolu? Kaç boş? Ona kaç lazım?\"",
        "Çocuk \"yedi dolu, üç boş — ona üç lazım\" desin; boşları öbür renkle doldurtun.",
        "Farklı sayılarla yineleyin (6→4, 8→2, 5→5); her tümleyeni saymadan buldurun.",
        "Tüm \"10 dostları\"nı birlikte bir liste gibi söyleyin: 9+1, 8+2, 7+3, 6+4, 5+5.",
      ],
      criterion: "10'un bileşenlerini (ör. 6+4, 7+3) akıcı üretir ve verilen bir parçaya tümleyeni (\"ona kaç lazım?\") saymadan söylerse ✓",
      easy: "Çerçeveyi hep beşli iki sıra hâlinde tutun; önce 5+5 ve 9+1 gibi kolay ikililerle başlayın.",
      hard: "Çerçevesiz, yalnız sözlü olarak \"10 dostları\"nı sorun ya da \"8 ve kaç eder 10, peki 11?\" diye 10'u aşan adıma uzatın.",
    },
    viz: { t: "tenframe", n: 10, frames: 1 },
    tool: "bar",
  },
  { // 6 — 20+ Oluşturucu (72–84 ay)
    how: "12–15 pulu iki kutuya paylaştırıp \"Toplam kaç?\" diye sorduğunuzda çocuk parçaları (ör. 10 ve 4) birleştirip saymadan ya da onluğu çıpa alarak 14 der; 20'ye dek bileşim/ayrışımı doğru yapar. Onluk yapıyı kullanarak büyük sayıyı parçalar.",
    teacher: "Bileşim artık 10'u aşar ve onluk yapı bir araç hâline gelir: 14 = 10+4, 18 = 10+8. Çocuk bir onluğu tek bir parça gibi kullanıp kalan birlikleri ekleyebiliyorsa, basamak değerine geçişe hazırdır. 10'a köprüleme stratejisini (\"önce 10'a tamamla, sonra kalanı ekle\") bu aralıkta bilinçli kullanmaya başlar. Bir parçayı 10 olarak sabitleyip öbürünü değiştirerek onluk yapının kolaylığını gösterin.",
    act: {
      materials: ["DokunSay pulları/çubukları (iki renk, 20'ye dek)", "iki onluk çerçeve ya da iki kutu"],
      steps: [
        "14 pulu bir onluk çerçeveyi tam doldurarak (10) ve yanına 4 koyarak gösterin: \"On ve dört — on dört.\"",
        "Pulları iki kutuya başka türlü paylaştırın (8 ve 6): \"Toplam kaç?\"; onluğa köprüleyerek (8+2+4) buldurun.",
        "\"15'i 10 ve kaç diye ayırırsın?\" gibi onluk-temelli ayrışım sorun.",
        "16–20 arası farklı sayılarla bileşim ve ayrışım turları yapın.",
      ],
      criterion: "20'ye dek bir sayıyı (onluk yapıyı kullanarak) iki parçaya bileştirip ayrıştırmayı doğru yaparsa ✓",
      easy: "Bir parçayı hep 10 (tam çerçeve) tutun; öbür parçayı ≤5 yapın.",
      hard: "İki parçanın da onluğu aşmadığı kırılımlar (9+8) ya da \"17, ona kaç kalır yirmiye?\" gibi çift adım.",
    },
    viz: { t: "tenframe", n: 14, frames: 2 },
    tool: "bar",
  },
  { // 7 — Onluk ve Birlikle Oluşturucu (78–90 ay) ★ DARBOĞAZ
    how: "17 pulu \"bir onluk ve birlikler\" diye gruplattığınızda çocuk 10'luk bir çubukla (ya da tam dolu onluk çerçeveyle) 7 birliği bir araya getirip \"bir onluk, yedi birlik — on yedi\" der. 11–19 sayılarını onluk+birlik yapısıyla kurar; yazılı \"17\"deki 1'in \"bir onluk\" olduğunu kavrar.",
    teacher: "Bu, basamak değerine açılan köprü düzeyidir ve bir darboğazdır: 11–19'un her birini \"bir onluk + birlikler\" olarak görmek (17 = 1 onluk + 7 birlik), iki basamaklı sayı sisteminin temelidir. 10'u tek tek değil, tek bir BİRİM (\"bir onluk\") olarak görememek — 17'yi hâlâ on yedi ayrı pul sayan, yazılı 1'i \"bir\" sanan çocuk — matematik öğrenme güçlüğü (diskalkuli) açısından kritik bir uyarıdır; çünkü birimleme (10'u demet sayma) kurulamamıştır. DokunSay Basamak aracında onluk çubuğu birlik küplerle eşleştirin; \"yazılı 17'deki 1 ne demek?\" diye yapıyı söyletin.",
    act: {
      materials: ["DokunSay Basamak blokları (onluk çubuk + birlik küp)", "11–19 sayı kartları", "boş onluk çerçeve (yedek)"],
      steps: [
        "17 pulu önce dağınık koyun; \"Bunları saymak yerine onar gruplayalım\" deyip bir onluk çubuk yapın.",
        "Kalan 7'yi birlik küp olarak yanına dizin: \"Bir onluk, yedi birlik — kaç eder?\"",
        "Çocuk \"on yedi\" desin; yazılı 17 kartını gösterip \"buradaki 1 ne, 7 ne?\" diye yapıyı söyletin.",
        "Farklı sayılarla (13, 18) \"bir onluk + birlikler\" kurdurun; bir birlik ekleyip \"şimdi kaç?\" deyin.",
      ],
      criterion: "Toplamı 18'e dek çift/yakın-çift kombinasyonlarını bilir; 11–19 arası bir sayıyı \"bir onluk + birlikler\" olarak (ör. 1 onluk + 7 birlik = 17) kurar ve yazılı sayıdaki basamak değerini söylerse ✓",
      easy: "Önce hep tam bir onluk + az birlik (1 onluk + 2 = 12) ile çalışın; onluğu birlikte sayıp demetleyin.",
      hard: "İki onluğa geçin (20–24) ya da onluğu bozarak (bir onluk = on birlik) yeniden saydırın.",
    },
    viz: { t: "baseten", tens: 1, ones: 7 },
    tool: "basamak",
  },
  { // 8 — Türeten +/− (Oluşturma) (84–96 ay)
    how: "\"6+4=10 biliyorsan 6+5 kaçtır?\" dediğinizde çocuk baştan saymadan \"on bir\" der; bilinen bir bileşimden komşu sonucu türetir (\"bir fazla, demek 11\"). Bir olguyu çıpa alıp +1/−1 ya da ikili-üzerinden akıl yürütür.",
    teacher: "Bu, ezberden akıl yürütmeye geçiştir: çocuk her sonucu yeniden hesaplamak yerine bildiği bir bileşimi (\"demir atmış olgu\") kullanıp komşu olguyu türetir. 10 dostları, ikilemeler (5+5) ve \"bir fazla/bir az\" ilişkileri bu türetmenin çıpalarıdır. \"6+4'ü biliyoruz; 6+5 bir fazla\" gibi ilişkiyi sözle kurdurmak kazanımdır — sonucu değil, yolu konuşturun.",
    act: {
      materials: ["DokunSay pulları (iki renk)", "bilinen-olgu kartları (6+4=10, 5+5=10)", "onluk çerçeve"],
      steps: [
        "Bilinen bir bileşimi kurun: \"6+4=10, bunu biliyoruz.\"",
        "Bir pul ekleyin: \"6+5 — biri fazla, o zaman kaç?\"; çocuk \"on bir\" desin.",
        "Tersini yapın: \"6+4=10 ise 6+3 kaç? Biri eksik.\"",
        "Başka çıpalardan (5+5=10 → 5+6) türetmeler isteyin; her seferinde \"neden?\" diye yolu söyletin.",
      ],
      criterion: "Bilinen bir bileşimden komşu bir sonucu (ör. 6+4=10'dan 6+5=11) yeniden saymadan türetir ve gerekçesini söylerse ✓",
      easy: "Yalnız +1 türetmeleri ve 10 çıpasıyla (6+4 → 6+5) çalışın.",
      hard: "±2 türetmeler (6+4 → 6+6) ya da çıkarmaya taşıyın (10−4'ten 10−5).",
    },
    tool: "bar",
  },
  { // 9 — Problem Çözen +/− (Oluşturma) (96–108 ay)
    how: "İki kutudaki pullarla anlatılan çok adımlı bir hikâye problemini (\"Kutuda 8 vardı, 5 ekledim, sonra 4 verdim — şimdi kaç?\") çocuk bileşim/ayrışımla esnek çözer; kolayına gelen yolu (önce 10'a tamamla ya da geriye say) seçer. Stratejisini değiştirebilir.",
    teacher: "Burada bileşim becerisi gerçek problemlere taşınır: çocuk parça-bütün ilişkisini kullanarak değişim (ekleme/çıkarma), birleştirme ve karşılaştırma problemlerini çözer. Önemli olan tek bir yönteme saplanmak değil, sayılara göre en uygun stratejiyi (10'a köprüleme, türetilmiş olgu, geriye sayma) esnek seçebilmesidir. Çözdükten sonra \"başka nasıl yapardın?\" diye alternatif yolu da konuşturun.",
    act: {
      materials: ["DokunSay pulları (iki renk)", "iki kutu ya da bölmeli tabak", "kısa hikâye-problem kartları"],
      steps: [
        "Bir hikâye kurun: \"Bir kutuda 7, öbüründe 6 pul var — toplam kaç?\"; çocuk kendi yoluyla çözsün.",
        "Çözümünü anlattırın: \"Nasıl buldun?\" (ör. 7+3+3, ya da 6+6+1).",
        "Problemi büyütün: \"3 pul daha eklersek? 4 verirsek?\" — çok adımlı izlesin.",
        "Aynı problemi farklı bir stratejiyle de çözmesini isteyin; yolları karşılaştırın.",
      ],
      criterion: "Bileşim temelli çok adımlı bir problemi doğru çözer ve duruma uygun (en az iki) farklı stratejiyi kullanabilirse ✓",
      easy: "Tek adımlı, 10'u aşmayan birleştirme problemleriyle başlayın; pullarla somut çözsün.",
      hard: "Bilinmeyenin başta/ortada olduğu problemler (\"? + 5 = 12\") ya da 20'yi aşan, iki onluklu kurgular.",
    },
    tool: "bar",
  },
  { // 10 — Çok Basamaklı +/− (Oluşturma) (102–120 ay)
    how: "Onluk-birlik bloklarıyla \"23'ü ayır\" dediğinizde çocuk 23'ü 2 onluk + 3 birlik diye kurar, sonra istenirse onluğu bozup (1 onluk + 13 birlik) yeniden düzenler; iki basamaklı bir bileşimi/ayrışımı (ör. 23 = 20+3 = 10+13) doğru yapar. Onlukları ve birlikleri ayrı birimler olarak esnekçe oluşturup bozar.",
    teacher: "Bu en üst oluşturma düzeyidir: çocuk çok basamaklı sayıları onluk ve birlik birimleriyle esnekçe kurar, ayrıştırır ve gerektiğinde bir onluğu on birliğe bozar (regrouping/elden). Bu beceri, yazılı çok basamaklı toplama-çıkarmanın (\"elde var bir\", \"ödünç alma\") kavramsal temelidir — kuralı ezberlemeden ÖNCE bloklarla yaşanması gerekir. DokunSay Basamak aracıyla \"bir onluğu on birliğe çevir\" hamlesini somutlaştırın; \"hangi basamağı bozduk, neden?\" diye sürekli sordurun.",
    act: {
      materials: ["DokunSay Basamak blokları (yüzlük levha + onluk çubuk + birlik küp)", "2 basamaklı sayı kartları", "onluk bozma için boş tepsi"],
      steps: [
        "23'ü bloklarla kurun: \"Kaç onluk, kaç birlik?\" (2 onluk, 3 birlik).",
        "\"Birliklerden 5 vermem lazım ama yetmiyor — bir onluğu bozalım\" deyip bir çubuğu 10 birliğe çevirin (1 onluk + 13 birlik).",
        "Yeni yapının yine 23 ettiğini söyletin: \"Bozduk ama bütün değişmedi.\"",
        "İki sayıyı bloklarla birleştirip (23+18) onlukları/birlikleri ayrı toplatın; gerekince onluğa taşıtın.",
      ],
      criterion: "İki basamaklı bir sayıyı onluk-birlik birimleriyle doğru kurup ayrıştırır ve gerektiğinde onluğu bozarak (ör. 23 = 10+13) yeniden düzenlerse ✓",
      easy: "Onluk bozmadan, yalnız 23 = 20+3 gibi düz ayrışımlarla başlayın.",
      hard: "Yüzlük levha ekleyip üç basamağa geçin ya da onluk bozma gerektiren iki basamaklı çıkarma (32−15) kurun.",
    },
    viz: { t: "baseten", tens: 2, ones: 3 },
    tool: "basamak",
  },
]
