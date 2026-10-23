import Bannersection from "@/domains/women/components/bannersection";
import Supportingwomen from "@/domains/women/components/supportingwomen";
import Creatingoppurtunity from "@/domains/women/components/creatingoppurtunity";
import Statstrip from "@/domains/women/components/StatsStripSection";
import WomenOpportunities from "@/domains/women/components/WomenOpportunitiesSection";
import NewsletterSection from "@/shared/components/Newsletter";

export default function OurTeamPage() {
  return (
    <>
      <Bannersection />
      <Supportingwomen />
      <Creatingoppurtunity />
      <WomenOpportunities />
      <Statstrip />
      <NewsletterSection />
    </>
  );
}