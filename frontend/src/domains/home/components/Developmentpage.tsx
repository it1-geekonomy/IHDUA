import Link from "next/link";
import { FLUID } from "@/domains/home/constants/development";
import Typography from "@/lib/Typography";
import { ExploreWorkLink } from "@/domains/home/components/ExploreWorkLink";
import { HeroMarquee } from "@/domains/home/components/HeroMarquee";
import {
  BOTTOM_EDGE,
  GREY,
  KNOTS,
  LILAC,
  PINK,
  RIBBON,
  TOP_EDGE,
  WAVE_MASK,
} from "@/domains/home/constants/heroConstants";

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

export default function RuralDevelopmentSection({
  bannerImages = [],
}: {
  /** SSR banner URLs — required for LCP preload (no client waterfall). */
  bannerImages?: string[];
}) {
  const imagesA = bannerImages.filter((_, i) => i % 2 === 0);
  const imagesBOdd = bannerImages.filter((_, i) => i % 2 === 1);
  const imagesB = imagesBOdd.length > 0 ? imagesBOdd : imagesA;
  const noBanners = bannerImages.length === 0;

  const lcpSrc = imagesA[0] || null;

  return (
    <section
      id="home-top"
      className={`relative overflow-hidden bg-[#FDFBF5] pb-8 lg:pb-12 ${FLUID.sectionPaddingTop}`}
    >
      {/* Discover LCP image before JS — direct R2 URL, no /_next/image hop. */}
      {lcpSrc ? (
        <link rel="preload" as="image" href={lcpSrc} fetchPriority="high" />
      ) : null}

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
            as="h1"
            variant="h3"
            className="mx-auto max-w-[16.5em] text-balance font-lora font-medium text-[#00191B] md:mx-0 md:max-w-none md:text-[clamp(1.75rem,0.6rem+3.4vw,4.5rem)] md:font-normal md:leading-tight xl:text-[clamp(3.25rem,2.6rem+0.7vw,3.5rem)]"
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
            <Link
              href="/donate"
              className="inline-flex w-fit cursor-pointer items-center justify-center gap-2 rounded bg-[#FFD638] px-6 py-3 font-bold text-[#1E1E1E]"
            >
              <Typography variant="body-sm" className="font-figtree font-semibold text-[#1E1E1E]">
                Donate Now
              </Typography>
              <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth={2.2}>
                <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <ExploreWorkLink className="inline-flex w-fit cursor-pointer rounded border border-black bg-white px-6 py-3 font-bold text-[#00191B]">
              <Typography variant="body-sm" className="font-figtree font-semibold text-[#00191B]">
                Explore Our Work
              </Typography>
            </ExploreWorkLink>
          </div>

          <WaveRibbon />
        </div>

        {noBanners ? (
          <div className="mx-auto flex min-h-[14rem] w-full max-w-sm items-center justify-center rounded-2xl border border-dashed border-[#D9D4C4] bg-white/60 px-6 py-10 text-center md:mx-0 md:w-[clamp(14rem,32vw,20rem)] md:max-w-none md:justify-self-end lg:w-[clamp(22rem,27vw,32rem)]">
            <Typography
              variant="body-sm"
              className="max-w-xs font-figtree font-normal leading-relaxed text-[#5F6C6D]"
            >
              New banners and updates will be displayed here soon.
            </Typography>
          </div>
        ) : (
          <HeroMarquee imagesA={imagesA} imagesB={imagesB} />
        )}
      </div>

      <BottomBlend />
    </section>
  );
}
