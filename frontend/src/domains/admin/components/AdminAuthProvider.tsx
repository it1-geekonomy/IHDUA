"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
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
import { getTokenRemainingMs, isTokenExpired } from "@/domains/admin/lib/jwt";
import {
  ADMIN_TOKEN_KEY,
  SESSION_EXPIRED_EVENT,
} from "@/domains/admin/lib/session";

type AuthContextType = {
  user: AdminUser | null;
  token: string | null;
  ready: boolean;
  login: (email: string, pass: string, remember?: boolean) => Promise<AdminUser>;
  logout: (reason?: string) => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const logout = (reason = "logged_out") => {
    if (timerRef.current) clearTimeout(timerRef.current);
    clearSession();
    setToken(null);
    setUser(null);

    const next =
      pathname?.startsWith("/admin") && pathname !== "/admin/login"
        ? `&next=${encodeURIComponent(pathname)}`
        : "";
    if (pathname !== "/admin/login") {
      router.replace(`/admin/login?reason=${reason}${next}`);
    }
  };

  const scheduleExpiry = (jwt: string) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    const ms = getTokenRemainingMs(jwt);
    if (ms <= 0) return logout("session_expired");
    timerRef.current = setTimeout(() => logout("session_expired"), ms);
  };

  const initializedTokenRef = useRef<string | null>(null);

  useEffect(() => {
    const t = getStoredToken();
    if (!t || isTokenExpired(t)) {
      clearSession();
      setReady(true);
      return;
    }

    setToken(t);
    setUser(getStoredUser());
    scheduleExpiry(t);

    if (initializedTokenRef.current !== t) {
      initializedTokenRef.current = t;
      fetchAdminMe(t)
        .then((u) => {
          setUser(u);
          storeSession(t, u);
        })
        .catch(() => logout("session_expired"))
        .finally(() => setReady(true));
    } else {
      setReady(true);
    }

    const onStorage = (e: StorageEvent) =>
      e.key === ADMIN_TOKEN_KEY && !e.newValue && logout("session_expired");
    const onExpiry = () => logout("session_expired");
    const onFocus = () =>
      t && isTokenExpired(getStoredToken()) && logout("session_expired");

    window.addEventListener("storage", onStorage);
    window.addEventListener(SESSION_EXPIRED_EVENT, onExpiry);
    window.addEventListener("focus", onFocus);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      window.removeEventListener("storage", onStorage);
      window.removeEventListener(SESSION_EXPIRED_EVENT, onExpiry);
      window.removeEventListener("focus", onFocus);
    };
  }, []);

  const login = async (email: string, pass: string, rem = true) => {
    const res = await adminLogin(email, pass);
    storeSession(res.accessToken, res.user, rem);
    setToken(res.accessToken);
    setUser(res.user);
    scheduleExpiry(res.accessToken);
    return res.user;
  };

  const value = useMemo(
    () => ({ user, token, ready, login, logout }),
    [user, token, ready],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAdminAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used inside AdminAuthProvider");
  return ctx;
};

export const useRequireAdminAuth = () => {
  const auth = useAdminAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (auth.ready && !auth.token) {
      const next =
        pathname && pathname !== "/admin/login"
          ? `?next=${encodeURIComponent(pathname)}`
          : "";
      router.replace(`/admin/login${next}`);
    }
  }, [auth.ready, auth.token, pathname, router]);

  return auth;
};
