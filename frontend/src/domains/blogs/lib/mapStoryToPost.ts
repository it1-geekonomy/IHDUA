import type {
  BlogCategory,
  BlogDetail,
  BlogStory,
} from "@/domains/home/lib/blogs";
import { formatBlogDate } from "@/domains/home/lib/blogs";

/** What the detail page renders for the main story. */
export type BlogPostView = {
  id: string;
  slug: string;
  title: string;
  /** Short summary from the CMS, shown under the title */
  subtitle: string;
  /** Article body as HTML (from the CMS editor) */
  contentHtml: string;
  image: string | null;
  imageAlt: string;
  category: string;
  date: string;
};

/** Small card used for related stories and prev/next. */
export type StoryLink = {
  id: string;
  slug: string;
  title: string;
  image: string | null;
  date: string;
};

const storyTime = (b: BlogStory) => new Date(b.blogDate ?? b.createdAt).getTime();

/**
 * Published stories that can be shown: has slug and title, not dated in the
 * future. Newest first. Same rules as the Home and Blogs list pages.
 */
export function sortPublishedStories(stories: BlogStory[]): BlogStory[] {
  const now = Date.now();
  return stories
    .filter((s) => s.slug && s.title)
    .filter((s) => {
      const t = storyTime(s);
      return !Number.isNaN(t) && t <= now;
    })
    .sort((a, b) => storyTime(b) - storyTime(a));
}

export function mapStoryToLink(story: BlogStory): StoryLink {
  return {
    id: story.id,
    slug: story.slug,
    title: story.title,
    image: story.blogBanner || null,
    date: formatBlogDate(story.blogDate ?? story.createdAt),
  };
}

/**
 * Basic cleanup of CMS HTML (server-safe, no DOM needed). The CMS is
 * admin-only, but for stronger protection use a library like sanitize-html.
 */
function cleanHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/\son\w+\s*=\s*("[^"]*"|'[^']*')/gi, "")
    .replace(/javascript:/gi, "");
}

/** If the CMS saved plain text (no tags), turn blank-line separated text into paragraphs. */
function toHtml(content: string | null | undefined): string {
  if (!content) return "";
  if (/<[a-z][\s\S]*>/i.test(content)) return cleanHtml(content);
  return content
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => `<p>${p.replace(/</g, "&lt;").replace(/\n/g, "<br />")}</p>`)
    .join("");
}

/**
 * Removes blocks that only contain spaces, &nbsp; or <br> (the editor's
 * "empty lines"), plus stray <br> at the very start or end. These show up as
 * blank gaps, for example between the banner image and the first heading.
 * Blocks with an image, iframe or any real text are kept.
 */
function removeEmptyBlocks(html: string): string {
  if (!html) return html;

  const EMPTY = "(?:\\s|&nbsp;|&#160;|<br\\s*/?>)*";
  const emptyBlock = new RegExp(`<(p|div|h[1-6])(?:\\s[^>]*)?>${EMPTY}</\\1>`, "gi");
  const edgeBreaks = new RegExp(`^(?:\\s|<br\\s*/?>)+|(?:\\s|<br\\s*/?>)+$`, "gi");

  let out = html;
  let previous: string;
  do {
    previous = out;
    out = out.replace(emptyBlock, "");
  } while (out !== previous); // handles empty blocks nested inside each other

  return out.replace(edgeBreaks, "").trim();
}

/** Plain, lowercase text for comparing two pieces of content. */
const plain = (s: string) =>
  s
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();

/**
 * The summary is already shown under the title. If the article body starts
 * with the exact same paragraph, drop it so the text isn't shown twice.
 */
function removeLeadingDuplicate(html: string, summary: string): string {
  if (!html || !summary) return html;

  const match = html.match(/^\s*<p[^>]*>([\s\S]*?)<\/p>/i);
  if (!match) return html;

  if (plain(match[1]) !== plain(summary)) return html;
  return html.slice(match[0].length).trimStart();
}

/** Converts an API story into what BlogDetailClient renders. */
export function mapStoryToPost(
  story: BlogDetail,
  categories: BlogCategory[] = [],
): BlogPostView {
  const categoryName =
    story.category?.name ??
    (story.categoryId
      ? categories.find((c) => c.id === story.categoryId)?.name
      : undefined) ??
    "";

  const subtitle = story.shortDescription ?? "";

  // Order matters: clean empty blocks first, drop the duplicate summary, then
  // clean again in case removing the duplicate left an empty line behind.
  const body = removeEmptyBlocks(
    removeLeadingDuplicate(removeEmptyBlocks(toHtml(story.content)), subtitle),
  );

  return {
    id: story.id,
    slug: story.slug,
    title: story.title,
    subtitle,
    contentHtml: body,
    image: story.blogBanner || null,
    imageAlt: story.title,
    category: categoryName,
    date: formatBlogDate(story.blogDate ?? story.createdAt),
  };
}