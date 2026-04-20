import { useState, useEffect } from "react";
import type { Language, ThemePalette, UserProfile, ProgressMap } from "../../types";
import { translate, isRTL } from "../../services/i18nService";
import { findStudentByCode, linkParentToStudent, getChildrenProgress, loadUserProgress } from "../../services/firestoreService";
import { ACTIVITY_TEMPLATES } from "../../data/templates";

interface ParentDashboardProps {
  profile: UserProfile;
  lang: Language;
  palette: ThemePalette;
  isDark: boolean;
  onBack: () => void;
}

export default function ParentDashboard({ profile, lang, palette, isDark, onBack }: ParentDashboardProps) {
  const t = (k: string) => translate(k, lang);
  const rtl = isRTL(lang);

  const [children, setChildren] = useState<{ profile: UserProfile; progress: ProgressMap }[]>([]);
  const [childCode, setChildCode] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    getChildrenProgress(profile.uid).then((c) => { setChildren(c); setLoading(false); }).catch(() => setLoading(false));
  }, [profile.uid]);

  async function handleLinkChild() {
    if (!childCode.trim()) return;
    setError("");
    setMessage("");
    try {
      const student = await findStudentByCode(childCode.trim());
      if (!student) { setError(t("invalidCode")); return; }
      if (profile.parentOf.includes(student.uid)) { setError(t("alreadyLinked")); return; }
      await linkParentToStudent(profile.uid, student.uid);
      const progress = await loadUserProgress(student.uid);
      setChildren((prev) => [...prev, { profile: student, progress }]);
      setChildCode("");
      setMessage(t("childLinked"));
      setTimeout(() => setMessage(""), 2000);
    } catch { setError(t("authErrorGeneric")); }
  }

  return (
    <div style={{ minHeight: "100vh", background: isDark ? "#1a1a1a" : "#f0ead6", fontFamily: "system-ui,sans-serif", direction: rtl ? "rtl" : "ltr" }}>
      <div style={{ padding: "16px 20px", background: palette.panel, borderBottom: `2px solid ${palette.brd}`, display: "flex", alignItems: "center", gap: 12 }}>
        <button onClick={onBack} style={btnStyle(palette)}>{"← " + t("back")}</button>
        <h2 style={{ fontSize: 16, fontWeight: 900, color: palette.tx, margin: 0 }}>{"👨‍👧 " + t("dashboard") + " — " + t("roleParent")}</h2>
      </div>

      <div style={{ maxWidth: 600, margin: "0 auto", padding: 20 }}>
        {message && <div style={{ background: "#dcfce7", border: "1px solid #86efac", borderRadius: 8, padding: "8px 12px", marginBottom: 12, fontSize: 12, color: "#16a34a", fontWeight: 700 }}>{message}</div>}
        {error && <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "8px 12px", marginBottom: 12, fontSize: 12, color: "#dc2626", fontWeight: 700 }}>{error}</div>}

        {/* Link child */}
        <div style={{ background: "#fff", borderRadius: 12, padding: 16, marginBottom: 16, boxShadow: "0 2px 8px rgba(0,0,0,.06)" }}>
          <h3 style={{ fontSize: 13, fontWeight: 800, color: palette.tx, margin: "0 0 6px" }}>{t("linkChild")}</h3>
          <p style={{ fontSize: 10, color: palette.sub, margin: "0 0 10px" }}>{t("childCodeHint")}</p>
          <div style={{ display: "flex", gap: 8 }}>
            <input value={childCode} onChange={(e) => setChildCode(e.target.value.toUpperCase())} placeholder={t("enterChildCode")}
              style={{ flex: 1, padding: "8px 12px", borderRadius: 8, border: `1px solid ${palette.brd}`, fontSize: 14, fontFamily: "monospace", letterSpacing: 2, textTransform: "uppercase" }}
              maxLength={6} onKeyDown={(e) => e.key === "Enter" && handleLinkChild()} />
            <button onClick={handleLinkChild} style={{ ...btnStyle(palette), background: "#16a34a", color: "#fff", border: "none", fontWeight: 800 }}>{t("linkChild")}</button>
          </div>
        </div>

        {/* Children progress */}
        <div style={{ background: "#fff", borderRadius: 12, padding: 16, boxShadow: "0 2px 8px rgba(0,0,0,.06)" }}>
          <h3 style={{ fontSize: 13, fontWeight: 800, color: palette.tx, margin: "0 0 10px" }}>{t("childProgress")}</h3>
          {loading ? <p style={{ color: palette.sub, fontSize: 12 }}>...</p> :
            children.length === 0 ? <p style={{ color: palette.sub, fontSize: 12 }}>{t("noChildren")}</p> :
              children.map(({ profile: child, progress }) => {
                const total = ACTIVITY_TEMPLATES.length;
                const done = Object.values(progress).filter((p) => p.done).length;
                return (
                  <div key={child.uid} style={{ padding: "12px", borderRadius: 10, marginBottom: 8, background: isDark ? "rgba(255,255,255,.03)" : "rgba(0,0,0,.02)", border: `1px solid ${palette.brd}` }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                      <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#3b82f6", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>👨‍🎓</div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 800, color: palette.tx }}>{child.displayName}</div>
                        <div style={{ fontSize: 10, color: palette.sub }}>{done}/{total} {t("completed")} ({total ? Math.round((done / total) * 100) : 0}%)</div>
                      </div>
                    </div>
                    <div style={{ height: 6, borderRadius: 3, background: "#e5e7eb" }}>
                      <div style={{ height: "100%", borderRadius: 3, background: "linear-gradient(90deg,#22c55e,#16a34a)", width: `${total ? (done / total) * 100 : 0}%`, transition: "width .3s" }} />
                    </div>
                  </div>
                );
              })}
        </div>
      </div>
    </div>
  );
}

function btnStyle(palette: ThemePalette): React.CSSProperties {
  return { padding: "8px 14px", borderRadius: 8, border: `1px solid ${palette.brd}`, background: palette.bg, color: palette.tx, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" };
}
