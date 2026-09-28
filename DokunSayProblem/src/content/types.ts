/**
 * DokunSay Problem — İçerik motoru ↔ arayüz VERİ SÖZLEŞMESİ.
 *
 * Bu dosya iki tarafın ortak dilidir: `src/content/**` (üreteç, şablonlar, dilbilgisi,
 * müfredat) bu tipleri ÜRETİR; `src/components/**`, `src/flow/**`, `src/modules/**`
 * (arayüz) bu tipleri TÜKETİR. Bir alanı değiştirmek iki tarafı da etkiler — değişiklik
 * DESIGN.md §4 ile birlikte yapılır.
 *
 * Tasarım dayanakları DESIGN.md'de: şema katalogu (§3), zorluk eksenleri (§5), adım
 * modeli (§6). Kısa özet:
 *  - Problem = bir ŞEMA örneği (+ bilinmeyen rolü) + çok dilli METİN PARÇALARI.
 *  - Metin, arayüzün sayıları dokunulabilir çip olarak çizebilmesi ve cümle cümle
 *    seslendirebilmesi için parçalı (Segment) tutulur.
 *  - Hiçbir alan "anahtar kelime → işlem" eşlemesi taşımaz (bilinçli; DESIGN §2 ilke 3).
 */

export type Lang = 'tr' | 'ku' | 'en';
export const LANGS: readonly Lang[] = ['tr', 'ku', 'en'] as const;

/** Üç dilde metin. Üçü de DOLU olmak zorunda (STANDARDS §1.7.1). */
export type L10n = Record<Lang, string>;

/** 1–4 zorunlu kapsam (TYMM 2024), 5–6 isteğe bağlı. */
export type Grade = 1 | 2 | 3 | 4 | 5 | 6;

/** DokunSay zorluk basamağı (STANDARDS §1.6): 1 Keşif · 2 Rehberli · 3 Yönlendirilmiş · 4 Bağımsız · 5 Transfer. */
export type Diff = 1 | 2 | 3 | 4 | 5;

// ─── ŞEMALAR ────────────────────────────────────────────────────────────────

/**
 * Toplamsal: change (değişim: birleştirme/ayırma), combine (parça-parça-bütün),
 * compare (karşılaştırma; eşitleme alt türüyle).
 * Çarpımsal: equalGroups (eşit gruplar: çarpma, paylaştırma bölmesi, gruplama bölmesi,
 * kalanlı bölme), multCompare (kat karşılaştırması; "yarısı/katı").
 */
export type SchemaId = 'change' | 'combine' | 'compare' | 'equalGroups' | 'multCompare';

/** Şema alt türü — diyagramın animasyonunu ve cümle kalıbını belirler. */
export type SchemaVariant =
  | 'join'          // change: bir şey eklenir
  | 'separate'      // change: bir şey çıkar/gider
  | 'static'        // combine: iki parça bir bütün
  | 'more'          // compare: "…den N fazla"
  | 'fewer'         // compare: "…den N az"
  | 'equalize'      // compare: "kaç tane daha olmalı ki eşit olsun"
  | 'multiply'      // equalGroups: grup × grup başına = toplam
  | 'partitive'     // equalGroups: paylaştırma bölmesi (grup sayısı bilinir)
  | 'quotative'     // equalGroups: gruplama/ölçme bölmesi (grup başına bilinir)
  | 'times'         // multCompare: "N katı"
  | 'fraction';     // multCompare: "yarısı / üçte biri" (birim kesir, 3.–4. sınıf)

/**
 * Şema rolleri. Diyagramdaki her kutu bir roldür; bilinmeyen tam olarak bir roldür.
 *  change:      start · change · result
 *  combine:     part1 · part2 · whole
 *  compare:     larger · smaller · difference     (+ referent: hangisi referans alınan)
 *  equalGroups: groups · perGroup · total          (+ remainder: kalanlı bölmede)
 *  multCompare: reference · factor · compared
 */
