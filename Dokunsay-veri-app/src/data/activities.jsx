import React from "react";

export const ONBOARDING_SLIDES = [
  {
    icon: "👋",
    color: "#3b82f6",
    title: {
      tr: "DokunSay Veri'ye Hoş Geldin!",
      ku: "Bi xêr hatî DokunSay Veri!",
      en: "Welcome to DokunSay Veri!",
    },
    body: {
      tr: "Bu uygulama sana grafik okumayı, verileri analiz etmeyi ve yanıltıcı görselleri fark etmeyi öğretir. Küçük adımlarla ilerleyelim.",
      ku: "Ev sepan fêr dike xwendina grafîkan, analîzkirina daneyan û dîtina xapandinên dîmen. Bi gavên piçûk pêşkeve.",
      en: "This app teaches you to read graphs, analyze data, and spot misleading visuals. Let's start with small steps.",
    },
  },
  {
    icon: "🔍",
    color: "#3b82f6",
    title: {
      tr: "Keşfet grubu ile başla",
      ku: "Bi koma Keşif dest pê bike",
      en: "Start with the Discover group",
    },
    body: {
      tr: "Sol menüde 🔍 Keşfet altında 4 sekme var: Oku (basit grafikler), Yanıltma (hatalı grafikler), Dünya (gerçek veriler), Tanı (grafik türleri). Buradan başlamak en iyisi.",
      ku: "Li menûya çepê di bin 🔍 Keşif de 4 tab hene. Ji vir dest pê bike.",
      en: "In the left menu under 🔍 Discover you'll find 4 tabs: Read, Deception, World, Recognize. Start here.",
    },
  },
  {
    icon: "🛠️",
    color: "#10b981",
    title: {
      tr: "Araçlar ile kendi verini oluştur",
      ku: "Bi amûran daneyên xwe çêbike",
      en: "Create your own data with Tools",
    },
    body: {
      tr: "🛠️ Araçlar grubu altında: Oluştur (çubuk/çizgi/pasta grafik yap), Merkez (ortalama/medyan), İlişki (iki değişken), Olasılık (torba/zar), Topla (sınıfta anket). Hazır TÜİK/MGM verilerini de yükleyebilirsin.",
      ku: "Di bin 🛠️ Amûran de: Çêke, Navend, Têkilî, Îhtîmal, Berhev bike.",
      en: "Under 🛠️ Tools: Create, Center, Relate, Probability, Collect. You can also load real TÜİK/MGM data.",
    },
  },
  {
    icon: "♿",
    color: "#8b5cf6",
    title: {
      tr: "Erişilebilirlik açılabilir",
      ku: "Gihandin vebe dikare",
      en: "Accessibility can be on",
    },
    body: {
      tr: "⚙️ Ayarlar'dan: Diskalkuli Modu (yazılar %35 büyür), Sesli Anlatım (🔊 her sorunun yanında), Renk körü modu, Gözlem Modu (önce 'Ne görüyorsun?' sorusu). İhtiyacına göre aç/kapat.",
      ku: "Ji ⚙️ Eyaran: Moda Diskalkulî, Dengbêjî, Moda Kor-Rengî, Moda Çavdêriyê.",
      en: "From ⚙️ Settings: Dyscalculia mode, Text-to-Speech, Colorblind, Notice-Wonder mode. Toggle as you need.",
    },
  },
  {
    icon: "📚",
    color: "#f59e0b",
    title: {
      tr: "Küçük adımlar — seviye seviye",
      ku: "Gavên piçûk — ast bi ast",
      en: "Small steps — level by level",
    },
    body: {
      tr: "Üst menüde L0, L1, L2, L3 seviyeleri var (Curcio modeli). L0'dan başlarsın — veriyi oku. 3 doğru yaparsan L1 açılır. Aceleye gerek yok. Hata yapmak öğrenmenin parçasıdır.",
      ku: "Li jor L0, L1, L2, L3 hene. Ji L0 dest pê bike.",
      en: "Top menu has L0, L1, L2, L3 levels (Curcio model). Start at L0. Unlock L1 with 3 correct answers. No rush.",
    },
  },
];

export const MODULE_INTROS = {
  read: {
    icon: "📊", color: "#3b82f6",
    title: { tr: "Grafik Okuma", ku: "Xwendina Grafîkan", en: "Graph Reading" },
    body: {
      tr: "Burada her seviyede (L0–L3) grafikler okuyup sorular cevaplarsın. L0: en kolay (ne kadar var?). L3: en zor (eğilim nedir, neden?). Her etkinlikte önce 'Ne fark ediyorsun?' diye soracağız.",
      ku: "Li vir di her astê de (L0–L3) grafîkan dixwînî û pirsan bersiv didî.",
      en: "You'll read graphs and answer questions at each level (L0–L3). L0: easiest, L3: hardest. We start each activity asking 'What do you notice?'",
    },
  },
  deceive: {
    icon: "🔍", color: "#ef4444",
    title: { tr: "Yanıltma Avı", ku: "Nêçîra Xapandinê", en: "Deception Hunt" },
    body: {
      tr: "Burada BİLEREK yanıltıcı yapılmış grafikler var. Sen detektif olarak hatayı bulacaksın: kırpılmış eksen, tek taraflı örneklem, vb. 'How to Lie with Statistics' (Huff 1954) klasiği.",
      ku: "Grafîkên xapînok — tu detektîf bî, çewtiyê dibînî.",
      en: "These graphs are INTENTIONALLY misleading. You're the detective — find the trick. Inspired by Huff (1954).",
    },
  },
  world: {
    icon: "🌍", color: "#10b981",
    title: { tr: "Dünya'dan Gerçek Grafikler", ku: "Grafîkên Rast ji Cîhanê", en: "Real Graphs from the World" },
    body: {
      tr: "NASA, TÜİK, OECD gibi güvenilir kaynaklardan gerçek grafikler. Her biri için bağlam, gözlem, 3 analiz sorusu ve bir ders var. NYT'nin 'What's Going On in This Graph?' pedagojisi.",
      ku: "Grafîkên rastîn ji NASA, TÜİK, OECD.",
      en: "Real graphs from NASA, TÜİK, OECD. Each with context, observation, 3 questions, and a lesson.",
    },
  },
  recognize: {
    icon: "🧠", color: "#8b5cf6",
    title: { tr: "Grafik Türü Tanıma", ku: "Naskirina Curê Grafîkan", en: "Recognize Graph Types" },
    body: {
      tr: "10 farklı grafik türü (çubuk, çizgi, pasta, saçılım, histogram, kutu, nokta, alan, ısı haritası, waffle). 2 oyun modu: 'Bu ne?' ve 'Hangisi uygun?'. Schwabish (2021) ilhamı.",
      ku: "10 curê grafîkan — 2 moda lîstikê.",
      en: "10 graph types (bar, line, pie, scatter, histogram, box, dot, area, heatmap, waffle). 2 game modes.",
    },
  },
  create: {
    icon: "📈", color: "#10b981",
    title: { tr: "Kendi Grafiğini Oluştur", ku: "Grafîka Xwe Çêke", en: "Create Your Own Graph" },
    body: {
      tr: "Kendi verini gir (meyve sayısı, oy sayısı, vb.) ya da TÜİK/MGM'den hazır Türkiye verilerini yükle. Çubuk/çizgi/pasta seç — canlı önizleme.",
      ku: "Daneyên xwe têkevîne an ji TÜİK/MGM daneyan bar bike.",
      en: "Enter your data or load real TÜİK/MGM data. Pick bar/line/pie — live preview.",
    },
  },
  center: {
    icon: "⚖️", color: "#f59e0b",
    title: { tr: "Merkezi Eğilim Laboratuvarı", ku: "Laboratuara Meylê Navendî", en: "Central Tendency Lab" },
    body: {
      tr: "Ortalama (mean), medyan (median), mod (mode) — üç farklı 'merkez'. Veri ekle/çıkar, üç değerin anlık değişimini gör. Aykırı değer eklediğinde ne oluyor?",
      ku: "Navînî, medyan, mod — sêyan bidîtin.",
      en: "Mean, median, mode — three 'centers'. Add/remove data, watch them shift. What happens with an outlier?",
    },
  },
  relate: {
    icon: "🔗", color: "#8b5cf6",
    title: { tr: "İki Değişken Arasında İlişki", ku: "Têkiliya Du Guherbaran", en: "Relationship Between Two Variables" },
    body: {
      tr: "Saçılım grafiği — iki sayı arasında ilişki var mı? 4 gerçek veri seti: boy-kilo (nedensellik), dondurma-boğulma (KARIŞTIRICI!), çalışma-not, ekran-uyku. 'Korelasyon nedensellik değildir' önemli ders.",
      ku: "Du guherbar bi hev re — têkilî heye? Lê têkilî ≠ sedemî.",
      en: "Scatter plot — is there a relationship? 4 real datasets. Key lesson: correlation ≠ causation.",
    },
  },
  probability: {
    icon: "🎲", color: "#ec4899",
    title: { tr: "Olasılık Laboratuvarı", ku: "Laboratûara Îhtîmal", en: "Probability Lab" },
    body: {
      tr: "Torba simülatörü — kendi tasarla (3 kırmızı, 5 mavi, 2 yeşil…), top çek, olasılığı gör. Büyük sayılar yasası: ne kadar çok çekersen deneysel olasılık teoriğe yaklaşır.",
      ku: "Tûrika simulasyonê — xwe sêwirîne, top bikşîne.",
      en: "Bag simulator — design it, draw balls, see probability. Law of large numbers in action.",
    },
  },
  collect: {
    icon: "📋", color: "#0891b2",
    title: { tr: "Sınıf Anketi", ku: "Anketa Polê", en: "Class Survey" },
    body: {
      tr: "Kendi soru ve şıklarını yaz. Arkadaşların oy kullansın. Canlı grafik. PPDAC döngüsü: Problem → Plan → Data → Analyze → Conclude (Wild & Pfannkuch 1999).",
      ku: "Pirsa xwe binivîse, hevalên te deng didin.",
      en: "Write your own question. Friends vote. Live graph. Full PPDAC cycle.",
    },
  },
};

