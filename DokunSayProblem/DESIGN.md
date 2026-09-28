# DokunSay Problem — Tasarım Belgesi

**Sürüm:** 0.1 (2026-09-27) · **Yayın yolu:** `dokunsay.com/DokunSayProblem/` · **Araç kimliği:** `problem` · **Port:** 3009
**Kaynak yaklaşım:** Galaksay sözel problem akışı (`GalakSay.jsx` wp modları, `CGI_TYPE_INFO`), literatürle genişletilmiş.
**Araştırma dosyaları:** `docs/arastirma/01..06_*.md` — bu belgedeki her kararın gerekçesi oradadır.

| Dosya | İçerik |
|---|---|
| `01_galaksay_wp.md` | Galaksay'daki mevcut akış, 15 tür, kusurlar, yeniden kullanılabilir fonksiyonlar |
| `02_lit_sema.md` | ~65 kaynak: şema temelli öğretim, problem türü katalogu, diyagram kuralları, 11 eksenli zorluk modeli |
| `03_lit_ustbilis.md` | 76 kaynak: adım modeli, iskele düzeyleri, 13 etkinlik modülü, geri bildirim/ipucu kuralları |
| `04_mufredat_tr.md` | TYMM 2024 çıktıları, sınıf sınırları, Türkçe metin yazım kılavuzu, ad/bağlam havuzu, Kurmancî notlar |
| `05_rakip_araclar.md` | 20 dijital araç kıyası, etkileşim desenleri, 15 öneri, 10 anti-desen |
| `06_entegrasyon.md` | DokunSay platform şartnamesi: iskelet, ortak kabuk, kayıt noktaları, riskler |

---

## 1. Amaç ve kitle

Sözel problemi **yapısını görerek** çözmeyi öğreten, okuma yükünü sesle kaldıran, 1–4. sınıf (isteğe bağlı 5–6) ve
matematik öğrenme güçlüğü (MÖG/diskalkuli) olan çocuklar için tasarlanmış müstakil bir araç. Öğretmen sınıfta
projeksiyonla modelleme yapar; çocuk tablet/bilgisayarda bireysel çalışır.

**Tek cümle tez:** Çocuk önce hikâyeyi anlar, sonra yapısını bir şema diyagramında kurar; işlem bu modelden çıkar —
anahtar kelimeden değil.

## 2. On ilke (kanıtlı; ayrıntı 02 §E, 03 §D)

1. **Yapı çekirdektir.** Beş şema (§3) ve diyagramları aracın omurgası. (SBI meta-analizleri g≈0.8–1.6; WWC 2021 Öneri 5, güçlü kanıt.)
2. **Transfer açıkça öğretilir:** bilinmeyen konumu, gereksiz bilgi, iki adım, tablo, farklı soru biçimi katmanları.
3. **Anahtar kelime YASAK.** Hiçbir ipucu, metin, vurgu "fazla = topla", "kaldı = çıkar" eşlemesi kurmaz. Galaksay'daki "işlem sözcüğüne dokun" adımı ve maskot uyarısı **taşınmaz**; yerine ilişki sorusu ("Kim daha çok? Kimden?").
4. **Okuma yükü sesle kaldırılır:** her cümle, seçenek, ipucu ve geri bildirim seslendirilebilir (`@shared/tts.js` tek yol). Cümle cümle vurgulu okuma.
5. **Çalışma belleği ekranda tutulur:** metin, model ve denklem aynı anda görünür; sayılar kutulara "park edilir".
6. **Hesaplama yapıdan ayrılır:** hesap hatası yapı puanını düşürmez; hesap araçları ayrı çekmecede.
7. **Eşittir ilişkiseldir:** denklem modelden türetilir; bilinmeyen başta/ortada olabilir (`? + 3 = 8`).
8. **Somut → yarı somut → soyut, azalan destekle.** Önce ikon/nokta, sonra şerit, sonra sayılı kutu. Diyagramı önce araç kurar, sonra çocuk.
9. **Hata sınıflanır, parça bazında ve destekleyici geri bildirim verilir.** Yanlış modelle hesaplamaya geçilmez.
10. **Doz ve karışık tekrar:** yeni şema bloklu tanıtılır, ustalıktan sonra karışık sete girer. Oturum 15–20 dk.

