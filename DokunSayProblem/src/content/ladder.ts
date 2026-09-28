/**
 * Seviye merdiveni (02 §D3): toplamsal 14 basamak + çarpımsal hat. Tek eksen kuralı: her basamakta
 * yalnız bir eksen zorlaşır. Sınıf etiketleri 04 §C.2 müfredat sınırlarına göre.
 * Eşikler/sıra tasarım tercihidir, kalibre edilmemiştir (DESIGN §11).
 */
import type { Axes, Grade, L10n, Role, SchemaId, SchemaVariant } from './types';

export interface LadderStep {
  id: string;
  grade: Grade;
  schema: SchemaId | 'mixed';
  variant?: SchemaVariant;
  unknown?: Role;
  axes: Partial<Axes>;
  title: L10n;
}

const T = (tr: string, ku: string, en: string): L10n => ({ tr, ku, en });
const S = (id: string, grade: Grade, schema: SchemaId | 'mixed', axes: Partial<Axes>, title: L10n, variant?: SchemaVariant, unknown?: Role): LadderStep =>
  ({ id, grade, schema, axes, title, ...(variant ? { variant } : {}), ...(unknown ? { unknown } : {}) });

// KU-DENETİM: basamak başlıkları.
export const LADDER: LadderStep[] = [
  // ─── Toplamsal hat (1.–3. sınıf) ───
  S('A1', 1, 'change', { U: 0, N: 0 }, T('Değişim: sonrası kaç?', 'Guherîn: paşê çend?', 'Change: how many after?')),
  S('A2', 1, 'combine', { U: 0, N: 0 }, T('Parça-bütün: hepsi kaç?', 'Parçe û gişt: hemû çend in?', 'Part-whole: how many altogether?'), 'static', 'whole'),
  S('A3', 1, 'change', { U: 1, N: 0 }, T('Değişim: ne kadar geldi/gitti?', 'Guherîn: çiqas hat/çû?', 'Change: how many came or went?')),
  S('A4', 1, 'combine', { U: 1, N: 0 }, T('Parça-bütün: bir parça kaç?', 'Parçe û gişt: parçeyek çend e?', 'Part-whole: how many in one part?'), 'static', 'part2'),
  S('A5', 1, 'mixed', { N: 1 }, T('Karışık: değişim ve parça-bütün', 'Tevlihev: guherîn û parçe-gişt', 'Mixed: change and part-whole')),
  S('A6', 1, 'compare', { U: 1, N: 0 }, T('Karşılaştırma: fark kaç?', 'Berhevdan: kemok çend e?', 'Compare: what is the difference?'), undefined, 'difference'),
  S('A7', 2, 'compare', { U: 0, L: 0, N: 1 }, T('Karşılaştırma: büyük/küçük (tutarlı dil)', 'Berhevdan: mezin/biçûk (zimanê lihevhatî)', 'Compare: larger/smaller (consistent wording)')),
  S('A8', 2, 'change', { U: 2, N: 1 }, T('Değişim: başta kaç vardı?', 'Guherîn: di destpêkê de çend hebûn?', 'Change: how many at the start?')),
  S('A9', 2, 'mixed', { N: 1, L: 0 }, T('Karışık: üç şema, tüm konumlar', 'Tevlihev: sê şema, hemû cih', 'Mixed: three schemas, all positions')),
  S('A10', 2, 'compare', { U: 2, L: 1, N: 1 }, T('Karşılaştırma: tutarsız dil (sözcük tuzağı)', 'Berhevdan: zimanê nelihevhatî (xefika peyvê)', 'Compare: inconsistent wording (word trap)')),
  S('A11', 2, 'mixed', { N: 2, I: 1 }, T('Karışık: gereksiz bilgi', 'Tevlihev: agahiya ne pêwîst', 'Mixed: extra information')),
  S('A12', 2, 'mixed', { N: 2, P: 1 }, T('Karışık: fiyat listesinden bilgi', 'Tevlihev: agahî ji lîsteya bihayan', 'Mixed: information from a price list')),
  S('A13', 2, 'mixed', { N: 3, M: 3 }, T('İki adımlı zincir', 'Zincîra du gavan', 'Two-step chain')),
  S('A14', 3, 'mixed', { N: 4, I: 1, M: 2 }, T('Karışık + transfer (büyük sayılar)', 'Tevlihev + veguhestin (hejmarên mezin)', 'Mixed + transfer (bigger numbers)')),
  // ─── Çarpımsal hat (2.–4. sınıf) ───
  S('B1', 2, 'equalGroups', { U: 0 }, T('Eşit gruplar: toplam kaç?', 'Komên wekhev: bi giştî çend?', 'Equal groups: how many in total?'), 'multiply', 'total'),
  S('B2', 2, 'equalGroups', { U: 1 }, T('Paylaştırma: her grupta kaç?', 'Parvekirin: di her komê de çend?', 'Sharing: how many in each group?'), 'partitive', 'perGroup'),
  S('B3', 2, 'equalGroups', { U: 2 }, T('Gruplama: kaç grup olur?', 'Komkirin: çend kom çêdibin?', 'Grouping: how many groups?'), 'quotative', 'groups'),
  S('B4', 3, 'mixed', { N: 2 }, T('Karışık: toplamsal ve çarpımsal ("4 fazla" mı "4 katı" mı?)', 'Tevlihev: zêdekirin û carkirin', 'Mixed: additive and multiplicative ("4 more" or "4 times"?)')),
  S('B5', 3, 'multCompare', { U: 0 }, T('Kat: karşılaştırılan kaç?', 'Car: ya tê berhevdan çend e?', 'Times: how many in the compared amount?'), 'times', 'compared'),
  S('B6', 3, 'multCompare', { U: 1 }, T('Kat: kaç katı?', 'Car: çend car?', 'Times: how many times?'), 'times', 'factor'),
  S('B7', 3, 'multCompare', { U: 2, L: 1 }, T('Kat: referans (tutarsız dil)', 'Car: referans (zimanê nelihevhatî)', 'Times: reference (inconsistent wording)'), 'times', 'reference'),
  S('B8', 3, 'equalGroups', { N: 2 }, T('Kalanlı bölme: kalanı yorumla', 'Parkirina bi jêma: jêmayê şîrove bike', 'Division with remainder: interpret the remainder'), 'quotative', 'groups'),
  S('B9', 3, 'mixed', { M: 3, N: 2 }, T('İki adımlı: çarpma ve çıkarma', 'Du gav: carkirin û kemkirin', 'Two steps: multiply then take away')),
  S('B10', 4, 'multCompare', { U: 0 }, T('Birim kesir: yarısı, üçte biri', 'Parjimara yekane: nîv, sêyek', 'Unit fraction: half, one third'), 'fraction', 'compared'),
  S('B11', 4, 'multCompare', { U: 2, L: 1 }, T('Birim kesir: bütünü bul (tutarsız dil)', 'Parjimara yekane: giştê bibîne', 'Unit fraction: find the whole (inconsistent wording)'), 'fraction', 'reference'),
];
