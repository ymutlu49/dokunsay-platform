import type { Language, ThemePalette, Template, ProgressMap } from "../../types";
import { translate, getTemplateName } from "../../services/i18nService";
import { ACTIVITY_TEMPLATES, ACTIVITY_CATEGORIES } from "../../data/templates";

interface ActivitiesTabProps {
  lang: Language;
  palette: ThemePalette;
  isDark: boolean;
  activeTpl: Template | null;
  teacherMode: boolean;
  progress: ProgressMap;
  customTemplates: Template[];
  hasItems: boolean;
  onLoadTemplate: (tpl: Template) => void;
  onToggleTeacherMode: () => void;
  onSaveCustomTemplate: () => void;
  onSpeakInstruction: () => void;
  onCheckActivity: () => void;
}

function buttonStyle(active: boolean, palette: ThemePalette, extra?: React.CSSProperties) {
  return {
    padding: "4px 8px", borderRadius: 5, cursor: "pointer",
    fontFamily: "inherit", fontSize: 9, fontWeight: 700,
    background: active ? "#f59e0b" : palette.bg,
    border: active ? "2px solid #78350f" : `1px solid ${palette.brd}`,
    color: active ? "#fff" : palette.tx,
    transition: "all .1s ease",
    ...extra,
  } as React.CSSProperties;
}

export default function ActivitiesTab({
  lang, palette, isDark, activeTpl, teacherMode,
  progress, customTemplates, hasItems,
  onLoadTemplate, onToggleTeacherMode, onSaveCustomTemplate,
  onSpeakInstruction, onCheckActivity,
}: ActivitiesTabProps) {
  const t = (k: string) => translate(k, lang);

  const allCategories = customTemplates.length
    ? [...ACTIVITY_CATEGORIES, "custom" as const]
    : [...ACTIVITY_CATEGORIES];

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "4px 6px" }}>
      {/* Teacher mode toggle */}
      <div style={{ display: "flex", gap: 3, margin: "4px 0 6px" }}>
        <button
          onClick={onToggleTeacherMode}
          style={buttonStyle(teacherMode, palette, {
            flex: 1, fontSize: 8,
            background: teacherMode ? "#7c3aed" : palette.bg,
            color: teacherMode ? "#fff" : palette.tx,
            border: teacherMode ? "2px solid #5b21b6" : `1px solid ${palette.brd}`,
          })}
        >
          {teacherMode ? `🎓 ${t("teacherMode")}` : `👨‍🎓 ${t("studentMode")}`}
        </button>
      </div>

      {/* Template categories */}
      {allCategories.map((cat) => {
        const templates = cat === "custom"
          ? customTemplates
          : ACTIVITY_TEMPLATES.filter((x) => x.cat === cat);
        if (!templates.length) return null;

        return (
          <div key={cat}>
            <div style={{
              fontSize: 7, fontWeight: 800, textTransform: "uppercase",
              letterSpacing: 1,
              color: cat === "custom" ? "#7c3aed" : palette.sub,
              margin: "6px 0 2px",
            }}>
              {cat === "custom" ? t("custom") : t(cat)}
            </div>
            {templates.map((tp, i) => {
              const isActive = activeTpl?.n === tp.n;
              const isDone = progress[tp.n]?.done;
              return (
                <button
                  key={cat + i}
                  onClick={() => onLoadTemplate(tp)}
                  style={{
                    display: "flex", alignItems: "center", gap: 4,
                    padding: "3px 6px", width: "100%",
                    background: isActive ? "rgba(245,158,11,.15)" : palette.bg,
                    border: isActive ? "2px solid #f59e0b" : `1px solid ${palette.brd}`,
                    borderRadius: 5, cursor: "pointer", fontFamily: "inherit",
                    textAlign: "left", color: palette.tx, marginBottom: 1,
                    fontSize: 9, fontWeight: isActive ? 900 : 700,
                  }}
                >
                  {isDone && <span style={{ fontSize: 10, color: "#16a34a", flexShrink: 0 }}>✅</span>}
                  <span style={{ fontSize: 11, flexShrink: 0 }}>{tp.i}</span>
                  <span style={{ flex: 1, opacity: isDone ? 0.7 : 1 }}>
                    {getTemplateName(tp, lang)}
                  </span>
                  <span style={{ fontSize: 7, color: "#d97706", flexShrink: 0, letterSpacing: -1 }}>
                    {"★".repeat(tp.diff || 1) + "☆".repeat(3 - (tp.diff || 1))}
                  </span>
                </button>
              );
            })}
          </div>
        );
      })}

      {/* Save custom template */}
      {teacherMode && hasItems && (
        <button
          onClick={onSaveCustomTemplate}
          style={buttonStyle(false, palette, {
            width: "100%", margin: "8px 0",
            background: "#7c3aed", color: "#fff",
            border: "2px solid #5b21b6", fontSize: 10,
          })}
        >
          {"📝 " + t("saveTpl")}
        </button>
      )}

      {/* Active template panel */}
      {activeTpl && (
        <div style={{
          margin: "8px 0 4px", padding: 6, borderRadius: 8,
          background: isDark ? "rgba(255,255,255,.05)" : "rgba(245,158,11,.08)",
          border: "1px solid rgba(245,158,11,.2)",
        }}>
          <div style={{ fontSize: 8, fontWeight: 800, color: "#d97706", marginBottom: 4 }}>
            {activeTpl.i + " " + getTemplateName(activeTpl, lang)}
          </div>
          <div style={{ display: "flex", gap: 3 }}>
            <button onClick={onSpeakInstruction} style={buttonStyle(false, palette, { flex: 1, fontSize: 8 })}>
              {"🔊 " + t("read")}
            </button>
            {activeTpl.chk !== "none" && (
              <button
                onClick={onCheckActivity}
                style={buttonStyle(false, palette, {
                  flex: 1, fontSize: 8,
                  background: "#22c55e", color: "#fff",
                  border: "2px solid #15803d",
                })}
              >
                {"✓ " + t("check")}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Progress summary */}
      {Object.keys(progress).length > 0 && (
        <div style={{
          margin: "8px 0 4px", padding: 6, borderRadius: 8,
          background: isDark ? "rgba(255,255,255,.03)" : "rgba(22,163,74,.06)",
          border: "1px solid rgba(22,163,74,.15)",
        }}>
          <div style={{ fontSize: 8, fontWeight: 800, color: "#16a34a", marginBottom: 2 }}>
            {"📊 " + t("progress")}
          </div>
          <div style={{ fontSize: 10, fontWeight: 700, color: palette.tx }}>
            {Object.keys(progress).length + " / " +
              (ACTIVITY_TEMPLATES.length + customTemplates.length) + " " +
              t("completed")}
          </div>
        </div>
      )}
    </div>
  );
}
