"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Typography from "@/lib/Typography";
import type { BlogPostView, StoryLink } from "@/domains/blogs/lib/mapStoryToPost";

interface BlogDetailClientProps {
  post: BlogPostView;
  related: StoryLink[];
  prev: StoryLink | null;
  next: StoryLink | null;
  /** 1-based position of this story in the newest-first list */
  position: number;
  total: number;
}

/** Styles for the CMS HTML (Tailwind resets headings, lists, etc.) */
const CONTENT_CLASS = [
  "font-figtree text-[1.125rem] font-normal leading-relaxed text-[#5F6C6D]",
  "[&_p]:mb-4",
  "[&_h1]:mb-3 [&_h1]:mt-8 [&_h1]:font-lora [&_h1]:text-3xl [&_h1]:leading-snug [&_h1]:text-[#00191B]",
  "[&_h2]:mb-3 [&_h2]:mt-8 [&_h2]:font-lora [&_h2]:text-2xl [&_h2]:leading-snug [&_h2]:text-[#00191B]",
  "[&_h3]:mb-2 [&_h3]:mt-6 [&_h3]:font-lora [&_h3]:text-xl [&_h3]:leading-snug [&_h3]:text-[#00191B]",
  "[&_h4]:mb-2 [&_h4]:mt-5 [&_h4]:font-lora [&_h4]:text-lg [&_h4]:text-[#00191B]",
  "[&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-6",
  "[&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:pl-6",
  "[&_li]:mb-1",
  "[&_a]:text-[#9739A8] [&_a]:underline hover:[&_a]:text-[#7A2E87]",
  "[&_strong]:font-semibold [&_strong]:text-[#00191B]",
  "[&_img]:my-6 [&_img]:h-auto [&_img]:max-w-full [&_img]:rounded-md",
  "[&_figure]:my-6 [&_figcaption]:mt-2 [&_figcaption]:text-sm",
  "[&_blockquote]:my-6 [&_blockquote]:border-l-4 [&_blockquote]:border-[#9739A8] [&_blockquote]:pl-4 [&_blockquote]:italic",
  "[&_iframe]:aspect-video [&_iframe]:h-auto [&_iframe]:w-full [&_iframe]:rounded-md",
  "[&_table]:my-6 [&_table]:block [&_table]:max-w-full [&_table]:overflow-x-auto",
  "[&>*:first-child]:mt-0",
].join(" ");

