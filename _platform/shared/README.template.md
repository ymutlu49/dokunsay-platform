# {{APP_NAME}}

> {{TAGLINE}}

{{APP_NAME}}, **DokunSay Matematik Öğretim Araçları Platformu**'nun bir parçasıdır.

---

## Pedagojik Yaklaşım

{{PEDAGOGICAL_APPROACH}}

**Dayanılan Çerçeve(ler):** {{FRAMEWORKS}}

**Hedef Kitle:** {{TARGET_AUDIENCE}}

---

## Özellikler

{{FEATURES}}

---

## Erişilebilirlik

- Diskalkuli modu (font büyütme, azaltılmış bilişsel yük)
- Disleksi dostu font seçeneği (Nunito / OpenDyslexic)
- Yüksek kontrast
- Renk körü paleti (Okabe-Ito)
- Sesli okuma (Web Speech API, TR/KU/EN)
- Klavye kısayolları
- Az-animasyon modu (prefers-reduced-motion)

---

## Dil Desteği

- 🇹🇷 Türkçe (birincil)
- ☀️ Kurmancî
- 🇬🇧 English

---

## Kurulum

```bash
npm install
```

## Geliştirme

```bash
npm run dev
```

Tarayıcıda `http://localhost:{{PORT}}` adresine git.

## Dağıtım

```bash
npm run build
npm run preview   # yerel önizleme
```

{{DEPLOY_NOTES}}

---

## Mimari Özet

```
src/
├── main.jsx              # Giriş noktası
├── App.jsx               # Ana bileşen
├── components/           # UI bileşenleri
├── hooks/                # Custom hooks
├── constants/            # Statik veri (palette, activities)
├── utils/                # Yardımcı fonksiyonlar
├── i18n/                 # Çeviri dosyaları (tr, ku, en)
└── styles/               # CSS dosyaları
```

Detaylı standartlar için: `../_platform/STANDARDS.md`

---

## Lisans

MIT — bkz. [LICENSE](./LICENSE)

## Yazar

**Prof. Dr. Yılmaz Mutlu**
DokunSay Matematik Öğretim Araçları Platformu
2024-2026
