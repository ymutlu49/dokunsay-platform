/**
 * DokunSay Tam — Etkinlik tanımları
 *
 * ŞEMA (platform STANDARDS.md §1.5–§1.7):
 *   id          : kebab-case benzersiz kimlik (ilerleme kaydı bu anahtarla tutulur;
 *                 görünen ad dile göre değiştiği için ad ANAHTAR OLARAK KULLANILMAZ)
 *   icon        : emoji/simge
 *   category    : CATEGORY_ORDER içindeki kategori
 *   difficulty  : 1 Keşif · 2 Rehberli · 3 Yönlendirilmiş · 4 Bağımsız · 5 Transfer (§1.6)
 *   name        : { tr, ku, en, ar, fa }  — 5 dilde görünen ad (§1.7)
 *   description : { tr, ku, en, ar, fa }  — 5 dilde yönerge
 *   mis         : (yanılgı etkinlikleri) i18n anahtarı — misconception_1..8
 *   src         : (yanılgı etkinlikleri) literatür atfı (§1.5)
 *
 * Çok dilli alanları okumak için `actName(a, lang)` / `actDesc(a, lang)` kullan.
 */

/** Çok dilli alan okuyucu — eksik dilde tr'ye düşer, düz dizeyi olduğu gibi verir. */
export const localize = (field, lang = 'tr') =>
  (typeof field === 'string' ? field : (field?.[lang] ?? field?.tr ?? ''));

export const actName = (a, lang = 'tr') => localize(a?.name, lang);
export const actDesc = (a, lang = 'tr') => localize(a?.description, lang);