export type Role =
  | 'start' | 'change' | 'result'
  | 'part1' | 'part2' | 'whole'
  | 'larger' | 'smaller' | 'difference'
  | 'groups' | 'perGroup' | 'total'
  | 'reference' | 'factor' | 'compared';

export const SCHEMA_ROLES: Record<SchemaId, readonly Role[]> = {
  change: ['start', 'change', 'result'],
  combine: ['part1', 'part2', 'whole'],
  compare: ['larger', 'smaller', 'difference'],
  equalGroups: ['groups', 'perGroup', 'total'],
  multCompare: ['reference', 'factor', 'compared'],
} as const;

/** Bir rolün değeri + çok dilli etiketi ("Ela'nın başta aldığı kalemler"). */
export interface Quantity {
  role: Role;
  value: number;
  /** Diyagram kutusunun kısa etiketi, 3 dil (ör. "başta", "verdiği", "kalan"). */
  label: L10n;
  /** Birim sözcüğü (tekil; Türkçede sayıdan sonra ad tekil kalır): "kalem", "lira", "dakika". */
  unit: L10n;
}

// ─── METİN ──────────────────────────────────────────────────────────────────

/**
 * Metin parçası. `text` düz metin; `qty` bir sayı çipidir (rolü veya gereksiz bilgi
 * kimliğiyle). Arayüz `qty` parçalarını dokunulabilir çip olarak çizer; seslendirme
 * için `speak` alanı (varsa) ekrandaki yazımın konuşulabilir biçimidir.
 */
export type Segment =
  | { kind: 'text'; text: string }
  | {
      kind: 'qty';
      ref: Role | `extra${number}`;
      text: string;
      speak?: string;
      /** (İsteğe bağlı, DESIGN §4 notu) Çok halkalı problemde bu çipin ait olduğu halka indeksi (0 tabanlı).
       *  Yoksa 0 kabul edilir. İki halkada aynı rol adı (ör. iki 'change') geçtiği için gerekir. */
      step?: number;
    };

/** Bir cümle = parçalar dizisi. Seslendirme cümle cümle yapılır (DESIGN §6 adım 1a). */
export interface Sentence {
  segments: Segment[];
  /** Soru cümlesi mi? (arayüz "Soru ne?" adımında bunu vurgular) */
  isQuestion?: boolean;
}

/** Problemde yer alan ama soruyla ilgisiz sayı (DESIGN §5 eksen I). */
export interface ExtraQuantity {
  id: `extra${number}`;
  value: number;
  unit: L10n;
  label: L10n;
}

// ─── PROBLEM ────────────────────────────────────────────────────────────────

/** Zorluk eksenleri (DESIGN §5; 02_lit_sema D1). Her madde bu vektörü taşır. */
export interface Axes {
  /** Bilinmeyen konumu: 0 sonuç/bütün/toplam · 1 değişim/parça/fark · 2 başlangıç/referans */
  U: 0 | 1 | 2;
  /** Dil: 0 tutarlı · 1 tutarsız (karşılaştırma ve kat türlerinde anlamlı) */
  L: 0 | 1;
  /** Sayı aralığı basamağı: 0 ≤10 · 1 ≤20 · 2 ≤100 eldesiz · 3 ≤100 eldeli · 4 ≤1000 · 5 4 basamak */
  N: 0 | 1 | 2 | 3 | 4 | 5;
  /** Gereksiz bilgi: 0 yok · 1 bir ilgisiz sayı · 2 ilgisiz cümle + sayı */
  I: 0 | 1 | 2;
  /** Adım sayısı: 1 · 2 (aynı şema) · 3 (iki farklı şema zinciri) */
  M: 1 | 2 | 3;
  /** Bilgi kaynağı: 0 metin · 1 fiyat/liste tablosu */
  P: 0 | 1;
}

