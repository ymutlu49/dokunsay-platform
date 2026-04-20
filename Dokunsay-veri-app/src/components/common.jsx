import React from "react";
import { useA11y, useFS } from "../contexts/A11yContext.jsx";
import { speak } from "../utils/speech.js";
import { LEVEL_COLORS, P } from "../data/constants.js";
import { MODULE_INTROS } from "../data/activities.jsx";

export function SpeakButton({ text, size = "md", style }) {
  const { ttsOn, lang } = useA11y();
  if (!ttsOn || !text) return null;
  const btnSize = size === "sm" ? 22 : size === "lg" ? 34 : 28;
  const iconSize = size === "sm" ? 12 : size === "lg" ? 18 : 14;
  return (
    <button
      onClick={(e) => { e.stopPropagation(); speak(text, lang); }}
      aria-label={lang === "en" ? "Read aloud" : lang === "ku" ? "Bi deng bixwîne" : "Sesli oku"}
      title={lang === "en" ? "Read aloud" : lang === "ku" ? "Bi deng bixwîne" : "Sesli oku"}
      style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        width: btnSize, height: btnSize,
        borderRadius: "50%",
        border: "1.5px solid rgba(59,130,246,.3)",
        background: "rgba(59,130,246,.08)",
        color: "#3b82f6",
        cursor: "pointer", fontFamily: "inherit",
        verticalAlign: "middle",
        flexShrink: 0,
        padding: 0,
        transition: "all .15s",
        ...style,
      }}
      onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(59,130,246,.18)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(59,130,246,.08)"; }}
    >
      <svg viewBox="0 0 24 24" width={iconSize} height={iconSize} fill="currentColor">
        <path d="M3 10v4h4l5 5V5L7 10H3z"/>
        <path d="M16 8c1.5 1 2.5 2.5 2.5 4s-1 3-2.5 4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    </button>
  );
}

