"use client";

import {
  TouchEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
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
import { fetchImpactCategoryCards } from "@/shared/lib/impactApi";

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
  categorySlug?: string;
}

/* ------------------------------------------------------------------ */
/* Responsive modes                                                    */
/*   desktop (>= 1024px): 2 beside the text + 4 below  -> 6 per page   */
/*   tablet  (640-1023px): 2 x 2 grid                  -> 4 per page   */
/*   mobile  (< 640px):    1 card, swipe 1 at a time   -> 1 per page   */
/* ------------------------------------------------------------------ */
type Mode = "desktop" | "tablet" | "mobile";

const PAGE_SIZE: Record<Mode, number> = { desktop: 6, tablet: 4, mobile: 1 };
const DESKTOP_TOP_COUNT = 2;
const SWIPE_THRESHOLD = 50;

function subscribeMode(callback: () => void) {
  const queries = [
    window.matchMedia("(min-width: 1024px)"),
    window.matchMedia("(min-width: 640px)"),
  ];
  queries.forEach((q) => q.addEventListener("change", callback));
  return () =>
    queries.forEach((q) => q.removeEventListener("change", callback));
}

function getMode(): Mode {
  if (window.matchMedia("(min-width: 1024px)").matches) return "desktop";
  if (window.matchMedia("(min-width: 640px)").matches) return "tablet";
  return "mobile";
}

