"use client";

import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
} from "framer-motion";
import { useImpactStats, type Sheet } from "@/domains/home/hooks/useImpactStats";
import Typography from "@/lib/Typography";
import { smoothScrollToId } from "@/shared/lib/smoothScroll";

const EASE = [0.16, 1, 0.3, 1] as const;
const EASE_FLIP = [0.5, 0, 0.2, 1] as const;

const FLIP_SECONDS = 0.7;
const FLIP_ANGLE = 100;
const PEEK_ANGLE = 7;
const PERSPECTIVE = 900;

// Entrance timing
const ENTER_STAGGER = 0.3; // delay between each card (seconds)
const ENTER_OFFSET_Y = 16; // px the whole card rises while fading in
const PAGE_FLIP_SECONDS = 0.8; // how long each page takes to swing back down
const PAGE_GAP = 0.3; // delay between one page and the next inside a card
const GHOST_PAGES = 0; // extra blank pages before the stat page (0 = only the stat page flips)
const REPLAY_ON_REENTER = true; // replay the animation every time the section scrolls into view

const PURPLE = "#9739A8";
const YELLOW = "#F5C93B";
const DARK = "#00191B";
const PAPER = "#FFFEFA";

const BAND_COLORS = [PURPLE, YELLOW, PURPLE, YELLOW];
const RING_COUNT = 9;

const STEP_COOLDOWN_MS = 900;

// Last known stats are cached so cards render instantly on refresh
const CACHE_KEY = "impact_stats_cache_v1";
const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

const MOBILE_ORDER = ["order-1", "order-2", "order-4", "order-3"];

/* ------------------------------ Calendar page ----------------------------- */

function PageFace({ sheet }: { sheet: Sheet }) {
  return (
    <div className="flex h-full min-h-0 flex-col items-center px-3 pb-4 pt-5 lg:px-4">
      {/* Stat value - Google Translate must not translate this */}
      <span
        translate="no"
        className="notranslate font-figtree font-bold tabular-nums leading-[1.2]"
        style={{
          fontSize: "clamp(1.5rem, 1rem + 2vw, 2.5rem)",
          color: DARK,
        }}
      >
        <span key={sheet.display}>{sheet.display}</span>
      </span>

      <span className="my-3 h-px w-full shrink-0 bg-[#ECE8DC] lg:my-4" />

      {/* Stat label - Google Translate can translate this */}
      <Typography
        variant="body-sm"
        className="!mb-0 w-full text-center font-bold !leading-[1.65] text-[#3B3B3B] [overflow-wrap:anywhere] [word-break:normal]"
        style={{
          fontFamily:
            'Figtree, "Noto Sans Kannada", "Nirmala UI", "Tunga", sans-serif',
        }}
      >
        <span key={sheet.label}>{sheet.label}</span>
      </Typography>
    </div>
  );
}

/* ------------------------------ Flip animation ----------------------------- */

type FlipCustom = {
  dir: 1 | -1;
  instant: boolean;
};

const flipTransition = {
  rotateX: {
    duration: FLIP_SECONDS,
    ease: EASE_FLIP,
  },
  scale: {
    duration: FLIP_SECONDS,
    ease: EASE_FLIP,
  },
};

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
      : {
          ...flipTransition,
          opacity: { duration: 0.12 },
        },
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
                opacity: {
                  duration: 0.15,
                  delay: FLIP_SECONDS * 0.75,
                },
              },
        }
      : {
          scale: 0.96,
          zIndex: 1,
          transition: instant ? { duration: 0 } : flipTransition,
        },
};

/* -------------------------------- Calendar -------------------------------- */

