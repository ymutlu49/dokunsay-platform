/**
 * Kitaptan üretilen içeriğin tek giriş noktası.
 *
 * JSON dosyaları `scripts/extract_content.py` tarafından .docx kaynaklarından
 * üretilir; elle düzenlenmez. Kürtçe ve İngilizce ciltler hazırlandığında
 * src/content/ku/ ve src/content/en/ klasörleri eklenir ve buradaki seçici
 * o dile geçer — bileşenlerin hiçbiri değişmez.
 */
import trActivities from './tr/activities.json';
import trStrings from './tr/strings.json';
import type {
  ActivityCard,
  ActivityContent,
  NumberString,
  Section,
  StringContent,
} from '../lib/types';

const AKTIVITE = trActivities as unknown as ActivityContent;
const DIZI = trStrings as unknown as StringContent;

export const bolumler: Section[] = AKTIVITE.sections;
export const kartlar: ActivityCard[] = AKTIVITE.cards;
export const hazirDiziler: NumberString[] = DIZI.ready;
export const takvimDizileri: NumberString[] = DIZI.calendar;

export const tumDiziler: NumberString[] = [...DIZI.calendar, ...DIZI.ready];

export function kartBul(id: string): ActivityCard | undefined {
  return kartlar.find((k) => k.id === id);
}

export function bolumBul(id: number): Section | undefined {
  return bolumler.find((b) => b.id === id);
}

export function diziBul(id: string): NumberString | undefined {
  return tumDiziler.find((d) => d.id === id);
}

/** Takvimdeki hafta numaraları (1–10), sırayla. */
export const haftalar: number[] = [
  ...new Set(takvimDizileri.map((d) => d.week ?? 0)),
].sort((a, b) => a - b);

export function haftaninDizileri(hafta: number): NumberString[] {
  return takvimDizileri
    .filter((d) => d.week === hafta)
    .sort((a, b) => (a.session ?? 0) - (b.session ?? 0));
}

/** Kartın materyal alanı boşsa "materyalsiz" sayılır. */
export function materyalGerekir(kart: ActivityCard): boolean {
  const m = kart.material.trim().toLowerCase();
  return m.length > 0 && m !== 'yok' && m !== '—' && m !== 'materyalsiz';
}

/**
 * Bölümün renk numarası (1–9). Kütüphanede kartın hangi bölüme ait olduğunu
 * okumadan gösterir; renk sınıfları styles.css içindeki .renk-N ile eşleşir.
 */
export function bolumRengi(bolumId: number): number {
  return ((bolumId - 1) % 9) + 1;
}

/** Kartların kitaptaki sırası — önceki/sonraki gezinmesi için. */
const SIRALI = [...kartlar].sort((a, b) =>
  a.section === b.section ? a.order - b.order : a.section - b.section,
);

export function komsuKartlar(id: string): {
  onceki?: ActivityCard;
  sonraki?: ActivityCard;
} {
  const i = SIRALI.findIndex((k) => k.id === id);
  if (i < 0) return {};
  return { onceki: SIRALI[i - 1], sonraki: SIRALI[i + 1] };
}
