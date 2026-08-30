// ════════════════════════════════════════════════════════════════════════
// 3B Şekil Oluşturma (Composing 3D Shapes) — düzey zenginleştirmesi
// Clements & Sarama [LT]² (learningtrajectories.org) çerçevesine sadık.
// ────────────────────────────────────────────────────────────────────────
// trajectories.data.js içindeki "comp3d" yörüngesinin 9 düzeyini öğretmen/veli
// için derinleştirir. Altın-standart şablon: yorunge.enrich.js (sub).
//
// PEDAGOJİK YAY (uzamsal-yapısal akıl yürütme):
//   blokları ayrı kullanma → istifleme ("üstüne") → sıra yapma ("yanına") →
//   aynı şekli istifleme → 3B parça birleştirme → çoklu ilişkiyle yapı →
//   ÖNGÖRÜYLE hedef 3B şekli oluşturma (DARBOĞAZ) → yerine koyma/tekrarlama →
//   birim-üstü birimler.
// "Üstüne / yanına / içine" uzamsal ilişkilerini bilinçle adlandırın.
//
// Her düzey: how (nasıl görünür) · teacher (öğretmen notu) ·
//   act { materials[2–4], steps[3–5], criterion (✓), easy, hard } · tool (ops.)
// Geometri yörüngesi olduğundan viz KOYULMAZ → sayfa amblemi 🏗️ kullanır.
// Araç: DokunSay Geo + küp bloklar; tool varsayılan dışı olduğundan "geo" yazılır.
export default [
  { // 0 — Ayrı Bloklar Eyleyeni: Temeller (0–24 ay)
    how: "Çocuk küp blokları eline alır, vurur, ağzına götürür, bir yerden başka yere taşır — ama onları birbirine bağlamaz. İki blok yan yana gelse bile her biri ayrı bir nesnedir; \"birlikte bir şey\" kurma niyeti henüz yoktur.",
    teacher: "Bu, 3B oluşturmanın en erken zeminidir: çocuk blokların tek tek varlığını, ağırlığını ve dokusunu keşfeder. Henüz parçaları bir bütüne dönüştürmez; amaç istiflemek değil, blokları tanıdık birer \"nesne\" kılmaktır. Bol serbest keşif (tutma, bırakma, çarpma) sonraki tüm yapı kurma becerisinin duyusal tohumudur. Acele istifletmeyin; önce bloklarla rahat bir ilişki kursun.",
    act: {
      materials: ["birkaç büyük, hafif küp blok (kavraması kolay)", "geniş, yumuşak bir zemin/halı"],
      steps: [
        "Çocuğun önüne 3–4 küp blok serpin, birlikte oturun.",
        "Bir bloğu alıp ona uzatın: \"Al bakalım, bu bir küp.\" — dokunsun, çevirsin.",
        "Bloğu bir yerden başka yere taşımasını, bırakmasını gözleyin.",
        "İki bloğu hafifçe \"tak\" diye birbirine vurun; sesi ve tepkisini paylaşın.",
      ],
      criterion: "Blokları tek tek tutar, taşır, inceler (henüz birleştirmeden) ✓",
      easy: "Tek bir blok verip ona odaklatın; büyük ve renkli olsun.",
      hard: "İki bloğu üst üste koyup gösterin: \"Bak, üstüne!\" — taklit etmeye çalışır mı diye bekleyin.",
    },
    tool: "geo",
  },
  { // 1 — İstifleyici (0–24 ay)
    how: "Çocuk bir bloğu bir diğerinin ÜSTÜNE koyar — iki, üç katlı küçük bir kule yapar. Çoğu zaman kule yıkılır, gülerek yeniden başlar. \"Üstüne\" ilişkisini ilk kez bir eyleme döker: dikey yönde yapı kurar.",
    teacher: "İstifleme, 3B oluşturmadaki ilk gerçek uzamsal ilişkidir: \"üstüne\" (dikey birleştirme). Çocuk artık blokları yalnız taşımıyor, bir bütün kurma niyetiyle üst üste diziyor. Yıkmak da öğrenmenin parçasıdır — denge, ağırlık ve dengesizlik deneyimi verir. \"Üstüne koy, bir daha üstüne\" diyerek ilişkiyi adlandırın; kaç kat olduğunu birlikte sayarak dikey yapıyı dile döktürün.",
    act: {
      materials: ["4–6 eş küp blok (üst üste konabilen)", "düz, sağlam bir zemin (masa/tepsi)"],
      steps: [
        "Bir bloğu koyun, ikincisini üstüne yerleştirip \"üstüne!\" deyin.",
        "Çocuğa bir blok uzatın: \"Şimdi sen üstüne koy.\"",
        "Her yeni katta \"bir daha üstüne\" diyerek kuleyi yükseltin.",
        "Kule yıkılınca \"bom! yeniden yapalım\" deyip tekrar başlatın.",
      ],
      criterion: "En az iki bloğu üst üste koyarak (\"üstüne\" ilişkisiyle) bir kule istiflerse ✓",
      easy: "Geniş tabanlı, ağır bloklarla başlayın (kolay dengelenir); siz tutun, o bıraksın.",
      hard: "Daha küçük/yuvarlak bloklar verin ya da \"kaç kat oldu?\" diye saydırın.",
    },
    tool: "geo",
  },
  { // 2 — Sıra Yapıcı (12–24 ay)
    how: "Çocuk blokları bu kez üst üste değil, YAN YANA dizer: bir tren, bir yol, bir duvar gibi yatay bir sıra yapar. \"Üstüne\"nin yanına artık \"yanına\" ilişkisi eklenir; yapı dikeyden yatay düzleme genişler.",
    teacher: "Sıra yapmak, ikinci temel uzamsal ilişkiyi (\"yanına\" — yatay bitiştirme) getirir. Çocuk artık iki yönde düşünebiliyor: yukarı (istif) ve yana (sıra). Bu, ileride zemin/duvar gibi düzlemsel yapıların ön koşuludur. \"Yanına koy, bir tane daha yanına\" diyerek ilişkiyi adlandırın; \"tren\" ya da \"yol\" gibi anlamlı bir bağlam sırayı amaçlı kılar. İstif ile sırayı yan yana göstererek iki ilişkiyi ayırt ettirin.",
    act: {
      materials: ["6–8 eş küp blok (yan yana dizilebilen)", "uzun, düz bir zemin (masa kenarı/şerit)", "\"tren/yol\" için küçük bir oyuncak"],
      steps: [
        "İki bloğu yan yana koyun: \"Yanına koyduk — bak, bir tren oldu!\"",
        "Çocuğa blok uzatın: \"Treni uzat, yanına bir vagon daha ekle.\"",
        "Sırayı birlikte uzatın; her blokta \"yanına\" deyin.",
        "Bitmiş sırayı oyuncakla gezdirin: \"yol boyunca gidiyor!\"",
      ],
      criterion: "Blokları yan yana bitiştirerek (\"yanına\" ilişkisiyle) yatay bir sıra/dizi yaparsa ✓",
      easy: "Bir oluk/kenar boyunca dizdirin (çizgi hazır olsun); kısa sıra (3) yeter.",
      hard: "Hem sıra hem istif isteyin (\"önce yan yana yol, sonra üstüne köprü\").",
    },
    tool: "geo",
  },
  { // 3 — Aynı Şekil İstifleyici (24–30 ay)
    how: "Çocuk artık AYNI bloklardan düzenli bir kule kurar: eş küpleri seçip üst üste hizalı istifler, gelişigüzel değil. \"Hepsi aynı olsun\" diye benzer parçaları gruplar ve dengeli, daha yüksek bir yapı yapar.",
    teacher: "Bu düzeyde istifleme bilinçli ve seçicidir: çocuk eş birimleri (aynı küpleri) seçip düzenli bir bütün kurar. Aynı şekli üst üste koymak, hizalama ve denge duygusunu güçlendirir — kule daha yüksek ve sağlam olur. \"Aynısından bir tane daha\" diyerek benzerlik seçimini destekleyin; kuleyi sayarak (\"üç kat, dört kat\") yapının düzenini vurgulayın. Eş parçalarla çalışmak, ileride \"birim\" fikrinin ilk tohumudur.",
    act: {
      materials: ["8–10 özdeş küp blok (tek tip)", "karışıklık için birkaç farklı blok (seçim yaptırmak için)", "düz, sağlam zemin"],
      steps: [
        "Karışık blokları gösterin: \"Aynı olanlardan bir kule yapalım.\"",
        "Bir küp koyun: \"Buna benzeyen bir tane daha bul, üstüne koy.\"",
        "Çocuk eş blokları seçip hizalı istiflesin; her katta \"aynısı, üstüne\" deyin.",
        "Kuleyi birlikte sayın: \"kaç kat oldu?\" — yüksekliği kutlayın.",
      ],
      criterion: "Eş (aynı) bloklardan seçerek hizalı, düzenli bir kule istiflerse ✓",
      easy: "Yalnız tek tip blok verin (seçim yok); birlikte hizalayın.",
      hard: "Çok benzer ama farklı boyda bloklar koyup doğru olanı seçtirin; daha yüksek kule isteyin.",
    },
    tool: "geo",
  },
  { // 4 — Parça Birleştirici (3B) (24–36 ay)
    how: "Çocuk istif ve sırayı BİRLEŞTİRİR: birkaç bloğu bir araya getirip basit bir 3B yapı (bir zemin, bir duvar, bir oturak) kurar. \"Üstüne\" ve \"yanına\" ilişkilerini aynı yapıda kullanır; parçalar artık birbirini tamamlayan bir bütün oluşturur.",
    teacher: "Burada gerçek 3B parça birleştirme başlar: çocuk iki ilişkiyi (dikey + yatay) tek bir yapıda eşgüdümler. Bir \"zemin\" (yan yana sıra) üstüne bir \"duvar\" (istif) gelir. Bu, yapının parçalardan kurulduğunu ilk kez deneyimlemesidir. \"Önce tabanı yap, sonra üstüne koy\" diyerek sırayı yönlendirin; çocuğun \"bu ne oldu?\" sorusuna ad vermesini (\"masa\", \"duvar\") teşvik edin. Henüz öngörü değil, eyleyerek keşif çağıdır.",
    act: {
      materials: ["10–12 küp blok (farklı boyları da olabilir)", "düz bir oyun zemini", "ilham için basit bir nesne (kutu, küçük kap)"],
      steps: [
        "\"Hadi bir şey yapalım — önce yere bir taban koyalım\" deyip yan yana birkaç blok dizin.",
        "\"Şimdi üstüne bir duvar koyalım\" deyip tabanın üstüne istifleyin.",
        "Çocuk parçaları birleştirip kendi yapısını kursun (zemin + üstü).",
        "\"Bu ne oldu?\" diye sorup yapısını adlandırmasını isteyin.",
      ],
      criterion: "Birkaç bloğu birleştirerek (taban + üstü gibi) basit bir 3B yapı kurarsa ✓",
      easy: "Yalnız iki parça birleştirin (bir sıra + bir blok üstüne); siz başlatın.",
      hard: "Üç bölümlü bir yapı (zemin + iki duvar) ya da \"içine bir şey koyabilir misin?\" deyin.",
    },
    tool: "geo",
  },
  { // 5 — Resim Yapıcı (3B) (36–48 ay)
    how: "Çocuk birden çok uzamsal ilişkiyi (üstüne, yanına, içine, arasına) bir arada kullanarak ÇOKLU İLİŞKİLİ bir yapı kurar: köşeli bir ev, bir kemer/köprü, içi boş bir kapalı alan (garaj, kale). Yapı artık \"bir şeyi temsil eder\" — bir resim/model gibi.",
    teacher: "Bu düzeyde oluşturma çoklu ilişkiyle zenginleşir: çocuk yalnız üst üste/yan yana değil, \"köşe yapma\", \"üstünü kapatma\" (kemer), \"içini boşaltma\" (kapalı alan) gibi ilişkileri birleştirir. Kemer kurmak özellikle önemlidir: iki dik desteğin üstüne yatay bir blok koymak, denge ve boşluk-doldurma sezgisi gerektirir. \"İçine / üstüne / arasına\" ilişkilerini bol bol adlandırın. Henüz tam öngörü yoktur; yapı çoğu kez kurarken \"ortaya çıkar\" — bu yaratıcılığı kutlayın.",
    act: {
      materials: ["12–16 küp blok (uzun/köprü bloğu da olsun)", "geniş oyun zemini", "küçük bir oyuncak (içine konacak: araba/figür)"],
      steps: [
        "\"Bir garaj yapalım — arabamız içine girsin\" deyip kapalı bir alan kurdurun.",
        "İki dik destek koyup üstüne uzun bir blok koyun: \"Bak, bir kemer/köprü!\"",
        "Çocuk köşe ve duvarları birleştirip içi boş bir yapı (ev/kale) kursun.",
        "Oyuncağı \"içine\" koydurup \"üstünden\", \"yanından\" geçirerek ilişkileri adlandırın.",
      ],
      criterion: "Birden çok uzamsal ilişki (köşe, kemer, kapalı alan) kullanarak anlamlı bir yapı/resim oluşturursa ✓",
      easy: "Tek bir ilişkiye odaklanın (yalnız kapalı bir kutu/garaj); köprü desteğini siz tutun.",
      hard: "Kemer + kapalı alanı birleştirtin (\"köprülü bir kale\") ya da iki katlı yapı isteyin.",
    },
    tool: "geo",
  },
  { // 6 — Şekil Oluşturucu (3B) (48–60 ay) ★ DARBOĞAZ
    how: "Çocuğa bir model (resim ya da hazır bir yapı) gösterip \"Aynısını yap\" dediğinizde, kurmaya başlamadan ÖNCE zihninde tasarlar: \"Önce iki kule, üstüne bir köprü.\" Yapıyı öngörüyle, hedefe yönelik kurar — deneme-yanılmayla rastlamaz, plana göre ilerler.",
    teacher: "Bu yörüngenin gerçek darboğazıdır. Önceki düzeylerde yapı \"kurarken ortaya çıkardı\"; burada çocuk hedef 3B şekli ZİHNİNDE ÖNGÖRÜP ona göre parça seçer ve birleştirir. Bu öngörülü oluşturma — bir model imgesini tutup onu adım adım gerçek bloklara çevirmek — güçlü uzamsal-yapısal akıl yürütme gerektirir ve birçok çocukta gözle görülür bir eşiktir. Çocuk yalnız deneme-yanılmayla, modele bakmadan rastgele kuruyorsa, ona \"önce nereye ne koyacaksın?\" diye PLAN sordurun; modeli parçalara böldürüp (\"kaç kule var? üstünde ne var?\") öngörüyü dile döktürün. DokunSay Geo'da hedef yapıyı gösterip kopyalatmak bu öngörüyü doğrudan çalıştırır.",
    act: {
      materials: ["12–18 küp blok (model ile aynı parçalar)", "kopyalanacak bir model (hazır yapı ya da DokunSay Geo'da hedef görsel)", "modeli gizlemek için bir örtü/kart"],
      steps: [
        "Bir hedef yapı gösterin (ör. iki kule + üstünde köprü): \"Aynısını yapacağız.\"",
        "Kurmadan önce sordurun: \"Önce neyi yapacaksın? Sonra nereye ne koyacaksın?\"",
        "Çocuk planına göre parçaları seçip yapıyı öngörüyle kursun.",
        "Bitince modelle yan yana koyup \"aynı mı? nesi farklı?\" diye karşılaştırın.",
        "İsterseniz modeli örtüp \"hatırından yap\" diyerek öngörüyü güçlendirin.",
      ],
      criterion: "Bir model verildiğinde, deneme-yanılmadan çok öngörüyle (plana göre) hedef 3B şekli oluşturursa ✓",
      easy: "Basit, az parçalı model (tek kule + üstünde bir blok); model hep görünür kalsın.",
      hard: "Çok parçalı/asimetrik model, modeli kısa gösterip örtün ya da \"yandan da aynı görünsün\" deyin.",
    },
    tool: "geo",
  },
  { // 7 — Yerine Koyarak Oluşturucu ve Tekrarlayıcı (3B) (60–72 ay)
    how: "Çocuk bir blok grubunu, ona eşdeğer tek bir bütünle DEĞİŞTİREBİLİR: \"İki küçük blok yerine bir uzun blok koyabilirim.\" Ayrıca bir yapı birimini (bir sütun, bir kemer) defalarca TEKRARLAYARAK daha büyük bir bütün kurar (sıra sütun, art arda kemerler).",
    teacher: "Bu düzeyde iki güçlü fikir belirir: yerine koyma (substitution — bir parçalar kümesi, eşdeğer başka bir bütünle değiştirilebilir) ve tekrarlama (bir birimi çoğaltarak yapı kurma). Çocuk \"iki birim = bir büyük birim\" denkliğini görür ve aynı yapı parçasını kalıp gibi yineler. Bu, ölçme, eşdeğerlik ve örüntülü yapıların 3B zeminidir. \"Bunun yerine ne koyabilirsin, aynı yeri doldurur?\" ve \"aynı kemerden bir tane daha yap\" diyerek iki beceriyi de besleyin. Yerine konan parçanın aynı boşluğu doldurduğunu (denklik) birlikte doğrulayın.",
    act: {
      materials: ["karışık küp bloklar (kısa + uzun; iki kısa = bir uzun olacak şekilde)", "tekrarlanacak bir birim için yeterli eş blok", "düz oyun zemini"],
      steps: [
        "İki kısa bloğu yan yana koyun: \"Bunların yerine tek parça ne koyabiliriz?\" — eşdeğer uzun bloğu buldurun.",
        "Değiştirip \"aynı yeri doldurdu mu?\" diye denkliği doğrulayın.",
        "Bir birim yapın (ör. bir kemer/sütun): \"Aynısından bir tane daha, yanına.\"",
        "Birimi tekrarlatarak büyük bir yapı kurdurun (kemerli geçit, sütun dizisi).",
        "\"Kaç kemer/sütun oldu?\" diye tekrarları saydırın.",
      ],
      criterion: "Bir blok grubunu eşdeğer bir bütünle değiştirir VE bir yapı birimini tekrarlayarak büyük bir yapı kurarsa ✓",
      easy: "Yalnız yerine koymayı çalıştırın (iki kısa ↔ bir uzun); ya da tek bir birimi iki kez tekrarlatın.",
      hard: "Çok parçalı yerine koyma (üç blok ↔ bir bütün) ve birimi 4+ kez düzenli tekrarlatın.",
    },
    tool: "geo",
  },
  { // 8 — Şekil Oluşturucu—Birimlerin Birimleri (3B) (72–84 ay)
    how: "Çocuk önce küçük birimleri (bir blok grubuyla bir \"oda\", bir \"kat\") kurar, sonra bu birimleri BİRİM olarak kullanıp daha büyük bir bütün (çok katlı bir bina, kanatlı bir kale) oluşturur. \"Bir kat\" artık tek bir parça gibi düşünülür; katları üst üste koyarak yapıyı ölçekler.",
    teacher: "Bu, 3B oluşturmanın doruğudur: birimlerin birimleri (units of units). Çocuk küçük bir yapıyı (örneğin bir kat) zihinde tek bir birim olarak kavrar ve onu daha büyük bir yapının parçası yapar — yapı hiyerarşik hâle gelir. Bu çarpımsal/hiyerarşik yapı düşüncesi, ileride alan-hacim, çok basamaklı sayılar ve ölçme birimlerinin (birimin birimi) güçlü zeminidir. \"Bir kat kaç bloktan? Üç kat yaparsan toplam yapı nasıl?\" diye birim-üstü-birim ilişkisini sesli kurdurun; bir katı kalıp alıp tekrarlatarak hiyerarşiyi görünür kılın.",
    act: {
      materials: ["çok sayıda küp blok (en az 24)", "kat/birim şablonu için bir taban (kartonet/tepsi)", "karmaşık bir hedef yapı görseli (çok katlı bina/kale)"],
      steps: [
        "Önce küçük bir birim kurdurun: \"Bir kat yapalım — taban + duvarlar.\"",
        "\"Bu bir kat. Şimdi bunun aynısından bir kat daha, üstüne\" diyerek birimi tekrarlatın.",
        "Katları üst üste koyup çok katlı bütünü oluşturun (birim-üstü birim).",
        "\"Bir kat kaç bloktu? Üç kat toplam kaç eder?\" diye hiyerarşiyi düşündürün.",
        "Yan kanat/avlu ekleyip yapıyı birden çok birimden (kat + kanat) kurdurun.",
      ],
      criterion: "Küçük birimleri (kat/oda) tek tek kurup bunları birim olarak kullanarak çok katlı/karmaşık bir bütün oluşturursa ✓",
      easy: "İki özdeş katla başlayın; her katı birlikte kurup üst üste koyun.",
      hard: "Farklı birimleri birleştirin (kat + köprü + kanat) ya da \"toplam kaç blok?\" diye katmanları çarpımsal saydırın.",
    },
    tool: "geo",
  },
]
