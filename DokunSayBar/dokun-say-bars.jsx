import { useState, useRef, useEffect } from "react";

/* ===== CONFIG ===== */
var CELL = 48, RH = 56, HR = 16, CS = 42, CP = 26;
var SNAP = 16, CSNAP = 24, TRH = 60;
var FC = 50, FP = 6, FHR = 17, MU = 17, MH = 22;

/* ===== LANG ===== */
var LANG = {
  tr: {
    rods:"Sayı Çubukları", frames:"Kartlar", dots:"Nokta Kalıpları",
    five:"Beşlik", ten:"Onluk",
    clear:"Temizle", start:"Başla",
    sel:"Seç", draw:"Çiz", write:"Yaz", erase:"Sil",
    undo:"Geri", redo:"İleri",
    labels:"Etiket", numline:"Doğru",
    cover:"Kapat", reveal:"Aç",
    note:"Nota", save:"Kaydet", load:"Yükle",
    png:"PNG İndir", print:"Yazdır",
    hint:"Soldan çubuk seçerek başlayın",
    trashY:"Bırak — Sil", trashN:"Silmek için buraya sürükle",
    nlDesc:"Sayı Doğrusu",
    textPh:"Metin yazın...",
    checkOk:"Harika! Doğru!",
    checkNo:"Henüz tam değil. Tekrar dene!",
    checkNone:"Bu etkinlikte otomatik kontrol yok.",
    speakBtn:"Yönergeyi sesli oku",
    checkBtn:"Kontrol Et",
    keşif:"Keşif", oyun:"Oyunlar", sayma:"Sayma",
    işlem:"İşlemler", tahmin:"Tahmin",
    voiceOn:"Sesli komut açık", voiceOff:"Sesli komut kapalı",
    teacherMode:"Öğretmen Modu", studentMode:"Öğrenci Modu",
    saveTpl:"Şablon Kaydet", progress:"İlerleme"
  },
  ku: {
    rods:"Çovikên Hejmaran", frames:"Çarçove", dots:"Qalibên Xalan",
    five:"Pêncan", ten:"Dehan",
    clear:"Paqij Bike", start:"Dest Pê Bike",
    sel:"Hilbijêre", draw:"Bikişîne", write:"Binivîse", erase:"Jê Bibe",
    undo:"Paş", redo:"Pêş",
    labels:"Etîket", numline:"Hêl",
    cover:"Bigire", reveal:"Veke",
    note:"Not", save:"Tomar Bike", load:"Bar Bike",
    png:"PNG Daxîne", print:"Çap Bike",
    hint:"Ji milê çepê çovikek hilbijêre",
    trashY:"Berde — Jê Bibe", trashN:"Ji bo jêbirinê bikişîne vir",
    nlDesc:"Hêla Hejmaran",
    textPh:"Li vir binivîse...",
    checkOk:"Pîroz be! Rast e!",
    checkNo:"Hê temam nebûye. Careke din biceribîne!",
    checkNone:"Di vê çalakiyê de kontrola otomatîk nîne.",
    speakBtn:"Rêwerzê bi deng bixwîne",
    checkBtn:"Kontrol Bike",
    keşif:"Keşf", oyun:"Lîstik", sayma:"Jimartin",
    işlem:"Hesab", tahmin:"Texmîn",
    voiceOn:"Fermana dengî çalak e", voiceOff:"Fermana dengî neçalak e",
    teacherMode:"Moda Mamosteyî", studentMode:"Moda Xwendekariyê",
    saveTpl:"Şablonê Tomar Bike", progress:"Pêşveçûn"
  }
};

/* ===== AUDIO ===== */
var _ac = null;
function tone(f,d,v,tp) {
  try {
    if (!_ac) _ac = new (window.AudioContext||window.webkitAudioContext)();
    var o=_ac.createOscillator(), g=_ac.createGain();
    o.connect(g); g.connect(_ac.destination); o.type=tp||"sine";
    o.frequency.setValueAtTime(f,_ac.currentTime);
    g.gain.setValueAtTime(v||0.1,_ac.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001,_ac.currentTime+d);
    o.start(_ac.currentTime); o.stop(_ac.currentTime+d);
  } catch(e){}
}
var sfx = {
  snap:function(){tone(800,.08,.12)},
  place:function(){tone(440,.06,.06)},
  flip:function(){tone(500,.12,.08,"triangle")},
  rot:function(){tone(600,.1,.08,"triangle")},
  rm:function(){tone(200,.15,.06,"sawtooth")},
  note:function(v){
    var fr=[262,294,330,349,392,440,494,523,587,659];
    tone(fr[Math.min(v,10)-1]||262,.3,.15,"triangle");
  }
};
var NW = {
  tr:["","bir","iki","üç","dört","beş","altı","yedi","sekiz","dokuz","on"],
  ku:["","yek","du","sê","çar","pênc","şeş","heft","heşt","neh","deh"]
};

/* ===== DATA ===== */
var DOT = {
  1:[[1,1]],2:[[0,0],[2,2]],3:[[0,0],[1,1],[2,2]],
  4:[[0,0],[2,0],[0,2],[2,2]],
  5:[[0,0],[2,0],[1,1],[0,2],[2,2]],
  6:[[0,0],[2,0],[0,1],[2,1],[0,2],[2,2]]
};
var TPL = [
  {n:"Serbest Keşif",k:"Vekolîna Azad",i:"🎨",
   cat:"keşif",diff:1,chk:"none",
   d:"Çubukları, kartları ve pulları serbestçe keşfet. Birleştir, ayır, çevir, say — kendi etkinliğini oluştur!",
   dk:"Çovik, çarçove û pûlan bi azadî keşf bike. Yek bike, ji hev bike, bizvirîne, bijmêre — çalakiya xwe çê bike!",
   it:[]},
  {n:"1. Az-Çok-Eşit",k:"1. Kêm-Pir-Wekhev",i:"⚖️",
   cat:"oyun",diff:1,chk:"compare",
   d:"Çubukları alt alta koy ve soldan hizala. Hangisi daha uzun? Fazla kısmı ✂ ile kes — fark kaç?",
   dk:"Çovikan li bin hev deyne û ji aliyê çepê ve li hev bîne. Kîjan dirêjtir? Beşa zêde bi ✂ jê bike — cudahî çend e?",
   it:[{t:"rod",v:7,x:80,y:100},{t:"rod",v:4,x:80,y:170}]},
  {n:"2. 5'ten Az–Çok",k:"2. Ji 5an Kêm–Pir",i:"🖐️",
   cat:"oyun",diff:1,chk:"none",
   d:"5'lik çubuğu en üste koy — bu senin ölçün. Diğer çubukları altına diz. 5'ten kısa mı, uzun mu?",
   dk:"Çovika 5an li jor deyne — ev pîvana te ye. Yên din li bin wê rêz bike. Ji 5an kurttir e an dirêjtir?",
   it:[{t:"rod",v:5,x:80,y:80},{t:"rod",v:3,x:80,y:170},{t:"rod",v:8,x:80,y:260}]},
  {n:"3. Sıraya Dizelim",k:"3. Bi Rêz Raxînin",i:"📊",
   cat:"oyun",diff:1,chk:"sort_asc",
   d:"Çubukları küçükten büyüğe sırala, alt kenarlarını hizala. Merdiven gibi basamak basamak yükselmeli!",
   dk:"Çovikan ji biçûk ber bi mezin rêz bike û binên wan li hev bîne. Mîna pêlikanan gav bi gav bilind bibe!",
   it:[{t:"rod",v:3,x:60,y:140},{t:"rod",v:7,x:250,y:140},{t:"rod",v:5,x:440,y:140},{t:"rod",v:1,x:60,y:230}]},
  {n:"4. Büyükten Küçüğe",k:"4. Ji Mezin Ber Bi Biçûk",i:"📉",
   cat:"oyun",diff:1,chk:"sort_desc",
   d:"Bu sefer tersi! En uzun solda, en kısa sağda olacak şekilde sırala.",
   dk:"Vê carê berevajî! Ya herî dirêj li çepê, ya herî kurt li rastê rêz bike.",
   it:[{t:"rod",v:2,x:60,y:140},{t:"rod",v:9,x:200,y:140},{t:"rod",v:6,x:400,y:140}]},
  {n:"5. Çevir, Eşleştir",k:"5. Bizvirîne, Li Hev Bike",i:"🔄",
   cat:"oyun",diff:2,chk:"none",
   d:"Çubuklar ters! Uzunluğuna bakarak kaçlık olduğunu tahmin et. Yanına doğru sayı pulunu koy. Sonra 🔄 ile çevirip kontrol et!",
   dk:"Çovik zivirî ne! Ji dirêjahiya wan texmîn bike ku çend in. Pûla hejmarê ya rast deyne kêleka wan. Paşê bi 🔄 bizvirîne û kontrol bike!",
   it:[{t:"rod",v:6,x:100,y:80,f:1},{t:"rod",v:3,x:100,y:170,f:1},{t:"rod",v:8,x:100,y:260,f:1}]},
  {n:"6. Kayıp Sayılar",k:"6. Hejmarên Winda",i:"❓",
   cat:"oyun",diff:2,chk:"sequence",
   d:"Sayı dizisinde boşluklar var! Soldan çubuk ekleyerek eksik sayıları tamamla.",
   dk:"Di rêza hejmaran de valahî hene! Çovikên winda lê zêde bike. Rêza li dû hev: 1, 2, ?, 4, 5",
   it:[{t:"rod",v:1,x:60,y:100},{t:"rod",v:2,x:156,y:100},{t:"rod",v:4,x:348,y:100},{t:"rod",v:5,x:444,y:100}]},
  {n:"7. Pulları Grupla",k:"7. Pûlan Kom Bike",i:"🟢",
   cat:"oyun",diff:2,chk:"chips_in_frame",
   d:"Alt çubuktan mavi pul al ve beşlik karta yerleştir. Kart dolunca onluk karta geç.",
   dk:"Ji xwarê pûlên şîn bigire û deyne çarçoveya pêncan. Dema tijî bû, biçe ser çarçoveya dehan. Çend pêncan = 1 dehan?",
   it:[{t:"frame",c:5,r:1,x:80,y:80},{t:"frame",c:5,r:2,x:80,y:200}]},
  {n:"8. Tahmin Kapışması",k:"8. Pêşbaziya Texmînê",i:"🎯",
   cat:"oyun",diff:1,chk:"none",
   d:"İki ters çubuk var. Hangisi daha uzun? Önce tahmin et, sonra 🔄 ile çevir.",
   dk:"Du çovikên zivirî hene. Kîjan dirêjtir? Pêşî texmîn bike, paşê bi 🔄 bizvirîne. Texmîna te rast bû?",
   it:[{t:"rod",v:7,x:80,y:100,f:1},{t:"rod",v:4,x:80,y:200,f:1}]},
  {n:"9. Üzerine Say!",k:"9. Li Ser Bijmêre!",i:"🔢",
   cat:"oyun",diff:2,chk:"adjacent",
   d:"İki çubuğu yan yana birleştir. Büyüğe çift tıkla ve say. Bittiği yerden devam et. Toplam kaç?",
   dk:"Du çovikan li tenişta hev deyne. Li ya mezin du caran bitikîne û bijmêre. Dema qediya, ji ya biçûk bidome. Giştî çend e?",
   it:[{t:"rod",v:5,x:80,y:120},{t:"rod",v:3,x:320,y:120}]},
  {n:"10. 10'a Tamamla!",k:"10. 10an Temam Bike!",i:"🔟",
   cat:"oyun",diff:2,chk:"complete_ten",
   d:"Onluk kartın üstüne çubuğu koy. Kalan boş oyuklara pul yerleştir. Çubuk + pul = 10 olmalı!",
   dk:"Çovikê deyne ser çarçoveya dehan. Di qulpên vala de pûl deyne. Çovik + pûl divê bibin 10!",
   it:[{t:"frame",c:5,r:2,x:100,y:60},{t:"rod",v:7,x:100,y:200}]},
  {n:"11. Geriye Say!",k:"11. Ber Bi Paş Ve Bijmêre!",i:"🔙",
   cat:"oyun",diff:2,chk:"none",
   d:"Çubuğa çift tıkla — ileri sayar. Şimdi tersten dene: 10'dan başla, geriye say.",
   dk:"Li çovikê du caran bitikîne — ber bi pêş dijmêre. Niha berevajî biceribîne: ji 10an dest pê bike û ber bi paş ve bijmêre.",
   it:[{t:"rod",v:10,x:80,y:120}]},
  {n:"Birebir Sayma",k:"Jimartina Yek-bi-Yek",i:"👆",
   cat:"sayma",diff:1,chk:"chips_on_rod",
   d:"Alt çubuktan mavi pul al, çubuğun her oyuğuna birer tane koy. Atlamadan, tekrar etmeden!",
   dk:"Ji xwarê pûlên şîn bigire, di her qulpê de yekê deyne. Berneke, dubare neke! Te çend pûl danîn?",
   it:[{t:"rod",v:8,x:100,y:120}]},
  {n:"Kardinallik",k:"Kardînalîte",i:"🎯",
   cat:"sayma",diff:1,chk:"none",
   d:"Çubuğa çift tıkla ve pulları sesli say. En son söylediğin sayı toplam pul sayısıdır!",
   dk:"Li çovikê du caran bitikîne û pûlan bi deng bijmêre. Hejmara dawîn a ku te got, hejmara giştî ya pûlan e!",
   it:[{t:"rod",v:6,x:120,y:120}]},
  {n:"Algısal Sanbil",k:"Sanbîla Têgihîştinê",i:"⚡",
   cat:"sayma",diff:2,chk:"none",
   d:"Çubuğa 2 saniye bak, sonra 🙈 ile kapat. Saymadan kaç pul var? Sayı pulunu koy, aç ve kontrol et!",
   dk:"2 çirkeyan li çovikê binêre, paşê bi 🙈 bigire. Bêyî jimartin çend pûl hene? Pûla hejmarê deyne, veke û kontrol bike!",
   it:[{t:"rod",v:4,x:160,y:140}]},
  {n:"Sıfırı Tanıma",k:"Naskirina Sifirê",i:"0️⃣",
   cat:"sayma",diff:1,chk:"none",
   d:"Çubuğu 🔄 ile çevir — oyuklar kayboldu! Hiç pul görünmüyor = sıfır. 0 pulunu koy.",
   dk:"Çovikê bi 🔄 bizvirîne — qulp winda bûn! Tu pûl nayên dîtin = sifir. Pûla 0yê deyne kêleka wê.",
   it:[{t:"rod",v:3,x:80,y:100},{t:"rod",v:5,x:80,y:200}]},
  {n:"Toplama",k:"Zêdekirin",i:"➕",
   cat:"işlem",diff:2,chk:"adjacent",
   d:"İki çubuğu yan yana koy ve ⊕ ile birleştir. Çift tıkla — toplam kaç? İşlem pullarıyla yaz: 4 + 3 = ?",
   dk:"Du çovikan li tenişta hev deyne û bi ⊕ yek bike. Du caran bitikîne — giştî çend e? Bi pûlên hesabê binivîse: 4 + 3 = ?",
   it:[{t:"rod",v:4,x:80,y:120},{t:"rod",v:3,x:272,y:120}]},
  {n:"Çıkarma",k:"Kêmkirin",i:"➖",
   cat:"işlem",diff:2,chk:"compare",
   d:"Çubukları alt alta, soldan hizalı koy. Büyüğü ✂ ile küçük kadar kes. Kalan parça = fark!",
   dk:"Çovikan li bin hev deyne û ji aliyê çepê ve li hev bîne. Ya mezin bi ✂ qas ya biçûk jê bike. Beşa mayî = cudahî!",
   it:[{t:"rod",v:9,x:80,y:100},{t:"rod",v:4,x:80,y:180}]},
  {n:"Kavramsal Sanbil",k:"Sanbîla Têgehî",i:"🧠",
   cat:"işlem",diff:3,chk:"part_whole",
   d:"7'lik çubuğa bak: İlk 5 oyuk bir grup, kalan 2 başka grup. ✂ ile 5+2'ye ayır. Beşlik referansla hızlı tanı!",
   dk:"Li çovika 7an binêre: 5 qulpên pêşîn komek in, 2 yên mayî komeke din in. Bi ✂ parçe bike: 5+2. Bi referansa 5an zû nas bike!",
   it:[{t:"rod",v:7,x:80,y:80},{t:"rod",v:5,x:80,y:190},{t:"rod",v:2,x:320,y:190}]},
  {n:"Parça-Bütün",k:"Beş-Gişt",i:"🧩",
   cat:"işlem",diff:3,chk:"part_whole",
   d:"7'lik çubuk = bütün. ✂ ile istediğin yerden kes: iki parça elde et. Toplamları 7 mi?",
   dk:"Çovika 7an = gişt. Bi ✂ ji cihê ku dixwazî jê bike: du beş çê dibin. Berhevoka wan 7 e?",
   it:[{t:"rod",v:7,x:80,y:80},{t:"rod",v:4,x:80,y:190},{t:"rod",v:3,x:272,y:190}]},
  {n:"Çokluk Tahmin",k:"Texmîna Pirjmariyê",i:"🤔",
   cat:"tahmin",diff:1,chk:"none",
   d:"İki çubuğa kısa süre bak. Saymadan hangisinde daha çok pul var? İşaret et, sonra kontrol et.",
   dk:"Demek kurt li du çovikan binêre. Bêyî jimartin di kîjanê de pûl zêdetir in? Bi tiliya xwe nîşan bide, paşê kontrol bike.",
   it:[{t:"rod",v:8,x:80,y:100},{t:"rod",v:5,x:80,y:200}]},
  {n:"Uzunluk Tahmin",k:"Texmîna Dirêjahiyê",i:"📏",
   cat:"tahmin",diff:2,chk:"none",
   d:"Üstteki çubuk ters! Uzunluğunu tahmin et, aynı boyu soldan seçip altına koy. 🔄 ile çevirip karşılaştır.",
   dk:"Çovika jorîn zivirî ye! Dirêjahiya wê texmîn bike û çovikeke bi heman dirêjahiyê ji çepê hilbijêre û deyne bin wê. Bi 🔄 bizvirîne û ber hev bide.",
   it:[{t:"rod",v:6,x:120,y:100,f:1}]},
];

