"use client";

import { useState } from "react";
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

function GalleryGrid({ images }: { images: GalleryImage[] }) {
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
  if (images.length === 0) return null;

  return (
    <section
      aria-label={heading}
      className={`flex w-full flex-col gap-[clamp(1.25rem,3vw,2.5rem)] px-6 pt-6 lg:px-10 lg:py-12 xl:py-16 2xl:px-40 ${className}`}
    >
      <Typography variant="h2" className="text-center font-lora leading-[1.2] text-[#00191B] sm:text-left">
        {heading}
      </Typography>

      <GalleryGrid images={images} />
      <GalleryCarousel images={images} />
    </section>
  );
}