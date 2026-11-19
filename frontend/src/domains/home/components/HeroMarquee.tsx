"use client";

import Image from "next/image";
import {
  DURATION_A,
  DURATION_B,
  FADE_MASK,
  MARQUEE_CSS,
  MIN_PILLS_PER_HALF,
  PILL_ASPECT,
} from "@/domains/home/constants/heroConstants";

function MarqueeColumn({
  images,
  reverse = false,
  duration,
  offset = 0,
  /** First visible column carries the LCP image. */
  isLcpColumn = false,
}: {
  images: string[];
  reverse?: boolean;
  duration: number;
  offset?: number;
  isLcpColumn?: boolean;
}) {
  if (images.length === 0) return null;

  const times = Math.max(1, Math.ceil(MIN_PILLS_PER_HALF / images.length));
  const half = Array.from({ length: times }, () => images).flat();
  const loop = [...half, ...half];

  return (
    <div className="relative h-full min-w-0 flex-1 overflow-hidden">
      <ul
        className={`flex animate-[hero-marquee-up_1s_linear_infinite] flex-col will-change-transform group-hover:[animation-play-state:paused] group-focus-within:[animation-play-state:paused] motion-reduce:animate-none ${
          reverse ? "[animation-direction:reverse]" : ""
        }`}
        style={{
          animationDuration: `${duration}s`,
          animationDelay: `-${duration * offset}s`,
        }}
      >
        {loop.map((src, i) => {
          // One LCP candidate: first pill in the left column.
          const isLcp = isLcpColumn && i === 0;
          return (
            <li key={i} aria-hidden={i >= images.length} className="pb-3 sm:pb-4">
              <div
                className={`relative w-full overflow-hidden rounded-full bg-[#EDE9DC] ${PILL_ASPECT}`}
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  // Banners are already webp on R2 — skip /_next/image cold CPU on the droplet.
                  unoptimized={isLcp}
                  priority={isLcp}
                  fetchPriority={isLcp ? "high" : "auto"}
                  loading={isLcp ? "eager" : "lazy"}
                  quality={isLcp ? 60 : 55}
                  sizes="(max-width: 767px) 42vw, (max-width: 1023px) 16vw, 14vw"
                  className="object-cover"
                />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function HeroMarquee({ imagesA, imagesB }: { imagesA: string[]; imagesB: string[] }) {
  return (
    <>
      <style>{MARQUEE_CSS}</style>
      <div
        className="group mx-auto flex h-[22rem] w-full max-w-[16rem] gap-3 sm:h-[32rem] sm:max-w-sm sm:gap-4 md:mx-0 md:h-[clamp(26rem,calc(100svh_-_8rem),40rem)] md:w-[clamp(14rem,32vw,20rem)] md:max-w-none md:justify-self-end lg:h-[clamp(30rem,calc(100svh_-_8rem),48rem)] lg:w-[clamp(22rem,27vw,32rem)]"
        style={{ maskImage: FADE_MASK, WebkitMaskImage: FADE_MASK }}
      >
        <MarqueeColumn images={imagesA} duration={DURATION_A} offset={0} isLcpColumn />
        <MarqueeColumn images={imagesB} reverse duration={DURATION_B} offset={0.35} />
      </div>
    </>
  );
}
