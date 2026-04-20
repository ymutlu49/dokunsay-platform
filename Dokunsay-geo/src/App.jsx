// ══════════════════════════════════════════════════════════
// DokunSay Geo — Van Hiele Geometri Öğretim Uygulaması v1.1
// Prof. Dr. Yılmaz Mutlu | WCAG 2.1 AA
//
// Modüler sürüm: Bu dosya uygulamanın kökünü oluşturur. Sabitler,
// OOP şekil sınıfları, yardımcılar ve bileşenler alt modüllerde yer alır.
// ══════════════════════════════════════════════════════════
import { useState, useReducer, useRef, useEffect, useCallback } from 'react';

import { P, CAT_META, CAT_ORDER } from './constants/palette.js';
import { SHAPE_DEF, BY_CAT } from './constants/shapes2d.js';
import { SHAPE_3D } from './constants/shapes3d.jsx';
import { PHASE_SEQUENCES } from './constants/phases.js';
import { MISCONCEPTIONS, getMisconceptions } from './constants/misconceptions.js';
import { VH_LEVELS } from './constants/vhLevels.js';
import { VH_ACTS_OLD } from './constants/activities.js';
import { LANGS } from './constants/i18n.js';

import { TTS } from './lib/tts.js';

import { project3D, isoProject, symmCount, toPoints } from './utils/geometry.js';
import { nextId } from './utils/id.js';
import { canvasReducer, INITIAL_CANVAS_STATE } from './hooks/canvasReducer.js';

import { BgGrid } from './components/Canvas/BgGrid.jsx';
import { AngleLabels } from './components/Canvas/AngleLabels.jsx';
import { ShapeEl } from './components/Canvas/ShapeEl.jsx';
import { PropsPanel } from './components/Props/PropsPanel.jsx';
import { ActivityCard } from './components/Activities/ActivityCard.jsx';
import { PhaseSequenceCard } from './components/Activities/PhaseSequenceCard.jsx';
import { VHBadge } from './components/Common/VHBadge.jsx';
import { SpeakButton } from './components/Common/SpeakButton.jsx';
import { Toggle } from './components/Common/Toggle.jsx';

