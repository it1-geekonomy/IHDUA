import localFont from "next/font/local";

// Figtree — full weight range, normal + italic
export const figtree = localFont({
  src: [
    { path: "../app/Fonts/Figtree-Light.ttf", weight: "300", style: "normal" },
    { path: "../app/Fonts/Figtree-LightItalic.ttf", weight: "300", style: "italic" },
    { path: "../app/Fonts/Figtree-Regular.ttf", weight: "400", style: "normal" },
    { path: "../app/Fonts/Figtree-Italic.ttf", weight: "400", style: "italic" },
    { path: "../app/Fonts/Figtree-Medium.ttf", weight: "500", style: "normal" },
    { path: "../app/Fonts/Figtree-MediumItalic.ttf", weight: "500", style: "italic" },
    { path: "../app/Fonts/Figtree-SemiBold.ttf", weight: "600", style: "normal" },
    { path: "../app/Fonts/Figtree-SemiBoldItalic.ttf", weight: "600", style: "italic" },
    { path: "../app/Fonts/Figtree-Bold.ttf", weight: "700", style: "normal" },
    { path: "../app/Fonts/Figtree-BoldItalic.ttf", weight: "700", style: "italic" },
    { path: "../app/Fonts/Figtree-ExtraBold.ttf", weight: "800", style: "normal" },
    { path: "../app/Fonts/Figtree-ExtraBoldItalic.ttf", weight: "800", style: "italic" },
    { path: "../app/Fonts/Figtree-Black.ttf", weight: "900", style: "normal" },
    { path: "../app/Fonts/Figtree-BlackItalic.ttf", weight: "900", style: "italic" },
  ],
  variable: "--font-figtree",
  display: "swap",
});

// Lora — serif, good for headings/quotes
export const lora = localFont({
  src: [
    { path: "../app/Fonts/Lora-Regular.ttf", weight: "400", style: "normal" },
    { path: "../app/Fonts/Lora-Italic.ttf", weight: "400", style: "italic" },
    { path: "../app/Fonts/Lora-Medium.ttf", weight: "500", style: "normal" },
    { path: "../app/Fonts/Lora-MediumItalic.ttf", weight: "500", style: "italic" },
    { path: "../app/Fonts/Lora-SemiBold.ttf", weight: "600", style: "normal" },
    { path: "../app/Fonts/Lora-SemiBoldItalic.ttf", weight: "600", style: "italic" },
    { path: "../app/Fonts/Lora-Bold.ttf", weight: "700", style: "normal" },
    { path: "../app/Fonts/Lora-BoldItalic.ttf", weight: "700", style: "italic" },
  ],
  variable: "--font-lora",
  display: "swap",
});

// Manrope — no italics shipped
export const manrope = localFont({
  src: [
    { path: "../app/Fonts/Manrope-ExtraLight.ttf", weight: "200", style: "normal" },
    { path: "../app/Fonts/Manrope-Light.ttf", weight: "300", style: "normal" },
    { path: "../app/Fonts/Manrope-Regular.ttf", weight: "400", style: "normal" },
    { path: "../app/Fonts/Manrope-Medium.ttf", weight: "500", style: "normal" },
    { path: "../app/Fonts/Manrope-SemiBold.ttf", weight: "600", style: "normal" },
    { path: "../app/Fonts/Manrope-Bold.ttf", weight: "700", style: "normal" },
    { path: "../app/Fonts/Manrope-ExtraBold.ttf", weight: "800", style: "normal" },
  ],
  variable: "--font-manrope",
  display: "swap",
});