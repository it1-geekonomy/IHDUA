import Image from "next/image";
import Typography from "@/lib/Typography";

export interface WomenOpportunitiesImage {
  src: string;
  alt: string;
}

export interface WomenOpportunitiesProps {
  heading: string;
  topDescription: string; // shown above the images
  images: WomenOpportunitiesImage[]; // 2 images, side by side
  bottomDescription: string; // shown below the images
}

const WomenOpportunities = ({
  heading,
  topDescription,
  images,
  bottomDescription,
}: WomenOpportunitiesProps) => {
  return (
    <section className="w-full bg-white">
      <div className="w-full px-6 pt-6 lg:px-10 lg:pt-8 xl:pt-14 2xl:px-40">
        {/* Below 640px: tighter gap between the description, images and bottom text */}
        <div className="flex w-full flex-col gap-3 sm:gap-6 lg:gap-8">
          {/* Heading + top description */}
          <div className="flex w-full flex-col gap-2 sm:gap-3 lg:gap-4">
            <Typography
              variant="h4"
              className="w-full font-lora font-normal text-[#00191B]"
            >
              {heading}
            </Typography>
            <Typography
              variant="body-lg"
              className="w-full font-figtree font-normal text-[#5F6C6D]"
            >
              {topDescription}
            </Typography>
          </div>

          {/* Two images side by side on every screen, never cropped */}
          <div className="grid w-full grid-cols-2 items-start gap-2 sm:gap-4 lg:gap-6">
            {images.map((image, index) => (
              <div key={`${image.src}-${index}`} className="w-full">
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={0}
                  height={0}
                  sizes="(min-width: 1536px) 40vw, 50vw"
                  className="block h-auto w-full"
                />
              </div>
            ))}
          </div>

          {/* Bottom description */}
          <Typography
            variant="body-lg"
            className="w-full font-figtree font-normal text-[#5F6C6D]"
          >
            {bottomDescription}
          </Typography>
        </div>
      </div>
    </section>
  );
};

export default WomenOpportunities;