/**
 * DokunSay Clock — Etkinlikler ve Dersler
 *
 * App.jsx içinden çıkarıldı (2026-07-19 denetimi). Üç kusur birlikte kapatıldı:
 *
 * 1) İÇERİK TEK DİLLİYDİ (§1.7). Arayüz beş dile çevriliyordu ama etkinlik ADI ve
 *    YÖNERGESİ sabit Türkçeydi. DİKKAT: bu araçta `k` alanı Kurmancî DEĞİL, MEB
 *    KAZANIM KODUDUR (M.1.3.3.1). Bu yüzden dil alanları açıkça adlandırıldı:
 *      ad:  n · n_ku · n_en · n_ar · n_fa
 *      açk: d · d_ku · d_en · d_ar · d_fa
 *
 * 2) KAVRAM YANILGISI SAYISI YETERSİZDİ (§1.5: en az 3). İki tane vardı (KY1, KY2) ve
 *    atıfsızdı. KY3 eklendi (dakika kolunun gösterdiği SAYIYI dakika sanma — saat
 *    öğretiminin en yaygın hatası) ve üçüne de `mis`+`src` yazıldı.
 *
 * 3) ÜST ZORLUK BASAMAKLARI YOKTU (§1.6). Tüm etkinlikler diff 1-3'teydi.
 *    B1 (Bağımsız) ve T1/T2 (Transfer) eklendi.
 */

