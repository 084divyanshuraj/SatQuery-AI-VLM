import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  signOut, 
  updateProfile, 
  sendPasswordResetEmail, 
  onAuthStateChanged 
} from 'firebase/auth';
import { auth, googleProvider, isFirebaseConfigured } from './config';

/**
 * Normalizes a Firebase User record to the SatQuery Analyst User schema
 */
export function formatSatQueryUser(firebaseUser, customName = null) {
  if (!firebaseUser) return null;
  
  const email = firebaseUser.email || "";
  const name = customName || firebaseUser.displayName || (email.includes('@') ? email.split('@')[0] : "Geospatial Analyst");
  
  return {
    id: firebaseUser.uid,
    uid: firebaseUser.uid,
    email: email,
    name: name,
    photoURL: firebaseUser.photoURL || null,
    emailVerified: firebaseUser.emailVerified || false,
    rank: "Senior Geospatial Analyst",
    clearance: "ISRO Level-4 Orbital Access",
    mission: "ISRO-EOS-FOUNDATION-AI",
    isRealAccount: true,
    authProvider: firebaseUser.providerData?.[0]?.providerId || "password"
  };
}

/**
 * Translates Firebase Authentication error codes into human-readable messages
 */
export function getFriendlyAuthErrorMessage(error) {
  if (!error) return "An unexpected error occurred.";
  const code = error.code || "";

  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
      return "Incorrect email or password. Please try again.";
    case 'auth/user-not-found':
      return "No account found with this email address.";
    case 'auth/email-already-in-use':
      return "An account with this email address already exists. Please Sign In instead.";
    case 'auth/weak-password':
      return "Password is too weak. Please use at least 6 characters.";
    case 'auth/invalid-email':
      return "Please enter a valid email address.";
    case 'auth/user-disabled':
      return "This account has been disabled by security administrators.";
    case 'auth/popup-closed-by-user':
      return "Google sign-in popup was closed before completing.";
    case 'auth/popup-blocked':
      return "Sign-in popup was blocked by your browser. Please allow popups.";
    case 'auth/operation-not-allowed':
      return "This sign-in method is not enabled in your Firebase Console (Authentication -> Sign-in method).";
    case 'auth/network-request-failed':
      return "Network error. Please check your internet connection.";
    case 'auth/too-many-requests':
      return "Too many failed attempts. Please wait a moment before trying again.";
    default:
      return error.message || "Authentication failed. Please verify your credentials.";
  }
}

/**
 * Registers a new real user using Firebase Email & Password
 */
export async function registerWithEmail(email, password, fullName) {
  if (!isFirebaseConfigured || !auth) {
    throw new Error(
      "Firebase credentials are not configured. Please paste your Firebase keys in frontend/.env to create real accounts."
    );
  }

  const credential = await createUserWithEmailAndPassword(auth, email.trim(), password);
  
  if (fullName && fullName.trim()) {
    try {
      await updateProfile(credential.user, { displayName: fullName.trim() });
    } catch (profileErr) {
      console.warn("Could not set displayName on Firebase user:", profileErr);
    }
  }

  return formatSatQueryUser(credential.user, fullName);
}

/**
 * Signs in an existing user using Firebase Email & Password
 */
export async function loginWithEmail(email, password) {
  if (!isFirebaseConfigured || !auth) {
    throw new Error(
      "Firebase credentials are not configured. Please paste your Firebase keys in frontend/.env to log in with real accounts."
    );
  }

  const credential = await signInWithEmailAndPassword(auth, email.trim(), password);
  return formatSatQueryUser(credential.user);
}

/**
 * Real One-Click Google Authentication via Firebase Popup
 */
export async function loginWithGoogle() {
  if (!isFirebaseConfigured || !auth || !googleProvider) {
    throw new Error(
      "Firebase credentials are not configured. Please paste your Firebase keys in frontend/.env to enable Google Sign-In."
    );
  }

  const result = await signInWithPopup(auth, googleProvider);
  return formatSatQueryUser(result.user);
}

/**
 * Signs out the currently authenticated Firebase user
 */
export async function logoutUser() {
  if (auth) {
    await signOut(auth);
  }
}

/**
 * Sends a password reset email via Firebase
 */
export async function resetPassword(email) {
  if (!isFirebaseConfigured || !auth) {
    throw new Error("Firebase credentials are not configured.");
  }
  await sendPasswordResetEmail(auth, email.trim());
}

/**
 * Subscribes to real-time Firebase Auth state changes
 * Restores user automatically on page reload!
 */
export function subscribeToAuth(callback) {
  if (!isFirebaseConfigured || !auth) {
    callback(null);
    return () => {};
  }

  return onAuthStateChanged(auth, (firebaseUser) => {
    if (firebaseUser) {
      callback(formatSatQueryUser(firebaseUser));
    } else {
      callback(null);
    }
  });
}
