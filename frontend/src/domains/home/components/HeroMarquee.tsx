"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  DURATION_A,
  DURATION_B,
  FADE_MASK,
  HERO_PILL_SIZES,
  MARQUEE_CSS,
  MIN_PILLS_PER_HALF,
  PILL_ASPECT,
} from "@/domains/home/constants/heroConstants";

function MarqueeColumn({
  images,
  reverse = false,
  duration,
  offset = 0,
  animate,
  /** Skip decoding the LCP src in the list until animation — server LCP owns it. */
  skipSrcUntilAnimate,
}: {
  images: string[];
  reverse?: boolean;
  duration: number;
  offset?: number;
  animate: boolean;
  skipSrcUntilAnimate?: string | null;
}) {
  if (images.length === 0) return null;

  const times = Math.max(1, Math.ceil(MIN_PILLS_PER_HALF / images.length));
  const half = Array.from({ length: times }, () => images).flat();
  const loop = [...half, ...half];

  return (
    <div className="relative h-full min-w-0 flex-1 overflow-hidden">
      <ul
        className={`flex flex-col will-change-transform group-hover:[animation-play-state:paused] group-focus-within:[animation-play-state:paused] motion-reduce:animate-none ${
          animate
            ? "animate-[hero-marquee-up_1s_linear_infinite]"
            : "[transform:translate3d(0,0,0)]"
        } ${reverse && animate ? "[animation-direction:reverse]" : ""}`}
        style={
          animate
            ? {
                animationDuration: `${duration}s`,
                animationDelay: `-${duration * offset}s`,
              }
            : undefined
        }
      >
        {loop.map((src, i) => {
          const isLcpDuplicate =
            Boolean(skipSrcUntilAnimate) &&
            src === skipSrcUntilAnimate &&
            i === 0;
          // Until the marquee runs, hide the duplicate under the server LCP layer.
          const hideUnderLcp = isLcpDuplicate && !animate;

          return (
            <li
              key={i}
              aria-hidden={i >= images.length}
              className="pb-3 sm:pb-4"
            >
              <div
                className={`relative w-full overflow-hidden rounded-full bg-[#EDE9DC] ${PILL_ASPECT}`}
              >
                {hideUnderLcp ? (
                  <div className="absolute inset-0" aria-hidden />
                ) : (
                  <Image
                    src={src}
                    alt=""
                    fill
                    loading="lazy"
                    decoding="async"
                    quality={50}
                    sizes={HERO_PILL_SIZES}
                    className="object-cover"
                  />
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function HeroMarquee({
  imagesA,
  imagesB,
  lcpSrc = null,
}: {
  imagesA: string[];
  imagesB: string[];
  /** Server-rendered LCP URL — marquee must not steal priority from it. */
  lcpSrc?: string | null;
}) {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    // Hold still past Slow-4G LCP window, then scroll. Also drop the LCP overlay.
    const start = window.setTimeout(() => {
      setAnimate(true);
      const overlay = document.getElementById("hero-lcp-overlay");
      if (overlay) {
        overlay.style.opacity = "0";
        window.setTimeout(() => overlay.remove(), 200);
      }
    }, 2800);
    return () => window.clearTimeout(start);
  }, []);

  return (
    <>
      <style>{MARQUEE_CSS}</style>
      <div
        className="group flex h-full w-full gap-3 sm:gap-4"
        style={{ maskImage: FADE_MASK, WebkitMaskImage: FADE_MASK }}
      >
        <MarqueeColumn
          images={imagesA}
          duration={DURATION_A}
          offset={0}
          animate={animate}
          skipSrcUntilAnimate={lcpSrc}
        />
        <MarqueeColumn
          images={imagesB}
          reverse
          duration={DURATION_B}
          offset={0.35}
          animate={animate}
        />
      </div>
    </>
  );
}
