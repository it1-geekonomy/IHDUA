import HeroBanner from "@/shared/components/Herobanner";
import FeatureHighlightSection from "@/shared/components/Featurehighlightsection ";
import OpportunitiesSection from "@/shared/components/OpportunitiesSection";
import AdarshaStorySections from "@/domains/impact/education/components/AdarshaStorySections";
import NewsletterSection from "@/shared/components/Newsletter";
import {
  ADARSHA_HERO,
  ADARSHA_HIGHLIGHTS,
  ADARSHA_STORIES,
} from "@/domains/impact/education/constants/adarshaSchool";

export default function AdarshaAcademyPage() {
  return (
    <main className="w-full">
      <HeroBanner
        heading={ADARSHA_HERO.heading}
        description={ADARSHA_HERO.description}
        image={ADARSHA_HERO.image}
        imageMobile={ADARSHA_HERO.imageMobile}
        imageAlt={ADARSHA_HERO.imageAlt}
      />

      <FeatureHighlightSection
        label="EDUCATION"
        heading="Adarsha Academy"
        description="A rural private school providing education to children from villages in the vicinity of the Krishnarajasagara (KRS) Dam."
        items={[...ADARSHA_HIGHLIGHTS]}
      />

      <OpportunitiesSection
        heading={ADARSHA_STORIES.story1.title}
        descriptions={[...ADARSHA_STORIES.story1.paragraphs]}
        image={ADARSHA_STORIES.story1.image}
        imageAlt={ADARSHA_STORIES.story1.imageAlt}
        button={{
          label: ADARSHA_STORIES.story1.ctaText,
          href: ADARSHA_STORIES.story1.galleryHref,
        }}
      />

      <AdarshaStorySections />

      <NewsletterSection />
    </main>
  );
}