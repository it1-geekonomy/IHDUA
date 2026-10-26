"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
} from "framer-motion";
import { STATS, STAT_SETS, type StatValue } from "@/domains/home/constants/stat";
import Typography from "@/lib/Typography";

/** Card (white box) height = one digit row, in em */
const CARD_H = 1.45;
const CARD_W = "1.05em";
/** The roll window is taller than the card so faded neighbours peek out above and below */
const WINDOW_H = CARD_H * 1.7;
const WINDOW_TOP = -((WINDOW_H - CARD_H) / 2);
/** Centres the active row inside the window */
const CENTER = (WINDOW_H - CARD_H) / 2;

const FADE_MASK =
  "linear-gradient(to bottom, transparent 0%, #000 22%, #000 78%, transparent 100%)";
const EASE = [0.16, 1, 0.3, 1] as const;
const ROLL_SECONDS = 1.6;

const DULL = "#B4BCBD";
const DARK = "#00191B";

/** Three 0-9 cycles; digits land on the middle cycle so they spin on entry */
const STRIP = Array.from({ length: 30 }, (_, i) => i % 10);

/** Minimum time between steps while wheel-scrolling over a stat (ms) */
const STEP_COOLDOWN_MS = 900;

/** Visual order in the 2-column mobile grid; reset with `lg:order-none`. */
const MOBILE_ORDER = ["order-1", "order-2", "order-4", "order-3"];

/* ----------------------------- Rolling digit ----------------------------- */

function Digit({
  digit,
  delay,
  zero,
  instant,
}: {
  digit: number;
  delay: number;
  zero: boolean;
  instant: boolean;
}) {
  const index = zero ? 0 : 10 + digit;
  const [settled, setSettled] = useState(true);

  // A new target means a new roll: show the faded neighbours until it lands
  useEffect(() => {
    if (!instant) setSettled(false);
  }, [index, instant]);

  return (
    <span
      className="relative inline-block"
      style={{ height: `${CARD_H}em`, width: CARD_W }}
    >
      {/* White card */}
      <span
        aria-hidden
        className="absolute inset-0 rounded-[0.28em] bg-white"
        style={{ boxShadow: "0 1px 2px rgba(0,25,27,0.08), 0 4px 10px -4px rgba(0,25,27,0.12)" }}
      />

      {/* Roll window: taller than the card, faded at its edges */}
      <span
        className="absolute left-0 w-full overflow-hidden"
        style={{
          top: `${WINDOW_TOP}em`,
          height: `${WINDOW_H}em`,
          maskImage: FADE_MASK,
          WebkitMaskImage: FADE_MASK,
        }}
      >
        <motion.span
          className="absolute left-0 top-0 flex w-full flex-col will-change-transform"
          initial={{ y: `${CENTER}em` }}
          animate={{ y: `${CENTER - index * CARD_H}em` }}
          transition={
            instant ? { duration: 0 } : { duration: ROLL_SECONDS, delay, ease: EASE }
          }
          onAnimationComplete={() => setSettled(true)}
        >
          {STRIP.map((n, i) => {
            const active = i === index;
            return (
              <span
                key={i}
                className="flex items-center justify-center"
                style={{
                  height: `${CARD_H}em`,
                  lineHeight: `${CARD_H}em`,
                  color: active && settled ? DARK : DULL,
                  opacity: active || !settled ? 1 : 0,
                  transition: instant ? "none" : "color 0.45s ease, opacity 0.35s ease",
                }}
              >
                {n}
              </span>
            );
          })}
        </motion.span>
      </span>
    </span>
  );
}

