import { GRID_ITEMS, type GridItem } from "@/domains/home/constants/development";

const EVEN_ITEMS: GridItem[] = GRID_ITEMS.filter((_, i) => i % 2 === 0);
const ODD_ITEMS: GridItem[] = GRID_ITEMS.filter((_, i) => i % 2 === 1);

export const COLUMN_A = EVEN_ITEMS;
export const COLUMN_B = ODD_ITEMS.length > 0 ? ODD_ITEMS : EVEN_ITEMS;

export const DURATION_A = 38;
export const DURATION_B = 46;

export const PILL_ASPECT = "aspect-[8/15]";

export const MIN_PILLS_PER_HALF = 4;

export const FADE_MASK =
  "linear-gradient(to bottom, transparent 0%, #000 14%, #000 84%, transparent 100%)";

export const MARQUEE_CSS = `
.hero-marquee { --marquee-h: 26rem; height: var(--marquee-h); }
@media (min-width: 640px)  { .hero-marquee { --marquee-h: 32rem; } }
@media (min-width: 768px)  { .hero-marquee { --marquee-h: clamp(26rem, calc(100svh - 8rem), 40rem); } }
@media (min-width: 1024px) { .hero-marquee { --marquee-h: clamp(30rem, calc(100svh - 8rem), 48rem); } }

@keyframes hero-marquee-up {
  from { transform: translate3d(0, 0, 0); }
  to   { transform: translate3d(0, -50%, 0); }
}
.hero-marquee-track {
  animation-name: hero-marquee-up;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  will-change: transform;
}
.hero-marquee-track.is-reverse { animation-direction: reverse; }
.hero-marquee:hover .hero-marquee-track,
.hero-marquee:focus-within .hero-marquee-track { animation-play-state: paused; }
@media (prefers-reduced-motion: reduce) {
  .hero-marquee-track { animation: none; }
}
`;

export const RIBBON = { lines: 12, points: 160, width: 1100, height: 380, lift: 160 };
export const KNOTS = [0, 0.075, 0.168, 0.262, 0.355, 0.449, 0.542, 0.636, 0.729, 0.822, 0.892, 1];
export const TOP_EDGE = [296, 219, 188, 170, 167, 169, 160, 136, 90, 44, 13, 0];
export const THICKNESS = [70, 80, 90, 100, 105, 110, 115, 120, 125, 125, 120, 115];
export const BOTTOM_EDGE = TOP_EDGE.map((t, i) => t + THICKNESS[i]);

export const GREY: [number, number, number] = [205, 210, 214];
export const LILAC: [number, number, number] = [224, 208, 230];
export const PINK: [number, number, number] = [242, 190, 217];

export const WAVE_MASK =
  "linear-gradient(to right, transparent 0%, #000 18%, #000 92%, transparent 100%)";