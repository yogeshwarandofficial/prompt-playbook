export interface AdminSession {
  id: string;
  studentId: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export async function getSession(): Promise<AdminSession | null> {
  if (typeof window === "undefined") return null;
  try {
    const res = await fetch(`${API_URL}/api/auth/me`, {
      method: 'GET',
      credentials: 'include',
    });
    if (!res.ok) return null;
    return (await res.json()) as AdminSession;
  } catch {
    return null;
  }
}

export async function signIn(studentId: string, password: string): Promise<AdminSession | null> {
  try {
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ studentId, password }),
    });
    if (!res.ok) return null;
    return (await res.json()) as AdminSession;
  } catch {
    return null;
  }
}

export async function signOut(): Promise<void> {
  try {
    await fetch(`${API_URL}/api/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });
  } catch {
    // Ignore errors on sign out
  }
}
