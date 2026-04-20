import { ROD_3D } from "../../../constants/dimensions3d";

interface Rod3DProps {
  count: number;
  flipped?: boolean;
  showLabel?: boolean;
  position?: [number, number, number];
  onClick?: () => void;
  selected?: boolean;
}

export default function Rod3D({ count, flipped = false, position = [0, 0, 0], onClick, selected }: Rod3DProps) {
  const width = count * ROD_3D.cellWidth;

  return (
    <group position={position} onClick={onClick}>
      {/* Rod body */}
      <mesh position={[width / 2, ROD_3D.height / 2, 0]}>
        <boxGeometry args={[width, ROD_3D.height, ROD_3D.depth]} />
        <meshStandardMaterial
          color={flipped ? "#1a1a1a" : "#f59e0b"}
          roughness={0.4}
          metalness={0.1}
        />
      </mesh>

      {/* Rounded edges - thin strips on top/bottom */}
      <mesh position={[width / 2, ROD_3D.height, 0]}>
        <boxGeometry args={[width - 0.1, 0.04, ROD_3D.depth - 0.04]} />
        <meshStandardMaterial color={flipped ? "#222" : "#fde047"} />
      </mesh>
      <mesh position={[width / 2, 0, 0]}>
        <boxGeometry args={[width - 0.1, 0.04, ROD_3D.depth - 0.04]} />
        <meshStandardMaterial color={flipped ? "#111" : "#78350f"} />
      </mesh>

      {/* Holes */}
      {!flipped && Array.from({ length: count }, (_, i) => (
        <mesh
          key={i}
          position={[i * ROD_3D.cellWidth + ROD_3D.cellWidth / 2, ROD_3D.height / 2, ROD_3D.depth / 2 + 0.001]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <cylinderGeometry args={[ROD_3D.holeRadius, ROD_3D.holeRadius, ROD_3D.holeDepth, 20]} />
          <meshStandardMaterial color="#050505" roughness={0.9} />
        </mesh>
      ))}

      {/* Selection outline */}
      {selected && (
        <mesh position={[width / 2, ROD_3D.height / 2, 0]}>
          <boxGeometry args={[width + 0.15, ROD_3D.height + 0.15, ROD_3D.depth + 0.15]} />
          <meshBasicMaterial color="#3b82f6" wireframe transparent opacity={0.6} />
        </mesh>
      )}
    </group>
  );
}
