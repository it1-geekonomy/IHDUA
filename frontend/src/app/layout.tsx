import type { Metadata } from "next";
import Script from "next/script";
import { cookies, headers } from "next/headers";
import { figtree, lora, manrope } from "@/lib/fonts";
import { SimpleLanguageProvider } from "@/context/SimpleLanguageContext";
import { GT_BOOT_SCRIPT } from "@/utils/googleTranslate";
import { LANGUAGE_STORAGE_KEY } from "@/utils/languageHelper";
import { getSiteOrigin } from "@/shared/lib/siteUrl";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(getSiteOrigin()),
  title: "IHDUA | Rural Development & Community Empowerment India",
  description:
    "IHDUA drives rural development through women empowerment, education, skill training, healthcare and sustainable initiatives to build stronger communities.",
  // Stop Chrome’s own “Translated into…” bar — we handle Kannada ourselves.
  other: {
    google: "notranslate",
  },
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

function cookieSaysKannada(googtrans: string | undefined, pref: string | undefined): boolean {
  if (pref === "kn") return true;
  if (!googtrans) return false;
  try {
    return decodeURIComponent(googtrans).includes("/kn");
  } catch {
    return googtrans.includes("/kn");
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const jar = await cookies();
  const headerStore = await headers();
  const pathname = headerStore.get("x-pathname") ?? "";
  const isAdmin = pathname.startsWith("/admin");

  const wantKn =
    !isAdmin &&
    cookieSaysKannada(
      jar.get("googtrans")?.value,
      jar.get(LANGUAGE_STORAGE_KEY)?.value,
    );

  return (
    <html
      lang={wantKn ? "kn" : "en"}
      suppressHydrationWarning
      className={`${figtree.variable} ${lora.variable} ${manrope.variable}`}
    >
      {/* Do not add a manual <head> — Next owns it; a closed head dumps metadata into <body>. */}
      <body className="font-sans antialiased" suppressHydrationWarning>
        <Script
          id="gt-boot"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: GT_BOOT_SCRIPT }}
        />
        <SimpleLanguageProvider>{children}</SimpleLanguageProvider>
      </body>
    </html>
  );
}
