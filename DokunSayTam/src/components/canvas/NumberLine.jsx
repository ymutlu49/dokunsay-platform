import WalkingPerson from '../common/WalkingPerson';
import { THEME } from '../../constants/theme';

const NumberLine = ({ position, jumps, walkDirection, animateNumberLine, panelPos, startPanelDrag, resetPosition }) => (
  <div data-panel="nl" style={{
    position: 'absolute',
    left: panelPos ? panelPos.x : 20,
    top: panelPos ? panelPos.y : undefined,
    bottom: panelPos ? undefined : 20,
    right: panelPos ? undefined : 20,
    zIndex: 3,
    width: panelPos ? '70%' : undefined,
  }}>
    {/* Sürükleme tutamacı */}
    <div onPointerDown={(e) => startPanelDrag('nl', e)} style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
      padding: '3px 0', cursor: 'grab', userSelect: 'none', touchAction: 'none',
    }}>
      <div style={{ width: 40, height: 5, borderRadius: 3, background: 'rgba(0,0,0,.12)' }} />
      <span style={{ fontSize: 8, fontWeight: 700, color: 'rgba(0,0,0,.2)' }}>{'↕ sürükle'}</span>
      <div style={{ width: 40, height: 5, borderRadius: 3, background: 'rgba(0,0,0,.12)' }} />
      {panelPos && (
        <button onClick={(e) => { e.stopPropagation(); resetPosition('nl'); }} style={{
          position: 'absolute', right: 4, top: 2, background: 'none', border: 'none', cursor: 'pointer', fontSize: 10, color: '#bbb',
        }}>{'\↩'}</button>
      )}
    </div>

    <div style={{
      background: 'rgba(255,255,255,.85)', backdropFilter: 'blur(8px)',
      borderRadius: 16, padding: '8px 4px 4px',
      boxShadow: '0 4px 24px rgba(0,0,0,.08)', border: '1.5px solid rgba(0,0,0,.06)',
    }}>
      <svg width="100%" height={160} viewBox="0 0 840 160" preserveAspectRatio="xMidYMid meet">
        {/* Arka plan renk bölgeleri */}
        <rect x={20} y={70} width={400} height={40} rx={4} fill="rgba(239,68,68,.04)" />
        <rect x={420} y={70} width={400} height={40} rx={4} fill="rgba(34,197,94,.04)" />
        {/* Ana çizgi */}
        <line x1={20} y1={90} x2={820} y2={90} stroke={THEME.border} strokeWidth={3} />
        <polygon points="815,84 828,90 815,96" fill={THEME.border} />
        <polygon points="25,84 12,90 25,96" fill={THEME.border} />

        {/* Tick marks ve sayılar */}
        {Array.from({ length: 21 }, (_, i) => {
          const v = i - 10;
          const x = 20 + (i / 20) * 800;
          const isZero = v === 0;
          return (
            <g key={v} style={{ cursor: 'pointer' }} onClick={() => animateNumberLine(position === null ? 0 : position, v - (position === null ? 0 : position))}>
              <rect x={x - 18} y={68} width={36} height={70} fill="transparent" />
              <line x1={x} y1={isZero ? 72 : 78} x2={x} y2={isZero ? 108 : 102} stroke={isZero ? THEME.accent : THEME.border} strokeWidth={isZero ? 4 : v % 5 === 0 ? 2.5 : 1.5} />
              <text x={x} y={122} textAnchor="middle" fontSize={isZero ? 16 : v % 5 === 0 ? 14 : 11} fontWeight={isZero ? 900 : 700} fill={v > 0 ? THEME.posB : v < 0 ? THEME.negB : THEME.accent}>
                {v > 0 ? '+' + v : '' + v}
              </text>
              {isZero && <text x={x} y={136} textAnchor="middle" fontSize={8} fontWeight={700} fill={THEME.accent}>SIFIR</text>}
            </g>
          );
        })}

        {/* Yön etiketleri */}
        <g>
          <rect x={24} y={56} width={80} height={18} rx={9} fill={THEME.neg} />
          <text x={64} y={68} textAnchor="middle" fontSize={10} fontWeight={800} fill="#fff">{'\◀ Negatif'}</text>
        </g>
        <g>
          <rect x={736} y={56} width={80} height={18} rx={9} fill={THEME.pos} />
          <text x={776} y={68} textAnchor="middle" fontSize={10} fontWeight={800} fill="#fff">{'Pozitif \▶'}</text>
        </g>

        {/* Yürüyen İnsan */}
        <g transform="translate(0,88)">
          {position !== null ? (
            <WalkingPerson dir={walkDirection} x={20 + ((position + 10) / 20) * 800} color={position > 0 ? THEME.pos : position < 0 ? THEME.neg : THEME.accent} />
          ) : (
            <WalkingPerson dir="idle" x={420} color="#ccc" />
          )}
        </g>

        {/* Konum etiketi */}
        {position !== null && (() => {
          const x = 20 + ((position + 10) / 20) * 800;
          return (
            <g>
              <rect x={x - 24} y={10} width={48} height={24} rx={12} fill={position > 0 ? THEME.pos : position < 0 ? THEME.neg : THEME.accent} />
              <text x={x} y={26} textAnchor="middle" fontSize={14} fontWeight={900} fill="#fff">{position >= 0 ? '+' + position : '' + position}</text>
            </g>
          );
        })()}

        {/* Animasyonlu atlamalar */}
        {jumps.map((j, ji) => {
          const x1 = 20 + ((j.from + 10) / 20) * 800;
          const x2 = 20 + ((j.to + 10) / 20) * 800;
          const mx = (x1 + x2) / 2;
          const d = j.to > j.from ? 1 : -1;
          return (
            <g key={ji} style={{ animation: 'fadeIn .3s', animationDelay: ji * 0.3 + 's', animationFillMode: 'both' }}>
              <path d={`M${x1},86 Q${mx},48 ${x2},86`} fill="none" stroke={d > 0 ? THEME.pos : THEME.neg} strokeWidth={2.5} strokeDasharray="6,3" />
              <polygon points={`${x2 - 5 * d},80 ${x2},86 ${x2 - 5 * d},92`} fill={d > 0 ? THEME.pos : THEME.neg} />
              <circle cx={mx} cy={52} r={12} fill={d > 0 ? THEME.pos : THEME.neg} stroke="#fff" strokeWidth={1.5} />
              <text x={mx} y={56} textAnchor="middle" fontSize={11} fontWeight={900} fill="#fff">{j.step}</text>
            </g>
          );
        })}
      </svg>
    </div>
  </div>
);

export default NumberLine;
