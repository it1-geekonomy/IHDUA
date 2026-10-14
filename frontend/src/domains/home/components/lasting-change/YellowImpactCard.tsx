import Image from "next/image";
import { useId } from "react";
import Typography, { figmaTypeScale } from "@/lib/Typography";
import { cn } from "@/lib/utils";
import { LASTING_CHANGE } from "@/domains/home/constants/lastingchange";

type YellowImpactCardProps = {
  compact?: boolean;
};

const RING_TEXT = "growth . opportunity . community . ".repeat(2);

/**
 * Values MEASURED from /public/home/lastinglogo.png (pixels).
 * The purple circle is cropped by the right and bottom edges of the file.
 */
const IMG_W = 101;
const IMG_H = 95;
const CIRCLE_CX = 67; // circle center x (px)
const CIRCLE_CY = 67; // circle center y (px)
const CIRCLE_R = 67; // circle radius (px)

// Gap between the purple edge and the ring text, in px of the original image.
const GAP = 9;

// Ring text size, in svg units (scales with the seal).
const RING_FONT_SIZE = 16;

// Minimum clear space (px) between the ring and the description text.
const TEXT_CLEARANCE = 12;

// The ring svg is 2x the image width with viewBox 200, so 1 svg unit = IMG_W / 100 image px
const UNIT = IMG_W / 100;
const TEXT_RADIUS = (CIRCLE_R + GAP) / UNIT;
const CIRCUMFERENCE = 2 * Math.PI * TEXT_RADIUS;

/**
 * How far the ring reaches from the card's right / bottom edge, in "seal widths".
 */
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
      {/* Seal image exactly as exported, flush with the bottom-right corner */}
      <Image
        src="/home/lastinglogo.png"
        alt=""
        fill
        sizes="120px"
        className="object-fill"
      />

      {/* Rotating text ring, centered exactly on the purple circle's center */}
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

/**
 * Invisible floats that reserve the ring's area in the bottom-right corner,
 * so the title/description wrap around it and can never overlap it.
 * The first float is a zero-width spacer that pushes the second one down to the bottom.
 */
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

export function YellowImpactCard({ compact = false }: YellowImpactCardProps) {
  return (
    <div
      // The card is a size container, so cqw below = 1% of the card's own width.
      style={{ containerType: "inline-size" }}
      className={cn(
        "relative w-full min-w-0 overflow-hidden bg-[#FFD638]",
        compact
          ? "aspect-square min-h-0 [--seal:52px] xl:[--seal:60px]"
          : // 2xl: seal = 22% of card width (64px at 1536px, ~84px when the card is ~380px), max 120px
            "[--seal:72px] sm:[--seal:80px] xl:aspect-square xl:[--seal:76px] 2xl:[--seal:clamp(64px,22cqw,120px)]"
      )}
    >
      {/* Text layer. In the square layouts it fills the card. */}
      <div
        className={cn(
          "relative z-10",
          compact
            ? "absolute inset-0 p-4"
            : "p-5 pb-24 sm:px-6 sm:pb-28 sm:pt-9 md:pt-20 md:px-7 md:pt-11 xl:absolute xl:inset-0 xl:p-7 xl:pb-7 2xl:pt-[clamp(40px,11cqw,64px)] 2xl:px-[clamp(32px,9cqw,44px)]"
        )}
      >
        {/* Wrap-around zone: compact always, regular card only at xl (1280-1535px).
            From 2xl the text is sized to stay above the ring instead. */}
        <RingExclusionZone
          className={compact ? undefined : "hidden xl:block 2xl:hidden"}
        />

        <Typography
          className={cn(
            "relative font-figtree font-semibold leading-snug",
            compact
              ? "!text-[20px] lg:!text-[22px] leading-tight"
              : // 2xl: title grows with the card, 28px minimum
                `${figmaTypeScale[24]}`
          )}
        >
          {LASTING_CHANGE.yellowCard.title}
        </Typography>
        <Typography
          variant="body-lg"
          className={cn(
            "relative mt-3 max-w-[15rem] font-figtree leading-relaxed text-[#7B6100]",
            compact
              ? "mt-2 leading-snug"
              : // 2xl: description grows with the card, 16px minimum (about 18px when the card is ~380px)
                "sm:mt-4 md:max-w-[17rem] 2xl:mt-5 2xl:max-w-none"
          )}
        >
          {LASTING_CHANGE.yellowCard.description}
        </Typography>
      </div>

      <RotatingSeal />
    </div>
  );
}