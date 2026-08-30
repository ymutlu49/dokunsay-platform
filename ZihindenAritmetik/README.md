# Zihinden Aritmetik — Uygulama

*Zihinden Aritmetik* kitabının uygulama cildi.

- **Kitap:** Prof. Dr. Yılmaz Mutlu · Dr. İhsan Söylemez · Dr. Yavuz Erdem
- **Uygulama:** Prof. Dr. Yılmaz Mutlu

Telefon, tablet, masaüstü ve akıllı tahtada tek kod tabanıyla çalışan bir PWA'dır.

İlk açılışta rol sorulur — kitabın ön kısmındaki "öğretmen / ebeveyn / uzman
için üç ayrı okuma haritası" ayrımının uygulamadaki karşılığı. Rol yalnızca
hangi ekranların gösterileceğini belirler; içerik aynı kitaptan gelir.

## Ne yapar

| Modül | İçerik | Kaynağı |
|---|---|---|
| **Sayı Konuşması** | 18 hazır dizi + Ek C'nin 10 haftalık × 3 oturumluk takvimi (30 oturum) + kendi dizini kur | Etkinlik Kitabı Tablo 2, Ek C Tablo C.2 |
| **Etkinlik kartları** | 58 kartın tamamı; bölüm/süre/materyal süzgeçleri ve tam ekran "derse götür" modu | Etkinlik Kitabı |
| **Sınıf araçları** | Kitabın sekiz tekrar eden şekil ailesinin canlı, dokunmatik karşılığı; her biri tam ekran tahtaya yansıtılır | Bölüm 4–11 |
| **Gözlem formları** | Ek D'nin dört formu — doldurulur, cihazda saklanır, yazdırılır | Ek D, Tablo 14.2 |
| **Yedekleme** | Bütün yerel veri tek JSON dosyasına; başka cihazda geri yüklenir | — |

**Ebeveyn modu** (üç sekme): evde beş dakika, yaşa göre öneriler, günün önerisi,
övgü sözleri, tuzaklar, kanıt notları ve evde uygulanabilir dört etkinlik.

### Ebeveyn modu çocuğa değil, ebeveyne seslenir

Bunun gerekçesi bölümün kendisindedir. **17.8**, evde tek başına kullanılan
uygulamaların araştırma bulgusuna genellenemeyeceğini söyler; işe yarayan şey
*"ekranın kendisi değil, ekranın başlattığı konuşma"*dır. **Tablo 17.3**'ün son
tuzağı da budur: *"Ekranı yalnız bırakma → Yanına oturun, konuşun."*

Bu yüzden ebeveyn modunda puan, doğru/yanlış işareti, süre ve ilerleme çubuğu
yoktur; her bölüm çocuğa sorulacak bir cümleyle biter. Ekranların içeriği:

- **Yaş aralığı** (Şekil 17.6) — dört bant, her biri tek bir örnek soruyla.
  "Yaş sınırları kesin değildir; çocuğa göre kayar" notu ekranda durur.
- **Bugün şunu deneyin** — Tablo 17.1'deki on üç ebeveyn köşesinden biri.
  Seçim tarihe bağlıdır: aynı gün uygulama kaç kez açılırsa açılsın aynı
  öneriyi verir, çünkü rutin ancak sabit olursa rutindir (Bölüm 13).
- **Beş dakikanın adımları** (Şekil 17.5) — ve "Gergin geçtiyse yarın yapmayın."
- **Bunun yerine şunu deyin** (17.7) — üç övgü cümlesinin yeniden yazımı.
- **Tuzaklar** (Tablo 17.3) — yedi tuzak, belirtisi ve ne yapılacağı.
- **Kanıt ne diyor?** — kitabın tutumu burada da sürer: işe yaradığı gösterilen
  (Berkowitz ve ark., 2015), genellenemeyen (Kim ve ark., 2021) ve beklendiği
  kadar iş görmeyen (ödev; Cooper ve ark., 2006) ayrı ayrı adlandırılır.
