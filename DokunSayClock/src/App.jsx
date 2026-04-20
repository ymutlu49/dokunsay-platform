import { useState, useRef, useEffect } from "react";
var P={face:"#f5b731",border:"#1a1a1a",hourC:"#22c55e",hourB:"#15803d",minC:"#f97316",minB:"#c2410c",dot:"#1a1a1a",accent:"#f59e0b",accentD:"#92400e",accentLight:"rgba(245,158,11,.12)",bg:"#f5f0e3",card:"#fffdf7",side:"#faf6ed",sideB:"#e5dcc8",red:"#ef4444",green:"#22c55e",blue:"#3b82f6",purple:"#8b5cf6"};
var HW=["on iki","bir","iki","üç","dört","beş","altı","yedi","sekiz","dokuz","on","on bir","on iki"];
var HA=["on ikiyi","biri","ikiyi","üçü","dördü","beşi","altıyı","yediyi","sekizi","dokuzu","onu","on biri","on ikiyi"];
var HD=["on ikiye","bire","ikiye","üçe","dörde","beşe","altıya","yediye","sekize","dokuza","ona","on bire","on ikiye"];
function timeTr(h,m){var hh=h%12;var nh=(hh+1)%12;if(m===0)return"Saat "+HW[hh];if(m===30)return"Saat "+HW[hh]+" buçuk";if(m===15)return"Saat "+HA[hh]+" çeyrek geçiyor";if(m===45)return"Saat "+HD[nh]+" çeyrek var";if(m<30)return"Saat "+HA[hh]+" "+m+" geçiyor";return"Saat "+HD[nh]+" "+(60-m)+" var";}
function timeDig(h,m){return(h<10?"0":"")+h+":"+(m<10?"0":"")+m;}
function speak(t){if(!window.speechSynthesis||!t)return;window.speechSynthesis.cancel();var u=new SpeechSynthesisUtterance(t);u.lang="tr-TR";u.rate=0.8;u.pitch=1.1;var v=window.speechSynthesis.getVoices();for(var i=0;i<v.length;i++)if(v[i].lang&&v[i].lang.indexOf("tr")===0){u.voice=v[i];break;}window.speechSynthesis.speak(u);}
var SG={0:[1,1,1,0,1,1,1],1:[0,0,1,0,0,1,0],2:[1,0,1,1,1,0,1],3:[1,0,1,1,0,1,1],4:[0,1,1,1,0,1,0],5:[1,1,0,1,0,1,1],6:[1,1,0,1,1,1,1],7:[1,0,1,0,0,1,0],8:[1,1,1,1,1,1,1],9:[1,1,1,1,0,1,1]};
function D7({v,w,h,x,y}){var s=SG[v]||SG[0],sw=w*.16,sh=h*.44,g=2;var cO="#e2b93b",cF="rgba(255,255,255,.04)";return[{i:"a",X:x+sw+g,Y:y,W:w-2*sw-2*g,H:sw,o:s[0]},{i:"b",X:x,Y:y+sw+g,W:sw,H:sh-sw-2*g,o:s[1]},{i:"c",X:x+w-sw,Y:y+sw+g,W:sw,H:sh-sw-2*g,o:s[2]},{i:"d",X:x+sw+g,Y:y+sh,W:w-2*sw-2*g,H:sw,o:s[3]},{i:"e",X:x,Y:y+sh+sw+g,W:sw,H:sh-sw-2*g,o:s[4]},{i:"f",X:x+w-sw,Y:y+sh+sw+g,W:sw,H:sh-sw-2*g,o:s[5]},{i:"g",X:x+sw+g,Y:y+2*sh,W:w-2*sw-2*g,H:sw,o:s[6]}].map(function(p){return <rect key={p.i} x={p.X} y={p.Y} width={p.W} height={p.H} rx={sw*.3} fill={p.o?cO:cF}/>;});}
function Logo({size}){var s=size||60;return <svg width={s} height={s} viewBox="0 0 60 60"><circle cx={30} cy={30} r={28} fill={P.face} stroke={P.border} strokeWidth={2.5}/>{[12,1,2,3,4,5,6,7,8,9,10,11].map(function(n,i){var a=(i-3)*30*Math.PI/180;return <circle key={n} cx={30+18*Math.cos(a)} cy={30+18*Math.sin(a)} r={5} fill={P.hourC} stroke={P.hourB} strokeWidth={1}/>;})}<line x1={30} y1={30} x2={30} y2={14} stroke={P.border} strokeWidth={3} strokeLinecap="round"/><line x1={30} y1={30} x2={45} y2={30} stroke={P.border} strokeWidth={2} strokeLinecap="round"/><circle cx={30} cy={30} r={3} fill="#333"/></svg>;}
var QH={0:[1,2,3],1:[4,5,6],2:[7,8,9],3:[10,11,12]};
var QM_={0:[5,10,15],1:[20,25,30],2:[35,40,45],3:[50,55,60]};
var DAILY=[{h:7,m:0,icon:"🌅",l:"Uyanma"},{h:8,m:0,icon:"🥞",l:"Kahvaltı"},{h:9,m:0,icon:"🏫",l:"Okul"},{h:12,m:0,icon:"🍽️",l:"Öğle"},{h:3,m:0,icon:"⚽",l:"Oyun"},{h:6,m:0,icon:"📚",l:"Ders"},{h:7,m:30,icon:"🍲",l:"Akşam"},{h:9,m:30,icon:"🌙",l:"Uyku"}];
var ACTS=[
  {n:"Serbest Keşif",i:"🎨",cat:"keşif",diff:1,d:"Saati kendin inşa et!",k:""},
  {n:"Tam Saatleri Oku",i:"🕐",cat:"kavram",diff:1,d:"Saat göstergesini 3'e, dakika göstergesini 12'ye getir.",k:"M.1.3.3.1",s:{h:3,m:0}},
  {n:"Yarım Saat",i:"🕧",cat:"kavram",diff:1,d:"Dakika göstergesi 6'da → yarım saat.",k:"M.1.3.3.1",s:{h:4,m:30}},
  {n:"Kahvaltı Saati",i:"🥞",cat:"kavram",diff:1,d:"08:00 kahvaltı.",k:"M.1.3.3.1",s:{h:8,m:0}},
  {n:"Beşer Dakika",i:"⏱️",cat:"kavram",diff:2,d:"3:15'i oluştur.",k:"M.2.3.2.2",s:{h:3,m:15}},
  {n:"Çeyrek Geçe",i:"🕐",cat:"kavram",diff:2,d:"5:15'i göster.",k:"M.2.3.2.2",s:{h:5,m:15}},
  {n:"Çeyrek Kala",i:"🕑",cat:"kavram",diff:2,d:"2:45'i göster.",k:"M.2.3.2.2",s:{h:2,m:45}},
  {n:"1 Saat=60dk",i:"⏰",cat:"kavram",diff:3,d:"Dakika göstergesi tam tur=60dk.",k:"M.3.3.2.1",s:{h:12,m:0}},
  {n:"Analog-Dijital",i:"🔄",cat:"karşılaştır",diff:2,d:"10:30'u ayarla. Eşleşiyor mu?",k:"M.2.3.2.1",s:{h:10,m:30}},
  {n:"KY1: Saat mi Dakika mı?",i:"🔍",cat:"yanılgı",diff:1,d:"Kısa kol=Saat göstergesi, Uzun kol=Dakika göstergesi.",k:"KY",s:{h:3,m:0}},
  {n:"KY2: Yarımda saat göstergesi",i:"🔍",cat:"yanılgı",diff:2,d:"3:30'da saat göstergesi 3-4 arasında!",k:"KY",s:{h:3,m:30}},
];
var LESSONS=[
  {n:"1. Ders: Saati Tanıyalım",d:"Kadran parçalarını birleştir, sayıları yerleştir.",acts:[0,1,3]},
  {n:"2. Ders: Yarım ve Çeyrek",d:"Yarım saat ve çeyrek kavramları.",acts:[2,5,6]},
  {n:"3. Ders: Beşer Dakika",d:"Dakika göstergesinin her sayıda 5dk ilerlemesi.",acts:[4,5,6]},
  {n:"4. Ders: Dijital ve Analog",d:"İki gösterimi karşılaştır.",acts:[8]},
  {n:"5. Ders: Kavram Yanılgıları",d:"Yaygın hataları düzelt.",acts:[9,10]},
];
var ROUTINE_Q=[
  {q:"Kahvaltı genellikle saat kaçta?",opts:["08:00","12:00","18:00","23:00"],ans:0},
  {q:"Okul genellikle saat kaçta başlar?",opts:["06:00","09:00","14:00","20:00"],ans:1},
  {q:"Öğle yemeği saat kaçta?",opts:["08:00","10:00","12:30","17:00"],ans:2},
  {q:"Akşam yemeği saat kaçta?",opts:["09:00","12:00","15:00","19:00"],ans:3},
  {q:"Çocuklar genellikle saat kaçta uyur?",opts:["15:00","17:00","19:00","21:00"],ans:3},
  {q:"Bir ders genellikle kaç dakika?",opts:["10 dk","20 dk","40 dk","2 saat"],ans:2},
];

