export const LEVEL_COLORS = {
  0: { color: "#10b981", label: { tr: "Veriyi Oku", ku: "Daneyê Bixwîne", en: "Read Data" }},
  1: { color: "#3b82f6", label: { tr: "Arası Oku", ku: "Di Nav De", en: "Between" }},
  2: { color: "#8b5cf6", label: { tr: "Ötesi Oku", ku: "Wêdetir", en: "Beyond" }},
  3: { color: "#ef4444", label: { tr: "Ardını Oku", ku: "Piştî", en: "Behind" }},
};

export const CURCIO_LEVELS = [
  {
    id: 0, key: "read_data",
    // Curcio'nun "Read the Data" seviyesi
    name: {
      tr: "Veriyi Oku",
      ku: "Daneyê Bixwîne",
      en: "Read the Data"
    },
    shortName: { tr: "Oku", ku: "Bixwîne", en: "Read" },
    color: "#10b981",       // yeşil — en temel
    colorSoft: "#d1fae5",
    icon: "👁️",
    ageRange: "7-9",
    // Bu seviyedeki öğrencinin yaptığı
    canDo: {
      tr: [
        "Grafikten doğrudan değer okur ('kaç öğrenci matematik sevdi?')",
        "Tabloyu satır/sütun olarak okur",
        "En büyük, en küçük değeri gösterir",
        "Basit çubuk, resim grafiği, tabloyu anlar",
      ],
      ku: [
        "Ji grafîkê rasterast nirxê dixwîne",
        "Tabloyê bi rêz û stûnan dixwîne",
        "Nirxa herî mezin û biçûk nîşan dide",
        "Grafîkên darikî yên sade, tabloyê fêm dike",
      ],
      en: [
        "Reads values directly from graph",
        "Reads rows/columns of a table",
        "Identifies largest and smallest value",
        "Understands simple bar, pictograph, table",
      ]
    },
    cannotDo: {
      tr: "Henüz veriler arası karşılaştırma yapamaz. 'Kaç kat daha fazla?' sorusuna güçlük çeker.",
      ku: "Hîn jî beramberkirina daneyan nake. Bersiva 'çend qat zêdetir' dijwar e.",
      en: "Cannot yet compare values. Struggles with 'how many times more?'"
    },
    goals: {
      tr: [
        "Çubuk grafikten doğru okuma",
        "Tablo başlığı ve eksenleri anlama",
        "'En çok / en az' kavramı",
      ],
      ku: [
        "Xwendina rast ji grafîka darikî",
        "Fêmkirina sernav û eksên tabloyê",
        "Têgîna 'herî zêde / herî kêm'",
      ],
      en: [
        "Reading bar charts accurately",
        "Understanding axis labels and titles",
        "Most / least concepts",
      ]
    },
    teacherFocus: {
      tr: "Öğrenci grafiğe bakıp HEMEN bir değer bulabilmeli. 'Çubuk ne kadar uzun?' 'Tabloda kaç yazıyor?' gibi doğrudan sorular.",
      ku: "Divê xwendekar li grafîkê binêre û ZÛ nirxek bibîne. Pirsên rasterast: 'Ev çend e?'",
      en: "Student should look at the graph and IMMEDIATELY find a value. Direct questions."
    },
    teacherAvoid: {
      tr: "Çok sayıda çubuk/veri içeren karmaşık grafik verme. Renkleri karıştırmayan, net eksen etiketleri olan grafikler seç.",
      ku: "Grafîkên tevlihev bi gelek darikan nede. Grafîkên bi ekseneyên zelal hilbijêre.",
      en: "Don't give complex multi-bar graphs. Choose graphs with clear labels, not too many bars."
    },
    commonMisconceptions: ["friel_axis", "pictograph_unit"],
    passCriteria: { minActivities: 3, minCorrect: 2 },
  },
  {
    id: 1, key: "read_between",
    name: {
      tr: "Veriler Arası Oku",
      ku: "Di Navbera Daneyan de Bixwîne",
      en: "Read Between the Data"
    },
    shortName: { tr: "Karşılaştır", ku: "Bide ber hev", en: "Compare" },
    color: "#3b82f6",       // mavi
    colorSoft: "#dbeafe",
    icon: "⚖️",
    ageRange: "9-12",
    canDo: {
      tr: [
        "Değerler arası fark ve oran hesaplar ('2 kat fazla')",
        "En çok ve en az arasındaki farkı bulur (değişim aralığı)",
        "Toplam, ortalama gibi basit özetler oluşturur",
        "Birden fazla grafiği karşılaştırır",
      ],
      ku: [
        "Cudahî û rêjeya di navbera nirxan de dihesibîne",
        "Cudahiya di navbera herî mezin û herî kêm de dibîne",
        "Kurtenîkên sade (zêdok, navgîn) çêdike",
        "Çend grafîkan bi hev re berawird dike",
      ],
      en: [
        "Calculates differences and ratios between values",
        "Finds range (max - min)",
        "Makes simple summaries (total, average)",
        "Compares multiple graphs",
      ]
    },
    cannotDo: {
      tr: "Henüz veriye dayalı tahmin yapamaz. 'Grafik bu şekilde devam ederse ne olur?' sorusuna cevap veremez.",
      ku: "Hîn jî li ser bingeha daneyan pêşbînî nake.",
      en: "Cannot yet make predictions based on data."
    },
    goals: {
      tr: [
        "Fark, oran, toplam hesaplama",
        "Aralık (range) kavramı",
        "Ortalama / medyan / mod tanıma",
        "İki grafik karşılaştırma",
      ],
      ku: [
        "Hesabê cudahî, rêje û zêdokê",
        "Têgîna berfirehiyê",
        "Naskirina navgîn / medyan / mod",
        "Berawirdkirina du grafîkan",
      ],
      en: [
        "Calculate difference, ratio, total",
        "Range concept",
        "Recognize mean / median / mode",
        "Compare two graphs",
      ]
    },
    teacherFocus: {
      tr: "İki çubuk arası HESAP gerektirir. 'Kaç fazla?' 'Kaç kat?' 'Toplam kaç?' Öğrenci hesap yapar.",
      ku: "Di navbera du darikan de HESAB pêwîst e. 'Çend zêdetir?' 'Çend qat?'",
      en: "Calculation REQUIRED between two bars. 'How many more?' 'How many times?'"
    },
    teacherAvoid: {
      tr: "Ortalamayı 'en sık' olarak tanıtma (Watson & Callingham yanılgısı). Mean/median/mode her biri FARKLI bir soruyu cevaplar.",
      ku: "Navgîn wek 'ya herî pir' nîşan mede. Navgîn/medyan/mod cuda ne.",
      en: "Don't teach mean as 'most common' (Watson yanılgısı). Each measure answers a different question."
    },
    commonMisconceptions: ["watson_mean", "garfield_variability", "friel_axis"],
    passCriteria: { minActivities: 3, minCorrect: 2 },
  },
  {
    id: 2, key: "read_beyond",
    name: {
      tr: "Veri Ötesini Oku",
      ku: "Li Derveyê Daneyan Bixwîne",
      en: "Read Beyond the Data"
    },
    shortName: { tr: "Yorumla", ku: "Şîrove bike", en: "Interpret" },
    color: "#8b5cf6",       // mor
    colorSoft: "#ede9fe",
    icon: "🔮",
    ageRange: "12-14",
    canDo: {
      tr: [
        "Veriye dayanarak tahmin yapar ('gelecek ay ne beklenir?')",
        "Olasılık tahmini yapar",
        "Örneklemden popülasyona genelleme yapar",
        "Grafikte görünmeyen bilgiyi çıkarsar",
      ],
      ku: [
        "Li ser bingeha daneyan pêşbînî dike",
        "Texmîna îhtîmalê dike",
        "Ji nimûneyê gelek kes gelemperkirin dike",
        "Agahiya neyê dîtin ji grafîkê derxîne",
      ],
      en: [
        "Makes predictions from data",
        "Estimates probability",
        "Generalizes from sample to population",
        "Infers unseen information",
      ]
    },
    cannotDo: {
      tr: "Veri toplama sürecini henüz eleştirel değerlendirmez. 'Örneklem yeterince büyük mü? Kim soruldu?' sorularını sormaz.",
      ku: "Pêvajoya komkirina daneyan hîn rexnegir nake.",
      en: "Doesn't yet critically evaluate data collection process."
    },
    goals: {
      tr: [
        "Trend ve eğilim (trend) tanıma",
        "Basit tahmin ve ekstrapolasyon",
        "Olasılık kavramı",
        "Örneklem - evren ilişkisi",
      ],
      ku: [
        "Naskirina meyil û guherîn",
        "Pêşbîniya sade û ekstrapolasyon",
        "Têgîna îhtîmalê",
      ],
      en: [
        "Trend recognition",
        "Simple prediction and extrapolation",
        "Probability concept",
      ]
    },
    teacherFocus: {
      tr: "Grafikten hareketle YORUM + TAHMİN. 'Yarın yağmur yağma olasılığı yüksek mi?' 'Bu sınıfta her iki çocuktan biri ne kadar?' Çıkarsama odaklı.",
      ku: "Ji grafîkê ŞÎROVE û PÊŞBÎNÎ. 'Sibe barandin tê çawa?'",
      en: "INTERPRETATION + PREDICTION from the graph. Inference-focused."
    },
    teacherAvoid: {
      tr: "Kesinlikten bahsetme. 'Bu kesindir' yerine 'Bu muhtemeldir' dili kullan. Veri = gerçek değil, veri = ipucu.",
      ku: "Qet'îyetê mebêje. 'Ev teqez e' li şûna 'Ev îhtîmalî ye' bêje.",
      en: "Don't speak in certainties. Say 'likely' not 'definitely'. Data = clue, not truth."
    },
    commonMisconceptions: ["kahneman_small_sample", "prediction_certainty"],
    passCriteria: { minActivities: 3, minCorrect: 2 },
  },
  {
    id: 3, key: "read_behind",
    name: {
      tr: "Verinin Arkasını Oku",
      ku: "Li Paş Daneyan Bixwîne",
      en: "Read Behind the Data"
    },
    shortName: { tr: "Sorgula", ku: "Bipirse", en: "Question" },
    color: "#ef4444",       // kırmızı — en eleştirel
    colorSoft: "#fee2e2",
    icon: "🔍",
    ageRange: "14+",
    canDo: {
      tr: [
        "Grafikte yanıltmayı tespit eder (kesik y-ekseni, kötü ölçek)",
        "Veri kaynağını sorgular ('Kim topladı? Neden?')",
        "Örneklem yanlılığını fark eder",
        "İstatistik + yalan ayrımını yapar",
      ],
      ku: [
        "Xapandinê di grafîkê de dibîne",
        "Çavkaniya daneyan dipirse",
        "Tevliheviya nimûneyê dibîne",
      ],
      en: [
        "Detects misleading graphs (truncated y-axis, bad scale)",
        "Questions data source ('Who collected? Why?')",
        "Recognizes sample bias",
      ]
    },
    cannotDo: {
      tr: "Bu seviye istatistik okuryazarlığının ZİRVESİ — bundan sonra formel istatistik (hipotez testi, güven aralığı) gelir.",
      ku: "Ev ast jorîntirîn asta xwendeşîrovekirina statîstîkê ye.",
      en: "This is the PEAK of statistical literacy — next comes formal statistics."
    },
    goals: {
      tr: [
        "Yanıltıcı grafik türlerini tanıma",
        "Örneklem yanlılığı kavramı",
        "İstatistiksel tuzaklara direnç (Huff 1954)",
        "Eleştirel veri tüketicisi olmak",
      ],
      ku: [
        "Naskirina grafîkên xapînok",
        "Têgîna aliyê nimûneyê",
        "Berxwedan li hember xefkên statîstîkî",
      ],
      en: [
        "Recognize misleading graph types",
        "Sample bias concept",
        "Resistance to statistical traps (Huff 1954)",
        "Be a critical data consumer",
      ]
    },
    teacherFocus: {
      tr: "HER grafik şüpheli. 'Neden bu grafiği gösteriyorlar? Eksenler adil mi? Veri nereden?' Demokratik vatandaşlık için kritik.",
      ku: "HER grafîk şikbar e. 'Çima vê grafîkê nîşan didin?'",
      en: "EVERY graph is suspect. 'Why are they showing this? Are axes fair?'"
    },
    teacherAvoid: {
      tr: "Paranoyaya düşme. Her grafik yalan değil — ama her grafik SORGULANMALI. Denge öğret.",
      ku: "Nekeve paranoyayê. Ne her grafîk derew e — lê divê her yek bê pirsîn.",
      en: "Don't become paranoid. Not every graph lies — but every graph DESERVES questioning."
    },
    commonMisconceptions: ["huff_truncated_axis", "huff_pie_3d", "sample_bias"],
    passCriteria: { minActivities: 3, minCorrect: 2 },
  },
];

