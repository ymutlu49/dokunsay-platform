/**
 * Voice Command Service
 * Handles natural language voice commands in 5 languages (TR, KU, EN, AR, FA).
 * Supports alternative phrasings, compound commands, and all app operations.
 */

export type VoiceAction =
  // Placing items
  | { action: "placeRod"; value: number }
  | { action: "placeMultipleRods"; value: number; count: number }
  | { action: "placeFiveFrame" }
  | { action: "placeTenFrame" }
  | { action: "placeDotGroup"; value: number }
  | { action: "placeChip"; color: "blue" | "red" | "green" | "yellow"; label: string | null }
  | { action: "placeMultipleChips"; color: "blue" | "red" | "green"; count: number }
  | { action: "placeOperator"; operator: string }
  | { action: "placeExpression"; parts: string[] }
  // Canvas operations
  | { action: "clear" }
  | { action: "undo" }
  | { action: "redo" }
  // File operations
  | { action: "save" }
  | { action: "load" }
  | { action: "exportPng" }
  | { action: "print" }
  // Activity
  | { action: "check" }
  | { action: "speakInstruction" }
  | { action: "loadActivity"; name: string }
  | { action: "nextActivity" }
  | { action: "prevActivity" }
  // View toggles
  | { action: "cover" }
  | { action: "reveal" }
  | { action: "toggleLabels" }
  | { action: "toggleNumberLine" }
  | { action: "fullscreen" }
  // Selected item manipulation
  | { action: "flipSelected" }
  | { action: "rotateSelected" }
  | { action: "deleteSelected" }
  | { action: "lockSelected" }
  | { action: "unlockSelected" }
  | { action: "splitSelected"; at: number }
  | { action: "mergeSelected" }
  | { action: "countSelected" }
  // Tool switching
  | { action: "selectTool"; tool: "select" | "pen" | "text" | "eraser" }
  | { action: "setPenColor"; color: string }
  // Grid & background
  | { action: "setGrid"; grid: "none" | "square" | "dot" | "line" }
  | { action: "setBgColor"; color: string }
  // Language
  | { action: "setLanguage"; lang: string }
  // Music
  | { action: "playNote" }
  // UI
  | { action: "help" }
  | { action: "about" }
  | null;

/* ===== Number Recognition ===== */

const NUMBER_WORDS: Record<string, number> = {
  // Turkish
  "sıfır": 0, bir: 1, iki: 2, "üç": 3, "dört": 4, "beş": 5, "altı": 6, yedi: 7, sekiz: 8, dokuz: 9, on: 10,
  "on bir": 11, "on iki": 12, "on üç": 13, "on dört": 14, "on beş": 15,
  "on altı": 16, "on yedi": 17, "on sekiz": 18, "on dokuz": 19, "yirmi": 20,
  // Kurdish
  sifir: 0, yek: 1, du: 2, "sê": 3, "çar": 4, "pênc": 5, "şeş": 6, heft: 7, "heşt": 8, neh: 9, deh: 10,
  yanzdeh: 11, dwanzdeh: 12, "sêzdeh": 13, "çardeh": 14, panzdeh: 15, "şanzdeh": 16, hivdeh: 17, hijdeh: 18, nozdeh: 19, "bîst": 20,
  // English
  zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
  eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15,
  sixteen: 16, seventeen: 17, eighteen: 18, nineteen: 19, twenty: 20,
  // Arabic
  "واحد": 1, "اثنان": 2, "ثلاثة": 3, "أربعة": 4, "خمسة": 5, "ستة": 6, "سبعة": 7, "ثمانية": 8, "تسعة": 9, "عشرة": 10,
  // Persian
  "صفر": 0, "یک": 1, "دو": 2, "سه": 3, "چهار": 4, "پنج": 5, "شش": 6, "هفت": 7, "هشت": 8, "نُه": 9, "ده": 10,
};

function extractNumber(txt: string): number | null {
  // Try compound numbers first (e.g. "on beş" = 15)
  for (const [word, val] of Object.entries(NUMBER_WORDS)) {
    if (word.includes(" ") && txt.includes(word)) return val;
  }
  // Then single words
  for (const [word, val] of Object.entries(NUMBER_WORDS)) {
    if (!word.includes(" ") && txt.includes(word)) return val;
  }
  // Try digit extraction
  const match = txt.match(/\d+/);
  if (match) return parseInt(match[0], 10);
  return null;
}

