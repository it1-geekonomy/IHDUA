import type { Metadata } from "next";
import { figtree, lora, manrope } from "@/lib/fonts";
import { SimpleLanguageProvider } from "@/context/SimpleLanguageContext";
import { GT_BOOT_SCRIPT } from "@/utils/googleTranslate";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ihdua.org";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "International Human Development and Uplifting Academy | IHDUA",
  description: "IHDUA is a registered not-for-profit organisation working with rural and underserved communities across Karnataka.",
  icons: {
    icon: [{ url: "/IHDUAFavicon.png", type: "image/png", sizes: "192x192" }],
    apple: "/IHDUAFavicon.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${figtree.variable} ${lora.variable} ${manrope.variable}`}
    >
      <head>
        <link rel="preconnect" href="https://translate.google.com" />
        <link rel="preconnect" href="https://translate.googleapis.com" />
        {/* Keep googtrans cookie in sync with saved preference (no blank gate). */}
        <script dangerouslySetInnerHTML={{ __html: GT_BOOT_SCRIPT }} />
      </head>
      <body className="font-sans antialiased">
        <SimpleLanguageProvider>{children}</SimpleLanguageProvider>
      </body>
    </html>
  );
}