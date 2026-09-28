# 04 — Sözel Problem Çözme Aracı: Türkiye Müfredatı ve Bağlam Uyumu

> Hazırlanma: 2026-09-27. Dil: Türkçe. Uydurma yok; her iddianın kaynağı yanında. Emin olunamayanlar **[doğrulanamadı]** ile işaretli. Öneriler **[öneri]** etiketli (resmî metin değil, uzman önerisi).

## Kaynak anahtarı (bu belgede kısaltmalar)

| Kısaltma | Kaynak | Erişim biçimi |
|---|---|---|
| **TYMM-İ** | MEB (2024). *Türkiye Yüzyılı Maarif Modeli — İlkokul Matematik Dersi Öğretim Programı (1, 2, 3 ve 4. Sınıflar)*. Resmî URL: `https://tymm.meb.gov.tr/upload/program/2024programmat1234Onayli.pdf` (sunucu otomatik isteğe HTTP 500 veriyor; aynı belge meb.k12.tr aynasından alınmış). | Yerel tam metin: `C:\Users\yilma\Desktop\Diskalkuli\abmato\research\tymm_raw.txt` + yapılandırılmış 111 çıktı: `...\abmato\research\tymm_ilkokul_structured.json` |
| **TYMM-S** | MEB 2024 İlkokul Matematik programı **tanıtım sunumu** (değişiklik özeti). | Yerel: `C:\Users\yilma\Desktop\Diskalkuli\_arastirma\yakalamalar\MEB-2024-Maarif-Ilkokul-Matematik-1-4.txt` |
| **TYMM-MAB** | `https://tymm.meb.gov.tr/beceriler/matematik-alan-becerileri` (MAB tanımları ve süreç bileşenleri) | WebFetch ile okundu (2026-09-27) |
| **TYMM-O5** | `https://tymm.meb.gov.tr/ortaokul-matematik-dersi/unite/447`, `/448`, `/449`, `/450`, `/451`, `/452`, `/455` (5. sınıf temaları) | WebFetch ile okundu; `/453` HTTP 500 verdi |
| **ÖÖG-DEP** | MEB ÖERGM, *Öğrenme Güçlüğü Olan Bireyler İçin Destek Eğitim Programı* (dosya adına göre 2025). Erken Matematik + Matematik modülleri, Düzey 1–4. | Yerel tam metin: `...\_arastirma\yakalamalar\MEB-2025-Ogrenme-Guclugu-Destek-Egitim-Programi.txt` (resmî indirme URL'si yerel kayıtta yok → **[URL doğrulanamadı]**) |
| **FerMat** | Mutlu, Y. *FerMat — Ferhenga Matematîkê ya Berfireh* (394 terim) | Yerel: `C:\Users\yilma\Desktop\Diskalkuli\dokunsay\_platform\shared\FERMAT.ku.md`, `fermat-terms.ku.js` |
| **GS-WP** | Galaksay mevcut sözel problem modülü çıkarımı | `...\scratchpad\problem-tool\01_galaksay_wp.md`, `Galaksay\src\data\wordProblemTemplates.js` |

---

## (A) Sınıf × öğrenme çıktısı tablosu

**Önemli yapısal gerçekler (TYMM-İ):**
- 2024 programında "kazanım" yerine **"öğrenme çıktısı"** terimi kullanılır; kodlama `MAT.<sınıf>.<tema>.<sıra>` (ör. MAT.2.2.1). İlkokulda her sınıfta 4 tema: (1) Sayılar ve Nicelikler, (2) İşlemlerden Cebirsel Düşünmeye, (3) Nesnelerin Geometrisi, (4) Veriye Dayalı Araştırma (4. sınıfta "Olayların Olasılığı ve Veriye Dayalı Araştırma"). 1–4. sınıflarda toplam 111 çıktı.
- **Ölçme problemleri ayrı değil:** "Ölçme öğrenme alanında yer alan problemler kaldırılarak dört işlem süreçlerinde problem çözme süreci içerisindeki öğrenme-öğretme uygulamalarına yansıtılmıştır" (TYMM-S). Yani para/zaman/uzunluk/kütle/sıvı problemleri **İşlemlerden Cebirsel Düşünmeye** temasındaki problem çıktılarının (MAT.2.2.1, 3.2.6-7, 4.2.7-8) bağlamı olarak verilir.
- **1. sınıfta açıkça "problem çözebilme" başlıklı çıktı YOKTUR.** Tema metni: "tek işlemli problem durumunu toplama ve çıkarma işlemi ile çözümleyebilme amaçlanmaktadır" (TYMM-İ, 1.5.2.1). Resmî ilk "problem çözebilme" çıktısı **MAT.2.2.1**.
- **Problem kurma** ayrı bir alan becerisi değildir; "problem çözme becerisinin **yansıtma** bileşeni altında" yer alır (TYMM-İ, 1.5.1). Resmî "problem durumlarını yapılandırabilme" (= problem kurma) çıktıları **3. ve 4. sınıfta** (MAT.3.2.7, MAT.4.2.8). 2. sınıfta öğrenme kanıtı/performans görevi ve farklılaştırma düzeyinde geçer.
- Program sırası: **TAHMİN → ZİHİNDEN İŞLEM → PROSEDÜR** (TYMM-S "Özet"); tahmin dört işlem bağlamında 4 sınıfta da vardır.

### A.1 İlkokul (zorunlu kapsam)

| Kod | Çıktı (resmî başlık özeti) | Problemle ilgili süreç bileşenleri / sınırlar (TYMM-İ) | Araçta karşılığı [öneri] |
|---|---|---|---|
| MAT.1.1.2 | Nesne grubunu sayarken parçalar arası ilişkileri çözümleyebilme | a) parçaları belirler, b) parçalar arası ilişkileri belirler | Parça-parça-bütün (PPW) şemasının ön-becerisi; "Birleştir/Ayır" sezgisi |
| MAT.1.1.4 | İki niceliği "çok, daha çok, az, daha az, eşit" terimleriyle karşılaştırabilme | Karşılaştırma dili | **Karşılaştırma** şemasının dilsel temeli (fark sayısal değil, sözel) |
| MAT.1.1.9 | Paraların (1, 5, 10, 20, 50, 100, 200 TL) büyüklüklerini tanıyabilme | 1. sınıfta kuruş yok (TYMM-S) | 1. sınıf para bağlamı yalnız TL banknot ve tanıma düzeyinde; **para ile hesap problemi 1. sınıfta [doğrulanamadı]** → 2. sınıftan başlat |
| **MAT.1.2.1** | Günlük yaşamın içerdiği toplama ve çıkarma işlemlerini çözümleyebilme | a) Günlük yaşam durumunun hangi işlemi gerektirdiğini **fark eder**; b) durum ↔ toplama/çıkarma ilişkilendirir. Sınır: "20'den küçük ve toplamları 20'ye kadar (20 dâhil)", **eldesiz**, **iki sayı ile sınırlı**; çıkarma: 20'ye kadar bir çokluktan eksiltme, onluk bozmasız. Artma→toplama, azalma→çıkarma. | 1. sınıf tüm "ekle/ayır/birleştir/karşılaştır" (sonuç bilinmeyen) türleri. GS-WP'de doğru kodlanmış |
| MAT.1.2.2 | Toplama-çıkarma sonuçlarını tahmin ve zihinden işlemle muhakeme edebilme | Öğrenme-öğretme: "öğrenciyi bir problem (bir işlem gerektiren) ile karşı karşıya bırakacak" etkinlikler; 10'a tamamlama, büyük sayıdan sayma | **Tahmin adımı** (sonuç önce tahmin edilir) |
| MAT.1.2.3 | Eşit işaretinin anlamını toplama-çıkarma bağlamında yorumlayabilme | Terazi/tahterevalli, denge | Karşılaştırma ve **eşitleme** problemleri; GS-WP'de PPW'ye bu kod verilmiş — **zayıf eşleşme**, MAT.1.2.1 + MAT.1.1.2 önerilir |
| MAT.1.2.4 | Toplama ve çıkarma işlemlerinin ilişkisini yorumlayabilme | b) "tersine dönüştürür" | **Başlangıç/değişim bilinmeyen** türlerin (ters işlem) gerekçesi; GS-WP'de karşılaştırmaya verilmiş — başlangıç-bilinmeyene daha uygun |
| MAT.2.1.7 | Bütün, yarım ve çeyrek ilişkisini çözümleyebilme | Kesire giriş; problem çıktısı değil | 2. sınıfta "yarısı" bağlamı yalnız görsel/somut; kesir problemi yok |
| MAT.2.1.8 | Paraları değerlerine göre ilişkilendirerek çözümleyebilme | b) Kuruş–TL ilişkisi. Farklılaştırma: "paralar ile ilgili dört işlem problemleri verilip çözmeleri istenir, ardından öğrencilerden **problem kurmaları** istenir" | Para bağlamı (TL, 25/50 kuruş) 2. sınıftan |
| MAT.2.1.9 | Zaman ölçü birimlerini okuyabilme ve yazabilme | Tam, yarım, çeyrek saat (TYMM-İ öğrenme-öğretme) | Süre problemleri (saat, gün, hafta) |
| MAT.2.1.11 | Standart uzunluk ve kütle birimleriyle tahmin | Tahmin–ölçüm karşılaştırma | Uzunluk (m, cm) ve kütle (kg) bağlamı |
| **MAT.2.2.1** | **Toplama ve çıkarma işlemleri gerektiren günlük yaşam problemlerini çözebilme** | a) Problemi anlayarak **verilen ve istenilenleri** belirler; b) verilen–istenen ile işlemler arasındaki ilişkiyi belirler; c) verilenleri **uygun matematiksel temsillere** dönüştürür; ç) temsile dönüştürdüğü problemi **kendi ifadeleriyle** açıklar; d) sonuca ilişkin **tahminde** bulunarak strateji geliştirir; e) stratejiyi uygular; f) çözüm yollarını **kontrol ederek** çözüme ulaştırmayan stratejiyi değiştirir; g) kısa yolları değerlendirir; ğ) stratejiyi hangi problemlere uygulanabileceğine **genelleştirir**; h) genellemeyi örneklerle değerlendirir. **Sınır: "En çok iki işlemli problemlerle çalışılır."** Toplamlar 100'ü geçmez, 2–3 toplanan; çıkarmada 100'e kadar, onluk bozma. Bağlamlar: **paralar, zaman, uzunluk, tartma**; deste–düzine örneklerde kullanılır. Öğrenme kanıtı: izleme testleri "problem çözme adımlarındaki eksik yönleri ortaya çıkarır". | Aracın **çekirdek çıktısı**. a–h bileşenleri adım adlandırmasının resmî dayanağı (bkz. B). İki adımlı (+/−) problemler 2. sınıfta açılır |
| MAT.2.2.4 | Çarpma ve bölmeyi toplama-çıkarmaya dayalı çözümleyebilme | Çarpma: 10'a kadar sayılar × 1–5 (5'e kadar çarpım tablosu); bölme: 20'ye kadar sayılar ÷ 2, 3, 4, 5 **kalansız** | Eşit gruplar (çarpım bilinmeyen), paylaştırma ve gruplama bölmesi |
| MAT.2.2.5 | Çarpma-bölme sonuçlarını muhakeme edebilme | "günlük yaşamda karşılaşabileceği **tek işlem** gerektiren problemlerden yola çıkılarak" | ×/÷ problemleri 2. sınıfta **tek işlemli** |
| MAT.2.2.6 | Dört işlem bağlamında eşitliğin farklı anlamları | — | Eşitleme şeması |
| MAT.2.3.5 | Standart olmayan araçlarla sıvı miktarı tahmini | 2. sınıf; litre yok | Sıvı problemi 2. sınıfta yalnız "bardak/kova" birimiyle |
| MAT.3.1.10–11 | Birim kesir; pay–payda ilişkisi | Problem çıktısı değil | 3. sınıfta kesir problemi yok |
| MAT.3.1.13 | Zaman ölçü birimlerini çözümleyebilme | yıl, ay, hafta, gün, saat, dakika, saniye ilişkileri | Süre/dönüşüm bağlamı |
| MAT.3.1.15 | Uzunluk ve kütle birimlerini kendi içinde çözümleyebilme | cm–m–km, g–kg–ton (ton ve km dönüşümü hariç) | Ölçü bağlamlı problemler |
| MAT.3.1.16 | Madenî ve kâğıt paraları ilişkilendirerek yorumlayabilme | 100 kuruş = 1 TL | Para üstü, para bozma |
| MAT.3.2.5 | Dört işlem gerektiren durumlar için yönergeleri takip ederek yorumlayabilme | Yönergeler **en çok 5 adım** | Çok adımlı problemin adım adım izlenmesi (algoritma) |
| **MAT.3.2.6** | **Dört işlem gerektiren günlük yaşam problemlerini çözebilme** | a–h bileşenleri MAT.2.2.1 ile **aynı**. Sınır: "toplama ve çıkarma gerektiren problemlerde **üç işlemli**, çarpma ve bölme gerektiren problemlerde **en çok iki işlemli**"; ayrıca "diğer öğrencilerin problemi kendi cümleleriyle ifade etmeleri" | 3. sınıf çok adımlı problemler; karşılaştırmalı çarpma ("kat") |
| **MAT.3.2.7** | **Dört işlem gerektiren problem durumlarını yapılandırabilme** (= problem kurma) | a) hiyerarşik, nedensel ya da mantıksal ilişkiler ortaya koyar; b) deneyimlerine dayalı **bir problem oluşturur**. Bağlamlar: paralar, zaman, uzunluk, tartma. Kontrol listesiyle değerlendirilir | **Problem Kur** modu (resmî ilk sınıf: 3) |
| MAT.3.2.8 | Dört işlemde eşitliğin farklı anlamları | Anahtar kavram: **kat** | "…'in 3 katı" dili 3. sınıfta resmî |
| MAT.3.3.4 / 3.3.5 | Çevre uzunluğu tahmini / litre ile sıvı tahmini | litre, yarım litre | Sıvı (L) bağlamı 3. sınıftan |
| MAT.4.1.10 | Çokluğun basit kesir kadarını ve kesir kadarı verilen çokluğun tamamını çözümleyebilme | "Çokluğu belirtilen sayı **en çok üç basamaklı** olmalıdır. Sayılar ile kesrin çarpma ve bölme işlemlerine girilmez." | "24 cevizin 1/4'ü" türü **kesir–çokluk** problemleri (model/şema ile, işlem kuralı olmadan) |
| MAT.4.1.11 | Paydaları eşit kesirlerle toplama-çıkarmayı yapılandırabilme | Alan ve uzunluk modelleri, sayı doğrusu | Kesir çubuğu temsili |
| **MAT.4.1.12** | **Paydaları eşit kesirlerle toplama ve çıkarma gerektiren günlük yaşam problemlerini çözebilme** | a) Uygun stratejiyi oluşturur; b) kullanır; c) çözümü **kontrol eder**. "problem örgüsünde artma ve eksilme durumlarına dikkat çekilerek" | Kesir problemleri (yalnız eşit payda) 4. sınıfta |
| MAT.4.1.13 | Uzunluk ve kütle birimlerinin dönüşümleri | — | Birim dönüştürmeli problemler |
| MAT.4.2.6 | Dört işlem içeren yönergeler oluşturarak süreci yorumlayabilme | — | Öğrencinin adım listesi yazması |
| **MAT.4.2.7** | **Dört işlem gerektiren problemleri çözebilme** | a–h bileşenleri aynı. Sınır: "toplama ve çıkarma gerektiren problemlerde **dört işlemli**, çarpma ve bölme gerektiren problemlerde **en çok üç işlemli**"; bağlam: uzunluk, tartma | 4. sınıf çok adımlı problemler |
| **MAT.4.2.8** | **Dört işlem gerektiren problem durumlarını yapılandırabilme** | a) ilişkiler ortaya koyar; b) problemleri **kendi öz bilgisiyle oluşturur**. Bağlam: paralar, zaman, uzunluk, tartma, **sıvı ölçme (litre ve mililitre)**. Destekleme: "Basit kartlar üzerine problem cümleleri yazılarak … verilen ve istenenler ile ilgili uygun **resim çizmeleri** istenir" | Problem Kur (4. sınıf); resim/şema çizme = temsil adımı |

