"use client";

import Image from "next/image";
import Typography from "@/lib/Typography";
import {
  DONATION_COPY,
  DONATION_SECTION_ID,
} from "@/domains/home/constants/donation";
import { DonationFormCard } from "@/domains/home/components/donation";
import { smoothScrollToId } from "@/shared/lib/smoothScroll";

export default function CTASection() {
  return (
    <section id={DONATION_SECTION_ID} className="relative w-full overflow-hidden">
      <div className="relative min-h-[560px] w-full lg:min-h-[640px]">
        <Image
          src={DONATION_COPY.bgImage}
          alt="Rural community"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/55" />

        <div className="relative z-10 mx-auto flex w-full max-w-[1600px] flex-col gap-10 px-6 py-12 sm:px-10 lg:flex-row lg:items-center lg:justify-between lg:gap-12 lg:px-10 lg:py-16 2xl:px-40">
          <div className="flex w-full max-w-xl flex-col text-left lg:max-w-lg xl:max-w-xl">
            <Typography
              variant="h1"
              className="font-lora font-normal leading-tight text-white lg:!text-[48px] xl:!text-[52px]"
            >
              {DONATION_COPY.sectionTitle}
            </Typography>

            <Typography
              variant="body-lg"
              className="mt-4 max-w-md leading-relaxed text-white/90 font-figtree font-normal sm:mt-5"
            >
              {DONATION_COPY.sectionBody}
            </Typography>

            <a
              href={DONATION_COPY.exploreHref}
              onClick={(e) => {
                e.preventDefault();
                smoothScrollToId(DONATION_COPY.exploreTargetId);
              }}
              className="mt-8 inline-flex w-fit items-center justify-center self-center bg-[#FFD638] px-6 py-3 transition-opacity hover:opacity-90 lg:self-start"
            >
              <Typography variant="body-sm" className="font-bold font-figtree text-[#00191B]">
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
