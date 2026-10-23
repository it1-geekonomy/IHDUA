import { Fragment } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Typography from "@/lib/Typography";
import {
  type CardTheme,
} from "@/shared/constants/imagecard";

export interface ImageCardItem {
  image: string;
  imageAlt: string;
  title: string;
  href?: string;
  theme?: CardTheme;
}

interface ImageCardsSectionProps {
  label: string;
  heading: string | string[];
  description: string;
  items: ImageCardItem[];
  className?: string;
}

const CARD_THEMES: Record<CardTheme, { card: string; arrow: string }> = {
  purple: {
    card: "border-[#EBDFF8] bg-gradient-to-b from-white via-[#FCFAFE] to-[#F5EEFA]",
    arrow: "bg-[#9739A8]",
  },
  amber: {
    card: "border-[#FCECCE] bg-gradient-to-b from-white via-[#FFFDF9] to-[#FEF5E7]",
    arrow: "bg-[#D8A742]",
  },
};

function SectionLabel({ children }: { children: string }) {
  return (
    <div className="flex items-center justify-start gap-3">
      <span className="h-px w-8 bg-[#9739A8]" aria-hidden="true" />
      <Typography
        variant="caption"
        className="font-bold font-figtree uppercase tracking-wider text-[#9739A8] text-left"
      >
        {children}
      </Typography>
      <span className="h-px w-8 bg-[#9739A8]" aria-hidden="true" />
    </div>
  );
}

function ImageCard({ item, index }: { item: ImageCardItem; index: number }) {
  const theme = item.theme
    ? CARD_THEMES[item.theme]
    : index % 2 === 0
      ? CARD_THEMES.purple
      : CARD_THEMES.amber;

  const content = (
    <>
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-100">
        <Image
          src={item.image}
          alt={item.imageAlt}
          fill
          sizes="(min-width: 1280px) 28vw, (min-width: 1024px) 32vw, (min-width: 640px) 45vw, 100vw"
          className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      <div className="flex items-center justify-between p-3.5 sm:p-4">
        <Typography
          variant="body-sm"
          className="min-w-0 font-figtree font-medium text-[#00191B] text-left leading-snug"
        >
          {item.title}
        </Typography>
        <span
          className={`flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-md text-white transition-transform group-hover:scale-105 ${theme.arrow}`}
        >
          <ArrowUpRight
            className="h-4 w-4 sm:h-5 sm:w-5 text-white"
            strokeWidth={2.4}
            aria-hidden="true"
          />
        </span>
      </div>
    </>
  );

  const cardClass = `group block overflow-hidden rounded-none border shadow-xs transition-shadow hover:shadow-md ${theme.card}`;

  return item.href ? (
    <Link href={item.href} className={cardClass}>
      {content}
    </Link>
  ) : (
    <div className={cardClass}>{content}</div>
  );
}

export default function ImageCardsSection({
  label,
  heading,
  description,
  items,
  className = "",
}: ImageCardsSectionProps) {
  const headingLines = Array.isArray(heading) ? heading : [heading];

  return (
    <section className={`w-full bg-[#FFFFFF] py-10 lg:py-16 ${className}`}>
      <div className="w-full max-w-[90rem] 2xl:max-w-[97.5rem] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex w-full flex-col lg:flex-row lg:items-start xl:items-center justify-between gap-8 lg:gap-8 xl:gap-14">
          {/* Left Text Column */}
          <div className="flex min-w-0 flex-col lg:w-[45%] xl:w-[38%] lg:shrink-0 gap-4 sm:gap-5">
            <SectionLabel>{label}</SectionLabel>

            <Typography
              variant="h2"
              className="font-lora font-normal text-[#00191B] text-left leading-[1.2]"
            >
              {Array.isArray(heading) ? (
                heading.map((line, i) => (
                  <Fragment key={`${line}-${i}`}>
                    {i > 0 && <br />}
                    {line}
                  </Fragment>
                ))
              ) : (
                heading
              )}
            </Typography>

            <Typography
              variant="body-lg"
              className="font-figtree font-normal text-[#5F6C6D] text-left leading-relaxed"
            >
              {description}
            </Typography>
          </div>

          {/* Right School Cards Grid */}
          <div className="grid w-full grid-cols-1 sm:grid-cols-2 lg:flex-1 gap-5 sm:gap-6">
            {items.map((item, i) => (
              <ImageCard key={`${item.title}-${i}`} item={item} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}