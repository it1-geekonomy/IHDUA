"use client";

import Image from "next/image";
import type { MouseEvent } from "react";
import {
  FLUID,
  FOCUS_AREAS_ID,
  type GridItem,
} from "@/domains/home/constants/development";
import { scrollToDonateSection } from "@/domains/home/lib/donation";
import { smoothScrollToId } from "@/shared/lib/smoothScroll";
import Typography from "@/lib/Typography";
import {
  BOTTOM_EDGE,
  COLUMN_A,
  COLUMN_B,
  DURATION_A,
  DURATION_B,
  FADE_MASK,
  GREY,
  KNOTS,
  LILAC,
  MARQUEE_CSS,
  MIN_PILLS_PER_HALF,
  PILL_ASPECT,
  PINK,
  RIBBON,
  TOP_EDGE,
  WAVE_MASK,
} from "@/domains/home/constants/heroConstants";

function MarqueeColumn({
  items,
  reverse = false,
  duration,
  offset = 0,
}: {
  items: GridItem[];
  reverse?: boolean;
  duration: number;
  offset?: number;
}) {
  const times = Math.max(1, Math.ceil(MIN_PILLS_PER_HALF / items.length));
  const half = Array.from({ length: times }, () => items).flat();
  const loop = [...half, ...half];

  return (
    <div className="relative h-full min-w-0 flex-1 overflow-hidden">
      <ul
        className={`hero-marquee-track flex flex-col ${reverse ? "is-reverse" : ""}`}
        style={{
          animationDuration: `${duration}s`,
          animationDelay: `-${duration * offset}s`,
        }}
      >
        {loop.map((item, i) => (
          <li key={i} aria-hidden={i >= items.length} className="pb-3 sm:pb-4">
            <div
              className={`relative w-full overflow-hidden rounded-full bg-[#EDE9DC] ${PILL_ASPECT}`}
            >
              <Image
                src={item.image}
                alt=""
                fill
                sizes="(min-width: 1024px) 14vw, (min-width: 768px) 16vw, 40vw"
                className="object-cover"
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function curve(ys: number[], u: number) {
  let i = KNOTS.findIndex((k, idx) => idx < KNOTS.length - 1 && u >= k && u <= KNOTS[idx + 1]);
  if (i < 0) i = KNOTS.length - 2;
  const h = KNOTS[i + 1] - KNOTS[i];
  const t = (u - KNOTS[i]) / h;
  const slope = (j: number) => {
    const a = Math.max(j - 1, 0);
    const b = Math.min(j + 1, KNOTS.length - 1);
    return (ys[b] - ys[a]) / (KNOTS[b] - KNOTS[a]);
  };
  const m0 = slope(i) * h;
  const m1 = slope(i + 1) * h;
  const t2 = t * t;
  const t3 = t2 * t;
  return (
    (2 * t3 - 3 * t2 + 1) * ys[i] +
    (t3 - 2 * t2 + t) * m0 +
    (-2 * t3 + 3 * t2) * ys[i + 1] +
    (t3 - t2) * m1
  );
}

const lerpColor = (a: number[], b: number[], t: number) =>
  a.map((v, i) => Math.round(v + (b[i] - v) * t));

const lineColor = (t: number) =>
  `rgb(${(t < 0.5 ? lerpColor(GREY, LILAC, t * 2) : lerpColor(LILAC, PINK, (t - 0.5) * 2)).join(",")})`;

const WAVE_LINES = Array.from({ length: RIBBON.lines }, (_, k) => {
  const t = k / (RIBBON.lines - 1);

  let d = "";
  for (let j = 0; j <= RIBBON.points; j++) {
    const u = j / RIBBON.points;
    const top = curve(TOP_EDGE, u);
    const bottom = curve(BOTTOM_EDGE, u);
    const frac = t + 0.015 * Math.sin(u * 8 + t * 6);
    const y = top + (bottom - top) * frac;
    d += `${j === 0 ? "M" : "L"}${(u * RIBBON.width).toFixed(1)} ${y.toFixed(1)} `;
  }

  return { d, stroke: lineColor(t), opacity: 0.55 };
});

function RibbonPaths() {
  return (
    <>
      {WAVE_LINES.map((line, i) => (
        <path
          key={i}
          d={line.d}
          fill="none"
          stroke={line.stroke}
          strokeOpacity={line.opacity}
          strokeWidth={1}
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </>
  );
}

function WaveRibbon() {
  return (
    <svg
      aria-hidden
      viewBox={`0 0 ${RIBBON.width} ${RIBBON.height}`}
      className="pointer-events-none absolute left-0 top-full hidden h-auto max-w-none [--rw:56vw] md:block"
      style={{
        width: "var(--rw)",
        marginTop: `calc(0.5rem - var(--rw) * ${(RIBBON.lift / RIBBON.width).toFixed(4)})`,
        maskImage: WAVE_MASK,
        WebkitMaskImage: WAVE_MASK,
      }}
    >
      <RibbonPaths />
    </svg>
  );
}

function HeroBackground() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background: [
            "linear-gradient(to bottom, rgba(253,240,190,0.75) 0%, rgba(253,244,214,0.45) 22%, rgba(253,251,245,0) 50%)",
            "linear-gradient(to left, rgba(252,237,176,0.8) 0%, rgba(253,243,205,0.45) 12%, rgba(253,251,245,0) 30%)",
            "radial-gradient(38% 32% at 62% 0%, rgba(253,238,170,0.4) 0%, transparent 70%)",
          ].join(", "),
        }}
      />
    </div>
  );
}

/** Fades the bottom of the hero into the white "Our Impact" section below. */
function BottomBlend() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-24 lg:h-32"
      style={{
        background:
          "linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0.7) 60%, #FFFFFF 100%)",
      }}
    />
  );
}

export default function RuralDevelopmentSection() {
  const handleExploreClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    smoothScrollToId(FOCUS_AREAS_ID);
  };

  return (
    <section
      id="home-top"
      className={`relative overflow-hidden bg-[#FDFBF5] pb-8 lg:pb-12 ${FLUID.sectionPaddingTop}`}
    >
      <style>{MARQUEE_CSS}</style>

      <HeroBackground />

      <div className="relative z-10 mx-auto grid max-w-[1600px] items-center gap-10 px-6 md:grid-cols-[minmax(0,1fr)_auto] md:gap-8 md:px-10 lg:gap-10 2xl:px-16">
        <div className="relative mx-auto w-full max-w-2xl text-center md:mx-0 md:max-w-none md:text-left">
          <div className="mb-4 flex items-center justify-center gap-3 font-semibold uppercase tracking-wider text-[#9739A8] md:justify-start">
            <span className="h-px w-6 bg-[#9739A8] md:hidden" />
            <Typography variant="caption" className="font-figtree font-bold tracking-normal">
              Rural Development · Karnataka
            </Typography>
            <span className="h-px w-6 bg-[#9739A8]" />
          </div>

          <Typography
            variant="h3"
            className="mx-auto max-w-[16.5em] text-balance font-lora font-medium text-[#00191B] md:hidden"
          >
            Building Stronger Communities, Creating Lasting Change
          </Typography>
          <Typography
            variant="display-xl"
            className="hidden font-lora font-normal leading-tight text-[#00191B] md:block md:!max-w-none md:!text-[clamp(1.75rem,0.6rem+3.4vw,4.5rem)] xl:!text-[clamp(3.25rem,2.6rem+0.7vw,3.5rem)]"
          >
            Building Stronger Communities, Creating Lasting Change
          </Typography>

          <Typography
            variant="body-lg"
            className={`mx-auto max-w-[33em] font-figtree font-normal leading-relaxed text-[#5F6C6D] md:mx-0 md:max-w-2xl ${FLUID.subtextMarginTop}`}
          >
            Empowering rural communities through education, sustainable livelihoods,
            healthcare, and opportunities for a better future.
          </Typography>

          <div className="mt-8 flex flex-row flex-wrap items-center justify-center gap-3 md:justify-start">
            <button
              type="button"
              onClick={scrollToDonateSection}
              className="inline-flex w-fit cursor-pointer items-center justify-center gap-2 rounded bg-[#FFD638] px-6 py-3 font-bold text-[#1E1E1E]"
            >
              <Typography variant="body-sm" className="font-figtree font-semibold text-[#1E1E1E]">
                Donate Now
              </Typography>
              <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth={2.2}>
                <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <a
              href={`#${FOCUS_AREAS_ID}`}
              onClick={handleExploreClick}
              className="inline-flex w-fit cursor-pointer rounded border border-black bg-white px-6 py-3 font-bold text-[#00191B]"
            >
              <Typography variant="body-sm" className="font-figtree font-semibold text-[#00191B]">
                Explore Our Work
              </Typography>
            </a>
          </div>

          <WaveRibbon />
        </div>

        <div
          className="hero-marquee mx-auto flex w-full max-w-sm gap-3 sm:gap-4 md:mx-0 md:w-[clamp(14rem,32vw,20rem)] md:max-w-none md:justify-self-end lg:w-[clamp(22rem,27vw,32rem)]"
          style={{ maskImage: FADE_MASK, WebkitMaskImage: FADE_MASK }}
        >
          <MarqueeColumn items={COLUMN_A} duration={DURATION_A} offset={0} />
          <MarqueeColumn items={COLUMN_B} reverse duration={DURATION_B} offset={0.35} />
        </div>
      </div>

      <BottomBlend />
    </section>
  );
}