### A.2 Alan becerisi eşleşmesi (TYMM-İ tablo satırları)
- MAT.1.2.x teması: **MAB1** Matematiksel Muhakeme (KB2.4 Çözümleme, KB2.14 Yorumlama) — 1. sınıfta MAB2 listelenmez.
- MAT.2.2.x ve MAT.3.2.x temaları: **MAB1 + MAB2 Matematiksel Problem Çözme**.
- 4. sınıf İşlemlerden Cebirsel Düşünmeye: **MAB2 (MAB2.1 Matematiksel Çözümler Geliştirme)**.
- Temsil: **MAB3** (MAB3.1 Matematiksel Temsillerden Yararlanma) — beceriler arası ilişki olarak birçok temada.
- **Dikkat (görev metnindeki varsayım düzeltmesi):** MAB1 = Muhakeme, **MAB2 = Problem Çözme**, MAB3 = Temsil, MAB4 = Veri ile Çalışma ve Veriye Dayalı Karar Verme, MAB5 = Araç ve Teknoloji ile Çalışma (TYMM-S; TYMM-MAB).

### A.3 Ortaokul (isteğe bağlı kapsam, 5–6)

| Kod | Çıktı | Not |
|---|---|---|
| **MAT.5.1.2** | Doğal sayılar ve işlemler içeren gerçek yaşam problemlerini çözebilme | a–h süreç bileşenleri ilkokuldakiyle paralel (a: problemdeki sayı ve işlem bileşenlerini belirler … h: genellemeyi değerlendirir). Sınır: toplama-çıkarma en çok **beş basamaklı**; çarpma: en çok **üç basamaklı iki sayı**; bölme: **dört basamaklı ÷ iki basamaklı**. MAB2. (TYMM-O5 /447) |
| MAT.5.2.1–5.2.2 | Eşitliğin korunumu; işlem önceliğini yorumlayabilme | Öğrenme-öğretme metninde "problem yazma" ve "verilen problem durumlarını sayı cümlesine dönüştürme" geçer (TYMM-O5 /450) |
| MAT.5.4.4 | Dikdörtgenin çevre ve alanıyla ilgili problemleri çözebilme | Kurmada alan ≤36 birimkare; m² ve cm², birim dönüşümü yok (TYMM-O5 /451) |
| MAT.5.1.3–5.1.4 | Kesirleri temsil etme / karşılaştırma | Problem çözme çıktısı değil (TYMM-O5 /449) |
| MAT.5.5.1 | Kategorik veriyle çalışma | Araştırma sorusu **oluşturma** (istatistiksel problem kurma) |
| 5. sınıf kesirlerle işlem problemleri, 6. sınıf tüm çıktılar | — | **[doğrulanamadı]** (/453 sayfası HTTP 500; 6. sınıf sayfaları bu turda okunmadı) |

### A.4 ÖÖG Destek Eğitim Programı hedefleri (ÖÖG-DEP) — aracın MÖG/diskalkuli hedef kitlesi için ikinci resmî çapa

| Düzey | Hedef davranış (özet) | Problem kurma eşi |
|---|---|---|
| Erken Mat. 4.5.1.5–6 | Toplamı 10'u geçmeyen toplama gerektiren **sözel problemleri** önce nesne/nesne resmiyle modelleyerek, sonra zihinden çözer | — |
| Erken Mat. 4.5.2.6–7 | 1–10 arası çıkarma sözel problemleri: modelleyerek → zihinden | — |
| Mat. Düzey 1 (5.1.15.1–2) | Toplamı **20**'yi geçmeyen, **bir** toplama işlemi gerektiren problemler | "Verilenlere uygun" aynı türde **problem kurar** |
| Mat. Düzey 2 (5.1.15.3–4) | Toplamı **100**'ü geçmeyen, **en çok iki işlem** | iki işlemli problem kurar |
| Mat. Düzey 3 (5.1.15.5–6) | Toplamı **1000**'i geçmeyen, **en çok üç işlem** | en çok iki işlemli problem kurar |
| Mat. Düzey 4 (5.1.15.7–8) | **En çok dört basamaklı**, **en çok dört işlem** | üç işlemli problem kurar |