/** Tek şemalı problem (M=1) ya da zincirin bir halkası. */
export interface SchemaStep {
  schema: SchemaId;
  variant: SchemaVariant;
  /** Bu halkada bilinmeyen rol. */
  unknown: Role;
  /** Şemanın üç rolünün değerleri (bilinmeyen dahil — cevap burada). */
  quantities: Quantity[];
  /** compare/multCompare: hangi rol referans (kıyaslanan "…den"). Tutarsız dili belirler. */
  referent?: Role;
  /** Kalanlı bölme: kalan ve nasıl yorumlanacağı (DESIGN §7 "Makul mü?"). */
  remainder?: { value: number; interpret: 'roundUp' | 'roundDown' | 'remainderIsAnswer' };
  /**
   * (İsteğe bağlı, DESIGN §4 notu) Zincirde bu halkanın bir rolü önceki bir halkadan gelir:
   * `{ start: { step: 0, role: 'result' } }` = "bu halkanın başı, 0. halkanın sonucudur" (ara sonuç
   * metinde yazılmaz; arayüz ilk diyagramın cevabını ikinci diyagramın kutusuna sürükletir).
   */
  links?: Partial<Record<Role, { step: number; role: Role }>>;
}

/** (İsteğe bağlı, DESIGN §4 notu) Bilgi kaynağı tablo olan (axes.P=1) problemin fiyat/liste tablosu. */
export interface ProblemTable {
  title: L10n;
  rows: {
    label: L10n;
    value: number;
    unit: L10n;
    /** Bu satırın karşılık geldiği rol (ya da gereksiz bilgi kimliği). Tablodaki sayılar metinde yazmaz. */
    ref: Role | `extra${number}`;
    /** Çok halkalıda halka indeksi (yoksa 0). */
    step?: number;
  }[];
}

export type ContextId = string;

export interface Problem {
  /** Kararlı kimlik: tohumdan türetilir (aynı tohum → aynı problem; paylaşım kodu için). */
  id: string;
  seed: number;
  grade: Grade;
  diff: Diff;
  axes: Axes;
  /** 1 halka (tek adımlı) veya 2 halka (iki adımlı; ilk halkanın sonucu ikincide kullanılır). */
  steps: SchemaStep[];
  /** Hikâye cümleleri (soru cümlesi en sonda, isQuestion:true) — her dil ayrı parçalanır. */
  text: Record<Lang, Sentence[]>;
  /** Gereksiz bilgi sayıları (varsa). */
  extras: ExtraQuantity[];
  /** Nihai cevap (son halkanın bilinmeyeni). Kalanlı bölmede YORUMLANMIŞ değer. */
  answer: number;
  /** Cevap cümlesi kalıbı: "{x}" yer tutuculu, 3 dil ("Ela'nın {x} kalemi kaldı."). */
  answerSentence: L10n;
  /** Cevabın birimi (tekil). */
  answerUnit: L10n;
  /** Hikâye bağlamı (DESIGN §8 bağlam havuzu). */
  context: ContextId;
  /** Kullanılan kişi adları (anlatı için; rapor/erişilebilirlik). */
  people: string[];
  /** TYMM 2024 öğrenme çıktısı kodları (ör. "MAT.2.2.1"). */
  curriculum: string[];
  /** Bu maddenin hedeflediği yanılgı kimlikleri (misconceptions.ts). */
  targets: string[];
  /** "Kaptanın yaşı" türü: çözülemez / eksik bilgili madde (DESIGN §7 Dedektif). */
  unsolvable?: 'nonsense' | 'missingInfo';
  /** (İsteğe bağlı, DESIGN §4 notu) axes.P=1: sayıların bir kısmı metinde değil bu tabloda. */
  table?: ProblemTable;
}

// ─── ÜRETİM İSTEĞİ ──────────────────────────────────────────────────────────

