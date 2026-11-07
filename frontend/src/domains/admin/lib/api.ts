import {
  clearSession,
  dispatchSessionExpired,
  getSavedEmail,
  getStoredToken,
  getStoredUser,
  setSavedEmail,
  storeSession,
  ADMIN_TOKEN_KEY,
  ADMIN_USER_KEY,
  type AdminUser,
  type LogoutReason,
} from "./session";
import { isTokenExpired } from "./jwt";

export {
  ADMIN_TOKEN_KEY,
  ADMIN_USER_KEY,
  clearSession,
  getSavedEmail,
  getStoredToken,
  getStoredUser,
  setSavedEmail,
  storeSession,
  type AdminUser,
  type LogoutReason,
};

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
  "http://localhost:6061/api";

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

export class ApiError extends Error {
  statusCode: number;
  details?: unknown;

  constructor(message: string, statusCode: number, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.details = details;
  }
}

/**
 * Standard backend response envelope shape from NestJS ResponseTransformInterceptor.
 */
export type BackendEnvelope<T> = {
  statusCode: number;
  message: string;
  data: T;
};

/**
 * Unwraps `{ statusCode, message, data: T }` envelope, returning `T`.
 * If response is already unwrapped, returns payload directly.
 */
export function unwrapEnvelope<T>(payload: unknown): T {
  if (
    payload !== null &&
    typeof payload === "object" &&
    "data" in (payload as Record<string, unknown>)
  ) {
    if ("meta" in (payload as Record<string, unknown>)) {
      return {
        data: (payload as Record<string, unknown>).data,
        meta: (payload as Record<string, unknown>).meta,
      } as T;
    }
    return (payload as BackendEnvelope<T>).data;
  }
  return payload as T;
}

/**
 * Parses user-friendly error messages from backend responses.
 */
function extractErrorMessage(status: number, body: unknown): string {
  if (body && typeof body === "object") {
    const errorBody = body as { message?: string | string[]; error?: string };
    if (Array.isArray(errorBody.message) && errorBody.message.length > 0) {
      return errorBody.message.join(", ");
    }
    if (typeof errorBody.message === "string" && errorBody.message.trim().length > 0) {
      return errorBody.message;
    }
    if (typeof errorBody.error === "string" && errorBody.error.trim().length > 0) {
      return errorBody.error;
    }
  }

  if (status === 401) return "Invalid email or password.";
  if (status === 403) return "Access denied. Administrator privileges required.";
  if (status === 404) return "Requested resource was not found.";
  if (status === 500) return "Server encountered an error. Please try again shortly.";

  return `Request failed with status ${status}.`;
}

/**
 * Centralized fetch client with automatic headers, JWT expiration pre-checks,
 * 401 interceptor, and envelope unwrapping.
 */
