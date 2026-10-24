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
  const gridRef = useRef<HTMLDivElement>(null);
  const [columns, setColumns] = useState(1);
  const [offset, setOffset] = useState(0);
  const isEmpty = images.length === 0;

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const update = () =>
      setColumns(getComputedStyle(grid).gridTemplateColumns.split(" ").length);

    update();
    const observer = new ResizeObserver(update);
    observer.observe(grid);
    return () => observer.disconnect();
  }, [isEmpty]);

  if (isEmpty) return null;

  const maxOffset = Math.max(0, images.length - columns);
  const current = Math.min(offset, maxOffset);
  const visible = images.slice(current, current + columns);

  return (
    <section
      aria-label={heading}
      className={`flex w-full flex-col gap-5 px-6 pt-6 lg:gap-8 lg:px-10 lg:pt-12 2xl:px-40 ${className}`}
    >
      <Typography variant="h4" as="h2" className="text-center font-lora leading-tight font-normal text-[#00191B] sm:text-left">
        {heading}
      </Typography>

      <div
        ref={gridRef}
        className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4"
      >
        {visible.map((image, i) => (
          <GalleryTile
            key={current + i}
            image={image}
            aspectClass="aspect-video"
            sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 100vw"
          />
        ))}
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