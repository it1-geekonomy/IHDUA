"use client";

import Image from "next/image";
import { Fragment } from "react";
import {
  GRID_ITEMS,
  ROW_OFFSET,
} from "@/domains/home/constants/development";
import { scrollToDonateSection } from "@/domains/home/lib/donation";
import { smoothScrollToId } from "@/shared/lib/smoothScroll";
import Typography from "@/lib/Typography";

type GridItem = (typeof GRID_ITEMS)[number];

function GridCell({
  item,
  bg,
  textColor,
  mobileAspectClass,
  forceCompactCaption,
  mobileObjectPositionClass,
  mobileUseHoverImage,
  mobileImage,
}: {
  item: GridItem;
  bg?: string;
  textColor?: string;
  /** When provided, overrides the aspect-ratio class for mobile layout use. */
  mobileAspectClass?: string;
  /** When true, always renders the compact inline-icon caption style, regardless of item.variant. */
  forceCompactCaption?: boolean;
  /** When provided, overrides the object-position class for the image (mobile layout use). */
  mobileObjectPositionClass?: string;
  /** When true, displays item.hoverImage (if present) as the primary static image instead of item.image. */
  mobileUseHoverImage?: boolean;

  mobileImage?: string;
}) {
  const bgColor = bg ?? item.bg;
  const capTextColor = textColor ?? item.textColor;

  const aspectClass =
    mobileAspectClass ??
    (item.variant === "edge" || item.row === "low" ? "aspect-[7/8]" : "aspect-[4/5]");

  const objectPositionClass = mobileObjectPositionClass ?? "";

  const useEdgeCaption = item.variant === "edge" && !forceCompactCaption;

  const baseImageSrc = mobileImage ?? item.image;
  const primaryImageSrc =
    !mobileImage && mobileUseHoverImage && item.hoverImage ? item.hoverImage : baseImageSrc;

  return (
    <div className="flex flex-col gap-2 sm:gap-3">
      <div className={`group relative w-full overflow-hidden rounded-sm ${aspectClass}`}>
        <Image
          src={primaryImageSrc}
          alt=""
          fill
          className={`object-cover ${objectPositionClass} ${
            item.hoverImage && (mobileImage || !mobileUseHoverImage)
              ? "transition-opacity duration-600 group-hover:opacity-0"
              : ""
          }`}
        />
        {item.hoverImage && (mobileImage || !mobileUseHoverImage) && (
          <Image
            src={item.hoverImage}
            alt=""
            fill
            className={`absolute inset-0 object-cover ${objectPositionClass} opacity-0 transition-opacity duration-600 group-hover:opacity-100`}
          />
        )}
      </div>

      {useEdgeCaption ? (
        <div
          className={`flex min-h-[110px] flex-1 flex-col justify-center gap-2 bg-[${bgColor}] p-4 sm:min-h-[130px] sm:flex-none sm:gap-3 sm:p-5`}
        >
          <img src={item.icon} alt="" className="h-6 w-6 object-contain" />
          <Typography
            variant="body-sm"
            className={`break-words font-medium font-figtree leading-snug ${capTextColor}`}
          >
            {item.caption.map((line, i) => (
              <Fragment key={i}>
                {line}
                {i < item.caption.length - 1 && <br />}
              </Fragment>
            ))}
          </Typography>
        </div>
      ) : (
        <div
          className={`flex min-h-[56px] flex-1 items-center gap-2 bg-[${bgColor}] p-2 sm:min-h-[66px] sm:flex-none sm:p-3`}
        >
          <img src={item.icon} alt="" className="h-5 w-5 shrink-0 object-contain sm:h-6 sm:w-6" />
          <Typography
            variant="body-sm"
            className={`break-words font-medium font-figtree leading-snug ${capTextColor}`}
          >
            {item.caption.map((line, i) => (
              <Fragment key={i}>
                {line}
                {i < item.caption.length - 1 && <br />}
              </Fragment>
            ))}
          </Typography>
        </div>
      )}
    </div>
  );
}

