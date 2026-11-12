export type HomeBannerStatus = "draft" | "published" | "archived";

export type HomeBanner = {
  id: string;
  bannerImageUrl: string;
  status: HomeBannerStatus;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Request currently in flight. Strict Mode's second effect run happens
 * before the response arrives, so it reuses this promise (1 call, not 2).
 * It is cleared as soon as the request settles, so the next visit to
 * the Home page always makes a fresh call.
 */
let inFlight: Promise<HomeBanner[]> | null = null;

export function fetchPublishedBanners(): Promise<HomeBanner[]> {
  if (inFlight) return inFlight;

  const request = fetch(`${API_URL}/home-banners/published`, {
    headers: { accept: "application/json" },
  })
    .then(async (res) => {
      if (!res.ok) throw new Error(`Failed to load banners (${res.status})`);
      const json = await res.json();
      // Handles both { statusCode, data: [...] } and a bare array
      return (Array.isArray(json) ? json : (json?.data ?? [])) as HomeBanner[];
    })
    .finally(() => {
      inFlight = null;
    });

  inFlight = request;
  return request;
}