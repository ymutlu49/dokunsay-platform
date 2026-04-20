import type { Language } from "../../types";
import { translate, getThreeWord } from "../../services/i18nService";

interface EmptyStateProps {
  lang: Language;
  isDark: boolean;
}

export default function EmptyState({ lang, isDark }: EmptyStateProps) {
  return (
    <div
      style={{
        position: "absolute", top: "40%", left: "50%",
        transform: "translate(-50%,-50%)",
        textAlign: "center", pointerEvents: "none",
      }}
    >
      <svg
        width="80" height="80" viewBox="0 0 512 512"
        style={{
          borderRadius: 18, margin: "0 auto 12px", display: "block",
          boxShadow: "0 4px 20px rgba(0,0,0,.15)",
        }}
      >
        <rect width="512" height="512" rx="100" fill="none" />
        <circle cx="256" cy="258" r="138" fill="none" stroke="rgba(245,158,11,.3)" strokeWidth="3" strokeDasharray="9 8" />
        <path d="M185 170 L256 355" fill="none" stroke="rgba(245,158,11,.25)" strokeWidth="4" strokeLinecap="round" />
        <path d="M327 170 L256 355" fill="none" stroke="rgba(245,158,11,.25)" strokeWidth="4" strokeLinecap="round" />
        <path d="M183 163 L329 163" fill="none" stroke="rgba(245,158,11,.25)" strokeWidth="4" strokeLinecap="round" />
        <circle cx="180" cy="155" r="64" fill="#f59e0b" /><circle cx="180" cy="155" r="64" fill="none" stroke="#b45309" strokeWidth="5" />
        <circle cx="158" cy="148" r="11" fill="#000" /><circle cx="180" cy="148" r="11" fill="#000" /><circle cx="202" cy="148" r="11" fill="#000" />
        <circle cx="332" cy="155" r="64" fill="#d97706" /><circle cx="332" cy="155" r="64" fill="none" stroke="#92400e" strokeWidth="5" />
        <text x="332" y="175" textAnchor="middle" fontFamily="system-ui" fontSize="50" fontWeight="900" fill="#000">
          {getThreeWord(lang)}
        </text>
        <circle cx="256" cy="362" r="64" fill="#16a34a" /><circle cx="256" cy="362" r="64" fill="none" stroke="#064e3b" strokeWidth="5" />
        <text x="256" y="385" textAnchor="middle" fontFamily="system-ui" fontSize="58" fontWeight="900" fill="#000">3</text>
      </svg>
      <div
        style={{
          fontSize: 15, fontWeight: 800,
          color: isDark ? "rgba(255,255,255,.35)" : "rgba(60,50,30,.35)",
        }}
      >
        {translate("hint", lang)}
      </div>
    </div>
  );
}