## 3. Şema katalogu (v0.1 kapsamı)

| Şema | Alt türler | Roller | Diyagram | Şablon denklem | Sınıf |
|---|---|---|---|---|---|
| **Değişim** `change` | birleştirme `join`, ayırma `separate` | başta · değişim · sonra | Başta kutusu → ok (+/−değişim) → Sonra kutusu; bar görünümünde bütün/parça | B + D = S · B − D = S | 1–4 |
| **Parça-Bütün** `combine` | `static` | parça · parça · bütün | Üstte bütün şeridi, altında iki parça şeridi | P1 + P2 = B | 1–4 |
| **Karşılaştırma** `compare` | fazla `more`, az `fewer`, eşitleme `equalize` | büyük · küçük · fark | İki hizalı şerit, fark kısmı kesikli; referansa bağlayıcı ok | Büyük − Küçük = Fark | 1 (fark, ≤10) · 2–4 tümü |
| **Eşit Gruplar** `equalGroups` | çarpma `multiply`, paylaştırma `partitive`, gruplama `quotative` (+kalanlı) | grup sayısı · grup başına · toplam | G eşit dilimli şerit / G kap; paylaştırma "tek tek dağıt", gruplama "N'erli al" animasyonu | G × N = T | 2–4 (kalanlı 3–4) |
| **Kat Karşılaştırması** `multCompare` | kat `times`, birim kesir `fraction` | referans · kat · karşılaştırılan | 1 birim şerit ↔ k birim şerit; "4 fazla" ile "4 katı" yan yana | k × R = K | 3–4 (kesir 4) |

**Bilinmeyen konumları** her şemada üç rol; zorluk sırası sonuç < değişim/parça < başlangıç/referans (Riley vd. 1983).
**İki adımlı** problemler (M=2/3) iki halkalı zincir: ilk halkanın sonucu ikinci halkanın bir rolüne girer.
**Kapsam dışı (sonraki sürüm):** oran/orantı, kartezyen çarpım, eşit paydalı kesir toplama problemleri.

## 4. Veri sözleşmesi

