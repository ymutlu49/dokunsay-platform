import { DOT_PATTERNS } from "../../constants/dotPatterns";

interface DotPreviewProps {
  count: number;
  size?: number;
}

export default function DotPreview({ count, size = 36 }: DotPreviewProps) {
  const dots = DOT_PATTERNS[count] || [];
  const cell = size / 3;
  const dotRadius = cell * 0.38;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{ display: "block", cursor: "pointer" }}
    >
      {dots.map(([dx, dy], i) => {
        const cx = dx * cell + cell / 2;
        const cy = dy * cell + cell / 2;
        return (
          <g key={i}>
            <circle
              cx={cx} cy={cy} r={dotRadius}
              fill="#3b82f6" stroke="#1e40af" strokeWidth={1.2}
            />
            <circle
              cx={cx - dotRadius * 0.2}
              cy={cy - dotRadius * 0.25}
              r={dotRadius * 0.3}
              fill="rgba(255,255,255,.3)"
            />
          </g>
        );
      })}
    </svg>
  );
}
