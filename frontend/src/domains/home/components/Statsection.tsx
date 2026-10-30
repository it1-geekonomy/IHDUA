"use client";

import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
} from "framer-motion";
import { STATS, STAT_SETS, type StatValue } from "@/domains/home/constants/stat";
import Typography from "@/lib/Typography";
import { smoothScrollToId } from "@/shared/lib/smoothScroll";

const EASE = [0.16, 1, 0.3, 1] as const;
/** Calendar-page ease: slow lift, fast fall */
const EASE_FLIP = [0.5, 0, 0.2, 1] as const;

const FLIP_SECONDS = 0.7;
/** How far the page swings (past 90deg so it disappears behind the binding) */
const FLIP_ANGLE = 100;
/** Slight tilt of the page when the card is hovered (the "peek") */
const PEEK_ANGLE = 7;
const PERSPECTIVE = 900;

const PURPLE = "#9739A8";
const YELLOW = "#F5C93B";
const DARK = "#00191B";
const PAPER = "#FFFEFA";

/** Binding colour per card (purple / yellow / purple / yellow, as in Figma) */
const BAND_COLORS = [PURPLE, YELLOW, PURPLE, YELLOW];
const RING_COUNT = 9;

/** Minimum time between flips while wheel-scrolling over a card (ms) */
const STEP_COOLDOWN_MS = 900;

/** Visual order in the 2-column mobile grid; reset with `lg:order-none`. */
const MOBILE_ORDER = ["order-1", "order-2", "order-4", "order-3"];

