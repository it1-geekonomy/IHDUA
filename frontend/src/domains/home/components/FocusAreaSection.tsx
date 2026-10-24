"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { FOCUS_AREAS } from "@/domains/home/constants/focusarea";
import Typography from "@/lib/Typography";

type FocusArea = (typeof FOCUS_AREAS)[number];

/**
 * Fluid sizes. Each clamp(min, preferred, max) is tuned to match the old
 * breakpoint values at its endpoints, so the layout is unchanged at the
 * extremes and scales smoothly in between.
 */
const SIZE = {
  // Heading: 32px -> 56px
  h1: "!text-[clamp(2rem,1.2rem+3.2vw,3.5rem)]",
  // Accordion titles: 20px (375px) -> 24px (640px)
  accordionTitle: "!text-[clamp(1.25rem,0.9rem+1.5vw,1.5rem)]",
  // Accordion arrow: 24px -> 28px
  accordionIcon: "h-[clamp(1.5rem,1.15rem+1.5vw,1.75rem)] w-[clamp(1.5rem,1.15rem+1.5vw,1.75rem)]",
  // Desktop arrow: 36px -> 48px
  rowIcon: "h-[clamp(2.25rem,1.5rem+3vw,3rem)] w-[clamp(2.25rem,1.5rem+3vw,3rem)]",
  // Open card image height: 160px -> 208px
  cardImage: "h-[clamp(10rem,7.1rem+12.2vw,13rem)]",
  // Hover preview, lg (1024px) -> xl (1280px)
  previewImage: "h-[clamp(13rem,5rem+12.5vw,15rem)] w-[clamp(16rem,8rem+12.5vw,18rem)]",
} as const;

function SectionLabel({ children }: { children: string }) {
  return (
    <div className="mb-4 flex items-center justify-center gap-3">
      <span className="h-px w-8 bg-[#9739A8]" aria-hidden="true" />
      <Typography variant="caption" className="font-bold font-figtree text-[#9739A8]">
        {children}
      </Typography>
      <span className="h-px w-8 bg-[#9739A8]" aria-hidden="true" />
    </div>
  );
}

interface AccordionItemProps {
  area: FocusArea;
  isOpen: boolean;
  isFirst: boolean;
  onSelect: () => void;
}

/** Below lg: one expandable card at a time.
 *  Closed item -> tap to open it. Open card -> tap to go to its page. */
function AccordionItem({ area, isOpen, isFirst, onSelect }: AccordionItemProps) {
  if (isOpen) {
    return (
      // --card-offset keeps the top padding and the image's negative margin in sync
      <div className="relative mb-[clamp(1.5rem,1.1rem+2vw,2rem)] pt-[var(--card-offset)] [--card-offset:clamp(2rem,1.3rem+3vw,2.5rem)]">
        <Link
          href={area.href}
          className="block w-full bg-[#FFD638] px-[clamp(0.75rem,0.5rem+1vw,1rem)] pb-[clamp(1.25rem,1rem+1vw,1.5rem)] text-left"
        >
          <div
            className={`relative mb-[clamp(1rem,0.8rem+0.8vw,1.25rem)] -mt-[var(--card-offset)] w-full overflow-hidden ${SIZE.cardImage}`}
          >
            <Image
              src={area.image}
              alt={area.title}
              fill
              className="object-cover"
              sizes="(max-width: 1023px) 100vw"
              priority={isFirst}
            />
          </div>

          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <Typography variant="h3" className={`font-lora font-normal text-[#00191B] ${SIZE.accordionTitle}`}>
                {area.title}
              </Typography>
              <Typography variant="body-lg" className="mt-1.5 font-normal font-figtree leading-snug text-[#725B03]">
                {area.description}
              </Typography>
            </div>
            <ArrowUpRight
              className={`mt-0.5 shrink-0 text-[#00191B] ${SIZE.accordionIcon}`}
              strokeWidth={2.5}
              aria-hidden="true"
            />
          </div>
        </Link>
      </div>
    );
  }

  return (
    <div className="mb-5 border-b border-[#0000003D]">
      <button
        type="button"
        aria-expanded="false"
        onClick={onSelect}
        className="flex w-full items-start justify-between gap-3 py-6 text-left"
      >
        <div className="min-w-0 flex-1">
          <Typography variant="h3" className={`font-lora font-normal text-[#00191B] ${SIZE.accordionTitle}`}>
            {area.title}
          </Typography>
          <Typography variant="body-lg" className="mt-1.5 font-normal font-figtree leading-snug text-[#5F6C6D]">
            {area.description}
          </Typography>
        </div>
        <ArrowUpRight
          className={`mt-0.5 shrink-0 text-[#D2D2D2] ${SIZE.accordionIcon}`}
          strokeWidth={2.5}
          aria-hidden="true"
        />
      </button>
    </div>
  );
}

