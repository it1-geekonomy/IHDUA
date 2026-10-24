"use client";

import { useState } from "react";
import Typography from "@/lib/Typography";
import {
  H,
  W,
  POP,
  REGIONS,
  ROWS,
  LINE_GROUPS,
  FREE_HILLS,
  FREE_TREES,
  NEIGHBOUR_PATH,
  RESERVOIR_PATH,
  RESERVOIR_ARM_PATH,
  type RegionId,
} from "@/domains/home/constants/mapdata";
import { Hill, Tree, RegionArt, RegionExtras } from "./MapParts";

export default function GeographicFootprint() {
  const [active, setActive] = useState<RegionId | null>(null);

  return (
    <section className="w-full bg-white">
      <div className="w-full px-6 pt-6 pb-6 lg:py-24 lg:px-10 2xl:px-40">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-x-6 lg:gap-y-12 xl:gap-x-16 xl:gap-y-16">
          <div className="order-2 mx-auto aspect-[542/528] w-full max-w-sm lg:order-none lg:col-start-1 lg:row-start-2 lg:mx-0 lg:aspect-auto lg:max-w-none xl:order-1 xl:row-start-1">
            <svg
              viewBox={`0 0 ${W} ${H}`}
              className="block h-full w-full lg:h-auto lg:max-h-[640px]"
              role="img"
              aria-label="Map showing the active regions of Mysuru, Mandya and Gundlupete Taluk"
            >
              <defs>
                <clipPath id="gf-card">
                  <rect width={W} height={H} rx={14} />
                </clipPath>
                <radialGradient id="gf-soft">
                  <stop offset="0%" stopColor="#CFDDC6" stopOpacity={0.45} />
                  <stop offset="100%" stopColor="#CFDDC6" stopOpacity={0} />
                </radialGradient>
                <filter id="gf-shadow" x="-20%" y="-20%" width="140%" height="145%">
                  <feDropShadow dx={0} dy={5} stdDeviation={4.5} floodColor="#2F3B2C" floodOpacity={0.28} />
                </filter>
              </defs>

              <g clipPath="url(#gf-card)">
                {/* Card background */}
                <rect width={W} height={H} fill="#FAF7F0" pointerEvents="none" />
                <circle cx={14} cy={118} r={62} fill="url(#gf-soft)" pointerEvents="none" />
                <circle cx={108} cy={415} r={92} fill="url(#gf-soft)" pointerEvents="none" />

                {/* Neighbouring taluk (not interactive) */}
                <path d={NEIGHBOUR_PATH} fill="#E9EEDF" pointerEvents="none" />

                {/* Non-interactive boundaries and rivers */}
                {LINE_GROUPS.map((g) => (
                  <path
                    key={g.stroke}
                    d={g.d}
                    fill="none"
                    stroke={g.stroke}
                    strokeWidth={g.width}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    pointerEvents="none"
                  />
                ))}
                {FREE_HILLS.map(([x, y, w]) => (
                  <Hill key={`fh-${x}-${y}`} x={x} y={y} w={w} />
                ))}
                {FREE_TREES.map(([x, y, h]) => (
                  <Tree key={`ft-${x}-${y}`} x={x} y={y} h={h} />
                ))}

                {/* Resting state of the three regions (dull borders) */}
                {REGIONS.map((r) => (
                  <g
                    key={`base-${r.id}`}
                    style={{ opacity: active === r.id ? 0 : 1, transition: POP }}
                    pointerEvents="none"
                  >
                    <RegionArt r={r} popped={false} />
                  </g>
                ))}

                {/* KRS reservoir */}
                <path d={RESERVOIR_ARM_PATH} fill="#E1EEEE" pointerEvents="none" />
                <path
                  d={RESERVOIR_PATH}
                  fill="#CDE4E9"
                  stroke="#A9CBD6"
                  strokeWidth={0.8}
                  strokeLinejoin="round"
                  pointerEvents="none"
                />

                {/* Hovered state: the region pops up, only its border highlights */}
                {REGIONS.map((r) => (
                  <g
                    key={`pop-${r.id}`}
                    pointerEvents="none"
                    style={{
                      opacity: active === r.id ? 1 : 0,
                      transform: active === r.id ? "translateY(-5px) scale(1.03)" : "none",
                      transformOrigin: `${r.origin[0]}px ${r.origin[1]}px`,
                      transformBox: "view-box",
                      transition: POP,
                    }}
                  >
                    <RegionArt r={r} popped />
                  </g>
                ))}

                {/* Pins + labels: always above every region, lift with their region on hover */}
                {REGIONS.map((r) => (
                  <g
                    key={`extras-${r.id}`}
                    pointerEvents="none"
                    style={{
                      transform: active === r.id ? "translateY(-5px) scale(1.03)" : "none",
                      transformOrigin: `${r.origin[0]}px ${r.origin[1]}px`,
                      transformBox: "view-box",
                      transition: POP,
                    }}
                  >
                    <RegionExtras id={r.id} />
                  </g>
                ))}

                {/* Invisible hit areas (static, so hover never flickers) */}
                {REGIONS.map((r) => (
                  <path
                    key={`hit-${r.id}`}
                    d={r.path}
                    fill="transparent"
                    className="cursor-pointer outline-none"
                    tabIndex={0}
                    aria-label={r.label}
                    onMouseEnter={() => setActive(r.id)}
                    onMouseLeave={() => setActive(null)}
                    onFocus={() => setActive(r.id)}
                    onBlur={() => setActive(null)}
                  />
                ))}
              </g>
            </svg>
          </div>

          <div className="order-1 flex flex-col lg:order-none lg:contents xl:order-2 xl:flex xl:row-start-1 xl:col-start-2">
            {/* Header */}
            <div className="flex flex-col lg:col-span-2 lg:row-start-1 lg:items-center xl:col-span-1 xl:items-stretch">
              <div className="flex items-center justify-center gap-3 xl:justify-start">
                <span className="h-px w-6 bg-[#9739A8]" aria-hidden="true" />
                <Typography
                  variant="caption"
                  className="font-bold font-figtree text-[#9739A8]"
                >
                  GEOGRAPHIC FOOTPRINT
                </Typography>
                <span className="h-px w-6 bg-[#9739A8]" aria-hidden="true" />
              </div>

              <Typography
                variant="display-xl"
                className="mx-auto mt-5 max-w-3xl text-center leading-tight font-normal font-lora lg:max-w-none lg:w-full xl:mx-0 xl:w-auto xl:max-w-4xl xl:text-left"
              >
                Rooted in communities. Creating change where it matters.
              </Typography>
            </div>

            {/* Body */}
            <div className="flex flex-col lg:col-start-2 lg:row-start-2">
              <Typography
                variant="body-lg"
                className="mx-auto mt-5 max-w-2xl text-center leading-relaxed text-[#5F6C6D] font-normal font-figtree lg:mx-0 lg:mt-0 lg:text-left xl:mt-5"
              >
                IHDUA works across the villages of Gundlupete taluk and supports two rural schools in Mulluru Village, Mysuru, and KRS, Mandya.
              </Typography>

              <div className="mt-8 lg:mt-10 xl:mt-16 flex flex-col">
                {ROWS.map((row) => (
                  <div
                    key={row.label}
                    onMouseEnter={() => setActive(row.region)}
                    onMouseLeave={() => setActive(null)}
                    className="flex items-center justify-between gap-4 py-4 border-b border-[#E3ECEC]"
                  >
                    <Typography variant="body-lg" className="font-semibold font-figtree text-[#1E2627]">
                      {row.label}
                    </Typography>
                    <Typography
                      variant="body-lg"
                      className="text-right font-semibold font-figtree text-[#9739A8]"
                    >
                      {row.value}
                    </Typography>
                  </div>
                ))}
              </div>

              <a
                href="#"
                className="mt-9 lg:mt-10 xl:mt-14 mx-auto flex w-fit items-center gap-2 rounded bg-[#FFD638] px-6 py-3 transition-opacity lg:mx-0"
              >
                <Typography variant="body-lg" className="font-medium font-figtree text-[#1E1E1E]">
                  Learn More
                </Typography>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={3}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-4 h-4 shrink-0"
                  aria-hidden="true"
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}