"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Typography from "@/lib/Typography";
import { VISIBLE_COUNT } from "@/shared/constants/gallery";
import { GalleryCarousel, GalleryNav, GalleryTile } from "@/shared/components/GalleryParts";
import type { GalleryImage } from "@/shared/components/GalleryParts";

export type { GalleryImage } from "@/shared/components/GalleryParts";

export interface GallerySectionProps {
  heading: string;
  images: GalleryImage[];
  className?: string;
}

function getStops(total: number): number[] {
  const maxOffset = Math.max(0, total - VISIBLE_COUNT);
  const stops = [0];
  for (let o = VISIBLE_COUNT; o < maxOffset; o += VISIBLE_COUNT) stops.push(o);
  if (maxOffset > 0) stops.push(maxOffset);
  return stops;
}

function GalleryGrid({
  images,
  onTileClick,
}: {
  images: GalleryImage[];
  onTileClick: (index: number) => void;
}) {
  const [offset, setOffset] = useState(0);

  const maxOffset = Math.max(0, images.length - VISIBLE_COUNT);
  const current = Math.min(offset, maxOffset);
  const windowEnd = current + VISIBLE_COUNT;

  const stops = getStops(images.length);
  const prevStop = stops.filter((s) => s < current).pop() ?? 0;
  const nextStop = stops.find((s) => s > current) ?? current;

  const canPrev = current > 0;
  const canNext = current < maxOffset;

  return (
    <div className="hidden flex-col gap-[clamp(1.25rem,3vw,2rem)] md:flex">
      <div className="grid grid-cols-4 gap-[clamp(0.5rem,1.4vw,1rem)]">
        {images.map((image, i) => {
          const inWindow = i >= current && i < windowEnd;
          return (
            <div key={i} className={inWindow ? "block" : "hidden"} aria-hidden={!inWindow}>
              <GalleryTile
                image={image}
                aspectClass="aspect-[16/10]"
                sizes="(min-width: 1536px) 18vw, (min-width: 1024px) 22vw, 23vw"
                onClick={() => onTileClick(i)}
              />
            </div>
          );
        })}
      </div>

      <GalleryNav
        canPrev={canPrev}
        canNext={canNext}
        onPrev={() => setOffset(prevStop)}
        onNext={() => setOffset(nextStop)}
      />
    </div>
  );
}

export default function GallerySection({
  heading,
  images,
  className = "",
}: GallerySectionProps) {
  const [activeModalIndex, setActiveModalIndex] = useState<number | null>(null);

  useEffect(() => {
    if (activeModalIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveModalIndex(null);
      } else if (e.key === "ArrowLeft") {
        setActiveModalIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : images.length - 1));
      } else if (e.key === "ArrowRight") {
        setActiveModalIndex((prev) => (prev !== null && prev < images.length - 1 ? prev + 1 : 0));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [activeModalIndex, images.length]);

  if (images.length === 0) return null;

  return (
    <>
      <section
        aria-label={heading}
        className={`flex w-full flex-col gap-[clamp(1.25rem,3vw,2.5rem)] px-6 pt-6 lg:px-10 lg:py-12 xl:py-16 2xl:px-40 ${className}`}
      >
        <Typography variant="h2" className="text-center font-lora leading-[1.2] text-[#00191B] sm:text-left">
          {heading}
        </Typography>

        <GalleryGrid images={images} onTileClick={(index) => setActiveModalIndex(index)} />
        <GalleryCarousel images={images} onImageClick={(index) => setActiveModalIndex(index)} />
      </section>

      {/* Lightbox Pop-up Modal */}
      {activeModalIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Enlarged photo view"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 sm:p-6 md:p-10 transition-opacity"
          onClick={() => setActiveModalIndex(null)}
        >
          {/* Close button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setActiveModalIndex(null);
            }}
            className="absolute top-4 right-4 z-50 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/90 hover:text-[#FFD638] transition-colors focus:outline-none"
            aria-label="Close enlarged photo"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Previous photo button */}
          {images.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setActiveModalIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : images.length - 1));
              }}
              className="absolute left-3 sm:left-6 z-50 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/90 hover:text-[#FFD638] transition-colors focus:outline-none"
              aria-label="Previous photo"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {/* Next photo button */}
          {images.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setActiveModalIndex((prev) => (prev !== null && prev < images.length - 1 ? prev + 1 : 0));
              }}
              className="absolute right-3 sm:right-6 z-50 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/90 hover:text-[#FFD638] transition-colors focus:outline-none"
              aria-label="Next photo"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}

          {/* Pop-up Image Container */}
          <div
            className="relative flex flex-col items-center max-w-5xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full h-[65vh] sm:h-[75vh] md:h-[80vh] overflow-hidden rounded-md shadow-2xl">
              <Image
                src={images[activeModalIndex].src}
                alt={images[activeModalIndex].alt}
                fill
                sizes="(min-width: 1280px) 75vw, 95vw"
                className="object-contain"
                priority
              />
            </div>
            {/* Photo counter */}
            <div className="mt-3 text-center text-sm font-figtree font-medium text-white/80">
              {activeModalIndex + 1} of {images.length}
            </div>
          </div>
        </div>
      )}
    </>
  );
}