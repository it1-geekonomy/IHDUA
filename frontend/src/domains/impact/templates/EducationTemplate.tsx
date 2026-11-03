import HeroBanner from "@/shared/components/Herobanner";
import FeatureHighlightSection from "@/shared/components/Featurehighlightsection ";
import OpportunitiesSection from "@/shared/components/OpportunitiesSection";
import StoryLeftImageSection from "@/shared/components/StoryLeftImageSection";
import StatsStrip, { type StatItem } from "@/shared/components/StatsStrip";
import GallerySection from "@/shared/components/Gallerysection";
import NewsletterSection from "@/shared/components/Newsletter";
import type { CategoryTemplateProps } from "./types";

export default function EducationTemplate({ data }: CategoryTemplateProps) {
  const sections = data?.sections ?? [];

  const heroSection = sections.find((s) => s.sectionType === "HERO");
  const highlightsSection = sections.find(
    (s) => s.sectionType === "FEATURES" && s.layout !== "STEPS",
  );
  const storySections = sections.filter((s) => s.sectionType === "CONTENT");
  const statsSection = sections.find((s) => s.sectionType === "STATS");
  const gallerySection = sections.find((s) => s.sectionType === "GALLERY");

  // Fallbacks based on Adarsha Academy KRS default design
  const heroHeading = heroSection?.title || data?.name || "Adarsha Academy";
  const heroDesc =
    heroSection?.description ||
    "Creating opportunities to learn, grow and build brighter futures for rural children and communities.";
  const heroImage =
    heroSection?.imageUrl || "/Rural Education/Frame 648 (7).png";
  const heroMobileImage =
    heroSection?.settings?.imageMobileUrl || "/Rural Education/Frame 695.png";

  const featureItems = highlightsSection?.items?.length
    ? highlightsSection.items.map((it) => ({
        icon: it.iconUrl || "/icons/mission.png",
        heading: it.title || "Highlight",
        description: it.description || "",
      }))
    : [
        {
          icon: "/icons/mission.png",
          heading: "Mission",
          description:
            "Providing quality primary education for children in rural communities.",
        },
        {
          icon: "/icons/benifit.png",
          heading: "Beneficiaries",
          description: "More than 380 students since 2010",
        },
      ];

  const story1 = storySections[0];
  const story2 = storySections[1];

  const statItems: StatItem[] = statsSection?.items?.length
    ? statsSection.items.map((it) => ({
        icon: it.iconUrl || "/icons/training-session.svg",
        value: it.value || "0",
        label: it.title || "",
      }))
    : [];

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

      {/* 2. School Highlights */}
      <FeatureHighlightSection
        label={data?.highlightLabel || highlightsSection?.label || "EDUCATION"}
        heading={data?.highlightHeading || highlightsSection?.title || heroHeading}
        description={
          data?.highlightDescription ||
          highlightsSection?.description ||
          "A rural private school providing education to children from villages in the vicinity of the Krishnarajasagara (KRS) Dam."
        }
        items={featureItems}
      />

      {/* 3. Story 1: Text left, Image right */}
      {(data?.story1Title || data?.story1ImageUrl || story1) && (
        <OpportunitiesSection
          heading={data?.story1Title || story1?.title || "Education in a Rural Setting"}
          descriptions={
            data?.story1Description
              ? data.story1Description.split("\n\n").filter(Boolean)
              : story1?.description
              ? story1.description.split("\n\n").filter(Boolean)
              : [
                  "The Adarsha Academy is a kindergarten through 8th grade rural private school providing full-time education to children from seven villages.",
                ]
          }
          image={data?.story1ImageUrl || story1?.imageUrl || "/Rural Education/Rectangle 51 (2).png"}
          imageAlt={data?.story1Title || story1?.title || "Education in a Rural Setting"}
          button={
            story1?.buttonLabel && story1?.buttonUrl
              ? {
                  label: story1.buttonLabel,
                  href: story1.buttonUrl,
                }
              : undefined
          }
        />
      )}

      {/* 4. Story 2: Image left, Text right + Action button */}
      {(data?.story2Title || data?.story2ImageUrl || story2) && (
        <StoryLeftImageSection
          heading={data?.story2Title || story2?.title || "Education for Rural Children"}
          descriptions={
            data?.story2Description
              ? data.story2Description.split("\n\n").filter(Boolean)
              : story2?.description
              ? story2.description.split("\n\n").filter(Boolean)
              : [
                  "Recognising the need for accessible education, IHDUA responded by establishing a kindergarten programme and developing a school for the community.",
                ]
          }
          image={data?.story2ImageUrl || story2?.imageUrl || "/Rural Education/Rectangle 51 (3).png"}
          imageAlt={data?.story2Title || story2?.title || "Education for Rural Children"}
          button={{
            label: data?.story2ButtonLabel || story2?.buttonLabel || "View Gallery",
            href: data?.story2ButtonUrl || story2?.buttonUrl || "/adarsha-academy-krs/gallery",
          }}
        />
      )}

      {/* 5. Stats Strip (If stats present) */}
      {statItems.length > 0 && <StatsStrip items={statItems} />}

      {/* 6. Photo Gallery Section (If photos configured) */}
      {gallerySection?.items && gallerySection.items.length > 0 && (
        <GallerySection
          heading={gallerySection.title || "Photo Gallery"}
          images={gallerySection.items.map((it) => ({
            src: it.iconUrl || "/Rural Education/Frame 648 (7).png",
            alt: it.title || "Gallery photo",
          }))}
        />
      )}

      {/* 7. Newsletter Subscribe */}
      <NewsletterSection />
    </main>
  );
}

