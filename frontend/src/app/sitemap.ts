import type { MetadataRoute } from "next";
import { fetchPublishedStories } from "@/domains/home/lib/blogs";
import { fetchAllPublicInitiatives } from "@/shared/lib/impactApi";
import { listStaticSitePaths } from "@/shared/lib/seo";
import { absoluteUrl } from "@/shared/lib/siteUrl";

/** Refresh at most hourly so new CMS content lands without redeploys. */
export const revalidate = 3600;

type Entry = MetadataRoute.Sitemap[number];

function pathKey(path: string): string {
  if (!path || path === "/") return "/";
  return path.startsWith("/") ? path.replace(/\/+$/, "") : `/${path.replace(/\/+$/, "")}`;
}

/**
 * Public sitemap — single discovery surface for Google / Screaming Frog.
 *
 * Sources:
 *  1. Static marketing routes (SEO map)
 *  2. Published impact pages (CMS)
 *  3. Published blog posts (CMS) — grows as editors publish
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const entries = new Map<string, Entry>();

  const add = (path: string, extras?: Partial<Entry>) => {
    const key = pathKey(path);
    const url = absoluteUrl(key);
    if (entries.has(url)) return;
    const isHome = key === "/";
    const isBlog = key.startsWith("/blog/");
    entries.set(url, {
      url,
      lastModified: now,
      changeFrequency: isBlog ? "weekly" : isHome ? "daily" : "monthly",
      priority: isHome ? 1 : isBlog ? 0.7 : 0.8,
      ...extras,
    });
  };

  for (const path of listStaticSitePaths()) {
    add(path);
  }

  const [initiativesResult, storiesResult] = await Promise.allSettled([
    fetchAllPublicInitiatives(),
    fetchPublishedStories({ sort: "newest", limit: 500 }),
  ]);

  if (initiativesResult.status === "fulfilled" && initiativesResult.value) {
    for (const item of initiativesResult.value) {
      if (!item.slug) continue;
      add(item.slug);
    }
  }

  if (storiesResult.status === "fulfilled") {
    const nowMs = Date.now();
    for (const story of storiesResult.value) {
      if (!story.slug) continue;
      const publishedAt = new Date(story.blogDate || story.createdAt);
      const t = publishedAt.getTime();
      if (Number.isNaN(t) || t > nowMs) continue;
      add(`/blog/${story.slug}`, {
        lastModified: publishedAt,
        changeFrequency: "weekly",
        priority: 0.7,
      });
    }
  }

  return Array.from(entries.values());
}
