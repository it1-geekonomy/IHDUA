"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import Typography from "@/lib/Typography";
import { cn } from "@/lib/utils";
import {
  LINE_BASE,
  M_DELAYS,
  type Milestone,
  type RevealKind,
} from "@/domains/about/constants/milestone";

interface MilestoneListDesktopProps {
  milestones: readonly Milestone[];
  revealed: readonly RevealKind[];
  onVisibleChange: (index: number, visible: boolean) => void;
}

export function MilestoneListDesktop({
  milestones,
  revealed,
  onVisibleChange,
}: MilestoneListDesktopProps) {
  return (
    <ol className="relative hidden grid-cols-[repeat(var(--count),minmax(0,1fr))] md:grid">
      {milestones.map((milestone, index) => (
        <MilestoneItemDesktop
          key={`${milestone.year}-${index}`}
          milestone={milestone}
          index={index}
          isLast={index === milestones.length - 1}
          revealed={revealed[index]}
          onVisibleChange={onVisibleChange}
        />
      ))}
    </ol>
  );
}

interface MilestoneItemDesktopProps {
  milestone: Milestone;
  index: number;
  isLast: boolean;
  revealed: RevealKind | undefined;
  onVisibleChange: (index: number, visible: boolean) => void;
}

function MilestoneItemDesktop({
  milestone,
  index,
  isLast,
  revealed,
  onVisibleChange,
}: MilestoneItemDesktopProps) {
  const liRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    const node = liRef.current;
    if (!node) return;
    let reported = false;
    const report = (next: boolean) => {
      if (next === reported) return;
      reported = next;
      onVisibleChange(index, next);
    };
    const observer = new IntersectionObserver(
      ([entry]) => report(!!entry?.isIntersecting),
      { threshold: 0.5 },
    );
    observer.observe(node);
    return () => {
      observer.disconnect();
      report(false);
    };
  }, [index, onVisibleChange]);

  const seen = revealed !== undefined;
  const noMotion = revealed === "instant" && "!transition-none";

  const reveal = cn(
    "motion-safe:transition-[opacity,filter] motion-safe:duration-700 motion-safe:ease-out [transition-delay:var(--dm)]",
    !seen && "motion-safe:opacity-50 motion-safe:blur-[2px] motion-safe:grayscale",
    noMotion,
  );

  return (
    <li
      ref={liRef}
      className="relative snap-start pr-[var(--item-gap)] pt-[calc(var(--node)+var(--year-mt))]"
    >
      {index > 0 && (
        <span
          aria-hidden
          className="pointer-events-none absolute left-0 top-[calc(var(--node)/2)] h-px w-[calc(var(--node)/2)] bg-[#B68DC1]/25"
        />
      )}
      {!isLast && (
        <span
          aria-hidden
          className="pointer-events-none absolute left-[calc(var(--node)/2)] right-0 top-[calc(var(--node)/2)] h-px bg-[#B68DC1]/25"
        />
      )}
      <span
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 grid h-[var(--node)] w-[var(--node)] place-items-center"
      >
        <span className="h-1/3 w-1/3 rounded-full bg-[#B68DC1]/50" />
      </span>

      {index > 0 && (
        <span
          aria-hidden
          style={{ "--dm": `${M_DELAYS.lineIn}ms` } as CSSProperties}
          className={cn(
            LINE_BASE,
            "left-0 top-[calc(var(--node)/2)] h-px w-[calc(var(--node)/2)] origin-left motion-safe:duration-[250ms]",
            !seen && "motion-safe:scale-x-0",
            noMotion,
          )}
        />
      )}

      {!isLast && (
        <span
          aria-hidden
          style={{ "--dm": `${M_DELAYS.lineOut}ms` } as CSSProperties}
          className={cn(
            LINE_BASE,
            "left-[calc(var(--node)/2)] right-0 top-[calc(var(--node)/2)] h-px origin-left motion-safe:duration-[350ms]",
            !seen && "motion-safe:scale-x-0",
            noMotion,
          )}
        />
      )}

      <span
        aria-hidden
        style={{ "--dm": `${M_DELAYS.dot}ms` } as CSSProperties}
        className={cn(
          "absolute left-0 top-0 grid h-[var(--node)] w-[var(--node)] place-items-center rounded-full bg-[#B68DC1]/25",
          "motion-safe:transition-transform motion-safe:duration-500 motion-safe:ease-[cubic-bezier(0.34,1.56,0.64,1)] [transition-delay:var(--dm)]",
          !seen && "motion-safe:scale-0",
          noMotion,
        )}
      >
        {seen && (
          <span
            aria-hidden
            style={{
              animationDelay: `${M_DELAYS.dot + 500}ms`,
              animationDuration: "2.2s",
            }}
            className="pointer-events-none absolute inset-[22%] rounded-full bg-[#9739A8]/35 motion-safe:animate-ping"
          />
        )}
        <span className="relative h-1/2 w-1/2 rounded-full bg-[#B68DC1]" />
      </span>

      <div className={cn(isLast && "relative w-fit max-w-full")}>
        {isLast && (
          <>
            <span
              aria-hidden
              className="pointer-events-none absolute left-[calc(var(--node)/2)] right-0 top-[calc((var(--year-mt)+var(--node)/2)*-1)] h-px bg-[#B68DC1]/25"
            />
            <span
              aria-hidden
              style={{ "--dm": `${M_DELAYS.lineOut}ms` } as CSSProperties}
              className={cn(
                LINE_BASE,
                "left-[calc(var(--node)/2)] right-0 top-[calc((var(--year-mt)+var(--node)/2)*-1)] h-px origin-left motion-safe:duration-[350ms]",
                !seen && "motion-safe:scale-x-0",
                noMotion,
              )}
            />
          </>
        )}
        <time
          dateTime={milestone.year}
          style={{ "--dm": `${M_DELAYS.text}ms` } as CSSProperties}
          className={cn("block", reveal)}
        >
          <Typography
            variant="body-xl"
            className="m-0 font-figtree font-semibold leading-[1.3] text-[#8A5F92]"
          >
            {milestone.year}
          </Typography>
        </time>
        <div
          style={{ "--dm": `${M_DELAYS.text}ms` } as CSSProperties}
          className={cn("mt-[var(--desc-mt)] min-w-0", reveal)}
        >
          <Typography
            variant="body-sm"
            className="m-0 break-words font-figtree font-light leading-[1.65] text-pretty text-[#505050]"
          >
            {milestone.description}
          </Typography>
        </div>
      </div>
    </li>
  );
}