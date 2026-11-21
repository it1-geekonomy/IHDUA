import Image from "next/image";
import { useState, type MouseEvent } from "react";

const MISSION_IMAGE_SIZES = "(max-width: 1023px) 100vw, 48vw";
const MISSION_IMAGE_QUALITY = 70;

/**
 * Animations
 *  Pillar click : yellow fill sweeps in from the left, purple edge bar grows,
 *                 big number pops, ripple bursts from the click point.
 *  Image change : purple + yellow curtains wipe through in the direction of travel
 *                 (down the list = wipes down, up the list = wipes up). The new photo
 *                 is swapped in while the curtains are full, then settles from a zoom.
 */
const MISSION_STYLES = `
  /* ---------- pillar card ---------- */
  @keyframes mission-pop {
    0%   { transform: scale(1) rotate(0); }
    40%  { transform: scale(1.35) rotate(-6deg); }
    70%  { transform: scale(0.94) rotate(2deg); }
    100% { transform: scale(1.12) rotate(0); }
  }
  @keyframes mission-ripple {
    from { transform: scale(0); opacity: 0.55; }
    to   { transform: scale(9);  opacity: 0; }
  }
  @keyframes mission-title-nudge {
    0%   { transform: translateX(0); }
    35%  { transform: translateX(10px); }
    100% { transform: translateX(0); }
  }
  .mission-number-pop { animation: mission-pop 650ms cubic-bezier(0.34, 1.56, 0.64, 1) both; }
  .mission-ripple     { animation: mission-ripple 750ms cubic-bezier(0.22, 1, 0.36, 1) both; }
  .mission-title-nudge { animation: mission-title-nudge 500ms cubic-bezier(0.22, 1, 0.36, 1); }

  /* ---------- image transition ---------- */
  @keyframes mission-wipe-down {
    0%   { clip-path: inset(0 0 100% 0); }
    50%  { clip-path: inset(0 0 0 0); }
    100% { clip-path: inset(100% 0 0 0); }
  }
  @keyframes mission-wipe-up {
    0%   { clip-path: inset(100% 0 0 0); }
    50%  { clip-path: inset(0 0 0 0); }
    100% { clip-path: inset(0 0 100% 0); }
  }
  /* new photo stays hidden until the curtains are fully closed */
  @keyframes mission-swap {
    0%, 49% { opacity: 0; }
    50%, 100% { opacity: 1; }
  }
  @keyframes mission-zoom {
    0%, 45% { transform: scale(1.25); filter: saturate(0.6) blur(3px); }
    100%    { transform: scale(1);    filter: saturate(1)   blur(0); }
  }
  .mission-curtain-purple { animation-duration: 950ms; animation-timing-function: cubic-bezier(0.77, 0, 0.175, 1); animation-fill-mode: both; }
  .mission-curtain-yellow { animation-duration: 950ms; animation-timing-function: cubic-bezier(0.77, 0, 0.175, 1); animation-fill-mode: both; animation-delay: 130ms; }
  .mission-wipe-down { animation-name: mission-wipe-down; }
  .mission-wipe-up   { animation-name: mission-wipe-up; }
  .mission-img-swap  { animation: mission-swap 950ms steps(1, end) both; }
  .mission-img-zoom  { animation: mission-zoom 1500ms cubic-bezier(0.22, 1, 0.36, 1) both; }

  @media (prefers-reduced-motion: reduce) {
    .mission-number-pop, .mission-ripple, .mission-title-nudge,
    .mission-curtain-purple, .mission-curtain-yellow,
    .mission-img-swap, .mission-img-zoom { animation: none; }
    .mission-curtain-purple, .mission-curtain-yellow { display: none; }
  }
`;

interface Ripple {
  id: number;
  index: number;
  x: number;
  y: number;
}

export interface MissionImageItem {
  image: string;
  title: string;
}

/* ===== 1. Keyframes + classes (render once inside the section) ===== */
export function MissionAnimations() {
  return <style>{MISSION_STYLES}</style>;
}

/* ===== 2. State + click handler driving every animation ===== */
export function useMissionAnimation() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState<number | null>(null);
  const [direction, setDirection] = useState<"down" | "up">("down");
  const [animKey, setAnimKey] = useState(0); // 0 = initial render, no transition
  const [ripple, setRipple] = useState<Ripple | null>(null);

  const handleSelect = (index: number, e: MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setRipple({
      id: Date.now(),
      index,
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });

    if (index === activeIndex) return;

    setDirection(index > activeIndex ? "down" : "up");
    setPrevIndex(activeIndex);
    setActiveIndex(index);
    setAnimKey((k) => k + 1);
  };

  return { activeIndex, prevIndex, direction, animKey, ripple, handleSelect };
}

