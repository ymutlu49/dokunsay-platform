import { useRef, useEffect, useCallback, useState } from "react";
import { useAR } from "../../state/ARContext";
import { useAppState } from "../../state/AppContext";
import { translate } from "../../services/i18nService";
import { requestCamera, stopCamera, getDownscaledFrame } from "../../services/cameraService";
import { detectRods, type DetectedRod } from "../../services/imageProcessing";

export default function ARRecognitionView() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number>(0);
  const { arState, arDispatch } = useAR();
  const { state } = useAppState();
  const [detectedRods, setDetectedRods] = useState<DetectedRod[]>([]);
  const [fps, setFps] = useState(0);
  const t = (k: string) => translate(k, state.language);

  // Start camera
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

  // Detection loop
  useEffect(() => {
    if (!arState.cameraReady) return;

    let lastTime = performance.now();
    let frameCount = 0;

    function processFrame() {
      if (!videoRef.current || !canvasRef.current) {
        animFrameRef.current = requestAnimationFrame(processFrame);
        return;
      }

      const now = performance.now();
      // Process at ~8 FPS
      if (now - lastTime < 125) {
        animFrameRef.current = requestAnimationFrame(processFrame);
        return;
      }

      const frame = getDownscaledFrame(videoRef.current, canvasRef.current, 320, 240);
      if (frame) {
        const rods = detectRods(frame.data, frame.width, frame.height);
        setDetectedRods(rods);
      }

      frameCount++;
      if (now - lastTime > 1000) {
        setFps(frameCount);
        frameCount = 0;
        lastTime = now;
      }

      animFrameRef.current = requestAnimationFrame(processFrame);
    }

    animFrameRef.current = requestAnimationFrame(processFrame);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [arState.cameraReady]);

  // Scale detection results to video display
  const getOverlayStyle = useCallback((rod: DetectedRod) => {
    if (!videoRef.current) return {};
    const vw = videoRef.current.clientWidth;
    const vh = videoRef.current.clientHeight;
    const scaleX = vw / 320;
    const scaleY = vh / 240;
    return {
      left: rod.x * scaleX,
      top: rod.y * scaleY,
      width: rod.width * scaleX,
      height: rod.height * scaleY,
    };
  }, []);

  return (
    <div style={{ width: "100%", height: "100vh", position: "relative", overflow: "hidden", background: "#000" }}>
      {/* Camera feed */}
      <video ref={videoRef} playsInline muted autoPlay
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 1 }} />

      {/* Offscreen processing canvas */}
      <canvas ref={canvasRef} style={{ display: "none" }} />

      {/* Detection overlays */}
      <div style={{ position: "absolute", inset: 0, zIndex: 5, pointerEvents: "none" }}>
        {detectedRods.map((rod, i) => {
          const style = getOverlayStyle(rod);
          return (
            <div key={i} style={{
              position: "absolute",
              ...style,
              border: "3px solid #f59e0b",
              borderRadius: 8,
              boxShadow: "0 0 12px rgba(245,158,11,.4)",
            }}>
              {/* Value badge */}
              <div style={{
                position: "absolute", top: -24, left: "50%", transform: "translateX(-50%)",
                padding: "2px 10px", borderRadius: 8,
                background: "linear-gradient(135deg,#f59e0b,#78350f)",
                color: "#fff", fontSize: 14, fontWeight: 900,
                boxShadow: "0 2px 8px rgba(0,0,0,.3)",
                whiteSpace: "nowrap",
              }}>
                {rod.holeCount}
              </div>
              {/* Confidence */}
              <div style={{
                position: "absolute", bottom: -18, left: "50%", transform: "translateX(-50%)",
                fontSize: 8, color: "#22c55e", fontWeight: 700,
                background: "rgba(0,0,0,.5)", padding: "1px 6px", borderRadius: 4,
              }}>
                {Math.round(rod.confidence * 100)}%
              </div>
            </div>
          );
        })}
      </div>

      {/* Top toolbar */}
      <div style={{
        position: "absolute", top: 12, left: 12, right: 12, zIndex: 10,
        display: "flex", gap: 8, alignItems: "center",
      }}>
        <button onClick={() => arDispatch({ type: "SET_AR_MODE", mode: "camera-ar" })}
          style={{ padding: "8px 14px", borderRadius: 10, border: "none", background: "rgba(255,255,255,.9)", color: "#000", fontWeight: 800, fontSize: 12, cursor: "pointer" }}>
          ← {t("back")}
        </button>
        <div style={{ flex: 1 }} />
        <div style={{
          padding: "4px 10px", borderRadius: 8,
          background: "rgba(0,0,0,.5)", color: "#fff",
          fontSize: 10, fontWeight: 700,
        }}>
          🔍 {detectedRods.length} {t("arRodsFound")} | {fps} FPS
        </div>
      </div>

      {/* Instruction */}
      {detectedRods.length === 0 && (
        <div style={{
          position: "absolute", bottom: 40, left: "50%", transform: "translateX(-50%)",
          zIndex: 10, padding: "10px 20px", borderRadius: 12,
          background: "rgba(0,0,0,.6)", color: "#fff",
          fontSize: 12, fontWeight: 700, textAlign: "center",
          backdropFilter: "blur(4px)",
        }}>
          📷 {t("arDetecting")}
        </div>
      )}
    </div>
  );
}
