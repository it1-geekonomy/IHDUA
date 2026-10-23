import BannerSection from "@/domains/IncreaseTheGreenCover/components/bannersection";
import Greenvillage from "@/domains/IncreaseTheGreenCover/components/greenvillage";
import Whygreencovermatters from"@/domains/IncreaseTheGreenCover/components/whygreencovermatters";
import SustainablePractices from "@/domains/IncreaseTheGreenCover/components/sustainable practices";
import Impactstats from "@/domains/IncreaseTheGreenCover/components/impactstats";
import NewsletterSection from "@/shared/components/Newsletter";

export default function OurTeamPage() {
  return (
    <> 
    <BannerSection />
    <Greenvillage />
    <Whygreencovermatters />
    <SustainablePractices/>
    <Impactstats />
    <NewsletterSection />
      
    </>
  );
}