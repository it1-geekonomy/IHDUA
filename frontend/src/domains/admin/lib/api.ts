const API_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
  "http://localhost:6061/api";

export const ADMIN_TOKEN_KEY = "ihdua_admin_token";
export const ADMIN_USER_KEY = "ihdua_admin_user";

export type AdminUser = {
  id: string;
  fullName: string;
  email: string;
};

export type LoginResponse = {
  accessToken: string;
  tokenType: string;
  user: AdminUser;
};

export type AdminUserRow = {
  id: string;
  fullName: string;
  email: string;
  createdAt: string;
  updatedAt: string;
};

export type AdminDonationRow = {
  id: string;
  fullName: string;
  phone: string | null;
  email: string | null;
  city: string | null;
  pan: string | null;
  message: string | null;
  amount: string;
  currency: string;
  receiptNumber: string | null;
  razorpayPaymentId: string | null;
  razorpayOrderId: string | null;
  status: "pending" | "success" | "failed";
  createdAt: string;
  updatedAt: string;
};

async function parseError(res: Response) {
  try {
    const body = (await res.json()) as { message?: string | string[] };
    if (Array.isArray(body.message)) return body.message.join(", ");
    if (typeof body.message === "string") return body.message;
  } catch {
    /* ignore */
  }
  return `Request failed (${res.status})`;
}

function authHeaders(token?: string | null): HeadersInit {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

export function getStoredToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ADMIN_TOKEN_KEY);
}

export function getStoredUser(): AdminUser | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(ADMIN_USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AdminUser;
  } catch {
    return null;
  }
}

export function storeSession(accessToken: string, user: AdminUser) {
  localStorage.setItem(ADMIN_TOKEN_KEY, accessToken);
  localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(user));
}

export function clearSession() {
  localStorage.removeItem(ADMIN_TOKEN_KEY);
  localStorage.removeItem(ADMIN_USER_KEY);
}

export async function adminLogin(email: string, password: string) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error(await parseError(res));
  return (await res.json()) as LoginResponse;
}

export async function fetchAdminMe(token: string) {
  const res = await fetch(`${API_BASE}/auth/me`, {
    headers: authHeaders(token),
  });
  if (!res.ok) throw new Error(await parseError(res));
  return (await res.json()) as AdminUser;
}

export async function fetchUsers(token: string) {
  const res = await fetch(`${API_BASE}/users`, {
    headers: authHeaders(token),
  });
  if (!res.ok) throw new Error(await parseError(res));
  return (await res.json()) as AdminUserRow[];
}

export async function fetchDonations(token: string) {
  const res = await fetch(`${API_BASE}/donors`, {
    headers: authHeaders(token),
  });
  if (!res.ok) throw new Error(await parseError(res));
  return (await res.json()) as AdminDonationRow[];
}
