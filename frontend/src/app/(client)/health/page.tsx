import type { Metadata } from "next";
import BannerSection from "@/domains/health/components/bannersection";
import Health from "@/domains/health/components/supportingwomen";
import PromotingCommunities from "@/domains/health/components/promotingcommunities";
import CommunityHealth from "@/domains/health/components/communityhealth";
import { buildPageMetadata } from "@/shared/lib/seo";

export const metadata: Metadata = buildPageMetadata({ path: "/health" });

export const dynamic = "force-dynamic";

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