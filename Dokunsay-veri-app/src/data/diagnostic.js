export const DIAGNOSTIC_QUESTIONS_A = [
  // L0 — Veriyi Oku (doğrudan değer okuma)
  {
    id: "diag_l0_1", level: 0,
    scenario: {
      tr: "Bir grafikte Ayşe'nin topladığı elmalar gösteriliyor: Pazartesi 3, Salı 5, Çarşamba 2.",
      ku: "Grafîkek sêvên Ayşe nîşan dide: Duşem 3, Sêşem 5, Çarşem 2.",
      en: "A graph shows apples Ayşe collected: Mon 3, Tue 5, Wed 2.",
    },
    question: {
      tr: "Salı günü Ayşe kaç elma topladı?",
      ku: "Ayşe roja Sêşemê çend sêvan kom kir?",
      en: "How many apples did Ayşe collect on Tuesday?",
    },
    options: ["3", "5", "2", "10"],
    correct: 1,
  },
  {
    id: "diag_l0_2", level: 0,
    scenario: {
      tr: "Çubuk grafiği: Mavi kutu 8'e, yeşil kutu 4'e ulaşıyor.",
      ku: "Grafîka darikan: Qutîka şîn heta 8, ya kesk heta 4.",
      en: "Bar chart: Blue bar reaches 8, green reaches 4.",
    },
    question: {
      tr: "Mavi kutunun değeri kaçtır?",
      ku: "Nirxa qutîka şîn çiqas e?",
      en: "What is the value of the blue bar?",
    },
    options: ["4", "6", "8", "12"],
    correct: 2,
  },
  // L1 — Veriler Arası (karşılaştırma, toplam, fark)
  {
    id: "diag_l1_1", level: 1,
    scenario: {
      tr: "Pazartesi 3, Salı 5, Çarşamba 2, Perşembe 6 elma.",
      ku: "Duşem 3, Sêşem 5, Çarşem 2, Pêncşem 6 sêv.",
      en: "Mon 3, Tue 5, Wed 2, Thu 6 apples.",
    },
    question: {
      tr: "Hangi iki günde TOPLAM 8 elma topladı?",
      ku: "Di kîjan du rojan de BI HEV 8 sêv kom kir?",
      en: "On which two days TOGETHER did she collect 8?",
    },
    options: [
      { tr: "Pazartesi + Salı", ku: "Duşem + Sêşem", en: "Mon + Tue" },
      { tr: "Pazartesi + Çarşamba", ku: "Duşem + Çarşem", en: "Mon + Wed" },
      { tr: "Salı + Perşembe", ku: "Sêşem + Pêncşem", en: "Tue + Thu" },
      { tr: "Çarşamba + Perşembe", ku: "Çarşem + Pêncşem", en: "Wed + Thu" },
    ],
    correct: 0, // 3+5=8
  },
  {
    id: "diag_l1_2", level: 1,
    scenario: {
      tr: "Bir sınıfta 12 kız, 18 erkek öğrenci var.",
      ku: "Di polekê de 12 keç, 18 kurr hene.",
      en: "In a class: 12 girls, 18 boys.",
    },
    question: {
      tr: "Erkek öğrenci sayısı kızlardan kaç fazladır?",
      ku: "Çend kurr ji keçan zêdetir hene?",
      en: "How many more boys than girls?",
    },
    options: ["4", "6", "8", "30"],
    correct: 1,
  },
  // L2 — Veri Ötesi (eğilim, tahmin, genelleme)
  {
    id: "diag_l2_1", level: 2,
    scenario: {
      tr: "Bir bitkinin boyu son 4 haftadır her hafta 2 cm uzuyor: 5, 7, 9, 11 cm.",
      ku: "Rehekê dirêjahiya xwe her 2 cm dirêj dike: 5, 7, 9, 11 cm.",
      en: "A plant grows 2 cm each week: 5, 7, 9, 11 cm.",
    },
    question: {
      tr: "5. hafta bitkinin boyu ne kadar olur (tahmin)?",
      ku: "Di 5. hefteyê de dirêjahî çiqas dibe?",
      en: "What would height be in week 5 (predict)?",
    },
    options: ["12 cm", "13 cm", "14 cm", "15 cm"],
    correct: 1, // 11 + 2 = 13
  },
  {
    id: "diag_l2_2", level: 2,
    scenario: {
      tr: "Bir dondurmacının satışları: Ocak 50, Şubat 80, Mart 120, Nisan 180, Mayıs 250.",
      ku: "Firotina dondurmê: Çile 50, Sibat 80, Adar 120, Nîsan 180, Gulan 250.",
      en: "Ice cream sales: Jan 50, Feb 80, Mar 120, Apr 180, May 250.",
    },
    question: {
      tr: "Bu grafiğin ne tür bir eğilimi var?",
      ku: "Ev grafîk çi meyla nîşan dide?",
      en: "What trend does this show?",
    },
    options: [
      { tr: "Sabit kalıyor", ku: "Aram dimîne", en: "Staying constant" },
      { tr: "Artıyor", ku: "Zêde dibe", en: "Increasing" },
      { tr: "Azalıyor", ku: "Kêm dibe", en: "Decreasing" },
      { tr: "Rastgele", ku: "Bêkêş", en: "Random" },
    ],
    correct: 1,
  },
  // L3 — Veri Ardı (yanıltma, bağlam, nedensellik)
  {
    id: "diag_l3_1", level: 3,
    scenario: {
      tr: "Bir grafik y-ekseninde 80'den başlayıp 100'e kadar gidiyor (normalde 0'dan başlar). İki şirketin satışları 82 ve 85 olarak gösterilmiş, fark çok büyük görünüyor.",
      ku: "Grafîkek y-destpêkî ji 80 ye heta 100, du şirket 82 û 85. Cudahî mezin xuya dike.",
      en: "A graph's y-axis starts at 80 (not 0). Two companies: 82 vs 85, looks like a huge difference.",
    },
    question: {
      tr: "Bu grafikte ne YANLIŞ var?",
      ku: "Di vê grafîkê de çi çewtî heye?",
      en: "What's WRONG with this graph?",
    },
    options: [
      { tr: "Renkler yanlış", ku: "Reng çewt in", en: "Wrong colors" },
      { tr: "Y-ekseni 0'dan başlamıyor, fark abartılmış", ku: "Y ne ji 0 ye, cudahî pir xuya dike", en: "Y-axis doesn't start at 0, difference exaggerated" },
      { tr: "Çok az veri var", ku: "Dane pir kêm in", en: "Too little data" },
      { tr: "Hiçbir şey yanlış değil", ku: "Tiştek çewt nîne", en: "Nothing is wrong" },
    ],
    correct: 1,
  },
  {
    id: "diag_l3_2", level: 3,
    scenario: {
      tr: "Dondurma satışları yazın artıyor, aynı zamanda boğulma olayları da artıyor. Bir grafik ikisini birlikte gösteriyor.",
      ku: "Firotina dondurmê û bûyerên xeniqandinê herdu havînê zêde dibin.",
      en: "Ice cream sales rise in summer; drowning incidents also rise.",
    },
    question: {
      tr: "Bu grafik neyi KANITLAMAZ?",
      ku: "Ev grafîk çi DERNEXÎNE?",
      en: "What does this graph NOT prove?",
    },
    options: [
      { tr: "Yazın dondurma daha çok satılıyor", ku: "Havînê dondurm zêdetir tê firotin", en: "Ice cream sells more in summer" },
      { tr: "Yazın boğulma daha çok oluyor", ku: "Havînê xeniqandin zêdetir diqewime", en: "More drowning in summer" },
      { tr: "Dondurma yemek boğulmaya sebep olur", ku: "Xwarina dondurmê dibe sedema xeniqandinê", en: "Eating ice cream causes drowning" },
      { tr: "İkisi de yaz mevsiminde zirve yapıyor", ku: "Herdu havînê lûtkê dikin", en: "Both peak in summer" },
    ],
    correct: 2, // korelasyon ≠ nedensellik
  },
];

