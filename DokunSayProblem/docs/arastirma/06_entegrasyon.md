# 06 — DokunSayProblem: Eksiksiz Entegrasyon Şartnamesi

> Depo: `C:\Users\yilma\Desktop\Diskalkuli\dokunsay` · Durum: SALT OKUMA incelemesi (2026-09-27, HEAD `ffa7cb2`).
> Yeni araç: **DokunSay Problem** — klasör `DokunSayProblem/`, katalog id `problem`, yayın `https://dokunsay.com/DokunSayProblem/`.
> Bu belge uygulanabilir kontrol listesidir. Her madde gerçek dosya:satır'a dayanır; kod parçaları depodan alınmıştır.

**Kısa karar özeti**

| Karar | Seçim | Gerekçe (ayrıntı §1) |
|---|---|---|
| Kalıp | **Vite 6 + React 18.3 + TypeScript ~5.6** (DokunSayBar derleme hattı) + ZihindenAritmetik'in *yapısal* kalıpları (TS A11yProvider, `useSharedLang`, AppShell sarmalı) | STANDARDS §2.1 sürüm kilidi ve `verify.js` denetimi Vite 6 / React `^18.3.1` bekliyor; Zihinden'in Vite 8/React 19'u `dedupe` zorunluluğu ve uyarı getiriyor |
| Dil | TypeScript (strict) | §2.2 "yeni büyük modüller için önerilir"; şema modelleri, yanılgı sınıflandırması ve öğretmen verisi tip güvenliği ister |
| id / paket | `problem` / `dokunsay-problem` | `tools.test.js:30` → `/^[a-z]+$/`; `verify.js:77` → `dokunsay-${id}` |
| Port | **3009** | 3000 launcher, 3001–3008 dolu (`tools.js:45…311`) |
| base | `process.env.BASE_PATH \|\| '/DokunSayProblem/'` | Kesir/Bar kalıbı; `build-site.js:62,74` BASE_PATH'i klasörden üretir |
| Yönlendirme | Router YOK; `AppTabs` sekmeleri + küçük `location.hash` eşlemesi | §2.7 minimum bağımlılık; yörünge rozetlerinden derin bağlantı için hash yeterli |
| PWA | **Yok** (ilk sürümde) | Zihinden dersi: SW üretimde boş sayfa açtı, hâlâ `selfDestroying` |
| Kapı modu | **gate** (içerik girişli) | `inject-gate.mjs:29` LANDING yalnız launcher + Zihinden; ekleme YAPMA |
| Kategori | `number` (Sayı & İşlem) | Tek araçlı yeni kategori 5 dil etiketi + test yükü getirir |

---

## 1. DOSYA İSKELETİ

### 1.1 Hangi kalıp? — ZihindenAritmetik mi, Vite 6 JSX mi?

İki aday incelendi:

| Ölçüt | ZihindenAritmetik (en yeni) | Vite 6 kalıbı (Kesir/Geo/Bar) |
|---|---|---|
| Sürümler | React 19.2, Vite 8.2, TS 6.0, `@vitejs/plugin-react` 6 (`ZihindenAritmetik/package.json`) | React 18.3.1, Vite 6, plugin-react 4.3.4 (`DokunSayKesir/package.json`) |
| STANDARDS §2.1 | **İhlal** (React/Vite kilidi dışında) | Uyumlu |
| `verify.js` | Listede değil (hiç denetlenmiyor!); eklenirse React/Vite **uyarısı** (`verify.js:87-91`) | Temiz geçer |
| Paylaşılan kabuk | `resolve.dedupe: ['react','react-dom']` **zorunlu** (`vite.config.ts` yorumu: "Vite 8'in çözümleyicisi katıdır") | Gerekmez |
| Paket adı | `"uygulama"` (§2.3 ihlali) | `dokunsay-kesir` ✓ |
| A11y | TS `A11yProvider` + `A11yPanel lang={dil}` (dil canlı) ✓ | Kesir'de `A11yPanel lang="tr"` sabit (hata) |
| Dil paylaşımı | `useSharedLang()` (`dk_lang`) ✓ | Kesir kendi `useState("tr")` — araçlar arası dil taşınmıyor |
| i18n içeriği | `ku: {}`, `en: {}` **boş** (`src/i18n/index.ts:30-34`) — §1.7.1 ihlali | Kesir 5 dosya dolu (index-tabanlı anahtar kırılgan) |
| Depolama | `za.*` önekli (`src/lib/store.ts:10`) — §6.1 ihlali | `saveState('kesir',…)` ✓ |
| Bağımlılık | `react-router-dom`, `vite-plugin-pwa` | Yalnız react/react-dom |

**Karar:** Derleme hattı ve sürümler için **DokunSayBar'ın Vite 6 + TS hattı** (`DokunSayBar/package.json`, `tsconfig.json`, `vite.config.ts`); uygulama *içi* düzen için **Zihinden'in doğru yaptıkları** (TS A11yProvider, `useSharedLang`, `LangSwitcher langs`, AppShell kökü). Zihinden'in yanlışları (boş ku/en, `za.` öneki, router+PWA, paket adı) **kopyalanmaz**.

> Not: STANDARDS §2.2 "yeni uygulamalar JS ile başlasın" der, ama §2.1 ayrıca "DokunSayBar TypeScript kullandığı için `typescript: ~5.6.2`" istisnası tanır ve §2.2 TS'i "yeni büyük modüller için" önerir. Problem aracı (şema tipleri, adım durum makinesi, yanılgı kodları, öğretmen raporu) bu tanıma girer. JS tercih edilirse aşağıdaki iskelet `.jsx` ile birebir çalışır; yalnız `tsconfig*` ve `tsc -b` düşer.

### 1.2 Dosya ağacı (hedef)

```
DokunSayProblem/
├── package.json                 # name: dokunsay-problem (§1.3)
├── package-lock.json            # CI `npm ci` için ŞART (yoksa fallback npm install — yavaş/deterministik değil)
├── vite.config.ts               # §1.4
├── tsconfig.json                # §1.5 (Bar kalıbı: allowJs + @shared paths + shared .d.ts include)
├── index.html                   # §1.6 (Nunito + theme-color + #root)
├── eslint.config.js             # _platform/shared/eslint.config.js'ten kopya (verify.js ZORUNLU dosya)
├── .editorconfig                # _platform/shared/.editorconfig kopyası (verify.js ZORUNLU)
├── .gitignore                   # node_modules, dist
├── README.md                    # _platform/shared/README.template.md doldurulur (verify.js ZORUNLU)
├── LICENSE                      # MIT (_platform/shared/LICENSE) (verify.js ZORUNLU)
├── PRIVACY.md                   # _platform/shared/PRIVACY.template.md doldurulur (verify.js ZORUNLU)
├── public/
│   └── favicon.svg              # platform deseni: yuvarlatılmış kare + accent gradyan (appIcon.js ile aynı biçim)
└── src/
    ├── main.tsx                 # AppShell + LangSwitcher + A11yProvider (§2.1)
    ├── App.tsx                  # orkestratör; >600 satırda böl (§2.5)
    ├── state/
    │   ├── A11yContext.tsx      # Zihinden'in dosyası birebir (dil prop'lu)
    │   └── problemReducer.ts    # useReducer (§2.6 "karmaşık" düzey)
    ├── i18n/
    │   ├── index.ts             # t(), DILLER, useT — ku/en DOLU olmak ZORUNDA
    │   ├── tr.ts  ku.ts  en.ts  # arayüz + i18n-base BASE_* birleşimi
    ├── constants/
    │   ├── activities.ts        # §4 şemasına uyan etkinlik verisi (içerik 3 dilde gömülü)
    │   ├── schemas.ts           # şema tipleri (birleştirme/ayırma/karşılaştırma/eşit grup…) + renk/ikon
    │   └── misconceptions.ts    # yanılgı kataloğu (id + atıf + 3 dil)
    ├── components/
    │   ├── canvas/              # bar model / parça-bütün şeridi / sayı doğrusu (SVG)
    │   ├── layout/              # ProblemPanel, StepRail
    │   ├── modals/              # TeacherPanel, HelpModal
    │   └── common/              # DiffBadge (Geo'dan port), SchemaChip
    ├── hooks/                   # useProblemSession, useHashTab
    ├── lib/
    │   ├── storage.ts           # @shared/storage.js ince sarmalı, modul='problem'
    │   └── speech.ts            # @shared/tts.js sarmalı (yerel Utterance YASAK)
    └── styles.css               # @shared tokenlarına dayalı sınıflar
```

### 1.3 `package.json`

```json
{
  "name": "dokunsay-problem",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "description": "DokunSay Problem — şema temelli sözel problem çözme (bar model, parça-bütün, karşılaştırma).",
  "author": "Prof. Dr. Yılmaz Mutlu",
  "license": "MIT",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "lint": "eslint .",
    "test": "vitest run"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@types/react": "^18.3.12",
    "@types/react-dom": "^18.3.1",
    "@vitejs/plugin-react": "^4.3.4",
    "typescript": "~5.6.2",
    "vite": "^6.0.0",
    "vitest": "^2.1.8"
  }
}
```

- [ ] `react` değeri **tam olarak** `"^18.3.1"` (verify.js:87 string eşitliği yapar; `^18.3.2` uyarı üretir).
- [ ] `vite` `^6.` ile başlamalı (verify.js:90).
- [ ] `author`, `license`, `description` dolu (verify.js:81-83).
- [ ] `package-lock.json` commit'lenir (iki CI iş akışı `npm ci` dener).

### 1.4 `vite.config.ts`

Kesir (`DokunSayKesir/vite.config.js`) + Zihinden yorum disiplini birleşimi:

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  // build-site.js BASE_PATH'i `${SITE_BASE}DokunSayProblem/` olarak verir (build-site.js:62,74).
  // Tek başına derlemede de doğru alt yol kalsın diye varsayılan klasör adıdır.
  base: process.env.BASE_PATH || '/DokunSayProblem/',
  resolve: {
    alias: { '@shared': path.resolve(__dirname, '../_platform/shared') },
  },
  server: {
    port: 3009,
    strictPort: true,
    host: true,
    fs: { allow: [path.resolve(__dirname, '..')] }, // @shared klasörü proje dışında
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild',
    rollupOptions: { output: { manualChunks: { react: ['react', 'react-dom'] } } },
  },
});
```

- [ ] `strictPort: true` — port doluysa sessizce 3010'a kaymasın (launcher `devUrl` sabit).
- [ ] `fs.allow` üst klasörü içermeli; yoksa dev'de `@shared` 403 verir (TEMPLATE.md §1).
- [ ] Vite 6'da `dedupe` GEREKMEZ; Vite 8'e geçilirse `resolve.dedupe: ['react','react-dom']` EKLENMEK ZORUNDA (Zihinden `vite.config.ts` yorumu: ortak dosyaların yanında `node_modules` yok, react iki kopya çözülür → "Invalid hook call").

### 1.5 `tsconfig.json` (Bar kalıbı — tek dosya, strict)

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "allowJs": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "allowImportingTsExtensions": true,
    "noEmit": true,
    "skipLibCheck": true,
    "noFallthroughCasesInSwitch": true,
    "forceConsistentCasingInFileNames": true,
    "baseUrl": ".",
    "paths": { "@shared/*": ["../_platform/shared/*"] }
  },
  "include": ["src", "../_platform/shared/**/*.d.ts"]
}
```

