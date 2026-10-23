import type { ReactNode } from "react";
import { getImageProps } from "next/image";
import Typography from "@/lib/Typography";
import { cn } from "@/lib/utils";

export interface HeroBannerProps {
  heading: ReactNode;
  description: ReactNode;
  /** Desktop image, shown from 640px up */
  image: string;
  /** Mobile image, shown below 640px */
  imageMobile: string;
  imageAlt?: string;
  className?: string;
}

const FLUID_PADDING_X = "px-[clamp(1rem,9.3vw_-_1.2rem,10rem)]";
const FLUID_GAP_Y = "mt-[clamp(0.25rem,0.4vw_+_0.1rem,0.5rem)]";
const DESKTOP_MEDIA = "(min-width: 640px)";

export default function HeroBanner({
  heading,
  description,
  image,
  imageMobile,
  imageAlt = "",
  className,
}: HeroBannerProps) {
  const shared = { alt: imageAlt, sizes: "100vw", priority: true } as const;

  const {
    props: { srcSet: desktopSrcSet },
  } = getImageProps({ ...shared, src: image, width: 1920, height: 490 });

  const {
    props: { srcSet: mobileSrcSet, ...fallbackImgProps },
  } = getImageProps({ ...shared, src: imageMobile, width: 780, height: 400 });

  return (
    <section
      className={cn("relative w-full overflow-hidden leading-[0]", className)}
    >
      {/* Art-directed image: only the matching source is downloaded */}
      <picture>
        <source media={DESKTOP_MEDIA} srcSet={desktopSrcSet} />
        <source srcSet={mobileSrcSet} />
        <img {...fallbackImgProps} className="block h-auto w-full" />
      </picture>

      {/* Readability overlay */}
      {/* <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.55)_0%,rgba(0,0,0,0.25)_50%,rgba(0,0,0,0)_100%)]"
      /> */}

      {/* Text: vertically centered, left aligned */}
      <div
        className={cn(
          "absolute inset-0 flex items-center leading-normal",
          FLUID_PADDING_X,
        )}
      >
        <div className="max-w-[60%] sm:max-w-[50%] lg:max-w-[45%]">
          <Typography
            variant="h1"
            className="font-lora font-normal tracking-[0.03em] text-white"
          >
            {heading}
          </Typography>
          <Typography
            variant="body-sm"
            className={cn("font-figtree font-light text-white/90", FLUID_GAP_Y)}
          >
            {description}
          </Typography>
        </div>
      </div>
    </section>
  );
}