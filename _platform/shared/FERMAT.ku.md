# FerMat Kurmancî Matematik Terimleri — Platform Referansı

**Kaynak:** [FerMat — Ferhenga Matematîkê ya Berfireh](../../FerMat/Ferhenga%20Matematik/ferhenga_matematik_dictionary.txt)
**Yazar:** Prof. Dr. Yılmaz Mutlu
**Kapsam:** 394 terim, 10 kategori (Kurmancî birincil, Soranî varyant, Türkçe+İngilizce karşılık)

Bu belge, DokunSay platformundaki tüm uygulamalar için **kanonik Kurmancî matematik terimlerini** listeler. Tüm yeni çeviri veya revizyon bu sözlüğe uymalıdır.

Kanonik JavaScript modülü: [`fermat-terms.ku.js`](./fermat-terms.ku.js)

---

## Neden Standardizasyon?

Eskiden her uygulama kendi Kurmancî terimlerini kullanıyordu — bu tutarsızlığa yol açtı:

| Kavram | Eski (farklı apps) | FerMat Standardı |
|--------|-------------------|------------------|
| kenar  | `kêlek` (Geo), `çubik` (Kesir), `hêl` (bazı yerler) | **`hêl`** |
| açı    | `guç` (Geo)                | **`kujî`** (goşe = köşe) |
| simetri| `nîvhevî` (Geo)           | **`hevseng`** |
| çevre  | `dorhêl` (Geo)            | **`rûdor`** |
| kesir  | `parjimar` ✓ veya "parçe"  | **`parjimar`** |
| toplama| `kom` veya `zêdekirin` ✓  | **`zêdekirin`** |
| çıkarma| `kemkirin` ✓              | **`kemkirin`** |
| grafik | `nexşe` ✓                 | **`nexşe`** |

---

## Temel Terimler (Sık Kullanılan)

### Hejmar (Sayı)
| Kurmancî | Türkçe | English |
|----------|--------|---------|
| sifir    | sıfır  | zero    |
| yek, du, sê, çar, pênc, şeş, heft, heşt, neh, deh | 1-10 | 1-10 |
| bîst, sî, çil, pêncî, şêst, heftê, heştê, not | 20, 30, 40, 50, 60, 70, 80, 90 | same |
| sed | yüz | hundred |
| hezar | bin | thousand |
| hejmar | sayı | number |
| jimare | rakam | digit |
| hejmara xwezayî | doğal sayı | natural number |
| hejmara tam | tam sayı | integer |
| hejmara erênî / neyînî | pozitif / negatif sayı | positive / negative |
| hejmara cot / fer | çift / tek sayı | even / odd |

### Kirarî (İşlem)
| Kurmancî | Türkçe | Sembol |
|----------|--------|--------|
| zêdekirin | toplama | + |
| kemkirin | çıkarma | − |
| carkirin | çarpma | × |
| parkirin | bölme | ÷ |
| zêdok | toplam | — |
| kemok | fark | — |
| carandok | çarpım | — |
| paran | bölüm | — |
| jêma | kalan | — |
| encam | sonuç | — |
| wekhevî | eşittir | = |
| yeksan / wekhev | eşit | — |

### Parjimar (Kesir)
| Kurmancî | Türkçe |
|----------|--------|
| parjimar | kesir |
| par | pay |
| tevpar | payda |
| gişt | bütün |
| nîv | yarım |
| çarek | çeyrek |
| parjimara hevkêş | denk kesir |
| parjimara sade | basit kesir |
| parjimara nesade | bileşik kesir |
| sadekirin | sadeleştirme |
| hejmara dehane | ondalık sayı |
| sedî | yüzde |
| rêje | oran |

### Cîyometrî (Geometri)
| Kurmancî | Türkçe |
|----------|--------|
| cîyometrî | geometri |
| xal | nokta |
| xêz | doğru |
| xêzik | doğru parçası |
| tîr | ışın |
| **kujî** | açı |
| pîle | derece |
| teşe | şekil |
| gilover | daire |
| gilovêr | çember |
| navend | merkez |
| tîrêj | yarıçap |
| pûtik | çap |
| sêgoşe | üçgen |
| çarçik | dikdörtgen |
| kare | kare |
| çargoşe | dörtgen |
| pirgoşe | çokgen |
| **hêl** | kenar |
| **goşe** | köşe |
| rûber | alan |
| **rûdor** | çevre |
| **hevseng** | simetri |
| paralel | paralel |
| lihevbirî rast | dik |

### Pîvandin (Ölçme)
| Kurmancî | Türkçe |
|----------|--------|
| pîvandin | ölçme |
| yeke | birim |
| dirêjahî | uzunluk |
| firehî | genişlik |
| bilindahî | yükseklik |
| qûdî | derinlik |
| dûrahî | uzaklık |
| giranî | ağırlık |
| qebare | hacim |
| dem | zaman |
| demjimêr | saat |
| deqe | dakika |
| saniye | saniye |
| roj | gün |
| hefte | hafta |
| meh | ay |
| sal | yıl |
| germahî | sıcaklık |
| şanîdera demjimêrê | akrep |
| şanîdera deqeyê | yelkovan |

### Amarî û Îhtîmal (İstatistik & Olasılık)
| Kurmancî | Türkçe |
|----------|--------|
| amarî | istatistik |
| dane | veri |
| nexşe | grafik |
| nexşeya stûnî | sütun grafiği |
| nexşeya xêzkirî | çizgi grafiği |
| nexşeya gilover | daire grafiği |
| nexşeya wêneyî | resim grafiği |
| tabloya dane | veri tablosu |
| navgîn | ortalama (aritmetik) |
| navînok | medyan |
| birawird | mod |
| rêze | açıklık (ranj) |
| îhtîmal | olasılık |
| bûyer | olay |