export const ACTS = [
  { n: "Serbest Keşif", n_ku: "Vekolîna Azad", n_en: "Free Exploration", n_ar: "استكشاف حر", n_fa: "اکتشاف آزاد",
    i: "🎨", cat: "keşif", diff: 1, k: "",
    d: "Saati kendin inşa et!",
    d_ku: "Saetê bi xwe ava bike!",
    d_en: "Build the clock yourself!",
    d_ar: "ابنِ الساعة بنفسك!",
    d_fa: "ساعت را خودت بساز!" },

  { n: "Tam Saatleri Oku", n_ku: "Saetên Tam Bixwîne", n_en: "Read O'Clock Times", n_ar: "اقرأ الساعات التامّة", n_fa: "ساعت‌های کامل را بخوان",
    i: "🕐", cat: "kavram", diff: 1, k: "M.1.3.3.1", s: { h: 3, m: 0 },
    d: "Saat göstergesini 3'e, dakika göstergesini 12'ye getir.",
    d_ku: "Nîşandera saetê bibe 3, nîşandera deqîqeyê bibe 12.",
    d_en: "Move the hour hand to 3 and the minute hand to 12.",
    d_ar: "حرّك عقرب الساعات إلى 3 وعقرب الدقائق إلى 12.",
    d_fa: "عقربه ساعت را روی ۳ و عقربه دقیقه را روی ۱۲ ببر." },

  { n: "Yarım Saat", n_ku: "Nîv Saet", n_en: "Half Past", n_ar: "النصف ساعة", n_fa: "نیم ساعت",
    i: "🕧", cat: "kavram", diff: 1, k: "M.1.3.3.1", s: { h: 4, m: 30 },
    d: "Dakika göstergesi 6'da → yarım saat.",
    d_ku: "Nîşandera deqîqeyê li 6ê → nîv saet.",
    d_en: "Minute hand on 6 → half past.",
    d_ar: "عقرب الدقائق على 6 ← النصف.",
    d_fa: "عقربه دقیقه روی ۶ ← و نیم." },

  { n: "Kahvaltı Saati", n_ku: "Dema Taştê", n_en: "Breakfast Time", n_ar: "وقت الفطور", n_fa: "وقت صبحانه",
    i: "🥞", cat: "kavram", diff: 1, k: "M.1.3.3.1", s: { h: 8, m: 0 },
    d: "08:00 kahvaltı.",
    d_ku: "08:00 taşte.",
    d_en: "08:00 is breakfast.",
    d_ar: "الثامنة صباحًا وقت الفطور.",
    d_fa: "ساعت ۸ صبحانه است." },

  { n: "Beşer Dakika", n_ku: "Pênc Pênc Deqîqe", n_en: "Counting by Fives", n_ar: "العدّ خمسة خمسة", n_fa: "پنج‌تا پنج‌تا دقیقه",
    i: "⏱️", cat: "kavram", diff: 2, k: "M.2.3.2.2", s: { h: 3, m: 15 },
    d: "3:15'i oluştur.",
    d_ku: "3:15ê ava bike.",
    d_en: "Make it 3:15.",
    d_ar: "اضبطها على 3:15.",
    d_fa: "ساعت را ۳:۱۵ کن." },

  { n: "Çeyrek Geçe", n_ku: "Çarêk Derbas", n_en: "Quarter Past", n_ar: "والربع", n_fa: "و ربع",
    i: "🕐", cat: "kavram", diff: 2, k: "M.2.3.2.2", s: { h: 5, m: 15 },
    d: "5:15'i göster.",
    d_ku: "5:15ê nîşan bide.",
    d_en: "Show 5:15.",
    d_ar: "أظهر 5:15.",
    d_fa: "۵:۱۵ را نشان بده." },

  { n: "Çeyrek Kala", n_ku: "Çarêk Kêm", n_en: "Quarter To", n_ar: "إلّا ربعًا", n_fa: "یک ربع مانده",
    i: "🕑", cat: "kavram", diff: 2, k: "M.2.3.2.2", s: { h: 2, m: 45 },
    d: "2:45'i göster.",
    d_ku: "2:45ê nîşan bide.",
    d_en: "Show 2:45.",
    d_ar: "أظهر 2:45.",
    d_fa: "۲:۴۵ را نشان بده." },

  { n: "1 Saat = 60 dk", n_ku: "1 Saet = 60 Deqîqe", n_en: "1 Hour = 60 min", n_ar: "ساعة = 60 دقيقة", n_fa: "۱ ساعت = ۶۰ دقیقه",
    i: "⏰", cat: "kavram", diff: 3, k: "M.3.3.2.1", s: { h: 12, m: 0 },
    d: "Dakika göstergesi tam tur = 60 dk.",
    d_ku: "Nîşandera deqîqeyê gera tam = 60 deqîqe.",
    d_en: "One full turn of the minute hand = 60 minutes.",
    d_ar: "دورة كاملة لعقرب الدقائق = 60 دقيقة.",
    d_fa: "یک دور کامل عقربه دقیقه = ۶۰ دقیقه." },

  { n: "Analog–Dijital", n_ku: "Analog–Dîjîtal", n_en: "Analog–Digital", n_ar: "تناظري–رقمي", n_fa: "آنالوگ–دیجیتال",
    i: "🔄", cat: "karşılaştır", diff: 2, k: "M.2.3.2.1", s: { h: 10, m: 30 },
    d: "10:30'u ayarla. Eşleşiyor mu?",
    d_ku: "10:30ê saz bike. Li hev tê?",
    d_en: "Set 10:30. Do they match?",
    d_ar: "اضبط 10:30. هل يتطابقان؟",
    d_fa: "۱۰:۳۰ را تنظیم کن. مطابق‌اند؟" },

  /* ── KAVRAM YANILGILARI (§1.5: literatür atıflı) ─────────────────────────── */

  { n: "KY1: Saat mi Dakika mı?", n_ku: "KY1: Saet an Deqîqe?", n_en: "KY1: Hour Hand or Minute Hand?", n_ar: "KY1: عقرب الساعات أم الدقائق؟", n_fa: "KY1: عقربه ساعت یا دقیقه؟",
    i: "🔍", cat: "yanılgı", diff: 1, k: "KY", s: { h: 3, m: 0 },
    mis: "kollari-karistirma", src: "Friedman & Laycock (1989)",
    d: "Kısa kol = saat göstergesi, uzun kol = dakika göstergesi. Karıştırma!",
    d_ku: "Milê kurt = nîşandera saetê, milê dirêj = nîşandera deqîqeyê. Tevlihev neke!",
    d_en: "Short hand = hour, long hand = minutes. Don't mix them up!",
    d_ar: "العقرب القصير = الساعات، الطويل = الدقائق. لا تخلط بينهما!",
    d_fa: "عقربه کوتاه = ساعت، بلند = دقیقه. قاطی نکن!" },

  { n: "KY2: Yarımda Saat Kolu", n_ku: "KY2: Di Nîvê de Milê Saetê", n_en: "KY2: The Hour Hand at Half Past", n_ar: "KY2: عقرب الساعات عند النصف", n_fa: "KY2: عقربه ساعت در نیم",
    i: "🔍", cat: "yanılgı", diff: 2, k: "KY", s: { h: 3, m: 30 },
    mis: "saat-kolunu-sabit-sanma", src: "Boulton-Lewis, Wilss & Mutch (1997)",
    d: "3:30'da saat göstergesi tam 3'te DEĞİL — 3 ile 4 arasındadır. Saat kolu da yavaşça ilerler.",
    d_ku: "Di 3:30ê de nîşandera saetê ne tam li 3ê ye — di navbera 3 û 4ê de ye. Milê saetê jî hêdî hêdî diçe.",
    d_en: "At 3:30 the hour hand is NOT exactly on 3 — it sits between 3 and 4. The hour hand moves too.",
    d_ar: "عند 3:30 لا يكون عقرب الساعات على 3 تمامًا — بل بين 3 و4. عقرب الساعات يتحرّك أيضًا.",
    d_fa: "در ۳:۳۰ عقربه ساعت دقیقاً روی ۳ نیست — بین ۳ و ۴ است. عقربه ساعت هم حرکت می‌کند." },

  { n: "KY3: 9 mu, 45 mi?", n_ku: "KY3: 9 e an 45?", n_en: "KY3: Is It 9 or 45?", n_ar: "KY3: أهي 9 أم 45؟", n_fa: "KY3: ۹ است یا ۴۵؟",
    i: "🔍", cat: "yanılgı", diff: 3, k: "KY", s: { h: 2, m: 45 },
    mis: "gosterilen-sayiyi-dakika-sanma", src: "Burny, Valcke & Desoete (2009)",
    d: "Dakika göstergesi 9'u gösteriyor ama saat 2:09 DEĞİL, 2:45. Kadrandaki sayı dakikayı değil, beşer beşer sayılacak yeri söyler: 9 × 5 = 45.",
    d_ku: "Nîşandera deqîqeyê 9ê nîşan dide lê saet ne 2:09 e, 2:45 e. Hejmara li ser rûyê saetê ne deqîqeyê, cihê pênc-pênc jimartinê dibêje: 9 × 5 = 45.",
    d_en: "The minute hand points at 9, but the time is NOT 2:09 — it's 2:45. The number on the dial doesn't give the minutes; you count it in fives: 9 × 5 = 45.",
    d_ar: "عقرب الدقائق يشير إلى 9، لكنّ الوقت ليس 2:09 بل 2:45. الرقم على الميناء لا يعطي الدقائق؛ تَعُدّه خمسة خمسة: 9 × 5 = 45.",
    d_fa: "عقربه دقیقه روی ۹ است، اما ساعت ۲:۰۹ نیست، ۲:۴۵ است. عدد روی صفحه دقیقه را نمی‌گوید؛ آن را پنج‌تا پنج‌تا می‌شماری: ۹ × ۵ = ۴۵." },

  /* ── BAĞIMSIZ (diff 4) ve TRANSFER (diff 5) — §1.6'nın eksik üst basamakları ── */

  { n: "B1: Kaç Dakika Sonra?", n_ku: "B1: Piştî Çend Deqîqeyan?", n_en: "B1: How Many Minutes Later?", n_ar: "B1: بعد كم دقيقة؟", n_fa: "B1: چند دقیقه بعد؟",
    i: "🧠", cat: "kavram", diff: 4, k: "M.3.3.2.1", s: { h: 9, m: 20 },
    d: "Saat 9:20. Ders 40 dakika sürecek. Bitiş saatini KENDİN ayarla. İpucu yok — kolları düşünerek çevir.",
    d_ku: "Saet 9:20 e. Ders dê 40 deqîqe bidome. Saeta dawîlêhatinê BI XWE saz bike. Alîkarî tune — milan bi fikirîn bizivirîne.",
    d_en: "It's 9:20. The lesson lasts 40 minutes. Set the finishing time YOURSELF. No hints — reason it out and turn the hands.",
    d_ar: "الساعة 9:20 والدرس يستمرّ 40 دقيقة. اضبط وقت الانتهاء بنفسك. بلا تلميحات — فكّر وحرّك العقارب.",
    d_fa: "ساعت ۹:۲۰ است. درس ۴۰ دقیقه طول می‌کشد. زمان پایان را خودت تنظیم کن. بدون راهنما — فکر کن و عقربه‌ها را بچرخان." },

  { n: "T1: Günümü Planla", n_ku: "T1: Roja Xwe Plan Bike", n_en: "T1: Plan My Day", n_ar: "T1: خطّط ليومي", n_fa: "T1: روزم را برنامه‌ریزی کن",
    i: "🗓️", cat: "karşılaştır", diff: 5, k: "M.3.3.2.1", s: { h: 7, m: 0 },
    d: "Okul 8:30'da başlıyor. Yolculuk 25 dakika, kahvaltı 20 dakika, hazırlanmak 15 dakika sürüyor. Saat kaçta kalkmalısın? Saati kur ve kararını anlat.",
    d_ku: "Dibistan di 8:30ê de dest pê dike. Rê 25 deqîqe, taşte 20 deqîqe, amadebûn 15 deqîqe digire. Divê tu saet çend rabî? Saetê saz bike û biryara xwe rave bike.",
    d_en: "School starts at 8:30. The journey takes 25 minutes, breakfast 20, getting ready 15. What time must you get up? Set the clock and explain your reasoning.",
    d_ar: "المدرسة تبدأ 8:30. الطريق 25 دقيقة، الفطور 20، والاستعداد 15. متى يجب أن تستيقظ؟ اضبط الساعة واشرح تفكيرك.",
    d_fa: "مدرسه ۸:۳۰ شروع می‌شود. راه ۲۵ دقیقه، صبحانه ۲۰ و آماده شدن ۱۵ دقیقه است. ساعت چند باید بیدار شوی؟ ساعت را تنظیم کن و دلیلت را بگو." },

  { n: "T2: Sen Saat Sor", n_ku: "T2: Tu Saetê Bipirse", n_en: "T2: You Ask the Time", n_ar: "T2: اسأل أنت عن الوقت", n_fa: "T2: تو ساعت را بپرس",
    i: "✍️", cat: "karşılaştır", diff: 5, k: "", s: { h: 6, m: 0 },
    d: "Sıra sende: bir saat kur ama arkadaşına gösterme. Bir hikâye anlat — 'maç bitmesine çeyrek var'. Arkadaşın saati kurabilir mi?",
    d_ku: "Dor a te ye: saetekê saz bike lê nîşanî hevalê xwe nede. Çîrokekê bêje — 'ji dawiya maçê re çarêk maye'. Ma hevalê te dikare saetê saz bike?",
    d_en: "Your turn: set a time but don't show your friend. Tell a story — 'it's quarter to the end of the match'. Can your friend set the clock?",
    d_ar: "دورك: اضبط وقتًا دون أن تُريه لصديقك. احكِ قصّة — «بقي ربع ساعة على نهاية المباراة». هل يستطيع صديقك ضبط الساعة؟",
    d_fa: "نوبت توست: ساعتی تنظیم کن اما به دوستت نشان نده. داستانی بگو — «یک ربع به پایان بازی مانده». آیا دوستت می‌تواند ساعت را تنظیم کند؟" },
];

