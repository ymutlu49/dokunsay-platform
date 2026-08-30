// ══════════════════════════════════════════════════════════════
// HIZLI ETKİNLİKLER (VH_ACTS_OLD)
//
// Çerçeve: Van Hiele seviyeleri (level: 0 Görsel · 1 Analiz · 2 Soyutlama)
//          + Crowley (1987) 5 fazlı ders (phase: I/DO/E/FO/IN)
//
// 2026-07-19 PLATFORM DENETİMİ — bu dosyada kapatılan üç kusur:
//
//  1) İÇERİK EKSİK DİLLİYDİ. Arayüz 5 dil sunuyor (tr/ku/en/ar/fa) ama
//     etkinlik metinleri yalnız tr/ku/en idi; `x[lang]||x.tr` kalıbı
//     ar/fa'da SESSİZCE Türkçeye düşüyordu — yani Arapça arayüzde
//     sorular Türkçe çıkıyordu. Artık her metin nesnesi beş dili de
//     taşır (§1.7).
//
//  2) ZORLUK BASAMAĞI HİÇ YOKTU. STANDARDS §1.6 beş basamak ister
//     (1 Keşif · 2 Rehberli · 3 Yönlendirilmiş · 4 Bağımsız · 5 Transfer);
//     dosyada tek bir `diff` alanı, uygulamada da hiçbir gösterge yoktu.
//     Artık her etkinlik `diff` taşır ve DiffBadge beş basamağı çizer.
//     Not: geometride zorluk SAYIDAN değil GÖREV BİÇİMİNDEN gelir —
//     tanıma → ölçme → ayırt etme → çıkarım → üretme/aktarma.
//     diff 1 (Keşif) etkinlik kartıyla değil, serbest kanvas ve geometri
//     tahtası kipleriyle karşılanır (aşağıda EXPLORE_MODES).
//
//  3) KAVRAM YANILGISI ETKİNLİKLERİ ETİKETSİZDİ. Yanılgı kataloğu
//     (constants/misconceptions.js) yalnız öğretmene bakıyordu; hiçbir
//     ETKİNLİK `mis`/`src` taşımıyordu. Artık yanılgıyı doğrudan hedefleyen
//     etkinlikler `mis` (yanılgının ifadesi) + `src` (gerçek literatür
//     atfı) taşır ve kart bunu görünür kılar (§1.5).
//
// Atıflar bu dosyada kullanıldığı biçimiyle:
//  • Hershkowitz, R. (1989). Visualization in geometry: Two sides of the
//    same coin. Focus on Learning Problems in Mathematics, 11(1), 61–76.
//  • Clements, D. H., & Battista, M. T. (1992). Geometry and spatial
//    reasoning. In D. A. Grouws (Ed.), Handbook of Research on Mathematics
//    Teaching and Learning (pp. 420–464). NCTM / Macmillan.
//  • Clements, D. H., & Battista, M. T. (1989). Learning of geometric
//    concepts in a Logo environment. JRME, 20(5), 450–467.
//  • Mitchelmore, M. C., & White, P. (2000). Development of angle concepts
//    by progressive abstraction and generalisation. Educational Studies in
//    Mathematics, 41(3), 209–238.
//  • Chappell, M. F., & Thompson, D. R. (1999). Perimeter or area? Which
//    measure is it? Mathematics Teaching in the Middle School, 5(1), 20–23.
//  • De Villiers, M. (1994). The role and function of a hierarchical
//    classification of quadrilaterals. For the Learning of Mathematics, 14(1), 11–18.
//  • Crowley, M. L. (1987). The van Hiele model of the development of
//    geometric thought. NCTM Yearbook, 1–16.
// ══════════════════════════════════════════════════════════════

// §1.6 basamak 1 (Keşif) — kural yok, hedef yok, yalnız etkileşim.
// Etkinlik kartı biçiminde DEĞİL, uygulamanın serbest kiplerinde yaşar.
// Zorluk göstergesi bu basamağı da tanısın diye burada belgelenir.
export const EXPLORE_MODES = [
  { id: "free_canvas", diff: 1, level: 0,
    label: { tr: "Serbest Kanvas", ku: "Kanvasa Serbest", en: "Free Canvas", ar: "لوحة حرّة", fa: "بوم آزاد" } },
  { id: "free_geoboard", diff: 1, level: 0,
    label: { tr: "Serbest Geometri Tahtası", ku: "Textaya Geometriyê ya Serbest", en: "Free Geoboard", ar: "لوحة هندسية حرّة", fa: "تختۀ هندسی آزاد" } },
];

