export type CaptionVariant = "edge" | "compact";
export type GridRow = "top" | "mid" | "low";

export interface GridItem {
  image: string;
  /** When provided, cross-fades to this image on hover. */

  icon: string;
  caption: string[];
  /** Any valid CSS color, applied via inline style. */
  bg: string;
  /** Tailwind text color class. */
  textColor: string;
  variant: CaptionVariant;
  row: GridRow;
}

export const FOCUS_AREAS_ID = "focus-areas";
export const MOBILE_HERO_IMAGE = "/development/mobilelayoutimg.png";

export const GRID_ITEMS: GridItem[] = [
  {
    image: "/development/rural11.png",
    icon: "/development/Dicon1.png",
    caption: ["Empowering communities,", "Creating opportunities."],
    bg: "#FFD638",
    textColor: "text-[#2B2200]",
    variant: "edge",
    row: "top",
  },
  {
    image: "/development/rural2.png",
    icon: "/development/Dicon2.png",
    caption: ["Education today,", "a brighter tomorrow."],
    bg: "#9739A8",
    textColor: "text-white",
    variant: "compact",
    row: "mid",
  },
  {
    image: "/development/dev333.png",
    icon: "/development/Dicon3.png",
    caption: ["Stronger together,", "better forever."],
    bg: "#FFD638",
    textColor: "text-[#0C0C0C]",
    variant: "compact",
    row: "low",
  },
  {
    image: "/development/dev44.png",
    icon: "/development/Dicon4.png",
    caption: ["Sustainable livelihoods,", "sustainable future."],
    bg: "#9739A8",
    textColor: "text-white",
    variant: "compact",
    row: "mid",
  },
  {
    image: "/development/rural55.png",
    icon: "/development/Dicon5.png",
    caption: ["Recognising learning, progress", "and new opportunities."],
    bg: "#FFD638",
    textColor: "text-[#2B2200]",
    variant: "edge",
    row: "top",
  },
];

export const ROW_OFFSET: Record<GridRow, string> = {
  top: "mt-0",
  mid: "mt-8",
  low: "mt-16",
};

/**
 * Fluid sizing tokens. Each clamp() replaces a former `base sm:value` pair:
 * min = old mobile value, max = old `sm` value (reached at 640px).
 * Kept as full literal strings so Tailwind's scanner can see them.
 */
export const FLUID = {
  /** 8px → 12px */
  cardGap: "gap-[clamp(0.5rem,0.25rem_+_1.25vw,0.75rem)]",
  /** 12px → 16px */
  gridGap: "gap-[clamp(0.75rem,0.25rem_+_1.875vw,1rem)]",
  /** 8px → 16px */
  gridPaddingX: "px-[clamp(0.5rem,2.5vw,1rem)]",
  /** 110px → 130px */
  edgeMinHeight: "min-h-[clamp(6.875rem,4rem_+_10.3vw,8.125rem)]",
  /** 16px → 20px */
  edgePadding: "p-[clamp(1rem,0.5rem_+_1.875vw,1.25rem)]",
  /** 56px → 66px */
  compactMinHeight: "min-h-[clamp(3.5rem,2.5rem_+_4vw,4.125rem)]",
  /** 8px → 12px */
  compactPadding: "p-[clamp(0.5rem,0.25rem_+_1.25vw,0.75rem)]",
  /** 20px → 24px */
  compactIcon:
    "h-[clamp(1.25rem,1rem_+_1.25vw,1.5rem)] w-[clamp(1.25rem,1rem_+_1.25vw,1.5rem)]",
  /** 32px → 80px (was pt-8 lg:pt-20) */
  sectionPaddingTop: "pt-[clamp(2rem,7.8vw,5rem)]",
  /** 16px → 32px (was mt-4 lg:mt-8) */
  subtextMarginTop: "mt-[clamp(1rem,0.35rem_+_2.6vw,2rem)]",
} as const;

export const CAPTION_STYLES: Record<CaptionVariant, string> = {
  edge: `flex flex-col justify-center ${FLUID.cardGap} ${FLUID.edgeMinHeight} ${FLUID.edgePadding}`,
  compact: `flex items-center gap-2 ${FLUID.compactMinHeight} ${FLUID.compactPadding}`,
};

export const ICON_STYLES: Record<CaptionVariant, string> = {
  edge: "h-6 w-6 object-contain",
  compact: `shrink-0 object-contain ${FLUID.compactIcon}`,
};