export const LESSONS = [
  { n: "1. Ders: Saati Tanıyalım", n_ku: "1. Ders: Saetê Nas Bikin", n_en: "Lesson 1: Meet the Clock", n_ar: "الدرس 1: تعرّف على الساعة", n_fa: "درس ۱: با ساعت آشنا شویم",
    d: "Kadran parçalarını birleştir, sayıları yerleştir.",
    d_ku: "Parçeyên rûyê saetê bigihîne hev, hejmaran bi cih bike.",
    d_en: "Put the dial together and place the numbers.",
    d_ar: "ركّب أجزاء الميناء وضع الأرقام.",
    d_fa: "قطعات صفحه را کنار هم بگذار و اعداد را جای‌گذاری کن.",
    acts: [0, 1, 3] },
  { n: "2. Ders: Yarım ve Çeyrek", n_ku: "2. Ders: Nîv û Çarêk", n_en: "Lesson 2: Half and Quarter", n_ar: "الدرس 2: النصف والربع", n_fa: "درس ۲: نیم و ربع",
    d: "Yarım saat ve çeyrek kavramları.",
    d_ku: "Têgehên nîv saet û çarêkê.",
    d_en: "The ideas of half past and quarter.",
    d_ar: "مفهوما النصف والربع.",
    d_fa: "مفهوم‌های نیم و ربع.",
    acts: [2, 5, 6] },
  { n: "3. Ders: Beşer Dakika", n_ku: "3. Ders: Pênc Pênc Deqîqe", n_en: "Lesson 3: Counting by Fives", n_ar: "الدرس 3: العدّ خمسة خمسة", n_fa: "درس ۳: پنج‌تا پنج‌تا",
    d: "Dakika göstergesinin her sayıda 5 dk ilerlemesi.",
    d_ku: "Nîşandera deqîqeyê li her hejmarê 5 deqîqe pêş dikeve.",
    d_en: "The minute hand advances 5 minutes at each number.",
    d_ar: "عقرب الدقائق يتقدّم 5 دقائق عند كلّ رقم.",
    d_fa: "عقربه دقیقه در هر عدد ۵ دقیقه جلو می‌رود.",
    acts: [4, 5, 6] },
  { n: "4. Ders: Dijital ve Analog", n_ku: "4. Ders: Dîjîtal û Analog", n_en: "Lesson 4: Digital and Analog", n_ar: "الدرس 4: الرقمي والتناظري", n_fa: "درس ۴: دیجیتال و آنالوگ",
    d: "İki gösterimi karşılaştır.",
    d_ku: "Her du nîşandanan bide ber hev.",
    d_en: "Compare the two representations.",
    d_ar: "قارن بين التمثيلين.",
    d_fa: "دو نمایش را مقایسه کن.",
    acts: [8] },
  { n: "5. Ders: Kavram Yanılgıları", n_ku: "5. Ders: Şaşitiyên Têgehî", n_en: "Lesson 5: Common Misconceptions", n_ar: "الدرس 5: المفاهيم الخاطئة", n_fa: "درس ۵: کج‌فهمی‌های رایج",
    d: "Yaygın hataları düzelt.",
    d_ku: "Şaşitiyên belav rast bike.",
    d_en: "Put the common errors right.",
    d_ar: "صحّح الأخطاء الشائعة.",
    d_fa: "خطاهای رایج را اصلاح کن.",
    acts: [9, 10, 11] },
];

/** Etkinlik/ders ADI ve YÖNERGESİ dile göre. `k` alanı MEB kazanım kodudur — dil DEĞİLDİR. */
export const actName = (a, lang) =>
  (lang === "ku" ? a.n_ku : lang === "en" ? a.n_en : lang === "ar" ? a.n_ar : lang === "fa" ? a.n_fa : a.n) || a.n;
export const actDesc = (a, lang) =>
  (lang === "ku" ? a.d_ku : lang === "en" ? a.d_en : lang === "ar" ? a.d_ar : lang === "fa" ? a.d_fa : a.d) || a.d;
