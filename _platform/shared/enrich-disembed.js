// Gömülü Şekli Ayırma (Disembedding Shapes) — düzey zenginleştirmesi (Clements & Sarama)
// trajectories.data.js CORE içindeki "disembed" yörüngesinin 5 düzeyini öğretmen/veli
// için derinleştirir. Altın-standart şablon: yorunge.enrich.js (sub).
// Pedagojik eksen: bütünü algılama (ayıramaz) → örtüşen şekilleri bulma →
// şekil-içinde-şekil ayırma (DARBOĞAZ) → ikincil/karmaşık yapı → tam ayırma.
// Çerçeve: görsel figür-zemin ayrımı; karmaşık bir resimde gizli şekli bulma.
// Her düzey: how (nasıl görünür) · teacher (öğretmen notu) · act (etkinlik) · tool ("geo").
// Bu yörünge geometriktir; viz YOKTUR — detay sayfası 🔍 amblemi kullanır.
export default [
  { // 0 — Ayırma Öncesi: Temeller (0–48 ay)
    how: "Çocuğa içinde bir ev, ağaç ve güneşin iç içe geçtiği renkli bir resim gösterdiğinizde \"resimde ne var?\" diye sorarsanız \"hepsi\" der gibi bütüne bakar; tek bir şekli (\"daireyi göster\") parmağıyla ayırıp gösteremez. Şekiller onun gözünde henüz birbirinden kopmamış, tek bir görsel bütündür.",
    teacher: "Bu en erken görsel düzeydir: çocuk sahneyi bütün (gestalt) olarak algılar, henüz figür-zemin ayrımı yapıp tek bir şekli \"öne çıkaramaz\". Bu doğaldır — şekilleri ayırma, geometrinin ileride okuma, yap-boz ve diyagram çözmeyi besleyen görsel-uzamsal bir becerisidir. Amaç \"doğru\"yu zorlamak değil; net, yalın, tek tek şekillerle dikkatini bir nesneye demirlemektir. Kalabalık değil, sade başlayın.",
    act: {
      materials: ["DokunSay Geo'dan birkaç büyük, ayrık şekil kartı (daire, kare, üçgen — üst üste değil)", "şekilleri ayrı koymak için bir tepsi", "parmakla izlemek için kalın kenarlı şekiller"],
      steps: [
        "Tek bir şekli (büyük bir daire) ortaya koyun: \"Bu bir daire. Parmağınla kenarını gez.\"",
        "Çocuk şeklin çevresini parmağıyla izlesin — el, gözün gördüğünü pekiştirir.",
        "Yanına ikinci, ayrık bir şekil (kare) koyun: \"Hangisi daire? Onu bana ver.\"",
        "Şekilleri tepside ayrı ayrı tutun; her birini adlandırıp parmakla gezdirin.",
      ],
      criterion: "Ayrık (üst üste binmeyen) tek bir şekli, adı söylendiğinde gösterir/seçerse ✓ (kalabalık resimde yalnız bütünü algılıyorsa bu düzeydedir)",
      easy: "Tek seferde tek şekil; çok büyük, tek renkli, kalın kenarlı tutun.",
      hard: "Üç ayrık şekil arasından isteneni seçtirin; renkleri benzeştirip yalnız biçime baktırın.",
      tool: "geo",
    },
  },
  { // 1 — Örtüşen Şekil Bulucu (48–60 ay)
    how: "Birbiriyle bir köşesinden örtüşen (üst üste binen) iki şekil — örneğin kesişen bir kare ile bir daire — gösterip \"kaç şekil var, göster\" dediğinizde çocuk her ikisini de parmağıyla ayrı ayrı gezebilir: \"burada kare, burada daire\". Örtüşme bölgesi onu artık şaşırtmaz; iki ayrı şekli birbirinden koparabilir.",
    teacher: "Burada figür-zemin ayrımı başlar: çocuk üst üste binen iki biçimi iki AYRI şekil olarak okur, kesişimdeki ortak alana takılmaz. Bu, bütünden ayırmaya geçişin ilk adımıdır — ama henüz biri ötekinin İÇİNE tam gömülü değildir; yalnız kenarları çakışır. Çakışan kısmı \"her ikisine de ait\" diye konuşturun; her şeklin kenarını ayrı renkle parmakla gezdirmek, hangi çizginin hangi şekle ait olduğunu görünür kılar.",
    act: {
      materials: ["DokunSay Geo'da köşeden kesişen iki şekil (kare + daire, iki üçgen)", "her şeklin kenarını ayrı renkle izlemek için iki renkli kalem/işaretçi", "saydam katman/folyo (her şekli ayrı katmanda göstermek için)"],
      steps: [
        "Örtüşen iki şekli gösterin: \"Burada birden çok şekil saklı. Hangileri?\"",
        "Bir şeklin kenarını bir renkle, ötekini başka renkle parmakla baştan sona gezdirin.",
        "\"Şu orta parça hangisinin?\" diye sorun — \"her ikisinin de\" yanıtını birlikte bulun.",
        "Saydam katmanları üst üste koyup tek tek kaldırarak her şekli yalnız başına gösterin.",
      ],
      criterion: "Köşeden örtüşen iki şekli, kesişimde takılmadan iki ayrı şekil olarak gösterir/sayarsa ✓ (tam gömülüyü henüz ayıramaz)",
      easy: "Şekiller yalnız ufak bir köşeden değsin; renkleri belirgin farklı tutun.",
      hard: "Örtüşme alanını büyütün ya da üç şekli kesiştirip \"kaç şekil var?\" deyin.",
      tool: "geo",
    },
  },
  { // 2 — Şekil-İçinde-Şekil Ayırıcı (60–72 ay) ★ DARBOĞAZ
    how: "Bir karenin TAM İÇİNE çizilmiş bir daireyi gösterip \"içinde gizli bir şekil var, onu bul\" dediğinizde çocuk daireyi parmağıyla ayrı bir biçim olarak izleyip \"daire!\" der — kareyi yok saymadan ikisini birbirinden ayırır. Henüz oturmamışsa yalnız dış şekli (kareyi) görür, içteki daireyi \"ayrı bir şekil\" olarak fark edemez; \"sadece kare\" der.",
    teacher: "Bu yörüngenin asıl DARBOĞAZIDIR: basit gömülü (bir şeklin tam içinde duran başka bir şekil) yapıyı ayırmak. Örtüşmede şekiller yan yanaydı; burada biri ötekinin içine sığmıştır ve dış şeklin çizgileri içtekini görsel olarak \"yutar\". Çocuğun, baskın bütünü (dış şekli) zihinsel olarak bastırıp içteki figürü öne çıkarması gerekir — bu, dikkatin seçici yönetimidir ve görsel-uzamsal güçlükte sık takılan yerdir. İçteki şeklin yalnızca onun kenarını parmakla gezdirin (\"şimdi yalnız gizli şekli izle\"); dış şekli saydam katmanla kaldırıp içtekini tek başına gösterin, sonra geri koyup \"hâlâ orada\" deyin. Acele ettirmeyin; gömülü şekli izleme alışkanlığı hedeftir.",
    act: {
      materials: ["DokunSay Geo'da iç içe şekiller (kare içinde daire, üçgen içinde kare)", "yalnız iç şekli izlemek için parmak/işaretçi", "dış şekli geçici kaldırmak için saydam katman/folyo"],
      steps: [
        "Kare içine yerleşmiş daireyi gösterin: \"Burada bir şekil, başka bir şeklin içinde saklı. Gizli olanı bul.\"",
        "Çocuk yalnız iç şeklin (dairenin) kenarını parmağıyla, kareyi izlemeden gezsin.",
        "Saydam katmanda yalnız daireyi gösterip \"işte gizli şekil\" deyin; sonra kareyi geri koyun.",
        "Rolü değiştirin: \"Şimdi de dıştaki şekli göster\" — ikisini ayrı ayrı işaret etsin.",
      ],
      criterion: "Bir şeklin tam içine gömülü basit bir şekli (ör. kare içindeki daire) ayrı bir şekil olarak bulup gösterirse ✓",
      easy: "İç şekil büyük ve farklı renkte olsun; önce siz iç şeklin kenarını parmağıyla birlikte gezdirin.",
      hard: "İç şekli küçültüp dış şekille aynı renge getirin ya da iki gömülü şekil (kare içinde daire ve üçgen) koyup \"ikisini de bul\" deyin.",
      tool: "geo",
    },
  },
  { // 3 — İkincil Yapı Ayırıcı (72–84 ay)
    how: "Birkaç çizginin kesiştiği daha karmaşık bir desende (örneğin bir dikdörtgenin köşegenleriyle oluşan üçgenler, ya da çatı + duvar çizgilerinin içine gizlenmiş bir üçgen) \"buradaki üçgeni bul\" dediğinizde çocuk, şeklin kenarlarının bir kısmı başka çizgilerle PAYLAŞILSA bile gizli şekli seçip gösterir. Tek bir net kenarı değil, birkaç çizginin birlikte oluşturduğu ikincil bir şekli görebilir.",
    teacher: "Darboğazı aşan çocuk şimdi ikincil yapıları ayırır: gizli şekil artık tek parça bir nesnenin içinde değil, birkaç çizginin kesişiminden DOLAYLI olarak doğar (paylaşılan kenarlar). Bu, gömülü-figür becerisinin geometriye asıl katkısının başladığı yerdir — diyagram okuma, açı/üçgen görme, ileride alan ve kanıt çalışmalarının görsel zemini. Çocuğun, bir çizginin aynı anda birden çok şekle ait olabileceğini fark etmesi kritiktir. Gizli şeklin kenarlarını tek tek parmakla gezdirip \"bu çizgi hem buranın hem şuranın\" diyerek paylaşımı dile döktürün; saydam katmanla yalnız o şekli vurgulayın.",
    act: {
      materials: ["DokunSay Geo'da çizgileri paylaşan birleşik şekiller (köşegenli dikdörtgen, çizgilerle bölünmüş kare)", "gizli şeklin kenarlarını izlemek için parmak/işaretçi", "yalnız bulunan şekli vurgulamak için saydam katman/renkli folyo"],
      steps: [
        "Çizgilerle bölünmüş bir deseni gösterin: \"İçinde bir üçgen saklı. Onu bul ve kenarlarını gez.\"",
        "Çocuk üçgenin kenarlarını parmağıyla izlerken paylaşılan çizgileri fark etsin.",
        "\"Bu çizgi yalnız üçgenin mi?\" diye sorun — \"hem üçgenin hem dikdörtgenin\" diye birlikte söyleyin.",
        "Saydam katmanı üzerine koyup bulunan şekli renkle belirginleştirin, sonra başka bir gizli şekli aratın.",
      ],
      criterion: "Kenarları başka çizgilerle paylaşılan, çakışmayan daha karmaşık bir gömülü şekli (ikincil yapı) bulup gösterirse ✓",
      easy: "Tek bir gizli şekle odaklayın; onun kenarlarını başka renkle önceden belli edin.",
      hard: "Aynı desende iki farklı gizli şekil (bir üçgen + bir küçük kare) aratın ya da fazladan oyalayıcı çizgiler ekleyin.",
      tool: "geo",
    },
  },
  { // 4 — Tam Ayırıcı (84–96 ay)
    how: "Birçok şeklin üst üste, iç içe ve kenar paylaşarak karıştığı karmaşık bir figürde (klasik bir gömülü-figür bulmacası gibi) \"içindeki bütün üçgenleri bul\" ya da \"şu yıldızı bul\" dediğinizde çocuk, oyalayıcı çizgilere aldırmadan her gizli şekli tek tek seçip gösterir. Çok katmanlı bir görselde aradığı biçimi sistemli biçimde tarayıp ayıklar.",
    teacher: "En üst düzey: çok katmanlı, çok şekilli bir bütünden gizli şekilleri tam olarak ayırma. Çocuk artık seçici dikkatini esnek yönetir — baskın bütünü bastırır, oyalayıcı çizgileri eler, aradığı biçimi farklı yön ve büyüklüklerde tanır. Bu olgun figür-zemin becerisi geometride harita/diyagram okuma, karmaşık şekilleri parçalara ayırarak alan bulma ve görsel akıl yürütmenin temelidir. Sistemli tarama stratejisini pekiştirin (\"bir köşeden başla, hepsini sırayla yokla\"); bulduğu her şekli saydam katmanla işaretleyip \"kaç tane var?\" diye saydırın. Çözümü ezberlemesin — yeni figürlerle genelleştirin.",
    act: {
      materials: ["DokunSay Geo'da çok katmanlı karmaşık figür (iç içe + örtüşen çok şekil, gömülü-figür bulmacası)", "bulunan her şekli işaretlemek için saydam katman/renkli folyo", "sistemli taramada şekilleri saymak için kâğıt-kalem ya da sayaç"],
      steps: [
        "Karmaşık figürü gösterin: \"Burada birçok şekil saklı. İçindeki tüm üçgenleri bulalım.\"",
        "Bir köşeden başlayıp sistemli tarayın; bulunan her üçgeni parmakla gezip saydam katmanla işaretleyin.",
        "\"Kaç tane buldun? Başka var mı?\" diye eksiksiz aramayı teşvik edin.",
        "Aynı şekli farklı yön/büyüklükte de buldurun; sonra yeni bir karmaşık figüre geçin.",
      ],
      criterion: "Çok katmanlı karmaşık bir figürde, oyalayıcılara takılmadan gizli şekilleri sistemli olarak tam ayırıp gösterirse ✓",
      easy: "Aranan şekil sayısını azaltın (yalnız 2 gizli şekil) ya da oyalayıcı çizgileri silikleştirin.",
      hard: "Daha yoğun figür, farklı yön/ölçekte gömülü şekiller ve \"toplam kaç şekil?\" gibi sayım hedefi ekleyin.",
      tool: "geo",
    },
  },
]
