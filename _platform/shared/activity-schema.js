/**
 * DokunSay Platform — Ortak Etkinlik Şeması
 *
 * Her uygulamanın `constants/activities.js` dosyası bu şemaya uymalıdır.
 * Platform genelinde tutarlı etkinlik veri yapısı sağlar.
 */

/**
 * Etkinlik kategorileri (platform-çapı sabit).
 * Renkler launcher ve uygulama iç etiketleri için kullanılır.
 */
export const CATEGORIES = {
  kesif:        { labelTr: 'Keşif',       labelKu: 'Vedîtin',   labelEn: 'Exploration',   color: '#22c55e' },
  kavram:       { labelTr: 'Kavram',      labelKu: 'Têgeh',     labelEn: 'Concept',       color: '#3b82f6' },
  islem:        { labelTr: 'İşlem',       labelKu: 'Kar',       labelEn: 'Operation',     color: '#f59e0b' },
  yanilgi:      { labelTr: 'Yanılgı',     labelKu: 'Şaşî',      labelEn: 'Misconception', color: '#ef4444' },
  senaryo:      { labelTr: 'Senaryo',     labelKu: 'Senaryo',   labelEn: 'Scenario',      color: '#8b5cf6' },
  karsilastirma:{ labelTr: 'Karşılaştırma',labelKu: 'Berawirdin',labelEn: 'Comparison',   color: '#ec4899' },
  olcum:        { labelTr: 'Ölçüm',       labelKu: 'Pîvan',     labelEn: 'Measurement',   color: '#14b8a6' },
};

/**
 * Zorluk seviyeleri (scaffolding).
 */
export const DIFFICULTIES = {
  1: { labelTr: 'Keşif',           labelKu: 'Vedîtin',       labelEn: 'Explore',      icon: '🌱' },
  2: { labelTr: 'Rehberli',        labelKu: 'Bi Rêber',      labelEn: 'Guided',       icon: '🌿' },
  3: { labelTr: 'Yönlendirilmiş',  labelKu: 'Beralîkirî',    labelEn: 'Directed',     icon: '🌳' },
  4: { labelTr: 'Bağımsız',        labelKu: 'Serbixwe',      labelEn: 'Independent',  icon: '🏆' },
  5: { labelTr: 'Transfer',        labelKu: 'Derbazkirin',   labelEn: 'Transfer',     icon: '🎯' },
};

/**
 * Pedagojik çerçeveler (atıflar için).
 */
export const FRAMEWORKS = {
  cra:       { name: 'Somut-Yarı Soyut-Soyut (CRA)',      authors: 'Bruner 1966' },
  vanHiele:  { name: 'Van Hiele Seviyeleri',              authors: 'van Hiele 1957-86' },
  crowley:   { name: '5-Faz Dersi',                       authors: 'Crowley 1987' },
  curcio:    { name: 'Grafik Okuma Seviyeleri',          authors: 'Curcio 1989' },
  bloom:     { name: 'Revize Bloom Taksonomisi',         authors: 'Anderson & Krathwohl 2001' },
  gaise:     { name: 'GAISE Çerçevesi',                   authors: 'Franklin et al. 2007, 2016' },
  ppdac:     { name: 'PPDAC Döngüsü',                     authors: 'Wild & Pfannkuch 1999' },
  piaget:    { name: 'Zaman Kavramı Gelişimi',           authors: 'Piaget 1969' },
  dienes:    { name: 'Temel-10 Blokları',                 authors: 'Dienes 1971' },
};

/**
 * Standart etkinlik nesnesi (örnek).
 *
 * @typedef {Object} Activity
 * @property {string}   id            - Kebab-case benzersiz ID (örn. 'birim-kesir-1')
 * @property {string}   name          - Görünen ad (i18n anahtarı da olabilir)
 * @property {string}   icon          - Emoji veya SVG ref
 * @property {keyof CATEGORIES} category
 * @property {keyof DIFFICULTIES} difficulty
 * @property {string}   description   - Kısa tanım (< 200 karakter)
 * @property {string}   [curriculum]  - MEB müfredat kodu (örn. 'M.1.1.4.1')
 * @property {number}   [vhLevel]     - Van Hiele seviyesi (sadece Geo)
 * @property {number}   [curcioLevel] - Curcio seviyesi (sadece Veri)
 * @property {number}   [bloomLevel]  - Bloom seviyesi (1-6)
 * @property {string[]} [frameworks]  - Kullanılan pedagojik çerçeveler
 * @property {Object}   setup         - Uygulamaya özel başlangıç durumu
 * @property {Function} [checkSuccess]- (state) => boolean — tamamlanma koşulu
 * @property {string}   [hint]        - İpucu metni
 * @property {string}   [citation]    - Literatür atfı (yanılgı etkinlikleri için)
 */

/**
 * Etkinlik validasyonu — dev ortamında etkinlik tanımlarını doğrular.
 */
export function validateActivity(activity) {
  const errors = [];

  if (!activity.id || typeof activity.id !== 'string') {
    errors.push('id is required and must be a string');
  }
  if (activity.id && !/^[a-z0-9-]+$/.test(activity.id)) {
    errors.push(`id "${activity.id}" must be kebab-case`);
  }
  if (!activity.name) errors.push('name is required');
  if (!activity.icon) errors.push('icon is required');
  if (!activity.category || !CATEGORIES[activity.category]) {
    errors.push(`category must be one of: ${Object.keys(CATEGORIES).join(', ')}`);
  }
  if (!activity.difficulty || !DIFFICULTIES[activity.difficulty]) {
    errors.push('difficulty must be 1-5');
  }
  if (!activity.description) errors.push('description is required');
  if (activity.description && activity.description.length > 200) {
    errors.push('description must be <= 200 chars');
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Bir etkinlik listesinin tamamını doğrula.
 */
export function validateActivities(activities) {
  const results = activities.map((act, i) => ({
    index: i,
    id: act.id,
    ...validateActivity(act),
  }));

  const invalid = results.filter((r) => !r.valid);
  return {
    total: activities.length,
    valid: results.length - invalid.length,
    invalid,
  };
}
