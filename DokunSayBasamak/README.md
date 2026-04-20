# DokunSay Basamak (Basamak Değeri)

> Birlik-onluk-yüzlük-binlik bloklarıyla basamak değeri öğretimi.

**DokunSay Matematik Öğretim Araçları Platformu**'nun bir parçasıdır.

---

## Pedagojik Yaklaşım

DokunSay Basamak, öğrencilerin **ondalık sayı sisteminin yapısını** manipülatif bloklarla kavramasını sağlar. 10 birlik = 1 onluk, 10 onluk = 1 yüzlük... zincir yapısı somut olarak görülebilir ve dönüştürülebilir.

- **Somut:** 4 blok türü (birlik 14×14 px, onluk 14×140 px, yüzlük 140×140 px, binlik 160×160 px 3B küp).
- **Yarı-soyut:** Basamak tablosu (ths|huns|tens|ones) ve ayrıştırma gösterimi ("2473 = 2×1000 + 4×100 + 7×10 + 3×1").
- **Soyut:** Bloom taksonomisine göre derecelenmiş (L1 Hatırlama → L5 Değerlendirme) 20 soruluk havuz.

**Dayanılan Çerçeveler:** Bloom revize taksonomisi, Dienes temel-10 blokları, Van de Walle yer-değer öğretimi.

**Hedef Kitle:** 1-4. sınıf (6-10 yaş) ve diskalkuli öğrencileri.

---

## Özellikler

- **4 blok türü** drag-and-drop (birlik, onluk, yüzlük, binlik)
- **Gruplama & Bölme** — G tuşuyla 10 küçüğü 1 büyüğe dönüştür, B tuşuyla tersine
- **20+ etkinlik** (keşif, kavram, işlem, yanılgı, senaryo kategorileri)
- **Bloom L1-L5 quiz havuzu** (adapte edilebilir zorluk)
- **Basamak tablosu görünümü** (tablet mode)
- **Ayrıştırma paneli** — anlık sayı çözümlemesi
- **Ses efektleri** — ekleme, silme, gruplama, başarı
- **Sesli okuma** — TR/KU/EN (doğru Türkçe/Kürtçe sayı okuma)
- **Erişilebilirlik:** renk körü paterni (SVG), yüksek kontrast, disleksi fontu, klavye kısayolları

---

## Klavye Kısayolları

| Kısayol | Eylem |
|---------|-------|
| `Q` / `W` / `E` / `R` | Birlik / Onluk / Yüzlük / Binlik ekle |
| `G` | Gruplama (10 küçük → 1 büyük) |
| `B` | Bölme (1 büyük → 10 küçük) |
| `Del` | Seçili bloğu sil |
| `Z` / `Y` | Geri al / İleri al |
| `S` | Sesli oku |

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

Tarayıcıda `http://localhost:3002` adresine git.

## Dağıtım

```bash
npm run build
npm run deploy   # GitHub Pages
```

---

## Mimari Özet

```
src/
├── main.jsx                # React root
├── App.jsx                 # Ana uygulama
├── components/
│   ├── blocks/             # BlockSVG, BlockPatternDefs
│   ├── widgets/            # NumberLine
│   ├── ui/                 # Toggle
│   └── modals/             # ModalBackdrop
├── state/
│   └── itemsReducer.js     # items, history, undo/redo
├── utils/
│   ├── audio.js            # Web Audio tonlar
│   ├── speech.js           # TTS
│   ├── progress.js         # localStorage
│   └── numberReaders.js    # Türkçe/Kürtçe sayı okuma
├── i18n/                   # tr, ku, en çeviri
└── constants/
    ├── palette.js
    ├── dimensions.js
    ├── blockTypes.js
    ├── activities.js       # 20+ etkinlik
    └── quizPool.js         # Bloom L1-L5
```

**Dil:** JavaScript (JSX)

---

## Platform Standartları

Bu uygulama [DokunSay Platform Standartları](../_platform/STANDARDS.md) belgesine uygun geliştirilir.

## Lisans

MIT — bkz. [LICENSE](./LICENSE)

## Yazar

**Prof. Dr. Yılmaz Mutlu** · DokunSay Matematik Öğretim Araçları · 2024-2026
