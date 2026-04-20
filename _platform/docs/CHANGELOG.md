# DokunSay Platform — Değişiklik Kaydı

## [1.2.0] — 2026-04-20 — Bar Pilot: shared/ Entegrasyonu

### Faz 1: Servis Köprüleri
- `DokunSayBar/vite.config.ts`: `@shared` alias + `server.fs.allow` (sibling klasör erişimi)
- `DokunSayBar/tsconfig.json`: `allowJs: true` + `paths: { "@shared/*": ["../_platform/shared/*"] }`
- `DokunSayBar/index.html`: Google Fonts Nunito preconnect + link
- `shared/audio.js`: `sfx.rotate` eklendi, `sfx.note` alias'ı açıldı (Bar API uyumu)
- `shared/tts.js`: dil haritasına `ar`, `fa` eklendi
- Yeni tip bildirimleri: `shared/audio.d.ts`, `tts.d.ts`, `palette.d.ts`, `a11y.d.ts`
- `DokunSayBar/src/services/audioService.ts` → `@shared/audio.js` wrapper
- `DokunSayBar/src/services/speechService.ts` → `@shared/tts.js` wrapper
- `DokunSayBar/src/constants/colors.ts` → `COLORS` from `@shared/palette.js` köprüsü

### Faz 2: Kurmancî FerMat Mini Hizalama
- `DokunSayBar/src/services/i18nService.ts`: `işlem: "Hesab"` → `"Kirarî"` + üst not
- Bar'ın 100+ anahtarı zaten zengin; platform i18n-base'i yerine Bar dictionary kalıyor (üstün küme)

### Faz 3: A11y Context
- `DokunSayBar/src/state/A11yContext.tsx` (yeni): `A11yProvider`, `useA11y()` hook
- `@shared/a11y.js` ile tam entegre: `loadA11yPrefs`, `applyA11yAttributes`, `installKeyboardShortcuts`, `announce`
- `prefs.sfx` değişince `setAudioEnabled`, `prefs.tts` → `setTTSEnabled` otomatik senkronize
- `main.tsx` artık `<A11yProvider>` ile en dışta sarılı

### Faz 4: Göç Rehberi
- `_platform/docs/TEMPLATE.md` — Bar'ı referans alan adım adım göç rehberi

### Doğrulama
- ✅ `npm run build` başarılı (187 kB index + Firebase/Three chunks)
- ✅ TypeScript strict mode korundu
- ✅ Hiçbir mevcut davranış değiştirilmedi

### Sonraki Adım
6 uygulama TEMPLATE.md'ye göre göç edilmeli.

## [1.0.0] — 2026-04-20

### İlk Platform Sürümü

Bu, DokunSay ailesinin **Platform** olarak ilk resmi sürümüdür. Öncesinde 7 uygulama bağımsız olarak gelişmişti; bu sürümle birlikte ortak standartlar, paylaşılan kaynaklar ve ana menü uygulaması (launcher) eklendi.

#### Eklenenler

**Platform çatısı:**
- `_platform/STANDARDS.md` — kapsamlı standartlar belgesi (10 bölüm, 500+ satır)
  - Pedagojik standartlar (CRA, çerçeveler, diskalkuli, scaffolding, i18n, öğretmen)
  - Teknik standartlar (React 18/Vite 6, paket adı, Capacitor appId, klasör yapısı)
  - Tasarım standartlar (renk paleti, Nunito tipografi, ikonografi, animasyon)
  - Erişilebilirlik standartlar (WCAG 2.1 AA, ARIA, klavye, TTS)
  - İçerik standartlar (etkinlik şeması, i18n anahtarı, dil kuralları)
  - Veri/gizlilik, dokümantasyon ve değişiklik yönetimi

- `_platform/shared/` — ortak kaynaklar
  - `palette.js` (COLORS, GRADIENTS, SHADOWS, RADII, SPACING, TOUCH tokenleri)
  - `typography.css` (Nunito + CSS değişkenleri + diskalkuli/disleksi modları)
  - `animations.css` (11 pedagojik keyframe + reduced-motion desteği)
  - `tts.js` (Web Speech API wrapper, 3 dil)
  - `audio.js` (Web Audio tonlar + sfx: correct/wrong/group/break/count)
  - `storage.js` (localStorage namespace: `dokunsay:<modul>:<konu>`)
  - `i18n-base.js` (3 dil ortak anahtarlar: menu/btn/feedback/a11y/diff/cat)
  - `eslint.config.js` (ESLint 9 flat config)
  - `.prettierrc.json`, `.editorconfig`
  - `LICENSE` (MIT)
  - `README.template.md`, `PRIVACY.template.md`

