# 05 — Rakip / Emsal Araçlar: Dijital Sözel Problem Çözme + Bar Model (6–12 yaş)

Hazırlayan: EdTech ürün araştırması (ajan), 2026-09-27. Amaç: DokunSay platformunda müstakil bir **"Problem Çözme"** aracı için tasarım girdisi.

## Kanıt düzeyi etiketleri (her iddiada)

- **[G1] Doğrudan görüldü** — üreticinin/ürünün kendi sayfası WebFetch ile açıldı ve iddia o sayfanın metninde okundu.
- **[G2] İkincil kaynak** — öğretmen blogu, inceleme, araştırma makalesi vb. (WebFetch ile açıldı ama ürünün kendisi değil).
- **[G3] Arama özeti / doğrulanmadı** — yalnız arama sonuç özetinden ya da kaynak sayfa açılamadı (403/500/JS-only).

**Önemli sınırlılık:** İncelenen araçların çoğu JavaScript/Canvas uygulaması; WebFetch yalnızca sayfa metnini okuyabildiği için **hiçbir ürün etkileşimli olarak oynatılmadı**. Etkileşim mekaniği (sürükle-bırak, geri bildirim) hakkındaki bilgiler ürün tanıtım metinlerinden ve ikincil kaynaklardan derlenmiştir. Açılamayan sayfalar: Brainingcamp ürün sayfaları (yalnızca başlık döndü), Didax (403), Prodigy yardım (403), NCTM Notice & Wonder (402), ST Math Academy (500), Toy Theory (SSL hatası), Common Sense incelemeleri (program Ocak 2026'da durdurulmuş; bir Common Sense Media incelemesi okunabildi).

---

## (A) Özet tablo — ürün × 10 boyut

Kısaltmalar: SB = sürükle-bırak; ÖÇ = öğretmen; ? = bilgi bulunamadı/doğrulanamadı. Kanıt etiketleri (B) bölümündeki ürün notlarında ayrıntılı.

| # | Ürün | (1) Çocuk ne yapıyor | (2) Şema/bar nasıl kuruluyor | (3) Adım/iskele | (4) Problem türü kapsamı | (5) Seviyelendirme | (6) Sesli okuma / erişilebilirlik | (7) ÖÇ modu / yazdırma / projeksiyon | (8) Problem kurma | (9) Dil | (10) Güçlü / zayıf |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | **Math Playground — Thinking Blocks** (Junior, Add/Sub, Mult/Div, Fractions, Ratios, Modeling Tool) | Problemi okur/dinler → blok ve etiketleri modele SB → sayıları yerleştirir → tuş takımıyla cevap | **Yarı hazır**: iskelet sistem tarafından; çocuk blok + etiket yerleştirir; bilinmeyen **"?"**; sayılar girilince bloklar **yeniden ölçeklenir** | 3–4 adım (etiket → sayı → çöz), her adımda "Check"; adım adım ipucu + video | Birleştirme/ayırma/parça-bütün/karşılaştırma, "bilinmeyen her konumda", çarpma-bölme (6 model), kesir, oran | Konu→alt konu; K2–3 (Add/Sub) … oran | **Sesli okuma var** ("read aloud word problems"); görsel ipuçları; tablet uyumlu | Basılı çalışma kâğıtları, videolar, Modeling Tool (serbest çizim, projeksiyon) | Modeling Tool'da serbest (ayrıntı doğrulanmadı) | EN | + En saf "önce yapı, sonra sayı" akışı; − oyunsu değil, çözüm adımında az rehberlik |
| 2 | **Amplify (Mathigon) Polypad** — Number Bars, Fraction Bars, Balance Scale | Serbest tuval: çubukları koyar, eşit uzunluk kurar, terazide sınar | **Çocuk kurar** (serbest); 1–10 sayı çubukları sabit ölçekli | Yapılandırılmış iskele yok; ders sayfaları görev verir | Eşitlik, sayı bağları, kesir; sözel problem motoru yok | Yok (ders bazlı) | Erişilebilirlik sayfası var | ÖÇ ataması + **gerçek zamanlı izleme**; PNG/SVG dışa aktarma; WODB üreteci | Çocuk kendi WODB'sini kurabilir | **23 dil, Türkçe dahil** | + Ücretsiz, çok dilli, güçlü tuval; − problem metniyle bağ yok, geri bildirim yok |
| 3 | **Brainingcamp — Bar Models** | Bar modelleri oluşturur (bütün, parça-parça-bütün, eşit parçalar) | Çocuk/öğretmen kurar | Görev (Task) + öğretmen notları | 3 bar türü; 300+ K-8 görev | Görev bazlı | ? | Paylaşım kodu, görev kütüphanesi (ücretli) | ? | EN | + 3 bar tipini ayrı araç olarak sunar; − ürün sayfası açılamadı |
| 4 | **MathsBot — Bar Modelling** (J. Hall) | Soru yapıştırır/üretir, bar ve **küme parantezi** ekler, böler | **Çocuk/öğretmen çizer**: Add Bar, Add Brace, Total/Filled Parts, Dash (kesikli), Rotate | "New Example" + "Show Solution"; 62+ konu, zorluk kaydırıcısı | Aritmetik → istatistik (62+ konu) | Zorluk kaydırıcısı | ? | Yazdırma/kopyalama, tam ekran, basılı bar şablonları | Öğretmen soru hazırlar | EN | + Hızlı öğretmen çizim aracı, kesikli çizgi (belirsiz uzunluk); − çocuk için iskele yok |
| 5 | **Singapore Math Bar Models** (iPad, HMH) | Avatar rehberliğinde bar modeli kurar | Etkileşimli bar aracı; Guided Practice + Free Play | Talimat + örnek + rehberli pratik | Parça-bütün, karşılaştırma (+/−), eşit parçalar, karşılaştırma (×/÷), kesir | Sınıf bazlı (ör. Grade 4) | ? | ? | ? | EN | + İki mod (rehberli/serbest); − eski, erişim belirsiz |
| 6 | **Maths No Problem! Visualiser** | (ÖÇ aracı) bar oluştur, etiketle, **böl, birleştir (fuse)** | Öğretmen kurar | — | Genel | — | ? | **Projeksiyon/akıllı tahta/Apple TV**; ücretsiz | — | EN | + "Böl/birleştir" mekaniği; − çocuk aracı değil |
| 7 | **Math Learning Center apps** (Number Frames, Number Line, Number Pieces, Fractions) | Sayaç/onluk parça/çubuk yerleştirir, gruplar/ayırır | Model araçları; sözel problem motoru yok | Yok | Temsil araçları | Yok | ? | **8 karakterlik paylaşım kodu** (18 ay geçerli), görüntü kaydı, sunum | Öğretmen problem dağıtır (paylaşım koduyla) | EN (+İsp. ? doğrulanmadı) | + Ücretsiz, sade; − problem metni yok |
| 8 | **Didax Virtual Manipulatives** | Unifix, onluk çerçeve, sayı doğrusu, Cuisenaire, kesir karoları | Temsil araçları | Yok (ücretsiz etkinlik PDF'leri) | Temsil | — | ? | Gömme kodu | — | EN | + Cuisenaire çubukları; − problem desteği yok |
| 9 | **Toy Theater** | Part-Part-Whole, Number Bonds, Compare, sayaçlar | Hazır şablon + serbest yerleştirme | Yok | Parça-bütün, karşılaştırma | — | ? | Projeksiyon dostu | — | EN | + Parça-bütün şablonu; − metinle bağ yok |
| 10 | **Khan Academy** | Metni okur, cevabı yazar/seçer | Genelde hazır görsel yok; bazı alıştırmalarda bant diyagramı yorumlama | **Kademeli ipucu** ("Get a hint": her tıklama bir sonraki adımı açar, sonda cevap); ipucu soruyu yanlış sayar | Tüm dört işlem, 1–2 adımlı | Beceri/ünite + mastery | ? (Khan Kids'te sesli) | ÖÇ paneli, ödev | Yok | Çok dilli (Türkçe içerik kısmi) | + Kademeli ipucu modeli; − yapı yerine sonuç odaklı |
| 11 | **ST Math (MIND)** | **Dilsiz görsel bulmacalar** (JiJi penguen), sonra "Language Integration" bulmacaları | Görsel-uzamsal model; bar değil | Anlık görsel geri bildirim (yanlışın sonucu animasyonla gösterilir) | Sayı duyusu → işlemler; sözel dile köprü | ~4000 bulmaca/sınıf | Dil engeli kaldırılmış | ÖÇ paneli | Yok | Dilsiz + EN | + "Önce anla, sonra kelime"; − klasik sözel problem az |
| 12 | **DreamBox (Discovery Ed.)** | Uyarlanır derslerde sanal manipülatif; **etkileşimli sözel problem aracı** | Bar model manipülatifi var; bant diyagramı | Uyarlanır | K-8 | Uyarlanır | ? | ÖÇ araçları | Yok | EN/İsp. ? | + Uyarlanırlık; − araç **anahtar kelime vurgulamayı** teşvik ediyor (anti-desen) |
| 13 | **Zearn** | Video + dijital model + "pause point"; RDW (Oku-Çiz-Yaz) | Çocuk bant diyagramı çizer (kâğıt/ekran) | RDW: oku → çiz+etiketle → denklem → cümleyle cevap; cümle kalıpları | Eureka/EngageNY müfredatı | Sınıf/misyon | Videolar sesli | Basılı sözel problem sayfaları, küçük grup dersleri | Yok | EN/İsp. | + Cümle kalıbı + cümleyle cevap; − çizimi değerlendirmez |
| 14 | **Pirate Math Equation Quest** (Vanderbilt/TAMU) | Açık öğretim + şema tanıma + denklem kurma | Şema diyagramları: **Total, Difference, Change, Equal Groups** | 3×/hafta, 13–16 hafta, 30–35 dk | 4 şema, tek/çok adımlı | 3.–4. sınıf | — | İndirilebilir kitaplar + öğretim videoları | Yok | EN | + RKÇ kanıtlı (Powell vd. 2019, 2021); − dijital oyun değil, müdahale paketi |
| 15 | **IXL** | Soru → cevap (SB, boşluk doldurma, resimle sayma) | Hazır görseller | Yanlıştan sonra açıklama; SmartScore | Geniş | Sınıf/beceri | **Hoparlör simgesi**: soru, şık ve açıklama sesli (K-2 varsayılan, 3-8 genişletilebilir); el yazısı tanıma | ÖÇ raporları | Yok | EN/İsp. | + Tutarlı sesli okuma; − sonuç odaklı, model yok |
| 16 | **Prodigy** | RPG oyunu içinde soru çözer | Model yok | Oyun içi yardımlar | 1–8. sınıf | Uyarlanır | **Her soruda TTS** (120.000+ satır kayıt); şıklar da okunur | ÖÇ paneli | Yok | EN/İsp. | + TTS kapsamı; − oyun süresi matematik süresini yutar |
| 17 | **Math Is Fun** | Okur (statik) | Yok | "İngilizceyi cebire çevir"; **anahtar kelime tablosu** | Ortaokul+ | — | — | Yazdırılabilir | Yok | EN | + Yanıltıcı ifade uyarısı ("S = A − 2"); − anahtar kelime listesi (anti-desen) |
| 18 | **Solve It!** (Montague) | 7 bilişsel adım: Oku, Kendi sözünle söyle, Görselleştir, Plan kur, Tahmin et, Hesapla, Kontrol et | Çocuk çizer (Görselleştir adımı) | Her adımda SAY-ASK-CHECK öz-düzenleme | Genel | — | — | Basılı müdahale | Yok | EN | + ÖÖG için kanıtlı üst-biliş; − dijital değil |
| 19 | **Desmos Classroom (Amplify)** | Kart sıralama, grafik, yazılı cevap; ÖÇ yapımı etkinlikler | Kart sıralama ile yapı eşleştirme | ÖÇ akış kontrolü (duraklat, kilit) | ÖÇ'ye bağlı | — | ? | **Güçlü ÖÇ paneli, sınıf paylaşımı** | ÖÇ kurar; çocuk yazarak soru üretebilir | Çok dilli | + Kart sıralama = şema tanıma pratiği; − ilkokul içeriği sınırlı |
| 20 | **Sınıf rutinleri** (Numberless WP, 3-Act, Notice & Wonder, WODB, Open Middle, Problem String) | Bkz. (D) | — | — | — | — | — | — | Çoğunda **merkezde** | — | Dijitale çevrilecek formatlar |

---

## (B) Ürün notları + kaynaklar

### B1. Math Playground — Thinking Blocks (en yakın emsal)
- **Modüller:** Junior, Addition, Multiplication, Fractions, Ratios + "Thinking Blocks Tool" (modelleme aracı). Paket özellikleri: "read aloud word problems", görsel ipuçları, temalar, mobil uyum. **[G1]** https://www.mathplayground.com/thinkingblocks.html
- **Add/Sub kapsamı:** 2–3. sınıf; 100 içinde tek ve iki adımlı; ekleme, çıkarma, birleştirme, ayırma, karşılaştırma, **bilinmeyen her konumda**. Temasız "Basic Version" da var. **[G1]** https://www.mathplayground.com/tb_addition/index.html
- **Akış:** 1) Etiketleri modele yerleştir (çocuk her cümleyi yeniden okuyup "parça mı bütün mü?" tartışır) → Check; 2) Sayıları yerleştir, **"?" eksik sayıyı temsil eder** → Check; 3) Program **blokları yeniden boyutlandırır** — "blok boyutu eksik sayı hakkında ne söylüyor?" tartışması; 4) Çözüm. **[G2]** https://www.mathcoachscorner.com/2015/05/modeling-addition-and-subtraction-structures/
- Önce **sayı yok**: çocuk blok ve etiketleri doğru konumlandırmadan sayı giremez; bu, hesaplamaya kaçışı engeller. Mult/Div'de 6 problem çözme modeli tanıtılır. **[G3]** (arama özeti; edshelf/Common Sense) https://edshelf.com/tool/thinking-blocks-multiplication/
- Son adımda **sayı tuş takımı** çıkar, cevap girilip kontrol edilir. **[G2]** https://gomezelementarymathematics.wordpress.com/2015/11/03/thinking-blocks-online-math-tool/
- Common Sense Media: Singapur yönteminin "sadık" bir temsili; video + adım adım ipucu, yıldız ve sertifika; **zayıf yanı**: etkileşim "eğlenceden çok iş gibi", **çözüm adımında sınırlı rehberlik**. Yaş 7+. **[G2]** https://www.commonsensemedia.org/website-reviews/thinking-blocks
- Math Playground blogu: öğretmene üç adımlı yaklaşım — önce sayı/etiket olmadan blok modeli, sonra parantez, "Modelde ne fark ediyorsun?" sorusu; okuma güçlüğü çeken ve dil öğrenen çocuklar için özellikle yararlı. Basılı Thinking Blocks sayfaları ve sözel problem veritabanı var. **[G1]** https://www.mathplayground.com/blog-model-your-word-problems.html · https://www.mathplayground.com/printable-thinking-blocks.html
- iPad uygulamaları (Add/Sub, Mult/Div, Fractions, Ratios), ilerleme takibi. **[G2]** https://singaporemathsource.com/new-bar-modeling-ipad-apps/