ÖÖG-DEP öğretim açıklamaları (5.1.15, 5.1.17 vb.): "Problem çözme sürecinde problem, **şemalarla** ya da bireylerin kendi çizimleri ile görselleştirilmelidir"; "problemi **yüksek sesle okuma, kendi cümleleri ile açıklama, bir görsele dönüştürme, tahminde bulunma, işlemi yapma ve sürecin kontrol edilmesi** aşamalarında bireylere model olunmalıdır." Ayrıca çıkarma için: "'azaldı', 'çıktı', 'geriye kalan', 'kalan', 'kaldı' vb. çıkarma işlemine ilişkin anahtar kelimeler kullanılmalıdır" (Erken Matematik 4.5.2 açıklaması) — bu ifadenin araştırma bulgularıyla gerilimi için bkz. D.3.

**Araç için sonuç:** ÖÖG-DEP Düzey 1–4, TYMM-İ sınıf 1(2)–4 sınırlarıyla neredeyse birebir örtüşür (20 / 100 / 1000 / 4 basamak; 1 / 2 / 3 / 4 işlem). Araç seviye ölçeği bu iki kaynağa **birlikte** eşlenebilir: "Seviye = ÖÖG Düzeyi ≈ sınıf içeriği", böylece BEP'te hem sınıf hem destek eğitim hedefine atıf yapılır.

---

## (B) Problem çözme süreci adlandırması

### B.1 Resmî tanımlar (üç katman)

**Katman 1 — Alan becerisi MAB2 (TYMM-MAB, TYMM-İ 1.5.1):** "Asgari düzeyde matematiksel bir problemi çözmek için deneyimlenmesi gereken süreç." Dört bütünleşik beceri ve süreç bileşenleri (SB):

| Bütünleşik beceri | Süreç bileşenleri (resmî ifade) |
|---|---|
| 1. **Çözümleme** (KB2.4) | SB1 Nesne, olgu ve olaylara ilişkin **parçaları belirlemek**; SB2 **Parçalar arasındaki ilişkileri** belirlemek |
| 2. **Yorumlama** (KB2.14) | SB2 Mevcut durumu **bağlamdan kopmadan dönüştürmek**; SB3 **Kendi ifadeleriyle** anlamı değiştirmeden yeniden ifade etmek |
| 3. **Matematiksel Çözümler Geliştirme** (MAB2.1) | SB1 Problemin çözümü için bir **strateji oluşturmak**; SB2 Stratejiyi işe koşarak **problemi çözmek**; SB3 Problemin çözümünü **kontrol etmek** |
| 4. **Yansıtma** (KB2.15) | SB1 **Deneyimi gözden geçirmek**; SB2 Deneyime dayalı **çıkarım yapmak**; SB3 Ulaşılan çıkarımları **değerlendirmek** (problem kurma bu bileşenin altındadır) |

**Katman 2 — Öğrenme çıktısı bileşenleri (MAT.2.2.1 / 3.2.6 / 4.2.7 a–h):** anla (verilen-istenen) → ilişki kur → temsile dönüştür → kendi sözünle açıkla → tahmin et + strateji geliştir → uygula → kontrol et / strateji değiştir → kısa yolu değerlendir → genelle → genellemeyi sına.

