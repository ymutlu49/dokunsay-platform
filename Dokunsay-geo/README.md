# DokunSay Geo

**Van Hiele temelli çok dilli geometri öğretim uygulaması** — Prof. Dr. Yılmaz Mutlu.

İlkokul 3-6. sınıf için tasarlanmış, diskalküli dostu (Apostolidou 2025; Butterworth 2018) dokunmatik uygulama. Türkçe, Kurmancî ve İngilizce destekler.

## Özellikler

- **14 adet 2B şekil** (üçgenler, dörtgenler, düzgün çokgenler, daire/çember)
- **7 adet 3B cisim** izometrik projeksiyon + açınım (Meng 2009)
- **Van Hiele 5-Faz Öğretim Döngüsü** (Crowley 1987): I → DO → E → FO → IN
- **3 Seviye ilerleme takibi** (L0 Görsel → L1 Analiz → L2 Soyutlama)
- **Geoboard** (Shoelace alan formülü, şekil tanıma)
- **Tangram** silüet ve parça-bütün keşif modu (Siew 2013)
- **Ölçüm araçları**: cetvel, iletki, açı ölçer, simetri ekseni
- **Öğretmen panosu**: ders planı + öğrenci ilerleme raporu
- **Erişilebilirlik**: WCAG 2.1 AA, renk körü modu, TTS (Web Speech API), ARIA live, klavye kısayolları, diskalküli modu

## Canlı Demo

🌐 **https://ymutlu49.github.io/dokunsay-geo/**

## Geliştirme

```bash
npm install
npm run dev      # Vite geliştirme sunucusu
npm run build    # Üretim derlemesi (dist/)
npm run preview  # Derlenmiş çıktıyı önizle
```

## Mimari

```
src/
├── App.jsx                      # Ana uygulama (modülleri birleştirir)
├── main.jsx                     # Uygulama girişi
│
├── constants/                   # Saf veri — render sırasında değişmez
│   ├── palette.js               #  Renk paleti + kategori meta verisi
│   ├── shapes2d.js              #  2B SHAPE_DEF kaydı + BY_CAT indeksi
│   ├── shapes3d.jsx             #  3B cisim tanımları (iso/net)
│   ├── phases.js                #  Crowley 5-faz dizileri
│   ├── vhLevels.js              #  Van Hiele seviye metadata
│   ├── activities.js            #  Hızlı quiz bankası (21 soru)
│   ├── misconceptions.js        #  Yanlış kavram kataloğu
│   └── i18n.js                  #  tr / ku / en sözlüğü
│
├── lib/                         # Saf iş mantığı
│   ├── tts.js                   #  Web Speech API sarmalayıcısı
│   ├── shapes/                  #  🧩 OOP Şekil sınıf hiyerarşisi
│   │   ├── Shape.js             #    Soyut taban sınıf
│   │   ├── Triangle.js          #    Üçgen ailesi
│   │   ├── Quadrilateral.js     #    Dörtgen ailesi (kare ⊂ dikdörtgen)
│   │   ├── RegularPolygon.js    #    Düzgün çokgenler (n ≥ 5)
│   │   ├── CircleShape.js       #    Daire/çember (eğri)
│   │   └── ShapeFactory.js      #    Tip → sınıf eşlemesi
│   └── pedagogy/
│       └── VanHieleProgress.js  #  Seviye kilidi + puan kaydı
│
├── utils/                       # Saf fonksiyonlar
│   ├── geometry.js              #  project3D, isoProject, symmCount
│   ├── geoboard.js              #  Shoelace alanı, çevre, şekil tanıma
│   ├── svgCoords.js             #  Ekran → SVG koordinat dönüşümü
│   ├── id.js                    #  nextId, SNAP, snapXY
│   └── storage.js               #  localStorage sarmalayıcıları
│
├── hooks/
│   └── canvasReducer.js         # Kanvas durumu (items/strokes/history)
│
└── components/
    ├── Canvas/                  # SVG şekiller + ızgara + etiketler
    ├── Props/                   # Özellikler paneli
    ├── Activities/              # Etkinlik ve faz kartları
    └── Common/                  # VHBadge, Toggle, SpeakButton
```

## OOP Şekil Sınıfı Örneği

```js
import { createShape } from "./lib/shapes/ShapeFactory.js";

const sq = createShape("square", { cx: 100, cy: 100, size: 120 });
sq.area();             // 13271.04 (px²)
sq.areaInUnits();      // 132.7  (birim²)
sq.isSquare();         // true
sq.isRectangle();      // true   ← kare hem dikdörtgendir (hiyerarşi)
sq.isRhombus();        // true
sq.symmetryLines();    // 4
```

## Kaynaklar (Pedagoji)

- **van Hiele, P. M. (1986).** *Structure and Insight: A Theory of Mathematics Education.*
- **Crowley, M. L. (1987).** "The van Hiele Model of the Development of Geometric Thought." *NCTM Yearbook.*
- **Clements & Battista (1992).** "Geometry and Spatial Reasoning." *Handbook of Research on Mathematics Teaching and Learning.*
- **Siew, N. M. et al. (2013).** Tangram + Van Hiele, 3. sınıf 221 öğrenci çalışması.
- **Meng, C. C. (2009).** GSP ile 3B ↔ açınım L0 → L1 geçişi.
- **Butterworth, B. (2018).** *Dyscalculia: From Science to Education.*
- **Apostolidou, A. (2025).** Multisensör girdisi ve diskalküli.

## Lisans

MIT — ayrıntı için [LICENSE](./LICENSE).
