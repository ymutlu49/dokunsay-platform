# DokunSay Veri — İstatistik Okuryazarlığı Öğretim Uygulaması

Diskalkulik öğrencilere odaklı, çok dilli (**Türkçe / Kurmancî / English**) grafik okuma ve istatistik okuryazarlığı uygulaması.

**Canlı demo:** https://ymutlu49.github.io/dokunsay-veri/

## Pedagojik Temel

- **Curcio (1987)** — Graph Comprehension Levels (L0→L3)
- **GAISE (2020)** — Guidelines for Assessment & Instruction in Statistics
- **Wild & Pfannkuch (1999)** — PPDAC döngüsü (Problem → Plan → Data → Analyze → Conclude)
- **Friel, Curcio & Bright (2001)** — Grafik okuma güçlükleri
- **Watson & Callingham (2003)** — İstatistiksel okuryazarlık hiyerarşisi
- **Huff (1954)** — "How to Lie with Statistics"

## Özellikler

### Öğrenci Modülleri
- **🔍 Keşfet** — Oku, Yanıltma, Dünya (gerçek veriler), Tanı (grafik türü tanıma)
- **🛠️ Araçlar** — Oluştur, Merkez (mean/median/mode), İlişki (scatter), Olasılık, Topla (sınıf anketi)
- **⚙️ Yönetim** — Öğretmen panosu, Ayarlar

### Erişilebilirlik
- **Diskalkuli Modu** — %35 daha büyük yazı, sayılar yazıyla ("15 milyon 700 bin")
- **Renk Körü Modu** — Okabe-Ito paleti
- **Sesli Anlatım (TTS)** — Web Speech API
- **Notice & Wonder** — NCTM gözlem pedagojisi

### Veri Saklama
- `localStorage` — öğrenci profili, ilerleme, test sonuçları, dil tercihi

### Teşhis Testi
- 8 soru A seti (ön test), 8 soru B seti (son test, ezberlemeyi önler)
- Seviye önerisi algoritması (L0→L3)

## Proje Yapısı

```
src/
├── App.jsx                    # Orchestrator
├── main.jsx                   # Entry point
├── contexts/
│   └── A11yContext.jsx        # Erişilebilirlik context
├── utils/
│   ├── numberFormat.js        # numberToWords, formatBigNumber
│   ├── speech.js              # Web Speech API
│   ├── storage.js             # localStorage helpers
│   └── correlation.js         # pearson, correlationLabel
├── data/
│   ├── constants.js           # LEVELS, TRANSLATIONS, palette
│   ├── diagnostic.js          # Teşhis soruları + algoritma
│   └── activities.jsx         # READ, DECEPTION, WORLD aktiviteleri
├── components/
│   ├── charts.jsx             # 6 grafik türü (SVG)
│   ├── common.jsx             # SpeakButton, LevelBadge, ErrorBoundary…
│   └── dialogs.jsx            # OnboardingTour, Profile, Diagnostic
└── modules/
    └── educational.jsx        # Read, Deceive, Center, Create, Relate…
```

## Geliştirme

```bash
npm install
npm run dev       # localhost:5173
npm run build     # production build → dist/
npm run preview   # built asset'i önizle
```

## Deploy

`main` branch'e push edince GitHub Actions otomatik olarak GitHub Pages'e deploy eder (`.github/workflows/deploy.yml`).

## Teknoloji

- **React 18** — functional components, hooks, Error Boundaries
- **Vite 5** — hızlı HMR + production build
- **Zero runtime dependencies** — saf React, inline SVG, inline CSS-in-JS
- **~130 kB gzip** — tek bundle, offline-capable

## Lisans

Eğitim amaçlı serbest kullanım. Ticari kullanım için yazar ile iletişime geçin.
