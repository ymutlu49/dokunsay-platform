import { P } from '../../constants/palette.js';

// ── FIX1: BgGrid App dışında sabit bileşen ──
export function BgGrid({bgType,zoom}){
  const W=4000,H=3000,step=40;
  if(bgType==="plain") return null;
  if(bgType==="dot") return (
    <g>{Array.from({length:Math.floor(W/step)},(_,ci)=>
      Array.from({length:Math.floor(H/step)},(_,ri)=>(
        <circle key={`${ci}_${ri}`} cx={ci*step} cy={ri*step} r={1.2} fill={P.grid}/>
      )))
    }</g>
  );
  return (
    <g>
      {Array.from({length:Math.floor(W/step)},(_,i)=>(
        <line key={"v"+i} x1={i*step} y1={0} x2={i*step} y2={H} stroke={P.grid} strokeWidth={0.7}/>
      ))}
      {Array.from({length:Math.floor(H/step)},(_,i)=>(
        <line key={"h"+i} x1={0} y1={i*step} x2={W} y2={i*step} stroke={P.grid} strokeWidth={0.7}/>
      ))}
    </g>
  );
}
