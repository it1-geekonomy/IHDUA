export type BlogCategory = {
  id: string;
  name: string;
};

export type BlogStory = {
  id: string;
  title: string;
  slug: string;
  blogBanner: string | null;
  blogDate: string | null;
  content: string | null;
  shortDescription: string | null;
  status: string;
  categoryId: string | null;
  category?: { id: string; name: string } | null;
  createdAt: string;
};

export type BlogDetail = BlogStory & {
  metaTitle?: string | null;
  metaDescription?: string | null;
  related: BlogStory[];
};

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const isBrowser = () => typeof window !== "undefined";

/** Handles a bare array, { data: [...] }, { data: { items: [...] } } and { items: [...] } */
function unwrapList<T>(json: unknown): T[] {
  if (Array.isArray(json)) return json as T[];
  const j = json as {
    data?: unknown;
    items?: unknown;
  } | null;

  if (Array.isArray(j?.data)) return j.data as T[];
  const inner = j?.data as { items?: unknown; data?: unknown } | undefined;
  if (Array.isArray(inner?.items)) return inner.items as T[];
  if (Array.isArray(inner?.data)) return inner.data as T[];
  if (Array.isArray(j?.items)) return j.items as T[];
  return [];
}

/**
 * Browser only: the request currently in flight, per endpoint.
 * Strict Mode's second effect run happens before the response arrives, so it
 * reuses this promise (1 call, not 2). It is cleared as soon as the request
 * settles, so the next visit always makes a fresh call.
 * (Never used on the server, so server renders always get fresh data.)
 */
let storiesRequest: Promise<BlogStory[]> | null = null;
let categoriesRequest: Promise<BlogCategory[]> | null = null;

/** Public endpoint: only stories with status "published" */
export function fetchPublishedStories(): Promise<BlogStory[]> {
  const browser = isBrowser();
  if (browser && storiesRequest) return storiesRequest;

  const request = fetch(`${API_URL}/blogs-and-stories/published`, {
    headers: { accept: "application/json" },
    // On the server, let Next.js cache the response for 60 seconds
    ...(browser ? {} : { next: { revalidate: 60 } }),
  })
    .then(async (res) => {
      if (!res.ok) throw new Error(`Failed to load stories (${res.status})`);
      return unwrapList<BlogStory>(await res.json());
    })
    .finally(() => {
      if (browser) storiesRequest = null;
    });

  if (browser) storiesRequest = request;
  return request;
}

/** Public endpoint: used to turn categoryId into a category name */
export function fetchBlogCategories(): Promise<BlogCategory[]> {
  const browser = isBrowser();
  if (browser && categoriesRequest) return categoriesRequest;

  const request = fetch(`${API_URL}/blog-categories`, {
    headers: { accept: "application/json" },
    ...(browser ? {} : { next: { revalidate: 60 } }),
  })
    .then(async (res) => {
      if (!res.ok) throw new Error(`Failed to load categories (${res.status})`);
      return unwrapList<BlogCategory>(await res.json());
    })
    .finally(() => {
      if (browser) categoriesRequest = null;
    });

  if (browser) categoriesRequest = request;
  return request;
}

/**
 * Detail page (runs on the server). Returns null when the slug doesn't exist.
 * Accepts the story either directly or nested ({ data: { story, relatedStories } }).
 */
export async function fetchStoryBySlug(slug: string): Promise<BlogDetail | null> {
  const res = await fetch(
    `${API_URL}/blogs-and-stories/published/slug/${encodeURIComponent(slug)}`,
    { headers: { accept: "application/json" }, next: { revalidate: 60 } },
  );
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Failed to load story (${res.status})`);

  const json = await res.json();
  const data = json?.data ?? json;
  const story = data?.story ?? data?.blog ?? data;
  if (!story?.id) return null;

  const related: BlogStory[] =
    data?.relatedStories ?? data?.related ?? story?.relatedStories ?? story?.related ?? [];

  return { ...story, related: Array.isArray(related) ? related : [] };
}

/** "2026-03-02" -> "March 2, 2026" (UTC, so the day never shifts by timezone) */
export function formatBlogDate(date: string | null | undefined): string {
  if (!date) return "";
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}