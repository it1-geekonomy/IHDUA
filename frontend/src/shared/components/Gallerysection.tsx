"use client";

import { useState, useEffect, useRef } from "react";
import Typography from "@/lib/Typography";
import { GalleryCarousel, GalleryNav, GalleryTile } from "@/shared/components/GalleryParts";
import type { GalleryImage } from "@/shared/components/GalleryParts";

export type { GalleryImage } from "@/shared/components/GalleryParts";

const COLUMNS = 4;
const GAP = "clamp(0.5rem, 1.4vw, 1rem)";
const SLIDE_MS = 500;

export interface GallerySectionProps {
  heading: string;
  images: GalleryImage[];
  /**
   * How many rows the desktop grid shows at once.
   * rows = 1: each arrow click slides the row by ONE image (smooth animation).
   * rows >= 2: each arrow click moves to the next page; the last page shows only the images left.
   * Default 4.
   */
  rows?: number;
  /**
   * @deprecated No longer used by the desktop grid. Kept so existing usages don't break.
   */
  showLatest?: boolean;
  className?: string;
}

function GalleryGrid({
  images,
  visibleCount,
  singleStep,
  onTileClick,
  onPageChange,
}: {
  images: GalleryImage[];
  visibleCount: number;
  singleStep: boolean;
  onTileClick: (index: number) => void;
  onPageChange: () => void;
}) {
  // Index of the first visible image
  const [startIndex, setStartIndex] = useState(0);

  const step = singleStep ? 1 : visibleCount;
  const maxStart = singleStep
    ? Math.max(0, images.length - visibleCount)
    : (Math.max(1, Math.ceil(images.length / visibleCount)) - 1) * visibleCount;

  // Clamp, in case images are removed while a later position is open
  const start = Math.min(startIndex, maxStart);
  const end = Math.min(start + visibleCount, images.length);

  const canPrev = start > 0;
  const canNext = start < maxStart;

  const move = (next: number) => {
    setStartIndex(Math.max(0, Math.min(maxStart, next)));
    onPageChange();
  };

  const tileSizes = "(min-width: 1536px) 18vw, (min-width: 1024px) 22vw, 23vw";

  return (
    <div className="hidden flex-col gap-[clamp(1.25rem,3vw,2rem)] md:flex">
      <style>{`
        .gallery-page-fade { animation: gallery-page-fade 450ms ease-out; }
        @keyframes gallery-page-fade {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .gallery-slide-track { transition: transform ${SLIDE_MS}ms cubic-bezier(0.22, 1, 0.36, 1); }
        @media (prefers-reduced-motion: reduce) {
          .gallery-page-fade { animation: none; }
          .gallery-slide-track { transition: none; }
        }
      `}</style>

      {singleStep ? (
        // Sliding row: all images sit in one track, and the track moves left or right
        <div className="overflow-hidden">
          <div
            className="gallery-slide-track flex"
            style={{
              gap: GAP,
              // The track is as wide as the visible area, so 100% here = visible width.
              // One step = one tile width + one gap.
              transform: `translateX(calc(${-start} * ((100% - ${COLUMNS - 1} * ${GAP}) / ${COLUMNS} + ${GAP})))`,
            }}
          >
            {images.map((image, i) => {
              const inView = i >= start && i < end;
              return (
                <div
                  key={i}
                  className="shrink-0"
                  style={{ flexBasis: `calc((100% - ${COLUMNS - 1} * ${GAP}) / ${COLUMNS})` }}
                  aria-hidden={!inView}
                  // Off-screen tiles can't be tabbed to (that would scroll the hidden track)
                  ref={(el) => {
                    if (el) el.toggleAttribute("inert", !inView);
                  }}
                >
                  <GalleryTile
                    image={image}
                    aspectClass="aspect-[16/10]"
                    sizes={tileSizes}
                    onClick={() => onTileClick(i)}
                  />
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        // Paged grid: only this page's images are rendered, so a short last page has no empty slots
        <div
          key={start}
          className="gallery-page-fade grid grid-cols-4"
          style={{ gap: GAP }}
        >
          {images.slice(start, end).map((image, i) => {
            const realIndex = start + i; // index in the full list, used by the lightbox
            return (
              <div key={realIndex}>
                <GalleryTile
                  image={image}
                  aspectClass="aspect-[16/10]"
                  sizes={tileSizes}
                  onClick={() => onTileClick(realIndex)}
                />
              </div>
            );
          })}
        </div>
      )}

      <GalleryNav
        canPrev={canPrev}
        canNext={canNext}
        onPrev={() => move(start - step)}
        onNext={() => move(start + step)}
      />
    </div>
  );
}

export default function GallerySection({
  heading,
  images,
  rows = 4,
  className = "",
}: GallerySectionProps) {
  const [activeModalIndex, setActiveModalIndex] = useState<number | null>(null);
  const [loaded, setLoaded] = useState<{ src: string; ratio: number } | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const rowCount = Math.max(1, Math.floor(rows));
  const visibleCount = rowCount * COLUMNS;
  const singleStep = rowCount === 1;

  // Scroll so the top of the gallery section sits just below the navbar.
  // Skipped for a single row: the section is short and the arrows are already in view.
  const scrollToSectionTop = () => {
    if (singleStep) return;
    // Wait one frame so the new page has rendered (a shorter last page changes the height)
    requestAnimationFrame(() => {
      const el = sectionRef.current;
      if (!el) return;
      const navOffset = window.innerWidth >= 1024 ? 80 : 64;
      const top = el.getBoundingClientRect().top + window.scrollY - navOffset;
      window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
    });
  };

  useEffect(() => {
    if (activeModalIndex === null) return;

    const html = document.documentElement;
    const body = document.body;

    const scrollKeys = new Set([" ", "PageUp", "PageDown", "Home", "End", "ArrowUp", "ArrowDown"]);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveModalIndex(null);
      else if (scrollKeys.has(e.key)) e.preventDefault(); // no keyboard scrolling of the page
    };
    // Block mouse wheel / touch scrolling (also works with smooth-scroll libraries)
    const blockScroll = (e: Event) => e.preventDefault();

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("wheel", blockScroll, { passive: false });
    window.addEventListener("touchmove", blockScroll, { passive: false });

    const original = {
      htmlOverflow: html.style.overflow,
      bodyOverflow: body.style.overflow,
      bodyPaddingRight: body.style.paddingRight,
      htmlOverscroll: html.style.overscrollBehavior,
    };
    const scrollbarWidth = window.innerWidth - html.clientWidth;
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    html.style.overscrollBehavior = "none";
    if (scrollbarWidth > 0) body.style.paddingRight = `${scrollbarWidth}px`;

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("wheel", blockScroll);
      window.removeEventListener("touchmove", blockScroll);
      html.style.overflow = original.htmlOverflow;
      body.style.overflow = original.bodyOverflow;
      body.style.paddingRight = original.bodyPaddingRight;
      html.style.overscrollBehavior = original.htmlOverscroll;
    };
  }, [activeModalIndex]);

  if (images.length === 0) return null;

  return (
    <>
      <section
        ref={sectionRef}
        aria-label={heading}
        className={`flex w-full flex-col gap-[clamp(1.25rem,3vw,2.5rem)] px-6 pt-6 lg:px-10 lg:pt-8 xl:pt-14 2xl:px-40 ${className}`}
      >
        <Typography variant="h2" className="text-center font-lora leading-[1.2] text-[#00191B] sm:text-left">
          {heading}
        </Typography>

        <GalleryGrid
          images={images}
          visibleCount={visibleCount}
          singleStep={singleStep}
          onTileClick={(index) => setActiveModalIndex(index)}
          onPageChange={scrollToSectionTop}
        />
        <GalleryCarousel images={images} onImageClick={(index) => setActiveModalIndex(index)} />
      </section>

      {/* Lightbox: centered image, blurred background, X to close, click outside to close */}
      {activeModalIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Enlarged photo view"
          className="gallery-lb-overlay fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-md sm:p-8"
          onClick={() => setActiveModalIndex(null)}
        >
          <style>{`
            @keyframes gallery-lb-fade { from { opacity: 0; } to { opacity: 1; } }
            @keyframes gallery-lb-pop {
              from { opacity: 0; transform: scale(0.85) translateY(12px); }
              to   { opacity: 1; transform: scale(1) translateY(0); }
            }
            .gallery-lb-overlay { animation: gallery-lb-fade 250ms ease-out; }
            .gallery-lb-image { animation: gallery-lb-pop 400ms cubic-bezier(0.22, 1, 0.36, 1); }
            @media (prefers-reduced-motion: reduce) {
              .gallery-lb-overlay, .gallery-lb-image { animation: none; }
            }
          `}</style>

          {/* Wrapper is exactly the image size, so the X sits on the image's top-right corner */}
          <div
            className="gallery-lb-image relative"
            style={{
              width:
                loaded && loaded.src === images[activeModalIndex].src
                  ? `min(92vw, 1200px, calc(88vh * ${loaded.ratio}))`
                  : "min(92vw, 1200px)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Plain <img> at its natural resolution: no compression, stays sharp */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={images[activeModalIndex].src}
              alt={images[activeModalIndex].alt}
              onLoad={(e) => {
                const { naturalWidth, naturalHeight } = e.currentTarget;
                if (naturalWidth && naturalHeight) {
                  setLoaded({ src: images[activeModalIndex].src, ratio: naturalWidth / naturalHeight });
                }
              }}
              className="block h-auto w-full rounded-md shadow-2xl"
            />

            <button
              type="button"
              onClick={() => setActiveModalIndex(null)}
              className="absolute right-1.5 top-1.5 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-black/90 hover:text-[#FFD638] focus:outline-none sm:right-2 sm:top-2 sm:h-7 sm:w-7 lg:h-8 lg:w-8"
              aria-label="Close enlarged photo"
            >
              <svg className="h-3.5 w-3.5 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.4}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}