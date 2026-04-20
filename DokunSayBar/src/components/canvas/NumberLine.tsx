import { useState, useRef, useCallback } from "react";
import { CELL_SIZE } from "../../constants/dimensions";
import { translate } from "../../services/i18nService";
import type { Language } from "../../types";

interface NumberLineProps {
  lang: Language;
  isDark: boolean;
}

/** Range options for the number line */
const RANGE_OPTIONS = [
  { label: "0–10", min: 0, max: 10 },
  { label: "0–20", min: 0, max: 20 },
  { label: "0–30", min: 0, max: 30 },
  { label: "0–50", min: 0, max: 50 },
  { label: "0–100", min: 0, max: 100 },
];

export default function NumberLine({ lang, isDark }: NumberLineProps) {
  const [pos, setPos] = useState({ x: 12, y: -1 }); // y=-1 means auto-bottom
  const [dragging, setDragging] = useState(false);
  const [rangeIdx, setRangeIdx] = useState(1); // default 0–20
  const [showJumps, setShowJumps] = useState(false);
  const [jumpFrom, setJumpFrom] = useState<number | null>(null);
  const [jumpTo, setJumpTo] = useState<number | null>(null);
  const [minimized, setMinimized] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  const range = RANGE_OPTIONS[rangeIdx];
  const tickCount = range.max - range.min + 1;

  // For ranges > 20, use smaller spacing
  const spacing = range.max <= 20 ? CELL_SIZE : range.max <= 50 ? 24 : 12;
  const totalWidth = (tickCount - 1) * spacing + CELL_SIZE;
  const svgHeight = 44;

  const lineColor = isDark ? "rgba(255,255,255,.35)" : "rgba(60,40,20,.45)";
  const textColor = isDark ? "rgba(255,255,255,.55)" : "rgba(60,40,20,.6)";
  const bgColor = isDark ? "rgba(0,0,0,.45)" : "rgba(255,255,255,.75)";
  const accentColor = "#f59e0b";
  const jumpColor = "#3b82f6";

  // ===== Dragging =====
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest("[data-nl-control]")) return; // skip controls
    e.stopPropagation();
    e.preventDefault();
    const el = (e.target as HTMLElement).closest("[data-numberline]");
    if (!el) return;
    const rect = el.getBoundingClientRect();
    dragOffset.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    setDragging(true);

    const onMove = (ev: PointerEvent) => {
      const parent = el.parentElement;
      if (!parent) return;
      const pr = parent.getBoundingClientRect();
      setPos({
        x: ev.clientX - pr.left - dragOffset.current.x,
        y: ev.clientY - pr.top - dragOffset.current.y,
      });
    };
    const onUp = () => {
      setDragging(false);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  }, []);

  // ===== Jump arc (click on tick to set from/to) =====
  const handleTickClick = useCallback((value: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!showJumps) return;
    if (jumpFrom === null) {
      setJumpFrom(value);
    } else {
      setJumpTo(value);
      // Auto-reset after showing
      setTimeout(() => { setJumpFrom(null); setJumpTo(null); }, 4000);
    }
  }, [showJumps, jumpFrom]);

  const clearJumps = useCallback(() => {
    setJumpFrom(null);
    setJumpTo(null);
  }, []);

  const t = (k: string) => translate(k, lang);
  const autoBottom = pos.y < 0;

  return (
    <div
      data-numberline
      onPointerDown={handlePointerDown}
      style={{
        position: "absolute",
        ...(autoBottom ? { bottom: 8, left: pos.x } : { top: pos.y, left: pos.x }),
        zIndex: 8,
        background: bgColor,
        borderRadius: 12,
        padding: minimized ? "4px 10px" : "6px 10px 4px",
        boxShadow: dragging ? "0 8px 24px rgba(0,0,0,.25)" : "0 2px 12px rgba(0,0,0,.1)",
        border: `1.5px solid ${isDark ? "rgba(255,255,255,.12)" : "rgba(0,0,0,.08)"}`,
        cursor: dragging ? "grabbing" : "grab",
        touchAction: "none",
        transition: dragging ? "none" : "box-shadow .2s",
        userSelect: "none",
      }}
    >
      {/* Header: title + controls */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: minimized ? 0 : 4 }}>
        {/* Drag handle */}
        <span style={{ fontSize: 10, opacity: 0.4, cursor: "grab" }}>⠿</span>

        <span style={{ fontSize: 8, fontWeight: 800, color: textColor, flex: 1 }}>
          {t("nlDesc")}
        </span>

        {/* Range selector */}
        {!minimized && (
          <div data-nl-control style={{ display: "flex", gap: 2 }}>
            {RANGE_OPTIONS.map((opt, i) => (
              <button
                key={opt.label}
                onClick={(e) => { e.stopPropagation(); setRangeIdx(i); clearJumps(); }}
                style={{
                  padding: "1px 5px", borderRadius: 4, border: "none", cursor: "pointer",
                  fontSize: 7, fontWeight: 700, fontFamily: "inherit",
                  background: rangeIdx === i ? accentColor : "transparent",
                  color: rangeIdx === i ? "#fff" : textColor,
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}

        {/* Jump toggle */}
        {!minimized && (
          <button
            data-nl-control
            onClick={(e) => { e.stopPropagation(); setShowJumps(!showJumps); clearJumps(); }}
            title="Jump arcs"
            style={{
              padding: "1px 5px", borderRadius: 4, border: "none", cursor: "pointer",
              fontSize: 9, fontWeight: 800, fontFamily: "inherit",
              background: showJumps ? jumpColor : "transparent",
              color: showJumps ? "#fff" : textColor,
            }}
          >
            ⌒
          </button>
        )}

        {/* Minimize */}
        <button
          data-nl-control
          onClick={(e) => { e.stopPropagation(); setMinimized(!minimized); }}
          style={{
            padding: "0 4px", borderRadius: 3, border: "none", cursor: "pointer",
            fontSize: 10, fontWeight: 900, fontFamily: "inherit",
            background: "transparent", color: textColor, lineHeight: 1,
          }}
        >
          {minimized ? "▦" : "—"}
        </button>
      </div>

      {/* Number line SVG */}
      {!minimized && (
        <div style={{ overflowX: "auto", overflowY: "hidden", maxWidth: "min(85vw, 1000px)" }}>
          <svg width={totalWidth} height={svgHeight} style={{ display: "block", overflow: "visible" }}>
            {/* Main line */}
            <line
              x1={spacing / 2} y1={18}
              x2={(tickCount - 1) * spacing + spacing / 2} y2={18}
              stroke={lineColor} strokeWidth={2.5} strokeLinecap="round"
            />

            {/* Arrows at ends */}
            <polygon
              points={`${spacing / 2 - 6},18 ${spacing / 2},14 ${spacing / 2},22`}
              fill={lineColor}
            />
            <polygon
              points={`${(tickCount - 1) * spacing + spacing / 2 + 6},18 ${(tickCount - 1) * spacing + spacing / 2},14 ${(tickCount - 1) * spacing + spacing / 2},22`}
              fill={lineColor}
            />

            {/* Ticks */}
            {Array.from({ length: tickCount }, (_, i) => {
              const value = range.min + i;
              const x = i * spacing + spacing / 2;
              const major = value % 5 === 0;
              const isTen = value % 10 === 0;
              const isJumpEnd = value === jumpFrom || value === jumpTo;

              // For large ranges, only show labels at 5s or 10s
              const showLabel = range.max <= 20 || (range.max <= 50 ? major : isTen);
              const showTick = range.max <= 50 || major;

              if (!showTick && !isTen) return null;

              return (
                <g key={i}>
                  <line
                    x1={x} y1={isTen ? 4 : major ? 8 : 11}
                    x2={x} y2={isTen ? 32 : major ? 28 : 25}
                    stroke={isJumpEnd ? jumpColor : lineColor}
                    strokeWidth={isTen ? 2.5 : major ? 1.5 : 0.8}
                  />
                  {showLabel && (
                    <text
                      x={x} y={svgHeight}
                      textAnchor="middle"
                      fontSize={isTen ? 12 : major ? 9 : 7}
                      fontWeight={isTen ? 900 : major ? 700 : 500}
                      fill={isJumpEnd ? jumpColor : textColor}
                      style={{ cursor: showJumps ? "pointer" : "default" }}
                      onClick={(e) => handleTickClick(value, e)}
                    >
                      {value}
                    </text>
                  )}

                  {/* Highlight circle for jump endpoints */}
                  {isJumpEnd && (
                    <circle cx={x} cy={18} r={6} fill={jumpColor} opacity={0.25} />
                  )}
                </g>
              );
            })}

            {/* Jump arc */}
            {jumpFrom !== null && jumpTo !== null && (
              (() => {
                const fromX = (jumpFrom - range.min) * spacing + spacing / 2;
                const toX = (jumpTo - range.min) * spacing + spacing / 2;
                const midX = (fromX + toX) / 2;
                const arcHeight = Math.min(Math.abs(toX - fromX) * 0.4, 60);
                const diff = jumpTo - jumpFrom;

                return (
                  <g>
                    <path
                      d={`M${fromX},16 Q${midX},${16 - arcHeight} ${toX},16`}
                      fill="none" stroke={jumpColor} strokeWidth={2.5}
                      strokeDasharray="5 3" strokeLinecap="round"
                    />
                    {/* Arrow head */}
                    <polygon
                      points={`${toX},12 ${toX + (diff > 0 ? -5 : 5)},8 ${toX + (diff > 0 ? -5 : 5)},16`}
                      fill={jumpColor}
                    />
                    {/* Jump label */}
                    <rect
                      x={midX - 14} y={16 - arcHeight - 16}
                      width={28} height={16} rx={4}
                      fill={jumpColor}
                    />
                    <text
                      x={midX} y={16 - arcHeight - 5}
                      textAnchor="middle" fontSize={10} fontWeight={900} fill="#fff"
                    >
                      {diff > 0 ? `+${diff}` : String(diff)}
                    </text>
                  </g>
                );
              })()
            )}
          </svg>
        </div>
      )}

      {/* Jump instruction */}
      {!minimized && showJumps && jumpFrom === null && (
        <div style={{ fontSize: 7, color: jumpColor, textAlign: "center", marginTop: 2, fontWeight: 700 }}>
          {lang === "tr" ? "Başlangıç noktasına tıkla" :
           lang === "ku" ? "Li xala destpêkê bitikîne" :
           lang === "ar" ? "انقر على نقطة البداية" :
           lang === "fa" ? "روی نقطه شروع کلیک کن" :
           "Click the start point"}
        </div>
      )}
      {!minimized && showJumps && jumpFrom !== null && jumpTo === null && (
        <div style={{ fontSize: 7, color: jumpColor, textAlign: "center", marginTop: 2, fontWeight: 700 }}>
          {lang === "tr" ? `${jumpFrom}'dan nereye? Bitiş noktasına tıkla` :
           lang === "ku" ? `Ji ${jumpFrom} ber bi ku? Li xala dawiyê bitikîne` :
           lang === "ar" ? `من ${jumpFrom} إلى أين؟ انقر على نقطة النهاية` :
           lang === "fa" ? `از ${jumpFrom} به کجا؟ روی نقطه پایان کلیک کن` :
           `From ${jumpFrom} to where? Click the end point`}
        </div>
      )}
    </div>
  );
}
