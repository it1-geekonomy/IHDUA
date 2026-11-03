"use client";

import { useEffect } from "react";

/**
 * Locks page scroll without moving the page.
 * - No position:fixed (that is what was resetting the scroll to the hero)
 * - Forces the page back to its original position if anything scrolls it
 * - Restores the exact position instantly on close
 */
export function useBodyScrollLock(isLocked: boolean): void {
  useEffect(() => {
    if (!isLocked) return;

    const html = document.documentElement;
    const body = document.body;
    const lockedY = window.scrollY;
    const lockedX = window.scrollX;

    const original = {
      htmlOverflow: html.style.overflow,
      htmlScrollBehavior: html.style.scrollBehavior,
      bodyPaddingRight: body.style.paddingRight,
    };

    // Keep the layout from shifting when the scrollbar disappears
    const scrollbarWidth = window.innerWidth - html.clientWidth;
    if (scrollbarWidth > 0) {
      body.style.paddingRight = `${scrollbarWidth}px`;
    }

    html.style.scrollBehavior = "auto";
    html.style.overflow = "hidden";

    // Safety net: if anything moves the page while the modal is open, put it back
    const keepPosition = () => {
      if (window.scrollY !== lockedY || window.scrollX !== lockedX) {
        window.scrollTo({ top: lockedY, left: lockedX, behavior: "instant" as ScrollBehavior });
      }
    };
    window.addEventListener("scroll", keepPosition);

    return () => {
      window.removeEventListener("scroll", keepPosition);

      html.style.overflow = original.htmlOverflow;
      body.style.paddingRight = original.bodyPaddingRight;

      // Instant restore (no smooth animation)
      html.style.scrollBehavior = "auto";
      window.scrollTo({ top: lockedY, left: lockedX, behavior: "instant" as ScrollBehavior });
      requestAnimationFrame(() => {
        html.style.scrollBehavior = original.htmlScrollBehavior;
      });
    };
  }, [isLocked]);
}