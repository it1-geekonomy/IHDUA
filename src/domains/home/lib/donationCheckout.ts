export const DONATE_CHECKOUT_EVENT = "ihdua:donate-checkout";

export type DonateCheckoutDetail = { amount: string };

let activeScrollFrame = 0;

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
}

/**
 * Elevator-style scroll — duration scales with distance so long pages
 * feel guided, not teleported.
 */
export function smoothScrollToId(
  id: string,
  offset = 24,
  options?: { minMs?: number; maxMs?: number },
): Promise<void> {
  const el = document.getElementById(id);
  if (!el) return Promise.resolve();

  const start = window.scrollY;
  const target = el.getBoundingClientRect().top + window.scrollY - offset;

  if (prefersReducedMotion() || Math.abs(target - start) < 2) {
    window.scrollTo(0, target);
    return Promise.resolve();
  }

  const distance = Math.abs(target - start);
  const minMs = options?.minMs ?? 1200;
  const maxMs = options?.maxMs ?? 2400;
  // ~0.7ms per px, clamped — long page ≈ ~2s glide
  const duration = Math.min(maxMs, Math.max(minMs, distance * 0.7));

  cancelAnimationFrame(activeScrollFrame);

  return new Promise((resolve) => {
    const t0 = performance.now();

    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / duration);
      const y = start + (target - start) * easeInOutCubic(p);
      window.scrollTo(0, y);
      if (p < 1) {
        activeScrollFrame = requestAnimationFrame(tick);
      } else {
        resolve();
      }
    };

    activeScrollFrame = requestAnimationFrame(tick);
  });
}

/** Smooth scroll to the CTA donate card. */
export function scrollToDonateSection() {
  return smoothScrollToId("cta-donate", 24, { minMs: 1100, maxMs: 2200 });
}

/** Smooth glide back to the top of the page (Home / logo). */
export function smoothScrollToTop(options?: { minMs?: number; maxMs?: number }) {
  const start = window.scrollY;
  if (prefersReducedMotion() || start < 2) {
    window.scrollTo(0, 0);
    return Promise.resolve();
  }

  const minMs = options?.minMs ?? 1100;
  const maxMs = options?.maxMs ?? 2400;
  const duration = Math.min(maxMs, Math.max(minMs, start * 0.7));

  cancelAnimationFrame(activeScrollFrame);

  return new Promise<void>((resolve) => {
    const t0 = performance.now();

    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / duration);
      window.scrollTo(0, start * (1 - easeInOutCubic(p)));
      if (p < 1) {
        activeScrollFrame = requestAnimationFrame(tick);
      } else {
        resolve();
      }
    };

    activeScrollFrame = requestAnimationFrame(tick);
  });
}

/**
 * Open CTA step 2 with an amount, then glide to it.
 * `afterMs` lets overlays unlock / fade before scrolling starts.
 */
export function openDonationCheckout(amount: string, afterMs = 0) {
  const normalized = amount.trim();
  if (!normalized) return;

  const withRupee = normalized.startsWith("₹") ? normalized : `₹${normalized}`;

  const run = () => {
    window.dispatchEvent(
      new CustomEvent<DonateCheckoutDetail>(DONATE_CHECKOUT_EVENT, {
        detail: { amount: withRupee },
      }),
    );
    // Settle layout, then start the long eased scroll
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        void scrollToDonateSection();
      });
    });
  };

  if (afterMs > 0) window.setTimeout(run, afterMs);
  else run();
}
