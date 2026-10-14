/**
 * firebase.ts — Firebase client SDK configuration.
 *
 * ⚠️  NOTE: Firebase VITE_ keys are intentionally public (they identify the project,
 * not authenticate access). Access control is enforced via Firebase Security Rules.
 */
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const getEnvVar = (viteKey: string, nodeKey?: string): string | undefined => {
  if (typeof import.meta !== "undefined" && import.meta.env) {
    const val = (import.meta.env as any)[viteKey];
    if (val) return val;
  }
  if (typeof process !== "undefined" && process.env) {
    if (nodeKey && process.env[nodeKey]) return process.env[nodeKey];
    if (process.env[viteKey]) return process.env[viteKey];
  }
  return undefined;
};

export const firebaseConfig = {
  apiKey: getEnvVar("VITE_FIREBASE_API_KEY", "FIREBASE_API_KEY"),
  authDomain: getEnvVar("VITE_FIREBASE_AUTH_DOMAIN", "FIREBASE_AUTH_DOMAIN"),
  projectId: getEnvVar("VITE_FIREBASE_PROJECT_ID", "FIREBASE_PROJECT_ID"),
  storageBucket: getEnvVar("VITE_FIREBASE_STORAGE_BUCKET", "FIREBASE_STORAGE_BUCKET"),
  messagingSenderId: getEnvVar("VITE_FIREBASE_MESSAGING_SENDER_ID", "FIREBASE_MESSAGING_SENDER_ID"),
  appId: getEnvVar("VITE_FIREBASE_APP_ID", "FIREBASE_APP_ID"),
};

// Initialize Firebase safely
export const app =
  getApps().length === 0
    ? firebaseConfig.apiKey
      ? initializeApp(firebaseConfig)
      : undefined
    : getApp();

export const db = app ? getFirestore(app) : undefined;
