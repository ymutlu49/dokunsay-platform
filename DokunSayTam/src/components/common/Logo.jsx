import { THEME } from '../../constants/theme';

const Logo = ({ size = 50 }) => (
  <svg width={size} height={size} viewBox="0 0 60 60">
    <circle cx={20} cy={30} r={16} fill={THEME.pos} stroke="#fff" strokeWidth={2} />
    <text x={20} y={31} textAnchor="middle" dominantBaseline="middle" fontSize={18} fontWeight={900} fill="#fff">+</text>
    <circle cx={40} cy={30} r={16} fill={THEME.neg} stroke="#fff" strokeWidth={2} />
    <text x={40} y={31} textAnchor="middle" dominantBaseline="middle" fontSize={18} fontWeight={900} fill="#fff">−</text>
  </svg>
);

export default Logo;
