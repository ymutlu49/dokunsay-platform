// ════════════════════════════════════════════════════════════════════════
// ÖĞRENME YÖRÜNGELERİ — Clements & Sarama [LT]² (learningtrajectories.org)
// Düzey adları Clements & Sarama (2021/2023 learningtrajectories.org) çerçevesinden uyarlanmıştır.
// Yaş bantları (ay) olasılıksal alt-sınır niteliğinde İLLÜSTRATİFTİR (tanı eşiği DEĞİL);
// deneyim ve öğretime göre geniş değişir, norm çalışmasından kalibre edilir.
//
// Ağırlık katmanları:
//   çekirdek    → tam etkileşimli değerlendirme (sayı çekirdeği)
//   tamamlayıcı → gözlem + çalışma kâğıdı (sayı üstyapısı)
//   profil      → gözlem (geometri, ölçme, sınıflama — profil tamamlayıcı)
//
// Her düzey: { n: ad, lo/hi: yaş bandı (ay), b: darboğaz?, q: uyaran çokluğu,
//             d: betim, iv: eşlenmiş müdahaleler [{k: uygulama, a: etkinlik}] }
// ════════════════════════════════════════════════════════════════════════
// NOT: CORE/EXT ad+betimleri NuMap KANONİĞİNE hizalı (gen-align.mjs). Uygulamaya-özel
// alanlar (lo/hi/b/q/iv, glyphType, start/end) korunur. pattern/shape3d hizalanmadı (düzey sayısı).

// ── ÇEKİRDEK ALANLAR (tam, etkileşimli) ──────────────────────────────────
export const CORE = [
  { key: 'sub', name: 'Saymadan Anlık Bilme (Sanbil)', ltName: 'Subitizing', gloss: 'saymadan anlık bilme', weight: 'çekirdek', itemType: 'sub', ctx: 'bir bakışta miktar', manip: 'nokta kartları, DokunSay çubukları', levels: [{ n: 'Sayı Duyarlılığı: Temeller', lo: 0, hi: 12, b: 0, q: 1, d: 'Doğuştan gelen, açık bilgi içermeyen sayı duyarlılığı: 1 ile 2 nesnelik grupları (bazen 2 ile 3’ü) sezgisel olarak ayırt eder; büyük gruplar arasında oran farkı belirginse (yaklaşık sayı sistemi) duyarlılık gösterir.' }, { n: 'Çok Küçük Sayıları Tanıyan', lo: 12, hi: 24, b: 0, q: 2, d: 'Küçük miktarları sayı sözcükleriyle eşleştirmeye başlar ("bir", "iki"); kardinal değere ilişkin ilk açık fikir oluşur. "Daha çok / daha az" sözcükleri bunu izler.' }, { n: 'Küçük Grupların Aynısını Oluşturan', lo: 24, hi: 30, b: 0, q: 2, d: 'Model bir koleksiyonla aynı sayıda (genellikle 1–2, bazen 3) nesneden oluşan bir grup oluşturur; bunu zihinsel modelle yapar (birebir eşleme zorunlu değildir), çoğu kez sözel olmayan biçimde.' }, { n: 'Küçük Grupları Adlandıran', lo: 30, hi: 42, b: 0, q: 3, d: 'Model ya da eşleme stratejisi gerekmeden 1, 2 ve 3 nesnelik grupları artan doğrulukla adlandırır (çoğu çocukta ~34–39 ay); 4’lük gruplar yaklaşık 6 ay sonra eklenir.' }, { n: 'Algısal Sanbil (4’e kadar)', lo: 36, hi: 48, b: 1, q: 4, d: 'Kısa süre gösterilen 4’e kadar nesneli grupları anında tanır ve sayıyı sözel olarak adlandırır — saymaya gerek duymadan.', iv: [{ k: 'DokunSay', a: 'Dokunsal 3–4 çubuk anlık tanıma' }, { k: 'GalakSay', a: "Hızlı nokta tanıma (4'e dek)" }, { k: 'ADIM', a: 'Yapılandırılmış algısal Sanbil' }] }, { n: 'Algısal Sanbil (5’e kadar)', lo: 48, hi: 54, b: 0, q: 5, d: 'Kısa süre gösterilen 5’e kadar grupları anında tanıyıp adlandırır; tanıdık düzenlerin ötesinde uzamsal/sayısal yapıları kullanmaya başlar.' }, { n: 'Kavramsal Sanbil (5’e kadar)', lo: 54, hi: 60, b: 0, q: 5, d: '5’e kadar TÜM düzenlemeleri, kısa gösterimde parçaları görüp bütünü hızla bilerek adlandırır ("3 ile 2 gördüm — beş!").' }, { n: 'Kavramsal Sanbil (7’ye kadar)', lo: 60, hi: 66, b: 0, q: 7, d: 'Kısa süre gösterilen 6, sonra 7 nesnelik tüm düzenlemeleri parçalardan bütüne giderek adlandırır.' }, { n: 'Kavramsal Sanbil (10’a kadar)', lo: 66, hi: 72, b: 0, q: 10, d: '2–10 arası sayıların kısa gösterilen çoğu düzenlemesini adlandırır (örn. 7 ile 2’yi 9 olarak görür); onluk çerçeve gibi yapıları kullanır.' }, { n: 'Kavramsal Sanbil (20’ye kadar)', lo: 72, hi: 84, b: 0, q: 10, d: 'Kısa gösterilen, yapılandırılmış 10–20 arası düzenlemeleri parçadan bütüne stratejiyle adlandırır (örn. 7 ile 9’u 16 olarak görür).' }, { n: 'Basamak Değeriyle Sanbil', lo: 84, hi: 96, b: 0, q: 10, d: 'Kısa gösterilen yapılandırılmış düzenlemeleri grupları, ritmik saymayı ve basamak değerini kullanarak adlandırır ("üç onluk ve dört — otuz dört").' }, { n: 'Çarpımsal Düşünmeyle Sanbil', lo: 96, hi: 108, b: 0, q: 10, d: 'Kısa gösterilen yapılandırılmış düzenlemeleri grupları, çarpımsal düşünmeyi ve onluk tabanı kullanarak adlandırır; kaç onluk gördüğünü sözel olarak ifade eder.' }] },
  { key: 'count', name: 'Sayma', ltName: 'Counting', gloss: '', weight: 'çekirdek', itemType: 'count', ctx: 'nesneleri sayma', manip: 'sayma pulları, DokunSay çubukları', levels: [{ n: 'Sayı Sözcükleriyle Tanışan: Temeller', lo: 0, hi: 12, b: 0, q: 3, d: 'Henüz sözel sayma yoktur; bazı sayı sözcüklerini sırasız söyleyebilir.' }, { n: 'Ezbere Sayan', lo: 24, hi: 36, b: 0, q: 5, d: 'Sayı sözcüklerini ayrı ayrı, ezbere söyler; "beş"in üzerinde sıra her zaman doğru değildir ("bir, iki, üç, dört, beş, yedi"). Nesne sayarken fazladan sözcük söyleyebilir ya da nesneler sözcüklerden çoksa sözcükleri baştan kullanabilir.' }, { n: 'Ezbere Sayan (10’a kadar)', lo: 36, hi: 42, b: 0, q: 8, d: '10’a kadar sözel sayar; nesnelerle bir miktar eşleşme vardır ama atlama, bir nesneyi iki kez sayma gibi uygulama hataları görülür.' }, { n: 'Birebir Eşleyerek Sayan', lo: 36, hi: 48, b: 1, q: 5, d: 'En azından tek sıraya dizilmiş küçük gruplar için sayı sözcükleriyle nesneler arasında birebir eşleme kurar; ancak "kaç tane?" sorusuna yeniden sayarak ya da rastgele bir sayıyla yanıt verebilir (kardinal değer henüz oturmamıştır).', iv: [{ k: 'DokunSay', a: 'Dokun-say senkronizasyonu' }, { k: 'ADIM', a: 'Birebir eşleme etkinliği' }] }, { n: 'Küçük Sayıları Sayan (Kardinal Değer)', lo: 48, hi: 54, b: 1, q: 5, d: 'Tek sıradaki 5’e kadar nesneyi doğru sayar ve "Kaç tane?" sorusuna en son söylediği sayıyla yanıt verir — kardinal değer ilkesi kazanılmıştır.', iv: [{ k: 'ADIM', a: 'Kardinalite etkinliği' }, { k: 'GalakSay', a: 'Say ve topla' }] }, { n: '10’a Kadar Sayan', lo: 54, hi: 60, b: 0, q: 8, d: '10’a kadar düzenlenmiş nesne gruplarını sayar; 1–10 arası rakamları okumaya/yazmaya başlayabilir. Bir sayının hemen öncesini/sonrasını ancak 1’den itibaren sayarak bulur; 20’ye kadar sözel sayma gelişmektedir.' }, { n: 'İstenen Sayıda Nesne Veren (Küçük Sayılar)', lo: 54, hi: 60, b: 0, q: 6, d: 'İstendiğinde 5’e kadar nesneyi sayarak ayırıp verir ("bana 4 blok ver"); belirli sayıda nesne yerleştirilmesi gerektiğinde saymanın işe yaradığını bilir.' }, { n: 'Sayıp Veren (10 ve ötesi)', lo: 60, hi: 66, b: 0, q: 10, d: '10’a, sonra ~30’a kadar sayar ve istenen sayıda nesne verir; kardinal değeri açıkça kullanır; farklı dizilimlerde sayılanla sayılmayanın izini tutar; 1–10’u (sonra 20–30’u) yazarak/çizerek temsil etmeye başlar; sayma hatalarını fark eder.' }, { n: '10’dan Geriye Sayan', lo: 66, hi: 72, b: 1, q: 8, d: '10’dan 1’e geriye doğru sayar — sözel olarak ya da nesneleri tek tek eksilterek.', iv: [{ k: 'GalakSay', a: 'Geri sayım' }, { k: 'ADIM', a: 'Geriye sayma' }] }, { n: 'İstenen Sayıdan Sayan (öncesi/sonrası)', lo: 72, hi: 78, b: 0, q: 7, d: '1 yerine herhangi bir sayıdan başlayarak (sözel ya da nesneyle) sayar; bir sayının hemen sonrasını ve hemen öncesini saymadan, ANINDA söyler.' }, { n: 'Onar Ritmik Sayan (100’e kadar)', lo: 78, hi: 84, b: 0, q: 10, d: 'Anlayarak onar onar 100’e (ve ötesine) sayar; bir miktarın içindeki 10’luk grupları "görür".' }, { n: '100’e Kadar Sayan', lo: 78, hi: 90, b: 0, q: 10, d: 'Herhangi bir sayıdan başlayarak 100’e kadar sayar; onluk geçişlerini (29→30) doğru yapar.' }, { n: 'Ritim Tutarak Üzerine Sayan', lo: 84, hi: 96, b: 0, q: 10, d: 'Ritmik/işitsel/uzamsal örüntüler kullanarak sayma eylemlerinin izini tutar — bir sayının üzerine ~3’e kadar ekleme yapabilir ("sekiz... dokuz-on-on bir").' }, { n: 'Ritmik Sayan (Beşer/İkişer)', lo: 90, hi: 102, b: 0, q: 10, d: 'Anlayarak beşer ve ikişer sayar.' }, { n: 'Saydığını Takip Ederek Sayan', lo: 96, hi: 108, b: 0, q: 10, d: 'Verilen bir sayıdan ileri ya da geri sayarken sayma eylemlerinin SAYISAL izini tutar — önce nesnelerle, sonra "sayımları sayarak" (parmak/zihinsel).' }, { n: 'Basamak Değerini Kavrayan', lo: 102, hi: 114, b: 0, q: 10, d: 'Onluk taban yazımını ve basamak değerini anlar (yüzlükler, onluklar, birlikler); gerektiğinde onlukları birliklere bozar; alışılmadık birimleri sayar.' }, { n: '100’ün Ötesine Sayan', lo: 108, hi: 120, b: 0, q: 10, d: '100’ün ötesine, birlik/onluk/yüzlük örüntülerini tanıyarak doğru sayar.' }, { n: 'Sayının Korunduğunu Bilen', lo: 108, hi: 120, b: 0, q: 8, d: 'Algısal çeldiricilere (nesnelerin aralıklarının açılması gibi) karşın sayının korunduğunu tutarlı biçimde bilir.' }, { n: 'İleri-Geri Akıcı Sayan', lo: 114, hi: 126, b: 0, q: 10, d: 'Sayı dizisini (birer ya da ritmik) her iki yönde akıcı sayar; onluk dizisinin birlik dizisini yansıttığını bilir; çok basamaklı sayıyı hem dizi hem bileşim (basamak) gözüyle görebilir.' }] },
  { key: 'comp', name: 'Karşılaştırma ve Sıralama', ltName: 'Comparing/Ordering', gloss: '', weight: 'çekirdek', itemType: 'comp', ctx: 'çoklukları karşılaştırma', manip: 'sayma pulları, sayı doğrusu', levels: [{ n: 'Karşılaştırma Duyarlılığı: Temeller', lo: 0, hi: 12, b: 0, q: [2, 4], d: 'İlk aylardan itibaren sayı değişimlerine duyarlıdır: küçük gruplarda 1 ile 2’yi, büyük gruplarda ikiye katlanma gibi belirgin farkları sezer (doğuştan eşitlik duyarlılığı).' }, { n: 'Eşleyerek Karşılaştırmaya Başlayan', lo: 18, hi: 30, b: 0, q: [2, 3], d: 'Çok küçük iki koleksiyonun "aynı sayıda" olduğunu sezgisel öğe-öğe eşlemeyle fark eder; nesneleri/sözcükleri/eylemleri birebir ya da çoğa-bir eşleyebilir.' }, { n: 'Bakarak Karşılaştıran', lo: 24, hi: 36, b: 0, q: [2, 5], d: 'Sayıca çok farklı koleksiyonları (biri diğerinin en az iki katı) karşılaştırır; benzer büyüklükteki koleksiyonları ancak çok küçük sayılarda ayırt eder.' }, { n: '"Birinci–İkinci" Diyen', lo: 30, hi: 40, b: 0, q: [1, 2], d: 'Bir dizideki "birinci" ve çoğu zaman "ikinci" nesneyi belirler.' }, { n: 'Aynı Tür Nesneleri Karşılaştıran', lo: 36, hi: 42, b: 0, q: [3, 4], d: '1–4 özdeş nesneli koleksiyonları "yalnızca bakarak" (saymadan anlık bilme — sanbil — yoluyla) sözel ya da sözel olmayan biçimde karşılaştırır.' }, { n: 'Farklı Tür Nesneleri Karşılaştıran', lo: 40, hi: 46, b: 0, q: [3, 5], d: 'FARKLI türden nesnelerden oluşan eş küçük koleksiyonları eşleyerek aynı sayıda olduklarını gösterir.' }, { n: 'Eşleyerek Karşılaştıran', lo: 42, hi: 48, b: 0, q: [4, 5], d: '1–6 nesnelik grupları birebir eşleyerek karşılaştırır; artakalandan hangisinin çok olduğunu çıkarır.' }, { n: 'Sayarak Karşılaştıran (Eş Boy Nesneler)', lo: 48, hi: 52, b: 0, q: [4, 6], d: 'Nesneler yaklaşık eş boyda ve gruplar küçükken (≤5) sayarak doğru karşılaştırır; büyük koleksiyonun nesneleri küçükse yanılabilir.' }, { n: 'Kapladığı Yere Bakıp Tahmin Eden (Az/Çok)', lo: 48, hi: 54, b: 0, q: [3, 7], d: 'Fark belirginken azı/çoğu tahmin eder; az yer kaplayan kümelere "küçük bir sayı" (1–4), çok yer kaplayanlara "büyük bir sayı" (10–20+) atfeder.' }, { n: 'Sayarak Karşılaştıran (5’e kadar)', lo: 48, hi: 54, b: 0, q: [3, 5], d: 'Büyük koleksiyonun nesneleri DAHA KÜÇÜK olsa bile, 5’e kadar sayarak doğru karşılaştırır (algısal çeldiriciye aldanmaz).' }, { n: 'Zihinsel Sayı Doğrusu (5’e kadar)', lo: 54, hi: 60, b: 1, q: [2, 5], d: 'Algısal destek varken sayılar arası ilişkileri kullanarak göreli büyüklük ve konum belirler ("4, 2’den büyük ve 5’e yakın").', iv: [{ k: 'DokunSay', a: 'Dokunsal sayı doğrusu' }, { k: 'GalakSay', a: 'Sayı doğrusu görevi' }, { k: 'ADIM', a: 'Zihinsel sayı doğrusu' }] }, { n: 'Büyüklük Sırasına Dizen (5’e kadar)', lo: 54, hi: 60, b: 0, q: [2, 4], d: 'Miktarları (nokta kartları) ya da rakamları 5’e kadar sıraya dizer; birimli uzunlukları sıralar.' }, { n: 'Sıra Sayılarını Kullanan (1.–10.)', lo: 58, hi: 66, b: 0, q: [3, 5], d: '"Birinci"den "onuncu"ya kadar sıra sayılarını belirler ve kullanır.' }, { n: 'Sayarak Karşılaştıran (10’a kadar)', lo: 60, hi: 66, b: 0, q: [6, 8], d: 'Büyük koleksiyonun nesneleri daha küçük olsa bile 10’a kadar sayarak doğru karşılaştırır; "kaç fazla/eksik" sorusunu çözmeye başlar.' }, { n: 'Zihinsel Sayı Doğrusu (10’a kadar)', lo: 66, hi: 72, b: 1, q: [4, 9], d: 'İç temsiller ve sayı ilişkisi bilgisiyle 10’a kadar göreli büyüklük/konum belirler ("Hangisi 6’ya daha yakın: 4 mü 9 mu?").', iv: [{ k: 'DokunSay', a: '0–10 dokunsal sayı doğrusu' }, { k: 'ADIM', a: 'Yerleştirme etkinliği' }] }, { n: 'Büyüklük Sırasına Dizen (6 ve ötesi)', lo: 66, hi: 74, b: 0, q: [5, 8], d: 'Miktarları/rakamları 6 ve ötesine sıralar; 1–6 birimli uzunlukları dizer.' }, { n: 'Kapladığı Yere Bakıp Tahmin Eden', lo: 72, hi: 80, b: 0, q: [10, 25], d: 'Tahmin kategorilerini genişletir: "küçük" (saymadan bilinebilir), "orta" (10–20) ve "büyük" sayılar; dizilim güçlüğü etkiler.' }, { n: 'Basamak Değeriyle Karşılaştıran', lo: 72, hi: 84, b: 0, q: [40, 70], d: 'Sayıları basamak değeri anlayışıyla karşılaştırır ("63, 59’dan büyüktür; çünkü 6 onluk 5 onluktan fazladır").' }, { n: 'Zihinsel Sayı Doğrusu (100’e kadar)', lo: 84, hi: 96, b: 0, q: [30, 80], d: 'Sayı ilişkileri ve zihinsel imgelerle (onlukların içine yerleşmiş birlikler) 100’e kadar göreli büyüklük/konum belirler.' }, { n: 'Göz Atarak Çokluk Tahmin Eden', lo: 90, hi: 100, b: 0, q: [50, 90], d: 'Bir grubu gözle tarar ve sonucu zihinsel sayı doğrusuyla ilişkilendirerek işe yarar çokluk tahminleri üretir.' }, { n: 'Zihinsel Sayı Doğrusu (1000’e kadar)', lo: 96, hi: 108, b: 0, q: [300, 800], d: 'Basamak değeri dâhil sayı ilişkileri ve iç imgelerle 1000’e kadar göreli büyüklük/konum belirler.' }, { n: 'Bir Bölümünü Sayıp Tahmin Eden', lo: 102, hi: 114, b: 0, q: [250, 600], d: 'Tahmin edilecek koleksiyonun bir bölümünü sayar ve bunu dayanak (referans) olarak kullanır — sezgisel ya da tekrarlı toplama/çarpma yoluyla.' }, { n: 'Öbeklere Ayırıp Tahmin Eden', lo: 108, hi: 120, b: 0, q: [120, 340], d: 'Tahmin edilecek kümeyi uygun alt kümelere ayırır, alt küme değerlerini birleştirerek çokluğu kurar (tekrarlı toplama → çarpma; düzenli → düzensiz dizilimler).' }] },
  { key: 'add', name: 'Toplama ve Çıkarma', ltName: 'Adding/Subtracting', gloss: '', weight: 'çekirdek', itemType: 'add', ctx: 'birleştirme/ayırma', manip: 'sayma pulları, DokunSay çubukları', levels: [{ n: 'Aritmetik Duyarlılığı: Temeller', lo: 0, hi: 12, b: 0, q: [1, 1], d: 'Algısal grupların birleştirilmesine/ayrılmasına duyarlıdır; çok küçük koleksiyonların bir artıp eksilmesinin etkisini fark eder.' }, { n: 'Sözsüz Toplayıp Çıkaran', lo: 12, hi: 24, b: 0, q: [1, 2], d: 'Toplamı 3’ü geçmeyen çok küçük koleksiyonlarla ekleme-eksiltme yapar; yanıtı çoğu kez sözel değil, bir koleksiyon OLUŞTURARAK gösterir.' }, { n: 'Küçük Sayılarla Toplayıp Çıkaran', lo: 36, hi: 42, b: 0, q: [2, 2], d: 'Toplamı 5’i geçmeyen, sonucu bilinmeyen birleştirme ve ayırma problemlerini nesnelerle "tümünü sayarak" çözer.' }, { n: 'Sonucu Bulan', lo: 42, hi: 54, b: 1, q: [2, 3], d: 'Sonucu bilinmeyen birleştirme ("3 elman vardı, 3 elma daha aldın...") ve parça-parça-bütün ("6 kız, 5 erkek; toplam kaç kişi?") problemlerini nesnelerle doğrudan modelleyip tümünü sayarak; ayırma problemlerini nesneleri eksilterek çözer.', iv: [{ k: 'DokunSay', a: 'Birleştir-ayır' }, { k: 'GalakSay', a: 'Topla-çıkar' }, { k: 'ADIM', a: 'Sonucu bulma' }] }, { n: 'İstenen Sayıya Tamamlayan', lo: 54, hi: 60, b: 0, q: [3, 4], d: 'Bir sayıyı başka bir sayıya dönüştürmek için 1’den saymadan nesne EKLER ("4’ü 6 yap"); kaç eklediğini söylemesi gerekmez.' }, { n: 'Eksik Olanı Bulan', lo: 60, hi: 66, b: 0, q: [4, 3], d: 'Eksik toplananı (5 + _ = 7) nesne ekleyerek, eksik eksileni (9 − _ = 3) nesne ayırarak bulur; basit durumlarda eşleştirerek karşılaştırır.' }, { n: 'Sayma Stratejileriyle Çözen', lo: 66, hi: 72, b: 1, q: [5, 4], d: 'Birleştirme ve parça-parça-bütün problemlerini parmak örüntüleri ve/veya ÜZERİNE SAYMA ile çözer ("4’ün üzerine: 5, 6, 7"); eksik toplanan için "kadar sayma" stratejisini kullanır.', iv: [{ k: 'ADIM', a: 'Sayma stratejileri' }, { k: 'GalakSay', a: 'Hız görevleri' }] }, { n: 'Parça-Bütün İlişkisi Kuran', lo: 72, hi: 84, b: 0, q: [6, 5], d: 'Başlangıç düzeyinde parça-bütün anlayışı: önceki tüm problem türlerini esnek stratejilerle çözer; bazı kombinasyonları ezbere bilir (5+5=10); başlangıcı bilinmeyen problemleri henüz deneme-yanılmayla çözer.' }, { n: 'Parçayı ve Bütünü Birlikte Düşünen', lo: 84, hi: 90, b: 0, q: [7, 8], d: 'Parçayı ve bütünü AYNI ANDA zihninde tutar; başlangıcı bilinmeyen problemleri (_ + 4 = 9) sayma stratejileriyle çözer.' }, { n: 'Bildiklerinden Türeten', lo: 90, hi: 96, b: 0, q: [9, 6], d: 'Esnek stratejiler ve TÜRETİLMİŞ kombinasyonlar kullanır ("7+7=14, öyleyse 7+8=15"); 10’a Tamamlayıp Bozma stratejisini uygular; bir toplamın içinde 3 sayıyı düşünebilir; onluk-birlik sayarak basit çok basamaklı işlemler yapar.' }, { n: 'Her Tür Problemi Çözen', lo: 96, hi: 102, b: 0, q: [8, 7], d: 'TÜM problem türlerini esnek stratejiler ve bilinen kombinasyonlarla çözer; çok basamaklıda onlukları ve birlikleri artırarak ilerler.' }, { n: 'Çok Basamaklı Toplayıp Çıkaran', lo: 102, hi: 114, b: 0, q: [24, 18], d: 'Onlukların bileşimini (bozma/birleştirme dâhil) ve önceki tüm stratejileri kullanarak çok basamaklı toplama-çıkarma problemlerini çözer.' }] },
]