- [ ] **`.d.ts` eksikleri:** `_platform/shared`'da tip bildirimi OLANLAR: `A11yPanel, AppShell, AppTabs, AppToolbar, LangSwitcher, SpeakButton, a11y, audio, palette, tts, useAuthSlot, useSharedLang`. OLMAYANLAR: **`storage.js`, `i18n-base.js`, `activity-schema.js`, `fermat-terms.ku.js`, `appIcon.js`, `AppFooter.jsx`, `HcmoMark.jsx`**. `strict` altında bunları import etmek TS7016 verir → ya `src/shared-shims.d.ts` içinde `declare module '@shared/storage.js' { … }` yaz, ya da (tercih) `_platform/shared/storage.d.ts` vb. ekle (diğer araçlara da yarar).
- [ ] `palette.d.ts` `AppId` birleşimine `"problem"` eklenmezse `<AppShell appId="problem">` tip hatası verir (§3.5).

### 1.6 `index.html`

```html
<!doctype html>
<html lang="tr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
    <title>DokunSay Problem</title>
    <meta name="description" content="Şema temelli sözel problem çözme aracı — bar model, parça-bütün, karşılaştırma. Diskalkuli duyarlı, üç dilli." />
    <meta name="theme-color" content="#4f46e5" /> <!-- APP_ACCENTS.problem.color ile aynı (§5.1) -->
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@600;700;800;900&display=swap" rel="stylesheet" />
  </head>
  <body style="margin:0">
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] `</head>` etiketi korunmalı — `inject-gate.mjs:64` kapı betiğini `</head>` önüne ekler (yoksa `<body>` sonrasına düşer, kapı geç çalışır).
- [ ] `user-scalable=no` KOYMA (Kesir koymuş; WCAG 1.4.4 yakınlaştırmayı engeller).
- [ ] Vite `/favicon.svg` gibi public yollarını `base` ile yeniden yazar; elle `/DokunSayProblem/…` yazma.

### 1.7 Yönlendirme: HashRouter mı?

- Zihinden `HashRouter` (react-router-dom 7) kullanıyor çünkü 20+ ekranı var ve "sunucuda yeniden yazma kuralı gerekmez".
- `dist-site` statik; `/DokunSayProblem/x` gibi derin yol Cloudflare'da **kök `404.html` = launcher**'a düşer (`build-site.js:98-103`, `inject-gate.mjs:72-73`). Yani path-tabanlı router ÇALIŞMAZ.
- Problem aracı için öneri: **router bağımlılığı yok**; `AppTabs` sekmeleri (`materials | activities | games | teacher | settings`, `AppTabs.jsx:28`) + `useHashTab` kancası:

```ts
// src/hooks/useHashTab.ts — #etkinlik=degisim-3 / #sema=karsilastirma derin bağlantıları
export function readHash(): Record<string, string> {
  return Object.fromEntries(new URLSearchParams(location.hash.replace(/^#\/?/, '')));
}
export function writeHash(p: Record<string, string>) {
  history.replaceState(null, '', '#' + new URLSearchParams(p).toString());
}
```

- [ ] Kapı (`numap-gate.js:38,37`) `sso_return=location.href` ile hash'i korur ve bilet sökümünde `u.hash`'i geri yazar → yörüngeden gelen `#sema=…` girişten sonra kaybolmaz.

### 1.8 PWA — `selfDestroying` dersi

`ZihindenAritmetik/vite.config.ts` özeti: ilk dağıtımda eksik ön-bellekle kayıtlı kalan servis çalışanı, ikinci dağıtımda eski varlıklar silinince **sayfayı boş açtı**; çözüm `selfDestroying: true` + `injectRegister: false` (enjekte edilirse kendini kaldıran çalışan her açılışta yeniden kaydolur → yenileme döngüsü). Gömülü önizleme SW kaydına izin vermediği için orada doğrulanamıyor.

- [ ] İlk sürümde `vite-plugin-pwa` EKLEME.
- [ ] İleride eklenirse: kapsam `/DokunSayProblem/` ile sınırlı olmalı (kök kapsamı launcher ve diğer araçları ele geçirir), gerçek tarayıcıda iki ardışık dağıtım testi yapılmalı, `numap-gate.js` gibi kök betikler önbellek dışında tutulmalı (kapı güncellemesi SW yüzünden eski kalır).

---

## 2. ORTAK KABUK KULLANIMI

### 2.1 `main.tsx` — kök (Zihinden `src/main.tsx` uyarlaması)

Zihinden'in gerçek kökü (kısaltılmış):

```tsx
function Kok() {
  const [paylasilanDil, setPaylasilanDil] = useSharedLang();
  const dil = gecerliDil(paylasilanDil);
  useEffect(() => { dilYaz(dil); }, [dil]);
  return (
    <AppShell appId="zihinden" title="Zihinden Aritmetik" subtitle="Kitabın uygulama cildi" icon="📘"
      backLang={dil}
      /* Kimlik yuvası AppShell'in kendisinde; burada yalnızca dil anahtarı. */
      tools={<LangSwitcher lang={dil} setLang={setPaylasilanDil} langs={DIL_KODLARI} />}>
      <A11yProvider dil={dil}><App dil={dil} /></A11yProvider>
    </AppShell>
  );
}
```

DokunSayProblem için hedef:

```tsx
import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { AppShell } from '@shared/AppShell.jsx';
import { LangSwitcher, VISIBLE_LANGS, normalizeLang } from '@shared/LangSwitcher.jsx';
import { useSharedLang } from '@shared/useSharedLang.js';
import { setAppFavicon } from '@shared/appIcon.js';        // .d.ts yok → shim (§1.5)
import { A11yProvider } from './state/A11yContext';
import { useT, type DilKodu } from './i18n';
import App from './App';
import './styles.css';

function Kok() {
  const [ham, setDil] = useSharedLang();                    // 'dk_lang' — araçlar arası ortak
  const dil = normalizeLang(ham) as DilKodu;                // gizli AR/FA kayıtlıysa 'tr'ye çek
  const t = useT(dil);
  useEffect(() => { setAppFavicon('problem'); }, []);
  return (
    <AppShell appId="problem" title={t('app_title')} subtitle={t('app_subtitle')} icon="🧩"
      backLang={dil}
      tools={<LangSwitcher lang={dil} setLang={setDil} langs={VISIBLE_LANGS} />}>
      <A11yProvider dil={dil}><App dil={dil} /></A11yProvider>
    </AppShell>
  );
}
createRoot(document.getElementById('root')!).render(<StrictMode><Kok /></StrictMode>);
```

- [ ] `title/subtitle` çevrilir (Zihinden sabit Türkçe bırakmış — Kurmancî kullanıcı başlığı Türkçe görüyor).
- [ ] `tools` içine **kimlik yuvası koyma** — AppShell zaten `<span id="numapAuth" className="numap-yuvasi" />` basıyor (`AppShell.jsx:113`) ve `useAuthSlot()` çağırıyor (`AppShell.jsx:80`).
- [ ] `LangSwitcher` `<html lang>` ve `dir`'i kendisi ayarlar (`LangSwitcher.jsx:79-83`); ayrıca `document.documentElement.lang` yazma (Zihinden `dilYaz` ile çift yazıyor; zararsız ama gereksiz).

### 2.2 Bileşen props referansı (d.ts'lerden)

| Bileşen | Props (zorunlu **kalın**) | Not |
|---|---|---|
| `AppShell` (`AppShell.d.ts`) | **`appId: AppId`**, `title`, `subtitle`, `icon`, `topBar=true`, `showBack=true`, `backHref`, `backLang` ("tr"\|"ku"\|"en"\|"ar"\|"fa"), `tools`, `footer`, `background`, `children` | accent `APP_ACCENTS[appId]`'den CSS değişkenlerine (`--appshell-accent/-dark/-soft/-softer`) yazılır; bilinmeyen id **sessizce Bar altınına** düşer (`AppShell.jsx:75`). "Menüye Dön" dev'de `http://localhost:3000/`, prod'da `new URL('..')` (`AppShell.jsx:28-49`). |
| `AppTabs` (`AppTabs.d.ts`) | **`tabs: {id,label,icon?,badge?}[]`**, **`active`**, **`onChange`**, `variant: 'pills'\|'list'`, `compact`, `isDark`, `ariaLabel` | Kanonik sıra `TAB_ORDER = ['materials','activities','games','teacher','settings']`, ikonlar `TAB_ICONS` (📦📋🎮👩‍🏫⚙️), i18n anahtarı `TAB_I18N_KEY` → `menu_*` (i18n-base ile uyumlu). |
| `Toolbar/ToolGroup/ToolButton/IconButton/ToolSep/ToolSpacer` (`AppToolbar.d.ts`) | ToolButton: `icon,label,active,onClick,title`; IconButton: `icon,active,onClick,title,danger,disabled` | Önerilen dizilim (`AppToolbar.jsx:8-10`): [araç grubu] [bağlamsal] `<ToolSpacer/>` [görünüm] [geri/ileri] [zoom] [yardım]. IconButton `aria-label={title}` basar → `title` ZORUNLU say. |
| `A11yPanel` (`A11yPanel.d.ts`) | **`useA11y`**, `lang` ('tr'\|'ku'\|'en'), `position` (varsayılan `bottom-right`) | `lang` verilmezse `dk_lang` + `dk-lang-change` olayını dinler. A11yProvider içinde render edilir. `a11y-global.css`'i de yükler (44px kuralı). |
| `LangSwitcher` (`LangSwitcher.d.ts`) | **`lang`**, **`setLang`**, `langs` (varsayılan `['tr','ku','en']`), `labels` | AR/FA 2026-07-19'dan beri GİZLİ (`LangSwitcher.jsx:34`). `normalizeLang()` gizli dili güvenli varsayılana çeker. |
| `SpeakButton` (`SpeakButton.d.ts`) | **`text: string \| () => string`**, `lang`, `size=30`, `title`, `className`, `style`, `onSpoken` | `canSpeak(lang)` false ise **hiç çizilmez** (`SpeakButton.jsx:32`). Tıklama alanı daima ≥44px. |
| `AppFooter` (d.ts yok) | `lang` | HÇMÖ bağlantıları + telif; `AppShell footer={<AppFooter lang={dil}/>}`. İsteğe bağlı. |

### 2.3 Örnek kullanım (problem ekranı)

```tsx
import { AppTabs } from '@shared/AppTabs.jsx';
import { Toolbar, ToolGroup, ToolButton, IconButton, ToolSpacer } from '@shared/AppToolbar.jsx';
import { SpeakButton } from '@shared/SpeakButton.jsx';

<AppTabs
  tabs={[
    { id: 'activities', label: t('menu_activities') },
    { id: 'games',      label: t('menu_games') },
    { id: 'teacher',    label: t('menu_teacher') },
  ]}
  active={tab} onChange={(id) => { setTab(id); writeHash({ tab: id }); }} ariaLabel={t('tabs_aria')} />

<section className="problem-card" aria-live="polite">
  <p className="problem-text">{problemText}</p>
  <SpeakButton text={problemText} lang={dil} />      {/* ku'da gerçek ses yoksa kendiliğinden gizlenir */}
</section>

<Toolbar ariaLabel={t('toolbar_aria')}>
  <ToolGroup>
    <ToolButton icon="📊" label={t('tool_bar_model')} active={model === 'bar'} onClick={() => setModel('bar')} />
    <ToolButton icon="🧩" label={t('tool_part_whole')} active={model === 'pw'} onClick={() => setModel('pw')} />
  </ToolGroup>
  <ToolSpacer />
  <ToolGroup>
    <IconButton icon="↶" title={t('btn_undo')} onClick={undo} disabled={!canUndo} />
    <IconButton icon="❓" title={t('menu_help')} onClick={openHelp} />
  </ToolGroup>
</Toolbar>
```

### 2.4 Seslendirme — `@shared/tts.js` TEK YOL

API (`tts.js`, `tts.d.ts`):

| İşlev | İmza | Davranış |
|---|---|---|
| `speak` | `(text, lang='tr', opts?={rate,pitch,volume})` | `enabled` değilse, destek yoksa, metin boşsa veya `canSpeak(lang)` false ise **sessiz döner**; önce `cancel()`; metni `toSpeech()`'ten geçirir; varsayılan rate **0.85**, pitch **1.1**; sesi açıkça seçer (`voicesByPrefix`). |
| `canSpeak` | `(lang='tr') → boolean` | `ku` için yalnız gerçek `ku`/`kmr` sesi kuruluysa true. |
| `toSpeech` | `(text, lang='tr') → string` | Emoji siler; tr/en'de `a/b` → "dörtte bir"/"one quarter" (1/2 → "yarım"), `= ?` → "eşittir kaç", `× ÷ + − = < > ° %` → sözcük; `– — →` → duraklama ", ". |
| `setTTSEnabled` / `isTTSEnabled` | | A11yProvider `prefs.tts` ile senkron tutar. |
| `cancel`, `isSupported`, `getVoices` | | |

- [ ] **Hiçbir yerde `new SpeechSynthesisUtterance` yok** (STANDARDS §1.4.1). `src/lib/speech.ts` yalnız yeniden ihraç eder: `export { speak, cancel, canSpeak, toSpeech } from '@shared/tts.js';`
- [ ] 🔊 düğmeleri yalnız `SpeakButton` ile. Otomatik okuma (ör. yeni problem gelince) yapılacaksa `canSpeak(dil) && prefs.tts` kontrolü + kullanıcı jestinden sonra (tarayıcı otomatik oynatma kısıtı).
- [ ] **İçerik yazım kuralları (toSpeech ile uyum) — problem metinleri için KRİTİK:**
  - Eksi işareti **U+2212 `−`** olmalı; ASCII `-` `OPS` tablosunda yok → "7 - 3" motorda "7 3" okunur, çıkarma kaybolur.
  - En-tire `–` / em-tire `—` **asla işlem için kullanılmaz**: duraklamaya çevrilir ("6 – 4" → "6, 4").
  - Çarpma `×` (x veya * değil); bölme `÷`.
  - Bilinmeyen `?` yalnız `= ?` biçiminde "kaç" okunur; `? + 4 = 9` gibi başta bilinmeyen için okunuş metnini ayrı ver (`SpeakButton text={() => okunusMetni}`), ör. "kaç artı dört eşittir dokuz".
  - Tablo dışı kesirler (paydası 11, 13…) HAM kalır (`kesir()` null döner) — problemde kaçın ya da okunuşu elle yaz.
  - Yüzde Türkçe'de `%25` biçiminde yazılır ("yüzde 25" okunur); `25%` "25 yüzde" okunur.
  - Emoji konuşulmaz (silinir) — anlam taşıyan bilgiyi emojiye yükleme.
  - Birim test: `toSpeech(problem.text.tr, 'tr')` çıktısında işlem sözcüğü kaybolmamalı (tüm etkinlikler için döngü).

### 2.5 Kurmancî ses politikası

- Gerçek `ku`/`kmr` sesi yoksa **seslendirme yapılmaz ve 🔊 gizlenir** (STANDARDS §1.4.1; `tts.js` başlık notu, karar 2026-07-19; SayKent ile hizalı). Türkçe sesle Kurmancî okuma YASAK.
- Sözel problem aracında bu, Kurmancî'de **okuma desteğinin fiilen olmaması** demektir. Bu nedenle:
  - [ ] Kurmancî metinler kısa (≤10 sözcük/cümle, §5.3) ve görsel şema desteği güçlü olmalı (bar model metni tekrar etmeden taşır).
  - [ ] Kurmancî terimler **FerMat bağlayıcıdır** (`fermat-terms.ku.js`): problem=`pirsgirêk`, çözüm=`çareserî`, cevap=`bersiv`, tahmin=`texmîn`, kontrol=`kontrol`, kaç?=`çend?`, ne kadar?=`çiqas?`, toplam/hepsi=`bi giştî`, kalan=`dimîne`, ...den fazla=`ji... zêdetir`, ...den az=`ji... kêmtir`, her biri=`her yek`, birlikte=`bi hev re`; işlemler `zêdekirin/kemkirin/carkirin/parkirin`; sayı=`hejmar` (jimar DEĞİL), rakam=`jimare`, toplam(sum)=`zêdok`, fark=`kemok`, çarpım=`carandok`, bölüm=`paran`. Sözlükte olmayan terimi uydurma; FerMat'a öneri olarak işaretle.
  - [ ] (Gelecek seçenek, karar kullanıcının) Galaksay'daki önceden üretilmiş Kurmancî klip hattı (Meta MMS-TTS, **CC BY-NC 4.0** — ticari lisans öncesi karar gerekir) problem metinleri için statik ses olarak düşünülebilir; bu `tts.js` yolunun dışında ayrı bir oynatıcı ister ve STANDARDS §10'a göre RFC gerektirir.

### 2.6 Palet ve renk körü modu

- Temel jetonlar `@shared/palette.js` `COLORS` (bg `#f5f0e3`, panel `#fffdf7`, text `#3d3520`, border `#d4c9a8`, positive `#22c55e`, negative `#ef4444`, neutral `#8b5cf6`, info `#3b82f6`) + `SHADOWS`, `RADII`, `SPACING`, `TOUCH` (minTarget 44, snapDistance 16).
- `makeAppTheme('problem')` = COLORS + accent alanları (`palette.js:124-134`).
- Renk körü modu: `applyA11yAttributes` → `<html data-colorblind="on">`; `a11y-global.css` gövdeye `filter: saturate(1.2) hue-rotate(-10deg) contrast(1.05)` uygular ve `.ds-cb-green` / `[data-semantic="positive"]`, `.ds-cb-red` / `[data-semantic="negative"]` öğelerine çapraz desen ekler.
  - [ ] Şema parçalarını (Parça-1 / Parça-2 / Bütün / Fark) **yalnız renkle ayırma**: Okabe-Ito (`COLORS.colorblind`: `#d55e00, #0072b2, #cc79a7, #009e73, #f0e442, #56b4e9, #e69f00`) + SVG `<pattern>` (çizgi/nokta) + metin etiketi. `[data-colorblind="on"]` altında desen görünür olmalı.
  - [ ] Doğru/yanlış geri bildirimine `data-semantic="positive|negative"` ver (desen kancası).
  - [ ] Dikkat: `body`'ye `filter` uygulanınca `position:fixed` öğeler (modal, sürükleme hayaleti) body'ye göre konumlanır — renk körü modunda modal/sürükle-bırak konumunu test et.

### 2.7 Depolama ad alanı

- Kural (STANDARDS §6.1, `storage.js`): `dokunsay:<modul>:<konu>` → modul = **`problem`**.

```ts
// src/lib/storage.ts
import { saveState, loadState, saveProgress, loadProgress, exportAll } from '@shared/storage.js';
const M = 'problem';
export const kaydet = <T,>(konu: string, v: T) => saveState(M, konu, v);        // dokunsay:problem:<konu>
export const oku = <T,>(konu: string, varsayilan: T) => loadState(M, konu, varsayilan) as T;
export const ilerlemeKaydet = (etkinlikId: string, p: object) => saveProgress(M, etkinlikId, p); // dokunsay:problem:progress
export const ilerlemeOku = () => loadProgress(M);
export const disaAktar = () => exportAll(M);                                    // öğretmen JSON dışa aktarımı
```

- [ ] `za.*` gibi özel önek KULLANMA (Zihinden hatası). Sürüm gerekiyorsa konuya göm: `dokunsay:problem:session.v1`.
- [ ] Ortak (aynı kökenli) anahtarlar — dokunma, yalnız oku: `dk_lang` (dil), `dokunsay:a11y:prefs` (a11y tercihleri, `a11y.js` MODUL='a11y'), `numap_token` / `numap_user` (kapı).
- [ ] Tüm okuma/yazma try/catch (storage.js zaten sarar); iOS özel sekmede kota hatası uygulamayı durdurmamalı.

### 2.8 Erişilebilirlik mod listesi

`A11Y_DEFAULTS` (`a11y.js`): `dyscalculia:false, dyslexia:false, highContrast:false, colorblind:false, tts:true, sfx:true, reduceMotion:false (sistem tercihine göre), fontSize:1.0`. Panelde 7 anahtar (A11yPanel MODES): 🔢 Diskalkuli · 📖 Disleksi · 🌓 Yüksek Kontrast · 🎨 Renk Körü · 🔊 Sesli Okuma · 🎵 Ses Efektleri · 🐢 Animasyonu Azalt.

Kökte ayarlanan öznitelikler: `data-dyscalculia="on|off"`, `data-dyslexia`, `data-contrast="high|normal"`, `data-colorblind`, `data-reduce-motion`, `--a11y-font-scale`.

- [ ] `state/A11yContext.tsx` Zihinden'den **birebir** kopyalanır (TS; `dil` prop'u `A11yPanel lang={dil}`'e gider; `prefs.sfx→setAudioEnabled`, `prefs.tts→setTTSEnabled`).
- [ ] Klavye: `installShortcuts({ onUndo, onRedo, onDelete, onSpeak, onHelp, onEscape })`. **Dikkat:** `installKeyboardShortcuts` input DIŞINDA `S` ve `Backspace/Delete` tuşlarını **her zaman `preventDefault`** eder — cevap girişi için gerçek `<input inputMode="numeric">` kullan (input içinde kısayollar devre dışı); div tabanlı sahte giriş kutusu yapma.
- [ ] `announce(msg)` → `#dokunsay-live-polite` bölgesi; adım geçişleri ve geri bildirim buradan duyurulur (§4.2).
- [ ] `a11y-global.css` tüm `button`, `a[href]`, `[role=button]`, checkbox/radio'ya `min-height/min-width: 44px !important` uygular. Bar model parçalarını `<button>` yaparsan dar parçalar (ör. 1 birim) 44px'e şişer ve **oran bozulur** → parçaları SVG `<rect>` çiz, etkileşimi ayrı ≥44px tutamaç/kapsayıcıya ver.
- [ ] Diskalkuli modu düğmelere ek dolgu ve yavaş geçiş uygular; `.ds-num` / `[data-numeric="true"]` sayılara ek aralık verir — sayısal etiketlere bu kancayı ekle.

### 2.9 i18n — kaç dil zorunlu?

| Katman | Zorunluluk | Kaynak |
|---|---|---|
| Araç arayüzü + **içerik** (problem metni, yönerge, ipucu, geri bildirim, şema adı, ekran okuyucu duyurusu) | **tr + ku + en (3 dil, eksiksiz)** | STANDARDS §1.7 / §1.7.1; `LangSwitcher` DEFAULT_LANGS; `i18n-base.js` LANGS |
| Launcher katalog kaydı (`tools.js`) | **5 dil** (tr, ku, en, ar, fa) — `name, subtitle, description, topics` | `tools.test.js:15-26` |
| Launcher `i18n.js` yeni anahtar (eklenirse) | **5 dil**, boş olmayan string | `i18n.test.js:17-31` |
| AR/FA araç içeriği | YAZMA (gizli; uzman denetimi yok) | `LangSwitcher.jsx:16-32` |

- [ ] Ortak anahtarlar `i18n-base.js` `createI18n({tr,ku,en})` ile birleşir: `menu_*`, `btn_*` (`btn_check`, `btn_hint`, `btn_speak`…), `feedback_*` ("Harika!", "Tekrar deneyelim", "Bir daha düşün"…), `a11y_*`, `diff_*`, `cat_*`. Yeniden yazma, genişlet.
- [ ] Anahtarlar düz (flat), nokta notasyonu yok (§5.2). Kesir'in `t("act."+index+".n")` **indeks-tabanlı** kalıbını KOPYALAMA (etkinlik sırası değişince çeviri kayar); içerik metinleri etkinlik nesnesinde `{tr,ku,en}` olarak durur (Geo kalıbı, §4).
- [ ] Denetim (§1.7.1): dili değiştir → **görev metni** değişmeli; menünün değişmesi yetmez. Birim test: her etkinliğin her metin alanında `tr/ku/en` dolu.
- [ ] Hitap "sen", olumlu dil ("bir kez daha dene"), cümle ≤10 sözcük, terim ilk kullanımda tanımlı (§5.3).

### 2.10 Kimlik yuvası ve kullanıcı bilgisi

- **Güncel yuva `#numapAuth`**'tur (`AppShell.jsx:113`, `useAuthSlot.js`, `numap-gate.js:68,86`). Belleğin/eski yorumların söylediği `#hcmoAuth` ve `hcmo-gate.js` **eskidi** (`site-header.mjs:8` yorumu da eski; gerçek HTML `id="numapAuth"`, satır 75). Yeni kodda `hcmoAuth` kullanma.
- Kapı akışı (`numap-gate.js`): gate modunda `html.numap-gated` içeriği gizler → `?sso=` bileti ya da `numap_token` `/auth/me` ile doğrulanır → açılır ve rozet `#numapAuth`'a (yoksa sağ üste yüzer) çizilir; NuMap'e ulaşılamazsa **8 sn sonra açık-başarısız** (`numap-gate.js:172`).
- `window.HCMO_USER` **mevcut kapıda YOK** (eski hcmo-gate özelliğiydi). Kullanıcı bilgisi gerekiyorsa:

```ts
export function numapKullanici(): { name?: string; email?: string } | null {
  try { return JSON.parse(localStorage.getItem('numap_user') || 'null'); } catch { return null; }
}
```

  - [ ] Bu yalnız *görüntü* (öğretmen paneli başlığı) içindir; yetki kararı verme (istemci-tarafı kapı, sunucu zorlaması değil).
  - [ ] Kapı olay yaymaz; rozet gecikmeli gelebilir (`useAuthSlot` MutationObserver 15 sn bekler). Kullanıcı adını ilk render'da bulamayabilirsin → panel açılışında yeniden oku.
- [ ] Öğrenci verisi (ad, ilerleme) **yalnız cihazda** (`dokunsay:problem:*`), sunucuya gitmez (STANDARDS §6; PRIVACY şablonu). Öğretmen paneli JSON dışa/içe aktarım (§1.8).

---

## 3. KAYIT NOKTALARI (dosya:satır — HEAD ffa7cb2)

> Sıra önemlidir: önce **tek doğruluk kaynağı** (`apps.js`), sonra katalog + testler, sonra elle yazılmış listeler, en son içerik sayfaları (yörünge/rehber). Her grup sonunda belirtilen doğrulama komutunu çalıştır.

### 3.1 Tek doğruluk kaynağı — `_platform/apps.js`

- [ ] **`_platform/apps.js:30`** (zihinden satırının altına, `];` satır 31'den önce):

```js
  { dir: 'DokunSayProblem',    name: 'Problem',  folder: 'DokunSayProblem',    id: 'problem' },
```

Bu tek satır otomatik olarak şunları sağlar: `build-site.js:60-95` derler ve `dist-site/DokunSayProblem/`'a kopyalar (BASE_PATH = `${SITE_BASE}DokunSayProblem/`); `build-site.js:141` **sitemap.xml**'e ekler; `inject-gate.mjs:50` dist-site'ı taradığı için `DokunSayProblem/index.html`'e **gate** modu enjekte edilir; `tools.test.js:64-77` katalogla birebir eşleşmeyi zorlar.

### 3.2 Launcher kataloğu — `_platform/launcher/src/tools.js`

- [ ] **`tools.js:314`** sonrasına (zihinden nesnesinin `},`'undan sonra, `];` satır 315'ten önce) yeni nesne. Alanlar ve kuralları (`tools.test.js:15-39`):

| Alan | Kural | Değer (öneri — metinler 01–05 belgelerindeki kapsamla kesinleşir) |
|---|---|---|
| `id` | `/^[a-z]+$/` | `'problem'` |
| `name` | 5 dil, boş değil | tr `DokunSay Problem` · ku `DokunSay Pirsgirêk` · en `DokunSay Problem` · ar `دكن‑ساي المسائل` · fa `دکن‑سای مسئله` |
| `subtitle` | 5 dil | tr `Şema Temelli Problem Çözme` · ku `Çareseriya Pirsgirêkan bi Şemayan` · en `Schema-Based Problem Solving` · ar `حلّ المسائل القائم على المخطّطات` · fa `حلّ مسئله مبتنی بر طرح‌واره` |
| `description` | 5 dil | tr `Sözel problemleri yapısına göre tanı: bar model ve parça-bütün şemasıyla birleştirme, ayırma, karşılaştırma ve eşit gruplar.` · ku/en/ar/fa karşılıkları |
| `icon` | truthy | `'🧩'` (Galaksay/Zihinden ile çakışmaz; `appIcon.js`'te aynı emoji) |
| `color` | `/^#[0-9a-f]{6}$/i`, **`APP_ACCENTS.problem.color` ile aynı** | `'#4f46e5'` |
| `ageRange` | `/^\d+-\d+$/` (tire ASCII `-`, en-tire DEĞİL) | `'6-11'` (kapsama göre) |
| `topics` | 5 dil, her biri boş olmayan dizi; kartta ilk 4 gösterilir (`App.jsx:491`) | tr `['Sözel Problem','Bar Model','Parça-Bütün','Karşılaştırma']` · ku `['Pirsgirêka Devkî','Modela Çovikê','Par û Gişt','Berhevdan']` · en `['Word Problems','Bar Model','Part-Whole','Comparison']` · ar/fa |
| `framework` | truthy | `'SBI (Jitendra) + CRA + Polya'` |
| `devUrl` | `/^http:\/\/localhost:\d+$/`, benzersiz, ≠3000 | `'http://localhost:3009'` |
| `folder` | `KLASOR[id]` ile **birebir** (`tools.test.js:64-69`) | `'DokunSayProblem'` |
| `status` | `stable\|beta\|alpha\|experimental` | `'beta'` (kartta görünmüyor; yalnız veri) |

  - Kurmancî metinler FerMat'a göre (`tools.js:5-6` başlık notu): `pirsgirêk`, `çareserî`, `berhevdan`, `par û gişt` (Bar kaydı `tools.js:39` ile aynı ifade).
  - `prodPath` alanı EKLEME — kaldırıldı (`apps.js:6-12`, `tools.test.js:56-63`).

- [ ] **`TOOL_CATEGORIES`** — `number` kategorisine `'problem'` ekle, **beş dilde de**: `tools.js:319` (tr), `:325` (ku), `:331` (en), `:337` (ar), `:343` (fa):

```js
{ id: 'number', label: 'Sayı & İşlem', tools: ['bar', 'basamak', 'tam', 'kesir', 'zihinden', 'problem'] },
```

  (Test yalnız `tr` listesinin araç referanslarını denetliyor (`tools.test.js:95-112`); ku/en/ar/fa'yı unutmak test geçer ama o dillerde kategori süzgecinde araç kaybolur — elle kontrol et.)

### 3.3 Katalog testleri — `_platform/launcher/src/tools.test.js`

- [ ] **`:6-7`** `'tam olarak 8 araç içerir'` → `9`, `toHaveLength(9)`.
- [ ] **`:12`** beklenen id listesi (alfabetik): `['bar','basamak','clock','geo','kesir','problem','tam','veri','zihinden']`.
- [ ] **`:41, :47`** port aralığı `3001-3008` → `3001-3009` (başlık metni + `toBeLessThanOrEqual(3009)`).
- [ ] Doğrula: `cd _platform/launcher && npm test` (vitest; `tools.test.js` + `i18n.test.js`).

### 3.4 Launcher arayüzü — `_platform/launcher/src/App.jsx` + `i18n.js`

- [ ] **`App.jsx:87`** `{ key: 'tools', icon: '🎯', value: 8 }` → `value: TOOLS.length` (sabit sayı her yeni araçta geride kalıyor; `TOOLS` zaten satır 2'de import edili).
- [ ] **`App.jsx:76`** yorum "(3001-3007)" → "(3001-3009)" (kozmetik).
- [ ] Kart ızgarası (`App.jsx:462-505`) veriden çizilir: `resolveToolUrl` prod'da `${BASE_URL}${tool.folder}/` (`App.jsx:79-84`), dev'de `devUrl`. **Ek kod gerekmez.**
- [ ] (İsteğe bağlı) Başlık hapı: Zihinden için elle eklenmiş `zihindenUrl` (`App.jsx:120`) + `<a className="zihinden-link">` (`App.jsx:217-227`) kalıbı var. Problem aracı için hap eklenecekse yeni i18n anahtarı (`problem_nav`) **5 dilde** eklenmeli (`i18n.js` tr:~33, ku:~109, en:~185, ar:~261, fa:~337 — `zihinden_nav` komşuluğu); `i18n.test.js:17-22` tüm dillerde aynı anahtar kümesini zorlar. Öneri: hap EKLEME (başlık zaten 4 hap + dil seçici; mobilde taşar). Kart yeterli.
- [ ] `i18n.js` `tools_section_sub` "5 dilde" diyor — dokunma (launcher için doğru).

### 3.5 Paylaşılan kabuk kaydı — `_platform/shared/`

- [ ] **`palette.js:113`** (zihinden satırının altına, `};` satır 114'ten önce):

```js
  // Problem Çözme — çivit (HÇMÖ Üçlü Kod'un "somut" rengiyle aynı aile; diğer 8 accent'ten ayrışır).
  problem:  { color: '#4f46e5', dark: '#3730a3', soft: '#e0e7ff', softer: '#eef2ff', name: 'Çivit' },
```

  Beyaz üst şerit metni için kontrast: `#4f46e5` üzerinde beyaz ≈ 6.3:1, `#3730a3` üzerinde ≈ 10:1 (gradyan iki uçta da AA). Alternatif istenirse turuncu `#ea580c` beyazla ≈ 3.6:1 → üst şerit metninde **AA altında**, önerilmez.
- [ ] **`palette.d.ts:45`** `AppId` birleşimine `| "problem"` ekle (yoksa TS'li araç `appId="problem"` derlemez).
- [ ] **`appIcon.js:25`** `APP_EMOJI`'ye `problem: '🧩',`; **`appIcon.js:35`** `SLUG_TO_APPID`'ye `DokunSayProblem: 'problem',`. (Regex `/\/(DokunSay[A-Za-z]+|Dokunsay-[a-z-]+)\//` "DokunSayProblem"i zaten yakalar; eşleme yoksa favicon düşmez.) Not: Zihinden de burada yok (kendi favicon.svg'sini kullanıyor).

### 3.6 Elle yazılmış araç listeleri (APPS'ten BESLENMEYEN)

| Dosya:satır | Ne yapılır | Not |
|---|---|---|
| **`package.json:20`** (kök) | `"dev:problem": "cd DokunSayProblem && npm run dev",` ekle | |
| **`_platform/scripts/run-all.js:21-30`** | `{ dir: 'DokunSayProblem', name: 'Problem' },` ekle | **ZihindenAritmetik de eksik** → `install:all`/`build:all` Zihinden'i atlıyor. Kalıcı çözüm: `import { APPS } from '../apps.js'` |
| **`_platform/scripts/dev-all.js:24-32`** | `{ dir: 'DokunSayProblem', name: 'Problem', port: 3009, color: '\x1b[94m' },` | Zihinden (3008) de eksik |
| **`_platform/scripts/verify.js:23-31`** | `{ dir: 'DokunSayProblem', id: 'problem' },` | Zihinden eksik (eklense `uygulama` paket adı yüzünden **hata** verir → CI kırılır). CI'da `verify.js` build'den sonra koşuyor (`deploy-cloudflare.yml:40`) ve hata = exit 1 → **dağıtım durur**. Yeni aracı eklemeden önce §1 zorunlu dosyaları (README, LICENSE, PRIVACY.md, eslint.config.js, .editorconfig) hazır olmalı. |
| **`.github/workflows/deploy-cloudflare.yml:28-30`** | `for dir in …` listesine `DokunSayProblem` ekle; adım adı "all 9 projects" → "all 10 projects" | **Eklenmezse `npm run build` node_modules'süz çalışır → `tsc`/`vite` bulunamaz → build-site o uygulamayı `failed` sayar → exit 1** |
| **`.github/workflows/deploy.yml:79-81`** | Aynı liste (GitHub Pages aynası) | |
| `_platform/scripts/deploy-dist.mjs:17` | (Eski WP/diskalkuli.com hattı) — dokunma ya da `APPS`'e ekle | Bu dosyada **düz metin paylaşımlı sır** duruyor (satır 13) ve depo herkese açık (`CITATION.cff` repository-code). Ayrı güvenlik işi: sırrı çevre değişkenine taşı + döndür. |

- [ ] Doğrula: `node _platform/scripts/verify.js` → `DokunSayProblem ✅`.

### 3.7 Giriş kapısı (gate) enjeksiyonu

- [ ] **Değişiklik YOK.** `inject-gate.mjs:29` `LANDING = new Set(['index.html', 'ZihindenAritmetik/index.html'])` — DokunSayProblem buraya EKLENMEZ; böylece `walk()` (`:42-50`) bulduğu `DokunSayProblem/index.html`'e `BRAND_FLAG + ACCENT_FLAG + GATE_TAG` (chip bayrağı olmadan) ekler = **gate modu** (girişsiz içerik gizli).
- [ ] Enjeksiyon idempotenttir (`:55-60` önceki `NUMAP_GATE_*`, `numap-gate.js`, eski `HCMO_GATE_*`/`hcmo-gate.js`/`hcmo-a11y.js` etiketlerini söker). Bellekteki "çift enjeksiyon" uyarısı eski `hcmo-gate` sürümüne aitti; mevcut betikte giderilmiş — yine de §6.2'ye bak.
- [ ] Kapı yalnız `build-site.js` (ya da elle `inject-gate.mjs`) sonrası vardır; `npm run dev`'de kapı YOK (beklenen).

### 3.8 Öğrenme yörüngeleri — araç rozetleri (derin bağlantı)

Mevcut mekanizma (`build-yorunge.mjs`):
- `TOOL_PATH` (`:58-61`), `TOOL_NAME` (`:62-65`), `DOMAIN_TOOL` (`:66-72`) — **dördüncü kopyası** `shared/yorunge.worksheet.js:28-29,37-40` ve `scripts/build-yorunge-pdf.mjs:38` içinde.
- Düzey aracı: `const tool = (en && en.tool) || DOMAIN_TOOL[domain.key] || 'bar'` (`:298`); rozet yalnız `lv.iv` içinde `k:'DokunSay'` varsa çizilir (`ivChips`, `:252-265`).
- **Tuzak:** `en.tool`'u `'problem'` yapmak rozeti değiştirir AMA aynı `toolOf()` çalışma yapraklarında (`yorunge.worksheet.js`) "tüm görseller gerçek X materyalinin çizimleridir" metnini ve malzeme çizimlerini de belirler → yapraklar yanlış materyali vaat eder. **`tool` alanını DEĞİŞTİRME.**

Önerilen değişiklik (yalnız `build-yorunge.mjs`):

- [ ] `:58-65` `TOOL_PATH`'e `problem: '/DokunSayProblem/'`, `TOOL_NAME`'e `problem: 'DokunSay Problem'`.
- [ ] Zenginleştirme dosyalarına yeni isteğe bağlı alan: `extra: [{ tool: 'problem', a: 'Birleştirme şeması · sonucu bilinmeyen', hash: 'sema=birlestirme&bilinmeyen=sonuc' }]`.
- [ ] `ivChips(iv, levelTool, extra = [])` imzası; `iv` boş ama `extra` doluysa da `.chips` bloğunu bas; ek rozet `href="${TOOL_PATH[x.tool]}${x.hash ? '#' + x.hash : ''}"`, sınıf `chip chip-ds` (ya da yeni `.chip-pr` — CSS `:466-467` komşuluğu). `activityBlock` (`:267-291`) iki `ivChips` çağrısına `en && en.extra` geçir.
- [ ] Rozet eklenecek düzeyler (öneri; kesin eşleme 01–05 belgelerindeki şema kapsamına göre):

| Yörünge (`enrich-*.js` satırı) | Düzey (indeks) | Rozet metni / hash |
|---|---|---|
| add (`enrich-add.js:57`) | 3 Sonucu Bulan ★darboğaz | Birleştirme/ayırma · sonucu bilinmeyen — `sema=degisim&bilinmeyen=sonuc` |
| add (`:93`) | 5 Eksik Olanı Bulan | Değişimi bilinmeyen + karşılaştırma — `sema=degisim&bilinmeyen=degisim` |
| add (`:110`) | 6 Sayma Stratejileriyle Çözen ★ | Parça-parça-bütün — `sema=birlestirme` |
| add (`:128`) | 7 Parça-Bütün İlişkisi Kuran | Başlangıcı bilinmeyen (deneme) — `sema=degisim&bilinmeyen=baslangic` |
| add (`:146`) | 8 Parçayı ve Bütünü Birlikte Düşünen | Başlangıcı bilinmeyen — aynı |
| add (`:182`) | 10 Her Tür Problemi Çözen | Karışık şemalar (transfer, diff 5) — `mod=karisik` |
| compose (`enrich-compose.js:153`) | 8 Her Tür Problemi Çözen (parça-bütün) | `sema=birlestirme` |
| multdiv (`enrich-multdiv.js:67`) | 3 Somut Modelleyici ×/÷ ★ | Eşit gruplar — `sema=esit-grup` |
| multdiv (`:138`) | 7 Dizi Niceleyici / Problem Çözen ×/÷ | Eşit gruplar + karşılaştırma (kat) — `sema=esit-grup` |

- [ ] Üret ve commit'le: `node _platform/scripts/build-yorunge.mjs` (PowerShell'den) → `_platform/launcher/public/yorunge/<key>/index.html` (**git'te izleniyor**, 88 dosya) + varsa `dist-site/yorunge/`. CI `build-site.js` yörüngeyi YENİDEN ÜRETMEZ; launcher'ın `public/` klasöründen kopyalar → **üretilen HTML commit'lenmezse canlıya gitmez.**
- [ ] İsteğe bağlı: `build-yorunge-pdf.mjs:171` rozet listesi (PDF kartlarında "Bu düzeyi besleyen araçlar") — `extra` alanını da okuyacak şekilde.

### 3.9 Müdahale Rehberi — "Şema-Temelli Problem Çözme" bölümü

- Kaynak: `_platform/scripts/rehber-sections.json` dizisinin **2. öğesi** (`key: "sema"`, `kanit_gucu: "güçlü"`, `etki: "g≈0,40–0,81"`); render `build-rehber.mjs:95-107`. `dokunsay_bagi` alanı `para()` ile **HTML kaçışlı** basılır (`build-rehber.mjs:21,106`) → metne `<a>` yazılamaz; yalnız `**kalın**` desteklenir.
- [ ] `build-rehber.mjs:106` sonrasına isteğe bağlı buton alanı:

```js
(s.arac && s.arac.href ? '<p class="arac-cta"><a class="btn-arac" href="' + esc(s.arac.href) + '">🧩 ' + esc(s.arac.label) + ' →</a></p>' : '') +
```

  ve `rehber-sections.json` `sema` öğesine: `"arac": { "href": "/DokunSayProblem/#sema=birlestirme", "label": "DokunSay Problem ile uygula" }`. CSS'i `build-rehber.mjs` `<style>` bloğuna (DokunSay yeşil `#2e7d32` buton; mevcut CTA desenine uy).
- [ ] `sema.dokunsay_bagi` metnine bir cümle: "**DokunSay Problem** aracı bu şemaları (parça-parça-bütün, değişim, karşılaştırma, eşit gruplar) dokunmatik bar modelle adım adım uygular." (düz metin; bağlantı butondan).
- [ ] İkincil bağlantı adayları: `ustbilis` (8 — "görselleştir/çiz" adımı) ve `matematik_dili` (5 — problem dilindeki "daha az/kalan" tuzakları).
- [ ] `rehber-sections.v1.json` yedektir — DEĞİŞTİRME.
- [ ] Rehber `build-site.js:116-128` ile her tam derlemede yeniden üretilir (CI dahil) → yalnız JSON + mjs commit'i yeterli.

### 3.10 Site başlığı, sitemap, robots, llms.txt

- [ ] `site-header.mjs:59-63` PILLS (Yörüngeler · Rehber · Araçlar) — **değişiklik gerekmez** ("Araçlar" `/#tools-section`'a gider, kart orada).
- [ ] `sitemap.xml` — otomatik (`build-site.js:134-164`, APPS'ten). Elle ekleme yapma.
- [ ] `robots.txt` — değişiklik yok (her şey `Allow: /`).
- [ ] **`_platform/launcher/public/llms.txt:3`** "7 dijital manipülatif araç" ve **`:18`** araç yol listesi → Problem (ve eksik Zihinden) eklenmeli.

### 3.11 Belgeler

- [ ] **Kök `README.md:11`** ("7 uygulama") ve araç tablosu `:15-25` → satır ekle (`[**Problem**](./DokunSayProblem/) | 🧩 | Şema temelli problem çözme | 6-11 | SBI + CRA`). Zihinden de tabloda yok.
- [ ] **`_platform/README.md`** mimari ağaç + "Araç Ailesi" tablosu + port tablosu (3000–3007 → 3009'a kadar).
- [ ] **`_platform/STANDARDS.md`** başlık "Kapsam" satırı, §1.2 çerçeve listesi (Problem → SBI/Jitendra + Polya + CRA), §2.3 paket adı tablosu, **§2.9 port tablosu** (`Problem | 3009`; Zihinden 3008 de eksik).
- [ ] `_platform/docs/CHANGELOG.md` yeni sürüm girdisi.
- [ ] `CITATION.cff` — araç listesi yok; değişiklik gerekmez.
- [ ] (Şemsiye WP, elle dağıtım) `_platform/wp-pages/dkc/dk-content.php:22` araç haritası, `dk-seo.php:313,422`, `new-templates/dk-page-araclar-index.php:155` — hercocukmatematikogrenebilir.com `/araclar/` sayfası için; ayrı iş, dokunsay.com dağıtımını etkilemez.

---

## 4. ETKİNLİK ŞEMASI

### 4.1 Mevcut durum

- `_platform/shared/activity-schema.js`: `CATEGORIES` (kesif, kavram, islem, yanilgi, senaryo, karsilastirma, olcum — 3 dil etiket + renk), `DIFFICULTIES` (1 Keşif 🌱 · 2 Rehberli 🌿 · 3 Yönlendirilmiş 🌳 · 4 Bağımsız 🏆 · 5 Transfer 🎯), `FRAMEWORKS` (cra, vanHiele, crowley, curcio, bloom, gaise, ppdac, piaget, dienes) ve `validateActivity()` / `validateActivities()`.
- `validateActivity` denetimleri: `id` string + kebab-case (`/^[a-z0-9-]+$/`); `name`, `icon`, `description` truthy; `category ∈ CATEGORIES`; `difficulty ∈ 1..5`; `description.length ≤ 200`.
  - **Boşluk:** `name`/`description` çok dilli nesne olunca `description.length` `undefined` olur ve 200 sınırı **sessizce atlanır**. Dil başına uzunluk kendi testinde denetlenmeli.
- **`verify-schema.js` YOK.** Kök `package.json` `"verify:schema": "node ./_platform/scripts/verify-schema.js"` diyor ama dosya depoda bulunmuyor → komut kırık; hiçbir araçta şema denetimi otomatik koşmuyor. (Ayrı iş: betiği yaz ya da script'i kaldır.)
- Araçlardaki fiili şemalar birbirinden farklı:
  - Kesir (`App.jsx:14-249`): `{n, i, cat, diff, d, k, mis, src, expr}` — `k` = MEB kodu **ya da** `"KY"` (kavram yanılgısı işareti); çeviri `t("act."+index+".n")` indeksle (kırılgan).
  - Geo (`constants/activities.js`): `{id, level, phase, diff, cra, icon, label{5 dil}, q{5 dil}, opts, correct, answer, hint{5 dil}, mis{5 dil}, src}` — **en iyi örnek**: kararlı `id`, içerik nesnede çok dilli, `mis`+`src` görünür, `DiffBadge` 1..5 kenetler.
  - STANDARDS §1.7.1 tuzağı: Clock'ta `k` Kurmancî değil **MEB kazanım kodu** — alan adlarını körlemesine kopyalama.

### 4.2 Karar: yeni araç şemaya UYMALI — şema + genişletme

- [ ] Her etkinlik `validateActivity()`'den geçer (vitest'te `validateActivities(ACTIVITIES).invalid.length === 0`).
- [ ] Ek olarak aracın kendi testleri: dil başına ≤200, 3 dil dolu, `id` benzersiz, yanılgı etkinliklerinde `src` dolu, diff 4-5'te `hint` boş.

Önerilen TS tipi (`src/constants/activities.ts`):

```ts
import type { CATEGORIES } from '@shared/activity-schema.js'; // d.ts shim gerekir (§1.5)

type L3 = { tr: string; ku: string; en: string };            // AR/FA YOK (gizli diller)

export type SemaTuru =
  | 'birlestirme'        // parça-parça-bütün (combine)
  | 'degisim-artma'      // change-join
  | 'degisim-azalma'     // change-separate
  | 'karsilastirma'      // compare (fark)
  | 'esit-grup'          // equal groups (×/÷)
  | 'kat-karsilastirma'; // multiplicative compare
export type Bilinmeyen = 'sonuc' | 'degisim' | 'baslangic' | 'butun' | 'parca' | 'fark' | 'buyuk' | 'kucuk' | 'grup-sayisi' | 'grup-buyuklugu';

export interface ProblemEtkinligi {
  id: string;                          // kebab-case, KARARLI: ilerleme anahtarı + #etkinlik= derin bağlantı
  name: L3;
  icon: string;                        // emoji (TTS'te okunmaz)
  category: 'kesif' | 'kavram' | 'islem' | 'yanilgi' | 'senaryo' | 'karsilastirma'; // CATEGORIES anahtarı
  difficulty: 1 | 2 | 3 | 4 | 5;       // §1.6 — basamak GÖREV BİÇİMİNDEN gelir, sayı büyüklüğünden değil
  description: L3;                     // her dilde ≤200 karakter
  curriculum?: string;                 // MEB kazanım kodu — gerçek belgeden doğrulanır; UYDURMA yok. ('k' adını KULLANMA)
  frameworks?: string[];               // FRAMEWORKS anahtarları + 'sbi' | 'polya' (FRAMEWORKS'e ekleme RFC ister)
  cra?: 'C' | 'R' | 'A';               // somut / yarı-somut (bar model) / soyut (denklem)
  sema: SemaTuru;
  bilinmeyen: Bilinmeyen;
  problem: {
    text: L3;                          // ekranda — eksi U+2212, en-tire YOK (§2.4)
    speech?: Partial<L3>;              // okunuş farklıysa (başta bilinmeyen vb.); ku asla okunmaz
    sayilar: number[];
    cevap: number;
    birim?: L3;
  };
  ipuclari?: L3[];                     // kademeli; diff 4–5'te BOŞ (§1.6 "Bağımsız = ipucu yok")
  mis?: { id: string; text: L3 };      // misconceptions.ts'teki kimlik + çocuğa/öğretmene açıklama
  src?: string;                        // literatür atfı — yanilgi kategorisinde ZORUNLU (§1.5)
  yorunge?: { key: 'add' | 'compose' | 'multdiv' | 'frac'; level: number }; // §3.8 rozetiyle çift yönlü
  checkSuccess?: (state: unknown) => boolean;
}
```

### 4.3 Alan kuralları — kontrol listesi

- [ ] **`id`**: kebab-case, asla yeniden kullanılmaz; yeniden adlandırma = öğrencinin eski ilerlemesi kaybolur (`dokunsay:problem:progress` anahtarı id'ye bağlı).
- [ ] **`difficulty` 1–5 dağılımı** tüm basamakları kapsamalı (denetimde 5 aracın da yalnız 1–3'ü vardı, §1.6.1). Gösterge **Geo `DiffBadge`** portu: `clampDiff()` + sabit 5 nokta (Bar'ın `"☆".repeat(3-diff)` kalıbı diff 4'te `RangeError` ile çöküyordu).
  - 1 Keşif: serbest bar model, hedef yok · 2 Rehberli: şema önceden çizili, bol ipucu · 3 Yönlendirilmiş: şemayı çocuk seçer, ölçüt var · 4 Bağımsız: ipucu yok, çocuk çözer · 5 Transfer: gerçek bağlam + gerekçe **ya da çocuğun kendi problemini KURMASI**.
- [ ] **`curriculum` (MEB kodu)**: yalnız kazanım belgesinden doğrulanmış kod; emin değilsen alanı boş bırak (Kesir'de `k:""` örneği). Yanılgı işareti için ayrı alan (`category:'yanilgi'` + `mis`) — Kesir'in `k:"KY"` karışımını tekrarlama.
- [ ] **Çok dilli ad/yönerge**: `name`, `description`, `problem.text`, `ipuclari[]`, `mis.text` → `{tr,ku,en}` üçü dolu. Kurmancî FerMat terimleriyle (§2.5).
- [ ] **Kavram yanılgısı atfı (§1.5)**: en az **3** `category:'yanilgi'` etkinliği, her biri `mis.id` + `src`. Sözel problemde literatürde köklü aday yanılgılar (içerik belgeleriyle kesinleştir):
  - Anahtar sözcük stratejisi — "daha az" görünce çıkarma, "fazla" görünce toplama; tutarsız dilde hata (Hegarty, Mayer & Monk, 1995).
  - Karşılaştırma problemlerinde "kaç fazla?"yı büyük sayı sanmak / fark şemasını birleştirmeye indirgemek (Riley, Greeno & Heller, 1983).
  - Başlangıcı bilinmeyen problemlerde işlemi metindeki sıraya göre kurmak (Carpenter & Moser, 1984).
  - Gerçekçi bağlamı yok sayıp sayıları mekanik işleme sokmak ("otobüs problemi" türü; Verschaffel, Greer & De Corte, 2000).
- [ ] **`misconceptions.ts`** Geo'nun `MISCONCEPTIONS` kataloğu biçiminde (`{src, level, tr, ku, en}`) — öğretmen panelinde "öngör" (Smith & Stein 1. pratik) listesi olarak da gösterilir.

### 4.4 Öğretmen paneli (STANDARDS §1.8 — teşvik edilir)

- [ ] `AppTabs` `teacher` sekmesi (👩‍🏫) ya da Kesir'deki gibi modal; içerik: öğrenci ilerlemesi (`loadProgress('problem')`: etkinlik id → `{doğru, deneme, sure, sema, yanilgiId, completedAt}`), **şema türüne göre** doğruluk tablosu, yanılgı sıklığı, ders planı (etkinlik sırası seçimi), JSON dışa/içe aktarım (`exportAll('problem')`).
- [ ] Öğretmen adı başlıkta `numap_user`'dan (§2.10); öğrenci adı opsiyonel ve yalnız cihazda (§6.2, PRIVACY.md'de beyan).
- [ ] Terim: "**bireyselleştirilmiş**" (öneri/rapor metinlerinde "kişiselleştirilmiş" DEĞİL — HÇMÖ duran direktifi).

---

## 5. TASARIM DİLİ

### 5.1 Renk

- **Zemin/metin (ortak):** `COLORS.bg #f5f0e3` (sıcak krem), `panel #fffdf7`, `sidebar #faf6ed`, `text #3d3520`, `textSoft rgba(61,53,32,.65)`, `border #d4c9a8`, `borderSoft #e8dfc5`, gölgeler `SHADOWS.sm/md/lg` (kahve tonlu), odak `SHADOWS.focus` (altın halka).
- **Araç kimliği (accent):** her aracın tek rengi — Bar altın `#f59e0b`, Basamak mavi `#3b82f6`, Clock yeşil `#22c55e`, Kesir kırmızı `#ef4444`, Tam mor `#8b5cf6`, Geo turkuaz `#14b8a6`, Veri pembe `#ec4899`, Zihinden lacivert `#1B4965` → **Problem çivit `#4f46e5`** (dark `#3730a3`, soft `#e0e7ff`, softer `#eef2ff`). Launcher kart rengi = accent (`tools.js color` ≡ `APP_ACCENTS.problem.color`, TEMPLATE.md §6 "launcher kartındaki renk ile birebir").
- **Site/çatı rengi:** DokunSay site sayfaları (yörünge, rehber, başlık, kapı vurgusu) HÇMÖ yeşili `#2E7D32` ailesinde (`inject-gate.mjs:24` `NUMAP_GATE_ACCENT="#2E7D32"`, `site-header.mjs`). Araç İÇİNDE accent, araç DIŞINDA yeşil — karıştırma.
- **Anlamsal:** doğru `positive #22c55e` / yanlış `negative #ef4444` (+ renk körü deseni), bilgi `info #3b82f6`.
- **Şema parçaları:** Okabe-Ito (`COLORS.colorblind`) — ör. Parça-1 `#0072b2`, Parça-2 `#e69f00`, Bütün nötr kenarlı, Fark `#cc79a7`; aynı kavram = aynı renk tüm etkinliklerde (§1.3 "tutarlı görsel dil"). Bar aracı (çubuk renkleri) ile çakışan anlam yükleme.

### 5.2 Tipografi

- `Nunito` 600 (gövde) / 700 (vurgu) / 800 / 900 (başlık) — `index.html` Google Fonts bağlantısı ya da `import '@shared/typography.css'`.
- Ölçek jetonları (`typography.css`): 12/14/16/18/22/28/36/48 px (`--dokunsay-fs-*`); satır yüksekliği 1.15/1.4/1.6.
- `[data-dyslexia="on"]` → OpenDyslexic/Nunito + harf/sözcük aralığı; `[data-dyscalculia="on"]` → font ×1.35.
- Problem metni en az 18px (`--dokunsay-fs-lg`), sayılar `data-numeric="true"` (diskalkuli aralığı).

### 5.3 Bileşen görünümü ve yerleşim

- **Üst şerit (AppShell):** accent-dark → accent 135° gradyan, beyaz metin, min 44px; solda beyaz hap "← Menüye Dön", simge kutusu, başlık/alt başlık; sağda `#numapAuth` rozeti + TR/KU/EN hap seçici.
- **Gövde:** `.ds-appshell` `height:100vh; overflow:hidden` — **iç kaydırmayı araç kendisi yönetmeli** (Zihinden "sayfa kaydırılamıyordu" hatası, commit `af87a22`): ana içerik `overflow:auto` kapsayıcıya.
- **STANDARDS §3.5 düzeni:** kenar çubuğu 280px (`<720px`'te gizli/açılır) · tuval `flex:1` ızgaralı SVG · alt araç çubuğu (AppToolbar). 16px yan boşluk, 375px'te yatay kaydırma yok.
- **Kartlar/modallar:** panel `#fffdf7`, radius 12–20 (`RADII.lg/xl`), `SHADOWS.lg`, açılış `popIn` 300–400ms, arka perde `rgba(0,0,0,.5)`.
- **İkonografi:** emoji + satır içi SVG; ikon fontu/UI kütüphanesi/Tailwind/styled-components YASAK (§2.7, §3.3).
- **Animasyon:** `animations.css` anahtarları (`popIn, fadeIn, pulse, float, jumpArc, zeroPoof, snapIn, dsCount`) — yalnız pedagojik anlamı olan yerde (ör. parça birleşince `snapIn`, doğru cevapta `pulse`); `data-reduce-motion` / `prefers-reduced-motion` saygılı.
- **Dokunma:** `touch-action: manipulation`, hedef ≥44px, sürükleme hayaleti opaklık 0.85, yakalama 16–24px (`TOUCH`).

### 5.4 Referans ekran tarifi — DokunSay Kesir

- Üstte **kırmızı gradyan** AppShell şeridi: "← Menüye Dön" beyaz hap, 🍕 kutusu, "DokunSay Kesir", sağda dil hapları.
- Solda **krem kenar çubuğu**: üstte `AppTabs` (Materyaller / Etkinlikler …); Materyaller'de sarı "bütün" şeridi ve altında renkli, köşeleri yuvarlatılmış **kesir çubukları** (genişlik 130/n, ortada beyaz kalın "1/n" etiketi); Etkinlikler'de kategori başlıkları küçük büyük-harf etiket (yanılgı kategorisi kırmızı), her satırda emoji + ad + sağda ★ zorluk; tamamlananlar ✅ ve açık yeşil zeminle.
- Ortada **ızgaralı krem tuval**: sürüklenen kesir modelleri, altlarında sayı doğruları, modeller arasına tıklanınca `=,<,>` dönen işaret daireleri; ifade ipucu balonu ("💡 …").
- Sol altta beyaz yuvarlak **zoom paneli** (+ / % / −); sürükleme sırasında sağ kenarda dikey **çöp şeridi**; sağ altta yüzen ♿ **A11y paneli** düğmesi.
- Öğretmen paneli: 👨‍🏫 düğmesiyle açılan krem modal (radius 20, `popIn`), notlar + rapor.
- Launcher kartı (`App.jsx:462-505`): üstte accent çizgisi, simge kutusu, ad/alt başlık, sağda yaş rozeti, açıklama, en çok 4 konu çipi, altta "📚 çerçeve" rozeti ve "Aç →".
- Problem aracı bu dili izler; tek fark **çivit accent** ve tuvalde bar model / parça-bütün şeridi.

---

## 6. RİSKLER VE TUZAKLAR

### 6.1 Derleme / yol

| # | Tuzak | Belirti | Önlem |
|---|---|---|---|
| R1 | **BASE_PATH MSYS mangle** — Git Bash `BASE_PATH=/…` değerini `C:/Program Files/Git/…`'e çevirir | Asset yolları bozuk, `#root` boş, beyaz sayfa | `build-site.js:35-38` yalnız `SITE_BASE`'i onarır; aracı tek başına derlerken BASE_PATH'i **verme** (varsayılan `/DokunSayProblem/` doğru) ya da PowerShell `$env:BASE_PATH='/DokunSayProblem/'`. `vite.config.ts`'e koruma ekle: `if (/Program Files|^[A-Za-z]:/.test(base)) throw new Error('BASE_PATH MSYS tarafından bozuldu')`. Launcher'ı derlerken de BASE_PATH verme. |
| R2 | **Vite 8 dedupe** | "Invalid hook call" / iki React kopyası (`@shared` klasöründe node_modules yok) | Vite 6'da kal (öneri). Vite 8'e geçilirse `resolve.dedupe: ['react','react-dom']` zorunlu (Zihinden). |
| R3 | **TS strict + eksik `.d.ts`** | `storage.js`, `i18n-base.js`, `activity-schema.js`, `fermat-terms.ku.js`, `appIcon.js`, `AppFooter.jsx`, `HcmoMark.jsx` importunda TS7016 | `tsconfig include` + shim ya da `_platform/shared/*.d.ts` ekle (§1.5). `palette.d.ts` AppId'e `"problem"`. |
| R4 | **Bilinmeyen `appId`** | Üst şerit sessizce Bar altını olur | `APP_ACCENTS.problem` ekle (§3.5). |
| R5 | **Router + statik barındırma** | `/DokunSayProblem/x` → kök 404 = launcher | Path router yok; hash (§1.7). |
| R6 | **PWA / servis çalışanı** | İkinci dağıtımda boş sayfa (Zihinden) | İlk sürümde PWA yok (§1.8). |

### 6.2 Dağıtım / dist-site

| # | Tuzak | Önlem |
|---|---|---|
| R7 | **dist-site bütünlüğü** — `wrangler pages deploy dist-site` klasörü **olduğu gibi** yayınlar; eksik klasör canlıdan silinir. **Şu anki yerel `dist-site/`'ta `rehber/` ve `sayi-cubuklari/` YOK** (doğrulandı: `ls dist-site`). Bu hâliyle elle dağıtılırsa Müdahale Rehberi ve Sayı Çubukları canlıdan kalkar. | Dağıtımı **CI'a bırak** (`main` push → `deploy-cloudflare.yml`, tam `build-site.js`). Elle dağıtım şartsa önce PowerShell'de `$env:SITE_BASE='/'; node _platform/scripts/build-site.js` (tam) ve `ls dist-site` ile `rehber/ sayi-cubuklari/ yorunge/ DokunSayProblem/ ZihindenAritmetik/` varlığını denetle. `build-site.js:52-55` başta `dist-site`'ı **siler**; bir uygulama başarısız olursa kalanlar yine kopyalanır ama çıkış kodu 1 — kısmi dist-site'ı **dağıtma**. |
| R8 | **inject-gate çift enjeksiyon** (bellek notu) | Mevcut `inject-gate.mjs:55-60` hem eski HÇMÖ hem NuMap etiketlerini söküp yeniden ekler → artık idempotent. Kalan risk sıralama: yeni aracın `dist`'i dist-site'a kopyalanıp **inject-gate çalıştırılmadan** dağıtılırsa araç **girişsiz açık** yayınlanır. Elle akışta her kopyadan sonra `node _platform/scripts/inject-gate.mjs` + `grep numap-gate dist-site/DokunSayProblem/index.html`. |
| R9 | **Launcher rebuild akışı** (kart görünsün diye) | `cd _platform/launcher; npm test; npm run build` (BASE_PATH VERME) → `dist/index.html` + `dist/assets/` → `dist-site/` (önce yalnız `dist-site/assets`'i temizle; araç klasörlerine dokunma) → `node _platform/scripts/inject-gate.mjs` (404.html'i de yeniler). Launcher `public/` (yorunge, numap-gate.js, llms.txt) da `dist`'e girer; `dist/*`'ı toptan kopyalamak `dist-site/yorunge`'yi public sürümüyle ezer — ikisi aynı kaynaktan olduğu için güvenli, ama önce `build-yorunge.mjs` koşturulmuş olmalı. |
| R10 | **CI elle listeleri** | `deploy-cloudflare.yml:30`, `deploy.yml:81` `for dir in …` listesine eklenmezse araç node_modules'süz derlenir → build-site `failed` → exit 1 → dağıtım yok. |
| R11 | **verify.js CI kapısı** | `deploy-cloudflare.yml:40` build sonrası `verify.js` koşar; hata = exit 1 → Cloudflare adımı hiç çalışmaz. Aracı `verify.js` listesine eklemeden önce README/LICENSE/PRIVACY.md/eslint.config.js/.editorconfig + `dokunsay-problem` adı + React `^18.3.1` hazır olmalı. |
| R12 | **Yörünge çıktısı commit'i** | `build-site.js` yörüngeyi üretmez; `_platform/launcher/public/yorunge/**` git'te izlenir. `build-yorunge.mjs` koşturulup çıktı commit'lenmezse rozetler canlıya çıkmaz. |
| R13 | **Cloudflare üretim dalı** | Elle dağıtımda `--branch main` zorunlu (yoksa Preview'a gider); `CLOUDFLARE_ACCOUNT_ID` çevre değişkenini sabitle. |

### 6.3 Arayüz / erişilebilirlik

| # | Tuzak | Önlem |
|---|---|---|
| R14 | `a11y-global.css` 44px `!important` tüm düğmelere | Orantılı bar model parçaları `<button>` olmasın; SVG + ayrı tutamaç (§2.8). |
| R15 | Renk körü modu `body{filter}` → `position:fixed` öğeler body'ye göre konumlanır | Modal, sürükleme hayaleti, A11y paneli renk körü modunda test. |
| R16 | `installKeyboardShortcuts` input dışında `S`, `Backspace`, `Delete`'i yutar | Cevap girişi gerçek `<input>`; özel tuş takımı düğme. |
| R17 | `.ds-appshell` `overflow:hidden` | İç kaydırma kapsayıcısı şart (Zihinden `af87a22`). |
| R18 | `user-scalable=no` (Kesir'de var) | Koyma (WCAG 1.4.4). |
| R19 | StrictMode dev'de efektleri iki kez çalıştırır | Otomatik okuma efektte ise `speak` zaten önce `cancel()` eder; yine de kullanıcı jestine bağla. |

### 6.4 İçerik / dil / ses

| # | Tuzak | Önlem |
|---|---|---|
| R20 | ASCII `-` / en-tire `–` ile yazılmış işlem TTS'te kaybolur ya da duraklamaya döner | İçerikte `−` (U+2212), `×`, `÷`; birim testle `toSpeech` çıktısını denetle (§2.4). |
| R21 | Kurmancî'de gerçek ses yok → 🔊 gizli → sözel problemde okuma desteği yok | Kısa cümle + güçlü görsel şema; ses klibi kararı ayrı (lisans) (§2.5). |
| R22 | Boş ku/en sözlükleri (Zihinden `ku:{}, en:{}`) sessizce Türkçeye düşer | Test: her anahtar ve her etkinlik metni 3 dilde dolu (§2.9). Kesir'in indeks-tabanlı çeviri anahtarı kullanılmaz. |
| R23 | FerMat dışı Kurmancî terim | `fermat-terms.ku.js` bağlayıcı; `jimar`/`dabeş` gibi yasaklı biçimler yok (bkz. memory FerMat standardı). |
| R24 | Yörüngede `en.tool` değiştirmek çalışma yapraklarının materyal vaadini bozar (4 ayrı TOOL_* kopyası) | Yalnız `extra` rozet alanı (§3.8). |
| R25 | Rehber `dokunsay_bagi` HTML kaçışlı → `<a>` çalışmaz | `arac` alanı + `build-rehber.mjs` buton satırı (§3.9). |
| R26 | Sahte zorluk (sayıyı büyütüp diff artırmak) | Basamak farkı görev biçiminden (§1.6.1). |
| R27 | Uydurma MEB kodu / atıf | Yalnız doğrulanmış kod ve gerçek kaynak; emin değilsen boş. |

### 6.5 İnceleme sırasında görülen, bu işin dışında kalan sürüklenmeler (ayrı iş önerisi)

- **ZihindenAritmetik** şu listelerde yok: `run-all.js`, `dev-all.js`, `verify.js`, `appIcon.js`, kök `README.md`, `llms.txt`, STANDARDS §2.9 port tablosu. Kök neden: listeler `apps.js`'ten beslenmiyor. Kalıcı çözüm: üç betik de `import { APPS } from '../apps.js'` (port bilgisi için `APPS`'e `port` alanı ekle ya da `tools.js devUrl`'den türet).
- Zihinden paket adı `"uygulama"`, React 19/Vite 8 — `verify.js`'e eklenirse CI kırılır; önce ad düzeltilmeli.
- `package.json` `verify:schema` → **olmayan** `verify-schema.js`'i çağırıyor.
- Yörünge dizini (`launcher/public/yorunge/index.html`) "Bireysel" görünüm `window.HCMO_USER`'a bakıyor; mevcut `numap-gate.js` bu değişkeni **tanımlamıyor** → öğrenci-anahtarlı kayıt her zaman "local"a düşüyor olabilir.
- `_platform/scripts/deploy-dist.mjs:13` düz metin paylaşımlı sır içeriyor (herkese açık depo) — döndürülmeli ve çevre değişkenine taşınmalı.
- `site-header.mjs:8` ve `useAuthSlot`/bellek notlarında `#hcmoAuth` / `hcmo-gate.js` anlatımı eskidi (gerçek: `#numapAuth` / `numap-gate.js`).

---

## 7. UYGULAMA SIRASI (tek geçişlik kontrol listesi)

**A. İskelet (araç klasörü)**
1. [ ] `DokunSayProblem/` oluştur: `package.json` (§1.3), `vite.config.ts` (§1.4, port 3009, base `/DokunSayProblem/`), `tsconfig.json` (§1.5), `index.html` (§1.6), `.gitignore`.
2. [ ] Platform dosyaları: `LICENSE`, `.editorconfig`, `eslint.config.js` (shared'dan), `README.md` + `PRIVACY.md` (şablonlardan, 3 dilli kapsam, Web Speech beyanı, yerel depolama anahtarları `dokunsay:problem:*`).
3. [ ] `public/favicon.svg` (accent gradyan kare + 🧩 ya da SVG şema simgesi).
4. [ ] `src/main.tsx` (§2.1), `state/A11yContext.tsx` (Zihinden kopyası), `i18n/` (tr/ku/en DOLU, i18n-base birleşimi), `lib/storage.ts`, `lib/speech.ts`.
5. [ ] `constants/activities.ts` (§4.2), `misconceptions.ts`, `schemas.ts`; `components/common/DiffBadge.tsx` (Geo portu).
6. [ ] `npm install` → `package-lock.json` commit.

**B. Paylaşılan kabuk**
7. [ ] `palette.js:113` + `palette.d.ts:45` (`problem`), `appIcon.js:25,35`.
8. [ ] (TS strict) eksik `.d.ts` shim'leri.

**C. Kayıt**
9. [ ] `apps.js:30`.
10. [ ] `tools.js:314` yeni nesne + `TOOL_CATEGORIES` 5 dil (`:319/325/331/337/343`).
11. [ ] `tools.test.js:6-7, :12, :41, :47`.
12. [ ] `App.jsx:87` → `TOOLS.length`.
13. [ ] Kök `package.json` `dev:problem`; `run-all.js`, `dev-all.js`, `verify.js` listeleri.
14. [ ] `deploy-cloudflare.yml:30`, `deploy.yml:81`.

**D. İçerik bağlantıları**
15. [ ] `build-yorunge.mjs` TOOL_PATH/TOOL_NAME + `extra` rozet desteği; `enrich-add.js`, `enrich-compose.js`, `enrich-multdiv.js` ilgili düzeylere `extra` (§3.8); `node _platform/scripts/build-yorunge.mjs`; `launcher/public/yorunge/**` commit.
16. [ ] `rehber-sections.json` `sema` → `arac` + `dokunsay_bagi` cümlesi; `build-rehber.mjs:106` buton satırı + CSS.
17. [ ] `llms.txt:3,18`, kök `README.md`, `_platform/README.md`, `STANDARDS.md` (Kapsam, §1.2, §2.3, §2.9), `docs/CHANGELOG.md`.

**E. Doğrulama**
18. [ ] `cd DokunSayProblem; npm run build` (tsc + vite temiz) · `npm test` (şema: `validateActivities` + 3 dil + diff 1–5 dağılımı + yanılgı ≥3 & `src` + `toSpeech` işlem sözcüğü korunumu).
19. [ ] `cd _platform/launcher; npm test` (tools + i18n testleri yeşil).
20. [ ] `node _platform/scripts/verify.js` → `DokunSayProblem ✅`.
21. [ ] Dev: `npm run dev:launcher` + `npm run dev:problem` → `http://localhost:3000` kartı → `:3009` açılıyor; "Menüye Dön" → 3000.
22. [ ] Tam derleme (PowerShell): `$env:SITE_BASE='/'; node _platform/scripts/build-site.js` → `npx serve dist-site -l 8080` → `/DokunSayProblem/` açılıyor, `index.html`'de `numap-gate.js` var ve `NUMAP_GATE_MODE="chip"` **yok** (gate), `sitemap.xml`'de adres var, `/rehber/` ve `/yorunge/add/` rozetleri `/DokunSayProblem/#…`'e gidiyor.
23. [ ] Elle kabul (proaktif, tüm akış): dil TR→KU→EN'de **problem metni** değişiyor; KU'da 🔊 gizli; A11y 7 anahtarın her biri görünür etki; renk körü modunda şema parçaları desenle ayırt ediliyor; 375px genişlikte yatay kaydırma yok; klavyeyle tam akış (Tab, Enter, Esc, Ctrl+Z); ekran okuyucu duyuruları (`aria-live`).
24. [ ] Dağıtım: `main`'e push → CI (`deploy-cloudflare.yml`). Elle dağıtım yalnız R7 denetiminden sonra.
