import { useState, useRef, useEffect, useCallback, useReducer } from "react";
/* ═══════════════════════════════════════════════════════════════
   DokunSay Basamak Değeri  v3.0
   Prof. Dr. Yılmaz Mutlu — Nisan 2026
   İyileştirmeler:
   ✅ Klavye erişilebilirliği (Q/W/E/R ekle, Del sil, Z undo, G grupla, B çöz, S seslendir)
   ✅ ARIA / ekran okuyucu desteği (aria-live, aria-label, role)
   ✅ Web Audio API ses geri bildirimi (gruplama, çözme, doğru/yanlış)
   ✅ SpeechSynthesis — Türkçe TTS
   ✅ Sayı doğrusu (Number Line) — blok değeriyle eşzamanlı
   ✅ Renk körü dostu: SVG doku desenleri (çizgi, nokta, diyagonal)
   ✅ On-Frame (10'luk çerçeve) görünümü
   ✅ Öğrenci ilerleme takibi (localStorage)
   ✅ Adaptif quiz zorluğu
   ✅ Bloom üst basamak quiz soruları (12 → 20 soru)
   ✅ Yüksek kontrast modu
   ✅ Font boyutu & disleksi dostu yazı tipi seçeneği
   ✅ Öğretmen rapor paneli
   ✅ useReducer ile merkezi durum yönetimi
   ✅ Anlamlı değişken adları & bileşen ayrımı
   ✅ Focus yönetimi & modal focus trap
═══════════════════════════════════════════════════════════════ */

/* ── Renk Paleti ── */
const PALETTE = {
  ones:"#d97706", onesB:"#92400e",
  tens:"#ea580c",  tensB:"#c2410c",
  huns:"#2563eb",  hunsB:"#1d4ed8",
  ths:"#7c3aed",   thsB:"#6d28d9",
  bg:"#f5f0e3", card:"#fffdf7", side:"#faf6ed", sideB:"#e5dcc8",
  accent:"#f59e0b", accentD:"#92400e", accentL:"rgba(245,158,11,.12)",
  text:"#3d3520", sh:"rgba(60,50,30,.06)", shM:"rgba(60,50,30,.1)"
};

/* ── Ölçüler ── */
const BLOCK_UNIT_PX = 14;
const HUNDRED_SIDE_PX = BLOCK_UNIT_PX * 10;   /* 140 */
const THOUSAND_SIDE_PX = HUNDRED_SIDE_PX + 20; /* 160 */
const GRID_SNAP = 16;

/* ── Blok Türleri ── */
const BLOCK_TYPES = [
  {t:"ones", label:"Birlik Küp",    val:1,    color:PALETTE.ones, colorB:PALETTE.onesB, icon:"▪", w:14,  h:14,  ariaDesc:"Bir birlik küp, değeri 1"},
  {t:"tens", label:"Onluk Çubuk",  val:10,   color:PALETTE.tens, colorB:PALETTE.tensB, icon:"▐", w:14,  h:140, ariaDesc:"Bir onluk çubuk, değeri 10"},
  {t:"huns", label:"Yüzlük Kare",  val:100,  color:PALETTE.huns, colorB:PALETTE.hunsB, icon:"■", w:140, h:140, ariaDesc:"Bir yüzlük kare, değeri 100"},
  {t:"ths",  label:"Binlik Küp",   val:1000, color:PALETTE.ths,  colorB:PALETTE.thsB,  icon:"▣", w:160, h:160, ariaDesc:"Bir binlik küp, değeri 1000"}
];

/* ── Etkinlikler ── */
const ACTIVITIES = [
  {n:"Serbest Keşif",          i:"🎨",cat:"keşif",   diff:1,d:"Blokları kanvasa sürükleyerek basamak değerini keşfet!",                            s:{}},
  {n:"Birlikler",              i:"🟡",cat:"kavram",  diff:1,d:"Birlik küplerini sürükle. Her küp 1 değerinde. 7 küp = 7",                           s:{ones:7,cols:2}},
  {n:"Onluklar",               i:"🟠",cat:"kavram",  diff:1,d:"Onluk çubuğu sürükle. Her çubuk 10 birlik içerir. 3 çubuk = 30",                    s:{tens:3,cols:2}},
  {n:"Yüzlükler",              i:"🔵",cat:"kavram",  diff:1,d:"Yüzlük kareyi sürükle. Her kare 100 birlik = 10 onluk içerir.",                      s:{huns:1,cols:3}},
  {n:"10 Birlik = 1 Onluk",    i:"🔄",cat:"kavram",  diff:2,d:"10 birlik küpü ekledik. Birine tıkla → 🔗 Grupla! (G tuşu)",                         s:{ones:10,cols:2}},
  {n:"Sayı Oluştur: 34",       i:"🔢",cat:"işlem",   diff:1,d:"3 onluk + 4 birlik = 34",                                                            s:{tens:3,ones:4,cols:2}},
  {n:"Sayı Oluştur: 152",      i:"🔢",cat:"işlem",   diff:2,d:"1 yüzlük + 5 onluk + 2 birlik = 152",                                               s:{huns:1,tens:5,ones:2,cols:3}},
  {n:"Sayı Oluştur: 2047",     i:"🔢",cat:"işlem",   diff:3,d:"2 binlik + 0 yüzlük + 4 onluk + 7 birlik = 2047",                                   s:{ths:2,tens:4,ones:7,cols:4}},
  {n:"Toplama: 25+18",         i:"➕",cat:"işlem",   diff:2,d:"25 ve 18 bloklarla gösterildi. Birlikler: 5+8=13 → 10 birliğe tıkla → Grupla!",     s:{tens:3,ones:13,cols:2}},
  {n:"Çıkarma: 43−17",         i:"➖",cat:"işlem",   diff:3,d:"43 gösterildi. 7 birlik çıkarmak için 1 onluğa tıkla → ✂ Çöz!",                     s:{tens:4,ones:3,cols:2}},
  {n:"Karşılaştır",            i:"⚖️",cat:"karşılaştır",diff:2,d:"Soldaki 256, sağdaki 289. Yüzlükler eşit — onluklara bak!",                     s:{huns:2,tens:5,ones:6,cols:3,decomp:true}},
  {n:"Y1: 3, 30 ve 300",       i:"🔍",cat:"yanılgı", diff:2,d:"324 gösterildi. 3 yüzlük = 300! Basamak değeri ≠ rakam.",                           s:{huns:3,tens:2,ones:4,cols:3,decomp:true}},
  {n:"Y2: Sıfırın önemi",      i:"🔍",cat:"yanılgı", diff:2,d:"304 gösterildi. Onluklar basamağı 0 — sıfır yer tutucu!",                           s:{huns:3,ones:4,cols:3,decomp:true}},
  {n:"Y3: Gruplama hatası",    i:"🔍",cat:"yanılgı", diff:3,d:"2 yüzlük + 13 onluk + 1 birlik ekledik. 13 onluğa tıkla → Grupla!",                 s:{huns:2,tens:13,ones:1,cols:3}},
  {n:"Y4: Sözel→Sembolik",     i:"🔍",cat:"yanılgı", diff:2,d:"304 gösterildi. 'Üç yüz dört' — 3004 değil!",                                       s:{huns:3,ones:4,cols:3,decomp:true}},
  {n:"Y5: Büyük rakam=Büyük?", i:"🔬",cat:"yanılgı", diff:2,d:"89 ve 102 karşılaştır. Basamak sayısı önemli!",                                      s:{huns:1,ones:2,cols:3,decomp:true}},
  {n:"Market Alışverişi",      i:"🛒",cat:"senaryo",  diff:1,d:"45₺ + 27₺ → toplam bloklar ekledik. Grupla!",                                       s:{tens:6,ones:12,cols:2}},
  {n:"Uzunluk Ölçme",          i:"📏",cat:"senaryo",  diff:2,d:"135cm gösterildi: 1 yüzlük + 3 onluk + 5 birlik",                                   s:{huns:1,tens:3,ones:5,cols:3}},
  {n:"Sınıf Mevcudu",          i:"🏫",cat:"senaryo",  diff:1,d:"386 öğrenci gösterildi.",                                                            s:{huns:3,tens:8,ones:6,cols:3}},
  {n:"Para Bozma",             i:"💰",cat:"senaryo",  diff:2,d:"500₺ gösterildi. Yüzlüğe tıkla → ✂ Çöz!",                                           s:{huns:5,cols:3}}
];

/* ── Bloom Taksonomisi: Geniş Quiz Havuzu (Hatırlama → Değerlendirme) ── */
const QUIZ_POOL = [
  /* Hatırlama (L1) */
  {q:"1 onluk kaç birliktir?",                o:["1","10","100","1000"],   a:1, bloom:1},
  {q:"1 yüzlük kaç onluktur?",                o:["1","10","100","1000"],   a:1, bloom:1},
  {q:"1 binlik kaç yüzlüktür?",               o:["10","100","1000","1"],   a:0, bloom:1},
  {q:"324'teki 2'nin basamak değeri?",         o:["2","20","200","2000"],   a:1, bloom:1},
  {q:"407'de kaç onluk var?",                  o:["4","0","7","40"],        a:1, bloom:1},
  /* Anlama (L2) */
  {q:"5 onluk + 3 birlik = ?",                o:["53","35","503","8"],     a:0, bloom:2},
  {q:"100 = ? onluk",                          o:["1","10","100","1000"],   a:1, bloom:2},
  {q:"'İki yüz altı' = ?",                    o:["260","206","2006","26"], a:1, bloom:2},
  {q:"999'dan sonra gelen sayı?",              o:["9910","1000","9100","9991"],a:1,bloom:2},
  {q:"300+40+7 = ?",                           o:["3047","3470","347","30047"],a:2,bloom:2},
  /* Uygulama (L3) */
  {q:"45+28 = ?",                             o:["63","73","613","6013"],  a:1, bloom:3},
  {q:"6 yüzlük + 15 onluk + 3 birlik = ?",    o:["6153","753","618","615"],a:1, bloom:3},
  {q:"Hangisi en büyük?",                      o:["98","203","197","89"],   a:1, bloom:3},
  {q:"12 onluk + 5 birlik = ?",                o:["125","175","1205","215"],a:0, bloom:3},
  /* Analiz (L4) */
  {q:"Hangi iki sayı toplamı 1000 yapar?",     o:["400+500","600+400","300+800","200+900"],a:1,bloom:4},
  {q:"875'te yüzler basamağındaki rakamın değeri?",o:["8","80","800","8000"],a:2,bloom:4},
  {q:"Aşağıdakilerden hangisi 304'ü gösterir?",o:["3 yüzlük 4 onluk","3 yüzlük 4 birlik","30 onluk 4 birlik","3 binlik 4 birlik"],a:1,bloom:4},
  /* Değerlendirme (L5) */
  {q:"13 onluk = kaç yüzlük + kaç onluk?",    o:["1 yüzlük 3 onluk","13 yüzlük","1 yüzlük 13 onluk","0 yüzlük 13 onluk"],a:0,bloom:5},
  {q:"1000 hangi gruba eşittir?",              o:["100 onluk","100 yüzlük","10 yüzlük","1000 birlik"],a:2,bloom:5},
  {q:"Hangi sayı 5 yüzlük + 17 onluktur?",    o:["517","5170","670","657"],a:2,bloom:5},
];

/* ══════════════════════════════════════════════════════════════
   ÇOKLU DİL SİSTEMİ  (Türkçe · Kurmancî · English)
══════════════════════════════════════════════════════════════ */

/* ── Sayı Okuma Motorları ── */
function readTurkish(n) {
  if (n === 0) return "sıfır";
  const ones = ["","bir","iki","üç","dört","beş","altı","yedi","sekiz","dokuz"];
  const tens  = ["","on","yirmi","otuz","kırk","elli","altmış","yetmiş","seksen","doksan"];
  let s = "", r = n;
  const th=Math.floor(r/1000); if(th>0){s+=(th>1?ones[th]+" ":"")+"bin ";r%=1000;}
  const hu=Math.floor(r/100);  if(hu>0){s+=(hu>1?ones[hu]+" ":"")+"yüz ";r%=100;}
  const t=Math.floor(r/10);    if(t>0){s+=tens[t]+" ";r%=10;}
  if(r>0)s+=ones[r];
  return s.trim();
}

/* Kurmancî sayı okuma — Excel kaynağına dayalı */
function readKurdish(n) {
  /* NYU Kurdish-Kurmanji Math Glossary (Gr.3-5) + omniglot.com + languagesandnumbers.com */
  if (n === 0) return "sifir";
  /* Rakamlar 1-9 */
  const ones = ["","yek","du","sê","çar","pênc","şeş","heft","heşt","neh"];
  /* 10-19: NYU Glossary doğrudan formları */
  const teens = ["deh","yanzdeh","dwanzdeh","sêzdeh","çardeh","panzdeh",
                 "şanzdeh","hevdeh","hejdeh","nozdeh"];
  /* 20-90: NYU + languagesandnumbers.com */
  const tensW = ["","deh","bîst","sih","çil","pêncî","şêst","heftê","heştê","nod"];
  const sep = " û "; /* Kurmancî bağlaç */
  let parts = [], r = n;
  /* Binler: hezar, du hezar... */
  const th = Math.floor(r / 1000);
  if (th > 0) { parts.push((th > 1 ? ones[th] + " " : "") + "hezar"); r %= 1000; }
  /* Yüzler: sed, du sed, sê sed... */
  const hu = Math.floor(r / 100);
  if (hu > 0) { parts.push((hu > 1 ? ones[hu] + " " : "") + "sed"); r %= 100; }
  /* 10-19: doğrudan teen sözcükleri */
  if (r >= 10 && r <= 19) { parts.push(teens[r - 10]); r = 0; }
  /* 20-90: onluklar (+ birler û ile bağlı) */
  const t = Math.floor(r / 10);
  if (t > 0) { const o = r % 10; parts.push(tensW[t] + (o > 0 ? sep + ones[o] : "")); r = 0; }
  /* 1-9 kalan */
  if (r > 0) parts.push(ones[r]);
  return parts.join(sep);
}

/* English number reading */
function readEnglish(n) {
  if (n === 0) return "zero";
  const sm = ["","one","two","three","four","five","six","seven","eight","nine",
               "ten","eleven","twelve","thirteen","fourteen","fifteen",
               "sixteen","seventeen","eighteen","nineteen"];
  const tens = ["","","twenty","thirty","forty","fifty","sixty","seventy","eighty","ninety"];
  function below100(x){
    if(x<20)return sm[x];
    const t=Math.floor(x/10),o=x%10;
    return tens[t]+(o?"-"+sm[o]:"");
  }
  let s="",r=n;
  const th=Math.floor(r/1000);
  if(th>0){s+=below100(th)+" thousand";r%=1000;if(r>0)s+=" ";}
  const hu=Math.floor(r/100);
  if(hu>0){s+=sm[hu]+" hundred";r%=100;if(r>0)s+=" and ";}
  if(r>0)s+=below100(r);
  return s.trim();
}

/* ── TTS — dile göre konuş ── */
function speakInLang(text, langCode) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utt = new SpeechSynthesisUtterance(text);
  utt.lang = langCode==="ku"?"ku":langCode==="en"?"en-US":"tr-TR";
  utt.rate = 0.85;
  window.speechSynthesis.speak(utt);
}
/* Geriye dönük uyumluluk */
function speakTurkish(text){ speakInLang(text,"tr"); }

/* ── Çeviri Tablosu ── */
const LANGS = {
  tr: {
    code:"tr", name:"Türkçe", flag:"🇹🇷",
    appTitle:"Basamak Değeri",
    /* Blok adları */
    ones:"Birlik Küp", tens:"Onluk Çubuk", huns:"Yüzlük Kare", ths:"Binlik Küp",
    onesShort:"Birlik", tensShort:"Onluk", hunsShort:"Yüzlük", thsShort:"Binlik",
    /* Basamak sütunları */
    colOnes:"Birler", colTens:"Onlar", colHuns:"Yüzler", colThs:"Binler",
    colSub:"Basamağı",
    /* Değer etiketi */
    equalsUnit:"birlik",
    /* Eylemler */
    group:"Grupla", groupShort:"Grupla (G)",
    breakApart:"Çöz", breakShort:"Çöz (B)",
    delete:"Sil", clear:"Temizle", undo:"Geri Al", redo:"İleri Al",
    start:"Başla ▸", close:"Kapat", ok:"Anladım ✓",
    add:"Ekle",
    /* Araçlar */
    toolMat:"Basamak Tablosu", toolVals:"Değerleri Göster",
    toolDecomp:"Çözümleme Diyagramı", toolTablet:"DokunSay Tableti",
    toolLine:"Sayı Doğrusu",
    /* Bilgi etiketleri */
    total:"Toplam", reading:"Okunuş", decomp:"Çözüm",
    expanded:"Genişletilmiş", placeTable:"BASAMAK DEĞERİ TABLOSU",
    decompTitle:"📐 Basamak Değeri Çözümlemesi",
    /* Kenar çubuğu sekmeleri */
    tabBlocks:"Bloklar", tabAct:"Etkinlik", tabGame:"Oyun", tabSettings:"Ayarlar",
    /* Erişilebilirlik */
    soundFx:"Ses Efektleri", autoSpeak:"Otomatik Seslendirme",
    colorBlindMode:"Renk Körü Modu", highContrastMode:"Yüksek Kontrast",
    fontLabel:"Yazı Tipi", fontSizeLabel:"Yazı Boyutu",
    /* Oyun */
    quiz:"Basamak Değeri Quiz", build:"Sayı Oluştur",
    score:"Puan", correct:"Doğru!", wrong:"Yanlış", again:"Tekrar dene!",
    checkBtn:"✓ Kontrol Et", buildPrompt:"Bu sayıyı bloklarla oluştur:",
    current:"Şu anki:",
    /* Boş kanvas */
    emptyLine1:"Blokları sürükleyerek basamak değerini keşfet!",
    emptyLine2:"← Sol panelden blokları kanvasa sürükle",
    emptyLine3:"Q=Birlik  W=Onluk  E=Yüzlük  R=Binlik",
    /* Rapor */
    reportTitle:"📊 Öğrenci İlerleme Raporu",
    totalQ:"Toplam Soru", correctQ:"Doğru", wrongQ:"Hatalı", sessionMin:"Oturum (dk)",
    /* Yardım kılavuzu */
    helpTitle:"📖 Kullanım Kılavuzu",
    /* Etkinlik */
    difficulty:"Zorluk:", easy:"Kolay", medium:"Orta", hard:"Zor",
    /* Tablet */
    tabSepBtn:"✂ Ayır", tabJoinBtn:"🔗 Birleştir",
    /* Hakkında */
    version:"v3.0 — Nisan 2026 • WCAG 2.1 AA Uyumlu",
    author:"Prof. Dr. Yılmaz Mutlu",
    /* Ses komutu */
    voiceStart:"🎙️ Dinlemeyi Başlat", voiceStop:"🔴 Dinliyor…",
    voiceCommands:"Ses Komutları", voiceMode1:"Basılı Tut", voiceMode2:"Sürekli Dinle",
    voiceRef:"Kullanılabilir Komutlar", voiceHist:"Son Komutlar",
    /* Sayfa */
    page:"Sayfa", addPage:"Yeni sayfa ekle",
    /* Sayı doğrusu */
    numberLine:"📏 SAYI DOĞRUSU",
    /* Gruplama uyarısı */
    autoGroup:"10+ grupla!",
    /* readFn */
    readNum: readTurkish,
    ttsLang:"tr-TR",
  },

  ku: {
    code:"ku", name:"Kurmancî", flag:"🏳",

    /* Uygulama başlığı — nirxane = basamak değeri tablosu/yeri */
    appTitle:"Nirxane",

    /* Blok adları — çovik = çubuk/rod (onluk), kûb = küp, xane = kare */
    ones:"Kûba Yekan",
    tens:"Çovika Dehane",     /* çovik = çubuk/rod */
    huns:"Xaneya Sedane",     /* xane = kare/square */
    ths:"Kûba Hezarane",
    onesShort:"Yekan", tensShort:"Dehane", hunsShort:"Sedane", thsShort:"Hezarane",

    /* Basamak sütunları */
    colOnes:"Yekan",
    colTens:"Dehane",         /* Dehane = onlar basamağı */
    colHuns:"Sedane",         /* sedane = yüzler basamağı */
    colThs:"Hezarane",        /* hezarane = binler basamağı */
    colSub:"Cih",
    equalsUnit:"yekan",

    /* Eylemler */
    group:"Kom bike",       groupShort:"Kom bike (G)",
    breakApart:"Veqetîne",  breakShort:"Veqetîne (B)",
    delete:"Jê bibe",  clear:"Paqij bike",
    undo:"Vegere",     redo:"Pêş ve",
    start:"Destpê bike ▸",  close:"Bigire",  ok:"Fêm kir ✓",
    add:"Zêde bike",

    /* Araçlar — nirxane = basamak değeri tablosu, jimarxez = sayı doğrusu */
    toolMat:"Nirxane",
    toolVals:"Nirxan Nîşan bide",
    toolDecomp:"Şemaya Nirxanê",
    toolTablet:"Tableta DokunSay",
    toolLine:"Jimarxez",          /* jimarxez = sayı doğrusu */

    /* Bilgi etiketleri — forma berfireh = genişletilmiş gösterim */
    total:"Kom",
    reading:"Xwendin",
    decomp:"Veqetandin",
    expanded:"Forma Berfireh",    /* forma berfireh = genişletilmiş gösterim */
    placeTable:"NIRXANE",
    decompTitle:"📐 Şemaya Nirxanê",

    /* Sekmeler */
    tabBlocks:"Blok", tabAct:"Çalakî", tabGame:"Lîstik", tabSettings:"Mîhengan",

    /* Erişilebilirlik */
    soundFx:"Dengên Bandorê",  autoSpeak:"Bixweber Bixwîne",
    colorBlindMode:"Moda Kor-Rengî",  highContrastMode:"Kontrasta Bilind",
    fontLabel:"Tîp",  fontSizeLabel:"Mezinahiya Tîpan",

    /* Oyun */
    quiz:"Quiza Nirxanê",  build:"Hejmarekê Çêke",
    score:"Xal",  correct:"Rast!",  wrong:"Xelet",  again:"Dîsa biceribîne!",
    checkBtn:"✓ Kontrol bike",
    buildPrompt:"Vê hejmarê bi blokan çêke:",
    current:"Niha:",

    /* Boş kanvas */
    emptyLine1:"Blokan kaşke û nirxanê keşf bike!",
    emptyLine2:"← Ji panela çepê blokan kaşke",
    emptyLine3:"Q=Yekan  W=Dehane  E=Sedane  R=Hezarane",

    /* Rapor */
    reportTitle:"📊 Rapora Pêşkeftina Xwendekar",
    totalQ:"Hejmara Pirsan",
    correctQ:"Rast",  wrongQ:"Xelet",
    sessionMin:"Dem (deq)",

    /* Yardım */
    helpTitle:"📖 Rêbernameya Bikaranînê",

    /* Etkinlik */
    difficulty:"Astengî:",  easy:"Hêsan",  medium:"Navîn",  hard:"Dijwar",

    /* Tablet */
    tabSepBtn:"✂ Cûda bike",  tabJoinBtn:"🔗 Berhev bike",

    /* Hakkında */
    version:"v3.0 — Nîsan 2026",
    author:"Prof. Dr. Yılmaz Mutlu",

    /* Ses komutu */
    voiceStart:"🎙️ Guhdarîkirinê Destpê bike",
    voiceStop:"🔴 Guhdarî dike…",
    voiceCommands:"Fermanên Dengî",
    voiceMode1:"Zext bike",  voiceMode2:"Domdar Guhdarî bike",
    voiceRef:"Fermanên Berdest",  voiceHist:"Fermanên Dawî",

    /* Sayfa */
    page:"Rûpel",  addPage:"Rûpeleke nû zêde bike",

    /* Sayı doğrusu — jimarxez */
    numberLine:"📏 JIMARXEZ",

    /* Gruplama uyarısı */
    autoGroup:"10+ kom bike!",

    readNum: readKurdish,
    ttsLang:"ku",
  },

  en: {
    code:"en", name:"English", flag:"🇬🇧",
    appTitle:"Place Value",
    ones:"Unit Cube", tens:"Ten Rod", huns:"Hundred Square", ths:"Thousand Cube",
    onesShort:"Unit", tensShort:"Ten", hunsShort:"Hundred", thsShort:"Thousand",
    colOnes:"Ones", colTens:"Tens", colHuns:"Hundreds", colThs:"Thousands",
    colSub:"Place",
    equalsUnit:"units",
    group:"Group", groupShort:"Group (G)",
    breakApart:"Break", breakShort:"Break (B)",
    delete:"Delete", clear:"Clear", undo:"Undo", redo:"Redo",
    start:"Start ▸", close:"Close", ok:"Got it ✓",
    add:"Add",
    toolMat:"Place Value Chart", toolVals:"Show Values",
    toolDecomp:"Decomposition Diagram", toolTablet:"DokunSay Tablet",
    toolLine:"Number Line",
    total:"Total", reading:"Reading", decomp:"Breakdown",
    expanded:"Expanded form", placeTable:"PLACE VALUE CHART",
    decompTitle:"📐 Place Value Decomposition",
    tabBlocks:"Blocks", tabAct:"Activities", tabGame:"Games", tabSettings:"Settings",
    soundFx:"Sound Effects", autoSpeak:"Auto Read-Aloud",
    colorBlindMode:"Color Blind Mode", highContrastMode:"High Contrast",
    fontLabel:"Font", fontSizeLabel:"Font Size",
    quiz:"Place Value Quiz", build:"Build a Number",
    score:"Score", correct:"Correct!", wrong:"Incorrect", again:"Try again!",
    checkBtn:"✓ Check", buildPrompt:"Build this number with blocks:",
    current:"Current:",
    emptyLine1:"Drag blocks to explore place value!",
    emptyLine2:"← Drag blocks from the left panel",
    emptyLine3:"Q=Ones  W=Tens  E=Hundreds  R=Thousands",
    reportTitle:"📊 Student Progress Report",
    totalQ:"Total Questions", correctQ:"Correct", wrongQ:"Wrong", sessionMin:"Session (min)",
    helpTitle:"📖 User Guide",
    difficulty:"Difficulty:", easy:"Easy", medium:"Medium", hard:"Hard",
    tabSepBtn:"✂ Separate", tabJoinBtn:"🔗 Join",
    version:"v3.0 — April 2026 • WCAG 2.1 AA",
    author:"Prof. Dr. Yılmaz Mutlu",
    voiceStart:"🎙️ Start Listening", voiceStop:"🔴 Listening…",
    voiceCommands:"Voice Commands", voiceMode1:"Push to Talk", voiceMode2:"Continuous",
    voiceRef:"Available Commands", voiceHist:"Recent Commands",
    page:"Page", addPage:"Add new page",
    numberLine:"📏 NUMBER LINE",
    autoGroup:"10+ group!",
    readNum: readEnglish,
    ttsLang:"en-US",
  }
};

