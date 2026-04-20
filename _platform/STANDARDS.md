# DokunSay Platform — Standartlar ve İlkeler

**Sürüm:** 1.0.0
**Tarih:** 2026-04-19
**Kapsam:** DokunSayBar, DokunSayBasamak, DokunSayClock, DokunSayKesir, DokunSayTam, Dokunsay-geo, Dokunsay-veri-app

Bu belge, DokunSay Matematik Öğretim Araçları ailesinin tümünde uyulacak ortak standartları tanımlar. Amaç: her uygulama bağımsız kalırken ortak pedagojik, teknik ve tasarım dilini paylaşmaktır.

---

## 1. PEDAGOJİK STANDARTLAR

Tüm DokunSay uygulamaları aşağıdaki pedagojik temelleri paylaşır.

### 1.1 Temel Çerçeve: Somut-Yarı Soyut-Soyut (CRA)
Her matematiksel kavram üç aşamada sunulmalıdır:

| Aşama | Tanım | DokunSay Örnekleri |
|-------|-------|---------------------|
| **Somut (Concrete)** | Fiziksel/dokunmatik manipülatif | Bar: çubuklar; Basamak: bloklar; Tam: pullar; Geo: 2B şekiller |
| **Yarı Soyut (Representational)** | Görsel temsil (resim, diyagram) | Sayı doğrusu, pasta grafik, açınım |
| **Soyut (Abstract)** | Sembolik notasyon | 1/2, −3, ∠60°, x̄ |

Bir uygulamada öğrenci her üç aşamaya da erişebilmelidir; kullanıcı kendi hızında geçiş yapmalıdır.

### 1.2 Bilimsel Çerçevelere Atıf
Her uygulama, öğrettiği konuya uygun araştırma çerçevesine dayalı olmalıdır:

- **DokunSay-geo** → Van Hiele Seviyeleri (L0 Görsel, L1 Analiz, L2 Soyutlama) + 5-Faz Dersi (Crowley 1987)
- **DokunSay-veri** → Curcio (1989) "Seviyeler" + GAISE (2016) + PPDAC
- **DokunSayBasamak, DokunSayTam** → Bloom Revize Taksonomisi (Hatırlama → Değerlendirme)
- **DokunSayBar, DokunSayKesir** → CRA + Bruner (Enactive-Iconic-Symbolic) + Kavram Yanılgısı Literatürü
- **DokunSayClock** → Piaget zaman kavramı gelişimi + dakika/saat eşgüdümü

### 1.3 Diskalkuli-Duyarlı Tasarım (Zorunlu)
Her uygulama diskalkuli modu sağlar:

