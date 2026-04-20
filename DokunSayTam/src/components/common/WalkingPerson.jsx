import { THEME } from '../../constants/theme';

const WalkingPerson = ({ dir = 'idle', x = 0, color }) => {
  const flip = dir === 'left' ? -1 : 1;
  const walking = dir !== 'idle';
  const personColor = color || THEME.accent;

  const walkArmStyle = walking
    ? { animation: 'walkArm .4s alternate infinite ease-in-out' }
    : {};
  const walkArmReverseStyle = walking
    ? { animation: 'walkArm .4s alternate-reverse infinite ease-in-out' }
    : {};
  const walkLegStyle = walking
    ? { animation: 'walkLeg .4s alternate infinite ease-in-out' }
    : {};
  const walkLegReverseStyle = walking
    ? { animation: 'walkLeg .4s alternate-reverse infinite ease-in-out' }
    : {};

  return (
    <g transform={`translate(${x},0)`} style={{ transition: 'transform .5s ease' }}>
      <g transform={`scale(${flip},1)`}>
        {/* Kafa */}
        <circle cx={0} cy={-38} r={8} fill={personColor} stroke="#fff" strokeWidth={1.5} />
        {/* Gövde */}
        <line x1={0} y1={-30} x2={0} y2={-12} stroke={personColor} strokeWidth={3} strokeLinecap="round" />
        {/* Kollar */}
        <line x1={0} y1={-24} x2={walking ? -8 : -6} y2={walking ? -16 : -20} stroke={personColor} strokeWidth={2.5} strokeLinecap="round" style={walkArmStyle} />
        <line x1={0} y1={-24} x2={walking ? 8 : 6} y2={walking ? -16 : -20} stroke={personColor} strokeWidth={2.5} strokeLinecap="round" style={walkArmReverseStyle} />
        {/* Bacaklar */}
        <line x1={0} y1={-12} x2={walking ? -6 : -4} y2={0} stroke={personColor} strokeWidth={2.5} strokeLinecap="round" style={walkLegStyle} />
        <line x1={0} y1={-12} x2={walking ? 6 : 4} y2={0} stroke={personColor} strokeWidth={2.5} strokeLinecap="round" style={walkLegReverseStyle} />
        {/* Yüz */}
        <circle cx={-2} cy={-40} r={1.2} fill="#fff" />
        <circle cx={3} cy={-40} r={1.2} fill="#fff" />
        <path
          d={dir === 'idle' ? 'M-2,-36 Q0.5,-34 3,-36' : 'M-2,-36 Q0.5,-33 3,-36'}
          fill="none" stroke="#fff" strokeWidth={1} strokeLinecap="round"
        />
      </g>
    </g>
  );
};

export default WalkingPerson;
