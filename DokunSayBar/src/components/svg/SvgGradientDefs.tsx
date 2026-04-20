export default function SvgGradientDefs() {
  return (
    <>
      <linearGradient id="gR" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#fde047" />
        <stop offset="30%" stopColor="#f59e0b" />
        <stop offset="100%" stopColor="#78350f" />
      </linearGradient>
      <linearGradient id="gB" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#222" />
        <stop offset="100%" stopColor="#0a0a0a" />
      </linearGradient>
      <radialGradient id="gH" cx=".45" cy=".38">
        <stop offset="0%" stopColor="#1a1a1a" />
        <stop offset="100%" stopColor="#000" />
      </radialGradient>
    </>
  );
}
