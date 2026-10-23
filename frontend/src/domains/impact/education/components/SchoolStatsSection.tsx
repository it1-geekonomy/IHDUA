import React from "react";
import Image from "next/image";
import Typography from "@/lib/Typography";
import { VINAYAKA_STATS } from "../constants/vinayakaSchool";

export default function SchoolStatsSection() {
  return (
    <section
      className="w-full min-h-[16.4375rem] flex items-center py-8 lg:py-0"
      style={{
        background: "linear-gradient(90deg, #F0E9F8 0%, #F7F4FB 50%, #F2ECF9 100%)",
      }}
    >
      <div className="w-full max-w-[90rem] 2xl:max-w-[97.5rem] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-8 lg:gap-y-0 items-center">
          {VINAYAKA_STATS.map((stat, index) => (
            <div
              key={stat.label}
              className="relative flex flex-col items-center text-center px-4 sm:px-6 lg:px-8"
            >
              {/* Vertical divider lines between columns matching Figma */}
              {index < VINAYAKA_STATS.length - 1 && (
                <span
                  className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 h-20 w-px bg-[#DFD1E7]"
                  aria-hidden="true"
                />
              )}
              {index % 2 === 0 && (
                <span
                  className="lg:hidden absolute right-0 top-1/2 -translate-y-1/2 h-16 w-px bg-[#DFD1E7]"
                  aria-hidden="true"
                />
              )}

              <div className="mb-3.5 flex items-center justify-center h-12 w-12 sm:h-14 sm:w-14">
                <Image
                  src={stat.icon}
                  alt={stat.label}
                  width={56}
                  height={56}
                  className="h-10 w-10 sm:h-12 sm:w-12 object-contain"
                />
              </div>

              <Typography
                variant="h2"
                className="font-lora font-semibold text-[#9739A8] text-center"
              >
                {stat.value}
              </Typography>

              <Typography
                variant="body-sm"
                className="font-figtree font-medium text-[#5F6C6D] text-center mt-1.5 leading-snug"
              >
                {stat.label}
              </Typography>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
