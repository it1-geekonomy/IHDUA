"use client";
import { useCallback,useEffect,useRef,useState,
  type CSSProperties,
  type RefObject,
} from "react";
import Typography from "@/lib/Typography";
import { cn } from "@/lib/utils";
import { DEFAULT_MILESTONES,DESKTOP_QUERY,FLUID_TOKENS,FRAME_MS,GESTURE_GAP_MS,M_STEP_MS,PROGRESS_SMOOTHING,REDUCED_MOTION_QUERY,SCROLL_PER_STEP,SETTLE_EPSILON,START_DELAY_MS,
  type Milestone,
  type RevealKind,
} from "@/domains/about/constants/milestone";
import { fetchMilestonesYearWise } from "@/domains/admin/lib/api";
import { MilestoneListDesktop } from "./KeyMilestonesDesktop";
import { MilestoneListMobile } from "./KeyMilestonesMobile";

export type { Milestone };
export interface KeyMilestonesProps {
  label?: string;
  heading?: string;
  milestones?: readonly Milestone[];
  className?: string;
}

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

function toPixels(event: WheelEvent, delta: number): number {
  switch (event.deltaMode) {
    case WheelEvent.DOM_DELTA_LINE:
      return delta * 16;
    case WheelEvent.DOM_DELTA_PAGE:
      return delta * window.innerHeight;
    default:
      return delta;
  }
}
function useScrollCapture(
  sectionRef: RefObject<HTMLElement | null>,
  viewportRef: RefObject<HTMLElement | null>,
  trackRef: RefObject<HTMLElement | null>,
  count: number,
) {
  useEffect(() => {
    const section = sectionRef.current;
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!section || !viewport || !track) return;

    const desktop = window.matchMedia(DESKTOP_QUERY);
    const reducedMotion = window.matchMedia(REDUCED_MOTION_QUERY);

    let listening = false;
    let steps = 0;
    let maxShiftPercent = 0;
    let target = 0;
    let current = 0;
    let frame = 0;
    let lastTime = 0;
    let touchY = 0;
    let lastWheelTime = 0;
    let swallowing = false;

    const measure = () => {
      const visible =
        parseFloat(getComputedStyle(section).getPropertyValue("--visible")) || count;
      steps = Math.max(count - visible, 0);
      maxShiftPercent = (steps / count) * 100;
    };

    const paint = () => {
      track.style.transform = `translate3d(${(-current * maxShiftPercent).toFixed(3)}%,0,0)`;
    };

    const tick = (time: number) => {
      const dt = lastTime ? Math.min(time - lastTime, 64) : FRAME_MS;
      lastTime = time;

      const diff = target - current;
      if (Math.abs(diff) < SETTLE_EPSILON) {
        current = target;
        frame = 0;
        lastTime = 0;
      } else {
        current += diff * (1 - Math.pow(1 - PROGRESS_SMOOTHING, dt / FRAME_MS));
        frame = requestAnimationFrame(tick);
      }
      paint();
    };

    const consume = (delta: number): boolean => {
      if (delta === 0 || steps <= 0) return false;

      if ((delta > 0 && target >= 1) || (delta < 0 && target <= 0)) return false;

      const perStep = clamp(
        window.innerHeight * SCROLL_PER_STEP.vh,
        SCROLL_PER_STEP.minPx,
        SCROLL_PER_STEP.maxPx,
      );
      target = clamp(target + delta / (perStep * steps), 0, 1);

      if (target <= 0 || target >= 1) swallowing = true;

      if (!frame) frame = requestAnimationFrame(tick);
      return true;
    };

    const onWheel = (event: WheelEvent) => {
      if (event.ctrlKey) return;

      const gap = event.timeStamp - lastWheelTime;
      lastWheelTime = event.timeStamp;

      if (swallowing) {
        if (gap > GESTURE_GAP_MS) {
          swallowing = false;
        } else {
          event.preventDefault();
          return;
        }
      }

      const raw =
        Math.abs(event.deltaX) > Math.abs(event.deltaY)
          ? event.deltaX
          : event.deltaY;

      if (consume(toPixels(event, raw))) event.preventDefault();
    };

    const onTouchStart = (event: TouchEvent) => {
      touchY = event.touches[0]?.clientY ?? 0;
    };

    const onTouchMove = (event: TouchEvent) => {
      const y = event.touches[0]?.clientY ?? touchY;
      const dy = touchY - y;
      touchY = y;
      if (event.cancelable && consume(dy)) event.preventDefault();
    };

    const listen = () => {
      if (listening) return;
      listening = true;
      viewport.scrollLeft = 0;
      section.addEventListener("wheel", onWheel, { passive: false });
      section.addEventListener("touchstart", onTouchStart, { passive: true });
      section.addEventListener("touchmove", onTouchMove, { passive: false });
    };

    const unlisten = () => {
      if (!listening) return;
      listening = false;
      section.removeEventListener("wheel", onWheel);
      section.removeEventListener("touchstart", onTouchStart);
      section.removeEventListener("touchmove", onTouchMove);
      cancelAnimationFrame(frame);
      frame = lastTime = 0;
      target = current = 0;
      swallowing = false;
      track.style.transform = "";
    };

    const sync = () =>
      desktop.matches && !reducedMotion.matches ? listen() : unlisten();

    const resizeObserver = new ResizeObserver(() => {
      measure();
      if (listening) paint();
    });

    measure();
    sync();
    resizeObserver.observe(section);
    desktop.addEventListener("change", sync);
    reducedMotion.addEventListener("change", sync);

    return () => {
      resizeObserver.disconnect();
      desktop.removeEventListener("change", sync);
      reducedMotion.removeEventListener("change", sync);
      unlisten();
    };
  }, [sectionRef, viewportRef, trackRef, count]);
}

