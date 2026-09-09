import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { FOCUS_AREAS } from "@/domains/home/constants/focusarea";
import Typography from "@/lib/Typography";

export default function FocusAreaSection() {
  return (
    <section className="w-full bg-[#FAF9F5]">
      <div className="w-full px-6 pt-6 lg:py-24 lg:px-10 2xl:px-40">
        <div className="mx-auto flex flex-col items-center text-center">
          <div className="mb-4 flex items-center gap-3">
            <span className="h-px w-8 bg-[#9739A8]" />
            <Typography variant="caption" className="font-bold font-figtree text-[#9739A8]">
              OUR FOCUS AREAS
            </Typography>
            <span className="h-px w-8 bg-[#9739A8]" />
          </div>
          <Typography variant="display-2xl" className="font-normal font-lora text-[#00191B]">
            Building Stronger Rural Communities
          </Typography>
          <Typography variant="body-lg" className="mt-3 leading-relaxed text-[#5F6C6D] w-full lg:max-w-2xl font-normal font-figtree">
            Creating opportunities through education, healthcare, sustainable
            livelihoods, and community-led development.
          </Typography>
        </div>

        <div className="mt-12">
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

              {/* Reveal image - fixed size so all 4 rows match */}
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