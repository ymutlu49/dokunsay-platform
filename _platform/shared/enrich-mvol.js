// Ölçme: Hacim (Volume Measurement) — düzey zenginleştirmesi (Clements & Sarama)
// trajectories.data.js EXT içindeki "mvol" yörüngesinin 8 düzeyini öğretmen/veli
// için derinleştirir. Altın-standart şablon: yorunge.enrich.js (sub).
// Hacim 3B bir yapıdır; uygun 2B primitif olmadığından viz YOKTUR — generator
// amblem (🧪) gösterir. Araç: DokunSay Geo (küpler ve kaplar) — tool: "geo".
export default [
  { // 0 — Hacim Sezici: Temeller (0–24 ay)
    how: "Bebek/küçük çocuk bir bardağı suyla, bir kovayı kumla doldurup boşaltmaktan bıkmaz; küçük kabı büyük kabın içine sokar, dolu bir kabı eline alınca \"ağır/dolu\", boş kabı \"hafif/boş\" diye sezer. Henüz \"daha çok alır\" diyemez ama bir kabın \"ne kadar aldığını\" doldurup boşaltarak yaşar.",
    teacher: "Bu, hacim/kapasite sezgisinin en erken tohumudur: çocuk miktarı adlandırmadan, tamamen DOLDURUP BOŞALTARAK ve kaba dokunarak tanır. Sık bir yetişkin alışkanlığı, su/kum oyununu \"sadece dağıtıyor\" diye geçiştirmektir — oysa bir kabı tekrar tekrar doldurmak, taşırmak, başka kaba aktarmak sonraki tüm hacim ölçmenin somut zeminidir. Adlandırmaya değil, bol bol doldur-boşalt deneyimine alan açın; siz \"doldu!\", \"taştı!\", \"hâlâ yer var\" gibi sözlerle yaşantıyı besleyin.",
    act: {
      materials: ["su veya kuru malzeme (kum, pirinç, mercimek) için bir leğen", "farklı boyutta birkaç kap, bardak, kova / DokunSay Geo kapları", "aktarmak için küçük bir bardak ya da kepçe"],
      steps: [
        "Çocuğa bir bardak ve bir kova verin: \"Hadi dolduralım!\" deyip birlikte doldurun.",
        "Dolu kabı boşaltıp \"bitti, boş!\"; yeniden doldurup \"doldu!\" diye yaşantıyı adlandırın.",
        "Küçük bardakla büyük kaba aktartın; taşınca \"taştı!\" deyin.",
        "Dolu ve boş kabı birlikte elinde tartıtıp \"bu dolu, bu boş\" diye sezdirin.",
      ],
      criterion: "Kapları doldurup boşaltarak, aktararak \"dolu/boş\" ya da \"ne kadar aldığını\" sezgisel fark ederse ✓",
      easy: "Tek bir bardak ve tek bir kapla, yalnız doldur-boşalt yaptırın; siz hareketi modelleyin.",
      hard: "Birkaç kabı karıştırıp \"hangisi daha çok doldu?\" gibi sezgiye dayalı küçük gözlemler sorun.",
    },
    tool: "geo",
  },
  { // 1 — Hacim Niceliği Tanıyıcı (12–30 ay)
    how: "İki kabı gösterip \"Hangisi daha çok su/kum alır?\" dediğinizde çoğu zaman daha büyük/geniş kabı seçer; \"çok\", \"az\", \"dolu\", \"taşar\" sözcüklerini kapasiteyi anlatmak için kullanır. Hacmi artık yalnız yaşamakla kalmaz, kaplar arasında bir NİCELİK olarak karşılaştırır.",
    teacher: "Burada hacim sezgisi dile değer: \"ne kadar alır\" karşılaştırılabilir bir nicelik olur. Çocuk çoğunlukla algıya (boy/genişlik) dayanır — uzun ince bir kabı her zaman \"daha çok\" sanabilir; bu normaldir, henüz ölçmüyor, gözüyle yargılıyor. Yargısını sınamak için iki kabı gerçekten doldurup birinden ötekine aktarın: \"Bakalım, taştı mı, yoksa yer mi kaldı?\" Böylece nicelik sözcükleri (çok/az/daha çok) somut bir doldurma deneyimine bağlanır.",
    act: {
      materials: ["belirgin biçimde farklı kapasitede iki kap (geniş alçak ↔ dar yüksek) / DokunSay Geo kapları", "su veya kuru malzeme", "aktarma için kepçe/bardak"],
      steps: [
        "İki kabı yan yana koyun: \"Sence hangisi daha çok alır?\" diye tahmin ettirin.",
        "Birini ağzına dek doldurup ötekine aktarın; \"taştı mı, yer mi kaldı?\" diye baktırın.",
        "Sonucu adlandırın: \"Demek bu kap daha çok alıyormuş.\"",
        "Kapları değiştirip \"şimdi hangisi daha çok?\" diye yineleyin.",
      ],
      criterion: "İki kabı karşılaştırıp \"hangisi daha çok alır?\" sorusuna kapasiteyi bir nicelik olarak (çok/az) yanıtlarsa ✓",
      easy: "Kapasite farkı çok belirgin olsun (küçük bardak ↔ büyük kova); tahmini aktararak hemen doğrulayın.",
      hard: "Aynı miktarı alan ama farklı biçimli iki kapla (yanıltıcı: dar-uzun ↔ geniş-alçak) yoklayın.",
    },
    tool: "geo",
  },
  { // 2 — Hacim Doldurucu (36–48 ay)
    how: "Çocuk küçük bir bardakla büyük bir kabı, kepçe kepçe boşaltarak doldurur; ya da küçük küpleri bir kutunun içine, boşluk kalmasın diye yan yana ve sıkışık yerleştirir. Henüz \"kaç bardak\" saymaz ama kabın içini bir birimle DOLDURMAYI ve küpleri PAKETLEMEYİ becerir.",
    teacher: "Bu, hacmi ölçmenin ilk eylemli adımıdır: iç hacmi bir birimle (bardak dolusu ya da küp) doldurmak/paketlemek. Sık bir kısıt, çocuğun küpleri gelişigüzel atması ve aralarında boşluk bırakmasıdır — bu, ileride \"kaç küp sığar\" saymasını bozar. Boşluksuz, hizalı paketlemeyi modelleyin: \"Aralarında boşluk kalmasın, sımsıkı dizelim.\" Doldururken kullandığınız birimi (hep AYNI bardak) sabit tutun; birim değişirse karşılaştırma anlamını yitirir.",
    act: {
      materials: ["doldurulacak bir kutu/kap + onu dolduracak özdeş küçük küpler / DokunSay Geo küpleri", "ya da büyük bir kap + tek bir küçük ölçü bardağı", "su/kum (bardakla doldurma için)"],
      steps: [
        "Boş kutuyu ve bir avuç özdeş küpü gösterin: \"Bu kutuyu küplerle dolduralım.\"",
        "İlk sırayı boşluksuz, hizalı dizmesini modelleyin: \"sımsıkı, aralık yok.\"",
        "Çocuk tabandan başlayıp boşlukları doldurarak kutuyu paketlesin.",
        "Bardakla doldurma türünde: hep aynı bardakla büyük kabı kepçe kepçe doldurtun.",
      ],
      criterion: "Bir kabı tek tip birimle (bardak ya da küp) boşluk bırakmadan doldurur/paketlerse ✓",
      easy: "Küçük, tabanı tek sıra alan bir kutu; iri küpler kullanın, ilk sırayı siz birlikte dizin.",
      hard: "Daha büyük/derin kutu; \"hiç boşluk kalmadı mı?\" diye sıkışık paketlemeyi denetletin.",
    },
    tool: "geo",
  },
  { // 3 — Hacim Niceleyici (60–72 ay) ★ DARBOĞAZ
    how: "Çocuğa \"Bu kutuya kaç küp sığar?\" dediğinizde küpleri yerleştirip SAYAR ve bir sayı söyler. Henüz oturmamışsa yalnız görünen tabandaki ya da bir yüzdeki küpleri sayar, kutu yarı doluyken \"doldu\" sanır; küpleri üst üste katlayarak kabın derinliğini (üçüncü boyutu) hesaba katmayı unutur.",
    teacher: "Burası yörüngenin ilk gerçek darboğazıdır: doldurmayı NİCELEME. Çocuk artık yalnız doldurmamalı, \"kaç birim\" diye saymalı VE kabın üç boyutlu (en–boy–yükseklik/derinlik) olduğunu kavramalıdır. En sık ve en inatçı yanılgı, bir kabı tek bir yüzeyle (yalnız taban ya da ön yüz) eşitleyip içini/derinliğini görmemektir — kutu yarı doluyken \"doldu\" demek bunun işaretidir. Mutlaka katmanları üst üste koydurun ve \"daha yukarı yer var mı?\" diye derinliği sorgulatın; yarı dolu bir kutuyu gösterip \"bu dolu mu, daha kaç küp sığar?\" diye fark ettirin. Hıza değil, üç boyutu birden hesaba katma alışkanlığına odaklanın.",
    act: {
      materials: ["şeffaf ya da açık bir kutu + onu tam dolduracak özdeş küpler / DokunSay Geo küpleri", "yarı doldurulup gösterilecek bir örnek kutu", "saydıkça ayırmak için küçük bir tepsi"],
      steps: [
        "Yarı dolu bir kutu gösterin: \"Bu kutu doldu mu? Daha kaç küp sığar?\" diye derinliği sorgulatın.",
        "Çocuk kutuyu üst üste katmanlar hâlinde doldursun; her küpü sayarak koysun.",
        "\"Daha yukarı yer var mı?\" diye sorup en üst katmana kadar doldurtun.",
        "Toplam kaç küp sığdığını söyletin; \"kutu üç boyutlu — taban değil, içi dolduruldu\" deyin.",
      ],
      criterion: "Bir kaba kaç birim sığdığını sayarak niceler VE kabın üç boyutunu (yalnız tabanı değil, derinliği de) hesaba katarsa ✓",
      easy: "Tabanı tek sıra (ör. 1×3) alan sığ bir kutu; tek katmanla başlayıp \"şimdi üstüne bir kat daha\" deyin.",
      hard: "Derin bir kutu; yarı doluyken \"doldu mu?\" diye yoklayın ya da \"sığacak küp sayısını yerleştirmeden tahmin et\" deyin.",
    },
    tool: "geo",
  },
  { // 4 — Hacim Birimi İlişkilendiren ve Tekrarlayan (84–96 ay)
    how: "Çocuk elinde tek bir ölçü kabı (ya da tek bir küp) ile bir kabı ölçer: aynı birimi tekrar tekrar doldurup boşaltarak \"bir, iki, üç… bu kova altı bardak alıyor\" der. Birimin hep AYNI kalması gerektiğini bilir; sayarken kaç kez doldurduğunu takip eder.",
    teacher: "Bu, hacimde birim tekrarı (iteration) ilkesidir: tek bir birimi üst üste kullanarak ölçmek — uzunlukta tek bir cetvel-biriminin tekrarlanmasının hacim karşılığı. Çocuk artık her seferinde yeni bir kap kullanmaz; tek birimi yineler ve kaç yinelediğini sayar. Sık yanılgı, doldururken birimi tam doldurmamak ya da yarım dökmektir — \"her seferinde ağzına kadar, eksiksiz\" deyin. Hangi birimi kullandığınızı vurgulayın: \"Bu kova 6 BARDAK\"; birim değişirse sayı da değişir (\"6 bardak ama 12 küçük fincan\") — bunu fark ettirmek ölçü birimi kavramını güçlendirir.",
    act: {
      materials: ["ölçülecek bir kova/büyük kap", "tek bir ölçü birimi: aynı bardak ya da tek bir küp / DokunSay Geo birimi", "kaç kez doldurulduğunu işaretlemek için sayma çetelesi/parmaklar", "su veya kum"],
      steps: [
        "Büyük kabı ve tek bir bardağı gösterin: \"Yalnız bu bardakla ölçeceğiz.\"",
        "Bardağı ağzına dek doldurup kaba boşaltın; her seferinde \"bir… iki… üç…\" sayın.",
        "Kova dolana dek aynı bardağı yineleyin; toplam kaç bardak olduğunu söyletin.",
        "Aynı kovayı daha küçük bir birimle yeniden ölçtürün: \"Neden sayı değişti?\" diye birimi konuşun.",
      ],
      criterion: "Tek bir birimi tekrarlayarak bir kabı ölçer, kaç kez yinelediğini doğru sayar ve birimi sabit tutarsa ✓",
      easy: "Az yineleme gereken kap (3–4 bardak); siz birlikte sayıp çeteleyi tutun.",
      hard: "Çok yineleme (8+) gereken kap ya da \"kova kaç bardak alır, ölçmeden tahmin et\" deyip sonra doğrulatın.",
    },
    tool: "geo",
  },
  { // 5 — Başlangıç Bileşik 3B Yapılandırıcı (84–102 ay)
    how: "Küplerle dolu bir kutuda \"Bir katmanda (bir katta) kaç küp var?\" dediğinizde tabandaki küpleri satır-sütun olarak görüp sayar: \"Üç sıra, her sırada dört — bir katta on iki.\" Kutunun küplerden KATMANLAR hâlinde oluştuğunu sezmeye başlar; tek tek dağınık değil, düzenli bir yapı görür.",
    teacher: "Bu düzeyde çocuk kutunun içini DİZİ/KATMAN olarak görmeye başlar: bir katman, satır × sütun düzeninde bir kareler-dizisidir. Bu, çarpımsal hacmin (taban dizisi × yükseklik) algısal tohumudur. Henüz tüm kutuyu tek seferde çarpımsal düşünemeyebilir, ama \"bir katmanı\" bir birim olarak görmesi kritik bir adımdır. Bir katmanı elle gösterip \"işte bu bir kat\" deyin; satır ve sütunları parmakla saydırın. \"Kaç sıra, her sırada kaç?\" sorusuyla katmanı diziye bağlayın — bu, sonraki katman-yapılandırma darboğazına hazırlıktır.",
    act: {
      materials: ["sığ, açık bir kutu + tek bir katmanı dolduracak özdeş küpler / DokunSay Geo küpleri", "katmanı ayrı gösterebilmek için düz bir tepsi/zemin", "satır-sütunu işaretlemek için renkli ayraç (ops.)"],
      steps: [
        "Kutunun tabanını küplerle tek katman dolu hâle getirin: \"Bu bir kat.\"",
        "\"Kaç sıra var? Her sırada kaç küp?\" diye satır ve sütunu ayrı saydırın.",
        "\"Bir katta toplam kaç küp?\" diye katmanı bir bütün olarak söyletin (ör. 3×4 = 12).",
        "Bir katmanı tepsiye alıp \"işte tam bir kat\"; sonra \"üstüne bir kat daha gelse?\" diye sezdirin.",
      ],
      criterion: "Bir kutuda bir katmanın satır-sütun yapısını görüp \"bir katta kaç küp\" olduğunu (dizi olarak) söylerse ✓",
      easy: "Küçük taban (2×3); satır ve sütunu siz parmakla gösterip birlikte sayın.",
      hard: "Daha büyük taban (4×5) ya da \"iki kat olsa toplam kaç?\" diye katman fikrini bir adım uzatın.",
    },
    tool: "geo",
  },
  { // 6 — 3B Satır ve Sütun Yapılandırıcı (96–108 ay) ★ DARBOĞAZ
    how: "Bir kutuyu \"her katta 6 küp var, 3 kat — toplam kaç?\" diye katman katman örgütleyip sayar: bir katmanı (satır × sütun) bulur, sonra kat sayısıyla yineler. En kritik yer, GÖRÜNMEYEN iç ve alt küpleri de hesaba katmaktır — yalnız dıştan görünen yüzleri değil, kutunun içini doldura küpleri kapsar.",
    teacher: "Burası yörüngenin ikinci ve en kritik darboğazıdır: 3B yapıyı satır-sütun-KATMAN olarak örgütleme. En sık ve en inatçı yanılgı, yalnız GÖRÜNEN küpleri saymaktır — çocuk dış yüzlerdeki küpleri sayıp gizli (içteki, alttaki) küpleri unutur; bir katmanı görüp katların altına/içine bakmaz. Bu, hacmi yüzey-sayımıyla karıştırmaktır. Çözüm: önce TEK bir katmanı sağlam saydırın (satır × sütun), sonra \"kaç kat var?\" diye yükseliği ayrı saydırıp katmanı tekrarlatın. Bir katı sökerek altındaki gizli küpleri gösterin: \"Bunlar da var, görünmüyorlar ama oradalar.\" Şeffaf kutu ya da katmanları ayrılabilir bir model gizli küpleri görünür kılar. \"Görünmeyenleri de say\" cümlesi bu düzeyin anahtarıdır.",
    act: {
      materials: ["katmanları ayrılabilen ya da şeffaf bir kutu + onu tam dolduracak özdeş küpler / DokunSay Geo küpleri", "bir katmanı ayrı tutmak için düz tepsi", "kat sayısını işaretlemek için çetele/parmaklar"],
      steps: [
        "Kutunun bir katmanını saydırın: \"Bir katta kaç küp? — 3 sıra, her sırada 6, eder 18.\"",
        "\"Kutuda kaç kat var?\" diye yükseliği ayrı saydırın (ör. 3 kat).",
        "Bir katı söküp altındakini gösterin: \"Bak, bunlar görünmüyordu ama buradalar — onları da sayacağız.\"",
        "\"Her kat 18, 3 kat — toplam kaç?\" diye katmanı kat sayısınca tekrarlatıp gizli küpler dahil toplatın.",
      ],
      criterion: "Bir katmanı satır-sütun olarak bulup kat sayısınca tekrarlayarak, GÖRÜNMEYEN (iç/alt) küpler dahil 3B toplamı doğru kurarsa ✓",
      easy: "Az katlı (2 kat) ve küçük tabanlı (2×3) kutu; her katı sökerek gizli küpleri tek tek görünür kılın.",
      hard: "Daha büyük/yüksek kutu; yalnız en alt katı gösterip \"görünmeyen üst katları da sen kur\" deyin ya da gizli küp sayısını ayrıca sordurun.",
    },
    tool: "geo",
  },
  { // 7 — 3B Dizi Yapılandırıcı (96–120 ay)
    how: "Çocuğa bir kutunun yalnız boyut sayılarını (\"en 4, boy 3, yükseklik 2\") verip — küpleri çizmeden ya da yerleştirmeden — \"kaç küp sığar?\" dediğinizde \"4 çarpı 3, on iki; çarpı 2 kat, yirmi dört\" diye çarpımsal hesaplar. Hacmi artık tek tek saymadan, en × boy × yükseklik dizisi olarak yapılandırır.",
    teacher: "Bu, yörüngenin doruğudur: hacmi tamamen ÇARPIMSAL 3B dizi olarak görme. Çocuk artık küpleri görmeye/saymaya ihtiyaç duymaz; üç boyut sayısını alıp \"taban dizisi (en × boy) × yükseklik (kat)\" diye işler — bu, hacim formülünün (V = en × boy × yükseklik) kavramsal temelidir. Önceki darboğazda kazanılan \"görünmeyen küpler de var\" içgörüsü burada soyut güvene dönüşür: çocuk göremediği küpleri çarpımla \"bilir\". Boyutları değiştirip (\"yükseklik 2 yerine 4 olsa?\") çarpanın etkisini sorgulatın; ara sıra somut bir kutuyla doğrulatın ki çarpımsal yapı anlamlı kalsın, kuru bir formül olmasın.",
    act: {
      materials: ["yalnız boyutları yazılı sayı kartları (en–boy–yükseklik) / DokunSay Geo \"gizli kutu\" kartları", "ara sıra doğrulama için gerçek bir kutu + küpler", "çarpımı yazmak için kâğıt/kalem"],
      steps: [
        "Boyut kartı verin: \"En 4, boy 3, yükseklik 2 — kaç küp sığar? Yerleştirmeden bul.\"",
        "Çocuk \"taban 4×3=12, sonra ×2 kat = 24\" diye çarpımsal hesaplasın.",
        "Bir boyutu değiştirin (\"yükseklik 4 olsa?\") ve sonucun nasıl katlandığını söyletin.",
        "Ara sıra gerçek bir kutuyla doğrulatın: \"Hesabın tuttu mu?\"",
      ],
      criterion: "Yalnız boyut sayılarından (çizmeden/yerleştirmeden) hacmi en × boy × yükseklik çarpımıyla doğru bulursa ✓",
      easy: "Küçük boyutlar (2×2×2) ve bir doğrulayıcı somut kutuyla; önce tabanı, sonra kat çarpımını ayrı yaptırın.",
      hard: "Büyük boyutlar (5×4×3) yalnız zihinden ya da \"hacmi aynı kalacak başka bir kutu (en–boy–yükseklik) söyle\" diye tersine kurdurma.",
    },
    tool: "geo",
  },
]
