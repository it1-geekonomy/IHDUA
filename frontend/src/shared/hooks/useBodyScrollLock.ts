"use client";

import { useEffect, useRef } from "react";

/**
 * Robust scroll-lock hook that freezes background scrolling without layout shift.
 * Uses `position: fixed` with inverted scroll offset to reliably prevent wheel,
 * touch, and trackpad scrolling on both desktop and mobile devices.
 */
export function useBodyScrollLock(isLocked: boolean): void {
  const lockedScrollY = useRef(0);

  useEffect(() => {
    if (!isLocked) return;

    const scrollY = window.scrollY;
    lockedScrollY.current = scrollY;
    const { body, documentElement } = document;

    const original = {
      bodyPosition: body.style.position,
      bodyTop: body.style.top,
      bodyWidth: body.style.width,
      bodyOverflow: body.style.overflow,
      htmlOverflow: documentElement.style.overflow,
    };

    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.width = "100%";
    body.style.overflow = "hidden";
    documentElement.style.overflow = "hidden";

    return () => {
      body.style.position = original.bodyPosition;
      body.style.top = original.bodyTop;
      body.style.width = original.bodyWidth;
      body.style.overflow = original.bodyOverflow;
      documentElement.style.overflow = original.htmlOverflow;
      window.scrollTo(0, lockedScrollY.current);
    };
  }, [isLocked]);
}
