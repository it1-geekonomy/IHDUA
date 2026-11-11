"use client";

import { useEffect, useLayoutEffect } from "react";
import { usePathname } from "next/navigation";

type Kind = "rise" | "fade" | "box";
const KIND: Record<string, Kind> = {
  H1: "rise",
  H2: "rise",
  H3: "rise",
  H4: "rise",
  H5: "rise",
  H6: "rise",
  P: "rise",
  LI: "rise",
  LABEL: "rise",
  INPUT: "rise",
  TEXTAREA: "rise",
  SELECT: "rise",
  BUTTON: "rise",
  A: "rise",
  IMG: "fade",
};

// Tags that can be a "box" (only animated when they look like a card/panel)
const BOX_TAGS = "div,section,article,form,table,ul";
const SELECTOR = `${Object.keys(KIND).join(",").toLowerCase()},${BOX_TAGS},[data-pt-box]`;

const SKIP_AREAS =
  'header, nav, footer, [data-no-page-anim], [data-marquee], [class*="marquee"]';

const FIRST_DELAY_S = 0.05;
const ROW_STEP_S = 0.08;
const COLUMN_STEP_S = 0.05;
const MAX_DELAY_S = 0.7;
const ROW_TOLERANCE_PX = 56;
const SCROLL_STEP_S = 0.06;
const REVEAL_MARGIN = "0px 0px -8% 0px";
const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
const MIN_BOX_SIZE_PX = 48;
const FULL_WIDTH_RATIO = 0.97;

// After a route change, keep watching for content that renders late
// (Suspense, loading.tsx, client-side fetches) and animate it too.
const WATCH_MS = 2500;
// Hard refresh / first visit: false = only the soft body fade (no flash after hydration)
const ANIMATE_FIRST_LOAD = false;

const CSS = `
@keyframes pt-page-in {
  from { opacity: 0; }
  to   { opacity: 1; }
}
/* "to" leaves transform out on purpose, so it lands on the element's own transform */
@keyframes pt-rise {
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; }
}
@keyframes pt-fade {
  from { opacity: 0; }
  to   { opacity: 1; }
}
@keyframes pt-box {
  from { opacity: 0; transform: translateY(28px) scale(0.98); }
  to   { opacity: 1; }
}

body { animation: pt-page-in 500ms ease backwards; }

[data-pt-hold] { opacity: 0; }

[data-pt="rise"] { animation: pt-rise 800ms ${EASE} var(--pt-d, 0s) backwards; }
[data-pt="fade"] { animation: pt-fade 900ms ease-out var(--pt-d, 0s) backwards; }
[data-pt="box"]  { animation: pt-box 900ms ${EASE} var(--pt-d, 0s) backwards; }

@media (prefers-reduced-motion: reduce) {
  body { animation: none; }
  [data-pt] { animation: none !important; }
  [data-pt-hold] { opacity: 1 !important; }
}
`;

const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

// Module-level (survives remounts of this component across layouts)
let booted = false;

function reset(el: HTMLElement) {
  el.removeAttribute("data-pt");
  el.removeAttribute("data-pt-hold");
  el.style.removeProperty("--pt-d");
}

const getKind = (el: HTMLElement): Kind => KIND[el.tagName] ?? "box";

// Does this element look like a card / panel?
function isBox(el: HTMLElement): boolean {
  if (el.hasAttribute("data-pt-box")) return true;

  const rect = el.getBoundingClientRect();
  if (rect.width < MIN_BOX_SIZE_PX || rect.height < MIN_BOX_SIZE_PX) return false;
  if (rect.width >= window.innerWidth * FULL_WIDTH_RATIO) return false;

  const cs = getComputedStyle(el);
  const hasBg =
    (cs.backgroundColor !== "rgba(0, 0, 0, 0)" && cs.backgroundColor !== "transparent") ||
    cs.backgroundImage !== "none";
  const hasBorder =
    parseFloat(cs.borderTopWidth) > 0 ||
    parseFloat(cs.borderRightWidth) > 0 ||
    parseFloat(cs.borderBottomWidth) > 0 ||
    parseFloat(cs.borderLeftWidth) > 0;
  const hasShadow = cs.boxShadow !== "none";
  const rounded = parseFloat(cs.borderTopLeftRadius) > 0;

  return (hasBg || hasBorder || hasShadow) && (rounded || hasBorder || hasShadow);
}

// Is the element inside an inner scroll container that is actually scrollable?
// (Those never intersect the viewport observer until scrolled, so don't hold them.)
function inScroller(el: HTMLElement): boolean {
  for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
    const cs = getComputedStyle(p);
    if (/(auto|scroll)/.test(cs.overflowX + cs.overflowY)) {
      if (p.scrollWidth > p.clientWidth + 1 || p.scrollHeight > p.clientHeight + 1) return true;
    }
  }
  return false;
}

