// Sınıflama ve Veri Analizi (Classification & Data) — düzey zenginleştirmesi (Clements & Sarama)
// trajectories.data.js içindeki "classif" yörüngesinin 11 düzeyini öğretmen/veli için
// derinleştirir. Altın-standart şablon: yorunge.enrich.js (sub).
// Pedagojik yay: benzerlik sezme → benzer/farklı yapma → tek özelliğe göre sınıflama →
// VERİLEN özelliğe göre tutarlı sınıflama (darboğaz) → ölçüt değiştirerek esnek sınıflama →
// veri durumu okuma → veri sınıflandırma → çoklu özellik → veri toplama →
// hiyerarşik sınıflama (sınıf-içinde-sınıf) → grafikle temsil.
// Her düzey: how (nasıl görünür) · teacher (öğretmen notu) · act (etkinlik) ·
// tool (opsiyonel DokunSay aracı; "veri"). viz YOK → amblem 📊.
export default [
  { // 0 — Benzerlik Sezici: Temeller (0–30 ay)
    how: "Çocuk oyuncak kutusunu karıştırırken aynı renk ya da aynı biçimdeki nesnelere yönelir: iki özdeş arabayı yan yana getirir ya da bir bloğu eşine değdirir. Henüz \"benzer\" diye adlandıramaz ama benzeyenleri sezgisel olarak buluşturur; \"bu da onun gibi\" duygusunu yaşar.",
    teacher: "Bu, sınıflamanın dile dökülmemiş ilk tohumudur: çocuk henüz ölçüt seçemez ama benzerliği ve farklılığı \"hisseder\". Amaç gruplamak değil, benzeyen-benzemeyen karşıtlığına dikkati uyandırmaktır. Özdeş nesne çiftlerini (iki aynı pul, iki aynı kaşık) yan yana göstererek \"bak, bunlar aynı!\" deyin; sonraki tüm sınıflama ve veri düşüncesi bu örtük benzerlik sezgisine yaslanır.",
    act: {
      materials: ["özdeş çiftler hâlinde DokunSay pulları (aynı renkten ikişer)", "bir tepsi ya da örtü"],
      steps: [
        "Birkaç özdeş çifti (iki sarı, iki mavi pul) çocuğun önüne karışık koyun.",
        "Bir sarıyı eline alıp ötekinin yanına götürün: \"Bak, bu da sarı, aynı!\" deyin.",
        "Çocuğun benzeyene uzanmasını, eşini buluşturmasını ya da bakışını gözleyin.",
        "Bazen çok farklı bir nesne (büyük kaşık) ekleyip \"bu farklı\" tepkisini yoklayın.",
      ],
      criterion: "Benzeyen nesnelere yönelir, eşini buluşturur ya da benzerliğe belirgin tepki verirse ✓",
      easy: "Yalnız iki çok belirgin renk kullanın; çifti siz birlikte buluşturun.",
      hard: "Benzerliği inceltin (aynı renk, farklı biçim) ve \"hangisi ona benziyor?\" diye sezdirin.",
    },
  },
  { // 1 — Benzer/Farklı Yapıcı (18–36 ay)
    how: "\"Benzeyenleri bir araya koy\" dediğinizde çocuk karışık nesneleri kabaca ayırır: kırmızıları bir yana, mavileri bir yana ya da topları bir öbeğe toplar. Ölçütü kendisi seçer ve bu ölçüt oyun ortasında değişebilir (önce renge, sonra biçime kayabilir).",
    teacher: "Tanımaktan YAPMAYA geçiş: çocuk artık benzerliği yalnız sezmiyor, benzeyenleri elleriyle bir araya getiriyor. Bu düzeyde ölçütün tutarlı olması beklenmez — bugün renge, az sonra biçime göre öbekleyebilir; bu gelişimsel olarak normaldir. Çocuğun seçtiği ölçütü adlandırın (\"bunları renklerine göre topladın\") ki ayrım bilinçli bir ada kavuşsun. Henüz \"verilen\" bir ölçüte uyması istenmez — kendi grubunu kendi mantığıyla kurar.",
    act: {
      materials: ["iki renk ve iki biçimde karışık DokunSay pulları", "ayırmak için iki-üç küçük tabak ya da sınıflama halkası"],
      steps: [
        "Karışık pulları ortaya koyun: \"Benzeyenleri bir araya koy.\"",
        "Çocuk öbeklerini kursun; siz karışmadan gözleyin (ölçütü o seçsin).",
        "Bitince \"bunları neye göre ayırdın?\" diye sorup seçtiği ölçütü adlandırın.",
        "\"Başka türlü de ayırabilir misin?\" diye ikinci bir gruplamayı davet edin.",
      ],
      criterion: "Karışık nesneleri kendi seçtiği bir ölçüte göre benzer/farklı öbeklere ayırırsa ✓ (ölçüt tutarlı olmak zorunda değil)",
      easy: "Yalnız iki belirgin renk verin; \"sarılar buraya, maviler buraya\" diye modelleyin.",
      hard: "Üç özellik (renk + biçim + boy) karıştırın; çocuk kendi ölçütünü açıklasın.",
    },
    tool: "veri",
  },
  { // 2 — Basit Sınıflayıcı (36–48 ay)
    how: "\"Bunları renklerine göre ayır\" dediğinizde çocuk TEK bir özelliği (rengi) seçip tüm nesneleri ona göre öbekler: kırmızılar bir halkaya, maviler ötekine. Bir oyun boyunca aynı ölçüde tutarlı kalır; biçim ya da boy değişse bile rengi temel alır.",
    teacher: "Burada sınıflama gerçek bir ölçüte oturur: çocuk artık tek bir özelliği bilinçle seçip onu tüm kümeye tutarlı uygular. Ölçütü genellikle KENDİSİ belirler — \"renge göre\" dediğinizde renge göre ayırır, ama hangi rengin hangi grup olacağına kendi karar verebilir. Bu, verilen bir kategoriye tutarlı uyma darboğazının (sonraki düzey) hazırlığıdır. Bir ölçütü bitirip ikinciye geçmek için \"şimdi de biçime göre dene\" diyerek esnekliği tohumlayın.",
    act: {
      materials: ["DokunSay pulları (iki-üç renk, aynı biçim)", "her renk için bir sınıflama halkası ya da tabak"],
      steps: [
        "Karışık pulları koyun: \"Bunları renklerine göre ayır.\"",
        "Çocuk her rengi ayrı halkaya öbeklesin; siz \"bu halkada hangi renk var?\" diye adlandırtın.",
        "Bir pulu yanlış halkaya koyarsa \"bu halkada hepsi ne renk olmalı?\" diye düşündürün.",
        "Sonra \"şimdi biçimlerine göre ayır\" deyip aynı tutarlılığı yeni ölçütte yoklayın.",
      ],
      criterion: "Tek bir özelliğe (renk ya da biçim) göre tüm nesneleri tutarlı öbeklere ayırırsa ✓",
      easy: "Yalnız iki renk, az sayıda pul; her halkaya bir örnek koyarak başlayın.",
      hard: "Üç-dört renk ya da rengi bir oyun, biçimi sonraki oyun ölçüt yaparak art arda sınıflatın.",
    },
    tool: "veri",
  },
  { // 3 — Benzer Özelliklere Göre Sınıflayıcı (54–66 ay) ★ DARBOĞAZ
    how: "\"Hepsi kırmızı olanları bul\" gibi VERİLEN bir özelliğe göre, dikkatini dağıtan başka özellikler arasından (büyük-küçük, yuvarlak-köşeli) yalnız kırmızıları tutarlı seçer. Henüz oturmamışsa ölçüt ortada kayar: birkaç kırmızıyı alır, sonra hoşuna giden bir maviyi de katar ya da \"kırmızı\"yı bırakıp biçime göre toplamaya başlar.",
    teacher: "Bu yörüngenin ilk gerçek darboğazıdır: çocuğun KENDİ seçtiği değil, DIŞARIDAN VERİLEN bir ölçüte tüm küme boyunca tutarlı bağlı kalması gerekir. En sık güçlük, dikkat dağıtıcı özelliklerin (boy, biçim) çocuğu ölçütten saptırması — yani \"kırmızı\" kuralını unutup başka bir benzerliğe kaymasıdır. Bu tutarlılıktaki süreğen güçlük, matematik öğrenme güçlüğü (diskalkuli) ve yürütücü-işlev açısından dikkat edilesi bir işaret olabilir; çünkü verilen bir kuralı bellekte tutup karışık girdiye uygulamak, hem veri analizinin hem kural-temelli akıl yürütmenin önkoşuludur. Ölçütü sürekli sesli hatırlatın (\"yalnız KIRMIZI; bu kırmızı mı?\"), seçim alanını bir sınıflama halkasıyla çevreleyin ki \"içeri giren\" ölçütü taşısın; her nesne için \"bu kurala uyuyor mu?\" diye tek tek denetletin.",
    act: {
      materials: ["DokunSay pulları (renk + biçim + boy karışık — dikkat dağıtıcılı)", "verilen ölçüt için bir sınıflama halkası/Venn çemberi", "ölçütü gösteren bir örnek/kart (kırmızı pul)"],
      steps: [
        "Karışık pulları yayın, ölçütü bir örnekle gösterin: \"Hepsi kırmızı olanları şu halkaya topla.\"",
        "Her pulu eline alınca \"bu kırmızı mı?\" diye sordurup yalnız uyanı halkaya aldırın.",
        "Hoşuna giden ama kırmızı olmayan bir pulu katarsa durdurup \"kuralımız neydi? bu kırmızı mı?\" diye geri döndürün.",
        "Bitince halka içini tek tek denetletin (\"hepsi kırmızı mı?\") ve dışarıda kalan bir kırmızı varsa buldurun.",
      ],
      criterion: "Verilen bir özelliğe (ör. kırmızı) göre, dikkat dağıtıcılar arasından tüm küme boyunca tutarlı, eksiksiz seçim yaparsa ✓",
      easy: "Dikkat dağıtıcıyı azaltın (yalnız renk değişsin, biçim/boy aynı olsun); ölçüt örneğini halkanın yanında tutun.",
      hard: "Ölçütü olumsuzla (\"kırmızı OLMAYANLARI bul\") ya da daha incelikli bir özellik (\"köşeli olanlar\") verin.",
    },
    tool: "veri",
  },
  { // 4 — Tutarlı, Esnek Sınıflayıcı (66–78 ay)
    how: "Bir kümeyi renge göre ayırdıktan sonra \"şimdi de şekline göre ayır\" dediğinizde, çocuk önceki ölçütü bırakıp aynı nesneleri YENİ bir ölçüte göre baştan öbekler — üstelik bunu zorlanmadan, eski gruplamaya saplanmadan yapar. Aynı nesnelerin birden çok yolla sınıflanabileceğini kavrar: \"bunlar hem renkli hem yuvarlak, ikisinden de ayrılabilir.\"",
    teacher: "Esnek sınıflama, tutarlı sınıflamanın bir üst basamağıdır: çocuk yalnız bir ölçüde sadık kalmakla kalmaz, İSTENDİĞİNDE ölçütü değiştirip aynı kümeyi yeniden düzenleyebilir (zihinsel esneklik / yürütücü işlev). Sık görülen takılma, ilk gruplamaya \"yapışmak\" — yeni ölçüt verildiğinde eski öbekleri korumaya çalışmaktır. Aynı nesneleri önce renge, sonra biçime, sonra boya göre ayırtarak \"bir şey birden çok türlü gruplanabilir\" içgörüsünü pekiştirin; \"bu sefer neye göre ayırıyoruz?\" diye ölçüt geçişini her seferinde dile döktürün. Bu, çoklu özellik ve hiyerarşik sınıflamanın (ileri düzeyler) zeminidir.",
    act: {
      materials: ["DokunSay pulları (renk + biçim + boy birlikte değişen)", "sınıflama halkaları (ölçüt başına bir-iki)", "ölçütü işaretleyen kartlar (renk / biçim / boy)"],
      steps: [
        "Önce renge göre ayırtın; bitince \"şimdi her şeyi karıştır, bu sefer ŞEKLİNE göre ayır.\"",
        "Eski öbeklere dönmeye çalışırsa \"artık kuralımız renk değil, biçim\" diye geçişi vurgulayın.",
        "Üçüncü tur boya göre ayırtın; her turda \"bu sefer neye göre?\" diye ölçütü söyletin.",
        "\"Aynı pulları kaç farklı yolla ayırabildik?\" diye esnekliği fark ettirin.",
      ],
      criterion: "Verildiğinde ölçütü (renk→biçim→boy) değiştirerek aynı kümeyi tutarlı biçimde yeniden sınıflarsa ✓",
      easy: "Yalnız iki ölçüt (renk ↔ biçim) arasında geçiş yaptırın; her geçişte ölçüt kartını gösterin.",
      hard: "Çocuğa ölçütü kendisi seçtirip \"başka hangi yolla ayırabilirsin?\" diye üç-dört farklı sınıflama buldurun.",
    },
    tool: "veri",
  },
  { // 5 — Veri Durumu Görüntüleyici (78–90 ay)
    how: "Halkalara ayrılmış bir nesne grubunu ya da basit bir resim grafiğini gösterip \"En çok hangisinden var?\" dediğinizde çocuk grupları karşılaştırıp doğru yanıtı verir: \"en çok mavi var, en az sarı.\" Hazır düzenlenmiş bir veri durumunu OKUR — gruplar arası çoklukları görüp \"daha çok / daha az / eşit\" diye yorumlar.",
    teacher: "Burada sınıflama VERİ OKUMAYA bağlanır: çocuk artık yalnız öbek kurmuyor, kurulmuş öbekleri bir bilgi kaynağı gibi okuyor (\"hangisi daha çok?\"). Bu, veri analizinin ilk adımıdır — düzenlenmiş veriden anlam çıkarmak. Nesne öbeklerini tek tek saydırmak yerine, eşit aralıklı dizip uzunlukları karşılaştırtın (resim grafiği mantığı); böylece \"daha uzun sıra = daha çok\" görsel sezgisi yerleşir. \"En çok, en az, kaç fazla?\" sorularıyla veriyi konuşturun. Bu, verinin toplanması ve grafiklenmesine (ileri düzeyler) köprüdür.",
    act: {
      materials: ["DokunSay Veri: önceden öbeklenmiş pullar ya da basit bir resim grafiği", "eşit aralıklı dizmek için bir taban/ızgara", "karşılaştırma için sınıflama halkaları"],
      steps: [
        "Üç renk pulu eşit aralıkla ayrı sıralar hâlinde dizin (resim grafiği gibi).",
        "\"En çok hangisinden var? En az hangisinden?\" diye sorun; sıraları uzunluktan okutun.",
        "\"Maviden kaç fazla var sarıya göre?\" diye iki grubu karşılaştırtın.",
        "İki grup eşitse \"bunlar eşit mi?\" diye \"eşit\" durumunu da fark ettirin.",
      ],
      criterion: "Hazır düzenlenmiş bir veri durumunu okuyup en çok/en az olanı ve gruplar arası farkı doğru söylerse ✓",
      easy: "İki grupla ve belirgin farkla başlayın; sıraları yan yana hizalayın.",
      hard: "Dört-beş grup, yakın çokluklar ya da \"toplam kaç nesne var?\" diye birleştirtin.",
    },
    tool: "veri",
  },
  { // 6 — Veri Sınıflandırıcı (90–102 ay)
    how: "Çocuk karışık nesneleri kendisi sınıflara ayırır VE her gruptaki sayıyı söyler: \"kırmızılardan 5, mavilerden 3, sarılardan 2 tane var.\" Yani sınıflamayı sayısal veriye dönüştürür — yalnız öbekleri kurmaz, her öbeği niceler ve \"hangi grup kaç\" tablosunu üretir.",
    teacher: "Bu düzeyde sınıflama ile sayma birleşir: çocuk grupları kurup her birinin çokluğunu belirleyerek HAM VERİ üretir. Bu, betimsel veri analizinin çekirdeğidir — \"neye göre ayırdık\" (kategori) + \"her kategoride kaç var\" (frekans). Her grubu saydırıp sayısını bir etikete/çeteleye yazdırın ki kategori-sayı eşlemesi somutlaşsın. \"En kalabalık grup hangisi, neden?\" diye veriyi yorumlatın. Bu, veri toplama ve grafikleme düzeylerinin doğrudan temelidir; \"=\" değil ama \"kaç\" ilişkisini sınıf yapısına bağlar.",
    act: {
      materials: ["DokunSay Veri: karışık pullar (üç-dört kategori)", "her grup için sınıflama halkası", "grup sayılarını yazmak için çetele/etiket kartları"],
      steps: [
        "Karışık pulları çocuğa sınıflatın (ör. renge göre üç-dört grup).",
        "Her grubu tek tek saydırıp sayısını bir etikete/çeteleye yazdırın.",
        "\"Hangi gruptan en çok var? Hangisinden en az?\" diye veriyi okutun.",
        "Bir-iki pulu başka gruba taşıyıp \"şimdi sayılar nasıl değişti?\" diye güncelletin.",
      ],
      criterion: "Nesneleri kendi sınıflandırıp her gruptaki çokluğu sayar ve kategori–sayı eşlemesini söyler/yazarsa ✓",
      easy: "Üç grupla ve küçük sayılarla; her grubu siz birlikte saydırın.",
      hard: "Daha çok kategori ya da iki ölçütle (renk + biçim) ayırıp her alt grubu saydırın.",
    },
    tool: "veri",
  },
  { // 7 — Çoklu Özellik Sınıflandırıcı (96–108 ay)
    how: "\"Hem kırmızı HEM yuvarlak olanları bul\" dediğinizde çocuk İKİ özelliği birden gözeterek seçer: yalnız kırmızı yuvarlakları alır, kırmızı ama köşeli ya da yuvarlak ama mavi olanları dışarıda bırakır. İki ölçütün KESİŞİMİNİ kurar; \"ikisi de doğru olmalı\" mantığını uygular.",
    teacher: "Çoklu özellik sınıflaması, tek ölçütten iki ölçütün AYNI ANDA tutulmasına geçiştir — bu, mantıksal \"ve\" (kesişim) düşüncesidir ve yürütücü-işlev yükü yüksektir. Sık yanılgı, çocuğun tek ölçüde gevşemesi: \"kırmızı\" olan her şeyi (yuvarlak olmasa da) ya da \"yuvarlak\" olan her şeyi almasıdır. İki çemberli bir Venn düzeni bu kesişimi görselleştirir: bir çember \"kırmızılar\", öteki \"yuvarlaklar\", ortak alan \"hem-hem\". Çocuğa her nesne için \"kırmızı MI? yuvarlak MI? ikisi de mi?\" diye iki ayrı denetim yaptırın. Bu, hiyerarşik sınıflama ve çok değişkenli veri okumanın hazırlığıdır.",
    act: {
      materials: ["DokunSay Veri: renk × biçim çaprazlanmış pullar (kırmızı/mavi × yuvarlak/köşeli)", "iki çemberli Venn düzeni (kesişimli)", "iki ölçütü gösteren kartlar (kırmızı + yuvarlak)"],
      steps: [
        "İki ölçütü kartla gösterin: \"Hem kırmızı HEM yuvarlak olanları ortak alana koy.\"",
        "Her pulu \"kırmızı mı? yuvarlak mı?\" diye iki kez denetletip yalnız ikisini de sağlayanı kesişime aldırın.",
        "Yalnız kırmızı (köşeli) olanları \"kırmızı\" çemberinin tek tarafına, yalnız yuvarlak (mavi) olanları öteki tarafa koydurun.",
        "Bitince \"ortadakilerin hepsi hem kırmızı hem yuvarlak mı?\" diye kesişimi denetletin.",
      ],
      criterion: "İki özelliğin kesişimine (hem kırmızı hem yuvarlak) göre, tek ölçüde gevşemeden doğru seçim yaparsa ✓",
      easy: "Önce iki ölçütü ayrı ayrı uygulatın (önce kırmızılar, sonra onlardan yuvarlaklar); Venn yerine art arda eleme.",
      hard: "Üç özellik (kırmızı + yuvarlak + büyük) ya da \"kırmızı AMA yuvarlak OLMAYANLAR\" gibi karışık ölçüt.",
    },
    tool: "veri",
  },
  { // 8 — Veri Toplayıcı (96–114 ay)
    how: "Çocuk bir soruyu (ör. \"sınıfta en sevilen renk hangisi?\") yanıtlamak için arkadaşlarından veri TOPLAR: herkese sorar, her yanıtı bir çeteleyle işaretler ve sonunda \"maviyi 6 kişi, kırmızıyı 4 kişi sevmiş\" diye özetler. Veriyi yalnız okumakla kalmaz, kendisi üretir, kaydeder ve toplar.",
    teacher: "Bu düzeyde çocuk veri döngüsünün üretim ucuna geçer: bir soru belirleyip yanıtları sistemli toplamak ve çeteleyle kaydetmek (her yanıt = bir işaret, beşli demetlerle gruplama). Sık güçlük, kaydı kaçırmak ya da aynı yanıtı iki kez saymaktır — her yanıt verildiği anda işaretlenmelidir. Çeteleyi beşli demetler (üst-üste dört + çapraz) hâlinde tutturun ki sayım kolaylaşsın; topladıktan sonra \"toplam kaç kişiye sorduk?\" diye doğrulatın. Bu, anlamlı bir soruyu veriyle yanıtlamanın ilk tam deneyimidir ve grafiklemenin (sonraki düzey) hammaddesini kurar.",
    act: {
      materials: ["DokunSay Veri: çetele/işaret tutmak için bir tablo", "kategori başlıkları (renk/seçenek kartları)", "toplanan veriyi somutlamak için pul demetleri"],
      steps: [
        "Birlikte bir soru seçin: \"En sevilen renk hangisi?\" Seçenekleri tabloya başlık yapın.",
        "Çocuk herkese tek tek sorsun; her yanıtı o anda ilgili sütuna çeteleyle işaretlesin.",
        "Çeteleyi beşli demetlerle tutturun; bittiğinde her kategoriyi saydırın.",
        "\"Toplam kaç kişiye sorduk? En çok hangi yanıt çıktı?\" diye veriyi özetletin.",
      ],
      criterion: "Bir soruya yönelik veriyi sistemli toplar, çeteleyle kaydeder ve kategori sayılarını doğru özetlerse ✓",
      easy: "Az kişiyle ve iki-üç seçenekle; her işareti siz birlikte koydurun.",
      hard: "Daha çok seçenek/kişi, çeteleyi beşli demetlere göre saydırma ya da iki soruyu birlikte toplatma.",
    },
    tool: "veri",
  },
  { // 9 — Hiyerarşik Sınıflandırıcı (96–120 ay)
    how: "\"Bütün kareler dikdörtgen midir?\" gibi bir kapsama sorusuna çocuk doğru yanıt verir ve gerekçelendirir: \"evet, çünkü karenin de dört dik açısı var, o da bir dikdörtgendir — ama her dikdörtgen kare değil.\" Bir sınıfın başka bir sınıfın İÇİNDE olabileceğini (alt-sınıf / üst-sınıf) kavrar; \"köpekler de hayvandır\" türü kapsama ilişkisini kurar.",
    teacher: "Hiyerarşik sınıflama (sınıf-içinde-sınıf) bilişsel olarak zorlu bir adımdır: çocuğun bir nesneyi aynı anda hem dar bir sınıfın (kare) hem geniş bir sınıfın (dikdörtgen) üyesi olarak tutması gerekir — Piaget'nin klasik \"sınıf-kapsama\" görevi. Sık yanılgı, alt ve üst sınıfı karşıt sanmaktır: \"kare ayrı, dikdörtgen ayrı.\" İç içe sınıflama halkalarıyla (büyük halka = dikdörtgenler, içindeki küçük halka = kareler) kapsamayı görselleştirin; \"bütün kareler büyük halkanın da içinde mi?\" diye sordurun. \"Bütün A'lar B midir? Bütün B'ler A mıdır?\" çiftini ayrı ayrı yoklatın. Bu, mantıksal kapsama ve ileri geometrik sınıflamanın temelidir.",
    act: {
      materials: ["DokunSay Veri: iç içe yerleştirilebilen sınıflama halkaları (büyük halka içinde küçük halka)", "alt/üst sınıf örnekleri (kare ve diğer dikdörtgen kartları; ya da hayvan/köpek kartları)", "kapsamayı gösteren bir Venn/şema"],
      steps: [
        "Büyük halkayı \"dikdörtgenler\", içindeki küçük halkayı \"kareler\" diye etiketleyin.",
        "Kareleri küçük halkaya, kare-olmayan dikdörtgenleri yalnız büyük halkaya yerleştirtin.",
        "\"Bütün kareler büyük halkanın içinde mi (dikdörtgen mi)?\" diye kapsamayı denetletin.",
        "Tersini yoklatın: \"Bütün dikdörtgenler kare midir?\" — \"hayır\" gerekçesini söyletin.",
      ],
      criterion: "Bir sınıfın başka sınıfı kapsadığını (ör. tüm kareler dikdörtgendir, tersi değil) kavrar ve gerekçelendirirse ✓",
      easy: "Tanıdık günlük kapsamayla başlayın (\"köpekler de hayvan mı?\"); iç içe halkalarla somutlaştırın.",
      hard: "Üç katlı kapsama (kare ⊂ dikdörtgen ⊂ dörtgen) ya da \"bazı / bütün / hiçbir\" ayrımlarını yoklayın.",
    },
    tool: "veri",
  },
  { // 10 — Veri Temsilcisi (96–132 ay)
    how: "Çocuk topladığı veriyi bir SÜTUN ya da RESİM grafiğine döker: her kategori için doğru yükseklikte sütun çizer/dizer, eksenleri etiketler ve grafiği okur (\"en uzun sütun mavi, demek en çok mavi seçilmiş\"). Ham çeteleyi görsel bir temsile çevirir ve temsilden geri anlam çıkarır.",
    teacher: "Bu yörüngenin doruğudur: veri döngüsünün tamamlanması — soru → toplama → sınıflama → TEMSİL → yorum. Çocuk sayısal veriyi, çoklukları görsel uzunluğa eşleyen bir grafiğe (her birim = bir kutu/pul) çevirir. Kritik incelik, eşit aralık ve ortak taban çizgisidir: sütunlar aynı yerden başlamazsa karşılaştırma yanıltır. DokunSay Veri ızgarasında her yanıtı bir kutuya koydurarak \"birim = bir oy\" temsilini kurun; grafiği bitince mutlaka GERİ okutun (\"grafiğe bakınca en çok/en az ne, kaç fark var?\"). Burada sınıflama, sayma ve görsel temsil tam anlamıyla veri okuryazarlığında birleşir.",
    act: {
      materials: ["DokunSay Veri: sütun grafiği ızgarası (ortak tabanlı kutular)", "kategori etiketleri ve birim kutuları/pullar", "toplanmış veri (önceki çetele)"],
      steps: [
        "Önceki çeteleyi alın: \"Her oyu bir kutuya koyalım — kaç oy varsa o kadar kutu.\"",
        "Her kategoriyi ortak taban çizgisinden başlatıp doğru yüksekliğe dizdirin; eksenleri etiketletin.",
        "\"En uzun sütun hangisi? En kısa? Aralarında kaç fark var?\" diye grafiği geri okutun.",
        "\"Grafik bize ne söylüyor?\" diye veriden bir sonuç cümlesi kurdurun.",
      ],
      criterion: "Topladığı veriyi ortak tabanlı, eşit aralıklı bir sütun/resim grafiğiyle doğru temsil eder ve grafiği geri okursa ✓",
      easy: "İki-üç kategori, küçük sayılar; sütunları birim kutularla (her oy = bir kutu) kurdurun.",
      hard: "Daha çok kategori, ölçek (her kutu = 2 oy) ya da iki grafiği karşılaştırıp \"hangisinde daha çok?\" diye yorumlatma.",
    },
    tool: "veri",
  },
]