export default function App(){
  var _h=useState(12),hour=_h[0],setHour=_h[1];
  var _m=useState(0),min=_m[0],setMin=_m[1];
  var _items=useState([]),items=_items[0],setItems=_items[1];
  var nid=useRef(1);
  function addItem(t,v,x,y){setItems(function(p){return p.concat([{id:nid.current++,t:t,v:v,x:x,y:y}]);});}
  function moveItem(id,x,y){setItems(function(p){return p.map(function(it){return it.id===id?Object.assign({},it,{x:x,y:y}):it;});});}
  function removeItem(id){setItems(function(p){return p.filter(function(it){return it.id!==id;});});}
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
  var sz=340;
  var _geared=useState(true),geared=_geared[0],setGeared=_geared[1];
  var _showMin60=useState(false),showMin60=_showMin60[0],setShowMin60=_showMin60[1];
  var _showSeg=useState(false),showSeg=_showSeg[0],setShowSeg=_showSeg[1];
  var _showFrac=useState(false),showFrac=_showFrac[0],setShowFrac=_showFrac[1];
  var _showAct=useState(false),showAct=_showAct[0],setShowAct=_showAct[1];
  var _liveMode=useState(false),liveMode=_liveMode[0],setLiveMode=_liveMode[1];
  var _elapsed=useState(null),elapsed=_elapsed[0],setElapsed=_elapsed[1];
  var _game=useState(null),game=_game[0],setGame=_game[1];
  var _hideH=useState(false),hideH=_hideH[0],setHideH=_hideH[1];
  var _hideM=useState(false),hideM=_hideM[0],setHideM=_hideM[1];
  var _vTimer=useState(null),vTimer=_vTimer[0],setVTimer=_vTimer[1];
  var _dragH=useState(null),dragH=_dragH[0],setDragH=_dragH[1];
  var _sDr=useState(null),sDr=_sDr[0],setSDr=_sDr[1];
  var _sDp=useState({x:0,y:0}),sDp=_sDp[0],setSDp=_sDp[1];
  var _iDrag=useState(null),iDrag=_iDrag[0],setIDrag=_iDrag[1];
  var _dropH=useState(false),dropH=_dropH[0],setDropH=_dropH[1];
  var _showTrash=useState(false),showTrash=_showTrash[0],setShowTrash=_showTrash[1];
  var _overTrash=useState(false),overTrash=_overTrash[0],setOverTrash=_overTrash[1];
  var _tool=useState("select"),tool=_tool[0],setTool=_tool[1];
  var _penColor=useState("#ef4444"),penColor=_penColor[0],setPenColor=_penColor[1];
  var _penWidth=useState(3),penWidth=_penWidth[0],setPenWidth=_penWidth[1];
  var _strokes=useState([]),strokes=_strokes[0],setStrokes=_strokes[1];
  var _undone=useState([]),undone=_undone[0],setUndone=_undone[1];
  var _drawing=useState(false),drawing=_drawing[0],setDrawing=_drawing[1];
  var _texts=useState([]),texts=_texts[0],setTexts=_texts[1];
  var _snapHint=useState(null),snapHint=_snapHint[0],setSnapHint=_snapHint[1];
  var _penPos=useState(null),penPos=_penPos[0],setPenPos=_penPos[1];
  var drawRef=useRef(null),curStroke=useRef([]),cRef=useRef(null),cvRef=useRef(null),prevMinRef=useRef(min);
  useEffect(function(){if(window.innerWidth<768)setCol(true);},[]);
  var R=sz/2,svS=sz+70;
  var mA=min*6,hA=(hour%12)*30+min*0.5;
  var elStr="";if(elapsed){var ts=(elapsed.h%12)*60+elapsed.m,tn=(hour%12)*60+min,df2=tn-ts;if(df2<0)df2+=720;var eH=Math.floor(df2/60),eM=df2%60;elStr=(eH>0?eH+" sa ":"")+eM+" dk";}

  function placeAll(){var cx=100,cy=40,cxC=cx+svS/2,cyC=cy+svS/2,ni=[];
    for(var q=0;q<4;q++)ni.push({id:nid.current++,t:"quad",v:q,x:cx,y:cy});
    for(var i=1;i<=12;i++){var a=(i*30-90)*Math.PI/180;var hr=R*0.7;var cr=Math.max(16,R*0.105);ni.push({id:nid.current++,t:"hnum",v:i,x:cxC+hr*Math.cos(a)-cr-2,y:cyC+hr*Math.sin(a)-cr-2});}
    for(var j=5;j<=60;j+=5){var a2=((j===60?0:j)*6-90)*Math.PI/180;var mr=R+22;var mc=Math.max(12,R*0.075);ni.push({id:nid.current++,t:"mnum",v:j,x:cxC+mr*Math.cos(a2)-mc-2,y:cyC+mr*Math.sin(a2)-mc-2});}
    ni.push({id:nid.current++,t:"handH",v:0,x:cx,y:cy});ni.push({id:nid.current++,t:"handM",v:0,x:cx,y:cy});
    ni.push({id:nid.current++,t:"digi",v:0,x:cx+svS+30,y:cy+20});ni.push({id:nid.current++,t:"verb",v:0,x:cx+svS+30,y:cy+140});
    setItems(function(p){return p.concat(ni);});}
  function clearAll(){setItems([]);}

  /* Saat göstergesi sürükleme */
  useEffect(function(){if(!dragH)return;
    function ga(e){if(!cRef.current)return 0;var r=cRef.current.getBoundingClientRect();return(Math.atan2(e.clientY-(r.top+r.height/2),e.clientX-(r.left+r.width/2))*180/Math.PI+90+360)%360;}
    function snap5(raw){var n5=Math.round(raw/5)*5;return Math.abs(raw-n5)<=1.2?n5%60:Math.round(raw)%60;}
    function onM(e){if(e.pointerType!=="touch"&&e.buttons===0){setDragH(null);return;}var a=ga(e);
      if(dragH==="min"){var newM=snap5(a/6);if(geared){var oldM=prevMinRef.current;var df=newM-oldM;if(df>30)df-=60;if(df<-30)df+=60;if(df!==0)setHour(function(h){var tot=((h%12)*60+oldM)+df;if(tot<0)tot+=720;return(Math.floor(tot%720/60)||12);});}prevMinRef.current=newM;setMin(newM);}
      else{var nh2=Math.round(a/30)%12;setHour(nh2===0?12:nh2);}}
    function onU(){setDragH(null);}
    window.addEventListener("pointermove",onM);window.addEventListener("pointerup",onU);window.addEventListener("pointercancel",onU);
    return function(){window.removeEventListener("pointermove",onM);window.removeEventListener("pointerup",onU);window.removeEventListener("pointercancel",onU);};});

  useEffect(function(){if(!liveMode)return;function tick(){var now=new Date();setHour(now.getHours()%12||12);setMin(now.getMinutes());}tick();var iv=setInterval(tick,1000);return function(){clearInterval(iv);};},[liveMode]);

  /* Snap */
  var SNAP_R=280,SNAP_LOCK=100;
  function snapCalc(x,y,type,val,exId){var best=null,bestD=SNAP_R;
    items.forEach(function(it){if(it.t!=="quad"||it.id===exId)return;var cx2=it.x+svS/2,cy2=it.y+svS/2;var d=Math.sqrt(Math.pow(x+svS/2-cx2,2)+Math.pow(y+svS/2-cy2,2));if(d<bestD){bestD=d;best=it;}});
    if(!best)return null;var cx3=best.x+svS/2,cy3=best.y+svS/2;var tgt;
    if(type==="handH"||type==="handM")tgt={x:best.x,y:best.y};
    else if(type==="hnum"){var a=(val*30-90)*Math.PI/180;var hr2=R*0.7;var cr2=Math.max(16,R*0.105);tgt={x:cx3+hr2*Math.cos(a)-cr2-2,y:cy3+hr2*Math.sin(a)-cr2-2};}
    else if(type==="mnum"){var a3=((val===60?0:val)*6-90)*Math.PI/180;var mr2=R+22;var mc2=Math.max(12,R*0.075);tgt={x:cx3+mr2*Math.cos(a3)-mc2-2,y:cy3+mr2*Math.sin(a3)-mc2-2};}
    else if(type==="h24"){var a4=(val%12*30-90)*Math.PI/180;var r24=R*0.5;var c24=Math.max(14,R*0.09);tgt={x:cx3+r24*Math.cos(a4)-c24-2,y:cy3+r24*Math.sin(a4)-c24-2};}
    else if(type==="quad")tgt={x:best.x,y:best.y};
    else tgt={x:best.x,y:best.y};tgt.d=bestD;return tgt;}

  /* Sidebar→kanvas */
  useEffect(function(){if(!sDr)return;var startX=sDp.x,startY=sDp.y,moved=false;
    function ck(ex,ey){if(!cvRef.current)return false;var r=cvRef.current.getBoundingClientRect();return ex>r.left-40&&ex<r.right+40&&ey>r.top-40&&ey<r.bottom+40;}
    function placeTap(){/* Dokunarak yerleştir - kanvasın ortasına */if(!cvRef.current)return;var r=cvRef.current.getBoundingClientRect();var cx=(r.width/2)/zoom-svS/4,cy=(r.height/2)/zoom-svS/4;
      if(sDr.t!=="quad"&&sDr.t!=="digi"&&sDr.t!=="verb"){var sn=snapCalc(cx,cy,sDr.t,sDr.v);if(sn){cx=sn.x;cy=sn.y;}}
      addItem(sDr.t,sDr.v,cx,cy);}
    function onM(e){if(e.pointerType!=="touch"&&e.buttons===0){setSDr(null);setDropH(false);return;}var dx=e.clientX-startX,dy=e.clientY-startY;if(Math.abs(dx)>8||Math.abs(dy)>8)moved=true;setSDp({x:e.clientX,y:e.clientY});setDropH(ck(e.clientX,e.clientY));}
    function onU(e){setDropH(false);setSnapHint(null);
      if(!moved){/* Dokunma = kanvasa yerleştir */placeTap();setSDr(null);return;}
      if(cvRef.current&&ck(e.clientX,e.clientY)){var r=cvRef.current.getBoundingClientRect();var rx=(e.clientX-r.left)/zoom,ry=(e.clientY-r.top)/zoom;
      var dx2=Math.max(0,rx-svS/2),dy2=Math.max(0,ry-svS/2);
      if(sDr.t!=="quad"&&sDr.t!=="digi"&&sDr.t!=="verb"){var sn=snapCalc(dx2,dy2,sDr.t,sDr.v);if(sn){dx2=sn.x;dy2=sn.y;}}
      addItem(sDr.t,sDr.v,dx2,dy2);}setSDr(null);}
    function onCancel(){setDropH(false);setSnapHint(null);setSDr(null);}
    window.addEventListener("pointermove",onM);window.addEventListener("pointerup",onU);window.addEventListener("pointercancel",onCancel);
    return function(){window.removeEventListener("pointermove",onM);window.removeEventListener("pointerup",onU);window.removeEventListener("pointercancel",onCancel);};});

  /* Kanvas öğe sürükleme */
  useEffect(function(){if(!iDrag){setShowTrash(false);setOverTrash(false);setSnapHint(null);return;}setShowTrash(true);
    function onM(e){if(e.pointerType!=="touch"&&e.buttons===0){setIDrag(null);return;}if(!cvRef.current)return;var r=cvRef.current.getBoundingClientRect();
      var nx=(e.clientX-r.left)/zoom-iDrag.offX,ny=(e.clientY-r.top)/zoom-iDrag.offY;setOverTrash(e.clientY>r.bottom-50);
      var dit=items.find(function(it){return it.id===iDrag.id;});
      if(dit&&(dit.t==="handH"||dit.t==="handM"||dit.t==="hnum"||dit.t==="mnum"||dit.t==="h24"||dit.t==="quad")){
        var sn=snapCalc(nx,ny,dit.t,dit.v,dit.t==="quad"?dit.id:undefined);
        if(sn&&sn.d<SNAP_LOCK){nx=sn.x;ny=sn.y;setSnapHint({x:sn.x,y:sn.y,t:dit.t});}
        else if(sn&&sn.d<SNAP_R)setSnapHint({x:sn.x,y:sn.y,t:dit.t});else setSnapHint(null);
      }else setSnapHint(null);moveItem(iDrag.id,nx,ny);}
    function onU(e){setSnapHint(null);
      if(cvRef.current&&e.clientY>cvRef.current.getBoundingClientRect().bottom-50)removeItem(iDrag.id);
      else{var d2=items.find(function(it){return it.id===iDrag.id;});if(d2){
        var sn2=snapCalc(d2.x,d2.y,d2.t,d2.v,d2.t==="quad"?d2.id:undefined);if(sn2)moveItem(iDrag.id,sn2.x,sn2.y);}}
      setIDrag(null);}
    function onCancel(){setSnapHint(null);setIDrag(null);}
    window.addEventListener("pointermove",onM);window.addEventListener("pointerup",onU);window.addEventListener("pointercancel",onCancel);
    return function(){window.removeEventListener("pointermove",onM);window.removeEventListener("pointerup",onU);window.removeEventListener("pointercancel",onCancel);};});

  function stSD(t,v,e){e.preventDefault();if(e.target&&e.target.setPointerCapture)try{e.target.releasePointerCapture(e.pointerId);}catch(ex){}setSDr({t:t,v:v});setSDp({x:e.clientX,y:e.clientY});}
  function startItemDrag(id,e){e.preventDefault();e.stopPropagation();var r=e.currentTarget.getBoundingClientRect();setIDrag({id:id,offX:(e.clientX-r.left)/zoom,offY:(e.clientY-r.top)/zoom});}
  function loadA(tp){setATpl(tp);setInsS(tp);if(tp.s){placeAll();setHour(tp.s.h);setMin(tp.s.m);}}

  /* Oyunlar */
  var DIFF_TIMES=[[{h:3,m:0},{h:6,m:0},{h:9,m:0},{h:12,m:0},{h:1,m:0},{h:7,m:0}],[{h:4,m:30},{h:7,m:30},{h:11,m:30},{h:2,m:30}],[{h:3,m:15},{h:5,m:45},{h:8,m:15},{h:10,m:45}],[{h:2,m:10},{h:6,m:25},{h:9,m:40},{h:11,m:55}],[{h:7,m:23},{h:2,m:47},{h:10,m:8},{h:5,m:52}]];
  function startGame(diff){var t=DIFF_TIMES[diff][Math.floor(Math.random()*DIFF_TIMES[diff].length)];if(!items.length)placeAll();setHour(12);setMin(0);setGame({th:t.h,tm:t.m,diff:diff,score:0,total:0,feedback:null});}
  function checkGame(){if(!game)return;var ok=hour===game.th&&min===game.tm;if(ok)speak("Harika!");else speak("Tekrar dene.");setGame(Object.assign({},game,{feedback:ok?"correct":"wrong",score:game.score+(ok?1:0),total:game.total+1}));if(ok)setTimeout(nextGameQ,1500);}
  function nextGameQ(){if(!game)return;var t=DIFF_TIMES[game.diff>=0?game.diff:1][Math.floor(Math.random()*DIFF_TIMES[game.diff>=0?game.diff:1].length)];setHour(12);setMin(0);setGame(Object.assign({},game,{th:t.h,tm:t.m,feedback:null,choices:null}));}
  function genChoices(ch,cm,n){var o=[{h:ch,m:cm}];while(o.length<n){var rh=Math.floor(Math.random()*12)+1,rm=[0,5,10,15,20,25,30,35,40,45,50,55][Math.floor(Math.random()*12)];if(rh===ch&&rm===cm)continue;var dup=false;for(var i=0;i<o.length;i++)if(o[i].h===rh&&o[i].m===rm){dup=true;break;}if(!dup)o.push({h:rh,m:rm});}for(var j=o.length-1;j>0;j--){var k=Math.floor(Math.random()*(j+1));var tmp=o[j];o[j]=o[k];o[k]=tmp;}return o;}
  function startMatchGame(mode){var times=DIFF_TIMES[1].concat(DIFF_TIMES[2]);var t=times[Math.floor(Math.random()*times.length)];if(!items.length)placeAll();setHour(mode==="reverse"?12:t.h);setMin(mode==="reverse"?0:t.m);setGame({th:t.h,tm:t.m,diff:-1,score:0,total:0,feedback:null,mode:mode,choices:mode==="reverse"?null:genChoices(t.h,t.m,4)});}
  function pickChoice(ch){if(!game||game.feedback)return;var ok=ch.h===game.th&&ch.m===game.tm;if(ok)speak("Doğru!");else speak("Yanlış.");setGame(Object.assign({},game,{feedback:ok?"correct":"wrong",score:game.score+(ok?1:0),total:game.total+1}));if(ok)setTimeout(function(){var t2=DIFF_TIMES[1].concat(DIFF_TIMES[2]);var t=t2[Math.floor(Math.random()*t2.length)];setHour(game.mode==="reverse"?12:t.h);setMin(game.mode==="reverse"?0:t.m);setGame(Object.assign({},game,{th:t.h,tm:t.m,feedback:null,choices:genChoices(t.h,t.m,4),score:game.score+1,total:game.total+1}));},1200);}
  function startElapsedGame(){if(!items.length)placeAll();var h1=Math.floor(Math.random()*12)+1,m1=[0,15,30,45][Math.floor(Math.random()*4)];var addM=[15,30,45,60,90,120][Math.floor(Math.random()*6)];var totalM=(h1%12)*60+m1+addM;var h2=Math.floor(totalM/60)%12;if(h2===0)h2=12;var m2=totalM%60;var eH2=Math.floor(addM/60),eM2=addM%60;var ans=(eH2>0?eH2+" saat ":"")+(eM2>0?eM2+" dakika":"");var opts=[ans];while(opts.length<4){var f=[10,20,30,45,60,75,90,120][Math.floor(Math.random()*8)];if(f===addM)continue;var fH=Math.floor(f/60),fM=f%60;var fs=(fH>0?fH+" saat ":"")+(fM>0?fM+" dakika":"");if(opts.indexOf(fs)===-1)opts.push(fs);}for(var j=opts.length-1;j>0;j--){var k=Math.floor(Math.random()*(j+1));var tmp=opts[j];opts[j]=opts[k];opts[k]=tmp;}setHour(h1);setMin(m1);setGame({th:h2,tm:m2,diff:-1,score:0,total:0,feedback:null,mode:"elapsed",startH:h1,startM:m1,endH:h2,endM:m2,answer:ans,choices:opts});}
  function pickElapsed(a){if(!game||game.feedback)return;var ok=a===game.answer;if(ok)speak("Doğru!");else speak("Tekrar dene.");setGame(Object.assign({},game,{feedback:ok?"correct":"wrong",score:game.score+(ok?1:0),total:game.total+1}));if(ok)setTimeout(startElapsedGame,1500);}
  function startRoutineGame(){if(!items.length)placeAll();var qi=Math.floor(Math.random()*ROUTINE_Q.length);setGame({diff:-1,score:0,total:0,feedback:null,mode:"routine",rqi:qi,choices:ROUTINE_Q[qi].opts});}
  function pickRoutine(idx){if(!game||game.feedback)return;var ok=idx===ROUTINE_Q[game.rqi].ans;if(ok)speak("Doğru!");else speak("Tekrar dene.");setGame(Object.assign({},game,{feedback:ok?"correct":"wrong",score:game.score+(ok?1:0),total:game.total+1}));if(ok)setTimeout(function(){var qi2=Math.floor(Math.random()*ROUTINE_Q.length);setGame(Object.assign({},game,{rqi:qi2,choices:ROUTINE_Q[qi2].opts,feedback:null,score:game.score+1,total:game.total+1}));},1200);}

  /* Görsel zamanlayıcı */
  useEffect(function(){if(!vTimer||!vTimer.running)return;var iv=setInterval(function(){setVTimer(function(v){if(!v||v.left<=0)return Object.assign({},v,{running:false,left:0});return Object.assign({},v,{left:v.left-1});});},1000);return function(){clearInterval(iv);};},[vTimer&&vTimer.running]);

  /* Çizim - kalem efekti */
  function drawPencilStroke(ctx,s){
    if(s.type==="eraser"){ctx.globalCompositeOperation="destination-out";ctx.globalAlpha=1;ctx.strokeStyle="rgba(0,0,0,1)";ctx.lineWidth=s.width*2;ctx.lineCap="round";ctx.lineJoin="round";ctx.beginPath();s.points.forEach(function(p,i){if(i===0)ctx.moveTo(p.x*2,p.y*2);else ctx.lineTo(p.x*2,p.y*2);});ctx.stroke();ctx.globalCompositeOperation="source-over";return;}
    if(s.type==="highlighter"){ctx.globalCompositeOperation="source-over";ctx.globalAlpha=0.25;ctx.strokeStyle=s.color;ctx.lineWidth=s.width*2;ctx.lineCap="round";ctx.lineJoin="round";ctx.beginPath();s.points.forEach(function(p,i){if(i===0)ctx.moveTo(p.x*2,p.y*2);else ctx.lineTo(p.x*2,p.y*2);});ctx.stroke();ctx.globalAlpha=1;return;}
    /* Kalem efekti: çoklu katman + doku */
    ctx.globalCompositeOperation="source-over";ctx.lineCap="round";ctx.lineJoin="round";
    var pts=s.points;if(pts.length<2)return;
    /* Ana çizgi - hafif şeffaf */
    ctx.globalAlpha=0.7;ctx.strokeStyle=s.color;ctx.lineWidth=s.width*2;
    ctx.beginPath();pts.forEach(function(p,i){if(i===0)ctx.moveTo(p.x*2,p.y*2);else{var cp1x=(pts[i-1].x*2+p.x*2)/2,cp1y=(pts[i-1].y*2+p.y*2)/2;ctx.quadraticCurveTo(pts[i-1].x*2,pts[i-1].y*2,cp1x,cp1y);}});ctx.stroke();
    /* İkinci katman - ince kenar doku */
    ctx.globalAlpha=0.35;ctx.lineWidth=s.width*2+1;
    ctx.beginPath();pts.forEach(function(p,i){if(i===0)ctx.moveTo(p.x*2+0.5,p.y*2+0.3);else{var cp1x=(pts[i-1].x*2+p.x*2)/2,cp1y=(pts[i-1].y*2+p.y*2)/2;ctx.quadraticCurveTo(pts[i-1].x*2+0.5,pts[i-1].y*2+0.3,cp1x+0.5,cp1y+0.3);}});ctx.stroke();
    /* Üçüncü katman - basınç etkisi noktaları */
    ctx.globalAlpha=0.15;
    for(var i=0;i<pts.length;i+=3){var pr=0.4+0.6*Math.sin(i*0.7);ctx.beginPath();ctx.arc(pts[i].x*2,pts[i].y*2,s.width*pr,0,Math.PI*2);ctx.fillStyle=s.color;ctx.fill();}
    ctx.globalAlpha=1;
  }
  useEffect(function(){var cv=drawRef.current;if(!cv||!cvRef.current)return;var ctx=cv.getContext("2d");cv.width=cvRef.current.clientWidth*2;cv.height=cvRef.current.clientHeight*2;cv.style.width=cvRef.current.clientWidth+"px";cv.style.height=cvRef.current.clientHeight+"px";ctx.scale(2,2);strokes.forEach(function(s){drawPencilStroke(ctx,s);});},[strokes]);
  function drawStart(e){if(tool==="select"||tool==="text")return;var r=cvRef.current.getBoundingClientRect();curStroke.current=[{x:(e.clientX-r.left)/zoom,y:(e.clientY-r.top)/zoom}];setDrawing(true);}
  function drawMove(e){var r=cvRef.current.getBoundingClientRect();var px=e.clientX-r.left,py=e.clientY-r.top;if(tool!=="select")setPenPos({x:e.clientX,y:e.clientY});if(!drawing)return;var p={x:px/zoom,y:py/zoom};curStroke.current.push(p);var cv=drawRef.current;if(!cv)return;var ctx=cv.getContext("2d");if(tool==="eraser"){ctx.globalCompositeOperation="destination-out";ctx.globalAlpha=1;ctx.beginPath();ctx.strokeStyle="rgba(0,0,0,1)";ctx.lineWidth=48;ctx.lineCap="round";}else if(tool==="highlighter"){ctx.globalCompositeOperation="source-over";ctx.globalAlpha=0.25;ctx.beginPath();ctx.strokeStyle=penColor;ctx.lineWidth=penWidth*10;ctx.lineCap="round";}else{ctx.globalCompositeOperation="source-over";ctx.globalAlpha=0.7;ctx.beginPath();ctx.strokeStyle=penColor;ctx.lineWidth=penWidth*2;ctx.lineCap="round";}var pts=curStroke.current;if(pts.length>=2){ctx.moveTo(pts[pts.length-2].x*2,pts[pts.length-2].y*2);var cpx=(pts[pts.length-2].x*2+p.x*2)/2,cpy=(pts[pts.length-2].y*2+p.y*2)/2;ctx.quadraticCurveTo(pts[pts.length-2].x*2,pts[pts.length-2].y*2,cpx,cpy);ctx.stroke();/* kalem doku katmanı */if(tool==="pen"){ctx.globalAlpha=0.15;ctx.beginPath();ctx.arc(p.x*2,p.y*2,penWidth*0.8,0,Math.PI*2);ctx.fillStyle=penColor;ctx.fill();}}ctx.globalAlpha=1;ctx.globalCompositeOperation="source-over";}
  function drawEnd(){if(!drawing)return;setDrawing(false);if(curStroke.current.length>1){setStrokes(function(p){return p.concat([{points:curStroke.current.slice(),color:penColor,width:tool==="eraser"?24:tool==="highlighter"?penWidth*5:penWidth,type:tool}]);});setUndone([]);}curStroke.current=[];}
  function handleCanvasClick(e){if(tool==="text"){var r=cvRef.current.getBoundingClientRect();var txt=prompt("Metin:");if(txt)setTexts(function(p){return p.concat([{id:Date.now(),x:(e.clientX-r.left)/zoom,y:(e.clientY-r.top)/zoom,text:txt}]);});}}
  function undo(){setStrokes(function(p){if(!p.length)return p;setUndone(function(u){return u.concat([p[p.length-1]]);});return p.slice(0,-1);});}
  function redo(){setUndone(function(u){if(!u.length)return u;setStrokes(function(p){return p.concat([u[u.length-1]]);});return u.slice(0,-1);});}

  var cvBg={background:bgC};if(bgT==="grid"){cvBg.backgroundImage="linear-gradient(rgba(0,0,0,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(0,0,0,.05) 1px,transparent 1px)";cvBg.backgroundSize="24px 24px";}if(bgT==="dot"){cvBg.backgroundImage="radial-gradient(rgba(0,0,0,.1) 1px,transparent 1px)";cvBg.backgroundSize="20px 20px";}
  function qPath(q){var sa=[-90,0,90,180][q]*Math.PI/180,ea=([-90,0,90,180][q]+90)*Math.PI/180;return"M0,0 L"+(R*Math.cos(sa)).toFixed(1)+","+(R*Math.sin(sa)).toFixed(1)+" A"+R+","+R+" 0 0 1 "+(R*Math.cos(ea)).toFixed(1)+","+(R*Math.sin(ea)).toFixed(1)+" Z";}
  function Sw({on,onTap,icon,label,sub}){return <div onClick={onTap} style={{display:"flex",alignItems:"center",gap:6,padding:"4px 6px",marginBottom:2,borderRadius:6,cursor:"pointer",background:on?"rgba(245,158,11,.08)":"transparent"}}><div style={{width:28,height:16,borderRadius:8,background:on?P.accent:"#ddd",position:"relative",transition:".2s",flexShrink:0}}><div style={{position:"absolute",top:2,left:on?14:2,width:12,height:12,borderRadius:"50%",background:"#fff",transition:".2s",boxShadow:"0 1px 3px rgba(0,0,0,.2)"}}/></div><span style={{fontSize:11}}>{icon}</span><div style={{flex:1}}><div style={{fontSize:9,fontWeight:700,color:"#3d3520"}}>{label}</div>{sub?<div style={{fontSize:7,color:"#aaa"}}>{sub}</div>:null}</div></div>;}

  /* Öğe render */
  function renderItem(it){var key="it"+it.id;var base={position:"absolute",left:it.x,top:it.y,zIndex:it.t==="handH"||it.t==="handM"?3:it.t==="digi"||it.t==="verb"?5:1,cursor:"grab",touchAction:"none"};function pd(e){if(dragH)return;startItemDrag(it.id,e);}
    if(it.t==="quad"){return <div key={key} style={Object.assign({},base,{width:svS,height:svS})} onPointerDown={pd}><svg width={svS} height={svS} style={{overflow:"visible",filter:"drop-shadow(0 4px 16px rgba(0,0,0,.08))"}}><g transform={"translate("+(svS/2)+","+(svS/2)+")"}><path d={qPath(it.v)} fill={P.face} stroke={P.border} strokeWidth={3.5}/>{Array.from({length:15},function(_,ti){var tI=it.v*15+ti;var a2=(tI*6-90)*Math.PI/180;var iM=tI%5===0;var r1=R-(iM?20:12),r2=R-5;return <line key={ti} x1={r1*Math.cos(a2)} y1={r1*Math.sin(a2)} x2={r2*Math.cos(a2)} y2={r2*Math.sin(a2)} stroke={P.border} strokeWidth={iM?3.5:1.5} strokeLinecap="round"/>;})}{[0,1,2].map(function(di){var da=([-90,0,90,180][it.v]+15+di*30)*Math.PI/180;return <circle key={di} cx={(R-4)*Math.cos(da)} cy={(R-4)*Math.sin(da)} r={Math.max(5,R*.035)} fill={P.dot}/>;})}</g></svg></div>;}
    if(it.t==="hnum"){var cr=Math.max(16,R*.105);return <div key={key} style={Object.assign({},base,{width:cr*2+4,height:cr*2+4})} onPointerDown={pd}><svg width={cr*2+4} height={cr*2+4}><circle cx={cr+2} cy={cr+2} r={cr} fill={P.hourC} stroke={P.hourB} strokeWidth={2.5}/><text x={cr+2} y={cr+3} textAnchor="middle" dominantBaseline="middle" fontSize={Math.max(14,R*.095)} fontWeight={900} fill="#fff">{it.v}</text></svg></div>;}
    if(it.t==="mnum"){var mc=Math.max(12,R*.075);return <div key={key} style={Object.assign({},base,{width:mc*2+4,height:mc*2+4})} onPointerDown={pd}><svg width={mc*2+4} height={mc*2+4}><circle cx={mc+2} cy={mc+2} r={mc} fill={P.minC} stroke={P.minB} strokeWidth={2}/><text x={mc+2} y={mc+3} textAnchor="middle" dominantBaseline="middle" fontSize={Math.max(9,R*.06)} fontWeight={800} fill="#fff">{it.v===60?"60":(it.v<10?"0"+it.v:it.v)}</text></svg></div>;}
    if(it.t==="h24"){var h24r=Math.max(14,R*.09);return <div key={key} style={Object.assign({},base,{width:h24r*2+4,height:h24r*2+4})} onPointerDown={pd}><svg width={h24r*2+4} height={h24r*2+4}><circle cx={h24r+2} cy={h24r+2} r={h24r} fill="#8b5cf6" stroke="#6d28d9" strokeWidth={2}/><text x={h24r+2} y={h24r+3} textAnchor="middle" dominantBaseline="middle" fontSize={Math.max(10,R*.07)} fontWeight={800} fill="#fff">{it.v<10?"0"+it.v:it.v}</text></svg></div>;}
    if(it.t==="handH"||it.t==="handM"){var isM=it.t==="handM";if((!isM&&hideH)||(isM&&hideM))return null;var ang=isM?mA:hA;var myId=it.id;
      return <div key={key} style={Object.assign({},base,{width:svS,height:svS,pointerEvents:"none",cursor:"default"})}><svg ref={isM?cRef:undefined} width={svS} height={svS} style={{overflow:"visible"}}><g transform={"translate("+(svS/2)+","+(svS/2)+")"}>
        {isM?(<g transform={"rotate("+ang+")"} style={{cursor:"grab",transition:dragH==="min"?"none":"transform .3s",pointerEvents:"auto"}}><polygon points={"-4,0 4,0 3,18 -3,18"} fill="#93c5fd" stroke="#1e40af" strokeWidth={1}/><polygon points={"-4,0 4,0 2.5,"+(-(R*.5))+" 1.5,"+(-(R*.74))+" -1.5,"+(-(R*.74))+" -2.5,"+(-(R*.5))} fill="#1e40af" stroke="#fff" strokeWidth={2}/><polygon points={"-3,"+(-(R*.74))+" 3,"+(-(R*.74))+" 0,"+(-(R*.86))} fill="#1e40af" stroke="#fff" strokeWidth={1.5}/><rect x={-14} y={-(R*.92)} width={28} height={R} rx={14} fill="transparent" onPointerDown={function(e){e.preventDefault();e.stopPropagation();setDragH("min");}}/></g>)
        :(<g transform={"rotate("+ang+")"} style={{cursor:"grab",transition:dragH==="hour"?"none":"transform .3s",pointerEvents:"auto"}}><polygon points={"-5,0 5,0 4,16 -4,16"} fill="#a3a3a3" stroke="#333" strokeWidth={1}/><polygon points={"-5.5,0 5.5,0 3.5,"+(-(R*.32))+" 2,"+(-(R*.46))+" -2,"+(-(R*.46))+" -3.5,"+(-(R*.32))} fill="#111" stroke="#fff" strokeWidth={2.5}/><polygon points={"-3.5,"+(-(R*.46))+" 3.5,"+(-(R*.46))+" 0,"+(-(R*.56))} fill="#111" stroke="#fff" strokeWidth={2}/><rect x={-16} y={-(R*.62)} width={32} height={R*.7} rx={16} fill="transparent" onPointerDown={function(e){e.preventDefault();e.stopPropagation();setDragH("hour");}}/></g>)}
        <circle r={Math.max(16,R*.1)} fill="transparent" style={{cursor:"move",pointerEvents:"auto"}} onPointerDown={function(e){e.preventDefault();e.stopPropagation();var rect=e.currentTarget.closest("div").getBoundingClientRect();setIDrag({id:myId,offX:(e.clientX-rect.left)/zoom,offY:(e.clientY-rect.top)/zoom});}}/>
        <circle r={Math.max(10,R*.06)} fill="#fff" stroke="#333" strokeWidth={2.5} style={{pointerEvents:"none"}}/><circle r={Math.max(5,R*.03)} fill="#dc2626" style={{pointerEvents:"none"}}/>
      </g></svg></div>;}
    if(it.t==="digi"){var isPM=it.v===1;return <div key={key} style={Object.assign({},base,{zIndex:5})}><div style={{background:"linear-gradient(180deg,#222,#111)",border:"2px solid #444",borderRadius:14,boxShadow:"0 6px 24px rgba(0,0,0,.25)",userSelect:"none",overflow:"hidden",width:190}}>
      <div style={{background:"#2a2a2a",padding:"4px 10px",display:"flex",justifyContent:"space-between",alignItems:"center",cursor:"grab",borderBottom:"1px solid #333"}} onPointerDown={pd}><span style={{fontSize:7,fontWeight:800,color:"#555",letterSpacing:2}}>{"DİJİTAL SAAT"}</span><span style={{fontSize:7,color:"#444"}}>{"⋮⋮"}</span></div>
      <div style={{padding:"4px 8px 6px",background:"#080808"}}><div style={{display:"flex",alignItems:"center",justifyContent:"center"}}>
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:1}}><button onClick={function(e){e.stopPropagation();setHour(function(h){return h>=12?1:h+1;});}} style={{width:48,height:16,borderRadius:4,background:"#222",border:"1px solid #333",cursor:"pointer",fontSize:9,color:"#666",fontWeight:800}}>{"▲"}</button><div style={{background:"#050505",borderRadius:6,padding:"2px 4px",border:"1px solid #1a1a1a"}}><svg width={52} height={36}><D7 v={Math.floor(hour/10)} w={20} h={32} x={2} y={2}/><D7 v={hour%10} w={20} h={32} x={26} y={2}/></svg></div><button onClick={function(e){e.stopPropagation();setHour(function(h){return h<=1?12:h-1;});}} style={{width:48,height:16,borderRadius:4,background:"#222",border:"1px solid #333",cursor:"pointer",fontSize:9,color:"#666",fontWeight:800}}>{"▼"}</button></div>
        <div style={{display:"flex",flexDirection:"column",gap:8,padding:"0 4px"}}><div style={{width:5,height:5,borderRadius:"50%",background:P.accent}}/><div style={{width:5,height:5,borderRadius:"50%",background:P.accent}}/></div>
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:1}}><button onClick={function(e){e.stopPropagation();setMin(function(m){return(m+5)%60;});}} style={{width:48,height:16,borderRadius:4,background:"#222",border:"1px solid #333",cursor:"pointer",fontSize:8,color:"#666",fontWeight:800}}>{"▲+5"}</button><div style={{background:"#050505",borderRadius:6,padding:"2px 4px",border:"1px solid #1a1a1a"}}><svg width={52} height={36}><D7 v={Math.floor(min/10)} w={20} h={32} x={2} y={2}/><D7 v={min%10} w={20} h={32} x={26} y={2}/></svg></div><button onClick={function(e){e.stopPropagation();setMin(function(m){return m<=0?55:m-5;});}} style={{width:48,height:16,borderRadius:4,background:"#222",border:"1px solid #333",cursor:"pointer",fontSize:8,color:"#666",fontWeight:800}}>{"▼-5"}</button></div>
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:2,marginLeft:4}}><button onClick={function(e){e.stopPropagation();setItems(function(p){return p.map(function(x){return x.id===it.id?Object.assign({},x,{v:0}):x;});});}} style={{width:24,height:18,borderRadius:4,background:!isPM?"rgba(59,130,246,.2)":"#222",border:!isPM?"1px solid rgba(59,130,246,.4)":"1px solid #333",cursor:"pointer",fontSize:7,fontWeight:900,color:!isPM?"#60a5fa":"#555"}}>{"ÖÖ"}</button><button onClick={function(e){e.stopPropagation();setItems(function(p){return p.map(function(x){return x.id===it.id?Object.assign({},x,{v:1}):x;});});}} style={{width:24,height:18,borderRadius:4,background:isPM?"rgba(245,158,11,.2)":"#222",border:isPM?"1px solid rgba(245,158,11,.4)":"1px solid #333",cursor:"pointer",fontSize:7,fontWeight:900,color:isPM?"#e2b93b":"#555"}}>{"ÖS"}</button><div style={{display:"flex",gap:1}}><button onClick={function(e){e.stopPropagation();setMin(function(m){return m<=0?59:m-1;});}} style={{width:11,height:12,borderRadius:2,background:"#1a1a1a",border:"1px solid #333",cursor:"pointer",fontSize:6,color:"#555",fontWeight:900,padding:0}}>{"-1"}</button><button onClick={function(e){e.stopPropagation();setMin(function(m){return(m+1)%60;});}} style={{width:11,height:12,borderRadius:2,background:"#1a1a1a",border:"1px solid #333",cursor:"pointer",fontSize:6,color:"#555",fontWeight:900,padding:0}}>{"+1"}</button></div></div>
      </div></div>
      <div style={{background:"#1a1a1a",padding:"5px 10px",borderTop:"1px solid #222"}}><div style={{display:"flex",alignItems:"center",gap:6}}><span style={{fontSize:7,fontWeight:800,padding:"1px 5px",borderRadius:3,background:isPM?"rgba(245,158,11,.15)":"rgba(59,130,246,.15)",color:isPM?"#e2b93b":"#60a5fa"}}>{isPM?"ÖS":"ÖÖ"}</span><span style={{flex:1,fontSize:10,fontWeight:800,color:"#e2b93b"}}>{timeTr(hour,min)}</span><button onClick={function(e){e.stopPropagation();speak(timeTr(hour,min));}} style={{width:26,height:26,borderRadius:6,background:"linear-gradient(135deg,"+P.accent+","+P.accentD+")",border:"none",cursor:"pointer",fontSize:11,display:"flex",alignItems:"center",justifyContent:"center"}}>{"🔊"}</button></div></div>
    </div></div>;}
    if(it.t==="verb"){return <div key={key} style={Object.assign({},base,{zIndex:5})} onPointerDown={pd}><div style={{background:"#fff",border:"2px solid "+P.sideB,borderRadius:14,padding:"10px 16px",boxShadow:"0 4px 16px rgba(0,0,0,.08)",display:"flex",alignItems:"center",gap:12,userSelect:"none",minWidth:200}}><div><div style={{fontSize:9,fontWeight:700,color:"#bbb",textTransform:"uppercase",letterSpacing:1,marginBottom:2}}>{"Okunuş"}</div><div style={{fontSize:18,fontWeight:900,color:"#3d3520",lineHeight:1.2}}>{timeTr(hour,min)}</div></div><button onClick={function(e){e.stopPropagation();speak(timeTr(hour,min));}} style={{width:38,height:38,borderRadius:"50%",border:"none",background:"linear-gradient(135deg,"+P.accent+","+P.accentD+")",cursor:"pointer",fontSize:18,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{"🔊"}</button></div></div>;}
    return null;}

  /* Oyun UI yardımcıları */
  function GameChoices({choices,onPick,isVerbal,feedback,correctH,correctM}){return <div style={{display:"flex",flexDirection:"column",gap:3}}>{(choices||[]).map(function(ch,ci){var isC=feedback&&(typeof ch==="object"?ch.h===correctH&&ch.m===correctM:false);return <button key={ci} onClick={function(){onPick(ch);}} disabled={!!feedback} style={{padding:"7px 10px",borderRadius:8,border:isC?"2px solid "+P.green:"1.5px solid rgba(0,0,0,.06)",background:isC?"rgba(34,197,94,.08)":"#fff",cursor:feedback?"default":"pointer",fontSize:11,fontWeight:700,color:isC?P.green:"#3d3520",fontFamily:"inherit",textAlign:"left"}}>{typeof ch==="object"?(isVerbal?timeTr(ch.h,ch.m):timeDig(ch.h,ch.m)):ch}{isC?" ✅":""}</button>;})}</div>;}

  return(
    <div style={{display:"flex",flexDirection:"column",height:"100vh",overflow:"hidden",fontFamily:"'Nunito','Segoe UI',system-ui,sans-serif"}}>
      <style>{"@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@600;700;800;900&display=swap');*{box-sizing:border-box}@keyframes popIn{0%{transform:scale(.8);opacity:0}60%{transform:scale(1.04)}100%{transform:scale(1);opacity:1}}@keyframes fadeIn{0%{opacity:0;transform:translateY(-8px)}100%{opacity:1;transform:translateY(0)}}@keyframes pulse{0%,100%{opacity:.6;transform:scale(1)}50%{opacity:1;transform:scale(1.15)}}@keyframes snapIn{0%{transform:scale(1.3);opacity:0}100%{transform:scale(1);opacity:1}}@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}button{font-family:'Nunito',system-ui,sans-serif;transition:transform .1s}button:active{transform:scale(.96)}"}</style>
      {/* HEADER */}
      <div style={{height:52,minHeight:52,background:"linear-gradient(135deg,#1a1a1a,#2d2520)",display:"flex",alignItems:"center",padding:"0 20px",gap:12,boxShadow:"0 4px 20px rgba(0,0,0,.2)"}}>
        <div style={{animation:"float 3s ease-in-out infinite"}}><Logo size={34}/></div>
        <span style={{fontSize:20,fontWeight:900,color:P.accent}}>{"DokunSay"}</span><span style={{fontSize:14,fontWeight:700,color:"rgba(255,255,255,.4)"}}>{"Saat"}</span>
        <div style={{flex:1}}/>
        <div style={{padding:"4px 14px",background:"rgba(255,255,255,.06)",borderRadius:10}}><span style={{fontSize:20,fontWeight:900,color:"#e2b93b",fontFamily:"monospace"}}>{timeDig(hour,min)}</span></div>
        <div style={{display:"flex",gap:3,alignItems:"center",background:"rgba(255,255,255,.06)",borderRadius:8,padding:"4px 8px"}}><button onClick={function(){setZoom(function(z){return Math.max(0.5,+(z-0.1).toFixed(1));});}} style={{background:"none",border:"none",color:"rgba(255,255,255,.5)",cursor:"pointer",fontSize:14,fontWeight:900}}>{"−"}</button><span style={{fontSize:10,color:"rgba(255,255,255,.35)",minWidth:36,textAlign:"center"}}>{Math.round(zoom*100)+"%"}</span><button onClick={function(){setZoom(function(z){return Math.min(2,+(z+0.1).toFixed(1));});}} style={{background:"none",border:"none",color:"rgba(255,255,255,.5)",cursor:"pointer",fontSize:14,fontWeight:900}}>{"+"}</button></div>
      </div>
      <div style={{display:"flex",flex:1,overflow:"hidden"}}>
        {/* SIDEBAR */}
        <div style={{width:col?52:260,minWidth:col?52:260,background:"linear-gradient(180deg,"+P.side+",#f3ede0)",borderRight:"1px solid "+P.sideB,display:"flex",flexDirection:"column",transition:"width .25s",overflow:"hidden"}}>
          {!col?(<div style={{display:"flex",flexDirection:"column",flex:1,overflow:"hidden"}}>
            <div style={{padding:"12px 16px 8px",display:"flex",alignItems:"center",gap:10,borderBottom:"1px solid rgba(0,0,0,.05)"}}><Logo size={32}/><div style={{flex:1}}><div style={{fontSize:15,fontWeight:900,color:"#3d3520"}}>{"DokunSay Saat"}</div><div style={{fontSize:9,color:"#bbb",fontWeight:700}}>{"Saat Öğretim Materyali"}</div></div><button onClick={function(){setCol(true);}} style={{background:"rgba(0,0,0,.04)",border:"none",cursor:"pointer",fontSize:14,color:"#bbb",width:28,height:28,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center"}}>{"◀"}</button></div>
            <div style={{display:"flex",padding:"6px 12px",gap:3,background:"rgba(0,0,0,.02)"}}>
              {[["📦","mat"],["📋","act"],["🎮","game"],["⚙️","feat"]].map(function(t){return <button key={t[1]} onClick={function(){setSTab(t[1]);}} style={{flex:1,padding:"7px 0",border:"none",borderRadius:8,background:sTab===t[1]?"#fff":"transparent",cursor:"pointer",fontSize:13,fontWeight:800,color:sTab===t[1]?"#3d3520":"#aaa",fontFamily:"inherit",boxShadow:sTab===t[1]?"0 1px 4px rgba(0,0,0,.06)":"none"}}>{t[0]}</button>;})}
            </div>
            {sTab==="mat"?(<div style={{flex:1,overflowY:"auto",padding:"10px 12px",scrollbarWidth:"none",msOverflowStyle:"none",WebkitOverflowScrolling:"touch"}}>
              {/* Kadranlar */}
              <div style={{background:"#fff",borderRadius:14,padding:"12px",marginBottom:10,border:"1px solid rgba(0,0,0,.05)"}}>
                <div style={{fontSize:10,fontWeight:800,textTransform:"uppercase",letterSpacing:1.5,color:"#b45309",marginBottom:10}}>{"🕐 Kadran Parçaları"}</div>
                <div style={{position:"relative",width:130,height:130,margin:"0 auto"}}>{[3,0,2,1].map(function(q){var cx=65,cy=65,rr=58;var sa=[-90,0,90,180][q]*Math.PI/180,ea=([-90,0,90,180][q]+90)*Math.PI/180;var pd2="M"+cx+","+cy+" L"+(cx+rr*Math.cos(sa)).toFixed(1)+","+(cy+rr*Math.sin(sa)).toFixed(1)+" A"+rr+","+rr+" 0 0 1 "+(cx+rr*Math.cos(ea)).toFixed(1)+","+(cy+rr*Math.sin(ea)).toFixed(1)+" Z";return <svg key={q} width={130} height={130} style={{position:"absolute",top:0,left:0,pointerEvents:"none",touchAction:"none"}}><path d={pd2} fill={P.face} stroke={P.border} strokeWidth={2.5} style={{cursor:"grab",pointerEvents:"auto",touchAction:"none"}} onPointerDown={function(e){stSD("quad",q,e);}}/></svg>;})}<div style={{position:"absolute",left:62,top:62,width:6,height:6,borderRadius:"50%",background:"#999"}}/></div>
              </div>
              {/* Saat pulları */}
              <div style={{background:"#fff",borderRadius:14,padding:"12px",marginBottom:10,border:"1px solid rgba(0,0,0,.05)"}}>
                <div style={{fontSize:10,fontWeight:800,textTransform:"uppercase",letterSpacing:1.5,color:P.hourB,marginBottom:10}}>{"🟢 Saat Pulları (1-12)"}</div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:4}}>{[1,2,3,4,5,6,7,8,9,10,11,12].map(function(n){return <div key={n} style={{aspectRatio:"1",borderRadius:"50%",background:"linear-gradient(145deg,"+P.hourC+","+P.hourB+")",border:"2.5px solid "+P.hourB,display:"flex",alignItems:"center",justifyContent:"center",cursor:"grab",fontSize:13,fontWeight:900,color:"#fff",touchAction:"none"}} onPointerDown={function(e){stSD("hnum",n,e);}}>{n}</div>;})}</div>
              </div>
              {/* Dakika pulları */}
              <div style={{background:"#fff",borderRadius:14,padding:"12px",marginBottom:10,border:"1px solid rgba(0,0,0,.05)"}}>
                <div style={{fontSize:10,fontWeight:800,textTransform:"uppercase",letterSpacing:1.5,color:P.minB,marginBottom:10}}>{"🟠 Dakika Pulları (05-60)"}</div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:4}}>{[5,10,15,20,25,30,35,40,45,50,55,60].map(function(n){return <div key={n} style={{aspectRatio:"1",borderRadius:"50%",background:"linear-gradient(145deg,"+P.minC+","+P.minB+")",border:"2.5px solid "+P.minB,display:"flex",alignItems:"center",justifyContent:"center",cursor:"grab",fontSize:10,fontWeight:800,color:"#fff",touchAction:"none"}} onPointerDown={function(e){stSD("mnum",n,e);}}>{n<10?"0"+n:n}</div>;})}</div>
              </div>
              {/* 24 saat */}
              <div style={{background:"#fff",borderRadius:14,padding:"12px",marginBottom:10,border:"1px solid rgba(0,0,0,.05)"}}>
                <div style={{fontSize:10,fontWeight:800,textTransform:"uppercase",letterSpacing:1.5,color:"#6d28d9",marginBottom:10}}>{"🟣 24 Saat Pulları"}</div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:4}}>{[13,14,15,16,17,18,19,20,21,22,23,0].map(function(n){return <div key={n} style={{aspectRatio:"1",borderRadius:"50%",background:"linear-gradient(145deg,#8b5cf6,#6d28d9)",border:"2.5px solid #6d28d9",display:"flex",alignItems:"center",justifyContent:"center",cursor:"grab",fontSize:10,fontWeight:800,color:"#fff",touchAction:"none"}} onPointerDown={function(e){stSD("h24",n,e);}}>{n<10?"0"+n:n}</div>;})}</div>
              </div>
              {/* Kollar */}
              <div style={{background:"#fff",borderRadius:14,padding:"12px",marginBottom:10,border:"1px solid rgba(0,0,0,.05)"}}>
                <div style={{fontSize:10,fontWeight:800,textTransform:"uppercase",letterSpacing:1.5,color:"#555",marginBottom:10}}>{"🖐 Sürükle & Bırak"}</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                  <div style={{background:"linear-gradient(145deg,#f8f9fa,#e9ecef)",borderRadius:12,padding:"14px 8px 10px",cursor:"grab",touchAction:"none",textAlign:"center",border:"2px solid #dee2e6",boxShadow:"0 2px 8px rgba(0,0,0,.06)",transition:"transform .15s"}} onPointerDown={function(e){stSD("handH",0,e);}}><svg width={36} height={36} viewBox="0 0 36 36" style={{marginBottom:4}}><circle cx={18} cy={18} r={16} fill="#f5f5f5" stroke="#333" strokeWidth={1.5}/><line x1={18} y1={18} x2={18} y2={7} stroke="#22c55e" strokeWidth={3.5} strokeLinecap="round"/><circle cx={18} cy={18} r={2.5} fill="#333"/></svg><div style={{fontSize:10,fontWeight:800,color:"#333",lineHeight:1.2}}>{"Kısa Kol"}</div><div style={{fontSize:8,fontWeight:600,color:"#22c55e",marginTop:2}}>{"Saat"}</div></div>
                  <div style={{background:"linear-gradient(145deg,#eff6ff,#dbeafe)",borderRadius:12,padding:"14px 8px 10px",cursor:"grab",touchAction:"none",textAlign:"center",border:"2px solid #bfdbfe",boxShadow:"0 2px 8px rgba(30,64,175,.08)",transition:"transform .15s"}} onPointerDown={function(e){stSD("handM",0,e);}}><svg width={36} height={36} viewBox="0 0 36 36" style={{marginBottom:4}}><circle cx={18} cy={18} r={16} fill="#f5f5f5" stroke="#333" strokeWidth={1.5}/><line x1={18} y1={18} x2={18} y2={4} stroke="#f97316" strokeWidth={2.5} strokeLinecap="round"/><circle cx={18} cy={18} r={2.5} fill="#333"/></svg><div style={{fontSize:10,fontWeight:800,color:"#1e40af",lineHeight:1.2}}>{"Uzun Kol"}</div><div style={{fontSize:8,fontWeight:600,color:"#f97316",marginTop:2}}>{"Dakika"}</div></div>
                  <div style={{background:"linear-gradient(145deg,#1a1a1a,#111)",borderRadius:12,padding:"12px 8px 10px",cursor:"grab",touchAction:"none",textAlign:"center",border:"2px solid #444",boxShadow:"0 2px 8px rgba(0,0,0,.15)",transition:"transform .15s"}} onPointerDown={function(e){stSD("digi",0,e);}}><div style={{fontSize:18,fontWeight:900,color:"#e2b93b",fontFamily:"'Courier New',monospace",letterSpacing:2,margin:"4px 0",textShadow:"0 0 8px rgba(226,185,59,.4)"}}>{"12:00"}</div><div style={{fontSize:10,fontWeight:700,color:"#aaa"}}>{"Dijital Saat"}</div></div>
                  <div style={{background:"linear-gradient(145deg,#faf5ff,#f3e8ff)",borderRadius:12,padding:"12px 8px 10px",cursor:"grab",touchAction:"none",textAlign:"center",border:"2px solid #e9d5ff",boxShadow:"0 2px 8px rgba(139,92,246,.08)",transition:"transform .15s"}} onPointerDown={function(e){stSD("verb",0,e);}}><svg width={32} height={32} viewBox="0 0 32 32" style={{marginBottom:4}}><rect x={2} y={6} width={18} height={20} rx={3} fill="#7c3aed" opacity={0.15}/><path d="M22 10 L28 16 L22 22" fill="none" stroke="#7c3aed" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"/><path d="M25 13 L29 16 L25 19" fill="none" stroke="#7c3aed" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" opacity={0.5}/><text x={11} y={19} textAnchor="middle" fontSize={9} fontWeight="bold" fill="#7c3aed">{"Aa"}</text></svg><div style={{fontSize:10,fontWeight:800,color:"#6d28d9"}}>{"Sözel Okunuş"}</div></div>
                </div>
              </div>
              <div style={{display:"flex",gap:8,marginBottom:10}}><button onClick={placeAll} style={{flex:1,padding:"12px 0",borderRadius:12,border:"none",background:"linear-gradient(135deg,"+P.accent+","+P.accentD+")",color:"#fff",fontSize:12,fontWeight:800,cursor:"pointer",fontFamily:"inherit",boxShadow:"0 3px 12px rgba(245,158,11,.3)",transition:"transform .15s",letterSpacing:0.3}}>{"⚡ Hepsini Yerleştir"}</button><button onClick={clearAll} style={{flex:1,padding:"12px 0",borderRadius:12,border:"2px solid "+P.sideB,background:"#fff",color:"#777",fontSize:12,fontWeight:800,cursor:"pointer",fontFamily:"inherit",transition:"transform .15s",letterSpacing:0.3}}>{"🗑 Temizle"}</button></div>
            </div>):sTab==="game"?(
            /* ★ OYUNLAR SEKMESİ */
            <div style={{flex:1,overflowY:"auto",padding:"10px 12px",scrollbarWidth:"none",msOverflowStyle:"none",WebkitOverflowScrolling:"touch"}}>
              <div style={{background:game?"rgba(34,197,94,.04)":"#fff",borderRadius:14,padding:"12px",marginBottom:8,border:game?"1.5px solid rgba(34,197,94,.2)":"1px solid rgba(0,0,0,.05)"}}>
                {!game?(<div style={{display:"flex",flexDirection:"column",gap:3}}>
                  <div style={{fontSize:10,fontWeight:800,color:P.green,marginBottom:4}}>{"🎮 Saati Ayarla"}</div>
                  {[["⭐ Tam Saatler",0],["⭐⭐ Yarım Saatler",1],["⭐⭐ Çeyrekler",2],["⭐⭐⭐ Beşer Dakika",3],["⭐⭐⭐ Serbest",4]].map(function(d){return <button key={d[1]} onClick={function(){startGame(d[1]);}} style={{padding:"6px 10px",borderRadius:8,border:"1.5px solid rgba(34,197,94,.15)",background:"rgba(34,197,94,.03)",cursor:"pointer",fontSize:10,fontWeight:700,color:"#15803d",fontFamily:"inherit",textAlign:"left"}}>{d[0]}</button>;})}
                  <div style={{height:1,background:"rgba(0,0,0,.06)",margin:"6px 0"}}/>
                  <div style={{fontSize:10,fontWeight:800,color:P.blue,marginBottom:4}}>{"🔢 Eşleştirme"}</div>
                  <button onClick={function(){startMatchGame("digi");}} style={{padding:"6px 10px",borderRadius:8,border:"1.5px solid rgba(59,130,246,.15)",background:"rgba(59,130,246,.03)",cursor:"pointer",fontSize:10,fontWeight:700,color:P.blue,fontFamily:"inherit",textAlign:"left"}}>{"Analog → Dijital"}</button>
                  <button onClick={function(){startMatchGame("verbal");}} style={{padding:"6px 10px",borderRadius:8,border:"1.5px solid rgba(139,92,246,.15)",background:"rgba(139,92,246,.03)",cursor:"pointer",fontSize:10,fontWeight:700,color:P.purple,fontFamily:"inherit",textAlign:"left"}}>{"Analog → Sözel"}</button>
                  <button onClick={function(){startMatchGame("reverse");}} style={{padding:"6px 10px",borderRadius:8,border:"1.5px solid rgba(245,158,11,.15)",background:"rgba(245,158,11,.03)",cursor:"pointer",fontSize:10,fontWeight:700,color:P.accentD,fontFamily:"inherit",textAlign:"left"}}>{"Dijital → Analog"}</button>
                  <div style={{height:1,background:"rgba(0,0,0,.06)",margin:"6px 0"}}/>
                  <div style={{fontSize:10,fontWeight:800,color:P.accentD,marginBottom:4}}>{"⏱ Zaman Kavramı"}</div>
                  <button onClick={startElapsedGame} style={{padding:"6px 10px",borderRadius:8,border:"1.5px solid rgba(59,130,246,.15)",background:"rgba(59,130,246,.03)",cursor:"pointer",fontSize:10,fontWeight:700,color:P.blue,fontFamily:"inherit",textAlign:"left"}}>{"Geçen Süre Hesapla"}</button>
                  <button onClick={startRoutineGame} style={{padding:"6px 10px",borderRadius:8,border:"1.5px solid rgba(245,158,11,.15)",background:"rgba(245,158,11,.03)",cursor:"pointer",fontSize:10,fontWeight:700,color:P.accentD,fontFamily:"inherit",textAlign:"left"}}>{"Günlük Rutin Bilgisi"}</button>
                </div>):(<div>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}><span style={{fontSize:14,fontWeight:900,color:P.green}}>{"🏆 "+game.score+"/"+game.total}</span><button onClick={function(){setGame(null);}} style={{padding:"3px 10px",borderRadius:6,border:"1px solid #ddd",background:"#fff",cursor:"pointer",fontSize:9,fontWeight:700,color:"#888",fontFamily:"inherit"}}>{"✕ Bitir"}</button></div>
                  {/* Saati Ayarla */}
                  {game.diff>=0?<div><div style={{padding:"10px",borderRadius:10,background:"#fff",border:"1.5px solid rgba(34,197,94,.15)",textAlign:"center",marginBottom:6}}><div style={{fontSize:9,color:"#888"}}>{"Bu saati ayarla:"}</div><div style={{fontSize:28,fontWeight:900,color:"#3d3520"}}>{timeDig(game.th,game.tm)}</div><div style={{fontSize:12,fontWeight:700,color:P.accentD}}>{timeTr(game.th,game.tm)}</div></div>{game.feedback==="correct"?<div style={{padding:"8px",borderRadius:8,background:"rgba(34,197,94,.1)",textAlign:"center",fontSize:14,fontWeight:900,color:P.green}}>{"✅ Harika!"}</div>:game.feedback==="wrong"?<div style={{padding:"6px",borderRadius:8,background:"rgba(239,68,68,.06)",textAlign:"center"}}><div style={{fontSize:11,fontWeight:800,color:P.red}}>{"❌ Tekrar dene!"}</div><div style={{fontSize:9,color:"#888"}}>{"İpucu: "+timeDig(game.th,game.tm)}</div></div>:<button onClick={checkGame} style={{width:"100%",padding:"10px 0",borderRadius:8,border:"none",background:"linear-gradient(135deg,"+P.green+",#15803d)",color:"#fff",fontSize:12,fontWeight:800,cursor:"pointer",fontFamily:"inherit"}}>{"✓ Kontrol Et"}</button>}</div>:null}
                  {/* Eşleştirme */}
                  {(game.mode==="digi"||game.mode==="verbal")&&game.choices?<div><div style={{fontSize:10,fontWeight:700,color:"#888",textAlign:"center",marginBottom:6}}>{game.mode==="digi"?"Dijital karşılığını seç:":"Sözel okunuşu seç:"}</div><GameChoices choices={game.choices} onPick={pickChoice} isVerbal={game.mode==="verbal"} feedback={game.feedback} correctH={game.th} correctM={game.tm}/></div>:null}
                  {/* Ters */}
                  {game.mode==="reverse"?<div><div style={{padding:"10px",borderRadius:10,background:"#fff",border:"1.5px solid rgba(245,158,11,.15)",textAlign:"center",marginBottom:6}}><div style={{fontSize:9,color:"#888"}}>{"Analog olarak ayarla:"}</div><div style={{fontSize:28,fontWeight:900,color:P.accentD}}>{timeDig(game.th,game.tm)}</div></div>{game.feedback==="correct"?<div style={{padding:"8px",borderRadius:8,background:"rgba(34,197,94,.1)",textAlign:"center",fontSize:14,fontWeight:900,color:P.green}}>{"✅ Doğru!"}</div>:game.feedback==="wrong"?<div style={{padding:"6px",borderRadius:8,background:"rgba(239,68,68,.06)",textAlign:"center",fontSize:11,fontWeight:800,color:P.red}}>{"❌ Tekrar dene!"}</div>:<button onClick={checkGame} style={{width:"100%",padding:"10px 0",borderRadius:8,border:"none",background:"linear-gradient(135deg,"+P.accent+","+P.accentD+")",color:"#fff",fontSize:12,fontWeight:800,cursor:"pointer",fontFamily:"inherit"}}>{"✓ Kontrol Et"}</button>}</div>:null}
                  {/* Geçen süre */}
                  {game.mode==="elapsed"?<div><div style={{padding:"8px",borderRadius:10,background:"#fff",border:"1.5px solid rgba(59,130,246,.15)",marginBottom:6}}><div style={{display:"flex",justifyContent:"space-around",alignItems:"center",marginBottom:4}}><div style={{textAlign:"center"}}><div style={{fontSize:8,color:"#888"}}>{"Başlangıç"}</div><div style={{fontSize:18,fontWeight:900,color:P.blue}}>{timeDig(game.startH,game.startM)}</div></div><span style={{fontSize:16,color:"#ccc"}}>{"→"}</span><div style={{textAlign:"center"}}><div style={{fontSize:8,color:"#888"}}>{"Bitiş"}</div><div style={{fontSize:18,fontWeight:900,color:P.red}}>{timeDig(game.endH,game.endM)}</div></div></div><div style={{fontSize:10,fontWeight:700,color:"#555",textAlign:"center"}}>{"Aradaki süre?"}</div></div><div style={{display:"flex",flexDirection:"column",gap:3}}>{(game.choices||[]).map(function(c,ci){var isC=game.feedback&&c===game.answer;return <button key={ci} onClick={function(){pickElapsed(c);}} disabled={!!game.feedback} style={{padding:"7px 10px",borderRadius:8,border:isC?"2px solid "+P.green:"1.5px solid rgba(0,0,0,.06)",background:isC?"rgba(34,197,94,.08)":"#fff",cursor:game.feedback?"default":"pointer",fontSize:11,fontWeight:700,color:isC?P.green:"#3d3520",fontFamily:"inherit"}}>{c}{isC?" ✅":""}</button>;})}</div></div>:null}
                  {/* Günlük rutin */}
                  {game.mode==="routine"?<div><div style={{padding:"10px",borderRadius:10,background:"#fff",border:"1.5px solid rgba(245,158,11,.15)",textAlign:"center",marginBottom:6}}><div style={{fontSize:14,fontWeight:800,color:"#3d3520"}}>{ROUTINE_Q[game.rqi].q}</div></div><div style={{display:"flex",flexDirection:"column",gap:3}}>{(game.choices||[]).map(function(c,ci){var isC=game.feedback&&ci===ROUTINE_Q[game.rqi].ans;return <button key={ci} onClick={function(){pickRoutine(ci);}} disabled={!!game.feedback} style={{padding:"7px 10px",borderRadius:8,border:isC?"2px solid "+P.green:"1.5px solid rgba(0,0,0,.06)",background:isC?"rgba(34,197,94,.08)":"#fff",cursor:game.feedback?"default":"pointer",fontSize:11,fontWeight:700,color:isC?P.green:"#3d3520",fontFamily:"inherit"}}>{c}{isC?" ✅":""}</button>;})}</div></div>:null}
                </div>)}
              </div>
            </div>
            ):sTab==="feat"?(
            <div style={{flex:1,overflowY:"auto",padding:"10px 12px",scrollbarWidth:"none",msOverflowStyle:"none",WebkitOverflowScrolling:"touch"}}>
              <div style={{background:"#fff",borderRadius:14,padding:"12px",marginBottom:8,border:"1px solid rgba(0,0,0,.05)"}}>
                <div style={{fontSize:10,fontWeight:800,textTransform:"uppercase",letterSpacing:1.5,color:"#555",marginBottom:8}}>{"⚙️ Saat Ayarları"}</div>
                <Sw on={geared} onTap={function(){setGeared(!geared);}} icon="⚙️" label="Dişli mod" sub="Dakika göstergesi döndükçe saat göstergesi de kayar"/>
                <Sw on={showMin60} onTap={function(){setShowMin60(!showMin60);}} icon="🔢" label="60 dakika etiketleri"/>
                <Sw on={showSeg} onTap={function(){setShowSeg(!showSeg);}} icon="🎨" label="Renk dilimleri"/>
                <Sw on={showFrac} onTap={function(){setShowFrac(!showFrac);}} icon="◔" label="Kesir bindirmesi"/>
                <Sw on={showAct} onTap={function(){setShowAct(!showAct);}} icon="📅" label="Günlük aktiviteler"/>
                <Sw on={liveMode} onTap={function(){setLiveMode(!liveMode);}} icon="⏱️" label="Canlı saat"/>
              </div>
              <div style={{background:"#fff",borderRadius:14,padding:"12px",marginBottom:8,border:"1px solid rgba(0,0,0,.05)"}}>
                <div style={{fontSize:10,fontWeight:800,textTransform:"uppercase",letterSpacing:1.5,color:P.purple,marginBottom:8}}>{"🔍 Odaklanma Modu"}</div>
                <Sw on={hideH} onTap={function(){setHideH(!hideH);}} icon="🕐" label="Saat göstergesini gizle"/>
                <Sw on={hideM} onTap={function(){setHideM(!hideM);}} icon="🕑" label="Dakika göstergesini gizle"/>
              </div>
              <div style={{background:"#fff",borderRadius:14,padding:"12px",marginBottom:8,border:"1px solid rgba(0,0,0,.05)"}}>
                <div style={{fontSize:10,fontWeight:800,textTransform:"uppercase",letterSpacing:1.5,color:P.blue,marginBottom:8}}>{"⏱ Geçen Süre"}</div>
                <button onClick={function(){setElapsed(elapsed?null:{h:hour,m:min});}} style={{width:"100%",padding:"7px 0",borderRadius:8,border:elapsed?"1.5px solid "+P.red:"1.5px solid "+P.blue,background:elapsed?"rgba(239,68,68,.04)":"rgba(59,130,246,.04)",cursor:"pointer",fontSize:10,fontWeight:800,color:elapsed?P.red:P.blue,fontFamily:"inherit"}}>{elapsed?"⏹ Durdur":"▶ Başlat"}</button>
                {elapsed?<div style={{marginTop:6,padding:"6px 8px",borderRadius:8,background:"rgba(59,130,246,.04)",textAlign:"center"}}><div style={{fontSize:18,fontWeight:900,color:P.blue}}>{elStr}</div></div>:null}
              </div>
              <div style={{background:"#fff",borderRadius:14,padding:"12px",border:"1px solid rgba(0,0,0,.05)"}}>
                <div style={{fontSize:10,fontWeight:800,textTransform:"uppercase",letterSpacing:1.5,color:P.red,marginBottom:8}}>{"⏰ Görsel Zamanlayıcı"}</div>
                {!vTimer||!vTimer.running?<div style={{display:"flex",gap:3,flexWrap:"wrap"}}>{[{l:"1dk",s:60},{l:"3dk",s:180},{l:"5dk",s:300},{l:"10dk",s:600}].map(function(t){return <button key={t.s} onClick={function(){setVTimer({total:t.s,left:t.s,running:true});}} style={{flex:1,padding:"6px 0",borderRadius:6,border:"1px solid rgba(239,68,68,.15)",background:"rgba(239,68,68,.03)",cursor:"pointer",fontSize:9,fontWeight:700,color:P.red,fontFamily:"inherit",minWidth:40}}>{t.l}</button>;})}</div>:<div style={{textAlign:"center"}}><div style={{position:"relative",width:80,height:80,margin:"0 auto 8px"}}><svg width={80} height={80} viewBox="0 0 80 80"><circle cx={40} cy={40} r={36} fill="none" stroke="#f0f0f0" strokeWidth={6}/><circle cx={40} cy={40} r={36} fill="none" stroke={vTimer.left/vTimer.total>0.25?vTimer.left/vTimer.total>0.5?P.green:P.accent:P.red} strokeWidth={6} strokeDasharray={226.2} strokeDashoffset={226.2*(1-vTimer.left/vTimer.total)} strokeLinecap="round" transform="rotate(-90 40 40)" style={{transition:"stroke-dashoffset 1s linear"}}/></svg><div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{fontSize:20,fontWeight:900}}>{Math.floor(vTimer.left/60)+":"+(vTimer.left%60<10?"0":"")+vTimer.left%60}</span></div></div><button onClick={function(){setVTimer(function(v){return v?Object.assign({},v,{running:false}):null;});}} style={{padding:"5px 16px",borderRadius:6,border:"1px solid "+P.red,background:"rgba(239,68,68,.04)",cursor:"pointer",fontSize:9,fontWeight:700,color:P.red,fontFamily:"inherit"}}>{"⏹ Durdur"}</button>{vTimer.left===0?<div style={{marginTop:6,fontSize:12,fontWeight:900,color:P.red,animation:"pulse 1s infinite"}}>{"⏰ Süre doldu!"}</div>:null}</div>}
              </div>
            </div>
            ):sTab==="act"?(<div style={{flex:1,overflowY:"auto",padding:"8px 12px",scrollbarWidth:"none",msOverflowStyle:"none",WebkitOverflowScrolling:"touch"}}>
              {["keşif","kavram","karşılaştır","yanılgı"].map(function(cat){var acts=ACTS.filter(function(a){return a.cat===cat;});if(!acts.length)return null;return <div key={cat}><div style={{fontSize:8,fontWeight:800,textTransform:"uppercase",letterSpacing:1.5,color:cat==="yanılgı"?P.red:"#999",margin:"8px 0 4px"}}>{cat==="keşif"?"Keşif":cat==="kavram"?"Kavram":cat==="karşılaştır"?"Karşılaştırma":"Yanılgı"}</div>{acts.map(function(tp,i){var isA=aTpl&&aTpl.n===tp.n;return <button key={i} onClick={function(){loadA(tp);}} style={{display:"flex",alignItems:"center",gap:5,padding:"5px 8px",width:"100%",background:isA?P.accentLight:P.card,border:isA?"2px solid "+P.accent:"1px solid "+P.sideB,borderRadius:8,cursor:"pointer",fontFamily:"inherit",textAlign:"left",color:"#3d3520",marginBottom:3,fontSize:10,fontWeight:isA?900:600}}><span style={{fontSize:14}}>{tp.i}</span><span style={{flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{tp.n}</span></button>;})}</div>;})}
            </div>):null}
          </div>):(<div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:8,padding:"12px 0"}}>{["📦","📋","🎮","⚙️"].map(function(ic,ii){return <button key={ii} onClick={function(){setCol(false);setSTab(["mat","act","game","feat"][ii]);}} style={{padding:"8px 12px",borderRadius:8,border:"1px solid "+P.sideB,background:"#fff",cursor:"pointer",fontSize:18}}>{ic}</button>;})}</div>)}
        </div>
        {/* KANVAS */}
        <div ref={cvRef} style={Object.assign({flex:1,position:"relative",overflow:"auto"},cvBg)}>
          {/* Araç çubuğu */}
          <div style={{position:"absolute",top:10,left:"50%",transform:"translateX(-50%)",zIndex:30,display:"flex",gap:3,background:"rgba(255,255,255,.95)",backdropFilter:"blur(12px)",borderRadius:14,padding:"5px 8px",boxShadow:"0 4px 20px rgba(0,0,0,.08)",alignItems:"center"}}>
            {[["select","🖱️"],["pen","✏️"],["highlighter","🖍️"],["eraser","🧹"],["text","T"]].map(function(t){return <button key={t[0]} onClick={function(){setTool(t[0]);}} style={{width:34,height:34,borderRadius:8,border:tool===t[0]?"2px solid "+P.accent:"2px solid transparent",background:tool===t[0]?"rgba(245,158,11,.1)":"transparent",cursor:"pointer",fontSize:t[0]==="text"?13:15,fontWeight:t[0]==="text"?900:400,color:"#3d3520",display:"flex",alignItems:"center",justifyContent:"center"}}>{t[1]}</button>;})}
            {tool!=="select"&&tool!=="eraser"?<>{["#ef4444","#3b82f6","#22c55e","#f59e0b","#1a1a1a"].map(function(c){return <button key={c} onClick={function(){setPenColor(c);}} style={{width:18,height:18,borderRadius:"50%",background:c,border:penColor===c?"2.5px solid #fff":"1.5px solid rgba(0,0,0,.1)",boxShadow:penColor===c?"0 0 0 2px "+c:"none",cursor:"pointer"}}/>;})}</>:null}
            <button onClick={undo} style={{width:34,height:34,borderRadius:8,border:"none",background:"transparent",cursor:"pointer",fontSize:15,color:strokes.length?"#666":"#ddd"}}>{"↩"}</button>
            <button onClick={redo} style={{width:34,height:34,borderRadius:8,border:"none",background:"transparent",cursor:"pointer",fontSize:15,color:undone.length?"#666":"#ddd"}}>{"↪"}</button>
            <button onClick={function(){setStrokes([]);setTexts([]);}} style={{width:34,height:34,borderRadius:8,border:"none",background:"transparent",cursor:"pointer",fontSize:15,color:"#999"}}>{"🗑"}</button>
          </div>
          <canvas ref={drawRef} style={{position:"absolute",inset:0,zIndex:tool!=="select"?25:0,pointerEvents:tool!=="select"?"auto":"none",cursor:tool==="pen"||tool==="highlighter"?"none":tool==="eraser"?"none":tool==="text"?"text":"default"}} onPointerDown={drawStart} onPointerMove={drawMove} onPointerUp={drawEnd} onPointerCancel={drawEnd} onPointerLeave={function(){setPenPos(null);}} onClick={handleCanvasClick}/>
          {/* Kalem imleci */}
          {penPos&&tool!=="select"&&tool!=="text"?<div style={{position:"fixed",left:penPos.x,top:penPos.y,zIndex:9999,pointerEvents:"none",transform:"translate(-4px,-48px)"}}>{tool==="eraser"?<svg width={32} height={32} viewBox="0 0 32 32" style={{transform:"translate(0,24px)"}}><rect x={4} y={8} width={24} height={16} rx={3} fill="#f5f5f5" stroke="#999" strokeWidth={1.5}/><rect x={4} y={18} width={24} height={6} rx={2} fill="#ff9999" stroke="#999" strokeWidth={1}/><line x1={10} y1={10} x2={10} y2={17} stroke="#ddd" strokeWidth={0.8}/><line x1={16} y1={10} x2={16} y2={17} stroke="#ddd" strokeWidth={0.8}/><line x1={22} y1={10} x2={22} y2={17} stroke="#ddd" strokeWidth={0.8}/></svg>:<svg width={20} height={56} viewBox="0 0 20 56"><defs><linearGradient id="pencilBody" x1="0" x2="1" y1="0" y2="0"><stop offset="0%" stopColor={tool==="highlighter"?"#ffe066":"#f4d03f"}/><stop offset="30%" stopColor={tool==="highlighter"?"#fff3b0":"#f9e986"}/><stop offset="70%" stopColor={tool==="highlighter"?"#ffe066":"#f4d03f"}/><stop offset="100%" stopColor={tool==="highlighter"?"#e6c200":"#d4ac0d"}/></linearGradient></defs><polygon points="10,0 5,8 15,8" fill={penColor} opacity={0.9}/><rect x={5} y={8} width={10} height={6} fill="#d4a" opacity={0}/><rect x={5} y={8} width={10} height={4} rx={0.5} fill="#c0c0c0"/><rect x={5} y={12} width={10} height={34} fill="url(#pencilBody)"/><line x1={7} y1={12} x2={7} y2={46} stroke="rgba(0,0,0,.08)" strokeWidth={0.5}/><line x1={13} y1={12} x2={13} y2={46} stroke="rgba(0,0,0,.08)" strokeWidth={0.5}/><rect x={5} y={46} width={10} height={4} rx={1} fill={tool==="highlighter"?"#ffb3b3":"#ffccaa"}/><rect x={5} y={50} width={10} height={3} rx={0.5} fill="#2a2a2a" opacity={0.6}/>{drawing?<circle cx={10} cy={0} r={3} fill={penColor} opacity={0.4}><animate attributeName="r" values="2;4;2" dur="0.6s" repeatCount="indefinite"/><animate attributeName="opacity" values="0.4;0.15;0.4" dur="0.6s" repeatCount="indefinite"/></circle>:null}</svg>}</div>:null}
          {/* Zoom wrapper */}
          <div style={{position:"absolute",inset:0,transform:"scale("+zoom+")",transformOrigin:"0 0",width:(100/zoom)+"%",height:(100/zoom)+"%"}}>
          {texts.map(function(t){return <div key={t.id} style={{position:"absolute",left:t.x,top:t.y,zIndex:26,fontSize:16,fontWeight:700,color:penColor,pointerEvents:"none"}}>{t.text}</div>;})}
          {sDr&&dropH?<div style={{position:"absolute",inset:0,zIndex:0,border:"3px dashed rgba(245,158,11,.4)",borderRadius:4,pointerEvents:"none"}}><div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",background:"rgba(245,158,11,.1)",padding:"8px 20px",borderRadius:12}}><span style={{fontSize:13,fontWeight:800,color:"rgba(245,158,11,.6)"}}>{"📥 Buraya bırak"}</span></div></div>:null}
          {liveMode?<div style={{position:"absolute",top:50,right:12,zIndex:8,padding:"4px 10px",borderRadius:8,background:"rgba(239,68,68,.1)",border:"1px solid rgba(239,68,68,.2)"}}><span style={{fontSize:10,fontWeight:800,color:P.red}}>{"● CANLI"}</span></div>:null}
          {game?<div style={{position:"absolute",top:50,left:12,zIndex:8,display:"flex",alignItems:"center",gap:8}}><div style={{padding:"6px 14px",borderRadius:10,background:"rgba(34,197,94,.1)",border:"1.5px solid rgba(34,197,94,.2)"}}>{game.mode==="elapsed"?<div><div style={{fontSize:8,color:"#888"}}>{"Geçen Süre"}</div><div style={{fontSize:14,fontWeight:900,color:P.blue}}>{timeDig(game.startH||0,game.startM||0)+" → "+timeDig(game.endH||0,game.endM||0)}</div></div>:game.mode==="routine"?<div><div style={{fontSize:8,color:"#888"}}>{"Günlük Rutin"}</div></div>:<div><div style={{fontSize:8,color:"#888"}}>{"Hedef"}</div><div style={{fontSize:22,fontWeight:900,color:"#15803d"}}>{timeDig(game.th,game.tm)}</div></div>}</div><div style={{padding:"4px 10px",borderRadius:8,background:"rgba(255,255,255,.8)"}}><span style={{fontSize:12,fontWeight:900,color:P.green}}>{"🏆 "+game.score}</span></div>{game.feedback==="correct"?<div style={{fontSize:28,animation:"popIn .3s"}}>{"🎉"}</div>:null}</div>:null}
          {/* Ghost */}
          {items.length===0&&!aTpl?<div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",textAlign:"center",pointerEvents:"none",animation:"fadeIn .6s"}}><div style={{animation:"float 4s ease-in-out infinite"}}><svg width={280} height={280} viewBox="0 0 400 400"><circle cx={200} cy={200} r={182} fill="none" stroke="rgba(60,50,30,.04)" strokeWidth={2} strokeDasharray="16,12"/>{[12,1,2,3,4,5,6,7,8,9,10,11].map(function(n){var a=(n*30-90)*Math.PI/180;return <text key={n} x={200+140*Math.cos(a)} y={200+140*Math.sin(a)+1} textAnchor="middle" dominantBaseline="middle" fontSize={22} fontWeight={800} fill="rgba(60,50,30,.05)">{n}</text>;})}</svg></div><div style={{fontSize:16,fontWeight:800,color:"rgba(60,50,30,.15)"}}>{"Materyallerden sürükleyerek saati inşa et!"}</div></div>:null}
          {snapHint?<div style={{position:"absolute",left:snapHint.x+(snapHint.t==="hnum"?Math.max(16,R*.105):snapHint.t==="mnum"?Math.max(12,R*.075):svS/2)-12,top:snapHint.y+(snapHint.t==="hnum"?Math.max(16,R*.105):snapHint.t==="mnum"?Math.max(12,R*.075):svS/2)-12,width:24,height:24,borderRadius:"50%",border:"3px solid "+P.accent,background:"rgba(245,158,11,.15)",zIndex:0,pointerEvents:"none",animation:"pulse 1s infinite"}}/>:null}
          {items.map(function(it){return renderItem(it);})}
          </div>{/* zoom end */}
          {showTrash?<div style={{position:"absolute",bottom:0,left:0,right:0,height:50,display:"flex",alignItems:"center",justifyContent:"center",gap:8,background:overTrash?"rgba(239,68,68,.15)":"rgba(0,0,0,.03)",borderTop:overTrash?"2px solid "+P.red:"1px dashed rgba(0,0,0,.1)",zIndex:20}}><span style={{fontSize:overTrash?22:18}}>{overTrash?"🗑️":"🗑"}</span><span style={{fontSize:11,fontWeight:700,color:overTrash?P.red:"#999"}}>{overTrash?"Bırak → Kaldır":"Sürükle → Kaldır"}</span></div>:null}
          <div style={{position:"absolute",bottom:10,right:12,fontSize:10,fontWeight:700,color:"rgba(60,50,30,.08)",pointerEvents:"none"}}>{"Prof. Dr. Yılmaz Mutlu • Dr. İhsan Söylemez"}</div>
        </div>
      </div>
      {/* Alt bar */}
      <div style={{height:42,minHeight:42,background:P.side,borderTop:"1px solid "+P.sideB,display:"flex",alignItems:"center",padding:"0 20px",gap:10}}>
        {[["Düz","plain"],["Kareli","grid"],["Noktalı","dot"]].map(function(b){return <button key={b[1]} onClick={function(){setBgT(b[1]);}} style={{padding:"4px 12px",borderRadius:8,border:bgT===b[1]?"2px solid "+P.accent:"1.5px solid rgba(0,0,0,.06)",background:bgT===b[1]?"rgba(245,158,11,.08)":"#fff",cursor:"pointer",fontSize:10,fontWeight:700,color:bgT===b[1]?"#92400e":"#999"}}>{b[0]}</button>;})}
        <div style={{width:1,height:22,background:"rgba(0,0,0,.06)"}}/>
        {[["Bej",P.bg],["Beyaz","#fff"],["Mavi","#e8f0fe"],["Gri","#f0f0f0"],["Koyu","#2a2a2a"]].map(function(c){return <button key={c[1]} onClick={function(){setBgC(c[1]);}} style={{width:22,height:22,borderRadius:"50%",border:bgC===c[1]?"3px solid "+P.accent:"2px solid rgba(0,0,0,.08)",background:c[1],cursor:"pointer"}}/>;})}
        <div style={{flex:1}}/>
        <button onClick={function(){setHlO(true);}} style={{width:28,height:28,borderRadius:8,border:"1.5px solid rgba(0,0,0,.08)",background:"#fff",cursor:"pointer",fontSize:12,fontWeight:800,color:"#999",display:"flex",alignItems:"center",justifyContent:"center"}}>{"?"}</button>
        <button onClick={function(){setAbO(true);}} style={{width:28,height:28,borderRadius:8,border:"1.5px solid rgba(0,0,0,.08)",background:"#fff",cursor:"pointer",fontSize:12,color:"#999",display:"flex",alignItems:"center",justifyContent:"center"}}>{"ℹ"}</button>
        <button onClick={function(){setTcO(true);}} style={{width:28,height:28,borderRadius:8,border:"1.5px solid rgba(0,0,0,.08)",background:"#fff",cursor:"pointer",fontSize:12,display:"flex",alignItems:"center",justifyContent:"center"}}>{"👨‍🏫"}</button>
      </div>
      {/* Ghosts */}
      {sDr?<div style={{position:"fixed",left:sDp.x-20,top:sDp.y-20,zIndex:9999,pointerEvents:"none",opacity:.85}}>
        {sDr.t==="quad"?<svg width={44} height={44} viewBox="-24 -24 48 48"><path d={qPath(sDr.v)} fill={P.face} stroke={P.border} strokeWidth={2}/></svg>:null}
        {sDr.t==="hnum"?<div style={{width:36,height:36,borderRadius:"50%",background:P.hourC,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,fontWeight:900,color:"#fff"}}>{sDr.v}</div>:null}
        {sDr.t==="mnum"?<div style={{width:32,height:32,borderRadius:"50%",background:P.minC,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:800,color:"#fff"}}>{sDr.v<10?"0"+sDr.v:sDr.v}</div>:null}
        {sDr.t==="h24"?<div style={{width:32,height:32,borderRadius:"50%",background:"#8b5cf6",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:800,color:"#fff"}}>{sDr.v<10?"0"+sDr.v:sDr.v}</div>:null}
        {sDr.t==="handH"?<svg width={22} height={44}><rect x={8} y={4} width={6} height={32} rx={3} fill="#111"/></svg>:null}
        {sDr.t==="handM"?<svg width={18} height={54}><rect x={6} y={4} width={5} height={42} rx={2.5} fill="#1e40af"/></svg>:null}
        {sDr.t==="digi"?<div style={{width:60,height:34,borderRadius:8,background:"#111",border:"2px solid #333",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:900,color:"#e2b93b",fontFamily:"monospace"}}>{"12:00"}</div>:null}
        {sDr.t==="verb"?<div style={{width:60,height:34,borderRadius:8,background:"#fff",border:"2px solid "+P.sideB,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700}}>{"🔊"}</div>:null}
      </div>:null}
      {/* Modals */}
      {hlO?<div onClick={function(){setHlO(false);}} style={{position:"fixed",inset:0,zIndex:9999,background:"rgba(0,0,0,.45)",display:"flex",alignItems:"center",justifyContent:"center"}}><div onClick={function(e){e.stopPropagation();}} style={{background:"#fff",borderRadius:20,padding:"24px 28px",maxWidth:440,fontSize:13,lineHeight:2,color:"#444"}}><div style={{fontSize:20,fontWeight:900,marginBottom:10}}>{"Kullanım"}</div><div>{"• Parçaları sidebar'dan kanvasa sürükle"}</div><div>{"• Kadranları yaklaştır → yapışır"}</div><div>{"• Parçayı alta sürükle → sil"}</div><div>{"• 🎮 sekmesinde oyunları oyna"}</div><div>{"• ⚙️ sekmesinden ayarları değiştir"}</div><button onClick={function(){setHlO(false);}} style={{marginTop:14,padding:"8px 24px",borderRadius:10,border:"none",background:"linear-gradient(135deg,"+P.accent+","+P.accentD+")",color:"#fff",fontSize:13,fontWeight:800,cursor:"pointer"}}>{"Kapat"}</button></div></div>:null}
      {abO?<div onClick={function(){setAbO(false);}} style={{position:"fixed",inset:0,zIndex:9999,background:"rgba(0,0,0,.5)",display:"flex",alignItems:"center",justifyContent:"center",padding:20}}><div onClick={function(e){e.stopPropagation();}} style={{background:"#faf6ed",borderRadius:28,maxWidth:460,width:"100%",maxHeight:"90vh",overflowY:"auto",animation:"popIn .35s"}}><div style={{textAlign:"center",padding:"32px 32px 20px"}}><Logo size={80}/><div style={{fontSize:28,fontWeight:900,color:"#3d3520",marginTop:14}}>{"DokunSay"}</div><div style={{fontSize:15,fontWeight:700,color:P.accentD,marginBottom:12}}>{"Saat Öğretim Materyali"}</div><div style={{width:50,height:4,borderRadius:2,background:P.accent,margin:"0 auto 16px"}}/><div style={{fontSize:13,color:"#666",lineHeight:1.7,textAlign:"left",padding:"0 8px"}}>{"DokunSay Saat, somut manipülatif temelli öğretim yaklaşımıyla çocukların saat kavramını ve zaman okuma becerilerini geliştirmek amacıyla tasarlanmıştır."}</div></div><div style={{margin:"0 24px 20px",background:"#fff",borderRadius:16,padding:"16px 20px"}}><div style={{fontSize:11,fontWeight:800,textTransform:"uppercase",letterSpacing:2,color:"#3d3520",marginBottom:12}}>{"Geliştiriciler"}</div><div style={{display:"flex",alignItems:"center",gap:14,marginBottom:12}}><div style={{width:44,height:44,borderRadius:12,background:"linear-gradient(135deg,#fbbf24,#f59e0b)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>{"🎓"}</div><div style={{fontSize:15,fontWeight:900,color:"#3d3520"}}>{"Prof. Dr. Yılmaz Mutlu"}</div></div><div style={{display:"flex",alignItems:"center",gap:14}}><div style={{width:44,height:44,borderRadius:12,background:"linear-gradient(135deg,#93c5fd,#3b82f6)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>{"🎓"}</div><div style={{fontSize:15,fontWeight:900,color:"#3d3520"}}>{"Dr. İhsan Söylemez"}</div></div></div><div style={{padding:"0 32px 24px"}}><div style={{fontSize:12,color:"#999",fontStyle:"italic",lineHeight:1.7,marginBottom:16}}>{"Diskalkuli ve matematik öğrenme güçlüğü yaşayan çocuklar başta olmak üzere tüm öğrencilerin saati somut deneyimlerle öğrenmelerini hedefler."}</div><div style={{fontSize:11,color:"#ccc",textAlign:"center",marginBottom:16}}>{"v1.0.0"}</div><button onClick={function(){setAbO(false);}} style={{width:"100%",padding:"12px 0",borderRadius:14,border:"none",background:"linear-gradient(135deg,"+P.accent+","+P.accentD+")",color:"#fff",fontSize:15,fontWeight:800,cursor:"pointer"}}>{"Kapat"}</button></div></div></div>:null}
      {tcO?<div onClick={function(){setTcO(false);}} style={{position:"fixed",inset:0,zIndex:9999,background:"rgba(0,0,0,.45)",display:"flex",alignItems:"center",justifyContent:"center"}}><div onClick={function(e){e.stopPropagation();}} style={{background:"#fff",borderRadius:24,padding:"28px 32px",maxWidth:580,width:"92%",maxHeight:"90vh",overflowY:"auto",animation:"popIn .3s"}}>
        <div style={{fontSize:22,fontWeight:900,marginBottom:16}}>{"👨‍🏫 Öğretmen Paneli"}</div>
        {/* Öğrenci bilgileri */}
        <div style={{background:"rgba(59,130,246,.04)",borderRadius:14,padding:"14px",marginBottom:14,border:"1.5px solid rgba(59,130,246,.12)"}}>
          <div style={{fontSize:10,fontWeight:800,color:P.blue,marginBottom:8}}>{"👤 Öğrenci Bilgileri"}</div>
          <div style={{display:"flex",gap:8}}>
            <input value={stuName} onChange={function(e){setStuName(e.target.value);}} placeholder="Öğrenci adı..." style={{flex:2,padding:"7px 10px",borderRadius:8,border:"1.5px solid #ddd",fontSize:12,fontFamily:"inherit",outline:"none",boxSizing:"border-box"}}/>
            <input value={stuClass} onChange={function(e){setStuClass(e.target.value);}} placeholder="Sınıf..." style={{flex:1,padding:"7px 10px",borderRadius:8,border:"1.5px solid #ddd",fontSize:12,fontFamily:"inherit",outline:"none",boxSizing:"border-box"}}/>
          </div>
        </div>
        {/* Etkinlik ilerleme */}
        <div style={{background:"rgba(34,197,94,.04)",borderRadius:14,padding:"14px",marginBottom:14,border:"1.5px solid rgba(34,197,94,.12)"}}>
          <div style={{fontSize:10,fontWeight:800,color:P.green,marginBottom:8}}>{"✅ Etkinlik İlerlemesi — "+Object.keys(comp).length+"/"+ACTS.length}</div>
          <div style={{width:"100%",height:6,borderRadius:3,background:"#eee",marginBottom:8}}><div style={{height:6,borderRadius:3,background:P.green,width:(Object.keys(comp).length/ACTS.length*100)+"%",transition:"width .3s"}}/></div>
          <div style={{display:"flex",flexWrap:"wrap",gap:4}}>{ACTS.map(function(a,ai){var done=!!comp[a.n];return <div key={ai} onClick={function(){var nc=Object.assign({},comp);if(done)delete nc[a.n];else nc[a.n]=true;setComp(nc);}} style={{padding:"3px 8px",borderRadius:6,background:done?"rgba(34,197,94,.1)":"#f5f5f5",border:done?"1.5px solid rgba(34,197,94,.3)":"1px solid #e5e5e5",cursor:"pointer",fontSize:9,fontWeight:done?700:500,color:done?P.green:"#888"}}>{done?"✅ ":""}{a.n}</div>;})}</div>
        </div>
        {/* Ders planları */}
        <div style={{background:"rgba(139,92,246,.04)",borderRadius:14,padding:"14px",marginBottom:14,border:"1.5px solid rgba(139,92,246,.12)"}}>
          <div style={{fontSize:10,fontWeight:800,color:P.purple,marginBottom:8}}>{"📚 Ders Planları"}</div>
          {LESSONS.map(function(ls,li){var lActs=ls.acts||[];var lDone=lActs.filter(function(ai){return comp[ACTS[ai]&&ACTS[ai].n];}).length;var lTotal=lActs.length;return <div key={li} style={{padding:"8px 10px",marginBottom:4,borderRadius:8,background:"#fff",border:"1px solid rgba(0,0,0,.05)"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{fontSize:11,fontWeight:800,color:"#3d3520"}}>{ls.n}</span><span style={{fontSize:9,fontWeight:700,padding:"2px 6px",borderRadius:4,background:lDone===lTotal&&lTotal>0?"rgba(34,197,94,.1)":"rgba(0,0,0,.04)",color:lDone===lTotal&&lTotal>0?P.green:"#aaa"}}>{lDone+"/"+lTotal}</span></div>
            <div style={{fontSize:9,color:"#888",marginTop:2}}>{ls.d}</div>
          </div>;})}
        </div>
        {/* Oyun skorları */}
        {game?<div style={{background:"rgba(245,158,11,.04)",borderRadius:14,padding:"14px",marginBottom:14,border:"1.5px solid rgba(245,158,11,.12)"}}>
          <div style={{fontSize:10,fontWeight:800,color:P.accentD,marginBottom:8}}>{"🎮 Aktif Oyun Skoru"}</div>
          <div style={{display:"flex",gap:12,alignItems:"center"}}><div style={{fontSize:28,fontWeight:900,color:P.green}}>{"🏆 "+game.score+"/"+game.total}</div><div style={{fontSize:11,color:"#888"}}>{game.total>0?"Başarı: %"+Math.round(game.score/game.total*100):"Henüz soru yok"}</div></div>
        </div>:null}
        {/* Notlar */}
        <div style={{background:"rgba(245,158,11,.04)",borderRadius:14,padding:"14px",marginBottom:14,border:"1.5px solid rgba(245,158,11,.12)"}}>
          <div style={{fontSize:10,fontWeight:800,color:P.accentD,marginBottom:8}}>{"📝 Gözlem Notları"}</div>
          <textarea value={tNotes} onChange={function(e){setTNotes(e.target.value);}} placeholder="Öğrenci hakkında gözlemler, notlar..." rows={4} style={{width:"100%",padding:"8px",borderRadius:8,border:"1.5px solid #ddd",fontSize:12,fontFamily:"inherit",outline:"none",resize:"vertical",boxSizing:"border-box"}}/>
        </div>
        {/* Oturum özeti */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,marginBottom:14}}>
          <div style={{textAlign:"center",padding:"8px",background:"#f9f9f9",borderRadius:8}}><div style={{fontSize:20,fontWeight:900}}>{items.length}</div><div style={{fontSize:8,color:"#888"}}>{"Öğe"}</div></div>
          <div style={{textAlign:"center",padding:"8px",background:"#f9f9f9",borderRadius:8}}><div style={{fontSize:20,fontWeight:900,color:P.green}}>{Object.keys(comp).length}</div><div style={{fontSize:8,color:"#888"}}>{"Tamamlanan"}</div></div>
          <div style={{textAlign:"center",padding:"8px",background:"#f9f9f9",borderRadius:8}}><div style={{fontSize:20,fontWeight:900,color:P.blue}}>{ACTS.length-Object.keys(comp).length}</div><div style={{fontSize:8,color:"#888"}}>{"Kalan"}</div></div>
          <div style={{textAlign:"center",padding:"8px",background:"#f9f9f9",borderRadius:8}}><div style={{fontSize:20,fontWeight:900,color:P.accentD}}>{game?game.score:0}</div><div style={{fontSize:8,color:"#888"}}>{"Oyun Skor"}</div></div>
        </div>
        {/* Butonlar */}
        <div style={{display:"flex",gap:8,justifyContent:"center"}}>
          <button onClick={function(){setComp({});setStuName("");setStuClass("");setTNotes("");}} style={{padding:"8px 20px",borderRadius:10,border:"1.5px solid "+P.red,background:"rgba(239,68,68,.04)",cursor:"pointer",fontSize:12,fontWeight:700,color:P.red,fontFamily:"inherit"}}>{"↺ Sıfırla"}</button>
          <button onClick={function(){var d={student:stuName,class:stuClass,notes:tNotes,completed:Object.keys(comp),completedCount:Object.keys(comp).length,totalActivities:ACTS.length,gameScore:game?game.score:0,gameTotal:game?game.total:0,itemsOnCanvas:items.length,date:new Date().toLocaleDateString("tr-TR"),time:new Date().toLocaleTimeString("tr-TR"),lessons:LESSONS.map(function(ls){var lA=ls.acts||[];return{name:ls.n,completed:lA.filter(function(ai){return comp[ACTS[ai]&&ACTS[ai].n];}).length,total:lA.length};})};var b=new Blob([JSON.stringify(d,null,2)],{type:"application/json"});var l=document.createElement("a");l.download=(stuName||"ogrenci").replace(/\s+/g,"_")+"_rapor_"+new Date().toISOString().slice(0,10)+".json";l.href=URL.createObjectURL(b);l.click();}} style={{padding:"8px 20px",borderRadius:10,border:"1.5px solid "+P.blue,background:"rgba(59,130,246,.04)",cursor:"pointer",fontSize:12,fontWeight:700,color:P.blue,fontFamily:"inherit"}}>{"📥 Rapor İndir"}</button>
          <button onClick={function(){setTcO(false);}} style={{padding:"8px 24px",borderRadius:10,border:"none",background:"linear-gradient(135deg,"+P.accent+","+P.accentD+")",color:"#fff",fontSize:12,fontWeight:800,cursor:"pointer",fontFamily:"inherit"}}>{"Kapat"}</button>
        </div>
      </div></div>:null}
    </div>);
}
