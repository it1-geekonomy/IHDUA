import type { Metadata } from "next";
import { figtree, lora, manrope } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "IHDUA",
  description: "IHDUA",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${figtree.variable} ${lora.variable} ${manrope.variable}`}
    >
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}