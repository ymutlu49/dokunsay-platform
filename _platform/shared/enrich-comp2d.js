// ════════════════════════════════════════════════════════════════════════
// 2B Şekil Oluşturma (Composing 2D Shapes) — düzey zenginleştirmesi
// Clements & Sarama [LT]² (learningtrajectories.org) çerçevesine sadık.
// ────────────────────────────────────────────────────────────────────────
// 11 düzey: şekilleri AYRI kullanma → parçaları birleştirme → resim yapma →
// basit ayrıştırma → ÖNGÖRÜYLE hedef şekli oluşturma (darboğaz) → yerine
// koyma (2 üçgen = 1 kare) → yardımla ayrıştırma → bileşik birimi tekrarlama →
// zihinde (imgelemle) ayrıştırma → BİRİM-ÜSTÜ birimlerle oluşturma/ayrıştırma.
//
// Her nesne: how (nasıl görünür) · teacher (öğretmen notu) ·
//   act { materials[2–4], steps[3–5], criterion (✓), easy, hard } · tool (ops.)
// Araç: DokunSay Geo (tangram, desen blokları) ve yapboz — "geo".
//
// PEDAGOJİ NOTU: Düzey 4 (Şekil Oluşturucu) gerçek darboğazdır. ÖNGÖRÜYLE
// oluşturma — bir parçayı koymadan önce onun NE'reye, nasıl SIĞACAĞINI zihinde
// kestirme — uzamsal-yapısal düşünmenin çekirdeğidir. Bu düzeyde takılan çocuk
// deneme-yanılmaya sıkışır; öngörü, geometride ileri tüm oluşturmanın motorudur.
// ════════════════════════════════════════════════════════════════════════

