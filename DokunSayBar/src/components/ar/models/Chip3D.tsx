import { CHIP_3D } from "../../../constants/dimensions3d";
import { CHIP_BG } from "../../../constants/colors";
import type { ChipColor } from "../../../types";

interface Chip3DProps {
  color: ChipColor;
  label?: string | null;
  position?: [number, number, number];
  onClick?: () => void;
  selected?: boolean;
}

export default function Chip3D({ color, position = [0, 0, 0], onClick, selected }: Chip3DProps) {
  const bg = CHIP_BG[color] || CHIP_BG.blue;

  return (
    <group position={position} onClick={onClick}>
      {/* Chip body - flat cylinder */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[CHIP_3D.radius, CHIP_3D.radius, CHIP_3D.height, 24]} />
        <meshStandardMaterial color={bg} roughness={0.3} metalness={0.15} />
      </mesh>

      {selected && (
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[CHIP_3D.radius + 0.05, CHIP_3D.radius + 0.05, CHIP_3D.height + 0.05, 24]} />
          <meshBasicMaterial color="#3b82f6" wireframe transparent opacity={0.6} />
        </mesh>
      )}
    </group>
  );
}