// ── EK ALANLAR (gözlem maddesi) — [ad, betim, darboğaz?] ──────────────────
export const EXT = [
  { key: 'compose', name: 'Sayı Birleştirme (Parça-Bütün)', ltName: 'Composing Numbers', weight: 'tamamlayıcı', glyphType: 'compose', start: 24, end: 108, ctx: 'oyuncakları iki kutuya ayırma', manip: 'iki renkli sayma pulları', L: [['Parçalarla Oynayan: Temeller', 'Parçalar ve bütünler üzerinde sezgisel eylemler (nesneleri bir araya toplama); parça ve bütünlerin sözel olmayan tanınması.', 0], ['Parçaları Birleştiren', 'Kümelerin farklı sıralarla birleştirilebildiğini fark eder; bütünü oluşturan parçaları sözel olmayan biçimde temsil eder; sezgisel-algısal parça-bütün ilişkileri kurar.', 0], ['Parça-Bütünü Kabaca Kavrayan', 'Bütünün parçalarından BÜYÜK olduğunu bilir ama nicel olarak doğru belirlemeyebilir; sezgisel değişme özelliği (sonra birleşme) gelişmektedir.', 0], ['Sayı Kuran (önce 4, sonra 5)', '4’e, sonra 5’e kadar sayı kombinasyonlarını bilir; bütün verildiğinde parçaları, parçalar verildiğinde bütünü hızla adlandırır.', 1], ['Sayı Kuran (7’ye kadar)', 'Toplamı 7’ye kadar sayı kombinasyonlarını bilir; parça/bütünü hızla adlandırır; 10’a kadar çiftleri (5+5) bilir.', 0], ['Sayı Kuran (10’a kadar)', 'Toplamı 10’a kadar kombinasyonları bilir; parça/bütünü hızla adlandırır; 20’ye kadar çiftleri (10+10) bilir.', 1], ['Onluk ve Birliklerle Sayı Kuran', 'Tek basamaklı sayıların 10 ile tüm kombinasyonlarını bilir ("10 ve 7 — on yedi"); 10’un katını hızla ikiye katlar (10+10=20).', 0], ['Sayı Kuran (20 ve ötesi)', 'Toplamı 18’e kadar tüm tek basamaklı kombinasyonları bilir (6+6…9+9 çiftleri ve yakın-çiftler dâhil); iki basamaklı sayıları onluklar ve birlikler olarak anlamaya başlar.', 1], ['Bildiklerinden Türeten (parça-bütün)', 'Türetilmiş kombinasyonları ve 10’a Tamamlayıp Bozma stratejisini parça-bütün ilişkileri üzerinden kullanır; onluk-birlik artırarak çok basamaklıya geçer.', 0], ['Her Tür Problemi Çözen (parça-bütün)', 'Tüm problem türlerini esnek stratejiler ve bilinen kombinasyonlarla, parça-bütün anlayışı üzerinden çözer.', 0], ['Çok Basamaklı Çözen (parça-bütün)', 'Onlukların bileşimini ve tüm önceki stratejileri kullanarak çok basamaklı toplama-çıkarma problemlerini parça-bütün gözüyle çözer ("38’i 30 ve 8 olarak böl").', 0]] },
  { key: 'multdiv', name: 'Çarpma ve Bölme', ltName: 'Multiplying/Dividing', weight: 'tamamlayıcı', glyphType: 'array', start: 30, end: 120, ctx: 'şekerleri eşit paylaştırma', manip: 'gruplama tepsileri', L: [['Eşitliği Gözetmeden Paylaştıran: Temeller', 'Herkese BİR ŞEYLER verir; ancak verilenlerin eşit sayıda olması gerekmez.', 0], ['Teker Teker Dağıtmaya Başlayan', 'Küçük gruplar (5’ten az) oluşturur; "birer birer dağıtarak" paylaştırır ama genellikle yalnız 2 kişi arasında; sonucun sayısal anlamını kavramayabilir.', 0], ['Eşit Dağıtan ve Küçük Gruplar Kuran', 'Küçük EŞİT gruplar (6’dan az) oluşturur; 2’den çok alıcıya birer birer eşit dağıtır; ancak sonuçta eşit miktarlar oluştuğunu kavramayabilir.', 0], ['Somut Modelleyen (×/÷)', 'Küçük sayılı çarpma problemlerini her grubu kurup TÜMÜNÜ sayarak çözer; paylaşım/bölme problemlerini somut, informal stratejilerle (≤20 nesne, 2–5 kişi) çözer; grupların eşitliğinin sonucu nasıl etkilediğini henüz kavramayabilir.', 1], ['Kişi Artarsa Payın Azalacağını Bilen', 'Basit somut durumlarda bölen ile bölüm arasındaki TERS ilişkiyi kavrar: paylaşan kişi sayısı artarsa her birine düşen azalır.', 1], ['Ritmik Sayarak Çözen (×/÷)', 'Çarpma ve ölçme bölmesi ("kaç grup?") için tekrarlı toplama, ikiye katlama ya da ritmik sayma kullanır; paylaştırma bölmesinde deneme-yanılmaya başvurabilir.', 0], ['Bildiklerinden Türeten (×/÷)', 'Stratejileri, örüntüleri, ayrıştırma-birleştirmeyi (12×2 = 10×2+2+2) ve türetilmiş kombinasyonları (×9 = ×10−1; 7×8 = 7×7+7) kullanır; çok basamaklıda onluk ve birliklere ayrı işlem yapar.', 0], ['Satır-Sütun Düzeniyle Çözen (×/÷)', 'Çok türde çarpımsal problemi esnek stratejiler ve bilinen kombinasyonlarla çözer; satır-sütun dizilerini (array) niceler; çok basamaklıda onluk ve birliklere ayrı kombinasyon uygular.', 0], ['Paylaştırarak Bölen', 'Her gruba KAÇ düştüğünü (paylaştırma bölmesi) belirler; başlangıçta böleni bölünene ulaşana dek tekrar tekrar toplayabilir.', 0]] },
  { key: 'frac', name: 'Kesirler', ltName: 'Fractions', weight: 'tamamlayıcı', glyphType: 'fraction', start: 42, end: 132, ctx: 'pizza/çikolata paylaşımı', manip: 'kesir çubukları ve daireleri', L: [['Oranı Sezen: Temeller', 'Oranlara ilişkin sezgisel bir duyarlılık vardır: miktarların göreli büyüklüğünü (az–çok, yarısı–tamamı) açık bilgi olmadan ayırt eder. Henüz kesir bilgisi yoktur; paylaşma oyunlarında "herkese biraz" düzeyinde bölüştürme görülebilir.', 0], ['Şekli Eş Parçalara Bölen', 'Daire ya da dikdörtgen gibi bir bütün şekli eş parçalara böler; paylaşım bağlamında parçaların "aynı büyüklükte" olması gerektiğini gözetmeye başlar.', 1], ['Yarımı Tanıyan', 'En azından sürekli (alan) gösterimlerde, özellikle adil paylaşım bağlamında "yarım"ı tanır. Tek sayıda nesne paylaşılırken yarıma ihtiyaç duyulduğunu fark eder; bütünün parçası olan bölgeleri sezgisel olarak birleştirir.', 0], ['Birim Kesri Tanıyan', 'Basit ayrık (nesne grubu) ve kimi sürekli (alan) gösterimlerde birim kesirleri (1/2, 1/3, 1/4) tanır. Bunların bütünün eş parçalara bölünmesiyle oluştuğunu anlar ve payları adlandırır ("üçte bir").', 1], ['Kesri Tanıyan', 'Paydası küçük basit kesirleri (örn. 2/3, 3/4) tanıdık sürekli (alan) ve ayrık (nesne grubu) bağlamlarda tanır.', 0], ['Birim Kesirlerden Kesir Oluşturan', 'Eş parçalar ve birim kesrin doğru sayıda yinelenmesiyle bir kesir gösterimi oluşturur; kesri yazılı gösterimle (pay/payda) etiketler. Kesir gösterimlerini karşılaştırıp hangisinin büyük olduğunu söyler.', 0], ['Kesir Oluşturan', 'Birim ya da birim olmayan kesirlerin yinelenmesiyle, bütünü aşmayan ("bütünün parçası") kesir gösterimleri oluşturur. Basit yaygın kesirleri somut modellerle karşılaştırır.', 0], ['Kesri Tekrarlayıp Bütünü Aşan', 'Kesir birimini yineleyerek bütünden büyük sonuçlar dahil gösterimler oluşturur (örn. 5/4); kesri referans bütüne bağlı bir sayı olarak anlar. Eş paydalı kesirlerde birim kesir adımlarıyla toplama–çıkarma yapar; kesirleri sayı doğrusu modeliyle karşılaştırır, eşitliği aynı porsiyon/uzunluk olarak görür.', 0], ['Kesirlerle Toplama–Çıkarma Yapan', 'Basit yaygın kesirleri somut modeller kullanarak toplar ve çıkarır.', 0], ['Kesirlerle Çarpma–Bölme Yapan', 'Basit yaygın kesirleri dikdörtgen alan (dizilim) modeli kullanarak çarpar.', 0], ['Kesir ve Tam Sayıları Sıralayan', 'Basit oranları yüzde, kesir ve ondalık gösterimle ifade eder; tam sayıları, pozitif kesirleri ve ondalıkları sıralar.', 0]] },
  { key: 'pattern', name: 'Örüntü, Yapı ve Cebirsel Düşünme', ltName: 'Patterning', weight: 'tamamlayıcı', glyphType: 'pattern', start: 30, end: 132, ctx: 'boncuk dizme/ritim', manip: 'renkli bloklar', L: [['Örüntüyü Sezen: Temeller', 'Örüntüyü örtük ve sezgisel olarak algılar/kullanır (hareket, tekerlemeler); tek tek niteliklere (örn. renk) dikkat eder ama örüntüyü açıkça tanımaz.', 0], ['Örüntüyü Fark Eden', 'Basit bir örüntüyü (genellikle ABABAB) adlandıramasa/betimleyemese bile ÖRÜNTÜ olarak tanır.', 0], ['AB Örüntüsü Kuran', 'Tekrarlayan ABAB örüntülerini tanır, betimler ve kurar: eksik ögeyi tamamlar, kopyalar (önce modelin yanında, sonra uzağında), sona birim ekleyerek devam ettirir.', 1], ['Çeşitli Örüntüler Kuran (AAB/ABC)', 'AAB, ABC, AABC gibi farklı çekirdek birimli tekrarlayan örüntüleri tanır, betimler ve kurar.', 0], ['Örüntüyü Aktaran ve Birimini Bulan', 'Örüntüyü yeni ortam/materyale ÇEVİRİR (soyutlar/genelleştirir); tekrarlayan örüntünün EN KÜÇÜK çekirdek birimini belirler.', 1], ['Sayı Örüntüsü Kuran', 'Bir örüntüyü SAYISAL olarak betimler; bir dizinin geometrik ve sayısal temsilleri arasında çeviri yapar (işlevsel düşünmenin başlangıcı).', 0], ['İşlem Örüntülerini Fark Eden', 'Destekle aritmetik örüntüleri (çoğu kez sıfırın özellikleri) tanır/kullanır; "3+4=7" kalıbının ötesindeki sayı cümlelerini (7=3+4; 3+4=2+5) kabul eder — eşittir işareti "yanıt" değil, DENKLİK bildirir.', 0], ['İlişkisel Düşünen (+/−)', 'Toplama-çıkarma ve eşitlik anlayışını içeren örüntüleri kullanır; bir sayı cümlesinin iki tarafını HESAPLAMADAN akıl yürüterek karşılaştırır; belirli durumlar için işlevsel ilişkiler kurar.', 0], ['Sembollerle İlişkisel Düşünen (+/−)', 'İlişkisel düşünmeyi DEĞİŞKENLERLE sürdürür (a + b = b + a); bilinmeyen sayılar için harf kullanır; veri kümeleri arasındaki işlevsel ilişkileri genelleştirir.', 0], ['Çarpmayla İlişkisel Düşünen', 'Tekrarlı toplama olarak çarpmayı içeren örüntüler kullanır; dağılma özelliğiyle işlem bilgisini parçalara böler (7×6 = 5×6 + 2×6); ilişkiler için harfleri değişken olarak kullanır.', 0], ['Kuralı Bulup Genelleyen', 'İki veri kümesi arasındaki işlevsel ilişkiyi, genellenebilirliğin sınırlarını da kavrayarak genelleştirir — fonksiyonu matematiksel bir nesne olarak görmeye başlar.', 0]] },
  { key: 'shape2d', name: '2B Şekiller', ltName: '2D Shapes', weight: 'profil', glyphType: 'poly', start: 18, end: 120, ctx: 'çevredeki şekiller', manip: 'şekil blokları', L: [['Benzerini Fark Eden: Temeller', 'Gerçek yaşam nesnelerini karşılaştırır; iki nesnenin "aynı şey" olup olmadığına bütünsel görünüşe bakarak karar verir. Şekil henüz ayrı bir geometrik nesne olarak ele alınmaz.', 0], ['Şekil Eşleyen — Aynısı, Döndürülmüşü, Büyüğü-Küçüğü', 'Tanıdık şekilleri (daire, kare, tipik üçgen) önce aynı boyut ve yönelimde, ardından farklı boyutlarda, en sonunda farklı yönelimlerde eşler.', 0], ['Tanıdık Şekilleri Tanıyan', 'Tipik daire ve kareyi, daha seyrek olarak tipik üçgeni tanır ve adlandırır. Atipik yönelimdeki bir şekli zihnindeki prototiple eşleştirmek için kartı eliyle döndürebilir.', 0], ['Şekil Eşleyen — Yeni Şekiller ve Bileşimler', 'Daha geniş bir şekil çeşitliliğini farklı boyut ve yönelimler arasında eşler; iki şekilden oluşan bileşimleri de birbirleriyle eşleyebilir.', 0], ['Daire, Kare ve Üçgeni Tanıyan', 'Daha az tipik (atipik) bazı kare ve üçgenleri de tanır; bazı dikdörtgenleri tanıyabilir, eşkenar dörtgenleri ise genellikle tanımaz. Kenar ve köşeleri çoğu kez henüz ayırt etmez.', 1], ['Parçalardan "Benzerini" Kuran', 'Kenarları temsil eden materyallerle (pipet, çubuk) hedef şekle "benzeyen" bir şekil kurar; doğruluk ölçütü genel görünüştür. Açıyı yalnızca "sivri köşe" olarak düşünür.', 0], ['Her Tür Dikdörtgeni Tanıyan', 'Her boyut, en-boy oranı ve yönelimdeki dikdörtgenleri tanır; uzun-ince ya da eğik duran dikdörtgenleri de sınıfa dâhil eder.', 0], ['Kenar Tanıyan', 'Kenarları, kendine ait nitelikleri (uzunluk gibi) olan ayrı geometrik nesneler olarak tanır; şekli kenarları üzerinden betimlemeye başlar.', 0], ['Birçok Yönden Karşılaştıran', 'İki şekli bütün olarak inceleyip niteliklerindeki farklılıkları arar (kenar sayısı, büyüklük, sivri köşe); ancak bazı uzamsal ilişkileri (kenarların birbirine oranı, açıların düzeni) gözden kaçırabilir.', 0], ['Köşe (Açı) Tanıyan', 'Açıları, en azından "köşe" olarak, ayrı geometrik nesneler biçiminde tanır; şekilleri köşe sayısıyla betimleyebilir.', 0], ['Daha Çok Şekil Tanıyan', 'Tanıdık şekillerin çoğunu ve tipik altıgen, eşkenar dörtgen ve yamukları tanıyıp adlandırır.', 0], ['Şekilleri Doğru Adlandıran', 'Eşkenar dörtgen, altıgen, sekizgen ve yamuk dâhil yaygın şekilleri hatasız adlandırır; ovale "daire" demez. Dik açıyı tanır: dikdörtgeni, dik açısı olmayan paralelkenardan ayırt eder.', 0], ['Açıyı Farklı Yerlerde Tanıyan', 'Açıyı farklı bağlamlarda tanır ve betimler: köşeler ("daha sivri"), kesişmeler (makas), daha sonra kıvrım ve eğimler. Bu bağlamları henüz birbiriyle ilişkilendiremeyebilir.', 0], ['Şekli Parçalarıyla Tanımlayan', 'Şekilleri bileşenleri (kenarlar, köşeler/açılar) üzerinden tanımlar; "üç kenarı ve üç köşesi olan kapalı şekil üçgendir" gibi parça temelli tanımlar kullanır.', 0], ['Üst Üste Koyup Eşliğini Gösteren', 'İki şeklin eş olup olmadığını (eşlik) üst üste koyarak ya da tüm nitelikleri ve uzamsal ilişkileri karşılaştırarak belirler.', 0], ['Parçalardan Şekli Tam Kuran', 'Kenar parçaları ve açı bağlantılarıyla, bileşen bilgisine ve özellik ilişkilerine dayanarak tümüyle doğru bir şekil kurar (eşit kenarlar, tam kapanan köşeler, doğru açılar).', 0], ['Açıyı Temsil Eden', 'Açı bağlamlarını, referans çizgisi dâhil iki çizgiyle temsil eder; açı büyüklüğünü iki çizgi arasındaki dönme olarak anlar. Kenar uzunluğunun açıyı etkilediği türünden yanılgılar sürebilir.', 0], ['Eşliği Açıklayan', 'Eşliği geometrik özelliklere başvurarak ve dönüşümlerle (kaydırma, döndürme, yansıtma) açıklar; üst üste koymadan akıl yürütebilir.', 0], ['Şekil Ailelerini Ayırt Eden', 'Şekilleri sınıf üyeliğine göre ele alır (örneğin sınıflara ayırırken); ancak üyeliği henüz özellikler üzerinden açıkça gerekçelendirmez.', 0], ['Özellikleriyle Tanımlayan', 'Özellikleri açıkça kullanır ("dört eşit kenar ve dört dik açı"); özellikleri koruyan durum değişikliklerinde (örneğin döndürme) neyin değişmediğini — değişmezleri — görür.', 0], ['Özelliklere Göre Sınıflayan', 'Sınıf üyeliğini, açı ölçüsü dâhil özelliklere açıkça dayandırır; şekilleri özelliklerine göre hiyerarşik olarak sınıflar (kare, özel bir dikdörtgendir).', 0], ['Açı Kavramını Bütünleştiren', 'Açının farklı anlamlarını (dönme, köşe, eğim) açı ölçüsü dâhil tek bir kavramda birleştirir; bağlamlar arasında açıkça ilişki kurar.', 0]] },
  { key: 'comp2d', name: 'Şekil Birleştirme (2B)', ltName: 'Composing 2D Shapes', weight: 'profil', glyphType: 'tangram', start: 24, end: 108, ctx: 'yapboz', manip: 'tangram / desen blokları', L: [['Şekillerle Tek Tek Oynayan: Temeller', 'Şekilleri tek tek ele alır; daha büyük bir şekil oluşturmak için birleştirmez.', 0], ['Parçaları Bir Araya Getiren', 'Her şeklin tek bir rol üstlendiği, şekillerin birbirine değdiği resimler yapar; TÜM parçaların tek tek çizgiyle gösterildiği basit yapbozları deneme-yanılmayla doldurur.', 0], ['Resim Yapan', 'Bir resim ögesini birkaç şekli birleştirerek yapar (iki şekil = bir kol); yeni geometrik şekli ÖNGÖRMEDEN, deneme-yanılmayla ve "genel görünüşe"/kenar uzunluğuna göre seçer; yerleşimi sezdiren "kolay" yapbozları doldurur.', 0], ['Basit Şekilleri Parçalarına Ayıran', 'Ayrışımı açıkça belli olan (ipucu veren) basit şekilleri parçalarına ayırır.', 0], ['Şekil Oluşturan', 'Şekilleri ÖNGÖRÜYLE birleştirir ("Buraya ne oturur, biliyorum!"); şekli açılarına VE kenar uzunluklarına göre seçer; döndürme ve çevirmeyi amaçlı kullanır.', 1], ['Parça Değiştirerek Oluşturan', 'Küçük şekillerden yeni şekiller kurar; AYNI şekli farklı şekil takımlarıyla (ikame ederek) farklı yollarla oluşturur.', 0], ['Yardımla Şekli Parçalarına Ayıran', 'Görev ya da ortamın SUNDUĞU imgelem desteğiyle şekilleri parçalarına ayırır.', 0], ['Kurduğu Birimi Tekrarlayan', '"Şekillerden yapılmış şekil" birimlerini BİLEREK kurar ve çoğaltır; bunları hem birçok küçük şekil hem TEK büyük şekil olarak görür; deseni döşemeye (kaplamaya) doğru sürdürebilir.', 0], ['İmgelemle Şekli Parçalarına Ayıran', 'Şekilleri, KENDİ ürettiği imgelemle (çizgi desteği olmadan) esnek biçimde parçalarına ayırır.', 0], ['Birimden Birim Kuran', 'BİLİNÇLE kurduğu "birimlerin birimi" yapılarını inşa eder ve uygular; örneğin bilinçli kurulmuş bileşik birimle döşeme (kaplama) oluşturur.', 0], ['Katman Katman Parçalara Ayıran', 'Kendileri de ayrışım olan şekilleri PLANLI ayrışımlarla esnekçe parçalara ayırır (parçaların parçaları).', 0]] },
  { key: 'disembed', name: 'Gömülü Şekilleri Ayırt Etme', ltName: 'Disembedding Shapes', weight: 'profil', glyphType: 'embed', start: 30, end: 108, ctx: 'kalabalık resimde şekil bulma', manip: 'saydam katmanlar', L: [['Saklı Şekli Sezen: Temeller', 'Yalnızca ÜST ÜSTE BİNMEYEN (ayrık) şekilleri ya da küçük şekil topluluklarını hatırlayıp yeniden üretebilir.', 0], ['Üst Üste Şekilleri Ayırt Eden', 'Karmaşık bir çizimin DIŞ ÇERÇEVESİNİ belirler; üst üste binen düzenlemelerde bazı şekilleri bulur, ancak başka şeklin İÇİNE gömülü şekilleri henüz bulamaz.', 0], ['Şekil İçinde Şekil Bulan', 'Başka şekillerin İÇİNE gömülü şekilleri belirler (iç içe daireler, kare içinde daire); karmaşık çizimlerdeki BİRİNCİL yapıları bulur.', 1], ['Gizlenmiş Düzenleri Bulan', 'Karmaşık çizimin BİRİNCİL yapılarıyla örtüşmeyen gömülü şekilleri de belirler (parçaları birden çok ana şekle dağılmış hedefler).', 0], ['Tüm Saklı Şekilleri Bulan', 'Her türden karmaşık düzenlemede gömülü şekillerin TÜMÜNÜ başarıyla belirler.', 0]] },
  { key: 'shape3d', name: '3B Şekiller', ltName: '3D Shapes', weight: 'profil', glyphType: 'cube', start: 24, end: 114, ctx: 'kutu/top/koni nesneler', manip: 'geometrik katı modeller', L: [['Cisimleri Algılayan: Temeller', 'Bebeklikten itibaren 3B şekilleri doğru algılar; ancak bu algı, durağan görünümlerden çok sürekli hareket hâlindeki nesnelerle sınırlıdır.', 0], ['Tanıdık Cisimleri Tanıyan (Top, Kutu)', 'Bazı prototip 3B şekilleri (küre, küp) günlük ya da matematiksel adlarıyla tanır; 2B sözcükleri ("yuvarlak", "kare") kullanabilir. Cisimleri "sivrilik", "incelik-uzunluk" gibi günlük niteliklerle betimler.', 0], ['3B Cisimleri Tanıyan', 'Daha çok cismi günlük adların yanında bazı matematiksel adlarla da tanır; cisimlerin yüzlerini 2B şekiller olarak fark eder.', 1], ['Cisimlerin Yüzlerini Sayan', 'Bir cismin TÜM yüzlerini 2B şekiller olarak tanır; yüzleri atlamadan ve yinelemeden doğru sayar.', 1], ['Parçalardan 3B Şekil Kuran', '3B şekillerin parçalarını (yüzler, köşe bağlantıları) temsil eden materyalle, bileşen ve ilişki bilgisini kullanarak tümüyle doğru bir 3B şekil kurar — dik açılar, küpün altı yüze gereksindiği gibi.', 0], ['Cisimleri Adlandırıp Tanımlayan', 'Cisimlerin çoğunu tanımlar ve birden çok özelliğini (yüz, ayrıt, köşe sayısı gibi) söyler; verilen bir açınımın katlanınca hangi cismi oluşturacağını belirler.', 0], ['Cisim Ailelerini Ayırt Eden', 'Cisimlerin çoğunu prototip görünüme değil, özelliklerine dayanarak tanımlar ve sınıflar (örn. iki özdeş paralel yüzü ve dikdörtgen yan yüzleri olanlar prizmadır).', 0]] },
  { key: 'comp3d', name: 'Yapı Kurma (3B)', ltName: 'Composing 3D Shapes', weight: 'profil', glyphType: 'blocks', start: 18, end: 108, ctx: 'blok inşa', manip: 'küp bloklar', L: [['Blokları Tek Tek Kullanan: Temeller', 'Blokları rastgele yerleştirir ya da tek tek kullanır; bloklara vurabilir, onları birbirine çarpabilir ya da kaydırabilir; tek bir bloğu başka bir nesneyi temsil etmek için kullanabilir.', 0], ['Üst Üste Dizen', '"Üstüne koyma" uzamsal ilişkisini kullanarak blokları üst üste dizer; hangi bloğu seçeceği henüz sistemli değildir.', 0], ['Sıra Yapan', '"Yanına koyma" ilişkisini kullanarak bloklardan (tek boyutlu) bir sıra yapar.', 0], ['Aynı Şekli Üst Üste Dizen', 'Eş blokları (ya da benzer biçimde işine yarayan ilişkilere sahip blokları) seçerek üst üste ya da sıra hâlinde dizer; blok seçimi sistemlileşmiştir.', 0], ['Zemin ve Duvar Yapan', 'Bir yapı içinde dikey ve yatay bileşenler kurar; ancak dağarcığı sınırlıdır — bir "zemin" ya da basit bir "duvar" gibi (2B/düzlemsel) yapılar.', 0], ['Kemer ve Köşeleri Deneyerek Kuran', 'Birden çok uzamsal ilişkiyi, birden çok yönde ve temas noktasında kullanır; deneme-yanılma ile de olsa kemerler, kapalı alanlar, köşeler ve çapraz (artı) biçimler üretir.', 0], ['Yapıyı Planlayarak Kuran', 'Ortaya çıkacak 3B şekli önceden öngörerek kurar; kemer, kapalı alan, köşe ve çaprazları sistemli üretir; birkaç blok yüksekliğinde kurar, giderek derinlik ve çatı ekler.', 1], ['Parça Değiştirip Karmaşık Yapılar Kuran', 'Eş bir bütünün yerine bileşik bir parça koyabilir (örn. bir uzun blok yerine iki kısa blok); birden çok kemerli karmaşık köprüler, rampalar ve merdivenler; çatılı ve birden çok iç mekânlı 3B yapılar kurar.', 0], ['Katlı ve Çatılı Yapılar Kuran', 'Birden çok katlı, her katın tavanı tam oturtulmuş karmaşık kuleler/yapılar kurar; kemerleri ve alt yapıları olan, yetişkin yapılarına benzer blok yapıları üretir (birimlerin birimleri).', 0]] },
  { key: 'spviz', name: 'Uzamsal Görselleştirme ve İmgelem', ltName: 'Spatial Visualization', weight: 'profil', glyphType: 'rotate', start: 24, end: 120, ctx: 'parçayı döndürüp yerleştirme', manip: 'döndürülebilir parçalar', L: [['Sığar mı Diye Deneyen: Temeller', 'Nesnelerin boyut ve biçimini, onları hareket hâlinde gözleyerek keşfeder; bir boşluğa neyin sığacağını deneme-yanılma ile bulur, giderek sığacak olanı önceden kestirmeye başlar.', 0], ['Deneye Deneye Yerleştiren', 'Şekilleri bir yere, fiziksel deneme-yanılma yoluyla taşıyıp yerleştirebilir.', 0], ['Basit Kaydırma-Döndürme Yapan', 'Kolay görevlerde nesneleri doğru biçimde kaydırır ve döndürür; hareketi başlatan erken bir sezgiyle yola çıkar, hareket sırasında gerçek zamanlı ayarlama yapar.', 1], ['Doğru Hareketi Seçen (yönü şaşabilir)', 'Gelişen sezgisiyle doğru hareket türünü kullanır; ancak yön ya da miktar her zaman doğru değildir — örneğin çevirme gerektiğini bilir ama ters yöne çevirebilir.', 0], ['Zihninde Canlandırıp Hareket Ettiren', 'Somut materyalle kaydırma ve çevirmeleri (çoğunlukla yatay/dikey) zihinsel imgelerin rehberliğinde yapar: 45°, 90° ve 180° döndürmeler; dikey/yatay doğru üzerinden çevirmeler. Hareketi ve sonucunu zihninde canlandırır.', 0], ['Çapraz Eksende de Hareket Ettiren', 'Önceki tüm hareketlere ek olarak çapraz (diyagonal) kaydırma ve çevirmeleri de yapar — örneğin 45° eğik bir doğru üzerinden çevirme.', 0], ['Tamamen Zihinden Hareket Ettiren', 'Şekil hareketlerinin sonucunu yalnızca zihinsel imgeleri kullanarak yordar — herhangi bir yön ve miktar için; fiziksel denemeye gereksinim duymaz.', 0]] },
  { key: 'sporient', name: 'Uzamsal Yönelim', ltName: 'Spatial Orientation', weight: 'profil', glyphType: 'grid', start: 18, end: 120, ctx: 'sınıf/oyun alanında yön bulma', manip: 'harita ve ızgara', L: [['Uzamsal Yönelim: Temeller', 'En erken yönelim sistemlerini kullanır: tepki öğrenmesi (kendine dayalı — hedefle ilişkilenen kendi hareket örüntüsü) ve ipucu öğrenmesi (dışsal — tanıdık yer imleri).', 0], ['Kendi Yolunu Hatırlayan', 'Kendi hareketlerini — yaklaşık uzaklık ve yönleriyle birlikte — hatırlar ve yineleyebilir (yol bütünleme, "dead reckoning").', 0], ['Yerleri Aklında Tutan', 'Konumları, uzaklıkları ve yönleri yer imlerine göre saklayan "zihinsel haritalar" oluşturur; oda duvarlarını referans çerçevesi olarak kullanır. "İçinde/üstünde/altında, yukarı/aşağı" gibi uzamsal sözcükler gelişir.', 0], ['Uzak İpuçlarını Kullanmaya Başlayan', 'Hedef önceden belirtilmişse, kendisi yer değiştirdikten sonra bile yakınındaki nesneleri uzak yer imlerinden yararlanarak bulur. Yatay/dikey doğrultuları fark eder; "yanında, arasında" sözcükleri gelişir.', 0], ['Yakın Çevresinde Yön Bulan', 'Hedef önceden belirtilmemiş olsa bile, yer değiştirdikten sonra nesnelerin yerini bulur; küçük bir alanı kapsamlı biçimde (dolanan bir örüntüyle) arar. "Önünde/arkasında, sağ/sol" gelişir; grafik bağlamında her iki eksenden doğru uzatır.', 1], ['Tanıdık Mekânda Yön Bulan', 'Yer değiştirdikten sonra nesneleri, yerleşim düzeninin genel biçimini koruyarak bulur; konumları yer imlerine göre temsil eder ("ikisinin tam ortasında"); açık alanlarda/labirentlerde kendi konumunu izler; basit oyunlarda koordinat etiketleri kullanır.', 0], ['Harita Kullanan', 'Resimli ipuçları içeren basit haritalarla nesnelerin yerini bulur; iki doğrultuyu uzatıp tek bir konumda birleştirir.', 0], ['Koordinat Okuyup İşaretleyen', 'Haritalar üzerinde koordinatları okur ve işaretler.', 0], ['Rota Haritasını İzleyen', 'Basit bir rota haritasını, giderek daha doğru yön ve uzaklıklarla izler.', 0], ['Haritayı Her Durumda Kullanan', 'Gözlemciyi ve yer imlerini içeren genel çerçeveler kullanır; uzamsal ilişkiler dönüştürülmüş olsa bile (örn. harita döndürülmüş) haritaları izler ve kendisi harita oluşturur.', 0]] },
  { key: 'mlen', name: 'Ölçme: Uzunluk', ltName: 'Length Measurement', weight: 'profil', glyphType: 'ruler', start: 24, end: 120, ctx: 'boy/mesafe ölçme', manip: 'ataç, birim çubuk, cetvel', L: [['Uzunluk Duyarlılığı: Temeller', 'Doğuştan gelen, örtük uzunluk duyarlılığı: yaklaşık 6 aydan itibaren basit uzunluk farklarını sezgisel olarak ayırt eder; ancak uzunluğu ayrı bir nitelik olarak henüz tanımayabilir.', 0], ['Uzunluğu Fark Eden', 'Uzunluğu/uzaklığı bir nitelik olarak ayırt etmeye başlar; "uzun", "kısa" sözcüklerini kullanır. Uzunluğu karşılaştırmalı değil mutlak değerlendirebilir (tüm yetişkinler "uzun"dur) ve karşılaştırmada birbirine karşılık gelmeyen parçalara bakabilir.', 0], ['Uzunluğu Doğrudan Karşılaştıran', 'İki nesnenin hangisinin daha uzun (ya da eşit) olduğunu anlamak için nesneleri fiziksel olarak yan yana getirip uçlarını hizalar; "uzun", "daha uzun", "en uzun" ifadelerini kullanır.', 0], ['Uzunluğu Dolaylı Karşılaştıran', 'Yan yana getirilemeyen iki nesnenin uzunluğunu üçüncü bir nesneyle (ip, şerit) temsil ederek karşılaştırır (geçişlilik). Bu düzeyde "ölçüyormuş gibi" davranışlar görülebilir: eşit birim olmadan sayarak ilerleme, cetveli başlangıç noktasına dikkat etmeden kullanma.', 1], ['Boy Sırasına Dizen (5’e kadar)', '1–5 birim işaretli uzunlukları sıraya dizer; belirgin farklı 3–5 işaretsiz uzunluğu deneme-yanılmayla kısadan uzuna sıralar. "Azar azar artan" diziye ilişkin zihinsel imge kurulmaktadır.', 0], ['Uç Uca Dizerek Ölçen', 'Bir uzunluğu ölçmek için birden çok birimi (küp, ataş) uç uca dizer ve sayar. Birimlerin eşit uzunlukta olması gerektiğini ya da birimler yetmediğinde ne yapılacağını henüz tam kavramayabilir; ölçüleri karşılaştırmalarda kullanma daha sonra gelişir.', 1], ['Boy Sırasına Dizen (6 ve üzeri)', '1–6+ birim işaretli uzunlukları sıralar; işaretsiz uzunlukları az hatayla, kendiliğinden seri biçimde dizer (önce en kısayı, sonra kalanların en kısasını seçerek).', 0], ['Tek Birimi Tekrarlayarak Ölçen', 'Tek bir birimi kaydırarak yineleyip (birim yineleme) uzunluğu ölçer; birimlerin eşit olması gerektiğini bilir; birim büyüklüğü ile birim sayısı arasındaki ters ilişkiyi kavrar (büyük birim → küçük sayı); iki uzunluğu toplar; cetveli az yardımla kullanır.', 0], ['Uzunluk Ölçen', 'Kırık (bükülmüş) bir yolun uzunluğunu parçalarının toplamı olarak düşünür; özdeş birim, birimler arası ilişkiler, birimin bölümlenmesi, sıfır noktası ve mesafe birikimi kavramlarını kullanır; tahmin etmeye başlar.', 0], ['Kavramsal Cetvelle Ölçen', '"İçsel" bir ölçme aracı kullanır: nesneyi zihinsel olarak bölümleyip bölümleri sayar; ölçüler üzerinde aritmetik işlemler yapar; birimi alt bölümlere (yarımlara) ayırır; isabetli tahminlerde bulunur.', 0], ['Çevre Uzunluğunu Hesaplayan', 'Çokgenlerin çevre uzunluğunu (karmaşık durumlar dâhil) hesaplar; çevresi aynı/alanı aynı durumları ilişkilendirir; uzunluğu 2B ve 3B bağlamlarda çözümler; kesinlik/doğruluk fikirleri gelişir.', 0], ['Türetilmiş Birimlerle Ölçen', 'Nesne kümelerini çevre/yol uzunluğuna göre sentezleyip gerekçeli karşılaştırmalar yapar; türetilmiş birimleri (saatte kilometre) ve birim dönüşümlerini kullanır; tam sayı olmayan ölçülerle çalışır; en küçük bölmenin kesirlerine kadar tahmin eder.', 0]] },
  { key: 'marea', name: 'Ölçme: Alan', ltName: 'Area Measurement', weight: 'profil', glyphType: 'areagrid', start: 36, end: 120, ctx: 'yüzey kaplama', manip: 'birim kareler', L: [['Alan Duyarlılığı: Temeller', 'İlk yıldan itibaren yüzey büyüklüğüne duyarlıdır; ancak alanı ayrı bir nitelik olarak tanımayabilir. Karşılaştırmada kenar eşleştirme stratejileri kullanabilir.', 0], ['Alanı Fark Eden', '2B yüzey miktarını algılar, sezgisel karşılaştırmalar yapar; ancak alan yerine uzunluklara bakabilir ("boy artı en" sezgisi). Üst üste koyma önerildiğinde doğru karşılaştırır; "kaplanmış" dikdörtgen çizimleri henüz yapılandırılmamıştır.', 0], ['Karolarla Kaplayıp Sayan', 'İstendiğinde dikdörtgen bir yüzeyi somut karolarla kaplar; ancak algısal destek (ızgara) olmadan 2B uzayı satır-sütun biçiminde örgütleyemez. İki yüzeyi üst üste koyarak doğrudan karşılaştırır.', 0], ['Boşluksuz Kaplayıp Sayan', 'Bir bölgeyi boşluksuz ve bindirmesiz, yaklaşık sıralar hâlinde tam kaplar (çizimle de); fazladan karo verildiğinde belirtilen alanda bölge oluşturur (20 karodan 12 karoluk dikdörtgen gibi).', 1], ['Birim Karoyu Tekrarlayarak Ölçen', 'Birimleri çoğu kez sıralar kullanarak tek tek sayar; bir birimi yineleyerek yüzeyi kaplar; kabaca eşit birimleri hizalı çizer; birim büyüklüğü ile sayısı arasındaki ters ilişkiyi kurar; alanları birim sayarak karşılaştırır.', 0], ['Satırları Birim Görmeye Başlayan', 'Kare birimi hem birim hem de bir satırın/sütunun parçası (bileşik birim) olarak görmeye başlar; görsel destek varken saymada ve çizimde satır/sütun bileşiklerini kullanır; eni ile boyu henüz eşgüdümleyemez; makul tahminler yapar.', 0], ['Satır-Sütun Düzenini Kuran', 'Kısmi birimleri ayrıştırıp birleştirir; satırları satır olarak çizer; alan korunumu gelişmeye başlar; farklı görünen bölgelerin eşit alanlı olabileceğini parçaların toplamıyla gerekçelendirir; boşluksuz kaplama gerekliliğini açıkça bilir.', 1], ['Alanı Çarparak Bulan', 'Yalnızca doğrusal ölçülerden, satır ve sütunları çarpımsal olarak yineleyip alanı çizim yapmadan hesaplar; dikdörtgen alan formülünü soyut düzeyde kavrar; geçişli karşılaştırmalar yapar.', 0]] },
  { key: 'mvol', name: 'Ölçme: Hacim', ltName: 'Volume Measurement', weight: 'profil', glyphType: 'volcubes', start: 42, end: 126, ctx: 'kapları doldurma', manip: 'küpler ve kaplar', L: [['Hacim Duyarlılığı: Temeller', 'İlk yıldan itibaren hacme/miktara duyarlıdır; ancak hacmi genel "büyük–küçük" algısından ayrı bir nitelik olarak tanımayabilir.', 0], ['Hacmi Fark Eden', 'Kapasiteyi/hacmi bir nitelik olarak ayırt etmeye başlar; çok bloğu "büyük", az bloğu "küçük" ile ilişkilendirir.', 0], ['Hacim Dolduran', 'İki kabı, birini diğerine boşaltarak karşılaştırır; bir kabı küçük bir kapla doldurup kepçe sayısını sayar (henüz hatalı olabilir); küpleri kutuya doldurur, giderek düzenli yerleştirir; üçüncü bir kap aracılığıyla geçişli karşılaştırma yapabilir.', 0], ['Hacmi Saymaya Başlayan', 'Küplerin uzayı doldurmasına ilişkin kısmi anlayış geliştirir; gereken kepçe sayısını tahmin eder; dolu ve boş kısımlara birlikte dikkat eder; "yarısı dolu" durumunu tanır; kutuyu düzenli paketleyip küpleri teker teker sayar; üç boyutu açıkça fark eder.', 1], ['Birim Kabı Tekrarlayarak Ölçen', 'Basit birimlerle doldurup doğru sayar; birim büyüklüğü ile sayısı arasındaki ilişkiyi açıkça kurar (büyük birimden daha az gerekir); 1:2 oranlı birimler arasında dönüşüm yapar.', 0], ['Küp Sıralarını Birim Görmeye Başlayan', 'Küpleri kübik hacim birimleriyle ilişkilendirir; bileşik birimleri (1×1×n sıra/sütunlar) zihinde canlandırıp kullanır; paketlerken içte kalan (görünmeyen) küpleri hesaba katar; yarısı dolu kutuyu tanır, kalan sıraları zihinde tamamlar.', 0], ['Katman Katman Sayan', 'Doldurma, paketleme ve inşa etmeyi eşgüdümler; bir katmandaki küpleri sayar ya da hesaplar, sonra katmanları toplar ya da ritmik sayar; çarpmaya geçmeye başlar (bir katman × katman sayısı).', 1], ['Hacmi Çarparak Bulan', 'Dikdörtgenler prizmasının hacim formülünü soyut düzeyde kavrar; çarpımsal karşılaştırmalar yapar; hacmi, yapı kurmadan ya da çizmeden boyutlardan hesaplar ve çarpmanın hacmi neden ölçtüğünü açıklar.', 0]] },
  { key: 'mang', name: 'Ölçme: Açı ve Dönme', ltName: 'Angle and Turn Measurement', weight: 'profil', glyphType: 'angle', start: 48, end: 126, ctx: 'kapı/saat açısı', manip: 'açı modelleri, gönye', L: [['Açı ve Dönme Duyarlılığı: Temeller', 'Bebekler, hem nesnelerin hem de kendi bedenlerinin dönmesi biçimindeki açılara duyarlıdır.', 0], ['Açıyı Oyunda Sezen', 'Günlük ortamlarda açı ölçüsüne ilişkin sezgisel fikirleri kullanır: blok inşası, yapboz yerleştirme, yürürken dönme.', 0], ['Açıyı Farkında Olmadan Kullanan', 'Hizalama görevlerinde, blok yapılarında ve günlük bağlamlarda açıları ve örtük açı kavramlarını (paralellik, diklik) kullanır; eş üçgenlerin karşılık gelen açılarını somut modellerle eşleyebilir; "açı/köşe" sözcüğünü betimleyici biçimde kullanır.', 0], ['Açı Eşleyen', 'Açıları somut olarak eşler (birini diğerinin üzerine koyarak); belirli bağlamlarda paralel olanı olmayandan açıkça ayırt eder; açıları "küçük/büyük" diye ayırır ancak kol (kenar) uzunluğuna aldanabilir.', 1], ['Açı Büyüklüklerini Karşılaştıran', 'Açıyı ve açı büyüklüğünü içinde bulunduğu şekilden/bağlamdan ayırt eder; açı büyüklüklerini karşılaştırır; önce dik açıları, sonra diğer eş açıları farklı yönelimlerde tanır; basit dönmeleri karşılaştırır. (Öğretim olmadan bu ve üstü düzeylere ilkokul sonunda bile ulaşılamayabilir.)', 0], ['Açı Ölçen', 'Açıyı ve açı ölçüsünü iki temel yönüyle kavrar: ortak başlangıç noktalı iki ışın VE bir ışının diğerine dönmesi (dönme miktarı); birden çok bağlamı standart kavram ve işlemlerle temsil eder.', 0]] },
  { key: 'classif', name: 'Sınıflama ve Veri Analizi', ltName: 'Classification & Data', weight: 'profil', glyphType: 'sort', start: 18, end: 126, ctx: 'nesneleri gruplama', manip: 'sınıflama halkaları, Venn', L: [['Benzerlik Sezgisi: Temeller', 'Nesne ve durumları sezgisel olarak "benzer" diye tanır (yaşamın ilk haftalarından itibaren). Yaklaşık 6 ayda farklı nesneleri, 12 ay civarında benzer nesneleri bir araya getirmeye başlar.', 0], ['Benzer/Farklı Grup Oluşturan', 'Yaklaşık 18 ayda özdeş nesnelerden kümeler oluşturur (diğerleri farklıdır); 2 yaş civarında bazı özelliklere göre sezgisel benzerlik gruplaması yapar — gruplama karışık ve tutarsız olabilir.', 0], ['Basit Gruplayan', 'Yetişkin desteğiyle, sözel kurala göre gruplama yapar ("Kırmızılar bu kutuya" gibi yönergeleri izler). Hatalı yapılmış basit bir gruplamayı düzeltebilir.', 0], ['Benzer Özelliklere Göre Gruplayan', 'Açık bir özelliğe göre gruplar; ancak gruplama sırasında özellik değiştirebilir (renkle başlayıp şekle kayma). Sonuç yetişkin gruplamasına benzeyebilir; dayanağı genel benzerlik olabilir.', 1], ['Tutarlı ve Esnek Sınıflayan', 'Verilen ya da kendi belirlediği tek bir özelliğe göre tutarlı ve eksiksiz sınıflar; ardından aynı nesneleri farklı bir özelliğe göre yeniden sınıflayabilir. "Bazı" ve "hepsi" sözcüklerini kullanır.', 0], ['Tek Tek Verileri Okuyan', 'Bir değeri tekil bir vakayla ilişkilendirir ("Ali’nin kulesi 5 küp"); sayısal veriyi en büyük/en küçük vakayı bulmak için kullanır. (Bu düzeyden önce veri, çocuk için yalnızca yaşantının "hatırası"dır.)', 0], ['Veriyi Sınıflayan', 'Benzer değerli vakaları aynı kategori olarak ele alır; kategori sıklıklarını karşılaştırır (en çok / en az tercih edilen vaka türü). İki basit grafiği görsel olarak karşılaştırabilir.', 0], ['Çoklu Özelliğe Göre Sınıflayan', 'Nesneleri tek bir sınıflamada birden fazla özelliği birlikte gözeterek sınıflar (örn. hem renk hem boyut: "büyük kırmızılar").', 0], ['Veriye Bütün Olarak Bakan', 'Soyut özelliklere göre (işlev/kavram) sınıflar; veri kümesine bütün olarak bakar: göreli sıklık, verinin "biçimi", merkez. Beklenti (ortalama/olasılık) ve değişkenlik ("yayılım") sezgisi başlar; modu (en sık değeri) ve aralıkları görür.', 0], ['Hiyerarşik Sınıflayan', 'Kategorileri ve alt kategorileri hiyerarşik kapsayıcılıkla sınıflar (sınıf kapsayıcılığı); birden çok adlandırılmış/ilişkili özelliği kullanır ve bir nesnenin birden fazla gruba ait olabileceğini anlar.', 0], ['Veriyi Temsil Eden', 'Grafiklerin "merkezini" ve değişkenliğini/yayılımını gözetir; aynı büyüklükteki veri kümelerinin grafiklerini doğru karşılaştırır.', 0]] },
]

