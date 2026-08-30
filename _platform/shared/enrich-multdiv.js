// Çarpma / Bölme (Multiplying/Dividing) — düzey zenginleştirmesi (Clements & Sarama)
// ────────────────────────────────────────────────────────────────────────
// trajectories.data.js içindeki "multdiv" yörüngesinin 9 düzeyiyle AYNI sırada 9 nesne.
// Her düzey: how (nasıl görünür) · teacher (öğretmen notu) · act (etkinlik) · viz/tool (ops.)
// Araç: DokunSay Bar — gruplama tepsileri ve pullar (eşit gruplar kur, dağıt, dizi diz).
// Pedagojik yörünge: niceliksel-olmayan paylaştırma → eşit gruplama/dağıtma →
// somut modelleme (★ darboğaz) → ritmik sayarak çarpma (★ darboğaz) → türetme →
// bölme türleri (paylaştırma vs gruplama) → dizi/problem → parça-bütün çarpımsal.
// İki darboğaz (somut modelleme, ritmik sayma) vurgulu; ritmik sayma darboğazında
// matematik öğrenme güçlüğü (diskalkuli) bağı kuruludur.
export default [
// HİZA DÜZELTMESİ (2026-07-20): kanonun 4. düzeyi (Kişi Artarsa Payın Azalacağını
// Bilen — ters ilişki) bu dosyada hiç yazılmamıştı; sonraki her blok bir düzey İLERİ
// kaymış, yapraklara yanlış düzeyin ölçütü/desteği basılıyordu (içerik denetiminde
// 4 yaprakta doğrulandı). Eksik düzey yazıldı, sıra kanona hizalandı; kanonda
// karşılığı olmayan eski "Parçalar ve Bütünler" bloğu düştü (özü Türeten'de yaşıyor).
  { // 0 — Niceliksel Olmayan Paylaştırıcı: Temeller (0–36 ay)
    how: "Çocuk bir avuç şekeri arkadaşlarına \"sana, sana, bana\" diyerek dağıtır; tam eşit olmasa da herkese bir şeyler düşsün ister. Henüz \"kaç tane\" diye saymaz, ama paylaşımın \"adil\" olması gerektiğini sezer.",
    teacher: "Bu, bölmenin sözel-öncesi çekirdeğidir: çocuk miktarı saymadan, sezgisel bir \"eşitlik/adalet\" duygusuyla paylaştırır. Henüz nicelik yoktur; amaç \"herkese eşit\" fikrini canlı tutmaktır. Çocuk birine çok birine az verirse cezalandırmayın — \"acaba herkese aynı mı oldu?\" diye merak uyandırın. Tüm sonraki bölme ve eşit gruplama bu adalet sezgisine yaslanır.",
    act: {
      materials: ["DokunSay pulları (ya da bisküvi/şeker)", "2–3 oyuncak/kukla \"misafir\"", "gruplama tepsileri (her misafire bir tepsi)"],
      steps: [
        "Birkaç misafiri (oyuncak) karşılıklı dizip her birinin önüne bir tepsi koyun.",
        "Çocuğa bir avuç pul verip \"Hadi herkese ikram et\" deyin.",
        "Dağıtırken \"sana bir, sana bir\" ritmini birlikte söyleyin.",
        "Bittiğinde \"Herkese bir şeyler düştü mü? Acaba aynı mı oldu?\" diye baktırın.",
      ],
      criterion: "Bir çokluğu, herkese pay düşecek biçimde (eşitliği sezerek) kendiliğinden paylaştırırsa ✓",
      easy: "İki misafirle ve az pulla başlayın; ilk birkaç dağıtımı birlikte yapın.",
      hard: "Üç misafire çıkın; \"herkese tıpatıp aynı olsun\" diye eşitliği zorlayın.",
    },
  },
  { // 1 — Başlangıç Gruplayıcı ve Dağıtıcı Paylaştırıcı (48–66 ay)
    how: "\"Bu 6 şekeri iki tabağa dağıt\" dediğinizde çocuk teker teker, sırayla koyar: bir buraya, bir oraya, bir buraya… Tabaklara dönüşümlü dağıtarak (\"deal\" gibi) paylaştırır, ama henüz \"her tabağa kaçar olsun\" diye önceden planlamaz.",
    teacher: "Birer birer dağıtma (dealing) bölmenin ilk somut stratejisidir: çocuk toplamı bilmeden, her seferinde bir nesneyi bir gruba vererek eşit paylaşımı GARANTİLER. Sık yanılgı: bir tabağa üst üste koyup ötekini unutmak — \"sırayla, herkese birer\" ritmini hatırlatın. Bu dönüşümlü dağıtım, ileride \"paylaştırma bölmesi\"nin (her gruba kaç düşer) doğrudan temelidir.",
    act: {
      materials: ["DokunSay pulları (6–8 pul)", "2 gruplama tepsisi", "dağıtımı başlatmak için bir \"başla\" işareti"],
      steps: [
        "İki tepsiyi yan yana koyun, pulları ortaya yığın.",
        "\"Bu pulları iki tepsiye dağıt — sırayla, birer birer\" deyin.",
        "Çocuk bir tepsiye, sonra ötekine koyarken \"bir sana, bir sana\" diye eşlik edin.",
        "Bitince \"İkisinde de pul kaldı mı? Bakalım kaçar oldu?\" diye birlikte sayın.",
      ],
      criterion: "Bir çokluğu, tepsilere dönüşümlü (birer birer) dağıtarak paylaştırırsa ✓",
      easy: "4 pul ve 2 tepsi ile başlayın; ilk turu birlikte dağıtın.",
      hard: "3 tepsiye çıkın ya da \"tek pul artarsa ne yaparız?\" diye kalanı düşündürün.",
    },
    viz: { t: "dots", group: [3, 3] },
  },
  { // 2 — Gruplayıcı ve Dağıtıcı Paylaştırıcı (60–72 ay)
    how: "\"8 şekeri iki tepsiye eşit dağıt\" dediğinizde çocuk artık \"her tepsiye dört\" diye eşit gruplar oluşturur; dağıtırken ya da sonunda sayıp ikisinin de eşit olduğunu denetler. Eşitliği yalnız sezmez, kontrol eder.",
    teacher: "Burada paylaştırma niceliksel olur: çocuk eşitliği \"hissetmekten\" sayıp DOĞRULAMAYA geçer — \"dört ve dört, eşit\". Bu, bölme sonucunu (her grupta kaç) bilinçli üretmenin başlangıcıdır. Bir tepside fazla olursa \"birini öbürüne aktaralım, eşitleyelim\" diyerek dengelemeyi modelleyin. Eşit grup kavramı, çarpmanın da (\"kaç grup, her grupta eşit kaç\") ön koşuludur.",
    act: {
      materials: ["DokunSay pulları (8–10 pul)", "2 gruplama tepsisi", "eşitliği denetlemek için karşılıklı dizme alanı"],
      steps: [
        "8 pulu ortaya koyup \"iki tepsiye eşit paylaştır\" deyin.",
        "Çocuk dağıtsın; sonra \"İkisinde de aynı mı? Sayalım\" deyin.",
        "Eşit değilse \"hangisinde fazla? Bir tane aktarıp eşitle\" diye yönlendirin.",
        "\"Her tepside kaç var?\" diye bölüm sonucunu (4) söyletin.",
      ],
      criterion: "Bir çokluğu eşit gruplara bölüp, grupların eşitliğini sayarak doğrularsa ✓",
      easy: "Çift sayılarla (6, 8) ve 2 tepsiyle çalışın; karşılıklı dizip eşitliği göz önüne serin.",
      hard: "Tek artıklı sayı (9) ya da 3 eşit tepsi; \"artan olursa eşit olur mu?\" diye sorgulayın.",
    },
    viz: { t: "dots", group: [4, 4] },
  },
  { // 3 — Somut Modelleyici ×/÷ (72–84 ay) ★ DARBOĞAZ
    how: "\"3 tabakta 2'şer şeker var, toplam kaç?\" sorusunda çocuk önce 3 grubu pullarla TEK TEK kurar (her tepsiye 2 pul), sonra hepsini baştan \"bir-iki-üç-dört-beş-altı\" diye sayar. Grupları gerçekten dizmeden, yalnız zihinden işleme henüz geçemez.",
    teacher: "Bu, çarpma/bölmenin ilk gerçek darboğazıdır: çocuk \"kaç grup × her grupta kaç\" yapısını ancak SOMUT kurup hepsini sayarak çözer. Bu düzeyde takılma — eşit grupları diziyip toplamı bulamamak, ya da grupları kurmadan rastgele sayı söylemek — matematik öğrenme güçlüğü (diskalkuli) açısından erken bir uyarı işaretidir; çünkü \"tekrarlı eşit grup\" fikri henüz oturmamıştır. Acele ettirmeyin: önce her grubu ayrı tepsiye kurmayı, sonra \"hepsini birlikte saymayı\" bolca somutlaştırın. Bölmeyi de aynı modelle yapın — toplamı verip eşit gruplara dağıttırın.",
    act: {
      materials: ["DokunSay pulları", "3–4 gruplama tepsisi (eşit gruplar için)", "hepsini saymak için birleştirme alanı"],
      steps: [
        "3 tepsi koyup \"her tepsiye 2 pul\" dedirterek eşit grupları kurdurun.",
        "\"Şimdi hepsi kaç? Baştan sayalım\" deyip tüm pulları tek tek saydırın (…altı).",
        "Tersini yapın (bölme): 6 pulu verip \"her tepsiye 2'şer koy, kaç tepsi oldu?\" deyin.",
        "Grup sayısını/grup büyüklüğünü değiştirip (2 tepside 4'er) modeli yineleyin.",
      ],
      criterion: "Eşit grupları somut kurup hepsini sayarak çarpımı bulur ve aynı modelle bölmeyi çözerse ✓",
      easy: "Küçük tutun (2 tepside 2'şer); grupları siz başlatın, çocuk tamamlasın.",
      hard: "4 tepside 3'er gibi büyütün ya da grupları kapatıp \"saymadan tahmin et\" deyin (ritmik saymaya köprü).",
      tool: "bar",
    },
    viz: { t: "array", r: 3, c: 2 },
  },
  { // 4 — Kişi Artarsa Payın Azalacağını Bilen (84–96 ay)
    how: "12 şekeri 2 kişiye, sonra aynı 12'yi 4 kişiye paylaştırınca çocuk \"kişi çoğaldı, herkese daha az düştü\" der. Bütün sabitken bölen büyüyünce payın küçüleceğini — saymadan önce — öngörmeye başlar.",
    teacher: "Bu düzeyin özü ters-orantı SEZGİSİdir: bölünen sabitken bölen (kişi sayısı) artarsa bölüm (pay) azalır. Çocuk bunu iki paylaştırmayı YAN YANA görerek kavrar; tek paylaştırma yetmez. \"Kişi arttı — pay ne oldu, neden?\" sorusunu her denemede yineleyin. Sık yanılgı: 'daha çok kişi → daha çok şeker' (toplama sezgisinin taşması); iki tepsi grubunu karşılaştırtarak çürütün. Bu sezgi, ileride bölme, kesir (paydanın anlamı) ve oran akıl yürütmesinin temelidir.",
    act: {
      materials: ["DokunSay pulları (12 pul)", "2 + 4 gruplama tepsisi (iki ayrı paylaştırma)", "iki paylaştırmayı yan yana koyacak karşılaştırma alanı"],
      steps: [
        "12 pulu 2 tepsiye paylaştırtın: \"Herkese kaç düştü?\" (6).",
        "Aynı 12 pulu bu kez 4 tepsiye paylaştırtın: \"Şimdi kaç düştü?\" (3).",
        "İki sonucu yan yana koydurup \"Kişi arttı, pay ne oldu?\" diye söyletin.",
        "Paylaştırmadan ÖNCE sordurun: \"6 kişiye dağıtsak daha mı çok, daha mı az düşer?\"",
      ],
      criterion: "Bütün sabitken kişi (grup) sayısı artınca payın azalacağını önceden söyler ve paylaştırarak doğrularsa ✓",
      easy: "2 kişi ↔ 4 kişi gibi ikiye katlanan karşıtlıklarla çalışın; iki paylaştırmayı yan yana görünür tutun.",
      hard: "Üç durumu sıralatın (2-3-6 kişi) ya da \"pay 2 olsun istersek kaç kişi olmalı?\" diye tersinden sordurun.",
      tool: "bar",
    },
    viz: { t: "dots", group: [6, 6] },
  },
  { // 5 — Ritmik Sayarak ×/÷ (90–102 ay) ★ DARBOĞAZ
    how: "\"4'er 4'er sayarak 3 grupta kaç şeker var?\" sorusunda çocuk her tek pulu saymak yerine grupları atlayarak sayar: \"dört… sekiz… on iki\" — ve üçüncü adımda durur. Her \"sıçrama\" bir grubu, kaç sıçrama yaptığı ise grup sayısını temsil eder.",
    teacher: "Ritmik (atlamalı) sayarak çarpma ikinci büyük darboğazdır ve çarpmaya geçişin tam kalbidir: çocuk \"hepsini tek tek saymayı\" bırakıp grup büyüklüğüyle atlayarak sayar (4, 8, 12) ve aynı anda KAÇ grup saydığını izler — bu bir çift-sayma işidir. Bu sıçramayı yapamamak, hâlâ her grubu tek tek saymaya geri dönmek, matematik öğrenme güçlüğü (diskalkuli) için belirgin bir işarettir; çünkü ritmik sayı dizisi ile grup sayısını eşzamanlı tutmak çalışan belleğe yüklenir. Parmakları \"kaç grup\" sayacı yapın: her sıçramada bir parmak. Bölmeyi de ritmik sayıyla kurun — \"on ikiye kaç dörtte ulaşırız?\" (12'ye 4,8,12 → üç adım).",
    act: {
      materials: ["DokunSay pulları (eşit gruplara dizili)", "3–4 gruplama tepsisi", "kaç grup saydığını izlemek için parmaklar"],
      steps: [
        "Her tepsiye 4 pul koyup grupları görünür dizin.",
        "Tepsilere dokunarak atlayarak saydırın: \"dört (bir grup), sekiz (iki), on iki (üç)\" — her grupta bir parmak açtırın.",
        "\"Kaç grup saydık, sonuç kaç?\" diye çift-sayıyı söyletin (3 grup, 12).",
        "Bölmeye çevirin: \"12 pulu 4'erli grupla — kaç grup olur?\" (4, 8, 12 → 3 grup) diye ritmik saydırın.",
      ],
      criterion: "Grup büyüklüğüyle atlayarak (4,8,12) sayıp grup sayısını izleyerek çarpımı/bölümü bulursa ✓",
      easy: "Tanıdık ritimlerle (2'şer, 5'er, 10'ar) ve az grupla başlayın; sıçramaları birlikte söyleyin.",
      hard: "Daha az tanıdık adımlar (3'er, 4'er) ya da \"kalanlı\" bölme (13'ü 4'erle: 3 grup, 1 artar).",
      tool: "bar",
    },
    viz: { t: "dots", group: [4, 4, 4] },
  },
  { // 6 — Türeten ×/÷ (102–114 ay)
    how: "\"5×4'ü biliyorsan 6×4 kaç?\" sorusunda çocuk baştan saymaz: \"5×4 yirmi, bir grup 4 daha, yirmi dört\" der. Bilinen bir çarpımdan, bir grup ekleyip/çıkararak komşusunu türetir.",
    teacher: "Bu, ezber ve sayımdan AKIL YÜRÜTMEYE geçiştir: çocuk çarpımları birbirinden türetir (n×4 biliniyorsa (n+1)×4 = n×4 + 4). Bu strateji çarpım tablosunu \"ezberlenecek 100 olgu\" olmaktan çıkarıp ilişkili bir ağ yapar. Çocuğa demir-atma çarpımlarını (×2, ×5, ×10) sağlamlaştırın ki komşularını türetebilsin; \"bir grup daha eklersek ne kadar artar?\" sorusunu yerleştirin. Dizi modeli türetmeyi görünür kılar: 5×4 dizisine bir satır eklemek 6×4'tür.",
    act: {
      materials: ["DokunSay pulları (dizi/ızgara düzeninde)", "gruplama tepsileri", "bilinen çarpım kartları (×2, ×5, ×10)"],
      steps: [
        "Bilinen bir çarpımı kurun: 5 tepside 4'er = 20 (ya da 5×4 dizisi).",
        "\"Bir grup daha eklesek? Kaç artar?\" deyip bir tepsi/satır ekletin (+4).",
        "Çocuk \"yirmi ve dört, yirmi dört\" diye 6×4'ü türetsin (baştan saymadan).",
        "Bölmeye uzatın: \"24'te 4'erden kaç grup? 20'de 5 vardı, bir grup daha — 6.\"",
      ],
      criterion: "Bilinen bir çarpımdan grup ekleyip/çıkararak komşu çarpımı (ve ilgili bölümü) türetirse ✓",
      easy: "×2, ×5, ×10 demir-atma çarpımlarından tek grup ekleyerek türetin.",
      hard: "İki adım (5×4'ten 7×4) ya da grup çıkararak türetme (6×4'ten 5×4).",
    },
    viz: { t: "array", r: 6, c: 4 },
  },
  { // 7 — Dizi Niceleyici / Problem Çözen ×/÷ (108–120 ay)
    how: "Şekerleri 3 sıra × 4 sütun dikdörtgen düzende görünce çocuk tek tek saymaz: \"üç sıra, her sırada dört — on iki\" der. Diziyi satır × sütun çarpımsal birimiyle okur ve \"5 kutuda 6'şar kalem\" gibi sözlü problemleri bu yapıyla kurar.",
    teacher: "Dizi (array) modeli çarpmanın olgunlaşmış temsilidir: tekrarlı toplamadan \"satır × sütun\"a geçer ve değişme özelliğini (3×4 = 4×3, diziyi döndür) görünür kılar. Çocuk artık çarpımsal problemleri (eşit grup, dizi, alan) tanıyıp doğru işlemle eşleştirmelidir. Diziyi döndürerek \"yine on iki\" dedirtin; sözlü problemde \"kaç grup, her grupta kaç\" yapısını çıkarttırın. Bu, alan, çarpan çiftleri ve ileride çarpanlara ayırmanın zeminidir.",
    act: {
      materials: ["DokunSay pulları (ızgaraya/diziye dizili)", "gruplama tepsileri", "kısa sözlü problem kartları (eşit grup & dizi)"],
      steps: [
        "Pulları 3×4 dizi olarak dizdirin: \"Kaç? Nasıl saydın?\" → \"üç sıra, dörder, on iki.\"",
        "Diziyi döndürün (4×3): \"Şimdi kaç?\" → \"yine on iki\" (değişme özelliği).",
        "Sözlü problem verin: \"5 kutuda 6'şar kalem, toplam kaç?\" — diziyle/grupla kurdurun.",
        "Ters problem: \"24 kalemi 4 kutuya eşit koysak her kutuda kaç?\" diye böldürün.",
      ],
      criterion: "Diziyi satır × sütun çarpımsal okur, değişmeyi görür ve sözlü çarpma/bölme problemlerini doğru işlemle çözerse ✓",
      easy: "Küçük diziler (2×3, 3×3) ve açık gösterimle; problemi birlikte resmedin.",
      hard: "Büyük diziler (4×6), iki adımlı ya da kalanlı problemler; yalnız zihinden çözdürün.",
      tool: "bar",
    },
    viz: { t: "array", r: 3, c: 4 },
  },
  { // 8 — Bölüştürücü Bölen (102–114 ay)
    how: "12 şekeri verince çocuk iki farklı bölme sorusunu ayırt eder: \"3 kişiye paylaştır\" deyince her kişiye dağıtıp \"herkese dört\" (paylaştırma); \"3'erli grupla\" deyince üçerli demetler yapıp \"dört grup oldu\" (gruplama). Aynı 12 ve 3'ün iki ayrı soruya iki ayrı yoldan yanıt verdiğini görür.",
    teacher: "Bölmenin iki anlamını ayırmak bu düzeyin özüdür: PAYLAŞTIRMA (bölen = grup sayısı, sonuç = her grupta kaç) ile GRUPLAMA/ölçme (bölen = grup büyüklüğü, sonuç = kaç grup). Çocuklar çoğu zaman ikisini karıştırır; aynı 12÷3 işleminin iki hikâyesini somut tepsilerle yan yana kurdurun. \"Burada 3 ne demek — 3 kişi mi, 3'erli grup mu?\" diye anlamı sorgulayın. Bu ayrımı kurmak, kalanlı bölme ve ileride kesir/oran anlayışının zeminidir.",
    act: {
      materials: ["DokunSay pulları (12 pul)", "gruplama tepsileri", "iki bölme hikâyesini ayırmak için iki çalışma alanı"],
      steps: [
        "12 pulu verip \"3 KİŞİYE paylaştır\" deyin — 3 tepsiye dağıtıp \"herkese dört\" desin (paylaştırma).",
        "Aynı 12 pulu verip \"3'ERLİ grupla\" deyin — üçerli demetler yapıp \"dört grup\" desin (gruplama).",
        "İki sonucu (4 ve 4) yan yana koyup \"3 burada ne anlama geldi?\" diye farkı söyletin.",
        "Sayıyı değiştirip (15÷3, 15÷5) iki türü de yineletin.",
      ],
      criterion: "Paylaştırma (her grupta kaç) ve gruplama (kaç grup) bölmelerini ayırt edip ikisini de doğru çözerse ✓",
      easy: "Önce yalnız paylaştırmayı sağlamlaştırın; sonra gruplamayı ayrı bir hikâyeyle ekleyin.",
      hard: "Kalanlı durumlar (13÷3) ya da \"hangi soru paylaştırma, hangisi gruplama?\" diye sözlü problemlerle ayırttırın.",
    },
    viz: { t: "dots", group: [4, 4, 4] },
  },

]
