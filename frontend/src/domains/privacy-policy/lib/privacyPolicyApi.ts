const API_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
  "http://localhost:6061/api";

/** Matches GET /api/privacy-policy/published */
export type PrivacyPolicy = {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  schemaCode: string | null;
  title: string;
  content: string;
  status: string;
};

// Holds the request while it is running. Any caller that asks during that
// time (e.g. React Strict Mode's second effect run in dev) reuses it, so
// only ONE network call is made. Cleared when done, so the next page
// visit or refresh calls the API again.
let inflight: Promise<PrivacyPolicy | null> | null = null;

export function getPublishedPrivacyPolicy(): Promise<PrivacyPolicy | null> {
  if (inflight) return inflight;

  inflight = fetch(`${API_BASE}/privacy-policy/published`, {
    method: "GET",
    cache: "no-store",
  })
    .then(async (res) => {
      if (!res.ok) return null;

      const json = await res.json();
      // Supports both { statusCode, data: {...} } and a flat response
      const data = (json?.data ?? json) as PrivacyPolicy | null;

      if (!data || !data.title || !data.content) return null;
      if (data.status && data.status !== "published") return null;

      return data;
    })
    .catch(() => null)
    .finally(() => {
      inflight = null;
    });

  return inflight;
}