/**
 * DokunSay Bar — Sembolik ve sözel cümle türetimi (CRA'nın S basamağı)
 *
 * NEDEN BÖYLE: Bar'ın ilan ettiği çerçeve CRA + Bruner (enaktif → ikonik → sembolik).
 * Çubuklar ve pullar enaktif/ikonik ucu zaten karşılıyordu; sembolik uç eksikti — çocuk
 * "4 ve 3" kurup 7 buluyor ama ekranda hiçbir yerde `4 + 3 = 7` yazmıyordu. Bruner'ın
 * tezi üç kodlamanın EŞ ZAMANLI görünmesidir; bu modül o üçüncü kodu üretir.
 *
 * TASARIM KARARI — DURUM TUTULMAZ, TÜRETİLİR:
 * Cümle `items`'tan saf bir fonksiyonla hesaplanır; reducer'a yeni veri EKLENMEZ.
 * Sonuçları:
 *  · Geri al / ileri al, sayfa değiştirme, şablon yükleme, dosyadan açma — hepsi
 *    kendiliğinden doğru çalışır (cümle her zaman ekrandaki nesnelerin aynası).
 *  · Senkron kayması İMKÂNSIZ: saklanan ikinci bir doğruluk kaynağı yok.
 *  · Sürükleme/çakışma/denetleyici kodlarına hiç dokunulmaz.
 * Tek maliyet: her render'da yeniden hesap — girdi birkaç düzine nesne, önemsiz.
 *
 * BELİRSİZKEN SUSAR: tuvalde okunaklı bir yapı yoksa `null` döner. Yanlış bir cümle
 * göstermek, hiç göstermemekten kötüdür — çocuk ekrandaki sembolü doğru kabul eder.
 */

import { CELL_SIZE } from "../constants/dimensions";
import { NUMBER_WORDS } from "../data/numberWords";
import type { CanvasItem, RodItem, Language } from "../types";

export interface Sentence {
  /** Sembolik gösterim: "4 + 3 = 7" */
  symbolic: string;
  /** Sözel gösterim: "dört artı üç eşittir yedi" */
  verbal: string;
  /** Hangi yapıdan türedi — öğretmen paneli/hata ayıklama için. */
  kind: "single" | "sum" | "compare" | "chips" | "frame";
}

/** Sayının sözcüğü; tabloda yoksa RAKAM döner (uydurma yapılmaz). */
function word(n: number, lang: Language): string {
  const t = NUMBER_WORDS[lang] ?? NUMBER_WORDS.tr;
  return t[n] || String(n);
}

/** İşlem/ilişki sözcükleri. Yalnız sunulan diller (tr/ku/en) + veri olarak ar/fa. */
const OPS: Record<Language, { plus: string; eq: string; gt: string; minus: string; of: string }> = {
  tr: { plus: "artı", eq: "eşittir", gt: "büyüktür", minus: "eksi", of: "tanesi işaretli" },
  ku: { plus: "zêdî", eq: "dike", gt: "mezintir e ji", minus: "kêmî", of: "heb nîşankirî" },
  en: { plus: "plus", eq: "equals", gt: "is greater than", minus: "minus", of: "marked" },
  ar: { plus: "زائد", eq: "يساوي", gt: "أكبر من", minus: "ناقص", of: "معلَّم" },
  fa: { plus: "به‌علاوه", eq: "مساوی است با", gt: "بزرگ‌تر از", minus: "منها", of: "علامت‌خورده" },
};

const rodsOf = (items: CanvasItem[]) =>
  items.filter((i): i is RodItem => i.type === "rod" && (i.rot || 0) === 0 && !i.flipped);

/**
 * Aynı satırdaki (y hizalı) ve UÇ UCA değen çubukları soldan sağa zincir hâlinde toplar.
 * Eşik değerleri getAdjacentPairs ile AYNI tutuldu (y farkı ≤4, boşluk <6) — iki yerin
 * "bitişik" tanımı ayrışırsa birleştirme düğmesi çıkar ama cümle çıkmaz, çocuk şaşırır.
 */
