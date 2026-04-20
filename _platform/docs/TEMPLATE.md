# DokunSay Platform — Uygulama Şablonu (Göç Rehberi)

> **Pilot:** DokunSay Bar bu şablonun canlı referansıdır. Aşağıdaki adımları sırayla bir uygulamada uygularsan `_platform/shared/` kaynaklarını kullanır hale gelir ve platformda "tek elden çıkmış" hissine katkı sağlar.

## Neyi Neyle Değiştiriyoruz?

| Eski (uygulamaya özgü) | Yeni (platform ortak) | Kazanım |
|------|-------|---------|
| `services/audioService.ts` | `@shared/audio.js` wrapper | Aynı sfx tonları 7 uygulamada tutarlı |
| `services/speechService.ts` | `@shared/tts.js` wrapper | 5 dil haritası tek yerde |
| `constants/colors.ts` sabitleri | `@shared/palette.js` tokenleri | Renk paleti platform genelinde aynı |
| Kendi Nunito yükleme | `@shared/typography.css` veya `index.html` Google Fonts linki | Tek tipografi |
| Kendi a11y state'in | `@shared/a11y.js` + `A11yContext` | Aynı klavye kısayolları + toggle UI |
| Ortak i18n anahtarları | `@shared/i18n-base.js` + `@shared/fermat-terms.ku.js` | Menü/buton/geri bildirim sözcükleri aynı |

## 1. Vite Alias (Hem JS hem TS)

`vite.config.(js|ts)`:
```ts
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  base: "/DokunSay<Modul>/",
  resolve: {
    alias: {
      "@shared": path.resolve(__dirname, "../_platform/shared"),
    },
  },
  server: {
    port: <PORT>,         // 3001-3007 (STANDARDS.md)
    strictPort: true,
    host: true,
    fs: { allow: [path.resolve(__dirname, "..")] },  // sibling klasörlere erişim
  },
});
```

## 2. TypeScript (yalnızca TS kullanan uygulamalar)

`tsconfig.json` compilerOptions'a:
```json
{
  "allowJs": true,
  "baseUrl": ".",
  "paths": {
    "@shared/*": ["../_platform/shared/*"]
  }
}
```
ve `include`:
```json
"include": ["src", "../_platform/shared/**/*.d.ts"]
```

Shared modüllerin `.d.ts` tip bildirimleri zaten `_platform/shared/*.d.ts` altında.

## 3. Nunito Font (index.html)

`<head>` içine:
```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Nunito:wght@600;700;800;900&display=swap" rel="stylesheet" />
```
Alternatif: `import "@shared/typography.css";` (main.jsx/main.tsx).

## 4. Audio Service (pilot: Bar)

**TS örneği** (`src/services/audioService.ts`):
```ts
import { playTone as p, sfx as s, setAudioEnabled, isAudioEnabled } from "@shared/audio.js";
export const playTone = p;
export const sfx = s;
export { setAudioEnabled, isAudioEnabled };
```

**JS örneği** (`src/utils/audio.js`):
```js
export { playTone, sfx, setAudioEnabled } from "@shared/audio.js";
```

Var olan `sfx.snap/place/flip/rotate/remove/note/correct/wrong/group/break/pop/countNote` API'si korunur.

## 5. Speech Service

**TS örneği** (`src/services/speechService.ts`):
```ts
import { speak as p, cancel, setTTSEnabled } from "@shared/tts.js";
import type { Language } from "../types";

export function speak(text: string, lang: Language, rate = 0.85) {
  p(text, lang, { rate });
}
export { cancel as cancelSpeech, setTTSEnabled };
```

**JS örneği** (`src/utils/speech.js`):
```js
import { speak as platformSpeak, cancel } from "@shared/tts.js";
export const speak = (text, lang = "tr", rate = 0.85) => platformSpeak(text, lang, { rate });
export { cancel };
```

## 6. Palet Entegrasyonu

```ts
import { COLORS } from "@shared/palette.js";

// Uygulamanın accent'ini platform paletinden al
export const ACCENT = {
  primary: COLORS.accent,       // #f59e0b (Bar için)
  // veya kendi accent'ini kullan:
  // primary: "#8b5cf6"          // Tam için (mor)
};

// Bar/Chip gibi app-özel renkleri koru
export const ROD_GRADIENT = { ... };
```

