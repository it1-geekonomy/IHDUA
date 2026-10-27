"use client";

import Image from "next/image";
import { Fragment, type MouseEvent } from "react";
import {
  CAPTION_STYLES,
  FLUID,
  FOCUS_AREAS_ID,
  GRID_ITEMS,
  ICON_STYLES,
  MOBILE_HERO_IMAGE,
  ROW_OFFSET,
  type CaptionVariant,
  type GridItem,
} from "@/domains/home/constants/development";
import { scrollToDonateSection } from "@/domains/home/lib/donation";
import { smoothScrollToId } from "@/shared/lib/smoothScroll";
import Typography from "@/lib/Typography";

const getAspectClass = (item: GridItem) =>
  item.variant === "edge" || item.row === "low" ? "aspect-[7/8]" : "aspect-[4/5]";

function CaptionText({
  lines,
  className,
}: {
  lines: GridItem["caption"];
  className: string;
}) {
  return (
    <Typography
      variant="body-sm"
      className={`break-words font-figtree font-medium leading-snug ${className}`}
    >
      {lines.map((line, i) => (
        <Fragment key={i}>
          {line}
          {i < lines.length - 1 && <br />}
        </Fragment>
      ))}
    </Typography>
  );
}

function Caption({
  item,
  variant,
  className = "",
}: {
  item: GridItem;
  variant: CaptionVariant;
  className?: string;
}) {
  return (
    <div
      style={{ backgroundColor: item.bg }}
      className={`${CAPTION_STYLES[variant]} ${className}`}
    >
      <img src={item.icon} alt="" className={ICON_STYLES[variant]} />
      <CaptionText lines={item.caption} className={item.textColor} />
    </div>
  );
}

/**
 * Image is colored by default. When an ancestor with the `group` class
 * is hovered, the image smoothly turns black & white via a CSS grayscale filter.
 */
function ImageTile({
  src,
  aspectClass,
  sizes,
  objectPositionClass = "",
  className = "",
}: {
  src: string;
  aspectClass: string;
  sizes: string;
  objectPositionClass?: string;
  className?: string;
}) {
  return (
    <div className={`relative w-full overflow-hidden ${aspectClass} ${className}`}>
      <Image
        src={src}
        alt=""
        fill
        sizes={sizes}
        className={`object-cover ${objectPositionClass} grayscale-0 transition-[filter] duration-[800ms] ease-in-out will-change-[filter] group-hover:grayscale`}
      />
    </div>
  );
}

interface GridCellProps {
  item: GridItem;
  sizes: string;
  /** Overrides the aspect-ratio class (mobile layout). */
  mobileAspectClass?: string;
  /** Overrides the object-position class of the image (mobile layout). */
  mobileObjectPositionClass?: string;
  /** Always renders the compact caption, regardless of item.variant. */
  forceCompactCaption?: boolean;
  /** Replaces item.image entirely (mobile layout). */
  mobileImage?: string;
}

function GridCell({
  item,
  sizes,
  mobileAspectClass,
  mobileObjectPositionClass,
  forceCompactCaption,
  mobileImage,
}: GridCellProps) {
  const captionVariant: CaptionVariant =
    item.variant === "edge" && !forceCompactCaption ? "edge" : "compact";

  return (
    <div className={`group flex flex-col ${FLUID.cardGap}`}>
      <ImageTile
        src={mobileImage ?? item.image}
        sizes={sizes}
        aspectClass={mobileAspectClass ?? getAspectClass(item)}
        objectPositionClass={mobileObjectPositionClass}
        className="rounded-sm"
      />
      <Caption item={item} variant={captionVariant} className="flex-1 sm:flex-none" />
    </div>
  );
}

