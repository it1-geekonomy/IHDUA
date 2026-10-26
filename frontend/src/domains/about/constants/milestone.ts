import type { CSSProperties } from "react";

export interface Milestone {
  year: string;
  description: string;
}

export type RevealKind = "anim" | "instant";

export const DEFAULT_MILESTONES: readonly Milestone[] = [
  { year: "1991", description: "IHDUA established" },
  { year: "2005", description: "Early community initiatives" },
  { year: "2010", description: "Early community initiatives" },
  { year: "2015", description: "Expanded to more villages" },
  { year: "2020", description: "Diversified into education, health and livelihoods", },
  { year: "2025", description: "Stronger community partnerships" },
  { year: "2026", description: "Continuing the journey towards a more equitable future", },
];

export const VIEWPORT = { min: 360, max: 1920 } as const;

const toRem = (px: number) => `${+(px / 16).toFixed(4)}rem`;

export function fluid(minPx: number, maxPx: number): string {
  const slope = (maxPx - minPx) / (VIEWPORT.max - VIEWPORT.min);
  const intercept = minPx - slope * VIEWPORT.min;
  return `clamp(${toRem(minPx)}, ${toRem(intercept)} + ${+(slope * 100).toFixed(4)}vw, ${toRem(maxPx)})`;
}

export const FLUID_TOKENS = {
  "--bg": "#FAF9F5",
  "--bg-clear": "#FAF9F500",
  "--section-py": fluid(56, 112),
  "--section-px": fluid(16, 160),
  "--label-size": fluid(11, 13),
  "--label-gap": fluid(8, 12),
  "--label-line": fluid(24, 40),
  "--heading-size": fluid(30, 52),
  "--heading-mt": fluid(12, 20),
  "--timeline-mt": fluid(40, 88),
  "--node": fluid(14, 18),
  "--item-gap": fluid(12, 40),
  "--year-size": fluid(16, 22),
  "--year-mt": fluid(20, 28),
  "--desc-size": fluid(13, 14),
  "--desc-mt": fluid(6, 10),
} as CSSProperties;

export const DESKTOP_QUERY = "(min-width: 1024px)";
export const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

export const START_DELAY_MS = 150;

export const M_LINE_IN_MS = 250;
export const M_DOT_MS = 300;
export const M_LINE_OUT_MS = 350;
export const M_STEP_MS = M_LINE_IN_MS + M_DOT_MS + M_LINE_OUT_MS;

export const M_DELAYS = {
  lineIn: 0,
  dot: M_LINE_IN_MS,
  lineOut: M_LINE_IN_MS + M_DOT_MS,
  text: M_LINE_IN_MS + 100,
} as const;

export const FRAME_MS = 1000 / 60;
export const SCROLL_PER_STEP = { vh: 0.4, minPx: 240, maxPx: 416 } as const;
export const PROGRESS_SMOOTHING = 0.12;
export const SETTLE_EPSILON = 0.0005;
export const GESTURE_GAP_MS = 120;

export const LINE_BASE =
  "pointer-events-none absolute bg-[#B68DC1] motion-safe:transition-transform motion-safe:ease-linear [transition-delay:var(--dm)]";

export const VERTICAL_X =
  "left-[calc(var(--year-size)*2.6_+_0.75rem_+_var(--node)/2_-_0.5px)]";