**Katman 3 — ÖÖG-DEP "Süreç Temelli Matematik Problemi Çözme Öğretimi":** "en temel dört basamak; **problemi anlama, plan yapma, planı uygulama ve kontrol etme**" (Polya'nın dört aşamasının Türkçe yerleşik adlandırması). Model olunacak mikro-adımlar: **yüksek sesle okuma → kendi cümleleriyle açıklama → görsele dönüştürme → tahminde bulunma → işlemi yapma → kontrol**.

Türkiye alanyazınında Polya dörtlüsü "problemi anlama, plan yapma (strateji seçme), planı uygulama, değerlendirme/kontrol" olarak yerleşiktir (Altun, M., Millî Eğitim Dergisi, sayı 147, **[yıl doğrulanamadı, ~2000]**; Gökkurt vd., 2015).

### B.2 Mevcut Galaksay akışı (GS-WP) ve boşluklar

Mevcut: **0 Oku · 1 Anla (verilenler → istenen → şema türü) · 2 İşlem (4 düğme) · 3 Çöz (bar model + hesapla) · 4 Özet.**

| Boşluk | Programdaki karşılığı | Öneri |
|---|---|---|
| Tahmin adımı yok | a–h (d) "sonuca ilişkin tahminde bulunarak"; programın TAHMİN→ZİHİNDEN→PROSEDÜR ilkesi; ÖÖG-DEP mikro-adımı | Modelden sonra, hesaptan önce **"Tahmin et"** (aralık seçimi: "10'dan az mı, çok mu?") |
| İşlem seçimi modelden önce geliyor | a–h sırası: (c) **temsile dönüştür** → (d) strateji; ÖÖG-DEP: görsele dönüştür → tahmin → işlem | **Modelle → İşlemi seç** sırası (şema/bar model işlem kararını gerekçelendirir; işlem düğmesi tahmin oyununa dönüşmez) |
| "Kendi cümlenle anlat" yok | (ç) + KB2.14 SB3 | Anla adımına **"Hangi cümle aynı şeyi söylüyor?"** (3 yeniden-ifade şıkkı) veya sesli kayıt [öneri] |
| Kontrol yalnız örtük | (f), MAB2.1 SB3, ÖÖG-DEP "kontrol etme" | Özet yerine **"Kontrol et"**: cevabı hikâyeye geri koy ("Ela'nın 8 kalemi olursa, 3'ünü verince 5 kalır mı?") + ters işlemle sağlama (MAT.1.2.4, 3.2.4) |
| Yansıtma/genelleme yok | (g)(ğ)(h), KB2.15 | Oturum sonu kısa **"Düşün"** kartı: "Bu problem hangi probleme benziyordu?" (şema eşleştirme = genelleme); problem kurmaya köprü |
| ⚡ "işlem sözcüğüne dokun" (Anla alt-adımı) | — | Anahtar-sözcük avcılığını pekiştirir; araştırmaya aykırı (bkz. D.3, F). **İlişki sözcüğü** olarak yeniden çerçevele ("Kim daha çok? Kimden?") |

### B.3 Önerilen adım adları (çocuk yüzü + programa eşleme)

| # | Çocuk yüzü (TR) | Kurmancî [öneri; ana-dil denetimi gerekli] | TYMM-İ / MAB2 eşlemesi | ÖÖG-DEP eşlemesi |
|---|---|---|---|---|
| 1 | **Oku** (dinle) | **Bixwîne** (guhdarî bike) | — (ön koşul; TTS) | yüksek sesle okuma |
| 2 | **Anla** — "Ne biliyoruz? Ne soruluyor?" | **Fêm bike** — "Em çi dizanin? Çi tê pirsîn?" | Çözümleme SB1-SB2; çıktı (a)(b) | problemi anlama; kendi cümleleriyle açıklama |
| 3 | **Göster** (modelle / şemaya yerleştir) | **Nîşan bide** | Yorumlama SB2 + MAB3.1; çıktı (c)(ç) | görsele (şemaya) dönüştürme |
| 4 | **Tahmin et** | **Texmîn bike** (FerMat: *texmîn*) | çıktı (d) | tahminde bulunma |
| 5 | **Çöz** (işlemi seç ve yap) | **Çareser bike** (FerMat: *çareserî*) | MAB2.1 SB1-SB2; çıktı (d)(e) | plan yapma + planı uygulama |
| 6 | **Kontrol et** | **Kontrol bike** (FerMat: *kontrol*) | MAB2.1 SB3; çıktı (f) | kontrol etme |
| 7 | **Düşün** (isteğe bağlı; problem kurmaya köprü) | **Bifikire** | Yansıtma KB2.15; çıktı (g)(ğ)(h); MAT.3.2.7/4.2.8 | "verilenlere uygun problem kurar" |

Öğretmen/rapor yüzünde resmî dil kullanılsın: **"Problemi anlama (çözümleme) – Temsil etme (yorumlama) – Çözüm geliştirme (strateji, uygulama, kontrol) – Yansıtma"**; raporda her adım hatası bu dört başlığa toplanırsa öğretmen doğrudan MAB2 bileşenine ve MAT.x.2.x çıktı bendine (a–h) atıf yapabilir. Kısa sürüm (1–2. sınıf, ÖÖG Düzey 1): 5 adım (Oku–Anla–Göster–Çöz–Kontrol et); Tahmin ve Düşün Düzey 2+ açılır **[öneri]**.

---

## (C) Sınıf bazında sayı aralığı ve problem türü matrisi

Kaynak: TYMM-İ tema açıklamaları (1.5.2.1) ve öğrenme-öğretme uygulamaları; 5. sınıf TYMM-O5. "İşlem sayısı" = problemdeki **işlem adımı** sayısı (iki işlemli = iki adımlı problem). Program 3. sınıf metninde bir yerde "en çok üç", öğrenme-öğretme bölümünde "üç işlemli"; 4. sınıfta "en çok dört"/"dört işlemli" diye geçer → **üst sınır** olarak yorumlanmıştır.

### C.1 Zorunlu kapsam (1–4)

| Boyut | 1. sınıf | 2. sınıf | 3. sınıf | 4. sınıf |
|---|---|---|---|---|
| Sayı okuma/yazma | 20'ye kadar (20 dâhil); ritmik sayma 100'e kadar ileri, 20'den geri | 100'e kadar | 1000'e kadar | En fazla **altı basamaklı** |
| Toplama | Toplam ≤20, **eldesiz**, iki toplanan | Toplam ≤100, **eldeli**, 2–3 toplanan | Toplam <1000, 2–3 toplanan, eldeli | En çok **dört basamaklı** sayılar, eldeli |
| Çıkarma | 20 içinde, onluk bozmasız | 100'e kadar, **onluk bozma** | 1000'e kadar | En çok dört basamaklı, onluk bozma |
| Çarpma | — | 10'a kadar sayılar × 1–5 (5'e kadar çarpım tablosu); tekrarlı toplama | 10'a kadar × 9'a kadar (10'a kadar çarpım tablosu); 2 bsm × 1 bsm modelle; ×10, ×100 kısa yol | 3 bsm × en çok 2 bsm (tahmin bağlamı); 3 bsm × (10/100/1000'in ≤9 katı); ×5, 25, 50 kısa yol |
| Bölme | — | 20'ye kadar ÷ 2, 3, 4, 5, **kalansız**; ardışık çıkarma | 100'e kadar, **kalanlı ve kalansız**; ÷10 kısa yol | 1000'e kadar ÷ 1 bsm, kalanlı/kalansız; tahminde ≤4 bsm ÷ 1 bsm; ÷10/100/1000 (son üç basamağı 0, ≤5 bsm) |
| **Problem: işlem sayısı** | **Tek işlemli** (+/−) | +/−: **en çok iki işlem**; ×/÷: **tek işlem** | +/−: **en çok üç**; ×/÷: **en çok iki** | +/−: **en çok dört**; ×/÷: **en çok üç** |
| Problem kurma | Resmî çıktı yok (ÖÖG-DEP Düzey 1'de var) | Performans görevi / farklılaştırma | **MAT.3.2.7** (resmî) | **MAT.4.2.8** (resmî) |
| Para | TL banknot tanıma (1–200 TL), kuruş yok | **Kuruş–TL** ilişkisi (25, 50 kuruş; 1 TL) | 100 kuruş = 1 TL, madenî/kâğıt dönüşüm | Problemlerde bağlam |
| Zaman | — (1. sınıftan kaldırıldı) | Tam/yarım/çeyrek saat, takvim | Analog/dijital saat; dk, sn; dönüşümler; olay süresi tahmini | Problemlerde bağlam |
| Uzunluk / kütle | Standart olmayan birim, tahmin | m, cm; kg (tahmin) | mm, cm, m, km; g, kg, ton (ton ve km dönüşümü hariç) | Alt/üst birim dönüşümleri |
| Sıvı | — | Standart olmayan (bardak, kova) | **Litre, yarım litre** | **Litre–mililitre** (MAT.4.2.8 bağlamı) |
| Kesir | — | Bütün, yarım, çeyrek (somut; problem yok) | Birim kesir, pay–payda (problem yok) | Çokluğun basit kesir kadarı (çokluk ≤3 bsm); **eşit paydalı +/− problemleri** (MAT.4.1.12) |
| ÖÖG-DEP düzeyi | Düzey 1 (≤20, 1 işlem) | Düzey 2 (≤100, ≤2 işlem) | Düzey 3 (≤1000, ≤3 işlem) | Düzey 4 (4 bsm, ≤4 işlem) |

### C.2 Problem türü × sınıf önerisi [öneri — programda tür (CGI/şema) adı geçmez; sınırlar programdan, tür sıralaması araştırmadan]

| Şema / tür (Riley-Carpenter / SBI) | 1 | 2 | 3 | 4 | Programdaki dayanak |
|---|---|---|---|---|---|
| Ekle / Ayır — sonuç bilinmeyen | ● | ● | ● | ● | MAT.1.2.1 (artma/azalma) |
| Ekle / Ayır — değişim bilinmeyen | ● | ● | ● | ● | MAT.1.2.4 (ters ilişki), MAT.1.2.3 (eşitlik) |
| Ekle / Ayır — başlangıç bilinmeyen | ○ (somut, ≤10) | ● | ● | ● | MAT.1.2.4 "tersine dönüştürür"; MAT.2.2.3 |
| Parça-parça-bütün — bütün / parça bilinmeyen | ● | ● | ● | ● | MAT.1.1.2 (parçalar arası ilişki) |
| Karşılaştırma — fark bilinmeyen | ○ | ● | ● | ● | MAT.1.1.4 ("daha çok/az") |
| Karşılaştırma — büyük/küçük bilinmeyen (tutarsız dil dâhil) | — | ○ | ● | ● | MAT.2.2.1 (b) ilişki belirleme |
| Eşitleme ("kaç tane daha olmalı ki eşit olsun") | ○ | ● | ● | ● | MAT.1.2.3, MAT.2.2.6 |
| Eşit gruplar — çarpım bilinmeyen | — | ● | ● | ● | MAT.2.2.4 |
| Paylaştırma / gruplama bölmesi (kalansız) | — | ● | ● | ● | MAT.2.2.4 |
| Kalanlı bölme (kalanı yorumla: yukarı yuvarla / at / kalanı söyle) | — | — | ● | ● | MAT.3.2.3–3.2.4 |
| Karşılaştırmalı çarpma ("3 katı", "yarısı") | — | — | ● | ● | MAT.3.2.8 anahtar kavram **kat** |
| İki adımlı (karışık +/−) | — | ● | ● | ● | MAT.2.2.1 "en çok iki işlemli" |
| Çok adımlı dört işlem (×/÷ içeren) | — | — | ● (≤2 ×/÷) | ● (≤3 ×/÷) | MAT.3.2.6, MAT.4.2.7 |
| Kesir–çokluk ("24'ün 1/4'ü", "1/3'ü 5 ise tamamı") | — | — | — | ● | MAT.4.1.10 |
| Eşit paydalı kesir +/− | — | — | — | ● | MAT.4.1.12 |
| Gereksiz bilgi içeren | — | — | ○ | ● | Programda açık ifade yok **[öneri]**; "verilen–istenen belirleme" (a) bendini sınar |
| Problem kurma (verilen şemaya/işleme uygun) | — (ÖÖG D1 ○) | ○ | ● | ● | MAT.3.2.7, MAT.4.2.8; ÖÖG-DEP 5.1.15.2/4/6/8 |

● = çekirdek, ○ = destekli / somut modelle giriş, — = sınıf dışı.

### C.3 İsteğe bağlı kapsam (5–6)

| Boyut | 5. sınıf (TYMM-O5) | 6. sınıf |
|---|---|---|
| Doğal sayı problemleri | MAT.5.1.2: +/− ≤5 bsm; × iki sayı ≤3 bsm; ÷ 4 bsm ÷ 2 bsm; işlem önceliği (MAT.5.2.2) | **[doğrulanamadı]** |
| Geometrik nicelik problemleri | MAT.5.4.4 dikdörtgen çevre/alan (≤36 br², m²/cm², dönüşüm yok) | **[doğrulanamadı]** |
| Kesir problemleri | Temsil/karşılaştırma çıktıları doğrulandı (5.1.3–5.1.4); işlem problemleri **[doğrulanamadı]** | **[doğrulanamadı]** |
| Ondalık / yüzde | **[doğrulanamadı]** | **[doğrulanamadı]** |

**Araç kuralı [öneri]:** Sayı üreteci her problem için (sınıf, tür, işlem-sayısı, eldeli/eldesiz, onluk bozmalı/bozmasız, kalanlı/kalansız) bayraklarını taşımalı; C.1 satırları **doğrudan doğrulayıcı** olarak kodlanmalı (ör. 1. sınıfta `a+b≤20 && eldesiz && iki toplanan`). Galaksay'daki `audit:items` CI hattına "müfredat sınırı" denetimi olarak eklenebilir.

---

## (D) Türkçe problem metni yazım kılavuzu

### D.1 Okunabilirlik ölçütleri

- **Ateşman (1997)** — Türkçe için ilk formül (Flesch uyarlaması): **Okunabilirlik = 198,825 − 40,175 × (ort. hece/sözcük) − 2,610 × (ort. sözcük/cümle)**. Kaynak: Ateşman, E. (1997). Türkçede okunabilirliğin ölçülmesi. *Dil Dergisi, 58*, 71–74. Yaygın kullanılan bantlar: 90–100 çok kolay, 70–89 kolay, 50–69 orta, 30–49 zor, 1–29 çok zor (bantlar ikincil kaynaklardan; **[orijinal metinle karşılaştırılmadı]**).
- **Çetinkaya-Uzun**: sözcük ve cümle uzunluğuna dayalı, sınıf düzeyine eşleyen formül (Çetinkaya, G. 2010, doktora tezi, Ankara Üniversitesi). Katsayılar ve bant-sınıf eşlemesi bu turda birincil kaynaktan **[doğrulanamadı]**. Türkçe ders kitabı çalışmalarında ortaokul düzeyi için kullanılıyor (ör. Çıplak, RumeliDE, 2023). 1–2. sınıfın kısa problem metinleri (3–5 cümle) için ayırt edici değildir.
- **Bezirci & Yılmaz (2010)**: Türkçe için yazılım kütüphanesi ve yeni ölçüt, *DEÜ Mühendislik Fakültesi Fen ve Mühendislik Dergisi* (dergipark deumffmd/492667). Ayrıntılar **[doğrulanamadı]**.

Örnek hesap (Ateşman): "Ela'nın 5 kalemi var. Annesi 3 kalem daha aldı. Ela'nın şimdi kaç kalemi var?" → 14 sözcük / 3 cümle = 4,67; 28 hece / 14 = 2,0 → 198,825 − 80,35 − 12,19 ≈ **106** ("çok kolay", tavanı aşar). Sayılar okunuşuyla hecelenmiştir.

**Araç kuralı [öneri]:** Her şablon üretiminde Ateşman puanı otomatik hesaplanıp CI'da eşik denetimi yapılsın: 1–2. sınıf ≥90, 3. sınıf ≥80, 4. sınıf ≥70. Formül yalnız cümle ve hece uzunluğunu ölçer; **anlamsal güçlüğü (tutarsız dil, ek yığılması) ölçmez**, bu yüzden D.3 kuralları ayrıca uygulanır.

### D.2 Yaşa göre uzunluk hedefleri [öneri: Türkçe için resmî norm bulunamadı; uzman önerisi]

| Sınıf / ÖÖG düzeyi | Cümle sayısı | Sözcük/cümle (üst sınır) | Toplam sözcük | Sayı yazımı | Not |
|---|---|---|---|---|---|
| 1 / Düzey 1 | 2–3 | 6–7 | ≤20 | Rakam + görsel nokta/nesne | Soru ayrı, son cümle; TTS zorunlu |
| 2 / Düzey 2 | 3–4 | 8–9 | ≤35 | Rakam | İki adımlıda her adım ayrı cümle |
| 3 / Düzey 3 | 3–5 | 10–12 | ≤50 | Rakam; birimler kısaltmalı (cm, kg, L) | Gereksiz bilgi en çok 1 cümle |
| 4 / Düzey 4 | 4–6 | 12–14 | ≤70 | Rakam; binlik ayırıcı nokta (1.250) | Kesir: "1/4" + okunuşu "dörtte bir" |

### D.3 Kurallar (20 madde, örneklerle)

**Yapı ve düzen**

1. **Bir cümle = bir bilgi.** ✗ "Ela'nın 5 kalemi vardı ve annesi ona 3 kalem daha alınca kalemleri arttı." ✓ "Ela'nın 5 kalemi var. Annesi 3 kalem daha aldı."
2. **Soru en sonda, ayrı cümle, tek soru.** Türkçede soru sözcüğü yüklemden hemen önce gelir ("… **kaç** kalemi var?"); soru cümlesini hikâyeye yapıştırma. ✗ "Ela 3 kalem daha alırsa kaç kalemi olur, bulunuz." ✓ "Ela'nın şimdi kaç kalemi var?" Destek modu için **"soruyu önce göster"** seçeneği [öneri].
3. **Olay sırası = anlatım sırası** (1–2. sınıf). "Önce/sonra" ile zaman kaydırma ("Ela 3 kalem vermeden önce …") yalnız başlangıç-bilinmeyen türünde ve 2. sınıftan itibaren.
4. **Zaman kipi tutarlı:** durum için "var/yok", olay için **-DI** (görülen geçmiş). **-mIş** (duyulan geçmiş), **-sA** (koşul), **-(y)ken** yan cümleleri 1–2. sınıfta kullanılmaz. ✗ "Ali markete gitmiş, 4 ekmek almış." ✓ "Ali markete gitti. 4 ekmek aldı."
5. **Özne tekrarı zamirden iyidir.** ✗ "Ela ile Can bahçeye çıktı. O 3 çiçek topladı." ✓ "Ela 3 çiçek topladı."

**Türkçeye özgü biçimbilim (eklemeli yapı)**

6. **Sayıdan sonra ad tekil:** "5 elma" (✗ "5 elmalar"). Üreteç bunu zorunlu kılmalı; çoğul eki yalnız sayısız göndermede ("Elmaların hepsi").
7. **Ünsüz yumuşaması ve kaynaştırma harfi hazır sözlükten gelsin, çalışma anında ek üretilmesin:** kitap→kitab**ı**, simit→simid**i**, ağaç→ağac**ı**, çocuk→çocu**ğ**u, su→su**y**u; iyelik + hâl ekleri (kalem**i** var / kalem**ini** verdi). [öneri] Sözlükte her ad için {yalın, belirtme, iyelik-3, çoğul} önceden çekimli tutulsun (Galaksay'daki "sayı + boşluk + kelime" öbek kuralı korunur).
8. **Özel adlara kesme işareti** (TDK): "Ela'nın", "Rojda'nın", "Baran'a". Ek, addaki son ünlüye göre uyar. TR metninde Kürtçe adların Türk alfabesine uygun yazımı tercih edilir (bkz. E.1).
9. **Karşılaştırmada ayrılma eki (-DAn) gönderme kümesini işaretler; çocuk bu eki ayrıştırmak zorundadır.** "Can'ın bilyeleri Ela'nın**kinden** 3 fazla" (Ela+nın+ki+n+den: 4 ek yığılması) 1–2. sınıfta kullanılmaz. ✓ "Can'ın, Ela'dan 3 **fazla** bilyesi var." ya da iki cümle: "Ela'nın 5 bilyesi var. Can'ın bilyesi **daha çok**. Can'ın 3 bilyesi **fazla**."
10. **"Kat" dili:** "3 **katı**" (iyelikli: "Ela'nın bilyelerinin 3 katı") kullan; "**3 kat fazla**" belirsizdir (3 kat mı, 4 kat mı?), hiç kullanma. "yarısı", "dörtte biri" (bulunma eki -DA ile kesir okunuşu) 4. sınıfa kadar görsel destekle.
11. **Üleştirme eki -(ş)Ar eşit grupları işaretler:** "Her tabağa **üçer** simit koydu." Türkçenin çarpma/bölme için güçlü bir ipucudur; ama 2. sınıfta ilk kullanımda "**her birine 3**" ile eşleştir.
12. **"Kalan / kaldı / arttı" ayrımı:** Türkçede *kalan* hem çıkarmada "geriye kalan" hem bölmede "kalan" (remainder) anlamındadır. Öneri: ayırma problemlerinde fiil **"kaldı"**; bölmede eşit paylaşım sonrası **"arttı/artan"**; işlem öğesi olarak **"kalan"** yalnız bölme bağlamında. (Kurmancî bunu kendiliğinden ayırır: *dimîne* / *jêma*, bkz. §5.)

**Anlam ve anahtar sözcük tuzakları**

13. **Anahtar sözcük stratejisi öğretilmez; tutarsız dil bilinçli olarak çeşitlendirilir.** Türkiye verisi: 3–4. sınıf öğrencileri işlem-tutarlı anahtar sözcüklerde belirgin biçimde daha başarılı, tutarsızlarda düşük; öğrenciler işlem seçimini açıkça anahtar sözcüğe dayandırıyor (Yıldız & Can, 2020). Türkçe tuzak sözcükler: **fazla/daha çok/artık** (çıkarma gerektirebilir), **az/eksik/kaldı** (toplama gerektirebilir), **toplam** (parça bilinmeyende çıkarma), **her biri** (toplama ya da bölme). Tuzak örneği: "Can'ın 12 bilyesi var. Can'ın bilyeleri Ela'nınkilerden 4 **fazla**. Ela'nın kaç bilyesi var?" (→ 12 − 4). Düzey 1'de yaklaşık %80 tutarlı / %20 tutarsız, Düzey 3–4'te yaklaşık %50 / %50 [öneri].
14. **ÖÖG-DEP gerilimi:** ÖÖG-DEP Erken Matematik açıklaması çıkarmada "azaldı, çıktı, geriye kalan, kalan, kaldı" sözcüklerinin **kullanılmasını** önerir. Uzlaştırma [öneri]: bu sözcükler **ilk model problemlerde (tutarlı dil) metinde kullanılabilir**, ama araç "sözcüğe bak → işlemi seç" diye **öğretmez**; işlem kararı daima şema/model üzerinden gerekçelendirilir (Adım 3 "Göster").
15. **Soru sözcüğü nicelik türüne uysun:** sayılabilir nesne → "**kaç**"; para, sıvı, uzunluk, süre → "**ne kadar**" (KU: *çend* / *çiqas*, FerMat).
16. **Birim açık yazılsın:** "3 lira" değil "**3 TL**"; 2. sınıftan "**25 kuruş**", "1 TL 50 kuruş". Ondalık para gösterimi ("1,50 TL") ondalık sayılar öğretilmeden kullanılmaz. Süre: "yarım saat", "15 dakika"; saat: "saat 3 buçuk".
17. **Gereksiz bilgi yalnız bilinçli bir seviye özelliği olsun:** 1–2. sınıfta metindeki her sayı çözümde kullanılır; 3–4. sınıfta en çok bir gereksiz sayı (ör. yaş, tarih) [öneri].
18. **Gerçekçi ama fiyattan bağımsız bağlam:** enflasyon nedeniyle somut TL fiyatları hızla eskir ve sosyoekonomik farkı görünür kılar. Fiyat yerine **adet** bağlamları (simit sayısı, bilet sayısı) ya da programdaki banknot/madenî para kümesi (1, 5, 10, 20, 50, 100, 200 TL; 25/50 kuruş) kullanılsın; yoksulluk, borç, kıtlık senaryolarından kaçınılsın [öneri].

**Kapsayıcılık ve sunum**

19. **Ad ve rol dengesi:** her şablon setinde kız/erkek ad oranı yaklaşık 1:1; rol stereotipi yok (kız futbol oynar, erkek yemek yapar, dede pasta yapar). Kentsel ve kırsal bağlam yaklaşık 1:1; Kürtçe ve diğer yerel adlar TR metinlerinde de görünür (bkz. E).
20. **Çok kipli sunum:** 1–2. sınıf ve ÖÖG Düzey 1–2'de TTS ve sayıların görsel karşılığı birlikte verilir. Sayılar metinde **rakamla** yazılır (okuma yükünü düşürür), TTS okunuşuyla seslendirir. Metin oyun ekranında en fazla 3 satıra sığacak biçimde bölünür (Galaksay "sade UI" ilkesi).

---

## (E) Bağlam ve ad havuzu önerisi (TR ve KU)

### E.1 Ad havuzu (48 ad; kız/erkek dengeli)

İlkeler [öneri]: (1) **kısa ad** (1–2 hece; Ateşman puanını ve çalışan belleği korur; "Alparslan", "Ömer Asaf" gibi uzun adlar ekle birlikte 5–6 heceye çıkar); (2) TR metinde Türk alfabesiyle yazılabilen biçim, KU metinde Kurmancî yazım; (3) güçlü siyasal/ideolojik çağrışımı olan adlardan kaçınma (ör. "direniş", "devrim" anlamlı adlar); (4) aynı problemde baş harfleri farklı iki ad (Ela–Can; Ela–Emre değil), okuma güçlüğü olan çocukta karışmayı azaltır.

Güncel Türkiye verisi: TÜİK 2024 doğumlarında en sık erkek adları Alparslan, Göktuğ, Yusuf, Metehan, Ömer Asaf, Kerem, Aslan, Ömer, Miraç, Eymen; kız adları Defne, Asel, Zeynep (ilk üç) (TÜİK Nüfus İstatistikleri Portalı, "En Çok Verilen Bebek İsimleri"; haber aktarımı Hürriyet/Dünya). Hedef yaş grubunun (2016–2020 doğumlular) listeleri bu turda **[doğrulanamadı]**; havuz güncel sık adlar ve kısa klasik adlar karışımıdır.

| Grup | Kız | Erkek |
|---|---|---|
| **TR: yaygın/güncel** (12+12) | Zeynep, Elif, Defne, Asel, Eylül, Azra, Ecrin, Nehir, Ada, Duru, Meryem, Ayşe | Yusuf, Ömer, Kerem, Eymen, Emir, Ali, Efe, Can, Arda, Mert, Aslan, Miraç |
| **KU: Kurmancî** (12+12), TR yazımı / *KU yazımı* | Rojda / *Rojda*; Berfin / *Berfîn*; Zelal / *Zelal*; Dilan / *Dîlan*; Jiyan / *Jiyan*; Hevi / *Hêvî*; Rojin / *Rojîn*; Evin / *Evîn*; Delal / *Delal*; Şilan / *Şîlan*; Beritan / *Berîtan*; Nupelda / *Nûpelda* | Baran / *Baran*; Azad / *Azad*; Renas / *Rênas*; Diyar / *Diyar*; Berzan / *Berzan*; Aram / *Aram*; Miran / *Mîran*; Hozan / *Hozan*; Zana / *Zana*; Agit / *Agît*; Serhat / *Serhat*; Siyar / *Siyar* |

Notlar: KU yazımları ve adların yaygınlığı **[ana-dil denetimi gerekli]**; Kurmancî harfler ê, î, û, x, w, q Türk alfabesinde yoktur (î ve û düzeltme işaretiyle Türkçede de bulunur ama farklı işlevdedir), bu yüzden TR metinlerinde sadeleştirilmiş biçim önerilir. Suriyeli ve Arapça konuşan öğrenciler için Türkçede de yaygın ortak adlar (Yusuf, Meryem, Ömer, Ali, Ayşe) iki havuza zaten köprü kurar.

Yetişkin/aile rolleri: anne, baba, dede, nine/babaanne/anneanne, abla, ağabey, öğretmen, komşu, bakkal, şoför, çiftçi, aşçı (KU: *dayik, bav, bapîr, dapîr, xwişk, bira, mamoste, cîran, şofêr, cotkar*) **[KU karşılıkları FerMat dışında; ana-dil denetimi gerekli]**. Meslek rolleri cinsiyet-dengeli (kadın şoför, erkek hemşire).

### E.2 Bağlam havuzu (36 bağlam)

Sınıf sütunu C.1 sınırlarına göredir; şema = en doğal düştüğü türler [öneri].

| # | Bağlam | Kır/Kent | Sınıf | Doğal şemalar | Birim/nicelik | Not |
|---|---|---|---|---|---|---|
| 1 | Simitçi / fırın (simit, poğaça) | Kent | 1–4 | Ekle/ayır, eşit gruplar (tepside üçer sıra) | adet | Fiyat yerine adet |
| 2 | Çay bahçesi / misafire çay ikramı | Her ikisi | 1–4 | Ayır, eşit gruplar (tepside bardak) | adet, bardak | — |
| 3 | Pazar (domates, elma, patates) | Her ikisi | 2–4 | PPW, karşılaştırma | kg, adet | Kütle bağlamı (2. sınıf kg) |
| 4 | Manav / bakkal alışverişi | Kent | 2–4 | Ekle, para üstü | TL, kuruş | 2. sınıftan kuruş |
| 5 | Bayram harçlığı | Her ikisi | 2–4 | Ekle, karşılaştır | TL (banknot kümesi) | Miktarlar küçük, SES karşılaştırması yok |
| 6 | Kumbara / para biriktirme | Her ikisi | 2–4 | Ekle, eşitleme ("kaç TL daha?") | TL | — |
| 7 | Şehir otobüsü (yolcu biner/iner) | Kent | 1–4 | Ekle/ayır (başlangıç bilinmeyen için ideal) | kişi | Değişim şemasının klasik bağlamı |
| 8 | Okul servisi | Her ikisi | 1–3 | Ekle/ayır, karşılaştır | kişi | — |
| 9 | Dolmuş / minibüs koltukları | Her ikisi | 2–4 | Eşit gruplar, kalanlı bölme ("kaç araç gerekir?") | kişi, sıra | Kalanı yorumlama (yukarı yuvarlama) |
| 10 | Metro / tramvay durakları | Kent | 3–4 | Çok adımlı ekle/ayır | durak, dakika | Süre bağlamı |
| 11 | Sınıf mevcudu, takımlar | Her ikisi | 1–4 | PPW (kız+erkek), eşit gruplar | kişi | — |
| 12 | Okul kütüphanesi (ödünç kitap) | Her ikisi | 1–4 | Ekle/ayır, karşılaştır | kitap | — |
| 13 | Teneffüs / ders süresi | Her ikisi | 2–4 | Süre ekleme | dakika, saat | İlkokulda ders 40 dk **[yerel uygulama; doğrulanmadı]** |
| 14 | Beden eğitimi (top, koni, ip atlama) | Her ikisi | 1–3 | Ekle/ayır, eşit gruplar | adet | Kız-erkek karışık takımlar |
| 15 | Mahalle maçı, gol sayısı | Her ikisi | 1–3 | Karşılaştırma (fark) | gol | Kız futbolcu |
| 16 | Misket/bilye, seksek, uçurtma | Her ikisi | 1–3 | Karşılaştırma, ekle/ayır | adet, metre (ip) | Geleneksel oyunlar |
| 17 | Köyde tavuk ve yumurta | Kır | 1–4 | Ekle, eşit gruplar (kolide 6'şar/10'ar) | adet | Deste–düzine örneği (2. sınıf) |
| 18 | Koyun/keçi sürüsü, ağıl | Kır | 2–4 | PPW, karşılaştırma | hayvan | — |
| 19 | İnek sütü, güğüm | Kır | 3–4 | Ekle/ayır, eşit gruplar | litre | 3. sınıftan L |
| 20 | Tarla / bahçe fide dikimi (sıra sıra) | Kır | 2–4 | Eşit gruplar (dizi) | fide, sıra | Çarpmanın dizi modeli |
| 21 | Arıcılık, bal kavanozu | Kır | 3–4 | Eşit gruplar, bölme | kavanoz, kg | — |
| 22 | Fındık / çay toplama (Karadeniz) | Kır | 3–4 | Çok adımlı, ×/÷ | kg | Bölgesel çeşitlilik |
| 23 | Pamuk / narenciye (Çukurova), fıstık (Antep), elma (Isparta), üzüm (Ege bağları) | Kır | 3–4 | Karşılaştırmalı çarpma ("3 katı") | kasa, kg | Bölgesel çeşitlilik |
| 24 | Balıkçı teknesi (hamsi kasası) | Kıyı | 3–4 | Eşit gruplar, bölme | kasa | — |
| 25 | Apartman katları / asansör | Kent | 1–3 | Ekle/ayır (kat inip çıkma) | kat | Sayı doğrusu modeli |
| 26 | Park, salıncak sırası | Kent | 1–2 | Ekle/ayır | çocuk | — |
| 27 | Doğum günü pastası / pide dilimleri | Her ikisi | 2 (yarım/çeyrek görsel), 4 (kesir problemi) | Kesir–çokluk, eşit paydalı +/− | dilim | MAT.4.1.10 / 4.1.12 |
| 28 | Kermes / okul şenliği (23 Nisan) | Her ikisi | 2–4 | Ekle, PPW | adet, TL | — |
| 29 | Karne günü / kitap okuma çizelgesi | Her ikisi | 2–4 | Karşılaştırma, çok adımlı | sayfa, gün | Veri teması ile köprü |
| 30 | Geri dönüşüm (şişe, kâğıt toplama) | Her ikisi | 2–4 | Ekle, karşılaştır, eşitleme | adet, kg | Sürdürülebilirlik (programda okuryazarlık bileşeni) |
| 31 | Su tasarrufu (kova, şişe) | Her ikisi | 3–4 | Ayır, çok adımlı | litre, mililitre (4) | MAT.4.2.8 sıvı bağlamı |
| 32 | Hayvan barınağı / kuş yemi | Her ikisi | 1–3 | Eşit gruplar, paylaştırma | kap, avuç | Empati |
| 33 | Bahar şenliği / Nevruz (bahar karşılama) | Her ikisi | 1–3 | Ekle, PPW | adet | Resmî olarak kutlanan bahar bayramı; KU kullanıcılar için tanıdık |
| 34 | Ramazan/Kurban bayramı ziyareti, şeker ikramı | Her ikisi | 1–3 | Eşit gruplar, ayır | adet | Dinî bağlam dengeli ve ölçülü kullanılsın |
| 35 | Düğün/nişan ikramı (lokum tabağı) | Her ikisi | 2–4 | Eşit gruplar, bölme | tabak, adet | — |
| 36 | Tekerlekli sandalyedeki çocuk takım kaptanı; görme engelli arkadaşla kitap dinleme | Her ikisi | 1–4 | Herhangi | — | Engellilik temsili: nötr, kahramanlık anlatısı olmadan |

### E.3 Kurmancî problem metni: FerMat terminolojisi ve yazıma etkisi (§5)

**Bağlayıcı terimler (FerMat; ayrıca proje belleğindeki 2026-08-27 standardı):**

| Kavram | Kurmancî (kanonik) | Yasak/kaçınılacak | Problem metnine etkisi |
|---|---|---|---|
| sayı / rakam | **hejmar** / **jimare** | *jimar* (sayı için) | "hejmar" kavram; ekranda rakam tuşları "jimare" |
| toplama / toplam | **zêdekirin** / **zêdok** | *kom* (toplama anlamında; *kom* = küme/grup) | Hikâye fiillerinde gündelik dil ("da", "kirî", "anî"); meta-yönergede "zêdekirin" |
| çıkarma / fark | **kemkirin** (şapkasız) / **kemok** | — | Dikkat: karşılaştırmada "**kêmtir**" şapkalı ("ji … kêmtir") |
| çarpma / çarpım | **carkirin** / **carandok** | — | "dûcar" = iki katı, "nîvcar" = yarısı (FerMat), "kat" dilinin KU karşılığı |
| bölme / bölüm / kalan | **parkirin** / **paran** / **jêma** | *dabeş* | **jêma** yalnız bölme kalanı; ayırma problemlerinde "**dimîne**" (kalıyor). Türkçedeki "kalan" belirsizliği KU'da yok (bkz. D.3 kural 12) |
| işaret adları | + **zêdek**, − **kemek**, × **carek**, ÷ **parînek**, = **wekhevî** | — | Sesli yönergede işaret okunuşu |
| problem / çözüm / cevap | **pirsgirêk** / **çareserî** / **bersiv** | — | Adım adları (B.3) |
| tahmin / kontrol | **texmîn** / **kontrol** | — | Adım adları |
| kaç? / ne kadar? | **çend?** / **çiqas?** | — | Sayılabilir → *çend*; para/sıvı/uzunluk → *çiqas* (D.3 kural 15 ile paralel) |
| toplam (ifade) / birlikte / her biri | **bi giştî** / **bi hev re** / **her yek** | — | Birleştirme ve eşit grup şemaları |
| ...den fazla / az | **ji … zêdetir** / **ji … kêmtir** | — | Gönderme kümesi *ji* ön edatıyla işaretlenir; Türkçe -DAn'a benzer biçimde ayrıştırma yükü taşır, tutarsız dil tuzakları KU'da da aynen kurulabilir |
| en az / en çok | **herî kêm** / **herî zêde** | — | — |
| yarım / çeyrek / kesir | **nîv** / **çarek** / **parjimar** (pay **par**, payda **tevpar**) | *parçe* (kesir anlamında) | 4. sınıf kesir problemleri |
| para, saat, dakika, uzunluk, ağırlık, hacim, birim | **pere**, **demjimêr**, **deqe**, **dirêjahî**, **giranî**, **qebare**, **yeke** | — | Birim adları (lître, kîlo, metre, quruş/kuruş) FerMat'ta yok → **[ana-dil + FerMat'a ekleme kararı gerekli]** |

**Kurmancî dilbilgisinin şablon üretimine etkileri** (genel Kurmancî dilbilgisi; FerMat kapsamı dışında, **ana-dil denetimi gerekli**):
1. **Ergatiflik:** geçişli fiillerin geçmiş zamanında eyleyen *oblik* hâle girer ve fiil *nesneyle* uyuşur (ör. "Rojdayê 3 sêv xwarin"). Türkçe şablonların birebir çevirisi bu yüzden hataya çok açıktır. Öneri: (a) durum kalıpları ("… hene / heye"), (b) geçişsiz fiiller ya da şimdiki zaman tercih edilsin; geçmiş geçişli şablonların her biri tek tek doğrulansın.
2. **Ezafe ve oblik ekleri** (-a/-ê/-ên; özel adlarda cinsiyete göre oblik biçim) çalışma anında üretilmemeli; ad sözlüğünde çekimli biçimler hazır tutulmalı (TR kural 7 ile aynı ilke).
3. **Sayı + ad:** belirsiz bağlamda sayıdan sonra ad çoğul eki almaz ("pênc sêv"); belirli/oblik bağlamda "-an" görünür. Üreteç bağlama göre doğru biçimi seçmeli **[doğrulama gerekli]**.
4. **Seslendirme:** KU TTS klipleri kimlik tabanlıdır (proje notu: terminoloji değişirse klasör silinip yeniden üretilmeli). Sayıların KU okunuşu için `numWords` benzeri dönüştürücü zorunlu; FerMat sayı adları (bîst, sî, çil, pêncî, şêst, heftê, heştê, not, sed, hezar) kanonik.
5. **Meta-dil / hikâye dili ayrımı:** FerMat terimleri **yönerge ve adım adlarında** kullanılır ("Kîjan kirarî? zêdekirin / kemkirin"). Hikâye cümleleri gündelik Kurmancî ile yazılır; aksi hâlde metin yapay ve zor okunur. UI düğme ve dönüt dili LUTKE üslubunda ("Dîsa biceribîne", "Aferin!") (FERMAT.ku.md).

---

## (F) Türkiye araştırmaları özeti

### F.1 Uluslararası ve ulusal performans (aracın gerekçesi, §6)

| Gösterge | Değer | Kaynak |
|---|---|---|
| TIMSS 2023, 4. sınıf matematik | **553** puan; 58 ülke içinde 8.; 2019'a göre +30 puan | MEB haber, 2024: meb.gov.tr/…/haber/35662/tr |
| TIMSS 2023, 8. sınıf matematik | **509** puan; 44 ülke içinde 13.; 2019'a göre +13; ilk kez 500 ölçek orta noktasının üstünde | aynı |
| PISA 2022 matematik (15 yaş) | **453** puan (OECD ort. 472); Türkiye'de öğrencilerin **%61**'i en az Düzey 2'de (OECD %69), yani yaklaşık **%39** temel yeterliğin altında | OECD, *PISA 2022 Results, Country Note: Türkiye*; ERG, "Bir Bakışta PISA 2022" (ERG'nin %32,9 değeri OECD notuyla çelişiyor; OECD değeri esas alındı) |
| PISA 2022 sosyoekonomik eğim | Ekonomik-sosyal-kültürel statüde bir birimlik artış ≈ **27 puan** ("bir okul yılının üzerinde") | ERG, 2023 |
| Program gerekçesi | MEB tanıtım sunumu: "PISA ve TIMSS gibi uluslararası sınavlarda öğrencilerimizin %73'ünün işlemsel bilgi, %17'sinin kavramsal bilgi düzeyinde olduğu ortaya çıkmıştır" | TYMM-S (sunumda birincil veri kaynağı belirtilmemiş, **[bağımsız olarak doğrulanamadı]**) |
| LGS sözel/senaryolu matematik performansı | — | **[doğrulanamadı]** (bu turda resmî MEB LGS raporu okunmadı) |

