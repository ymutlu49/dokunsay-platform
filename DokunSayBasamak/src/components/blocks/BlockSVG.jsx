import { BLOCK_UNIT_PX, HUNDRED_SIDE_PX } from '../../constants/dimensions';
import { PALETTE } from '../../constants/palette';

const U = BLOCK_UNIT_PX;
const W = HUNDRED_SIDE_PX;

export default function BlockSVG({ type, size, showVal, colorBlind }) {
  const s = size || 1;
  const fillRef = colorBlind ? `url(#pat-${type})` : undefined;

  if (type === "ones") {
    const fill = fillRef || "url(#g1)";
    return (
      <svg width={U*s} height={U*s} viewBox={`0 0 ${U} ${U}`} role="img" aria-label="Birlik küp: 1">
        <defs>
          <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fef08a"/>
            <stop offset="100%" stopColor={PALETTE.ones}/>
          </linearGradient>
        </defs>
        <rect x={.5} y={.5} width={U-1} height={U-1} rx={2} fill={fill} stroke={PALETTE.onesB} strokeWidth={1}/>
        {showVal && <text x={U/2} y={U/2+1} textAnchor="middle" dominantBaseline="middle" fontSize={7} fontWeight={900} fill="#7a3d00">1</text>}
      </svg>
    );
  }

  if (type === "tens") {
    const fill = fillRef || "url(#g10)";
    return (
      <svg width={U*s} height={W*s} viewBox={`0 0 ${U} ${W}`} role="img" aria-label="Onluk çubuk: 10">
        <defs>
          <linearGradient id="g10" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#fdba74"/>
            <stop offset="100%" stopColor={PALETTE.tens}/>
          </linearGradient>
        </defs>
        <rect x={.5} y={.5} width={U-1} height={W-1} rx={2} fill={fill} stroke={PALETTE.tensB} strokeWidth={1}/>
        {Array.from({length:9},(_,i)=>(
          <line key={i} x1={1} y1={U*(i+1)} x2={U-1} y2={U*(i+1)} stroke="rgba(255,255,255,.35)" strokeWidth={.7}/>
        ))}
        {showVal && <text x={U/2} y={W/2} textAnchor="middle" dominantBaseline="middle" fontSize={9} fontWeight={900} fill="#fff" transform={`rotate(-90,${U/2},${W/2})`}>10</text>}
      </svg>
    );
  }

  if (type === "huns") {
    const fill = fillRef || "url(#g100)";
    return (
      <svg width={W*s} height={W*s} viewBox={`0 0 ${W} ${W}`} role="img" aria-label="Yüzlük kare: 100">
        <defs>
          <linearGradient id="g100" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#93c5fd"/>
            <stop offset="100%" stopColor={PALETTE.huns}/>
          </linearGradient>
        </defs>
        <rect x={.5} y={.5} width={W-1} height={W-1} rx={3} fill={fill} stroke={PALETTE.hunsB} strokeWidth={1.5}/>
        {Array.from({length:9},(_,i)=>(
          <g key={i}>
            <line x1={1} y1={U*(i+1)} x2={W-1} y2={U*(i+1)} stroke="rgba(255,255,255,.2)" strokeWidth={.5}/>
            <line x1={U*(i+1)} y1={1} x2={U*(i+1)} y2={W-1} stroke="rgba(255,255,255,.2)" strokeWidth={.5}/>
          </g>
        ))}
        {showVal && <text x={W/2} y={W/2} textAnchor="middle" dominantBaseline="middle" fontSize={16} fontWeight={900} fill="rgba(255,255,255,.6)">100</text>}
      </svg>
    );
  }

  if (type === "ths") {
    const D = 20;
    const fill = fillRef || PALETTE.ths;
    return (
      <svg width={(W+D)*s} height={(W+D)*s} viewBox={`0 0 ${W+D} ${W+D}`} role="img" aria-label="Binlik küp: 1000">
        <polygon points={`${W},${D} ${W+D},0 ${W+D},${W} ${W},${W+D}`} fill="#6d28d9" stroke="#5b21b6" strokeWidth={1}/>
        <polygon points={`0,${D} ${D},0 ${W+D},0 ${W},${D}`} fill="#a78bfa" stroke="#7c3aed" strokeWidth={1}/>
        <rect x={0} y={D} width={W} height={W} rx={2} fill={fill} stroke={PALETTE.thsB} strokeWidth={1.5}/>
        {Array.from({length:9},(_,i)=>(
          <g key={i}>
            <line x1={1} y1={D+U*(i+1)} x2={W-1} y2={D+U*(i+1)} stroke="rgba(255,255,255,.12)" strokeWidth={.3}/>
            <line x1={U*(i+1)} y1={D+1} x2={U*(i+1)} y2={D+W-1} stroke="rgba(255,255,255,.12)" strokeWidth={.3}/>
          </g>
        ))}
        {showVal && <text x={W/2} y={D+W/2} textAnchor="middle" dominantBaseline="middle" fontSize={16} fontWeight={900} fill="rgba(255,255,255,.5)">1000</text>}
      </svg>
    );
  }

  return null;
}
