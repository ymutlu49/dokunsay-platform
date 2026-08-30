import { useState } from 'react';
import { SHAPE_DEF } from '../../constants/shapes2d.js';
import { LANGS } from '../../constants/i18n.js';
import { P } from '../../constants/palette.js';
import { VHBadge } from '../Common/VHBadge.jsx';
import { SpeakButton } from '../Common/SpeakButton.jsx';
import { pickLabel, pickText } from '../../utils/label.js';
import { DiffBadge } from '../Common/DiffBadge.jsx';

// FIX4: ActivityCard — dile göre q/hint/opts
export function ActivityCard({act,lang,onCorrect,ariaRef,ttsOn}){
  const L=LANGS[lang]||LANGS.tr;
  const [sel,setSel]=useState(act.multi?[]:null);
  const [num,setNum]=useState(act.answer!==undefined?(act.answer>90?90:act.min||0):0);
  const [fb,setFb]=useState(null);
  const [showHint,setShowHint]=useState(false);
  const lvlColor=["#f59e0b","#6366f1","#10b981"][act.level];

  const qText=pickText(act.q,lang);
  const hintText=pickText(act.hint,lang);
  const optsArr=Array.isArray(act.opts)?act.opts:(act.opts&&typeof act.opts==="object"?act.opts[lang]||act.opts.tr:[]);
  const misText=act.mis?pickText(act.mis,lang):null;
  const isShape=(key)=>!!SHAPE_DEF[key];

  function getLabel(opt){
    if(isShape(opt)){const d=SHAPE_DEF[opt];return pickLabel(d,lang);}
    return opt;
  }

  function check(){
    let ok=false;
    if(act.answer!==undefined){
      ok=num===act.answer;
    } else if(act.multi){
      ok=[...act.correct].sort().join(",")===([...sel]).sort().join(",");
    } else if(typeof act.correct==="number"){
      ok=sel===act.correct||(Array.isArray(optsArr)&&optsArr[sel]===optsArr[act.correct]);
    } else {
      ok=sel===act.correct;
    }
    setFb(ok?"ok":"no");
    if(ariaRef&&ariaRef.current) ariaRef.current.textContent=ok?L.correct:L.wrong;
    if(ok) setTimeout(()=>{onCorrect&&onCorrect();},700);
  }

  return (
    <div style={{background:"#fff",borderRadius:12,overflow:"hidden",
      border:"1.5px solid rgba(99,102,241,.08)",boxShadow:"0 2px 10px rgba(99,102,241,.06)"}}>
      <div style={{background:`linear-gradient(135deg,${lvlColor}12,${lvlColor}06)`,
        padding:"8px 12px",borderBottom:"1px solid "+lvlColor+"20",
        display:"flex",alignItems:"center",gap:7}}>
        <VHBadge level={act.level}/>
        <span style={{fontSize:14}}>{act.icon}</span>
        <span style={{fontSize:11,fontWeight:800,color:P.text}}>
          {pickText(act.label,lang)}
        </span>
        {/* CRA rozeti — diskalküli araştırması (Apostolidou 2025, TouchMath):
            L0: Concrete (somut), L1: Representational (temsili), L2: Abstract */}
        {(()=>{
          const CRA_COLORS=["#ea580c","#7c3aed","#059669"];
          const CRA_LETTERS=["C","R","A"];
          const CRA_LABELS={
            tr:["Somut","Temsili","Soyut"],
            ku:["Somet","Temsîl","Fikrî"],
            en:["Concrete","Representational","Abstract"],
            ar:["محسوس","تمثيلي","مجرّد"],
            fa:["عینی","نیمه‌عینی","انتزاعی"],
          };
          return (
            <span title={(CRA_LABELS[lang]||CRA_LABELS.tr)[act.level]+" — CRA"}
              style={{fontSize:9,fontWeight:900,padding:"1px 5px",borderRadius:4,
                background:CRA_COLORS[act.level]+"22",color:CRA_COLORS[act.level],
                border:"1px solid "+CRA_COLORS[act.level]+"44"}}>
              {CRA_LETTERS[act.level]}
            </span>
          );
        })()}
        {act.phase&&(
          <span style={{marginLeft:"auto",fontSize:9,fontWeight:800,padding:"1px 5px",
            borderRadius:4,background:"rgba(99,102,241,.12)",color:P.accentD}}>
            {act.phase}
          </span>
        )}
      </div>

      {/* ── Zorluk basamağı (STANDARDS §1.6) ── */}
      <div style={{padding:"6px 12px 0",display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
        <DiffBadge diff={act.diff} lang={lang}/>
      </div>

      {/* ── Kavram yanılgısı şeridi (STANDARDS §1.5) — literatür atıflı ── */}
      {misText&&(
        <div data-testid="mis-strip"
          style={{margin:"6px 12px 0",padding:"6px 8px",borderRadius:7,
            background:"rgba(220,38,38,.06)",borderLeft:"2.5px solid #dc2626",
            fontSize:10,color:"#7f1d1d",lineHeight:1.5}}>
          <span style={{fontWeight:800}}>⚠ {L.misTitle}: </span>{misText}
          {act.src&&(
            <span style={{display:"block",marginTop:3,fontSize:8,fontStyle:"italic",opacity:.8}}>
              📖 {L.misSrc}: {act.src}
            </span>
          )}
        </div>
      )}
      <div style={{padding:"9px 11px",fontSize:12,fontWeight:700,color:P.text,lineHeight:1.5,
        display:"flex",alignItems:"flex-start",gap:7}}>
        <span style={{flex:1}}>{qText}</span>
        <SpeakButton text={qText} lang={lang} ttsOn={ttsOn}
          title={pickText({tr:"Soruyu oku",ku:"Pirsê bixwîne",en:"Read question",ar:"اقرأ السؤال",fa:"سؤال را بخوان"},lang)}/>
      </div>
      <div style={{padding:"0 11px 9px"}}>
        {act.answer!==undefined?(
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <button onClick={()=>setNum(n=>Math.max(0,n-1))}
              style={{width:28,height:28,borderRadius:7,border:"1.5px solid rgba(99,102,241,.2)",
                background:"transparent",cursor:"pointer",fontSize:14,fontWeight:900,color:P.accentD}}>−</button>
            <span style={{fontSize:26,fontWeight:900,color:P.accentD,minWidth:40,textAlign:"center"}}>{num}</span>
            <button onClick={()=>setNum(n=>n+1)}
              style={{width:28,height:28,borderRadius:7,border:"1.5px solid rgba(99,102,241,.2)",
                background:"transparent",cursor:"pointer",fontSize:14,fontWeight:900,color:P.accentD}}>+</button>
          </div>
        ):(
          <div style={{display:"flex",flexDirection:"column",gap:3}}>
            {optsArr.map((opt,idx)=>{
              const key=typeof opt==="string"?opt:idx;
              const selVal=typeof act.correct==="number"?idx:opt;
              const isSel=act.multi?(Array.isArray(sel)&&sel.includes(selVal)):(sel===selVal);
              return (
                <button key={key}
                  onClick={()=>{
                    act.multi?setSel(s=>Array.isArray(s)?(s.includes(selVal)?s.filter(x=>x!==selVal):[...s,selVal]):[selVal])
                             :setSel(selVal);
                    setFb(null);
                  }}
                  style={{padding:"6px 9px",borderRadius:7,border:"1.5px solid",
                    borderColor:isSel?P.accent:"rgba(99,102,241,.15)",
                    background:isSel?P.accentL:"rgba(255,255,255,.6)",
                    cursor:"pointer",fontSize:11,fontWeight:700,color:isSel?P.accentD:P.text,
                    textAlign:"left",display:"flex",alignItems:"center",gap:5,transition:"all .1s"}}>
                  {isShape(opt)&&<span>{SHAPE_DEF[opt].icon}</span>}
                  {getLabel(opt)}
                  {isSel&&<span style={{marginLeft:"auto"}}>✓</span>}
                </button>
              );
            })}
          </div>
        )}
      </div>
      {showHint&&<div style={{margin:"0 11px 7px",padding:"6px 9px",borderRadius:7,
        background:"rgba(245,158,11,.1)",border:"1px solid rgba(245,158,11,.3)",
        fontSize:11,color:"#92400e",lineHeight:1.5,display:"flex",alignItems:"flex-start",gap:6}}>
        <span style={{flex:1}}>💡 {hintText}</span>
        <SpeakButton text={hintText} lang={lang} ttsOn={ttsOn} size={12}
          title={pickText({tr:"İpucunu oku",ku:"Şîretê bixwîne",en:"Read hint",ar:"اقرأ التلميح",fa:"راهنما را بخوان"},lang)}/>
      </div>}
      {fb&&<div role="status" style={{margin:"0 11px 7px",padding:"6px 9px",borderRadius:7,textAlign:"center",
        background:fb==="ok"?"rgba(5,150,105,.1)":"rgba(239,68,68,.1)",
        border:"1px solid "+(fb==="ok"?"rgba(5,150,105,.3)":"rgba(239,68,68,.3)"),
        fontSize:12,fontWeight:800,color:fb==="ok"?"#065f46":"#dc2626"}}>
        {fb==="ok"?L.correct:L.wrong}
      </div>}
      <div style={{padding:"0 11px 11px",display:"flex",gap:5}}>
        <button onClick={()=>setShowHint(s=>!s)}
          style={{flex:1,padding:"7px 0",borderRadius:8,border:"1.5px solid rgba(245,158,11,.4)",
            background:"rgba(245,158,11,.08)",cursor:"pointer",fontSize:11,fontWeight:700,color:"#92400e",fontFamily:"inherit"}}>
          💡 {L.hint}
        </button>
        <button onClick={check}
          style={{flex:2,padding:"7px 0",borderRadius:8,border:"none",
            background:`linear-gradient(135deg,${P.accent},${P.accentD})`,
            cursor:"pointer",fontSize:12,fontWeight:800,color:"#fff",fontFamily:"inherit"}}>
          {L.check}
        </button>
      </div>
    </div>
  );
}