- **Büyük dokunmatik hedefler** (≥ 44×44 px)
- **Font ölçeklendirme** (1x → 1.35x — disleksi dostu)
- **Yüksek kontrast** (seçenek)
- **Renk körü modu** (SVG pattern + Okabe-Ito paleti: #d55e00, #0072b2, #cc79a7, #009e73)
- **Disleksi dostu font** (Nunito 600-900 veya OpenDyslexic)
- **Azaltılmış bilişsel yük** (ekranda aynı anda max 3 bilgi katmanı)
- **Tutarlı görsel dil** (aynı kavram = aynı renk/ikon platform genelinde)

### 1.4 Geri Bildirim İlkeleri
- **Anında ve çoklu modda** (görsel + işitsel + titreşim)
- **Pozitif pekiştirme** (hata → "Tekrar deneyelim" + ipucu; doğru → "Harika!")
- **Mikro-adım** (her doğru etkileşim anında kutlanır)
- **Sözel okuma** (Web Speech API, tr-TR varsayılan, rate 0.85, pitch 1.1)

### 1.5 Kavram Yanılgıları (Misconceptions)
Her uygulama, konunun bilinen kavram yanılgılarına yönelik en az 3 özel etkinlik içerir. Kaynak literatürle atıflandırılmalı (örn: "Stafylidou & Vosniadou 2004").

### 1.6 Aşamalı Zorluk (Scaffolding)
Etkinlikler zorluk seviyesine göre etiketlenir:

| diff | Seviye | Açıklama |
|------|--------|----------|
| 1 | Keşif | Serbest, kural yok, sadece etkileşim |
| 2 | Rehberli | Hedef var, ipucu bol, hata yok |
| 3 | Yönlendirilmiş | Daha kısıtlı, başarı kriterleri var |
| 4 | Bağımsız | Öğrenci yönlendirici değil, soru çözer |
| 5 | Transfer | Gerçek hayat senaryosu, problem kurma |

### 1.7 Çok Dillilik (Zorunlu En Az 3 Dil)
- **tr** (Türkçe) — birincil
- **ku** (Kurmancî) — diskalkuli öğrenimi için özellikle önemli (Türkiye'de ana dili Kürtçe olan öğrenciler)
- **en** (English) — uluslararası erişim

i18n yapısı: `{ tr: {...}, ku: {...}, en: {...} }` obje haritası, `t(key)` fonksiyonu.

### 1.8 Öğretmen Paneli (Teşvik Edilir)
Mümkünse her uygulamada:
- Öğrenci ilerleme takibi (localStorage)
- Ders planı düzenleyici
- Etkinlik raporu (JSON export/import)

---

## 2. TEKNİK STANDARTLAR

### 2.1 Sürüm Kilidi
| Paket | Sürüm | Gerekçe |
|-------|-------|---------|
| `react` | `^18.3.1` | Stabil, tüm ekosistem uyumlu |
| `react-dom` | `^18.3.1` | React ile eşleşir |
| `vite` | `^6.0.0` | En güncel stabil major |
| `@vitejs/plugin-react` | `^4.3.4` | Vite 6 ile uyumlu |

**İstisna:** DokunSayBar TypeScript kullandığı için ayrıca `typescript: ~5.6.2`.

### 2.2 Dil Tercihi
- **Birincil:** JavaScript + JSX (tüm ekip kolayca okuyabilir, build adımı basit)
- **İsteğe bağlı:** TypeScript (yeni büyük modüller için önerilir; DokunSayBar referans örneği)
- **Kararlılık için:** Yeni uygulamalar JS ile başlasın; olgunlaştıkça TS'e geçilebilir.

### 2.3 Paket Adlandırma
Tüm uygulama paket adları şu kalıba uyar:

```
dokunsay-<modul>
```

Karar listesi:
| Uygulama | Eski ad | Yeni standart ad |
|---|---|---|
| DokunSayBar | `dokun-say-bar` | `dokunsay-bar` |
| DokunSayBasamak | `dokun-say-basamak` | `dokunsay-basamak` |
| DokunSayClock | `dokun-say-clock` | `dokunsay-clock` |
| DokunSayKesir | `dokun-say-fraction` | `dokunsay-kesir` |
| DokunSayTam | `dokun-say-exact` | `dokunsay-tam` |
| Dokunsay-geo | `dokunsay-geo` | `dokunsay-geo` ✓ |
| Dokunsay-veri-app | `dokunsay-veri` | `dokunsay-veri` ✓ |

### 2.4 Capacitor App ID Kalıbı
Mobil dağıtım yapılan uygulamalar için:

```
com.dokunsay.<modul>
```

Örnek: `com.dokunsay.bar`, `com.dokunsay.kesir`, `com.dokunsay.tam`.

### 2.5 Proje Yapısı (Klasör Dizilişi)
Her uygulama `src/` altında aşağıdaki yapıyı hedefler:

```
src/
├── main.jsx                 # Entry: createRoot, Provider sarmaları
├── App.jsx                  # Ana bileşen (orchestrator)
├── components/              # Yeniden kullanılabilir UI bileşenleri
│   ├── canvas/              # Ana etkileşim alanı (SVG/Canvas)
│   ├── layout/              # Header, Sidebar, Footer
│   ├── modals/              # Overlay pencereler
│   └── common/              # SpeakButton, Toggle, Logo gibi primitives
├── hooks/                   # Custom hooks (useXxx.js)
├── constants/               # Statik veri (palette, activities, i18n)
│   ├── palette.js
│   └── activities.js
├── utils/                   # Yardımcı fonksiyonlar (audio.js, speech.js, storage.js)
├── i18n/                    # Çeviri dosyaları (tr.js, ku.js, en.js, index.js)
└── styles/                  # animations.css, global.css
```

**Kural:** App.jsx 600 satırı geçerse → hooks ve components'e ayır.

### 2.6 Durum Yönetimi (State Management)
- **Yerel & Basit:** `useState` (App.jsx seviyesinde <10 state için)
- **Orta Karmaşık:** Custom hooks (`useCanvasItems`, `useNumberLine` gibi)
- **Karmaşık:** `useReducer` + Context (DokunSayBar ve Dokunsay-geo gibi)
- **Yasak:** Redux, Zustand gibi harici paketler (kütüphane minimum felsefesi)

### 2.7 Harici Bağımlılık Kuralları
**İzin verilenler (gerekirse):**
- `react`, `react-dom`
- `@vitejs/plugin-react`, `vite`
- `@capacitor/*` (mobil build)
- `firebase` (sadece auth/firestore gerektiren uygulamalar — ör. DokunSayBar)
- `three`, `@react-three/fiber`, `@react-three/drei` (sadece 3B/AR gereken uygulamalar)
- `gh-pages` (deploy için)

**Yasak:**
- Tailwind CSS (inline style ve CSS-in-JS kararı verildi)
- UI kütüphaneleri (MUI, Chakra, Radix vb. — custom manipülatifler için uygunsuz)
- `styled-components`, `@emotion/*` (runtime overhead)
- State kütüphaneleri (Redux, Zustand)

### 2.8 Build ve Script Standartları
Her `package.json` şu scriptleri içerir:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint .",
    "deploy": "vite build && gh-pages -d dist"
  }
}
```

TypeScript kullanan projelerde `build` → `"tsc -b && vite build"`.

### 2.9 Vite Config Standardı
```javascript
// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: process.env.BASE_PATH || '/DokunSay<Modul>/',
  server: { port: 3000 /* farklı port her uygulama için */ },
  build: {
    sourcemap: false,
    minify: 'esbuild',
    outDir: 'dist',
  },
});
```

Port atamaları:
| Uygulama | Port |
|---|---|
| Launcher | 3000 |
| Bar | 3001 |
| Basamak | 3002 |
| Clock | 3003 |
| Kesir | 3004 |
| Tam | 3005 |
| Geo | 3006 |
| Veri | 3007 |

### 2.10 Kod Kalite Araçları
- **ESLint:** Paylaşılan config `_platform/shared/eslint.config.js`
- **Prettier:** Paylaşılan `_platform/shared/.prettierrc.json`
- **EditorConfig:** `_platform/shared/.editorconfig`

### 2.11 Test Stratejisi (Hedef, Zorunlu Değil)
- **Vitest** (Vite ile uyumlu)
- Hedef: kritik yardımcı fonksiyonlar (`utils/speech.js`, `utils/audio.js`) %80 coverage
- Bileşen testleri: Testing Library + jsdom

---

## 3. TASARIM STANDARTLARI

### 3.1 Renk Paleti (Ana)
Platform genelinde tutarlı kullanılır. Her uygulamada `constants/palette.js`'te `import`lanır.

```javascript
export const COLORS = {
  // Arka plan (sıcak, krem tonlar — göz yormayan)
  bg: '#f5f0e3',
  bgDark: '#2d2520',
  panel: '#fffdf7',
  panelDark: '#1a1a1a',

  // Metin
  text: '#3d3520',
  textSoft: 'rgba(61, 53, 32, 0.65)',
  textLight: '#ffffff',

  // Aksan
  accent: '#f59e0b',       // altın/turuncu — sıcaklık
  accentDark: '#92400e',

  // Kategoriler (matematik konuları)
  positive: '#22c55e',     // yeşil — doğru, pozitif
  negative: '#ef4444',     // kırmızı — yanlış, negatif
  neutral: '#8b5cf6',      // mor — sıfır, nötr
  info: '#3b82f6',         // mavi — bilgi

  // Sınır & yüzey
  border: '#d4c9a8',
  shadow: 'rgba(61, 53, 32, 0.08)',

  // Renk körü paleti (Okabe-Ito)
  colorblind: {
    orange: '#d55e00',
    blue: '#0072b2',
    pink: '#cc79a7',
    green: '#009e73',
    yellow: '#f0e442',
    skyblue: '#56b4e9',
    vermillion: '#e69f00',
  },
};
```

### 3.2 Tipografi
- **Birincil Font:** `Nunito` (Google Fonts, ağırlıklar 600-900)
- **Yedek:** `system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`
- **Disleksi seçeneği:** `OpenDyslexic` (opt-in)
- **Boyut ölçeği:** 12px / 14px / 16px / 18px / 22px / 28px / 36px / 48px
- **Ağırlıklar:** 600 (normal), 700 (vurgu), 900 (başlık)

### 3.3 İkonografi
- **Birincil:** Inline SVG (özel bileşenler — `components/common/Logo.jsx` gibi)
- **İkincil:** Emoji (renkli, evrensel, hafif) — ör. 🎨 📐 🔢
- **Yasak:** Icon font kütüphaneleri (lucide-react, heroicons — harici bağımlılık minimum)

### 3.4 Animasyon Kütüphanesi (CSS)
Paylaşılan `_platform/shared/animations.css` aşağıdaki anahtar animasyonları içerir:

- `popIn` — yeni öge belirme (0 → 1, scale 0.8 → 1, 400ms)
- `fadeIn` — opaklık (0 → 1, 200ms)
- `pulse` — vurgu (scale 1 → 1.05 → 1, 1000ms)
- `float` — yumuşak süzülme (translateY, 3000ms sonsuz)
- `jumpArc` — sayı doğrusu zıplama (parabolik, 800ms)
- `zeroPoof` — sıfır çifti patlama (800ms)
- `snapIn` — ızgaraya yapışma (150ms)
- `dsCount` — sayma pulsu (yeşil, 600ms)

**İlke:** Animasyonlar anlamlıdır — süslü değil, pedagojik yönelimli.

### 3.5 Yerleşim (Layout)
- **Header:** 56px yükseklik, başlık + dil + zoom + diskalkuli toggle
- **Sidebar:** 280px genişlik (kategori + etkinlik listesi), `<720px` cihazlarda gizli/açılır
- **Canvas:** Kalan alan (flex: 1), ızgaralı SVG/Canvas
- **Footer:** 40px (çizim aracı paleti)

### 3.6 Dokunmatik Optimizasyon
- `touch-action: manipulation` tüm etkileşim alanlarında
- `-webkit-tap-highlight-color: transparent`
- Minimum hedef 44×44 px (Apple HIG)
- Drag ghost opacity 0.85
- Snap toleransı 16-24 px

### 3.7 Karanlık Mod (Hedef)
Şu anda çoğu uygulama sadece açık mod. Gelecekte eklenecek:
- `[data-theme="dark"]` root toggle
- Paletin `bgDark`, `panelDark` varyantları kullanılır

---

## 4. ERİŞİLEBİLİRLİK STANDARTLARI (A11Y)

### 4.1 WCAG 2.1 AA Hedefleri
- **Kontrast:** Metin 4.5:1, büyük metin 3:1
- **Klavye:** Tüm etkileşimler klavyeyle erişilebilir (Tab, Enter, ok tuşları, Del, Ctrl+Z/Y)
- **Odak göstergesi:** Her interaktif öge görsel odak halkası (`outline: 2px solid accent`)

### 4.2 ARIA
- `role="main"` → canvas
- `role="button"` → özel tıklanabilir divler
- `aria-label` → her buton ve SVG
- `aria-live="polite"` → geri bildirim mesajları
- `aria-hidden="true"` → dekoratif ögeler

### 4.3 Ekran Okuyucu
- Her SVG grafiğinin `<title>` ve `<desc>` öğesi
- Dinamik metinler `aria-live` bölgelere bağlı
- TTS ikinci sunum kanalı (opsiyonel, her kullanıcı için değil)

### 4.4 Modları Zorunlu Sağla
Her uygulama **Ayarlar** panelinde şu toggle'ları sağlar:

- [x] Diskalkuli modu (font + boşluk artırımı)
- [x] Yüksek kontrast
- [x] Renk körü modu (SVG pattern + palet değişimi)
- [x] Ses (TTS)
- [x] Ses efektleri
- [x] Animasyonları azalt (prefers-reduced-motion saygılı)

### 4.5 Klavye Kısayolları (Ortak)
Platform genelinde tutarlı:

| Kısayol | Eylem |
|---------|-------|
| `Ctrl+Z` | Geri al |
| `Ctrl+Y` / `Ctrl+Shift+Z` | İleri al |
| `Del` / `Backspace` | Seçili ögeyi sil |
| `S` | Seçili ögeyi sesli oku |
| `+` / `-` | Zoom |
| `?` | Yardım paneli |
| `Esc` | Modal kapat |

Uygulamaya özel kısayollar konu açısından özelleştirilebilir (ör. Basamak: G=grupla, B=böl).

---

## 5. İÇERİK STANDARTLARI

### 5.1 Etkinlik Şeması
Her uygulamada `constants/activities.js`:

```javascript
export const ACTIVITIES = [
  {
    id: 'explore',                       // kebab-case
    name: 'Serbest Keşif',               // görünen ad (i18n key olabilir)
    icon: '🎨',                          // emoji veya SVG ref
    category: 'kesif',                   // kesif | kavram | islem | yanilgi | senaryo
    difficulty: 1,                       // 1-5 scaffolding
    description: 'Kısa açıklama',
    curriculum: 'M.1.1.4.1',             // MEB müfredat kodu (opsiyonel)
    vhLevel: 0,                          // Van Hiele — sadece Geo'da
    curcioLevel: 0,                      // Curcio — sadece Veri'de
    bloomLevel: 1,                       // Bloom — Basamak/Tam'da
    setup: { /* uygulamaya özel */ },
    checkSuccess: (state) => boolean,    // tamamlanma koşulu
  },
  // ...
];
```

### 5.2 i18n Anahtar Kalıbı
Flat, dot notation yok. Kısa anahtarlar:

```javascript
// tr.js
export default {
  app_title: 'DokunSay Kesirler',
  menu_activities: 'Etkinlikler',
  menu_games: 'Oyunlar',
  feedback_correct: 'Harika!',
  feedback_tryAgain: 'Tekrar deneyelim',
  // ...
};
```

### 5.3 İçerik Dili Kuralları
- **Hitap:** Öğrenciye "sen" (samimi, Türkiye okul kültürü)
- **Olumlu:** "başaramadın" yerine "bir kez daha dene"
- **Kısa cümle:** 10 kelimeyi geçmemeli
- **Matematiksel terim:** İlk kullanımda tanım (hover/tooltip)
- **Emoji:** Evet (ama minimal — her bildirimde değil)

---

## 6. VERİ VE GİZLİLİK STANDARTLARI

### 6.1 Yerel Depolama
- **Anahtar kalıbı:** `dokunsay:<modul>:<konu>` (örn. `dokunsay:bar:progress`)
- **Şifreleme:** Gerekli değil (hassas veri yok)
- **Süre:** Sınırsız (kullanıcı silebilir)
- **KVKK:** Hiçbir kişisel veri sunucuya gitmez (opsiyonel Firebase hariç)

### 6.2 Öğrenci Verisi
Ad/yaş opsiyonel, localStorage'da kalır. Firebase kullanan DokunSayBar bunun dışında — kullanıcı onayı ister.

### 6.3 Gizlilik Politikası
Her uygulama `public/privacy-policy.html` içerir (tr + en).

---

## 7. DOKÜMANTASYON STANDARTLARI

### 7.1 README.md (Zorunlu)
Her uygulamanın README'si şu bölümleri içerir:

1. **Ad + Slogan** (bir cümle)
2. **Pedagojik Yaklaşım** (ne öğretir, hangi çerçeveye dayanır)
3. **Hedef Kitle** (yaş, seviye, özel ihtiyaçlar)
4. **Özellikler** (madde madde)
5. **Kurulum** (`npm install`)
6. **Geliştirme** (`npm run dev`)
7. **Dağıtım** (`npm run build`, `npm run deploy`)
8. **Mimari Özet** (src/ yapısı)
9. **Lisans + Yazar**

### 7.2 LICENSE
MIT (platform genelinde).

### 7.3 Kod İçi Yorumlar
- **Varsayılan:** Yazma.
- **Yaz:** Sadece "Neden" açıklamak gerektiğinde (örn. "bu sıra önemli çünkü ...").
- **Açıklayıcı değişken adları yaz** (ör. `SNAP_DISTANCE_PX = 16` > `// snap distance`).

