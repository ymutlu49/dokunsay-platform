import type { UserProfile, AuthPage } from "../types";

export interface AuthState {
  user: { uid: string; email: string | null } | null;
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  page: AuthPage;
}

export const initialAuthState: AuthState = {
  user: null,
  profile: null,
  loading: true,
  error: null,
  page: "login",
};

export type AuthAction =
  | { type: "SET_USER"; user: { uid: string; email: string | null } | null }
  | { type: "SET_PROFILE"; profile: UserProfile | null }
  | { type: "SET_LOADING"; loading: boolean }
  | { type: "SET_ERROR"; error: string | null }
  | { type: "SET_PAGE"; page: AuthPage }
  | { type: "LOGOUT" };

export function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "SET_USER":
      return { ...state, user: action.user, loading: false };
    case "SET_PROFILE":
      return { ...state, profile: action.profile };
    case "SET_LOADING":
      return { ...state, loading: action.loading };
    case "SET_ERROR":
      return { ...state, error: action.error };
    case "SET_PAGE":
      return { ...state, page: action.page, error: null };
    case "LOGOUT":
      return { ...initialAuthState, loading: false, page: "login" };
    default:
      return state;
  }
}