/** Extract a second number from text (for split, multiple items etc.) */
function extractSecondNumber(txt: string): number | null {
  const allMatches = txt.match(/\d+/g);
  if (allMatches && allMatches.length >= 2) return parseInt(allMatches[1], 10);
  return null;
}

/** Extract a multiplier like "üç tane", "iki adet", "three" before a noun */
function extractMultiplier(txt: string): number | null {
  const multiKW: Record<string, number> = {
    "bir tane": 1, "iki tane": 2, "üç tane": 3, "dört tane": 4, "beş tane": 5,
    "bir adet": 1, "iki adet": 2, "üç adet": 3, "dört adet": 4, "beş adet": 5,
    "yek": 1, "du": 2, "sê": 3, "çar": 4, "pênc": 5,
    "one": 1, "two": 2, "three": 3, "four": 4, "five": 5,
  };
  for (const [kw, val] of Object.entries(multiKW)) {
    if (txt.includes(kw)) return val;
  }
  return null;
}

/* ===== Keyword Matchers ===== */

function m(txt: string, keywords: string[]): boolean {
  return keywords.some((kw) => txt.includes(kw));
}

// ──────────────────────────── PLACING ITEMS ────────────────────────────

const ROD_KW = [
  "çubuk", "sayı çubuğu", "bar koy", "sopa", "çubuk koy", "çubuk ekle",
  "çovik", "çovikê", "çovika", "çovik deyne", "çovik lê zêde bike",
  "rod", "number rod", "counting rod", "stick", "place rod", "add rod", "put rod",
  "قضيب", "عصا", "ضع قضيب", "أضف قضيب",
  "میله", "چوب", "میله بگذار", "میله اضافه کن",
];

const FIVE_FRAME_KW = [
  "beşlik", "beşlik kart", "beş kart", "beşli kart", "beşli çerçeve", "beşlik çerçeve",
  "pêncan", "çarçoveya pêncan", "pêncan deyne",
  "five frame", "five-frame", "5 frame", "5-frame", "fives frame", "place five frame",
  "إطار خماسي", "خماسي", "ضع إطار خماسي",
  "قاب پنج", "پنج‌تایی", "قاب پنج‌تایی بگذار",
];

const TEN_FRAME_KW = [
  "onluk", "onluk kart", "on kart", "onlu kart", "onlu çerçeve", "onluk çerçeve",
  "dehan", "çarçoveya dehan", "dehan deyne",
  "ten frame", "ten-frame", "10 frame", "10-frame", "tens frame", "place ten frame",
  "إطار عشري", "عشري", "ضع إطار عشري",
  "قاب ده", "ده‌تایی", "قاب ده‌تایی بگذار",
];

const DOT_KW = [
  "nokta", "nokta kalıbı", "nokta grubu", "nokta koy", "nokta deseni", "zar",
  "xal", "qalibê xalan", "xal deyne",
  "dot", "dot pattern", "dots", "subitizing", "dice", "place dots",
  "نقطة", "نمط نقاط", "زهر", "ضع نقاط",
  "نقطه", "الگوی نقطه", "تاس",
];

// ──────────────────────────── CHIPS / COUNTERS ────────────────────────────

const CHIP_BLUE_KW = [
  "mavi pul", "mavi jeton", "mavi sayaç", "mavi koy",
  "pûla şîn", "şîn deyne",
  "blue chip", "blue counter", "blue token", "blue circle", "place blue",
  "أزرق", "قرص أزرق", "ضع أزرق",
  "آبی", "مهره آبی", "آبی بگذار",
];

const CHIP_RED_KW = [
  "kırmızı pul", "kırmızı jeton", "kırmızı sayaç", "kırmızı koy",
  "pûla sor", "sor deyne",
  "red chip", "red counter", "red token", "red circle", "place red",
  "أحمر", "قرص أحمر", "ضع أحمر",
  "قرمز", "مهره قرمز", "قرمز بگذار",
];

