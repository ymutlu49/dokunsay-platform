import type { Language, ThemePalette, ToolType, GridType } from "../../types";
import { translate } from "../../services/i18nService";
import { PEN_COLORS, BG_PRESETS } from "../../constants/colors";
import { CHIP_PALETTE_SIZE } from "../../constants/dimensions";
import Chip from "../canvas/Chip";

interface BottomToolbarProps {
  lang: Language;
  palette: ThemePalette;
  isDark: boolean;
  tool: ToolType;
  penColor: string;
  penWidth: number;
  eraserWidth: number;
  textSize: number;
  textBold: boolean;
  gridType: GridType;
  bgColor: string;
  voiceOn: boolean;
  helpOpen: boolean;
  numPickerOpen: boolean;
  onAR3D: () => void;
  onARCamera: () => void;
  onSetTool: (tool: ToolType) => void;
  onSetPenColor: (color: string) => void;
  onSetPenWidth: (w: number) => void;
  onSetEraserWidth: (w: number) => void;
  onSetTextSize: (s: number) => void;
  onToggleTextBold: () => void;
  onSetGridType: (grid: GridType) => void;
  onSetBgColor: (color: string) => void;
  onToggleVoice: () => void;
  onToggleHelp: () => void;
  onToggleNumPicker: () => void;
  onPlaceChip: (color: "blue" | "red" | "green" | "yellow", label: string | null) => void;
}

const OPERATORS = ["+", "−", "×", "÷", "="];

