import { TTS } from '../../lib/tts.js';

/* ═══ SpeakButton ═══
   Tekrar kullanılabilir "🔊" butonu. Herhangi bir metni sesli okur.
   Diskalküli araştırması (Apostolidou 2025): işitsel destek bilişsel yükü azaltır. */
export function SpeakButton({text,lang,ttsOn,size=14,title}){
  if(!ttsOn||!TTS.isAvailable()||!text) return null;
  return (
    <button
      onClick={e=>{e.stopPropagation();TTS.speak(text,lang);}}
      aria-label={title||"Sesli oku"}
      title={title||"Sesli oku"}
      style={{width:size+10,height:size+10,borderRadius:size/2+5,border:"none",
        background:"rgba(99,102,241,.1)",cursor:"pointer",fontSize:size-2,
        color:"#6366f1",fontFamily:"inherit",display:"inline-flex",
        alignItems:"center",justifyContent:"center",padding:0,flexShrink:0,
        transition:"background .15s"}}
      onMouseEnter={e=>e.currentTarget.style.background="rgba(99,102,241,.2)"}
      onMouseLeave={e=>e.currentTarget.style.background="rgba(99,102,241,.1)"}>
      🔊
    </button>
  );
}
