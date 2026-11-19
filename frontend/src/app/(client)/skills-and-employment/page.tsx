import type { Metadata } from "next";
import SupportCommunities from "@/domains/skillsandemployment/components/supportcommunities";
import CommunityHealth from "@/domains/skillsandemployment/components/skillsandemployment";
import BannerSection from "@/domains/skillsandemployment/components/bannersection";
import GrowingSustainably from "@/domains/skillsandemployment/components/growingsustainably";
import NewsletterSection from "@/shared/components/Newsletter";
import { buildPageMetadata } from "@/shared/lib/seo";

export const metadata: Metadata = buildPageMetadata({ path: "/skills-and-employment" });

export const dynamic = "force-dynamic";

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