const CHIP_GREEN_KW = [
  "yeşil pul", "yeşil jeton", "sayı pulu", "pul koy", "jeton koy", "pul", "jeton",
  "pûla kesk", "pûl deyne", "pûl", "kesk",
  "green chip", "green counter", "counter", "chip", "number chip", "token", "place chip", "place counter",
  "أخضر", "قرص أخضر", "قرص", "ضع قرص",
  "سبز", "مهره سبز", "مهره", "مهره بگذار",
];

// ──────────────────────────── OPERATORS ────────────────────────────

const OP_PLUS_KW = [
  "artı", "toplama", "artı işareti", "toplam",
  "zêde", "zêdekirin",
  "plus", "add", "addition", "plus sign",
  "زائد", "جمع", "علامة الجمع",
  "بعلاوه", "به‌اضافه", "جمع",
];
const OP_MINUS_KW = [
  "eksi", "çıkarma", "eksi işareti", "fark",
  "kêm", "kêmkirin",
  "minus", "subtract", "subtraction", "minus sign",
  "ناقص", "طرح", "علامة الطرح",
  "منها", "تفریق",
];
const OP_TIMES_KW = [
  "çarpı", "çarpma", "çarpı işareti", "çarp",
  "car", "carkirin",
  "times", "multiply", "multiplication",
  "ضرب", "علامة الضرب",
  "در", "ضرب",
];
const OP_DIVIDE_KW = [
  "bölü", "bölme", "bölü işareti", "böl",
  "parve", "parvekirin",
  "divide", "division", "divided by",
  "قسمة", "علامة القسمة",
  "تقسیم",
];
const OP_EQUAL_KW = [
  "eşittir", "eşit", "eşit işareti", "sonuç",
  "wekhev",
  "equals", "equal", "equal sign", "result",
  "يساوي", "علامة المساواة",
  "مساوی", "برابر",
];

// ──────────────────────────── COMPOUND EXPRESSIONS ────────────────────────────
// "üç artı dört yaz", "write 3+5", "beş eksi iki"

const EXPRESSION_KW = [
  "işlem yaz", "denklemi yaz", "ifade koy",
  "hesab binivîse",
  "write expression", "write equation", "write sum",
  "اكتب العملية", "اكتب المعادلة",
  "عبارت بنویس", "معادله بنویس",
];

// ──────────────────────────── CANVAS OPERATIONS ────────────────────────────

const CLEAR_KW = [
  "temizle", "sıfırla", "hepsini sil", "tümünü sil", "kanvası temizle", "yeni sayfa", "baştan başla",
  "paqij bike", "paqij", "hemû jê bibe", "ji nû ve dest pê bike",
  "clear", "clear all", "reset", "erase all", "start over", "new page", "clean",
  "مسح", "مسح الكل", "إعادة", "صفحة جديدة", "ابدأ من جديد",
  "پاک", "پاک‌سازی", "همه را پاک کن", "صفحه جدید", "از نو شروع",
];

const UNDO_KW = [
  "geri al", "geri", "iptal", "son işlemi geri al", "vazgeç",
  "paş", "paş vegere", "paş bibe",
  "undo", "go back", "take back", "reverse",
  "تراجع", "رجوع", "ألغِ",
  "واگرد", "برگرد", "لغو",
];

const REDO_KW = [
  "ileri", "yinele", "tekrar", "tekrar yap", "son geri almayı iptal",
  "pêş", "pêş ve", "dubare bike",
  "redo", "go forward", "redo last", "repeat",
  "إعادة", "تكرار", "أعد",
  "بازانجام", "دوباره", "تکرار",
];

// ──────────────────────────── FILE OPERATIONS ────────────────────────────

const SAVE_KW = [
  "kaydet", "dosya kaydet", "çalışmayı kaydet", "sakla",
  "tomar bike", "tomar", "xebatê tomar bike",
  "save", "save file", "save work", "save project",
  "حفظ", "احفظ", "احفظ العمل", "احفظ الملف",
  "ذخیره", "ذخیره کن", "کار را ذخیره کن",
];

const LOAD_KW = [
  "yükle", "dosya aç", "dosya yükle", "çalışma aç",
  "bar bike", "veke", "pelê veke",
  "load", "open", "open file", "load file", "load work",
  "تحميل", "افتح", "افتح ملف",
  "بارگذاری", "باز کن", "فایل را باز کن",
];

