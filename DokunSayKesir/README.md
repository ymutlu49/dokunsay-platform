# DokunSay Kesir (Kesirler)

> Bar modeli, pasta grafik ve sayı doğrusuyla kesir kavramı öğretimi.

**DokunSay Matematik Öğretim Araçları Platformu**'nun bir parçasıdır.

---

## Pedagojik Yaklaşım

DokunSay Kesir, kesirleri **üç eş-zamanlı temsil**le öğretir: bar modeli (parça-bütün), pasta grafik (alan) ve sayı doğrusu (konum). Bu çoklu temsil yaklaşımı kesirlerin en yaygın kavram yanılgılarını adresler.

- **Somut:** 9 farklı genişlikteki barları (1, 2, 3, 4, 5, 6, 8, 10, 12 parçalı) sürükle-bırak.
- **Yarı-soyut:** Otomatik pasta grafik ve sayı doğrusu senkronizasyonu.
- **Soyut:** Pay/payda notasyonu, denklik kontrolü (= butonu), dört işlem.

**Dayanılan Çerçeveler:** CRA, MEB müfredatı (M.1.1.4.1 → M.4.1.7.2), kesir kavram yanılgıları literatürü.

**Hedef Kitle:** 1-4. sınıf (6-10 yaş) ve diskalkuli öğrencileri.

---

## Özellikler

- **40+ etkinlik** — keşif, kavram, işlem, kavram yanılgısı kategorileri
- **14 özel kavram yanılgısı etkinliği** — literatürde atıflı (Stafylidou & Vosniadou, Ni & Zhou, Pesen, Aksoy & Yazlık, Biber-Tuna-Aktaş, Soylu & Soylu, Alkhateeb)
- **3 eş-zamanlı temsil** — bar + pasta + sayı doğrusu
- **Makas aracı (✂)** — barı herhangi bir noktadan kes
- **Dört işlem** — +, −, ×, ÷ operatörleri clickable validation ile
- **Sesli okuma** — TTS Türkçe kesir adları ("üç bölü dört", "dörtte üç")
- **Sorun-çözüm senaryoları** — MEB müfredatına hizalı
- **Native mobil** — Capacitor Android build (`com.dokunsay.kesirler`)

---

## Kavram Yanılgıları Listesi

| Kod | Yanılgı | Kaynak |
|-----|---------|--------|
| Y1 | Pay/payda karışımı | - |
| Y2 | Eşit olmayan parçalar | - |
| Y3-Y7 | Konum, toplama, çarpma, bölme yanılgıları | - |
| Y8 | "Kesir iki sayı mı?" | Stafylidou & Vosniadou 2004 |
| Y9 | "0-1 arası boş mu?" | Ni & Zhou 2005 |
| Y10 | "Pay arttıkça?" | Aksoy & Yazlık 2017 |
| Y11 | "Bileşik ↔ tam sayılı" | Pesen 2007 |
| Y12 | "Çıkarmada terslik" | Biber, Tuna & Aktaş 2013 |
| Y13 | "Toplama mı çarpma mı?" | Soylu & Soylu 2005 |
| Y14 | Denklik yanılgıları | Alkhateeb 2019 |

---

## Dil Desteği

🇹🇷 Türkçe · ☀️ Kurmancî · 🇬🇧 English

---

## Kurulum

```bash
npm install
```

## Geliştirme

```bash
npm run dev
```

Tarayıcıda `http://localhost:3004` adresine git.

## Dağıtım

```bash
npm run build
npm run preview
```

Android build:
```bash
npx cap sync android
npx cap open android
```

---

## Mimari Özet

```
src/
├── main.jsx                    # I18nProvider wrapper
├── App.jsx                     # Ana uygulama
├── index.css                   # Global stiller
└── i18n/
    ├── index.jsx               # Context + useI18n hook
    ├── tr.js, ku.js, en.js
```

**Dil:** JavaScript (JSX)
**Base path:** `/DokunSayFraction/`
**Capacitor appId:** `com.dokunsay.kesirler`

---

## Platform Standartları

Bu uygulama [DokunSay Platform Standartları](../_platform/STANDARDS.md) belgesine uygun geliştirilir. Monolitik `src/App.jsx`'in modüler yapıya bölünmesi roadmap'te.

## Lisans

MIT — bkz. [LICENSE](./LICENSE)

## Yazar

**Prof. Dr. Yılmaz Mutlu** · DokunSay Matematik Öğretim Araçları · 2024-2026
