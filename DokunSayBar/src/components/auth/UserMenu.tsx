import type { Language, ThemePalette, UserProfile } from "../../types";
import { translate } from "../../services/i18nService";
import { signOut } from "../../services/authService";

interface UserMenuProps {
  profile: UserProfile;
  lang: Language;
  palette: ThemePalette;
  isDark: boolean;
  onDashboard: () => void;
}

const ROLE_ICONS = { teacher: "🎓", student: "👨‍🎓", parent: "👨‍👧" };
const ROLE_COLORS = { teacher: "#7c3aed", student: "#3b82f6", parent: "#16a34a" };

export default function UserMenu({ profile, lang, palette, isDark, onDashboard }: UserMenuProps) {
  const t = (k: string) => translate(k, lang);
  const roleKey = `role${profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}` as any;

  return (
    <div style={{ padding: "8px 10px", borderBottom: `1px solid ${palette.brd}` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
        {/* Avatar */}
        {profile.photoURL ? (
          <img src={profile.photoURL} alt="" style={{ width: 28, height: 28, borderRadius: "50%", objectFit: "cover" }} />
        ) : (
          <div style={{ width: 28, height: 28, borderRadius: "50%", background: ROLE_COLORS[profile.role], display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>
            {ROLE_ICONS[profile.role]}
          </div>
        )}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: palette.tx, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {profile.displayName}
          </div>
          <div style={{ fontSize: 8, fontWeight: 700, color: ROLE_COLORS[profile.role] }}>
            {ROLE_ICONS[profile.role] + " " + t(roleKey)}
          </div>
        </div>
      </div>

      {/* Student code display */}
      {profile.role === "student" && profile.studentCode && (
        <div style={{ fontSize: 8, fontWeight: 700, color: palette.sub, background: isDark ? "rgba(255,255,255,.05)" : "rgba(0,0,0,.04)", borderRadius: 6, padding: "3px 6px", marginBottom: 4, textAlign: "center" }}>
          {t("studentCodeLabel")}: <span style={{ fontWeight: 900, letterSpacing: 1, color: "#f59e0b" }}>{profile.studentCode}</span>
        </div>
      )}

      <div style={{ display: "flex", gap: 3 }}>
        {(profile.role === "teacher" || profile.role === "parent") && (
          <button onClick={onDashboard} style={{ flex: 1, padding: "4px 6px", borderRadius: 5, border: `1px solid ${palette.brd}`, background: palette.bg, color: palette.tx, fontSize: 8, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
            {"📊 " + t("dashboard")}
          </button>
        )}
        <button onClick={() => signOut()} style={{ flex: 1, padding: "4px 6px", borderRadius: 5, border: "1px solid #fecaca", background: "#fef2f2", color: "#dc2626", fontSize: 8, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
          {"🚪 " + t("logout")}
        </button>
      </div>
    </div>
  );
}
