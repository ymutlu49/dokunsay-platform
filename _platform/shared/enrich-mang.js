// ════════════════════════════════════════════════════════════════════════
// Ölçme: Açı ve Dönüş (Angle and Turn Measurement) — düzey zenginleştirmesi
// Clements & Sarama [LT]² (learningtrajectories.org) çerçevesine sadık.
// ────────────────────────────────────────────────────────────────────────
// 6 düzey: açı/dönüş sezme → sezgisel açı kurma → örtük açı kullanma
// (diklik/paralellik) → AÇI EŞLEME (darboğaz) → açı büyüklüğü karşılaştırma →
// derece ile ölçme.
//
// Her nesne: how (nasıl görünür) · teacher (öğretmen notu) ·
//   act { materials[2–4], steps[3–5], criterion (✓), easy, hard } · tool.
// Araç: DokunSay Geo ("geo") — dokunsal açı/döndürme modeli; gönye, açıölçer,
// kapı/makas gibi günlük açı bağlamlarıyla beslenir. viz YOK (amblem 📐).
//
// PEDAGOJİ NOTU: Düzey 3 (Açı Eşleyici) gerçek darboğazdır. Çocukların en sık
// yanılgısı açıyı KENAR UZUNLUĞUYLA karıştırmaktır — uzun kenarlı açıyı "daha
// büyük" sanır. Açının özü kenarların uzunluğu değil, aralarındaki DÖNME /
// AÇIKLIK miktarıdır. Bir diğer kök güçlük açıyı bir "dönme" olarak görememektir
// (statik köşe olarak takılıp kalma). Bu iki yanılgıyı her düzeyde adlandırın.
// ════════════════════════════════════════════════════════════════════════

