import type { Metadata } from "next";
import HeroBanner from "@/shared/components/Herobanner";
import NewsletterSection from "@/shared/components/Newsletter";
import BlogsGridSection from "@/domains/blogs/components/BlogsGridSection";
import { BLOGS_HERO } from "@/domains/blogs/constants/blogsData";
import { buildPageMetadata } from "@/shared/lib/seo";

export const metadata: Metadata = buildPageMetadata({ path: "/blogs" });

export default function BlogsPage() {
  return (
    <main className="w-full">
      <HeroBanner
        heading={BLOGS_HERO.heading}
        description={BLOGS_HERO.description}
        image={BLOGS_HERO.image}
        imageMobile={BLOGS_HERO.imageMobile}
        imageAlt={BLOGS_HERO.imageAlt}
      />

      <BlogsGridSection />

      <NewsletterSection />
    </main>
  );
}