**Gerekçe cümlesi [öneri]:** TIMSS'te (müfredata yakın, kısa maddeler) belirgin yükseliş varken PISA'da (bağlamlı, çok adımlı, okuma yükü yüksek problemler) Türkiye OECD ortalamasının altındadır ve 15 yaşındakilerin yaklaşık beşte ikisi temel düzeyin altındadır. Yani açık, **bağlamdan matematiğe dönüştürme** (MAB2 "yorumlama") becerisindedir; aracın odağı da budur.

### F.2 Sözel problem çözme: ilkokul, genel popülasyon

| Çalışma | Örneklem / desen | Bulgu | Araç için çıkarım |
|---|---|---|---|
| Boz, İ. (2018). İlkokul 4. sınıf öğrencilerinin okuduğunu anlama düzeyi ile matematik problemlerini çözme başarısı arasındaki ilişki. *İnsan ve Sosyal Bilimler Dergisi, 1*(1), 40–53. | 300 dördüncü sınıf, Kahramanmaraş; ilişkisel | Okuduğunu anlama ile problem çözme arasında **r = .56** (kız .59, erkek .53) | Okuma yükü ayrı bir engel: TTS, kısa cümle, okunabilirlik denetimi (D) |
| Tayfur, Y. C. & Kale, M. (2022). İlkokul dördüncü sınıf öğrencilerinin dört işlem ve problem çözme başarıları arasındaki ilişki. *Gazi Eğitim Fakültesi Dergisi, 42*(3). doi:10.17152/gefad.1185372 | 462 öğrenci, Kayseri, SES katmanlı | Dört işlem başarısı problem çözme varyansının yalnız **%22**'sini açıklıyor; işlem becerisi "tek başına yeterli değil" | İşlem akıcılığı ≠ problem çözme; anlama ve temsil adımları ayrıca öğretilmeli |
| Yıldız, H. N. & Can, D. (2020). İlkokul öğrencilerinin sözel problem çözme performansı üzerinde anlamsal tutarlılık etkisi. *Yaşadıkça Eğitim, 34*(2), 406–425. doi:10.33308/26674874.2020342198 | 100 öğrenci, 3–4. sınıf | Tutarsız anahtar sözcüklerde performans düşüyor; öğrenciler işlem seçimini anahtar sözcüğe dayandırıyor; özellikle düşük/orta başarılılarda yanlış işlem | Anahtar sözcük stratejisini öğretme; tutarsız dili çeşitlendir (D.3/13) |
| Canbazoğlu, H. B. & Tarım, K. (2019). Sınıf öğretmenlerinin öğrencilere sundukları sözel problem türleri. *Mersin Üniv. Eğitim Fak. Dergisi, 15*(2), 526–541. doi:10.17860/mersinefd.514603 | 104 sınıf öğretmeni | Öğretmenler ağırlıkla **sonuç bilinmeyen** birleştirme/ayırma, parça bilinmeyen PPW, fark bilinmeyen karşılaştırma ve tekrarlı toplama türü çarpma sunuyor | Sınıfta az görülen türler (başlangıç bilinmeyen, büyük/küçük bilinmeyen karşılaştırma, eşitleme, kalanlı bölmede yorum) araçta sistematik verilmeli; tür dengesi öğretmen raporunda gösterilmeli |
| Gökkurt, B., Örnek, T., Hayat, F. & Soylu, Y. (2015). Öğrencilerin problem çözme ve problem kurma becerilerinin değerlendirilmesi. *Bartın Üniv. Eğitim Fak. Dergisi, 4*(2), 751–774. doi:10.14686/buefad.v4i2.5000145637 | 69 sekizinci sınıf; nitel | Polya'nın **anlama, planlama, değerlendirme** aşamalarında ve problem kurmada yetersizlik; plan doğruysa uygulama genelde sorunsuz | Anla ve Kontrol et adımlarına ağırlık; problem kurma modu |
| Özsoy, G. & Ataman, A. (2009). The effect of metacognitive strategy training on mathematical problem solving achievement. *International Electronic Journal of Elementary Education, 1*(2), 67–82. | 47 beşinci sınıf; deneysel (9 hafta) | Üstbilişsel strateji eğitimi problem çözme başarısını ve üstbilişi anlamlı artırdı | "Kontrol et / Düşün" adımları (öz-sorgulama kartları) |
| Altun, M. İlköğretimde problem çözme öğretimi. *Millî Eğitim Dergisi*, sayı 147 (dhgm.meb.gov.tr) **[yıl doğrulanamadı]** | Kuramsal | Polya dörtlüsünün Türkçe yerleşik adlandırması; 11 strateji (şekil çizme, tablo, geriye çalışma, tahmin-kontrol vb.) | Strateji dağarcığı; "Göster" adımında şekil/şema |

