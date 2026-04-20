# DokunSay Matematik Öğretim Araçları Platformu

> Diskalkuli öğrencileri için kapsamlı, araştırmaya dayalı, çok dilli matematik öğretim araçları ailesi.

**Yazar:** Prof. Dr. Yılmaz Mutlu
**Lisans:** MIT
**Dönem:** 2024-2026

---

## Platform Mimarisi

```
DokunSay/
├── _platform/                    # Platform çatısı
│   ├── STANDARDS.md              # Kapsamlı standartlar belgesi
│   ├── README.md                 # Bu dosya
│   ├── shared/                   # Ortak kaynaklar
│   │   ├── palette.js
│   │   ├── typography.css
│   │   ├── animations.css
│   │   ├── tts.js
│   │   ├── audio.js
│   │   ├── storage.js
│   │   ├── i18n-base.js
│   │   ├── eslint.config.js
│   │   ├── .prettierrc.json
│   │   ├── .editorconfig
│   │   ├── LICENSE
│   │   ├── README.template.md
│   │   └── PRIVACY.template.md
│   ├── launcher/                 # Ana menü uygulaması
│   │   ├── src/
│   │   ├── package.json
│   │   └── README.md
│   └── docs/                     # Platform dokümantasyonu
│
├── DokunSayBar/                  # 🧮 Çubuklar & Pullar
├── DokunSayBasamak/              # 🔢 Basamak Değeri
├── DokunSayClock/                # 🕐 Saat
├── DokunSayKesir/                # 🍕 Kesirler
├── DokunSayTam/                  # ➕➖ Tam Sayılar
├── Dokunsay-geo/                 # 🔺 Geometri
└── Dokunsay-veri-app/            # 📊 Veri & İstatistik
```

---

## Araç Ailesi

| Araç | Konu | Yaş | Çerçeve | Durum |
|------|------|-----|---------|-------|
| **Bar** | Sayma, parça-bütün, dört işlem | 5-10 | CRA + Bruner | ✅ Stabil |
| **Basamak** | Basamak değeri, ondalık sistem | 6-10 | Bloom L1-L5 + Dienes | ✅ Stabil |
| **Clock** | Saat ve zaman | 6-9 | Piaget + CRA | ✅ Stabil |
| **Kesir** | Kesirler | 6-10 | CRA + MEB Müfredatı | ✅ Stabil |
| **Tam** | Tam sayılar, negatif | 10-13 | Sıfır Çifti + Senaryo | ✅ Stabil |
| **Geo** | Geometri 2B/3B | 5-14 | Van Hiele + Crowley | ✅ Stabil |
| **Veri** | İstatistik okuryazarlığı | 7-15 | Curcio + GAISE + PPDAC | ✅ Stabil |

---

## Ortak Felsefeler

### Pedagojik
- **Somut-Yarı Soyut-Soyut (CRA)** her araçta temel geçiş yaklaşımıdır
- **Araştırma-temelli çerçeveler** (Van Hiele, Curcio, Bloom, Piaget, Bruner)
- **Kavram yanılgıları** her araçta ayrı etkinliklerle adreslenir
- **Aşamalı zorluk** (diff 1-5) tüm etkinliklerde tutarlıdır

### Tasarım
- **Sıcak krem palet** (#f5f0e3) göz yormaz
- **Nunito font** — disleksi dostu, yuvarlak hatlar
- **Emoji + SVG** ikonografi — minimum bağımlılık
- **44×44 px** minimum dokunmatik hedef (Apple HIG)

### Erişilebilirlik
- **Diskalkuli modu** — font ölçekleme (1.35x)
- **Renk körü modu** — Okabe-Ito paleti + SVG pattern
- **Yüksek kontrast** — WCAG 2.1 AA
- **Sesli okuma** — Web Speech API (tr-TR)
- **Klavye kısayolları** — platform-çapı tutarlı (Ctrl+Z/Y, Del, S, ?)
- **Az-animasyon modu** — `prefers-reduced-motion` saygılı

### Çok Dillilik
- 🇹🇷 **Türkçe** (birincil)
- ☀️ **Kurmancî** (Türkiye'de ana dili Kürtçe olan öğrenciler için)
- 🇬🇧 **English**

### Teknik
- **React 18.3.1** (ortak)
- **Vite 6.0.0** (hedef)
- **JavaScript (JSX)** birincil, TypeScript opt-in
- **Zero-runtime-dep** felsefesi — inline styles, custom SVG
- **localStorage** namespace: `dokunsay:<modul>:<konu>`

---

## Hızlı Başlangıç

### Platform menüsünü aç:

```bash
cd _platform/launcher
npm install
npm run dev
```

Tarayıcıda `http://localhost:3000`. Tüm araçlara buradan erişebilirsiniz.

### Bir aracı bağımsız çalıştır:

```bash
cd DokunSayBar    # veya başka bir araç
npm install
npm run dev
```

Her aracın portu STANDARDS.md'de listelenmiştir:

| Araç | Port |
|------|------|
| Launcher | 3000 |
| Bar | 3001 |
| Basamak | 3002 |
| Clock | 3003 |
| Kesir | 3004 |
| Tam | 3005 |
| Geo | 3006 |
| Veri | 3007 |

---

## Katkı

Platforma katkı yapmak için:

1. `STANDARDS.md`'yi oku
2. Yeni araç mı ekliyorsun? `_platform/shared/README.template.md`'yi kullan
3. Standart ihlali gerekiyorsa `_platform/docs/proposals/` altına RFC aç
4. ESLint + Prettier geç

---

## Lisans

MIT — her araç kendi `LICENSE` dosyasına sahiptir.

## Yazar

**Prof. Dr. Yılmaz Mutlu**
DokunSay Matematik Öğretim Araçları Platformu
Jimaro / Diskalkuli Platformu — 2024-2026