/* ===== UTILS ===== */
function iW(it) {
  if (it.type==="rod") return it.rot===90 ? RH : it.value*CELL;
  if (it.type==="frame") return (it.cols||5)*FC+FP*2;
  if (it.type==="dotgroup") return 2*(CS+8)+CS;
  return CS;
}
function iH(it) {
  if (it.type==="rod") return it.rot===90 ? it.value*CELL : RH;
  if (it.type==="frame") return (it.rows||2)*FC+FP*2;
  if (it.type==="dotgroup") return 2*(CS+8)+CS;
  return CS;
}
function holes(items) {
  var out = [];
  items.forEach(function(it) {
    if (it.type==="rod" && !it.flipped) {
      for (var i=0; i<it.value; i++) {
        var v = it.rot===90;
        out.push({
          x: it.x+(v?RH/2-CS/2:i*CELL+CELL/2-CS/2),
          y: it.y+(v?i*CELL+CELL/2-CS/2:RH/2-CS/2)
        });
      }
    }
    if (it.type==="frame") {
      for (var r=0;r<(it.rows||2);r++)
        for (var c=0;c<(it.cols||5);c++)
          out.push({
            x:it.x+FP+c*FC+FC/2-CS/2,
            y:it.y+FP+r*FC+FC/2-CS/2
          });
    }
  });
  return out;
}
function nearH(x,y,hs) {
  var b=null,bd=CSNAP;
  hs.forEach(function(h){
    var d=Math.hypot(x-h.x,y-h.y);
    if(d<bd){b=h;bd=d;}
  });
  return b;
}
function gridBg(type,dk) {
  var c=dk?"rgba(255,255,255,.08)":"rgba(0,0,0,.08)";
  if(type==="square") return {
    backgroundImage:"linear-gradient("+c+" 1px,transparent 1px),linear-gradient(90deg,"+c+" 1px,transparent 1px)",
    backgroundSize:"48px 48px"};
  if(type==="dot") return {
    backgroundImage:"radial-gradient(circle,"+c+" 1.2px,transparent 1.2px)",
    backgroundSize:"24px 24px"};
  if(type==="line") return {
    backgroundImage:"linear-gradient("+c+" 1px,transparent 1px)",
    backgroundSize:"100% 32px"};
  return {};
}

/* ===== COMPONENTS ===== */
function Gd() {
  return (
    <>
      <linearGradient id="gR" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#fde047"/>
        <stop offset="30%" stopColor="#f59e0b"/>
        <stop offset="100%" stopColor="#78350f"/>
      </linearGradient>
      <linearGradient id="gB" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#222"/>
        <stop offset="100%" stopColor="#0a0a0a"/>
      </linearGradient>
      <radialGradient id="gH" cx=".45" cy=".38">
        <stop offset="0%" stopColor="#1a1a1a"/>
        <stop offset="100%" stopColor="#000"/>
      </radialGradient>
    </>
  );
}

function Rod(p) {
  var w=p.count*CELL;
  return (
    <svg width={w} height={RH}
      viewBox={"0 0 "+w+" "+RH}
      style={{display:"block"}}>
      <defs><Gd/></defs>
      {p.flipped ? (
        <rect x={2} y={2} width={w-4} height={RH-4}
          rx={10} fill="url(#gB)" stroke="#333" strokeWidth={3}/>
      ) : (
        <>
          <rect x={2} y={2} width={w-4} height={RH-4}
            rx={10} fill="url(#gR)" stroke="#78350f" strokeWidth={3}/>
          {Array.from({length:p.count},function(_,i){
            return (
              <circle key={i}
                cx={i*CELL+CELL/2} cy={RH/2+1}
                r={HR} fill="url(#gH)"
                stroke="rgba(0,0,0,.5)" strokeWidth={2}/>
            );
          })}
        </>
      )}
      {p.label && !p.flipped && (
        <text x={w/2} y={RH-4} textAnchor="middle"
          fontSize={10} fontWeight={800}
          fill="rgba(120,53,15,.6)">{p.count}</text>
      )}
    </svg>
  );
}

function Frm(p) {
  var co=p.cols, ro=p.rows;
  var w=co*FC+FP*2, h=ro*FC+FP*2;
  return (
    <svg width={w} height={h}
      viewBox={"0 0 "+w+" "+h}
      style={{display:"block"}}>
      <defs><Gd/></defs>
      <rect x={2} y={2} width={w-4} height={h-4}
        rx={10} fill="url(#gR)" stroke="#78350f" strokeWidth={3}/>
      {Array.from({length:ro},function(_,r){
        return Array.from({length:co},function(_2,c){
          return (
            <circle key={r+""+c}
              cx={FP+c*FC+FC/2} cy={FP+r*FC+FC/2}
              r={FHR} fill="url(#gH)"
              stroke="rgba(0,0,0,.45)" strokeWidth={2}/>
          );
        });
      })}
    </svg>
  );
}