function chain(items: CanvasItem[]): RodItem[] | null {
  const rods = rodsOf(items);
  if (rods.length < 2) return null;

  // Çubukları SATIRLARA ayır (y bandına göre), her satırı ayrı sına.
  // İlk sürümde satır "ilk çubuğun y'si" ile seçiliyordu; iki sıralı düzenlerde
  // (ör. üstte bütün, altta iki parça) yanlış sıra seçilip cümle hiç çıkmıyordu.
  const rows: RodItem[][] = [];
  for (const r of rods) {
    const row = rows.find((g) => Math.abs(g[0].y - r.y) <= 4);
    if (row) row.push(r);
    else rows.push([r]);
  }

  // Uç uca değen EN UZUN zinciri döndür (birden çok satır varsa en bilgilendirici olan).
  let best: RodItem[] | null = null;
  for (const row of rows) {
    if (row.length < 2) continue;
    const sorted = row.slice().sort((a, b) => a.x - b.x);
    let ok = true;
    for (let i = 1; i < sorted.length; i++) {
      const prevRight = sorted[i - 1].x + sorted[i - 1].value * CELL_SIZE;
      if (Math.abs(prevRight - sorted[i].x) >= 6) { ok = false; break; } // zincir kopuk
    }
    if (ok && (!best || sorted.length > best.length)) best = sorted;
  }
  return best;
}

export function describeCanvas(items: CanvasItem[], lang: Language): Sentence | null {
  const op = OPS[lang] ?? OPS.tr;
  const rods = rodsOf(items);
  const chips = items.filter((i) => i.type === "chip");
  const frames = items.filter((i) => i.type === "frame");

  // 1) ÇERÇEVEDE PUL — onluk/beşlik kart: dolu + boş = kapasite (10'a tamamlama dili)
  if (frames.length === 1 && chips.length > 0) {
    const f = frames[0] as any;
    const cap = (f.cols || 5) * (f.rows || 1);
    const inFrame = chips.filter((c: any) => c.parentId === f.id).length;
    if (inFrame > 0 && inFrame <= cap) {
      const empty = cap - inFrame;
      if (empty === 0) {
        return { kind: "frame", symbolic: `${inFrame}`, verbal: word(inFrame, lang) };
      }
      return {
        kind: "frame",
        symbolic: `${inFrame} + ${empty} = ${cap}`,
        verbal: `${word(inFrame, lang)} ${op.plus} ${word(empty, lang)} ${op.eq} ${word(cap, lang)}`,
      };
    }
  }

  // 2) ÇUBUĞA PUL — kaç birim işaretlendi (birebir eşleme / sayma)
  if (rods.length >= 1 && chips.length > 0) {
    const owner = rods.find((r) => chips.some((c: any) => c.parentId === r.id));
    if (owner) {
      const c = chips.filter((ch: any) => ch.parentId === owner.id).length;
      if (c === owner.value) {
        // Tüm delikler dolu: sayım tamamlandı, sonuç çubuğun değeri
        return { kind: "chips", symbolic: `${c}`, verbal: word(c, lang) };
      }
      // Kısmi sayım: "7 çubuğun 3 birimi işaretli". Sembolik tarafta BÖLME İZLENİMİ
      // vermemek için "3 / 7" değil "3 → 7" kullanılır (çocuk bunu kesir/bölme sanabilir).
      return {
        kind: "chips",
        symbolic: `${c} → ${owner.value}`,
        verbal: `${word(owner.value, lang)}: ${word(c, lang)} ${op.of}`,
      };
    }
  }

  // 3) UÇ UCA ÇUBUKLAR — toplama cümlesi (birleştirme afordansıyla aynı geometri)
  const row = chain(items);
  if (row && row.length >= 2) {
    const vals = row.map((r) => r.value);
    const total = vals.reduce((a, b) => a + b, 0);
    return {
      kind: "sum",
      symbolic: `${vals.join(" + ")} = ${total}`,
      verbal: `${vals.map((v) => word(v, lang)).join(` ${op.plus} `)} ${op.eq} ${word(total, lang)}`,
    };
  }

  // 4) İKİ ÇUBUK ALT ALTA, SOLDAN HİZALI — karşılaştırma ve fark
  if (rods.length === 2) {
    const [a, b] = rods;
    const stacked = Math.abs(a.x - b.x) < 6 && Math.abs(a.y - b.y) > 4;
    if (stacked && a.value !== b.value) {
      const big = a.value > b.value ? a.value : b.value;
      const small = a.value > b.value ? b.value : a.value;
      return {
        kind: "compare",
        symbolic: `${big} > ${small}  ·  ${big} − ${small} = ${big - small}`,
        verbal: `${word(big, lang)} ${op.gt} ${word(small, lang)}; ${word(big, lang)} ${op.minus} ${word(small, lang)} ${op.eq} ${word(big - small, lang)}`,
      };
    }
  }

  // 5) TEK ÇUBUK — en yalın sembol
  if (rods.length === 1 && chips.length === 0) {
    return { kind: "single", symbolic: `${rods[0].value}`, verbal: word(rods[0].value, lang) };
  }

  return null; // okunaklı yapı yok → SUS
}
