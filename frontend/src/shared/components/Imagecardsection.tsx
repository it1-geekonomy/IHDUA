import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Typography from "@/lib/Typography";
import { ARROW_BOX,ARROW_ICON,CAPTION_MARGIN_TOP,GRID_GAP,HEADING_GROUP_GAP,SECTION_PADDING_X,SECTION_PADDING_Y,TEXT_COLUMN_GAP,THEMES,THEME_ORDER,
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
      <div className="relative aspect-[16/10] w-full overflow-hidden sm:aspect-[4/3]">
        <Image
          src={item.image}
          alt={item.imageAlt}
          fill
          sizes="(min-width: 1024px) 22vw, (min-width: 768px) 30vw, (min-width: 640px) 45vw, 100vw"
          className="object-cover object-center"
        />
      </div>

      <div className={`${CAPTION_MARGIN_TOP} flex items-center justify-between pl-6`}>
        <Typography
          variant="body-sm"
          className="min-w-0 font-figtree font-medium text-[#00191B]"
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

  // Same card styling as the original. self-start keeps every card at its
  // natural height (no stretching to the row height).
  const cardClass = `group block min-w-0 self-start border p-2 ${theme.card}`;

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
      {/* Below lg: text on top, then the cards in their own grid.
          lg and up: 4 equal columns. Text spans columns 1-2, the first 2 cards
          sit in columns 3-4, extra cards continue 4 per row, all the same size. */}
      <div
        className={`grid w-full grid-cols-1 lg:grid-cols-4 lg:items-start xl:items-center ${GRID_GAP}`}
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
              className="font-lora leading-[1.2] text-[18px] text-[#00191B] sm:text-[21px] md:text-[25px] lg:text-[28px] xl:text-[41px]"
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

          <Typography variant="body-lg" className="font-figtree text-[#5F6C6D]">
            {description}
          </Typography>
        </div>

        {/* Below lg: own grid, 1 column (under 640px), 2 columns (640px+),
            3 columns (768px+), full width at 768px+.
            From lg: "contents", so each card is a cell of the 4-column grid. */}
        <div
          className={`mx-auto grid w-full min-w-0 max-w-[22rem] grid-cols-1 sm:max-w-xl sm:grid-cols-2 md:max-w-none md:grid-cols-3 lg:contents ${GRID_GAP}`}
        >
          {items.map((item, i) => (
            <ImageCard key={`${item.title}-${i}`} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}