function MRod(p) {
  var w=p.count*MU;
  return (
    <svg width={w} height={MH}
      viewBox={"0 0 "+w+" "+MH}
      style={{display:"block",flexShrink:0}}>
      <rect x={1} y={1} width={w-2} height={MH-2}
        rx={4} fill="#f59e0b" stroke="#78350f" strokeWidth={2}/>
      {Array.from({length:p.count},function(_,i){
        return <circle key={i} cx={i*MU+MU/2} cy={MH/2}
          r={5.5} fill="#050505"/>;
      })}
    </svg>
  );
}

function MFrm(p) {
  var w=p.cols*MU, h=p.rows*MH;
  return (
    <svg width={w} height={h}
      viewBox={"0 0 "+w+" "+h}
      style={{display:"block",flexShrink:0}}>
      <rect x={1} y={1} width={w-2} height={h-2}
        rx={4} fill="#f59e0b" stroke="#78350f" strokeWidth={2}/>
      {Array.from({length:p.rows},function(_,r){
        return Array.from({length:p.cols},function(_2,c){
          return <circle key={r+""+c}
            cx={c*MU+MU/2} cy={r*MH+MH/2}
            r={5.5} fill="#050505"/>;
        });
      })}
    </svg>
  );
}

function Chip(p) {
  var sz=p.size||24;
  var colors={blue:"#3b82f6",red:"#dc2626",green:"#22c55e",yellow:"#eab308"};
  var borders={blue:"#1e40af",red:"#991b1b",green:"#15803d",yellow:"#a16207"};
  var tx={blue:"#fff",red:"#fff",green:"#fff",yellow:"#422006"};
  var bg=colors[p.color]||"#3b82f6";
  var bd=borders[p.color]||"#1e40af";
  var fs=p.label && String(p.label).length>1
    ? Math.round(sz*0.38)
    : Math.round(sz*0.5);
  return (
    <div style={{
      width:sz,height:sz,borderRadius:"50%",flexShrink:0,
      background:bg,border:"2px solid "+bd,
      display:"flex",alignItems:"center",justifyContent:"center",
      cursor:"pointer"
    }}>
      {p.label!=null && (
        <span style={{
          fontSize:fs,fontWeight:900,
          color:tx[p.color]||"#fff",userSelect:"none"
        }}>{p.label}</span>
      )}
    </div>
  );
}

function DotPrev(p) {
  var sz = p.size || 36;
  var dots = DOT[p.count] || [];
  var cell = sz / 3;
  var dr = cell * 0.38;
  return (
    <svg width={sz} height={sz}
      viewBox={"0 0 " + sz + " " + sz}
      style={{display:"block",cursor:"pointer"}}>
      {dots.map(function(d, i) {
        var cx = d[0] * cell + cell / 2;
        var cy = d[1] * cell + cell / 2;
        return (
          <g key={i}>
            <circle cx={cx} cy={cy} r={dr}
              fill="#3b82f6" stroke="#1e40af" strokeWidth={1.2}/>
            <circle cx={cx - dr*0.2} cy={cy - dr*0.25} r={dr*0.3}
              fill="rgba(255,255,255,.3)"/>
          </g>
        );
      })}
    </svg>
  );
}

function DotGrp(p) {
  var dots=DOT[p.count]||[], step=CS+8;
  return (
    <div style={{
      width:2*step+CS,height:2*step+CS,position:"relative"
    }}>
      {dots.map(function(d,i){
        return (
          <div key={i} style={{position:"absolute",left:d[0]*step,top:d[1]*step}}>
            <Chip color="blue" size={CS}/>
          </div>
        );
      })}
    </div>
  );
}

