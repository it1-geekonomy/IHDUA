import type { Metadata } from "next";
import HeroBanner from "@/shared/components/Herobanner";
import FeatureHighlightSection from "@/shared/components/Featurehighlightsection ";
import OpportunitiesSection from "@/shared/components/OpportunitiesSection";
import InitiativeSupport from "@/shared/components/InitiativeSupport";
import ImpactStats, {
  type ImpactStatItem,
} from "@/shared/components/ImpactStats";
import SkillsTogether from "@/shared/components/SkillsTogether";
import WomenOpportunities from "@/shared/components/WomenOpportunities";
import NewsletterSection from "@/shared/components/Newsletter";

export const metadata: Metadata = {
  title: "Self-Help Group & Federation | IHDUA",
  description:
    "IHDUA supports rural women through Self-Help Groups and federations that build savings, leadership and collective decision-making.",
};

const SHG_STEPS = [
  {
    title: "Group Formation",
    description:
      "10–20 women from the same village come together to form a group.",
  },
  {
    title: "Regular Savings",
    description: "Members contribute to a shared fund and build a savings habit.",
  },
  {
    title: "Financial Learning",
    description:
      "Members gain practical skills in recordkeeping and financial management.",
  },
  {
    title: "Leadership & Participation",
    description:
      "Members take part in decisions and community activities.",
  },
] as const;

const IMPACT_STATS: ImpactStatItem[] = [
  {
    icon: "/icons/training-session.svg",
    iconBg: "#F1E7F4",
    value: "7,578+",
    label: "SHG Members",
  },
  {
    icon: "/icons/women-empowerment.svg",
    iconBg: "#FFEDCF",
    value: "697+",
    label: "Self-Help Groups",
  },
  {
    icon: "/icons/community-network.svg",
    iconBg: "#F1E7F4",
    value: "18",
    label: "Federations Reported",
  },
  {
    icon: "/icons/sustainable-livelihoods.svg",
    iconBg: "#FFEDCF",
    value: "43",
    label: "Farmer SHGs",
  },
];

export default function SelfHelpGroupFederationPage() {
  return (
    <>
      <HeroBanner
        heading="Self Help Group & Federation"
        description="Village Self-Help Groups and federations where women save together, share decisions and grow as community leaders."
        image="/selfhelpgroup/banner-desktop.png"
        imageMobile="/selfhelpgroup/banner-mobile.png"
        imageAlt="Self-Help Group members at an IHDUA community meeting"
      />

      <FeatureHighlightSection
        label="WOMEN EMPOWERMENT"
        heading="Self Help Group & Federation"
        description="IHDUA supports rural communities through Self-Help Groups that encourage collective savings, shared decision-making and women’s leadership."
        items={[
          {
            icon: "/icons/mission.png",
            iconAlt: "Mission icon",
            heading: "Mission",
            description: "Empowering rural women through savings, skills and leadership.",
          },
          {
            icon: "/icons/benifit.png",
            iconAlt: "Beneficiaries icon",
            heading: "Beneficiaries",
            description:
              "Building financial confidence, collaboration and stronger communities.",
          },
        ]}
      />

      <OpportunitiesSection
        heading="The Power of Collective Action"
        descriptions={[
          "Self-Help Groups (SHGs) bring together 10–20 women from the same village to build financial skills, shared responsibility and leadership. With IHDUA’s guidance, members contribute to shared savings, maintain group records and participate in collective decision-making.",
          "Through regular meetings and shared learning, members build confidence, strengthen their financial awareness and support one another in addressing common challenges. Federations bring SHG representatives together once a month to discuss community concerns, exchange experiences and identify possible solutions. These collective efforts encourage shared responsibility, stronger local networks and greater participation in community decision-making.",
        ]}
        image="/selfhelpgroup/collective.png"
        imageAlt="Self-Help Group members participating in a learning session"
      />

      <InitiativeSupport
        label="HOW SELF-HELP GROUPS WORK"
        heading="Small Steps. Shared Progress."
        description="IHDUA facilitates the formation of SHGs and provides guidance on group rules, meeting processes and recordkeeping. Two selected members receive additional training to maintain group records and coordinate with bank officials."
        steps={SHG_STEPS}
      />

      <WomenOpportunities
        heading="Creating Financial Independence for Rural Women"
        topDescription="IHDUA’s Self-Help Groups help rural women save together, keep group records and take part in collective decisions. Regular meetings build financial confidence, while federations bring group representatives together to discuss village concerns and share solutions."
        images={[
          {
            src: "/selfhelpgroup/financial-independence-1.jpg",
            alt: "Self-Help Group members reviewing records together",
          },
          {
            src: "/selfhelpgroup/financial-independence-2.jpg",
            alt: "IHDUA community meeting with Self-Help Group members",
          },
        ]}
        bottomDescription="IHDUA’s Microfinance Initiative makes it possible for rural women to become informed financial decision-makers who have access to loans at competitive rates, which they may use for their family’s health, education and livelihood needs.Microfinance also supports women through Self-Help Groups, where members can build savings, access loans, participate in income-generating activities and strengthen their role in household and community decision-making."
      />

      <SkillsTogether
        label="SELF-HELP GROUPS & FEDERATIONS"
        heading="Stronger Communities, Together"
        descriptions={[
          "IHDUA supports village-based Self-Help Groups where members come together to build knowledge, share responsibilities and work towards common goals. Through group participation and leadership development, women can strengthen their role in community life.",
          "Federations connect SHG representatives, creating a space to discuss local challenges, exchange ideas and identify solutions together.",
        ]}
        items={[
          {
            icon: "/icons/piggy-bank.svg",
            title: "Community Leadership",
            description: "Encouraging women to lead group decisions.",
          },
          {
            icon: "/icons/training-session.svg",
            title: "Shared Responsibility",
            description: "Working together towards common goals.",
          },
          {
            icon: "/icons/peer-support.svg",
            title: "Collective Voice",
            description: "Sharing concerns and finding solutions.",
          },
          {
            icon: "/icons/wallet.svg",
            title: "Stronger Networks",
            description: "Building connections through shared experiences.",
          },
        ]}
      />

      <ImpactStats
        heading="The Impact We Make"
        description={[
          "IHDUA’s Women Leadership Project has supported the formation of 697 Self-Help Groups (SHGs), bringing together 7,578 members. These groups encourage collective savings, financial awareness and shared responsibility among community members.",
          "The programme also reports 18 federations, where SHG representatives meet monthly to discuss common challenges and work towards solutions. Through these collective efforts, IHDUA promotes women’s leadership, stronger community connections and greater participation in decision-making.",
        ]}
        bannerHeading="Creating Lasting Change"
        stats={IMPACT_STATS}
      />

      <NewsletterSection />
    </>
  );
}