### F.3 Öğrenme güçlüğü / MÖG odaklı Türkiye çalışmaları (zihinsel yetersizlik çalışmaları kapsam dışı)

| Çalışma | Örneklem / desen | Bulgu | Araç için çıkarım |
|---|---|---|---|
| Özkubat, U., Karabulut, A. & Akçayır, İ. (2020). Şemalarla matematik problemi çözme: öğrenme güçlüğü olan öğrencilerle yürütülen şema temelli öğretim araştırmalarının incelenmesi. *OMÜ Eğitim Fakültesi Dergisi, 39*(2), 327–342. doi:10.7822/omuefd.774137 | Sistematik derleme ve meta-analiz, 6 çalışma (1990–2020), örtüşmeyen veri yüzdesi | Şema temelli öğretim ÖÖG'li öğrencilerin problem çözme performansını **artırıyor** | Aracın şema temelli (SBI) çekirdeği Türkçe alanyazınla da destekleniyor |
| Özkubat, U., Karabulut, A. & Sert, C. (2022). Öğrenme güçlüğü olan ortaokul öğrencilerine uygulanan matematik problemi çözme müdahaleleri: kapsamlı alanyazın incelemesi. *Ankara Üniv. EBF Özel Eğitim Dergisi, 23*(1), 191–218. doi:10.21565/ozelegitimdergisi.774650 | 9 müdahale çalışması (son 20 yıl) | Etkili yaklaşımlar: doğrudan öğretim, şemaya dayalı strateji, bilişsel strateji öğretimi; yalnız 1 çalışma tüm nitelik göstergelerini karşılıyor | Açık modelleme + şema + bilişsel strateji birleşimi; araç verisi nitelikli tek-denekli araştırmaya uygun kaydedilmeli |
| Şen, S. G. & Yıkmış, A. (2024). Özel öğrenme güçlüğü olan öğrencilerin matematik problemi çözme becerilerinde şemaya dayalı öğretim stratejisinin etkililiği. *AİBÜ Eğitim Fakültesi Dergisi, 24*(3), 1562–1579. doi:10.17240/aibuefd.2024..-1424130 | 3 ÖÖG'li öğrenci; tek-denekli, denekler arası çoklu yoklama | **Animasyon destekli** şema öğretimi ile işlevsel ilişki; 5-10-15. günlerde kalıcılık | Animasyonlu şema gösterimi (dijital araç için doğrudan dayanak) |
| Doğmaz Tunalı, S. & Karabey, B. (2024). Özel öğrenme güçlüğü olan öğrencilerin problem çözme performanslarını geliştirmede diyagram kullanımının etkililiği. *İnönü Üniv. Eğitim Fakültesi Dergisi, 25*(3). doi:10.17679/inuefd.1435610 | 20 ÖÖG'li öğrenci (10 deney/10 kontrol); yarı deneysel, 8 hafta bireysel | **İki adımlı** problemlerde diyagram stratejisi deney grubunu anlamlı üstün kıldı | İki adımlı problemlerde bar/diyagram zorunlu adım |
| Özlü Ünlü, Ö. & Yıkmış, A. (2025). Özel öğrenme güçlüğü olan öğrencilere sözel problem çözme becerisinin öğretiminde uyarlanmış kavramsal model temelli problem çözmenin etkililiği [Türkçe başlık İngilizce künyeden çevrildi; özgün İngilizce: "The Effectiveness of Modified Conceptual Model-Based Problem-Solving…"]. *Ankara Üniv. EBF Özel Eğitim Dergisi, 26*(3), 291–314. doi:10.21565/ozelegitimdergisi.1443417 | 3 öğrenci (10–11 yaş, 4–5. sınıf); tek-denekli çoklu yoklama | Tek adımlı toplama/çıkarma **karşılaştırma** problemlerinde etkili; 2-4-6. haftada kalıcılık, sınıfa genelleme; bilişsel/üstbilişsel strateji kullanımı arttı | COMPS (Xin) tipi "parça-parça-bütün" denklem modeli karşılaştırma türünde Türkçe bağlamda da işe yarıyor |
| Yenioğlu, S., Sayar, K. & Güner Yıldız, N. (2022). Öğrenme güçlüğü olan öğrencilere alışveriş problemleri çözme becerisinin kazandırılması ve günlük yaşama genellenmesi. *Ankara Üniv. EBF Özel Eğitim Dergisi, 23*(3), 613–636. doi:10.21565/ozelegitimdergisi.841368 | 3 erkek öğrenci (10–12), Eskişehir kaynaştırma; çoklu yoklama | Doğrudan öğretimle alışveriş problemleri kazanıldı ve **gerçek markete genellendi** | Para bağlamı + genelleme görevi (evde market fişi etkinliği, ABMATO köprüsü) |
| Karaağaç, H. & Ay, Z. S. (2026). Matematik öğrenme güçlüğü çalışmalarının doküman analizi. *Ankara Üniv. EBF Özel Eğitim Dergisi, 27*(2), 215–242. doi:10.21565/ozelegitimdergisi.1629033 | 2002–2022 Türkiye: 17 YL, 10 doktora tezi, 22 makale | Yayınlar 2014 sonrası artıyor (tepe 2019); çoğu görüşmeye dayalı; ortak sonuç: öğretmenlerin diskalkuli bilgisi yetersiz | Öğretmen yüzünde kısa kanıt ve yöntem açıklamaları (kılavuz) değerli |