### B2. Amplify (eski Mathigon) Polypad
- Ücretsiz, girişsiz; **23 dil (Türkçe dahil)**; erişilebilirlik sayfası; öğretmen ataması + öğrenci çalışmasını **gerçek zamanlı izleme**. **[G1]** https://polypad.amplify.com/
- Number Bars ders örneği: zar at → her sayı için çubuk koy → başka çubuklarla aynı uzunluğu kur → **terazide sayı kartlarıyla eşitliği sına**. **[G1]** https://polypad.amplify.com/lesson/equality-with-number-bars
- WODB üreteci: karo tipi seç → "Generate" → rastgele 4'lü; çizim/not araçları, PNG/JPG/SVG dışa aktarma; çocuk kendi WODB'sini kurabilir. **[G1]** https://polypad.amplify.com/lesson/wodb

### B3. Brainingcamp — Bar Models
- Üç bar türü: **bütün, parça-parça-bütün, bütünün eşit parçaları**; model "sayılara değil, matematik hikâyesinin kendisine" bağlı. 300+ K-8 görev, öğretmen notları, paylaşım kodu. **[G3]** (ürün sayfaları WebFetch'te yalnız başlık döndürdü; arama özeti) https://www.brainingcamp.com/bar-models · https://www.brainingcamp.com/blog/posts/making-math-visual-understanding-bar-models-in-problem-solving

### B4. MathsBot — Bar Modelling (Jonathan Hall)
- Kılavuz: Add Bar (boş bar), Add Brace (küme parantezi), boş daire, Rotate (90°), **Dash** (seçili nesnelere kesikli dış çizgi). Kullanım: canlı sınıf modellemesi + hazır soru üretimi. **[G1]** https://mathsbot.com/manual?id=8
- Araç arayüzü metni: Tidy, Add Pie, Delete; Value/Length/Height alanları; **Total Parts / Filled Parts**; 62+ konu menüsü, zorluk kaydırıcısı, "New Example", "Show Solution", yön-kopyala okları, tam ekran. **[G1]** https://mathsbot.com/manipulatives/bar
- Soru yapıştırma, yazdırma/kopyalama; basılı bar şablonları. **[G3]** https://mathszone.co.uk/using-applying/bar-modelling-mathsbot/ · https://mathsbot.com/printables/bars

### B5. Singapore Math Bar Models (iPad, HMH)
- Avatar rehberli talimat + örnek, etkileşimli bar aracı, **Guided Practice + Free Play** modları; türler: parça-bütün (+/−), karşılaştırma (+/−), eşit parçalar/bütün, karşılaştırma (×/÷), kesir modelleri. **[G3]** (Amazon sayfası 500 verdi; arama özeti) https://www.amazon.com/Singapore-Math-Bar-Models-Grade/dp/B00D3L8334

### B6. Maths No Problem! Visualiser
- Bar modelleri etiketleme, **bölme, birleştirme (fuse)**; projeksiyon/etkileşimli tahta/Apple TV; ücretsiz. **[G2]** https://fvachhiat.substack.com/p/making-maths-visual-and-accessible

### B7. The Math Learning Center (MLC) uygulamaları
- Liste: Fractions, Geoboard, Math Clock, Vocabulary Cards, Money Pieces, Number Chart, Number Frames, Number Line, Number Pieces, Number Rack, Partial Product Finder, Pattern Shapes, Whiteboard. Tüm uygulamalarda **8 karakterlik kod/bağlantı ile paylaşım** (18 ay). **[G1]** https://www.mathlearningcenter.org/apps
- Number Pieces: birler/onlar/yüzler; onluk gruplama/bozma; 3 renk; dizi kurma; "genişleyen kenar" ölçü aracı; görüntü kaydı. Kalem/metin kutusu/dil desteği sayfada belirtilmemiş. **[G1]** https://www.mathlearningcenter.org/apps/number-pieces
- Sözel problem motoru yok; öğretmen problemi paylaşım koduyla dağıtır.

### B8. Didax Virtual Manipulatives
- Unifix küpleri, onluk çerçeve, sayı doğrusu, rekenrek, kesir karoları, iki renkli sayaçlar, 120'lik tablo, renk karoları, onluk bloklar, **Cuisenaire çubukları**; ücretsiz etkinlik PDF'leri; gömme kodu. **[G3]** (didax.com 403) https://www.didax.com/math/virtual-manipulatives.html · https://jodidurgin.com/free-digital-manipulatives-for-elementary-math/

### B9. Toy Theater (Toy Theory)
- Sanal manipülatifler: **Part Part Whole, Number Bonds, Compare**, Number Frames, sayaçlar, rekenrek, onluk bloklar. Araç başına metin/not özelliği belirtilmemiş. **[G1]** https://toytheater.com/category/teacher-tools/virtual-manipulatives/ (toytheory.com SSL hatası verdi)

### B10. Khan Academy
- İki yardım türü: soru sırasında **ipuçları**, gönderimden sonra **gerekçeler**. "Get a hint" her tıklamada bir sonraki çözüm adımını, en sonda cevabı gösterir; ipucu kullanımı soruyu yanlış sayar; önce denemeyi öneren "bilişsel çaba" gerekçesi. **[G3]** https://blog.khanacademy.org/how-should-people-practice-on-khan-academy/ · https://khan-exercises.readthedocs.io/en/latest/exercises/hints.html
- 2. sınıf "100 içinde 2 adımlı" alıştırmaları ve videoları mevcut; alıştırma sayfası JS olduğundan içerik görülmedi. **[G3]** https://www.khanacademy.org/math/cc-2nd-grade-math/cc-2nd-add-subtract-100/cc-2nd-more-fewer-100/e/addition-and-subtraction-word-problems-within-100--level-3

### B11. ST Math (MIND Education)
- Uzamsal-zamansal akıl yürütme; **dilsiz** bulmacalar; çocuk görsel geri bildirimle fikir sınar, **sembol ve dil sonradan** gelir; JiJi penguen başarıda ekrandan geçer. **[G3]** https://www.stmath.com/instructional-resources · https://st-math.fandom.com/wiki/JiJi
- Sınıf başına ~4000 bulmaca; bir kısmı "Language Integration" (sembol/anahtar kelime gömülü). Erken örnek: yaratık sayısına göre ayakkabı sayısı seçme (bire bir eşleme). **[G3]** (Academy sayfası 500) https://play.stmath.com/academy/modules/where_are_the_words/

### B12. DreamBox (Discovery Education)
- Sanal manipülatifler arasında bar model; derslerde bant diyagramı. **[G3]** https://www.discoveryeducation.com/solutions/math/dreambox-math/k-8-math-lesson-samples/
- 2020 duyurusu: kelimeleri ve sembolleri denklemlere bağlayan etkileşimli sözel problem aracı; arama özetine göre **anahtar kelimeleri vurgulayıp üstlerine sembol yazmayı** teşvik ediyor. **[G3]** (BusinessWire 403) https://www.businesswire.com/news/home/20200805005363/en/
- DreamBox rehber içerikleri (ürün değil) "anahtar kelimeleri daire içine al/vurgula" öneriyor. **[G1]** https://www.dreambox.com/math/guides/two-step-word-problems

### B13. Zearn
- Dijital dersler: kısa videolar, "etkileşimli matematik modelleri" (dijitalleştirilmiş somut + resimsel), **pause point**, her problemde anlık geri bildirim, takılınca yerleşik yardım, ekranda düşüncesini anlatan çocuklar. **[G1]** https://about.zearn.org/digital-lessons
- Basılı sözel problem sayfaları RDW (Read-Draw-Write) düzeninde: problem → çizim alanı (bant diyagramı) → **cümle kalıpları** → cümleyle cevap. **[G1]** https://webassets.zearn.org/resources/G02M04_Word_Problems_2018.pdf
- RDW: tamamını oku → okuma-çizme dönüşümlü → denklem → cümle; çocuk bant diyagramı ya da sayı bağı seçebilir. **[G3]** https://greatminds.org/math/blog/eureka/read-draw-write-making-word-problems-less-problematic
- Not: Görev tanımındaki Zearn "tell a story" adlı bir bileşen doğrulanamadı; bulunan yapı RDW'dir.

### B14. Pirate Math / Pirate Math Equation Quest
- Dört şema: **Total, Difference, Change, Equal Groups**; okuma, yorumlama, kurma, çözme; eşittir işareti ve denklem çözme. 3. sınıf küçük grup/bireysel (tek adım), 4. sınıf bireysel (tek+çok adım); 3×/hafta, 13–16 hafta, 30–35 dk. Zorluk yaşayan 3–4. sınıf öğrencilerinde sözel problem performansı artışı (Powell, Berry & Barnes 2019; Powell vd. 2021). **[G1]** https://www.piratemathequationquest.com/about.html
- Pirate Math (Fuchs): şema öğretimi + sayma stratejileri; Tier 1 ve Tier 2; birden çok RKÇ. **[G3]** https://www.evidenceforessa.org/program/pirate-math/
- Tam dijital, çocuk-yüzlü bir Pirate Math uygulaması bulunamadı; Equation Quest indirilebilir kitap + video paketidir.

### B15. IXL
- Hoparlör simgesi soru, şık ve açıklamaları okur; K-2 varsayılan, 3-8 matematik genişletilebilir; mobilde el yazısı tanıma; QR kartla giriş; SB, boşluk doldurma, resimle sayma, sıralama; ödül panosu. **[G1]** https://blog.ixl.com/2020/09/17/ixl-features-that-support-young-learners/

### B16. Prodigy
- Her soruda hoparlör simgesiyle TTS; 120.000+ satır ses; soru ve şıklar okunur; İspanyolca geçişi. **[G3]** (yardım merkezi 403) https://prodigygame.zendesk.com/hc/en-us/articles/39453675398420-Text-to-Speech

### B17. Math Is Fun
- "İngilizceyi cebire çevir, sonra çöz"; oku, çiz, değişken ata, soruyu yaz; **anahtar kelime → işlem tablosu** ("combined" = toplama, "fewer" = çıkarma…) ama yanıltıcı ifade uyarısı da var: "Sam, Alex'ten 2 dolar az" → S = A − 2. **[G1]** https://www.mathsisfun.com/algebra/word-questions-solving.html

### B18. Solve It! (Marjorie Montague)
- 7 adım: Oku, Kendi sözünle anlat, Görselleştir, Hipotez/plan, Tahmin, Hesapla, Kontrol; her adımda **SAY (öz-yönerge), ASK (öz-sorgulama), CHECK (öz-izleme)**; özel gereksinimli öğrencilerde etkili bulunmuş. **[G3]** https://files.eric.ed.gov/fulltext/EJ1262581.pdf · https://www.exinn.net/excerpts/SIM001.pdf
- Dijital "Solve It!" materyali bulunamadı; basılı müdahale paketi.

### B19. Desmos Classroom (Amplify)
- Kart sıralama bileşeni (tek doğru olmayan sıralamalar dahil), ilkokulda "ne fark ettin/ne merak ettin" istemleri, öğretmen yapımı etkinlikler. **[G3]** https://mattcoaty.com/2018/06/06/an-elementary-desmos-journey/ · https://teacher.desmos.com/activitybuilder/custom/5afddea619199254b4d3c974

### B20. Kanıt ve çerçeve kaynakları (araç değil)
- **IES/WWC 2021 Uygulama Rehberi** (ilkokulda matematik müdahalesi): 6 öneri, hepsi güçlü kanıt etiketli; öneri 5 "sözel problemlerde kasıtlı öğretim". **[G1]** https://ies.ed.gov/ncee/wwc/PracticeGuide/26 — Öneri 5'in içeriği: **saldırı stratejisi** (genel plan) + **şema öğretimi** (problem türüne göre sınıflama, türe özgü çözüm, problem dilini anlama). **[G3]** https://irrc.education.uiowa.edu/blog/2025/05/literacy-every-subject-math-and-word-problems-part-2-2
- **Şema temelli öğretim meta-analizleri:** g = 0.81–1.01 (Myers vd. 2022, öğrenme güçlüğü), g = 1.57 (Peltier & Vannest 2017). **[G3]** https://www.researchgate.net/publication/319971053_A_Meta-Analysis_of_Schema_Instruction_on_the_Problem-Solving_Performance_of_Elementary_School_Students
- **NCETM bar modeli:** "problem çözme yöntemi değil", yapıyı görünür kılan temsil; somut → resimsel geçiş (nesne dizisi → bar yanında küpler → "ne aynı, ne farklı?"); tek diyagram 4 ilişkili denklemi gösterir; karşılaştırma farkı görmede değerli; çarpma/bölmede birimleme; eşli çalışma (biri nesneyi oynatır, diğeri kaydeder); **çocukların bar yapısından kendi problemlerini yazması** akıcılık sağlar. **[G1]** https://www.ncetm.org.uk/classroom-resources/ca-the-bar-model/
- **"Süresi dolan kurallar"** (Karp, Bush & Dougherty 2014): "anahtar kelime kullan" süresi dolan bir kural; çocuklar sayıları bağlamdan koparıp hesaplamaya itilir; çok adımlı problemlerde çöker. **[G3]** https://irrc.education.uiowa.edu/tags/keyword-strategy · https://corwin-connect.com/2020/12/words-matter-three-ways-to-avoid-harm-in-the-mathematical-language-we-use/

---

## (C) En iyi etkileşim desenleri

### C1. Bar modeli sürükle-bırak mekaniği — üç yaklaşımın kıyası

| Yaklaşım | Örnek | Artı | Eksi | DokunSay için |
|---|---|---|---|---|
| **Yuvaya yerleştirme** (iskelet hazır, çocuk etiket/blok taşır) | Thinking Blocks (B1) | Hata alanı dar, otomatik denetlenebilir, okuma güçlüğüne dost | Çocuk modeli "seçmez", yalnız doldurur; transfer sınırlı | **Başlangıç düzeyi** (L1–L2) |
| **Şema seçme + doldurma** (2–4 şema kartından birini seç, sonra doldur) | Pirate Math şemaları (B14), Brainingcamp 3 bar türü (B3), Singapore iPad türleri (B5) | Şema tanıma = IES öneri 5'in çekirdeği; yanlış şema seçimi tanısal veri | Şema sayısı artınca bilişsel yük | **Çekirdek düzey** (L2–L4) |
| **Serbest kurma** (bar ekle, böl, birleştir, parantez) | MathsBot (B4), Polypad (B2), MNP Visualiser (B6) | Gerçek modelleme, çoklu çözüm | Otomatik değerlendirme zor; küçük çocukta motor yük | **İleri düzey + öğretmen/projeksiyon modu** |

Öneri: **kademeli serbestlik** — aynı problem motoru üç kipte sunulur; ilerledikçe iskelet azaltılır (fading). Kaynak mantığı: Thinking Blocks → MathsBot arasındaki yelpaze + IES şema öğretimi.

### C2. Bilinmeyen "?" kutusu
- Thinking Blocks'ta "?" eksik sayıyı temsil eder ve bilinmeyen **her konumda** olabilir (başlangıç, değişim, sonuç; parça veya bütün) (B1). NCETM: bar modeli bilinmeyeni temsil etmede cebire öncüldür (B20).
- Desen: "?" bir **sürüklenebilir jeton**tur; çocuk onu kendisi doğru segmente koyar (sistem koymaz). Yanlış konum = en değerli tanısal hata (ör. "Değişim bilinmeyen" problemde "?"yi bütüne koymak).
- "?" kutusu cevap girilince **sayıya dönüşür** ve bar yeniden ölçeklenir (Thinking Blocks yeniden boyutlandırma, B1).

### C3. Ölçekli / ölçeksiz çubuk
- Thinking Blocks sayılar girilene kadar blokları **ölçeksiz/tahmini** tutar, sonra **ölçekler**; ölçekleme sonrası "blok boyutu ne söylüyor?" tartışması (B1). MathsBot **kesikli kenar (Dash)** ile "uzunluğu belirsiz" segmenti gösterir (B4). Polypad Number Bars ise **sabit ölçekli** (B2).
- Desen: kurma aşamasında **"yaklaşık" (ölçeksiz, kesikli kenarlı)**, doğrulama aşamasında **"gerçek ölçek"** — iki kip arasında animasyonlu geçiş. Bu geçiş, çocuğun kendi tahminiyle (Solve It! "Tahmin et" adımı, B18) karşılaştırma fırsatı verir.
- Küçük sayılarda (≤20) birim kareli ölçekli bar (DokunSay somut materyaliyle bire bir); büyük sayılarda ölçeksiz bar — NCETM somut → resimsel geçişiyle uyumlu (B20).

### C4. Parça ekle / böl / birleştir
- MNP Visualiser: etiketle, **böl, birleştir (fuse)** (B6). MathsBot: **Total Parts / Filled Parts** alanları, küme parantezi, yön-kopyalama (B4). Brainingcamp: "bütünün eşit parçaları" ayrı bar türü (B3).
- Desen: iki hareket yeterli — **"Böl" (çubuğa uzun basınca 2–10 eşit parça seçici)** ve **"Parantez" (seçili segmentlerin üstüne/altına toplam parantezi)**. Birleştirme = parantez ile toplamı göstermek (ayrı bir birleştirme komutu küçük çocukta gereksiz karmaşa).
- Çarpma/bölme için **birim çubuk** (tek birimi tanımla → kopyala): NCETM birimleme vurgusu (B20), Thinking Blocks Mult/Div 6 model (B1).

### C5. Çoklu çözüm / çoklu temsil
- NCETM: tek bar diyagramından 4 ilişkili denklem okunur (B20). Zearn: çocuk bant diyagramı **veya** sayı bağı seçebilir (B13). Open Middle: aynı yapıda birden çok geçerli cevap, "en yakın/en büyük" kısıtları (D5).
- Desen: bar tamamlanınca **"Bu modelden başka hangi işlemler yazılabilir?"** ekranı — 4 kart (a+b=c, b+a=c, c−a=b, c−b=a) sürükle-eşleştir. Toplama-çıkarma tersliğini görünür kılar.

### C6. Adım yapısı ve geri bildirim
- Thinking Blocks: her adımda ayrı "Check" (B1). Khan: kademeli ipucu (her tıklama bir adım), ipucu soruyu yanlış sayar (B10). ST Math: yanlışın **sonucunu görsel olarak göster** (penguen düşer/ulaşamaz) — metinle "yanlış" demek yerine (B11). Zearn: takılınca yerleşik yardım, pause point (B13).
- Desen: **adım başına denetim + yanlışın görsel sonucu + 3 kademeli ipucu** (1: soruyu yeniden oku/sesli; 2: şemayı hatırlat; 3: bir parçayı doldur) — cevabı hiçbir zaman ipucu olarak vermemek. İpucunu cezalandırma (Khan'daki gibi yanlış sayma) diskalkuli kitlesinde kaygı yaratabilir; ipucu kullanımını **ayrı** kaydet.

### C7. Sesli okuma
- Thinking Blocks sözel problemleri sesli okur (B1); IXL soru + şık + açıklama (B15); Prodigy her soruda TTS (B16). Desen: **cümle cümle okuma + okunan cümlenin vurgulanması**, cümleye dokununca yeniden okuma (Thinking Blocks'taki "her cümleyi yeniden oku, parça mı bütün mü?" adımının dijital karşılığı).

---

## (D) Sınıf formatlarının dijital karşılığı

| Format | Özü (kaynak) | Dijital karşılık (DokunSay önerisi) |
|---|---|---|
| **D1. Numberless Word Problems** (Brian Bushart) | "Anlamlı olsun diye sayıları çıkar"; CGI türleri: Join, Separate, Part-Part-Whole, Compare, Equal Groups + çarpma/bölme, çok adımlı; K-2 ve üst sınıf sunumları; CC BY-NC. **[G1]** https://numberlesswp.com | **Aşamalı açılım kartı**: 1) Durum cümlesi sayısız ("Ali'nin bilyeleri vardı. Bir kısmını verdi.") → çocuk bar iskeletini seçer; 2) Sayılar tek tek belirir; 3) Soru en son gelir. Her açılımda "Ne biliyoruz? Ne merak ediyoruz?" |
| **D2. 3-Act Tasks** (Dan Meyer) | Perde 1: az kelimeli görsel çatışma, merak; Perde 2: çocuk hangi bilgiye ihtiyaç duyduğunu belirler, araç geliştirir; Perde 3: çözüm doğrudan gösterilir, devam problemleri. **[G1]** https://blog.mrmeyer.com/2011/the-three-acts-of-a-mathematical-story/ | Kısa animasyon (ör. kavanoza bilyeler dökülüyor) → "Neyi bilmek istersin?" bilgi kartları (çocuk istediği bilgiyi "satın alır") → bar ile çözer → **animasyon gerçek sonucu oynatır** (tatmin edici kapanış = ST Math görsel geri bildirimiyle aynı ilke). |
| **D3. Notice & Wonder** (Annie Fetter, Math Forum/NCTM) | Senaryoyu **sorusuz** sun; "Ne fark ediyorsun? Ne merak ediyorsun?"; giriş eşiğini düşürür, anlam kurmayı teşvik eder. **[G3]** https://mathgeekmama.com/notice-and-wonder-math-activity/ · http://s3.amazonaws.com/conference-handouts/2017-nctm-san-antonio/pdfs/1103-2515.pdf | Soru olmadan hikâye + görsel; çocuk "fark ettim" kartlarını (hazır cümleler, okumayan çocuk için sesli) seçer; "merak ediyorum" kartlarından biri **problemin sorusu** olur. |
| **D4. Which One Doesn't Belong** (Bourassa/Danielson) | 4 nesne, her biri savunulabilir "ait değil"; "doğru olanın ölçüsü doğru olandır"; kategoriler: şekil, sayı, grafik, ifade, fotoğraf, eksik set. **[G1]** https://talkingmathwithkids.com/wodb-about/ · Polypad üreteci **[G1]** https://polypad.amplify.com/lesson/wodb | **4 bar modeli / 4 problem kartı**: "Hangisi farklı?" — ör. 3 parça-bütün + 1 karşılaştırma; ama her kart için bir gerekçe kabul edilir (gerekçe seçimi sesli kartlarla). Şema ayırt etme pratiği, puansız. |
| **D5. Open Middle** | Kutulara rakam yerleştirme (çoğunlukla 1–9 bir kez), birden çok çözüm, "en büyük/en yakın" kısıtları; K-12. **[G1]** https://www.openmiddle.com/ | Bar modeli sabit, sayı kutuları boş: "Toplamı 20'ye en yakın yap"; çocuk rakam kartlarını sürükler; birden çok doğru; **en iyi çözüm** rozeti yerine "başka bir yol buldun!" sayacı. |
| **D6. What's the Question?** (soru yok, çocuk kurar) | Notice & Wonder'ın "soruyu kaldır" ilkesi + NCETM "bar yapısından kendi problemini yaz" (B20) | Hikâye + sayılar verilir, soru yok; çocuk **soru kartları** arasından cevaplanabilir olanları seçer ya da kalıpla kurar ("___ toplam kaç ___?"). Cevaplanamayan soru ("Ali kaç yaşında?") ayırt etme görevi. |
| **D7. Problem String** (Pam Harris) | İlişkili problemlerin bilinçli dizisi; yardımcı problemler + "clunker"; bir seferde bir problem; bağlantıları görünür kılma. **[G1]** https://www.mathisfigureoutable.com/blog/problem-string | **Aynı bar iskeleti, değişen bilinmeyen**: 3–4 problemlik dizi (sonuç bilinmeyen → değişim bilinmeyen → başlangıç bilinmeyen); önceki modeller ekranda küçük önizleme olarak kalır, benzerlik görünür. |
| **D8. Same Story, Different Question** | Aynı hikâyeden farklı sorular (NCETM'in "tek diyagram, 4 denklem" ilkesinin sözel karşılığı, B20) | Bir hikâye → bar modeli bir kez kurulur → ardışık 3 soru (parça? bütün? fark?) aynı model üzerinde "?"nin yer değiştirmesiyle çözülür. Model yeniden kurulmaz; yapı sabitliği vurgulanır. |
| **D9. Solve It! / RDW rutini** (B13, B18) | Oku-Kendi sözünle-Görselleştir-Plan-Tahmin-Hesapla-Kontrol; RDW: Oku-Çiz-Yaz + cümle kalıbı | Aracın **sabit adım çubuğu** olarak (5 simgeli: Dinle/Oku → Model → Bilinmeyen (?) → İşlem (=) → Cevap cümlesi). Tahmin adımı: sonuçtan önce "yaklaşık kaç?" kaydırıcısı. |

---

## (E) DokunSay "Problem Çözme" aracı için 15 öneri

| # | Özellik | Neden | Kaynak |
|---|---|---|---|
| E1 | **"Önce yapı, sonra sayı" kilidi**: çocuk etiketleri/şemayı doğru kurmadan sayı alanları açılmaz | Hesaplamaya kaçışı engeller; Thinking Blocks'un ayırt edici gücü | B1 (mathcoachscorner, edshelf) |
| E2 | **Şema kartıyla başla**: 4 temel şema (Toplam/Birleştirme, Değişim, Fark/Karşılaştırma, Eşit Gruplar) arasından seçim; yanlış seçim tanısal kayıt | IES öneri 5 şema öğretimi; meta-analiz g≈0.8–1.6; Pirate Math'in 4 şeması | B14, B20 |
| E3 | **Kademeli serbestlik (3 kip)**: Yuvaya yerleştir → Şema seç+doldur → Serbest kur (böl/parantez) | İskeletin azaltılması; farklı düzeydeki çocuklara aynı motor | C1; B1, B4, B6 |
| E4 | **Sürüklenebilir "?" jetonu**, bilinmeyen her konumda (başlangıç/değişim/sonuç; parça/bütün/fark) | Bilinmeyenin konumu problem zorluğunun ana belirleyicisi; Thinking Blocks "unknowns in all positions" | B1 (tb_addition), B20 (NCETM cebir öncülü) |
| E5 | **Ölçeksiz → ölçekli geçiş animasyonu**: kurarken kesikli/yaklaşık, doğrulamada gerçek ölçek; öncesinde "yaklaşık kaç?" tahmini | Blok boyutu tartışması + tahmin öz-denetimi | B1, B4 (Dash), B18 (Solve It! Tahmin) |
| E6 | **DokunSay somut materyaliyle birim-kareli bar** (≤20'de birim birim, üstünde ölçeksiz bar) | Somut → resimsel geçiş; DokunSay'in dokunsal kimliğiyle süreklilik | B20 (NCETM progression) |
| E7 | **Cümle cümle sesli okuma + vurgulama; cümleye dokun → tekrar oku → "bu cümle modelin neresi?"** | Okuma yükünü matematikten ayırır; Thinking Blocks cümle-etiket eşleme rutini | B1, B15, B16 |
| E8 | **Numberless modu (aşamalı açılım)**: durum → sayılar → soru | Anlamayı sayı görmeden kurar; CGI türlerine göre hazır banka var (CC BY-NC — içerik değil biçim uyarlanmalı) | D1 (numberlesswp.com) |
| E9 | **"Soruyu sen kur" modu**: hikâye + sayılar, soru yok; cevaplanabilir/cevaplanamaz soru ayırt etme + kalıpla soru kurma | Problem kurma; Notice & Wonder "soruyu kaldır"; NCETM "kendi problemini yaz" | D3, D6, B20 |
| E10 | **Aynı hikâye, farklı soru + dört denklem ekranı**: model bir kez kurulur, "?" yer değiştirir; bitince 4 ilişkili denklem eşleştirilir | Yapı sabitliği, toplama-çıkarma tersliği | B20 (NCETM 4 denklem), D7, D8 |
| E11 | **Adım başına denetim + yanlışın görsel sonucu + 3 kademeli ipucu (cevabı asla vermeyen)**; ipucu cezasız ama ayrı kaydedilir | Anlık geri bildirim; "yanlış" etiketi yerine görsel sonuç kaygıyı azaltır | B1, B10, B11, B13 |
| E12 | **Cümleyle cevap (cümle kalıbı)**: "Ali'nin ___ bilyesi kaldı." — birim ve bağlamla | Cevabı bağlama geri bağlar, anlamsız cevabı yakalar | B13 (Zearn RDW), B18 (Kontrol) |
| E13 | **Öğretmen/projeksiyon modu**: serbest bar tuvali (böl, parantez, kesikli, döndür), büyük dokunma hedefleri, PNG dışa aktarma, basılı bar şablonu | Sınıfta canlı modelleme ve kâğıt sürekliliği; MathsBot/MNP/Thinking Blocks printable emsali | B4, B6, B1 (printables) |
| E14 | **Paylaşım kodu ile öğretmenin problem dağıtması + problem yazma formu** (öğretmen kendi hikâyesini, şemasını, bilinmeyen konumunu seçer) | MLC 8 karakterlik kod deseni; yerel/bulutsuz mimariyle uyumlu (kod = problem tanımını kodlayan kısa dize olabilir) | B7 |
| E15 | **Çok dillilik (TR/KU/EN) + şema adlarının terminoloji sözlüğüne bağlanması**; okunan metin ile ekrandaki metin birebir aynı | Polypad 23 dil emsali; dil öğrenen ve okuma güçlüğü çeken çocuk için görsel model avantajı (Math Playground notu) | B2, B1 (blog) |

Ek (öncelik dışı): WODB turu (4 bar modelinden hangisi farklı, gerekçe kartlı — D4), Open Middle mini görevi (D5), 3-Act animasyonlu açılış (D2) — haftalık "özel görev" olarak.

---

## (F) Kaçınılacak anti-desenler

1. **Anahtar kelime → işlem eşlemesi** (vurgulat/daire içine aldır, "toplam = topla" tabloları). Karp, Bush & Dougherty (2014) "süresi dolan kural" olarak işaretler; çok adımlı ve karşılaştırma problemlerinde ("Ali'nin 8 bilyesi var, bu Ayşe'ninkinden 3 fazla. Ayşe'nin kaç bilyesi var?" — "fazla" kelimesine rağmen çıkarma gerekir) çöker. Math Is Fun ve DreamBox rehberleri bu deseni içeriyor. Kaynak: B17, B12, B20.
2. **Modeli sistemin hazır çizmesi, çocuğun yalnız sayıyı yazması.** Temsil çocuğun zihninde kurulmaz; NCETM "bar modeli yöntem değil, yapıyı görmenin yolu" der. Kaynak: B20.
3. **Tek doğru şekil dayatması** (yalnız bir bar düzenini kabul etmek). Zearn çocuğa bant diyagramı ya da sayı bağı seçtirir; parça sırası, dikey/yatay gibi yüzeysel farklar hata sayılmamalı. Kaynak: B13, B4 (Rotate).
4. **İpucu = cevap / ipucunu cezalandırma.** Khan'da son ipucu cevabı verir ve ipucu soruyu yanlış sayar; topluluk forumlarında "ipucu istismarı" tartışılır. Diskalkuli kitlesinde ceza kaygıyı artırır, cevap-ipucu öğrenmeyi atlatır. Kaynak: B10.
5. **Oyun kabuğunun matematiği yutması** (RPG savaşı, uzun animasyonlar, ödül mağazası). Prodigy tipi tasarım; Thinking Blocks ise ters uçta "iş gibi" bulunmuş — denge: kısa, anlamlı görsel sonuç (ST Math). Kaynak: B16, B1 (Common Sense), B11.
6. **Tek adım için tek "Kontrol et" (sonda).** Hatanın hangi aşamada (şema, "?" konumu, sayı yerleşimi, hesap) olduğu kaybolur; adım başına denetim hem geri bildirim hem tanı verir. Kaynak: B1.
7. **Sesli okumanın yalnız soruyu kapsaması** (şıklar, ipuçları, geri bildirim okunmuyorsa okumayan çocuk yine takılır). IXL ve Prodigy şıkları ve açıklamaları da okur. Kaynak: B15, B16.
8. **Bloklu (karışık olmayan) diziler**: hep aynı şema sırası (blok halinde 10 toplama, 10 çıkarma) — şema tanıma pratiği ancak **karışık** dizilerde anlamlı; ayırt etme görevleri (WODB, şema seçimi) gerekli. Kaynak: B20 (IES şema öğretimi), D4.
9. **Ölçekli çubuğu en baştan zorunlu kılmak**: büyük sayılarda çocuk uzunluk ayarlamakla uğraşır; kurarken ölçeksiz, doğrulamada ölçekli. Kaynak: B1, B4.
10. **İçerik lisansını gözden kaçırmak**: Numberless WP materyalleri CC BY-NC; WODB setleri yazarlarına ait; Pirate Math müdahale paketi yayıncılı. **Biçim** uyarlanabilir, **metin/set** kopyalanmamalı. Kaynak: D1, D4, B14.

