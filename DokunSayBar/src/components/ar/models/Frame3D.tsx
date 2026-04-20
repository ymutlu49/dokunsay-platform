import { FRAME_3D } from "../../../constants/dimensions3d";

interface Frame3DProps {
  cols: number;
  rows: number;
  position?: [number, number, number];
  onClick?: () => void;
  selected?: boolean;
}

export default function Frame3D({ cols, rows, position = [0, 0, 0], onClick, selected }: Frame3DProps) {
  const width = cols * FRAME_3D.cellSize + FRAME_3D.padding * 2;
  const height = rows * FRAME_3D.cellSize + FRAME_3D.padding * 2;

  return (
    <group position={position} onClick={onClick}>
      {/* Frame body */}
      <mesh position={[width / 2, height / 2, 0]}>
        <boxGeometry args={[width, height, FRAME_3D.depth]} />
        <meshStandardMaterial color="#f59e0b" roughness={0.4} metalness={0.1} />
      </mesh>

      {/* Holes */}
      {Array.from({ length: rows }, (_, r) =>
        Array.from({ length: cols }, (_, c) => (
          <mesh
            key={`${r}-${c}`}
            position={[
              FRAME_3D.padding + c * FRAME_3D.cellSize + FRAME_3D.cellSize / 2,
              FRAME_3D.padding + r * FRAME_3D.cellSize + FRAME_3D.cellSize / 2,
              FRAME_3D.depth / 2 + 0.001,
            ]}
            rotation={[Math.PI / 2, 0, 0]}
          >
            <cylinderGeometry args={[FRAME_3D.holeRadius, FRAME_3D.holeRadius, FRAME_3D.holeDepth, 20]} />
            <meshStandardMaterial color="#050505" roughness={0.9} />
          </mesh>
        ))
      )}

      {selected && (
        <mesh position={[width / 2, height / 2, 0]}>
          <boxGeometry args={[width + 0.15, height + 0.15, FRAME_3D.depth + 0.15]} />
          <meshBasicMaterial color="#3b82f6" wireframe transparent opacity={0.6} />
        </mesh>
      )}
    </group>
  );
}
