"use client";

import { useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Typography from "@/lib/Typography";
import { BLOG_POSTS, type BlogPost } from "../constants/blogsData";

const ITEMS_PER_PAGE = 6;

export default function BlogsGridSection() {
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const sectionRef = useRef<HTMLDivElement>(null);

  const sortedPosts = useMemo(() => {
    return [...BLOG_POSTS].sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });
  }, [sortOrder]);

  const totalPages = Math.ceil(sortedPosts.length / ITEMS_PER_PAGE);

  const paginatedPosts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return sortedPosts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [sortedPosts, currentPage]);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
    if (sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleSortChange = (order: "newest" | "oldest") => {
    setSortOrder(order);
    setCurrentPage(1);
    setIsDropdownOpen(false);
  };

  return (
    <section
      ref={sectionRef}
      className="w-full bg-white px-6 pt-6 pb-14 sm:pt-8 sm:pb-16 lg:px-10 lg:pt-10 lg:pb-20 2xl:px-40"
    >
      <div className="w-full">
        {/* Header: Eyebrow + Sort Dropdown */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Eyebrow */}
          <div className="flex items-center gap-3">
            <span className="h-px w-6 sm:w-8 bg-[#9739A8]" />
            <Typography
              variant="caption"
              className="font-figtree font-bold uppercase tracking-wider text-[#9739A8]"
            >
              LATEST STORIES
            </Typography>
            <span className="h-px w-6 sm:w-8 bg-[#9739A8]" />
          </div>

          {/* Sort Dropdown */}
          <div className="relative self-end sm:self-auto">
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="inline-flex cursor-pointer items-center gap-2 rounded border border-[#E0E0E0] bg-white px-4 py-2 text-sm font-medium text-[#1E1E1E] shadow-xs transition hover:bg-neutral-50"
              aria-expanded={isDropdownOpen}
            >
              <span>{sortOrder === "newest" ? "Newest First" : "Oldest First"}</span>
              <svg
                className={`size-4 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 z-20 mt-1 w-36 rounded border border-neutral-200 bg-white py-1 shadow-lg">
                <button
                  type="button"
                  onClick={() => handleSortChange("newest")}
                  className={`w-full cursor-pointer px-4 py-2 text-left text-sm transition hover:bg-neutral-100 ${sortOrder === "newest" ? "font-semibold text-[#9739A8]" : "text-neutral-700"
                    }`}
                >
                  Newest First
                </button>
                <button
                  type="button"
                  onClick={() => handleSortChange("oldest")}
                  className={`w-full cursor-pointer px-4 py-2 text-left text-sm transition hover:bg-neutral-100 ${sortOrder === "oldest" ? "font-semibold text-[#9739A8]" : "text-neutral-700"
                    }`}
                >
                  Oldest First
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Stories Grid */}
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {paginatedPosts.map((post) => (
            <Link
              key={post.id}
              href={`/blogs/${post.slug}`}
              className="group flex flex-col cursor-pointer"
            >
              {/* Card Image */}
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-md bg-neutral-100">
                <Image
                  src={post.image}
                  alt={post.imageAlt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              {/* Card Bottom: Title & Action Button */}
              <div className="mt-4 flex items-start justify-between gap-4">
                <Typography
                  variant="body-xl"
                  as="h3"
                  className="font-lora font-normal leading-snug text-[#00191B] transition-colors group-hover:text-[#9739A8] line-clamp-2"
                >
                  {post.title}
                </Typography>

                <div
                  className="flex size-9 shrink-0 items-center justify-center rounded bg-[#FFD638] text-black shadow-xs transition-transform duration-200 group-hover:scale-105"
                  aria-hidden="true"
                >
                  <svg
                    className="size-4.5 stroke-[2.5]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M7 17L17 7M17 7H9M17 7V15"
                    />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Pagination Section */}
        {totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center gap-2 sm:mt-16">
            {/* Previous Page Arrow */}
            <button
              type="button"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              aria-label="Previous page"
              className={`flex size-10 items-center justify-center rounded border border-[#E0E0E0] transition ${currentPage === 1
                ? "cursor-not-allowed opacity-40"
                : "cursor-pointer text-[#1E1E1E] hover:bg-neutral-100 active:scale-95"
                }`}
            >
              <svg className="size-4 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Page Number Buttons */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
              const isActive = pageNum === currentPage;
              return (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => handlePageChange(pageNum)}
                  className={`flex size-10 cursor-pointer items-center justify-center rounded text-sm font-medium transition ${isActive
                    ? "bg-[#9739A8] text-white shadow-xs"
                    : "border border-[#E0E0E0] text-[#1E1E1E] hover:bg-neutral-100"
                    }`}
                  aria-label={`Page ${pageNum}`}
                  aria-current={isActive ? "page" : undefined}
                >
                  {pageNum}
                </button>
              );
            })}

            {/* Next Page Arrow */}
            <button
              type="button"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              aria-label="Next page"
              className={`flex size-10 items-center justify-center rounded border border-[#E0E0E0] transition ${currentPage === totalPages
                ? "cursor-not-allowed opacity-40"
                : "cursor-pointer text-[#1E1E1E] hover:bg-neutral-100 active:scale-95"
                }`}
            >
              <svg className="size-4 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
