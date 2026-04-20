import { MINI_UNIT_WIDTH, MINI_ROD_HEIGHT } from "../../constants/dimensions";

interface MiniFrameProps {
  cols: number;
  rows: number;
}

export default function MiniFrame({ cols, rows }: MiniFrameProps) {
  const width = cols * MINI_UNIT_WIDTH;
  const height = rows * MINI_ROD_HEIGHT;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ display: "block", flexShrink: 0 }}
    >
      <rect
        x={1} y={1}
        width={width - 2} height={height - 2}
        rx={4} fill="#f59e0b" stroke="#78350f" strokeWidth={2}
      />
      {Array.from({ length: rows }, (_, r) =>
        Array.from({ length: cols }, (_, c) => (
          <circle
            key={`${r}-${c}`}
            cx={c * MINI_UNIT_WIDTH + MINI_UNIT_WIDTH / 2}
            cy={r * MINI_ROD_HEIGHT + MINI_ROD_HEIGHT / 2}
            r={5.5}
            fill="#050505"
          />
        ))
      )}
    </svg>
  );
}
