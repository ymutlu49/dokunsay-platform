import { useState } from 'react';
import { LANGS } from '../../constants/i18n.js';
import { P } from '../../constants/palette.js';
import { VHBadge } from '../Common/VHBadge.jsx';

// ══════════════════════════════════════════════════════════════
// PhaseSequenceCard — Crowley (1987) 5-faz döngüsü
// Kaynak: The van Hiele Model of Development, NCTM 1987 Yearbook
// Her konu (kare, eşkenar dörtgen, dik açı) için sıralı 5-faz:
// I (Bilgi/Keşfetme) → DO (Yönlendirilmiş) → E (Açıklama) → FO (Serbest) → IN (Entegrasyon)
// ══════════════════════════════════════════════════════════════
export function PhaseSequenceCard({seq,lang,onComplete}){
  const L=LANGS[lang]||LANGS.tr;
  const [phaseIdx,setPhaseIdx]=useState(0);
  const [studentAnswer,setStudentAnswer]=useState("");
  const [completed,setCompleted]=useState([]);
  const phase=seq.phases[phaseIdx];
  const lvlColor=["#f59e0b","#6366f1","#10b981"][seq.level];
  const PHASE_META={
    I:{tr:"1. Bilgi",ku:"1. Agahî",en:"1. Information",color:"#ea580c",
       desc:{tr:"Öğretmen ve öğrenci konu üzerine konuşur, sorular sorar, kelime dağarcığı kurulur.",
             ku:"Mamoste û xwendekar li ser mijarê dipeyivin, pirs dikin, ferhenga destpêkê tê damezrandin.",
             en:"Teacher and student discuss the topic; questions arise; vocabulary is built."}},
    DO:{tr:"2. Yönlendirilmiş Keşif",ku:"2. Arastina Rênivîsandî",en:"2. Directed Orientation",color:"#0891b2",
        desc:{tr:"Öğretmenin dikkatlice sıralanmış görevlerle yapıyı keşfet.",
              ku:"Bi erkên bi baldarî rêzkirî ve avahiya mijarê bibîne.",
              en:"Carefully sequenced tasks reveal the structures of the topic."}},
    E:{tr:"3. Açıklama",ku:"3. Ravekirin",en:"3. Explication",color:"#7c3aed",
       desc:{tr:"Kendi sözlerinle anlat — öğretmen en az konuşur.",
             ku:"Bi peyvên xwe bêje — mamoste kêm dipeyive.",
             en:"Express what you've observed in your own words."}},
    FO:{tr:"4. Serbest Keşif",ku:"4. Arastina Azad",en:"4. Free Orientation",color:"#059669",
        desc:{tr:"Açık uçlu, çok adımlı görevle kendi yolunu bul.",
              ku:"Bi erka bi gelek gavên vekirî ve rêya xwe bibîne.",
              en:"Open-ended, multi-step task; find your own path."}},
    IN:{tr:"5. Entegrasyon",ku:"5. Entegrasyon",en:"5. Integration",color:"#be185d",
        desc:{tr:"Öğrendiklerini özetle ve ilişkilendir.",
              ku:"Fêrbûyîn kurt bike û bi hev ve girê bide.",
              en:"Summarize and interconnect what you've learned."}},
  };
  const meta=PHASE_META[phase.p];
  function advance(){
    const next=completed.includes(phaseIdx)?completed:[...completed,phaseIdx];
    setCompleted(next);
    setStudentAnswer("");
    if(phaseIdx<seq.phases.length-1){
      setPhaseIdx(i=>i+1);
    } else {
      onComplete&&onComplete();
    }
  }
  const topic=typeof seq.topic==="object"?seq.topic[lang]||seq.topic.tr:seq.topic;
  const qText=typeof phase.q==="object"?phase.q[lang]||phase.q.tr:phase.q;
  const taskText=typeof phase.task==="object"?phase.task[lang]||phase.task.tr:phase.task;
  const phaseDesc=typeof meta.desc==="object"?meta.desc[lang]||meta.desc.tr:meta.desc;

  return (
    <div style={{background:"#fff",borderRadius:12,overflow:"hidden",
      border:"1.5px solid "+meta.color+"40",boxShadow:"0 2px 12px rgba(0,0,0,.04)"}}>
      {/* Başlık */}
      <div style={{background:`linear-gradient(135deg,${lvlColor}10,${meta.color}08)`,
        padding:"8px 12px",borderBottom:"1px solid "+meta.color+"25"}}>
        <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:4}}>
          <VHBadge level={seq.level}/>
          <span style={{fontSize:14}}>{seq.icon}</span>
          <span style={{fontSize:12,fontWeight:900,color:P.text}}>{topic}</span>
          <span style={{marginLeft:"auto",fontSize:9,color:"rgba(30,27,75,.5)",fontWeight:700}}>
            {phaseIdx+1}/{seq.phases.length}
          </span>
        </div>
        {/* Faz göstergesi */}
        <div style={{display:"flex",gap:2,marginBottom:4}}>
          {seq.phases.map((ph,i)=>{
            const m=PHASE_META[ph.p];
            const done=completed.includes(i);
            const cur=i===phaseIdx;
            return (
              <button key={i} onClick={()=>setPhaseIdx(i)}
                style={{flex:1,height:6,borderRadius:3,border:"none",cursor:"pointer",
                  background:cur?m.color:done?m.color+"66":m.color+"20",
                  transition:"all .2s"}}
                title={typeof m.tr==="string"?m.tr:"Faz "+(i+1)}/>
            );
          })}
        </div>
      </div>
      {/* Faz ismi ve açıklama */}
      <div style={{padding:"8px 12px",background:meta.color+"08",borderBottom:"1px solid "+meta.color+"15"}}>
        <div style={{fontSize:10,fontWeight:800,color:meta.color,textTransform:"uppercase",letterSpacing:.5}}>
          {typeof meta.tr==="string"?(lang==="ku"?meta.ku:lang==="en"?meta.en:meta.tr):meta.tr}
        </div>
        <div style={{fontSize:10,color:"rgba(30,27,75,.55)",lineHeight:1.4,marginTop:2}}>
          {phaseDesc}
        </div>
      </div>
      {/* Soru */}
      <div style={{padding:"10px 12px"}}>
        <div style={{fontSize:12,fontWeight:700,color:P.text,lineHeight:1.45,marginBottom:6}}>
          ❓ {qText}
        </div>
        {/* Görev */}
        <div style={{padding:"7px 9px",borderRadius:8,background:"rgba(99,102,241,.06)",
          borderLeft:"2.5px solid "+P.accent,fontSize:11,color:P.accentD,lineHeight:1.5,marginBottom:8}}>
          🎯 {taskText}
        </div>
        {/* "E" fazı için öğrenci cevabı alanı */}
        {phase.p==="E"&&(
          <div style={{marginBottom:8}}>
            <textarea value={studentAnswer} onChange={e=>setStudentAnswer(e.target.value)}
              placeholder={lang==="ku"?"Bi peyvên xwe binivîse...":lang==="en"?"Write in your own words...":"Kendi sözlerinle yaz..."}
              rows={2}
              style={{width:"100%",padding:"6px 8px",borderRadius:7,
                border:"1.5px solid rgba(124,58,237,.25)",
                background:"rgba(124,58,237,.04)",resize:"vertical",
                fontSize:11,fontFamily:"inherit",color:P.text}}/>
          </div>
        )}
        {/* İlerleme butonu */}
        <button onClick={advance}
          disabled={phase.p==="E"&&studentAnswer.length<5}
          style={{width:"100%",padding:"8px 0",borderRadius:8,border:"none",
            background:phase.p==="E"&&studentAnswer.length<5
              ?"rgba(99,102,241,.15)"
              :`linear-gradient(135deg,${meta.color},${meta.color}dd)`,
            cursor:phase.p==="E"&&studentAnswer.length<5?"not-allowed":"pointer",
            fontSize:12,fontWeight:800,color:"#fff",fontFamily:"inherit",
            opacity:phase.p==="E"&&studentAnswer.length<5?0.5:1}}>
          {phaseIdx===seq.phases.length-1
            ?(lang==="ku"?"Biqedîne ✓":lang==="en"?"Complete ✓":"Tamamla ✓")
            :(lang==="ku"?"Gava pêş →":lang==="en"?"Next phase →":"Sonraki faz →")}
        </button>
      </div>
    </div>
  );
}
