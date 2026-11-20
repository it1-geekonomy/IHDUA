import localFont from "next/font/local";

/**
 * Hero LCP is the banner image — do not preload fonts that compete with it
 * on Slow 4G (PSI). swap still paints text once the file arrives.
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
  preload: false,
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
