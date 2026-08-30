// ════════════════════════════════════════════════════════════════════════
// Karşılaştırma / Sıralama (Comparing/Ordering) — düzey zenginleştirmesi
// Clements & Sarama [LT]² (learningtrajectories.org) çerçevesine sadık.
// ────────────────────────────────────────────────────────────────────────
// 23 düzey: algısal karşılaştırma → eşleyerek karşılaştırma → sayarak
// karşılaştırma → ZİHİNSEL SAYI DOĞRUSU (orantısal/lineer temsil) → sıralama
// ve sıra sayı → basamak değeri karşılaştırma → tahmin stratejileri.
//
// Her nesne: how (nasıl görünür) · teacher (öğretmen notu) ·
//   act { materials[2–4], steps[3–5], criterion (✓), easy, hard } · viz (ops.)
// Araç varsayılanı "bar" (DokunSay Bar: çubuk & pul, dokunsal sayı doğrusu);
// tool yalnız farklıysa yazılır.
//
// PEDAGOJİ NOTU: Düzey 10 ve 14 (Zihinsel Sayı Doğrusu) gerçek darboğazlardır.
// Sıkışık/çarpık bir zihinsel sayı doğrusu, matematik öğrenme güçlüğünün
// (diskalkuli) çekirdek imzasıdır — bu düzeylerde takılma ciddiye alınmalıdır.
// ════════════════════════════════════════════════════════════════════════

