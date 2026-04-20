export default function CoverOverlay() {
  return (
    <div
      style={{
        position: "absolute", inset: 0, zIndex: 40,
        background: "rgba(60,40,20,.88)",
        display: "flex", alignItems: "center", justifyContent: "center",
        pointerEvents: "none",
      }}
    >
      <div style={{ fontSize: 48, opacity: 0.3 }}>🙈</div>
    </div>
  );
}