const EXPORT_KW = [
  "resim kaydet", "png", "fotoğraf", "ekran görüntüsü", "resim olarak kaydet", "resim indir",
  "wêne", "png daxîne", "wêne tomar bike",
  "export", "screenshot", "save image", "download image", "save as image", "export png",
  "تصدير", "صورة", "حفظ كصورة", "تنزيل صورة",
  "خروجی", "تصویر", "ذخیره به عنوان تصویر",
];

const PRINT_KW = [
  "yazdır", "çıktı al", "baskı", "yazıcıya gönder", "printer",
  "çap bike", "çap", "li printer bişîne",
  "print", "print out", "send to printer",
  "طباعة", "اطبع", "أرسل للطابعة",
  "چاپ", "چاپ کن", "پرینت",
];

// ──────────────────────────── ACTIVITY ────────────────────────────

const CHECK_KW = [
  "kontrol et", "kontrol", "doğrula", "cevabı kontrol", "doğru mu", "cevap doğru mu",
  "kontrol bike", "rast e?",
  "check", "verify", "check answer", "is it correct", "am i right",
  "تحقق", "تحقّق", "افحص", "هل هذا صحيح",
  "بررسی", "بررسی کن", "آیا درست است",
];

const NEXT_ACTIVITY_KW = [
  "sonraki", "sonraki etkinlik", "bir sonraki", "ileri etkinlik",
  "ya pêş", "çalakiya pêş",
  "next", "next activity", "next one",
  "التالي", "النشاط التالي",
  "بعدی", "فعالیت بعدی",
];

const PREV_ACTIVITY_KW = [
  "önceki", "önceki etkinlik", "bir önceki", "geri etkinlik",
  "ya paş", "çalakiya paş",
  "previous", "previous activity", "last one", "go back activity",
  "السابق", "النشاط السابق",
  "قبلی", "فعالیت قبلی",
];

// Activity name keywords for direct loading
const ACTIVITY_NAME_KW: Record<string, string[]> = {
  "Serbest Keşif": ["serbest keşif", "keşif", "free exploration", "exploration", "vekolîna azad"],
  "Toplama": ["toplama", "toplama etkinliği", "addition", "zêdekirin"],
  "Çıkarma": ["çıkarma", "çıkarma etkinliği", "subtraction", "kêmkirin"],
  "Parça-Bütün": ["parça bütün", "parça-bütün", "part whole", "beş-gişt"],
  "Birebir Sayma": ["birebir sayma", "sayma", "one to one counting", "counting", "jimartin"],
  "Kardinallik": ["kardinallik", "cardinality", "kardînalîte"],
};

// ──────────────────────────── VIEW TOGGLES ────────────────────────────

const COVER_KW = [
  "kapat", "gizle", "ört", "sakla", "örtüyü koy",
  "bigire", "veşêre",
  "cover", "hide", "put cover",
  "إخفاء", "أخف", "غطِّ",
  "بپوشان", "پنهان", "پنهان کن",
];

const REVEAL_KW = [
  "göster", "aç", "ortaya çıkar", "örtüyü kaldır", "göster bana",
  "veke", "nîşan bide",
  "reveal", "show", "uncover", "show me", "take off cover",
  "اكشف", "أظهر", "أزل الغطاء",
  "نمایش", "نشان بده", "پرده را بردار",
];

const LABEL_KW = [
  "etiket", "numaraları göster", "sayıları göster", "etiketleri aç", "numaralar",
  "etîket", "hejmaran nîşan bide",
  "label", "labels", "show numbers", "show labels", "toggle labels",
  "تسميات", "أظهر الأرقام", "أرقام",
  "برچسب", "اعداد را نشان بده",
];

const NUMLINE_KW = [
  "sayı doğrusu", "doğru", "cetvel", "sayı çizgisi",
  "hêla hejmaran", "hêl",
  "number line", "ruler", "show number line",
  "خط الأعداد", "مسطرة",
  "خط اعداد", "خط‌کش",
];

const FULLSCREEN_KW = [
  "tam ekran", "büyüt", "ekranı büyüt",
  "ekrana tije", "mezin bike",
  "fullscreen", "full screen", "maximize", "go fullscreen",
  "ملء الشاشة", "كبّر",
  "تمام‌صفحه", "بزرگ کن",
];

