# diskalkuli.com Araçlar Sayfası — Yükleme Talimatı

Tarih: 2026-05-02
Hazırlayan: Claude (DokunSay platform consolidation)

---

## Yapılacak iki iş

### A) WordPress sayfa içeriğini güncelle (HTML)
### B) DokunSayKesir uygulamasının yeni dist'ini siteye yükle

---

## A) WordPress: `/araclar/` sayfasını güncelle

**Kaynak dosya:** `_platform/wp-pages/araclar-fixed.html`

1. WordPress Admin → **Sayfalar → DokunSay Araçları** → **Düzenle**
2. Editörde **Custom HTML** (Özel HTML) bloğunu bul:
   - `<style> .dk-a-hero{...} </style>` ile başlar
   - `</section>` ile biten son `dk-a-cta` bloğuyla biter
3. O bloğun **tüm içeriğini sil**
4. `_platform/wp-pages/araclar-fixed.html` dosyasının içeriğini **yapıştır** (üstteki HTML yorumlar dahil veya hariç)
5. **Güncelle** butonuna bas
6. Ön yüzde doğrula: `https://diskalkuli.com/araclar/` → Ctrl+F5

### Bu güncellemenin getirdiği değişiklikler
| # | Yer | Önce | Sonra |
|---|---|---|---|
| 1 | Hero eyebrow | `TR/EN/KU` | `TR/KU/EN/AR/FA` |
| 2 | Hero açıklama | `... CRA, GAISE gibi` | `... CRA, Dienes, Curcio, GAISE gibi` |
| 3 | Stat 3 | `200+ Etkinlik` | `∞ Sınırsız Etkinlik` |
| 4 | Stat 4 | `5 Pedagoji` | `10 Pedagoji` |
| 5 | Araç sırası | Konu karışık | Pedagojik müfredat sırası: Çubuklar → Geometri → Saat → Basamak → Kesir → İstatistik → Tam Sayılar |

---

## B) DokunSayKesir yeni dist'ini siteye yükle

