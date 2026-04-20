import { PALETTE } from '../../constants/palette';
import BlockPatternDefs from '../blocks/BlockPatternDefs';

export default function NumberLine({ value, maxVal }) {
  const max = Math.max(maxVal, 10, Math.ceil((value + 5) / 10) * 10);
  const W_LINE = 520;
  const H_LINE = 60;
  const pad = 30;
  const usable = W_LINE - pad * 2;
  const toX = (v) => pad + (v / max) * usable;
  const markerX = Math.min(toX(value), W_LINE - 4);
  const ticks = [];
  const step = max <= 20 ? 1 : max <= 100 ? 10 : max <= 500 ? 50 : 100;
  for (let v = 0; v <= max; v += step) {
    const x = toX(v);
    const isMajor = v % (step * 5) === 0 || step === 1;
    ticks.push({ v, x, isMajor });
  }
  return (
    <svg width="100%" height={H_LINE} viewBox={`0 0 ${W_LINE} ${H_LINE}`}
      role="img" aria-label={`Sayı doğrusu, mevcut değer ${value}`}
      style={{ display: "block" }}>
      <BlockPatternDefs/>
      <line x1={pad} y1={30} x2={W_LINE-pad} y2={30} stroke="#d4c8b0" strokeWidth={2.5} strokeLinecap="round"/>
      <polygon points={`${W_LINE-pad+2},30 ${W_LINE-pad-6},26 ${W_LINE-pad-6},34`} fill="#d4c8b0"/>
      {ticks.map(({ v, x, isMajor }) => (
        <g key={v}>
          <line x1={x} y1={isMajor ? 22 : 27} x2={x} y2={33} stroke="#b5a990" strokeWidth={isMajor ? 1.5 : 0.8}/>
          {isMajor && <text x={x} y={44} textAnchor="middle" fontSize={9} fontWeight={700} fill="#b5a990">{v}</text>}
        </g>
      ))}
      {value > 0 && (
        <g>
          <line x1={markerX} y1={14} x2={markerX} y2={32} stroke={PALETTE.accent} strokeWidth={2.5}/>
          <circle cx={markerX} cy={14} r={9} fill={PALETTE.accent} stroke="#fff" strokeWidth={1.5}/>
          <text x={markerX} y={18} textAnchor="middle" fontSize={value >= 100 ? 7 : 9} fontWeight={900} fill="#fff">{value}</text>
        </g>
      )}
    </svg>
  );
}