export default function BlogDetailClient({
  post,
  related,
  prev,
  next,
  position,
  total,
}: BlogDetailClientProps) {
  // Scoped to this page's lifecycle without touching globals.css
  useEffect(() => {
    const prevHtmlOverflowX = document.documentElement.style.overflowX;
    const prevHtmlOverflowY = document.documentElement.style.overflowY;
    const prevBodyOverflowX = document.body.style.overflowX;
    const prevBodyOverflowY = document.body.style.overflowY;

    document.documentElement.style.setProperty("overflow-x", "clip", "important");
    document.documentElement.style.setProperty("overflow-y", "visible", "important");
    document.body.style.setProperty("overflow-x", "clip", "important");
    document.body.style.setProperty("overflow-y", "visible", "important");

    return () => {
      document.documentElement.style.overflowX = prevHtmlOverflowX;
      document.documentElement.style.overflowY = prevHtmlOverflowY;
      document.body.style.overflowX = prevBodyOverflowX;
      document.body.style.overflowY = prevBodyOverflowY;
    };
  }, []);

  return (
    <section className="blog-sticky-active w-full bg-white px-6 pt-8 sm:pt-10 lg:px-12 lg:pt-12 2xl:px-32">
      <div className="mx-auto w-full max-w-[100rem]">
        {/* Top Header: Category Tag & Date */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          {post.category ? (
            <div className="flex items-center gap-2">
              <span className="h-px w-6 bg-[#9739A8]" />
              <Typography
                variant="caption"
                className="font-figtree font-bold uppercase tracking-wider text-[#9739A8]"
              >
                {post.category}
              </Typography>
              <span className="h-px w-6 bg-[#9739A8]" />
            </div>
          ) : (
            <span />
          )}

          <Typography
            variant="caption"
            className="font-figtree font-normal normal-case tracking-normal text-[#7A8889]"
          >
            {post.date}
          </Typography>
        </div>

        {/* Story Title & Subtitle */}
        <div className="mt-3">
          <Typography
            variant="h3"
            as="h1"
            className="font-lora font-normal leading-[1.25] text-[#00191B]"
          >
            {post.title}
          </Typography>

          {post.subtitle && (
            <Typography
              variant="body-lg"
              as="p"
              className="mt-2 font-figtree font-normal text-[#5F6C6D]"
            >
              {post.subtitle}
            </Typography>
          )}
        </div>

        {/* Side-by-side on 1024px+ (lg), stacked below 1024px */}
        <div className="mt-6 flex flex-col sm:mt-8 lg:flex-row lg:gap-8 xl:gap-12 2xl:gap-14">
          {/* Left Column: banner + full article */}
          <article className="flex w-full min-w-0 flex-col lg:flex-1">
            {post.image && (
              <div className="relative aspect-[64.9375/33.5625] w-full max-w-[64.9375rem] overflow-hidden rounded-[0.375rem] bg-neutral-100 shadow-xs">
                <Image
                  src={post.image}
                  alt={post.imageAlt}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 1040px"
                  className="object-cover"
                />
              </div>
            )}

            {/* Article body (HTML from the CMS) */}
            <div className="mt-6">
              {post.contentHtml ? (
                <div
                  className={CONTENT_CLASS}
                  dangerouslySetInnerHTML={{ __html: post.contentHtml }}
                />
              ) : (
                <Typography
                  variant="body-lg"
                  as="p"
                  className="font-figtree font-normal text-[#5F6C6D]"
                >
                  This story has no content yet.
                </Typography>
              )}
            </div>

            {/* Bottom Bar: Back to all + story navigator */}
            <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-neutral-100 pt-6 sm:mt-12">
              <Link
                href="/blogs"
                className="inline-flex items-center gap-2 font-figtree text-sm font-semibold text-[#9739A8] transition hover:text-[#7A2E87]"
              >
                <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span>Back to all Blogs &amp; Stories</span>
              </Link>

              <div className="inline-flex items-center overflow-hidden rounded-lg border border-[#E0E0E0] bg-white shadow-xs">
                {prev ? (
                  <Link
                    href={`/blogs/${prev.slug}`}
                    aria-label="Previous story"
                    className="flex size-9 cursor-pointer items-center justify-center border-r border-[#E0E0E0] text-[#1E1E1E] transition hover:bg-neutral-100 active:scale-95 sm:size-10"
                  >
                    <svg className="size-4 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                  </Link>
                ) : (
                  <span
                    aria-disabled="true"
                    className="flex size-9 cursor-not-allowed items-center justify-center border-r border-[#E0E0E0] opacity-30 sm:size-10"
                  >
                    <svg className="size-4 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                  </span>
                )}

                <span className="select-none px-5 py-2 font-figtree text-xs font-medium text-neutral-700 sm:text-sm">
                  {position} / {total}
                </span>

                {next ? (
                  <Link
                    href={`/blogs/${next.slug}`}
                    aria-label="Next story"
                    className="flex size-9 cursor-pointer items-center justify-center border-l border-[#E0E0E0] text-[#1E1E1E] transition hover:bg-neutral-100 active:scale-95 sm:size-10"
                  >
                    <svg className="size-4 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                ) : (
                  <span
                    aria-disabled="true"
                    className="flex size-9 cursor-not-allowed items-center justify-center border-l border-[#E0E0E0] opacity-30 sm:size-10"
                  >
                    <svg className="size-4 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                )}
              </div>
            </div>
          </article>

          {/* Right Column: related stories */}
          {related.length > 0 && (
            <aside className="mt-8 w-full lg:mt-0 lg:w-[24rem] lg:shrink-0 xl:w-[28rem] 2xl:w-[31.4375rem]">
              <div
                className="w-full rounded-[0.375rem] bg-[#F8F5F0] p-5 shadow-xs sm:p-6 lg:p-5 xl:p-6"
                style={{ position: "sticky", top: "6rem" }}
              >
                <Typography variant="h3" className="font-lora font-normal text-[#00191B]">
                  Related Stories
                </Typography>

                {/* items-start so thumbnails stay top-aligned when titles wrap to many lines */}
                <div className="mt-5 grid grid-cols-1 gap-4 sm:mt-6 sm:grid-cols-3 sm:gap-5 lg:grid-cols-1 lg:gap-4 xl:gap-5">
                  {related.map((story) => (
                    <Link
                      key={story.id}
                      href={`/blogs/${story.slug}`}
                      className="group flex cursor-pointer flex-row items-start gap-3 transition hover:opacity-90 sm:flex-col sm:items-start lg:flex-row lg:items-start xl:gap-4"
                    >
                      <div className="relative size-20 shrink-0 overflow-hidden rounded-[0.375rem] bg-neutral-200 sm:aspect-[16/10] sm:size-auto sm:w-full lg:size-[5.5rem] lg:aspect-auto xl:size-[6.75rem]">
                        {story.image && (
                          <Image
                            src={story.image}
                            alt={story.title}
                            fill
                            sizes="(max-width: 640px) 80px, (max-width: 1024px) 300px, 160px"
                            className="object-cover transition-transform duration-200 group-hover:scale-105"
                          />
                        )}
                      </div>

                      {/* Full title shown: no line-clamp, wraps naturally (English + Kannada) */}
                      <div className="flex min-w-0 flex-1 flex-col justify-start sm:w-full">
                        <Typography
                          variant="body-md"
                          as="h4"
                          className="break-words font-lora font-normal leading-normal text-[#00191B] transition-colors group-hover:text-[#9739A8]"
                        >
                          {story.title}
                        </Typography>
                        <Typography
                          variant="caption"
                          as="p"
                          className="mt-1 font-figtree font-normal text-[#1E1E1E]/40 sm:mt-1.5"
                        >
                          {story.date}
                        </Typography>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </aside>
          )}
        </div>
      </div>
    </section>
  );
}