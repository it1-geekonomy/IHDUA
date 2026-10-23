import Image from "next/image";
import Typography from "@/lib/Typography";

function BannerTitle({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-col justify-center ${className}`}>
      <Typography
        variant="h2"
        className="font-lora font-normal text-left leading-[1.15]"
      >
        <span className="text-[#B28838]">Education Transforms </span>
        <span className="text-[#501950]">Communities</span>
      </Typography>
    </div>
  );
}

function PillarIcons({ isMobile = false }: { isMobile?: boolean }) {
  return (
    <div
      className={`flex items-center ${
        isMobile
          ? "justify-between w-full pt-1"
          : "justify-start gap-1.5 sm:gap-4 2xl:gap-6 xl:col-span-3 xl:justify-center xl:p-0"
      }`}
    >
      {/* Pillar 1: Learn Today */}
      <div className="flex flex-col items-center text-center px-0.5 sm:px-2">
        <div className="flex h-10 w-10 sm:h-10 sm:w-10 md:h-12 md:w-12 xl:h-14 xl:w-14 items-center justify-center rounded-full bg-[#F1E7F4] mb-1 sm:mb-2">
          <Image
            src="/Rural Education/fi_864685.png"
            alt="Learn Today"
            width={24}
            height={24}
            className="w-4 h-4 sm:w-4 sm:h-4 md:w-5 md:h-5 xl:w-6 xl:h-6 object-contain"
          />
        </div>
        <Typography
          variant="body-sm"
          className="font-figtree font-medium text-[#501950] text-center whitespace-nowrap"
        >
          Learn
          <br />
          Today
        </Typography>
      </div>

      {/* Divider */}
      <span className="h-8 sm:h-10 w-px bg-[#E8DDD0]" aria-hidden="true" />

      {/* Pillar 2: Grow Together */}
      <div className="flex flex-col items-center text-center px-0.5 sm:px-2">
        <div className="flex h-10 w-10 sm:h-10 sm:w-10 md:h-12 md:w-12 xl:h-14 xl:w-14 items-center justify-center rounded-full bg-[#FEF3DD] mb-1 sm:mb-2">
          <Image
            src="/Rural Education/fi_16924039.png"
            alt="Grow Together"
            width={24}
            height={24}
            className="w-4 h-4 sm:w-4 sm:h-4 md:w-5 md:h-5 xl:w-6 xl:h-6 object-contain"
          />
        </div>
        <Typography
          variant="body-sm"
          className="font-figtree font-medium text-[#501950] text-center whitespace-nowrap"
        >
          Grow
          <br />
          Together
        </Typography>
      </div>

      {/* Divider */}
      <span className="h-8 sm:h-10 w-px bg-[#E8DDD0]" aria-hidden="true" />

      {/* Pillar 3: Brighter Tomorrow */}
      <div className="flex flex-col items-center text-center px-0.5 sm:px-2">
        <div className="flex h-10 w-10 sm:h-10 sm:w-10 md:h-12 md:w-12 xl:h-14 xl:w-14 items-center justify-center rounded-full bg-[#F1E7F4] mb-1 sm:mb-2">
          <Image
            src="/Rural Education/fi_1490749.png"
            alt="Brighter Tomorrow"
            width={24}
            height={24}
            className="w-4 h-4 sm:w-4 sm:h-4 md:w-5 md:h-5 xl:w-6 xl:h-6 object-contain"
          />
        </div>
        <Typography
          variant="body-sm"
          className="font-figtree font-medium text-[#501950] text-center whitespace-nowrap"
        >
          Brighter
          <br />
          Tomorrow
        </Typography>
      </div>
    </div>
  );
}

export default function EducationTransformsBanner() {
  return (
    <section className="w-full bg-[#FFFFFF] py-6 lg:py-10">
      <div className="w-full max-w-[90rem] 2xl:max-w-[97.5rem] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-none bg-[#FEF7EF] min-h-[13rem] md:min-h-[14.5rem] xl:min-h-[16.3rem]">
          {/* Subtle warm golden ambient radial glow behind left text */}
          <div
            className="pointer-events-none absolute -left-16 -top-16 h-72 w-72 rounded-full bg-[#FFE8A3]/35 blur-3xl"
            aria-hidden="true"
          />

          {/* 1. Mobile Layout (< 640px): Natural vertical flow where everything breathes */}
          <div className="relative z-10 flex flex-col justify-between gap-4 p-5 sm:hidden">
            <BannerTitle />
            <div className="relative w-full aspect-[520/240] overflow-hidden">
              <Image
                src="/Rural Education/image 50.png"
                alt="Rural School Illustration"
                fill
                sizes="100vw"
                className="object-contain object-center"
                priority
              />
            </div>
            <PillarIcons isMobile />
          </div>

          {/* 2. Tablet & Desktop Layout (>= 640px): 2-Column on Tablet, 3-Column on Desktop */}
          <div className="relative z-10 hidden sm:flex sm:flex-row sm:items-stretch sm:justify-between xl:grid xl:grid-cols-12 w-full h-full min-h-[13rem] md:min-h-[14.5rem] xl:min-h-[16.3rem]">
            {/* Left Column on Tablet (Stacks Title UP and Pillars DOWN) */}
            <div className="flex flex-col justify-between gap-4 sm:gap-6 flex-1 min-w-0 p-6 md:p-8 xl:p-0 xl:contents">
              <BannerTitle className="xl:col-span-4 xl:py-0 xl:pl-10 2xl:pl-12" />
              <PillarIcons />
            </div>

            {/* Right School Illustration: 100% visible, zero cutting */}
            <div className="relative shrink-0 self-stretch min-h-[13rem] md:min-h-[14.5rem] xl:min-h-[16.3rem] w-[46%] md:w-[48%] xl:w-full xl:col-span-5 h-full">
              <Image
                src="/Rural Education/image 50.png"
                alt="Rural School Illustration"
                fill
                sizes="(min-width: 1536px) 520px, (min-width: 1280px) 510px, 48vw"
                className="object-contain object-right"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
