// Frontend-only mock auth. NOT real security — purely a UI gate for demos.
const KEY = "infynux_admin_session";

export const DEMO_CREDENTIALS = {
  email: "admin@infynux.com",
  password: "infynux@2026",
};

export interface AdminSession {
  email: string;
  loggedInAt: number;
}

export function getSession(): AdminSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as AdminSession) : null;
  } catch {
    return null;
  }
}

export function signIn(email: string, password: string): AdminSession | null {
  if (
    email.trim().toLowerCase() === DEMO_CREDENTIALS.email &&
    password === DEMO_CREDENTIALS.password
  ) {
    const session: AdminSession = { email: DEMO_CREDENTIALS.email, loggedInAt: Date.now() };
    window.localStorage.setItem(KEY, JSON.stringify(session));
    return session;
  }
  return null;
}

export function signOut() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(KEY);
}
