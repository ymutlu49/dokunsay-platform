import { lazy, Suspense } from "react";
import { useAuth } from "./state/AuthContext";
import { useAppState } from "./state/AppContext";
import { useAR } from "./state/ARContext";
import { getTheme, isDarkMode } from "./constants/colors";
import LoginPage from "./components/auth/LoginPage";
import SignupPage from "./components/auth/SignupPage";
import ForgotPasswordPage from "./components/auth/ForgotPasswordPage";
import TeacherDashboard from "./components/dashboard/TeacherDashboard";
import ParentDashboard from "./components/dashboard/ParentDashboard";
import App from "./App";
import type { Language } from "./types";

/**
 * Giriş ekranı şu an devre dışı — kullanıcı doğrulaması platform
 * seviyesinde (launcher/SSO) yapılacak. Altyapı korunur; gerektiğinde
 * `AUTH_ENABLED = true` yapıp Firebase giriş akışına geri dönülür.
 */
const AUTH_ENABLED = false;

// Lazy load AR components (heavy Three.js bundle — only loaded when AR activated)
const AR3DViewer = lazy(() => import("./components/ar/AR3DViewer"));
const ARCameraView = lazy(() => import("./components/ar/ARCameraView"));
const ARRecognitionView = lazy(() => import("./components/ar/ARRecognitionView"));

const ARLoading = () => (
  <div style={{ minHeight: "100vh", background: "#1a1a2e", display: "flex", alignItems: "center", justifyContent: "center" }}>
    <div style={{ textAlign: "center", color: "#fff" }}>
      <div style={{ fontSize: 48, marginBottom: 12 }}>🧊</div>
      <div style={{ fontSize: 14, fontWeight: 700 }}>AR Loading...</div>
    </div>
  </div>
);

export default function AppShell() {
  const { auth, authDispatch } = useAuth();
  const { state, dispatch } = useAppState();
  const { arState } = useAR();
  const lang = state.language;
  const palette = getTheme(state.bgColor);
  const dk = isDarkMode(state.bgColor);

  const setLang = (l: Language) => dispatch({ type: "SET_LANGUAGE", language: l });

  // Loading state (yalnızca auth aktifken göster)
  if (AUTH_ENABLED && auth.loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#f0ead6", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 12, animation: "dsPulse 1.5s ease infinite" }}>🔢</div>
          <div style={{ fontSize: 18, fontWeight: 900, color: "#3d3520" }}>DokunSay</div>
        </div>
      </div>
    );
  }

  // Giriş ekranı (AUTH_ENABLED=false iken atlanır)
  if (AUTH_ENABLED && !auth.user) {
    switch (auth.page) {
      case "signup":
        return <SignupPage lang={lang} />;
      case "forgot":
        return <ForgotPasswordPage lang={lang} />;
      default:
        return <LoginPage lang={lang} onSetLang={setLang} />;
    }
  }

  // Öğretmen/veli panoları (AUTH_ENABLED=false iken atlanır)
  if (AUTH_ENABLED && auth.page === "dashboard" && auth.profile) {
    if (auth.profile.role === "teacher") {
      return (
        <TeacherDashboard
          profile={auth.profile}
          lang={lang}
          palette={palette}
          isDark={dk}
          onBack={() => authDispatch({ type: "SET_PAGE", page: "app" })}
        />
      );
    }
    if (auth.profile.role === "parent") {
      return (
        <ParentDashboard
          profile={auth.profile}
          lang={lang}
          palette={palette}
          isDark={dk}
          onBack={() => authDispatch({ type: "SET_PAGE", page: "app" })}
        />
      );
    }
  }

  // AR modes (lazy loaded)
  if (arState.mode !== "off") {
    return (
      <Suspense fallback={<ARLoading />}>
        {arState.mode === "3d" && <AR3DViewer />}
        {arState.mode === "camera-ar" && <ARCameraView />}
        {arState.mode === "recognition" && <ARRecognitionView />}
      </Suspense>
    );
  }

  // Main app (canvas)
  return <App />;
}
