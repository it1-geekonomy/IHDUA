import type { Metadata } from "next";
import { buildPageMetadata } from "@/shared/lib/seo";
import PrivacyPolicyClient from "./PrivacyPolicyClient";

/** Sync metadata so title/canonical stay in <head> without streaming delay. */
export const metadata: Metadata = buildPageMetadata({ path: "/privacy-policy" });

export default function PrivacyPolicyPage() {
  return <PrivacyPolicyClient />;
}
