"use client";

import { LASTING_CHANGE } from "@/domains/home/constants/lastingchange";
import { ImageCard } from "./ImageCard";
import { YellowImpactCard } from "./YellowImpactCard";
import { PurpleStatsCard } from "./PurpleStatsCard";
import { CtaBlock, HeadlineBlock } from "./ContentBlocks";

const [community, livelihoods, education] = LASTING_CHANGE.imageCards;

/** < sm — full vertical stack */
export function MobileStack() {
  return (
    <div className="flex flex-col gap-4 sm:hidden">
      <ImageCard image={community.image} label={community.label} />
      <YellowImpactCard />
      <HeadlineBlock />
      <ImageCard image={livelihoods.image} label={livelihoods.label} />
      <ImageCard image={education.image} label={education.label} />
      <PurpleStatsCard />
      <CtaBlock />
    </div>
  );
}

/** sm → lg — 2 cards → headline → 3 cards → CTA */
export function SmToLgLayout() {
  return (
    <div className="hidden min-w-0 flex-col gap-4 sm:flex lg:hidden">
      <div className="grid min-w-0 grid-cols-2 gap-3 md:gap-4">
        <ImageCard image={community.image} label={community.label} />
        <YellowImpactCard />
      </div>

      <HeadlineBlock />

      <div className="grid min-w-0 grid-cols-3 gap-3 md:gap-4">
        <ImageCard image={livelihoods.image} label={livelihoods.label} />
        <ImageCard image={education.image} label={education.label} />
        <PurpleStatsCard className="min-w-0 overflow-hidden" />
      </div>

      <CtaBlock />
    </div>
  );
}

/** lg → xl — equal-height square bento */
export function LgToXlLayout() {
  return (
    <div className="hidden grid-cols-4 items-start gap-4 lg:grid xl:hidden">
      <ImageCard image={community.image} label={community.label} />
      <YellowImpactCard compact />
      <HeadlineBlock variant="lg" />
      <CtaBlock variant="lg" />
      <ImageCard image={livelihoods.image} label={livelihoods.label} />
      <ImageCard image={education.image} label={education.label} />
      <PurpleStatsCard compact />
    </div>
  );
}

/** xl+ — original desktop grid */
export function XlLayout() {
  return (
    <div className="hidden xl:grid xl:grid-cols-4 xl:gap-5 2xl:gap-6">
      <ImageCard image={community.image} label={community.label} />
      <YellowImpactCard />
      <HeadlineBlock variant="xl" />
      <CtaBlock variant="xl" />
      <ImageCard image={livelihoods.image} label={livelihoods.label} />
      <ImageCard image={education.image} label={education.label} />
      <PurpleStatsCard />
    </div>
  );
}
