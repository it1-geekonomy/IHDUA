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
  title: "Microfinance Initiative | IHDUA",
  description:
    "IHDUA’s Microfinance Initiative helps rural women build savings, access credit and strengthen financial decision-making through Self-Help Groups.",
};

const MICROFINANCE_STEPS = [
  {
    title: "Build a Savings Fund",
    description: "Members contribute \u20b910 each week to grow their shared fund.",
  },
  {
    title: "Access Group Loans",
    description:
      "Members may apply for loans after three months of contributions.",
  },
  {
    title: "Review Loan Requests",
    description:
      "The group collectively discusses and approves members' loan requests.",
  },
  {
    title: "Build Bank Linkages",
    description:
      "After four lending rounds, groups can access bank loans directly.",
  },
] as const;

const IMPACT_STATS: ImpactStatItem[] = [
  {
    icon: "/icons/training-session.svg",
    iconBg: "#F1E7F4",
    value: "5,000+",
    label: "People Trained",
  },
  {
    icon: "/icons/women-empowerment.svg",
    iconBg: "#FFEDCF",
    value: "600+",
    label: "Self-Help Groups Reported",
  },
  {
    icon: "/icons/community-network.svg",
    iconBg: "#F1E7F4",
    value: "₹4.36 Cr",
    label: "SHG Savings (Jan 2022)",
  },
  {
    icon: "/icons/sustainable-livelihoods.svg",
    iconBg: "#FFEDCF",
    value: "₹10 Cr+",
    label: "Loans Historically Issued",
  },
];

export default function MicroFinanceInitiativesPage() {
  return (
    <>
      <HeroBanner
        heading="Micro-finance Initiative"
        description="Community-based savings and fair credit that help rural women invest in health, education and livelihoods."
        image="/microfinanceinitiatives/banner-desktop.png"
        imageMobile="/microfinanceinitiatives/banner-mobile.png"
        imageAlt="Women at an IHDUA microfinance meeting"
      />

      <FeatureHighlightSection
        label="WOMEN EMPOWERMENT"
        heading="Microfinance Initiative"
        description="IHDUA supports community-based savings and access to financial learning so rural women can make informed decisions."
        items={[
          {
            icon: "/icons/mission.png",
            iconAlt: "Mission icon",
            heading: "Mission",
            description:
              "Supporting community-driven investment activities on behalf of rural women.",
          },
          {
            icon: "/icons/benifit.png",
            iconAlt: "Beneficiaries icon",
            heading: "Beneficiaries",
            description: "More than 5,000 women have benefited from our programmes.",
          },
        ]}
      />

      <OpportunitiesSection
        heading="Why Microfinance Matters"
        descriptions={[
          "IHDUA’s Microfinance Initiative makes it possible for rural women to become informed financial decision-makers who have access to loans at competitive rates, which they may use for their family’s health, education and livelihood needs. Microfinance also supports women through Self-Help Groups, where members can build savings, access loans, participate in income-generating activities and strengthen their role in household and community decision-making.",
          "Self-Help Groups provide a community-based platform where women can save together, access financial support and participate in income-generating activities. Through these groups, IHDUA’s Microfinance Initiative encourages greater participation, shared responsibility and stronger financial decision-making within rural communities.",
        ]}
        image="/microfinanceinitiatives/why-microfinance-matters.png"
        imageAlt="Rural women attending an IHDUA microfinance session"
      />

      <InitiativeSupport
        label="HOW MICROFINANCE WORKS"
        heading="Small Steps. Shared Progress."
        description="IHDUA supports Self-Help Groups through shared savings, group rules, meeting processes and financial recordkeeping. Two selected members receive additional training to maintain records and coordinate with bank officials."
        steps={MICROFINANCE_STEPS}
      />

      <WomenOpportunities
        heading="Creating Financial Independence Through Microfinance"
        topDescription="IHDUA’s Microfinance Initiative helps rural women access financial resources through Self-Help Groups (SHGs). Members build shared savings, learn financial recordkeeping and collectively review loan requests. After three months of contributions, members may become eligible to borrow from their group fund."
        images={[
          {
            src: "/microfinanceinitiatives/financial-independence-1.png",
            alt: "Self-Help Group members meeting on a verandah to review group savings",
          },
          {
            src: "/microfinanceinitiatives/financial-independence-2.png",
            alt: "Self-Help Group members gathered outside a local bank branch",
          },
        ]}
        bottomDescription="The initiative supports women in managing finances, accessing credit and participating in income-generating activities. Through regular savings and group lending, members develop financial responsibility and strengthen their role in household and community decision-making."
      />

      <WomenOpportunities
        heading="Creating Financial Independence for Rural Women"
        topDescription="IHDUA’s Microfinance Initiative supports rural women through Self-Help Groups (SHGs), helping members build shared savings, develop financial management skills and access group loans. Members contribute regularly and participate in collective financial decisions."
        images={[
          {
            src: "/microfinanceinitiatives/self-help-groups.png",
            alt: "Self-Help Group members reviewing loan ledgers and accounts together",
          },
          {
            src: "/microfinanceinitiatives/field-household-visit.png",
            alt: "IHDUA field worker speaking with Self-Help Group members during a household visit",
          },
        ]}
        bottomDescription="Groups that demonstrate consistent repayment discipline qualify for escalating credit tiers. After successfully completing four internal lending cycles, groups become eligible for formal bank credit lines, unlocking larger capital for micro-enterprises, agriculture, and family welfare."
      />

      <SkillsTogether
        label="SELF-HELP GROUPS"
        heading="Stronger Together"
        descriptions={[
          "At the heart of this initiative are Self-Help Groups (SHGs), comprising 10 to 20 women from a single village. Members regularly contribute a small amount to a common fund, participate in training sessions and support each other in achieving their financial goals.",
          "These groups not only provide access to credit, but also create a safe space for women to learn, share experiences and build confidence.",
        ]}
        items={[
          {
            icon: "/icons/savings-fund.svg",
            title: "Regular Savings",
            description: "Small contributions create big opportunities.",
          },
          {
            icon: "/icons/financial-literacy.svg",
            title: "Training & Guidance",
            description: "Learn financial management and group responsibility.",
          },
          {
            icon: "/icons/peer-support.svg",
            title: "Peer Support",
            description: "Grow together through shared knowledge.",
          },
          {
            icon: "/icons/wallet.svg",
            title: "Access to Credit",
            description: "Fair and affordable loans for real needs.",
          },
        ]}
      />

      <ImpactStats
        heading="The Impact We Make"
        description="The programme’s records report 600 Self-Help Groups across 59 villages in Karnataka, including 492 groups composed entirely of women. Approximately 5,000 people have completed training seminars since the programme began in 2001. Historically, ₹10 crore in loans has been issued to SHGs, with a reported repayment rate of more than 90%. The records also report ₹4.36 crore in total SHG savings as of January 2022."
        bannerHeading="Creating Lasting Change"
        stats={IMPACT_STATS}
      />

      <NewsletterSection />
    </>
  );
}
