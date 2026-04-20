/**
 * DokunSay Platform — Ortak i18n Anahtarları
 *
 * Her uygulama kendi anahtarlarını ekler, ama bu ortak temel
 * menü/ayar/geri bildirim etiketlerinde tutarlılık sağlar.
 */

export const LANGS = ['tr', 'ku', 'en'];

export const LANG_LABELS = {
  tr: 'Türkçe',
  ku: 'Kurmancî',
  en: 'English',
};

export const LANG_FLAGS = {
  tr: '🇹🇷',
  ku: '☀️',
  en: '🇬🇧',
};

export const BASE_TR = {
  menu_activities: 'Etkinlikler',
  menu_games: 'Oyunlar',
  menu_lessons: 'Dersler',
  menu_materials: 'Materyaller',
  menu_features: 'Özellikler',
  menu_settings: 'Ayarlar',
  menu_help: 'Yardım',
  menu_about: 'Hakkında',
  menu_teacher: 'Öğretmen',

  btn_start: 'Başla',
  btn_close: 'Kapat',
  btn_save: 'Kaydet',
  btn_cancel: 'İptal',
  btn_back: 'Geri',
  btn_next: 'İleri',
  btn_reset: 'Sıfırla',
  btn_undo: 'Geri Al',
  btn_redo: 'İleri Al',
  btn_check: 'Kontrol Et',
  btn_hint: 'İpucu',
  btn_speak: 'Sesli Oku',

  feedback_correct: 'Harika!',
  feedback_tryAgain: 'Tekrar deneyelim',
  feedback_wellDone: 'Aferin sana!',
  feedback_keepGoing: 'Devam et, çok iyi gidiyorsun.',
  feedback_almostThere: 'Az kaldı!',
  feedback_thinkAgain: 'Bir daha düşün',

  a11y_dyscalculia: 'Diskalkuli Modu',
  a11y_dyslexia: 'Disleksi Modu',
  a11y_highContrast: 'Yüksek Kontrast',
  a11y_colorblind: 'Renk Körü Modu',
  a11y_tts: 'Sesli Okuma',
  a11y_sfx: 'Ses Efektleri',
  a11y_reduceMotion: 'Az Animasyon',
  a11y_fontSize: 'Yazı Boyutu',

  diff_explore: 'Keşif',
  diff_guided: 'Rehberli',
  diff_directed: 'Yönlendirilmiş',
  diff_independent: 'Bağımsız',
  diff_transfer: 'Transfer',

  cat_concept: 'Kavram',
  cat_operation: 'İşlem',
  cat_misconception: 'Yanılgı',
  cat_scenario: 'Senaryo',
  cat_exploration: 'Keşif',

  author: 'Prof. Dr. Yılmaz Mutlu',
  platform: 'DokunSay Matematik Öğretim Araçları',
};

export const BASE_KU = {
  // FerMat-uyumlu (bkz. _platform/shared/FERMAT.ku.md)
  menu_activities: 'Çalakî',
  menu_games: 'Lîst',
  menu_lessons: 'Ders',
  menu_materials: 'Materyal',
  menu_features: 'Taybetmendî',
  menu_settings: 'Sazkirin',
  menu_help: 'Alîkarî',
  menu_about: 'Derbarê',
  menu_teacher: 'Mamoste',

  btn_start: 'Destpêk',
  btn_close: 'Bigire',
  btn_save: 'Tomar',
  btn_cancel: 'Îptal',
  btn_back: 'Paş',
  btn_next: 'Pêş',
  btn_reset: 'Ji Nû Ve',
  btn_undo: 'Paşve',
  btn_redo: 'Pêşve',
  btn_check: 'Kontrol',
  btn_hint: 'Nîşan',
  btn_speak: 'Bixwîne',

  feedback_correct: 'Çeleng!',
  feedback_tryAgain: 'Dîsa biceribîne',
  feedback_wellDone: 'Aferîn!',
  feedback_keepGoing: 'Bimeşe, pir baş diçî.',
  feedback_almostThere: 'Hindik maye!',
  feedback_thinkAgain: 'Careke din bifikire',

  a11y_dyscalculia: 'Moda Diskalkulî',
  a11y_dyslexia: 'Moda Disleksî',
  a11y_highContrast: 'Kontrasta Bilind',
  a11y_colorblind: 'Moda Koririya Rengan',
  a11y_tts: 'Xwendina bi Deng',
  a11y_sfx: 'Dengên Bandor',
  a11y_reduceMotion: 'Animasyon Kêm',
  a11y_fontSize: 'Mezinahiya Nivîsê',

  // FerMat kirarî (temel işlemler)
  op_addition: 'Zêdekirin',
  op_subtraction: 'Kemkirin',
  op_multiplication: 'Carkirin',
  op_division: 'Parkirin',
  op_equals: 'Wekhevî',
  op_result: 'Encam',

  // FerMat geometri temelleri
  geo_point: 'Xal',
  geo_line: 'Xêz',
  geo_segment: 'Xêzik',
  geo_angle: 'Kujî',
  geo_shape: 'Teşe',
  geo_side: 'Hêl',
  geo_vertex: 'Goşe',
  geo_area: 'Rûber',
  geo_perimeter: 'Rûdor',
  geo_symmetry: 'Hevseng',

  // FerMat ölçme
  m_length: 'Dirêjahî',
  m_width: 'Firehî',
  m_height: 'Bilindahî',
  m_time: 'Dem',
  m_hour: 'Demjimêr',
  m_minute: 'Deqe',

  author: 'Prof. Dr. Yılmaz Mutlu',
  platform: 'Amûrên Fêrkirina Matematîkê ya DokunSay',
};

export const BASE_EN = {
  menu_activities: 'Activities',
  menu_games: 'Games',
  menu_lessons: 'Lessons',
  menu_materials: 'Materials',
  menu_features: 'Features',
  menu_settings: 'Settings',
  menu_help: 'Help',
  menu_about: 'About',
  menu_teacher: 'Teacher',

  btn_start: 'Start',
  btn_close: 'Close',
  btn_save: 'Save',
  btn_cancel: 'Cancel',
  btn_back: 'Back',
  btn_next: 'Next',
  btn_reset: 'Reset',
  btn_undo: 'Undo',
  btn_redo: 'Redo',
  btn_check: 'Check',
  btn_hint: 'Hint',
  btn_speak: 'Read aloud',

  feedback_correct: 'Great!',
  feedback_tryAgain: "Let's try again",
  feedback_wellDone: 'Well done!',
  feedback_keepGoing: "You're doing great, keep going.",
  feedback_almostThere: 'Almost there!',
  feedback_thinkAgain: 'Think again',

  a11y_dyscalculia: 'Dyscalculia mode',
  a11y_dyslexia: 'Dyslexia mode',
  a11y_highContrast: 'High contrast',
  a11y_colorblind: 'Colorblind mode',
  a11y_tts: 'Text-to-speech',
  a11y_sfx: 'Sound effects',
  a11y_reduceMotion: 'Reduce motion',
  a11y_fontSize: 'Font size',

  author: 'Prof. Yılmaz Mutlu, PhD',
  platform: 'DokunSay Math Teaching Tools',
};

export function createI18n(customByLang = {}) {
  const merged = {
    tr: { ...BASE_TR, ...(customByLang.tr || {}) },
    ku: { ...BASE_KU, ...(customByLang.ku || {}) },
    en: { ...BASE_EN, ...(customByLang.en || {}) },
  };
  return {
    get: (lang, key) => merged[lang]?.[key] ?? merged.tr[key] ?? key,
    dict: merged,
  };
}
