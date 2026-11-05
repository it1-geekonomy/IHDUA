import type { BlogDetail } from "@/domains/home/lib/blogs";
import { formatBlogDate } from "@/domains/home/lib/blogs";
import type { BlogPost } from "@/domains/blogs/constants/blogsData";

/** Server-safe: strips tags without DOMParser */
const stripHtml = (html: string) =>
  html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const firstParagraphText = (html: string | null | undefined) => {
  if (!html) return "";
  const match = html.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
  return stripHtml(match ? match[1] : html);
};

/**
 * Converts an API story into the shape BlogDetailClient expects.
 * Fields beyond slug/title/excerpt/leadParagraph/canonicalUrl/image/imageAlt
 * are best guesses; adjust them to match the BlogPost type.
 */
export function mapStoryToPost(story: BlogDetail): BlogPost {
  const post = {
    id: story.id,
    slug: story.slug,
    title: story.title,
    excerpt: story.shortDescription ?? "",
    leadParagraph: firstParagraphText(story.content),
    content: story.content ?? "", // HTML from the CMS editor
    image: story.blogBanner ?? "",
    imageAlt: story.title,
    category: story.category?.name ?? "",
    date: formatBlogDate(story.blogDate ?? story.createdAt),
    canonicalUrl: `/blogs/${story.slug}`,
  };

  return post as unknown as BlogPost;
}