export const READ_ACTIVITIES = [
  // ────── L0 — VERİYİ OKU (direkt okuma) ──────
  {
    id: "r_l0_1", level: 0, gaise: "A", graphType: "bar",
    data: {
      title: { tr: "Sınıfımızın sevdiği meyveler", ku: "Fêkiyên dibistana me hez dikin", en: "Favorite fruits in our class" },
      categories: { tr: ["Elma", "Armut", "Çilek", "Muz"], ku: ["Sêv", "Hirmî", "Tût", "Mûz"], en: ["Apple", "Pear", "Strawberry", "Banana"] },
      values: [8, 3, 12, 5],
      unit: { tr: "öğrenci", ku: "xwendekar", en: "students" },
      yLabel: { tr: "Öğrenci sayısı", ku: "Hejmara xwendekaran", en: "Number of students" },
    },
    q: { tr: "Kaç öğrenci çilek seçti?", ku: "Çend xwendekaran tût hilbijartin?", en: "How many students chose strawberry?" },
    opts: { tr: ["3", "8", "12", "5"], ku: ["3", "8", "12", "5"], en: ["3", "8", "12", "5"] },
    correct: 2,
    hint: { tr: "Çilek çubuğuna bak ve en üstteki sayıyı oku.", ku: "Li darikê tût binêre û jimara jorîn bixwîne.", en: "Look at the strawberry bar and read the number on top." },
  },
  {
    id: "r_l0_2", level: 0, gaise: "A", graphType: "bar",
    data: {
      title: { tr: "Bir haftada okunan kitap sayısı", ku: "Hejmara pirtûkên di hefteyekê de tên xwendin", en: "Books read in one week" },
      categories: { tr: ["Pzt", "Sal", "Çar", "Per", "Cum"], ku: ["Dş", "Sê", "Ça", "Pê", "În"], en: ["Mon", "Tue", "Wed", "Thu", "Fri"] },
      values: [2, 5, 1, 7, 4],
      unit: { tr: "kitap", ku: "pirtûk", en: "books" },
      yLabel: { tr: "Kitap", ku: "Pirtûk", en: "Books" },
    },
    q: { tr: "En çok kitap hangi gün okunmuş?", ku: "Di kîjan rojê de pirtirîn pirtûk hatine xwendin?", en: "Which day were the most books read?" },
    opts: { tr: ["Pazartesi", "Çarşamba", "Perşembe", "Cuma"], ku: ["Duşem", "Çarşem", "Pêncşem", "În"], en: ["Monday", "Wednesday", "Thursday", "Friday"] },
    correct: 2,
    hint: { tr: "En uzun çubuğu bul. Sonra altındaki gün adını oku.", ku: "Darika herî dirêj bibîne, paşê navê rojê bixwîne.", en: "Find the tallest bar, then read the day name below it." },
  },
  {
    id: "r_l0_3", level: 0, gaise: "A", graphType: "picto",
    data: {
      title: { tr: "Bahçedeki çiçekler", ku: "Gulên bexçê", en: "Flowers in the garden" },
      categories: { tr: ["Gül", "Papatya", "Lale"], ku: ["Gul", "Beybûn", "Lale"], en: ["Rose", "Daisy", "Tulip"] },
      counts: [15, 25, 10],
      perIcon: 5,
      iconType: "star",
      unit: { tr: "çiçek", ku: "gul", en: "flowers" },
    },
    q: { tr: "Bahçede kaç papatya var? (Dikkat: 1 yıldız = 5 çiçek)", ku: "Di bexçê de çend beybûn hene? (Balkêş: 1 stêr = 5 gul)", en: "How many daisies? (Note: 1 star = 5 flowers)" },
    opts: { tr: ["5", "15", "25", "30"], ku: ["5", "15", "25", "30"], en: ["5", "15", "25", "30"] },
    correct: 2,
    hint: { tr: "Papatya satırındaki yıldızları say, sonra 5 ile çarp.", ku: "Stêrên di rêza beybûnan de bijmêre, paşê li 5 bizêde.", en: "Count stars in daisy row, then multiply by 5." },
  },
  {
    id: "r_l0_4", level: 0, gaise: "A", graphType: "table",
    data: {
      title: { tr: "Farklı boylarda öğrenci sayısı", ku: "Hejmara xwendekaran li gorî bejnê", en: "Students by height" },
      headers: { tr: ["Boy (cm)", "Kaç kişi?"], ku: ["Bejn (cm)", "Çend kes?"], en: ["Height (cm)", "How many?"] },
      rows: [
        ["120-129", "4"],
        ["130-139", "9"],
        ["140-149", "11"],
        ["150-159", "6"],
      ],
    },
    q: { tr: "Boyu 140-149 cm arasında olan kaç öğrenci var?", ku: "Çend xwendekar bejna wan di navbera 140-149 cm de ye?", en: "How many students are 140-149 cm tall?" },
    opts: { tr: ["4", "9", "11", "6"], ku: ["4", "9", "11", "6"], en: ["4", "9", "11", "6"] },
    correct: 2,
    hint: { tr: "140-149 cm satırını bul, sağdaki sayıyı oku.", ku: "Rêza 140-149 cm bibîne, jimara aliyê rastê bixwîne.", en: "Find the 140-149 row, read the number on the right." },
  },

  // ────── L1 — VERİLER ARASI OKU (karşılaştırma, hesap) ──────
  {
    id: "r_l1_1", level: 1, gaise: "A", graphType: "bar",
    data: {
      title: { tr: "Hayvanat bahçesindeki hayvanlar", ku: "Heywanên bexçê heywanan", en: "Zoo animals" },
      categories: { tr: ["Aslan", "Fil", "Zürafa", "Maymun"], ku: ["Şêr", "Fîl", "Zûrafe", "Meymûn"], en: ["Lion", "Elephant", "Giraffe", "Monkey"] },
      values: [6, 4, 3, 12],
      yLabel: { tr: "Sayı", ku: "Hejmar", en: "Count" },
    },
    q: { tr: "Kaç tane maymun aslandan daha fazla?", ku: "Ji şêr çend meymûn zêdetir hene?", en: "How many more monkeys than lions?" },
    opts: { tr: ["4", "6", "8", "12"], ku: ["4", "6", "8", "12"], en: ["4", "6", "8", "12"] },
    correct: 1,
    hint: { tr: "Maymun sayısından aslan sayısını çıkar: 12 − 6.", ku: "Jimara meymûnan ji şêran bikêne: 12 − 6.", en: "Subtract lions from monkeys: 12 − 6." },
    misconception: "watson_mean",
  },
  {
    id: "r_l1_2", level: 1, gaise: "B", graphType: "bar",
    data: {
      title: { tr: "Dört ay boyunca satılan dondurma", ku: "Sê mehan dondurmeyên hatin firotin", en: "Ice cream sold over 4 months" },
      categories: { tr: ["Haz", "Tem", "Ağu", "Eyl"], ku: ["Hez", "Tîr", "Tebax", "Îlon"], en: ["Jun", "Jul", "Aug", "Sep"] },
      values: [40, 80, 90, 30],
      yLabel: { tr: "Kutu", ku: "Qutî", en: "Boxes" },
    },
    q: { tr: "Temmuzda satılan dondurma, Haziran'a göre kaç kat fazladır?", ku: "Li gor Hezîranê, dondurmeya di Tîrmehê de çend qat zêdetir hatiye firotin?", en: "How many times more ice cream was sold in July vs June?" },
    opts: { tr: ["1.5 kat", "2 kat", "3 kat", "4 kat"], ku: ["1.5 qat", "2 qat", "3 qat", "4 qat"], en: ["1.5x", "2x", "3x", "4x"] },
    correct: 1,
    hint: { tr: "Tem: 80, Haz: 40. Oran: 80 ÷ 40 = 2.", ku: "Tîr: 80, Hez: 40. Rêje: 80 ÷ 40 = 2.", en: "Jul: 80, Jun: 40. Ratio: 80 ÷ 40 = 2." },
  },
  {
    id: "r_l1_3", level: 1, gaise: "B", graphType: "bar",
    data: {
      title: { tr: "Öğrencilerin bir haftada harcadıkları", ku: "Mesrefên hefteyî yên xwendekaran", en: "Weekly spending of students" },
      categories: { tr: ["Ayşe", "Burak", "Ceren", "Deniz"], ku: ["Ayşe", "Burak", "Ceren", "Deniz"], en: ["Ayse", "Burak", "Ceren", "Deniz"] },
      values: [25, 40, 15, 30],
      unit: { tr: "TL", ku: "TL", en: "USD" },
      yLabel: { tr: "Harcama", ku: "Mesref", en: "Spending" },
    },
    q: { tr: "Dört arkadaş toplam kaç TL harcamış?", ku: "Çar heval bi hev re çend TL mesref kirine?", en: "How much did all four spend in total?" },
    opts: { tr: ["95", "100", "110", "125"], ku: ["95", "100", "110", "125"], en: ["95", "100", "110", "125"] },
    correct: 2,
    hint: { tr: "Hepsini topla: 25 + 40 + 15 + 30 = ?", ku: "Hemûyan kom bike: 25 + 40 + 15 + 30 = ?", en: "Add them all: 25 + 40 + 15 + 30 = ?" },
  },
  {
    id: "r_l1_4", level: 1, gaise: "B", graphType: "bar",
    data: {
      title: { tr: "Haftalık sıcaklık (°C)", ku: "Germahiya heftîyane (°C)", en: "Weekly temperature (°C)" },
      categories: { tr: ["Pzt", "Sal", "Çar", "Per", "Cum"], ku: ["Dş", "Sê", "Ça", "Pê", "În"], en: ["Mon", "Tue", "Wed", "Thu", "Fri"] },
      values: [18, 22, 25, 20, 15],
    },
    q: { tr: "En sıcak ve en soğuk gün arasındaki fark (aralık) kaç derecedir?", ku: "Di navbera roja herî germ û herî sar de cudahî çend derece ye?", en: "What is the range (difference between hottest and coldest)?" },
    opts: { tr: ["5°", "7°", "10°", "12°"], ku: ["5°", "7°", "10°", "12°"], en: ["5°", "7°", "10°", "12°"] },
    correct: 2,
    hint: { tr: "Aralık = En büyük − En küçük = 25 − 15.", ku: "Berfirehî = Herî mezin − Herî biçûk = 25 − 15.", en: "Range = Max − Min = 25 − 15." },
  },

  // ────── L2 — VERİ ÖTESİNİ OKU (tahmin, yorum) ──────
  {
    id: "r_l2_1", level: 2, gaise: "B", graphType: "bar",
    data: {
      title: { tr: "Her yıl satılan telefon (bin adet)", ku: "Her sal telefonên tên firotin (hezar heb)", en: "Phones sold per year (thousands)" },
      categories: { tr: ["2020", "2021", "2022", "2023", "2024"], ku: ["2020", "2021", "2022", "2023", "2024"], en: ["2020", "2021", "2022", "2023", "2024"] },
      values: [20, 35, 50, 68, 85],
    },
    q: { tr: "Eğilim (trend) devam ederse 2025'te yaklaşık kaç bin telefon satılır?", ku: "Ger meyl berdewam be, di 2025 de çend hezar telefon tê firotin?", en: "If trend continues, how many (thousands) might sell in 2025?" },
    opts: { tr: ["60", "80", "100", "150"], ku: ["60", "80", "100", "150"], en: ["60", "80", "100", "150"] },
    correct: 2,
    hint: { tr: "Her yıl artış yaklaşık 15-17 bin. 85 + ~15 ≈ 100.", ku: "Her sal zêdebûn nêzî 15-17 hezar e. 85 + ~15 ≈ 100.", en: "Each year grows by ~15-17k. 85 + ~15 ≈ 100." },
  },
  {
    id: "r_l2_2", level: 2, gaise: "B", graphType: "bar",
    data: {
      title: { tr: "Sınıftaki 20 öğrencinin sevdiği spor", ku: "Sporên xwendekarên sinifê", en: "Sports liked by 20 students" },
      categories: { tr: ["Futbol", "Basketbol", "Voleybol", "Yüzme"], ku: ["Futbol", "Basketbol", "Voleybol", "Ajne"], en: ["Soccer", "Basketball", "Volleyball", "Swimming"] },
      values: [8, 5, 3, 4],
    },
    q: { tr: "400 kişilik okulda yaklaşık kaç öğrenci futbol sever?", ku: "Di dibistanek 400 kesî de nêzî çend xwendekar ji futbolê hez dikin?", en: "In a 400-student school, about how many might like soccer?" },
    opts: { tr: ["80", "120", "160", "200"], ku: ["80", "120", "160", "200"], en: ["80", "120", "160", "200"] },
    correct: 2,
    hint: { tr: "Sınıfta 20/20 = 8/20 = %40 futbol sever. 400 × 40/100 = 160.", ku: "Di sinifê de 8/20 = %40. 400 × %40 = 160.", en: "8/20 = 40% like soccer. 40% of 400 = 160." },
    misconception: "kahneman_small_sample",
  },
  {
    id: "r_l2_3", level: 2, gaise: "B", graphType: "bar",
    data: {
      title: { tr: "Bir torbadaki renkli bilyeler", ku: "Bilyên rengîn di tûrikekê de", en: "Colored marbles in a bag" },
      categories: { tr: ["Kırmızı", "Mavi", "Yeşil", "Sarı"], ku: ["Sor", "Şîn", "Kesk", "Zer"], en: ["Red", "Blue", "Green", "Yellow"] },
      values: [5, 10, 3, 2],
    },
    q: { tr: "Torbadan rastgele bilye çekince en olası renk hangisidir?", ku: "Ji tûrikê bilyeyek rasthatî bê kişandin, kîjan reng herî muhtemel e?", en: "If you draw randomly, which color is most likely?" },
    opts: { tr: ["Kırmızı", "Mavi", "Yeşil", "Sarı"], ku: ["Sor", "Şîn", "Kesk", "Zer"], en: ["Red", "Blue", "Green", "Yellow"] },
    correct: 1,
    hint: { tr: "En çok olan renk (en uzun çubuk) en olası renktir. 10 mavi var, diğerlerinden fazla.", ku: "Rengê herî pir (dariké herî dirêj) herî muhtemel e.", en: "Most common color (tallest bar) is most likely. 10 blue > others." },
  },

  // ────── L3 — VERİNİN ARKASINI OKU (eleştirel, yanıltma) ──────
  {
    id: "r_l3_1", level: 3, gaise: "C", graphType: "bar",
    truncated: true, // Kesik y-ekseni!
    data: {
      title: { tr: "Şirket X'in satışları — '%50 arttı!'", ku: "Firotina Pargîdaniya X — '%50 zêde bûye!'", en: "Company X sales — 'up 50%!'" },
      categories: { tr: ["2022", "2023"], ku: ["2022", "2023"], en: ["2022", "2023"] },
      values: [100, 102],
    },
    q: { tr: "Bu grafik satışların %50 arttığını iddia ediyor. Gerçek artış yüzde kaçtır?", ku: "Ev grafîk dibêje firotin %50 zêde bûye. Zêdebûna rastî çi ye?", en: "The graph claims 50% increase. What's the real increase?" },
    opts: { tr: ["%2", "%20", "%50", "%200"], ku: ["%2", "%20", "%50", "%200"], en: ["~2%", "~20%", "50%", "200%"] },
    correct: 0,
    hint: { tr: "Y-ekseni 100'den başlıyor (truncated). Gerçek artış: 2/100 = %2. Grafik görsel olarak yanıltıyor.", ku: "Eksena Y ji 100 dest pê dike. Zêdebûna rastî: 2/100 = %2.", en: "Y-axis starts at 100 (truncated). Real: 2/100 = 2%. Misleading!" },
    misconception: "huff_truncated_axis",
  },
  {
    id: "r_l3_2", level: 3, gaise: "C", graphType: "bar",
    data: {
      title: { tr: "'En popüler mobil uygulama' — bir haber sitesi anketi", ku: "'Sepana herî populer' — anketa malperekê ya haberan", en: "'Most popular app' — from a news site survey" },
      categories: { tr: ["A", "B", "C", "D"], ku: ["A", "B", "C", "D"], en: ["A", "B", "C", "D"] },
      values: [45, 28, 15, 12],
    },
    q: { tr: "Bu ankete haber sitesine GELEN kişiler cevap verdi. Sonuç neden tüm dünya için geçerli OLMAYABİLİR?", ku: "Bersiva anketê tenê kesên serdana malperê ya nûçeyan dan. Çima ji bo tevahiya cîhanê ne derbasdar e?", en: "Only news-site visitors answered. Why might this NOT represent the world?" },
    opts: {
      tr: ["Örneklem yanlı — sadece haber okuyanlar cevapladı", "Grafik yanlış çizilmiş", "Renkler karışık", "Sorun yok, sonuç geçerli"],
      ku: ["Nimûne alîgir e — tenê xwîneriyên haberan bersiv dan", "Grafîk xelet hatiye xêzkirin", "Reng tevlihev in", "Ne pirsgirêk e"],
      en: ["Sample bias — only news readers", "Graph drawn wrong", "Colors confusing", "No problem"],
    },
    correct: 0,
    hint: { tr: "Haber sitesi ziyaretçileri ≠ tüm dünya. Mesela çocuklar ya da yaşlılar az temsil edilebilir. Bu örneklem yanlılığıdır.", ku: "Serdaniyên nûçeyan ≠ tevahiya cîhanê. Ev aliyê nimûneyê ye.", en: "News visitors ≠ whole world. Kids, elders underrepresented. Sample bias." },
    misconception: "sample_bias",
  },
  {
    id: "r_l3_3", level: 3, gaise: "C", graphType: "bar",
    data: {
      title: { tr: "Okul A ve Okul B notları", ku: "Notên Dibistana A û Dibistana B", en: "School A vs B grades" },
      categories: { tr: ["Okul A", "Okul B"], ku: ["Dibistan A", "Dibistan B"], en: ["School A", "School B"] },
      values: [78, 82],
    },
    q: { tr: "Bir gazete 'Okul B çok daha iyi!' diye yazıyor. Bu iddia için daha fazla ne bilmemiz gerekir?", ku: "Rojname dibêje 'Dibistana B pir çêtir e!'. Ji bo vê daxuyaniyê em çi zêdetir bizanin divê?", en: "A newspaper says 'School B is much better!'. What more do we need to know?" },
    opts: {
      tr: ["Aradaki fark sadece 4 puan — az fark olabilir, ayrıca kaç öğrenci, hangi konu?", "Fark çoktur, gazete haklı", "Renkler yanlış", "Grafik gereksizdir"],
      ku: ["Cudahî tenê 4 xal e — kêm e; çend xwendekar, kîjan mijar?", "Cudahî pir e", "Reng xelet in", "Grafîk ne lazim e"],
      en: ["Only 4-point diff — small; how many students, which subject?", "Difference is huge", "Colors wrong", "Graph unnecessary"],
    },
    correct: 0,
    hint: { tr: "4 puan azdır. Örneklem büyüklüğü, konu, öğrenci profili gibi bağlamı bilmeden 'çok daha iyi' demek yanıltıcıdır.", ku: "Cudahiya 4 xalan kêm e. Bêyî zanebûna girîng, gotina 'pir çêtir' xapînok e.", en: "4 points is small. Without context (sample size, subject, demographics), 'much better' is misleading." },
  },
];

