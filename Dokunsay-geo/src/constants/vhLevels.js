// Van Hiele seviye metadata (L0–L2). Kaynak: Crowley 1987, van Hiele 1986.
// ══════════════════════════════════════════════════════════════
// VAN HIELE SEVİYELERİ — Kapsamlı Metadata
// Kaynak: van Hiele (1986), Crowley (1987 NCTM Yearbook), Clements & Battista (1992)
// Her seviye: ne yapabilir, ne yapamaz, hangi konular, örnek sorular
// ═══════════════════════════════════════════════════════════════
export const VH_LEVELS=[
  {
    id:0, key:"visual",
    // Orijinal adı: "Visualization" / "Recognition"
    name:{tr:"Görsel Düzey",ku:"Asta Dîtinê",en:"Visual Level"},
    shortName:{tr:"Görsel",ku:"Dîtin",en:"Visual"},
    color:"#fbbf24",       // sarı
    colorSoft:"#fef3c7",
    icon:"👁️",
    ageRange:"5-8",
    // Öğrencinin bu seviyede yapabileceği
    canDo:{
      tr:[
        "Şekilleri bütün olarak görüp ismini söyleyebilir (kare, daire, üçgen)",
        "Şekilleri benzerliğine göre sıralayabilir (bunlar kare, bunlar üçgen)",
        "Günlük yaşamdan örneklerle şekilleri eşleştirebilir (tekerlek = daire)",
        "Kenarları ve köşeleri sayabilir",
      ],
      ku:[
        "Teşeyan wek yek tev dibîne û navê wan dibêje",
        "Teşeyan bi hevwekheviyê li gorî hev rêz dike",
        "Ji jiyana rojane mînakan bide teşeyan",
        "Kêlekan û goşeyan bijimêre",
      ],
      en:[
        "Recognizes shapes as whole figures by name (square, circle, triangle)",
        "Sorts shapes by resemblance to prototypes",
        "Matches shapes to real-world examples (wheel = circle)",
        "Counts sides and corners",
      ]
    },
    // Bu seviyede YAPAMAZ (beklenti değil)
    cannotDo:{
      tr:"Henüz şekilleri özelliklerine göre tanımlayamaz. 'Kare 4 dik açısı olan dörtgendir' diyemez — sadece 'kareye benziyor' der.",
      ku:"Hîn jî teşeyan li gorî taybetmendiyên wan nagihêje. 'Çaryalî çarhêla bi 4 goşeyên rast e' nabêje — tenê 'dişibe çaryalî' dibêje.",
      en:"Cannot yet define shapes by properties. Doesn't say 'square is a quadrilateral with 4 right angles' — only 'looks like a square'."
    },
    // Hedef kazanımlar
    goals:{
      tr:[
        "Temel 2B ve 3B şekillerin adını bilme",
        "Farklı konum ve boyutlarda aynı şekli tanıma",
        "Çevredeki nesnelerin geometrik şekillerle ilişkisi",
      ],
      ku:[
        "Zanîna navê teşeyên bingehîn ên 2B û 3B",
        "Naskirina teşeya heman di cîh û mezinahiyên cuda de",
        "Têkiliya tiştên derdor bi teşeyên geometrîk",
      ],
      en:[
        "Name basic 2D and 3D shapes",
        "Recognize same shape in different positions and sizes",
        "Connect real objects to geometric shapes",
      ]
    },
    // Öğretmenin odağı
    teacherFocus:{
      tr:"Görsel tanıma + isimlendirme. Şekilleri sürekli farklı renklerde, boyutlarda, konumlarda göster. Döndürülmüş şekilleri tanıma önemli (Mack 2007).",
      ku:"Naskirina dîtbar + navandin. Teşeyan bi rengên cuda, mezinahî û cîhên cuda pêşkêş bike.",
      en:"Visual recognition + naming. Show shapes in varied colors, sizes, orientations. Rotated shape recognition is key (Mack 2007)."
    },
    // Öğretmenin HATALARI
    teacherAvoid:{
      tr:"Kareyi 'yatırıp' eşkenar dörtgen diye tanıtma. Şekilleri hep aynı yönde (üçgen hep tepesi yukarıda) gösterme — öğrenci bunu sanır.",
      ku:"Çaryaliyê nezivirîne û lozengê neyê nîşandan. Teşeyan her dem di heman alîyê de (sêgoşe her dem bi serê xwe ya jor) nîşan medî.",
      en:"Don't call a 'tilted square' a rhombus. Don't always show shapes in same orientation (triangles always pointing up)."
    },
    // Bu seviyedeki öğrencilerin tipik yanılgıları
    commonMisconceptions:["mack_rotation","clements_prototype","kaur_tip"],
    // Geçiş için minimum kriter
    passCriteria:{minActivities:3,minCorrect:2},
  },
  {
    id:1, key:"analysis",
    name:{tr:"Analiz Düzeyi",ku:"Asta Analîzê",en:"Analysis Level"},
    shortName:{tr:"Analiz",ku:"Analîz",en:"Analysis"},
    color:"#818cf8",
    colorSoft:"#e0e7ff",
    icon:"📐",
    ageRange:"8-11",
    canDo:{
      tr:[
        "Şekilleri özellikleri (kenar sayısı, açı türü, paralellik) ile tanımlar",
        "Şekilde kaç dik açı, kaç paralel kenar olduğunu söyler",
        "Özelliklere göre şekil karşılaştırır (ikisinin de 4 kenarı var)",
        "Ölçümler yapar: kenar uzunlukları, açı büyüklükleri",
      ],
      ku:[
        "Teşeyan bi taybetmendiyên wan (hejmara kêlekan, cûreya goşeyan) danasîne",
        "Di teşeyekê de çend goşeyên rast, çend kêlekên paralel hene dibêje",
        "Li gorî taybetmendiyan teşeyan bide ber hev",
        "Pîvaz dike: dirêjahiya kêlekan, mezinahiya goşeyan",
      ],
      en:[
        "Defines shapes by properties (sides, angles, parallelism)",
        "Counts right angles and parallel sides in a shape",
        "Compares shapes by properties (both have 4 sides)",
        "Takes measurements: side lengths, angle sizes",
      ]
    },
    cannotDo:{
      tr:"Henüz özellikler arasındaki mantıksal ilişkiyi kuramaz. Karenin dikdörtgen olduğunu anlamaz — bunları ayrı kategoriler olarak görür.",
      ku:"Hîn jî têkiliya mantiqî ya di navbera taybetmendiyan de çênake. Çaryalî dikare dîkdîortgenek be jî — vê fêm nake.",
      en:"Cannot yet see logical relationships between properties. Doesn't see square as rectangle — sees them as separate categories."
    },
    goals:{
      tr:[
        "Şekillerin kenar, açı, paralellik özelliklerini tanıma",
        "Dik açı kavramı ve tanıma",
        "Simetri eksenlerini keşfetme",
        "Ölçüm araçlarını (cetvel, iletki) kullanabilme",
      ],
      ku:[
        "Naskirina taybetmendiyên kêlek, goşe, paralelî yên teşeyan",
        "Têgihîştina goşeya rast",
        "Keşfkirina eksên sîmetriyê",
        "Bikaranîna amûrên pîvanê (xetkêş, guçpîv)",
      ],
      en:[
        "Recognize side, angle, parallelism properties",
        "Understand and identify right angles",
        "Discover symmetry axes",
        "Use measurement tools (ruler, protractor)",
      ]
    },
    teacherFocus:{
      tr:"Özellik listeleme ve karşılaştırma. 'Bu şekilde kaç dik açı var?' 'Kenarları eşit mi?' Karşılaştırma tabloları faydalı.",
      ku:"Lîsteya taybetmendiyan û beramberî. 'Di vê teşeyê de çend goşeyên rast hene?' 'Kêlek wekhev in?' Tabloyên beramberî bi kêr tên.",
      en:"Property listing and comparison. 'How many right angles?' 'Are sides equal?' Comparison tables help."
    },
    teacherAvoid:{
      tr:"Hiyerarşik sınıflamaya (kare = dikdörtgen) zorla ilerletme. Öğrenci özellikleri ezberlemeden önce GÖZLEMLEMELİ.",
      ku:"Bi zorê ber bi polîkirina hiyerarşîk ve mebirin (çaryalî = dîkdîortgen). Xwendekar divê taybetmendiyan berî ji ber bike, ÇAV DÎ BIKE.",
      en:"Don't push hierarchical classification (square = rectangle) too early. Student must OBSERVE properties before memorizing them."
    },
    commonMisconceptions:["kaur_tip","gal_lew_rhombus","wu_ma_side_count"],
    passCriteria:{minActivities:3,minCorrect:2},
  },
  {
    id:2, key:"abstraction",
    // Orijinal: "Abstraction" / "Informal Deduction" / "Ordering"
    name:{tr:"Soyutlama (Gayri Resmi Çıkarım)",ku:"Ramandin",en:"Abstraction (Informal Deduction)"},
    shortName:{tr:"Soyutlama",ku:"Ramandin",en:"Abstraction"},
    color:"#34d399",
    colorSoft:"#d1fae5",
    icon:"🔗",
    ageRange:"11-14",
    canDo:{
      tr:[
        "Şekiller arası hiyerarşi kurar (kare ⊂ dikdörtgen ⊂ paralelkenar)",
        "Tanımları anlar ve kullanır ('Dikdörtgen: 4 dik açılı paralelkenar')",
        "Mantıksal 'eğer-ise' cümleleri kurar ('Eğer paralelkenarsa, karşı kenarları eşittir')",
        "Verilen özelliklerden şekli belirler (çıkarsama)",
      ],
      ku:[
        "Di navbera teşeyan de hiyerarşî ava dike",
        "Danasînan fêm dike û bikar tîne",
        "Hevokên 'ger-awa' ava dike",
        "Ji taybetmendiyên dayînî teşeyê diyar dike",
      ],
      en:[
        "Creates hierarchies between shapes (square ⊂ rectangle ⊂ parallelogram)",
        "Understands and uses definitions ('Rectangle: parallelogram with 4 right angles')",
        "Makes logical 'if-then' statements",
        "Deduces shape from given properties",
      ]
    },
    cannotDo:{
      tr:"Henüz formel ispat yapamaz. 'Her kare dikdörtgendir' der ama bunu aksiyomlarla kanıtlayamaz. Teoremlerin birbirine bağlılığını tam göremez.",
      ku:"Hîn jî îspata fermî nake. 'Her çaryalî dîkdîortgen e' dibêje lê vê bi aksîomên wê îspat nake.",
      en:"Cannot yet do formal proof. Says 'every square is a rectangle' but can't prove it axiomatically. Doesn't fully grasp theorem interconnection."
    },
    goals:{
      tr:[
        "Özel-genel ilişkisi (kare dikdörtgenin özelidir)",
        "Tanım-teorem ayrımı",
        "Gerek ve yeter koşul kavramları",
        "Şekil sınıflama hiyerarşileri",
      ],
      ku:[
        "Têkiliya taybet-giştî",
        "Ferqa di navbera danasîn û teoremê de",
        "Têgînên mercê pêwîst û têr",
        "Hiyerarşiyên polîkirina teşeyan",
      ],
      en:[
        "Special-general relationship (square is special rectangle)",
        "Definition vs theorem distinction",
        "Necessary and sufficient conditions",
        "Shape classification hierarchies",
      ]
    },
    teacherFocus:{
      tr:"Venn diyagramları, sınıflama ağaçları, 'eğer-ise' oyunları. 'Kare bir dikdörtgen midir? Nedenini kanıtlayın.' Tartışma odaklı.",
      ku:"Diyagramên Venn, darên polîkirinê, lîstikên 'ger-awa'. 'Çaryalî dîkdîortgen e? Çima?'",
      en:"Venn diagrams, classification trees, 'if-then' games. 'Is square a rectangle? Prove why.' Discussion-focused."
    },
    teacherAvoid:{
      tr:"Formel ispat isteme (L3 seviyesi). 'Kanıtla' yerine 'Nasıl biliyorsun?' sor.",
      ku:"Îspata fermî (asta L3) daxwaz neke. Li şûna 'Îspat bike', 'Çawa dizanî?' bipirse.",
      en:"Don't require formal proof (L3). Ask 'How do you know?' instead of 'Prove it.'"
    },
    commonMisconceptions:["hierarchy_blind","kaur_tip","gal_lew_rhombus"],
    passCriteria:{minActivities:3,minCorrect:2},
  },
];
/* Van Hiele'nin orijinal 5 seviyesi:
   L0 Görsel, L1 Analiz, L2 Soyutlama (Gayri Resmi Çıkarım),
   L3 Formel Çıkarım, L4 Titizlik (Rigor).
   İlkokul (5-11 yaş) için L0-L2 yeterlidir. L3-L4 lise ve üniversite. */
