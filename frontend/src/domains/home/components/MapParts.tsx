"use client";

import { DULL, HIGHLIGHT, W, H, type Region, type RegionId } from "@/domains/home/constants/mapdata";
import { useSimpleLanguage } from "@/context/SimpleLanguageContext"; // <-- fix this import path
import { LANGUAGES } from "@/utils/languageHelper";

export function Hill({ x, y, w }: { x: number; y: number; w: number }) {
  const h = w * 0.38;
  return (
    <g transform={`translate(${x} ${y})`} fill="none" stroke="#C4C9B8" strokeWidth={1} strokeLinecap="round" strokeLinejoin="round" pointerEvents="none">
      <path d={`M${-w / 2} ${h / 2} L${-w * 0.18} ${-h / 2} L0 ${-h * 0.05} L${w * 0.2} ${-h * 0.6} L${w / 2} ${h / 2}`} />
      <path d={`M${-w * 0.18} ${-h / 2} L${-w * 0.06} ${-h * 0.05}`} />
    </g>
  );
}

export function Tree({ x, y, h }: { x: number; y: number; h: number }) {
  const s = h / 18;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} fill="#BFCDB5" fillOpacity={0.85} pointerEvents="none">
      <path d="M0 -9 L-4.5 -2 H-2 L-5.5 3.5 H5.5 L2 -2 H4.5 Z" />
      <rect x={-0.9} y={3.5} width={1.8} height={5.5} />
    </g>
  );
}

function Pin({ x, y, color }: { x: number; y: number; color: string }) {
  // (x, y) is the tip of the pin
  return (
    <g transform={`translate(${x} ${y}) scale(0.68)`} pointerEvents="none">
      <path
        d="M0 0 C-12 -16 -17 -24 -17 -31 a17 17 0 1 1 34 0 c0 7 -5 15 -17 31z"
        fill={color}
      />
      <circle cx="0" cy="-31" r="7" fill="#fff" />
      <circle cx="0" cy="16" r="4" fill={color} />
    </g>
  );
}

/** SVG layer: pins only (no text, so nothing here needs translating). */
export function RegionPins({ id }: { id: RegionId }) {
  if (id === "mysuru") return <Pin x={169} y={238} color="#FFD056" />;
  if (id === "mandya") return <Pin x={369} y={133} color={HIGHLIGHT} />;
  return <Pin x={262} y={339} color={HIGHLIGHT} />;
}

/* ------------------------------------------------------------------ */
/* HTML overlay: real DOM text, so Google Translate can translate it.  */
/* Google Translate skips everything inside <svg>, which is why the    */
/* labels live outside it. Sizes use container-query units (cqw) so    */
/* they scale exactly like the SVG viewBox does.                       */
/* ------------------------------------------------------------------ */

// SVG units -> cqw (the overlay's container is as wide as the viewBox)
const u = (n: number) => `${((n / W) * 100).toFixed(4)}cqw`;
const px = (x: number) => `${((x / W) * 100).toFixed(4)}%`;
const py = (y: number) => `${((y / H) * 100).toFixed(4)}%`;

function RegionName({
  x,
  y,
  size,
  color,
  spaced,
  children,
}: {
  x: number;
  y: number;
  size: number;
  color: string;
  spaced: boolean;
  children: string;
}) {
  return (
    <span
      className="absolute whitespace-nowrap font-lora"
      style={{
        left: px(x),
        top: py(y),
        transform: "translate(-50%, -80%)", // (x, y) = baseline centre, like the old SVG <text>
        fontSize: u(size),
        lineHeight: 1,
        letterSpacing: spaced ? u(2.2) : "normal",
        color,
      }}
    >
      {children}
    </span>
  );
}

function PillLabel({
  x,
  y,
  w,
  lines,
}: {
  x: number;
  y: number;
  w: number;
  lines: string[];
}) {
  const h = lines.length * 14 + 10;
  return (
    <div
      className="absolute whitespace-nowrap font-figtree font-medium text-[#1E2627]"
      style={{
        left: px(x),
        top: py(y),
        minWidth: u(w),
        boxSizing: "border-box",
        padding: `${u(5)} ${u(10)} ${u(5)} ${u(13)}`,
        borderRadius: u(h / 2.4),
        background: "rgba(255,255,255,0.94)",
        fontSize: u(12),
        lineHeight: u(14),
      }}
    >
      {lines.map((line) => (
        <span key={line} className="block">
          {line}
        </span>
      ))}
    </div>
  );
}

/** HTML layer: region names + pill labels (plain English; the translator converts them). */
export function RegionLabels({ id }: { id: RegionId }) {
  const { language } = useSimpleLanguage();
  const spaced = language === LANGUAGES.ENGLISH; // letter-spacing breaks Kannada conjuncts

  if (id === "mysuru") {
    return (
      <>
        <RegionName x={107} y={240} size={10.5} color="#A59E8A" spaced={spaced}>
          MYSURU
        </RegionName>
        <PillLabel x={181} y={206} w={104} lines={["Mulluru Village,", "Mysuru"]} />
      </>
    );
  }
  if (id === "mandya") {
    return (
      <>
        <RegionName x={447} y={172} size={10.5} color="#9C8F70" spaced={spaced}>
          MANDYA
        </RegionName>
        <PillLabel x={380} y={108} w={90} lines={["KRS, Mandya"]} />
      </>
    );
  }
  return (
    <>
      <RegionName x={294} y={384} size={11} color="#4F6350" spaced={spaced}>
        GUNDLUPETE
      </RegionName>
      <RegionName x={287} y={400} size={11} color="#4F6350" spaced={spaced}>
        TALUK
      </RegionName>
      <PillLabel x={274} y={312} w={112} lines={["Gundlupete Taluk"]} />
    </>
  );
}

/** One region: fill, its single border, hills/trees. */
export function RegionArt({ r, popped }: { r: Region; popped: boolean }) {
  return (
    <g pointerEvents="none">
      <path
        d={r.path}
        fill={popped ? r.hoverFill : r.fill}
        filter={popped ? "url(#gf-shadow)" : undefined}
      />
      {r.hills.map(([x, y, w]) => (
        <Hill key={`h-${x}-${y}`} x={x} y={y} w={w} />
      ))}
      {r.trees.map(([x, y, h]) => (
        <Tree key={`t-${x}-${y}`} x={x} y={y} h={h} />
      ))}
      <path
        d={r.path}
        fill="none"
        stroke={DULL}
        strokeWidth={1.3}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </g>
  );
}