// Deduplication cache for concurrent in-flight GET requests
const inFlightGetRequests = new Map<string, Promise<unknown>>();

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit & { token?: string | null; isPublic?: boolean } = {},
): Promise<T> {
  const { token, isPublic = false, headers: customHeaders, ...restOptions } = options;

  // Pre-flight check: if request requires a token, verify that it isn't expired
  if (!isPublic && token) {
    if (isTokenExpired(token)) {
      clearSession();
      dispatchSessionExpired("session_expired");
      throw new ApiError("Your session has expired. Please sign in again.", 401);
    }
  }

  const url = endpoint.startsWith("http")
    ? endpoint
    : `${API_BASE}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;

  const isGet = !restOptions.method || restOptions.method.toUpperCase() === "GET";
  const cacheKey = isGet ? `${token || "public"}:${url}` : null;

  // If identical GET is already in-flight, reuse its promise to prevent duplicate wire calls
  if (cacheKey && inFlightGetRequests.has(cacheKey)) {
    return inFlightGetRequests.get(cacheKey) as Promise<T>;
  }

  const execute = async (): Promise<T> => {
    const headers = new Headers(customHeaders);
    if (!headers.has("Content-Type") && !(restOptions.body instanceof FormData)) {
      headers.set("Content-Type", "application/json");
    }

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    let response: Response;
    try {
      response = await fetch(url, {
        ...restOptions,
        headers,
      });
    } catch (networkError) {
      throw new ApiError(
        "Unable to connect to the IHDUA API server. Please check your network connection.",
        0,
        networkError,
      );
    }

    // Intercept 401 Unauthorized globally
    if (response.status === 401) {
      // If not a public login request, this indicates token has expired or been revoked
      if (!isPublic) {
        clearSession();
        dispatchSessionExpired("unauthorized");
      }

      let errorData: unknown = null;
      try {
        errorData = await response.json();
      } catch {
        /* ignore */
      }

      const message = extractErrorMessage(response.status, errorData);
      throw new ApiError(message, response.status, errorData);
    }

    // Handle other HTTP errors
    if (!response.ok) {
      let errorData: unknown = null;
      try {
        errorData = await response.json();
      } catch {
        /* ignore */
      }

      const message = extractErrorMessage(response.status, errorData);
      throw new ApiError(message, response.status, errorData);
    }

    // Parse JSON and unwrap data envelope
    try {
      const rawJson = await response.json();
      return unwrapEnvelope<T>(rawJson);
    } catch (parseErr) {
      throw new ApiError("Failed to parse server response.", response.status, parseErr);
    }
  };

  if (cacheKey) {
    const fetchPromise = execute().finally(() => {
      // Clean up after resolution/rejection so subsequent actions make fresh requests
      setTimeout(() => inFlightGetRequests.delete(cacheKey), 80);
    });
    inFlightGetRequests.set(cacheKey, fetchPromise);
    return fetchPromise;
  }

  return execute();
}

/**
 * Authenticates the admin user and returns the token and profile.
 */
export async function adminLogin(
  email: string,
  password: string,
): Promise<LoginResponse> {
  return apiRequest<LoginResponse>("/auth/login", {
    method: "POST",
    isPublic: true,
    body: JSON.stringify({ email: email.trim(), password }),
  });
}

/**
 * Validates the token and retrieves the current authenticated admin user.
 */
export async function fetchAdminMe(token: string): Promise<AdminUser> {
  return apiRequest<AdminUser>("/auth/me", {
    token,
  });
}

/**
 * Fetches all users from the admin backend.
 */
export async function fetchUsers(token: string): Promise<AdminUserRow[]> {
  return apiRequest<AdminUserRow[]>("/users", {
    token,
  });
}

/**
 * Fetches all donations from the admin backend.
 */
export async function fetchDonations(token: string): Promise<AdminDonationRow[]> {
  return apiRequest<AdminDonationRow[]>("/donors", {
    token,
  });
}

export type LeadContact = {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  name: string;
  email: string;
  mobile: string;
  subject: string;
  message: string;
};

export type PaginationMeta = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type PaginatedLeadsResponse = {
  data: LeadContact[];
  meta: PaginationMeta;
};

export type LeadsQueryParams = {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
};

export async function fetchContactLeads(
  token: string,
  params: LeadsQueryParams = {},
): Promise<PaginatedLeadsResponse> {
  const query = new URLSearchParams();
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));
  if (params.search?.trim()) query.set("search", params.search.trim());
  if (params.status) query.set("status", params.status);

  const qs = query.toString();
  return apiRequest<PaginatedLeadsResponse>(
    `/leads-contact${qs ? `?${qs}` : ""}`,
    { token },
  );
}

export async function fetchDeletedContactLeads(
  token: string,
  params: LeadsQueryParams = {},
): Promise<PaginatedLeadsResponse> {
  const query = new URLSearchParams();
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));
  if (params.search?.trim()) query.set("search", params.search.trim());

  const qs = query.toString();
  return apiRequest<PaginatedLeadsResponse>(
    `/leads-contact/deleted${qs ? `?${qs}` : ""}`,
    { token },
  );
}

export async function fetchContactLeadById(
  token: string,
  id: string,
): Promise<LeadContact> {
  return apiRequest<LeadContact>(`/leads-contact/${id}`, { token });
}

export async function updateContactLead(
  token: string,
  id: string,
  data: Partial<Pick<LeadContact, "name" | "email" | "mobile" | "subject" | "message">>,
): Promise<LeadContact> {
  return apiRequest<LeadContact>(`/leads-contact/${id}`, {
    method: "PATCH",
    token,
    body: JSON.stringify(data),
  });
}

export async function deleteContactLead(
  token: string,
  id: string,
): Promise<void> {
  return apiRequest<void>(`/leads-contact/${id}`, {
    method: "DELETE",
    token,
  });
}

export async function restoreContactLead(
  token: string,
  id: string,
): Promise<LeadContact> {
  return apiRequest<LeadContact>(`/leads-contact/${id}/restore`, {
    method: "PATCH",
    token,
  });
}

export type LeadVolunteer = {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  fullName: string;
  email: string;
  phone: string;
  areaOfInterest: string;
  skills?: string | null;
  resumeUrl?: string | null;
};

export type PaginatedVolunteersResponse = {
  data: LeadVolunteer[];
  meta: PaginationMeta;
};

export async function fetchVolunteerLeads(
  token: string,
  params: LeadsQueryParams = {},
): Promise<PaginatedVolunteersResponse> {
  const query = new URLSearchParams();
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));
  if (params.search?.trim()) query.set("search", params.search.trim());

  const qs = query.toString();
  return apiRequest<PaginatedVolunteersResponse>(
    `/leads-volunteer${qs ? `?${qs}` : ""}`,
    { token },
  );
}

export async function fetchDeletedVolunteerLeads(
  token: string,
  params: LeadsQueryParams = {},
): Promise<PaginatedVolunteersResponse> {
  const query = new URLSearchParams();
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));
  if (params.search?.trim()) query.set("search", params.search.trim());

  const qs = query.toString();
  return apiRequest<PaginatedVolunteersResponse>(
    `/leads-volunteer/deleted${qs ? `?${qs}` : ""}`,
    { token },
  );
}

export async function fetchVolunteerLeadById(
  token: string,
  id: string,
): Promise<LeadVolunteer> {
  return apiRequest<LeadVolunteer>(`/leads-volunteer/${id}`, { token });
}

export async function updateVolunteerLead(
  token: string,
  id: string,
  data: Partial<Pick<LeadVolunteer, "fullName" | "email" | "phone" | "areaOfInterest" | "skills">>,
): Promise<LeadVolunteer> {
  return apiRequest<LeadVolunteer>(`/leads-volunteer/${id}`, {
    method: "PATCH",
    token,
    body: JSON.stringify(data),
  });
}

export async function deleteVolunteerLead(
  token: string,
  id: string,
): Promise<void> {
  return apiRequest<void>(`/leads-volunteer/${id}`, {
    method: "DELETE",
    token,
  });
}

export async function restoreVolunteerLead(
  token: string,
  id: string,
): Promise<LeadVolunteer> {
  return apiRequest<LeadVolunteer>(`/leads-volunteer/${id}/restore`, {
    method: "PATCH",
    token,
  });
}

/* ─────────────────────────────────────────────────────────────────────────────
   PARTNERSHIP INQUIRIES API ENDPOINTS
   ───────────────────────────────────────────────────────────────────────────── */

export type LeadPartnership = {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  yourName: string;
  orgName: string;
  phone: string;
  partnershipType: string;
  proposal?: string | null;
};

export type PaginatedPartnershipsResponse = {
  data: LeadPartnership[];
  meta: PaginationMeta;
};

export async function fetchPartnershipInquiries(
  token: string,
  params: LeadsQueryParams = {},
): Promise<PaginatedPartnershipsResponse> {
  const query = new URLSearchParams();
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));
  if (params.search?.trim()) query.set("search", params.search.trim());

  const qs = query.toString();
  return apiRequest<PaginatedPartnershipsResponse>(
    `/partnership-inquiries${qs ? `?${qs}` : ""}`,
    { token },
  );
}

export async function fetchDeletedPartnershipInquiries(
  token: string,
  params: LeadsQueryParams = {},
): Promise<PaginatedPartnershipsResponse> {
  const query = new URLSearchParams();
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));
  if (params.search?.trim()) query.set("search", params.search.trim());

  const qs = query.toString();
  return apiRequest<PaginatedPartnershipsResponse>(
    `/partnership-inquiries/deleted${qs ? `?${qs}` : ""}`,
    { token },
  );
}

export async function fetchPartnershipInquiryById(
  token: string,
  id: string,
): Promise<LeadPartnership> {
  return apiRequest<LeadPartnership>(`/partnership-inquiries/${id}`, { token });
}

export async function updatePartnershipInquiry(
  token: string,
  id: string,
  data: Partial<Pick<LeadPartnership, "yourName" | "orgName" | "phone" | "partnershipType" | "proposal">>,
): Promise<LeadPartnership> {
  return apiRequest<LeadPartnership>(`/partnership-inquiries/${id}`, {
    method: "PATCH",
    token,
    body: JSON.stringify(data),
  });
}

export async function deletePartnershipInquiry(
  token: string,
  id: string,
): Promise<void> {
  return apiRequest<void>(`/partnership-inquiries/${id}`, {
    method: "DELETE",
    token,
  });
}

export async function restorePartnershipInquiry(
  token: string,
  id: string,
): Promise<LeadPartnership> {
  return apiRequest<LeadPartnership>(`/partnership-inquiries/${id}/restore`, {
    method: "PATCH",
    token,
  });
}

// ─────────────────────────────────────────────────────────────
// Terms & Conditions API Types and Client Functions
// ─────────────────────────────────────────────────────────────

export type ContentStatus = "draft" | "published" | "archived";

export type TermsAndConditionsItem = {
  id: string;
  title: string;
  content: string;
  status: ContentStatus;
  metaTitle: string | null;
  metaDescription: string | null;
  schemaCode: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

export type CreateTermsAndConditionsDto = {
  title: string;
  content: string;
  status?: ContentStatus;
  metaTitle?: string;
  metaDescription?: string;
  schemaCode?: string;
};

export type UpdateTermsAndConditionsDto = Partial<CreateTermsAndConditionsDto>;

export type TermsQueryParams = {
  page?: number;
  limit?: number;
  search?: string;
  status?: ContentStatus;
};

export type PaginatedTermsResponse = {
  data: TermsAndConditionsItem[];
  meta: PaginationMeta;
};

export async function fetchTermsAndConditions(
  token: string,
  params: TermsQueryParams = {},
): Promise<PaginatedTermsResponse> {
  const query = new URLSearchParams();
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));
  if (params.search?.trim()) query.set("search", params.search.trim());
  if (params.status) query.set("status", params.status);

  const qs = query.toString();
  return apiRequest<PaginatedTermsResponse>(
    `/terms-and-conditions${qs ? `?${qs}` : ""}`,
    { token },
  );
}

export async function fetchDeletedTermsAndConditions(
  token: string,
  params: TermsQueryParams = {},
): Promise<PaginatedTermsResponse> {
  const query = new URLSearchParams();
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));
  if (params.search?.trim()) query.set("search", params.search.trim());

  const qs = query.toString();
  return apiRequest<PaginatedTermsResponse>(
    `/terms-and-conditions/deleted${qs ? `?${qs}` : ""}`,
    { token },
  );
}

export async function fetchTermsAndConditionsById(
  token: string,
  id: string,
): Promise<TermsAndConditionsItem> {
  return apiRequest<TermsAndConditionsItem>(`/terms-and-conditions/${id}`, { token });
}

export async function fetchPublishedTermsAndConditions(): Promise<TermsAndConditionsItem> {
  return apiRequest<TermsAndConditionsItem>("/terms-and-conditions/published", {
    isPublic: true,
  });
}

export async function createTermsAndConditions(
  token: string,
  data: CreateTermsAndConditionsDto,
): Promise<TermsAndConditionsItem> {
  return apiRequest<TermsAndConditionsItem>("/terms-and-conditions", {
    method: "POST",
    token,
    body: JSON.stringify(data),
  });
}

export async function updateTermsAndConditions(
  token: string,
  id: string,
  data: UpdateTermsAndConditionsDto,
): Promise<TermsAndConditionsItem> {
  return apiRequest<TermsAndConditionsItem>(`/terms-and-conditions/${id}`, {
    method: "PATCH",
    token,
    body: JSON.stringify(data),
  });
}

export async function deleteTermsAndConditions(
  token: string,
  id: string,
): Promise<void> {
  return apiRequest<void>(`/terms-and-conditions/${id}`, {
    method: "DELETE",
    token,
  });
}

export async function restoreTermsAndConditions(
  token: string,
  id: string,
): Promise<TermsAndConditionsItem> {
  return apiRequest<TermsAndConditionsItem>(`/terms-and-conditions/${id}/restore`, {
    method: "PATCH",
    token,
  });
}

// ─────────────────────────────────────────────────────────────
// Privacy Policy API Types and Client Functions
// ─────────────────────────────────────────────────────────────

export type PrivacyPolicyItem = {
  id: string;
  title: string;
  content: string;
  status: ContentStatus;
  metaTitle: string | null;
  metaDescription: string | null;
  schemaCode: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

export type CreatePrivacyPolicyDto = {
  title: string;
  content: string;
  status?: ContentStatus;
  metaTitle?: string;
  metaDescription?: string;
  schemaCode?: string;
};

export type UpdatePrivacyPolicyDto = Partial<CreatePrivacyPolicyDto>;

export type PrivacyPolicyQueryParams = {
  page?: number;
  limit?: number;
  search?: string;
  status?: ContentStatus;
};

export type PaginatedPrivacyPolicyResponse = {
  data: PrivacyPolicyItem[];
  meta: PaginationMeta;
};

export async function fetchPrivacyPolicies(
  token: string,
  params: PrivacyPolicyQueryParams = {},
): Promise<PaginatedPrivacyPolicyResponse> {
  const query = new URLSearchParams();
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));
  if (params.search?.trim()) query.set("search", params.search.trim());
  if (params.status) query.set("status", params.status);

  const qs = query.toString();
  return apiRequest<PaginatedPrivacyPolicyResponse>(
    `/privacy-policy${qs ? `?${qs}` : ""}`,
    { token },
  );
}

export async function fetchDeletedPrivacyPolicies(
  token: string,
  params: PrivacyPolicyQueryParams = {},
): Promise<PaginatedPrivacyPolicyResponse> {
  const query = new URLSearchParams();
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));
  if (params.search?.trim()) query.set("search", params.search.trim());

  const qs = query.toString();
  return apiRequest<PaginatedPrivacyPolicyResponse>(
    `/privacy-policy/deleted${qs ? `?${qs}` : ""}`,
    { token },
  );
}

export async function fetchPrivacyPolicyById(
  token: string,
  id: string,
): Promise<PrivacyPolicyItem> {
  return apiRequest<PrivacyPolicyItem>(`/privacy-policy/${id}`, { token });
}

export async function fetchPublishedPrivacyPolicy(): Promise<PrivacyPolicyItem> {
  return apiRequest<PrivacyPolicyItem>("/privacy-policy/published", {
    isPublic: true,
  });
}

export async function createPrivacyPolicy(
  token: string,
  data: CreatePrivacyPolicyDto,
): Promise<PrivacyPolicyItem> {
  return apiRequest<PrivacyPolicyItem>("/privacy-policy", {
    method: "POST",
    token,
    body: JSON.stringify(data),
  });
}

export async function updatePrivacyPolicy(
  token: string,
  id: string,
  data: UpdatePrivacyPolicyDto,
): Promise<PrivacyPolicyItem> {
  return apiRequest<PrivacyPolicyItem>(`/privacy-policy/${id}`, {
    method: "PATCH",
    token,
    body: JSON.stringify(data),
  });
}

export async function deletePrivacyPolicy(
  token: string,
  id: string,
): Promise<void> {
  return apiRequest<void>(`/privacy-policy/${id}`, {
    method: "DELETE",
    token,
  });
}

export async function restorePrivacyPolicy(
  token: string,
  id: string,
): Promise<PrivacyPolicyItem> {
  return apiRequest<PrivacyPolicyItem>(`/privacy-policy/${id}/restore`, {
    method: "PATCH",
    token,
  });
}

/* ==========================================================================
   Annual Reports Management API
   ========================================================================== */

export interface AnnualReportItem {
  id: string;
  title: string;
  reportYear: string;
  fileUrl: string;
  sortOrder: number;
  status: ContentStatus;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface PaginatedAnnualReportsResponse {
  data: AnnualReportItem[];
  meta: PaginationMeta;
}

export interface AnnualReportQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: ContentStatus;
  reportYear?: string;
}

export interface CreateAnnualReportInput {
  title: string;
  reportYear: string;
  sortOrder?: number;
  status?: ContentStatus;
  file: File;
}

export interface UpdateAnnualReportInput {
  title?: string;
  reportYear?: string;
  sortOrder?: number;
  status?: ContentStatus;
  file?: File;
}

export async function fetchAnnualReports(
  token: string,
  params: AnnualReportQueryParams = {},
): Promise<PaginatedAnnualReportsResponse> {
  const query = new URLSearchParams();
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));
  if (params.search?.trim()) query.set("search", params.search.trim());
  if (params.status) query.set("status", params.status);
  if (params.reportYear?.trim()) query.set("reportYear", params.reportYear.trim());

  const qs = query.toString();
  return apiRequest<PaginatedAnnualReportsResponse>(
    `/annual-reports${qs ? `?${qs}` : ""}`,
    { token },
  );
}

export async function fetchDeletedAnnualReports(
  token: string,
  params: { page?: number; limit?: number; search?: string } = {},
): Promise<PaginatedAnnualReportsResponse> {
  const query = new URLSearchParams();
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));
  if (params.search?.trim()) query.set("search", params.search.trim());

  const qs = query.toString();
  return apiRequest<PaginatedAnnualReportsResponse>(
    `/annual-reports/deleted${qs ? `?${qs}` : ""}`,
    { token },
  );
}

export async function fetchAnnualReportById(
  token: string,
  id: string,
): Promise<AnnualReportItem> {
  return apiRequest<AnnualReportItem>(`/annual-reports/${id}`, { token });
}

export async function fetchPublishedAnnualReports(): Promise<AnnualReportItem[]> {
  return apiRequest<AnnualReportItem[]>("/annual-reports/published", {
    isPublic: true,
  });
}

export async function createAnnualReport(
  token: string,
  input: CreateAnnualReportInput,
): Promise<AnnualReportItem> {
  const formData = new FormData();
  formData.append("title", input.title);
  formData.append("reportYear", input.reportYear);
  if (input.sortOrder !== undefined) {
    formData.append("sortOrder", String(input.sortOrder));
  }
  if (input.status) {
    formData.append("status", input.status);
  }
  formData.append("file", input.file);

  return apiRequest<AnnualReportItem>("/annual-reports", {
    method: "POST",
    token,
    body: formData,
  });
}

export async function updateAnnualReport(
  token: string,
  id: string,
  input: UpdateAnnualReportInput,
): Promise<AnnualReportItem> {
  const formData = new FormData();
  if (input.title !== undefined) formData.append("title", input.title);
  if (input.reportYear !== undefined) formData.append("reportYear", input.reportYear);
  if (input.sortOrder !== undefined) formData.append("sortOrder", String(input.sortOrder));
  if (input.status) formData.append("status", input.status);
  if (input.file) formData.append("file", input.file);

  return apiRequest<AnnualReportItem>(`/annual-reports/${id}`, {
    method: "PATCH",
    token,
    body: formData,
  });
}

export async function deleteAnnualReport(
  token: string,
  id: string,
): Promise<void> {
  return apiRequest<void>(`/annual-reports/${id}`, {
    method: "DELETE",
    token,
  });
}

export async function restoreAnnualReport(
  token: string,
  id: string,
): Promise<AnnualReportItem> {
  return apiRequest<AnnualReportItem>(`/annual-reports/${id}/restore`, {
    method: "PATCH",
    token,
  });
}

/* ==========================================================================
   Newsletter Subscribers Management API
   ========================================================================== */

export interface NewsletterSubscriberItem {
  id: string;
  email: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface PaginatedNewsletterSubscribersResponse {
  data: NewsletterSubscriberItem[];
  meta: PaginationMeta;
}

export interface NewsletterSubscriberQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  includeDeleted?: boolean;
  onlyDeleted?: boolean;
}

export interface UpdateNewsletterSubscriberDto {
  email?: string;
  isActive?: boolean;
}

export async function subscribeNewsletter(
  email: string,
): Promise<NewsletterSubscriberItem> {
  return apiRequest<NewsletterSubscriberItem>("/newsletter-subscribers", {
    method: "POST",
    isPublic: true,
    body: JSON.stringify({ email: email.trim().toLowerCase() }),
  });
}

export async function fetchNewsletterSubscribers(
  token: string,
  params: NewsletterSubscriberQueryParams = {},
): Promise<PaginatedNewsletterSubscribersResponse> {
  const query = new URLSearchParams();
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));
  if (params.search?.trim()) query.set("search", params.search.trim());
  if (params.includeDeleted) query.set("includeDeleted", "true");
  if (params.onlyDeleted) query.set("onlyDeleted", "true");

  const qs = query.toString();
  return apiRequest<PaginatedNewsletterSubscribersResponse>(
    `/newsletter-subscribers${qs ? `?${qs}` : ""}`,
    { token },
  );
}

export async function fetchDeletedNewsletterSubscribers(
  token: string,
  params: { page?: number; limit?: number; search?: string } = {},
): Promise<PaginatedNewsletterSubscribersResponse> {
  return fetchNewsletterSubscribers(token, {
    ...params,
    includeDeleted: true,
    onlyDeleted: true,
  });
}

export async function fetchNewsletterSubscriberById(
  token: string,
  id: string,
): Promise<NewsletterSubscriberItem> {
  return apiRequest<NewsletterSubscriberItem>(`/newsletter-subscribers/${id}`, {
    token,
  });
}

export async function updateNewsletterSubscriber(
  token: string,
  id: string,
  data: UpdateNewsletterSubscriberDto,
): Promise<NewsletterSubscriberItem> {
  return apiRequest<NewsletterSubscriberItem>(`/newsletter-subscribers/${id}`, {
    method: "PATCH",
    token,
    body: JSON.stringify(data),
  });
}

export async function deleteNewsletterSubscriber(
  token: string,
  id: string,
): Promise<void> {
  return apiRequest<void>(`/newsletter-subscribers/${id}`, {
    method: "DELETE",
    token,
  });
}

export async function restoreNewsletterSubscriber(
  token: string,
  id: string,
): Promise<NewsletterSubscriberItem> {
  return apiRequest<NewsletterSubscriberItem>(
    `/newsletter-subscribers/${id}/restore`,
    {
      method: "PATCH",
      token,
    },
  );
}

/* ==========================================================================
   Organizational Documents Management API
   ========================================================================== */

export interface OrganizationalDocumentItem {
  id: string;
  title: string;
  fileUrl: string;
  sortOrder: number;
  status: ContentStatus;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface PaginatedOrganizationalDocumentsResponse {
  data: OrganizationalDocumentItem[];
  meta: PaginationMeta;
}

export interface OrganizationalDocumentQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: ContentStatus;
  includeDeleted?: boolean;
  onlyDeleted?: boolean;
}

export interface CreateOrganizationalDocumentInput {
  title: string;
  sortOrder?: number;
  status?: ContentStatus;
  file: File;
}

export interface UpdateOrganizationalDocumentInput {
  title?: string;
  sortOrder?: number;
  status?: ContentStatus;
  file?: File;
}

export async function fetchOrganizationalDocuments(
  token: string,
  params: OrganizationalDocumentQueryParams = {},
): Promise<PaginatedOrganizationalDocumentsResponse> {
  const query = new URLSearchParams();
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));
  if (params.search?.trim()) query.set("search", params.search.trim());
  if (params.status) query.set("status", params.status);
  if (params.includeDeleted) query.set("includeDeleted", "true");
  if (params.onlyDeleted) query.set("onlyDeleted", "true");

  const qs = query.toString();
  return apiRequest<PaginatedOrganizationalDocumentsResponse>(
    `/organizational-documents${qs ? `?${qs}` : ""}`,
    { token },
  );
}

export async function fetchDeletedOrganizationalDocuments(
  token: string,
  params: { page?: number; limit?: number; search?: string } = {},
): Promise<PaginatedOrganizationalDocumentsResponse> {
  const query = new URLSearchParams();
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));
  if (params.search?.trim()) query.set("search", params.search.trim());

  const qs = query.toString();
  return apiRequest<PaginatedOrganizationalDocumentsResponse>(
    `/organizational-documents/deleted${qs ? `?${qs}` : ""}`,
    { token },
  );
}

export async function fetchOrganizationalDocumentById(
  token: string,
  id: string,
): Promise<OrganizationalDocumentItem> {
  return apiRequest<OrganizationalDocumentItem>(
    `/organizational-documents/${id}`,
    { token },
  );
}

export async function fetchPublishedOrganizationalDocuments(): Promise<
  OrganizationalDocumentItem[]
> {
  return apiRequest<OrganizationalDocumentItem[]>(
    "/organizational-documents/published",
    {
      isPublic: true,
    },
  );
}

export async function createOrganizationalDocument(
  token: string,
  input: CreateOrganizationalDocumentInput,
): Promise<OrganizationalDocumentItem> {
  const formData = new FormData();
  formData.append("title", input.title);
  if (input.sortOrder !== undefined) {
    formData.append("sortOrder", String(input.sortOrder));
  }
  if (input.status) {
    formData.append("status", input.status);
  }
  formData.append("file", input.file);

  return apiRequest<OrganizationalDocumentItem>("/organizational-documents", {
    method: "POST",
    token,
    body: formData,
  });
}

export async function updateOrganizationalDocument(
  token: string,
  id: string,
  input: UpdateOrganizationalDocumentInput,
): Promise<OrganizationalDocumentItem> {
  const formData = new FormData();
  if (input.title !== undefined) formData.append("title", input.title);
  if (input.sortOrder !== undefined) {
    formData.append("sortOrder", String(input.sortOrder));
  }
  if (input.status) formData.append("status", input.status);
  if (input.file) formData.append("file", input.file);

  return apiRequest<OrganizationalDocumentItem>(
    `/organizational-documents/${id}`,
    {
      method: "PATCH",
      token,
      body: formData,
    },
  );
}

export async function deleteOrganizationalDocument(
  token: string,
  id: string,
): Promise<void> {
  return apiRequest<void>(`/organizational-documents/${id}`, {
    method: "DELETE",
    token,
  });
}

export async function restoreOrganizationalDocument(
  token: string,
  id: string,
): Promise<OrganizationalDocumentItem> {
  return apiRequest<OrganizationalDocumentItem>(
    `/organizational-documents/${id}/restore`,
    {
      method: "PATCH",
      token,
    },
  );
}

// ─────────────────────────────────────────────────────────────
// Blog Categories
// ─────────────────────────────────────────────────────────────

export interface BlogCategoryItem {
  id: string;
  name: string;
  slug?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface BlogCategoryQueryParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface PaginatedBlogCategoriesResponse {
  data: BlogCategoryItem[];
  meta: PaginationMeta;
}

export interface CreateBlogCategoryInput {
  name: string;
  slug?: string;
}

export interface UpdateBlogCategoryInput {
  name?: string;
  slug?: string;
}

export async function fetchBlogCategories(
  token?: string | null,
  params: BlogCategoryQueryParams = {},
): Promise<PaginatedBlogCategoriesResponse> {
  const query = new URLSearchParams();
  if (params.page !== undefined) query.set("page", String(params.page));
  if (params.limit !== undefined) query.set("limit", String(params.limit));
  if (params.search && params.search.trim()) query.set("search", params.search.trim());

  const qs = query.toString();
  return apiRequest<PaginatedBlogCategoriesResponse>(
    `/blog-categories${qs ? `?${qs}` : ""}`,
    {
      token: token || undefined,
      isPublic: !token,
    },
  );
}

export async function fetchDeletedBlogCategories(
  token: string,
  params: BlogCategoryQueryParams = {},
): Promise<PaginatedBlogCategoriesResponse> {
  const query = new URLSearchParams();
  if (params.page !== undefined) query.set("page", String(params.page));
  if (params.limit !== undefined) query.set("limit", String(params.limit));
  if (params.search && params.search.trim()) query.set("search", params.search.trim());

  const qs = query.toString();
  return apiRequest<PaginatedBlogCategoriesResponse>(
    `/blog-categories/deleted${qs ? `?${qs}` : ""}`,
    { token },
  );
}

export async function fetchBlogCategoryById(
  token: string,
  id: string,
): Promise<BlogCategoryItem> {
  return apiRequest<BlogCategoryItem>(`/blog-categories/${id}`, { token });
}

export async function createBlogCategory(
  token: string,
  input: CreateBlogCategoryInput,
): Promise<BlogCategoryItem> {
  return apiRequest<BlogCategoryItem>("/blog-categories", {
    method: "POST",
    token,
    body: JSON.stringify(input),
  });
}

export async function updateBlogCategory(
  token: string,
  id: string,
  input: UpdateBlogCategoryInput,
): Promise<BlogCategoryItem> {
  return apiRequest<BlogCategoryItem>(`/blog-categories/${id}`, {
    method: "PATCH",
    token,
    body: JSON.stringify(input),
  });
}

export async function deleteBlogCategory(
  token: string,
  id: string,
): Promise<void> {
  return apiRequest<void>(`/blog-categories/${id}`, {
    method: "DELETE",
    token,
  });
}

export async function restoreBlogCategory(
  token: string,
  id: string,
): Promise<BlogCategoryItem> {
  return apiRequest<BlogCategoryItem>(`/blog-categories/${id}/restore`, {
    method: "PATCH",
    token,
  });
}

// ─────────────────────────────────────────────────────────────
// Blogs and Stories
// ─────────────────────────────────────────────────────────────

export interface BlogAndStoryItem {
  id: string;
  title: string;
  slug: string;
  categoryId: string | null;
  category?: BlogCategoryItem | null;
  blogBanner: string | null;
  blogDate: string | null;
  content: string | null;
  shortDescription: string | null;
  status: ContentStatus;
  metaTitle?: string | null;
  metaDescription?: string | null;
  schemaCode?: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface BlogAndStoryQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  status?: ContentStatus;
  sort?: "newest" | "oldest" | string;
}

export interface PaginatedBlogsAndStoriesResponse {
  data: BlogAndStoryItem[];
  meta: PaginationMeta;
}

export interface CreateBlogAndStoryInput {
  title: string;
  slug: string;
  categoryId?: string | null;
  file?: File | null;
  blogBanner?: string | null;
  blogDate?: string | null;
  content?: string | null;
  shortDescription?: string | null;
  status?: ContentStatus;
  metaTitle?: string | null;
  metaDescription?: string | null;
  schemaCode?: string | null;
}

export interface UpdateBlogAndStoryInput {
  title?: string;
  slug?: string;
  categoryId?: string | null;
  file?: File | null;
  blogBanner?: string | null;
  blogDate?: string | null;
  content?: string | null;
  shortDescription?: string | null;
  status?: ContentStatus;
  metaTitle?: string | null;
  metaDescription?: string | null;
  schemaCode?: string | null;
}

export async function fetchBlogsAndStories(
  token: string,
  params: BlogAndStoryQueryParams = {},
): Promise<PaginatedBlogsAndStoriesResponse> {
  const query = new URLSearchParams();
  if (params.page !== undefined) query.set("page", String(params.page));
  if (params.limit !== undefined) query.set("limit", String(params.limit));
  if (params.search && params.search.trim()) query.set("search", params.search.trim());
  if (params.categoryId && params.categoryId.trim()) query.set("categoryId", params.categoryId.trim());
  if (params.status) query.set("status", params.status);
  if (params.sort) query.set("sort", params.sort);

  const qs = query.toString();
  return apiRequest<PaginatedBlogsAndStoriesResponse>(
    `/blogs-and-stories${qs ? `?${qs}` : ""}`,
    { token },
  );
}

export async function fetchDeletedBlogsAndStories(
  token: string,
  params: BlogAndStoryQueryParams = {},
): Promise<PaginatedBlogsAndStoriesResponse> {
  const query = new URLSearchParams();
  if (params.page !== undefined) query.set("page", String(params.page));
  if (params.limit !== undefined) query.set("limit", String(params.limit));
  if (params.search && params.search.trim()) query.set("search", params.search.trim());
  if (params.categoryId && params.categoryId.trim()) query.set("categoryId", params.categoryId.trim());
  if (params.sort) query.set("sort", params.sort);

  const qs = query.toString();
  return apiRequest<PaginatedBlogsAndStoriesResponse>(
    `/blogs-and-stories/deleted${qs ? `?${qs}` : ""}`,
    { token },
  );
}

export async function fetchPublishedBlogs(
  params: BlogAndStoryQueryParams = {},
): Promise<PaginatedBlogsAndStoriesResponse> {
  const query = new URLSearchParams();
  if (params.page !== undefined) query.set("page", String(params.page));
  if (params.limit !== undefined) query.set("limit", String(params.limit));
  if (params.search && params.search.trim()) query.set("search", params.search.trim());
  if (params.categoryId && params.categoryId.trim()) query.set("categoryId", params.categoryId.trim());
  if (params.sort) query.set("sort", params.sort);

  const qs = query.toString();
  return apiRequest<PaginatedBlogsAndStoriesResponse>(
    `/blogs-and-stories/published${qs ? `?${qs}` : ""}`,
    { isPublic: true },
  );
}

export async function fetchBlogAndStoryById(
  token: string,
  id: string,
): Promise<BlogAndStoryItem> {
  return apiRequest<BlogAndStoryItem>(`/blogs-and-stories/${id}`, { token });
}

export async function fetchPublishedBlogBySlug(
  slug: string,
  limit = 3,
  page = 1,
): Promise<BlogAndStoryItem & { relatedStories?: BlogAndStoryItem[] }> {
  return apiRequest<BlogAndStoryItem & { relatedStories?: BlogAndStoryItem[] }>(
    `/blogs-and-stories/published/slug/${encodeURIComponent(slug)}?limit=${limit}&page=${page}`,
    { isPublic: true },
  );
}

export async function createBlogAndStory(
  token: string,
  input: CreateBlogAndStoryInput,
): Promise<BlogAndStoryItem> {
  const formData = new FormData();
  formData.append("title", input.title);
  formData.append("slug", input.slug);
  if (input.categoryId) {
    formData.append("categoryId", input.categoryId);
  }
  if (input.blogDate) {
    formData.append("blogDate", input.blogDate);
  }
  if (input.shortDescription !== undefined && input.shortDescription !== null) {
    formData.append("shortDescription", input.shortDescription);
  }
  if (input.content !== undefined && input.content !== null) {
    formData.append("content", input.content);
  }
  if (input.status) {
    formData.append("status", input.status);
  }
  if (input.metaTitle !== undefined && input.metaTitle !== null) {
    formData.append("metaTitle", input.metaTitle);
  }
  if (input.metaDescription !== undefined && input.metaDescription !== null) {
    formData.append("metaDescription", input.metaDescription);
  }
  if (input.schemaCode !== undefined && input.schemaCode !== null) {
    formData.append("schemaCode", input.schemaCode);
  }
  if (input.file) {
    formData.append("blogBanner", input.file);
  } else if (input.blogBanner) {
    formData.append("blogBanner", input.blogBanner);
  }

  return apiRequest<BlogAndStoryItem>("/blogs-and-stories", {
    method: "POST",
    token,
    body: formData,
  });
}

export async function updateBlogAndStory(
  token: string,
  id: string,
  input: UpdateBlogAndStoryInput,
): Promise<BlogAndStoryItem> {
  const formData = new FormData();
  if (input.title !== undefined) formData.append("title", input.title);
  if (input.slug !== undefined) formData.append("slug", input.slug);
  if (input.categoryId !== undefined) {
    formData.append("categoryId", input.categoryId || "");
  }
  if (input.blogDate !== undefined) {
    formData.append("blogDate", input.blogDate || "");
  }
  if (input.shortDescription !== undefined) {
    formData.append("shortDescription", input.shortDescription || "");
  }
  if (input.content !== undefined) {
    formData.append("content", input.content || "");
  }
  if (input.status) {
    formData.append("status", input.status);
  }
  if (input.metaTitle !== undefined) {
    formData.append("metaTitle", input.metaTitle || "");
  }
  if (input.metaDescription !== undefined) {
    formData.append("metaDescription", input.metaDescription || "");
  }
  if (input.schemaCode !== undefined) {
    formData.append("schemaCode", input.schemaCode || "");
  }
  if (input.file) {
    formData.append("blogBanner", input.file);
  } else if (input.blogBanner !== undefined) {
    formData.append("blogBanner", input.blogBanner || "");
  }

  return apiRequest<BlogAndStoryItem>(`/blogs-and-stories/${id}`, {
    method: "PATCH",
    token,
    body: formData,
  });
}

export async function deleteBlogAndStory(
  token: string,
  id: string,
): Promise<void> {
  return apiRequest<void>(`/blogs-and-stories/${id}`, {
    method: "DELETE",
    token,
  });
}

export async function restoreBlogAndStory(
  token: string,
  id: string,
): Promise<BlogAndStoryItem> {
  return apiRequest<BlogAndStoryItem>(`/blogs-and-stories/${id}/restore`, {
    method: "PATCH",
    token,
  });
}

// ─────────────────────────────────────────────────────────────
// Milestones
// ─────────────────────────────────────────────────────────────

export interface MilestoneItem {
  id: string;
  year: string;
  description: string;
  status: ContentStatus;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface MilestoneQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: ContentStatus;
}

export interface PaginatedMilestonesResponse {
  data: MilestoneItem[];
  meta: PaginationMeta;
}

export interface CreateMilestoneInput {
  year: string;
  description: string;
  status?: ContentStatus;
}

export interface UpdateMilestoneInput {
  year?: string;
  description?: string;
  status?: ContentStatus;
}

export async function fetchMilestones(
  token: string,
  params: MilestoneQueryParams = {},
): Promise<PaginatedMilestonesResponse> {
  const query = new URLSearchParams();
  if (params.page !== undefined) query.set("page", String(params.page));
  if (params.limit !== undefined) query.set("limit", String(params.limit));
  if (params.search && params.search.trim()) query.set("search", params.search.trim());
  if (params.status) query.set("status", params.status);

  const qs = query.toString();
  return apiRequest<PaginatedMilestonesResponse>(
    `/milestones${qs ? `?${qs}` : ""}`,
    { token },
  );
}

export async function fetchDeletedMilestones(
  token: string,
  params: MilestoneQueryParams = {},
): Promise<PaginatedMilestonesResponse> {
  const query = new URLSearchParams();
  if (params.page !== undefined) query.set("page", String(params.page));
  if (params.limit !== undefined) query.set("limit", String(params.limit));
  if (params.search && params.search.trim()) query.set("search", params.search.trim());

  const qs = query.toString();
  return apiRequest<PaginatedMilestonesResponse>(
    `/milestones/deleted${qs ? `?${qs}` : ""}`,
    { token },
  );
}

export async function fetchMilestonesYearWise(): Promise<MilestoneItem[]> {
  return apiRequest<MilestoneItem[]>("/milestones/year-wise", {
    isPublic: true,
  });
}

export async function fetchMilestoneById(
  token: string,
  id: string,
): Promise<MilestoneItem> {
  return apiRequest<MilestoneItem>(`/milestones/${id}`, { token });
}

export async function createMilestone(
  token: string,
  input: CreateMilestoneInput,
): Promise<MilestoneItem> {
  return apiRequest<MilestoneItem>("/milestones", {
    method: "POST",
    token,
    body: JSON.stringify(input),
  });
}

export async function updateMilestone(
  token: string,
  id: string,
  input: UpdateMilestoneInput,
): Promise<MilestoneItem> {
  return apiRequest<MilestoneItem>(`/milestones/${id}`, {
    method: "PATCH",
    token,
    body: JSON.stringify(input),
  });
}

export async function deleteMilestone(
  token: string,
  id: string,
): Promise<void> {
  return apiRequest<void>(`/milestones/${id}`, {
    method: "DELETE",
    token,
  });
}

export async function restoreMilestone(
  token: string,
  id: string,
): Promise<MilestoneItem> {
  return apiRequest<MilestoneItem>(`/milestones/${id}/restore`, {
    method: "PATCH",
    token,
  });
}

// ─────────────────────────────────────────────────────────────
// Home Banners
// ─────────────────────────────────────────────────────────────

export interface HomeBannerItem {
  id: string;
  bannerImageUrl: string;
  status: ContentStatus;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface HomeBannerQueryParams {
  page?: number;
  limit?: number;
  status?: ContentStatus;
  search?: string;
}

export interface PaginatedHomeBannersResponse {
  data: HomeBannerItem[];
  meta: PaginationMeta;
}

export interface CreateHomeBannerInput {
  file: File;
  status?: ContentStatus;
}

export interface UpdateHomeBannerInput {
  file?: File;
  status?: ContentStatus;
}

export async function fetchHomeBanners(
  token: string,
  params: HomeBannerQueryParams = {},
): Promise<PaginatedHomeBannersResponse> {
  const query = new URLSearchParams();
  if (params.page !== undefined) query.set("page", String(params.page));
  if (params.limit !== undefined) query.set("limit", String(params.limit));
  if (params.search && params.search.trim()) query.set("search", params.search.trim());
  if (params.status) query.set("status", params.status);

  const qs = query.toString();
  return apiRequest<PaginatedHomeBannersResponse>(
    `/home-banners${qs ? `?${qs}` : ""}`,
    { token },
  );
}

export async function fetchDeletedHomeBanners(
  token: string,
  params: HomeBannerQueryParams = {},
): Promise<PaginatedHomeBannersResponse> {
  const query = new URLSearchParams();
  if (params.page !== undefined) query.set("page", String(params.page));
  if (params.limit !== undefined) query.set("limit", String(params.limit));
  if (params.search && params.search.trim()) query.set("search", params.search.trim());

  const qs = query.toString();
  return apiRequest<PaginatedHomeBannersResponse>(
    `/home-banners/deleted${qs ? `?${qs}` : ""}`,
    { token },
  );
}

export async function fetchPublishedHomeBanners(): Promise<HomeBannerItem[]> {
  return apiRequest<HomeBannerItem[]>("/home-banners/published", {
    isPublic: true,
  });
}

export async function fetchHomeBannerById(
  token: string,
  id: string,
): Promise<HomeBannerItem> {
  return apiRequest<HomeBannerItem>(`/home-banners/${id}`, { token });
}

export async function createHomeBanner(
  token: string,
  input: CreateHomeBannerInput,
): Promise<HomeBannerItem> {
  const formData = new FormData();
  formData.append("bannerImage", input.file);
  if (input.status) {
    formData.append("status", input.status);
  }

  return apiRequest<HomeBannerItem>("/home-banners", {
    method: "POST",
    token,
    body: formData,
  });
}

export async function updateHomeBanner(
  token: string,
  id: string,
  input: UpdateHomeBannerInput,
): Promise<HomeBannerItem> {
  const formData = new FormData();
  if (input.file) {
    formData.append("bannerImage", input.file);
  }
  if (input.status) {
    formData.append("status", input.status);
  }

  return apiRequest<HomeBannerItem>(`/home-banners/${id}`, {
    method: "PATCH",
    token,
    body: formData,
  });
}

export async function deleteHomeBanner(
  token: string,
  id: string,
): Promise<void> {
  return apiRequest<void>(`/home-banners/${id}`, {
    method: "DELETE",
    token,
  });
}

export async function restoreHomeBanner(
  token: string,
  id: string,
): Promise<HomeBannerItem> {
  return apiRequest<HomeBannerItem>(`/home-banners/${id}/restore`, {
    method: "PATCH",
    token,
  });
}

// ─────────────────────────────────────────────────────────────
// Impact Stats
// ─────────────────────────────────────────────────────────────

export type ImpactCardPosition = "first" | "second" | "third" | "fourth";

export interface ImpactStatItem {
  id: string;
  cardPosition: ImpactCardPosition;
  metricName: string;
  metricValue: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface ImpactStatQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  cardPosition?: ImpactCardPosition;
}

export interface PaginatedImpactStatsResponse {
  data: ImpactStatItem[];
  meta: PaginationMeta;
}

export interface CreateImpactStatInput {
  cardPosition: ImpactCardPosition;
  metricName: string;
  metricValue: string;
}

export interface UpdateImpactStatInput {
  cardPosition?: ImpactCardPosition;
  metricName?: string;
  metricValue?: string;
}

export async function fetchImpactStats(
  token: string,
  params: ImpactStatQueryParams = {},
): Promise<PaginatedImpactStatsResponse> {
  const query = new URLSearchParams();
  if (params.page !== undefined) query.set("page", String(params.page));
  if (params.limit !== undefined) query.set("limit", String(params.limit));
  if (params.search && params.search.trim()) query.set("search", params.search.trim());

  const qs = query.toString();
  return apiRequest<PaginatedImpactStatsResponse>(
    `/impact-stats${qs ? `?${qs}` : ""}`,
    { token },
  );
}

export async function fetchDeletedImpactStats(
  token: string,
  params: ImpactStatQueryParams = {},
): Promise<PaginatedImpactStatsResponse> {
  const query = new URLSearchParams();
  if (params.page !== undefined) query.set("page", String(params.page));
  if (params.limit !== undefined) query.set("limit", String(params.limit));
  if (params.search && params.search.trim()) query.set("search", params.search.trim());

  const qs = query.toString();
  return apiRequest<PaginatedImpactStatsResponse>(
    `/impact-stats/deleted${qs ? `?${qs}` : ""}`,
    { token },
  );
}

export async function fetchPublicImpactStats(): Promise<ImpactStatItem[]> {
  return apiRequest<ImpactStatItem[]>("/impact-stats/public", {
    isPublic: true,
  });
}

export async function fetchImpactStatById(
  token: string,
  id: string,
): Promise<ImpactStatItem> {
  return apiRequest<ImpactStatItem>(`/impact-stats/${id}`, { token });
}

export async function createImpactStat(
  token: string,
  input: CreateImpactStatInput,
): Promise<ImpactStatItem> {
  return apiRequest<ImpactStatItem>("/impact-stats", {
    method: "POST",
    token,
    body: JSON.stringify(input),
    headers: { "Content-Type": "application/json" },
  });
}

export async function updateImpactStat(
  token: string,
  id: string,
  input: UpdateImpactStatInput,
): Promise<ImpactStatItem> {
  return apiRequest<ImpactStatItem>(`/impact-stats/${id}`, {
    method: "PATCH",
    token,
    body: JSON.stringify(input),
    headers: { "Content-Type": "application/json" },
  });
}

export async function deleteImpactStat(
  token: string,
  id: string,
): Promise<void> {
  return apiRequest<void>(`/impact-stats/${id}`, {
    method: "DELETE",
    token,
  });
}

export async function restoreImpactStat(
  token: string,
  id: string,
): Promise<ImpactStatItem> {
  return apiRequest<ImpactStatItem>(`/impact-stats/${id}/restore`, {
    method: "PATCH",
    token,
  });
}

// ---------------------------------------------------------------------------
// Leadership Members
// ---------------------------------------------------------------------------

export type LeadershipMemberItem = {
  id: string;
  name: string;
  designation: string;
  photoUrl: string;
  sortOrder: number;
  status: "draft" | "published" | "archived";
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

export type LeadershipMemberQueryParams = {
  page?: number;
  limit?: number;
  search?: string;
  status?: "draft" | "published" | "archived";
  includeDeleted?: boolean;
  onlyDeleted?: boolean;
};

export type CreateLeadershipMemberInput = {
  name: string;
  designation: string;
  sortOrder?: number;
  status?: "draft" | "published" | "archived";
  file: File;
};

export type UpdateLeadershipMemberInput = {
  name?: string;
  designation?: string;
  sortOrder?: number;
  status?: "draft" | "published" | "archived";
  file?: File | null;
};

export interface PaginatedLeadershipMembersResponse {
  data: LeadershipMemberItem[];
  meta: PaginationMeta;
}

export async function fetchLeadershipMembers(
  token: string,
  params: LeadershipMemberQueryParams = {},
): Promise<PaginatedLeadershipMembersResponse> {
  const query = new URLSearchParams();
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));
  if (params.search) query.set("search", params.search);
  if (params.status) query.set("status", params.status);
  if (params.includeDeleted) query.set("includeDeleted", "true");
  if (params.onlyDeleted) query.set("onlyDeleted", "true");

  const qs = query.toString();
  return apiRequest<PaginatedLeadershipMembersResponse>(
    `/leadership-members${qs ? `?${qs}` : ""}`,
    { token },
  );
}

export async function fetchDeletedLeadershipMembers(
  token: string,
  params: { page?: number; limit?: number; search?: string } = {},
): Promise<PaginatedLeadershipMembersResponse> {
  const query = new URLSearchParams();
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));
  if (params.search) query.set("search", params.search);

  const qs = query.toString();
  return apiRequest<PaginatedLeadershipMembersResponse>(
    `/leadership-members/deleted${qs ? `?${qs}` : ""}`,
    { token },
  );
}

export async function fetchPublishedLeadershipMembers(): Promise<
  LeadershipMemberItem[]
> {
  return apiRequest<LeadershipMemberItem[]>("/leadership-members/published", {
    isPublic: true,
  });
}

export async function fetchLeadershipMemberById(
  token: string,
  id: string,
): Promise<LeadershipMemberItem> {
  return apiRequest<LeadershipMemberItem>(`/leadership-members/${id}`, {
    token,
  });
}

export async function createLeadershipMember(
  token: string,
  input: CreateLeadershipMemberInput,
): Promise<LeadershipMemberItem> {
  const formData = new FormData();
  formData.append("name", input.name);
  formData.append("designation", input.designation);
  if (input.sortOrder !== undefined) {
    formData.append("sortOrder", String(input.sortOrder));
  }
  if (input.status) {
    formData.append("status", input.status);
  }
  formData.append("photo", input.file);

  return apiRequest<LeadershipMemberItem>("/leadership-members", {
    method: "POST",
    token,
    body: formData,
  });
}

export async function updateLeadershipMember(
  token: string,
  id: string,
  input: UpdateLeadershipMemberInput,
): Promise<LeadershipMemberItem> {
  const formData = new FormData();
  if (input.name !== undefined) formData.append("name", input.name);
  if (input.designation !== undefined)
    formData.append("designation", input.designation);
  if (input.sortOrder !== undefined) {
    formData.append("sortOrder", String(input.sortOrder));
  }
  if (input.status) formData.append("status", input.status);
  if (input.file) formData.append("photo", input.file);

  return apiRequest<LeadershipMemberItem>(`/leadership-members/${id}`, {
    method: "PATCH",
    token,
    body: formData,
  });
}

export async function deleteLeadershipMember(
  token: string,
  id: string,
): Promise<void> {
  return apiRequest<void>(`/leadership-members/${id}`, {
    method: "DELETE",
    token,
  });
}

export async function restoreLeadershipMember(
  token: string,
  id: string,
): Promise<LeadershipMemberItem> {
  return apiRequest<LeadershipMemberItem>(
    `/leadership-members/${id}/restore`,
    {
      method: "PATCH",
      token,
    },
  );
}

// ─────────────────────────────────────────────────────────────
// Impact Categories & Pages (initiatives)
// ─────────────────────────────────────────────────────────────

export type ImpactLayoutType =
  | "education"
  | "women_empowerment"
  | "skills_employment"
  | "model_village"
  | "health";

export interface ImpactCategoryItem {
  id: string;
  name: string;
  slug: string;
  layoutType: ImpactLayoutType;
  displayOrder: number;
  status: ContentStatus;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export type ImpactPageContent = Record<string, unknown>;

export interface ImpactPageItem {
  id: string;
  categoryId: string;
  name: string;
  slug: string;
  displayOrder: number;
  status: ContentStatus;
  publishedAt?: string | null;
  heroTitle?: string | null;
  heroDescription?: string | null;
  heroImageUrl?: string | null;
  heroImageMobileUrl?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  content?: ImpactPageContent | null;
  category?: ImpactCategoryItem;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface ImpactPageInput {
  categoryId: string;
  name: string;
  slug: string;
  displayOrder: number;
  status: ContentStatus;
  heroTitle: string;
  heroDescription: string;
  metaTitle: string;
  metaDescription: string;
  content: ImpactPageContent;
  heroImage?: File | null;
  heroImageMobile?: File | null;
}

export interface CreateImpactCategoryInput {
  name: string;
  slug: string;
  layoutType: ImpactLayoutType;
  displayOrder: number;
  status: ContentStatus;
}

type Paginated<T> = { data: T[]; meta: PaginationMeta };

export async function fetchImpactCategories(
  token: string,
): Promise<Paginated<ImpactCategoryItem>> {
  return apiRequest<Paginated<ImpactCategoryItem>>(
    "/impact-categories?limit=10",
    { token },
  );
}

export async function createImpactCategory(
  token: string,
  input: CreateImpactCategoryInput,
): Promise<ImpactCategoryItem> {
  return apiRequest<ImpactCategoryItem>("/impact-categories", {
    method: "POST",
    token,
    body: JSON.stringify(input),
  });
}

/** List rows only (no content or SEO); open a page with fetchImpactPageById for the full record. */
export const IMPACT_PAGES_PER_PAGE = 10;

export async function fetchImpactPages(
  token: string,
  { categoryId, deleted = false, page = 1, search = "" }: {
    categoryId: string;
    deleted?: boolean;
    page?: number;
    search?: string;
  },
): Promise<Paginated<ImpactPageItem>> {
  const params = new URLSearchParams({
    categoryId,
    page: String(page),
    limit: String(IMPACT_PAGES_PER_PAGE),
  });
  if (search.trim()) params.set("search", search.trim());
  return apiRequest<Paginated<ImpactPageItem>>(
    `/impact-initiatives${deleted ? "/deleted" : ""}?${params}`,
    { token },
  );
}

export async function fetchImpactPageById(
  token: string,
  id: string,
): Promise<ImpactPageItem> {
  return apiRequest<ImpactPageItem>(`/impact-initiatives/${id}`, { token });
}

function impactPageFormData(input: ImpactPageInput): FormData {
  const formData = new FormData();
  formData.append("categoryId", input.categoryId);
  formData.append("name", input.name);
  formData.append("slug", input.slug);
  formData.append("displayOrder", String(input.displayOrder));
  formData.append("status", input.status);
  formData.append("heroTitle", input.heroTitle);
  formData.append("heroDescription", input.heroDescription);
  formData.append("metaTitle", input.metaTitle);
  formData.append("metaDescription", input.metaDescription);
  formData.append("content", JSON.stringify(input.content));
  if (input.heroImage) formData.append("heroImage", input.heroImage);
  if (input.heroImageMobile) formData.append("heroImageMobile", input.heroImageMobile);
  return formData;
}

export async function createImpactPage(
  token: string,
  input: ImpactPageInput,
): Promise<ImpactPageItem> {
  return apiRequest<ImpactPageItem>("/impact-initiatives", {
    method: "POST",
    token,
    body: impactPageFormData(input),
  });
}

export async function updateImpactPage(
  token: string,
  id: string,
  input: ImpactPageInput,
): Promise<ImpactPageItem> {
  return apiRequest<ImpactPageItem>(`/impact-initiatives/${id}`, {
    method: "PATCH",
    token,
    body: impactPageFormData(input),
  });
}

export async function updateImpactPageStatus(
  token: string,
  id: string,
  status: ContentStatus,
): Promise<ImpactPageItem> {
  const formData = new FormData();
  formData.append("status", status);
  return apiRequest<ImpactPageItem>(`/impact-initiatives/${id}`, {
    method: "PATCH",
    token,
    body: formData,
  });
}

export async function deleteImpactPage(token: string, id: string): Promise<void> {
  return apiRequest<void>(`/impact-initiatives/${id}`, {
    method: "DELETE",
    token,
  });
}

export async function restoreImpactPage(
  token: string,
  id: string,
): Promise<ImpactPageItem> {
  return apiRequest<ImpactPageItem>(`/impact-initiatives/${id}/restore`, {
    method: "PATCH",
    token,
  });
}

/** Section images, icons and videos go straight to R2 (website/impact/) through the Next.js /api/website-images route. */
export async function uploadImpactMedia(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", "impact");
  const res = await fetch("/api/website-images", { method: "POST", body: formData });
  const json = (await res.json().catch(() => ({}))) as {
    uploaded?: { url: string }[];
    error?: string;
  };
  if (!res.ok || !json.uploaded?.[0]?.url) {
    throw new Error(json.error || "Upload failed.");
  }
  return json.uploaded[0].url;
}

