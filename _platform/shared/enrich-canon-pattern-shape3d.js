// ============================================================================
// KANONİK düzey zenginleştirmesi — Örüntü (11 düzey) + 3B Şekiller (7 düzey)
// ----------------------------------------------------------------------------
// Kaynak taksonomi: _canon/trajectory-canon.json  (id='patterning' 11 düzey,
// id='shapes3d' 7 düzey). Her öğe, ilgili kanonik düzeyin nameTr/desc/behavior
// alanlarıyla BİREBİR tutarlıdır. Pedagojik temel: Clements & Sarama öğrenme
// yörüngeleri (learning trajectories) + MEB ilişkilendirmesi.
//
// Eski DokunSay zenginleştirmesinden (enrich-pattern.js 12 öğe, enrich-shape3d.js
// 6 öğe) kavramsal olarak doğru içerik TAŞINMIŞ/uyarlanmıştır. Taksonomi yeniden
// hizalandığı için eşleme birebir değildir:
//   • Örüntü 12→11: eski "Örüntü Tamamlayıcı" + "AB Örüntü Kopyalayıcı"
//     kanonik "AB Örüntüsü Kuran"da BİRLEŞTİ (kanonik desc: tanır+betimler+kurar:
//     eksik ögeyi tamamlar, kopyalar, sona birim ekleyerek devam ettirir).
//     Eski "Başlangıç Aritmetik Örüntücü" (+2 kuralını söyle) kanonik 6'ya
//     (Sayı Örüntüsü Kuran) eridi; kanonik 7 artık "=" DENKLİK + sıfır özellikleri
//     ekseninde YENİDEN yazıldı.
//   • 3B 6→7: kanonik 5 "Parçalardan 3B Şekil Kuran" eski yapıda YOK; Clements &
//     Sarama "3D composition" temelinde SIFIRDAN yazıldı. Eski 4→kanonik 6,
//     eski 5→kanonik 7 olarak bir basamak kaydı.
//
// Her öğe: how (nasıl görünür) · teacher (öğretmen notu) · act (etkinlik:
// materials / steps / criterion / easy / hard). Türkçe.
// ============================================================================

