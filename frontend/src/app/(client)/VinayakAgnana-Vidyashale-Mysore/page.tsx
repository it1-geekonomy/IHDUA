import HeroBanner from "@/shared/components/Herobanner";
import FeatureHighlightSection from "@/shared/components/Featurehighlightsection";
import SchoolStorySections from "@/domains/impact/education/components/SchoolStorySections";
import SchoolStatsSection from "@/domains/impact/education/components/SchoolStatsSection";
import NewsletterSection from "@/shared/components/Newsletter";
import { VINAYAKA_HERO, VINAYAKA_HEADER } from "@/domains/impact/education/constants/vinayakaSchool";

export default function VinayakAgnanaVidyashalePage() {
  return (
    <main className="w-full">
      <HeroBanner
        heading={VINAYAKA_HERO.heading}
        description={VINAYAKA_HERO.description}
        image={VINAYAKA_HERO.image}
        imageMobile={VINAYAKA_HERO.imageMobile}
        imageAlt={VINAYAKA_HERO.imageAlt}
      />

      <FeatureHighlightSection
        label={VINAYAKA_HEADER.eyebrow}
        heading={VINAYAKA_HEADER.title}
        description={VINAYAKA_HEADER.description}
        button={{ label: VINAYAKA_HEADER.buttonText, href: VINAYAKA_HEADER.websiteUrl, external: true }}
        items={[...VINAYAKA_HEADER.highlights]}
      />

      <SchoolStorySections />
      <SchoolStatsSection />
      <NewsletterSection />
    </main>
  );
}