# DokunSay Bar (Çubuklar & Pullar)

> Manipülatif sayı çubukları ve renkli pullarla sayma, değer ve dört işlem öğretimi.

**DokunSay Matematik Öğretim Araçları Platformu**'nun bir parçasıdır.

---

## Pedagojik Yaklaşım

DokunSay Bar, diskalkuli öğrencileri için **somut-yarı soyut-soyut (CRA)** geçişini destekleyen bir sayma ve işlem materyalidir. Öğrenciler:

1. **Somut:** Farklı uzunluklarda çubukları (1-10) kanvasa sürükler, sayar.
2. **Yarı-soyut:** Çubuklara renkli pulları yerleştirir, 5'li/10'lu çerçevelere ayırır.
3. **Soyut:** Çubukları parçalayıp (⊂) veya birleştirip (⊕) işlemleri soyut olarak tartışır.

**Dayanılan Çerçeveler:** CRA (Bruner), kavram yanılgıları literatürü, Stern & Barb sayma gelişimi modeli.

**Hedef Kitle:** 5-10 yaş diskalkuli ve matematik öğrenme güçlüğü olan çocuklar.

---

## Özellikler

- **30+ hazır şablon** (serbest keşif, sayma oyunları, toplama-çıkarma, parça-bütün)
- **AR modu** — kamera ile çubukları gerçek dünyaya yerleştirme (Capacitor + React Three Fiber)
- **3B görünüm** — Three.js tabanlı izometrik perspektif
- **Sesli okuma** — 5 dil: TR, KU, EN, AR, FA
- **Öğretmen modu** — ilerleme takibi, özel şablon oluşturma
- **Firebase senkronizasyonu** — bulut yedekleme (opsiyonel)
- **PNG export** — çalışmayı resim olarak kaydet
- **Erişilebilirlik:** Klavye kısayolları, ARIA etiketleri, odak göstergeleri

---

## Dil Desteği

🇹🇷 Türkçe · ☀️ Kurmancî · 🇬🇧 English · 🇸🇦 العربية · 🇮🇷 فارسی

---

## Kurulum

```bash
npm install
```

## Geliştirme

```bash
npm run dev
```

Tarayıcıda `http://localhost:3001` adresine git.

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
├── main.tsx                      # React root + Provider'lar
├── App.tsx                       # Ana orchestrator
├── components/
│   ├── ar/                       # AR kamera & 3B görünüm
│   ├── auth/                     # Firebase Auth
│   ├── canvas/                   # Rod, Chip, Frame, NumberLine
│   ├── overlays/                 # Help, About, Instruction modaları
│   └── toolbar/                  # Alt araç çubuğu
├── state/
│   ├── AppContext.tsx            # Canvas durumu
│   ├── AuthContext.tsx           # Oturum
│   └── ARContext.tsx             # AR modu
├── services/
│   ├── audioService.ts           # Web Audio tonlar
│   ├── speechService.ts          # TTS + voice commands
│   ├── i18nService.ts            # 5-dil çeviri
│   └── firestoreService.ts       # Firebase
├── utils/                        # geometry, alignment
├── hooks/                        # useHistory, useResponsive
├── data/                         # templates, numberWords
└── constants/                    # colors, dimensions
```

**Dil:** TypeScript (strict)
**Build:** `tsc -b && vite build`

---

## Platform Standartları

Bu uygulama [DokunSay Platform Standartları](../_platform/STANDARDS.md) belgesine uygun geliştirilir.

## Lisans

MIT — bkz. [LICENSE](./LICENSE)

## Yazar

**Prof. Dr. Yılmaz Mutlu** · DokunSay Matematik Öğretim Araçları · 2024-2026
