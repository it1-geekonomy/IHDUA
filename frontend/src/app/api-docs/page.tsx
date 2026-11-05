import type { Metadata } from "next";
import { SwaggerDocs } from "./SwaggerDocs";

export const metadata: Metadata = {
  title: "API Docs | IHDUA",
  robots: { index: false, follow: false },
};

export default function ApiDocsPage() {
  return (
    <main className="min-h-screen bg-white">
      <SwaggerDocs />
    </main>
  );
}
