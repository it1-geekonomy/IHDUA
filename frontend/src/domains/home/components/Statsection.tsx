"use client";

import Image from "next/image";
import { Fragment, useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { STATS } from "@/domains/home/constants/stat";
import Typography from "@/lib/Typography";
import { smoothScrollToId } from "@/shared/lib/smoothScroll";

const DURATION_MS = 1100;
const START_RATIO = 0.72;
const STAGGER_MS = 140;

/** Visual order in the 2-column mobile grid; reset with `lg:order-none`. */
const MOBILE_ORDER = ["order-1", "order-2", "order-4", "order-3"];

const formatStat = (value: number) => value.toLocaleString("en-US");

const easeOut = (t: number) => 1 - (1 - t) ** 2.5;

function useSettleCount(target: number, active: boolean, delayMs: number) {
  const from = Math.round(target * START_RATIO);
  const [value, setValue] = useState(from);

  useEffect(() => {
    if (!active) {
      setValue(from);
      return;
    }

    let frame = 0;
    let start = 0;

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / DURATION_MS);
      setValue(Math.round(from + (target - from) * easeOut(t)));
      if (t < 1) frame = requestAnimationFrame(tick);
    };

    const timeoutId = window.setTimeout(() => {
      start = performance.now();
      frame = requestAnimationFrame(tick);
    }, delayMs);

    return () => {
      window.clearTimeout(timeoutId);
      cancelAnimationFrame(frame);
    };
  }, [active, target, delayMs, from]);

  return value;
}

interface StatItemProps {
  stat: (typeof STATS)[number];
  active: boolean;
  index: number;
  className?: string;
}

function StatItem({ stat, active, index, className = "" }: StatItemProps) {
  const value = useSettleCount(stat.target, active, index * STAGGER_MS);

  return (
    <motion.div
      // gap: 10px → 16px
      className={`flex w-full min-w-0 items-start gap-[clamp(0.625rem,0.25rem_+_1.875vw,1rem)] ${className}`}
      initial={{ opacity: 0, y: 14 }}
      animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
      transition={{
        duration: 0.45,
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <div
        // box: 36px → 48px, radius: 8px → 12px
        className="flex size-[clamp(2.25rem,1.5rem_+_3.75vw,3rem)] shrink-0 items-center justify-center rounded-[clamp(0.5rem,0.25rem_+_1.25vw,0.75rem)]"
        style={{ backgroundColor: stat.bg }}
      >
        <Image
          src={stat.icon}
          alt=""
          width={24}
          height={24}
          // icon: 16px → 24px
          className="size-[clamp(1rem,0.5rem_+_2.5vw,1.5rem)] object-contain"
        />
      </div>

      <div className="flex min-w-0 flex-col gap-0.5 text-left">
        <Typography
          variant="h2"
          className="!mb-0 font-lora font-bold leading-none text-[#00191B] tabular-nums"
        >
          {formatStat(value)}
          {stat.suffix}
        </Typography>
        <Typography
          variant="body-sm"
          className="!mb-0 font-figtree font-medium leading-snug text-[#5F6C6D]"
        >
          {stat.label}
        </Typography>
      </div>
    </motion.div>
  );
}

export default function StatSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.35 });

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
    <section id="our-impact" className="w-full bg-[#FAF9F5] px-6 pt-8 pb-8 lg:px-10 lg:pt-36 lg:pb-24 2xl:px-40 2xl:pt-28 scroll-mt-20">

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

      <div
        ref={ref}
        // mt: 32px → 40px | gap-x: 20px → 24px | gap-y: 24px → 32px
        className="mt-[clamp(2rem,1.5rem_+_2.5vw,2.5rem)] grid w-full grid-cols-2 justify-items-stretch gap-x-[clamp(1.25rem,1rem_+_1.25vw,1.5rem)] gap-y-[clamp(1.5rem,1rem_+_2.5vw,2rem)] lg:mx-auto lg:mt-16 lg:flex lg:max-w-5xl lg:items-center lg:justify-between lg:gap-y-0 xl:max-w-6xl"
      >
        {STATS.map((stat, index) => (
          <Fragment key={stat.label}>
            {index > 0 && (
              <span
                aria-hidden
                className="hidden lg:block lg:h-16 lg:w-px lg:bg-[#45454530]"
              />
            )}
            <StatItem
              stat={stat}
              active={inView}
              index={index}
              className={`${MOBILE_ORDER[index] ?? ""} lg:order-none`}
            />
          </Fragment>
        ))}
      </div>
    </section>
  );
}