- `_platform/launcher/` — Ana menü uygulaması (React + Vite)
  - 7 aracı renkli kartlarla listeleyen grid
  - Arama, kategori filtresi (Sayı & İşlem / Ölçme / Geometri / Veri)
  - 3 dilli (tr, ku, en) + LocalStorage tercih kaydı
  - Diskalkuli modu + yüksek kontrast modu
  - Dev ortamda `devUrl` → prod'da `prodPath` ile araç açma
  - WCAG AA uyumlu, klavye erişilebilir

- `_platform/docs/` — platform dokümantasyonu

**Her uygulama için eklenen:**
- `README.md` (pedagojik yaklaşım, özellikler, kurulum, mimari) — Bar, Basamak, Clock, Kesir, Tam için yeni. Geo ve Veri'nin mevcut README'leri korundu.
- `LICENSE` (MIT) — hepsine eklendi (Geo hariç, zaten vardı)
- `PRIVACY.md` — hepsine eklendi (uygulama-spesifik, Firebase/Capacitor/Web Speech gibi üçüncü taraflar belgelendi)
- `eslint.config.js` (ESLint 9 flat config) — tümüne eklendi
- `.editorconfig` — tümüne eklendi

**Ek paylaşılan modüller:**
- `shared/a11y.js` — erişilebilirlik tercih yönetimi, klavye kısayolu kurucusu, ARIA announce
- `shared/activity-schema.js` — etkinlik veri şeması, kategori/zorluk sabitleri, validasyon

**Kök seviye:**
- `.gitignore` (monorepo-bilinçli)
- `.vscode/settings.json` (ortak editör ayarları)
- `.vscode/extensions.json` (önerilen eklentiler)
- `.vscode/DokunSay.code-workspace` (multi-root workspace — tüm uygulamalar tek pencerede)

**package.json standardizasyonu:**
- Tüm paket adları `dokunsay-<modul>` kalıbına hizalandı:
  - `dokun-say-bar` → `dokunsay-bar`
  - `dokun-say-basamak` → `dokunsay-basamak`
  - `dokun-say-clock` → `dokunsay-clock`
  - `dokun-say-fraction` → `dokunsay-kesir`
  - `dokun-say-exact` → `dokunsay-tam`
  - `dokunsay-geo` ✓ (zaten standart)
  - `dokunsay-veri` ✓ (zaten standart)
- Tümüne `author`, `license`, `description` metadata'sı eklendi

**Platform kök:**
- `README.md` — platform giriş sayfası
- `LICENSE` — MIT

#### Korundu (mevcut yapıya zarar verilmedi)

- Hiçbir `src/` kaynağı değiştirilmedi
- Hiçbir bağımlılık eklenmedi/silinmedi
- Tüm uygulamaların davranışı aynı
- Build ve dev scriptleri değişmedi (sadece yeni `lint` scripti eklemek için ESLint kurulumu gerekecek — kullanıcı tercihen ekler)
- Mevcut README'ler (Geo, Veri) korundu

#### Bilinen Farklar (standardizasyon henüz tamamlanmadı)

- **DokunSayTam** React 19.2.4 ve Vite 8.0.4 kullanıyor (platform standardı 18.3.1 / 6.0.0)
  - Karar: kullanıcı onayıyla ileride indirilebilir; şimdilik koruma gerekçesi "zarar verme" ilkesi
- **Dokunsay-geo** Vite 5.4.11
- **Dokunsay-veri-app** Vite 5.4.10
- Bazı uygulamalarda i18n eksik (Clock, Tam) — sonraki sürümde eklenecek
- Hiçbir uygulamada otomatik test yok
- Mobil build sadece Bar ve Kesir'de (Capacitor)

### Doğrulama

- ✅ Launcher `npm install` başarılı (66 paket, 0 güvenlik açığı)
- ✅ Launcher `npm run build` başarılı (157.93 kB JS, 51.58 kB gzip, 765ms)
- ✅ Tüm 7 uygulamanın mevcut `src/` kodu değiştirilmedi

## [1.1.0] — 2026-04-20 — FerMat Kurmancî Entegrasyonu

