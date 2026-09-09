import Image from "next/image";
import { Fragment } from "react";
import { STATS } from "@/domains/home/constants/stat";
import Typography from "@/lib/Typography";

export default function StatSection() {
  return (
    <section className="w-full px-6 pb-6 pt-6 lg:pt-0 lg:pb-24 lg:px-10 2xl:px-40 bg-[#FAF9F5]">
      <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
        <div className="mb-4 flex items-center gap-3">
          <span className="h-px w-8 bg-[#9739A8]" />
          <Typography variant="caption" className="font-bold font-figtree tracking-wide text-[#9739A8]">
            Our Impact
          </Typography>
          <span className="h-px w-8 bg-[#9739A8]" />
        </div>
        <Typography variant="body-lg" className="leading-relaxed text-[#5F6C6D] font-normal font-figtree">
          Empowering rural communities through education, sustainable
          livelihoods, healthcare, and opportunities for a better future.
        </Typography>
      </div>
      <div className="mt-10 mx-auto grid w-fit grid-cols-1 justify-items-start gap-y-8 sm:mx-0 sm:w-auto sm:grid-cols-2 lg:mt-16 lg:flex lg:w-full lg:items-start lg:justify-between lg:gap-y-0">
        {STATS.map((stat, index) => {
          const orderMap = ["sm:order-1", "sm:order-2", "sm:order-4", "sm:order-3"];
          return (
            <Fragment key={stat.label}>
              {index !== 0 && (
                <span className="hidden lg:block lg:h-16 lg:w-px lg:bg-[#45454530]" />
              )}
              <div
                className={`flex items-start gap-4 px-4 ${orderMap[index]} lg:order-none`}
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
                <div className="flex flex-col gap-0.5 text-left">
                  <Typography variant="h2" className="font-bold font-lora leading-none text-[#00191B] !mb-0">
                    {stat.value}
                  </Typography>
                  <Typography variant="body-sm" className="leading-snug text-[#5F6C6D] font-medium font-figtree !mb-0">
                    {stat.label}
                  </Typography>
                </div>
              </div>
            </Fragment>
          );
        })}
      </div>
    </section>
  );
}