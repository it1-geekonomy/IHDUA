import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Typography from "@/lib/Typography";
import {
  ARROW_BOX,
  ARROW_ICON,
  CAPTION_MARGIN_TOP,
  GRID_GAP,
  HEADING_GROUP_GAP,
  SECTION_PADDING_X,
  SECTION_PADDING_Y,
  TEXT_COLUMN_GAP,
  THEMES,
  THEME_ORDER,
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

function SectionLabel({ children }: { children: string }) {
  return (
    <div className="flex items-center justify-center gap-3 lg:justify-start">
      <span className="h-px w-8 bg-[#9739A8]" aria-hidden="true" />
      <Typography
        variant="caption"
        className="font-bold font-figtree uppercase text-[#9739A8]"
      >
        {children}
      </Typography>
      <span className="h-px w-8 bg-[#9739A8]" aria-hidden="true" />
    </div>
  );
}

function ImageCard({ item, index }: { item: ImageCardItem; index: number }) {
  const theme = THEMES[item.theme ?? THEME_ORDER[index % THEME_ORDER.length]];

  const content = (
    <>
      <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden sm:aspect-[4/3]">
        <Image
          src={item.image}
          alt={item.imageAlt}
          fill
          sizes="(min-width: 80rem) 22vw, (min-width: 64rem) 25vw, (min-width: 48rem) 40vw, 100vw"
          className="object-cover object-center"
        />
      </div>

      <div
        className={`${CAPTION_MARGIN_TOP} flex min-h-[44px] items-center justify-between gap-2 pl-3 pr-1 sm:pl-4 sm:pr-1.5`}
      >
        <Typography
          variant="body-sm"
          className="min-w-0 flex-1 font-figtree font-medium leading-snug text-[#00191B]"
        >
          {item.title}
        </Typography>
        <span
          className={`flex shrink-0 items-center justify-center rounded-md transition-transform group-hover:scale-105 ${ARROW_BOX} ${theme.arrow}`}
        >
          <ArrowUpRight
            className={`text-white ${ARROW_ICON}`}
            strokeWidth={2.2}
            aria-hidden="true"
          />
        </span>
      </div>
    </>
  );

  const cardClass = `group flex flex-col justify-between min-w-0 border p-2 ${theme.card}`;

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
    <section
      className={`w-full ${SECTION_PADDING_X} ${SECTION_PADDING_Y} ${className}`}
    >
      <div
        className={`grid w-full grid-cols-1 lg:grid-cols-4 lg:items-start lg:!gap-y-8 xl:items-center xl:!gap-y-10 ${GRID_GAP}`}
      >
        <div
          className={`flex min-w-0 flex-col pb-4 lg:col-span-2 lg:pb-0 lg:pr-6 ${TEXT_COLUMN_GAP}`}
        >
          <div
            className={`flex flex-col items-center text-center lg:items-start lg:text-left ${HEADING_GROUP_GAP}`}
          >
            <SectionLabel>{label}</SectionLabel>

            <Typography
              variant="h2"
              className="font-lora leading-[1.2] text-[#00191B]"
            >
              {headingLines.map((line, i) => (
                <span key={`${line}-${i}`}>
                  {i > 0 && <br className="hidden xl:block" />}
                  {i > 0 && <span className="xl:hidden"> </span>}
                  {line}
                </span>
              ))}
            </Typography>
          </div>

          <Typography
            variant="body-lg"
            className="text-center font-figtree text-[#5F6C6D] lg:text-left"
          >
            {description}
          </Typography>
        </div>

        {/* Cards */}
        {items.length <= 2 ? (
          <div
            className={`mx-auto grid w-full min-w-0 max-w-[22rem] grid-cols-1 sm:max-w-xl sm:grid-cols-2 lg:col-span-2 lg:max-w-none ${GRID_GAP}`}
          >
            {items.map((item, i) => (
              <ImageCard key={`${item.title}-${i}`} item={item} index={i} />
            ))}
          </div>
        ) : (
          <div
            className={`mx-auto grid w-full min-w-0 max-w-[22rem] grid-cols-1 sm:max-w-xl sm:grid-cols-2 md:max-w-none md:grid-cols-3 lg:contents ${GRID_GAP}`}
          >
            {items.map((item, i) => (
              <ImageCard key={`${item.title}-${i}`} item={item} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}