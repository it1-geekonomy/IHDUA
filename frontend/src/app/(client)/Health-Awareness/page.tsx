import BannerSection from "@/domains/healthandawareness/components/bannersection";
import Healthiercommunities from "@/domains/healthandawareness/components/healthiercommunities";
import Whyhealthawareness from "@/domains/healthandawareness/components/whyhealthawareness";
import AwarenessGallery from "@/domains/healthandawareness/components/AwarenessGallerySection";
import Impactstats from "@/domains/healthandawareness/components/ImpactStatsSection";
import NewsletterSection from "@/shared/components/Newsletter";

export default function OurTeamPage() {
  return (
    <> 
    <BannerSection />
    <Healthiercommunities />
    <Whyhealthawareness />
    <AwarenessGallery />
    <Impactstats />
    <NewsletterSection />
      
    </>
  );
}