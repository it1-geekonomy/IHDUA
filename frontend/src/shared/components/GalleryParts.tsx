"use client";
import { useRef, useState, useSyncExternalStore } from "react";
import type { CSSProperties, PointerEvent as ReactPointerEvent } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";
import {DRAG_THRESHOLD_RATIO,EDGE_RESISTANCE,NAV_BUTTON_CLASS,SLIDE_WIDTH,TWO_COLUMN_QUERY,
} from "@/shared/constants/gallery";

export interface GalleryImage {
  src: string;
  alt: string;
}

function useSlidesPerView(): 1 | 2 {
  return useSyncExternalStore<1 | 2>(
    (onChange) => {
      const mql = window.matchMedia(TWO_COLUMN_QUERY);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    () => (window.matchMedia(TWO_COLUMN_QUERY).matches ? 2 : 1),
    () => 1,
  );
}

interface GalleryNavProps {
  onPrev: () => void;
  onNext: () => void;
  canPrev: boolean;
  canNext: boolean;
}

export function GalleryNav({ onPrev, onNext, canPrev, canNext }: GalleryNavProps) {
  return (
    <div className="flex items-center justify-center gap-3">
      <button
        type="button"
        onClick={onPrev}
        disabled={!canPrev}
        aria-label="Previous image"
        className={NAV_BUTTON_CLASS}
      >
        <ArrowLeft className="h-4 w-4" strokeWidth={2.2} aria-hidden="true" />
      </button>
      <button
        type="button"
        onClick={onNext}
        disabled={!canNext}
        aria-label="Next image"
        className={NAV_BUTTON_CLASS}
      >
        <ArrowRight className="h-4 w-4" strokeWidth={2.2} aria-hidden="true" />
      </button>
    </div>
  );
}

interface GalleryTileProps {
  image: GalleryImage;
  sizes: string;
  aspectClass: string;
}

export function GalleryTile({ image, sizes, aspectClass }: GalleryTileProps) {
  return (
    <div className={`group relative w-full overflow-hidden cursor-pointer rounded-[2px] ${aspectClass}`}>
      <Image
        src={image.src}
        alt={image.alt}
        fill
        sizes={sizes}
        draggable={false}
        className="select-none object-cover object-center transition-transform duration-500 ease-out group-hover:scale-110 will-change-transform"
      />
    </div>
  );
}

const stepTransform = (dragX: number) =>
  `translate3d(calc(var(--index) * (100% + var(--gap)) / var(--per-view) * -1 + ${dragX}px), 0, 0)`;

export function GalleryCarousel({ images }: { images: GalleryImage[] }) {
  const perView = useSlidesPerView();

  const [index, setIndex] = useState(0);
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const viewportRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef(0);

  const lastIndex = Math.max(images.length - perView, 0);
  const current = Math.min(index, lastIndex);

  const canPrev = current > 0;
  const canNext = current < lastIndex;

  const goPrev = () => canPrev && setIndex(current - 1);
  const goNext = () => canNext && setIndex(current + 1);

  const handlePointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    startXRef.current = e.clientX;
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;

    let delta = e.clientX - startXRef.current;
    const pullingPastStart = current === 0 && delta > 0;
    const pullingPastEnd = current === lastIndex && delta < 0;
    if (pullingPastStart || pullingPastEnd) delta *= EDGE_RESISTANCE;

    setDragX(delta);
  };

  const endDrag = () => {
    if (!isDragging) return;

    const slideWidth = (viewportRef.current?.offsetWidth ?? 0) / perView;
    const threshold = slideWidth * DRAG_THRESHOLD_RATIO;

    if (dragX < -threshold) goNext();
    else if (dragX > threshold) goPrev();

    setDragX(0);
    setIsDragging(false);
  };

  const trackStyle = {
    "--index": current,
    transform: stepTransform(dragX),
  } as CSSProperties;

  return (
    <div className="flex flex-col gap-[clamp(1.25rem,3vw,2rem)] md:hidden">
      <div
        ref={viewportRef}
        role="region"
        aria-roledescription="carousel"
        aria-label="Gallery images"
        className={`mx-auto w-[clamp(16rem,80vw,22rem)] max-w-full touch-pan-y select-none overflow-hidden sm:w-full ${
          isDragging ? "cursor-grabbing" : "cursor-grab"
        }`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        <div
          className={`flex gap-[var(--gap)] [--gap:clamp(0.5rem,1.4vw,1rem)] [--per-view:1] sm:[--per-view:2] ${
            isDragging
              ? ""
              : "transition-transform duration-300 ease-out motion-reduce:transition-none"
          }`}
          style={trackStyle}
        >
          {images.map((image, i) => (
            <div
              key={i}
              className="shrink-0"
              style={{ width: SLIDE_WIDTH }}
              aria-hidden={i < current || i >= current + perView}
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${images.length}`}
            >
              <GalleryTile
                image={image}
                aspectClass="aspect-[4/3]"
                sizes="(min-width: 640px) 50vw, 100vw"
              />
            </div>
          ))}
        </div>
      </div>
      <GalleryNav
        canPrev={canPrev}
        canNext={canNext}
        onPrev={goPrev}
        onNext={goNext}
      />
    </div>
  );
}