/* ===== MAIN APP ===== */
export default function App() {
  var s = useState; // shorthand
  var _items=s([]),items=_items[0],setItems=_items[1];
  var _lines=s([]),lines=_lines[0],setLines=_lines[1];
  var _drag=s(null),drag=_drag[0],setDrag=_drag[1];
  var _dp=s({x:0,y:0}),dp=_dp[0],setDp=_dp[1];
  var _doff=s({x:0,y:0}),doff=_doff[0],setDoff=_doff[1];
  var _trash=s(false),nearTrash=_trash[0],setTrash=_trash[1];
  var _tool=s("select"),tool=_tool[0],setTool=_tool[1];
  var _penC=s("#1a1a1a"),penClr=_penC[0],setPenClr=_penC[1];
  var _cl=s(null),curLine=_cl[0],setCurLine=_cl[1];
  var _txt=s(null),txtIn=_txt[0],setTxtIn=_txt[1];
  var _tv=s(""),txtVal=_tv[0],setTxtVal=_tv[1];
  var _sel=s(null),selId=_sel[0],setSelId=_sel[1];
  var _ins=s(null),instr=_ins[0],setInstr=_ins[1];
  var _np=s(false),numPick=_np[0],setNumPick=_np[1];
  var _cov=s(false),covered=_cov[0],setCovered=_cov[1];
  var _cnt=s(null),counting=_cnt[0],setCounting=_cnt[1];
  var _bg=s("#f0ead6"),bgColor=_bg[0],setBgColor=_bg[1];
  var _gr=s("none"),gridType=_gr[0],setGridType=_gr[1];
  var _lab=s(false),showLabels=_lab[0],setLabels=_lab[1];
  var _nl=s(false),showNL=_nl[0],setNL=_nl[1];
  var _lang=s("tr"),lang=_lang[0],setLang=_lang[1];
  var _atpl=s(null),activeTpl=_atpl[0],setActiveTpl=_atpl[1];
  var _fb=s(null),feedback=_fb[0],setFeedback=_fb[1];
  var _stab=s("mat"),sideTab=_stab[0],setSideTab=_stab[1];
  var _collapsed=s(false),collapsed=_collapsed[0],setCollapsed=_collapsed[1];
  var _help=s(false),helpOpen=_help[0],setHelp=_help[1];
  var _snapFX=s(null),snapFX=_snapFX[0],setSnapFX=_snapFX[1];
  var _voice=s(false),voiceOn=_voice[0],setVoice=_voice[1];
  var _tmode=s(false),teacherMode=_tmode[0],setTeacherMode=_tmode[1];
  var _progress=s({}),progress=_progress[0],setProgress=_progress[1];
  var _customTpl=s([]),customTpl=_customTpl[0],setCustomTpl=_customTpl[1];
  var voiceRef = useRef(null);

  var cvRef = useRef(null);
  var idRef = useRef(100);
  var irRef = useRef(items); irRef.current = items;
  var pastRef = useRef([]);
  var futRef = useRef([]);
  var ctRef = useRef(null);
  var _frc = s(0);
  var frc = _frc[1];

  function nid() { return idRef.current++; }
  function t(k) {
    var d = LANG[lang];
    if (d && d[k]) return d[k];
    return LANG.tr[k] || k;
  }

  var dk = bgColor==="#2d2d2d";
  var P = {
    bg:dk?"#333":"#b8c0ae", panel:dk?"#1a1a1a":"#c8cfbe",
    brd:dk?"#555":"#a0aa94", tx:dk?"#ccc":"#3d4a35",
    sub:dk?"#888":"#6b7a60"
  };

  function hPush() {
    pastRef.current = pastRef.current.slice(-39).concat([
      JSON.parse(JSON.stringify(irRef.current))
    ]);
    futRef.current = [];
    frc(function(v){return v+1;});
  }
  function doUndo() {
    if (!pastRef.current.length) return;
    futRef.current.push(JSON.parse(JSON.stringify(irRef.current)));
    setItems(pastRef.current.pop());
    frc(function(v){return v+1;});
  }
  function doRedo() {
    if (!futRef.current.length) return;
    pastRef.current.push(JSON.parse(JSON.stringify(irRef.current)));
    setItems(futRef.current.pop());
    frc(function(v){return v+1;});
  }
  function upd(fn) {
    hPush();
    setItems(function(prev) {
      return typeof fn==="function" ? fn(prev) : fn;
    });
  }

  function place(def) {
    var el=cvRef.current; if(!el) return;
    var r=el.getBoundingClientRect();
    var x,y;
    if (def.type==="chip") {
      var cnt=items.filter(function(i){return i.type==="chip";}).length;
      x=20+(cnt%10)*(CS+4); y=Math.round(r.height-CS-20);
    } else {
      x=Math.round(r.width/2-iW(def)/2);
      y=Math.round(r.height/2-iH(def)/2);
    }
    upd(function(p){return p.concat([Object.assign({},def,{id:nid(),x:x,y:y})]);});
    sfx.place();
  }

  function flipIt(id){upd(function(p){return p.map(function(i){return i.id===id?Object.assign({},i,{flipped:!i.flipped}):i;});});sfx.flip();}
  function rotIt(id){upd(function(p){return p.map(function(i){return i.id===id?Object.assign({},i,{rot:(i.rot||0)===0?90:0}):i;});});sfx.rot();}
  function rmIt(id){upd(function(p){return p.filter(function(i){return i.id!==id;});});sfx.rm();}
  function lockIt(id){upd(function(p){return p.map(function(i){return i.id===id?Object.assign({},i,{locked:!i.locked}):i;});});}

  function splitRod(id,at) {
    var rod=items.find(function(i){return i.id===id;});
    if(!rod||at<1||at>=rod.value) return;
    var isV=rod.rot===90;
    upd(function(p){
      return p.filter(function(i){return i.id!==id;}).concat([
        {id:nid(),type:"rod",value:at,flipped:rod.flipped,rot:rod.rot,x:rod.x,y:rod.y},
        {id:nid(),type:"rod",value:rod.value-at,flipped:rod.flipped,rot:rod.rot,
         x:isV?rod.x:rod.x+at*CELL,y:isV?rod.y+at*CELL:rod.y}
      ]);
    });
    setSelId(null); sfx.snap();
  }

  function mergeRods(a,b) {
    upd(function(p){
      return p.filter(function(i){return i.id!==a.id&&i.id!==b.id;}).concat([
        {id:nid(),type:"rod",value:a.value+b.value,
         flipped:a.flipped,rot:a.rot,
         x:Math.min(a.x,b.x),y:Math.min(a.y,b.y)}
      ]);
    });
    sfx.snap();
  }

  function startCount(rid) {
    var rod=items.find(function(i){return i.id===rid;});
    if(!rod||rod.flipped) return;
    if(ctRef.current) clearInterval(ctRef.current);
    setCounting({rid:rid,step:0});
    try{var u=new SpeechSynthesisUtterance((NW[lang]||NW.tr)[1]||"1");u.lang=lang==="ku"?"ku":"tr-TR";u.rate=0.9;speechSynthesis.cancel();speechSynthesis.speak(u);}catch(e){}
    sfx.note(1);
    var step=0;
    ctRef.current=setInterval(function(){
      step++;
      if(step>=rod.value){clearInterval(ctRef.current);ctRef.current=null;setTimeout(function(){setCounting(null);},800);}
      else{setCounting({rid:rid,step:step});sfx.note(step+1);
        try{var u2=new SpeechSynthesisUtterance((NW[lang]||NW.tr)[step+1]||String(step+1));u2.lang=lang==="ku"?"ku":"tr-TR";u2.rate=0.9;speechSynthesis.cancel();speechSynthesis.speak(u2);}catch(e){}}
    },600);
  }

  function loadTpl(tp) {
    hPush();
    setItems(tp.it.map(function(r){
      var base = {id:nid(),type:r.t,x:r.x,y:r.y,rot:r.rot||0};
      if(r.t==="rod") return Object.assign(base,{value:r.v,flipped:!!r.f});
      if(r.t==="frame") return Object.assign(base,{cols:r.c,rows:r.r});
      if(r.t==="chip") return Object.assign(base,{color:r.color,label:r.label});
      if(r.t==="dotgroup") return Object.assign(base,{value:r.v});
      if(r.t==="text") return Object.assign(base,{label:r.label,color:r.color});
      return Object.assign(base,{value:r.v,flipped:!!r.f});
    }));
    setLines([]); setCovered(false);
    setActiveTpl(tp);
    if(tp.d) {
      setInstr({n:tp.n,k:tp.k,i:tp.i,d:tp.d,dk:tp.dk});
      setTimeout(function(){
        try {
          var txt = lang==="ku" && tp.dk ? tp.dk : tp.d;
          var u = new SpeechSynthesisUtterance(txt);
          u.lang = lang==="ku" ? "ku" : "tr-TR";
          u.rate = 0.85;
          speechSynthesis.cancel();
          speechSynthesis.speak(u);
        } catch(e) {}
      }, 800);
    }
  }

  function commitTxt() {
    if(txtVal.trim()&&txtIn)
      upd(function(p){return p.concat([{id:nid(),type:"text",x:txtIn.x,y:txtIn.y,label:txtVal.trim(),color:penClr}]);});
    setTxtIn(null); setTxtVal("");
  }

  function saveJ() {
    var blob=new Blob([JSON.stringify({items:items,lines:lines},null,2)],{type:"application/json"});
    var url=URL.createObjectURL(blob);
    var a=document.createElement("a");a.href=url;a.download="dokun-say.json";a.click();
    setTimeout(function(){URL.revokeObjectURL(url);},1000);
  }
  function loadJ() {
    var inp=document.createElement("input");inp.type="file";inp.accept=".json";
    inp.onchange=function(e){
      var f=e.target.files&&e.target.files[0]; if(!f) return;
      var rd=new FileReader();
      rd.onload=function(ev){
        try{var s2=JSON.parse(ev.target.result);
          if(s2.items){hPush();setItems(s2.items);}
          if(s2.lines) setLines(s2.lines);
        }catch(err){}
      };
      rd.readAsText(f);
    };
    inp.click();
  }

  function exportPNG() {
    var el = cvRef.current;
    if (!el) return;
    import("https://esm.sh/html-to-image@1.11.11").then(function(mod) {
      mod.toPng(el, {backgroundColor: bgColor}).then(function(dataUrl) {
        var a = document.createElement("a");
        a.href = dataUrl;
        a.download = "dokun-say.png";
        a.click();
      });
    }).catch(function() {});
  }

  function printCanvas() {
    var el = cvRef.current;
    if (!el) return;
    import("https://esm.sh/html-to-image@1.11.11").then(function(mod) {
      mod.toPng(el, {backgroundColor: bgColor}).then(function(dataUrl) {
        var win = window.open("", "_blank");
        if (!win) return;
        win.document.write(
          "<html><head><title>DokunSay</title>" +
          "<style>@page{margin:1cm}body{margin:0;display:flex;" +
          "justify-content:center;align-items:center;min-height:100vh}" +
          "img{max-width:100%;height:auto}</style></head><body>" +
          "<img src='" + dataUrl + "'/></body></html>"
        );
        win.document.close();
        setTimeout(function() { win.print(); }, 500);
      });
    }).catch(function() {});
  }

  function speakInstr() {
    if (!activeTpl) return;
    try {
      var txt = lang==="ku" && activeTpl.dk ? activeTpl.dk : activeTpl.d;
      var u = new SpeechSynthesisUtterance(txt);
      u.lang = lang==="ku" ? "ku" : "tr-TR";
      u.rate = 0.85;
      speechSynthesis.cancel();
      speechSynthesis.speak(u);
    } catch(e) {}
  }

  function showFB(ok) {
    setFeedback(ok ? "ok" : "no");
    if (ok) {
      tone(523,.2,.12); tone(659,.2,.12);
      if(activeTpl) saveProgress(activeTpl.n);
    }
    else tone(220,.3,.08,"sawtooth");
    setTimeout(function() { setFeedback(null); }, 2500);
  }

  function checkActivity() {
    if (!activeTpl || activeTpl.chk === "none") {
      setFeedback("info");
      setTimeout(function() { setFeedback(null); }, 2000);
      return;
    }
    var rods = items.filter(function(i) { return i.type === "rod"; });
    var chips = items.filter(function(i) { return i.type === "chip"; });
    var chk = activeTpl.chk;

    if (chk === "sort_asc") {
      var sorted = rods.slice().sort(function(a, b) { return a.x - b.x; });
      var ok = true;
      for (var i = 1; i < sorted.length; i++) {
        if (sorted[i].value < sorted[i-1].value) { ok = false; break; }
      }
      showFB(ok && rods.length >= 2);
      return;
    }
    if (chk === "sort_desc") {
      var sorted2 = rods.slice().sort(function(a, b) { return a.x - b.x; });
      var ok2 = true;
      for (var j = 1; j < sorted2.length; j++) {
        if (sorted2[j].value > sorted2[j-1].value) { ok2 = false; break; }
      }
      showFB(ok2 && rods.length >= 2);
      return;
    }
    if (chk === "adjacent") {
      var ok3 = false;
      for (var ai2 = 0; ai2 < rods.length && !ok3; ai2++) {
        for (var bi2 = ai2+1; bi2 < rods.length; bi2++) {
          var ra = rods[ai2], rb = rods[bi2];
          if (Math.abs(ra.y - rb.y) < 8) {
            var g1 = Math.abs((ra.x + ra.value * CELL) - rb.x);
            var g2 = Math.abs((rb.x + rb.value * CELL) - ra.x);
            if (g1 < 10 || g2 < 10) { ok3 = true; break; }
          }
        }
      }
      showFB(ok3);
      return;
    }
    if (chk === "compare") {
      showFB(rods.length >= 2 &&
        Math.abs(rods[0].y - rods[1].y) > 20 &&
        Math.abs(rods[0].x - rods[1].x) < CELL);
      return;
    }
    if (chk === "sequence") {
      var vals = rods.map(function(r) { return r.value; }).sort(function(a,b){return a-b;});
      var seq = true;
      for (var k2 = 1; k2 < vals.length; k2++) {
        if (vals[k2] !== vals[k2-1] + 1) { seq = false; break; }
      }
      showFB(seq && vals.length >= 3);
      return;
    }
    if (chk === "chips_on_rod") {
      var rH = holes(items.filter(function(i){return i.type==="rod"&&!i.flipped;}));
      var sn = 0;
      chips.forEach(function(ch) {
        rH.forEach(function(h) {
          if (Math.abs(ch.x-h.x)<8 && Math.abs(ch.y-h.y)<8) sn++;
        });
      });
      showFB(sn >= 1 && rods.length >= 1);
      return;
    }
    if (chk === "chips_in_frame") {
      var fH = holes(items.filter(function(i){return i.type==="frame";}));
      var fl = 0;
      chips.forEach(function(ch) {
        fH.forEach(function(h) {
          if (Math.abs(ch.x-h.x)<8 && Math.abs(ch.y-h.y)<8) fl++;
        });
      });
      showFB(fl >= 1);
      return;
    }
    if (chk === "complete_ten") {
      var fH2 = holes(items.filter(function(i){return i.type==="frame";}));
      var tot = 0;
      chips.forEach(function(ch) {
        fH2.forEach(function(h) {
          if (Math.abs(ch.x-h.x)<8 && Math.abs(ch.y-h.y)<8) tot++;
        });
      });
      var rTot = 0;
      rods.forEach(function(r) { rTot += r.value; });
      showFB(tot + rTot === 10 || tot === 10);
      return;
    }
    if (chk === "part_whole") {
      if (rods.length < 2) { showFB(false); return; }
      var byY = rods.slice().sort(function(a,b){return a.y-b.y;});
      var whole = byY[0].value;
      var pSum = 0;
      for (var m = 1; m < byY.length; m++) pSum += byY[m].value;
      showFB(pSum === whole);
      return;
    }
    showFB(false);
  }

  /* === PROGRESS TRACKING === */
  useEffect(function(){
    try {
      window.storage.get("ds-progress").then(function(r){
        if(r&&r.value) setProgress(JSON.parse(r.value));
      }).catch(function(){});
      window.storage.get("ds-custom-tpl").then(function(r){
        if(r&&r.value) setCustomTpl(JSON.parse(r.value));
      }).catch(function(){});
    } catch(e){}
  },[]);

  function saveProgress(name) {
    var np = Object.assign({},progress);
    np[name] = {done:true, ts:Date.now()};
    setProgress(np);
    try{window.storage.set("ds-progress",JSON.stringify(np)).catch(function(){});}catch(e){}
  }

  /* === TEACHER MODE: Save custom template === */
  function saveCustomTpl() {
    var name = prompt(lang==="ku"?"Navê şablonê binivîse:":"Şablon adını yazın:");
    if(!name||!name.trim()) return;
    var tplItems = items.map(function(it){
      return {t:it.type,v:it.value,c:it.cols,r:it.rows,
        x:Math.round(it.x),y:Math.round(it.y),
        f:it.flipped?1:0,rot:it.rot||0,
        color:it.color,label:it.label};
    });
    var nt = {n:name.trim(),k:name.trim(),i:"📝",cat:"custom",diff:1,chk:"none",
      d:lang==="ku"?"Xwerû çalakî":"Özel etkinlik",dk:"Xwerû çalakî",it:tplItems};
    var nc = customTpl.concat([nt]);
    setCustomTpl(nc);
    try{window.storage.set("ds-custom-tpl",JSON.stringify(nc)).catch(function(){});}catch(e){}
    sfx.snap();
  }

  /* === VOICE COMMANDS === */
  function toggleVoice() {
    if(voiceOn){
      if(voiceRef.current){voiceRef.current.stop();voiceRef.current=null;}
      setVoice(false); return;
    }
    try {
      var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
      if(!SR) return;
      var rec = new SR();
      rec.continuous = true;
      rec.interimResults = false;
      rec.lang = lang==="ku"?"ku":"tr-TR";
      rec.onresult = function(ev){
        var txt = ev.results[ev.results.length-1][0].transcript.toLowerCase().trim();
        handleVoice(txt);
      };
      rec.onerror = function(){ setVoice(false); };
      rec.onend = function(){
        if(voiceRef.current) try{voiceRef.current.start();}catch(e){}
      };
      rec.start();
      voiceRef.current = rec;
      setVoice(true);
    } catch(e){ setVoice(false); }
  }

  function handleVoice(txt) {
    var numWords = {bir:1,iki:2,"üç":3,"dört":4,"beş":5,"altı":6,yedi:7,sekiz:8,dokuz:9,on:10,
      yek:1,du:2,"sê":3,"çar":4,"pênc":5,"şeş":6,heft:7,"heşt":8,neh:9,deh:10};
    var num = null;
    Object.keys(numWords).forEach(function(w){
      if(txt.indexOf(w)>=0) num=numWords[w];
    });
    if(txt.match(/\d+/)) num=parseInt(txt.match(/\d+/)[0],10);

    if((txt.indexOf("çubuk")>=0||txt.indexOf("çovik")>=0)&&num&&num>=1&&num<=10){
      place({type:"rod",value:num,flipped:false,rot:0}); return;
    }
    if(txt.indexOf("beşlik")>=0||txt.indexOf("pêncan")>=0){
      place({type:"frame",cols:5,rows:1}); return;
    }
    if(txt.indexOf("onluk")>=0||txt.indexOf("dehan")>=0){
      place({type:"frame",cols:5,rows:2}); return;
    }
    if(txt.indexOf("temizle")>=0||txt.indexOf("paqij")>=0){
      upd([]); setLines([]); setActiveTpl(null); return;
    }
    if(txt.indexOf("geri")>=0||txt.indexOf("paş")>=0){
      doUndo(); return;
    }
    if(txt.indexOf("kontrol")>=0){
      checkActivity(); return;
    }
    if(txt.indexOf("kaydet")>=0||txt.indexOf("tomar")>=0){
      saveJ(); return;
    }
    if((txt.indexOf("pul")>=0||txt.indexOf("pûl")>=0)&&num!=null){
      place({type:"chip",color:"green",label:String(num)}); return;
    }
  }

  // Adjacent pairs
  var adjP = [];
  for(var ai=0;ai<items.length;ai++){
    var a=items[ai];
    if(a.type!=="rod"||(a.rot||0)!==0) continue;
    for(var bi=ai+1;bi<items.length;bi++){
      var b=items[bi];
      if(b.type!=="rod"||(b.rot||0)!==0) continue;
      if(Math.abs(a.y-b.y)>4||a.flipped!==b.flipped) continue;
      var aR=a.x+a.value*CELL, bR=b.x+b.value*CELL;
      if(Math.abs(aR-b.x)<6) adjP.push({l:a,r:b,mx:aR,my:a.y+RH/2});
      else if(Math.abs(bR-a.x)<6) adjP.push({l:b,r:a,mx:bR,my:b.y+RH/2});
    }
  }

  function startDrag(e,eid) {
    if(tool!=="select") return;
    e.preventDefault(); e.stopPropagation();
    var r=cvRef.current.getBoundingClientRect();
    var it=items.find(function(i){return i.id===eid;});
    if(!it||it.locked) return;
    setDoff({x:e.clientX-r.left-it.x,y:e.clientY-r.top-it.y});
    setDp({x:it.x,y:it.y});
    if(e.altKey) setDrag(Object.assign({},it,{id:nid(),src:"p"}));
    else setDrag(Object.assign({},it,{src:"c"}));
  }

  useEffect(function(){
    if(!drag&&!curLine) return;
    function onMove(e){
      var r=cvRef.current.getBoundingClientRect();
      var mx=e.clientX-r.left,my=e.clientY-r.top;
      if(curLine) setCurLine(function(l){return l?Object.assign({},l,{pts:l.pts.concat([{x:mx,y:my}])}):null;});
      else if(drag){
        var sx=mx-doff.x,sy=my-doff.y;
        items.forEach(function(o){
          if(o.id===(drag&&drag.id)||o.type==="chip"||o.type==="text") return;
          var ow=iW(o);
          if(Math.abs(sx-(o.x+ow))<SNAP&&Math.abs(sy-o.y)<SNAP*2.5){sx=o.x+ow;sy=o.y;}
          if(Math.abs(sx-o.x)<SNAP&&Math.abs(sy-o.y)<SNAP*2.5){sx=o.x;sy=o.y;}
        });
        setDp({x:sx,y:sy}); setTrash(my>r.height-TRH);
      }
    }
    function onUp(){
      if(curLine){
        if(curLine.color==="erase"){var ep=curLine.pts;setLines(function(ls){return ls.filter(function(l){return !l.pts.some(function(lp){return ep.some(function(e2){return Math.hypot(lp.x-e2.x,lp.y-e2.y)<20;});});});});}
        else setLines(function(ls){return ls.concat([curLine]);});
        setCurLine(null); return;
      }
      if(!drag) return;
      if(nearTrash){
        if(drag.src==="c") upd(function(p){return p.filter(function(i){return i.id!==drag.id;});});
        sfx.rm(); setDrag(null); setTrash(false); return;
      }
      var fx=dp.x,fy=dp.y;
      if(drag.type==="chip"){
        var h=nearH(dp.x,dp.y,holes(items.filter(function(i){return !(drag.src==="c"&&i.id===drag.id);})));
        if(h){fx=h.x;fy=h.y;sfx.snap();
          setSnapFX({x:h.x+CS/2,y:h.y+CS/2,t:Date.now()});
          setTimeout(function(){setSnapFX(null);},500);
        }
      }
      var nb={id:drag.id,type:drag.type,x:fx,y:fy,value:drag.value,cols:drag.cols,rows:drag.rows,flipped:!!drag.flipped,rot:drag.rot||0,color:drag.color,label:drag.label,locked:drag.locked};
      if(drag.src==="c") upd(function(p){return p.map(function(i){return i.id===drag.id?nb:i;});});
      else upd(function(p){return p.concat([nb]);});
      setDrag(null); setTrash(false);
    }
    window.addEventListener("pointermove",onMove);
    window.addEventListener("pointerup",onUp);
    return function(){window.removeEventListener("pointermove",onMove);window.removeEventListener("pointerup",onUp);};
  });

  useEffect(function(){
    return function(){
      if(ctRef.current) clearInterval(ctRef.current);
      if(voiceRef.current){try{voiceRef.current.stop();}catch(e){} voiceRef.current=null;}
    };
  },[]);

  /* Responsive: auto-collapse on narrow screens */
  useEffect(function(){
    function chk(){
      if(window.innerWidth<768) setCollapsed(true);
    }
    chk();
    window.addEventListener("resize",chk);
    return function(){window.removeEventListener("resize",chk);};
  },[]);

  /* Inject CSS animations */
  useEffect(function(){
    var id = "ds-anims";
    if (document.getElementById(id)) return;
    var st = document.createElement("style");
    st.id = id;
    st.textContent = [
      "@keyframes dsPop{0%{transform:scale(0.6);opacity:0}60%{transform:scale(1.08)}100%{transform:scale(1);opacity:1}}",
      "@keyframes dsSlide{0%{transform:translate(-50%,-20px);opacity:0}100%{transform:translate(-50%,0);opacity:1}}",
      "@keyframes dsPulse{0%,100%{box-shadow:0 0 0 0 rgba(34,197,94,.4)}50%{box-shadow:0 0 0 8px rgba(34,197,94,0)}}",
      "@keyframes dsShake{0%,100%{transform:translateX(0)}20%{transform:translateX(-4px)}40%{transform:translateX(4px)}60%{transform:translateX(-2px)}80%{transform:translateX(2px)}}",
      "@keyframes dsSnap{0%{transform:scale(0.5);opacity:1}100%{transform:scale(2.5);opacity:0}}",
      "@keyframes dsCount{0%{background:rgba(34,197,94,.5)}50%{background:rgba(34,197,94,.2)}100%{background:rgba(34,197,94,.5)}}",
      ".ds-pop{animation:dsPop .25s ease-out}",
      ".ds-slide{animation:dsSlide .3s ease-out}",
      ".ds-pulse{animation:dsPulse 1.5s ease infinite}",
      ".ds-shake{animation:dsShake .4s ease}",
      ".ds-btn:hover{filter:brightness(1.1);transform:scale(1.04)}",
      ".ds-btn:active{transform:scale(0.96)}",
      ".ds-btn{transition:all .1s ease}",
      "@media(max-width:768px){.ds-bar{flex-wrap:wrap;height:auto!important;min-height:40px!important;padding:4px!important}}",
      "@media(max-width:768px){.ds-bar button,.ds-bar>div{min-height:36px}}",
      "*{-webkit-tap-highlight-color:transparent;-webkit-touch-callout:none}"
    ].join("\n");
    document.head.appendChild(st);
  },[]);

  function rIt(it) {
    if(it.type==="rod") return <Rod count={it.value} flipped={it.flipped} label={showLabels}/>;
    if(it.type==="frame") return <Frm cols={it.cols||5} rows={it.rows||2}/>;
    if(it.type==="dotgroup") return <DotGrp count={it.value}/>;
    if(it.type==="text") return <span style={{fontSize:20,fontWeight:800,color:it.color||"#1a1a1a"}}>{it.label}</span>;
    return <Chip color={it.color} label={it.label} size={CS}/>;
  }

  function bs(active,extra) {
    var o = {padding:"4px 8px",borderRadius:5,cursor:"pointer",
      fontFamily:"inherit",fontSize:9,fontWeight:700,
      background:active?"#f59e0b":P.bg,
      border:active?"2px solid #78350f":"1px solid "+P.brd,
      color:active?"#fff":P.tx,
      transition:"all .1s ease"};
    if(extra) Object.assign(o,extra);
    return o;
  }

  var cats = ["keşif","oyun","sayma","işlem","tahmin"];

  return (
    <div style={{display:"flex",flexDirection:"column",height:"100vh",overflow:"hidden",fontFamily:"system-ui,sans-serif"}}>
      <div style={{display:"flex",flex:1,overflow:"hidden"}}>

        {/* SIDEBAR */}
        <div role="navigation" aria-label="DokunSay" style={{width:collapsed?48:210,minWidth:collapsed?48:210,background:P.panel,borderRight:"2px solid "+P.brd,display:"flex",flexDirection:"column",transition:"width .2s"}}>

          {/* Header */}
          <div style={{padding:collapsed?"8px 4px":"8px 10px",borderBottom:"1px solid "+P.brd,display:"flex",alignItems:"center",justifyContent:collapsed?"center":"space-between",gap:3}}>
            {!collapsed && <div style={{display:"flex",alignItems:"center",gap:6}}>
              <svg width="28" height="28" viewBox="0 0 512 512" style={{flexShrink:0,borderRadius:6}}>
                <rect width="512" height="512" rx="100" fill="#1a1610"/>
                <circle cx="256" cy="258" r="138" fill="none" stroke="rgba(217,119,6,.25)" strokeWidth="3" strokeDasharray="9 8"/>
                <circle cx="180" cy="155" r="60" fill="#f59e0b"/><circle cx="180" cy="155" r="60" fill="none" stroke="#b45309" strokeWidth="5"/>
                <circle cx="160" cy="148" r="10" fill="#fff"/><circle cx="180" cy="148" r="10" fill="#fff"/><circle cx="200" cy="148" r="10" fill="#fff"/>
                <circle cx="332" cy="155" r="60" fill="#d97706"/><circle cx="332" cy="155" r="60" fill="none" stroke="#92400e" strokeWidth="5"/>
                <text x="332" y="173" textAnchor="middle" fontFamily="system-ui" fontSize="46" fontWeight="900" fill="#fff">{lang==="ku"?"sê":"üç"}</text>
                <circle cx="256" cy="362" r="60" fill="#16a34a"/><circle cx="256" cy="362" r="60" fill="none" stroke="#064e3b" strokeWidth="5"/>
                <text x="256" y="384" textAnchor="middle" fontFamily="system-ui" fontSize="54" fontWeight="900" fill="#fff">{"3"}</text>
              </svg>
              <span style={{fontWeight:900,fontSize:14,color:dk?"#fff":"#3d3520"}}>DokunSay</span>
            </div>}
            <div style={{display:"flex",gap:2}}>
              {!collapsed && <button onClick={function(){setLang(function(l){return l==="tr"?"ku":"tr";});}} style={bs(lang==="ku",{fontSize:7,padding:"2px 5px",background:lang==="ku"?"#16a34a":P.bg,color:lang==="ku"?"#fff":P.tx})}>{lang==="tr"?"KU":"TR"}</button>}
              <button onClick={function(){setCollapsed(function(v){return !v;});}} style={bs(false,{fontSize:10,padding:"2px 6px"})}>{collapsed?"»":"«"}</button>
            </div>
          </div>

          {!collapsed && (
            <>
            {/* Tabs */}
            <div style={{display:"flex",borderBottom:"1px solid "+P.brd}}>
              <button onClick={function(){setSideTab("mat");}} style={{flex:1,padding:"6px 0",border:"none",borderBottom:sideTab==="mat"?"3px solid #f59e0b":"3px solid transparent",background:"transparent",cursor:"pointer",fontSize:10,fontWeight:800,color:sideTab==="mat"?(dk?"#fff":P.tx):P.sub,fontFamily:"inherit"}}>{"📦 "+(lang==="ku"?"Amûr":"Materyal")}</button>
              <button onClick={function(){setSideTab("act");}} style={{flex:1,padding:"6px 0",border:"none",borderBottom:sideTab==="act"?"3px solid #f59e0b":"3px solid transparent",background:"transparent",cursor:"pointer",fontSize:10,fontWeight:800,color:sideTab==="act"?(dk?"#fff":P.tx):P.sub,fontFamily:"inherit"}}>{"📋 "+(lang==="ku"?"Çalakî":"Etkinlik")}</button>
            </div>

            {/* Tab: Materials */}
            {sideTab==="mat" && (
              <div style={{flex:1,overflowY:"auto",padding:"4px 8px"}}>
                <div style={{fontSize:8,fontWeight:700,textTransform:"uppercase",letterSpacing:1,color:P.sub,margin:"4px 0 2px"}}>{t("rods")}</div>
                {[1,2,3,4,5,6,7,8,9,10].map(function(n){
                  return (
                    <div key={n} onClick={function(){place({type:"rod",value:n,flipped:false,rot:0});}} style={{cursor:"pointer",display:"flex",alignItems:"center",gap:6,padding:"2px 0"}}>
                      <MRod count={n}/><span style={{fontSize:9,fontWeight:800,color:P.sub}}>{n}</span>
                    </div>
                  );
                })}
                <div style={{fontSize:8,fontWeight:700,textTransform:"uppercase",letterSpacing:1,color:P.sub,margin:"8px 0 3px"}}>{t("frames")}</div>
                <div onClick={function(){place({type:"frame",cols:5,rows:1});}} style={{cursor:"pointer",display:"flex",alignItems:"center",gap:6,padding:"2px 0"}}>
                  <MFrm cols={5} rows={1}/><span style={{fontSize:9,fontWeight:700,color:P.sub}}>{t("five")}</span>
                </div>
                <div onClick={function(){place({type:"frame",cols:5,rows:2});}} style={{cursor:"pointer",display:"flex",alignItems:"center",gap:6,padding:"2px 0"}}>
                  <MFrm cols={5} rows={2}/><span style={{fontSize:9,fontWeight:700,color:P.sub}}>{t("ten")}</span>
                </div>
                <div style={{fontSize:8,fontWeight:700,textTransform:"uppercase",letterSpacing:1,color:P.sub,margin:"8px 0 3px"}}>{t("dots")}</div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:6}}>
                  {[1,2,3,4,5,6].map(function(n){
                    return (
                      <div key={n} onClick={function(){place({type:"dotgroup",value:n});}}
                        style={{cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",
                          padding:4,borderRadius:6,
                          background:dk?"rgba(255,255,255,.06)":"rgba(0,0,0,.04)",
                          border:"1px solid "+(dk?"rgba(255,255,255,.08)":"rgba(0,0,0,.06)")}}>
                        <DotPrev count={n} size={38}/>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Tab: Activities */}
            {sideTab==="act" && (
              <div style={{flex:1,overflowY:"auto",padding:"4px 6px"}}>
                {/* Teacher mode toggle */}
                <div style={{display:"flex",gap:3,margin:"4px 0 6px"}}>
                  <button onClick={function(){setTeacherMode(function(v){return !v;});}} style={bs(teacherMode,{flex:1,fontSize:8,background:teacherMode?"#7c3aed":P.bg,color:teacherMode?"#fff":P.tx,border:teacherMode?"2px solid #5b21b6":"1px solid "+P.brd})}>
                    {teacherMode?("🎓 "+t("teacherMode")):("👨‍🎓 "+t("studentMode"))}
                  </button>
                </div>

                {/* Template categories */}
                {cats.concat(customTpl.length?["custom"]:[]).map(function(cat){
                  var ct = cat==="custom" ? customTpl : TPL.filter(function(x){return x.cat===cat;});
                  if(!ct.length) return null;
                  return (
                    <div key={cat}>
                      <div style={{fontSize:7,fontWeight:800,textTransform:"uppercase",letterSpacing:1,color:cat==="custom"?"#7c3aed":P.sub,margin:"6px 0 2px"}}>
                        {cat==="custom"?(lang==="ku"?"Xwerû":"Özel"):t(cat)}
                      </div>
                      {ct.map(function(tp,i){
                        var isActive = activeTpl && activeTpl.n === tp.n;
                        var isDone = progress[tp.n] && progress[tp.n].done;
                        return (
                          <button key={cat+i} onClick={function(){loadTpl(tp);}} style={{display:"flex",alignItems:"center",gap:4,padding:"3px 6px",width:"100%",background:isActive?"rgba(245,158,11,.15)":P.bg,border:isActive?"2px solid #f59e0b":"1px solid "+P.brd,borderRadius:5,cursor:"pointer",fontFamily:"inherit",textAlign:"left",color:P.tx,marginBottom:1,fontSize:9,fontWeight:isActive?900:700}}>
                            {isDone && <span style={{fontSize:10,color:"#16a34a",flexShrink:0}}>{"✅"}</span>}
                            <span style={{fontSize:11,flexShrink:0}}>{tp.i}</span>
                            <span style={{flex:1,opacity:isDone?0.7:1}}>{lang==="ku"&&tp.k?tp.k:tp.n}</span>
                            <span style={{fontSize:7,color:"#d97706",flexShrink:0,letterSpacing:-1}}>{"★".repeat(tp.diff||1)+"☆".repeat(3-(tp.diff||1))}</span>
                          </button>
                        );
                      })}
                    </div>
                  );
                })}

                {/* Teacher mode: save template */}
                {teacherMode && items.length>0 && (
                  <button onClick={saveCustomTpl} style={bs(false,{width:"100%",margin:"8px 0",background:"#7c3aed",color:"#fff",border:"2px solid #5b21b6",fontSize:10})}>
                    {"📝 "+t("saveTpl")}
                  </button>
                )}

                {/* Active template panel */}
                {activeTpl && (
                  <div style={{margin:"8px 0 4px",padding:6,borderRadius:8,background:dk?"rgba(255,255,255,.05)":"rgba(245,158,11,.08)",border:"1px solid rgba(245,158,11,.2)"}}>
                    <div style={{fontSize:8,fontWeight:800,color:"#d97706",marginBottom:4}}>
                      {activeTpl.i+" "+(lang==="ku"&&activeTpl.k?activeTpl.k:activeTpl.n)}
                    </div>
                    <div style={{display:"flex",gap:3}}>
                      <button onClick={speakInstr} style={bs(false,{flex:1,fontSize:8})}>{"🔊 "+(lang==="ku"?"Bixwîne":"Oku")}</button>
                      {activeTpl.chk!=="none" && (
                        <button onClick={checkActivity} style={bs(false,{flex:1,fontSize:8,background:"#22c55e",color:"#fff",border:"2px solid #15803d"})}>{"✓ "+(lang==="ku"?"Kontrol":"Kontrol")}</button>
                      )}
                    </div>
                  </div>
                )}

                {/* Progress summary */}
                {Object.keys(progress).length>0 && (
                  <div style={{margin:"8px 0 4px",padding:6,borderRadius:8,background:dk?"rgba(255,255,255,.03)":"rgba(22,163,74,.06)",border:"1px solid rgba(22,163,74,.15)"}}>
                    <div style={{fontSize:8,fontWeight:800,color:"#16a34a",marginBottom:2}}>
                      {"📊 "+t("progress")}
                    </div>
                    <div style={{fontSize:10,fontWeight:700,color:P.tx}}>
                      {Object.keys(progress).length+" / "+(TPL.length+customTpl.length)+" "+
                        (lang==="ku"?"temam bû":"tamamlandı")}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Footer tools */}
            <div style={{padding:"4px 8px",borderTop:"1px solid "+P.brd,display:"flex",flexDirection:"column",gap:3}}>
              <div style={{display:"flex",gap:3,flexWrap:"wrap"}}>
                <button onClick={doUndo} style={bs(false,{opacity:pastRef.current.length?1:0.4})}>{"↩ "+t("undo")}</button>
                <button onClick={doRedo} style={bs(false,{opacity:futRef.current.length?1:0.4})}>{"↪ "+t("redo")}</button>
                <button onClick={function(){setLabels(function(v){return !v;});}} style={bs(showLabels)}>{"#"}</button>
                <button onClick={function(){setNL(function(v){return !v;});}} style={bs(showNL)}>{"📏"}</button>
                <button onClick={function(){setCovered(function(v){return !v;});}} style={bs(covered,{background:covered?"#dc2626":P.bg,color:covered?"#fff":P.tx})}>{covered?"👁":"🙈"}</button>
              </div>
              <div style={{display:"flex",gap:3,flexWrap:"wrap"}}>
                <button onClick={function(){var r2=selId!=null&&items.find(function(i){return i.id===selId;});if(r2&&r2.type==="rod")sfx.note(r2.value);}} style={bs(false)}>{"🎵"}</button>
                <button onClick={saveJ} style={bs(false)}>{"💾"}</button>
                <button onClick={loadJ} style={bs(false)}>{"📂"}</button>
                <button onClick={exportPNG} style={bs(false)}>{"📷"}</button>
                <button onClick={printCanvas} style={bs(false)}>{"🖨"}</button>
                <button onClick={function(){upd([]);setLines([]);setActiveTpl(null);}} style={bs(false)}>{"🗑"}</button>
              </div>
            </div>
            </>
          )}

          {/* Collapsed mini-buttons */}
          {collapsed && (
            <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4,padding:"8px 0"}}>
              <button onClick={function(){setCollapsed(false);setSideTab("mat");}} style={bs(false,{fontSize:14,padding:"4px 8px"})}>{"📦"}</button>
              <button onClick={function(){setCollapsed(false);setSideTab("act");}} style={bs(false,{fontSize:14,padding:"4px 8px"})}>{"📋"}</button>
              <button onClick={function(){setLang(function(l){return l==="tr"?"ku":"tr";});}} style={bs(false,{fontSize:8,padding:"4px 6px"})}>{lang==="tr"?"KU":"TR"}</button>
              <div style={{flex:1}}/>
              <button onClick={doUndo} style={bs(false,{fontSize:12,padding:"4px 8px",opacity:pastRef.current.length?1:0.4})}>{"↩"}</button>
              <button onClick={doRedo} style={bs(false,{fontSize:12,padding:"4px 8px",opacity:futRef.current.length?1:0.4})}>{"↪"}</button>
            </div>
          )}
        </div>

        {/* CANVAS */}
        <div ref={cvRef} role="main" aria-label={t("hint")} tabIndex={0}
          onKeyDown={function(e){
            if((e.ctrlKey||e.metaKey)&&e.key==="z"){e.preventDefault();doUndo();}
            if((e.ctrlKey||e.metaKey)&&e.key==="y"){e.preventDefault();doRedo();}
            if(e.key==="Delete"&&selId!=null){e.preventDefault();rmIt(selId);setSelId(null);}
          }}
          onPointerDown={function(e){
            var r=cvRef.current.getBoundingClientRect();
            var x=e.clientX-r.left,y=e.clientY-r.top;
            if(tool==="pen") setCurLine({pts:[{x:x,y:y}],color:penClr,w:3});
            else if(tool==="eraser") setCurLine({pts:[{x:x,y:y}],color:"erase",w:20});
            else if(tool==="text"){setTxtIn({x:x,y:y});setTxtVal("");}
            else setSelId(null);
          }}
          style={Object.assign({flex:1,position:"relative",overflow:"hidden",background:bgColor,cursor:tool==="pen"?"crosshair":tool==="eraser"?"cell":tool==="text"?"text":"default"},gridBg(gridType,dk))}>

          <svg style={{position:"absolute",inset:0,width:"100%",height:"100%",pointerEvents:"none",zIndex:3}}>
            {lines.map(function(l,i){
              return <path key={i} d={l.pts.map(function(p,j){return (j?"L":"M")+p.x+","+p.y;}).join("")} fill="none" stroke={l.color} strokeWidth={l.w} strokeLinecap="round" strokeLinejoin="round"/>;
            })}
          </svg>

          {txtIn && (
            <div style={{position:"absolute",left:txtIn.x,top:txtIn.y,zIndex:20}}>
              <input autoFocus value={txtVal} onChange={function(e){setTxtVal(e.target.value);}} onKeyDown={function(e){if(e.key==="Enter")commitTxt();if(e.key==="Escape"){setTxtIn(null);setTxtVal("");}}} onBlur={commitTxt} style={{fontSize:18,fontWeight:800,color:penClr,background:"rgba(255,255,255,.85)",border:"2px solid #a0aa94",borderRadius:4,padding:"2px 6px",outline:"none",fontFamily:"inherit",minWidth:60}} placeholder={t("textPh")}/>
            </div>
          )}

          {items.length===0&&!drag&&!activeTpl && (
            <div style={{position:"absolute",top:"40%",left:"50%",transform:"translate(-50%,-50%)",textAlign:"center",pointerEvents:"none"}}>
              <svg width="80" height="80" viewBox="0 0 512 512" style={{borderRadius:18,margin:"0 auto 12px",display:"block",boxShadow:"0 4px 20px rgba(0,0,0,.15)"}}>
                <rect width="512" height="512" rx="100" fill="#2a2318"/>
                <circle cx="256" cy="258" r="138" fill="none" stroke="rgba(245,158,11,.3)" strokeWidth="3" strokeDasharray="9 8"/>
                <path d="M185 170 L256 355" fill="none" stroke="rgba(245,158,11,.25)" strokeWidth="4" strokeLinecap="round"/>
                <path d="M327 170 L256 355" fill="none" stroke="rgba(245,158,11,.25)" strokeWidth="4" strokeLinecap="round"/>
                <path d="M183 163 L329 163" fill="none" stroke="rgba(245,158,11,.25)" strokeWidth="4" strokeLinecap="round"/>
                <circle cx="180" cy="155" r="64" fill="#f59e0b"/><circle cx="180" cy="155" r="64" fill="none" stroke="#b45309" strokeWidth="5"/>
                <circle cx="158" cy="148" r="11" fill="#fff"/><circle cx="180" cy="148" r="11" fill="#fff"/><circle cx="202" cy="148" r="11" fill="#fff"/>
                <circle cx="332" cy="155" r="64" fill="#d97706"/><circle cx="332" cy="155" r="64" fill="none" stroke="#92400e" strokeWidth="5"/>
                <text x="332" y="175" textAnchor="middle" fontFamily="system-ui" fontSize="50" fontWeight="900" fill="#fff">{lang==="ku"?"sê":"üç"}</text>
                <circle cx="256" cy="362" r="64" fill="#16a34a"/><circle cx="256" cy="362" r="64" fill="none" stroke="#064e3b" strokeWidth="5"/>
                <text x="256" y="385" textAnchor="middle" fontFamily="system-ui" fontSize="58" fontWeight="900" fill="#fff">{"3"}</text>
              </svg>
              <div style={{fontSize:15,fontWeight:800,color:dk?"rgba(255,255,255,.35)":"rgba(60,50,30,.35)"}}>{t("hint")}</div>
            </div>
          )}

          {activeTpl && !instr && (
            <div style={{position:"absolute",top:8,left:8,zIndex:4,
              display:"flex",alignItems:"center",gap:6,
              padding:"4px 12px",borderRadius:10,
              background:dk?"rgba(0,0,0,.5)":"rgba(255,255,255,.75)",
              border:"1px solid "+(dk?"rgba(255,255,255,.15)":"rgba(0,0,0,.1)"),
              pointerEvents:"none"}}>
              <span style={{fontSize:14}}>{activeTpl.i}</span>
              <span style={{fontSize:11,fontWeight:800,color:dk?"#fff":"#3d3520"}}>
                {lang==="ku"&&activeTpl.k?activeTpl.k:activeTpl.n}
              </span>
              <span style={{fontSize:8,color:"#d97706"}}>{"★".repeat(activeTpl.diff||1)}</span>
            </div>
          )}

          {instr && (
            <div onClick={function(){setInstr(null);}} style={{position:"absolute",inset:0,zIndex:50,background:"rgba(0,0,0,.35)",display:"flex",alignItems:"center",justifyContent:"center"}}>
              <div onClick={function(e){e.stopPropagation();}} style={{background:"#fffdf7",borderRadius:16,padding:"24px 28px",maxWidth:420,boxShadow:"0 12px 40px rgba(0,0,0,.3)",textAlign:"center"}}>
                <div style={{fontSize:40,marginBottom:8}}>{instr.i}</div>
                <div style={{fontSize:18,fontWeight:900,marginBottom:4}}>{lang==="ku"&&instr.k?instr.k:instr.n}</div>
                <div style={{fontSize:13,marginBottom:16}}>{lang==="ku"&&instr.dk?instr.dk:instr.d}</div>
                <button onClick={function(){setInstr(null);}} style={{padding:"8px 28px",borderRadius:10,border:"none",background:"linear-gradient(135deg,#f59e0b,#78350f)",color:"#fff",fontSize:14,fontWeight:800,cursor:"pointer"}}>{t("start")+" ▸"}</button>
              </div>
            </div>
          )}

          {covered && (
            <div style={{position:"absolute",inset:0,zIndex:40,background:"rgba(60,40,20,.88)",display:"flex",alignItems:"center",justifyContent:"center",pointerEvents:"none"}}>
              <div style={{fontSize:48,opacity:0.3}}>{"🙈"}</div>
            </div>
          )}

          {items.filter(function(i){return !(drag&&drag.src==="c"&&drag.id===i.id);}).map(function(it){
            return (
              <div key={it.id}
                onPointerDown={function(e){setSelId(it.id);startDrag(e,it.id);}}
                onDoubleClick={function(){if(it.type==="rod"&&!it.flipped&&!counting)startCount(it.id);}}
                style={{position:"absolute",left:it.x,top:it.y,zIndex:it.type==="chip"?6:5,cursor:it.locked?"not-allowed":tool==="select"?"grab":"default",touchAction:"none",filter:"drop-shadow(0 2px 6px rgba(0,0,0,.2))",opacity:it.locked?0.85:1,outline:selId===it.id?"2px solid #3b82f6":"none",outlineOffset:2,borderRadius:4,transform:it.rot===90?"rotate(90deg)":undefined,transformOrigin:it.rot===90?RH/2+"px "+RH/2+"px":undefined}}>
                {rIt(it)}
                {counting&&counting.rid===it.id&&it.type==="rod"&&(it.rot||0)===0&&Array.from({length:Math.min(counting.step+1,it.value)},function(_,ci){
                  var isActive=ci===counting.step;
                  return <div key={ci} style={{position:"absolute",left:ci*CELL,top:0,width:CELL,height:RH,background:isActive?"rgba(34,197,94,.45)":"rgba(34,197,94,.12)",animation:isActive?"dsCount .6s ease infinite":"none",display:"flex",alignItems:"center",justifyContent:"center",pointerEvents:"none",borderRadius:isActive?4:0}}><span style={{fontSize:isActive?20:14,fontWeight:900,color:isActive?"#fff":"#15803d",textShadow:isActive?"0 1px 4px rgba(0,0,0,.3)":"none",transition:"all .15s"}}>{ci+1}</span></div>;
                })}
                {it.locked&&<div style={{position:"absolute",top:-6,left:-6,width:16,height:16,borderRadius:"50%",background:"rgba(0,0,0,.6)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:8,pointerEvents:"none"}}>{"🔒"}</div>}
                {it.type==="rod"&&selId===it.id&&tool==="select"&&!drag&&(
                  <>
                    <div onPointerDown={function(e){e.stopPropagation();e.preventDefault();}} onClick={function(){flipIt(it.id);}} style={{position:"absolute",top:-10,left:"50%",marginLeft:-10,width:20,height:20,borderRadius:"50%",background:it.flipped?"#333":"#fff",border:"2px solid "+P.brd,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:10,zIndex:12}}>{"🔄"}</div>
                    <div onPointerDown={function(e){e.stopPropagation();e.preventDefault();}} onClick={function(){rotIt(it.id);}} style={{position:"absolute",top:-10,right:-10,width:20,height:20,borderRadius:"50%",background:"#fff",border:"2px solid "+P.brd,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:10,zIndex:12}}>{"↻"}</div>
                    <div onPointerDown={function(e){e.stopPropagation();e.preventDefault();}} onClick={function(){lockIt(it.id);}} style={{position:"absolute",bottom:-10,left:"50%",marginLeft:-10,width:20,height:20,borderRadius:"50%",background:it.locked?"#ef4444":"#fff",border:"2px solid "+P.brd,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:9,zIndex:12}}>{it.locked?"🔓":"🔒"}</div>
                    {it.value>1&&!it.flipped&&(it.rot||0)===0&&Array.from({length:it.value-1},function(_,si){
                      return <div key={si} onPointerDown={function(e){e.stopPropagation();e.preventDefault();}} onClick={function(){splitRod(it.id,si+1);}} style={{position:"absolute",left:(si+1)*CELL-8,top:RH+2,width:16,height:16,borderRadius:"50%",background:"rgba(239,68,68,.85)",border:"2px solid #fff",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:9,color:"#fff",fontWeight:900,zIndex:12}}>{"✂"}</div>;
                    })}
                  </>
                )}
              </div>
            );
          })}

          {tool==="select"&&!drag&&adjP.map(function(p,i){
            return <div key={i} onClick={function(){mergeRods(p.l,p.r);}} style={{position:"absolute",left:p.mx-12,top:p.my-12,width:24,height:24,borderRadius:"50%",background:"linear-gradient(135deg,#22c55e,#15803d)",border:"2px solid #fff",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:14,color:"#fff",zIndex:15}}>{"⊕"}</div>;
          })}

          {drag&&<div style={{position:"absolute",left:dp.x,top:dp.y,zIndex:999,pointerEvents:"none",opacity:nearTrash?0.4:0.85,transform:"scale("+(nearTrash?0.7:1.03)+")"+(drag.rot===90?" rotate(90deg)":""),transformOrigin:drag.rot===90?RH/2+"px "+RH/2+"px":"center",transition:"opacity .15s,transform .15s"}}>{rIt(drag)}</div>}

          {drag&&<div style={{position:"absolute",bottom:0,left:0,right:0,height:56,background:nearTrash?"rgba(239,68,68,.25)":"rgba(0,0,0,.04)",borderTop:nearTrash?"2px solid rgba(239,68,68,.5)":"1px dashed rgba(0,0,0,.08)",display:"flex",alignItems:"center",justifyContent:"center",gap:6,pointerEvents:"none",zIndex:998}}><span style={{fontSize:18,opacity:nearTrash?1:0.3}}>{"🗑️"}</span><span style={{fontSize:10,fontWeight:700,color:nearTrash?"#dc2626":"rgba(0,0,0,.15)"}}>{nearTrash?t("trashY"):t("trashN")}</span></div>}

          {snapFX&&<div key={snapFX.t} style={{position:"absolute",left:snapFX.x-20,top:snapFX.y-20,width:40,height:40,borderRadius:"50%",border:"3px solid #22c55e",pointerEvents:"none",zIndex:50,animation:"dsSnap .5s ease-out forwards"}}/>}

          {showNL&&<div style={{position:"absolute",bottom:4,left:12,height:48,zIndex:2,pointerEvents:"none",background:dk?"rgba(0,0,0,.3)":"rgba(255,255,255,.6)",borderRadius:8,padding:"2px 8px"}}><div style={{fontSize:7,fontWeight:700,color:dk?"rgba(255,255,255,.4)":"rgba(60,40,20,.4)",textAlign:"center",marginBottom:1}}>{t("nlDesc")}</div><svg width={20*CELL+CELL} height={32} style={{overflow:"visible"}}><line x1={CELL/2} y1={14} x2={20*CELL+CELL/2} y2={14} stroke={dk?"rgba(255,255,255,.3)":"rgba(60,40,20,.3)"} strokeWidth={2}/>{Array.from({length:21},function(_,i){var x=i*CELL+CELL/2;var mj=i%5===0;return <g key={i}><line x1={x} y1={mj?4:8} x2={x} y2={mj?24:20} stroke={dk?"rgba(255,255,255,.35)":"rgba(60,40,20,.4)"} strokeWidth={mj?1.5:0.8}/><text x={x} y={32} textAnchor="middle" fontSize={mj?11:8} fontWeight={mj?800:600} fill={dk?"rgba(255,255,255,.5)":"rgba(60,40,20,.5)"}>{i}</text></g>;})}</svg></div>}

          <div style={{position:"absolute",bottom:6,right:10,fontSize:10,fontWeight:700,color:"rgba(60,60,40,.15)",pointerEvents:"none"}}>Prof. Dr. Yılmaz Mutlu</div>

          {feedback && (
            <div className={feedback==="no"?"ds-shake":"ds-slide"} style={{
              position:"absolute",top:activeTpl?48:20,left:"50%",
              transform:"translateX(-50%)",zIndex:60,
              padding:"14px 32px",borderRadius:16,
              fontWeight:800,fontSize:16,
              pointerEvents:"none",
              boxShadow:"0 8px 28px rgba(0,0,0,.25)",
              background:feedback==="ok"?"linear-gradient(135deg,#22c55e,#16a34a)":feedback==="no"?"linear-gradient(135deg,#f59e0b,#d97706)":"linear-gradient(135deg,#3b82f6,#1e40af)",
              color:"#fff"
            }}>
              {feedback==="ok" && ("✅ "+t("checkOk"))}
              {feedback==="no" && ("💡 "+t("checkNo"))}
              {feedback==="info" && ("ℹ️ "+t("checkNone"))}
            </div>
          )}
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="ds-bar" style={{height:48,minHeight:48,background:P.panel,borderTop:"2px solid "+P.brd,display:"flex",alignItems:"center",padding:"0 8px",gap:3}}>
        {/* Tools */}
        <div style={{display:"flex",gap:2,padding:"2px 4px",borderRadius:8,background:dk?"rgba(255,255,255,.05)":"rgba(0,0,0,.03)"}}>
          <button aria-label={t("sel")} onClick={function(){setTool("select");}} style={bs(tool==="select",{fontSize:11,padding:"4px 7px"})}>{"👆"}</button>
          <button aria-label={t("draw")} onClick={function(){setTool("pen");}} style={bs(tool==="pen",{fontSize:11,padding:"4px 7px"})}>{"✏"}</button>
          <button aria-label={t("write")} onClick={function(){setTool("text");}} style={bs(tool==="text",{fontSize:11,padding:"4px 7px"})}>{"T"}</button>
          <button aria-label={t("erase")} onClick={function(){setTool("eraser");}} style={bs(tool==="eraser",{fontSize:11,padding:"4px 7px"})}>{"🧹"}</button>
        </div>
        {(tool==="pen"||tool==="text")&&<div style={{display:"flex",gap:2}}>{["#1a1a1a","#dc2626","#2563eb","#16a34a","#d97706"].map(function(c){return <div key={c} onClick={function(){setPenClr(c);}} style={{width:16,height:16,borderRadius:"50%",background:c,cursor:"pointer",border:penClr===c?"2px solid #78350f":"2px solid transparent",transition:"all .1s"}}/>;})}</div>}
        <div style={{width:1,height:28,background:P.brd}}/>

        {/* Chips */}
        <div style={{display:"flex",gap:2,alignItems:"center"}}>
          <div onClick={function(){place({type:"chip",color:"blue",label:null});}} style={{cursor:"pointer"}}><Chip color="blue" size={CP}/></div>
          <div onClick={function(){place({type:"chip",color:"red",label:null});}} style={{cursor:"pointer"}}><Chip color="red" size={CP}/></div>
          <div style={{position:"relative"}}>
            <div onClick={function(){setNumPick(function(v){return !v;});}} style={{display:"flex",alignItems:"center",gap:3,padding:"3px 8px",borderRadius:12,cursor:"pointer",background:numPick?"#22c55e":P.bg,border:"1px solid "+(numPick?"#15803d":P.brd)}}>
              <Chip color="green" label="n" size={16}/><span style={{fontSize:9,fontWeight:800,color:numPick?"#fff":P.tx}}>{"0–20"}</span>
            </div>
            {numPick&&<div style={{position:"absolute",bottom:"100%",left:"50%",transform:"translateX(-50%)",marginBottom:6,padding:8,borderRadius:10,background:"#fff",border:"2px solid "+P.brd,boxShadow:"0 8px 24px rgba(0,0,0,.2)",display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:4,zIndex:1000}}>{Array.from({length:21},function(_,n){return <div key={n} onClick={function(){place({type:"chip",color:"green",label:String(n)});setNumPick(false);}} style={{cursor:"pointer"}}><Chip color="green" label={String(n)} size={30}/></div>;})}</div>}
          </div>
        </div>
        <div style={{width:1,height:28,background:P.brd}}/>

        {/* Operators */}
        <div style={{display:"flex",gap:2}}>
          {["+","−","×","÷","="].map(function(op,i){return <div key={i} onClick={function(){place({type:"chip",color:"yellow",label:op});}} style={{cursor:"pointer"}}><Chip color="yellow" label={op} size={CP}/></div>;})}
        </div>

        <div style={{flex:1}}/>

        {/* View options */}
        <div style={{display:"flex",gap:2,alignItems:"center"}}>
          {["none","square","dot","line"].map(function(g){return <button key={g} onClick={function(){setGridType(g);}} style={bs(gridType===g,{padding:"3px 5px",fontSize:9})}>{{"none":"—","square":"▦","dot":"⠿","line":"☰"}[g]}</button>;})}
          <div style={{width:1,height:20,background:P.brd}}/>
          {["#f0ead6","#ffffff","#d4e4f7","#2d2d2d"].map(function(c){return <div key={c} onClick={function(){setBgColor(c);}} style={{width:16,height:16,borderRadius:4,background:c,cursor:"pointer",border:bgColor===c?"2px solid #78350f":"1px solid "+(c==="#ffffff"?"#ccc":c),transition:"all .1s"}}/>;})
          }
          <div style={{width:1,height:20,background:P.brd}}/>
          <button aria-label="Tam ekran" onClick={function(){
            var el=document.documentElement;
            if(document.fullscreenElement) document.exitFullscreen();
            else el.requestFullscreen();
          }} style={bs(false,{fontSize:11,padding:"3px 7px"})}>{"⛶"}</button>
          <button aria-label={voiceOn?t("voiceOff"):t("voiceOn")} onClick={toggleVoice} style={bs(voiceOn,{fontSize:11,padding:"3px 7px",background:voiceOn?"#dc2626":P.bg,color:voiceOn?"#fff":P.tx,animation:voiceOn?"dsPulse 1.5s ease infinite":"none"})}>{"🎤"}</button>
          <button aria-label="Yardım" onClick={function(){setHelp(function(v){return !v;});}} style={bs(helpOpen,{fontSize:11,padding:"3px 7px"})}>{"?"}</button>
        </div>
      </div>

      {/* Help overlay */}
      {helpOpen && (
        <div onClick={function(){setHelp(false);}} style={{position:"fixed",inset:0,zIndex:9999,background:"rgba(0,0,0,.5)",display:"flex",alignItems:"center",justifyContent:"center"}}>
          <div onClick={function(e){e.stopPropagation();}} className="ds-pop" style={{background:"#fffdf7",borderRadius:20,padding:"28px 36px",maxWidth:480,boxShadow:"0 16px 48px rgba(0,0,0,.3)"}}>
            <div style={{fontSize:20,fontWeight:900,marginBottom:12,color:"#3d3520"}}>{"⌨ "+(lang==="ku"?"Kurtebirr":"Kısayollar")}</div>
            <div style={{display:"grid",gridTemplateColumns:"auto 1fr",gap:"6px 16px",fontSize:13}}>
              <kbd style={{background:"#e5e7eb",padding:"2px 8px",borderRadius:4,fontWeight:700}}>{"Ctrl+Z"}</kbd><span>{t("undo")}</span>
              <kbd style={{background:"#e5e7eb",padding:"2px 8px",borderRadius:4,fontWeight:700}}>{"Ctrl+Y"}</kbd><span>{t("redo")}</span>
              <kbd style={{background:"#e5e7eb",padding:"2px 8px",borderRadius:4,fontWeight:700}}>{"Delete"}</kbd><span>{lang==="ku"?"Jê bibe":"Sil"}</span>
              <kbd style={{background:"#e5e7eb",padding:"2px 8px",borderRadius:4,fontWeight:700}}>{"Alt+Sürükle"}</kbd><span>{lang==="ku"?"Kopî bike":"Kopyala"}</span>
              <kbd style={{background:"#e5e7eb",padding:"2px 8px",borderRadius:4,fontWeight:700}}>{"Çift tıkla"}</kbd><span>{lang==="ku"?"Bijmêre (TTS)":"Sesli say (TTS)"}</span>
            </div>
            <div style={{fontSize:14,fontWeight:500,margin:"12px 0 6px",color:"#d97706"}}>{"🎤 "+(lang==="ku"?"Fermanên dengî":"Sesli komutlar")}</div>
            <div style={{display:"grid",gridTemplateColumns:"auto 1fr",gap:"4px 12px",fontSize:12}}>
              <span style={{fontWeight:700,color:"#78350f"}}>{lang==="ku"?"\"çovika sê deyne\"":"\"üç çubuğu koy\""}</span><span>{lang==="ku"?"Çovikê 3an zêde dike":"3'lük çubuk ekler"}</span>
              <span style={{fontWeight:700,color:"#78350f"}}>{lang==="ku"?"\"dehan\"":"\"onluk kart\""}</span><span>{lang==="ku"?"Çarçoveya dehan zêde dike":"Onluk kart ekler"}</span>
              <span style={{fontWeight:700,color:"#78350f"}}>{lang==="ku"?"\"paqij bike\"":"\"temizle\""}</span><span>{lang==="ku"?"Hemû paqij dike":"Kanvası temizler"}</span>
              <span style={{fontWeight:700,color:"#78350f"}}>{lang==="ku"?"\"kontrol\"":"\"kontrol et\""}</span><span>{lang==="ku"?"Çalakiyê kontrol dike":"Etkinliği kontrol eder"}</span>
            </div>
            <div style={{fontSize:11,color:"#9ca3af",marginTop:12}}>{lang==="ku"?"Bo girtinê li her derê bitikîne":"Kapatmak için herhangi bir yere tıklayın"}</div>
          </div>
        </div>
      )}
    </div>
  );
}