/** Üretece verilen istek. Verilmeyen alanlar sınıf ve zorluğa göre seçilir. */
export interface ProblemSpec {
  grade: Grade;
  schema?: SchemaId;
  variant?: SchemaVariant;
  unknown?: Role;
  axes?: Partial<Axes>;
  context?: ContextId;
  /** Aynı tohum aynı problemi üretir. */
  seed?: number;
  /** Aynı oturumda tekrar etmesin diye dışlanacak id'ler. */
  exclude?: string[];
}

// ─── MODÜL VERİLERİ (üreteç yardımcıları üretir) ────────────────────────────

/** "Hikâyeyi Anlat": 3 yeniden-ifade seçeneği (1 doğru; 1 ilişki ters; 1 soru değişik). */
export interface ParaphraseItem {
  problemId: string;
  options: { text: L10n; kind: 'correct' | 'reversedRelation' | 'differentQuestion' }[];
}

/** "Hata Dedektifi": kurgusal "Robot Çırak"ın adım adım çözümü; bir adımı hatalı. */
export interface ErroneousSolution {
  problemId: string;
  /** Adımlar sırasıyla: şema, model, denklem, hesap, cevap cümlesi. */
  steps: { stepId: FlowStepId; shown: L10n; isError: boolean }[];
  /** Hatanın türü (misconceptions.ts kimliği). */
  misconception: string;
  /** "Neden yanlış?" seçenekleri (1 doğru). */
  why: { text: L10n; correct: boolean }[];
}

// ─── AKIŞ ───────────────────────────────────────────────────────────────────

/**
 * Çözüm akışı (DESIGN §6). Ekranda 5 ana adım şeridi; mikro-adımlar iskele düzeyine göre
 * görünür/gizli olur.
 */
export type FlowStepId =
  | 'read' | 'retell' | 'question' | 'known'          // 1 ANLA
  | 'schema' | 'model' | 'checkModel'                 // 2 GÖSTER (tanı + modelle)
  | 'estimate'                                        // 3 TAHMİN ET
  | 'equation' | 'compute'                            // 4 ÇÖZ
  | 'answer' | 'reasonable' | 'reflect';              // 5 KONTROL ET

export type MainStep = 'understand' | 'show' | 'estimate' | 'solve' | 'check';

export const MAIN_STEPS: readonly { id: MainStep; micro: readonly FlowStepId[] }[] = [
  { id: 'understand', micro: ['read', 'retell', 'question', 'known'] },
  { id: 'show', micro: ['schema', 'model', 'checkModel'] },
  { id: 'estimate', micro: ['estimate'] },
  { id: 'solve', micro: ['equation', 'compute'] },
  { id: 'check', micro: ['answer', 'reasonable', 'reflect'] },
] as const;

/**
 * İskele düzeyi, ŞEMA BAZINDA tutulur (DESIGN §6.3):
 *  3 Model (Ben yaparım — çözümlü örnek, geriye doğru soluklaştırma)
 *  2 Rehberli (Birlikte — tüm mikro-adımlar kart)
 *  1 İstemli (Sen — 5 ana adım, kartlar isteğe bağlı)
 *  0 Bağımsız (yalnız model tuvali + cevap + "Makul mü?")
 */
export type ScaffoldLevel = 0 | 1 | 2 | 3;

/** Hata sınıfları — ayrık puanlama (DESIGN §9). */
export type ErrorClass =
  | 'schemaId'        // yanlış şema seçimi
  | 'modelPlacement'  // sayıyı/etiketi yanlış kutuya koyma
  | 'unknownPlacement'// "?"yi yanlış role koyma
  | 'irrelevantUsed'  // gereksiz sayıyı kullanma
  | 'reversal'        // tutarsız dilde ters işlem (anahtar kelime tuzağı)
  | 'textOrderOp'     // başlangıç bilinmeyende metin sırasıyla işlem
  | 'operation'       // modele uymayan işlem
  | 'computation'     // model ve işlem doğru, hesap yanlış
  | 'unitOrRemainder' // birim eksik / kalan yanlış yorumlandı
  | 'unsolvableMissed';// çözülemez problemi çözmeye çalışma