// ──────────────────────────── SELECTED ITEM MANIPULATION ────────────────────────────

const FLIP_KW = [
  "çevir", "ters çevir", "ön yüz", "arka yüz", "yüzünü çevir",
  "bizivirîne", "zivirîne", "rû bizivirîne",
  "flip", "flip over", "turn over", "flip it", "face down", "face up",
  "اقلب", "اقلبه",
  "برگردان", "برگردانش",
];

const ROTATE_KW = [
  "döndür", "çevir yatay", "dikey yap", "yatay yap", "90 derece",
  "bizivirîne", "bizivire",
  "rotate", "turn", "turn sideways", "make vertical", "make horizontal",
  "دوّر", "أدره",
  "بچرخان", "بچرخانش",
];

const DELETE_KW = [
  "sil", "kaldır", "at", "çıkar", "bunu sil", "seçili sil",
  "jê bibe", "rake", "vê jê bibe",
  "delete", "remove", "trash", "get rid of", "delete this", "remove this",
  "احذف", "أزل", "احذفه",
  "حذف کن", "پاک کن", "بردار",
];

const LOCK_KW = [
  "kilitle", "sabitle", "kilit", "yerinde tut", "sabit yap",
  "kilît bike", "sabît bike",
  "lock", "pin", "lock it", "pin it", "fix position",
  "قفل", "ثبّت", "قفله",
  "قفل کن", "ثابت کن",
];

const UNLOCK_KW = [
  "kilidi aç", "kilidi kaldır", "serbest bırak", "sabitlemeyi kaldır",
  "kilît veke", "azad bike",
  "unlock", "unpin", "free", "unlock it",
  "افتح القفل", "حرّر",
  "قفل را باز کن", "آزاد کن",
];

const SPLIT_KW = [
  "böl", "ayır", "kes", "ikiye böl", "parçala",
  "jê bike", "parçe bike", "ji hev bike",
  "split", "cut", "break apart", "divide rod", "split it",
  "اقطع", "قسّم", "افصل",
  "ببر", "تقسیم کن", "جدا کن",
];

const MERGE_KW = [
  "birleştir", "birlikte yap", "yan yana getir", "ekle", "bağla",
  "yek bike", "li hev bike",
  "merge", "combine", "join", "put together", "merge rods",
  "ادمج", "اجمع", "وصّل",
  "ادغام کن", "ترکیب کن", "به هم بچسبان",
];

const COUNT_KW = [
  "say", "sesli say", "bunu say", "kaç tane", "kaçlık",
  "bijmêre", "vê bijmêre", "çend e",
  "count", "count it", "count this", "how many",
  "عُدّ", "عدّه", "كم عدده",
  "بشمار", "بشمارش", "چندتاست",
];

// ──────────────────────────── TOOL SWITCHING ────────────────────────────

const TOOL_SELECT_KW = [
  "seç", "seçim aracı", "el", "imleç",
  "hilbijêre",
  "select", "select tool", "pointer", "cursor", "hand",
  "تحديد", "أداة التحديد",
  "انتخاب", "ابزار انتخاب",
];

const TOOL_PEN_KW = [
  "kalem", "çiz", "kalem aç", "çizim yap", "çizim",
  "bikişîne", "pênûs",
  "pen", "draw", "pencil", "drawing tool", "start drawing",
  "رسم", "قلم", "ارسم",
  "قلم", "رسم", "بکش",
];

const TOOL_TEXT_KW = [
  "metin", "yazı", "yazı yaz", "metin ekle", "not yaz",
  "binivîse", "nivîs",
  "text", "write text", "type", "add text", "write note",
  "كتابة", "نص", "اكتب",
  "متن", "نوشتن", "بنویس",
];

const TOOL_ERASER_KW = [
  "silgi", "çizim sil", "silgi aç",
  "jê bibe", "paqijker",
  "eraser", "erase", "rubber",
  "ممحاة", "امسح",
  "پاک‌کن",
];

// ──────────────────────────── PEN COLORS ────────────────────────────

