export type ProgrammeListItem = {
  id: string;
  slug: string;
  title: string;
  eventMediaUrl: string | null;
  eventDate: string | null;
  eventLocation: string | null;
  eventTime: string | null;
  status: string;
};

export type ProgrammeDetail = ProgrammeListItem & {
  content: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type ProgrammeQuery = {
  page?: number;
  limit?: number;
  search?: string;
};

export type PaginatedProgrammes = {
  data: ProgrammeListItem[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

const API_URL = process.env.NEXT_PUBLIC_API_URL;

function unwrapList<T>(json: unknown): T[] {
  if (Array.isArray(json)) return json as T[];
  const j = json as { data?: unknown; items?: unknown } | null;
  if (Array.isArray(j?.data)) return j.data as T[];
  const inner = j?.data as { items?: unknown; data?: unknown } | undefined;
  if (Array.isArray(inner?.items)) return inner.items as T[];
  if (Array.isArray(inner?.data)) return inner.data as T[];
  if (Array.isArray(j?.items)) return j.items as T[];
  return [];
}

function buildQuery(q: ProgrammeQuery): string {
  const params = new URLSearchParams();
  if (q.page) params.set("page", String(q.page));
  if (q.limit) params.set("limit", String(q.limit));
  if (q.search) params.set("search", q.search);
  return params.toString();
}

/** Public endpoint: published interactive programmes (paginated card list). */
export async function fetchPublishedProgrammes(
  query: ProgrammeQuery = {},
): Promise<PaginatedProgrammes> {
  const qs = buildQuery(query);
  const res = await fetch(
    `${API_URL}/interactive-programmes/published${qs ? `?${qs}` : ""}`,
    { headers: { accept: "application/json" }, cache: "no-store" },
  );
  if (!res.ok) throw new Error(`Failed to load programmes (${res.status})`);

  const json = await res.json();
  const data = unwrapList<ProgrammeListItem>(json);
  const meta = (json?.meta ?? {
    total: data.length,
    page: query.page ?? 1,
    limit: query.limit ?? (data.length || 20),
    totalPages: 1,
  }) as PaginatedProgrammes["meta"];

  return { data, meta };
}

/** Flat list helper for sitemap / related events. */
export async function fetchAllPublishedProgrammes(
  limit = 100,
): Promise<ProgrammeListItem[]> {
  const { data } = await fetchPublishedProgrammes({ page: 1, limit });
  return data;
}

/** Public detail by slug. Returns null when not found / not published. */
export async function fetchProgrammeBySlug(
  slug: string,
): Promise<ProgrammeDetail | null> {
  const res = await fetch(
    `${API_URL}/interactive-programmes/slug/${encodeURIComponent(slug)}`,
    { headers: { accept: "application/json" }, cache: "no-store" },
  );
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Failed to load programme (${res.status})`);

  const json = await res.json();
  const data = (json?.data ?? json) as ProgrammeDetail | null;
  if (!data?.id) return null;
  return data;
}

/** Card date: "15-05-2026" (UTC so the calendar day never shifts). */
export function formatProgrammeCardDate(
  date: string | null | undefined,
): string {
  if (!date) return "";
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return "";
  const dd = String(d.getUTCDate()).padStart(2, "0");
  const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
  const yyyy = d.getUTCFullYear();
  return `${dd}-${mm}-${yyyy}`;
}

/** Detail date: "13 February 2024" */
export function formatProgrammeDetailDate(
  date: string | null | undefined,
): string {
  if (!date) return "";
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

/** Event time from API (HH:mm or HH:mm:ss) → "10:00 AM" */
export function formatProgrammeTime(
  time: string | null | undefined,
): string {
  if (!time) return "";
  const hhmm = time.slice(0, 5);
  const [hStr, mStr] = hhmm.split(":");
  const h = Number(hStr);
  const m = Number(mStr);
  if (Number.isNaN(h) || Number.isNaN(m)) return hhmm;

  const d = new Date();
  d.setHours(h, m, 0, 0);
  return d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export function isVideoUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  return /\.(mp4|webm)(\?|$)/i.test(url) || url.includes("/video");
}
