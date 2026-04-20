import { useState } from "react";
import type { Language } from "../../types";
import { translate, isRTL, SUPPORTED_LANGUAGES, getThreeWord } from "../../services/i18nService";
import { signInWithEmail, signInWithGoogle } from "../../services/authService";
import { useAuth } from "../../state/AuthContext";

interface LoginPageProps {
  lang: Language;
  onSetLang: (lang: Language) => void;
}

function mapFirebaseError(code: string, t: (k: string) => string): string {
  if (code.includes("invalid-email")) return t("authErrorEmail");
  if (code.includes("wrong-password") || code.includes("invalid-credential")) return t("authErrorPassword");
  if (code.includes("user-not-found")) return t("authErrorNotFound");
  return t("authErrorGeneric");
}

export default function LoginPage({ lang, onSetLang }: LoginPageProps) {
  const { authDispatch } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const t = (k: string) => translate(k, lang);
  const rtl = isRTL(lang);

  async function handleEmailLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await signInWithEmail(email, password);
    } catch (err: any) {
      setError(mapFirebaseError(err.code || "", t));
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    setLoading(true);
    setError("");
    try {
      await signInWithGoogle();
    } catch (err: any) {
      setError(mapFirebaseError(err.code || "", t));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #f0ead6 0%, #c8cfbe 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "system-ui,sans-serif", direction: rtl ? "rtl" : "ltr" }}>
      <div style={{ width: "100%", maxWidth: 400, padding: 24 }}>
        {/* Language selector */}
        <div style={{ display: "flex", justifyContent: "center", gap: 4, marginBottom: 24 }}>
          {SUPPORTED_LANGUAGES.map((l) => (
            <button key={l.code} onClick={() => onSetLang(l.code)}
              style={{ padding: "4px 10px", borderRadius: 6, border: lang === l.code ? "2px solid #78350f" : "1px solid #a0aa94", background: lang === l.code ? "#f59e0b" : "#fff", color: lang === l.code ? "#fff" : "#3d4a35", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>
              {l.label}
            </button>
          ))}
        </div>

        {/* Card */}
        <div style={{ background: "#fff", borderRadius: 20, padding: "32px 28px", boxShadow: "0 8px 32px rgba(0,0,0,.12)" }}>
          {/* Logo */}
          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <svg width="56" height="56" viewBox="0 0 512 512" style={{ borderRadius: 14, margin: "0 auto", display: "block" }}>
              <rect width="512" height="512" rx="100" fill="none" />
              <circle cx="180" cy="155" r="60" fill="#f59e0b" /><circle cx="180" cy="155" r="60" fill="none" stroke="#b45309" strokeWidth="5" />
              <circle cx="160" cy="148" r="10" fill="#000" /><circle cx="180" cy="148" r="10" fill="#000" /><circle cx="200" cy="148" r="10" fill="#000" />
              <circle cx="332" cy="155" r="60" fill="#d97706" /><circle cx="332" cy="155" r="60" fill="none" stroke="#92400e" strokeWidth="5" />
              <text x="332" y="173" textAnchor="middle" fontFamily="system-ui" fontSize="46" fontWeight="900" fill="#000">{getThreeWord(lang)}</text>
              <circle cx="256" cy="362" r="60" fill="#16a34a" /><circle cx="256" cy="362" r="60" fill="none" stroke="#064e3b" strokeWidth="5" />
              <text x="256" y="384" textAnchor="middle" fontFamily="system-ui" fontSize="54" fontWeight="900" fill="#000">3</text>
            </svg>
            <h1 style={{ fontSize: 22, fontWeight: 900, color: "#3d3520", margin: "10px 0 2px" }}>DokunSay</h1>
            <p style={{ fontSize: 12, color: "#6b7a60", margin: 0 }}>{t("welcome")}</p>
          </div>

          {/* Error */}
          {error && <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "8px 12px", marginBottom: 12, fontSize: 12, color: "#dc2626", fontWeight: 600 }}>{error}</div>}

          {/* Form */}
          <form onSubmit={handleEmailLogin}>
            <label style={labelStyle}>{t("email")}</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={inputStyle} placeholder="ornek@email.com" />

            <label style={labelStyle}>{t("password")}</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={inputStyle} placeholder="••••••" minLength={6} />

            <div style={{ textAlign: "end", marginBottom: 12 }}>
              <button type="button" onClick={() => authDispatch({ type: "SET_PAGE", page: "forgot" })} style={{ background: "none", border: "none", color: "#d97706", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>{t("forgotPassword")}</button>
            </div>

            <button type="submit" disabled={loading} style={{ ...btnPrimary, opacity: loading ? 0.7 : 1 }}>{loading ? "..." : t("login")}</button>
          </form>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "16px 0" }}>
            <div style={{ flex: 1, height: 1, background: "#e5e7eb" }} />
            <span style={{ fontSize: 11, color: "#9ca3af" }}>{t("orContinueWith")}</span>
            <div style={{ flex: 1, height: 1, background: "#e5e7eb" }} />
          </div>

          {/* Google */}
          <button onClick={handleGoogleLogin} disabled={loading} style={btnGoogle}>
            <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.9 33.5 29.4 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 8 3l5.7-5.7C34 6 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.2-2.7-.4-3.9z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.3 15.3 18.8 12 24 12c3.1 0 5.8 1.2 8 3l5.7-5.7C34 6 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.4 0-9.9-3.5-11.3-8.3l-6.6 5.1C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C36.9 39.2 44 34 44 24c0-1.3-.2-2.7-.4-3.9z"/></svg>
            <span>{t("google")}</span>
          </button>

          {/* Signup link */}
          <p style={{ textAlign: "center", fontSize: 12, color: "#6b7a60", marginTop: 16 }}>
            {t("noAccount") + " "}
            <button onClick={() => authDispatch({ type: "SET_PAGE", page: "signup" })} style={{ background: "none", border: "none", color: "#f59e0b", fontWeight: 800, cursor: "pointer", fontSize: 12 }}>{t("signup")}</button>
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
