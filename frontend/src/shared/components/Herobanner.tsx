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
  /** Optional CTAs under the description (e.g. Donate / Explore on /donate). */
  actions?: ReactNode;
}

const FLUID_PADDING_X = "px-[clamp(1rem,9.3vw_-_1.2rem,10rem)]";
const FLUID_GAP_Y = "mt-[clamp(0.25rem,0.4vw_+_0.1rem,0.5rem)]";
// md = 768px. Mobile image below md, desktop image from md (md, lg, xl, 2xl...) up.
const DESKTOP_MEDIA = "(min-width: 768px)";
const MOBILE_MEDIA = "(max-width: 767px)";

export default function HeroBanner({
  heading,
  description,
  image,
  imageMobile,
  imageAlt = "",
  className,
  actions,
}: HeroBannerProps) {
  const shared = { alt: imageAlt, sizes: "100vw", priority: true } as const;

  // REAL file sizes: desktop 2302x766, mobile 402x212.
  // These only reserve space before load; the final height comes from the image itself.
  const {
    props: { srcSet: desktopSrcSet },
  } = getImageProps({ ...shared, src: image, width: 2302, height: 766 });

  const {
    props: { srcSet: mobileSrcSet, ...fallbackImgProps },
  } = getImageProps({ ...shared, src: imageMobile, width: 402, height: 212 });

  return (
    <section
      className={cn(
        // No aspect-ratio here: the image itself sets the height, so it can never be
        // cropped or leave bands, whatever the real file ratio is.
        "relative grid w-full bg-[#9739A8]",
        className,
      )}
    >
      <picture className="col-start-1 row-start-1 block w-full">
        <source
          media={DESKTOP_MEDIA}
          srcSet={desktopSrcSet}
          sizes="100vw"
          width={2302}
          height={766}
        />
        <source
          media={MOBILE_MEDIA}
          srcSet={mobileSrcSet}
          sizes="100vw"
          width={402}
          height={212}
        />
        <img
          {...fallbackImgProps}
          className="block h-auto w-full object-contain"
        />
      </picture>

      <div
        className={cn(
          "relative col-start-1 row-start-1 self-center py-6 sm:py-8 lg:py-10",
          FLUID_PADDING_X,
        )}
      >
        <div className="w-full max-w-[95%] sm:max-w-[85%] md:w-fit md:min-w-[24rem] md:max-w-full lg:min-w-[28rem] xl:min-w-[32rem]">
          <Typography
            variant="h4"
            className="font-lora font-normal tracking-[0.03em] text-white md:hidden leading-tight"
          >
            {heading}
          </Typography>
          <Typography
            variant="h1"
            className="hidden font-lora font-normal tracking-[0.03em] text-white md:block leading-tight"
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

          {actions ? (
            <div className={cn("flex flex-wrap items-center gap-3", FLUID_GAP_Y)}>
              {actions}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}