export const GAISE_LEVELS = {
  A: { tr: "Temel (İlkokul)", ku: "Bingehîn", en: "Beginning (Primary)", ageRange: "7-10" },
  B: { tr: "Orta (Ortaokul)", ku: "Navîn", en: "Intermediate (Middle)", ageRange: "10-13" },
  C: { tr: "İleri (Lise)", ku: "Pêşketî", en: "Advanced (High)", ageRange: "13+" },
};

export const PPDAC_PHASES = [
  { id: "P1", key: "problem", icon: "❓",
    name: { tr: "Problem", ku: "Pirsgirêk", en: "Problem" },
    desc: { tr: "Ne sormak istiyorum? Soru net mi?",
            ku: "Çi dixwazim bipirsim? Pirs zelal e?",
            en: "What do I want to ask? Is the question clear?" } },
  { id: "P2", key: "plan", icon: "📋",
    name: { tr: "Plan", ku: "Plan", en: "Plan" },
    desc: { tr: "Nasıl cevap bulacağım? Kimden veri toplayacağım?",
            ku: "Çawa bersivê bibînim?",
            en: "How will I find an answer? Who will I ask?" } },
  { id: "D", key: "data", icon: "📦",
    name: { tr: "Veri", ku: "Dane", en: "Data" },
    desc: { tr: "Veriyi nasıl topluyorum, kaydediyorum?",
            ku: "Daneyê çawa berhev dikim?",
            en: "How do I collect and record data?" } },
  { id: "A", key: "analyze", icon: "📊",
    name: { tr: "Analiz", ku: "Analîz", en: "Analyze" },
    desc: { tr: "Grafik, tablo, ortalama — veri bana ne söylüyor?",
            ku: "Grafîk, tablo — dane çi dibêje?",
            en: "Graph, table, average — what does the data say?" } },
  { id: "C", key: "conclude", icon: "💡",
    name: { tr: "Sonuç", ku: "Encam", en: "Conclude" },
    desc: { tr: "Ne öğrendim? İlk sorumun cevabı nedir?",
            ku: "Çi fêr bûm?",
            en: "What did I learn? Answer to original question?" } },
];

