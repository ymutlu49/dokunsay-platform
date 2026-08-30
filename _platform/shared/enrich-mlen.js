// Ölçme: Uzunluk (Length Measurement) — düzey zenginleştirmesi (Clements & Sarama)
// trajectories.data.js içindeki "mlen" yörüngesinin 12 düzeyini öğretmen/veli için
// derinleştirir. Altın-standart şablon: yorunge.enrich.js (sub).
// Her düzey: how (nasıl görünür) · teacher (öğretmen notu) · act (etkinlik) ·
// viz (opsiyonel görsel reçetesi) · tool (opsiyonel DokunSay aracı; varsayılan "bar").
// Pedagojik omurga: uzunluk sezme → nicelik tanıma → doğrudan karşılaştırma →
// DOLAYLI karşılaştırma (aracı nesneyle; darboğaz) → sıralama → uç uca BİRİM döşeme
// (boşluksuz; darboğaz) → birim tekrarı → cetvelle ölçme → kavramsal cetvel.
// Sık yanılgı: cetveli 1'den (0 yerine) başlatma; birimleri üst üste/boşluklu koyma.
export default [
  { // 0 — Uzunluk Sezici: Temeller (0–24 ay)
    how: "Bebek, uzun bir kaşıkla kısa bir kaşığı gördüğünde uzun olana uzanır ya da iki çubuktan büyüğünü ağzına götürmeye çalışır. Henüz \"uzun\" demez; ama bir şeyin \"daha çok yer kapladığını\" eliyle, bakışıyla sezer.",
    teacher: "Bu, uzunluğun en erken sezgisidir: nicelik henüz dile dökülmez, bedenle yaşanır. Amaç ölçmek değil, \"uzun-kısa\" farkına dikkat uyandırmaktır. Günlük dilde \"koca bir\", \"minik bir\", \"uzuuun\" gibi sözcükleri abartılı tonla kullanın; çocuk uzunluğu bir özellik olarak fark etmeye başlasın. Sonraki tüm ölçme öğrenmesi bu çıplak sezgiye yaslanır.",
    act: {
      materials: ["belirgin uzun ve kısa iki nesne (kaşık, çubuk, kurdele)", "DokunSay çubukları (uzun + kısa)"],
      steps: [
        "Uzun ve kısa bir nesneyi yan yana, çocuğun erişebileceği yere koyun.",
        "Uzun olanı işaret edip \"Bak, bu ne kadar uuuzun!\" deyin, ona dokundurun.",
        "Hangisine uzandığını/baktığını gözleyin; seçtiğini adlandırın.",
        "Gün içinde (kaşık, mendil, ip) aynı \"uzun-kısa\" karşıtlığını yineleyin.",
      ],
      criterion: "Uzun ile kısa nesne arasında belirgin bir tercih/dikkat farkı gösterirse ✓",
      easy: "Farkı abartın: çok uzun bir kurdele ile çok kısa bir parça.",
      hard: "Boyları yakınlaştırın; aynı renk/biçimde iki çubukla deneyin.",
    },
  },
  { // 1 — Uzunluk Niceliği Tanıyıcı (12–36 ay)
    how: "\"Hangisi uzun?\" diye iki çubuk gösterdiğinizde çocuk çoğu zaman uzun olanı işaret eder ya da \"bu uzun\" der. Uzunluğu artık ad olarak tanır; ama henüz uçları hizalayıp ölçmez, bakışına güvenir.",
    teacher: "Burada uzunluk bir NİCELİK olarak dile değer: \"uzun, kısa, daha uzun\" sözcükleri nesneye bağlanır. Bu sözcük dağarcığı sonraki karşılaştırmanın temelidir. Dikkat: bu yaşta çocuk \"büyük\" ile \"uzun\"u karıştırabilir (kalın/hacimli olanı \"uzun\" sanabilir). Yalnız tek boyuta (boy) odaklanan örnekler seçin; iki çubuğu kalınlık/renk olarak özdeş tutup yalnız boyca farklı yapın.",
    act: {
      materials: ["boyca farklı, kalınlık/renkçe özdeş iki çubuk", "DokunSay çubukları", "\"uzun/kısa\" resim kartları"],
      steps: [
        "İki çubuğu masaya koyun: \"Hangisi uzun? Hangisi kısa?\"",
        "Çocuğun seçimini sözle doğrulayın: \"Evet, bu daha uzun.\"",
        "Yer değiştirip yineleyin (seçim yere göre ezberlenmesin).",
        "Günlük nesnelerle (kalem-cetvel, parmak-kol) \"uzun olan hangisi?\" oynayın.",
      ],
      criterion: "İki nesneden uzun (veya kısa) olanı tutarlı biçimde adlandırır/gösterirse ✓",
      easy: "Boy farkını büyük tutun; yalnız \"uzun olanı göster\" deyin.",
      hard: "Üç nesne içinde \"en uzun\" / \"en kısa\" sorun.",
    },
  },
  { // 2 — Uzunluk Doğrudan Karşılaştırıcı (42–54 ay)
    how: "İki kalem verince çocuk onları yan yana getirir, BİR uçlarını aynı çizgiye hizalar ve diğer uçtan taşan kalemi \"bu uzun\" diye gösterir. Hizalamayı kendiliğinden yapması asıl kazanımdır.",
    teacher: "Doğrudan karşılaştırma, ölçmenin ilk gerçek mantığıdır: adil karşılaştırma için nesnelerin AYNI başlangıçtan hizalanması gerekir. Klasik yanılgı: çocuk uçları hizalamadan, yalnız bir kalemin üst ucu daha yukarıda diye onu \"uzun\" sanar. \"Yarış çizgisi\" benzetmesi güçlüdür: \"İkisi de aynı çizgiden başlasın, sonra kim daha ileri gidiyor bakalım.\" Hizalamayı her seferinde birlikte kontrol edin.",
    act: {
      materials: ["boyca yakın birkaç kalem/çubuk", "hizalama için bir cetvel kenarı veya masa kenarı", "DokunSay çubukları"],
      steps: [
        "İki çubuğu verin: \"Hangisi uzun, nasıl emin oluruz?\"",
        "Bir uçlarını masa/cetvel kenarına (aynı \"başlangıç çizgisine\") dayatın.",
        "Diğer uçtan taşanı gösterip \"bu daha uzun\" dedirtin.",
        "Bilerek uçları kaydırıp \"böyle adil mi?\" diye yanılgıyı tartıştırın.",
      ],
      criterion: "Uçları hizalayarak iki nesneyi doğrudan karşılaştırıp uzunu doğru bulursa ✓",
      easy: "Boy farkını belirgin tutun; siz bir ucu kenara dayayın, o tamamlasın.",
      hard: "Boyları çok yakın yapın; biri eğri/yatık dururken \"yine de hizala\" deyin.",
    },
  },
  { // 3 — Uzunluk Dolaylı Karşılaştırıcı (48–60 ay) ★ DARBOĞAZ
    how: "Odanın iki ucundaki, birbirine getirilemeyen iki nesneyi (kapı ile pencere genişliği) karşılaştırmak için çocuk araya bir ip/çubuk koyar: önce birine göre işaretler, sonra ötekiyle kıyaslar. \"Aracıyı\" kullanmayı kendisi düşünmesi kritiktir.",
    teacher: "Bu, yörüngenin ilk büyük darboğazıdır: nesneler yan yana getirilemiyorsa, ARACI bir nesneyle (geçişlilik) dolaylı karşılaştırma gerekir — \"A, ipten uzun; ip, B'den uzun; öyleyse A, B'den uzun.\" Çoğu çocuk bunu kendiliğinden yapmaz; \"hatırlayamıyorsak, taşıyabileceğimiz bir şey kullanalım\" fikrini açıkça öğretin. Aracının karşılaştırma boyunca DEĞİŞMEMESİ (esnememesi, kısalmaması) şarttır — bu yüzden ip yerine sert bir çubuk daha güvenlidir. Dolaylı karşılaştırma, cetvelin de mantıksal atasıdır.",
    act: {
      materials: ["uzaktaki, taşınamayan iki nesne (iki kapı/raf/halı kenarı)", "sabit boyda bir aracı çubuk veya gerilmez ip", "DokunSay çubukları (aracı olarak)"],
      steps: [
        "Birbirine getirilemeyen iki uzunluk gösterin: \"Hangisi uzun, ama yan yana koyamıyoruz?\"",
        "\"Taşıyabileceğimiz bir şey kullanalım\" deyip çubuğu birinciye dayayıp boyunu işaretleyin/akılda tutun.",
        "Aynı çubukla ötekine gidin; çubuk hangisinden uzun/kısa kaldı, karşılaştırın.",
        "\"Çubuk ikisini de ölçtü\" mantığını söyletin: A>çubuk>B ise A>B.",
      ],
      criterion: "İki nesneyi, sabit bir aracı nesneyle dolaylı (geçişli) olarak karşılaştırıp doğru sonuca varırsa ✓",
      easy: "Aracı çubuk ikisinden de açıkça uzun/kısa olsun; siz işaretlemeyi birlikte yapın.",
      hard: "Aracı, nesnelerle yakın boyda olsun; gerilebilen ip verip \"neden güvenli değil?\" diye sorun.",
    },
  },
  { // 4 — 5'e Dek Sıralayıcı (Uzunluk) (48–60 ay)
    how: "Boyları farklı 5 çubuğu çocuk kısadan uzuna dizer: en kısayı bulur, sonra kalanlardan en kısayı… Basamak gibi düzgün bir merdiven çıkar. Henüz oturmamışsa ikişer ikişer doğru kıyaslar ama tüm seriyi tutarlı sıralayamaz.",
    teacher: "Sıralama (seriasyon), doğrudan karşılaştırmayı bir diziye genişletir ve gizli bir geçişlilik içerir: ortadaki çubuk solundakinden uzun, sağındakinden kısadır. Strateji öğretin: \"Her seferinde kalanların EN kısasını seç.\" Çocuklar sık sık yalnız komşu çiftlere bakıp toptan sırayı bozar; tüm dizinin uçlarını ortak bir çizgiye hizalayarak \"merdiven\" görünümünü kontrol ettirin. Bu, sayı sıralamasıyla da (artan büyüklük) aynı mantıktır.",
    act: {
      materials: ["belirgin biçimde farklı boyda 5 çubuk (DokunSay çubukları)", "hizalama için bir taban çizgisi (masa kenarı/şerit)"],
      steps: [
        "5 çubuğu karışık verin: \"Kısadan uzuna bir merdiven yapalım.\"",
        "\"Önce en kısasını bul\" deyin; alt uçları aynı çizgiye dayatın.",
        "\"Şimdi kalanların en kısası?\" diye tek tek ekletin.",
        "Bitince yukarıdan bakıp basamakların düzgün arttığını kontrol ettirin.",
      ],
      criterion: "5 nesneyi uzunluğa göre baştan sona doğru (kısadan uzuna) sıralarsa ✓",
      easy: "3 çubukla ve büyük boy farklarıyla başlayın.",
      hard: "Boy farklarını küçültün; bir çubuğu araya doğru yere yerleştirmesini isteyin.",
    },
  },
  { // 5 — Uç Uca Uzunluk Ölçücü (66–78 ay) ★ DARBOĞAZ
    how: "Bir kalemin boyunu ölçmek için çocuk ataçları uç uca, BOŞLUKSUZ ve üst üste binmeden dizer, sonra ataçları sayar: \"yedi ataç uzunluğunda.\" Henüz oturmamışsa ataçların arasında boşluk bırakır, kimini üst üste koyar ya da eğri dizip yanlış sayar.",
    teacher: "Bu, ölçmenin kalbindeki ikinci büyük darboğazdır: bir uzunluk, boşluksuz ve örtüşmesiz döşenen EŞİT birimlerle kaplanır, sonra birimler sayılır. İki klasik yanılgı: (1) birimler arasında boşluk bırakmak (uzunluğu eksik sayar), (2) birimleri üst üste bindirmek (fazla sayar). Üçüncüsü: farklı boyda birimler karıştırmak. \"Birimler el ele tutuşsun, ne aralarında boşluk kalsın ne de birbirine binsin\" deyin. Başlangıcı kalemin tam ucuyla hizalayın — bu, cetvelin sıfır noktasının habercisidir.",
    act: {
      materials: ["ölçülecek bir kalem/şerit", "çok sayıda özdeş ataç (veya özdeş DokunSay birim çubukları)", "düz bir taban çizgisi"],
      steps: [
        "Kalemi taban çizgisine koyun: \"Kaç ataç uzunluğunda acaba?\"",
        "İlk ataçı kalemin ucuyla hizalayın; sonrakileri uç uca, dokunarak ekletin.",
        "\"Boşluk var mı? Üst üste binen var mı?\" diye birlikte kontrol edin.",
        "Ataçları teker teker sayıp sonucu söyletin: \"... ataç uzunluğunda.\"",
      ],
      criterion: "Birimleri boşluksuz ve örtüşmesiz uç uca dizip sayarak uzunluğu doğru bulursa ✓ (boşluk/örtüşme olursa ✗)",
      easy: "Tam sayıda birime denk gelen kısa bir nesne ve büyük ataçlar kullanın.",
      hard: "Daha uzun nesne, küçük birimler; bilerek boşluklu/üst üste dizip \"bu doğru mu?\" diye yanılgıyı yoklayın.",
    },
    viz: { t: "numline", max: 7, at: [0, 1, 2, 3, 4, 5, 6, 7] },
    tool: "bar",
  },
  { // 6 — 6+ Sıralayıcı (Uzunluk) (66–78 ay)
    how: "Çocuk 6, 7 ya da daha çok çubuğu kısadan uzuna güvenle sıralar; araya yeni bir çubuk verseniz doğru yere yerleştirir. Diziyi tek tek değil, \"buradan büyük ama şundan küçük\" diye ilişkisel düşünerek kurar.",
    teacher: "Seri uzadıkça geçişlilik görünür hâle gelir: bir çubuğu yerleştirmek için hem solundakinden uzun hem sağındakinden kısa olmasını aynı anda sağlamak gerekir. \"En kısayı seç\" stratejisi hâlâ işe yarar; ek olarak \"araya ekleme\" görevleriyle ilişkisel düşünmeyi zorlayın (bir çubuk verip \"bu nereye girer?\"). Bu beceri, sayı doğrusunda bir sayının yerini bulmakla aynı mantıksal yapıdır.",
    act: {
      materials: ["farklı boyda 6+ çubuk (DokunSay çubukları)", "taban çizgisi", "sonradan eklenecek 1–2 ek çubuk"],
      steps: [
        "6+ çubuğu karışık verin: \"Hepsini kısadan uzuna sırala.\"",
        "Alt uçları ortak çizgiye dayatıp merdiveni kurdurun.",
        "Yeni bir çubuk verin: \"Bu nereye girer? Neden orası?\"",
        "Sıralı diziden bir çubuk çıkarıp \"hangisi eksildi, nereden belli?\" diye sordurun.",
      ],
      criterion: "6 ve üzeri nesneyi doğru sıralar ve araya verilen yeni bir nesneyi doğru yere yerleştirirse ✓",
      easy: "6 çubukla ve belirgin farklarla; yalnız baştan sıralama isteyin.",
      hard: "8+ çubuk, küçük farklar; \"ortadakinden uzun ama sondan kısa olanı göster\" gibi ilişkisel sorular.",
    },
  },
  { // 7 — Uzunluk Birimi İlişkilendiren ve Tekrarlayan (78–90 ay)
    how: "Çocuk elinde TEK bir birim çubuk olsa bile masayı ölçebilir: çubuğu koyar, bittiği yeri parmağıyla/işaretle tutar, çubuğu oraya KAYDIRIR ve bunu tekrarlar; kaç kez koyduğunu sayar. Her adımda başladığı yeri tam bittiği yere getirmesi kritiktir.",
    teacher: "Birim tekrarı (unit iteration), uç uca döşemenin zihinsel sıçramasıdır: artık yüzlerce ataça gerek yok; tek bir birimi sistematik tekrarlayarak ölçer. Asıl güçlük, çubuğun bir önceki bittiği noktadan TAM başlatılmasıdır — çocuk boşluk bırakır ya da örtüştürürse sayım bozulur. Bittiği yeri her seferinde işaretletin (\"parmağını burada tut, çubuğu oraya getir\"). Bu beceri doğrudan cetvele köprüdür: cetvel, aynı birimin önceden tekrarlanmış hâlidir.",
    act: {
      materials: ["ölçülecek bir masa/şerit", "TEK bir birim çubuk (bir DokunSay birim çubuğu)", "biten yeri tutmak için parmak/işaret (kalem ucu, çıtçıt)"],
      steps: [
        "Birim çubuğu masanın ucuna hizalayın: \"Tek çubukla nasıl ölçeriz?\"",
        "Çubuğun bittiği yeri parmakla işaretleyin; çubuğu tam oraya kaydırın.",
        "\"Boşluk/örtüşme yok\" diye her kaydırmada kontrol ettirin; adımları sayın.",
        "Sonucu söyletin: \"masa ... çubuk uzunluğunda.\"",
      ],
      criterion: "Tek bir birimi boşluksuz/örtüşmesiz tekrarlayıp (kaydırıp) doğru sayıda yerleştirerek uzunluğu bulursa ✓",
      easy: "Tam sayıda birime denk gelen kısa bir yüzey; siz bittiği yeri tutun, o çubuğu taşısın.",
      hard: "Uzun yüzey, çok adım; sonuna kesir kalsın (\"yaklaşık kaç?\") ya da farklı birimle tekrar ölçtürün.",
    },
    viz: { t: "numline", max: 6, at: [0, 1, 2, 3, 4, 5, 6] },
    tool: "bar",
  },
  { // 8 — Uzunluk Ölçücü (84–96 ay)
    how: "Çocuk cetveli kalemin altına koyar, kalemin bir ucunu cetvelin SIFIR çizgisine hizalar ve öteki ucun denk geldiği sayıyı okur: \"on iki santimetre.\" Cetveldeki çizgileri (cm) tekrarlanmış birimler olarak görür.",
    teacher: "Cetvel, birim tekrarının standartlaşmış hâlidir; ama en yaygın ölçme yanılgısı tam buradadır: çocuk cetveli SIFIR yerine 1 çizgisinden başlatıp bir cm fazla/eksik okur. \"Sayılar çizgilerin değil, ARALIKLARIN adıdır; başlangıç sıfırdır\" deyin. İkinci yanılgı: kalemi cetvelin kenarına değil ortasına koyup kaydırma. Cetveli her seferinde sıfırdan hizalattırın; istenirse cetveli kaydırıp \"3'ten başlasaydık nasıl düzeltirdik?\" diye birimleri saydırarak okumayı pekiştirin.",
    act: {
      materials: ["santimetre cetveli", "ölçülecek kalem/şerit (tam cm'ye denk gelen)", "DokunSay birim çubukları (cetvelle karşılaştırmak için)"],
      steps: [
        "Kalemi cetvelin altına koyun: \"Bir ucu hangi sayıya gelmeli?\" → sıfır.",
        "Sıfıra hizalayıp öteki uçtaki sayıyı okutun.",
        "Bilerek 1'den başlatıp \"kaç çıktı? Doğru mu? Neden değil?\" diye yanılgıyı tartıştırın.",
        "Aynı kalemi birim çubuklarla da ölçüp cetvel sonucuyla karşılaştırın.",
      ],
      criterion: "Cetveli sıfır noktasından hizalayıp uzunluğu doğru cm olarak okursa ✓ (1'den başlatırsa ✗)",
      easy: "Tam cm'ye denk gelen kısa nesneler; sıfır çizgisini renkli işaretleyin.",
      hard: "Cetveli 1'den/3'ten başlatıp \"gerçek uzunluk kaç?\" diye düzelttirin ya da buçuklu (12,5) ölçüm isteyin.",
    },
    viz: { t: "numline", max: 10, at: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
    tool: "bar",
  },
  { // 9 — Kavramsal Cetvel Ölçücü (96–108 ay)
    how: "Cetvel olmadan çocuk \"bu kalem yaklaşık 15 santim\" diye kestirir; sonra ölçtüğünde tahmini gerçeğe yakın çıkar. Bir cm'nin ne kadar olduğunu zihninde TAŞIR ve uzunluğu o birimle imgeler.",
    teacher: "Bu, ölçmenin içselleşmesidir: çocuk artık cetvele bakmadan da birimi (cm) zihinsel bir ölçü olarak kullanır — uzunluğu \"yaklaşık kaç birim sığar\" diye imgeler. Referans noktaları kurun (\"baş parmağın ucu ≈ 1 cm\", \"bir karış ≈ 20 cm\"). Önce tahmin, sonra ölçüm sırası kritiktir: tahmin sayı duygusunu, ölçüm geri bildirimi kalibrasyonu sağlar. Hep önce kestirtin, sonra doğrulatın; \"tahminin neye dayandı?\" diye gerekçe isteyin.",
    act: {
      materials: ["günlük nesneler (kalem, kitap, masa kenarı)", "santimetre cetveli (doğrulama için)", "referans birim (baş parmak ucu ≈ 1 cm, karış)"],
      steps: [
        "Bir nesne gösterin: \"Önce TAHMİN et — kaç santim? Neye benzettin?\"",
        "Tahmini yazın/söyletin; sonra cetvelle birlikte ölçün.",
        "Tahmin ile ölçümü karşılaştırıp \"ne kadar yakındık?\" diye değerlendirin.",
        "Referansla kalibre edin: \"bir karış yaklaşık 20 cm, buna göre bu...\".",
      ],
      criterion: "Cetveli zihinde kavramsal kullanarak uzunluğu makul biçimde kestirir ve ölçümle yakınlığını değerlendirebilirse ✓",
      easy: "Kısa, tanıdık nesneler; bir referans birimi önceden hatırlatın.",
      hard: "Uzun mesafeler (oda genişliği) ya da görmeden \"30 cm'lik bir parça göster\" deyin.",
    },
  },
  { // 10 — Bütünleşik Kavramsal Yol Ölçücü (96–110 ay)
    how: "Çocuk düz olmayan bir yolu (köşeli bir labirent, dikdörtgenin çevresi) ölçerken onu düz parçalara böler, her parçayı ayrı ölçer ve toplamı alır: \"üç artı dört artı üç... on santim.\" Bükük uzunluğu, düz parçaların toplamı olarak görür.",
    teacher: "Bu düzeyde uzunluk EKLEMELİ bir niceliğe dönüşür: bir yol/çevre, parçalarının uzunluklarının toplamıdır (parça-bütün). Klasik yanılgı: köşeli yolu uçtan uca tek düz çizgiyle ölçmeye çalışmak (köşeleri \"kestirmek\"). Yolu kırıklarından parçalara böldürün, her parçayı ölçtürün, sonra toplattırın. Çevre kavramı (dikdörtgenin dört kenarının toplamı) bu becerinin doğrudan uygulamasıdır; bu, ileride alan ve uzunluk akıl yürütmesinin zeminidir.",
    act: {
      materials: ["köşeli bir yol/şekil (bantla zemine çizili veya kâğıtta dikdörtgen)", "santimetre cetveli veya birim çubuklar", "parça uzunluklarını yazmak için kâğıt"],
      steps: [
        "Bükük yolu gösterin: \"Bunu tek düz çizgiyle ölçemeyiz — ne yapsak?\"",
        "Yolu köşelerinden düz parçalara böldürün; her parçayı ayrı ölçün.",
        "Parça uzunluklarını yan yana yazın; birlikte toplayın.",
        "Dikdörtgende dört kenarı ölçüp \"çevre = hepsinin toplamı\" dedirtin.",
      ],
      criterion: "Düz olmayan bir yolu/çevreyi parçalara bölüp her parçayı ölçerek ve toplayarak doğru uzunluğu bulursa ✓",
      easy: "İki-üç parçalı basit bir yol; parça uzunluklarını tam sayı tutun.",
      hard: "Çok parçalı yol ya da kenarları farklı dikdörtgen; \"karşılıklı kenarlar eşit\" örüntüsünü kullandırın.",
    },
  },
  { // 11 — Soyut Uzunluk Ölçücü (96–120 ay)
    how: "Çocuk standart olmayan bir birimle (ör. bir ataç boyu) ölçtüğü uzunluğu başka bir birime çevirebilir: \"masa 20 ataç; bir ataç 3 cm ise, masa 60 cm.\" Birimi soyut bir çarpan gibi kullanır; birim küçülünce sayının büyüdüğünü bilir.",
    teacher: "Bu, uzunluk yörüngesinin doruğudur: ölçü artık \"birim sayısı × birim büyüklüğü\" olarak SOYUTLANIR. Çocuk ters orantıyı kavrar — aynı uzunluk küçük birimle daha çok, büyük birimle daha az sayı verir (\"birim küçükse sayı büyür\"). Birim dönüşümünü (ataç↔cm, adım↔metre) çarpma/bölme ile ilişkilendirin. \"Hangi birimle ölçtüğünü söylemeden sayı tek başına anlam taşımaz\" ilkesini vurgulayın; bu, ölçü birimlerinin ve oranların kapısıdır.",
    act: {
      materials: ["bir uzunluk (masa/şerit)", "iki farklı boyda birim (kısa + uzun çubuk, ya da ataç + DokunSay birim çubuğu)", "santimetre cetveli", "dönüşümü yazmak için kâğıt"],
      steps: [
        "Aynı masayı önce kısa, sonra uzun birimle ölçtürün; iki farklı sayı çıksın.",
        "\"Masa değişmedi; sayı neden farklı?\" diye ters orantıyı tartıştırın.",
        "Bir birimin kaç cm olduğunu ölçüp \"... birim × ... cm\" ile toplam cm'yi buldurun.",
        "Ters yöne gidin: \"60 cm kaç ataç eder?\" diye birim dönüştürün.",
      ],
      criterion: "Soyut/standart olmayan birimlerle doğru ölçer ve birim sayısı ile birim boyu arasındaki ilişkiyi kullanarak birim dönüştürürse ✓",
      easy: "Birimler arasında tam katlı ilişki (1 uzun = 2 kısa); küçük sayılar.",
      hard: "Tam katlı olmayan dönüşümler (1 ataç = 3 cm, buçuklu sonuçlar) ya da çok adımlı dönüşüm zinciri.",
    },
  },
]
