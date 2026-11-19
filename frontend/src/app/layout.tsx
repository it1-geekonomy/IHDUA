import type { Metadata } from "next";
import { figtree, lora, manrope } from "@/lib/fonts";
import { SimpleLanguageProvider } from "@/context/SimpleLanguageContext";
import { GT_BOOT_SCRIPT } from "@/utils/googleTranslate";
import { getSiteOrigin } from "@/shared/lib/siteUrl";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(getSiteOrigin()),
  title: "IHDUA | Rural Development & Community Empowerment India",
  description:
    "IHDUA drives rural development through women empowerment, education, skill training, healthcare and sustainable initiatives to build stronger communities.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "IHDUA | Rural Development & Community Empowerment India",
    description:
      "IHDUA drives rural development through women empowerment, education, skill training, healthcare and sustainable initiatives to build stronger communities.",
    url: "/",
    type: "website",
    siteName: "IHDUA",
  },
  twitter: {
    card: "summary_large_image",
    title: "IHDUA | Rural Development & Community Empowerment India",
    description:
      "IHDUA drives rural development through women empowerment, education, skill training, healthcare and sustainable initiatives to build stronger communities.",
  },
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