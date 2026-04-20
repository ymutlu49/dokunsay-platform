// ══════════════════════════════════════════════════════════════
// VAN HIELE 5-FAZ DİZİLERİ — Crowley (1987) örneğine dayalı.
// Her dizi 5 ardışık faz yürütür: I → DO → E → FO → IN
// ══════════════════════════════════════════════════════════════
export const PHASE_SEQUENCES=[
  {id:"sq_seq",level:0,topic:{tr:"Kare",ku:"Çaryalî",en:"Square"},icon:"■",
    phases:[
      {p:"I",q:{tr:"Kare nedir? Etrafında hangi kare şeklinde nesneler görüyorsun?",ku:"Çaryalî çi ye? Li dora xwe kîjan tiştên çaryaliyî dibînî?",en:"What is a square? What square-shaped objects do you see around?"},
        task:{tr:"Kanvasa bir kare damgala ve 1-2 kare şeklinde nesne yaz (örn: pencere, masa üstü).",ku:"Çaryalîyekê li kanvasê dayne û 1-2 tiştên çaryaliyî binivîse.",en:"Place a square on canvas and list 1-2 real-life square objects."}},
      {p:"DO",q:{tr:"Karenin kaç köşesi var? Kaç kenarı? Kenarları ne özelliktedir?",ku:"Çaryalî çend goşe hene? Çend kêlek? Kêlek çawa ne?",en:"How many corners does a square have? How many sides? What about the sides?"},
        task:{tr:"4 farklı büyüklükte kare yerleştir. Her birinin kenarlarını cetvelle ölç.",ku:"4 çaryalîyên cuda dayne. Kêlekên wan bi xetkêşê bipîve.",en:"Place 4 squares of different sizes. Measure sides with the ruler."}},
      {p:"E",q:{tr:"Şimdi kendi sözlerinle anlat: Kare hangi özellikleri olan şekildir?",ku:"Niha bi peyvên xwe bêje: Çaryalî çi taybetmendiyên wê hene?",en:"Now describe in your own words: what makes a shape a square?"},
        task:{tr:"En az 3 özellik yaz: kenar sayısı, kenar uzunlukları, açılar.",ku:"Bi kêmî 3 taybetî binivîse.",en:"Write at least 3 properties: sides, lengths, angles."}},
      {p:"FO",q:{tr:"Kareyi ikiye katla. İki katladığında kaç farklı şekil çıkabilir? Hepsini dene.",ku:"Çaryalîyê du caran qat bike. Çend teşeyên cuda derdikevin? Ceriband.",en:"Fold a square twice. How many different shapes can result? Try them all."},
        task:{tr:"Kanvasa küçük kareler yerleştirip yarıya böl: üçgen, dikdörtgen, küçük kareler — kaç farklı yol buldun?",ku:"Li kanvasê çaryalîyan dayne û nîve bike: sêgoşe, çarhêla rast, çaryalîyên piçûk.",en:"Place squares on canvas and halve them: triangle, rectangle, smaller squares. How many ways?"}},
      {p:"IN",q:{tr:"Karenin tüm özelliklerini özetle. Kare aynı zamanda hangi diğer şekillerdir?",ku:"Hemû taybetmendiyên çaryaliyê kurt bike.",en:"Summarize all properties of a square. What else is a square also?"},
        task:{tr:"Özet: 4 eşit kenar, 4 dik açı, 4 simetri ekseni. Kare aynı zamanda dikdörtgen ve eşkenar dörtgendir.",ku:"Kurte: 4 kêlekên wekhev, 4 guçên rast, 4 eksena nîvheviyê.",en:"Summary: 4 equal sides, 4 right angles, 4 lines of symmetry. Also a rectangle and rhombus."}},
    ]},
  {id:"rh_seq",level:1,topic:{tr:"Eşkenar Dörtgen",ku:"Lozeng",en:"Rhombus"},icon:"◆",
    // Crowley 1987 p.5-6 örneği — Van Hiele'lerin orijinal örneği
    phases:[
      {p:"I",q:{tr:"Eşkenar dörtgen nedir? Kareyle nasıl benzer, nasıl farklı?",ku:"Lozeng çi ye? Bi çaryalîyê re çawa mîna hev û çawa cuda ye?",en:"What is a rhombus? How is it similar to/different from a square?"},
        task:{tr:"Bir kare ve bir eşkenar dörtgen yan yana koy. Kenarlarını incele.",ku:"Çaryalîyek û lozengek dayne. Kêlekên wan bişopîne.",en:"Place a square and rhombus side-by-side. Examine their sides."}},
      {p:"DO",q:{tr:"Eşit köşegenli bir eşkenar dörtgen oluştur. Sonra daha büyük, sonra daha küçük.",ku:"Lozengek bi goşeyên wekhev çêbike. Paşê mezintir, paşê biçûktir.",en:"Build a rhombus with equal diagonals. Then a larger one, then smaller."},
        task:{tr:"Geoboard kullanarak: 4 dik açılı eşkenar dörtgen yap. Sonra 3 dik açı, sonra 2, sonra 1. Hangisi mümkün?",ku:"Bi geoboardê: lozengek bi 4 guçên rast çêbike. Paşê 3, 2, 1. Kîjan mimkin e?",en:"Using geoboard: rhombus with 4 right angles. Then 3, then 2, then 1. Which work?"}},
      {p:"E",q:{tr:"Hangi eşkenar dörtgen aslında karedir? Neden?",ku:"Kîjan lozeng di eslê xwe de çaryalî ye? Çima?",en:"Which rhombus is actually a square? Why?"},
        task:{tr:"Kendi sözünle: '4 dik açılı eşkenar dörtgen _______'dir. Kare ⊂ Eşkenar dörtgen mi?",ku:"Bi peyvên xwe: 'Lozenga bi 4 guçên rast _______ e.'",en:"In your words: 'A rhombus with 4 right angles is a _______.' Is square ⊂ rhombus?"}},
      {p:"FO",q:{tr:"Bir kağıdı iki kez katla, köşesini kes. Hangi şekil çıkar? Önce tahmin et!",ku:"Kaxezek du caran qat bike, goşe jê bibe. Kîjan teşe derdikeve?",en:"Fold paper twice, cut the corner. Which shape emerges? Predict first!"},
        task:{tr:"30°, 45°, 60° açılarla kes. Her biri farklı eşkenar dörtgen mi verir?",ku:"Bi guçên 30°, 45°, 60° jê bibe.",en:"Cut at 30°, 45°, 60°. Does each give a different rhombus?"}},
      {p:"IN",q:{tr:"Eşkenar dörtgenin tüm özelliklerini özetle.",ku:"Hemû taybetmendiyên lozengê kurt bike.",en:"Summarize all properties of a rhombus."},
        task:{tr:"4 eşit kenar, köşegenler birbirini ortadan dik keser, karşılıklı açılar eşit. Özel hali: KARE.",ku:"4 kêlekên wekhev, goşe li navendê hev hildiweşin, guçên rûbirû wekhev.",en:"4 equal sides, diagonals bisect at right angles, opposite angles equal. Special case: SQUARE."}},
    ]},
  {id:"ra_seq",level:1,topic:{tr:"Dik Açı",ku:"Guça Rast",en:"Right Angle"},icon:"📐",
    phases:[
      {p:"I",q:{tr:"Dik açı nedir? Odanda kaç tane dik açı var?",ku:"Guça rast çi ye? Li odeya te çend guçên rast hene?",en:"What is a right angle? How many do you see in your room?"},
        task:{tr:"Kare, dikdörtgen, dik üçgen damgala. Her birinin kaç dik açısı var?",ku:"Çaryalî, çarhêla rast, sêgoşeya rastê dayne.",en:"Place square, rectangle, right triangle. How many right angles each?"}},
      {p:"DO",q:{tr:"İletki ile ölç: Kaç derece? Her açı 90° mi?",ku:"Bi guçpîvê bipîve: çend derece ye?",en:"Measure with protractor: how many degrees? Each 90°?"},
        task:{tr:"En az 5 farklı şekil damgala. İletkiyle her köşeyi ölç. 90° olanları not et.",ku:"5 teşeyan dayne. Her goşeyê bipîve.",en:"Place 5 shapes. Measure each corner. Note which are 90°."}},
      {p:"E",q:{tr:"Dik açı ile geniş, dar, düz açıyı karşılaştır.",ku:"Guça rast bi fireh, teng, rast re berhev bike.",en:"Compare right angle with acute, obtuse, straight angles."},
        task:{tr:"Kendi sözünle: 'Dik açı 90°'dir. Ondan büyükse _______, küçükse _______.'",ku:"Bi peyvên xwe: 'Guça rast 90° ye.'",en:"In your words: 'Right angle is 90°. Larger is _______, smaller is _______.'"}},
      {p:"FO",q:{tr:"İki şeklin iki kenarı dik mi? Kontrol et ve farklı örnekler bul.",ku:"Du kêlek li hev dikin? Kontrol bike.",en:"Are two sides perpendicular? Check and find different examples."},
        task:{tr:"Çizim aracıyla 3 farklı dik açı çiz: L-şekli, T-şekli, +-şekli.",ku:"3 guçên rastan bi xêzkirinê çêbike.",en:"Draw 3 different right angles: L-shape, T-shape, +-shape."}},
      {p:"IN",q:{tr:"Dik açıların kullanım alanlarını özetle.",ku:"Cihên bikaranîna guçên rastan kurt bike.",en:"Summarize uses of right angles."},
        task:{tr:"Özet: 90°, kare/dikdörtgen köşeleri, dikey hat, koordinat sistemi ekseni.",ku:"Kurte: 90°, goşeyên çaryalî/çarhêla rast, xeta tîkkî.",en:"Summary: 90°, square/rectangle corners, perpendicular line, coordinate axes."}},
    ]},
];
