import type { Language, ThemePalette } from "../../types";
import { translate } from "../../services/i18nService";
import { sfx } from "../../services/audioService";

interface SidebarFooterProps {
  lang: Language;
  palette: ThemePalette;
  isDark: boolean;
  showLabels: boolean;
  showNumberLine: boolean;
  covered: boolean;
  canUndo: boolean;
  canRedo: boolean;
  selectedRodValue: number | null;
  onUndo: () => void;
  onRedo: () => void;
  onToggleLabels: () => void;
  onToggleNumberLine: () => void;
  onToggleCover: () => void;
  onSave: () => void;
  onLoad: () => void;
  onExportPng: () => void;
  onPrint: () => void;
  onClear: () => void;
  onAbout: () => void;
}

export default function SidebarFooter({
  lang, palette, isDark, showLabels, showNumberLine, covered,
  canUndo, canRedo, selectedRodValue,
  onUndo, onRedo, onToggleLabels, onToggleNumberLine,
  onToggleCover, onSave, onLoad, onExportPng, onPrint, onClear, onAbout,
}: SidebarFooterProps) {
  const t = (k: string) => translate(k, lang);

  const groupBg = isDark ? "rgba(255,255,255,.05)" : "rgba(0,0,0,.03)";
  const groupBorder = isDark ? "rgba(255,255,255,.08)" : "rgba(0,0,0,.06)";

  function tb(active: boolean, extra?: React.CSSProperties): React.CSSProperties {
    return {
      padding: "4px 8px", borderRadius: 7, cursor: "pointer", border: "none",
      fontFamily: "inherit", fontSize: 8, fontWeight: 700,
      background: active ? "#f59e0b" : "transparent",
      color: active ? "#fff" : palette.tx,
      display: "flex", alignItems: "center", gap: 3,
      transition: "all .15s ease",
      opacity: extra?.opacity ?? 1,
      ...extra,
    };
  }

  function ib(extra?: React.CSSProperties): React.CSSProperties {
    return {
      width: 26, height: 26, borderRadius: 7, cursor: "pointer", border: "none",
      background: "transparent", color: palette.tx,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: 13, transition: "all .15s ease",
      ...extra,
    };
  }

  return (
    <div style={{
      padding: "6px 8px",
      borderTop: `1px solid ${isDark ? "rgba(255,255,255,.06)" : "rgba(0,0,0,.06)"}`,
      display: "flex", flexDirection: "column", gap: 5,
    }}>
      {/* Row 1: History + Canvas toggles */}
      <div style={{ display: "flex", gap: 4 }}>
        {/* Undo/Redo */}
        <div style={{ display: "flex", gap: 1, padding: 2, borderRadius: 8, background: groupBg, border: `1px solid ${groupBorder}` }}>
          <button title={t("undo")} onClick={onUndo} style={tb(false, { opacity: canUndo ? 1 : 0.3 })}>
            <span style={{ fontSize: 11 }}>↩</span> {t("undo")}
          </button>
          <button title={t("redo")} onClick={onRedo} style={tb(false, { opacity: canRedo ? 1 : 0.3 })}>
            <span style={{ fontSize: 11 }}>↪</span> {t("redo")}
          </button>
        </div>

        {/* View toggles */}
        <div style={{ display: "flex", gap: 1, padding: 2, borderRadius: 8, background: groupBg, border: `1px solid ${groupBorder}`, flex: 1 }}>
          <button title={t("labels")} onClick={onToggleLabels} style={tb(showLabels)}>
            <span style={{ fontSize: 9, fontWeight: 900, fontFamily: "monospace" }}>123</span>
          </button>
          <button title={t("nlDesc")} onClick={onToggleNumberLine} style={tb(showNumberLine)}>
            <svg width="14" height="10" viewBox="0 0 14 10" style={{ flexShrink: 0 }}>
              <line x1="1" y1="5" x2="13" y2="5" stroke="currentColor" strokeWidth="1.5" />
              <line x1="1" y1="2" x2="1" y2="8" stroke="currentColor" strokeWidth="1" />
              <line x1="4.5" y1="3.5" x2="4.5" y2="6.5" stroke="currentColor" strokeWidth="0.7" />
              <line x1="8" y1="3.5" x2="8" y2="6.5" stroke="currentColor" strokeWidth="0.7" />
              <line x1="13" y1="2" x2="13" y2="8" stroke="currentColor" strokeWidth="1" />
            </svg>
          </button>
          <button
            title={covered ? t("reveal") : t("cover")}
            onClick={onToggleCover}
            style={tb(covered, {
              background: covered ? "#dc2626" : "transparent",
              color: covered ? "#fff" : palette.tx,
            })}
          >
            {covered ? "👁" : "🙈"}
          </button>
        </div>
      </div>

      {/* Row 2: File operations */}
      <div style={{ display: "flex", gap: 1, padding: 2, borderRadius: 8, background: groupBg, border: `1px solid ${groupBorder}`, flexWrap: "wrap" }}>
        <button title={t("note")} onClick={() => { if (selectedRodValue) sfx.note(selectedRodValue); }} style={ib()}>🎵</button>
        <button title={t("save")} onClick={onSave} style={ib()}>💾</button>
        <button title={t("load")} onClick={onLoad} style={ib()}>📂</button>
        <button title={t("png")} onClick={onExportPng} style={ib()}>📷</button>
        <button title={t("print")} onClick={onPrint} style={ib()}>🖨</button>
        <button title={t("clear")} onClick={onClear} style={ib({ color: "#dc2626" })}>🗑</button>
      </div>

      {/* Row 3: About */}
      <button title={t("about")} onClick={onAbout}
        style={{
          width: "100%", padding: "4px 0", borderRadius: 8, border: "none", cursor: "pointer",
          background: groupBg, color: palette.sub,
          fontSize: 8, fontWeight: 700, fontFamily: "inherit",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 4,
          transition: "all .15s",
        }}>
        <span style={{ fontSize: 10 }}>ℹ️</span> {t("about")}
      </button>
    </div>
  );
}
