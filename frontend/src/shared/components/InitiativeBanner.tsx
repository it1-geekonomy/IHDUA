import Image, { getImageProps } from "next/image";
import Typography from "@/lib/Typography";

interface InitiativeBannerProps {
  title: string;
  description: string;
  image: string;
  mobileImage: string;
  imageAlt: string;
  contentClassName?: string;
}

export default function InitiativeBanner({
  title,
  description,
  image,
  mobileImage,
  imageAlt,
  contentClassName = "max-w-[85%] sm:max-w-[55%] lg:max-w-[50%]",
}: InitiativeBannerProps) {
  const { props: mobileImageProps } = getImageProps({
    src: mobileImage,
    alt: imageAlt,
    width: 402,
    height: 212,
    sizes: "100vw",
  });

  return (
    <section className="relative w-full overflow-hidden leading-[0]">
      <div className="relative aspect-[402/212] min-h-50 w-full sm:min-h-0 sm:aspect-[1920/500]">
        <picture className="absolute inset-0 block">
          <source
            media="(max-width: 39.999rem)"
            srcSet={mobileImageProps.srcSet}
            sizes={mobileImageProps.sizes}
          />
          <Image
            src={image}
            alt={imageAlt}
            fill
            sizes="100vw"
            loading="eager"
            fetchPriority="high"
            className="object-cover object-center"
          />
        </picture>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-black/35 sm:bg-black/25"
        />
      </div>

      <div
        className="absolute inset-0 flex items-center leading-normal px-4 sm:px-10 lg:px-20 2xl:px-40"
      >
        <div className={contentClassName}>
          <Typography
            variant="h1"
            className="font-lora font-normal tracking-[0.03em] text-white"
          >
            {title}
          </Typography>
          <Typography
            variant="body-sm"
            className="mt-1 font-figtree font-light text-white/90 sm:mt-2"
          >
            {description}
          </Typography>
        </div>
      </div>
    </section>
  );
}