- **Diskalkulili çocuğun ailesine** (17.11) — üç öncelik.
- **Evde yapılabilecek etkinlikler** — Etkinlik Kitabı'nın dizininin evde
  uygulanabilir işaretlediği 1.4, 2.1, 3.3 ve 8.1. Ebeveyne kartın tamamı
  değil, üç alanı gösterilir: neden, ne sorulur, takılırsa. Sınıf yönergesi ve
  ölçüt satırı öğretmenin işidir.

Ebeveyn modunda araç listesi de kısalır: şipşak kart, onluk çerçeve ve
parça–bütün kalır; sınıfa dönük olanlar gizlenir.

**Ayarlar** ayrı bir sayfadadır (ana ekranların sağ üstündeki dişli): kullanım
biçimi, dil, yedekleme ve künye oradadır. Araçlar sayfası yalnızca
manipülatiflere ayrılmıştır — ders sırasında açılan bir listede ayar bulunmaması
yanlışlıkla dokunmayı da önler.

### Sayı konuşması tekniğin kendi sırasını izler

Tahta dört aşamalıdır ve aşamalar bilerek ayrı durur; tekniğin bozulduğu yer
tam da bunların birbirine karışmasıdır.

1. **Sessiz düşünme.** Kalem yok, konuşma yok. Geçen süre sayılır (geri sayım
   değil — amaç baskı kurmak değil, bekleme süresini görmek). Bulan çocuk
   başparmağını göğsüne koyar; öğretmen sayacı arttırır. El kaldırmak henüz
   bulamamışın üstüne baskı kurduğu için kullanılmaz. İkinci yol bulanlar ayrı
   sayılır.
2. **Cevaplar.** Gelen bütün cevaplar yazılır, hiçbirine tepki verilmez.
   Doğru işareti bu aşamada yoktur.
3. **Yollar.** Çocuğun cümlesi olduğu gibi yazılır. Ancak yol yazıldıktan
   *sonra* strateji adı seçilebilir; adlar Ek B.2'den gelir ve problemin işlem
   ailesine göre süzülür. Seçilen stratejinin bir modeli varsa "Bu yolu
   tahtada göster" düğmesi ilgili manipülatifi tahtanın içinde açar —
   öğretmen çocuğun anlattığını oracıkta çizer.
4. **Uzlaşma.** Sınıf bir cevapta anlaşır; onay işareti ancak burada konur.

Oturum özeti her problem için cevapları, uzlaşmayı, düşünme süresini ve
adlandırılan stratejileri toplar; sonunda o oturumda sınıftan çıkan strateji
dağarcığı listelenir.

### Ek D formları

Dört form kâğıt aslıyla aynı düzendedir; doldurulmuş hâli yazdırılabilir ya da
tarayıcının "PDF olarak kaydet" seçeneğiyle saklanabilir.

- **D.1 · Haftalık gözlem çizelgesi** — beş strateji sütunu (kitabın strateji
  adlarından seçilir), altı öğrenci satırıyla açılır. Hücreye dokunmak üç durum
  arasında döner: ○ henüz görülmedi → ◐ deniyor, tamamlamıyor → ● kendiliğinden
  kullanıyor. Puan yoktur.
- **D.2 · Öğrenci profili kartı** — altı alan: doğruluk, tercih ettiği yol,
  dağarcık, esneklik, sonraki hedef, evde ne yapılabilir. Son alan kitapta "en
  önemlisi" diye işaretlidir; formda da ayrı renkte durur.
- **D.3 · Birleşik tarama formu** — Bölüm 7–11'in **18 tarama maddesinin
  tamamı**, kitap bölümüne göre öbeklenmiş. "Öğrencinin söylediği yol" alanı
  doğru kutusundan önce ve daha geniştir: kitabın kuralı, "nasıl buldun?"
  sorulmadıkça taramanın yarım kaldığıdır. Süre tutulmaz.
- **D.4 · Sayı dizisi planlama formu** — kâğıtta plan yazılır ve orada kalır;
  burada **doğrudan çalıştırılır**. Kaydedilen dizi Sayı Konuşması sekmesinde
  görünür ve tahtada dördüncü problemi kilitli olarak açılır.

Bütün kayıtlar `localStorage`'da durur. Formlarda puan, yüzde ya da süre alanı
yoktur — kitabın 14.7'si zamanlı testi gerekçeleriyle reddeder.

### Kitabın kuralları arayüze gömülüdür

