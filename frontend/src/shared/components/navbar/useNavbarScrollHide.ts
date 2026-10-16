"use client";

import { useEffect, useRef, useState } from "react";

function readScrollY() {
  return (
    window.scrollY ||
    document.documentElement.scrollTop ||
    document.body.scrollTop ||
    0
  );
}

/** Hide header on scroll down, reveal on scroll up. Stays visible near top / while menu open. */
export function useNavbarScrollHide(menuOpen: boolean) {
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    lastScrollY.current = readScrollY();
    let ticking = false;

    const update = () => {
      const y = readScrollY();
      const delta = y - lastScrollY.current;

      if (menuOpen || y <= 24) {
        setHidden(false);
      } else if (delta > 4) {
        setHidden(true);
      } else if (delta < -4) {
        setHidden(false);
      }

      lastScrollY.current = y;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("scroll", onScroll, { passive: true, capture: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("scroll", onScroll, true);
    };
  }, [menuOpen]);

  return { hidden, setHidden };
}
