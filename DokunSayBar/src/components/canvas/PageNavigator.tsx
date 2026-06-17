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

  const PAGE_LABEL: Record<Language, string> = { tr: "Sayfa", ku: "Rûpel", en: "Page", ar: "صفحة", fa: "صفحه" };
  const PREV_LABEL: Record<Language, string> = { tr: "Önceki sayfa", ku: "Rûpela berê", en: "Previous page", ar: "الصفحة السابقة", fa: "صفحه قبلی" };
  const NEXT_LABEL: Record<Language, string> = { tr: "Sonraki sayfa", ku: "Rûpela paşê", en: "Next page", ar: "الصفحة التالية", fa: "صفحه بعدی" };
  const ADD_LABEL: Record<Language, string> = { tr: "Yeni sayfa ekle", ku: "Rûpela nû lê zêde bike", en: "Add new page", ar: "إضافة صفحة جديدة", fa: "افزودن صفحه جدید" };
  const DEL_LABEL: Record<Language, string> = { tr: "Sayfayı sil", ku: "Rûpelê jê bibe", en: "Delete page", ar: "حذف الصفحة", fa: "حذف صفحه" };
  const GOTO_LABEL: Record<Language, (n: number) => string> = {
    tr: (n) => `Sayfa ${n}'e git`,
    ku: (n) => `Biçe rûpela ${n}`,
    en: (n) => `Go to page ${n}`,
    ar: (n) => `اذهب إلى الصفحة ${n}`,
    fa: (n) => `برو به صفحه ${n}`,
  };

  return (
    <nav
      aria-label={PAGE_LABEL[lang] || PAGE_LABEL.tr}
      style={{
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
        aria-label={PREV_LABEL[lang] || PREV_LABEL.tr}
        title={PREV_LABEL[lang] || PREV_LABEL.tr}
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
              aria-label={GOTO_LABEL[lang](i + 1) + (active ? ` (${(PAGE_LABEL[lang] || PAGE_LABEL.tr).toLowerCase()} ${i + 1}/${pages.length})` : "")}
              aria-current={active ? "page" : undefined}
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
      <span
        style={{ fontSize: 11, fontWeight: 800, color: palette.tx, margin: "0 4px", whiteSpace: "nowrap" }}
        aria-live="polite"
        aria-atomic="true"
      >
        <span style={{ color: "#f59e0b" }} data-numeric="true">{currentPage + 1}</span>
        <span style={{ opacity: 0.4 }} data-numeric="true"> / {pages.length}</span>
      </span>

      {/* Next */}
      <button
        onClick={() => { if (currentPage < pages.length - 1) onGotoPage(currentPage + 1); }}
        disabled={currentPage === pages.length - 1}
        aria-label={NEXT_LABEL[lang] || NEXT_LABEL.tr}
        title={NEXT_LABEL[lang] || NEXT_LABEL.tr}
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
        aria-label={ADD_LABEL[lang] || ADD_LABEL.tr}
        title={ADD_LABEL[lang] || ADD_LABEL.tr}
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
          aria-label={DEL_LABEL[lang] || DEL_LABEL.tr}
          title={DEL_LABEL[lang] || DEL_LABEL.tr}
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
    </nav>
  );
}