const PEN_BLACK_KW = ["siyah kalem", "siyah", "black pen", "black", "أسود", "سیاه", "pênûsa reş", "reş"];
const PEN_RED_KW = ["kırmızı kalem", "kırmızı çiz", "red pen", "draw red", "قلم أحمر", "قلم قرمز", "pênûsa sor", "bi sor bikişîne"];
const PEN_BLUE_KW = ["mavi kalem", "mavi çiz", "blue pen", "draw blue", "قلم أزرق", "قلم آبی", "pênûsa şîn", "bi şîn bikişîne"];
const PEN_GREEN_KW = ["yeşil kalem", "yeşil çiz", "green pen", "draw green", "قلم أخضر", "قلم سبز", "pênûsa kesk", "bi kesk bikişîne"];
const PEN_ORANGE_KW = ["turuncu kalem", "turuncu çiz", "orange pen", "draw orange", "قلم برتقالي", "قلم نارنجی", "pênûsa pirteqalî", "bi pirteqalî bikişîne"];

// ──────────────────────────── GRID & BACKGROUND ────────────────────────────

const GRID_SQUARE_KW = ["kare ızgara", "kare grid", "square grid", "grid squares", "شبكة مربعات", "شبکه مربع", "tora çargoşe"];
const GRID_DOT_KW = ["nokta ızgara", "nokta grid", "dot grid", "grid dots", "شبكة نقاط", "شبکه نقطه", "tora xalan"];
const GRID_LINE_KW = ["çizgi ızgara", "satır grid", "line grid", "grid lines", "شبكة خطوط", "شبکه خط", "tora xêzan"];
const GRID_OFF_KW = ["ızgarayı kapat", "grid kapat", "grid off", "no grid", "بدون شبكة", "بدون شبکه", "torê bigire"];

const BG_LIGHT_KW = ["açık arka plan", "beyaz", "light background", "white background", "خلفية فاتحة", "پس‌زمینه روشن", "paşperdeya ronî", "spî"];
const BG_DARK_KW = ["karanlık mod", "koyu mod", "gece modu", "dark mode", "dark background", "الوضع الداكن", "حالت تاریک", "moda tarî", "tarî"];

// ──────────────────────────── LANGUAGE ────────────────────────────

const LANG_TR_KW = ["türkçe", "turkish"];
const LANG_KU_KW = ["kürtçe", "kurdish", "kurdî", "kurmancî"];
const LANG_EN_KW = ["ingilizce", "english"];
const LANG_AR_KW = ["arapça", "arabic", "عربي"];
const LANG_FA_KW = ["farsça", "persian", "فارسی"];

// ──────────────────────────── MUSIC / NOTE ────────────────────────────

const MUSIC_KW = [
  "müzik", "nota çal", "ses çıkar", "nota",
  "muzîk", "not", "awaz", "not lê bide",
  "music", "play note", "play sound", "note",
  "موسيقى", "عزف",
  "موسیقی", "نت بزن",
];

// ──────────────────────────── SPEAK INSTRUCTION ────────────────────────────

const SPEAK_KW = [
  "oku", "sesli oku", "yönerge oku", "talimatı oku", "açıklamayı oku", "ne yapacağım",
  "bixwîne", "bi deng bixwîne", "rêwerzê bixwîne",
  "read", "read aloud", "read instruction", "read directions", "what should i do",
  "اقرأ", "اقرأ بصوت", "اقرأ التعليمات",
  "بخوان", "با صدا بخوان", "دستورالعمل را بخوان",
];

// ──────────────────────────── HELP / ABOUT ────────────────────────────

const HELP_KW = [
  "yardım", "nasıl", "kısayollar", "ne yapabilirim", "komutlar neler",
  "arîkarî", "çawa", "çi dikarim bikim",
  "help", "how to", "shortcuts", "what can i do", "commands",
  "مساعدة", "كيف", "ماذا أستطيع",
  "کمک", "راهنما", "چه کارهایی می‌توانم",
];

const ABOUT_KW = [
  "hakkında", "bilgi", "uygulama hakkında", "kim yaptı", "geliştirici",
  "derbarê", "agahî",
  "about", "info", "about app", "who made this", "developer",
  "حول", "معلومات", "من صنع هذا",
  "درباره", "اطلاعات", "چه کسی ساخته",
];

/* ===== Main Parser ===== */

