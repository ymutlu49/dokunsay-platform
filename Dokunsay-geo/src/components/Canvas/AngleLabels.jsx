import { SHAPE_DEF } from '../../constants/shapes2d.js';
import { CAT_META } from '../../constants/palette.js';

// ── FIX3: Açı etiketleri ──
export function AngleLabels({item,zoom}){
  const def=SHAPE_DEF[item.type]; if(!def||!def.anglePos) return null;
  const cat=CAT_META[def.cat];
  const pts=def.anglePos(item.x,item.y,item.size);
  if(!pts||pts.length===0) return null;
  return (
    <g transform={`rotate(${item.rotation||0},${item.x},${item.y})`}>
      {pts.map((p,i)=>(
        <g key={i}>
          <circle cx={p.x} cy={p.y} r={10/zoom} fill="rgba(255,255,255,.85)" stroke={cat.color} strokeWidth={1/zoom}/>
          <text x={p.x} y={p.y} textAnchor="middle" dominantBaseline="middle"
            style={{fontSize:7/zoom,fontWeight:800,fill:cat.colorB,fontFamily:"system-ui",pointerEvents:"none"}}>
            {p.a}°
          </text>
        </g>
      ))}
    </g>
  );
}