// Kimlikten yanılgı kaydına çözümleme. ReadModule/DeceiveModule etiketi bunu kullanır;
// eskiden ham kimlik ("watson_mean") çocuğun ekranına basılıyordu (2026-07-19 denetimi).
export function findMisconception(id) {
  if (!id) return null;
  for (const list of Object.values(MISCONCEPTIONS)) {
    const hit = list.find(m => m.id === id);
    if (hit) return hit;
  }
  return null;
}

export const MISCONCEPTIONS = {
  graph_reading: [
    { id: "friel_axis", src: "Friel, Curcio & Bright 2001", level: 0,
      tr: "Eksen etiketleri göz ardı edilir — 'çubuk ne kadar uzun?' diye bakılır, birim (kişi, TL, %) dikkate alınmaz.",
      ku: "Etîketên ekseneyan nayên hesibandin — tenê dirêjahiya darikê tê nêrîn.",
      en: "Axis labels ignored — student only looks at bar length, not unit (people, $, %)." },
    { id: "pictograph_unit", src: "Friel et al. 2001", level: 0,
      tr: "Resim grafiğinde bir ikon = kaç kişi olduğu unutulur (örn. 1 insan ikonu = 10 kişi).",
      ku: "Di grafîka wêneyî de yek îkon = çend kes ji bîr dibe.",
      en: "In pictographs, '1 icon = X people' is forgotten." },
    // Uzunluk yargısı orana çevrilirken bozulur — Cleveland & McGill'in klasik
    // grafiksel algı sıralaması (uzunluk > alan > açı) bu yanılgının kaynağıdır.
    { id: "cleveland_height_ratio", src: "Cleveland & McGill 1984, JASA 79(387)", level: 1,
      tr: "Çubuğun YÜKSEKLİĞİ ile ORAN karıştırılır: iki kat uzun çubuk 'iki kat fazla' sanılır, ama eksen 0'dan başlamıyorsa bu yanlıştır. Alan/açı ile kodlanan grafiklerde (pasta, balon) hata daha da büyür.",
      ku: "Bilindahiya darikê bi rêjeyê tê tevlihevkirin: darika du qat dirêj 'du qat zêdetir' tê fikirîn — heke eksen ne ji 0 be ev xelet e.",
      en: "Bar HEIGHT confused with RATIO: a twice-as-tall bar is read as 'twice as much', but that only holds if the axis starts at 0. Error grows for area/angle encodings (pie, bubble)." },
  ],
  central_tendency: [
    { id: "watson_mean", src: "Watson & Callingham 2003", level: 1,
      tr: "Ortalama 'en sık görülen' sanılır — aslında mod budur. Mean = toplam/sayı.",
      ku: "Navgîn wek 'ya herî pir' tê fikirîn — ev mod e, ne navgîn.",
      en: "Mean confused with 'most common' — that's mode. Mean = sum/count." },
    { id: "garfield_variability", src: "Garfield & Ben-Zvi 2005", level: 1,
      tr: "'Ortalama her şeyi anlatır' sanılır — ama yayılım (varyans) da kritiktir. İki grubun ortalaması aynı olabilir ama biri çok çeşitli, diğeri homojendir.",
      ku: "Tê fikirîn ku 'navgîn her tiştî dibêje' — lê belavbûn jî giring e.",
      en: "'Mean tells everything' fallacy — but spread (variance) matters. Same mean, very different spreads." },
    // Mokros & Russell: çocuklar ortalamayı ya salt algoritma ya da "tipik değer"
    // sayar; ikisini bağdaştıramaz. Watson yanılgısının tamamlayıcısıdır.
    { id: "mokros_typical", src: "Mokros & Russell 1995, JRME 26(1), 20-39", level: 1,
      tr: "Ortalama 'tipik/ortadaki değer' sanılır, dolayısıyla veride GERÇEKTEN bulunması beklenir. Oysa 4 kişilik ailelerde ortalama 2.4 çocuk olabilir — hiçbir ailede 2.4 çocuk yoktur. Ortalama bir veri noktası değil, bir dengeleme noktasıdır.",
      ku: "Navgîn wek 'nirxa tîpîk' tê fikirîn û tê hêvîkirin ku di daneyan de HEBE. Lê navgîna 2.4 zarok di tu malbatê de tune ye.",
      en: "Mean read as the 'typical value', so students expect it to actually OCCUR in the data. But mean family size can be 2.4 children — no family has 2.4. The mean is a balance point, not a data point." },
    // Pollatsek: ortalamaların ortalaması — ağırlık yok sayılır.
    { id: "pollatsek_weighted", src: "Pollatsek, Lima & Well 1981, Educ. Studies in Math. 12, 191-204", level: 2,
      tr: "İki grubun ortalaması yeniden ortalanır: 10 kişilik sınıf 90, 30 kişilik sınıf 50 aldıysa genel ortalama (90+50)/2 = 70 sanılır. Doğrusu ağırlıklıdır: (10·90 + 30·50)/40 = 60. Grup BÜYÜKLÜĞÜ yok sayılır.",
      ku: "Navgîna du koman ji nû ve tê navgînkirin — mezinahiya komê nayê hesibandin. Rast: navgîna giranîdar.",
      en: "Averaging the averages: class of 10 scores 90, class of 30 scores 50 → students say (90+50)/2 = 70. Correct is weighted: (10·90 + 30·50)/40 = 60. Group SIZE is ignored." },
  ],
  correlation: [
    // Batanero ve ark.: ilişki kurma stratejileri — nedensel yorum baskındır.
    { id: "batanero_causation", src: "Batanero, Estepa, Godino & Green 1996, JRME 27(2), 151-169", level: 2,
      tr: "Birlikte değişen iki şey arasında NEDEN-SONUÇ kurulur. 'Dondurma satışı artınca boğulma artıyor, demek ki dondurma boğulmaya yol açıyor.' — İkisini de yaz sıcağı artırıyor (üçüncü değişken). İlişki nedensellik DEĞİLDİR.",
      ku: "Di navbera du tiştên bi hev re diguherin de sedem-encam tê danîn. 'Firotina qeşayê zêde dibe, xeniqîn zêde dibe' — herduyan germahiya havînê zêde dike.",
      en: "Two things that move together are read as cause and effect. 'Ice cream sales rise, so do drownings — ice cream causes drowning.' Summer heat drives both (third variable). Correlation is NOT causation." },
    { id: "batanero_direction", src: "Batanero et al. 1996; Shaughnessy 2007, NCTM Second Handbook", level: 3,
      tr: "Nedenin YÖNÜ keyfi seçilir. 'Çok kitap okuyanların notu yüksek' → kitap notu mu yükseltir, yoksa iyi öğrenci mi çok okur? Veri tek başına yönü söylemez; bunun için deney gerekir.",
      ku: "Alîyê sedemê bi keyfî tê hilbijartin. Dane bi tenê alî nabêje — ceribandin lazim e.",
      en: "The DIRECTION of causation is picked arbitrarily. 'Heavy readers get better grades' — does reading raise grades, or do strong students read more? Data alone cannot say; that needs an experiment." },
  ],
  prediction: [
    { id: "kahneman_small_sample", src: "Kahneman & Tversky (Law of Small Numbers)", level: 2,
      tr: "Küçük örneklemden genel yargı: '10 kişiyle anket yaptım, %60 mavi dedi, demek ki dünyanın %60'ı mavi seviyor.' — yanlış.",
      ku: "Ji nimûneya biçûk tê gotin ku hemû cîhan wisa ye — xelet e.",
      en: "Small sample, big conclusion: 'Asked 10 people, 60% said blue — so 60% of world loves blue' — wrong." },
    { id: "prediction_certainty", src: "GAISE 2020", level: 2,
      tr: "Tahmin = kesinlik sanılır. 'Yağmur yağacak' ve 'yağmur olasılığı %70' arasındaki fark görülmez.",
      ku: "Pêşbînî = teqezî tê fikirîn.",
      en: "Prediction mistaken for certainty. 'Will rain' vs '70% chance of rain' confusion." },
  ],
  deception: [
    { id: "huff_truncated_axis", src: "Huff 1954", level: 3,
      tr: "Y-ekseni 0'dan başlamayan çubuk grafik yanıltır: %2 fark %50 gibi görünür. 'Şirketin geliri fırladı!' yalanı.",
      ku: "Dema ekseneya Y ne ji 0 dest pê dike, grafîk xapînok e.",
      en: "Bar graph with non-zero y-axis misleads: 2% diff looks like 50%. 'Profits skyrocket!' lie." },
    { id: "huff_pie_3d", src: "Huff 1954", level: 3,
      tr: "3B pasta grafiğin öndeki dilimi, arkadakilerden daha büyük görünür (perspektif). Eşit yüzdeler yanıltıcı bölünür.",
      ku: "Di grafîka keka 3B de, parçê pêşîn mezintir xuya dike.",
      en: "In 3D pie charts, front slice looks bigger than back — perspective bias." },
    { id: "sample_bias", src: "Wainer 1984", level: 3,
      tr: "Sadece bir grup (örn. üyelerin) cevap veren anket genelleştirilir. 'Sitemizin üyeleri memnun' → tüm dünya?",
      ku: "Anketa tenê ji yek komê tê gelemperkirin.",
      en: "Survey of only one group generalized. 'Our members are satisfied' → whole world?" },
  ],
};

