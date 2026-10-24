import HeroBanner from "@/shared/components/Herobanner";
import NewsletterSection from "@/shared/components/Newsletter";
import BlogsGridSection from "@/domains/blogs/components/BlogsGridSection";
import { BLOGS_HERO } from "@/domains/blogs/constants/blogsData";

export const metadata = {
  title: "Blogs & Stories | IHDUA",
  description:
    "Discover stories, updates, and inspiring moments from our work with rural communities across Karnataka.",
};

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