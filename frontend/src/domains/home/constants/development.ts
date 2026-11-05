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

/**
 * Hero pill images. Just file paths, nothing else is needed.
 * To add an image: put the file in public/development/ and add one line here.
 * They alternate between the left and right columns automatically.
 */
export const HERO_IMAGES: string[] = [
  "https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/1793856752513-o8l5o-rectangle-81-1-.webp",
   "https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/1793856838017-xvetv-rectangle-88.webp",
  "https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/1793856874412-ok1yu-rectangle-83.webp",
  "https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/1793856907080-cyi0p-rectangle-85.webp",
   "https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/1793856937584-ylsu8-rectangle-86.webp",
   "https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/1793856967884-r47iu-rectangle-87.webp",
  "https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/1793856997086-p54c5-rectangle-88-1-.webp",
   "https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/1793857030862-rdn5v-rectangle-84.webp",
 "https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/1793857059830-z02se-rectangle-81-1-1-.webp",
  "https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/1793857090444-t878f-rectangle-88-2-.webp",
  "https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/1793857120094-5y21w-rectangle-83-1-.webp",
  "https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/1793857150303-nx8kk-rectangle-85-1-.webp",
  "https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/1793857181124-7v7n4-rectangle-86-1-.webp",
  "https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/1793857209941-cvzns-rectangle-87-1-.webp",
];

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
  sectionPaddingTop: "pt-[clamp(1rem,7.8vw,2rem)]",
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