// ═══════════════════════════════════════════════════════════════════
// AŞAMALI ZORLUK (STANDARDS §1.6) — Curcio seviyesinden BAĞIMSIZ eksen.
// Curcio L0-L3 "hangi okuma türü", diff 1-5 "ne kadar iskele" sorusunu yanıtlar.
// Bir L3 etkinliği diff 2 (bol ipuçlu) da olabilir, diff 5 (transfer) de.
// Gösterge 5 basamağı destekler: DIFF_LEVELS dizisinden veri sürümlü çizilir,
// "★".repeat(n) gibi taşma/negatif riski taşıyan kalıp KULLANILMAZ.
export const DIFF_LEVELS = [
  { id: 1, color: "#10b981", name: { tr: "Keşif",        ku: "Vekolîn",     en: "Explore" } },
  { id: 2, color: "#3b82f6", name: { tr: "Rehberli",     ku: "Bi rêber",    en: "Guided" } },
  { id: 3, color: "#8b5cf6", name: { tr: "Yönlendirilmiş", ku: "Beralîkirî", en: "Directed" } },
  { id: 4, color: "#f59e0b", name: { tr: "Bağımsız",     ku: "Serbixwe",    en: "Independent" } },
  { id: 5, color: "#ef4444", name: { tr: "Transfer",     ku: "Veguhastin",  en: "Transfer" } },
];

