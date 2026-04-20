import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile,
  type User,
  type Unsubscribe,
} from "firebase/auth";
import { auth } from "../config/firebase";
import type { UserRole } from "../types";
import { createUserProfile, getUserProfile } from "./firestoreService";

const googleProvider = new GoogleAuthProvider();

export async function signUpWithEmail(
  email: string,
  password: string,
  displayName: string,
  role: UserRole,
  studentCode?: string
): Promise<User> {
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(credential.user, { displayName });

  await createUserProfile(credential.user.uid, {
    uid: credential.user.uid,
    email,
    displayName,
    role,
    classIds: [],
    parentOf: [],
    studentCode: role === "student" ? generateStudentCode() : undefined,
    createdAt: Date.now(),
  });

  return credential.user;
}

export async function signInWithEmail(
  email: string,
  password: string
): Promise<User> {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  return credential.user;
}

/**
 * Detect if running in a mobile/Capacitor environment where popups don't work.
 */
function isMobileOrCapacitor(): boolean {
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) ||
    !!(window as any).Capacitor;
}

/**
 * After a Google redirect sign-in completes, ensure the user profile exists.
 */
async function ensureGoogleProfile(user: User, role?: UserRole): Promise<void> {
  const existing = await getUserProfile(user.uid);
  if (!existing) {
    await createUserProfile(user.uid, {
      uid: user.uid,
      email: user.email || "",
      displayName: user.displayName || "",
      role: role || "student",
      photoURL: user.photoURL || undefined,
      classIds: [],
      parentOf: [],
      studentCode: (role || "student") === "student" ? generateStudentCode() : undefined,
      createdAt: Date.now(),
    });
  }
}

export async function signInWithGoogle(
  role?: UserRole
): Promise<User | null> {
  if (isMobileOrCapacitor()) {
    // On mobile/Capacitor, use redirect flow to avoid sessionStorage issues
    await signInWithRedirect(auth, googleProvider);
    // This won't return — the page redirects. Result is handled by handleRedirectResult().
    return null as any;
  }

  // Desktop: popup works fine
  const credential = await signInWithPopup(auth, googleProvider);
  await ensureGoogleProfile(credential.user, role);
  return credential.user;
}

/**
 * Call this on app startup to handle the result of a Google redirect sign-in.
 */
export async function handleRedirectResult(): Promise<User | null> {
  try {
    const result = await getRedirectResult(auth);
    if (result?.user) {
      await ensureGoogleProfile(result.user);
      return result.user;
    }
  } catch (err) {
    console.error("Redirect sign-in error:", err);
  }
  return null;
}

export async function signOut(): Promise<void> {
  await firebaseSignOut(auth);
}

export function onAuthStateChanged(
  callback: (user: User | null) => void
): Unsubscribe {
  return firebaseOnAuthStateChanged(auth, callback);
}

export async function resetPassword(email: string): Promise<void> {
  await sendPasswordResetEmail(auth, email);
}

function generateStudentCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}
