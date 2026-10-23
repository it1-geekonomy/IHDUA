import Bannersection from "@/domains/farmers/components/bannersection";
import Sustainablefarming from "@/domains/farmers/components/sustainablefarming";
import WhySustainablefarming from "@/domains/farmers/components/whysustainablefarming";
import SupportingFarmers from "@/domains/farmers/components/supportingfarmers";
import SustainableAgriculture from "@/domains/farmers/components/sustainableagriculture";
import Impactwemake from "@/domains/farmers/components/impactwemake";
import NewsletterSection from "@/shared/components/Newsletter";

export default function OurTeamPage() {
  return (
    <> 
      <Bannersection />
      <Sustainablefarming />
      <WhySustainablefarming />
      <SupportingFarmers />
      <SustainableAgriculture />
      <Impactwemake />
      <NewsletterSection />
    </>
  );
}