// ── Öğrenme alanları (içerik gruplaması; MEB öğrenme alanlarıyla uyumlu) ───
export const STRANDS = [
  { key: 'say', label: 'Sayılar ve İşlemler', short: 'Sayı' },
  { key: 'geo', label: 'Geometri ve Uzamsal', short: 'Geometri' },
  { key: 'olcme', label: 'Ölçme', short: 'Ölçme' },
  { key: 'cebir', label: 'Cebir ve Örüntü', short: 'Cebir' },
  { key: 'veri', label: 'Veri ve Sınıflama', short: 'Veri' },
]
const STRAND_OF = {
  sub: 'say', count: 'say', comp: 'say', add: 'say', compose: 'say', multdiv: 'say', frac: 'say',
  pattern: 'cebir',
  shape2d: 'geo', comp2d: 'geo', disembed: 'geo', shape3d: 'geo', comp3d: 'geo', spviz: 'geo', sporient: 'geo',
  mlen: 'olcme', marea: 'olcme', mvol: 'olcme', mang: 'olcme',
  classif: 'veri',
}
export const strandOf = (key) => STRAND_OF[key]

// ── EXT yaş bantları (ay) — düzey-bazlı kanonik kalibrasyon ────────────────
// Clements & Sarama kanonik yaşlarından (learningtrajectories.org 2021/2023;
// briefs #4 örüntü/sınıflama, #5 geometri/uzamsal/ölçme, #6 oluşturma/çarpma/kesir)
// türetilmiştir. Her dizi, ilgili EXT alanının düzeyleriyle AYNI sıradadır:
// [lo, hi] (ay). Boş/eksikse buildDomains start–end eşit-bölme yedeğine düşer.
// Yaşlar OLASILIKSAL ALT-SINIR niteliğinde illüstratiftir (tanı eşiği değil).
export const EXT_BANDS = {
  // Sayı üstyapısı (brief #6 + review) — sembolik düzeyler ~3. sınıfa çapalı
  compose: [[0, 18], [18, 36], [36, 48], [48, 60], [54, 66], [60, 72], [72, 84], [78, 90], [84, 96], [96, 108], [102, 120]], // 11 lv
  multdiv: [[0, 36], [48, 66], [60, 72], [72, 84], [90, 102], [102, 114], [102, 114], [108, 120], [114, 126]], // 9 lv
  frac: [[0, 48], [48, 72], [54, 78], [96, 108], [96, 108], [102, 114], [108, 120], [114, 126], [120, 132], [132, 144], [132, 144]], // 11 lv
  // Örüntü/cebir (brief #4) — birim-tanıma ~7 yaş; cebir üst banda yayılır
  pattern: [[0, 35], [24, 47], [36, 59], [48, 71], [48, 71], [60, 95], [60, 95], [72, 95], [72, 95], [72, 107], [84, 107]], // 12 lv
  // Geometri (brief #5 © 2023 yıl bantları)
  shape2d: [[0, 24], [12, 30], [24, 42], [36, 42], [48, 54], [48, 54], [48, 60], [48, 60], [48, 60], [48, 60], [60, 66], [72, 78], [84, 90], [84, 90], [84, 90], [84, 90], [96, 108], [96, 108], [96, 114], [96, 120], [96, 132], [96, 144]], // 22 lv
  comp2d: [[0, 30], [36, 42], [48, 60], [48, 60], [48, 60], [60, 72], [72, 84], [72, 90], [72, 96], [96, 108], [96, 120]], // 11 lv
  disembed: [[0, 48], [48, 60], [60, 72], [72, 84], [84, 96]], // 5 lv
  shape3d: [[0, 35], [36, 59], [60, 83], [84, 95], [84, 107], [96, 119], [96, 119]], // 6 lv
  comp3d: [[0, 24], [0, 24], [12, 24], [24, 30], [24, 36], [36, 48], [48, 60], [60, 72], [72, 84]], // 9 lv
  // Uzamsal (review explicit lo/hi)
  spviz: [[0, 24], [12, 36], [36, 60], [54, 72], [66, 84], [78, 96], [90, 108]], // 7 lv
  sporient: [[0, 12], [6, 24], [12, 30], [24, 42], [48, 60], [60, 72], [72, 84], [84, 96], [96, 108], [96, 114]], // 10 lv
  // Ölçme (review explicit + brief #5)
  mlen: [[0, 24], [12, 36], [42, 54], [48, 60], [48, 60], [66, 78], [66, 78], [78, 90], [84, 96], [96, 108], [96, 110], [96, 120]], // 12 lv
  marea: [[0, 36], [36, 48], [48, 60], [60, 66], [60, 72], [72, 84], [96, 108], [96, 120]], // 8 lv
  mvol: [[0, 24], [12, 30], [36, 48], [60, 72], [84, 96], [84, 102], [96, 108], [96, 120]], // 8 lv
  mang: [[0, 24], [24, 42], [48, 60], [72, 84], [84, 96], [96, 108]], // 6 lv
  // Veri/sınıflama (brief #4)
  classif: [[0, 30], [18, 36], [36, 48], [54, 66], [66, 78], [78, 90], [90, 102], [96, 108], [96, 114], [96, 120], [96, 132]], // 11 lv
}

