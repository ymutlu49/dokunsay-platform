export default function UpdateBanner({ onUpdate }) {
  return (
    <div
      style={{
        position: "fixed",
        bottom: 20,
        left: "50%",
        transform: "translateX(-50%)",
        background: "#1a1a1a",
        color: "#fff",
        padding: "12px 24px",
        borderRadius: 12,
        display: "flex",
        alignItems: "center",
        gap: 12,
        zIndex: 9999,
        boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
        fontSize: 14,
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <span>Yeni sürüm mevcut!</span>
      <button
        onClick={onUpdate}
        style={{
          background: "#f5b731",
          color: "#1a1a1a",
          border: "none",
          padding: "6px 16px",
          borderRadius: 8,
          fontWeight: 700,
          cursor: "pointer",
          fontSize: 13,
        }}
      >
        Güncelle
      </button>
    </div>
  );
}
