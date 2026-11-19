import type { BlogCategory, BlogStory } from "@/domains/home/lib/blogs";

/** Card shape used by the public blogs grid. */
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

const storyTime = (b: BlogStory) => new Date(b.blogDate ?? b.createdAt).getTime();

/** Shared server/client mapper — keep out of `"use client"` modules. */
export function mapStoriesToCards(
  blogs: BlogStory[],
  allCategories: BlogCategory[] = [],
): BlogListCard[] {
  const nameById = new Map(allCategories.map((c) => [c.id, c.name]));
  const now = Date.now();

  return blogs
    .filter((b) => b.slug && b.title)
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
}
