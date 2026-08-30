// Toplama / Çıkarma (Adding/Subtracting) — düzey zenginleştirmesi (Clements & Sarama)
// ────────────────────────────────────────────────────────────────────────
// trajectories.data.js içindeki CORE `add` dizisiyle AYNI sırada 12 nesne.
// Her düzey: how (nasıl görünür) · teacher (öğretmen notu) · act (etkinlik) · viz/tool (ops.)
// DokunSay Bar (çubuk & pul, birleştir-ayır) ile yapılabilir; çok basamaklıda Basamak.
// Strateji yörüngesi: hepsini-sayma → ileri/geri-sayma → türetilmiş olgular → parça-bütün;
// 10'a köprüleme ve ters işlem ilişkisi vurgulu. Darboğazlar: düzey 3 (count-all) ve 6 (count-on).
export default [
  { // 0 — Aritmetik Sezici: Temeller (0–12 ay)
    how: "Bebek, önündeki iki nesneden biri perde arkasına alınınca \"bir şey eksildi\" gibi daha uzun bakar; eklendiğinde de tepki verir. Sayıyı bilmez ama çokluğun artıp azaldığını sezer.",
    teacher: "Bu, toplama-çıkarmanın en erken çekirdeğidir: miktarın değiştiğine dair sözel-öncesi bir beklenti. Henüz işlem yoktur; amaç \"daha çok / daha az oldu\" duygusunu uyandırmaktır. Tüm sonraki +/− öğrenmesi bu sezgiye yaslanır.",
    act: {
      materials: ["2–3 büyük, aynı renk DokunSay pulu", "küçük bir örtü ya da tepsi"],
      steps: [
        "Çocuğun önüne 2 pul koyup birlikte bakın.",
        "Örtüyle kapatın, gizlice 1 pul ekleyin ya da alın, açın.",
        "\"Bak, daha çok oldu!\" / \"Bir tane gitti!\" deyin; bakışını, şaşkınlığını gözleyin.",
        "Bazen hiç değiştirmeyin — \"aynı\" durumla karşılaştırın.",
      ],
      criterion: "Çokluk artıp azaldığında bakışı/dikkati belirgin değişiyorsa ✓",
      easy: "Farkı abartın (1 ↔ 3).",
      hard: "Yakın çokluklarla (2 ↔ 3) deneyin.",
    },
  },
  { // 1 — Sözel-Öncesi +/− (12–24 ay)
    how: "Önünde 2 nesne varken biri saklanırsa, açıldığında 1 görünce \"bir tane daha\" diye arar ya da şaşırır. Küçük çoklukta eklenme/çıkarılmayı izleyebilir.",
    teacher: "Klasik nesne-saklama deneylerinin yaşıdır: çocuk \"1 ve 1 iki eder, 2'den 1 gidince 1 kalır\" beklentisini eylemle gösterir — ama henüz sözle saymaz. Olayı sesli adlandırarak (\"bir koydum, bir daha… iki oldu\") sezgiyi dile bağlamaya başlayın.",
    act: {
      materials: ["2–3 özdeş DokunSay pulu", "kapatma örtüsü ya da el"],
      steps: [
        "1 pul gösterin, örtün; \"bir daha\" deyip gizlice 1 ekleyin.",
        "Örtüyü açmadan \"Kaç var sence?\" diye merak uyandırın, sonra açın.",
        "Tersini yapın: 2'yi örtüp 1'ini gizlice alın, \"Bak, bir tane gitti.\"",
        "Çocuğun arama/işaret tepkisini gözleyin; doğruyu sözle adlandırın.",
      ],
      criterion: "Saklı çokluk değişince (ör. 2 → 1) beklentisi bozuluyor, arıyor/şaşırıyorsa ✓",
      easy: "Hep 1 ↔ 2 ile, kısa saklama süresiyle çalışın.",
      hard: "2 ↔ 3'e çıkın, saklamayı biraz uzatın.",
    },
  },
  { // 2 — Küçük Sayı +/− (36–42 ay)
    how: "\"1 pulun vardı, 1 tane daha verdim — kaç oldu?\" gibi çok küçük soruları, nesneler gözden uzakken bile \"iki\" diye yanıtlayabilir. 1 ve 2 ile zihinsel/sözel küçük işlem yapar.",
    teacher: "İlk gerçek SÖZEL işlemdir: sonuç artık yalnız görülmüyor, küçük sayılarla \"söyleniyor\". 1+1, 2−1 gibi olgular sıkça ezberlenir. Bunları çok pekiştirin; sayı büyüdükçe (3+2) çocuk nesneye dönecek — bu doğaldır ve bir sonraki düzeye köprüdür.",
    act: {
      materials: ["DokunSay pulları", "kapatılabilir küçük tabak/kutu"],
      steps: [
        "1 pulu tabağa koyup kapatın: \"İçeride bir pul var.\"",
        "\"Bir tane daha koyuyorum\" deyip ekleyin, kapağı kapalı tutun.",
        "\"Şimdi içeride kaç var?\" — açmadan söylesin, sonra açıp doğrulayın.",
        "Çıkarma için 2 koyup 1'ini görünür şekilde alın: \"Kaç kaldı?\"",
      ],
      criterion: "Toplamı 5'i geçmeyen birleştirme/ayırmayı nesnelerle tümünü sayarak doğru bulursa ✓",
      easy: "İşlemden hemen önce pulları birlikte sayıp kapatın.",
      hard: "\"2 ve 1\" gibi sonucu 3 olan soruları yoklayın.",
    },
  },
  { // 3 — Sonucu Bulan +/− (42–54 ay) ★ DARBOĞAZ
    how: "\"3 elma ve 2 elma kaç eder?\" sorusunda çocuk 3 pulu sayar, 2 pulu sayar, sonra hepsini en baştan \"bir-iki-üç-dört-beş\" diye yeniden sayar (\"count all\"). İki kümeyi de görmeden, dokunmadan işlem yapamaz.",
    teacher: "Bu, yörüngenin ilk büyük darboğazıdır: çocuk artık iki çokluğu birleştirip TÜMÜNÜ sayarak doğru sonuca ulaşır — ama her seferinde sıfırdan. Sık yanılgı: birleştirmeyi unutup yalnız bir kümeyi saymak ya da nesneler kapalıyken tıkanmak. Bu düzey kritik çünkü buradan \"baştan saymadan, devam ederek sayma\"ya (count-on) geçiş matematik gelişiminin dönüm noktasıdır. Acele ettirmeyin; önce \"hepsini sayma\"yı somut pullarla sağlamlaştırın.",
    act: {
      materials: ["DokunSay pulları/çubukları (iki renk)", "birleştirme tepsisi ya da çizgisi", "kapatma kartı"],
      steps: [
        "3 turuncu pulu birlikte sayın, 2 yeşil pulu birlikte sayın.",
        "\"Hepsini bir araya getirelim\" deyip tek tepsiye toplatın.",
        "Çocuk birleşik kümeyi baştan sona saysın: \"…dört, beş — beş eder.\"",
        "Çıkarma için 5 koyup 2'sini görünür alın: kalanı baştan saydırın.",
      ],
      criterion: "İki kümeyi birleştirip hepsini sayarak doğru toplamı/farkı bulursa ✓",
      easy: "Sayıları küçük tutun (2+1, 3+1); pulları büyük ve ayrı renkte verin.",
      hard: "Bir kümeyi kapatıp \"üç vardı, ikiyi ekledim\" deyin — saymadan saklı kısmı düşünmeye zorlayın (count-on'a köprü).",
      tool: "bar",
    },
    viz: { t: "combine", a: 3, b: 2 },
  },
  { // 4 — N Yap (54–60 ay)
    how: "\"Elinde 7 var, 10 yapmak için kaç tane daha lazım?\" sorusunu, onluk çerçevedeki boş kutuları görüp \"üç\" diye yanıtlar. Verilen bir sayıya eksiği tamamlar.",
    teacher: "\"N'e tamamlama\", 10'a köprülemenin ve eksik-toplamayı (7+_=10) çözmenin temelidir. Onluk çerçeve burada can damarıdır: dolu/boş kutular eksiği \"görünür\" kılar. Çocuğu \"kaç boş kaldı?\" diye düşündürün; bu, ileride zihinden 10'a tamamlamayı kolaylaştırır.",
    act: {
      materials: ["DokunSay pulları", "onluk çerçeve (2×5)", "10'a dek sayı kartları"],
      steps: [
        "Onluk çerçeveye 7 pul koyun: \"Kaç dolu? Kaç boş?\"",
        "\"On yapmak için kaç pul daha lazım?\" — boş kutuları saydırın.",
        "Çocuk eksiği eklesin ve \"yedi ve üç, on\" desin.",
        "Farklı başlangıçlarla (6→10, 8→10) tekrarlayın.",
      ],
      criterion: "Verilen sayıyı istenen sayıya nesne ekleyerek dönüştürürse — kaç eklediğini söylemesi gerekmez ✓",
      easy: "Hedefi hep 10 ve çerçeveyle çalışın; başlangıcı ≥6 tutun.",
      hard: "Çerçevesiz sorun ya da hedefi değiştirin (\"4'ten 8'e kaç?\").",
      tool: "bar",
    },
    viz: { t: "tenframe", n: 7, frames: 1 },
  },
  { // 5 — Değişimi Bulan +/− (60–66 ay)
    how: "\"5 pulun vardı, biraz ekledim, şimdi 8 oldu — kaç ekledim?\" gibi BİLİNMEYEN-DEĞİŞİMLİ problemi çözer. Başlangıç ve sonucu bilip aradaki değişimi bulur.",
    teacher: "Burada problem yapısı zorlaşır: bilinmeyen artık sonuç değil, değişimin kendisidir (5+_=8). Çocuk genelde 5'ten 8'e \"sayarak\" ya da 8'den 5'i \"ayırarak\" çözer — bu, toplama-çıkarmanın ters işlem olduğunu sezdirir. Hikâyeyi pullarla canlandırmak, hangi parçanın bilinmediğini netleştirir.",
    act: {
      materials: ["DokunSay pulları (iki renk)", "kapatma kartı", "birleştirme tepsisi"],
      steps: [
        "5 pulu görünür koyun, sonra bir avuç pulu kapatma kartıyla gizlice ekleyin.",
        "Toplamı (8) gösterip \"Başta beş vardı, şimdi sekiz — kaç ekledim?\" diye sorun.",
        "Çocuk 5'in üstüne ekleyerek ya da 8'den 5'i ayırarak değişimi (3) bulsun.",
        "Çıkarma yönünü deneyin: \"8 vardı, birkaçı gitti, 5 kaldı — kaç gitti?\"",
      ],
      criterion: "Başlangıç ve sonuç verildiğinde bilinmeyen değişimi (ekleme/çıkarma miktarını) doğru bulursa ✓",
      easy: "Değişimi küçük (1–2) tutun, başlangıcı gizlemeyin.",
      hard: "Başlangıcı da gizleyip yalnız değişim ve sonucu verin (\"_+3=8\").",
      tool: "bar",
    },
  },
  { // 6 — Sayma Stratejileri +/− (66–72 ay) ★ DARBOĞAZ
    how: "\"5 ve 3\" sorusunda artık baştan saymaz; \"beeeş…\" deyip sayı doğrusunda devam eder: \"altı, yedi, sekiz\" (count-on). Çıkarmada da büyükten geri sayar: \"8… yedi, altı, beş\". Parmakları çoğu kez sayacı gibi kullanır.",
    teacher: "Bu, yörüngenin ikinci ve en kritik darboğazıdır: \"hepsini sayma\"dan \"devam ederek/geri sayma\"ya (count-on / count-back) geçiş. Bu sıçrama, ilk toplananı bir bütün olarak tutup üstüne saymayı gerektirir — büyük bir bilişsel adımdır. Buraya geçememek, yani 1. sınıfta hâlâ her toplamı sıfırdan parmakla saymak, matematik öğrenme güçlüğü (diskalkuli) açısından en güçlü erken işaretlerden biridir. Çocuğu \"büyük sayıyı kafanda tut, küçüğü üstüne say\" diye yönlendirin; sayı doğrusu ve parmak bu geçişi somutlaştırır.",
    act: {
      materials: ["DokunSay pulları/çubukları", "0–20 sayı doğrusu (ya da DokunSay çubuğu)", "parmaklar"],
      steps: [
        "\"5 ve 3\" deyin; 5'i kapatıp \"beşi avucunda tut\" deyin.",
        "Çocuk büyük sayıdan devam etsin: doğruda 5'e basıp \"altı, yedi, sekiz\" diye 3 adım atsın.",
        "Hangisinin büyük olduğunu seçtirin (3+5 için de 5'ten say) — \"büyükten devam\" alışkanlığını kurun.",
        "Çıkarma: \"8'den 3 git\" — 8'e basıp geri saydırın (\"yedi, altı, beş\").",
      ],
      criterion: "Baştan saymadan, büyük sayıdan ileri (ya da geri) sayarak sonuca ulaşırsa ✓",
      easy: "Üstüne eklenen sayı ≤3 olsun; her adımı parmakla işaretletin.",
      hard: "İki sayı da büyükse (6+5), önce büyüğü seçtirin; sayı doğrusunu kaldırıp zihinden saydırın.",
      tool: "bar",
    },
    viz: { t: "numline", max: 12, at: [5, 6, 7, 8], hi: 8 },
  },
  { // 7 — Parça-Bütün +/− (72–84 ay)
    how: "8+5'i \"sekizden ikiyi al, on yap; üç kaldı — on üç\" diye, sayıyı parçalayarak çözer. Bir sayının başka sayıların bütünü olduğunu (8 = 5+3) esnekçe kullanır.",
    teacher: "Sayma stratejilerinden ESNEK PARÇA-BÜTÜN düşünmeye geçiştir; aritmetiğin kalbi burasıdır. \"10 köprüsü\" temel araçtır: 8+5 → 8+2+3 → 10+3. Çocuk bir toplananı bölüp 10'a tamamlayabiliyorsa, zihinden toplama gerçekten başlamıştır. İki renkli pul ve onluk çerçeve, kırılımı görünür kılar.",
    act: {
      materials: ["DokunSay pulları (iki renk)", "onluk çerçeve (2×5)", "parça-bütün kutusu/çizgisi"],
      steps: [
        "Onluk çerçeveye 8 koyun, yanına 5 ayrı pul verin: \"Onu nasıl tamamlarız?\"",
        "Çocuk 5'ten 2'yi çekip çerçeveyi 10 yapsın, kalan 3'ü söylesin: \"on ve üç, on üç.\"",
        "Aynı işlemi farklı kırsın (7+6 → 7+3+3) — \"hep onu köprü yap\" deyin.",
        "Çıkarmada 10'dan geri kırın: \"13−5 → 13−3−2\" diye onluğu bozdurun.",
      ],
      criterion: "Bazı kombinasyonları ezbere kullanır (5+5=10), problemleri esnek stratejilerle, başlangıcı bilinmeyeni deneme-yanılmayla çözerse ✓",
      easy: "Ezbere bildiği çiftlerden (5+5, 2+2) başlayın; sayıları 10'u aşmayan problemler kurun.",
      hard: "Başlangıcı bilinmeyen problemleri (_ + 3 = 8) artırın; denediği sayıyı sözle gerekçelendirsin.",
      tool: "bar",
    },
    viz: { t: "tenframe", n: 8, frames: 1 },
  },
  { // 8 — Sayı-İçinde-Sayı +/− (84–90 ay)
    how: "6+8'i çözerken \"6 zaten 8'in içinde var, 8'e daha 2 lazımdı; öyleyse 6 ve 8, 14\" gibi gömülü ilişkileri görür. Bir işlemin içinde tanıdık küçük olguları fark eder.",
    teacher: "Bu düzeyde çocuk sayıları artık iç içe geçmiş ilişkiler ağı olarak görür: 8'in içinde 5+3, 6'nın içinde 5+1 saklıdır. Bilinen olguları gömülü olarak kullanmak, bir sonraki \"türetme\" düzeyinin habercisidir. Çocuğun \"şunu zaten biliyorum\" dediği parçaları sözle açığa çıkarın.",
    act: {
      materials: ["DokunSay pulları (iki renk)", "onluk çerçeve", "olgu kartları (5+3, 6+6 vb.)"],
      steps: [
        "7+8 verin: \"İçinde bildiğin bir toplama var mı?\" (ör. 7+7).",
        "Çocuk gömülü olguyu (7+7=14) bulup üstüne 1 eklesin.",
        "Aynı sayıyı farklı gömülülerle çözdürün (8 = 5+3 → 6+8 = 6+5+3 = 11+3).",
        "\"Bunu nereden bildin?\" diye gömülü ilişkiyi anlattırın.",
      ],
      criterion: "Bir işlemin içindeki tanıdık (gömülü) olguyu kullanarak sonuca ulaşırsa ✓",
      easy: "İkiz olgulara yakın işlemler (6+7, 8+9) verin.",
      hard: "Gömülü olgu açık değilken \"içinde ne saklı?\" diye kendisi bulsun.",
      tool: "bar",
    },
    viz: { t: "dots", group: [6, 8] },
  },
  { // 9 — Türeten +/− (90–96 ay)
    how: "\"6+6=12 olduğunu biliyorum, öyleyse 6+7 bir fazla, 13\" der. Ezberlemediği bir olguyu, bildiği bir olgudan TÜRETİR (ikizler, 10'lar, ±1/±2 ilişkileri).",
    teacher: "Olgun aritmetiğin ayırt edici becerisi: türetilmiş olgu stratejileri. Çocuk artık her sonucu saymaz da, bilinen çıpa-olgulardan (ikizler, 10-bileşenleri) mantıkla türetir — hız ve esneklik birlikte gelir. \"Yakın bir toplamı biliyor musun? Ondan nasıl gidersin?\" sorusu bu düşünmeyi tetikler; ters işlem ilişkisi (12−6 = 6 ise 13−6 = 7) de buradan beslenir.",
    act: {
      materials: ["DokunSay pulları", "ikiz/10-olgu kartları", "boş sayı doğrusu (kâğıt)"],
      steps: [
        "Bildiği bir çıpa olguyu doğrulatın: \"6+6 kaç? — 12.\"",
        "Komşu olguyu sorun: \"Peki 6+7? Nasıl bir fazla bulursun?\"",
        "Türetmeyi sözle kurdurun: \"6+6=12, bir fazla, 13.\"",
        "Ters yönü bağlayın: \"12+6=18 ise 12+5 kaç? Ve 18−6?\"",
      ],
      criterion: "Bilinen bir olgudan (ikiz, 10, ±1/±2) komşu sonucu türetir ya da 10'a tamamlayıp bozarak çözerse ✓",
      easy: "Yalnız ±1 türetmeler ve ikiz komşuları (7+8, 5+6).",
      hard: "İki adımlı türetme (6+8 = 6+6+2) ve çıkarmaya taşıma.",
      tool: "bar",
    },
    viz: { t: "combine", a: 6, b: 7 },
  },
  { // 10 — Problem Çözen +/− (96–102 ay)
    how: "\"12 bilyem vardı, 5'ini verdim, sonra 4 buldum — kaç oldu?\" gibi çok adımlı problemi planlayıp çözer; toplama mı çıkarma mı gerektiğine kendi karar verir ve stratejisini esnek seçer.",
    teacher: "Burada beceri tek işlemden PROBLEM ÇÖZMEYE genişler: çocuk metni modeller, adımları sıralar, uygun işlemi ve stratejiyi (sayma / parça-bütün / türetme) duruma göre seçer. En sık güçlük işlemin yönünü belirlemektir (\"verince azalır, bulunca artar\"). Problemi pullarla ya da boş sayı doğrusuyla sahnelemek, adımları görünür kılar.",
    act: {
      materials: ["DokunSay pulları/çubukları", "boş sayı doğrusu (kâğıt)", "problem kartları"],
      steps: [
        "İki adımlı bir hikâye okuyun: \"7 vardı, 6 ekledim, sonra 4 gitti.\"",
        "Çocuk her adımı pullarla/doğruda canlandırsın ve ara sonucu söylesin.",
        "\"Hangi adımda artıyor, hangisinde azalıyor?\" diye işlem yönünü gerekçelendirsin.",
        "Aynı sayılarla farklı soru sorun (\"kaç fazla?\", \"başta kaç vardı?\") — esnekliği yoklayın.",
      ],
      criterion: "Çok adımlı problemi doğru işlemler ve uygun stratejiyle, planlı biçimde çözerse ✓",
      easy: "Tek adıma indirin, sayıları ≤10 tutun, hikâyeyi pullarla birlikte kurun.",
      hard: "Başlangıcın bilinmediği (\"_−5+3=6\") ya da fazladan bilgili problemler.",
      tool: "bar",
    },
    viz: { t: "numline", max: 17, at: [7, 13], hi: 13 },
  },
  { // 11 — Çok Basamaklı +/− (102–114 ay)
    how: "47+38'i \"yedi ve sekiz on beş, birlikleri yaz beşi, onluğa bir elde; dört, üç ve elde bir — sekiz, seksen beş\" diye eldeyle yürütür. Çıkarmada gerektiğinde onluk bozar (52−27).",
    teacher: "Strateji artık basamak değerine ölçeklenir: çocuk onlukları ve birlikleri ayrı birimler gibi işler, gerekince elde tutar ya da onluk bozar. En sık yanılgı eldeyi/bozmayı unutmak ve basamakları yanlış hizalamaktır. DokunSay Basamak araçları (onluk çubuk + birlik küp) bu işlemi somut kılar: \"on birlik bir onluğa dönüşür\" değiş-tokuşunu elle gösterin; soyut algoritmayı ancak bu birimleme oturduktan sonra hızlandırın.",
    act: {
      materials: ["DokunSay Basamak blokları (onluk çubuk + birlik küp)", "onluk-birlik değiş-tokuş tepsisi", "2 basamaklı işlem kartları"],
      steps: [
        "47 ve 38'i bloklarla kurun: birlikleri (7+8) birleştirin.",
        "On birliği bir onluk çubukla değiştirin (\"elde bir\"), kalan 5 birliği bırakın.",
        "Onlukları toplayın (4+3+1=8): sonucu \"85\" diye okutun, yazıyla eşleştirin.",
        "Çıkarma için 52−27'de bir onluğu 10 birliğe bozdurup farkı bulun.",
      ],
      criterion: "Eldeli toplama ve onluk-bozmalı çıkarmayı basamak değerine uygun, doğru yürütürse ✓",
      easy: "Elde/bozma gerektirmeyen işlemler (23+45, 68−27) ile başlayın.",
      hard: "Üç basamağa geçin ya da arka arkaya bozmalı çıkarma (300−168).",
      tool: "basamak",
    },
    viz: { t: "baseten", tens: 4, ones: 7 },
  },
]