// ═══════════════════════════════════════════════════════════════════
// GRAFİK OKUMA MODÜLÜ (ReadModule) — quiz akışı + grafik render

export const DECEPTION_CASES = [
  {
    id: "dec_trunc",
    issueType: "truncated_axis",
    source: "Huff 1954, Bölüm 5",
    misconception: "huff_truncated_axis",
    title: { tr: "Gelirler uçuşa geçti!", ku: "Dahat fire bû!", en: "Profits skyrocketing!" },
    badData: {
      title: { tr: "Şirket geliri (milyon TL)", ku: "Dahata pargîdanî (mîlyon TL)", en: "Company revenue (M USD)" },
      categories: { tr: ["2022", "2023"], ku: ["2022", "2023"], en: ["2022", "2023"] },
      values: [100, 103],
      yLabel: { tr: "Gelir", ku: "Dahat", en: "Revenue" },
    },
    badTruncated: true,
    goodData: {
      title: { tr: "Aynı veri, sıfırdan başlayan eksen", ku: "Heman dane, eksen ji sifirê", en: "Same data, zero-based axis" },
      categories: { tr: ["2022", "2023"], ku: ["2022", "2023"], en: ["2022", "2023"] },
      values: [100, 103],
      maxHint: 120,
    },
    question: { tr: "Bu grafikte ne yanıltıyor?", ku: "Di vê grafîkê de çi xapandinê dike?", en: "What is misleading in this graph?" },
    options: {
      tr: ["Y-ekseni 0'dan başlamıyor — %3 artışı çok büyük gösteriyor", "Çubuk renkleri yanlış", "Başlık eksik", "Sorun yok"],
      ku: ["Eksena Y ji 0 dest nake — zêdebûna %3 mezin xuya dike", "Rengê darikan xelet e", "Sernav kêm e", "Ne pirsgirêk e"],
      en: ["Y-axis doesn't start at 0 — makes 3% look huge", "Bar colors wrong", "Title missing", "No problem"],
    },
    correct: 0,
    explanation: {
      tr: "Y-ekseni 100'de başlıyor. Gerçek artış 3/100 = %3 ama grafikte 2023 çubuğu 2022'ninkinden 3-4 kat uzun görünüyor. Sıfırdan başlayan eksende gerçek resmi görüyorsunuz.",
      ku: "Eksena Y ji 100 dest pê dike. Zêdebûna rastî %3 e lê grafîk 3-4 qat mezintir nîşan dide. Di eksena ji 0 de rastî xuya dibe.",
      en: "Y-axis starts at 100. Real change is 3%, but the 2023 bar looks 3-4x bigger. Zero-based axis shows the truth.",
    },
  },
  {
    id: "dec_scale",
    issueType: "bad_scale",
    source: "Huff 1954, Bölüm 6",
    misconception: "huff_truncated_axis",
    title: { tr: "İki okul — hangisi iyi?", ku: "Du dibistan — kîjan baştir?", en: "Two schools — which is better?" },
    badData: {
      title: { tr: "Okul ortalaması", ku: "Navgîniya dibistanan", en: "School average" },
      categories: { tr: ["Okul A", "Okul B"], ku: ["Dibistan A", "Dibistan B"], en: ["School A", "School B"] },
      values: [78, 82],
      maxHint: 83,
    },
    badTruncated: true,
    goodData: {
      title: { tr: "Aynı veri, uygun ölçek", ku: "Heman dane, pîvana rast", en: "Same data, proper scale" },
      categories: { tr: ["Okul A", "Okul B"], ku: ["Dibistan A", "Dibistan B"], en: ["School A", "School B"] },
      values: [78, 82],
      maxHint: 100,
    },
    question: { tr: "Kötü grafik neyi abartıyor?", ku: "Grafîka xelet çi mubalaga dike?", en: "What is the bad graph exaggerating?" },
    options: {
      tr: ["Küçük (4 puanlık) bir farkı büyük bir fark gibi gösteriyor", "Okulların adlarını", "Renkleri", "Başlığı"],
      ku: ["Cudahiyeke biçûk (4 xal) wek cudahiyeke mezin nîşan dide", "Navên dibistanan", "Rengan", "Sernavê"],
      en: ["Makes a tiny 4-point difference look big", "School names", "Colors", "Title"],
    },
    correct: 0,
    explanation: {
      tr: "78 ile 82 arasında sadece 4 puan var (%5 fark). Ama grafikte Okul B çubuğu Okul A'dan iki kat uzun görünebilir. Uygun ölçek (0-100) gerçek farkı gösterir.",
      ku: "Di navbera 78 û 82 de tenê 4 xal hene. Lê grafîk B du qat mezintir nîşan dide. Pîvana 0-100 rastî nîşan dide.",
      en: "There's only 4 points between 78 and 82 (5%). But B looks twice as tall. Proper 0-100 scale shows reality.",
    },
  },
  {
    id: "dec_sample",
    issueType: "sample_bias",
    source: "Wainer 1984",
    misconception: "sample_bias",
    title: { tr: "'Müşterilerimizin %90'ı memnun!'", ku: "'%90 müşteriyên me razî ne!'", en: "'90% of our customers are happy!'" },
    badData: {
      title: { tr: "Müşteri memnuniyeti anketi", ku: "Anketa memnuniyeta müşterî", en: "Customer satisfaction survey" },
      categories: { tr: ["Memnun", "Memnun Değil"], ku: ["Razî", "Ne Razî"], en: ["Happy", "Not Happy"] },
      values: [90, 10],
    },
    badNote: {
      tr: "Dikkat: Anket sadece şirketin mail listesindeki aktif müşterilere yollandı. Mutsuz olup ayrılanlara veya hiç cevaplamayanlara sorulmadı.",
      ku: "Balkêş: Anket tenê ji müşteriyên lîsteya mailê re hat şandin. Ji ên ne-razî ku çûne nehat pirsîn.",
      en: "Note: Survey only sent to active mail list members. Didn't ask those who left, or non-responders.",
    },
    goodData: null, // Düzeltme grafiği yok — düzeltme veri toplama yöntemi
    question: { tr: "Bu istatistikteki asıl sorun nedir?", ku: "Pirsgirêka rastî di vê statîstîkê de çi ye?", en: "What's the real problem here?" },
    options: {
      tr: ["Örneklem yanlı: sadece mutlu müşteriler cevapladı", "%90 çok yüksek görünüyor", "Soru sayısı az", "Renkler yanlış"],
      ku: ["Nimûne alîgir e: tenê ên razî bersivan dan", "%90 pir zêde xuya dike", "Hejmara pirsan kêm e", "Reng xelet in"],
      en: ["Sample bias: only happy customers replied", "90% looks too high", "Not enough questions", "Colors wrong"],
    },
    correct: 0,
    explanation: {
      tr: "Anket sadece aktif müşterilere gitti → zaten şirketten ayrılanlar dahil edilmedi. Ayrıca mutsuz olanların cevap verme ihtimali daha düşük. Bu 'seçim yanlılığı' (selection bias) ve sonucu abartılı memnuniyete yönlendirir.",
      ku: "Anket tenê ji aktîf müşteriyan re hat şandin. Ên ne-razî êdî derketî bûn. Ev 'aliyê hilbijartinê' ye.",
      en: "Survey only went to active customers → those who left excluded. Unhappy users less likely to respond. This is 'selection bias' — inflates happiness.",
    },
  },
  {
    id: "dec_3d_pie",
    issueType: "distorted_perspective",
    source: "Tufte 2001",
    misconception: "huff_pie_3d",
    title: { tr: "3B pasta grafik — öndeki dilim büyük görünür", ku: "Keka 3B — parça pêş mezintir xuya dike", en: "3D pie — front slice looks bigger" },
    badData: {
      title: { tr: "Bölge satış payları", ku: "Parên firotinê yên herêmê", en: "Regional sales share" },
      categories: { tr: ["Kuzey", "Güney", "Doğu", "Batı"], ku: ["Bakur", "Başûr", "Rojhilat", "Rojava"], en: ["North", "South", "East", "West"] },
      values: [25, 25, 25, 25],
    },
    badTruncated: false,
    badPie3DHint: true, // Özel uyarı için
    goodData: {
      title: { tr: "Aynı veri — 2B çubuk grafik", ku: "Heman dane — darik 2B", en: "Same data — 2D bars" },
      categories: { tr: ["Kuzey", "Güney", "Doğu", "Batı"], ku: ["Bakur", "Başûr", "Rojhilat", "Rojava"], en: ["North", "South", "East", "West"] },
      values: [25, 25, 25, 25],
      maxHint: 40,
    },
    question: { tr: "3B pasta grafikte hangi yanılgı gizlidir?", ku: "Di keka 3B de kîjan xapandin heye?", en: "What's hidden in a 3D pie chart?" },
    options: {
      tr: ["Öndeki dilim perspektiften büyük görünür — eşit paylar eşit algılanmaz", "Renkler yanlış", "Dilim sayısı az", "Başlık eksik"],
      ku: ["Parça pêş ji perspektîfê mezintir xuya dike — par wekhev nayên dîtin", "Reng xelet in", "Hejmara parçeyan kêm", "Sernav kêm"],
      en: ["Front slice looks bigger due to perspective — equal shares misperceived", "Colors wrong", "Too few slices", "Missing title"],
    },
    correct: 0,
    explanation: {
      tr: "4 bölgenin satış payı EŞİT (her biri %25). Ama 3B pasta grafikte kameraya yakın olan dilim (öndeki) daha büyük görünür. 2B çubuk grafik gerçek eşitliği gösterir. Tufte: 'Chartjunk' gereksiz süslerdir, bilgiyi çarpıtır.",
      ku: "Her parçe %25 ye. Lê di 3B de yê nêzîkê kamerayê mezintir xuya dike. 2B darik rastî nîşan dide.",
      en: "All 4 regions are equal (25% each). But 3D perspective makes the front look bigger. 2D bars show the truth. Tufte: 'Chartjunk' distorts data.",
    },
  },
  {
    id: "dec_cherry",
    issueType: "cherry_picked",
    source: "Huff 1954, Bölüm 3",
    title: { tr: "'Sıcaklıklar düşüyor!' — sadece 3 yıl seçilmiş", ku: "'Germahî kêm dibe!' — tenê 3 sal", en: "'Temperatures dropping!' — only 3 years picked" },
    badData: {
      title: { tr: "Yıllık ortalama sıcaklık (°C) — 2021-2023", ku: "Germahiya navîn ya salî — 2021-2023", en: "Annual avg temp — 2021-2023" },
      categories: { tr: ["2021", "2022", "2023"], ku: ["2021", "2022", "2023"], en: ["2021", "2022", "2023"] },
      values: [15.2, 15.0, 14.8],
      maxHint: 15.5,
    },
    badTruncated: true,
    goodData: {
      title: { tr: "Aynı bölge — 20 yıllık tüm veri", ku: "Heman herêm — daneyên 20 salan", en: "Same region — full 20-year data" },
      categories: { tr: ["2003", "2008", "2013", "2018", "2023"], ku: ["2003", "2008", "2013", "2018", "2023"], en: ["2003", "2008", "2013", "2018", "2023"] },
      values: [13.8, 14.2, 14.6, 14.9, 14.8],
      maxHint: 16,
    },
    question: { tr: "Kötü grafik nasıl yanıltıyor?", ku: "Grafîka xelet çawa xapandinê dike?", en: "How does the bad graph mislead?" },
    options: {
      tr: ["Sadece küçük bir pencere (3 yıl) seçilmiş — uzun vadeli artış gizlenmiş", "Çubuk sayısı fazla", "Renk seçimi kötü", "Başlık uzun"],
      ku: ["Tenê pencereyeke biçûk (3 sal) hatiye hilbijartin — artîşa dirêj-demî veşartî ye", "Hejmara darikan zêde ye", "Reng xerab in", "Sernav dirêj e"],
      en: ["Only a tiny window (3 years) selected — long-term rise hidden", "Too many bars", "Bad color choice", "Long title"],
    },
    correct: 0,
    explanation: {
      tr: "2021-2023 arasında küçük bir azalış var (15.2 → 14.8) ama 20 yıllık grafik gösteriyor ki sıcaklıklar GENEL OLARAK artmış (13.8 → 14.8). Kısa zaman dilimi seçerek (cherry-picking) gerçek trend gizlenebilir.",
      ku: "Di 3 salan de kêmbûneke biçûk heye, lê di 20 salan de artîş heye. Hilbijartina dema kurt trendê veşêre.",
      en: "There's a small drop 2021-2023, but 20-year data shows temperatures HAVE risen overall. Picking short windows hides real trends.",
    },
  },
];

