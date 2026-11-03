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

export default function ModelVillageTemplate({
  data,
}: CategoryTemplateProps) {
  const sections = data?.sections ?? [];

  const heroSection = sections.find((s) => s.sectionType === "HERO");
  const highlightsSection = sections.find(
    (s) => s.sectionType === "FEATURES" && s.layout !== "STEPS",
  );
  const storySection = sections.find((s) => s.sectionType === "CONTENT");
  const gallerySection = sections.find((s) => s.sectionType === "GALLERY");
  const statsSection = sections.find((s) => s.sectionType === "STATS");

  const heroHeading =
    heroSection?.title || data?.name || "Rejuvenation of Villages";
  const heroDesc =
    heroSection?.description ||
    "Working alongside rural communities to create opportunities, strengthen livelihoods, and build brighter futures.";
  const heroImage =
    heroSection?.imageUrl || "/modelvillage/modelvillagebg.png";
  const heroMobileImage =
    heroSection?.settings?.imageMobileUrl ||
    "/modelvillage/modelvillagemobilebg.png";

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
            "Sustainable agriculture, organic farming and eco-friendly village infrastructure.",
        },
        {
          icon: "/icons/benifit.png",
          heading: "Village Reach",
          description:
            "Holistic development for Chikkahundi and surrounding farming hamlets.",
        },
      ];

  const galleryImages: AwarenessImage[] = gallerySection?.items?.length
    ? gallerySection.items.map((it) => ({
        src: it.imageUrl || "/modelvillage/sustainablevillage1.png",
        alt: it.title || it.description || "Village initiative",
      }))
    : [
        {
          src: "/modelvillage/sustainablevillage1.png",
          alt: "Sustainable village organic farming and soil preparation",
        },
        {
          src: "/modelvillage/sustainablevillage2.png",
          alt: "Farmer gathering and community water revival meeting",
        },
        {
          src: "/modelvillage/sustainablevillage3.png",
          alt: "Eco-friendly infrastructure and solar installation",
        },
        {
          src: "/modelvillage/sustainablevillage4.png",
          alt: "Sapling plantation and green cover revival",
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
          value: "500+",
          label: "Saplings planted across village boundaries",
        },
        {
          icon: "/Healthawareness/855.png",
          iconBg: "#FFEDCF",
          value: "140+",
          label: "Farmers adopted vermicompost practices",
        },
        {
          icon: "/Healthawareness/988.png",
          iconBg: "#F1E7F4",
          value: "12",
          label: "Water bodies & tanks restored",
        },
        {
          icon: "/Healthawareness/34.png",
          iconBg: "#FFEDCF",
          value: "24",
          label: "Solar street lights installed",
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

      {/* 2. Feature Highlights */}
      <FeatureHighlightSection
        label={data?.highlightLabel || highlightsSection?.label || "MODEL VILLAGE"}
        heading={data?.highlightHeading || highlightsSection?.title || heroHeading}
        description={
          data?.highlightDescription ||
          highlightsSection?.description ||
          "IHDUA supports rural communities through holistic village development, soil health initiatives and ecological rejuvenation."
        }
        items={featureItems}
      />

      {/* 3. Story Section */}
      <OpportunitiesSection
        heading={data?.story1Title || storySection?.title || "Why Village Development Matters"}
        descriptions={
          data?.story1Description
            ? data.story1Description.split("\n\n").filter(Boolean)
            : storySection?.description
            ? storySection.description.split("\n\n").filter(Boolean)
            : [
                "Rejuvenating villages requires integrated support across soil health, water conservation, community commons, and eco-friendly infrastructure. When rural families have access to sustainable farming and reliable water sources, entire communities flourish.",
              ]
        }
        image={data?.story1ImageUrl || storySection?.imageUrl || "/modelvillage/Rectangle (1).png"}
        imageAlt={data?.story1Title || storySection?.title || "Village Development"}
      />

      {/* 4. Sustainable Village Gallery (4-Image Grid) */}
      <AwarenessGallery
        heading={data?.grid4Heading || gallerySection?.title || "Building a Sustainable Village"}
        descriptions={
          data?.grid4Description
            ? data.grid4Description.split("\n\n").filter(Boolean)
            : gallerySection?.description
            ? gallerySection.description.split("\n\n").filter(Boolean)
            : [
                "Our Model Village project focuses on Chikkahundi village in Gundlupet taluk, supporting holistic development through sustainable agriculture, organic farming and eco-friendly activities.",
                "Documented activities include soil health training, vermicompost production, fruit sapling distribution, veterinary camps, and solar street-light installation.",
              ]
        }
        images={[
          {
            src: data?.grid4Image1Url || galleryImages[0]?.src || "/modelvillage/sustainablevillage1.png",
            alt: "Sustainable village organic farming and soil preparation",
          },
          {
            src: data?.grid4Image2Url || galleryImages[1]?.src || "/modelvillage/sustainablevillage2.png",
            alt: "Farmer gathering and community water revival meeting",
          },
          {
            src: data?.grid4Image3Url || galleryImages[2]?.src || "/modelvillage/sustainablevillage3.png",
            alt: "Eco-friendly infrastructure and solar installation",
          },
          {
            src: data?.grid4Image4Url || galleryImages[3]?.src || "/modelvillage/sustainablevillage4.png",
            alt: "Sapling plantation and green cover revival",
          },
        ]}
      />

      {/* 5. Impact Stats */}
      <ImpactStats
        heading={statsSection?.title || "The Impact We Make"}
        description={
          statsSection?.description ||
          "Through soil enrichment, tank desiltation and ecological stewardship, our model village initiatives demonstrate sustainable community-led growth."
        }
        bannerHeading="Creating Lasting Change"
        stats={statsItems}
      />

      {/* 6. Newsletter */}
      <NewsletterSection />
    </main>
  );
}

