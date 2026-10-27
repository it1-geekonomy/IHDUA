"use client";

import { useMemo } from "react";
import Image from "next/image";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { HELP_ITEMS } from "@/domains/home/constants/howcanwehelp";
import Typography from "@/lib/Typography";

type HelpItem = (typeof HELP_ITEMS)[number];

/**
 * Fluid sizes. Each clamp(min, preferred, max) matches the old breakpoint
 * values at its endpoints, so the layout is unchanged at the extremes and
 * scales smoothly in between.
 */
const SIZE = {
  // Grid top margin: 40px (375px) -> 64px (1024px)
  gridMargin: "mt-[clamp(2.5rem,1.63rem+3.7vw,4rem)]",
  // Grid gap at lg+: 16px (1024px) -> 32px (1280px)
  gridGap: "lg:gap-[clamp(1rem,6.25vw_-_3rem,2rem)]",
  // Card padding: 20/24px (375px) -> 24/32px (640px)
  cardPadding:
    "px-[clamp(1.25rem,0.9rem+1.5vw,1.5rem)] py-[clamp(1.5rem,0.8rem+3vw,2rem)]",

  // Icon box: <640px 40px | sm 44px | md 48px | lg 52px
  iconBox: "h-10 w-10 sm:h-11 sm:w-11 md:h-12 md:w-12 lg:h-[52px] lg:w-[52px]",

  // Icon: <640px 20px | sm 22px | md 24px | lg 26px
  icon: "h-5 w-5 sm:h-[22px] sm:w-[22px] md:h-6 md:w-6 lg:h-[26px] lg:w-[26px]",
} as const;

/** Slower, readable unroll, not a snap */
const EASE_ROLL: [number, number, number, number] = [0.45, 0.05, 0.25, 1];
const ROLL_DURATION = 1.55;
const STAGGER_DELAY = 0.22;
const INITIAL_DELAY = 0.12;

/** Plays once when the grid enters the viewport */
const VIEWPORT = { once: true, amount: 0.35, margin: "0px 0px -8% 0px" } as const;

function createVariants(reduceMotion: boolean) {
  return {
    container: {
      hidden: {},
      visible: {
        transition: {
          staggerChildren: reduceMotion ? 0 : STAGGER_DELAY,
          delayChildren: reduceMotion ? 0 : INITIAL_DELAY,
        },
      },
    },
    // Wrapper only coordinates timing; with reduced motion it fades in briefly
    item: {
      hidden: { opacity: reduceMotion ? 0 : 1 },
      visible: {
        opacity: 1,
        transition: { duration: reduceMotion ? 0.2 : 0 },
      },
    },
    // Paper / curtain unrolls top -> bottom
    paper: {
      hidden: reduceMotion ? { opacity: 0 } : { clipPath: "inset(0 0 100% 0)" },
      visible: reduceMotion
        ? { opacity: 1, transition: { duration: 0.25 } }
        : {
            clipPath: "inset(0 0 0% 0)",
            transition: { duration: ROLL_DURATION, ease: EASE_ROLL },
          },
    },
    // Soft shadow under the rod that fades as the paper unrolls
    shadow: {
      hidden: { opacity: 0.55 },
      visible: {
        opacity: 0,
        transition: { duration: ROLL_DURATION, ease: EASE_ROLL, delay: 0.15 },
      },
    },
  } satisfies Record<string, Variants>;
}

type HelpVariants = ReturnType<typeof createVariants>;

interface HelpCardProps {
  item: HelpItem;
  variants: HelpVariants;
  reduceMotion: boolean;
}

function HelpCard({ item, variants, reduceMotion }: HelpCardProps) {
  return (
    <motion.div className="flex w-[280px] flex-col sm:w-full" variants={variants.item}>
      {/* Rod the paper hangs from */}
      <span className="h-[3px] w-full shrink-0 bg-[#9739A8]" aria-hidden="true" />

      <motion.div
        className={`relative flex h-full flex-col overflow-hidden bg-[#FAF9F5] ${SIZE.cardPadding}`}
        variants={variants.paper}
        style={{ willChange: reduceMotion ? undefined : "clip-path" }}
      >
        {!reduceMotion && (
          <motion.span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 z-10 h-14 origin-top bg-linear-to-b from-black/12 to-transparent"
            variants={variants.shadow}
          />
        )}

        <div className={`flex items-center justify-center bg-[#FFD638] ${SIZE.iconBox}`}>
          {/* Decorative: the heading below already names the item */}
          <Image
            src={item.icon}
            alt=""
            width={32}
            height={32}
            className={`object-contain ${SIZE.icon}`}
          />
        </div>

        <Typography
  variant="h4"
  className="mt-6 font-lora font-normal text-[#00191B] lg:max-xl:hidden"
>
  {item.title}
</Typography>
<Typography
  variant="body-xl"
  aria-hidden="true"
  className="mt-6 hidden font-lora font-normal text-[#00191B] lg:max-xl:block"
>
  {item.title}
</Typography>
        <Typography
          variant="body-sm"
          className="mt-2 font-normal font-figtree leading-relaxed text-[#5F6C6D]"
        >
          {item.description}
        </Typography>
      </motion.div>
    </motion.div>
  );
}

export default function HowCanYouHelpSection() {
  const reduceMotion = useReducedMotion() ?? false;
  const variants = useMemo(() => createVariants(reduceMotion), [reduceMotion]);

  return (
    <section className="w-full bg-white">
      <div className="w-full px-6 pt-6 lg:px-10 lg:pt-8 xl:py-14 2xl:px-40">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <Typography variant="display-xl" className="font-lora font-normal text-[#00191B]">
            How can you help?
          </Typography>
          <Typography
            variant="body-lg"
            className="w-full font-normal font-figtree leading-relaxed text-[#5F6C6D] md:text-left lg:max-w-xl xl:max-w-3xl"
          >
            Together, we can create stronger communities and lasting
            opportunities. Your support helps IHDUA strengthen rural
            communities through education, sustainable livelihoods,
            healthcare, and community-led development.
          </Typography>
        </div>

        <motion.div
          className={`grid grid-cols-1 justify-items-center gap-6 sm:grid-cols-2 sm:justify-items-stretch lg:grid-cols-4 ${SIZE.gridMargin} ${SIZE.gridGap}`}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          variants={variants.container}
        >
          {HELP_ITEMS.map((item) => (
            <HelpCard
              key={item.title}
              item={item}
              variants={variants}
              reduceMotion={reduceMotion}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}