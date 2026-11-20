import {
  apiRequest,
  type ContentStatus,
  type PaginationMeta,
} from "@/domains/admin/lib/api";

export interface InteractiveProgrammeItem {
  id: string;
  title: string;
  slug: string;
  eventMediaUrl: string | null;
  eventDate: string | null;
  eventLocation: string | null;
  eventTime: string | null;
  content: string | null;
  status: ContentStatus;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

/** Public list card — content omitted; use fetchInteractiveProgrammeBySlug for detail. */
export interface InteractiveProgrammePublishedListItem {
  id: string;
  slug: string;
  title: string;
  eventMediaUrl: string | null;
  eventDate: string | null;
  eventLocation: string | null;
  eventTime: string | null;
  status: ContentStatus;
}

/** Slug detail response — full programme + related event cards. */
export interface InteractiveProgrammeDetailItem extends InteractiveProgrammeItem {
  relatedEvents: InteractiveProgrammePublishedListItem[];
}

export interface PaginatedPublishedInteractiveProgrammesResponse {
  data: InteractiveProgrammePublishedListItem[];
  meta: PaginationMeta;
}

export interface InteractiveProgrammeQueryParams {
  page?: number;
  limit?: number;
  status?: ContentStatus;
  search?: string;
}

export interface PaginatedInteractiveProgrammesResponse {
  data: InteractiveProgrammeItem[];
  meta: PaginationMeta;
}

export interface CreateInteractiveProgrammeInput {
  title: string;
  slug: string;
  eventMediaFile?: File | null;
  eventMediaUrl?: string | null;
  eventDate?: string | null;
  eventLocation?: string | null;
  eventTime?: string | null;
  content?: string | null;
  status?: ContentStatus;
}

export type UpdateInteractiveProgrammeInput =
  Partial<CreateInteractiveProgrammeInput>;

export async function fetchInteractiveProgrammes(
  token: string,
  params: InteractiveProgrammeQueryParams = {},
): Promise<PaginatedInteractiveProgrammesResponse> {
  const q = new URLSearchParams();
  if (params.page) q.set("page", String(params.page));
  if (params.limit) q.set("limit", String(params.limit));
  if (params.status) q.set("status", params.status);
  if (params.search) q.set("search", params.search);
  const qs = q.toString();
  return apiRequest<PaginatedInteractiveProgrammesResponse>(
    `/interactive-programmes${qs ? `?${qs}` : ""}`,
    { token },
  );
}

export async function fetchDeletedInteractiveProgrammes(
  token: string,
  params: InteractiveProgrammeQueryParams = {},
): Promise<PaginatedInteractiveProgrammesResponse> {
  const q = new URLSearchParams();
  if (params.page) q.set("page", String(params.page));
  if (params.limit) q.set("limit", String(params.limit));
  if (params.search) q.set("search", params.search);
  const qs = q.toString();
  return apiRequest<PaginatedInteractiveProgrammesResponse>(
    `/interactive-programmes/deleted${qs ? `?${qs}` : ""}`,
    { token },
  );
}

export async function fetchInteractiveProgrammeById(
  token: string,
  id: string,
): Promise<InteractiveProgrammeItem> {
  return apiRequest<InteractiveProgrammeItem>(`/interactive-programmes/${id}`, {
    token,
  });
}

export async function fetchPublishedInteractiveProgrammes(
  params: InteractiveProgrammeQueryParams = {},
): Promise<PaginatedPublishedInteractiveProgrammesResponse> {
  const q = new URLSearchParams();
  if (params.page) q.set("page", String(params.page));
  if (params.limit) q.set("limit", String(params.limit));
  if (params.search) q.set("search", params.search);
  const qs = q.toString();
  return apiRequest<PaginatedPublishedInteractiveProgrammesResponse>(
    `/interactive-programmes/published${qs ? `?${qs}` : ""}`,
    { method: "GET", isPublic: true },
  );
}

export async function fetchInteractiveProgrammeBySlug(
  slug: string,
  params: { limit?: number; page?: number } = {},
): Promise<InteractiveProgrammeDetailItem> {
  const q = new URLSearchParams();
  if (params.limit) q.set("limit", String(params.limit));
  if (params.page) q.set("page", String(params.page));
  const qs = q.toString();
  return apiRequest<InteractiveProgrammeDetailItem>(
    `/interactive-programmes/slug/${encodeURIComponent(slug)}${qs ? `?${qs}` : ""}`,
    { method: "GET", isPublic: true },
  );
}

export async function createInteractiveProgramme(
  token: string,
  input: CreateInteractiveProgrammeInput,
): Promise<InteractiveProgrammeItem> {
  const formData = new FormData();
  formData.append("title", input.title);
  formData.append("slug", input.slug);
  if (input.eventDate) formData.append("eventDate", input.eventDate);
  if (input.eventLocation) formData.append("eventLocation", input.eventLocation);
  if (input.eventTime) formData.append("eventTime", input.eventTime);
  if (input.content != null) formData.append("content", input.content);
  if (input.status) formData.append("status", input.status);
  if (input.eventMediaFile) {
    formData.append("eventMedia", input.eventMediaFile);
  } else if (input.eventMediaUrl) {
    formData.append("eventMediaUrl", input.eventMediaUrl);
  }

  return apiRequest<InteractiveProgrammeItem>("/interactive-programmes", {
    method: "POST",
    token,
    body: formData,
  });
}

export async function updateInteractiveProgramme(
  token: string,
  id: string,
  input: UpdateInteractiveProgrammeInput,
): Promise<InteractiveProgrammeItem> {
  const formData = new FormData();
  if (input.title !== undefined) formData.append("title", input.title);
  if (input.slug !== undefined) formData.append("slug", input.slug);
  if (input.eventDate !== undefined) {
    formData.append("eventDate", input.eventDate || "");
  }
  if (input.eventLocation !== undefined) {
    formData.append("eventLocation", input.eventLocation || "");
  }
  if (input.eventTime !== undefined) {
    formData.append("eventTime", input.eventTime || "");
  }
  if (input.content !== undefined) {
    formData.append("content", input.content || "");
  }
  if (input.status) formData.append("status", input.status);
  if (input.eventMediaFile) {
    formData.append("eventMedia", input.eventMediaFile);
  } else if (input.eventMediaUrl !== undefined) {
    formData.append("eventMediaUrl", input.eventMediaUrl || "");
  }

  return apiRequest<InteractiveProgrammeItem>(`/interactive-programmes/${id}`, {
    method: "PATCH",
    token,
    body: formData,
  });
}

export async function deleteInteractiveProgramme(
  token: string,
  id: string,
): Promise<void> {
  await apiRequest(`/interactive-programmes/${id}`, {
    method: "DELETE",
    token,
  });
}

export async function restoreInteractiveProgramme(
  token: string,
  id: string,
): Promise<InteractiveProgrammeItem> {
  return apiRequest<InteractiveProgrammeItem>(
    `/interactive-programmes/${id}/restore`,
    { method: "PATCH", token },
  );
}
