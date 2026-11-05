"use client";

import { useEffect, useState } from "react";
import { FIELD_STORIES } from "@/domains/home/constants/storiesfromfield";
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

/** Static stories, shown if the API fails or has no usable stories */
const FALLBACK: FieldStoryCard[] = FIELD_STORIES.map((s) => ({
  id: String(s.id),
  category: s.category,
  date: s.date,
  title: s.title,
  description: s.description,
  image: s.image,
  href: s.href,
}));

const storyTime = (b: BlogStory) => new Date(b.blogDate ?? b.createdAt).getTime();

/** Results kept after the first load (per limit), so remounting shows stories instantly with no new calls. */
const resolved = new Map<number, FieldStoryCard[]>();

/**
 * Returns `null` while loading, then the latest `limit` published stories
 * (or the static fallback).
 */
export function useFieldStories(limit = 3) {
  const [stories, setStories] = useState<FieldStoryCard[] | null>(
    resolved.get(limit) ?? null,
  );

  useEffect(() => {
    if (resolved.has(limit)) return; // already loaded earlier in this session

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
          // Latest 3 only
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

        const result = cards.length > 0 ? cards : FALLBACK;
        resolved.set(limit, result);
        if (!cancelled) setStories(result);
      })
      .catch(() => {
        if (!cancelled) setStories(FALLBACK);
      });

    return () => {
      cancelled = true;
    };
  }, [limit]);

  return stories;
}