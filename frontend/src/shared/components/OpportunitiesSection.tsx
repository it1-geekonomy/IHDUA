import Image from "next/image";
import Typography from "@/lib/Typography";

export interface OpportunitiesButton {
  label: string;
  href?: string;
  external?: boolean;
}

export interface OpportunitiesSectionProps {
  heading: string;
  descriptions: string[]; // each string renders as its own paragraph
  image: string;
  imageAlt?: string;
  button?: OpportunitiesButton; // optional: omit and no button renders
}

const ArrowUpRight = () => (
  <svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4"
  >
    <path d="M7 17 17 7M8 7h9v9" />
  </svg>
);

const OpportunitiesSection = ({
  heading,
  descriptions,
  image,
  imageAlt = "",
  button,
}: OpportunitiesSectionProps) => {
  return (
    <section className="w-full bg-white">
      <div className="w-full px-6 pt-6 lg:px-10 lg:pt-8 xl:pt-14 2xl:px-40">
        {/* Below lg: heading, image, text stacked.
            lg: heading spans full width, then text left and image right.
            xl and up: heading above the text, image on the right spanning both rows. */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_40%] lg:gap-x-8 lg:gap-y-5 xl:grid-cols-[minmax(0,1fr)_32%] xl:gap-x-12 2xl:grid-cols-[minmax(0,1fr)_28%]">
          {/* Heading: full width below xl (including lg).
              Yellow line is hidden below 640px. */}
          <div className="flex w-full justify-center lg:col-span-2 lg:col-start-1 lg:row-start-1 lg:justify-start xl:col-span-1 xl:self-end">
            <div className="w-full border-l-0 border-[#FFD638] pl-0 sm:w-auto sm:border-l-4 sm:pl-4 lg:w-full xl:w-auto">
              <Typography
                variant="h3"
                className="w-full font-lora text-center font-normal text-[#00191B] lg:text-left"
              >
                {heading}
              </Typography>
            </div>
          </div>

          {/* Image: never cropped.
              Below lg: centered and smaller.
              lg: right of the text.
              xl and up: slightly larger column, centered vertically in its cell. */}
          <div className="flex w-full items-center justify-center lg:col-start-2 lg:row-start-2 lg:justify-end lg:self-stretch xl:row-span-2 xl:row-start-1 xl:justify-end xl:self-center">
            <Image
              src={image}
              alt={imageAlt}
              width={0}
              height={0}
              sizes="(min-width: 1536px) 28vw, (min-width: 1280px) 32vw, (min-width: 1024px) 40vw, (min-width: 768px) 50vw, (min-width: 640px) 60vw, 55vw"
              className="block h-auto w-[55%] sm:w-3/5 md:w-1/2 lg:w-full"
            />
          </div>

          {/* Description + optional button */}
          <div className="flex w-full flex-col gap-4 lg:col-start-1 lg:row-start-2 lg:self-start">
            <div className="flex w-full flex-col gap-3 lg:gap-4">
              {descriptions.map((para, index) => (
                <Typography
                  key={index}
                  variant="body-lg"
                  className="w-full font-figtree font-light text-[#5F6C6D]"
                >
                  {para}
                </Typography>
              ))}
            </div>

            {button?.label && (
              <a
                href={button.href ?? "#"}
                target={button.external ? "_blank" : undefined}
                rel={button.external ? "noopener noreferrer" : undefined}
                className="inline-flex w-fit items-center gap-1.5 self-center bg-[#FFD638] px-3 py-1.5 text-[#000000] transition-[filter] duration-200 hover:brightness-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:gap-2 sm:px-4 sm:py-2 lg:self-start lg:px-5 lg:py-2.5"
              >
                <Typography
                  variant="body-sm"
                  className="m-0 font-figtree font-normal text-[#000000]"
                >
                  {button.label}
                </Typography>
                <ArrowUpRight />
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default OpportunitiesSection;