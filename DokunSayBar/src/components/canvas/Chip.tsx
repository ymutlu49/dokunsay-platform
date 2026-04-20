import { CHIP_BG, CHIP_BORDER, CHIP_TEXT } from "../../constants/colors";
import type { ChipColor } from "../../types";

interface ChipProps {
  color: ChipColor;
  label?: string | null;
  size?: number;
}

export default function Chip({ color, label, size = 24 }: ChipProps) {
  const bg = CHIP_BG[color] || CHIP_BG.blue;
  const border = CHIP_BORDER[color] || CHIP_BORDER.blue;
  const textColor = CHIP_TEXT[color] || "#fff";

  const fontSize = label && String(label).length > 1
    ? Math.round(size * 0.38)
    : Math.round(size * 0.5);

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        flexShrink: 0,
        background: bg,
        border: `2px solid ${border}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
      }}
    >
      {label != null && (
        <span
          style={{
            fontSize,
            fontWeight: 900,
            color: textColor,
            userSelect: "none",
          }}
        >
          {label}
        </span>
      )}
    </div>
  );
}