// ═══════════════════════════════════════════════════════════════════
// DECEIVE MODULE — Yanıltma Avı (L3 odaklı, her seviyeden öğrenci görebilir)

export const REAL_DATASETS = [
  {
    id: "tr_pop_cities",
    title: { tr: "Türkiye'nin En Kalabalık 5 İli", ku: "5 Bajarên Herî Qelebalix ên Tirkiyê", en: "Turkey's 5 Most Populous Cities" },
    chartType: "bar",
    data: {
      categories: ["İstanbul", "Ankara", "İzmir", "Bursa", "Antalya"],
      values: [15.70, 5.86, 4.49, 3.24, 2.72], // milyon
    },
    unit: { tr: "milyon kişi", ku: "mîlyon kes", en: "million people" },
    yLabel: { tr: "Nüfus (milyon)", ku: "Nifûs (mîlyon)", en: "Population (M)" },
    source: "TÜİK ADNKS 2024",
    sourceUrl: "https://www.tuik.gov.tr",
    date: "31.12.2024",
    context: {
      tr: "TÜİK Adrese Dayalı Nüfus Kayıt Sistemi'nden. Toplam Türkiye nüfusu: 85,66 milyon. İstanbul tek başına bu nüfusun %18,3'ünü barındırıyor — bu oran Belçika, Yunanistan, Çekya'dan fazla!",
      ku: "Ji Sîstema Tomarkirina Nifûsa Tirkiyê. Nifûsa giştî ya Tirkiyê: 85.66 mîlyon. Tenê Stenbol %18.3.",
      en: "From Turkish Statistical Institute's address-based registry. Turkey's total population: 85.66M. Istanbul alone is 18.3% — more than Belgium, Greece, Czechia!",
    },
    questions: {
      tr: ["En kalabalık il kaç milyon kişiye sahip?", "İstanbul + Ankara toplam kaç milyon eder?", "5 ilin toplamı Türkiye nüfusunun yüzde kaçı?"],
      ku: ["Bajarê herî qelebalix çend mîlyon kes heye?", "Stenbol + Enqere çend mîlyon e?", "Tevahiya 5 bajaran çi ji sedî ye?"],
      en: ["How many millions is the largest city?", "Istanbul + Ankara sum?", "What % of Turkey do these 5 cities hold?"],
    },
  },
  {
    id: "ankara_temp_monthly",
    title: { tr: "Ankara Aylık Ortalama Sıcaklık", ku: "Germahiya Navîn a Meha Enqere", en: "Ankara Monthly Avg. Temperature" },
    chartType: "line",
    data: {
      categories: ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"],
      values: [0.9, 2.7, 6.7, 11.5, 16.5, 20.6, 24.2, 24.3, 19.6, 13.9, 7.3, 2.8],
    },
    unit: "°C",
    yLabel: { tr: "Sıcaklık (°C)", ku: "Germahî (°C)", en: "Temperature (°C)" },
    source: "MGM 1991-2020 Normalleri",
    sourceUrl: "https://mgm.gov.tr",
    date: "1991-2020 ortalamaları",
    context: {
      tr: "Meteoroloji Genel Müdürlüğü'nün 30 yıllık iklim normalleri. Dikkat: Bu UZUN DÖNEM ORTALAMASIDIR — tek bir yılın ölçümü değil. Karasal iklim tipik örüntüsü: ocakta donma noktasına yakın, temmuzda 24°C.",
      ku: "Normalên avayê yên 30 salan. Havîna Enqere germ, zivistana wê sar.",
      en: "30-year climate normals from Turkish State Meteorological Service. Note: LONG-TERM AVERAGE, not single-year measurement. Continental climate: January near freezing, July 24°C.",
    },
    questions: {
      tr: ["En sıcak ay hangisi?", "En soğuk iki ayın farkı kaç derece?", "Yıllık sıcaklık aralığı (max - min) kaç?"],
      ku: ["Meha herî germ kîjan e?", "Cudahiya du mehan ên herî sar çiqas e?", "Berfirehiya salane çend derece ye?"],
      en: ["Which month is hottest?", "Difference between two coldest months?", "Annual temperature range?"],
    },
  },
  {
    id: "ankara_rain_monthly",
    title: { tr: "Ankara Aylık Yağış Miktarı", ku: "Baranê Mehane a Enqere", en: "Ankara Monthly Precipitation" },
    chartType: "bar",
    data: {
      categories: ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"],
      values: [38.6, 36.6, 46.9, 44.5, 51.0, 40.2, 14.8, 14.6, 17.9, 33.4, 31.9, 43.2],
    },
    unit: "mm",
    yLabel: { tr: "Yağış (mm)", ku: "Baran (mm)", en: "Rainfall (mm)" },
    source: "MGM 1991-2020 Normalleri",
    sourceUrl: "https://mgm.gov.tr",
    date: "1991-2020 ortalamaları",
    context: {
      tr: "Ankara yıllık toplam yağış: ~413 mm (çok kurak). En yağışlı ay mayıs (51 mm), en kurak ağustos (14.6 mm). Karasal iklim tipik: yaz kuraklığı belirgin. İstanbul yıllık yağış ~800 mm!",
      ku: "Baranê salane ya Enqere ~413 mm — pir zuha. Mehê herî baranê Gulan, herî zuha Tebax.",
      en: "Ankara total annual rain ~413 mm (very dry). Wettest May (51 mm), driest August (14.6 mm). Istanbul gets ~800 mm/year!",
    },
    questions: {
      tr: ["En çok yağış hangi ayda?", "Yaz aylarının (Haz-Tem-Ağu) toplamı kaç mm?", "Yaz aylarının yıllık payı yüzde kaç?"],
      ku: ["Di kîjan mehê de baranê herî zêde?", "Tevahiya havînê çend mm e?", "Havîn ji sedî yê salane çend e?"],
      en: ["Which month has most rain?", "Summer total (Jun-Jul-Aug)?", "Summer's % of annual total?"],
    },
  },
  {
    id: "tr_pisa_2022",
    title: { tr: "Türkiye PISA 2022 Puanları", ku: "Nîşaneyên PISA 2022 ên Tirkiyê", en: "Turkey PISA 2022 Scores" },
    chartType: "bar",
    data: {
      categories: {
        tr: ["Matematik TR", "Matematik OECD", "Fen TR", "Fen OECD", "Okuma TR", "Okuma OECD"],
        ku: ["Mat. TR", "Mat. OECD", "Fen TR", "Fen OECD", "Xwendin TR", "Xwendin OECD"],
        en: ["Math TR", "Math OECD", "Science TR", "Science OECD", "Reading TR", "Reading OECD"],
      },
      values: [453, 472, 476, 485, 456, 476],
    },
    unit: { tr: "puan", ku: "nîşane", en: "points" },
    yLabel: { tr: "PISA puanı", ku: "Nîşane", en: "Score" },
    source: "OECD PISA 2022 / MEB",
    sourceUrl: "https://pisa.meb.gov.tr",
    date: "2022 (81 ülke)",
    context: {
      tr: "15 yaş öğrencilerin beceri değerlendirmesi. Türkiye 81 ülke arasında matematik 39., fen 34., okuma 36. sırada. 2018'e göre: matematik aynı (-1), fen artmış (+8), okuma azalmış (-10). OECD ortalaması ile fark azaldı ama hâlâ altta.",
      ku: "Nirxandina becerayên xwendekarên 15-salî. Tirkiye di navbera 81 welatan de: mat. 39., fen 34., xwendin 36.",
      en: "15-year-old students' skills. Turkey out of 81: math 39th, science 34th, reading 36th. Closing OECD gap but still below.",
    },
    questions: {
      tr: ["Türkiye hangi alanda OECD'ye en yakın?", "Her üç alanda OECD - TR farkı ortalama kaç puan?", "Türkiye'nin en yüksek puanı hangi alanda?"],
      ku: ["Tirkiye di kîjan warî de nêzî OECD ye?", "Cudahiya navîn çend nîşane ye?", "Tirkiye di kîjan warî de nîşana herî zêde heye?"],
      en: ["Where is Turkey closest to OECD?", "Average gap across 3 subjects?", "Turkey's best score is in which subject?"],
    },
  },
];


