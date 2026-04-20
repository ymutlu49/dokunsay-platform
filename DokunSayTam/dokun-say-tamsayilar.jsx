import { useState, useRef, useEffect } from "react";
/* ═══ DokunSay Tam Sayılar — Kapsamlı ═══ */
var P={pos:"#22c55e",posB:"#15803d",neg:"#ef4444",negB:"#b91c1c",zero:"#8b5cf6",bg:"#f5f0e3",card:"#fffdf7",side:"#faf6ed",sideB:"#e5dcc8",accent:"#f59e0b",accentD:"#92400e",accentL:"rgba(245,158,11,.12)",border:"#1a1a1a",text:"#3d3520",red:"#ef4444",green:"#22c55e",blue:"#3b82f6"};
function speak(t){if(!window.speechSynthesis)return;window.speechSynthesis.cancel();var u=new SpeechSynthesisUtterance(t);u.lang="tr-TR";u.rate=0.85;window.speechSynthesis.speak(u);}
function Logo({s}){var z=s||50;return <svg width={z} height={z} viewBox="0 0 60 60"><circle cx={20} cy={30} r={16} fill={P.pos} stroke="#fff" strokeWidth={2}/><text x={20} y={31} textAnchor="middle" dominantBaseline="middle" fontSize={18} fontWeight={900} fill="#fff">{"+"}</text><circle cx={40} cy={30} r={16} fill={P.neg} stroke="#fff" strokeWidth={2}/><text x={40} y={31} textAnchor="middle" dominantBaseline="middle" fontSize={18} fontWeight={900} fill="#fff">{"−"}</text></svg>;}
/* Pul SVG */
function Chip({type,size,anim}){var r=size||20;var isP=type==="pos";return <svg width={r*2} height={r*2} style={anim?{animation:anim}:{}}><defs><radialGradient id={"cg_"+type+"_"+r}><stop offset="0%" stopColor={isP?"#4ade80":"#f87171"}/><stop offset="100%" stopColor={isP?P.pos:P.neg}/></radialGradient></defs><circle cx={r} cy={r} r={r-2} fill={"url(#cg_"+type+"_"+r+")"} stroke={isP?P.posB:P.negB} strokeWidth={2.5}/><text x={r} y={r+1} textAnchor="middle" dominantBaseline="middle" fontSize={r*1.1} fontWeight={900} fill="#fff">{isP?"+":"−"}</text></svg>;}
/* Yürüyen insan SVG — yön: "right"=sağ, "left"=sol, "idle"=dur */
function WalkingPerson({dir,x,color}){var flip=dir==="left"?-1:1;var walking=dir!=="idle";return <g transform={"translate("+x+",0)"} style={{transition:"transform .5s ease"}}><g transform={"scale("+flip+",1)"}>{/* Kafa */}<circle cx={0} cy={-38} r={8} fill={color||P.accent} stroke="#fff" strokeWidth={1.5}/>{/* Gövde */}<line x1={0} y1={-30} x2={0} y2={-12} stroke={color||P.accent} strokeWidth={3} strokeLinecap="round"/>{/* Kollar */}<line x1={0} y1={-24} x2={walking?-8:-6} y2={walking?-16:-20} stroke={color||P.accent} strokeWidth={2.5} strokeLinecap="round" style={walking?{animation:"walkArm .4s alternate infinite ease-in-out"}:{}}/><line x1={0} y1={-24} x2={walking?8:6} y2={walking?-16:-20} stroke={color||P.accent} strokeWidth={2.5} strokeLinecap="round" style={walking?{animation:"walkArm .4s alternate-reverse infinite ease-in-out"}:{}}/>{/* Bacaklar */}<line x1={0} y1={-12} x2={walking?-6:-4} y2={0} stroke={color||P.accent} strokeWidth={2.5} strokeLinecap="round" style={walking?{animation:"walkLeg .4s alternate infinite ease-in-out"}:{}}/><line x1={0} y1={-12} x2={walking?6:4} y2={0} stroke={color||P.accent} strokeWidth={2.5} strokeLinecap="round" style={walking?{animation:"walkLeg .4s alternate-reverse infinite ease-in-out"}:{}}/>{/* Yüz */}<circle cx={-2} cy={-40} r={1.2} fill="#fff"/><circle cx={3} cy={-40} r={1.2} fill="#fff"/><path d={dir==="idle"?"M-2,-36 Q0.5,-34 3,-36":"M-2,-36 Q0.5,-33 3,-36"} fill="none" stroke="#fff" strokeWidth={1} strokeLinecap="round"/></g></g>;}

/* ═══ VERİLER ═══ */
var ACTS=[
  {n:"Serbest Keşif",i:"🎨",cat:"keşif",diff:1,d:"Pulları ve sayı doğrusunu kullanarak tam sayıları keşfet!"},
  {n:"Pozitif Sayılar",i:"🟢",cat:"kavram",diff:1,d:"Yeşil (+) pulları kanvasa sürükle. +1, +2, +3 oluştur. Sıfırın sağında!"},
  {n:"Negatif Sayılar",i:"🔴",cat:"kavram",diff:1,d:"Kırmızı (−) pulları sürükle. −1, −2, −3 oluştur. Sıfırın solunda!"},
  {n:"Sıfır Çifti",i:"🟣",cat:"kavram",diff:1,d:"(+1)+(−1)=0. ⊕⊖ butonuyla sıfır çifti ekle, birbirini yok ettiğini gör!"},
  {n:"İki Pozitif Toplama",i:"➕",cat:"işlem",diff:1,d:"(+4)+(+2)=? Toplam alanına 4 yeşil, sonra 2 yeşil pul ekle."},
  {n:"İki Negatif Toplama",i:"➕",cat:"işlem",diff:2,d:"(−3)+(−2)=? 3 kırmızı + 2 kırmızı ekle. Sonuç: −5"},
  {n:"Pozitif + Negatif",i:"🔄",cat:"işlem",diff:2,d:"(+5)+(−3)=? Pulları ekle, sıfır çiftlerini eşleştir. Kalan = sonuç!"},
  {n:"İki Pozitif Çıkarma",i:"➖",cat:"işlem",diff:2,d:"(+7)−(+3)=? 7 yeşil koy, 3 tanesini sil."},
  {n:"Sıfır Çiftiyle Çıkarma",i:"➖",cat:"işlem",diff:3,d:"(+3)−(−2)=? Kırmızı pul yok! 2 sıfır çifti ekle, 2 kırmızıyı çıkar → +5"},
  {n:"Çarpma: Tekrarlı Toplam",i:"✖️",cat:"işlem",diff:3,d:"(+3)×(−2)=? 3 grup, her grupta 2 kırmızı. Toplam −6"},
  {n:"Bölme: Eşit Paylaşım",i:"➗",cat:"işlem",diff:3,d:"(−6)÷(+2)=? 6 kırmızıyı 2 gruba böl. Her grupta −3"},
  {n:"Karşılaştırma",i:"⚖️",cat:"karşılaştır",diff:2,d:"(−3) ile (+2)'yi karşılaştır. Sayı doğrusunda sağdaki büyüktür!"},
  {n:"Y1: Eksi × Eksi",i:"🔍",cat:"yanılgı",diff:3,d:"(−2)×(−3)=+6. İki negatifin çarpımı pozitiftir!"},
  {n:"Y2: Büyük sayı mı?",i:"🔍",cat:"yanılgı",diff:2,d:"−5 mi +2 mi büyük? Negatifler her zaman pozitiflerden küçüktür!"},
  {n:"Y3: Çıkarmada işaret",i:"🔍",cat:"yanılgı",diff:3,d:"(+3)−(−4)=+7. Negatif çıkarmak = pozitif eklemek!"},
  {n:"Y4: İşaret mi işlem mi?",i:"🔬",cat:"yanılgı",diff:2,d:"(−3)+5'te '−' sayının işareti (isim), '+' işlem (fiil). Farklı şeyler! Pullarla göster."},
  {n:"Y5: Mutlak değer yanılgısı",i:"🔬",cat:"yanılgı",diff:2,d:"|−7|>|3| ama −7<3! Sayı doğrusunda −7 solda, 3 sağda. Uzaklık ≠ büyüklük."},
  {n:"Y6: Çıkarma küçültür mü?",i:"🔬",cat:"yanılgı",diff:3,d:"3−(−4)=7. Çıkarma her zaman küçültmez! Negatif çıkarmak büyütür."},
  {n:"Y7: Sıfır nötr mü?",i:"🔬",cat:"yanılgı",diff:1,d:"Sıfır ne pozitif ne negatif! Sayı doğrusunda tam ortada. Sıfır çiftinin sonucudur: (+1)+(−1)=0"},
  {n:"Y8: Borç silmek = kazanç",i:"🔬",cat:"yanılgı",diff:3,d:"(−)×(−)=(+) neden? 3 borç silindi → 3 kazanç! Borç/alacak modeliyle dene."},
  {n:"Asansör Problemi",i:"🏢",cat:"senaryo",diff:1,d:"0. kattan başla. 3 kat yukarı çık (+3), sonra 5 kat aşağı in (−5). Kaçıncı kattasın? Dikey sayı doğrusunu kullan!"},
  {n:"Termometre",i:"🌡️",cat:"senaryo",diff:1,d:"Sabah sıcaklık +5°C. Gece 8°C düştü. Kaç derece? (+5)+(−8)=−3°C. Termometrede göster!"},
  {n:"Borç / Alacak",i:"💰",cat:"senaryo",diff:2,d:"Cüzdanında 10₺ var (+10). 15₺ borç aldın (−15). Toplam durumun: (+10)+(−15)=−5. Hâlâ borçlusun!"},
  {n:"Deniz Seviyesi",i:"🐟",cat:"senaryo",diff:1,d:"Deniz seviyesi = 0. Balık −5'te, kuş +4'te. Aralarındaki fark kaç birim? Dikey sayı doğrusunda bul!"},
];
var LESSONS=[{n:"1. Tam Sayı Kavramı",d:"Pozitif, negatif, sıfır",acts:[1,2,3]},{n:"2. Toplama",d:"Aynı ve farklı işaretli",acts:[4,5,6]},{n:"3. Çıkarma",d:"Sıfır çifti yöntemi",acts:[7,8]},{n:"4. Çarpma & Bölme",d:"Tekrarlı toplam, eşit paylaşım",acts:[9,10]},{n:"5. Gerçek Hayat",d:"Asansör, termometre, borç, deniz",acts:[20,21,22,23]},{n:"6. Kavram Yanılgıları",d:"Yaygın hatalar",acts:[12,13,14,15,16,17,18,19]}];
var QUIZ=[{q:"(+3)+(+5)=?",o:["+8","+2","−8","−2"],a:0},{q:"(−4)+(−3)=?",o:["−1","+7","−7","+1"],a:2},{q:"(+6)+(−4)=?",o:["+10","+2","−2","−10"],a:1},{q:"(−7)+(+7)=?",o:["+14","−14","0","+7"],a:2},{q:"(+5)−(+8)=?",o:["+3","−3","+13","−13"],a:1},{q:"(−3)−(−5)=?",o:["−8","+2","−2","+8"],a:1},{q:"(+4)×(−2)=?",o:["+8","−8","+6","−6"],a:1},{q:"(−3)×(−3)=?",o:["−9","+9","−6","+6"],a:1},{q:"(−12)÷(+4)=?",o:["+3","−3","+8","−8"],a:1},{q:"(+10)÷(−2)=?",o:["+5","−5","+8","−8"],a:1},{q:"(−1)+(−1)+(−1)=?",o:["−3","+3","0","−1"],a:0},{q:"(+8)+(−8)=?",o:["+16","−16","0","8"],a:2},{q:"(−2)−(+3)=?",o:["+1","−1","−5","+5"],a:2},{q:"0−(−4)=?",o:["−4","+4","0","4"],a:1},{q:"(−5)×(+0)=?",o:["−5","+5","0","5"],a:2}];
/* Senaryo soruları */
var SCENARIO_Q=[
  {q:"🏢 Asansör: 2. kattan 5 kat aşağı inerseniz kaçıncı kattasınız?",o:["+7","−3","+3","−7"],a:1,exp:"(+2)+(−5)=−3 → Bodrum 3. kat"},
  {q:"🌡️ Sabah +3°C. Gece 7°C düştü. Sıcaklık kaç?",o:["−4","−10","+4","+10"],a:0,exp:"(+3)+(−7)=−4°C"},
  {q:"💰 50₺ var, 80₺ harcadın. Durumun nedir?",o:["−30","−130","+30","+130"],a:0,exp:"(+50)+(−80)=−30₺ borç"},
  {q:"🐟 Balık −3m, kuş +5m. Aralarında kaç m?",o:["2","8","−2","−8"],a:1,exp:"|+5−(−3)|=|+5+3|=8 birim"},
  {q:"🏢 Bodrum 2'den (+4) kat çıktın. Kaçıncı kat?",o:["+6","+2","−6","−2"],a:1,exp:"(−2)+(+4)=+2 → 2. kat"},
  {q:"🌡️ −5°C. Güneş 12°C ısıttı. Kaç derece?",o:["+7","−17","−7","+17"],a:0,exp:"(−5)+(+12)=+7°C"},
];