### Neden gerekli?
Yerel hash: `index-DTjOB7uM.js` (2026-04-23 build, son commit'lerle uyumlu)
Site canlı: `index-BWy03Kw8.js` (eski)

Sondaki Kesir commit'leri (son 5):
- `d76290f` Kurmancî Çubik→Çovik + bar scale korunması
- `8777073` Sayfa kaydırma (pan) + zoom
- `6b6f545` Silme alanı sağ kenara + Kurmancî düzeltmeleri
- `63cbfec` Zoom butonları + sayı doğrusu yenilendi
- `b510983` Nesne kontrolleri + literatür variants

### Yükleme adımları (cPanel veya FTP)

**Yerel kaynak:** `DokunSayKesir/dist/` (tüm içerik)
**Hedef:** `https://diskalkuli.com/dokunsay/DokunSayKesir/`
Sunucu yolu (yaklaşık): `/public_html/dokunsay/DokunSayKesir/`

1. Mevcut sunucu klasörünü yedekle (cPanel File Manager → klasörü zip'le → indir)
2. `DokunSayKesir/dist/` içeriğinin **tamamını** sunucudaki `/dokunsay/DokunSayKesir/` klasörüne yükle (üzerine yaz)
   - Özellikle `assets/index-DTjOB7uM.js` ve `assets/index-DIp2vmqm.css` dosyaları yeni
   - `index.html` da güncellenmeli (yeni asset hash'lere referans verir)
3. Yükleme bitince doğrula:
   ```bash
   curl -sL "https://diskalkuli.com/dokunsay/DokunSayKesir/" | grep -oE 'index-[A-Za-z0-9_-]+\.js'
   # Beklenen çıktı: index-DTjOB7uM.js
   ```
4. Tarayıcıda `https://diskalkuli.com/araclar/kesirler/` aç → Ctrl+F5 → yeni özellikler çalışmalı (Çovik etiketi, kalem aracı, sayfa kaydırma vb.)

### Alternatif: WP-CLI veya Git deploy
Eğer site Git deploy kuruluysa: `git pull && cp -r DokunSayKesir/dist/* /path/to/dokunsay/DokunSayKesir/`

---

## C) Diğer 6 uygulama: site ile yerel uyumlu (yapacak iş yok)

| Uygulama | Hash | Durum |
|---|---|---|
| DokunSayBar | `BNZHx9ZW` | ✓ |
| DokunSayBasamak | `61zumxTm` | ✓ |
| DokunSayClock | `qwjfO4rn` | ✓ |
| DokunSayTam | `bK9gcE8N` | ✓ (uncommitted bug fix var, build sonrası hash aynı kaldı — bundle etkisi yok) |
| Dokunsay-geo | `BhWLnu4m` | ✓ |
| Dokunsay-veri-app | `BHel2X1w` | ✓ |

---

## D) Doğrulama checklist

Yükleme sonrası kontrol et:

- [ ] `https://diskalkuli.com/araclar/` — eyebrow `TR/KU/EN/AR/FA`, stat `∞ Sınırsız Etkinlik`, `10 Pedagoji`
- [ ] Araç sırası: 1.Sayı Çubukları → 2.Geometri → 3.Saat → 4.Basamak → 5.Kesir → 6.İstatistik → 7.Tam Sayılar
- [ ] `https://diskalkuli.com/araclar/kesirler/` → Aracı Aç → yeni Kesir versiyonu (Çovik etiketi, kalem, pan, zoom)
- [ ] `https://diskalkuli.com/platform/numap.html` → 200 OK ✓ (zaten doğrulandı)
- [ ] `https://diskalkuli.com/diskalkuli-nedir/` → 200 OK ✓ (zaten doğrulandı)

---

---

## E) Prof. Dr. Yılmaz Mutlu — Kurucu / Akademik Profil sayfası

**Kaynak dosyalar:**
- `_platform/wp-pages/yilmaz-mutlu.html` — yeni profesyonel akademik profil sayfası
- `_platform/wp-pages/hakkimizda-kurucu-cta.html` — Hakkımızda sayfasına eklenecek küçük CTA kartı

### E.1) Yeni sayfa oluştur: `/yilmaz-mutlu/`

1. WP Admin → **Sayfalar → Yeni Ekle**
2. Başlık: `Prof. Dr. Yılmaz Mutlu`
3. URL (Permalink): `/yilmaz-mutlu/` (veya `/prof-dr-yilmaz-mutlu/`)
4. Şablon: **Tam genişlik** veya **Sidebar'sız**
5. Editöre **Custom HTML** bloğu ekle ve `_platform/wp-pages/yilmaz-mutlu.html` dosyasının içeriğini yapıştır
6. **Yayınla**

**Foto yükleme:**
- WP → Medya → Yeni Ekle → CV'deki Mutlu fotoğrafını yükle, dosya adı: `yilmaz-mutlu.jpg`
- HTML içindeki `/wp-content/uploads/yilmaz-mutlu.jpg` yolunu, WordPress'in verdiği gerçek URL ile değiştir (Medya kütüphanesinden kopyala). Aynı yol hem yeni sayfada hem CTA kartında geçer (2 yer).
- Yıl ay klasörü genelde otomatik eklenir, ör. `/wp-content/uploads/2026/05/yilmaz-mutlu.jpg`

### E.2) Hakkımızda sayfasına Kurucu CTA kartı ekle

1. WP Admin → **Sayfalar → Hakkımızda → Düzenle**
2. Mevcut metin bloğunun (`Diskalkuli Akademi, 2020 yılında kurulan...`) **altına** yeni bir **Custom HTML** bloğu ekle
3. `_platform/wp-pages/hakkimizda-kurucu-cta.html` içeriğini yapıştır
4. **Güncelle**
5. Doğrula: `https://diskalkuli.com/hakkimizda/` → metnin altında "Prof. Dr. Yılmaz Mutlu" kartı görünmeli, tıklayınca `/yilmaz-mutlu/` sayfasına gitmeli

### E.3) Menüye ekle (opsiyonel)

WP Admin → Görünüm → Menüler → ana menüde "Hakkımızda" altına alt menü olarak "Kurucu" ekle, link: `/yilmaz-mutlu/`

### E.4) Yayın listesinde DOI linkleri

Sayfada DOI numarası olan **12 makale** doğrudan `https://doi.org/{doi}` formatında linklendi (uluslararası 6 + ulusal 6). DOI bulunmayan makaleler düz metin olarak listelendi — uydurulmuş URL kullanılmadı.

**İleride eklenebilir** (Mutlu'dan link/kullanıcı adı bilgisi alınınca):
- ORCID profil linki (hero alanına buton olarak)
- Google Scholar profil linki
- AVESIS / YÖK Akademik profil linki
- ResearchGate profil linki
- Kişisel YouTube/akademik blog linkleri

---

## G) Numap kapsamı genişletildi: 48–96 ay → 48–119 ay (okul öncesi + ilkokul 1.–4.)

**Karar:** Numap artık okul öncesinden ilkokul 4. sınıfa kadar (4–11 yaş, 48–119 ay) ölçüm yapacak. Bu kapsam değişikliği sayfa metinlerine yansıtıldı.

### G.1) Güncellenmiş kaynak dosyalar

Hepsi `_platform/wp-pages/` altında:

| Dosya | Değişiklik | Hedef sunucu yolu |
|---|---|---|
| `numap-locale-tr.json` | 3 yer (step1_desc, numap_card.desc, numap_detail.f4_desc) | `/platform/locales/tr.json` |
| `numap-locale-en.json` | 3 yer (aynı key'ler) | `/platform/locales/en.json` |
| `numap-locale-ku.json` | 3 yer (aynı key'ler) | `/platform/locales/ku.json` |
| `numap-fixed.html` | 1 yer (line 62, f4_desc inline fallback) | `/platform/numap.html` |
| `araclar-fixed.html` | 1 yer (Numap CTA paragrafı) | WordPress: `/araclar/` Custom HTML bloğu |

### G.2) Locale dosyalarını sunucuya yükle

cPanel File Manager veya FTP ile:

1. Sunucuda `/platform/locales/` klasörünü aç
2. Mevcut `tr.json`, `en.json`, `ku.json` dosyalarını yedekle (ör. `tr.json.bak`)
3. `_platform/wp-pages/numap-locale-tr.json` → sunucudaki `tr.json` üzerine yaz (dosya adı `tr.json` olmalı, `numap-` öneki olmadan)
4. Aynı şekilde `en.json` ve `ku.json`
5. **Doğrula:**
   ```bash
   curl -sL "https://diskalkuli.com/platform/locales/tr.json" | grep -c "48–119 mehî\|48–119 ay\|48–119 months"
   # Beklenen: tr.json için "48–119 ay" 3 kez geçmeli
   ```
6. Tarayıcıda `https://diskalkuli.com/platform/numap.html` aç → Ctrl+F5 → "Yaş Normalizasyonu" bölümünde yeni metin görünmeli

### G.3) numap.html inline fallback'i güncelle (opsiyonel ama önerilir)

JSON yüklendikten sonra inline fallback görünmez ama:
- Tarayıcı cache'i eski JSON'u getirebilir → fallback eski kalır
- JS kapalıysa fallback gösterilir
- SEO için meta açıklamalar HTML'den okunur

1. Sunucuda `/platform/numap.html`'i yedekle
2. `_platform/wp-pages/numap-fixed.html` üzerine yaz (dosya adı `numap.html` olmalı, `-fixed` ekiyle değil)

### G.4) Doğrulama checklist

Yükleme sonrası:

- [ ] `https://diskalkuli.com/platform/locales/tr.json` → `48–119 ay` 3 kez geçmeli, `48–96 ay` hiç geçmemeli
- [ ] `https://diskalkuli.com/platform/locales/en.json` → `48–119 months` 3 kez, `48–96 months` 0
- [ ] `https://diskalkuli.com/platform/locales/ku.json` → `48–119 mehî` 3 kez, `48–96 mehî` 0
- [ ] `https://diskalkuli.com/platform/numap.html` → "Yaş Normalizasyonu" kartında "okul öncesinden ilkokul 4. sınıfa (48–119 ay)" yazmalı
- [ ] `https://diskalkuli.com/araclar/` → CTA bölümünde "Numap ile çocuğunuzu / öğrencinizi okul öncesinden ilkokul 4. sınıfa kadar (48–119 ay) Türkiye normlarına göre..."

### G.5) Numap kaynak kodu incelemesi (2026-05-02)

Yerel Numap kaynağı (`Diskalkuli Tanılama_Müdahale/Numap/src/lib/`) incelendi. **Sınıf-bazlı norm sistemi zaten implement edilmiş**:

**Mevcut destek (kodda hazır):**
- `grade-labels.js` → 6 sınıf seçeneği: Anaokulu, Okul Öncesi, 1.–4. Sınıf
- `class-norms.js` → her sınıf için bağımsız norm tablosu (1./2. ve 3./4. sınıf shift ile türetiliyor)
- `age-helpers.js` → `monthsToAgeGroup` fonksiyonu

**Ham norm tabloları (`calculations.js`):**
- Sadece 4 yaş grubu tanımlı: `48-59`, `60-71`, `72-83`, `84-96` ay
- 84-96 ay = 1./2. sınıf normu (asıl Türkiye örneklemi)
- 3./4. sınıf normları → 84-96 normundan **shift** (±0.40 SD) ile **ekstrapolasyon**

**Pratik destek aralığı:**
- 48–95 ay → tam normatif destek (anaokulu - 1./2. sınıf)
- 96–119 ay → **ekstrapolasyon** (3./4. sınıf, shift uygulanır)
- 120+ ay → norm dışı uyarısı (`grade-labels.js:104, 117`)

**Doğum tarihi sınırı (`student-validation.js:14`):**
- `MIN_BIRTH_DATE = '2010-01-01'` (16 yaş ve altı kabul edilir, ama norm dışı uyarısı var)

### G.6) Önemli bilimsel uyarı (kullanıcı için)

3.–4. sınıf normları ham tablodan **shift** ile türetildi (gerçek 3./4. sınıf Türkiye örneklemi yok). `class-norms.js:11-18` yorumlarında bu açıkça belirtilmiş:
> *"1.-2. sınıf arasında daha geniş aralık (formal aritmetik öğretiminin yarattığı büyük performans sıçraması nedeniyle), 3.-4. sınıf arası daha dar aralık (akıcılık/tavan etkisi)."*

**Eylem önerisi (sen ve ekip karar verecek):**
- Eğer 3./4. sınıf için bağımsız Türkiye örneklemi norm tabloları toplanmadıysa, bunun yapılması psikometrik geçerlilik için kritik.
- Şimdilik UI metinleri "okul öncesinden 4. sınıfa kadar" diyebilir çünkü kod zaten extrapole ediyor.
- Raporlarda "3./4. sınıf normu ekstrapolasyondur, dikkatli yorumlayın" notu eklenebilir.

### G.7) Diğer notlar

- **Numap dil desteği:** Şu anda TR/EN/KU (3 dil). Memory standardı 5 dil (TR/KU/EN/AR/FA). Bu tutarsızlık ileride giderilecek (AR ve FA locale eklenmeli).
- **Galaksay:** "3–8 yaş" aralığı korundu (Numap'tan ayrı). Galaksay yaşı genişletmek istenirse ayrı iş.
- **deploy/ klasörü:** `Numap/deploy/src/lib/` da var ama `src/lib/` ile aynı (`diff -q` boş döndü). Sunucuya deploy edilen kopya — değişiklik gerekmez, build sonrası otomatik gelir.

---

## H) İçerik sayfaları akademikleştirildi (2026-05-02)

Üç ana içerik sayfası akademik dilde yeniden yazıldı. Bireysel isim atfı kaldırıldı; alanyazına dayalı çerçeveye geçildi (APA stilinde referanslar, derleme makalesinden türetildi).

### H.1) Kaynak dosyalar

| Dosya | Hedef WP sayfası | Boyut/içerik |
|---|---|---|
| `diskalkuli-nedir-fixed.html` | `/diskalkuli-nedir/` | 10 bölüm, 38 kaynaklı kaynakça |
| `ebeveynler-fixed.html` | `/ebeveynler/` | 5 bölüm, gözlem temelli yaklaşım, aile-okul iş birliği |
| `ogretmenler-fixed.html` | `/ogretmenler/` | 7 bölüm, RTI 3-katmanlı destek modeli, farklılaştırılmış öğretim |

### H.2) Yapılan değişikliklerin özeti

**Tüm sayfalarda ortak:**
- Doğrudan bireysel atıf (Prof. Dr. Yılmaz Mutlu) **kaldırıldı**; "Diskalkuli Akademi", "alanyazın", "araştırmalar" gibi kurumsal/genel atıflar kullanıldı.
- Numap kapsamı **48–119 ay / 4–10 yaş** olarak güncellendi (önceki "48–96 ay" referansları kaldırıldı).
- APA stilinde **akademik kaynaklar** eklendi (Kucian & von Aster 2015, Butterworth ve ark. 2011, Mazzocco ve ark., Geary, Beilock & Maloney, Mutlu & Akgün, vb.).
- Anonim/uydurulmuş tanıklıklar (Ayşe K., Mehmet A.) **kaldırıldı** — akademik tonla uyumsuz.

**`/diskalkuli-nedir/` sayfasına özgü değişiklikler:**
- Yeni bölümler: Bilişsel ve Nörobiyolojik Temeller, Eşgörü Durumları, Tanılama Süreci, Eğitsel Müdahale Yaklaşımları, Kaynakça.
- Çekirdek mekanizmalar (sayı hissi/ANS, çalışma belleği, sembolik işleme) açıkça anlatıldı.
- DSM-5 ve ICD-11 sınıflamaları ayrı ayrı belirtildi.

**`/ebeveynler/` sayfasına özgü değişiklikler:**
- "3 adımda yolculuk" yapısı korundu; metin akademikleştirildi.
- Yeni bölümler: Aile rolü (gözlem temelli yaklaşım), Damgalamadan kaçınma, Evde günlük matematik pratikleri, Aile-okul iş birliği matrisi.
- Klinik tanı için uzman yönlendirme uyarısı eklendi.

**`/ogretmenler/` sayfasına özgü değişiklikler:**
- "3 adımlık akış" yapısı korundu; metin akademikleştirildi.
- Yeni bölümler: Sınıf içi gözlem örüntüleri (1.-2. ve 3.-4. sınıf ayrı), RTI üç-katmanlı destek modeli (Tier 1/2/3), Farklılaştırılmış öğretim ilkeleri (CRA, çoklu kodlama, çalışma belleği, kaygı duyarlı pedagoji), Eşgörü farkındalığı.

### H.3) WordPress'e yükleme

Her bir sayfa için:

1. WP Admin → **Sayfalar → [İlgili sayfa] → Düzenle**
2. Mevcut **Custom HTML** bloğunu bul (her sayfada `<style>` ile başlayan, `</section>` ile biten blok)
3. O bloğun tamamını sil
4. Yeni `*-fixed.html` dosyasının içeriğini yapıştır (üstteki `<!-- yorumlar -->` dahil veya hariç)
5. **Güncelle** → Ön yüzde Ctrl+F5 ile doğrula

### H.4) Doğrulama checklist

- [ ] `/diskalkuli-nedir/` → "Prof. Dr." atfı yok, "10. Kaynakça" bölümü var, 38 referans listelenmiş, içindekiler 10 madde
- [ ] `/ebeveynler/` → Anonim "Ayşe K." alıntısı yok, "Aile-okul iş birliği" 6 kart bölümü var, "48-119 ay / 4-10 yaş" geçiyor
- [ ] `/ogretmenler/` → Anonim "Mehmet A." alıntısı yok, "Müdahaleye Yanıt (RTI)" 3 katmanlı bölüm var, "48-119 ay / 4-10 yaş" geçiyor
- [ ] Tüm sayfalardaki yeni Numap referansları G bölümündeki yükleme tamamlandığında doğru metni gösterecektir

### H.5) Notlar

- **Kaynakça yazım stili:** APA 7 stiline yakın; tam DOI'ler verilebilen kaynaklar için linkler eklendi (Kucian & von Aster 2015 örneği). Diğer DOI'ler kullanıcı tarafından eklenebilir.
- **Akademik içerik kaynağı:** `D:/Belgeler_2026/Diskalkuli_Derleme_Kitap/Diskalkuli Derleme Makalesi.docx` ve "Beyin, Bellek ve Sayılar..." derleme makalesi temel alındı.
- **Çoklu Süzgeç Modeli atfı:** Mutlu & Akgün (2017) makalesine yapılan atıf bireysel isim olarak değil, model adıyla geçti (akademik atıf gerekli görüldüğü yerlerde standart APA formatı).
- **CTA bölümleri:** Tüm sayfalarda Numap ve DokunSay araçlarına yönlendiren CTA korundu; metinler akademik tona uydurulmuştur.

---

## I) Tanıla & Müdahale (/platform/) sayfası diğer sayfaların formatına uyarlandı

`/platform/` ana sayfası (Tanıla & Müdahale menü öğesi), ebeveynler/öğretmenler/diskalkuli-nedir sayfalarıyla görsel tutarlılık için yeniden yazıldı.

### I.1) Kaynak dosya

`_platform/wp-pages/platform-fixed.html` → Sunucuda `/platform/index.html`

**ÖNEMLİ:** Bu sayfa WordPress'te değil, **sunucuya doğrudan yüklenmiş statik HTML**. Diğer sayfalar gibi WP Custom HTML bloğuna yapıştırılmaz; FTP/cPanel ile dosya olarak yüklenir.

### I.2) Tasarım değişiklikleri

| Yer | Önce | Sonra |
|---|---|---|
| Tema rengi | `#6C63FF` (mor) | `#4f46e5` (indigo) — diğer 3 sayfayla ayrışan, brand uyumlu |
| CSS sistemi | `.workflow-*`, `.app-card`, `.feature-grid` | `.dk-p-*` — ebeveynler/öğretmenler/diskalkuli-nedir ile aynı |
| Hero | Yok (sadece nav vardı) | Eyebrow + grad title + p — diğer sayfalarla aynı format |
| Workflow | 2 satıra ayrılmış (1+1+1) | Tek satırda 3 kart (responsive grid) |
| App kartları | Özel `app-card` stili | `dk-p-app` (Numap mavi üst-çizgi, Galaksay indigo üst-çizgi) |
| DokunSay araçları | Sırasız | Pedagojik müfredat sırasına göre düzenlenmiş (Sayı Çubukları → Geometri → Saat → Basamak → Kesir → İstatistik → Tam Sayılar) |
| Numap kapsamı | "48–96 ay" inline fallback | "okul öncesinden ilkokul 4. sınıfa kadar (48–119 ay / 4–10 yaş)" |

### I.3) Korunan unsurlar

- `<head>` tüm meta etiketleri, OG/Twitter Card, canonical
- `<link rel="stylesheet">` referansları (app-shell.css, style.css, diskalkuli-theme.css) — global stil için hâlâ gerekli
- Tüm `data-i18n` ve `data-i18n-attr` özellikleri (TR/EN/KU çeviriler aktif kalır)
- Footer (4 sütun + copyright)
- Script referansları (i18n.js, main.js, app-shell.js)

### I.4) Yeni eklenen i18n key'ler (opsiyonel)

Aşağıdaki key'ler HTML'de fallback metinle var ama locale dosyalarında yok. Eklenmezse fallback gösterilir (sorun değil), eklenirse 3 dilli olur:

- `hero.eyebrow` — "Tanılamadan Müdahaleye"
- `hero.subtitle` — Hero açıklaması
- `workflow.step1_cta`, `workflow.step2_cta`, `workflow.step3_cta` — kart CTA'ları

İstersen bu 5 key'i locale dosyalarına eklemek için ayrı bir tur yapabiliriz.

### I.5) Yükleme adımları

1. Sunucuda mevcut `/platform/index.html` dosyasını **yedekle** (cPanel File Manager → kopyala → `index.html.bak`)
2. `_platform/wp-pages/platform-fixed.html` dosyasını sunucuya `/platform/index.html` olarak yükle (üzerine yaz)
3. **Doğrula:**
   ```bash
   curl -sL "https://diskalkuli.com/platform/" | grep -c "dk-p-hero"
   # Beklenen: en az 1 (yeni stil sınıfı yüklenmiş)
   curl -sL "https://diskalkuli.com/platform/" | grep -c "48–119 ay"
   # Beklenen: en az 2 (workflow + numap_card açıklamaları)
   ```
4. Tarayıcıda `https://diskalkuli.com/platform/` aç → Ctrl+F5 → indigo tema, kart düzeni görünmeli

### I.6) Doğrulama checklist

- [ ] Hero: indigo eyebrow + "Diskalkuli için bütüncül dijital platform" başlığı
- [ ] Workflow: 3 indigo `dk-p-step` kartı (Tanıla / Müdahale Et / İzle ve Raporla)
- [ ] Apps: 2 büyük kart (Numap mavi üst-çizgi, Galaksay indigo üst-çizgi), feature etiketleri pill formatında
- [ ] DokunSay araçları: 7 araç pedagojik sırada, her biri renkli sol-kenar çizgisiyle
- [ ] Değerler: 4 kart (Bilimsellik / Erişilebilirlik / Bütüncüllük / Çocuk Odaklılık)
- [ ] Mağaza banner (sarı-turuncu gradient)
- [ ] CTA: indigo gradient, 2 buton (Numap ile Tanıla / Galaksay ile Başla)
- [ ] Footer korundu (4 sütun, scriptler çalışır)

### I.7) Notlar

- **Renk sistemi:**
  - Anasayfa (gri) — varsayılan
  - Diskalkuli Nedir? (mor #9333ea)
  - Ebeveynler (pembe #ec4899)
  - Öğretmenler (mavi #0071dc)
  - **Tanıla & Müdahale (indigo #4f46e5)** ← bu tur eklendi
  - DokunSay Araçları (turuncu)
  - Mağaza (cyan)
- **i18n çevirisi:** Numap için locale dosyaları (G bölümünde) güncel — yeni HTML açıldığında otomatik 48–119 ay metni gelir.
- **Galaksay sayfası:** `/platform/galaksay.html` aynı eski formatta. İstenirse bir sonraki turda o da bu tarza uyarlanabilir.

---

## J) Hakkımızda sayfası diğerleriyle tutarlı hale getirildi

`/hakkimizda/` sayfası, ebeveynler/öğretmenler/diskalkuli-nedir/platform sayfalarıyla görsel tutarlılık için yeniden yazıldı.

### J.1) Kaynak dosya

`_platform/wp-pages/hakkimizda-fixed.html` → WP `/hakkimizda/` sayfasının Custom HTML bloğu

### J.2) Renk teması

| Sayfa | Renk | Hex |
|---|---|---|
| Diskalkuli Nedir? | Mor | `#9333ea` |
| Ebeveynler | Pembe | `#ec4899` |
| Öğretmenler | Mavi | `#0071dc` |
| Tanıla & Müdahale | İndigo | `#4f46e5` |
| **Hakkımızda** | **Teal** | **`#0d9488`** ← bu tur eklendi |

### J.3) İçerik bölümleri

1. **Hero** — Diskalkuli Akademi tanıtımı (kurumsal ton, 2020 kuruluş)
2. **Misyon ve vizyon** — 2 kart (teal sol-kenar)
3. **Üç katmanlı yaklaşım** — 3 step kartı (Tanılama → Müdahale → Sınıf-içi öğretim)
4. **Akademik temelimiz** — 6 değer kartı (Bilimsellik, Erişilebilirlik, Bütüncüllük, Çocuk odaklılık, Aile-okul iş birliği, Akademik bağlantı)
5. **Sayılarla** — 6 stat (7 araç / 5 dil / 10 pedagojik çerçeve / 30+ yayın / 10+ TÜBİTAK / 1 patent)
6. **Kurucu kartı** — `/yilmaz-mutlu/` sayfasına yönlendiren CTA (foto + bio)
7. **Bilimsel iş birlikleri** — callout
8. **CTA** — 3 buton (Numap / DokunSay / İletişim)

### J.4) Yapılan değişiklikler

- "55 Kursiyer / 0 Döküman / 0 Üniversite" rakamları **kaldırıldı** (boş 0'lar profesyonel görünmüyordu)
- Anonim "Emre, Sibel, Derya, Nesli" tanıklıkları **kaldırıldı** (akademik tonla uyumsuz, daha önce ebeveynler/öğretmenler sayfalarında da kaldırılmıştı)
- "Türkiye'deki diskalkuli alanında tek olan platform" ifadesi yumuşatılıp "Türkiye'de bu alana özel ilk bütüncül dijital ekosistem" şeklinde güncellendi
- **Kurucu CTA kartı sayfaya entegre edildi** (önceden ayrı bir `hakkimizda-kurucu-cta.html` vardı; artık ayrı dosya gereksiz, tek bir yapıştırma yeterli)

### J.5) Yükleme adımları

1. WP Admin → **Sayfalar → Hakkımızda → Düzenle**
2. Mevcut tüm içerik bloklarını sil
3. `_platform/wp-pages/hakkimizda-fixed.html` içeriğini Custom HTML bloğu olarak yapıştır
4. **Güncelle** → `https://diskalkuli.com/hakkimizda/` üzerinde Ctrl+F5 ile doğrula

### J.6) Doğrulama checklist

- [ ] Hero: teal eyebrow + "Diskalkuli için bilim ve teknolojiyi buluşturan ekosistem"
- [ ] Misyon & vizyon: 2 kart
- [ ] 3 katmanlı yaklaşım: Numap / Galaksay / DokunSay step kartları
- [ ] Akademik temel: 6 kart (her biri teal üst-çizgili)
- [ ] Sayılar: 7 / 5 / 10 / 30+ / 10+ / 1
- [ ] Kurucu kartı: foto + Prof. Dr. Yılmaz Mutlu + `/yilmaz-mutlu/` link
- [ ] CTA bölümü teal gradient, 3 buton

---

## SİTEYE YANSITMA — Mevcut durum ve seçenekler

**Tüm 5 sayfanın güncellenmesi gerekiyor:**

| # | Sayfa | Yöntem | Kaynak dosya |
|---|---|---|---|
| 1 | `/diskalkuli-nedir/` | WP Admin → Custom HTML | `diskalkuli-nedir-fixed.html` |
| 2 | `/ebeveynler/` | WP Admin → Custom HTML | `ebeveynler-fixed.html` |
| 3 | `/ogretmenler/` | WP Admin → Custom HTML | `ogretmenler-fixed.html` |
| 4 | `/araclar/` | WP Admin → Custom HTML | `araclar-fixed.html` |
| 5 | `/hakkimizda/` | WP Admin → Custom HTML | `hakkimizda-fixed.html` |
| 6 | `/yilmaz-mutlu/` | WP Admin → Yeni sayfa oluştur | `yilmaz-mutlu.html` |
| 7 | `/platform/` | FTP/cPanel → dosya yükleme | `platform-fixed.html` → `/platform/index.html` |
| 8 | `/platform/locales/*.json` | FTP/cPanel → 3 dosya | `numap-locale-{tr,en,ku}.json` |
| 9 | `/platform/numap.html` | FTP/cPanel → dosya yükleme | `numap-fixed.html` |
| 10 | `/dokunsay/DokunSayKesir/` | FTP/cPanel → klasör yükleme | `DokunSayKesir/dist/` |

**Otomatik yansıtma için ne gerekli:**
- WP yetkili admin oturumu (Custom HTML bloklarını güncellemek için)
- FTP/cPanel/SFTP erişimi (statik dosyalar ve Numap kaynak dosyaları için)

**Güvenlik kuralı:** Şifre/credential bilgisini ben giremem. Otomasyon istiyorsan:
1. Tarayıcıda **kendin WP admin'e giriş yap** (https://diskalkuli.com/wp-admin/)
2. Bana "admin'deyim" de
3. Ben her sayfayı sırayla açıp Custom HTML bloklarını güncelleyeyim
4. FTP işlemleri için (statik dosyalar) ya kendin yapacaksın ya cPanel File Manager üzerinden birlikte ilerleyebiliriz

---

## K) Profil fotoğrafı hazırlandı (yilmaz-mutlu.jpg)

### K.1) Kaynak

- **Orijinal:** `https://dergipark.org.tr/media/cache/user_croped/d861/b5b6/802d/6502b5e3328cf.jpeg` (200×200 px, 10 KB)
- **İşleme:** Pillow Lanczos algoritması ile 4× büyütme + UnsharpMask + hafif kontrast artışı
- **Çıktı dosyası:** `_platform/wp-pages/assets/yilmaz-mutlu.jpg` (800×800 px, 61 KB, progressive JPEG, quality=92)

**Önemli:** Bu "kalite artırma" gerçek AI upscaling değildir; geleneksel Lanczos interpolation + sharpen ile yapılan kozmetik iyileştirmedir. Detay eklemez, ama 200 px ekranlarda Retina uyumu için yeterli görünür.

### K.2) WordPress'e yükleme

1. WP Admin → **Medya → Yeni Ekle**
2. `_platform/wp-pages/assets/yilmaz-mutlu.jpg` dosyasını sürükle-bırak ile yükle
3. Yükleme sonrası WordPress'in verdiği gerçek URL'yi kopyala (genelde `/wp-content/uploads/2026/05/yilmaz-mutlu.jpg` formatında)
4. Aşağıdaki dosyalardaki yer tutucu yolu, gerçek URL ile değiştir:

| Dosya | Aranacak yol |
|---|---|
| `yilmaz-mutlu.html` | `/wp-content/uploads/yilmaz-mutlu.jpg` (1 yer, hero foto) |
| `hakkimizda-fixed.html` | `/wp-content/uploads/yilmaz-mutlu.jpg` (1 yer, kurucu CTA) |
| `hakkimizda-kurucu-cta.html` | `/wp-content/uploads/yilmaz-mutlu.jpg` (varsa, opsiyonel ayrı dosya) |

**Hızlı yol — Find & Replace:**
HTML dosyalarında `/wp-content/uploads/yilmaz-mutlu.jpg` ifadesini WP'nin verdiği gerçek URL ile değiştir (yıl/ay klasörlü).

### K.3) Daha yüksek kalite isterseniz (opsiyonel)

Mevcut 800×800 versiyonu yeterli görünür ama gerçek "AI upscale" istiyorsanız:

- **Web tabanlı (ücretsiz):** [Bigjpg.com](https://bigjpg.com), [Upscayl](https://upscayl.org) (open-source desktop), [Real-ESRGAN demo](https://huggingface.co/spaces/akhaliq/Real-ESRGAN)
- **Sürecin nasıl olması gerektiği:** Orijinal 200×200 dergipark JPEG'i AI upscaler'a yükle → 4×–8× büyüt → çıktıyı `yilmaz-mutlu.jpg` olarak kaydet → WP'ye yükle
- **En iyi yol:** Profesyonel bir studyodan çekilmiş yüksek çözünürlüklü orijinal foto varsa, doğrudan o kullanılmalı (1200×1200+ önerilir)

### K.4) Yansıma sırası

Yansıtma yapılırken sıralama:
1. Önce fotoğrafı WP Medya'ya yükle (URL'yi kopyala)
2. Sonra HTML dosyalarındaki yer tutucu yolu o URL ile değiştir
3. Sayfaları (yilmaz-mutlu, hakkimizda) yapıştır

---

## L) Anasayfa hero ve diğer bölümler güncellendi

`/` (anasayfa) Custom HTML bloğu, akademik dile uyarlanmış ve içerik güncellemeleri uygulanmış halde yeniden yazıldı.

### L.1) Kaynak dosya

`_platform/wp-pages/anasayfa-fixed.html` → WP `/` (anasayfa) Custom HTML bloğu

### L.2) Yapılan değişiklikler

| Yer | Önce | Sonra |
|---|---|---|
| Hero p.lead | "Prof. Dr. Yılmaz Mutlu'nun **20 yıllık** akademik çalışmasına dayalı bütüncül diskalkuli tanılama ve müdahale platformu. **4 dilde** ·…" | "Akademik birikim ve uluslararası alanyazına dayalı, diskalkuli için tanılamadan müdahaleye kadar uzanan bütüncül dijital platform. **5 dilde** ·…" |
| Trust strip subtitle | "Diskalkuli alanında **20+ yıl** akademik araştırma" | "Diskalkuli alanında **15+ yıl** akademik araştırma" |
| Trust stats | "4.000+ Saha denemesi / A1–A11 / 59+ / TR·EN·KU" | "A1–A11 / 59+ / **7 DokunSay aracı** / **5 Dil · TR/KU/EN/AR/FA**" |
| Adım 2 (Tara) | "Numap ile **48–96 ay** yaş grubuna A1–A11 bataryasıyla bilimsel değerlendirme." | "Numap ile **okul öncesinden ilkokul 4. sınıfa (48–119 ay)** A1–A11 bataryasıyla bilimsel değerlendirme." |
| Problem facts | "%5–7 Türkiye'de ilkokul çağı çocuklarında" | "**%3–7** Okul çağı çocuklarında diskalkuli yaygınlığı (Kucian & von Aster, 2015)" — akademik kaynak eklendi |
| Problem note h3 | "Van Hiele · Bruner · Piaget · CRA · GAISE" | "Van Hiele · Bruner · Piaget · CRA · **Dienes** · GAISE" — Dienes eklendi |
| Personas — öğretmen | "parmakla sayan, 10'u geçince tutulan, problemi okuyunca donan öğrenciler var. Pratik, bilimsel çözümler arıyorum." | "diskalkuli şüphesi taşıyan öğrenciler var. Sistematik tarama, farklılaştırılmış öğretim ve **müdahaleye yanıt (RTI)** yaklaşımları arıyorum." |
| Tools sırası | DokunSayBar → Basamak → Saat → Kesir → Tam → Geometri → İstatistik | **Pedagojik müfredat sırası**: Sayı Çubukları → Geometri → Saat → Basamak → Kesir → İstatistik → Tam Sayılar |
| Final CTA p | "48–96 ay" referans yok ama yaş aralığı vurgusu zayıf | "okul öncesinden ilkokul 4. sınıfa (48–119 ay / 4–10 yaş)" eklendi |

### L.3) Korunan unsurlar

- **Yılmaz Mutlu adı korundu** (trust strip için kritik güven inşası — sadece 20→15 düzeltmesi yapıldı)
- 4 işlem renkli logo bloğu animasyonu (CSS değişmedi)
- 4 adımlı yolculuk grid yapısı
- Persona kartları (3 hedef kitle: ebeveyn / öğretmen / kurum)
- Tools showcase
- Final CTA (sarı/lacivert gradient)

### L.4) Yansıtma — özel durum

Anasayfada içerik şu anda **JavaScript içine gömülü string** olarak duruyor (`var html = "..."`). Bu durumda 2 seçenek:

**A) Mevcut JS'i koru, sadece string'in içindeki metinleri Find & Replace ile değiştir**
- WP admin → Sayfalar → Anasayfa → Düzenle
- Custom HTML bloğunda script'i bul
- "20 yıllık" → "15 yıllık", "4 dilde" → "5 dilde", vb. tek tek replace et
- Risk: Escape karakterlerini bozma ihtimali

**B) JS injection'ı sil, doğrudan Custom HTML olarak `anasayfa-fixed.html` içeriğini yapıştır (önerilen)**
- WP admin → Sayfalar → Anasayfa → Düzenle
- Mevcut script bloğunu sil
- `anasayfa-fixed.html` dosyasının içeriğini Custom HTML bloğu olarak yapıştır
- Avantaj: Server-rendered (SEO için iyi), düzenlemesi kolay, escape sorunu yok

**Önerilen B**: Aynı görsel sonuç, daha sağlam yapı.

### L.5) Doğrulama checklist

- [ ] Hero p.lead: "Akademik birikim ve uluslararası alanyazına" ile başlıyor, "5 dilde" yazıyor
- [ ] Trust strip: "15+ yıl akademik araştırma" yazıyor
- [ ] Trust stats: 4. sütun "5 Dil · TR/KU/EN/AR/FA"
- [ ] Adım 2 Tara: "okul öncesinden ilkokul 4. sınıfa (48–119 ay)"
- [ ] Problem facts: "%3–7" + "(Kucian & von Aster, 2015)" akademik atıf
- [ ] Bilimsel temel kartı: "Dienes" çerçevesi listede
- [ ] Tools: pedagojik sıra (Sayı Çubukları → Geometri → Saat → ...)

---

## F) İleride yapılacaklar (bu turun dışında)

1. **Logo seti üret** — her uygulama için 512×512 PNG/SVG ikon. Şu an emoji kullanılıyor, profesyonel logo seti gelince HTML'de `<div class="dk-a-tool-icon">🧮</div>` → `<img class="dk-a-tool-icon" src="/icons/sayi-cubuklari-512.png">` ile değiştirilebilir.
2. **DokunSayTam — NumberLine.jsx bug fix'i commit et** — `jumps.map` → `(jumps || []).filter(...).map(...)` (mevcut uncommitted değişiklik). Commit'leyip yeniden build → site uyumlu kalmaya devam eder.
3. **İsim standardı** — `Dokunsay-geo`, `Dokunsay-veri-app` → `DokunSayGeo`, `DokunSayVeri` (PascalCase tutarlılığı). Bu siteyi de etkiler (URL değişimi, redirect gerekir).
