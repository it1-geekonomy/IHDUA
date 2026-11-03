import type {
  ImpactCardPosition,
  ImpactStatItem,
  PaginationMeta,
} from "@/domains/admin/lib/api";

export type { ImpactCardPosition, ImpactStatItem, PaginationMeta };

export interface ImpactStatFormValues {
  cardPosition: ImpactCardPosition;
  metricName: string;
  metricValue: string;
}

export type PositionFilter = ImpactCardPosition | "all";

export interface CardPositionMeta {
  value: ImpactCardPosition;
  label: string;
  slot: string;
  theme: string;
  themeColor: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  dotColor: string;
}

export const CARD_POSITION_CONFIG: Record<ImpactCardPosition, CardPositionMeta> = {
  first: {
    value: "first",
    label: "Card 1 (Slot 1)",
    slot: "Slot 1",
    theme: "Purple Theme",
    themeColor: "#9739A8",
    badgeBg: "bg-[#FAF5FC]",
    badgeText: "text-[#9739A8]",
    badgeBorder: "border-[#9739A8]/20",
    dotColor: "bg-[#9739A8]",
  },
  second: {
    value: "second",
    label: "Card 2 (Slot 2)",
    slot: "Slot 2",
    theme: "Yellow Theme",
    themeColor: "#F5C93B",
    badgeBg: "bg-[#FFF9E6]",
    badgeText: "text-[#996B00]",
    badgeBorder: "border-[#F5C93B]/30",
    dotColor: "bg-[#F5C93B]",
  },
  third: {
    value: "third",
    label: "Card 3 (Slot 3)",
    slot: "Slot 3",
    theme: "Purple Theme",
    themeColor: "#9739A8",
    badgeBg: "bg-[#FAF5FC]",
    badgeText: "text-[#9739A8]",
    badgeBorder: "border-[#9739A8]/20",
    dotColor: "bg-[#9739A8]",
  },
  fourth: {
    value: "fourth",
    label: "Card 4 (Slot 4)",
    slot: "Slot 4",
    theme: "Yellow Theme",
    themeColor: "#F5C93B",
    badgeBg: "bg-[#FFF9E6]",
    badgeText: "text-[#996B00]",
    badgeBorder: "border-[#F5C93B]/30",
    dotColor: "bg-[#F5C93B]",
  },
};

