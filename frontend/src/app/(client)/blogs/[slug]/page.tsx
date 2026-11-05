import { notFound } from "next/navigation";
import HeroBanner from "@/shared/components/Herobanner";
import NewsletterSection from "@/shared/components/Newsletter";
import BlogDetailClient from "@/domains/blogs/components/BlogDetailClient";
import { BLOGS_HERO } from "@/domains/blogs/constants/blogsData";
import { mapStoryToPost } from "@/domains/blogs/lib/mapStoryToPost";
import { fetchPublishedStories, fetchStoryBySlug } from "@/domains/home/lib/blogs";

interface BlogSlugPageProps {
  params: Promise<{ slug: string }>;
}

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
  const story = await fetchStoryBySlug(slug);

  if (!story) {
    notFound();
  }

  const post = mapStoryToPost(story);

  return (
    <main className="w-full">
      <HeroBanner
        heading={BLOGS_HERO.heading}
        description={BLOGS_HERO.description}
        image={BLOGS_HERO.image}
        imageMobile={BLOGS_HERO.imageMobile}
        imageAlt={BLOGS_HERO.imageAlt}
      />

      <BlogDetailClient initialPost={post} />

      <NewsletterSection />
    </main>
  );
}