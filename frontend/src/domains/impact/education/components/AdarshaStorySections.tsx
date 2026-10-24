import Image from "next/image";
import Typography from "@/lib/Typography";
import { ADARSHA_STORIES } from "../constants/adarshaSchool";

export default function AdarshaStorySections() {
  const { story2 } = ADARSHA_STORIES;

  return (
    <>

      {/* Story 2: Learning in the Heart of the Community (Lavender/purple background #F3EEF9) */}
      <section className="w-full bg-[#F3EEF9] mt-8 sm:mt-12 lg:mt-16 py-8 lg:py-12">
        <div className="w-full px-[clamp(1rem,-1.0769rem_+_9.2308vw,10rem)]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Image: Landscape Campus Overlooking KRS Reservoir */}
            <div className="order-2 lg:order-1 lg:col-span-5 xl:col-span-5 relative w-full max-w-md sm:max-w-lg lg:max-w-none mx-auto aspect-[16/9] max-h-64 sm:max-h-72 lg:max-h-72 overflow-hidden rounded-md shadow-sm">
              <Image
                src={story2.image}
                alt={story2.imageAlt}
                fill
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover"
              />
            </div>

            {/* Right Content */}
            <div className="order-1 lg:order-2 lg:col-span-7 xl:col-span-7 flex flex-col items-start">
              <Typography
                variant="h2"
                className="font-lora font-normal text-[#00191B] text-left leading-tight mb-4"
              >
                {story2.title}
              </Typography>

              <div className="flex flex-col gap-3.5">
                {story2.paragraphs.map((p, idx) => (
                  <Typography
                    key={idx}
                    variant="body-lg"
                    className="font-figtree font-normal text-[#5F6C6D] text-left leading-relaxed"
                  >
                    {p}
                  </Typography>
                ))}
              </div>

              {/* Highlight Feature: A Rural Learning Environment */}
              <div className="mt-6 flex items-center gap-4 sm:gap-5 w-full">
                <div className="flex h-14 w-14 sm:h-16 sm:w-16 shrink-0 items-center justify-center rounded-full bg-[#E6DAF5]">
                  <Image
                    src={story2.featureCard.icon}
                    alt={story2.featureCard.title}
                    width={36}
                    height={36}
                    className="h-7 w-7 sm:h-8 sm:w-8 object-contain"
                  />
                </div>
                <div className="flex flex-col min-w-0">
                  <Typography
                    variant="body-lg"
                    className="font-figtree font-bold text-[#734E9F] text-left leading-snug"
                  >
                    {story2.featureCard.title}
                  </Typography>
                  <Typography
                    variant="body-lg"
                    className="font-figtree font-normal text-[#5F6C6D] text-left mt-1 leading-relaxed"
                  >
                    {story2.featureCard.description}
                  </Typography>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
