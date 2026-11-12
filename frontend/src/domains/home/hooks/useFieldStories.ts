"use client";

import { useEffect, useState } from "react";
import {
  fetchBlogCategories,
  fetchPublishedStories,
  formatBlogDate,
  type BlogStory,
} from "@/domains/home/lib/blogs";

/** The shape the Stories section renders. */
export type FieldStoryCard = {
  id: string;
  category: string;
  date: string;
  title: string;
  description: string;
  image: string;
  href: string;
};

const storyTime = (b: BlogStory) => new Date(b.blogDate ?? b.createdAt).getTime();

/**
 * Returns `null` while loading, then the latest `limit` published stories.
 * An empty list means nothing is published (or every story is scheduled for
 * the future) or the API failed. There is no static fallback.
 * Called once per visit to the Home page.
 */
export function useFieldStories(limit = 3) {
  const [stories, setStories] = useState<FieldStoryCard[] | null>(null);

  useEffect(() => {
    let cancelled = false;

    Promise.all([
      fetchPublishedStories(),
      // Categories are optional: a failure here must not break the section
      fetchBlogCategories().catch(() => []),
    ])
      .then(([blogs, categories]) => {
        const categoryName = new Map(categories.map((c) => [c.id, c.name]));
        const now = Date.now();

        const cards = blogs
          // Needs a banner, slug and title to render in this layout
          .filter((b) => b.blogBanner && b.slug && b.title)
          // Hide stories scheduled for a future date (remove this line to show them)
          .filter((b) => storyTime(b) <= now)
          // Newest first; same-day stories ordered by when they were created
          .sort((a, b) => {
            const byDate = storyTime(b) - storyTime(a);
            return byDate !== 0
              ? byDate
              : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          })
          .slice(0, limit)
          .map<FieldStoryCard>((b) => ({
            id: b.id,
            category:
              b.category?.name ??
              (b.categoryId ? categoryName.get(b.categoryId) : undefined) ??
              "Story",
            date: formatBlogDate(b.blogDate ?? b.createdAt),
            title: b.title,
            // Short Summary from the CMS, shown in full (no trimming)
            description: b.shortDescription ?? "",
            image: b.blogBanner as string,
            href: `/blogs/${b.slug}`,
          }));

        if (!cancelled) setStories(cards);
      })
      .catch(() => {
        if (!cancelled) setStories([]);
      });

    return () => {
      cancelled = true;
    };
  }, [limit]);

  return stories;
}