export const SCATTER_DATASETS = [
  {
    id: "height_weight",
    curcioLevel: 3,
    title: { tr: "Öğrenci Boy ve Kilo", ku: "Bejn û Giraniya Xwendekaran", en: "Student Height and Weight" },
    xLabel: { tr: "Boy (cm)", ku: "Bejn (cm)", en: "Height (cm)" },
    yLabel: { tr: "Kilo (kg)", ku: "Giranî (kg)", en: "Weight (kg)" },
    description: {
      tr: "15 öğrencinin boy ve kilo ölçümleri. Boy arttıkça kilo artıyor mu?",
      ku: "Pîvanên bejn û giraniya 15 xwendekaran. Gava bejn mezin dibe, giranî jî mezin dibe?",
      en: "Height and weight of 15 students. Does weight increase with height?",
    },
    points: [
      { x: 140, y: 35 }, { x: 145, y: 40 }, { x: 148, y: 42 },
      { x: 150, y: 45 }, { x: 152, y: 47 }, { x: 155, y: 48 },
      { x: 158, y: 52 }, { x: 160, y: 55 }, { x: 162, y: 54 },
      { x: 165, y: 58 }, { x: 168, y: 62 }, { x: 170, y: 65 },
      { x: 172, y: 68 }, { x: 175, y: 70 }, { x: 178, y: 72 },
    ],
    expectedR: 0.98,
    causal: true,
    lesson: {
      tr: "Güçlü pozitif korelasyon — BU sefer nedensellik MANTIKLI (boy büyümesi kemik/kas kütlesini artırır). Ama dikkat: korelasyon tek başına nedensellik kanıtlamaz.",
      ku: "Têkiliya pozîtîf û bihêz — cardinê ev mentîqî ye (bejn mezin dibe, kemik û masûlke jî mezin dibin).",
      en: "Strong positive correlation — causation IS plausible here (height growth means more bone/muscle). But correlation alone doesn't prove causation.",
    },
  },
  {
    id: "ice_cream_drown",
    curcioLevel: 3,
    title: { tr: "Dondurma Satışı ve Boğulma Olayları", ku: "Firotina Dondurmê û Bûyerên Xeniqînê", en: "Ice Cream Sales vs Drownings" },
    xLabel: { tr: "Aylık dondurma (bin adet)", ku: "Dondurma meha (hezar)", en: "Ice cream per month (000s)" },
    yLabel: { tr: "Boğulma olayı sayısı", ku: "Hejmara xeniqînan", en: "Drowning incidents" },
    description: {
      tr: "12 aydaki dondurma satışı ve havuz/deniz boğulma olayları. Dondurma boğulmaya mı yol açıyor?!",
      ku: "Dondurma û xeniqîn — bi hev re diçin. Lê çima?",
      en: "Ice cream sales and drownings over 12 months. Does ice cream CAUSE drownings?!",
    },
    points: [
      { x: 10, y: 2 }, { x: 12, y: 3 }, { x: 18, y: 5 },
      { x: 25, y: 7 }, { x: 40, y: 12 }, { x: 55, y: 16 },
      { x: 70, y: 20 }, { x: 68, y: 19 }, { x: 50, y: 14 },
      { x: 30, y: 8 }, { x: 15, y: 4 }, { x: 12, y: 3 },
    ],
    expectedR: 0.99,
    causal: false,
    lesson: {
      tr: "🚨 KLASİK YANILGIN — Güçlü korelasyon ama dondurma boğulmaya YOL AÇMIYOR! Üçüncü bir değişken (yaz sıcağı) HER İKİSİNİ DE etkiliyor: sıcak havada hem dondurma çok yenir, hem de insanlar suya girer. Bu 'gizli değişken' (confounder) sorunudur. Korelasyon ≠ Nedensellik.",
      ku: "Têkiliyek pir bihêz heye lê dondurma xeniqînê NE dibe sedem! Guherbareke sêyem (germa havînê) her du jî dixwîne.",
      en: "STRONG correlation but ice cream does NOT cause drowning! A third variable (summer heat) affects BOTH: hot weather → more ice cream AND more swimming. This is a 'confounder'. Correlation ≠ Causation.",
    },
  },
  {
    id: "study_grade",
    curcioLevel: 3,
    title: { tr: "Çalışma Saati ve Sınav Notu", ku: "Demê Xebatê û Nota Imtîhan", en: "Study Hours vs Exam Grade" },
    xLabel: { tr: "Haftalık çalışma saati", ku: "Saetên xebatê heftî", en: "Study hours/week" },
    yLabel: { tr: "Sınav notu (100 üzerinden)", ku: "Nota imtîhan (ji 100)", en: "Exam grade (out of 100)" },
    description: {
      tr: "20 öğrenci — ne kadar çalışırsan o kadar not mu alırsın?",
      ku: "20 xwendekar — her ku zêdetir xebatê bikî, zêdetir nota distînî?",
      en: "20 students — does more study mean higher grade?",
    },
    points: [
      { x: 1, y: 45 }, { x: 2, y: 52 }, { x: 3, y: 58 },
      { x: 3, y: 62 }, { x: 4, y: 65 }, { x: 5, y: 60 },
      { x: 5, y: 72 }, { x: 6, y: 75 }, { x: 7, y: 70 },
      { x: 7, y: 80 }, { x: 8, y: 78 }, { x: 9, y: 82 },
      { x: 10, y: 85 }, { x: 10, y: 88 }, { x: 11, y: 90 },
      { x: 12, y: 85 }, { x: 12, y: 92 }, { x: 13, y: 90 },
      { x: 14, y: 95 }, { x: 15, y: 94 },
    ],
    expectedR: 0.94,
    causal: true,
    lesson: {
      tr: "Güçlü pozitif korelasyon, nedensellik mantıklı — ama mükemmel değil. Bazı öğrenciler az çalışıp yüksek not, bazıları çok çalışıp düşük not alıyor. Çalışma saati TEK FAKTÖR değil (önceki bilgi, uyku, kaygı…).",
      ku: "Têkiliyek bihêz a pozîtîf. Lê ne tenê faktor e — zanîna berê, xew, fikar...",
      en: "Strong positive correlation; causation plausible — but not perfect. Study hours isn't the ONLY factor (prior knowledge, sleep, anxiety…).",
    },
  },
  {
    id: "screen_sleep",
    curcioLevel: 3,
    title: { tr: "Ekran Süresi ve Uyku", ku: "Demê Ekranê û Xew", en: "Screen Time vs Sleep" },
    xLabel: { tr: "Günlük ekran (saat)", ku: "Ekran rojane (saet)", en: "Daily screen (hours)" },
    yLabel: { tr: "Uyku süresi (saat)", ku: "Demê xewê (saet)", en: "Sleep duration (hours)" },
    description: {
      tr: "15 gencin ekran ve uyku süresi — ters ilişki var mı?",
      ku: "15 ciwan — dema ekranê û xewê — têkiliya beravajî heye?",
      en: "15 teens' screen and sleep hours — is there an inverse relationship?",
    },
    points: [
      { x: 1, y: 9 }, { x: 1.5, y: 9.2 }, { x: 2, y: 8.8 },
      { x: 2.5, y: 8.5 }, { x: 3, y: 8.3 }, { x: 3.5, y: 8 },
      { x: 4, y: 7.5 }, { x: 4.5, y: 7.8 }, { x: 5, y: 7 },
      { x: 5.5, y: 6.8 }, { x: 6, y: 6.5 }, { x: 7, y: 6 },
      { x: 7.5, y: 6.2 }, { x: 8, y: 5.5 }, { x: 9, y: 5 },
    ],
    expectedR: -0.96,
    causal: true,
    lesson: {
      tr: "Güçlü NEGATİF korelasyon — ekran süresi arttıkça uyku AZALIYOR. Neden olabilir mi? Araştırmalar evet diyor (mavi ışık melatonin salgısını bozuyor). Ama yine de tek başına korelasyon yeterli kanıt değildir.",
      ku: "Têkiliya negatîf a bihêz — dema ekranê bilind dibe, xew kêm dibe. Lê tenê têkilî kêfî kêfî kanît nîne.",
      en: "Strong NEGATIVE correlation — more screen, less sleep. Possible cause? Research says yes (blue light affects melatonin). But correlation alone isn't proof.",
    },
  },
  {
    id: "ankara_temp_rain",
    curcioLevel: 3,
    title: { tr: "Ankara: Sıcaklık vs Yağış (12 ay, GERÇEK VERİ)", ku: "Enqere: Germahî vs Baran (12 meh, DANEYÊN RASTÎN)", en: "Ankara: Temp vs Rain (12 months, REAL DATA)" },
    xLabel: { tr: "Ortalama sıcaklık (°C)", ku: "Germahiya navîn (°C)", en: "Avg temperature (°C)" },
    yLabel: { tr: "Aylık yağış (mm)", ku: "Baranê mehane (mm)", en: "Monthly rainfall (mm)" },
    description: {
      tr: "Meteoroloji Genel Müdürlüğü 1991-2020 Ankara normalleri. 12 ay, her ay bir nokta. Sıcaklık arttıkça yağış ne oluyor?",
      ku: "Normalên MGM 1991-2020. 12 meh. Germahî bilind dibe, baran çi dibe?",
      en: "Turkish State Meteorological Service 1991-2020 Ankara normals. 12 months, one point each. What happens to rain as temperature rises?",
    },
    // Her nokta bir ay (Ocak=0.9°C,38.6mm ... Ağustos=24.3°C,14.6mm ...)
    points: [
      { x: 0.9, y: 38.6, label: "Oca" },
      { x: 2.7, y: 36.6, label: "Şub" },
      { x: 6.7, y: 46.9, label: "Mar" },
      { x: 11.5, y: 44.5, label: "Nis" },
      { x: 16.5, y: 51.0, label: "May" },
      { x: 20.6, y: 40.2, label: "Haz" },
      { x: 24.2, y: 14.8, label: "Tem" },
      { x: 24.3, y: 14.6, label: "Ağu" },
      { x: 19.6, y: 17.9, label: "Eyl" },
      { x: 13.9, y: 33.4, label: "Eki" },
      { x: 7.3, y: 31.9, label: "Kas" },
      { x: 2.8, y: 43.2, label: "Ara" },
    ],
    expectedR: -0.65,
    causal: true,
    source: "MGM 1991-2020",
    lesson: {
      tr: "🇹🇷 GERÇEK VERİ — Ankara'nın KARASAL İKLİMİ: Sıcak yaz ayları (Temmuz-Ağustos) KURAK (~15 mm). Ilıman bahar ayları (Nisan-Mayıs) YAĞIŞLI (~45-51 mm). Negatif korelasyon mevsimsel döngüden. Bu Ankara'ya özgü — İstanbul'da ilişki çok daha zayıf (İstanbul'da yaz da yağışlı olabilir).",
      ku: "🇹🇷 DANEYÊN RASTÎN — Avayê karsal ê Enqere: havîn zuha, bihar baranê.",
      en: "🇹🇷 REAL DATA — Ankara's CONTINENTAL climate: hot summer (Jul-Aug) DRY (~15 mm), mild spring (Apr-May) WET (~45-51 mm). Negative correlation from seasonal cycle. Specific to Ankara — İstanbul pattern is different.",
    },
  },
];

// ═══════════════════════════════════════════════════════════════════
// İLİŞKİ MODÜLÜ — Saçılım grafiği + korelasyon + nedensellik pedagojisi