### 7.4 CHANGELOG.md (Önerilir)
Semver takip et: `MAJOR.MINOR.PATCH`. Büyük sürümlerde yaz.

---

## 8. YAZAR ATFI

Tüm uygulamalarda ortak:

- **Yazar:** Prof. Dr. Yılmaz Mutlu
- **Kurum:** Jimaro / Diskalkuli Platformu
- **Yıl:** 2024-2026

Kod içi `package.json` → `"author": "Prof. Dr. Yılmaz Mutlu"`.
Footer veya About modal'da görünür.

---

## 9. PLATFORM KURALLARI

### 9.1 Launcher (DokunSay Platform)
`_platform/launcher/` → kullanıcıların tüm araçlara erişebildiği ana menü. Her araç için:
- Simge, isim, kısa açıklama
- Hedef yaş/seviye
- "Aç" butonu (ayrı uygulamaya gezinir)

### 9.2 Ortak Kaynaklar (`_platform/shared/`)
Her uygulama kopyalayabilir veya referans edebilir:
- `palette.js` (renk tokenları)
- `typography.css` (Nunito yükleme)
- `animations.css` (ortak keyframe'ler)
- `tts.js` (Web Speech wrapper)
- `audio.js` (Web Audio tonlar)
- `storage.js` (localStorage yardımcıları)
- `i18n-base.js` (ortak anahtarlar: menü, geri bildirim)
- `eslint.config.js`, `.prettierrc.json`, `.editorconfig`

### 9.3 Sürüm Yönetimi
Her uygulama kendi semver'ini tutar. Platform genelinde büyük değişiklik için `STANDARDS.md` güncellenir ve uygulamalar sırayla uyum sağlar (hızlı yap-dur yaklaşımı yok).

---

## 10. DEĞİŞİKLİK YÖNETİMİ

Bu belgede değişiklik:
1. Öneri `_platform/docs/proposals/` altına RFC yazılır.
2. 7 uygulamanın sahibi okur.
3. Kabul edilirse `STANDARDS.md` güncellenir, version artırılır.
4. 30 gün geçiş dönemi — yeni uygulamalar güncel standarda uyar; eskiler yavaşça uyumlanır.

---

**Son:** Bu standartlar canlı bir belgedir. Her uygulama "zarar vermeden iyileştirme" felsefesiyle bu standartlara yaklaştırılmalıdır — kırılgan değişiklik yasak.
