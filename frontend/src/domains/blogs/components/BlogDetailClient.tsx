"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Typography from "@/lib/Typography";
import { BLOG_POSTS, type BlogPost } from "../constants/blogsData";

interface BlogDetailClientProps {
  initialPost: BlogPost;
}

export default function BlogDetailClient({ initialPost }: BlogDetailClientProps) {
  const [currentPost, setCurrentPost] = useState<BlogPost>(initialPost);

  // Option 2: Scoped strictly to this page's lifecycle without touching globals.css
  useEffect(() => {
    const prevHtmlOverflowX = document.documentElement.style.overflowX;
    const prevHtmlOverflowY = document.documentElement.style.overflowY;
    const prevBodyOverflowX = document.body.style.overflowX;
    const prevBodyOverflowY = document.body.style.overflowY;

    // Apply clip with !important priority on this page only
    document.documentElement.style.setProperty("overflow-x", "clip", "important");
    document.documentElement.style.setProperty("overflow-y", "visible", "important");
    document.body.style.setProperty("overflow-x", "clip", "important");
    document.body.style.setProperty("overflow-y", "visible", "important");

    return () => {
      // Revert to exact defaults when navigating away
      document.documentElement.style.overflowX = prevHtmlOverflowX;
      document.documentElement.style.overflowY = prevHtmlOverflowY;
      document.body.style.overflowX = prevBodyOverflowX;
      document.body.style.overflowY = prevBodyOverflowY;
    };
  }, []);

  // Related stories: all other stories except active, taking top 3
  const relatedStories = useMemo(() => {
    return BLOG_POSTS.filter((post) => post.slug !== currentPost.slug).slice(0, 3);
  }, [currentPost.slug]);

  const currentIndex = BLOG_POSTS.findIndex((p) => p.slug === currentPost.slug);
  const prevStory = currentIndex > 0 ? BLOG_POSTS[currentIndex - 1] : null;
  const nextStory = currentIndex < BLOG_POSTS.length - 1 ? BLOG_POSTS[currentIndex + 1] : null;

  const handleSelectStory = (story: BlogPost) => {
    setCurrentPost(story);
    window.history.pushState(null, "", `/blogs/${story.slug}`);
    window.scrollTo({ top: 380, behavior: "smooth" });
  };

  return (
    <section className="blog-sticky-active w-full bg-white px-6 pt-8 pb-16 sm:pt-10 sm:pb-20 lg:px-12 lg:pt-12 2xl:px-32">
      <div className="mx-auto w-full max-w-[100rem]">
        {/* Top Header: Category Tag & Date */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="h-px w-6 bg-[#9739A8]" />
            <Typography
              variant="caption"
              className="font-figtree font-bold uppercase tracking-wider text-[#9739A8]"
            >
              {currentPost.category}
            </Typography>
            <span className="h-px w-6 bg-[#9739A8]" />
          </div>

          <Typography
            variant="caption"
            className="font-figtree font-normal text-[#7A8889] normal-case tracking-normal"
          >
            {currentPost.date}
          </Typography>
        </div>

        {/* Story Title & Subtitle */}
        <div className="mt-3">
          <Typography
            variant="h3"
            as="h1"
            className="font-lora font-normal leading-[1.25] text-[#00191B]"
          >
            {currentPost.title}
          </Typography>

          {currentPost.subtitle && (
            <Typography
              variant="body-lg"
              as="p"
              className="mt-2 font-figtree font-normal text-[#5F6C6D]"
            >
              {currentPost.subtitle}
            </Typography>
          )}
        </div>

        {/* Side-by-side on 1024px+ (lg), stacked up-and-down below 1024px */}
        <div className="mt-6 sm:mt-8 flex flex-col lg:flex-row lg:gap-8 xl:gap-12 2xl:gap-14">
          {/* Left Column (Article Photo & Full Natural Story Content) */}
          <article className="w-full lg:flex-1 min-w-0 flex flex-col">
            {/* Main Photo (Exact Figma: 64.9375rem x 33.5625rem, Radius: 0.375rem) */}
            <div className="relative aspect-[64.9375/33.5625] w-full max-w-[64.9375rem] overflow-hidden rounded-[0.375rem] bg-neutral-100 shadow-xs">
              <Image
                src={currentPost.image}
                alt={currentPost.imageAlt}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 1040px"
                className="object-cover transition-opacity duration-300"
              />
            </div>

            {/* Natural Text Flow (Full height, no inner scroll box) */}
            <div className="mt-6 flex flex-col gap-6">
              {/* Lead Paragraph */}
              {currentPost.leadParagraph && (
                <Typography
                  variant="body-lg"
                  as="p"
                  className="font-figtree font-normal leading-relaxed text-[#5F6C6D]"
                >
                  {currentPost.leadParagraph}
                </Typography>
              )}

              {/* Subsections */}
              {currentPost.contentSections && currentPost.contentSections.length > 0 && (
                <div className="flex flex-col gap-6">
                  {currentPost.contentSections.map((sec, idx) => (
                    <div key={idx} className="flex flex-col">
                      {sec.heading && (
                        <Typography
                          variant="h4"
                          as="h2"
                          className="font-lora font-normal leading-[1.4] text-[#00191B]"
                        >
                          {sec.heading}
                        </Typography>
                      )}

                      {sec.image && (
                        <div className="relative mt-4 aspect-[16/9] w-full overflow-hidden rounded-[0.375rem] bg-neutral-100 shadow-xs">
                          <Image
                            src={sec.image}
                            alt={sec.imageAlt || sec.heading || "Story section image"}
                            fill
                            sizes="(max-width: 1024px) 100vw, 1040px"
                            className="object-cover"
                          />
                        </div>
                      )}

                      <div className="mt-3 flex flex-col gap-3">
                        {sec.paragraphs.map((p, pIdx) => (
                          <Typography
                            key={pIdx}
                            variant="body-lg"
                            as="p"
                            className="font-figtree font-normal leading-relaxed text-[#5F6C6D]"
                          >
                            {p}
                          </Typography>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom Bar: Back to all + Figma Story Navigator (<  X / Y  >) */}
            <div className="mt-10 sm:mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-neutral-100 pt-6">
              <Link
                href="/blogs"
                className="inline-flex items-center gap-2 font-figtree text-sm font-semibold text-[#9739A8] transition hover:text-[#7A2E87]"
              >
                <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span>Back to all Blogs & Stories</span>
              </Link>

              {/* Figma Bottom Story Navigator */}
              <div className="inline-flex items-center rounded-lg border border-[#E0E0E0] bg-white shadow-xs overflow-hidden">
                <button
                  type="button"
                  onClick={() => prevStory && handleSelectStory(prevStory)}
                  disabled={!prevStory}
                  aria-label="Previous story"
                  className={`flex size-9 sm:size-10 items-center justify-center border-r border-[#E0E0E0] transition ${!prevStory
                    ? "cursor-not-allowed opacity-30"
                    : "cursor-pointer text-[#1E1E1E] hover:bg-neutral-100 active:scale-95"
                    }`}
                >
                  <svg className="size-4 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                <span className="px-5 py-2 text-xs sm:text-sm font-figtree font-medium text-neutral-700 select-none">
                  {(currentIndex >= 0 ? currentIndex + 1 : 1)} / {BLOG_POSTS.length}
                </span>

                <button
                  type="button"
                  onClick={() => nextStory && handleSelectStory(nextStory)}
                  disabled={!nextStory}
                  aria-label="Next story"
                  className={`flex size-9 sm:size-10 items-center justify-center border-l border-[#E0E0E0] transition ${!nextStory
                    ? "cursor-not-allowed opacity-30"
                    : "cursor-pointer text-[#1E1E1E] hover:bg-neutral-100 active:scale-95"
                    }`}
                >
                  <svg className="size-4 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </article>

          {/* Right Column: Sticky side-by-side on lg+ (1024px+), Horizontal row on < 1024px */}
          <aside className="w-full lg:w-[24rem] xl:w-[28rem] 2xl:w-[31.4375rem] lg:shrink-0 mt-8 lg:mt-0">
            <div
              className="w-full rounded-[0.375rem] bg-[#F8F5F0] p-5 sm:p-6 lg:p-5 xl:p-6 shadow-xs lg:sticky lg:top-24"
              style={{ position: "sticky", top: "6rem" }}
            >
              <Typography
                variant="h3"
                className="font-lora font-normal text-[#00191B]"
              >
                Related Stories
              </Typography>

              {/* Related Stories: 3-column horizontal on tablets (<1024px), vertical sidebar on desktop (>=1024px) */}
              <div className="mt-5 sm:mt-6 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-4 sm:gap-5 lg:gap-4 xl:gap-5">
                {relatedStories.map((story) => (
                  <div
                    key={story.id}
                    onClick={() => handleSelectStory(story)}
                    className="group flex flex-row sm:flex-col lg:flex-row cursor-pointer items-center sm:items-start lg:items-center gap-3 sm:gap-3 lg:gap-3 xl:gap-4 transition hover:opacity-90"
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        handleSelectStory(story);
                      }
                    }}
                  >
                    {/* Thumbnail: landscape aspect on tablets, square on mobile/desktop */}
                    <div className="relative size-20 sm:size-auto sm:w-full sm:aspect-[16/10] lg:size-[5.5rem] xl:size-[6.75rem] shrink-0 overflow-hidden rounded-[0.375rem] bg-neutral-200">
                      <Image
                        src={story.image}
                        alt={story.imageAlt}
                        fill
                        sizes="(max-width: 640px) 80px, (max-width: 1024px) 300px, 160px"
                        className="object-cover transition-transform duration-200 group-hover:scale-105"
                      />
                    </div>

                    {/* Story Title & Date */}
                    <div className="flex-1 min-w-0 sm:w-full flex flex-col justify-center sm:justify-start">
                      <Typography
                        variant="body-md"
                        as="h4"
                        className="font-lora font-normal leading-[1.35] text-[#00191B] transition-colors group-hover:text-[#9739A8] line-clamp-2"
                      >
                        {story.title}
                      </Typography>

                      <Typography
                        variant="caption"
                        as="p"
                        className="mt-1 sm:mt-1.5 font-figtree font-normal text-[#1E1E1E]/40"
                      >
                        {story.date}
                      </Typography>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
