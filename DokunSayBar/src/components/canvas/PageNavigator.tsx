import type { Language, ThemePalette } from "../../types";
import type { PageData } from "../../state/appReducer";
import { translate } from "../../services/i18nService";

interface PageNavigatorProps {
  pages: PageData[];
  currentPage: number;
  lang: Language;
  palette: ThemePalette;
  isDark: boolean;
  onGotoPage: (index: number) => void;
  onAddPage: () => void;
  onDeletePage: (index: number) => void;
}

export default function PageNavigator({
  pages, currentPage, lang, palette, isDark,
  onGotoPage, onAddPage, onDeletePage,
}: PageNavigatorProps) {
  const t = (k: string) => translate(k, lang);

  return (
    <div style={{
      position: "absolute", bottom: 10, left: "50%", transform: "translateX(-50%)", zIndex: 9,
      display: "flex", alignItems: "center", gap: 4,
      background: isDark ? "rgba(0,0,0,.6)" : "rgba(255,255,255,.88)",
      backdropFilter: "blur(10px)",
      borderRadius: 12, padding: "5px 12px",
      boxShadow: "0 4px 16px rgba(0,0,0,.12)",
      border: `1px solid ${isDark ? "rgba(255,255,255,.12)" : "rgba(0,0,0,.08)"}`,
    }}>
      {/* Previous */}
      <button
        onClick={() => { if (currentPage > 0) onGotoPage(currentPage - 1); }}
        disabled={currentPage === 0}
        style={{
          width: 28, height: 28, borderRadius: 7, border: "none", cursor: currentPage === 0 ? "default" : "pointer",
          background: currentPage > 0 ? (isDark ? "rgba(255,255,255,.1)" : "rgba(0,0,0,.06)") : "transparent",
          color: palette.tx,
          fontSize: 16, fontWeight: 900,
          opacity: currentPage === 0 ? 0.2 : 0.8,
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "all .15s",
        }}
      >
        ◀
      </button>

      {/* Page dots/tabs */}
      <div style={{ display: "flex", gap: 3, alignItems: "center" }}>
        {pages.map((pg, i) => {
          const active = i === currentPage;
          const hasContent = pg.items.length > 0 || pg.lines.length > 0;
          return (
            <button
              key={i}
              onClick={() => onGotoPage(i)}
              title={pg.label || `${i + 1}`}
              style={{
                minWidth: active ? 28 : 20, height: 20,
                borderRadius: active ? 6 : 10,
                border: "none", cursor: "pointer",
                background: active ? "#f59e0b" : hasContent ? (isDark ? "rgba(255,255,255,.2)" : "rgba(0,0,0,.12)") : (isDark ? "rgba(255,255,255,.08)" : "rgba(0,0,0,.06)"),
                color: active ? "#fff" : palette.tx,
                fontSize: 9, fontWeight: active ? 900 : 600,
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all .15s",
                padding: "0 4px",
              }}
            >
              {active ? i + 1 : hasContent ? "●" : "○"}
            </button>
          );
        })}
      </div>

      {/* Page info */}
      <span style={{ fontSize: 11, fontWeight: 800, color: palette.tx, margin: "0 4px", whiteSpace: "nowrap" }}>
        <span style={{ color: "#f59e0b" }}>{currentPage + 1}</span>
        <span style={{ opacity: 0.4 }}> / {pages.length}</span>
      </span>

      {/* Next */}
      <button
        onClick={() => { if (currentPage < pages.length - 1) onGotoPage(currentPage + 1); }}
        disabled={currentPage === pages.length - 1}
        style={{
          width: 28, height: 28, borderRadius: 7, border: "none",
          cursor: currentPage === pages.length - 1 ? "default" : "pointer",
          background: currentPage < pages.length - 1 ? (isDark ? "rgba(255,255,255,.1)" : "rgba(0,0,0,.06)") : "transparent",
          color: palette.tx,
          fontSize: 16, fontWeight: 900,
          opacity: currentPage === pages.length - 1 ? 0.2 : 0.8,
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "all .15s",
        }}
      >
        ▶
      </button>

      {/* Separator */}
      <div style={{ width: 1, height: 16, background: isDark ? "rgba(255,255,255,.12)" : "rgba(0,0,0,.08)" }} />

      {/* Add page */}
      <button
        onClick={onAddPage}
        title={lang === "tr" ? "Yeni sayfa" : lang === "ku" ? "Rûpela nû" : "New page"}
        style={{
          width: 28, height: 28, borderRadius: 7, border: "none", cursor: "pointer",
          background: "rgba(34,197,94,.2)", color: "#16a34a",
          fontSize: 16, fontWeight: 900,
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "all .15s",
        }}
      >
        +
      </button>

      {/* Delete page (only if more than 1) */}
      {pages.length > 1 && (
        <button
          onClick={() => onDeletePage(currentPage)}
          title={lang === "tr" ? "Sayfayı sil" : lang === "ku" ? "Rûpelê jê bibe" : "Delete page"}
          style={{
            width: 28, height: 28, borderRadius: 7, border: "none", cursor: "pointer",
            background: "rgba(239,68,68,.12)", color: "#dc2626",
            fontSize: 14, fontWeight: 900,
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "all .15s",
          }}
        >
          ×
        </button>
      )}
    </div>
  );
}
