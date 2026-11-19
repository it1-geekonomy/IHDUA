import type { Metadata } from "next";
import { FundingPortfolio } from "@/domains/donate/components/FundingPortfolio";
import { fetchFundingProjectsForDonate } from "@/domains/donate/lib/fundingProjectsApi";
import { buildPageMetadata } from "@/shared/lib/seo";

export const metadata: Metadata = buildPageMetadata({ path: "/donate" });

export const dynamic = "force-dynamic";

export default async function DonatePage() {
  const projects = await fetchFundingProjectsForDonate();

  return (
    <main className="w-full bg-white">
      <FundingPortfolio projects={projects} />
    </main>
  );
}
