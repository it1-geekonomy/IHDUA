import Image from "next/image";
import Typography from "@/lib/Typography";

export default function GeographicFootprint() {
  return (
    <section className="w-full bg-white">
      <div className="w-full px-6 pt-6 pb-6 lg:py-24 lg:px-10 2xl:px-40">
        <div className="grid grid-cols-1 items-stretch gap-10 lg:grid-cols-2 lg:gap-6 xl:gap-16">

          {/* Left: Map image */}
          <div className="order-2 relative w-full max-w-md mx-auto lg:order-1 lg:max-w-none lg:mx-0 lg:h-full">
            {/* Below lg: natural aspect ratio */}
            <div className="relative w-full overflow-hidden rounded-md bg-[#F3F1EC] lg:hidden">
              <Image
                src="/geographicfootprint/map1.png"
                alt="Map showing active districts of Mysore and Chamarajanagar"
                width={800}
                height={900}
                className="h-auto w-full object-contain object-center"
                sizes="90vw"
                priority={false}
              />
            </div>

            {/*
              lg+
            
            */}
            <div className="relative hidden h-full min-h-[420px] w-full overflow-hidden rounded-md bg-[#F3F1EC] lg:block">
              <Image
                src="/geographicfootprint/map1.png"
                alt="Map showing active districts of Mysore and Chamarajanagar"
                fill
                className="object-contain object-center lg:scale-[1.35] 2xl:scale-[1.25]"
                sizes="(min-width: 1024px) 45vw, 100vw"
              />
            </div>

            {/* Active Districts card */}
            <div className="absolute left-2 top-2 z-10 rounded-sm border border-[#FFD638] bg-white px-2.5 py-2 shadow-sm sm:left-3 sm:top-3 lg:left-4 lg:top-4 lg:px-4 lg:py-3">
              <Typography variant="body-sm" className="font-bold font-figtree">
                Active Districts
              </Typography>
              <Typography variant="body-sm" className="mt-0.5 font-medium font-figtree text-[#5F6C6D] lg:mt-1">
                Mysore &amp; Chamarajanagar
              </Typography>
            </div>
          </div>

          {/* Right: Content */}
          <div className="order-1 flex flex-col lg:order-2">
            <div className="flex items-center gap-3">
              <span className="h-px w-6 bg-[#9739A8]" aria-hidden="true" />
              <Typography variant="caption" className="font-bold font-figtree text-[#9739A8]">
                GEOGRAPHIC FOOTPRINT
              </Typography>
              <span className="h-px w-6 bg-[#9739A8]" aria-hidden="true" />
            </div>

            <Typography
              variant="h1"
              className="mt-5 max-w-3xl lg:max-w-4xl leading-tight font-normal font-lora"
            >
              Rooted in communities. Creating change where it matters.
            </Typography>

            <Typography variant="body-lg" className="mt-5 leading-relaxed text-[#5F6C6D] font-normal font-figtree max-w-2xl">
              Our physical headquarters are established directly in rural Mysore,
              allowing our coordinators to live as neighbors beside the families
              we serve.
            </Typography>

            <div className="mt-8 lg:mt-16 flex flex-col">
              <div className="flex items-center justify-between py-4 border-b border-[#E3ECEC]">
                <Typography variant="body-lg" className="font-semibold font-figtree text-[#1E2627]">
                  Mysore Villages
                </Typography>
                <Typography variant="body-lg" className="font-semibold font-figtree text-[#9739A8]">
                  34 Villages
                </Typography>
              </div>
              <div className="flex items-center justify-between py-4 border-b border-[#E3ECEC]">
                <Typography variant="body-lg" className="font-semibold font-figtree text-[#1E2627]">
                  Chamarajanagar Villages
                </Typography>
                <Typography variant="body-lg" className="font-semibold font-figtree text-[#9739A8]">
                  25 Villages
                </Typography>
              </div>
            </div>
            <a href="#"
              className="mt-9 lg:mt-14 mx-auto flex w-fit items-center gap-2 rounded bg-[#FFD638] px-6 py-3 transition-opacity lg:mx-0"
            >
              <Typography variant="body-lg" className="font-medium font-figtree text-[#1E1E1E]">
                Learn About Regional Partnerships
              </Typography>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={3}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4 shrink-0"
                aria-hidden="true"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}