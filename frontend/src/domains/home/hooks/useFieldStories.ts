"use client";

import { useEffect, useState } from "react";
import {
  fetchBlogCategories,
  fetchPublishedStories,
} from "@/domains/home/lib/blogs";
import {
  mapFieldStories,
  type FieldStoryCard,
} from "@/domains/home/lib/mapFieldStories";

export type { FieldStoryCard };

/**
 * Home field-stories listing.
 * Prefer SSR `initialStories` so the featured image can be the LCP/near-LCP candidate.
 */
export function useFieldStories(
  limit = 3,
  initialStories: FieldStoryCard[] | null = null,
) {
  const [stories, setStories] = useState<FieldStoryCard[] | null>(initialStories);

  useEffect(() => {
    if (initialStories !== null) return;

    let cancelled = false;

    Promise.all([
      fetchPublishedStories({ sort: "newest", limit: Math.max(limit, 12) }),
      fetchBlogCategories().catch(() => []),
    ])
      .then(([blogs, categories]) => {
        if (!cancelled) setStories(mapFieldStories(blogs, categories, limit));
      })
      .catch(() => {
        if (!cancelled) setStories([]);
      });

    return () => {
      cancelled = true;
    };
  }, [limit, initialStories]);

  return stories;
}
