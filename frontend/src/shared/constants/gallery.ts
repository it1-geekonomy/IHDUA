export const VISIBLE_COUNT = 16;

export const DRAG_THRESHOLD_RATIO = 0.2;

export const EDGE_RESISTANCE = 0.3;

export const TWO_COLUMN_QUERY = "(min-width: 640px)";

export const NAV_BUTTON_CLASS =
  "flex size-[clamp(2rem,1.5rem+1.5vw,2.25rem)] items-center justify-center rounded-sm " +
  "bg-[#FFD92E] text-[#00191B] transition-colors " +
  "enabled:hover:bg-[#F2CB1B] " +
  "disabled:cursor-not-allowed disabled:bg-[#FFF1B0] disabled:text-[#00191B]/30 " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00191B]";

export const SLIDE_WIDTH =
  "calc((100% - (var(--per-view) - 1) * var(--gap)) / var(--per-view))";