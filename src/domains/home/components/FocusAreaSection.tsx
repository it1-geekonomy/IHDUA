"use client";

import Image from "next/image";
import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { FOCUS_AREAS } from "@/domains/home/constants/focusarea";
import Typography from "@/lib/Typography";

export default function FocusAreaSection() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="focus-areas" className="w-full bg-[#FAF9F5]">
      <div className="w-full px-6 pt-6 lg:py-24 lg:px-10 2xl:px-40">
        <div className="flex flex-col items-start text-left">
          <div className="mb-4 flex items-center gap-3">
            <span className="h-px w-8 bg-[#9739A8]" />
            <Typography variant="caption" className="font-bold font-figtree text-[#9739A8]">
              OUR FOCUS AREAS
            </Typography>
            <span className="h-px w-8 bg-[#9739A8]" />
          </div>
          <Typography
            variant="h1"
            className="font-normal font-lora text-[#00191B] lg:text-[56px]"
          >
            Building Stronger Rural Communities
          </Typography>
          <Typography
            variant="body-lg"
            className="mt-3 leading-relaxed text-[#5F6C6D] w-full lg:max-w-2xl font-normal font-figtree"
          >
            Creating opportunities through education, healthcare, sustainable
            livelihoods, and community-led development.
          </Typography>
        </div>

        {/* Below lg: accordion */}
        <div className="mt-10 flex flex-col lg:hidden">
          {FOCUS_AREAS.map((area, index) => {
            const isOpen = openIndex === index;

            if (isOpen) {
              return (
                <div key={area.title} className="relative mb-6 pt-8 sm:mb-8 sm:pt-10">
                  <button
                    type="button"
                    onClick={() => setOpenIndex(index)}
                    className="w-full bg-[#FFD638] px-3 pb-5 text-left sm:px-4 sm:pb-6"
                  >
                    <div className="relative mb-4 h-40 w-full -mt-8 overflow-hidden sm:mb-5 sm:h-48 sm:-mt-10 md:h-52">
                      <Image
                        src={area.image}
                        alt={area.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1023px) 100vw"
                        priority={index === 0}
                      />
                    </div>

                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <Typography
                          variant="h3"
                          className="font-lora font-normal text-[#00191B] !text-[20px] sm:!text-[24px]"
                        >
                          {area.title}
                        </Typography>
                        <Typography
                          variant="body-lg"
                          className="mt-1.5 font-normal font-figtree leading-snug text-[#725B03]"
                        >
                          {area.description}
                        </Typography>
                      </div>
                      <ArrowUpRight
                        className="mt-0.5 h-6 w-6 shrink-0 text-[#00191B] sm:h-7 sm:w-7"
                        strokeWidth={2.5}
                      />
                    </div>
                  </button>
                </div>
              );
            }

            return (
              <div
                key={area.title}
                className="border-b border-[#0000003D] mb-5 lg:mb-0"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(index)}
                  className="flex w-full items-start justify-between gap-3 py-6 text-left"
                >
                  <div className="min-w-0 flex-1">
                    <Typography
                      variant="h3"
                      className="font-lora font-normal text-[#00191B] !text-[20px] sm:!text-[24px]"
                    >
                      {area.title}
                    </Typography>
                    <Typography
                      variant="body-lg"
                      className="mt-1.5 font-normal font-figtree leading-snug text-[#5F6C6D]"
                    >
                      {area.description}
                    </Typography>
                  </div>
                  <ArrowUpRight
                    className="mt-0.5 h-6 w-6 shrink-0 text-[#D2D2D2] sm:h-7 sm:w-7"
                    strokeWidth={2.5}
                  />
                </button>
              </div>
            );
          })}
        </div>

        {/* lg+: hover rows */}
        <div className="mt-12 hidden lg:block">
          {FOCUS_AREAS.map((area) => (
            <div
              key={area.title}
              className="group relative border-b border-[#0000003D] transition-colors duration-300 hover:border-transparent hover:bg-[#FFD638]"
            >
              <div className="relative z-10 flex items-center justify-between gap-6 py-6 sm:py-8">
                <div className="w-full">
                  <Typography variant="h3" className="font-lora font-normal text-[#00191B]">
                    {area.title}
                  </Typography>
                  <Typography
                    variant="body-xl"
                    className="mt-2 text-[#5F6C6D] transition-colors duration-300 group-hover:text-[#725B03] font-normal font-figtree"
                  >
                    {area.description}
                  </Typography>
                </div>

                <ArrowUpRight
                  className="h-9 w-9 shrink-0 text-[#D2D2D2] transition-colors duration-300 group-hover:text-[#00191B] sm:h-12 sm:w-12"
                  strokeWidth={2.5}
                />
              </div>

              <div className="pointer-events-none absolute right-14 top-1/2 z-20 h-24 w-28 -translate-y-1/2 scale-95 overflow-hidden opacity-0 shadow-lg transition-all duration-500 ease-out group-hover:scale-100 group-hover:opacity-100 sm:right-20 sm:h-36 sm:w-48 md:h-44 md:w-56 lg:right-24 lg:h-52 lg:w-64 xl:h-60 xl:w-72">
                <Image
                  src={area.image}
                  alt={area.title}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
