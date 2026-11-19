import type { Metadata } from "next";
import HeroBanner from "@/shared/components/Herobanner";
import NewsletterSection from "@/shared/components/Newsletter";
import BlogsGridSection from "@/domains/blogs/components/BlogsGridSection";
import { mapStoriesToCards } from "@/domains/blogs/lib/mapStoriesToCards";
import { BLOGS_HERO } from "@/domains/blogs/constants/blogsData";
import {
  fetchBlogCategories,
  fetchPublishedStories,
} from "@/domains/home/lib/blogs";
import { buildPageMetadata } from "@/shared/lib/seo";

export const metadata: Metadata = buildPageMetadata({ path: "/blogs" });

export const dynamic = "force-dynamic";

/**
 * Server-render the listing so the first HTML response includes real
 * `/blogs/{slug}` anchors. Discovery of the full corpus (incl. page 2+)
 * is handled by `/sitemap.xml`, which is rebuilt from the CMS.
 */
export default async function BlogsPage() {
  const [stories, categories] = await Promise.all([
    fetchPublishedStories({ sort: "newest", limit: 100 }).catch(() => []),
    fetchBlogCategories().catch(() => []),
  ]);

  const cards = mapStoriesToCards(stories, categories);
  const usedIds = new Set(cards.map((c) => c.categoryId).filter(Boolean));
  const initialCategories = categories.filter((c) => usedIds.has(c.id));

  return (
    <main className="w-full">
      <HeroBanner
        heading={BLOGS_HERO.heading}
        description={BLOGS_HERO.description}
        image={BLOGS_HERO.image}
        imageMobile={BLOGS_HERO.imageMobile}
        imageAlt={BLOGS_HERO.imageAlt}
      />

      <BlogsGridSection
        initialPosts={cards}
        initialCategories={initialCategories}
      />

      <NewsletterSection />
    </main>
  );
}