export default function App(){
  /* Kanvas öğeleri */
  var _items=useState([]),items=_items[0],setItems=_items[1];
  var _poofs=useState([]),poofs=_poofs[0],setPoofs=_poofs[1]; /* Sıfır çifti poof animasyonları [{x,y,id}] */
  var nid=useRef(1);
  var GRID=48; /* Snap-to-grid boyutu */
  function snapGrid(v){return Math.round(v/GRID)*GRID;}
  function addItem(t,v,x,y){setItems(function(p){return p.concat([{id:nid.current++,t:t,v:v,x:snapGrid(x),y:snapGrid(y)}]);});}
  function moveItem(id,x,y){setItems(function(p){return p.map(function(it){return it.id===id?Object.assign({},it,{x:snapGrid(x),y:snapGrid(y)}):it;});});}
  function removeItem(id){setItems(function(p){return p.filter(function(it){return it.id!==id;});});}
  /* Sıfır çifti iptali — sürükleme bırakıldığında */
  var cancelLock=useRef(false);
  function checkZeroPair(droppedId){
    if(cancelLock.current)return;
    var dropped=items.find(function(it){return it.id===droppedId;});
    if(!dropped||(dropped.t!=="pos"&&dropped.t!=="neg"))return;
    var opposite=dropped.t==="pos"?"neg":"pos";
    var match=null;
    items.forEach(function(it){if(match)return;if(it.id!==droppedId&&it.t===opposite){
      var dx=dropped.x-it.x,dy=dropped.y-it.y,dist=Math.sqrt(dx*dx+dy*dy);
      if(dist<GRID*1.3)match=it;
    }});
    if(!match)return;
    cancelLock.current=true;
    var mx=(dropped.x+match.x)/2,my=(dropped.y+match.y)/2;
    setItems(function(prev){return prev.filter(function(it){return it.id!==droppedId&&it.id!==match.id;});});
    setPoofs([{x:mx,y:my,id:nid.current++}]);
    setTimeout(function(){setPoofs([]);cancelLock.current=false;},800);
  }
  /* İşlem tepsisi */
  var _trayA=useState([]),trayA=_trayA[0],setTrayA=_trayA[1]; /* Sol tepsi */
  var _trayB=useState([]),trayB=_trayB[0],setTrayB=_trayB[1]; /* Sağ tepsi */
  var _trayOp=useState("+"),trayOp=_trayOp[0],setTrayOp=_trayOp[1];
  var _showTray=useState(false),showTray=_showTray[0],setShowTray=_showTray[1];
  var _trayResult=useState(null),trayResult=_trayResult[0],setTrayResult=_trayResult[1];
  var _trayAnim=useState(null),trayAnim=_trayAnim[0],setTrayAnim=_trayAnim[1]; /* "solving" | "done" */
  /* Sayı doğrusu animasyonu */
  var _nlJumps=useState([]),nlJumps=_nlJumps[0],setNlJumps=_nlJumps[1]; /* [{from,to,step}] */
  var _nlPos=useState(null),nlPos=_nlPos[0],setNlPos=_nlPos[1]; /* Aktif konum */
  var _walkDir=useState("idle"),walkDir=_walkDir[0],setWalkDir=_walkDir[1];
  /* Panel sürükleme — 4 panel: nl, tm, tray, fab */
  var _nlXY=useState(null),nlXY=_nlXY[0],setNlXY=_nlXY[1];
  var _tmXY=useState(null),tmXY=_tmXY[0],setTmXY=_tmXY[1];
  var _trayXY=useState(null),trayXY=_trayXY[0],setTrayXY=_trayXY[1];
  var _fabXY=useState(null),fabXY=_fabXY[0],setFabXY=_fabXY[1];
  var _brXY=useState(null),brXY=_brXY[0],setBrXY=_brXY[1];
  var _panDrag=useState(null),panDrag=_panDrag[0],setPanDrag=_panDrag[1]; /* {which,offX,offY} */
  var _showTm=useState(false),showTm=_showTm[0],setShowTm=_showTm[1];
  var panSetters={nl:setNlXY,tm:setTmXY,tray:setTrayXY,fab:setFabXY,bridge:setBrXY};
  useEffect(function(){if(!panDrag)return;
    function onM(e){if(!cvRef.current)return;var cr=cvRef.current.getBoundingClientRect();var nx=(e.clientX-cr.left)/zoom-panDrag.offX;var ny=(e.clientY-cr.top)/zoom-panDrag.offY;panSetters[panDrag.which]({x:nx,y:ny});}
    function onU(){setPanDrag(null);}
    window.addEventListener("pointermove",onM);window.addEventListener("pointerup",onU);
    return function(){window.removeEventListener("pointermove",onM);window.removeEventListener("pointerup",onU);};
  });
  function startPanelDrag(which,e){e.preventDefault();e.stopPropagation();if(!cvRef.current)return;var cr=cvRef.current.getBoundingClientRect();var el=e.currentTarget.closest("[data-panel]");if(!el)return;var r=el.getBoundingClientRect();var ox=(r.left-cr.left)/zoom,oy=(r.top-cr.top)/zoom;var mx=(e.clientX-cr.left)/zoom,my=(e.clientY-cr.top)/zoom;setPanDrag({which:which,offX:mx-ox,offY:my-oy});var getter={nl:nlXY,tm:tmXY,tray:trayXY,fab:fabXY,bridge:brXY};if(!getter[which])panSetters[which]({x:ox,y:oy});}
  /* ★ Sayfa sistemi — ref ile anlık erişim */
  var _pages=useState([{id:1,label:"Sayfa 1"}]),pages=_pages[0],setPages=_pages[1];
  var _curPage=useState(1),curPage=_curPage[0],setCurPage=_curPage[1];
  var pageRef=useRef({}); /* {pageId:{items,strokes}} — anlık erişim */
  function switchPage(pid){
    pageRef.current[curPage]={items:items,strokes:strokes};
    setCurPage(pid);
    var saved=pageRef.current[pid];
    if(saved){setItems(saved.items||[]);setStrokes(saved.strokes||[]);}
    else{setItems([]);setStrokes([]);}
  }
  function addPage(){var nid2=pages.length>0?Math.max.apply(null,pages.map(function(p){return p.id;}))+1:1;setPages(function(p){return p.concat([{id:nid2,label:"Sayfa "+nid2}]);});switchPage(nid2);}
  function deletePage(pid){if(pages.length<=1)return;delete pageRef.current[pid];setPages(function(p){return p.filter(function(pg){return pg.id!==pid;});});if(curPage===pid){var remaining=pages.filter(function(pg){return pg.id!==pid;});if(remaining.length>0)switchPage(remaining[0].id);}}
  /* Fabrika */
  var _showFab=useState(false),showFab=_showFab[0],setShowFab=_showFab[1];
  var _fabPos=useState(0),fabPos=_fabPos[0],setFabPos=_fabPos[1];
  var _fabNeg=useState(0),fabNeg=_fabNeg[0],setFabNeg=_fabNeg[1];
  var _fabStep=useState(0),fabStep=_fabStep[0],setFabStep=_fabStep[1]; /* 0=yükle 1=karıştır 2=sonuç */
  var fabPairs=Math.min(fabPos,fabNeg);var fabResult=fabPos-fabNeg;
  /* UI */
  var _st=useState("mat"),sTab=_st[0],setSTab=_st[1];
  var _col=useState(false),col=_col[0],setCol=_col[1];
  var _atp=useState(null),aTpl=_atp[0],setATpl=_atp[1];
  var _ins=useState(null),insS=_ins[0],setInsS=_ins[1];
  var _abO=useState(false),abO=_abO[0],setAbO=_abO[1];
  var _hlO=useState(false),hlO=_hlO[0],setHlO=_hlO[1];
  var _tcO=useState(false),tcO=_tcO[0],setTcO=_tcO[1];
  var _comp=useState({}),comp=_comp[0],setComp=_comp[1];
  var _stuName=useState(""),stuName=_stuName[0],setStuName=_stuName[1];
  var _stuClass=useState(""),stuClass=_stuClass[0],setStuClass=_stuClass[1];
  var _tNotes=useState(""),tNotes=_tNotes[0],setTNotes=_tNotes[1];
  var _bgT=useState("plain"),bgT=_bgT[0],setBgT=_bgT[1];
  var _bgC=useState(P.bg),bgC=_bgC[0],setBgC=_bgC[1];
  var _zoom=useState(1),zoom=_zoom[0],setZoom=_zoom[1];
  var _game=useState(null),game=_game[0],setGame=_game[1];
  var _showNL=useState(true),showNL=_showNL[0],setShowNL=_showNL[1];
  var _showVert=useState(false),showVert=_showVert[0],setShowVert=_showVert[1]; /* Dikey sayı doğrusu (termometre/asansör) */
  var _sDr=useState(null),sDr=_sDr[0],setSDr=_sDr[1];
  var _sDp=useState({x:0,y:0}),sDp=_sDp[0],setSDp=_sDp[1];
  var _iDrag=useState(null),iDrag=_iDrag[0],setIDrag=_iDrag[1];
  var _dropH=useState(false),dropH=_dropH[0],setDropH=_dropH[1];
  var _overTrash=useState(false),overTrash=_overTrash[0],setOverTrash=_overTrash[1];
  var _tool=useState("select"),tool=_tool[0],setTool=_tool[1];
  var _penColor=useState("#1a1a1a"),penColor=_penColor[0],setPenColor=_penColor[1];
  var _penWidth=useState(3),penWidth=_penWidth[0],setPenWidth=_penWidth[1];
  var _eraserSize=useState(20),eraserSize=_eraserSize[0],setEraserSize=_eraserSize[1];
  var _penAlpha=useState(1),penAlpha=_penAlpha[0],setPenAlpha=_penAlpha[1]; /* 1=kalem, 0.35=vurgulayıcı */
  var _strokes=useState([]),strokes=_strokes[0],setStrokes=_strokes[1];
  var _undone=useState([]),undone=_undone[0],setUndone=_undone[1];
  var _drawing=useState(false),drawing=_drawing[0],setDrawing=_drawing[1];
  var drawRef=useRef(null),curStroke=useRef([]),cvRef=useRef(null),cursorRef=useRef(null);
  var canvasSized=useRef(false);
  useEffect(function(){if(window.innerWidth<768)setCol(true);},[]);

  /* Pul sayıları */
  var posCount=items.filter(function(i){return i.t==="pos";}).length;
  var negCount=items.filter(function(i){return i.t==="neg";}).length;
  var zeroPairs=Math.min(posCount,negCount);
  var netValue=posCount-negCount;

  /* İşlem tepsisi hesapla — sayı doğrusuna bağlı */
  var trayValA=trayA.filter(function(c){return c==="pos";}).length-trayA.filter(function(c){return c==="neg";}).length;
  var trayValB=trayB.filter(function(c){return c==="pos";}).length-trayB.filter(function(c){return c==="neg";}).length;
  function calcTray(){
    var r;var nlAdd=0;
    if(trayOp==="+"){r=trayValA+trayValB;nlAdd=trayValB;}
    else if(trayOp==="−"){r=trayValA-trayValB;nlAdd=-trayValB;}
    else if(trayOp==="×"){r=trayValA*trayValB;nlAdd=r-trayValA;}
    else{r=trayValB!==0?Math.round(trayValA/trayValB):0;nlAdd=r-trayValA;}
    setTrayAnim("solving");
    /* Sayı doğrusunda animasyon — toplama/çıkarma için */
    if(trayOp==="+"||trayOp==="−"){animateNL(trayValA,nlAdd);}
    setTimeout(function(){setTrayResult(r);setTrayAnim("done");},1200);
  }
  function resetTray(){setTrayA([]);setTrayB([]);setTrayResult(null);setTrayAnim(null);setNlJumps([]);setNlPos(null);setWalkDir("idle");}

  /* Sembolik ifade — kanvastaki pullardan otomatik oluştur */
  var symExpr="";
  if(posCount>0||negCount>0){
    var parts=[];
    if(posCount>0)parts.push("(+"+posCount+")");
    if(negCount>0)parts.push("(−"+negCount+")");
    symExpr=parts.join(" + ")+" = "+(netValue>=0?"+":"")+netValue;
  }

  /* Sayı doğrusunda animasyonlu hareket */
  function animateNL(start,add){
    if(add===0){setNlPos(start);setWalkDir("idle");return;}
    setNlJumps([]);setNlPos(start);setWalkDir(add>0?"right":"left");
    var jumps=[];var dir=add>0?1:-1;
    for(var i=0;i<Math.abs(add);i++){jumps.push({from:start+i*dir,to:start+(i+1)*dir,step:i+1});}
    var idx=0;function next(){if(idx>=jumps.length){setWalkDir("idle");return;}setNlJumps(function(p){return p.concat([jumps[idx]]);});setNlPos(jumps[idx].to);idx++;setTimeout(next,600);}
    next();
  }
  /* Manuel yürütme */
  function walkStep(dir){var d=dir==="right"?1:-1;setWalkDir(dir);
    setNlPos(function(p){var cur=p===null?0:p;var nxt=Math.max(-10,Math.min(10,cur+d));
      setNlJumps(function(j){return j.concat([{from:cur,to:nxt,step:j.length+1}]);});
      return nxt;});
    setTimeout(function(){setWalkDir("idle");},500);}
  function walkTo(target){
    setNlPos(function(cur){
      var c=cur===null?0:cur;if(target===c)return c;
      var d=target>c?1:-1;setWalkDir(d>0?"right":"left");
      setNlJumps([]);var jumps=[];for(var i=0;i<Math.abs(target-c);i++){jumps.push({from:c+i*d,to:c+(i+1)*d,step:i+1});}
      var idx=0;function next(){if(idx>=jumps.length){setWalkDir("idle");return;}setNlJumps(function(p){return p.concat([jumps[idx]]);});setNlPos(jumps[idx].to);idx++;setTimeout(next,500);}
      next();return c;});}

  /* Fabrika */
  function fabMix(){
    if(fabPos===0&&fabNeg===0)return;
    setFabStep(1);
    setTimeout(function(){setFabStep(2);},1200);
  }
  function fabSolve(){
    for(var i=0;i<fabPos;i++)addItem("pos",1,100+i*GRID,200);
    for(var j=0;j<fabNeg;j++)addItem("neg",1,100+j*GRID,260);
    if(showNL&&Math.abs(fabResult)<=10)animateNL(0,fabResult);
  }
  function fabReset(){setFabPos(0);setFabNeg(0);setFabStep(0);}

  /* Sürükleme */
  useEffect(function(){if(!sDr)return;
    function ck(ex,ey){if(!cvRef.current)return false;var r=cvRef.current.getBoundingClientRect();return ex>r.left-40&&ex<r.right+40&&ey>r.top-40&&ey<r.bottom+40;}
    function onM(e){if(e.buttons===0){setSDr(null);setDropH(false);return;}setSDp({x:e.clientX,y:e.clientY});setDropH(ck(e.clientX,e.clientY));}
    function onU(e){setDropH(false);
      if(cvRef.current&&ck(e.clientX,e.clientY)){
        var r=cvRef.current.getBoundingClientRect();var dx=(e.clientX-r.left)/zoom,dy=(e.clientY-r.top)/zoom;
        if(sDr.t==="tool"){
          if(sDr.v==="tray"){setShowTray(true);setTrayXY({x:dx-200,y:dy-40});}
          else if(sDr.v==="fab"){setShowFab(true);setFabXY({x:dx-130,y:dy-40});}
          else if(sDr.v==="tm"){setShowTm(true);setTmXY({x:dx-60,y:dy-80});}
          else if(sDr.v==="nl"){setShowNL(true);setNlXY({x:dx-200,y:dy-40});}
        }else{addItem(sDr.t,sDr.v,dx,dy);}
      }
      setSDr(null);}
    window.addEventListener("pointermove",onM);window.addEventListener("pointerup",onU);
    return function(){window.removeEventListener("pointermove",onM);window.removeEventListener("pointerup",onU);};});
  useEffect(function(){if(!iDrag){return;}
    function onM(e){if(e.buttons===0){setIDrag(null);return;}if(!cvRef.current)return;var r=cvRef.current.getBoundingClientRect();moveItem(iDrag.id,(e.clientX-r.left)/zoom-iDrag.offX,(e.clientY-r.top)/zoom-iDrag.offY);setOverTrash(e.clientY>r.bottom-50);}
    function onU(e){var id=iDrag.id;if(cvRef.current&&e.clientY>cvRef.current.getBoundingClientRect().bottom-50){removeItem(id);}else{checkZeroPair(id);}setIDrag(null);setOverTrash(false);}
    window.addEventListener("pointermove",onM);window.addEventListener("pointerup",onU);
    return function(){window.removeEventListener("pointermove",onM);window.removeEventListener("pointerup",onU);};});
  function stSD(t,v,e){e.preventDefault();setSDr({t:t,v:v});setSDp({x:e.clientX,y:e.clientY});}
  function startItemDrag(id,e){e.preventDefault();e.stopPropagation();var r=e.currentTarget.getBoundingClientRect();setIDrag({id:id,offX:(e.clientX-r.left)/zoom,offY:(e.clientY-r.top)/zoom});}
  function addChips(type,count){var startX=120,startY=100;var existing=items.filter(function(i){return i.t===type;}).length;for(var i=0;i<count;i++){var idx=existing+i;addItem(type,1,startX+(idx%8)*GRID,startY+Math.floor(idx/8)*GRID);}}
  function addZeroPair(){var y=100+Math.floor(items.length/6)*GRID;addItem("pos",1,120,y);addItem("neg",1,120+GRID*3,y);}
  function clearAll(){setItems([]);}

  /* Çizim — Canvas boyutlandırma ayrı, çizim ayrı */
  function sizeCanvas(){var cv=drawRef.current;if(!cv||!cvRef.current)return;var w=cvRef.current.clientWidth,h=cvRef.current.clientHeight;if(cv.width===w*2&&cv.height===h*2)return;cv.width=w*2;cv.height=h*2;cv.style.width=w+"px";cv.style.height=h+"px";canvasSized.current=true;}
  function renderStrokes(){var cv=drawRef.current;if(!cv)return;sizeCanvas();var ctx=cv.getContext("2d");ctx.clearRect(0,0,cv.width,cv.height);ctx.save();ctx.scale(2,2);ctx.lineCap="round";ctx.lineJoin="round";strokes.forEach(function(s){if(!s.points||s.points.length<2)return;ctx.beginPath();ctx.globalCompositeOperation=s.type==="eraser"?"destination-out":"source-over";ctx.globalAlpha=s.type==="eraser"?1:(s.alpha||1);ctx.strokeStyle=s.type==="eraser"?"rgba(0,0,0,1)":s.color;ctx.lineWidth=s.width;ctx.moveTo(s.points[0].x,s.points[0].y);for(var i=1;i<s.points.length-1;i++){var mx=(s.points[i].x+s.points[i+1].x)/2,my=(s.points[i].y+s.points[i+1].y)/2;ctx.quadraticCurveTo(s.points[i].x,s.points[i].y,mx,my);}ctx.lineTo(s.points[s.points.length-1].x,s.points[s.points.length-1].y);ctx.stroke();ctx.globalAlpha=1;ctx.globalCompositeOperation="source-over";});ctx.restore();}
  useEffect(function(){renderStrokes();},[strokes]);
  useEffect(function(){var obs=new ResizeObserver(function(){canvasSized.current=false;renderStrokes();});if(cvRef.current)obs.observe(cvRef.current);return function(){obs.disconnect();};},[]);
  function drawStart(e){if(tool==="select")return;sizeCanvas();var r=cvRef.current.getBoundingClientRect();curStroke.current=[{x:(e.clientX-r.left)/zoom,y:(e.clientY-r.top)/zoom}];setDrawing(true);}
  function drawMove(e){
    /* İmleç göstergesi — ref ile DOM direkt güncelle (re-render yok) */
    if(cursorRef.current){var cr=cvRef.current?cvRef.current.getBoundingClientRect():null;if(cr&&tool!=="select"){var sz=tool==="eraser"?eraserSize:Math.max(penWidth,6);cursorRef.current.style.display="block";cursorRef.current.style.left=(e.clientX-cr.left-sz/2)+"px";cursorRef.current.style.top=(e.clientY-cr.top-sz/2)+"px";cursorRef.current.style.width=sz+"px";cursorRef.current.style.height=sz+"px";cursorRef.current.style.borderColor=tool==="eraser"?"rgba(0,0,0,.3)":penColor;cursorRef.current.style.background=tool==="eraser"?"rgba(255,255,255,.3)":penAlpha<1?(penColor+"59"):"transparent";}else{cursorRef.current.style.display="none";}}
    if(!drawing)return;var r=cvRef.current.getBoundingClientRect();var p={x:(e.clientX-r.left)/zoom,y:(e.clientY-r.top)/zoom};curStroke.current.push(p);var cv=drawRef.current;if(!cv)return;var ctx=cv.getContext("2d");ctx.save();ctx.scale(2,2);ctx.globalCompositeOperation=tool==="eraser"?"destination-out":"source-over";ctx.globalAlpha=tool==="eraser"?1:penAlpha;ctx.beginPath();ctx.strokeStyle=tool==="eraser"?"rgba(0,0,0,1)":penColor;ctx.lineWidth=tool==="eraser"?eraserSize:penWidth;ctx.lineCap="round";var pts=curStroke.current;if(pts.length>=2){ctx.moveTo(pts[pts.length-2].x,pts[pts.length-2].y);ctx.lineTo(p.x,p.y);ctx.stroke();}ctx.restore();}
  function drawEnd(){if(!drawing)return;setDrawing(false);if(curStroke.current.length>1){setStrokes(function(p){return p.concat([{points:curStroke.current.slice(),color:penColor,width:tool==="eraser"?eraserSize:penWidth,type:tool,alpha:penAlpha}]);});setUndone([]);}curStroke.current=[];}
  function undo(){if(!strokes.length)return;var last=strokes[strokes.length-1];setUndone(function(u){return u.concat([last]);});setStrokes(function(p){return p.slice(0,-1);});}
  function redo(){if(!undone.length)return;var last=undone[undone.length-1];setStrokes(function(p){return p.concat([last]);});setUndone(function(u){return u.slice(0,-1);});}

  /* Oyunlar */
  function startQuiz(){var qi=Math.floor(Math.random()*QUIZ.length);setGame({mode:"quiz",score:0,total:0,feedback:null,rqi:qi});}
  function pickQuiz(idx){if(!game||game.feedback)return;var ok=idx===QUIZ[game.rqi].a;if(ok)speak("Doğru!");else speak("Tekrar dene.");setGame(Object.assign({},game,{feedback:ok?"correct":"wrong",score:game.score+(ok?1:0),total:game.total+1}));if(ok)setTimeout(function(){var qi2=Math.floor(Math.random()*QUIZ.length);setGame(Object.assign({},game,{rqi:qi2,feedback:null,score:game.score+1,total:game.total+1}));},1200);}
  function startCompare(){var a=Math.floor(Math.random()*11)-5,b;do{b=Math.floor(Math.random()*11)-5;}while(b===a);setGame({mode:"compare",score:0,total:0,feedback:null,a:a,b:b});}
  function pickCompare(op){if(!game||game.feedback)return;var ok=(op==="<"&&game.a<game.b)||(op===">"&&game.a>game.b)||(op==="="&&game.a===game.b);if(ok)speak("Doğru!");else speak("Tekrar dene.");setGame(Object.assign({},game,{feedback:ok?"correct":"wrong",score:game.score+(ok?1:0),total:game.total+1}));if(ok)setTimeout(function(){var a2=Math.floor(Math.random()*11)-5,b2;do{b2=Math.floor(Math.random()*11)-5;}while(b2===a2);setGame(Object.assign({},game,{a:a2,b:b2,feedback:null,score:game.score+1,total:game.total+1}));},1200);}
  /* Senaryo quiz */
  function startScenario(){var qi=Math.floor(Math.random()*SCENARIO_Q.length);setGame({mode:"scenario",score:0,total:0,feedback:null,rqi:qi});}
  function pickScenario(idx){if(!game||game.feedback)return;var ok=idx===SCENARIO_Q[game.rqi].a;if(ok)speak("Doğru! "+SCENARIO_Q[game.rqi].exp);else speak("Tekrar dene.");setGame(Object.assign({},game,{feedback:ok?"correct":"wrong",score:game.score+(ok?1:0),total:game.total+1}));if(ok)setTimeout(function(){var qi2=Math.floor(Math.random()*SCENARIO_Q.length);setGame(Object.assign({},game,{rqi:qi2,feedback:null,score:game.score+1,total:game.total+1}));},2000);}
  /* Asansör simülasyonu */
  var _elevator=useState(0),elevator=_elevator[0],setElevator=_elevator[1];
  var _elevAnim=useState(null),elevAnim=_elevAnim[0],setElevAnim=_elevAnim[1];
  function moveElevator(delta){var target=Math.max(-5,Math.min(5,elevator+delta));setElevAnim(delta>0?"up":"down");setTimeout(function(){setElevator(target);setElevAnim(null);},300);}
  /* Termometre */
  var _temp=useState(0),temp=_temp[0],setTemp=_temp[1];
  function changeTemp(delta){setTemp(function(t){return Math.max(-10,Math.min(10,t+delta));});}

  var cvBg={background:bgC};if(bgT==="grid"){cvBg.backgroundImage="linear-gradient(rgba(0,0,0,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(0,0,0,.04) 1px,transparent 1px)";cvBg.backgroundSize="24px 24px";}if(bgT==="dot"){cvBg.backgroundImage="radial-gradient(rgba(0,0,0,.08) 1px,transparent 1px)";cvBg.backgroundSize="20px 20px";}
  function Sw({on,onTap,icon,label,sub}){return <div onClick={onTap} style={{display:"flex",alignItems:"center",gap:6,padding:"4px 6px",marginBottom:2,borderRadius:6,cursor:"pointer",background:on?P.accentL:"transparent"}}><div style={{width:28,height:16,borderRadius:8,background:on?P.accent:"#ddd",position:"relative",transition:".2s",flexShrink:0}}><div style={{position:"absolute",top:2,left:on?14:2,width:12,height:12,borderRadius:"50%",background:"#fff",transition:".2s"}}/></div><span style={{fontSize:11}}>{icon}</span><div style={{flex:1}}><div style={{fontSize:9,fontWeight:700,color:P.text}}>{label}</div>{sub?<div style={{fontSize:7,color:"#aaa"}}>{sub}</div>:null}</div></div>;}

  /* Tepsi Pul Render */
  function TrayChips({chips,onAdd,onRemove,label}){
    var pCnt=chips.filter(function(c){return c==="pos";}).length;var nCnt=chips.filter(function(c){return c==="neg";}).length;var val=pCnt-nCnt;
    return <div style={{background:"linear-gradient(180deg,#3d8b8b,#2d6b6b)",borderRadius:16,padding:"10px",border:"2.5px solid rgba(255,255,255,.3)",minWidth:140,minHeight:100}}>
      <div style={{fontSize:8,fontWeight:800,color:"rgba(255,255,255,.6)",textTransform:"uppercase",letterSpacing:1,marginBottom:4}}>{label}</div>
      <div style={{display:"flex",flexWrap:"wrap",gap:4,minHeight:44,marginBottom:6}}>{chips.map(function(c,i){return <div key={i} onClick={function(){onRemove(i);}} style={{cursor:"pointer",animation:"popIn .3s"}}><Chip type={c} size={18}/></div>;})}</div>
      <div style={{display:"flex",gap:3}}><button onClick={function(){onAdd("pos");}} style={{flex:1,padding:"4px 0",borderRadius:6,border:"1.5px solid rgba(34,197,94,.4)",background:"rgba(34,197,94,.15)",cursor:"pointer",fontSize:9,fontWeight:800,color:"#4ade80",fontFamily:"inherit"}}>{"⊕"}</button><button onClick={function(){onAdd("neg");}} style={{flex:1,padding:"4px 0",borderRadius:6,border:"1.5px solid rgba(239,68,68,.4)",background:"rgba(239,68,68,.15)",cursor:"pointer",fontSize:9,fontWeight:800,color:"#f87171",fontFamily:"inherit"}}>{"⊖"}</button></div>
      <div style={{textAlign:"center",marginTop:4,fontSize:16,fontWeight:900,color:"#fff"}}>{val>=0?"+"+val:val}</div>
    </div>;}

  /* Öğe render */
  function renderItem(it){var key="it"+it.id;var chipR=16;
    if(it.t==="pos"||it.t==="neg"){var isP=it.t==="pos";return <div key={key} style={{position:"absolute",left:it.x-chipR,top:it.y-chipR,width:chipR*2,height:chipR*2,zIndex:2,cursor:"grab",touchAction:"none"}} onPointerDown={function(e){startItemDrag(it.id,e);}}><Chip type={it.t} size={chipR}/></div>;}
    if(it.t==="op"){return <div key={key} style={{position:"absolute",left:it.x-18,top:it.y-18,width:36,height:36,zIndex:2,cursor:"grab",touchAction:"none"}} onPointerDown={function(e){startItemDrag(it.id,e);}}><div style={{width:36,height:36,borderRadius:10,background:"#fff",border:"2.5px solid "+P.accent,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,fontWeight:900,color:P.accent,boxShadow:"0 2px 8px rgba(245,158,11,.15)"}}>{it.v}</div></div>;}
    if(it.t==="num"){return <div key={key} style={{position:"absolute",left:it.x-20,top:it.y-16,zIndex:2,cursor:"grab",touchAction:"none"}} onPointerDown={function(e){startItemDrag(it.id,e);}}><div style={{padding:"6px 14px",borderRadius:10,background:it.v>=0?"rgba(34,197,94,.1)":"rgba(239,68,68,.1)",border:"2px solid "+(it.v>=0?P.pos:P.neg),fontSize:20,fontWeight:900,color:it.v>=0?P.posB:P.negB,textAlign:"center",minWidth:40}}>{it.v>=0?"+"+it.v:it.v}</div></div>;}
    return null;}

  return(
    <div style={{display:"flex",flexDirection:"column",height:"100vh",overflow:"hidden",fontFamily:"'Nunito','Segoe UI',system-ui,sans-serif"}}>
      <style>{"@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@600;700;800;900&display=swap');*{box-sizing:border-box}@keyframes popIn{0%{transform:scale(.8);opacity:0}60%{transform:scale(1.04)}100%{transform:scale(1);opacity:1}}@keyframes fadeIn{0%{opacity:0}100%{opacity:1}}@keyframes pulse{0%,100%{opacity:.6;transform:scale(1)}50%{opacity:1;transform:scale(1.15)}}@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}@keyframes jumpArc{0%{transform:translateY(0)}50%{transform:translateY(-28px)}100%{transform:translateY(0)}}@keyframes zeroPoof{0%{transform:scale(1);opacity:1}50%{transform:scale(1.3);opacity:.5}100%{transform:scale(0);opacity:0}}@keyframes slideDown{0%{transform:translateY(-20px);opacity:0}100%{transform:translateY(0);opacity:1}}@keyframes walkArm{0%{transform:rotate(-20deg)}100%{transform:rotate(20deg)}}@keyframes walkLeg{0%{transform:rotate(-15deg)}100%{transform:rotate(15deg)}}button{font-family:'Nunito',system-ui,sans-serif;transition:transform .1s}button:active{transform:scale(.96)}"}</style>
      {/* HEADER */}
      <div style={{height:52,minHeight:52,background:"linear-gradient(135deg,#1a1a1a,#2d2520)",display:"flex",alignItems:"center",padding:"0 20px",gap:12,boxShadow:"0 4px 20px rgba(0,0,0,.2)"}}>
        <div style={{animation:"float 3s ease-in-out infinite"}}><Logo s={34}/></div>
        <span style={{fontSize:20,fontWeight:900,color:P.accent}}>{"DokunSay"}</span><span style={{fontSize:14,fontWeight:700,color:"rgba(255,255,255,.4)"}}>{"Tam Sayılar"}</span>
        <div style={{flex:1}}/>
        <div style={{display:"flex",gap:6,alignItems:"center",padding:"4px 14px",background:"rgba(255,255,255,.06)",borderRadius:10}}>
          <span style={{fontSize:12,fontWeight:800,color:"#4ade80"}}>{"⊕"+posCount}</span>
          <span style={{fontSize:12,fontWeight:800,color:"#f87171"}}>{"⊖"+negCount}</span>
          <span style={{fontSize:10,color:"rgba(255,255,255,.3)"}}>{"│"}</span>
          <span style={{fontSize:14,fontWeight:900,color:netValue>0?"#4ade80":netValue<0?"#f87171":P.accent}}>{netValue>0?"+"+netValue:netValue===0?"0":""+netValue}</span>
        </div>
        <div style={{display:"flex",gap:3,alignItems:"center",background:"rgba(255,255,255,.06)",borderRadius:8,padding:"4px 8px"}}><button onClick={function(){setZoom(function(z){return Math.max(0.5,+(z-0.1).toFixed(1));});}} style={{background:"none",border:"none",color:"rgba(255,255,255,.5)",cursor:"pointer",fontSize:14,fontWeight:900}}>{"−"}</button><span style={{fontSize:10,color:"rgba(255,255,255,.35)",minWidth:36,textAlign:"center"}}>{Math.round(zoom*100)+"%"}</span><button onClick={function(){setZoom(function(z){return Math.min(2,+(z+0.1).toFixed(1));});}} style={{background:"none",border:"none",color:"rgba(255,255,255,.5)",cursor:"pointer",fontSize:14,fontWeight:900}}>{"+"}</button></div>
      </div>
      <div style={{display:"flex",flex:1,overflow:"hidden"}}>
        {/* SIDEBAR */}
        <div style={{width:col?52:270,minWidth:col?52:270,background:"linear-gradient(180deg,"+P.side+",#f3ede0)",borderRight:"1px solid "+P.sideB,display:"flex",flexDirection:"column",transition:"width .25s",overflow:"hidden"}}>
          {!col?(<div style={{display:"flex",flexDirection:"column",flex:1,overflow:"hidden"}}>
            <div style={{padding:"10px 14px 6px",display:"flex",alignItems:"center",gap:8,borderBottom:"1px solid rgba(0,0,0,.05)"}}><Logo s={28}/><div style={{flex:1}}><div style={{fontSize:14,fontWeight:900,color:P.text}}>{"DokunSay Tam Sayılar"}</div></div><button onClick={function(){setCol(true);}} style={{background:"rgba(0,0,0,.04)",border:"none",cursor:"pointer",fontSize:14,color:"#bbb",width:28,height:28,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center"}}>{"◀"}</button></div>
            <div style={{display:"flex",padding:"6px 10px",gap:3,background:"rgba(0,0,0,.02)"}}>
              {[["📦","mat"],["📋","act"],["🎮","game"],["⚙️","feat"]].map(function(t){return <button key={t[1]} onClick={function(){setSTab(t[1]);}} style={{flex:1,padding:"7px 0",border:"none",borderRadius:8,background:sTab===t[1]?"#fff":"transparent",cursor:"pointer",fontSize:13,fontWeight:800,color:sTab===t[1]?P.text:"#aaa",fontFamily:"inherit",boxShadow:sTab===t[1]?"0 1px 4px rgba(0,0,0,.06)":"none"}}>{t[0]}</button>;})}
            </div>
            {sTab==="mat"?(<div style={{flex:1,overflowY:"auto",padding:"10px 12px",scrollbarWidth:"thin"}}>
              {/* Pozitif */}
              <div style={{background:"#fff",borderRadius:12,padding:"8px 10px",marginBottom:6,border:"1px solid rgba(0,0,0,.05)"}}>
                <div style={{fontSize:9,fontWeight:800,textTransform:"uppercase",letterSpacing:1,color:P.posB,marginBottom:5}}>{"⊕ Pozitif Pullar"}</div>
                <div style={{display:"flex",flexWrap:"wrap",gap:3}}>{[1,2,3].map(function(n){return <div key={n} style={{width:28,height:28,cursor:"grab",touchAction:"none",display:"flex",alignItems:"center",justifyContent:"center"}} onPointerDown={function(e){stSD("pos",1,e);}}><Chip type="pos" size={13}/></div>;})}</div>
                <div style={{display:"flex",gap:2,marginTop:5}}>{[1,3,5,10].map(function(n){return <button key={n} onClick={function(){addChips("pos",n);}} style={{flex:1,padding:"3px 0",borderRadius:5,border:"1px solid rgba(34,197,94,.2)",background:"rgba(34,197,94,.04)",cursor:"pointer",fontSize:8,fontWeight:700,color:P.posB,fontFamily:"inherit"}}>{"+"+n}</button>;})}</div>
              </div>
              {/* Negatif */}
              <div style={{background:"#fff",borderRadius:12,padding:"8px 10px",marginBottom:6,border:"1px solid rgba(0,0,0,.05)"}}>
                <div style={{fontSize:9,fontWeight:800,textTransform:"uppercase",letterSpacing:1,color:P.negB,marginBottom:5}}>{"⊖ Negatif Pullar"}</div>
                <div style={{display:"flex",flexWrap:"wrap",gap:3}}>{[1,2,3].map(function(n){return <div key={n} style={{width:28,height:28,cursor:"grab",touchAction:"none",display:"flex",alignItems:"center",justifyContent:"center"}} onPointerDown={function(e){stSD("neg",1,e);}}><Chip type="neg" size={13}/></div>;})}</div>
                <div style={{display:"flex",gap:2,marginTop:5}}>{[1,3,5,10].map(function(n){return <button key={n} onClick={function(){addChips("neg",n);}} style={{flex:1,padding:"3px 0",borderRadius:5,border:"1px solid rgba(239,68,68,.2)",background:"rgba(239,68,68,.04)",cursor:"pointer",fontSize:8,fontWeight:700,color:P.negB,fontFamily:"inherit"}}>{"-"+n}</button>;})}</div>
              </div>
              {/* Sıfır çifti */}
              <div style={{background:"#fff",borderRadius:12,padding:"8px 10px",marginBottom:6,border:"1px solid rgba(0,0,0,.05)"}}>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}><div style={{fontSize:9,fontWeight:800,textTransform:"uppercase",letterSpacing:1,color:"#6d28d9"}}>{"🟣 Sıfır Çifti"}</div><span style={{fontSize:8,color:"#aaa"}}>{"(+1)+(−1)=0"}</span></div>
                <button onClick={addZeroPair} style={{width:"100%",marginTop:4,padding:"5px 0",borderRadius:6,border:"1.5px solid rgba(139,92,246,.2)",background:"rgba(139,92,246,.04)",cursor:"pointer",fontSize:10,fontWeight:700,color:"#6d28d9",fontFamily:"inherit"}}>{"⊕⊖ Ekle"}</button>
              </div>
              {/* Araçlar — sürükle bırak */}
              <div style={{background:"#fff",borderRadius:12,padding:"8px 10px",marginBottom:6,border:"1px solid rgba(0,0,0,.05)"}}>
                <div style={{fontSize:9,fontWeight:800,textTransform:"uppercase",letterSpacing:1,color:P.accentD,marginBottom:4}}>{"🧮 Araçlar"}</div>
                <div style={{display:"flex",flexDirection:"column",gap:3}}>
                {showTray?<button onClick={function(){setShowTray(false);resetTray();}} style={{padding:"5px 8px",borderRadius:6,border:"1px solid rgba(245,158,11,.3)",background:P.accentL,cursor:"pointer",fontSize:10,fontWeight:700,color:P.accentD,fontFamily:"inherit",textAlign:"left"}}>{"✕ Tepsiyi Kapat"}</button>
                :<div onPointerDown={function(e){stSD("tool","tray",e);}} style={{padding:"5px 8px",borderRadius:6,border:"1px solid "+P.sideB,background:"#fff",cursor:"grab",fontSize:10,fontWeight:700,color:P.accentD,touchAction:"none",display:"flex",alignItems:"center",gap:6}}>{"🧮 İşlem Tepsisi"}<span style={{marginLeft:"auto",fontSize:8,color:"#ccc"}}>{"⋮⋮"}</span></div>}
                {showFab?<button onClick={function(){setShowFab(false);fabReset();}} style={{padding:"5px 8px",borderRadius:6,border:"1px solid rgba(124,58,237,.3)",background:"rgba(124,58,237,.06)",cursor:"pointer",fontSize:10,fontWeight:700,color:"#7c3aed",fontFamily:"inherit",textAlign:"left"}}>{"✕ Fabrikayı Kapat"}</button>
                :<div onPointerDown={function(e){stSD("tool","fab",e);}} style={{padding:"5px 8px",borderRadius:6,border:"1px solid rgba(0,0,0,.06)",background:"#fff",cursor:"grab",fontSize:10,fontWeight:700,color:"#7c3aed",touchAction:"none",display:"flex",alignItems:"center",gap:6}}>{"🏭 Tam-Say Fabrikası"}<span style={{marginLeft:"auto",fontSize:8,color:"#ccc"}}>{"⋮⋮"}</span></div>}
                {showTm?<button onClick={function(){setShowTm(false);setTemp(0);}} style={{padding:"5px 8px",borderRadius:6,border:"1px solid rgba(239,68,68,.3)",background:"rgba(239,68,68,.04)",cursor:"pointer",fontSize:10,fontWeight:700,color:P.negB,fontFamily:"inherit",textAlign:"left"}}>{"✕ Termometreyi Kapat"}</button>
                :<div onPointerDown={function(e){stSD("tool","tm",e);}} style={{padding:"5px 8px",borderRadius:6,border:"1px solid rgba(0,0,0,.06)",background:"#fff",cursor:"grab",fontSize:10,fontWeight:700,color:P.negB,touchAction:"none",display:"flex",alignItems:"center",gap:6}}>{"🌡️ Termometre"}<span style={{marginLeft:"auto",fontSize:8,color:"#ccc"}}>{"⋮⋮"}</span></div>}
                {showNL?<button onClick={function(){setShowNL(false);setNlXY(null);}} style={{padding:"5px 8px",borderRadius:6,border:"1px solid rgba(59,130,246,.3)",background:"rgba(59,130,246,.06)",cursor:"pointer",fontSize:10,fontWeight:700,color:P.blue,fontFamily:"inherit",textAlign:"left"}}>{"✕ Sayı Doğrusunu Kapat"}</button>
                :<div onPointerDown={function(e){stSD("tool","nl",e);}} style={{padding:"5px 8px",borderRadius:6,border:"1px solid rgba(0,0,0,.06)",background:"#fff",cursor:"grab",fontSize:10,fontWeight:700,color:P.blue,touchAction:"none",display:"flex",alignItems:"center",gap:6}}>{"📏 Sayı Doğrusu"}<span style={{marginLeft:"auto",fontSize:8,color:"#ccc"}}>{"⋮⋮"}</span></div>}
                </div>
              </div>
              {/* Sayı doğrusu kontrolleri */}
              {showNL?<div style={{background:"#fff",borderRadius:12,padding:"8px 10px",marginBottom:6,border:"1px solid rgba(59,130,246,.1)"}}>
                <div style={{display:"flex",gap:2,marginBottom:3}}>
                  <button onClick={function(){walkStep("left");}} style={{flex:1,padding:"4px 0",borderRadius:5,border:"1px solid rgba(239,68,68,.2)",background:"rgba(239,68,68,.04)",cursor:"pointer",fontSize:8,fontWeight:800,color:P.negB,fontFamily:"inherit"}}>{"◀ Sola"}</button>
                  <button onClick={function(){setNlPos(0);setNlJumps([]);setWalkDir("idle");}} style={{flex:1,padding:"4px 0",borderRadius:5,border:"1px solid rgba(139,92,246,.2)",background:"rgba(139,92,246,.04)",cursor:"pointer",fontSize:8,fontWeight:800,color:"#6d28d9",fontFamily:"inherit"}}>{"⊙"}</button>
                  <button onClick={function(){walkStep("right");}} style={{flex:1,padding:"4px 0",borderRadius:5,border:"1px solid rgba(34,197,94,.2)",background:"rgba(34,197,94,.04)",cursor:"pointer",fontSize:8,fontWeight:800,color:P.posB,fontFamily:"inherit"}}>{"Sağa ▶"}</button>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:2}}>
                  <button onClick={function(){animateNL(0,4);}} style={{padding:"3px 0",borderRadius:4,border:"1px solid rgba(34,197,94,.15)",background:"rgba(34,197,94,.03)",cursor:"pointer",fontSize:7,fontWeight:700,color:P.posB,fontFamily:"inherit"}}>{"0→+4"}</button>
                  <button onClick={function(){animateNL(0,-3);}} style={{padding:"3px 0",borderRadius:4,border:"1px solid rgba(239,68,68,.15)",background:"rgba(239,68,68,.03)",cursor:"pointer",fontSize:7,fontWeight:700,color:P.negB,fontFamily:"inherit"}}>{"0→−3"}</button>
                  <button onClick={function(){animateNL(3,-7);}} style={{padding:"3px 0",borderRadius:4,border:"1px solid rgba(139,92,246,.15)",background:"rgba(139,92,246,.03)",cursor:"pointer",fontSize:7,fontWeight:700,color:"#6d28d9",fontFamily:"inherit"}}>{"(+3)+(−7)"}</button>
                  <button onClick={function(){setNlJumps([]);setNlPos(null);setWalkDir("idle");}} style={{padding:"3px 0",borderRadius:4,border:"1px solid "+P.sideB,background:"#fff",cursor:"pointer",fontSize:7,fontWeight:700,color:"#999",fontFamily:"inherit"}}>{"🗑 Temizle"}</button>
                </div>
              </div>:null}
              {/* Kartlar */}
              <div style={{background:"#fff",borderRadius:12,padding:"8px 10px",marginBottom:6,border:"1px solid rgba(0,0,0,.05)"}}>
                <div style={{fontSize:9,fontWeight:800,textTransform:"uppercase",letterSpacing:1,color:P.accent,marginBottom:4}}>{"İşaret & Sayı Kartları"}</div>
                <div style={{display:"flex",flexWrap:"wrap",gap:2,marginBottom:4}}>{["+","−","×","÷","=","<",">"].map(function(op){return <div key={op} style={{width:26,height:26,borderRadius:6,background:"#fff",border:"1.5px solid "+P.sideB,display:"flex",alignItems:"center",justifyContent:"center",cursor:"grab",fontSize:13,fontWeight:900,color:P.accent,touchAction:"none"}} onPointerDown={function(e){stSD("op",op,e);}}>{op}</div>;})}</div>
                <div style={{display:"flex",flexWrap:"wrap",gap:2}}>{[-5,-4,-3,-2,-1,0,1,2,3,4,5].map(function(n){return <div key={n} style={{padding:"2px 4px",borderRadius:4,background:n>0?"rgba(34,197,94,.05)":n<0?"rgba(239,68,68,.05)":"rgba(139,92,246,.05)",border:"1px solid "+(n>0?P.pos:n<0?P.neg:"#8b5cf6"),cursor:"grab",fontSize:9,fontWeight:800,color:n>0?P.posB:n<0?P.negB:"#6d28d9",touchAction:"none",minWidth:22,textAlign:"center"}} onPointerDown={function(e){stSD("num",n,e);}}>{n>0?"+"+n:n}</div>;})}</div>
              </div>
              <div style={{display:"flex",gap:4}}><button onClick={function(){addChips("pos",3);addChips("neg",2);}} style={{flex:1,padding:"7px 0",borderRadius:8,border:"none",background:"linear-gradient(135deg,"+P.accent+","+P.accentD+")",color:"#fff",fontSize:10,fontWeight:800,cursor:"pointer",fontFamily:"inherit"}}>{"⚡ Örnek"}</button><button onClick={clearAll} style={{flex:1,padding:"7px 0",borderRadius:8,border:"1.5px solid "+P.sideB,background:"#fff",color:"#888",fontSize:10,fontWeight:800,cursor:"pointer",fontFamily:"inherit"}}>{"🗑 Temizle"}</button></div>
            </div>):sTab==="game"?(
            <div style={{flex:1,overflowY:"auto",padding:"10px 12px"}}>
              <div style={{background:game?"rgba(245,158,11,.04)":"#fff",borderRadius:14,padding:"12px",border:game?"1.5px solid rgba(245,158,11,.2)":"1px solid rgba(0,0,0,.05)"}}>
                {!game?(<div style={{display:"flex",flexDirection:"column",gap:4}}>
                  <div style={{fontSize:10,fontWeight:800,color:P.accentD,marginBottom:4}}>{"🎮 Oyunlar"}</div>
                  <button onClick={startQuiz} style={{padding:"8px 12px",borderRadius:8,border:"1.5px solid rgba(245,158,11,.15)",background:P.accentL,cursor:"pointer",fontSize:11,fontWeight:700,color:P.accentD,fontFamily:"inherit",textAlign:"left"}}>{"🧮 İşlem Quiz (15 Soru)"}</button>
                  <button onClick={startCompare} style={{padding:"8px 12px",borderRadius:8,border:"1.5px solid rgba(59,130,246,.15)",background:"rgba(59,130,246,.04)",cursor:"pointer",fontSize:11,fontWeight:700,color:P.blue,fontFamily:"inherit",textAlign:"left"}}>{"⚖️ Karşılaştır"}</button>
                  <button onClick={function(){setGame({mode:"zero",score:0,total:0,feedback:null,target:Math.floor(Math.random()*5)+1});}} style={{padding:"8px 12px",borderRadius:8,border:"1.5px solid rgba(139,92,246,.15)",background:"rgba(139,92,246,.04)",cursor:"pointer",fontSize:11,fontWeight:700,color:"#6d28d9",fontFamily:"inherit",textAlign:"left"}}>{"🟣 Sıfır Çifti Avı"}</button>
                  <button onClick={function(){var a=Math.floor(Math.random()*7)-3;var b=[-3,-2,-1,1,2,3][Math.floor(Math.random()*6)];setGame({mode:"numline",score:0,total:0,feedback:null,start:a,add:b,answer:a+b});}} style={{padding:"8px 12px",borderRadius:8,border:"1.5px solid rgba(34,197,94,.15)",background:"rgba(34,197,94,.04)",cursor:"pointer",fontSize:11,fontWeight:700,color:P.posB,fontFamily:"inherit",textAlign:"left"}}>{"📏 Sayı Doğrusunda Topla"}</button>
                  <div style={{height:1,background:"rgba(0,0,0,.06)",margin:"4px 0"}}/>
                  <div style={{fontSize:10,fontWeight:800,color:P.blue,marginBottom:4}}>{"🌍 Gerçek Hayat"}</div>
                  <button onClick={startScenario} style={{padding:"8px 12px",borderRadius:8,border:"1.5px solid rgba(59,130,246,.15)",background:"rgba(59,130,246,.04)",cursor:"pointer",fontSize:11,fontWeight:700,color:P.blue,fontFamily:"inherit",textAlign:"left"}}>{"🌍 Senaryo Soruları"}</button>
                </div>):(<div>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}><span style={{fontSize:14,fontWeight:900,color:P.accentD}}>{"🏆 "+game.score+"/"+game.total}</span><button onClick={function(){setGame(null);}} style={{padding:"3px 10px",borderRadius:6,border:"1px solid #ddd",background:"#fff",cursor:"pointer",fontSize:9,fontWeight:700,color:"#888",fontFamily:"inherit"}}>{"✕ Bitir"}</button></div>
                  {/* Quiz */}
                  {game.mode==="quiz"?<div><div style={{padding:"10px",borderRadius:10,background:"#fff",border:"1.5px solid rgba(245,158,11,.15)",textAlign:"center",marginBottom:6}}><div style={{fontSize:24,fontWeight:900,color:P.text}}>{QUIZ[game.rqi].q}</div></div><div style={{display:"flex",flexDirection:"column",gap:3}}>{QUIZ[game.rqi].o.map(function(c,ci){var isC=game.feedback&&ci===QUIZ[game.rqi].a;return <button key={ci} onClick={function(){pickQuiz(ci);}} disabled={!!game.feedback} style={{padding:"8px 12px",borderRadius:8,border:isC?"2px solid "+P.green:"1.5px solid rgba(0,0,0,.06)",background:isC?"rgba(34,197,94,.08)":"#fff",cursor:game.feedback?"default":"pointer",fontSize:14,fontWeight:700,color:isC?P.green:P.text,fontFamily:"inherit"}}>{c}{isC?" ✅":""}</button>;})}</div>{game.feedback==="wrong"?<div style={{marginTop:6,fontSize:11,color:P.red,textAlign:"center",fontWeight:700}}>{"❌ Tekrar dene!"}</div>:null}</div>:null}
                  {/* Compare */}
                  {game.mode==="compare"?<div><div style={{padding:"12px",borderRadius:10,background:"#fff",border:"1.5px solid rgba(0,0,0,.06)",textAlign:"center",marginBottom:6}}><div style={{fontSize:28,fontWeight:900,color:P.text}}>{(game.a>=0?"+":"")+game.a+" ? "+(game.b>=0?"+":"")+game.b}</div></div><div style={{display:"flex",gap:6}}>{["<","=",">"].map(function(op){return <button key={op} onClick={function(){pickCompare(op);}} disabled={!!game.feedback} style={{flex:1,padding:"12px 0",borderRadius:10,border:"2px solid "+P.sideB,background:"#fff",cursor:game.feedback?"default":"pointer",fontSize:24,fontWeight:900,color:P.accent,fontFamily:"inherit"}}>{op}</button>;})}</div>{game.feedback?<div style={{marginTop:6,padding:"6px",borderRadius:8,background:game.feedback==="correct"?"rgba(34,197,94,.1)":"rgba(239,68,68,.06)",textAlign:"center",fontSize:13,fontWeight:900,color:game.feedback==="correct"?P.green:P.red}}>{game.feedback==="correct"?"✅ Doğru!":"❌ Tekrar dene!"}</div>:null}</div>:null}
                  {/* Zero pair */}
                  {game.mode==="zero"?<div><div style={{padding:"10px",borderRadius:10,background:"#fff",textAlign:"center",marginBottom:6}}><div style={{fontSize:12,color:"#888"}}>{"Kanvasa "+game.target+" sıfır çifti ekle"}</div><div style={{fontSize:28,fontWeight:900,color:"#6d28d9"}}>{game.target+"× (⊕⊖)"}</div><div style={{fontSize:12,color:"#888",marginTop:4}}>{"Şu an: ⊕"+posCount+" ⊖"+negCount+" net="+netValue}</div></div>{netValue===0&&posCount===game.target?<div style={{padding:"8px",borderRadius:8,background:"rgba(34,197,94,.1)",textAlign:"center",fontSize:14,fontWeight:900,color:P.green}}>{"✅ Harika!"}</div>:null}</div>:null}
                  {/* Numline game */}
                  {game.mode==="numline"?<div><div style={{padding:"10px",borderRadius:10,background:"#fff",textAlign:"center",marginBottom:6}}><div style={{fontSize:14,fontWeight:900,color:P.text}}>{"("+(game.start>=0?"+":"")+game.start+") + ("+(game.add>=0?"+":"")+game.add+") = ?"}</div><div style={{fontSize:10,color:"#888",marginTop:4}}>{"Sayı doğrusunda animasyonu izle!"}</div></div><button onClick={function(){animateNL(game.start,game.add);}} style={{width:"100%",padding:"8px 0",borderRadius:8,border:"none",background:"linear-gradient(135deg,"+P.accent+","+P.accentD+")",color:"#fff",fontSize:12,fontWeight:800,cursor:"pointer",fontFamily:"inherit",marginBottom:6}}>{"▶ Animasyonu Başlat"}</button><div style={{display:"flex",gap:3}}>{[game.answer-1,game.answer,game.answer+1,game.answer+2].sort(function(){return Math.random()-0.5;}).map(function(v,vi){return <button key={vi} onClick={function(){if(game.feedback)return;var ok=v===game.answer;if(ok)speak("Doğru!");else speak("Yanlış.");setGame(Object.assign({},game,{feedback:ok?"correct":"wrong",score:game.score+(ok?1:0),total:game.total+1}));if(ok)setTimeout(function(){var a2=Math.floor(Math.random()*7)-3;var b2=[-3,-2,-1,1,2,3][Math.floor(Math.random()*6)];setGame(Object.assign({},game,{start:a2,add:b2,answer:a2+b2,feedback:null,score:game.score+1,total:game.total+1}));setNlJumps([]);setNlPos(null);},1500);}} disabled={!!game.feedback} style={{flex:1,padding:"8px 0",borderRadius:8,border:game.feedback&&v===game.answer?"2px solid "+P.green:"1.5px solid rgba(0,0,0,.06)",background:game.feedback&&v===game.answer?"rgba(34,197,94,.08)":"#fff",cursor:game.feedback?"default":"pointer",fontSize:14,fontWeight:800,color:P.text,fontFamily:"inherit"}}>{v>=0?"+"+v:""+v}</button>;})}</div></div>:null}
                  {/* Senaryo soruları */}
                  {game.mode==="scenario"?<div><div style={{padding:"10px",borderRadius:10,background:"#fff",border:"1.5px solid rgba(59,130,246,.15)",textAlign:"center",marginBottom:6}}><div style={{fontSize:13,fontWeight:800,color:P.text,lineHeight:1.5}}>{SCENARIO_Q[game.rqi].q}</div></div><div style={{display:"flex",flexDirection:"column",gap:3}}>{SCENARIO_Q[game.rqi].o.map(function(c,ci){var isC=game.feedback&&ci===SCENARIO_Q[game.rqi].a;return <button key={ci} onClick={function(){pickScenario(ci);}} disabled={!!game.feedback} style={{padding:"8px 12px",borderRadius:8,border:isC?"2px solid "+P.green:"1.5px solid rgba(0,0,0,.06)",background:isC?"rgba(34,197,94,.08)":"#fff",cursor:game.feedback?"default":"pointer",fontSize:14,fontWeight:700,color:isC?P.green:P.text,fontFamily:"inherit"}}>{c}{isC?" ✅":""}</button>;})}</div>{game.feedback==="correct"?<div style={{marginTop:6,padding:"6px 8px",borderRadius:8,background:"rgba(59,130,246,.06)",fontSize:10,color:P.blue,fontWeight:700,textAlign:"center"}}>{SCENARIO_Q[game.rqi].exp}</div>:game.feedback==="wrong"?<div style={{marginTop:6,fontSize:11,color:P.red,textAlign:"center",fontWeight:700}}>{"❌ Tekrar dene!"}</div>:null}</div>:null}
                </div>)}
              </div>
            </div>
            ):sTab==="feat"?(
            <div style={{flex:1,overflowY:"auto",padding:"10px 12px"}}>
              <div style={{background:"#fff",borderRadius:14,padding:"12px",marginBottom:8,border:"1px solid rgba(0,0,0,.05)"}}>
                <div style={{fontSize:10,fontWeight:800,textTransform:"uppercase",letterSpacing:1.5,color:"#555",marginBottom:8}}>{"Görünüm"}</div>
                <Sw on={showVert} onTap={function(){setShowVert(!showVert);}} icon="🏗️" label="Dikey sayı doğrusu" sub="Asansör / Deniz seviyesi"/>
              </div>
              {/* ★ Asansör Simülasyonu */}
              <div style={{background:"#fff",borderRadius:14,padding:"12px",marginBottom:8,border:"1px solid rgba(0,0,0,.05)"}}>
                <div style={{fontSize:10,fontWeight:800,textTransform:"uppercase",letterSpacing:1.5,color:P.blue,marginBottom:8}}>{"🏢 Asansör Simülasyonu"}</div>
                <div style={{display:"flex",gap:8,alignItems:"center"}}>
                  <div style={{width:60,background:"linear-gradient(180deg,#e0e7ff,#dbeafe)",borderRadius:10,padding:"4px",position:"relative",height:180}}>
                    {Array.from({length:11},function(_,i){var v=5-i;return <div key={v} style={{position:"absolute",top:4+i*16,left:0,right:0,height:16,display:"flex",alignItems:"center",justifyContent:"center",fontSize:8,fontWeight:v===0?900:600,color:v>0?P.posB:v<0?P.negB:P.accent,background:v===elevator?"rgba(245,158,11,.2)":"transparent",borderRadius:4,transition:"background .3s"}}>{v===0?"Giriş":v>0?"+"+v:v}</div>;})}
                    <div style={{position:"absolute",top:4+(5-elevator)*16,right:-4,width:8,height:16,background:P.accent,borderRadius:4,transition:"top .4s ease",boxShadow:"0 2px 8px rgba(245,158,11,.4)"}}/>
                  </div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:20,fontWeight:900,color:elevator>0?P.posB:elevator<0?P.negB:P.accent,textAlign:"center",marginBottom:8}}>{elevator===0?"Giriş Katı":(elevator>0?"+":"")+elevator+". Kat"}</div>
                    <div style={{display:"flex",gap:4,marginBottom:4}}>
                      <button onClick={function(){moveElevator(1);}} style={{flex:1,padding:"6px 0",borderRadius:6,border:"1px solid rgba(34,197,94,.2)",background:"rgba(34,197,94,.04)",cursor:"pointer",fontSize:10,fontWeight:800,color:P.posB,fontFamily:"inherit"}}>{"▲ Yukarı"}</button>
                      <button onClick={function(){moveElevator(-1);}} style={{flex:1,padding:"6px 0",borderRadius:6,border:"1px solid rgba(239,68,68,.2)",background:"rgba(239,68,68,.04)",cursor:"pointer",fontSize:10,fontWeight:800,color:P.negB,fontFamily:"inherit"}}>{"▼ Aşağı"}</button>
                    </div>
                    <div style={{display:"flex",gap:3}}>{[3,-5,2,-3].map(function(d){return <button key={d} onClick={function(){moveElevator(d);}} style={{flex:1,padding:"4px 0",borderRadius:5,border:"1px solid "+P.sideB,background:"#fff",cursor:"pointer",fontSize:8,fontWeight:700,color:d>0?P.posB:P.negB,fontFamily:"inherit"}}>{(d>0?"+":"")+d+" kat"}</button>;})}</div>
                    <button onClick={function(){setElevator(0);}} style={{width:"100%",padding:"4px 0",borderRadius:5,border:"1px solid "+P.sideB,background:"#fff",cursor:"pointer",fontSize:8,fontWeight:700,color:"#999",fontFamily:"inherit",marginTop:3}}>{"↺ Girişe dön"}</button>
                  </div>
                </div>
              </div>
              {/* ★ Termometre */}
              <div style={{background:"#fff",borderRadius:14,padding:"12px",marginBottom:8,border:"1px solid rgba(0,0,0,.05)"}}>
                <div style={{fontSize:10,fontWeight:800,textTransform:"uppercase",letterSpacing:1.5,color:P.red,marginBottom:8}}>{"🌡️ Termometre"}</div>
                <div style={{display:"flex",gap:8,alignItems:"center"}}>
                  <div style={{width:30,height:160,background:"linear-gradient(180deg,#fee2e2,#dbeafe)",borderRadius:15,position:"relative",border:"2px solid #ddd"}}>
                    <div style={{position:"absolute",bottom:0,left:0,right:0,height:Math.max(4,(temp+10)/20*160),background:temp>0?"linear-gradient(180deg,#ef4444,#f87171)":temp<0?"linear-gradient(180deg,#3b82f6,#60a5fa)":"linear-gradient(180deg,#8b5cf6,#a78bfa)",borderRadius:"0 0 13px 13px",transition:"height .4s ease"}}/>
                    <div style={{position:"absolute",bottom:Math.max(0,(temp+10)/20*160)-8,left:"50%",transform:"translateX(-50%)",fontSize:10,fontWeight:900,color:"#fff",textShadow:"0 1px 3px rgba(0,0,0,.4)"}}>{temp+"°"}</div>
                  </div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:28,fontWeight:900,color:temp>0?P.negB:temp<0?P.blue:P.accent,textAlign:"center",marginBottom:4}}>{(temp>0?"+":"")+temp+"°C"}</div>
                    <div style={{display:"flex",gap:4,marginBottom:4}}>
                      <button onClick={function(){changeTemp(1);}} style={{flex:1,padding:"6px 0",borderRadius:6,border:"1px solid rgba(239,68,68,.2)",background:"rgba(239,68,68,.04)",cursor:"pointer",fontSize:10,fontWeight:800,color:P.negB,fontFamily:"inherit"}}>{"🔥 +1°"}</button>
                      <button onClick={function(){changeTemp(-1);}} style={{flex:1,padding:"6px 0",borderRadius:6,border:"1px solid rgba(59,130,246,.2)",background:"rgba(59,130,246,.04)",cursor:"pointer",fontSize:10,fontWeight:800,color:P.blue,fontFamily:"inherit"}}>{"❄️ −1°"}</button>
                    </div>
                    <div style={{display:"flex",gap:3}}>{[5,-5,3,-8].map(function(d){return <button key={d} onClick={function(){changeTemp(d);}} style={{flex:1,padding:"4px 0",borderRadius:5,border:"1px solid "+P.sideB,background:"#fff",cursor:"pointer",fontSize:8,fontWeight:700,color:d>0?P.negB:P.blue,fontFamily:"inherit"}}>{(d>0?"+":"")+d+"°"}</button>;})}</div>
                    <button onClick={function(){setTemp(0);}} style={{width:"100%",padding:"4px 0",borderRadius:5,border:"1px solid "+P.sideB,background:"#fff",cursor:"pointer",fontSize:8,fontWeight:700,color:"#999",fontFamily:"inherit",marginTop:3}}>{"↺ Sıfırla"}</button>
                  </div>
                </div>
              </div>
            </div>
            ):sTab==="act"?(<div style={{flex:1,overflowY:"auto",padding:"8px 12px"}}>
              {["keşif","kavram","işlem","karşılaştır","senaryo","yanılgı"].map(function(cat){var acts=ACTS.filter(function(a){return a.cat===cat;});if(!acts.length)return null;return <div key={cat}><div style={{fontSize:8,fontWeight:800,textTransform:"uppercase",letterSpacing:1.5,color:cat==="yanılgı"?P.red:cat==="senaryo"?P.blue:"#999",margin:"8px 0 4px"}}>{cat==="keşif"?"Keşif":cat==="kavram"?"Kavram":cat==="işlem"?"İşlemler":cat==="karşılaştır"?"Karşılaştırma":cat==="senaryo"?"🌍 Gerçek Hayat":"🔍 Yanılgı"}</div>{acts.map(function(tp,i){var isA=aTpl&&aTpl.n===tp.n;return <button key={i} onClick={function(){setATpl(tp);setInsS(tp);}} style={{display:"flex",alignItems:"center",gap:5,padding:"5px 8px",width:"100%",background:isA?P.accentL:P.card,border:isA?"2px solid "+P.accent:"1px solid "+P.sideB,borderRadius:8,cursor:"pointer",fontFamily:"inherit",textAlign:"left",color:P.text,marginBottom:3,fontSize:10,fontWeight:isA?900:600}}><span style={{fontSize:14}}>{tp.i}</span><span style={{flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{tp.n}</span><span style={{fontSize:7,color:"#d97706"}}>{"\u2605".repeat(tp.diff)}</span></button>;})}</div>;})}
            </div>):null}
          </div>):(<div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:8,padding:"12px 0"}}>{["📦","📋","🎮","⚙️"].map(function(ic,ii){return <button key={ii} onClick={function(){setCol(false);setSTab(["mat","act","game","feat"][ii]);}} style={{padding:"8px 12px",borderRadius:8,border:"1px solid "+P.sideB,background:"#fff",cursor:"pointer",fontSize:18}}>{ic}</button>;})}</div>)}
        </div>
        {/* KANVAS */}
        <div ref={cvRef} style={Object.assign({flex:1,position:"relative",overflow:"auto"},cvBg)}>
          {/* Araç çubuğu — profesyonel */}
          <div style={{position:"absolute",top:10,left:"50%",transform:"translateX(-50%)",zIndex:30,display:"flex",gap:2,background:"rgba(255,255,255,.95)",backdropFilter:"blur(12px)",borderRadius:14,padding:"5px 6px",boxShadow:"0 4px 20px rgba(0,0,0,.08)",alignItems:"center"}}>
            {/* Araç seçimi */}
            {[["select","🖱️","Seç"],["pen","✏️","Kalem"],["highlighter","🖍️","Vurgula"],["eraser","🧹","Silgi"]].map(function(t){return <button key={t[0]} onClick={function(){setTool(t[0]);if(t[0]==="highlighter"){setPenAlpha(0.35);setPenWidth(12);}else if(t[0]==="pen"){setPenAlpha(1);setPenWidth(3);}}} title={t[2]} style={{width:34,height:34,borderRadius:8,border:(tool===t[0]||(tool==="highlighter"&&t[0]==="highlighter"))?"2px solid "+P.accent:"2px solid transparent",background:(tool===t[0]||(tool==="highlighter"&&t[0]==="highlighter"))?P.accentL:"transparent",cursor:"pointer",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center"}}>{t[1]}</button>;})}
            <div style={{width:1,height:22,background:"rgba(0,0,0,.08)",margin:"0 2px"}}/>
            {/* Renk paleti — kalem/vurgulayıcı modunda */}
            {(tool==="pen"||tool==="highlighter")?<div style={{display:"flex",gap:2,alignItems:"center"}}>
              {["#1a1a1a","#ef4444","#3b82f6","#22c55e","#f59e0b","#8b5cf6","#ec4899","#fff"].map(function(c){return <button key={c} onClick={function(){setPenColor(c);}} style={{width:16,height:16,borderRadius:"50%",background:c,border:penColor===c?"2.5px solid "+P.accent:c==="#fff"?"1.5px solid #ddd":"1.5px solid rgba(0,0,0,.08)",cursor:"pointer",boxShadow:penColor===c?"0 0 0 2px rgba(245,158,11,.3)":"none"}}/>;})}
              <div style={{width:1,height:22,background:"rgba(0,0,0,.08)",margin:"0 2px"}}/>
              {/* Kalınlık */}
              {[{w:2,l:"İnce"},{w:4,l:"Orta"},{w:8,l:"Kalın"}].map(function(s){return <button key={s.w} onClick={function(){setPenWidth(tool==="highlighter"?s.w*3:s.w);}} title={s.l} style={{width:28,height:28,borderRadius:6,border:(penWidth===s.w||(tool==="highlighter"&&penWidth===s.w*3))?"2px solid "+P.accent:"1.5px solid rgba(0,0,0,.06)",background:(penWidth===s.w||(tool==="highlighter"&&penWidth===s.w*3))?"rgba(245,158,11,.08)":"transparent",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><div style={{width:s.w+6,height:s.w+1,borderRadius:s.w,background:penColor}}/></button>;})}
            </div>:null}
            {/* Silgi boyutu */}
            {tool==="eraser"?<div style={{display:"flex",gap:2,alignItems:"center"}}>
              {[{s:12,l:"Küçük"},{s:24,l:"Orta"},{s:40,l:"Büyük"}].map(function(s){return <button key={s.s} onClick={function(){setEraserSize(s.s);}} title={s.l} style={{width:28,height:28,borderRadius:6,border:eraserSize===s.s?"2px solid "+P.accent:"1.5px solid rgba(0,0,0,.06)",background:eraserSize===s.s?"rgba(245,158,11,.08)":"transparent",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><div style={{width:s.s/2,height:s.s/2,borderRadius:"50%",border:"2px solid #999"}}/></button>;})}
            </div>:null}
            <div style={{width:1,height:22,background:"rgba(0,0,0,.08)",margin:"0 2px"}}/>
            <button onClick={undo} title="Geri al" style={{width:30,height:30,borderRadius:7,border:"none",background:"transparent",cursor:"pointer",fontSize:14,color:strokes.length?"#666":"#ddd"}}>{"↩"}</button>
            <button onClick={redo} title="Yinele" style={{width:30,height:30,borderRadius:7,border:"none",background:"transparent",cursor:"pointer",fontSize:14,color:undone.length?"#666":"#ddd"}}>{"↪"}</button>
            <button onClick={function(){setStrokes([]);}} title="Çizimleri sil" style={{width:30,height:30,borderRadius:7,border:"none",background:"transparent",cursor:"pointer",fontSize:13,color:"#bbb"}}>{"🗑"}</button>
          </div>
          {/* İmleç göstergesi — ref ile, re-render yok */}
          <div ref={cursorRef} style={{position:"absolute",display:"none",borderRadius:"50%",border:"2px solid #000",pointerEvents:"none",zIndex:26,transition:"width .1s,height .1s"}}/>
          <canvas ref={drawRef} style={{position:"absolute",inset:0,zIndex:tool!=="select"?25:0,pointerEvents:tool!=="select"?"auto":"none",cursor:tool!=="select"?"none":"default"}} onPointerDown={drawStart} onPointerMove={drawMove} onPointerUp={drawEnd} onPointerCancel={drawEnd} onPointerLeave={function(){if(cursorRef.current)cursorRef.current.style.display="none";}}/>
          {/* Zoom wrapper */}
          <div style={{position:"absolute",inset:0,transform:"scale("+zoom+")",transformOrigin:"0 0",width:(100/zoom)+"%",height:(100/zoom)+"%"}}>
          {/* ★ İşlem Tepsisi — Sürüklenebilir */}
          {showTray?<div data-panel="tray" style={trayXY?{position:"absolute",left:trayXY.x,top:trayXY.y,zIndex:6}:{position:"absolute",top:54,left:"50%",transform:"translateX(-50%)",zIndex:6,animation:"slideDown .3s"}}>
            <div onPointerDown={function(e){startPanelDrag("tray",e);}} style={{display:"flex",alignItems:"center",justifyContent:"center",gap:4,padding:"2px 0",cursor:"grab",userSelect:"none",touchAction:"none",marginBottom:2}}><div style={{width:30,height:4,borderRadius:2,background:"rgba(0,0,0,.1)"}}/><span style={{fontSize:7,color:"rgba(0,0,0,.15)"}}>{"sürükle"}</span><div style={{width:30,height:4,borderRadius:2,background:"rgba(0,0,0,.1)"}}/></div>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
            <TrayChips chips={trayA} onAdd={function(t){setTrayA(function(p){return p.concat([t]);});}} onRemove={function(i){setTrayA(function(p){return p.filter(function(_,j){return j!==i;});});}} label="Sol Tepsi"/>
            <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
              {["+","−","×","÷"].map(function(op){return <button key={op} onClick={function(){setTrayOp(op);}} style={{width:36,height:36,borderRadius:10,border:trayOp===op?"2.5px solid "+P.accent:"2px solid #ddd",background:trayOp===op?P.accentL:"#fff",cursor:"pointer",fontSize:18,fontWeight:900,color:trayOp===op?P.accentD:"#aaa"}}>{op}</button>;})}
            </div>
            <TrayChips chips={trayB} onAdd={function(t){setTrayB(function(p){return p.concat([t]);});}} onRemove={function(i){setTrayB(function(p){return p.filter(function(_,j){return j!==i;});});}} label="Sağ Tepsi"/>
            <div style={{fontSize:28,fontWeight:900,color:"#999"}}>{"→"}</div>
            <div style={{background:"linear-gradient(180deg,#3d8b8b,#2d6b6b)",borderRadius:16,padding:"12px 16px",border:"2.5px solid rgba(255,255,255,.3)",minWidth:90,textAlign:"center"}}>
              {trayResult!==null?<div><div style={{fontSize:28,fontWeight:900,color:"#fff",animation:"popIn .3s"}}>{trayResult>=0?"+"+trayResult:trayResult}</div><button onClick={resetTray} style={{marginTop:4,padding:"3px 10px",borderRadius:5,border:"1px solid rgba(255,255,255,.3)",background:"rgba(255,255,255,.1)",cursor:"pointer",fontSize:8,fontWeight:700,color:"rgba(255,255,255,.7)",fontFamily:"inherit"}}>{"↺ Sıfırla"}</button></div>:<button onClick={calcTray} style={{padding:"10px 16px",borderRadius:8,border:"none",background:P.accent,color:"#fff",fontSize:13,fontWeight:800,cursor:"pointer",fontFamily:"inherit"}}>{"= Hesapla"}</button>}
            </div>
            </div>
            <div style={{marginTop:6,background:"rgba(255,255,255,.92)",backdropFilter:"blur(8px)",borderRadius:10,padding:"6px 14px",display:"flex",alignItems:"center",justifyContent:"center",gap:8,border:"1.5px solid rgba(245,158,11,.15)"}}>
              <div style={{fontSize:8,fontWeight:800,color:P.accentD,textTransform:"uppercase",letterSpacing:1}}>{"Sembolik"}</div>
              <div style={{fontSize:16,fontWeight:900,color:P.text,fontFamily:"'Courier New',monospace"}}>{"("+(trayValA>=0?"+":"")+trayValA+") "+trayOp+" ("+(trayValB>=0?"+":"")+trayValB+")"+(trayResult!==null?" = "+(trayResult>=0?"+":"")+trayResult:"")}</div>
            </div>
          </div>:null}
          {/* ★ TAM-SAY FABRİKASI — 3 Aşamalı Pedagojik Tasarım */}
          {showFab?<div data-panel="fab" style={{position:"absolute",left:fabXY?fabXY.x:undefined,top:fabXY?fabXY.y:50,right:fabXY?undefined:16,zIndex:6,width:260,animation:"slideDown .4s"}}>
            <div style={{background:"linear-gradient(180deg,#1e1b4b,#312e81)",borderRadius:20,overflow:"hidden",boxShadow:"0 8px 32px rgba(30,27,75,.4)",border:"2px solid rgba(255,255,255,.1)"}}>
              {/* Başlık — sürükleme tutamacı */}
              <div onPointerDown={function(e){startPanelDrag("fab",e);}} style={{background:"linear-gradient(135deg,#a78bfa,#7c3aed)",padding:"8px 14px",display:"flex",alignItems:"center",justifyContent:"space-between",cursor:"grab",touchAction:"none",userSelect:"none"}}>
                <div style={{display:"flex",alignItems:"center",gap:6}}><span style={{fontSize:16}}>{"🏭"}</span><span style={{fontSize:12,fontWeight:900,color:"#fff",letterSpacing:1}}>{"TAM-SAY FABRİKASI"}</span></div>
                <button onClick={function(){setShowFab(false);fabReset();}} style={{background:"rgba(255,255,255,.15)",border:"none",color:"#fff",width:22,height:22,borderRadius:6,cursor:"pointer",fontSize:11,fontWeight:900}}>{"✕"}</button>
              </div>
              {/* Adım göstergesi */}
              <div style={{display:"flex",padding:"6px 14px",gap:4,background:"rgba(255,255,255,.05)"}}>
                {[["① Yükle",0],["② Karıştır",1],["③ Sonuç",2]].map(function(s){return <div key={s[1]} style={{flex:1,padding:"3px 0",borderRadius:6,background:fabStep===s[1]?"rgba(245,158,11,.2)":"rgba(255,255,255,.05)",textAlign:"center",fontSize:8,fontWeight:800,color:fabStep===s[1]?"#fbbf24":fabStep>s[1]?"rgba(255,255,255,.4)":"rgba(255,255,255,.15)",transition:"all .3s"}}>{s[0]}</div>;})}
              </div>
              {/* AŞAMA 1: YÜKLEME */}
              {fabStep===0?<div style={{padding:"10px 14px"}}>
                <div style={{display:"flex",gap:6}}>
                  {/* Sol hazne — Pozitif */}
                  <div style={{flex:1,background:"rgba(34,197,94,.08)",borderRadius:12,padding:"8px",border:"1.5px solid rgba(34,197,94,.2)"}}>
                    <div style={{fontSize:8,fontWeight:800,color:"#4ade80",textAlign:"center",marginBottom:4}}>{"⊕ POZİTİF"}</div>
                    <div style={{display:"flex",flexWrap:"wrap",justifyContent:"center",gap:3,minHeight:32}}>{Array.from({length:fabPos},function(_,i){return <div key={i} style={{animation:"popIn .2s",animationDelay:i*0.05+"s",animationFillMode:"both"}}><Chip type="pos" size={11}/></div>;})}</div>
                    <div style={{display:"flex",gap:3,marginTop:6}}>
                      <button onClick={function(){setFabPos(function(p){return Math.max(0,p-1);});}} style={{flex:1,padding:"4px 0",borderRadius:5,border:"none",background:"rgba(255,255,255,.06)",cursor:"pointer",fontSize:12,fontWeight:900,color:"rgba(255,255,255,.3)"}}>{"−"}</button>
                      <div style={{padding:"4px 10px",borderRadius:5,background:"rgba(34,197,94,.15)",fontSize:14,fontWeight:900,color:"#4ade80",textAlign:"center",minWidth:30}}>{fabPos}</div>
                      <button onClick={function(){setFabPos(function(p){return Math.min(10,p+1);});}} style={{flex:1,padding:"4px 0",borderRadius:5,border:"none",background:"rgba(34,197,94,.15)",cursor:"pointer",fontSize:12,fontWeight:900,color:"#4ade80"}}>{"+"}</button>
                    </div>
                  </div>
                  {/* Sağ hazne — Negatif */}
                  <div style={{flex:1,background:"rgba(239,68,68,.08)",borderRadius:12,padding:"8px",border:"1.5px solid rgba(239,68,68,.2)"}}>
                    <div style={{fontSize:8,fontWeight:800,color:"#f87171",textAlign:"center",marginBottom:4}}>{"⊖ NEGATİF"}</div>
                    <div style={{display:"flex",flexWrap:"wrap",justifyContent:"center",gap:3,minHeight:32}}>{Array.from({length:fabNeg},function(_,i){return <div key={i} style={{animation:"popIn .2s",animationDelay:i*0.05+"s",animationFillMode:"both"}}><Chip type="neg" size={11}/></div>;})}</div>
                    <div style={{display:"flex",gap:3,marginTop:6}}>
                      <button onClick={function(){setFabNeg(function(p){return Math.max(0,p-1);});}} style={{flex:1,padding:"4px 0",borderRadius:5,border:"none",background:"rgba(255,255,255,.06)",cursor:"pointer",fontSize:12,fontWeight:900,color:"rgba(255,255,255,.3)"}}>{"−"}</button>
                      <div style={{padding:"4px 10px",borderRadius:5,background:"rgba(239,68,68,.15)",fontSize:14,fontWeight:900,color:"#f87171",textAlign:"center",minWidth:30}}>{fabNeg}</div>
                      <button onClick={function(){setFabNeg(function(p){return Math.min(10,p+1);});}} style={{flex:1,padding:"4px 0",borderRadius:5,border:"none",background:"rgba(239,68,68,.15)",cursor:"pointer",fontSize:12,fontWeight:900,color:"#f87171"}}>{"+"}</button>
                    </div>
                  </div>
                </div>
                {/* Sembolik ifade */}
                <div style={{marginTop:8,padding:"5px 10px",borderRadius:8,background:"rgba(255,255,255,.06)",textAlign:"center"}}>
                  <span style={{fontSize:14,fontWeight:900,color:"#fff",fontFamily:"'Courier New',monospace"}}>{"(+"+ fabPos+") + (−"+fabNeg+") = ?"}</span>
                </div>
                <button onClick={fabMix} disabled={fabPos===0&&fabNeg===0} style={{width:"100%",marginTop:8,padding:"8px 0",borderRadius:10,border:"none",background:(fabPos===0&&fabNeg===0)?"rgba(255,255,255,.06)":"linear-gradient(135deg,#f59e0b,#d97706)",color:(fabPos===0&&fabNeg===0)?"rgba(255,255,255,.2)":"#fff",fontSize:12,fontWeight:800,cursor:(fabPos===0&&fabNeg===0)?"default":"pointer",fontFamily:"inherit"}}>{"⚙️ Karıştır →"}</button>
              </div>:null}
              {/* AŞAMA 2: KARIŞTIRMA ANİMASYONU */}
              {fabStep===1?<div style={{padding:"14px",textAlign:"center"}}>
                <div style={{fontSize:11,color:"rgba(255,255,255,.6)",marginBottom:10}}>{"Pullar karıştırılıyor..."}</div>
                <div style={{display:"flex",justifyContent:"center",gap:4,flexWrap:"wrap",marginBottom:8}}>
                  {Array.from({length:fabPos},function(_,i){return <div key={"mp"+i} style={{animation:"popIn .3s",animationDelay:i*0.1+"s",animationFillMode:"both"}}><Chip type="pos" size={11}/></div>;})}
                  {Array.from({length:fabNeg},function(_,i){return <div key={"mn"+i} style={{animation:"popIn .3s",animationDelay:(fabPos+i)*0.1+"s",animationFillMode:"both"}}><Chip type="neg" size={11}/></div>;})}
                </div>
                {fabPairs>0?<div style={{display:"flex",justifyContent:"center",gap:6,marginBottom:6}}>{Array.from({length:fabPairs},function(_,i){return <div key={"zp"+i} style={{display:"flex",alignItems:"center",gap:1,padding:"2px 6px",borderRadius:8,background:"rgba(139,92,246,.2)",animation:"zeroPoof .8s "+(.6+i*.15)+"s both"}}><Chip type="pos" size={8}/><Chip type="neg" size={8}/><span style={{fontSize:8,fontWeight:900,color:"#a78bfa"}}>{"=0"}</span></div>;})}</div>:null}
                <div style={{fontSize:9,color:"rgba(255,255,255,.4)"}}>{"Sıfır çiftleri eşleşiyor..."}</div>
              </div>:null}
              {/* AŞAMA 3: SONUÇ */}
              {fabStep===2?<div style={{padding:"14px"}}>
                {/* Kalan pullar */}
                <div style={{display:"flex",justifyContent:"center",gap:4,flexWrap:"wrap",marginBottom:8,minHeight:28}}>
                  {fabResult>0?Array.from({length:fabResult},function(_,i){return <div key={"rp"+i} style={{animation:"popIn .3s",animationDelay:i*0.1+"s",animationFillMode:"both"}}><Chip type="pos" size={12}/></div>;}):null}
                  {fabResult<0?Array.from({length:Math.abs(fabResult)},function(_,i){return <div key={"rn"+i} style={{animation:"popIn .3s",animationDelay:i*0.1+"s",animationFillMode:"both"}}><Chip type="neg" size={12}/></div>;}):null}
                  {fabResult===0?<div style={{animation:"popIn .3s",padding:"4px 12px",borderRadius:8,background:"rgba(139,92,246,.15)"}}><span style={{fontSize:14,fontWeight:900,color:"#a78bfa"}}>{"= 0 (Tümü eşleşti!)"}</span></div>:null}
                </div>
                {fabPairs>0?<div style={{fontSize:9,color:"rgba(139,92,246,.6)",textAlign:"center",marginBottom:4}}>{fabPairs+" sıfır çifti birbirini yok etti"}</div>:null}
                {/* Sonuç kutusu */}
                <div style={{background:"rgba(255,255,255,.08)",borderRadius:12,padding:"10px",textAlign:"center",marginBottom:8}}>
                  <div style={{fontSize:9,color:"rgba(255,255,255,.4)",marginBottom:2}}>{"Sonuç"}</div>
                  <div style={{fontSize:28,fontWeight:900,color:fabResult>0?"#4ade80":fabResult<0?"#f87171":"#a78bfa"}}>{fabResult>0?"+"+fabResult:fabResult===0?"0":""+fabResult}</div>
                  <div style={{fontSize:12,fontWeight:900,color:"rgba(255,255,255,.7)",fontFamily:"'Courier New',monospace",marginTop:4}}>{"(+"+fabPos+") + (−"+fabNeg+") = "+(fabResult>=0?"+":"")+fabResult}</div>
                </div>
                <div style={{display:"flex",gap:4}}>
                  <button onClick={function(){fabSolve();}} style={{flex:1,padding:"7px 0",borderRadius:8,border:"none",background:"linear-gradient(135deg,#f59e0b,#d97706)",color:"#fff",fontSize:11,fontWeight:800,cursor:"pointer",fontFamily:"inherit"}}>{"📥 Kanvasa Aktar"}</button>
                  <button onClick={fabReset} style={{flex:1,padding:"7px 0",borderRadius:8,border:"1px solid rgba(255,255,255,.15)",background:"rgba(255,255,255,.06)",color:"rgba(255,255,255,.5)",fontSize:11,fontWeight:800,cursor:"pointer",fontFamily:"inherit"}}>{"↺ Yeniden"}</button>
                </div>
              </div>:null}
            </div>
          </div>:null}
          {/* ★ Dikey Sayı Doğrusu (Termometre/Asansör/Deniz) */}
          {showVert?<div style={{position:"absolute",right:20,top:54,bottom:90,zIndex:1,width:60}}>
            <svg width={60} height="100%" viewBox="0 0 60 440" preserveAspectRatio="xMidYMid meet">
              {Array.from({length:11},function(_,i){var v=5-i;var y=20+i*40;return <g key={v}><line x1={20} y1={y} x2={50} y2={y} stroke={P.border} strokeWidth={v===0?2.5:1}/><text x={14} y={y+4} textAnchor="end" fontSize={v===0?13:10} fontWeight={v===0?900:700} fill={v>0?P.posB:v<0?P.negB:P.accent}>{v>0?"+"+v:v}</text>{v===0?<><line x1={0} y1={y} x2={60} y2={y} stroke={P.blue} strokeWidth={2} strokeDasharray="4,3"/><text x={56} y={y-4} fontSize={7} fill={P.blue} textAnchor="end">{"Deniz"}</text></>:null}</g>;})}
              <line x1={35} y1={16} x2={35} y2={424} stroke={P.border} strokeWidth={2}/>
              <text x={30} y={12} textAnchor="middle" fontSize={8} fontWeight={700} fill={P.posB}>{"+"}</text>
              <text x={30} y={434} textAnchor="middle" fontSize={8} fontWeight={700} fill={P.negB}>{"−"}</text>
            </svg>
          </div>:null}
          {/* ★ BÜYÜK Sayı Doğrusu + Yürüyen İnsan — Sürüklenebilir */}
          {showNL?<div data-panel="nl" style={{position:"absolute",left:nlXY?nlXY.x:20,top:nlXY?nlXY.y:undefined,bottom:nlXY?undefined:20,right:nlXY?undefined:(showVert?80:20),zIndex:3,width:nlXY?"70%":undefined}}>
            {/* Sürükleme tutamacı */}
            <div onPointerDown={function(e){startPanelDrag("nl",e);}} style={{display:"flex",alignItems:"center",justifyContent:"center",gap:6,padding:"3px 0",cursor:"grab",userSelect:"none",touchAction:"none"}}>
              <div style={{width:40,height:5,borderRadius:3,background:"rgba(0,0,0,.12)"}}/>
              <span style={{fontSize:8,fontWeight:700,color:"rgba(0,0,0,.2)"}}>{"📏 sürükle"}</span>
              <div style={{width:40,height:5,borderRadius:3,background:"rgba(0,0,0,.12)"}}/>
              {nlXY?<button onClick={function(e){e.stopPropagation();setNlXY(null);}} style={{position:"absolute",right:4,top:2,background:"none",border:"none",cursor:"pointer",fontSize:10,color:"#bbb"}}>{"↩"}</button>:null}
            </div>
            <div style={{background:"rgba(255,255,255,.85)",backdropFilter:"blur(8px)",borderRadius:16,padding:"8px 4px 4px",boxShadow:"0 4px 24px rgba(0,0,0,.08)",border:"1.5px solid rgba(0,0,0,.06)"}}>
            <svg width="100%" height={160} viewBox="0 0 840 160" preserveAspectRatio="xMidYMid meet">
              {/* Arka plan renk bölgeleri */}
              <rect x={20} y={70} width={400} height={40} rx={4} fill="rgba(239,68,68,.04)"/>
              <rect x={420} y={70} width={400} height={40} rx={4} fill="rgba(34,197,94,.04)"/>
              {/* Ana çizgi */}
              <line x1={20} y1={90} x2={820} y2={90} stroke={P.border} strokeWidth={3}/>
              <polygon points="815,84 828,90 815,96" fill={P.border}/>
              <polygon points="25,84 12,90 25,96" fill={P.border}/>
              {/* Tick marks ve sayılar */}
              {Array.from({length:21},function(_,i){var v=i-10;var x=20+(i/20)*800;var isZero=v===0;return <g key={v} style={{cursor:"pointer"}} onClick={function(){animateNL(nlPos===null?0:nlPos,v-(nlPos===null?0:nlPos));}}>
                <rect x={x-18} y={68} width={36} height={70} fill="transparent"/>
                <line x1={x} y1={isZero?72:78} x2={x} y2={isZero?108:102} stroke={isZero?P.accent:P.border} strokeWidth={isZero?4:v%5===0?2.5:1.5}/>
                <text x={x} y={122} textAnchor="middle" fontSize={isZero?16:v%5===0?14:11} fontWeight={isZero?900:700} fill={v>0?P.posB:v<0?P.negB:P.accent}>{v>0?"+"+v:""+v}</text>
                {isZero?<text x={x} y={136} textAnchor="middle" fontSize={8} fontWeight={700} fill={P.accent}>{"SIFIR"}</text>:null}
              </g>;})}
              {/* Yön etiketleri */}
              <g>
                <rect x={24} y={56} width={80} height={18} rx={9} fill={P.neg}/>
                <text x={64} y={68} textAnchor="middle" fontSize={10} fontWeight={800} fill="#fff">{"◀ Negatif"}</text>
              </g>
              <g>
                <rect x={736} y={56} width={80} height={18} rx={9} fill={P.pos}/>
                <text x={776} y={68} textAnchor="middle" fontSize={10} fontWeight={800} fill="#fff">{"Pozitif ▶"}</text>
              </g>
              {/* ★ Yürüyen İnsan — y=88 → ayaklar çizgi üzerinde, kafa görünür */}
              <g transform="translate(0,88)">
              {nlPos!==null?<WalkingPerson dir={walkDir} x={20+((nlPos+10)/20)*800} color={nlPos>0?P.pos:nlPos<0?P.neg:P.accent}/>:null}
              {nlPos===null?<WalkingPerson dir="idle" x={420} color="#ccc"/>:null}
              </g>
              {/* Konum etiketi */}
              {nlPos!==null?<g>{(function(){var x=20+((nlPos+10)/20)*800;return <><rect x={x-24} y={10} width={48} height={24} rx={12} fill={nlPos>0?P.pos:nlPos<0?P.neg:P.accent}/><text x={x} y={26} textAnchor="middle" fontSize={14} fontWeight={900} fill="#fff">{nlPos>=0?"+"+nlPos:""+nlPos}</text></>;})()}</g>:null}
              {/* Animasyonlu atlamalar */}
              {nlJumps.map(function(j,ji){var x1=20+((j.from+10)/20)*800;var x2=20+((j.to+10)/20)*800;var mx=(x1+x2)/2;var d=j.to>j.from?1:-1;return <g key={ji} style={{animation:"fadeIn .3s",animationDelay:ji*0.3+"s",animationFillMode:"both"}}>
                <path d={"M"+x1+",86 Q"+mx+",48 "+x2+",86"} fill="none" stroke={d>0?P.pos:P.neg} strokeWidth={2.5} strokeDasharray="6,3"/>
                <polygon points={(x2-5*d)+",80 "+x2+",86 "+(x2-5*d)+",92"} fill={d>0?P.pos:P.neg}/>
                <circle cx={mx} cy={52} r={12} fill={d>0?P.pos:P.neg} stroke="#fff" strokeWidth={1.5}/>
                <text x={mx} y={56} textAnchor="middle" fontSize={11} fontWeight={900} fill="#fff">{j.step}</text>
              </g>;})}
            </svg>
            </div>
          </div>:null}
          {/* ★ Sürüklenebilir Termometre */}
          {showTm?<div data-panel="tm" style={{position:"absolute",left:tmXY?tmXY.x:undefined,top:tmXY?tmXY.y:60,right:tmXY?undefined:20,zIndex:5,width:120}}>
            <div onPointerDown={function(e){startPanelDrag("tm",e);}} style={{display:"flex",alignItems:"center",justifyContent:"center",gap:4,padding:"2px 0",cursor:"grab",userSelect:"none",touchAction:"none"}}><div style={{width:24,height:4,borderRadius:2,background:"rgba(0,0,0,.12)"}}/><span style={{fontSize:7,fontWeight:700,color:"rgba(0,0,0,.15)"}}>{"sürükle"}</span><div style={{width:24,height:4,borderRadius:2,background:"rgba(0,0,0,.12)"}}/>{tmXY?<button onClick={function(e){e.stopPropagation();setTmXY(null);}} style={{background:"none",border:"none",cursor:"pointer",fontSize:8,color:"#bbb"}}>{"↩"}</button>:null}</div>
            <div style={{background:"rgba(255,255,255,.92)",backdropFilter:"blur(8px)",borderRadius:14,padding:"10px",boxShadow:"0 4px 20px rgba(0,0,0,.08)",border:"1.5px solid rgba(0,0,0,.06)"}}>
              <div style={{display:"flex",gap:6,alignItems:"center"}}>
                <div style={{width:28,height:140,background:"linear-gradient(180deg,#fee2e2,#dbeafe)",borderRadius:14,position:"relative",border:"2px solid #ddd",flexShrink:0}}>
                  <div style={{position:"absolute",bottom:0,left:0,right:0,height:Math.max(4,(temp+10)/20*140),background:temp>0?"linear-gradient(180deg,#ef4444,#f87171)":temp<0?"linear-gradient(180deg,#3b82f6,#60a5fa)":"linear-gradient(180deg,#8b5cf6,#a78bfa)",borderRadius:"0 0 12px 12px",transition:"height .4s ease"}}/>
                </div>
                <div style={{flex:1}}>
                  <div style={{fontSize:22,fontWeight:900,color:temp>0?P.negB:temp<0?P.blue:P.accent,textAlign:"center",marginBottom:4}}>{(temp>0?"+":"")+temp+"°C"}</div>
                  <div style={{display:"flex",gap:3,marginBottom:3}}><button onClick={function(){changeTemp(1);}} style={{flex:1,padding:"4px 0",borderRadius:5,border:"1px solid rgba(239,68,68,.2)",background:"rgba(239,68,68,.04)",cursor:"pointer",fontSize:9,fontWeight:800,color:P.negB,fontFamily:"inherit"}}>{"🔥"}</button><button onClick={function(){changeTemp(-1);}} style={{flex:1,padding:"4px 0",borderRadius:5,border:"1px solid rgba(59,130,246,.2)",background:"rgba(59,130,246,.04)",cursor:"pointer",fontSize:9,fontWeight:800,color:P.blue,fontFamily:"inherit"}}>{"❄️"}</button></div>
                  <button onClick={function(){setTemp(0);}} style={{width:"100%",padding:"3px 0",borderRadius:4,border:"1px solid "+P.sideB,background:"#fff",cursor:"pointer",fontSize:7,fontWeight:700,color:"#999",fontFamily:"inherit"}}>{"↺ 0°C"}</button>
                </div>
              </div>
            </div>
          </div>:null}
          {items.length>0?<div data-panel="bridge" style={{position:"absolute",top:brXY?brXY.y:56,left:brXY?brXY.x:undefined,right:brXY?undefined:(showFab?270:16),zIndex:4,borderRadius:14,background:"rgba(255,255,255,.92)",backdropFilter:"blur(10px)",border:"1.5px solid rgba(0,0,0,.08)",boxShadow:"0 4px 20px rgba(0,0,0,.06)",overflow:"hidden",width:180}}>
            <div onPointerDown={function(e){startPanelDrag("bridge",e);}} style={{display:"flex",alignItems:"center",justifyContent:"center",gap:4,padding:"3px 0",cursor:"grab",userSelect:"none",touchAction:"none",borderBottom:"1px solid rgba(0,0,0,.04)"}}><div style={{width:24,height:3,borderRadius:2,background:"rgba(0,0,0,.1)"}}/></div>
            {/* Somut temsil */}
            <div style={{padding:"8px 12px",borderBottom:"1px solid rgba(0,0,0,.05)"}}>
              <div style={{fontSize:8,fontWeight:800,textTransform:"uppercase",letterSpacing:1,color:"#888",marginBottom:4}}>{"Somut Temsil"}</div>
              <div style={{display:"flex",alignItems:"center",gap:6}}>
                <div style={{display:"flex",alignItems:"center",gap:2}}><Chip type="pos" size={10}/><span style={{fontSize:12,fontWeight:900,color:P.posB}}>{"×"+posCount}</span></div>
                <span style={{fontSize:10,color:"#ccc"}}>{"+"}</span>
                <div style={{display:"flex",alignItems:"center",gap:2}}><Chip type="neg" size={10}/><span style={{fontSize:12,fontWeight:900,color:P.negB}}>{"×"+negCount}</span></div>
              </div>
              {zeroPairs>0?<div style={{display:"flex",alignItems:"center",gap:4,marginTop:3}}><div style={{display:"flex"}}><Chip type="pos" size={7}/><Chip type="neg" size={7}/></div><span style={{fontSize:8,color:"#6d28d9",fontWeight:700}}>{zeroPairs+" sıfır çifti"}</span></div>:null}
            </div>
            {/* Sembolik ifade */}
            <div style={{padding:"6px 12px",background:"rgba(245,158,11,.04)",borderBottom:"1px solid rgba(0,0,0,.05)"}}>
              <div style={{fontSize:8,fontWeight:800,textTransform:"uppercase",letterSpacing:1,color:P.accentD,marginBottom:2}}>{"Sembolik İfade"}</div>
              <div style={{fontSize:13,fontWeight:900,color:P.text,fontFamily:"'Courier New',monospace"}}>{symExpr}</div>
            </div>
            {/* Sonuç + Sayı doğrusunda göster */}
            <div style={{padding:"6px 12px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <div><div style={{fontSize:8,color:"#888",fontWeight:700}}>{"Sonuç"}</div><div style={{fontSize:24,fontWeight:900,color:netValue>0?P.posB:netValue<0?P.negB:"#6d28d9"}}>{netValue>0?"+"+netValue:netValue===0?"0":""+netValue}</div></div>
              {Math.abs(netValue)<=10?<button onClick={function(){animateNL(0,netValue);}} style={{padding:"4px 8px",borderRadius:6,border:"1px solid rgba(59,130,246,.2)",background:"rgba(59,130,246,.04)",cursor:"pointer",fontSize:8,fontWeight:700,color:P.blue,fontFamily:"inherit"}}>{"📏 Doğruda Göster"}</button>:null}
            </div>
          </div>:null}
          {/* Oyun göstergesi */}
          {game?<div style={{position:"absolute",top:56,left:16,zIndex:4,padding:"6px 14px",borderRadius:10,background:"rgba(245,158,11,.1)",border:"1.5px solid rgba(245,158,11,.2)"}}><span style={{fontSize:14,fontWeight:900,color:P.accentD}}>{"🏆 "+game.score}</span>{game.feedback==="correct"?<span style={{marginLeft:8,fontSize:18,animation:"popIn .3s"}}>{"🎉"}</span>:null}</div>:null}
          {sDr&&dropH?<div style={{position:"absolute",inset:0,zIndex:0,border:"3px dashed rgba(245,158,11,.4)",borderRadius:4,pointerEvents:"none"}}><div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",background:P.accentL,padding:"8px 20px",borderRadius:12}}><span style={{fontSize:13,fontWeight:800,color:"rgba(245,158,11,.6)"}}>{"📥 Buraya bırak"}</span></div></div>:null}
          {items.length===0&&!showTray&&!showFab&&!showNL&&!showTm&&strokes.length===0?<div style={{position:"absolute",top:"35%",left:"50%",transform:"translate(-50%,-50%)",textAlign:"center",pointerEvents:"none",animation:"fadeIn .6s"}}><div style={{fontSize:44,marginBottom:8,animation:"float 4s ease-in-out infinite"}}>{"⊕ ⊖"}</div><div style={{fontSize:16,fontWeight:800,color:"rgba(60,50,30,.12)"}}>{"Pulları sürükleyerek tam sayıları keşfet!"}</div></div>:null}
          {items.map(function(it){return renderItem(it);})}
          {/* ★ Sıfır çifti poof animasyonları */}
          {poofs.map(function(pf){return <div key={"pf"+pf.id} style={{position:"absolute",left:pf.x-30,top:pf.y-30,width:60,height:60,zIndex:10,pointerEvents:"none",animation:"zeroPoof .8s forwards"}}><svg width={60} height={60}><circle cx={30} cy={30} r={24} fill="rgba(139,92,246,.3)" stroke="#8b5cf6" strokeWidth={2}/><text x={30} y={35} textAnchor="middle" fontSize={20} fontWeight={900} fill="#6d28d9">{"0"}</text></svg></div>;})}
          </div>{/* zoom end */}
          {/* Silme alanı — her zaman görünür */}
          <div style={{position:"absolute",bottom:0,left:0,right:0,height:44,display:"flex",alignItems:"center",justifyContent:"center",gap:8,background:overTrash?"rgba(239,68,68,.15)":iDrag?"rgba(0,0,0,.04)":"rgba(0,0,0,.02)",borderTop:overTrash?"2px solid "+P.red:"1px solid rgba(0,0,0,.05)",zIndex:20,transition:"background .2s"}}><span style={{fontSize:overTrash?20:14,transition:"font-size .2s"}}>{overTrash?"🗑️":"🗑"}</span><span style={{fontSize:10,fontWeight:700,color:overTrash?P.red:iDrag?"#aaa":"#ccc"}}>{overTrash?"Bırak → Sil":iDrag?"Buraya sürükle → Sil":"Silme Alanı"}</span></div>
          <div style={{position:"absolute",bottom:10,right:12,fontSize:10,fontWeight:700,color:"rgba(60,50,30,.06)",pointerEvents:"none"}}>{"Prof. Dr. Yılmaz Mutlu • Rumeysa Durgun"}</div>
        </div>
      </div>
      {/* Alt bar */}
      <div style={{height:42,minHeight:42,background:P.side,borderTop:"1px solid "+P.sideB,display:"flex",alignItems:"center",padding:"0 20px",gap:10}}>
        {[["Düz","plain"],["Kareli","grid"],["Noktalı","dot"]].map(function(b){return <button key={b[1]} onClick={function(){setBgT(b[1]);}} style={{padding:"4px 12px",borderRadius:8,border:bgT===b[1]?"2px solid "+P.accent:"1.5px solid rgba(0,0,0,.06)",background:bgT===b[1]?P.accentL:"#fff",cursor:"pointer",fontSize:10,fontWeight:700,color:bgT===b[1]?P.accentD:"#999"}}>{b[0]}</button>;})}
        <div style={{width:1,height:22,background:"rgba(0,0,0,.06)"}}/>
        {[["Bej",P.bg],["Beyaz","#fff"],["Krem","#fef3c7"],["Gri","#f0f0f0"],["Koyu","#2a2a2a"]].map(function(c){return <button key={c[1]} onClick={function(){setBgC(c[1]);}} style={{width:22,height:22,borderRadius:"50%",border:bgC===c[1]?"3px solid "+P.accent:"2px solid rgba(0,0,0,.08)",background:c[1],cursor:"pointer"}}/>;})}
        <div style={{width:1,height:22,background:"rgba(0,0,0,.06)"}}/>
        {/* ★ Sayfa sistemi */}
        <div style={{display:"flex",gap:3,alignItems:"center"}}>
          {pages.map(function(pg){return <button key={pg.id} onClick={function(){switchPage(pg.id);}} style={{padding:"3px 10px",borderRadius:6,border:curPage===pg.id?"2px solid "+P.accent:"1.5px solid rgba(0,0,0,.06)",background:curPage===pg.id?P.accentL:"#fff",cursor:"pointer",fontSize:9,fontWeight:curPage===pg.id?800:600,color:curPage===pg.id?P.accentD:"#999",fontFamily:"inherit"}}>{pg.label}{pages.length>1&&curPage===pg.id?<span onClick={function(e){e.stopPropagation();deletePage(pg.id);}} style={{marginLeft:4,fontSize:8,color:"#ccc",cursor:"pointer"}}>{"×"}</span>:null}</button>;})}
          <button onClick={addPage} style={{width:24,height:24,borderRadius:6,border:"1.5px dashed rgba(0,0,0,.12)",background:"#fff",cursor:"pointer",fontSize:13,fontWeight:800,color:"#ccc",display:"flex",alignItems:"center",justifyContent:"center"}}>{"+"}</button>
        </div>
        <div style={{flex:1}}/>
        <button onClick={function(){setHlO(true);}} style={{width:28,height:28,borderRadius:8,border:"1.5px solid rgba(0,0,0,.08)",background:"#fff",cursor:"pointer",fontSize:12,fontWeight:800,color:"#999",display:"flex",alignItems:"center",justifyContent:"center"}}>{"?"}</button>
        <button onClick={function(){setAbO(true);}} style={{width:28,height:28,borderRadius:8,border:"1.5px solid rgba(0,0,0,.08)",background:"#fff",cursor:"pointer",fontSize:12,color:"#999",display:"flex",alignItems:"center",justifyContent:"center"}}>{"ℹ"}</button>
        <button onClick={function(){setTcO(true);}} style={{width:28,height:28,borderRadius:8,border:"1.5px solid rgba(0,0,0,.08)",background:"#fff",cursor:"pointer",fontSize:12,display:"flex",alignItems:"center",justifyContent:"center"}}>{"👨‍🏫"}</button>
      </div>
      {/* Ghost sürükleme */}
      {sDr?<div style={{position:"fixed",left:sDp.x-14,top:sDp.y-14,zIndex:9999,pointerEvents:"none",opacity:.85}}>
        {sDr.t==="pos"?<Chip type="pos" size={14}/>:null}
        {sDr.t==="neg"?<Chip type="neg" size={14}/>:null}
        {sDr.t==="op"?<div style={{width:28,height:28,borderRadius:6,background:"#fff",border:"2px solid "+P.accent,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:900,color:P.accent}}>{sDr.v}</div>:null}
        {sDr.t==="num"?<div style={{padding:"2px 8px",borderRadius:6,background:"#fff",border:"2px solid "+(sDr.v>=0?P.pos:P.neg),fontSize:13,fontWeight:900,color:sDr.v>=0?P.posB:P.negB}}>{sDr.v>=0?"+"+sDr.v:sDr.v}</div>:null}
        {sDr.t==="tool"?<div style={{padding:"6px 14px",borderRadius:10,background:"#fff",border:"2px solid "+P.accent,boxShadow:"0 4px 16px rgba(0,0,0,.15)",fontSize:12,fontWeight:800,color:P.text}}>{sDr.v==="tray"?"🧮 İşlem Tepsisi":sDr.v==="fab"?"🏭 Fabrika":sDr.v==="tm"?"🌡️ Termometre":"📏 Sayı Doğrusu"}</div>:null}
      </div>:null}
      {/* Etkinlik modalı */}
      {insS?<div onClick={function(){setInsS(null);}} style={{position:"fixed",inset:0,zIndex:9999,background:"rgba(0,0,0,.4)",display:"flex",alignItems:"center",justifyContent:"center"}}><div onClick={function(e){e.stopPropagation();}} style={{background:"#fffdf7",borderRadius:20,padding:"28px 32px",maxWidth:480,boxShadow:"0 16px 48px rgba(0,0,0,.25)",textAlign:"center",animation:"popIn .35s"}}><div style={{fontSize:44,marginBottom:10}}>{insS.i}</div><div style={{fontSize:20,fontWeight:900,marginBottom:8}}>{insS.n}</div><div style={{fontSize:14,marginBottom:20,color:"#555",lineHeight:1.6}}>{insS.d}</div><button onClick={function(){setInsS(null);}} style={{padding:"10px 32px",borderRadius:12,border:"none",background:"linear-gradient(135deg,"+P.accent+","+P.accentD+")",color:"#fff",fontSize:15,fontWeight:800,cursor:"pointer"}}>{"Başla ▸"}</button></div></div>:null}
      {/* Yardım */}
      {hlO?<div onClick={function(){setHlO(false);}} style={{position:"fixed",inset:0,zIndex:9999,background:"rgba(0,0,0,.45)",display:"flex",alignItems:"center",justifyContent:"center"}}><div onClick={function(e){e.stopPropagation();}} style={{background:"#fff",borderRadius:20,padding:"24px 28px",maxWidth:480,fontSize:13,lineHeight:2,color:"#444"}}><div style={{fontSize:20,fontWeight:900,marginBottom:10}}>{"Kullanım Kılavuzu"}</div><div>{"• ⊕ Pozitif ve ⊖ Negatif pulları kanvasa sürükle"}</div><div>{"• Bir ⊕ + bir ⊖ = sıfır çifti (birbirini yok eder)"}</div><div>{"• 🧮 İşlem Tepsisi → iki tarafta pul yerleştir, işlem seç, hesapla"}</div><div>{"• 🏭 Tam-Say Fabrikası → ⊕ ve ⊖ butonlarıyla pul üret"}</div><div>{"• 📏 Sayı doğrusunda yürüyen insan → ◀ Sola / Sağa ▶ butonlarıyla yürüt"}</div><div>{"• 🏢 Asansör ve 🌡️ Termometre → ⚙️ sekmesinde"}</div><div>{"• 🎮 Oyunlar → Quiz, karşılaştır, sayı doğrusu, senaryo soruları"}</div><div>{"• ✏️ Kalem ile çizim yap, 🧹 silgi ile sil"}</div><button onClick={function(){setHlO(false);}} style={{marginTop:14,padding:"8px 24px",borderRadius:10,border:"none",background:"linear-gradient(135deg,"+P.accent+","+P.accentD+")",color:"#fff",fontSize:13,fontWeight:800,cursor:"pointer"}}>{"Kapat"}</button></div></div>:null}
      {/* Hakkında */}
      {abO?<div onClick={function(){setAbO(false);}} style={{position:"fixed",inset:0,zIndex:9999,background:"rgba(0,0,0,.5)",display:"flex",alignItems:"center",justifyContent:"center",padding:20}}><div onClick={function(e){e.stopPropagation();}} style={{background:"#faf6ed",borderRadius:28,maxWidth:460,width:"100%",maxHeight:"90vh",overflowY:"auto",animation:"popIn .35s"}}><div style={{textAlign:"center",padding:"32px 32px 20px"}}><Logo s={80}/><div style={{fontSize:28,fontWeight:900,color:P.text,marginTop:14}}>{"DokunSay"}</div><div style={{fontSize:15,fontWeight:700,color:P.accentD,marginBottom:12}}>{"Tam Sayılar Öğretim Materyali"}</div><div style={{width:50,height:4,borderRadius:2,background:P.accent,margin:"0 auto 16px"}}/><div style={{fontSize:13,color:"#666",lineHeight:1.7,textAlign:"left",padding:"0 8px"}}>{"DokunSay Tam Sayılar, somut manipülatif temelli öğretim yaklaşımıyla öğrencilerin pozitif ve negatif tam sayıları, sıfır çifti kavramını ve dört işlemi anlamalarını destekler. Renkli pullar, sayı doğrusunda yürüyen karakter, işlem tepsisi, tam-say fabrikası, asansör ve termometre simülasyonları ile zenginleştirilmiştir."}</div></div><div style={{margin:"0 24px 20px",background:"#fff",borderRadius:16,padding:"16px 20px"}}><div style={{display:"flex",alignItems:"center",gap:14,marginBottom:12}}><div style={{width:44,height:44,borderRadius:12,background:"linear-gradient(135deg,#fbbf24,#f59e0b)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>{"🎓"}</div><div style={{fontSize:15,fontWeight:900,color:P.text}}>{"Prof. Dr. Yılmaz Mutlu"}</div></div><div style={{display:"flex",alignItems:"center",gap:14}}><div style={{width:44,height:44,borderRadius:12,background:"linear-gradient(135deg,#93c5fd,#3b82f6)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>{"👩‍🏫"}</div><div><div style={{fontSize:15,fontWeight:900,color:P.text}}>{"Rumeysa Durgun"}</div><div style={{fontSize:10,color:"#888"}}>{"Matematik Öğretmeni"}</div></div></div></div><div style={{padding:"0 32px 24px"}}><button onClick={function(){setAbO(false);}} style={{width:"100%",padding:"12px 0",borderRadius:14,border:"none",background:"linear-gradient(135deg,"+P.accent+","+P.accentD+")",color:"#fff",fontSize:15,fontWeight:800,cursor:"pointer"}}>{"Kapat"}</button></div></div></div>:null}
      {/* Öğretmen Paneli */}
      {tcO?<div onClick={function(){setTcO(false);}} style={{position:"fixed",inset:0,zIndex:9999,background:"rgba(0,0,0,.45)",display:"flex",alignItems:"center",justifyContent:"center"}}><div onClick={function(e){e.stopPropagation();}} style={{background:"#fff",borderRadius:24,padding:"28px 32px",maxWidth:580,width:"92%",maxHeight:"90vh",overflowY:"auto",animation:"popIn .3s"}}><div style={{fontSize:22,fontWeight:900,marginBottom:16}}>{"👨‍🏫 Öğretmen Paneli"}</div>
        <div style={{background:P.accentL,borderRadius:14,padding:"14px",marginBottom:14,border:"1.5px solid rgba(245,158,11,.12)"}}><div style={{fontSize:10,fontWeight:800,color:P.accentD,marginBottom:8}}>{"👤 Öğrenci"}</div><div style={{display:"flex",gap:8}}><input value={stuName} onChange={function(e){setStuName(e.target.value);}} placeholder="Ad..." style={{flex:2,padding:"7px 10px",borderRadius:8,border:"1.5px solid #ddd",fontSize:12,fontFamily:"inherit",outline:"none",boxSizing:"border-box"}}/><input value={stuClass} onChange={function(e){setStuClass(e.target.value);}} placeholder="Sınıf..." style={{flex:1,padding:"7px 10px",borderRadius:8,border:"1.5px solid #ddd",fontSize:12,fontFamily:"inherit",outline:"none",boxSizing:"border-box"}}/></div></div>
        <div style={{background:"rgba(34,197,94,.04)",borderRadius:14,padding:"14px",marginBottom:14,border:"1.5px solid rgba(34,197,94,.12)"}}><div style={{fontSize:10,fontWeight:800,color:P.green,marginBottom:8}}>{"✅ İlerleme — "+Object.keys(comp).length+"/"+ACTS.length}</div><div style={{width:"100%",height:6,borderRadius:3,background:"#eee",marginBottom:8}}><div style={{height:6,borderRadius:3,background:P.green,width:(Object.keys(comp).length/ACTS.length*100)+"%"}}/></div><div style={{display:"flex",flexWrap:"wrap",gap:4}}>{ACTS.map(function(a,ai){var done=!!comp[a.n];return <div key={ai} onClick={function(){var nc=Object.assign({},comp);if(done)delete nc[a.n];else nc[a.n]=true;setComp(nc);}} style={{padding:"3px 8px",borderRadius:6,background:done?"rgba(34,197,94,.1)":"#f5f5f5",border:done?"1.5px solid rgba(34,197,94,.3)":"1px solid #e5e5e5",cursor:"pointer",fontSize:9,fontWeight:done?700:500,color:done?P.green:"#888"}}>{done?"✅ ":""}{a.n}</div>;})}</div></div>
        <div style={{background:"rgba(139,92,246,.04)",borderRadius:14,padding:"14px",marginBottom:14,border:"1.5px solid rgba(139,92,246,.12)"}}><div style={{fontSize:10,fontWeight:800,color:"#6d28d9",marginBottom:8}}>{"📚 Ders Planları"}</div>{LESSONS.map(function(ls,li){var lA=ls.acts||[];var lD=lA.filter(function(ai){return comp[ACTS[ai]&&ACTS[ai].n];}).length;return <div key={li} style={{padding:"6px 8px",marginBottom:3,borderRadius:6,background:"#fff",border:"1px solid rgba(0,0,0,.04)"}}><div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontSize:10,fontWeight:800}}>{ls.n}</span><span style={{fontSize:9,fontWeight:700,color:lD===lA.length&&lA.length>0?P.green:"#aaa"}}>{lD+"/"+lA.length}</span></div><div style={{fontSize:8,color:"#888"}}>{ls.d}</div></div>;})}</div>
        <div style={{background:P.accentL,borderRadius:14,padding:"14px",marginBottom:14,border:"1.5px solid rgba(245,158,11,.12)"}}><div style={{fontSize:10,fontWeight:800,color:P.accentD,marginBottom:8}}>{"📝 Notlar"}</div><textarea value={tNotes} onChange={function(e){setTNotes(e.target.value);}} placeholder="Gözlemler..." rows={3} style={{width:"100%",padding:"8px",borderRadius:8,border:"1.5px solid #ddd",fontSize:12,fontFamily:"inherit",outline:"none",resize:"vertical",boxSizing:"border-box"}}/></div>
        <div style={{display:"flex",gap:8,justifyContent:"center"}}><button onClick={function(){setComp({});setStuName("");setStuClass("");setTNotes("");}} style={{padding:"8px 20px",borderRadius:10,border:"1.5px solid "+P.red,background:"rgba(239,68,68,.04)",cursor:"pointer",fontSize:12,fontWeight:700,color:P.red,fontFamily:"inherit"}}>{"↺ Sıfırla"}</button><button onClick={function(){var d={student:stuName,class:stuClass,notes:tNotes,completed:Object.keys(comp),total:ACTS.length,gameScore:game?game.score:0,date:new Date().toLocaleDateString("tr-TR")};var b=new Blob([JSON.stringify(d,null,2)],{type:"application/json"});var l=document.createElement("a");l.download=(stuName||"ogrenci")+"_tamsayilar.json";l.href=URL.createObjectURL(b);l.click();}} style={{padding:"8px 20px",borderRadius:10,border:"1.5px solid "+P.blue,background:"rgba(59,130,246,.04)",cursor:"pointer",fontSize:12,fontWeight:700,color:P.blue,fontFamily:"inherit"}}>{"📥 Rapor"}</button><button onClick={function(){setTcO(false);}} style={{padding:"8px 24px",borderRadius:10,border:"none",background:"linear-gradient(135deg,"+P.accent+","+P.accentD+")",color:"#fff",fontSize:12,fontWeight:800,cursor:"pointer",fontFamily:"inherit"}}>{"Kapat"}</button></div>
      </div></div>:null}
    </div>);
}
