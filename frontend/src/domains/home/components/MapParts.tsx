import { DULL, HIGHLIGHT, type Region, type RegionId } from "@/domains/home/constants/mapdata";

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

function Label({
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
    <g pointerEvents="none">
      <rect x={x} y={y} width={w} height={h} rx={h / 2.4} fill="#fff" fillOpacity={0.94} />
      {lines.map((line, i) => (
        <text
          key={line}
          x={x + 13}
          y={y + 16 + i * 14}
          fontSize={12}
          fontWeight={500}
          fill="#1E2627"
          className="font-figtree"
        >
          {line}
        </text>
      ))}
    </g>
  );
}

/**
 * Pin, label and region name.
 * Rendered in a separate top layer (after all regions) so a neighbouring
 * region's fill can never paint over a label.
 */
export function RegionExtras({ id }: { id: RegionId }) {
  if (id === "mysuru") {
    return (
      <>
        <text x={107} y={240} textAnchor="middle" fontSize={10.5} letterSpacing={2.2} fill="#A59E8A" className="font-lora">
          MYSURU
        </text>
        <Pin x={169} y={238} color="#FFD056" />
        <Label x={181} y={206} w={104} lines={["Mulluru Village,", "Mysuru"]} />
      </>
    );
  }
  if (id === "mandya") {
    return (
      <>
        <text x={447} y={172} textAnchor="middle" fontSize={10.5} letterSpacing={2.2} fill="#9C8F70" className="font-lora">
          MANDYA
        </text>
        <Pin x={369} y={133} color={HIGHLIGHT} />
        <Label x={380} y={108} w={90} lines={["KRS, Mandya"]} />
      </>
    );
  }
  return (
    <>
      <text x={294} y={384} textAnchor="middle" fontSize={11} letterSpacing={2.2} fill="#4F6350" className="font-lora">
        GUNDLUPETE
      </text>
      <text x={287} y={400} textAnchor="middle" fontSize={11} letterSpacing={2.2} fill="#4F6350" className="font-lora">
        TALUK
      </text>
      <Pin x={262} y={339} color={HIGHLIGHT} />
      <Label x={274} y={312} w={112} lines={["Gundlupete Taluk"]} />
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