export const PATTERN_ENRICH = [
  { // 1 — pat-01 · "Örüntüyü Sezen: Temeller" (0–2 yaş)
    how: "Çocuk bir tef ritmine ya da \"tak-tuk, tak-tuk\" gibi düzenli bir sese bedeniyle uyum sağlar: tekrara doğru sallanır, alkış-alkış-dur dizisine eşlik eder. Henüz \"örüntü\" diyemez ama düzenliliği örtük olarak sezer; tanıdık dizinin \"sıradaki\" adımından önce gülümseyip hazırlanır, düzen bozulunca duraksar.",
    teacher: "Bu, örüntünün dile dökülmemiş ilk sezgisidir: çocuk kuralı göremez ama düzenliliği \"hisseder\". Amaç saymak ya da kopyalamak değil, ritim ve tekrarın keyfini yaşatmaktır. Tekerlemeler, el-çırpma kalıpları ve \"kırmızı-mavi, kırmızı-mavi\" gibi sesli diziler bu çekirdeği besler. Sonraki tüm örüntü ve cebirsel düşünme bu örtük düzen sezgisine yaslanır; bu yüzden \"henüz matematik değil\" diye geçiştirmeyin.",
    act: {
      materials: ["renkli DokunSay pulları (iki renk)", "ritim için bir tef/kutu ya da el-çırpma"],
      steps: [
        "İki renk pulu \"kırmızı-mavi, kırmızı-mavi\" diye sesli söyleyerek yan yana dizin.",
        "Aynı ritmi elle çırpın: \"güçlü-yumuşak, güçlü-yumuşak\" — çocuğun katılmasını bekleyin.",
        "Çocuk bedeniyle/sesle ritme uyarsa coşkuyla onaylayın.",
        "Düzeni bilerek bozun (\"kırmızı-kırmızı?\") ve tepkisini (duraksama, bakış) gözleyin.",
      ],
      criterion: "Tekrarlayan bir ritme/diziye sesle ya da hareketle uyum sağlar, düzen bozulunca tepki verirse ✓",
      easy: "Tek bir kısa, abartılı ritme sadık kalın; bedensel eşlik yeter.",
      hard: "İki renkli pul dizisini gösterip \"sıradaki hangi renk?\" diye sezdirmeye çalışın.",
    },
  },
  { // 2 — pat-02 · "Örüntüyü Fark Eden" (2–3 yaş)
    how: "Çocuğa ABAB diye dizilmiş renkli pulları gösterip \"Burada bir örüntü var mı?\" dediğinizde \"evet\" der ya da \"bak, hep böyle gidiyor!\" diyerek tekrarı parmağıyla gösterir. Düzenli (örüntülü) bir diziyle yanındaki rastgele yığını ayırt eder: \"bu güzel sıralı, bu karışık\".",
    teacher: "Bu, örüntünün VARLIĞINI fark etmektir — henüz tamamlamak ya da kopyalamak değil. Çocuk \"bir şey tekrar ediyor\" diye sezer; bu, örüntü düşüncesinin ilk bilinçli adımıdır. Düzenli ile düzensiz dizileri yan yana koyup \"hangisinde tekrar var?\" diye sordurun. \"Örüntü\" sözcüğünü bol bol kullanın ki kavram bir ada kavuşsun; çocuğun düzeni kendi sözcükleriyle (\"hep sıralı\", \"kırmızı mavi kırmızı\") ifade etmesi bu düzeyin işaretidir.",
    act: {
      materials: ["renkli DokunSay pulları (iki renk)", "örüntü şeridi (dizmek için uzun bir oluk/zemin)"],
      steps: [
        "Bir şeride ABAB (ör. sarı-mor, sarı-mor) dizin: \"Burada bir örüntü var mı?\"",
        "Yanına rastgele bir yığın koyun: \"Peki burada? Hangisi tekrar ediyor?\"",
        "Çocuk örüntülü olanı seçip tekrarı gösterirse \"evet, sarı-mor tekrar ediyor\" deyin.",
        "Sesli örüntü ekleyin (çırp-vur, çırp-vur): \"bunda da örüntü var mı?\"",
      ],
      criterion: "Düzenli bir dizide örüntünün varlığını tanır ve onu rastgele bir diziden ayırırsa ✓",
      easy: "İki renk arasındaki karşıtlığı belirginleştirin; örüntüyü uzun tutun.",
      hard: "ABC (üç renk) örüntüsü gösterip \"bunda da tekrar var mı?\" diye yoklayın.",
    },
  },
  { // 3 — pat-03 · "AB Örüntüsü Kuran" (3–4 yaş)  [eski "Tamamlayıcı" + "AB Kopyalayıcı" BİRLEŞTİ]
    how: "Çocuk bir AB örüntüsüyle üç işi de yapar: (1) AB_AB'de boşluğa doğru pulu koyar; (2) verilen örüntünün \"aynısını\" yanına/altına birebir kopyalar (sarı-mor-sarı-mor); (3) sona birim ekleyerek diziyi iki adım uzatır. Henüz oturmamışsa doğru renkleri kullanır ama SIRAYI bozar (sarı-sarı-mor) ya da yalnız renkleri eşleştirip dizilişi göz ardı eder.",
    teacher: "Bu, örüntü becerisinin çekirdek düzeyidir; tanıma artık ÜRETMEYE dönüşür: tamamlama, kopyalama (önce modelin yanında, sonra uzağında/bellekten) ve devam ettirme tek bir AB kuralının üç yüzüdür. \"Doğru renkler ama yanlış sıra\" en sık yanılgıdır — çocuk örüntünün özünün renkte değil DİZİLİŞTE olduğunu kaçırır. Bu sıralı düzeni bellekte tutup yeniden üretme güçlüğü, matematik öğrenme güçlüğü (diskalkuli) açısından dikkat edilesi erken bir işarettir; çünkü sonraki cebirsel örüntü düşüncesinin önkoşuludur. Kopyalarken modeli çocuğun sırasının tam ÜSTÜNE hizalayın ki her öğeyi birebir eşleştirip sırayı görsel denetlesin.",
    act: {
      materials: ["renkli DokunSay pulları (iki renk, çift takım)", "örüntü şeridi (model + kopya için iki sıra)", "boşluk için bir yer-tutucu işaret"],
      steps: [
        "AB_AB kurup \"Buraya ne gelmeli?\" diye eksik ögeyi tamamlatın; \"neden o renk?\" diye gerekçe isteyin.",
        "Üst sıraya AB-AB-AB modeli kurun: \"Aynısını alt sıraya, her öğeyi modelin tam altına gelecek şekilde yap.\"",
        "Sırayı bozarsa durdurup \"modelde buradan sonra hangi renk var?\" diye eşleştirin; bitince üst-alt sıraları parmakla yan yana okuyup \"aynı mı?\" deyin.",
        "Modeli kaldırıp \"sona iki tane daha ekle\" diyerek bellekten devam ettirtin.",
      ],
      criterion: "AB örüntüsünde eksik ögeyi tamamlar, örüntüyü renk VE sırayı koruyarak kopyalar ve sona birim ekleyerek devam ettirirse ✓",
      easy: "Daha kısa model (AB-AB); boşluğu hep dizinin SONUNA koyun; modeli kopyanın hemen üstüne hizalayıp ilk çifti birlikte koyun.",
      hard: "Modeli gizleyip bellekten kopyalatın; boşluğu başa/ortaya alın ya da \"onuncu öğe hangi renk?\" diye ileri sorun.",
    },
  },
  { // 4 — pat-04 · "Çeşitli Örüntüler Kuran (AAB/ABC)" (4–5 yaş)
    how: "Çocuk artık iki ögeli AB'nin ötesine geçer: AAB, ABC, AABC gibi farklı çekirdek birimli örüntüleri tanır, betimler ve doğru kurar/devam ettirir. \"Kırmızı-kırmızı-mavi, kırmızı-kırmızı-mavi…\" (AAB) verildiğinde birimi bozmadan sürdürür; üç renkli ABC birimini de karıştırmadan ilerletir.",
    teacher: "Bu düzey, örüntü biriminin yalnızca iki ögeden ibaret olmadığını öğretir — çekirdek birim AAB, ABC, AABC olabilir. Bu, \"birim\" kavramına köprüdür ve bir sonraki düzeyde birimi açıkça soyutlamanın zeminini hazırlar. Sık yanılgı, daha zengin birimi AB'ye indirgemektir (AAB'yi \"kırmızı-mavi\" sanmak). Çocuk devam ettirirken \"tekrar eden parça ne, neden o renk?\" diye birimi sesli vurgulatın (\"A-A-B, A-A-B…\"); takılırsa birimi ritimle söyletin.",
    act: {
      materials: ["renkli DokunSay pulları (iki–üç renk)", "örüntü şeridi", "ritim için el-çırpma/ses"],
      steps: [
        "AAB örüntüsü kurup \"Devam ettir\" deyin; çocuk en az iki birim daha eklesin.",
        "\"Tekrar eden parça hangisi, az önce eklediğin neden o renkti?\" diye birimi söyletin.",
        "ABC örüntüsüne geçin: üç renkli birimi bozmadan uzattırın; sonra AABC'yi deneyin.",
        "Aynı örüntüyü sese çevirip (çırp-çırp-vur) ritimle sürdürtün.",
      ],
      criterion: "AAB / ABC / AABC gibi farklı çekirdek birimli bir örüntüyü, birimi koruyarak en az iki kez doğru sürdürürse ✓",
      easy: "Önce tanıdık AB'yi uzattırın; sonra AAB'ye geçip birimi sesli vurgulayın.",
      hard: "ABCC / AABC gibi karışık birimler ya da \"on ikinci öğe hangi renk?\" diye ileri sorun.",
    },
  },
  { // 5 — pat-05 · "Örüntüyü Aktaran ve Birimini Bulan" (4–5 yaş) ★ KRİTİK
    how: "ABB-ABB örüntüsünü gösterip \"Tekrar eden en küçük parça hangisi?\" dediğinizde çocuk birimi (ABB) işaretler — tüm diziyi değil, çekirdeği. Sonra küplerle kurulu kırmızı-mavi örüntüsünü \"alkış-tık\" dizisine ÇEVİRİR: aynı yapıyı bambaşka bir malzemeye taşır. Henüz oturmamışsa rastgele bir parça gösterir ya da çeviride yapıyı kaybeder.",
    teacher: "Bu düzeyin iki belirleyici işi var: örüntünün BİRİMİNİ (tekrar eden en küçük çekirdek) soyutlayıp tanımak ve aynı yapıyı yeni bir ortama (renkten harekete, sesten şekle) ÇEVİRMEK. Bu, cebirsel düşünmenin tohumudur: çocuk artık yüzeydeki renklere değil, altta yatan SOYUT YAPIYA bakar — \"ABB\", içeriği ne olursa olsun bir kuraldır. Birimi bulamama ya da çeviride yapıyı dağıtma, matematik öğrenme güçlüğü açısından anlamlı bir işaret olabilir; çünkü genellenebilir kurala dayalı cebir tam da bu beceriye yaslanır. Çocuğa birimi parmağıyla çevreletip \"işte tekrar eden parça\" dedirtin; sonra en az iki kanala çevirtip \"yapısı aynı mı?\" diye karşılaştırtın.",
    act: {
      materials: ["renkli DokunSay pulları (iki–üç renk)", "örüntü şeridi", "çeviri kanalları: alkış/zıplama (hareket), tef (ses), şekil kartları"],
      steps: [
        "ABB-ABB örüntüsü kurun: \"Tekrar eden en küçük parça hangisi?\" — birimi (ABB) çevreletin, \"kaç kez tekrar etmiş?\" diye diziden ayırttırın.",
        "Küp/pul örüntüsünü hareketle çevirtin: alkış-tık-tık; sonra sesle: vur-sus-sus.",
        "İki çeviriyi yan yana koyup \"yapısı aynı mı, neden?\" diye soyut kurala (ABB) bağlatın.",
        "Tersine çevirin: bir ritim dizisi verin, çocuk onu pullarla kursun.",
      ],
      criterion: "Tekrar eden en küçük birimi (ör. ABB) tanır ve aynı yapıyı en az bir başka kalıba (hareket/ses/şekil) doğru çevirirse ✓",
      easy: "Önce tanıdık AB biriminde çalışın; birimi siz çevreleyip yalnız çeviriyi yaptırın.",
      hard: "AAB / ABC birimleri; çocuk birimi söyleyip üç kanala (renk→hareket→ses→şekil) zincirleme çevirsin.",
    },
  },
  { // 6 — pat-06 · "Sayı Örüntüsü Kuran" (5–7 yaş)
    how: "Çocuk \"2, 4, 6, 8…\" gibi bir diziyi SAYISAL olarak betimler: \"ikişer artıyor\" der ve sürdürür. Renkli ögeler yerine artık sayılar örüntü oluşturur; bir dizinin geometrik temsiliyle (pullar/sıçramalar) sayısal temsili (sayılar) arasında çeviri yapar — işlevsel düşünmenin başlangıcı.",
    teacher: "Örüntü düşüncesi burada renk/şekilden SAYIYA taşınır; somut örüntü sayısal örüntüye dönüşür. Önemli kazanım, çocuğun diziyi yalnız sürdürmesi değil, geometrik ve sayısal temsiller arasında gidip gelmesidir: 2'şer dizilmiş pul grupları ↔ \"2, 4, 6\" ↔ sayı doğrusunda eşit sıçramalar. Sayı doğrusunda artışı görünür kılın. Çocuk \"ikişer artıyor\" diye düzenli değişimi adlandırabiliyorsa bu, bir sonraki düzeyin (\"=\" denkliği ve işlem örüntüleri) hazırlığıdır.",
    act: {
      materials: ["DokunSay pulları (sayısal dizi/gruplar için)", "sayı kartları (1–20)", "sayı doğrusu şeridi (0–20)"],
      steps: [
        "Sayı kartlarıyla 2, 4, 6, 8 dizin: \"Bu örüntüyü nasıl betimlersin? Sıradaki sayı?\"",
        "Aynı diziyi pul gruplarıyla kurdurun (2'şer): geometrik temsille sayısal temsili eşleştirin.",
        "5, 10, 15 ve 1, 2, 3, 4 gibi farklı dizilerle uzattırın.",
        "Sayı doğrusunda eşit sıçramalarla diziyi izlettirip \"her sıçrama kaç?\" diye sordurun.",
      ],
      criterion: "Bir sayısal örüntüyü sözle betimleyip (ör. \"ikişer artıyor\") en az iki adım sürdürür ve geometrik–sayısal temsil arasında çeviri yaparsa ✓",
      easy: "Birer artan dizilerle (1,2,3,4) ve sayı doğrusu desteğiyle başlayın.",
      hard: "İkişer/beşer/onar artan diziler ya da bir sayıdan başlatıp \"ondan sonra?\" diye sürdürtün.",
    },
  },
  { // 7 — pat-07 · "İşlem Örüntülerini Fark Eden" (5–7 yaş)
    how: "Çocuğa \"7 = 3 + 4 yazılabilir mi?\" dediğinizde \"evet\" der; \"3 + 4 = 2 + 5 doğru mu?\" sorusunu kabul eder — \"=\" işaretinin \"yanıtı buraya yaz\" değil, İKİ TARAFIN EŞİT olduğunu bildirdiğini anlar. \"5 + 0 kaç?\" gibi sıfırlı işlemleri tek tek saymadan kuralla yanıtlar (\"sıfır eklenince değişmez\").",
    teacher: "Bu düzeyin kalbi, eşittir işaretinin DENKLİK anlamıdır ve yaygın bir yanılgıyı kırar: çocukların çoğu \"=\" işaretini \"sonucu yaz\" komutu sanır (yalnız \"3+4=▯\" kalıbını kabul eder). Oysa \"7=3+4\" ve \"3+4=2+5\" de geçerlidir — iki taraf dengededir. Bunu somutlaştırmak için \"=\"yi bir TERAZİ/denge olarak resmedin: iki tepsi eşit ağırlıktaysa denktir. Ayrıca sıfırın özelliğini (a+0=a) bir kural olarak fark ettirin. Bu denge anlayışı, ileride bilinmeyenli ve değişkenli eşitliklerin (sonraki düzeyler) tüm temelidir; eksik kalırsa cebirde köklü güçlük doğurur.",
    act: {
      materials: ["DokunSay pulları (iki renk)", "\"=\" için denge/terazi imgesi ya da iki tepsi", "sayı cümlesi kartları (7=3+4, 3+4=2+5, 5+0)"],
      steps: [
        "Bir tepsiye 7 pul, ötekine 3+4 pul koyun: \"İki taraf eşit mi? Öyleyse 7 = 3 + 4 yazabilir miyiz?\"",
        "\"3 + 4 = 2 + 5 doğru mu?\" diye iki tarafı pullarla kurup dengeyi gösterin.",
        "\"=\"yi terazi olarak konuşun: \"eşitse denge bozulmaz; bu bir yanıt kutusu değil\".",
        "Sıfırı yoklayın: \"5 + 0, 0 + 6 — saymadan, kuralla söyle.\"",
      ],
      criterion: "Standart-dışı sayı cümlelerini (7=3+4; 3+4=2+5) DENKLİK olarak kabul eder ve sıfırın özelliğini kuralla kullanırsa ✓",
      easy: "Küçük sayılarla ve iki tepsiyle başlayın; önce \"4=4\", \"4=1+3\" gibi tek adımlı denklikler.",
      hard: "\"6+2 = 5+3 mü?\", \"8 = 9−1 mi?\" gibi karışık denklikler ya da \"hangi cümleler doğru?\" diye eleme yaptırın.",
    },
  },
  { // 8 — pat-08 · "İlişkisel Düşünen (+/−)" (6–7 yaş)
    how: "Çocuğa \"43 + 18 = 18 + 43 doğru mu?\" diye sorduğunuzda, ikisini de ayrı ayrı toplamadan \"doğru — yerler değişti, toplam değişmez\" der. Bir sayı cümlesinin iki tarafını HESAPLAMADAN, aralarındaki ilişkiye bakarak karşılaştırır; basit durumlar için işlevsel ilişkiler kurabilir.",
    teacher: "Bu, ilişkisel düşünmenin başlangıcıdır: çocuk sayıları tek tek işlemeden aralarındaki İLİŞKİYE bakar — toplamada değişme özelliği (a+b = b+a), eşitliğin denge anlamı. Bir önceki düzeydeki \"=\" denkliği burada akıl yürütmeye dönüşür: \"yeniden hesaplamadan nereden biliyorsun?\" sorusu kritiktir; gerekçe (\"sadece sıra değişti\") asıl kazanımdır, doğru/yanlış değil. Büyük sayılar (43+18) bilerek seçilir ki çocuk hesaplama yoluna sapmasın, ilişkiyi kullansın. \"5+3\" ile \"3+5\"i iki renk pul grubu olarak dizip \"toplam değişti mi?\" diye somutlayın.",
    act: {
      materials: ["DokunSay pulları (iki renk)", "denge/terazi imgesi ya da iki tepsi", "işlem kartları (büyük sayılı çiftler dâhil)"],
      steps: [
        "\"43 + 18 ile 18 + 43 aynı mı? Saymadan, neden?\" diye sorun; gerekçeyi onaylayın.",
        "Küçük çiftle somutlayın: bir tepsiye 5+3, ötekine 3+5 pul; \"toplam değişti mi?\"",
        "\"7 − 2 ile 2 − 7 aynı mı?\" diye çıkarmanın değişmediğini (simetrik olmadığını) yoklayın.",
        "\"6 + 5 = 6 + 4 + 1 mi?\" gibi bir tarafı parçalayıp dengeyi koruyan ilişkiler gösterin.",
      ],
      criterion: "Toplamanın değişme özelliğini (a+b=b+a) yeniden hesaplamadan, gerekçesiyle kavrar ve iki tarafı ilişkiye bakarak karşılaştırırsa ✓",
      easy: "Küçük sayılarla (2+1 / 1+2) ve iki renk pul grubuyla somutlaştırın.",
      hard: "\"3+4 = 2+5 mi?\" gibi farklı sayılarla denge ya da \"38+17 = 37+18 mi?\" gibi parçalama yaptırın.",
    },
  },
  { // 9 — pat-09 · "Sembollerle İlişkisel Düşünen (+/−)" (6–7 yaş)
    how: "Çocuğa \"a + b = b + a her sayı için doğru mu?\" dediğinizde \"evet, hangi sayıları koyarsan koy\" der — harfin BELİRLİ bir sayı değil, \"herhangi bir sayı\" anlamına geldiğini kavrar. İlişkiyi tek bir örnekle değil, genel olarak ifade eder; bilinmeyen için harf kullanır.",
    teacher: "Burada ilişkisel düşünme SEMBOLİK/GENEL düzeye taşınır: bir önceki düzeyde \"43+18=18+43\" tek bir durumdu; şimdi çocuk bunun TÜM sayılar için geçerli olduğunu \"a+b=b+a\" ile genelleştirir. Harf, cebirdeki değişkenin doğrudan habercisidir — \"yerine herhangi bir sayı konabilir\". Sık güçlük, harfi tek bir gizli sayı (\"a hep 5'tir\") sanmaktır; oysa harf bir değişkendir. \"a yerine ne koyarsak koyalım eşitlik bozuluyor mu?\" diye birkaç sayıyı deneterek genelliği yaşatın. Bu, kuralı tek örnekten genele taşıma — matematiksel genelleme — alışkanlığını kurar.",
    act: {
      materials: ["DokunSay pulları (iki renk)", "harf kartları (a, b)", "boşluk/harf içeren eşitlik kartları (a+b=b+a, a+0=a)"],
      steps: [
        "\"a + b = b + a\" kartını gösterip \"a yerine 5, b yerine 2 koyalım — doğru mu?\" diye deneyin.",
        "Farklı sayılar koydurun (a=10,b=3; a=7,b=7): \"hep doğru mu? Demek ki HER sayı için.\"",
        "\"a hep aynı sayı mı?\" yanılgısını yoklayın: \"hayır, a herhangi bir sayı olabilir\".",
        "\"a + 0 = a\", \"a − a = 0\" gibi genel kuralları sayılarla sınatıp genelleştirtin.",
      ],
      criterion: "Bir toplama ilişkisini değişkenlerle genelleştirir (a+b=b+a) ve harfin \"herhangi bir sayı\" anlamını kavrarsa ✓",
      easy: "Önce tek harfle (a+0=a) ve somut sayı denemeleriyle; harfi \"gizli kutu\" benzetmesiyle açıklayın.",
      hard: "\"(a+b)+c = a+(b+c) doğru mu?\" gibi birleşme ya da \"a−b = b−a mı?\" diye karşı-örnekle sınatın.",
    },
  },
  { // 10 — pat-10 · "Çarpmayla İlişkisel Düşünen" (6–8 yaş)
    how: "Çocuğa \"7 × 6'yı bilmiyorsan 5 × 6 ile 2 × 6'dan nasıl bulursun?\" dediğinizde dağılma özelliğini kullanır: \"5×6=30, 2×6=12, toplam 42\". Çarpmayı tekrarlı toplama olarak görür ve bir çarpımı tanıdık parçalara bölerek (dağılma) çözer; ilişkiler için harfi değişken olarak kullanabilir.",
    teacher: "İlişkisel düşünme burada ÇARPIMSAL alana genişler. Asıl kazanım, dağılma özelliğiyle bilinmeyen bir çarpımı bilinen parçalardan kurmaktır: 7×6 = 5×6 + 2×6. Bu, hem çarpma olgularını ezberlemeden türetmenin güçlü bir stratejisi hem de cebirdeki dağılma yasasının (a(b+c)=ab+ac) somut köküdür. Çarpmayı eşit gruplar/dizi (array) olarak kurun: 7 sıra × 6'lık diziyi 5 sıra + 2 sıra diye böldürün ki dağılma GÖRÜNSÜN. \"Hangi kolay çarpımlara bölebilirsin?\" diye esneklik kazandırın. Bu, oransal ve işlevsel düşünmeye köprüdür.",
    act: {
      materials: ["DokunSay pulları (dizi/array kurmak için)", "dizi (satır × sütun) düzeni", "çarpım kartları (7×6) ve parçalama şeridi"],
      steps: [
        "7 sıra × 6'lık bir dizi kurun: \"Bunu yatay bir çizgiyle 5 sıra + 2 sıra diye böl.\"",
        "Her parçayı ayrı çarptırın (5×6=30, 2×6=12) ve toplatın (42): \"demek 7×6=42\".",
        "Çarpmayı tekrarlı toplamayla bağlayın: \"7×6, altı'nın 7 kez toplanması\".",
        "Başka bir çarpımı (8×4) farklı bölmelerle (5×4+3×4) çözdürüp \"hep aynı sonuç mu?\" diye genelleştirin.",
      ],
      criterion: "Bir çarpımı dağılma özelliğiyle tanıdık parçalara bölerek (ör. 7×6 = 5×6 + 2×6) doğru bulur ve çarpmayı tekrarlı toplama olarak ilişkilendirirse ✓",
      easy: "Küçük, tanıdık çarpımlarla (6×3 = 5×3 + 1×3) ve görünür dizi gruplarıyla çalışın.",
      hard: "Daha büyük çarpımlar (12×4), tek çarpımı birkaç farklı yoldan böldürme ya da \"a×(b+c) = a×b + a×c neden hep doğru?\" diye genelletin.",
    },
  },
  { // 11 — pat-11 · "Kuralı Bulup Genelleyen" (7–8 yaş) ★ DORUK
    how: "Masa-sandalye tablosunu (1 masa→4, 2 masa→6, 3 masa→8) gösterip \"Kural ne?\" dediğinizde sabit-orantısız ilişkiyi bulur: \"Masa sayısının 2 katından 2 fazla.\" Girdi değiştikçe (5 masa? 10 masa?) kuralı işleterek doğru çıktıyı üretir; kuralın nereye kadar geçerli olduğunu (genellenebilirliğin sınırı) düşünmeye başlar — fonksiyonu bir nesne gibi görür.",
    teacher: "Bu, yörüngenin doruğudur: İŞLEVSEL düşünme — iki veri kümesi (masa↔sandalye) arasındaki ilişkiyi GENEL bir kuralla ifade etmek. Dikkat: ilişki çoğu zaman saf orantı değildir; \"2 katından 2 fazla\" (y = 2x + 2) gibi sabit içerir — çocuğun yalnız \"×2\" deyip sabiti atlaması sık bir yanılgıdır. Tabloyu satır satır okuyup \"her yeni masada sandalye kaç artıyor (+2), ama başta neden 2 fazla var?\" diye HEM değişen oranı HEM sabiti buldurun. Sonra \"kural her masa sayısı için işler mi, peki 0 masa?\" diye genellenebilirliği sınatın. Burada erken örüntü (tekrar eden birim), sayısal örüntü ve sembolik ilişki, tam anlamıyla cebirsel akıl yürütmede birleşir.",
    act: {
      materials: ["DokunSay pulları (masa-sandalye modeli için)", "girdi–çıktı tablosu (masa | sandalye)", "eşit gruplar/dizi düzeni"],
      steps: [
        "Tabloyu kurun: 1 masa→4, 2 masa→6, 3 masa→8; \"her yeni masada kaç sandalye ekleniyor?\" (+2).",
        "Sabiti yakalatın: \"o zaman neden ×2 değil de hep 2 fazla? Baştaki 2 nereden?\" diye kuralı (2 katı + 2) tamlatın.",
        "Girdiyi değiştirin: \"5 masada? 10 masada?\" diye kuralı işlettirin; tahminini tabloyla doğrulatın.",
        "Tersine ve sınıra gidin: \"36 sandalye varsa kaç masa? Peki 0 masada kural ne der?\" diye genellenebilirliği konuşun.",
      ],
      criterion: "İki veri kümesi arasındaki işlevsel kuralı (sabit içerenler dâhil, ör. \"2 katının 2 fazlası\") bulup farklı girdilerde uygular ve genellenebilirliğini sorgularsa ✓",
      easy: "Önce saf orantılı tablo (1→4, 2→8, 3→12 = \"×4\") ile başlayın; sonra sabitli tabloya geçin.",
      hard: "Sabitli kuralı bir cümle/sembolle (\"sandalye = masa×2 + 2\") yazdırma, tersini bulma ya da iki farklı kuralı (×3 vs ×2+2) karşılaştırma.",
    },
  },
];

