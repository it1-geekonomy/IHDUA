import { isTokenExpired, decodeJwtPayload } from "./jwt";

export const ADMIN_TOKEN_KEY = "ihdua_admin_token";
export const ADMIN_USER_KEY = "ihdua_admin_user";
export const ADMIN_REMEMBER_KEY = "ihdua_admin_remember";
export const ADMIN_SAVED_EMAIL_KEY = "ihdua_admin_saved_email";

export const SESSION_EXPIRED_EVENT = "ihdua:admin:session_expired";
export const SESSION_LOGOUT_EVENT = "ihdua:admin:logout";

export type AdminUser = {
  id: string;
  fullName: string;
  email: string;
};

export type LogoutReason =
  | "user_action"
  | "session_expired"
  | "unauthorized"
  | "cross_tab";

/**
 * Sets a cookie in browser context.
 */
function setCookie(name: string, value: string, maxAgeSeconds?: number) {
  if (typeof document === "undefined") return;
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  const maxAgeStr =
    maxAgeSeconds !== undefined ? `; Max-Age=${maxAgeSeconds}` : "";
  document.cookie = `${name}=${encodeURIComponent(value)}; Path=/; SameSite=Lax${secure}${maxAgeStr}`;
}

/**
 * Clears a cookie by expiring it immediately.
 */
function deleteCookie(name: string) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
}

/**
 * Reads token from storage (localStorage or sessionStorage).
 */
export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;

  try {
    const token =
      localStorage.getItem(ADMIN_TOKEN_KEY) ||
      sessionStorage.getItem(ADMIN_TOKEN_KEY);

    if (!token) return null;

    // Check if token is already expired
    if (isTokenExpired(token)) {
      clearSession();
      return null;
    }

    return token;
  } catch {
    return null;
  }
}

/**
 * Reads stored AdminUser metadata from storage.
 */
export function getStoredUser(): AdminUser | null {
  if (typeof window === "undefined") return null;

  try {
    const raw =
      localStorage.getItem(ADMIN_USER_KEY) ||
      sessionStorage.getItem(ADMIN_USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AdminUser;
  } catch {
    return null;
  }
}

/**
 * Reads saved email for "remember me" functionality.
 */
export function getSavedEmail(): string {
  if (typeof window === "undefined") return "";
  try {
    return localStorage.getItem(ADMIN_SAVED_EMAIL_KEY) || "";
  } catch {
    return "";
  }
}

/**
 * Persists or removes remembered email address based on rememberMe toggle.
 */
export function setSavedEmail(email: string, remember: boolean) {
  if (typeof window === "undefined") return;
  try {
    if (remember && email.trim()) {
      localStorage.setItem(ADMIN_SAVED_EMAIL_KEY, email.trim());
    } else {
      localStorage.removeItem(ADMIN_SAVED_EMAIL_KEY);
    }
  } catch {
    /* ignore */
  }
}

/**
 * Stores session in localStorage (or sessionStorage based on remember flag)
 * and synchronizes with an http cookie for server compatibility.
 */
export function storeSession(
  accessToken: string,
  user: AdminUser,
  rememberMe: boolean = true,
) {
  if (typeof window === "undefined") return;

  try {
    const payload = decodeJwtPayload(accessToken);
    const maxAgeSeconds =
      payload?.exp && typeof payload.exp === "number"
        ? Math.max(0, payload.exp - Math.floor(Date.now() / 1000))
        : 7 * 24 * 3600;

    // Clear both storages first to ensure clean state
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    localStorage.removeItem(ADMIN_USER_KEY);
    sessionStorage.removeItem(ADMIN_TOKEN_KEY);
    sessionStorage.removeItem(ADMIN_USER_KEY);

    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem(ADMIN_TOKEN_KEY, accessToken);
    storage.setItem(ADMIN_USER_KEY, JSON.stringify(user));
    localStorage.setItem(ADMIN_REMEMBER_KEY, rememberMe ? "true" : "false");

    // Sync cookie
    setCookie(
      ADMIN_TOKEN_KEY,
      accessToken,
      rememberMe ? maxAgeSeconds : undefined,
    );
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Failed to store admin session:", error);
    }
  }
}

/**
 * Completely clears token, user, cookies, and storage.
 */
export function clearSession() {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    localStorage.removeItem(ADMIN_USER_KEY);
    sessionStorage.removeItem(ADMIN_TOKEN_KEY);
    sessionStorage.removeItem(ADMIN_USER_KEY);
    deleteCookie(ADMIN_TOKEN_KEY);
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Failed to clear session:", error);
    }
  }
}

/**
 * Dispatches a custom window event to notify other components/tabs about session changes.
 */
export function dispatchSessionExpired(
  reason: LogoutReason = "session_expired",
) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent(SESSION_EXPIRED_EVENT, { detail: { reason } }),
  );
}

export function dispatchSessionLogout(reason: LogoutReason = "user_action") {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent(SESSION_LOGOUT_EVENT, { detail: { reason } }),
  );
}
