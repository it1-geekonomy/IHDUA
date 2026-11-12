import { notFound } from "next/navigation";
import HeroBanner from "@/shared/components/Herobanner";
import NewsletterSection from "@/shared/components/Newsletter";
import BlogDetailClient from "@/domains/blogs/components/BlogDetailClient";
import { BLOGS_HERO } from "@/domains/blogs/constants/blogsData";
import {
  mapStoryToLink,
  mapStoryToPost,
  sortPublishedStories,
} from "@/domains/blogs/lib/mapStoryToPost";
import {
  fetchBlogCategories,
  fetchPublishedStories,
  fetchStoryBySlug,
  type BlogCategory,
  type BlogStory,
} from "@/domains/home/lib/blogs";

interface BlogSlugPageProps {
  params: Promise<{ slug: string }>;
}

/** Always try to show this many related stories */
const RELATED_COUNT = 3;

/** Pre-build known slugs; new stories still work on demand (dynamicParams defaults to true) */
export async function generateStaticParams() {
  try {
    const stories = await fetchPublishedStories();
    return stories.filter((s) => s.slug).map((s) => ({ slug: s.slug }));
  } catch {
    return []; // backend offline at build time: pages render on first request
  }
}

export async function generateMetadata({ params }: BlogSlugPageProps) {
  const { slug } = await params;
  const story = await fetchStoryBySlug(slug).catch(() => null);

  if (!story) {
    return { title: "Blog Story | IHDUA" };
  }

  const title = story.metaTitle || `${story.title} | IHDUA`;
  const description =
    story.metaDescription || story.shortDescription || "Read this story from IHDUA.";
  const canonical = `/blogs/${slug}`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      type: "article",
      images: story.blogBanner
        ? [{ url: story.blogBanner, alt: story.title }]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: story.blogBanner ? [story.blogBanner] : undefined,
    },
  };
}

export default async function BlogSlugPage({ params }: BlogSlugPageProps) {
  const { slug } = await params;

  const [story, published, categories] = await Promise.all([
    fetchStoryBySlug(slug).catch(() => null),
    // The list and categories are optional here: a failure must not break the page
    fetchPublishedStories().catch(() => [] as BlogStory[]),
    fetchBlogCategories().catch(() => [] as BlogCategory[]),
  ]);

  if (!story) {
    notFound();
  }

  const post = mapStoryToPost(story, categories);

  // Newest first. "Previous" = the newer story, "Next" = the older one.
  const ordered = sortPublishedStories(published);
  const index = ordered.findIndex((s) => s.id === story.id);
  const prev = index > 0 ? mapStoryToLink(ordered[index - 1]) : null;
  const next =
    index >= 0 && index < ordered.length - 1
      ? mapStoryToLink(ordered[index + 1])
      : null;

  // Related: the API's list first, then topped up to RELATED_COUNT with
  // the newest other published stories (no duplicates, never the current story)
  const relatedSource: BlogStory[] = (story.related ?? []).filter(
    (r) => r.id !== story.id && r.slug && r.title,
  );
  const seen = new Set<string>([story.id, ...relatedSource.map((r) => r.id)]);

  for (const s of ordered) {
    if (relatedSource.length >= RELATED_COUNT) break;
    if (seen.has(s.id)) continue;
    seen.add(s.id);
    relatedSource.push(s);
  }

  const related = relatedSource.slice(0, RELATED_COUNT).map(mapStoryToLink);

  return (
    <main className="w-full">
      <HeroBanner
        heading={BLOGS_HERO.heading}
        description={BLOGS_HERO.description}
        image={BLOGS_HERO.image}
        imageMobile={BLOGS_HERO.imageMobile}
        imageAlt={BLOGS_HERO.imageAlt}
      />

      <BlogDetailClient
        post={post}
        related={related}
        prev={prev}
        next={next}
        position={index >= 0 ? index + 1 : 1}
        total={ordered.length > 0 ? ordered.length : 1}
      />

      <NewsletterSection />
    </main>
  );
}