export default function RuralDevelopmentSection() {
  const [item1, item2, item3, item4, item5] = GRID_ITEMS;

  return (
    <section id="home-top" className="bg-[#FAF9F5] pt-8 lg:px-6 lg:py-20">
      {/* Same px-6 gutter as other sections below lg */}
      <div className="w-full px-6">
        <div className="mx-auto max-w-6xl text-left lg:text-center">
          {/* Kicker */}
          <div className="mb-4 flex items-center justify-start gap-3 font-semibold uppercase tracking-wider text-[#9739A8] lg:justify-center">
            <span className="h-px w-6 bg-[#9739A8]" />
            <Typography variant="caption" className="font-bold font-figtree tracking-normal">
              Rural Development · Karnataka
            </Typography>
            <span className="h-px w-6 bg-[#9739A8]" />
          </div>

          {/* Heading — h1 scale below lg (same as other long section titles); large from lg */}
          <Typography
            variant="h1"
            className="max-w-5xl font-normal font-lora leading-tight text-[#00191B] lg:mx-auto lg:text-[56px]"
          >
            Building Stronger Communities, Creating Lasting Change
          </Typography>

          {/* Subtext */}
          <Typography
            variant="body-lg"
            className="mt-4 w-full max-w-2xl text-[#5F6C6D] font-regular font-figtree leading-relaxed lg:mx-auto lg:mt-8"
          >
            Empowering rural communities through education, sustainable livelihoods, healthcare, and opportunities for a better future.
          </Typography>

          {/* Buttons */}
          <div className="mt-8 flex flex-row gap-3 sm:flex-row sm:items-center lg:items-center lg:justify-center">
            <button
              type="button"
              onClick={() => scrollToDonateSection()}
              className="inline-flex w-fit items-center justify-center gap-2 rounded-md bg-[#FFD638] px-6 py-3 font-bold text-[#1E1E1E] cursor-pointer"
            >
              <Typography variant="body-sm" className="font-semibold font-figtree text-[#1E1E1E]">
                Donate Now
              </Typography>
              <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth={2.2}>
                <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <a
              href="#focus-areas"
              onClick={(e) => {
                e.preventDefault();
                smoothScrollToId("focus-areas");
              }}
              className="inline-flex w-fit rounded-md border border-black bg-white px-6 py-3 font-bold text-[#00191B] cursor-pointer"
            >
              <Typography variant="body-sm" className="font-semibold font-figtree text-[#00191B]">
                Explore Our Work
              </Typography>
            </a>
          </div>
        </div>

        {/* Mobile / tablet layout: below lg — same horizontal edges as text above */}
        <div className="mx-auto mt-14 flex max-w-[1600px] flex-col gap-3 sm:gap-4 lg:hidden">
          <GridCell
            item={item1}
            mobileAspectClass="aspect-[16/9]"
            mobileObjectPositionClass="object-top"
            forceCompactCaption
            mobileImage="/development/mobileimg.png"
          />

          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <GridCell item={item2} mobileAspectClass="aspect-square" />
            <GridCell item={item3} mobileAspectClass="aspect-square" mobileUseHoverImage />
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <GridCell item={item5} mobileAspectClass="aspect-square" forceCompactCaption mobileUseHoverImage />
            <GridCell item={item4} mobileAspectClass="aspect-square" />
          </div>
        </div>
      </div>

      {/* Desktop layout: lg and above (unchanged) */}
      <div className="mx-auto mt-14 hidden max-w-[1600px] grid-cols-5 gap-3 px-2 sm:gap-4 sm:px-4 lg:grid lg:items-stretch 2xl:items-start">
        {GRID_ITEMS.map((item) => (
          <div
            key={item.image}
            className={`flex flex-col gap-2 sm:gap-3 lg:h-full lg:justify-end 2xl:h-auto 2xl:justify-start ${ROW_OFFSET[item.row]}`}
          >
            <div
              className={`group relative w-full overflow-hidden ${
                item.variant === "edge" || item.row === "low"
                  ? "aspect-[7/8]"
                  : "aspect-[4/5]"
              }`}
            >
              <Image
                src={item.image}
                alt=""
                fill
                className={`object-cover ${
                  item.hoverImage
                    ? "transition-opacity duration-600 group-hover:opacity-0"
                    : ""
                }`}
              />
              {item.hoverImage && (
                <Image
                  src={item.hoverImage}
                  alt=""
                  fill
                  className="absolute inset-0 object-cover opacity-0 transition-opacity duration-600 group-hover:opacity-100"
                />
              )}
            </div>

            {item.variant === "edge" ? (
              <div
                className={`flex min-h-[110px] flex-col justify-center gap-2 bg-[${item.bg}] p-4 sm:min-h-[130px] sm:gap-3 sm:p-5`}
              >
                <img src={item.icon} alt="" className="h-6 w-6 object-contain" />
                <Typography variant="body-sm" className={`break-words font-medium font-figtree leading-snug ${item.textColor}`}>
                  {item.caption.map((line, i) => (
                    <Fragment key={i}>
                      {line}
                      {i < item.caption.length - 1 && <br className="" />}
                    </Fragment>
                  ))}
                </Typography>
              </div>
            ) : (
              <div
                className={`flex min-h-[56px] items-center gap-2 bg-[${item.bg}] p-2 sm:min-h-[66px] sm:p-3`}
              >
                <img src={item.icon} alt="" className="h-5 w-5 shrink-0 object-contain sm:h-6 sm:w-6" />
                <Typography variant="body-sm" className={`break-words font-medium font-figtree leading-snug ${item.textColor}`}>
                  {item.caption.map((line, i) => (
                    <Fragment key={i}>
                      {line}
                      {i < item.caption.length - 1 && <br className="" />}
                    </Fragment>
                  ))}
                </Typography>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}