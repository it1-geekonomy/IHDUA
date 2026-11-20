"use client";

import { useMemo, useRef, useState } from "react";
import Typography from "@/lib/Typography";
import ProgrammeCard from "@/domains/programmes/components/ProgrammeCard";
import type { ProgrammeListItem } from "@/domains/programmes/lib/programmes";

const ITEMS_PER_PAGE = 3;

export default function ProgrammesGridSection({
  initialItems = [],
}: {
  initialItems?: ProgrammeListItem[];
}) {
  const [page, setPage] = useState(1);
  const sectionRef = useRef<HTMLElement>(null);

  const totalPages = Math.max(1, Math.ceil(initialItems.length / ITEMS_PER_PAGE));
  const safePage = Math.min(page, totalPages);

  const pageItems = useMemo(() => {
    const start = (safePage - 1) * ITEMS_PER_PAGE;
    return initialItems.slice(start, start + ITEMS_PER_PAGE);
  }, [initialItems, safePage]);

  const goTo = (next: number) => {
    setPage(next);
    sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section
      ref={sectionRef}
      className="w-full bg-white px-6 py-10 sm:py-14 lg:px-12 lg:py-16 2xl:px-32"
    >
      <div className="mx-auto w-full max-w-[100rem]">
        {initialItems.length === 0 ? (
          <div className="flex min-h-[16rem] items-center justify-center rounded-lg border border-dashed border-[#D9D4C4] bg-[#FAF9F5] px-6 py-10 text-center">
            <Typography
              variant="body-lg"
              className="max-w-xl font-figtree font-normal leading-relaxed text-[#5F6C6D]"
            >
              New programmes and events will be displayed here soon.
            </Typography>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
              {pageItems.map((item, index) => (
                <ProgrammeCard
                  key={item.id}
                  programme={item}
                  priority={safePage === 1 && index < 3}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <nav
                aria-label="Programmes pagination"
                className="mt-10 flex items-center justify-center gap-4 sm:mt-12"
              >
                <button
                  type="button"
                  onClick={() => goTo(safePage - 1)}
                  disabled={safePage === 1}
                  aria-label="Previous page"
                  className={`flex size-11 items-center justify-center rounded-full bg-[#FFD638] text-[#00191B] shadow-xs transition ${
                    safePage === 1
                      ? "cursor-not-allowed opacity-40"
                      : "cursor-pointer hover:brightness-95 active:scale-95"
                  }`}
                >
                  <svg
                    className="size-4 stroke-[2.5]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>

                <button
                  type="button"
                  onClick={() => goTo(safePage + 1)}
                  disabled={safePage === totalPages}
                  aria-label="Next page"
                  className={`flex size-11 items-center justify-center rounded-full bg-[#FFD638] text-[#00191B] shadow-xs transition ${
                    safePage === totalPages
                      ? "cursor-not-allowed opacity-40"
                      : "cursor-pointer hover:brightness-95 active:scale-95"
                  }`}
                >
                  <svg
                    className="size-4 stroke-[2.5]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </nav>
            )}
          </>
        )}
      </div>
    </section>
  );
}
