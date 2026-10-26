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
      <div className="w-full px-6 pt-6 lg:px-10 lg:pt-8 xl:pt-14 2xl:px-40">
        <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-12 lg:gap-12 xl:gap-16">
          {/* Left Image: stretches to match text + button height on desktop */}
          <div className="order-2 flex w-full lg:order-1 lg:col-span-5 self-stretch">
            <div className="relative w-full min-h-[300px] sm:min-h-[360px] lg:min-h-full overflow-hidden rounded-[2px] shadow-sm">
              <Image
                src={image}
                alt={imageAlt}
                fill
                sizes="(min-width: 1280px) 42vw, (min-width: 1024px) 45vw, 100vw"
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* Right Text */}
          <div className="order-1 flex w-full flex-col justify-between items-start lg:order-2 lg:col-span-7">
            <div>
              <Typography
                variant="h3"
                className="font-lora font-normal text-[#00191B] text-left leading-tight mb-4"
              >
                {heading}
              </Typography>

              <div className="flex flex-col gap-3 lg:gap-4">
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