/* ── Web Audio Yardımcıları ── */
function createAudioContext() {
  try { return new (window.AudioContext || window.webkitAudioContext)(); } catch(e) { return null; }
}
function playTone(ctx, freq, type, duration, volume) {
  if (!ctx) return;
  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type || "sine";
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(volume || 0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain); gain.connect(ctx.destination);
    osc.start(); osc.stop(ctx.currentTime + duration);
  } catch(e) {}
}
function playGroup(ctx) {
  playTone(ctx, 523, "triangle", 0.1, 0.25);
  setTimeout(() => playTone(ctx, 784, "triangle", 0.15, 0.3), 80);
}
function playBreak(ctx) {
  playTone(ctx, 392, "sawtooth", 0.08, 0.2);
  setTimeout(() => playTone(ctx, 261, "sawtooth", 0.12, 0.25), 70);
}
function playAdd(ctx) { playTone(ctx, 440, "sine", 0.08, 0.2); }
function playRemove(ctx) { playTone(ctx, 220, "triangle", 0.1, 0.15); }
function playCorrect(ctx) {
  [523,659,784,1046].forEach((f,i) => setTimeout(() => playTone(ctx,f,"triangle",0.12,0.3), i*80));
}
function playWrong(ctx) {
  playTone(ctx, 220, "square", 0.2, 0.25);
  setTimeout(() => playTone(ctx, 196, "square", 0.2, 0.3), 150);
}



/* ── SVG Doku Desenleri (Renk Körü Desteği) ── */
function BlockPatternDefs() {
  return (
    <defs>
      <pattern id="pat-ones" patternUnits="userSpaceOnUse" width="4" height="4">
        <rect width="4" height="4" fill="#fde047"/>
        <circle cx="2" cy="2" r="1" fill="#a16207" opacity="0.6"/>
      </pattern>
      <pattern id="pat-tens" patternUnits="userSpaceOnUse" width="4" height="4">
        <rect width="4" height="4" fill="#fb923c"/>
        <line x1="0" y1="0" x2="4" y2="4" stroke="#c2410c" strokeWidth="1" opacity="0.5"/>
      </pattern>
      <pattern id="pat-huns" patternUnits="userSpaceOnUse" width="5" height="5">
        <rect width="5" height="5" fill="#60a5fa"/>
        <line x1="0" y1="2.5" x2="5" y2="2.5" stroke="#1d4ed8" strokeWidth="0.7" opacity="0.5"/>
        <line x1="2.5" y1="0" x2="2.5" y2="5" stroke="#1d4ed8" strokeWidth="0.7" opacity="0.5"/>
      </pattern>
      <pattern id="pat-ths" patternUnits="userSpaceOnUse" width="6" height="6">
        <rect width="6" height="6" fill="#a78bfa"/>
        <line x1="0" y1="0" x2="6" y2="6" stroke="#4c1d95" strokeWidth="1" opacity="0.5"/>
        <line x1="6" y1="0" x2="0" y2="6" stroke="#4c1d95" strokeWidth="1" opacity="0.5"/>
      </pattern>
    </defs>
  );
}

/* ── Block SVG — Erişilebilir, Doku Destekli ── */
const U = BLOCK_UNIT_PX;
const W = HUNDRED_SIDE_PX;

function BlockSVG({ type, size, showVal, colorBlind }) {
  const s = size || 1;
  const fillRef = colorBlind ? `url(#pat-${type})` : undefined;

  if (type === "ones") {
    const fill = fillRef || "url(#g1)";
    return (
      <svg width={U*s} height={U*s} viewBox={`0 0 ${U} ${U}`} role="img" aria-label="Birlik küp: 1">
        <defs>
          <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fef08a"/>
            <stop offset="100%" stopColor={PALETTE.ones}/>
          </linearGradient>
        </defs>
        <rect x={.5} y={.5} width={U-1} height={U-1} rx={2} fill={fill} stroke={PALETTE.onesB} strokeWidth={1}/>
        {showVal && <text x={U/2} y={U/2+1} textAnchor="middle" dominantBaseline="middle" fontSize={7} fontWeight={900} fill="#7a3d00">{"1"}</text>}
      </svg>
    );
  }
  if (type === "tens") {
    const fill = fillRef || "url(#g10)";
    return (
      <svg width={U*s} height={W*s} viewBox={`0 0 ${U} ${W}`} role="img" aria-label="Onluk çubuk: 10">
        <defs>
          <linearGradient id="g10" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#fdba74"/>
            <stop offset="100%" stopColor={PALETTE.tens}/>
          </linearGradient>
        </defs>
        <rect x={.5} y={.5} width={U-1} height={W-1} rx={2} fill={fill} stroke={PALETTE.tensB} strokeWidth={1}/>
        {Array.from({length:9},(_,i)=>(
          <line key={i} x1={1} y1={U*(i+1)} x2={U-1} y2={U*(i+1)} stroke="rgba(255,255,255,.35)" strokeWidth={.7}/>
        ))}
        {showVal && <text x={U/2} y={W/2} textAnchor="middle" dominantBaseline="middle" fontSize={9} fontWeight={900} fill="#fff" transform={`rotate(-90,${U/2},${W/2})`}>{"10"}</text>}
      </svg>
    );
  }
  if (type === "huns") {
    const fill = fillRef || "url(#g100)";
    return (
      <svg width={W*s} height={W*s} viewBox={`0 0 ${W} ${W}`} role="img" aria-label="Yüzlük kare: 100">
        <defs>
          <linearGradient id="g100" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#93c5fd"/>
            <stop offset="100%" stopColor={PALETTE.huns}/>
          </linearGradient>
        </defs>
        <rect x={.5} y={.5} width={W-1} height={W-1} rx={3} fill={fill} stroke={PALETTE.hunsB} strokeWidth={1.5}/>
        {Array.from({length:9},(_,i)=>(
          <g key={i}>
            <line x1={1} y1={U*(i+1)} x2={W-1} y2={U*(i+1)} stroke="rgba(255,255,255,.2)" strokeWidth={.5}/>
            <line x1={U*(i+1)} y1={1} x2={U*(i+1)} y2={W-1} stroke="rgba(255,255,255,.2)" strokeWidth={.5}/>
          </g>
        ))}
        {showVal && <text x={W/2} y={W/2} textAnchor="middle" dominantBaseline="middle" fontSize={16} fontWeight={900} fill="rgba(255,255,255,.6)">{"100"}</text>}
      </svg>
    );
  }
  if (type === "ths") {
    const D = 20;
    const fill = fillRef || PALETTE.ths;
    return (
      <svg width={(W+D)*s} height={(W+D)*s} viewBox={`0 0 ${W+D} ${W+D}`} role="img" aria-label="Binlik küp: 1000">
        <polygon points={`${W},${D} ${W+D},0 ${W+D},${W} ${W},${W+D}`} fill="#6d28d9" stroke="#5b21b6" strokeWidth={1}/>
        <polygon points={`0,${D} ${D},0 ${W+D},0 ${W},${D}`} fill="#a78bfa" stroke="#7c3aed" strokeWidth={1}/>
        <rect x={0} y={D} width={W} height={W} rx={2} fill={fill} stroke={PALETTE.thsB} strokeWidth={1.5}/>
        {Array.from({length:9},(_,i)=>(
          <g key={i}>
            <line x1={1} y1={D+U*(i+1)} x2={W-1} y2={D+U*(i+1)} stroke="rgba(255,255,255,.12)" strokeWidth={.3}/>
            <line x1={U*(i+1)} y1={D+1} x2={U*(i+1)} y2={D+W-1} stroke="rgba(255,255,255,.12)" strokeWidth={.3}/>
          </g>
        ))}
        {showVal && <text x={W/2} y={D+W/2} textAnchor="middle" dominantBaseline="middle" fontSize={16} fontWeight={900} fill="rgba(255,255,255,.5)">{"1000"}</text>}
      </svg>
    );
  }
  return null;
}

/* ── Sayı Doğrusu Bileşeni ── */
function NumberLine({ value, maxVal }) {
  const max = Math.max(maxVal, 10, Math.ceil((value + 5) / 10) * 10);
  const W_LINE = 520;
  const H_LINE = 60;
  const pad = 30;
  const usable = W_LINE - pad * 2;
  const toX = (v) => pad + (v / max) * usable;
  const markerX = Math.min(toX(value), W_LINE - 4);
  const ticks = [];
  const step = max <= 20 ? 1 : max <= 100 ? 10 : max <= 500 ? 50 : 100;
  for (let v = 0; v <= max; v += step) {
    const x = toX(v);
    const isMajor = v % (step * 5) === 0 || step === 1;
    ticks.push({ v, x, isMajor });
  }
  return (
    <svg width="100%" height={H_LINE} viewBox={`0 0 ${W_LINE} ${H_LINE}`}
      role="img" aria-label={`Sayı doğrusu, mevcut değer ${value}`}
      style={{display:"block"}}>
      <BlockPatternDefs/>
      {/* Ana çizgi */}
      <line x1={pad} y1={30} x2={W_LINE-pad} y2={30} stroke="#d4c8b0" strokeWidth={2.5} strokeLinecap="round"/>
      {/* Ok ucu */}
      <polygon points={`${W_LINE-pad+2},30 ${W_LINE-pad-6},26 ${W_LINE-pad-6},34`} fill="#d4c8b0"/>
      {/* Tik işaretleri */}
      {ticks.map(({v,x,isMajor})=>(
        <g key={v}>
          <line x1={x} y1={isMajor?22:27} x2={x} y2={33} stroke="#b5a990" strokeWidth={isMajor?1.5:0.8}/>
          {isMajor && <text x={x} y={44} textAnchor="middle" fontSize={9} fontWeight={700} fill="#b5a990">{v}</text>}
        </g>
      ))}
      {/* Mevcut değer göstergesi */}
      {value > 0 && (
        <g>
          <line x1={markerX} y1={14} x2={markerX} y2={32} stroke={PALETTE.accent} strokeWidth={2.5}/>
          <circle cx={markerX} cy={14} r={9} fill={PALETTE.accent} stroke="#fff" strokeWidth={1.5}/>
          <text x={markerX} y={18} textAnchor="middle" fontSize={value >= 100 ? 7 : 9} fontWeight={900} fill="#fff">{value}</text>
        </g>
      )}
    </svg>
  );
}

/* ── On-Frame (10'luk Çerçeve) Bileşeni ── */

/* ── Durum Azaltıcısı ── */
const initialState = {
  items: [], itemHistory: [], itemFuture: [],
  strokes: [], undone: [],
  pages: [{id:1, label:"Sayfa 1"}], currentPageId: 1,
  pageData: {},
};

function itemsReducer(state, action) {
  switch(action.type) {
    case "SET_ITEMS": return {...state, items: action.items};
    case "PUSH_HISTORY": return {
      ...state,
      itemHistory: [...state.itemHistory.slice(-29), state.items],
      itemFuture: []
    };
    case "UNDO": {
      if (!state.itemHistory.length) return state;
      const prev = state.itemHistory[state.itemHistory.length - 1];
      return {
        ...state,
        items: prev,
        itemHistory: state.itemHistory.slice(0, -1),
        itemFuture: [...state.itemFuture, state.items]
      };
    }
    case "REDO": {
      if (!state.itemFuture.length) return state;
      const next = state.itemFuture[state.itemFuture.length - 1];
      return {
        ...state,
        items: next,
        itemFuture: state.itemFuture.slice(0, -1),
        itemHistory: [...state.itemHistory, state.items]
      };
    }
    case "ADD_ITEM": {
      const snap = v => Math.round(v / GRID_SNAP) * GRID_SNAP;
      return {
        ...state,
        itemHistory: [...state.itemHistory.slice(-29), state.items],
        itemFuture: [],
        items: [...state.items, {id: action.id, t: action.blockType, x: snap(action.x), y: snap(action.y)}]
      };
    }
    case "MOVE_ITEM": {
      const snap = v => Math.round(v / GRID_SNAP) * GRID_SNAP;
      return {
        ...state,
        items: state.items.map(it => it.id === action.id ? {...it, x: snap(action.x), y: snap(action.y)} : it)
      };
    }
    case "REMOVE_ITEM": return {
      ...state,
      itemHistory: [...state.itemHistory.slice(-29), state.items],
      itemFuture: [],
      items: state.items.filter(it => it.id !== action.id)
    };
    case "SET_ITEMS_BATCH": return {
      ...state,
      itemHistory: [...state.itemHistory.slice(-29), state.items],
      itemFuture: [],
      items: action.items
    };
    case "CLEAR_ALL": return {
      ...state,
      itemHistory: state.items.length ? [...state.itemHistory.slice(-29), state.items] : state.itemHistory,
      itemFuture: [],
      items: [], strokes: []
    };
    case "SET_STROKES": return {...state, strokes: action.strokes};
    case "ADD_STROKE": return {
      ...state,
      strokes: [...state.strokes, action.stroke],
      undone: []
    };
    case "UNDO_STROKE": {
      if (!state.strokes.length) return state;
      const last = state.strokes[state.strokes.length - 1];
      return {
        ...state,
        strokes: state.strokes.slice(0,-1),
        undone: [...state.undone, last]
      };
    }
    case "REDO_STROKE": {
      if (!state.undone.length) return state;
      const last = state.undone[state.undone.length - 1];
      return {
        ...state,
        strokes: [...state.strokes, last],
        undone: state.undone.slice(0,-1)
      };
    }
    case "SWITCH_PAGE": {
      const saved = state.pageData[action.pid] || {};
      return {
        ...state,
        pageData: {...state.pageData, [state.currentPageId]: {items: state.items, strokes: state.strokes}},
        currentPageId: action.pid,
        items: saved.items || [],
        strokes: saved.strokes || [],
        itemHistory: [], itemFuture: [], undone: []
      };
    }
    case "ADD_PAGE": return {
      ...state,
      pageData: {...state.pageData, [state.currentPageId]: {items: state.items, strokes: state.strokes}},
      pages: [...state.pages, {id: action.id, label: "Sayfa "+action.id}],
      currentPageId: action.id,
      items: [], strokes: [],
      itemHistory: [], itemFuture: [], undone: []
    };
    case "DELETE_PAGE": {
      if (state.pages.length <= 1) return state;
      const remaining = state.pages.filter(p => p.id !== action.pid);
      const nextId = state.currentPageId === action.pid ? remaining[0].id : state.currentPageId;
      const newData = {...state.pageData};
      delete newData[action.pid];
      const saved = newData[nextId] || {};
      return {
        ...state,
        pages: remaining,
        pageData: newData,
        currentPageId: nextId,
        items: state.currentPageId === action.pid ? (saved.items || []) : state.items,
        strokes: state.currentPageId === action.pid ? (saved.strokes || []) : state.strokes,
      };
    }
    default: return state;
  }
}

/* ── İlerleme Yönetimi ── */
function loadProgress() {
  try {
    const raw = localStorage.getItem("dokun_say_progress");
    return raw ? JSON.parse(raw) : {sessions:[], quizHistory:[], totalTime:0};
  } catch(e) { return {sessions:[], quizHistory:[], totalTime:0}; }
}
function saveProgress(p) {
  try { localStorage.setItem("dokun_say_progress", JSON.stringify(p)); } catch(e) {}
}

/* ══════════════════════════════════════════════════════════════
   SES KOMUTU SİSTEMİ — Türkçe NLP + SpeechRecognition
══════════════════════════════════════════════════════════════ */

/* ── Türkçe Sayı Ayrıştırıcı ── */
const TR_ONES  = {sıfır:0,bir:1,iki:2,üç:3,dört:4,beş:5,altı:6,yedi:7,sekiz:8,dokuz:9};
const TR_TENS  = {on:10,yirmi:20,otuz:30,kırk:40,elli:50,altmış:60,yetmiş:70,seksen:80,doksan:90};
const TR_SCALE = {yüz:100,bin:1000};

function parseTurkishNumber(text) {
  /* "iki yüz kırk beş" → 245  |  "bin iki yüz" → 1200  |  "üç" → 3 */
  const words = text.toLowerCase().trim().split(/\s+/);
  let total = 0, current = 0;

  for (let i = 0; i < words.length; i++) {
    const w = words[i];
    if (w in TR_ONES)       { current += TR_ONES[w]; }
    else if (w in TR_TENS)  { current += TR_TENS[w]; }
    else if (w === "yüz")   { current = current === 0 ? 100 : current * 100; }
    else if (w === "bin")   { current = current === 0 ? 1000 : current * 1000; total += current; current = 0; }
  }
  total += current;
  return total > 0 ? total : null;
}

/* Metinden sayı tara — "iki birlik ekle" → {count:2, rest:"birlik ekle"} */
function extractLeadingNumber(text) {
  const words = text.split(/\s+/);
  let numWords = [], i = 0;
  while (i < words.length) {
    const w = words[i].toLowerCase();
    if (w in TR_ONES || w in TR_TENS || w === "yüz" || w === "bin") {
      numWords.push(words[i]); i++;
    } else break;
  }
  if (!numWords.length) return {count:1, rest:text};
  const count = parseTurkishNumber(numWords.join(" ")) || 1;
  return {count, rest: words.slice(i).join(" ")};
}

/* ── Komut Yorumlayıcı ── */
/*
  Döndürdüğü yapı:
  { type, payload, label, confidence }
  type: ADD_BLOCK | GROUP | BREAK | CLEAR | UNDO | REDO | SPEAK |
        SHOW_NUMBER | QUIZ | BUILD | TOGGLE_TOOL | ZOOM | PAGE |
        SHOW_WIDGET | HELP | UNKNOWN
*/
function interpretCommand(raw) {
  const t = raw.toLowerCase()
    .replace(/[.,!?]/g,"")
    .replace(/\bi̇\b/g,"i")           /* Türkçe büyük İ */
    .trim();

  /* Yardım */
  if (/yardım|komutlar|ne yapabilirim/.test(t))
    return {type:"HELP", label:"Komut listesi açıldı"};

  /* Temizle */
  if (/temizle|hepsini sil|sıfırla|kanvası temizle/.test(t))
    return {type:"CLEAR", label:"Kanvas temizlendi"};

  /* Geri / İleri */
  if (/geri al|iptal/.test(t)) return {type:"UNDO", label:"Geri alındı"};
  if (/ileri al|yinele/.test(t)) return {type:"REDO", label:"İleri alındı"};

  /* Seslendir */
  if (/oku|söyle|seslendir|toplam nedir|kaç( edi[ry])?|değer nedir/.test(t))
    return {type:"SPEAK", label:"Toplam seslendirildi"};

  /* Quiz */
  if (/quiz başlat|quiz|sınav başlat/.test(t))
    return {type:"QUIZ", label:"Quiz başlatıldı"};

  /* Sayı Oluştur */
  if (/sayı oluştur|inşa et|hedef sayı/.test(t))
    return {type:"BUILD", label:"Sayı Oluştur başlatıldı"};

  /* Gruplama */
  const grpMatch = t.match(/(\w+\s+)?grupla/);
  if (grpMatch) {
    const pre = (grpMatch[1]||"").trim();
    const bt = pre==="birlik"?"ones":pre==="onluk"?"tens":pre==="yüzlük"?"huns":null;
    return {type:"GROUP", payload:{blockType:bt}, label:"Gruplama komutu"};
  }

  /* Çözme */
  const brkMatch = t.match(/(\w+\s+)?çöz/);
  if (brkMatch) {
    const pre = (brkMatch[1]||"").trim();
    const bt = pre==="onluk"?"tens":pre==="yüzlük"?"huns":pre==="binlik"?"ths":null;
    return {type:"BREAK", payload:{blockType:bt}, label:"Çözme komutu"};
  }

  /* Sayıyı bloklarla göster — "iki yüz kırk beşi göster" / "üç yüz göster" */
  const showMatch = t.match(/^(.+?)\s+(göster|oluştur|yap|ekle|koy)$/);
  if (showMatch) {
    const numPart = showMatch[1];
    const n = parseTurkishNumber(numPart);
    if (n && n > 0 && n <= 9999)
      return {type:"SHOW_NUMBER", payload:{n}, label:`${n} bloklarla gösteriliyor`};
  }

  /* Blok ekleme — "N birlik/onluk/yüzlük/binlik ekle" */
  const blockPatterns = [
    {rx:/^(.+?\s+)?birlik(\s+ekle)?$/,  bt:"ones",  label:"birlik"},
    {rx:/^(.+?\s+)?onluk(\s+ekle)?$/,   bt:"tens",  label:"onluk"},
    {rx:/^(.+?\s+)?yüzlük(\s+ekle)?$/,  bt:"huns",  label:"yüzlük"},
    {rx:/^(.+?\s+)?binlik(\s+ekle)?$/,  bt:"ths",   label:"binlik"},
    /* Alternatif: "bir tane birlik" / "iki tane onluk" */
    {rx:/^(.+?)\s+tane\s+birlik/,       bt:"ones",  label:"birlik"},
    {rx:/^(.+?)\s+tane\s+onluk/,        bt:"tens",  label:"onluk"},
    {rx:/^(.+?)\s+tane\s+yüzlük/,       bt:"huns",  label:"yüzlük"},
    {rx:/^(.+?)\s+tane\s+binlik/,       bt:"ths",   label:"binlik"},
  ];
  for (const {rx,bt,label} of blockPatterns) {
    const m = t.match(rx);
    if (m) {
      const prefix = (m[1]||"").trim();
      const count = prefix ? (parseTurkishNumber(prefix)||1) : 1;
      const safe = Math.min(count, 20);
      return {type:"ADD_BLOCK", payload:{blockType:bt,count:safe},
              label:`${safe} ${label} eklendi`};
    }
  }

  /* Araç göster/gizle */
  if (/basamak tablosu?\s*(göster|aç)/i.test(t))  return {type:"TOGGLE_WIDGET", payload:{w:"mat",v:true},  label:"Basamak tablosu açıldı"};
  if (/basamak tablosu?\s*(gizle|kapat)/i.test(t)) return {type:"TOGGLE_WIDGET", payload:{w:"mat",v:false}, label:"Basamak tablosu kapatıldı"};
  if (/sayı doğrusu?\s*(göster|aç)/i.test(t))      return {type:"TOGGLE_WIDGET", payload:{w:"line",v:true},  label:"Sayı doğrusu açıldı"};
  if (/sayı doğrusu?\s*(gizle|kapat)/i.test(t))    return {type:"TOGGLE_WIDGET", payload:{w:"line",v:false}, label:"Sayı doğrusu kapatıldı"};
  if (/çerçeve\s*(göster|aç)/i.test(t))            return {type:"TOGGLE_WIDGET", payload:{w:"frame",v:true},  label:"On'luk çerçeve açıldı"};
  if (/çerçeve\s*(gizle|kapat)/i.test(t))          return {type:"TOGGLE_WIDGET", payload:{w:"frame",v:false}, label:"On'luk çerçeve kapatıldı"};
  if (/değerleri?\s*(göster|aç)/i.test(t))         return {type:"TOGGLE_WIDGET", payload:{w:"vals",v:true},  label:"Değerler gösterildi"};
  if (/değerleri?\s*(gizle|kapat)/i.test(t))       return {type:"TOGGLE_WIDGET", payload:{w:"vals",v:false}, label:"Değerler gizlendi"};
  if (/çözümleme\s*(göster|aç)/i.test(t))          return {type:"TOGGLE_WIDGET", payload:{w:"decomp",v:true},  label:"Çözümleme diyagramı açıldı"};
  if (/çözümleme\s*(gizle|kapat)/i.test(t))        return {type:"TOGGLE_WIDGET", payload:{w:"decomp",v:false}, label:"Çözümleme diyagramı kapatıldı"};
  if (/tablet\s*(göster|aç)/i.test(t))             return {type:"TOGGLE_WIDGET", payload:{w:"tablet",v:true},  label:"DokunSay Tableti açıldı"};
  if (/tablet\s*(gizle|kapat)/i.test(t))           return {type:"TOGGLE_WIDGET", payload:{w:"tablet",v:false}, label:"DokunSay Tableti kapatıldı"};

  /* Zoom */
  if (/büyüt|yakınlaştır/.test(t))    return {type:"ZOOM", payload:{dir:1},  label:"Yakınlaştırıldı"};
  if (/küçült|uzaklaştır/.test(t))    return {type:"ZOOM", payload:{dir:-1}, label:"Uzaklaştırıldı"};
  if (/normal boyut|yüzde yüz|sıfırla zoom/.test(t)) return {type:"ZOOM", payload:{dir:0}, label:"Zoom sıfırlandı"};

  /* Yeni Sayfa */
  if (/yeni sayfa|sayfa ekle/.test(t)) return {type:"PAGE", label:"Yeni sayfa eklendi"};

  /* Renk körü / yüksek kontrast */
  if (/renk körü\s*(aç|etkinleştir)/i.test(t))   return {type:"TOGGLE_WIDGET", payload:{w:"colorBlind",v:true},  label:"Renk körü modu açıldı"};
  if (/renk körü\s*(kapat|devre)/i.test(t))       return {type:"TOGGLE_WIDGET", payload:{w:"colorBlind",v:false}, label:"Renk körü modu kapatıldı"};
  if (/yüksek kontrast\s*(aç|etkin)/i.test(t))   return {type:"TOGGLE_WIDGET", payload:{w:"contrast",v:true},  label:"Yüksek kontrast açıldı"};
  if (/yüksek kontrast\s*(kapat|devre)/i.test(t)) return {type:"TOGGLE_WIDGET", payload:{w:"contrast",v:false}, label:"Yüksek kontrast kapatıldı"};

  return {type:"UNKNOWN", label:`Anlaşılamadı: "${raw}"`};
}