export const DIAGNOSTIC_QUESTIONS_B = [
  // L0 — Veriyi Oku
  {
    id: "diag_l0_1", level: 0,
    scenario: {
      tr: "Bir grafikte Mert'in okuduğu kitaplar gösteriliyor: Mart 4, Nisan 7, Mayıs 3.",
      ku: "Grafîkek pirtûkên Mert dixwîne nîşan dide: Adar 4, Nîsan 7, Gulan 3.",
      en: "A graph shows books Mert read: Mar 4, Apr 7, May 3.",
    },
    question: {
      tr: "Nisan'da Mert kaç kitap okudu?",
      ku: "Mert di Nîsanê de çend pirtûk xwend?",
      en: "How many books did Mert read in April?",
    },
    options: ["3", "4", "7", "14"],
    correct: 2,
  },
  {
    id: "diag_l0_2", level: 0,
    scenario: {
      tr: "Çubuk grafiği: Sarı çubuk 9'a, kırmızı çubuk 6'ya ulaşıyor.",
      ku: "Grafîka darikan: Darika zer heta 9, ya sor heta 6.",
      en: "Bar chart: Yellow bar reaches 9, red reaches 6.",
    },
    question: {
      tr: "Kırmızı çubuğun değeri kaçtır?",
      ku: "Nirxa darika sor çiqas e?",
      en: "What is the value of the red bar?",
    },
    options: ["3", "6", "9", "15"],
    correct: 1,
  },
  // L1 — Veriler Arası
  {
    id: "diag_l1_1", level: 1,
    scenario: {
      tr: "Mart 4, Nisan 7, Mayıs 3, Haziran 6 kitap.",
      ku: "Adar 4, Nîsan 7, Gulan 3, Hezîran 6 pirtûk.",
      en: "Mar 4, Apr 7, May 3, Jun 6 books.",
    },
    question: {
      tr: "Hangi iki ayda TOPLAM 10 kitap okudu?",
      ku: "Di kîjan du mehan de BI HEV 10 pirtûk xwend?",
      en: "In which two months TOGETHER did he read 10?",
    },
    options: [
      { tr: "Mart + Haziran", ku: "Adar + Hezîran", en: "Mar + Jun" },
      { tr: "Nisan + Mayıs", ku: "Nîsan + Gulan", en: "Apr + May" },
      { tr: "Nisan + Haziran", ku: "Nîsan + Hezîran", en: "Apr + Jun" },
      { tr: "Mart + Mayıs", ku: "Adar + Gulan", en: "Mar + May" },
    ],
    correct: 0, // 4+6=10
  },
  {
    id: "diag_l1_2", level: 1,
    scenario: {
      tr: "Bir kütüphanede 25 roman, 40 bilim kitabı var.",
      ku: "Di pirtûkxanê de 25 roman, 40 pirtûkên zanistî hene.",
      en: "Library has 25 novels, 40 science books.",
    },
    question: {
      tr: "Bilim kitabı sayısı romandan kaç fazladır?",
      ku: "Çend pirtûkên zanistî ji romanan zêdetir in?",
      en: "How many more science books than novels?",
    },
    options: ["10", "15", "20", "65"],
    correct: 1,
  },
  // L2 — Veri Ötesi
  {
    id: "diag_l2_1", level: 2,
    scenario: {
      tr: "Bir çocuk haftada 3 cm büyüyor: Hafta 1: 100, Hafta 2: 103, Hafta 3: 106, Hafta 4: 109 cm.",
      ku: "Zarokek her heftê 3 cm dirêj dibe: Hefte 1: 100, Hefte 2: 103, Hefte 3: 106, Hefte 4: 109.",
      en: "A child grows 3 cm/week: Wk1 100, Wk2 103, Wk3 106, Wk4 109 cm.",
    },
    question: {
      tr: "6. hafta boyu kaç olur (tahmin)?",
      ku: "Di hefteya 6emîn de çiqas dibe?",
      en: "Predict height in week 6?",
    },
    options: ["112 cm", "115 cm", "118 cm", "120 cm"],
    correct: 1, // 109 + 3 + 3 = 115
  },
  {
    id: "diag_l2_2", level: 2,
    scenario: {
      tr: "Bir köyde nüfus: 2010'da 800, 2015'te 600, 2020'de 450, 2025'te 320.",
      ku: "Nifûsa gundek: 2010 de 800, 2015 de 600, 2020 de 450, 2025 de 320.",
      en: "Village population: 2010: 800, 2015: 600, 2020: 450, 2025: 320.",
    },
    question: {
      tr: "Bu veriler hangi eğilimi gösteriyor?",
      ku: "Ev dane çi meyla nîşan didin?",
      en: "What trend do these show?",
    },
    options: [
      { tr: "Hızla artıyor", ku: "Bi lez zêde dibe", en: "Rapidly increasing" },
      { tr: "Sürekli azalıyor", ku: "Berdewam kêm dibe", en: "Continuously decreasing" },
      { tr: "Dalgalanıyor", ku: "Dalge dike", en: "Fluctuating" },
      { tr: "Sabit kalıyor", ku: "Aram dimîne", en: "Staying constant" },
    ],
    correct: 1,
  },
  // L3 — Veri Ardı
  {
    id: "diag_l3_1", level: 3,
    scenario: {
      tr: "Bir reklamda pasta grafik: A markası %48, B markası %52. Ama toplam ankette yalnızca 50 kişi soruldu.",
      ku: "Grafîka keka: marka A %48, marka B %52. Lê tenê 50 kes hatine pirsîn.",
      en: "Pie chart: Brand A 48%, Brand B 52%. But only 50 people surveyed.",
    },
    question: {
      tr: "Bu grafiğin GÜVENİLİRLİĞİ hakkında ne söylersin?",
      ku: "Ji bo bawerbûna vê grafîkê çi dibêjî?",
      en: "What about this graph's RELIABILITY?",
    },
    options: [
      { tr: "Tamamen güvenilir", ku: "Bi temamî bawer", en: "Fully reliable" },
      { tr: "Örneklem çok küçük — yanlı olabilir", ku: "Dane pir kêm in — dibe şaş be", en: "Sample too small — may be biased" },
      { tr: "Pasta grafik yanlış tercih", ku: "Keka çewt hilbijartin", en: "Pie chart wrong choice" },
      { tr: "Renkler karışık", ku: "Reng tevlihev in", en: "Colors confusing" },
    ],
    correct: 1,
  },
  {
    id: "diag_l3_2", level: 3,
    scenario: {
      tr: "Bir gazete haberi: 'Öğrencilerin kahvaltı yapması okul notlarını artırıyor' diyor. Kanıt: kahvaltı yapanların not ortalaması daha yüksek.",
      ku: "Nûçe dibêje: 'Taştê xwarina xwendekaran notên wan bilind dike.'",
      en: "News: 'Eating breakfast raises students' grades.' Evidence: breakfast-eaters have higher averages.",
    },
    question: {
      tr: "Bu iddianın ZAYIF noktası ne?",
      ku: "Di vê îdîayê de cihê zêf çi ye?",
      en: "What's the WEAK point of this claim?",
    },
    options: [
      { tr: "Ortalama yanlış hesaplanmış", ku: "Navînî çewt hesab kiriye", en: "Average miscalculated" },
      { tr: "Kahvaltı yapan çocukların ailesi daha varlıklı/düzenli olabilir (karıştırıcı)", ku: "Dibe ku malbatên ku taştê dixwin bêtir dewlemend bin (sedemek din)", en: "Breakfast-eaters may have wealthier/more stable families (confounder)" },
      { tr: "Grafik yok", ku: "Grafîk tune", en: "No graph shown" },
      { tr: "Kahvaltı önemsizdir", ku: "Taştê ne giring e", en: "Breakfast is unimportant" },
    ],
    correct: 1, // karıştırıcı değişken
  },
];

