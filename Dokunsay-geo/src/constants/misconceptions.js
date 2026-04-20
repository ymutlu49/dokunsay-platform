// ══════════════════════════════════════════════════════════════
// YAYGIN YANLIŞ KAVRAMLAR KATALOĞU (Common Misconceptions)
// Smith & Stein "5 Practices" 1. pratik: anticipate.
// ══════════════════════════════════════════════════════════════
// ══════════════════════════════════════════════════════════════
// YAYGIN YANLIŞ KAVRAMLAR KATALOĞU (Common Misconceptions)
// Araştırma kaynakları:
//  • Clements & Sarama (2000): "Young children's ideas about geometric shapes"
//  • Wu & Ma (2006): Van Hiele geometrik düşünme seviyeleri
//  • Mack (2007): Döndürülmüş şekillerde tanıma güçlüğü
//  • Kaur (2012): "Top point" ve yatay taban beklentisi
//  • Gal & Lew (2008): Özel paralelkenarları (kare/dikdörtgen/eşkenar dörtgen) sınıflama
//  • Siew et al. (2013): Tangram ve şekil dönüşümü kavramları
//
// Bu katalog öğretmenin plan yaparken "anticipate" (öngörme) pratiğine
// hizmet eder (Smith & Stein 5 Practices, 1. pratik).
// ══════════════════════════════════════════════════════════════
export const MISCONCEPTIONS={
  triangle:[
    {src:"Clements & Sarama 2000", level:0,
     tr:"Öğrenci üçgenin 'üst noktası' olması gerektiğini sanar — döndürülmüş üçgeni tanımaz.",
     ku:"Xwendekar difikirê ku divê sêgoşe 'xaleke jorê' hebe — sêgoşeyên sûcandî nas nake.",
     en:"Student expects a triangle to have a 'top point'; doesn't recognize rotated triangles."},
    {src:"Kaur 2012", level:0,
     tr:"Yatay bir tabanı olmayan üçgen 'üçgen değil' sayılır.",
     ku:"Sêgoşeya ku bingeheke horizantal nîne, 'ne sêgoşe' tê hesibandin.",
     en:"A triangle without a horizontal base is deemed 'not a triangle'."},
    {src:"Clements & Sarama 2000", level:0,
     tr:"Eğri kenarlı şekiller de üçgen olarak kabul edilebilir — kenarların düz olması gerektiği unutulur.",
     ku:"Teşeyên bi kêlekên xwar jî wek sêgoşe tên qebûlkirin — divê kêlek rast bin tê jibîrkirin.",
     en:"Curved-sided shapes may be accepted as triangles; 'sides must be straight' is forgotten."},
  ],
  quadrilateral:[
    {src:"Gal & Lew 2008", level:2,
     tr:"Kare, eşkenar dörtgen ve dikdörtgen ayrı kategoriler sanılır — kare aslında hem eşkenar dörtgen hem dikdörtgendir.",
     ku:"Çaryalî, lozeng û çarhêla rast wek kategoriyên cuda tên dîtin — çaryalî di eslê xwe de hem lozeng hem çarhêla rast e.",
     en:"Square, rhombus, rectangle are seen as separate categories — a square is actually both a rhombus and a rectangle."},
    {src:"Clements & Sarama 2000", level:0,
     tr:"Uzun herhangi bir dört kenarlı şekil 'dikdörtgen' sanılır — paralelkenar ve yamuk da dikdörtgen gibi algılanır.",
     ku:"Her teşeya dirêj bi çar kêlekan 'çarhêla rast' tê hesibandin.",
     en:"Any elongated four-sided shape is called a rectangle — parallelograms and trapezoids are confused with rectangles."},
    {src:"Mack 2007", level:0,
     tr:"Döndürülmüş kare artık 'kare değil, eşkenar dörtgen' sanılır (yatay-dik algılama).",
     ku:"Çaryaliya sûcandî 'ne çaryalî ye, lozeng e' tê dîtin.",
     en:"A rotated square is mistaken for a 'rhombus, not a square' — due to orientation dependence."},
  ],
  circle:[
    {src:"Dokunsay pedagojisi", level:1,
     tr:"'Daire' ve 'çember' terimleri eşanlamlı sanılır — çember yalnızca sınır, daire ise sınır + iç bölgedir.",
     ku:"'Dayre' û 'xelek' wek hevwate tên dîtin — xelek tenê sînor e, dayre sînor + herêma hundir e.",
     en:"Students conflate 'circle' (curve/boundary) with 'disk' (boundary + interior). In some languages these terms are fused."},
    {src:"Siew 2013", level:1,
     tr:"Çemberin 'alanı' hesaplanır zannedilir — çemberin alanı yoktur, yalnız uzunluğu (çevresi) vardır.",
     ku:"Tê fikirîn ku xelek rûber heye — lê xelek rûber nîne, tenê dirêjahî heye.",
     en:"Students try to compute the 'area of a circle' (the curve) — a circle has no area, only length (circumference)."},
  ],
  polygon:[
    {src:"Clements & Sarama 2000", level:0,
     tr:"Düzgün olmayan çokgenler 'çokgen değil' sanılır — kenarların eşit olması gerektiği düşünülür.",
     ku:"Pirhêlên ne-rêkpêk wek 'ne pirhêl' tên dîtin — tê fikirîn ku divê kêlek wekhev bin.",
     en:"Students think all polygons must be regular (equal-sided); irregular polygons are not recognized."},
    {src:"Mack 2007", level:1,
     tr:"Çokgen sayısı = kenar sayısı bağlantısı kurulmaz (6 kenar → altıgen gibi).",
     ku:"Girêdana 'hejmara kêlekan = navê pirhêlê' nayê dîtin.",
     en:"The link between side count and polygon name (6 sides → hexagon) is not established."},
  ],
  rightangle:[
    {src:"Mack 2007",
     tr:"'Dik açı' terimi yön olarak yorumlanır — 'sağa açılan açı' sanılır (solda olursa 'sol açı').",
     ku:"'Guça rast' wek 'guça ber bi rastê' tê fêmkirin.",
     en:"'Right angle' is interpreted directionally as 'opening to the right'; students invent a 'left angle'."},
    {src:"Van Hiele, Crowley 1987",
     tr:"Dik açının tam 90° olduğu sayısal olarak bilinmez — sadece 'köşe' olarak görsel bir şekilde tanınır.",
     ku:"Nayê zanîn ku guça rast tam 90° ye — tenê wek 'goşe' ji alîyê dîtinî ve tê nas kirin.",
     en:"Students recognize right angles visually as 'corners' but don't know they equal exactly 90°."},
  ],
  symmetry:[
    {src:"Siew 2013",
     tr:"Her şekil için yalnız bir simetri ekseni olduğu düşünülür — kare, düzgün çokgen vb. birden fazla eksene sahiptir.",
     ku:"Tê fikirîn ku her teşe tenê yek eksena nîvheviyê heye.",
     en:"Students think each shape has only one symmetry axis — squares and regular polygons have multiple."},
  ],
  tangram:[
    {src:"Siew 2013",
     tr:"Parçaları birleştirince oluşan yeni şeklin 'farklı bir şekil' olduğu ile 'aynı parçaların farklı düzenlenişi' olduğu ayırt edilemez.",
     ku:"Parçeyên ku li hev tên, wek 'teşeyeke nû' an 'rêzkirineke nû ya heman perçeyan' nayên ji hev cudakirin.",
     en:"Students confuse 'a new shape' with 'the same pieces rearranged' — conservation of parts is not grasped."},
    {src:"Siew 2013",
     tr:"İki küçük üçgen birleşince karenin alanı = 2 × üçgen alanı olduğu görülmez.",
     ku:"Nayê dîtin ku dema 2 sêgoşeyên biçûk li hev bên, rûberê çaryaliyê = 2 × rûberê sêgoşeyê.",
     en:"Students don't see that combining two small triangles makes a square whose area equals 2× the triangle's."},
  ],
};

// ŞEKİL → MISCONCEPTION KATEGORİ EŞLEMESİ
// Her konu için hangi yanlış kavramlar gösterilsin
export function getMisconceptions(topicKey){
  const map={
    "sq_seq":["quadrilateral","symmetry","rightangle"],
    "rh_seq":["quadrilateral","symmetry"],
    "ra_seq":["rightangle","quadrilateral"],
    "l0_a":["triangle"],
    "l0_b":["triangle"],
    "l0_c":["triangle"],
    "l0_d":["quadrilateral","circle"],
    "l0_e":["circle"],
    "l0_f":["polygon"],
    "l0_g":["polygon"],
    "l1_a":["quadrilateral"],
    "l1_b":["quadrilateral","rightangle"],
    "l1_c":["symmetry"],
    "l1_d":["rightangle"],
    "l1_e":["triangle","rightangle"],
    "l1_f":["polygon"],
    "l1_g":["circle"],
    "l2_a":["quadrilateral"],
    "l2_b":["polygon"],
    "l2_c":["triangle"],
    "l2_d":["tangram"],
    "l2_e":["quadrilateral"],
    "l2_f":["symmetry"],
    "l2_g":["polygon"],
  };
  return map[topicKey]||[];
}
