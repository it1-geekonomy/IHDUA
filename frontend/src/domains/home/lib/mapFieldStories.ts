import {
  formatBlogDate,
  type BlogCategory,
  type BlogStory,
} from "@/domains/home/lib/blogs";

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

/** Map published CMS stories into the home "Stories from the field" cards. */
export function mapFieldStories(
  blogs: BlogStory[],
  categories: BlogCategory[] = [],
  limit = 3,
): FieldStoryCard[] {
  const categoryName = new Map(categories.map((c) => [c.id, c.name]));
  const now = Date.now();

  return blogs
    .filter((b) => b.blogBanner && b.slug && b.title)
    .filter((b) => storyTime(b) <= now)
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
      description: b.shortDescription ?? "",
      image: b.blogBanner as string,
      href: `/blog/${b.slug}`,
    }));
}
