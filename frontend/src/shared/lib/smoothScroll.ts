/** Shared elevator-style scrolling for in-page navigation. */

let activeScrollFrame = 0;

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
}

export type ScrollDurationOptions = {
  minMs?: number;
  maxMs?: number;
};

function durationForDistance(distance: number, options?: ScrollDurationOptions) {
  const minMs = options?.minMs ?? 1100;
  const maxMs = options?.maxMs ?? 2400;
  return Math.min(maxMs, Math.max(minMs, distance * 0.7));
}

function animateScroll(from: number, to: number, duration: number): Promise<void> {
  if (prefersReducedMotion() || Math.abs(to - from) < 2) {
    window.scrollTo(0, to);
    return Promise.resolve();
  }

  cancelAnimationFrame(activeScrollFrame);

  return new Promise((resolve) => {
    const t0 = performance.now();

    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / duration);
      window.scrollTo(0, from + (to - from) * easeInOutCubic(p));
      if (p < 1) {
        activeScrollFrame = requestAnimationFrame(tick);
      } else {
        resolve();
      }
    };

    activeScrollFrame = requestAnimationFrame(tick);
  });
}

export function smoothScrollToId(
  id: string,
  offset = 24,
  options?: ScrollDurationOptions,
): Promise<void> {
  const el = document.getElementById(id);
  if (!el) return Promise.resolve();

  const start = window.scrollY;
  const target = el.getBoundingClientRect().top + window.scrollY - offset;
  return animateScroll(start, target, durationForDistance(Math.abs(target - start), options));
}

export function smoothScrollToTop(options?: ScrollDurationOptions): Promise<void> {
  const start = window.scrollY;
  return animateScroll(start, 0, durationForDistance(start, options));
}
