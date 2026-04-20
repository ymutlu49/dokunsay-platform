// L0/L1/L2 seviye rozeti — 3 sabit renk.
export function VHBadge({level}){
  const colors=["#f59e0b","#6366f1","#10b981"];
  return (
    <span style={{display:"inline-flex",alignItems:"center",justifyContent:"center",
      width:22,height:22,borderRadius:6,fontSize:9,fontWeight:900,flexShrink:0,
      background:colors[level]+"22",color:colors[level],border:"1px solid "+colors[level]+"44"}}>
      L{level}
    </span>
  );
}