### F.4 Yılmaz Mutlu'nun ilgili yayınları (doğrulanabilenler)

DergiPark "@mutluyilmaz" profili coğrafyacı başka bir yazara ait (**karışıklık uyarısı**). Aşağıdakiler Karaağaç & Ay (2026) kaynakçası ve web aramasıyla doğrulandı:
- Mutlu, Y. (2016). Matematik öğrenme güçlüğü (gelişimsel diskalkuli). E. Bingölbali, S. Arslan ve İ. Ö. Zembat (Ed.), *Matematik eğitiminde teoriler* (s. 881–899). Pegem Akademi.
- Mutlu, Y. & Akgün, L. (2017). Matematik öğrenme güçlüğünü tanılamada yeni bir model önerisi: Çoklu Filtre Modeli (dergi künyesi **[doğrulanamadı]**; DergiPark article-file/330551).
- Mutlu, Y. (2019). Math anxiety in students with and without math learning difficulties. *IEJEE, 11*(5), 471–475.
- Mutlu, Y., Olkun, S., Akgün, L. & Sarı, M. H. (Ed.) (2020). *Diskalkuli: Matematik öğrenme güçlüğü; tanımı, özellikleri, yaygınlığı, nedenleri ve tanılanması*. Pegem Akademi.
- **Akgün, L. (2021). Diskalkulik çocuklara problem çözme öğretimi.** Y. Mutlu (Ed.), *Diskalkuli: Matematik öğrenme güçlüğüne sahip çocuklara matematik öğretimi* (s. 233–260). Vizetek. (Sözel problem için doğrudan ilgili Türkçe bölüm; içeriği bu turda okunmadı.)
- Mutlu, Y., Çalışkan, E. F. & Yasul, A. F. (2022). We asked teachers: Do you know what dyscalculia is? *International Online Journal of Primary Education, 11*(2), 361–378.
- Yılmaz Mutlu'nun sözel problem çözme **müdahalesi** üzerine hakemli makalesi bu turda **[bulunamadı / doğrulanamadı]**.

