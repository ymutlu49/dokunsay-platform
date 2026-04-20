import { CELL_SIZE, ROD_HEIGHT, HOLE_RADIUS } from "../../constants/dimensions";
import SvgGradientDefs from "../svg/SvgGradientDefs";

interface RodProps {
  count: number;
  flipped: boolean;
  label?: boolean;
}

export default function Rod({ count, flipped, label }: RodProps) {
  const width = count * CELL_SIZE;

  return (
    <svg
      width={width}
      height={ROD_HEIGHT}
      viewBox={`0 0 ${width} ${ROD_HEIGHT}`}
      style={{ display: "block" }}
    >
      <defs><SvgGradientDefs /></defs>

      {flipped ? (
        <rect
          x={2} y={2}
          width={width - 4} height={ROD_HEIGHT - 4}
          rx={10} fill="url(#gB)" stroke="#333" strokeWidth={3}
        />
      ) : (
        <>
          <rect
            x={2} y={2}
            width={width - 4} height={ROD_HEIGHT - 4}
            rx={10} fill="url(#gR)" stroke="#78350f" strokeWidth={3}
          />
          {Array.from({ length: count }, (_, i) => (
            <circle
              key={i}
              cx={i * CELL_SIZE + CELL_SIZE / 2}
              cy={ROD_HEIGHT / 2 + 1}
              r={HOLE_RADIUS}
              fill="url(#gH)"
              stroke="rgba(0,0,0,.5)"
              strokeWidth={2}
            />
          ))}
        </>
      )}

      {label && !flipped && (
        <text
          x={width / 2} y={ROD_HEIGHT - 4}
          textAnchor="middle"
          fontSize={10} fontWeight={800}
          fill="rgba(120,53,15,.6)"
        >
          {count}
        </text>
      )}
    </svg>
  );
}