export const GRAPH_ICONS = {
  bar: (
    <svg viewBox="0 0 100 70" width="100" height="70">
      <line x1="8" y1="62" x2="96" y2="62" stroke="#64748b" strokeWidth="1.5"/>
      <line x1="8" y1="8" x2="8" y2="62" stroke="#64748b" strokeWidth="1.5"/>
      <rect x="15" y="30" width="12" height="32" fill="#3b82f6"/>
      <rect x="32" y="18" width="12" height="44" fill="#3b82f6"/>
      <rect x="49" y="38" width="12" height="24" fill="#3b82f6"/>
      <rect x="66" y="25" width="12" height="37" fill="#3b82f6"/>
      <rect x="83" y="44" width="12" height="18" fill="#3b82f6"/>
    </svg>
  ),
  line: (
    <svg viewBox="0 0 100 70" width="100" height="70">
      <line x1="8" y1="62" x2="96" y2="62" stroke="#64748b" strokeWidth="1.5"/>
      <line x1="8" y1="8" x2="8" y2="62" stroke="#64748b" strokeWidth="1.5"/>
      <polyline points="15,45 30,28 45,35 60,20 75,25 90,12"
        fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="15" cy="45" r="3" fill="#10b981"/>
      <circle cx="30" cy="28" r="3" fill="#10b981"/>
      <circle cx="45" cy="35" r="3" fill="#10b981"/>
      <circle cx="60" cy="20" r="3" fill="#10b981"/>
      <circle cx="75" cy="25" r="3" fill="#10b981"/>
      <circle cx="90" cy="12" r="3" fill="#10b981"/>
    </svg>
  ),
  pie: (
    <svg viewBox="0 0 100 70" width="100" height="70">
      <circle cx="50" cy="35" r="25" fill="#3b82f6"/>
      <path d="M 50 35 L 50 10 A 25 25 0 0 1 71.65 47.5 Z" fill="#ef4444"/>
      <path d="M 50 35 L 71.65 47.5 A 25 25 0 0 1 35 55 Z" fill="#10b981"/>
      <circle cx="50" cy="35" r="25" fill="none" stroke="#fff" strokeWidth="1"/>
    </svg>
  ),
  scatter: (
    <svg viewBox="0 0 100 70" width="100" height="70">
      <line x1="8" y1="62" x2="96" y2="62" stroke="#64748b" strokeWidth="1.5"/>
      <line x1="8" y1="8" x2="8" y2="62" stroke="#64748b" strokeWidth="1.5"/>
      {[[18,48],[25,42],[32,38],[40,30],[48,32],[55,24],[63,18],[72,22],[80,14],[88,12],[22,50],[36,40],[58,28],[75,18]].map((p, i) => (
        <circle key={i} cx={p[0]} cy={p[1]} r="3" fill="#8b5cf6" fillOpacity="0.75"/>
      ))}
    </svg>
  ),
  histogram: (
    <svg viewBox="0 0 100 70" width="100" height="70">
      <line x1="8" y1="62" x2="96" y2="62" stroke="#64748b" strokeWidth="1.5"/>
      <line x1="8" y1="8" x2="8" y2="62" stroke="#64748b" strokeWidth="1.5"/>
      {/* Bitişik çubuklar — bell shape */}
      <rect x="10" y="50" width="14" height="12" fill="#f59e0b" stroke="#fff" strokeWidth="0.5"/>
      <rect x="24" y="35" width="14" height="27" fill="#f59e0b" stroke="#fff" strokeWidth="0.5"/>
      <rect x="38" y="18" width="14" height="44" fill="#f59e0b" stroke="#fff" strokeWidth="0.5"/>
      <rect x="52" y="22" width="14" height="40" fill="#f59e0b" stroke="#fff" strokeWidth="0.5"/>
      <rect x="66" y="40" width="14" height="22" fill="#f59e0b" stroke="#fff" strokeWidth="0.5"/>
      <rect x="80" y="54" width="14" height="8" fill="#f59e0b" stroke="#fff" strokeWidth="0.5"/>
    </svg>
  ),
  dotplot: (
    <svg viewBox="0 0 100 70" width="100" height="70">
      <line x1="8" y1="60" x2="96" y2="60" stroke="#64748b" strokeWidth="1.5"/>
      {/* Sayı değerlerinin tekrar ettiği yığın */}
      {[1,2,2,3,3,3,3,4,4,4,4,4,5,5,5,5,6,6,6,7,7].map((v, i, arr) => {
        const x = 15 + v * 10;
        // Aynı x'te kaç tane önce geldi?
        const stack = arr.slice(0, i).filter(x => x === v).length;
        return <circle key={i} cx={x} cy={55 - stack * 6} r="2.5" fill="#ec4899"/>;
      })}
    </svg>
  ),
  boxplot: (
    <svg viewBox="0 0 100 70" width="100" height="70">
      <line x1="8" y1="62" x2="96" y2="62" stroke="#64748b" strokeWidth="1.5"/>
      {/* Kutu grafiği — bir tane yatay kutu */}
      <line x1="15" y1="30" x2="30" y2="30" stroke="#0891b2" strokeWidth="2"/> {/* Sol whisker */}
      <line x1="15" y1="23" x2="15" y2="37" stroke="#0891b2" strokeWidth="2"/> {/* Min */}
      <rect x="30" y="18" width="30" height="25" fill="none" stroke="#0891b2" strokeWidth="2"/> {/* Box */}
      <line x1="45" y1="18" x2="45" y2="43" stroke="#0891b2" strokeWidth="3"/> {/* Median */}
      <line x1="60" y1="30" x2="82" y2="30" stroke="#0891b2" strokeWidth="2"/> {/* Sağ whisker */}
      <line x1="82" y1="23" x2="82" y2="37" stroke="#0891b2" strokeWidth="2"/> {/* Max */}
    </svg>
  ),
  area: (
    <svg viewBox="0 0 100 70" width="100" height="70">
      <line x1="8" y1="62" x2="96" y2="62" stroke="#64748b" strokeWidth="1.5"/>
      <line x1="8" y1="8" x2="8" y2="62" stroke="#64748b" strokeWidth="1.5"/>
      <path d="M 15 50 L 30 35 L 45 40 L 60 25 L 75 30 L 90 15 L 90 62 L 15 62 Z"
        fill="#14b8a6" fillOpacity="0.4"/>
      <polyline points="15,50 30,35 45,40 60,25 75,30 90,15"
        fill="none" stroke="#0f766e" strokeWidth="2"/>
    </svg>
  ),
  heatmap: (
    <svg viewBox="0 0 100 70" width="100" height="70">
      {/* 4×4 grid, yoğunluk renkleri */}
      {[
        [0.2, 0.4, 0.6, 0.3],
        [0.5, 0.8, 0.9, 0.6],
        [0.3, 0.7, 1.0, 0.8],
        [0.1, 0.3, 0.5, 0.4],
      ].map((row, ri) => row.map((v, ci) => (
        <rect key={`${ri}${ci}`}
          x={15 + ci * 18} y={8 + ri * 13}
          width="17" height="12"
          fill={`rgba(220,38,38,${v})`} stroke="#fff" strokeWidth="0.5"/>
      )))}
    </svg>
  ),
  waffle: (
    <svg viewBox="0 0 100 70" width="100" height="70">
      {/* 10×5 grid, %40 dolu */}
      {Array.from({ length: 50 }).map((_, i) => {
        const col = i % 10;
        const row = Math.floor(i / 10);
        const filled = i < 22; // %44 dolu
        return (
          <rect key={i}
            x={15 + col * 7} y={15 + row * 7}
            width="5" height="5"
            fill={filled ? "#ef4444" : "#e5e7eb"}
            rx="0.5"/>
        );
      })}
    </svg>
  ),
};

export const GRAPH_TYPES = [
  {
    id: "bar",
    name: { tr: "Çubuk Grafik", ku: "Grafîka Darik", en: "Bar Chart" },
    bestFor: {
      tr: "Birkaç kategoriyi karşılaştırma (illerin nüfusu, en sevilen sporlar)",
      ku: "Berawirdkirina çend kategoriyan (nifûsa bajaran, werzîşên herî xoş)",
      en: "Comparing a few categories (city populations, favorite sports)",
    },
    whenNot: {
      tr: "Çok sayıda kategori (20+) olduğunda kalabalıklaşır",
      ku: "Gava gelek kategorî hebin, nehes dibe",
      en: "Becomes cluttered with many (20+) categories",
    },
    example: { tr: "Sınıfın sevdiği meyveler", ku: "Fêkiyên pola", en: "Class favorite fruits" },
  },
  {
    id: "line",
    name: { tr: "Çizgi Grafik", ku: "Grafîka Xetê", en: "Line Chart" },
    bestFor: {
      tr: "Zaman içinde değişim (aylık sıcaklık, yıllık nüfus artışı)",
      ku: "Guhertin bi demê re (germahiya mehane, mezinbûna nifûsê)",
      en: "Change over time (monthly temp, annual growth)",
    },
    whenNot: {
      tr: "Kategorik veri (sporlar, meyveler) için uygun DEĞİL",
      ku: "Ji bo daneyên kategorîk ne guncav e",
      en: "NOT for categorical data (fruits, sports)",
    },
    example: { tr: "Ankara 12 ay sıcaklık", ku: "Germahiya 12 mehan Enqere", en: "Ankara 12-month temp" },
  },
  {
    id: "pie",
    name: { tr: "Pasta Grafik", ku: "Grafîka Keka", en: "Pie Chart" },
    bestFor: {
      tr: "Bütünün 2-5 parçası (bütçe dağılımı, seçim sonucu)",
      ku: "Parçên giştiyê (2-5 beş)",
      en: "2-5 parts of a whole (budget split, vote results)",
    },
    whenNot: {
      tr: "6+ parça → pasta zor okunur. Çubuk daha iyi! Tam dağılımı gösterir ama rakamlar karıştırılır.",
      ku: "6+ parçe → tirşik zehmet xwendin. Darik çêtir e.",
      en: "6+ slices → unreadable. Use bar instead!",
    },
    example: { tr: "Sınıf mevcudu kız/erkek/diğer", ku: "Keç/xort", en: "Boys/girls ratio" },
  },
  {
    id: "scatter",
    name: { tr: "Saçılım Grafiği", ku: "Grafîka Belavbûnê", en: "Scatter Plot" },
    bestFor: {
      tr: "İKİ sayısal değişken ilişkisi (boy vs kilo, sıcaklık vs dondurma satışı)",
      ku: "Têkiliya du guherbaran",
      en: "Relationship between TWO numeric variables",
    },
    whenNot: {
      tr: "Tek değişken için uygun değil. Kategorik değişken çiftleri için de değil.",
      ku: "Ji bo tenê guherbarekî ne guncav",
      en: "NOT for single variable, NOT for pure categorical",
    },
    example: { tr: "Öğrenci boy–kilo", ku: "Bejn–girant", en: "Height–weight" },
  },
  {
    id: "histogram",
    name: { tr: "Histogram", ku: "Histogram", en: "Histogram" },
    bestFor: {
      tr: "Sayısal verinin dağılımı — şekli nasıl? (boy dağılımı, sınav notu dağılımı)",
      ku: "Belavbûna daneyên jimare",
      en: "Distribution of numeric data — what's the shape?",
    },
    whenNot: {
      tr: "Kategori karşılaştırması DEĞİL — çubuk grafik ile KARIŞTIRILIR! Histogram'da çubuklar BİTİŞİKtir, çubuk grafikte arası var.",
      ku: "Ne berawirdkirina kategoriyan — darik bi hev re bibin!",
      en: "NOT for category comparison — bars ARE TOUCHING (unlike bar chart)",
    },
    example: { tr: "Sınıftaki 100 öğrencinin boy dağılımı", ku: "Belavbûna bejna 100 xwendekaran", en: "Distribution of 100 student heights" },
  },
  {
    id: "dotplot",
    name: { tr: "Nokta Grafiği", ku: "Grafîka Xalan", en: "Dot Plot" },
    bestFor: {
      tr: "Küçük örneklem dağılımı (her nokta bir öğrenci, bir gün…)",
      ku: "Belavbûna nimûneyên piçûk",
      en: "Small sample distribution (each dot = one case)",
    },
    whenNot: {
      tr: "Büyük veri (100+) için — histogram kullanılmalı",
      ku: "Ji bo daneyên mezin (100+) — histogram çêtir e",
      en: "NOT for big data (100+) — use histogram",
    },
    example: { tr: "20 öğrencinin kardeş sayısı", ku: "Hejmara bir û pismamê 20 xwendekaran", en: "Number of siblings for 20 students" },
  },
  {
    id: "boxplot",
    name: { tr: "Kutu Grafiği", ku: "Grafîka Qutî", en: "Box Plot" },
    bestFor: {
      tr: "Veriyi 5 sayı ile özetleme (min, Q1, medyan, Q3, maks) — aykırıları gösterir",
      ku: "Nimûnekirina daneyan bi 5 hejmaran",
      en: "Five-number summary (min, Q1, median, Q3, max) — shows outliers",
    },
    whenNot: {
      tr: "Küçük örneklem (<10) için uygun DEĞİL",
      ku: "Ji bo nimûneyên pir piçûk ne guncav",
      en: "NOT for very small samples (<10)",
    },
    example: { tr: "Okullara göre sınav notu dağılımı", ku: "Belavbûna notan li gor dibistanan", en: "Exam score distribution by school" },
  },
  {
    id: "area",
    name: { tr: "Alan Grafiği", ku: "Grafîka Qadê", en: "Area Chart" },
    bestFor: {
      tr: "Zaman içinde toplam büyüklük değişimi (toplam satış, toplam nüfus)",
      ku: "Guhertina mezinahiyê bi demê re",
      en: "Total magnitude over time (cumulative sales)",
    },
    whenNot: {
      tr: "Tek değişim için çizgi grafik daha iyi. Alan, 'bütünün büyüklüğü' hissini öne çıkarır.",
      ku: "Ji bo guherbarek tenê, xet çêtir e",
      en: "Use line if it's just a trend",
    },
    example: { tr: "Türkiye nüfusu 1960-2020", ku: "Nifûsa Tirkiyê 1960-2020", en: "Turkey population 1960-2020" },
  },
  {
    id: "heatmap",
    name: { tr: "Isı Haritası", ku: "Nexşeya Germahiyê", en: "Heatmap" },
    bestFor: {
      tr: "İKİ kategorik boyut × bir değer (illere göre aylar, saatlere göre günler)",
      ku: "Du boyutên kategorîk × yek nirxê",
      en: "Two categorical dimensions × one value (city×month)",
    },
    whenNot: {
      tr: "Az veri için fazla karmaşık — tablo yeterli olabilir",
      ku: "Ji bo daneyên kêm, tablo bes e",
      en: "Overkill for small data",
    },
    example: { tr: "Ankara 12 ay × 4 yıl sıcaklık", ku: "Germahî: 12 meh × 4 sal", en: "Temp: 12 months × 4 years" },
  },
  {
    id: "waffle",
    name: { tr: "Waffle Grafik", ku: "Grafîka Waffle", en: "Waffle Chart" },
    bestFor: {
      tr: "Yüzde/pay gösterme (100 kareli grid ile — '40 tanesi kırmızı')",
      ku: "Pîvanek ji sedî — 100 qaytên ku 40 sor in",
      en: "Showing a % with 100-cell grid (40 out of 100)",
    },
    whenNot: {
      tr: "Trend veya karşılaştırma için değil — tek yüzdeyi somutlaştırır",
      ku: "Ne ji bo trend an jî berawirdkirinê",
      en: "NOT for trend/comparison — just one % to show",
    },
    example: { tr: "Türkiye kadın istihdam oranı", ku: "Rêjeya karê jinan li Tirkiyê", en: "Turkey women employment rate" },
  },
];

// ═══════════════════════════════════════════════════════════════════
// "HANGİSİ UYGUN?" SENARYOLARI — Mod 2 için
// Her senaryo: veri açıklaması + DOĞRU grafik tipi + YANLIŞ 3 seçenek

