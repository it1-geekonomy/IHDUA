"use client";

import Image from "next/image";
import { Fragment } from "react";
import {
  GRID_ITEMS,
  ROW_OFFSET,
} from "@/domains/home/constants/development";

export default function RuralDevelopmentSection() {
  return (
    <section className="bg-[#FAF9F5] px-6 pt-10 lg:py-20">
      <div className="mx-auto max-w-6xl text-center">
        {/* Kicker */}
        <div className="mb-4 flex items-center justify-center gap-3 text-xs font-semibold uppercase tracking-wider text-[#9739A8]">
          <span className="h-px w-6 bg-[#9739A8]" />
          Rural Development · Karnataka
          <span className="h-px w-6 bg-[#9739A8]" />
        </div>

        {/* Heading */}
        <h2 className="mx-auto max-w-3xl text-4xl font-semibold leading-tight text-[#00191B] lg:text-[44px]">
          Building Stronger Communities, Creating Lasting Change
        </h2>

        {/* Subtext */}
        <p className="mx-auto mt-5 max-w-xl text-base text-[#5F6C6D]">
          Empowering rural communities through education, sustainable livelihoods, healthcare, and opportunities for a better future.
        </p>

        {/* Buttons */}
        <div className="mt-8 flex items-center justify-center gap-3">
          <button
            type="button"
            className="flex items-center gap-2 rounded-md bg-[#FFD638] px-6 py-3 text-sm font-bold text-[#1E1E1E] transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Donate Now
            <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth={2.2}>
              <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            type="button"
            className="rounded-md border border-black bg-white px-6 py-3 text-sm font-bold text-[#00191B] transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Explore Our Work
          </button>
        </div>
      </div>

      {/* Image grid */}
      <div className="mx-auto mt-14 grid max-w-[1600px] grid-cols-5 items-start gap-3 px-2 sm:gap-4 sm:px-4">
        {GRID_ITEMS.map((item) => (
          <div
            key={item.image}
            className={`flex flex-col gap-2 sm:gap-3 ${ROW_OFFSET[item.row]}`}
          >
            <div
              className={`relative w-full ${
                item.variant === "edge" || item.row === "low"
                  ? "aspect-[7/8]"
                  : "aspect-[4/5]"
              }`}
            >
              <Image src={item.image} alt="" fill className="object-cover" />
            </div>

            {item.variant === "edge" ? (
              <div
                className="flex min-h-[110px] flex-col justify-center gap-2 p-4 sm:min-h-[130px] sm:gap-3 sm:p-5"
                style={{ backgroundColor: item.bg }}
              >
                <img src={item.icon} alt="" className="h-6 w-6 object-contain" />
                <p className={`text-xs font-medium leading-snug sm:text-sm ${item.textColor}`}>
                  {item.caption.map((line, i) => (
                    <Fragment key={i}>
                      {line}
                      {i < item.caption.length - 1 && <br className="hidden xl:inline" />}
                    </Fragment>
                  ))}
                </p>
              </div>
            ) : (
              <div
                className="flex min-h-[56px] items-center gap-2 p-2 sm:min-h-[66px] sm:p-3"
                style={{ backgroundColor: item.bg }}
              >
                <img src={item.icon} alt="" className="h-5 w-5 shrink-0 object-contain sm:h-6 sm:w-6" />
                <p className={`text-xs font-medium leading-snug sm:text-sm ${item.textColor}`}>
                  {item.caption.map((line, i) => (
                    <Fragment key={i}>
                      {line}
                      {i < item.caption.length - 1 && <br className="hidden xl:inline" />}
                    </Fragment>
                  ))}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}