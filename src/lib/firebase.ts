/**
 * firebase.ts — Firebase client SDK configuration.
 *
 * ⚠️  NOTE: Firebase VITE_ keys are intentionally public (they identify the project,
 * not authenticate access). Access control is enforced via Firebase Security Rules.
 *
 * This module is ONLY used in server-side API route handlers (TanStack Start server blocks),
 * so these values never run in the browser. If you move any of these imports to a
 * client-side component, review Firebase Security Rules first.
 */
import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY ?? process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN ?? process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID ?? process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET ?? process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID ?? process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID ?? process.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase only once
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const db = getFirestore(app);
