import { useState } from "react";
import type { Language, UserRole } from "../../types";
import { translate, isRTL } from "../../services/i18nService";
import { signUpWithEmail, signInWithGoogle } from "../../services/authService";
import { useAuth } from "../../state/AuthContext";

interface SignupPageProps {
  lang: Language;
}

function mapFirebaseError(code: string, t: (k: string) => string): string {
  if (code.includes("email-already-in-use")) return t("authErrorExists");
  if (code.includes("weak-password")) return t("authErrorWeak");
  if (code.includes("invalid-email")) return t("authErrorEmail");
  return t("authErrorGeneric");
}

const ROLES: { value: UserRole; key: string; icon: string }[] = [
  { value: "teacher", key: "roleTeacher", icon: "🎓" },
  { value: "student", key: "roleStudent", icon: "👨‍🎓" },
  { value: "parent", key: "roleParent", icon: "👨‍👧" },
];

export default function SignupPage({ lang }: SignupPageProps) {
  const { authDispatch } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("student");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const t = (k: string) => translate(k, lang);
  const rtl = isRTL(lang);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await signUpWithEmail(email, password, name, role);
    } catch (err: any) {
      setError(mapFirebaseError(err.code || "", t));
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleSignup() {
    setLoading(true);
    setError("");
    try {
      await signInWithGoogle(role);
    } catch (err: any) {
      setError(mapFirebaseError(err.code || "", t));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #f0ead6 0%, #c8cfbe 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "system-ui,sans-serif", direction: rtl ? "rtl" : "ltr" }}>
      <div style={{ width: "100%", maxWidth: 400, padding: 24 }}>
        <div style={{ background: "#fff", borderRadius: 20, padding: "32px 28px", boxShadow: "0 8px 32px rgba(0,0,0,.12)" }}>
          <h2 style={{ fontSize: 20, fontWeight: 900, color: "#3d3520", textAlign: "center", margin: "0 0 20px" }}>{t("signup")}</h2>

          {error && <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "8px 12px", marginBottom: 12, fontSize: 12, color: "#dc2626", fontWeight: 600 }}>{error}</div>}

          {/* Role selection */}
          <label style={labelStyle}>{t("selectRole")}</label>
          <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
            {ROLES.map((r) => (
              <button key={r.value} type="button" onClick={() => setRole(r.value)}
                style={{
                  flex: 1, padding: "10px 4px", borderRadius: 10, cursor: "pointer", fontFamily: "inherit",
                  border: role === r.value ? "2px solid #f59e0b" : "1.5px solid #d1d5db",
                  background: role === r.value ? "rgba(245,158,11,.1)" : "#fff",
                  textAlign: "center", fontSize: 10, fontWeight: role === r.value ? 800 : 600,
                  color: role === r.value ? "#78350f" : "#6b7280",
                }}>
                <div style={{ fontSize: 22 }}>{r.icon}</div>
                {t(r.key)}
              </button>
            ))}
          </div>

          <form onSubmit={handleSignup}>
            <label style={labelStyle}>{t("fullName")}</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required style={inputStyle} />

            <label style={labelStyle}>{t("email")}</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={inputStyle} />

            <label style={labelStyle}>{t("password")}</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={inputStyle} minLength={6} />

            <button type="submit" disabled={loading} style={{ ...btnPrimary, opacity: loading ? 0.7 : 1, marginTop: 16 }}>{loading ? "..." : t("signup")}</button>
          </form>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "14px 0" }}>
            <div style={{ flex: 1, height: 1, background: "#e5e7eb" }} />
            <span style={{ fontSize: 11, color: "#9ca3af" }}>{t("orContinueWith")}</span>
            <div style={{ flex: 1, height: 1, background: "#e5e7eb" }} />
          </div>

          <button onClick={handleGoogleSignup} disabled={loading} style={btnGoogle}>
            <span>Google ({t(ROLES.find((r) => r.value === role)!.key)})</span>
          </button>

          <p style={{ textAlign: "center", fontSize: 12, color: "#6b7a60", marginTop: 14 }}>
            {t("hasAccount") + " "}
            <button onClick={() => authDispatch({ type: "SET_PAGE", page: "login" })} style={{ background: "none", border: "none", color: "#f59e0b", fontWeight: 800, cursor: "pointer", fontSize: 12 }}>{t("login")}</button>
          </p>
        </div>
      </div>
    </div>
  );
}

const labelStyle: React.CSSProperties = { display: "block", fontSize: 11, fontWeight: 700, color: "#3d4a35", marginBottom: 4, marginTop: 10 };
const inputStyle: React.CSSProperties = { width: "100%", padding: "10px 12px", borderRadius: 10, border: "1.5px solid #d1d5db", fontSize: 14, fontFamily: "inherit", outline: "none", boxSizing: "border-box" };
const btnPrimary: React.CSSProperties = { width: "100%", padding: "12px", borderRadius: 12, border: "none", background: "linear-gradient(135deg,#f59e0b,#78350f)", color: "#fff", fontSize: 15, fontWeight: 800, cursor: "pointer", fontFamily: "inherit" };
const btnGoogle: React.CSSProperties = { width: "100%", padding: "10px", borderRadius: 12, border: "1.5px solid #e5e7eb", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, cursor: "pointer", fontSize: 13, fontWeight: 700, fontFamily: "inherit", color: "#374151" };
