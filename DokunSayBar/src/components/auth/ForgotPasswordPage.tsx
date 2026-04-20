import { useState } from "react";
import type { Language } from "../../types";
import { translate, isRTL } from "../../services/i18nService";
import { resetPassword } from "../../services/authService";
import { useAuth } from "../../state/AuthContext";

interface ForgotPasswordPageProps {
  lang: Language;
}

export default function ForgotPasswordPage({ lang }: ForgotPasswordPageProps) {
  const { authDispatch } = useAuth();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const t = (k: string) => translate(k, lang);
  const rtl = isRTL(lang);

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await resetPassword(email);
      setSent(true);
    } catch {
      setError(t("authErrorNotFound"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #f0ead6 0%, #c8cfbe 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "system-ui,sans-serif", direction: rtl ? "rtl" : "ltr" }}>
      <div style={{ width: "100%", maxWidth: 400, padding: 24 }}>
        <div style={{ background: "#fff", borderRadius: 20, padding: "32px 28px", boxShadow: "0 8px 32px rgba(0,0,0,.12)" }}>
          <h2 style={{ fontSize: 20, fontWeight: 900, color: "#3d3520", textAlign: "center", margin: "0 0 8px" }}>{t("resetPassword")}</h2>

          {sent ? (
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>✉️</div>
              <p style={{ fontSize: 13, color: "#16a34a", fontWeight: 700 }}>{t("resetSent")}</p>
              <button onClick={() => authDispatch({ type: "SET_PAGE", page: "login" })} style={{ marginTop: 16, padding: "10px 24px", borderRadius: 10, border: "none", background: "#f59e0b", color: "#fff", fontWeight: 800, cursor: "pointer", fontSize: 13 }}>{t("login")}</button>
            </div>
          ) : (
            <>
              {error && <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "8px 12px", marginBottom: 12, fontSize: 12, color: "#dc2626", fontWeight: 600 }}>{error}</div>}
              <form onSubmit={handleReset}>
                <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#3d4a35", marginBottom: 4, marginTop: 10 }}>{t("email")}</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: "1.5px solid #d1d5db", fontSize: 14, fontFamily: "inherit", outline: "none", boxSizing: "border-box" }} />
                <button type="submit" disabled={loading} style={{ width: "100%", padding: "12px", borderRadius: 12, border: "none", background: "linear-gradient(135deg,#f59e0b,#78350f)", color: "#fff", fontSize: 15, fontWeight: 800, cursor: "pointer", fontFamily: "inherit", marginTop: 16, opacity: loading ? 0.7 : 1 }}>{loading ? "..." : t("sendResetLink")}</button>
              </form>
            </>
          )}

          <p style={{ textAlign: "center", fontSize: 12, color: "#6b7a60", marginTop: 14 }}>
            <button onClick={() => authDispatch({ type: "SET_PAGE", page: "login" })} style={{ background: "none", border: "none", color: "#f59e0b", fontWeight: 800, cursor: "pointer", fontSize: 12 }}>{"← " + t("back")}</button>
          </p>
        </div>
      </div>
    </div>
  );
}
