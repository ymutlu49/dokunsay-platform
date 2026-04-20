import { createContext, useContext, useReducer, useEffect, type Dispatch, type ReactNode } from "react";
import { authReducer, initialAuthState, type AuthState, type AuthAction } from "./authReducer";
import { onAuthStateChanged, handleRedirectResult } from "../services/authService";
import { getUserProfile } from "../services/firestoreService";

interface AuthContextValue {
  auth: AuthState;
  authDispatch: Dispatch<AuthAction>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, authDispatch] = useReducer(authReducer, initialAuthState);

  useEffect(() => {
    // Handle Google redirect result on app startup (mobile/Capacitor)
    handleRedirectResult().catch(() => {});

    const unsubscribe = onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        authDispatch({
          type: "SET_USER",
          user: { uid: firebaseUser.uid, email: firebaseUser.email },
        });

        // Load profile from Firestore
        try {
          const profile = await getUserProfile(firebaseUser.uid);
          if (profile) {
            authDispatch({ type: "SET_PROFILE", profile });
            authDispatch({ type: "SET_PAGE", page: "app" });
          } else {
            // User exists in Auth but no profile yet (edge case)
            authDispatch({ type: "SET_PAGE", page: "app" });
          }
        } catch {
          authDispatch({ type: "SET_PAGE", page: "app" });
        }
      } else {
        authDispatch({ type: "SET_USER", user: null });
        authDispatch({ type: "SET_PROFILE", profile: null });
        authDispatch({ type: "SET_PAGE", page: "login" });
      }
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ auth, authDispatch }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