Her uygulama **kendi accent rengini** tutmakta özgür (Bar altın, Tam mor, Clock yeşil, Kesir kırmızı, Basamak mavi, Geo turkuaz, Veri pembe). Platform paletinin bg/text/border/shadow jetonları tüm uygulamalarda aynı kalır.

## 7. A11y Context (klavye + toggle'lar)

Her uygulama için `src/state/A11yContext.(tsx|jsx)`:

```tsx
import { A11yProvider, useA11y } from "./state/A11yContext";
```

`main.(jsx|tsx)`:
```tsx
<A11yProvider>
  { /* diğer provider'lar */ }
  <App />
</A11yProvider>
```

Herhangi bir bileşende:
```tsx
const { prefs, toggle, announce, installShortcuts } = useA11y();

useEffect(() => {
  return installShortcuts({
    onUndo: handleUndo,
    onRedo: handleRedo,
    onDelete: handleDelete,
    onSpeak: () => speak(currentText, lang),
    onEscape: closeModal,
  });
}, [handleUndo, /* ... */]);

// Header'da toggle:
<button onClick={() => toggle("dyscalculia")} aria-pressed={prefs.dyscalculia}>
  🧠 Diskalkuli Modu
</button>
```

Bu yaklaşım `<html>` kökünde `data-dyscalculia="on"`, `data-contrast="high"` gibi attribute'lar ayarlar. Tüm uygulamalar CSS'lerinde bu attribute'lara bağlı tema değişkenlerini aynı şekilde kullanabilir.

## 8. i18n — FerMat Hizalaması

**Mevcut uygulamanın ku.js / ku bloğu** içindeki matematik terimleri `@shared/fermat-terms.ku.js`'e göre düzenle:
- `hesab` → `kirarî` (işlem)
- `parçe` → `parjimar` (kesir)
- `kêlek` → `hêl` (kenar)
- `guç` → `kujî` (açı)
- `nîvhevî` → `hevseng` (simetri)
- `dorhêl` → `rûdor` (çevre)
- `kom` (toplama) → `zêdekirin`
- `derxistin` → `kemkirin`
- `parvekirin` → `parkirin`

Bkz: [`_platform/shared/FERMAT.ku.md`](../shared/FERMAT.ku.md)

**Ortak UI anahtarları** (menu, btn, feedback) için uygulamada eksikler varsa `@shared/i18n-base.js`'ten ekle.

## 9. Adım Sırası (Önerilen)

1. [ ] `vite.config` alias + port + fs.allow
2. [ ] (TS ise) `tsconfig.json` paths + allowJs
3. [ ] `index.html` Nunito
4. [ ] `audioService` / `audio.js` wrapper
5. [ ] `speechService` / `speech.js` wrapper
6. [ ] `colors.ts` / palette.js köprüsü
7. [ ] `A11yProvider` `main.(jsx|tsx)` sarmalaması
8. [ ] Header'a toggle UI (diskalkuli / kontrast / TTS / SFX / renk körü)
9. [ ] `installShortcuts` app içinde en az bir kere (undo/redo/delete/escape)
10. [ ] Kurmancî FerMat hizalaması
11. [ ] `npm run build` geçmeli
12. [ ] Manuel test: ana etkileşim + a11y toggle'ları

## Her Adım Sonrası

`npm run build` başarılı → devam.
`npm run dev` → elle test (ana akış bozulmamalı).

## Pilot Referans

DokunSayBar'da yukarıdaki adımların hepsi uygulandı. Diff'e bakmak için:
- `DokunSayBar/vite.config.ts`
- `DokunSayBar/tsconfig.json`
- `DokunSayBar/index.html`
- `DokunSayBar/src/main.tsx`
- `DokunSayBar/src/state/A11yContext.tsx`
- `DokunSayBar/src/services/audioService.ts`
- `DokunSayBar/src/services/speechService.ts`
- `DokunSayBar/src/constants/colors.ts`

## Şimdi Sırada

Uygulanmamış 6 uygulama (Basamak, Clock, Kesir, Tam, Geo, Veri). Her biri için ~1-2 saat göç çalışması yeterli. Her birinden sonra uyum denetleyicisi (`node _platform/scripts/verify.js`) ve `npm run build` geçmeli.
