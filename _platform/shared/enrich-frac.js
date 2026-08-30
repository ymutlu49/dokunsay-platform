// Kesirler (Fractions) — düzey zenginleştirmesi (Clements & Sarama)
// trajectories.data.js CORE içindeki "frac" yörüngesinin 11 düzeyini
// öğretmen/veli için derinleştirir. Altın-standart şablon: yorunge.enrich.js (sub).
// Her düzey: how (nasıl görünür) · teacher (öğretmen notu) · act (etkinlik) ·
// tool (DokunSay aracı; kesir = bar modeli + pasta grafik + sayı doğrusu).
// Kesir için sayısal viz primitifi YOKTUR → düzeylerde viz yer almaz; detay
// sayfası amblemi (🍕) gösterir. Pedagoji ekseni: erken orantısal düşünme →
// eş-parçalama (darboğaz) → yarım → birim kesir (darboğaz) → kesir tanıma/
// oluşturma/tekrarlama → kesir aritmetiği → kesir-tam sayı sıralama.
export default [
  { // 0 — Erken Orantısal Düşünür: Temeller (0–48 ay)
    how: "Çocuk bir kurabiyeyi arkadaşıyla bölüşürken \"sana bir, bana bir\" diye eşit dağıtmaya çabalar; biri daha büyük pay alınca \"haksızlık!\" diye itiraz eder. Henüz \"yarım\" demese de \"aynı kadar olsun\" sezgisi vardır.",
    teacher: "Bu, kesirlerden çok önce gelen orantısal/adil-pay sezgisidir: çocuk miktarları eşitleme ve \"aynı kadar\" ilişkisini gündelik paylaşımda yaşar. Henüz hiçbir kesir sözcüğü ya da eşit-parçalama tekniği beklemeyin; amaç, paylaşma anlarını fark edip \"herkese eşit\" düşüncesini sözle beslemektir. Bu sezgi, ileride eş-parçalamanın anlamlı zeminidir — \"adil\" duygusu \"eşit parça\"ya köprü olur.",
    act: {
      materials: ["paylaşılacak özdeş nesneler (kurabiye, kraker, üzüm)", "iki oyuncak/kukla (\"misafir\")", "iki küçük tabak"],
      steps: [
        "İki tabağı koyun: \"Bu kurabiyeleri iki arkadaşa paylaştıralım.\"",
        "Çocuk birer birer dağıtsın; \"herkese aynı kadar mı?\" diye sordurun.",
        "Bilerek birine fazla verin: \"böyle olur mu, adil mi?\" diye tepkisini gözleyin.",
        "Eşitleyince \"şimdi herkese EŞİT\" diyerek sezgiyi adlandırın.",
      ],
      criterion: "Paylaşırken \"eşit/adil\" olmaya çalışır ya da eşitsizliği fark edip itiraz ederse ✓",
      easy: "İki kişiye, az sayıda (2–4) özdeş nesne dağıttırın; siz model olun.",
      hard: "Üç kişiye dağıttırın ya da \"birer fazla kaldı, ne yapalım?\" diye düşündürün.",
    },
    tool: "kesir",
  },
  { // 1 — Şekil Eş-Parçalayıcı (48–72 ay) ★ DARBOĞAZ
    how: "Çocuk kâğıt bir pizzayı \"iki kişiye böl\" deyince ortadan bir çizgi çeker; oturmuşsa iki parça denk (üst üste konunca çakışır) çıkar. Henüz oturmamışsa \"ikiye böldüm\" der ama parçalar gözle görülür biçimde eşitsizdir (biri büyük, biri küçük) — ona göre \"böldüm\" yeterlidir, eşitlik umurunda değildir.",
    teacher: "Eş-parçalama (equipartitioning) kesirlerin ilk ve en kritik darboğazıdır: çocuk şekli yalnız PARÇALARA değil, EŞİT (denk) parçalara bölmeyi öğrenmelidir. Yaygın yanılgı tam buradadır — \"kesir, parçalara bölmektir\" sanmak; oysa kesrin kalbi parçaların eş büyüklükte olmasıdır. Bu eşitlik fikrini kuramayan çocukta sonraki tüm kesir kavramı çöker; süreğen güçlük matematik öğrenme güçlüğü (diskalkuli) açısından erken bir uyarı işaretidir. Kâğıt katlamayı kullanın: katlayıp üst üste getirince parçaların çakışması \"eşit\"i somut kanıtlar; \"parçalar üst üste tam oturuyor mu?\" sorusunu her seferinde sordurun.",
    act: {
      materials: ["katlanabilir kâğıt daireler/şeritler (\"pizza\", \"çikolata\")", "DokunSay Kesir aracı (bar modeli)", "kontrol için makas (parçaları üst üste koyma)"],
      steps: [
        "Bir kâğıt pizzayı verin: \"İki arkadaşa EŞİT böl — kimse az almasın.\"",
        "Çizmek yerine katlamayı önerin: kâğıdı ikiye katlayıp kıvrımdan kessin.",
        "İki parçayı üst üste koydurun: \"Tam çakışıyor mu? Demek eşit.\"",
        "Eşitsiz bir bölmeyi gösterip \"bu adil mi?\" diye karşılaştırın; sonra dörde bölmeyi deneyin.",
      ],
      criterion: "Bir şekli istenen sayıda (önce 2, sonra 4) gözle denk / üst üste çakışan eşit parçaya bölerse ✓",
      easy: "Yalnız ikiye bölmeyle ve katlama yardımıyla çalışın; şerit (dikdörtgen) kullanın — katlaması kolaydır.",
      hard: "Daireyi dörde, üçe bölmeyi isteyin (üç parça katlamayla zordur — eşitliği tartıştırın).",
    },
    tool: "kesir",
  },
  { // 2 — Yarım Tanıyıcı (54–78 ay)
    how: "Çocuk bir çikolatayı ikiye böldüğünde her parçaya \"yarım\" der; \"bütünün yarısını ver\" deyince iki denk parçadan birini uzatır. \"İki yarım birleşince ne olur?\" sorusuna \"bütün/tam\" diye yanıtlayabilir.",
    teacher: "Yarım, çocuğun adlandırdığı İLK kesirdir ve özeldir: günlük dilde sık geçtiği için kesir kavramına en doğal giriştir. Burada iki şeyi pekiştirin — (1) yarım demek iki EŞİT parçadan biri (eşitsiz bölünmüş büyük parça \"yarım\" değildir), (2) iki yarım bir bütün eder. \"Yarım\" sözcüğünü bol bol bağlama oturtun (yarım elma, yarım bardak); eşit olmayan bir bölmeyi gösterip \"bu yarım mı?\" diye sorgulatın ki eşitlik koşulu yarımda da yerleşsin.",
    act: {
      materials: ["ikiye bölünebilen nesneler/kâğıtlar (elma, çikolata, daire)", "DokunSay Kesir aracı (bar modeli, pasta grafik)", "iki denk parça (yarımlar)"],
      steps: [
        "Bir daireyi katlayıp ikiye eşit bölün: \"Bu parçaya ne denir?\" → \"yarım.\"",
        "\"Bütünün yarısını bana ver\" deyin; bir yarımı uzatsın.",
        "İki yarımı birleştirip \"ikisi ne yapar?\" diye sorun → \"bir bütün/tam.\"",
        "Eşitsiz bölünmüş bir şekli gösterip \"bu da yarım mı?\" diye eşitliği yoklayın.",
      ],
      criterion: "İki eşit parçadan birini \"yarım\" diye tanır/oluşturur VE iki yarımın bütün ettiğini söylerse ✓",
      easy: "Hep aynı şekille (daire) çalışın; \"yarım\"ı siz adlandırıp tekrarlatın.",
      hard: "Farklı şekillerde (kare, şerit, bardak su) yarımı buldurun; \"çeyrek de var mı?\" diye uzatın.",
    },
    tool: "kesir",
  },
  { // 3 — Birim Kesir Tanıyıcı (96–108 ay) ★ DARBOĞAZ
    how: "Çocuk bir daireyi 4 eşit parçaya böldükten sonra bir parçayı gösterip \"bu dörtte bir\" (1/4) der ve neden 4 yazdığını açıklar: \"bütün dört eşit parçaya bölündü, ben birini aldım\". Henüz oturmamışsa parça sayısını saymakla yetinip \"bir parça\" der ama paydanın (4) bütünün kaça bölündüğünü gösterdiğini kavrayamaz; ya da eşitsiz parçalardan birine de \"dörtte bir\" der.",
    teacher: "Birim kesir (1/n) kesirlerin ikinci büyük darboğazıdır: çocuk paydanın \"bütün kaç eşit parçaya bölündü\" anlamını ve payın (1) \"bunlardan birini aldım\" anlamını birlikte kavramalıdır. Burada iki yanılgı kritiktir — (1) parçaların eşit olması koşulunu unutmak (\"kesir sadece bölmektir\"), (2) paydanın büyümesi parçayı KÜÇÜLTÜR ilişkisini ters anlamak (\"1/4 > 1/2 çünkü 4 > 2\"). Bu ilişkileri kuramama, matematik öğrenme güçlüğü (diskalkuli) için bilinen bir erken belirtidir. Bar modeli ve pasta grafikle aynı bütünü farklı paydalara böldürüp \"hangi parça daha büyük, 1/2 mi 1/4 mü?\" diye karşılaştırtın; payda büyüdükçe dilimin küçüldüğünü gözle gösterin.",
    act: {
      materials: ["DokunSay Kesir aracı (pasta grafik + bar modeli)", "kesir daireleri (1/2, 1/3, 1/4 dilimleri)", "katlanabilir kâğıt şeritler"],
      steps: [
        "Bir daireyi 4 eşit parçaya böldürün; bir parçayı gösterip \"bu ne kadar?\" deyin → \"dörtte bir, 1/4.\"",
        "\"Neden 4? Neden 1?\" diye sordurun: \"bütün 4 eşit parça, ben 1 tane.\"",
        "Aynı bütünü 2'ye böldürün: \"1/2 mi büyük, 1/4 mü?\" — dilimleri üst üste koyup karşılaştırın.",
        "Eşitsiz bölünmüş bir parçayı gösterip \"buna 1/4 diyebilir miyiz?\" diye eşitlik koşulunu yoklayın.",
      ],
      criterion: "Bir bütünü n eşit parçaya bölüp bir parçayı 1/n diye doğru adlandırır VE payda büyüdükçe parçanın küçüldüğünü (1/2 > 1/4) gösterirse ✓",
      easy: "Yalnız 1/2 ve 1/4 ile çalışın; pastayı önceden eşit bölünmüş verin, o yalnız adlandırsın.",
      hard: "1/3, 1/6, 1/8 ekleyin; \"1/3 mü büyük 1/5 mi?\" gibi yalnız sözlü/zihinden karşılaştırtın.",
    },
    tool: "kesir",
  },
  { // 4 — Kesir Tanıyıcı (96–108 ay)
    how: "Çocuk kesir çubuklarında üç tane 1/4'lük parçayı (toplam dört eşit parçadan üçü dolu) görüp \"bu dörtte üç, 3/4\" der; payın (3) kaç parça alındığını, paydanın (4) bütünün kaça bölündüğünü gösterdiğini ayırt eder. Bütünün ne kadarının dolu olduğunu okuyabilir.",
    teacher: "Birim kesirden \"pay > 1\" olan kesirlere (3/4, 2/3) geçiş budur: çocuk artık \"birim kesrin kaç tanesi\" mantığıyla okur — 3/4 = üç tane 1/4. Burada pay ile paydanın rollerini netleştirin: payda = bütün kaça bölündü (alt sayı), pay = kaç parça aldık (üst sayı). Yaygın karışıklık ikisini ters okumaktır (3/4 yerine 4/3). Bar modelinde dolu/boş parçaları saydırıp \"kaç parçadan kaçı dolu?\" diye yapıyı okutun; aynı şekli hem kesir çubuğu hem pasta grafikle gösterip temsiller arası bağ kurun.",
    act: {
      materials: ["DokunSay Kesir aracı (bar modeli + pasta grafik)", "kesir çubukları (1/2, 1/3, 1/4, 1/5 takımları)", "kesir kartları (3/4, 2/3 yazılı)"],
      steps: [
        "Bar modelinde 4 eşit parçanın 3'ünü doldurun: \"Kaç parça? Kaçı dolu?\" → \"dört parça, üçü dolu — 3/4.\"",
        "\"Alttaki sayı (4) neyi, üstteki (3) neyi söyler?\" diye pay-payda rolünü ayırttırın.",
        "Aynı 3/4'ü pasta grafikte gösterip \"bu da aynı kesir mi?\" diye temsil bağı kurun.",
        "Farklı kesirler (2/3, 2/5, 4/5) için adlandırma turu yapın.",
      ],
      criterion: "Pay > 1 olan kesirleri (3/4, 2/3) bütünün parça yapısını okuyarak doğru adlandırır ve pay/paydanın anlamını ayırt ederse ✓",
      easy: "Paydası 2 ve 4 olan kesirlerle (1/2, 3/4) sınırlı kalın; doluları birlikte sayın.",
      hard: "Paydası 5–8 olan kesirler ve \"bu kesirde kaç parça boş?\" (tümleyen) sorusu ekleyin.",
    },
    tool: "kesir",
  },
  { // 5 — Birimlerden Kesir Yapıcı (102–114 ay)
    how: "Çocuğa 1/4'lük parçalardan \"3/4 oluştur\" dediğinizde üç tane 1/4'ü yan yana getirip \"işte 3/4, üç tane dörtte bir\" der. Birim kesri tekrarlayarak hedef kesri KENDİSİ kurar; kaç birim kesir gerektiğini paydan okur.",
    teacher: "Bu, bir önceki düzeyin tersine işlemesidir: tanımaktan ÜRETMEYE geçiş. Çocuk artık kesri \"birim kesirlerin toplamı\" olarak inşa eder (3/4 = 1/4 + 1/4 + 1/4). Asıl içgörü, payın \"kaç tane birim kesir koyacağımı\" söylemesidir. Hedef kesre ulaşınca durmuyor ya da farklı paydalı parçalar karıştırıyorsa, \"hepsi aynı büyüklükte (1/4) mi?\" ve \"kaç tane lazımdı?\" diye yönlendirin. Kesir çubuklarıyla aynı boy birim parçaları arka arkaya dizdirin; bu, ileride kesir toplamasının somut zeminidir.",
    act: {
      materials: ["DokunSay Kesir aracı (bar modeli)", "tek tip birim kesir parçaları (yalnız 1/4'ler, ayrıca 1/3'ler)", "hedef kesir kartları (3/4, 2/3)"],
      steps: [
        "Bir avuç 1/4'lük parça verin: \"Bunlardan 3/4 yap.\"",
        "Çocuk üç parçayı yan yana koysun: \"Kaç tane koydun? Neden üç?\" → \"pay 3.\"",
        "\"Hepsi aynı büyüklükte mi?\" diye birim parçaların denkliğini doğrulatın.",
        "1/3'lerle 2/3 yaptırın; \"bir bütün için kaç tane daha lazım?\" diye uzatın.",
      ],
      criterion: "Verilen birim kesirlerden (1/n) istenen kesri (m/n), doğru sayıda parçayı birleştirerek oluşturursa ✓",
      easy: "Hedefi birim kesir + bir fazla (2/4, 2/3) tutun; siz ilk parçayı koyup o sürdürsün.",
      hard: "Bir bütünü aşan istek (5/4) ya da iki farklı paydadan seçtirip doğru olanı kullandırın.",
    },
    tool: "kesir",
  },
  { // 6 — Kesir Yapıcı (108–120 ay)
    how: "Çocuğa \"5/6'yı bu parçalarla yap\" dediğinizde önce bütünü 6 eşit parçaya kurar (ya da 1/6'lık parçalar seçer), beş tanesini alır ve \"5/6, bir parça eksik bütüne\" der. Hangi paydayı, kaç payı kullanacağını isteğe göre esnekçe ayarlar.",
    teacher: "Bu, kesir oluşturmanın tam (genel) hâlidir: çocuk artık yalnız önceden verilen birim parçalarla değil, herhangi bir istenen kesri sıfırdan kurar — doğru paydayı seçip (bütünü kaça böleceğini) doğru payı (kaç parça alacağını) belirler. Önceki düzeyden farkı, paydanın da çocuk tarafından kurulmasıdır. Yaygın hata yanlış payda seçmektir (5/6 için bütünü 5'e bölmek); \"alttaki sayı bütünü kaça böler?\" diye sürekli sorgulayın. Bar modelinde önce bütünü doğru bölmesini, sonra saymasını sağlayın; \"bütüne kaç eksik?\" sorusu tümleyen kesri de pekiştirir.",
    act: {
      materials: ["DokunSay Kesir aracı (bar modeli + pasta grafik)", "bölünebilir bütün şablonları (boş bar/daire)", "kesir kartları (5/6, 3/8, 4/5)"],
      steps: [
        "\"5/6 yap\" deyin; \"önce bütünü kaça böleriz?\" diye paydayı sordurun → 6 eşit parça.",
        "Çocuk 6 parçaya bölsün, beşini boyasın/seçsin: \"işte 5/6.\"",
        "\"Bütüne kaç parça eksik?\" diye tümleyeni (1/6) söyletin.",
        "Farklı kesirler (3/8, 4/5) için payda-seç → pay-al adımlarını yineletin.",
      ],
      criterion: "İstenen herhangi bir kesri (m/n), bütünü doğru paydaya bölüp doğru sayıda pay alarak kendisi oluşturursa ✓",
      easy: "Paydası ≤4 kesirlerle (3/4, 2/3) ve hazır bölünmüş bütünle başlayın.",
      hard: "Paydası 6–10 kesirler, bir bütünü aşan kesir (7/6) ya da yalnız sözlü tarif ekleyin.",
    },
    tool: "kesir",
  },
  { // 7 — Kesir Tekrarlayıcı (114–126 ay)
    how: "Çocuğa bir 1/4'lük parça verip \"kaç tane 1/4 bir bütün eder?\" deyince parçayı arka arkaya dört kez kopyalayıp \"dört tane — 4/4, yani bir bütün\" der. Birim kesri tekrar tekrar yerleştirerek bütüne (ya da verilen herhangi bir miktara) ulaşır.",
    teacher: "Kesir tekrarlama (iterating), kesrin ölçü olarak anlaşılmasının temelidir: birim kesir bir \"ölçü birimi\"dir ve onu tekrarlayarak büyüklük inşa edilir (dört kez 1/4 = 1 bütün; üç kez 1/4 = 3/4). Bu içgörü, n/n = 1 eşitliğini ve kesirleri sayı doğrusuna yerleştirmeyi hazırlar. Çocuk kaç tane gerektiğini paydadan okuyabilmeli (paydası 4 → dört tane bütün eder). \"Beş tane 1/4 koysak ne olur?\" diye bütünü aşan durumu da yoklayın — bu, tam-sayılı kesirlere (5/4 = 1 tam 1/4) köprüdür. Kesir çubuğunu/şeridini birim olarak arka arkaya dizdirin.",
    act: {
      materials: ["DokunSay Kesir aracı (bar modeli + sayı doğrusu)", "tek bir birim kesir parçası (1/4, 1/3)", "ölçü için boş bir bütün şerit"],
      steps: [
        "Bir 1/4 parçası verin: \"Bunu tekrar tekrar koyarak bütünü doldur.\"",
        "Çocuk dört kez dizsin: \"Kaç tane oldu? Dört tane 1/4 — bir bütün (4/4).\"",
        "\"Üç tane koysak ne kadar olur?\" → 3/4; \"beş tane?\" → bir bütünden fazla.",
        "Aynısını 1/3 ile yapın; sayı doğrusunda her tekrarı bir sıçrama olarak işaretleyin.",
      ],
      criterion: "Bir birim kesri tekrarlayarak bütünü yapar (n tane 1/n = 1) VE kaç tekrarın hangi kesri verdiğini söylerse ✓",
      easy: "Yalnız 1/2 ve 1/4 ile; bütünü doldurmaya (n/n) odaklanın.",
      hard: "Bütünü aşan tekrar (5/4, 7/3) ve \"kaç tane 1/6 yarım eder?\" gibi ara hedefler.",
    },
    tool: "kesir",
  },
  { // 8 — Kesir Aritmetiği +/− (120–132 ay)
    how: "Çocuk \"1/4 + 2/4 kaç eder?\" sorusunda kesir çubuklarıyla bir 1/4'ün yanına iki 1/4 dizip toplam üç parça sayar: \"3/4\". Paydası eşit kesirleri toplarken/çıkarırken paydayı sabit tutup yalnız payları işler.",
    teacher: "Paydası eşit kesirlerde toplama/çıkarma, kesir tekrarlamanın doğrudan uzantısıdır: aynı birim (1/4) kesirleri saymak gibidir — \"bir parça + iki parça = üç parça\", payda (parçanın türü) değişmez. En yaygın ve kritik yanılgı paydayı da toplamaktır (1/4 + 2/4 = 3/8 demek); bunu kesir çubuğuyla yıkın — \"parçaların büyüklüğü değişti mi? Hayır, hâlâ 1/4'lük\". Çıkarmada da aynı: 3/4 − 1/4 → bir parçayı geri al. Modeli her zaman somut tutun; \"neden payda aynı kaldı?\" diye gerekçelendirtin. Toplam bütünü aşınca (3/4 + 2/4 = 5/4) tam-sayılı kesre bağlayın.",
    act: {
      materials: ["DokunSay Kesir aracı (bar modeli)", "aynı paydalı kesir çubukları (1/4'lük, 1/5'lik takımlar)", "işlem kartları (1/4 + 2/4, 3/5 − 1/5)"],
      steps: [
        "\"1/4 + 2/4\" için bir parça koyup yanına iki parça ekletin: \"Kaç parça oldu?\" → 3/4.",
        "\"Payda neden hâlâ 4?\" diye sordurun: \"parçaların büyüklüğü aynı kaldı.\"",
        "Çıkarma: 3/4'ten bir parçayı geri aldırın → 2/4.",
        "Bütünü aşan toplam (3/4 + 2/4) yaptırıp \"bir bütünden fazla — 5/4\" dedirtin.",
      ],
      criterion: "Paydası eşit kesirlerde payları toplayıp/çıkararak doğru sonucu bulur VE paydanın neden değişmediğini açıklarsa ✓",
      easy: "Yalnız toplama, küçük paylar (1/4 + 1/4), sonuç bütünü aşmasın; parçaları birlikte sayın.",
      hard: "Bütünü aşan toplamlar (5/6 + 3/6), ardışık iki işlem ya da yalnız semboller (çubuksuz).",
    },
    tool: "kesir",
  },
  { // 9 — Kesir Aritmetiği ×/÷ (132–144 ay)
    how: "Çocuk \"1/2'nin 1/3'ü kaçtır?\" sorusunu bir bütünü önce ikiye böler, o yarımı sonra üçe bölerek modelleyip oluşan minik parçanın bütünün altıda biri olduğunu görür: \"1/6\". \"Bir kesrin bir kesri\" işlemini parçanın parçası olarak somut kurar.",
    teacher: "Kesir çarpma/bölme en soyut basamaktır; anlamı kurallaştırmadan ÖNCE modelle oturtmak şarttır. \"1/2'nin 1/3'ü\" = yarımı üçe bölmek → bütünün 1/6'sı; bu, \"bir kesrin kesrini almak\" demektir ve sonucun küçülmesi (çarpınca büyür yanılgısının tersi) en önemli içgörüdür — \"çarpma her zaman büyütür\" beklentisini kesir bağlamında yık. Alan/bar modelinde önce bir yöne böl, sonra diğer yöne bölerek kesişen parçayı saydır; \"kaç eşit parça oluştu, bizimki kaçı?\" diye paydayı (6) ürettir. Bölme için \"bir bütünde kaç tane 1/4 var?\" gibi ölçme-bölme bağlamı kullanın.",
    act: {
      materials: ["DokunSay Kesir aracı (bar/alan modeli + pasta grafik)", "iki yöne bölünebilen ızgara/bar", "işlem kartları (1/2'nin 1/3'ü, 1 ÷ 1/4)"],
      steps: [
        "Bir bütünü ikiye böldürün, bir yarımı seçtirin.",
        "O yarımı üçe böldürün: \"Tüm bütünde kaç eşit parça oldu?\" → altı; \"bizimki kaçı?\" → 1/6.",
        "\"Sonuç başladığımızdan büyük mü küçük mü?\" diye küçülmeyi fark ettirin.",
        "Bölme: bir bütün şeride kaç tane 1/4 sığdığını saydırın (1 ÷ 1/4 = 4).",
      ],
      criterion: "\"Bir kesrin kesri\"ni (çarpma) ya da \"bütünde kaç birim kesir var\"ı (bölme) modelle doğru bulur VE sonucun yönünü (küçülme/büyüme) açıklarsa ✓",
      easy: "Yalnız birim kesir çarpımları (1/2'nin 1/2'si) ve \"bütünde kaç yarım var\" gibi kolay bölme.",
      hard: "Pay > 1 kesirlerle (2/3'ün 3/4'ü) ya da kesre bölme (1/2 ÷ 1/4) ekleyin.",
    },
    tool: "kesir",
  },
  { // 10 — Kesir ve Tam Sayı Sıralayıcı (132–144 ay)
    how: "Çocuk sayı doğrusuna 1/2, 3/4 ve 1'i yerleştirirken \"1/2 ortada, 3/4 ondan sağda ama 1'den solda, 1 en sağda\" diye sıralar; \"3/4, yarımdan büyük çünkü dörtte üç, ikide birden fazla\" gibi gerekçe verir. Kesirlerle tam sayıları aynı doğruda büyüklüğe göre düzenler.",
    teacher: "Bu yörüngenin doruğudur: kesir artık yalnız \"parça\" değil, sayı doğrusu üzerinde bir SAYI/büyüklüktür. Çocuk kesirleri birbirleriyle ve tam sayılarla karşılaştırıp sıralayabilmelidir. İki güçlü dayanak verin — (1) çıpa olarak 1/2 ve 1 (\"yarımdan büyük mü küçük mü?\"), (2) ortak temsil: tüm kesirleri aynı uzunlukta bara/doğruya oturtmak. Yaygın yanılgı \"payda büyükse kesir büyüktür\" (1/8 > 1/2) ve \"pay büyükse kesir büyüktür\" sanmaktır; bunları sayı doğrusunda gözle çürütün. \"1/2 ile 3/4'ten hangisi 1'e daha yakın?\" gibi sorularla büyüklük muhakemesini derinleştirin.",
    act: {
      materials: ["DokunSay Kesir aracı (sayı doğrusu + bar modeli)", "0–2 arası boş sayı doğrusu şeridi", "yerleştirilecek kesir/tam sayı kartları (1/2, 3/4, 1, 5/4)"],
      steps: [
        "Sayı doğrusunda 0, 1, 2'yi işaretleyin: \"Önce 1/2'yi nereye koyarsın?\" (0 ile 1 ortası).",
        "3/4'ü yerleştirtin: \"yarımdan büyük mü? 1'den küçük mü?\" diye çıpalarla konumlandırtın.",
        "5/4'ü ekletin: \"bir bütünden büyük — 1'in sağında.\"",
        "Hepsini küçükten büyüğe sıralatıp \"hangisi 1'e en yakın?\" diye muhakeme ettirin.",
      ],
      criterion: "Kesirleri ve tam sayıları sayı doğrusunda doğru konumlandırıp büyüklüğe göre sıralar VE 1/2 veya 1 çıpasıyla gerekçelendirirse ✓",
      easy: "Yalnız 1/2, 1 ve bir kesir (3/4) ile; bar modeliyle uzunlukları karşılaştırtın.",
      hard: "Farklı paydalı kesirleri (2/3, 3/4, 5/6) ve bütünü aşan kesirleri (7/4) birlikte sıralatın.",
    },
    tool: "kesir",
  },
]
