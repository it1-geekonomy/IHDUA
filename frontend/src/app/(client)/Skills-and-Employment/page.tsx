import SupportCommunities from "@/domains/skillsandemployment/components/supportcommunities";
import CommunityHealth from "@/domains/skillsandemployment/components/skillsandemployment";
import BannerSection from "@/domains/skillsandemployment/components/bannersection";
import GrowingSustainably from "@/domains/skillsandemployment/components/growingsustainably";
import NewsletterSection from "@/shared/components/Newsletter";

export default function OurTeamPage() {
  return (
    <>
    <BannerSection />
    <GrowingSustainably />
    <SupportCommunities />
    <CommunityHealth />
    <NewsletterSection />

    </>
  );
}