export default [
  { // 0 — Karşılaştırma Sezici: Temeller (0–12 ay)
    how: "Bebek, bir yanda 2 oyuncak bir yanda 6 oyuncak görünce belirgin biçimde \"çok\" olan yana daha uzun bakar ya da uzanır. Sayıyı adlandıramaz; ama \"orada daha fazla var\" duygusunu sezer.",
    teacher: "Bu, sayı sözcüğünden önce gelen en erken karşılaştırma sezgisidir (yaklaşık sayı sistemi). Yalnız belirgin oranlar (örneğin 1’e 3) ayırt edilir; yakın çokluklar henüz değil. Amaç saydırmak değil, miktar farkına dikkati uyandırmaktır.",
    act: {
      materials: ["İki tepsi", "Aynı tür, aynı renk büyük nesneler (top, küp)"],
      steps: [
        "Bir tepsiye 2, ötekine 6 nesne koyun; bebeği ikisinin ortasına alın.",
        "\"Bak, burada daha çok var!\" deyin ve fazlası olan yanı gösterin.",
        "Bebeğin bakışını/uzanmasını gözleyin; hangi yana yöneldiğini not edin.",
        "Tepsilerin yerini değiştirip yineleyin (yer değil, çokluk önemli).",
      ],
      criterion: "Belirgin biçimde fazla olan yana tutarlı olarak daha çok bakar/uzanırsa ✓",
      easy: "Farkı abartın (1’e 6).",
      hard: "Farkı azaltın (2’ye 4).",
    },
    viz: { t: "compare", a: 6, b: 2 },
  },
  { // 1 — Erken Karşılaştırma Eşleyicisi (18–30 ay)
    how: "Çocuk, kendi önündeki kurabiyelerle arkadaşınınkini gözüyle kabaca \"eşler\" ve birinde fazla olduğunu fark eder: \"Onunki çok!\" der ya da kendi azını işaret eder. Saymaz; göz kararıyla eşleştirir.",
    teacher: "Burada karşılaştırma, sayı bilgisinden değil EŞLEME sezgisinden doğar: \"benimki kadar var mı?\" Adalet/pay duygusu güçlü bir motivasyon kaynağıdır. Bu erken eşleme, ileride birebir eşleyerek karşılaştırmanın tohumudur.",
    act: {
      materials: ["DokunSay pulları (iki renk)", "İki küçük tabak"],
      steps: [
        "Bir tabağa 2, ötekine 4 pul koyun; \"Hangisinde daha çok?\" diye sorun.",
        "Çocuk göstersin; doğruysa \"Evet, burada daha çok\" diye adlandırın.",
        "Pulları yan yana kabaca eşleştirip fazlalığı birlikte gösterin.",
        "Çokluğu yakınlaştırarak (3’e 4) zorlaştırın.",
      ],
      criterion: "Kabaca eşleyerek, açıkça fazla olan kümeyi tutarlı seçerse ✓",
      easy: "Belirgin fark (2’ye 5) ve pulları büyük tutun.",
      hard: "Yakın çokluk (3’e 4); pulları dağınık dizin.",
    },
    viz: { t: "compare", a: 4, b: 2 },
  },
  { // 2 — Algısal Karşılaştırıcı (24–36 ay)
    how: "Biri en az iki katı olan iki kümeyi (örneğin 2 ile 6) gördüğünde, çoğu olanı saymadan, bir bakışta seçer: \"Bu daha çok!\" Yakın çokluklarda (4 ile 5) ise henüz şaşırır.",
    teacher: "Algısal karşılaştırma, oran belirgin olduğunda (≥2 kat) güvenilirdir; yakın sayılarda değildir. Bu normaldir. Çocuğu yakın çokluklarda zorlamak yerine, belirgin farklarla \"çok/az\" dilini sağlamlaştırın — sayarak karşılaştırmaya zemin hazırlar.",
    act: {
      materials: ["DokunSay pulları/çubukları", "İki tabak ya da iki çubuk yuvası"],
      steps: [
        "İki katı farkla iki küme kurun (2 ile 6) ve kısaca gösterip kapatın.",
        "\"Hangisinde daha çok vardı?\" diye sorun; bakışta seçmesini isteyin.",
        "DokunSay çubuğunda iki yığını yan yana dizip fazlalığı gösterin.",
        "Farkı koruyarak (3 ile 7) birkaç kez yineleyin.",
      ],
      criterion: "Belirgin farklı (≥2 kat) kümelerde çoğu olanı saymadan seçerse ✓",
      easy: "Çok belirgin fark (1 ile 5) ve açık gösterim.",
      hard: "Oranı yakınlaştırın (4 ile 6); gösterimi kısaltın.",
    },
    viz: { t: "compare", a: 6, b: 2 },
  },
  { // 3 — Birinci-İkinci Sıra Sayıcısı (30–40 ay)
    how: "Bir sıraya dizilmiş oyuncaklarda \"birinci\" ve \"ikinci\"yi gösterir: yarış oyununda \"Ben birinci oldum!\" der, ikinciyi de doğru işaret eder. Üçüncü ve sonrası henüz karışabilir.",
    teacher: "Sıra sayıları (sıralamadaki konum) çokluktan farklı bir fikirdir: \"kaç tane\" değil, \"kaçıncı\". \"Birinci/ikinci\" çoğu çocukta günlük dilden (yarış, sıra) önce gelir. Bir başlangıç ucu belirleyip oradan saymak kritiktir — nereden başlandığı değişirse \"birinci\" de değişir.",
    act: {
      materials: ["DokunSay çubuğunda sıralı 3–4 pul", "Küçük bir bayrak/işaret"],
      steps: [
        "Pulları soldan sağa bir sıraya dizin; bir başlangıç ucu belirleyin.",
        "\"Birinci hangisi?\" diye sorun; çocuk göstersin.",
        "\"Peki ikinci?\" diye sürdürün; doğruları adlandırın.",
        "Başlangıç ucunu değiştirip \"Şimdi birinci hangisi oldu?\" diye düşündürün.",
      ],
      criterion: "Bir sırada birinci ve ikinciyi (başlangıç ucuna göre) doğru belirlerse ✓",
      easy: "Yalnız \"birinci\" ile çalışın; sıra kısa (3) olsun.",
      hard: "İkinciyi ekleyin; başlangıç ucunu sık değiştirin.",
    },
    viz: { t: "count", n: 4 },
  },
  { // 4 — Benzer Nesnelerin Erken Karşılaştırıcısı (36–42 ay)
    how: "Yakın ama eşit olmayan iki küme aynı nesnelerden (örneğin 4 ile 5 özdeş düğme) olduğunda, çoğu olanı bulur — çoğunlukla yan yana koyup eşleyerek ya da kısa bir sayma denemesiyle.",
    teacher: "Nesneler aynı/benzer olduğunda karşılaştırma kolaylaşır: çocuk yalnız çokluğa odaklanabilir, biçim/renk farkı dikkatini dağıtmaz. Yakın çoklukların (4 ile 5) ayırt edilmeye başlaması önemli bir ilerlemedir; çocuğu eşlemeye/saymaya yönlendirin.",
    act: {
      materials: ["DokunSay pulları (tek renk, özdeş)", "İki çubuk yuvası ya da tabak"],
      steps: [
        "Aynı pullardan 4 ve 5’lik iki küme yapın.",
        "\"Hangisinde daha çok? Nasıl anladın?\" diye sorun.",
        "Pulları DokunSay çubuğunda alt alta hizalayıp \"fazla olanı\" gösterin.",
        "Çokluğu değiştirip (5 ile 6) yineleyin.",
      ],
      criterion: "Yakın çokluklu, özdeş nesnelerde çoğu olanı eşleyerek/sayarak bulursa ✓",
      easy: "Farkı açın (3 ile 5); pulları hizalı dizin.",
      hard: "Farkı 1’e indirin (5 ile 6); pulları dağınık koyun.",
    },
    viz: { t: "compare", a: 5, b: 4 },
  },
  { // 5 — Farklı Nesnelerin Erken Karşılaştırıcısı (40–46 ay)
    how: "Kümeler farklı nesnelerden olsa bile (örneğin 4 araba ile 6 boncuk) çoğu olanı çokluğa göre seçer; \"araba mı boncuk mu\" değil, \"kaç tane\" diye bakar. Büyük boncuklar az ama yer kaplıyorsa yine de çokluğu seçebilir.",
    teacher: "Bu, önemli bir soyutlamadır: karşılaştırma artık nesnenin türünden ve büyüklüğünden bağımsızlaşır. Sık yanılgı, \"daha çok yer kaplayan = daha çok\" demektir. Az sayıda ama iri nesneyi çoğu sanmak tipiktir; çocuğu teker teker eşlemeye/saymaya çağırın.",
    act: {
      materials: ["İki farklı tür nesne (küçük arabalar; iri boncuklar)", "DokunSay pulları (eşleme için)"],
      steps: [
        "4 araba ile 6 boncuk koyun (boncuklar daha iri ve dağınık olsun).",
        "\"Hangisinden daha çok var?\" diye sorun.",
        "Her arabanın yanına bir boncuk eşleştirip artan boncukları gösterin.",
        "Bilerek \"az ama iri\" kümeyi öne çıkarıp yanıltıcı durumu tartışın.",
      ],
      criterion: "Farklı türden nesnelerde, büyüklük yanıltsa bile çoğu olanı çokluğa göre seçerse ✓",
      easy: "Nesneleri benzer boyda tutun; farkı açın (3 ile 6).",
      hard: "Az olanı çok iri, çoğu olanı küçük yapın (algısal tuzak).",
    },
    viz: { t: "compare", a: 6, b: 4 },
  },
  { // 6 — Eşleyerek Karşılaştırıcı (42–48 ay)
    how: "İki kümeyi birebir eşler: her bardağa bir tabak koyar, eşi kalmayanı görür ve \"bir bardak fazla\" der. Saymadan, eşleşmenin artığıyla çoğu olanı kesin biçimde bulur.",
    teacher: "Birebir eşleme, çokluk karşılaştırmasının altın yöntemidir: sayıyı bilmeden \"hangisi fazla, ne kadar fazla\" sorusunu çözer. Bu beceri, sayma-karşılaştırmaya ve toplama-çıkarmadaki \"fark\" fikrine doğrudan köprüdür. Eşlemeyi gözle görülür kılın (çiftleri yan yana).",
    act: {
      materials: ["DokunSay pulları (iki renk)", "DokunSay çubuğu (eşleme rayı)"],
      steps: [
        "Bir renkten 5, öteki renkten 7 pul verin.",
        "\"Her maviye bir sarı eşle; eşi olmayan kaldı mı?\" deyin.",
        "Eşleri çubukta alt alta dizip artan pulları gösterin.",
        "\"Hangisi fazla? Kaç fazla?\" diye fark fikrini ekleyin.",
      ],
      criterion: "Birebir eşleyip eşi kalmayandan çoğu olanı (ve kaç fazla olduğunu) bulursa ✓",
      easy: "Küçük kümeler (3 ile 4); eşleri hizalı dizin.",
      hard: "Büyük kümeler (6 ile 8); \"kaç fazla?\" sorusunu vurgulayın.",
    },
    viz: { t: "compare", a: 7, b: 5 },
  },
  { // 7 — Sayarak Karşılaştırıcı (Aynı Boyut) (48–52 ay)
    how: "Aynı boyutta iki kümeyi tek tek sayar, sonuçları karşılaştırır: \"Burada 5, burada 6 var; altı daha çok.\" Artık eşlemeye gerek kalmadan iki sayıyı bilip büyüğü söyleyebilir.",
    teacher: "Eşlemeden SAYARAK karşılaştırmaya geçiş büyük bir adımdır: sayı dizisindeki sıranın \"sonraki daha çok\" anlamını taşıdığını kavramaktır. Önce aynı boyutta nesnelerle çalışın (büyüklük yanıltmasın). Sık yanılgı: doğru sayıp ama iki sayıdan hangisinin büyük olduğunu seçememek; sayı dizisini referans alın.",
    act: {
      materials: ["DokunSay pulları (özdeş)", "İki çubuk yuvası"],
      steps: [
        "İki yuvaya 5 ve 6 pul koyun; her birini tek tek saydırın.",
        "\"Kaç oldu? Peki öteki?\" diye iki sonucu söyletin.",
        "\"Hangisi daha çok — beş mi altı mı?\" diye sayıları karşılaştırın.",
        "DokunSay çubuğunda hangisinin daha uzağa ulaştığını gösterin.",
      ],
      criterion: "İki kümeyi sayıp sonuçları karşılaştırarak çoğu olanı doğru söylerse ✓",
      easy: "Fark 2 olsun (4 ile 6); birlikte sayın.",
      hard: "Fark 1 olsun (6 ile 7); sayıları kendi karşılaştırsın.",
    },
    viz: { t: "compare", a: 6, b: 5 },
  },
  { // 8 — Uzamsal Büyüklük Tahmincisi — Küçük/Büyük (48–54 ay)
    how: "Saymadan, bir bakışta \"hangi küme daha büyük/daha kalabalık\" diye kaba bir tahmin yapar: dağınık ama az bir yığınla sıkışık çok bir yığını ayırt etmeye çalışır, bazen yanılır.",
    teacher: "Bu, uzamsal-sayısal sezginin erken biçimidir: \"çok yer kaplıyor\" ile \"çok sayıda\" henüz birbirine karışır. Tahmin değerli bir beceridir; ama tahminden sonra saydırıp kontrol ettirin — sezgiyi gerçek sayıyla kalibre etmek ileride güçlü bir büyüklük duygusu kurar.",
    act: {
      materials: ["DokunSay pulları", "İki tepsi (biri geniş-seyrek, biri dar-sıkışık)"],
      steps: [
        "Bir tepsiye seyrek 6, ötekine sıkışık 9 pul koyun.",
        "\"Saymadan tahmin et: hangisinde daha çok var?\" deyin.",
        "Tahminini söyledikten sonra ikisini de saydırıp karşılaştırın.",
        "\"Tahminin doğru muydu?\" diye sezgisini sonuçla buluşturun.",
      ],
      criterion: "Saymadan büyük/küçük yönünde makul tahmin yapıp sonra sayarak kontrol ederse ✓",
      easy: "Yerleşimi adil tutun; farkı açın (4 ile 9).",
      hard: "Azı seyrek-geniş, çoğu sıkışık yapın (uzamsal tuzak).",
    },
  },
  { // 9 — Sayarak Karşılaştırıcı (5) (48–54 ay)
    how: "5’e kadar olan iki kümeyi güvenle sayar ve büyüğü söyler: \"3 ile 5 — beş daha çok.\" Beşli yapıyı tanıdığı için 5’e dek karşılaştırmalar onun için sağlamdır.",
    teacher: "5 sınırı bilinçli seçilmiştir: çocuğun parmak/beşli çerçeve sezgisiyle örtüşür, böylece sayma-karşılaştırma kararlı çalışır. Bu düzey, hemen ardından gelen \"Zihinsel Sayı Doğrusu — 5’e dek\" darboğazının ön koşuludur. Sayma doğruysa ama karşılaştırma değilse, sayı dizisini sık tekrar edin.",
    act: {
      materials: ["DokunSay pulları", "Beşli çerçeve (1×5)", "İki çubuk yuvası"],
      steps: [
        "İki yuvaya 3 ve 5 pul koyup beşli çerçevede gösterin.",
        "Her birini saydırıp \"kaç?\" sonuçlarını söyletin.",
        "\"Hangisi daha çok?\" diye 5’e dek karşılaştırın.",
        "\"Üçten beşe kaç fazla?\" diye fark fikrini ekleyin.",
      ],
      criterion: "5’e kadar iki kümeyi sayıp doğru karşılaştırırsa (ve farkı söyleyebilirse) ✓",
      easy: "Bir kümeyi hep 5 (dolu çerçeve) tutun.",
      hard: "Fark 1 olsun (4 ile 5); çerçevesiz, dağınık dizin.",
    },
    viz: { t: "compare", a: 5, b: 3 },
  },
  { // 10 — Zihinsel Sayı Doğrusu — 5'e dek (54–60 ay) ★ DARBOĞAZ
    how: "0’dan 5’e bir doğru çizip \"3 nereye gelir?\" diye sorduğunuzda, ortanın biraz sağına, orantılı bir yere koyar. Sayıları yalnız \"daha çok/az\" değil, bir DOĞRU ÜZERİNDEKİ konum olarak düşünmeye başlar.",
    teacher: "Bu yörüngenin ilk gerçek darboğazıdır. Zihinsel sayı doğrusu — sayıların zihinde orantılı, çizgisel bir uzayda yer alması — tüm sayı duygusunun omurgasıdır. SIKIŞIK ya da çarpık bir zihinsel sayı doğrusu (örneğin küçük sayıları çok geniş, büyükleri üst üste yerleştirmek) matematik öğrenme güçlüğünün (diskalkuli) çekirdek imzasıdır. Çocuk 3’ü 5’lik doğruda kabaca ortaya koyamıyorsa, bunu ciddiye alın: DokunSay dokunsal sayı doğrusunda tekrar tekrar \"konum\" deneyimi verin; sayıyı parmakla kaydırarak yere oturtun.",
    act: {
      materials: ["DokunSay sayı doğrusu (0–5, dokunsal)", "DokunSay pulları/çubukları"],
      steps: [
        "0 ve 5 uçlarını gösterip \"Bu doğrunun başı sıfır, sonu beş\" deyin.",
        "\"3 sence nereye gelir?\" diye parmağıyla göstermesini isteyin.",
        "Pulu o noktaya koydurup birlikte 0’dan sayarak yerini doğrulayın.",
        "1, 2, 4 için yineleyin; her birinin doğru üzerinde \"adil\" yerini tartışın.",
      ],
      criterion: "0–5 doğrusunda bir sayıyı (örneğin 3) orantılı, makul bir konuma yerleştirirse ✓",
      easy: "Doğruyu tüm tik işaretleriyle (0,1,2,3,4,5) gösterin.",
      hard: "Yalnız 0 ve 5 ucu işaretli; ara tikleri kaldırıp tahminle yerleştirtin.",
    },
    viz: { t: "numline", max: 5, at: [3], hi: 3 },
  },
  { // 11 — 5'e Dek Sıralayan (Sayı) (54–60 ay)
    how: "1’den 5’e kadar olan kümeleri ya da sayı kartlarını azdan çoğa dizer: 2, 4, 1, 3, 5 kartlarını alıp 1-2-3-4-5 sırasına sokar. \"Önce en az, sonra biraz daha çok…\" diye düşünür.",
    teacher: "Sıralama, ikili karşılaştırmadan bir adım ileridir: birden çok kümeyi aynı anda bir DÜZENE sokmaktır. Bu, zihinsel sayı doğrusunu eyleme döker — her sayı bir öncekinden \"bir fazla\". Sık yanılgı: yalnız iki komşuyu doğru sıralayıp bütünü bozmak. Çocuğu \"en azdan başla, her seferinde bir sonrakini bul\" stratejisine yönlendirin.",
    act: {
      materials: ["DokunSay pulları", "1–5 pul içeren 5 çubuk/kart"],
      steps: [
        "1, 2, 3, 4, 5 pul içeren çubukları karışık verin.",
        "\"En az olandan en çok olana doğru sırala\" deyin.",
        "Her adımda \"şimdi kalanların en azı hangisi?\" diye seçtirin.",
        "Sıralayınca yükselen \"merdiveni\" birlikte sayarak doğrulayın.",
      ],
      criterion: "1–5 arası kümeleri/sayıları azdan çoğa doğru biçimde sıralarsa ✓",
      easy: "Üç kümeyle başlayın (1, 3, 5).",
      hard: "Beş kümeyi çoktan aza (tersten) sıralatın.",
    },
    viz: { t: "numline", max: 5, at: [1, 2, 3, 4, 5] },
  },
  { // 12 — Sıra Sayı Sayıcısı (58–66 ay)
    how: "Bir sırada \"üçüncü\" ve \"dördüncü\"yü doğru gösterir: \"Üçüncü kutuda ne var?\" diye sorduğunuzda baştan sayıp doğru kutuyu açar. Birinci/ikincinin ötesine geçmiştir.",
    teacher: "Sıra sayıları (3., 4., 5.) konumu adlandırır ve baştan sayma gerektirir. Sık karışıklık: \"üçüncü\" (konum) ile \"üç\" (çokluk) arasını ayırt etmek. Ayrıca başlangıç ucu kritiktir — soldan mı sağdan mı sayıldığı sonucu değiştirir. Sıra sözcüklerini günlük rutinlerle (sıradaki sıran, yarış) pekiştirin.",
    act: {
      materials: ["DokunSay çubuğunda sıralı 5 pul", "Küçük bir işaret/bayrak"],
      steps: [
        "Pulları soldan sağa dizin; başlangıç ucunu birlikte belirleyin.",
        "\"Üçüncü pulu göster\" deyin; baştan saymasını isteyin.",
        "\"Dördüncü, beşinci\" diye sürdürün; her birini adlandırın.",
        "\"Üçüncü\" ile \"üç tane\" arasındaki farkı bir örnekle ayırt edin.",
      ],
      criterion: "Bir sırada 3., 4. gibi sıra sayılarını baştan sayarak doğru belirlerse ✓",
      easy: "Sırayı kısa (3–4) tutup birinci/ikinciden başlayın.",
      hard: "Başlangıç ucunu değiştirin; \"sondan ikinci\" gibi sorular ekleyin.",
    },
    viz: { t: "count", n: 5 },
  },
  { // 13 — Sayarak Karşılaştırıcı (10) (60–66 ay)
    how: "10’a kadar iki kümeyi sayar ve büyüğü söyler: \"Burada 7, burada 9 var; dokuz daha çok.\" Onluk çerçeve yardımıyla \"dolu/boş\" okuyarak da hızlı karşılaştırabilir.",
    teacher: "Sayma-karşılaştırma artık 10’a ölçeklenir. Bu, zihinsel sayı doğrusunun 10’a genişleyeceği bir sonraki darboğazın hazırlığıdır. Onluk çerçeveyle çalışmak, \"9, 7’den iki fazla\" gibi fark ilişkilerini görünür kılar. Sayma doğru ama karşılaştırma kararsızsa, sayıların sırasını (hangisi sonra gelir = daha çok) vurgulayın.",
    act: {
      materials: ["DokunSay pulları", "Onluk çerçeve (2×5)", "İki çubuk yuvası"],
      steps: [
        "İki onluk çerçeveye 7 ve 9 pul koyup gösterin.",
        "Her birini saydırın; \"kaç dolu, kaç boş?\" diye okutun.",
        "\"Hangisi daha çok — yedi mi dokuz mu?\" diye karşılaştırın.",
        "\"Dokuz, yediden kaç fazla?\" diye fark ilişkisini ekleyin.",
      ],
      criterion: "10’a kadar iki kümeyi sayıp doğru karşılaştırırsa (farkı da söyleyebilirse) ✓",
      easy: "Fark 2+ olsun (6 ile 9); çerçevede gösterin.",
      hard: "Fark 1 olsun (8 ile 9); çerçevesiz dağınık dizin.",
    },
    viz: { t: "compare", a: 9, b: 7 },
  },
  { // 14 — Zihinsel Sayı Doğrusu — 10'a dek (66–72 ay) ★ DARBOĞAZ
    how: "0’dan 10’a bir doğruda \"7 nereye gelir?\" diye sorduğunuzda, 5’in (ortanın) belirgin biçimde sağına, 10’a yakın ama tam ona değil bir yere koyar. Sayıları orantılı aralıklarla yerleştirir; küçükleri geniş, büyükleri sıkışık koymaz.",
    teacher: "İkinci ve en kritik darboğaz. 0–10 zihinsel sayı doğrusunda ORANTILI (lineer) yerleştirme, okul matematiğinin en güçlü erken yordayıcılarından biridir. Tipik gelişende temsil giderek çizgiselleşir; matematik öğrenme güçlüğünde (diskalkuli) ise doğru sıkışık ya da logaritmik kalır — küçük sayılar arası abartılı, büyükler arası ezilmiş. Çocuk 7’yi 10’luk doğruda 5’in sağına koyamıyor, sayıları orantısız yerleştiriyorsa, DokunSay dokunsal sayı doğrusunda yoğun \"yerleştir-ve-kontrol et\" çalışması yapın; her tahminden sonra 0’dan sayarak gerçek yerle buluşturun.",
    act: {
      materials: ["DokunSay sayı doğrusu (0–10, dokunsal)", "DokunSay pulları"],
      steps: [
        "0 ve 10 uçlarını gösterin; \"5 tam ortada\" diye orta noktayı çıpalayın.",
        "\"7 nereye gelir?\" diye parmağıyla göstertin (ortanın sağına).",
        "Pulu koydurup 0’dan sayarak gerçek konumu birlikte denetleyin.",
        "2, 4, 8, 9 için yineleyin; \"orantılı mı duruyor?\" diye doğruyu okutun.",
      ],
      criterion: "0–10 doğrusunda sayıları (örneğin 7’yi ortanın sağına) orantılı konumlandırırsa ✓",
      easy: "0, 5, 10 noktaları işaretli olsun (çıpa noktaları).",
      hard: "Yalnız 0 ve 10 işaretli; ara çıpaları kaldırıp tahminle yerleştirtin.",
    },
    viz: { t: "numline", max: 10, at: [7], hi: 7 },
  },
  { // 15 — 6+ Sıralayan (Sayı) (66–74 ay)
    how: "6 ve üzeri kümeleri/sayıları sıralar: 8, 6, 10, 7, 9 kartlarını alıp 6-7-8-9-10 düzenine sokar. Sayı dizisini referans alarak \"sonraki hep bir fazla\" mantığıyla ilerler.",
    teacher: "Sıralama aralığı 10’a genişler; bu, 0–10 zihinsel sayı doğrusunun pekişmesini destekler. Daha büyük sayılarda sık yanılgı, basamak/ad benzerliklerinden (yedi/dokuz) ya da yalnız komşu çiftlere bakmaktan doğar. Çocuğu her adımda \"kalanların en azı/en çoğu\" stratejisine ve bütünü baştan kontrol etmeye yönlendirin.",
    act: {
      materials: ["DokunSay pulları", "6–10 pul içeren çubuklar/kartlar"],
      steps: [
        "6, 7, 8, 9, 10 pul içeren çubukları karışık verin.",
        "\"Azdan çoğa sırala\" deyin; gerekiyorsa saydırın.",
        "Her adımda kalanların en azını seçtirin.",
        "Yükselen merdiveni baştan sona sayarak doğrulayın.",
      ],
      criterion: "6 ve üzeri sayıları/kümeleri doğru sıralarsa ✓",
      easy: "Üç kümeyle başlayın (6, 8, 10).",
      hard: "Karışık aralık (4, 7, 6, 9, 10) ve tersten sıralama isteyin.",
    },
    viz: { t: "numline", max: 10, at: [6, 7, 8, 9, 10] },
  },
  { // 16 — Uzamsal Büyüklük Tahmincisi (72–80 ay)
    how: "Bir kavanozdaki ~15–25 boncuğa bakıp \"yaklaşık yirmi var\" gibi incelikli bir tahmin yapar; \"çok/az\"ın ötesinde bir sayıya yaklaşır. Tahminini bir referansla (\"on şöyle görünüyordu\") ayarlayabilir.",
    teacher: "Tahmin artık nicelikli ve daha isabetlidir: çocuk uzamsal yoğunluğu yaklaşık bir SAYIYA çevirir. Bu beceri zihinsel sayı doğrusuna yaslanır — iyi kalibre bir doğru, iyi tahmin demektir. Tahmin sonrası saydırıp \"ne kadar yakındın?\" diye geri bildirim verin; \"vahşi\" tahminleri değil, makul aralığı ödüllendirin.",
    act: {
      materials: ["Şeffaf bir kavanoz/kap", "DokunSay pulları (20+ adet)", "Bir referans kümesi (10’luk)"],
      steps: [
        "Önce 10’luk bir referans gösterin: \"On böyle görünüyor.\"",
        "Kaba ~18 pul koyup \"saymadan tahmin et\" deyin.",
        "Tahminini yazdırın/söyletin, sonra birlikte sayın.",
        "\"Tahminin gerçeğe ne kadar yakındı?\" diye değerlendirin.",
      ],
      criterion: "Saymadan, makul bir aralıkta (örneğin gerçeğin ±%25’i) sayısal tahmin yaparsa ✓",
      easy: "Az sayı (≤12) ve görünür referans bırakın.",
      hard: "Daha çok (25–30) ve referansı kaldırıp düzensiz dizin.",
    },
  },
  { // 17 — Basamak Değeri Karşılaştırıcısı (72–84 ay)
    how: "İki basamaklı iki sayıyı basamak değerine göre karşılaştırır: 34 ile 43’te \"43 daha büyük, çünkü onlukları daha çok\" der. Yalnız rakamlara değil, onluk-birlik yapısına bakar.",
    teacher: "Basamak değeri karşılaştırması, sayı duygusunun onluk sisteme taşınmasıdır: önce onluklar, eşitse birlikler. Klasik yanılgılar: \"daha çok basamak/daha büyük rakam = daha büyük sayı\" (örneğin 19’u 21’den büyük sanmak) ya da yalnız birler basamağına bakmak. DokunSay onluk çubuk + birlik pullarıyla iki sayının onluk yığınlarını yan yana gösterin.",
    act: {
      materials: ["DokunSay onluk çubukları + birlik pulları", "İki basamaklı sayı kartları (34, 43)"],
      steps: [
        "34 ve 43’ü onluk çubuk + birlik pulla kurun.",
        "\"Önce onluklara bak — hangisinde daha çok?\" diye sorun.",
        "Onluklar eşitse birliklere bakma kuralını bir örnekle gösterin (36 ile 32).",
        "\"Hangisi büyük ve neden?\" diye gerekçeyi söyletin.",
      ],
      criterion: "İki basamaklı sayıları önce onluk sonra birlik kuralıyla doğru karşılaştırırsa ✓",
      easy: "Onlukları farklı tutun (24 ile 51) — tek bakışta ayrışsın.",
      hard: "Onlukları eşit yapın (36 ile 32) ya da 19 ile 21 tuzağını sorun.",
    },
    viz: { t: "compare", a: 4, b: 3 },
  },
  { // 18 — Zihinsel Sayı Doğrusu — 100'e dek (84–96 ay)
    how: "0’dan 100’e bir doğruda \"40 nereye gelir?\" diye sorduğunuzda, ortanın (50) biraz soluna, orantılı bir yere koyar. 100’lük aralıkta sayıları çizgisel, dengeli yerleştirir.",
    teacher: "Zihinsel sayı doğrusu onluk ölçeğe taşınır. Orantısal (lineer) yerleştirme burada da güçlü bir başarı yordayıcısıdır; sıkışık/logaritmik temsil hâlâ bir uyarıdır. Çocuk 50’yi orta çıpa olarak kullanmayı öğrenmelidir: \"40, 50’den biraz az.\" DokunSay sayı doğrusunda onluk çıpalarla (0, 50, 100) çalışın.",
    act: {
      materials: ["DokunSay sayı doğrusu (0–100, onluk işaretli)", "DokunSay pulları/işaretçi"],
      steps: [
        "0, 50, 100 çıpalarını gösterip \"50 tam ortada\" deyin.",
        "\"40 nereye gelir?\" diye işaretletin (ortanın biraz soluna).",
        "Onluk tik işaretlerinden sayarak gerçek konumu denetleyin.",
        "70, 25, 90 için yineleyip orantıyı tartışın.",
      ],
      criterion: "0–100 doğrusunda sayıları (örneğin 40’ı 50’nin soluna) orantılı yerleştirirse ✓",
      easy: "Tüm onluk tikler (0,10,…,100) görünür olsun.",
      hard: "Yalnız 0, 50, 100 çıpa; ara tikleri kaldırın.",
    },
    viz: { t: "numline", max: 100, at: [40], hi: 40 },
  },
  { // 19 — Sezgisel Niceleme ile Tarayarak Tahmin (90–100 ay)
    how: "Kalabalık bir kümeyi (örneğin ~60 nesne) gözüyle tarayıp küçük gruplara bölerek tahmin eder: \"Şurada onar onar var gibi, altı grup… altmış kadar.\" Tek tek saymadan yapıyı kullanır.",
    teacher: "Bu, tahminin stratejik biçimidir: \"tara, grupla, ölçekle.\" Çocuk artık rastgele tahmin etmez; bir küçük birim (5’lik/10’luk) seçip onu tekrarlayarak bütüne ölçekler. Bu, çarpımsal düşünme ve örnekleme fikrinin tohumudur. Stratejiyi sesli yaptırın: \"Bir grup ne kadar? Kaç grup var?\"",
    act: {
      materials: ["Çok sayıda DokunSay pulu (50–70)", "Geniş bir tepsi/zemin"],
      steps: [
        "Pulları geniş bir alana dağıtın (sayılamayacak kadar çok görünsün).",
        "\"Bir köşede yaklaşık kaç var?\" diye küçük bir grubu kestirtin.",
        "\"Kaç tane öyle grup var?\" diye bütüne ölçeklettirin.",
        "Tahminden sonra onar onar gruplayıp gerçeğe yaklaştırın.",
      ],
      criterion: "Büyük kümeyi tarayıp gruplayarak (birimi ölçekleyerek) makul tahmin yaparsa ✓",
      easy: "Pulları gevşek 10’luk öbekler hâlinde dizin.",
      hard: "Tümüyle düzensiz dağıtıp daha büyük sayı (80+) kullanın.",
    },
  },
  { // 20 — Zihinsel Sayı Doğrusu — 1000'e dek (96–108 ay)
    how: "0’dan 1000’e bir doğruda \"400 nereye gelir?\" diye sorduğunuzda, ortanın (500) biraz soluna, orantılı yerleştirir. Yüzlük ölçekte de sayıları çizgisel düşünür: \"400, 500’ün biraz altı.\"",
    teacher: "Zihinsel sayı doğrusu yüzlük/binlik ölçeğe genişler. Burada yüzlük çıpalar (0, 500, 1000) ve \"yarısı/çeyreği\" gibi referanslar kritiktir. Sık zorluk: basamak sayısı arttıkça orantı duygusunun bozulması (örneğin 400 ile 40’ı karıştırmak ya da büyük sayıları uca yığmak). DokunSay sayı doğrusunda yüzlük adımlarla çalışın; \"500 yarı yol\" çıpasını içselleştirin.",
    act: {
      materials: ["DokunSay sayı doğrusu (0–1000, yüzlük işaretli)", "DokunSay işaretçisi"],
      steps: [
        "0, 500, 1000 çıpalarını gösterip \"500 tam yarı yol\" deyin.",
        "\"400 nereye gelir?\" diye işaretletin (yarının biraz soluna).",
        "Yüzlük tiklerden sayarak konumu denetleyin.",
        "750, 250, 900 için yineleyip yarım/çeyrek çıpaları kullanın.",
      ],
      criterion: "0–1000 doğrusunda sayıları (örneğin 400’ü 500’ün soluna) orantılı yerleştirirse ✓",
      easy: "Tüm yüzlük tikler (0,100,…,1000) görünür olsun.",
      hard: "Yalnız 0, 500, 1000 çıpa; \"640’ı yerleştir\" gibi ara sayılar sorun.",
    },
    viz: { t: "numline", max: 100, at: [40], hi: 40 },
  },
  { // 21 — Ölçüt Noktalarıyla Tahmin Eden (102–114 ay)
    how: "Bir tahmin yaparken zihnindeki referans (ölçüt) noktalarını kullanır: \"Bu yığın, az önce gördüğüm 100’lükten biraz fazla — yaklaşık 130.\" Bilinen bir miktarı çapa alıp ondan ayarlar.",
    teacher: "Ölçüt-noktası (benchmark) stratejisi, tahminin en güçlü biçimlerinden biridir: \"bildiğim bir miktara göre ne kadar fazla/az?\" Bu doğrudan iyi kalibre bir zihinsel sayı doğrusuna dayanır — referanslar doğru üzerindeki sabit noktalardır. Çocuğa kararlı çıpalar (10, 100, yarı) verin ve \"çapadan ne kadar uzakta?\" diye düşündürün.",
    act: {
      materials: ["DokunSay pulları (çok sayıda)", "Bir referans/çıpa kümesi (100’lük)", "İki kap"],
      steps: [
        "Bir kaba sayılmış 100 pul (çıpa) koyup gösterin.",
        "Öteki kaba ~130 pul koyup \"çıpaya göre tahmin et\" deyin.",
        "\"Çıpadan fazla mı az mı, ne kadar?\" diye ayarlattırın.",
        "Tahminden sonra sayıp çıpa stratejisinin işe yararlığını gösterin.",
      ],
      criterion: "Bilinen bir ölçüt noktasına göre ayarlayarak makul tahmin yaparsa ✓",
      easy: "Çıpayı görünür bırakın; hedef çıpaya yakın (110) olsun.",
      hard: "Çıpayı kaldırın; hedefi uzaklaştırın (180) ya da çıpanın katını sorun.",
    },
  },
  { // 22 — Bileşimle Tahmin Eden (108–120 ay)
    how: "Büyük bir miktarı zihinde parçalara ayırarak tahmin eder: \"Şu yarım yığın yaklaşık 70, öteki yarım da öyle — toplam 140 civarı.\" Sayıyı bileşenlerine bölüp parçaları toplar.",
    teacher: "En ileri tahmin stratejisi: kümeyi yönetilebilir parçalara AYIR, her parçayı kestir, sonra BİRLEŞTİR. Bu, parça-bütün düşünme, çarpımsal akıl yürütme ve esnek hesabın tahmine taşınmış hâlidir. Çocuğun parçalama mantığını sesli kurmasını isteyin; farklı parçalamaların benzer sonuca varması güçlü bir sezgi işaretidir.",
    act: {
      materials: ["Çok sayıda DokunSay pulu (100+)", "Geniş bir zemin", "Ayırıcı (ip/çubuk)"],
      steps: [
        "Büyük bir yığını gösterip \"saymadan tahmin edeceğiz\" deyin.",
        "Yığını zihinde/ip ile iki-üç parçaya böldürün.",
        "Her parçayı ayrı kestirtip \"parçaları topla\" deyin.",
        "Farklı bir parçalamayla tekrar tahmin ettirip sonuçları kıyaslayın.",
      ],
      criterion: "Büyük kümeyi parçalara ayırıp parça-tahminlerini birleştirerek makul sonuca varırsa ✓",
      easy: "İki eşit parçaya böldürüp her parçaya referans verin.",
      hard: "Eşit olmayan üç parçaya böldürün; referansı kaldırın.",
    },
  },
]