// Klasik hızlı etkinlikler (eski VH_ACTS):
export const VH_ACTS_OLD=[
  // ═══════════ L0 — Görsel ═══════════
  {id:"l0_a",level:0,diff:2,cra:"C",icon:"👁",
   label:{tr:"Üçgeni Bul",ku:"Sêgoşeyê Bibîne",en:"Find the Triangle",ar:"ابحث عن المثلث",fa:"مثلث را پیدا کن"},
   q:{tr:"Aşağıdakilerden hangisi üçgendir?",ku:"Ji van kîjan sêgoşe ye?",en:"Which of these is a triangle?",ar:"أيّ من هذه الأشكال مثلث؟",fa:"کدام‌یک از این‌ها مثلث است؟"},
   opts:["eq_tri","square","circle","hexagon"],correct:"eq_tri",
   hint:{tr:"3 düz kenarı olan şekle üçgen denir.",ku:"Teşeya bi 3 kêlekên rast sêgoşe ye.",en:"A triangle has exactly 3 straight sides.",ar:"المثلث له ثلاثة أضلاع مستقيمة بالضبط.",fa:"مثلث دقیقاً سه ضلع مستقیم دارد."}},

  {id:"l0_b",phase:"DO",level:0,diff:3,icon:"🔀",
   label:{tr:"Dörtgen Bul",ku:"Çarhêlan Bibîne",en:"Find Quadrilaterals",ar:"ابحث عن الرباعيات",fa:"چهارضلعی‌ها را پیدا کن"},
   q:{tr:"Hangileri dörtgendir? (Birden fazla seçilebilir)",ku:"Kîjan çarhêl in? (Zêdetir jî tê hilbijartin)",en:"Which are quadrilaterals? (Select all that apply)",ar:"أيّها رباعيات الأضلاع؟ (اختر كل ما ينطبق)",fa:"کدام‌ها چهارضلعی هستند؟ (چند گزینه)"},
   opts:["square","rectangle","trapezoid","eq_tri","circle"],correct:["square","rectangle","trapezoid"],multi:true,
   hint:{tr:"Dörtgenlerin tam 4 kenarı vardır.",ku:"Çarhêl 4 kêlekên xwe hene.",en:"Quadrilaterals have exactly 4 sides.",ar:"للرباعيات أربعة أضلاع بالضبط.",fa:"چهارضلعی‌ها دقیقاً چهار ضلع دارند."}},

  {id:"l0_c",phase:"I",level:0,diff:2,icon:"🌍",
   label:{tr:"Gerçek Yaşam",ku:"Jiyana Rastîn",en:"Real Life",ar:"الحياة الواقعية",fa:"زندگی واقعی"},
   q:{tr:"Stop tabelasının şekli nedir?",ku:"Teşeya levha STOP çi ye?",en:"What shape is a stop sign?",ar:"ما شكل لافتة «قف»؟",fa:"تابلوی ایست چه شکلی است؟"},
   opts:["octagon","circle","square","hexagon"],correct:"octagon",
   hint:{tr:"Stop tabelası 8 kenarlı düzgün sekizgendir.",ku:"Levha STOP heşthêla rêkpêk e.",en:"A stop sign is a regular octagon with 8 sides.",ar:"لافتة «قف» مثمّن منتظم بثمانية أضلاع.",fa:"تابلوی ایست هشت‌ضلعی منتظم است."}},

  {id:"l0_d",phase:"DO",level:0,diff:2,icon:"🔢",
   label:{tr:"Kenar Say",ku:"Kêlekan Bijimêre",en:"Count Sides",ar:"عُدّ الأضلاع",fa:"ضلع‌ها را بشمار"},
   q:{tr:"Karenin kaç kenarı vardır?",ku:"Çaryalî çend kêlek hene?",en:"How many sides does a square have?",ar:"كم ضلعاً للمربّع؟",fa:"مربع چند ضلع دارد؟"},
   answer:4,min:0,max:10,
   hint:{tr:"Kareyi parmağınla çevre boyunca iz et.",ku:"Çaryaliyê bi tiliya xwe dişopîne.",en:"Trace around the square with your finger.",ar:"تتبّع محيط المربّع بإصبعك.",fa:"با انگشتت دور مربع را دنبال کن."}},

  {id:"l0_e",phase:"E",level:0,diff:3,icon:"◯",
   mis:{tr:"Daire ile çember eşanlamlı sanılır",ku:"Dayre û xelek wek hevwate tên dîtin",en:"Disk and circle are conflated",ar:"الخلط بين القرص والدائرة",fa:"اشتباه گرفتن قرص و دایره"},
   src:"Clements & Battista 1992",
   label:{tr:"Daire mi Çember mi?",ku:"Dayre an Xelek?",en:"Disk or Circle?",ar:"قرص أم دائرة؟",fa:"قرص یا دایره؟"},
   q:{tr:"Yalnızca sınır çizgisi olan, içi boş olan şekil hangisidir?",ku:"Ya ku tenê xêza sînorê wê heye û hundurê wê vala ye kîjan e?",en:"Which shape has only a boundary line with no interior?",ar:"أيّ شكل له خطّ حدود فقط دون منطقة داخلية؟",fa:"کدام شکل فقط خط مرزی دارد و درون ندارد؟"},
   opts:["circle","disk","square","eq_tri"],correct:"circle",
   hint:{tr:"Çember yalnızca eğri çizgidir — alanı yoktur, yalnız uzunluğu (çevresi) vardır. Daire ise çemberin sınırladığı iç bölge ile birlikte bütünün kendisidir; alanı vardır.",ku:"Xelek tenê xêzeke xwar e — rûberê wê tune, tenê dirêjahiya wê heye. Dayre jî herêma hundur bi xelekê re tevahî ye; rûberê wê heye.",en:"A circle is just the curved boundary line — it has no area, only length (circumference). A disk is the circle together with the interior region it bounds; it has area.",ar:"الدائرة هي خطّ المنحنى الحدّي فقط — لا مساحة لها، بل طول (محيط) فقط. أمّا القرص فهو الدائرة مع المنطقة الداخلية التي تحدّها؛ وله مساحة.",fa:"دایره فقط خطّ مرزی خمیده است — مساحت ندارد، تنها طول (محیط) دارد. قرص، دایره به‌همراه ناحیۀ درونی آن است و مساحت دارد."}},

  {id:"l0_f",phase:"FO",level:0,diff:3,icon:"🍕",
   label:{tr:"Dilim Sayısı",ku:"Reqema Parçeyê",en:"Slice Count",ar:"عدد القطع",fa:"شمار قاچ‌ها"},
   q:{tr:"Düzgün altıgen kaç eşit parçaya bölünebilir?",ku:"Şeşhêla rêkpêk dikare bibe çend parçeyên wekhev?",en:"How many equal parts can a regular hexagon be divided into?",ar:"إلى كم جزء متساوٍ يمكن تقسيم السداسي المنتظم؟",fa:"شش‌ضلعی منتظم به چند بخش برابر تقسیم می‌شود؟"},
   answer:6,min:1,max:12,
   hint:{tr:"Merkeze çizilen her çizgi bir parça oluşturur. 6 kenar = 6 parça.",ku:"Her xêza navendê yek parçe çêdike. 6 kêlek = 6 parçe.",en:"Each line to center makes one slice. 6 sides = 6 slices.",ar:"كل خطّ إلى المركز يصنع قطعة. ٦ أضلاع = ٦ قطع.",fa:"هر خط تا مرکز یک قاچ می‌سازد. ۶ ضلع = ۶ قاچ."}},

  {id:"l0_g",phase:"FO",level:0,diff:2,icon:"👀",
   label:{tr:"Köşe Say",ku:"Goşeyan Bijimêre",en:"Count Corners",ar:"عُدّ الرؤوس",fa:"گوشه‌ها را بشمار"},
   q:{tr:"Beşgenin kaç köşesi vardır?",ku:"Pênchêlê çend goşe hene?",en:"How many corners does a pentagon have?",ar:"كم رأساً للخماسي؟",fa:"پنج‌ضلعی چند گوشه دارد؟"},
   answer:5,min:0,max:10,
   hint:{tr:"Her kenar biri bir köşe ile biter; kenar sayısı = köşe sayısı.",ku:"Her kêlek bi goşeyek bidawî dibe; hejmara kêlekan = hejmara goşeyan.",en:"Each side ends at a corner; sides = corners.",ar:"كل ضلع ينتهي عند رأس؛ عدد الأضلاع = عدد الرؤوس.",fa:"هر ضلع به یک گوشه ختم می‌شود؛ شمار ضلع = شمار گوشه."}},

  {id:"l0_h",phase:"DO",level:0,diff:3,icon:"🔄",
   mis:{tr:"Şeklin duruşu değişince kimliğinin de değiştiği sanılır (döndürülmüş kare = 'elmas')",ku:"Tê fikirîn ku dema alîyê teşeyê biguhere, nasnameya wê jî diguhere",en:"Orientation is treated as identity — a rotated square is called a 'diamond'",ar:"يُظَنّ أنّ تغيّر الاتجاه يغيّر هوية الشكل (مربّع مُدار = «معيّن»)",fa:"تصور می‌شود چرخش، هویت شکل را عوض می‌کند (مربع چرخیده = «لوزی»)"},
   src:"Clements & Battista 1992",
   label:{tr:"Döndürülmüş Kare",ku:"Çaryaliya Zivirandî",en:"Rotated Square",ar:"مربّع مُدار",fa:"مربع چرخیده"},
   q:{tr:"Aşağıdaki 45° döndürülmüş şekil hala kare midir?",ku:"Teşeya 45° hatiye zivirandin hîn çaryalî ye?",en:"Is this shape rotated 45° still a square?",ar:"هل يبقى هذا الشكل المُدار ٤٥° مربّعاً؟",fa:"آیا این شکلِ ۴۵ درجه چرخیده هنوز مربع است؟"},
   opts:{tr:["Evet, dönse de kare kare kalır","Hayır, artık eşkenar dörtgendir","Hayır, artık baklavadır","Hayır, artık başka bir şekildir"],
         ku:["Erê, heke biziviriye jî çaryalî ye","Na, niha lozeng e","Na, niha baqlawa ye","Na, niha teşeyeke din e"],
         en:["Yes, a rotated square is still a square","No, now it's a rhombus","No, now it's a diamond","No, it's a different shape"],
         ar:["نعم، المربّع المُدار يبقى مربّعاً","لا، صار معيّناً","لا، صار «ماسة»","لا، صار شكلاً آخر"],
         fa:["بله، مربع چرخیده باز مربع است","نه، حالا لوزی است","نه، حالا «الماس» است","نه، شکل دیگری است"]},
   correct:0,
   hint:{tr:"Bir şeklin ismi yönüne değil özelliklerine bağlıdır. Dönse bile 4 eşit kenar ve 4 dik açı var → hala kare.",ku:"Navê teşeyê ne bi alîyê xwe, bi taybetmendiyan ve girêdayî ye. Heke biziviriye jî 4 kêlekên wekhev û 4 goşeyên rast hene → hîn çaryalî ye.",en:"A shape's name depends on properties, not orientation. Still has 4 equal sides + 4 right angles → still a square.",ar:"اسم الشكل يعتمد على خصائصه لا على اتجاهه. ما زال له ٤ أضلاع متساوية و٤ زوايا قائمة → ما زال مربّعاً.",fa:"نام شکل به ویژگی‌هایش وابسته است نه جهتش. هنوز ۴ ضلع برابر و ۴ زاویۀ قائمه دارد → هنوز مربع است."}},

  {id:"l0_i",level:0,diff:2,cra:"C",icon:"🎨",
   mis:{tr:"Renk ve boyut gibi geometri dışı özellikler şeklin adını belirler sanılır",ku:"Tê fikirîn ku reng û mezinahî navê teşeyê diyar dikin",en:"Non-geometric attributes (colour, size) are treated as defining",ar:"تُعَدّ صفات غير هندسية (اللون، الحجم) محدِّدةً للشكل",fa:"ویژگی‌های غیرهندسی (رنگ، اندازه) تعیین‌کنندۀ شکل پنداشته می‌شوند"},
   src:"Hershkowitz 1989",
   label:{tr:"Renk ve Şekil",ku:"Reng û Teşe",en:"Color vs Shape",ar:"اللون مقابل الشكل",fa:"رنگ در برابر شکل"},
   q:{tr:"Büyük kırmızı bir daire ile küçük mavi bir daire... Bunlar aynı şekil mi?",ku:"Dayreyeke sor ya mezin û dayreyeke şîn ya piçûk... Ev teşeya heman in?",en:"A big red disk and a small blue disk... Same shape?",ar:"قرص أحمر كبير وقرص أزرق صغير... هل هما الشكل نفسه؟",fa:"یک قرص قرمزِ بزرگ و یک قرص آبیِ کوچک... آیا شکلشان یکی است؟"},
   opts:{tr:["Evet, ikisi de daire","Hayır, renkleri farklı","Hayır, boyutları farklı","Hayır, ikisi farklı şekil"],
         ku:["Erê, her du jî dayre ne","Na, rengên wan cuda ne","Na, mezinahiya wan cuda ye","Na, her du jî teşeyên cuda ne"],
         en:["Yes, both are disks","No, different colors","No, different sizes","No, different shapes"],
         ar:["نعم، كلاهما قرص","لا، لونهما مختلف","لا، حجمهما مختلف","لا، شكلاهما مختلفان"],
         fa:["بله، هر دو قرص‌اند","نه، رنگشان فرق دارد","نه، اندازه‌شان فرق دارد","نه، شکلشان فرق دارد"]},
   correct:0,
   hint:{tr:"Şekil adı renk ve boyuttan bağımsızdır. Sadece geometrik özellikler önemlidir.",ku:"Navê teşeyê ji reng û mezinahiyê serbixwe ye.",en:"Shape name is independent of color and size. Only geometry matters.",ar:"اسم الشكل مستقلّ عن اللون والحجم؛ الخصائص الهندسية وحدها هي المهمّة.",fa:"نام شکل مستقل از رنگ و اندازه است؛ تنها ویژگی‌های هندسی مهم‌اند."}},

  {id:"l0_j",phase:"FO",level:0,diff:2,icon:"🏠",
   label:{tr:"Ev Şekli",ku:"Teşeya Malê",en:"House Shape",ar:"شكل البيت",fa:"شکل خانه"},
   q:{tr:"Basit bir ev çizimi hangi şekillerden oluşur?",ku:"Xêzeke sade ya malê ji kîjan teşeyan pêk tê?",en:"A simple house drawing uses which shapes?",ar:"رسمة بيت بسيطة تتكوّن من أيّ شكلين؟",fa:"نقاشی سادۀ یک خانه از کدام شکل‌ها ساخته می‌شود؟"},
   opts:{tr:["Kare + Üçgen","Daire + Kare","Üçgen + Üçgen","Dikdörtgen + Kare"],
         ku:["Çaryalî + Sêgoşe","Dayre + Çaryalî","Sêgoşe + Sêgoşe","Çarhêla Rast + Çaryalî"],
         en:["Square + Triangle","Disk + Square","Triangle + Triangle","Rectangle + Square"],
         ar:["مربّع + مثلث","قرص + مربّع","مثلث + مثلث","مستطيل + مربّع"],
         fa:["مربع + مثلث","قرص + مربع","مثلث + مثلث","مستطیل + مربع"]},
   correct:0,
   hint:{tr:"Evin gövdesi kare/dikdörtgen, çatısı üçgendir. Günlük nesneleri geometrik parçalara ayırma önemli bir L0 becerisidir.",ku:"Laşê malê çaryalî, serê wê sêgoşe ye.",en:"House body is square, roof is triangle. Decomposing everyday objects into shapes is a key L0 skill.",ar:"جسم البيت مربّع والسقف مثلث. تفكيك الأشياء اليومية إلى أشكال مهارة أساسية في المستوى ٠.",fa:"بدنۀ خانه مربع و سقف مثلث است. تجزیۀ اشیای روزمره به شکل‌ها مهارتی کلیدی در سطح ۰ است."}},

  {id:"l0_k",phase:"E",level:0,diff:3,icon:"📐",
   mis:{tr:"Prototip dışı örnekler reddedilir — 'çok ince/yayvan üçgen üçgen değildir' sanılır",ku:"Mînakên ne-prototîp têne redkirin — 'sêgoşeya pir zirav ne sêgoşe ye' tê fikirîn",en:"Non-prototypical examples are rejected — a thin 'sliver' triangle is denied",ar:"تُرفَض الأمثلة غير النمطية — يُنكَر أنّ المثلث الرفيع جدّاً مثلث",fa:"نمونه‌های غیرنمونه‌ای رد می‌شوند — مثلث بسیار باریک، مثلث دانسته نمی‌شود"},
   src:"Hershkowitz 1989",
   label:{tr:"Prototip Tuzağı",ku:"Xefika Prototîpê",en:"Prototype Trap",ar:"فخّ النموذج الأوّلي",fa:"دام نمونۀ اولیه"},
   q:{tr:"Çok ince, uzun ve yayvan bir şeklin 3 düz kenarı ve 3 köşesi var. Bu bir üçgen midir?",ku:"Teşeyeke pir zirav û dirêj 3 kêlekên rast û 3 goşe hene. Ev sêgoşe ye?",en:"A very thin, long, flat shape has 3 straight sides and 3 corners. Is it a triangle?",ar:"شكل رفيع جدّاً وطويل له ٣ أضلاع مستقيمة و٣ رؤوس. هل هو مثلث؟",fa:"شکلی بسیار باریک و کشیده، ۳ ضلع مستقیم و ۳ گوشه دارد. آیا مثلث است؟"},
   opts:{tr:["Evet — 3 düz kenar + 3 köşe yeter","Hayır — çok ince olduğu için değil","Hayır — üçgenler sivri ve dik durur","Sadece döndürülürse üçgen olur"],
         ku:["Erê — 3 kêlekên rast + 3 goşe bes e","Na — ji ber ku pir zirav e","Na — sêgoşe divê tûj û rast bin","Tenê heke biziviriye"],
         en:["Yes — 3 straight sides + 3 corners is enough","No — it is far too thin","No — triangles must look pointy and upright","Only if you rotate it"],
         ar:["نعم — ٣ أضلاع مستقيمة و٣ رؤوس تكفي","لا — لأنّه رفيع جدّاً","لا — المثلثات يجب أن تبدو مدبّبة ومنتصبة","فقط إذا أُدير"],
         fa:["بله — ۳ ضلع مستقیم و ۳ گوشه کافی است","نه — چون خیلی باریک است","نه — مثلث باید نوک‌تیز و ایستاده باشد","فقط اگر بچرخد"]},
   correct:0,
   hint:{tr:"Tanım bir şeklin nasıl GÖRÜNDÜĞÜNÜ değil, hangi KOŞULLARI sağladığını söyler. 3 düz kenar + kapalı şekil = üçgen. Ders kitaplarındaki 'güzel' eşkenar üçgen yalnızca en sık gördüğün örnektir; tanım değildir.",ku:"Danasîn nabêje teşe çawa XUYA dike, dibêje kîjan MERCAN pêk tîne. 3 kêlekên rast + teşeya girtî = sêgoşe.",en:"A definition states which CONDITIONS a shape meets, not how it LOOKS. 3 straight sides + closed = triangle. The 'nice' equilateral triangle in textbooks is just the most frequent example, not the definition.",ar:"التعريف يذكر الشروط التي يستوفيها الشكل، لا كيف يبدو. ٣ أضلاع مستقيمة + شكل مغلق = مثلث. المثلث المتساوي الأضلاع «الجميل» في الكتب هو المثال الأشيع فقط، وليس التعريف.",fa:"تعریف می‌گوید شکل چه شرط‌هایی را برآورده می‌کند، نه اینکه چگونه دیده می‌شود. ۳ ضلع مستقیم + بسته = مثلث. مثلث متساوی‌الاضلاعِ «زیبا»ی کتاب‌ها فقط پربسامدترین نمونه است، نه تعریف."}},

  // ═══════════ L1 — Analiz ═══════════
  {id:"l1_a",phase:"DO",level:1,diff:2,icon:"📐",
   label:{tr:"Dik Açı Say",ku:"Guçên Rastan Bijimêre",en:"Count Right Angles",ar:"عُدّ الزوايا القائمة",fa:"زاویه‌های قائمه را بشمار"},
   q:{tr:"Dikdörtgende kaç dik açı vardır?",ku:"Di çarhêla rastê de çend guçên rast hene?",en:"How many right angles does a rectangle have?",ar:"كم زاوية قائمة في المستطيل؟",fa:"مستطیل چند زاویۀ قائمه دارد؟"},
   answer:4,min:0,max:8,
   hint:{tr:"Dik açı 90°'dir; her köşede bir tane.",ku:"Guça rast 90° ye; li her goşeyê yek heye.",en:"A right angle is 90°; there's one at each corner.",ar:"الزاوية القائمة ٩٠°؛ واحدة عند كل رأس.",fa:"زاویۀ قائمه ۹۰ درجه است؛ در هر گوشه یکی."}},

  {id:"l1_b",phase:"DO",level:1,diff:3,icon:"∥",
   label:{tr:"Paralel Kenar",ku:"Kêlekên Hevyalî",en:"Parallel Sides",ar:"الأضلاع المتوازية",fa:"اضلاع موازی"},
   q:{tr:"Hangi dörtgenlerde karşılıklı kenarlar paralel? (Tümünü seç)",ku:"Di kîjan çarhêlan de kêlekên rûbirû hevyalî ne? (Hemûyan hilbijêre)",en:"Which quadrilaterals have parallel opposite sides? (Select all)",ar:"أيّ الرباعيات لها أضلاع متقابلة متوازية؟ (اختر الكل)",fa:"کدام چهارضلعی‌ها اضلاع روبه‌روی موازی دارند؟ (همه را انتخاب کن)"},
   opts:["square","rectangle","trapezoid","rhombus","parallelogram","kite"],correct:["square","rectangle","rhombus","parallelogram"],multi:true,
   hint:{tr:"Paralel kenarlar hiç kesişmez; yamukta yalnız 1 çift, uçurtmada 0 çift vardır.",ku:"Kêlekên hevyalî qet nakesên; di trapezoîdê de 1 cot, di çargoşeya balafirê de 0 cot.",en:"Parallel sides never meet; trapezoid has 1 pair, kite has 0.",ar:"الأضلاع المتوازية لا تتقاطع أبداً؛ لشبه المنحرف زوج واحد وللطائرة الورقية لا شيء.",fa:"اضلاع موازی هرگز هم را قطع نمی‌کنند؛ ذوزنقه یک جفت و بادبادک هیچ جفتی ندارد."}},

  {id:"l1_c",phase:"E",level:1,diff:3,icon:"∠",
   label:{tr:"Açı Türü",ku:"Cureyê Guçê",en:"Angle Type",ar:"نوع الزاوية",fa:"نوع زاویه"},
   q:{tr:"Eşkenar üçgendeki her açı kaç derecedir?",ku:"Her guça di sêgoşeya wekhev de çend derece ye?",en:"How many degrees is each angle in an equilateral triangle?",ar:"كم درجة كل زاوية في المثلث المتساوي الأضلاع؟",fa:"هر زاویه در مثلث متساوی‌الاضلاع چند درجه است؟"},
   answer:60,min:0,max:180,
   hint:{tr:"Üçgende iç açılar toplamı 180°; 3 eşit açı = 180÷3 = 60°.",ku:"Di sêgoşeyê de komê guçên hundur 180° ye; 3 guçên wekhev = 60°.",en:"Triangle interior angles sum to 180°; 3 equal angles = 60°.",ar:"مجموع زوايا المثلث ١٨٠°؛ ٣ زوايا متساوية = ٦٠°.",fa:"مجموع زاویه‌های مثلث ۱۸۰ درجه است؛ ۳ زاویۀ برابر = ۶۰ درجه."}},

  {id:"l1_d",phase:"DO",level:1,diff:3,icon:"⟺",
   label:{tr:"Simetri Ekseni",ku:"Eksena Nîvheviyê",en:"Lines of Symmetry",ar:"محاور التناظر",fa:"محورهای تقارن"},
   q:{tr:"Karenin kaç simetri ekseni vardır?",ku:"Çaryaliyê çend eksena nîvheviyê hene?",en:"How many lines of symmetry does a square have?",ar:"كم محور تناظر للمربّع؟",fa:"مربع چند محور تقارن دارد؟"},
   answer:4,min:0,max:8,
   hint:{tr:"Yatay + dikey + 2 köşegen ekseni = toplam 4.",ku:"Asoyî + tîkkî + 2 eksena goşeyê = 4 bi tevahî.",en:"Horizontal + vertical + 2 diagonal axes = 4 total.",ar:"أفقي + رأسي + قطران = ٤ محاور.",fa:"افقی + عمودی + ۲ قطر = مجموعاً ۴."}},

  {id:"l1_e",phase:"E",level:1,diff:3,icon:"📏",
   label:{tr:"Düzgün mü?",ku:"Rêkpêk e?",en:"Is it Regular?",ar:"هل هو منتظم؟",fa:"آیا منتظم است؟"},
   q:{tr:"Hangi şekil hem eşit kenarlı hem eşit açılıdır?",ku:"Kîjan teşe hem kêlekên wekhev hem guçên wekhev hene?",en:"Which shape has both equal sides and equal angles?",ar:"أيّ شكل له أضلاع متساوية وزوايا متساوية معاً؟",fa:"کدام شکل هم اضلاع برابر و هم زاویه‌های برابر دارد؟"},
   opts:["rectangle","rhombus","square","trapezoid"],correct:"square",
   hint:{tr:"Düzgün çokgen: tüm kenarlar ve açılar eşit. Dikdörtgende açılar eşit ama kenarlar değil; eşkenar dörtgende kenarlar eşit ama açılar değil.",ku:"Çendhêla rêkpêk: hemû kêlek û guç wekhev. Di çarhêla rastê de guç wekhev lê kêlek ne; di lozengê de kêlek wekhev lê guç ne.",en:"Regular polygon: all sides and angles equal. Rectangle has equal angles but not sides; rhombus has equal sides but not angles.",ar:"المضلّع المنتظم: كل الأضلاع والزوايا متساوية. المستطيل زواياه متساوية لا أضلاعه؛ والمعيّن أضلاعه متساوية لا زواياه.",fa:"چندضلعی منتظم: همۀ اضلاع و زاویه‌ها برابر. مستطیل زاویه‌های برابر دارد نه اضلاع؛ لوزی اضلاع برابر دارد نه زاویه‌ها."}},

  {id:"l1_f",phase:"FO",level:1,diff:3,icon:"🔺",
   label:{tr:"Açı Toplamı",ku:"Komê Guçan",en:"Angle Sum",ar:"مجموع الزوايا",fa:"مجموع زاویه‌ها"},
   q:{tr:"Dörtgenin iç açıları toplamı kaç derecedir?",ku:"Komê guçên hundurê çarhêlê çend derece ye?",en:"What is the sum of interior angles in a quadrilateral?",ar:"كم مجموع الزوايا الداخلية للرباعي؟",fa:"مجموع زاویه‌های داخلی چهارضلعی چند درجه است؟"},
   answer:360,min:0,max:720,
   hint:{tr:"Her dörtgen 2 üçgene bölünebilir: 2 × 180° = 360°.",ku:"Her çarhêl dikare bibe 2 sêgoşe: 2 × 180° = 360°.",en:"Any quadrilateral splits into 2 triangles: 2 × 180° = 360°.",ar:"كل رباعي ينقسم إلى مثلثين: ٢ × ١٨٠° = ٣٦٠°.",fa:"هر چهارضلعی به ۲ مثلث تقسیم می‌شود: ۲ × ۱۸۰ = ۳۶۰ درجه."}},

  {id:"l1_g",phase:"FO",level:1,diff:2,icon:"🔵",
   label:{tr:"Çemberde Açı",ku:"Guça di Xelekê",en:"Circle Angle",ar:"الزاوية في الدائرة",fa:"زاویه در دایره"},
   q:{tr:"Bir çemberde kaç derece vardır?",ku:"Di xelekekê de çend derece hene?",en:"How many degrees are in a full circle?",ar:"كم درجة في الدائرة الكاملة؟",fa:"یک دور کامل چند درجه است؟"},
   answer:360,min:0,max:720,
   hint:{tr:"Tam bir dönüş = 360°. Bu bütün açı sisteminin temelidir.",ku:"Zivirandineke tam = 360°. Ev bingeha hemû pergala guçan e.",en:"A full rotation = 360°. This is the basis of all angle systems.",ar:"الدورة الكاملة = ٣٦٠°، وهي أساس نظام الزوايا كلّه.",fa:"یک چرخش کامل = ۳۶۰ درجه؛ پایۀ کل دستگاه زاویه‌ها."}},

  {id:"l1_h",phase:"DO",level:1,diff:3,icon:"∥",
   label:{tr:"Yamukta Paralel",ku:"Paralel di Trapezîdê",en:"Trapezoid Parallels",ar:"توازي شبه المنحرف",fa:"توازی در ذوزنقه"},
   q:{tr:"Yamuğun kaç çift paralel kenarı vardır?",ku:"Trapezîdê çend cot kêlekên paralel hene?",en:"How many pairs of parallel sides does a trapezoid have?",ar:"كم زوجاً من الأضلاع المتوازية لشبه المنحرف؟",fa:"ذوزنقه چند جفت ضلع موازی دارد؟"},
   answer:1,min:0,max:4,
   hint:{tr:"Yamukta SADECE BİR çift paralel kenar vardır (üst-alt). Diğer iki kenar paralel değil. Bu onu paralelkenardan ayırır.",ku:"Di trapezîdê de TENÊ YEK cot kêlek paralel in (jor-jêr). Du kêlekên din ne paralel in.",en:"Trapezoid has EXACTLY ONE pair of parallel sides (top-bottom). The other two are not parallel.",ar:"لشبه المنحرف زوج واحد فقط من الأضلاع المتوازية (العلوي والسفلي)، والضلعان الآخران غير متوازيين.",fa:"ذوزنقه دقیقاً یک جفت ضلع موازی دارد (بالا و پایین)؛ دو ضلع دیگر موازی نیستند."}},

  {id:"l1_i",phase:"E",level:1,diff:3,icon:"🪞",
   label:{tr:"Simetri Eksenleri",ku:"Eksên Sîmetriyê",en:"Symmetry Axes",ar:"محاور التناظر",fa:"محورهای تقارن"},
   q:{tr:"Eşkenar üçgenin kaç simetri ekseni vardır?",ku:"Sêgoşeya wekhev çend eksên sîmetriyê hene?",en:"How many symmetry axes does an equilateral triangle have?",ar:"كم محور تناظر للمثلث المتساوي الأضلاع؟",fa:"مثلث متساوی‌الاضلاع چند محور تقارن دارد؟"},
   answer:3,min:0,max:6,
   hint:{tr:"Eşkenar üçgenin 3 simetri ekseni vardır — her köşeden karşı kenarın orta noktasına bir eksen.",ku:"Sêgoşeya wekhev 3 eksên sîmetriyê hene — ji her goşeyî ber bi navenda kêleka pêşber.",en:"Equilateral triangle has 3 axes — one from each vertex to midpoint of opposite side.",ar:"للمثلث المتساوي الأضلاع ٣ محاور — من كل رأس إلى منتصف الضلع المقابل.",fa:"مثلث متساوی‌الاضلاع ۳ محور دارد — از هر رأس تا وسط ضلع روبه‌رو."}},

  {id:"l1_j",phase:"FO",level:1,diff:4,icon:"📏",
   label:{tr:"Ayırt Edici Özellik",ku:"Taybetmendiya Cudaker",en:"Discriminating Property",ar:"الخاصّية المميِّزة",fa:"ویژگی متمایزکننده"},
   q:{tr:"Aşağıdaki özelliklerden hangisi SADECE kareye aittir, dikdörtgene ait değildir?",ku:"Kîjan taybetmendî TENÊ ya çaryalî ye, ne ya çarhêla rastê ye?",en:"Which property belongs ONLY to squares, NOT rectangles?",ar:"أيّ خاصّية تخصّ المربّع وحده دون المستطيل؟",fa:"کدام ویژگی فقط از آنِ مربع است و نه مستطیل؟"},
   opts:{tr:["4 dik açısı vardır","Karşı kenarları paraleldir","Tüm kenarları eşittir","4 kenarlı bir şekildir"],
         ku:["4 goşeyên rast hene","Kêlekên pêşber paralel in","Hemû kêlek wekhev in","Teşeya 4-kêlek e"],
         en:["Has 4 right angles","Opposite sides parallel","All sides equal","Has 4 sides"],
         ar:["له ٤ زوايا قائمة","أضلاعه المتقابلة متوازية","كل أضلاعه متساوية","له ٤ أضلاع"],
         fa:["۴ زاویۀ قائمه دارد","اضلاع روبه‌رو موازی‌اند","همۀ اضلاع برابرند","۴ ضلع دارد"]},
   correct:2,
   hint:{tr:"Karenin tüm kenarları eşit — bu özellik dikdörtgende olmak zorunda değil. Diğer özellikler her iki şekilde de var.",ku:"Hemû kêlekên çaryalî wekhev in — ev taybetmendî di çarhêla rastê de ne pêwîst e.",en:"Square has all sides equal — this property isn't required for rectangle. Other properties are shared.",ar:"كل أضلاع المربّع متساوية — وهذه ليست شرطاً في المستطيل. أمّا بقية الخصائص فمشتركة.",fa:"همۀ اضلاع مربع برابرند — این در مستطیل الزامی نیست. بقیۀ ویژگی‌ها مشترک‌اند."}},

  {id:"l1_k",phase:"E",level:1,diff:3,icon:"📐",
   mis:{tr:"Açının büyüklüğü kollarının uzunluğuna bağlı sanılır",ku:"Tê fikirîn ku mezinahiya guçê bi dirêjahiya milên wê ve girêdayî ye",en:"Angle size is believed to depend on the length of its rays",ar:"يُظَنّ أنّ قياس الزاوية يعتمد على طول ضلعيها",fa:"پنداشته می‌شود اندازۀ زاویه به طول ساق‌هایش بستگی دارد"},
   src:"Mitchelmore & White 2000",
   label:{tr:"Kol Uzunluğu Tuzağı",ku:"Xefika Dirêjahiya Milan",en:"Ray Length Trap",ar:"فخّ طول الضلع",fa:"دام طول ساق"},
   q:{tr:"İki açı da 40°. Birincinin kolları çok uzun, ikincininki çok kısa. Hangisi daha BÜYÜK bir açıdır?",ku:"Her du guç 40° ne. Milên ya yekem pir dirêj, yên ya duyem pir kurt in. Kîjan guça MEZINTIR e?",en:"Two angles both measure 40°. The first has very long rays, the second very short ones. Which angle is LARGER?",ar:"زاويتان قياسهما ٤٠°. الأولى ضلعاها طويلان جدّاً والثانية قصيران جدّاً. أيّهما أكبر؟",fa:"دو زاویه هر دو ۴۰ درجه‌اند. اولی ساق‌های بسیار بلند و دومی ساق‌های بسیار کوتاه دارد. کدام بزرگ‌تر است؟"},
   opts:{tr:["İkisi eşit — kol uzunluğu açıyı değiştirmez","Uzun kollu olan","Kısa kollu olan","Ölçmeden bilinemez"],
         ku:["Her du wekhev in — dirêjahiya milan guçê naguherîne","Ya bi milên dirêj","Ya bi milên kurt","Bêyî pîvandinê nayê zanîn"],
         en:["Equal — ray length does not change the angle","The one with long rays","The one with short rays","Impossible to tell without measuring"],
         ar:["متساويتان — طول الضلع لا يغيّر الزاوية","ذات الضلعين الطويلين","ذات الضلعين القصيرين","لا يمكن معرفته دون قياس"],
         fa:["برابرند — طول ساق زاویه را عوض نمی‌کند","آن‌که ساق بلند دارد","آن‌که ساق کوتاه دارد","بدون اندازه‌گیری معلوم نیست"]},
   correct:0,
   hint:{tr:"Açı, iki ışın arasındaki DÖNME MİKTARIDIR — kolları uzatmak dönmeyi değiştirmez. Kolları kalemle uzat, iletkiyle yeniden ölç: yine 40° okursun.",ku:"Guç MEZINAHIYA ZIVIRÎNÊ ya di navbera du tîrêjan de ye — dirêjkirina milan zivirînê naguherîne. Bi qelemê dirêj bike û bi pîleyvayê dîsa bipîve: dîsa 40° ye.",en:"An angle is the amount of TURN between two rays — extending the rays doesn't change the turn. Extend them with a pencil and re-measure with the protractor: still 40°.",ar:"الزاوية مقدار الدوران بين شعاعين — وإطالة الشعاعين لا تغيّر الدوران. مدّهما بالقلم وأعد القياس بالمنقلة: ما زالت ٤٠°.",fa:"زاویه مقدار چرخش میان دو نیم‌خط است — بلندتر کردن ساق‌ها چرخش را عوض نمی‌کند. با مداد امتدادشان بده و با نقاله دوباره اندازه بگیر: باز ۴۰ درجه."}},

  // ═══════════ L2 — Soyutlama ═══════════
  {id:"l2_a",phase:"E",level:2,diff:4,icon:"⊂",
   mis:{tr:"Sınıflar ayrık sanılır — 'kare dikdörtgen olamaz' (kapsayıcı sınıflama reddi)",ku:"Tê fikirîn ku kategorî ji hev veqetandî ne — 'çaryalî nikare çarhêla rast be'",en:"Classes are treated as disjoint — 'a square cannot be a rectangle' (hierarchical inclusion rejected)",ar:"تُعَدّ الفئات منفصلة — «المربّع لا يكون مستطيلاً» (رفض التصنيف الهرمي)",fa:"رده‌ها جدا پنداشته می‌شوند — «مربع نمی‌تواند مستطیل باشد» (رد رده‌بندی سلسله‌مراتبی)"},
   src:"De Villiers 1994",
   label:{tr:"Kare ⊂ Dikdörtgen",ku:"Çaryalî ⊂ Çarhêla Rast",en:"Square ⊂ Rectangle",ar:"مربّع ⊂ مستطيل",fa:"مربع ⊂ مستطیل"},
   q:{tr:"Kare aynı zamanda bir dikdörtgen midir?",ku:"Çaryalî di heman demê de çarhêla rast e?",en:"Is a square also a rectangle?",ar:"هل المربّع مستطيل أيضاً؟",fa:"آیا مربع مستطیل هم هست؟"},
   opts:{tr:["Evet — 4 dik açısı var","Hayır — sadece kare","Bazen","Hiçbir zaman"],
         ku:["Erê — 4 guçên rastan hene","Na — tenê çaryalî ye","Carinan","Tu caran"],
         en:["Yes — it has 4 right angles","No — only a square","Sometimes","Never"],
         ar:["نعم — له ٤ زوايا قائمة","لا — مربّع فقط","أحياناً","أبداً"],
         fa:["بله — ۴ زاویۀ قائمه دارد","نه — فقط مربع است","گاهی","هرگز"]},
   correct:0,
   hint:{tr:"Dikdörtgen tanımı: 4 dik açılı dörtgen. Kare bu koşulu tam sağlar.",ku:"Defînisyona çarhêla rast: çarhêlek bi 4 guçên rast. Çaryalî vê şertê temam pêk tîne.",en:"Rectangle definition: quadrilateral with 4 right angles. A square fully satisfies this.",ar:"تعريف المستطيل: رباعي له ٤ زوايا قائمة. والمربّع يستوفي هذا تماماً.",fa:"تعریف مستطیل: چهارضلعی با ۴ زاویۀ قائمه. مربع این شرط را کاملاً دارد."}},

  {id:"l2_b",phase:"E",level:2,diff:4,icon:"∀",
   label:{tr:"Her Zaman",ku:"Her Tim",en:"Always True",ar:"صحيح دائماً",fa:"همیشه درست"},
   q:{tr:"Tüm paralelkenarlarda her zaman doğru olan hangisi?",ku:"Di hemû paralelograman de her tim rast e kîjan?",en:"Which is always true for all parallelograms?",ar:"أيّ عبارة صحيحة دائماً لكل متوازيات الأضلاع؟",fa:"کدام گزاره برای همۀ متوازی‌الاضلاع‌ها همیشه درست است؟"},
   opts:{tr:["Tüm açılar eşittir","Tüm kenarlar eşittir","Karşılıklı açılar eşittir","Bir açı 90°'dir"],
         ku:["Hemû guç wekhev in","Hemû kêlek wekhev in","Guçên rûbirû wekhev in","Yek guç 90° ye"],
         en:["All angles are equal","All sides are equal","Opposite angles are equal","One angle is 90°"],
         ar:["كل الزوايا متساوية","كل الأضلاع متساوية","الزاويتان المتقابلتان متساويتان","إحدى الزوايا ٩٠°"],
         fa:["همۀ زاویه‌ها برابرند","همۀ اضلاع برابرند","زاویه‌های روبه‌رو برابرند","یک زاویه ۹۰ درجه است"]},
   correct:2,
   hint:{tr:"Paralelkenarda: karşılıklı açılar eşit ve karşılıklı kenarlar eşit. Açıların 90° olması zorunlu değil.",ku:"Di paralelograma de: guçên rûbirû wekhev û kêlekên rûbirû wekhev. Guç ne hewce ye 90° be.",en:"In parallelograms: opposite angles are equal and opposite sides are equal. Angles need not be 90°.",ar:"في متوازي الأضلاع: الزوايا المتقابلة متساوية والأضلاع المتقابلة متساوية، ولا يلزم أن تكون الزوايا ٩٠°.",fa:"در متوازی‌الاضلاع: زاویه‌های روبه‌رو برابر و اضلاع روبه‌رو برابرند؛ لازم نیست زاویه‌ها ۹۰ درجه باشند."}},

  {id:"l2_c",phase:"IN",level:2,diff:4,icon:"🗂",
   label:{tr:"Hiyerarşi",ku:"Hîyerarşî",en:"Hierarchy",ar:"التسلسل الهرمي",fa:"سلسله‌مراتب"},
   q:{tr:"'Her kare eşkenar dörtgendir' cümlesi doğru mudur?",ku:"'Her çaryalî lozeng e' hevoka rast e?",en:"Is 'every square is a rhombus' true?",ar:"هل عبارة «كل مربّع معيّن» صحيحة؟",fa:"آیا «هر مربع لوزی است» درست است؟"},
   opts:{tr:["Evet — her kare eşit kenarlıdır","Hayır — farklı şekillerdir","Bazen doğrudur","Yalnız 90° açı ile"],
         ku:["Erê — her çaryalî kêlekên wekhev hene","Na — teşeyên cûda ne","Carinan rast e","Tenê bi guça 90°"],
         en:["Yes — every square has equal sides","No — they are different shapes","Sometimes","Only with 90° angles"],
         ar:["نعم — كل مربّع أضلاعه متساوية","لا — هما شكلان مختلفان","أحياناً","فقط بزوايا ٩٠°"],
         fa:["بله — هر مربع اضلاع برابر دارد","نه — شکل‌های متفاوتی‌اند","گاهی","فقط با زاویۀ ۹۰ درجه"]},
   correct:0,
   hint:{tr:"Eşkenar dörtgen: tüm kenarları eşit dörtgen. Karenin 4 eşit kenarı var → kare ⊂ eşkenar dörtgen.",ku:"Lozeng: çarhêlek bi hemû kêlekên wekhev. Çaryaliyê 4 kêlekên wekhev hene → çaryalî ⊂ lozeng.",en:"Rhombus: quadrilateral with all equal sides. A square has 4 equal sides → square ⊂ rhombus.",ar:"المعيّن: رباعي كل أضلاعه متساوية. وللمربّع ٤ أضلاع متساوية → مربّع ⊂ معيّن.",fa:"لوزی: چهارضلعی با همۀ اضلاع برابر. مربع ۴ ضلع برابر دارد → مربع ⊂ لوزی."}},

  {id:"l2_d",phase:"IN",level:2,diff:4,icon:"🔗",
   label:{tr:"Kesişim",ku:"Hevberdê",en:"Intersection",ar:"التقاطع",fa:"اشتراک"},
   q:{tr:"Hem dikdörtgen hem eşkenar dörtgen olan şekil nedir?",ku:"Hem çarhêla rast hem lozeng kîjan teşe ye?",en:"What shape is both a rectangle and a rhombus?",ar:"أيّ شكل يكون مستطيلاً ومعيّناً معاً؟",fa:"کدام شکل هم مستطیل است و هم لوزی؟"},
   opts:{tr:["Paralelkenar","Yamuk","Kare","Beşgen"],
         ku:["Paralelogram","Trapezoîd","Çaryalî","Pênchêl"],
         en:["Parallelogram","Trapezoid","Square","Pentagon"],
         ar:["متوازي أضلاع","شبه منحرف","مربّع","خماسي"],
         fa:["متوازی‌الاضلاع","ذوزنقه","مربع","پنج‌ضلعی"]},
   correct:2,
   hint:{tr:"Dikdörtgen ∩ Eşkenar Dörtgen = Kare. Kare hem 4 dik açılı hem 4 eşit kenarlıdır.",ku:"Çarhêla rast ∩ Lozeng = Çaryalî. Çaryaliyê hem 4 guçên rast hem 4 kêlekên wekhev hene.",en:"Rectangle ∩ Rhombus = Square. A square has both 4 right angles and 4 equal sides.",ar:"مستطيل ∩ معيّن = مربّع. فللمربّع ٤ زوايا قائمة و٤ أضلاع متساوية.",fa:"مستطیل ∩ لوزی = مربع. مربع هم ۴ زاویۀ قائمه دارد و هم ۴ ضلع برابر."}},

  {id:"l2_e",phase:"IN",level:2,diff:4,icon:"🧩",
   label:{tr:"Özellik Kalıtımı",ku:"Mîrasa Taybetmendiyê",en:"Property Inheritance",ar:"توارث الخصائص",fa:"وراثت ویژگی"},
   q:{tr:"Yamuk neden paralelkenar değildir?",ku:"Çima trapezoîd paralelogram nîne?",en:"Why is a trapezoid NOT a parallelogram?",ar:"لماذا لا يكون شبه المنحرف متوازي أضلاع؟",fa:"چرا ذوزنقه متوازی‌الاضلاع نیست؟"},
   opts:{tr:["4 kenarı yok","Yalnız 1 çift paralel kenarı var","Hiç açısı yok","Dik açısı yok"],
         ku:["4 kêlek tune","Tenê 1 cotê kêlekên hevyalî hene","Qet guç tune","Guça rast tune"],
         en:["It has no 4 sides","It has only 1 pair of parallel sides","It has no angles","It has no right angle"],
         ar:["ليس له ٤ أضلاع","له زوج واحد فقط من الأضلاع المتوازية","ليس له زوايا","ليس له زاوية قائمة"],
         fa:["۴ ضلع ندارد","فقط یک جفت ضلع موازی دارد","زاویه ندارد","زاویۀ قائمه ندارد"]},
   correct:1,
   hint:{tr:"Paralelkenar tanımı: 2 çift paralel kenar. Yamukta yalnız 1 çift var → paralelkenar olamaz.",ku:"Defînisyona paralelograma: 2 cot kêlekên hevyalî. Di trapezoîdê de tenê 1 cot heye → nikare paralelogram be.",en:"Parallelogram definition: 2 pairs of parallel sides. Trapezoid has only 1 pair → cannot be a parallelogram.",ar:"تعريف متوازي الأضلاع: زوجان من الأضلاع المتوازية. ولشبه المنحرف زوج واحد → فلا يكون متوازي أضلاع.",fa:"تعریف متوازی‌الاضلاع: دو جفت ضلع موازی. ذوزنقه فقط یک جفت دارد → پس متوازی‌الاضلاع نیست."}},

  {id:"l2_f",phase:"FO",level:2,diff:4,icon:"📊",
   label:{tr:"Sınıflandırma",ku:"Kategorîkirin",en:"Classification",ar:"التصنيف",fa:"رده‌بندی"},
   q:{tr:"En geniş kategoriden en dara: sıralamayı tamamla. Dörtgen → ? → Paralelkenar → ?",ku:"Ji kategoriya herî fireh heta ya herî teng: rêzkirinê temam bike. Çarhêl → ? → Paralelogram → ?",en:"From broadest to narrowest: complete the sequence. Quadrilateral → ? → Parallelogram → ?",ar:"من الأعمّ إلى الأخصّ: أكمل التسلسل. رباعي → ؟ → متوازي أضلاع → ؟",fa:"از عام‌ترین به خاص‌ترین: دنباله را کامل کن. چهارضلعی → ؟ → متوازی‌الاضلاع → ؟"},
   opts:{tr:["Kare → Dikdörtgen","Dörtgen → Yamuk","Paralelkenar → Kare","Dikdörtgen → Kare"],
         ku:["Çaryalî → Çarhêla Rast","Çarhêl → Trapezoîd","Paralelogram → Çaryalî","Çarhêla Rast → Çaryalî"],
         en:["Square → Rectangle","Quadrilateral → Trapezoid","Parallelogram → Square","Rectangle → Square"],
         ar:["مربّع → مستطيل","رباعي → شبه منحرف","متوازي أضلاع → مربّع","مستطيل → مربّع"],
         fa:["مربع → مستطیل","چهارضلعی → ذوزنقه","متوازی‌الاضلاع → مربع","مستطیل → مربع"]},
   correct:3,
   hint:{tr:"Dörtgen > Paralelkenar > Dikdörtgen > Kare. Her alt küme üst kümenin özelliklerini taşır + ek özellik ekler.",ku:"Çarhêl > Paralelogram > Çarhêla Rast > Çaryalî. Her jêrkom taybetmendiyên malbatê hildigire + zêde dike.",en:"Quadrilateral > Parallelogram > Rectangle > Square. Each subset inherits parent properties + adds constraints.",ar:"رباعي > متوازي أضلاع > مستطيل > مربّع. كل مجموعة جزئية ترث خصائص الأعمّ وتضيف قيداً.",fa:"چهارضلعی > متوازی‌الاضلاع > مستطیل > مربع. هر زیرمجموعه ویژگی‌های بالادست را به ارث می‌برد و قید تازه می‌افزاید."}},

  {id:"l2_g",phase:"IN",level:2,diff:4,icon:"🌀",
   label:{tr:"Döngüsel mi?",ku:"Dorê ye?",en:"Circular Reasoning?",ar:"استدلال دائري؟",fa:"استدلال دوری؟"},
   q:{tr:"'Tüm kareler kare olduğu için eşittir' ifadesi geçerli bir matematiksel argüman mıdır?",ku:"'Hemû çaryalî ji ber ku çaryalî ne wekhev in' gotina matematîkî ya derbasdar e?",en:"Is 'all squares are equal because they are squares' a valid mathematical argument?",ar:"هل «كل المربّعات متساوية لأنّها مربّعات» حجّة رياضية صحيحة؟",fa:"آیا «همۀ مربع‌ها برابرند چون مربع‌اند» استدلال ریاضی معتبری است؟"},
   opts:{tr:["Evet, açıkça doğrudur","Hayır, döngüsel akıl yürütmedir","Bazen geçerlidir","Sadece geometride geçerlidir"],
         ku:["Erê, eşkere rast e","Na, ev hizirkirina dorê ye","Carinan derbasdar e","Tenê di hindisiyê de"],
         en:["Yes, it's obviously true","No, it is circular reasoning","Sometimes valid","Only in geometry"],
         ar:["نعم، صحيح بداهةً","لا، إنّه استدلال دائري","صحيح أحياناً","صحيح في الهندسة فقط"],
         fa:["بله، بدیهی است","نه، استدلال دوری است","گاهی معتبر است","فقط در هندسه معتبر است"]},
   correct:1,
   hint:{tr:"Matematiksel kanıt tanımları ve aksiyomları kullanır; 'öyle olduğu için öyle' döngüsel akıl yürütmedir ve geçersizdir.",ku:"Ispata matematîkî defînisyon û aksiyoman bikar tîne; 'ji ber ku wisa ye' hizirkirina dorê ye û ne derbasdar e.",en:"Mathematical proof uses definitions and axioms; 'because it is so' is circular reasoning and invalid.",ar:"البرهان الرياضي يستند إلى التعريفات والبديهيات؛ و«لأنّه كذلك» استدلال دائري غير صحيح.",fa:"برهان ریاضی بر تعریف‌ها و اصول موضوعه تکیه دارد؛ «چون این‌طور است» استدلالی دوری و نامعتبر است."}},

  {id:"l2_h",phase:"IN",level:2,diff:4,icon:"⚖️",
   label:{tr:"Gerek ve Yeter",ku:"Pêwîst û Têr",en:"Necessary & Sufficient",ar:"شرط لازم وكافٍ",fa:"شرط لازم و کافی"},
   q:{tr:"'Bir dörtgenin tüm kenarları eşitse' — o dörtgenin eşkenar dörtgen olması için bu koşul:",ku:"'Heke hemû kêlekên çarhêlê wekhev bin' — ji bo ku ew bibe lozeng, ev merc:",en:"'If a quadrilateral has all sides equal' — for it to be a rhombus, this condition is:",ar:"«إذا تساوت كل أضلاع الرباعي» — لكي يكون معيّناً، فهذا الشرط:",fa:"«اگر همۀ اضلاع چهارضلعی برابر باشند» — برای لوزی بودن، این شرط:"},
   opts:{tr:["Ne gerek ne yeter koşul","Sadece gerek koşul","Sadece yeter koşul","Hem gerek hem yeter koşul"],
         ku:["Ne mercê pêwîst, ne yê têr","Tenê mercê pêwîst","Tenê mercê têr","Hem mercê pêwîst, hem yê têr"],
         en:["Neither necessary nor sufficient","Only necessary","Only sufficient","Both necessary and sufficient"],
         ar:["ليس لازماً ولا كافياً","لازم فقط","كافٍ فقط","لازم وكافٍ معاً"],
         fa:["نه لازم است نه کافی","فقط لازم","فقط کافی","هم لازم و هم کافی"]},
   correct:3,
   hint:{tr:"Eşkenar dörtgenin tanımı: 4 kenarı eşit dörtgen. Yani bu koşul HEM gereklidir (sağlanmazsa eşkenar dörtgen olamaz) HEM yeterlidir (sağlanırsa kesinlikle eşkenar dörtgendir).",ku:"Danasîna lozengê: çarhêla bi 4 kêlekên wekhev. Ev merc HEM pêwîst e HEM jî têr e.",en:"Definition of rhombus: quadrilateral with 4 equal sides. This condition is BOTH necessary (must hold) AND sufficient (if it holds, it IS a rhombus).",ar:"تعريف المعيّن: رباعي له ٤ أضلاع متساوية. فالشرط لازم (لا معيّن بدونه) وكافٍ (إذا تحقّق فهو معيّن).",fa:"تعریف لوزی: چهارضلعی با ۴ ضلع برابر. پس این شرط هم لازم است (بدون آن لوزی نیست) و هم کافی (با آن حتماً لوزی است)."}},

  {id:"l2_i",phase:"E",level:2,diff:4,icon:"🔺",
   label:{tr:"Üçgen Sınıflama",ku:"Polîkirina Sêgoşeyan",en:"Triangle Classification",ar:"تصنيف المثلثات",fa:"رده‌بندی مثلث‌ها"},
   q:{tr:"Hangisi DOĞRUDUR?",ku:"Kîjan RAST e?",en:"Which is TRUE?",ar:"أيّ العبارات صحيحة؟",fa:"کدام درست است؟"},
   opts:{tr:["Eşkenar üçgen özel bir ikizkenar üçgendir","İkizkenar üçgen özel bir eşkenar üçgendir","Dik üçgen her zaman ikizkenardır","Eşkenar üçgen asla dik olamaz"],
         ku:["Sêgoşeya wekhev cureyek taybet a sêgoşeya dukenar e","Sêgoşeya dukenar cureyek taybet a sêgoşeya wekhev e","Sêgoşeya rast her dem dukenar e","Sêgoşeya wekhev tu car ne rast e"],
         en:["An equilateral triangle is a special isosceles triangle","An isosceles triangle is a special equilateral triangle","Right triangles are always isosceles","An equilateral triangle can never be right-angled"],
         ar:["المثلث المتساوي الأضلاع حالة خاصّة من المتساوي الساقين","المتساوي الساقين حالة خاصّة من المتساوي الأضلاع","المثلث القائم متساوي الساقين دائماً","المتساوي الأضلاع لا يكون قائماً أبداً"],
         fa:["مثلث متساوی‌الاضلاع حالتی خاص از متساوی‌الساقین است","متساوی‌الساقین حالتی خاص از متساوی‌الاضلاع است","مثلث قائم‌الزاویه همیشه متساوی‌الساقین است","متساوی‌الاضلاع هرگز قائم‌الزاویه نیست"]},
   correct:0,
   hint:{tr:"Eşkenar üçgen ⊂ İkizkenar üçgen. 'En az 2 kenar eşit' = ikizkenar; eşkenar bunun özel durumudur.",ku:"Sêgoşeya wekhev ⊂ Sêgoşeya dukenar. 'Herî kêm 2 kêlek wekhev' = dukenar. Sêgoşeya wekhev awayekî taybet e.",en:"Equilateral ⊂ Isosceles. 'At least 2 equal sides' = isosceles; equilateral is the special case.",ar:"متساوي الأضلاع ⊂ متساوي الساقين. «ضلعان متساويان على الأقل» = متساوي الساقين، والمتساوي الأضلاع حالته الخاصّة.",fa:"متساوی‌الاضلاع ⊂ متساوی‌الساقین. «دست‌کم ۲ ضلع برابر» = متساوی‌الساقین؛ متساوی‌الاضلاع حالت خاص آن است."}},

  {id:"l2_j",phase:"IN",level:2,diff:5,icon:"🧠",
   label:{tr:"Çürüt",ku:"Reşkirin",en:"Counterexample",ar:"المثال المضادّ",fa:"مثال نقض"},
   q:{tr:"'Tüm dörtgenler simetriktir' ifadesini çürütmek için hangi şekil yeterlidir?",ku:"Ji bo reşkirina 'Hemû çarhêl sîmetrîk in' kîjan teşe têrê dike?",en:"Which shape disproves 'All quadrilaterals are symmetric'?",ar:"أيّ شكل يكفي لدحض «كل الرباعيات متناظرة»؟",fa:"کدام شکل برای رد «همۀ چهارضلعی‌ها متقارن‌اند» کافی است؟"},
   opts:{tr:["Genel yamuk (ikizkenar olmayan)","Kare","Dikdörtgen","Eşkenar dörtgen"],
         ku:["Trapezîdê giştî (ne-dukenar)","Çaryalî","Çarhêla Rast","Lozeng"],
         en:["A scalene trapezoid","Square","Rectangle","Rhombus"],
         ar:["شبه منحرف مختلف الأضلاع","مربّع","مستطيل","معيّن"],
         fa:["ذوزنقۀ مختلف‌الاضلاع","مربع","مستطیل","لوزی"]},
   correct:0,
   hint:{tr:"Bir ifadeyi çürütmek için TEK bir karşı örnek yeter. İkizkenar olmayan yamuğun hiçbir simetri ekseni yok — bu, dörtgenlerin hepsinin simetrik olmadığını kanıtlar.",ku:"Ji bo reşkirina îdîayê YEK mînaka berevajî têrê dike. Trapezîdê ne-dukenar tu eksena sîmetriyê nîne.",en:"ONE counterexample is enough to disprove a claim. A scalene trapezoid has no symmetry axis — proving not all quadrilaterals are symmetric.",ar:"مثال مضادّ واحد يكفي للدحض. شبه المنحرف المختلف الأضلاع لا محور تناظر له — فيثبت أنّ ليست كل الرباعيات متناظرة.",fa:"یک مثال نقض برای رد یک ادعا کافی است. ذوزنقۀ مختلف‌الاضلاع هیچ محور تقارنی ندارد — پس همۀ چهارضلعی‌ها متقارن نیستند."}},

  // ═══════════ diff 4 — BAĞIMSIZ (yanılgı hedefli) ═══════════
  {id:"m_area",phase:"FO",level:1,diff:4,icon:"🟩",
   mis:{tr:"Alan ile çevre karıştırılır — 'çevresi eşitse alanı da eşittir' sanılır",ku:"Rûber û rûdor tên tevlihevkirin — 'heke rûdor wekhev be, rûber jî wekhev e' tê fikirîn",en:"Area and perimeter are conflated — 'equal perimeter implies equal area'",ar:"الخلط بين المساحة والمحيط — يُظَنّ أنّ تساوي المحيط يعني تساوي المساحة",fa:"مساحت و محیط با هم اشتباه می‌شوند — «محیط برابر یعنی مساحت برابر»"},
   src:"Chappell & Thompson 1999",
   label:{tr:"Alan mı Çevre mi?",ku:"Rûber an Rûdor?",en:"Area or Perimeter?",ar:"مساحة أم محيط؟",fa:"مساحت یا محیط؟"},
   q:{tr:"Bir dikdörtgen 5×1, diğeri 3×3 birim. İkisinin de çevresi 12 birim. Alanları da eşit midir?",ku:"Çarhêlek 5×1, ya din 3×3 yeke. Rûdora her duyan 12 yeke ye. Rûberên wan jî wekhev in?",en:"One rectangle is 5×1, another is 3×3 units. Both have perimeter 12. Are their areas equal too?",ar:"مستطيل ٥×١ وآخر ٣×٣ وحدات، ومحيط كليهما ١٢. فهل مساحتاهما متساويتان أيضاً؟",fa:"یک مستطیل ۵×۱ و دیگری ۳×۳ واحد است. محیط هر دو ۱۲ است. آیا مساحتشان هم برابر است؟"},
   opts:{tr:["Hayır — 5 ve 9 birim kare, farklı","Evet — çevreleri eşitse alanları da eşittir","Evet — ikisi de dikdörtgen","Ölçmeden söylenemez"],
         ku:["Na — 5 û 9 yeke çarçik, cuda ne","Erê — heke rûdor wekhev be rûber jî wekhev e","Erê — her du jî çarhêla rast in","Bêyî pîvandinê nayê gotin"],
         en:["No — 5 vs 9 square units, different","Yes — equal perimeters mean equal areas","Yes — both are rectangles","Cannot be said without measuring"],
         ar:["لا — ٥ مقابل ٩ وحدات مربّعة، مختلفتان","نعم — تساوي المحيط يعني تساوي المساحة","نعم — كلاهما مستطيل","لا يمكن القول دون قياس"],
         fa:["نه — ۵ در برابر ۹ واحد مربع، متفاوت","بله — محیط برابر یعنی مساحت برابر","بله — هر دو مستطیل‌اند","بدون اندازه‌گیری نمی‌توان گفت"]},
   correct:0,
   hint:{tr:"Çevre ETRAFI dolaşan uzunluktur, alan İÇİ kaplayan birim kare sayısıdır. Bunlar bağımsız iki ölçüdür: 5×1 → çevre 12, alan 5; 3×3 → çevre 12, alan 9. Geometri tahtasında ikisini de kur ve say.",ku:"Rûdor dirêjahiya DORÊ ye, rûber hejmara çarçikên HUNDIR e. Du pîvanên serbixwe ne: 5×1 → rûdor 12, rûber 5; 3×3 → rûdor 12, rûber 9. Li ser textaya geometriyê her duyan çêke û bijmêre.",en:"Perimeter is the length AROUND; area is the number of unit squares INSIDE. They are independent measures: 5×1 → perimeter 12, area 5; 3×3 → perimeter 12, area 9. Build both on the geoboard and count.",ar:"المحيط طول ما حول الشكل، والمساحة عدد المربّعات الوحدوية داخله. وهما قياسان مستقلّان: ٥×١ → محيط ١٢ ومساحة ٥؛ ٣×٣ → محيط ١٢ ومساحة ٩. ابْنِهما على اللوحة الهندسية وعُدّ.",fa:"محیط، طولِ دورِ شکل است و مساحت، شمارِ مربع‌های واحد در داخل آن. این دو اندازۀ مستقل‌اند: ۵×۱ → محیط ۱۲، مساحت ۵؛ ۳×۳ → محیط ۱۲، مساحت ۹. هر دو را روی تختۀ هندسی بساز و بشمار."}},

  // ═══════════ diff 5 — TRANSFER (gerçek yaşam / problem kurma) ═══════════
  {id:"t5_garden",phase:"FO",level:1,diff:5,icon:"🌱",
   mis:{tr:"Alan ile çevre karıştırılır — sabit çevrenin alanı da sabitlediği sanılır",ku:"Rûber û rûdor tên tevlihevkirin — tê fikirîn ku rûdora sabit rûberê jî sabit dike",en:"Area and perimeter conflated — a fixed perimeter is thought to fix the area",ar:"الخلط بين المساحة والمحيط — يُظَنّ أنّ ثبات المحيط يثبّت المساحة",fa:"مساحت و محیط اشتباه می‌شوند — محیط ثابت، مساحت را ثابت پنداشته می‌شود"},
   src:"Chappell & Thompson 1999",
   label:{tr:"Bahçe Çiti",ku:"Çîta Baxçe",en:"Garden Fence",ar:"سياج الحديقة",fa:"حصار باغچه"},
   q:{tr:"Elinde tam 24 metre çit var ve dikdörtgen bir bahçeyi çevireceksin. EN BÜYÜK alanı hangi ölçüler verir?",ku:"24 metre çît heye û tu ê baxçeyeke çarhêl bigire. Kîjan pîvan RÛBERÊ HERÎ MEZIN dide?",en:"You have exactly 24 m of fencing to enclose a rectangular garden. Which dimensions give the LARGEST area?",ar:"لديك ٢٤ متراً من السياج لتُحيط حديقة مستطيلة. أيّ الأبعاد يعطي أكبر مساحة؟",fa:"دقیقاً ۲۴ متر حصار داری تا باغچه‌ای مستطیلی را محصور کنی. کدام ابعاد بیشترین مساحت را می‌دهد؟"},
   opts:{tr:["6 m × 6 m (kare) → 36 m²","10 m × 2 m → 20 m²","11 m × 1 m → 11 m²","Hepsi aynı alanı verir"],
         ku:["6 m × 6 m (çaryalî) → 36 m²","10 m × 2 m → 20 m²","11 m × 1 m → 11 m²","Hemû heman rûberî didin"],
         en:["6 m × 6 m (a square) → 36 m²","10 m × 2 m → 20 m²","11 m × 1 m → 11 m²","They all give the same area"],
         ar:["٦م × ٦م (مربّع) → ٣٦ م²","١٠م × ٢م → ٢٠ م²","١١م × ١م → ١١ م²","كلّها تعطي المساحة نفسها"],
         fa:["۶ م × ۶ م (مربع) → ۳۶ م²","۱۰ م × ۲ م → ۲۰ م²","۱۱ م × ۱ م → ۱۱ م²","همه مساحت یکسانی می‌دهند"]},
   correct:0,
   hint:{tr:"Çit uzunluğu = çevre = 24 m, yani uzun + kısa kenar = 12 m. Bu koşulu sağlayan bütün dikdörtgenleri dene: 1+11, 2+10, 3+9, 4+8, 5+7, 6+6 → alanlar 11, 20, 27, 32, 35, 36. Kenarlar birbirine yaklaştıkça alan büyür; en büyüğü karedir. Çevre sabitken alan DEĞİŞİR.",ku:"Dirêjahiya çîtê = rûdor = 24 m, yanî kêleka dirêj + kurt = 12 m. Hemû îhtîmalan biceribîne: rûber dibin 11, 20, 27, 32, 35, 36 — çaryalî herî mezin e. Rûdor sabit be jî rûber DIGUHERE.",en:"Fence length = perimeter = 24 m, so long + short side = 12 m. Try every option: 1+11, 2+10, 3+9, 4+8, 5+7, 6+6 give areas 11, 20, 27, 32, 35, 36. The closer the sides, the larger the area — the square wins. With perimeter fixed, area still VARIES.",ar:"طول السياج = المحيط = ٢٤ م، أي الطول + العرض = ١٢ م. جرّب كل الاحتمالات: ١+١١، ٢+١٠، ٣+٩، ٤+٨، ٥+٧، ٦+٦ فتكون المساحات ١١، ٢٠، ٢٧، ٣٢، ٣٥، ٣٦. كلّما تقارب الضلعان كبرت المساحة، والمربّع هو الأكبر. فالمساحة تتغيّر رغم ثبات المحيط.",fa:"طول حصار = محیط = ۲۴ متر، پس ضلع بلند + کوتاه = ۱۲. همۀ حالت‌ها را بیازما: ۱+۱۱، ۲+۱۰، ۳+۹، ۴+۸، ۵+۷، ۶+۶ که مساحت‌ها ۱۱، ۲۰، ۲۷، ۳۲، ۳۵، ۳۶ می‌شود. هرچه اضلاع به هم نزدیک‌تر، مساحت بزرگ‌تر؛ مربع برنده است. با محیط ثابت، مساحت باز تغییر می‌کند."}},

  {id:"t5_tiling",phase:"FO",level:2,diff:5,icon:"🧱",
   label:{tr:"Zemin Döşeme",ku:"Danîna Erdê",en:"Floor Tiling",ar:"تبليط الأرضية",fa:"کف‌پوشی"},
   q:{tr:"Bir zemini boşluksuz ve üst üste binmeden döşeyeceksin. Hangi düzgün çokgen TEK BAŞINA bunu YAPAMAZ?",ku:"Tu ê erdekî bêyî valahî û bêyî li ser hev bidînî. Kîjan çendhêla rêkpêk bi TENÊ nikare vê bike?",en:"You must tile a floor with no gaps and no overlaps. Which regular polygon CANNOT do this on its own?",ar:"ستُبلّط أرضية دون فجوات أو تداخل. أيّ مضلّع منتظم لا يستطيع ذلك وحده؟",fa:"می‌خواهی کفی را بدون شکاف و بدون هم‌پوشانی بپوشانی. کدام چندضلعی منتظم به‌تنهایی نمی‌تواند؟"},
   opts:{tr:["Düzgün beşgen","Kare","Eşkenar üçgen","Düzgün altıgen"],
         ku:["Pênchêla rêkpêk","Çaryalî","Sêgoşeya wekhev","Şeşhêla rêkpêk"],
         en:["Regular pentagon","Square","Equilateral triangle","Regular hexagon"],
         ar:["خماسي منتظم","مربّع","مثلث متساوي الأضلاع","سداسي منتظم"],
         fa:["پنج‌ضلعی منتظم","مربع","مثلث متساوی‌الاضلاع","شش‌ضلعی منتظم"]},
   correct:0,
   hint:{tr:"Bir köşede buluşan açılar tam 360° etmelidir. Kare 90° → 4 tane; eşkenar üçgen 60° → 6 tane; düzgün altıgen 120° → 3 tane; hepsi tam kapatır. Düzgün beşgenin açısı 108° ve 360 ÷ 108 tam sayı değildir (üç tanesi 324°, boşluk kalır). Arı peteğinin neden altıgen olduğunu da bu açıklar.",ku:"Guçên li goşeyekê dicivin divê tam 360° bin. Çaryalî 90° → 4; sêgoşe 60° → 6; şeşhêl 120° → 3. Guça pênchêlê 108° e û 360 ÷ 108 ne hejmareke tam e → valahî dimîne. Ji ber vê şaneya hingiv şeşhêl e.",en:"The angles meeting at a point must total exactly 360°. Square 90° → 4 of them; equilateral triangle 60° → 6; regular hexagon 120° → 3 — all fit exactly. The regular pentagon's angle is 108°, and 360 ÷ 108 is not a whole number (three give 324°, leaving a gap). This is also why honeycomb cells are hexagons.",ar:"يجب أن يكون مجموع الزوايا الملتقية عند نقطة ٣٦٠° تماماً. المربّع ٩٠° → أربعة؛ المثلث ٦٠° → ستّة؛ السداسي ١٢٠° → ثلاثة، وكلّها تنطبق تماماً. أمّا الخماسي المنتظم فزاويته ١٠٨° و٣٦٠ ÷ ١٠٨ ليست عدداً صحيحاً (ثلاثة تعطي ٣٢٤° فتبقى فجوة). وهذا سبب كون خلايا قرص العسل سداسية.",fa:"زاویه‌هایی که در یک نقطه جمع می‌شوند باید دقیقاً ۳۶۰ درجه شوند. مربع ۹۰ → ۴ تا؛ مثلث ۶۰ → ۶ تا؛ شش‌ضلعی ۱۲۰ → ۳ تا؛ همه دقیق جا می‌شوند. زاویۀ پنج‌ضلعی منتظم ۱۰۸ است و ۳۶۰ ÷ ۱۰۸ عدد درست نیست (سه‌تا ۳۲۴ می‌شود و شکاف می‌ماند). به همین دلیل خانه‌های کندوی عسل شش‌ضلعی‌اند."}},

  {id:"t5_robot",phase:"FO",level:2,diff:5,icon:"🤖",
   src:"Clements & Battista 1989",
   label:{tr:"Robotu Programla",ku:"Robotê Bernameke",en:"Program the Robot",ar:"برمِج الروبوت",fa:"ربات را برنامه‌ریزی کن"},
   q:{tr:"Bir robot 'ilerle, sonra dön' komutlarını tekrarlayarak kare çizerken her köşede 90° dönüyor. Düzgün altıgen çizmesi için her köşede kaç derece dönmelidir?",ku:"Robotek bi 'here pêş, paşê bizivire' çaryalîyê dixêze û li her goşeyê 90° dizivire. Ji bo şeşhêla rêkpêk divê li her goşeyê çend derece bizivire?",en:"A robot draws a square by repeating 'go forward, then turn', turning 90° at each corner. To draw a regular hexagon, how many degrees must it turn at each corner?",ar:"روبوت يرسم مربّعاً بتكرار «تقدّم ثم استدر»، ويستدير ٩٠° عند كل رأس. فكم درجة يجب أن يستدير عند كل رأس ليرسم سداسياً منتظماً؟",fa:"رباتی با تکرار «جلو برو، بعد بچرخ» مربع می‌کشد و در هر گوشه ۹۰ درجه می‌چرخد. برای کشیدن شش‌ضلعی منتظم، در هر گوشه چند درجه باید بچرخد؟"},
   answer:60,min:0,max:180,
   hint:{tr:"Robot şekli tamamladığında tam bir tur atmış olur: dönüşlerin toplamı 360°'dir. Karede 4 dönüş → 360 ÷ 4 = 90°. Altıgende 6 dönüş → 360 ÷ 6 = 60°. Dikkat: bu DIŞ açıdır; altıgenin İÇ açısı 120°'dir (60 + 120 = 180).",ku:"Dema robot teşeyê temam dike, tûrekî tam dizivire: komê zivirînan 360° ye. Di çaryalî de 4 zivirîn → 90°. Di şeşhêlê de 6 zivirîn → 360 ÷ 6 = 60°. Bala xwe bide: ev guça DERVE ye; guça HUNDIR 120° ye.",en:"When the robot finishes the shape it has made one full turn: the turns sum to 360°. A square has 4 turns → 360 ÷ 4 = 90°. A hexagon has 6 turns → 360 ÷ 6 = 60°. Careful: this is the EXTERIOR angle; the hexagon's INTERIOR angle is 120° (60 + 120 = 180).",ar:"حين يُتمّ الروبوت الشكل يكون قد دار دورة كاملة: مجموع الدورات ٣٦٠°. في المربّع ٤ دورات → ٣٦٠ ÷ ٤ = ٩٠°. وفي السداسي ٦ دورات → ٣٦٠ ÷ ٦ = ٦٠°. انتبه: هذه هي الزاوية الخارجية؛ أمّا الداخلية للسداسي فهي ١٢٠° (٦٠ + ١٢٠ = ١٨٠).",fa:"وقتی ربات شکل را تمام می‌کند یک دور کامل چرخیده است: مجموع چرخش‌ها ۳۶۰ درجه است. مربع ۴ چرخش → ۳۶۰ ÷ ۴ = ۹۰. شش‌ضلعی ۶ چرخش → ۳۶۰ ÷ ۶ = ۶۰. توجه: این زاویۀ خارجی است؛ زاویۀ داخلی شش‌ضلعی ۱۲۰ است (۶۰ + ۱۲۰ = ۱۸۰)."}},
];
