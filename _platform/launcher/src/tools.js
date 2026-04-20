/**
 * DokunSay Platform — Araç Kataloğu
 *
 * Platform menüsünde görüntülenecek her aracın meta verisi.
 * Kurmancî terminoloji FerMat sözlüğüne göre hizalıdır
 * (bkz. _platform/shared/FERMAT.ku.md).
 */

export const TOOLS = [
  {
    id: 'bar',
    name: {
      tr: 'DokunSay Bar',
      ku: 'DokunSay Bar',
      en: 'DokunSay Bar',
    },
    subtitle: {
      tr: 'Çubuklar ve Pullar',
      ku: 'Çovik û Pul',
      en: 'Rods & Chips',
    },
    description: {
      tr: 'Manipülatif çubuk ve renkli pullarla sayma, değer ve dört işlem.',
      ku: 'Hejmartin, nirx û çar kirarî — bi çovik û pulên rengîn.',
      en: 'Counting, value and four operations with manipulative rods and colored chips.',
    },
    icon: '🧮',
    color: '#f59e0b',
    ageRange: '5-10',
    topics: {
      tr: ['Sayma', 'Toplama', 'Çıkarma', 'Parça-Bütün'],
      ku: ['Hejmartin', 'Zêdekirin', 'Kemkirin', 'Par û Gişt'],
      en: ['Counting', 'Addition', 'Subtraction', 'Part-Whole'],
    },
    framework: 'CRA + Bruner',
    devUrl: 'http://localhost:3001',
    prodPath: '/DokunSayBar/',
    folder: 'DokunSayBar',
    status: 'stable',
  },
  {
    id: 'basamak',
    name: {
      tr: 'DokunSay Basamak',
      ku: 'DokunSay Nirxane',
      en: 'DokunSay Place Value',
    },
    subtitle: {
      tr: 'Basamak Değeri',
      ku: 'Nirxê Pêşekê',
      en: 'Place Value',
    },
    description: {
      tr: 'Birlik-onluk-yüzlük-binlik bloklarıyla ondalık sayı sistemi öğretimi.',
      ku: 'Pergala dehane — bi blokên yek, deh, sed û hezaran.',
      en: 'Teaching the decimal system with ones/tens/hundreds/thousands blocks.',
    },
    icon: '🔢',
    color: '#3b82f6',
    ageRange: '6-10',
    topics: {
      tr: ['Basamak Değeri', 'Gruplama', 'Bölme', 'Yer Değeri'],
      ku: ['Nirxê Pêşekê', 'Komkirin', 'Veqetandin', 'Cih û Nirx'],
      en: ['Place Value', 'Grouping', 'Decomposition', 'Positional System'],
    },
    framework: 'Bloom L1-L5 + Dienes',
    devUrl: 'http://localhost:3002',
    prodPath: '/DokunSayBasamak/',
    folder: 'DokunSayBasamak',
    status: 'stable',
  },
  {
    id: 'clock',
    name: {
      tr: 'DokunSay Clock',
      ku: 'DokunSay Saet',
      en: 'DokunSay Clock',
    },
    subtitle: {
      tr: 'Saat ve Zaman',
      ku: 'Saet û Dem',
      en: 'Time & Clock',
    },
    description: {
      tr: 'Analog ve dijital saatle zaman okuma, kavram inşası.',
      ku: 'Xwendina demê û avakirina têgeha demê — bi saeta analog û dîjîtal.',
      en: 'Time reading and concept building with analog & digital clocks.',
    },
    icon: '🕐',
    color: '#22c55e',
    ageRange: '6-9',
    topics: {
      tr: ['Saat Okuma', 'Dakika', 'Yarım/Çeyrek', 'Dijital-Analog'],
      ku: ['Xwendina Demê', 'Deqe', 'Nîv/Çarek', 'Dîjîtal-Analog'],
      en: ['Time Reading', 'Minute', 'Half/Quarter', 'Digital-Analog'],
    },
    framework: 'Piaget + CRA',
    devUrl: 'http://localhost:3003',
    prodPath: '/DokunSayClock/',
    folder: 'DokunSayClock',
    status: 'stable',
  },
  {
    id: 'kesir',
    name: {
      tr: 'DokunSay Kesir',
      ku: 'DokunSay Parjimar',
      en: 'DokunSay Fraction',
    },
    subtitle: {
      tr: 'Kesirler',
      ku: 'Parjimar',
      en: 'Fractions',
    },
    description: {
      tr: 'Bar modeli, pasta grafik ve sayı doğrusuyla kesir öğretimi.',
      ku: 'Parjimar — bi modela çovik, bi nexşeya gilover û bi jimarxêzê.',
      en: 'Fractions via bar model, pie chart and number line.',
    },
    icon: '🍕',
    color: '#ef4444',
    ageRange: '6-10',
    topics: {
      tr: ['Bütün-Parça', 'Birim Kesir', 'Denklik', 'Dört İşlem'],
      ku: ['Gişt û Par', 'Parjimara Yekane', 'Hevkêşî', 'Çar Kirarî'],
      en: ['Whole-Part', 'Unit Fraction', 'Equivalence', 'Four Operations'],
    },
    framework: 'CRA + MEB Müfredatı',
    devUrl: 'http://localhost:3004',
    prodPath: '/DokunSayFraction/',
    folder: 'DokunSayKesir',
    status: 'stable',
  },
  {
    id: 'tam',
    name: {
      tr: 'DokunSay Tam',
      ku: 'DokunSay Tam',
      en: 'DokunSay Integer',
    },
    subtitle: {
      tr: 'Tam Sayılar',
      ku: 'Hejmarên Tam',
      en: 'Integers',
    },
    description: {
      tr: 'Pozitif/negatif pullar, sıfır çifti ve senaryolarla tam sayı işlemleri.',
      ku: 'Kirarîyên hejmarên tam — bi pulên erênî û neyînî, bi cotên sifirê û bi senaryoyan.',
      en: 'Integer operations with positive/negative chips, zero pairs and scenarios.',
    },
    icon: '➕➖',
    color: '#8b5cf6',
    ageRange: '10-13',
    topics: {
      tr: ['Negatif Sayı', 'Sıfır Çifti', 'Termometre', 'Asansör'],
      ku: ['Hejmara Neyînî', 'Cotê Sifir', 'Pîvana Germahîyê', 'Asansor'],
      en: ['Negative Number', 'Zero Pair', 'Thermometer', 'Elevator'],
    },
    framework: 'Sıfır Çifti Modeli + Senaryo',
    devUrl: 'http://localhost:3005',
    prodPath: '/DokunSayExact/',
    folder: 'DokunSayTam',
    status: 'stable',
  },
  {
    id: 'geo',
    name: {
      tr: 'DokunSay Geo',
      ku: 'DokunSay Geo',
      en: 'DokunSay Geo',
    },
    subtitle: {
      tr: 'Geometri',
      ku: 'Cîyometrî',
      en: 'Geometry',
    },
    description: {
      tr: 'Van Hiele 5-faz modeliyle 2B/3B şekiller, ölçüm ve ispat.',
      ku: 'Bi modela Van Hiele ya pênc-qonax — teşeyên 2B û 3B, pîvandin û îspat.',
      en: '2D/3D shapes, measurement and proof via Van Hiele 5-phase model.',
    },
    icon: '🔺',
    color: '#14b8a6',
    ageRange: '5-14',
    topics: {
      tr: ['Şekiller', 'Geoboard', 'Tangram', 'Hiyerarşi'],
      ku: ['Teşe', 'Geoboard', 'Tangram', 'Hîyerarşî'],
      en: ['Shapes', 'Geoboard', 'Tangram', 'Hierarchy'],
    },
    framework: 'Van Hiele + Crowley',
    devUrl: 'http://localhost:3006',
    prodPath: '/dokunsay-geo/',
    folder: 'Dokunsay-geo',
    status: 'stable',
  },
  {
    id: 'veri',
    name: {
      tr: 'DokunSay Veri',
      ku: 'DokunSay Dane',
      en: 'DokunSay Data',
    },
    subtitle: {
      tr: 'Veri ve İstatistik',
      ku: 'Dane û Amarî',
      en: 'Data & Statistics',
    },
    description: {
      tr: 'Curcio seviyeleri ve GAISE ile grafik okuma, istatistiksel okuryazarlık.',
      ku: 'Xwendina nexşeyan û xwendewariya amarî — bi astên Curcio û çarçoveya GAISE.',
      en: 'Graph reading and statistical literacy with Curcio levels and GAISE.',
    },
    icon: '📊',
    color: '#ec4899',
    ageRange: '7-15',
    topics: {
      tr: ['Grafik Okuma', 'Yanıltma', 'Ortalama', 'Olasılık'],
      ku: ['Xwendina Nexşeyan', 'Xapandin', 'Navgîn', 'Îhtîmal'],
      en: ['Graph Reading', 'Deception', 'Average', 'Probability'],
    },
    framework: 'Curcio + GAISE + PPDAC',
    devUrl: 'http://localhost:3007',
    prodPath: '/dokunsay-veri/',
    folder: 'Dokunsay-veri-app',
    status: 'stable',
  },
];

export const TOOL_CATEGORIES = {
  tr: [
    { id: 'number', label: 'Sayı & İşlem', tools: ['bar', 'basamak', 'tam', 'kesir'] },
    { id: 'measure', label: 'Ölçme', tools: ['clock'] },
    { id: 'geometry', label: 'Geometri', tools: ['geo'] },
    { id: 'data', label: 'Veri', tools: ['veri'] },
  ],
  ku: [
    { id: 'number', label: 'Hejmar û Kirarî', tools: ['bar', 'basamak', 'tam', 'kesir'] },
    { id: 'measure', label: 'Pîvandin', tools: ['clock'] },
    { id: 'geometry', label: 'Cîyometrî', tools: ['geo'] },
    { id: 'data', label: 'Dane', tools: ['veri'] },
  ],
  en: [
    { id: 'number', label: 'Number & Operation', tools: ['bar', 'basamak', 'tam', 'kesir'] },
    { id: 'measure', label: 'Measurement', tools: ['clock'] },
    { id: 'geometry', label: 'Geometry', tools: ['geo'] },
    { id: 'data', label: 'Data', tools: ['veri'] },
  ],
};