// ── EXT gözlem görevleri — düzey-bazlı, somut, ölçüt-dayanaklı uygulama yönergesi
// { key: ['görev1', 'görev2', ...] } — ilgili alanın düzeyleriyle AYNI sırada.
// Boş/eksikse gözlem maddesi düzeyin davranış betimine (d) düşer. Her görev:
// NE yaptırılacağını + BAŞARI ÖLÇÜTÜNÜ belirtir (Clements & Sarama davranışları).
export const EXT_TASKS = {
  compose: [
    "Çocuk oyuncaklarını iki kutuya kendiliğinden ayırıp birleştiriyor mu? (Bakıcı bildirimi / doğal gözlem) Bütünü bölme/birleştirme denemesi görülürse ✓.",
    "İki pulu bir avuçta toplatın: 'Hepsi kaç oldu?' İki küçük parçayı tek küme olarak birleştirirse ✓.",
    "4 pulu gösterip 2'sini elinizle örtün: 'Buradakiler de bütünün parçası mı?' Parçaların bütünü oluşturduğunu söyler/gösterirse ✓.",
    "4 pulu iki kutuya dağıttırın, sonra 5 pulla yineleyin: 'Kaç tane oldu?' 4 ve 5'i parçalara ayırıp tekrar birleştirebilirse ✓.",
    "7 pulu iki kutuya bölün: '3 burada, kaç tane orada?' 7'nin ikili ayrışımını saymadan söylerse ✓.",
    "'10'u iki kutuya kaç farklı şekilde ayırabilirsin?' diye sorun. 10'un bileşenlerini (ör. 6+4, 7+3) akıcı üretirse ✓.",
    "12-15 pulu iki kutuya paylaştırın: 'Toplam kaç?' 20'ye dek bileşim/ayrışımı doğru yaparsa ✓.",
    "17 pulu 'bir onluk + birlikler' diye gruplatın: 'Bu kaç eder?' 1 onluk + 7 birlik = 17 diye çözerse ✓.",
    "'6+4=10 biliyorsan 6+5 kaçtır?' diye sorun. Bilinen bileşimden yeni sonucu türetirse ✓.",
    "İki kutudaki pullarla çok adımlı bir hikâye problemi verin. Bileşim temelli problemi esnek çözerse ✓.",
    "Onluk-birlik pullarla iki basamaklı bir bileşim/ayrışım istetin (ör. 23'ü ayır). Çok basamaklı işlemi doğru yaparsa ✓.",
  ],
  multdiv: [
    "Çocuk şekerleri arkadaşlarına paylaştırırken gözleyin (bakıcı bildirimi). Eşit paylaşımı sezgisel denerse ✓.",
    "6 şekeri 2 tepsiye dağıttırın: 'Herkese ver.' Birer birer sırayla dağıtırsa ✓.",
    "8 şekeri 2 tepsiye eşit dağıttırın. Eşit gruplar oluşturup dağıtırsa ✓ (eşitliği gözetirse).",
    "'3 tabakta 2'şer şeker var, toplam kaç?' Nesnelerle her grubu kurup hepsini sayarak doğru sonucu bulursa ✓.",
    "'4'er 4'er sayarak 3 grupta kaç şeker olduğunu bul.' Ritmik sayıp (4,8,12) doğru sonuca ulaşırsa ✓.",
    "'5×4 biliyorsan 6×4 kaçtır?' Bilinen çarpımdan türetirse ✓.",
    "12 şekeri verin: '3 kişiye paylaştır' (her grupta kaç) ve '3'erli grupla' (kaç grup) ayrı ayrı çözdürün. İki bölme türünü de doğru çözerse ✓.",
    "Dizilim/dikdörtgen düzende (3 sıra×4) şekerleri saydırıp bir çarpım problemi çözdürün. Diziyi çarpımsal çözerse ✓.",
    "'Bölen ile bölüm arasındaki ilişkiyi' somut durumla sorgulayın (12÷3=4 ise 12÷4=?). Parça-bütün ilişkisiyle çözerse ✓.",
  ],
  frac: [
    "Çocuk bir kurabiyeyi arkadaşıyla 'eşit' paylaşmaya çalışıyor mu? (doğal gözlem) Orantısal/adil pay sezgisi görülürse ✓.",
    "Kâğıt bir pizzayı 'iki kişiye eşit böl' deyin. Şekli eşit (denk) parçalara bölerse ✓ (eşit değilse ✗).",
    "Bir çikolatayı ikiye böldürün: 'Bu parçaya ne denir?' Yarımı tanıyıp oluşturursa ✓.",
    "Daireyi 4 eşit parçaya böldürüp birini gösterin: 'Bu ne kadar?' Birim kesri (1/4) tanırsa ✓.",
    "Kesir çubuklarından 3/4'ü gösterip 'Bu hangi kesir?' diye sorun. Kesri doğru adlandırırsa ✓.",
    "1/4'lük parçalardan '3/4 oluştur' deyin. Birim kesirleri birleştirip kesri kurarsa ✓.",
    "'5/6'yı bu parçalarla yap' deyin. İstenen kesri doğru oluşturursa ✓.",
    "1/4'lük parçayı tekrarlatın: 'Kaç tane 1/4 bir bütün eder?' Birim kesri tekrarlayıp bütünü yaparsa ✓.",
    "'1/4 + 2/4 kaç eder?' (kesir çubuklarıyla). Paydası eşit kesirlerde toplama/çıkarmayı doğru yaparsa ✓.",
    "'1/2'nin 1/3'ü kaçtır?' türü bir işlemi modelletin. Kesir çarpma/bölmesini doğru yaparsa ✓.",
    "Sayı doğrusuna 1/2, 1 ve 3/4'ü yerleştirtin. Kesir ve tam sayıları doğru sıralarsa ✓.",
  ],
  pattern: ['Çocuk boncuk dizerken/ritim tutarken düzenliliğe tepki veriyor mu? (doğal gözlem) Örtük örüntü tepkisi görülürse ✓.', "Renkli bloklarla AB-AB dizin: 'Burada bir örüntü var mı?' Örüntünün varlığını fark ederse ✓.", "AB_AB örüntüsünde boş yeri gösterip 'Buraya ne gelmeli?' diye sorun. Doğru öğeyi koyarsa ✓.", "Bir AB-AB-AB örüntüsü kurun: 'Aynısını yanına sen yap.' Verilen AB örüntüsünü birebir kopyalarsa ✓.", "AABB (veya ABC) örüntüsünü gösterip 'Devam ettir' deyin. Örüntüyü doğru uzatarak sürdürürse ✓.", "ABB-ABB örüntüsünü gösterip 'Tekrar eden en küçük parça hangisi?' ve 'Bunu el-çırp/zıpla olarak yap.' Birimi (ABB) gösterip başka kalıba çevirirse ✓.", '1,2,3,4... gibi sayısal bir örüntüyü uzattırın. Sayısal örüntüyü doğru sürdürürse ✓.', "'2,4,6,8...' örüntüsünün kuralını sorun. Aritmetik kuralı (ikişer artıyor) bulursa ✓.", "'5+3, 3+5 aynı mı?' türü bir eşitlik sorun. İlişki/eşitliği doğru kavrarsa ✓.", "'8+_=10' gibi sembolik eşitliği çözdürün. Sembolik ilişkiyi kullanıp doğru bulursa ✓.", "'4×_=12' gibi çarpımsal ilişkiyi çözdürün. Çarpımsal ilişkiyi doğru kurarsa ✓."],
  shape2d: [
    "Çocuk çevredeki nesnelerde 'aynı/farklı'yı kendiliğinden ayırt ediyor mu? (doğal gözlem) Aynı-farklı sezgisi görülürse ✓.",
    "Aynı şeklin döndürülmüş/farklı boyuttaki eşini buldurun. Özdeş şekli yönelim/boyuttan bağımsız eşlerse ✓.",
    "Şekil bloklarından daire, kare ve üçgeni gösterip adlandırtın (tipik örnekler). Tipik şekilleri doğru tanırsa ✓.",
    "Farklı boyut/yönelimde ve bileşik şekilleri eşleştirin. Çeşitli şekil ve bileşimleri doğru eşlerse ✓.",
    "Atipik (ince/eğik) kare ve üçgenler ile bir daire gösterip adlandırtın. Daire/kare/üçgeni atipik biçimde de tanırsa ✓.",
    "Çubuk parçalarından 'bir üçgene benzeyen şekil yap' deyin. Parçalardan hedefe benzer şekli kurarsa ✓.",
    "Çeşitli (uzun/ince/eğik) dikdörtgenleri gösterip 'Hangileri dikdörtgen?' diye sorun. Tüm dikdörtgenleri tanırsa ✓.",
    "Bir şekli gösterip 'Kenarlarını göster ve say' deyin. Kenarları ayrı nesne olarak tanıyıp sayarsa ✓.",
    "İki şekli özniteliklerine (kenar/köşe) göre karşılaştırtın. Birçok özelliği doğru karşılaştırırsa ✓.",
    "Bir şeklin köşelerini gösterip 'Köşeleri/açıları göster' deyin. Köşeleri ayrı nesne olarak tanırsa ✓.",
    "Altıgen, baklava (eşkenar dörtgen), yamuğu gösterip adlandırtın. Az bilinen şekilleri tanırsa ✓.",
    "Oval, yamuk, sekizgeni karıştırıp adlandırtın; diküçgen/paralelkenarı ayırtın. Çoğu şekli hatasız belirlerse ✓.",
    "Köşe, kavşak, eğim resimlerinde 'Burada açı var mı?' diye sorun. Açıyı farklı bağlamlarda tanırsa ✓.",
    "Bir şekli 'parçalarına göre tarif et' deyin. Şekli bileşenleri (kenar/açı) cinsinden belirlerse ✓.",
    "İki şekli üst üste koydurun: 'Tıpatıp aynı mı?' Üst üste koyarak çakışıklığı (denkliği) bulursa ✓.",
    "Kenar+açı bilgisiyle bir şekli 'tam doğru' kurdurun. Bileşen bilgisine dayanarak şekli tam kurarsa ✓.",
    "Bir açıyı iki ışın/dönme olarak çizdirin. Açıyı doğru temsil ederse ✓.",
    "İki şeklin denkliğini dönüşümle (döndür/yansıt) açıklatın. Çakışıklığı dönüşümle temsil ederse ✓.",
    "'Bütün kareler aynı sınıfa mı girer?' türü bir sınıf üyeliği sorun. Şekil sınıfını doğru belirlerse ✓.",
    "Bir şeklin özelliğini (ör. karşılıklı kenarlar eşit) açıkça söyletin. Özelliği doğru belirlerse ✓.",
    "'Kare bir dikdörtgen midir?' türü özellik-tabanlı hiyerarşi sorun. Özellik sınıfını doğru ilişkilendirirse ✓.",
    "Açının dönme/köşe/eğim anlamlarını birleştirip ölçüsünü tartıştırın. Açı anlamlarını bütünlerse ✓.",
  ],
  comp2d: [
    "Çocuk yapboz parçalarını birleştirmeden tek tek mi kullanıyor? (doğal gözlem) Şekilleri ayrı ayrı kullanırsa bu düzeydedir ✓.",
    "Tangram parçalarını yan yana koydurun. Parçaları dokundurarak birleştirirse ✓.",
    "'Bu parçalarla bir ev/insan resmi yap' deyin. Her parça tek rol alacak şekilde resim kurarsa ✓.",
    "Belirgin çizgili basit bir şekli parçalara ayırtın. Şekli basitçe ayrıştırırsa ✓.",
    "Desen bloklarıyla hedef bir şekli (ör. altıgeni üçgenlerle) doldurtun: 'Ne sığacağını biliyor musun?' Öngörüyle hedefi parçalardan oluşturursa ✓.",
    "Bir şekil grubunu başka bir şekille değiştirtin (ör. 2 üçgen = 1 kare). Yerine koyarak oluşturursa ✓.",
    "İpucu/destekle bir bileşik şekli ayrıştırtın. Yardımla doğru ayrıştırırsa ✓.",
    "Bir bileşik birimi (şekillerden yapılma şekil) tekrarlatın. Bileşik şekli birim olarak tekrarlarsa ✓.",
    "Model olmadan 'bu şekli zihninde parçalara ayır' deyin. Zihinde esnek ayrıştırırsa ✓.",
    "Birim-üstü birimlerle (şekillerden yapılma şekillerle) döşeme/desen kurdurun. Birimlerin birimleriyle oluşturursa ✓.",
    "Karmaşık bir döşemeyi birim-üstü birimlere ayrıştırtın. Birimlerin birimleriyle ayrıştırırsa ✓.",
  ],
  disembed: [
    "Çocuk kalabalık bir resimde tek bir şekli henüz ayıramıyor, bütünü mü görüyor? (doğal gözlem) Yalnızca bütünü algılarsa bu düzeydedir ✓.",
    "Üst üste binen iki şekil gösterin: 'Şekilleri göster.' Örtüşen şekilleri ayırt ederse ✓ (tam gömülüyü henüz ayıramaz).",
    "Kare içine çizilmiş bir daireyi (iç içe) gösterin: 'Gizli şekli bul.' Basit gömülü şekli ayırırsa ✓.",
    "Daha karmaşık, çakışmayan gömülü bir yapıyı buldurun. İkincil gömülü yapıyı ayırırsa ✓.",
    "Çok katmanlı karmaşık bir figürde tüm gizli şekilleri buldurun. Tüm gömülü şekilleri ayırırsa ✓.",
  ],
  shape3d: ['Çocuk kutu/top/koni nesneleri kavrayıp döndürerek inceliyor mu? (doğal gözlem) 3B nesneleri sezgisel algılarsa ✓.', "Bir küp ve bir top gösterip 'Topu/küpü göster' deyin. Tipik 3B örnekleri (küre, küp) tanırsa ✓.", "Katı modelleri gösterip 'Bu silindir/koni/prizma mı?' diye sorun. 3B şekilleri (yüzeylerini 2B tanıyarak) tanırsa ✓.", "Çocuğa bir küp verin: 'Bu cismin kaç yüzü var?' Yüzleri tek tek, tekrar saymadan sayıp 6 derse ✓.", 'Bir katıyı verip özniteliklerini (yüz/kenar/köşe sayısı) söyletin. 3B şekli özellikleriyle belirlerse ✓.', 'Birkaç katıyı özelliklerine göre gruplatın. 3B sınıfları doğru belirlerse ✓.'],
  comp3d: [
    "Çocuk küp blokları birleştirmeden tek tek mi kullanıyor? (doğal gözlem) Blokları ayrı ayrı kullanırsa bu düzeydedir ✓.",
    "Blokları üst üste koydurun. 'Üstüne' ilişkisiyle blok istiflerse ✓.",
    "Blokları bir sıra/dizi hâlinde yan yana dizdirin. 'Yanına' ilişkisiyle sıra yaparsa ✓.",
    "Aynı bloklardan bir kule istifletin. Eş blokları üst üste istiflerse ✓.",
    "Birkaç bloğu birleştirip basit bir yapı (zemin/duvar) kurdurun. 3B parçaları birleştirirse ✓.",
    "Bloklarla kemer/köşe/kapalı alan içeren bir yapı kurdurun. Çoklu ilişkiyle yapı/resim oluşturursa ✓.",
    "'Şu modeldeki kuleyi/köprüyü yap' deyin. Öngörüyle hedef 3B şekli oluşturursa ✓.",
    "Bir blok grubunu eş bir bütünle değiştirip yapıyı tekrarlatın. Yerine koyup tekrarlarsa ✓.",
    "Çok katlı, birim-üstü birimlerden karmaşık bir yapı kurdurun. Birimlerin birimleriyle oluşturursa ✓.",
  ],
  spviz: [
    "Çocuk bir parçayı yerine sokmak için kendiliğinden çeviriyor/kaydırıyor mu? (doğal gözlem) Nesneleri sezgisel hareket ettirirse ✓.",
    "Bir parçayı boşluğa fiziksel deneme-yanılmayla yerleştirtin. Somut kaydırma/yansıtma/döndürme yaparsa ✓.",
    "Kolay bir boşluğa parçayı 'çevirip yerleştir' deyin. Basit kaydırma/döndürmeyi doğru yaparsa ✓.",
    "Yansıtma gerektiren bir yerleştirme verin. Üç dönüşümü başlangıç düzeyinde (deneme-yanılmayla) yaparsa ✓.",
    "90°/180° döndürme-yansıtma gerektiren yerleştirme verin. Üç dönüşümü zihinsel imgeyle güvenle yaparsa ✓.",
    "Çapraz (45°) kaydırma/yansıtma gerektiren görev verin. Çapraz hareketleri doğru yaparsa ✓.",
    "'Bu parçayı çevirsen neye benzer?' diye dönüşüm sonucunu zihinde kestirtin. Sonucu yalnızca zihinde doğru öngörürse ✓.",
  ],
  sporient: [
    "Çocuk tanıdık bir yerde (oyun alanı) konumu sezgisel kestiriyor mu? (doğal gözlem) Konumu sezgisel bulursa ✓.",
    "Gittiği kısa bir yolu geri izletin. Yürüdüğü yolu (yön/mesafe) bütünleştirip tekrarlarsa ✓.",
    "Bir oyuncağın saklandığı yeri buldurun. Yer imlerine göre konumu öğrenip bulursa ✓.",
    "'Senin sağında/önünde ne var?' diye sorun. Kendine göre (benlik çerçevesi) yön bulursa ✓.",
    "Küçük bir masa-ızgarada bir nesneyi yer imine göre buldurun (hedef önceden söylenmeden). Küçük yerel çerçevede konumu bulursa ✓.",
    "Hareket sonrası odanın düzenini koruyarak bir yeri buldurun. Yerel çerçeveyi kullanırsa ✓.",
    "Resimli basit bir haritayla sınıfta bir nesneyi buldurun. Haritayı kullanıp iki ipucunu birleştirirse ✓.",
    "Izgarada bir noktayı koordinatla (2. sütun, 3. sıra) işaretletin. Koordinatları doğru çizerse ✓.",
    "Bir rota haritasını izleyip hedefe gittirin. Rotayı haritada doğru izlerse ✓.",
    "Dönüştürülmüş/döndürülmüş bir harita ile yön buldurun. Soyut çerçeveyi (gözlemci+yer imi) kullanırsa ✓.",
  ],
  mlen: [
    "Çocuk iki nesnenin boyunu kendiliğinden kıyaslıyor mu? (doğal gözlem) Uzunluğu sezgisel fark ederse ✓.",
    "'Hangisi uzun?' diye iki çubuk gösterin. Uzunluğu bir nicelik olarak adlandırır/tanırsa ✓.",
    "İki kalemi uçlarını hizalayıp karşılaştırtın. Doğrudan hizalayıp uzunu bulursa ✓.",
    "Birbirine değmeyen iki nesneyi üçüncü bir çubuk/ip ile karşılaştırtın. Aracı nesneyle dolaylı karşılaştırırsa ✓.",
    "İşaretli 5 çubuğu kısadan uzuna sıralatın. 5 nesneyi uzunluğa göre sıralarsa ✓.",
    "Bir kalemin boyunu ataçları uç uca dizerek ölçtürün. Birimleri boşluksuz uç uca dizip sayarsa ✓ (üst üste binerse ✗).",
    "İşaretli 6+ çubuğu sıralatın. 6 ve üzeri nesneyi uzunluğa göre sıralarsa ✓.",
    "Tek bir birim çubuğu tekrarlayarak (kaydırarak) bir masayı ölçtürün. Birimi eşit aralıklarla tekrarlayıp sayarsa ✓.",
    "Cetvelle bir kalemin boyunu ölçtürün. Cetvelin SIFIR noktasından başlatıp doğru cm'yi söylerse ✓ (1'den başlatırsa ✗).",
    "Cetveli görmeden 'bu kalem kaç cm?' diye kestirip sonra ölçtürün. Cetveli zihinde kavramsal kullanıp isabetli ölçerse ✓.",
    "Bükük bir yolun/çevrenin uzunluğunu ölçtürün. Yolu parçalarının toplamı olarak ölçerse ✓.",
    "Standart olmayan/soyut birimlerle bir uzunluğu ölçtürüp birim dönüştürün. Soyut birimlerle doğru ölçerse ✓.",
  ],
  marea: [
    "Çocuk bir yüzeyin 'büyüklüğünü' sezgisel fark ediyor mu? (doğal gözlem) Alanı sezgisel ayırt ederse ✓.",
    "İki farklı yüzeyi gösterip 'Hangisi daha geniş?' diye sorun. Alanı bir nicelik olarak tanırsa ✓.",
    "Bir dikdörtgeni birim karelerle kaplatın. Yüzeyi karelerle kaplayıp sayarsa ✓ (boşluk/örtüşme olabilir).",
    "Bir dikdörtgeni birim karelerle boşluksuz/örtüşmesiz kaplatın. Tam (boşluksuz) kaplayıp doğru sayarsa ✓.",
    "Tek bir kareyi tekrarlayarak alanı ölçtürün. Birimi tekrarlayıp alanları sayarak karşılaştırırsa ✓.",
    "Kaplı bir dikdörtgende 'bir sırada kaç kare var?' diye sorun. Satır/sütun yapısını sezerse ✓.",
    "3×4 dizilimde 'her sırada 4 kare, 3 sıra; toplam kaç?' diye satır-sütunla saydırın. Satır-sütun yapısını kurup çözerse ✓.",
    "Yalnızca satır/sütun sayısından (çizmeden) alanı bulundurun. Diziyi çarpımsal yapılandırırsa ✓.",
  ],
  mvol: [
    "Çocuk bir kabın 'ne kadar aldığını' sezgisel fark ediyor mu? (doğal gözlem) Hacmi sezgisel ayırt ederse ✓.",
    "İki kaptan 'hangisi daha çok alır?' diye sorun. Hacmi/kapasiteyi bir nicelik olarak tanırsa ✓.",
    "Küçük bir kapla büyük kabı doldurtun veya küpleri kutuya yerleştirtin. Kabı birimlerle doldurur/paketlerse ✓.",
    "'Bu kutuya kaç küp sığar?' diye saydırın; yarı dolu olduğunu fark ettirin. Doldurmayı niceleyip üç boyutu tanırsa ✓.",
    "Tek bir birim kapla tekrarlayarak bir kabı ölçtürün. Birimi tekrarlayıp doğru sayarsa ✓.",
    "Bir kutuda 'bir katmanda kaç küp var?' diye sorun. Katman/dizi yapısını sezerse ✓.",
    "Kutuyu 'her katta 6 küp, 3 kat; toplam kaç?' diye katmanla saydırın (gizli küpler dahil). 3B satır-sütun-katman yapısını kurarsa ✓.",
    "Yalnızca boyut sayılarından (çizmeden) hacmi bulundurun. 3B diziyi çarpımsal yapılandırırsa ✓.",
  ],
  mang: [
    "Çocuk kapı/makas açılırken açının değiştiğini fark ediyor mu? (doğal gözlem) Açı/dönüşü sezgisel ayırt ederse ✓.",
    "Bloklarla/çubuklarla bir köşe (açı) oluşturtun. Açıyı sezgisel kurarsa ✓.",
    "Yapı/yapboz görevinde paralel/dik kenarları kullandırın. Açıyı örtük olarak (diklik/paralellik) kullanırsa ✓.",
    "İki açı modeli verip 'Bunlar aynı açıda mı?' diye eşletirin. Açıları doğru eşlerse ✓ (kenar uzunluğuna aldanmazsa).",
    "Farklı kenar uzunluklu iki açıyı 'hangisi daha geniş?' diye karşılaştırtın. Açı büyüklüğünü kenardan ayırıp karşılaştırırsa ✓.",
    "Gönye/açıölçerle bir açıyı ölçtürün. Açıyı birimle (derece) doğru ölçerse ✓.",
  ],
  classif: [
    "Çocuk nesneler arasındaki benzerliği kendiliğinden fark ediyor mu? (doğal gözlem) Benzerliği sezgisel ayırt ederse ✓.",
    "Karışık nesneleri 'benzeyenleri bir araya koy' deyin. Benzer/farklı kümeler yaparsa ✓ (ölçüt değişebilir).",
    "'Bunları renklerine göre ayır' deyin. Tek bir özelliğe göre sınıflarsa ✓.",
    "'Hepsi kırmızı olanları bul' gibi verilen bir özelliğe göre gruplatın. Benzer özelliğe göre tutarlı sınıflarsa ✓.",
    "Sıralarken 'şimdi de şekline göre ayır' deyip ölçüt değiştirtin. Ölçütü esnek değiştirerek sınıflarsa ✓.",
    "Hazır bir nesne grubunu/grafiği gösterip 'En çok hangisinden var?' diye sorun. Tek veri durumunu okursa ✓.",
    "Nesneleri sınıflandırıp her gruptaki sayıyı söyletin. Veriyi sınıflandırırsa ✓.",
    "'Hem kırmızı hem yuvarlak olanları bul' deyin. Birden çok özelliğe göre (ardışık) sınıflarsa ✓.",
    "Sınıftan veri toplatıp (ör. en sevilen renk) çetele tutturun. Veriyi toplayıp özetlerse ✓.",
    "'Bütün kareler dikdörtgen midir?' türü kapsama (sınıf-içinde-sınıf) sorun. Hiyerarşik sınıflarsa ✓.",
    "Topladığı veriyi sütun/resim grafiğine döktürün. Veriyi grafikle doğru temsil ederse ✓.",
  ],
}

