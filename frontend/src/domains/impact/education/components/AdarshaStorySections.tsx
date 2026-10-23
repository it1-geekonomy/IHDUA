import Image from "next/image";
import Link from "next/link";
import Typography from "@/lib/Typography";
import { ADARSHA_STORIES } from "../constants/adarshaSchool";

export default function AdarshaStorySections() {
  const { story1, story2 } = ADARSHA_STORIES;

  return (
    <>
      {/* Story 1: Education in a Rural Setting (White background) */}
      <section className="w-full bg-[#FFFFFF] py-12 lg:py-16">
        <div className="w-full max-w-[90rem] 2xl:max-w-[97.5rem] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
            {/* Left Column: Text + View Photos Button */}
            <div className="lg:col-span-7 flex flex-col items-start">
              <div className="border-l-4 border-[#FFD638] pl-3.5 sm:pl-4 mb-4">
                <Typography
                  variant="h2"
                  className="font-lora font-normal text-[#00191B] text-left leading-tight"
                >
                  {story1.title}
                </Typography>
              </div>

              <div className="flex flex-col gap-4 mt-2">
                {story1.paragraphs.map((p, idx) => (
                  <Typography
                    key={idx}
                    variant="body-lg"
                    className="font-figtree font-normal text-[#5F6C6D] text-left leading-relaxed"
                  >
                    {p}
                  </Typography>
                ))}
              </div>

              <Link
                href={story1.galleryHref}
                className="group inline-flex items-center justify-center gap-2.5 h-10 lg:h-12 px-5 py-2.5 mt-6 bg-[#FFD638] hover:bg-[#F2C92C] text-black transition-colors w-full sm:w-auto"
              >
                <Typography
                  variant="caption"
                  className="font-figtree font-medium text-black text-left"
                >
                  {story1.ctaText}
                </Typography>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  aria-hidden="true"
                >
                  <line x1="7" y1="17" x2="17" y2="7" />
                  <polyline points="7 7 17 7 17 17" />
                </svg>
              </Link>
            </div>

            {/* Right Column: Image */}
            <div className="lg:col-span-5 relative w-full aspect-[4/3] overflow-hidden rounded-md shadow-sm">
              <Image
                src={story1.image}
                alt={story1.imageAlt}
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Story 2: Learning in the Heart of the Community (Light lavender/purple background) */}
      <section className="w-full bg-[#FAF5FB] py-12 lg:py-20">
        <div className="w-full max-w-[90rem] 2xl:max-w-[97.5rem] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
            {/* Left Image: Landscape Campus Overlooking KRS Reservoir */}
            <div className="order-2 lg:order-1 lg:col-span-6 relative w-full aspect-[4/3] overflow-hidden rounded-md shadow-sm">
              <Image
                src={story2.image}
                alt={story2.imageAlt}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>

            {/* Right Content */}
            <div className="order-1 lg:order-2 lg:col-span-6 flex flex-col items-start">
              <Typography
                variant="h2"
                className="font-lora font-normal text-[#00191B] text-left leading-tight mb-4"
              >
                {story2.title}
              </Typography>

              <div className="flex flex-col gap-4">
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

              {/* Highlight Feature: A Rural Learning Environment (Seamless on section background matching Figma) */}
              <div className="mt-8 flex items-start gap-4 sm:gap-5 w-full">
                <div className="flex h-12 w-12 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-full bg-[#E8DDF2]">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#9739A8"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-6 h-6 sm:w-7 sm:h-7"
                    aria-hidden="true"
                  >
                    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
                    <path d="M6 6h10" />
                    <path d="M6 10h10" />
                  </svg>
                </div>
                <div className="flex flex-col min-w-0">
                  <Typography
                    variant="h4"
                    className="font-figtree font-semibold text-[#9739A8] text-left leading-snug"
                  >
                    {story2.featureCard.title}
                  </Typography>
                  <Typography
                    variant="body-sm"
                    className="font-figtree font-normal text-[#5F6C6D] text-left mt-1.5 leading-relaxed"
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
