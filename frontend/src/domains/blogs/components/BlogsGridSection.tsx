"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Typography from "@/lib/Typography";
import { useBlogsList } from "@/domains/blogs/hooks/useBlogsList";

const ITEMS_PER_PAGE = 6;

type SortOrder = "newest" | "oldest";

type Option = { value: string; label: string };

/** Small dropdown matching the existing "Newest First" design */
function Dropdown({
  value,
  options,
  onChange,
  widthClass = "w-40",
}: {
  value: string;
  options: Option[];
  onChange: (value: string) => void;
  widthClass?: string;
}) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  const current = options.find((o) => o.value === value) ?? options[0];

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex cursor-pointer items-center gap-2 rounded border border-[#E0E0E0] bg-white px-3 py-1.5 text-xs font-medium text-[#1E1E1E] shadow-xs transition hover:bg-neutral-50 sm:px-4 sm:py-2 sm:text-sm"
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <span className="max-w-[9rem] truncate">{current?.label}</span>
        <svg
          className={`size-4 shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div
          role="listbox"
          className={`absolute right-0 z-20 mt-1 max-h-64 overflow-auto rounded border border-neutral-200 bg-white py-1 shadow-lg ${widthClass}`}
        >
          {options.map((o) => (
            <button
              key={o.value}
              type="button"
              role="option"
              aria-selected={o.value === value}
              onClick={() => {
                onChange(o.value);
                setOpen(false);
              }}
              className={`w-full cursor-pointer px-4 py-2 text-left text-sm transition hover:bg-neutral-100 ${
                o.value === value ? "font-semibold text-[#9739A8]" : "text-neutral-700"
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

const SORT_OPTIONS: Option[] = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
];

export default function BlogsGridSection() {
  // posts: null while loading; [] when nothing is published or the API failed
  const { posts, categories } = useBlogsList();

  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");
  const [categoryId, setCategoryId] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const sectionRef = useRef<HTMLElement>(null);

  const categoryOptions = useMemo<Option[]>(
    () => [
      { value: "all", label: "All Categories" },
      ...categories.map((c) => ({ value: c.id, label: c.name })),
    ],
    [categories],
  );

  const visiblePosts = useMemo(() => {
    const list = (posts ?? []).filter(
      (p) => categoryId === "all" || p.categoryId === categoryId,
    );
    return [...list].sort((a, b) =>
      sortOrder === "newest" ? b.time - a.time : a.time - b.time,
    );
  }, [posts, categoryId, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(visiblePosts.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);

  const paginatedPosts = useMemo(() => {
    const start = (safePage - 1) * ITEMS_PER_PAGE;
    return visiblePosts.slice(start, start + ITEMS_PER_PAGE);
  }, [visiblePosts, safePage]);

  const getPageNumbers = (): (number | "...")[] => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (safePage <= 3) {
      return [1, 2, 3, "...", totalPages];
    }
    if (safePage >= totalPages - 2) {
      return [1, "...", totalPages - 2, totalPages - 1, totalPages];
    }
    return [1, "...", safePage - 1, safePage, safePage + 1, "...", totalPages];
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
    sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleSortChange = (value: string) => {
    setSortOrder(value as SortOrder);
    setCurrentPage(1);
  };

  const handleCategoryChange = (value: string) => {
    setCategoryId(value);
    setCurrentPage(1);
  };

  const loading = posts === null;
  const nothingPublished = posts !== null && posts.length === 0;
  const nothingInCategory = !nothingPublished && !loading && visiblePosts.length === 0;

  return (
    <section
      ref={sectionRef}
      className="w-full bg-white px-6 pt-6 pb-14 sm:pt-8 sm:pb-16 lg:px-10 lg:pt-10 lg:pb-20 2xl:px-40"
    >
      <div className="w-full">
        {/* Header: Eyebrow + Filters */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="h-px w-4 bg-[#9739A8] sm:w-8" />
            <Typography
              variant="caption"
              className="font-figtree font-bold uppercase tracking-wider text-[#9739A8]"
            >
              LATEST STORIES
            </Typography>
            <span className="h-px w-4 bg-[#9739A8] sm:w-8" />
          </div>

          {/* Controls only make sense once there is something to filter */}
          {!loading && !nothingPublished && (
            <div className="flex items-center gap-2 sm:gap-3">
              {categories.length > 0 && (
                <Dropdown
                  value={categoryId}
                  options={categoryOptions}
                  onChange={handleCategoryChange}
                  widthClass="w-48"
                />
              )}
              <Dropdown
                value={sortOrder}
                options={SORT_OPTIONS}
                onChange={handleSortChange}
                widthClass="w-36"
              />
            </div>
          )}
        </div>

        {/* Loading skeleton: keeps the space so the page doesn't jump */}
        {loading && (
          <div
            aria-hidden
            className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8"
          >
            {Array.from({ length: ITEMS_PER_PAGE }, (_, i) => (
              <div key={i} className="flex flex-col">
                <div className="aspect-[16/10] w-full animate-pulse rounded-md bg-neutral-100" />
                <div className="mt-4 h-5 w-3/4 animate-pulse rounded bg-neutral-100" />
              </div>
            ))}
          </div>
        )}

        {/* Loaded, but nothing is published in the CMS (or the API failed) */}
        {nothingPublished && (
          <div className="mt-8 flex min-h-[16rem] items-center justify-center rounded-lg border border-dashed border-[#D9D4C4] bg-[#FAF9F5] px-6 py-10 text-center">
            <Typography
              variant="body-lg"
              className="max-w-xl font-figtree font-normal leading-relaxed text-[#5F6C6D]"
            >
             New blogs and updates will be displayed here soon.
            </Typography>
          </div>
        )}

        {/* Stories exist, but none in the chosen category */}
        {nothingInCategory && (
          <div className="mt-8 flex min-h-[12rem] flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-[#D9D4C4] bg-[#FAF9F5] px-6 py-10 text-center">
            <Typography
              variant="body-lg"
              className="max-w-xl font-figtree font-normal leading-relaxed text-[#5F6C6D]"
            >
              No stories found in this category.
            </Typography>
            <button
              type="button"
              onClick={() => handleCategoryChange("all")}
              className="cursor-pointer font-figtree text-sm font-semibold text-[#9739A8] transition hover:text-[#7A2E87]"
            >
              Show all stories
            </button>
          </div>
        )}

        {/* Stories Grid */}
        {!loading && paginatedPosts.length > 0 && (
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {paginatedPosts.map((post, index) => (
              <Link
                key={post.id}
                href={`/blogs/${post.slug}`}
                className="group flex cursor-pointer flex-col"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-md bg-neutral-100">
                  {post.image && (
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      priority={safePage === 1 && index < 3}
                    />
                  )}
                </div>

                <div className="mt-4 flex items-start justify-between gap-4">
                  <Typography
                    variant="body-xl"
                    as="h3"
                    className="flex-1 font-lora font-normal leading-snug text-[#00191B] transition-colors group-hover:text-[#9739A8]"
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
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <nav
            aria-label="Pagination"
            className="mt-12 flex items-center justify-center gap-2 sm:mt-16"
          >
            <button
              type="button"
              onClick={() => handlePageChange(safePage - 1)}
              disabled={safePage === 1}
              aria-label="Previous page"
              className={`flex size-10 items-center justify-center rounded border border-[#E0E0E0] transition ${
                safePage === 1
                  ? "cursor-not-allowed opacity-40"
                  : "cursor-pointer text-[#1E1E1E] hover:bg-neutral-100 active:scale-95"
              }`}
            >
              <svg className="size-4 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {getPageNumbers().map((item, index) => {
              if (item === "...") {
                return (
                  <span
                    key={`ellipsis-${index}`}
                    className="flex size-10 select-none items-center justify-center font-figtree text-sm font-semibold text-neutral-400"
                  >
                    ...
                  </span>
                );
              }

              const isActive = item === safePage;
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => handlePageChange(item)}
                  className={`flex size-10 cursor-pointer items-center justify-center rounded text-sm font-medium transition ${
                    isActive
                      ? "bg-[#9739A8] text-white shadow-xs"
                      : "border border-[#E0E0E0] text-[#1E1E1E] hover:bg-neutral-100"
                  }`}
                  aria-label={`Page ${item}`}
                  aria-current={isActive ? "page" : undefined}
                >
                  {item}
                </button>
              );
            })}

            <button
              type="button"
              onClick={() => handlePageChange(safePage + 1)}
              disabled={safePage === totalPages}
              aria-label="Next page"
              className={`flex size-10 items-center justify-center rounded border border-[#E0E0E0] transition ${
                safePage === totalPages
                  ? "cursor-not-allowed opacity-40"
                  : "cursor-pointer text-[#1E1E1E] hover:bg-neutral-100 active:scale-95"
              }`}
            >
              <svg className="size-4 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </nav>
        )}
      </div>
    </section>
  );
}