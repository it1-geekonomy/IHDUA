"use client";

import Image from "next/image";
import Link from "next/link";
import Typography from "@/lib/Typography";

export interface StoryLeftImageProps {
  heading: string;
  descriptions: readonly string[] | string[];
  image: string;
  imageAlt?: string;
  button?: {
    label: string;
    href: string;
    external?: boolean;
  };
}

export default function StoryLeftImageSection({
  heading,
  descriptions,
  image,
  imageAlt = "",
  button,
}: StoryLeftImageProps) {
  return (
    <section className="w-full bg-white">
      <div className="w-full px-6 pt-10 lg:px-10 lg:pt-16 xl:pt-20 2xl:px-40">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-14">
          {/* Left Image: 5 columns, perfectly matching Story 1 image */}
          <div className="order-2 flex w-full lg:order-1 lg:col-span-5">
            <div className="relative w-full max-w-lg sm:max-w-xl lg:max-w-none mx-auto aspect-[16/10] sm:aspect-[16/9] lg:aspect-[4/3] overflow-hidden rounded-md shadow-sm">
              <Image
                src={image}
                alt={imageAlt || heading}
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* Right Text: 7 columns, matching Story 1 text */}
          <div className="order-1 flex w-full flex-col items-start lg:order-2 lg:col-span-7">
            <Typography
              variant="h2"
              className="w-full font-lora font-normal text-[#00191B] text-left leading-tight mb-4"
            >
              {heading}
            </Typography>

            <div className="flex flex-col gap-4 mt-2">
              {descriptions.map((p, idx) => (
                <Typography
                  key={idx}
                  variant="body-lg"
                  className="font-figtree font-normal text-[#5F6C6D] text-left leading-relaxed"
                >
                  {p}
                </Typography>
              ))}
            </div>

            {button?.label && (
              <Link
                href={button.href}
                target={button.external ? "_blank" : undefined}
                rel={button.external ? "noopener noreferrer" : undefined}
                className="group mt-6 inline-flex w-fit items-center gap-1.5 self-start bg-[#FFD638] px-4 py-2 text-[#000000] transition-[filter] duration-200 hover:brightness-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:gap-2 sm:px-5 sm:py-2.5"
              >
                <Typography
                  variant="body-sm"
                  className="m-0 font-figtree font-normal text-[#000000]"
                >
                  {button.label}
                </Typography>
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4"
                >
                  <path d="M7 17 17 7M8 7h9v9" />
                </svg>
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
