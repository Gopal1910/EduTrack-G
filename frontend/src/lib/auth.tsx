import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Role = "teacher" | "student";

export interface AuthUser {
  name: string;
  email: string;
  role: Role;
  institute?: string;
  class?: string;
  rollNumber?: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  login: (user: AuthUser) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY = "edutrack_user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    try {
      const raw = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
      if (raw) setUser(JSON.parse(raw));
    } catch {
      // ignore
    }
  }, []);

  const login = (u: AuthUser) => {
    setUser(u);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
      // token relies heavily on external API assignment. Only clear out on logout.
    } catch {
      // ignore
    }
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem("edutrack_token");
    } catch {
      // ignore
    }
  };

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}