export function LevelBadge({ level, lang = "tr", compact = false }) {
  if (level == null) return null;
  const lv = LEVEL_COLORS[level];
  if (!lv) return null;
  const label = (lv.label[lang] || lv.label.tr);
  return (
    <span
      title={`L${level} — ${label}`}
      style={{
        display: "inline-flex", alignItems: "center", gap: 3,
        padding: compact ? "1px 6px" : "2px 8px",
        borderRadius: 10,
        background: lv.color + "20",
        color: lv.color,
        fontSize: compact ? 9 : 10, fontWeight: 800,
        border: "1px solid " + lv.color + "40",
        flexShrink: 0,
      }}>
      <span style={{ fontWeight: 900 }}>L{level}</span>
      {!compact && <span>· {label}</span>}
    </span>
  );
}

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, info: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // Konsola log (prod'da uzak telemetri eklenebilir)
    try {
      console.error("DokunSay Veri — beklenmeyen hata:", error);
      console.error("Bileşen stack:", info?.componentStack);
    } catch (e) {}
    this.setState({ info });
  }

  reset = () => {
    this.setState({ hasError: false, error: null, info: null });
  };

  reload = () => {
    if (typeof window !== "undefined") window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      const lang = this.props.lang || "tr";
      return (
        <div style={{
          minHeight: "100vh", width: "100vw",
          display: "flex", alignItems: "center", justifyContent: "center",
          background: "#f8fafc", padding: 20,
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}>
          <div style={{
            background: "#fff", borderRadius: 16,
            maxWidth: 480, width: "100%",
            boxShadow: "0 20px 60px rgba(0,0,0,.15)",
            overflow: "hidden",
          }}>
            <div style={{
              background: "linear-gradient(135deg, #ef4444, #dc2626)",
              padding: "28px 24px 22px",
              color: "#fff", textAlign: "center",
            }}>
              <div style={{ fontSize: 54, marginBottom: 6 }}>⚠️</div>
              <h2 style={{ fontSize: 18, fontWeight: 900, margin: 0 }}>
                {lang === "ku" ? "Tiştek ne baş bû"
                  : lang === "en" ? "Something went wrong"
                  : "Bir şey ters gitti"}
              </h2>
            </div>
            <div style={{ padding: "22px 24px" }}>
              <p style={{ fontSize: 13, color: "#475569", lineHeight: 1.65, margin: "0 0 14px" }}>
                {lang === "ku"
                  ? "Sepanê xeletiyeke neyînî dît. Verîyên te sax in. Ceriba tabê an sepanê ji nû ve bar bike."
                  : lang === "en"
                  ? "The app encountered an unexpected error. Your data is safe. Try this tab again or reload the app."
                  : "Uygulama beklenmeyen bir hata ile karşılaştı. Verilerin güvende. Bu sekmeyi yeniden dene veya uygulamayı yenile."}
              </p>
              {this.state.error?.message && (
                <details style={{
                  fontSize: 11, color: "#64748b",
                  background: "rgba(0,0,0,.03)",
                  padding: "8px 10px", borderRadius: 7,
                  marginBottom: 14, fontFamily: "monospace",
                }}>
                  <summary style={{ cursor: "pointer", fontWeight: 700 }}>
                    {lang === "en" ? "Technical detail" : lang === "ku" ? "Hûrgiliyên teknîkî" : "Teknik ayrıntı"}
                  </summary>
                  <div style={{ marginTop: 8, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                    {this.state.error.message}
                  </div>
                </details>
              )}
              <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                <button onClick={this.reset}
                  style={{
                    padding: "9px 16px", borderRadius: 8,
                    border: "1.5px solid rgba(30,41,59,.15)",
                    background: "#fff", color: "#64748b",
                    cursor: "pointer", fontFamily: "inherit",
                    fontSize: 12, fontWeight: 700,
                  }}>
                  {lang === "ku" ? "Ceriba ji Nû Ve" : lang === "en" ? "Try Again" : "Tekrar Dene"}
                </button>
                <button onClick={this.reload}
                  style={{
                    padding: "9px 18px", borderRadius: 8, border: "none",
                    background: "#ef4444", color: "#fff",
                    cursor: "pointer", fontFamily: "inherit",
                    fontSize: 12.5, fontWeight: 800,
                  }}>
                  🔄 {lang === "ku" ? "Sepan Nû Bike" : lang === "en" ? "Reload App" : "Uygulamayı Yenile"}
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export function ModuleIntroCard({ tabId, lang, onDismiss }) {
  const intro = MODULE_INTROS[tabId];
  if (!intro) return null;

  return (
    <div style={{
      padding: 16, borderRadius: 12,
      background: `linear-gradient(135deg, ${intro.color}10, ${intro.color}20)`,
      border: `2px solid ${intro.color}`,
      marginBottom: 16,
      position: "relative",
    }}>
      {/* Kapat butonu */}
      <button onClick={onDismiss} aria-label="Close" style={{
        position: "absolute", top: 8, right: 8,
        width: 26, height: 26, borderRadius: "50%",
        border: "none", background: "rgba(255,255,255,.7)",
        color: intro.color, cursor: "pointer",
        fontFamily: "inherit", fontSize: 14, fontWeight: 800,
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: "0 1px 3px rgba(0,0,0,.1)",
      }}>×</button>

      <div style={{ display: "flex", gap: 12, alignItems: "flex-start", paddingRight: 30 }}>
        <div style={{
          width: 44, height: 44, borderRadius: 11,
          background: `linear-gradient(135deg, ${intro.color}, ${intro.color}dd)`,
          color: "#fff", fontSize: 24,
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
          boxShadow: `0 3px 10px ${intro.color}55`,
        }}>{intro.icon}</div>
        <div style={{ flex: 1 }}>
          <h3 style={{
            fontSize: 14, fontWeight: 800, color: intro.color,
            margin: "0 0 6px 0", lineHeight: 1.3,
          }}>
            {intro.title[lang] || intro.title.tr}
          </h3>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
            <SpeakButton text={intro.body[lang] || intro.body.tr} size="sm"/>
            <p style={{
              flex: 1, fontSize: 11.5, color: "#1e293b",
              lineHeight: 1.6, margin: 0,
            }}>
              {intro.body[lang] || intro.body.tr}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function StatCard({ icon, label, value, color, fs }) {
  return (
    <div style={{
      padding: "10px 12px", borderRadius: 9,
      background: "#fff",
      border: `1.5px solid ${color}30`,
      borderLeft: `4px solid ${color}`,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
        <span style={{ fontSize: fs(14) }}>{icon}</span>
        <span style={{ fontSize: fs(9), fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: .4 }}>
          {label}
        </span>
      </div>
      <div style={{ fontSize: fs(18), fontWeight: 900, color }}>
        {value}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// TEST RESULT ROW — Bir ön/son test sonucunu özetleyen mini bileşen

export function TestResultRow({ label, result, color, lang, fs }) {
  if (!result) return null;
  const date = result.date ? new Date(result.date).toLocaleDateString(lang === "en" ? "en-US" : "tr-TR") : "";
  const recLv = LEVEL_COLORS[result.recommended];
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 8,
      padding: "6px 10px", borderRadius: 7,
      background: "rgba(0,0,0,.02)",
      border: "1px solid rgba(0,0,0,.05)",
    }}>
      <span style={{
        fontSize: fs(10), fontWeight: 800, color,
        minWidth: 70, flexShrink: 0,
      }}>
        {label}
      </span>
      <span style={{ fontSize: fs(9.5), color: "#64748b", fontStyle: "italic", minWidth: 72 }}>
        {date}
      </span>
      {/* Seviye bazlı mini barlar */}
      <div style={{ flex: 1, display: "flex", gap: 2 }}>
        {result.scores?.map((s, i) => {
          const lv = LEVEL_COLORS[s.level];
          const pct = (s.correct / s.total) * 100;
          return (
            <div key={i} title={`L${s.level}: ${s.correct}/${s.total}`}
              style={{
                flex: 1, height: 8, borderRadius: 2,
                background: "rgba(0,0,0,.06)", overflow: "hidden", position: "relative",
              }}>
              <div style={{
                position: "absolute", bottom: 0, left: 0,
                width: `${pct}%`, height: "100%",
                background: lv.color,
              }}/>
            </div>
          );
        })}
      </div>
      <span style={{
        fontSize: fs(10.5), fontWeight: 800, color: "#1e293b",
        minWidth: 36, textAlign: "right",
      }}>
        {result.totalCorrect}/{result.total}
      </span>
      {recLv && (
        <span style={{
          fontSize: fs(9), fontWeight: 800,
          color: recLv.color,
          background: recLv.color + "15",
          padding: "2px 7px", borderRadius: 8,
          flexShrink: 0,
        }}>
          L{result.recommended}
        </span>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// ÖĞRETMEN MODÜLÜ — Seviye detayı, ilerleme, gözlemler, testler

export function SettingToggle({ label, desc, checked, onChange }) {
  const fs = useFS();
  return (
    <label style={{
      display: "flex", alignItems: "center", gap: 12,
      padding: 14, borderRadius: 10,
      background: "#fff", border: "1px solid rgba(30,41,59,.08)",
      cursor: "pointer",
      transition: "all .12s",
    }}
      onMouseEnter={e => e.currentTarget.style.borderColor = P.accent}
      onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(30,41,59,.08)"}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={e => onChange(e.target.checked)}
        style={{ width: 18, height: 18, accentColor: P.accent, cursor: "pointer" }}
      />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: fs(13), fontWeight: 700, color: P.text }}>{label}</div>
        <div style={{ fontSize: fs(10), color: P.textSoft, marginTop: 2 }}>{desc}</div>
      </div>
    </label>
  );
}