export function getDiagnosticSet(kind) {
  return kind === "post" ? DIAGNOSTIC_QUESTIONS_B : DIAGNOSTIC_QUESTIONS_A;
}

// Geriye uyumluluk: eski kodlar DIAGNOSTIC_QUESTIONS'a başvurabilir (varsayılan A)
export const DIAGNOSTIC_QUESTIONS = DIAGNOSTIC_QUESTIONS_A;

export function resolveOption(opt, lang) {
  if (typeof opt === "string") return opt;
  if (opt && typeof opt === "object") return opt[lang] || opt.tr || "";
  return "";
}

export function computeStartLevel(answers, kind = "pre") {
  // answers: { diag_l0_1: true, diag_l0_2: false, ... }
  const perLevel = { 0: [], 1: [], 2: [], 3: [] };
  const questions = getDiagnosticSet(kind);
  questions.forEach(q => {
    perLevel[q.level].push(answers[q.id] === true);
  });
  // Her seviyede kaç doğru?
  const scores = [0, 1, 2, 3].map(lv => ({
    level: lv,
    correct: perLevel[lv].filter(Boolean).length,
    total: perLevel[lv].length,
  }));

  // Bir seviyeyi "tam geçmiş" sayılması için 2/2 doğru
  let highestPassed = -1;
  for (let lv = 0; lv <= 3; lv++) {
    if (scores[lv].correct >= 2) highestPassed = lv;
    else break; // alt seviyeyi geçemediyse üst seviyeye bakma
  }
  // Öneri: geçtiği en yüksek + 1, ama L3'ü geçtiyse yine L3
  let recommended = Math.min(3, highestPassed + 1);
  // Hiç seviye geçemediyse L0'dan başla
  if (highestPassed < 0) recommended = 0;
  return { scores, recommended };
}

export function saveTestResult(studentId, kind, answers) {
  if (!studentId) return;
  try {
    const key = `dv_tests_${studentId}`;
    const existing = JSON.parse(localStorage.getItem(key) || "{}");
    const questions = getDiagnosticSet(kind);
    const { scores, recommended } = computeStartLevel(answers, kind);
    const result = {
      date: Date.now(),
      answers,
      scores,
      recommended,
      kind, // A/B set izleme
      totalCorrect: Object.values(answers).filter(Boolean).length,
      total: questions.length,
    };
    if (kind === "pre") {
      existing.preTest = result;
    } else {
      existing.postTests = existing.postTests || [];
      existing.postTests.push(result);
    }
    localStorage.setItem(key, JSON.stringify(existing));
    return result;
  } catch (e) { return null; }
}

export function loadTestResult(studentId) {
  if (!studentId) return null;
  try {
    const key = `dv_tests_${studentId}`;
    return JSON.parse(localStorage.getItem(key) || "{}");
  } catch (e) { return null; }
}
