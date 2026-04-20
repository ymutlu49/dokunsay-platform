import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";

/**
 * Firebase configuration.
 * Replace these values with your own Firebase project credentials.
 * Get them from: Firebase Console → Project Settings → General → Your apps → Web app
 */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCMpJccUp6MltVGSeoGmkULvLkTh4WDz9w",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "dokunsay-3b830.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "dokunsay-3b830",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "dokunsay-3b830.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "967787425263",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:967787425263:web:68726e6badb6d3c0e31a1a",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

// Connect to emulators in development
if (import.meta.env.DEV && import.meta.env.VITE_USE_EMULATORS === "true") {
  connectAuthEmulator(auth, "http://localhost:9099");
  connectFirestoreEmulator(db, "localhost", 8080);
}

export default app;
