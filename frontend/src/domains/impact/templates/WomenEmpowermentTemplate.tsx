import HeroBanner from "@/shared/components/Herobanner";
import FeatureHighlightSection from "@/shared/components/Featurehighlightsection ";
import OpportunitiesSection from "@/shared/components/OpportunitiesSection";
import InitiativeSupport, {
  type InitiativeSupportStep,
} from "@/shared/components/InitiativeSupport";
import WomenOpportunities from "@/shared/components/WomenOpportunities";
import SkillsTogether from "@/shared/components/SkillsTogether";
import ImpactStats, {
  type ImpactStatItem,
} from "@/shared/components/ImpactStats";
import NewsletterSection from "@/shared/components/Newsletter";
import type { CategoryTemplateProps } from "./types";

export default function WomenEmpowermentTemplate({
  data,
}: CategoryTemplateProps) {
  const sections = data?.sections ?? [];

  const heroSection = sections.find((s) => s.sectionType === "HERO");
  const highlightsSection = sections.find(
    (s) => s.sectionType === "FEATURES" && s.layout !== "STEPS",
  );
  const storySection = sections.find((s) => s.sectionType === "CONTENT");
  const stepsSection = sections.find(
    (s) => s.sectionType === "FEATURES" && s.layout === "STEPS",
  );
  const statsSection = sections.find((s) => s.sectionType === "STATS");

  // Fallbacks based on Self-Help Group & Federation page
  const heroHeading =
    heroSection?.title || data?.name || "Self Help Group & Federation";
  const heroDesc =
    heroSection?.description ||
    "Village Self-Help Groups and federations where women save together, share decisions and grow as community leaders.";
  const heroImage =
    heroSection?.imageUrl || "/selfhelpgroup/banner-desktop.png";
  const heroMobileImage =
    heroSection?.settings?.imageMobileUrl || "/selfhelpgroup/banner-mobile.png";

  const featureItems = highlightsSection?.items?.length
    ? highlightsSection.items.map((it) => ({
        icon: it.iconUrl || "/icons/mission.png",
        heading: it.title || "Feature",
        description: it.description || "",
      }))
    : [
        {
          icon: "/icons/mission.png",
          heading: "Mission",
          description:
            "Empowering rural women through savings, skills and leadership.",
        },
        {
          icon: "/icons/benifit.png",
          heading: "Beneficiaries",
          description:
            "Building financial confidence, collaboration and stronger communities.",
        },
      ];

  const stepsItems: InitiativeSupportStep[] = stepsSection?.items?.length
    ? stepsSection.items.map((it) => ({
        icon: it.iconUrl || undefined,
        title: it.title || "",
        description: it.description || "",
      }))
    : [
        {
          title: "Group Formation",
          description:
            "10–20 women from the same village come together to form a group.",
        },
        {
          title: "Regular Savings",
          description:
            "Members contribute to a shared fund and build a savings habit.",
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
      ];

  const statsItems: ImpactStatItem[] = statsSection?.items?.length
    ? statsSection.items.map((it, idx) => ({
        icon: it.iconUrl || "/icons/training-session.svg",
        iconBg: idx % 2 === 0 ? "#F1E7F4" : "#FFEDCF",
        value: it.value || "0",
        label: it.title || "",
      }))
    : [
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

  return (
    <main className="w-full">
      {/* 1. Hero Banner */}
      <HeroBanner
        heading={heroHeading}
        description={heroDesc}
        image={heroImage}
        imageMobile={heroMobileImage}
        imageAlt={heroHeading}
      />

      {/* 2. Feature Highlights (Mission & Beneficiaries) */}
      <FeatureHighlightSection
        label={data?.highlightLabel || highlightsSection?.label || "WOMEN EMPOWERMENT"}
        heading={data?.highlightHeading || highlightsSection?.title || heroHeading}
        description={
          data?.highlightDescription ||
          highlightsSection?.description ||
          "IHDUA supports rural communities through Self-Help Groups that encourage collective savings, shared decision-making and women's leadership."
        }
        items={featureItems}
      />

      {/* 3. Story Section */}
      <OpportunitiesSection
        heading={data?.story1Title || storySection?.title || "The Power of Collective Action"}
        descriptions={
          data?.story1Description
            ? data.story1Description.split("\n\n").filter(Boolean)
            : storySection?.description
            ? storySection.description.split("\n\n").filter(Boolean)
            : [
                "Self-Help Groups (SHGs) bring together 10–20 women from the same village to build financial skills, shared responsibility and leadership. With IHDUA's guidance, members contribute to shared savings, maintain group records and participate in collective decision-making.",
                "Through regular meetings and shared learning, members build confidence, strengthen their financial awareness and support one another in addressing common challenges.",
              ]
        }
        image={data?.story1ImageUrl || storySection?.imageUrl || "/selfhelpgroup/collective.png"}
        imageAlt={data?.story1Title || storySection?.title || "Collective Action"}
      />

      {/* 4. Steps Section (How Self-Help Groups Work) */}
      <InitiativeSupport
        label={stepsSection?.label || "HOW SELF-HELP GROUPS WORK"}
        heading={stepsSection?.title || "Small Steps. Shared Progress."}
        description={
          stepsSection?.description ||
          "IHDUA facilitates the formation of SHGs and provides guidance on group rules, meeting processes and recordkeeping. Two selected members receive additional training to maintain group records and coordinate with bank officials."
        }
        steps={stepsItems}
      />

      {/* 5. 2-Image Story Section (WomenOpportunities) */}
      <WomenOpportunities
        heading={data?.womenStoryHeading || "Creating Financial Independence for Rural Women"}
        topDescription={
          data?.womenStoryTopDesc ||
          "IHDUA’s Self-Help Groups help rural women save together, keep group records and take part in collective decisions. Regular meetings build financial confidence, while federations bring group representatives together to discuss village concerns and share solutions."
        }
        images={[
          {
            src: data?.womenStoryImage1Url || "/selfhelpgroup/financial-independence-1.jpg",
            alt: "Self-Help Group members reviewing records together",
          },
          {
            src: data?.womenStoryImage2Url || "/selfhelpgroup/financial-independence-2.jpg",
            alt: "IHDUA community meeting with Self-Help Group members",
          },
        ]}
        bottomDescription={
          data?.womenStoryBottomDesc ||
          "IHDUA’s Microfinance Initiative makes it possible for rural women to become informed financial decision-makers who have access to loans at competitive rates, which they may use for their family’s health, education and livelihood needs."
        }
      />

      {/* 6. Skills & Stronger Networks */}
      <SkillsTogether
        label="SELF-HELP GROUPS & FEDERATIONS"
        heading="Stronger Communities, Together"
        descriptions={[
          "IHDUA supports village-based Self-Help Groups where members come together to build knowledge, share responsibilities and work towards common goals.",
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

      {/* 7. Impact Stats */}
      <ImpactStats
        heading={statsSection?.title || "The Impact We Make"}
        description={
          statsSection?.description ||
          "IHDUA's Women Leadership Project has supported the formation of 697 Self-Help Groups (SHGs), bringing together 7,578 members. These groups encourage collective savings, financial awareness and shared responsibility among community members."
        }
        bannerHeading="Creating Lasting Change"
        stats={statsItems}
      />

      {/* 8. Newsletter */}
      <NewsletterSection />
    </main>
  );
}
