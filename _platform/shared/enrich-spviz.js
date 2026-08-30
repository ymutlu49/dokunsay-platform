// Uzamsal Görselleştirme (Spatial Visualization) — düzey zenginleştirmesi (Clements & Sarama)
// trajectories.data.js içindeki "spviz" yörüngesinin 7 düzeyini öğretmen/veli için
// derinleştirir. Altın-standart şablon: yorunge.enrich.js (sub).
// Pedagojik yay: sezgisel hareket → somut kaydırma/yansıtma/döndürme →
// basit kaydırma-döndürme (DARBOĞAZ) → başlangıç üç dönüşüm → güvenli üç dönüşüm →
// çapraz hareket → ZİHİNSEL hareket (dönüşümü zihinde öngörme).
// Çekirdek geçiş: somut elle çevirme → zihinsel imgeleme ("parçayı çevirsen neye benzer").
// Uzamsal beceri matematik/geometri ve STEM başarısının güçlü bir yordayıcısıdır.
// Her düzey: how (nasıl görünür) · teacher (öğretmen notu) · act (etkinlik) ·
// tool (opsiyonel DokunSay aracı; "geo"). viz KOYMA → amblem 🔄.
export default [
  { // 0 — Sezgisel Hareket Ettiren: Temeller (0–24 ay)
    how: "Bebek, elindeki halkayı çubuğa geçirmek ya da bir kapağı kutuya oturtmak için kendiliğinden bileğini çevirir, parçayı sağa sola kaydırır. Henüz \"döndürdüm\" diyemez; eli, gözüne uyacak yolu deneyerek bulur. Bir blok deliğe uymayınca onu çevirip yeniden dener.",
    teacher: "Bu, uzamsal dönüşümün en erken, dile dökülmemiş tohumudur: çocuk nesnelerin döndürülünce, kaydırılınca başka türlü oturduğunu eliyle keşfeder. Amaç \"döndürme\" öğretmek değil; çevirip-deneme fırsatını bolca sunarak el-göz eşgüdümünü ve \"parçalar hareket eder\" sezgisini beslemektir. Sonraki tüm uzamsal akıl yürütme bu bedensel keşfe yaslanır — uzamsal beceri ileride geometri ve STEM başarısının güçlü bir yordayıcısıdır.",
    act: {
      materials: ["büyük delikli şekil-sokmalı oyuncak (daire, kare blok)", "halka takılan bir çubuk ya da iri yapboz parçaları"],
      steps: [
        "Çocuğun önüne tek bir iri blok ve uyduğu deliği koyun, birlikte bakın.",
        "Blok uymayınca acele etmeyin: \"hadi başka türlü deneyelim\" deyip çevirmesini bekleyin.",
        "Kendiliğinden çevirip kaydırarak denemesini gözleyin; oturunca coşkuyla onaylayın.",
        "Aynı oyunu farklı şekillerle (yuvarlak kolay, üçgen zor) günün farklı anlarında yineleyin.",
      ],
      criterion: "Bir parçayı yerine oturtmak için kendiliğinden çevirir/kaydırırsa (deneme-yanılmayla da olsa) ✓",
      easy: "Yalnız yuvarlak/silindir gibi her yönü uyan parçalarla başlayın — çevirme zorunlu olmasın.",
      hard: "Tek bir yöne oturan şekiller (üçgen, yarım ay) verip çevirme gereğini artırın.",
    },
  },
  { // 1 — Somut Kaydıran, Yansıtan, Döndüren (12–36 ay)
    how: "Çocuk bir yapboz parçasını boşluğa sokarken parçayı eliyle kaydırır (öteler), bazen ters çevirir (yansıtma), bazen döndürür — hepsini fiziksel deneme-yanılmayla. \"Olmadı, şöyle çevireyim\" der gibi parçayı elinde evirip çevirir; doğru yönü gözüyle değil, eliyle bulur.",
    teacher: "Burada üç temel dönüşüm — kaydırma (öteleme), yansıtma (ayna/ters çevirme) ve döndürme — ilk kez SOMUT olarak, elle yapılır. Çocuk henüz sonucu zihninde göremez; bu yüzden bolca fiziksel deneme normaldir ve teşvik edilmelidir. Parçayı elinde çevirmesine izin verin, \"kaydır\", \"çevir\", \"ters çevir\" sözcüklerini onun hareketine eşlik ederek söyleyin ki eylem bir ada kavuşsun. Acele edip parçayı siz yerleştirmeyin — keşif elin işidir.",
    act: {
      materials: ["DokunSay Geo döndürülebilir parçaları ya da iri ahşap yapboz", "2–4 boşluklu basit bir çerçeve/tahta"],
      steps: [
        "Bir parçayı ve uyduğu boşluğu gösterin: \"bunu buraya yerleştirebilir misin?\"",
        "Parçayı elinde çevirip kaydırarak denemesine izin verin; siz yerine koymayın.",
        "Hareketini adlandırın: \"kaydırdın… çevirdin… işte ters çevirince oldu!\".",
        "Kaydırma (sadece itme), döndürme (çevirme) ve yansıtma (ters) gereken ayrı parçalarla yineleyin.",
      ],
      criterion: "Bir parçayı boşluğa sokmak için kaydırma/yansıtma/döndürmeyi elle (deneme-yanılmayla) yaparsa ✓",
      easy: "Yalnız kaydırma (öteleme) gereken, doğru yönde verilmiş parçalarla başlayın.",
      hard: "Hem döndürme hem ters çevirme gereken (asimetrik, aynalı) parçalar verin.",
    },
    tool: "geo",
  },
  { // 2 — Basit Kaydıran ve Döndüren (36–60 ay) ★ DARBOĞAZ
    how: "Çocuk kolay bir boşluğa parçayı \"çevirip yerleştir\" dendiğinde, az sayıda denemeyle doğru yapar: bir kez kaydırır ve gerekirse bir miktar döndürür. Henüz oturmamışsa parçayı rastgele evirip çevirir, doğru açıyı bulması uzun sürer ya da yansıtma (ters çevirme) gerektiğinde tıkanıp kalır.",
    teacher: "Basit kaydırma-döndürme bu yörüngenin ilk gerçek DARBOĞAZIDIR: çocuk artık her parçayı tümüyle deneme-yanılmaya bırakmadan, basit bir kaydırma veya küçük bir döndürmeyi amaçlı yapabilmelidir. Burada uzun süreli takılma uzamsal gelişimde erken bir uyarı işaretidir — uzamsal beceri matematik ve geometri başarısının güçlü bir yordayıcısı olduğundan ihmal edilmemelidir. Çocuğa \"önce nereye bakıyor, sonra ne kadar çevirmeli?\" diye düşündürün; parçanın bir kenarını işaret edip \"bu kenar nereye gelmeli?\" diyerek tek bir hareketi hedefletin. Kaydırma ile döndürmeyi ayrı ayrı çalıştırın ki ikisi karışmasın.",
    act: {
      materials: ["DokunSay Geo döndürülebilir parçaları", "tek bir kolay boşluk (yalnız hafif kaydırma ya da küçük döndürme gerektiren)", "parçanın yönünü belli eden bir işaret/nokta (üst kenara)"],
      steps: [
        "Parçayı boşluğa neredeyse hizalı verin: \"sadece kaydır, yerine otursun.\"",
        "Sonra hafifçe yatık verin: \"şimdi biraz çevir, üstteki nokta yukarı baksın.\"",
        "Çocuk rastgele çeviriyorsa durdurup \"hangi kenar nereye gelmeli?\" diye tek hedef gösterin.",
        "Doğru oturunca \"bir kaydırma, bir çevirme — oldu!\" diyerek hareketi sözle özetleyin.",
      ],
      criterion: "Kolay bir boşluğa parçayı basit bir kaydırma veya döndürmeyle, amaçlı (uzun deneme-yanılma olmadan) yerleştirirse ✓",
      easy: "Yalnız kaydırma gereken boşluklarla çalışın; parçayı doğru açıda verin.",
      hard: "Daha büyük döndürme (90°) ya da hafif ters çevirme gereken boşluklar ekleyin.",
    },
    tool: "geo",
  },
  { // 3 — Başlangıç Kaydıran, Yansıtan, Döndüren (54–72 ay)
    how: "Çocuk yansıtma (ters/ayna) gerektiren bir yerleştirmeyi başlangıç düzeyinde başarır: parçayı çevirip ters yüz ederek boşluğa oturtur, ama hâlâ bir miktar deneme-yanılmaya başvurur. Üç dönüşümü de (kaydırma, yansıtma, döndürme) yapabilir; yalnız hangisinin gerektiğini bazen elinde deneyerek anlar.",
    teacher: "Bu düzeyde üç dönüşüm BİRLİKTE, ama henüz başlangıç (deneme-yanılma destekli) düzeyinde elde edilir. En zorlanılan dönüşüm genellikle yansıtmadır (ayna görüntüsü): döndürmekle düzelmeyen, ancak ters çevirince oturan parçalar çocuğu zorlar. \"Bu parça döndürünce mi, yoksa ters çevirince mi uyar?\" diye iki seçeneği ayırt ettirin. Burada somuttan zihinsele geçişin ilk kıvılcımı belirir: yerleştirmeden önce \"sence şöyle çevirsek olur mu?\" diye kısa bir tahmin isteyin, sonra elle sınatın.",
    act: {
      materials: ["DokunSay Geo parçaları (aynalı/asimetrik çiftler dâhil)", "yansıtma gerektiren boşluklu çerçeve", "ayna ya da iki özdeş-ama-ters parça"],
      steps: [
        "Yalnız ters çevirince (yansıtma) uyan bir boşluk verin: \"bunu nasıl uydururuz?\"",
        "Çocuk önce döndürmeyi denesin; olmayınca \"ya ters çevirsek?\" diye yansıtmaya yöneltin.",
        "Üç hareketi adlandırarak ayırt ettirin: kaydır (yerini değiştir), döndür (çevir), yansıt (ters yüz et).",
        "Yerleştirmeden önce \"sence olur mu?\" diye kısa bir tahmin alın, sonra elle deneyin.",
      ],
      criterion: "Kaydırma, yansıtma ve döndürmenin üçünü de (yansıtma dâhil) başlangıç düzeyinde, deneme-yanılmayla doğru uygularsa ✓",
      easy: "Yansıtma yerine yalnız kaydırma+döndürme gereken boşluklarla başlayın.",
      hard: "Döndürme ve yansıtmanın birlikte gerektiği parçalar verin; tahmini elle sınamadan önce sözle savundurun.",
    },
    tool: "geo",
  },
  { // 4 — Kaydıran, Yansıtan, Döndüren (66–84 ay)
    how: "Çocuk 90°/180° döndürme ya da yansıtma gerektiren bir yerleştirmeyi, parçayı eline almadan önce zihninde \"şöyle oturur\" diye görerek güvenle yapar. Deneme-yanılma neredeyse kaybolur: doğru dönüşümü bir bakışta seçer, parçayı tek hamlede yerine koyar.",
    teacher: "Bu, somuttan ZİHİNSEL imgeye geçişin sağlamlaştığı düzeydir: çocuk artık üç dönüşümü zihninde canlandırıp güvenle uygular, elle yoklamaya gerek kalmadan doğru açı/yönü öngörür. Asıl kazanım hız değil, dönüşümü önceden \"görmek\"tir. \"Bu parçayı çeyrek tur çevirsen neye benzer?\" gibi sorularla zihinsel imgeyi sözle yoklayın; çocuk yanıtını parçayı çevirmeden versin, sonra kendi kendine doğrulasın. Bu zihinsel dönüştürme becerisi, geometri ve uzamsal akıl yürütmenin — dolayısıyla ileri matematik başarısının — çekirdeğidir.",
    act: {
      materials: ["DokunSay Geo parçaları", "90° ve 180° döndürme/yansıtma gerektiren boşluklu kartlar", "kapatma kartı (parçayı kısa süre gizlemek için)"],
      steps: [
        "Bir boşluk gösterip parçayı yana koyun: \"eline almadan, nasıl çevirirsen uyar?\"",
        "Çocuk dönüşümü sözle/elle havada göstersin, sonra parçayı tek hamlede yerleştirsin.",
        "\"Bunu yarım tur (180°) çevirsen neye benzer?\" diye zihinsel imgeyi sınayın.",
        "Aynı parçayı farklı yönlerde isteyerek (çeyrek tur, ters) güvenli seçimi pekiştirin.",
      ],
      criterion: "90°/180° döndürme veya yansıtma gereken yerleştirmeleri, zihinsel imgeyle güvenle (deneme-yanılmasız) yaparsa ✓",
      easy: "Yalnız 90° döndürmeyle sınırlı tutun; parçayı gizlemeden, açıkça gösterin.",
      hard: "180° + yansıtmanın birlikte gerektiği boşluklar; parçayı kapatıp \"görmeden\" tahmin ettirin.",
    },
    tool: "geo",
  },
  { // 5 — Çapraz Hareket Ettiren (78–96 ay)
    how: "Çocuk çapraz (45°) bir kaydırma ya da yansıtma gerektiren görevi doğru yapar: parçayı köşegen yönünde öteler ya da eğik bir eksene göre çevirir. Artık yalnız dik/yatay değil, eğik yönlerde de dönüşümü güvenle uygular.",
    teacher: "Çapraz hareket, dönüşümlerin yatay-dikey eksenden çıkıp eğik (45°) yönlere genişlemesidir: çocuk artık ara açıları ve köşegen ötelemeleri de zihninde canlandırabilir. Bu, koordinat düşüncesinin ve geometrik dönüşümlerin (öteleme/yansıma/dönme) daha soyut hâline köprüdür. \"Bu sefer düz değil, köşeye doğru\" diyerek çapraz yönü vurgulayın; eğik bir eksen (köşegen çizgi) çizip parçayı ona göre yansıtmasını isteyin. Çocuğun çapraz dönüşümü önce zihinde kestirip sonra uygulaması beklenir.",
    act: {
      materials: ["DokunSay Geo parçaları", "köşegen (45°) yerleşim gerektiren boşluklu kartlar", "eğik bir yansıma ekseni (çapraz çizgi/şerit)"],
      steps: [
        "Bir parçayı köşegen yönünde kaydırması gereken boşluk verin: \"köşeye doğru kaydır.\"",
        "Çapraz bir eksen çizip \"bu eğik çizgiye göre ters çevir\" diyerek 45° yansıtma isteyin.",
        "Çocuk yönü önce zihninde kestirsin (\"sence nereye gider?\"), sonra uygulasın.",
        "Dik/yatay ve çapraz görevleri karıştırarak \"bu düz mü, çapraz mı?\" ayrımını pekiştirin.",
      ],
      criterion: "Çapraz (45°) kaydırma veya yansıtmayı doğru, amaçlı olarak (eğik yönde) yaparsa ✓",
      easy: "Yalnız çapraz kaydırma (öteleme) ile başlayın; eksen çizgisini belirgin tutun.",
      hard: "Çapraz yansıtma + döndürmeyi birleştirin ya da ekseni kaldırıp yalnız zihinden çözdürün.",
    },
    tool: "geo",
  },
  { // 6 — Zihinsel Hareket Ettiren (90–108 ay)
    how: "Çocuğa \"bu parçayı çevirsen neye benzer?\" diye sorduğunuzda, parçayı eline hiç almadan sonucu zihninde döndürüp doğru şekli söyler ya da seçenekler arasından gösterir: \"çeyrek tur çevirirsem L gibi olur.\" Dönüşümü tümüyle zihinde, gözle değil imgelemle çözer.",
    teacher: "Bu, uzamsal görselleştirmenin doruğudur: dönüşümün sonucunu fiziksel hareket olmadan, yalnızca ZİHİNSEL imgelemle öngörme. Çocuk parçayı zihninde döndürür/yansıtır ve sonucu kestirir — bu zihinsel döndürme becerisi, geometri, ölçme ve ileri matematik ile bütün STEM alanlarındaki başarının en güçlü uzamsal yordayıcılarından biridir. \"Çevirmeden söyle, sonra kontrol edelim\" diyerek önce tahmin, sonra elle doğrulama döngüsü kurun; çocuğun yanıtını gerekçelendirmesini (\"çünkü uzun kenar yana gelir\") isteyin. Tahmin tutmasa da süreç değerlidir — zihinsel imge böyle güçlenir.",
    act: {
      materials: ["DokunSay Geo parçaları (kontrol için)", "döndürme/yansıtma sonucu için seçenekli kartlar (\"hangisine benzer?\")", "kapatma kartı"],
      steps: [
        "Bir parça gösterip kapatın: \"bunu çeyrek tur çevirsen, şu üç şekilden hangisine benzer?\"",
        "Çocuk parçaya dokunmadan zihinde çevirip yanıtlasın ve gerekçelendirsin.",
        "Sonra Geo parçasıyla gerçekten çevirip tahminini birlikte doğrulayın.",
        "Döndürme, yansıtma ve çapraz dönüşümleri sırayla \"önce zihinde, sonra elle\" çalıştırın.",
      ],
      criterion: "Bir dönüşümün (döndürme/yansıtma) sonucunu parçaya dokunmadan, yalnızca zihninde doğru öngörürse ✓",
      easy: "Yalnız 90° döndürme sorun; iki belirgin seçenek arasından gösterterek başlayın.",
      hard: "Birden çok dönüşümü zincirleyin (\"çevir, sonra ters çevir — neye benzer?\") ve elle doğrulamayı kaldırın.",
    },
    tool: "geo",
  },
]
