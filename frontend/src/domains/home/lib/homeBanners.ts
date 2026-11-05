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
 * One shared request for the whole page session.
 * Strict Mode double effects, remounts and back/forward navigation all reuse it,
 * so /home-banners/published is requested once per full page load.
 */
let request: Promise<HomeBanner[]> | null = null;

export function fetchPublishedBanners(): Promise<HomeBanner[]> {
  if (request) return request;

  request = fetch(`${API_URL}/home-banners/published`, {
    headers: { accept: "application/json" },
  })
    .then(async (res) => {
      if (!res.ok) throw new Error(`Failed to load banners (${res.status})`);
      const json = await res.json();
      // Handles both { statusCode, data: [...] } and a bare array
      return (Array.isArray(json) ? json : (json?.data ?? [])) as HomeBanner[];
    })
    .catch((err) => {
      request = null; // don't cache failures, so the next mount can retry
      throw err;
    });

  return request;
}