"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { LASTING_CHANGE } from "@/domains/home/constants/lastingchange";

const TARGET = LASTING_CHANGE.purpleCard.statValue;
const SUFFIX = LASTING_CHANGE.purpleCard.statSuffix;

const CHART_POINTS = [
  { x: 52, y: 68, year: "2024" },
  { x: 160, y: 40, year: "2025" },
  { x: 268, y: 12, year: "2026" },
] as const;

const CHART_BASELINE = 84;
const CHART_PATH =
  "M 12 78 C 28 76, 38 72, 52 68 C 92 56, 120 48, 160 40 C 210 28, 236 18, 268 12";
const PATH_LEN = 400;

type PurpleStatsCardProps = {
  className?: string;
  compact?: boolean;
};

export function PurpleStatsCard({
  className,
  compact = false,
}: PurpleStatsCardProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [play, setPlay] = useState(false);
  const [count, setCount] = useState(0);
  const startedRef = useRef(false);

  useEffect(() => {
    const node = rootRef.current;
    if (!node) return;

    const shouldStart = () => {
      const rect = node.getBoundingClientRect();
      // Skip display:none / zero-size clones
      if (rect.width < 8 || rect.height < 8) return false;
      const vh = window.innerHeight || 800;
      // Near or inside viewport
      return rect.top < vh + 120 && rect.bottom > -120;
    };

    const start = () => {
      if (startedRef.current) return;
      if (!shouldStart()) return;
      startedRef.current = true;
      setPlay(true);
    };

    start();

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) start();
      },
      { root: null, threshold: 0, rootMargin: "120px 0px" }
    );
    io.observe(node);

    const onScroll = () => start();
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("scroll", onScroll, { passive: true, capture: true });
    const poll = window.setInterval(start, 300);

    return () => {
      io.disconnect();
      window.clearInterval(poll);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("scroll", onScroll, true);
    };
  }, []);

  useEffect(() => {
    if (!play) return;

    let cancelled = false;
    let frame = 0;
    const duration = 1800;
    const t0 = performance.now();

    const tick = (now: number) => {
      if (cancelled) return;
      const p = Math.min(1, (now - t0) / duration);
      const eased = 1 - (1 - p) ** 3;
      setCount(Math.round(TARGET * eased));
      if (p < 1) frame = requestAnimationFrame(tick);
      else setCount(TARGET);
    };

    // Restart cleanly (handles React Strict Mode remount)
    setCount(0);
    frame = requestAnimationFrame(tick);

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
    };
  }, [play]);

  return (
    <div
      ref={rootRef}
      className={cn(
        "flex aspect-square w-full min-w-0 flex-col justify-between overflow-hidden bg-[#B46CC2] text-white",
        compact ? "p-4" : "p-5 xl:p-6",
        className
      )}
    >
      <div>
        <p
          className={cn(
            "font-figtree font-bold leading-none tracking-tight tabular-nums transition-transform duration-500",
            compact ? "text-[34px]" : "text-[40px] xl:text-[52px]",
            play && "scale-105"
          )}
          style={{ transformOrigin: "left center" }}
        >
          {count}
          {SUFFIX}
        </p>
        <p
          className={cn(
            "mt-1.5 font-figtree font-medium leading-snug",
            compact ? "text-[14px]" : "text-[16px] xl:text-[20px]"
          )}
        >
          {LASTING_CHANGE.purpleCard.label}
        </p>
      </div>

      <div className="w-full">
        <p
          className={cn(
            "mb-1 font-figtree font-normal text-white/90",
            compact ? "text-[11px]" : "text-[12px] xl:text-[14px]"
          )}
        >
          {LASTING_CHANGE.purpleCard.note}
        </p>

        <svg
          viewBox="0 0 320 108"
          className="h-auto w-full"
          fill="none"
          aria-hidden="true"
        >
          <line
            x1="12"
            y1={CHART_BASELINE}
            x2="308"
            y2={CHART_BASELINE}
            stroke="#FFFFFF"
            strokeWidth="1.25"
            strokeDasharray="1.5 3.5"
            opacity={0.7}
          />
          {CHART_POINTS.map((point) => (
            <line
              key={`g-${point.year}`}
              x1={point.x}
              y1={point.y}
              x2={point.x}
              y2={CHART_BASELINE}
              stroke="#FFFFFF"
              strokeWidth="1.25"
              strokeDasharray="1.5 3.5"
              opacity={0.7}
            />
          ))}

          <path
            d={CHART_PATH}
            pathLength={PATH_LEN}
            stroke="#FFFFFF"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            strokeDasharray={PATH_LEN}
            strokeDashoffset={play ? 0 : PATH_LEN}
            style={{
              transition: play
                ? "stroke-dashoffset 1.5s cubic-bezier(0.22, 1, 0.36, 1)"
                : "none",
            }}
          />

          {CHART_POINTS.map((point, i) => (
            <circle
              key={`d-${point.year}`}
              cx={point.x}
              cy={point.y}
              r="5"
              fill="#FFFFFF"
              style={{
                opacity: play ? 1 : 0,
                transition: play
                  ? `opacity 0.4s ease ${0.55 + i * 0.22}s`
                  : "none",
              }}
            />
          ))}

          {CHART_POINTS.map((point, i) => (
            <text
              key={`y-${point.year}`}
              x={point.x}
              y={CHART_BASELINE + 18}
              textAnchor="middle"
              fill="#FFFFFF"
              fontSize="12"
              fontFamily="var(--font-manrope), Manrope, sans-serif"
              style={{
                opacity: play ? 1 : 0,
                transition: play
                  ? `opacity 0.4s ease ${0.65 + i * 0.2}s`
                  : "none",
              }}
            >
              {point.year}
            </text>
          ))}
        </svg>
      </div>
    </div>
  );
}