export default [
  { // 0 — Açı ve Dönüş Sezici: Temeller (0–24 ay)
    how: "Bebek/küçük çocuk, kapı yavaşça açılırken ya da makas kapanırken \"bir şeyin açıldığını/kapandığını\" sezer: açılan boşluğa bakar, kapağı iter, makası açıp kapatmaya çalışır. Açıyı adlandıramaz; ama \"daha açık\" ile \"daha kapalı\" arasındaki farkı bedeniyle yaşar.",
    teacher: "Bu, açı ve dönüş kavramının dile dökülmemiş ilk tohumudur: çocuk açıyı bir SAYI ya da köşe olarak değil, bir DÖNME/AÇIKLIK hareketi olarak duyumsar. Henüz ölçme yoktur; amaç \"açılıyor / kapanıyor\", \"çok açık / az açık\" gibi dönme duygusuna dikkat çekmektir. Günlük menteşeli nesneleri (kapı, kitap, makas, dirsek) açıp kapatarak bu sezgiyi besleyin — sonraki tüm açı öğrenmesi bu hareket duygusuna yaslanır.",
    act: {
      materials: ["Menteşeli günlük nesne (kapı, kitap kapağı, oyuncak makas)", "Çocuğun kendi kolu/dirseği"],
      steps: [
        "Kapağı/kitabı birlikte yavaşça açıp kapatın: \"Bak, açılıyor… kapanıyor.\"",
        "Çok açık ve az açık iki konumu gösterip \"bu daha açık\" deyin, çocuk baksın/dokunsun.",
        "Çocuğun kendi kolunu dirsekten açıp kapatmasına yardım edin: \"kolun da açılıyor!\"",
        "Aynı oyunu farklı nesnelerle (makas, çekmece) günün farklı anlarında yineleyin.",
      ],
      criterion: "Bir nesne açılıp kapanırken (açı değişirken) dikkati/bakışı belirgin değişir ya da açma-kapama hareketini taklit etmeye çalışırsa ✓",
      easy: "Farkı abartın: tam kapalı ↔ ardına dek açık iki uç konumla çalışın.",
      hard: "Az açık ↔ biraz daha açık gibi yakın konumları gösterip \"hangisi daha açık?\" diye sezgisini yoklayın.",
    },
    tool: "geo",
  },
  { // 1 — Sezgisel Açı Kurucu (24–42 ay)
    how: "Çocuk iki çubuğu ya da iki blok kenarını bir uçtan birleştirip bir \"köşe\" oluşturur; \"V\" gibi açık bir biçim ya da bir çatı/dağ yapar. Açıklığı bilerek azaltıp çoğaltabilir ama henüz ne \"açı\" der ne de ölçer — sezgisel olarak bir dönme/açıklık kurar.",
    teacher: "Tanımaktan KURMAYA geçilir: çocuk artık açıyı yalnız fark etmez, iki kolu birleştirip kendisi bir açıklık üretir. \"Köşe\", \"sivri\", \"geniş açık\" gibi günlük sözcükler kullanın; açının iki kolu olduğunu (ortak bir noktadan çıkan iki kenar) elle gösterin. Bu düzeyde sayı/derece hiç gerekmez — amaç açının iki-kollu, döndürülebilir yapısını sezgisel kurabilmektir. Bu, ileride açıyı bir nesne gibi düşünmenin zeminidir.",
    act: {
      materials: ["İki düz çubuk/pipet ya da DokunSay Geo'nun menteşeli iki kolu", "Bağlanabilir bloklar veya geçmeli parçalar", "Örnek için bir resim (çatı, makas)"],
      steps: [
        "İki çubuğu bir uçtan tutturup \"köşe\" yapın: \"İşte iki kol bir noktada buluştu.\"",
        "Çocuk kendi köşesini kursun; kolları açıp kapatarak \"sivri\" ve \"geniş\" yapsın.",
        "\"Bana çok açık bir köşe yap\" / \"şimdi sivri bir köşe yap\" diye yönlendirin.",
        "Çatı, dağ, açık makas gibi günlük açıları aynı iki kolla taklit ettirin.",
      ],
      criterion: "İki kolu bir noktada birleştirip bir açı (köşe) kurar ve açıklığını isteyince azaltıp çoğaltabilirse ✓",
      easy: "Menteşeyle birleşik hazır iki kolu kullanın; çocuk yalnız açıp kapatsın.",
      hard: "Verilen bir örnek köşeyi (resim/model) çubuklarla benzer açıklıkta kurmasını isteyin.",
    },
    tool: "geo",
  },
  { // 2 — Örtük Açı Kullanıcı (48–60 ay)
    how: "Çocuk bir yapı ya da yapboz yaparken açıyı adlandırmadan KULLANIR: kareyi tamamlarken köşeleri dik tutar, blokları kenarları paralel gidecek şekilde hizalar, bir parçayı boşluğa oturmazsa çevirip doğru köşeyle yerleştirir. \"Dik\", \"paralel\", \"açı\" demez ama davranışında bunları gözetir.",
    teacher: "Açı burada örtük (üstü kapalı) bir araçtır: çocuk diklik ve paralelliği sezgisel kullanarak yapı kurar, henüz açıyı bilinçli bir nicelik olarak düşünmez. Bu doğal kullanımı dile dökmeye başlayın — \"köşeyi tam dik yaptın\", \"bu iki kenar yan yana, paralel gidiyor\" diye adlandırın. Yapboz/inşa görevleri bu düzeyin can damarıdır: parça oturmazsa çocuk parçayı DÖNDÜRÜR — bu döndürme, açının dönme anlamına giden köprüdür. Amaç bilinçli ölçme değil, diklik/paralelliği işlevsel kullanmaktır.",
    act: {
      materials: ["DokunSay Geo ya da geçmeli yapı blokları", "Çerçeveli bir yapboz (parçalar döndürülerek oturan)", "Köşeleri belirgin nesneler (kitap, fayans, gönye)"],
      steps: [
        "Bir kare/dikdörtgen çerçeveyi bloklarla tamamlatın; köşeleri \"tam dik\" oturmasını gözleyin.",
        "Oturmayan bir yapboz parçası verin: \"Çevir bakalım, hangi açıyla oturuyor?\" diye döndürtün.",
        "Çocuğun paralel kenarlarını gösterin: \"Bu iki kenar hiç buluşmuyor, yan yana gidiyor.\"",
        "Bir kitabın/fayansın dik köşesiyle yaptığı köşeyi karşılaştırın: \"Seninki de bunun gibi dik mi?\"",
      ],
      criterion: "Yapı/yapboz görevinde dik köşeleri ve paralel kenarları (parçayı döndürerek) işlevsel olarak doğru kullanırsa ✓",
      easy: "Az parçalı, yalnız dik köşeli (kare) bir çerçeveyle çalışın; döndürmeyi siz başlatın.",
      hard: "Dik olmayan açılar (üçgen, beşgen parçalar) ekleyin; parçayı doğru açıya kendisi çevirsin.",
    },
    tool: "geo",
  },
  { // 3 — Açı Eşleyici (72–84 ay) ★ DARBOĞAZ
    how: "Çocuğa kenar uzunlukları FARKLI ama açıklığı AYNI iki açı modeli verirsiniz; \"Bunlar aynı açıda mı?\" dersiniz. Eşleyebilen çocuk modelleri üst üste getirip kolları çakıştırarak \"evet, aynı\" der. Henüz oturmamışsa uzun kenarlı olana \"bu daha büyük\" der — açıyı kenar uzunluğuyla karıştırır.",
    teacher: "Bu, açı yörüngesinin GERÇEK darboğazıdır ve en yaygın yanılgının düğüm noktasıdır: çocuk açının büyüklüğünü kenarların uzunluğu sanır (\"kolları uzun olan daha büyük açı\"). Oysa açı, kenar uzunluğundan bağımsızdır — yalnızca kolların arasındaki DÖNME/AÇIKLIK önemlidir. Bu kavramı kurmanın yolu üst üste bindirerek eşlemektir: iki açıyı tepe noktasından ve bir kolundan çakıştırın; öteki kollar da çakışıyorsa açılar aynıdır, kenar uzunlukları farklı olsa bile. Burada takılma ciddiye alınmalı — açıyı kenardan ayıramamak sonraki tüm açı/geometri ölçmesini tıkar. Kolları kâğıt şerit gibi UZATIP KISALTARAK \"açı değişmedi\" deneyimini yaşatın.",
    act: {
      materials: ["DokunSay Geo'nun iki menteşeli açı modeli (kolları farklı uzunlukta)", "Saydam/ince kâğıttan kesilmiş açı kopyaları (üst üste koymak için)", "Kolları kısaltıp uzatmak için kesilebilir şeritler"],
      steps: [
        "Açıklığı aynı ama kolları farklı uzunlukta iki açı gösterin: \"Sence aynı açıda mı?\"",
        "İki açıyı tepe noktasından ve bir kolundan üst üste bindirin: \"Öteki kollar da çakışıyor mu?\"",
        "Çakışıyorsa \"aynı açı\" deyin; kenar uzunluğu farkına dikkat çekip \"kollar farklı ama açı aynı\" vurgulayın.",
        "Bir açının kollarını şeritle uzatıp kısaltın: \"Kollar değişti — açı değişti mi?\" (hayır) diye sorgulayın.",
      ],
      criterion: "İki açıyı üst üste bindirerek eşler ve kenar uzunluğu farklı olsa bile açının aynı/farklı olduğunu kenara aldanmadan söylerse ✓",
      easy: "Önce kolları AYNI uzunlukta açılarla eşletin; sonra tek bir kolu uzatıp \"yine aynı mı?\" diye köprü kurun.",
      hard: "Açıklık farkı çok küçük (ör. ince fark) ya da kollar belirgin biçimde farklı uzunlukta açılarla eşletin; üst üste koymadan, gözle eşlemeye çalıştırın.",
    },
    tool: "geo",
  },
  { // 4 — Açı Büyüklüğü Karşılaştırıcı (84–96 ay)
    how: "Çocuk kenar uzunlukları farklı iki açıyı görüp \"hangisi daha geniş?\" sorusuna doğru yanıt verir: açıklığı (kolların ne kadar açıldığını) ölçüt alır, kenarların uzunluğunu değil. Birden çok açıyı en sivriden en genişe sıralayabilir; \"bu daha çok dönmüş, o yüzden daha geniş\" gibi gerekçeler kurar.",
    teacher: "Eşlemeden KARŞILAŞTIRMAYA geçilir: artık \"aynı mı?\" değil, \"hangisi daha büyük?\" sorulur. Darboğaz yanılgısı (açı = kenar uzunluğu) burada tam olarak sınanır — bu yüzden kasıtlı olarak uzun kenarlı DAR açı ile kısa kenarlı GENİŞ açı gösterin; çocuk kenara aldanmadan geniş olanı seçebilmeli. Açıyı \"ne kadar dönüldüğü\" olarak konuşturun: bir kolu sabit tutup öteki kolu çevirmek açıyı büyütür. Üst üste bindirme stratejisini karşılaştırmaya taşıyın: hangi açının öteki kolu daha dışarıdaysa o daha geniştir. Sıralama (3+ açıyı diziye koyma) bu düzeyi sağlamlaştırır.",
    act: {
      materials: ["DokunSay Geo açı modelleri (farklı açıklık ve farklı kol uzunluklarında)", "Kıyas için bir gönye/dik köşe (90°'yi 'çeyrek dönüş' olarak)", "Açıları diziye koymak için bir zemin/şerit"],
      steps: [
        "Uzun kenarlı dar bir açı ile kısa kenarlı geniş bir açı gösterin: \"Hangisi daha geniş?\"",
        "Çocuk kenara aldanırsa ikisini üst üste bindirip \"hangi kol daha çok dönmüş?\" diye gösterin.",
        "Bir kolu sabit tutup öteki kolu çevirerek \"açıyı büyütüyorum / küçültüyorum\" deyin.",
        "Üç-dört açıyı en sivriden en genişe sıralatın; gönyeyle \"dik açıdan dar mı, geniş mi?\" diye kıyaslatın.",
      ],
      criterion: "Kenar uzunluğu yanıltıcı olsa bile iki açıdan daha genişini doğru seçer ve birkaç açıyı açıklığa göre sıralarsa ✓",
      easy: "Açıklık farkını abartın (çok sivri ↔ ardına dek geniş); kolları aynı uzunlukta tutun.",
      hard: "Açıklığı yakın açıları, kasıtlı olarak ters kol uzunluklarıyla (geniş açının kolları kısa) karşılaştırtın; dik açıyı (90°) eşik alıp \"dar mı geniş mi?\" sınıflatın.",
    },
    tool: "geo",
  },
  { // 5 — Açı Ölçücü (96–108 ay)
    how: "Çocuk bir açıyı bir BİRİMLE ölçer: gönyeyle \"bu dik açıdan küçük\" der, açıölçeri tepe noktasına ve bir kola düzgün yerleştirip \"bu açı yaklaşık 50 derece\" gibi sayısal bir değer okur. Açıyı artık yalnız karşılaştırmaz; tekrarlanan bir birim (derece / çeyrek dönüş) cinsinden niceler.",
    teacher: "Açı ölçmenin doruğu: karşılaştırmadan BİRİMLE ÖLÇMEYE geçiş. Açı, dönme miktarının tekrarlanan birimlerle (derece) sayılmasıdır — tam dönüş 360°, çeyrek dönüş (dik açı) 90°. En sık iki hata: (1) açıölçerin merkezini tepe noktasına oturtmamak, (2) yanlış ölçeği (iç/dış sayılar) okumak. Bu yüzden önce \"çeyrek dönüş = dik açı = 90°\" çıpasını kurun, açıölçeri her seferinde merkez tepe noktasında / sıfır çizgisi bir kolda olacak şekilde yerleştirtin. Açının kenar uzunluğunun ölçülen dereceyi DEĞİŞTİRMEDİĞİNİ son kez vurgulayın (kolları uzatıp kısaltıp tekrar ölçtürün). Bu beceri, açıyı sayısal bir nicelik olarak tam kavramanın göstergesidir.",
    act: {
      materials: ["DokunSay Geo + açıölçer (ya da yarım daire açıölçer)", "Gönye/dik köşe (90° çıpası)", "Ölçülecek hazır açılar (sivri, dik, geniş) ve kâğıt-kalem"],
      steps: [
        "Önce dik açıyı gönyeyle eşleyip \"bu çeyrek dönüş, 90 derece\" çıpasını kurun.",
        "Açıölçerin merkezini tepe noktasına, sıfır çizgisini bir kola oturtun: \"merkez tam köşede mi?\"",
        "Öteki kolun gösterdiği dereceyi doğru ölçekten okutun; \"90'dan küçük mü büyük mü?\" diye akıl yürütün.",
        "Açının kollarını uzatıp kısaltıp yeniden ölçtürün: \"derece değişti mi?\" (hayır) diye pekiştirin.",
      ],
      criterion: "Açıölçeri merkez tepe noktasında ve sıfır çizgisi bir kolda olacak şekilde yerleştirip açıyı derece cinsinden doğru ölçerse (kenar uzunluğuna aldanmadan) ✓",
      easy: "Yalnız dik açı ve onun yarısı/iki katı gibi tanıdık açılarla, dereceyi gönye/katlama ile yaklaşık okutun.",
      hard: "Geniş (90°'den büyük) açıları doğru ölçekten okutun; verilen bir dereceyi (ör. 'bana 60°'lik açı çiz') açıölçerle kurdurun.",
    },
    tool: "geo",
  },
]
