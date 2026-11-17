import type { Metadata } from "next";
import { FundingPortfolio } from "@/domains/donate/components/FundingPortfolio";
import { fetchFundingProjectsForDonate } from "@/domains/donate/lib/fundingProjectsApi";

export const metadata: Metadata = {
  title: "Donate | IHDUA Funding Projects",
  description:
    "Support IHDUA projects with a clear breakup of donations sought — school essentials, rural education, watershed, organic farming, and more.",
};

export const dynamic = "force-dynamic";

export default async function DonatePage() {
  const projects = await fetchFundingProjectsForDonate();

  return (
    <main className="w-full bg-white">
      <FundingPortfolio projects={projects} />
    </main>
  );
}
