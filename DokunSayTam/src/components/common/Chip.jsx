import { THEME } from '../../constants/theme';

const Chip = ({ type, size = 20, anim }) => {
  const isPositive = type === 'pos';
  const gradientId = `cg_${type}_${size}`;

  return (
    <svg width={size * 2} height={size * 2} style={anim ? { animation: anim } : {}}>
      <defs>
        <radialGradient id={gradientId}>
          <stop offset="0%" stopColor={isPositive ? '#4ade80' : '#f87171'} />
          <stop offset="100%" stopColor={isPositive ? THEME.pos : THEME.neg} />
        </radialGradient>
      </defs>
      <circle
        cx={size} cy={size} r={size - 2}
        fill={`url(#${gradientId})`}
        stroke={isPositive ? THEME.posB : THEME.negB}
        strokeWidth={2.5}
      />
      <text
        x={size} y={size + 1}
        textAnchor="middle" dominantBaseline="middle"
        fontSize={size * 1.1} fontWeight={900} fill="#fff"
      >
        {isPositive ? '+' : '−'}
      </text>
    </svg>
  );
};

export default Chip;
