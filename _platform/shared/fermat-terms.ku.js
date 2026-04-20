/**
 * DokunSay Platform — FerMat Kurmancî Matematik Terimleri (Kanonik)
 *
 * Kaynak: FerMat - Ferhenga Matematîkê ya Berfireh (Prof. Dr. Yılmaz Mutlu)
 * `FerMat/Ferhenga Matematik/ferhenga_matematik_dictionary.txt` (394 terim, 10 kategori)
 *
 * Tüm DokunSay uygulamaları bu terim sözlüğünü referans alır. Her yeni
 * Kurmancî çeviride önce buradaki terimler tercih edilir; yoksa FerMat
 * sözlüğünden yeni terim eklenir.
 *
 * Format:
 *   key: { ku: "...", tr: "...", en: "...", note?: "..." }
 */

export const FERMAT_KU = {
  // === Hejmarên Bingehîn (Basic Numbers) ===
  num_0:  { ku: 'sifir',      tr: 'sıfır',     en: 'zero' },
  num_1:  { ku: 'yek',        tr: 'bir',       en: 'one' },
  num_2:  { ku: 'du',         tr: 'iki',       en: 'two' },
  num_3:  { ku: 'sê',         tr: 'üç',        en: 'three' },
  num_4:  { ku: 'çar',        tr: 'dört',      en: 'four' },
  num_5:  { ku: 'pênc',       tr: 'beş',       en: 'five' },
  num_6:  { ku: 'şeş',        tr: 'altı',      en: 'six' },
  num_7:  { ku: 'heft',       tr: 'yedi',      en: 'seven' },
  num_8:  { ku: 'heşt',       tr: 'sekiz',     en: 'eight' },
  num_9:  { ku: 'neh',        tr: 'dokuz',     en: 'nine' },
  num_10: { ku: 'deh',        tr: 'on',        en: 'ten' },
  num_20: { ku: 'bîst',       tr: 'yirmi',     en: 'twenty' },
  num_30: { ku: 'sî',         tr: 'otuz',      en: 'thirty' },
  num_40: { ku: 'çil',        tr: 'kırk',      en: 'forty' },
  num_50: { ku: 'pêncî',      tr: 'elli',      en: 'fifty' },
  num_60: { ku: 'şêst',       tr: 'altmış',    en: 'sixty' },
  num_70: { ku: 'heftê',      tr: 'yetmiş',    en: 'seventy' },
  num_80: { ku: 'heştê',      tr: 'seksen',    en: 'eighty' },
  num_90: { ku: 'not',        tr: 'doksan',    en: 'ninety' },
  num_100:  { ku: 'sed',      tr: 'yüz',       en: 'hundred' },
  num_1000: { ku: 'hezar',    tr: 'bin',       en: 'thousand' },

  // === Kirarî (Operations) ===
  op_operation:     { ku: 'kirarî',       tr: 'işlem',       en: 'operation' },
  op_four_ops:      { ku: 'çar kirarî',   tr: 'dört işlem',  en: 'four operations' },
  op_addition:      { ku: 'zêdekirin',    tr: 'toplama',     en: 'addition' },
  op_plus_sign:     { ku: 'zêdek (+)',    tr: 'artı işareti',en: 'plus sign' },
  op_addend:        { ku: 'zêdebar',      tr: 'toplanan',    en: 'addend' },
  op_sum:           { ku: 'zêdok',        tr: 'toplam',      en: 'sum' },
  op_subtraction:   { ku: 'kemkirin',     tr: 'çıkarma',     en: 'subtraction' },
  op_minus_sign:    { ku: 'kemek (−)',    tr: 'eksi işareti',en: 'minus sign' },
  op_minuend:       { ku: 'kembar',       tr: 'eksilen',     en: 'minuend' },
  op_subtrahend:    { ku: 'kemker',       tr: 'çıkarılan',   en: 'subtrahend' },
  op_difference:    { ku: 'kemok',        tr: 'fark',        en: 'difference' },
  op_multiplication:{ ku: 'carkirin',     tr: 'çarpma',      en: 'multiplication' },
  op_mult_sign:     { ku: 'carek (×)',    tr: 'çarpı işareti',en: 'multiplication sign' },
  op_multiplier:    { ku: 'carker',       tr: 'çarpan',      en: 'multiplier' },
  op_multiplicand:  { ku: 'carbar',       tr: 'çarpılan',    en: 'multiplicand' },
  op_product:       { ku: 'carandok',     tr: 'çarpım',      en: 'product' },
  op_division:      { ku: 'parkirin',     tr: 'bölme',       en: 'division' },
  op_div_sign:      { ku: 'parînek (÷)',  tr: 'bölü işareti',en: 'division sign' },
  op_divisor:       { ku: 'parker',       tr: 'bölen',       en: 'divisor' },
  op_dividend:      { ku: 'parbar',       tr: 'bölünen',     en: 'dividend' },
  op_quotient:      { ku: 'paran',        tr: 'bölüm',       en: 'quotient' },
  op_remainder:     { ku: 'jêma',         tr: 'kalan',       en: 'remainder' },
  op_result:        { ku: 'encam',        tr: 'sonuç',       en: 'result' },
  op_equals:        { ku: 'wekhevî',      tr: 'eşittir',     en: 'equals' },
  op_equal:         { ku: 'yeksan',       tr: 'eşit',        en: 'equal', note: 'wekhev de kullanılır' },

  // === Cureyên Hejmaran (Number Types) ===
  nt_number:     { ku: 'hejmar',           tr: 'sayı',         en: 'number' },
  nt_digit:      { ku: 'jimare',           tr: 'rakam',        en: 'digit' },
  nt_natural:    { ku: 'hejmara xwezayî',  tr: 'doğal sayı',   en: 'natural number' },
  nt_integer:    { ku: 'hejmara tam',      tr: 'tam sayı',     en: 'integer' },
  nt_positive:   { ku: 'hejmara erênî',    tr: 'pozitif sayı', en: 'positive number' },
  nt_negative:   { ku: 'hejmara neyînî',   tr: 'negatif sayı', en: 'negative number' },
  nt_prime:      { ku: 'hejmara xwebeş',   tr: 'asal sayı',    en: 'prime number' },
  nt_even:       { ku: 'hejmara cot',      tr: 'çift sayı',    en: 'even number' },
  nt_odd:        { ku: 'hejmara fer',      tr: 'tek sayı',     en: 'odd number' },
  nt_whole:      { ku: 'hejmara tewaw',    tr: 'doğal sayı',   en: 'whole number' },
  nt_double:     { ku: 'dûcar',            tr: 'iki katı',     en: 'double' },
  nt_half_of:    { ku: 'nîvcar',           tr: 'yarısı',       en: 'half of' },
  nt_mixed:      { ku: 'hejmara pêçkirî',  tr: 'karışık sayı', en: 'mixed number' },
  nt_consecutive:{ ku: 'peyhev',           tr: 'ardışık',      en: 'consecutive' },

  // === Parjimar û Dehane (Fractions & Decimals) ===
  fr_fraction:   { ku: 'parjimar',           tr: 'kesir',         en: 'fraction' },
  fr_numerator:  { ku: 'par',                tr: 'pay',           en: 'numerator' },
  fr_denominator:{ ku: 'tevpar',             tr: 'payda',         en: 'denominator' },
  fr_whole:      { ku: 'gişt',               tr: 'bütün',         en: 'whole' },
  fr_half:       { ku: 'nîv',                tr: 'yarım',         en: 'half' },
  fr_quarter:    { ku: 'çarek',              tr: 'çeyrek',        en: 'quarter' },
  fr_equivalent: { ku: 'parjimara hevkêş',   tr: 'denk kesir',    en: 'equivalent fraction' },
  fr_proper:     { ku: 'parjimara sade',     tr: 'basit kesir',   en: 'proper fraction' },
  fr_improper:   { ku: 'parjimara nesade',   tr: 'bileşik kesir', en: 'improper fraction' },
  fr_simplify:   { ku: 'sadekirin',          tr: 'sadeleştirme',  en: 'simplifying fractions' },
  fr_decimal:    { ku: 'hejmara dehane',     tr: 'ondalık sayı',  en: 'decimal number' },
  fr_percent:    { ku: 'sedî',               tr: 'yüzde',         en: 'percentage' },
  fr_ratio:      { ku: 'rêje',               tr: 'oran',          en: 'ratio' },
  fr_tenth:      { ku: 'dehek',              tr: 'onda bir',      en: 'tenth' },
  fr_hundredth:  { ku: 'sedek',              tr: 'yüzde bir',     en: 'hundredth' },

  // === Geometrî (Geometry) ===
  geo_geometry:       { ku: 'cîyometrî',         tr: 'geometri',            en: 'geometry' },
  geo_point:          { ku: 'xal',               tr: 'nokta',               en: 'point' },
  geo_line:           { ku: 'xêz',               tr: 'doğru',               en: 'line' },
  geo_segment:        { ku: 'xêzik',             tr: 'doğru parçası',       en: 'line segment' },
  geo_ray:            { ku: 'tîr',               tr: 'ışın',                en: 'ray' },
  geo_angle:          { ku: 'kujî',              tr: 'açı',                 en: 'angle', note: 'FerMat primary; "goşe" = köşe/vertex' },
  geo_degree:         { ku: 'pîle',              tr: 'derece',              en: 'degree' },
  geo_right_angle:    { ku: 'kujîya rast',       tr: 'dik açı',             en: 'right angle' },
  geo_acute_angle:    { ku: 'kujîya tûj',        tr: 'dar açı',             en: 'acute angle' },
  geo_obtuse_angle:   { ku: 'kujîya berfireh',   tr: 'geniş açı',           en: 'obtuse angle' },
  geo_shape:          { ku: 'teşe',              tr: 'şekil',               en: 'shape' },
  geo_circle:         { ku: 'gilover',           tr: 'daire',               en: 'circle' },
  geo_circumference:  { ku: 'gilovêr',           tr: 'çember',              en: 'circumference' },
  geo_center:         { ku: 'navend',            tr: 'merkez',              en: 'center' },
  geo_radius:         { ku: 'tîrêj',             tr: 'yarıçap',             en: 'radius' },
  geo_diameter:       { ku: 'pûtik',             tr: 'çap',                 en: 'diameter' },
  geo_triangle:       { ku: 'sêgoşe',            tr: 'üçgen',               en: 'triangle' },
  geo_equilateral:    { ku: 'sêgoşeya wekhêl',   tr: 'eşkenar üçgen',       en: 'equilateral triangle' },
  geo_right_triangle: { ku: 'sêgoşeya rast',     tr: 'dik üçgen',           en: 'right triangle' },
  geo_rectangle:      { ku: 'çarçik',            tr: 'dikdörtgen',          en: 'rectangle' },
  geo_square:         { ku: 'kare',              tr: 'kare',                en: 'square' },
  geo_quadrilateral:  { ku: 'çargoşe',           tr: 'dörtgen',             en: 'quadrilateral' },
  geo_polygon:        { ku: 'pirgoşe',           tr: 'çokgen',              en: 'polygon' },
  geo_pentagon:       { ku: 'pêncgoşe',          tr: 'beşgen',              en: 'pentagon' },
  geo_hexagon:        { ku: 'şeşgoşe',           tr: 'altıgen',             en: 'hexagon' },
  geo_side:           { ku: 'hêl',               tr: 'kenar',               en: 'side', note: 'FerMat standard; "kêlek" dialektal' },
  geo_vertex:         { ku: 'goşe',              tr: 'köşe',                en: 'vertex/corner' },
  geo_area:           { ku: 'rûber',             tr: 'alan',                en: 'area' },
  geo_perimeter:      { ku: 'rûdor',             tr: 'çevre uzunluğu',      en: 'perimeter', note: 'FerMat primary; "dorhêl" de kullanılır' },
  geo_symmetry:       { ku: 'hevseng',           tr: 'simetri',             en: 'symmetry', note: 'FerMat primary; "nîvhevî" alternatif' },
  geo_parallel:       { ku: 'paralel',           tr: 'paralel',             en: 'parallel' },
  geo_perpendicular:  { ku: 'lihevbirî rast',    tr: 'dik',                 en: 'perpendicular' },
  geo_2d:             { ku: 'dudîmen',           tr: 'iki boyutlu',         en: 'two-dimensional' },
  geo_3d:             { ku: 'sêdîmen',           tr: 'üç boyutlu',          en: 'three-dimensional' },
  geo_cube:           { ku: 'kûp',               tr: 'küp',                 en: 'cube' },
  geo_sphere:         { ku: 'gilor',             tr: 'küre',                en: 'sphere' },
  geo_cylinder:       { ku: 'balor',             tr: 'silindir',            en: 'cylinder' },
  geo_prism:          { ku: 'prîzma',            tr: 'prizma',              en: 'prism' },
  geo_cone:           { ku: 'konî',              tr: 'koni',                en: 'cone' },
  geo_edge:           { ku: 'rûqet',             tr: 'ayrıt',               en: 'edge' },
  geo_face:           { ku: 'rû',                tr: 'yüzey',               en: 'face/surface' },
  geo_rotation:       { ku: 'gerîn',             tr: 'dönme',               en: 'rotation' },
  geo_reflection:     { ku: 'vebeyîn',           tr: 'yansıma',             en: 'reflection' },
  geo_translation:    { ku: 'guhêztin',          tr: 'öteleme',             en: 'translation' },

  // === Pîvandin (Measurement) ===
  m_measurement: { ku: 'pîvandin',     tr: 'ölçme',           en: 'measurement' },
  m_unit:        { ku: 'yeke',         tr: 'birim',           en: 'unit' },
  m_length:      { ku: 'dirêjahî',     tr: 'uzunluk',         en: 'length' },
  m_width:       { ku: 'firehî',       tr: 'genişlik',        en: 'width' },
  m_height:      { ku: 'bilindahî',    tr: 'yükseklik',       en: 'height' },
  m_depth:       { ku: 'qûdî',         tr: 'derinlik',        en: 'depth' },
  m_distance:    { ku: 'dûrahî',       tr: 'uzaklık',         en: 'distance' },
  m_weight:      { ku: 'giranî',       tr: 'ağırlık',         en: 'weight/mass' },
  m_volume:      { ku: 'qebare',       tr: 'hacim',           en: 'volume' },
  m_time:        { ku: 'dem',          tr: 'zaman',           en: 'time' },
  m_hour:        { ku: 'demjimêr',     tr: 'saat',            en: 'hour' },
  m_minute:      { ku: 'deqe',         tr: 'dakika',          en: 'minute' },
  m_second:      { ku: 'saniye',       tr: 'saniye',          en: 'second' },
  m_day:         { ku: 'roj',          tr: 'gün',             en: 'day' },
  m_week:        { ku: 'hefte',        tr: 'hafta',           en: 'week' },
  m_month:       { ku: 'meh',          tr: 'ay',              en: 'month' },
  m_year:        { ku: 'sal',          tr: 'yıl',             en: 'year' },
  m_temp:        { ku: 'germahî',      tr: 'sıcaklık',        en: 'temperature' },
  m_money:       { ku: 'pere',         tr: 'para',            en: 'money' },
  m_hour_hand:   { ku: 'şanîdera demjimêrê', tr: 'akrep',      en: 'hour hand' },
  m_minute_hand: { ku: 'şanîdera deqeyê',    tr: 'yelkovan',   en: 'minute hand' },

  // === Aljebir (Algebra) ===
  alg_algebra:   { ku: 'aljebir',     tr: 'cebir',      en: 'algebra' },
  alg_variable:  { ku: 'guhêrbar',    tr: 'değişken',   en: 'variable' },
  alg_constant:  { ku: 'domdar',      tr: 'sabit',      en: 'constant' },
  alg_equation:  { ku: 'hevkêşe',     tr: 'denklem',    en: 'equation' },
  alg_term:      { ku: 'term',        tr: 'terim',      en: 'term' },
  alg_exponent:  { ku: 'hêz',         tr: 'üs',         en: 'exponent' },
  alg_root:      { ku: 'radîk',       tr: 'kök',        en: 'root' },
  alg_sqroot:    { ku: 'karereh (√)', tr: 'karekök',    en: 'square root' },
  alg_solution:  { ku: 'çareserî',    tr: 'çözüm',      en: 'solution' },
  alg_pattern:   { ku: 'şêweya hejmaran', tr: 'sayı örüntüsü', en: 'number pattern' },

  // === Amarî (Statistics & Probability) ===
  st_statistics: { ku: 'amarî',               tr: 'istatistik',        en: 'statistics' },
  st_data:       { ku: 'dane',                tr: 'veri',              en: 'data' },
  st_graph:      { ku: 'nexşe',               tr: 'grafik',            en: 'graph' },
  st_bar_graph:  { ku: 'nexşeya stûnî',       tr: 'sütun grafiği',     en: 'bar graph' },
  st_line_graph: { ku: 'nexşeya xêzkirî',     tr: 'çizgi grafiği',     en: 'line graph' },
  st_pie_chart:  { ku: 'nexşeya gilover',     tr: 'daire grafiği',     en: 'pie chart' },
  st_pictograph: { ku: 'nexşeya wêneyî',      tr: 'resim grafiği',     en: 'pictograph' },
  st_data_table: { ku: 'tabloya dane',        tr: 'veri tablosu',      en: 'data table' },
  st_freq_table: { ku: 'tabloya frekansê',    tr: 'frekans tablosu',   en: 'frequency table' },
  st_mean:       { ku: 'navgîn',              tr: 'ortalama',          en: 'mean/average' },
  st_median:     { ku: 'navînok',             tr: 'medyan',            en: 'median' },
  st_mode:       { ku: 'birawird',            tr: 'mod',               en: 'mode' },
  st_range:      { ku: 'rêze',                tr: 'açıklık (ranj)',    en: 'range' },
  st_probability:{ ku: 'îhtîmal',             tr: 'olasılık',          en: 'probability' },
  st_event:      { ku: 'bûyer',               tr: 'olay',              en: 'event' },
  st_frequency:  { ku: 'frekans',             tr: 'frekans',           en: 'frequency' },
  st_certain:    { ku: 'bêguman',             tr: 'kesin',             en: 'certain' },
  st_impossible: { ku: 'ne mumkin',           tr: 'imkansız',          en: 'impossible' },
  st_likely:     { ku: 'muhtemel',            tr: 'muhtemel',          en: 'likely' },

  // === Hizirkirina Matematîkî (Mathematical Thinking) ===
  th_problem:      { ku: 'pirsgirêk',    tr: 'problem',    en: 'problem' },
  th_solution:     { ku: 'çareserî',     tr: 'çözüm',      en: 'solution' },
  th_answer:       { ku: 'bersiv',       tr: 'cevap',      en: 'answer' },
  th_estimate:     { ku: 'texmîn',       tr: 'tahmin',     en: 'estimate' },
  th_rounding:     { ku: 'nêzandin',     tr: 'yuvarlama',  en: 'rounding' },
  th_rule:         { ku: 'qaîde',        tr: 'kural',      en: 'rule' },
  th_comparison:   { ku: 'berhevdan',    tr: 'karşılaştırma', en: 'comparison' },
  th_check:        { ku: 'kontrol',      tr: 'kontrol',    en: 'verification' },
  th_example:      { ku: 'mînak',        tr: 'örnek',      en: 'example' },

  // === Peyv û Gotinên Matematîkî (Math Phrases) ===
  ph_how_many:     { ku: 'çend?',         tr: 'kaç?',        en: 'how many?' },
  ph_how_much:     { ku: 'çiqas?',        tr: 'ne kadar?',   en: 'how much?' },
  ph_altogether:   { ku: 'bi giştî',      tr: 'toplam',      en: 'altogether' },
  ph_remaining:    { ku: 'dimîne',        tr: 'kalan',       en: 'remaining' },
  ph_more_than:    { ku: 'ji... zêdetir', tr: '...den fazla',en: 'more than' },
  ph_less_than:    { ku: 'ji... kêmtir',  tr: '...den az',   en: 'less than' },
  ph_each:         { ku: 'her yek',       tr: 'her biri',    en: 'each' },
  ph_together:     { ku: 'bi hev re',     tr: 'birlikte',    en: 'together' },
  ph_at_least:     { ku: 'herî kêm',      tr: 'en az',       en: 'at least' },
  ph_at_most:      { ku: 'herî zêde',     tr: 'en çok',      en: 'at most' },
  ph_largest:      { ku: 'ji hemûyan mezintir', tr: 'en büyük',  en: 'largest' },
  ph_smallest:     { ku: 'ji hemûyan biçûktir', tr: 'en küçük',  en: 'smallest' },
  ph_approximately:{ ku: 'nêzîkî',        tr: 'yaklaşık',    en: 'approximately' },
  ph_exactly:      { ku: 'tam',           tr: 'tam olarak',  en: 'exactly' },
  ph_in_order:     { ku: 'bi rêz',        tr: 'sırasıyla',   en: 'in order' },
  ph_opposite:     { ku: 'berevajî',      tr: 'tersi',       en: 'inverse/opposite' },
};

/**
 * Tek terimi üç dilde getir.
 * @example term('op_addition') → { ku: 'zêdekirin', tr: 'toplama', en: 'addition' }
 */
export function term(key) {
  return FERMAT_KU[key];
}

/**
 * Bir terimi belirli dilde getir.
 * @example ku('op_addition') → 'zêdekirin'
 */
export function ku(key) {
  return FERMAT_KU[key]?.ku ?? key;
}

/**
 * Bir terimi Türkçe döndür.
 * @example tr('op_addition') → 'toplama'
 */
export function tr(key) {
  return FERMAT_KU[key]?.tr ?? key;
}

/**
 * Bir terimi İngilizce döndür.
 */
export function en(key) {
  return FERMAT_KU[key]?.en ?? key;
}

/**
 * Kategoriye göre filtreli liste döndür.
 * @example byCategory('op_') → tüm operation termleri
 */
export function byCategory(prefix) {
  return Object.entries(FERMAT_KU)
    .filter(([key]) => key.startsWith(prefix))
    .reduce((acc, [key, val]) => { acc[key] = val; return acc; }, {});
}

export default FERMAT_KU;
