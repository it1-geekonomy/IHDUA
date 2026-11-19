import type { Metadata } from "next";
import { buildPageMetadata } from "@/shared/lib/seo";
import { getPublishedTerms } from "@/domains/terms-and-conditions/lib/termsApi";
import TermsAndConditionsClient from "./TermsAndConditionsClient";

export async function generateMetadata(): Promise<Metadata> {
  const terms = await getPublishedTerms();
  return buildPageMetadata({
    path: "/terms-and-conditions",
    title: terms?.metaTitle,
    description: terms?.metaDescription,
  });
}

export default function TermsAndConditionsPage() {
  return <TermsAndConditionsClient />;
}