// ── EXT müdahale eşlemeleri — özellikle darboğaz düzeylerinde gerçek uygulamalar
// { key: [ [{k,a}]|null, ... ] } — düzey sırasıyla; null/eksikse genel ADIM yedeği.
export const EXT_IV = {
  compose: [
    null, null, null,
    [{ k: 'DokunSay', a: 'İki renkli pullarla 4 ve 5 bileşim/ayrışım' }, { k: 'ABMATO', a: 'Parça-bütün kutularıyla yapılandırılmış bileşim' }, { k: 'ADIM', a: '4-5 oluşturma etkinliği' }],
    null,
    [{ k: 'DokunSay', a: 'Onluk-çerçeveyle 10 ikili ayrışımları' }, { k: 'GalakSay', a: '10 dostları hız oyunu' }, { k: 'ADIM', a: "10'a tamamlama etkinliği" }],
    null,
    [{ k: 'DokunSay', a: 'Onluk demet + birlik pullarla 11-19 kurma' }, { k: 'ABMATO', a: 'Basamak değeri köprüsü (onluk-birlik) çalışması' }, { k: 'ADIM', a: 'Onluk ve birlikle oluşturma' }],
    null, null, null,
  ],
  multdiv: [
    null, null, null,
    [{ k: 'DokunSay', a: 'Gruplama tepsileriyle eşit grup kurup sayma' }, { k: 'ABMATO', a: 'Dizi (array) kartlarıyla çarpma modelleme' }, { k: 'ADIM', a: 'Somut çarpma/bölme modelleme' }],
    [{ k: 'GalakSay', a: 'Ritmik sayma (2-5-10) hız oyunu' }, { k: 'DokunSay', a: 'Sayı doğrusunda atlamalı sayma' }, { k: 'ADIM', a: 'Ritmik sayarak çarpma' }],
    null, null, null, null,
  ],
  frac: [
    null,
    [{ k: 'DokunSay', a: 'Kâğıt/hamuru katlayarak eşit parçalara bölme' }, { k: 'ABMATO', a: 'Kesir çubuklarıyla eş-parçalama' }, { k: 'ADIM', a: 'Şekil eş-parçalama etkinliği' }],
    null,
    [{ k: 'DokunSay', a: 'Kesir daireleriyle 1/n birim kesir oluşturma' }, { k: 'ABMATO', a: 'Birim kesir kartı eşleme' }, { k: 'ADIM', a: 'Birim kesir tanıma etkinliği' }],
    null, null, null, null, null, null, null,
  ],
  pattern: [null, null, null, [{ k: 'DokunSay', a: 'Renkli bloklarla AB örüntü birebir kopyalama' }, { k: 'ABMATO', a: 'Örüntü şeridi eşleme çalışması' }, { k: 'ADIM', a: 'AB örüntü kopyalama etkinliği' }], null, [{ k: 'ADIM', a: 'Örüntü birimini bulup başka kalıba çevirme (el-çırp/zıpla)' }, { k: 'DokunSay', a: 'Örüntü birimini renkli bloklarla işaretleyip çevirme' }, { k: 'GalakSay', a: 'Örüntü birimi tanıma oyunu' }], null, null, null, null, null],
  shape2d: [
    null, null, null, null,
    [{ k: 'ADIM', a: 'Daire/kare/üçgeni atipik örneklerle tanıma etkinliği' }, { k: 'DokunSay', a: 'Şekil bloklarını dokunarak ayırt etme/eşleme' }, { k: 'GalakSay', a: 'Şekil tanıma hız oyunu' }],
    null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null,
  ],
  comp2d: [
    null, null, null, null,
    [{ k: 'ADIM', a: 'Desen bloklarıyla hedef şekli öngörüyle oluşturma' }, { k: 'DokunSay', a: 'Tangramla hedef şekli parçalardan kurma' }, { k: 'ABMATO', a: 'Şekil oluşturma kartları' }],
    null, null, null, null, null, null,
  ],
  disembed: [
    null, null,
    [{ k: 'ADIM', a: 'Saydam katmanlarla gömülü şekli ayırma etkinliği' }, { k: 'DokunSay', a: 'İç içe şekilleri parmakla izleyip ayırma' }],
    null, null,
  ],
  shape3d: [null, null, [{ k: 'ADIM', a: 'Katı modelleri adlandırma/sınıflama etkinliği' }, { k: 'DokunSay', a: 'Katı cisimleri dokunarak tanıma (silindir/koni/prizma)' }], [{ k: 'ADIM', a: 'Yüz–katı ilişkisi: küpün yüzlerini sayma etkinliği' }, { k: 'DokunSay', a: 'Katı cismin yüzlerini parmakla işaretleyip sayma' }], null, null],
  comp3d: [
    null, null, null, null, null, null,
    [{ k: 'ADIM', a: 'Küp bloklarla modeldeki 3B yapıyı öngörüyle kurma' }, { k: 'DokunSay', a: 'Küp bloklarla hedef yapıyı eşleyerek inşa' }],
    null, null,
  ],
  spviz: [
    null, null,
    [{ k: 'ADIM', a: 'Parçayı kaydırıp döndürerek boşluğa yerleştirme etkinliği' }, { k: 'DokunSay', a: 'Döndürülebilir parçaları elle çevirip yerleştirme' }],
    null, null, null, null,
  ],
  sporient: [
    null, null, null, null,
    [{ k: 'ADIM', a: 'Masa-ızgarada yer imine göre nesne bulma etkinliği' }, { k: 'DokunSay', a: 'Izgara üzerinde konumu elle izleyip bulma' }],
    null, null, null, null, null,
  ],
  mlen: [
    null, null, null,
    [{ k: 'ADIM', a: 'Üçüncü nesneyle (ip/çubuk) dolaylı uzunluk karşılaştırma' }, { k: 'DokunSay', a: 'Aracı çubukla iki nesneyi karşılaştırma' }],
    null,
    [{ k: 'ADIM', a: 'Birim çubukları boşluksuz uç uca dizip ölçme etkinliği' }, { k: 'DokunSay', a: 'Ataçları uç uca dizerek uzunluk ölçme' }, { k: 'ABMATO', a: 'Birim çubuk ölçme şeridi' }],
    null, null, null, null, null, null,
  ],
  marea: [
    null, null, null,
    [{ k: 'ADIM', a: 'Birim karelerle yüzeyi boşluksuz kaplama etkinliği' }, { k: 'DokunSay', a: 'Birim kareleri örtüşmeden döşeyip sayma' }],
    null, null,
    [{ k: 'ADIM', a: 'Satır-sütun yapısıyla alanı yapılandırma etkinliği' }, { k: 'DokunSay', a: 'Kareleri sıra-sütun düzeninde dizip sayma' }, { k: 'ABMATO', a: 'Dizi (array) alan kartları' }],
    null,
  ],
  mvol: [
    null, null, null,
    [{ k: 'ADIM', a: 'Kutuya küp paketleyip sayma; yarı-dolu farkındalığı etkinliği' }, { k: 'DokunSay', a: 'Küpleri kaba yerleştirip doldurmayı niceleme' }],
    null, null,
    [{ k: 'ADIM', a: 'Katman-satır-sütun yapısıyla hacmi yapılandırma etkinliği' }, { k: 'DokunSay', a: 'Küpleri katman katman dizip sayma' }, { k: 'ABMATO', a: '3B dizi hacim kartları' }],
    null,
  ],
  mang: [
    null, null, null,
    [{ k: 'ADIM', a: 'Açı modellerini üst üste koyup eşleme etkinliği' }, { k: 'DokunSay', a: 'Açı kollarını elle açıp eş açıyı bulma' }],
    null, null,
  ],
  classif: [
    null, null, null,
    [{ k: 'ADIM', a: 'Verilen tek özelliğe göre tutarlı sınıflama etkinliği' }, { k: 'DokunSay', a: 'Sınıflama halkalarıyla özelliğe göre gruplama' }, { k: 'ABMATO', a: 'Özellik kartlarıyla sınıflama' }],
    null, null, null, null, null, null, null,
  ],
}

