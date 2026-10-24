import BannerSection from "@/domains/StitchingUnit/components/bannersection";
import WomenEmpowerment from "@/domains/StitchingUnit/components/womenempowerment";
import NewsletterSection from "@/shared/components/Newsletter";
import PracticalSkills from "@/domains/StitchingUnit/components/practicalskills"
import ForgingSection from "@/domains/StitchingUnit/components/forgingpaths"
import ImpactWeMake from "@/domains/StitchingUnit/components/impactwemake";
import GallerySingleRow from "@/domains/StitchingUnit/components/gallerysinglerow";

export default function StitchingUnitPage() {
  return (
    <>
    <BannerSection />
    <WomenEmpowerment />
    <PracticalSkills />
    <ForgingSection />
    <ImpactWeMake />
    <GallerySingleRow />
    <NewsletterSection />
      
    </>
  );
}
