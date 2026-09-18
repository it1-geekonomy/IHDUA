import React from "react";
import { cn } from "../lib/utils";

export interface TypographyProps {
  children: React.ReactNode;
  variant?:
    | "display-3xl"
    | "display-2xl"
    | "display-xl"
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "body-xl"
    | "body-lg"
    | "body-sm"
    | "caption"
    | "overline";
  className?: string;
  style?: React.CSSProperties;
  id?: string;
}

/**
 * Figma sizes @ 1920px → responsive (rounded whole px)
 * Scale: base ×0.65 | sm ×0.75 | md ×0.88 | lg ×1
 */
const variantStyles = {
  // 73.62 → 74
  "display-3xl":
    "text-[48px] sm:text-[55px] md:text-[65px] lg:text-[74px] font-medium",

  // 56
  "display-2xl":
    "text-[36px] sm:text-[42px] md:text-[49px] lg:text-[56px] font-medium",

  // 49.75 → 50
  "display-xl":
    "text-[33px] sm:text-[38px] md:text-[44px] lg:text-[50px] font-medium",

  // 45.62 → 46
  h1: "text-[26px] sm:text-[35px] md:text-[40px] lg:text-[46px] font-medium",

  // 41.17 → 41
  h2: "text-[27px] sm:text-[31px] md:text-[36px] lg:text-[41px] font-medium",

  // 38
  h3: "text-[25px] sm:text-[29px] md:text-[33px] lg:text-[38px] font-medium",

  // 28
  h4: "text-[18px] sm:text-[21px] md:text-[25px] lg:text-[28px] font-medium",

  // 22
  "body-xl":
    "text-[14px] sm:text-[17px] md:text-[19px] lg:text-[22px] font-normal",

  // 18
  "body-lg":
    "text-[12px] sm:text-[14px] md:text-[16px] lg:text-[18px] font-normal",

  // 16
  "body-sm":
    "text-[12px] sm:text-[12px] md:text-[14px] lg:text-[16px] font-normal",

  // 14.43 → 14
  caption:
    "text-[12px] sm:text-[12px] md:text-[12px] lg:text-[14px] font-medium uppercase tracking-wider",

  // 12
  overline:
    "text-[12px] sm:text-[12px] md:text-[12px] lg:text-[12px] font-medium uppercase tracking-widest",
};

/**
 * Full Figma type scale @ 1920 — use when you need a size not covered by a variant.
 * Scale: base ×0.65 | sm ×0.75 | md ×0.88 | lg ×1 (rounded)
 */
export const figmaTypeScale = {
  // 73.62
  74: "text-[48px] sm:text-[55px] md:text-[65px] lg:text-[74px]",
  // 56
  56: "text-[36px] sm:text-[42px] md:text-[49px] lg:text-[56px]",
  // 49.75
  50: "text-[33px] sm:text-[38px] md:text-[44px] lg:text-[50px]",
  // 49
  49: "text-[32px] sm:text-[37px] md:text-[43px] lg:text-[49px]",
  // 45.62
  46: "text-[30px] sm:text-[35px] md:text-[40px] lg:text-[46px]",
  // 41.17
  41: "text-[27px] sm:text-[31px] md:text-[36px] lg:text-[41px]",
  // 40 / 39.8
  40: "text-[26px] sm:text-[30px] md:text-[35px] lg:text-[40px]",
  // 39.25
  39: "text-[25px] sm:text-[29px] md:text-[34px] lg:text-[39px]",
  // 38
  38: "text-[25px] sm:text-[29px] md:text-[33px] lg:text-[38px]",
  // 28
  28: "text-[18px] sm:text-[21px] md:text-[25px] lg:text-[28px]",
  // 24
  24: "text-[16px] sm:text-[18px] md:text-[21px] lg:text-[24px]",
  // 22
  22: "text-[14px] sm:text-[17px] md:text-[19px] lg:text-[22px]",
  // 20 / 19.5
  20: "text-[13px] sm:text-[15px] md:text-[18px] lg:text-[20px]",
  // 18
  18: "text-[12px] sm:text-[14px] md:text-[16px] lg:text-[18px]",
  // 16.73
  17: "text-[11px] sm:text-[13px] md:text-[15px] lg:text-[17px]",
  // 16
  16: "text-[10px] sm:text-[12px] md:text-[14px] lg:text-[16px]",
  // 15.4 / 15
  15: "text-[10px] sm:text-[11px] md:text-[13px] lg:text-[15px]",
  // 14.43
  14: "text-[9px] sm:text-[11px] md:text-[13px] lg:text-[14px]",
  // 12
  12: "text-[8px] sm:text-[9px] md:text-[11px] lg:text-[12px]",
} as const;

const Typography: React.FC<TypographyProps> = ({
  children,
  variant = "body-lg",
  className,
  style,
  id,
}) => {
  const baseStyles = "";

  const getTag = () => {
    switch (variant) {
      case "display-3xl":
      case "display-2xl":
      case "display-xl":
        return "h1";

      case "h1":
      case "h2":
      case "h3":
      case "h4":
        return variant;

      case "caption":
      case "overline":
        return "span";

      default:
        return "p";
    }
  };

  return React.createElement(
    getTag(),
    {
      id,
      className: cn(baseStyles, variantStyles[variant], className),
      style,
    },
    children
  );
};

export default Typography;
