# DokunSay Tam (Tam Sayılar)

> Pozitif/negatif pullar, sıfır çifti ve senaryolarla tam sayı işlemleri öğretimi.

**DokunSay Matematik Öğretim Araçları Platformu**'nun bir parçasıdır.

---

## Pedagojik Yaklaşım

DokunSay Tam, tam sayıları öğretmenin en zorlu kısmı olan **negatif kavramını** ve **sıfır çifti mantığını** somutlaştırır. Çok modelli yaklaşım (pul + sayı doğrusu + termometre + asansör) negatif sayıları gerçek yaşam deneyimlerine bağlar.

- **Somut:** Yeşil (+) ve kırmızı (−) pulları kanvasa yerleştir. Zıt pullar birbirini yok eder (sıfır çifti → 800ms "poof" animasyonu).
- **Yarı-soyut:** Sayı doğrusu üzerinde yürüyen figür, termometre (sıcaklık), asansör (kat hareketi).
- **Soyut:** İşlem notasyonu (+, −, ×, ÷), senaryo problemleri (borç/alacak, deniz seviyesi).

**Dayanılan Çerçeveler:** Sıfır çifti modeli (annihilation), senaryo-temelli öğrenme, kavram yanılgıları literatürü.

**Hedef Kitle:** 5-7. sınıf (10-13 yaş) ve diskalkuli öğrencileri.

---

## Özellikler

- **Pul modeli** — pozitif (yeşil) ve negatif (kırmızı) pullar
- **Sıfır çifti animasyonu** — zıt pullar birbirini yok eder (görsel güçlendirme)
- **Çoklu model:**
  - 🏢 **Asansör** — kat +/− hareket
  - 🌡️ **Termometre** — sıcaklık değişimi
  - 💰 **Borç/Alacak** — finansal bağlam
  - 🐟 **Deniz Seviyesi** — derinlik/yükseklik
  - 🚶 **Yürüyen figür** — sayı doğrusu üzerinde yürüme animasyonu
- **24 etkinlik** + **6 senaryo sorusu** + **15 soruluk quiz**
- **8 kavram yanılgısı etkinliği** (eksi × eksi, çıkarma işareti, borç-kazanç vb.)
- **Sesli okuma** — Türkçe TTS
- **Modüler mimari** — 7 custom hook + 20+ bileşen (refaktör örnek)

---

## Kavram Yanılgıları

- Y1: Eksi × eksi = eksi sanma
- Y2: Sayı büyüklüğü (|-5| > |3| ise -5 daha büyük)
- Y3: Çıkarma işaretini ayıramama
- Y4: İşaret vs işlem karışımı
- Y5: Mutlak değer yanılgıları
- Y6: Çıkarmada negatif sonuç
- Y7: Sıfırın rolü
- Y8: Borç-kazanç çarpma

---

## Dil Desteği

🇹🇷 Türkçe (ana dil)
> Kurmancî ve İngilizce standart i18n ile eklenmek üzere planlanmıştır.

---

## Kurulum

```bash
npm install
```

## Geliştirme

```bash
npm run dev
```

Tarayıcıda `http://localhost:3005` adresine git.

## Dağıtım

```bash
npm run build
npm run preview
```

---

## Mimari Özet

```
src/
├── main.jsx                    # React root + animations.css
├── App.jsx                     # Ana orchestrator (427 satır — en modüler)
├── components/
│   ├── canvas/                 # BridgePanel, Factory, NumberLine,
│   │                           # OperationTray, Thermometer, Toolbar
│   ├── layout/                 # Header, Sidebar, BottomBar
│   ├── common/                 # Chip, Logo, Switch, WalkingPerson
│   ├── modals/                 # About, Activity, Help, TeacherPanel
│   └── sidebar/                # Activities, Features, Games, Materials
├── hooks/                      # useCanvasItems, useNumberLine,
│                               # useTray, useFactory, useDrawing,
│                               # usePages, usePanelDrag
├── constants/                  # theme, activities, quizData
├── utils/                      # speech
└── styles/                     # animations.css
```

**Dil:** JavaScript (JSX)
**Not:** React 19.2.4 ve Vite 8.0.4 kullanır — platform standardı 18.3.1/6.0.0'a uyumlandırma değerlendirilmektedir.

---

## Platform Standartları

Bu uygulama [DokunSay Platform Standartları](../_platform/STANDARDS.md) belgesine uygun geliştirilir. Modüler yapısı platform için referans örnektir.

## Lisans

MIT — bkz. [LICENSE](./LICENSE)

## Yazar

**Prof. Dr. Yılmaz Mutlu** · DokunSay Matematik Öğretim Araçları · 2024-2026
