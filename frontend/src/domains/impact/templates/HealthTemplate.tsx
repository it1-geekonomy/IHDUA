import HeroBanner from "@/shared/components/Herobanner";
import FeatureHighlightSection from "@/shared/components/Featurehighlightsection ";
import OpportunitiesSection from "@/shared/components/OpportunitiesSection";
import AwarenessGallery, {
  type AwarenessImage,
} from "@/shared/components/AwarenessGallery";
import ImpactStats, {
  type ImpactStatItem,
} from "@/shared/components/ImpactStats";
import NewsletterSection from "@/shared/components/Newsletter";
import type { CategoryTemplateProps } from "./types";

export default function HealthTemplate({ data }: CategoryTemplateProps) {
  const sections = data?.sections ?? [];

  const heroSection = sections.find((s) => s.sectionType === "HERO");
  const highlightsSection = sections.find(
    (s) => s.sectionType === "FEATURES" && s.layout !== "STEPS",
  );
  const storySection = sections.find((s) => s.sectionType === "CONTENT");
  const gallerySection = sections.find((s) => s.sectionType === "GALLERY");
  const statsSection = sections.find((s) => s.sectionType === "STATS");

  const heroHeading = heroSection?.title || data?.name || "Health Awareness";
  const heroDesc =
    heroSection?.description ||
    "Working alongside rural communities to create opportunities, strengthen livelihoods, and build brighter futures.";
  const heroImage =
    heroSection?.imageUrl || "/Healthawareness/healthawarenessbg.png";
  const heroMobileImage =
    heroSection?.settings?.imageMobileUrl ||
    "/Healthawareness/healthawarenessmobilebg.png";

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
          description:
            "Nutrition, hygiene, sanitation and reproductive health awareness.",
        },
        {
          icon: "/icons/benifit.png",
          heading: "Programme Reach",
          description:
            "Historical programmes included health education for women, schoolchildren and Anganwadi workers.",
        },
      ];

  const galleryImages: AwarenessImage[] = gallerySection?.items?.length
    ? gallerySection.items.map((it) => ({
        src: it.imageUrl || "/Healthcamps/camps1.png",
        alt: it.title || it.description || "Health camp session",
      }))
    : [
        {
          src: "/Healthcamps/camps1.png",
          alt: "Health awareness session with women and children seated on the floor",
        },
        {
          src: "/Healthcamps/camps2.png",
          alt: "Students in green uniforms attending a session in a classroom",
        },
        {
          src: "/Healthcamps/camps3.png",
          alt: "Awareness session held outdoors in front of a school building",
        },
        {
          src: "/Healthcamps/camps4.png",
          alt: "Students in blue uniforms seated on the ground at a session",
        },
      ];

  const statsItems: ImpactStatItem[] = statsSection?.items?.length
    ? statsSection.items.map((it, idx) => ({
        icon: it.iconUrl || "/Healthawareness/160.png",
        iconBg: idx % 2 === 0 ? "#F1E7F4" : "#FFEDCF",
        value: it.value || "0",
        label: it.title || "",
      }))
    : [
        {
          icon: "/Healthawareness/160.png",
          iconBg: "#F1E7F4",
          value: "160",
          label: "Reproductive and child health sessions",
        },
        {
          icon: "/Healthawareness/855.png",
          iconBg: "#FFEDCF",
          value: "855",
          label: "Women in nutrition & anaemia sessions",
        },
        {
          icon: "/Healthawareness/988.png",
          iconBg: "#F1E7F4",
          value: "988",
          label: "Women reached through hygiene sessions",
        },
        {
          icon: "/Healthawareness/34.png",
          iconBg: "#FFEDCF",
          value: "34+",
          label: "Anganwadi workers trained",
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

      {/* 2. Feature Highlights (Promoting Healthier Communities) */}
      <FeatureHighlightSection
        label={data?.highlightLabel || highlightsSection?.label || "HEALTH AWARENESS"}
        heading={data?.highlightHeading || highlightsSection?.title || "Promoting Healthier Communities"}
        description={
          data?.highlightDescription ||
          highlightsSection?.description ||
          "IHDUA conducts community health programmes, preventative screenings, and nutritional guidance to improve well-being in rural villages."
        }
        items={featureItems}
      />

      {/* 3. Story / Narrative Section */}
      <OpportunitiesSection
        heading={data?.story1Title || storySection?.title || "Supporting Community Well-being"}
        descriptions={
          data?.story1Description
            ? data.story1Description.split("\n\n").filter(Boolean)
            : storySection?.description
            ? storySection.description.split("\n\n").filter(Boolean)
            : [
                "IHDUA conducted health education sessions covering nutrition, anaemia, personal hygiene, menstruation, sanitation and family planning.",
                "Training also addressed community health awareness and the role of village health workers. These initiatives shared essential health information with rural women and families through local community networks.",
              ]
        }
        image={data?.story1ImageUrl || storySection?.imageUrl || "/Healthawareness/Rectangle.png"}
        imageAlt={data?.story1Title || storySection?.title || "Community Health"}
      />

      {/* 4. Awareness & Camp Gallery (4-Image Grid) */}
      <AwarenessGallery
        heading={data?.grid4Heading || gallerySection?.title || "Building Healthier Communities"}
        descriptions={
          data?.grid4Description
            ? data.grid4Description.split("\n\n").filter(Boolean)
            : gallerySection?.description
            ? gallerySection.description.split("\n\n").filter(Boolean)
            : [
                "IHDUA's health awareness initiatives cover nutrition, hygiene, sanitation and reproductive health. The programmes address common health concerns and share essential health information with rural women and families.",
                "Documented activities include health education sessions, Anganwadi worker training, nutrition awareness and reproductive and child health programmes.",
              ]
        }
        images={[
          {
            src: data?.grid4Image1Url || galleryImages[0]?.src || "/Healthcamps/camps1.png",
            alt: "Health awareness session with women and children seated on the floor",
          },
          {
            src: data?.grid4Image2Url || galleryImages[1]?.src || "/Healthcamps/camps2.png",
            alt: "Students in green uniforms attending a session in a classroom",
          },
          {
            src: data?.grid4Image3Url || galleryImages[2]?.src || "/Healthcamps/camps3.png",
            alt: "Awareness session held outdoors in front of a school building",
          },
          {
            src: data?.grid4Image4Url || galleryImages[3]?.src || "/Healthcamps/camps4.png",
            alt: "Students in blue uniforms seated on the ground at a session",
          },
        ]}
      />

      {/* 5. Impact Stats */}
      <ImpactStats
        heading={statsSection?.title || "The Impact We Make"}
        description={
          statsSection?.description ||
          "IHDUA's health awareness programmes have covered nutrition, hygiene, anaemia and reproductive health, sharing essential health information with rural communities."
        }
        bannerHeading="Creating Lasting Change"
        stats={statsItems}
      />

      {/* 6. Newsletter */}
      <NewsletterSection />
    </main>
  );
}

