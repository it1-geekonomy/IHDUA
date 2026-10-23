import BannerSection from "@/domains/RejuvenationOfVillages/components/bannersection";
import Buildingcommunities from "@/domains/RejuvenationOfVillages/components/buildingcommunities";
import VillageDevelopment from "@/domains/RejuvenationOfVillages/components/villagedevelopmentmatters";
import SustainableGallery from "@/domains/RejuvenationOfVillages/components/sustainablegallery";
import Impactstats from "@/domains/RejuvenationOfVillages/components/impactstats";
import NewsletterSection from "@/shared/components/Newsletter";

export default function OurTeamPage() {
  return (
    <>
    <BannerSection />
    <Buildingcommunities />
    <VillageDevelopment />
    <SustainableGallery />
    <Impactstats />
    <NewsletterSection /> 
    </>
  );
}