import { FRAME_CELL_SIZE, FRAME_PADDING, FRAME_HOLE_RADIUS } from "../../constants/dimensions";
import SvgGradientDefs from "../svg/SvgGradientDefs";

interface FrameProps {
  cols: number;
  rows: number;
}

export default function Frame({ cols, rows }: FrameProps) {
  const width = cols * FRAME_CELL_SIZE + FRAME_PADDING * 2;
  const height = rows * FRAME_CELL_SIZE + FRAME_PADDING * 2;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ display: "block" }}
    >
      <defs><SvgGradientDefs /></defs>
      <rect
        x={2} y={2}
        width={width - 4} height={height - 4}
        rx={10} fill="url(#gR)" stroke="#78350f" strokeWidth={3}
      />
      {Array.from({ length: rows }, (_, r) =>
        Array.from({ length: cols }, (_, c) => (
          <circle
            key={`${r}-${c}`}
            cx={FRAME_PADDING + c * FRAME_CELL_SIZE + FRAME_CELL_SIZE / 2}
            cy={FRAME_PADDING + r * FRAME_CELL_SIZE + FRAME_CELL_SIZE / 2}
            r={FRAME_HOLE_RADIUS}
            fill="url(#gH)"
            stroke="rgba(0,0,0,.45)"
            strokeWidth={2}
          />
        ))
      )}
    </svg>
  );
}