Uygulama, kitabın tezine aykırı davranamayacak biçimde tasarlanmıştır:

- **Son işlemi öğretmen çözmez.** Dizinin son problemi kilitlidir; açmak bilinçli
  bir hamle ister ve gerekçesi ekranda yazar.
- **Yol bulunmadan adı konmaz.** İki yerde birden: dizinin hedef stratejisi
  baştan gizlidir ("Adı göster" ile açılır), ve bir yola strateji etiketi
  ancak o yol yazıldıktan sonra verilebilir.
- **Bütün cevaplar yazılır.** Cevap alanında doğru/yanlış işareti yoktur;
  gelen her sayı aynı biçimde kaydedilir.
- **Zamanlı test yoktur.** Bölüm 14.7'nin gerekçesiyle; puan, seri ve süre
  yarışı hiçbir ekranda bulunmaz. Zamanlayıcılar yalnızca iki yerdedir ve
  ikisi de yarış değildir: şipşak kartın kasıtlı bir saniyelik gösterimi ve
  sayı konuşmasındaki sessiz düşünme sayacı.

### Rastgelelik kitabın farklılaştırma matrisinden gelir

Araçlardaki "yeni sayı / yeni kart / yeni çarpım" düğmesi keyfî bir sayı
üretmez. Dört profil (Diskalkuli · Düşük · Ortalama · Yüksek) seçilir ve
sayı o profilin aralığından çekilir. Aralıklar uydurulmamıştır: her biri
ilgili etkinlik kartının dört profil satırından alınmıştır — örneğin şipşak
kartın aralıkları kart 1.1'de "1–3 · 1–5 · 1–6 · 6–10" olarak yazar.
Aynı sayı art arda iki kez çekilmez.

Aralıkların tanımı `src/tools/rastgele.ts` içindedir ve her birinin yanında
hangi karttan geldiği yazılıdır.

### Etkinlik adları

Yedi kartın adı 30.08.2026'da hem uygulamada hem **kitabın kendisinde**
değiştirildi; ad artık tek kaynaktan, `Etkinlik_Kitabi.docx`'ten geliyor.

| Eski | Yeni |
|---|---|
| Şimşek kart | Şipşak kart |
| Splat! — kaçı gizli? | Kaçı gizli? |
| Tümleyen | Onun tümleyeni |
| Üç saniye kuralı | Bunu biliyor muyum? |
| Öğrenci çalışması çözümlemesi (4.5 · 5.5 · 6.5) | Üç öğrenci, üç yol |

Gerekçeler `scripts/adlandirma.json` içindeki `_uygulanan` listesindedir.
*Sekiz aile* (6.4) bilerek korunmuştur: kitabın Bölüm 9'daki kendi terimidir
(Tablo 9.1). Gerekçe aynı dosyanın `_geri_alinan` bölümünde.

Kitapta ad değiştirmek için `scripts/kitapta_adlandir.py` kullanılır. Betik
körlemesine değiştirmez: bir ad ancak kendi kart numarasının yanında geçtiğinde
değişir, düz metinde geçtiğinde durur — "Tümleyen" gibi adlar kitapta sıradan
sözcük olarak da geçer. Önce yalnızca tarar; `--uygula` ile yedek alıp yazar.

Yeni bir ad yalnızca uygulamada denenmek istenirse `adlandirma.json`'daki
`cards` alanına yazılır: uygulama yeni adı gösterir, kitaptaki özgün ad
`bookTitle`'da saklanır ve kartta "Kitapta: ..." satırıyla görünür.

## Yayın: DokunSay platformu