function useSequentialReveal(count: number) {
  const [revealed, setRevealed] = useState<readonly RevealKind[]>([]);
  const [visible, setVisible] = useState<ReadonlySet<number>>(() => new Set());
  const lastAnimAt = useRef(0);

  const setRowVisible = useCallback((index: number, isVisible: boolean) => {
    setVisible((prev) => {
      if (prev.has(index) === isVisible) return prev;
      const next = new Set(prev);
      if (isVisible) next.add(index);
      else next.delete(index);
      return next;
    });
  }, []);

  useEffect(() => {
    const next = revealed.length;
    if (next >= count) return;

    let maxVisible = -1;
    visible.forEach((i) => {
      if (i > maxVisible) maxVisible = i;
    });
    if (maxVisible < next) return;

    const push = (kind: RevealKind) =>
      setRevealed((r) => (r.length === next ? [...r, kind] : r));

    if (!visible.has(next)) {
      push("instant");
      return;
    }

    const wait =
      next === 0
        ? START_DELAY_MS
        : Math.max(0, lastAnimAt.current + M_STEP_MS - performance.now());
    const id = window.setTimeout(() => {
      lastAnimAt.current = performance.now();
      push("anim");
    }, wait);
    return () => window.clearTimeout(id);
  }, [revealed, visible, count]);

  return { revealed, setRowVisible };
}

export default function KeyMilestones({
  label = "Our Journey",
  heading = "Key Milestones",
  milestones: initialMilestones = DEFAULT_MILESTONES,
  className,
}: KeyMilestonesProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const [milestones, setMilestones] = useState<readonly Milestone[]>(initialMilestones);

  useEffect(() => {
    fetchMilestonesYearWise()
      .then((items) => {
        if (Array.isArray(items) && items.length > 0) {
          setMilestones(items.map((m) => ({ year: m.year, description: m.description })));
        }
      })
      .catch(() => {
        // Fallback to default milestones
      });
  }, []);

  const count = milestones.length;

  useScrollCapture(sectionRef, viewportRef, trackRef, count);
  const { revealed, setRowVisible } = useSequentialReveal(count);

  const style = { ...FLUID_TOKENS, "--count": count } as CSSProperties;

  return (
    <section
      ref={sectionRef}
      aria-label={heading}
      style={style}
      className={cn(
        "w-full bg-[var(--bg)] px-[var(--section-px)] py-[var(--section-py)] max-md:py-8 md:max-lg:py-10 lg:py-[calc(var(--section-py)*0.6)]",
        "[--visible:1.7] sm:[--visible:2.7] md:[--visible:3.4] lg:[--visible:5] xl:[--visible:6] 2xl:[--visible:7]",
        className,
      )}
    >
      <Typography
        variant="caption"
        className="flex w-fit items-center gap-[var(--label-gap)] font-figtree font-bold uppercase tracking-[0.08em] text-[#9739A8]"
      >
        <span aria-hidden className="h-px w-6 bg-[#9739A8]" />
        {label}
        <span aria-hidden className="h-px w-6 bg-[#9739A8]" />
      </Typography>

      <Typography
        variant="h2"
        className="mt-[var(--heading-mt)] font-lora font-normal leading-[1.15] text-[#00191B]"
      >
        {heading}
      </Typography>

      <div
        ref={viewportRef}
        className={cn(
          "relative mt-[var(--timeline-mt)] max-md:mt-6",
          "-mx-[var(--section-px)] px-[var(--section-px)] scroll-px-[var(--section-px)]",
          "snap-x snap-proximity overflow-x-auto overscroll-x-contain",
          "max-lg:[scrollbar-width:none] max-lg:[&::-webkit-scrollbar]:hidden",
          "lg:snap-none lg:overflow-hidden lg:[contain:layout_paint]",
          "motion-reduce:lg:overflow-x-auto",
          "max-md:h-[23rem] max-md:snap-y max-md:snap-mandatory max-md:overflow-x-hidden max-md:overflow-y-auto max-md:overscroll-y-auto",
        )}
      >
        <EdgeFade side="left" />
        <EdgeFade side="right" />

        <div
          ref={trackRef}
          className="relative w-[calc(var(--count)/var(--visible)*100%)] max-md:w-full lg:will-change-transform"
        >
          <MilestoneListDesktop
            milestones={milestones}
            revealed={revealed}
            onVisibleChange={setRowVisible}
          />
          <MilestoneListMobile
            milestones={milestones}
            revealed={revealed}
            onVisibleChange={setRowVisible}
          />
        </div>
      </div>
    </section>
  );
}

function EdgeFade({ side }: { side: "left" | "right" }) {
  return (
    <span
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-y-0 z-10 hidden w-[calc(var(--section-px)*0.8)] lg:block motion-reduce:hidden",
        side === "left"
          ? "left-0 bg-[linear-gradient(to_right,var(--bg),var(--bg-clear))]"
          : "right-0 bg-[linear-gradient(to_left,var(--bg),var(--bg-clear))]",
      )}
    />
  );
}