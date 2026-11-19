import localFont from "next/font/local";

/**
 * Hero LCP is the banner image (not text). Keep font preloads light so they
 * don't fight the LCP image on Slow 4G — Lora still preloads for the headline.
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
