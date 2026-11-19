import localFont from "next/font/local";

/**
 * LCP on mobile is the hero headline (Lora). Preload only that normal cut.
 * Figtree/Manrope + italics load with font-display:swap and must not compete
 * with LCP on Slow 4G.
 */
export const figtree = localFont({
  src: [
    {
      path: "../app/Fonts/Figtree-VariableFont_wght.ttf",
      weight: "300 900",
      style: "normal",
    },
  ],
  variable: "--font-figtree",
  display: "swap",
  preload: false,
});

export const lora = localFont({
  src: [
    {
      path: "../app/Fonts/Lora-VariableFont_wght.ttf",
      weight: "400 700",
      style: "normal",
    },
  ],
  variable: "--font-lora",
  display: "swap",
  preload: true,
});

export const manrope = localFont({
  src: [
    {
      path: "../app/Fonts/Manrope-VariableFont_wght.ttf",
      weight: "200 800",
      style: "normal",
    },
  ],
  variable: "--font-manrope",
  display: "swap",
  preload: false,
});