### Aljebir (Cebir)
| Kurmancî | Türkçe |
|----------|--------|
| aljebir | cebir |
| guhêrbar | değişken |
| domdar | sabit |
| hevkêşe | denklem |
| term | terim |
| hêz | üs |
| radîk | kök |

### Hizirkirina Matematîkî (Matematiksel Düşünme)
| Kurmancî | Türkçe |
|----------|--------|
| pirsgirêk | problem |
| çareserî | çözüm |
| bersiv | cevap |
| texmîn | tahmin |
| nêzandin | yuvarlama |
| qaîde | kural |
| berhevdan | karşılaştırma |
| kontrol | kontrol |
| mînak | örnek |

### Peyv (İfadeler)
| Kurmancî | Türkçe |
|----------|--------|
| çend? | kaç? |
| çiqas? | ne kadar? |
| bi giştî | toplam |
| dimîne | kalan |
| ji... zêdetir | ...den fazla |
| ji... kêmtir | ...den az |
| her yek | her biri |
| bi hev re | birlikte |
| herî kêm / herî zêde | en az / en çok |
| nêzîkî | yaklaşık |
| tam | tam olarak |
| berevajî | tersi |

---

## Kullanım — Kodda

```javascript
// Bir uygulama JS dosyasında
import { ku, term } from '../../_platform/shared/fermat-terms.ku.js';

// Tek terim
const add = ku('op_addition');          // → 'zêdekirin'
const fraction = ku('fr_fraction');     // → 'parjimar'

// Üç dilde
const opAdd = term('op_addition');
// → { ku: 'zêdekirin', tr: 'toplama', en: 'addition' }
```

Eklenecek yeni bir matematik terimi varsa FerMat sözlüğüne ekle, sonra `fermat-terms.ku.js`'e senkronize et.

---

## Unutulmaması Gerekenler

1. **`kujî` ve `goşe` farklıdır** — `kujî` = açı (angle), `goşe` = köşe/tepe (vertex/corner)
2. **`parjimar` ≠ `parçe`** — `parjimar` matematiksel terim, `parçe` genel anlamda parça
3. **`zêdekirin` ≠ `kom`** — `zêdekirin` toplama işlemi, `kom` küme/grup anlamına gelir
4. **`hejmar` ≠ `jimare`** — `hejmar` = sayı (kavram), `jimare` = rakam (0-9 sembolü)
5. **Telaffuz:** Nunito font Kurmancî aksanlı karakterleri (î, û, ê, ş, ç) destekler.

---

## Mevcut Durum (2026-04-20)

| Uygulama | Kurmancî Dosyası | FerMat Uyumu |
|----------|-----------------|-----------|
| DokunSayBar | `src/services/i18nService.ts` | Kısmi — terim azlığı |
| DokunSayBasamak | `src/i18n/ku.js` | İyi — yer değeri terimleri tutarlı |
| DokunSayClock | `src/i18n/ku.js` | **Yenilendi** ✓ |
| DokunSayKesir | `src/i18n/ku.js` | Çok iyi — parjimar/par/tevpar kullanılıyor |
| DokunSayTam | `src/i18n/ku.js` | **Yenilendi** ✓ |
| Dokunsay-geo | `src/constants/i18n.js` | **Yenilendi** ✓ (hêl, kujî, hevseng, rûdor) |
| Dokunsay-veri-app | `src/data/constants.js` | İyi — navgîn, dane kullanılıyor |

## Kaynaklar

### Matematik terminolojisi (birincil)
- `FerMat/Ferhenga Matematik/ferhenga_matematik_dictionary.txt` — 394 terim
- `FerMat/FerMat_Ferhenga_Matematike.pdf` — kapsamlı sözlük
- `FerMat/Ferhenga Matematik/01-10_*.docx` — kategorili bölümler (hejmar, kirarî, parjimar, cîyometrî, pîvandin, kirariya daneyan, dibetî, têgehên perwerdeyî/cihî/cebîrî)

### Kurmancî gramer ve yazım (ikincil)
- `Lutke/LUTKE_v1/lutke_flutter_project/Pirtûkên Kurdî/` — kapsamlı Kurmancî kitapları:
  - `Turkce-izahli-Kurtce-grameri-Kurmancca-lehcesi.pdf` — Türkçe açıklamalı Kurmancî grameri
  - `Fêrkera Kurdî.pdf` — öğretici gramer
  - `Emir_Celadet_Bedirxan.pdf` — klasik Celadet Bedirxan gramer referansı
  - `kurmanji_complete.pdf` — kapsamlı Kurmancî referansı
  - `osman-aslanoglu-kurtce-dil-kartlari.pdf` — dil kartları
- `Lutke/LUTKE_v1/lutke_flutter_project/assets/translations/ku.json` — çocuk-dostu UI metinleri için stil referansı

### Terminoloji tutarlılığı — LUTKE ile uyum

FerMat matematik terimleri birinci öncelik. Genel UI metinleri (buton, navigasyon, geri bildirim) için LUTKE üslubunu model alıyoruz:

| Rol | Kaynak | Örnek |
|-----|--------|-------|
| Matematiksel terim | FerMat | `parjimar`, `kujî`, `zêdekirin` |
| UI düğmesi | LUTKE tarzı | `Dîsa biceribîne`, `Baş`, `Dijwar`, `Hêsan` |
| Geri bildirim | LUTKE + DokunSay | `Rast!`, `Çewt`, `Aferin!`, `Çeleng!` |
| Gezinme | LUTKE tarzı | `Mîhengên`, `Derkeve`, `Têkeve`, `Berdewam bike` |
