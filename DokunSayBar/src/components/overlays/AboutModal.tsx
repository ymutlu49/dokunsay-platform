import type { Language } from "../../types";
import { translate, isRTL, getThreeWord } from "../../services/i18nService";

interface AboutModalProps {
  lang: Language;
  onClose: () => void;
}

export default function AboutModal({ lang, onClose }: AboutModalProps) {
  const t = (k: string) => translate(k, lang);
  const rtl = isRTL(lang);

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: "rgba(0,0,0,.55)",
        display: "flex", alignItems: "center", justifyContent: "center",
        backdropFilter: "blur(4px)",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="ds-pop"
        style={{
          background: "#fffdf7", borderRadius: 24,
          padding: "36px 40px", maxWidth: 520, width: "90%",
          boxShadow: "0 20px 60px rgba(0,0,0,.3)",
          direction: rtl ? "rtl" : "ltr",
          textAlign: "center",
        }}
      >
        {/* Logo */}
        <svg
          width="72" height="72" viewBox="0 0 512 512"
          style={{ borderRadius: 18, margin: "0 auto 16px", display: "block", boxShadow: "0 6px 24px rgba(0,0,0,.15)" }}
        >
          <rect width="512" height="512" rx="100" fill="none" />
          <circle cx="256" cy="258" r="138" fill="none" stroke="rgba(245,158,11,.3)" strokeWidth="3" strokeDasharray="9 8" />
          <path d="M185 170 L256 355" fill="none" stroke="rgba(245,158,11,.25)" strokeWidth="4" strokeLinecap="round" />
          <path d="M327 170 L256 355" fill="none" stroke="rgba(245,158,11,.25)" strokeWidth="4" strokeLinecap="round" />
          <path d="M183 163 L329 163" fill="none" stroke="rgba(245,158,11,.25)" strokeWidth="4" strokeLinecap="round" />
          <circle cx="180" cy="155" r="64" fill="#f59e0b" /><circle cx="180" cy="155" r="64" fill="none" stroke="#b45309" strokeWidth="5" />
          <circle cx="158" cy="148" r="11" fill="#000" /><circle cx="180" cy="148" r="11" fill="#000" /><circle cx="202" cy="148" r="11" fill="#000" />
          <circle cx="332" cy="155" r="64" fill="#d97706" /><circle cx="332" cy="155" r="64" fill="none" stroke="#92400e" strokeWidth="5" />
          <text x="332" y="175" textAnchor="middle" fontFamily="system-ui" fontSize="50" fontWeight="900" fill="#000">{getThreeWord(lang)}</text>
          <circle cx="256" cy="362" r="64" fill="#16a34a" /><circle cx="256" cy="362" r="64" fill="none" stroke="#064e3b" strokeWidth="5" />
          <text x="256" y="385" textAnchor="middle" fontFamily="system-ui" fontSize="58" fontWeight="900" fill="#000">3</text>
        </svg>

        {/* Title */}
        <h2 style={{ fontSize: 24, fontWeight: 900, color: "#3d3520", margin: "0 0 2px" }}>
          DokunSay
        </h2>
        <p style={{ fontSize: 12, fontWeight: 700, color: "#d97706", margin: "0 0 16px", letterSpacing: 1 }}>
          {t("aboutSubtitle")}
        </p>

        {/* Divider */}
        <div style={{ width: 48, height: 3, borderRadius: 2, background: "linear-gradient(90deg,#f59e0b,#78350f)", margin: "0 auto 16px" }} />

        {/* Description */}
        <p style={{ fontSize: 13, lineHeight: 1.7, color: "#4a4a3a", margin: "0 0 20px", textAlign: rtl ? "right" : "left" }}>
          {t("aboutDescription")}
        </p>

        {/* Creators */}
        <div style={{
          background: "linear-gradient(135deg, rgba(245,158,11,.06), rgba(120,53,15,.06))",
          border: "1px solid rgba(245,158,11,.15)",
          borderRadius: 14, padding: "16px 20px", marginBottom: 16,
          textAlign: rtl ? "right" : "left",
        }}>
          <div style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: 1.5, color: "#d97706", marginBottom: 10 }}>
            {t("aboutCreators")}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <CreatorCard name="Prof. Dr. Yılmaz Mutlu" icon="🎓" />
            <CreatorCard name={t("aboutNameDemirtas")} icon="📐" />
          </div>
        </div>

        {/* Mission */}
        <p style={{ fontSize: 11, lineHeight: 1.6, color: "#6b7a60", margin: "0 0 20px", textAlign: rtl ? "right" : "left", fontStyle: "italic" }}>
          {t("aboutMission")}
        </p>

        {/* Version */}
        <div style={{ fontSize: 10, color: "#9ca3af", marginBottom: 16 }}>
          v1.0.0
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            padding: "10px 32px", borderRadius: 12, border: "none",
            background: "linear-gradient(135deg,#f59e0b,#78350f)",
            color: "#fff", fontSize: 13, fontWeight: 800, cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          {t("closeHint").split(",")[0] || "OK"}
        </button>
      </div>
    </div>
  );
}

function CreatorCard({ name, icon }: { name: string; icon: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{
        width: 36, height: 36, borderRadius: "50%",
        background: "linear-gradient(135deg,#f59e0b,#d97706)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 18, flexShrink: 0,
        boxShadow: "0 2px 8px rgba(245,158,11,.3)",
      }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: 13, fontWeight: 800, color: "#3d3520" }}>{name}</div>
      </div>
    </div>
  );
}