export const ACTIVITIES = [
  {
    id: 'serbest-kesif', icon: '🎨', category: 'keşif', difficulty: 1,
    name: {
      tr: 'Serbest Keşif', ku: 'Vedîtina Serbest', en: 'Free Exploration',
      ar: 'استكشاف حر', fa: 'کاوش آزاد',
    },
    description: {
      tr: 'Pulları ve sayı doğrusunu kullanarak tam sayıları keşfet!',
      ku: 'Bi pul û jimarxêzê hejmarên tam vedîtin bike!',
      en: 'Explore integers using the chips and the number line!',
      ar: 'استكشف الأعداد الصحيحة باستخدام الرقاقات وخط الأعداد!',
      fa: 'با ژتون‌ها و محور اعداد، اعداد صحیح را کاوش کن!',
    },
  },
  {
    id: 'pozitif-sayilar', icon: '🟢', category: 'kavram', difficulty: 1,
    name: {
      tr: 'Pozitif Sayılar', ku: 'Hejmarên Erênî', en: 'Positive Numbers',
      ar: 'الأعداد الموجبة', fa: 'اعداد مثبت',
    },
    description: {
      tr: 'Yeşil (+) pulları kanvasa sürükle. +1, +2, +3 oluştur. Sıfırın sağında!',
      ku: 'Pulên kesk (+) bikişîne ser rûberê. +1, +2, +3 çêke. Li rastê sifirê ne!',
      en: 'Drag the green (+) chips onto the canvas. Build +1, +2, +3. They sit to the right of zero!',
      ar: 'اسحب الرقاقات الخضراء (+) إلى اللوحة. كوّن ‎+1‎، ‎+2‎، ‎+3‎. إنها على يمين الصفر!',
      fa: 'ژتون‌های سبز (+) را روی صفحه بکش. ‎+1‎، ‎+2‎، ‎+3‎ بساز. سمت راست صفر هستند!',
    },
  },
  {
    id: 'negatif-sayilar', icon: '🔴', category: 'kavram', difficulty: 1,
    name: {
      tr: 'Negatif Sayılar', ku: 'Hejmarên Neyînî', en: 'Negative Numbers',
      ar: 'الأعداد السالبة', fa: 'اعداد منفی',
    },
    description: {
      tr: 'Kırmızı (−) pulları sürükle. −1, −2, −3 oluştur. Sıfırın solunda!',
      ku: 'Pulên sor (−) bikişîne. −1, −2, −3 çêke. Li çepê sifirê ne!',
      en: 'Drag the red (−) chips. Build −1, −2, −3. They sit to the left of zero!',
      ar: 'اسحب الرقاقات الحمراء (−). كوّن ‎−1‎، ‎−2‎، ‎−3‎. إنها على يسار الصفر!',
      fa: 'ژتون‌های قرمز (−) را بکش. ‎−1‎، ‎−2‎، ‎−3‎ بساز. سمت چپ صفر هستند!',
    },
  },
  {
    id: 'sifir-cifti', icon: '🟣', category: 'kavram', difficulty: 1,
    name: {
      tr: 'Sıfır Çifti', ku: 'Cotê Sifirê', en: 'Zero Pair',
      ar: 'زوج الصفر', fa: 'جفت صفر',
    },
    description: {
      tr: '(+1)+(−1)=0. ⊕⊖ butonuyla sıfır çifti ekle, birbirini yok ettiğini gör!',
      ku: '(+1)+(−1)=0. Bi bişkoka ⊕⊖ cotê sifirê zêde bike, bibîne ku hev betal dikin!',
      en: '(+1)+(−1)=0. Add a zero pair with the ⊕⊖ button and watch them cancel out!',
      ar: '‎(+1)+(−1)=0‎. أضف زوج صفر بزر ⊕⊖ وشاهدهما يلغيان بعضهما!',
      fa: '‎(+1)+(−1)=0‎. با دکمهٔ ⊕⊖ جفت صفر بساز و ببین یکدیگر را خنثی می‌کنند!',
    },
  },
  {
    id: 'iki-pozitif-toplama', icon: '➕', category: 'işlem', difficulty: 1,
    name: {
      tr: 'İki Pozitif Toplama', ku: 'Zêdekirina Du Erêniyan', en: 'Adding Two Positives',
      ar: 'جمع عددين موجبين', fa: 'جمع دو عدد مثبت',
    },
    description: {
      tr: '(+4)+(+2)=? Toplam alanına 4 yeşil, sonra 2 yeşil pul ekle.',
      ku: '(+4)+(+2)=? 4 pulên kesk, paşê 2 pulên kesk zêde bike.',
      en: '(+4)+(+2)=? Put 4 green chips in the sum area, then add 2 more green chips.',
      ar: '‎(+4)+(+2)=?‎ ضع 4 رقاقات خضراء في منطقة الجمع ثم أضف رقاقتين خضراوين.',
      fa: '‎(+4)+(+2)=?‎ ۴ ژتون سبز بگذار، سپس ۲ ژتون سبز دیگر اضافه کن.',
    },
  },
  {
    id: 'iki-negatif-toplama', icon: '➕', category: 'işlem', difficulty: 2,
    name: {
      tr: 'İki Negatif Toplama', ku: 'Zêdekirina Du Neyîniyan', en: 'Adding Two Negatives',
      ar: 'جمع عددين سالبين', fa: 'جمع دو عدد منفی',
    },
    description: {
      tr: '(−3)+(−2)=? 3 kırmızı + 2 kırmızı ekle. Sonuç: −5',
      ku: '(−3)+(−2)=? 3 sor + 2 sor zêde bike. Encam: −5',
      en: '(−3)+(−2)=? Add 3 red then 2 red chips. Result: −5',
      ar: '‎(−3)+(−2)=?‎ أضف 3 حمراء ثم 2 حمراء. الناتج: ‎−5‎',
      fa: '‎(−3)+(−2)=?‎ ۳ قرمز و سپس ۲ قرمز اضافه کن. نتیجه: ‎−5‎',
    },
  },
  {
    id: 'pozitif-negatif-toplama', icon: '🔄', category: 'işlem', difficulty: 2,
    name: {
      tr: 'Pozitif + Negatif', ku: 'Erênî + Neyînî', en: 'Positive + Negative',
      ar: 'موجب + سالب', fa: 'مثبت + منفی',
    },
    description: {
      tr: '(+5)+(−3)=? Pulları ekle, sıfır çiftlerini eşleştir. Kalan = sonuç!',
      ku: '(+5)+(−3)=? Pulan zêde bike, cotên sifirê li hev bîne. Ya dimîne = encam!',
      en: '(+5)+(−3)=? Add the chips, match the zero pairs. What is left is the answer!',
      ar: '‎(+5)+(−3)=?‎ أضف الرقاقات وطابِق أزواج الصفر. المتبقّي هو الناتج!',
      fa: '‎(+5)+(−3)=?‎ ژتون‌ها را اضافه کن، جفت‌های صفر را جور کن. باقیمانده جواب است!',
    },
  },
  {
    id: 'iki-pozitif-cikarma', icon: '➖', category: 'işlem', difficulty: 2,
    name: {
      tr: 'İki Pozitif Çıkarma', ku: 'Kemkirina Du Erêniyan', en: 'Subtracting Two Positives',
      ar: 'طرح عددين موجبين', fa: 'تفریق دو عدد مثبت',
    },
    description: {
      tr: '(+7)−(+3)=? 7 yeşil koy, 3 tanesini sil.',
      ku: '(+7)−(+3)=? 7 kesk deyne, 3 heban jê bibe.',
      en: '(+7)−(+3)=? Place 7 green chips and remove 3 of them.',
      ar: '‎(+7)−(+3)=?‎ ضع 7 رقاقات خضراء واحذف 3 منها.',
      fa: '‎(+7)−(+3)=?‎ ۷ ژتون سبز بگذار و ۳ تای آن را حذف کن.',
    },
  },
  {
    id: 'sifir-ciftiyle-cikarma', icon: '➖', category: 'işlem', difficulty: 3,
    name: {
      tr: 'Sıfır Çiftiyle Çıkarma', ku: 'Kemkirin bi Cotê Sifirê', en: 'Subtracting with Zero Pairs',
      ar: 'الطرح بأزواج الصفر', fa: 'تفریق با جفت صفر',
    },
    description: {
      tr: '(+3)−(−2)=? Kırmızı pul yok! 2 sıfır çifti ekle, 2 kırmızıyı çıkar → +5',
      ku: '(+3)−(−2)=? Pulê sor tune! 2 cotên sifirê zêde bike, 2 soran derxe → +5',
      en: '(+3)−(−2)=? There are no red chips! Add 2 zero pairs, remove 2 reds → +5',
      ar: '‎(+3)−(−2)=?‎ لا توجد رقاقات حمراء! أضف زوجَي صفر واحذف الحمراوين ← ‎+5‎',
      fa: '‎(+3)−(−2)=?‎ ژتون قرمز نداری! ۲ جفت صفر اضافه کن و ۲ قرمز را بردار ← ‎+5‎',
    },
  },
  {
    id: 'carpma-tekrarli-toplam', icon: '✖️', category: 'işlem', difficulty: 3,
    name: {
      tr: 'Çarpma: Tekrarlı Toplam', ku: 'Carkirin: Zêdekirina Dubare', en: 'Multiplication: Repeated Addition',
      ar: 'الضرب: جمع متكرر', fa: 'ضرب: جمع مکرر',
    },
    description: {
      tr: '(+3)×(−2)=? 3 grup, her grupta 2 kırmızı. Toplam −6',
      ku: '(+3)×(−2)=? 3 kom, di her komê de 2 sor. Bi giştî −6',
      en: '(+3)×(−2)=? Make 3 groups with 2 red chips each. Total −6',
      ar: '‎(+3)×(−2)=?‎ كوّن 3 مجموعات في كل منها رقاقتان حمراوان. المجموع ‎−6‎',
      fa: '‎(+3)×(−2)=?‎ ۳ گروه بساز، در هر گروه ۲ قرمز. مجموع ‎−6‎',
    },
  },
  {
    id: 'bolme-esit-paylasim', icon: '➗', category: 'işlem', difficulty: 3,
    name: {
      tr: 'Bölme: Eşit Paylaşım', ku: 'Parkirin: Parvekirina Wekhev', en: 'Division: Equal Sharing',
      ar: 'القسمة: التوزيع المتساوي', fa: 'تقسیم: تسهیم برابر',
    },
    description: {
      tr: '(−6)÷(+2)=? 6 kırmızıyı 2 gruba böl. Her grupta −3',
      ku: '(−6)÷(+2)=? 6 soran li 2 koman par bike. Di her komê de −3',
      en: '(−6)÷(+2)=? Share 6 red chips into 2 groups. Each group has −3',
      ar: '‎(−6)÷(+2)=?‎ وزّع 6 رقاقات حمراء على مجموعتين. كل مجموعة ‎−3‎',
      fa: '‎(−6)÷(+2)=?‎ ۶ ژتون قرمز را بین ۲ گروه پخش کن. هر گروه ‎−3‎',
    },
  },
  {
    id: 'karsilastirma', icon: '⚖️', category: 'karşılaştır', difficulty: 2,
    name: {
      tr: 'Karşılaştırma', ku: 'Berhevdan', en: 'Comparing',
      ar: 'المقارنة', fa: 'مقایسه',
    },
    description: {
      tr: '(−3) ile (+2)\'yi karşılaştır. Sayı doğrusunda sağdaki büyüktür!',
      ku: '(−3) û (+2) berhev bike. Li ser jimarxêzê ya rastê mezintir e!',
      en: 'Compare (−3) with (+2). On the number line, the one on the right is greater!',
      ar: 'قارن بين ‎(−3)‎ و‎(+2)‎. على خط الأعداد، الأيمن هو الأكبر!',
      fa: '‎(−3)‎ را با ‎(+2)‎ مقایسه کن. روی محور اعداد، سمت راستی بزرگ‌تر است!',
    },
  },

  // ——— Kavram yanılgıları (§1.5: literatür atıflı) ———
  {
    id: 'y1-eksi-carpi-eksi', icon: '🔍', category: 'yanılgı', difficulty: 3,
    mis: 'misconception_1',
    src: 'Hefendehl-Hebeker, L. (1991). Negative numbers: Obstacles in their evolution from intuitive to intellectual constructs. For the Learning of Mathematics, 11(1), 26-32.',
    name: {
      tr: 'Y1: Eksi × Eksi', ku: 'Ş1: Neyînî × Neyînî', en: 'M1: Minus × Minus',
      ar: 'خ1: سالب × سالب', fa: 'ک۱: منفی × منفی',
    },
    description: {
      tr: '(−2)×(−3)=+6. İki negatifin çarpımı pozitiftir! Grupları "eksiltmek" olarak modelle.',
      ku: '(−2)×(−3)=+6. Lêdana du neyîniyan erênî ye! Koman wek "kêmkirin" model bike.',
      en: '(−2)×(−3)=+6. The product of two negatives is positive! Model it as "removing" groups.',
      ar: '‎(−2)×(−3)=+6‎. حاصل ضرب سالبين موجب! نمذجه على أنه «إزالة» مجموعات.',
      fa: '‎(−2)×(−3)=+6‎. حاصل‌ضرب دو منفی مثبت است! آن را به‌صورت «برداشتن» گروه‌ها مدل کن.',
    },
  },
  {
    id: 'y2-buyuk-sayi', icon: '🔍', category: 'yanılgı', difficulty: 2,
    mis: 'misconception_2',
    src: 'Bofferding, L. (2014). Negative integer understanding: Characterizing first graders’ mental models. Journal for Research in Mathematics Education, 45(2), 194-245.',
    name: {
      tr: 'Y2: Büyük sayı mı?', ku: 'Ş2: Ma hejmara mezin e?', en: 'M2: Which is bigger?',
      ar: 'خ2: أيّهما أكبر؟', fa: 'ک۲: کدام بزرگ‌تر است؟',
    },
    description: {
      tr: '−5 mi +2 mi büyük? Negatifler her zaman pozitiflerden küçüktür!',
      ku: '−5 mezintir e yan +2? Neyînî her tim ji erêniyan biçûktir in!',
      en: 'Which is greater, −5 or +2? Negatives are always less than positives!',
      ar: 'أيّهما أكبر، ‎−5‎ أم ‎+2‎؟ السوالب دائماً أصغر من الموجبات!',
      fa: 'کدام بزرگ‌تر است، ‎−5‎ یا ‎+2‎؟ منفی‌ها همیشه از مثبت‌ها کوچک‌ترند!',
    },
  },
  {
    id: 'y3-cikarmada-isaret', icon: '🔍', category: 'yanılgı', difficulty: 3,
    mis: 'misconception_3',
    src: 'Vlassis, J. (2004). Making sense of the minus sign or becoming flexible in "negativity". Learning and Instruction, 14(5), 469-484.',
    name: {
      tr: 'Y3: Çıkarmada işaret', ku: 'Ş3: Nîşan di kemkirinê de', en: 'M3: The sign in subtraction',
      ar: 'خ3: الإشارة في الطرح', fa: 'ک۳: علامت در تفریق',
    },
    description: {
      tr: '(+3)−(−4)=+7. Negatif çıkarmak = pozitif eklemek! Sıfır çiftiyle kanıtla.',
      ku: '(+3)−(−4)=+7. Kemkirina neyînî = zêdekirina erênî! Bi cotê sifirê îspat bike.',
      en: '(+3)−(−4)=+7. Subtracting a negative equals adding a positive! Prove it with zero pairs.',
      ar: '‎(+3)−(−4)=+7‎. طرح عدد سالب يساوي جمع موجب! أثبت ذلك بأزواج الصفر.',
      fa: '‎(+3)−(−4)=+7‎. کم کردن یک منفی برابر است با افزودن یک مثبت! با جفت صفر ثابت کن.',
    },
  },
  {
    id: 'y4-isaret-mi-islem-mi', icon: '🔬', category: 'yanılgı', difficulty: 2,
    mis: 'misconception_4',
    src: 'Vlassis, J. (2008). The role of mathematical symbols in the development of number conceptualization: The case of the minus sign. Philosophical Psychology, 21(4), 555-570.',
    name: {
      tr: 'Y4: İşaret mi işlem mi?', ku: 'Ş4: Nîşan e yan kirarî ye?', en: 'M4: Sign or operation?',
      ar: 'خ4: إشارة أم عملية؟', fa: 'ک۴: علامت است یا عملیات؟',
    },
    description: {
      tr: '(−3)+5\'te \'−\' sayının işareti (isim), \'+\' işlem (fiil). Farklı şeyler! Pullarla göster.',
      ku: 'Di (−3)+5 de \'−\' nîşana hejmarê ye (nav), \'+\' kirarî ye (lêker). Cuda ne! Bi pulan nîşan bide.',
      en: 'In (−3)+5, \'−\' is the sign of the number (a noun) and \'+\' is the operation (a verb). Different things! Show it with chips.',
      ar: 'في ‎(−3)+5‎، الرمز ‎−‎ هو إشارة العدد (اسم) و‎+‎ هو العملية (فعل). شيئان مختلفان! أظهر ذلك بالرقاقات.',
      fa: 'در ‎(−3)+5‎، نشانهٔ ‎−‎ علامت عدد (اسم) و ‎+‎ عملیات (فعل) است. دو چیز متفاوت! با ژتون‌ها نشان بده.',
    },
  },
  {
    id: 'y5-mutlak-deger', icon: '🔬', category: 'yanılgı', difficulty: 2,
    mis: 'misconception_5',
    src: 'Peled, I., Mukhopadhyay, S., & Resnick, L. B. (1989). Formal and informal sources of mental models for negative numbers. Proceedings of PME 13, Vol. 3, 106-110.',
    name: {
      tr: 'Y5: Mutlak değer yanılgısı', ku: 'Ş5: Şaşiya nirxa mutlaq', en: 'M5: Absolute value trap',
      ar: 'خ5: مغالطة القيمة المطلقة', fa: 'ک۵: کج‌فهمی قدر مطلق',
    },
    description: {
      tr: '|−7|>|3| ama −7<3! Sayı doğrusunda −7 solda, 3 sağda. Uzaklık ≠ büyüklük.',
      ku: '|−7|>|3| lê −7<3! Li ser jimarxêzê −7 li çepê ye, 3 li rastê. Dûrahî ≠ mezinahî.',
      en: '|−7|>|3| but −7<3! On the number line −7 is on the left and 3 on the right. Distance ≠ size.',
      ar: '‎|−7|>|3|‎ لكن ‎−7<3‎! على خط الأعداد ‎−7‎ يساراً و‎3‎ يميناً. المسافة ≠ الحجم.',
      fa: '‎|−7|>|3|‎ اما ‎−7<3‎! روی محور، ‎−7‎ سمت چپ و ‎3‎ سمت راست است. فاصله ≠ بزرگی.',
    },
  },
  {
    id: 'y6-cikarma-kucultur-mu', icon: '🔬', category: 'yanılgı', difficulty: 3,
    mis: 'misconception_6',
    src: 'Bell, A., Fischbein, E., & Greer, B. (1984). Choice of operation in verbal arithmetic problems: The effects of number size and context. Educational Studies in Mathematics, 15(2), 129-147.',
    name: {
      tr: 'Y6: Çıkarma küçültür mü?', ku: 'Ş6: Ma kemkirin biçûk dike?', en: 'M6: Does subtraction always shrink?',
      ar: 'خ6: هل الطرح يُصغّر دائماً؟', fa: 'ک۶: آیا تفریق همیشه کم می‌کند؟',
    },
    description: {
      tr: '3−(−4)=7. Çıkarma her zaman küçültmez! Negatif çıkarmak büyütür.',
      ku: '3−(−4)=7. Kemkirin her tim biçûk nake! Kemkirina neyînî mezin dike.',
      en: '3−(−4)=7. Subtraction does not always make things smaller! Subtracting a negative makes it bigger.',
      ar: '‎3−(−4)=7‎. الطرح لا يُصغّر دائماً! طرح عدد سالب يزيد الناتج.',
      fa: '‎3−(−4)=7‎. تفریق همیشه کوچک نمی‌کند! کم کردن یک منفی، نتیجه را بزرگ‌تر می‌کند.',
    },
  },
  {
    id: 'y7-sifir-notr-mu', icon: '🔬', category: 'yanılgı', difficulty: 1,
    mis: 'misconception_7',
    src: 'Wheeler, M. M. (1983). Much ado about nothing: Preservice elementary school teachers’ concept of zero. Journal for Research in Mathematics Education, 14(3), 147-155.',
    name: {
      tr: 'Y7: Sıfır nötr mü?', ku: 'Ş7: Ma sifir bêalî ye?', en: 'M7: Is zero neutral?',
      ar: 'خ7: هل الصفر محايد؟', fa: 'ک۷: آیا صفر خنثی است؟',
    },
    description: {
      tr: 'Sıfır ne pozitif ne negatif! Sayı doğrusunda tam ortada. Sıfır çiftinin sonucudur: (+1)+(−1)=0',
      ku: 'Sifir ne erênî ye ne neyînî! Li ser jimarxêzê tam di navê de ye. Encama cotê sifirê ye: (+1)+(−1)=0',
      en: 'Zero is neither positive nor negative! It sits exactly in the middle of the number line. It is the result of a zero pair: (+1)+(−1)=0',
      ar: 'الصفر ليس موجباً ولا سالباً! يقع تماماً في وسط خط الأعداد. وهو ناتج زوج الصفر: ‎(+1)+(−1)=0‎',
      fa: 'صفر نه مثبت است نه منفی! دقیقاً وسط محور اعداد قرار دارد. نتیجهٔ جفت صفر است: ‎(+1)+(−1)=0‎',
    },
  },
  {
    id: 'y8-borc-silmek', icon: '🔬', category: 'yanılgı', difficulty: 3,
    mis: 'misconception_8',
    src: 'Ball, D. L. (1993). With an eye on the mathematical horizon: Dilemmas of teaching elementary school mathematics. The Elementary School Journal, 93(4), 373-397.',
    name: {
      tr: 'Y8: Borç silmek = kazanç', ku: 'Ş8: Jêbirina deyn = kazanc', en: 'M8: Cancelling debt = gain',
      ar: 'خ8: إلغاء الدَّين = ربح', fa: 'ک۸: حذف بدهی = سود',
    },
    description: {
      tr: '(−)×(−)=(+) neden? 3 borç silindi → 3 kazanç! Borç/alacak modeliyle dene.',
      ku: 'Çima (−)×(−)=(+)? 3 deyn hatin jêbirin → 3 kazanc! Bi modela deyn/kazancê biceribîne.',
      en: 'Why is (−)×(−)=(+)? Three debts cancelled → three gains! Try it with the debt/credit model.',
      ar: 'لماذا ‎(−)×(−)=(+)‎؟ إلغاء ثلاثة ديون ← ثلاثة أرباح! جرّب ذلك بنموذج الدَّين/القَبض.',
      fa: 'چرا ‎(−)×(−)=(+)‎؟ سه بدهی حذف شد ← سه سود! با مدل بدهی/طلب امتحان کن.',
    },
  },

  // ——— Gerçek hayat senaryoları ———
  {
    id: 'asansor', icon: '🏢', category: 'senaryo', difficulty: 1,
    name: {
      tr: 'Asansör Problemi', ku: 'Pirsgirêka Asansorê', en: 'The Elevator Problem',
      ar: 'مسألة المصعد', fa: 'مسئلهٔ آسانسور',
    },
    description: {
      tr: '0. kattan başla. 3 kat yukarı çık (+3), sonra 5 kat aşağı in (−5). Kaçıncı kattasın? Dikey sayı doğrusunu kullan!',
      ku: 'Ji qata 0 dest pê bike. 3 qatan hilkişe (+3), paşê 5 qatan dakeve (−5). Tu li kîjan qatê yî? Jimarxêza stûnî bi kar bîne!',
      en: 'Start at floor 0. Go up 3 floors (+3), then down 5 floors (−5). Which floor are you on? Use the vertical number line!',
      ar: 'ابدأ من الطابق 0. اصعد 3 طوابق ‎(+3)‎ ثم انزل 5 طوابق ‎(−5)‎. في أي طابق أنت؟ استخدم خط الأعداد الرأسي!',
      fa: 'از طبقهٔ ۰ شروع کن. ۳ طبقه بالا برو ‎(+3)‎، سپس ۵ طبقه پایین ‎(−5)‎. در کدام طبقه‌ای؟ از محور عمودی استفاده کن!',
    },
  },
  {
    id: 'termometre', icon: '🌡️', category: 'senaryo', difficulty: 1,
    name: {
      tr: 'Termometre', ku: 'Pîvana Germahiyê', en: 'Thermometer',
      ar: 'ميزان الحرارة', fa: 'دماسنج',
    },
    description: {
      tr: 'Sabah sıcaklık +5°C. Gece 8°C düştü. Kaç derece? (+5)+(−8)=−3°C. Termometrede göster!',
      ku: 'Sibehê germahî +5°C bû. Bi şev 8°C daket. Çend derece ye? (+5)+(−8)=−3°C. Li ser pîvanê nîşan bide!',
      en: 'The morning temperature is +5°C. At night it drops by 8°C. What is it now? (+5)+(−8)=−3°C. Show it on the thermometer!',
      ar: 'درجة الحرارة صباحاً ‎+5‎°م. وليلاً انخفضت 8°م. كم أصبحت؟ ‎(+5)+(−8)=−3‎°م. أظهرها على الميزان!',
      fa: 'دمای صبح ‎+5‎°C است. شب ۸ درجه افت می‌کند. حالا چند است؟ ‎(+5)+(−8)=−3‎°C. روی دماسنج نشان بده!',
    },
  },
  {
    id: 'borc-alacak', icon: '💰', category: 'senaryo', difficulty: 2,
    name: {
      tr: 'Borç / Alacak', ku: 'Deyn / Kazanc', en: 'Debt / Credit',
      ar: 'دَين / قَبض', fa: 'بدهی / طلب',
    },
    description: {
      tr: 'Cüzdanında 10₺ var (+10). 15₺ borç aldın (−15). Toplam durumun: (+10)+(−15)=−5. Hâlâ borçlusun!',
      ku: 'Di berîka te de 10₺ heye (+10). Te 15₺ deyn kir (−15). Rewşa te ya giştî: (+10)+(−15)=−5. Tu hîn deyndar î!',
      en: 'You have 10₺ in your wallet (+10). You borrowed 15₺ (−15). Your total: (+10)+(−15)=−5. You are still in debt!',
      ar: 'لديك 10₺ في محفظتك ‎(+10)‎. اقترضت 15₺ ‎(−15)‎. المجموع: ‎(+10)+(−15)=−5‎. ما زلت مديناً!',
      fa: 'در کیفت ۱۰₺ داری ‎(+10)‎. ۱۵₺ قرض گرفتی ‎(−15)‎. جمع: ‎(+10)+(−15)=−5‎. هنوز بدهکاری!',
    },
  },
  {
    id: 'deniz-seviyesi', icon: '🐟', category: 'senaryo', difficulty: 1,
    name: {
      tr: 'Deniz Seviyesi', ku: 'Asta Deryayê', en: 'Sea Level',
      ar: 'مستوى البحر', fa: 'سطح دریا',
    },
    description: {
      tr: 'Deniz seviyesi = 0. Balık −5\'te, kuş +4\'te. Aralarındaki fark kaç birim? Dikey sayı doğrusunda bul!',
      ku: 'Asta deryayê = 0. Masî li −5 e, çûk li +4 e. Ferqa wan çend yekîne ye? Li ser jimarxêza stûnî bibîne!',
      en: 'Sea level = 0. The fish is at −5 and the bird at +4. How many units apart are they? Find it on the vertical number line!',
      ar: 'مستوى البحر = 0. السمكة عند ‎−5‎ والطائر عند ‎+4‎. كم وحدة بينهما؟ جِدها على خط الأعداد الرأسي!',
      fa: 'سطح دریا = ۰. ماهی در ‎−5‎ و پرنده در ‎+4‎ است. فاصلهٔ آن‌ها چند واحد است؟ روی محور عمودی پیدا کن!',
    },
  },

  // ——— diff 4 · Bağımsız (ipucu yok, öğrenci kendisi çözer) ———
  {
    id: 'bagimsiz-islem-seti', icon: '🏆', category: 'bağımsız', difficulty: 4,
    name: {
      tr: 'Kendin Çöz: Karışık Set', ku: 'Bi Serê Xwe Çareser Bike: Seta Tevlihev', en: 'Solve It Yourself: Mixed Set',
      ar: 'حُلّها بنفسك: مجموعة مختلطة', fa: 'خودت حل کن: مجموعهٔ ترکیبی',
    },
    description: {
      tr: 'İpucu yok. Şu altı işlemi sırayla çöz: (−8)+(+3) · (+6)−(+9) · (−4)−(−7) · (−5)×(+2) · (+12)÷(−4) · (−3)−(+3). Her birinde önce cevabını yaz, sonra pullarla doğrula.',
      ku: 'Nîşan tune. Van şeş kiraran li dû hev çareser bike: (−8)+(+3) · (+6)−(+9) · (−4)−(−7) · (−5)×(+2) · (+12)÷(−4) · (−3)−(+3). Pêşî bersiva xwe binivîse, paşê bi pulan piştrast bike.',
      en: 'No hints. Solve these six in order: (−8)+(+3) · (+6)−(+9) · (−4)−(−7) · (−5)×(+2) · (+12)÷(−4) · (−3)−(+3). Write your answer first, then check it with the chips.',
      ar: 'بلا تلميحات. حُلّ هذه الستة بالترتيب: ‎(−8)+(+3)‎ · ‎(+6)−(+9)‎ · ‎(−4)−(−7)‎ · ‎(−5)×(+2)‎ · ‎(+12)÷(−4)‎ · ‎(−3)−(+3)‎. اكتب إجابتك أولاً ثم تحقّق بالرقاقات.',
      fa: 'بدون راهنما. این شش مورد را به‌ترتیب حل کن: ‎(−8)+(+3)‎ · ‎(+6)−(+9)‎ · ‎(−4)−(−7)‎ · ‎(−5)×(+2)‎ · ‎(+12)÷(−4)‎ · ‎(−3)−(+3)‎. اول جوابت را بنویس، بعد با ژتون‌ها بررسی کن.',
    },
  },
  {
    id: 'bagimsiz-eksik-sayi', icon: '🏆', category: 'bağımsız', difficulty: 4,
    name: {
      tr: 'Eksik Sayıyı Bul', ku: 'Hejmara Kêm Bibîne', en: 'Find the Missing Number',
      ar: 'أوجد العدد الناقص', fa: 'عدد گمشده را پیدا کن',
    },
    description: {
      tr: 'Kutuyu doldur, kendin karar ver: (−7)+□=−2 · □−(−5)=+1 · (+4)+□=−4 · □×(−3)=+15. Her cevabı pullarla ya da sayı doğrusunda kanıtla — ipucu verilmeyecek.',
      ku: 'Qutîkê tije bike, biryarê bi xwe bide: (−7)+□=−2 · □−(−5)=+1 · (+4)+□=−4 · □×(−3)=+15. Her bersivê bi pulan an li ser jimarxêzê îspat bike — nîşan nayê dayîn.',
      en: 'Fill the box and decide on your own: (−7)+□=−2 · □−(−5)=+1 · (+4)+□=−4 · □×(−3)=+15. Prove each answer with chips or on the number line — no hints will be given.',
      ar: 'املأ المربع وقرّر بنفسك: ‎(−7)+□=−2‎ · ‎□−(−5)=+1‎ · ‎(+4)+□=−4‎ · ‎□×(−3)=+15‎. أثبت كل إجابة بالرقاقات أو على خط الأعداد — لن تُعطى تلميحات.',
      fa: 'جعبه را پر کن و خودت تصمیم بگیر: ‎(−7)+□=−2‎ · ‎□−(−5)=+1‎ · ‎(+4)+□=−4‎ · ‎□×(−3)=+15‎. هر جواب را با ژتون یا روی محور ثابت کن — راهنمایی داده نمی‌شود.',
    },
  },

  // ——— diff 5 · Transfer (gerçek bağlam + problem kurma + kararını savunma) ———
  {
    id: 'transfer-harclik-defteri', icon: '🎯', category: 'transfer', difficulty: 5,
    name: {
      tr: 'Harçlık Defteri', ku: 'Defterê Xercê', en: 'Pocket-Money Ledger',
      ar: 'دفتر المصروف', fa: 'دفتر پول‌توجیبی',
    },
    description: {
      tr: 'Bir haftanın kaydı: Pzt +50₺ harçlık, Sal −35₺ kitap, Çar −40₺ hediye, Per +20₺ iade, Cum −15₺ atıştırmalık. Hangi günlerde borçtaydın? Hafta sonunda kaç paran var? Sıralamayı değiştirsen sonuç değişir mi — kararını savun.',
      ku: 'Qeyda hefteyekê: Dus +50₺ xerc, Sês −35₺ pirtûk, Çar −40₺ diyarî, Pên +20₺ vegerandin, Înî −15₺ xwarin. Tu di kîjan rojan de deyndar bûyî? Dawiya hefteyê çend pere te heye? Ger rêzê biguherînî encam diguhere? Biryara xwe biparêze.',
      en: 'One week of records: Mon +50₺ allowance, Tue −35₺ book, Wed −40₺ gift, Thu +20₺ refund, Fri −15₺ snack. On which days were you in debt? How much do you have at the end of the week? Would changing the order change the result — defend your decision.',
      ar: 'سجلّ أسبوع: الاثنين ‎+50₺‎ مصروف، الثلاثاء ‎−35₺‎ كتاب، الأربعاء ‎−40₺‎ هدية، الخميس ‎+20₺‎ استرداد، الجمعة ‎−15₺‎ وجبة خفيفة. في أي الأيام كنت مديناً؟ كم معك في نهاية الأسبوع؟ هل يتغيّر الناتج لو غيّرت الترتيب — دافع عن قرارك.',
      fa: 'سابقهٔ یک هفته: دوشنبه ‎+50₺‎ پول‌توجیبی، سه‌شنبه ‎−35₺‎ کتاب، چهارشنبه ‎−40₺‎ هدیه، پنجشنبه ‎+20₺‎ بازگشت وجه، جمعه ‎−15₺‎ تنقلات. کدام روزها بدهکار بودی؟ آخر هفته چقدر داری؟ اگر ترتیب را عوض کنی نتیجه فرق می‌کند — از تصمیمت دفاع کن.',
    },
  },
  {
    id: 'transfer-problem-kurma', icon: '🎯', category: 'transfer', difficulty: 5,
    name: {
      tr: 'Problem Kur: Kendi Sorun', ku: 'Pirsgirêkê Ava Bike: Pirsa Xwe', en: 'Pose a Problem: Your Own',
      ar: 'صُغ مسألة: سؤالك أنت', fa: 'مسئله بساز: سؤال خودت',
    },
    description: {
      tr: '(−4)+(+9)=+5 işlemine uyan bir hikâye problemi SEN yaz. Bağlamını seç: asansör, sıcaklık, borç ya da deniz. Sonra arkadaşınla değiştirin ve birbirinizin problemini çözün. Son adım: neden bu bağlamın işleme gerçekten uyduğunu anlat.',
      ku: 'Çîrokek ku li kirara (−4)+(+9)=+5 tê TU binivîse. Çarçoveya xwe hilbijêre: asansor, germahî, deyn an derya. Paşê bi hevalê xwe re biguherîne û pirsgirêka hev çareser bikin. Gava dawî: rave bike çima ev çarçove bi rastî li kirarê tê.',
      en: 'YOU write a story problem that matches (−4)+(+9)=+5. Choose your context: elevator, temperature, debt or the sea. Then swap with a friend and solve each other’s problem. Final step: explain why your context really fits the operation.',
      ar: 'اكتب أنت مسألة قصصية تطابق ‎(−4)+(+9)=+5‎. اختر سياقك: مصعد، حرارة، دَين أو البحر. ثم بادل زميلك وحُلّا مسألة بعضكما. الخطوة الأخيرة: اشرح لماذا يناسب سياقك العملية فعلاً.',
      fa: 'خودت یک مسئلهٔ داستانی متناسب با ‎(−4)+(+9)=+5‎ بنویس. زمینه را انتخاب کن: آسانسور، دما، بدهی یا دریا. سپس با دوستت عوض کنید و مسئلهٔ هم را حل کنید. گام آخر: توضیح بده چرا زمینه‌ات واقعاً با این عملیات جور است.',
    },
  },
  {
    id: 'transfer-hava-durumu', icon: '🎯', category: 'transfer', difficulty: 5,
    name: {
      tr: 'Hava Durumu Kararı', ku: 'Biryara Rewşa Hewayê', en: 'A Weather Decision',
      ar: 'قرار حالة الطقس', fa: 'تصمیم هواشناسی',
    },
    description: {
      tr: 'Gece/gündüz sıcaklıkları: Van −12/−3, Erzurum −18/−5, İzmir +6/+14, Diyarbakır −4/+7. Günlük fark en büyük olan şehir hangisi? En soğuk şehir hangisi — "en düşük sayı" mı "en büyük fark" mı sorulduğuna dikkat et. Cevabını termometrede göster ve neden o şehri seçtiğini savun.',
      ku: 'Germahiyên şev/roj: Wan −12/−3, Erzirom −18/−5, Îzmîr +6/+14, Amed −4/+7. Ferqa rojane li kîjan bajarî herî mezin e? Bajarê herî sar kîjan e — bala xwe bide: "hejmara herî nizm" tê pirsîn yan "ferqa herî mezin"? Bersiva xwe li ser pîvanê nîşan bide û biparêze.',
      en: 'Night/day temperatures: Van −12/−3, Erzurum −18/−5, İzmir +6/+14, Diyarbakır −4/+7. Which city has the largest daily range? Which is the coldest — notice whether the question asks for the "lowest number" or the "largest difference". Show your answer on the thermometer and defend your choice.',
      ar: 'درجات الحرارة ليلاً/نهاراً: وان ‎−12/−3‎، أرضروم ‎−18/−5‎، إزمير ‎+6/+14‎، ديار بكر ‎−4/+7‎. أي مدينة لديها أكبر مدى يومي؟ وأيّها الأبرد — انتبه: هل السؤال عن «أصغر عدد» أم «أكبر فرق»؟ أظهر إجابتك على الميزان ودافع عن اختيارك.',
      fa: 'دمای شب/روز: وان ‎−12/−3‎، ارزروم ‎−18/−5‎، ازمیر ‎+6/+14‎، دیاربکر ‎−4/+7‎. کدام شهر بیشترین دامنهٔ روزانه را دارد؟ کدام سردترین است — دقت کن سؤال «کمترین عدد» را می‌خواهد یا «بیشترین اختلاف» را؟ جواب را روی دماسنج نشان بده و از انتخابت دفاع کن.',
    },
  },
];