/** lg+: row that highlights and reveals a preview image on hover. Click goes to the page. */
function HoverRow({ area }: { area: FocusArea }) {
  return (
    <Link
      href={area.href}
      className="group relative block border-b border-[#0000003D] transition-colors duration-300 hover:border-transparent hover:bg-[#FFD638]"
    >
      <div className="relative z-10 flex items-center justify-between gap-6 py-[clamp(1.5rem,1rem+1vw,2rem)]">
        <div className="w-full">
          <Typography variant="h3" className="font-lora font-normal text-[#00191B]">
            {area.title}
          </Typography>
          <Typography
            variant="body-xl"
            className="mt-2 font-normal font-figtree text-[#5F6C6D] transition-colors duration-300 group-hover:text-[#725B03]"
          >
            {area.description}
          </Typography>
        </div>

        <ArrowUpRight
          className={`shrink-0 text-[#D2D2D2] transition-colors duration-300 group-hover:text-[#00191B] ${SIZE.rowIcon}`}
          strokeWidth={2.5}
          aria-hidden="true"
        />
      </div>

      <div
        className={`pointer-events-none absolute right-24 top-1/2 z-20 -translate-y-1/2 scale-95 overflow-hidden opacity-0 shadow-lg transition-all duration-500 ease-out group-hover:scale-100 group-hover:opacity-100 ${SIZE.previewImage}`}
      >
        <Image
          src={area.image}
          alt={area.title}
          fill
          className="object-cover"
          sizes="(min-width: 1280px) 18rem, 16rem"
        />
      </div>
    </Link>
  );
}

export default function FocusAreaSection() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="focus-areas" className="w-full bg-[#FAF9F5]">
      <div className="w-full px-6 pt-6 lg:px-10 lg:py-24 2xl:px-40">
        {/* Label, heading and description: centered at all screen sizes */}
        <div className="flex flex-col items-center text-center">
          <SectionLabel>OUR FOCUS AREAS</SectionLabel>
          <Typography variant="h1" className={`font-normal font-lora text-[#00191B] ${SIZE.h1}`}>
            Building Stronger Rural Communities
          </Typography>
          <Typography
            variant="body-lg"
            className="mt-3 w-full max-w-2xl font-normal font-figtree leading-relaxed text-[#5F6C6D]"
          >
            Creating opportunities through education, healthcare, sustainable
            livelihoods, and community-led development.
          </Typography>
        </div>

        {/* Below lg: accordion */}
        <div className="mt-10 flex flex-col lg:hidden">
          {FOCUS_AREAS.map((area, index) => (
            <AccordionItem
              key={area.title}
              area={area}
              isOpen={openIndex === index}
              isFirst={index === 0}
              onSelect={() => setOpenIndex(index)}
            />
          ))}
        </div>

        {/* lg+: hover rows */}
        <div className="mt-12 hidden lg:block">
          {FOCUS_AREAS.map((area) => (
            <HoverRow key={area.title} area={area} />
          ))}
        </div>
      </div>
    </section>
  );
}