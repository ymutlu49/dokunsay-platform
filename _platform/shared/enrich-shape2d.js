// 2B Şekiller (2D Shapes) — düzey zenginleştirmesi (Clements & Sarama / Van Hiele)
// trajectories.data.js CORE içindeki "shape2d" yörüngesinin 22 düzeyini
// öğretmen/veli için derinleştirir. Altın-standart şablon: yorunge.enrich.js (sub).
// Pedagojik eksen: Van Hiele görsel → analitik geçiş. Çocuk önce şekilleri bütün
// bir görüntü (prototip) olarak tanır ("üçgen, çatı gibi durandır"); sonra
// özelliklere (kenar/köşe sayısı, açı türü) ve giderek sınıf ilişkilerine
// (her kare bir dikdörtgendir) geçer. Sık yanılgılar: yalnız tipik/dik duran
// şekli tanıma, ince/eğik (atipik) üçgeni reddetme, "köşe sayısı = kenar sayısı"
// karışıklığı. Geometride sayısal viz UYGUN DEĞİLDİR → viz konmaz (amblem gösterilir).
// Araç: DokunSay Geo (şekil blokları, geoboard, tangram) — tool: "geo".
// Her düzey: how (nasıl görünür) · teacher (öğretmen notu) · act (etkinlik) · tool.
export default [
  { // 0 — 'Aynı Şey' Karşılaştırıcı: Temeller (0–24 ay)
    how: "Çocuk iki nesneyi yan yana koyunca \"aynı\" ya da \"başka\" diye sezer: aynı iki bardağı eşler, içlerinden farklı olanı (bir tabak) kendiliğinden ayırır. Henüz \"daire/kare\" gibi ad yoktur; yalnız \"bu buna benziyor, bu benzemiyor\" duygusu vardır.",
    teacher: "Bu, tüm geometrinin işitsel-değil görsel tohumudur: çocuk biçimsel benzerliği/farklılığı saymadan, adlandırmadan sezer. Van Hiele'nin \"görsel düzey\"inden bile önceki bir basamaktır — şekil bilgisinin değil, ayırt etme dikkatinin uyanışıdır. Günlük \"bak, bunlar aynı / bu farklı\" oyunlarıyla bu sezgiyi besleyin; amaç ad öğretmek değil, \"benzeyen-benzemeyen\"e dikkati çekmektir.",
    act: {
      materials: ["DokunSay Geo şekil bloklarından 3 özdeş + 1 farklı parça", "küçük bir tepsi"],
      steps: [
        "İki özdeş bloğu çocuğun önüne koyun: \"Bak, bunlar aynı!\" deyin, üst üste getirip gösterin.",
        "Araya farklı bir blok ekleyin: \"Bu başka, değil mi?\" diye tepkisini gözleyin.",
        "Çocuk özdeş olanları yan yana itiyor/uzatıyor mu bakın.",
        "Günlük nesnelerle (iki kaşık + bir top) \"aynı/başka\" oyununu tekrarlayın.",
      ],
      criterion: "Aynı ve farklı nesneleri (saymadan, adlandırmadan) sezgisel ayırt eder; benzeyeni eşler ya da farklıya tepki verirse ✓",
      easy: "Farkı abartın: aynı iki blok yanına çok farklı bir nesne (yumuşak oyuncak) koyun.",
      hard: "Yalnız renkçe değil biçimce yakın nesnelerle (kare ↔ dikdörtgen) ayırt ettirin.",
    },
    tool: "geo",
  },
  { // 1 — Şekil Eşleyici—Özdeş; Yönelimler ve Boyutlar (12–30 ay)
    how: "Çocuk bir üçgeni, döndürülmüş ya da daha büyük/küçük eşiyle eşler: blok döndürülmüş dursa bile \"ikiz\"ini bulur. Şeklin duruşu (yönelim) ya da boyutu değişse de \"aynı şekil\" olduğunu görür.",
    teacher: "Burada kritik kazanım, şeklin DURUŞTAN ve BOYUTTAN bağımsız bir kimliği olduğunu sezmektir. Birçok çocuk başta yalnız tıpatıp aynı duran/aynı boy şekli eşler; döndürülmüş ya da büyütülmüş eşi reddeder. Bu, ileride \"eğik üçgen de üçgendir\" içgörüsünün filizidir. Şekli elinde çevirerek \"bak, döndürdüm ama hâlâ aynı\" deyin; eşlemeyi yönelim/boyut değiştirerek zenginleştirin.",
    act: {
      materials: ["DokunSay Geo şekil blokları (aynı şeklin döndürülmüş + büyük/küçük eşleri)", "bir eşleme tahtası/tepsi"],
      steps: [
        "Bir üçgen bloğu gösterip \"bunun ikizini bul\" deyin; eşini döndürülmüş olarak karıştırın.",
        "Çocuk bulunca bloğu çevirip üst üste getirin: \"tıpatıp oturdu — aynı şekil.\"",
        "Aynı şeklin büyük ve küçük boyunu sunup yine eşletin.",
        "Daire/kare/üçgenle yönelim ve boyut değişerek tekrarlayın.",
      ],
      criterion: "Özdeş bir şekli, yönelimi (döndürülmüş) ve boyutu farklı olsa bile doğru eşlerse ✓",
      easy: "Önce yalnız boyutu değiştirin (duruş aynı kalsın); büyük ↔ küçük eşletin.",
      hard: "Birden çok benzer şekli (üçgen + ince üçgen) karıştırıp tam eşi seçtirin.",
    },
    tool: "geo",
  },
  { // 2 — Şekil Tanıyıcı—Tipik (24–42 ay)
    how: "Çocuk tipik bir daireyi, dik duran bir kareyi ve tabanı altta geniş bir üçgeni gösterince \"daire, kare, üçgen\" diye doğru adlandırır. Bunlar onun zihnindeki \"örnek\" şekillerdir; biraz farklı (uzun, eğik) bir örnek çıkarsa henüz şaşırabilir.",
    teacher: "Bu, Van Hiele'nin görsel (0.) düzeyinin başlangıcıdır: şekil bir BÜTÜN GÖRÜNTÜ olarak, prototipiyle tanınır — \"kare, kapı gibi olandır\". Çocuk özelliklere (kaç kenar?) değil, genel siluete bakar. Bu doğal ve gereklidir; ama tek başına bırakılırsa \"yalnız tipik şekli tanıma\" yanılgısına dönüşür. Şimdilik adları tipik örneklerle sağlamlaştırın; atipik örnekleri bir sonraki darboğaz düzeyine bırakın.",
    act: {
      materials: ["DokunSay Geo şekil blokları (tipik daire, kare, üçgen)", "şekil adı kartları/sözel etiketler"],
      steps: [
        "Tipik daireyi gösterip \"bu ne?\" deyin; çocuk \"daire\" desin, parmağıyla kenarını izlesin.",
        "Tipik kare ve üçgeni sırayla gösterip adlandırtın.",
        "Üç şekli karıştırıp \"daireyi ver / kareyi ver\" diye seçtirin.",
        "Çevredeki nesnelere bağlayın: \"tabak daireye, pencere kareye benziyor.\"",
      ],
      criterion: "Tipik daire, kare ve üçgeni gösterildiğinde doğru adlandırır ya da adı söylenince doğru olanı seçerse ✓",
      easy: "Aynı anda yalnız iki şekil sunun (daire ↔ kare); en tanıdık örnekleri kullanın.",
      hard: "Üç şekli birlikte sunup hızlı adlandırtın; \"hangisi yuvarlak, hangisi köşeli?\" diye sordurun.",
    },
    tool: "geo",
  },
  { // 3 — Şekil Eşleyici—Daha Çok Şekil, Boyut, Yönelim ve Bileşimler (36–42 ay)
    how: "Çocuk yalnız tek şekilleri değil, birbirine bitişik/bileşik şekilleri (iki üçgenden oluşan bir kare, bir ev biçimi) eşler. Boyut, yönelim ve birleşim değişse de hangi parçanın hangisine denk geldiğini bulur.",
    teacher: "Eşleme repertuarı genişler: çocuk artık daha çok şekli ve şekil BİRLEŞİMLERİNİ karşılaştırabilir. Bu, ileride şekilleri parçalardan kurmanın (kompozisyon) ve tangramın zeminidir. Bileşik şekilde \"hangi parça nereye?\" diye düşünmek, görsel analizin ilk kıvılcımıdır — henüz özellik adı (kenar/açı) yok, ama parça-bütün dikkati başlıyor. Üst üste oturtarak (çakıştırarak) eşlemeyi doğrulatın.",
    act: {
      materials: ["DokunSay Geo şekil blokları (tek + bileşik desenler)", "tangram parçaları", "eşleme tahtası"],
      steps: [
        "İki üçgenden bir kare kurup \"bunun aynısını yap\" deyin.",
        "Aynı deseni farklı boyutta/yönelimde sunup eşletin.",
        "Çocuk parçaları çakıştırarak \"tıpatıp oturuyor mu?\" diye denetlesin.",
        "Bir \"ev\" (kare + üçgen) deseni verip parça parça eşletin.",
      ],
      criterion: "Çeşitli boyut/yönelimdeki tek ve bileşik şekilleri, parçaları doğru denkleyerek eşlerse ✓",
      easy: "İki parçalı basit desenler (yalnız iki üçgen) ve aynı yönelimle çalışın.",
      hard: "Üç-dört parçalı desenler; bir parçayı döndürmeden oturmayacak şekilde sunun.",
    },
    tool: "geo",
  },
  { // 4 — Şekil Tanıyıcı—Daire, Kare, Üçgen (48–54 ay) ★ DARBOĞAZ
    how: "Çocuk yalnız tipik değil, ATİPİK örnekleri de tanır: çok ince ya da eğik (yana yatmış) bir üçgeni de \"üçgen\" der; uzunca ya da köşesi yukarı bakan bir kareyi yine \"kare\" diye adlandırır. Henüz oturmamışsa eğik/ince üçgeni \"hayır, o üçgen değil\" diye reddeder, yalnız çatı gibi duranı kabul eder.",
    teacher: "Bu yörüngenin asıl darboğazıdır ve geometride en yaygın yanılgının (\"yalnız tipik/dik duran şekli tanıma\") aşıldığı yerdir. Çocuk prototip görüntüden ÖZELLİĞE geçmeye başlar: \"üç kenarı ve üç köşesi olan her şey üçgendir — ince de olsa, eğik de olsa.\" Atipik örnek görünce \"saymadan, kenarlarına bak: kaç kenar var?\" diye yönlendirin. Bol bol \"şekil değil\" karşı-örnek de (yuvarlak köşeli, açık/kapanmamış figür) gösterin ki tanım keskinleşsin. Bu geçişte süreğen takılma — eğik üçgeni inatla reddetme — erken bir geometri/uzamsal güçlük işareti olabilir; ada değil, özelliğe bakma alışkanlığını kurun.",
    act: {
      materials: ["DokunSay Geo şekil blokları (ince/eğik/atipik üçgen ve kareler + bir daire)", "geoboard ve lastikler", "karşı-örnek kartları (köşeleri yuvarlatılmış, açık figürler)"],
      steps: [
        "İnce ve eğik bir üçgen gösterip \"bu üçgen mi?\" diye sorun; reddederse kenarlarını birlikte sayın: \"bir, iki, üç — üç kenar, demek üçgen.\"",
        "Köşesi yukarı dönük (baklava gibi duran) kareyi gösterip \"yine kare: dört eşit kenar\" deyin.",
        "Geoboard'da lastikle eğik bir üçgen gerdirip \"yatırdık ama hâlâ üçgen\" diye duruştan bağımsızlığı yaşatın.",
        "Bir \"üçgen değil\" (yuvarlak köşeli ya da açık) karşı-örnek sunup \"neden değil?\" diye söyletin.",
      ],
      criterion: "Atipik (ince/eğik/döndürülmüş) daire, kare ve üçgeni de doğru tanır; bir karşı-örneğin neden o şekil olmadığını kenar/köşeyle gerekçelendirirse ✓",
      easy: "Önce hafifçe eğik örneklerle başlayın; her tanımada kenarları birlikte sayıp ada bağlayın.",
      hard: "Çok ince/çok eğik örnekler ve aldatıcı karşı-örnekler (dört kenarlı ama eşit olmayan) karıştırın.",
    },
    tool: "geo",
  },
  { // 5 — Parçalardan Şekil Kurucu—Benzeyen (48–54 ay)
    how: "Çocuk çubuk parçalarından ya da tangramdan \"bir üçgene benzeyen şekil yap\" dendiğinde üç çubuğu kabaca üçgen olacak biçimde birleştirir. Sonuç tam düzgün olmasa da hedefin genel görüntüsünü (siluet) yakalar.",
    teacher: "Bu, tanımanın yanına ÜRETMEYİ koyar: çocuk bir şekli sıfırdan, parçalardan oluşturur — ama henüz \"benzeyen\" düzeyinde, yani kenar/açı tamlığı aranmadan. Van Hiele görsel düzeyiyle tutarlı olarak hedef, genel biçimi kurmaktır. Kurarken \"kaç çubuk lazım?\" diye sordurmak özellik farkındalığını sezdirir, ama tamlık ısrarını sonraki düzeylere bırakın. Kapalı bir figür kurmayı (uçların birleşmesi) vurgulayın.",
    act: {
      materials: ["DokunSay Geo çubuk parçaları (eşit + farklı uzunlukta)", "tangram parçaları", "hedef şekil kartı (üçgen/kare silueti)"],
      steps: [
        "\"Üçgene benzeyen bir şekil yap\" deyin; çocuk çubukları kabaca birleştirsin.",
        "Uçlar açık kaldıysa \"köşeler birleşsin, kapansın\" diye yönlendirin.",
        "\"Kaç çubuk kullandın?\" diye sorup üçü fark ettirin.",
        "Tangramla bir kareye benzeyen şekli iki üçgenden kurdurun.",
      ],
      criterion: "Parçalardan, hedef şekle (üçgen/kare) genel olarak benzeyen kapalı bir şekil kurarsa ✓",
      easy: "Eşit uzunlukta hazır çubuklar verip yalnız uçları birleştirmesini isteyin.",
      hard: "Farklı uzunlukta çubuklar ya da daha çok kenarlı hedef (dikdörtgen) verin.",
    },
    tool: "geo",
  },
  { // 6 — Şekil Tanıyıcı—Tüm Dikdörtgenler (48–60 ay)
    how: "Çocuk yalnız tipik (geniş, dik duran) dikdörtgeni değil; çok uzun-ince olanı, eğik duranı ve hatta kareyi de \"dikdörtgen\" diye tanır. \"Hangileri dikdörtgen?\" sorusunda dört dik köşeli olanların hepsini seçer.",
    teacher: "Burada şekil sınıfı tipik örnekten KAPSAYICI tanıma genişler: bir dikdörtgen, \"dört dik açısı (köşesi) olan, karşılıklı kenarları eşit\" her şeydir — uzun olsun, eğik olsun. Yaygın yanılgı, yalnız \"televizyon gibi\" oranlı olanı dikdörtgen sayıp ince/uzun ya da kare olanı dışlamaktır. Çocuğu köşelerin diklik özelliğine bakmaya yöneltin (\"köşeleri kapı köşesi gibi mi?\"). Bu, ileride \"kare de bir dikdörtgendir\" sınıf ilişkisinin tohumudur.",
    act: {
      materials: ["DokunSay Geo şekil blokları (uzun/ince/eğik dikdörtgenler + birkaç kare + bir paralelkenar)", "geoboard ve lastikler", "köşe denetimi için küçük bir dik açı şablonu (kart köşesi)"],
      steps: [
        "Karışık dörtgenleri yayıp \"hangileri dikdörtgen?\" deyin.",
        "Her seçtiğinin köşesini kart köşesiyle denetletin: \"köşe tam dik mi?\"",
        "Çok uzun-ince bir dikdörtgeni gösterip \"bu da dikdörtgen mi?\" diye yoklayın.",
        "Köşeleri dik OLMAYAN paralelkenarı sunup \"neden değil?\" diye söyletin.",
      ],
      criterion: "Uzun, ince, eğik dikdörtgenleri (köşeleri eğik paralelkenarı dışlayarak) tutarlı tanırsa ✓",
      easy: "Yalnız belirgin dik açılı örneklerle çalışın; paralelkenarı karıştırmayın.",
      hard: "Kareyi ve çok ince dikdörtgeni dâhil edip \"kare de dikdörtgen mi?\" tartışmasını başlatın.",
    },
    tool: "geo",
  },
  { // 7 — Kenar Tanıyıcı (48–60 ay)
    how: "Çocuk bir şeklin kenarlarını ayrı ayrı parmağıyla gösterip \"bir kenar, iki kenar, üç kenar\" diye sayar; üçgende 3, karede 4 kenar bulur. Kenarı şeklin bir \"parçası\" (düz kenar çizgisi) olarak ayırt eder.",
    teacher: "Bu, Van Hiele'nin analitik (1.) düzeyine ilk somut adımdır: şekil artık bütün bir görüntü değil, sayılabilir PARÇALARDAN (kenarlardan) oluşur. Kenarları sayarken her kenarı bir kez sayma (birebir eşleme), köşeden başlayıp köşede bitirme önemlidir — yoksa çocuk bir kenarı iki kez ya da hiç saymaz. Burada henüz köşe ayrı bir kavram değildir; o, sonraki köşe-tanıyıcı düzeyde gelir. Parmakla kenar boyunca kaydırarak \"düz çizgi = bir kenar\" hissini kurun.",
    act: {
      materials: ["DokunSay Geo şekil blokları (üçgen, kare, beşgen)", "geoboard (kenarları lastikle belirgin)", "kenarları işaretlemek için küçük etiketler/boncuklar"],
      steps: [
        "Bir üçgen verip \"kenarlarını göster ve say\" deyin; her kenara parmağı boyunca kaydırsın.",
        "Her saydığı kenara bir etiket koysun ki iki kez saymasın.",
        "Kareye geçip dört kenarı saydırın; \"kenar = düz çizgi\" deyin.",
        "Geoboard'da bir şekil gerdirip kaç lastik-kenar olduğunu saydırın.",
      ],
      criterion: "Bir şeklin kenarlarını ayrı nesneler olarak tanıyıp her birini bir kez sayarak doğru sayıyı bulursa (üçgen 3, kare 4) ✓",
      easy: "Az kenarlı şekille (üçgen) ve her kenarı işaretleyerek başlayın.",
      hard: "Beşgen/altıgen gibi çok kenarlı şekilleri saydırın; başlangıç köşesini işaretlemeden.",
    },
    tool: "geo",
  },
  { // 8 — Çoğu Özelliği Karşılaştırıcı (48–60 ay)
    how: "Çocuk iki şekli yan yana koyup özellik özellik karşılaştırır: \"bunun 3 kenarı var, bunun 4; bunun köşeleri sivri, bunun dik.\" Tek bir görünüme değil, birkaç özelliğe (kenar sayısı, köşe türü, kenar uzunluğu) bakarak benzerlik ve farkı söyler.",
    teacher: "Bu düzey analitik düşünmeyi pekiştirir: karşılaştırma artık \"ikisi de köşeli\" gibi kaba değil, ÇOK ÖZELLİKLİdir. Burada sık karışıklık \"köşe sayısı = kenar sayısı\" eşitliğini fark etmeden ayrı ayrı sayma ya da bir özelliği unutmadır — karşılaştırmayı bir kontrol listesi gibi (kenar? köşe? uzunluk?) yürütmek bunu önler. Çocuğu \"neresi aynı, neresi farklı?\" diye iki yönlü düşündürün; bu, sınıflama ve tanımın zeminidir.",
    act: {
      materials: ["DokunSay Geo şekil blokları (kare ↔ üçgen, kare ↔ dikdörtgen çiftleri)", "karşılaştırma için iki tepsi/halka", "özellik kartları (kenar / köşe / uzunluk simgeleri)"],
      steps: [
        "Kare ile üçgeni yan yana koyup \"neresi aynı, neresi farklı?\" diye sorun.",
        "Özellik kartlarını sırayla kullanın: \"önce kenar sayısı… sonra köşeler… sonra kenar uzunlukları.\"",
        "Kare ile dikdörtgeni karşılaştırıp \"çok benziyorlar — tek fark ne?\" dedirtin (kenar uzunlukları).",
        "Çocuk bulgularını \"bunun şu var, bunun yok\" diye cümleyle söylesin.",
      ],
      criterion: "İki şekli birden çok özniteliğe (kenar sayısı, köşe türü, kenar uzunluğu) göre karşılaştırıp benzerlik ve farkları söylerse ✓",
      easy: "Çok farklı bir çift (daire ↔ kare) ve tek bir özellikten başlayın.",
      hard: "Çok benzer çift (kare ↔ dikdörtgen, kare ↔ baklava) verip ayırt edici özelliği buldurun.",
    },
    tool: "geo",
  },
  { // 9 — Köşe (Açı) Tanıyıcı (48–60 ay)
    how: "Çocuk bir şeklin köşelerini parmağıyla tek tek gösterip sayar: üçgende 3, karede 4 köşe. Köşeyi, iki kenarın \"birleşip döndüğü\" sivri/keskin nokta olarak kenardan ayrı bir nesne diye tanır.",
    teacher: "Köşe (açı), kenardan ayrı bir özellik olarak burada belirir — analitik düzeyin ikinci yapı taşı. En kritik yanılgı tam buradadır: çocuklar sık sık KENAR ile KÖŞEYİ karıştırır ya da \"köşe sayısı kenar sayısıyla neden aynı?\" bağını kuramaz. Köşeyi \"iki kenarın buluştuğu dönüş\" diye somutlaştırın; bir kenardan diğerine parmakla dönerek \"işte burada döndük — bu bir köşe\" deyin. Çokgenlerde köşe sayısı = kenar sayısı olduğunu birlikte sayıp keşfettirmek, sonraki karşılaştırma ve tanım düzeylerini güçlendirir.",
    act: {
      materials: ["DokunSay Geo şekil blokları (üçgen, kare, beşgen)", "geoboard", "köşeleri işaretlemek için renkli boncuk/etiket"],
      steps: [
        "Bir kareyi verip \"köşeleri göster\" deyin; her köşeye (iki kenarın buluştuğu sivri noktaya) boncuk koysun.",
        "Bir kenardan komşusuna parmakla döndürüp \"döndüğümüz nokta = köşe\" deyin.",
        "Köşeleri ve sonra kenarları ayrı ayrı saydırıp \"ikisi de dört — neden?\" diye keşfettirin.",
        "Üçgen ve beşgende köşe-kenar eşitliğini birlikte doğrulayın.",
      ],
      criterion: "Bir şeklin köşelerini kenarlardan ayrı nesneler olarak tanıyıp doğru sayar; köşe ile kenarı karıştırmazsa ✓",
      easy: "Az köşeli şekille (üçgen) ve her köşeyi işaretleyerek başlayın.",
      hard: "Çok köşeli şekiller (beşgen/altıgen) ve içbükey bir şekil ekleyip köşeyi yine ayırt ettirin.",
    },
    tool: "geo",
  },
  { // 10 — Şekil Tanıyıcı—Daha Çok Şekil (60–66 ay)
    how: "Çocuk daire/kare/üçgenin ötesine geçer: altıgeni, baklavayı (eşkenar dörtgen) ve yamuğu gösterince adlandırır ya da adı söylenince doğru olanı seçer. Daha az tanıdık bu şekilleri de bir bütün görüntü olarak tanır.",
    teacher: "Şekil dağarcığı genişler; bu, hem görsel tanımayı hem de adların özelliklerle bağını besler. Baklava ile kareyi (ikisi de dört eşit kenarlı, ama köşeler farklı) ya da yamuğu (yalnız bir çift paralel kenar) ayırt ederken çocuk özelliklere dönmek zorunda kalır — bu sağlıklıdır. Adları yalnız tipik duruşta değil, döndürülmüş olarak da tanıttırın (baklava aslında \"yan yatmış kare değildir\" tartışması verimlidir). Her yeni şekli kenar/köşe sayısıyla birlikte adlandırın.",
    act: {
      materials: ["DokunSay Geo şekil blokları (altıgen, baklava/eşkenar dörtgen, yamuk + tanıdıklar)", "şekil adı kartları", "pattern-block (örüntü blokları) seti"],
      steps: [
        "Altıgeni gösterip \"kaç kenarı var? — adı altıgen\" diye kenar sayısına bağlayın.",
        "Baklava ile kareyi yan yana koyup \"ikisi de dört kenar — farkı ne?\" dedirtin (köşeler).",
        "Yamuğu gösterip paralel kenar çiftini parmakla izletin.",
        "Şekilleri döndürerek aynı adları farklı duruşta tanıttırın.",
      ],
      criterion: "Altıgen, baklava (eşkenar dörtgen) ve yamuk gibi daha az bilinen şekilleri doğru adlandırır ya da seçerse ✓",
      easy: "Aynı anda yalnız bir yeni şekli (altıgen) tanıdıklarla karıştırın.",
      hard: "Üç yeni şekli birden ve döndürülmüş duruşlarda sunup adlandırtın.",
    },
    tool: "geo",
  },
  { // 11 — Şekil Belirleyici (72–78 ay)
    how: "Çocuk oval, yamuk, sekizgeni karıştırıp gösterince hatasız adlandırır; dik üçgeni eğik/eşkenardan, paralelkenarı dikdörtgenden özelliklerine bakarak ayırt eder. Artık şekli yalnız \"şuna benziyor\" diye değil, \"şu özellikleri taşıyor\" diye belirler.",
    teacher: "Bu, görselden analitiğe geçişin sağlamlaştığı düzeydir: çocuk şekilleri özellikleriyle (kenar sayısı, paralellik, açı türü) güvenle belirler. Oval ↔ daire, paralelkenar ↔ dikdörtgen gibi yakın çiftlerde ayırt edici özelliği söyleyebilmesi kazanımdır. \"Nasıl bildin?\" diye sorup gerekçeyi (\"köşeleri dik değil, o yüzden paralelkenar\") dile döktürün. Bu, tanım yapma ve sınıf ilişkilerine (sonraki düzeyler) doğrudan hazırlıktır.",
    act: {
      materials: ["DokunSay Geo şekil blokları (oval, yamuk, sekizgen, dik üçgen, paralelkenar, dikdörtgen)", "özellik kontrol kartları", "geoboard"],
      steps: [
        "Karışık seti yayıp her şekli sırayla adlandırtın; \"nasıl bildin?\" diye gerekçe isteyin.",
        "Paralelkenar ile dikdörtgeni ayırt ettirin: \"köşeler dik mi?\" diye denetletin.",
        "Dik üçgeni eşkenar üçgenden ayırın: \"hangi köşe kapı köşesi gibi?\"",
        "Oval ile daireyi karşılaştırıp \"yuvarlak ama her yanı aynı mı?\" dedirtin.",
      ],
      criterion: "Yakın şekilleri (oval/daire, paralelkenar/dikdörtgen, dik/eşkenar üçgen) özelliklerine dayanarak hatasız belirler ve gerekçelendirirse ✓",
      easy: "Aldatıcı çiftleri ayırıp belirgin örneklerle çalışın; gerekçeyi siz başlatın.",
      hard: "Çok benzer çiftleri bir arada ve döndürülmüş sunup tek ayırt edici özelliği söyletin.",
    },
    tool: "geo",
  },
  { // 12 — Açı Tanıyıcı—Daha Çok Bağlam (84–90 ay)
    how: "Çocuk açıyı yalnız şekil köşesinde değil; bir yol kavşağında, bir merdiven/çatı eğiminde ya da iki çubuğun açılışında da fark eder. \"Burada açı var mı?\" sorusunda iki kenarın/ışının bir noktada açı oluşturduğu her durumu gösterir.",
    teacher: "Açı kavramı şekil köşesinden GENEL bir ilişkiye taşınır: açı, iki ışının (kenarın) bir köşede yaptığı \"açılma/dönme\" miktarıdır ve kavşak, eğim, dönüş gibi pek çok bağlamda vardır. Sık yanılgı, açıyı yalnız sivri bir köşe sanmak ya da açının büyüklüğünü kenar uzunluğuyla karıştırmaktır (uzun kenarlı açı \"daha büyük\" sanılır). Farklı bağlamlarda \"açıklık ne kadar?\" diye sordurup kenar uzunluğundan bağımsızlığını vurgulayın. Bu, ileride açı ölçmenin zeminidir.",
    act: {
      materials: ["DokunSay Geo açı çubukları (menteşeli/iki kollu)", "bağlam kartları (kavşak, çatı, saat ibreleri, merdiven)", "geoboard"],
      steps: [
        "Menteşeli iki çubuğu açıp kapayın: \"açıklık değişti — bu açı.\"",
        "Bağlam kartlarında \"burada açı var mı, nerede?\" diye gösterttirin (kavşak, çatı).",
        "Aynı açıklığı kısa ve uzun kollarla yapıp \"açı aynı mı?\" dedirtin (kenar uzunluğu açıyı değiştirmez).",
        "Geoboard'da farklı açıklıkta köşeler kurup \"hangisi daha geniş?\" diye karşılaştırtın.",
      ],
      criterion: "Açıyı şekil köşesi dışındaki bağlamlarda (kavşak, eğim, dönüş) da tanır ve açıklığı kenar uzunluğundan bağımsız değerlendirirse ✓",
      easy: "Yalnız belirgin köşe/kavşak bağlamlarıyla başlayın; menteşeli çubukla somutlaştırın.",
      hard: "Çok geniş (yayık) ve çok dar açıları ile uzun/kısa kollu aldatıcı örnekleri karıştırın.",
    },
    tool: "geo",
  },
  { // 13 — Şekil Parçaları Belirleyici (84–90 ay)
    how: "Çocuk bir şekli \"parçalarına göre tarif et\" dendiğinde bileşenleriyle anlatır: \"dört kenarı var, hepsi eşit, dört köşesi dik — bu bir kare.\" Şekli tek bir adla değil, taşıdığı kenar ve açı özelliklerinin listesiyle belirler.",
    teacher: "Bu, Van Hiele analitik düzeyinin olgun hâlidir: şekil = özelliklerinin toplamı. Çocuk artık \"kare, köşeli olan\" demez; kenar sayısı, kenar eşitliği ve açı türünü ayrı ayrı söyler. Tarif ederken hem kenarları hem köşeleri eksiksiz anması (ve ikisini karıştırmaması) kazanımdır. \"Sadece bu özelliklerle başka şekil olur mu?\" diye sordurmak, tanımın yeterliliği fikrini (sonraki sınıf düzeyleri) sezdirir. Tarifi bir \"bilmece\" oyununa çevirin: özelliklerden şekli buldurun.",
    act: {
      materials: ["DokunSay Geo şekil blokları (kare, dikdörtgen, eşkenar/ikizkenar üçgen, yamuk)", "özellik simge kartları (kenar/köşe/eşitlik)", "perde/torba (görmeden tarif için)"],
      steps: [
        "Bir şekli verip \"parçalarıyla anlat: kaç kenar, nasıl köşeler?\" deyin.",
        "Tarifini kartlarla işaretletin (kenar sayısı + eşitlik + açı türü).",
        "Tersine çevirin: siz özellikleri söyleyin, çocuk şekli bulsun (\"üç kenar, biri dik — hangisi?\").",
        "Torbadaki bir şekli yalnız dokunarak parçalarıyla tarif ettirin.",
      ],
      criterion: "Bir şekli kenar sayısı, kenar eşitliği ve açı/köşe türü gibi bileşenleriyle eksiksiz ve karıştırmadan tarif ederse ✓",
      easy: "Az özellikli şekille (üçgen) ve özellikleri tek tek sorarak başlayın.",
      hard: "Tarifi yalnız sözle (blok görmeden) ya da bir özelliği eksik verip \"hangi şekiller olabilir?\" diye açımlayın.",
    },
    tool: "geo",
  },
  { // 14 — Çakışıklık Üst Üste Koyucu (84–90 ay)
    how: "Çocuk iki şeklin \"tıpatıp aynı\" (eş/çakışık) olup olmadığını üst üste koyarak sınar: birini diğerinin üstüne kaydırıp/döndürüp tam örtüşürse \"aynı\", bir kenar taşarsa \"farklı\" der. Denkliği gözle tahmin etmek yerine fiziksel olarak çakıştırarak doğrular.",
    teacher: "Çakışıklık (eşlik), iki şeklin biçim ve büyüklükçe özdeş olmasıdır; bunu üst üste koyma yöntemiyle test etmek somut ve güçlüdür. Sık yanılgı, yalnız aynı ada sahip iki şekli (iki üçgen) boyut farkına rağmen \"aynı\" sanmaktır — çakıştırma bu hatayı görünür kılar. Çocuğun şekli kaydırma/döndürmeyle oturtması, ileride çakışıklığı dönüşümle TEMSİL etmenin (sonraki düzey) elle yapılan hâlidir. \"Tam oturdu mu, taşan var mı?\" diye kenar kenar denetletin.",
    act: {
      materials: ["DokunSay Geo şeffaf/üst üste konabilen şekil parçaları (eş + benzer-ama-farklı çiftler)", "geoboard", "ışıklı masa veya pencere camı (üst üste görmek için)"],
      steps: [
        "İki eş üçgeni verip \"tıpatıp aynı mı?\" diye sorun; üst üste koydurun.",
        "Tam örtüşmek için birini döndürmesi/kaydırması gerekebilir — bunu yapsın.",
        "Sonra aynı şekilli ama biraz büyük bir parça sunup çakıştırınca taşmayı gösterttirin.",
        "Geoboard'da iki şekil kurup birini ötekinin üstüne taşıyarak denkliği sınatın.",
      ],
      criterion: "İki şekli üst üste koyup (gerekirse döndürerek) tam örtüşüp örtüşmediğine göre çakışık (eş) olup olmadıklarını doğru belirlerse ✓",
      easy: "Aynı yönelimdeki açık eş/farklı çiftlerle başlayın; döndürme gerektirmeyin.",
      hard: "Eşi yalnız döndürünce/yansıtınca oturan çiftler ve çok az farklı (1 birim) ikizler verin.",
    },
    tool: "geo",
  },
  { // 15 — Parçalardan Şekil Kurucu—Tam (84–90 ay)
    how: "Çocuk \"dört eşit kenarlı, dört dik köşeli bir şekil yap\" gibi bileşen bilgisiyle bir şekli TAM doğrulukta kurar: geoboard'da kenarları eşitler, köşeleri dikleştirir; \"benzeyen\" değil, ölçütleri karşılayan şekli üretir.",
    teacher: "Bu, kompozisyonun olgun hâlidir ve 5. düzeydeki \"benzeyen kurma\"dan ayrılır: artık hedef genel siluet değil, ÖZELLİK ölçütlerini sağlamaktır (eşit kenar, dik açı, doğru kenar sayısı). Çocuk kurarken kendi işini denetlemeli — \"kenarlar gerçekten eşit mi, köşeler dik mi?\" Bu, tanımı bir YAPIM REÇETESİ gibi kullanmaktır ve analitik düşünmenin üretime dökülmesidir. Eksik/yanlış kurarsa hangi özelliğin tutmadığını birlikte bulun.",
    act: {
      materials: ["DokunSay Geo geoboard ve lastikler", "çubuk parçaları (eşit uzunlukta birimler)", "yapım kartları (kenar sayısı + eşitlik + açı ölçütleri)", "dik açı şablonu"],
      steps: [
        "\"Dört eşit kenar, dört dik köşe\" kartını verip geoboard'da kurdurun.",
        "Kurduğunu denetletin: kenarları birim birim sayıp eşitliği, köşeleri şablonla dikliği doğrulasın.",
        "\"Üç kenar, biri dik\" gibi bir dik üçgen ölçütü verin.",
        "Yanlış kurarsa \"hangi özellik tutmadı?\" diye kendisi bulup düzeltsin.",
      ],
      criterion: "Verilen kenar/açı ölçütlerini (eşit kenar, dik köşe, doğru kenar sayısı) sağlayacak biçimde bir şekli tam doğrulukta kurar ve kendi işini denetlerse ✓",
      easy: "Tek ölçütlü hedeflerle (yalnız \"üç kenar\") ve geoboard ızgara desteğiyle başlayın.",
      hard: "Çok ölçütlü/aldatıcı hedefler (\"dört kenar ama köşeler dik değil\" = paralelkenar) verin.",
    },
    tool: "geo",
  },
  { // 16 — Açı Temsilcisi (96–108 ay)
    how: "Çocuk bir açıyı iki ışın (ortak köşeden çıkan iki kol) ya da bir dönme olarak çizip gösterir: \"buradan başladım, şu kadar döndüm.\" Açıyı sabit bir köşe resmi değil, açılma/dönme miktarı olarak temsil eder.",
    teacher: "Bu düzeyde açı, dinamik bir kavrama dönüşür: iki ışının açıklığı VE bir dönme miktarı. Çocuğun açıyı iki ışınla çizebilmesi ve \"ne kadar döndüğünü\" gösterebilmesi, açı ölçmenin (derece) kavramsal zeminidir. Israrla düzeltilmesi gereken yanılgı, açının kollarının uzunluğunu açının büyüklüğü sanmaktır — kolları uzatıp \"açı değişti mi?\" diye sorun (değişmez). Menteşeli çubuk ve dönen ibre, dönme temsilini somutlaştırır.",
    act: {
      materials: ["DokunSay Geo menteşeli açı çubukları", "dönen ibreli bir disk/saat modeli", "geoboard ve lastikler", "açı çizimi için kâğıt-kalem"],
      steps: [
        "Menteşeli çubuğu bir köşeden açtırın: \"iki kol, bir köşe — bu açı.\"",
        "Aynı açıyı kâğıda iki ışınla çizdirin (ortak başlangıç noktasından).",
        "İbreyi döndürüp \"şu kadar döndüm\" diye açıyı dönme olarak gösterttirin.",
        "Kolları uzatıp \"açı büyüdü mü?\" diye sorun (hayır — yalnız açıklık önemli).",
      ],
      criterion: "Bir açıyı iki ışın ve/veya bir dönme olarak doğru temsil eder; açının büyüklüğünü kol uzunluğundan bağımsız ele alırsa ✓",
      easy: "Belirgin (dik, geniş) açılarla ve menteşeli çubukla başlayın; çizimi siz modelleyin.",
      hard: "Çok dar/çok geniş açılar, dönme yönü (saat yönü/tersi) ve kol uzunluğu aldatmaları ekleyin.",
    },
    tool: "geo",
  },
  { // 17 — Çakışıklık Temsilcisi (96–108 ay)
    how: "Çocuk iki şeklin eş (çakışık) olduğunu artık fiziksel üst üste koymadan, DÖNÜŞÜMLE açıklar: \"bunu döndürürsem ötekine tam oturur\" ya da \"aynaya tutsam (yansıtsam) bu olur.\" Denkliği bir hareket (döndürme/yansıtma/kaydırma) dilinde temsil eder.",
    teacher: "Bu, 14. düzeydeki elle çakıştırmanın ZİHİNSEL/TEMSİLÎ hâlidir: eşlik, bir şekli diğerine taşıyan bir dönüşümle (öteleme, döndürme, yansıma) açıklanır. Çocuğun \"hangi hareket eşler?\" sorusuna cevap vermesi, simetri ve dönüşüm geometrisinin kapısını açar. Yaygın güçlük, yansıma (ayna) ile döndürmeyi karıştırmak ya da bir şeklin ayna görüntüsünün de \"eş\" sayılıp sayılmayacağında tereddüttür. Önce elle yapıp sonra \"gözünde canlandır\" diyerek somuttan zihinsele köprü kurun.",
    act: {
      materials: ["DokunSay Geo şekil parçaları (döndürünce/yansıyınca eşleşen çiftler)", "ayna ya da şeffaf yansıtma plakası", "geoboard", "dönüşüm okları/kartları (döndür / yansıt / kaydır)"],
      steps: [
        "Döndürülmüş iki eş şekli verip \"üst üste koymadan, hangi hareketle oturur?\" diye sorun.",
        "Önce elle döndürüp doğrulayın, sonra \"hareketi\" kartla adlandırsın (döndürme).",
        "Bir şeklin ayna görüntüsünü gösterip \"yansıma — yine eş mi?\" diye tartıştırın.",
        "Geoboard'da bir şekli kaydırarak/döndürerek eşine taşıma planını önceden söyletin.",
      ],
      criterion: "İki eş şeklin denkliğini bir dönüşümle (döndürme/yansıma/öteleme) doğru açıklar ve uygun hareketi adlandırırsa ✓",
      easy: "Yalnız öteleme (kaydırma) ile eşleşen çiftlerle başlayın; hareketi elle gösterin.",
      hard: "Döndürme ve yansımayı ayırt ettirin; ayna-görüntüsü çiftlerinde \"eş mi, değil mi?\" tartıştırın.",
    },
    tool: "geo",
  },
  { // 18 — Şekil Sınıfı Belirleyici (96–114 ay)
    how: "Çocuk \"bütün kareler aynı sınıfa mı girer?\" türü bir soruda, boyut/yönelim ne olursa olsun ölçütü (dört eşit kenar, dört dik köşe) sağlayan her şeklin aynı sınıfa ait olduğunu söyler: \"büyük de küçük de, eğik de olsa hepsi kare.\" Sınıf üyeliğini görünüşe değil, ortak özelliklere bağlar.",
    teacher: "Bu, görsel düzeyden tam analitiğe geçişin meyvesidir: bir ŞEKİL SINIFI, ortak özellikleri paylaşan tüm örneklerin kümesidir — tek bir prototip değil. Çocuğun \"şu da kare, çünkü ölçütü sağlıyor\" diyebilmesi, prototip-bağımlı düşünceyi (yalnız tipik kareyi kare sanma) aşar. Bir sınıfın TÜM üyelerini (atipikler dâhil) ve bir KARŞI örneği (ölçütü sağlamayan) ayırt ettirin. Bu, bir sonraki adımda özellik-tabanlı sınıf hiyerarşisine (kare ⊂ dikdörtgen) zemin hazırlar.",
    act: {
      materials: ["DokunSay Geo şekil blokları (aynı sınıfın çok çeşitli örnekleri: küçük/büyük/eğik kareler + karşı örnekler)", "sınıflama halkaları/kutuları", "özellik ölçüt kartı"],
      steps: [
        "Çeşitli kareleri (büyük, küçük, eğik) ve birkaç dörtgeni yayın: \"hepsini sınıfına ayır.\"",
        "Her kareyi ölçütle (dört eşit kenar + dört dik köşe) gerekçelendirerek halkaya koysun.",
        "Bir dikdörtgeni/baklavayı sunup \"bu kare sınıfına girer mi? neden?\" diye sorun.",
        "\"Kare sınıfının tüm üyelerinde ortak olan ne?\" diye sınıf tanımını söyletin.",
      ],
      criterion: "Bir şekil sınıfının üyelerini (boyut/yönelim farkına rağmen) ortak özelliklerle doğru belirler ve karşı örnekleri ölçütle dışlarsa ✓",
      easy: "Belirgin örneklerle ve tek sınıfla (yalnız kareler ↔ kare-olmayanlar) başlayın.",
      hard: "Birden çok sınıfı (kare/dikdörtgen/baklava) aynı anda ve aldatıcı örneklerle ayırttırın.",
    },
    tool: "geo",
  },
  { // 19 — Şekil Özelliği Belirleyici (96–120 ay)
    how: "Çocuk bir şeklin tek tek özelliklerini açıkça ve genel ifadeyle söyler: \"dikdörtgenin karşılıklı kenarları eşittir ve birbirine paraleldir; bütün köşeleri diktir.\" Bir örnekteki gözlemi o şekil sınıfının GENEL bir özelliği olarak dile getirir.",
    teacher: "Burada çocuk tek bir şekilden o şeklin SINIFINA ait genellenebilir özellikleri çıkarır — \"bu dikdörtgende eşit\" değil, \"dikdörtgenlerde karşılıklı kenarlar eşittir.\" Bu, tümevarımlı genelleme ve resmî tanıma giden yoldur. Özelliği yalnız tek örnekte doğrulamak yetmez; birkaç farklı dikdörtgende sınatıp \"hep böyle mi?\" diye genellettirin. Karşılıklılık (karşılıklı kenarlar/köşeler) ve paralellik gibi ilişkisel özellikleri vurgulayın; bunlar bir sonraki özellik-sınıfı (hiyerarşi) düzeyinin yapı taşıdır.",
    act: {
      materials: ["DokunSay Geo şekil blokları (çeşitli dikdörtgen/paralelkenar/eşkenar üçgen örnekleri)", "geoboard ve lastikler", "özellik ifade kartları (eşit kenar / paralel / dik açı / karşılıklı)"],
      steps: [
        "Bir dikdörtgen verip \"özelliklerini söyle\" deyin; karşılıklı kenar eşitliğini parmakla göstersin.",
        "Aynı özelliği iki-üç farklı dikdörtgende sınatıp \"hep böyle mi?\" diye genellettirin.",
        "Paralelliği geoboard'da kenarları izleterek somutlaştırın.",
        "\"Eşkenar üçgenin özelliği ne?\" diye başka bir sınıfta da genel özellik söyletin.",
      ],
      criterion: "Bir şekil sınıfının özelliklerini (karşılıklı kenarlar eşit/paralel, açılar dik vb.) açıkça ve birden çok örnekte genelleyerek söylerse ✓",
      easy: "Tek bir özelliğe (yalnız kenar eşitliği) odaklanıp tek örnekte doğrulatın.",
      hard: "İlişkisel özellikleri (paralellik, karşılıklılık) ve birden çok sınıfı birlikte genellettirin.",
    },
    tool: "geo",
  },
  { // 20 — Özellik Sınıfı Belirleyici (96–132 ay)
    how: "Çocuk \"kare bir dikdörtgen midir?\" türü bir soruda özellik-tabanlı akıl yürütür: \"karenin dört dik açısı ve karşılıklı eşit kenarları var — bunlar dikdörtgenin koşulları; öyleyse her kare bir dikdörtgendir.\" Şekilleri ad benzerliğine değil, özellik içeren-içerilen ilişkisine göre sınıflandırır.",
    teacher: "Bu, Van Hiele analitik düzeyinin doruğu ve resmî/çıkarımsal düzeye eşiktir: şekil sınıfları arasındaki HİYERARŞİ (kare ⊂ dikdörtgen ⊂ paralelkenar) özelliklerin kapsanmasından doğar. En inatçı yanılgı, çocukların kare ile dikdörtgeni AYRIK iki kutu sanması (\"kare karedir, dikdörtgen başkadır\") ve bir karenin aynı anda dikdörtgen de olabileceğini reddetmesidir. Özellik listelerini karşılaştırıp \"karenin sahip olduğu her dikdörtgen özelliği var mı?\" diye yürütün; iç içe halkalarla (Venn) kapsamayı görselleştirin. \"Her kare dikdörtgendir ama her dikdörtgen kare değildir\" tek yönlülüğünü vurgulayın.",
    act: {
      materials: ["DokunSay Geo şekil blokları (kare, dikdörtgen, baklava, paralelkenar)", "iç içe sınıflama halkaları (Venn)", "özellik karşılaştırma kartları"],
      steps: [
        "Karenin ve dikdörtgenin özellik listelerini ayrı ayrı çıkartın.",
        "\"Karede, dikdörtgenin tüm özellikleri var mı?\" diye madde madde eşletin.",
        "Sonucu iç içe halkalara yerleştirin: kare halkası, dikdörtgen halkasının İÇİNDE.",
        "\"Her dikdörtgen kare midir?\" diye tersini sorup tek yönlülüğü buldurun.",
      ],
      criterion: "Şekilleri özelliklerinin kapsanmasına göre ilişkilendirir (ör. \"her kare bir dikdörtgendir\") ve ilişkinin tek yönlü olduğunu açıklarsa ✓",
      easy: "Tek bir ilişkiye (kare ↔ dikdörtgen) ve özellik eşlemesine odaklanın; halkalarla gösterin.",
      hard: "Çok katmanlı hiyerarşi (kare ⊂ dikdörtgen/baklava ⊂ paralelkenar ⊂ dörtgen) ve \"baklava dikdörtgen mi?\" gibi aldatıcı sorular ekleyin.",
    },
    tool: "geo",
  },
  { // 21 — Açı Sentezleyici (96–144 ay)
    how: "Çocuk açının üç anlamını — iki ışın arasındaki açıklık (köşe), bir dönme miktarı, ve bir eğim/yatıklık — tek bir bütün kavramda birleştirir; bir köşeyi, bir dönüşü ve bir eğimi \"hepsi açı\" diye aynı ölçüyle (derece) konuşur ve ölçüsünü tartışır.",
    teacher: "Bu en üst geometri düzeyidir: açı kavramının dağınık görünümleri (köşe-açıklığı, dönme, eğim) tek bir bütünleşik fikirde sentezlenir ve ölçülebilir bir nicelik (derece) olarak ele alınır. Bu sentez genellikle güçtür çünkü üç anlam farklı bağlamlarda öğrenilir; çocuğun \"şu köşedeki açı, şu dönüşle aynı açıklık\" diyebilmesi gerçek kavramsal bütünlemedir. Bağlamlar arası eşleştirmeler kurun (saat ibresinin dönüşü = oluşan köşe = eğim); ölçüyü (kaç derece?) hep aynı dilde konuşturun. Bu düzey, çıkarımsal geometriye ve trigonometrik düşünceye köprüdür.",
    act: {
      materials: ["DokunSay Geo menteşeli açı çubukları + dönen ibreli disk + eğim modeli (rampa)", "açıölçer (gönye/iletki)", "bağlamlar-arası eşleştirme kartları (köşe ↔ dönme ↔ eğim)"],
      steps: [
        "Aynı açıklığı üç biçimde kurdurun: menteşeli köşe, ibre dönüşü, rampa eğimi.",
        "\"Üçü de aynı açı mı? Nasıl emin oldun?\" diye açıölçerle ölçtürüp eşitlettirin.",
        "Bir saat ibresinin döndüğü açıyı oluşan köşeyle eşleştirin.",
        "\"Bu açı kaç derece?\" diye her bağlamda aynı ölçü dilini kullandırın.",
      ],
      criterion: "Açının köşe-açıklığı, dönme ve eğim anlamlarını tek bir bütünleşik kavramda birleştirir ve farklı bağlamlardaki açıları aynı ölçüyle (derece) ilişkilendirip tartışırsa ✓",
      easy: "Önce iki anlamı (köşe ↔ dönme) eşleştirin; belirgin (dik/düz) açılarla çalışın.",
      hard: "Üç anlamı birden, alışılmadık açılarla (geniş/çok dar) ve ölçü tahminiyle bütünlettirin.",
    },
    tool: "geo",
  },
]
