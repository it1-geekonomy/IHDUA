import Image from "next/image";

export default function GeographicFootprint() {
  return (
    <section className="max-w-[1180px] mx-auto px-6 py-16 sm:py-20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">

        {/* Left: Map panel */}
        <div className="relative bg-[#F3F1EE] rounded-2xl p-6 min-h-[320px] md:min-h-[400px] flex items-center justify-center overflow-hidden">

          <div className="relative w-full max-w-[340px] mx-auto aspect-[340/380]">
            <Image
              src="/geographicfootprint/mapimg.png"
              alt="Map showing active districts of Mysore and Chamarajanagar"
              fill
              className="object-contain"
              sizes="(max-width: 768px) 90vw, 340px"
            />
          </div>
        </div>

        {/* Right: Content */}
        <div className="flex flex-col">
          <div className="flex items-center gap-3 mb-5">
            <span className="h-px w-7 bg-[#9739A8] shrink-0" />
            <span className="text-xs font-bold tracking-wider text-[#9739A8] whitespace-nowrap">
              GEOGRAPHIC FOOTPRINT
            </span>
            <span className="h-px flex-1 max-w-[60px] bg-[#9739A8]" />
          </div>

          <h2 className="font-serif text-[26px] sm:text-3xl md:text-[36px] leading-tight text-[#00191B] mb-5">
            Rooted in communities. Creating change where it matters.
          </h2>

          <p className="text-sm sm:text-[15px] leading-relaxed text-[#5F6C6D] mb-8 max-w-[480px]">
            Our physical headquarters are established directly in rural Mysore,
            allowing our coordinators to live as neighbors beside the families
            we serve.
          </p>

          <div className="flex flex-col">
            <div className="flex items-center justify-between py-4 border-b border-[#E3ECEC]">
              <span className="text-sm sm:text-[15px] font-semibold text-[#1E2627]">
                Mysore Villages
              </span>
              <span className="text-sm sm:text-[15px] font-bold text-[#9739A8]">
                34 Villages
              </span>
            </div>
            <div className="flex items-center justify-between py-4 border-b border-[#E3ECEC]">
              <span className="text-sm sm:text-[15px] font-semibold text-[#1E2627]">
                Chamarajanagar Villages
              </span>
              <span className="text-sm sm:text-[15px] font-bold text-[#9739A8]">
                25 Villages
              </span>
            </div>
          </div>

          <a
            href="#"
            className="inline-flex items-center gap-2 mt-8 px-6 py-3.5 rounded-md bg-[#FFD638] text-[#212121] text-sm font-bold self-start transition-transform hover:-translate-y-0.5"
          >
            Learn About Regional Partnerships
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-4 h-4 shrink-0"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </a>
        </div>

      </div>
    </section>
  );
}