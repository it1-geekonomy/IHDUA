"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
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

// useLayoutEffect on the client (measure before paint), useEffect on the server
const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

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
  // true  -> the heading does NOT fit on one line next to the image
  // false -> the heading fits on one line
  const [wraps, setWraps] = useState(false);

  const textColRef = useRef<HTMLDivElement>(null); // same width as the heading column
  const headingBoxRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLSpanElement>(null); // heading on a single line

  useIsoLayoutEffect(() => {
    const check = () => {
      const col = textColRef.current;
      const box = headingBoxRef.current;
      const one = measureRef.current;
      if (!col || !box || !one) return;

      const cs = getComputedStyle(box);
      const available =
        col.clientWidth -
        parseFloat(cs.borderLeftWidth) -
        parseFloat(cs.paddingLeft) -
        parseFloat(cs.paddingRight);

      setWraps(one.getBoundingClientRect().width > available + 0.5);
    };

    check();

    const ro = new ResizeObserver(check);
    if (textColRef.current) ro.observe(textColRef.current);
    if (measureRef.current) ro.observe(measureRef.current);
    // fonts (Lora / Kannada) can change the width after first paint
    document.fonts?.ready.then(check);

    return () => ro.disconnect();
  }, [heading]);

  return (
    <section className="w-full bg-white">
      <div className="w-full px-6 pt-6 lg:px-10 lg:pt-10 xl:pt-14 2xl:px-40">
        {/* Hidden copy of the heading on ONE line, only used to measure it */}
        <div
          aria-hidden="true"
          className="pointer-events-none invisible absolute h-0 w-0 overflow-hidden"
        >
          <Typography variant="h2" className="font-lora font-normal leading-tight">
            <span ref={measureRef} className="inline-block whitespace-nowrap">
              {heading}
            </span>
          </Typography>
        </div>

        {/* Below lg: heading, text, then image, stacked.

            lg and up, heading fits on ONE line:
              heading + text on the left, image on the right, vertically centred
              against the whole block (it starts level with the heading when
              the image is taller than the text).
            lg and up, heading WRAPS:
              heading spans the full width on its own row; below it the text
              and the image sit side by side, the image starting level with the
              first paragraph.
            The image is always shown in full (never cropped). */}
        <div className="grid grid-cols-1 gap-y-6 lg:grid-cols-12 lg:grid-rows-[auto_1fr] lg:items-start lg:gap-x-14">
          {/* Heading */}
          <div
            ref={headingBoxRef}
            className={`order-1 w-full border-l-4 border-[#FFD638] pl-3.5 sm:pl-4 lg:row-start-1 ${
              wraps
                ? "lg:col-span-12 lg:col-start-1"
                : "lg:col-span-7 lg:col-start-1 xl:col-span-8"
            }`}
          >
            <Typography
              variant="h2"
              className="w-full font-lora font-normal text-[#00191B] text-left leading-tight"
            >
              {heading}
            </Typography>
          </div>

          {/* Text */}
          <div
            ref={textColRef}
            className="order-2 flex w-full flex-col items-start max-lg:mb-2 lg:col-span-7 lg:col-start-1 lg:row-start-2 xl:col-span-8"
          >
            <div className="flex flex-col gap-4">
              {descriptions.map((para, index) => (
                <Typography
                  key={index}
                  variant="body-lg"
                  className="w-full font-figtree font-normal text-[#5F6C6D] text-left leading-relaxed"
                >
                  {para}
                </Typography>
              ))}
            </div>

            {button?.label && (
              <Link
  href={button.href ?? "#"}
  target={button.external ? "_blank" : undefined}
  rel={button.external ? "noopener noreferrer" : undefined}
  className="group mt-6 inline-flex w-fit items-center gap-1.5 self-center bg-[#FFD638] px-4 py-2 text-[#000000] transition-[filter] duration-200 hover:brightness-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:gap-2 sm:px-5 sm:py-2.5 lg:self-start"
>
                <Typography
                  variant="body-sm"
                  className="m-0 font-figtree font-normal text-[#000000]"
                >
                  {button.label}
                </Typography>
                <ArrowUpRight />
              </Link>
            )}
          </div>

          {/* Image: full image at its natural ratio, never cropped */}
          <div
            className={`order-3 flex w-full lg:col-span-5 lg:col-start-8 xl:col-span-4 xl:col-start-9 ${
              wraps
                ? "lg:row-start-2"
                : "lg:row-span-2 lg:row-start-1 lg:self-center"
            }`}
          >
            <div className="mx-auto w-full max-w-lg overflow-hidden rounded-md shadow-sm sm:max-w-xl lg:max-w-none">
              <Image
                src={image}
                alt={imageAlt || heading}
                width={0}
                height={0}
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="block h-auto w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OpportunitiesSection;