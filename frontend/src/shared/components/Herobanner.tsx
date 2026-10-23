import type { ReactNode } from "react";
import { getImageProps } from "next/image";
import Typography from "@/lib/Typography";
import { cn } from "@/lib/utils";

export interface HeroBannerProps {
  heading: ReactNode;
  description: ReactNode;
  image: string;
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
      className={cn(
        "relative grid w-full aspect-[780/400] sm:aspect-[1920/490] sm:min-h-[15rem] md:min-h-[19rem] lg:min-h-0",
        className,
      )}
    >
      <picture className="absolute inset-0 block overflow-hidden">
        <source media={DESKTOP_MEDIA} srcSet={desktopSrcSet} />
        <source srcSet={mobileSrcSet} />
        <img
          {...fallbackImgProps}
          className="block h-full w-full object-cover object-center"
        />
      </picture>

      <div
        className={cn(
          "relative col-start-1 row-start-1 self-center py-6 sm:py-8 lg:py-10",
          FLUID_PADDING_X,
        )}
      >
      
        <div className="w-full max-w-[85%] sm:max-w-[70%] md:w-fit md:min-w-[24rem] md:max-w-full lg:min-w-[28rem] xl:min-w-[32rem]">
          <Typography
            variant="h4"
            className="whitespace-nowrap font-lora font-normal tracking-[0.03em] text-white md:hidden"
          >
            {heading}
          </Typography>
          <Typography
            variant="h1"
            className="hidden whitespace-nowrap font-lora font-normal tracking-[0.03em] text-white md:block"
          >
            {heading}
          </Typography>

          <Typography
            variant="body-sm"
            className={cn(
              "font-figtree font-light text-white/90 md:w-0 md:min-w-full",
              FLUID_GAP_Y,
            )}
          >
            {description}
          </Typography>
        </div>
      </div>
    </section>
  );
}