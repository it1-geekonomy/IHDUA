"use client";

import Image from "next/image";
import Link from "next/link";
import Typography from "@/lib/Typography";
import { VINAYAKA_STORIES } from "../constants/vinayakaSchool";

export default function SchoolStorySections() {
  const [story1, story2] = VINAYAKA_STORIES;

  return (
    <section className="w-full bg-[#FFFFFF] pb-12 lg:pb-20 pt-2 lg:pt-4">
      <div className="w-full px-[clamp(1rem,-1.0769rem_+_9.2308vw,10rem)] flex flex-col gap-16 lg:gap-24">
        {/* Story 1: Text on Left, Image on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          {/* Left Text */}
          <div className="lg:col-span-7 flex flex-col items-start">
            <div className="border-l-4 border-[#FFD638] pl-3.5 sm:pl-4 mb-4">
              <Typography
                variant="h2"
                className="font-lora font-normal text-[#00191B] text-left leading-tight"
              >
                {story1.title}
              </Typography>
            </div>

            <div className="flex flex-col gap-4 mt-2">
              {story1.paragraphs.map((p, idx) => (
                <Typography
                  key={idx}
                  variant="body-lg"
                  className="font-figtree font-normal text-[#5F6C6D] text-left leading-relaxed"
                >
                  {p}
                </Typography>
              ))}
            </div>
          </div>

          {/* Right Image */}
          <div className="lg:col-span-5 relative w-full max-w-lg sm:max-w-xl lg:max-w-none mx-auto aspect-[16/10] sm:aspect-[16/9] lg:aspect-[4/3] overflow-hidden rounded-md shadow-sm">
            <Image
              src={story1.image}
              alt={story1.imageAlt}
              fill
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>

        {/* Story 2: Image on Left, Text on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          {/* Left Image (Desktop first, mobile below or first) */}
          <div className="order-2 lg:order-1 lg:col-span-5 relative w-full max-w-lg sm:max-w-xl lg:max-w-none mx-auto aspect-[16/10] sm:aspect-[16/9] lg:aspect-[4/3] overflow-hidden rounded-md shadow-sm">
            <Image
              src={story2.image}
              alt={story2.imageAlt}
              fill
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="object-cover"
            />
          </div>

          {/* Right Text */}
          <div className="order-1 lg:order-2 lg:col-span-7 flex flex-col items-start">
            <Typography
              variant="h2"
              className="font-lora font-normal text-[#00191B] text-left leading-tight mb-4"
            >
              {story2.title}
            </Typography>

            <div className="flex flex-col gap-4">
              {story2.paragraphs.map((p, idx) => (
                <Typography
                  key={idx}
                  variant="body-lg"
                  className="font-figtree font-normal text-[#5F6C6D] text-left leading-relaxed"
                >
                  {p}
                </Typography>
              ))}
            </div>

            {/* View All Photos Button linking to dedicated Gallery page */}
            <Link
              href="/vinayakagnana-vidyashale-mysore/gallery"
              className="group inline-flex items-center justify-center gap-2.5 h-10 lg:h-12 px-5 py-2.5 mt-6 bg-[#FFD638] hover:bg-[#F2C92C] text-black transition-colors w-full sm:w-auto"
            >
              <Typography
                variant="caption"
                className="font-figtree font-medium text-black text-left"
              >
                {story2.ctaText}
              </Typography>
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                aria-hidden="true"
              >
                <line x1="7" y1="17" x2="17" y2="7" />
                <polyline points="7 7 17 7 17 17" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
