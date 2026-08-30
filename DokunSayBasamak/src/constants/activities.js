/**
 * DokunSay Basamak — Etkinlikler
 *
 * 2026-07-19 DENETİMİ — burada kapatılan üç kusur:
 *
 * 1) İÇERİK TEK DİLLİYDİ (§1.7 ihlali, en ciddi bulgu). Arayüz beş dile çevriliyordu
 *    (TR/KU/EN/AR/FA) ama 20 etkinliğin ADI ve YÖNERGESİ sabit Türkçeydi ve hiçbir çeviri
 *    araması yoktu: Kurmancî seçen çocuk menüyü kendi dilinde, ama çözeceği görevi Türkçe
 *    görüyordu. Alan adları DokunSayBar'ın yerleşik kalıbını izler:
 *      ad:  n (tr) · k (ku) · en · ar · fa
 *      açk: d (tr) · dk (ku) · den · dar · dfa
 *
 * 2) KAVRAM YANILGILARINDA ATIF YOKTU (§1.5). İçerik iyiydi — Y1-Y5 gerçek, iyi belgelenmiş
 *    basamak değeri yanılgılarını hedefliyor — ama standart "kaynak literatürle
 *    atıflandırılmalı" diyor. `mis` (yanılgı etiketi) + `src` (atıf) alanları eklendi.
 *
 * 3) ZORLUK 4-5 BASAMAKLARI YOKTU (§1.6). Tüm etkinlikler diff 1-3'teydi. Teknik sebebi
 *    App.jsx'teki üçlü etiket ternary'siydi (1?kolay : 2?orta : zor) — diff 4-5 sessizce
 *    "zor"a düşüyordu, yani yazılsa bile ayırt edilemezdi. Etiket beşe çıkarıldı, ardından
 *    B1 (Bağımsız) ve T1-T2 (Transfer) eklendi.
 */

