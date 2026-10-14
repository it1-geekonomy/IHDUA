import { useEffect, useState, type CSSProperties } from "react";

// ===== 1. Keyframes + classes (render once inside the overlay) =====
export function OverlayformAnimations() {
  return (
    <style>{`
      /* 1. Card opens like a slit from the centre line */
      @keyframes overlayform-open {
        from { clip-path: inset(47% 0 47% 0); }
        to   { clip-path: inset(0 0 0 0); }
      }
      /* 2. Two coloured curtains sweep across and reveal the form */
      @keyframes overlayform-sweep {
        from { clip-path: inset(0 0 0 0); }
        to   { clip-path: inset(0 0 0 100%); }
      }
      /* 3. Photo settles from a deep zoom */
      @keyframes overlayform-zoom {
        from { transform: scale(1.18); }
        to   { transform: scale(1); }
      }
      /* 4. Content rises in, staggered via --d */
      @keyframes overlayform-rise {
        from { opacity: 0; transform: translateY(14px); }
        to   { opacity: 1; transform: none; }
      }
      .overlayform-card-in { animation: overlayform-open 650ms cubic-bezier(0.77, 0, 0.175, 1); }
      .overlayform-curtain-yellow { animation: overlayform-sweep 750ms cubic-bezier(0.77, 0, 0.175, 1) 250ms both; }
      .overlayform-curtain-purple { animation: overlayform-sweep 750ms cubic-bezier(0.77, 0, 0.175, 1) 420ms both; }
      .overlayform-img-in { animation: overlayform-zoom 1500ms cubic-bezier(0.22, 1, 0.36, 1); }
      .overlayform-rise { animation: overlayform-rise 600ms cubic-bezier(0.22, 1, 0.36, 1) var(--d, 0ms) both; }
      @media (prefers-reduced-motion: reduce) {
        .overlayform-card-in, .overlayform-curtain-yellow, .overlayform-curtain-purple,
        .overlayform-img-in, .overlayform-rise { animation: none; }
        .overlayform-curtain-yellow, .overlayform-curtain-purple { display: none; }
      }
    `}</style>
  );
}

// ===== 2. Sweeping curtains (mount only while `intro` is true) =====
export function IntroCurtains() {
  return (
    <>
      <div aria-hidden className="overlayform-curtain-purple pointer-events-none absolute inset-0 z-10 bg-[#9739A8]" />
      <div aria-hidden className="overlayform-curtain-yellow pointer-events-none absolute inset-0 z-[11] bg-[#FDC61D]" />
    </>
  );
}

// ===== 3. Intro / exit state and helpers =====
export function useOverlayformAnimation(onClose: () => void) {
  const [exiting, setExiting] = useState(false);
  const [intro, setIntro] = useState(true);

  // Entrance plays once; classes are dropped afterwards so returning to
  // step 1 doesn't replay it.
  useEffect(() => {
    const t = window.setTimeout(() => setIntro(false), 2000);
    return () => window.clearTimeout(t);
  }, []);

  const beginClose = () => {
    if (exiting) return;
    setExiting(true);
    window.setTimeout(() => onClose(), 500);
  };

  const rise = intro ? "overlayform-rise" : "";
  const delay = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

  return { intro, exiting, rise, delay, beginClose };
}