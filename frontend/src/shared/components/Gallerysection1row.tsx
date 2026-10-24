"use client";

import { useEffect, useRef, useState } from "react";
import Typography from "@/lib/Typography";
import { GalleryNav, GalleryTile } from "@/shared/components/GalleryParts";
import type { GalleryImage } from "@/shared/components/GalleryParts";

export interface GallerySectionProps {
  heading: string;
  images: GalleryImage[];
  className?: string;
}

export default function GallerySection1Row({
  heading,
  images,
  className = "",
}: GallerySectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  
  const [columns, setColumns] = useState(1);
  const [offset, setOffset] = useState(0);
  const [slideDistance, setSlideDistance] = useState(0);
  
  const touchStartRef = useRef<number | null>(null);
  const isEmpty = images.length === 0;

  // Measure container and item widths to handle smooth sliding & responsive columns
  useEffect(() => {
    const container = containerRef.current;
    const track = trackRef.current;
    if (!container || !track) return;

    const updateDimensions = () => {
      const containerWidth = container.offsetWidth;
      let cols = 1;
      if (containerWidth >= 1024) cols = 4;
      else if (containerWidth >= 640) cols = 2;
      
      setColumns(cols);

      const firstChild = track.firstElementChild as HTMLElement;
      if (firstChild) {
        const style = window.getComputedStyle(track);
        const gap = parseFloat(style.gap || style.columnGap || "0");
        setSlideDistance(firstChild.offsetWidth + gap);
      }
    };

    updateDimensions();
    const observer = new ResizeObserver(updateDimensions);
    observer.observe(container);
    return () => observer.disconnect();
  }, [isEmpty]);

  if (isEmpty) return null;

  const maxOffset = Math.max(0, images.length - columns);
  const current = Math.min(offset, maxOffset);

  // Touch handlers for mobile swipe (only active below 'sm' screen / < 640px)
  const handleTouchStart = (e: React.TouchEvent) => {
    if (window.innerWidth >= 640) return;
    touchStartRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (window.innerWidth >= 640 || touchStartRef.current === null) return;
    
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStartRef.current - touchEnd;
    const threshold = 40; // minimum swipe distance in pixels

    if (diff > threshold) {
      // Swiped left -> Next
      setOffset((prev) => Math.min(maxOffset, prev + 1));
    } else if (diff < -threshold) {
      // Swiped right -> Prev
      setOffset((prev) => Math.max(0, prev - 1));
    }

    touchStartRef.current = null;
  };

  return (
    <section
      aria-label={heading}
      className={`flex w-full flex-col gap-5 px-6 pt-6 lg:gap-8 lg:px-10 lg:pt-12 2xl:px-40 ${className}`}
    >
      <Typography variant="h3" as="h2" className="text-center font-lora leading-tight font-normal text-[#00191B] sm:text-left">
        {heading}
      </Typography>

      {/* Viewport container with overflow hidden and touch event listeners */}
      <div
        ref={containerRef}
        className="w-full overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div
          ref={trackRef}
          className="flex gap-2 sm:gap-4 transition-transform duration-300 ease-in-out"
          style={{
            transform: `translateX(-${current * slideDistance}px)`,
          }}
        >
          {images.map((image, i) => (
            <div
              key={i}
              className="w-full sm:w-[calc(50%-0.25rem)] lg:w-[calc(25%-0.75rem)] flex-shrink-0"
            >
              <GalleryTile
                image={image}
                aspectClass="aspect-video"
                sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 100vw"
              />
            </div>
          ))}
        </div>
      </div>

      <GalleryNav
        canPrev={current > 0}
        canNext={current < maxOffset}
        onPrev={() => setOffset(Math.max(0, current - 1))}
        onNext={() => setOffset(Math.min(maxOffset, current + 1))}
      />
    </section>
  );
}