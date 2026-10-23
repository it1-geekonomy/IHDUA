export type CardTheme = "purple" | "amber";

export const THEMES: Record<CardTheme, { card: string; arrow: string }> = {
  purple: {
    card: "border-[#EEE3FE] bg-gradient-to-b from-white to-[#EEE3FE]",
    arrow: "bg-[#936DC5]",
  },
  amber: {
    card: "border-[#FFEFD0] bg-gradient-to-b from-white to-[#FFEFD0]",
    arrow: "bg-[#E9C274]",
  },
};

export const THEME_ORDER: CardTheme[] = ["purple", "amber"];

export const SECTION_PADDING_X =
  "px-6 lg:px-[clamp(2.5rem,-35rem_+_46.875vw,10rem)]";
export const SECTION_PADDING_Y =
  "pt-6 lg:py-[clamp(3rem,-1rem_+_6.25vw,4rem)]";
export const SECTION_GAP =
  "gap-8 lg:gap-[clamp(2.5rem,-1.5rem_+_6.25vw,3.5rem)]";

export const TEXT_COLUMN_GAP =
  "gap-3 lg:gap-[clamp(0.5rem,-5.5rem_+_9.375vw,2rem)]";
export const HEADING_GROUP_GAP = "gap-[clamp(0.75rem,1.5625vw,1rem)]";

export const GRID_GAP = "gap-4 lg:gap-[clamp(1rem,1.5625vw,1.25rem)]";

export const CAPTION_MARGIN_TOP =
  "mt-2 sm:mt-[clamp(0.25rem,-2.25rem_+_6.25vw,0.75rem)]";
export const ARROW_BOX =
  "h-[clamp(1.75rem,1.0425rem_+_3.0189vw,2.25rem)] w-[clamp(1.75rem,1.0425rem_+_3.0189vw,2.25rem)]";
export const ARROW_ICON =
  "h-[clamp(1rem,0.6462rem_+_1.5094vw,1.25rem)] w-[clamp(1rem,0.6462rem_+_1.5094vw,1.25rem)]";