export default function App(){
  const [state,dispatch]=useReducer(canvasReducer,{items:[],strokes:[],history:[],future:[],selectedId:null});
  const {items,strokes,selectedId}=state;

  // FIX8: localStorage kalıcılık
  const [lang,setLangRaw]=useState(()=>localStorage.getItem("dg_lang")||"tr");
  const [score,setScore]=useState(()=>parseInt(localStorage.getItem("dg_score")||"0"));
  const [showSides,setShowSides]=useState(()=>localStorage.getItem("dg_sides")==="1");
  const [showAngles,setShowAngles]=useState(()=>localStorage.getItem("dg_angles")==="1");
  const [colorBlind,setColorBlind]=useState(()=>localStorage.getItem("dg_cb")==="1");
  /* Diskalküli modu: büyük dokunma hedefleri, azaltılmış bilişsel yük,
     yüksek kontrast. Kaynak: Apostolidou (2025), Butterworth (2018). */
  const [dyscalcMode,setDyscalcMode]=useState(()=>localStorage.getItem("dg_dys")==="1");
  /* Sesli anlatım (TTS) — diskalküli için multisensör girdisi (Apostolidou 2025).
     Varsayılan olarak AÇIK çünkü hedef kitle özel ihtiyaç öğrencileri. */
  const [ttsOn,setTtsOn]=useState(()=>{
    const v=localStorage.getItem("dg_tts");
    return v===null?true:v==="1";
  });

  function setLang(l){setLangRaw(l);localStorage.setItem("dg_lang",l);}
  function addScore(n){setScore(s=>{const ns=s+n;localStorage.setItem("dg_score",ns);return ns;});}

  const L=LANGS[lang]||LANGS.tr;
  const t=k=>L[k]??LANGS.tr[k]??k;

  const [tool,setTool]=useState("select");
  const [stampType,setStampType]=useState(null);
  const [sideTab,setSideTab]=useState("shapes");
  /* Kanvas modu: "free" (serbest geometri) | "geoboard" | "tangram" | "3d"
     Sekmeye göre otomatik değişir. */
  const [canvasMode,setCanvasMode]=useState("free");
  /* ═══ ÖĞRETMEN PANOSU ═══
     Ders planı mimarisi:
     - planDraft: öğretmenin kurmakta olduğu plan
     - activePlan: şu an öğrencinin yürüttüğü plan (null = serbest mod)
     - planProgress: öğrencinin ilerlemesi (kayıt: etkinlik id → {tamamlandı, süre, skor})
     Bütün veri localStorage'da saklanır; JSON olarak export/import edilir. */
  const [planDraft,setPlanDraft]=useState(()=>{
    try{const saved=localStorage.getItem("dg_plan_draft");
      return saved?JSON.parse(saved):{name:"",level:0,items:[],createdAt:null};
    }catch(e){return {name:"",level:0,items:[],createdAt:null};}
  });
  const [activePlan,setActivePlan]=useState(()=>{
    try{const saved=localStorage.getItem("dg_active_plan");
      return saved?JSON.parse(saved):null;
    }catch(e){return null;}
  });
  const [planProgress,setPlanProgress]=useState(()=>{
    try{const saved=localStorage.getItem("dg_plan_progress");
      return saved?JSON.parse(saved):{};
    }catch(e){return {};}
  });
  const [planStep,setPlanStep]=useState(0);   // öğrenci hangi adımda
  const [planStartTime,setPlanStartTime]=useState(null);
  const [planExpandedItem,setPlanExpandedItem]=useState(null); // hangi etkinlik genişletildi (yanlış kavramlar paneli)
  /* Öğrenci ilerleme raporu görüntüleyici — öğretmen öğrencinin JSON'unu yükleyip görür */
  const [viewedReport,setViewedReport]=useState(null);
  /* Öğretmen panosu verilerini localStorage ile senkronize et */
  useEffect(()=>{localStorage.setItem("dg_plan_draft",JSON.stringify(planDraft));},[planDraft]);
  useEffect(()=>{
    if(activePlan) localStorage.setItem("dg_active_plan",JSON.stringify(activePlan));
    else localStorage.removeItem("dg_active_plan");
  },[activePlan]);
  useEffect(()=>{localStorage.setItem("dg_plan_progress",JSON.stringify(planProgress));},[planProgress]);

  const [bgType,setBgType]=useState("grid");
  const [zoom,setZoom]=useState(1);
  const [vhLevel,setVhLevel]=useState(0);
  /* Van Hiele seviye ilerleme takibi:
     levelProgress: {0:{correct:2,attempted:3,acts:['l0_a','l0_b']}, 1:{...}, 2:{...}}
     levelUnlocked: hangi seviyeler açık — L0 hep açık, sonrakiler geçiş kriterine bağlı */
  const [levelProgress,setLevelProgress]=useState(()=>{
    try{const s=localStorage.getItem("vhProgress");return s?JSON.parse(s):{0:{correct:0,attempted:0,acts:[]},1:{correct:0,attempted:0,acts:[]},2:{correct:0,attempted:0,acts:[]}};}
    catch(e){return {0:{correct:0,attempted:0,acts:[]},1:{correct:0,attempted:0,acts:[]},2:{correct:0,attempted:0,acts:[]}};}
  });
  /* Kaydet — her değişiklikte */
  useEffect(()=>{
    try{localStorage.setItem("vhProgress",JSON.stringify(levelProgress));}catch(e){}
  },[levelProgress]);
  /* Bir seviyenin açık olup olmadığını belirle */
  function isLevelUnlocked(lv){
    if(lv===0) return true;
    const prev=levelProgress[lv-1];
    if(!prev) return false;
    const crit=VH_LEVELS[lv-1].passCriteria;
    return prev.correct>=crit.minCorrect && prev.acts.length>=crit.minActivities;
  }
  /* Doğru cevap kaydet */
  function recordLevelAnswer(lv,actId,isCorrect){
    setLevelProgress(p=>{
      const cur=p[lv]||{correct:0,attempted:0,acts:[]};
      const acts=cur.acts.includes(actId)?cur.acts:[...cur.acts,actId];
      return {
        ...p,
        [lv]:{
          correct:cur.correct+(isCorrect?1:0),
          attempted:cur.attempted+1,
          acts,
        }
      };
    });
  }
  const [actIdx,setActIdx]=useState(0);
  /* Etkinlik modu: "quick" (hızlı quiz) veya "seq" (Van Hiele 5-faz dizisi) */
  const [actMode,setActMode]=useState("quick");
  const [seqIdx,setSeqIdx]=useState("sq_seq");
  /* Tangram modu: "sil" (silüet doldurma) veya "keşif" (Siew 2013 parça-bütün dönüşümü) */
  const [tanMode,setTanMode]=useState("sil");
  const [tanDiscIdx,setTanDiscIdx]=useState(0);
  const [tanDiscSel,setTanDiscSel]=useState(null);
  const [tanDiscFb,setTanDiscFb]=useState(null);
  const [tanDiscShowHint,setTanDiscShowHint]=useState(false);
  /* Sürükleme durumu: aktif şekil sürüklenirken silme alanı aydınlanır */
  const [isDragging,setIsDragging]=useState(false);
  const [deleteHover,setDeleteHover]=useState(false);
  /* Özellikler paneli artık otomatik açılmıyor — sadece ℹ butonuyla açılır.
     Kenar etiketleri seçili şekilde görünür; detay için panel isteğe bağlı. */
  const [showProps,setShowProps]=useState(false);
  /* 3B şekil durumu: serbest mod — birden fazla cisim, her biri bağımsız.
     Her cisim: {id, type, x, y, size, yaw, color, unfolded} */
  const [solids3D,setSolids3D]=useState([]);
  const [selected3DId,setSelected3DId]=useState(null);
  /* Eski "tek tip" için geriye dönük uyumluluk: sidebar'dan ekleme yapılırken kullanılır */
  const [solid3DType,setSolid3DType]=useState("cube");
  /* Yeni şekil seçildiğinde panel kapansın — önceki şeklin panelinde kalmasın */
  useEffect(()=>{setShowProps(false);},[selectedId]);
  const [penColor,setPenColor]=useState("#6366f1");
  const [penWidth,setPenWidth]=useState(2.5);
  const [rulerPts,setRulerPts]=useState([]);
  const [protrPos,setProtrPos]=useState(null);
  /* Açı ölçer: 3 nokta tıklanır.
     [0]=köşe noktası, [1]=birinci kenar ucu, [2]=ikinci kenar ucu.
     atan2 ile iki vektör arasındaki açı hesaplanır. */
  const [anglePts,setAnglePts]=useState([]);
  const [symmPts,setSymmPts]=useState([]);
  const [isFullscreen,setIsFullscreen]=useState(false);
  const [snapToGrid,setSnapToGrid]=useState(true);
  /* Tangram */
  const [tanPuzzle,setTanPuzzle]=useState(0);
  const [tanPlaced,setTanPlaced]=useState([]); // placed piece ids
  /* Silüeti kanvasta hayalet olarak göster */
  const [tanShowGhost,setTanShowGhost]=useState(false);
  const TAN_PUZZLES=[
    {name:"Kare",nameKu:"Çaryalî",nameEn:"Square",
     path:"M 0 0 L 80 0 L 80 80 L 0 80 Z",cx:300,cy:200},
    {name:"Ev",nameKu:"Mal",nameEn:"House",
     path:"M 0 40 L 40 0 L 80 40 L 80 80 L 0 80 Z",cx:300,cy:200},
    {name:"Balık",nameKu:"Masî",nameEn:"Fish",
     path:"M 0 40 L 40 0 L 80 40 L 40 60 Z",cx:300,cy:200},
    {name:"Köpek",nameKu:"Kûçik",nameEn:"Dog",
     path:"M 10 60 L 0 30 L 30 0 L 80 30 L 80 60 L 50 80 L 10 80 Z",cx:300,cy:200},
    {name:"Kaz",nameKu:"Qaz",nameEn:"Goose",
     path:"M 0 60 L 0 30 L 30 0 L 60 0 L 80 30 L 60 60 L 40 80 L 0 80 Z",cx:300,cy:200},
  ];
  /* TANGRAM PARÇA BOYUTLARI — Silüet ölçeğine göre doğru hesaplanmış.
     Silüet 80×80 birim, kanvasta scale=5 → 400×400 piksel.
     Tam tangram karesi = 1 "tangram birimi" = 400 piksel.
     Standart tangram parça oranları:
       - Büyük üçgen: dik kenar = √2/2 ≈ 0.707 birim (alanı 1/4)
       - Orta üçgen: dik kenar = 0.5 birim (alanı 1/8)
       - Küçük üçgen: dik kenar = √2/4 ≈ 0.354 birim (alanı 1/16)
       - Kare: kenar = √2/4 ≈ 0.354 birim (alanı 1/8)
       - Paralelkenar: 0.354 × 0.5 birim (alanı 1/8)
     right_tri size parametresi: dik kenar = s*0.9 → s = dikKenarPx / 0.9
     square size parametresi: kenar = s*0.96 → s = kenarPx / 0.96
     parallelogram size: uzun taban = s*0.9, yükseklik = s*0.66 */
  const TAN_UNIT=400;
  const TAN_PIECES=[
    {id:"t1",type:"right_tri",label:"Büyük Üçgen 1",
     size:Math.round(TAN_UNIT*0.707/0.9), // ≈ 314
     color:"#ef4444",
     iconSvg:(c)=>(
       <svg viewBox="0 0 24 24" width="1em" height="1em" style={{display:"block"}} fill={c+"30"} stroke={c} strokeWidth="1.5" strokeLinejoin="round">
         <polygon points="3,19 21,19 12,5"/>
       </svg>
     )},
    {id:"t2",type:"right_tri",label:"Büyük Üçgen 2",
     size:Math.round(TAN_UNIT*0.707/0.9),
     color:"#3b82f6",
     iconSvg:(c)=>(
       <svg viewBox="0 0 24 24" width="1em" height="1em" style={{display:"block"}} fill={c+"30"} stroke={c} strokeWidth="1.5" strokeLinejoin="round">
         <polygon points="3,19 21,19 12,5"/>
       </svg>
     )},
    {id:"t3",type:"right_tri",label:"Orta Üçgen",
     size:Math.round(TAN_UNIT*0.5/0.9), // ≈ 222
     color:"#8b5cf6",
     iconSvg:(c)=>(
       <svg viewBox="0 0 24 24" width="1em" height="1em" style={{display:"block"}} fill={c+"30"} stroke={c} strokeWidth="1.5" strokeLinejoin="round">
         <polygon points="5,17 19,17 12,8"/>
       </svg>
     )},
    {id:"t4",type:"right_tri",label:"Küçük Üçgen 1",
     size:Math.round(TAN_UNIT*0.354/0.9), // ≈ 157
     color:"#f59e0b",
     iconSvg:(c)=>(
       <svg viewBox="0 0 24 24" width="1em" height="1em" style={{display:"block"}} fill={c+"30"} stroke={c} strokeWidth="1.5" strokeLinejoin="round">
         <polygon points="7,16 17,16 12,10"/>
       </svg>
     )},
    {id:"t5",type:"right_tri",label:"Küçük Üçgen 2",
     size:Math.round(TAN_UNIT*0.354/0.9),
     color:"#10b981",
     iconSvg:(c)=>(
       <svg viewBox="0 0 24 24" width="1em" height="1em" style={{display:"block"}} fill={c+"30"} stroke={c} strokeWidth="1.5" strokeLinejoin="round">
         <polygon points="7,16 17,16 12,10"/>
       </svg>
     )},
    {id:"t6",type:"square",label:"Küçük Kare",
     size:Math.round(TAN_UNIT*0.354/0.96), // ≈ 148
     color:"#f97316",
     iconSvg:(c)=>(
       <svg viewBox="0 0 24 24" width="1em" height="1em" style={{display:"block"}} fill={c+"30"} stroke={c} strokeWidth="1.5" strokeLinejoin="round">
         <polygon points="12,6 18,12 12,18 6,12"/>
       </svg>
     )},
    {id:"t7",type:"parallelogram",label:"Paralelkenar",
     size:Math.round(TAN_UNIT*0.5/0.9), // ≈ 222
     color:"#06b6d4",
     iconSvg:(c)=>(
       <svg viewBox="0 0 24 24" width="1em" height="1em" style={{display:"block"}} fill={c+"30"} stroke={c} strokeWidth="1.5" strokeLinejoin="round">
         <polygon points="4,16 12,8 20,8 12,16"/>
       </svg>
     )},
  ];
  /* Geometri Tahtası yeni mimari:
     - geoLines: aktif açık zincirin çizgileri (halka tamamlanmadı)
     - geoShapes: tamamlanmış kapalı çokgenler (her biri renkli)
     - geoGridSize: 5, 7, veya 11
     - geoColor: şu anki çizim rengi
     - geoHistory: geri al için */
  const [geoLines,setGeoLines]=useState([]);
  const [geoStart,setGeoStart]=useState(null);
  const [geoShapes,setGeoShapes]=useState([]); // {pts:[{r,c},...], color:"#..."}
  const [geoGridSize,setGeoGridSize]=useState(5);
  const [geoColor,setGeoColor]=useState("#6366f1");
  const [geoHoverPt,setGeoHoverPt]=useState(null); // kauçuk bant önizleme için
  const [selectedGeoShapeIdx,setSelectedGeoShapeIdx]=useState(null); // sidebar'da/kanvasta seçili şekil
  // FIX7: stamp önizleme
  const [mousePos,setMousePos]=useState(null);

  const svgRef=useRef(null);
  const mainRef=useRef(null);
  const drawing=useRef(false);
  const curStroke=useRef([]);
  const dragRef=useRef(null);
  /* Döndürme/boyutlandırma referansları — şekil seçili iken tutamağa basılınca aktif */
  const rotateRef=useRef(null);   // {id, cx, cy, startAngle, origRotation}
  const resizeRef=useRef(null);   // {id, cx, cy, startDist, origSize}
  /* Kenar uzatma referansı — dikdörtgen, paralelkenar, eşkenar dörtgen için.
     Seçili kenarın dik yönünde çekme → sadece o eksen değişir. */
  const edgeResizeRef=useRef(null); // {id, edge, cx, cy, rot, startAx, startAy, startX, startY}
  const ariaRef=useRef(null); // FIX12

  useEffect(()=>{
    const fn=()=>setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange",fn);
    return()=>document.removeEventListener("fullscreenchange",fn);
  },[]);

  // FIX6: Klavye kısayolları
  useEffect(()=>{
    function onKey(e){
      if(e.target.tagName==="INPUT"||e.target.tagName==="TEXTAREA") return;
      const sel=items.find(it=>it.id===selectedId);
      if(e.key==="Delete"&&sel){dispatch({type:"DEL",id:selectedId});}
      if(e.key==="Escape"){dispatch({type:"DESELECT"});setStampType(null);setTool("select");}
      if(e.key==="r"&&sel){dispatch({type:"ROTATE",id:selectedId,deg:(sel.rotation||0)+15});}
      if(e.key==="+"&&sel){dispatch({type:"RESIZE",id:selectedId,s:sel.size+10});}
      if(e.key==="-"&&sel){dispatch({type:"RESIZE",id:selectedId,s:sel.size-10});}
    }
    window.addEventListener("keydown",onKey);
    return()=>window.removeEventListener("keydown",onKey);
  },[selectedId,items]);

  function toggleFs(){
    if(!document.fullscreenElement) mainRef.current?.requestFullscreen?.();
    else document.exitFullscreen?.();
  }

  // FIX2: getScreenCTM ile doğru SVG koordinatı
  function svgXY(e){
    const svg=svgRef.current; if(!svg) return {x:0,y:0};
    const pt=svg.createSVGPoint();
    pt.x=e.clientX; pt.y=e.clientY;
    const m=svg.getScreenCTM();
    if(!m) return {x:0,y:0};
    const inv=m.inverse();
    const r=pt.matrixTransform(inv);
    return {x:r.x,y:r.y};
  }

  function onSvgDown(e){
    const {x,y}=svgXY(e);
    if(tool==="stamp"&&stampType){
      dispatch({type:"ADD",t:stampType,x,y,s:180,snap:snapToGrid});
      /* Tek tıklama, tek şekil: yerleştirdikten sonra seçime dön */
      setStampType(null);
      setTool("select");
      return;
    }
    if(tool==="ruler"){setRulerPts(p=>p.length>=2?[{x,y}]:[...p,{x,y}]);return;}
    if(tool==="protractor"){setProtrPos({x,y});return;}
    if(tool==="angle"){setAnglePts(p=>p.length>=3?[{x,y}]:[...p,{x,y}]);return;}
    if(tool==="symmetry"){setSymmPts(p=>p.length>=2?[{x,y}]:[...p,{x,y}]);return;}
    if(tool==="draw"){drawing.current=true;curStroke.current=[{x,y}];return;}
    dispatch({type:"DESELECT"});
  }

  function onSvgMove(e){
    const {x,y}=svgXY(e);
    setMousePos({x,y});
    /* 3B cisim sürükleme */
    if(shape3dDragRef.current){
      const d=shape3dDragRef.current;
      update3DSolid(d.id,{x:x-d.ox, y:y-d.oy});
      return;
    }
    /* 3B yaw döndürme — yatay fare hareketi yaw'a maps edilir */
    if(shape3dYawRef.current){
      const r=shape3dYawRef.current;
      const deltaX=x-r.startX;
      /* 300 piksel = 180 derece (hassas kontrol) */
      const newYaw=r.startYaw+deltaX*0.6;
      update3DSolid(r.id,{yaw:newYaw});
      return;
    }
    /* Kenar tutamacı aktif — rotasyonu çöz, yerel eksende fare hareketini uygula */
    if(edgeResizeRef.current){
      const r=edgeResizeRef.current;
      /* Fare hareketini şekil merkezine göre vektör olarak al */
      const dx=x-r.cx, dy=y-r.cy;
      /* Ters rotasyon uygulayarak yerel koordinat sistemine çevir */
      const lx=dx*Math.cos(-r.rot)-dy*Math.sin(-r.rot);
      const ly=dx*Math.sin(-r.rot)+dy*Math.cos(-r.rot);
      /* Başlangıç farkını da yerel koordinata çevir */
      const sdx=r.startX-r.cx, sdy=r.startY-r.cy;
      const slx=sdx*Math.cos(-r.rot)-sdy*Math.sin(-r.rot);
      const sly=sdx*Math.sin(-r.rot)+sdy*Math.cos(-r.rot);
      /* Oran faktörleri: yerel uzaklık / başlangıç yerel uzaklık */
      if(r.edge==="left"||r.edge==="right"){
        const sign=r.edge==="right"?1:-1;
        const ratio=Math.max(0.3, Math.min(3.0, (sign*lx)/(sign*slx)));
        dispatch({type:"EDGE_RESIZE",id:r.id,ax:r.startAx*ratio,ay:r.startAy});
      } else {
        const sign=r.edge==="bottom"?1:-1;
        const ratio=Math.max(0.3, Math.min(3.0, (sign*ly)/(sign*sly)));
        dispatch({type:"EDGE_RESIZE",id:r.id,ax:r.startAx,ay:r.startAy*ratio});
      }
      return;
    }
    /* Döndürme tutamacı aktif — fare hareketine göre atan2 ile açı hesapla */
    if(rotateRef.current){
      const r=rotateRef.current;
      const curAngle=Math.atan2(y-r.cy, x-r.cx);
      const deltaRad=curAngle-r.startAngle;
      let newRot=r.origRotation+deltaRad*180/Math.PI;
      /* Shift basılıysa 15° aralıklara yaslan (pedagojik standart açılar) */
      if(e.shiftKey) newRot=Math.round(newRot/15)*15;
      dispatch({type:"ROTATE",id:r.id,deg:newRot});
      return;
    }
    /* Boyutlandırma tutamacı aktif — mesafe oranı kadar ölçekle */
    if(resizeRef.current){
      const r=resizeRef.current;
      const curDist=Math.hypot(x-r.cx, y-r.cy);
      const ratio=curDist/Math.max(1,r.startDist);
      const newSize=Math.max(40, Math.min(400, r.origSize*ratio));
      dispatch({type:"RESIZE",id:r.id,s:newSize});
      return;
    }
    if(dragRef.current){
      dispatch({type:"MOVE",id:dragRef.current.id,x:x-dragRef.current.ox,y:y-dragRef.current.oy,snap:snapToGrid});
      /* Silme alanı algılaması — piksel koordinatı üzerinden, div overlay'e bağlı değil */
      const svg=svgRef.current;
      if(svg){
        const rect=svg.getBoundingClientRect();
        const py=e.clientY-rect.top;
        const inDeleteZone=py>rect.height-64;
        if(inDeleteZone!==deleteHover) setDeleteHover(inDeleteZone);
      }
      return;
    }
    if(drawing.current){
      curStroke.current=[...curStroke.current,{x,y}];
      const tmp=svgRef.current?.querySelector("#tmp");
      if(tmp) tmp.setAttribute("points",curStroke.current.map(p=>`${p.x},${p.y}`).join(" "));
    }
  }

  function onSvgUp(e){
    /* 3B tutamaçları */
    if(shape3dDragRef.current){shape3dDragRef.current=null;return;}
    if(shape3dYawRef.current){shape3dYawRef.current=null;return;}
    /* Döndürme/boyutlandırma tutamaçları bırakıldı — referansı temizle */
    if(edgeResizeRef.current){edgeResizeRef.current=null;return;}
    if(rotateRef.current){rotateRef.current=null;return;}
    if(resizeRef.current){resizeRef.current=null;return;}
    if(dragRef.current){
      const wasDragging=isDragging;
      const dragId=dragRef.current.id;
      dragRef.current=null;
      setIsDragging(false);
      /* Silme alanına bırakıldı mı? */
      if(wasDragging&&deleteHover){
        dispatch({type:"DEL",id:dragId});
      }
      setDeleteHover(false);
      return;
    }
    if(drawing.current){
      drawing.current=false;
      if(curStroke.current.length>1) dispatch({type:"STROKE",sk:{pts:curStroke.current,color:penColor,width:penWidth}});
      curStroke.current=[];
      const tmp=svgRef.current?.querySelector("#tmp");
      if(tmp) tmp.setAttribute("points","");
    }
  }

  function onShapeDown(e,id){
    e.stopPropagation();
    if(tool==="erase"){dispatch({type:"DEL",id});return;}
    dispatch({type:"SELECT",id});
    const it=items.find(i=>i.id===id);
    if(it){const{x,y}=svgXY(e);dragRef.current={id,ox:x-it.x,oy:y-it.y};setIsDragging(true);}
  }

  /* Döndürme tutamacı — tutamak yakalandığında başlangıç açısını kaydet */
  function onRotateStart(e,id){
    e.stopPropagation();
    const it=items.find(i=>i.id===id);
    if(!it) return;
    const {x,y}=svgXY(e);
    /* Fare ile şekil merkezi arasındaki başlangıç açısı (radyan) */
    const startAngle=Math.atan2(y-it.y, x-it.x);
    rotateRef.current={id, cx:it.x, cy:it.y, startAngle, origRotation:it.rotation||0};
  }

  /* Boyutlandırma tutamacı — tutamak yakalandığında başlangıç mesafesini kaydet */
  function onResizeStart(e,id){
    e.stopPropagation();
    const it=items.find(i=>i.id===id);
    if(!it) return;
    const {x,y}=svgXY(e);
    const startDist=Math.hypot(x-it.x, y-it.y);
    resizeRef.current={id, cx:it.x, cy:it.y, startDist, origSize:it.size};
  }

  /* Kenar tutamacı — seçili kenarın ait olduğu eksene göre ax veya ay değiştirilir.
     top/bottom → ay (dikey), left/right → ax (yatay).
     Rotasyonlu şekilde: fare hareketi şeklin yerel koordinat sistemine çevrilir. */
  function onEdgeResizeStart(e,id,edge){
    e.stopPropagation();
    const it=items.find(i=>i.id===id);
    if(!it) return;
    const {x,y}=svgXY(e);
    edgeResizeRef.current={
      id, edge, cx:it.x, cy:it.y, rot:(it.rotation||0)*Math.PI/180,
      startAx:it.ax||1, startAy:it.ay||1, startX:x, startY:y,
    };
  }

  /* ═══ 3B Cisim Yönetimi ═══ */
  const shape3dDragRef=useRef(null);   // {id, ox, oy}
  const shape3dYawRef=useRef(null);    // {id, startX, startYaw}

  function add3DSolid(type){
    const id="s3d_"+Date.now()+"_"+Math.random().toString(36).slice(2,6);
    const newSolid={
      id, type,
      x:200+Math.random()*500,
      y:180+Math.random()*200,
      size:200,
      yaw:-45,      // varsayılan izometrik yaw
      color:"#0891b2",
      unfolded:false,
    };
    setSolids3D(s=>[...s,newSolid]);
    setSelected3DId(id);
  }
  function update3DSolid(id,patch){
    setSolids3D(s=>s.map(sol=>sol.id===id?{...sol,...patch}:sol));
  }
  function delete3DSolid(id){
    setSolids3D(s=>s.filter(sol=>sol.id!==id));
    if(selected3DId===id) setSelected3DId(null);
  }
  function on3DShapeDown(e,id){
    e.stopPropagation();
    setSelected3DId(id);
    const sol=solids3D.find(s=>s.id===id);
    if(!sol) return;
    const {x,y}=svgXY(e);
    shape3dDragRef.current={id, ox:x-sol.x, oy:y-sol.y};
  }
  function on3DYawStart(e,id){
    e.stopPropagation();
    const sol=solids3D.find(s=>s.id===id);
    if(!sol) return;
    const {x}=svgXY(e);
    shape3dYawRef.current={id, startX:x, startYaw:sol.yaw||-45};
  }

  const selected3D=solids3D.find(s=>s.id===selected3DId)||null;

  const selItem=items.find(it=>it.id===selectedId);
  const rdist=rulerPts.length===2?Math.round(Math.sqrt((rulerPts[1].x-rulerPts[0].x)**2+(rulerPts[1].y-rulerPts[0].y)**2)/10):null;
  const filtActs=VH_ACTS_OLD.filter(a=>a.level===vhLevel);
  const curAct=filtActs.length?filtActs[actIdx%filtActs.length]:null;
  /* Grid boyutuna göre dinamik nokta aralığı — toplam tahta boyu ~200px */
  const GS=geoGridSize;
  const GSP=GS===5?40:GS===7?28:18;  // 5:40, 7:28, 11:18 → ~160-180px

  /* ═══ Geometri Tahtası Yardımcıları ═══
     Pick teoremi (Pick 1899): A = I + B/2 - 1
       I = iç lattice noktaları, B = sınır lattice noktaları.
       Geoboard için doğru alan hesabı; Shoelace'den daha pedagojik. */

  /* Shoelace formülü ile alanı hesapla (piksel² birimde) */
  function geoShoelaceArea(pts){
    if(pts.length<3) return 0;
    let a=0;
    for(let i=0;i<pts.length;i++){
      const j=(i+1)%pts.length;
      a+=pts[i].c*pts[j].r - pts[j].c*pts[i].r;
    }
    return Math.abs(a)/2; // birim kare cinsinden
  }

  /* Çevre hesabı (birim cinsinden, Öklid mesafesi) */
  function geoPerimeter(pts){
    if(pts.length<2) return 0;
    let p=0;
    for(let i=0;i<pts.length;i++){
      const j=(i+1)%pts.length;
      p+=Math.hypot(pts[j].c-pts[i].c, pts[j].r-pts[i].r);
    }
    return p;
  }

  /* Şekil tanıma — basit kurallara dayalı */
  function geoShapeName(pts){
    const n=pts.length;
    if(n<3) return null;
    const names={
      tr:{3:"Üçgen",4:"Dörtgen",5:"Beşgen",6:"Altıgen",7:"Yedigen",8:"Sekizgen"},
      ku:{3:"Sêgoşe",4:"Çargoşe",5:"Pêncgoşe",6:"Şeşgoşe",7:"Heftgoşe",8:"Heştgoşe"},
      en:{3:"Triangle",4:"Quadrilateral",5:"Pentagon",6:"Hexagon",7:"Heptagon",8:"Octagon"},
    };
    const nm=names[lang]||names.tr;
    let base=nm[n]||`${n}-${lang==="ku"?"goşe":lang==="en"?"gon":"gen"}`;
    /* Özel tanıma: dörtgen için kare/dikdörtgen/eşkenar dörtgen tespiti */
    if(n===4){
      const sides=[];
      for(let i=0;i<4;i++){
        const j=(i+1)%4;
        sides.push(Math.hypot(pts[j].c-pts[i].c, pts[j].r-pts[i].r));
      }
      const allEqual=sides.every(s=>Math.abs(s-sides[0])<0.001);
      /* Dik açı kontrolü: ardışık iki kenarın iç çarpımı sıfır mı? */
      let allRight=true;
      for(let i=0;i<4;i++){
        const a={c:pts[(i+1)%4].c-pts[i].c, r:pts[(i+1)%4].r-pts[i].r};
        const b={c:pts[(i+2)%4].c-pts[(i+1)%4].c, r:pts[(i+2)%4].r-pts[(i+1)%4].r};
        if(Math.abs(a.c*b.c+a.r*b.r)>0.001) allRight=false;
      }
      if(allEqual&&allRight) base=lang==="ku"?"Çaryalî":lang==="en"?"Square":"Kare";
      else if(allRight) base=lang==="ku"?"Çarhêla Rast":lang==="en"?"Rectangle":"Dikdörtgen";
      else if(allEqual) base=lang==="ku"?"Lozeng":lang==="en"?"Rhombus":"Eşkenar Dörtgen";
    }
    /* Üçgen için eşkenar/ikizkenar */
    if(n===3){
      const sides=[];
      for(let i=0;i<3;i++){
        const j=(i+1)%3;
        sides.push(Math.hypot(pts[j].c-pts[i].c, pts[j].r-pts[i].r));
      }
      const eq01=Math.abs(sides[0]-sides[1])<0.001;
      const eq12=Math.abs(sides[1]-sides[2])<0.001;
      const eq02=Math.abs(sides[0]-sides[2])<0.001;
      if(eq01&&eq12) base=lang==="ku"?"Sêgoşeya Hêvkêlek":lang==="en"?"Equilateral Triangle":"Eşkenar Üçgen";
      else if(eq01||eq12||eq02) base=lang==="ku"?"Sêgoşeya Duhêvkêlek":lang==="en"?"Isosceles Triangle":"İkizkenar Üçgen";
    }
    return base;
  }

  // Geoboard → kanvasa aktar (şekiller ve aktif hatlar)
  function transferGeoboard(){
    if(geoLines.length===0&&geoShapes.length===0) return;
    const cx=450, cy=300, scale=2.0; // viewBox 900×600 merkez yakını
    /* Tamamlanmış kapalı şekilleri aktar */
    geoShapes.forEach(sh=>{
      const pts=sh.pts.map(p=>({
        x:(p.c-(GS-1)/2)*GSP*scale+cx,
        y:(p.r-(GS-1)/2)*GSP*scale+cy,
      }));
      /* Çokgen sınırlarını kapalı çizim olarak ekle */
      const closed=[...pts,pts[0]];
      dispatch({type:"STROKE",sk:{pts:closed,color:sh.color,width:3}});
    });
    /* Aktif (kapatılmamış) hatları da aktar */
    geoLines.forEach(ln=>{
      const x1=(ln.from.c-(GS-1)/2)*GSP*scale+cx;
      const y1=(ln.from.r-(GS-1)/2)*GSP*scale+cy;
      const x2=(ln.to.c-(GS-1)/2)*GSP*scale+cx;
      const y2=(ln.to.r-(GS-1)/2)*GSP*scale+cy;
      dispatch({type:"STROKE",sk:{pts:[{x:x1,y:y1},{x:x2,y:y2}],color:geoColor,width:2.5}});
    });
  }

  return (
    <div style={{display:"flex",flexDirection:"column",height:"100vh",overflow:"hidden",
      fontFamily:"'Nunito',system-ui,sans-serif",fontSize:14,color:P.text}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@600;700;800;900&display=swap');
        *{box-sizing:border-box}
        @keyframes slideDown{0%{transform:translateY(-12px);opacity:0}100%{transform:translateY(0);opacity:1}}
        @keyframes popIn{0%{transform:scale(.88);opacity:0}60%{transform:scale(1.04)}100%{transform:scale(1);opacity:1}}
        button:focus-visible{outline:2.5px solid ${P.accent};outline-offset:2px}
        ::-webkit-scrollbar{width:0;height:0}
        ${dyscalcMode?`
          /* Diskalküli modu: Apostolidou (2025), Butterworth (2018) araştırmalarına göre
             büyük dokunma hedefleri (WCAG 2.5.5 AAA: 44×44px+),
             yüksek kontrast (WCAG 1.4.6 AAA),
             azaltılmış bilişsel yük */
          body{font-size:16px!important}
          button{min-height:44px!important;font-size:14px!important}
          button[aria-pressed="true"]{border-width:3px!important;box-shadow:0 0 0 2px rgba(99,102,241,.3)!important}
          .shape-btn{min-height:64px!important}
        `:''}
      `}</style>

      {/* FIX12: ARIA live region */}
      <div ref={ariaRef} aria-live="polite" aria-atomic="true"
        style={{position:"absolute",width:1,height:1,overflow:"hidden",clip:"rect(0,0,0,0)",whiteSpace:"nowrap"}}/>

      {/* HEADER */}
      <header style={{height:46,minHeight:46,background:P.header,display:"flex",alignItems:"center",
        padding:"0 14px",gap:10,boxShadow:"0 2px 16px rgba(30,27,75,.3)",zIndex:10}}>
        <span aria-hidden style={{fontSize:20}}>📐</span>
        <span style={{fontSize:15,fontWeight:900,color:"#a5b4fc",letterSpacing:-.5}}>DokunSay Geo</span>
        <span style={{fontSize:10,color:"rgba(165,180,252,.4)",marginLeft:2}}>{t("appTitle")}</span>
        <div style={{display:"flex",gap:2,background:"rgba(255,255,255,.07)",borderRadius:8,padding:3,marginLeft:6}}>
          {Object.values(LANGS).map(lng=>(
            <button key={lng.code} onClick={()=>setLang(lng.code)} aria-pressed={lang===lng.code}
              aria-label={lng.name}
              style={{padding:"2px 7px",borderRadius:6,border:"none",cursor:"pointer",fontFamily:"inherit",
                background:lang===lng.code?"rgba(255,255,255,.2)":"transparent",
                color:lang===lng.code?"#fff":"rgba(255,255,255,.35)",fontSize:11,fontWeight:lang===lng.code?800:600}}>
              {lng.flag} {lng.name}
            </button>
          ))}
        </div>
        <div style={{flex:1}}/>
        <div style={{display:"flex",gap:3}}>
          {[0,1,2].map(lv=>{
            const lvData=VH_LEVELS[lv];
            const unlocked=isLevelUnlocked(lv);
            const prog=levelProgress[lv]||{correct:0,acts:[]};
            const done=prog.correct>=lvData.passCriteria.minCorrect&&prog.acts.length>=lvData.passCriteria.minActivities;
            return (
              <button key={lv} onClick={()=>{
                  if(!unlocked){
                    /* Kilitli seviye — sadece bilgi ver, geçiş kriterini göster */
                    alert(lang==="ku"
                      ?`Ev ast hîn ne vekirî ye. Ji bo vekirinê, asta berê biqedîne (${VH_LEVELS[lv-1].passCriteria.minCorrect} bersîva rast).`
                      :lang==="en"
                      ?`This level is locked. Complete previous level first (${VH_LEVELS[lv-1].passCriteria.minCorrect} correct answers).`
                      :`Bu seviye henüz kilitli. Önceki seviyeyi tamamla (${VH_LEVELS[lv-1].passCriteria.minCorrect} doğru cevap).`);
                    return;
                  }
                  setVhLevel(lv);setActIdx(0);setSideTab("act");
                }}
                aria-pressed={vhLevel===lv}
                aria-label={`${lvData.shortName[lang]||lvData.shortName.tr} — ${lvData.ageRange} yaş`}
                title={lvData.name[lang]||lvData.name.tr}
                style={{padding:"3px 10px",borderRadius:7,border:"none",
                  cursor:unlocked?"pointer":"not-allowed",fontFamily:"inherit",
                  background:vhLevel===lv?lvData.color+"33":"rgba(255,255,255,.07)",
                  color:vhLevel===lv?lvData.color:(unlocked?"rgba(255,255,255,.4)":"rgba(255,255,255,.25)"),
                  fontSize:11,fontWeight:vhLevel===lv?800:600,
                  opacity:unlocked?1:0.55,
                  position:"relative",
                  display:"flex",alignItems:"center",gap:3}}>
                {!unlocked&&<span style={{fontSize:9}}>🔒</span>}
                {done&&unlocked&&<span style={{fontSize:9,color:"#10b981"}}>✓</span>}
                <span>L{lv} {lvData.shortName[lang]||lvData.shortName.tr}</span>
              </button>
            );
          })}
        </div>
        <div style={{fontSize:10,color:"rgba(165,180,252,.4)",marginLeft:6,fontWeight:700}}>
          {items.length} {t("totalShapes")}
        </div>
        <div style={{fontSize:11,fontWeight:800,color:"#fbbf24",background:"rgba(251,191,36,.15)",
          padding:"2px 8px",borderRadius:6}}>
          {t("score")}: {score}
        </div>
      </header>

      <div style={{display:"flex",flex:1,overflow:"hidden"}}>

        {/* SOL SIDEBAR */}
        <nav aria-label={lang==="en"?"Tools":"Araçlar"} style={{width:218,minWidth:218,background:P.side,
          borderRight:"1px solid "+P.sideB,display:"flex",flexDirection:"column",
          boxShadow:"2px 0 10px rgba(99,102,241,.06)"}}>
          <div style={{display:"flex",borderBottom:"1px solid "+P.sideB,padding:"4px 4px 0",gap:1}}>
            {[["shapes","🔷",t("sideShapes")],["act","📋",t("sideAct")],
              ["tan","🧩","Tangram"],
              ["3d","🧊",lang==="ku"?"3B":lang==="en"?"3D":"3B"],
              ["geo","⚫",t("sideGeo")],
              ["teach","👩‍🏫",lang==="ku"?"Mamoste":lang==="en"?"Teacher":"Öğretmen"],
              ["set","⚙️",t("sideSet")]].map(([id,ic,lbl])=>(
              <button key={id} onClick={()=>{
                  setSideTab(id);
                  /* Kanvas modunu sekmeye göre ayarla */
                  if(id==="geo") setCanvasMode("geoboard");
                  else if(id==="tan") setCanvasMode("tangram");
                  else if(id==="3d") setCanvasMode("3d");
                  else setCanvasMode("free");
                }}
                aria-selected={sideTab===id}
                style={{flex:1,padding:"5px 1px",borderRadius:"7px 7px 0 0",border:"none",
                  background:sideTab===id?"#fff":"transparent",cursor:"pointer",fontFamily:"inherit",
                  fontSize:10,fontWeight:sideTab===id?800:600,
                  color:sideTab===id?P.accentD:"rgba(30,27,75,.4)",
                  borderBottom:sideTab===id?`2.5px solid ${P.accent}`:"2.5px solid transparent"}}>
                <div style={{fontSize:13}}>{ic}</div>{lbl}
              </button>
            ))}
          </div>

          {/* Şekiller */}
          {sideTab==="shapes"&&(
            <div style={{flex:1,overflowY:"auto",padding:"6px"}}>
              <div style={{display:"flex",gap:2,marginBottom:6,background:"rgba(99,102,241,.06)",borderRadius:7,padding:2}}>
                {[["select","🖱","Seç"],["draw","✏️","Çiz"],["erase","🗑","Sil"]].map(([id,ic,lbl])=>(
                  <button key={id} onClick={()=>{setTool(id);setStampType(null);}}
                    aria-pressed={tool===id}
                    style={{flex:1,padding:"3px 0",borderRadius:5,border:"none",cursor:"pointer",fontFamily:"inherit",
                      background:tool===id?P.accent:"transparent",color:tool===id?"#fff":"rgba(30,27,75,.5)",
                      fontSize:10,fontWeight:tool===id?800:600}}>
                    <div style={{fontSize:12}}>{ic}</div>{lbl}
                  </button>
                ))}
              </div>
              {CAT_ORDER.map(cat=>{
                const shapes=BY_CAT[cat]||[];
                const meta=CAT_META[cat];
                const catLbl=lang==="ku"?meta.labelKu:lang==="en"?meta.labelEn:meta.label;
                return (
                  <div key={cat} style={{marginBottom:8}}>
                    <div style={{fontSize:9,fontWeight:800,color:meta.colorB,textTransform:"uppercase",
                      letterSpacing:1.2,marginBottom:3,paddingLeft:2}}>{catLbl}</div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:3}}>
                      {shapes.map(sh=>{
                        const active=stampType===sh.key&&tool==="stamp";
                        const lbl=lang==="ku"?sh.labelKu:lang==="en"?sh.labelEn:sh.label;
                        /* Gerçek SVG şekli — Unicode ikona güvenmek yerine.
                           Octagon'un ⏾ (hilal) görünmesi gibi font tutarsızlıkları önlenir;
                           ayrıca pedagojik olarak doğru: butondaki şekil = yerleştirilecek şekil. */
                        const svgSize=28, cx=svgSize/2, cy=svgSize/2, drawSize=22;
                        return (
                          <button key={sh.key}
                            aria-label={lbl} aria-pressed={active}
                            draggable="true"
                            onDragStart={e=>{
                              e.dataTransfer.setData("shape",sh.key);
                              e.dataTransfer.effectAllowed="copy";
                              setStampType(sh.key);
                              setTool("stamp");
                            }}
                            onPointerDown={e=>{e.preventDefault();setStampType(sh.key);setTool("stamp");}}
                            style={{padding:"6px 3px",borderRadius:9,border:"1.5px solid",
                              borderColor:active?meta.color:meta.color+"30",
                              background:active?meta.color+"18":"rgba(255,255,255,.75)",
                              cursor:"grab",fontFamily:"inherit",
                              display:"flex",flexDirection:"column",alignItems:"center",gap:2,
                              userSelect:"none"}}>
                            <svg width={svgSize} height={svgSize} viewBox={`0 0 ${svgSize} ${svgSize}`}
                              style={{pointerEvents:"none",display:"block"}} aria-hidden="true">
                              {sh.key==="disk"
                                ?<circle cx={cx} cy={cy} r={drawSize/2} fill={meta.color+"33"} stroke={meta.colorB} strokeWidth={1.4}/>
                                :sh.key==="circle"
                                ?<circle cx={cx} cy={cy} r={drawSize/2} fill="none" stroke={meta.colorB} strokeWidth={1.8}/>
                                :<polygon points={sh.verts(cx,cy,drawSize).map(([x,y])=>`${x},${y}`).join(" ")}
                                  fill={meta.color+"33"} stroke={meta.colorB} strokeWidth={1.4}
                                  strokeLinejoin="round"/>
                              }
                            </svg>
                            <span style={{fontSize:8,fontWeight:700,color:meta.colorB,textAlign:"center",lineHeight:1.2,pointerEvents:"none"}}>
                              {lbl}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
              <div style={{marginTop:2}}>
                <div style={{fontSize:9,fontWeight:800,color:P.measB,textTransform:"uppercase",letterSpacing:1.2,marginBottom:3,paddingLeft:2}}>
                  {lang==="ku"?"Pîvandin":lang==="en"?"Measurement":"Ölçüm"}
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:3}}>
                  {[["ruler","📏",t("toolRuler")],["protractor","📐",t("toolProtr")],["angle","📏°",t("toolAngle")],["symmetry","⟺",t("toolSymm")]].map(([id,ic,lbl])=>(
                    <button key={id} onClick={()=>{setTool(id);setStampType(null);}}
                      aria-pressed={tool===id}
                      style={{padding:"6px 3px",borderRadius:9,border:"1.5px solid",
                        borderColor:tool===id?P.meas:P.meas+"30",
                        background:tool===id?P.meas+"18":"rgba(255,255,255,.75)",
                        cursor:"pointer",fontFamily:"inherit",
                        display:"flex",flexDirection:"column",alignItems:"center",gap:1}}>
                      <span style={{fontSize:16}}>{ic}</span>
                      <span style={{fontSize:8,fontWeight:700,color:P.measB,textAlign:"center"}}>{lbl}</span>
                    </button>
                  ))}
                </div>
              </div>
              {selItem&&(
                <div style={{marginTop:8,padding:"8px",borderRadius:10,background:"rgba(99,102,241,.06)",
                  border:"1px solid rgba(99,102,241,.12)"}}>
                  <div style={{fontSize:9,fontWeight:800,color:P.accentD,textTransform:"uppercase",letterSpacing:.5,marginBottom:6}}>
                    {lang==="ku"?"Teşeya Hilbijartî":lang==="en"?"Selected":"Seçili"}
                  </div>
                  <div style={{display:"flex",gap:3,marginBottom:3}}>
                    <button onClick={()=>dispatch({type:"FLIP_H",id:selectedId})}
                      title="Yatay yansıma"
                      style={{flex:1,padding:"4px 0",borderRadius:6,border:"1px solid rgba(99,102,241,.2)",
                        background:"rgba(255,255,255,.7)",cursor:"pointer",fontSize:11,fontWeight:700,color:P.accentD,fontFamily:"inherit"}}>
                      ↔ {lang==="ku"?"H":lang==="en"?"H":"Y"}
                    </button>
                    <button onClick={()=>dispatch({type:"FLIP_V",id:selectedId})}
                      title="Dikey yansıma"
                      style={{flex:1,padding:"4px 0",borderRadius:6,border:"1px solid rgba(99,102,241,.2)",
                        background:"rgba(255,255,255,.7)",cursor:"pointer",fontSize:11,fontWeight:700,color:P.accentD,fontFamily:"inherit"}}>
                      ↕ {lang==="ku"?"V":lang==="en"?"V":"D"}
                    </button>
                  </div>
                  <div style={{display:"flex",gap:3,marginBottom:3}}>
                    <button onClick={()=>dispatch({type:"ROTATE",id:selectedId,deg:(selItem.rotation||0)-15})}
                      style={{flex:1,padding:"4px 0",borderRadius:6,border:"1px solid rgba(99,102,241,.2)",
                        background:"rgba(255,255,255,.7)",cursor:"pointer",fontSize:10,fontWeight:700,color:P.accentD,fontFamily:"inherit"}}>
                      ↺ −15°
                    </button>
                    <button onClick={()=>dispatch({type:"ROTATE",id:selectedId,deg:(selItem.rotation||0)+15})}
                      style={{flex:1,padding:"4px 0",borderRadius:6,border:"1px solid rgba(99,102,241,.2)",
                        background:"rgba(255,255,255,.7)",cursor:"pointer",fontSize:10,fontWeight:700,color:P.accentD,fontFamily:"inherit"}}>
                      ↻ +15°
                    </button>
                  </div>
                  <div style={{display:"flex",gap:3,marginBottom:3}}>
                    <button onClick={()=>dispatch({type:"RESIZE",id:selectedId,s:selItem.size-10})}
                      style={{flex:1,padding:"4px 0",borderRadius:6,border:"1px solid rgba(99,102,241,.2)",
                        background:"rgba(255,255,255,.7)",cursor:"pointer",fontSize:12,fontWeight:800,color:P.accentD,fontFamily:"inherit"}}>−</button>
                    <span style={{flex:1,textAlign:"center",fontSize:9,fontWeight:700,color:P.accentD,lineHeight:"26px"}}>
                      {(selItem.size/10).toFixed(0)} {t("unit")}
                    </span>
                    <button onClick={()=>dispatch({type:"RESIZE",id:selectedId,s:selItem.size+10})}
                      style={{flex:1,padding:"4px 0",borderRadius:6,border:"1px solid rgba(99,102,241,.2)",
                        background:"rgba(255,255,255,.7)",cursor:"pointer",fontSize:12,fontWeight:800,color:P.accentD,fontFamily:"inherit"}}>+</button>
                  </div>
                  <button onClick={()=>dispatch({type:"DEL",id:selectedId})}
                    style={{width:"100%",padding:"5px 0",borderRadius:6,border:"none",
                      background:"rgba(239,68,68,.1)",cursor:"pointer",fontSize:10,fontWeight:700,color:"#dc2626",fontFamily:"inherit"}}>
                    🗑 {t("delete")}
                  </button>
                  <div style={{marginTop:4,fontSize:9,color:"rgba(30,27,75,.3)",textAlign:"center"}}>
                    {t("kbShortcuts")}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Etkinlik */}
          {sideTab==="act"&&(
            <div style={{flex:1,overflowY:"auto",padding:"8px"}}>
              {/* Mod seçici: Hızlı soru vs Faz Dizisi (Crowley 1987) */}
              <div style={{display:"flex",gap:2,marginBottom:6,background:"rgba(99,102,241,.06)",borderRadius:7,padding:2}}>
                <button onClick={()=>setActMode("quick")}
                  aria-pressed={actMode==="quick"}
                  style={{flex:1,padding:"5px 0",borderRadius:5,border:"none",cursor:"pointer",fontFamily:"inherit",
                    background:actMode==="quick"?P.accent:"transparent",
                    color:actMode==="quick"?"#fff":"rgba(30,27,75,.45)",
                    fontSize:10,fontWeight:actMode==="quick"?800:600}}>
                  ⚡ {lang==="ku"?"Bilez":lang==="en"?"Quick":"Hızlı"}
                </button>
                <button onClick={()=>setActMode("seq")}
                  aria-pressed={actMode==="seq"}
                  title={lang==="ku"?"5 Gavê Van Hiele":lang==="en"?"Van Hiele 5 Phases":"Van Hiele 5 Faz"}
                  style={{flex:1,padding:"5px 0",borderRadius:5,border:"none",cursor:"pointer",fontFamily:"inherit",
                    background:actMode==="seq"?P.accent:"transparent",
                    color:actMode==="seq"?"#fff":"rgba(30,27,75,.45)",
                    fontSize:10,fontWeight:actMode==="seq"?800:600}}>
                  🎓 {lang==="ku"?"5 Gav":lang==="en"?"5 Phases":"5 Faz"}
                </button>
              </div>
              {actMode==="quick"?(
                <>
                  <div style={{display:"flex",gap:2,marginBottom:6,background:"rgba(99,102,241,.06)",borderRadius:7,padding:2}}>
                    {[0,1,2].map(lv=>{
                      const c=["#f59e0b","#6366f1","#10b981"][lv];
                      return (
                        <button key={lv} onClick={()=>{setVhLevel(lv);setActIdx(0);}}
                          aria-pressed={vhLevel===lv}
                          style={{flex:1,padding:"5px 2px",borderRadius:5,border:"none",cursor:"pointer",fontFamily:"inherit",
                            background:vhLevel===lv?c+"20":"transparent",color:vhLevel===lv?c:"rgba(30,27,75,.4)",
                            fontSize:10,fontWeight:vhLevel===lv?800:600,display:"flex",justifyContent:"center"}}>
                          <VHBadge level={lv}/>
                        </button>
                      );
                    })}
                  </div>
                  {/* Zengin seviye rehber kartı — detaylı */}
                  {(()=>{
                    const lvData=VH_LEVELS[vhLevel];
                    if(!lvData) return null;
                    const prog=levelProgress[vhLevel]||{correct:0,attempted:0,acts:[]};
                    const crit=lvData.passCriteria;
                    const pct=Math.min(100,Math.round((prog.correct/crit.minCorrect)*100));
                    const done=prog.correct>=crit.minCorrect&&prog.acts.length>=crit.minActivities;
                    return (
                      <div style={{marginBottom:10,padding:"10px 11px",borderRadius:9,
                        background:lvData.colorSoft,border:"1.5px solid "+lvData.color+"60"}}>
                        {/* Başlık */}
                        <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:6}}>
                          <span style={{fontSize:16}}>{lvData.icon}</span>
                          <div style={{flex:1}}>
                            <div style={{fontSize:12,fontWeight:800,color:lvData.color,lineHeight:1.1}}>
                              L{vhLevel}: {lvData.name[lang]||lvData.name.tr}
                            </div>
                            <div style={{fontSize:8,color:"rgba(30,27,75,.55)",fontWeight:600}}>
                              {lang==="ku"?"Temenê":lang==="en"?"Age":"Yaş"}: {lvData.ageRange}
                            </div>
                          </div>
                          {done&&(
                            <span style={{fontSize:10,padding:"2px 6px",borderRadius:10,
                              background:"#10b981",color:"#fff",fontWeight:800}}>
                              ✓ {lang==="ku"?"Temam":lang==="en"?"Done":"Tamam"}
                            </span>
                          )}
                        </div>
                        {/* Ne yapabilir */}
                        <div style={{fontSize:9,fontWeight:800,color:lvData.color,
                          textTransform:"uppercase",letterSpacing:.3,marginBottom:3,marginTop:6}}>
                          ✓ {lang==="ku"?"Çi dikare":lang==="en"?"Can do":"Neler yapabilir"}
                        </div>
                        <ul style={{margin:0,paddingLeft:14,fontSize:9.5,color:"rgba(30,27,75,.75)",lineHeight:1.5}}>
                          {(lvData.canDo[lang]||lvData.canDo.tr).slice(0,3).map((item,i)=>(
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                        {/* İlerleme çubuğu */}
                        <div style={{marginTop:8,padding:"5px 7px",borderRadius:6,
                          background:"rgba(255,255,255,.6)"}}>
                          <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                            <span style={{fontSize:9,fontWeight:700,color:lvData.color}}>
                              {lang==="ku"?"Pêşketin":lang==="en"?"Progress":"İlerleme"}
                            </span>
                            <span style={{fontSize:9,fontWeight:700,color:"rgba(30,27,75,.6)"}}>
                              {prog.correct}/{crit.minCorrect} {lang==="ku"?"rast":lang==="en"?"correct":"doğru"}
                            </span>
                          </div>
                          <div style={{height:5,borderRadius:2.5,background:"rgba(0,0,0,.08)",overflow:"hidden"}}>
                            <div style={{width:pct+"%",height:"100%",
                              background:lvData.color,transition:"width .3s"}}/>
                          </div>
                          {/* Sonraki seviyeye geçiş durumu */}
                          {!done&&vhLevel<2&&(
                            <div style={{fontSize:8,color:"rgba(30,27,75,.5)",marginTop:4,fontStyle:"italic"}}>
                              {lang==="ku"
                                ?`L${vhLevel+1}ê vekirin: ${Math.max(0,crit.minCorrect-prog.correct)} bersîva rast zêde lazim e`
                                :lang==="en"
                                ?`Unlock L${vhLevel+1}: ${Math.max(0,crit.minCorrect-prog.correct)} more correct needed`
                                :`L${vhLevel+1} açılması için: ${Math.max(0,crit.minCorrect-prog.correct)} doğru cevap daha gerek`}
                            </div>
                          )}
                          {done&&vhLevel===2&&(
                            <div style={{fontSize:8,color:"#059669",marginTop:4,fontWeight:700}}>
                              🎉 {lang==="ku"?"Hemû asta hatin qedandin!":lang==="en"?"All levels completed!":"Tüm seviyeler tamamlandı!"}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })()}
                  {curAct&&(
                    <ActivityCard key={curAct.id+vhLevel+lang} act={curAct} lang={lang} ariaRef={ariaRef} ttsOn={ttsOn}
                      onCorrect={()=>{
                        addScore(10);
                        recordLevelAnswer(vhLevel,curAct.id,true);
                        setActIdx(i=>i+1);
                      }}/>
                  )}
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",
                    marginTop:8,padding:"5px 8px",borderRadius:8,background:"rgba(99,102,241,.05)"}}>
                    <span style={{fontSize:10,color:P.accentD,fontWeight:700}}>
                      {(actIdx%filtActs.length)+1}/{filtActs.length}
                    </span>
                    <span style={{fontSize:12,fontWeight:800,color:"#f59e0b"}}>{t("score")}: {score}</span>
                    <button onClick={()=>setActIdx(i=>i+1)}
                      style={{padding:"2px 8px",borderRadius:6,border:"1px solid rgba(99,102,241,.2)",
                        background:"rgba(99,102,241,.08)",cursor:"pointer",fontSize:10,fontWeight:700,color:P.accentD,fontFamily:"inherit"}}>
                      →
                    </button>
                  </div>
                </>
              ):(
                /* Faz Dizisi Modu — Crowley 1987 */
                <>
                  {/* Konu seçici */}
                  <div style={{fontSize:9,fontWeight:800,color:P.accentD,textTransform:"uppercase",
                    letterSpacing:1,marginBottom:4,padding:"0 2px"}}>
                    {lang==="ku"?"Mijarê Hilbijêre":lang==="en"?"Choose Topic":"Konu Seç"}
                  </div>
                  <div style={{display:"flex",flexDirection:"column",gap:4,marginBottom:8}}>
                    {PHASE_SEQUENCES.map(seq=>{
                      const topicLbl=typeof seq.topic==="object"?seq.topic[lang]||seq.topic.tr:seq.topic;
                      const lvlColor=["#f59e0b","#6366f1","#10b981"][seq.level];
                      const active=seqIdx===seq.id;
                      return (
                        <button key={seq.id} onClick={()=>setSeqIdx(seq.id)}
                          aria-pressed={active}
                          style={{padding:"6px 9px",borderRadius:8,border:"1.5px solid",
                            borderColor:active?lvlColor:"rgba(99,102,241,.15)",
                            background:active?lvlColor+"15":"rgba(255,255,255,.5)",
                            cursor:"pointer",fontFamily:"inherit",
                            display:"flex",alignItems:"center",gap:7,textAlign:"left"}}>
                          <VHBadge level={seq.level}/>
                          <span style={{fontSize:14}}>{seq.icon}</span>
                          <span style={{fontSize:11,fontWeight:700,color:active?lvlColor:P.text}}>
                            {topicLbl}
                          </span>
                          <span style={{marginLeft:"auto",fontSize:9,color:"rgba(30,27,75,.4)"}}>
                            5 faz
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  {/* Seçili faz dizisi */}
                  {(()=>{
                    const curSeq=PHASE_SEQUENCES.find(s=>s.id===seqIdx)||PHASE_SEQUENCES[0];
                    return <PhaseSequenceCard key={curSeq.id+lang} seq={curSeq} lang={lang}
                      onComplete={()=>{addScore(25);}}/>;
                  })()}
                  <div style={{marginTop:8,padding:"6px 8px",borderRadius:7,
                    background:"rgba(99,102,241,.05)",fontSize:9,color:"rgba(30,27,75,.55)",lineHeight:1.5}}>
                    📖 {lang==="ku"?"Crowley (1987): Van Hiele pêş ve çûna asta geometrîk bi 5 gavan pêk tê.":
                        lang==="en"?"Crowley (1987): Van Hiele level progression requires 5 sequential phases.":
                        "Crowley (1987): Van Hiele seviye ilerlemesi 5 ardışık faz gerektirir."}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Tangram */}
          {sideTab==="tan"&&(
            <div style={{flex:1,overflowY:"auto",padding:"8px"}}>
              {/* Araştırma kaynağı: Nyet Moi Siew et al. 2013 (Malezya, 3. sınıf, 221 öğrenci).
                  Bulgu: tangram + Van Hiele 5 faz, L0→L1 geçişinde etkili;
                  özellikle düşük yetenekli öğrencilerde en büyük gelişme. */}
              {/* Mod seçici: Silüet / Keşif */}
              <div style={{display:"flex",gap:2,marginBottom:6,background:"rgba(124,58,237,.08)",borderRadius:7,padding:2}}>
                <button onClick={()=>setTanMode("sil")}
                  aria-pressed={tanMode==="sil"}
                  style={{flex:1,padding:"5px 0",borderRadius:5,border:"none",cursor:"pointer",fontFamily:"inherit",
                    background:tanMode==="sil"?"#7c3aed":"transparent",
                    color:tanMode==="sil"?"#fff":"rgba(124,58,237,.6)",
                    fontSize:10,fontWeight:tanMode==="sil"?800:600}}>
                  🎯 {lang==="ku"?"Silhuet":lang==="en"?"Silhouette":"Silüet"}
                </button>
                <button onClick={()=>setTanMode("keşif")}
                  aria-pressed={tanMode==="keşif"}
                  style={{flex:1,padding:"5px 0",borderRadius:5,border:"none",cursor:"pointer",fontFamily:"inherit",
                    background:tanMode==="keşif"?"#7c3aed":"transparent",
                    color:tanMode==="keşif"?"#fff":"rgba(124,58,237,.6)",
                    fontSize:10,fontWeight:tanMode==="keşif"?800:600}}>
                  🔍 {lang==="ku"?"Keşf":lang==="en"?"Discovery":"Keşif"}
                </button>
              </div>

              {tanMode==="sil"?(
                <>
                  {/* Başlık kartı — kanvasın durumunu bildir */}
                  <div style={{padding:"8px 10px",borderRadius:9,marginBottom:8,
                    background:"linear-gradient(135deg,rgba(124,58,237,.08),rgba(139,92,246,.05))",
                    border:"1.5px solid rgba(124,58,237,.2)"}}>
                    <div style={{fontSize:10,fontWeight:800,color:"#7c3aed",marginBottom:2}}>
                      🧩 {lang==="ku"?"Tangram":lang==="en"?"Tangram":"Tangram"}
                    </div>
                    <div style={{fontSize:9,color:"rgba(124,58,237,.75)",lineHeight:1.5}}>
                      {lang==="ku"
                        ?"Silhuet li kanvasê ye. Perçeyan lê kaş bike."
                        :lang==="en"
                        ?"Silhouette is on canvas. Drag pieces onto it."
                        :"Silüet kanvasta. Parçaları üstüne sürükle."}
                    </div>
                  </div>

                  {/* Hedef silüet seçici — küçük butonlar */}
                  <div style={{fontSize:9,fontWeight:800,color:"#7c3aed",textTransform:"uppercase",
                    letterSpacing:.5,marginBottom:4,padding:"0 2px"}}>
                    🎯 {lang==="ku"?"Armanc":lang==="en"?"Target":"Hedef"}
                  </div>
                  <div style={{display:"flex",gap:3,marginBottom:10,flexWrap:"wrap"}}>
                    {TAN_PUZZLES.map((p,i)=>(
                      <button key={i} onClick={()=>{setTanPuzzle(i);setTanPlaced([]);dispatch({type:"CLEAR"});}}
                        aria-pressed={tanPuzzle===i}
                        style={{flex:"1 1 40%",padding:"6px 8px",borderRadius:7,border:"1.5px solid",
                          borderColor:tanPuzzle===i?"#7c3aed":"rgba(124,58,237,.25)",
                          background:tanPuzzle===i?"#7c3aed":"rgba(255,255,255,.6)",
                          color:tanPuzzle===i?"#fff":"#7c3aed",
                          cursor:"pointer",fontFamily:"inherit",
                          fontSize:10,fontWeight:tanPuzzle===i?800:700}}>
                        {lang==="ku"?p.nameKu:lang==="en"?p.nameEn:p.name}
                      </button>
                    ))}
                  </div>

                  {/* Hayalet görünürlük toggle (silüet solukluğu) */}
                  <label style={{display:"flex",alignItems:"center",gap:6,padding:"6px 8px",
                    borderRadius:7,background:"rgba(124,58,237,.06)",marginBottom:10,cursor:"pointer"}}>
                    <input type="checkbox" checked={tanShowGhost}
                      onChange={e=>setTanShowGhost(e.target.checked)}
                      style={{accentColor:"#7c3aed"}}/>
                    <span style={{fontSize:10,fontWeight:700,color:"#7c3aed"}}>
                      👻 {lang==="ku"?"Silhuetê bi zelaltir nîşan bide":lang==="en"?"Show silhouette more clearly":"Silüeti daha belirgin göster"}
                    </span>
                  </label>

                  {/* Parça ekleme butonları */}
                  <div style={{fontSize:9,fontWeight:800,color:"#7c3aed",textTransform:"uppercase",
                    letterSpacing:.5,marginBottom:4,padding:"0 2px"}}>
                    🧩 {lang==="ku"?"Perçe Ekle":lang==="en"?"Add Piece":"Parça Ekle"}
                  </div>
                  <div style={{fontSize:9,color:"rgba(30,27,75,.55)",marginBottom:6,lineHeight:1.5}}>
                    {lang==="ku"
                      ?"Bitikîne → li kanvasê tê danîn. Kaş, bizivirîne (R), berevajî bike (F)."
                      :lang==="en"
                      ?"Click → placed on canvas. Drag, rotate (R), flip (F)."
                      :"Tıkla → kanvasa düşer. Sürükle, döndür (R), çevir (F)."}
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:4}}>
                    {TAN_PIECES.map(pc=>{
                      const def=SHAPE_DEF[pc.type]; if(!def) return null;
                      /* Adet: sadece tipi sayar — öğrenci rengi değiştirse de sayı doğru kalır.
                         Not: iki farklı boyuttaki right_tri parçası (orta, küçük) de aynı tip;
                         boyuta göre ayırmak için size aralığı kontrol et. */
                      const count=items.filter(it=>
                        it.type===pc.type && Math.abs((it.s||0)-pc.size)<5
                      ).length;
                      return (
                        <button key={pc.id}
                          onClick={()=>{
                            /* Parçayı kanvasın alt kısmına rastgele bir yere ekle — silüetle çakışmasın.
                               Silüet 50-450 Y aralığında; parçalar 500-570 Y ve 100-800 X aralığına düşer.
                               Büyük parçalar için alanın merkezine yakın koy. */
                            const isBig=pc.size>250;
                            const xRange=isBig?[250,650]:[120,780];
                            const x=xRange[0]+Math.random()*(xRange[1]-xRange[0]);
                            const y=495+Math.random()*55;
                            dispatch({type:"ADD",t:pc.type,
                              x, y,
                              s:pc.size,color:pc.color,snap:snapToGrid});
                          }}
                          style={{padding:"8px 4px",borderRadius:8,border:"1.5px solid",
                            borderColor:pc.color,
                            background:pc.color+"20",
                            cursor:"pointer",fontFamily:"inherit",
                            position:"relative",
                            display:"flex",flexDirection:"column",alignItems:"center",gap:2,
                            transition:"all .15s"}}
                          onMouseEnter={e=>e.currentTarget.style.background=pc.color+"35"}
                          onMouseLeave={e=>e.currentTarget.style.background=pc.color+"20"}>
                          {/* SVG ikonu — gerçek tangram parça silueti */}
                          <span style={{fontSize:24,color:pc.color,display:"flex",alignItems:"center",justifyContent:"center",width:28,height:28}}>
                            {pc.iconSvg?pc.iconSvg(pc.color):def.icon}
                          </span>
                          <span style={{fontSize:9,fontWeight:700,color:pc.color,textAlign:"center",lineHeight:1.2}}>
                            {pc.label}
                          </span>
                          {/* Adet göstergesi — kaç tanesi kanvasta */}
                          {count>0&&(
                            <span style={{position:"absolute",top:3,right:3,
                              minWidth:16,height:16,borderRadius:8,
                              background:pc.color,color:"#fff",
                              fontSize:9,fontWeight:800,
                              display:"flex",alignItems:"center",justifyContent:"center",
                              padding:"0 4px"}}>
                              {count}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Seçili tangram parçasının rengini değiştir — kanvasta parçaya tıklayınca */}
                  {(()=>{
                    /* Seçili item tangram parçası mı? (tipi tangram tipi + boyutu tangram boyutu) */
                    if(!selItem) return null;
                    const isTangramPiece=TAN_PIECES.some(pc=>
                      pc.type===selItem.type && Math.abs((selItem.s||0)-pc.size)<5
                    );
                    if(!isTangramPiece) return null;
                    return (
                      <div style={{marginTop:8,padding:"8px 10px",borderRadius:8,
                        background:selItem.color+"15",border:"1.5px solid "+selItem.color+"50",
                        animation:"popIn .2s"}}>
                        <div style={{fontSize:9,fontWeight:800,color:selItem.color,
                          marginBottom:6,display:"flex",alignItems:"center",gap:5}}>
                          <span>🎨</span>
                          <span>{lang==="ku"?"Rengê perçeyê biguherîne":lang==="en"?"Change piece color":"Seçili parçanın rengini değiştir"}</span>
                        </div>
                        <div style={{display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:3}}>
                          {["#ef4444","#3b82f6","#8b5cf6","#f59e0b","#10b981","#f97316",
                            "#06b6d4","#ec4899","#eab308","#14b8a6","#a855f7","#64748b"].map(c=>{
                            const isSel=selItem.color===c;
                            return (
                              <button key={c}
                                onClick={()=>dispatch({type:"COLOR",id:selItem.id,color:c})}
                                aria-pressed={isSel}
                                style={{aspectRatio:"1",borderRadius:5,
                                  border:isSel?"2.5px solid "+P.accent:"1px solid rgba(0,0,0,.1)",
                                  background:c,cursor:"pointer",
                                  boxShadow:isSel?"0 0 0 2px #fff inset":"none"}}/>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })()}

                  {/* İlerleme çubuğu — kanvastaki gerçek tangram parça sayısı */}
                  {(()=>{
                    const onCanvas=items.filter(it=>
                      TAN_PIECES.some(pc=>pc.type===it.type&&Math.abs((it.s||0)-pc.size)<5)
                    ).length;
                    const target=TAN_PIECES.length;
                    return (
                      <>
                        <div style={{marginTop:10,padding:"7px 9px",borderRadius:7,
                          background:"rgba(124,58,237,.06)",display:"flex",alignItems:"center",gap:6}}>
                          <span style={{fontSize:11,fontWeight:800,color:"#7c3aed",minWidth:40}}>
                            {onCanvas} {lang==="ku"?"perçe":lang==="en"?"pc":"parça"}
                          </span>
                          <div style={{flex:1,height:5,borderRadius:2.5,background:"rgba(124,58,237,.15)",overflow:"hidden"}}>
                            <div style={{width:`${Math.min(100,(onCanvas/target)*100)}%`,
                              height:"100%",background:"#7c3aed",transition:"width .3s"}}/>
                          </div>
                        </div>

                        {/* Manuel tamamla — en az 7 parça kanvasta iken aktif */}
                        {onCanvas>=target&&(
                          <button onClick={()=>{addScore(50);dispatch({type:"CLEAR"});}}
                            style={{marginTop:8,width:"100%",padding:"10px 0",borderRadius:8,border:"none",
                              background:"linear-gradient(135deg,#10b981,#059669)",color:"#fff",cursor:"pointer",
                              fontSize:12,fontWeight:800,fontFamily:"inherit",animation:"popIn .3s"}}>
                            ✓ {lang==="ku"?"Tamam! (+50 xal)":lang==="en"?"Done! (+50 pts)":"Tamam! (+50 puan)"}
                          </button>
                        )}

                        {/* Kanvası temizle */}
                        <button onClick={()=>{dispatch({type:"CLEAR"});}}
                          disabled={onCanvas===0}
                          style={{marginTop:6,width:"100%",padding:"7px 0",borderRadius:7,border:"none",fontFamily:"inherit",
                            background:onCanvas?"rgba(124,58,237,.12)":"rgba(124,58,237,.04)",
                            color:onCanvas?"#7c3aed":"#ccc",
                            cursor:onCanvas?"pointer":"default",
                            fontSize:10,fontWeight:700}}>
                          ↺ {lang==="ku"?"Ji nû ve":lang==="en"?"Restart":"Yeniden"}
                        </button>
                      </>
                    );
                  })()}

                  {/* Araştırma notu */}
                  <div style={{marginTop:10,padding:"5px 8px",borderRadius:6,fontSize:8,
                    color:"rgba(30,27,75,.45)",fontStyle:"italic",lineHeight:1.5,textAlign:"center"}}>
                    📖 Siew (2013): Tangram + Van Hiele L0→L1 geçişinde etkili.
                  </div>
                </>
              ):(
                /* KEŞİF MODU — Siew 2013 odağı: parça-bütün dönüşümü */
                <>
                  <div style={{fontSize:9,fontWeight:800,color:"#7c3aed",textTransform:"uppercase",
                    letterSpacing:1,marginBottom:6,padding:"0 2px"}}>
                    {lang==="ku"?"Keşfa Perçe-Tevayî":lang==="en"?"Part-Whole Discovery":"Parça-Bütün Keşfi"}
                  </div>
                  <div style={{fontSize:10,color:"rgba(30,27,75,.55)",lineHeight:1.5,marginBottom:8,
                    padding:"6px 8px",borderRadius:7,background:"rgba(124,58,237,.05)",
                    borderLeft:"2.5px solid #7c3aed"}}>
                    {lang==="ku"
                      ?"Her erkek bi tenê bi tanên tangramê bi hev re tê çareserkirin. Teşeyê ku çêdibe tespît bike."
                      :lang==="en"
                      ?"Each task asks you to combine tangram pieces. Identify the shape that forms."
                      :"Her görev tangram parçalarını birleştirmeni ister. Oluşan şekli tespit et."}
                  </div>
                  {(()=>{
                    const DISCOVERY=[
                      {id:"d1",q:{tr:"2 küçük üçgeni uzun kenarlarıyla birleştirirsen hangi şekil oluşur?",
                                  ku:"Heke 2 sêgoşeyên biçûk bi kêlekên dirêj li hev bîne, kîjan teşe çêdibe?",
                                  en:"If you join 2 small triangles along their long sides, which shape forms?"},
                       opts:["square","rectangle","parallelogram","eq_tri"],correct:"square",
                       hint:{tr:"Her küçük üçgenin iki dik kenarı eşittir. İkisi birleşince 4 eşit kenar oluşur.",
                             ku:"Her sêgoşeya biçûk du kêlekên rast-wekhev heye. Dema 2'yan bicivîne 4 kêlekên wekhev çêdibe.",
                             en:"Each small triangle has two equal perpendicular sides. Joining two makes 4 equal sides."}},
                      {id:"d2",q:{tr:"2 küçük üçgenin kısa kenarlarını birleştirirsen ne olur?",
                                  ku:"Heke 2 sêgoşeyên biçûk bi kêlekên kurt bîne, çi çêdibe?",
                                  en:"If you join 2 small triangles along their short sides, what forms?"},
                       opts:["square","eq_tri","parallelogram","rhombus"],correct:"eq_tri",
                       hint:{tr:"Hipotenüsler dışa kalır, 3 kenarlı bir şekil oluşur — daha büyük bir üçgen.",
                             ku:"Kêlekên dirêj li derûde dimînin, teşeyek 3 kêlek çêdibe.",
                             en:"The hypotenuses face outward, forming a 3-sided shape — a larger triangle."}},
                      {id:"d3",q:{tr:"1 kare + 2 küçük üçgen (doğru yerleştirilmiş) hangi şekli oluşturur?",
                                  ku:"1 çaryalî + 2 sêgoşeyên biçûk kîjan teşe çêdike?",
                                  en:"1 square + 2 small triangles (placed right) form which shape?"},
                       opts:["rectangle","trapezoid","pentagon","parallelogram"],correct:"rectangle",
                       hint:{tr:"Karenin iki yanına üçgenleri dik kenarlarıyla koyarsan dikdörtgen çıkar.",
                             ku:"Li her du aliyên çaryaliyê sêgoşeyan bi kêlekên rast dayne, çarhêla rast çêdibe.",
                             en:"Place triangles on both sides of the square with perpendicular sides attached → rectangle."}},
                      {id:"d4",q:{tr:"Paralelkenarı 2 eş parçaya ayırırsan, her parça hangi şekildir?",
                                  ku:"Heke paralelogramê bi 2 parçeyên wekhev jê bibî, her parçe kîjan teşe ye?",
                                  en:"If you cut a parallelogram into 2 equal pieces, each piece is which shape?"},
                       opts:["eq_tri","right_tri","square","rectangle"],correct:"right_tri",
                       hint:{tr:"Köşegen boyunca kesersen iki dik üçgen elde edersin (eşit).",
                             ku:"Heke li ser goşeyê jê bibî, 2 sêgoşeyên rastê yên wekhev bi dest dixî.",
                             en:"Cutting along the diagonal gives two equal right triangles."}},
                      {id:"d5",q:{tr:"7 tangram parçasının tamamını birleştirirsen hangi temel şekli oluşturabilirsin?",
                                  ku:"Heke hemû 7 perçeyên tangramê bîne ba hev, kîjan teşeya bingehîn çêdibe?",
                                  en:"Combining all 7 tangram pieces, which basic shape can you form?"},
                       opts:["square","rectangle","eq_tri","pentagon"],correct:"square",
                       hint:{tr:"Tangramın orijinali tam da bir karedir — 7 parça tekrar büyük bir kareye dönüşür.",
                             ku:"Tangrama resen di eslê xwe de çaryalî ye — 7 perçe dîsa dibin çaryaliyeke mezin.",
                             en:"The original tangram IS a square — all 7 pieces recompose into one large square."}},
                    ];
                    const task=DISCOVERY[tanDiscIdx%DISCOVERY.length];
                    const qTxt=typeof task.q==="object"?task.q[lang]||task.q.tr:task.q;
                    const hintTxt=typeof task.hint==="object"?task.hint[lang]||task.hint.tr:task.hint;
                    return (
                      <>
                        <div style={{padding:"8px 10px",borderRadius:10,background:"#fff",
                          border:"1.5px solid rgba(124,58,237,.2)",marginBottom:6,
                          boxShadow:"0 2px 8px rgba(124,58,237,.06)"}}>
                          <div style={{fontSize:9,fontWeight:800,color:"#7c3aed",marginBottom:4}}>
                            #{tanDiscIdx+1}/{DISCOVERY.length}
                          </div>
                          <div style={{fontSize:12,fontWeight:700,color:P.text,lineHeight:1.5,marginBottom:8}}>
                            {qTxt}
                          </div>
                          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:4}}>
                            {task.opts.map(opt=>{
                              const def=SHAPE_DEF[opt]; if(!def) return null;
                              const lbl=lang==="ku"?def.labelKu:lang==="en"?def.labelEn:def.label;
                              const isSel=tanDiscSel===opt;
                              const isCorrect=tanDiscFb==="ok"&&opt===task.correct;
                              const isWrong=tanDiscFb==="no"&&isSel;
                              return (
                                <button key={opt}
                                  onClick={()=>{setTanDiscSel(opt);setTanDiscFb(null);}}
                                  style={{padding:"7px 5px",borderRadius:7,border:"1.5px solid",
                                    borderColor:isCorrect?"#059669":isWrong?"#dc2626":isSel?"#7c3aed":"rgba(124,58,237,.2)",
                                    background:isCorrect?"rgba(5,150,105,.1)":isWrong?"rgba(220,38,38,.08)":isSel?"rgba(124,58,237,.1)":"rgba(255,255,255,.6)",
                                    cursor:"pointer",fontFamily:"inherit",
                                    display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>
                                  <span style={{fontSize:16}}>{def.icon}</span>
                                  <span style={{fontSize:9,fontWeight:700,color:P.text,textAlign:"center"}}>
                                    {lbl}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                          {tanDiscShowHint&&(
                            <div style={{marginTop:7,padding:"6px 8px",borderRadius:6,
                              background:"rgba(245,158,11,.1)",border:"1px solid rgba(245,158,11,.3)",
                              fontSize:10,color:"#92400e",lineHeight:1.5}}>💡 {hintTxt}</div>
                          )}
                          {tanDiscFb==="ok"&&(
                            <div role="status" style={{marginTop:7,padding:"6px 8px",borderRadius:6,textAlign:"center",
                              background:"rgba(5,150,105,.1)",border:"1px solid rgba(5,150,105,.3)",
                              fontSize:11,fontWeight:800,color:"#065f46"}}>
                              ✓ {lang==="ku"?"Rast!":lang==="en"?"Correct!":"Doğru!"}
                            </div>
                          )}
                          {tanDiscFb==="no"&&(
                            <div role="status" style={{marginTop:7,padding:"6px 8px",borderRadius:6,textAlign:"center",
                              background:"rgba(220,38,38,.08)",border:"1px solid rgba(220,38,38,.25)",
                              fontSize:11,fontWeight:700,color:"#dc2626"}}>
                              {lang==="ku"?"Dîsa biceribîne":lang==="en"?"Try again":"Tekrar dene"}
                            </div>
                          )}
                        </div>
                        <div style={{display:"flex",gap:4}}>
                          <button onClick={()=>setTanDiscShowHint(h=>!h)}
                            style={{flex:1,padding:"6px 0",borderRadius:7,border:"1.5px solid rgba(245,158,11,.4)",
                              background:"rgba(245,158,11,.08)",cursor:"pointer",fontSize:10,fontWeight:700,color:"#92400e",fontFamily:"inherit"}}>
                            💡 {lang==="ku"?"Şîret":lang==="en"?"Hint":"İpucu"}
                          </button>
                          <button onClick={()=>{
                              if(tanDiscSel===null) return;
                              const ok=tanDiscSel===task.correct;
                              setTanDiscFb(ok?"ok":"no");
                              if(ok){addScore(10);setTimeout(()=>{setTanDiscIdx(i=>i+1);setTanDiscSel(null);setTanDiscFb(null);setTanDiscShowHint(false);},800);}
                            }}
                            disabled={tanDiscSel===null}
                            style={{flex:2,padding:"6px 0",borderRadius:7,border:"none",
                              background:tanDiscSel===null?"rgba(124,58,237,.2)":"linear-gradient(135deg,#7c3aed,#6d28d9)",
                              cursor:tanDiscSel===null?"not-allowed":"pointer",
                              fontSize:11,fontWeight:800,color:"#fff",fontFamily:"inherit",
                              opacity:tanDiscSel===null?0.5:1}}>
                            ✓ {lang==="ku"?"Kontrol bike":lang==="en"?"Check":"Kontrol Et"}
                          </button>
                        </div>
                        <div style={{marginTop:8,padding:"5px 7px",borderRadius:6,
                          background:"rgba(124,58,237,.05)",fontSize:8,color:"rgba(30,27,75,.5)",lineHeight:1.4}}>
                          📖 Siew, N.M. et al. (2013): Tangram + Van Hiele fazları, 3. sınıf 221 öğrencide
                          L0→L1 geçişi sağladı; en çok düşük yetenekli öğrenciler yararlandı.
                        </div>
                      </>
                    );
                  })()}
                </>
              )}
            </div>
          )}

          {/* ═══ 3B ŞEKİLLER ═══
              Kaynak: Meng (2009) — 3B↔açınım geçişi Van Hiele L0→L1 pedagojisinde etkili.
              İlkokul 3-4. sınıf geometri müfredatında temel konu. */}
          {sideTab==="3d"&&(()=>{
            return (
              <div style={{flex:1,overflowY:"auto",padding:"8px 10px"}}>
                {/* Başlık kartı */}
                <div style={{padding:"8px 10px",borderRadius:9,marginBottom:8,
                  background:"linear-gradient(135deg,rgba(8,145,178,.08),rgba(14,116,144,.05))",
                  border:"1.5px solid rgba(8,145,178,.2)"}}>
                  <div style={{fontSize:10,fontWeight:800,color:"#0e7490",marginBottom:2}}>
                    🧊 {lang==="ku"?"Serbest Sê-Boyî":lang==="en"?"Free 3D":"Serbest 3B"}
                  </div>
                  <div style={{fontSize:9,color:"rgba(14,116,144,.75)",lineHeight:1.5}}>
                    {lang==="ku"
                      ?"Cisiman lê zêde bike, kaş bike, bizivirîne (↻ li jor), mezinahiyê biguherîne."
                      :lang==="en"
                      ?"Add solids, drag them, rotate (↻ above), resize."
                      :"Cisim ekle, sürükle, döndür (↻ üstte), boyutlandır."}
                  </div>
                </div>

                {/* Cisim ekle — 4 türe basınca yeni cisim eklenir */}
                <div style={{fontSize:9,fontWeight:800,color:"#0e7490",textTransform:"uppercase",
                  letterSpacing:.5,marginBottom:4,padding:"0 2px"}}>
                  ➕ {lang==="ku"?"Cisim Lê Zêde Bike":lang==="en"?"Add Solid":"Cisim Ekle"}
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:5,marginBottom:10}}>
                  {Object.entries(SHAPE_3D).map(([key,s3])=>{
                    const lbl=lang==="ku"?s3.labelKu:lang==="en"?s3.labelEn:s3.label;
                    return (
                      <button key={key}
                        onClick={()=>add3DSolid(key)}
                        style={{padding:"10px 4px",borderRadius:8,border:"1.5px solid rgba(8,145,178,.25)",
                          background:"rgba(255,255,255,.6)",
                          cursor:"pointer",fontFamily:"inherit",
                          display:"flex",flexDirection:"column",alignItems:"center",gap:3,
                          transition:"all .15s"}}
                        onMouseEnter={e=>e.currentTarget.style.background="rgba(8,145,178,.12)"}
                        onMouseLeave={e=>e.currentTarget.style.background="rgba(255,255,255,.6)"}>
                        <span style={{fontSize:22,color:"#0e7490",display:"flex",alignItems:"center",justifyContent:"center",width:24,height:24}}>
                          {s3.iconSvg?s3.iconSvg():s3.icon}
                        </span>
                        <span style={{fontSize:9,fontWeight:700,color:P.text,
                          textAlign:"center",lineHeight:1.2}}>
                          {lbl}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Seçili cisim kontrolleri */}
                {selected3D?(()=>{
                  const def=SHAPE_3D[selected3D.type];
                  const lbl=lang==="ku"?def.labelKu:lang==="en"?def.labelEn:def.label;
                  return (
                    <div style={{padding:"10px 10px",borderRadius:10,
                      background:"rgba(8,145,178,.06)",border:"2px solid rgba(8,145,178,.3)",
                      marginBottom:10,animation:"popIn .25s"}}>
                      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
                        <div style={{display:"flex",alignItems:"center",gap:6}}>
                          <span style={{fontSize:16,color:"#0e7490",display:"flex",alignItems:"center",justifyContent:"center",width:20,height:20}}>
                            {def.iconSvg?def.iconSvg():def.icon}
                          </span>
                          <span style={{fontSize:12,fontWeight:800,color:"#0e7490"}}>{lbl}</span>
                        </div>
                        <button onClick={()=>delete3DSolid(selected3D.id)}
                          aria-label="Sil"
                          style={{width:24,height:24,borderRadius:6,border:"none",
                            background:"rgba(239,68,68,.12)",color:"#dc2626",
                            cursor:"pointer",fontSize:13,fontFamily:"inherit"}}>
                          🗑
                        </button>
                      </div>

                      {/* Yüz/kenar/köşe bilgisi */}
                      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:4,marginBottom:10}}>
                        <div style={{textAlign:"center",padding:"5px 3px",borderRadius:6,background:"#fff"}}>
                          <div style={{fontWeight:800,color:"#0e7490",fontSize:15}}>{def.faces}</div>
                          <div style={{fontSize:8,color:"rgba(30,27,75,.5)",fontWeight:700}}>
                            {lang==="ku"?"Rû":lang==="en"?"Faces":"Yüz"}
                          </div>
                        </div>
                        <div style={{textAlign:"center",padding:"5px 3px",borderRadius:6,background:"#fff"}}>
                          <div style={{fontWeight:800,color:"#0e7490",fontSize:15}}>{def.edges}</div>
                          <div style={{fontSize:8,color:"rgba(30,27,75,.5)",fontWeight:700}}>
                            {lang==="ku"?"Kêlek":lang==="en"?"Edges":"Kenar"}
                          </div>
                        </div>
                        <div style={{textAlign:"center",padding:"5px 3px",borderRadius:6,background:"#fff"}}>
                          <div style={{fontWeight:800,color:"#0e7490",fontSize:15}}>{def.vertices}</div>
                          <div style={{fontSize:8,color:"rgba(30,27,75,.5)",fontWeight:700}}>
                            {lang==="ku"?"Goşe":lang==="en"?"Vertices":"Köşe"}
                          </div>
                        </div>
                      </div>

                      {/* Yaw slider — cismi yatay döndür */}
                      <div style={{marginBottom:8}}>
                        <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                          <span style={{fontSize:9,fontWeight:700,color:"#0e7490"}}>
                            ↻ {lang==="ku"?"Zivirandin":lang==="en"?"Rotation":"Döndürme"}
                          </span>
                          <span style={{fontSize:9,fontWeight:600,color:"rgba(14,116,144,.6)"}}>
                            {Math.round(((selected3D.yaw%360)+360)%360)}°
                          </span>
                        </div>
                        <input type="range" min={-180} max={180} step={5}
                          value={selected3D.yaw}
                          onChange={e=>update3DSolid(selected3D.id,{yaw:parseFloat(e.target.value)})}
                          style={{width:"100%",accentColor:"#0891b2"}}/>
                      </div>

                      {/* Boyut slider */}
                      <div style={{marginBottom:8}}>
                        <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                          <span style={{fontSize:9,fontWeight:700,color:"#0e7490"}}>
                            📏 {lang==="ku"?"Mezinahî":lang==="en"?"Size":"Boyut"}
                          </span>
                          <span style={{fontSize:9,fontWeight:600,color:"rgba(14,116,144,.6)"}}>
                            {Math.round(selected3D.size)}
                          </span>
                        </div>
                        <input type="range" min={80} max={400} step={10}
                          value={selected3D.size}
                          onChange={e=>update3DSolid(selected3D.id,{size:parseFloat(e.target.value)})}
                          style={{width:"100%",accentColor:"#0891b2"}}/>
                      </div>

                      {/* Renk seçici */}
                      <div style={{marginBottom:8}}>
                        <div style={{fontSize:9,fontWeight:700,color:"#0e7490",marginBottom:3}}>
                          🎨 {lang==="ku"?"Reng":lang==="en"?"Color":"Renk"}
                        </div>
                        <div style={{display:"grid",gridTemplateColumns:"repeat(6, 1fr)",gap:3}}>
                          {["#0891b2","#ef4444","#10b981","#f59e0b","#8b5cf6","#ec4899"].map(c=>{
                            const isSel=selected3D.color===c;
                            return (
                              <button key={c}
                                onClick={()=>update3DSolid(selected3D.id,{color:c})}
                                aria-pressed={isSel}
                                style={{aspectRatio:"1",borderRadius:5,
                                  border:isSel?"2.5px solid "+P.accent:"1px solid rgba(0,0,0,.1)",
                                  background:c,cursor:"pointer",
                                  boxShadow:isSel?"0 0 0 2px #fff inset":"none"}}/>
                            );
                          })}
                        </div>
                      </div>

                      {/* Aç/Kapat — cisim için */}
                      <button onClick={()=>update3DSolid(selected3D.id,{unfolded:!selected3D.unfolded})}
                        style={{width:"100%",padding:"10px",borderRadius:8,border:"none",
                          background:selected3D.unfolded
                            ?"linear-gradient(135deg,#f59e0b,#d97706)"
                            :"linear-gradient(135deg,#0891b2,#0e7490)",
                          cursor:"pointer",fontSize:12,fontWeight:800,color:"#fff",fontFamily:"inherit",
                          display:"flex",alignItems:"center",justifyContent:"center",gap:6,
                          boxShadow:selected3D.unfolded
                            ?"0 3px 10px rgba(245,158,11,.3)"
                            :"0 3px 10px rgba(8,145,178,.3)"}}>
                        <span style={{fontSize:16}}>{selected3D.unfolded?"🔒":"📂"}</span>
                        {selected3D.unfolded
                          ?(lang==="ku"?"3B":lang==="en"?"Fold":"3B'ye Dön")
                          :(lang==="ku"?"Veke":lang==="en"?"Unfold":"Açınım")}
                      </button>
                    </div>
                  );
                })():(
                  <div style={{padding:"12px 10px",borderRadius:8,
                    background:"rgba(99,102,241,.04)",border:"1px dashed rgba(99,102,241,.2)",
                    fontSize:10,color:"rgba(30,27,75,.5)",lineHeight:1.6,textAlign:"center",
                    fontStyle:"italic",marginBottom:10}}>
                    {lang==="ku"
                      ?"Cisimekê bitikîne da ku kontrol bikî"
                      :lang==="en"
                      ?"Click a solid to control it"
                      :"Kontrol için bir cisme tıkla"}
                  </div>
                )}

                {/* Hepsini sil */}
                {solids3D.length>0&&(
                  <button onClick={()=>{setSolids3D([]);setSelected3DId(null);}}
                    style={{width:"100%",padding:"7px 0",borderRadius:7,border:"1.5px solid rgba(239,68,68,.3)",
                      background:"rgba(239,68,68,.05)",color:"#dc2626",
                      cursor:"pointer",fontSize:10,fontWeight:700,fontFamily:"inherit",marginBottom:8}}>
                    🗑 {lang==="ku"?"Hemî Paqij Bike":lang==="en"?"Clear All":"Hepsini Temizle"}
                  </button>
                )}

                {/* Pedagojik rehber */}
                <div style={{padding:"8px 10px",borderRadius:8,
                  background:"rgba(99,102,241,.05)",fontSize:10,color:"rgba(30,27,75,.65)",lineHeight:1.55}}>
                  💡 {lang==="ku"
                    ?"Bipirse: Kîjan cisim çend rûyan heye? Çawa ji çaryaliyê tê çêkirin?"
                    :lang==="en"
                    ?"Ask: How many faces? How is each solid made from 2D shapes?"
                    :"Sor: Hangi cismin kaç yüzü var? Her biri hangi 2B şekillerden oluşur?"}
                </div>

                {/* Araştırma notu */}
                <div style={{marginTop:8,padding:"5px 8px",borderRadius:6,fontSize:8,
                  color:"rgba(30,27,75,.45)",fontStyle:"italic",lineHeight:1.5,textAlign:"center"}}>
                  📖 Meng (2009): 3B↔açınım geçişi Van Hiele L0→L1 için etkili.
                </div>
              </div>
            );
          })()}

          {/* Geoboard */}
          {sideTab==="geo"&&(()=>{
            /* Seçili şekil — sidebar'da tıklananla aynı, yoksa son şekil */
            const selIdx = selectedGeoShapeIdx!==null && selectedGeoShapeIdx<geoShapes.length
              ? selectedGeoShapeIdx
              : (geoShapes.length ? geoShapes.length-1 : null);
            const activeShape = selIdx!==null ? geoShapes[selIdx] : null;
            const activeShapeName = activeShape ? geoShapeName(activeShape.pts) : null;
            return (
              <div style={{flex:1,padding:"8px 10px",display:"flex",flexDirection:"column",
                overflowY:"auto"}}>
                {/* Başlık kartı */}
                <div style={{padding:"8px 10px",borderRadius:9,marginBottom:8,
                  background:"linear-gradient(135deg,rgba(146,64,14,.08),rgba(245,158,11,.05))",
                  border:"1.5px solid rgba(146,64,14,.2)"}}>
                  <div style={{fontSize:10,fontWeight:800,color:"#92400e",marginBottom:2}}>
                    📌 {lang==="ku"?"Textê Geometrîk":lang==="en"?"Geoboard":"Geometri Tahtası"}
                  </div>
                  <div style={{fontSize:9,color:"rgba(146,64,14,.7)",lineHeight:1.5}}>
                    {lang==="ku"
                      ?"Texte li kanvasê ye. Çivîyan bitikîne ku teşeyan çêkî."
                      :lang==="en"
                      ?"Board is on the canvas. Click pegs to create shapes."
                      :"Tahta kanvasta. Çivilere tıklayarak şekil oluştur."}
                  </div>
                </div>

                {/* Grid boyutu */}
                <div style={{fontSize:9,fontWeight:800,color:P.accentD,textTransform:"uppercase",
                  letterSpacing:.5,marginBottom:4,padding:"0 2px"}}>
                  {lang==="ku"?"Mezinahiya Girê":lang==="en"?"Grid Size":"Grid Boyutu"}
                </div>
                <div style={{display:"flex",gap:3,marginBottom:8,width:"100%"}}>
                  {[5,7,11].map(n=>(
                    <button key={n}
                      onClick={()=>{
                        setGeoGridSize(n);
                        setGeoLines([]);setGeoStart(null);setGeoShapes([]);
                      }}
                      aria-pressed={geoGridSize===n}
                      style={{flex:1,padding:"8px 0",borderRadius:7,border:"1.5px solid",
                        borderColor:geoGridSize===n?P.accent:"rgba(99,102,241,.2)",
                        background:geoGridSize===n?P.accentL:"rgba(255,255,255,.6)",
                        cursor:"pointer",fontSize:12,fontWeight:800,
                        color:geoGridSize===n?P.accentD:P.text,fontFamily:"inherit"}}>
                      {n}×{n}
                    </button>
                  ))}
                </div>

                {/* Renk seçici */}
                <div style={{fontSize:9,fontWeight:800,color:P.accentD,textTransform:"uppercase",
                  letterSpacing:.5,marginBottom:4,padding:"0 2px"}}>
                  🎨 {lang==="ku"?"Reng":lang==="en"?"Color":"Renk"}
                </div>
                <div style={{display:"flex",gap:4,marginBottom:10,width:"100%"}}>
                  {["#6366f1","#ef4444","#10b981","#f59e0b","#ec4899","#06b6d4"].map(c=>(
                    <button key={c} onClick={()=>setGeoColor(c)}
                      aria-label={`Renk ${c}`}
                      aria-pressed={geoColor===c}
                      style={{flex:1,height:28,borderRadius:6,
                        border:geoColor===c?"3px solid "+P.accent:"1.5px solid rgba(0,0,0,.1)",
                        background:c,cursor:"pointer",
                        boxShadow:geoColor===c?"0 0 0 2px #fff inset":"none",
                        fontFamily:"inherit"}}/>
                  ))}
                </div>

                {/* Aktif şekil bilgileri — büyük kart */}
                {activeShape?(
                  <div style={{marginBottom:10,padding:"10px 12px",borderRadius:10,width:"100%",
                    background:activeShape.color+"15",border:"2px solid "+activeShape.color+"50",
                    animation:"popIn .3s"}}>
                    <div style={{fontSize:14,fontWeight:800,color:activeShape.color,marginBottom:8,
                      display:"flex",alignItems:"center",justifyContent:"space-between",gap:6}}>
                      <div style={{display:"flex",alignItems:"center",gap:6}}>
                        <span style={{fontSize:18}}>✨</span>
                        <span>{activeShapeName}</span>
                      </div>
                      {/* Seçili şeklin numarası */}
                      <span style={{fontSize:9,fontWeight:700,color:"rgba(30,27,75,.5)",
                        background:"rgba(255,255,255,.7)",padding:"2px 6px",borderRadius:10}}>
                        #{selIdx+1}
                      </span>
                    </div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginBottom:8}}>
                      <div style={{padding:"8px 6px",borderRadius:7,background:"rgba(255,255,255,.8)",textAlign:"center"}}>
                        <div style={{fontWeight:800,color:P.text,fontSize:20,lineHeight:1}}>
                          {geoShoelaceArea(activeShape.pts).toFixed(1)}
                        </div>
                        <div style={{color:"rgba(30,27,75,.55)",fontWeight:700,fontSize:9,marginTop:3}}>
                          {lang==="ku"?"Rûber":lang==="en"?"Area":"Alan"}
                          <br/>
                          <span style={{fontSize:8,fontStyle:"italic"}}>
                            {lang==="ku"?"birim²":lang==="en"?"units²":"birim²"}
                          </span>
                        </div>
                      </div>
                      <div style={{padding:"8px 6px",borderRadius:7,background:"rgba(255,255,255,.8)",textAlign:"center"}}>
                        <div style={{fontWeight:800,color:P.text,fontSize:20,lineHeight:1}}>
                          {geoPerimeter(activeShape.pts).toFixed(1)}
                        </div>
                        <div style={{color:"rgba(30,27,75,.55)",fontWeight:700,fontSize:9,marginTop:3}}>
                          {lang==="ku"?"Dor":lang==="en"?"Perimeter":"Çevre"}
                          <br/>
                          <span style={{fontSize:8,fontStyle:"italic"}}>
                            {lang==="ku"?"birim":lang==="en"?"units":"birim"}
                          </span>
                        </div>
                      </div>
                    </div>
                    {/* Seçili şekli renklendir — 6 renk */}
                    <div style={{fontSize:9,fontWeight:700,color:activeShape.color,marginBottom:3}}>
                      🎨 {lang==="ku"?"Rengê teşeyê biguherîne":lang==="en"?"Change shape color":"Şekil rengini değiştir"}
                    </div>
                    <div style={{display:"flex",gap:3}}>
                      {["#6366f1","#ef4444","#10b981","#f59e0b","#ec4899","#06b6d4"].map(c=>(
                        <button key={c}
                          onClick={()=>{
                            /* Sadece seçili şeklin rengini değiştir */
                            setGeoShapes(arr=>arr.map((sh,i)=>i===selIdx?{...sh,color:c}:sh));
                          }}
                          aria-pressed={activeShape.color===c}
                          style={{flex:1,height:22,borderRadius:5,
                            border:activeShape.color===c?"2.5px solid "+P.accent:"1px solid rgba(0,0,0,.1)",
                            background:c,cursor:"pointer",
                            boxShadow:activeShape.color===c?"0 0 0 2px #fff inset":"none"}}/>
                      ))}
                    </div>
                  </div>
                ):(
                  <div style={{marginBottom:10,padding:"12px 10px",borderRadius:8,
                    background:"rgba(99,102,241,.04)",border:"1px dashed rgba(99,102,241,.2)",
                    fontSize:10,color:"rgba(30,27,75,.5)",lineHeight:1.6,textAlign:"center",fontStyle:"italic"}}>
                    {lang==="ku"
                      ?"Teşeyek biçêkî ku agahî li vir xuya bibin"
                      :lang==="en"
                      ?"Create a shape to see details here"
                      :"Şekil oluştur, bilgiler burada görünecek"}
                  </div>
                )}

                {/* ═══ ŞEKİL LİSTESİ ═══ */}
                {geoShapes.length>1&&(
                  <>
                    <div style={{fontSize:9,fontWeight:800,color:P.accentD,textTransform:"uppercase",
                      letterSpacing:.5,marginBottom:4,padding:"0 2px",
                      display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                      <span>📋 {lang==="ku"?"Teşên Hatine Çêkirin":lang==="en"?"Created Shapes":"Oluşturulan Şekiller"}</span>
                      <span style={{fontSize:9,color:"rgba(30,27,75,.5)",fontWeight:700}}>
                        {geoShapes.length}
                      </span>
                    </div>
                    <div style={{marginBottom:8,maxHeight:180,overflowY:"auto",
                      padding:"4px",borderRadius:8,background:"rgba(99,102,241,.04)",
                      border:"1px solid rgba(99,102,241,.1)"}}>
                      {geoShapes.map((sh,idx)=>{
                        const isSel=idx===selIdx;
                        const name=geoShapeName(sh.pts);
                        /* Mini önizleme için bbox */
                        const rs=sh.pts.map(p=>p.r), cs=sh.pts.map(p=>p.c);
                        const minR=Math.min(...rs), maxR=Math.max(...rs);
                        const minC=Math.min(...cs), maxC=Math.max(...cs);
                        const bw=Math.max(1,maxC-minC), bh=Math.max(1,maxR-minR);
                        const scale=22/Math.max(bw,bh);
                        const mini=sh.pts.map(p=>`${(p.c-minC)*scale+2},${(p.r-minR)*scale+2}`).join(" ");
                        return (
                          <div key={idx}
                            onClick={()=>setSelectedGeoShapeIdx(idx)}
                            style={{display:"flex",alignItems:"center",gap:6,padding:"5px 6px",
                              borderRadius:6,marginBottom:2,cursor:"pointer",
                              background:isSel?sh.color+"20":"transparent",
                              border:isSel?"1.5px solid "+sh.color:"1.5px solid transparent",
                              transition:"all .1s"}}
                            onMouseEnter={e=>!isSel&&(e.currentTarget.style.background="rgba(99,102,241,.06)")}
                            onMouseLeave={e=>!isSel&&(e.currentTarget.style.background="transparent")}>
                            {/* Mini SVG önizleme */}
                            <svg width="28" height="28" style={{flexShrink:0,
                              background:"#fff",borderRadius:4,border:"1px solid rgba(0,0,0,.08)"}}>
                              <polygon points={mini}
                                fill={sh.color+"40"} stroke={sh.color} strokeWidth="1.2"/>
                            </svg>
                            {/* Ad + numara */}
                            <div style={{flex:1,minWidth:0}}>
                              <div style={{fontSize:10,fontWeight:700,color:sh.color,
                                whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>
                                #{idx+1} {name}
                              </div>
                              <div style={{fontSize:8,color:"rgba(30,27,75,.5)"}}>
                                A: {geoShoelaceArea(sh.pts).toFixed(1)} · Ç: {geoPerimeter(sh.pts).toFixed(1)}
                              </div>
                            </div>
                            {/* Sil butonu */}
                            <button
                              onClick={e=>{
                                e.stopPropagation();
                                setGeoShapes(arr=>arr.filter((_,i)=>i!==idx));
                                /* Seçimi güncelle */
                                if(selectedGeoShapeIdx===idx) setSelectedGeoShapeIdx(null);
                                else if(selectedGeoShapeIdx!==null&&selectedGeoShapeIdx>idx){
                                  setSelectedGeoShapeIdx(selectedGeoShapeIdx-1);
                                }
                              }}
                              aria-label={lang==="ku"?"Jê bibe":lang==="en"?"Delete":"Sil"}
                              style={{width:22,height:22,flexShrink:0,borderRadius:5,border:"none",
                                background:"rgba(239,68,68,.1)",color:"#dc2626",
                                cursor:"pointer",fontSize:11,fontFamily:"inherit",
                                display:"flex",alignItems:"center",justifyContent:"center"}}>
                              🗑
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}

                {/* Butonlar */}
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:5,width:"100%"}}>
                  <button onClick={()=>{
                    if(geoStart){setGeoStart(null);}
                    else if(geoLines.length){
                      const last=geoLines[geoLines.length-1];
                      setGeoLines(ls=>ls.slice(0,-1));
                      if(geoLines.length>1) setGeoStart(last.from);
                      else setGeoStart(last.from);
                    } else if(geoShapes.length){
                      setGeoShapes(s=>s.slice(0,-1));
                    }
                  }}
                    disabled={!geoStart&&!geoLines.length&&!geoShapes.length}
                    style={{padding:"10px 0",borderRadius:8,border:"none",fontFamily:"inherit",
                      background:(geoStart||geoLines.length||geoShapes.length)?"rgba(99,102,241,.15)":"rgba(99,102,241,.04)",
                      color:(geoStart||geoLines.length||geoShapes.length)?P.accentD:"#ccc",
                      cursor:(geoStart||geoLines.length||geoShapes.length)?"pointer":"default",
                      fontSize:11,fontWeight:800}}>
                    ↶ {lang==="ku"?"Vegerîne":lang==="en"?"Undo":"Geri Al"}
                  </button>
                  <button onClick={()=>{setGeoLines([]);setGeoStart(null);setGeoShapes([]);}}
                    disabled={!geoLines.length&&!geoShapes.length&&!geoStart}
                    style={{padding:"10px 0",borderRadius:8,border:"none",fontFamily:"inherit",
                      background:(geoLines.length||geoShapes.length||geoStart)?"rgba(239,68,68,.12)":"rgba(239,68,68,.04)",
                      color:(geoLines.length||geoShapes.length||geoStart)?"#dc2626":"#ccc",
                      cursor:(geoLines.length||geoShapes.length||geoStart)?"pointer":"default",
                      fontSize:11,fontWeight:800}}>
                    🗑 {lang==="ku"?"Paqij Bike":lang==="en"?"Clear":"Temizle"}
                  </button>
                </div>

                {/* Şekil sayacı */}
                {geoShapes.length>0&&(
                  <div style={{marginTop:8,padding:"5px 8px",borderRadius:6,
                    background:"rgba(16,185,129,.08)",fontSize:10,fontWeight:700,
                    color:"#065f46",textAlign:"center"}}>
                    ✓ {geoShapes.length} {lang==="ku"?"teşe hatin çêkirin":lang==="en"?"shapes created":"şekil oluşturuldu"}
                  </div>
                )}

                {/* Pedagojik ipucu */}
                <div style={{marginTop:10,padding:"8px 10px",borderRadius:8,width:"100%",
                  background:"rgba(99,102,241,.05)",fontSize:10,color:"rgba(30,27,75,.65)",lineHeight:1.55}}>
                  💡 {lang==="ku"
                    ?"Çivîyekê bitikîne → paşê çivîyên din. Vegere çivîya destpêkê (kesk) → teşe temam dibe."
                    :lang==="en"
                    ?"Click a peg → then more pegs. Click back to the start peg (green) → shape closes."
                    :"Çiviye tıkla → sonra başka çivilere. Başlangıç çivisine (yeşil) dön → şekil kapanır."}
                </div>

                {/* Araştırma notu */}
                <div style={{marginTop:8,padding:"5px 8px",borderRadius:6,fontSize:8,
                  color:"rgba(30,27,75,.45)",fontStyle:"italic",lineHeight:1.5,textAlign:"center"}}>
                  📖 NCTM: Geoboard ilkokul geometrisinin temel somut aracıdır (Clements & Battista 1992).
                </div>
              </div>
            );
          })()}

          {/* Ayarlar */}
          {/* ═══ ÖĞRETMEN PANOSU ═══
              Ders planı oluştur → JSON export → öğrenci import → ilerleme takip
              Mimari: yerel (backend yok). Dosya tabanlı paylaşım. */}
          {sideTab==="teach"&&(()=>{
            /* Tüm etkinlikler: hızlı quiz + faz dizileri */
            const ALL_ACTS=[
              ...VH_ACTS_OLD.map(a=>({kind:"quick",id:a.id,label:typeof a.label==="object"?a.label[lang]||a.label.tr:a.label,level:a.level,icon:a.icon})),
              ...PHASE_SEQUENCES.map(s=>({kind:"seq",id:s.id,label:(typeof s.topic==="object"?s.topic[lang]||s.topic.tr:s.topic)+" (5 faz)",level:s.level,icon:s.icon})),
            ];
            function addToPlan(act){
              setPlanDraft(p=>({...p,items:[...p.items,{...act,duration:5,key:nextId()}]}));
            }
            function removeFromPlan(key){
              setPlanDraft(p=>({...p,items:p.items.filter(it=>it.key!==key)}));
            }
            function moveItem(key,dir){
              setPlanDraft(p=>{
                const idx=p.items.findIndex(i=>i.key===key);
                if(idx<0) return p;
                const ni=idx+dir;
                if(ni<0||ni>=p.items.length) return p;
                const copy=[...p.items];
                [copy[idx],copy[ni]]=[copy[ni],copy[idx]];
                return {...p,items:copy};
              });
            }
            function setDuration(key,mins){
              setPlanDraft(p=>({...p,items:p.items.map(it=>it.key===key?{...it,duration:mins}:it)}));
            }
            function exportPlan(){
              if(!planDraft.name){alert(lang==="ku"?"Pêşî navê planê binivîse":lang==="en"?"Name the plan first":"Önce plan adını yaz");return;}
              if(planDraft.items.length===0){alert(lang==="ku"?"Herî kêm yek çalakî zêde bike":lang==="en"?"Add at least one activity":"En az bir etkinlik ekle");return;}
              const plan={...planDraft,createdAt:new Date().toISOString(),version:1};
              const blob=new Blob([JSON.stringify(plan,null,2)],{type:"application/json"});
              const url=URL.createObjectURL(blob);
              const a=document.createElement("a");
              a.href=url; a.download=`ders-plani-${planDraft.name.replace(/\s+/g,"_")}.json`;
              a.click();
              URL.revokeObjectURL(url);
            }
            function importPlan(e){
              const file=e.target.files?.[0];
              if(!file) return;
              const reader=new FileReader();
              reader.onload=ev=>{
                try{
                  const data=JSON.parse(ev.target.result);
                  if(!data.items||!Array.isArray(data.items)){
                    alert(lang==="ku"?"Dosyaya nederbasdar":lang==="en"?"Invalid file":"Geçersiz dosya");return;
                  }
                  /* Öğrenci moduna geç */
                  setActivePlan(data);
                  setPlanStep(0);
                  setPlanProgress({});
                  setPlanStartTime(Date.now());
                  alert((lang==="ku"?"Plan hate barkirin: ":lang==="en"?"Plan loaded: ":"Plan yüklendi: ")+data.name);
                }catch(err){
                  alert(lang==="ku"?"Dosya xera ye":lang==="en"?"Corrupt file":"Bozuk dosya");
                }
                e.target.value="";
              };
              reader.readAsText(file);
            }
            function exportProgress(){
              if(!activePlan){alert(lang==="ku"?"Plan çalak nîne":lang==="en"?"No active plan":"Aktif plan yok");return;}
              const report={
                planName:activePlan.name,
                studentCompletedAt:new Date().toISOString(),
                totalItems:activePlan.items.length,
                completedItems:Object.keys(planProgress).length,
                totalScore:Object.values(planProgress).reduce((s,p)=>s+(p.score||0),0),
                totalTimeSec:planStartTime?Math.floor((Date.now()-planStartTime)/1000):0,
                details:planProgress,
              };
              const blob=new Blob([JSON.stringify(report,null,2)],{type:"application/json"});
              const url=URL.createObjectURL(blob);
              const a=document.createElement("a");
              a.href=url; a.download=`ilerleme-${activePlan.name.replace(/\s+/g,"_")}.json`;
              a.click();
              URL.revokeObjectURL(url);
            }
            function stopStudentMode(){
              if(confirm(lang==="ku"?"Plan biqedîne?":lang==="en"?"End plan?":"Planı bitir?")){
                setActivePlan(null);
                setPlanStep(0);
                setPlanStartTime(null);
              }
            }
            const L={
              teacher:{tr:"Öğretmen",ku:"Mamoste",en:"Teacher"},
              student:{tr:"Öğrenci",ku:"Xwendekar",en:"Student"},
              planName:{tr:"Plan Adı",ku:"Navê Planê",en:"Plan Name"},
              planLevel:{tr:"Seviye",ku:"Ast",en:"Level"},
              available:{tr:"Seçilebilir Etkinlikler",ku:"Çalakiyên Berdest",en:"Available Activities"},
              planned:{tr:"Plandaki Etkinlikler",ku:"Çalakiyên di Planê",en:"Planned Activities"},
              duration:{tr:"dk",ku:"xk",en:"min"},
              exportPlan:{tr:"Planı Dışa Aktar (.json)",ku:"Planê Veguhezîne (.json)",en:"Export Plan (.json)"},
              importPlan:{tr:"Plan Yükle (.json)",ku:"Plan Barkirin (.json)",en:"Load Plan (.json)"},
              activePlan:{tr:"Aktif Plan",ku:"Plana Çalak",en:"Active Plan"},
              exportProgress:{tr:"İlerleme Raporunu İndir",ku:"Rapora Pêşketinê Daxîne",en:"Download Progress Report"},
              endPlan:{tr:"Planı Bitir",ku:"Planê Biqedîne",en:"End Plan"},
              progress:{tr:"İlerleme",ku:"Pêşketin",en:"Progress"},
            };
            const tx=k=>(L[k]||{})[lang]||L[k]?.tr||k;

            return (
              <div style={{flex:1,overflowY:"auto",padding:"8px"}}>
                {/* Rol başlığı */}
                <div style={{display:"flex",gap:2,marginBottom:8,background:"rgba(99,102,241,.06)",borderRadius:7,padding:2}}>
                  <button onClick={()=>setActivePlan(null)}
                    aria-pressed={!activePlan}
                    style={{flex:1,padding:"5px 0",borderRadius:5,border:"none",cursor:"pointer",fontFamily:"inherit",
                      background:!activePlan?"#6366f1":"transparent",
                      color:!activePlan?"#fff":"rgba(30,27,75,.5)",
                      fontSize:10,fontWeight:!activePlan?800:600}}>
                    👩‍🏫 {tx("teacher")}
                  </button>
                  <button onClick={()=>{/* Öğrenci modu: plan dosyası yükle */
                      document.getElementById("dg-plan-import")?.click();
                    }}
                    aria-pressed={!!activePlan}
                    style={{flex:1,padding:"5px 0",borderRadius:5,border:"none",cursor:"pointer",fontFamily:"inherit",
                      background:activePlan?"#10b981":"transparent",
                      color:activePlan?"#fff":"rgba(30,27,75,.5)",
                      fontSize:10,fontWeight:activePlan?800:600}}>
                    🎓 {tx("student")}
                  </button>
                </div>

                <input id="dg-plan-import" type="file" accept=".json,application/json"
                  onChange={importPlan} style={{display:"none"}}/>

                {!activePlan?(
                  /* ═══ ÖĞRETMEN MODU ═══ */
                  <>
                    {/* 5 Practices Rehber Kartı — Smith & Stein (2018) çerçevesi */}
                    <details style={{marginBottom:8,background:"linear-gradient(135deg,rgba(99,102,241,.08),rgba(139,92,246,.05))",
                      borderRadius:8,border:"1px solid rgba(99,102,241,.2)"}}>
                      <summary style={{padding:"7px 10px",cursor:"pointer",fontSize:10,fontWeight:800,
                        color:P.accentD,listStyle:"none",display:"flex",alignItems:"center",gap:5}}>
                        🎓 {lang==="ku"?"Rêberê 5 Pratîkan":lang==="en"?"5 Practices Guide":"5 Pratik Rehberi"}
                        <span style={{fontSize:8,fontWeight:600,color:"rgba(30,27,75,.5)",marginLeft:"auto"}}>
                          Smith & Stein (2018)
                        </span>
                      </summary>
                      <div style={{padding:"0 10px 8px",fontSize:9.5,lineHeight:1.55,color:"rgba(30,27,75,.75)"}}>
                        {(() => {
                          const practices=[
                            {n:"1",
                             name:lang==="ku"?"Pêşbîn bike (Anticipate)":lang==="en"?"Anticipate":"Öngör",
                             desc:lang==="ku"
                               ?"Berî dersê: Fehmkirinên şaş bibîne (li ⚠ nîşanê binihêre)."
                               :lang==="en"
                               ?"Before lesson: identify misconceptions (check ⚠ badges)."
                               :"Ders öncesi: Yanlış kavramları belirle (⚠ rozetine bak)."},
                            {n:"2",
                             name:lang==="ku"?"Bişopîne (Monitor)":lang==="en"?"Monitor":"İzle",
                             desc:lang==="ku"
                               ?"Di dersê de: Xwendekaran bişopîne, notan bigire."
                               :lang==="en"
                               ?"During lesson: Walk around, observe, take notes."
                               :"Ders sırasında: Sınıfı dolaş, gözlemle, not al."},
                            {n:"3",
                             name:lang==="ku"?"Hilbijêre (Select)":lang==="en"?"Select":"Seç",
                             desc:lang==="ku"
                               ?"Kîjan xwendekar çareseriya xwe nîşan bide? Stratejîk hilbijêre."
                               :lang==="en"
                               ?"Which students share their solutions? Choose strategically."
                               :"Hangi öğrenciler çözümünü paylaşsın? Stratejik seç."},
                            {n:"4",
                             name:lang==="ku"?"Rêz bike (Sequence)":lang==="en"?"Sequence":"Sırala",
                             desc:lang==="ku"
                               ?"Ji sade bigire ber bi tevlihev ve — da ku pêşî bifikirin."
                               :lang==="en"
                               ?"From simple to complex — build toward key insight."
                               :"Basitten karmaşığa — temel içgörüye doğru."},
                            {n:"5",
                             name:lang==="ku"?"Girêbide (Connect)":lang==="en"?"Connect":"Bağla",
                             desc:lang==="ku"
                               ?"Çi wekhev e? Ji fikrên cuda yek çarçove çêbike."
                               :lang==="en"
                               ?"What's common? Link different approaches to one idea."
                               :"Ortak ne? Farklı yaklaşımları tek fikirde birleştir."},
                          ];
                          return practices.map(p=>(
                            <div key={p.n} style={{display:"flex",gap:6,marginBottom:4,alignItems:"flex-start"}}>
                              <span style={{width:16,height:16,borderRadius:"50%",
                                background:P.accent,color:"#fff",fontSize:9,fontWeight:800,
                                display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                                {p.n}
                              </span>
                              <div style={{flex:1}}>
                                <span style={{fontWeight:800,color:P.accentD}}>{p.name}:</span>
                                {" "}{p.desc}
                              </div>
                            </div>
                          ));
                        })()}
                      </div>
                    </details>

                    {/* Plan adı ve seviye */}
                    <div style={{marginBottom:8}}>
                      <label style={{fontSize:9,fontWeight:700,color:P.accentD,display:"block",marginBottom:3}}>
                        {tx("planName")}
                      </label>
                      <input type="text" value={planDraft.name}
                        onChange={e=>setPlanDraft(p=>({...p,name:e.target.value}))}
                        placeholder={lang==="ku"?"mînak: Dersa Çaryaliyê":lang==="en"?"e.g. Square Lesson":"örn: Kare Dersi"}
                        style={{width:"100%",padding:"5px 8px",borderRadius:7,
                          border:"1.5px solid rgba(99,102,241,.2)",
                          fontSize:11,fontFamily:"inherit",color:P.text,boxSizing:"border-box"}}/>
                    </div>

                    {/* Mevcut etkinlikler */}
                    <div style={{fontSize:9,fontWeight:800,color:P.accentD,textTransform:"uppercase",
                      letterSpacing:1,marginBottom:4}}>
                      ➕ {tx("available")}
                    </div>
                    <div style={{maxHeight:200,overflowY:"auto",marginBottom:10,
                      background:"rgba(99,102,241,.04)",borderRadius:7,padding:4}}>
                      {ALL_ACTS.map(act=>{
                        const c=["#f59e0b","#6366f1","#10b981"][act.level];
                        const alreadyInPlan=planDraft.items.some(i=>i.id===act.id);
                        return (
                          <button key={act.id} onClick={()=>addToPlan(act)}
                            disabled={alreadyInPlan}
                            style={{width:"100%",marginBottom:3,padding:"5px 7px",
                              borderRadius:6,border:"1px solid "+(alreadyInPlan?c+"25":c+"50"),
                              background:alreadyInPlan?c+"10":"rgba(255,255,255,.7)",
                              cursor:alreadyInPlan?"default":"pointer",fontFamily:"inherit",
                              display:"flex",alignItems:"center",gap:5,textAlign:"left",
                              opacity:alreadyInPlan?0.55:1}}>
                            <VHBadge level={act.level}/>
                            <span style={{fontSize:11}}>{act.icon}</span>
                            <span style={{fontSize:10,fontWeight:600,color:P.text,flex:1}}>
                              {act.label}
                            </span>
                            {act.kind==="seq"&&<span style={{fontSize:8,fontWeight:800,color:"#7c3aed",
                              padding:"1px 4px",borderRadius:3,background:"rgba(124,58,237,.1)"}}>5F</span>}
                            {alreadyInPlan?"✓":"+"}
                          </button>
                        );
                      })}
                    </div>

                    {/* Plandaki etkinlikler */}
                    <div style={{fontSize:9,fontWeight:800,color:"#059669",textTransform:"uppercase",
                      letterSpacing:1,marginBottom:4}}>
                      📋 {tx("planned")} ({planDraft.items.length})
                    </div>
                    {planDraft.items.length===0?(
                      <div style={{padding:"12px",textAlign:"center",fontSize:10,color:"rgba(30,27,75,.4)",
                        background:"rgba(16,185,129,.03)",borderRadius:7,border:"1.5px dashed rgba(16,185,129,.3)"}}>
                        {lang==="ku"?"Hîna çi zêde nebûye":lang==="en"?"Nothing added yet":"Henüz etkinlik eklenmedi"}
                      </div>
                    ):(
                      <div style={{marginBottom:8}}>
                        {planDraft.items.map((it,idx)=>{
                          /* Yanlış kavramları getir — Smith & Stein 5 Practices'in "Anticipate" pratiği */
                          const miscKeys=getMisconceptions(it.id);
                          const miscList=miscKeys.flatMap(k=>MISCONCEPTIONS[k]||[]);
                          const expanded=planExpandedItem===it.key;
                          return (
                            <div key={it.key} style={{marginBottom:3,
                              background:"#fff",borderRadius:7,border:"1px solid rgba(16,185,129,.25)",
                              overflow:"hidden"}}>
                              <div style={{padding:"5px 7px",display:"flex",alignItems:"center",gap:4}}>
                                <span style={{fontSize:9,fontWeight:800,color:"#059669",width:14,textAlign:"center"}}>
                                  {idx+1}.
                                </span>
                                <span style={{fontSize:11}}>{it.icon}</span>
                                <span style={{fontSize:10,fontWeight:600,color:P.text,flex:1,
                                  overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                                  {it.label}
                                </span>
                                {/* Yanlış kavram sayısı varsa vurgula */}
                                {miscList.length>0&&(
                                  <button onClick={()=>setPlanExpandedItem(e=>e===it.key?null:it.key)}
                                    title={lang==="ku"?"Fehm kirinên şaş":lang==="en"?"Misconceptions":"Yanlış Kavramlar"}
                                    style={{padding:"2px 5px",borderRadius:4,border:"none",
                                      background:expanded?"#f59e0b":"rgba(245,158,11,.15)",
                                      color:expanded?"#fff":"#92400e",cursor:"pointer",
                                      fontSize:9,fontWeight:800,fontFamily:"inherit",
                                      display:"flex",alignItems:"center",gap:2}}>
                                    ⚠ {miscList.length}
                                  </button>
                                )}
                                {/* Önerilen süre — diskalküli için yumuşatıldı (Edutopia 2025,
                                    dyscalculia.org: "Awareness of time running out adds stress") */}
                                <input type="number" min="1" max="60" value={it.duration}
                                  onChange={e=>setDuration(it.key,parseInt(e.target.value)||1)}
                                  title={lang==="ku"?"Dema pêşniyarkirî (ji bo plankirinê)":lang==="en"?"Suggested time (for planning only)":"Önerilen süre (sadece planlama için)"}
                                  style={{width:32,padding:"2px 4px",borderRadius:4,
                                    border:"1px solid rgba(99,102,241,.2)",fontSize:10,fontFamily:"inherit",textAlign:"center"}}/>
                                <span style={{fontSize:9,color:"rgba(30,27,75,.5)"}}>~{tx("duration")}</span>
                                <button onClick={()=>moveItem(it.key,-1)}
                                  disabled={idx===0}
                                  style={{width:18,height:18,borderRadius:4,border:"none",
                                    background:idx===0?"transparent":"rgba(99,102,241,.1)",
                                    cursor:idx===0?"default":"pointer",fontSize:10,
                                    color:idx===0?"#ccc":P.accentD,fontFamily:"inherit"}}>↑</button>
                                <button onClick={()=>moveItem(it.key,1)}
                                  disabled={idx===planDraft.items.length-1}
                                  style={{width:18,height:18,borderRadius:4,border:"none",
                                    background:idx===planDraft.items.length-1?"transparent":"rgba(99,102,241,.1)",
                                    cursor:idx===planDraft.items.length-1?"default":"pointer",fontSize:10,
                                    color:idx===planDraft.items.length-1?"#ccc":P.accentD,fontFamily:"inherit"}}>↓</button>
                                <button onClick={()=>removeFromPlan(it.key)}
                                  style={{width:18,height:18,borderRadius:4,border:"none",
                                    background:"rgba(239,68,68,.1)",cursor:"pointer",fontSize:10,
                                    color:"#dc2626",fontFamily:"inherit"}}>×</button>
                              </div>
                              {/* Genişletilebilir yanlış kavramlar paneli */}
                              {expanded&&miscList.length>0&&(
                                <div style={{padding:"6px 9px",borderTop:"1px dashed rgba(245,158,11,.3)",
                                  background:"rgba(245,158,11,.04)"}}>
                                  <div style={{fontSize:9,fontWeight:800,color:"#92400e",marginBottom:4,
                                    textTransform:"uppercase",letterSpacing:.5}}>
                                    ⚠ {lang==="ku"?"Li vê dikkat bike":lang==="en"?"Watch for these":"Bunlara dikkat"}
                                  </div>
                                  {miscList.map((m,mi)=>{
                                    const txt=m[lang]||m.tr;
                                    return (
                                      <div key={mi} style={{marginBottom:4,padding:"4px 6px",
                                        background:"rgba(255,255,255,.75)",borderRadius:5,
                                        borderLeft:"2.5px solid #f59e0b"}}>
                                        <div style={{fontSize:9.5,color:P.text,lineHeight:1.45}}>
                                          {txt}
                                        </div>
                                        <div style={{fontSize:8,color:"rgba(146,64,14,.7)",
                                          fontStyle:"italic",marginTop:1}}>
                                          📖 {m.src}
                                        </div>
                                      </div>
                                    );
                                  })}
                                  <div style={{fontSize:8,color:"rgba(30,27,75,.5)",
                                    fontStyle:"italic",marginTop:4,lineHeight:1.4}}>
                                    {lang==="ku"
                                      ?"🎓 Smith & Stein 5 Practices: Pratika 1 — Pêşbîn bikin (Anticipate)"
                                      :lang==="en"
                                      ?"🎓 Smith & Stein 5 Practices: Practice 1 — Anticipate"
                                      :"🎓 Smith & Stein 5 Practices: 1. Pratik — Öngörme (Anticipate)"}
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                        <div style={{padding:"4px 7px",fontSize:9,color:"rgba(30,27,75,.5)",textAlign:"right"}}>
                          ⏱ ~{planDraft.items.reduce((s,i)=>s+(i.duration||0),0)} {tx("duration")}
                          <span style={{marginLeft:6,fontSize:8,fontStyle:"italic"}}>
                            {lang==="ku"?"(pêşniyarkirî)":lang==="en"?"(suggested)":"(önerilen)"}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Export/import butonları */}
                    <div style={{display:"flex",flexDirection:"column",gap:4}}>
                      <button onClick={exportPlan}
                        style={{padding:"7px",borderRadius:7,border:"none",
                          background:"linear-gradient(135deg,#6366f1,#4f46e5)",
                          cursor:"pointer",fontSize:11,fontWeight:700,color:"#fff",fontFamily:"inherit"}}>
                        💾 {tx("exportPlan")}
                      </button>
                      <button onClick={()=>document.getElementById("dg-plan-import")?.click()}
                        style={{padding:"7px",borderRadius:7,border:"1.5px solid rgba(99,102,241,.3)",
                          background:"rgba(99,102,241,.05)",
                          cursor:"pointer",fontSize:11,fontWeight:700,color:P.accentD,fontFamily:"inherit"}}>
                        📂 {tx("importPlan")}
                      </button>
                      {/* Öğrenci raporu görüntüleyici — Desmos Dashboard "summary view" esinlenmesi */}
                      <button onClick={()=>document.getElementById("dg-report-import")?.click()}
                        style={{padding:"7px",borderRadius:7,border:"1.5px solid rgba(16,185,129,.4)",
                          background:"rgba(16,185,129,.05)",
                          cursor:"pointer",fontSize:11,fontWeight:700,color:"#065f46",fontFamily:"inherit"}}>
                        📊 {lang==="ku"?"Rapora Xwendekarê Bibîne":lang==="en"?"View Student Report":"Öğrenci Raporu Görüntüle"}
                      </button>
                      <input id="dg-report-import" type="file" accept=".json,application/json"
                        onChange={e=>{
                          const file=e.target.files?.[0];
                          if(!file) return;
                          const reader=new FileReader();
                          reader.onload=ev=>{
                            try{
                              const data=JSON.parse(ev.target.result);
                              if(!data.planName||!data.details){
                                alert(lang==="ku"?"Ev ne raporek pêşketinê ye":lang==="en"?"Not a progress report":"Bu bir ilerleme raporu değil");return;
                              }
                              setViewedReport(data);
                            }catch(err){
                              alert(lang==="ku"?"Dosya xera ye":lang==="en"?"Corrupt file":"Bozuk dosya");
                            }
                            e.target.value="";
                          };
                          reader.readAsText(file);
                        }} style={{display:"none"}}/>
                    </div>

                    {/* Yüklenen rapor görüntüleyici */}
                    {viewedReport&&(
                      <div style={{marginTop:10,padding:"10px",borderRadius:9,
                        background:"#fff",border:"1.5px solid rgba(16,185,129,.3)",
                        boxShadow:"0 4px 16px rgba(16,185,129,.1)"}}>
                        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:6}}>
                          <span style={{fontSize:10,fontWeight:800,color:"#065f46",textTransform:"uppercase",letterSpacing:.5}}>
                            📊 {lang==="ku"?"Rapor":lang==="en"?"Report":"Rapor"}
                          </span>
                          <button onClick={()=>setViewedReport(null)}
                            style={{background:"none",border:"none",cursor:"pointer",fontSize:14,color:"#999"}}>×</button>
                        </div>
                        <div style={{fontSize:12,fontWeight:800,color:P.text,marginBottom:4}}>
                          {viewedReport.planName}
                        </div>
                        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginBottom:8}}>
                          <div style={{padding:"6px",borderRadius:6,background:"rgba(99,102,241,.06)",textAlign:"center"}}>
                            <div style={{fontSize:9,color:"rgba(30,27,75,.5)",fontWeight:700}}>
                              {lang==="ku"?"Qediyayî":lang==="en"?"Done":"Tamamlanan"}
                            </div>
                            <div style={{fontSize:16,fontWeight:800,color:P.accentD}}>
                              {viewedReport.completedItems}/{viewedReport.totalItems}
                            </div>
                          </div>
                          <div style={{padding:"6px",borderRadius:6,background:"rgba(245,158,11,.08)",textAlign:"center"}}>
                            <div style={{fontSize:9,color:"rgba(30,27,75,.5)",fontWeight:700}}>
                              {lang==="ku"?"Xal":lang==="en"?"Score":"Puan"}
                            </div>
                            <div style={{fontSize:16,fontWeight:800,color:"#f59e0b"}}>
                              {viewedReport.totalScore}
                            </div>
                          </div>
                        </div>
                        {viewedReport.totalTimeSec>0&&(
                          <div style={{fontSize:10,color:"rgba(30,27,75,.6)",marginBottom:6,textAlign:"center"}}>
                            ⏱ {Math.floor(viewedReport.totalTimeSec/60)}:{String(viewedReport.totalTimeSec%60).padStart(2,"0")}
                          </div>
                        )}
                        <div style={{fontSize:9,fontWeight:800,color:"#065f46",marginBottom:4,
                          textTransform:"uppercase",letterSpacing:.5}}>
                          {lang==="ku"?"Hûragahî":lang==="en"?"Details":"Detaylar"}
                        </div>
                        {Object.entries(viewedReport.details).map(([key,d])=>(
                          <div key={key} style={{padding:"4px 7px",marginBottom:2,
                            background:"rgba(16,185,129,.05)",borderRadius:5,
                            fontSize:9,color:P.text,display:"flex",gap:6,alignItems:"center"}}>
                            <span style={{color:"#059669",fontWeight:800}}>✓</span>
                            <span style={{flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                              {key}
                            </span>
                            <span style={{color:"#f59e0b",fontWeight:700}}>+{d.score||0}</span>
                          </div>
                        ))}
                        <div style={{marginTop:6,padding:"5px 7px",borderRadius:5,
                          background:"rgba(99,102,241,.06)",fontSize:8.5,color:"rgba(30,27,75,.6)",
                          lineHeight:1.5,fontStyle:"italic"}}>
                          💡 {lang==="ku"
                            ?"5 Pratîk - 3: Hilbijêre: Ji bo çareseriyên xelet ên tîpîk, xwendekaran ji nû ve rave bikin."
                            :lang==="en"
                            ?"5 Practices - 3: Select: For common incorrect answers, have students re-explain."
                            :"5 Pratik - 3: Seç: Sık yapılan yanlışlar için öğrencilerden yeniden açıklama iste."}
                        </div>
                      </div>
                    )}
                  </>
                ):(
                  /* ═══ ÖĞRENCİ MODU — Aktif plan yürütülüyor ═══ */
                  <>
                    <div style={{padding:"8px 10px",borderRadius:9,marginBottom:8,
                      background:"linear-gradient(135deg,rgba(16,185,129,.1),rgba(16,185,129,.04))",
                      border:"1.5px solid rgba(16,185,129,.3)"}}>
                      <div style={{fontSize:9,fontWeight:800,color:"#065f46",textTransform:"uppercase",
                        letterSpacing:1,marginBottom:2}}>
                        {tx("activePlan")}
                      </div>
                      <div style={{fontSize:13,fontWeight:800,color:P.text}}>{activePlan.name}</div>
                      <div style={{fontSize:9,color:"rgba(6,78,59,.7)",marginTop:3}}>
                        {tx("progress")}: {Object.keys(planProgress).length}/{activePlan.items.length}
                      </div>
                      <div style={{marginTop:4,height:5,borderRadius:3,background:"rgba(16,185,129,.15)",overflow:"hidden"}}>
                        <div style={{width:`${(Object.keys(planProgress).length/Math.max(1,activePlan.items.length))*100}%`,
                          height:"100%",background:"linear-gradient(90deg,#10b981,#059669)",transition:"width .3s"}}/>
                      </div>
                    </div>

                    {/* Plan adımları */}
                    <div style={{fontSize:9,fontWeight:800,color:P.accentD,textTransform:"uppercase",
                      letterSpacing:1,marginBottom:4}}>
                      {lang==="ku"?"Gavên Planê":lang==="en"?"Plan Steps":"Plan Adımları"}
                    </div>
                    <div style={{marginBottom:8}}>
                      {activePlan.items.map((it,idx)=>{
                        const done=!!planProgress[it.key];
                        const current=idx===planStep;
                        const c=["#f59e0b","#6366f1","#10b981"][it.level];
                        return (
                          <div key={it.key} style={{padding:"6px 8px",marginBottom:3,
                            background:current?c+"15":done?"rgba(16,185,129,.06)":"#fff",
                            borderRadius:7,border:"1.5px solid",
                            borderColor:current?c:done?"rgba(16,185,129,.3)":"rgba(99,102,241,.15)",
                            display:"flex",alignItems:"center",gap:5,
                            opacity:done&&!current?0.7:1}}>
                            <span style={{fontSize:10,fontWeight:800,color:done?"#059669":current?c:"rgba(30,27,75,.4)",width:16}}>
                              {done?"✓":idx+1+"."}
                            </span>
                            <span style={{fontSize:12}}>{it.icon}</span>
                            <span style={{fontSize:10,fontWeight:current?800:600,color:P.text,flex:1}}>
                              {it.label}
                            </span>
                            <span style={{fontSize:9,color:"rgba(30,27,75,.5)"}}>
                              {it.duration}{tx("duration")}
                            </span>
                            {current&&!done&&(
                              <button onClick={()=>{
                                  setPlanProgress(p=>({...p,[it.key]:{
                                    completed:true,completedAt:Date.now(),
                                    score:it.kind==="seq"?25:10,
                                  }}));
                                  if(idx<activePlan.items.length-1) setPlanStep(idx+1);
                                }}
                                style={{padding:"3px 7px",borderRadius:5,border:"none",
                                  background:c,cursor:"pointer",fontSize:9,fontWeight:800,color:"#fff",fontFamily:"inherit"}}>
                                ✓
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Kontrol butonları */}
                    <div style={{display:"flex",flexDirection:"column",gap:4}}>
                      {Object.keys(planProgress).length===activePlan.items.length&&(
                        <div style={{padding:"8px",borderRadius:7,textAlign:"center",
                          background:"rgba(5,150,105,.1)",border:"1px solid rgba(5,150,105,.3)",
                          fontSize:11,fontWeight:800,color:"#065f46",marginBottom:4}}>
                          🎉 {lang==="ku"?"Plan qediya!":lang==="en"?"Plan completed!":"Plan tamamlandı!"}
                        </div>
                      )}
                      <button onClick={exportProgress}
                        style={{padding:"7px",borderRadius:7,border:"none",
                          background:"linear-gradient(135deg,#10b981,#059669)",
                          cursor:"pointer",fontSize:11,fontWeight:700,color:"#fff",fontFamily:"inherit"}}>
                        📊 {tx("exportProgress")}
                      </button>
                      <button onClick={stopStudentMode}
                        style={{padding:"6px",borderRadius:7,border:"1.5px solid rgba(239,68,68,.3)",
                          background:"rgba(239,68,68,.05)",
                          cursor:"pointer",fontSize:10,fontWeight:700,color:"#dc2626",fontFamily:"inherit"}}>
                        ✖ {tx("endPlan")}
                      </button>
                    </div>
                  </>
                )}
              </div>
            );
          })()}

          {sideTab==="set"&&(
            <div style={{flex:1,overflowY:"auto",padding:"10px 12px"}}>
              <div style={{fontSize:10,fontWeight:800,color:P.accentD,textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>
                {lang==="ku"?"Nîşandan":lang==="en"?"Display":"Görünüm"}
              </div>
              <Toggle on={showSides} onToggle={()=>{const v=!showSides;setShowSides(v);localStorage.setItem("dg_sides",v?"1":"0");}} label={t("showSidesLbl")}/>
              <Toggle on={showAngles} onToggle={()=>{const v=!showAngles;setShowAngles(v);localStorage.setItem("dg_angles",v?"1":"0");}} label={t("showAnglesLbl")}/>
              <Toggle on={colorBlind} onToggle={()=>{const v=!colorBlind;setColorBlind(v);localStorage.setItem("dg_cb",v?"1":"0");}} label={t("colorBlind")}/>
              <Toggle on={snapToGrid} onToggle={()=>setSnapToGrid(s=>!s)} label={lang==="ku"?"Karîkeya torê":lang==="en"?"Snap to grid":"Izgaraya yapıştır"}/>
              <Toggle on={dyscalcMode} onToggle={()=>{const v=!dyscalcMode;setDyscalcMode(v);localStorage.setItem("dg_dys",v?"1":"0");}}
                label={lang==="ku"?"Moda Diskalkulî (mezin, sade)":lang==="en"?"Dyscalculia Mode (large, simple)":"Diskalküli Modu (büyük, sade)"}/>
              <Toggle on={ttsOn} onToggle={()=>{const v=!ttsOn;setTtsOn(v);localStorage.setItem("dg_tts",v?"1":"0");if(!v)TTS.stop();}}
                label={lang==="ku"?"Xwendina Bi Deng (TTS)":lang==="en"?"Read Aloud (TTS)":"Sesli Anlatım (TTS)"}/>
              <div style={{height:12}}/>
              <div style={{fontSize:10,fontWeight:800,color:P.accentD,textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>
                {lang==="ku"?"Rengê xêzê":lang==="en"?"Pen Color":"Çizim Rengi"}
              </div>
              <div style={{display:"flex",gap:5,marginBottom:10}}>
                {["#6366f1","#ef4444","#10b981","#f59e0b","#0f172a"].map(c=>(
                  <button key={c} onClick={()=>setPenColor(c)} aria-label={c}
                    style={{width:22,height:22,borderRadius:"50%",background:c,border:"none",cursor:"pointer",
                      outline:penColor===c?"2.5px solid "+P.accent:"none",outlineOffset:2}}/>
                ))}
              </div>
              <div style={{fontSize:10,fontWeight:800,color:P.accentD,textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>
                {lang==="ku"?"Qalindahî":lang==="en"?"Pen Width":"Kalınlık"}
              </div>
              <div style={{display:"flex",gap:4}}>
                {[1.5,2.5,4,7].map(w=>(
                  <button key={w} onClick={()=>setPenWidth(w)}
                    style={{width:30,height:26,borderRadius:6,border:"1.5px solid",
                      borderColor:penWidth===w?P.accent:"rgba(99,102,241,.2)",
                      background:"rgba(255,255,255,.7)",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
                    <div style={{width:w+4,height:w,borderRadius:w,background:penColor}}/>
                  </button>
                ))}
              </div>
              <div style={{marginTop:12,padding:"8px",borderRadius:8,background:"rgba(99,102,241,.05)",
                fontSize:9,color:P.accentD,lineHeight:1.7}}>
                {t("kbShortcuts")}
              </div>
              <button onClick={()=>{setScore(0);localStorage.removeItem("dg_score");}}
                style={{marginTop:8,width:"100%",padding:"6px 0",borderRadius:7,border:"none",
                  background:"rgba(239,68,68,.08)",color:"#dc2626",cursor:"pointer",fontSize:10,fontWeight:700,fontFamily:"inherit"}}>
                {lang==="ku"?"Xalên sifir bike":lang==="en"?"Reset Score":"Puanı Sıfırla"}
              </button>
            </div>
          )}
        </nav>

        {/* KANVAS — tam beyaz, tek zemin */}
        <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",background:"#ffffff"}}>
          {/* Araç çubuğu */}
          <div style={{height:38,display:"flex",alignItems:"center",gap:3,
            padding:"0 10px",background:"#ffffff",borderBottom:"1px solid "+P.sideB}}>
            {[["select","🖱️",t("toolSelect")],["draw","✏️",t("toolDraw")],
              ["ruler","📏",t("toolRuler")],["protractor","📐",t("toolProtr")],
              ["angle","📏°",t("toolAngle")],
              ["symmetry","⟺",t("toolSymm")],["erase","🗑",t("toolErase")]].map(([id,ic,lbl])=>(
              <button key={id}
                onClick={()=>{setTool(id);if(id!=="stamp") setStampType(null);}}
                aria-pressed={tool===id} aria-label={lbl}
                style={{height:28,padding:"0 8px",borderRadius:7,
                  border:tool===id?"2px solid "+P.accent:"1.5px solid transparent",
                  background:tool===id?P.accentL:"transparent",
                  cursor:"pointer",fontSize:12,display:"flex",alignItems:"center",gap:4,fontFamily:"inherit",
                  color:tool===id?P.accentD:"rgba(30,27,75,.4)",fontWeight:tool===id?800:600}}>
                <span>{ic}</span><span style={{fontSize:10}}>{lbl}</span>
              </button>
            ))}
            <div style={{flex:1}}/>
            {/* FIX11: Cetvel sonucu birim ile */}
            {rdist!==null&&(
              <div style={{fontSize:11,fontWeight:700,color:P.measB,padding:"3px 8px",borderRadius:6,
                background:"rgba(239,68,68,.08)",display:"flex",gap:4,alignItems:"center"}}>
                📏 {rdist} {t("unit")}
              </div>
            )}
            {symmPts.length>0&&(
              <button onClick={()=>setSymmPts([])}
                style={{fontSize:10,fontWeight:700,color:"#7c3aed",padding:"3px 8px",
                  borderRadius:6,background:"rgba(124,58,237,.08)",border:"none",cursor:"pointer",fontFamily:"inherit"}}>
                ✕ {lang==="ku"?"Eksenê jê bibe":lang==="en"?"Clear axis":"Ekseni Sil"}
              </button>
            )}
            <button onClick={()=>dispatch({type:"UNDO"})} disabled={!state.history.length}
              aria-label="Geri al" title="Geri Al (⌘Z)"
              style={{width:28,height:28,borderRadius:7,border:"none",background:"transparent",
                cursor:state.history.length?"pointer":"default",fontSize:13,
                color:state.history.length?P.accentD:"#ddd"}}>↩</button>
            <button onClick={()=>dispatch({type:"UNDO_STROKE"})} disabled={!strokes.length}
              aria-label="Çizimi geri al" title="Çizimi Geri Al"
              style={{width:28,height:28,borderRadius:7,border:"none",background:"transparent",
                cursor:strokes.length?"pointer":"default",fontSize:12,
                color:strokes.length?"#7c3aed":"#ddd"}}>↩✏</button>
            {/* ℹ Özellikler paneli açma/kapama — sadece şekil seçili iken */}
            {selItem&&(
              <button onClick={()=>setShowProps(s=>!s)}
                aria-pressed={showProps} aria-label="Özellikler"
                title={lang==="ku"?"Taybetmendî":lang==="en"?"Properties":"Özellikler"}
                style={{height:28,padding:"0 8px",borderRadius:7,border:"1.5px solid "+(showProps?P.accent:"transparent"),
                  background:showProps?"rgba(99,102,241,.15)":"rgba(99,102,241,.06)",
                  cursor:"pointer",fontSize:11,
                  color:P.accentD,fontWeight:700,display:"flex",alignItems:"center",gap:3}}>
                ℹ {lang==="ku"?"Taybetmendî":lang==="en"?"Info":"Özellikler"}
              </button>
            )}
            {/* Tessellasyon: seçili şekli döşe */}
            {selItem&&(
              <button
                onClick={()=>{
                  const it=selItem;
                  const cols=5,rows=4,gap=it.size*1.05;
                  for(let r=0;r<rows;r++) for(let c=0;c<cols;c++){
                    if(r===0&&c===0) continue; // orijinal zaten var
                    dispatch({type:"ADD",t:it.type,
                      x:it.x+c*gap, y:it.y+r*gap, s:it.size, snap:false});
                  }
                }}
                title={lang==="ku"?"Tessellasyon bike":lang==="en"?"Tessellate":"Tessellasyon"}
                style={{height:28,padding:"0 8px",borderRadius:7,border:"1.5px solid transparent",
                  background:"rgba(139,92,246,.08)",cursor:"pointer",fontSize:11,
                  color:"#7c3aed",fontWeight:700,display:"flex",alignItems:"center",gap:3}}>
                ⧉ {lang==="ku"?"Doşe":lang==="en"?"Tile":"Döşe"}
              </button>
            )}
            <button onClick={()=>dispatch({type:"CLEAR"})}
              aria-label="Temizle"
              style={{width:28,height:28,borderRadius:7,border:"none",
                background:items.length||strokes.length?"rgba(239,68,68,.1)":"transparent",
                cursor:items.length||strokes.length?"pointer":"default",fontSize:14,
                color:items.length||strokes.length?"#dc2626":"#ddd"}}>🗑</button>
          </div>

          {/* SVG — viewBox 1200×800 = şekillerin ekranın %10-15'i kadarı görünmesi için */}
          <div ref={mainRef} style={{flex:1,position:"relative",overflow:"hidden",background:"#ffffff",
            cursor:tool==="stamp"?"crosshair":tool==="draw"?"crosshair":tool==="erase"?"cell":"default"}}>
            <svg ref={svgRef} width="100%" height="100%"
              viewBox={`0 0 ${900/zoom} ${600/zoom}`}
              preserveAspectRatio="xMidYMid meet"
              style={{touchAction:"none",display:"block"}}
              onPointerDown={onSvgDown} onPointerMove={onSvgMove}
              onPointerUp={onSvgUp} onPointerLeave={e=>{setMousePos(null);onSvgUp();}}
              onDragOver={e=>e.preventDefault()}
              onDrop={e=>{
                e.preventDefault();
                const type=e.dataTransfer.getData("shape");
                if(!type||!SHAPE_DEF[type]) return;
                const {x,y}=svgXY(e);
                dispatch({type:"ADD",t:type,x,y,s:180,snap:snapToGrid});
                /* Sürükle-bırak tek seferlik: drop sonrası seçili aracı kaldır */
                setStampType(null);
                setTool("select");
              }}>
              <rect x={0} y={0} width={900/zoom} height={600/zoom} fill="#ffffff"
                onPointerDown={e=>{
                  if(canvasMode==="geoboard") return; // geoboard modunda arka plan seçimi yok
                  if(tool!=="stamp"&&tool!=="draw"&&tool!=="ruler"&&tool!=="protractor"&&tool!=="angle"&&tool!=="symmetry")dispatch({type:"DESELECT"});
                }}/>
              {/* Serbest modda arka plan grid — Geoboard modunda gizle */}
              {canvasMode!=="geoboard"&&<BgGrid bgType={bgType} zoom={zoom}/>}

              {/* ═══ GEOBOARD MODU ═══
                  Ana kanvasta büyük geoboard — çiviler, şekiller, kauçuk bant.
                  Kanvas 900×600, geoboard merkezde 480×480 alana oturur. */}
              {canvasMode==="geoboard"&&(()=>{
                /* Geoboard kanvasın tümünü kaplasın — yükseklik sınırlayıcı (600),
                   üstte başlık için ~50px pay bırak → 540×540 */
                const boardSize=540;
                const boardX=(900-boardSize)/2; // 180
                const boardY=55; // başlığa yer aç
                const pegSpacing=boardSize/(GS-1);
                const pegX=(c)=>boardX+c*pegSpacing;
                const pegY=(r)=>boardY+r*pegSpacing;
                return (
                  <g>
                    {/* Tahta arka planı — ahşap dokusu hissi için soft sarı */}
                    <rect x={boardX-15} y={boardY-15}
                      width={boardSize+30} height={boardSize+30}
                      rx={12} ry={12}
                      fill="#fef3c7" stroke="#f59e0b" strokeWidth={2} opacity={0.6}/>
                    {/* Grid çizgileri (yardımcı, silik) */}
                    {Array.from({length:GS},(_,i)=>(
                      <g key={`grid-${i}`} opacity={0.15}>
                        <line x1={pegX(i)} y1={pegY(0)} x2={pegX(i)} y2={pegY(GS-1)}
                          stroke="#92400e" strokeWidth={0.8}/>
                        <line x1={pegX(0)} y1={pegY(i)} x2={pegX(GS-1)} y2={pegY(i)}
                          stroke="#92400e" strokeWidth={0.8}/>
                      </g>
                    ))}
                    {/* Tamamlanmış şekiller — seçili olan vurgulanır */}
                    {geoShapes.map((sh,si)=>{
                      const ptsStr=sh.pts.map(p=>`${pegX(p.c)},${pegY(p.r)}`).join(" ");
                      /* Eğer kullanıcı listeden bir şekil seçtiyse vurgula; yoksa hepsi normal */
                      const isSel = selectedGeoShapeIdx===si;
                      return (
                        <polygon key={si} points={ptsStr}
                          fill={sh.color+(isSel?"60":"40")}
                          stroke={sh.color}
                          strokeWidth={isSel?6:4}
                          strokeLinejoin="round"
                          style={{cursor:"pointer",
                            filter:isSel?`drop-shadow(0 0 6px ${sh.color})`:"none"}}
                          onPointerDown={e=>{
                            e.stopPropagation();
                            /* Şekle tıklayınca sidebar'da seçili yap */
                            setSelectedGeoShapeIdx(isSel?null:si);
                          }}/>
                      );
                    })}
                    {/* Aktif çizim — henüz kapanmamış */}
                    {geoLines.map((ln,i)=>(
                      <line key={i}
                        x1={pegX(ln.from.c)} y1={pegY(ln.from.r)}
                        x2={pegX(ln.to.c)} y2={pegY(ln.to.r)}
                        stroke={geoColor} strokeWidth={4.5} strokeLinecap="round"/>
                    ))}
                    {/* Kauçuk bant: başlangıçtan hover noktasına önizleme */}
                    {geoStart&&geoHoverPt&&(
                      <line x1={pegX(geoStart.c)} y1={pegY(geoStart.r)}
                        x2={pegX(geoHoverPt.c)} y2={pegY(geoHoverPt.r)}
                        stroke={geoColor} strokeWidth={3} strokeDasharray="8,5" opacity={0.55}/>
                    )}
                    {/* Çiviler — boyut grid aralığına göre */}
                    {Array.from({length:GS},(_,r)=>Array.from({length:GS},(_,c)=>{
                      const isStart=geoStart&&geoStart.r===r&&geoStart.c===c;
                      const canClose=geoLines.length>=2&&geoLines[0].from.r===r&&geoLines[0].from.c===c;
                      /* Görünür boyut: grid aralığına orantılı ama makul sınırlarda */
                      const baseR=Math.max(6, Math.min(12, pegSpacing*0.1));
                      const visR=isStart?baseR*1.5:canClose?baseR*1.3:baseR;
                      const hitR=Math.max(18, pegSpacing*0.4);
                      return (
                        <g key={`peg-${r}-${c}`}
                          onMouseEnter={()=>setGeoHoverPt({r,c})}
                          onMouseLeave={()=>setGeoHoverPt(null)}
                          onPointerDown={e=>{
                            e.stopPropagation();
                            if(!geoStart){
                              setGeoStart({r,c});
                              setGeoLines([]);
                            } else if(geoStart.r===r&&geoStart.c===c){
                              setGeoStart(null);
                            } else if(canClose){
                              const pts=[geoLines[0].from,...geoLines.map(l=>l.to)];
                              setGeoShapes(s=>[...s,{pts,color:geoColor}]);
                              setGeoLines([]);
                              setGeoStart(null);
                            } else {
                              setGeoLines(ls=>[...ls,{from:geoStart,to:{r,c}}]);
                              setGeoStart({r,c});
                            }
                          }}
                          style={{cursor:"pointer"}}>
                          {/* Büyük görünmez tıklama alanı */}
                          <circle cx={pegX(c)} cy={pegY(r)} r={hitR}
                            fill="transparent"/>
                          {/* Görünen çivi */}
                          <circle cx={pegX(c)} cy={pegY(r)} r={visR}
                            fill={isStart?geoColor:canClose?"#10b981":"#92400e"}
                            opacity={isStart?1:canClose?0.95:0.85}
                            stroke={canClose?"#065f46":"#78350f"}
                            strokeWidth={canClose?2:1.5}/>
                          {/* Çivi başlığı — küçük ışık */}
                          <circle cx={pegX(c)-visR/3} cy={pegY(r)-visR/3} r={visR/3.5}
                            fill="#fff" opacity={0.45}/>
                        </g>
                      );
                    }))}
                    {/* Başlık */}
                    <text x={450} y={35} textAnchor="middle"
                      style={{fontSize:20,fontWeight:800,fill:"#92400e",
                        fontFamily:"system-ui",letterSpacing:.5}}>
                      📌 {lang==="ku"?"Textê Geometrîk":lang==="en"?"Geoboard":"Geometri Tahtası"}
                      <tspan style={{fontSize:14,fontWeight:600,fill:"rgba(146,64,14,.6)"}}>
                        {" "}({GS}×{GS})
                      </tspan>
                    </text>
                  </g>
                );
              })()}
              {/* ═══ TANGRAM MODU ═══
                  Ana kanvasta büyük silüet + öğrenci parçaları üstüne yerleştirir.
                  Parçalar items içinde, sürüklenebilir/döndürülebilir. */}
              {canvasMode==="tangram"&&tanMode==="sil"&&(()=>{
                /* Silüet path'i 0-80 aralığında tanımlı, merkezlemek için 40,40 offset.
                   Kanvasta büyük göstermek için ölçek 5 (400x400) ve ortalayarak (900-400)/2=250 */
                const scale=5;
                const silW=80*scale; // 400
                const silX=(900-silW)/2; // 250
                const silY=50;
                return (
                  <g style={{pointerEvents:"none"}}>
                    {/* Başlık */}
                    <text x={450} y={35} textAnchor="middle"
                      style={{fontSize:20,fontWeight:800,fill:"#7c3aed",
                        fontFamily:"system-ui",letterSpacing:.5}}>
                      🧩 {lang==="ku"?"Tangram":lang==="en"?"Tangram":"Tangram"} — {lang==="ku"?TAN_PUZZLES[tanPuzzle].nameKu:lang==="en"?TAN_PUZZLES[tanPuzzle].nameEn:TAN_PUZZLES[tanPuzzle].name}
                    </text>
                    {/* Silüet hedefi — büyük, morumsu, yarı-saydam */}
                    <g transform={`translate(${silX},${silY}) scale(${scale})`}>
                      <path d={TAN_PUZZLES[tanPuzzle].path}
                        fill="#7c3aed"
                        fillOpacity={tanShowGhost?0.22:0.12}
                        stroke="#7c3aed"
                        strokeOpacity={0.7}
                        strokeWidth={1.2}
                        strokeLinejoin="round"
                        strokeDasharray={tanShowGhost?"":"2,1.5"}/>
                    </g>
                    {/* Alt metin — parçaları buraya yerleştir */}
                    {(()=>{
                      const onCanvas=items.filter(it=>
                        TAN_PIECES.some(pc=>pc.type===it.type&&Math.abs((it.s||0)-pc.size)<5)
                      ).length;
                      return (
                        <text x={450} y={580} textAnchor="middle"
                          style={{fontSize:12,fontWeight:600,fill:"rgba(124,58,237,.55)",
                            fontFamily:"system-ui",fontStyle:"italic"}}>
                          {onCanvas===0
                            ?(lang==="ku"?"↑ Perçeyan ji panela çepê hilbijêre":lang==="en"?"↑ Select pieces from left panel":"↑ Parçaları sol panelden seç")
                            :(lang==="ku"?`${onCanvas} perçe li kanvasê`:lang==="en"?`${onCanvas} pieces on canvas`:`${onCanvas} parça kanvasta`)}
                        </text>
                      );
                    })()}
                  </g>
                );
              })()}

              {/* ═══ 3B MODU ═══
                  Ana kanvasta büyük 3B cisim veya açınım. */}
              {canvasMode==="3d"&&(()=>{
                const faceColor="#0891b2";
                const toneMap={
                  top:     faceColor+"55",
                  front:   faceColor+"30",
                  right:   faceColor+"45",
                  back:    faceColor+"20",
                  left:    faceColor+"38",
                  bottom:  faceColor+"25",
                  base:    faceColor+"25",
                  slant_left:  faceColor+"38",
                  slant_right: faceColor+"45",
                };
                return (
                  <g>
                    {/* Başlık */}
                    <text x={450} y={40} textAnchor="middle"
                      style={{fontSize:20,fontWeight:800,fill:"#0e7490",
                        fontFamily:"system-ui",letterSpacing:.5,pointerEvents:"none"}}>
                      🧊 {lang==="ku"?"Serbest Sê-Boyî":lang==="en"?"Free 3D":"Serbest 3B"}
                      <tspan style={{fontSize:13,fontWeight:600,fill:"rgba(14,116,144,.6)"}}>
                        {" "}({solids3D.length} {lang==="ku"?"cisim":lang==="en"?"solids":"cisim"})
                      </tspan>
                    </text>

                    {/* Boş durum */}
                    {solids3D.length===0&&(
                      <text x={450} y={300} textAnchor="middle"
                        style={{fontSize:15,fontWeight:600,fill:"rgba(14,116,144,.4)",
                          fontFamily:"system-ui",pointerEvents:"none",fontStyle:"italic"}}>
                        {lang==="ku"
                          ?"👉 Ji panela rastê cisimekê lê zêde bike"
                          :lang==="en"
                          ?"👉 Add a solid from the right panel"
                          :"👉 Sağ panelden bir cisim ekle"}
                      </text>
                    )}

                    {/* Tüm 3B cisimleri render et */}
                    {solids3D.map(sol=>{
                      const def=SHAPE_3D[sol.type];
                      if(!def) return null;
                      const isSel=sol.id===selected3DId;
                      const cx=sol.x, cy=sol.y, ss=sol.size;
                      const customColor=sol.color||faceColor;
                      /* Renk tonları cismin kendi rengine göre */
                      const localToneMap={};
                      Object.entries(toneMap).forEach(([k,v])=>{
                        /* v zaten faceColor+hex, değiştir: customColor+hex */
                        const suffix=v.slice(-2);
                        localToneMap[k]=customColor+suffix;
                      });
                      return (
                        <g key={sol.id}
                          onPointerDown={e=>on3DShapeDown(e,sol.id)}
                          style={{cursor:"move"}}>
                          {/* Seçim glow */}
                          {isSel&&(
                            <circle cx={cx} cy={cy} r={ss*0.7}
                              fill={customColor} opacity={0.08}/>
                          )}
                          {sol.unfolded?(
                            /* Açınım: 2B düz */
                            (()=>{
                              const netFaces=def.net(cx,cy,ss);
                              return netFaces.map((face,i)=>{
                                /* Eğri yüz: daire */
                                if(face.isCircle){
                                  return (
                                    <g key={i}>
                                      <circle cx={face.cx} cy={face.cy} r={face.r}
                                        fill={customColor+"35"}
                                        stroke={customColor}
                                        strokeWidth={isSel?3.5:2.5}/>
                                      <text x={face.cx} y={face.cy} textAnchor="middle" dominantBaseline="central"
                                        style={{fontSize:14,fontWeight:800,fill:customColor,
                                          fontFamily:"system-ui",pointerEvents:"none"}}>
                                        {i+1}
                                      </text>
                                    </g>
                                  );
                                }
                                /* Eğri yüz: dilim (koninin yan yüzü) */
                                if(face.isSlice){
                                  const {sliceCx,sliceCy,slant,theta}=face;
                                  const p1x=sliceCx+slant*Math.sin(-theta/2);
                                  const p1y=sliceCy+slant*Math.cos(-theta/2);
                                  const p2x=sliceCx+slant*Math.sin( theta/2);
                                  const p2y=sliceCy+slant*Math.cos( theta/2);
                                  const largeArc=theta>Math.PI?1:0;
                                  const pathD=`M ${sliceCx} ${sliceCy} L ${p1x} ${p1y} A ${slant} ${slant} 0 ${largeArc} 0 ${p2x} ${p2y} Z`;
                                  return (
                                    <g key={i}>
                                      <path d={pathD}
                                        fill={customColor+"35"}
                                        stroke={customColor}
                                        strokeWidth={isSel?3.5:2.5}
                                        strokeLinejoin="round"/>
                                      <text x={sliceCx} y={sliceCy+slant*0.55} textAnchor="middle"
                                        style={{fontSize:14,fontWeight:800,fill:customColor,
                                          fontFamily:"system-ui",pointerEvents:"none"}}>
                                        {i+1}
                                      </text>
                                    </g>
                                  );
                                }
                                /* Normal çokgen yüz */
                                const pts=face.pts.map(p=>p.join(",")).join(" ");
                                const mx=face.pts.reduce((s,p)=>s+p[0],0)/face.pts.length;
                                const my=face.pts.reduce((s,p)=>s+p[1],0)/face.pts.length;
                                return (
                                  <g key={i}>
                                    <polygon points={pts}
                                      fill={customColor+"35"}
                                      stroke={customColor}
                                      strokeWidth={isSel?3.5:2.5}
                                      strokeLinejoin="round"/>
                                    <text x={mx} y={my} textAnchor="middle" dominantBaseline="central"
                                      style={{fontSize:14,fontWeight:800,fill:customColor,
                                        fontFamily:"system-ui",pointerEvents:"none"}}>
                                      {i+1}
                                    </text>
                                  </g>
                                );
                              });
                            })()
                          ):(
                            /* İzometrik 3B — yaw parametresi ile döndürülür */
                            (()=>{
                              const iso=def.iso(cx,cy,ss,sol.yaw);
                              /* Eğri cisimler (silindir, koni) özel render */
                              if(iso.isCurved){
                                if(iso.isCone){
                                  /* Koni: tabanda ellips, apex'e iki çizgi */
                                  const [bcx,bcy]=iso.botCenter;
                                  const [apx,apy]=iso.apex;
                                  return (
                                    <g key="cone">
                                      {/* Arka yarı ellips (görünmez, kesik çizgili) */}
                                      <ellipse cx={bcx} cy={bcy} rx={iso.rx} ry={iso.ry}
                                        fill={customColor+"30"}
                                        stroke={customColor}
                                        strokeWidth={isSel?3.5:2.5}/>
                                      {/* Yan yüzey — iki çizgi apex'e */}
                                      <line x1={bcx-iso.rx} y1={bcy} x2={apx} y2={apy}
                                        stroke={customColor} strokeWidth={isSel?3.5:2.5}/>
                                      <line x1={bcx+iso.rx} y1={bcy} x2={apx} y2={apy}
                                        stroke={customColor} strokeWidth={isSel?3.5:2.5}/>
                                    </g>
                                  );
                                }
                                /* Silindir */
                                const [tcx,tcy]=iso.topCenter;
                                const [bcx,bcy]=iso.botCenter;
                                return (
                                  <g key="cyl">
                                    {/* Alt ellips (taban) */}
                                    <ellipse cx={bcx} cy={bcy} rx={iso.rx} ry={iso.ry}
                                      fill={customColor+"45"}
                                      stroke={customColor}
                                      strokeWidth={isSel?3.5:2.5}/>
                                    {/* Yan yüzey — dikdörtgen görünümlü (sol ve sağ kenar) */}
                                    <path d={`M ${bcx-iso.rx} ${bcy} L ${tcx-iso.rx} ${tcy} L ${tcx+iso.rx} ${tcy} L ${bcx+iso.rx} ${bcy}`}
                                      fill={customColor+"35"}
                                      stroke={customColor}
                                      strokeWidth={isSel?3.5:2.5}
                                      strokeLinejoin="round"/>
                                    {/* Üst ellips */}
                                    <ellipse cx={tcx} cy={tcy} rx={iso.rx} ry={iso.ry}
                                      fill={customColor+"55"}
                                      stroke={customColor}
                                      strokeWidth={isSel?3.5:2.5}/>
                                  </g>
                                );
                              }
                              /* Çokgen yüzeyli cisimler: küp, prizma, piramit */
                              return Object.entries(iso).map(([name,pts])=>{
                                if(!Array.isArray(pts)) return null;
                                const ptsStr=pts.map(p=>p.join(",")).join(" ");
                                return (
                                  <polygon key={name} points={ptsStr}
                                    fill={localToneMap[name]||customColor+"40"}
                                    stroke={customColor}
                                    strokeWidth={isSel?3.5:2.5}
                                    strokeLinejoin="round"/>
                                );
                              });
                            })()
                          )}
                          {/* Seçili iken tutamaçlar */}
                          {isSel&&!sol.unfolded&&(
                            <g>
                              {/* Yaw döndürme tutamacı (üstte, yatay sürükle) */}
                              <g
                                onPointerDown={e=>on3DYawStart(e,sol.id)}
                                style={{cursor:"ew-resize"}}>
                                <line x1={cx-40} y1={cy-ss*0.7} x2={cx+40} y2={cy-ss*0.7}
                                  stroke={customColor} strokeWidth={2} opacity={0.5}/>
                                <circle cx={cx} cy={cy-ss*0.7} r={10}
                                  fill="#fff" stroke={customColor} strokeWidth={2.5}/>
                                <text x={cx} y={cy-ss*0.7} textAnchor="middle" dominantBaseline="central"
                                  style={{fontSize:13,fontWeight:800,fill:customColor,
                                    fontFamily:"system-ui",pointerEvents:"none"}}>
                                  ↻
                                </text>
                              </g>
                              {/* Etiket: cisim adı */}
                              <text x={cx} y={cy+ss*0.7} textAnchor="middle"
                                style={{fontSize:11,fontWeight:700,fill:customColor,
                                  fontFamily:"system-ui",pointerEvents:"none"}}>
                                {lang==="ku"?def.labelKu:lang==="en"?def.labelEn:def.label}
                              </text>
                            </g>
                          )}
                        </g>
                      );
                    })}
                  </g>
                );
              })()}

              {/* Eski tangram hayaleti (serbest modda sidebar toggle) — artık sadece serbest modda */}
              {tanShowGhost&&canvasMode==="free"&&sideTab==="tan"&&tanMode==="sil"&&(
                <g opacity={0.28} style={{pointerEvents:"none"}}>
                  {/* Silüet yolunu kanvasta merkeze, büyük ölçekle yerleştir */}
                  <g transform="translate(330, 180) scale(3)">
                    <path d={TAN_PUZZLES[tanPuzzle].path}
                      fill="#7c3aed" stroke="#7c3aed" strokeWidth={1.5}
                      strokeLinejoin="round"/>
                  </g>
                  {/* Yön oku — "parçaları buraya yerleştir" */}
                  <text x={450} y={165} textAnchor="middle"
                    style={{fontSize:14/zoom,fontWeight:800,fill:"#7c3aed",
                      fontFamily:"system-ui",letterSpacing:.5}}>
                    {lang==="ku"?"↓ Perçeyan li vir bine":lang==="en"?"↓ Place pieces here":"↓ Parçaları buraya yerleştir"}
                  </text>
                </g>
              )}
              {/* Simetri ekseni */}
              {symmPts.length===2&&(
                <line x1={symmPts[0].x} y1={symmPts[0].y}
                  x2={symmPts[1].x} y2={symmPts[1].y}
                  stroke="#7c3aed" strokeWidth={2/zoom} strokeDasharray={`${8/zoom},${4/zoom}`} strokeLinecap="round"/>
              )}
              {symmPts.length===1&&(
                <circle cx={symmPts[0].x} cy={symmPts[0].y} r={5/zoom} fill="#7c3aed" opacity={0.6}/>
              )}
              {/* Çizimler — geoboard/3B modunda gizle (tangramda parçalar lazım) */}
              {canvasMode!=="geoboard"&&canvasMode!=="3d"&&strokes.map((sk,i)=>(
                <polyline key={i} points={sk.pts.map(p=>`${p.x},${p.y}`).join(" ")}
                  fill="none" stroke={sk.color} strokeWidth={sk.width/zoom}
                  strokeLinecap="round" strokeLinejoin="round"/>
              ))}
              {canvasMode!=="geoboard"&&canvasMode!=="3d"&&<polyline id="tmp" fill="none" stroke={penColor}
                strokeWidth={penWidth/zoom} strokeLinecap="round" strokeLinejoin="round"/>}
              {/* Şekiller — geoboard/3B modunda gizle (tangramda parçalar gerekli) */}
              {canvasMode!=="geoboard"&&canvasMode!=="3d"&&items.map(item=>(
                <ShapeEl key={item.id} item={item}
                  selected={item.id===selectedId}
                  showSides={showSides} showAngles={showAngles}
                  zoom={zoom} colorBlind={colorBlind}
                  onPointerDown={e=>onShapeDown(e,item.id)}
                  onRotateStart={onRotateStart}
                  onResizeStart={onResizeStart}
                  onEdgeResizeStart={onEdgeResizeStart}/>
              ))}
              {/* Cetvel */}
              {rulerPts.map((pt,i)=>(
                <circle key={i} cx={pt.x} cy={pt.y} r={6/zoom}
                  fill="#ef4444" stroke="#fff" strokeWidth={1.5/zoom}/>
              ))}
              {rulerPts.length===2&&(
                <>
                  <line x1={rulerPts[0].x} y1={rulerPts[0].y}
                    x2={rulerPts[1].x} y2={rulerPts[1].y}
                    stroke="#ef4444" strokeWidth={1.5/zoom} strokeDasharray={`${6/zoom},${3/zoom}`}/>
                  <text x={(rulerPts[0].x+rulerPts[1].x)/2} y={(rulerPts[0].y+rulerPts[1].y)/2-10/zoom}
                    textAnchor="middle" paintOrder="stroke"
                    style={{fontSize:12/zoom,fontWeight:800,fill:"#ef4444",fontFamily:"system-ui"}}
                    stroke="#fff" strokeWidth={3/zoom}>
                    {rdist} {t("unit")}
                  </text>
                </>
              )}
              {/* Açı Ölçer — 3 nokta tıklanınca iki vektör arası açı atan2 ile hesaplanır.
                  [0]=köşe, [1]=ilk kenar, [2]=ikinci kenar. */}
              {anglePts.length>0&&(()=>{
                const v=anglePts[0];
                const dotR=5/zoom, sw=2/zoom;
                /* Tek nokta: sadece köşeyi göster */
                if(anglePts.length===1){
                  return (
                    <g onClick={()=>setAnglePts([])} style={{cursor:"pointer"}}>
                      <circle cx={v.x} cy={v.y} r={dotR} fill="#059669"/>
                      <circle cx={v.x} cy={v.y} r={dotR*2.2} fill="none" stroke="#059669" strokeWidth={sw} opacity={0.4}/>
                      <text x={v.x+10/zoom} y={v.y-10/zoom} style={{fontSize:10/zoom,fill:"#065f46",fontWeight:700,fontFamily:"system-ui"}}>
                        {lang==="ku"?"Goşe":lang==="en"?"Vertex":"Köşe"}
                      </text>
                    </g>
                  );
                }
                /* İki nokta: köşe + bir kenar */
                if(anglePts.length===2){
                  const p1=anglePts[1];
                  return (
                    <g onClick={()=>setAnglePts([])} style={{cursor:"pointer"}}>
                      <line x1={v.x} y1={v.y} x2={p1.x} y2={p1.y} stroke="#059669" strokeWidth={sw} strokeLinecap="round"/>
                      <circle cx={v.x} cy={v.y} r={dotR} fill="#059669"/>
                      <circle cx={p1.x} cy={p1.y} r={dotR*0.8} fill="#059669" opacity={0.7}/>
                      <text x={v.x+10/zoom} y={v.y-10/zoom} style={{fontSize:10/zoom,fill:"#065f46",fontWeight:700,fontFamily:"system-ui"}}>
                        {lang==="ku"?"Kêleka 2...":lang==="en"?"Side 2...":"Kenar 2..."}
                      </text>
                    </g>
                  );
                }
                /* Üç nokta: açı hesapla */
                const p1=anglePts[1], p2=anglePts[2];
                const a1=Math.atan2(p1.y-v.y, p1.x-v.x);
                const a2=Math.atan2(p2.y-v.y, p2.x-v.x);
                /* Pozitif fark, 0-180° aralığında (iç açı) */
                let diff=Math.abs(a2-a1)*180/Math.PI;
                if(diff>180) diff=360-diff;
                const deg=Math.round(diff);
                /* Arc çizimi: iki ışın arasındaki açıyı göster */
                const arcR=Math.min(
                  Math.hypot(p1.x-v.x, p1.y-v.y),
                  Math.hypot(p2.x-v.x, p2.y-v.y)
                )*0.35;
                /* SVG arc için: large-arc=0 (küçük yay), sweep yönü belirle */
                let startAng=a1, endAng=a2;
                /* Normalize: her zaman kısa yayı çiz */
                let dAng=endAng-startAng;
                if(dAng>Math.PI) dAng-=2*Math.PI;
                if(dAng<-Math.PI) dAng+=2*Math.PI;
                const sweep=dAng>0?1:0;
                const arcStart={x:v.x+arcR*Math.cos(a1), y:v.y+arcR*Math.sin(a1)};
                const arcEnd={x:v.x+arcR*Math.cos(a2), y:v.y+arcR*Math.sin(a2)};
                /* Etiket konumu: açının tam ortasında, köşeden biraz uzakta */
                const midAng=a1+dAng/2;
                const labelR=arcR+24/zoom;
                const labelPos={x:v.x+labelR*Math.cos(midAng), y:v.y+labelR*Math.sin(midAng)};
                /* Dik açı göstergesi: 90°±1 ise küçük kare çiz */
                const isRight=Math.abs(deg-90)<=1;
                return (
                  <g onClick={()=>setAnglePts([])} style={{cursor:"pointer"}}>
                    {/* İki kenar (ışın) */}
                    <line x1={v.x} y1={v.y} x2={p1.x} y2={p1.y}
                      stroke="#059669" strokeWidth={sw} strokeLinecap="round"/>
                    <line x1={v.x} y1={v.y} x2={p2.x} y2={p2.y}
                      stroke="#059669" strokeWidth={sw} strokeLinecap="round"/>
                    {/* Açı yayı */}
                    {isRight
                      ?(() => {
                         /* Dik açı: küçük kare göstergesi — geometrik konvansiyon */
                         const sq=arcR*0.7;
                         const u1={x:Math.cos(a1), y:Math.sin(a1)};
                         const u2={x:Math.cos(a2), y:Math.sin(a2)};
                         return (
                           <polyline points={[
                             `${v.x+sq*u1.x},${v.y+sq*u1.y}`,
                             `${v.x+sq*(u1.x+u2.x)},${v.y+sq*(u1.y+u2.y)}`,
                             `${v.x+sq*u2.x},${v.y+sq*u2.y}`,
                           ].join(" ")}
                           fill="rgba(5,150,105,.1)" stroke="#059669" strokeWidth={sw*0.9}/>
                         );
                       })()
                      :<path d={`M ${arcStart.x} ${arcStart.y} A ${arcR} ${arcR} 0 0 ${sweep} ${arcEnd.x} ${arcEnd.y}`}
                          fill="rgba(5,150,105,.12)" stroke="#059669" strokeWidth={sw*0.9}/>
                    }
                    {/* Noktalar */}
                    <circle cx={v.x} cy={v.y} r={dotR} fill="#059669"/>
                    <circle cx={p1.x} cy={p1.y} r={dotR*0.8} fill="#059669" opacity={0.7}/>
                    <circle cx={p2.x} cy={p2.y} r={dotR*0.8} fill="#059669" opacity={0.7}/>
                    {/* Derece etiketi */}
                    <g transform={`translate(${labelPos.x},${labelPos.y})`}>
                      <rect x={-18/zoom} y={-10/zoom} width={36/zoom} height={20/zoom}
                        rx={4/zoom} fill="#fff" stroke="#059669" strokeWidth={sw}/>
                      <text x={0} y={0} textAnchor="middle" dominantBaseline="central"
                        style={{fontSize:12/zoom,fontWeight:800,fill:"#065f46",fontFamily:"system-ui"}}>
                        {deg}°
                      </text>
                    </g>
                  </g>
                );
              })()}

              {/* İletki */}
              {protrPos&&(()=>{
                const R=65/zoom;
                return (
                  <g transform={`translate(${protrPos.x},${protrPos.y})`}
                    style={{cursor:"pointer"}} onClick={()=>setProtrPos(null)}>
                    <path d={`M ${-R} 0 A ${R} ${R} 0 0 1 ${R} 0`}
                      fill="rgba(239,68,68,.07)" stroke="#ef4444" strokeWidth={1.5/zoom}/>
                    <line x1={-R} y1={0} x2={R} y2={0} stroke="#ef4444" strokeWidth={1.2/zoom}/>
                    {Array.from({length:19},(_,i)=>{
                      const a=i*10*Math.PI/180;
                      return (
                        <g key={i}>
                          <line x1={R*Math.cos(a)} y1={-R*Math.sin(a)}
                            x2={R*1.06*Math.cos(a)} y2={-R*1.06*Math.sin(a)}
                            stroke="#ef4444" strokeWidth={0.7/zoom}/>
                          {i%3===0&&<text x={R*1.18*Math.cos(a)} y={-R*1.18*Math.sin(a)}
                            textAnchor="middle" dominantBaseline="middle"
                            style={{fontSize:7/zoom,fill:"#ef4444",fontFamily:"system-ui"}}>{i*10}</text>}
                        </g>
                      );
                    })}
                    <circle cx={0} cy={0} r={4/zoom} fill="#ef4444"/>
                  </g>
                );
              })()}
              {/* FIX7: Stamp hayaleti */}
              {tool==="stamp"&&stampType&&mousePos&&(()=>{
                const def=SHAPE_DEF[stampType]; if(!def) return null;
                const cat=CAT_META[def.cat];
                return (
                  <g opacity={0.45} style={{pointerEvents:"none"}}>
                    {(stampType==="circle"||stampType==="disk")
                      ?<circle cx={mousePos.x} cy={mousePos.y} r={def.r(180)}
                          fill={stampType==="circle"?"none":cat.color+"22"}
                          stroke={cat.color} strokeWidth={(stampType==="circle"?2:1.5)/zoom}
                          strokeDasharray={`${5/zoom},${3/zoom}`}/>
                      :<polygon points={toPoints(def.verts(mousePos.x, mousePos.y, 180))} fill={cat.color+"22"} stroke={cat.color} strokeWidth={1.5/zoom} strokeDasharray={`${5/zoom},${3/zoom}`}/>}
                  </g>
                );
              })()}
              {/* Boş kanvas ipucu — sadece serbest modda */}
              {canvasMode==="free"&&items.length===0&&strokes.length===0&&(
                <text x={900/zoom/2} y={600/zoom/2} textAnchor="middle"
                  style={{fontSize:14/zoom,fill:"rgba(99,102,241,.2)",fontFamily:"system-ui",fontWeight:700}}>
                  {lang==="ku"?"Ji panela çepê teşeyê hilbijêre → bitikîne":lang==="en"?"Select a shape on the left → click to place":"Sol panelden şekil seç → kanvasa tıkla"}
                </text>
              )}
            </svg>

            {/* Özellikler paneli — artık sadece ℹ butonuyla açılır */}
            {selItem&&showProps&&(
              <div style={{position:"absolute",top:8,right:8,width:196,zIndex:5,
                background:"rgba(255,255,255,.97)",backdropFilter:"blur(16px)",
                borderRadius:14,border:"1.5px solid rgba(99,102,241,.12)",
                boxShadow:"0 6px 28px rgba(99,102,241,.14)",animation:"slideDown .2s"}}>
                <div style={{padding:"7px 12px",borderBottom:"1px solid rgba(99,102,241,.07)",
                  display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                  <span style={{fontSize:10,fontWeight:800,color:P.accentD,textTransform:"uppercase",letterSpacing:.5}}>
                    {t("propTitle")}
                  </span>
                  <button onClick={()=>setShowProps(false)} aria-label="Kapat"
                    style={{background:"none",border:"none",cursor:"pointer",fontSize:14,color:"#ccc"}}>×</button>
                </div>
                <PropsPanel item={selItem} lang={lang} dispatch={dispatch}/>
              </div>
            )}

            {/* Araç ipucu */}
            {(tool==="ruler"||tool==="protractor"||tool==="symmetry"||tool==="angle")&&(
              <div style={{position:"absolute",bottom:8,left:"50%",transform:"translateX(-50%)",
                padding:"5px 14px",borderRadius:9,background:"rgba(30,27,75,.8)",
                color:"#fff",fontSize:11,fontWeight:700,zIndex:5,pointerEvents:"none",
                animation:"slideDown .2s"}}>
                {tool==="ruler"?t("rulerHint"):tool==="protractor"?t("protrHint"):tool==="angle"?t("angleHint"):t("symmHint")}
              </div>
            )}

            {/* ═══ SİLME ALANI ═══
                DokunSay'ın "Silme Alanı"na paralel. Şekil sürüklenirken belirir;
                üzerine bırakılınca silme gerçekleşir. Diskalküli motor koordinasyonu için
                büyük hedef alan (h=60, WCAG 2.5.5 AAA). */}
            {isDragging&&(
              <div
                style={{position:"absolute",bottom:0,left:0,right:0,height:64,
                  background:deleteHover
                    ?"linear-gradient(0deg,rgba(220,38,38,.22),rgba(220,38,38,.08))"
                    :"linear-gradient(0deg,rgba(220,38,38,.1),rgba(220,38,38,.02))",
                  borderTop:deleteHover?"3px solid #dc2626":"2px dashed rgba(220,38,38,.4)",
                  display:"flex",alignItems:"center",justifyContent:"center",gap:10,
                  zIndex:10,transition:"all .15s",pointerEvents:"none"}}
                role="region" aria-label={lang==="ku"?"Herêma jêbirinê":lang==="en"?"Delete zone":"Silme Alanı"}>
                <span style={{fontSize:deleteHover?26:22,transition:"all .15s"}}>🗑️</span>
                <span style={{fontSize:deleteHover?14:12,fontWeight:800,
                  color:deleteHover?"#991b1b":"#dc2626",transition:"all .15s"}}>
                  {deleteHover
                    ?(lang==="ku"?"Berde û jê bibe":lang==="en"?"Release to delete":"Bırak → Sil")
                    :(lang==="ku"?"Ji bo jêbirinê vir biberde":lang==="en"?"Drop here to delete":"Silmek için buraya bırak")}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ALT BAR */}
      <div style={{height:44,minHeight:44,background:"linear-gradient(180deg,#f5f4ff,#eeebff)",
        borderTop:"1px solid "+P.sideB,display:"flex",alignItems:"center",padding:"0 10px",gap:4}}>
        <div style={{display:"flex",gap:1,background:"rgba(255,255,255,.6)",borderRadius:7,padding:2}}>
          {[["▫","plain","Düz"],["▦","grid","Kareli"],["⋯","dot","Noktalı"]].map(([ic,tp,lbl])=>(
            <button key={tp} onClick={()=>setBgType(tp)} aria-pressed={bgType===tp} aria-label={lbl}
              style={{width:26,height:26,borderRadius:5,border:"none",
                background:bgType===tp?P.accent:"transparent",cursor:"pointer",fontSize:11,
                color:bgType===tp?"#fff":"#aaa"}}>
              {ic}
            </button>
          ))}
        </div>
        <div style={{width:1,height:18,background:P.sideB}}/>
        <div style={{display:"flex",gap:1,alignItems:"center",background:"rgba(255,255,255,.6)",borderRadius:7,padding:"2px 4px"}}>
          <button onClick={()=>setZoom(z=>Math.max(.3,+(z-.1).toFixed(1)))} aria-label={t("zoomOut")||"Uzaklaştır"}
            style={{width:22,height:22,border:"none",background:"transparent",cursor:"pointer",fontSize:13,fontWeight:900,color:"#888"}}>−</button>
          <span style={{fontSize:10,fontWeight:700,color:P.accentD,minWidth:32,textAlign:"center"}}>{Math.round(zoom*100)}%</span>
          <button onClick={()=>setZoom(z=>Math.min(3,+(z+.1).toFixed(1)))} aria-label={t("zoomIn")||"Yakınlaştır"}
            style={{width:22,height:22,border:"none",background:"transparent",cursor:"pointer",fontSize:13,fontWeight:900,color:"#888"}}>+</button>
        </div>
        <button onClick={toggleFs} aria-label={isFullscreen?"Tam ekrandan çık":"Tam ekran"}
          style={{width:28,height:28,borderRadius:7,border:"none",cursor:"pointer",fontSize:13,
            background:isFullscreen?P.accentL:"rgba(255,255,255,.6)",
            color:isFullscreen?P.accentD:"#888",display:"flex",alignItems:"center",justifyContent:"center"}}>
          {isFullscreen?"⊡":"⊞"}
        </button>
        <div style={{flex:1}}/>
        <div style={{display:"flex",gap:3}}>
          {[0,1,2].map(lv=>{
            const c=["#f59e0b","#6366f1","#10b981"][lv];
            const lbls={tr:["Görsel","Analiz","Soyutlama"],ku:["Dîtin","Analîz","Ramandin"],en:["Visual","Analysis","Abstraction"]};
            return (
              <button key={lv} onClick={()=>{setVhLevel(lv);setSideTab("act");}}
                aria-pressed={vhLevel===lv}
                style={{padding:"3px 8px",borderRadius:6,border:"none",cursor:"pointer",fontFamily:"inherit",
                  background:vhLevel===lv?c+"22":"rgba(255,255,255,.5)",
                  color:vhLevel===lv?c:"rgba(30,27,75,.4)",fontSize:10,fontWeight:vhLevel===lv?800:600,
                  display:"flex",alignItems:"center",gap:4}}>
                <VHBadge level={lv}/><span>{lbls[lang]?.[lv]||lbls.tr[lv]}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