### F.5 Görevde adı geçen, doğrulanamayan adlar
- **Özsoy**: doğrulandı (Gökhan Özsoy, üstbilişsel strateji, 2009); ancak şema temelli sözel problem çalışması değil.
- **Kuruyer, Gürsel, Kaplan**: sözel problem / şema temelli ÖÖG çalışması olarak **[doğrulanamadı]**. (Gürsel adıyla bilinen özel eğitim çalışmaları zihinsel yetersizlik odaklıdır ve kapsam dışı bırakıldı; bu da bu turda doğrulanmadı.)

---

## Araca yansıyan 10 somut karar (özet)

1. Seviye ölçeği = TYMM-İ sınıf sınırları + ÖÖG-DEP Düzey 1–4 (20/100/1000/4 bsm; 1/2/3/4 işlem; ×/÷ bir düzey geride).
2. 1. sınıf: tek işlem, ≤20, eldesiz; "problem çözme" değil "durumu çözümleme" dili (MAT.1.2.1). Resmî problem çözme çıktısı 2. sınıfta (MAT.2.2.1).
3. Problem kurma modu 3. sınıftan resmî (MAT.3.2.7, 4.2.8); ÖÖG-DEP'e göre Düzey 1'den itibaren "verilenlere uygun" kurma açılabilir.
4. Adım akışı: Oku → Anla → Göster → Tahmin et → Çöz → Kontrol et → (Düşün); rapor dili MAB2'nin dört bileşeni ve MAT.x çıktı bentleri (a–h).
5. İşlem seçimi modelden **sonra** gelir; ⚡ anahtar-sözcük dokunuşu ilişki sözcüğü olarak yeniden çerçevelenir.
6. GS-WP kod eşlemesi düzeltmesi: PPW → MAT.1.1.2/1.2.1 (1.2.3 değil); karşılaştırma → MAT.1.1.4/1.2.1; başlangıç-bilinmeyen → MAT.1.2.4 / MAT.2.2.1.
7. Ölçme bağlamları (para, zaman, uzunluk, tartma, sıvı) ayrı mod değil, problem çıktılarının bağlamı; sınıf başlangıçları C.1'deki gibi (sıvı-L 3., mL 4.; kuruş 2.).
8. Kesir problemleri yalnız 4. sınıf (çokluğun kesri; eşit paydalı +/−).
9. Metin kuralları CI'da denetlensin: Ateşman eşiği, cümle/sözcük sınırı, sayıdan sonra tekil ad, "3 kat fazla" yasağı, tutarlı/tutarsız dil oranı.
10. KU metinleri: FerMat terimleri yalnız yönerge dilinde; hikâye gündelik Kurmancî; ergatif geçmiş zaman ve ezafe biçimleri hazır sözlükten, ana-dil denetimli.