`src/content/types.ts` tek kaynaktır. Özet: `Problem` = `steps: SchemaStep[]` (1–2 halka) + `text: Record<Lang, Sentence[]>`
(cümle → `Segment` parçaları; `qty` parçaları dokunulabilir sayı çipi) + `extras` (gereksiz sayılar) + `answer` +
`answerSentence` ("{x}" kalıbı) + `axes` (zorluk vektörü) + `curriculum` + `targets` (yanılgılar).
Üreteç `generateProblem(spec: ProblemSpec, lang?): Problem` saf ve **tohumlu**dur (aynı tohum → aynı problem;
paylaşım kodu bu tohum + spec'tir).

**Sözleşme notu (içerik motoru, 2026-09-27) — yalnız isteğe bağlı alanlar eklendi:**
- `Segment` (qty) `step?: number` — çok halkalı problemde çipin halka indeksi (iki halkada aynı rol adı geçebilir; yoksa 0).
- `SchemaStep.links?` — zincirde bir rolün önceki halkanın hangi rolünden geldiği (`{ start: { step: 0, role: 'result' } }`); ara sonuç metinde yazılmaz.
- `Problem.table?: ProblemTable` — axes.P=1'de fiyat listesi: `{ title, rows: { label, value, unit, ref, step? }[] }`. Tablodaki sayılar metinde geçmez; kullanılmayan satırlar `extras`'ta da yer alır (seçme becerisi).
- Çözülemez maddelerde (`unsolvable`) `answer = -1`; `steps` yine doludur (arayüz çökmesin diye metindeki sayılardan kurulan "tuzak" halka).
- Kalanlı bölmede `quantities`'deki bilinmeyen rolün değeri tam bölümdür (⌊T÷b⌋); `answer` yorumlanmış değerdir.

## 5. Zorluk ve seviyeleme

Eksenler (types.ts `Axes`): **U** bilinmeyen konumu · **L** dil tutarlılığı · **N** sayı aralığı · **I** gereksiz bilgi ·
**M** adım sayısı · **P** bilgi kaynağı (metin/tablo). Kurallar (02 §D2):
- **Tek eksen kuralı:** bir basamakta yalnız bir eksen zorlaşır.
- **Önce yapı, sonra sayı:** yeni şema/bilinmeyen N=0 (≤10) ile tanıtılır.
- **Bloklu → karışık.**
- **Müfredat sınırları doğrulayıcıdır** (04 §C.1): 1. sınıf ≤20 eldesiz tek işlem; 2. sınıf ≤100, +/− ≤2 işlem, ×/÷ tek işlem (5'e kadar çarpım, 20'ye kadar kalansız bölme); 3. sınıf ≤1000, +/− ≤3, ×/÷ ≤2, kalanlı bölme, kat; 4. sınıf 4 basamak, birim kesir.
- Seviye merdiveni 02 §D3 (toplamsal 14 basamak + çarpımsal hat). Ustalık eşikleri (5'te 4 doğru, H2 üstü ipucu yok) **tasarım tercihidir, kalibre edilmemiştir** — veriyle ayarlanacak.

## 6. Çözüm akışı ("Problem Çöz" ana görevi)

Beş ana adım şeridi (ekranda yalnız 5 simge); mikro-adımlar iskele düzeyine göre görünür:

| Ana adım | Mikro-adımlar | Çocuk ne yapar | Kural |
|---|---|---|---|
| **1 Anla** 👂 | `read` Dinle/Oku · `retell` Kendi sözünle · `question` Soru ne? · `known` Ne biliyorum? | Cümle cümle dinler; 3 yeniden-ifadeden doğrusunu seçer; soru cümlesine dokunup cevap birimini belirler; sayı çiplerini "İşime yarar / Gerek yok" kutularına ayırır (yalnız I>0'da) | Galaksay'ın "işlem sözcüğüne dokun" adımı YOK |
| **2 Göster** 🧩 | `schema` Şemayı adlandır · `model` Modeli kur · `checkModel` Modeli denetle | Şema kartını seçer (düzeye göre 2–5 kart); önce etiketleri sonra sayıları diyagram kutularına yerleştirir, bilinmeyene "?" jetonu koyar; denetler | **Önce yapı, sonra sayı kilidi.** Parça bazında geri bildirim. Yanlış modelle ilerlenmez. Sürükle-bırak + dokun-dokun alternatifi. Şeritler kurarken ölçeksiz, denetimde orantılıya animasyonla geçer |
| **3 Tahmin et** 🎯 | `estimate` | "Cevap bildiğim en büyük sayıdan büyük mü küçük mü?" (1–3) ya da sayı doğrusunda yaklaşık yer (4+) | Puanlanmaz; S0'da gizli |
| **4 Çöz** ✏️ | `equation` Denklem yaz · `compute` Hesapla | Modelden denklemi kurar (☐ ☐ = ☐ kalıbı, "?" herhangi bir konumda); hesaplar (hesap çekmecesi: sayı doğrusu, onluk çerçeve) | İşlem modeline göre değerlendirilir; hesap hatası ayrı sınıf |
| **5 Kontrol et** ✅ | `answer` Cevap cümlesi · `reasonable` Makul mü? · `reflect` Düşün | Cevabı birimiyle cümleye koyar; tahminle karşılaştırır / "cevabı hikâyeye koy" ile dinler / ters işlemle doğrular; kalanlı bölmede yorum seçer; kısa yansıtma (oturumda 1–2 kez) | Galaksay'daki pasif "Özet" yerine etkin kontrol |

Adım adları TYMM MAB2 süreç bileşenleri ve ÖÖG Destek Eğitim Programı'nın "anlama–plan–uygulama–kontrol" basamaklarıyla hizalıdır (04 §B). Öğretmen raporunda resmî dil: **Problemi anlama (çözümleme) · Temsil etme (yorumlama) · Çözüm geliştirme (strateji, uygulama, kontrol) · Yansıtma.**

### 6.1 Öz-sorgu (Söyle – Sor – Kontrol et)
Her mikro-adımda 1. tekil iç ses cümleleri (03 §B1): "Ne bulmam gerekiyor?", "Bu sayı soruyla ilgili mi?", "Model ile hikâye aynı mı?", "Bu cevap gerçek hayatta olabilir mi?".

### 6.2 İpucu kademeleri (her adım için ortak şablon, 03 §D2)
**H0** öz-sorgu kartı parlar (1. yanlış / 30 sn duraksama) → **H1** genel üstbilişsel soru → **H2** şema kuralı + animasyon → **H3** seçenek daraltma / bir kutu dolu gelir → **H4** maskot sesli düşünerek gösterir, ardından **aynı şemadan yeni problem zorunlu**.
İpucu cevabı **asla doğrudan vermez**; kademeler arası 3–5 sn bekleme; kullanılan en yüksek kademe ustalık hesabına girer ama çocuğa ceza olarak gösterilmez.

### 6.3 İskele düzeyleri (şema bazında, 03 §B2)
**S3 Model** (Ben yaparım: çözümlü örnek, geriye doğru soluklaştırma — önce son adım çocuğa bırakılır) → **S2 Rehberli** (tüm mikro-kartlar) → **S1 İstemli** (5 ana adım, kartlar "🔎 Nasıl yapıyordum?" ile) → **S0 Bağımsız** (model tuvali + cevap + "Makul mü?").
Soluklaş: aynı şemada son 5'te ≥4 doğru ∧ H2 üstü yok ∧ model ilk denemede ≥4/5. Geri dön: 2 ardışık yanlış ∨ H4 ∨ model denetiminde 2 ardışık başarısızlık. Oturumda en fazla 1 yeni şema (S3).

## 7. Etkinlik modülleri ("Antrenman durakları", 03 §C)

Her biri tam akışın bir adımını yoğun çalıştırır (2–4 dk, 4–6 madde):

| Modül | Adım | Kısa tarif | Koşul |
|---|---|---|---|
| **Hikâyeyi Anlat** | Anla | 3 yeniden-ifade: doğru / ilişki ters / soru farklı | — |
| **Tür Avcısı** | Göster | Tam hikâye → şema kartına sürükle; karışık set; "aynı tür mü?" çiftleri | — |
| **Şerit Atölyesi** | Göster | Serbest şerit tuvali: parça ekle, böl, parantez, "?" jetonu; öğretmen projeksiyon kipi | — |
| **Modelden Denkleme** | Çöz | Kurulu modele uyan denklemleri seç (iki denklem de doğru olabilir: 8 − 3 = ☐ ve 3 + ☐ = 8) | — |
| **Makul mü?** | Kontrol | Verilen cevap olabilir mi + gerekçe; kalanlı bölmenin 4 bağlamda yorumu | Kalan: 3. sınıf+ |
| **Gereksizi Ayıkla** | Anla | Sayı çiplerini "İşime yarar / Gerek yok"a ayır; aynı hikâye iki soru | — |
| **Sözcük Tuzağı** | Göster | Tutarlı/tutarsız karşılaştırma çiftleri; önce şerit kur, "Kim daha çok?" | Karşılaştırmada S1+ |
| **Hata Dedektifi** | Tümü | "Robot Çırak"ın çözümünde hatalı adımı bul, nedenini seç, düzelt; ilk düzeyde hata işaretli | O şemada S1+ (Große & Renkl 2007) |
| **Dedektif Soruları** | Kontrol | Çözülemez/eksik bilgili "kaptanın yaşı" maddeleri; "Bu soru çözülemez" düğmesi her maddede | Karışık sette 10'da 1 |
| **Problem Kurucu** | Yansıt | Resimden / denklemden / cevaptan / eksik soruyu tamamla; boşluklu cümle kalıbı; çözülebilirlik denetimi | Resmî: 3. sınıf+ (MAT.3.2.7); destekli giriş daha erken |

**Sözcük kartları** ayrı modül değil, problem metninde dokun-öğren: ilişki sözcükleri (fazla, az, toplam, fark, her birine, kalan, katı, yarısı) resim + kısa açıklama + ses; KU karşılıkları FerMat'a göre.

## 8. Metin ve dil

- **Türkçe yazım kılavuzu** 04 §D (20 kural): sayıdan sonra ad tekil; ek uyumu dilbilgisi fonksiyonlarıyla (Galaksay `numWords.js` `trAbl/trDat/trGen/trAcc` ailesi — `src/content/grammar/tr.ts`'e taşınır; `Ali'nın` gibi hatalar birim testle yakalanır); "3 kat fazla" yasak; yaşa göre cümle uzunluğu tablosu; Ateşman okunabilirliği test eşiği.
- **Kurmancî:** FerMat terimleri (`_platform/shared/fermat-terms.ku.js`, `FERMAT.ku.md`) yönerge dilinde bağlayıcı (hejmar, zêdekirin, kemkirin şapkasız, carkirin, parkirin, jêma); hikâye gündelik Kurmancî; ergatif ve ezafe biçimleri sözlükten. Ana dili Kurmancî olan biri tarafından denetlenmesi gereken yerler `// KU-DENETİM` yorumuyla işaretlenir.
- **Ad ve bağlam havuzu:** 04 §E (TR+KU adlar kız/erkek dengeli; kır/kent, bölgesel, bayram, pazar, ulaşım, engellilik temsili). Para (kuruş 2. sınıftan), zaman, uzunluk, kütle, sıvı (L 3., mL 4. sınıf) bağlam olarak.
- **Seslendirme:** ekranda `−` (U+2212) eksi; `toSpeech()` ile konuşulabilir biçim; Kurmancî gerçek ses yoksa 🔊 gizli (STANDARDS §1.4.1).

## 9. Kayıt ve öğretmen paneli

- **Ayrık puanlama:** her problemde ayrı ayrı: şema tanıma, model yerleşimi, "?" konumu, gereksiz bilgi, işlem, hesap, birim/kalan (`ErrorClass`). Öğretmen paneli şema × hata sınıfı ısı tablosu ve şema karışıklık matrisi gösterir.
- **İlerleme şema bazında** ("Karşılaştırma: Birlikte → Sen"); normatif sıralama, puan tablosu, süre yok.
- **Depolama:** `dokunsay:problem:*` (yerel, cihazda); JSON dışa/içe aktarım.
- **Öğretmen araçları:** kendi problemini yaz (şema, bilinmeyen, sayılar, bağlam, 3 dil) → paylaşım kodu / bağlantı (`#p=<kod>`, sunucusuz); projeksiyon kipi (büyük hedefler, "Ben yaparım" gösterimi); yazdırılabilir çalışma kâğıdı (seçili şema ve sınıf, boş diyagramlı).

## 10. Platform ve teknik (06 özet)

- Vite 6 + React 18.3.1 + TS ~5.6 (STANDARDS §2.1); router yok (sekmeler + hash); ilk sürümde PWA yok.
- Ortak kabuk: `AppShell`, `AppTabs`, `A11yPanel`, `LangSwitcher`, `SpeakButton` (`@shared`); a11y-global 44 px `!important` kuralı orantılı şeritleri bozmasın diye şerit gövdeleri `data-a11y-exempt` ya da ayrı sarmalayıcıyla korunur.
- Kayıt: `apps.js`, launcher `tools.js` (5 dil) + `TOOL_CATEGORIES` + `tools.test.js`, `App.jsx` sayaç, `palette.js`/`palette.d.ts`/`appIcon.js` (accent `#4f46e5`), CI iş akışlarındaki elle yazılmış listeler, `run-all.js`, `dev-all.js`, `verify.js`, kök `package.json`. Gate modu (içerik giriş arkasında).
- Yörünge rozetleri (`add` 3/5/6/7/8/10, `compose` 8, `multdiv` 3/7) ve Müdahale Rehberi "Şema temelli" bölümüne bağlantı.
- Dağıtım: `main`'e push → CI (`deploy-cloudflare.yml`) dokunsay.com'a yayınlar. **Elle `wrangler` dağıtımı yapılmaz** (yerel `dist-site`'ta rehber/sayı çubukları eksik olabilir).

## 11. Dürüst sınırlar

- Araç için özgün etkililik çalışması yoktur; tasarım kanıta dayalı uygulamalardan türetilmiştir (ESSA Tier 4 dili).
- Ustalık eşikleri ve zorluk puanları sezgisel başlangıç değerleridir.
- Türkçe "-den fazla" yapısının zorluk etkisi ve Kurmancî ana dilli çocuklarda etkililik ampirik olarak sınanmamıştır.
- Kurmancî metinler ana dil denetimi bekler.

---

## 12. Canlandır — sanal manipülatiflerle etkin katılım (v0.2)

**Amaç:** Çocuk hikâyeyi dinleyip okumakla kalmaz, nesneleri koyar, ekler, çıkarır, birleştirir, bire bir eşler, paylaştırır, gruplar. Böylece problemin yapısını **eylemle** kurar. Ardından sayaçlar şeride, şerit denkleme dönüşür: somuttan soyuta aşamalı geçiş.

**Dayanak:** Carbonneau, Marley & Selig 2013 (manipülatif meta-analizi d≈0.37; rehberlikle güçlenir, algısal zenginlik zayıflatır) · Moyer-Packenham & Westenskow 2013 (sanal manipülatif meta-analizi, orta etki) · Fyfe, McNeil, Son & Goldstone 2014 (concreteness fading) · McNeil, Uttal, Jarvin & Sternberg 2009 ve Kaminski, Sloutsky & Heckler 2008 (sade/genel temsil aktarımı artırır) · Witzel, Mercer & Miller 2003 (CRA) · Bouck, Satsangi & Park 2018 (VRA: sanal–temsili–soyut, özel gereksinimli öğrenciler) · Carpenter, Fennema vd. 1999 (CGI: doğrudan modelleme → sayma → türetilmiş bilgi) · Sarama & Clements 2009 (bilgisayarda "somut" manipülatif).

### 12.1 İlkeler
1. **Sade sayaçlar:** resimli nesne yok. Düz yuvarlak sayaçlar kullanılır, altlarında hikâyedeki nesnenin adı yazılı etiket bulunur. Bölgeler kişi adıyla etiketlenir ve Okabe-Ito rengi + desenle ayrılır.
2. **Sayılmadan görülebilir yapı:** yığınlar onluk çerçeve düzeninde dizilir (5'li satırlar, 10'lu çerçeveler). ≤20: tek sayaç. ≤100: onluk çubuk + sayaç. ≤1000: yüzlük kare + onluk + sayaç. 100'ün üstünde ya da kesirde `feasible=false` → adım atlanır.
3. **Hikâyeyle cümle cümle:** her vuruş bir cümleye bağlıdır. O cümle vurgulanır ve seslendirilir, çocuk eylemi yapar. Doğru miktara ulaşınca "Tamam" etkinleşir.
4. **Sayı canlı görünür ama öğretilebilir biçimde:** her bölgenin sayısı büyük yazıyla gösterilir. S1/S0'da "sayıyı gizle" açılır (üstüne sayma stratejisini zorlar).
5. **Bilinmeyen = gizli kutu:** başlangıç ya da değişim bilinmiyorsa miktar bir "?" kutusuna konur. Çocuk hedef çizgisine göre kutuya sayaç ekleyerek (üstüne sayma) ya da hedefi kurup bilineni çıkararak kutuyu açar.
6. **Eylem çeşitleri** (ActBeat): place, add, remove, combine, match (bire bir eşle → eşleşmeyenler = fark), deal (paylaştırma: birer birer dağıt), makeGroups (gruplama: k'lı gruplar), copy (kat: referansı k kez kopyala), mystery, ask.
7. **Etkileşim:** sürükle (pointer) + dokun ("+1", "+5", "+10" düğmeleri, sayaca dokun = seç, "çıkar" düğmesi) + klavye (Tab bölge, +/− ile ekle/çıkar, Enter). ≥44px. Onluk bozma ("1 onluk → 10 birlik") ve 10 birliği gruplama önerisi.
8. **Somuttan temsile geçiş:** canlandırma bitince "Şimdi şeride dönüştürelim" → sayaç satırları 600 ms'de şerit kutularına akar (prefers-reduced-motion: anında). Model adımı etiketleri önceden yerleşmiş ama sayıları boş başlar; çocuk sayıları kendisi taşır. Geçiş sezgisel olur, ama model adımı atlanmaz.
9. **Soluklaştırma:** S3/S2 → Canlandır adımı planda (S3'te Rehber gösterir, S2'de çocuk yapar). S1/S0 → planda yok, ama her adımda "🧮 Nesnelerle dene" düğmesiyle açılır. Hesap çekmecesinde serbest mat; Kontrol et'te "Cevabı hikâyeye koy" matta yeniden oynatılır.
10. **Strateji gözlemi (ActStrategy):** sayaçları tek tek mi eklediği (countAll), mevcudun üstüne mi saydığı (countOn), onluk mu kullandığı (useTens), birer birer mi yoksa grup grup mu dağıttığı kaydedilir. Öğretmen panelinde şema bazında strateji ilerlemesi görünür. Değerlendirme dili "doğru/yanlış" değil, "gelişim" olur.
11. **Hata:** hikâyeden farklı miktar ya da eylem → `actMismatch`. Geri bildirim nazik ve cümleye döner ("Cümleyi bir daha dinleyelim: kaç kuş kondu?"). Cevap verilmez.

### 12.2 Sözleşme
`types.ts`: `FlowStepId` += `'act'` (show: act → schema → model → checkModel), `ErrorClass` += `'actMismatch'`, `ActUnit`, `ActZone`, `ActBeat`, `ActScript`, `ActStrategy`. İçerik: `actScriptFor(problem: Problem, lang?: Lang): ActScript` (src/content/act.ts) + `hintFor/feedbackFor/selfTalk` 'act' girdileri. Arayüz: `src/components/mat/**` (MatBoard motoru), `src/flow/steps/ActStep.tsx`.

**Sözleşme notu (içerik, 2026-09-28) — yalnız isteğe bağlı alanlar:** `ActBeat` mystery += `target?` (hikâyedeki hedef sayı; bağıntısı types.ts yorumunda), `from?` (kutu bu bölgeden taşınarak dolar: "kaç tane gitti?"), `amount?` (kutunun gerçek içeriği — yalnız denetim için, arayüzde gösterilmez). `ActBeat.sentence` `actScriptFor(problem, lang)` çağrısındaki dilin cümle dizisine göredir (bazı çerçevelerde dillerin cümle sayısı farklı). İçerik API'si: `actScriptFor(problem, lang?, stepIndex?)`, `expectedAfter`, `expectedGroupsAfter`, `askValue`, `checkActState`, `beatPrompt`, `inferStrategy` (src/content/act.ts, actState.ts, actPrompt.ts). Bölge kimlikleri: change `main`/`box`/`out` · combine `p1`/`p2`/`whole` · compare `larger`/`smaller` (bilinmeyen satır `box` türünde) · equalGroups `supply`/`groups` · multCompare `ref`/`compared`/`groups`. Gizli kutu `mystery` vuruşunda kapalı açılır, `ask` (read 'box') vuruşunda doldurulur.
