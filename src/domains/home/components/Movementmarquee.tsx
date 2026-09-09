import React from "react";
import { ICON_SRC, ITEMS } from "@/domains/home/constants/marquee";
import Typography from "@/lib/Typography";

const REPEAT_COUNT = 4;
const REPEATED_ITEMS = Array.from({ length: REPEAT_COUNT }).flatMap(() => ITEMS);

const BASE_DURATION_SECONDS = 22;
const ANIMATION_DURATION_SECONDS = BASE_DURATION_SECONDS * REPEAT_COUNT;

interface MarqueeTrackProps {
  ariaHidden: boolean;
}

function MarqueeTrack({ ariaHidden }: MarqueeTrackProps) {
  return (
    <div className="flex flex-shrink-0 items-center leading-none" aria-hidden={ariaHidden}>
      {REPEATED_ITEMS.map((label, i) => (
        <span key={i} className="flex items-center whitespace-nowrap leading-none">
          <Typography
            variant="body-xl"
            className="font-semibold font-figtree tracking-wide text-white leading-none"
          >
            {label}
          </Typography>
          <img
            src={ICON_SRC}
            alt=""
            aria-hidden="true"
            className="mx-3 sm:mx-4 h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0 block"
          />
        </span>
      ))}
    </div>
  );
}
export default function MovementMarquee() {
  return (
    <div
      role="marquee"
      aria-label="Our focus areas"
      className="group m-0 block w-full overflow-hidden bg-[#9739A8] py-[18px] leading-none"
    >
      <div
        className="flex w-max animate-[movement-marquee-scroll_var(--marquee-duration)_linear_infinite]
                   group-hover:[animation-play-state:paused]
                   motion-reduce:animate-none"
        style={{ ["--marquee-duration" as string]: `${ANIMATION_DURATION_SECONDS}s` }}
      >
        <MarqueeTrack ariaHidden={false} />
        <MarqueeTrack ariaHidden={true} />
      </div>
      <style>{`
        @keyframes movement-marquee-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}