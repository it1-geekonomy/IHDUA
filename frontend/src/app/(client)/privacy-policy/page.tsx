import type { Metadata } from "next";
import { buildPageMetadata } from "@/shared/lib/seo";
import { getPublishedPrivacyPolicy } from "@/domains/privacy-policy/lib/privacyPolicyApi";
import PrivacyPolicyClient from "./PrivacyPolicyClient";

export async function generateMetadata(): Promise<Metadata> {
  const policy = await getPublishedPrivacyPolicy();
  return buildPageMetadata({
    path: "/privacy-policy",
    title: policy?.metaTitle,
    description: policy?.metaDescription,
  });
}

export default function PrivacyPolicyPage() {
  return <PrivacyPolicyClient />;
}
