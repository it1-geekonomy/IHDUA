import type { Metadata } from "next";
import { ImpactPreviewFrame } from "@/domains/impact/cms/ImpactPreviewFrame";

export const metadata: Metadata = {
  title: "Page Preview | IHDUA Admin",
  robots: { index: false, follow: false },
};

export default function ImpactPreviewRoute() {
  return <ImpactPreviewFrame />;
}
