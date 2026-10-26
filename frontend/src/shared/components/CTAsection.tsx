"use client";

import Image from "next/image";
import Typography from "@/lib/Typography";
import {
  DONATION_COPY,
  DONATION_SECTION_ID,
} from "@/shared/constants/donation";
import { DonationFormCard } from "@/domains/home/components/donation";
import { smoothScrollToId } from "@/shared/lib/smoothScroll";

export default function CTASection() {
  const handleExploreClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    smoothScrollToId(DONATION_COPY.exploreTargetId);
  };

  return (
    <section id={DONATION_SECTION_ID} className="relative w-full overflow-hidden">
      <div className="relative w-full min-h-[640px] py-12 sm:py-16 lg:py-20 flex items-center">
        <Image
          src={DONATION_COPY.bgImage}
          alt="Rural community"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/55" />

        <div className="relative z-10 mx-auto flex w-full max-w-[1600px] flex-col gap-10 px-6 sm:px-10 lg:flex-row lg:items-center lg:justify-between lg:px-10 2xl:px-40">
          {/* Heading, description and button: centered below lg, left-aligned at lg+ */}
          <div className="mx-auto flex w-full max-w-xl flex-col items-center text-center lg:mx-0 lg:max-w-lg lg:items-start lg:text-left xl:max-w-xl">
            <Typography
              variant="h1"
              className="font-lora font-normal leading-tight text-white"
            >
              {DONATION_COPY.sectionTitle}
            </Typography>

            <Typography
              variant="body-lg"
              className="mx-auto mt-4 max-w-md font-figtree font-normal leading-relaxed text-white/90 lg:mx-0"
            >
              {DONATION_COPY.sectionBody}
            </Typography>

            <a
              href={DONATION_COPY.exploreHref}
              onClick={handleExploreClick}
              className="mt-8 inline-flex w-fit items-center justify-center self-center bg-[#FFD638] px-6 py-3 transition-opacity hover:opacity-90 lg:self-start"
            >
              <Typography
                variant="body-sm"
                className="font-figtree font-bold text-[#00191B]"
              >
                {DONATION_COPY.exploreCta}
              </Typography>
            </a>
          </div>

          <DonationFormCard />
        </div>
      </div>
    </section>
  );

}