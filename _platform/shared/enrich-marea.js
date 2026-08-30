// Ölçme: Alan (Area Measurement) — düzey zenginleştirmesi (Clements & Sarama)
// trajectories.data.js içindeki "marea" yörüngesinin 8 düzeyini öğretmen/veli için
// derinleştirir. Altın-standart şablon: yorunge.enrich.js (sub).
// Pedagojik yay: alan sezme → nicelik tanıma → fiziksel kaplama/sayma (boşluk/örtüşme
// olabilir) → TAM kaplama (boşluksuz/örtüşmesiz; darboğaz) → birim tekrarı → satır-sütun
// sezme → satır-sütun YAPILANDIRMA (darboğaz) → çarpımsal dizi.
// Sık yanılgı: kareler arası boşluk/örtüşme bırakma; alanı çevreyle karıştırma.
// Her düzey: how (nasıl görünür) · teacher (öğretmen notu) · act (etkinlik) ·
// viz (opsiyonel görsel reçetesi; erken/soyut düzeylerde yok → amblem 🟩) · tool (varsayılan "bar"; KOYMA).
export default [
  { // 0 — Alan Sezici: Temeller (0–36 ay)
    how: "Çocuk büyük bir battaniyeye serilip küçük bir paspasa sığmaya çalışırken yüzeyin \"büyüklüğünü\" bedeniyle sezer; koca bir kâğıdı boyarken küçük bir karta göre daha çok yer olduğunu fark eder ama bunu adlandıramaz. \"Burası daha geniş\" duygusu sözcükten önce gelir.",
    teacher: "Bu, alanın dile dökülmemiş ilk sezgisidir: çocuk henüz ölçmez ya da saymaz, yüzeyin kapladığı yeri yaşar. Amaç nicelik vermek değil, \"geniş-dar\", \"koca-minik yüzey\" duygusunu uyandırmaktır. Battaniye, halı, masa örtüsü gibi düz yüzeylerle \"buraya sığar mı?\" oyunları bu çekirdeği besler. Sonraki tüm alan öğrenmesi bu örtük \"kapladığı yer\" sezgisine yaslanır.",
    act: {
      materials: ["büyük ve küçük iki düz örtü/battaniye", "üzerine konacak birkaç oyuncak"],
      steps: [
        "Büyük ve küçük örtüyü yan yana yere serin.",
        "\"Hangisinde daha çok yer var, oyuncaklar nereye sığar?\" diye birlikte deneyin.",
        "Oyuncakları büyük örtüye yayın: \"Bak, burası daha geniş, hepsi sığdı!\".",
        "Küçüğe sığdırmaya çalışıp taşmayı gösterin: \"Burası dar, sığmadı.\".",
      ],
      criterion: "İki yüzeyden hangisinin \"daha geniş / daha çok yer\" olduğunu sezgisel ayırt ederse (bakış, seçim, davranışla) ✓",
      easy: "Farkı abartın (kocaman battaniye ↔ minik mendil).",
      hard: "Yüzeyleri yaklaştırın (benzer boyutlu iki örtü) ya da farklı biçimlerle deneyin.",
    },
  },
  { // 1 — Alan Niceliği Tanıyıcı (36–48 ay)
    how: "İki kâğıt ya da masa gösterip \"Hangisi daha geniş?\" dediğinizde çocuk büyük yüzeyi seçer; \"daha geniş\", \"daha çok yer\" sözcüklerini doğru kullanır. Yüzeyi artık yalnız sezmiyor, bir \"çoğu-azı olan\" nicelik olarak konuşuyor.",
    teacher: "Burada alan sezgisi dile bağlanır: çocuk yüzeyin büyüklüğünü karşılaştırılabilir bir nicelik olarak tanır. Bu düzeyde sık yanılgı, alanı kenar uzunluğu ya da çevreyle karıştırmaktır — \"daha uzun olan daha geniştir\" sanabilir. Yüzeyi avuçla tarayarak (\"şu kadar yer kaplıyor\") gösterin, uzun-ince bir şeritle geniş-kısa bir dikdörtgeni kıyaslayıp \"geniş\"in çevreyle aynı olmadığını sezdirin. Doğrudan üst üste koyma (örtme) en güçlü karşılaştırmadır.",
    act: {
      materials: ["farklı büyüklükte 2–3 düz kâğıt/karton", "üst üste koyarak kıyaslamak için düz bir zemin"],
      steps: [
        "İki kâğıdı yan yana koyup \"Hangisi daha geniş?\" diye sorun.",
        "Doğrulamak için birini ötekinin üstüne koyun: \"Bak, bu taştı, demek daha geniş.\".",
        "Avuçla yüzeyi tarayarak \"bu kadar yer kaplıyor\" deyin.",
        "Uzun-ince bir şerit ile geniş-kısa bir kâğıdı kıyaslayıp hangisinin daha çok \"yer\" kapladığını tartışın.",
      ],
      criterion: "Yüzeyleri bir nicelik olarak (daha geniş / daha çok yer) tutarlı karşılaştırır ve daha geniş olanı seçerse ✓",
      easy: "Aynı biçimde, belirgin boyut farkıyla (büyük ↔ küçük kare) çalışın.",
      hard: "Çevre tuzağı kurun: uzun-ince ↔ kısa-geniş; \"hangisi daha geniş, neden?\" diye gerekçe isteyin.",
    },
  },
  { // 2 — Fiziksel Kaplayıcı ve Sayıcı (48–60 ay)
    how: "Bir dikdörtgeni birim karelerle kaplamasını isteyince çocuk kareleri yüzeye yerleştirip sayar — ama kareler arasında boşluk bırakabilir, üst üste bindirebilir ya da kenardan taşırabilir. \"Kaç kare?\" diye sorduğunuzda yine de bir sayı söyler; kaplama düzensiz olsa da \"kareyle ölçme\" fikrini kullanır.",
    teacher: "Bu, alanı birimlerle kaplama fikrinin ilk hâlidir: çocuk yüzeyi karelerle doldurup sayabileceğini kavrar — ama henüz boşluksuz/örtüşmesiz kaplama disiplini yoktur. Boşluk ve örtüşme bu düzeyde DOĞALDIR; acele \"yanlış\" demeyin, önce kaplama-ve-sayma alışkanlığını kurun. Sayarken kareleri tek tek dokundurarak birebir saymasını destekleyin. Bir sonraki düzeyin darboğazına (tam kaplama) zemin hazırlamak için \"araları açık kalmış, sığ daha var mı?\" diye nazikçe dikkat çekin.",
    act: {
      materials: ["DokunSay Bar birim kareleri (bir avuç aynı boy kare)", "kaplanacak bir dikdörtgen çerçeve/kart", "kareleri sürmek için düz zemin"],
      steps: [
        "Dikdörtgeni gösterin: \"Bunu karelerle dolduralım.\".",
        "Çocuk kareleri yüzeye yerleştirsin; siz yönlendirmeden serbest doldursun.",
        "\"Kaç kare oldu?\" diye her kareye dokunarak birlikte sayın.",
        "Boşluk/taşma olursa \"şurada boşluk kalmış, oraya da kare girer mi?\" diye fark ettirin (henüz zorlamadan).",
      ],
      criterion: "Yüzeyi birim karelerle kaplayıp kareleri (boşluk/örtüşme olsa da) birebir sayarak bir alan değeri söylerse ✓",
      easy: "Küçük bir dikdörtgen (4–6 kare alır) ve karelerle aynı boyda çerçeve kullanın.",
      hard: "Daha büyük yüzey ya da kareden biraz farklı çerçeve; \"boşluk kalmadan dene\" deyin.",
    },
    viz: { t: "array", r: 2, c: 3 },
    tool: "bar",
  },
  { // 3 — Tam Kaplayıcı ve Sayıcı (60–66 ay) ★ DARBOĞAZ
    how: "Çocuk dikdörtgeni birim karelerle BOŞLUKSUZ ve ÖRTÜŞMESİZ kaplar: kareleri kenara hizalar, yan yana sıkıca dizer, hiçbir yeri açık ya da çift bırakmaz; sonra doğru sayar. Henüz oturmamışsa kareler arasında boşluk/örtüşme kalır ve sayım da bu yüzden hatalı çıkar.",
    teacher: "Tam kaplama alan ölçmenin ilk gerçek darboğazıdır: alanı doğru ölçmek, yüzeyi BOŞLUKSUZ ve ÖRTÜŞMESİZ döşemeyi gerektirir — aksi hâlde sayı yanıltır. Bu düzeyde takılan çocuk genellikle kareleri gelişigüzel atıp boşluk/örtüşme bırakır; \"araları kapat, üst üste binmesin\" disiplinini açıkça öğretin. Bir köşeden başlayıp kenara yaslayarak, satır satır döşemeyi modelleyin. Aynı yüzeyi farklı dizilişlerle kaplatıp \"yine aynı sayıda kare\" (alanın korunumu) vurgulayın. Bu, sonraki satır-sütun yapısının ön koşuludur.",
    act: {
      materials: ["DokunSay Bar birim kareleri (yüzeyi tam dolduracak sayıda)", "kenarları belirgin bir dikdörtgen çerçeve", "başlangıç köşesini gösteren bir işaret"],
      steps: [
        "\"Bir köşeden başla, kareleri kenara yasla\" diyerek ilk kareyi köşeye koydurun.",
        "Kareleri boşluk bırakmadan, üst üste bindirmeden yan yana dizdirin; satır satır ilerletin.",
        "Bir boşluk/örtüşme görürseniz durup düzelttirin: \"burada boşluk var, kapatalım.\".",
        "Tamamlayınca her kareye dokunarak saydırın; yüzeyi başka dizilişle kaplatıp \"yine kaç?\" deyin.",
      ],
      criterion: "Yüzeyi boşluksuz ve örtüşmesiz tam kaplar VE kareleri atlamadan/tekrarlamadan doğru sayarsa ✓",
      easy: "Karelerle birebir uyan küçük çerçeve (ör. 6 kare); kenarları çizgili olsun ki hizalama kolaylaşsın.",
      hard: "Daha büyük yüzey; kareleri özellikle dağıttıktan sonra \"boşluksuz yeniden döşe\" deyin.",
    },
    viz: { t: "array", r: 3, c: 4 },
    tool: "bar",
  },
  { // 4 — Alan Birimi İlişkilendiren ve Tekrarlayan (60–72 ay)
    how: "Çocuğun elinde tek bir kare vardır; o kareyi tekrar tekrar kaydırıp her konuşunu işaretleyerek (ya da iz bırakarak) tüm yüzeyi ölçer ve kaç kez sığdığını sayar. \"Üç kare aşağı, dört kare yana\" demese de tek birimi yineleyerek alanı bir sayıya çevirir.",
    teacher: "Bu, birim tekrarı (iteration) içgörüsüdür: yüzeyi kaplamak için bir sürü özdeş kareye gerek yok; TEK bir birimi sistematik tekrarlayarak da alan ölçülür. Sık yanılgı, kareyi taşırken boşluk bırakmak ya da bir yeri iki kez saymaktır — her konuşu işaretleterek (parmak izi, kalem çentiği) bunu önleyin. İki farklı yüzeyi AYNI birimle ölçtürüp \"hangisi daha çok kare tuttu?\" diye alanları sayıyla karşılaştırın; aynı birim olmadan karşılaştırmanın haksız olduğunu sezdirin. Bu, ölçü biriminin değişmez (özdeş) olması gerektiğini kurar.",
    act: {
      materials: ["tek bir DokunSay Bar birim karesi", "ölçülecek 1–2 dikdörtgen yüzey", "her konuşu işaretlemek için kalem/çentik ya da pul"],
      steps: [
        "Tek kareyi köşeye koyun, yerini işaretleyin, sonra tam yanına kaydırıp yeniden işaretleyin.",
        "Bir satırı bitirince alt satıra geçip aynı şekilde tekrarlayın; her konuşu sayın.",
        "\"Kare kaç kez sığdı?\" diye toplam birimi söyletin (= alan).",
        "Aynı kareyle ikinci bir yüzeyi ölçüp \"hangisi daha çok kare tuttu, hangisi daha geniş?\" diye karşılaştırın.",
      ],
      criterion: "Tek bir birimi boşluksuz/örtüşmesiz tekrarlayarak alanı sayar VE aynı birimle iki yüzeyin alanını karşılaştırırsa ✓",
      easy: "Küçük yüzey ve her konuşu birlikte işaretleyin; kareyi siz kaydırın, o saysın.",
      hard: "Daha büyük yüzey ya da iki farklı birim verip \"aynı yüzey neden farklı sayı tuttu?\" diye birimin önemini tartışın.",
    },
    viz: { t: "array", r: 2, c: 4 },
    tool: "bar",
  },
  { // 5 — Başlangıç Bileşik Yapılandırıcı (72–84 ay)
    how: "Karelerle kaplı bir dikdörtgende \"bir sırada kaç kare var?\" diye sorduğunuzda çocuk bir satırı bütün olarak görüp sayar (\"dört\"); sıraların hepsinde aynı sayıda kare olduğunu sezmeye başlar. Henüz \"4 çarpı 3\" demez ama kareleri tek tek değil, satırlar/sütunlar hâlinde okumaya yönelir.",
    teacher: "Burada dizinin satır-sütun yapısı SEZİLMEYE başlar: çocuk kaplı alanı dağınık kareler değil, eşit satırların (ya da sütunların) üst üste binmesi olarak görmeye yönelir. Bu, çarpımsal alan anlayışının habercisidir. Sık takıntı, hâlâ her kareyi baştan tek tek saymaktır — \"bu sırada kaç var? Peki bir alttaki sırada?\" diye satırların eşitliğine dikkat çekin. Satırları farklı renklerle ayırmak (bir sıra mavi, bir sıra sarı) yapıyı görünür kılar. Henüz darboğaz değil; satır-sütunu YAPILANDIRMA (bir sonraki düzey) asıl zorluktur.",
    act: {
      materials: ["DokunSay Bar birim kareleri (kaplı bir dikdörtgen oluşturacak)", "satırları ayırt etmek için iki renk kare ya da satır çizgileri", "kapatma kartı"],
      steps: [
        "Kareleri düzgün bir dikdörtgen olacak şekilde döşeyin (ör. 4'lük 3 sıra).",
        "\"Bu sırada kaç kare var?\" diye bir satırı saydırın (dört).",
        "\"Peki alttaki sırada?\" diye sorup her sırada aynı sayıda olduğunu fark ettirin.",
        "Bir-iki satırı kapatıp \"kapattığım sırada kaç vardı?\" diye satır yapısını hatırlatın.",
      ],
      criterion: "Kaplı bir dikdörtgende bir satır/sütundaki kare sayısını söyler ve sıraların eşit olduğunu sezerse ✓",
      easy: "Satırları iki renge boyayın; küçük dizi (3×2) kullanın.",
      hard: "Renk ipucu olmadan; \"her sıra eşitse, iki sırada toplam kaç?\" diye satırları toplatın.",
    },
    viz: { t: "array", r: 3, c: 4 },
    tool: "bar",
  },
  { // 6 — Alan Satır ve Sütun Yapılandırıcı (96–108 ay) ★ DARBOĞAZ
    how: "Çocuk 3×4 bir dizilimi \"her sırada 4 kare, 3 sıra var\" diye yapılandırır: yüzeyi satır × sütun ızgarası olarak görüp \"4'er 4'er, üç kez\" sayarak ya da 4+4+4 ile toplamı bulur. Henüz oturmamışsa diziyi ızgara olarak göremez, kareleri yine teker teker sayar ya da satır sayısıyla sütun sayısını karıştırır.",
    teacher: "Satır-sütun YAPILANDIRMA alan ölçmenin asıl darboğazıdır: çocuğun yüzeyi, kesişen satır ve sütunların oluşturduğu bir ızgara olarak ZİHİNDE kurması gerekir — her satır eşit, her sütun eşit. Bu yapıyı kuramayan çocuk diziyi dağınık birimler gibi tek tek sayar ve büyük yüzeylerde tıkanır. \"Kaç sıra? Her sırada kaç? Öyleyse toplam?\" zincirini ısrarla kurun; satırları renklendirip, bir satırı şablon alıp \"aynısından üç tane\" dedirtin. Eksik bir ızgaranın (bazı kareleri boş) satır-sütununu tamamlatmak yapıyı sağlamlaştırır. Bu, alanın çarpımsal (satır × sütun) doğasına açılan kapıdır.",
    act: {
      materials: ["DokunSay Bar birim kareleri (3×4 ızgara kuracak)", "satır/sütunu belirginleştiren ızgara çizgileri ya da renkli sıralar", "bazı kareleri boş bırakmak için eksik bir ızgara kartı"],
      steps: [
        "3×4 diziyi gösterin: \"Kaç sıra var? Her sırada kaç kare?\" (3 sıra, 4'er).",
        "Bir satırı şablon alıp \"aynısından üç tane\" dedirtin; 4+4+4'ü birlikte söyleyin.",
        "Toplamı satır-sütundan çözdürün: \"üç kez dört, on iki\" (tek tek saymadan).",
        "Eksik bir ızgara verip \"satırları/sütunları tamamla, toplam kaç olur?\" diye yapılandırtın.",
      ],
      criterion: "Bir dikdörtgensel diziyi satır × sütun yapısı olarak kurup (her satır eşit) toplamı tek tek saymadan satırlardan çözerse ✓",
      easy: "Küçük dizi (2×3) ve renkli satırlar; bir satırı birlikte sayıp tekrarlatın.",
      hard: "Daha büyük dizi (4×5) ya da yalnız bir satır + bir sütun verip kalan ızgarayı zihinde tamamlatın.",
    },
    viz: { t: "array", r: 3, c: 4 },
    tool: "bar",
  },
  { // 7 — Dizi Yapılandırıcı (96–120 ay)
    how: "Çocuğa kareleri çizdirmeden yalnız \"5 sıra, her sırada 6 kare\" deyince alanı doğrudan \"beş çarpı altı, otuz\" diye çarpımsal bulur. Diziyi görmeden zihninde satır × sütun olarak kurar; alanın bir çarpma işlemi olduğunu bilir.",
    teacher: "Bu, alan anlayışının doruğudur: çocuk artık fiziksel kareye ihtiyaç duymadan, satır ve sütun sayısından alanı ÇARPIMSAL hesaplar (alan = satır × sütun). Dizi modeli ile çarpma burada birleşir. Değişme özelliğini (5×6 = 6×5, dizi döndürülünce alan değişmez) ve dağılmayı (bir kenarı 5+2 diye bölünce alanın 5 sıralık ve 2 sıralık parçaların toplamı olduğunu) somut ızgarayla gerekçelendirin. Alanı çevreyle karıştırma yanılgısına karşı, aynı çevreli farklı alanları (ör. 2×6 ile 3×5) kıyaslatın. Bu içgörü, çarpma, alan formülü ve ileride alanların orantısal akıl yürütmesinin temelidir.",
    act: {
      materials: ["DokunSay Bar birim kareleri (gerekirse doğrulama için)", "yalnız satır/sütun sayısı yazılı dizi kartları (çizimsiz)", "değişme/dağılma için bölünebilir ızgara"],
      steps: [
        "\"5 sıra, her sırada 6 kare — toplam kaç?\" diye çizdirmeden sordurun (5×6).",
        "Çocuk \"beş kere altı, otuz\" desin; isterse karelerle doğrulasın.",
        "Diziyi döndürün (6×5): \"yine otuz mu?\" diye değişmeyi gösterin.",
        "Bir kenarı bölün (6 = 5+1): \"5 sıra beşli + 5 sıra birli\" diye alanı parçalardan toplatın.",
      ],
      criterion: "Satır ve sütun sayısından (çizmeden) alanı çarpımsal (satır × sütun) bulur ve değişme/parçalamayı dizi üzerinde gerekçelendirirse ✓",
      easy: "Küçük çarpımlar (3×4) ve gerektiğinde karelerle doğrulama.",
      hard: "Daha büyük diziler (7×8); aynı çevreli farklı alanları (2×6 ↔ 3×5) kıyaslatıp alan ≠ çevre ayrımını yaptırın.",
    },
    viz: { t: "array", r: 5, c: 6 },
    tool: "bar",
  },
]
