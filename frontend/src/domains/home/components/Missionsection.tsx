"use client";

import { useState } from "react";
import { PILLARS } from "@/domains/home/constants/missionsection";
import Typography from "@/lib/Typography";

export default function MissionSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activePillar = PILLARS[activeIndex];

  return (
    <section className="w-full bg-white">
      <div className="w-full px-6 pt-6 lg:pt-0 lg:pb-26 lg:px-10 2xl:px-40">
        {/* Top row: eyebrow + heading on the left, description on the right */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
          {/* Label + heading: centered below lg, left-aligned at lg+ */}
          <div className="text-center lg:text-left">
            <div className="flex items-center justify-center gap-3 lg:justify-start">
              <span className="h-px w-8 bg-[#9739A8]" />
              <Typography variant="caption" className="font-bold font-figtree text-[#9739A8]">
                Mission
              </Typography>
              <span className="h-px w-8 bg-[#9739A8]" />
            </div>

            <Typography variant="display-xl" className="mt-4 font-lora font-normal text-[#00191B]">
              The Mission of IHDUA
            </Typography>
          </div>

          {/* Description: centered below lg (same max width as a centered block), left-aligned at lg+ */}
          <Typography
            variant="body-lg"
            className="mx-auto w-full max-w-2xl text-center leading-relaxed text-[#5F6C6D] font-normal font-figtree lg:mx-0 lg:max-w-md lg:text-left xl:max-w-3xl"
          >
            Building stronger communities through sustainable development.
            IHDUA works with rural communities to create better access to
            education, healthcare, sustainable livelihoods, and opportunities
            for long-term growth.
          </Typography>
        </div>

        {/* Two parts: pillar cards on the left, image on the right, matched heights */}
        <div className="mt-8 grid grid-cols-1 items-stretch gap-6 sm:mt-10 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col gap-3 sm:gap-4">
            {PILLARS.map((pillar, index) => {
              const isActive = index === activeIndex;

              return (
                <button
                  key={pillar.number}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  aria-pressed={isActive}
                  className={`flex flex-1 items-center gap-4 border-l-4 border-[#9739A8] px-4 py-4 text-left transition-colors duration-200 sm:gap-6 sm:px-6 sm:py-5 ${
                    isActive ? "bg-[#FFD638]" : "bg-[#FAF9F5] hover:bg-[#FFD638]"
                  }`}
                >
                  <Typography
                    variant="display-2xl"
                    className="font-lora font-normal leading-none text-[#6D3F76]/[0.37]"
                  >
                    {pillar.number}
                  </Typography>

                  <div>
                    <Typography variant="body-xl" className="font-lora font-normal text-[#383217]">
                      {pillar.title}
                    </Typography>
                    <Typography
                      variant="body-sm"
                      className="mt-1.5 leading-relaxed text-[#716B52]/[0.58] font-figtree font-normal"
                    >
                      {pillar.description}
                    </Typography>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="h-64 sm:h-80 md:h-[26rem] lg:h-auto">
            <img
              src={activePillar.image}
              alt={activePillar.title}
              className="h-full w-full object-cover transition-opacity duration-300"
            />
          </div>
        </div>
      </div>
    </section>
  );
}