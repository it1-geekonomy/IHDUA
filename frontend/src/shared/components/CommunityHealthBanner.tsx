import type { CSSProperties } from "react";
import Image from "next/image";
import Typography from "@/lib/Typography";

export interface HealthIconItem {
  icon: string;
  iconBg: string;
  title: string;
}

export interface CommunityHealthBannerProps {
  heading: string;
  items: HealthIconItem[];
  mainImage: string; // right side image
  mainImageAlt?: string;
}

const KANNADA_RANGE = /[\u0C80-\u0CFF]/;

// The heading is rendered as ONE text string (not split into per-line pieces),
// so an in-page translator sees the whole sentence ("Skills & Employment")
// and translates "&" as "ಮತ್ತು". Line breaks are done with CSS instead.
// If the heading already arrives in Kannada with a "&", swap it for "ಮತ್ತು".
const normalizeHeading = (heading: string): string => {
  const text = heading.trim().replace(/\s+/g, " ");
  return KANNADA_RANGE.test(text)
    ? text.replace(/\s*(?:&amp;|&)\s*/g, " ಮತ್ತು ")
    : text;
};

const CommunityHealthBanner = ({
  heading,
  items,
  mainImage,
  mainImageAlt = "",
}: CommunityHealthBannerProps) => {
  const headingText = normalizeHeading(heading);

  return (
    <section className="w-full">
      <div className="w-full px-6 pt-6 pb-6 lg:px-10 lg:pt-8 lg:pb-8 xl:pt-16 xl:pb-16 2xl:px-40">
        <div className="relative flex w-full flex-col overflow-hidden bg-[#FEF7EF] sm:flex-row sm:items-stretch">
          {/* Decorative circular gradient: left, cropped by the top edge,
              small enough to stay clear of the bottom (Figma: #FFFFFF 0% -> #FFE7B3)
              640px and up only */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-14 hidden sm:block left-[10%] h-28 w-28 rounded-full opacity-60 bg-[linear-gradient(180deg,#FFFFFF_0%,#FFE7B3_100%)] md:-top-16 md:h-32 md:w-32 lg:-top-[4.5rem] lg:h-36 lg:w-36 xl:-top-20 xl:h-40 xl:w-40"
          />

          {/* Below 640px: one circle, cropped by the top-right corner */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full opacity-60 bg-[linear-gradient(180deg,#FFFFFF_0%,#FFE7B3_100%)] sm:hidden"
          />

          {/* Heading + stats */}
          <div className="relative z-10 flex w-full flex-col items-start gap-8 px-1 pt-10 pb-8 sm:min-w-0 sm:flex-1 sm:flex-row sm:items-center sm:gap-3 sm:px-4 sm:py-4 md:gap-4 md:px-6 lg:gap-6 lg:px-10 lg:py-3 xl:gap-10 xl:px-12 xl:py-4 2xl:px-16">
            {/* Gradient heading:
                below 640px -> full width, centered, wraps onto as many lines as needed
                640px and up -> width-capped and balanced, so it normally breaks into
                2 lines; longer text wraps further instead of being hidden */}
            <Typography
              variant="h4"
              className="w-full break-words bg-gradient-to-r from-[#9739A8] to-[#E6AC20] bg-clip-text text-center font-figtree font-medium leading-snug text-transparent text-balance sm:w-fit sm:max-w-[15rem] sm:text-left md:max-w-[17rem] xl:max-w-[20rem]"
            >
              {headingText}
            </Typography>

            {/* Stats: one grid row, so every stat starts on the same line.
                From 640px up each column is at least as wide as its longest
                word, so a title wraps to the next line but never spills over a
                divider or a neighbouring stat. Below 640px the three columns
                always share the width equally and a very long word may break
                inside itself, so nothing is ever pushed off-screen. */}
            <div className="flex w-full min-w-0 sm:min-w-min sm:flex-1 sm:justify-center">
              <div
                className="grid w-full grid-cols-[repeat(var(--n),minmax(0,1fr))] sm:w-fit sm:grid-cols-[repeat(var(--n),minmax(min-content,1fr))]"
                style={{ "--n": Math.max(items.length, 1) } as CSSProperties}
              >
                {items.map((item, index) => (
                  <div
                    key={`${item.title}-${index}`}
                    className={`flex min-w-0 flex-col items-center justify-start gap-2 px-1 text-center sm:px-2 md:px-3 lg:px-[clamp(0.75rem,2.2vw,2rem)] xl:gap-3 xl:px-10 2xl:px-12 ${
                      index > 0 ? "border-l border-[#FCE1A0]" : ""
                    }`}
                  >
                    {/* Icon circle:
                        below 640px -> 40px / 20px
                        640px to 1279px -> small, to fit
                        xl and up -> 56px / 28px */}
                    <div
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full sm:h-8 sm:w-8 md:h-9 md:w-9 lg:h-10 lg:w-10 xl:h-14 xl:w-14"
                      style={{ backgroundColor: item.iconBg }}
                    >
                      <Image
                        src={item.icon}
                        alt=""
                        width={28}
                        height={28}
                        className="h-5 w-5 object-contain sm:h-4 sm:w-4 md:h-[1.125rem] md:w-[1.125rem] lg:h-5 lg:w-5 xl:h-7 xl:w-7"
                      />
                    </div>

                    {/* Title: wraps naturally onto the next line, never clipped.
                        below xl -> caption, normal-case
                        xl and up -> body-lg */}
                    <Typography
                      variant="caption"
                      className="text-balance font-figtree font-medium normal-case leading-normal text-[#501959] max-sm:[overflow-wrap:anywhere] sm:break-words xl:hidden"
                    >
                      <span className="max-sm:text-[0.6875rem]">{item.title}</span>
                    </Typography>
                    <Typography
                      variant="body-lg"
                      className="hidden break-words text-balance font-figtree font-medium leading-normal text-[#501959] xl:block"
                    >
                      {item.title}
                    </Typography>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main image: touches the bottom, never cropped */}
          <div className="relative z-10 w-full max-w-[22rem] shrink-0 self-center sm:max-w-none sm:self-end sm:w-[26%] md:w-[28%] lg:w-[30%] xl:w-[28%] 2xl:w-[26%]">
            <Image
              src={mainImage}
              alt={mainImageAlt}
              width={0}
              height={0}
              sizes="(min-width: 1536px) 26vw, (min-width: 1280px) 28vw, (min-width: 1024px) 30vw, (min-width: 768px) 28vw, (min-width: 640px) 26vw, 60vw"
              className="block h-auto w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CommunityHealthBanner;