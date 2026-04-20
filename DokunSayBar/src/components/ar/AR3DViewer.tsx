import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useAppState } from "../../state/AppContext";
import { useAR } from "../../state/ARContext";
import { translate } from "../../services/i18nService";
import { CELL_SIZE } from "../../constants/dimensions";
import { AR_CAMERA } from "../../constants/dimensions3d";
import Rod3D from "./models/Rod3D";
import Frame3D from "./models/Frame3D";
import Chip3D from "./models/Chip3D";
import type { CanvasItem } from "../../types";

function toWorld(pixelX: number, pixelY: number): [number, number, number] {
  return [(pixelX - 500) / CELL_SIZE, 0, (pixelY - 300) / CELL_SIZE];
}

function CanvasItem3D({ item }: { item: CanvasItem }) {
  const pos = toWorld(item.x, item.y);
  switch (item.type) {
    case "rod":
      return <Rod3D count={item.value} flipped={item.flipped} showLabel position={pos} />;
    case "frame":
      return <Frame3D cols={item.cols || 5} rows={item.rows || 2} position={pos} />;
    case "chip":
      return <Chip3D color={item.color} label={item.label} position={[pos[0], 0.15, pos[2]]} />;
    default:
      return null;
  }
}

function SimpleGrid() {
  return (
    <group>
      {/* Simple grid lines on the ground */}
      {Array.from({ length: 21 }, (_, i) => {
        const pos = i - 10;
        return (
          <group key={i}>
            <mesh position={[pos, -0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[0.02, 20]} />
              <meshBasicMaterial color={i % 5 === 0 ? "#f59e0b" : "#555"} transparent opacity={i % 5 === 0 ? 0.5 : 0.15} />
            </mesh>
            <mesh position={[0, -0.01, pos]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[20, 0.02]} />
              <meshBasicMaterial color={i % 5 === 0 ? "#f59e0b" : "#555"} transparent opacity={i % 5 === 0 ? 0.5 : 0.15} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

function Scene() {
  const { state } = useAppState();
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[8, 12, 5]} intensity={1} />
      <pointLight position={[-5, 8, -5]} intensity={0.3} />
      <SimpleGrid />
      {state.items.map((item) => (
        <CanvasItem3D key={item.id} item={item} />
      ))}
      <OrbitControls enablePan enableZoom enableRotate minDistance={3} maxDistance={30} maxPolarAngle={Math.PI / 2.1} />
    </>
  );
}

export default function AR3DViewer() {
  const { state } = useAppState();
  const { arDispatch } = useAR();
  const t = (k: string) => translate(k, state.language);

  return (
    <div style={{ width: "100vw", height: "100vh", background: "#1a1a2e", position: "relative" }}>
      <Canvas
        camera={{ position: AR_CAMERA.defaultPosition, fov: AR_CAMERA.fov }}
        style={{ width: "100%", height: "100%" }}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>

      {/* UI Overlay */}
      <div style={{ position: "absolute", top: 12, left: 12, display: "flex", gap: 8, zIndex: 10 }}>
        <button
          onClick={() => arDispatch({ type: "SET_AR_MODE", mode: "off" })}
          style={{ padding: "8px 16px", borderRadius: 10, border: "none", background: "rgba(255,255,255,.9)", color: "#1a1a2e", fontWeight: 800, fontSize: 12, cursor: "pointer", boxShadow: "0 4px 12px rgba(0,0,0,.2)" }}
        >
          ← {t("back")}
        </button>
        <div style={{ padding: "6px 14px", borderRadius: 8, background: "rgba(0,0,0,.5)", color: "#fff", fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", gap: 6 }}>
          <span>🧊</span> 3D — {state.items.length} items
        </div>
      </div>

      {/* Mode switcher */}
      <div style={{ position: "absolute", bottom: 16, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 6, zIndex: 10 }}>
        <button onClick={() => arDispatch({ type: "SET_AR_MODE", mode: "3d" })}
          style={{ padding: "8px 16px", borderRadius: 10, border: "none", background: "#f59e0b", color: "#fff", fontSize: 11, fontWeight: 800, cursor: "pointer" }}>
          🧊 3D
        </button>
        <button onClick={() => arDispatch({ type: "SET_AR_MODE", mode: "camera-ar" })}
          style={{ padding: "8px 16px", borderRadius: 10, border: "none", background: "rgba(255,255,255,.15)", color: "#fff", fontSize: 11, fontWeight: 800, cursor: "pointer" }}>
          📸 AR
        </button>
        <button onClick={() => arDispatch({ type: "SET_AR_MODE", mode: "recognition" })}
          style={{ padding: "8px 16px", borderRadius: 10, border: "none", background: "rgba(255,255,255,.15)", color: "#fff", fontSize: 11, fontWeight: 800, cursor: "pointer" }}>
          🔍 {t("arRecognition")}
        </button>
      </div>

      {/* Empty state */}
      {state.items.length === 0 && (
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", color: "rgba(255,255,255,.4)", textAlign: "center", pointerEvents: "none", zIndex: 5 }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>🧊</div>
          <div style={{ fontSize: 14, fontWeight: 700 }}>{t("hint")}</div>
        </div>
      )}
    </div>
  );
}
