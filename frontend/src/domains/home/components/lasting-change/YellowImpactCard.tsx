import Image from "next/image";
import { useId } from "react";
import Typography from "@/lib/Typography";
import { cn } from "@/lib/utils";
import { LASTING_CHANGE } from "@/domains/home/constants/lastingchange";

type YellowImpactCardProps = {
  compact?: boolean;
};

const RING_TEXT = "growth . opportunity . community . ".repeat(2);

const IMG_W = 101;
const IMG_H = 95;
const CIRCLE_CX = 67;
const CIRCLE_CY = 67;
const CIRCLE_R = 67;

const GAP = 9;
const RING_FONT_SIZE = 16;
const TEXT_CLEARANCE = 12;

const UNIT = IMG_W / 100;
const TEXT_RADIUS = (CIRCLE_R + GAP) / UNIT;
const CIRCUMFERENCE = 2 * Math.PI * TEXT_RADIUS;

const OUTER_RADIUS = (TEXT_RADIUS + RING_FONT_SIZE * 0.8) / 100;
const REACH_LEFT = (IMG_W - CIRCLE_CX) / IMG_W + OUTER_RADIUS;
const REACH_UP = (IMG_H - CIRCLE_CY) / IMG_W + OUTER_RADIUS;

const ZONE_W = `calc(var(--seal) * ${REACH_LEFT} + ${TEXT_CLEARANCE}px)`;
const ZONE_H = `calc(var(--seal) * ${REACH_UP} + ${TEXT_CLEARANCE}px)`;

function RotatingSeal() {
  const pathId = `seal-path-${useId().replace(/:/g, "")}`;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute bottom-0 right-0 z-0 w-[var(--seal)]"
      style={{ aspectRatio: `${IMG_W} / ${IMG_H}` }}
    >
      <Image
        src="/home/lastinglogo.png"
        alt=""
        fill
        sizes="120px"
        className="object-fill"
      />

      <svg
        viewBox="0 0 200 200"
        className="absolute animate-[spin_14s_linear_infinite] motion-reduce:animate-none"
        style={{
          width: "calc(var(--seal) * 2)",
          height: "calc(var(--seal) * 2)",
          left: `calc(var(--seal) * ${CIRCLE_CX / IMG_W - 1})`,
          top: `calc(var(--seal) * ${CIRCLE_CY / IMG_W - 1})`,
        }}
      >
        <defs>
          <path
            id={pathId}
            d={`M 100,100 m -${TEXT_RADIUS},0 a ${TEXT_RADIUS},${TEXT_RADIUS} 0 1,1 ${
              TEXT_RADIUS * 2
            },0 a ${TEXT_RADIUS},${TEXT_RADIUS} 0 1,1 -${TEXT_RADIUS * 2},0`}
          />
        </defs>

        <text
          className="font-figtree font-medium"
          fill="#1A1A1A"
          fontSize={RING_FONT_SIZE}
          letterSpacing="0"
        >
          <textPath
            href={`#${pathId}`}
            textLength={CIRCUMFERENCE}
            lengthAdjust="spacing"
          >
            {RING_TEXT}
          </textPath>
        </text>
      </svg>
    </div>
  );
}

function RingExclusionZone({ className }: { className?: string }) {
  return (
    <>
      <div
        aria-hidden="true"
        className={cn("pointer-events-none float-right w-0", className)}
        style={{ height: `max(0px, calc(100% - ${ZONE_H}))` }}
      />

      <div
        aria-hidden="true"
        className={cn("pointer-events-none float-right clear-right", className)}
        style={{ width: ZONE_W, height: ZONE_H }}
      />
    </>
  );
}

export function YellowImpactCard({
  compact = false,
}: YellowImpactCardProps) {
  return (
    <div
      style={{ containerType: "inline-size" }}
      className={cn(
        "relative w-full min-w-0 overflow-hidden bg-[#FFD638]",
        compact
          ? "aspect-square min-h-0 [--seal:52px] xl:[--seal:60px]"
          : "[--seal:72px] sm:[--seal:80px] xl:aspect-square xl:[--seal:76px] 2xl:[--seal:clamp(64px,22cqw,120px)]"
      )}
    >
      <div
        className={cn(
          "relative z-10",
          compact
            ? "absolute inset-0 overflow-y-auto p-3 pb-[calc(var(--seal)+16px)]"
            : "p-5 pb-24 sm:px-6 sm:pb-28 sm:pt-9 md:pt-20 md:px-7 md:pt-11 xl:absolute xl:inset-0 xl:p-7 xl:pb-7 2xl:pt-[clamp(40px,11cqw,64px)] 2xl:px-[clamp(32px,9cqw,44px)]"
        )}
      >
        <RingExclusionZone
          className={compact ? "hidden" : "hidden xl:block 2xl:hidden"}
        />

        <Typography
          className="relative font-figtree font-semibold !text-[16px] !leading-[1.4] [overflow-wrap:anywhere]"
        >
          {LASTING_CHANGE.yellowCard.title}
        </Typography>

        <Typography
          variant="body-lg"
          className="relative !mt-2 !max-w-none font-figtree !text-[13px] !leading-[1.5] text-[#7B6100] [overflow-wrap:anywhere]"
        >
          {LASTING_CHANGE.yellowCard.description}
        </Typography>
      </div>

      <RotatingSeal />
    </div>
  );
}