/* ===== 3. Pillar card effects: fill sweep, edge bar, ripple ===== */
export function PillarEffects({
  index,
  isActive,
  ripple,
}: {
  index: number;
  isActive: boolean;
  ripple: Ripple | null;
}) {
  return (
    <>
      {/* Yellow fill sweeping in from the left */}
      <span
        aria-hidden
        className={`pointer-events-none absolute inset-0 origin-left bg-[#FFD638] transition-transform duration-500 ease-[cubic-bezier(0.77,0,0.175,1)] motion-reduce:transition-none ${
          isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
        }`}
      />

      {/* Purple edge bar that thickens when active */}
      <span
        aria-hidden
        className={`pointer-events-none absolute inset-y-0 left-0 w-1 origin-left bg-[#9739A8] transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] motion-reduce:transition-none ${
          isActive ? "scale-x-[2.5]" : "scale-x-100"
        }`}
      />

      {/* Ripple from the click point */}
      {ripple && ripple.index === index && (
        <span
          key={ripple.id}
          aria-hidden
          className="mission-ripple pointer-events-none absolute -ml-10 -mt-10 h-20 w-20 rounded-full bg-[#9739A8]"
          style={{ left: ripple.x, top: ripple.y }}
        />
      )}
    </>
  );
}

/* ===== 4. Class helpers for the number and title ===== */
export const pillarNumberClass = (isActive: boolean) =>
  `relative inline-block font-lora font-normal leading-none transition-colors duration-500 ${
    isActive
      ? "mission-number-pop text-[#6B1F7A]"
      : "text-[#6D3F76]/70 group-hover:text-[#6B1F7A]"
  }`;

export const pillarTitleNudge = (isActive: boolean, animKey: number) => ({
  key: isActive ? `a-${animKey}` : "i",
  className: isActive ? "mission-title-nudge" : "",
});

/* ===== 5. Image stage: curtain wipe + zoom-settle ===== */
export function MissionImageStage({
  active,
  prev,
  direction,
  animKey,
  className = "",
}: {
  active: MissionImageItem;
  prev: MissionImageItem | null;
  direction: "down" | "up";
  animKey: number;
  className?: string;
}) {
  const wipeClass = direction === "down" ? "mission-wipe-down" : "mission-wipe-up";

  // Mobile/tablet (below 1024px): MissionSection passes a className with fixed heights.
  // Desktop (1024px+): no className, the stage sizes itself from the photo.
  const isMobileStage = Boolean(className);

  const curtains = animKey > 0 && (
    <>
      <div
        key={`p-${animKey}`}
        aria-hidden
        className={`mission-curtain-purple ${wipeClass} pointer-events-none absolute inset-0 z-10 bg-[#9739A8]`}
      />
      <div
        key={`y-${animKey}`}
        aria-hidden
        className={`mission-curtain-yellow ${wipeClass} pointer-events-none absolute inset-0 z-[11] bg-[#FFD638]`}
      />
    </>
  );

  /* ---------- Below 1024px: fixed-height box, image fills it (object-cover) ---------- */
  if (isMobileStage) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        {/* Previous photo stays underneath so there's never a blank frame */}
        {prev && (
          <Image
            src={prev.image}
            alt=""
            aria-hidden
            fill
            sizes={MISSION_IMAGE_SIZES}
            quality={MISSION_IMAGE_QUALITY}
            className="object-cover"
          />
        )}

        {/* Current photo: remounts on each change so the animations replay */}
        <div key={animKey} className={`absolute inset-0 ${animKey > 0 ? "mission-img-swap" : ""}`}>
          <Image
            src={active.image}
            alt={active.title}
            fill
            sizes={MISSION_IMAGE_SIZES}
            quality={MISSION_IMAGE_QUALITY}
            className={`object-cover ${animKey > 0 ? "mission-img-zoom" : ""}`}
          />
        </div>

        {curtains}
      </div>
    );
  }

  /* ---------- 1024px and up: full column width, natural height, no crop ---------- */
  return (
    <div className="relative hidden overflow-hidden bg-white lg:block lg:self-center">
      {/* Previous photo stays underneath so there's never a blank frame during the wipe */}
      {prev && (
        <Image
          src={prev.image}
          alt=""
          aria-hidden
          fill
          sizes={MISSION_IMAGE_SIZES}
          quality={MISSION_IMAGE_QUALITY}
          className="object-contain"
        />
      )}

      {/* Current photo: remounts on each change so the animations replay */}
      <div key={animKey} className={`relative ${animKey > 0 ? "mission-img-swap" : ""}`}>
        <Image
          src={active.image}
          alt={active.title}
          width={800}
          height={560}
          sizes={MISSION_IMAGE_SIZES}
          quality={MISSION_IMAGE_QUALITY}
          className={`h-auto w-full ${animKey > 0 ? "mission-img-zoom" : ""}`}
        />
      </div>

      {curtains}
    </div>
  );
}