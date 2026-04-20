# DokunSay

> **Diskalkuli öğrencileri için kapsamlı, araştırmaya dayalı, çok dilli matematik öğretim araçları ailesi.**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![Platform](https://img.shields.io/badge/Platform-DokunSay-f59e0b)](./_platform/STANDARDS.md)
[![Lang](https://img.shields.io/badge/lang-tr%20%2F%20ku%20%2F%20en-blue)]()

---

**DokunSay**, 5-15 yaş arası her seviyedeki öğrenciye yönelik kapsamlı bir dijital matematik öğretim araçları ailesidir. Diskalkuli (matematik öğrenme güçlüğü) olan çocuklar için de özel erişilebilirlik desteği içerir. 7 uygulama — aynı pedagojik felsefe, aynı tasarım dili, aynı erişilebilirlik standartları, her biri kendi kimlik rengine sahip.

## 🎯 Araçlar

| Araç | Simge | Konu | Yaş | Çerçeve |
|------|-------|------|-----|---------|
| [**Bar**](./DokunSayBar/) | 🧮 | Çubuklar & Pullar | 5-10 | CRA + Bruner |
| [**Basamak**](./DokunSayBasamak/) | 🔢 | Basamak Değeri | 6-10 | Bloom + Dienes |
| [**Clock**](./DokunSayClock/) | 🕐 | Saat | 6-9 | Piaget |
| [**Kesir**](./DokunSayKesir/) | 🍕 | Kesirler | 6-10 | CRA + MEB |
| [**Tam**](./DokunSayTam/) | ➕➖ | Tam Sayılar | 10-13 | Sıfır Çifti |
| [**Geo**](./Dokunsay-geo/) | 🔺 | Geometri | 5-14 | Van Hiele |
| [**Veri**](./Dokunsay-veri-app/) | 📊 | İstatistik | 7-15 | Curcio + GAISE |

## 🌐 GitHub Pages Dağıtımı

Projeyi bir GitHub reposuna push ettiğinizde **otomatik olarak yayınlanır**. Workflow:
`.github/workflows/deploy.yml`

Manuel site derlemesi (yerel önizleme):

```bash
npm install --prefix _platform/launcher
npm install --prefix DokunSayBar
# ... (her app için bir kere)
npm run install:all    # veya tek komutta hepsi

npm run build:site     # → dist-site/ klasörü
npm run preview:site   # → http://localhost:8080
```

Farklı reponame için:
```bash
SITE_BASE=/repo-adi/ npm run build:site
```

## 🚀 Hızlı Başlangıç (Geliştirme)

Platform menüsünü aç (tüm araçları tek yerden):

```bash
cd _platform/launcher
npm install
npm run dev
```

Bir aracı bağımsız çalıştır:

```bash
cd DokunSayBar
npm install
npm run dev
```

## 📚 Dokümantasyon

- **[Platform Standartları](./_platform/STANDARDS.md)** — pedagoji, kod, tasarım, erişilebilirlik
- **[Platform README](./_platform/README.md)** — mimari genel bakış
- **[Launcher README](./_platform/launcher/README.md)** — ana menü

## 🎨 Ortak Felsefe

**Pedagojik:** Somut → Yarı Soyut → Soyut (CRA) · Araştırma-temelli çerçeveler · Kavram yanılgılarını ayrı ayrı adresleme · Aşamalı zorluk

**Erişilebilirlik:** Diskalkuli modu (font ölçekleme) · Renk körü paleti (Okabe-Ito) · Yüksek kontrast · TTS (5 dil) · Klavye kısayolları · 5 dil (tr/ku/en/ar/fa, RTL destekli)

**Teknik:** React 18 · Vite 6 · Zero-runtime-dep · Inline styles · Nunito font · localStorage

## 📄 Lisans

MIT — her araç kendi LICENSE dosyasına sahiptir.

## 👤 Yazar

**Prof. Dr. Yılmaz Mutlu**
DokunSay Matematik Öğretim Araçları Platformu · 2024-2026