Uygulama DokunSay platformunun bir aracı olarak yayımlanır ve
**dokunsay.com/ZihindenAritmetik/** adresinde açılır. Platformun GitHub Actions
akışı depo içindeki klasörleri derlediği için kaynak burada durur; kitabın
`.docx` dosyaları ayrı yerdedir (bkz. İçerik boru hattı).

Platform tarafında kayıtlı olduğu yerler:

| Dosya | Ne için |
|---|---|
| `_platform/scripts/build-site.js` | derleme listesi (`dir`/`folder`) |
| `_platform/launcher/src/tools.js` | araç kataloğu, beş dilde |
| `_platform/scripts/inject-gate.mjs` | `LANDING` — sayfa **açık** listede |
| `.github/workflows/deploy.yml` | bağımlılık kurulum listesi |
| `package.json` (kök) | `npm run dev:zihinden` |

> **Giriş kapısı.** DokunSay, dist-site'taki bütün sayfalara NuMap giriş kapısı
> enjekte eder ve varsayılan kip içeriği gizler. Zihinden Aritmetik bir kitap
> uygulamasıdır: tanıtım sayfası kapının arkasında kalırsa tanıtım işlevini
> yitirir ve uygulama kurulamaz. Bu yüzden `LANDING` listesine eklenmiştir —
> sayfa görünür, köşede giriş daveti kalır. Erişim denetimi uygulamanın kendi
> kitap koduyla yapılacaktır, NuMap girişiyle değil.

## Kurulum

```bash
npm install
npm run dev          # http://localhost:3008
```

Üretim derlemesi: `npm run build` → `dist/`. Taban yolu `BASE_PATH` ortam
değişkeninden gelir (platform verir); verilmezse göreli yol kullanılır, yani
uygulama alan adının kökünde de bir alt klasörde de çalışır.

Platformun tamamını derlemek: kökte `npm run build:site`.

## İçerik boru hattı

Uygulamanın metni elle yazılmaz; kitabın `.docx` dosyalarından üretilir.
Kitap güncellendiğinde:

```bash
python scripts/extract_content.py
```

| Kaynak | Çıktı |
|---|---|
| `Etkinlik_Kitabi.docx` | `src/content/tr/activities.json` (9 bölüm, 58 kart) |
| `Etkinlik_Kitabi.docx` | `public/figures/etkinlik/*.webp` (58 şekil) |
| `Ekler/EkC_On_Haftalik_Takvim.docx` | `src/content/tr/strings.json` |

Kitap klasörü sırayla aranır: `ZA_KITAP` ortam değişkeni → komşu `Kitap`
klasörü → `~/Documents/Zihinden Aritmetik/Kitap`. Üretilen JSON ve WebP depoya
işlendiği için bu betik yalnızca içerik yenilenirken gerekir; CI'da çalışmaz.

Görseller baskı çözünürlüğünden (3034 px) 1400 px WebP'ye indirgenir: 8,0 MB → 1,5 MB.

Simgeler için: `python scripts/make_icons.py` (Pillow gerekir).

`src/content/**/*.json` üretilen dosyalardır — elle düzenlenmez, değişiklik
kaynak `.docx`'te yapılır ve betik yeniden çalıştırılır.

## Üç dillilik

Arayüz metinleri `src/i18n/tr.ts` içindedir; `ku` ve `en` sözlükleri aynı
anahtarları karşılar ve eksik anahtar Türkçeye düşer.

Dil kodları BCP-47'ye göredir. **Kurmancî için doğru etiket `ku-Latn-TR`'dir**
(`kmr` değil): CLDR, Kuzey Kürtçesi için makrodil kodu `ku`yu kullanır ve Latin
alfabesi varsayılandır. Üç dil de soldan sağa yazıldığı için düzen değişmez.

Terim karşılıkları kitabın TR–EN–KU çalışma sözlüğünden gelir (221 terim;
36'sı FerMat'ta mevcut, 185'i bu kitap için önerilmiştir).

İçerik çevirisi için `src/content/ku/` ve `src/content/en/` klasörleri açılıp
`src/content/index.ts` içindeki seçici o dile bağlanır; bileşenlerin hiçbiri
değişmez.

## Veri ve gizlilik

Uygulama hiçbir öğrenci verisini sunucuya göndermez. Öğretmenin tahtaya
yazdığı cevaplar, anlatılan yollar ve kurduğu diziler yalnızca cihazın
`localStorage`'ında durur. KVKK açısından uygulama, öğrenci kişisel verisi
işleyen bir sistem değildir; veri minimizasyonu ilkesi mimariye gömülüdür.

> **Not — iOS.** Safari, birkaç hafta açılmayan bir PWA'nın yerel depolamasını
> silebilir; tarayıcı verisini temizlemek de aynı sonucu verir. Dönem sonunda
> **Yedekleme** ekranından yedek alınmalıdır.

### Yedekleme ve geri yükleme

`/yedek` ekranı (Formlar ve Araçlar sayfalarından bağlantılı) `za.` önekli
bütün localStorage anahtarlarını tek bir JSON dosyasına yazar. Önek taraması
sayesinde ileride eklenen veri türleri yedek kodu değişmeden kapsanır.

- **Yedek alma.** Dosya adı `zihinden-yedek-YYYY-AA-GG.json`. iOS'ta `<a download>`
  dosyayı indirmek yerine açtığı için önce Web Share denenir (paylaşım sayfası),
  desteklenmiyorsa indirmeye düşülür.
- **Geri yükleme.** Dosya önce doğrulanır (`uygulama` imzası ve `surum`), sonra
  içeriği **özet olarak gösterilir**; yükleme ancak öğretmen ne geleceğini
  gördükten sonra başlar. İki kip vardır:
  - *Birleştir* (önerilen): cihazdaki kayıtlar korunur, dosyadakiler eklenir;
    aynı kimlikli kayıtta `guncellendi` alanı yeni olan kalır.
  - *Değiştir*: cihazdaki uygulama verisi silinir, yerine dosyadaki yazılır.
- Yedekteki `za.` önekli olmayan anahtarlar yazılmaz — yabancı bir dosya
  uygulamanın dışına bir şey bırakamaz.
- Aynı ekranda **bütün veriyi silme** vardır; iki adımlı onay ister.

## Dağıtım ve erişim

Kitabı alanlara erişim, kitaba basılan tek kullanımlık kodla verilecektir.
Kodun **web sitesinde** bozdurulması, uygulamanın yalnızca giriş yapması
planlanmıştır. Bunun nedeni App Store yönergesi **3.1.1**'dir:

> "Apps may not use their own mechanisms to unlock content or functionality,
> such as license keys, augmented reality markers, QR codes…"

Yani kodun uygulama içinde girildiği bir akış iOS'ta reddedilir. Kod web'de
bozdurulup uygulama ücretsiz bir "reader" istemcisi olarak giriş yaptığında
(3.1.3a) bu sorun doğmaz. PWA olarak yayımlandığında ise mağaza yönergesi
hiç devreye girmez.

## Yapı

```
scripts/          .docx → JSON içerik boru hattı, simge üretimi
src/
  content/        üretilen JSON + tipli erişim katmanı
  i18n/           üç dilli arayüz metinleri
  lib/            tipler, yerel saklama
  routes/         ekranlar
  routes/formlar/ Ek D'nin dört formu
  routes/ebeveyn/ ebeveyn modu ekranları
  routes/Ayarlar.tsx  rol, dil, yedekleme, künye
  tools/          sekiz manipülatif
  ui/             ortak bileşenler ve simgeler
  styles.css      tasarım sistemi (palet kitabın SVG'lerinden alınmıştır)
public/figures/   kitaptan çıkarılmış etkinlik şekilleri
```

## Renk sistemi

Palet iki katmanlıdır. Kitabın laciverti (#1B4965) kimliği taşır: başlıklar ve
modeller ondan gelir, böylece ekrandaki onluk çerçeve ile basılı sayfadaki
şekil aynı nesne gibi görünür. Bunun üstünde dokuz bölüm rengi ekranı
canlandırır ve kütüphaneyi taranabilir kılar — öğretmen bir kartın hangi
bölüme ait olduğunu okumadan görür.

Her bölüm rengi çifttir: `--vurgu` geniş yüzeyler ve şekiller için canlı,
`--vurgu-koyu` metin için karanlıktır (beyaz üstünde en az 4.5:1). Bileşenler
renk bilmez; kapsayan `.renk-N` sınıfı iki değişkeni ayarlar.

## Yol haritası

- [ ] Ek A materyalleri: yazdırılabilir nokta kartı, onluk çerçeve, boş sayı doğrusu üreteci
- [ ] Strateji haritası (Ek B.1) ve 221 terimlik üç dilli sözlük
- [ ] Kurmancî ve İngilizce içerik ciltleri
- [ ] Kod bozdurma altyapısı ve giriş
- [ ] Yedeklerin buluta eşlenmesi (isteğe bağlı, öğrenci verisi olmadan)