export default function BottomToolbar(props: BottomToolbarProps) {
  const { lang, palette, tool, penColor, penWidth, eraserWidth, textSize, textBold, gridType, bgColor, voiceOn, helpOpen, numPickerOpen } = props;
  const dk = props.isDark;
  const t = (k: string) => translate(k, lang);

  // Shared styles
  const groupBg = dk ? "rgba(255,255,255,.06)" : "rgba(0,0,0,.04)";
  const groupBorder = dk ? "rgba(255,255,255,.08)" : "rgba(0,0,0,.06)";

  function toolBtn(active: boolean, extra?: React.CSSProperties): React.CSSProperties {
    return {
      padding: "6px 10px", borderRadius: 8, cursor: "pointer", border: "none",
      fontFamily: "inherit", fontSize: 10, fontWeight: 700,
      background: active ? "#f59e0b" : "transparent",
      color: active ? "#fff" : palette.tx,
      display: "flex", alignItems: "center", gap: 4,
      transition: "all .15s ease",
      ...extra,
    };
  }

  function iconBtn(active: boolean, extra?: React.CSSProperties): React.CSSProperties {
    return {
      width: 32, height: 32, borderRadius: 8, cursor: "pointer", border: "none",
      background: active ? "#f59e0b" : "transparent",
      color: active ? "#fff" : palette.tx,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: 14, transition: "all .15s ease",
      ...extra,
    };
  }

  return (
    <div
      className="ds-bar"
      style={{
        height: 52, minHeight: 52,
        background: palette.panel,
        borderTop: `1px solid ${palette.brd}`,
        display: "flex", alignItems: "center",
        padding: "0 10px", gap: 6,
      }}
    >
      {/* ═══ TOOLS GROUP ═══ */}
      <div style={{ display: "flex", gap: 2, padding: 3, borderRadius: 10, background: groupBg, border: `1px solid ${groupBorder}` }}>
        {([
          { t: "select" as const, icon: "👆", label: "sel" },
          { t: "pen" as const, icon: "✏️", label: "draw" },
          { t: "text" as const, icon: "𝐓", label: "write" },
          { t: "eraser" as const, icon: "⌫", label: "erase" },
        ]).map(({ t: tt, icon, label }) => (
          <button key={tt} title={t(label)} onClick={() => props.onSetTool(tt)} style={toolBtn(tool === tt)}>
            <span style={{ fontSize: 13 }}>{icon}</span>
            <span style={{ fontSize: 8, fontWeight: 800, letterSpacing: 0.3 }}>{t(label)}</span>
          </button>
        ))}
      </div>

      {/* ═══ PEN OPTIONS (color + width) ═══ */}
      {tool === "pen" && (
        <div style={{ display: "flex", gap: 4, alignItems: "center", padding: "3px 8px", borderRadius: 10, background: groupBg, border: `1px solid ${groupBorder}` }}>
          {PEN_COLORS.map((c) => (
            <div key={c} onClick={() => props.onSetPenColor(c)}
              style={{
                width: 18, height: 18, borderRadius: "50%", background: c, cursor: "pointer",
                border: penColor === c ? "2.5px solid #f59e0b" : "2px solid transparent",
                boxShadow: penColor === c ? "0 0 0 2px rgba(245,158,11,.3)" : "none",
                transition: "all .15s",
              }} />
          ))}
          <div style={{ width: 1, height: 18, background: groupBorder, margin: "0 2px" }} />
          {/* Pen width presets */}
          {[2, 4, 8, 14].map((w) => (
            <div key={w} onClick={() => props.onSetPenWidth(w)} title={`${w}px`}
              style={{
                width: 22, height: 22, borderRadius: 6, cursor: "pointer",
                background: penWidth === w ? "#f59e0b" : "transparent",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all .15s",
              }}>
              <div style={{ width: Math.min(w + 2, 14), height: Math.min(w + 2, 14), borderRadius: "50%", background: penWidth === w ? "#fff" : penColor }} />
            </div>
          ))}
        </div>
      )}

      {/* ═══ ERASER OPTIONS (width) ═══ */}
      {tool === "eraser" && (
        <div style={{ display: "flex", gap: 3, alignItems: "center", padding: "3px 8px", borderRadius: 10, background: groupBg, border: `1px solid ${groupBorder}` }}>
          <span style={{ fontSize: 8, fontWeight: 700, color: palette.sub }}>{t("erase")}:</span>
          {[10, 20, 40, 60].map((w) => (
            <div key={w} onClick={() => props.onSetEraserWidth(w)} title={`${w}px`}
              style={{
                width: 24, height: 24, borderRadius: 6, cursor: "pointer",
                background: eraserWidth === w ? "#f59e0b" : "transparent",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all .15s",
              }}>
              <div style={{
                width: Math.min(w / 3 + 4, 16), height: Math.min(w / 3 + 4, 16),
                borderRadius: 3,
                background: eraserWidth === w ? "#fff" : palette.tx,
                opacity: eraserWidth === w ? 1 : 0.4,
              }} />
            </div>
          ))}
        </div>
      )}

      {/* ═══ TEXT OPTIONS (color + size + bold) ═══ */}
      {tool === "text" && (
        <div style={{ display: "flex", gap: 4, alignItems: "center", padding: "3px 8px", borderRadius: 10, background: groupBg, border: `1px solid ${groupBorder}` }}>
          {PEN_COLORS.map((c) => (
            <div key={c} onClick={() => props.onSetPenColor(c)}
              style={{
                width: 16, height: 16, borderRadius: "50%", background: c, cursor: "pointer",
                border: penColor === c ? "2.5px solid #f59e0b" : "2px solid transparent",
                transition: "all .15s",
              }} />
          ))}
          <div style={{ width: 1, height: 18, background: groupBorder, margin: "0 2px" }} />
          {/* Text size */}
          {[14, 20, 28, 40].map((s) => (
            <button key={s} onClick={() => props.onSetTextSize(s)}
              style={{
                padding: "2px 6px", borderRadius: 5, border: "none", cursor: "pointer",
                background: textSize === s ? "#f59e0b" : "transparent",
                color: textSize === s ? "#fff" : palette.tx,
                fontSize: Math.max(s / 3, 8), fontWeight: 800,
                transition: "all .15s",
              }}>
              A
            </button>
          ))}
          <div style={{ width: 1, height: 18, background: groupBorder, margin: "0 2px" }} />
          {/* Bold toggle */}
          <button onClick={props.onToggleTextBold}
            style={{
              padding: "2px 8px", borderRadius: 5, border: "none", cursor: "pointer",
              background: textBold ? "#f59e0b" : "transparent",
              color: textBold ? "#fff" : palette.tx,
              fontSize: 11, fontWeight: 900, fontFamily: "serif",
              transition: "all .15s",
            }}>
            B
          </button>
        </div>
      )}

      {/* ═══ CHIPS GROUP ═══ */}
      <div style={{ display: "flex", gap: 3, alignItems: "center", padding: "3px 8px", borderRadius: 10, background: groupBg, border: `1px solid ${groupBorder}` }}>
        <div onClick={() => props.onPlaceChip("blue", null)} style={{ cursor: "pointer", transition: "transform .1s" }} title="Blue">
          <Chip color="blue" size={CHIP_PALETTE_SIZE} />
        </div>
        <div onClick={() => props.onPlaceChip("red", null)} style={{ cursor: "pointer" }} title="Red">
          <Chip color="red" size={CHIP_PALETTE_SIZE} />
        </div>

        {/* Green number picker */}
        <div style={{ position: "relative" }}>
          <div onClick={props.onToggleNumPicker}
            style={{
              display: "flex", alignItems: "center", gap: 4,
              padding: "3px 8px", borderRadius: 10, cursor: "pointer",
              background: numPickerOpen ? "#22c55e" : "transparent",
              transition: "all .15s",
            }}>
            <Chip color="green" label="n" size={16} />
            <span style={{ fontSize: 9, fontWeight: 800, color: numPickerOpen ? "#fff" : palette.tx }}>0–20</span>
          </div>
          {numPickerOpen && (
            <div style={{
              position: "absolute", bottom: "100%", left: "50%",
              transform: "translateX(-50%)", marginBottom: 8,
              padding: 10, borderRadius: 14,
              background: dk ? "#2a2a2a" : "#fff",
              border: `1px solid ${groupBorder}`,
              boxShadow: "0 12px 36px rgba(0,0,0,.2)",
              display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 5, zIndex: 1000,
            }}>
              {Array.from({ length: 21 }, (_, n) => (
                <div key={n} onClick={() => { props.onPlaceChip("green", String(n)); props.onToggleNumPicker(); }}
                  style={{ cursor: "pointer", transition: "transform .1s" }}>
                  <Chip color="green" label={String(n)} size={30} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Separator */}
        <div style={{ width: 1, height: 20, background: groupBorder }} />

        {/* Operators */}
        {OPERATORS.map((op) => (
          <div key={op} onClick={() => props.onPlaceChip("yellow", op)} style={{ cursor: "pointer" }} title={op}>
            <Chip color="yellow" label={op} size={CHIP_PALETTE_SIZE} />
          </div>
        ))}
      </div>

      {/* ═══ SPACER ═══ */}
      <div style={{ flex: 1 }} />

      {/* ═══ VIEW GROUP ═══ */}
      <div style={{ display: "flex", gap: 2, padding: 3, borderRadius: 10, background: groupBg, border: `1px solid ${groupBorder}` }}>
        {(["none", "square", "dot", "line"] as GridType[]).map((g) => {
          const icons: Record<GridType, string> = { none: "⊘", square: "⊞", dot: "⁙", line: "≡" };
          return (
            <button key={g} title={g} onClick={() => props.onSetGridType(g)} style={iconBtn(gridType === g, { width: 28, height: 28, fontSize: 13 })}>
              {icons[g]}
            </button>
          );
        })}

        <div style={{ width: 1, height: 20, background: groupBorder, margin: "0 2px" }} />

        {BG_PRESETS.map((c) => (
          <div key={c} onClick={() => props.onSetBgColor(c)}
            style={{
              width: 20, height: 20, borderRadius: 6, background: c, cursor: "pointer",
              border: bgColor === c ? "2.5px solid #f59e0b" : `1.5px solid ${c === "#ffffff" ? "#ccc" : dk ? "rgba(255,255,255,.15)" : "rgba(0,0,0,.1)"}`,
              boxShadow: bgColor === c ? "0 0 0 2px rgba(245,158,11,.3)" : "none",
              transition: "all .15s",
            }}
          />
        ))}
      </div>

      {/* ═══ AR GROUP ═══ */}
      <div style={{ display: "flex", gap: 2, padding: 3, borderRadius: 10, background: groupBg, border: `1px solid ${groupBorder}` }}>
        <button title={t("ar3D")} onClick={props.onAR3D}
          style={toolBtn(false, { padding: "5px 8px", background: "linear-gradient(135deg, rgba(99,102,241,.15), rgba(168,85,247,.15))", borderRadius: 8 })}>
          <span style={{ fontSize: 12 }}>🧊</span>
          <span style={{ fontSize: 8, fontWeight: 900 }}>3D</span>
        </button>
        <button title={t("arCamera")} onClick={props.onARCamera}
          style={toolBtn(false, { padding: "5px 8px", background: "linear-gradient(135deg, rgba(34,197,94,.15), rgba(16,185,129,.15))", borderRadius: 8 })}>
          <span style={{ fontSize: 12 }}>📸</span>
          <span style={{ fontSize: 8, fontWeight: 900 }}>AR</span>
        </button>
      </div>

      {/* ═══ UTILITY GROUP ═══ */}
      <div style={{ display: "flex", gap: 1, padding: 3, borderRadius: 10, background: groupBg, border: `1px solid ${groupBorder}` }}>
        <button title="Tam ekran" onClick={() => {
          if (document.fullscreenElement) document.exitFullscreen();
          else document.documentElement.requestFullscreen();
        }} style={iconBtn(false, { width: 28, height: 28 })}>
          ⛶
        </button>
        <button
          title={voiceOn ? t("voiceOff") : t("voiceOn")}
          onClick={props.onToggleVoice}
          style={iconBtn(voiceOn, {
            width: 28, height: 28,
            background: voiceOn ? "#dc2626" : "transparent",
            color: voiceOn ? "#fff" : palette.tx,
            animation: voiceOn ? "dsPulse 1.5s ease infinite" : "none",
          })}
        >
          🎤
        </button>
        <button title={t("help")} onClick={props.onToggleHelp} style={iconBtn(helpOpen, { width: 28, height: 28, fontSize: 12, fontWeight: 900 })}>
          ?
        </button>
      </div>
    </div>
  );
}