export default function PageTransition() {
  const pathname = usePathname();

  useIsoLayoutEffect(() => {
    // Skip only the very first load of the site (not remounts / later navigations).
    // The timeout keeps React StrictMode's double-invoke from counting as a navigation.
    if (!booted) {
      window.setTimeout(() => {
        booted = true;
      }, 0);
      if (!ANIMATE_FIRST_LOAD) return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const touched = new Set<HTMLElement>();
    const seen = new WeakSet<HTMLElement>();
    const timers = new Set<number>();
    let watchTimer = 0;

    const play = (el: HTMLElement, delay: number) => {
      el.removeAttribute("data-pt-hold");
      el.style.setProperty("--pt-d", `${delay.toFixed(2)}s`);
      el.setAttribute("data-pt", getKind(el));

      let t = 0;
      const done = (e?: AnimationEvent) => {
        if (e && e.target !== el) return;
        el.removeEventListener("animationend", done);
        window.clearTimeout(t);
        timers.delete(t);
        touched.delete(el);
        reset(el);
      };
      el.addEventListener("animationend", done);
      // Fallback if animationend never fires (display:none, interrupted, etc.)
      t = window.setTimeout(() => done(), (delay + 1.5) * 1000);
      timers.add(t);
    };

    const io = new IntersectionObserver(
      (entries) => {
        let n = 0;
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          io.unobserve(el);
          play(el, n++ * SCROLL_STEP_S);
        });
      },
      { rootMargin: REVEAL_MARGIN }
    );

    const scan = (roots: Element[]) => {
      const list = new Set<HTMLElement>();
      roots.forEach((root) => {
        if (root instanceof HTMLElement && root.matches(SELECTOR)) list.add(root);
        root.querySelectorAll<HTMLElement>(SELECTOR).forEach((el) => list.add(el));
      });

      const candidates = Array.from(list).filter((el) => {
        if (!el.isConnected || seen.has(el)) return false;
        if (el.closest(SKIP_AREAS)) return false;
        if (!KIND[el.tagName] && !isBox(el)) return false;
        return true;
      });
      const candidateSet = new Set(candidates);

      // Only the outermost candidate animates
      const targets = candidates.filter((el) => {
        if (el.tagName === "A" && getComputedStyle(el).display === "inline") return false;
        for (let p = el.parentElement; p; p = p.parentElement) {
          if (candidateSet.has(p) || seen.has(p)) return false;
        }
        if (el.getClientRects().length === 0) return false; // display:none
        const rect = el.getBoundingClientRect();
        if (el.tagName !== "IMG" && (rect.width === 0 || rect.height === 0)) return false;
        if (rect.right <= 0 || rect.left >= window.innerWidth) return false;
        return true;
      });

      let row = -1;
      let rowTop = -Infinity;
      let inRow = 0;

      targets.forEach((el) => {
        seen.add(el);
        touched.add(el);
        const top = el.getBoundingClientRect().top + window.scrollY;

        if (top < window.innerHeight) {
          if (Math.abs(top - rowTop) > ROW_TOLERANCE_PX) {
            row += 1;
            rowTop = top;
            inRow = 0;
          } else {
            inRow += 1;
          }
          const delay = FIRST_DELAY_S + row * ROW_STEP_S + Math.min(inRow, 3) * COLUMN_STEP_S;
          play(el, Math.min(delay, MAX_DELAY_S));
        } else if (inScroller(el)) {
          play(el, 0);
        } else {
          el.setAttribute("data-pt-hold", "");
          io.observe(el);
        }
      });
    };

    // 1) Everything that's already on the page
    scan([document.body]);

    // 2) Content that renders a bit later (Suspense, loading.tsx, fetched data)
    const mo = new MutationObserver((mutations) => {
      const added: Element[] = [];
      mutations.forEach((m) =>
        m.addedNodes.forEach((n) => {
          if (n instanceof HTMLElement) added.push(n);
        })
      );
      if (added.length) scan(added);
    });
    mo.observe(document.body, { childList: true, subtree: true });
    watchTimer = window.setTimeout(() => mo.disconnect(), WATCH_MS);

    return () => {
      window.clearTimeout(watchTimer);
      timers.forEach((t) => window.clearTimeout(t));
      timers.clear();
      mo.disconnect();
      io.disconnect();
      touched.forEach(reset);
      touched.clear();
    };
  }, [pathname]);

  return <style>{CSS}</style>;
}