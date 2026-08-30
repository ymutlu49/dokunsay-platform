// Uzamsal Yönelim (Spatial Orientation) — düzey zenginleştirmesi (Clements & Sarama)
// trajectories.data.js içindeki "sporient" yörüngesinin 10 düzeyini öğretmen/veli
// için derinleştirir. Altın-standart şablon: yorunge.enrich.js (sub).
// Pedagojik yay: sezgisel konum → yol bütünleştirme → yer öğrenme →
// benlik-çerçevesi (sağım/önüm) → KÜÇÜK YEREL ÇERÇEVE (darboğaz: nesneyi başka
// nesnelere göre konumlama) → yerel çerçeve → harita kullanma (harita↔gerçeklik
// eşleme) → koordinat (sütun/sıra) → rota izleme → soyut/döndürülmüş çerçeve.
// Eksen: benlik-merkezli yönden (egosentrik) harita ve koordinata dayalı
// soyut (allosentrik) çerçeveye geçiş. Araç: DokunSay Geo (harita ve ızgara).
// Her düzey: how (nasıl görünür) · teacher (öğretmen notu) · act (etkinlik) ·
// tool (DokunSay aracı; bu yörüngede "geo"). viz KOYMA → amblem 🧭.
export default [
  { // 0 — Uzamsal Yönelim: Temeller (0–12 ay)
    how: "Bebek, tanıdık bir odada annesinin sesi sağdan gelince başını sağa çevirir; oyuncağı en son nereye koyduğunuza doğru uzanır. Konumu adlandıramaz ama \"buradan oraya\" duygusunu bedeniyle yaşar — yöne döner, tanıdık köşeye bakar.",
    teacher: "Bu, uzamsal yönelimin en erken sezgisidir: çocuk dünyayı kendi bedenine göre örtük olarak haritalar. Henüz \"sağ-sol\" ya da \"yakın-uzak\" sözcükleri yoktur; amaç yön ve konuma DİKKAT uyandırmaktır. Saklambaç (ce-ee), \"oyuncak nerede?\" arama oyunları ve aynı yerden seslenmek bu çekirdek konum duygusunu besler. Sonraki tüm yön, harita ve koordinat öğrenmesi bu sezgiye yaslanır.",
    act: {
      materials: ["çocuğun en sevdiği bir oyuncak", "hafif bir örtü/bez", "tanıdık, güvenli bir oyun köşesi"],
      steps: [
        "Oyuncağı çocuğun gözü önünde belli bir yere (ör. sol yanına) koyun.",
        "Kısa bir an dikkatini başka yöne çekip \"oyuncak nerede?\" diye sorun; aradığı yöne bakmasını gözleyin.",
        "Oyuncağı örtüyle yarı saklayın; doğru yöne uzanır/döner mi izleyin.",
        "Sesinizi bir kez sağdan bir kez soldan duyurup başını çevirmesini bekleyin.",
      ],
      criterion: "Tanıdık bir konuma (oyuncak, ses kaynağı) yönelir; doğru yöne döner ya da uzanırsa ✓",
      easy: "Oyuncağı hep aynı, çok yakın yere koyun; örtmeden çalışın.",
      hard: "Oyuncağı tam saklayıp kısa bir gecikmeyle sorun; iki olası yer arasında seçtirin.",
      tool: "geo",
    },
  },
  { // 1 — Yol Bütünleştirici (6–24 ay)
    how: "Çocuk odadan mutfağa gidip geri döndüğünde, geldiği yolu — döndüğü köşeyi, geçtiği kapıyı — yeniden bulur. Kısa bir yolu yürüdükten sonra başlangıca dönmesini istediğinizde, gittiği yönü ve aşağı yukarı mesafeyi tutturarak geri izler.",
    teacher: "Bu, yol bütünleştirmedir (path integration): çocuk hareket ederken yönü ve kat ettiği mesafeyi zihinde toplayıp nereden geldiğini kestirir — bir tür içsel \"pusula+adımsayar\". Henüz dış yer imlerine değil, kendi hareket duygusuna dayanır. Birlikte kısa yollar yürüyüp \"şimdi nereden geldik?\" diye geri izletin; köşeleri ve dönüşleri sesli adlandırın (\"sağa döndük, şimdi düz\"). Bu beceri, ileride harita üzerinde rota izlemenin bedensel tohumudur.",
    act: {
      materials: ["tanıdık bir oda/koridor", "yola serpiştirilecek 2-3 belirgin durak (sandalye, yastık)", "DokunSay Geo: basit yol kartı (ops.)"],
      steps: [
        "Çocukla başlangıç noktasından kısa bir yol yürüyün: \"düz… köşeden sağa… durduk.\"",
        "\"Hadi geri, geldiğimiz yoldan dönelim\" deyip yolu tersten izlemesini bekleyin.",
        "Dönüşleri ve durakları birlikte sesli anın: \"burada sağa dönmüştük.\"",
        "Yolu biraz uzatıp (bir dönüş daha ekleyip) geri-izleme oyununu yineleyin.",
      ],
      criterion: "Yürüdüğü kısa bir yolu (yön ve dönüşleri tutturarak) başlangıca geri izlerse ✓",
      easy: "Tek dönüşlü, çok kısa yol; siz önden gidip elinden tutun.",
      hard: "İki-üç dönüşlü daha uzun yol; gidişi gözleri kapalı/örtülü kısımla zorlaştırın.",
      tool: "geo",
    },
  },
  { // 2 — Yer Öğrenici (12–30 ay)
    how: "Bir oyuncağı odadaki belli bir yere (kitaplığın altına, kapının yanına) sakladığınızda çocuk, oraya götüren YER İMLERİNİ kullanarak yeri yeniden bulur. \"Top nerede?\" deyince yalnız rastgele aramaz; \"hani kanepenin yanındaydı\" diye o noktaya gider.",
    teacher: "Burada çocuk artık yalnız kendi hareketine değil, DIŞ yer imlerine (kanepe, kapı, halı) göre konum öğrenir — bu, dünyayı kendinden bağımsız işaretlerle haritalamanın başlangıcıdır. Saklama-bulma oyunlarında yer imini sözle vurgulayın (\"yastığın ARKASINA koyuyorum\"). Konumu sabit bir nesneye bağlamak, ileride harita-gerçeklik eşlemesinin ve mekânsal belleğin temelini atar.",
    act: {
      materials: ["küçük bir oyuncak/nesne", "odada belirgin sabit yer imleri (kanepe, kutu, halı kenarı)", "DokunSay Geo: yer-imi kartları (ops.)"],
      steps: [
        "Oyuncağı çocuğun gözü önünde belirgin bir yer imine bağlayarak saklayın: \"kutunun yanına koyuyorum.\"",
        "Kısa bir oyalanmadan sonra \"oyuncak nerede? Hangi yer imindeydi?\" diye sordurup buldurun.",
        "Aynı oyunu farklı yer imleriyle (kapı, halı kenarı) yineleyin.",
        "İki yer imi verin (\"kapıya yakın, pencereye uzak\") ve doğru yeri seçtirin.",
      ],
      criterion: "Bir nesnenin yerini, yer imlerine göre hatırlayıp doğru konumda bulursa ✓",
      easy: "Tek, çok belirgin yer imi; saklama ile bulma arasını kısa tutun.",
      hard: "Birden çok yer imi; bekleme süresini uzatın ya da odayı kısaca terk ettirin.",
      tool: "geo",
    },
  },
  { // 3 — Yerel-Benlik Çerçevesi Kullanıcı (24–42 ay)
    how: "\"Senin sağında ne var? Önünde ne var?\" diye sorduğunuzda çocuk KENDİNE göre yön bulur: sağındaki rafı, önündeki masayı gösterir. Yönü dünyaya değil, kendi bedenine (\"benim sağım\") demirleyerek konumlar.",
    teacher: "Bu, benlik (egosentrik) çerçevesidir: çocuk uzamı kendi bedenini merkez alarak düzenler — ön/arka/sağ/sol \"bana göre\" anlam taşır. Bu doğal ve gerekli bir basamaktır; sol-sağ başta karışabilir (önce ön/arka oturur). Bedensel yön sözcüklerini günlük yaşamda bol kullanın (\"arkana bak\", \"sol elinle tut\"). Önemli: bu çerçeve çocuk dönünce DEĞİŞİR — bu sınırlılık, sonraki düzeylerde dışsal/sabit çerçeveye geçiş ihtiyacını doğurur.",
    act: {
      materials: ["çocuğun çevresine yerleştirilmiş tanıdık nesneler (oyuncak, kitap, kupa)", "ön/arka/sağ/sol için açık bir oturma alanı", "DokunSay Geo: yön okları (ops.)"],
      steps: [
        "Çocuğu nesnelerin ortasına oturtun: \"Önünde ne var? Arkanda ne var?\" diye sorun.",
        "\"Sağ elini kaldır\" deyip o yandaki nesneyi göstermesini isteyin.",
        "Çocuğu 90° döndürüp \"şimdi önünde ne var?\" deyin — yönün değiştiğini fark ettirin.",
        "\"Sol yanındakini bana ver\" gibi yön-yönergeli küçük görevler verin.",
      ],
      criterion: "Kendine göre (ön/arka, en az bir yanda sağ/sol) yönü doğru gösterirse ✓",
      easy: "Yalnız ön/arka ile başlayın; sağ ele bir bileklik/işaret koyun.",
      hard: "Döndükten sonra yeniden sordurun; sağ-sol ayrımını her iki yanda isteyin.",
      tool: "geo",
    },
  },
  { // 4 — Küçük Yerel Çerçeve Kullanıcı (48–60 ay) ★ DARBOĞAZ
    how: "Küçük bir masa-ızgarada (ör. 3×3 hücre) bir nesneyi, hedef önceden söylenmeden, BAŞKA nesnelere göre buldurursunuz: \"ağacın yanındaki, evin üstündeki kareye bak.\" Çocuk artık konumu yalnız kendine göre değil, nesneler-arası ilişkiyle (yanında/üstünde/arasında) çözer. Henüz oturmamışsa yine kendi bedenine kayar (\"benim sağımdaki\") ya da rastgele dener.",
    teacher: "Bu, yörüngenin ilk kritik darboğazıdır: çocuk benlik-merkezli yönden (\"benim sağım\") çıkıp nesneyi DIŞSAL bir yerel çerçevede — başka nesnelere göre — konumlamalıdır. Küçük, sınırlı bir alan (masa ızgarası) bu geçişi kolaylaştırır; çünkü tüm yer imleri bir bakışta görünür. Bu eşikte takılma, uzamsal akıl yürütmede erken bir uyarı olabilir. \"Bana göre değil, NEYE göre?\" sorusunu yerleştirin; konumu hep iki yer imiyle çapraz tanımlatın (\"ağacın sağında VE göletin üstünde\"). Bu beceri, harita ve koordinatın doğrudan ön koşuludur.",
    act: {
      materials: ["DokunSay Geo: küçük masa ızgarası (3×3 veya 4×4)", "ızgaraya konacak 3-4 belirgin yer imi (ağaç, ev, gölet figürü)", "saklanacak küçük bir nesne", "kapatma kartı"],
      steps: [
        "Yer imlerini ızgaraya yerleştirin; çocuk biraz baksın, sonra bir nesneyi gözü önünde bir hücreye koyun.",
        "Nesneyi kapatıp \"ağacın yanındaki kareye bak\" gibi YER İMİNE göre yönerge verin (hedef hücreyi söylemeden).",
        "Çocuk kendi bedenine kayarsa \"sana göre değil — ağaca göre neresi?\" diye yeniden yönlendirin.",
        "Konumu iki yer imiyle çapraz tarif edin (\"evin altında ve göletin solunda\") ve buldurun.",
      ],
      criterion: "Küçük bir ızgarada bir konumu, başka nesnelere göre (kendine göre değil) doğru bulursa ✓",
      easy: "Tek yer imi ve nesneye komşu hücre; ızgarayı 2×2'ye küçültün.",
      hard: "Birden çok yer imiyle çapraz tarif; ızgarayı çocuğun karşısına döndürerek (benlik çerçevesini bozarak) yoklayın.",
      tool: "geo",
    },
  },
  { // 5 — Yerel Çerçeve Kullanıcı (60–72 ay)
    how: "Çocuk odanın düzenini (masa şurada, dolap burada) zihninde tutar; siz onu döndürseniz ya da o yer değiştirse bile bir yeri doğru bulur. \"Kapıya göre çantam nerede?\" sorusuna, kendisi nereye baksa da odanın SABİT düzenine göre yanıt verir.",
    teacher: "Burada çerçeve artık küçük masadan TÜM ODAYA ölçeklenir ve gözlemciden bağımsızlaşır: çocuk mekânın düzenini sabit bir bütün olarak koruyabilir (\"oda dönmedi, ben döndüm\"). Bu, kararlı bir uzamsal (allosentrik) çerçevenin kurulduğunun işaretidir. Çocuğu odada döndürdükten sonra yer buldurun; \"sen döndün ama dolap yerinde\" mantığını söyletin. Bu sağlam yerel çerçeve, harita kullanmanın hemen altındaki basamaktır.",
    act: {
      materials: ["tanıdık bir oda ve sabit mobilyalar", "saklanacak bir nesne", "DokunSay Geo: odanın basit kuş-bakışı taslağı (ops.)"],
      steps: [
        "Bir nesneyi odada belli bir yere koyun; çocuk düzeni gözlesin.",
        "Çocuğu gözleri kapalı birkaç kez döndürün, sonra \"nesne nerede?\" diye buldurun.",
        "\"Sen döndün ama oda döndü mü?\" diye sabit düzeni fark ettirin.",
        "Çocuğun başladığı yeri değiştirin (odanın öbür ucu) ve aynı yeri yine buldurun.",
      ],
      criterion: "Kendisi döndükten/yer değiştirdikten sonra, odanın sabit düzenine göre bir yeri doğru bulursa ✓",
      easy: "Az döndürün; başlangıç yönünü koruyun; belirgin tek bir yer imi verin.",
      hard: "Çok döndürüp odanın karşı ucundan başlatın; iki yer imi arası bir konumu sordurun.",
      tool: "geo",
    },
  },
  { // 6 — Harita Kullanıcı (72–84 ay)
    how: "Resimli basit bir haritayı (sınıfın kuş-bakışı çizimi) eline aldığında, haritadaki bir işareti gerçek mekândaki yere eşleyip nesneyi bulur. \"Haritada X kapının yanında — demek gerçekte de kapının yanında\" diyerek iki ipucunu (haritadaki konum + gerçek yer imi) birleştirir.",
    teacher: "Bu, harita-gerçeklik eşlemesidir: çocuk küçük, kuş-bakışı bir temsili büyük gerçek uzama bağlar — temsilin gerçeği \"gösterdiğini\" kavrar. Başta haritayı gerçekle aynı yöne çevirmek (oryantasyon) gerekir; haritayı döndürüp hizalamayı birlikte yapın. Haritadaki sembolleri gerçek nesnelerle tek tek eşleştirin (\"bu kare = şu masa\"). Bu beceri, soyut uzamsal temsil ve koordinat sisteminin kapısıdır.",
    act: {
      materials: ["DokunSay Geo: sınıfın/odanın resimli basit haritası (kuş-bakışı)", "haritada işaretli bir hedef (X) ", "gerçek mekânda saklanmış bir nesne"],
      steps: [
        "Haritayı gerçek mekânla aynı yöne çevirerek birlikte hizalayın (\"kapı burada, haritada da burada\").",
        "Haritadaki birkaç sembolü gerçek nesnelerle eşleştirin: \"bu kare hangi eşya?\"",
        "Haritadaki X'i gösterip \"gerçekte burası neresi?\" diye nesneyi buldurun.",
        "Hedefi haritada değiştirip yeni konumu gerçekte bulma turunu yineleyin.",
      ],
      criterion: "Basit bir haritadaki bir konumu gerçek mekândaki yere eşleyip nesneyi bulursa ✓",
      easy: "Haritayı siz hizalayın; tek, çok belirgin yer imi kullanın.",
      hard: "Haritayı hafifçe döndürerek verin; iki ipucunu birleştirmesini (\"masaya yakın, pencereye uzak\") isteyin.",
      tool: "geo",
    },
  },
  { // 7 — Koordinat Çizici (84–96 ay)
    how: "Bir ızgarada bir noktayı koordinatla buldurursunuz: \"2. sütun, 3. sıra.\" Çocuk önce sütunu (sağa doğru) sayar, sonra sırayı (yukarı/aşağı) sayıp tam kesişimi işaretler. Tersine, gösterdiğiniz bir hücrenin koordinatını (\"3. sütun, 1. sıra\") söyler.",
    teacher: "Bu, koordinat sisteminin temelidir: konum artık iki sayıyla (sütun, sıra) tam belirlenir — uzamsal düşünme sayısallaşır. En sık yanılgı sütun-sıra sırasını karıştırmak ya da çizgileri/boşlukları yanlış saymaktır; \"önce yan (sütun), sonra yukarı (sıra)\" kuralını sabitleyin. Sütunları ve sıraları kenarda numaralandırın. Bu beceri, kartezyen düzlemin, grafik okumanın ve cebirsel koordinatların doğrudan tohumudur — \"sıralı ikili\" (ordered pair) fikrini erken kurar.",
    act: {
      materials: ["DokunSay Geo: numaralı ızgara (sütunlar 1-2-3…, sıralar 1-2-3…)", "işaretleyici (pul/jeton)", "koordinat kartları (ör. \"2. sütun, 3. sıra\")"],
      steps: [
        "Izgaranın kenarındaki sütun ve sıra numaralarını birlikte okuyun.",
        "Bir koordinat verin: \"2. sütun, 3. sıra\" — çocuk önce sütunu sayıp parmağını koysun, sonra sırayı saysın, kesişimi işaretlesin.",
        "Tersine çevirin: bir hücreye jeton koyun, \"bu kaçıncı sütun, kaçıncı sıra?\" diye söyletin.",
        "Birkaç koordinatla \"hazine yeri\" oyunu yapın; sıra-sütun karışırsa kuralı (\"önce yan, sonra yukarı\") yineleyin.",
      ],
      criterion: "Verilen koordinatla (sütun, sıra) doğru hücreyi işaretler ve bir hücrenin koordinatını söylerse ✓",
      easy: "Küçük ızgara (3×3); yalnız koordinattan hücre bulmayı isteyin.",
      hard: "Daha büyük ızgara (5×5); hücreden koordinat üretme ve sütun-sıra ters sıralı sorular ekleyin.",
      tool: "geo",
    },
  },
  { // 8 — Rota Haritası İzleyici (96–108 ay)
    how: "Bir rota haritası (başlangıçtan hedefe çizgiyle gösterilmiş yol) verdiğinizde, çocuk haritadaki rotayı adım adım gerçek harekete çevirir: \"düz git, ikinci köşeden sola dön, üçüncü kapıda dur.\" Haritadaki dönüşleri ve sıraları gerçek yönlere doğru aktarır.",
    teacher: "Bu, statik bir konumdan ROTAYA (sıralı yönler dizisi) geçiştir: çocuk harita üzerindeki bir yolu izleyip eylem dizisine dönüştürür — yön + sıra + dönüş bilgisini bir arada yönetir. Haritayı kendi gidiş yönüne göre sürekli yeniden hizalamak (özellikle dönüşlerde harita döner) en zorlandığı yerdir. Rotayı önce parmakla \"yürütün\", sonra gerçekte adımlatın. Bu beceri, gerçek navigasyonun ve algoritmik sıralı düşünmenin (adım-adım yönerge) zeminidir.",
    act: {
      materials: ["DokunSay Geo: üzerinde rota çizili basit harita", "gerçek mekânda kurulu bir parkur (dönüşlü)", "başlangıç ve hedef işaretleri"],
      steps: [
        "Rotayı haritada birlikte parmakla izleyin: \"düz… burada sola… sonra düz… hedef.\"",
        "Rotayı sözlü yönergeye çevirtin: \"önce ne yapacağız, sonra?\"",
        "Çocuk haritaya bakarak gerçek parkuru yürüsün; dönüşlerde haritayı gidiş yönüne hizalamasını hatırlatın.",
        "Başlangıç ve hedefi değiştirip yeni bir rotayı izletin.",
      ],
      criterion: "Bir rota haritasını izleyip dönüşleri/sırayı doğru uygulayarak hedefe ulaşırsa ✓",
      easy: "Tek dönüşlü kısa rota; haritayı siz hizalı tutun, parmakla önden gösterin.",
      hard: "Çok dönüşlü rota; haritayı çocuğa döndürerek verin ve dönüşlerde kendi hizalamasını isteyin.",
      tool: "geo",
    },
  },
  { // 9 — Çerçeve Kullanıcı (96–114 ay)
    how: "Dönüştürülmüş ya da döndürülmüş bir haritayla (kuzeyi size ters bakan, çevrili bir kroki) yön buldurursunuz. Çocuk, haritanın kendi bakışına göre döndüğünü hesaba katarak yine doğru yönü bulur: \"harita ters dönmüş; bende sağ olan, haritada sol.\" Gözlemci konumunu ve yer imlerini birlikte düşünür.",
    teacher: "Bu, yörüngenin doruğu: SOYUT, gözlemciden bağımsız uzamsal çerçeve. Çocuk artık çerçeveyi kendi bedeninden tümüyle koparabilir — haritayı zihinde döndürüp gözlemci konumuyla yer imlerini eşgüdümler (zihinsel döndürme). Döndürülmüş/farklı bakış açılı haritalarla bilerek çalışın; \"sen nerede duruyorsun, harita nasıl dönmüş?\" diye iki bilgiyi birlikte sorgulatın. Bu soyut çerçeve, ileri geometri, harita/grafik okuma ve perspektif alma (başkasının bakışından görme) için kritik zemindir.",
    act: {
      materials: ["DokunSay Geo: aynı mekânın düz ve döndürülmüş (90°/180°) iki harita kopyası", "haritada işaretli birkaç hedef", "gözlemci konumunu gösteren bir figür/işaret"],
      steps: [
        "Önce düz haritayla bir hedefi buldurun; sonra aynı haritayı döndürerek verin.",
        "\"Harita döndü; sende sağ olan haritada neresi?\" diye dönüşü hesaplatın.",
        "Gözlemci figürünü haritanın farklı kenarına koyun: \"o figür için sol neresi?\" (perspektif alma).",
        "Döndürülmüş haritada birkaç hedefi, yer imi + gözlemci yönünü birleştirerek buldurun.",
      ],
      criterion: "Döndürülmüş/dönüştürülmüş bir haritada, gözlemci konumu ile yer imlerini birlikte kullanarak yönü doğru bulursa ✓",
      easy: "Yalnız 90° dönüş; gerçek mekânla yan yana karşılaştırarak hizalatın.",
      hard: "180° dönüş ve başka bir gözlemcinin bakışından (perspektif alma) yön sorun; harita-gerçek karşılaştırması olmadan zihinden çözdürün.",
      tool: "geo",
    },
  },
]
