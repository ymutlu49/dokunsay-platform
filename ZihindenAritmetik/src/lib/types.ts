/** Kitaptan üretilen içeriğin tipleri. src/content/*.json ile birebir eşleşir. */

export interface Section {
  id: number;
  title: string;
  /** Kitapta başka bir ad kullanılıyorsa özgün ad burada durur. */
  bookTitle?: string;
  bookChapter: number | null;
  intro: string;
}

export interface ActivityCard {
  id: string;
  section: number;
  order: number;
  title: string;
  /**
   * Uygulamada ad değiştirildiyse kitaptaki özgün ad. Kart ekranında
   * "Kitapta: ..." satırıyla gösterilir; kitabı elinde tutan öğretmen
   * aradığı kartı kaybetmez.
   */
  bookTitle?: string;
  duration: string;
  minMinutes: number | null;
  maxMinutes: number | null;
  bookRef: string;
  bookChapter: number | null;
  material: string;
  why: string;
  figure: string | null;
  figureCaption: string;
  prep: string[];
  steps: string[];
  ask: string[];
  support: string[];
  extension: string[];
  /** "Diskalkuli" | "Düşük" | "Ortalama" | "Yüksek" */
  profiles: Record<string, string>;
  criterion: string;
}

export interface ActivityContent {
  sections: Section[];
  cards: ActivityCard[];
}

export interface NumberString {
  id: string;
  source: 'hazir' | 'takvim' | 'kendi';
  strategy: string;
  problems: string[];
  bookChapter?: number | null;
  week?: number;
  session?: number | null;
}

export interface StringContent {
  ready: NumberString[];
  calendar: NumberString[];
}

/** Bir öğrencinin anlattığı yol; adı sonradan konur. */
export interface Yol {
  metin: string;
  /** Yol paylaşıldıktan sonra öğretmenin verdiği strateji adı. */
  strateji?: string;
}

/** Tek bir problemin oturum boyunca biriken kaydı. */
export interface ProblemKaydi {
  /** Gelen bütün cevaplar; doğru/yanlış ayrımı yapılmaz. */
  cevaplar: string[];
  yollar: Yol[];
  /** Tartışma sonunda sınıfın üzerinde anlaştığı cevap. */
  uzlasma?: string;
  /** Sessiz düşünme süresi (saniye) — geri sayım değil, geçen süre. */
  dusunmeSn?: number;
  /** Başparmağını göğsüne koyan öğrenci sayısı. */
  hazir?: number;
  /** Birden çok yol bulduğunu işaret eden öğrenci sayısı. */
  ikinciYol?: number;
}

/** Sayı konuşması oturumunun tahtada biriken kaydı. */
export interface TalkRecord {
  stringId: string;
  startedAt: number;
  problems: Record<number, ProblemKaydi>;
  /** Dizinin strateji adı açıldı mı (kitap: ad, yol bulunduktan sonra konur). */
  named: boolean;
}

/** Tahtadaki bir problemin hangi aşamada olduğu. */
export type Asama = 'dusunme' | 'cevaplar' | 'yollar' | 'uzlasma';

export const PROFILE_ORDER = ['Diskalkuli', 'Düşük', 'Ortalama', 'Yüksek'] as const;
export type ProfileKey = (typeof PROFILE_ORDER)[number];