export const SHAPE3D_ENRICH = [
  { // 1 — s3d-01 · "Cisimleri Algılayan: Temeller" (0–2 yaş)
    how: "Bebek bir kutuyu, topu ya da koniyi eline alıp evirip çevirir; topu yuvarlar, kutuyu üst üste koymaya çalışır, koninin sivri ucunu parmağıyla yoklar. Önünde yavaşça döndürülen cismi gözleriyle izler. Henüz \"küp\", \"küre\" diyemez ama her cismin nasıl davrandığını (yuvarlanır mı, durur mu) hareketle ve dokunarak keşfeder.",
    teacher: "Bu, 3B biçim sezgisinin en erken tohumudur: çocuk şekli adlandırmadan, DOKUNARAK ve hareketle tanır; üstelik bu algı durağan görüntülerden çok sürekli hareket hâlindeki nesnelerle desteklenir. Sık bir yetişkin alışkanlığı bu yaşı \"henüz geometri değil\" diye geçiştirmektir — oysa cismi elde çevirme, yüzleri ve köşeleri yoklama, sonraki tüm 3B tanımanın somut zeminidir. Adlandırmaya değil, bol bol elle keşfe ve hareketli sunuma alan açın; siz \"yuvarlanıyor!\", \"köşesi var\" gibi sözlerle deneyimi besleyin.",
    act: {
      materials: ["katı cisim modelleri / DokunSay Geo (top, küp/kutu, koni)", "yuvarlanmayı denemek için hafif eğimli bir yüzey", "üst üste koymak için birkaç özdeş kutu"],
      steps: [
        "Cismi önce yavaşça hareket ettirip döndürün: \"bak, dönüyor!\" — gözüyle izlemesini bekleyin.",
        "Topu birlikte yuvarlayın; sonra kutuyu verip üst üste koymayı, durduğunu keşfedin.",
        "Koniyi verin: sivri ucunu ve yuvarlak tabanını parmağıyla yoklatın.",
        "Cisimleri eğimli yüzeye bırakıp \"hangisi yuvarlandı, hangisi durdu?\" diye gözletin.",
      ],
      criterion: "Hareket ettirilen cismi izler ve eline verilen cismi döndürerek/yuvarlayarak/üst üste koyarak inceliyorsa (sezgisel keşif) ✓",
      easy: "Tek seferde tek bir cisim verin; siz hareketi (yuvarlama) modelleyin, o taklit etsin.",
      hard: "Birkaç cismi karıştırıp \"yuvarlananı bana ver\" gibi davranışa dayalı küçük istekler verin.",
    },
  },
  { // 2 — s3d-02 · "Tanıdık Cisimleri Tanıyan (Top, Kutu)" (3–4 yaş)
    how: "Bir küp ile top yan yana dururken \"Topu göster\" dediğinizde doğru olanı seçer; küreye \"top\", küpe \"kutu\" der. Koniyi anlatırken \"ucu sivri\" gibi günlük niteliklerle betimler. Tipik, okul-kitabı görünümlü örnekleri tanır ama alışılmadık örneklerde (yamuk bir kutu, küçük bir misket) duraksayabilir.",
    teacher: "Bu düzeyde tanıma PROTOTİPe dayanır: çocuk en tipik örneği (kusursuz top, düzgün küp) bir bütün olarak, görünüşünden tanır — henüz yüz/köşe saymaz. Günlük adlar (top, kutu) bu düzeyde DOĞRU sayılır; yanına matematiksel adı (küre, küp) ekleyin ama dayatmayın. Sık bir kısıt, hep aynı ideal modeli göstermektir; o zaman çocuk yalnız o tek görüntüyü ezberler. Aynı şekli farklı boy, renk ve duruşlarda gösterin (büyük top–misket, tahta küp–zar) ki tanıma görünüşe değil gerçek biçime bağlansın. Cisimleri \"sivri\", \"yuvarlanıyor\" gibi günlük niteliklerle betimletin.",
    act: {
      materials: ["geometrik cisimler seti / DokunSay Geo (küre, küp, koni, silindir)", "aynı şekillerin farklı boy/renk örnekleri", "kapatma kartı/örtü"],
      steps: [
        "Cisimleri tek tek gösterip \"Buna ne denir?\" deyin; günlük adları (top, kutu) kabul edip matematiksel adı yanına ekleyin.",
        "\"Topu göster\", \"Kutuyu göster\" diye seçtirip doğru seçimi adlandırın: \"evet, top — her yeri yuvarlak\".",
        "Aynı şekilleri farklı örneklerle (misket–büyük top; zar–tahta küp) yineleyin.",
        "Bir cisim için \"bu nasıl bir şekil?\" diye günlük nitelikle betimletin (\"sivri\", \"yuvarlanıyor\").",
      ],
      criterion: "Tipik küre ve küpü günlük ya da matematiksel adıyla doğru tanır ve en az bir cismi günlük bir nitelikle betimlerse ✓",
      easy: "Yalnız iki şekille ve hep aynı tipik örneklerle çalışın; aralarını açın.",
      hard: "Üçüncü bir cisim (koni) ekleyin ya da alışılmadık örnekler (yamuk kutu, oval top) gösterin.",
    },
  },
  { // 3 — s3d-03 · "3B Cisimleri Tanıyan" (5–6 yaş)
    how: "Silindir, koni ve küpü gösterip \"Bunun adı ne?\" dediğinizde en az birini matematiksel adıyla söyler (\"silindir\"). Üstelik küpün bir yüzünü parmağıyla gösterip \"bu kare\" der — yani cismin YÜZÜNÜ 2B bir şekil olarak fark eder. Birden çok cismi günlük ya da matematiksel adla doğru ayırt eder.",
    teacher: "Burada iki ilerleme birleşir: tanınan cisim sayısı artar (küre/küpün ötesine silindir, koni, prizma) VE çocuk bir cismin yüzlerini 2B şekiller olarak görmeye başlar (küpün yüzü → kare, silindirin tabanı → daire). Bu yüz-fark etme, ileride yüz sayma ve açınım (net) fikrinin tohumudur. Sık ve inatçı yanılgı, 3B cismi 2B yüzüyle KARIŞTIRMAKtır — silindire bütünüyle \"daire\" demek. Cismi mutlaka elde döndürten ve \"silindir bir cisim; yüzlerinden biri daire\" diye düz şekil ile cisim ayrımını her seferinde dile getirin.",
    act: {
      materials: ["geometrik cisimler seti / DokunSay Geo (küre, küp, koni, silindir, prizma)", "yanına eşlik eden 2B şekil kartları (daire, kare, üçgen)", "döndürerek incelemek için düz zemin"],
      steps: [
        "Silindir, koni, küpü sırayla gösterip adlarını sorun; en az birinde matematiksel adı bekleyin.",
        "Küpün bir yüzünü parmağıyla izletip \"bu yüz hangi şekil?\" deyin (kare); silindirin tabanı için yineleyin.",
        "\"Bu daire mi, silindir mi?\" diye 2B/3B ayrımını açıkça yoklayın; daire kartını yanına koyup \"daire düz, silindir cisim\" deyin.",
        "Karışık koyup \"silindiri bul / koniyi bul\" oyunu yapın.",
      ],
      criterion: "En az bir cismi matematiksel adıyla söyler, birden çok cismi doğru ayırt eder ve bir cismin yüzünü 2B şekil olarak adlandırırsa (küpün yüzü → kare) ✓",
      easy: "Aynı anda iki cisimle çalışın (silindir ↔ küp); yüzlerini birlikte parmakla yoklayın.",
      hard: "Birbirine benzeyenleri ayırttırın (silindir ↔ koni) ya da yalnız sözle, modeli göstermeden tanımlatın.",
    },
  },
  { // 4 — s3d-04 · "Cisimlerin Yüzlerini Sayan" (7 yaş) ★ DARBOĞAZ
    how: "Eline verilen dikdörtgenler prizmasını evirip çevirip \"altı yüzü var, hepsi dikdörtgen\" der; küpün de altı yüzünü doğru sayar. Cismin TÜM yüzlerini, görünmeyenler dahil, atlamadan ve yinelemeden sayar. Henüz oturmamışsa aynı yüzü iki kez sayar, arkadaki yüzleri unutur ya da 5/7 gibi yanlış bir sayı verir.",
    teacher: "Bu, kritik bir darboğazdır; özünde yüz–katı ilişkisi ile birebir-sayma sorunudur: çocuk her yüzü YALNIZ BİR KEZ saymalı, görünmeyenleri de hesaba katmalıdır. En sık yanılgı yüzleri tekrar saymak ya da arka yüzleri atlamaktır — çünkü cisim sabit dururken hangi yüzün sayıldığı görünmez. Çözüm, cismi sistemli çevirmek ve sayılan yüzü işaretlemektir: bir yüze etiket/nokta yapıştırın, cismi döndürerek \"üst–alt, ön–arka, sağ–sol\" diye eşli sayın. Ayrıca her yüzün 2B şeklini adlandırtın (dikdörtgen/kare). Hıza değil, her yüzü bir kez saymanın disiplinine odaklanın.",
    act: {
      materials: ["geometrik cisimler / DokunSay Geo (dikdörtgenler prizması, küp, üçgen prizma)", "sayılan yüzü işaretlemek için etiket/çıkartma ya da silinebilir kalem", "döndürerek saymak için düz zemin"],
      steps: [
        "Dikdörtgenler prizmasını verin: \"Kaç yüzü var? Her dokunduğun yüzü bir kez say, her yüz hangi şekil?\"",
        "Sayarken her yüze bir etiket yapıştırsın (sayılanı işaretlesin).",
        "Cismi sistemli çevirin: \"üst, alt — ön, arka — sağ, sol\", böylece görünmeyen yüzler de sayılsın.",
        "Etiketleri sayıp doğrulayın (\"altı yüz, hepsi dikdörtgen\"); sonra küple yineleyin.",
      ],
      criterion: "Bir katının yüzlerini (görünmeyenler dahil) tek tek, yinelemeden sayıp doğru sayıyı (prizma/küp için 6) söyler ve yüz şekillerini 2B adıyla belirtirse ✓",
      easy: "Önce yalnız üst ve alt yüzü, sonra yan yüzleri ayrı ayrı saydırın; siz cismi çevirip yönlendirin.",
      hard: "İşaretsiz (etiketsiz) saydırın ya da yüz sayısı farklı cisimleri (üçgen prizma = 5, küp = 6) karşılaştırtın.",
    },
  },
  { // 5 — s3d-05 · "Parçalardan 3B Şekil Kuran" (7–8 yaş)  [YENİ — eski yapıda yok; Clements & Sarama 3B kompozisyon]
    how: "Geçmeli kare yüzlerden küp kurarken, başlamadan önce \"altı tane gerekir\" der ve parçaları ayrıtlarda tam buluşturarak kapalı, eksiksiz bir küp tamamlar. Yüzlerin dik açılarda birleşmesi gerektiğini bilir; bir yüz eksik ya da yamuk kalırsa fark edip düzeltir.",
    teacher: "Bu düzey, cismi TANIMAKTAN onu PARÇALARINDAN KURMAYA geçiştir — geometride bileşim (composition) düşüncesinin 3B'deki karşılığı. Çocuk artık cismi bir bütün-görüntü olarak değil, belli sayıda yüzün belli ilişkilerle (dik açı, ayrıt boyunca buluşma) birleşmesi olarak kavrar. Asıl kazanım iki yönlüdür: (1) gereken parça sayısını ÖNCEDEN kestirmek (küp = 6 kare yüz) — bu, yüz sayma bilgisinin kurmaya aktarılmasıdır; (2) yüzleri ayrıtları tam çakışacak ve dik açılar korunacak biçimde birleştirmek. Sık güçlük, yüzleri gelişigüzel ekleyip sayıyı/kapanışı denetlememektir. Önce bir model küp gösterip \"kaç yüz, nasıl birleşmiş?\" diye inceletin; sonra modelsiz kurdurup parça sayısını ve kapanışı çocuğa doğrulattırın. Açınımı (yüzlerin düz açılımını) katlatmak bu beceriyi güçlendirir ve bir sonraki düzeydeki açınım-okumaya köprü kurar.",
    act: {
      materials: ["geçmeli yüz parçaları (Polydron benzeri) ya da karton kareler + bant / DokunSay Geo yüzleri", "örnek küp (model)", "ayrıca dikdörtgen yüzler (prizma kurmak için)"],
      steps: [
        "Önce model küpü inceletin: \"kaç yüzü var, yüzler birbirine nasıl bağlanmış (köşelerde dik mi)?\"",
        "Parçaları verip \"bir küp yap — sence kaç parça gerekir?\" diye ÖNCE sayı kestirin (6).",
        "Kurarken her yüzü ayrıt boyunca tam birleştirsin; dik açıları ve kapalı (boşluksuz) sonucu birlikte denetleyin.",
        "Bir küpün açınımını (haç biçimi 6 kare) gösterip katlattırın; sonra dikdörtgen yüzlerle bir prizma kurdurup farkı konuşun.",
      ],
      criterion: "Gereken yüz sayısını önceden söyler (ya da doğru sayıda ayırır), yüzleri ayrıtlarda dik açılarla tam buluşturur ve kapalı, eksiksiz bir 3B şekil (küp) kurarsa ✓",
      easy: "Daha az parçalı bir cisimle (üçgen prizma / açık kutu) başlayın; ilk birkaç yüzü siz yerleştirip \"şimdi kapatmak için kaç tane daha?\" diye sordurun; model küp önde kalsın.",
      hard: "Modeli kaldırıp bellekten kurdurun; \"bu parçalarla başka hangi cisim olur?\" ya da küp açınımının yanına geçerli olmayan bir açılım koyup \"bu katlanınca küp olur mu?\" diye sınatın.",
    },
  },
  { // 6 — s3d-06 · "Cisimleri Adlandırıp Tanımlayan" (8 yaş)
    how: "Bir katı verip \"Bu hangi cisim, kaç yüzü, kaç köşesi var?\" dediğinizde çoğunu adlandırır ve birden çok özelliğini sayar: \"Küp — altı yüzü, sekiz köşesi var.\" Üstelik bir açınım kartına bakıp \"bu katlanınca küp olur; altı kare yüzü var\" diyerek açınımın hangi cismi oluşturacağını belirler.",
    teacher: "Burada tanıma görünüşten ÖZELLİĞE geçer: çocuk yüz, ayrıt (kenar) ve köşe (tepe) sayısını ölçüt olarak kullanır — geometride biçimsel akıl yürütmenin (Van Hiele) başlangıcı. Bir önceki düzeyde parçalardan kurma deneyimi, açınım okumayı doğrudan besler: çocuk \"bu düz açılım katlanınca hangi kapalı cisim olur?\" sorusunu yanıtlayabilir. Sık bir kısıt yalnız yüze bakıp ayrıt/köşeyi atlamaktır; oysa bu üç özellik birlikte cismi tanımlar. \"Yüz–ayrıt–köşe\" üçlüsünü her cisimde sistemli saydırın (yüz: düz yüzey; ayrıt: iki yüzün çizgisi; köşe: ayrıtların buluştuğu sivri nokta) ve açınımla cisim arasında gidip gelin.",
    act: {
      materials: ["geometrik cisimler / DokunSay Geo (küp, prizma, piramit, silindir)", "yüz–ayrıt–köşe sayımını yazmak için küçük tablo", "küp ve prizma açınımı çizili kartlar"],
      steps: [
        "Bir cisim verip \"adı ne? Önce yüzleri, sonra ayrıtları, sonra köşeleri say\" deyin; her özelliği parmağıyla yoklatın.",
        "Sayıları küçük tabloya yazsın (yüz / ayrıt / köşe); \"bu özelliklerle bu hangi cisim?\" diye doğrulatın.",
        "Açınım kartını gösterip \"bu şekil katlanınca hangi cisim olur?\" diye sorun (küp).",
        "Farklı cisimlerle yineleyip \"hangi açınım hangi cisme gider?\" diye eşleştirin.",
      ],
      criterion: "Cisimlerin çoğunu adlandırır, bir cismin birden çok özelliğini doğru söyler (ör. küp: 6 yüz, 8 köşe) ve bir açınımın hangi cismi oluşturacağını belirlerse ✓",
      easy: "Yalnız yüz ve köşeyle başlayın (ayrıtı sonra ekleyin); tanıdık cisimle (küp) ve apaçık açınımla çalışın.",
      hard: "İki benzer cismi (kare prizma ↔ küp) yalnız özellik sayılarıyla ayırttırın ya da birkaç açınım arasından küpü oluşturanı seçtirin.",
    },
  },
  { // 7 — s3d-07 · "Cisim Ailelerini Ayırt Eden" (8 yaş)
    how: "Önüne karışık katılar koyup \"Bütün yüzleri kare olan hangisi?\" dediğinizde \"küp\" der; \"hiç düz yüzü olmayan hangisi?\" → \"küre\". \"Prizma olanları bir kenara ayır, neden prizma?\" dediğinizde \"iki ucu aynı, yanları dikdörtgen\" diye ÖZELLİĞE dayanarak bir SINIF tanımlar — tek cismi değil, aileyi ayırt eder.",
    teacher: "Bu en üst düzeydir: çocuk artık tek tek cisimleri değil, ortak özelliği paylaşan SINIFLARI (prizmalar, piramitler, eğri/düz yüzlü cisimler) prototip görünüme değil, ÖZELLİĞE dayanarak belirler. Bu, sınıflandırma ve hiyerarşi düşüncesinin temelidir (\"küp özel bir kare prizmadır\", \"küp aynı zamanda prizma mıdır?\"). Sınıflama ölçütünü çocuğun kendisinin bulması ve gerekçelendirmesi değerlidir — \"neye göre ayırdın?\" diye söyletin. Aynı cisimleri farklı ölçütlere göre (eğri/düz yüzlü; taban biçimine göre; prizma/piramit) yeniden gruplatın ki sınıflamanın tek doğrusu olmadığını ve sınıfların iç içe geçebileceğini kavrasın.",
    act: {
      materials: ["geometrik cisimler / DokunSay Geo (küp, kare/üçgen prizma, piramit, silindir, koni, küre)", "grupları ayırmak için tabaklar/halkalar", "ölçütü yazmak için etiket kartları"],
      steps: [
        "Özellik tanımıyla cisim buldurun: \"bütün yüzleri kare olan?\" (küp), \"hiç düz yüzü olmayan?\" (küre).",
        "\"Prizma olanları bir kenara ayır, neden prizma?\" diye ölçütü söyletin (iki özdeş paralel yüz + dikdörtgen yanlar).",
        "Bir sınıfı adlandırın ve gerekçelendirin; sonra \"şimdi yuvarlananları ayır\" diyerek farklı ölçütle yeniden gruplatın.",
        "Hiyerarşiyi yoklayın: \"Küp aynı zamanda bir prizma mı? Neden?\"",
      ],
      criterion: "Cisimleri prototip görünüme değil özelliklerine göre (prizmalar, piramitler, eğri yüzlüler vb.) doğru sınıflara ayırır ve ölçütünü/gerekçesini söylerse ✓",
      easy: "İki belirgin gruba ayırttırın (eğri yüzlü/yuvarlanan ↔ düz yüzlü/köşeli); az sayıda cisimle çalışın.",
      hard: "Çok ölçütlü sınıflama (\"prizma VE üçgen tabanlı\") ya da \"küp hem küp hem prizma olabilir mi?\" gibi sınıf-içi-sınıf (hiyerarşi) sorusu sorun.",
    },
  },
];
