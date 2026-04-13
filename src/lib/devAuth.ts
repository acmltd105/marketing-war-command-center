const STORAGE_KEY = "mwcc:dev-mock-session";

export type MockSession = {
  displayName: string;
  email: string;
};

export function isMockAuthEnabled(): boolean {
  return import.meta.env.VITE_USE_MOCK_AUTH === "true";
}

export function readDevSession(): MockSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const o = JSON.parse(raw) as unknown;
    if (!o || typeof o !== "object") return null;
    const s = o as Partial<MockSession>;
    if (typeof s.displayName !== "string" || typeof s.email !== "string") return null;
    return { displayName: s.displayName, email: s.email };
  } catch {
    return null;
  }
}

export function setDevSession(session: MockSession) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

export function clearDevSession() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(STORAGE_KEY);
}
