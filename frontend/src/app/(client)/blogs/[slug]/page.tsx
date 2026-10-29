import { notFound } from "next/navigation";
import HeroBanner from "@/shared/components/Herobanner";
import NewsletterSection from "@/shared/components/Newsletter";
import BlogDetailClient from "@/domains/blogs/components/BlogDetailClient";
import { BLOG_POSTS, BLOGS_HERO, type BlogPost } from "@/domains/blogs/constants/blogsData";

interface BlogSlugPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: BlogSlugPageProps) {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);

  if (!post) {
    return {
      title: "Blog Story | IHDUA",
    };
  }

  const description = post.excerpt || post.leadParagraph || "Read this story from IHDUA.";

  const canonical = post.canonicalUrl || `/blogs/${slug}`;

  return {
    title: `${post.title} | IHDUA`,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title: `${post.title} | IHDUA`,
      description,
      url: canonical,
      type: "article",
      images: post.image
        ? [
            {
              url: post.image,
              alt: post.imageAlt || post.title,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: `${post.title} | IHDUA`,
      description,
      images: post.image ? [post.image] : undefined,
    },
  };
}

export default async function BlogSlugPage({ params }: BlogSlugPageProps) {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug) ?? BLOG_POSTS[0];

  if (!post) {
    notFound();
  }

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