### Değişenler

**Yeni: Kanonik Kurmancî matematik terminolojisi**
- `_platform/shared/fermat-terms.ku.js` — FerMat sözlüğüne dayalı 190+ terim
  - 10 kategori: Hejmar, Kirarî, Cureyên Hejmaran, Parjimar, Geometrî, Pîvandin, Aljebir, Amarî, Hizirkirin, Peyv
  - Her terim için `{ ku, tr, en, note? }` yapısı
  - Yardımcı: `term()`, `ku()`, `tr()`, `en()`, `byCategory()`
- `_platform/shared/FERMAT.ku.md` — geliştirici referansı (terim tabloları, uyum notları)

**Kaynak entegrasyonu:**
- **Birincil:** FerMat Ferhenga Matematîkê (Prof. Dr. Yılmaz Mutlu, 394 terim)
- **İkincil (stil/gramer):** LUTKE Kurmancî öğretim uygulamasının Pirtûkên Kurdî kitapları ve `ku.json` çevirileri

**Terminoloji hizalamaları:**
- `Dokunsay-geo/src/constants/i18n.js` ku bloğu:
  - `Kêlek` → `Hêl` (kenar)
  - `Guç` → `Kujî` (açı)
  - `Nîvhevî` → `Hevseng` (simetri)
  - `Dorhêl` → `Rûdor` (çevre)
  - `Hindisî` → `Cîyometrî` (geometri)
  - `Guçpîv` → `Pîleyva` (iletki)
- `DokunSayClock/src/i18n/ku.js` — FerMat'e göre yenilendi (şanîdera, demjimêr, deqe vb.)
- `DokunSayTam/src/i18n/ku.js` — FerMat'e göre yenilendi (erênî, neyînî, cotê sifir, kirarî)
- `_platform/shared/i18n-base.js` — BASE_KU'ya FerMat işlem ve geometri terimleri eklendi
- `_platform/launcher/src/tools.js`:
  - Kesir: `Parçe` → `Parjimar` (isim, alt başlık, topics)
  - Bar: `Kom/Derxistin` → `Zêdekirin/Kemkirin`
  - Basamak: `Parvekirin` → `Veqetandin`; ismi `Pêşek` → `Nirxane`
  - Tam: `Hejmara Negatîf` → `Hejmara Neyînî`; `Termometre` → `Pîvana Germahîyê`
  - Geo: `Form` → `Teşe`; subtitle `Geometrî` → `Cîyometrî`
  - Veri: `Xwendina Grafîk` → `Xwendina Nexşeyan`; `Navînî` → `Navgîn`
- `_platform/launcher/src/i18n.js` — Kurmancî metinleri cilalandı

**Korunanlar (zaten FerMat-uyumlu):**
- `DokunSayKesir/src/i18n/ku.js` — `parjimar`, `par`, `tevpar`, `zêdekirin`, `kemkirin`, `carkirin`, `parkirin` ✓
- `DokunSayBasamak/src/i18n/ku.js` — `yekan/dehane/sedane/hezarane`, `kom bike`, `veqetîne` ✓
- `DokunSayBar/src/services/i18nService.ts` — temel ku zaten var
- `Dokunsay-veri-app/src/data/constants.js` — `dane`, `navend`, `îhtîmal` ✓

### Doğrulama

- ✅ 17/17 Vitest testi geçti (390ms)
- ✅ Launcher build başarılı (161.98 kB JS)
- ✅ verify.js: 7/7 uygulama uyumlu

## [Unreleased] — Sonraki Öncelikler

- [ ] Vite sürümlerini 6.0.0'a hizalama (Geo, Veri, Tam)
- [ ] React 19 → 18 hizalama (Tam, yalnızca kullanıcı onayıyla)
- [ ] Clock ve Tam'a i18n eklemesi (paylaşılan `i18n-base.js`)
- [ ] Vitest kurulumu + temel testler (tüm uygulamalar)
- [ ] Prettier çalıştırılması (mevcut koda dokunmadan sadece gelecek için)
- [ ] Capacitor kurulumu Basamak, Clock, Tam, Geo, Veri'ye (opsiyonel)
- [ ] Karanlık mod desteği (platform-çapı)
- [ ] Launcher'dan her araca derin link (her araçta belirli etkinliğe gitme)
- [ ] Mevcut etkinlik listelerini `activity-schema.js` validasyonundan geçirme