const formatValue = (stat: StatValue) => {
  const decimals = stat.decimals ?? 0;
  return stat.value.toLocaleString("en-IN", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};

/**
 * The sheet with the longest label across EVERY card and EVERY step. Each card
 * renders it invisibly to reserve its height, so all calendars are identical in
 * size on every screen (all cards share the same width, so they wrap the same).
 */
const TALLEST_STAT: StatValue = STAT_SETS.flat().reduce((a, b) =>
  b.label.length > a.label.length ? b : a,
);

/* ------------------------------ Calendar page ----------------------------- */

/** The printed face of one calendar sheet: number, divider, label. */
function PageFace({ stat }: { stat: StatValue }) {
  return (
    <div className="flex h-full flex-col items-center px-3 pb-4 pt-5 lg:px-4">
      <span
        className="font-figtree font-bold tabular-nums leading-none"
        style={{
          fontSize: "clamp(1.5rem, 1rem + 2vw, 2.5rem)",
          color: DARK,
        }}
      >
        {stat.prefix}
        {formatValue(stat)}
        {stat.suffix}
      </span>
      <span className="my-3 h-px w-full bg-[#ECE8DC] lg:my-4" />
      <Typography
        variant="body-sm"
        className="!mb-0 text-center font-figtree font-bold leading-snug text-[#3B3B3B]"
      >
        {stat.label}
      </Typography>
    </div>
  );
}

type FlipCustom = { dir: 1 | -1; instant: boolean };

const flipTransition = {
  rotateX: { duration: FLIP_SECONDS, ease: EASE_FLIP },
  scale: { duration: FLIP_SECONDS, ease: EASE_FLIP },
};

/**
 * dir = +1 (next): the current sheet lifts and flips up over the binding,
 *                  revealing the next sheet already sitting underneath.
 * dir = -1 (prev): the previous sheet swings back down over the current one.
 */
const pageVariants = {
  enter: ({ dir }: FlipCustom) =>
    dir > 0
      ? { rotateX: 0, scale: 0.96, opacity: 1, zIndex: 1 }
      : { rotateX: FLIP_ANGLE, scale: 1, opacity: 0, zIndex: 2 },
  center: ({ dir, instant }: FlipCustom) => ({
    rotateX: 0,
    scale: 1,
    opacity: 1,
    zIndex: dir < 0 ? 2 : 1,
    transition: instant
      ? { duration: 0 }
      : { ...flipTransition, opacity: { duration: 0.12 } },
  }),
  exit: ({ dir, instant }: FlipCustom) =>
    dir > 0
      ? {
          rotateX: FLIP_ANGLE,
          opacity: 0,
          zIndex: 2,
          transition: instant
            ? { duration: 0 }
            : {
                ...flipTransition,
                opacity: { duration: 0.15, delay: FLIP_SECONDS * 0.75 },
              },
        }
      : {
          scale: 0.96,
          zIndex: 1,
          transition: instant ? { duration: 0 } : flipTransition,
        },
};

/* -------------------------------- Calendar -------------------------------- */

/**
 * One calendar card. Each card owns its position in STAT_SETS, so wheel-scrolling
 * over a card flips only that card. Click / tap / Enter flips to the next sheet
 * (touch devices have no hover + wheel).
 */
function CalendarCard({
  slot,
  slotIndex,
  zero,
  instant,
  className = "",
}: {
  slot: (typeof STATS)[number];
  slotIndex: number;
  zero: boolean;
  instant: boolean;
  className?: string;
}) {
  const steps = STAT_SETS.length;
  const ref = useRef<HTMLDivElement>(null);
  const [view, setView] = useState<{ index: number; dir: 1 | -1 }>({
    index: 0,
    dir: 1,
  });
  const [hovered, setHovered] = useState(false);
  const indexRef = useRef(0);
  const lockUntil = useRef(0);

  const flipTo = (next: number, dir: 1 | -1) => {
    indexRef.current = next;
    setView({ index: next, dir });
  };

  // Needs a non-passive native listener so preventDefault can hold the page still
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) < Math.abs(e.deltaX)) return; // ignore sideways scroll

      const now = performance.now();
      // Right after a flip, swallow the rest of the wheel/trackpad momentum
      if (now < lockUntil.current) {
        e.preventDefault();
        return;
      }

      const dir = e.deltaY > 0 ? 1 : -1;
      const next = indexRef.current + dir;
      if (next < 0 || next >= steps) return; // first/last sheet: let the page scroll

      e.preventDefault();
      lockUntil.current = now + STEP_COOLDOWN_MS;
      indexRef.current = next;
      setView({ index: next, dir });
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [steps]);

  const handleNext = () => {
    const now = performance.now();
    if (now < lockUntil.current) return;
    lockUntil.current = now + FLIP_SECONDS * 1000;
    // Wrap around so a tap always does something
    const next = (indexRef.current + 1) % steps;
    flipTo(next, 1);
  };

  const stat = STAT_SETS[view.index][slotIndex];
  const custom: FlipCustom = { dir: view.dir, instant };

  const band = BAND_COLORS[slotIndex % BAND_COLORS.length];

  return (
    <motion.div
      ref={ref}
      initial={false}
      animate={zero ? { opacity: 0, y: 18 } : { opacity: 1, y: 0 }}
      transition={
        instant
          ? { duration: 0 }
          : { duration: 0.6, delay: slotIndex * 0.15, ease: EASE }
      }
      className={`h-full w-full min-w-0 ${className}`}
    >
      <motion.div
        role="button"
        tabIndex={0}
        aria-label={`${stat.prefix ?? ""}${formatValue(stat)}${stat.suffix ?? ""} ${stat.label}. Press to flip to the next figure.`}
        onClick={handleNext}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleNext();
          }
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocus={() => setHovered(true)}
        onBlur={() => setHovered(false)}
        whileHover={instant ? undefined : { y: -4 }}
        transition={{ type: "spring", stiffness: 300, damping: 22 }}
        className="relative mx-auto flex h-full w-full max-w-[16.5rem] cursor-pointer flex-col select-none rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-[#9739A8] focus-visible:ring-offset-2"
      >
        {/* Binding: coloured band + metal rings */}
        <div
          className="relative z-10 h-3.5 rounded-t-xl lg:h-4"
          style={{ backgroundColor: band }}
        >
          <div className="absolute inset-x-0 -top-1.5 flex justify-between px-[22%]">
            {Array.from({ length: RING_COUNT }, (_, i) => (
              <span
                key={i}
                aria-hidden
                className="h-3 w-[3px] rounded-full lg:h-3.5"
                style={{
                  background:
                    "linear-gradient(to right, #8E9697, #F4F6F6 45%, #A9B1B2)",
                  boxShadow: "0 1px 1px rgba(0,25,27,0.25)",
                }}
              />
            ))}
          </div>
        </div>

        {/* Pad of pages underneath: hints there's more to flip */}
        <div
          aria-hidden
          className="absolute inset-x-1.5 bottom-0 top-3.5 rounded-b-xl bg-[#EDE9DC] transition-transform duration-300 lg:top-4"
          style={{
            transform: hovered ? "translateY(7px)" : "translateY(4px)",
            boxShadow: "0 6px 14px -6px rgba(0,25,27,0.18)",
          }}
        />

        {/* Page area */}
        <motion.div
          className="relative flex-1"
          style={{ transformOrigin: "top center", transformPerspective: PERSPECTIVE }}
          initial={false}
          // The first sheet falls into place when the section scrolls into view
          animate={zero ? { rotateX: 90, opacity: 0 } : { rotateX: 0, opacity: 1 }}
          transition={
            instant
              ? { duration: 0 }
              : {
                  duration: 0.8,
                  delay: slotIndex * 0.15 + 0.1,
                  ease: EASE_FLIP,
                }
          }
        >
          {/* Invisible sizer holds the card's height */}
          <div aria-hidden className="invisible rounded-b-xl">
            <PageFace stat={TALLEST_STAT} />
          </div>

          <AnimatePresence initial={false} custom={custom}>
            <motion.div
              key={view.index}
              custom={custom}
              variants={pageVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="absolute inset-0"
              style={{
                transformOrigin: "top center",
                transformPerspective: PERSPECTIVE,
                backfaceVisibility: "hidden",
                willChange: "transform",
              }}
            >
              {/* Peek: the free edge lifts slightly on hover */}
              <motion.div
                className="h-full rounded-b-xl"
                style={{
                  backgroundColor: PAPER,
                  transformOrigin: "top center",
                  transformPerspective: PERSPECTIVE,
                  boxShadow:
                    "0 1px 2px rgba(0,25,27,0.08), 0 8px 16px -8px rgba(0,25,27,0.16)",
                }}
                animate={{ rotateX: hovered && !instant ? PEEK_ANGLE : 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
              >
                <PageFace stat={stat} />
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

/* ------------------------------- Section -------------------------------- */

export default function StatSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion() ?? false;

  // Cards flip in the first time the section is on screen
  const inView = useInView(sectionRef, { once: true, amount: 0.35 });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const checkAndScroll = () => {
      const fromFooter = sessionStorage.getItem("scroll_to_our_impact");
      const hasHash = window.location.hash.includes("our-impact");

      if (fromFooter || hasHash) {
        if (fromFooter) {
          sessionStorage.removeItem("scroll_to_our_impact");
        }
        if (hasHash) {
          window.history.replaceState(null, "", window.location.pathname);
        }

        const navOffset = window.innerWidth >= 1024 ? 80 : 64;
        setTimeout(() => {
          void smoothScrollToId("our-impact", navOffset);
        }, 150);
        setTimeout(() => {
          const el = document.getElementById("our-impact");
          if (el) {
            const rect = el.getBoundingClientRect();
            if (Math.abs(rect.top - navOffset) > 40) {
              void smoothScrollToId("our-impact", navOffset, { minMs: 300, maxMs: 600 });
            }
          }
        }, 450);
      }
    };

    checkAndScroll();
  }, []);

  return (
    <section
      id="our-impact"
      ref={sectionRef}
      className="w-full bg-[#FFFFFF] px-6 pt-6 lg:pt-8 pb-6 lg:pb-8 xl:py-14 lg:px-10 2xl:px-40 scroll-mt-20 lg:scroll-mt-24"
    >
      <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
        <div className="mb-4 flex items-center gap-3 self-center">
          <span className="h-px w-8 bg-[#9739A8]" />
          <Typography
            variant="caption"
            className="font-figtree font-bold tracking-wide text-[#9739A8]"
          >
            Our Impact
          </Typography>
          <span className="h-px w-8 bg-[#9739A8]" />
        </div>
        <Typography
          variant="body-lg"
          className="font-figtree font-normal leading-relaxed text-[#5F6C6D]"
        >
          Empowering rural communities through education, sustainable
          livelihoods, healthcare, and opportunities for a better future.
        </Typography>
      </div>

      <div className="mt-10 grid w-full grid-cols-2 justify-items-stretch gap-x-5 gap-y-12 lg:mt-14 lg:grid-cols-4 lg:gap-x-8">
        {STATS.map((slot, i) => (
          <CalendarCard
            key={slot.label}
            slot={slot}
            slotIndex={i}
            zero={!inView}
            instant={reduceMotion}
            className={`${MOBILE_ORDER[i] ?? ""} lg:order-none`}
          />
        ))}
      </div>
    </section>
  );
}