/** Ders planları (activityIndices → ACTIVITIES dizisindeki sıra) */
export const LESSONS = [
  {
    id: 'ders-1',
    name: {
      tr: '1. Tam Sayı Kavramı', ku: '1. Têgeha Hejmara Tam', en: '1. The Integer Concept',
      ar: '1. مفهوم العدد الصحيح', fa: '۱. مفهوم عدد صحیح',
    },
    description: {
      tr: 'Pozitif, negatif, sıfır', ku: 'Erênî, neyînî, sifir', en: 'Positive, negative, zero',
      ar: 'موجب، سالب، صفر', fa: 'مثبت، منفی، صفر',
    },
    activityIndices: [1, 2, 3],
  },
  {
    id: 'ders-2',
    name: {
      tr: '2. Toplama', ku: '2. Zêdekirin', en: '2. Addition',
      ar: '2. الجمع', fa: '۲. جمع',
    },
    description: {
      tr: 'Aynı ve farklı işaretli', ku: 'Bi nîşanên eynî û cuda', en: 'Same and different signs',
      ar: 'إشارات متماثلة ومختلفة', fa: 'علامت‌های یکسان و متفاوت',
    },
    activityIndices: [4, 5, 6],
  },
  {
    id: 'ders-3',
    name: {
      tr: '3. Çıkarma', ku: '3. Kemkirin', en: '3. Subtraction',
      ar: '3. الطرح', fa: '۳. تفریق',
    },
    description: {
      tr: 'Sıfır çifti yöntemi', ku: 'Rêbaza cotê sifirê', en: 'The zero-pair method',
      ar: 'طريقة زوج الصفر', fa: 'روش جفت صفر',
    },
    activityIndices: [7, 8],
  },
  {
    id: 'ders-4',
    name: {
      tr: '4. Çarpma & Bölme', ku: '4. Carkirin û Parkirin', en: '4. Multiplication & Division',
      ar: '4. الضرب والقسمة', fa: '۴. ضرب و تقسیم',
    },
    description: {
      tr: 'Tekrarlı toplam, eşit paylaşım', ku: 'Zêdekirina dubare, parvekirina wekhev',
      en: 'Repeated addition, equal sharing', ar: 'جمع متكرر، توزيع متساوٍ',
      fa: 'جمع مکرر، تسهیم برابر',
    },
    activityIndices: [9, 10],
  },
  {
    id: 'ders-5',
    name: {
      tr: '5. Gerçek Hayat', ku: '5. Jiyana Rastîn', en: '5. Real Life',
      ar: '5. الحياة الواقعية', fa: '۵. زندگی واقعی',
    },
    description: {
      tr: 'Asansör, termometre, borç, deniz', ku: 'Asansor, pîvan, deyn, derya',
      en: 'Elevator, thermometer, debt, sea', ar: 'مصعد، ميزان حرارة، دَين، بحر',
      fa: 'آسانسور، دماسنج، بدهی، دریا',
    },
    activityIndices: [20, 21, 22, 23],
  },
  {
    id: 'ders-6',
    name: {
      tr: '6. Kavram Yanılgıları', ku: '6. Têgehên Şaş', en: '6. Misconceptions',
      ar: '6. المفاهيم الخاطئة', fa: '۶. کج‌فهمی‌ها',
    },
    description: {
      tr: 'Yaygın hatalar (literatür atıflı)', ku: 'Şaşiyên belav (bi çavkanî)',
      en: 'Common errors (with citations)', ar: 'أخطاء شائعة (مع مراجع)',
      fa: 'خطاهای رایج (با منابع)',
    },
    activityIndices: [12, 13, 14, 15, 16, 17, 18, 19],
  },
  {
    id: 'ders-7',
    name: {
      tr: '7. Bağımsız Çalışma', ku: '7. Xebata Serbixwe', en: '7. Independent Work',
      ar: '7. عمل مستقل', fa: '۷. کار مستقل',
    },
    description: {
      tr: 'İpucusuz çözüm, eksik sayı', ku: 'Çareserî bêyî nîşan, hejmara kêm',
      en: 'Solving without hints, missing number', ar: 'الحل بلا تلميحات، العدد الناقص',
      fa: 'حل بدون راهنما، عدد گمشده',
    },
    activityIndices: [24, 25],
  },
  {
    id: 'ders-8',
    name: {
      tr: '8. Transfer ve Problem Kurma', ku: '8. Derbazkirin û Avakirina Pirsgirêkê',
      en: '8. Transfer and Problem Posing', ar: '8. النقل وصياغة المسائل',
      fa: '۸. انتقال و مسئله‌سازی',
    },
    description: {
      tr: 'Gerçek veri, kendi problemin, kararını savun',
      ku: 'Daneya rastîn, pirsgirêka te, biryara xwe biparêze',
      en: 'Real data, your own problem, defend your decision',
      ar: 'بيانات حقيقية، مسألتك أنت، دافع عن قرارك',
      fa: 'داده‌های واقعی، مسئلهٔ خودت، از تصمیمت دفاع کن',
    },
    activityIndices: [26, 27, 28],
  },
];

/** Kategori sırası (sidebar dizilişi = zorluk basamağı sırası) */
export const CATEGORY_ORDER = [
  'keşif', 'kavram', 'işlem', 'karşılaştır', 'senaryo', 'yanılgı', 'bağımsız', 'transfer',
];

/** Kategori → i18n anahtarı (etiketler 5 dilde i18n dosyalarında) */
export const CATEGORY_KEYS = {
  'keşif': 'cat_exploration',
  'kavram': 'cat_concept',
  'işlem': 'cat_operation',
  'karşılaştır': 'cat_comparison',
  'senaryo': 'cat_scenario',
  'yanılgı': 'cat_misconception',
  'bağımsız': 'cat_independent',
  'transfer': 'cat_transfer',
};

/** Kategori renkleri */
export const CATEGORY_COLORS = {
  'yanılgı': '#ef4444',
  'senaryo': '#3b82f6',
  'bağımsız': '#d97706',
  'transfer': '#8b5cf6',
};

/** Zorluk basamağı → i18n anahtarı (STANDARDS §1.6) */
export const DIFFICULTY_KEYS = {
  1: 'diff_1', 2: 'diff_2', 3: 'diff_3', 4: 'diff_4', 5: 'diff_5',
};