export function parseVoiceCommand(transcript: string): VoiceAction {
  const txt = transcript.toLowerCase().trim();
  const num = extractNumber(txt);
  const multi = extractMultiplier(txt);

  // ──── Compound expression: "üç artı dört" → place 3, +, 4 ────
  if (m(txt, EXPRESSION_KW)) {
    const parts: string[] = [];
    const tokens = txt.split(/\s+/);
    for (const token of tokens) {
      const n = NUMBER_WORDS[token];
      if (n !== undefined) parts.push(String(n));
      if (["artı", "plus", "add", "زائد", "بعلاوه", "zêde"].includes(token)) parts.push("+");
      if (["eksi", "minus", "ناقص", "منها", "kêm"].includes(token)) parts.push("−");
      if (["çarpı", "times", "ضرب", "در", "car"].includes(token)) parts.push("×");
      if (["bölü", "divide", "قسمة", "تقسیم", "dabeş"].includes(token)) parts.push("÷");
      if (["eşittir", "eşit", "equals", "يساوي", "مساوی", "wekhev"].includes(token)) parts.push("=");
    }
    if (parts.length >= 2) return { action: "placeExpression", parts };
  }

  // ──── Multiple rods: "üç tane beşlik çubuk" ────
  if (m(txt, ROD_KW) && multi && multi > 1 && num !== null && num >= 1 && num <= 10) {
    return { action: "placeMultipleRods", value: num, count: multi };
  }

  // ──── Rod placement ────
  if (m(txt, ROD_KW) && num !== null && num >= 1 && num <= 10) {
    return { action: "placeRod", value: num };
  }

  // ──── Five-frame ────
  if (m(txt, FIVE_FRAME_KW)) return { action: "placeFiveFrame" };

  // ──── Ten-frame ────
  if (m(txt, TEN_FRAME_KW)) return { action: "placeTenFrame" };

  // ──── Dot pattern ────
  if (m(txt, DOT_KW) && num !== null && num >= 1 && num <= 6) {
    return { action: "placeDotGroup", value: num };
  }

  // ──── Operators ────
  if (m(txt, OP_PLUS_KW)) return { action: "placeOperator", operator: "+" };
  if (m(txt, OP_MINUS_KW)) return { action: "placeOperator", operator: "−" };
  if (m(txt, OP_TIMES_KW)) return { action: "placeOperator", operator: "×" };
  if (m(txt, OP_DIVIDE_KW)) return { action: "placeOperator", operator: "÷" };
  if (m(txt, OP_EQUAL_KW)) return { action: "placeOperator", operator: "=" };

  // ──── Multiple chips: "üç tane mavi pul" ────
  if (multi && multi > 1) {
    if (m(txt, CHIP_BLUE_KW)) return { action: "placeMultipleChips", color: "blue", count: multi };
    if (m(txt, CHIP_RED_KW)) return { action: "placeMultipleChips", color: "red", count: multi };
    if (m(txt, CHIP_GREEN_KW)) return { action: "placeMultipleChips", color: "green", count: multi };
  }

  // ──── Blue chip ────
  if (m(txt, CHIP_BLUE_KW)) return { action: "placeChip", color: "blue", label: null };

  // ──── Red chip ────
  if (m(txt, CHIP_RED_KW)) return { action: "placeChip", color: "red", label: null };

  // ──── Green / numbered chip ────
  if (m(txt, CHIP_GREEN_KW) && num !== null && num >= 0 && num <= 20) {
    return { action: "placeChip", color: "green", label: String(num) };
  }

  // ──── Tool switching ────
  if (m(txt, TOOL_ERASER_KW)) return { action: "selectTool", tool: "eraser" };
  if (m(txt, TOOL_PEN_KW)) return { action: "selectTool", tool: "pen" };
  if (m(txt, TOOL_TEXT_KW)) return { action: "selectTool", tool: "text" };
  if (m(txt, TOOL_SELECT_KW)) return { action: "selectTool", tool: "select" };

  // ──── Pen colors ────
  if (m(txt, PEN_RED_KW)) return { action: "setPenColor", color: "#dc2626" };
  if (m(txt, PEN_BLUE_KW)) return { action: "setPenColor", color: "#2563eb" };
  if (m(txt, PEN_GREEN_KW)) return { action: "setPenColor", color: "#16a34a" };
  if (m(txt, PEN_ORANGE_KW)) return { action: "setPenColor", color: "#d97706" };
  if (m(txt, PEN_BLACK_KW)) return { action: "setPenColor", color: "#1a1a1a" };

  // ──── Split / Merge / Count ────
  if (m(txt, SPLIT_KW)) {
    const at = extractSecondNumber(txt) || num;
    return { action: "splitSelected", at: at || 1 };
  }
  if (m(txt, MERGE_KW)) return { action: "mergeSelected" };
  if (m(txt, COUNT_KW)) return { action: "countSelected" };

  // ──── Flip / Rotate / Delete / Lock / Unlock ────
  if (m(txt, FLIP_KW)) return { action: "flipSelected" };
  if (m(txt, ROTATE_KW)) return { action: "rotateSelected" };
  if (m(txt, UNLOCK_KW)) return { action: "unlockSelected" };
  if (m(txt, LOCK_KW)) return { action: "lockSelected" };
  if (m(txt, DELETE_KW)) return { action: "deleteSelected" };

  // ──── Cover / Reveal ────
  if (m(txt, COVER_KW)) return { action: "cover" };
  if (m(txt, REVEAL_KW)) return { action: "reveal" };

  // ──── Labels / Number line / Fullscreen ────
  if (m(txt, LABEL_KW)) return { action: "toggleLabels" };
  if (m(txt, NUMLINE_KW)) return { action: "toggleNumberLine" };
  if (m(txt, FULLSCREEN_KW)) return { action: "fullscreen" };

  // ──── Grid & Background ────
  if (m(txt, GRID_OFF_KW)) return { action: "setGrid", grid: "none" };
  if (m(txt, GRID_SQUARE_KW)) return { action: "setGrid", grid: "square" };
  if (m(txt, GRID_DOT_KW)) return { action: "setGrid", grid: "dot" };
  if (m(txt, GRID_LINE_KW)) return { action: "setGrid", grid: "line" };
  if (m(txt, BG_DARK_KW)) return { action: "setBgColor", color: "#2d2d2d" };
  if (m(txt, BG_LIGHT_KW)) return { action: "setBgColor", color: "#f0ead6" };

  // ──── Language ────
  if (m(txt, LANG_TR_KW)) return { action: "setLanguage", lang: "tr" };
  if (m(txt, LANG_KU_KW)) return { action: "setLanguage", lang: "ku" };
  if (m(txt, LANG_EN_KW)) return { action: "setLanguage", lang: "en" };
  if (m(txt, LANG_AR_KW)) return { action: "setLanguage", lang: "ar" };
  if (m(txt, LANG_FA_KW)) return { action: "setLanguage", lang: "fa" };

  // ──── Activity navigation ────
  if (m(txt, NEXT_ACTIVITY_KW)) return { action: "nextActivity" };
  if (m(txt, PREV_ACTIVITY_KW)) return { action: "prevActivity" };

  // ──── Activity loading by name ────
  for (const [name, keywords] of Object.entries(ACTIVITY_NAME_KW)) {
    if (m(txt, keywords)) return { action: "loadActivity", name };
  }

  // ──── Check ────
  if (m(txt, CHECK_KW)) return { action: "check" };

  // ──── Undo / Redo ────
  if (m(txt, REDO_KW)) return { action: "redo" };
  if (m(txt, UNDO_KW)) return { action: "undo" };

  // ──── File operations ────
  if (m(txt, EXPORT_KW)) return { action: "exportPng" };
  if (m(txt, PRINT_KW)) return { action: "print" };
  if (m(txt, SAVE_KW)) return { action: "save" };
  if (m(txt, LOAD_KW)) return { action: "load" };

  // ──── Speak / Music ────
  if (m(txt, SPEAK_KW)) return { action: "speakInstruction" };
  if (m(txt, MUSIC_KW)) return { action: "playNote" };

  // ──── Clear ────
  if (m(txt, CLEAR_KW)) return { action: "clear" };

  // ──── Help / About ────
  if (m(txt, HELP_KW)) return { action: "help" };
  if (m(txt, ABOUT_KW)) return { action: "about" };

  // ──── Fallback: just a number → green chip ────
  if (num !== null && num >= 0 && num <= 20) {
    return { action: "placeChip", color: "green", label: String(num) };
  }

  return null;
}
