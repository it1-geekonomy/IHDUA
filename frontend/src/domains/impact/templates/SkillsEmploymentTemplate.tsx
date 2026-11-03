import HeroBanner from "@/shared/components/Herobanner";
import FeatureHighlightSection from "@/shared/components/Featurehighlightsection ";
import OpportunitiesSection from "@/shared/components/OpportunitiesSection";
import WomenOpportunities from "@/shared/components/WomenOpportunities";
import SkillsTogether, {
  type SkillFeatureItem,
} from "@/shared/components/SkillsTogether";
import ImpactStats, {
  type ImpactStatItem,
} from "@/shared/components/ImpactStats";
import NewsletterSection from "@/shared/components/Newsletter";
import type { CategoryTemplateProps } from "./types";

export default function SkillsEmploymentTemplate({
  data,
}: CategoryTemplateProps) {
  const sections = data?.sections ?? [];

  const heroSection = sections.find((s) => s.sectionType === "HERO");
  const highlightsSection = sections.find(
    (s) => s.sectionType === "FEATURES" && s.layout !== "GRID_4",
  );
  const storySection = sections.find((s) => s.sectionType === "CONTENT");
  const skillsTogetherSection = sections.find(
    (s) =>
      s.sectionType === "FEATURES" &&
      (s.layout === "GRID_4" || s.layout === "SKILLS"),
  );
  const statsSection = sections.find((s) => s.sectionType === "STATS");

  const heroHeading =
    heroSection?.title || data?.name || "Youth Skill Development";
  const heroDesc =
    heroSection?.description ||
    "Working alongside rural communities to create opportunities, strengthen livelihoods, and build brighter futures.";
  const heroImage =
    heroSection?.imageUrl || "/skills and employement/bannerbg.png";
  const heroMobileImage =
    heroSection?.settings?.imageMobileUrl ||
    "/skills and employement/bannermobilebg.png";

  const featureItems = highlightsSection?.items?.length
    ? highlightsSection.items.map((it) => ({
        icon: it.iconUrl || "/icons/mission.png",
        heading: it.title || "Feature",
        description: it.description || "",
      }))
    : [
        {
          icon: "/icons/mission.png",
          heading: "Focus Areas",
          description: "Technical, healthcare, vocational and soft skills.",
        },
        {
          icon: "/icons/benifit.png",
          heading: "Beneficiaries",
          description:
            "1,800+ youth trained across rural communities in Karnataka.",
        },
      ];

  const skillItems: SkillFeatureItem[] = skillsTogetherSection?.items?.length
    ? skillsTogetherSection.items.map((it) => ({
        icon: it.iconUrl || "/skills and employement/practiclelearning.png",
        title: it.title || "Skill",
        description: it.description || "",
      }))
    : [
        {
          icon: "/skills and employement/practiclelearning.png",
          title: "Practical Learning",
          description: "Develop useful skills through hands-on training.",
        },
        {
          icon: "/skills and employement/training.png",
          title: "Training & Guidance",
          description: "Learn through structured vocational programmes.",
        },
        {
          icon: "/skills and employement/peersupport.png",
          title: "Peer Support",
          description: "Build confidence through shared learning.",
        },
        {
          icon: "/skills and employement/credit.png",
          title: "Access to Opportunities",
          description: "Prepare for future employment opportunities.",
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
          icon: "/Healthawareness/160.png",
          iconBg: "#F1E7F4",
          value: "1,800+",
          label: "Youth trained across programmes",
        },
        {
          icon: "/Healthawareness/855.png",
          iconBg: "#FFEDCF",
          value: "72%",
          label: "Employment placement rate",
        },
        {
          icon: "/Healthawareness/988.png",
          iconBg: "#F1E7F4",
          value: "12",
          label: "Vocational courses offered",
        },
        {
          icon: "/Healthawareness/34.png",
          iconBg: "#FFEDCF",
          value: "35+",
          label: "Partner employers",
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

      {/* 2. Highlights */}
      <FeatureHighlightSection
        label={data?.highlightLabel || highlightsSection?.label || "SKILLS & EMPLOYMENT"}
        heading={data?.highlightHeading || highlightsSection?.title || heroHeading}
        description={
          data?.highlightDescription ||
          highlightsSection?.description ||
          "IHDUA provides rural youth and women with marketable skills and vocational training to build financial independence."
        }
        items={featureItems}
      />

      {/* 3. Story / Narrative */}
      <OpportunitiesSection
        heading={data?.story1Title || storySection?.title || "Why Youth Skill Training Matters"}
        descriptions={
          data?.story1Description
            ? data.story1Description.split("\n\n").filter(Boolean)
            : storySection?.description
            ? storySection.description.split("\n\n").filter(Boolean)
            : [
                "Vocational training gives rural students the knowledge and confidence to pursue dignified livelihoods. By connecting classroom learning with practical apprenticeships, our courses help bridge the gap between education and economic independence.",
              ]
        }
        image={data?.story1ImageUrl || storySection?.imageUrl || "/skills and employement/Rectangle.png"}
        imageAlt={data?.story1Title || storySection?.title || "Skill Training"}
      />

      {/* 4. Story 2: 2-Image Section (Building Skills for a Brighter Future) */}
      <WomenOpportunities
        heading={data?.womenStoryHeading || "Building Skills for a Brighter Future"}
        topDescription={
          data?.womenStoryTopDesc ||
          "IHDUA’s Skill Development Project provides rural students with training in computer skills, Tally, GST and spoken English, alongside General Duty Assistant (GDA) and other vocational courses. These programmes aim to strengthen practical abilities and improve access to employment opportunities."
        }
        images={[
          {
            src: data?.womenStoryImage1Url || "/youth/buildingskills1.png",
            alt: "Youth training certification session",
          },
          {
            src: data?.womenStoryImage2Url || "/youth/buildingskills2.png",
            alt: "Students attending practical learning class",
          },
        ]}
        bottomDescription={
          data?.womenStoryBottomDesc ||
          "The organisation also offers vocational training in tailoring, Aari work, Lippan art, Vision Assistant training and Thanjavur painting. Through these courses, students can explore different skills, develop their capabilities and prepare for future livelihood opportunities."
        }
      />

      {/* 5. Skills Together 2x2 Grid */}
      <SkillsTogether
        label={skillsTogetherSection?.label || "YOUTH SKILL DEVELOPMENT"}
        heading={skillsTogetherSection?.title || "Building Skills Together"}
        descriptions={
          skillsTogetherSection?.description
            ? skillsTogetherSection.description.split("\n\n").filter(Boolean)
            : [
                "IHDUA supports rural students through vocational training programmes that develop practical skills and prepare them for employment opportunities.",
              ]
        }
        items={skillItems}
      />

      {/* 5. Impact Stats */}
      <ImpactStats
        heading={statsSection?.title || "The Impact We Make"}
        description={
          statsSection?.description ||
          "Our vocational programmes have equipped rural youth with technical and healthcare certifications, opening pathways to steady employment."
        }
        bannerHeading="Creating Lasting Change"
        stats={statsItems}
      />

      {/* 6. Newsletter */}
      <NewsletterSection />
    </main>
  );
}

