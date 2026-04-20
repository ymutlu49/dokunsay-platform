# DokunSay Clock (Saat)

> İnteraktif analog + dijital saatle zaman okuma ve kavramı öğretimi.

**DokunSay Matematik Öğretim Araçları Platformu**'nun bir parçasıdır.

---

## Pedagojik Yaklaşım

DokunSay Clock, saat okumayı **parça-bütün keşfi** üzerinden öğretir. Öğrenciler kadran, sayılar ve kolları tek tek yerleştirip kendi saatlerini inşa eder. Analog → dijital → sözel üçlü temsil eşgüdümüyle zaman kavramı somutlaşır.

- **Somut:** Kadran parçalarını (¼ dilimler), sayıları, kolları sürükle-bırak.
- **Yarı-soyut:** Dişli mekanizması — dakika kolu döndükçe saat kolu otomatik hareket eder.
- **Soyut:** Türkçe sözel okuma ("Saat 3 buçuk"), dijital gösterge (03:30), dakika hesaplaması.

**Dayanılan Çerçeveler:** Piaget zaman kavramı gelişimi, CRA, parça-bütün ilişkisi.

**Hedef Kitle:** 1-3. sınıf (6-9 yaş) ve diskalkuli öğrencileri.

---

## Özellikler

- **Saati inşa et** — kadran parçaları, sayılar, kollar ayrı ayrı sürüklenebilir
- **Dişli mekanizması** — dakika göstergesi saatle eşgüdümlü döner
- **5 ders planı** (Saati tanıma → kavram yanılgıları)
- **Oyunlar:**
  - Saati Ayarla (4 zorluk seviyesi: tam saat → 5 dakika)
  - Eşleştirme (Analog ↔ Dijital ↔ Sözel)
  - Geçen Süre (iki zaman arasındaki fark)
  - Günlük Rutin (08:00 = kahvaltı gibi bağlamsal sorular)
- **Sesli okuma** — saat okunuşu (tr-TR, oran 0.8)
- **Çizim aracı** — kalem, silgi, vurgulayıcı
- **PWA desteği** — çevrimdışı çalışır, güncelleme bildirimi
- **Zoom** — görsel büyütme (diskalkuli desteği)

---

## Dil Desteği

🇹🇷 Türkçe (ana dil)
> Çoklu dil desteği standart platform i18n yapısına geçirilmek üzere planlanmıştır.

---

## Kurulum

```bash
npm install
```

## Geliştirme

```bash
npm run dev
```

Tarayıcıda `http://localhost:3003` adresine git.

## Dağıtım

```bash
npm run build
npm run preview
```

---

## Mimari Özet

```
src/
├── main.jsx                    # Shell wrapper (PWA)
├── Shell.jsx                   # Service Worker + update banner
├── App.jsx                     # Ana uygulama (464 satır)
└── useServiceWorker.js         # PWA hook
```

**Dil:** JavaScript (JSX)
**Ana mantık:**
- `timeTr(h, m)` — Türkçe sözel: "Saat 3 buçuk"
- `timeDig(h, m)` — Dijital: "03:30"
- `mA = min * 6`, `hA = (hour % 12) * 30 + min * 0.5` (dişli mekanizm)

---

## Platform Standartları

Bu uygulama [DokunSay Platform Standartları](../_platform/STANDARDS.md) belgesine uygun geliştirilir. Modülerleştirme ve çoklu dil desteği roadmap'te.

## Lisans

MIT — bkz. [LICENSE](./LICENSE)

## Yazar

**Prof. Dr. Yılmaz Mutlu** · DokunSay Matematik Öğretim Araçları · 2024-2026
