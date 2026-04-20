import { PALETTE } from '../../constants/palette';

export default function Toggle({ on, onToggle, icon, label, sub, highContrast }) {
  return (
    <div
      role="switch" aria-checked={on} tabIndex={0}
      onClick={onToggle}
      onKeyDown={e => { if (e.key === " " || e.key === "Enter") { e.preventDefault(); onToggle(); } }}
      style={{
        display: "flex", alignItems: "center", gap: 8, padding: "6px 8px", marginBottom: 3,
        borderRadius: 8, cursor: "pointer",
        background: on ? PALETTE.accentL : "transparent", transition: "background .15s",
      }}
    >
      <div aria-hidden style={{
        width: 32, height: 18, borderRadius: 9,
        background: on ? PALETTE.accent : "#ddd",
        position: "relative", transition: ".2s", flexShrink: 0,
      }}>
        <div style={{
          position: "absolute", top: 2, left: on ? 16 : 2,
          width: 14, height: 14, borderRadius: "50%", background: "#fff",
          transition: ".2s", boxShadow: "0 1px 3px rgba(0,0,0,.15)",
        }}/>
      </div>
      <span aria-hidden style={{ fontSize: 14 }}>{icon}</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: highContrast ? "#fff" : PALETTE.text }}>{label}</div>
        {sub && <div style={{ fontSize: 10, color: "#b5a990" }}>{sub}</div>}
      </div>
    </div>
  );
}
