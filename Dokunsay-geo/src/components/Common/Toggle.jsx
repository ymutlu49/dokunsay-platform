import { P } from '../../constants/palette.js';

export function Toggle({on,onToggle,label}){
  return (
    <button role="switch" aria-checked={on} onClick={onToggle}
      style={{display:"flex",alignItems:"center",gap:8,width:"100%",padding:"5px 0",
        background:"transparent",border:"none",cursor:"pointer",textAlign:"left"}}>
      <div style={{width:28,height:16,borderRadius:8,position:"relative",flexShrink:0,
        background:on?P.accent:"rgba(99,102,241,.15)",transition:"background .2s"}}>
        <div style={{position:"absolute",top:2,left:on?12:2,width:12,height:12,borderRadius:6,
          background:"#fff",transition:"left .2s",boxShadow:"0 1px 3px rgba(0,0,0,.12)"}}/>
      </div>
      <span style={{fontSize:11,fontWeight:600,color:P.text}}>{label}</span>
    </button>
  );
}