function CalendarCard({
  sheets,
  allSheets,
  slotIndex,
  zero,
  instant,
  className = "",
}: {
  sheets: Sheet[];
  allSheets: Sheet[];
  slotIndex: number;
  zero: boolean;
  instant: boolean;
  className?: string;
}) {
  const steps = sheets.length;

  const ref = useRef<HTMLDivElement>(null);

  const [view, setView] = useState<{
    index: number;
    dir: 1 | -1;
  }>({
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

  // Wheel scrolling
  useEffect(() => {
    const el = ref.current;

    if (!el || steps <= 1) return;

    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) < Math.abs(e.deltaX)) return;

      const now = performance.now();

      if (now < lockUntil.current) {
        e.preventDefault();
        return;
      }

      const dir = e.deltaY > 0 ? 1 : -1;
      const next = indexRef.current + dir;

      if (next < 0 || next >= steps) return;

      e.preventDefault();

      lockUntil.current = now + STEP_COOLDOWN_MS;
      indexRef.current = next;

      setView({ index: next, dir });
    };

    el.addEventListener("wheel", onWheel, { passive: false });

    return () => el.removeEventListener("wheel", onWheel);
  }, [steps]);

  const handleNext = () => {
    if (steps <= 1) return;

    const now = performance.now();

    if (now < lockUntil.current) return;

    lockUntil.current = now + FLIP_SECONDS * 1000;

    const next = (indexRef.current + 1) % steps;

    flipTo(next, 1);
  };

  const sheet = sheets[view.index] ?? sheets[0];

  const custom: FlipCustom = {
    dir: view.dir,
    instant,
  };

  const band = BAND_COLORS[slotIndex % BAND_COLORS.length];

  // Entrance: pages swing back down onto the pad (reverse of the click flip).
  // Resets instantly when the section leaves the screen.
  const flipIn = (extraDelay: number) =>
    instant || zero
      ? { duration: 0 }
      : {
          rotateX: {
            duration: PAGE_FLIP_SECONDS,
            delay: slotIndex * ENTER_STAGGER + 0.05 + extraDelay,
            ease: EASE_FLIP,
          },
        };

  return (
    <motion.div
      ref={ref}
      // explicit hidden initial state (NOT initial={false}) so the entrance
      // always plays, even if the card mounts after the section is in view
      initial={instant ? false : { opacity: 0, y: ENTER_OFFSET_Y }}
      animate={
        zero ? { opacity: 0, y: ENTER_OFFSET_Y } : { opacity: 1, y: 0 }
      }
      transition={
        instant || zero
          ? { duration: 0 }
          : {
              duration: 0.5,
              delay: slotIndex * ENTER_STAGGER,
              ease: EASE,
            }
      }
      className={`h-full w-full min-w-0 ${className}`}
    >
      <motion.div
        role="button"
        tabIndex={0}
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
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 22,
        }}
        className="relative mx-auto flex h-full w-full max-w-[16.5rem] cursor-pointer flex-col select-none rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-[#9739A8] focus-visible:ring-offset-2"
      >
        {steps > 1 && (
          <span className="sr-only">Press to flip to the next figure.</span>
        )}

        {/* Binding */}
        <div
          className="relative z-10 h-3.5 shrink-0 rounded-t-xl lg:h-4"
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

        {/* Pad underneath */}
        <div
          aria-hidden
          className="absolute inset-x-1.5 bottom-0 top-3.5 rounded-b-xl bg-[#EDE9DC] transition-transform duration-300 lg:top-4"
          style={{
            transform: hovered ? "translateY(7px)" : "translateY(4px)",
            boxShadow: "0 6px 14px -6px rgba(0,25,27,0.18)",
          }}
        />

        {/* Page area: pages flip back into place on entrance */}
        <div className="relative flex-1">
          {/* Dynamic sizing for all translated labels */}
          <div aria-hidden="true" className="invisible grid rounded-b-xl">
            {allSheets.map((s, i) => (
              <div
                key={`${i}-${s.display}-${s.label}`}
                className="col-start-1 row-start-1"
              >
                <PageFace sheet={s} />
              </div>
            ))}
          </div>

          {/* Blank pages that flip back first, so it reads as a calendar
              whose pages are being turned back into place */}
          {Array.from({ length: GHOST_PAGES }, (_, g) => (
            <motion.div
              key={`ghost-${g}`}
              aria-hidden
              className="absolute inset-0 rounded-b-xl"
              style={{
                backgroundColor: g % 2 ? "#F6F2E6" : "#FAF7EE",
                transformOrigin: "top center",
                transformPerspective: PERSPECTIVE,
                backfaceVisibility: "hidden",
                zIndex: g + 1,
                boxShadow:
                  "0 1px 2px rgba(0,25,27,0.08), 0 8px 16px -8px rgba(0,25,27,0.12)",
              }}
              initial={instant ? false : { rotateX: FLIP_ANGLE }}
              animate={{ rotateX: zero ? FLIP_ANGLE : 0 }}
              transition={flipIn(g * PAGE_GAP)}
            />
          ))}

          {/* The real stat page flips back last, on top */}
          <motion.div
            className="absolute inset-0"
            style={{
              transformOrigin: "top center",
              transformPerspective: PERSPECTIVE,
              backfaceVisibility: "hidden",
              zIndex: GHOST_PAGES + 1,
            }}
            initial={instant ? false : { rotateX: FLIP_ANGLE }}
            animate={{ rotateX: zero ? FLIP_ANGLE : 0 }}
            transition={flipIn(GHOST_PAGES * PAGE_GAP)}
          >
          {/* initial={false}: the first page renders instantly without
              playing the "enter" flip. Flip only happens on click/wheel. */}
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
              {/* Page hover effect */}
              <motion.div
                className="h-full rounded-b-xl"
                style={{
                  backgroundColor: PAPER,
                  transformOrigin: "top center",
                  transformPerspective: PERSPECTIVE,
                  boxShadow:
                    "0 1px 2px rgba(0,25,27,0.08), 0 8px 16px -8px rgba(0,25,27,0.16)",
                }}
                animate={{
                  rotateX: hovered && !instant ? PEEK_ANGLE : 0,
                }}
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                }}
              >
                <PageFace sheet={sheet} />
              </motion.div>
            </motion.div>
          </AnimatePresence>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ------------------------------- Section -------------------------------- */

