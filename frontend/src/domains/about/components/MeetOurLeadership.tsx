"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Typography from "@/lib/Typography";
import {
  useLeadershipMembers,
  type Leader,
} from "@/domains/about/hooks/useLeadershipMembers";
import {
  LEADERSHIP_HEADING,
  LEADERSHIP_LABEL,
  LEADERSHIP_QUOTE,
} from "@/domains/about/constants/meetourleadership";

/**
 * Layout rules
 * - Below 1024px: 2 cards visible. 3+ cards scroll sideways (swipe or arrows,
 *   one card at a time).
 * - 1024px and above: 4 columns. 1, 2 or 3 cards are centered. More than 4
 *   cards scroll sideways.
 * - The < > arrows (plain icons, no background) sit small at the left and
 *   right edges of the cards, vertically centered on the photo + designation
 *   block. They only appear when there are more cards than fit: more than 2
 *   below 1024px, more than 4 from 1024px up.
 * - Swipe / trackpad / mouse drag moves exactly one card per gesture.
 *
 * --gap is the space between cards; card widths are calculated from it.
 * Below 1024px the row is exactly 2 cards + 1 gap wide, so the arrows sit
 * snug against the first and last visible card on both sides.
 */
const ROW_WRAP =
  "mx-auto mt-[clamp(24px,4vw,64px)] w-full max-w-[calc(341px*2+var(--gap))] lg:max-w-[calc(341px*4+var(--gap)*3)] [--gap:clamp(16px,6vw,96px)] lg:[--gap:24px] xl:[--gap:32px]";

/**
 * snap-mandatory + snap-always on the cards makes the row stop exactly on a
 * card. The first/last card's auto margins center the row when it fits and let
 * it scroll from the left edge when it doesn't.
 */
const ROW =
  "flex min-w-0 gap-[var(--gap)] overflow-x-auto overscroll-x-contain pb-1 snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden [&>:first-child]:ml-auto [&>:last-child]:mr-auto";

const CARD =
  "min-w-0 max-w-[341px] flex-none snap-start snap-always basis-[calc((100%_-_var(--gap))_/_2)] lg:basis-[calc((100%_-_3_*_var(--gap))_/_4)]";

// Minimum horizontal drag (px) that counts as a swipe
const SWIPE_THRESHOLD = 40;
// A wheel event after at least this much silence (ms) starts a new gesture
const WHEEL_GESTURE_GAP = 150;

function ArrowButton({
  direction,
  disabled,
  onClick,
}: {
  direction: "prev" | "next";
  disabled: boolean;
  onClick: () => void;
}) {
  // Sits just outside the card row, centered vertically on the cards.
  // On md screens (768px to 1023px) there is room, so a small gap is added
  // between the card edge and the arrow.
  const position =
    direction === "prev"
      ? "left-0 -translate-x-full md:-translate-x-[calc(100%+10px)] lg:-translate-x-full"
      : "right-0 translate-x-full md:translate-x-[calc(100%+10px)] lg:translate-x-full";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === "prev" ? "Previous leaders" : "Next leaders"}
      className={`absolute top-1/2 z-10 flex size-5 -translate-y-1/2 items-center justify-center bg-transparent text-[#684170] transition lg:size-6 ${position} ${
        disabled
          ? "cursor-not-allowed opacity-30"
          : "cursor-pointer active:scale-90"
      }`}
    >
      <svg
        className="size-4 stroke-[2.5] lg:size-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d={direction === "prev" ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"}
        />
      </svg>
    </button>
  );
}

function LeaderCard({ leader, index }: { leader: Leader; index: number }) {
  return (
    <article className={CARD}>
      {/* Photo with gradient: #FFFFFF 0% → #A14DB1 100% */}
      <div className="relative aspect-[341/317] w-full overflow-hidden bg-gradient-to-b from-[#FFFFFF] from-0% to-[#A14DB1] to-100%">
        {leader.image && (
          <Image
            src={leader.image}
            alt={leader.name}
            fill
            sizes="(min-width: 1024px) 341px, 45vw"
            className="object-cover object-top"
            priority={index < 4}
          />
        )}
      </div>

      {/* Name + designation card */}
      <div className="mt-[clamp(6px,0.8vw,10px)] bg-[#FDF4FF] px-[clamp(8px,1.2vw,16px)] py-[clamp(8px,1.2vw,16px)]">
        <Typography
          variant="body-lg"
          className="font-figtree font-bold text-[length:clamp(13px,1.4vw,18px)] leading-[1.4] text-[#684170]"
        >
          {leader.name}
        </Typography>
        {leader.designation && (
          <Typography
            variant="body-lg"
            className="font-figtree font-normal text-[length:clamp(11px,1.1vw,14px)] leading-[1.5] text-[#88698E]/[0.79]"
          >
            {leader.designation}
          </Typography>
        )}
      </div>
    </article>
  );
}

