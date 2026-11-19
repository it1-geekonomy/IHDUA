import localFont from "next/font/local";

/**
 * Variable fonts only — one file per family instead of 20+ static cuts.
 * Preload only the families needed for first paint (hero uses Lora + Figtree).
 * Italics and Manrope load on demand so they do not compete with LCP.
 */
export const figtree = localFont({
  src: [
    {
      path: "../app/Fonts/Figtree-VariableFont_wght.ttf",
      weight: "300 900",
      style: "normal",
    },
    // Italics are not on the LCP path — keep available but do not preload.
    {
      path: "../app/Fonts/Figtree-Italic-VariableFont_wght.ttf",
      weight: "300 900",
      style: "italic",
    },
  ],
  variable: "--font-figtree",
  display: "swap",
  preload: true,
});

export const lora = localFont({
  src: [
    {
      path: "../app/Fonts/Lora-VariableFont_wght.ttf",
      weight: "400 700",
      style: "normal",
    },
    {
      path: "../app/Fonts/Lora-Italic-VariableFont_wght.ttf",
      weight: "400 700",
      style: "italic",
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
