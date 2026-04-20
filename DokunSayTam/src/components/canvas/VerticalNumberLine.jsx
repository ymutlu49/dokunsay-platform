import { THEME } from '../../constants/theme';

const VerticalNumberLine = () => (
  <div style={{ position: 'absolute', right: 20, top: 54, bottom: 90, zIndex: 1, width: 60 }}>
    <svg width={60} height="100%" viewBox="0 0 60 440" preserveAspectRatio="xMidYMid meet">
      {Array.from({ length: 11 }, (_, i) => {
        const v = 5 - i;
        const y = 20 + i * 40;
        return (
          <g key={v}>
            <line x1={20} y1={y} x2={50} y2={y} stroke={THEME.border} strokeWidth={v === 0 ? 2.5 : 1} />
            <text x={14} y={y + 4} textAnchor="end" fontSize={v === 0 ? 13 : 10} fontWeight={v === 0 ? 900 : 700} fill={v > 0 ? THEME.posB : v < 0 ? THEME.negB : THEME.accent}>
              {v > 0 ? '+' + v : v}
            </text>
            {v === 0 && (
              <>
                <line x1={0} y1={y} x2={60} y2={y} stroke={THEME.blue} strokeWidth={2} strokeDasharray="4,3" />
                <text x={56} y={y - 4} fontSize={7} fill={THEME.blue} textAnchor="end">Deniz</text>
              </>
            )}
          </g>
        );
      })}
      <line x1={35} y1={16} x2={35} y2={424} stroke={THEME.border} strokeWidth={2} />
      <text x={30} y={12} textAnchor="middle" fontSize={8} fontWeight={700} fill={THEME.posB}>+</text>
      <text x={30} y={434} textAnchor="middle" fontSize={8} fontWeight={700} fill={THEME.negB}>{'\−'}</text>
    </svg>
  </div>
);

export default VerticalNumberLine;