export default function RuralDevelopmentSection() {
  const [item1, item2, item3, item4, item5] = GRID_ITEMS;

  const handleExploreClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    smoothScrollToId(FOCUS_AREAS_ID);
  };

  return (
    <section id="home-top" className={`bg-[#FAF9F5] lg:px-6 lg:pb-0 ${FLUID.sectionPaddingTop}`}>
      {/* Same px-6 gutter as other sections below lg */}
      <div className="w-full px-6">
        {/* Centered at every screen size */}
        <div className="mx-auto max-w-6xl text-center">
          {/* Kicker */}
          <div className="mb-4 flex items-center justify-center gap-3 font-semibold uppercase tracking-wider text-[#9739A8]">
            <span className="h-px w-6 bg-[#9739A8]" />
            <Typography variant="caption" className="font-figtree font-bold tracking-normal">
              Rural Development · Karnataka
            </Typography>
            <span className="h-px w-6 bg-[#9739A8]" />
          </div>

          {/* Heading: h1 scale below lg (same as other long section titles); large from lg */}
          <Typography
  variant="h3"
  className="mx-auto max-w-5xl font-lora font-medium text-[#00191B] sm:hidden"
>
  Building Stronger Communities, Creating Lasting Change
</Typography>
<Typography
  variant="display-xl"
  className="mx-auto hidden max-w-5xl font-lora font-normal leading-tight text-[#00191B] sm:block"
>
  Building Stronger Communities, Creating Lasting Change
</Typography>

          {/* Subtext */}
          <Typography
            variant="body-lg"
            className={`mx-auto w-full max-w-2xl font-figtree font-normal leading-relaxed text-[#5F6C6D] ${FLUID.subtextMarginTop}`}
          >
            Empowering rural communities through education, sustainable livelihoods, healthcare, and opportunities for a better future.
          </Typography>

          {/* Buttons */}
          <div className="mt-8 flex flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={scrollToDonateSection}
              className="inline-flex w-fit cursor-pointer items-center justify-center gap-2 rounded-md bg-[#FFD638] px-6 py-3 font-bold text-[#1E1E1E]"
            >
              <Typography variant="body-sm" className="font-figtree font-semibold text-[#1E1E1E]">
                Donate Now
              </Typography>
              <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth={2.2}>
                <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <a
              href={`#${FOCUS_AREAS_ID}`}
              onClick={handleExploreClick}
              className="inline-flex w-fit cursor-pointer rounded-md border border-black bg-white px-6 py-3 font-bold text-[#00191B]"
            >
              <Typography variant="body-sm" className="font-figtree font-semibold text-[#00191B]">
                Explore Our Work
              </Typography>
            </a>
          </div>
        </div>

        {/* Mobile / tablet layout: below lg, same horizontal edges as text above */}
        <div className={`mx-auto mt-14 flex max-w-[1600px] flex-col lg:hidden ${FLUID.gridGap}`}>
          <GridCell
            item={item1}
            sizes="100vw"
            mobileAspectClass="aspect-[16/9]"
            mobileObjectPositionClass="object-top"
            forceCompactCaption
            mobileImage={MOBILE_HERO_IMAGE}
          />

          <div className={`grid grid-cols-2 ${FLUID.gridGap}`}>
            <GridCell item={item2} sizes="50vw" mobileAspectClass="aspect-square" />
            <GridCell item={item3} sizes="50vw" mobileAspectClass="aspect-square" />
          </div>

          <div className={`grid grid-cols-2 ${FLUID.gridGap}`}>
            <GridCell
              item={item5}
              sizes="50vw"
              mobileAspectClass="aspect-square"
              forceCompactCaption
            />
            <GridCell item={item4} sizes="50vw" mobileAspectClass="aspect-square" />
          </div>
        </div>
      </div>

      {/* Desktop layout: lg and above */}
      <div
        className={`mx-auto mt-14 hidden max-w-[1600px] grid-cols-5 lg:grid lg:items-stretch 2xl:items-start ${FLUID.gridGap} ${FLUID.gridPaddingX}`}
      >
        {GRID_ITEMS.map((item) => (
          <div
            key={item.image}
            className={`group flex flex-col lg:h-full lg:justify-end 2xl:h-auto 2xl:justify-start ${FLUID.cardGap} ${ROW_OFFSET[item.row]}`}
          >
            <ImageTile
              src={item.image}
              sizes="20vw"
              aspectClass={getAspectClass(item)}
            />
            <Caption item={item} variant={item.variant} />
          </div>
        ))}
      </div>
    </section>
  );
}