function Odometer({
  stat,
  zero,
  instant,
  baseDelay,
}: {
  stat: StatValue;
  zero: boolean;
  instant: boolean;
  baseDelay: number;
}) {
  const decimals = stat.decimals ?? 0;
  const formatted = stat.value.toLocaleString("en-IN", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  const chars = formatted.split("");

  return (
    <span
      className="inline-flex items-center font-lora font-bold tabular-nums"
      style={{ fontSize: "clamp(1.125rem, 0.8rem + 1.3vw, 1.875rem)", color: DARK }}
      aria-label={`${stat.prefix ?? ""}${formatted}${stat.suffix ?? ""}`}
    >
      {stat.prefix && (
        <span className="mr-1 text-[#9739A8]" style={{ lineHeight: `${CARD_H}em` }}>
          {stat.prefix}
        </span>
      )}
      <span aria-hidden className="inline-flex items-center gap-[0.18em]">
        {chars.map((ch, i) => {
          // Key from the right so columns keep their identity when the length changes
          const key = chars.length - i;
          return /\d/.test(ch) ? (
            <Digit
              key={key}
              digit={Number(ch)}
              delay={baseDelay + (chars.length - 1 - i) * 0.09}
              zero={zero}
              instant={instant}
            />
          ) : (
            <span
              key={key}
              className="self-end text-[0.7em]"
              style={{ lineHeight: 1, paddingBottom: "0.15em", color: DARK }}
            >
              {ch}
            </span>
          );
        })}
      </span>
      {stat.suffix && (
        <motion.span
          className="ml-1.5 inline-block whitespace-pre text-[0.6em] text-[#9739A8]"
          style={{ lineHeight: `${CARD_H}em` }}
          initial={false}
          animate={zero ? { opacity: 0, scale: 0.4 } : { opacity: 1, scale: 1 }}
          transition={
            instant
              ? { duration: 0 }
              : {
                  type: "spring",
                  stiffness: 400,
                  damping: 14,
                  delay: baseDelay + ROLL_SECONDS * 0.8,
                }
          }
        >
          {stat.suffix}
        </motion.span>
      )}
    </span>
  );
}

/* ------------------------------ Partition ------------------------------- */

/**
 * Each partition owns its own position in STAT_SETS, so scrolling over one
 * stat changes only that stat. Top row: icon + number cards. Label below, centered.
 */
function Partition({
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
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);
  const lockUntil = useRef(0);

  // Needs a non-passive native listener so preventDefault can hold the page still
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) < Math.abs(e.deltaX)) return;

      const now = performance.now();
      if (now < lockUntil.current) {
        e.preventDefault();
        return;
      }

      const next = activeRef.current + (e.deltaY > 0 ? 1 : -1);
      if (next < 0 || next >= steps) return; // first/last value: let the page scroll

      e.preventDefault();
      lockUntil.current = now + STEP_COOLDOWN_MS;
      activeRef.current = next;
      setActive(next);
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [steps]);

  const stat = STAT_SETS[active][slotIndex];
  const baseDelay = zero || active === 0 ? slotIndex * 0.15 : 0;

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
      className={`flex w-full min-w-0 flex-col items-center gap-[clamp(0.75rem,0.5rem+1vw,1.25rem)] ${className}`}
    >
      {/* Icon (left, vertically centered) + number cards */}
      <div className="flex items-center gap-[clamp(0.625rem,0.3rem+1.4vw,1rem)]">
        <motion.div
          // box: 40px → 56px, radius: 10px → 14px
          className="flex size-[clamp(2.5rem,1.7rem+3.4vw,3.5rem)] shrink-0 items-center justify-center rounded-[clamp(0.625rem,0.4rem+1vw,0.875rem)]"
          style={{ backgroundColor: slot.bg }}
          initial={false}
          animate={zero ? { scale: 0.5, rotate: -12 } : { scale: 1, rotate: 0 }}
          transition={
            instant
              ? { duration: 0 }
              : { type: "spring", stiffness: 260, damping: 16, delay: slotIndex * 0.15 }
          }
        >
          <Image
            src={slot.icon}
            alt=""
            width={28}
            height={28}
            className="size-[clamp(1.125rem,0.7rem+1.8vw,1.75rem)] object-contain"
          />
        </motion.div>

        <Odometer stat={stat} zero={zero} instant={instant} baseDelay={baseDelay} />
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={stat.label}
          initial={instant ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={instant ? undefined : { opacity: 0, y: -6 }}
          transition={{ duration: 0.2, ease: EASE }}
        >
          <Typography
            variant="body-sm"
            className="!mb-0 text-center font-figtree font-medium leading-snug text-[#5F6C6D]"
          >
            {stat.label}
          </Typography>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}

/* ------------------------------- Section -------------------------------- */

export default function StatSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion() ?? false;

  const inView = useInView(sectionRef, { once: true, amount: 0.35 });

  return (
    <section
      ref={sectionRef}
      className="w-full bg-[#FAF9F5] px-6 py-10 lg:px-10 xl:py-20 2xl:px-40"
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

      <div className="mt-10 grid w-full grid-cols-2 justify-items-stretch gap-x-5 gap-y-10 lg:mt-14 lg:grid-cols-4 lg:gap-x-8">
        {STATS.map((slot, i) => (
          <Partition
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