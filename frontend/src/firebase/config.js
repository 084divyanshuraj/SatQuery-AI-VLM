import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// Read Firebase configuration with fallback to project defaults
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCk8ubtSiDvKOLPaxmgldOH9jjfNR_90UU",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "serqueryai.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "serqueryai",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "serqueryai.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "907199149198",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:907199149198:web:68f61e11cd639cb75845df",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-1DL7SSNM5R"
};

// Confirm configuration validity
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.apiKey.length > 5 &&
  firebaseConfig.projectId &&
  !firebaseConfig.apiKey.includes("YOUR_")
);

let app = null;
let auth = null;
let googleProvider = null;

if (isFirebaseConfigured) {
  try {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    auth = getAuth(app);
    googleProvider = new GoogleAuthProvider();
    googleProvider.setCustomParameters({ prompt: 'select_account' });
  } catch (err) {
    console.error("Firebase initialization failed:", err);
  }
}

export { app, auth, googleProvider };
