import { useRef, useEffect, useState, Suspense, useCallback } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useAR } from "../../state/ARContext";
import { useAppState } from "../../state/AppContext";
import { translate } from "../../services/i18nService";
import { requestCamera, stopCamera } from "../../services/cameraService";
import { generateId } from "../../utils/idGenerator";
import Rod3D from "./models/Rod3D";
import Frame3D from "./models/Frame3D";
import Chip3D from "./models/Chip3D";
import type { AR3DItem } from "../../state/arReducer";

function PlacementScene() {
  const { arState, arDispatch } = useAR();
  const { camera, gl } = useThree();

  const handleClick = useCallback((e: any) => {
    e.stopPropagation();
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(
      (e.clientX / gl.domElement.clientWidth) * 2 - 1,
      -(e.clientY / gl.domElement.clientHeight) * 2 + 1
    );
    raycaster.setFromCamera(mouse, camera);
    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const intersection = new THREE.Vector3();
    raycaster.ray.intersectPlane(plane, intersection);

    if (intersection) {
      arDispatch({
        type: "ADD_AR_ITEM",
        item: {
          id: generateId(),
          type: "rod",
          value: 5,
          position: [intersection.x, 0.2, intersection.z],
          rotation: [0, 0, 0],
        },
      });
    }
  }, [arDispatch, camera, gl]);

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 10, 5]} intensity={0.8} />

      {/* Invisible ground plane for raycasting */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} onClick={handleClick}>
        <planeGeometry args={[50, 50]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* Placed AR items */}
      {arState.placedItems.map((item) => {
        const sel = arState.selectedARItemId === item.id;
        const onClick = () => arDispatch({ type: "SELECT_AR_ITEM", id: item.id });
        switch (item.type) {
          case "rod": return <Rod3D key={item.id} count={item.value || 5} position={item.position} selected={sel} onClick={onClick} showLabel />;
          case "frame": return <Frame3D key={item.id} cols={item.cols || 5} rows={item.rows || 2} position={item.position} selected={sel} onClick={onClick} />;
          case "chip": return <Chip3D key={item.id} color={(item.color as any) || "blue"} label={item.label} position={item.position} selected={sel} onClick={onClick} />;
          default: return null;
        }
      })}
    </>
  );
}

export default function ARCameraView() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const { arState, arDispatch } = useAR();
  const { state } = useAppState();
  const [placingType, setPlacingType] = useState<"rod" | "frame" | "chip">("rod");
  const [placingValue, setPlacingValue] = useState(5);
  const t = (k: string) => translate(k, state.language);

  useEffect(() => {
    let cancelled = false;
    requestCamera("environment").then((stream) => {
      if (cancelled) { stopCamera(stream); return; }
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      arDispatch({ type: "SET_CAMERA_READY", ready: true });
    }).catch((err) => {
      arDispatch({ type: "SET_CAMERA_ERROR", error: err.message });
    });

    return () => { cancelled = true; if (streamRef.current) stopCamera(streamRef.current); };
  }, [arDispatch]);

  return (
    <div style={{ width: "100%", height: "100vh", position: "relative", overflow: "hidden", background: "#000" }}>
      {/* Camera video feed */}
      <video
        ref={videoRef}
        playsInline muted autoPlay
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 1 }}
      />

      {/* 3D overlay */}
      <div style={{ position: "absolute", inset: 0, zIndex: 2 }}>
        <Canvas
          camera={{ position: [0, 3, 6], fov: 60 }}
          gl={{ alpha: true, antialias: true }}
          style={{ background: "transparent" }}
        >
          <Suspense fallback={null}>
            <PlacementScene />
          </Suspense>
        </Canvas>
      </div>

      {/* Camera error */}
      {arState.cameraError && (
        <div style={{
          position: "absolute", inset: 0, zIndex: 10,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: "rgba(0,0,0,.8)", color: "#fff", textAlign: "center", padding: 24,
        }}>
          <div>
            <div style={{ fontSize: 48, marginBottom: 12 }}>📷</div>
            <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 8 }}>{t("arCameraPermission")}</div>
            <div style={{ fontSize: 12, opacity: 0.7 }}>{arState.cameraError}</div>
            <button onClick={() => arDispatch({ type: "SET_AR_MODE", mode: "off" })}
              style={{ marginTop: 16, padding: "8px 20px", borderRadius: 8, border: "none", background: "#f59e0b", color: "#fff", fontWeight: 800, cursor: "pointer" }}>
              {t("back")}
            </button>
          </div>
        </div>
      )}

      {/* Top toolbar */}
      <div style={{
        position: "absolute", top: 12, left: 12, right: 12, zIndex: 10,
        display: "flex", gap: 8, alignItems: "center",
      }}>
        <button onClick={() => arDispatch({ type: "SET_AR_MODE", mode: "off" })}
          style={{ padding: "8px 14px", borderRadius: 10, border: "none", background: "rgba(255,255,255,.9)", color: "#000", fontWeight: 800, fontSize: 12, cursor: "pointer" }}>
          ← {t("back")}
        </button>
        <div style={{ flex: 1 }} />
        <button onClick={() => arDispatch({ type: "SET_AR_MODE", mode: "recognition" })}
          style={{ padding: "8px 14px", borderRadius: 10, border: "none", background: "rgba(34,197,94,.9)", color: "#fff", fontWeight: 800, fontSize: 11, cursor: "pointer" }}>
          🔍 {t("arRecognition")}
        </button>
      </div>

      {/* Bottom placement toolbar */}
      <div style={{
        position: "absolute", bottom: 16, left: "50%", transform: "translateX(-50%)", zIndex: 10,
        display: "flex", gap: 6, alignItems: "center",
        padding: "8px 16px", borderRadius: 16,
        background: "rgba(0,0,0,.6)", backdropFilter: "blur(8px)",
      }}>
        <span style={{ color: "#fff", fontSize: 9, fontWeight: 700, marginRight: 4 }}>{t("arTapToPlace")}</span>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
          <button key={n} onClick={() => setPlacingValue(n)}
            style={{
              width: 28, height: 28, borderRadius: 6, border: "none", cursor: "pointer",
              background: placingValue === n ? "#f59e0b" : "rgba(255,255,255,.15)",
              color: placingValue === n ? "#fff" : "rgba(255,255,255,.7)",
              fontSize: 10, fontWeight: 800,
            }}>
            {n}
          </button>
        ))}
        <button onClick={() => arDispatch({ type: "CLEAR_AR_ITEMS" })}
          style={{ padding: "4px 10px", borderRadius: 6, border: "none", background: "rgba(239,68,68,.8)", color: "#fff", fontSize: 9, fontWeight: 800, cursor: "pointer" }}>
          🗑
        </button>
      </div>

      {/* Item count */}
      <div style={{
        position: "absolute", bottom: 60, right: 16, zIndex: 10,
        padding: "4px 10px", borderRadius: 8,
        background: "rgba(0,0,0,.5)", color: "#fff",
        fontSize: 10, fontWeight: 700,
      }}>
        {arState.placedItems.length} items
      </div>
    </div>
  );
}
