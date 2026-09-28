# MatBoard — sanal manipülatif matı (DESIGN §12)

Genel, **kontrollü** bir React bileşeni: durum dışarıda tutulur, her eylem `onChange(next)` ve
`onEvent(ev)` ile bildirilir. Canlandır adımı (`src/flow/steps/ActRunner.tsx`), hesap çekmecesi
(`CalcDrawer` → "Nesneler") ve öğretmen araçları (projeksiyon, çalışma kâğıdı…) aynı motoru kullanabilir.

```tsx
import { MatBoard } from './mat/MatBoard';
import { unitsFor, type MatState, type MatZone } from './mat/matState';

const zones: MatZone[] = [
  { id: 'ela', label: 'Ela', kind: 'pile', tone: 1, unitLabel: 'kalem' },
  { id: 'ali', label: 'Ali', kind: 'pile', tone: 2, unitLabel: 'kalem', fillFrom: 'ela' },
];
const [state, setState] = useState<MatState>({});
<MatBoard zones={zones} state={state} onChange={setState} units={unitsFor(18)} onEvent={(e) => log(e)} />;
```

## Props
| Prop | Tür | Açıklama |
|---|---|---|
| `zones` | `MatZone[]` | Görünen bölgeler (sıra = ekran sırası). |
| `state` | `MatState` | `{ [zoneId]: { h, t, o, groups?, open?, matched? } }` — yüzlük/onluk/birlik adedi; grup kabında `groups` (kap başına birlik); gizli kutuda `open`; satırda `matched`. Eksik bölge = boş. |
| `onChange` | `(next) => void` | Her eylemden sonra yeni durum. |
| `units` | `ActUnit[]` | Sunulan birimler: ≤20 `['one']`, ≤100 `['ten','one']`, ≤1000 `['hundred','ten','one']` (`unitsFor(max)`). |
| `mode` | `'edit' \| 'watch'` | `watch`: düğme/yedek/çöp yok, sürükleme kapalı (Rehber, izleme). |
| `showCounts` | `boolean` | `false` → tüm büyük sayılar "?" (sayma stratejisini zorlar). |
| `labels` | `{one?, ten?, hundred?}` | Birim adları (varsayılan i18n: birlik/onluk/yüzlük). |
| `onEvent` | `(e: MatEvent) => void` | `{kind, amount, unit, zone, from?, t}`; kind: `add remove move deal group break make match open`. İçeriğin `inferStrategy`'si ilk altısını tanır (adaptör süzer). |
| `onEnter` | `() => void` | Bölgede seçim yokken Enter = "Tamam". |
| `supply` / `trash` | `boolean` | Yedek kutusu (sürükleyerek ekleme) ve çöp (varsayılan açık). |
| `big` | `boolean` | Akıllı tahta ölçeği (`--dot` büyür). |

## MatZone
`{ id, label, kind: 'pile'|'box'|'row'|'group', tone?: 1-4, unitLabel?, count?, hideCount?, active?, locked?, ... }`

- **pile** — serbest yığın; onluk çerçeve düzeni (5'li satır, 10'luk çerçeve), onluk çubuk (5'te belirgin çizgi), yüzlük kare.
- **box** — kapaklı "?" kutusu; kapalıyken içerik görünmez. `target: { value, with?, mode?, label? }` hedef çizgisi:
  `sum` kutu+Σwith=value · `rest` with bölgesinde value kalana dek taşı · `more` kutu=Σwith+value · `less` kutu=Σwith−value.
  Etiket yalnız hikâyedeki sayıyı söyler (Hedef / Kalan / Fark), kutunun içeriğini asla.
- **row** — tam iki `row` bölgesi varsa aynı hücre ızgarasında hizalanır; "Eşle" düğmesi bire bir eşleme çizgileri (≤30 hücre) ya da eşleşme bandı çizer, eşleşmeyenler kesikli çerçeveyle vurgulanır.
- **group** — yuvarlak kaplar. `count` sabit kap sayısı; yoksa dinamik ("Yeni kap" yuvası).

Bölgeye özgü kolaylıklar (başlıkta ≥44 px düğme olarak çıkar):
`fillFrom` (+1/−1 o bölgeden taşır) · `dealFrom` (kaba dokun / "Birer birer dağıt") · `groupFrom`+`groupSize` ("k tanelik grup yap") · `copyFrom` ("Bir kez daha koy") · `gatherFrom` ("Hepsini buraya topla").

## Etkileşim (üç eşdeğer yol — `useDragDrop` deseni)
1. **Sürükle**: sayaç/çubuk/kareyi başka bölgeye, kaba ya da çöpe; yedekten bölgeye.
2. **Dokun-dokun**: öğeye dokun (seçilir; çubuk seçiliyken başlıkta "Boz" çıkar) → bölgeye/kaba/çöpe dokun.
3. **Klavye**: Tab ile bölge gövdesi; `+` ekler, `−` çıkarır; Enter "Tamam" (seçim varsa bırakır); kaplarda Enter/Boşluk 1 koyar.

Sayaçlar `<button>` DEĞİLDİR (a11y-global 44 px `!important` kuralı onları şişirirdi); ekran okuyucu için bölgenin
`aria-label`'ı ("Ela: 8 kalem") ve her değişiklikte `announce` kullanılır. Onluk bozma: −1 birlik yokken önce
onluğu bozar; 10 birlik olunca "10 birlik → 1 onluk" önerisi çıkar. Dağıtma/gruplamada gerekirse onluk kendiliğinden bozulur (olay: `break`).

## Ayrılmış konumlar
Olay/işlem konum dizgelerinde `@supply` (yedek) ve `@trash` (çöp) ayrılmıştır; bölge kimlikleri `@` ile başlamamalı ve `#`/`:` içermemelidir (`ela#2` = ela bölgesinin 3. kabı, `ela:ten` = sürüklenen öğe).

## Dosyalar
`MatBoard.tsx` (kap + dnd + klavye) · `Zone.tsx` (başlık/gövde) · `Counters.tsx` · `TenFrame.tsx` · `Blocks.tsx` ·
`GroupPlates.tsx` · `MatchRows.tsx` · `MysteryBox.tsx` (+ `TargetMeter`) · `StripMorph.tsx` (sayaç → şerit, 600 ms) ·
`ops.ts` (saf işlemler, `applyOp`) · `matState.ts` (saf durum yardımcıları, `stepToward` izleme animasyonu) · `mat.css`.
Testler: `matState.test.ts`, `ops.test.ts`.
