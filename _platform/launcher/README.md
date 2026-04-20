# DokunSay Platform — Ana Menü (Launcher)

> 7 DokunSay matematik öğretim aracını tek çatı altında birleştiren platform ana menüsü.

---

## Özellikler

- **7 aracı tek ekranda** listeler — ikon, açıklama, hedef yaş, pedagojik yaklaşım
- **Kategori filtresi** — Sayı & İşlem / Ölçme / Geometri / Veri
- **Arama** — araç adı, konu veya açıklamaya göre
- **3 dil desteği** (TR, KU, EN)
- **Diskalkuli modu** — font büyütme
- **Yüksek kontrast modu** — WCAG AA
- **Yerel tercih kaydı** — localStorage (`dokunsay:platform:prefs`)
- **Araç açma:**
  - Geliştirme: tool.devUrl (ör. `http://localhost:3001`)
  - Üretim: tool.prodPath (ör. `/DokunSayBar/`)

## Kurulum ve Çalıştırma

```bash
cd _platform/launcher
npm install
npm run dev
```

Tarayıcıda `http://localhost:3000` açılır.

## Dağıtım

```bash
npm run build
npm run preview
```

Üretim modunda araçlar `/DokunSay<Modul>/` alt dizinlerinden sunulmalıdır.

## Yapılandırma

Araç listesi: `src/tools.js`
Dil dosyaları: `src/i18n.js`
Stil: `src/styles.css`

Yeni bir araç eklemek için `TOOLS` dizisine yeni bir nesne ekleyin:

```js
{
  id: 'yeni',
  name: { tr: '...', ku: '...', en: '...' },
  subtitle: { tr: '...', ku: '...', en: '...' },
  description: { tr: '...', ku: '...', en: '...' },
  icon: '🎲',
  color: '#6366f1',
  ageRange: '8-12',
  topics: { tr: [...], ku: [...], en: [...] },
  framework: '...',
  devUrl: 'http://localhost:3008',
  prodPath: '/DokunSayYeni/',
  folder: 'DokunSayYeni',
  status: 'beta',
}
```

## Platform Standartları

Bkz. [../STANDARDS.md](../STANDARDS.md)

## Lisans

MIT · Prof. Dr. Yılmaz Mutlu · 2024-2026