function useMode(): Mode {
  return useSyncExternalStore<Mode>(subscribeMode, getMode, () => "desktop");
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
  const fallbackImg =
    index % 2 === 0
      ? "/Rural Education/Rectangle 44.png"
      : "/Rural Education/Rectangle 44 (1).png";
  const imageSrc =
    item.image && item.image.trim() !== "" ? item.image : fallbackImg;

  const content = (
    <>
      <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden sm:aspect-[4/3] bg-neutral-100">
        <Image
          src={imageSrc}
          alt={item.imageAlt || item.title}
          fill
          sizes="(min-width: 80rem) 22vw, (min-width: 64rem) 25vw, (min-width: 40rem) 45vw, 100vw"
          className="object-cover object-center"
          draggable={false}
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

  const cardClass = `group flex h-full flex-col justify-between min-w-0 border p-2 ${theme.card}`;

  return item.href ? (
    <Link href={item.href} className={cardClass} draggable={false}>
      {content}
    </Link>
  ) : (
    <div className={cardClass}>{content}</div>
  );
}

function Pagination({
  count,
  current,
  onSelect,
}: {
  count: number;
  current: number;
  onSelect: (index: number) => void;
}) {
  const arrowClass =
    "flex size-6 items-center justify-center rounded-full border lg:size-8 border-[#9739A8]/25 bg-[#FAF5FA] text-[#9739A8] transition-colors hover:bg-[#9739A8] hover:text-white disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:bg-[#FAF5FA] disabled:hover:text-[#9739A8] cursor-pointer";

  return (
    <nav
      aria-label="Card pages"
      className="flex items-center justify-center gap-2 lg:col-span-4 lg:gap-3"
    >
      <button
        type="button"
        onClick={() => onSelect(current - 1)}
        disabled={current === 0}
        aria-label="Previous"
        className={arrowClass}
      >
        <ChevronLeft className="size-3.5 lg:size-4" strokeWidth={2.4} />
      </button>

      <button
        type="button"
        onClick={() => onSelect(current + 1)}
        disabled={current === count - 1}
        aria-label="Next"
        className={arrowClass}
      >
        <ChevronRight className="size-3.5 lg:size-4" strokeWidth={2.4} />
      </button>
    </nav>
  );
}

export default function ImageCardsSection({
  label,
  heading,
  description,
  items = [],
  className = "",
  categorySlug,
}: ImageCardsSectionProps) {
  const [cards, setCards] = useState<ImageCardItem[]>(items);
  // Index of the first visible card; keeps position when the screen resizes
  const [start, setStart] = useState(0);
  const directionRef = useRef(1);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const mode = useMode();

  useEffect(() => {
    setCards(items);
  }, [items]);

  useEffect(() => {
    if (!categorySlug) return;
    let isMounted = true;

    fetchImpactCategoryCards(categorySlug)
      .then((apiCards) => {
        if (!isMounted) return;
        if (apiCards && Array.isArray(apiCards) && apiCards.length > 0) {
          const dynamicItems: ImageCardItem[] = apiCards.map((card, idx) => ({
            title: card.title || card.name,
            image: card.imageUrl || "",
            imageAlt: card.title || card.name,
            href: card.slug.startsWith("/") ? card.slug : `/${card.slug}`,
            theme: (idx % 2 === 0 ? "purple" : "amber") as CardTheme,
          }));
          setCards(dynamicItems);
        } else {
          setCards([]);
        }
      })
      .catch(() => {
        if (isMounted) setCards([]);
      });

    return () => {
      isMounted = false;
    };
  }, [categorySlug]);

  const pageSize = PAGE_SIZE[mode];
  const pageCount = Math.max(1, Math.ceil(cards.length / pageSize));
  const page = Math.min(Math.floor(start / pageSize), pageCount - 1);
  const pageStart = page * pageSize;

  // If the card list shrinks, go back to the beginning
  useEffect(() => {
    if (cards.length > 0 && start >= cards.length) setStart(0);
  }, [cards.length, start]);

  const goTo = useCallback(
    (nextPage: number) => {
      if (nextPage < 0 || nextPage > pageCount - 1 || nextPage === page) return;
      directionRef.current = nextPage > page ? 1 : -1;
      setStart(nextPage * pageSize);
    },
    [page, pageCount, pageSize],
  );

  // After an arrow click, bring the section start back into view so the user
  // sees the new cards from the beginning (only if they scrolled past it).
  const onArrowSelect = useCallback(
    (nextPage: number) => {
      goTo(nextPage);
      requestAnimationFrame(() => {
        // Desktop: section start. Tablet/mobile: start of the cards.
        const target = mode === "desktop" ? sectionRef.current : cardsRef.current;
        if (!target) return;
        if (target.getBoundingClientRect().top < 80) {
          // Instant jump (no smooth animation), even if CSS sets scroll-behavior: smooth
          target.scrollIntoView({
            behavior: "instant" as ScrollBehavior,
            block: "start",
          });
        }
      });
    },
    [goTo, mode],
  );

  // Swipe: one page per swipe (on mobile a page is exactly 1 card)
  const onTouchStart = (e: TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };
  const onTouchEnd = (e: TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    touchStartX.current = null;
    touchStartY.current = null;
    // Ignore small moves and mostly-vertical scrolls
    if (Math.abs(dx) < SWIPE_THRESHOLD || Math.abs(dx) < Math.abs(dy)) return;
    goTo(page + (dx < 0 ? 1 : -1));
  };

  const swipeProps = pageCount > 1 ? { onTouchStart, onTouchEnd } : undefined;

  const pageCards = cards.slice(pageStart, pageStart + pageSize);

  const slideInitial = {
    opacity: 0,
    x: reduceMotion ? 0 : directionRef.current * 28,
  };
  const slideAnimate = { opacity: 1, x: 0 };
  const slideTransition = { duration: 0.35, ease: "easeOut" as const };

  const headingLines = Array.isArray(heading) ? heading : [heading];

  return (
    <section
      ref={sectionRef}
      className={`w-full scroll-mt-20 ${SECTION_PADDING_X} ${SECTION_PADDING_Y} ${className}`}
    >
      <div
        className={`grid w-full grid-cols-1 lg:grid-cols-4 lg:items-start lg:!gap-y-8 xl:items-center xl:!gap-y-10 ${GRID_GAP}`}
      >
        {/* Text column */}
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
            className="font-figtree font-normal text-[#5F6C6D] text-center lg:text-left"
          >
            {description}
          </Typography>
        </div>

        {/* DESKTOP: 2 beside the text, 4 in the row below */}
        {mode === "desktop" && (
          <>
            {pageCards.slice(0, DESKTOP_TOP_COUNT).length > 0 && (
              <motion.div
                key={`top-${page}`}
                initial={slideInitial}
                animate={slideAnimate}
                transition={slideTransition}
                {...swipeProps}
                className="grid min-w-0 touch-pan-y grid-cols-2 gap-6 lg:col-span-2"
              >
                {pageCards.slice(0, DESKTOP_TOP_COUNT).map((item, i) => (
                  <ImageCard
                    key={item.href || `top-${i}`}
                    item={item}
                    index={pageStart + i}
                  />
                ))}
              </motion.div>
            )}

            {pageCards.slice(DESKTOP_TOP_COUNT).length > 0 && (
              <motion.div
                key={`bottom-${page}`}
                initial={slideInitial}
                animate={slideAnimate}
                transition={{ ...slideTransition, delay: 0.05 }}
                {...swipeProps}
                className="grid min-w-0 touch-pan-y grid-cols-4 gap-6 lg:col-span-4"
              >
                {pageCards.slice(DESKTOP_TOP_COUNT).map((item, i) => (
                  <ImageCard
                    key={item.href || `bottom-${i}`}
                    item={item}
                    index={pageStart + DESKTOP_TOP_COUNT + i}
                  />
                ))}
              </motion.div>
            )}
          </>
        )}

        {/* TABLET (640-1023px): 2 x 2 grid, rest in carousel */}
        {mode === "tablet" && pageCards.length > 0 && (
          <motion.div
            key={`tablet-${page}`}
            ref={cardsRef}
            initial={slideInitial}
            animate={slideAnimate}
            transition={slideTransition}
            {...swipeProps}
            className="grid min-w-0 scroll-mt-20 touch-pan-y grid-cols-2 gap-6"
          >
            {pageCards.map((item, i) => (
              <ImageCard
                key={item.href || `tablet-${i}`}
                item={item}
                index={pageStart + i}
              />
            ))}
          </motion.div>
        )}

        {/* MOBILE (<640px): 1 card at a time, swipe moves exactly 1 card */}
        {mode === "mobile" && pageCards.length > 0 && (
          <motion.div
            key={`mobile-${page}`}
            ref={cardsRef}
            initial={slideInitial}
            animate={slideAnimate}
            transition={slideTransition}
            {...swipeProps}
            className="grid min-w-0 scroll-mt-20 touch-pan-y grid-cols-1"
          >
            {pageCards.map((item, i) => (
              <ImageCard
                key={item.href || `mobile-${i}`}
                item={item}
                index={pageStart + i}
              />
            ))}
          </motion.div>
        )}

        {/* Prev / next arrows */}
        {pageCount > 1 && (
          <Pagination count={pageCount} current={page} onSelect={onArrowSelect} />
        )}
      </div>
    </section>
  );
}