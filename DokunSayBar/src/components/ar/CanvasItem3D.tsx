import Rod3D from "./models/Rod3D";
import Frame3D from "./models/Frame3D";
import Chip3D from "./models/Chip3D";
import type { CanvasItem, ChipColor } from "../../types";

interface CanvasItem3DProps {
  item: CanvasItem;
  position: [number, number, number];
  selected?: boolean;
  onClick?: () => void;
}

export default function CanvasItem3D({ item, position, selected, onClick }: CanvasItem3DProps) {
  switch (item.type) {
    case "rod":
      return (
        <Rod3D
          count={item.value}
          flipped={item.flipped}
          showLabel
          position={position}
          selected={selected}
          onClick={onClick}
        />
      );
    case "frame":
      return (
        <Frame3D
          cols={item.cols || 5}
          rows={item.rows || 2}
          position={position}
          selected={selected}
          onClick={onClick}
        />
      );
    case "chip":
      return (
        <Chip3D
          color={item.color as ChipColor}
          label={item.label}
          position={position}
          selected={selected}
          onClick={onClick}
        />
      );
    default:
      return null;
  }
}
