import { DOT_PATTERNS } from "../../constants/dotPatterns";
import { CHIP_SIZE } from "../../constants/dimensions";
import Chip from "./Chip";

interface DotGroupProps {
  count: number;
}

export default function DotGroup({ count }: DotGroupProps) {
  const dots = DOT_PATTERNS[count] || [];
  const step = CHIP_SIZE + 8;

  return (
    <div style={{ width: 2 * step + CHIP_SIZE, height: 2 * step + CHIP_SIZE, position: "relative" }}>
      {dots.map(([dx, dy], i) => (
        <div key={i} style={{ position: "absolute", left: dx * step, top: dy * step }}>
          <Chip color="blue" size={CHIP_SIZE} />
        </div>
      ))}
    </div>
  );
}
