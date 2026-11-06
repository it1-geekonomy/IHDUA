"use client";

import { useEffect, useState } from "react";
import {
  fetchBlogCategories,
  fetchPublishedStories,
  type BlogCategory,
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
  /** Timestamp used for sorting */
  time: number;
};

const storyTime = (b: BlogStory) => new Date(b.blogDate ?? b.createdAt).getTime();

/**
 * `posts` is null while loading, then every published story (newest first).
 * An empty list means nothing is published, or the API failed.
 * `categories` only contains categories that have at least one story.
 * No static fallback. One fresh call per visit.
 */
export function useBlogsList() {
  const [posts, setPosts] = useState<BlogListCard[] | null>(null);
  const [categories, setCategories] = useState<BlogCategory[]>([]);

  useEffect(() => {
    let cancelled = false;

    Promise.all([
      fetchPublishedStories(),
      // Categories are optional: a failure here must not break the page
      fetchBlogCategories().catch(() => [] as BlogCategory[]),
    ])
      .then(([blogs, allCategories]) => {
        const nameById = new Map(allCategories.map((c) => [c.id, c.name]));
        const now = Date.now();

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
          }))
          .sort((a, b) => b.time - a.time);

        const usedIds = new Set(cards.map((c) => c.categoryId).filter(Boolean));
        const usedCategories = allCategories.filter((c) => usedIds.has(c.id));

        if (!cancelled) {
          setPosts(cards);
          setCategories(usedCategories);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setPosts([]);
          setCategories([]);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { posts, categories };
}