import BannerSection from "@/domains/health/components/bannersection";
import Health from "@/domains/health/components/supportingwomen";
import PromotingCommunities from "@/domains/health/components/promotingcommunities";
import CommunityHealth from "@/domains/health/components/communityhealth";

export default function OurTeamPage() {
  return (
    <>
    <BannerSection />
      <Health />
      <PromotingCommunities />
      <CommunityHealth />
    </>
  );
}