# Mevcut Uygulamaları Platform Standartlarına Taşıma Rehberi

Bu rehber, mevcut bir DokunSay uygulamasını yeni platform standartlarına aşamalı olarak geçirmek için kullanılır. **Hiçbir adım zorunlu değildir** — "zarar vermeden iyileştirme" felsefesine uyulur.

## 0. Hazırlık

```bash
# Uygulamanın bağımsız çalıştığını doğrula
cd DokunSay<Modul>
npm install
npm run dev     # → tarayıcıda aç ve golden path'i test et
npm run build
```

## 1. Paylaşılan Palete Geçiş (İsteğe Bağlı)

**Neden:** Tüm uygulamalar aynı sıcak krem paleti kullansın, gelecekte tek yerden değişebilsin.

**Nasıl:**
```javascript
// src/constants/palette.js içine
import { COLORS, GRADIENTS, SHADOWS, RADII, SPACING, TOUCH } from '../../_platform/shared/palette.js';

// Mevcut P objesini COLORS ile eşle
export const P = {
  bg: COLORS.bg,
  accent: COLORS.accent,
  // ...
};
```

**Risk:** Düşük — sadece değerleri eşitler, davranış değişmez.

## 2. Ortak TTS Wrapper (İsteğe Bağlı)

**Neden:** Tüm uygulamaların TTS davranışı (rate, pitch, dil haritası) tutarlı olsun.

```javascript
// src/utils/speech.js yerine:
export { speak, cancel, setTTSEnabled } from '../../_platform/shared/tts.js';
```

**Risk:** Orta — mevcut `speak()` imza farklıysa dikkat.

## 3. Ortak Audio SFX (İsteğe Bağlı)

```javascript
// src/utils/audio.js yerine:
export { sfx, playTone, setAudioEnabled } from '../../_platform/shared/audio.js';
```

## 4. Ortak localStorage Namespace

**Neden:** Anahtarlar çakışmaz, dışa aktarma/içe aktarma standartlaşır.

```javascript
// Eski:
localStorage.setItem('progress', JSON.stringify(data));

// Yeni:
import { saveProgress, loadProgress } from '../../_platform/shared/storage.js';
saveProgress('bar', activityId, data);
loadProgress('bar');
```

**Risk:** Yüksek — mevcut kaydedilmiş veriler görünmez olur. Bir kerelik migrasyon yaz.

## 5. Ortak i18n Base

**Neden:** Menü/buton/geri bildirim çevirileri tekrarlanmasın.

```javascript
// src/i18n/index.js
import { createI18n } from '../../_platform/shared/i18n-base.js';

const i18n = createI18n({
  tr: { bar_rods: 'Çubuklar', bar_chips: 'Pullar' },
  ku: { bar_rods: 'Sing', bar_chips: 'Pul' },
  en: { bar_rods: 'Rods', bar_chips: 'Chips' },
});

export const t = (lang, key) => i18n.get(lang, key);
```

**Risk:** Düşük — ortak anahtarlar zaten platform genelinde aynı çeviriye sahip.

## 6. package.json Uyumlanması

- Paket adı: `dokunsay-<modul>`
- `author: "Prof. Dr. Yılmaz Mutlu"`
- `license: "MIT"`
- `description`: 1 cümlelik açıklama

## 7. ESLint Kurulumu

```bash
npm install --save-dev eslint @eslint/js
```

`eslint.config.js` zaten mevcut. `npm run lint` çalıştır.

## 8. Prettier (İsteğe Bağlı)

```bash
npm install --save-dev prettier
cp ../_platform/shared/.prettierrc.json .
npx prettier --check src/
```

**Mevcut kodu formatlamadan önce** commit et, sonra `prettier --write` çalıştır, diff'i gözden geçir.

## 9. Launcher Kaydı

Uygulama artık launcher'dan açılabilir hale gelsin:

`_platform/launcher/src/tools.js` içinde ilgili tool nesnesinin:
- `devUrl` (localhost portu) — doğru
- `prodPath` (üretim URL'si) — doğru
- `folder` (klasör adı) — doğru

olduğundan emin ol.

## 10. Test (Opsiyonel)

Vitest kurulumu:

```bash
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom jsdom
```

İlk testler: `utils/*.test.js` (saf fonksiyonlar).

---

## Kontrol Listesi (Tamamlandığında İşaretle)

- [ ] `npm run build` başarılı
- [ ] `npm run dev` ile uygulama açılıyor, golden path çalışıyor
- [ ] `npm run lint` uyarısız (veya yalnızca warn)
- [ ] README.md var
- [ ] LICENSE var
- [ ] package.json `dokunsay-<modul>` adında
- [ ] `eslint.config.js` var
- [ ] `.editorconfig` var
- [ ] Launcher'dan açılabiliyor
- [ ] Diskalkuli + renk körü + yüksek kontrast modları çalışıyor (opsiyonel)
- [ ] 3 dil (tr, ku, en) opsiyonu var (opsiyonel)

---

## Sorun Giderme

**Sorun:** `npm install` sırasında peer dep uyarısı
**Çözüm:** React sürümü platform ile uyumsuz. `package.json`'da `react: ^18.3.1` olmalı.

**Sorun:** `import` path'leri `../_platform/shared/` çalışmıyor
**Çözüm:** Her uygulama ayrı npm projesi olduğundan, `_platform/shared`'ı npm paketi gibi bağla (pnpm workspace veya npm link), **veya** dosyaları uygulamanın kendi `src/`'sine kopyala.

**Sorun:** Launcher'dan araç açılmıyor
**Çözüm:** Dev modda her araç kendi portunda çalışıyor olmalı (paralel terminal). Prod'da tüm araçlar aynı domain altında alt dizin olarak sunulmalı.
