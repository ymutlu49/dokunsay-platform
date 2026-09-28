# DokunSay Problem — Problem Çözme Atölyesi

> Sözel problemi yapısını görerek çöz: hikâyeyi anla, şema ile göster, tahmin et, çöz, kontrol et.

DokunSay Problem, **DokunSay Matematik Öğretim Araçları Platformu**'nun bir parçasıdır.
Yayın adresi: <https://dokunsay.com/DokunSayProblem/> · Araç kimliği: `problem` · Geliştirme portu: `3009`

---

## Pedagojik Yaklaşım

Çocuk önce hikâyeyi anlar, sonra yapısını bir şema diyagramında kurar; işlem bu modelden çıkar,
anahtar kelimeden değil. Araç 1–4. sınıf (isteğe bağlı 5–6) öğrencileri ve matematik öğrenme güçlüğü
(MÖG/diskalkuli) olan çocuklar için tasarlandı. Okuma yükü sesli okumayla hafifletilir; metin, model ve
denklem aynı ekranda kalır; destek, çocuk ustalaştıkça azalır (Model → Rehberli → İstemli → Bağımsız).

**Dayanılan çerçeveler:** Şema temelli öğretim (SBI; Jitendra, Fuchs), Polya'nın problem çözme
basamakları ve Montague'nin Solve It! üstbiliş stratejisi, Somut → Yarı somut → Soyut (CRA).

**Hedef kitle:** 6–11 yaş; sınıf öğretmeni (projeksiyonla modelleme), özel eğitim ve destek eğitim
öğretmenleri, veliler.

### Beş adım

| Adım | Çocuk ne yapar |
|---|---|
| 1 Anla | Cümle cümle dinler/okur, hikâyeyi kendi sözüyle seçer, soruyu ve bilinenleri belirler |
| 2 Göster | Şemayı adlandırır, modeli kurar (önce yapı, sonra sayı), modeli denetler |
| 3 Tahmin et | Cevabın yaklaşık büyüklüğünü söyler (puanlanmaz) |
| 4 Çöz | Denklemi modelden kurar (bilinmeyen başta, ortada ya da sonda olabilir), hesaplar |
| 5 Kontrol et | Cevabı birimiyle cümleye koyar, makul mü diye bakar, kısa yansıtma yapar |

### Beş şema

| Şema | Alt türler | Sınıf |
|---|---|---|
| Değişim | birleştirme, ayırma | 1–4 |
| Parça-Bütün | iki parça, bir bütün | 1–4 |
| Karşılaştırma | fazla, az, eşitleme | 1–4 |
| Eşit Gruplar | çarpma, paylaştırma, gruplama (kalanlı dahil) | 2–4 |
| Kat Karşılaştırması | kat, birim kesir | 3–4 |

---

## Özellikler

- **Problem Çöz** ana görevi: beş adım, kademeli ipucu (ipucu cevabı asla doğrudan vermez), şema bazında azalan destek
- **Antrenman durakları:** Hikâyeyi Anlat, Tür Avcısı, Şerit Atölyesi, Modelden Denkleme, Makul mü?,
  Gereksizi Ayıkla, Sözcük Tuzağı, Hata Dedektifi, Dedektif Soruları, Problem Kurucu
- **Ayrık puanlama:** şema tanıma, model, bilinmeyen konumu, gereksiz bilgi, işlem, hesap ve birim hataları ayrı ayrı
- **Öğretmen araçları:** kendi problemini yaz ve paylaşım koduyla paylaş (sunucusuz), projeksiyon kipi,
  yazdırılabilir çalışma kâğıdı, şema × hata sınıfı tablosu, JSON dışa/içe aktarım
- Anahtar kelime stratejisi ("fazla = topla") hiçbir ipucunda ya da vurguda öğretilmez

Tasarım ayrıntısı: [DESIGN.md](./DESIGN.md)

---

## Kanıt Dayanağı

Tasarım kararları altı araştırma dosyasına dayanır: [docs/arastirma/](./docs/arastirma/)

- Şema temelli öğretim, sözel problem çözmede en güçlü kanıta sahip yaklaşımlardan biridir
  (IES/WWC 2021 uygulama rehberi, Öneri 5; SBI meta-analizleri).
- Üstbiliş (öz-sorgu, öz-denetim) ve açık strateji öğretimi MÖG olan öğrencilerde desteklenir (Montague).
- Çözümlü örnekler ve azalan destek, yeni başlayanlarda bilişsel yükü düşürür.

**Dürüst sınırlar**

- DokunSay Problem için **özgün bir etkililik çalışması yoktur**; tasarım, kanıta dayalı uygulamalardan
  türetilmiştir (ESSA Tier 4 düzeyi). Araç bir tanı aracı değildir.
- Ustalık eşikleri ve zorluk puanları sezgisel başlangıç değerleridir; veriyle ayarlanacaktır.
- Kurmancî metinler ana dil denetimi bekler. Cihazda gerçek Kurmancî ses yoksa sesli okuma gizlenir.

---

## Erişilebilirlik

- Diskalkuli modu (font büyütme, azaltılmış bilişsel yük)
- Disleksi dostu font seçeneği (Nunito / OpenDyslexic)
- Yüksek kontrast
- Renk körü paleti (Okabe-Ito) + desenli şema parçaları
- Sesli okuma (Web Speech API, cümle cümle; TR/EN, Kurmancî yalnız gerçek ses varsa)
- Klavye ile tam akış; sürükle-bırak yerine dokun-dokun alternatifi
- Az-animasyon modu (prefers-reduced-motion)

## Dil Desteği

- 🇹🇷 Türkçe (birincil)
- ☀️ Kurmancî (FerMat terimleri)
- 🇬🇧 English

---

## Geliştirme

```bash
npm install
npm run dev        # http://localhost:3009
npm test           # vitest
npm run build      # tsc -b && vite build → dist/
npm run preview
```

Kökten: `npm run dev:problem` (tek araç) ya da `npm run dev:all` (launcher + tüm araçlar).

## Dağıtım

`main` dalına push → CI (`.github/workflows/deploy-cloudflare.yml`) tam siteyi derler ve
dokunsay.com'a yayınlar. Elle `wrangler` dağıtımı yapılmaz. Yayında içerik NuMap giriş kapısının
arkasındadır (`inject-gate.mjs`, gate modu); `npm run dev`'de kapı yoktur.

Tek başına derlerken `BASE_PATH` verme (varsayılan `/DokunSayProblem/` doğrudur; Git Bash
`/…` değerlerini bozar).

---

## Mimari Özet

```
src/
├── main.tsx              # AppShell + LangSwitcher + A11yProvider
├── App.tsx               # Ana bileşen
├── content/              # Veri sözleşmesi (types.ts), üreteç, şablonlar, dilbilgisi
├── components/           # Şema diyagramları, akış, paneller
├── i18n/                 # tr, ku, en
└── lib/                  # storage (dokunsay:problem:*), speech (@shared/tts.js)
```

Detaylı standartlar için: `../_platform/STANDARDS.md`

---

## Lisans

MIT — bkz. [LICENSE](./LICENSE)

## Yazar

**Prof. Dr. Yılmaz Mutlu**
DokunSay Matematik Öğretim Araçları Platformu
2026