export function diffMeta(d) {
  return DIFF_LEVELS.find(x => x.id === d) || null;
}

export const LANGS = {
  tr: { code: "tr", name: "Türkçe", flag: "🇹🇷" },
  ku: { code: "ku", name: "Kurmancî", flag: "🟨" },
  en: { code: "en", name: "English", flag: "🇬🇧" },
  ar: { code: "ar", name: "العربية", flag: "🇸🇦" },
  fa: { code: "fa", name: "فارسی", flag: "🇮🇷" },
};

export const TRANSLATIONS = {
  tr: {
    appTitle: "Veri Okuryazarlığı",
    score: "Puan",
    sideTabs: {
      read: "Oku",
      deceive: "Yanıltma",
      create: "Oluştur",
      center: "Merkez",
      relate: "İlişki",
      probability: "Olasılık",
      collect: "Topla",
      recognize: "Tanı",
      world: "Dünya",
      teach: "Öğretmen",
      set: "Ayarlar",
    },
    tabGroups: {
      discover: "🔍 Keşfet",
      tools: "🛠️ Araçlar",
      manage: "⚙️ Yönetim",
    },
    tabGroupDesc: {
      discover: "Grafikleri okumayı, yanıltmaları görmeyi öğren",
      tools: "Kendi verini oluştur, analiz et, keşfet",
      manage: "Öğretmen panosu ve ayarlar",
    },
    comingSoon: "Yakında",
    comingSoonDesc: "Bu modül henüz geliştirme aşamasında.",
    lockedLevel: "Kilitli",
    unlockHint: "Önceki seviyeyi tamamla",
    progress: "İlerleme",
    correct: "doğru",
    done: "Tamam",
    canDo: "Neler yapabilir",
    cannotDo: "Henüz yapamadıkları",
    teacherFocus: "Öğretmen odağı",
    teacherAvoid: "Kaçınılmalı",
    pedagogical: "Pedagojik Temel",
    age: "Yaş",
    cycle: "PPDAC Döngüsü",
    dyscalculia: "Diskalkuli Modu",
    colorblind: "Renk Körü Modu",
    tts: "Sesli Anlatım",
    nwMode: "Gözlem Modu (Notice & Wonder)",
    nwModeDesc: "Her etkinlikten önce 'Ne görüyorsun?' gözlem aşaması",
    whatNotice: "Ne fark ediyorsun?",
    whatNoticeHint: "Grafiğe bak — gözlerine çarpan ne? Serbest yaz.",
    whatWonder: "Ne merak ediyorsun?",
    whatWonderHint: "Sormak istediğin soru ne? Neden böyle olmuş olabilir?",
    writeHeadline: "Kısa bir başlık yaz",
    writeHeadlineHint: "Bu grafiği bir gazete manşeti olsa nasıl özetlerdin?",
    skip: "Atla",
    continueToQuestion: "Soruya Geç →",
    continueNext: "Devam →",
    observations: "Gözlemler",
    studentObservations: "Öğrenci Gözlemleri",
    noObservationsYet: "Henüz gözlem yok. Gözlem modunu açık bırakırsan burada görünür.",
    yourPrevNote: "Önceki notun",
    nwTitle: "Önce Gözlemle",
    nwIntro: "Cevap vermeden önce — grafiği sakin sakin incele. Doğru/yanlış yok, sadece gözlem.",
  },
  ku: {
    appTitle: "Xwendeşîrovekirina Daneyan",
    score: "Xal",
    sideTabs: {
      read: "Bixwîne",
      deceive: "Xapandin",
      create: "Çêke",
      center: "Navend",
      relate: "Têkilî",
      probability: "Îhtîmal",
      collect: "Berhev bike",
      recognize: "Nas bike",
      world: "Cîhan",
      teach: "Mamoste",
      set: "Eyar",
    },
    tabGroups: {
      discover: "🔍 Keşif",
      tools: "🛠️ Amûr",
      manage: "⚙️ Rêvebirin",
    },
    tabGroupDesc: {
      discover: "Xwendina grafîkan û dîtina xapandinan fêr bibe",
      tools: "Daneyên xwe çêke, analîz bike, keşif bike",
      manage: "Panela mamoste û eyar",
    },
    comingSoon: "Zû tê",
    comingSoonDesc: "Ev modul hîn di pêşketinê de ye.",
    lockedLevel: "Girtî",
    unlockHint: "Pêşî asta berê biqedîne",
    progress: "Pêşketin",
    correct: "rast",
    done: "Temam",
    canDo: "Çi dikare",
    cannotDo: "Hîn nikare",
    teacherFocus: "Balkêşa mamoste",
    teacherAvoid: "Dûrbûn",
    pedagogical: "Bingeha Pedagojîk",
    age: "Temen",
    cycle: "Dorê PPDAC",
    dyscalculia: "Moda Diskalkuliyê",
    colorblind: "Moda Kor-Rengî",
    tts: "Dengbêjî",
    nwMode: "Moda Çav Dîtinê (Notice & Wonder)",
    nwModeDesc: "Berî her çalakiyê qonaxa 'Çi dibînî?' ya çavdêriyê",
    whatNotice: "Çi bala te dikişîne?",
    whatNoticeHint: "Li grafîkê binêre — çi bala te dikişîne? Bi serbestî binivîse.",
    whatWonder: "Çi kûrahî dikî?",
    whatWonderHint: "Pirsa ku dixwazî bipirsî çi ye? Çima wisa çêbûye gelo?",
    writeHeadline: "Sernaveke kurt binivîse",
    writeHeadlineHint: "Ger ev grafîk sernivîseke rojnameyê bûya, çawa dinivîsandî?",
    skip: "Derbas bibe",
    continueToQuestion: "Biçe Pirsê →",
    continueNext: "Berdewam →",
    observations: "Çavdêrî",
    studentObservations: "Çavdêriyên Xwendekaran",
    noObservationsYet: "Hîn çavdêrî tune. Ger moda çavdêriyê vekirî bihêlî, li vir xuya dibe.",
    yourPrevNote: "Nota te ya berê",
    nwTitle: "Pêşî Çavdêrî Bike",
    nwIntro: "Berî ku bersiv bidî — bi aramî li grafîkê binêre. Ne rast/xelet heye, tenê çavdêrî.",
  },
  en: {
    appTitle: "Data Literacy",
    score: "Score",
    sideTabs: {
      read: "Read",
      deceive: "Deception",
      create: "Create",
      center: "Center",
      relate: "Relate",
      probability: "Probability",
      collect: "Collect",
      recognize: "Recognize",
      world: "World",
      teach: "Teacher",
      set: "Settings",
    },
    tabGroups: {
      discover: "🔍 Discover",
      tools: "🛠️ Tools",
      manage: "⚙️ Manage",
    },
    tabGroupDesc: {
      discover: "Learn to read graphs and spot deceptions",
      tools: "Create your data, analyze, explore",
      manage: "Teacher panel and settings",
    },
    comingSoon: "Coming Soon",
    comingSoonDesc: "This module is under development.",
    lockedLevel: "Locked",
    unlockHint: "Complete previous level first",
    progress: "Progress",
    correct: "correct",
    done: "Done",
    canDo: "Can do",
    cannotDo: "Cannot yet",
    teacherFocus: "Teacher focus",
    teacherAvoid: "Avoid",
    pedagogical: "Pedagogical Basis",
    age: "Age",
    cycle: "PPDAC Cycle",
    dyscalculia: "Dyscalculia Mode",
    colorblind: "Colorblind Mode",
    tts: "Text to Speech",
    nwMode: "Notice & Wonder Mode",
    nwModeDesc: "Before each activity: 'What do you see?' observation stage",
    whatNotice: "What do you notice?",
    whatNoticeHint: "Look at the graph — what catches your eye? Write freely.",
    whatWonder: "What do you wonder?",
    whatWonderHint: "What question comes to mind? Why might this be the case?",
    writeHeadline: "Write a short headline",
    writeHeadlineHint: "If this graph were a newspaper headline, how would you summarize it?",
    skip: "Skip",
    continueToQuestion: "Go to Question →",
    continueNext: "Continue →",
    observations: "Observations",
    studentObservations: "Student Observations",
    noObservationsYet: "No observations yet. Keep Notice & Wonder mode on and they'll appear here.",
    yourPrevNote: "Your previous note",
    nwTitle: "Observe First",
    nwIntro: "Before answering — look at the graph calmly. No right/wrong, just observation.",
  },
  ar: {
    appTitle: "القراءة البيانية",
    score: "النقاط",
    sideTabs: {
      read: "اقرأ",
      deceive: "التضليل",
      create: "أنشئ",
      center: "المركز",
      relate: "العلاقة",
      probability: "الاحتمال",
      collect: "اجمع",
      recognize: "تعرّف",
      world: "العالم",
      teach: "المعلّم",
      set: "الإعدادات",
    },
    tabGroups: {
      discover: "🔍 اكتشف",
      tools: "🛠️ أدوات",
      manage: "⚙️ إدارة",
    },
    tabGroupDesc: {
      discover: "تعلّم قراءة الرسوم البيانية واكتشاف التضليل",
      tools: "أنشئ بياناتك، حلّلها، استكشفها",
      manage: "لوحة المعلّم والإعدادات",
    },
    comingSoon: "قريباً",
    comingSoonDesc: "هذه الوحدة لا تزال قيد التطوير.",
    lockedLevel: "مقفل",
    unlockHint: "أكمل المستوى السابق أولاً",
    progress: "التقدّم",
    correct: "صحيح",
    done: "تمّ",
    canDo: "ما يستطيع",
    cannotDo: "ما لا يستطيع بعد",
    teacherFocus: "تركيز المعلّم",
    teacherAvoid: "ما يُتجنّب",
    pedagogical: "الأساس التربوي",
    age: "العمر",
    cycle: "دورة PPDAC",
    dyscalculia: "وضع عُسر الحساب",
    colorblind: "وضع عمى الألوان",
    tts: "القراءة الصوتية",
    nwMode: "وضع الملاحظة والتساؤل",
    nwModeDesc: "قبل كلّ نشاط مرحلة 'ماذا ترى؟'",
    whatNotice: "ما الذي تلاحظه؟",
    whatNoticeHint: "انظر إلى الرسم — ماذا يلفت نظرك؟ اكتب بحرية.",
    whatWonder: "ما الذي تتساءل عنه؟",
    whatWonderHint: "أيّ سؤال يخطر ببالك؟ ولماذا قد يكون كذلك؟",
    writeHeadline: "اكتب عنواناً قصيراً",
    writeHeadlineHint: "لو كان هذا الرسم عنوان صحيفة، كيف ستلخّصه؟",
    skip: "تخطِ",
    continueToQuestion: "إلى السؤال →",
    continueNext: "تابع →",
    observations: "الملاحظات",
    studentObservations: "ملاحظات الطلاب",
    noObservationsYet: "لا ملاحظات بعد. اترك الوضع مفعّلاً وستظهر هنا.",
    yourPrevNote: "ملاحظتك السابقة",
    nwTitle: "لاحِظ أولاً",
    nwIntro: "قبل الإجابة — انظر إلى الرسم بتمعّن. لا صواب ولا خطأ، فقط ملاحظة.",
  },
  fa: {
    appTitle: "سواد داده",
    score: "امتیاز",
    sideTabs: {
      read: "بخوان",
      deceive: "فریب",
      create: "بساز",
      center: "مرکز",
      relate: "رابطه",
      probability: "احتمال",
      collect: "جمع‌آوری",
      recognize: "بشناس",
      world: "جهان",
      teach: "معلم",
      set: "تنظیمات",
    },
    tabGroups: {
      discover: "🔍 کاوش",
      tools: "🛠️ ابزار",
      manage: "⚙️ مدیریت",
    },
    tabGroupDesc: {
      discover: "خواندن نمودار و دیدن فریب‌ها را بیاموز",
      tools: "دادۀ خود را بساز، تحلیل و کاوش کن",
      manage: "پانل معلم و تنظیمات",
    },
    comingSoon: "به‌زودی",
    comingSoonDesc: "این بخش در دست توسعه است.",
    lockedLevel: "قفل",
    unlockHint: "ابتدا سطح قبلی را کامل کن",
    progress: "پیشرفت",
    correct: "درست",
    done: "تمام",
    canDo: "چه می‌تواند",
    cannotDo: "هنوز نمی‌تواند",
    teacherFocus: "تمرکز معلم",
    teacherAvoid: "پرهیز",
    pedagogical: "مبنای آموزشی",
    age: "سن",
    cycle: "چرخۀ PPDAC",
    dyscalculia: "حالت دیسکالکولی",
    colorblind: "حالت کوررنگی",
    tts: "خواندن صوتی",
    nwMode: "حالت نگریستن و پرسیدن",
    nwModeDesc: "پیش از هر فعالیت مرحلۀ 'چه می‌بینی؟'",
    whatNotice: "چه چیزی توجه‌ات را جلب می‌کند؟",
    whatNoticeHint: "به نمودار نگاه کن — چه چیزی چشمت را می‌گیرد؟ آزادانه بنویس.",
    whatWonder: "در چه چیزی کنجکاوی؟",
    whatWonderHint: "چه پرسشی به ذهن می‌رسد؟ چرا شاید اینگونه باشد؟",
    writeHeadline: "یک عنوان کوتاه بنویس",
    writeHeadlineHint: "اگر این نمودار تیتر روزنامه بود، چگونه خلاصه‌اش می‌کردی؟",
    skip: "رد شو",
    continueToQuestion: "به پرسش →",
    continueNext: "ادامه →",
    observations: "مشاهدات",
    studentObservations: "مشاهدات دانش‌آموز",
    noObservationsYet: "هنوز مشاهده‌ای نیست. حالت نگریستن را روشن نگه‌دار تا اینجا دیده شود.",
    yourPrevNote: "یادداشت قبلی‌ات",
    nwTitle: "ابتدا مشاهده کن",
    nwIntro: "پیش از پاسخ — با آرامش به نمودار نگاه کن. درست/نادرست نیست، فقط مشاهده.",
  },
};

// Kimlik rengi: PEMBE (#ec4899) — launcher kartı ile aynı
import { APP_ACCENTS } from '@shared/palette.js';

const _accent = APP_ACCENTS.veri;

export const P = {
  accent: _accent.color,     // #ec4899
  accentD: _accent.dark,     // #be185d
  accentL: _accent.soft,     // #fce7f3
  accentSofter: _accent.softer,
  header: `linear-gradient(135deg, ${_accent.dark}, ${_accent.color})`,
  text: "#1e293b",
  textSoft: "rgba(30,41,59,.65)",
  bg: "#fdf2f8",             // pembe tint'li açık arkaplan
  okabe: ["#E69F00", "#56B4E9", "#009E73", "#F0E442", "#0072B2", "#D55E00", "#CC79A7", "#000000"],
};

export { APP_ACCENTS };
