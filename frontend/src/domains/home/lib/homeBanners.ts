export type HomeBannerStatus = "draft" | "published" | "archived";

export type HomeBanner = {
  id: string;
  bannerImageUrl: string;
  status: HomeBannerStatus;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

const API_BASE = (
  (typeof window === "undefined"
    ? process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL
    : process.env.NEXT_PUBLIC_API_URL) || "http://localhost:6061/api"
).replace(/\/$/, "");

/**
 * Published home hero banners.
 * Server: cached briefly for LCP-friendly SSR.
 * Browser: no-store so CMS edits show up on the next visit.
 */
export async function fetchPublishedBanners(): Promise<HomeBanner[]> {
  const res = await fetch(`${API_BASE}/home-banners/published`, {
    headers: { accept: "application/json" },
    ...(typeof window === "undefined"
      ? { next: { revalidate: 300 } }
      : { cache: "no-store" as RequestCache }),
  });

  if (!res.ok) throw new Error(`Failed to load banners (${res.status})`);
  const json = await res.json();
  return (Array.isArray(json) ? json : (json?.data ?? [])) as HomeBanner[];
}

export function bannerImageUrls(banners: HomeBanner[]): string[] {
  return banners.map((b) => b.bannerImageUrl).filter(Boolean);
}