export default [
  { // 0 — Ayrı Şekiller Eyleyeni: Temeller (0–30 ay)
    how: "Çocuk yapboz parçalarını ya da blokları eline alır, evirip çevirir, sıralar ya da üst üste yığar — ama onları BİRLEŞTİRİP yeni bir bütün yapmaz. Her şekil kendi başına bir oyuncaktır; iki parça yan yana gelse de aralarındaki ilişkiyi kurmaz.",
    teacher: "Bu, şekil oluşturmanın en erken zeminidir: çocuk şekilleri ayrı ayrı, bağımsız nesneler olarak yaşar. \"Birleştirme\" henüz yoktur ve bu yaşta beklenmez. Amaç saydırmak ya da birleştirmeye zorlamak değil; bol bol şekille serbest oynatarak biçim, kenar ve köşe duygusunu uyandırmaktır. Çocuğa şekilleri tutturun, döndürtün, kenarlarını parmakla izletin — bu duyusal-motor keşif sonraki tüm birleştirmenin tohumudur.",
    act: {
      materials: ["İri, kavraması kolay desen blokları (üçgen, kare, altıgen)", "Birkaç büyük ahşap yapboz parçası", "Düz, geniş bir oyun zemini"],
      steps: [
        "Çocuğun önüne birkaç farklı şekil koyun; serbestçe oynamasına bırakın.",
        "Bir parçayı eline verip \"Bunun kaç köşesi var?\" diyerek kenarlarını birlikte parmakla izleyin.",
        "Şekilleri adlandırın: \"Bu üçgen, bu kare\" — ama henüz birleştirmeye yönlendirmeyin.",
        "Çocuk parçaları nasıl kullanıyor diye gözleyin: tek tek mi, yoksa kendiliğinden yan yana mı getiriyor?",
      ],
      criterion: "Şekilleri ayrı ayrı, tek tek kullanıyor (henüz birleştirmiyor) ise bu düzeydedir ✓",
      easy: "Az sayıda (2–3) büyük, belirgin şekille çalışın; çok seçenek vermeyin.",
      hard: "Daha çok parça ve çeşit sunup kendiliğinden iki parçayı yan yana getirip getirmediğini gözleyin.",
    },
    tool: "geo",
  },
  { // 1 — Parça Birleştirici (36–42 ay)
    how: "Çocuk iki parçayı bilinçli olarak yan yana, kenar kenara koyar: bir üçgeni başka bir üçgene değdirir, \"baktım birbirine değdi\" der. Parçalar artık dokunarak BİRLEŞİR — ama henüz belirli bir resmi ya da hedefi yoktur; birleştirmenin kendisi keyiflidir.",
    teacher: "Burada kritik sıçrama olur: çocuk şekilleri ayrı kullanmaktan, onları BİRLEŞTİRMEYE geçer. İlk kez iki parça arasında \"bunlar bir arada\" ilişkisi kurulur. Henüz kenarları tam hizalayamayabilir, aralarında boşluk kalabilir — bu normaldir. Parçaları kenar kenara değdirmeyi modelleyin; \"kenarları öpüşsün\" gibi somut bir dil, hizalamayı görünür kılar. Bu, ilerideki tüm birleştirmenin ilk adımıdır.",
    act: {
      materials: ["Tangram ya da desen blokları (düz kenarlı)", "Düz bir tepsi veya çerçeveli zemin (parçalar kaymasın)"],
      steps: [
        "İki parçayı çocuğa verip \"Bunları birbirine değdirebilir misin?\" deyin.",
        "Bir kenarı bir kenara getirmeyi gösterin: \"Bak, kenarları öpüştü.\"",
        "Çocuk parçaları yan yana koysun; aralarında boşluk kalırsa birlikte yaklaştırın.",
        "Üçüncü bir parça ekleyip \"Buna da değdir\" diyerek zinciri uzatın.",
      ],
      criterion: "İki (veya daha çok) parçayı bilinçli olarak kenar kenara dokundurup birleştirirse ✓",
      easy: "Yalnız düz, uzun kenarlı iki parçayla (iki kare) başlayın; hizalaması kolaydır.",
      hard: "Eğik kenarlı parçalar (üçgenler) ya da üç parçayı bir arada birleştirmesini isteyin.",
    },
    tool: "geo",
  },
  { // 2 — Resim Yapıcı (48–60 ay)
    how: "Çocuk birkaç şekilden tanınır bir resim kurar: bir kare gövde, üstüne üçgen çatı → \"ev\"; bir daire kafa, altına şekiller → \"insan\". Her parça resimde TEK bir rol üstlenir (çatı, gövde, tekerlek). Resim, parçaların gelişigüzel toplamı değil; zihnindeki bir görüntünün karşılığıdır.",
    teacher: "Birleştirme artık bir AMACA bağlanır: çocuk şekilleri bir resmi anlatmak için kullanır. Bu, uzamsal düşünmenin önemli bir adımıdır — parçayı işleviyle (\"bu çatı olacak\") seçer. Ancak parçalar genelde yan yana dizilir; henüz birbirinin yerini doldurarak BİRLİKTE daha büyük tek bir şekil oluşturmazlar. \"Hangi parça çatı olur, neden?\" diye sorarak parça-rol ilişkisini güçlendirin. Çocuğun anlattığı hikâyeyi ciddiye alın; bu, biçim-işlev bağını besler.",
    act: {
      materials: ["Tangram ya da desen blokları (çeşitli)", "Resim için fikir kartları (ev, çiçek, insan, kayık)", "Düz oyun zemini"],
      steps: [
        "\"Bu parçalarla bir ev (ya da insan) yapabilir misin?\" deyin.",
        "Çocuk her parçaya bir rol versin: \"Bu çatı, bu duvar, bu kapı.\"",
        "Bitince \"Bana resmini anlat\" deyip parçaların rolünü söyletin.",
        "Yeni bir hedef verin (çiçek, kayık) ve farklı parçalarla yineletin.",
      ],
      criterion: "Birden çok şekli, her biri tek bir rol alacak biçimde tanınır bir resme dönüştürürse ✓",
      easy: "Basit bir model resim gösterip onu kopyalamasını isteyin.",
      hard: "Model vermeden, yalnız sözle (\"bir balık yap\") özgün bir resim kurdurun.",
    },
    tool: "geo",
  },
  { // 3 — Basit Ayrıştırıcı (48–60 ay)
    how: "Belirgin çizgileri olan basit bir şekli (ör. ortadan çizgiyle ikiye bölünmüş bir dikdörtgen) çocuk parçalarına ayırır: \"Burada iki tane var\" der ve çizgi boyunca böler. Ayrıştırma henüz görünür çizgiye bağlıdır; çizgi yoksa nereden böleceğini bilemeyebilir.",
    teacher: "Bu, birleştirmenin TERSİ olan ayrıştırmanın ilk hâlidir: bütünü parçalara çözme. Şu aşamada çocuk yalnız BELİRGİN, görünür çizgiler boyunca ayırabilir — bu yüzden ona çizgili, ipucu veren şekiller sunun. Ayrıştırma ileride alan, kesir ve esnek parçalama için kritiktir. \"Bu şekil hangi parçalardan yapılmış?\" sorusuyla bütün-parça ilişkisini iki yönlü düşündürün; birleştirip sonra ayrıştırarak tersinirliği gösterin.",
    act: {
      materials: ["Üzeri belirgin çizgilerle bölünmüş basit şekil kartları", "Desen blokları (kartla aynı parçalara karşılık gelen)", "Makas yerine çizgi-izleme için parmak/işaret"],
      steps: [
        "Belirgin çizgili bir şekil gösterin: \"Bu hangi parçalardan yapılmış?\"",
        "Çocuk çizgiyi parmağıyla izleyip parçaları söylesin (\"iki üçgen\").",
        "Aynı şekli bloklarla kurup sonra parçalarına ayırtın.",
        "Çizgileri biraz silikleştirip yine ayırabiliyor mu diye yoklayın.",
      ],
      criterion: "Belirgin çizgili basit bir şekli, çizgiler boyunca doğru parçalara ayırırsa ✓",
      easy: "Tek bir kalın çizgiyle ikiye bölünmüş şekil kullanın (ev, kare).",
      hard: "Birden çok çizgili (üç-dört parçalı) şekiller ya da çizgiyi inceltip soluklaştırın.",
    },
    tool: "geo",
  },
  { // 4 — Şekil Oluşturucu (48–60 ay) ★ DARBOĞAZ
    how: "Çocuk bir hedef şekli (ör. altıgen anahattı) parçalarla DOLDURUR ve en önemlisi, bir parçayı koymadan ÖNCE onun oraya sığıp sığmayacağını kestirir: \"İki üçgen koysam altıgen olur\" der ve doğru parçayı seçer. Henüz oturmamışsa rastgele parça dener, döndürmeyi unutur, sığmayınca şaşırır — öngörü yerine deneme-yanılmaya sıkışır.",
    teacher: "Bu, şekil oluşturma yörüngesinin gerçek DARBOĞAZIDIR. Asıl kazanım, parçayı yerleştirmeden önce \"ne sığacağını bilme\" — yani sonucu zihinde önceden görme (öngörüyle oluşturma). Bu, uzamsal-yapısal düşünmenin çekirdeğidir: çocuk parçanın biçimini, boyutunu ve döndürülmüş hâlini zihninde boşlukla eşler. Burada takılan çocuk her seferinde fiziksel deneme-yanılmaya başvurur; bu, ileri geometri ve alan akıl yürütmesi için bir uyarı işaretidir. \"Önce DÜŞÜN: hangisi sığar? Neden?\" diye sürekli sorun; parçayı koymadan önce çocuğa tahmin ettirin, sonra deneyerek doğrulatın. Döndürme/çevirme seçeneklerini hatırlatın — çoğu tıkanma, parçanın döndürülebileceğinin fark edilmemesinden kaynaklanır.",
    act: {
      materials: ["Desen blokları (üçgen, eşkenar dörtgen, yamuk, altıgen)", "Hedef şekil anahatları (altıgen, yıldız — içi boş şablonlar)", "Tangram (daha ileri hedefler için)"],
      steps: [
        "Bir altıgen anahattı gösterip \"Bunu hangi parçalarla tam doldurursun?\" deyin.",
        "Çocuk parçayı koymadan ÖNCE tahmin etsin: \"Sence bu üçgen buraya sığar mı? Neden?\"",
        "Tahminini deneyerek doğrulasın; sığmazsa \"Döndürsek olur mu?\" diye çevirmeyi hatırlatın.",
        "Aynı altıgeni FARKLI parçalarla da doldurtun (3 eşkenar dörtgen ↔ 6 üçgen) — \"başka türlü de olur mu?\"",
        "Yıldız/balık gibi yeni hedefler verip her parçadan önce öngörü isteyin.",
      ],
      criterion: "Bir hedef şekli, parçaları koymadan önce ne sığacağını ÖNGÖREREK (rastgele denemeden) doğru parçalarla oluşturursa ✓",
      easy: "Hedefin içine parça sınırlarını çizip ipucu verin; tek tür parçayla (yalnız üçgen) doldurtun.",
      hard: "Sınırsız, ipucusuz anahat; \"en az kaç parçayla doldurursun?\" ya da iki ayrı çözüm bulmasını isteyin.",
    },
    tool: "geo",
  },
  { // 5 — Yerine Koyarak Oluşturucu (60–72 ay)
    how: "Çocuk bir şekil grubunun yerine eşdeğer başka bir şekil koyabilir: \"İki üçgen yerine bir kare koyabilirim\" ya da \"İki yamuk yerine bir altıgen\" der ve değiştirir. Parçaların DENKLİĞİNİ (aynı yeri kaplama) kavrar; bir bütünü farklı parça takımlarıyla kurabileceğini bilir.",
    teacher: "Bu düzeyde oluşturma esnekleşir: çocuk parçaların birbirinin YERİNE geçebileceğini (2 üçgen = 1 kare; 6 üçgen = 1 altıgen) keşfeder. Bu eşdeğerlik içgörüsü, ileride kesirlerin (yarım + yarım = bütün) ve ölçü-dönüşümlerinin doğrudan zeminidir. \"Bunun yerine başka ne koyabilirsin? Yine aynı yeri kaplar mı?\" diye değiş-tokuş düşündürün. Bir parçayı kaldırıp yerine eşdeğer takımı koydurarak korunan-alan duygusunu somutlaştırın.",
    act: {
      materials: ["Desen blokları (üçgen, eşkenar dörtgen, yamuk, altıgen — birbirine denk gelen)", "Hedef bir şekil ya da basit bir döşeme deseni", "Düz oyun zemini"],
      steps: [
        "Bir kareyi iki üçgenle kaplayıp \"Bu iki üçgen birlikte neye eşit?\" diye sorun.",
        "Tersini yaptırın: \"Şu altıgenin yerine hangi parçalar gelir?\" (2 yamuk, 3 eşkenar dörtgen, 6 üçgen).",
        "Kurulu bir desende bir parçayı çıkarıp \"Yerine eşit parçalar koy\" deyin.",
        "\"Aynı şekli daha az / daha çok parçayla yapabilir misin?\" diyerek değiş-tokuşu çoğaltın.",
      ],
      criterion: "Bir şekil grubunu, aynı yeri kaplayan eşdeğer başka bir şekille (ör. 2 üçgen ↔ 1 kare) doğru biçimde değiştirirse ✓",
      easy: "Yalnız bir denklik üzerinde çalışın (2 üçgen = 1 kare); fiziksel üst üste koydurun.",
      hard: "Çok adımlı değiş-tokuş (altıgen → 2 yamuk → her yamuk 3 üçgen) ya da hangi takımın daha az parça kullandığını sordurun.",
    },
    tool: "geo",
  },
  { // 6 — Şekil Ayrıştırıcı (Yardımla) (72–84 ay)
    how: "Çocuk bir bileşik şekli (ör. birkaç parçadan oluşmuş bir figür) İPUCU ya da destekle parçalarına ayırır: siz \"Burada bir kare görebilir misin?\" diye yol gösterince doğru sınırı bulur. Tek başına tüm ayrıştırmayı henüz kuramaz ama yönlendirme ile bütünü anlamlı parçalara çözer.",
    teacher: "Ayrıştırma burada görünür çizgilerin ötesine geçer: çocuk artık ÇİZGİSİZ bir bütünde gizli parçaları, ama henüz yalnız yardımla, görmeye başlar. İpucu (\"şurada hangi şekil saklı?\") ona zihinsel bölme çizgileri çekmeyi öğretir. Bu, ileride bağımsız (imgelemle) ayrıştırmanın köprüsüdür. Desteği kademeli azaltın: önce parçayı gösterin, sonra yalnız işaret edin, en son yalnız sorun. \"Bu büyük şekil hangi tanıdık parçalardan oluşuyor?\" sorusu anahtardır.",
    act: {
      materials: ["Çizgisiz bileşik şekil kartları (içinde tanıdık şekiller gizli)", "Desen blokları / tangram (ayrıştırmayı kurmak için)", "Parçaları işaretlemek için silinebilir kalem ya da şeffaf örtü"],
      steps: [
        "Çizgisiz bir bileşik şekil gösterin: \"Bunun içinde hangi şekiller saklı?\"",
        "Çocuk zorlanırsa ipucu verin: \"Şu köşede bir üçgen görebilir misin?\"",
        "Bulduğu parçanın sınırını birlikte çizin ya da blokla üstüne koydurun.",
        "Desteği azaltarak kalan parçaları çocuğun tek başına bulmasını bekleyin.",
      ],
      criterion: "Bir bileşik şekli, ipucu/destekle bütünü anlamlı parçalara doğru ayrıştırırsa ✓",
      easy: "Az parçalı (2–3) ve parçaları belirgin/tanıdık şekiller olan bileşikler kullanın; her parçayı gösterin.",
      hard: "Çok parçalı, parçaları iç içe geçmiş bileşikler; yalnız tek bir başlangıç ipucu verip gerisini bırakın.",
    },
    tool: "geo",
  },
  { // 7 — Bileşik Şekil Tekrarlayıcı (72–90 ay)
    how: "Çocuk birkaç şekilden yapılma bir BİRİMİ (ör. kare + üçgen = \"ok\", ya da iki yamuktan bir altıgen) tek bir blok gibi alıp tekrar tekrar dizerek bir desen/döşeme kurar: \"Şunu bir daha, bir daha yapayım\" der. Bileşik şekli artık tek parça gibi düşünür ve onunla örüntü üretir.",
    teacher: "Bu kritik bir soyutlamadır: çocuk birden çok parçadan oluşan bir bütünü TEK BİR BİRİM olarak görür ve onu yineler. Bu \"birimleme\", sayıda onluk demetlerini (10'u bir birim sayma) ve ileride alan/çarpma örüntülerini düşünmenin geometrik karşılığıdır. Bileşik birimi önce birlikte kurun, sonra \"Aynısından bir tane daha\" diyerek kopyalatın; \"kaç tane bileşik kullandın?\" diye birim sayısını saydırın. Döşemede birimin yönünün korunmasına dikkat edin.",
    act: {
      materials: ["Desen blokları / tangram", "Tekrarlanacak bileşik birim için bir model (kart ya da kurulu örnek)", "Desen şeridi ya da geniş döşeme zemini"],
      steps: [
        "Birkaç parçadan bir bileşik birim kurun (ör. yamuk + yamuk = altıgen).",
        "\"Bunu tek bir blok gibi düşün; aynısından bir tane daha yap\" deyin.",
        "Çocuk birimi yineleyerek bir şerit/döşeme oluştursun.",
        "\"Kaç tane bileşik kullandın?\" diye birimleri saydırın; örüntüyü uzatın.",
      ],
      criterion: "Birkaç şekilden oluşan bir bileşik birimi, onu tek bir birim gibi alıp tekrarlayarak desen/döşeme kurarsa ✓",
      easy: "İki parçalı basit bir birimle (kare + üçgen) ve düz bir şerit boyunca tekrarlatın.",
      hard: "Çok parçalı birim, ya da tekrarda yön/çevirme gerektiren (dönüşümlü) döşeme deseni.",
    },
    tool: "geo",
  },
  { // 8 — İmgelemle Şekil Ayrıştırıcı (72–96 ay)
    how: "Çocuk bir şekle bakarak, ELİYLE denemeden, onu zihninde parçalara ayırır: \"Bu altıgeni iki yamuğa, ya da altı üçgene bölebilirim\" diye birden çok ayrıştırmayı kafadan söyler. Model ya da çizgi olmadan, esnek biçimde \"içinde ne var\" görebilir.",
    teacher: "Burada ayrıştırma tamamen ZİHİNSELLEŞİR: çocuk artık fiziksel destek olmadan, bir şekli içsel olarak çeşitli parça takımlarına çözebilir — üstelik tek bir yolla değil, ESNEK biçimde birden çok yolla. Bu zihinsel görüntüleme (imgelem), uzamsal akıl yürütmenin olgun bir göstergesidir ve alan/kesir/çarpma için güçlü bir araçtır. \"Gözünü kapat, bu şekli kafanda parçalara ayır — kaç farklı yol buldun?\" diye düşündürün; cevabını sonra parçalarla doğrulatın. Tek yol yetmez; çoklu ayrıştırmayı teşvik edin.",
    act: {
      materials: ["Şekil kartları (çizgisiz, model yok)", "Doğrulama için desen blokları / tangram (önce zihinde, sonra elle)", "Düşünmeyi kaydetmek için silinebilir kalem (ops.)"],
      steps: [
        "Çizgisiz bir şekil gösterip \"Bunu kafanda hangi parçalara ayırabilirsin?\" deyin (elleme yok).",
        "Çocuk önce SÖZLE anlatsın: \"İki yamuk\" ya da \"altı üçgen.\"",
        "\"Başka bir yol var mı?\" diye en az iki farklı ayrıştırma isteyin.",
        "Söylediklerini bloklarla kurup zihinsel tahminini doğrulatın.",
      ],
      criterion: "Bir şekli model/çizgi olmadan zihninde, esnek biçimde (ve mümkünse birden çok yolla) doğru ayrıştırırsa ✓",
      easy: "Tanıdık, az parçaya ayrılan bir şekille (kareyi iki üçgene) başlayın; tek yol kabul.",
      hard: "Karmaşık şekil ve \"en az üç farklı yol\" ya da yalnız sözle, hiç doğrulatmadan.",
    },
    tool: "geo",
  },
  { // 9 — Şekil Oluşturucu—Birimlerin Birimleri (96–108 ay)
    how: "Çocuk birkaç şekilden yapılma bir birimi (ör. 6 üçgenden bir altıgen) kurup, sonra bu altıgenleri de bir araya getirerek daha büyük bir bütün (bir bal peteği döşemesi) oluşturur. Yani BİRİMİN BİRİMİYLE düşünür: küçük parçalar → birim → birimlerden oluşan üst-birim. Aynı anda iki düzeyde yapı kurar.",
    teacher: "Bu, şekil oluşturmanın en üst düzeyidir: birim-üstü birimlerle (\"birimlerin birimleri\") oluşturma. Çocuk hiyerarşik bir yapı kurar — parça, parçalardan birim, birimlerden döşeme — ve bu düzeyler arasında esnekçe gezinir. Bu, basamak değerindeki \"on onluk = bir yüzlük\" yapısının ve çarpımsal alanın geometrik kardeşidir. \"Önce küçük birimini kur, sonra o birimlerden büyük deseni yap\" diye iki katmanı ayrı ayrı konuşturun; \"kaç üçgen bir altıgen, kaç altıgen bütün desen?\" diye katmanları ilişkilendirin.",
    act: {
      materials: ["Bol miktarda desen bloğu (özdeş birimler kurmaya yetecek)", "Büyük bir döşeme zemini ya da çerçeve", "Birim için bir model (ops.)"],
      steps: [
        "Önce tek bir bileşik birim kurdurun (ör. 6 üçgenden bir altıgen).",
        "\"Şimdi bu altıgenlerden birkaç tane yapıp yan yana getir\" deyin.",
        "Çocuk birimleri çoğaltıp daha büyük bir döşeme/desen oluştursun.",
        "Katmanları ilişkilendirin: \"Kaç üçgen bir altıgen eder? Kaç altıgen tüm deseni?\"",
      ],
      criterion: "Şekillerden bir birim kurup, o birimleri de bir araya getirerek (birimlerin birimleriyle) daha büyük bir bütün oluşturursa ✓",
      easy: "Birimi sizinle birlikte kurun; çocuk yalnız birimleri çoğaltıp dizsin.",
      hard: "İki farklı birim türünü (ör. altıgen + üçgen) birleştiren karmaşık bir döşeme kurdurun.",
    },
    tool: "geo",
  },
  { // 10 — Birimlerin Birimleriyle Ayrıştırıcı (96–120 ay)
    how: "Çocuk karmaşık bir döşemeye/desene bakıp onu ÜST düzeyde çözer: \"Bu desen altıgenlerden yapılmış; her altıgen de altı üçgenden\" diyerek hem büyük birimleri hem onların alt-parçalarını aynı anda görür. Bütünü, birimlerin birimi olarak ayrıştırır — iki katmanlı bir çözümleme yapar.",
    teacher: "Bu, ayrıştırmanın en olgun hâli ve yörüngenin doruğudur: çocuk karmaşık bir bütünü hiyerarşik olarak — önce büyük birimlere, sonra onları alt-parçalarına — çözer. Bu çift-katmanlı çözümleme, ileri uzamsal-yapısal düşünmenin, alan ölçmenin ve çarpımsal akıl yürütmenin geometrik zirvesidir. \"Önce büyük parçaları gör, sonra her birini kendi içinde parçala\" diye katmanlı düşündürün; \"toplam kaç küçük parça var?\" diye birim sayısını birim-başına alt-parça ile çarptırarak çarpımsal bağı kurun. Üst düzeyi atlayıp doğrudan en küçük parçaları sayarsa, hiyerarşiyi görmeye yönlendirin.",
    act: {
      materials: ["Karmaşık bir döşeme/desen kartı ya da kurulu örnek", "Desen blokları / tangram (ayrıştırmayı doğrulamak için)", "Katmanları işaretlemek için iki renk kalem ya da şeffaf örtü"],
      steps: [
        "Karmaşık bir döşeme gösterin: \"Bu büyük desen hangi büyük parçalardan oluşuyor?\"",
        "Çocuk önce ÜST birimleri bulsun (ör. altıgenler), sınırlarını işaretlesin.",
        "Sonra \"Her büyük parça kendi içinde nelerden yapılmış?\" diye alt-parçalara indirin.",
        "Katmanları çarpımla ilişkilendirin: \"Kaç altıgen × kaç üçgen = toplam kaç parça?\"",
      ],
      criterion: "Karmaşık bir döşemeyi, önce büyük birimlere sonra onların alt-parçalarına (birimlerin birimleriyle) doğru ayrıştırırsa ✓",
      easy: "Tek tür üst-birimden (yalnız altıgenler) oluşan düzenli bir döşeme kullanın; üst katmanı siz işaretleyin.",
      hard: "Birden çok üst-birim türü içeren düzensiz bir döşeme; \"toplam küçük parça\"yı çarpımla hesaplatın.",
    },
    tool: "geo",
  },
]
