import type { Metadata } from "next";
import { buildPageMetadata } from "@/shared/lib/seo";
import TermsAndConditionsClient from "./TermsAndConditionsClient";

/** Sync metadata so title/canonical stay in <head> without streaming delay. */
export const metadata: Metadata = buildPageMetadata({ path: "/terms-and-conditions" });

export default function TermsAndConditionsPage() {
  return <TermsAndConditionsClient />;
}
