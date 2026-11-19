"use client";

import { useEffect, useRef, useState } from "react";
import {
  fetchBlogCategories,
  fetchPublishedStories,
  type BlogCategory,
  type BlogSort,
} from "@/domains/home/lib/blogs";
import {
  mapStoriesToCards,
  type BlogListCard,
} from "@/domains/blogs/lib/mapStoriesToCards";

export type { BlogListCard };

const FETCH_LIMIT = 100;

/**
 * Listing state for the blogs grid.
 *
 * When `initialPosts` is provided from the server, the first paint skips the
 * network round-trip. Subsequent sort/category changes refetch from the API.
 */
export function useBlogsList({
  sort,
  categoryId,
  initialPosts = null,
  initialCategories = [],
}: {
  sort: BlogSort;
  categoryId: string;
  initialPosts?: BlogListCard[] | null;
  initialCategories?: BlogCategory[];
}) {
  const [posts, setPosts] = useState<BlogListCard[] | null>(initialPosts);
  const [categories, setCategories] = useState<BlogCategory[]>(initialCategories);
  const [refreshing, setRefreshing] = useState(false);

  const skipDefaultFetch = useRef(
    initialPosts !== null && sort === "newest" && categoryId === "all",
  );

  useEffect(() => {
    if (skipDefaultFetch.current) {
      skipDefaultFetch.current = false;
      return;
    }

    let cancelled = false;
    setRefreshing(true);

    Promise.all([
      fetchPublishedStories({
        sort,
        limit: FETCH_LIMIT,
        categoryId: categoryId === "all" ? undefined : categoryId,
      }),
      fetchBlogCategories().catch(() => [] as BlogCategory[]),
    ])
      .then(([blogs, allCategories]) => {
        if (cancelled) return;

        const cards = mapStoriesToCards(blogs, allCategories);
        setPosts(cards);

        if (categoryId === "all") {
          const usedIds = new Set(
            cards.map((c) => c.categoryId).filter(Boolean),
          );
          setCategories(allCategories.filter((c) => usedIds.has(c.id)));
        }
      })
      .catch(() => {
        if (!cancelled) setPosts([]);
      })
      .finally(() => {
        if (!cancelled) setRefreshing(false);
      });

    return () => {
      cancelled = true;
    };
  }, [sort, categoryId]);

  return { posts, categories, refreshing };
}
