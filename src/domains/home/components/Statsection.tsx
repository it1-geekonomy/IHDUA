import Image from "next/image";
import { Fragment } from "react";
import { STATS } from "@/domains/home/constants/stat";

export default function StatSection() {
  return (
    <section className="w-full px-6 pb-6 pt-6 lg:pt-0 lg:pb-24 lg:px-10 2xl:px-40 bg-[#FAF9F5]">
      <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
        <div className="mb-4 flex items-center gap-3">
          <span className="h-px w-8 bg-[#9739A8]" />
          <span className="text-lg font-semibold tracking-wide text-[#9739A8]">
            Our Impact
          </span>
          <span className="h-px w-8 bg-[#9739A8]" />
        </div>
        <p className="text-sm leading-relaxed text-gray-600 sm:text-base">
          Empowering rural communities through education, sustainable
          livelihoods, healthcare, and opportunities for a better future.
        </p>
      </div>

      <div className="mt-10 mx-auto grid w-fit grid-cols-1 justify-items-start gap-y-8 sm:mx-0 sm:w-auto sm:grid-cols-2 lg:mt-16 lg:flex lg:w-full lg:items-center lg:justify-between lg:gap-y-0">
        {STATS.map((stat, index) => {
          const orderMap = ["sm:order-1", "sm:order-2", "sm:order-4", "sm:order-3"];
          return (
            <Fragment key={stat.label}>
              {index !== 0 && (
                <span className="hidden lg:block lg:h-16 lg:w-px lg:bg-[#45454530]" />
              )}
              <div
                className={`flex items-center gap-4 px-4 ${orderMap[index]} lg:order-none`}
              >
                <div
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
                  style={{ backgroundColor: stat.bg }}
                >
                  <Image
                    src={stat.icon}
                    alt={stat.label}
                    width={24}
                    height={24}
                    className="h-6 w-6 object-contain"
                  />
                </div>
                <div className="text-left">
                  <p className="text-2xl font-bold text-gray-900 sm:text-3xl">
                    {stat.value}
                  </p>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                </div>
              </div>
            </Fragment>
          );
        })}
      </div>
    </section>
  );
}