import BannerSection from "@/domains/healthcamps/components/bannersection";
import Healthiercommunities from "@/domains/healthandawareness/components/healthiercommunities";
import Supportingcommunities from"@/domains/healthcamps/components/supportingcommunities";
import AwarenessGallery from "@/domains/healthandawareness/components/AwarenessGallerySection";
import Impactstats from "@/domains/healthcamps/components/ImpactStatsSection";
import NewsletterSection from "@/shared/components/Newsletter";

export default function OurTeamPage() {
  return (
    <> 
    <BannerSection />
    <Healthiercommunities />
    <Supportingcommunities />
    <AwarenessGallery />
    <Impactstats />
    <NewsletterSection />
      
    </>
  );
}