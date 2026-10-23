import Image from "next/image";
import Typography from "@/lib/Typography";
import { cn } from "@/lib/utils";

interface InitiativeBannerProps {
  title: string;
  description: string;
  image: string;
  mobileImage: string;
  imageAlt: string;
  contentClassName?: string;
  titleClassName?: string;
}

const FLUID_PADDING_X = "px-[clamp(1rem,9.3vw_-_1.2rem,10rem)]";
const FLUID_GAP_Y = "mt-[clamp(0.25rem,0.4vw_+_0.1rem,0.5rem)]";

export default function InitiativeBanner({
  title,
  description,
  image,
  mobileImage,
  imageAlt,
  contentClassName = "max-w-[85%] sm:max-w-[55%] lg:max-w-[48%]",
  titleClassName = "text-[22px] sm:text-[35px] md:text-[40px] lg:text-[46px]",
}: InitiativeBannerProps) {
  return (
    <section className="relative w-full overflow-hidden leading-[0]">
      <div className="relative aspect-[402/212] min-h-[200px] w-full sm:min-h-0 sm:aspect-[1920/500]">
        <Image
          src={mobileImage}
          alt={imageAlt}
          fill
          priority
          sizes="(max-width: 639px) 100vw, 1px"
          className="block object-cover object-center sm:hidden"
        />
        <Image
          src={image}
          alt={imageAlt}
          fill
          priority
          sizes="(min-width: 640px) 100vw, 1px"
          className="hidden object-cover object-center sm:block"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-black/35 sm:bg-black/25"
        />
      </div>

      <div
        className={cn(
          "absolute inset-0 flex items-center leading-normal",
          FLUID_PADDING_X,
        )}
      >
        <div className={contentClassName}>
          <Typography
            variant="h1"
            className={cn(
              "font-lora font-normal tracking-[0.03em] text-white",
              titleClassName,
            )}
          >
            {title}
          </Typography>
          <Typography
            variant="body-sm"
            className={cn(
              "font-figtree font-light text-[12px] text-white/90 sm:text-[13px] md:text-[14px]",
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