function LeaderRow({ leaders }: { leaders: Leader[] }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  // How many cards fit on screen: 2 below 1024px, 4 from 1024px up
  const [visibleCount, setVisibleCount] = useState(2);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const pointerStart = useRef<{ x: number; y: number } | null>(null);
  const lastWheelTime = useRef(0);

  // Arrows only when there are more cards than fit
  const showArrows = leaders.length > visibleCount;

  const update = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  // Scroll by exactly one card (card width + gap)
  const scrollByCard = useCallback((dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const first = el.children[0] as HTMLElement | undefined;
    const second = el.children[1] as HTMLElement | undefined;
    const step =
      first && second
        ? second.offsetLeft - first.offsetLeft
        : (first?.offsetWidth ?? el.clientWidth);
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  }, []);

  // Track the breakpoint (lg = 1024px) to know how many cards are visible
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const apply = () => setVisibleCount(mq.matches ? 4 : 2);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  // Re-check on scroll, on resize (breakpoint changes) and when the list changes
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    update();
    el.addEventListener("scroll", update, { passive: true });
    const observer = new ResizeObserver(update);
    observer.observe(el);

    return () => {
      el.removeEventListener("scroll", update);
      observer.disconnect();
    };
  }, [update, leaders.length]);

  // Trackpad / horizontal mouse wheel: one card per gesture. Momentum events
  // that follow the first one are ignored until the wheel goes quiet.
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      // Let vertical scrolling pass through to the page
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;

      e.preventDefault();

      const now = performance.now();
      const isNewGesture = now - lastWheelTime.current > WHEEL_GESTURE_GAP;
      lastWheelTime.current = now;

      if (isNewGesture && Math.abs(e.deltaX) > 4) {
        scrollByCard(e.deltaX > 0 ? 1 : -1);
      }
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [scrollByCard, leaders.length]);

  // Touch / pen / mouse drag: one card per swipe
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    pointerStart.current = { x: e.clientX, y: e.clientY };
  };

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const start = pointerStart.current;
    pointerStart.current = null;
    if (!start) return;

    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;
    if (Math.abs(dx) >= SWIPE_THRESHOLD && Math.abs(dx) > Math.abs(dy)) {
      scrollByCard(dx < 0 ? 1 : -1);
    }
  };

  return (
    <div className={`${ROW_WRAP} relative`}>
      {/* touch-pan-y: vertical page scroll stays native, horizontal swipes are
          handled above so they always move exactly one card */}
      <div
        ref={scrollerRef}
        className={`${ROW} touch-pan-y`}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={() => {
          pointerStart.current = null;
        }}
        onDragStart={(e) => e.preventDefault()}
      >
        {leaders.map((leader, index) => (
          <LeaderCard key={leader.id} leader={leader} index={index} />
        ))}
      </div>

      {/* Arrows: small, at the left and right edges, centered on the cards */}
      {showArrows && (
        <>
          <ArrowButton
            direction="prev"
            disabled={!canPrev}
            onClick={() => scrollByCard(-1)}
          />
          <ArrowButton
            direction="next"
            disabled={!canNext}
            onClick={() => scrollByCard(1)}
          />
        </>
      )}
    </div>
  );
}

export default function MeetOurLeadership() {
  // null while loading; [] when nothing is published or the API failed
  const leaders = useLeadershipMembers();

  const loading = leaders === null;
  const nothingPublished = leaders !== null && leaders.length === 0;

  return (
    <section className="w-full px-6 pb-6 lg:px-10 lg:pb-8 xl:pb-14 2xl:px-40">
      {/* Label + heading */}
      <div className="flex flex-col items-center text-center">
        <div className="flex items-center gap-[clamp(8px,1vw,12px)]">
          <span className="h-px w-[clamp(20px,2.4vw,32px)] bg-[#9739A8]" />
          <Typography
            variant="caption"
            className="font-figtree font-bold uppercase text-[#9739A8]"
          >
            {LEADERSHIP_LABEL}
          </Typography>
          <span className="h-px w-[clamp(20px,2.4vw,32px)] bg-[#9739A8]" />
        </div>

        <Typography
          variant="h2"
          className="mt-[clamp(8px,1vw,12px)] font-lora font-light text-[#00191B]"
        >
          {LEADERSHIP_HEADING}
        </Typography>
      </div>

      {/* Loading skeleton: keeps the space so the page doesn't jump */}
      {loading && (
        <div aria-hidden className={ROW_WRAP}>
          <div className={ROW}>
            {[0, 1].map((i) => (
              <div key={i} className={CARD}>
                <div className="aspect-[341/317] w-full animate-pulse bg-neutral-100" />
                <div className="mt-[clamp(6px,0.8vw,10px)] h-16 w-full animate-pulse bg-neutral-100" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Loaded, but nothing is published in the CMS (or the API failed) */}
      {nothingPublished && (
        <div className="mx-auto mt-[clamp(24px,4vw,64px)] flex min-h-[14rem] w-full max-w-[calc(341px*2+96px)] items-center justify-center rounded-lg border border-dashed border-[#D9D4C4] bg-[#FAF9F5] px-6 py-10 text-center">
          <Typography
            variant="body-lg"
            className="max-w-xl font-figtree font-normal leading-relaxed text-[#5F6C6D]"
          >
            New leadership members and updates will be displayed here soon.
          </Typography>
        </div>
      )}

      {/* Leader cards */}
      {leaders && leaders.length > 0 && <LeaderRow leaders={leaders} />}

      {/* Quote */}
      <div className="relative mx-auto mt-[clamp(32px,4vw,56px)] max-w-[calc(341px*2+96px)]">
        <span
          aria-hidden="true"
          className="absolute left-0 top-0 -translate-x-full -translate-y-[40%] font-lora text-[length:clamp(40px,5vw,64px)] font-bold leading-none text-[#684170]/30"
        >
          &ldquo;
        </span>

        <Typography
          variant="body-lg"
          className="pt-[clamp(8px,1.2vw,16px)] text-center font-figtree font-normal text-[length:clamp(12px,1.2vw,15px)] leading-[1.7] text-[#5F6C6D]"
        >
          {LEADERSHIP_QUOTE}
        </Typography>
      </div>
    </section>
  );
}