export const SCENARIO_QUESTIONS = [
  {
    id: "s1",
    scenario: {
      tr: "Bir sınıfta en sevilen 5 spor dalının kaç kişi tarafından seçildiğini göstermek istiyorsun. Hangisi?",
      ku: "Di polê de 5 werzîşên herî xoşdîtin. Kîjan?",
      en: "Show how many students picked each of 5 favorite sports. Which?",
    },
    correctType: "bar",
    wrongTypes: ["line", "pie", "scatter"],
    explain: {
      tr: "Kategoriler (sporlar) arasında karşılaştırma yapıyoruz → ÇUBUK uygun. Çizgi zaman için, saçılım iki sayı için.",
      ku: "Ji bo berawirdkirina kategoriyan, darik guncav e.",
      en: "Comparing categories → BAR. Line is for time, scatter for 2-number relationships.",
    },
  },
  {
    id: "s2",
    scenario: {
      tr: "Ankara'nın 12 aylık ortalama sıcaklığını göstermek istiyorsun. Hangisi?",
      ku: "Germahiya 12-mehane ya Enqere — kîjan?",
      en: "Show Ankara's monthly avg temperature across 12 months. Which?",
    },
    correctType: "line",
    wrongTypes: ["pie", "histogram", "waffle"],
    explain: {
      tr: "Zaman serisi (aylar sırayla) → ÇİZGİ grafik. Trend ve mevsimsellik göze çarpar. Çubuk da olabilir ama aylar zaman sırasında olduğu için çizgi daha iyi.",
      ku: "Rêzeya demê → xet guncav e",
      en: "Time series (months in order) → LINE. Reveals trend and seasonality.",
    },
  },
  {
    id: "s3",
    scenario: {
      tr: "100 öğrencinin boy ve kilosu arasında ilişki olup olmadığını incelemek istiyorsun. Hangisi?",
      ku: "Têkiliya bejn û giraniya 100 xwendekaran — kîjan?",
      en: "Study height–weight relationship for 100 students. Which?",
    },
    correctType: "scatter",
    wrongTypes: ["bar", "line", "pie"],
    explain: {
      tr: "İKİ sayısal değişken ilişkisi → SAÇILIM. Her öğrenci bir nokta; korelasyon görünür hale gelir.",
      ku: "Têkiliya du guherbaran → belavbûn",
      en: "Two numeric variables relationship → SCATTER. Each student is a dot.",
    },
  },
  {
    id: "s4",
    scenario: {
      tr: "Sınıftaki 30 öğrencinin NE KADAR farklı boylara sahip olduğunu göstermek istiyorsun. Dağılım şekli önemli. Hangisi?",
      ku: "Dabeşa bejnan — şikil çawa? (30 xwendekar)",
      en: "Show the distribution (shape) of 30 students' heights. Which?",
    },
    correctType: "histogram",
    wrongTypes: ["bar", "pie", "line"],
    explain: {
      tr: "Dağılımın ŞEKLİNİ (çan eğrisi mi? asimetrik mi?) görmek için HİSTOGRAM. Çubuklar BİTİŞİK olduğu için sürekliliği gösterir. Çubuk grafikten farkı bu.",
      ku: "Şiklê dabeşê → histogram",
      en: "Distribution SHAPE → HISTOGRAM. Touching bars = continuous.",
    },
  },
  {
    id: "s5",
    scenario: {
      tr: "Sınıfta matematik notunu kız ve erkek öğrenciler arasında karşılaştırıp aykırı örnekleri de görmek istiyorsun. Hangisi?",
      ku: "Berawirdkirina notan keç/xort + aykırîyan — kîjan?",
      en: "Compare math grades by gender + see outliers. Which?",
    },
    correctType: "boxplot",
    wrongTypes: ["scatter", "heatmap", "waffle"],
    explain: {
      tr: "5 sayılı özet + aykırı değer görünürlüğü → KUTU. İki kutuyu yan yana koyarsın (kız/erkek), medyanları ve yayılımları karşılaştırırsın.",
      ku: "Nîşan bi 5-hejmar → qutî",
      en: "Five-number summary + outliers → BOX PLOT. Two boxes side-by-side for comparison.",
    },
  },
  {
    id: "s6",
    scenario: {
      tr: "Türkiye'nin kadın istihdam oranının %35 olduğunu somut bir şekilde görselleştirmek istiyorsun. Hangisi?",
      ku: "Rêjeya %35 ya karê jinan — xuyakirina somut — kîjan?",
      en: "Visualize concretely that women employment is 35%. Which?",
    },
    correctType: "waffle",
    wrongTypes: ["line", "scatter", "boxplot"],
    explain: {
      tr: "Tek yüzdeyi somut göstermek → WAFFLE (100 kareli grid, 35'i kırmızı). Bu '35 kişi üzerinden 100'de' hissini net verir.",
      ku: "Ji sedîya yek → waffle",
      en: "Single % to feel concrete → WAFFLE (35 of 100 squares colored)",
    },
  },
  {
    id: "s7",
    scenario: {
      tr: "Sınıftaki 20 öğrencinin kaç kardeşi olduğunu göstermek istiyorsun. Her öğrenci bir nokta olsun. Hangisi?",
      ku: "Hejmara bir û pismaman ji 20 xwendekaran — her xwendekar xalek — kîjan?",
      en: "Show sibling count for 20 students, each student is a dot. Which?",
    },
    correctType: "dotplot",
    wrongTypes: ["histogram", "pie", "area"],
    explain: {
      tr: "Küçük örneklem + her gözlem görünür → NOKTA GRAFİĞİ. Histogram büyük veri içindir, nokta küçük içindir.",
      ku: "Nimûneya piçûk + her xwe xuya dike → xal",
      en: "Small sample + each case visible → DOT PLOT",
    },
  },
  {
    id: "s8",
    scenario: {
      tr: "Türkiye'nin 1960-2020 arası nüfusunun toplam büyüklüğünü vurgulamak istiyorsun — eğri altındaki alan önemli. Hangisi?",
      ku: "Nifûsa Tirkiyê 1960-2020 — qada bin xetê girîng — kîjan?",
      en: "Turkey pop 1960-2020 emphasizing total magnitude. Which?",
    },
    correctType: "area",
    wrongTypes: ["pie", "scatter", "heatmap"],
    explain: {
      tr: "Zamanla büyüklük değişimini vurgulama → ALAN grafik. Çizgi olsa sadece eğrisi görünürdü, alanla 'toplam' hissi güçlenir.",
      ku: "Mezinbûn bi demê re → qad",
      en: "Magnitude over time → AREA (total feel)",
    },
  },
];

// ═══════════════════════════════════════════════════════════════════
// DÜNYA ETKİNLİKLERİ — gerçek medya/araştırma grafikleri
// Her etkinlik: bağlam + grafik + Notice & Wonder + 3 analiz sorusu + ders
// Kaynaklar: NASA GISS, TÜİK, OECD, MGM
// Format esinlenen: NYTimes/ASA "What's Going On in This Graph?" (WGOITG)

