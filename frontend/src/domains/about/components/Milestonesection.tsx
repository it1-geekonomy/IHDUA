"use client";
import { useCallback,useEffect,useRef,useState,
  type CSSProperties,
  type RefObject,
} from "react";
import Typography from "@/lib/Typography";
import { cn } from "@/lib/utils";
import { DESKTOP_QUERY,FLUID_TOKENS,FRAME_MS,GESTURE_GAP_MS,M_STEP_MS,PROGRESS_SMOOTHING,REDUCED_MOTION_QUERY,SCROLL_PER_STEP,SETTLE_EPSILON,START_DELAY_MS,
  type Milestone,
  type RevealKind,
} from "@/domains/about/constants/milestone";
import { useMilestones } from "@/domains/about/hooks/useMilestones";
import { MilestoneListDesktop } from "./KeyMilestonesDesktop";
import { MilestoneListMobile } from "./KeyMilestonesMobile";

export type { Milestone };
export interface KeyMilestonesProps {
  label?: string;
  heading?: string;
  /** Shown when no milestone is published in the CMS */
  emptyMessage?: string;
  className?: string;
}

const DEFAULT_EMPTY_MESSAGE =
  "New milestones and updates will be displayed here soon.";

const MOBILE_QUERY = "(max-width: 767px)";
const BAND_LOW = 0.35; // lock when the section's center is between 35%...
const BAND_HIGH = 0.65; // ...and 65% of the viewport height
const REARM_MARGIN = 0.1; // after a release, scroll this far (x viewport) out of the band to lock again
const MOBILE_SETTLE_MS = 140; // list scroll is "stopped" after this much silence

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

/**
 * The range of window.scrollY where the section's center sits in the middle
 * band of the viewport (BAND_LOW..BAND_HIGH of its height). The page locks the
 * moment scrolling enters this band, so it stops right where the user is.
 */
function lockBand(el: HTMLElement) {
  const r = el.getBoundingClientRect();
  const centerAbs = window.scrollY + r.top + r.height / 2;
  const vh = window.innerHeight;
  return {
    lo: Math.max(centerAbs - vh * BAND_HIGH, 0),
    hi: Math.max(centerAbs - vh * BAND_LOW, 0),
  };
}

/**
 * Did the page scroll between prevY and y (including a one-frame jump over it)
 * pass through the lock band? A fast scroll can therefore never skip the section.
 */
function crossedSection(el: HTMLElement, prevY: number, y: number) {
  const { lo, hi } = lockBand(el);
  return Math.max(prevY, y) >= lo && Math.min(prevY, y) <= hi;
}

/** Scrolled far enough out of the lock band (in either direction) to lock again? */
function leftBand(el: HTMLElement) {
  const { lo, hi } = lockBand(el);
  const y = window.scrollY;
  const margin = window.innerHeight * REARM_MARGIN;
  return y < lo - margin || y > hi + margin;
}

/** Where to lock: right where the user is, or the nearest band edge if a fast scroll overshot. */
function lockTarget(el: HTMLElement) {
  const { lo, hi } = lockBand(el);
  return clamp(window.scrollY, lo, hi);
}

/**
 * Freeze native page scrolling (kills wheel/touch momentum, keyboard and
 * scrollbar scrolling) without moving the page. Returns an undo function.
 */
function lockPageScroll() {
  const root = document.documentElement;
  const body = document.body;
  const prev = {
    rootOverflow: root.style.overflow,
    bodyOverflow: body.style.overflow,
    gutter: root.style.scrollbarGutter,
    rootOb: root.style.overscrollBehavior,
    bodyOb: body.style.overscrollBehavior,
  };
  // keep the scrollbar's space reserved so the layout doesn't shift
  root.style.scrollbarGutter = "stable";
  root.style.overflow = "hidden";
  body.style.overflow = "hidden";
  root.style.overscrollBehavior = "none";
  body.style.overscrollBehavior = "none";
  return () => {
    root.style.overflow = prev.rootOverflow;
    body.style.overflow = prev.bodyOverflow;
    root.style.scrollbarGutter = prev.gutter;
    root.style.overscrollBehavior = prev.rootOb;
    body.style.overscrollBehavior = prev.bodyOb;
  };
}

