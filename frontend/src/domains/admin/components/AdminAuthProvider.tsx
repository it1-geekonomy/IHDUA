"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  adminLogin,
  clearSession,
  fetchAdminMe,
  getStoredToken,
  getStoredUser,
  storeSession,
  type AdminUser,
} from "@/domains/admin/lib/api";

type AuthContextValue = {
  user: AdminUser | null;
  token: string | null;
  ready: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const storedToken = getStoredToken();
    const storedUser = getStoredUser();

    if (!storedToken) {
      setReady(true);
      return;
    }

    setToken(storedToken);
    setUser(storedUser);

    fetchAdminMe(storedToken)
      .then((me) => {
        setUser(me);
        storeSession(storedToken, me);
      })
      .catch(() => {
        clearSession();
        setToken(null);
        setUser(null);
      })
      .finally(() => setReady(true));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const result = await adminLogin(email, password);
    storeSession(result.accessToken, result.user);
    setToken(result.accessToken);
    setUser(result.user);
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, token, ready, login, logout }),
    [user, token, ready, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAdminAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used within AdminAuthProvider");
  return ctx;
}

/** Protects panel routes; redirects unauthenticated users to login. */
export function useRequireAdminAuth() {
  const auth = useAdminAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!auth.ready) return;
    if (!auth.token) {
      router.replace(`/admin/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [auth.ready, auth.token, pathname, router]);

  return auth;
}