/* ── SpeechRecognition Desteği Kontrolü ── */
const SPEECH_SUPPORTED = typeof window !== "undefined" &&
  !!(window.SpeechRecognition || window.webkitSpeechRecognition);

/* ══════════════════════════════════════════════════════════════
   Ana Uygulama
══════════════════════════════════════════════════════════════ */
export default function App() {

  /* ── Merkezi Durum ── */
  const [ds, dispatch] = useReducer(itemsReducer, initialState);
  const { items, itemHistory, itemFuture, strokes, undone, pages, currentPageId } = ds;

  /* ── Blok ID Üretici ── */
  const blockIdCounter = useRef(1);
  const nextId = () => blockIdCounter.current++;

  /* ── Ses ── */
  const audioCtxRef = useRef(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const play = useCallback((fn) => {
    if (!soundEnabled) return;
    if (!audioCtxRef.current) audioCtxRef.current = createAudioContext();
    fn(audioCtxRef.current);
  }, [soundEnabled]);

  /* ── Dil ── */
  const [langCode, setLangCode] = useState("tr");
  const L = LANGS[langCode] || LANGS.tr;
  const t = key => L[key] ?? LANGS.tr[key] ?? key;
  const readNum = n => L.readNum(n);

  /* ── TTS ── */
  const [ttsEnabled, setTtsEnabled] = useState(false);

  /* ── Erişilebilirlik Duyuru Bölgesi ── */
  const [ariaMsg, setAriaMsg] = useState("");
  const announce = useCallback((msg) => {
    setAriaMsg("");
    setTimeout(() => setAriaMsg(msg), 50);
    if (ttsEnabled) speakInLang(msg, langCode);
  }, [ttsEnabled, langCode]);
  const speak = useCallback(text => {
    if (ttsEnabled) speakInLang(text, langCode);
  }, [ttsEnabled, langCode]);

  /* ── Blok İşlemleri ── */
  const counts = {ones:0, tens:0, huns:0, ths:0};
  items.forEach(it => { if (counts[it.t] !== undefined) counts[it.t]++; });
  const totalValue = counts.ones + counts.tens*10 + counts.huns*100 + counts.ths*1000;

  const addItem = useCallback((blockType, x, y) => {
    dispatch({type:"ADD_ITEM", id: nextId(), blockType, x, y});
    play(playAdd);
  }, [play]);

  const removeItem = useCallback((id) => {
    dispatch({type:"REMOVE_ITEM", id});
    play(playRemove);
  }, [play]);

  const moveItem = useCallback((id, x, y) => {
    dispatch({type:"MOVE_ITEM", id, x, y});
  }, []);

  /* ── Gruplama & Çözme ── */
  const SUP = {ones:"tens", tens:"huns", huns:"ths"};
  const SUB = {ths:"huns", huns:"tens", tens:"ones"};

  function groupItem(id) {
    const item = items.find(it => it.id === id);
    if (!item || item.t === "ths") return;
    const same = items.filter(it => it.t === item.t);
    if (same.length < 10) {
      announce(`Gruplama için en az 10 ${BLOCK_TYPES.find(b=>b.t===item.t).label} gerekli. Şu an ${same.length} var.`);
      return;
    }
    const sup = SUP[item.t];
    let removed = 0, cx = 0, cy = 0;
    const nextItems = [];
    items.forEach(it => {
      if (it.t === item.t && removed < 10) { removed++; cx+=it.x; cy+=it.y; return; }
      nextItems.push(it);
    });
    nextItems.push({id: nextId(), t: sup, x: Math.round(cx/10), y: Math.round(cy/10)});
    dispatch({type:"SET_ITEMS_BATCH", items: nextItems});
    play(playGroup);
    const supLabel = BLOCK_TYPES.find(b=>b.t===sup).label;
    announce(`10 ${BLOCK_TYPES.find(b=>b.t===item.t).label} gruplandı → 1 ${supLabel}. Toplam: ${totalValue}`);
  }

  function breakItem(id) {
    const item = items.find(it => it.id === id);
    if (!item || item.t === "ones") return;
    const sub = SUB[item.t];
    const bt = BLOCK_TYPES.find(b => b.t === sub);
    const nextItems = items.filter(it => it.id !== id);
    for (let i = 0; i < 10; i++) {
      const dx = item.t === "tens" ? 0 : (i%5)*(bt.w+2);
      const dy = item.t === "tens" ? i*(bt.h+2) : Math.floor(i/5)*(bt.h+4);
      nextItems.push({id: nextId(), t: sub, x: Math.round(item.x+dx), y: Math.round(item.y+dy)});
    }
    dispatch({type:"SET_ITEMS_BATCH", items: nextItems});
    play(playBreak);
    const subLabel = BLOCK_TYPES.find(b=>b.t===sub).label;
    announce(`Çözüldü → 10 ${subLabel}. Toplam: ${totalValue}`);
  }

  /* ── Genişletilmiş Gösterim ── */
  const expanded = [];
  if (counts.ths>0) expanded.push(`${counts.ths}×1000`);
  if (counts.huns>0) expanded.push(`${counts.huns}×100`);
  if (counts.tens>0) expanded.push(`${counts.tens}×10`);
  if (counts.ones>0) expanded.push(`${counts.ones}×1`);
  const expandedStr = expanded.length ? expanded.join(" + ") + " = " + totalValue : "";
  const okunus = totalValue > 0 ? readNum(totalValue) : "";

  /* ── UI Durumu ── */
  const [sidebarTab, setSidebarTab] = useState("mat");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [zoom, setZoom] = useState(1);

  const [bgType, setBgType] = useState("grid");
  const [tool, setTool] = useState("select");
  const [penColor, setPenColor] = useState("#1a1a1a");
  const [penWidth, setPenWidth] = useState(3);
  const [penAlpha, setPenAlpha] = useState(1);
  const [eraserSize, setEraserSize] = useState(20);
  const [drawing, setDrawing] = useState(false);
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [pendingActivity, setPendingActivity] = useState(null);
  const [game, setGame] = useState(null);
  const [showAbout, setShowAbout] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showTeacher, setShowTeacher] = useState(false);
  const [showMat, setShowMat] = useState(true);
  const [showVals, setShowVals] = useState(false);
  const [showDecomp, setShowDecomp] = useState(false);
  const [showTablet, setShowTablet] = useState(false);
  const [showNumberLine, setShowNumberLine] = useState(false);
  const [matCols, setMatCols] = useState(3);
  const [matCounts, setMatCounts] = useState({ones:0,tens:0,huns:0,ths:0});
  /* combinedTotal: kanvas + mat tablosu birlikte — checkBuild ve gösterim için */
  const combinedCounts = {
    ones: counts.ones + matCounts.ones,
    tens: counts.tens + matCounts.tens,
    huns: counts.huns + matCounts.huns,
    ths:  counts.ths  + matCounts.ths,
  };
  const combinedTotal = combinedCounts.ones + combinedCounts.tens*10 + combinedCounts.huns*100 + combinedCounts.ths*1000;
  const [matScale, setMatScale] = useState(1);
  const [matXY, setMatXY] = useState(null);
  const [decompXY, setDecompXY] = useState(null);
  const [matDrag, setMatDrag] = useState(null);
  const [tabXY, setTabXY] = useState(null);
  const [tabSep, setTabSep] = useState(false);
  const [tabVis, setTabVis] = useState(["tens","ones"]);
  const [tabCounts, setTabCounts] = useState({ones:0,tens:0,huns:0,ths:0});
  /* ── Tablet fonksiyonları ── */
  const tabTotal = ["ths","huns","tens","ones"]
    .filter(bt=>tabVis.includes(bt))
    .reduce((s,bt)=>{const m={ones:1,tens:10,huns:100,ths:1000};return s+(tabCounts[bt]||0)*m[bt];},0);

  function tabInc(bt){ setTabCounts(p=>{const n={...p};n[bt]=Math.min(n[bt]+1,9);return n;}); play(playAdd); }
  function tabDec(bt){ setTabCounts(p=>{const n={...p};n[bt]=Math.max(n[bt]-1,0);return n;}); }
  function tabAddCol(bt){ setTabVis(p=>{ if(p.includes(bt))return p; const order=["ths","huns","tens","ones"]; return order.filter(o=>p.includes(o)||o===bt); }); }
  function tabRemCol(bt){ setTabVis(p=>p.length<=1?p:p.filter(x=>x!==bt)); }
  function startTabDrag(e){
    if(e.target.closest&&e.target.closest("[data-tabbtn]"))return;
    e.preventDefault();
    const el=e.currentTarget; const r=el.getBoundingClientRect();
    const ox=e.clientX-r.left, oy=e.clientY-r.top;
    function onM(ev){setTabXY({x:ev.clientX-ox,y:ev.clientY-oy});}
    function onU(){window.removeEventListener("pointermove",onM);window.removeEventListener("pointerup",onU);}
    window.addEventListener("pointermove",onM); window.addEventListener("pointerup",onU);
  }

  const [colorBlind, setColorBlind] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [fontFamily, setFontFamily] = useState("nunito");
  const [fontSize, setFontSize] = useState(1);
  const [dragFromSidebar, setDragFromSidebar] = useState(null);
  const [dragPos, setDragPos] = useState({x:0,y:0});
  const [dropHighlight, setDropHighlight] = useState(false);
  const [itemDrag, setItemDrag] = useState(null);
  const [overTrash, setOverTrash] = useState(false);
  const [progress, setProgress] = useState(loadProgress);
  const [sessionStart] = useState(()=>Date.now());

  /* ── Ses Komutu Durumu ── */
  const [voiceActive, setVoiceActive]     = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState("");
  const [voiceLog, setVoiceLog]           = useState([]);   /* {text, label, ok, ts} */
  const [voiceError, setVoiceError]       = useState("");
  const [voiceMode, setVoiceMode]         = useState("push"); /* "push" | "continuous" */
  const [showVoicePanel, setShowVoicePanel] = useState(false);
  const recognitionRef = useRef(null);

  /* ── Refs ── */
  const matRef = useRef(null);
  const canvasRef = useRef(null);
  const drawRef = useRef(null);
  const cursorRef = useRef(null);
  const curStroke = useRef([]);
  const canvasSized = useRef(false);
  const canvasZoomRef = useRef(zoom);
  useEffect(() => { canvasZoomRef.current = zoom; }, [zoom]);

  /* ── Basamak Tablosu ── */
  const ALL_COLS = [
    {t:"ths",  l:t("colThs"),  c:PALETTE.ths,  cB:PALETTE.thsB},
    {t:"huns", l:t("colHuns"), c:PALETTE.huns, cB:PALETTE.hunsB},
    {t:"tens", l:t("colTens"), c:PALETTE.tens, cB:PALETTE.tensB},
    {t:"ones", l:t("colOnes"), c:PALETTE.ones, cB:PALETTE.onesB}
  ];
  const visCols = ALL_COLS.slice(4 - matCols);

  /* ── Çözümleme ── */
  const decompParts = [];
  if (counts.ths>0) decompParts.push(""+(counts.ths*1000));
  if (counts.huns>0) decompParts.push(""+(counts.huns*100));
  if (counts.tens>0) decompParts.push(""+(counts.tens*10));
  if (counts.ones>0) decompParts.push(""+counts.ones);
  const decompStr = decompParts.length > 1
    ? decompParts.join(" + ") + " = " + totalValue
    : decompParts.length === 1 ? ""+totalValue : "";

  /* ── Etkinlik Kurulum ── */
  function runSetup(act) {
    if (!act?.s) return;
    const s = act.s;
    dispatch({type:"CLEAR_ALL"});
    if (s.cols) setMatCols(s.cols);
    setShowMat(true);
    if (s.decomp) setShowDecomp(true);
    setTimeout(() => {
      let x=80, y=100, gap=6;
      if (s.ths) { for(let i=0;i<s.ths;i++) addItem("ths",x+i*(160+gap),y); y+=180; }
      if (s.huns){ for(let i=0;i<s.huns;i++) addItem("huns",x+i*(140+gap),y); y+=150; }
      if (s.tens){ for(let i=0;i<s.tens;i++) addItem("tens",x+(i%8)*(U+gap),y+Math.floor(i/8)*(W+gap)); if(s.tens>8)y+=2*(W+gap); else y+=W+10; }
      if (s.ones){ for(let i=0;i<s.ones;i++) addItem("ones",x+(i%10)*(U+gap),y+Math.floor(i/10)*(U+gap)); }
    }, 60);
    announce(`Etkinlik başlatıldı: ${act.n}`);
  }

  function addBlocks(type, count) {
    const bt = BLOCK_TYPES.find(b=>b.t===type);
    const existing = items.filter(i=>i.t===type).length;
    const gap = 4;
    for (let i=0;i<count;i++) {
      const idx = existing+i;
      const cols = type==="ones"?10:type==="tens"?6:3;
      addItem(type, 60+(idx%cols)*(bt.w+gap), 60+Math.floor(idx/cols)*(bt.h+gap));
    }
  }

  /* ══════════════════════════════════════════════════════════════
     SES KOMUTLARI — Yürütücü & SpeechRecognition Yöneticisi
  ══════════════════════════════════════════════════════════════ */

  /* Sayıyı bloklara dönüştür ve ekle (SHOW_NUMBER komutu için) */
  function showNumberAsBlocks(n) {
    if (!n || n < 1 || n > 9999) return;
    dispatch({type:"CLEAR_ALL"});
    setShowMat(true);
    setTimeout(()=>{
      const ths  = Math.floor(n/1000);
      const huns = Math.floor((n%1000)/100);
      const tens = Math.floor((n%100)/10);
      const ones = n % 10;
      let x=60, y=80, gap=6;
      if (ths)  { for(let i=0;i<ths;i++)  addItem("ths",  x+i*(160+gap), y); y+=180; }
      if (huns) { for(let i=0;i<huns;i++) addItem("huns", x+i*(140+gap), y); y+=150; }
      if (tens) { for(let i=0;i<tens;i++) addItem("tens", x+i*(U+gap),   y); y+=W+10; }
      if (ones) { for(let i=0;i<ones;i++) addItem("ones", x+i*(U+gap),   y); }
    }, 80);
  }

  /* Komut yürütücü — interpretCommand() çıktısını alır */
  function executeVoiceCommand(cmd, rawText) {
    const ok = cmd.type !== "UNKNOWN";
    setVoiceLog(log=>[{text:rawText, label:cmd.label, ok, ts:Date.now()}, ...log.slice(0,19)]);
    announce(cmd.label);
    play(ok ? ctx=>playTone(ctx,660,"sine",0.08,0.25) : ctx=>playTone(ctx,220,"square",0.1,0.2));

    switch(cmd.type) {
      case "ADD_BLOCK":
        addBlocks(cmd.payload.blockType, cmd.payload.count);
        break;
      case "GROUP":
        if (cmd.payload.blockType) {
          /* Belirli türün ilk bloğunu bul ve grupla */
          const target = items.find(it=>it.t===cmd.payload.blockType);
          if (target) groupItem(target.id);
        } else {
          /* İlk gruplamaya uygun türü otomatik seç */
          const order = ["ones","tens","huns"];
          for (const bt of order) {
            if (counts[bt]>=10) { const t=items.find(it=>it.t===bt); if(t){groupItem(t.id); break;} }
          }
        }
        break;
      case "BREAK":
        if (cmd.payload.blockType) {
          const target = items.find(it=>it.t===cmd.payload.blockType);
          if (target) breakItem(target.id);
        } else {
          const order = ["tens","huns","ths"];
          for (const bt of order) {
            const foundItem = items.find(it=>it.t===bt); if(foundItem){ breakItem(foundItem.id); break; }
          }
        }
        break;
      case "CLEAR":   dispatch({type:"CLEAR_ALL"}); break;
      case "UNDO":    dispatch({type:"UNDO"}); break;
      case "REDO":    dispatch({type:"REDO"}); break;
      case "SPEAK":
        if (totalValue > 0) speakInLang(`${totalValue}: ${readNum(totalValue)}`, langCode);
        else speakInLang("Kanvas boş", langCode);
        break;
      case "SHOW_NUMBER": showNumberAsBlocks(cmd.payload.n); break;
      case "QUIZ":   startQuiz(); setSidebarTab("game"); break;
      case "BUILD":  startBuild(); setSidebarTab("game"); break;
      case "TOGGLE_WIDGET":
        switch(cmd.payload.w) {
          case "mat":       setShowMat(cmd.payload.v);       break;
          case "line":      setShowNumberLine(cmd.payload.v); break;
          case "vals":      setShowVals(cmd.payload.v);      break;
          case "decomp":    setShowDecomp(cmd.payload.v);    break;
          case "tablet":    setShowTablet(cmd.payload.v);    break;
          case "colorBlind":setColorBlind(cmd.payload.v);    break;
          case "contrast":  setHighContrast(cmd.payload.v);  break;
        }
        break;
      case "ZOOM":
        if (cmd.payload.dir === 0)  setZoom(1);
        else if (cmd.payload.dir>0) setZoom(z=>Math.min(2, +(z+.2).toFixed(1)));
        else                        setZoom(z=>Math.max(.5,+(z-.2).toFixed(1)));
        break;
      case "PAGE":
        dispatch({type:"ADD_PAGE", id: Math.max(...pages.map(p=>p.id))+1});
        break;
      case "HELP":
        setShowVoicePanel(true);
        break;
      default: break;
    }
  }

  /* SpeechRecognition başlat */
  function startVoice() {
    if (!SPEECH_SUPPORTED) {
      setVoiceError("Bu tarayıcı ses tanımayı desteklemiyor. Chrome veya Edge kullanın.");
      return;
    }
    setVoiceError("");
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const rec = new SR();
    rec.lang = "tr-TR";
    rec.continuous = voiceMode === "continuous";
    rec.interimResults = true;
    rec.maxAlternatives = 3;

    rec.onstart = () => { setVoiceActive(true); setVoiceTranscript(""); };
    rec.onend   = () => { setVoiceActive(false); setVoiceTranscript(""); };
    rec.onerror = e => {
      setVoiceActive(false);
      const msgs = {
        "not-allowed":"Mikrofon izni verilmedi.",
        "no-speech":"Ses algılanamadı.",
        "network":"Ağ hatası.",
        "audio-capture":"Mikrofon bulunamadı."
      };
      setVoiceError(msgs[e.error] || `Hata: ${e.error}`);
    };
    rec.onresult = e => {
      let interim = "", final = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const r = e.results[i];
        if (r.isFinal) final += r[0].transcript;
        else interim += r[0].transcript;
      }
      setVoiceTranscript(interim || final);
      if (final.trim()) {
        const cmd = interpretCommand(final.trim());
        executeVoiceCommand(cmd, final.trim());
        if (voiceMode === "push") { rec.stop(); }
      }
    };

    recognitionRef.current = rec;
    try { rec.start(); } catch(e) { setVoiceError("Mikrofon başlatılamadı."); }
  }

  function stopVoice() {
    recognitionRef.current?.stop();
    setVoiceActive(false);
  }

  function toggleVoice() {
    if (voiceActive) stopVoice();
    else startVoice();
  }

  /* Bileşen unmount olduğunda recognition durdur */
  useEffect(()=>()=>{ recognitionRef.current?.stop(); }, []);

  /* ── Quiz Mantığı ── */
  const [currentQuizLevel, setCurrentQuizLevel] = useState(2);
  const filteredPool = QUIZ_POOL.filter(q => q.bloom <= currentQuizLevel);

  function startQuiz() {
    const poolForLevel = QUIZ_POOL.filter(q => q.bloom <= currentQuizLevel);
    const idx = Math.floor(Math.random() * poolForLevel.length);
    setGame({mode:"quiz", score:0, total:0, feedback:null, qIdx:idx, streak:0});
  }

  function startBuild() {
    const target = Math.floor(Math.random()*900)+100;
    setGame({mode:"build", score:0, total:0, feedback:null, target});
    dispatch({type:"CLEAR_ALL"});
  }

  function pickQuiz(selectedIdx) {
    if (!game || game.feedback) return;
    const pool = QUIZ_POOL.filter(q => q.bloom <= currentQuizLevel);
    const correct = selectedIdx === pool[game.qIdx].a;
    const newStreak = correct ? game.streak + 1 : 0;

    // Adaptif zorluk
    let newLevel = currentQuizLevel;
    if (correct && newStreak >= 3 && currentQuizLevel < 5) newLevel = Math.min(5, currentQuizLevel+1);
    if (!correct && currentQuizLevel > 1) newLevel = Math.max(1, currentQuizLevel-1);

    const quizEntry = {
      q: pool[game.qIdx].q,
      bloom: pool[game.qIdx].bloom,
      correct, timestamp: Date.now()
    };

    if (correct) {
      play(playCorrect);
      announce(`Doğru! ${pool[game.qIdx].bloom === 5 ? "Mükemmel analiz!" : "Harika!"}`);
    } else {
      play(playWrong);
      announce(`Yanlış. Doğru cevap: ${pool[game.qIdx].o[pool[game.qIdx].a]}`);
    }

    setGame(g => ({...g, feedback: correct?"correct":"wrong",
      score: g.score + (correct?1:0), total: g.total+1, streak: newStreak}));
    setCurrentQuizLevel(newLevel);

    const newProgress = {
      ...progress,
      quizHistory: [...(progress.quizHistory||[]).slice(-99), quizEntry]
    };
    setProgress(newProgress);
    saveProgress(newProgress);

    if (correct) {
      setTimeout(() => {
        const newPool = QUIZ_POOL.filter(q => q.bloom <= newLevel);
        const idx = Math.floor(Math.random()*newPool.length);
        setGame(g => ({...g, qIdx:idx, feedback:null, streak:newStreak}));
      }, 1200);
    }
  }

  function checkBuild() {
    if (!game || game.mode !== "build") return;
    if (combinedTotal === game.target) {
      play(playCorrect);
      announce(`Doğru! ${game.target} sayısını başarıyla oluşturdun!`);
      setGame(g => ({...g, feedback:"correct", score:g.score+1, total:g.total+1}));
      setTimeout(() => {
        const t2 = Math.floor(Math.random()*900)+100;
        setGame(g => ({...g, target:t2, feedback:null}));
        dispatch({type:"CLEAR_ALL"});
        setMatCounts({ones:0,tens:0,huns:0,ths:0});
      }, 1500);
    } else {
      play(playWrong);
      const diff = combinedTotal < game.target ? "daha fazla" : "daha az";
      announce(`Henüz değil. ${combinedTotal} var, ${game.target} gerekiyor — ${diff} blok ekle.`);
      setGame(g => ({...g, feedback:"wrong", total:g.total+1}));
      setTimeout(() => setGame(g => ({...g, feedback:null})), 1000);
    }
  }

  /* ── Klavye Kısayolları ── */
  useEffect(() => {
    function onKeyDown(e) {
      const tag = e.target.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;

      // Blok ekleme
      if (e.key === "q" || e.key === "Q") { addItem("ones", 80+(counts.ones%10)*(U+4), 100+Math.floor(counts.ones/10)*(U+4)); e.preventDefault(); }
      if (e.key === "w" || e.key === "W") { addItem("tens", 80+(counts.tens%6)*(U+4), 100+Math.floor(counts.tens/6)*(W+4)); e.preventDefault(); }
      if (e.key === "e" || e.key === "E") { addItem("huns", 80+(counts.huns%3)*(140+4), 100+Math.floor(counts.huns/3)*(140+4)); e.preventDefault(); }
      if (e.key === "r" || e.key === "R") { addItem("ths", 80+(counts.ths%2)*(160+4), 100+Math.floor(counts.ths/2)*(160+4)); e.preventDefault(); }

      // Seçili blok işlemleri
      if (selectedBlock) {
        if (e.key === "Delete" || e.key === "Backspace") { e.preventDefault(); removeItem(selectedBlock); setSelectedBlock(null); }
        if (e.key === "g" || e.key === "G") { e.preventDefault(); groupItem(selectedBlock); }
        if (e.key === "b" || e.key === "B") { e.preventDefault(); breakItem(selectedBlock); }
      }

      // Undo/Redo
      if ((e.ctrlKey || e.metaKey) && e.key === "z") { e.preventDefault(); dispatch({type:"UNDO"}); }
      if ((e.ctrlKey || e.metaKey) && e.key === "y") { e.preventDefault(); dispatch({type:"REDO"}); }

      // Toplam seslendirme
      if (e.key === "s" || e.key === "S") {
        if (totalValue > 0) {
          e.preventDefault();
          speakInLang(`${totalValue} — ${readNum(totalValue)}`, langCode);
          announce(`${totalValue}: ${readNum(totalValue)}`);
        }
      }

      // Temizle
      if (e.key === "Escape") setSelectedBlock(null);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selectedBlock, counts, totalValue, addItem, removeItem, items]);

  /* ── Sidebar Sürükleme ── */
  useEffect(() => {
    if (!dragFromSidebar) return;
    function isOverCanvas(ex, ey) {
      if (!canvasRef.current) return false;
      const r = canvasRef.current.getBoundingClientRect();
      return ex>r.left-40 && ex<r.right+40 && ey>r.top-40 && ey<r.bottom+40;
    }
    function onMove(e) {
      if (e.buttons === 0) { setDragFromSidebar(null); setDropHighlight(false); return; }
      setDragPos({x:e.clientX, y:e.clientY});
      setDropHighlight(isOverCanvas(e.clientX, e.clientY));
    }
    function onUp(e) {
      setDropHighlight(false);
      /* Basamak tablosu üzerine bırakıldıysa → sadece tabloya ekle */
      if (matRef.current) {
        const mr = matRef.current.getBoundingClientRect();
        if (e.clientX>=mr.left && e.clientX<=mr.right && e.clientY>=mr.top && e.clientY<=mr.bottom) {
          setMatCounts(p=>({...p,[dragFromSidebar.t]:p[dragFromSidebar.t]+1}));
          setDragFromSidebar(null);
          return;
        }
      }
      if (canvasRef.current && isOverCanvas(e.clientX, e.clientY)) {
        const r = canvasRef.current.getBoundingClientRect();
        addItem(dragFromSidebar.t, (e.clientX-r.left)/zoom, (e.clientY-r.top)/zoom);
      }
      setDragFromSidebar(null);
    }
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => { window.removeEventListener("pointermove", onMove); window.removeEventListener("pointerup", onUp); };
  }, [dragFromSidebar, zoom, addItem]);

  /* ── Blok Sürükleme ── */
  useEffect(() => {
    if (!itemDrag) return;
    function onMove(e) {
      if (e.buttons === 0) { setItemDrag(null); return; }
      if (!canvasRef.current) return;
      const r = canvasRef.current.getBoundingClientRect();
      moveItem(itemDrag.id, (e.clientX-r.left)/zoom - itemDrag.offX, (e.clientY-r.top)/zoom - itemDrag.offY);
      setOverTrash(e.clientY > r.bottom - 50);
    }
    function onUp(e) {
      if (canvasRef.current && e.clientY > canvasRef.current.getBoundingClientRect().bottom - 50) {
        removeItem(itemDrag.id);
        if (selectedBlock === itemDrag.id) setSelectedBlock(null);
      }
      setItemDrag(null); setOverTrash(false);
    }
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => { window.removeEventListener("pointermove", onMove); window.removeEventListener("pointerup", onUp); };
  }, [itemDrag, zoom, moveItem, removeItem, selectedBlock]);

  /* ── Basamak Tablosu Sürükleme ── */
  useEffect(() => {
    if (!matDrag) return;
    function onMove(e) {
      if (!canvasRef.current) return;
      const r = canvasRef.current.getBoundingClientRect();
      setMatXY({x:(e.clientX-r.left)/zoom - matDrag.offX, y:(e.clientY-r.top)/zoom - matDrag.offY});
    }
    function onUp() { setMatDrag(null); }
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => { window.removeEventListener("pointermove", onMove); window.removeEventListener("pointerup", onUp); };
  });

  /* ── Çizim ── */
  function sizeCanvas() {
    const cv = drawRef.current;
    if (!cv || !canvasRef.current) return;
    const w = canvasRef.current.clientWidth, h = canvasRef.current.clientHeight;
    if (cv.width === w*2 && cv.height === h*2) return;
    cv.width = w*2; cv.height = h*2;
    cv.style.width = w+"px"; cv.style.height = h+"px";
    canvasSized.current = true;
  }

  function renderStrokes() {
    const cv = drawRef.current;
    if (!cv) return;
    sizeCanvas();
    const ctx = cv.getContext("2d");
    ctx.clearRect(0,0,cv.width,cv.height);
    ctx.save(); ctx.scale(2,2); ctx.lineCap="round"; ctx.lineJoin="round";
    strokes.forEach(s => {
      if (!s.points || s.points.length < 2) return;
      ctx.beginPath();
      ctx.globalCompositeOperation = s.type==="eraser" ? "destination-out" : "source-over";
      ctx.globalAlpha = s.type==="eraser" ? 1 : (s.alpha||1);
      ctx.strokeStyle = s.type==="eraser" ? "rgba(0,0,0,1)" : s.color;
      ctx.lineWidth = s.width;
      ctx.moveTo(s.points[0].x, s.points[0].y);
      for (let i=1;i<s.points.length-1;i++) {
        const mx=(s.points[i].x+s.points[i+1].x)/2, my=(s.points[i].y+s.points[i+1].y)/2;
        ctx.quadraticCurveTo(s.points[i].x,s.points[i].y,mx,my);
      }
      ctx.lineTo(s.points[s.points.length-1].x, s.points[s.points.length-1].y);
      ctx.stroke(); ctx.globalAlpha=1; ctx.globalCompositeOperation="source-over";
    });
    ctx.restore();
  }

  useEffect(() => { renderStrokes(); }, [strokes]);
  useEffect(() => {
    const obs = new ResizeObserver(() => { canvasSized.current=false; renderStrokes(); });
    if (canvasRef.current) obs.observe(canvasRef.current);
    return () => obs.disconnect();
  }, []);

  function drawStart(e) {
    if (tool==="select") return;
    sizeCanvas();
    const r = canvasRef.current.getBoundingClientRect();
    curStroke.current = [{x:(e.clientX-r.left)/zoom, y:(e.clientY-r.top)/zoom}];
    setDrawing(true);
  }
  function drawMove(e) {
    if (cursorRef.current) {
      const cr = canvasRef.current?.getBoundingClientRect();
      if (cr && tool!=="select") {
        const sz = tool==="eraser" ? eraserSize : Math.max(penWidth,6);
        cursorRef.current.style.display="block";
        cursorRef.current.style.left=(e.clientX-cr.left-sz/2)+"px";
        cursorRef.current.style.top=(e.clientY-cr.top-sz/2)+"px";
        cursorRef.current.style.width=sz+"px"; cursorRef.current.style.height=sz+"px";
        cursorRef.current.style.borderColor=tool==="eraser"?"rgba(0,0,0,.3)":penColor;
      } else { cursorRef.current.style.display="none"; }
    }
    if (!drawing) return;
    const r = canvasRef.current.getBoundingClientRect();
    const p = {x:(e.clientX-r.left)/zoom, y:(e.clientY-r.top)/zoom};
    curStroke.current.push(p);
    const cv = drawRef.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    ctx.save(); ctx.scale(2,2);
    ctx.globalCompositeOperation = tool==="eraser" ? "destination-out" : "source-over";
    ctx.globalAlpha = tool==="eraser" ? 1 : penAlpha;
    ctx.beginPath(); ctx.strokeStyle = tool==="eraser"?"rgba(0,0,0,1)":penColor;
    ctx.lineWidth = tool==="eraser"?eraserSize:penWidth; ctx.lineCap="round";
    const pts = curStroke.current;
    if (pts.length>=2) { ctx.moveTo(pts[pts.length-2].x,pts[pts.length-2].y); ctx.lineTo(p.x,p.y); ctx.stroke(); }
    ctx.restore();
  }
  function drawEnd() {
    if (!drawing) return;
    setDrawing(false);
    if (curStroke.current.length > 1) {
      dispatch({type:"ADD_STROKE", stroke:{points:curStroke.current.slice(),color:penColor,width:tool==="eraser"?eraserSize:penWidth,type:tool,alpha:penAlpha}});
    }
    curStroke.current = [];
  }

  /* ── Öğrenci İlerleme Raporu ── */
  const bloomLevels = ["", "Hatırlama", "Anlama", "Uygulama", "Analiz", "Değerlendirme"];
  const recentQuiz = (progress.quizHistory||[]).slice(-20);
  const correctCount = recentQuiz.filter(q=>q.correct).length;
  const wrongCount = recentQuiz.length - correctCount;
  const bloomStats = [1,2,3,4,5].map(level => ({
    level, label: bloomLevels[level],
    total: recentQuiz.filter(q=>q.bloom===level).length,
    correct: recentQuiz.filter(q=>q.bloom===level&&q.correct).length
  })).filter(b=>b.total>0);

  /* ── Font & Kontrast Stilleri ── */
  const fontMap = {
    nunito:"'Nunito','Segoe UI',system-ui,sans-serif",
    opendyslexic:"'OpenDyslexic',system-ui,sans-serif",
    mono:"'Courier New',monospace",
    serif:"Georgia,serif"
  };
  const baseFontSize = Math.round(14 * fontSize);

  /* ── Arkaplan ── */
  const bgColor = highContrast ? "#000" : PALETTE.bg;
  const bgStyle = {background: bgColor};
  if (bgType==="grid") {
    bgStyle.backgroundImage="linear-gradient(rgba(0,0,0,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(0,0,0,.05) 1px,transparent 1px)";
    bgStyle.backgroundSize="24px 24px";
  } else if (bgType==="dot") {
    bgStyle.backgroundImage="radial-gradient(rgba(0,0,0,.1) 1px,transparent 1px)";
    bgStyle.backgroundSize="20px 20px";
  }

  /* ── Canvasa Otomatik Gruplama Uyarısı ── */
  const canAutoGroup = {ones: counts.ones>=10, tens: counts.tens>=10, huns: counts.huns>=10};

  /* ── Toggle Bileşeni ── */
  function Toggle({on, onToggle, icon, label, sub}) {
    return (
      <div
        role="switch" aria-checked={on} tabIndex={0}
        onClick={onToggle}
        onKeyDown={e=>{if(e.key===" "||e.key==="Enter"){e.preventDefault();onToggle();}}}
        style={{display:"flex",alignItems:"center",gap:8,padding:"6px 8px",marginBottom:3,
          borderRadius:8,cursor:"pointer",background:on?PALETTE.accentL:"transparent",transition:"background .15s"}}
      >
        <div aria-hidden style={{width:32,height:18,borderRadius:9,background:on?PALETTE.accent:"#ddd",position:"relative",transition:".2s",flexShrink:0}}>
          <div style={{position:"absolute",top:2,left:on?16:2,width:14,height:14,borderRadius:"50%",background:"#fff",transition:".2s",boxShadow:"0 1px 3px rgba(0,0,0,.15)"}}/>
        </div>
        <span aria-hidden style={{fontSize:14}}>{icon}</span>
        <div style={{flex:1}}>
          <div style={{fontSize:11,fontWeight:700,color:highContrast?"#fff":PALETTE.text}}>{label}</div>
          {sub&&<div style={{fontSize:10,color:"#b5a990"}}>{sub}</div>}
        </div>
      </div>
    );
  }

  /* ── Blok Render ── */
  function renderBlock(item) {
    const bt = BLOCK_TYPES.find(b=>b.t===item.t);
    if (!bt) return null;
    const isSelected = selectedBlock === item.id;
    const canGrp = item.t!=="ths" && counts[item.t]>=10;
    const canBrk = item.t!=="ones";
    return (
      <div
        key={"blk"+item.id}
        role="button"
        aria-label={`${bt.ariaDesc}. ${isSelected?"Seçili. G=grupla, B=çöz, Delete=sil.":""}`}
        tabIndex={0}
        style={{
          position:"absolute", left:item.x, top:item.y,
          zIndex:isSelected?5:2, cursor:"grab", touchAction:"none",
          outline:isSelected?"2.5px solid "+PALETTE.accent:"none",
          outlineOffset:3, borderRadius:4, animation:"blockIn .2s ease-out"
        }}
        onPointerDown={e=>{
          e.preventDefault(); e.stopPropagation();
          const r = e.currentTarget.getBoundingClientRect();
          setItemDrag({id:item.id, offX:(e.clientX-r.left)/zoom, offY:(e.clientY-r.top)/zoom});
        }}
        onClick={e=>{
          e.stopPropagation();
          setSelectedBlock(selectedBlock===item.id ? null : item.id);
        }}
        onKeyDown={e=>{
          if(e.key===" "||e.key==="Enter"){e.preventDefault();setSelectedBlock(selectedBlock===item.id?null:item.id);}
          if(e.key==="Delete"||e.key==="Backspace"){e.preventDefault();removeItem(item.id);setSelectedBlock(null);}
          if(e.key==="g"||e.key==="G"){e.preventDefault();groupItem(item.id);}
          if(e.key==="b"||e.key==="B"){e.preventDefault();breakItem(item.id);}
        }}
      >
        <BlockSVG type={item.t} size={1} showVal={showVals} colorBlind={colorBlind}/>
        {showVals&&<div style={{position:"absolute",left:"50%",bottom:-14,transform:"translateX(-50%)",
          background:bt.colorB,color:"#fff",fontSize:8,fontWeight:900,borderRadius:4,padding:"1px 4px",
          whiteSpace:"nowrap",pointerEvents:"none"}}>{bt.val}</div>}
        {/* Bağlam menüsü */}
        {isSelected&&(
          <div
            role="toolbar" aria-label="Blok işlemleri"
            style={{position:"absolute",left:bt.w+4,top:0,zIndex:10,background:"rgba(255,255,255,.97)",
              backdropFilter:"blur(8px)",borderRadius:7,padding:"3px",
              boxShadow:"0 2px 10px rgba(0,0,0,.12)",border:"1px solid rgba(0,0,0,.08)",
              display:"flex",gap:2,animation:"popIn .15s"}}
            onClick={e=>e.stopPropagation()}
          >
            {canBrk&&<button aria-label="Çöz: 10 alt birime böl" onClick={()=>breakItem(item.id)}
              style={{padding:"4px 8px",borderRadius:6,border:"none",
                background:BLOCK_TYPES.find(b=>b.t===SUB[item.t]).color+"18",
                cursor:"pointer",fontSize:9,fontWeight:700,
                color:BLOCK_TYPES.find(b=>b.t===SUB[item.t]).colorB,fontFamily:"inherit"}}>
              {"✂ Çöz (B)"}
            </button>}
            {canGrp&&<button aria-label="Grupla: 10 birimi üst birime dönüştür" onClick={()=>groupItem(item.id)}
              style={{padding:"4px 8px",borderRadius:6,border:"none",
                background:BLOCK_TYPES.find(b=>b.t===SUP[item.t]).color+"18",
                cursor:"pointer",fontSize:9,fontWeight:700,
                color:BLOCK_TYPES.find(b=>b.t===SUP[item.t]).colorB,fontFamily:"inherit"}}>
              {"🔗 Grupla (G)"}
            </button>}
            <button aria-label="Bloğu sil" onClick={()=>{removeItem(item.id);setSelectedBlock(null);}}
              style={{padding:"4px 8px",borderRadius:6,border:"none",
                background:"rgba(239,68,68,.1)",cursor:"pointer",fontSize:9,fontWeight:700,color:"#b91c1c",fontFamily:"inherit"}}>
              {"× Sil"}
            </button>
          </div>
        )}
      </div>
    );
  }

  /* ── Modal Focus Trap ── */
  function ModalBackdrop({children, onClose}) {
    const ref = useRef(null);
    useEffect(() => {
      const el = ref.current;
      if (!el) return;
      const focusable = el.querySelectorAll('button,input,select,textarea,[tabindex]:not([tabindex="-1"])');
      if (focusable.length) focusable[0].focus();
      function trap(e) {
        if (e.key !== "Tab" || !focusable.length) return;
        if (e.shiftKey) {
          if (document.activeElement === focusable[0]) { e.preventDefault(); focusable[focusable.length-1].focus(); }
        } else {
          if (document.activeElement === focusable[focusable.length-1]) { e.preventDefault(); focusable[0].focus(); }
        }
      }
      function esc(e) { if (e.key==="Escape") onClose(); }
      el.addEventListener("keydown", trap);
      el.addEventListener("keydown", esc);
      return () => { el.removeEventListener("keydown",trap); el.removeEventListener("keydown",esc); };
    }, []);
    return (
      <div onClick={onClose} style={{position:"fixed",inset:0,zIndex:9999,background:"rgba(0,0,0,.45)",
        display:"flex",alignItems:"center",justifyContent:"center"}}>
        <div ref={ref} role="dialog" aria-modal="true" onClick={e=>e.stopPropagation()}
          style={{background:"#fffdf7",borderRadius:20,padding:"24px 28px",maxWidth:480,width:"90%",
            boxShadow:"0 16px 48px rgba(0,0,0,.25)",animation:"popIn .3s",overflowY:"auto",maxHeight:"85vh"}}>
          {children}
        </div>
      </div>
    );
  }

  /* ════════════════════════════════════════════════════════════
     KAYIT & AR SİSTEMİ
  ════════════════════════════════════════════════════════════ */

  /* ── Kayıt Durumu ── */
  const [recording, setRecording] = useState(false);
  const [recSeconds, setRecSeconds] = useState(0);
  const [showRecPanel, setShowRecPanel] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const mainAreaRef = useRef(null);

  function toggleFullscreen() {
    const el = mainAreaRef.current;
    if (!el) return;
    if (!document.fullscreenElement) {
      el.requestFullscreen?.() || el.webkitRequestFullscreen?.();
    } else {
      document.exitFullscreen?.() || document.webkitExitFullscreen?.();
    }
  }
  useEffect(() => {
    function onFsChange() {
      setIsFullscreen(!!document.fullscreenElement);
    }
    document.addEventListener("fullscreenchange", onFsChange);
    document.addEventListener("webkitfullscreenchange", onFsChange);
    return () => {
      document.removeEventListener("fullscreenchange", onFsChange);
      document.removeEventListener("webkitfullscreenchange", onFsChange);
    };
  }, []);
  const mediaRecRef = useRef(null);
  const recTimerRef = useRef(null);
  const recChunksRef = useRef([]);

  async function startScreenRecord() {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: {frameRate: 30}, audio: false
      });
      recChunksRef.current = [];
      const mr = new MediaRecorder(stream, {mimeType:"video/webm;codecs=vp9"});
      mr.ondataavailable = e => { if(e.data.size>0) recChunksRef.current.push(e.data); };
      mr.onstop = () => {
        const blob = new Blob(recChunksRef.current, {type:"video/webm"});
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href=url; a.download=`DokuSay_${Date.now()}.webm`; a.click();
        URL.revokeObjectURL(url);
        stream.getTracks().forEach(t=>t.stop());
        setRecording(false); setRecSeconds(0);
        clearInterval(recTimerRef.current);
      };
      mr.start(1000);
      mediaRecRef.current = mr;
      setRecording(true); setRecSeconds(0);
      recTimerRef.current = setInterval(()=>setRecSeconds(s=>s+1), 1000);
      announce("Ekran kaydı başladı");
    } catch(e) { announce("Kayıt başlatılamadı: "+e.message); }
  }

  function stopScreenRecord() {
    mediaRecRef.current?.stop();
    clearInterval(recTimerRef.current);
  }

  function takeSnapshot() {
    /* Kanvası PNG olarak yakala */
    const canvas = document.createElement("canvas");
    const mainEl = canvasRef.current;
    if (!mainEl) return;
    const r = mainEl.getBoundingClientRect();
    canvas.width = r.width * 2; canvas.height = r.height * 2;
    const ctx = canvas.getContext("2d");
    ctx.scale(2, 2);
    /* Arkaplan */
    ctx.fillStyle = bgType === "grid" ? "#f5f0e3" : bgType === "dot" ? "#f5f0e3" : "#f5f0e3";
    ctx.fillRect(0, 0, r.width, r.height);
    /* Drawing canvas */
    const drawCanvas = drawRef.current;
    if (drawCanvas) ctx.drawImage(drawCanvas, 0, 0, r.width, r.height);
    canvas.toBlob(blob=>{
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href=url; a.download=`DokuSay_${Date.now()}.png`; a.click();
      URL.revokeObjectURL(url);
    }, "image/png");
    announce("Görüntü kaydedildi");
  }

  function exportSession() {
    const data = {
      version:"3.0", timestamp: new Date().toISOString(),
      lang: langCode, totalValue,
      items: items.map(it=>({id:it.id,type:it.t,x:it.x,y:it.y})),
      matCounts, pages: pages.map(p=>p.label),
      currentPage: pages.findIndex(p=>p.id===currentPageId)+1,
      quizHistory: (progress.quizHistory||[]).slice(-20)
    };
    const blob = new Blob([JSON.stringify(data,null,2)], {type:"application/json"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href=url; a.download=`DokuSay_oturum_${Date.now()}.json`; a.click();
    URL.revokeObjectURL(url);
    announce("Oturum kaydedildi");
  }

  /* ── AR Durumu ── */
  const [arMode, setArMode] = useState(false);       /* kamera overlay */
  const [arError, setArError] = useState("");
  const arVideoRef = useRef(null);
  const arStreamRef = useRef(null);

  async function startAR() {
    setArError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {facingMode:{ideal:"environment"}, width:{ideal:1280}, height:{ideal:720}}
      });
      arStreamRef.current = stream;
      if (arVideoRef.current) {
        arVideoRef.current.srcObject = stream;
        await arVideoRef.current.play();
      }
      setArMode(true);
      announce("AR modu açıldı. Kamera aktif.");
    } catch(e) {
      setArError("Kamera erişimi reddedildi: "+e.message);
    }
  }

  function stopAR() {
    arStreamRef.current?.getTracks().forEach(t=>t.stop());
    if(arVideoRef.current) arVideoRef.current.srcObject = null;
    setArMode(false);
    announce("AR modu kapatıldı");
  }


  useEffect(()=>{
    return ()=>{
      arStreamRef.current?.getTracks().forEach(t=>t.stop());
      clearInterval(recTimerRef.current);
      mediaRecRef.current?.state==="recording" && mediaRecRef.current.stop();
    };
  }, []);

  /* ════════════════════════════════════════════════════════════
     RENDER
  ════════════════════════════════════════════════════════════ */
  const fontStyle = fontFamily === "opendyslexic"
    ? "system-ui,sans-serif"  /* OpenDyslexic CDN'de olmadığından fallback */
    : fontMap[fontFamily] || fontMap.nunito;

  return (
    <div lang="tr" style={{display:"flex",flexDirection:"column",height:"100vh",overflow:"hidden",
      fontFamily:fontStyle,fontSize:baseFontSize,
      filter:highContrast?"contrast(1.4) brightness(1.05)":"none"}}>

      {/* ── ARIA Duyuru Bölgesi ── */}
      <div aria-live="polite" aria-atomic="true"
        style={{position:"absolute",width:1,height:1,overflow:"hidden",clip:"rect(0,0,0,0)",whiteSpace:"nowrap"}}>
        {ariaMsg}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@600;700;800;900&display=swap');
        *{box-sizing:border-box}
        @keyframes popIn{0%{transform:scale(.8);opacity:0}60%{transform:scale(1.04)}100%{transform:scale(1);opacity:1}}
        @keyframes fadeIn{0%{opacity:0}100%{opacity:1}}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
        @keyframes slideDown{0%{transform:translateY(-20px);opacity:0}100%{transform:translateY(0);opacity:1}}
        @keyframes blockIn{0%{transform:scale(0);opacity:0}60%{transform:scale(1.1)}100%{transform:scale(1);opacity:1}}
        @keyframes pulse{0%,100%{opacity:.4}50%{opacity:1}}
        @keyframes micPulse{0%,100%{box-shadow:0 0 0 0 rgba(239,68,68,.4)}70%{box-shadow:0 0 0 8px rgba(239,68,68,0)}}
        button{font-family:inherit;transition:transform .1s,box-shadow .1s}
        button:active{transform:scale(.95)}
        button:focus-visible{outline:2.5px solid ${PALETTE.accent};outline-offset:2px}
        [role="switch"]:focus-visible{outline:2.5px solid ${PALETTE.accent};outline-offset:2px}
        ::-webkit-scrollbar{width:0;height:0}
        ::-webkit-scrollbar-thumb{background:transparent}
      `}</style>

      {/* ══ BAŞLIK — Logo + Dil + Toplam ══ */}
      <header role="banner" style={{height:44,minHeight:44,background:"linear-gradient(135deg,#3d2e1a,#2a2018)",
        display:"flex",alignItems:"center",padding:"0 14px",gap:10,boxShadow:"0 2px 12px rgba(60,50,30,.2)"}}>
        <span aria-hidden style={{fontSize:22}}>📐</span>
        <div>
          <span style={{fontSize:15,fontWeight:900,color:PALETTE.accent,letterSpacing:-.5}}>DokunSay</span>
          <span style={{fontSize:10,fontWeight:600,color:"rgba(255,255,255,.3)",marginLeft:6}}>{t("appTitle")}</span>
        </div>
        {/* Dil Seçici */}
        <div role="group" aria-label="Dil seçimi" style={{display:"flex",gap:2,background:"rgba(255,255,255,.06)",borderRadius:8,padding:3,marginLeft:4}}>
          {Object.values(LANGS).map(lng=>(
            <button key={lng.code} onClick={()=>setLangCode(lng.code)}
              aria-pressed={langCode===lng.code} aria-label={lng.name} title={lng.name}
              style={{padding:"2px 7px",borderRadius:6,border:"none",cursor:"pointer",
                background:langCode===lng.code?"rgba(255,255,255,.18)":"transparent",
                color:langCode===lng.code?"#fff":"rgba(255,255,255,.35)",
                fontSize:11,fontWeight:langCode===lng.code?800:600,
                fontFamily:"inherit",transition:"all .15s",whiteSpace:"nowrap"}}>
              {lng.flag} {lng.name}
            </button>
          ))}
        </div>
        <div style={{flex:1}}/>
        {/* Toplam — kalıcı, her zaman görünür */}
        <div aria-live="polite" aria-label={totalValue>0?`Toplam: ${totalValue}, ${okunus}`:"Kanvas boş"}
          style={{background:"rgba(255,255,255,.07)",borderRadius:8,padding:"3px 10px",
            display:"flex",alignItems:"center",gap:6,minWidth:80}}>
          <span style={{fontSize:10,color:"rgba(255,255,255,.35)"}}>∑</span>
          <span style={{fontSize:17,fontWeight:900,color:totalValue>0?PALETTE.accent:"rgba(255,255,255,.2)"}}>
            {totalValue>0?totalValue:"—"}
          </span>
          {okunus&&<span style={{fontSize:9,color:"rgba(255,255,255,.35)",fontStyle:"italic",maxWidth:80,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{okunus}</span>}
          {totalValue>0&&<button onClick={()=>speakInLang(`${totalValue} — ${okunus}`,langCode)}
            aria-label="Seslendir"
            style={{background:"none",border:"none",color:"rgba(255,255,255,.35)",cursor:"pointer",fontSize:13,padding:"1px 2px",lineHeight:1}}>🔊</button>}
        </div>
      </header>

      <div style={{display:"flex",flex:1,overflow:"hidden"}}>

        {/* ══ KENAR ÇUBUĞU ══ */}
        <nav aria-label="Araçlar ve bloklar" style={{
          width:sidebarCollapsed?48:252, minWidth:sidebarCollapsed?48:252,
          background:`linear-gradient(180deg,${PALETTE.side},#efe8d6)`,
          borderRight:"1px solid "+PALETTE.sideB, display:"flex",flexDirection:"column",
          transition:"width .25s",overflow:"hidden"
        }}>
          {sidebarCollapsed ? (
            <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:8,padding:"12px 0"}}>
              {[["📦","mat"],["📋","act"],["🎮","game"],["⚙️","feat"]].map(([ic,id])=>(
                <button key={id} onClick={()=>{setSidebarCollapsed(false);setSidebarTab(id);}}
                  aria-label={id==="mat"?t("tabBlocks"):id==="act"?t("tabAct"):id==="game"?t("tabGame"):t("tabSettings")}
                  style={{padding:"8px 12px",borderRadius:8,border:"1px solid "+PALETTE.sideB,background:"#fff",cursor:"pointer",fontSize:18}}>{ic}</button>
              ))}
              <button onClick={()=>setSidebarCollapsed(false)} aria-label="Kenar çubuğunu aç"
                style={{padding:"6px 12px",borderRadius:8,border:"1px solid "+PALETTE.sideB,background:"#fff",cursor:"pointer",fontSize:12,color:"#bbb"}}>▶</button>
            </div>
          ) : (
            <div style={{display:"flex",flexDirection:"column",flex:1,overflow:"hidden"}}>
              {/* Başlık */}
              <div style={{padding:"8px 12px",display:"flex",alignItems:"center",gap:8,borderBottom:"1px solid rgba(60,50,30,.06)"}}>
                <div style={{flex:1,fontSize:13,fontWeight:900,color:PALETTE.text}}>Basamak Değeri</div>
                <button onClick={()=>setSidebarCollapsed(true)} aria-label="Kenar çubuğunu daralt"
                  style={{background:"none",border:"none",cursor:"pointer",fontSize:12,color:"#ccc",width:26,height:26,borderRadius:6}}>◀</button>
              </div>

              {/* Sekme Çubuğu */}
              <div role="tablist" style={{display:"flex",padding:"4px 8px",gap:3,background:"rgba(60,50,30,.02)"}}>
                {[["📦","mat",t("tabBlocks")],["📋","act",t("tabAct")],["🎮","game",t("tabGame")],["⚙️","feat",t("tabSettings")]].map(([ic,id,lbl])=>(
                  <button key={id} role="tab" aria-selected={sidebarTab===id}
                    onClick={()=>setSidebarTab(id)}
                    style={{flex:1,padding:"6px 0",border:"none",borderRadius:8,
                      background:sidebarTab===id?"#fff":"transparent",cursor:"pointer",fontSize:12,fontWeight:800,
                      color:sidebarTab===id?PALETTE.text:"#bbb",fontFamily:"inherit",
                      boxShadow:sidebarTab===id?"0 1px 4px "+PALETTE.sh:"none"}} title={lbl}>{ic}</button>
                ))}
              </div>

              {/* ── Bloklar Sekmesi ── */}
              {sidebarTab==="mat" && (
                <div style={{flex:1,overflowY:"auto",padding:"8px",scrollbarWidth:"none",scrollbarWidth:"none"}}>
                  {BLOCK_TYPES.map(bt=>{
                    const cnt=counts[bt.t];
                    const glowing=canAutoGroup[bt.t];
                    return (
                      <div key={bt.t} style={{background:"#fff",borderRadius:12,padding:"8px 12px",marginBottom:6,
                        borderLeft:"3px solid "+bt.color,border:"1px solid "+(glowing?"rgba(245,158,11,.3)":"rgba(60,50,30,.04)"),
                        borderLeftWidth:3,borderLeftColor:bt.color,
                        boxShadow:glowing?"0 0 14px rgba(245,158,11,.18)":"0 1px 4px "+PALETTE.sh,
                        position:"relative",transition:"box-shadow .3s"}}>
                        {cnt>0&&<div aria-label={`${cnt} adet`} style={{position:"absolute",top:-4,right:-4,background:bt.color,
                          color:"#fff",fontSize:10,fontWeight:900,borderRadius:10,padding:"1px 6px",minWidth:20,textAlign:"center"}}>{cnt}</div>}
                        {glowing&&<div aria-live="assertive" style={{position:"absolute",top:-4,left:-4,background:PALETTE.accent,
                          color:"#fff",fontSize:8,fontWeight:800,borderRadius:8,padding:"1px 5px",animation:"pulse 1.5s infinite"}}>10+ grupla!</div>}
                        <div style={{display:"flex",alignItems:"center",gap:10}}>
                          <div
                            role="button" tabIndex={0}
                            aria-label={`${bt.label} ekle (${bt.val} değer). Klavye: ${bt.t==="ones"?"Q":bt.t==="tens"?"W":bt.t==="huns"?"E":"R"}`}
                            style={{cursor:"grab",touchAction:"none",padding:4,background:bt.color+"08",borderRadius:8,
                              display:"flex",alignItems:"center",justifyContent:"center",
                              minWidth:52,minHeight:58,border:"1.5px dashed "+bt.color+"25"}}
                            onPointerDown={e=>{ setDragFromSidebar({t:bt.t}); setDragPos({x:e.clientX,y:e.clientY}); }}
                            onKeyDown={e=>{
                              if(e.key===" "||e.key==="Enter"){
                                e.preventDefault();
                                addItem(bt.t, 80+cnt*(bt.w+4), 100);
                                announce(`${bt.label} eklendi. Toplam: ${totalValue+bt.val}`);
                              }
                            }}
                          >
                            <BlockSVG type={bt.t} size={0.38} colorBlind={colorBlind}/>
                          </div>
                          <div style={{flex:1}}>
                            <div style={{fontSize:12,fontWeight:800,color:bt.colorB}}>{t(bt.t)}</div>
                            <div style={{fontSize:10,color:"#b5a990",marginTop:2}}>{"= "+bt.val+" "+t("equalsUnit")}</div>
                            <div style={{fontSize:9,color:"#d4c8b0",marginTop:1}}>
                              Klavye: <strong>{bt.t==="ones"?"Q":bt.t==="tens"?"W":bt.t==="huns"?"E":"R"}</strong>
                            </div>
                          </div>
                        </div>

                      </div>
                    );
                  })}
                  {/* Araçlar */}
                  <div style={{background:"#fff",borderRadius:12,padding:"10px 12px",marginBottom:6,
                    border:"1px solid rgba(60,50,30,.04)",boxShadow:"0 1px 4px "+PALETTE.sh}}>
                    <div style={{fontSize:10,fontWeight:800,textTransform:"uppercase",letterSpacing:1.5,color:"#b5a990",marginBottom:6}}>Araçlar</div>
                    <Toggle on={showMat}      onToggle={()=>setShowMat(!showMat)}             icon="📊" label={t("toolMat")}    sub={langCode==="tr"?"Sürüklenebilir":langCode==="ku"?"Kaşkêş":"Draggable"}/>
                    <Toggle on={showVals}     onToggle={()=>setShowVals(!showVals)}           icon="🔢" label={t("toolVals")}   sub={langCode==="tr"?"Blok üzerinde sayı":langCode==="ku"?"Hejmara li ser blokê":"On block"}/>
                    <Toggle on={showDecomp}   onToggle={()=>setShowDecomp(!showDecomp)}       icon="📐" label={t("toolDecomp")} sub={langCode==="tr"?"Basamak analizi":langCode==="ku"?"Analîza cîhê":"Place analysis"}/>
                    <Toggle on={showTablet}   onToggle={()=>setShowTablet(!showTablet)}       icon="📟" label={t("toolTablet")} sub={langCode==="tr"?"Fiziksel cetvel":langCode==="ku"?"Cetele fîzîkî":"Physical ruler"}/>
                  </div>

                </div>
              )}

              {/* ── Etkinlikler Sekmesi ── */}
              {sidebarTab==="act" && (
                <div style={{flex:1,overflowY:"auto",padding:"4px 8px",scrollbarWidth:"none"}}>
                  {["keşif","kavram","işlem","karşılaştır","senaryo","yanılgı"].map(cat=>{
                    const acts = ACTIVITIES.filter(a=>a.cat===cat);
                    if (!acts.length) return null;
                    const catLabel = {keşif:"Keşif",kavram:"Kavram",işlem:"İşlemler",karşılaştır:"Karşılaştırma",senaryo:"🌍 Gerçek Hayat",yanılgı:"🔍 Yanılgı"}[cat];
                    const catColor = cat==="yanılgı"?"#ef4444":cat==="senaryo"?"#3b82f6":"#b5a990";
                    return (
                      <div key={cat}>
                        <div style={{fontSize:10,fontWeight:800,textTransform:"uppercase",letterSpacing:1,color:catColor,margin:"6px 0 3px"}}>{catLabel}</div>
                        {acts.map((tp,i)=>(
                          <button key={i} onClick={()=>setPendingActivity(tp)}
                            style={{display:"flex",alignItems:"center",gap:6,padding:"6px 8px",width:"100%",
                              background:PALETTE.card,border:"1px solid rgba(60,50,30,.04)",borderRadius:8,
                              cursor:"pointer",fontFamily:"inherit",textAlign:"left",color:PALETTE.text,
                              marginBottom:3,fontSize:11,fontWeight:600,boxShadow:"0 1px 2px "+PALETTE.sh}}>
                            <span aria-hidden style={{fontSize:14}}>{tp.i}</span>
                            <span style={{flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{tp.n}</span>
                            <span style={{fontSize:9,background:tp.diff===1?"#dcfce7":tp.diff===2?"#fef9c3":"#fee2e2",
                              color:tp.diff===1?"#166534":tp.diff===2?"#854d0e":"#991b1b",
                              padding:"1px 5px",borderRadius:4,flexShrink:0}}>
                              {tp.diff===1?t("easy"):tp.diff===2?t("medium"):t("hard")}
                            </span>
                          </button>
                        ))}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* ── Oyunlar Sekmesi ── */}
              {sidebarTab==="game" && (
                <div style={{flex:1,overflowY:"auto",padding:"8px",scrollbarWidth:"none"}}>
                  {!game ? (
                    <>
                      <div style={{fontSize:10,fontWeight:800,textTransform:"uppercase",letterSpacing:1.5,color:"#b5a990",marginBottom:8}}>Oyunlar</div>
                      <div style={{marginBottom:8,background:"#fff",borderRadius:10,padding:"8px 12px",border:"1px solid rgba(60,50,30,.04)"}}>
                        <div style={{fontSize:10,fontWeight:700,color:"#b5a990",marginBottom:4}}>Quiz Zorluk Seviyesi (Bloom)</div>
                        <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
                          {[1,2,3,4,5].map(l=>(
                            <button key={l} onClick={()=>setCurrentQuizLevel(l)}
                              aria-pressed={currentQuizLevel===l}
                              style={{padding:"4px 8px",borderRadius:6,border:"1.5px solid",
                                borderColor:currentQuizLevel===l?PALETTE.accent:"rgba(60,50,30,.1)",
                                background:currentQuizLevel===l?PALETTE.accentL:"#fff",
                                cursor:"pointer",fontSize:10,fontWeight:700,
                                color:currentQuizLevel===l?PALETTE.accentD:"#b5a990",fontFamily:"inherit"}}>
                              {"L"+l}
                            </button>
                          ))}
                        </div>
                        <div style={{fontSize:9,color:"#b5a990",marginTop:4}}>
                          {["","Hatırlama","Anlama","Uygulama","Analiz","Değerlendirme"][currentQuizLevel]} düzeyi • {QUIZ_POOL.filter(q=>q.bloom<=currentQuizLevel).length} soru
                        </div>
                      </div>
                      <button onClick={startQuiz} style={{width:"100%",padding:"12px",borderRadius:10,
                        border:"1.5px solid rgba(245,158,11,.15)",background:"#fff",cursor:"pointer",
                        fontSize:12,fontWeight:700,color:PALETTE.accentD,fontFamily:"inherit",textAlign:"left",
                        boxShadow:"0 1px 4px "+PALETTE.sh,marginBottom:6}}>
                        🧮 Basamak Değeri Quiz
                        <div style={{fontSize:10,color:"#b5a990",marginTop:2}}>{QUIZ_POOL.filter(q=>q.bloom<=currentQuizLevel).length} soru • Adaptif zorluk</div>
                      </button>
                      <button onClick={startBuild} style={{width:"100%",padding:"12px",borderRadius:10,
                        border:"1.5px solid rgba(59,130,246,.15)",background:"#fff",cursor:"pointer",
                        fontSize:12,fontWeight:700,color:PALETTE.hunsB,fontFamily:"inherit",textAlign:"left",
                        boxShadow:"0 1px 4px "+PALETTE.sh}}>
                        🏗️ Sayı Oluştur
                        <div style={{fontSize:10,color:"#b5a990",marginTop:2}}>Hedef sayıyı bloklarla oluştur</div>
                      </button>
                    </>
                  ) : (
                    <div style={{background:PALETTE.accentL,borderRadius:12,padding:"12px",border:"1.5px solid rgba(245,158,11,.2)"}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                        <div>
                          <span style={{fontSize:15,fontWeight:900,color:PALETTE.accentD}}>🏆 {game.score}/{game.total}</span>
                          {game.mode==="quiz"&&<span style={{fontSize:10,color:"#b5a990",marginLeft:6}}>Seviye L{currentQuizLevel}</span>}
                        </div>
                        <button onClick={()=>setGame(null)} aria-label="Oyunu bitir"
                          style={{padding:"4px 10px",borderRadius:8,border:"1px solid "+PALETTE.sideB,
                            background:"#fff",cursor:"pointer",fontSize:10,fontWeight:700,color:"#b5a990",fontFamily:"inherit"}}>✕ Bitir</button>
                      </div>

                      {game.mode==="quiz" && (() => {
                        const pool = QUIZ_POOL.filter(q=>q.bloom<=currentQuizLevel);
                        const q = pool[game.qIdx];
                        if (!q) return null;
                        return (
                          <div>
                            <div style={{padding:"12px",borderRadius:12,background:"#fff",
                              border:"1.5px solid rgba(245,158,11,.15)",textAlign:"center",marginBottom:8,
                              boxShadow:"0 1px 4px "+PALETTE.sh}}>
                              <div style={{fontSize:9,color:"#b5a990",marginBottom:4}}>
                                {"🎯 " + ["","Hatırlama","Anlama","Uygulama","Analiz","Değerlendirme"][q.bloom]}
                              </div>
                              <div role="heading" aria-level={3} style={{fontSize:14,fontWeight:900,color:PALETTE.text}}>{q.q}</div>
                            </div>
                            <div role="radiogroup" aria-label="Cevap seçenekleri" style={{display:"flex",flexDirection:"column",gap:4}}>
                              {q.o.map((opt,ci)=>{
                                const isCorrect = game.feedback && ci===q.a;
                                const isWrong = game.feedback==="wrong" && ci===game.selectedIdx;
                                return (
                                  <button key={ci}
                                    aria-label={`Seçenek ${ci+1}: ${opt}${isCorrect?" (doğru)":""}`}
                                    onClick={()=>{ setGame(g=>({...g,selectedIdx:ci})); pickQuiz(ci); }}
                                    disabled={!!game.feedback}
                                    style={{padding:"10px 12px",borderRadius:10,
                                      border:isCorrect?"2px solid #22c55e":isWrong?"2px solid #ef4444":"1.5px solid rgba(60,50,30,.04)",
                                      background:isCorrect?"rgba(34,197,94,.08)":isWrong?"rgba(239,68,68,.06)":"#fff",
                                      cursor:game.feedback?"default":"pointer",fontSize:13,fontWeight:700,
                                      color:isCorrect?"#15803d":isWrong?"#b91c1c":PALETTE.text,
                                      fontFamily:"inherit",boxShadow:"0 1px 3px "+PALETTE.sh,textAlign:"left"}}>
                                    {opt}{isCorrect?" ✅":isWrong?" ✗":""}
                                  </button>
                                );
                              })}
                            </div>
                            {game.feedback==="wrong"&&<div role="alert" style={{marginTop:8,fontSize:12,color:"#ef4444",textAlign:"center",fontWeight:700}}>
                              Doğru cevap: {q.o[q.a]}
                            </div>}
                            {game.streak>=3&&<div style={{marginTop:6,fontSize:11,color:"#15803d",textAlign:"center",fontWeight:700,animation:"pulse 1s"}}>
                              🔥 {game.streak} üst üste doğru!
                            </div>}
                          </div>
                        );
                      })()}

                      {game.mode==="build" && (
                        <div>
                          <div style={{padding:"14px",borderRadius:12,background:"#fff",textAlign:"center",marginBottom:8,boxShadow:"0 1px 4px "+PALETTE.sh}}>
                            <div style={{fontSize:11,color:"#b5a990",marginBottom:4}}>Bu sayıyı bloklarla oluştur:</div>
                            <div role="heading" aria-level={3} style={{fontSize:32,fontWeight:900,color:PALETTE.hunsB}}>{game.target}</div>
                            <div style={{fontSize:11,color:"#6d28d9",fontStyle:"italic",marginTop:2}}>{readNum(game.target)}</div>
                          </div>
                          <div style={{textAlign:"center",marginBottom:8}}>
                            <span aria-live="polite" style={{fontSize:13,fontWeight:800,color:combinedTotal===game.target?"#22c55e":PALETTE.text}}>
                              Şu anki: {combinedTotal}
                            </span>
                            {combinedTotal===game.target&&<span aria-hidden> ✅</span>}
                          </div>
                          <button onClick={checkBuild} style={{width:"100%",padding:"10px",borderRadius:10,border:"none",
                            background:combinedTotal===game.target?"linear-gradient(135deg,#22c55e,#15803d)":`linear-gradient(135deg,${PALETTE.huns},${PALETTE.hunsB})`,
                            color:"#fff",fontSize:13,fontWeight:800,cursor:"pointer",fontFamily:"inherit"}}>✓ Kontrol Et</button>
                          {game.feedback==="correct"&&<div role="alert" style={{marginTop:8,textAlign:"center",fontSize:14,color:"#22c55e",fontWeight:900,animation:"popIn .3s"}}>🎉 Doğru!</div>}
                          {game.feedback==="wrong"&&<div role="alert" style={{marginTop:8,textAlign:"center",fontSize:12,color:"#ef4444",fontWeight:700}}>Henüz değil — blok ekle veya çıkar</div>}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* ── Ayarlar Sekmesi ── */}
              {sidebarTab==="feat" && (
                <div style={{flex:1,overflowY:"auto",padding:"8px",scrollbarWidth:"none"}}>
                  <div style={{background:"#fff",borderRadius:12,padding:"10px 12px",marginBottom:6,border:"1px solid rgba(60,50,30,.04)"}}>
                    <div style={{fontSize:10,fontWeight:800,textTransform:"uppercase",letterSpacing:1.5,color:"#b5a990",marginBottom:6}}>Görünüm</div>
                    <Toggle on={showMat}        onToggle={()=>setShowMat(!showMat)}             icon="📊" label={t("toolMat")}/>
                    <Toggle on={showVals}       onToggle={()=>setShowVals(!showVals)}           icon="🔢" label={t("toolVals")}/>
                    <Toggle on={showDecomp}     onToggle={()=>setShowDecomp(!showDecomp)}       icon="📐" label={t("toolDecomp")}/>
                    <Toggle on={showTablet}     onToggle={()=>setShowTablet(!showTablet)}       icon="📟" label={t("toolTablet")}/>
                  </div>
                  <div style={{background:"#fff",borderRadius:12,padding:"10px 12px",marginBottom:6,border:"1px solid rgba(60,50,30,.04)"}}>
                    <div style={{fontSize:10,fontWeight:800,textTransform:"uppercase",letterSpacing:1.5,color:"#b5a990",marginBottom:6}}>Erişilebilirlik</div>
                    <Toggle on={soundEnabled}   onToggle={()=>setSoundEnabled(!soundEnabled)}   icon="🔊" label={t("soundFx")}           sub={langCode==="tr"?"Gruplama, çözme, quiz":langCode==="ku"?"Kom kirin, veqetandin, quîz":"Grouping, decompose, quiz"}/>
                    <Toggle on={ttsEnabled}     onToggle={()=>setTtsEnabled(!ttsEnabled)}       icon="🗣" label={t("autoSpeak")}          sub={langCode==="ku"?"Kurmancî TTS":langCode==="en"?"English TTS":"Türkçe TTS"}/>
                    <Toggle on={colorBlind}     onToggle={()=>setColorBlind(!colorBlind)}       icon="👁" label={t("colorBlindMode")}     sub={langCode==="tr"?"Doku desenleri aktif":langCode==="ku"?"Nexşeyên tevnî aktîf":"Texture patterns active"}/>
                    <Toggle on={highContrast}   onToggle={()=>setHighContrast(!highContrast)}   icon="◑" label={t("highContrastMode")}   sub={langCode==="tr"?"Görünürlüğü artırır":langCode==="ku"?"Xuyanîbûnê zêde dike":"Increases visibility"}/>
                    <div style={{padding:"6px 8px",marginBottom:3}}>
                      <div style={{fontSize:11,fontWeight:700,color:PALETTE.text,marginBottom:4}}>{t("fontLabel")}</div>
                      <select value={fontFamily} onChange={e=>setFontFamily(e.target.value)}
                        style={{width:"100%",padding:"5px 8px",borderRadius:6,border:"1px solid "+PALETTE.sideB,
                          background:"#fff",fontSize:11,fontFamily:"inherit",color:PALETTE.text}}>
                        <option value="nunito">Nunito (Varsayılan)</option>
                        <option value="opendyslexic">Disleksi Dostu</option>
                        <option value="mono">Monospace</option>
                        <option value="serif">Serif</option>
                      </select>
                    </div>
                    <div style={{padding:"6px 8px"}}>
                      <div style={{display:"flex",justifyContent:"space-between",fontSize:11,fontWeight:700,color:PALETTE.text,marginBottom:4}}>
                        <span>{t("fontSizeLabel")}</span>
                        <span>{Math.round(fontSize*100)}%</span>
                      </div>
                      <input type="range" min="0.8" max="1.5" step="0.1" value={fontSize}
                        onChange={e=>setFontSize(parseFloat(e.target.value))}
                        aria-label="Yazı boyutu" style={{width:"100%"}}/>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </nav>

        {/* ══ KANVAS ══ */}
        <main ref={mainAreaRef} aria-label="Blok çalışma alanı" style={{flex:1,position:"relative",overflow:"hidden"}}>
          <div ref={canvasRef} onClick={()=>setSelectedBlock(null)}
            style={{position:"absolute",inset:0,overflow:"hidden",...bgStyle}}>

            {/* SVG Doku Desenleri */}
            <svg width={0} height={0} style={{position:"absolute"}}>
              <BlockPatternDefs/>
            </svg>

            {/* Araç Çubuğu */}
            <div role="toolbar" aria-label="Çizim araçları" style={{position:"absolute",top:8,left:"50%",transform:"translateX(-50%)",
              zIndex:30,display:"flex",gap:1,background:"rgba(255,255,255,.94)",backdropFilter:"blur(16px)",
              borderRadius:10,padding:"3px 5px",boxShadow:"0 2px 12px rgba(0,0,0,.05)",
              border:"1px solid rgba(0,0,0,.04)",alignItems:"center"}}>
              {[["select","🖱️","Seç"],["pen","✏️","Kalem"],["highlighter","🖍️","Vurgulayıcı"],["eraser","🧹","Silgi"]].map(([t,ic,lbl])=>(
                <button key={t} aria-label={lbl} aria-pressed={tool===t}
                  onClick={()=>{setTool(t);if(t==="highlighter"){setPenAlpha(.35);setPenWidth(12);}else if(t==="pen"){setPenAlpha(1);setPenWidth(3);}}}
                  style={{width:30,height:30,borderRadius:7,border:tool===t?"2px solid "+PALETTE.accent:"2px solid transparent",
                    background:tool===t?PALETTE.accentL:"transparent",cursor:"pointer",fontSize:13,
                    display:"flex",alignItems:"center",justifyContent:"center"}}>{ic}</button>
              ))}
              {(tool==="pen"||tool==="highlighter")&&(
                <>
                  {["#1a1a1a","#ef4444","#3b82f6","#22c55e","#f59e0b","#8b5cf6"].map(c=>(
                    <button key={c} aria-label={`Renk: ${c}`} onClick={()=>setPenColor(c)}
                      style={{width:14,height:14,borderRadius:"50%",background:c,
                        border:penColor===c?"2px solid "+PALETTE.accent:"1px solid rgba(0,0,0,.1)",cursor:"pointer"}}/>
                  ))}
                  {[2,4,8].map(w=>(
                    <button key={w} aria-label={`Kalınlık ${w}`} onClick={()=>setPenWidth(tool==="highlighter"?w*3:w)}
                      style={{width:24,height:24,borderRadius:5,
                        border:penWidth===w?"2px solid "+PALETTE.accent:"1px solid rgba(0,0,0,.06)",
                        cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
                      <div style={{width:w+4,height:w,borderRadius:w,background:penColor}}/>
                    </button>
                  ))}
                </>
              )}
              {tool==="eraser"&&[12,24,40].map(s=>(
                <button key={s} aria-label={`Silgi boyutu ${s}`} onClick={()=>setEraserSize(s)}
                  style={{width:24,height:24,borderRadius:5,
                    border:eraserSize===s?"2px solid "+PALETTE.accent:"1px solid rgba(0,0,0,.06)",
                    cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
                  <div style={{width:s/2,height:s/2,borderRadius:"50%",border:"2px solid #999"}}/>
                </button>
              ))}
              <div aria-hidden style={{width:1,height:16,background:"rgba(0,0,0,.08)",margin:"0 1px"}}/>
              <button onClick={()=>dispatch({type:"UNDO_STROKE"})} aria-label="Çizim geri al" disabled={!strokes.length}
                style={{width:26,height:26,borderRadius:6,border:"none",background:"transparent",cursor:strokes.length?"pointer":"default",fontSize:13,color:strokes.length?"#666":"#ddd"}}>↩</button>
              <button onClick={()=>dispatch({type:"REDO_STROKE"})} aria-label="Çizim ileri al" disabled={!undone.length}
                style={{width:26,height:26,borderRadius:6,border:"none",background:"transparent",cursor:undone.length?"pointer":"default",fontSize:13,color:undone.length?"#666":"#ddd"}}>↪</button>
              <div aria-hidden style={{width:1,height:16,background:"rgba(0,0,0,.08)",margin:"0 1px"}}/>
              <button onClick={()=>dispatch({type:"UNDO"})} aria-label="Blok geri al" disabled={!itemHistory.length}
                style={{width:26,height:26,borderRadius:6,border:"none",background:"transparent",cursor:itemHistory.length?"pointer":"default",fontSize:11,color:itemHistory.length?PALETTE.accent:"#ddd",fontWeight:900}}>⊘</button>
              <button onClick={()=>dispatch({type:"REDO"})} aria-label="Blok ileri al" disabled={!itemFuture.length}
                style={{width:26,height:26,borderRadius:6,border:"none",background:"transparent",cursor:itemFuture.length?"pointer":"default",fontSize:11,color:itemFuture.length?PALETTE.accent:"#ddd",fontWeight:900}}>⊛</button>
              <div aria-hidden style={{width:1,height:16,background:"rgba(0,0,0,.08)",margin:"0 1px"}}/>
              {/* Temizle — içerik varsa kırmızı aktif, yoksa soluk */}
              <button
                onClick={()=>{if(items.length>0||strokes.length>0){dispatch({type:"CLEAR_ALL"});announce(t("clear")+" ✓");}}}
                aria-label={t("clear")}
                disabled={items.length===0&&strokes.length===0}
                title={t("clear")}
                style={{width:28,height:28,borderRadius:6,border:"none",
                  background:items.length>0||strokes.length>0?"rgba(239,68,68,.08)":"transparent",
                  cursor:items.length>0||strokes.length>0?"pointer":"default",
                  fontSize:14,color:items.length>0||strokes.length>0?"#ef4444":"#ddd",
                  display:"flex",alignItems:"center",justifyContent:"center",
                  transition:"all .2s"}}>
                🗑
              </button>
            </div>

            {/* Cursor özel */}
            <div ref={cursorRef} aria-hidden style={{position:"absolute",display:"none",borderRadius:"50%",border:"2px solid #000",pointerEvents:"none",zIndex:26}}/>

            {/* Çizim Kanvası */}
            <canvas ref={drawRef} style={{position:"absolute",inset:0,
              zIndex:tool!=="select"?25:0,pointerEvents:tool!=="select"?"auto":"none",
              cursor:tool!=="select"?"none":"default"}}
              onPointerDown={drawStart} onPointerMove={drawMove} onPointerUp={drawEnd}
              onPointerCancel={drawEnd}
              onPointerLeave={()=>{if(cursorRef.current)cursorRef.current.style.display="none";}}
              aria-hidden="true"/>

            {/* Zoom Katmanı */}
            <div style={{position:"absolute",inset:0,transform:`scale(${zoom})`,transformOrigin:"0 0",
              width:(100/zoom)+"%",height:(100/zoom)+"%"}}>

              {/* Basamak Tablosu */}
              {showMat&&(
                <div ref={matRef} data-mat="1"
                  style={matXY?{position:"absolute",left:matXY.x,top:matXY.y,zIndex:4,transform:`scale(${matScale})`,transformOrigin:"top left"}:
                    {position:"absolute",top:"50%",left:"50%",zIndex:4,transform:`translate(-50%,-50%) scale(${matScale})`,transformOrigin:"center center",animation:"slideDown .3s"}}>
                  <div style={{background:"rgba(255,255,255,.97)",backdropFilter:"blur(14px)",borderRadius:16,
                    overflow:"hidden",border:"1.5px solid rgba(60,50,30,.06)",boxShadow:"0 8px 32px "+PALETTE.shM}}>
                    <div onPointerDown={e=>{
                      e.preventDefault(); e.stopPropagation();
                      if(!canvasRef.current)return;
                      const r=canvasRef.current.getBoundingClientRect();
                      const el=e.currentTarget.closest("[data-mat]");
                      if(!el)return;
                      const er=el.getBoundingClientRect();
                      const ox=(er.left-r.left)/zoom,oy=(er.top-r.top)/zoom;
                      const mx=(e.clientX-r.left)/zoom,my=(e.clientY-r.top)/zoom;
                      setMatDrag({offX:mx-ox,offY:my-oy});
                      if(!matXY)setMatXY({x:ox,y:oy});
                    }}
                      style={{background:`linear-gradient(135deg,${PALETTE.accent},${PALETTE.accentD})`,
                        padding:"5px 8px",display:"flex",alignItems:"center",gap:4,cursor:"grab",
                        touchAction:"none",userSelect:"none"}}>
                      <button onClick={e=>{e.stopPropagation();setMatCols(c=>Math.max(2,c-1));}} aria-label="Sütun azalt"
                        style={{width:20,height:20,borderRadius:5,border:"1px solid rgba(255,255,255,.3)",
                          background:"rgba(255,255,255,.15)",cursor:matCols>2?"pointer":"default",
                          color:matCols>2?"#fff":"rgba(255,255,255,.3)",fontSize:12,fontWeight:900}}>−</button>
                      <span style={{flex:1,textAlign:"center",fontSize:9,fontWeight:900,color:"#fff",letterSpacing:1}}>{t("placeTable")}</span>
                      <button onClick={e=>{e.stopPropagation();setMatCols(c=>Math.min(4,c+1));}} aria-label="Sütun artır"
                        style={{width:20,height:20,borderRadius:5,border:"1px solid rgba(255,255,255,.3)",
                          background:"rgba(255,255,255,.15)",cursor:matCols<4?"pointer":"default",
                          color:matCols<4?"#fff":"rgba(255,255,255,.3)",fontSize:12,fontWeight:900}}>+</button>
                      <div aria-hidden style={{width:1,height:12,background:"rgba(255,255,255,.2)",margin:"0 2px"}}/>
                      <button onClick={e=>{e.stopPropagation();setMatScale(s=>Math.max(.5,+(s-.15).toFixed(2)));}} aria-label="Tabloyu küçült"
                        style={{width:20,height:20,borderRadius:5,border:"1px solid rgba(255,255,255,.3)",
                          background:"rgba(255,255,255,.15)",cursor:"pointer",color:"#fff",fontSize:9,fontWeight:900,display:"flex",alignItems:"center",justifyContent:"center"}}>🔍−</button>
                      <button onClick={e=>{e.stopPropagation();setMatScale(s=>Math.min(2,+(s+.15).toFixed(2)));}} aria-label="Tabloyu büyüt"
                        style={{width:20,height:20,borderRadius:5,border:"1px solid rgba(255,255,255,.3)",
                          background:"rgba(255,255,255,.15)",cursor:"pointer",color:"#fff",fontSize:9,fontWeight:900,display:"flex",alignItems:"center",justifyContent:"center"}}>🔍+</button>
                    </div>
                    {/* Tablo — CSS grid ile satır hizalaması */}
                    <div style={{display:"grid",gridTemplateColumns:`repeat(${visCols.length},1fr)`}}>
                      {/* Satır 1: Sütun başlıkları */}
                      {visCols.map(col=>(
                        <div key={col.t+"h"} style={{textAlign:"center",padding:"4px 2px",
                          background:col.c+"10",borderBottom:"2px solid "+col.c+"30",
                          borderRight:"1px solid rgba(60,50,30,.04)"}}>
                          <div style={{fontSize:10,fontWeight:800,color:col.c}}>{col.l}</div>
                          <div style={{fontSize:8,color:col.c+"88"}}>{t("colSub")}</div>
                        </div>
                      ))}
                      {/* Satır 2: + butonları */}
                      {visCols.map(col=>(
                        <button key={col.t+"+"} onClick={()=>setMatCounts(p=>({...p,[col.t]:p[col.t]+1}))}
                          aria-label={`${col.l} ekle`}
                          style={{padding:"5px 0",border:"none",borderBottom:"1px solid rgba(0,0,0,.04)",
                            borderRight:"1px solid rgba(60,50,30,.03)",
                            background:col.c+"08",cursor:"pointer",fontSize:14,fontWeight:900,
                            color:col.c,fontFamily:"inherit",textAlign:"center"}}>+</button>
                      ))}
                      {/* Satır 3: Blok görselleri — sabit yükseklik */}
                      {visCols.map(col=>{
                        const v=matCounts[col.t];
                        return (
                          <div key={col.t+"b"}
                            style={{height:120,display:"flex",flexDirection:"column",
                              justifyContent:"center",alignItems:"center",
                              gap:2,flexWrap:"wrap",padding:"4px",
                              borderRight:"1px solid rgba(60,50,30,.03)",
                              background:"rgba(255,255,255,.4)"}}>
                            {v>0&&Array.from({length:Math.min(v,9)},(_,i)=>(
                              <BlockSVG key={i} type={col.t} size={col.t==="ones"?1.2:0.22} colorBlind={colorBlind}/>
                            ))}
                            {v>9&&<span style={{fontSize:9,color:"#999",fontWeight:700}}>+{v-9}</span>}
                            {v===0&&<span style={{fontSize:18,color:"#e8dfd0"}}>—</span>}
                          </div>
                        );
                      })}
                      {/* Satır 4: − butonları */}
                      {visCols.map(col=>{
                        const v=matCounts[col.t];
                        return (
                          <button key={col.t+"-"} onClick={()=>setMatCounts(p=>({...p,[col.t]:Math.max(0,p[col.t]-1)}))}
                            disabled={v<1} aria-label={`${col.l} çıkar`}
                            style={{padding:"5px 0",border:"none",
                              borderTop:"1px solid rgba(0,0,0,.04)",
                              borderBottom:"1px solid rgba(0,0,0,.06)",
                              borderRight:"1px solid rgba(60,50,30,.03)",
                              background:v>0?col.c+"08":"transparent",
                              cursor:v>0?"pointer":"default",fontSize:14,fontWeight:900,
                              color:v>0?col.c:"#ddd",fontFamily:"inherit",textAlign:"center"}}>−</button>
                        );
                      })}
                      {/* Satır 5: Adet sayısı */}
                      {visCols.map(col=>{
                        const v=matCounts[col.t];
                        return (
                          <div key={col.t+"n"} aria-live="polite"
                            style={{textAlign:"center",padding:"4px 0",fontSize:22,fontWeight:900,
                              color:col.c,borderRight:"1px solid rgba(60,50,30,.03)"}}>
                            {v}
                          </div>
                        );
                      })}
                      {/* Satır 6: Sayısal değer */}
                      {visCols.map(col=>{
                        const v=matCounts[col.t];
                        const sv=v*{ths:1000,huns:100,tens:10,ones:1}[col.t];
                        return (
                          <div key={col.t+"v"}
                            style={{textAlign:"center",padding:"2px 0 6px",fontSize:11,fontWeight:700,
                              color:col.cB,borderTop:"1px solid rgba(0,0,0,.04)",
                              borderRight:"1px solid rgba(60,50,30,.03)"}}>
                            {sv>0?sv:"—"}
                          </div>
                        );
                      })}
                    </div>
                    {(()=>{
                      const mtv = matCounts.ones + matCounts.tens*10 + matCounts.huns*100 + matCounts.ths*1000;
                      const mOk = mtv>0 ? readNum(mtv) : "";
                      const mParts=[];
                      if(matCounts.ths>0)mParts.push(""+(matCounts.ths*1000));
                      if(matCounts.huns>0)mParts.push(""+(matCounts.huns*100));
                      if(matCounts.tens>0)mParts.push(""+(matCounts.tens*10));
                      if(matCounts.ones>0)mParts.push(""+matCounts.ones);
                      const mDecomp=mParts.length>1?mParts.join(" + ")+" = "+mtv:mParts.length===1?""+mtv:"";
                      const mExp=[];
                      if(matCounts.ths>0)mExp.push(matCounts.ths+"×1000");
                      if(matCounts.huns>0)mExp.push(matCounts.huns+"×100");
                      if(matCounts.tens>0)mExp.push(matCounts.tens+"×10");
                      if(matCounts.ones>0)mExp.push(matCounts.ones+"×1");
                      const mExpStr=mExp.length?mExp.join(" + ")+" = "+mtv:"";
                      return (
                        <div style={{borderTop:"2px solid rgba(60,50,30,.06)",padding:"8px 12px",background:"rgba(60,50,30,.01)"}}>
                          <div style={{display:"flex",alignItems:"baseline",gap:8,marginBottom:4}}>
                            <span style={{fontSize:10,fontWeight:700,color:"#b5a990",minWidth:52}}>{t("total")}</span>
                            <span aria-live="polite" style={{fontSize:24,fontWeight:900,color:PALETTE.accentD}}>{mtv||"—"}</span>
                            {mtv>0&&<button onClick={()=>speakInLang(`${mtv} — ${mOk}`,langCode)}
                              aria-label="Seslendir" style={{background:"none",border:"none",cursor:"pointer",fontSize:12,color:"#b5a990"}}>🔊</button>}
                          </div>
                          {mDecomp&&mtv>0&&<div style={{display:"flex",alignItems:"baseline",gap:8,marginBottom:3}}>
                            <span style={{fontSize:10,fontWeight:700,color:"#b5a990",minWidth:52}}>{t("decomp")}</span>
                            <span style={{fontSize:12,fontWeight:800,color:PALETTE.text,fontFamily:"'Courier New',monospace"}}>{mDecomp}</span>
                          </div>}
                          {mExpStr&&<div style={{display:"flex",alignItems:"baseline",gap:8,marginBottom:3}}>
                            <span style={{fontSize:10,fontWeight:700,color:"#b5a990",minWidth:52}}>{t("expanded")}</span>
                            <span style={{fontSize:10,fontWeight:700,color:"#888",fontFamily:"'Courier New',monospace"}}>{mExpStr}</span>
                          </div>}
                          {mOk&&<div style={{display:"flex",alignItems:"baseline",gap:8}}>
                            <span style={{fontSize:10,fontWeight:700,color:"#b5a990",minWidth:52}}>{t("reading")}</span>
                            <span style={{fontSize:13,fontWeight:900,color:"#6d28d9",fontStyle:"italic"}}>{mOk}</span>
                          </div>}
                        </div>
                      );
                    })()}
                  </div>
                </div>
              )}

              {/* ── Çözümleme Diyagramı ── */}
              {showDecomp&&totalValue>0&&(()=>{
                const placeNames=[t("onesShort"),t("tensShort"),t("hunsShort"),t("thsShort")];
                const placeVals=[1,10,100,1000];
                const placeClrs=[PALETTE.ones,PALETTE.tens,PALETTE.huns,PALETTE.ths];
                const placeClrsB=[PALETTE.onesB,PALETTE.tensB,PALETTE.hunsB,PALETTE.thsB];
                const str=""+totalValue;
                const digits=[];
                for(let i=str.length-1;i>=0;i--){
                  const d=parseInt(str[i]),pi=str.length-1-i;
                  if(pi<4)digits.unshift({d,pv:placeVals[pi],sv:d*placeVals[pi],c:placeClrs[pi],cB:placeClrsB[pi],pn:placeNames[pi]});
                }
                return (
                  <div
                    style={decompXY
                      ? {position:"absolute",left:decompXY.x,top:decompXY.y,zIndex:4,animation:"slideDown .3s"}
                      : {position:"absolute",top:60,right:16,zIndex:4,animation:"slideDown .3s"}}
                    onPointerDown={e=>{
                      e.preventDefault(); e.stopPropagation();
                      const el=e.currentTarget;
                      const cvR=canvasRef.current?.getBoundingClientRect();
                      if(!cvR)return;
                      const r=el.getBoundingClientRect();
                      const ox=e.clientX-r.left, oy=e.clientY-r.top;
                      function onM(ev){
                        setDecompXY({
                          x:(ev.clientX-cvR.left)/zoom-ox/zoom,
                          y:(ev.clientY-cvR.top)/zoom-oy/zoom
                        });
                      }
                      function onU(){window.removeEventListener("pointermove",onM);window.removeEventListener("pointerup",onU);}
                      window.addEventListener("pointermove",onM);window.addEventListener("pointerup",onU);
                    }}>
                    <div role="region" aria-label={t("decompTitle")}
                      style={{background:"rgba(255,255,255,.97)",backdropFilter:"blur(14px)",borderRadius:14,
                        overflow:"hidden",border:"1.5px solid rgba(60,50,30,.06)",
                        boxShadow:"0 6px 24px "+PALETTE.shM,width:260}}>
                      <div style={{background:"linear-gradient(135deg,#f5f0e3,#ede5d0)",padding:"8px 14px",borderBottom:"1px solid rgba(60,50,30,.06)"}}>
                        <div style={{fontSize:10,fontWeight:800,color:PALETTE.accentD,letterSpacing:.5}}>{t("decompTitle")}</div>
                      </div>
                      <div style={{padding:"12px 14px"}}>
                        <div style={{display:"flex",gap:2,marginBottom:10}}>
                          {digits.map((dg,i)=>(
                            <div key={i} aria-label={`${dg.d} ${dg.pn}`}
                              style={{width:28,height:32,borderRadius:6,background:dg.c+"15",border:"1.5px solid "+dg.c+"30",
                                display:"flex",alignItems:"center",justifyContent:"center"}}>
                              <span style={{fontSize:18,fontWeight:900,color:dg.c}}>{dg.d}</span>
                            </div>
                          ))}
                        </div>
                        {digits.slice().reverse().map((dg,ri)=>(
                          <div key={ri} style={{display:"flex",alignItems:"center",gap:6,padding:"5px 0",
                            borderBottom:ri<digits.length-1?"1px solid rgba(60,50,30,.04)":"none"}}>
                            <div aria-hidden style={{width:6,height:6,borderRadius:"50%",background:dg.c,flexShrink:0}}/>
                            <span style={{fontSize:14,fontWeight:800,color:dg.c,width:20,textAlign:"right"}}>{dg.d}</span>
                            <span aria-hidden style={{fontSize:11,color:"#ccc"}}>×</span>
                            <span style={{fontSize:13,fontWeight:700,color:"#888",width:38,textAlign:"right"}}>{dg.pv}</span>
                            <span aria-hidden style={{fontSize:11,color:"#ccc"}}>=</span>
                            <span style={{fontSize:14,fontWeight:900,color:dg.c,flex:1,textAlign:"right"}}>{dg.sv}</span>
                          </div>
                        ))}
                        <div style={{borderTop:"2px solid "+PALETTE.accentD+"30",marginTop:6,paddingTop:6,
                          display:"flex",alignItems:"center",justifyContent:"flex-end",gap:8}}>
                          <span style={{fontSize:10,fontWeight:700,color:"#b5a990"}}>{t("total")}</span>
                          <span style={{fontSize:20,fontWeight:900,color:PALETTE.accentD}}>{totalValue}</span>
                        </div>
                        {okunus&&<div style={{textAlign:"right",marginTop:2}}>
                          <span style={{fontSize:11,fontWeight:700,color:"#6d28d9",fontStyle:"italic"}}>{okunus}</span>
                        </div>}
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* ── DokunSay Tableti ── */}
              {showTablet&&(()=>{
                const ALL_TAB=[{t:"ths",l:t("colThs"),c:PALETTE.ths,cB:PALETTE.thsB},{t:"huns",l:t("colHuns"),c:PALETTE.huns,cB:PALETTE.hunsB},{t:"tens",l:t("colTens"),c:PALETTE.tens,cB:PALETTE.tensB},{t:"ones",l:t("colOnes"),c:PALETTE.ones,cB:PALETTE.onesB}];
                const tabCols=tabVis.map(tv=>ALL_TAB.find(c=>c.t===tv)).filter(Boolean);
                const hiddenCols=ALL_TAB.filter(c=>!tabVis.includes(c.t));
                const NC=tabCols.length; const PW=150; const PH=230; const TK=26; const TAB=14; const SEP=tabSep?14:0;
                const colFull={ths:t("colThs"),huns:t("colHuns"),tens:t("colTens"),ones:t("colOnes")};
                const rc={
                  ones:[PALETTE.ones,"#fde68a",PALETTE.onesB],
                  tens:[PALETTE.tens,"#fdba74",PALETTE.tensB],
                  huns:[PALETTE.huns,"#93c5fd",PALETTE.hunsB],
                  ths:[PALETTE.ths,"#c4b5fd",PALETTE.thsB]
                };
                const tabStyle=tabXY
                  ?{position:"absolute",left:tabXY.x,top:tabXY.y,zIndex:5}
                  :{position:"absolute",bottom:50,left:"50%",transform:"translateX(-50%)",zIndex:5,animation:"slideDown .3s"};
                return (
                  <div style={tabStyle} onPointerDown={startTabDrag}>
                    <div style={{display:"flex",justifyContent:"center",gap:4,marginBottom:4,flexWrap:"wrap"}}>
                      <button data-tabbtn="1" onClick={()=>setTabSep(!tabSep)}
                        style={{padding:"3px 8px",borderRadius:6,border:"1px solid rgba(0,0,0,.08)",
                          background:tabSep?"#fff":"rgba(255,255,255,.6)",cursor:"pointer",
                          fontSize:10,fontWeight:700,color:tabSep?PALETTE.accentD:"#b5a990",fontFamily:"inherit"}}>
                        {tabSep?t("tabJoinBtn"):t("tabSepBtn")}
                      </button>
                      {hiddenCols.map(c=>(
                        <button key={c.t} data-tabbtn="1" onClick={()=>tabAddCol(c.t)}
                          style={{padding:"3px 8px",borderRadius:6,border:`1.5px solid ${c.c}40`,
                            background:c.c+"10",cursor:"pointer",fontSize:10,fontWeight:700,color:c.c,fontFamily:"inherit"}}>
                          + {c.l}
                        </button>
                      ))}
                    </div>
                    <div role="region" aria-label="DokunSay fiziksel cetvel"
                      style={{display:"flex",alignItems:"flex-start",gap:SEP,cursor:"grab",touchAction:"none"}}>
                      {tabCols.map((col,ci)=>{
                        const v=tabCounts[col.t]; const c=rc[col.t];
                        const rW=9; const maxR=9; const slotH=46;
                        const totalW=NC*PW+(NC-1)*(tabSep?SEP:-TAB+1);
                        return (
                          <svg key={col.t} width={PW} height={PH+6}
                            viewBox={`0 0 ${PW} ${PH+6}`}
                            role="group" aria-label={`${colFull[col.t]} basamağı: ${v}`}
                            style={{display:"block",overflow:"visible",
                              marginLeft:ci>0?(tabSep?SEP:-TAB+1):0,
                              position:"relative",zIndex:NC-ci,
                              filter:"drop-shadow(2px 4px 10px rgba(0,0,0,.14))"}}>
                            <defs>
                              <linearGradient id={`tb${ci}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#fad643"/><stop offset="40%" stopColor="#f0c225"/><stop offset="100%" stopColor="#c99a14"/>
                              </linearGradient>
                              <linearGradient id={`sc${ci}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#fae574"/><stop offset="100%" stopColor="#ecc42a"/>
                              </linearGradient>
                            </defs>
                            {/* Cetvel gövdesi */}
                            <rect x={0} y={0} width={PW} height={PH} rx={12} fill={`url(#tb${ci})`} stroke="#a07810" strokeWidth={1.5}/>
                            {/* Cetvel dişleri */}
                            {Array.from({length:Math.floor((PW-12)/6)},(_,i)=>{
                              const x=8+i*6; if(x>PW-6)return null;
                              const h=i%5===0?TK:i%2===0?TK*.6:TK*.3;
                              return <rect key={i} x={x} y={1} width={i%5===0?2.5:1.5} height={h} rx={.5} fill="rgba(0,0,0,.7)"/>;
                            })}
                            {/* Silme butonu */}
                            {NC>1&&(
                              <g data-tabbtn="1" style={{cursor:"pointer"}} onClick={()=>tabRemCol(col.t)}>
                                <circle cx={PW-12} cy={TK-6} r={8} fill="rgba(0,0,0,.15)"/>
                                <text x={PW-12} y={TK-2} textAnchor="middle" fontSize={10} fontWeight={900} fill="rgba(255,255,255,.75)">×</text>
                              </g>
                            )}
                            {/* Ekran yuvası */}
                            <rect x={10} y={TK+4} width={PW-20} height={slotH} rx={7} fill="#1a1a1a" stroke="#111" strokeWidth={1}/>
                            {/* Boş yuva çizgileri */}
                            {Array.from({length:maxR},(_,si)=>{
                              const sx=PW-18-si*(rW+3);
                              return <rect key={si} x={sx} y={TK+6} width={rW} height={slotH-4} rx={1.5}
                                fill={si<v?"none":"rgba(255,255,255,.05)"} stroke="rgba(255,255,255,.07)" strokeWidth={.5}/>;
                            })}
                            {/* Doldurulmuş çubuklar */}
                            {Array.from({length:v},(_,ri)=>{
                              const sx=PW-18-ri*(rW+3);
                              const rH=col.t==="ths"?slotH-2:col.t==="huns"?slotH-6:col.t==="tens"?slotH-12:slotH-20;
                              const ry=TK+6+(slotH-4-rH);
                              return (
                                <g key={ri}>
                                  <rect x={sx+.5} y={ry+.5} width={rW} height={rH} rx={1.5} fill="rgba(0,0,0,.3)"/>
                                  <rect x={sx} y={ry} width={rW} height={rH} rx={1.5} fill={c[0]} stroke={c[2]} strokeWidth={.7}/>
                                  <rect x={sx} y={ry} width={rW} height={3} rx={1} fill={c[1]} opacity={.8}/>
                                  <rect x={sx+1} y={ry+2} width={1.5} height={rH-3} rx={.7} fill="rgba(255,255,255,.4)"/>
                                </g>
                              );
                            })}
                            {/* Basamak etiketi */}
                            <text x={PW/2} y={TK+slotH+18} textAnchor="middle" fontSize={11} fontWeight={800}
                              fill="rgba(80,50,0,.55)" fontFamily="Georgia,serif">{colFull[col.t]}</text>
                            {/* Sayı kartı */}
                            <rect x={PW/2-50} y={TK+slotH+24} width={100} height={58} rx={10}
                              fill={`url(#sc${ci})`} stroke="#111" strokeWidth={3}/>
                            <rect x={PW/2-58} y={TK+slotH+40} width={9} height={20} rx={3} fill="#111"/>
                            <rect x={PW/2+50} y={TK+slotH+40} width={9} height={20} rx={3} fill="#111"/>
                            <text x={PW/2} y={TK+slotH+64} textAnchor="middle" fontSize={34} fontWeight={900}
                              fill="#7a4400" fontFamily="Georgia,serif">{v}</text>
                            {/* + butonu */}
                            <g data-tabbtn="1" style={{cursor:"pointer"}} onClick={()=>tabInc(col.t)}>
                              <rect x={PW/2-36} y={TK+slotH+88} width={32} height={22} rx={6} fill="#c9a415" stroke="#a07810" strokeWidth={1}/>
                              <rect x={PW/2-35} y={TK+slotH+89} width={30} height={18} rx={5} fill="#ecc52a"/>
                              <text x={PW/2-20} y={TK+slotH+102} textAnchor="middle" fontSize={15} fontWeight={900} fill="rgba(100,60,0,.6)">+</text>
                            </g>
                            {/* − butonu */}
                            <g data-tabbtn="1" style={{cursor:"pointer"}} onClick={()=>tabDec(col.t)}>
                              <rect x={PW/2+4} y={TK+slotH+88} width={32} height={22} rx={6} fill="#c9a415" stroke="#a07810" strokeWidth={1}/>
                              <rect x={PW/2+5} y={TK+slotH+89} width={30} height={18} rx={5} fill="#ecc52a"/>
                              <text x={PW/2+20} y={TK+slotH+102} textAnchor="middle" fontSize={15} fontWeight={900} fill="rgba(100,60,0,.6)">−</text>
                            </g>
                            <text x={PW/2} y={PH-4} textAnchor="middle" fontSize={8} fontWeight={700}
                              fill="rgba(120,80,0,.15)" fontFamily="Georgia,serif">DokunSay</text>
                          </svg>
                        );
                      })}
                    </div>
                    {/* Tablet toplam */}
                    <div style={{display:"flex",justifyContent:"center",marginTop:-8,position:"relative",zIndex:10}}>
                      <svg width={120} height={68} viewBox="0 0 120 68"
                        aria-label={`Tablet toplam: ${tabTotal}`}
                        style={{filter:"drop-shadow(1px 3px 8px rgba(0,0,0,.12))"}}>
                        <rect x={4} y={4} width={112} height={60} rx={10} fill="#ecc42a" stroke="#111" strokeWidth={3}/>
                        <rect x={-4} y={22} width={9} height={22} rx={3} fill="#111"/>
                        <rect x={112} y={22} width={9} height={22} rx={3} fill="#111"/>
                        <text x={60} y={44} textAnchor="middle" fontSize={36} fontWeight={900}
                          fill="#7a4400" fontFamily="Georgia,serif">{tabTotal}</text>
                      </svg>
                    </div>
                    {/* Okunuş — tablet temasıyla uyumlu SVG kart */}
                    {tabTotal > 0 && (()=>{
                      const okuText = readNum(tabTotal);
                      /* Uzun metinler için font boyutunu küçült */
                      const fs = okuText.length > 18 ? 9 : okuText.length > 12 ? 10 : 11;
                      const cardW = 170;
                      return (
                        <div style={{display:"flex",justifyContent:"center",marginTop:4,paddingBottom:2}}>
                          <svg width={cardW} height={38} viewBox={`0 0 ${cardW} 38`}
                            aria-label={`Okunuş: ${okuText}`}
                            style={{filter:"drop-shadow(0 2px 5px rgba(0,0,0,.10))"}}>
                            <defs>
                              <linearGradient id="okuGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#fae574"/>
                                <stop offset="100%" stopColor="#ddb520"/>
                              </linearGradient>
                            </defs>
                            {/* Kart gövdesi */}
                            <rect x={2} y={2} width={cardW-4} height={34} rx={8}
                              fill="url(#okuGrad)" stroke="#a07810" strokeWidth={2}/>
                            {/* Sol kulp */}
                            <rect x={-3} y={11} width={8} height={16} rx={3} fill="#111"/>
                            {/* Sağ kulp */}
                            <rect x={cardW-5} y={11} width={8} height={16} rx={3} fill="#111"/>
                            {/* İç çerçeve */}
                            <rect x={6} y={6} width={cardW-12} height={26} rx={5}
                              fill="rgba(255,255,255,.18)" stroke="rgba(255,200,50,.35)" strokeWidth={.8}/>
                            {/* Okunuş metni */}
                            <text x={cardW/2} y={23}
                              textAnchor="middle" dominantBaseline="middle"
                              fontSize={fs} fontWeight={800} fontStyle="italic"
                              fill="#5a3200" fontFamily="Georgia,serif"
                              letterSpacing={.3}>
                              {okuText}
                            </text>
                          </svg>
                        </div>
                      );
                    })()}
                  </div>
                );
              })()}

              {/* ── Bloklar ── */}
              {items.map(it=>renderBlock(it))}

            </div>{/* zoom end */}

            {/* Silme Alanı */}
            <div role="region" aria-label="Silme alanı. Bloğu buraya sürükleyin"
              style={{position:"absolute",bottom:0,left:0,right:0,height:38,display:"flex",
                alignItems:"center",justifyContent:"center",gap:6,
                background:overTrash?"rgba(239,68,68,.12)":itemDrag?"rgba(0,0,0,.02)":"transparent",
                borderTop:overTrash?"2px solid rgba(239,68,68,.4)":"1px solid rgba(0,0,0,.04)",
                zIndex:20,transition:"all .2s"}}>
              <span aria-hidden style={{fontSize:overTrash?16:12,transition:"font-size .2s"}}>{overTrash?"🗑️":"🗑"}</span>
              <span style={{fontSize:9,fontWeight:700,color:overTrash?"#ef4444":itemDrag?"#bbb":"#ddd"}}>
                {overTrash?"Bırak → Sil":itemDrag?"Buraya sürükle":"Silme Alanı"}
              </span>
            </div>

            {/* Boş Durum */}
            {items.length===0&&!showMat&&!showTablet&&!showDecomp&&strokes.length===0&&(
              <div aria-hidden style={{position:"absolute",top:"40%",left:"50%",transform:"translate(-50%,-50%)",
                textAlign:"center",pointerEvents:"none",animation:"fadeIn .8s"}}>
                <div style={{fontSize:14,fontWeight:800,color:"rgba(60,50,30,.14)",marginBottom:4}}>
                  Blokları sürükleyerek basamak değerini keşfet!
                </div>
                <div style={{fontSize:11,fontWeight:600,color:"rgba(60,50,30,.08)"}}>← Sol panelden blokları kanvasa sürükle</div>
                <div style={{fontSize:10,fontWeight:600,color:"rgba(60,50,30,.06)",marginTop:4}}>Q=Birlik  W=Onluk  E=Yüzlük  R=Binlik</div>
              </div>
            )}

            {/* Drop Uyarısı */}
            {dragFromSidebar&&dropHighlight&&(
              <div aria-hidden style={{position:"absolute",inset:0,zIndex:0,
                border:"3px dashed rgba(245,158,11,.45)",borderRadius:4,pointerEvents:"none"}}>
                <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",
                  background:PALETTE.accentL,padding:"8px 20px",borderRadius:12}}>
                  <span style={{fontSize:13,fontWeight:800,color:"rgba(245,158,11,.7)"}}>📥 Buraya bırak</span>
                </div>
              </div>
            )}

            {/* Sürükleme Hayaleti */}
            {dragFromSidebar&&<div aria-hidden style={{position:"fixed",left:dragPos.x-16,top:dragPos.y-16,
              zIndex:9999,pointerEvents:"none",opacity:.9,filter:"drop-shadow(0 6px 12px rgba(60,50,30,.2))",animation:"blockIn .15s"}}>
              <BlockSVG type={dragFromSidebar.t} size={0.45} colorBlind={colorBlind}/>
            </div>}

            {/* Sağ alt imza */}
            <div aria-hidden style={{position:"absolute",bottom:44,right:12,fontSize:9,fontWeight:700,
              color:"rgba(60,50,30,.06)",pointerEvents:"none"}}>Prof. Dr. Yılmaz Mutlu</div>

          </div>{/* kanvas end */}
        </main>
      </div>

      {/* Alt Bar — tüm araçlar */}
      <div style={{height:46,minHeight:46,background:`linear-gradient(180deg,${PALETTE.side},#ede5d0)`,
        borderTop:"1px solid rgba(60,50,30,.07)",display:"flex",alignItems:"center",
        padding:"0 10px",gap:4}}>

        {/* Arkaplan */}
        <div role="group" aria-label="Arkaplan" style={{display:"flex",gap:1,background:"rgba(255,255,255,.55)",borderRadius:7,padding:2}}>
          {[["▫","plain","Düz"],["▦","grid","Kareli"],["⋯","dot","Noktalı"]].map(([ic,tp,lbl])=>(
            <button key={tp} onClick={()=>setBgType(tp)} aria-label={lbl} aria-pressed={bgType===tp}
              style={{width:26,height:26,borderRadius:5,border:"none",
                background:bgType===tp?PALETTE.accent:"transparent",cursor:"pointer",fontSize:11,
                color:bgType===tp?"#fff":"#aaa",display:"flex",alignItems:"center",justifyContent:"center"}}>{ic}</button>
          ))}
        </div>

        <div aria-hidden style={{width:1,height:18,background:"rgba(60,50,30,.08)"}}/>

        {/* Zoom */}
        <div role="group" aria-label="Zoom" style={{display:"flex",gap:1,alignItems:"center",
          background:"rgba(255,255,255,.55)",borderRadius:7,padding:"2px 4px"}}>
          <button onClick={()=>setZoom(z=>Math.max(.5,+(z-.1).toFixed(1)))} aria-label="Uzaklaştır"
            style={{width:22,height:22,border:"none",background:"transparent",cursor:"pointer",fontSize:13,fontWeight:900,color:"#888"}}>−</button>
          <span aria-live="polite" style={{fontSize:10,fontWeight:700,color:PALETTE.accentD,minWidth:32,textAlign:"center"}}>{Math.round(zoom*100)}%</span>
          <button onClick={()=>setZoom(z=>Math.min(2,+(z+.1).toFixed(1)))} aria-label="Yakınlaştır"
            style={{width:22,height:22,border:"none",background:"transparent",cursor:"pointer",fontSize:13,fontWeight:900,color:"#888"}}>+</button>
        </div>

        {/* Tam Ekran */}
        <button onClick={toggleFullscreen} aria-label={isFullscreen?"Tam ekrandan çık":"Tam ekran"}
          style={{width:28,height:28,borderRadius:7,border:"none",cursor:"pointer",fontSize:13,
            background:isFullscreen?PALETTE.accentL:"rgba(255,255,255,.55)",
            color:isFullscreen?PALETTE.accentD:"#888",
            display:"flex",alignItems:"center",justifyContent:"center"}}>
          {isFullscreen?"⊡":"⊞"}
        </button>

        <div aria-hidden style={{width:1,height:18,background:"rgba(60,50,30,.08)"}}/>

        {/* Ses komutu */}
        {SPEECH_SUPPORTED&&(
          <button onClick={toggleVoice} aria-label={voiceActive?"Sesi durdur":"Ses komutu"} aria-pressed={voiceActive}
            style={{width:28,height:28,borderRadius:7,border:"none",cursor:"pointer",fontSize:14,
              background:voiceActive?"rgba(239,68,68,.12)":"rgba(255,255,255,.55)",
              color:voiceActive?"#ef4444":"#888",
              display:"flex",alignItems:"center",justifyContent:"center",
              animation:voiceActive?"micPulse 1.5s infinite":"none"}}>
            {voiceActive?"🔴":"🎙️"}
          </button>
        )}
        <button onClick={()=>setShowVoicePanel(p=>!p)} aria-label="Ses komutları paneli"
          style={{width:28,height:28,borderRadius:7,border:"none",cursor:"pointer",fontSize:12,
            background:showVoicePanel?PALETTE.accentL:"rgba(255,255,255,.55)",
            color:showVoicePanel?PALETTE.accentD:"#888",
            display:"flex",alignItems:"center",justifyContent:"center"}}>🗣</button>

        <div aria-hidden style={{width:1,height:18,background:"rgba(60,50,30,.08)"}}/>

        {/* Kayıt */}
        <button onClick={()=>setShowRecPanel(p=>!p)} aria-label="Kayıt araçları" title="Kayıt"
          style={{width:28,height:28,borderRadius:7,border:"none",cursor:"pointer",fontSize:13,
            background:recording?"rgba(239,68,68,.12)":showRecPanel?PALETTE.accentL:"rgba(255,255,255,.55)",
            color:recording?"#ef4444":showRecPanel?PALETTE.accentD:"#888",
            display:"flex",alignItems:"center",justifyContent:"center",
            animation:recording?"micPulse 1.5s infinite":"none"}}>
          {recording?"⏹":"⏺"}
        </button>

        {/* AR */}
        <button onClick={()=>arMode?stopAR():startAR()} aria-label={arMode?"AR kapat":"AR"}
          style={{width:28,height:28,borderRadius:7,border:"none",cursor:"pointer",fontSize:13,
            background:arMode?"rgba(34,197,94,.12)":"rgba(255,255,255,.55)",
            color:arMode?"#16a34a":"#888",
            display:"flex",alignItems:"center",justifyContent:"center"}}>📷</button>

        <div aria-hidden style={{width:1,height:18,background:"rgba(60,50,30,.08)"}}/>

        {/* Rapor */}
        <button onClick={()=>setShowTeacher(true)} aria-label="Öğretmen raporu" title="Rapor"
          style={{width:28,height:28,borderRadius:7,border:"none",cursor:"pointer",fontSize:13,
            background:"rgba(255,255,255,.55)",color:"#888",
            display:"flex",alignItems:"center",justifyContent:"center"}}>📊</button>

        {/* Yardım */}
        <button onClick={()=>setShowHelp(true)} aria-label="Yardım"
          style={{width:28,height:28,borderRadius:7,border:"none",cursor:"pointer",fontSize:12,
            background:"rgba(255,255,255,.55)",color:"#888",fontWeight:700,
            display:"flex",alignItems:"center",justifyContent:"center"}}>?</button>

        {/* Hakkında */}
        <button onClick={()=>setShowAbout(true)} aria-label="Hakkında"
          style={{width:28,height:28,borderRadius:7,border:"none",cursor:"pointer",fontSize:12,
            background:"rgba(255,255,255,.55)",color:"#888",
            display:"flex",alignItems:"center",justifyContent:"center"}}>ℹ</button>

        <div style={{flex:1}}/>

        {/* Sayfa Navigasyonu */}
        {(()=>{
          const curIdx=pages.findIndex(p=>p.id===currentPageId);
          const prevPg=pages[curIdx-1]; const nextPg=pages[curIdx+1];
          return (
            <div role="group" aria-label="Sayfa navigasyonu"
              style={{display:"flex",alignItems:"center",gap:2,
                background:"rgba(255,255,255,.6)",borderRadius:8,padding:"2px",
                border:"1px solid rgba(60,50,30,.06)",boxShadow:"0 1px 3px rgba(60,50,30,.06)"}}>
              <button onClick={()=>prevPg&&dispatch({type:"SWITCH_PAGE",pid:prevPg.id})}
                disabled={!prevPg} aria-label="Önceki sayfa"
                style={{width:26,height:26,borderRadius:7,border:"none",cursor:prevPg?"pointer":"default",
                  background:"transparent",fontSize:14,color:prevPg?"#888":"#ddd",
                  display:"flex",alignItems:"center",justifyContent:"center"}}>‹</button>
              <div aria-live="polite"
                style={{minWidth:44,textAlign:"center",fontSize:11,fontWeight:800,color:PALETTE.accentD,
                  padding:"2px 4px",background:PALETTE.accentL,borderRadius:5}}>
                {curIdx+1} / {pages.length}
              </div>
              <button onClick={()=>nextPg&&dispatch({type:"SWITCH_PAGE",pid:nextPg.id})}
                disabled={!nextPg} aria-label="Sonraki sayfa"
                style={{width:26,height:26,borderRadius:7,border:"none",cursor:nextPg?"pointer":"default",
                  background:"transparent",fontSize:14,color:nextPg?"#888":"#ddd",
                  display:"flex",alignItems:"center",justifyContent:"center"}}>›</button>
              <div aria-hidden style={{width:1,height:16,background:"rgba(60,50,30,.08)"}}/>
              <button onClick={()=>pages.length>1&&dispatch({type:"DELETE_PAGE",pid:currentPageId})}
                disabled={pages.length<=1} aria-label="Bu sayfayı sil"
                style={{width:26,height:26,borderRadius:7,border:"none",
                  cursor:pages.length>1?"pointer":"default",background:"transparent",fontSize:12,
                  color:pages.length>1?"#e06060":"#ddd",
                  display:"flex",alignItems:"center",justifyContent:"center"}}>×</button>
              <button onClick={()=>dispatch({type:"ADD_PAGE",id:Math.max(...pages.map(p=>p.id))+1})}
                aria-label="Yeni sayfa ekle"
                style={{width:26,height:26,borderRadius:7,border:"none",cursor:"pointer",
                  background:"transparent",fontSize:15,fontWeight:700,color:"#aaa",
                  display:"flex",alignItems:"center",justifyContent:"center"}}>+</button>
            </div>
          );
        })()}
      </div>
      {/* ══ AR KAMERA OVERLAY ══ */}
      {arMode && (
        <div style={{position:"fixed",inset:0,zIndex:8000,pointerEvents:"none"}}>
          {/* Kamera arka plan */}
          <video ref={arVideoRef} autoPlay playsInline muted
            style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",opacity:.55}}/>
          {/* Blokları kamera üzerinde göster */}
          <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
            <div style={{background:"rgba(0,0,0,.15)",borderRadius:16,padding:16,
              border:"1.5px solid rgba(255,255,255,.25)",backdropFilter:"blur(2px)"}}>
              {/* Kanvastaki blokları özetle */}
              <div style={{display:"flex",gap:8,alignItems:"flex-end",justifyContent:"center",flexWrap:"wrap",maxWidth:500}}>
                {counts.ths>0&&Array.from({length:Math.min(counts.ths,4)},(_,i)=>(
                  <div key={i} style={{filter:"drop-shadow(0 4px 12px rgba(0,0,0,.4))"}}>
                    <BlockSVG type="ths" size={0.7} colorBlind={colorBlind}/>
                  </div>
                ))}
                {counts.huns>0&&Array.from({length:Math.min(counts.huns,6)},(_,i)=>(
                  <div key={i} style={{filter:"drop-shadow(0 4px 12px rgba(0,0,0,.4))"}}>
                    <BlockSVG type="huns" size={0.55} colorBlind={colorBlind}/>
                  </div>
                ))}
                {counts.tens>0&&Array.from({length:Math.min(counts.tens,9)},(_,i)=>(
                  <div key={i} style={{filter:"drop-shadow(0 3px 8px rgba(0,0,0,.4))"}}>
                    <BlockSVG type="tens" size={0.5} colorBlind={colorBlind}/>
                  </div>
                ))}
                {counts.ones>0&&Array.from({length:Math.min(counts.ones,10)},(_,i)=>(
                  <div key={i} style={{filter:"drop-shadow(0 2px 6px rgba(0,0,0,.4))"}}>
                    <BlockSVG type="ones" size={1.8} colorBlind={colorBlind}/>
                  </div>
                ))}
                {totalValue===0&&(
                  <div style={{color:"rgba(255,255,255,.6)",fontSize:13,fontWeight:700,padding:8}}>
                    Blok ekle → AR'da görünsün
                  </div>
                )}
              </div>
              {totalValue>0&&(
                <div style={{textAlign:"center",marginTop:10,fontSize:22,fontWeight:900,
                  color:"#fff",textShadow:"0 2px 8px rgba(0,0,0,.6)"}}>
                  {totalValue} <span style={{fontSize:13,opacity:.8,fontStyle:"italic"}}>{okunus}</span>
                </div>
              )}
            </div>
          </div>
          {/* AR Kapat butonu — pointerEvents aktif */}
          <button onClick={stopAR} pointerEvents="all"
            style={{position:"absolute",top:16,right:16,padding:"8px 16px",borderRadius:10,
              border:"2px solid rgba(255,255,255,.4)",background:"rgba(0,0,0,.5)",
              color:"#fff",fontSize:13,fontWeight:800,cursor:"pointer",pointerEvents:"all",
              backdropFilter:"blur(8px)"}}>
            ✕ AR Kapat
          </button>
          {/* AR rozeti */}
          <div style={{position:"absolute",top:16,left:16,padding:"4px 10px",borderRadius:8,
            background:"rgba(34,197,94,.3)",border:"1px solid rgba(34,197,94,.5)",
            color:"#86efac",fontSize:11,fontWeight:800,backdropFilter:"blur(8px)"}}>
            ● AR AKTİF
          </div>
        </div>
      )}

      {/* ══ AR HATA MESAJI ══ */}
      {arError && (
        <div role="alert" style={{position:"fixed",bottom:70,left:"50%",transform:"translateX(-50%)",
          zIndex:8001,background:"rgba(220,38,38,.9)",borderRadius:12,padding:"10px 20px",
          color:"#fff",fontSize:13,fontWeight:700,boxShadow:"0 4px 20px rgba(0,0,0,.3)",
          display:"flex",gap:10,alignItems:"center"}}>
          ⚠ {arError}
          <button onClick={()=>setArError("")}
            style={{background:"none",border:"none",color:"#fff",cursor:"pointer",fontSize:16}}>×</button>
        </div>
      )}

      {/* ══ KAYIT PANELİ ══ */}
      {showRecPanel && (
        <div style={{position:"fixed",right:12,top:60,zIndex:9000,
          background:"rgba(255,253,247,.97)",backdropFilter:"blur(20px)",
          borderRadius:16,border:"1.5px solid rgba(60,50,30,.08)",
          boxShadow:"0 8px 40px rgba(0,0,0,.15)",width:260,
          animation:"slideDown .25s"}}>
          {/* Başlık */}
          <div style={{padding:"10px 14px",borderBottom:"1px solid rgba(60,50,30,.06)",
            display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div style={{fontSize:13,fontWeight:900,color:PALETTE.text}}>⏺ Kayıt Araçları</div>
            <button onClick={()=>setShowRecPanel(false)}
              style={{background:"none",border:"none",cursor:"pointer",fontSize:16,color:"#ccc"}}>×</button>
          </div>

          <div style={{padding:"12px 14px",display:"flex",flexDirection:"column",gap:8}}>
            {/* Ekran Kaydı */}
            <div>
              <div style={{fontSize:10,fontWeight:700,color:"#b5a990",marginBottom:6,textTransform:"uppercase",letterSpacing:1}}>Ekran Kaydı</div>
              {!recording ? (
                <button onClick={startScreenRecord}
                  style={{width:"100%",padding:"10px",borderRadius:10,border:"none",
                    background:"linear-gradient(135deg,#ef4444,#b91c1c)",
                    color:"#fff",fontSize:13,fontWeight:800,cursor:"pointer",fontFamily:"inherit",
                    display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
                  ⏺ Kaydı Başlat
                </button>
              ) : (
                <div style={{display:"flex",gap:6}}>
                  <div style={{flex:1,padding:"10px",borderRadius:10,
                    background:"rgba(239,68,68,.08)",border:"1.5px solid rgba(239,68,68,.25)",
                    fontSize:12,fontWeight:700,color:"#dc2626",textAlign:"center",
                    animation:"micPulse 1.5s infinite"}}>
                    ⏺ {Math.floor(recSeconds/60).toString().padStart(2,"0")}:{(recSeconds%60).toString().padStart(2,"0")}
                  </div>
                  <button onClick={stopScreenRecord}
                    style={{padding:"10px 14px",borderRadius:10,border:"none",
                      background:"#ef4444",color:"#fff",fontSize:12,fontWeight:800,cursor:"pointer",fontFamily:"inherit"}}>
                    ⏹ Durdur
                  </button>
                </div>
              )}
            </div>

            {/* Anlık Görüntü */}
            <div>
              <div style={{fontSize:10,fontWeight:700,color:"#b5a990",marginBottom:6,textTransform:"uppercase",letterSpacing:1}}>Anlık Görüntü</div>
              <button onClick={takeSnapshot}
                style={{width:"100%",padding:"10px",borderRadius:10,border:"none",
                  background:`linear-gradient(135deg,${PALETTE.huns},${PALETTE.hunsB})`,
                  color:"#fff",fontSize:13,fontWeight:800,cursor:"pointer",fontFamily:"inherit"}}>
                📸 PNG İndir
              </button>
            </div>

            {/* Oturum Kaydı */}
            <div>
              <div style={{fontSize:10,fontWeight:700,color:"#b5a990",marginBottom:6,textTransform:"uppercase",letterSpacing:1}}>Oturum Verisi</div>
              <button onClick={exportSession}
                style={{width:"100%",padding:"10px",borderRadius:10,border:"none",
                  background:`linear-gradient(135deg,${PALETTE.ths},${PALETTE.thsB})`,
                  color:"#fff",fontSize:13,fontWeight:800,cursor:"pointer",fontFamily:"inherit"}}>
                💾 JSON Dışa Aktar
              </button>
            </div>

            <div style={{fontSize:10,color:"#d4c8b0",lineHeight:1.5,marginTop:4}}>
              Ekran kaydı tarayıcının izin diyaloğunu açar. PNG yalnızca çizim katmanını yakalar.
            </div>
          </div>
        </div>
      )}

      {/* ══ MODALler ══ */}

      {/* Etkinlik Onay */}
      {pendingActivity&&(
        <ModalBackdrop onClose={()=>setPendingActivity(null)}>
          <div style={{textAlign:"center"}}>
            <div style={{fontSize:40,marginBottom:8}} aria-hidden>{pendingActivity.i}</div>
            <div role="heading" aria-level={2} style={{fontSize:18,fontWeight:900,marginBottom:6}}>{pendingActivity.n}</div>
            <div style={{fontSize:13,marginBottom:8,color:"#555",lineHeight:1.6}}>{pendingActivity.d}</div>
            <div style={{fontSize:11,marginBottom:16,color:"#b5a990"}}>
              {t("difficulty")} {pendingActivity.diff===1?t("easy"):pendingActivity.diff===2?t("medium"):t("hard")}
            </div>
            <button onClick={()=>{runSetup(pendingActivity);setPendingActivity(null);}}
              style={{padding:"10px 28px",borderRadius:10,border:"none",
                background:`linear-gradient(135deg,${PALETTE.accent},${PALETTE.accentD})`,
                color:"#fff",fontSize:14,fontWeight:800,cursor:"pointer",width:"100%"}}>Başla ▸</button>
          </div>
        </ModalBackdrop>
      )}

      {/* Yardım */}
      {showHelp&&(
        <ModalBackdrop onClose={()=>setShowHelp(false)}>
          <div role="heading" aria-level={2} style={{fontSize:18,fontWeight:900,color:PALETTE.text,marginBottom:12}}>📖 Kullanım Kılavuzu</div>
          <div style={{display:"grid",gridTemplateColumns:"auto 1fr",gap:"8px 12px",fontSize:12,lineHeight:1.6,color:"#555",marginBottom:12}}>
            <strong>Q W E R</strong><div>Birlik / Onluk / Yüzlük / Binlik ekle</div>
            <strong>G</strong><div>Seçili bloğu grupla (10→1 üst birim)</div>
            <strong>B</strong><div>Seçili bloğu çöz (1→10 alt birim)</div>
            <strong>S</strong><div>Toplam değeri seslendir</div>
            <strong>Del/Bksp</strong><div>Seçili bloğu sil</div>
            <strong>Ctrl+Z/Y</strong><div>Blok geri / ileri al</div>
            <strong>Sürükle</strong><div>Sol panelden kanvasa blok ekle</div>
            <strong>📊</strong><div>Basamak tablosu — otomatik sayım ve okunuş</div>
            <strong>📏</strong><div>Sayı doğrusu — değerle eşzamanlı güncellenir</div>
            <strong>🟦</strong><div>10'luk çerçeve — gruplama kavramı için</div>
            <strong>⚙️</strong><div>Renk körü modu, yüksek kontrast, font ayarları</div>
          </div>
          <button onClick={()=>setShowHelp(false)}
            style={{width:"100%",padding:"10px",borderRadius:10,border:"none",
              background:PALETTE.accent,color:"#fff",fontSize:13,fontWeight:800,cursor:"pointer"}}>Anladım ✓</button>
        </ModalBackdrop>
      )}

      {/* Öğretmen Raporu */}
      {showTeacher&&(
        <ModalBackdrop onClose={()=>setShowTeacher(false)}>
          <div role="heading" aria-level={2} style={{fontSize:18,fontWeight:900,marginBottom:12}}>{t("reportTitle")}</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:8,marginBottom:12}}>
            {[
              {label:t("totalQ"),val:recentQuiz.length,color:PALETTE.huns},
              {label:t("correctQ"),val:correctCount,color:"#22c55e"},
              {label:t("wrongQ"),val:wrongCount,color:"#ef4444"},
              {label:t("sessionMin"),val:Math.floor((Date.now()-sessionStart)/60000),color:PALETTE.accent},
            ].map(m=>(
              <div key={m.label} style={{background:"rgba(0,0,0,.03)",borderRadius:10,padding:"10px",textAlign:"center"}}>
                <div style={{fontSize:22,fontWeight:900,color:m.color}}>{m.val}</div>
                <div style={{fontSize:10,color:"#b5a990",marginTop:2}}>{m.label}</div>
              </div>
            ))}
          </div>
          {bloomStats.length>0&&(
            <>
              <div style={{fontSize:11,fontWeight:800,color:"#b5a990",marginBottom:8,textTransform:"uppercase",letterSpacing:1}}>Bloom Taksonomisi Performansı</div>
              {bloomStats.map(b=>(
                <div key={b.level} style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                  <div style={{fontSize:11,fontWeight:700,color:"#888",width:80}}>{b.label}</div>
                  <div style={{flex:1,height:16,background:"rgba(0,0,0,.06)",borderRadius:8,overflow:"hidden"}}>
                    <div style={{height:"100%",width:`${b.total>0?Math.round(b.correct/b.total*100):0}%`,
                      background:b.correct/b.total>=.7?"#22c55e":b.correct/b.total>=.4?"#f59e0b":"#ef4444",
                      borderRadius:8,transition:"width .5s"}}/>
                  </div>
                  <div style={{fontSize:11,fontWeight:700,color:"#888",width:40,textAlign:"right"}}>{b.correct}/{b.total}</div>
                </div>
              ))}
            </>
          )}
          {recentQuiz.length===0&&(
            <div style={{textAlign:"center",color:"#b5a990",fontSize:12,padding:"20px 0"}}>
              Henüz quiz verisi yok. Oyunlar sekmesinden quiz başlatın.
            </div>
          )}
          <div style={{display:"flex",gap:8,marginTop:12}}>
            <button onClick={()=>{ const d=JSON.stringify(progress,null,2); const b=new Blob([d],{type:"application/json"}); const u=URL.createObjectURL(b); const a=document.createElement("a"); a.href=u; a.download="dokun_say_rapor.json"; a.click(); }}
              style={{flex:1,padding:"10px",borderRadius:10,border:"1.5px solid "+PALETTE.sideB,background:"#fff",
                cursor:"pointer",fontSize:12,fontWeight:700,color:PALETTE.text,fontFamily:"inherit"}}>⬇ JSON İndir</button>
            <button onClick={()=>{if(confirm("Tüm ilerleme verileri silinecek. Emin misiniz?")){const np={sessions:[],quizHistory:[],totalTime:0};setProgress(np);saveProgress(np);}}}
              style={{flex:1,padding:"10px",borderRadius:10,border:"1.5px solid rgba(239,68,68,.3)",background:"rgba(239,68,68,.05)",
                cursor:"pointer",fontSize:12,fontWeight:700,color:"#b91c1c",fontFamily:"inherit"}}>🗑 Sıfırla</button>
          </div>
          <button onClick={()=>setShowTeacher(false)}
            style={{width:"100%",marginTop:8,padding:"10px",borderRadius:10,border:"none",
              background:PALETTE.accent,color:"#fff",fontSize:13,fontWeight:800,cursor:"pointer"}}>Kapat</button>
        </ModalBackdrop>
      )}

      {/* Hakkında */}
      {showAbout&&(
        <ModalBackdrop onClose={()=>setShowAbout(false)}>
          <div style={{textAlign:"center"}}>
            <span aria-hidden style={{fontSize:48}}>📐</span>
            <div role="heading" aria-level={2} style={{fontSize:22,fontWeight:900,marginTop:8,color:PALETTE.text}}>DokunSay</div>
            <div style={{fontSize:14,fontWeight:700,color:PALETTE.accent,marginBottom:14}}>Basamak Değeri v3.0</div>
            <div style={{fontSize:12,color:"#777",lineHeight:1.8,textAlign:"left",marginBottom:12}}>
              Orantılı onluk bloklar ile basamak değeri kavramını somut olarak keşfedin. Gruplama, çözme, genişletilmiş gösterim ve Türkçe okunuş desteği.
            </div>
            <div style={{display:"flex",flexWrap:"wrap",gap:4,justifyContent:"center",marginBottom:14}}>
              {["Orantılı Bloklar","Grupla/Çöz","Basamak Tablosu","Sayı Doğrusu","10'luk Çerçeve",
                "Çözümleme Diyagramı","Türkçe TTS","Renk Körü Modu","Klavye Erişimi","Öğretmen Raporu",
                "Bloom Taksonomisi","Adaptif Quiz","Yüksek Kontrast","Çizim Araçları","Sayfa Sistemi"]
                .map(f=>(
                  <span key={f} style={{padding:"3px 8px",borderRadius:6,background:PALETTE.accentL,fontSize:10,fontWeight:700,color:PALETTE.accentD}}>{f}</span>
                ))}
            </div>
            <div style={{fontSize:11,color:"#b5a990",marginBottom:2}}>Prof. Dr. Yılmaz Mutlu</div>
            <div style={{fontSize:10,color:"#ccc"}}>v3.0 — Nisan 2026 • WCAG 2.1 AA Uyumlu</div>
            <button onClick={()=>setShowAbout(false)}
              style={{marginTop:14,width:"100%",padding:"10px",borderRadius:10,border:"none",
                background:PALETTE.accent,color:"#fff",fontSize:13,fontWeight:800,cursor:"pointer"}}>Kapat</button>
          </div>
        </ModalBackdrop>
      )}
      {/* ══ SES KOMUTU OVERLAY — Aktif dinleme göstergesi ══ */}
      {voiceActive && (
        <div aria-live="assertive" style={{
          position:"fixed",bottom:60,left:"50%",transform:"translateX(-50%)",
          zIndex:9998,background:"rgba(15,10,5,.92)",backdropFilter:"blur(16px)",
          borderRadius:20,padding:"14px 24px",minWidth:320,maxWidth:520,
          border:"2px solid rgba(239,68,68,.5)",boxShadow:"0 8px 32px rgba(0,0,0,.4)",
          display:"flex",flexDirection:"column",alignItems:"center",gap:8,
          animation:"slideDown .3s"
        }}>
          {/* Ses dalgası animasyonu */}
          <div style={{display:"flex",alignItems:"flex-end",gap:3,height:24}}>
            {[0.4,0.7,1,0.8,0.5,0.9,0.6,1,0.7,0.4].map((h,i)=>(
              <div key={i} style={{
                width:4,borderRadius:2,
                background:"#ef4444",
                height:24*h,
                animation:`wavebar 0.8s ease-in-out infinite`,
                animationDelay:`${i*0.08}s`,
                opacity:0.8
              }}/>
            ))}
          </div>
          <div style={{fontSize:12,fontWeight:700,color:"rgba(255,255,255,.5)",letterSpacing:.5}}>
            SES KOMUTU DİNLENİYOR…
          </div>
          {voiceTranscript && (
            <div style={{fontSize:15,fontWeight:800,color:"#fff",textAlign:"center",
              borderTop:"1px solid rgba(255,255,255,.1)",paddingTop:8,width:"100%"}}>
              "{voiceTranscript}"
            </div>
          )}
          <button onClick={stopVoice} aria-label="Dinlemeyi durdur"
            style={{padding:"6px 20px",borderRadius:10,border:"none",
              background:"rgba(239,68,68,.3)",color:"#fca5a5",fontSize:12,fontWeight:700,
              cursor:"pointer",marginTop:2}}>■ Durdur</button>
        </div>
      )}

      {/* ══ SES HATA MESAJI ══ */}
      {voiceError && (
        <div role="alert" style={{
          position:"fixed",bottom:60,left:"50%",transform:"translateX(-50%)",
          zIndex:9998,background:"rgba(220,38,38,.9)",borderRadius:14,padding:"10px 20px",
          color:"#fff",fontSize:13,fontWeight:700,boxShadow:"0 4px 20px rgba(0,0,0,.3)",
          display:"flex",gap:10,alignItems:"center"
        }}>
          ⚠ {voiceError}
          <button onClick={()=>setVoiceError("")}
            style={{background:"none",border:"none",color:"#fff",cursor:"pointer",fontSize:16,padding:"0 4px"}}>×</button>
        </div>
      )}

      {/* ══ SES KOMUTU PANELİ ══ */}
      {showVoicePanel && (
        <div style={{
          position:"fixed",right:12,top:60,zIndex:9997,
          background:"rgba(255,253,247,.97)",backdropFilter:"blur(20px)",
          borderRadius:16,border:"1.5px solid rgba(60,50,30,.08)",
          boxShadow:"0 8px 40px rgba(0,0,0,.15)",
          width:320,maxHeight:"calc(100vh - 80px)",
          display:"flex",flexDirection:"column",
          animation:"slideDown .25s"
        }}>
          {/* Panel başlık */}
          <div style={{padding:"12px 16px",borderBottom:"1px solid rgba(60,50,30,.06)",
            display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div>
              <div style={{fontSize:14,fontWeight:900,color:PALETTE.text}}>🎙️ Ses Komutları</div>
              <div style={{fontSize:10,color:"#b5a990",marginTop:2}}>Türkçe — tr-TR</div>
            </div>
            <button onClick={()=>setShowVoicePanel(false)} aria-label="Kapat"
              style={{background:"none",border:"none",cursor:"pointer",fontSize:18,color:"#ccc",lineHeight:1}}>×</button>
          </div>

          {/* Mod & başlatma */}
          <div style={{padding:"10px 16px",borderBottom:"1px solid rgba(60,50,30,.06)"}}>
            <div style={{display:"flex",gap:6,marginBottom:10}}>
              {["push","continuous"].map(m=>(
                <button key={m} onClick={()=>setVoiceMode(m)} aria-pressed={voiceMode===m}
                  style={{flex:1,padding:"6px 0",borderRadius:8,
                    border:`1.5px solid ${voiceMode===m?PALETTE.accent:"rgba(60,50,30,.1)"}`,
                    background:voiceMode===m?PALETTE.accentL:"#fff",cursor:"pointer",
                    fontSize:11,fontWeight:700,
                    color:voiceMode===m?PALETTE.accentD:"#b5a990",fontFamily:"inherit"}}>
                  {m==="push"?t("voiceMode1"):t("voiceMode2")}
                </button>
              ))}
            </div>
            {SPEECH_SUPPORTED ? (
              <button onClick={toggleVoice}
                aria-pressed={voiceActive}
                style={{width:"100%",padding:"10px",borderRadius:10,border:"none",
                  background:voiceActive
                    ?"linear-gradient(135deg,#dc2626,#b91c1c)"
                    :`linear-gradient(135deg,${PALETTE.accent},${PALETTE.accentD})`,
                  color:"#fff",fontSize:13,fontWeight:900,cursor:"pointer",fontFamily:"inherit",
                  animation:voiceActive?"micPulse 1.5s infinite":"none",
                  display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
                {voiceActive ? <>{t("voiceStop")} <span style={{fontSize:10,opacity:.7}}>(tıkla: durdur)</span></>
                             : t("voiceStart")}
              </button>
            ) : (
              <div style={{padding:"10px",borderRadius:10,background:"rgba(239,68,68,.06)",
                border:"1px solid rgba(239,68,68,.2)",fontSize:12,color:"#b91c1c",textAlign:"center"}}>
                ⚠ Ses tanıma bu tarayıcıda desteklenmiyor.<br/>
                <span style={{fontSize:10,color:"#b5a990"}}>Chrome veya Edge kullanın.</span>
              </div>
            )}
          </div>

          {/* Komut referans listesi */}
          <div style={{flex:1,overflowY:"auto",padding:"10px 16px",scrollbarWidth:"thin"}}>
            <div style={{fontSize:10,fontWeight:800,textTransform:"uppercase",letterSpacing:1.5,
              color:"#b5a990",marginBottom:8}}>Kullanılabilir Komutlar</div>

            {[
              {cat:"Blok Ekleme", icon:"📦", cmds:[
                '"birlik ekle"','"iki onluk ekle"','"üç yüzlük ekle"','"beş binlik ekle"'
              ]},
              {cat:"Sayı Gösterme", icon:"🔢", cmds:[
                '"iki yüz kırk beşi göster"','"yüz elli üçü göster"','"bin iki yüz göster"'
              ]},
              {cat:"Gruplama & Çözme", icon:"🔗", cmds:[
                '"grupla"','"birlik grupla"','"onluk çöz"','"yüzlük çöz"'
              ]},
              {cat:"Oyunlar", icon:"🎮", cmds:['"quiz başlat"','"sayı oluştur"']},
              {cat:"Araçlar Göster/Gizle", icon:"👁", cmds:[
                '"basamak tablosu göster"','"sayı doğrusunu aç"',
                '"çerçeve gizle"','"değerleri göster"',
                '"tablet aç"','"çözümleme gizle"'
              ]},
              {cat:"Navigasyon", icon:"🗺", cmds:[
                '"büyüt"','"küçült"','"normal boyut"','"yeni sayfa"'
              ]},
              {cat:"Düzenleme", icon:"✏️", cmds:['"geri al"','"ileri al"','"temizle"']},
              {cat:"Bilgi & Ses", icon:"🔊", cmds:['"oku"','"toplam nedir"','"seslendir"']},
              {cat:"Erişilebilirlik", icon:"♿", cmds:[
                '"renk körü aç"','"yüksek kontrast aç"','"yüksek kontrast kapat"'
              ]},
            ].map(({cat,icon,cmds})=>(
              <div key={cat} style={{marginBottom:10}}>
                <div style={{fontSize:10,fontWeight:700,color:PALETTE.accentD,marginBottom:4}}>
                  {icon} {cat}
                </div>
                <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
                  {cmds.map(cmd=>(
                    <span key={cmd} style={{
                      padding:"2px 8px",borderRadius:6,
                      background:"rgba(245,158,11,.08)",
                      border:"1px solid rgba(245,158,11,.18)",
                      fontSize:10,fontWeight:600,color:PALETTE.accentD,
                      cursor:"pointer",fontFamily:"'Courier New',monospace"
                    }} onClick={()=>{
                      const clean = cmd.replace(/"/g,"");
                      const parsed = interpretCommand(clean);
                      executeVoiceCommand(parsed, clean);
                    }} title="Tıkla: bu komutu çalıştır">{cmd}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Geçmiş */}
          {voiceLog.length > 0 && (
            <div style={{borderTop:"1px solid rgba(60,50,30,.06)",padding:"10px 16px",maxHeight:160,overflowY:"auto"}}>
              <div style={{fontSize:10,fontWeight:800,textTransform:"uppercase",letterSpacing:1.5,
                color:"#b5a990",marginBottom:6}}>Son Komutlar</div>
              {voiceLog.slice(0,8).map((entry,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"4px 0",
                  borderBottom:"1px solid rgba(60,50,30,.04)"}}>
                  <span style={{fontSize:12}}>{entry.ok?"✅":"❌"}</span>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:11,fontWeight:600,color:PALETTE.text,
                      overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>"{entry.text}"</div>
                    <div style={{fontSize:10,color:"#b5a990"}}>{entry.label}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <style>{`
        @keyframes wavebar {
          0%,100%{transform:scaleY(0.4)}
          50%{transform:scaleY(1)}
        }
      `}</style>
    </div>
  );
}
