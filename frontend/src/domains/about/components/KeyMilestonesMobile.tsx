"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import Typography from "@/lib/Typography";
import { cn } from "@/lib/utils";
import { LINE_BASE,M_DELAYS,VERTICAL_X,
  type Milestone,
  type RevealKind,
} from "@/domains/about/constants/milestone";

interface MilestoneListMobileProps {
  milestones: readonly Milestone[];
  revealed: readonly RevealKind[];
  onVisibleChange: (index: number, visible: boolean) => void;
}

export function MilestoneListMobile({
  milestones,
  revealed,
  onVisibleChange,
}: MilestoneListMobileProps) {
  return (
    <ol className="relative grid grid-cols-1 md:hidden">
      {milestones.map((milestone, index) => (
        <MilestoneItemMobile
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

interface MilestoneItemMobileProps {
  milestone: Milestone;
  index: number;
  isLast: boolean;
  revealed: RevealKind | undefined;
  onVisibleChange: (index: number, visible: boolean) => void;
}

function MilestoneItemMobile({
  milestone,
  index,
  isLast,
  revealed,
  onVisibleChange,
}: MilestoneItemMobileProps) {
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

  const dotMt =
    "mt-[calc((var(--year-size)*1.3_-_var(--node))/2)] col-start-2 row-start-1";

  return (
    <li
      ref={liRef}
      className="relative grid min-h-[5.75rem] snap-start grid-cols-[calc(var(--year-size)*2.6)_auto_1fr] items-start gap-x-3 px-0 py-3"
    >
      {index > 0 && (
        <span
          aria-hidden
          className={cn(
            "pointer-events-none absolute top-0 h-[calc(0.75rem_+_var(--year-size)*0.65)] w-px bg-[#B68DC1]/25",
            VERTICAL_X,
          )}
        />
      )}
      {!isLast && (
        <span
          aria-hidden
          className={cn(
            "pointer-events-none absolute bottom-0 top-[calc(0.75rem_+_var(--year-size)*0.65)] w-px bg-[#B68DC1]/25",
            VERTICAL_X,
          )}
        />
      )}
      <span
        aria-hidden
        className={cn(
          "pointer-events-none relative grid h-[var(--node)] w-[var(--node)] place-items-center",
          dotMt,
        )}
      >
        <span className="h-1/3 w-1/3 rounded-full bg-[#B68DC1]/50" />
      </span>

      {index > 0 && (
        <span
          aria-hidden
          style={{ "--dm": `${M_DELAYS.lineIn}ms` } as CSSProperties}
          className={cn(
            LINE_BASE,
            "top-0 h-[calc(0.75rem_+_var(--year-size)*0.65)] w-px origin-top motion-safe:duration-[250ms]",
            VERTICAL_X,
            !seen && "motion-safe:scale-y-0",
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
            "bottom-0 top-[calc(0.75rem_+_var(--year-size)*0.65)] w-px origin-top motion-safe:duration-[350ms]",
            VERTICAL_X,
            !seen && "motion-safe:scale-y-0",
            noMotion,
          )}
        />
      )}

      <span
        aria-hidden
        style={{ "--dm": `${M_DELAYS.dot}ms` } as CSSProperties}
        className={cn(
          "relative z-10 grid h-[var(--node)] w-[var(--node)] place-items-center rounded-full bg-[#B68DC1]/25",
          dotMt,
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

      <time
        dateTime={milestone.year}
        style={{ "--dm": `${M_DELAYS.text}ms` } as CSSProperties}
        className={cn("col-start-1 row-start-1 block text-right", reveal)}
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
        className={cn(
          "col-start-3 row-start-1 mt-0 min-w-0 max-w-full justify-self-start pt-[calc((var(--year-size)*1.3_-_var(--desc-size)*1.375)/2)]",
          reveal,
        )}
      >
        <Typography
          variant="body-sm"
          className="m-0 break-words font-figtree font-light leading-snug text-pretty text-[#3D3D3D]"
        >
          {milestone.description}
        </Typography>
      </div>
    </li>
  );
}