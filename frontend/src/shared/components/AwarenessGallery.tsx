import Image from "next/image";
import Typography from "@/lib/Typography";

export interface AwarenessImage {
  src: string;
  alt: string;
}

export interface AwarenessGalleryProps {
  heading: string;
  descriptions: string[]; // each string renders as its own paragraph
  images: AwarenessImage[]; // 4 images, shown as a 2x2 grid
}

const AwarenessGallery = ({
  heading,
  descriptions,
  images,
}: AwarenessGalleryProps) => {
  return (
    <section className="w-full">
      <div className="w-full px-6 pt-6 lg:px-10 lg:pt-8 xl:pt-16 2xl:px-40">
        <div className="flex w-full flex-col gap-6 lg:gap-8">
          {/* Heading + description */}
          <div className="flex w-full flex-col gap-3 lg:gap-4">
            <Typography
              variant="h4"
              className="w-full text-center font-lora font-medium text-[#00191B] sm:text-left"
            >
              {heading}
            </Typography>

            <div className="flex w-full flex-col gap-3 lg:gap-4">
              {descriptions.map((para, index) => (
                <Typography
                  key={index}
                  variant="body-lg"
                  className="w-full font-figtree font-normal text-[#5F6C6D]"
                >
                  {para}
                </Typography>
              ))}
            </div>
          </div>

          {/* 2x2 image grid on every screen size */}
          <div className="grid w-full grid-cols-2 gap-2 sm:gap-4 lg:gap-6">
            {images.map((image, index) => (
              <div
                key={`${image.src}-${index}`}
                className="relative aspect-[3/2] w-full overflow-hidden"
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(min-width: 1536px) 40vw, 50vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AwarenessGallery;