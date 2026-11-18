"use client";

import { useEffect, useState } from "react";
import {
  fetchBlogCategories,
  fetchPublishedStories,
  type BlogCategory,
  type BlogSort,
  type BlogStory,
} from "@/domains/home/lib/blogs";

/** The shape the Blogs grid renders. */
export type BlogListCard = {
  id: string;
  slug: string;
  title: string;
  image: string | null;
  category: string;
  categoryId: string | null;
  /** Publish timestamp (future-date check only, not used for sorting) */
  time: number;
};

/** Backend default limit is 20, so ask for more; pagination (6 per page) stays on the page */
const FETCH_LIMIT = 100;

const storyTime = (b: BlogStory) => new Date(b.blogDate ?? b.createdAt).getTime();

/**
 * Sorting is done by the backend (`sort` query param).
 *
 * - `posts` is null only on the very first load, then every published story
 *   in the order the backend returned. An empty list means nothing is
 *   published, or the API failed.
 * - `refreshing` is true while a new sort is being fetched; the previous
 *   posts stay on screen so the page doesn't flicker.
 * - `categories` only contains categories that have at least one story.
 */
export function useBlogsList(sort: BlogSort) {
  const [posts, setPosts] = useState<BlogListCard[] | null>(null);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setRefreshing(true);

    Promise.all([
      fetchPublishedStories({ sort, limit: FETCH_LIMIT }),
      // Categories are optional: a failure here must not break the page
      fetchBlogCategories().catch(() => [] as BlogCategory[]),
    ])
      .then(([blogs, allCategories]) => {
        if (cancelled) return;

        const nameById = new Map(allCategories.map((c) => [c.id, c.name]));
        const now = Date.now();

        // No .sort(): the backend already returned the right order
        const cards = blogs
          // Needs a slug and title to link to the detail page
          .filter((b) => b.slug && b.title)
          // Hide stories scheduled for a future date
          .filter((b) => {
            const t = storyTime(b);
            return !Number.isNaN(t) && t <= now;
          })
          .map<BlogListCard>((b) => ({
            id: b.id,
            slug: b.slug,
            title: b.title,
            image: b.blogBanner || null,
            category:
              b.category?.name ??
              (b.categoryId ? nameById.get(b.categoryId) : undefined) ??
              "",
            categoryId: b.categoryId ?? b.category?.id ?? null,
            time: storyTime(b),
          }));

        const usedIds = new Set(cards.map((c) => c.categoryId).filter(Boolean));

        setPosts(cards);
        setCategories(allCategories.filter((c) => usedIds.has(c.id)));
      })
      .catch(() => {
        if (!cancelled) {
          setPosts([]);
          setCategories([]);
        }
      })
      .finally(() => {
        if (!cancelled) setRefreshing(false);
      });

    return () => {
      cancelled = true;
    };
  }, [sort]);

  return { posts, categories, refreshing };
}