import { useState, useEffect } from "react";
import type { Language, ThemePalette, UserProfile, ClassRoom, ProgressMap } from "../../types";
import { translate, isRTL } from "../../services/i18nService";
import { getTeacherClasses, createClass, getClassStudents, removeStudentFromClass, loadUserProgress } from "../../services/firestoreService";
import { ACTIVITY_TEMPLATES } from "../../data/templates";

interface TeacherDashboardProps {
  profile: UserProfile;
  lang: Language;
  palette: ThemePalette;
  isDark: boolean;
  onBack: () => void;
}

export default function TeacherDashboard({ profile, lang, palette, isDark, onBack }: TeacherDashboardProps) {
  const t = (k: string) => translate(k, lang);
  const rtl = isRTL(lang);

  const [classes, setClasses] = useState<ClassRoom[]>([]);
  const [selectedClass, setSelectedClass] = useState<ClassRoom | null>(null);
  const [students, setStudents] = useState<(UserProfile & { progress?: ProgressMap })[]>([]);
  const [newClassName, setNewClassName] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    getTeacherClasses(profile.uid).then((c) => { setClasses(c); setLoading(false); }).catch(() => setLoading(false));
  }, [profile.uid]);

  async function handleCreateClass() {
    if (!newClassName.trim()) return;
    try {
      const cls = await createClass(profile.uid, profile.displayName, newClassName.trim());
      setClasses((prev) => [...prev, cls]);
      setNewClassName("");
      setMessage(t("classCreated"));
      setTimeout(() => setMessage(""), 2000);
    } catch { /* error */ }
  }

  async function handleSelectClass(cls: ClassRoom) {
    setSelectedClass(cls);
    const studs = await getClassStudents(cls.id);
    const withProgress = await Promise.all(
      studs.map(async (s) => {
        const progress = await loadUserProgress(s.uid);
        return { ...s, progress };
      })
    );
    setStudents(withProgress);
  }

  async function handleRemoveStudent(studentId: string) {
    if (!selectedClass) return;
    await removeStudentFromClass(selectedClass.id, studentId);
    setStudents((prev) => prev.filter((s) => s.uid !== studentId));
  }

  return (
    <div style={{ minHeight: "100vh", background: isDark ? "#1a1a1a" : "#f0ead6", fontFamily: "system-ui,sans-serif", direction: rtl ? "rtl" : "ltr" }}>
      {/* Header */}
      <div style={{ padding: "16px 20px", background: palette.panel, borderBottom: `2px solid ${palette.brd}`, display: "flex", alignItems: "center", gap: 12 }}>
        <button onClick={onBack} style={btnStyle(palette)}>{"← " + t("back")}</button>
        <h2 style={{ fontSize: 16, fontWeight: 900, color: palette.tx, margin: 0 }}>{"🎓 " + t("dashboard") + " — " + t("roleTeacher")}</h2>
      </div>

      <div style={{ maxWidth: 700, margin: "0 auto", padding: 20 }}>
        {message && <div style={{ background: "#dcfce7", border: "1px solid #86efac", borderRadius: 8, padding: "8px 12px", marginBottom: 12, fontSize: 12, color: "#16a34a", fontWeight: 700 }}>{message}</div>}

        {/* Create class */}
        <div style={{ background: "#fff", borderRadius: 12, padding: 16, marginBottom: 16, boxShadow: "0 2px 8px rgba(0,0,0,.06)" }}>
          <h3 style={{ fontSize: 13, fontWeight: 800, color: palette.tx, margin: "0 0 10px" }}>{t("createClass")}</h3>
          <div style={{ display: "flex", gap: 8 }}>
            <input value={newClassName} onChange={(e) => setNewClassName(e.target.value)} placeholder={t("className")} style={{ flex: 1, padding: "8px 12px", borderRadius: 8, border: `1px solid ${palette.brd}`, fontSize: 13, fontFamily: "inherit" }} onKeyDown={(e) => e.key === "Enter" && handleCreateClass()} />
            <button onClick={handleCreateClass} style={{ ...btnStyle(palette), background: "#f59e0b", color: "#fff", border: "none", fontWeight: 800 }}>{t("create")}</button>
          </div>
        </div>

        {/* Class list */}
        <div style={{ background: "#fff", borderRadius: 12, padding: 16, boxShadow: "0 2px 8px rgba(0,0,0,.06)" }}>
          <h3 style={{ fontSize: 13, fontWeight: 800, color: palette.tx, margin: "0 0 10px" }}>{t("myClasses")}</h3>
          {loading ? <p style={{ color: palette.sub, fontSize: 12 }}>...</p> :
            classes.length === 0 ? <p style={{ color: palette.sub, fontSize: 12 }}>{t("noStudents")}</p> :
              classes.map((cls) => (
                <div key={cls.id} onClick={() => handleSelectClass(cls)} style={{ padding: "10px 12px", borderRadius: 8, marginBottom: 6, cursor: "pointer", background: selectedClass?.id === cls.id ? "rgba(245,158,11,.1)" : isDark ? "rgba(255,255,255,.03)" : "rgba(0,0,0,.02)", border: selectedClass?.id === cls.id ? "2px solid #f59e0b" : `1px solid ${palette.brd}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 13, fontWeight: 800, color: palette.tx }}>{cls.name}</span>
                    <span style={{ fontSize: 10, fontWeight: 700, background: "#f59e0b", color: "#fff", padding: "2px 8px", borderRadius: 6, letterSpacing: 1 }}>{cls.code}</span>
                  </div>
                  <span style={{ fontSize: 10, color: palette.sub }}>{cls.studentIds.length + " " + t("students")}</span>
                </div>
              ))}
        </div>

        {/* Student progress */}
        {selectedClass && (
          <div style={{ background: "#fff", borderRadius: 12, padding: 16, marginTop: 16, boxShadow: "0 2px 8px rgba(0,0,0,.06)" }}>
            <h3 style={{ fontSize: 13, fontWeight: 800, color: palette.tx, margin: "0 0 4px" }}>{selectedClass.name} — {t("students")}</h3>
            <p style={{ fontSize: 10, color: palette.sub, margin: "0 0 10px" }}>{t("classCode")}: <b style={{ color: "#f59e0b", letterSpacing: 1 }}>{selectedClass.code}</b></p>

            {students.length === 0 ? <p style={{ color: palette.sub, fontSize: 12 }}>{t("noStudents")}</p> :
              students.map((s) => {
                const total = ACTIVITY_TEMPLATES.length;
                const done = s.progress ? Object.values(s.progress).filter((p) => p.done).length : 0;
                return (
                  <div key={s.uid} style={{ padding: "8px 10px", borderRadius: 8, marginBottom: 4, background: isDark ? "rgba(255,255,255,.03)" : "rgba(0,0,0,.02)", border: `1px solid ${palette.brd}`, display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: palette.tx }}>{s.displayName}</div>
                      <div style={{ fontSize: 10, color: palette.sub }}>{done}/{total} {t("completed")}</div>
                      <div style={{ height: 4, borderRadius: 2, background: "#e5e7eb", marginTop: 3 }}>
                        <div style={{ height: "100%", borderRadius: 2, background: "#22c55e", width: `${total ? (done / total) * 100 : 0}%` }} />
                      </div>
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); handleRemoveStudent(s.uid); }} style={{ padding: "3px 8px", borderRadius: 5, border: "1px solid #fecaca", background: "#fef2f2", color: "#dc2626", fontSize: 9, fontWeight: 700, cursor: "pointer" }}>{t("remove")}</button>
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
}

function btnStyle(palette: ThemePalette): React.CSSProperties {
  return { padding: "8px 14px", borderRadius: 8, border: `1px solid ${palette.brd}`, background: palette.bg, color: palette.tx, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" };
}