// ── EXT'i tam yapıya dönüştür ─────────────────────────────────────────────
// Yaş bantları: EXT_BANDS[key] varsa düzey-bazlı kanonik; yoksa start–end eşit-bölme.
function buildDomains() {
  const domains = CORE.map((d) => ({
    ...d,
    strand: STRAND_OF[d.key],
    levels: d.levels.map((l) => ({
      ...l,
      mid: (l.lo + l.hi) / 2,
      iv: l.iv || [{ k: 'ADIM', a: 'İlgili düzey etkinliği' }],
    })),
  }))
  EXT.forEach((e) => {
    const n = e.L.length
    const bands = EXT_BANDS[e.key]
    const tasks = EXT_TASKS[e.key]
    const ivs = EXT_IV[e.key]
    const levels = e.L.map((row, i) => {
      const band = bands && bands[i]
      const lo = band ? band[0] : Math.round(e.start + ((e.end - e.start) * i) / n)
      const hi = band ? band[1] : Math.round(e.start + ((e.end - e.start) * (i + 1)) / n)
      return {
        n: row[0], d: row[1], b: row[2] || 0,
        lo, hi, mid: (lo + hi) / 2, q: 0,
        task: (tasks && tasks[i]) || '',
        iv: (ivs && ivs[i]) || [{ k: 'ADIM', a: 'İlgili düzey için ADIM etkinliği' }],
      }
    })
    domains.push({
      key: e.key, name: e.name, ltName: e.ltName, gloss: '', weight: e.weight, strand: STRAND_OF[e.key],
      glyphType: e.glyphType, itemType: 'obs', ctx: e.ctx, manip: e.manip, levels,
    })
  })
  return domains
}

export const DOMAINS = buildDomains()

// ── Yardımcı sabitler ─────────────────────────────────────────────────────
export const WEIGHTS = ['çekirdek', 'tamamlayıcı', 'profil']
export const WSHORT = { 'çekirdek': 'ÇEKİRDEK', 'tamamlayıcı': 'TAMAML.', 'profil': 'PROFİL' }
export const M_MAX = 144 // yaş ekseni üst sınırı (ay) = 12 yıl

export const getDomain = (key) => DOMAINS.find((d) => d.key === key)
export const coreDomains = () => DOMAINS.filter((d) => d.weight === 'çekirdek')
export const totalLevels = () => DOMAINS.reduce((a, d) => a + d.levels.length, 0)
