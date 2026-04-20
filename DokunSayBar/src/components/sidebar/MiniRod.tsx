import { MINI_UNIT_WIDTH, MINI_ROD_HEIGHT } from "../../constants/dimensions";

interface MiniRodProps {
  count: number;
}

export default function MiniRod({ count }: MiniRodProps) {
  const width = count * MINI_UNIT_WIDTH;

  return (
    <svg
      width={width}
      height={MINI_ROD_HEIGHT}
      viewBox={`0 0 ${width} ${MINI_ROD_HEIGHT}`}
      style={{ display: "block", flexShrink: 0 }}
    >
      <rect
        x={1} y={1}
        width={width - 2} height={MINI_ROD_HEIGHT - 2}
        rx={4} fill="#f59e0b" stroke="#78350f" strokeWidth={2}
      />
      {Array.from({ length: count }, (_, i) => (
        <circle
          key={i}
          cx={i * MINI_UNIT_WIDTH + MINI_UNIT_WIDTH / 2}
          cy={MINI_ROD_HEIGHT / 2}
          r={5.5}
          fill="#050505"
        />
      ))}
    </svg>
  );
}