export const WORLD_ACTIVITIES = [
  {
    id: "w_climate",
    curcioLevel: 3,
    title: { tr: "Dünya Isınıyor mu?", ku: "Gelo Cîhan Germ Dibe?", en: "Is the Earth Warming?" },
    chartType: "line",
    badge: { tr: "İklim", ku: "Avayê", en: "Climate" },
    badgeColor: "#ef4444",
    // NASA GISS 1880-2024 (baseline 1951-1980), yıllık anomali °C
    data: {
      categories: ["1880", "1900", "1920", "1940", "1960", "1980", "2000", "2010", "2020", "2024"],
      values: [-0.16, -0.09, -0.27, 0.04, -0.03, 0.26, 0.40, 0.72, 1.01, 1.28],
    },
    yLabel: { tr: "Sıcaklık anomalisi (°C)", ku: "Anomaliya germahiyê (°C)", en: "Temp anomaly (°C)" },
    source: "NASA GISS (GISTEMP v4)",
    sourceUrl: "https://data.giss.nasa.gov/gistemp/",
    date: "1880-2024 yıllık",
    context: {
      tr: "NASA GISS'in 1880'den bugüne tuttuğu küresel sıcaklık kayıtları. Değerler 1951-1980 ortalamasına göre FARK gösterir — 0 normal, pozitif sıcak, negatif soğuk. 2024 son yıllardaki en sıcak yıl. Her 10 yılda bir ortalama değer alındı.",
      ku: "Tomara germahiya cîhanê ya NASA ji 1880'ê heta îro. Nirx li gor navgîniya 1951-1980 cudahî nîşan dide.",
      en: "NASA's record of global temperature since 1880. Values show DIFFERENCE from 1951-1980 average. 2024 is among the hottest years on record.",
    },
    questions: [
      {
        q: {
          tr: "1880'de değer kaçtı? 2024'te kaç oldu? Fark yaklaşık kaç derece?",
          ku: "Di 1880 de nirx çi bû? Di 2024 de? Cudahî çiqas e?",
          en: "What was the value in 1880? In 2024? About how many degrees difference?",
        },
        a: {
          tr: "1880 = -0.16°C, 2024 = +1.28°C. Fark yaklaşık 1.44°C, yani ~1.4°C artış.",
          ku: "1880 = -0.16°C, 2024 = +1.28°C. Cudahî ≈ 1.4°C.",
          en: "1880 = -0.16°C, 2024 = +1.28°C. Difference ≈ 1.4°C rise.",
        },
      },
      {
        q: {
          tr: "Hangi 20 yıllık dönemde en hızlı artış görülüyor?",
          ku: "Di kîjan 20 salan de zêdebûna herî bilez heye?",
          en: "Which 20-year period shows the fastest rise?",
        },
        a: {
          tr: "1980-2000 ve sonrası. 1980'den önce değişim yavaş ve dalgalı; 1980 sonrası kararlı ve hızlı artış.",
          ku: "Piştî 1980. Berî wê hêdî û dalgavî bû; piştî 1980 berdewam û bilez.",
          en: "After 1980. Before that: slow and wavy; after 1980: steady and fast rise.",
        },
      },
      {
        q: {
          tr: "Sadece son 10 yıla bakarak küresel ısınma hakkında sonuç çıkarabilir misin? Neden?",
          ku: "Tenê bi 10 salên dawîn — tu dikarî encamê derxî? Çima?",
          en: "Can you conclude about warming using ONLY last 10 years? Why?",
        },
        a: {
          tr: "HAYIR — kısa dönem doğal dalgalanmayı içerir. İklim için 30+ yıl trend gerekir. Bilim insanları 1880'den günümüze BAKAR, çünkü trend ancak uzun vadede güvenilir.",
          ku: "Na — demê kurt ne bes e. Ji bo avayê 30+ sal divê.",
          en: "NO — short-term has natural fluctuation. Climate needs 30+ year trends. Scientists use 1880-today.",
        },
      },
    ],
    lesson: {
      tr: "📖 Bu grafik iklim değişikliğinin KANITIDIR. Küçük bir sayı (1°C) büyük görünmeyebilir ama küresel sıcaklık ortalamasında 1°C devasa bir fark — kutuplar erimeye, deniz seviyeleri yükselmeye, aşırı hava olayları artmaya başlar. NASA, NOAA, ECMWF gibi farklı bilim kurumları BAĞIMSIZ ölçüm yapıyor ve AYNI trendi buluyor — bu rastgele değil.",
      ku: "Ev grafîk kanîta guhertina avayê ye. 1°C xuya piçûk e lê di navgîniya cîhanê de pir mezin e.",
      en: "This graph IS evidence of climate change. 1°C may seem small but in global average it's enormous — ice caps melt, seas rise. Independent agencies (NASA, NOAA, ECMWF) find the SAME trend.",
    },
  },
  {
    id: "w_fertility",
    curcioLevel: 2,
    title: { tr: "Türkiye'de Doğurganlık Nasıl Değişti?", ku: "Doğurganî Li Tirkiyê Çawa Guheriya?", en: "How Has Fertility Changed in Turkey?" },
    chartType: "line",
    badge: { tr: "Demografi", ku: "Demografî", en: "Demography" },
    badgeColor: "#8b5cf6",
    // TÜİK + Wikipedia: kadın başına çocuk sayısı (TFR)
    data: {
      categories: ["1960", "1970", "1980", "1990", "2001", "2010", "2014", "2023"],
      values: [6.0, 5.1, 4.1, 2.9, 2.38, 2.03, 2.17, 1.51],
    },
    yLabel: { tr: "Kadın başına çocuk", ku: "Zarok bi jinekê", en: "Children per woman" },
    source: "TÜİK Doğum İstatistikleri 2023",
    sourceUrl: "https://www.tuik.gov.tr",
    date: "1960-2023",
    context: {
      tr: "Bir kadının 15-49 yaş doğurgan döneminde ortalama kaç çocuk doğurduğu = TDH (Toplam Doğurganlık Hızı). 1960'ta 6 çocuk, 2023'te 1,51. Nüfusun yenilenme düzeyi (yerini koruma) 2,10'dur. Türkiye bu eşiğin altına düştü. AB ortalaması 1,54, dünya ortalaması 2,31.",
      ku: "Jimara zarokên ku jinekê di dema doğurganiyê de (15-49) dibîne. Di 1960 de 6, di 2023 de 1.51.",
      en: "Avg children a woman bears in 15-49 age = TFR (Total Fertility Rate). 1960: 6 kids, 2023: 1.51. Replacement level: 2.10.",
    },
    questions: [
      {
        q: {
          tr: "1960 ile 2023 arasında TDH yaklaşık kaça düştü? Oran olarak ne kadar azalmış?",
          ku: "TDH di navbera 1960 û 2023 de çiqas kêm bû?",
          en: "How much did TFR drop from 1960 to 2023? What proportion?",
        },
        a: {
          tr: "6,0'dan 1,51'e — yaklaşık %75 azalma. Bir kadın ortalama 4,5 çocuk daha az doğuruyor.",
          ku: "Ji 6.0 heta 1.51 — ~%75 kêmbûn.",
          en: "From 6.0 to 1.51 — ~75% drop. Average woman has 4.5 fewer children.",
        },
      },
      {
        q: {
          tr: "'Yenilenme düzeyi' 2,10'un altına hangi tarih civarında düştük?",
          ku: "Di kîjan tarîxê de ji asta 2.10 derbas bû?",
          en: "Around when did we cross below the 2.10 replacement level?",
        },
        a: {
          tr: "2010 civarında (2,03). Bu tarihten sonra Türkiye nüfusu 'doğal' olarak büyümüyor — göç ve uzayan yaşam süresi olmasa nüfus azalırdı.",
          ku: "Li dora 2010 (2.03). Piştî wê tarîxê Tirkiye nifûsa xwe bi xwezayî nafirehe.",
          en: "Around 2010 (2.03). After this, Turkey's population doesn't grow 'naturally' — only due to migration & longer lifespans.",
        },
      },
      {
        q: {
          tr: "2010'dan 2014'e hafif bir ARTIŞ var (2,03 → 2,17). Bu ne anlama gelebilir? Tek başına bu çıkıştan trend değişimi sonucu çıkarabilir misin?",
          ku: "Ji 2010 heta 2014 zêdebûn heye. Çi wateyê didin? Ma ev tenê bes e?",
          en: "There's a small RISE 2010→2014 (2.03 → 2.17). What might this mean? Enough alone for a trend?",
        },
        a: {
          tr: "Kısa dönemli dalgalanma olabilir (4 yıl trend değil), bir sosyal politika etkisi (doğuma teşvik), veya ölçüm farkı. Tek başına yeterli değil — 2014 sonrası büyük düşüş (1,51) uzun vadeli trendin devam ettiğini gösteriyor.",
          ku: "Dibe ku dalgavê demê kurt be. Ji bo trendê pêwîst tu li demê dirêj binêrî.",
          en: "Could be short-term wobble, a policy effect, or measurement variance. NOT enough alone — the post-2014 big drop shows long trend continues.",
        },
      },
    ],
    lesson: {
      tr: "📖 Nüfus biliminde bu 'demografik geçiş' olarak adlandırılır. Kentleşme, kadın eğitimi artışı, kadının iş hayatına katılımı, sağlık hizmetlerinin iyileşmesi, aile planlaması erişimi — hepsi bu düşüşe katkı sağlar. Türkiye 1960'larda 'nüfus patlaması' yaşıyordu, bugün 'yaşlanan nüfus' sorunuyla karşı karşıya. Politika sorusu: hangisini tercih etmeli? Kolay cevap yok.",
      ku: "Ev jê re 'geçîşa demografîk' tê gotin.",
      en: "This is called 'demographic transition'. Urbanization, female education, workforce participation, healthcare, family planning — all contribute. Turkey went from 'population boom' to 'aging population' in 60 years.",
    },
  },
  {
    id: "w_pisa_trend",
    curcioLevel: 3,
    title: { tr: "Türkiye PISA Matematik — Yıllara Göre", ku: "PISA Matematîk Tirkiyê — Bi Salan", en: "Turkey PISA Math — Over Time" },
    chartType: "line",
    badge: { tr: "Eğitim", ku: "Perwerde", en: "Education" },
    badgeColor: "#3b82f6",
    data: {
      categories: ["2003", "2006", "2009", "2012", "2015", "2018", "2022"],
      values: [423, 424, 445, 448, 420, 454, 453],
    },
    yLabel: { tr: "PISA puanı", ku: "Nîşane", en: "Score" },
    source: "OECD PISA / MEB",
    sourceUrl: "https://pisa.meb.gov.tr",
    date: "2003-2022 (7 döngü)",
    context: {
      tr: "Her 3 yılda bir OECD 15 yaş öğrencilerin matematik, fen, okuma becerilerini ölçer. Türkiye 2003'te ilk kez katıldı. OECD 2022 ortalaması: 472. Bu grafik sadece matematiği gösteriyor. PISA'ya 81 ülke katıldı 2022'de.",
      ku: "Her 3 sal OECD hunerên 15-saliyan dipîve. Navîniya OECD 2022: 472.",
      en: "OECD measures 15-year-olds' skills every 3 years. Turkey joined 2003. OECD 2022 avg: 472. This shows only Math.",
    },
    questions: [
      {
        q: {
          tr: "2003-2012 arası Türkiye'nin puanı nasıl değişti? 2012-2015 arası?",
          ku: "Di navbera 2003-2012 de çawa guheriya? 2012-2015?",
          en: "How did Turkey's score change 2003-2012? 2012-2015?",
        },
        a: {
          tr: "2003-2012: 423'ten 448'e düzenli artış (+25 puan). 2012-2015: 448'den 420'ye keskin düşüş (-28 puan) — 2015 beklenmedik bir gerileme yılıydı.",
          ku: "2003-2012 bilind bû, 2012-2015 kêm bû.",
          en: "2003-2012: steady rise (+25). 2012-2015: sharp drop (-28). 2015 was an unexpected setback.",
        },
      },
      {
        q: {
          tr: "2018 ve 2022'de puanlar neredeyse aynı (454 ve 453). Bu kötü mü iyi mi? Bağlamla düşün.",
          ku: "2018 û 2022 nêzîkî hev in. Başî yan xirabî ye?",
          en: "2018 and 2022 scores nearly equal. Good or bad? Think with context.",
        },
        a: {
          tr: "Bağlam önemli: OECD ortalama 2022'de DÜŞTÜ (pandemi etkisi). Türkiye stabil kalması görece iyi. Ama 2015 gerilemesinden hâlâ tam toparlanma yok. 'Stabil kötü' ve 'stabil iyi' farklı şeyler — kime göre sorusu kritik.",
          ku: "Bo çi? Navîniya OECD kêm bû. Stabîl bûna Tirkiyê baş e.",
          en: "Context matters: OECD avg DROPPED (pandemic). Turkey staying stable is relatively good. But still not back to peak.",
        },
      },
      {
        q: {
          tr: "Bu trend sadece 'matematik becerisini' mi ölçer? Başka ne görmüyoruz?",
          ku: "Ma ev trend tenê hunera matematîkê dipîve?",
          en: "Does this trend only measure 'math skills'? What are we missing?",
        },
        a: {
          tr: "HAYIR — PISA sadece 15 yaş OKULDA OKUYAN öğrencileri test eder, okulu bırakanlar dahil değil. Ayrıca örneklem bazılıdır, tüm öğrenciler değil. Sosyoekonomik farklar gizlenir. PISA bir ÖZET. Ortalama arkasında büyük eşitsizlikler olabilir.",
          ku: "PISA tenê xwendekarên 15-salî yên di dibistanê de dipîve.",
          en: "NO — PISA only tests 15-year-olds IN SCHOOL, not dropouts. It's a SAMPLE. Inequality hidden behind the average.",
        },
      },
    ],
    lesson: {
      tr: "📖 Bir sayı sadece bir sayıdır. Bağlam olmadan 453'ün iyi mi kötü mü olduğunu bilemeyiz. OECD ortalamasıyla karşılaştırmak bir referans verir. Ama 'sıralama' ile 'puan artışı' farklı hikâyeler anlatır. Türkiye sıralamada yükseldi çünkü diğer ülkeler düştü — kendi ilerlemesi sınırlı. Eğitim politikası önermek için tek grafik yetmez.",
      ku: "Hejmarek bes tenê hejmarek e. Bi rêya pêxembarê bêm, em nikarin tê bigihin başî yan xirabî ye.",
      en: "A number is just a number. Without context, we don't know if 453 is good or bad. Ranking and score tell different stories.",
    },
  },
  {
    id: "w_istanbul_countries",
    curcioLevel: 1,
    title: { tr: "İstanbul Hangi Ülkelerden Büyük?", ku: "Stenbol Ji Kîjan Welatan Mezintir e?", en: "Which Countries Is Istanbul Bigger Than?" },
    chartType: "bar",
    badge: { tr: "Karşılaştırma", ku: "Berawirdkirin", en: "Comparison" },
    badgeColor: "#10b981",
    // İstanbul + 6 ülke. Kaynak: UNFPA 2024, TÜİK 2024 (milyon kişi)
    data: {
      categories: ["İstanbul", "Yunanistan", "Çekya", "Portekiz", "Macaristan", "Azerbaycan", "İsrail"],
      values: [15.70, 10.3, 10.5, 10.2, 10.0, 10.5, 9.3],
    },
    yLabel: { tr: "Nüfus (milyon)", ku: "Nifûs (mîlyon)", en: "Population (M)" },
    source: "TÜİK 2024 + UNFPA 2024",
    sourceUrl: "https://www.tuik.gov.tr",
    date: "2024",
    context: {
      tr: "İstanbul'un nüfusu (15.7M) pek çok AVRUPA ve Asya ülkesinden daha fazla. UNFPA'ya göre 131 ülkeden daha kalabalık! Bu 'bir şehir mi, bir ülke mi?' sorusunu sordurur.",
      ku: "Nifûsa Stenbolê (15.7M) ji gelek welatên Ewropayê zêdetir e.",
      en: "Istanbul's population (15.7M) exceeds many European & Asian countries. Per UNFPA, bigger than 131 countries!",
    },
    questions: [
      {
        q: {
          tr: "İstanbul'un nüfusu Yunanistan'dan kaç kat fazla?",
          ku: "Stenbol ji Yewnanîstanê çend qat mezintir e?",
          en: "How many times larger than Greece?",
        },
        a: {
          tr: "15.70 / 10.30 ≈ 1.52, yani ~1,5 kat. Aradaki fark ~5.4 milyon kişi.",
          ku: "~1.5 qat. Cudahî ~5.4 mîlyon e.",
          en: "~1.5x. Difference ~5.4M people.",
        },
      },
      {
        q: {
          tr: "İstanbul + Ankara + İzmir + Bursa + Antalya toplam kaç milyondur (v0.6 verisinden)? Bu ülkelerin çoğundan büyük müdür?",
          ku: "5 bajarên mezin bi hev re — çiqas mezin in?",
          en: "Combined: Istanbul + Ankara + İzmir + Bursa + Antalya?",
        },
        a: {
          tr: "15.70 + 5.86 + 4.49 + 3.24 + 2.72 ≈ 32.0 milyon. Bu, tabloda gösterilen tüm ülkelerin HER BİRİNDEN büyük (en yakın: Çekya+Yunanistan+Macaristan ~30 milyon, hâlâ az). Yani sadece Türkiye'nin en kalabalık 5 şehri, İsveç+Yunanistan+Portekiz'den büyük.",
          ku: "~32 mîlyon. Ji hemî welatan mezintir e.",
          en: "~32M combined. Larger than ANY single country shown.",
        },
      },
      {
        q: {
          tr: "Bu grafiği görenler 'İstanbul bir ülkedir' diyebilir mi? Bu bir yanıltma mı, gerçek mi?",
          ku: "'Stenbol welatek e' — xapandin yan rastî ye?",
          en: "Could viewers say 'Istanbul is a country'? Is this misleading?",
        },
        a: {
          tr: "Gerçekçi bir karşılaştırma ama metaforik. İstanbul, ülke değil; belediye yönetiminde, parlamento yok, para basmıyor. AMA nüfus ölçeğinde benzerlikler var: eğitim, sağlık, ulaşım ihtiyaçları. Grafik 'ölçek' için doğru, 'kavramsal' için dikkatli okunmalı.",
          ku: "Rast e, lê metaforîk. Stenbol welat nîn e lê bi nifûs mezin e.",
          en: "Realistic but metaphorical. Istanbul isn't a country — no parliament, no currency — BUT scale-wise similar in services needed.",
        },
      },
    ],
    lesson: {
      tr: "📖 Bu tür karşılaştırmalar DİKKAT çeker — gazetecilik tekniği. 'Türkiye'nin 3. büyük ili İzmir, 4 milyon nüfuslu' yazmak sıkıcı; 'İzmir, İrlanda'dan daha kalabalık' yazmak SERİdir. Ama karşılaştırmanın anlamlılığı önemli. Pizza ile uçak karşılaştırmaz mısın — şehir ile ülke karşılaştırması da benzer dikkat ister.",
      ku: "Ev berawirdkirin bala dikişîne. Lê hebe maneya wê.",
      en: "Such comparisons attract ATTENTION — journalism technique. Must be meaningful though: comparing city to country has caveats.",
    },
  },
];

// ═══════════════════════════════════════════════════════════════════
// DÜNYA MODÜLÜ — WGOITG tarzı (What's Going On in This Graph?)
// Her etkinlik: Bağlam → Notice & Wonder → Grafik → 3 Analiz Sorusu → Ders
// Kaynak: NYTimes/ASA WGOITG pedagojisi
