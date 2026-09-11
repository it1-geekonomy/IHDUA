"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { STATS } from "@/domains/home/constants/stat";
import Typography from "@/lib/Typography";

const DURATION_MS = 1100;
const START_RATIO = 0.72;
const STAGGER_MS = 140;

function formatStat(value: number) {
  return value.toLocaleString("en-US");
}

function easeOut(t: number) {
  return 1 - (1 - t) ** 2.5;
}

function useSettleCount(target: number, active: boolean, delayMs: number) {
  const from = Math.round(target * START_RATIO);
  const [value, setValue] = useState(from);

  useEffect(() => {
    if (!active) {
      setValue(from);
      return;
    }

    let frame = 0;
    let timeoutId = 0;
    let start = 0;

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / DURATION_MS);
      setValue(Math.round(from + (target - from) * easeOut(t)));
      if (t < 1) frame = requestAnimationFrame(tick);
    };

    timeoutId = window.setTimeout(() => {
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

function StatItem({
  stat,
  active,
  index,
  className,
}: {
  stat: (typeof STATS)[number];
  active: boolean;
  index: number;
  className?: string;
}) {
  const value = useSettleCount(stat.target, active, index * STAGGER_MS);

  return (
    <motion.div
      className={`flex w-full min-w-0 items-start gap-2.5 sm:gap-4 lg:px-0 ${className ?? ""}`}
      initial={{ opacity: 0, y: 14 }}
      animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
      transition={{
        duration: 0.45,
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <div
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg sm:h-12 sm:w-12 sm:rounded-xl"
        style={{ backgroundColor: stat.bg }}
      >
        <Image
          src={stat.icon}
          alt={stat.label}
          width={24}
          height={24}
          className="h-4 w-4 object-contain sm:h-6 sm:w-6"
        />
      </div>
      <div className="flex min-w-0 flex-col gap-0.5 text-left">
        <Typography
          variant="h2"
          className="!mb-0 !text-[22px] font-bold font-lora leading-none text-[#00191B] tabular-nums sm:!text-[31px] md:!text-[36px] lg:!text-[41px]"
        >
          {formatStat(value)}
          {stat.suffix}
        </Typography>
        <Typography
          variant="body-sm"
          className="!mb-0 !text-[11px] leading-snug text-[#5F6C6D] font-medium font-figtree sm:!text-[12px] md:!text-[14px] lg:!text-[16px]"
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

  return (
    <section className="w-full bg-[#FAF9F5] px-6 py-14 lg:px-10 lg:py-24 2xl:px-40 lg:pt-36 2xl:pt-28">
      <div className="flex max-w-3xl flex-col items-start text-left lg:mx-auto lg:items-center lg:text-center">
        <div className="mb-4 flex items-center gap-3">
          <span className="h-px w-8 bg-[#9739A8]" />
          <Typography variant="caption" className="font-bold font-figtree tracking-wide text-[#9739A8]">
            Our Impact
          </Typography>
          <span className="h-px w-8 bg-[#9739A8]" />
        </div>
        <Typography variant="body-lg" className="leading-relaxed text-[#5F6C6D] font-normal font-figtree">
          Empowering rural communities through education, sustainable
          livelihoods, healthcare, and opportunities for a better future.
        </Typography>
      </div>

      <div
        ref={ref}
        className="mt-8 grid w-full grid-cols-2 justify-items-stretch gap-x-5 gap-y-6 sm:mt-10 sm:gap-x-6 sm:gap-y-8 lg:mx-auto lg:mt-16 lg:flex lg:max-w-5xl lg:items-center lg:justify-between lg:gap-y-0 xl:max-w-6xl"
      >
        {STATS.flatMap((stat, index) => {
          const orderMap = ["order-1", "order-2", "order-4", "order-3"];
          const nodes = [];

          if (index !== 0) {
            nodes.push(
              <span
                key={`divider-${stat.label}`}
                className="hidden lg:block lg:h-16 lg:w-px lg:bg-[#45454530]"
              />,
            );
          }

          nodes.push(
            <StatItem
              key={stat.label}
              stat={stat}
              active={inView}
              index={index}
              className={`${orderMap[index]} lg:order-none`}
            />,
          );

          return nodes;
        })}
      </div>
    </section>
  );
}