export const ACTIVITIES = [
  { n: "Serbest Keşif", k: "Vekolîna Azad", en: "Free Exploration", ar: "استكشاف حر", fa: "اکتشاف آزاد",
    i: "🎨", cat: "keşif", diff: 1,
    d: "Blokları kanvasa sürükleyerek basamak değerini keşfet!",
    dk: "Blokan bikişîne ser kanvasê û nirxa refikan keşf bike!",
    den: "Drag the blocks onto the canvas and explore place value!",
    dar: "اسحب القوالب إلى اللوحة واستكشف القيمة المكانية!",
    dfa: "بلوک‌ها را روی بوم بکش و ارزش مکانی را کشف کن!",
    s: {} },

  { n: "Birlikler", k: "Yekîtî", en: "Ones", ar: "الآحاد", fa: "یکان",
    i: "🟡", cat: "kavram", diff: 1,
    d: "Birlik küplerini sürükle. Her küp 1 değerinde. 7 küp = 7",
    dk: "Kûpên yekîtiyê bikişîne. Her kûp bi nirxa 1ê ye. 7 kûp = 7",
    den: "Drag the unit cubes. Each cube is worth 1. 7 cubes = 7",
    dar: "اسحب مكعّبات الآحاد. كلّ مكعّب يساوي 1. سبعة مكعّبات = 7",
    dfa: "مکعب‌های یکان را بکش. هر مکعب ۱ ارزش دارد. ۷ مکعب = ۷",
    s: { ones: 7, cols: 2 } },

  { n: "Onluklar", k: "Dehîtî", en: "Tens", ar: "العشرات", fa: "دهگان",
    i: "🟠", cat: "kavram", diff: 1,
    d: "Onluk çubuğu sürükle. Her çubuk 10 birlik içerir. 3 çubuk = 30",
    dk: "Darikê dehîtiyê bikişîne. Her darik 10 yekîtiyan dihewîne. 3 darik = 30",
    den: "Drag the ten-rod. Each rod holds 10 ones. 3 rods = 30",
    dar: "اسحب قضيب العشرة. كلّ قضيب يحوي 10 آحاد. ثلاثة قضبان = 30",
    dfa: "میله دهگان را بکش. هر میله ۱۰ یکان دارد. ۳ میله = ۳۰",
    s: { tens: 3, cols: 2 } },

  { n: "Yüzlükler", k: "Sedîtî", en: "Hundreds", ar: "المئات", fa: "صدگان",
    i: "🔵", cat: "kavram", diff: 1,
    d: "Yüzlük kareyi sürükle. Her kare 100 birlik = 10 onluk içerir.",
    dk: "Çargoşeya sedîtiyê bikişîne. Her çargoşe 100 yekîtî = 10 dehîtiyan dihewîne.",
    den: "Drag the hundred-square. Each square holds 100 ones = 10 tens.",
    dar: "اسحب مربّع المئة. كلّ مربّع يحوي 100 آحاد = 10 عشرات.",
    dfa: "مربع صدگان را بکش. هر مربع ۱۰۰ یکان = ۱۰ دهگان دارد.",
    s: { huns: 1, cols: 3 } },

  { n: "10 Birlik = 1 Onluk", k: "10 Yekîtî = 1 Dehîtî", en: "10 Ones = 1 Ten", ar: "10 آحاد = عشرة واحدة", fa: "۱۰ یکان = ۱ دهگان",
    i: "🔄", cat: "kavram", diff: 2,
    d: "10 birlik küpü ekledik. Birine tıkla → 🔗 Grupla! (G tuşu)",
    dk: "Me 10 kûpên yekîtiyê zêde kirin. Li yekê bitikîne → 🔗 Kom bike! (bişkoka G)",
    den: "We added 10 unit cubes. Tap one → 🔗 Group them! (G key)",
    dar: "أضفنا 10 مكعّبات آحاد. انقر على أحدها → 🔗 اجمعها! (مفتاح G)",
    dfa: "۱۰ مکعب یکان اضافه کردیم. روی یکی بزن → 🔗 گروه کن! (کلید G)",
    s: { ones: 10, cols: 2 } },

  { n: "Sayı Oluştur: 34", k: "Hejmarê Çêke: 34", en: "Build the Number: 34", ar: "كوّن العدد: 34", fa: "عدد را بساز: ۳۴",
    i: "🔢", cat: "işlem", diff: 1,
    d: "3 onluk + 4 birlik = 34",
    dk: "3 dehîtî + 4 yekîtî = 34",
    den: "3 tens + 4 ones = 34",
    dar: "3 عشرات + 4 آحاد = 34",
    dfa: "۳ دهگان + ۴ یکان = ۳۴",
    s: { tens: 3, ones: 4, cols: 2 } },

  { n: "Sayı Oluştur: 152", k: "Hejmarê Çêke: 152", en: "Build the Number: 152", ar: "كوّن العدد: 152", fa: "عدد را بساز: ۱۵۲",
    i: "🔢", cat: "işlem", diff: 2,
    d: "1 yüzlük + 5 onluk + 2 birlik = 152",
    dk: "1 sedîtî + 5 dehîtî + 2 yekîtî = 152",
    den: "1 hundred + 5 tens + 2 ones = 152",
    dar: "مئة واحدة + 5 عشرات + 2 آحاد = 152",
    dfa: "۱ صدگان + ۵ دهگان + ۲ یکان = ۱۵۲",
    s: { huns: 1, tens: 5, ones: 2, cols: 3 } },

  { n: "Sayı Oluştur: 2047", k: "Hejmarê Çêke: 2047", en: "Build the Number: 2047", ar: "كوّن العدد: 2047", fa: "عدد را بساز: ۲۰۴۷",
    i: "🔢", cat: "işlem", diff: 3,
    d: "2 binlik + 0 yüzlük + 4 onluk + 7 birlik = 2047",
    dk: "2 hezarîtî + 0 sedîtî + 4 dehîtî + 7 yekîtî = 2047",
    den: "2 thousands + 0 hundreds + 4 tens + 7 ones = 2047",
    dar: "2 آلاف + 0 مئات + 4 عشرات + 7 آحاد = 2047",
    dfa: "۲ هزارگان + ۰ صدگان + ۴ دهگان + ۷ یکان = ۲۰۴۷",
    s: { ths: 2, tens: 4, ones: 7, cols: 4 } },

  { n: "Toplama: 25+18", k: "Kombûn: 25+18", en: "Addition: 25+18", ar: "الجمع: 25+18", fa: "جمع: ۲۵+۱۸",
    i: "➕", cat: "işlem", diff: 2,
    d: "25 ve 18 bloklarla gösterildi. Birlikler: 5+8=13 → 10 birliğe tıkla → Grupla!",
    dk: "25 û 18 bi blokan hatin nîşandan. Yekîtî: 5+8=13 → li 10 yekîtiyan bitikîne → Kom bike!",
    den: "25 and 18 are shown with blocks. Ones: 5+8=13 → tap 10 ones → Group them!",
    dar: "عُرض 25 و18 بالقوالب. الآحاد: 5+8=13 → انقر على 10 آحاد → اجمعها!",
    dfa: "۲۵ و ۱۸ با بلوک نشان داده شد. یکان: ۵+۸=۱۳ → روی ۱۰ یکان بزن → گروه کن!",
    s: { tens: 3, ones: 13, cols: 2 } },

  { n: "Çıkarma: 43−17", k: "Kêmkirin: 43−17", en: "Subtraction: 43−17", ar: "الطرح: 43−17", fa: "تفریق: ۴۳−۱۷",
    i: "➖", cat: "işlem", diff: 3,
    d: "43 gösterildi. 7 birlik çıkarmak için 1 onluğa tıkla → ✂ Çöz!",
    dk: "43 hat nîşandan. Ji bo 7 yekîtiyan derxînî li 1 dehîtiyê bitikîne → ✂ Veke!",
    den: "43 is shown. To take away 7 ones, tap one ten → ✂ Break it apart!",
    dar: "عُرض 43. لطرح 7 آحاد انقر على عشرة واحدة → ✂ فكّكها!",
    dfa: "۴۳ نشان داده شد. برای کم کردن ۷ یکان روی ۱ دهگان بزن → ✂ بازش کن!",
    s: { tens: 4, ones: 3, cols: 2 } },

  { n: "Karşılaştır", k: "Bide Ber Hev", en: "Compare", ar: "قارن", fa: "مقایسه کن",
    i: "⚖️", cat: "karşılaştır", diff: 2,
    d: "Soldaki 256, sağdaki 289. Yüzlükler eşit — onluklara bak!",
    dk: "Ya çepê 256, ya rastê 289. Sedîtî wekhev in — li dehîtiyan binêre!",
    den: "The left is 256, the right is 289. The hundreds match — look at the tens!",
    dar: "اليسار 256 واليمين 289. المئات متساوية — انظر إلى العشرات!",
    dfa: "سمت چپ ۲۵۶، سمت راست ۲۸۹. صدگان برابرند — به دهگان نگاه کن!",
    s: { huns: 2, tens: 5, ones: 6, cols: 3, decomp: true } },

  /* ── KAVRAM YANILGILARI (§1.5: literatür atıflı) ─────────────────────────── */

  { n: "Y1: 3, 30 ve 300", k: "Y1: 3, 30 û 300", en: "Y1: 3, 30 and 300", ar: "Y1: 3 و30 و300", fa: "Y1: ۳، ۳۰ و ۳۰۰",
    i: "🔍", cat: "yanılgı", diff: 2,
    mis: "rakam-basamak-degeri-karistirma", src: "Ross (1989)",
    d: "324 gösterildi. 3 yüzlük = 300! Basamak değeri ≠ rakam.",
    dk: "324 hat nîşandan. 3 sedîtî = 300! Nirxa refikê ≠ reqem.",
    den: "324 is shown. 3 hundreds = 300! Place value is not the same as the digit.",
    dar: "عُرض 324. ثلاث مئات = 300! القيمة المكانية ليست الرقم.",
    dfa: "۳۲۴ نشان داده شد. ۳ صدگان = ۳۰۰! ارزش مکانی با رقم فرق دارد.",
    s: { huns: 3, tens: 2, ones: 4, cols: 3, decomp: true } },

  { n: "Y2: Sıfırın Önemi", k: "Y2: Girîngiya Sifirê", en: "Y2: Why Zero Matters", ar: "Y2: أهمّية الصفر", fa: "Y2: اهمیت صفر",
    i: "🔍", cat: "yanılgı", diff: 2,
    mis: "sifiri-yok-sayma", src: "Resnick (1983)",
    d: "304 gösterildi. Onluklar basamağı 0 — sıfır yer tutucu!",
    dk: "304 hat nîşandan. Refika dehîtiyan 0 e — sifir cihgir e!",
    den: "304 is shown. The tens place is 0 — zero is a placeholder!",
    dar: "عُرض 304. خانة العشرات صفر — الصفر يحفظ المكان!",
    dfa: "۳۰۴ نشان داده شد. جایگاه دهگان ۰ است — صفر نگهدارنده جاست!",
    s: { huns: 3, ones: 4, cols: 3, decomp: true } },

  { n: "Y3: Gruplama Hatası", k: "Y3: Şaşiya Komkirinê", en: "Y3: Regrouping Error", ar: "Y3: خطأ إعادة التجميع", fa: "Y3: خطای دسته‌بندی",
    i: "🔍", cat: "yanılgı", diff: 3,
    mis: "gruplamayi-atlama", src: "Fuson (1990)",
    d: "2 yüzlük + 13 onluk + 1 birlik ekledik. 13 onluğa tıkla → Grupla!",
    dk: "Me 2 sedîtî + 13 dehîtî + 1 yekîtî zêde kirin. Li 13 dehîtiyan bitikîne → Kom bike!",
    den: "We added 2 hundreds + 13 tens + 1 one. Tap the 13 tens → Group them!",
    dar: "أضفنا مئتين + 13 عشرة + واحدًا. انقر على الـ13 عشرة → اجمعها!",
    dfa: "۲ صدگان + ۱۳ دهگان + ۱ یکان اضافه کردیم. روی ۱۳ دهگان بزن → گروه کن!",
    s: { huns: 2, tens: 13, ones: 1, cols: 3 } },

  { n: "Y4: Sözel → Sembolik", k: "Y4: Devkî → Sembolîk", en: "Y4: Spoken → Written", ar: "Y4: المنطوق → المكتوب", fa: "Y4: گفتاری → نوشتاری",
    i: "🔍", cat: "yanılgı", diff: 2,
    mis: "duyduğunu-yanyana-yazma", src: "Fuson (1990)",
    d: "304 gösterildi. 'Üç yüz dört' — 3004 değil!",
    dk: "304 hat nîşandan. 'Sê sed û çar' — ne 3004 e!",
    den: "304 is shown. 'Three hundred four' — not 3004!",
    dar: "عُرض 304. «ثلاثمئة وأربعة» — وليس 3004!",
    dfa: "۳۰۴ نشان داده شد. «سیصد و چهار» — نه ۳۰۰۴!",
    s: { huns: 3, ones: 4, cols: 3, decomp: true } },

  { n: "Y5: Çok Rakam = Büyük mü?", k: "Y5: Gelek Reqem = Mezin e?", en: "Y5: More Digits = Bigger?", ar: "Y5: أرقام أكثر = أكبر؟", fa: "Y5: رقم بیشتر = بزرگ‌تر؟",
    i: "🔬", cat: "yanılgı", diff: 2,
    mis: "rakam-sayisini-buyukluk-sanma", src: "Nunes & Bryant (1996)",
    d: "89 ve 102 karşılaştır. Basamak sayısı önemli!",
    dk: "89 û 102 bide ber hev. Hejmara refikan girîng e!",
    den: "Compare 89 and 102. The number of places matters!",
    dar: "قارن 89 و102. عدد الخانات مهمّ!",
    dfa: "۸۹ و ۱۰۲ را مقایسه کن. تعداد جایگاه‌ها مهم است!",
    s: { huns: 1, ones: 2, cols: 3, decomp: true } },

  /* ── GERÇEK HAYAT ────────────────────────────────────────────────────────── */

  { n: "Market Alışverişi", k: "Kirîna Bazarê", en: "Grocery Shopping", ar: "التسوّق", fa: "خرید از فروشگاه",
    i: "🛒", cat: "senaryo", diff: 1,
    d: "45₺ + 27₺ → toplam bloklar ekledik. Grupla!",
    dk: "45₺ + 27₺ → me blokên giştî zêde kirin. Kom bike!",
    den: "45₺ + 27₺ → we added the total in blocks. Group them!",
    dar: "45₺ + 27₺ → أضفنا المجموع بالقوالب. اجمعها!",
    dfa: "۴۵₺ + ۲۷₺ → مجموع را با بلوک اضافه کردیم. گروه کن!",
    s: { tens: 6, ones: 12, cols: 2 } },

  { n: "Uzunluk Ölçme", k: "Pîvana Dirêjahiyê", en: "Measuring Length", ar: "قياس الطول", fa: "اندازه‌گیری طول",
    i: "📏", cat: "senaryo", diff: 2,
    d: "135cm gösterildi: 1 yüzlük + 3 onluk + 5 birlik",
    dk: "135cm hat nîşandan: 1 sedîtî + 3 dehîtî + 5 yekîtî",
    den: "135cm is shown: 1 hundred + 3 tens + 5 ones",
    dar: "عُرض 135 سم: مئة + 3 عشرات + 5 آحاد",
    dfa: "۱۳۵ سانتی‌متر نشان داده شد: ۱ صدگان + ۳ دهگان + ۵ یکان",
    s: { huns: 1, tens: 3, ones: 5, cols: 3 } },

  { n: "Sınıf Mevcudu", k: "Hejmara Polê", en: "School Enrolment", ar: "عدد الطلاب", fa: "تعداد دانش‌آموزان",
    i: "🏫", cat: "senaryo", diff: 1,
    d: "386 öğrenci gösterildi.",
    dk: "386 xwendekar hatin nîşandan.",
    den: "386 students are shown.",
    dar: "عُرض 386 طالبًا.",
    dfa: "۳۸۶ دانش‌آموز نشان داده شد.",
    s: { huns: 3, tens: 8, ones: 6, cols: 3 } },

  { n: "Para Bozma", k: "Hûrkirina Pereyan", en: "Breaking a Banknote", ar: "صرف الورقة النقدية", fa: "خرد کردن پول",
    i: "💰", cat: "senaryo", diff: 2,
    d: "500₺ gösterildi. Yüzlüğe tıkla → ✂ Çöz!",
    dk: "500₺ hat nîşandan. Li sedîtiyê bitikîne → ✂ Veke!",
    den: "500₺ is shown. Tap a hundred → ✂ Break it apart!",
    dar: "عُرض 500₺. انقر على المئة → ✂ فكّكها!",
    dfa: "۵۰۰₺ نشان داده شد. روی صدگان بزن → ✂ بازش کن!",
    s: { huns: 5, cols: 3 } },

  /* ── BAĞIMSIZ (diff 4) ve TRANSFER (diff 5) — §1.6'nın eksik üst basamakları ── */

  { n: "B1: Aynı Sayı, Başka Yol", k: "B1: Heman Hejmar, Rêyeke Din", en: "B1: Same Number, Another Way", ar: "B1: العدد نفسه بطريقة أخرى", fa: "B1: همان عدد، راهی دیگر",
    i: "🧠", cat: "işlem", diff: 4,
    d: "Ekranda 142 duruyor: 1 yüzlük + 4 onluk + 2 birlik. Şimdi AYNI sayıyı hiç yüzlük kullanmadan kur. Kaç onluk gerekir? Kendi başına dene.",
    dk: "Li ekranê 142 heye: 1 sedîtî + 4 dehîtî + 2 yekîtî. Niha HEMAN hejmarê bêyî tu sedîtî ava bike. Çend dehîtî divên? Bi serê xwe biceribîne.",
    den: "142 is on screen: 1 hundred + 4 tens + 2 ones. Now build the SAME number using no hundreds at all. How many tens do you need? Try it on your own.",
    dar: "على الشاشة 142: مئة + 4 عشرات + 2 آحاد. الآن كوّن العدد نفسه دون استخدام أيّ مئة. كم عشرة تحتاج؟ جرّب بنفسك.",
    dfa: "روی صفحه ۱۴۲ است: ۱ صدگان + ۴ دهگان + ۲ یکان. حالا همان عدد را بدون هیچ صدگانی بساز. چند دهگان لازم است؟ خودت امتحان کن.",
    s: { huns: 1, tens: 4, ones: 2, cols: 3, decomp: true } },

  { n: "T1: Otobüs Kaç Kişilik?", k: "T1: Otobûs Ji Bo Çend Kesan e?", en: "T1: How Many Fit on the Buses?", ar: "T1: كم شخصًا تتّسع الحافلات؟", fa: "T1: اتوبوس‌ها چند نفر جا می‌دهند؟",
    i: "🚌", cat: "senaryo", diff: 5,
    d: "Bir otobüs 40 kişi alıyor. Okulda 235 öğrenci var. Kaç otobüs gerekir? Blokları kullanarak göster, sonra kararını anlat: artan öğrenciler için ne yaparsın?",
    dk: "Otobûsek 40 kesan digire. Li dibistanê 235 xwendekar hene. Çend otobûs divên? Bi blokan nîşan bide, paşê biryara xwe rave bike: ji bo xwendekarên zêde tu çi dikî?",
    den: "One bus carries 40 people. The school has 235 students. How many buses are needed? Show it with the blocks, then explain your decision: what do you do about the students left over?",
    dar: "الحافلة الواحدة تحمل 40 شخصًا. في المدرسة 235 طالبًا. كم حافلة نحتاج؟ أظهر ذلك بالقوالب ثمّ اشرح قرارك: ماذا تفعل بالطلاب المتبقّين؟",
    dfa: "یک اتوبوس ۴۰ نفر را می‌برد. مدرسه ۲۳۵ دانش‌آموز دارد. چند اتوبوس لازم است؟ با بلوک‌ها نشان بده و تصمیمت را توضیح بده: با دانش‌آموزان باقی‌مانده چه می‌کنی؟",
    s: { huns: 2, tens: 3, ones: 5, cols: 3 } },

  { n: "T2: Sen Sayı Sor", k: "T2: Tu Hejmarê Bipirse", en: "T2: You Ask the Number", ar: "T2: اسأل أنت عن العدد", fa: "T2: تو عدد را بپرس",
    i: "✍️", cat: "senaryo", diff: 5,
    d: "Sıra sende: bloklarla bir sayı kur ama arkadaşına gösterme. Sonra ipucu ver — 'yüzlükler basamağı 4, toplam 3 basamaklı'. Arkadaşın sayıyı bulabilir mi?",
    dk: "Dor a te ye: bi blokan hejmarekê ava bike lê nîşanî hevalê xwe nede. Paşê nîşan bide — 'refika sedîtiyan 4 e, bi tevahî 3 refik e'. Ma hevalê te dikare hejmarê bibîne?",
    den: "Your turn: build a number with the blocks but don't show your friend. Then give clues — 'the hundreds place is 4, it has 3 digits'. Can your friend work out the number?",
    dar: "دورك: كوّن عددًا بالقوالب دون أن تُريه لصديقك. ثمّ أعطِ تلميحات — «خانة المئات 4، وله 3 خانات». هل يستطيع صديقك معرفة العدد؟",
    dfa: "نوبت توست: با بلوک‌ها عددی بساز اما به دوستت نشان نده. بعد سرنخ بده — «جایگاه صدگان ۴ است، ۳ رقمی است». آیا دوستت می‌تواند عدد را پیدا کند؟",
    s: {} },
];