/** Eased window scroll driven by rAF (ignores CSS scroll-behavior). Returns a cancel fn. */
function animateScrollTo(to: number, onDone?: () => void) {
  const from = window.scrollY;
  const dist = to - from;
  if (Math.abs(dist) < 2) {
    onDone?.();
    return () => {};
  }
  const duration = clamp(Math.abs(dist) * 0.8, 200, 450);
  const t0 = performance.now();
  let id = 0;
  const step = (now: number) => {
    const p = Math.min((now - t0) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
    window.scrollTo({ top: from + dist * eased, behavior: "instant" as ScrollBehavior });
    if (p < 1) id = requestAnimationFrame(step);
    else onDone?.();
  };
  id = requestAnimationFrame(step);
  return () => cancelAnimationFrame(id);
}

/**
 * Desktop: vertical wheel / touch drives the horizontal timeline.
 * The moment the section comes into view (slow OR fast, wheel, trackpad,
 * keyboard, scrollbar) native page scrolling is frozen, the page glides to the
 * section, and all input drives the timeline. At either end the next fresh
 * scroll gesture releases the page. The section keeps its natural height.
 */
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
    let locked = false;
    let armed = true; // re-armed when the section fully leaves the viewport
    let animating = false;
    let cancelGlide: (() => void) | null = null;
    let undoPageLock: (() => void) | null = null;
    let lastY = window.scrollY;
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

      // reached an end: swallow the momentum tail of this gesture
      if (target <= 0 || target >= 1) swallowing = true;

      if (!frame) frame = requestAnimationFrame(tick);
      return true;
    };

    const lock = () => {
      locked = true;
      armed = false;
      animating = true;
      swallowing = true; // ignore the tail of the flick that brought us here
      undoPageLock = lockPageScroll();
      cancelGlide = animateScrollTo(lockTarget(section), () => {
        animating = false;
        cancelGlide = null;
      });
    };

    const unlock = () => {
      cancelGlide?.();
      cancelGlide = null;
      animating = false;
      locked = false;
      swallowing = false;
      undoPageLock?.();
      undoPageLock = null;
    };

    const onScroll = () => {
      const y = window.scrollY;
      const prev = lastY;
      lastY = y;
      if (locked || steps <= 0) return;
      if (!armed) {
        // re-arm in BOTH directions once the user has scrolled out of the band
        if (leftBand(section)) armed = true;
        return;
      }
      if (crossedSection(section, prev, y)) lock();
    };

    const onWheel = (event: WheelEvent) => {
      if (!locked || event.ctrlKey) return;

      const gap = event.timeStamp - lastWheelTime;
      lastWheelTime = event.timeStamp;

      if (animating) {
        event.preventDefault();
        return;
      }

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
      else unlock(); // fresh push past an end -> let the page go
    };

    const onTouchStart = (event: TouchEvent) => {
      touchY = event.touches[0]?.clientY ?? 0;
    };

    const onTouchMove = (event: TouchEvent) => {
      if (!locked) return;
      const y = event.touches[0]?.clientY ?? touchY;
      const dy = touchY - y;
      touchY = y;
      if (!event.cancelable || dy === 0) return;
      if (animating) {
        event.preventDefault();
        return;
      }
      if (consume(dy)) event.preventDefault();
      else unlock();
    };

    // Fully off screen: re-arm, and park the timeline at the end the user will
    // come back from (invisible, so nothing jumps).
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry || entry.isIntersecting) return;
        if (locked) unlock();
        armed = true;
        swallowing = false;
        const below = entry.boundingClientRect.top > 0;
        target = current = below ? 0 : 1;
        cancelAnimationFrame(frame);
        frame = lastTime = 0;
        paint();
      },
      { threshold: [0] },
    );

    const listen = () => {
      if (listening) return;
      listening = true;
      lastY = window.scrollY;
      viewport.scrollLeft = 0;
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("wheel", onWheel, { passive: false });
      window.addEventListener("touchstart", onTouchStart, { passive: true });
      window.addEventListener("touchmove", onTouchMove, { passive: false });
      io.observe(section);
    };

    const unlisten = () => {
      if (!listening) return;
      listening = false;
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      io.disconnect();
      unlock();
      cancelAnimationFrame(frame);
      frame = lastTime = 0;
      target = current = 0;
      armed = true;
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

/**
 * Mobile: the list scrolls vertically. The moment the section comes into view
 * the page is frozen and glides to it; the list then scrolls natively. The page
 * is released when the list stops at its far end, when the user swipes outward
 * at an edge, or touches outside the list.
 */
function useMobileScrollLock(
  sectionRef: RefObject<HTMLElement | null>,
  viewportRef: RefObject<HTMLElement | null>,
  count: number,
) {
  useEffect(() => {
    const section = sectionRef.current;
    const list = viewportRef.current;
    if (!section || !list || count === 0) return;

    const mobile = window.matchMedia(MOBILE_QUERY);

    let engaged = false;
    let armed = true;
    let entry = 1; // 1 = entered scrolling down (exit = bottom), -1 = scrolling up
    let touching = false;
    let pushingOut = false;
    let lastTouchY = 0;
    let stopTimer = 0;
    let lastScrollY = window.scrollY;
    let cancelGlide: (() => void) | null = null;
    let undoPageLock: (() => void) | null = null;

    const atTop = () => list.scrollTop <= 1;
    const atBottom = () =>
      list.scrollTop + list.clientHeight >= list.scrollHeight - 1;

    const engage = (dir: number) => {
      engaged = true;
      armed = false;
      entry = dir;
      pushingOut = false;
      list.style.overscrollBehaviorY = "contain";
      undoPageLock = lockPageScroll(); // stops page momentum immediately
      cancelGlide = animateScrollTo(lockTarget(section));
    };

    const release = () => {
      if (!engaged) return;
      engaged = false;
      pushingOut = false;
      cancelGlide?.();
      cancelGlide = null;
      clearTimeout(stopTimer);
      undoPageLock?.();
      undoPageLock = null;
      list.style.overscrollBehaviorY = "";
    };

    // The list has stopped moving: decide whether to let the page go
    const settle = () => {
      if (!engaged || touching) return;
      const atExit = entry > 0 ? atBottom() : atTop();
      if (atExit || pushingOut) release();
      pushingOut = false;
    };

    const scheduleSettle = () => {
      clearTimeout(stopTimer);
      stopTimer = window.setTimeout(settle, MOBILE_SETTLE_MS);
    };

    const onPageScroll = () => {
      const y = window.scrollY;
      const prev = lastScrollY;
      lastScrollY = y;
      if (engaged || !mobile.matches || y === prev) return;
      if (!armed) {
        if (leftBand(section)) armed = true;
        return;
      }
      if (crossedSection(section, prev, y)) engage(Math.sign(y - prev));
    };

    const onListScroll = () => {
      if (engaged) scheduleSettle();
    };

    const onTouchStart = (e: TouchEvent) => {
      touching = true;
      pushingOut = false;
      lastTouchY = e.touches[0]?.clientY ?? 0;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!engaged) return;
      const y = e.touches[0]?.clientY ?? lastTouchY;
      const dy = lastTouchY - y; // > 0: content moving down
      lastTouchY = y;
      if ((atTop() && dy < 0) || (atBottom() && dy > 0)) pushingOut = true;
    };

    const onTouchEnd = () => {
      touching = false;
      if (engaged) scheduleSettle();
    };

    // Touching anywhere outside the list means the user wants to leave
    const onDocTouchMove = (e: TouchEvent) => {
      if (!engaged || list.contains(e.target as Node)) return;
      if (e.cancelable) e.preventDefault();
      release();
    };

    // Off screen: release, re-arm, and park the list at the edge the user will
    // come back from (invisible, so no jump).
    const io = new IntersectionObserver(
      ([obs]) => {
        if (!obs || obs.isIntersecting) return;
        release();
        armed = true;
        if (!mobile.matches) return;
        list.scrollTop = obs.boundingClientRect.top > 0 ? 0 : list.scrollHeight;
      },
      { threshold: [0] },
    );

    const onMediaChange = () => {
      if (!mobile.matches) release();
    };

    window.addEventListener("scroll", onPageScroll, { passive: true });
    list.addEventListener("scroll", onListScroll, { passive: true });
    list.addEventListener("touchstart", onTouchStart, { passive: true });
    list.addEventListener("touchmove", onTouchMove, { passive: true });
    list.addEventListener("touchend", onTouchEnd, { passive: true });
    list.addEventListener("touchcancel", onTouchEnd, { passive: true });
    document.addEventListener("touchmove", onDocTouchMove, { passive: false });
    mobile.addEventListener("change", onMediaChange);
    io.observe(section);

    return () => {
      release();
      clearTimeout(stopTimer);
      io.disconnect();
      window.removeEventListener("scroll", onPageScroll);
      list.removeEventListener("scroll", onListScroll);
      list.removeEventListener("touchstart", onTouchStart);
      list.removeEventListener("touchmove", onTouchMove);
      list.removeEventListener("touchend", onTouchEnd);
      list.removeEventListener("touchcancel", onTouchEnd);
      document.removeEventListener("touchmove", onDocTouchMove);
      mobile.removeEventListener("change", onMediaChange);
    };
  }, [sectionRef, viewportRef, count]);
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
  emptyMessage = DEFAULT_EMPTY_MESSAGE,
  className,
}: KeyMilestonesProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  // null while loading, [] when nothing is published, otherwise the CMS milestones
  const milestones = useMilestones();

  const count = milestones?.length ?? 0;

  // Hooks must run on every render, so they stay above the early returns below
  useScrollCapture(sectionRef, viewportRef, trackRef, count);
  useMobileScrollLock(sectionRef, viewportRef, count);
  const { revealed, setRowVisible } = useSequentialReveal(count);

  // Still loading: render nothing, so the message doesn't flash before the data arrives
  if (milestones === null) return null;

  const style = { ...FLUID_TOKENS, "--count": count } as CSSProperties;

  const sectionClass = cn(
    "w-full bg-[var(--bg)] px-[var(--section-px)] py-[var(--section-py)] max-md:py-8 md:max-lg:py-10 lg:py-[calc(var(--section-py)*0.6)]",
    "[--visible:1.7] sm:[--visible:2.7] md:[--visible:3.4] lg:[--visible:5] xl:[--visible:6] 2xl:[--visible:7]",
    className,
  );

  const header = (
    <>
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
    </>
  );

  // Loaded, but nothing is published in the CMS (or the API failed): show a message
  if (count === 0) {
    return (
      <section aria-label={heading} style={style} className={sectionClass}>
        {header}
        <div className="mt-[var(--timeline-mt)] max-md:mt-6 flex min-h-[10rem] items-center justify-center rounded-lg border border-dashed border-[#D9D4C4] bg-white/60 px-6 py-10 text-center">
          <Typography
            variant="body-lg"
            className="max-w-xl font-figtree font-normal leading-relaxed text-[#5F6C6D]"
          >
            {emptyMessage}
          </Typography>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} aria-label={heading} style={style} className={sectionClass}>
      {header}

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
          className={cn(
            "relative w-[calc(var(--count)/var(--visible)*100%)] max-md:w-full lg:will-change-transform",
            // Wrap only at word boundaries, never split a word (both languages)
            "[&_*]:[overflow-wrap:normal]! [&_*]:[word-break:normal]! [&_*]:hyphens-none! [&_*]:text-pretty",
          )}
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