export default function StatSection() {
  const sectionRef = useRef<HTMLElement>(null);

  const reduceMotion = useReducedMotion() ?? false;

  const fresh = useImpactStats();
  const [cached, setCached] = useState<Sheet[][] | null>(null);

  // Read cache before first paint (no flash, no hydration mismatch)
  useIsoLayoutEffect(() => {
    try {
      const raw = localStorage.getItem(CACHE_KEY);
      if (raw) setCached(JSON.parse(raw) as Sheet[][]);
    } catch {}
  }, []);

  // Save fresh data for the next refresh
  useEffect(() => {
    if (!fresh) return;
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(fresh));
    } catch {}
  }, [fresh]);

  const slots = fresh ?? cached;

  // All sheets from every card
  const allSheets = useMemo(() => {
    return slots ? slots.flat() : [];
  }, [slots]);

  const hasAny = allSheets.length > 0;

  // Plays when the section actually scrolls into view.
  // With REPLAY_ON_REENTER the cards reset when it leaves the screen,
  // so the same animation runs every time the section enters again.
  const inView = useInView(sectionRef, {
    once: !REPLAY_ON_REENTER,
    amount: 0.3,
  });

  // Footer navigation / hash scrolling
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
              void smoothScrollToId("our-impact", navOffset, {
                minMs: 300,
                maxMs: 600,
              });
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
      className="w-full scroll-mt-20 bg-[#FFFFFF] px-6 pt-6 pb-6 lg:scroll-mt-24 lg:px-10 lg:pt-8 lg:pb-8 xl:py-14 2xl:px-40"
    >
      {/* Heading */}
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
          className="font-figtree font-normal !leading-[1.7] text-[#5F6C6D]"
          style={{
            fontFamily:
              'Figtree, "Noto Sans Kannada", "Nirmala UI", "Tunga", sans-serif',
          }}
        >
          Empowering rural communities through education, sustainable
          livelihoods, healthcare, and opportunities for a better future.
        </Typography>
      </div>

      {/* Stats cards */}
      <div className="mt-10 grid min-h-[10rem] w-full grid-cols-2 justify-items-stretch gap-x-5 gap-y-12 lg:mt-14 lg:grid-cols-4 lg:gap-x-8">
        {/* No published stats */}
        {slots && !hasAny && (
          <div className="col-span-full flex min-h-[10rem] items-center justify-center rounded-lg border border-dashed border-[#D9D4C4] bg-[#FAF9F5] px-6 py-10 text-center">
            <Typography
              variant="body-lg"
              className="max-w-xl font-figtree font-normal !leading-[1.7] text-[#5F6C6D]"
              style={{
                fontFamily:
                  'Figtree, "Noto Sans Kannada", "Nirmala UI", "Tunga", sans-serif',
              }}
            >
              New impact stats and updates will be displayed here soon.
            </Typography>
          </div>
        )}

        {/* Published stats */}
        {slots &&
          hasAny &&
          slots.map((sheets, i) =>
            sheets.length > 0 ? (
              <CalendarCard
                key={i}
                sheets={sheets}
                allSheets={allSheets}
                slotIndex={i}
                zero={!inView}
                instant={reduceMotion}
                className={`${MOBILE_ORDER[i] ?? ""} lg:order-none`}
              />
            ) : null
          )}
      </div>
    </section>
  );
}